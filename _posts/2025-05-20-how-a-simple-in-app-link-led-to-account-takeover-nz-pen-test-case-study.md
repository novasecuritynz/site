---
layout: page
title: "Full Account Takeover Through a Simple In-App Link Click"
date: 2025-05-20 09:30:00
description: Nova Security explains how a session-handling flaw in a widely used mobile app left accounts exposed, and why routine penetration testing remains critical for all organisations.
author: Ron Chan
tags: ["Mobile Security", "Cybersecurity", "Session Hijacking", "Penetration Testing"]
categories: [Technology]
bodyClass: blog-single
---

## Introduction

During a recent assessment, Nova Security identified a link handling flaw in a popular mobile application that allowed an attacker to steal a user’s session cookie and gain full control of the account. This article explains about this issue, the business risks it created, and the steps organisations can take to avoid similar exposures.

---

## The Vulnerability in Detail

### In-app message links: handy but comes with hidden risks

To streamline the browser login flow, many mobile apps adopt what we call a "session attachment" design. When a user clicks a link inside the app, it either generates an access token or automatically attaches existing authentication tokens to the Cookie header of the web request. This approach is handy, as it saves developers from having to integrate separate login flows like OAuth or SAML. But when things go wrong, this could bring security risks to end users.

Additionally, mobile apps with "session attachment" designs would restricts these "session attachment" to trusted domains only, for obvious reasons since user's session data should kept private and safe.

### What Went Wrong

- The application only accepted links matching `acme.com` or its subdomains.
- Validation was done locally using a regular expression. If a link passed the check, the app opened it in a special in-app browser with the user’s session attached, otherwise it used the default browser without any session data.
- Attackers registered lookalike domains with different root domains, such as `acme.ai`, that still passed the regex check.
- When a user clicked the crafted link, the app sent the session cookie along with the request to the attacker controlled server, allowing the attacker to fully impersonate the user.

---

## Business Impact

- **Account Takeover**: An attacker gains the same privileges as the victim, including access to personal data and sensitive personally identifiable information (PII).
- **Regulatory Exposure**: Under the New Zealand Privacy Act and similar laws in other jurisdictions, such breaches require mandatory reporting and may result in financial penalties.
- **Reputation Risk**: Customers may lose trust when a company’s security controls appear insufficient.

---

## Why Ongoing Penetration Testing Matters

Mobile ecosystems evolve rapidly, including new OS releases, SDK updates, and attack techniques surface every month. A one-off audit cannot keep pace with this change.

Regular, methodical penetration tests:

- Detect logic flaws that automated scanners overlook.
- Validate defences against practical, real-world attack vectors such as session hijacking.
- Provide evidence of due diligence to stakeholders and regulators.

---

## Closing Thoughts

Session-hijack vulnerabilities are both subtle and damaging. Addressing them before they are exploited is considerably less costly than reacting after the fact. We recommend that all organisations schedule periodic penetration testing to maintain a clear view of their security posture.

---

## Need an objective assessment of your system?
[Contact us](https://www.novasecurity.co.nz/contact/) for a tailored penetration testing engagement.
