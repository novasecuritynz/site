---
layout: page
title: "How a Simple In-App Link Click Led to Full Account Takeover from New Zealand Nova Security"
date: 2025-05-20 09:30:00
description: Nova Security explains how a session-handling flaw in a widely used mobile app left accounts exposed, and why routine penetration testing remains critical for all organisations.
thumbnail: "../../assets/images/blogs/mobile_session_hijack.webp"
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

In order to make user's web browser login flow seamless, many mobile apps opt-in somthing that we call "session attachment" design, that when a user clicks a link inside the mobile app, the mobile app would either generate an access token or directly attach any authentication tokens to the Cookies header to the web requests. This is handy because this would save developers time to integrate with a new login flow such as OAuth or SAML. 

Typically, the app restricts these links to trusted domains owned by the service provider.

### What Went Wrong

- The application accepted only links that matched `acme.com` or its sub-domains.
- Validation relied solely on a regular-expression check
- Attackers registered visually similar domains such as `acme.ai`, which satisfied the regex test.
- When a user tapped the crafted link, the app dutifully attached the active session cookie to the outbound request, handing control to the attacker.

A regular expression alone cannot guarantee domain authenticity. Without added checks, session data becomes an easy target.

---

## Business Impact

- **Account Takeover**: An attacker acquires the same privileges as the victim—viewing personal data, initiating transactions, or changing security settings.
- **Regulatory Exposure**: Under the New Zealand Privacy Act, such breaches require mandatory reporting and may incur penalties.
- **Reputation Risk**: Customers can lose confidence quickly when security controls appear brittle.

---

## Why Ongoing Penetration Testing Matters

Mobile ecosystems evolve rapidly—new OS releases, SDK updates, and attack techniques surface every month. A one-off audit cannot keep pace with this change.

Regular, methodical penetration tests:

- Detect logic flaws that automated scanners overlook.
- Validate defences against practical, real-world attack vectors such as session hijacking.
- Provide evidence of due diligence to stakeholders and regulators.

---

## Closing Thoughts

Session-hijack vulnerabilities are both subtle and damaging. Addressing them before they are exploited is considerably less costly than reacting after the fact. We recommend that all organisations schedule periodic penetration testing to maintain a clear view of their security posture.

---

**Need an objective assessment of your mobile or web application?**  
Contact **Nova Security NZ** for a tailored penetration-testing engagement.
