---
layout: page
title: "The 'S' in MCP Stands For Security - Part 2"
date: 2025-07-07 00:00:01
description: The new toy remote MCP sounds cool, but is it secure against old attack vectors? Nova investigates.
author: Ron Chan
tags: ['MCP', 'AI', 'LLM', 'Cybersecurity']
categories: [Software, Security]
bodyClass: blog-single
---

## Introduction
When Anthropic published their ["Remote MCP support in Claude Code"](https://www.anthropic.com/news/claude-code-remote-mcp) announcement and the blog post [The "S" in MCP Stands for Security](https://elenacross7.medium.com/%EF%B8%8F-the-s-in-mcp-stands-for-security-91407b33ed6b) by [Elena Cross](https://elenacross7.medium.com/), our team at Nova Security immediately noticed something worth investigating. On the surface, it looked like clean and easy, Claude connects with third party developer tools like Cloudflare through a new layer called MCP. But under the hood, it felt familiar, almost _too_ familiar.

We dug deeper into how these integrations actually work. How does Claude know which tool to connect with? How do vendors know which user’s data to fetch? And who’s responsible for securing that whole exchange?

As we started going through the MCP integration ourselves, we saw that the authorisation layer relied on OAuth 2.1, something most devs _think_ they understand. But do they really?

After several days of poking around the OAuth 2.1 flows some integrations, we discovered some pitfalls that developers tend to make:

1. No validation on redirect_uri → arbitrary open redirects and potential XSS
2. No CSRF protection in OAuth endpoints
3. Lack of scheme validation on website_uri → XSS risk
4. Unchecked client name spoofing → easy social engineering

---
## MCP Workflow In a Nutshell

It became clear that many of these issues stem from lack of full understanding of how OAuth 2.1 _should_ work. So before diving into the details of each flaw, let’s walk through the fundamentals: what OAuth 2.1 actually is, how MCP ties into it, and what a secure remote integration is supposed to look like.

<br>
### Quick Recap On OAuth 2.1 in 60 secs
OAuth 2.1 is a more secure version of OAuth 2.0. It lets users grant third party apps access to their data without sharing passwords by redirecting them to an authorization server (like Google or Microsoft), approving access, and then passing back a code that the app can exchange for access tokens.

What’s new in 2.1?
1. **No more implicit flow** – avoids token leaks in URLs.
2. **PKCE required** – protects against CSRF and code interception.
3. **Strict redirect_uri matching** – stops open redirects and authorization code leak.

In short, OAuth 2.1 keeps the core flow but takes away the dangerous parts.

<br>
### Remote MCP Authorisation Flow
In Claude Code, the authorisation flow begins when a user runs the following command:

```
claude mcp add --transport sse example-server https://mcp.example.com/sse
```

Then, within a Claude Code session, the user types `/mcp`, which triggers a browser window to open and initiate the OAuth flow. The URL looks like this:

```
https://mcp.example.com/authorize
?response_type=code
&client_id=63RRN8KWJIpRggMb
&code_challenge=eS-D3KX21-C1Zo1FMmtkIi3kRnOBLXKDNzsDcYqa9LE\
&code_challenge_method=S256
&redirect_uri=http%3A%2F%2Flocalhost%3A58766%2Fcallback
&state=i8c5x6oPKwg8D2czvXY2xguyTM_Htb1KKvIP5TvKUxk
```

At this point, the user is presented with an OAuth screen asking them to approve access for the CLI OAuth client as shown below.  

<div style="text-align: center; margin: 20px 0;">
  <img src="{{ site.baseurl }}/assets/images/blogs/sample_oauth.png" alt="OAuth Authorisation Screen" style="max-width: 50%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
</div>

### Dual Consent Flow
After clicking “Approve,” a second OAuth screen appears, and this time from the vendor's official authorisation server. Now the user is granting access to an OAuth client like:

> Official ACME MCP Server

The user must approve again.

Once approved, an authorisation code is issued to the MCP server. The MCP server then redirects the user back to the original redirect URI with the code attached, which typically is the CLI's local callback endpoint, like so:

```
http://localhost:58766/callback?code=xxxx&state=xxxx
```

<br>
### So… Who Controls What?

You might be wondering:
- Who tells the MCP server where to redirect the code? 
- Where does the “Claude Code” client name come from?
- Can anyone register one?

You've asked some good questions and understanding how these pieces work together is the key to improve security. And this leads to the next section.

---
## What’s Going On Behind the MCP OAuth Flow?

When a user runs `/mcp` in Claude Code and provides a URL like `https://mcp.example.com/sse`, a behind-the-scenes discovery process starts. The client starts by scanning for these two well-known endpoints:
- **/.well-known/oauth-protected-resource**
- **/.well-known/oauth-authorization-server**
    

It expects JSON responses containing OAuth metadata fields like `registration_endpoint`, `authorization_endpoint`, and `token_endpoint`. If neither endpoint returns a valid response, the MCP server is assumed to be unauthenticated and treated as public (which is out of scope for this post). Let’s focus on the case where a valid response is returned.

Here’s an example OAuth metadata response:
```
{
  .....,
  "authorization_endpoint": "https://mcp.example.com/authorize",
  "token_endpoint": "https://mcp.example.com/token",
  "registration_endpoint": "https://mcp.example.com/register",
  .....
}
```
<br>
### Dynamic Client Registration
The client uses the `registration_endpoint` to register itself by sending a POST request like this:

```
{
  "redirect_uris": ["https://www.novasecurity.co.nz"],
  ......
  "client_name": "MCP Client",
  "client_uri": "https://www.novasecurity.co.nz"
}
```

If registration succeeds, the server returns a `client_id` and related metadata:

```
{
  "client_id": "68ZMbZBZ3gs2A1TY",
  "redirect_uris": ["https://www.novasecurity.co.nz"],
  "client_name": "MCP Browser Client",
  "client_uri": "https://www.novasecurity.co.nz",
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code"],
  "token_endpoint_auth_method": "none",
  "registration_client_uri": "/register/68ZMbZBZ3gs2A1TY",
  "client_id_issued_at": 1750736996
}
```

<br>
### Triggering the OAuth Flow
Next, the client redirects the user to the `authorization_endpoint`, embedding the newly issued `client_id`:

```
https://mcp.example.com/authorize?client_id=68ZMbZBZ3gs2A1TY\
&redirect_uri=https://www.novasecurity.co.nz\
&challenge_method=S256\
&challenge_code=abc123\
&state=doesntmatter
```

This corresponds to the **first** OAuth screen the user sees, the one showing "Claude Code" as the client name. This flow ensures the authorisation server knows where to send the resulting `authorization_code`.

<br>
### The Second OAuth Screen: Vendor Authorisation
Once the initial client (e.g., Claude Code) is authorised, the user is immediately prompted with a **second OAuth screen**. And this time it is issued by the official vendor’s authorisation server. This flow asks the user to grant access to the vendor’s own registered MCP OAuth client. The purpose here is to allow the MCP server (run by the vendor) to retrieve or act on the user's data on their platform. This client typically has a more official-y name like:

> Official ACME MCP Integration

The user clicks "Approve" again, and that first authorisation code is passed back to the vendor's MCP server, which then the MCP server will issue another authorisation code to the redirect_uri defined from previous step.

<br>
### Exchanging the Code for a Token

Once the local redirect URI (e.g., `http://localhost`) receives the authorisation code, the client sends a POST request to the `token_endpoint`:

```
POST /token HTTP/1.1
Host: mcp.example.com
Content-Type: application/x-www-form-urlencoded

client_id=VPAM0dlNM6x7uPcM&
....
code=aRQl2EBEQpsKuLAA%3AO45WMaijWFf3SlSZBSkuH44XR6jzskw4&
....
```

If successful, the server returns a response like:

```
{
  "access_token": "login:aRQl2EBEQpsKuLAA:m6kY2aLDZwK6T0W3vAGeSEGfFbY10iiy",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "login:aRQl2EBEQpsKuLAA:k17CPqNcOy6vH0H2CtVW9i8eDesomN5g",
  "scope": ""
}
```
---
## Top Five Pitfalls Developers Tend to Make
Now that we know what’s happening under the hood, let’s look at the common pitfalls developers make when implementing this flow.

### 1 - Lack of rate limiting on dynamic client registration

**What we saw**   

The `/register` endpoint creates a fresh `client_id` on every call. No API key, captcha, or IP checks. From a single IP we hit ~10 000 registrations/min.

**Why it matters**

Log/DB bloat → your `oauth_clients` table will get expanded pretty quick, eventually DoS‑ing the server.

**Fix**   
- Start by rate‑limiting by IP.
- Consider putting a hard quota on daily registrations.

---

### 2 - CSRF‑able first consent screen

**What we saw**

The initial OAuth page (e.g. `mcp.example.com`) doesn't come with any CSRF check since this page is usually is available publicly.

**Why it matters**

While having this "CSRF" doesn't necessarily mean this is a valid vulnerability, since this page is publicly available, making the CSRF essentially useless. But when this is chained with the next pitfall, things can go bad pretty quickly.

**Fix**
- Make sure your MCP OAuth page is only available to authenticated users.
- Implement Require random `state` + `PKCE` and verify both.
- Add explicit CSRF token to the consent form.

---

### 3 - Silent re‑authorisation of the official client

**What we saw**

If the user once approved the vendor’s _official_ client, step‑two consent is silently skipped on future flows.

**Why it matters**

When combine with the previous pitfall, it is possible to perform a full OAuth takeover: user visits a malicious page → CSRF fires → OAuth code lands at attacker’s `redirect_uri`.

**Fix**   
- Always force re‑consent whenever user goes throw a OAuth flow.

---

### 4 - Loose `redirect_uri` validation on registration

**What we saw**

There's no or little validation on `redirect_uri` when client is registring for the OAuth application. And it allows the value to start with `javascript:` or arbitrary domains.

**Why it matters**

- **Open redirect** → attacker intercepts OAuth code via their domain.
- **XSS** when the OAuth page redirection is javascript based.

**Fix**   
- Implement strict scheme restrictions such that it has to start with `http://` or `https://` 
- Consider implement an allowlist for verified domains.

---

### 5 - Unsanitised `website_uri` / `client_name`

**What we saw**
Consent dialog reflects these strings directly. Attackers could either use `javascript:alert(document.domain)` to trigger XSS. Or they can create exact match names for the official MCP OAuth client to impersonate the brand.

**Why it matters**
- Stored XSS in every subsequent consent screen.
- Brand impersonation → higher social‑engineering success.

**Fix**   
- Implement strict scheme restrictions such that it has to start with `http://` or `https://` 
- Run homograph detection, and optionally require manual review for public clients.

---

## Four Ways to Protect Your MCP Server

### 1 - Double-check consent every time

**Why it matters**   

The assumption that “the user has already approved this app” can backfire, especially if combined with CSRF or scope widening. If re-approval is silently skipped, malicious flows can execute without user awareness.

**What to do**
- Always for re-approval, and optionally require fresh login or 2FA before suspicious frequent OAuth attempts.

---

### 2 - Rate-limit `/register` – throttle rogue clients

**Why it matters**   

Without protections, the dynamic client registration endpoint becomes an attack surface. Attackers can DoS your infra, bloats logs, or generate thousands of impersonating clients.

**What to do**
- Apply rate limits per IP
- Optionally set hard quotas (e.g. max 50 new clients/day)
- Log or even implement regex limitation on `client_name`and prevent impersonation patterns

---

### 3 - Scheme allowlist – only `https` for both redirect_uri and website_uri (localhost in dev)

**Why it matters**

Allowing arbitrary schemes like `javascript:` lets attackers introduce XSS to users.

**What to do**
- Make sure the value always start with `https://` or `http://` on all production URIs.

---

### 4 - Sanitise display strings – don’t trust `client_name`, `website_uri`

**Why it matters**

These fields appear in OAuth consent dialogs. If unescaped or unverified, they open the door to stored XSS and phishing through brand impersonation.

**What to do**
- HTML-escape `client_name` and `website_uri` before display
- Check for unicode tricks like homoglyphs (e.g. `góоgle.com`)
- Flag suspicious names (e.g. containing “support”, “helpdesk”) for manual review

---
## Don’t Want to Test Your MCP Setup Manually?
To speed things up, we built a CLI tool that automates this whole discovery and vulnerability scanning process. It checks for .well-known endpoints, tests for insecure dynamic client registration, weak redirect URI validation, XSS in website_uri, and even CSRF flow issues (requires manual review).

### Install
```
pip install remote-mcp-scanner
```

### Run
```
mcp-scanner https://mcp.example.com
```

The tool is open-source on GitHub [here](https://github.com/novasecuritynz/remote-mcp-scanner).

---
## Final Words

That’s it from us — just some things we thought were worth a closer look. Hope you've learned something new after this.
Not sure if your remote MCP setup is solid? 
Drop us a note or book a quick call — we’re always up for taking a look and seeing if anything stands out.

Email us: [info@novasecurity.co.nz](mailto:info@novasecurity.co.nz)  
Or book a quick call with us [here](https://www.novasecurity.co.nz/contact/)!
