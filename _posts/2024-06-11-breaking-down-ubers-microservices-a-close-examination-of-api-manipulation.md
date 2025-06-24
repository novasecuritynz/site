---
layout: page
title: "Breaking Down Uber's Microservices: A Close Examination of API Manipulation"
date: 2024-06-10 11:21:29
description: At Nova Security, we continuously analyse and assess the cybersecurity landscapes of diverse industries, aiming to uncover potential vulnerabilities and provide strategic solutions.
author: Ron Chan
tags: ['Uber', 'Bug Bounty', 'Cybersecurity']
categories: [Software, Innovation]
bodyClass: blog-single
---
## Introduction

At Nova Security, we continuously analyse and assess the cybersecurity landscapes of diverse industries, aiming to uncover potential vulnerabilities and provide strategic solutions. One such recent deep-dive led us to Uber's intricate microservice architecture. We offer here a detailed investigation and insights into how a loophole in Uber's system could potentially be exploited.

---

## Description
Uber's system architecture rests on a foundation of numerous microservices, interacting via REST APIs. For example, to fetch a driver's past trip history, a specific API call is made. The endpoint resembles the following: `https://localhost:1234/partner/*PARTNER_UUID*/trips?from=2018-01-01&to=2019-01-01`. 

While such actions occur backend, without traditional user-facing security measures like IDOR attack prevention, they were initially thought to be secure due to their predefined and user-inaccessible nature.

Our curiosity was piqued in early 2018 by a unique endpoint within partners.uber.com, designed to retrieve drivers' monthly statements. The response from this request returned a user's access token and performed the internal GET request without requiring x-auth-header or authorization headers. This suggested a potential for misuse, whereby modifying the user UUID in the request could expose the victim's access token.

Our team then sought an endpoint that would allow:

- Parameter passing to the internal GET request.
- Encoded character passing to the internal GET request to bypass unnecessary queries.
- Full response viewing.

The desired features were eventually discovered in an endpoint similar to the initial monthly statement retrieval request. This endpoint allowed path escape using `../`, providing a route to bypass the initially defined path and craft a custom request.

This vulnerability allowed us to craft a potential exploit which could return a victim's access token in response by merely changing the VICTIM_UUID in the request, provided as follows:

`https://partners.uber.com/p3/money/statements/view/15327ef1-2acc-e468-e17a-576a7d12312%2f..%2f..%2f..%2Fv1%2Fpartners%2FVICTIM_UUID%2Fstatements%2Fcurrent%3Fearnings_structure_type%3D%26locale%3Den%26user_id%3DVICTIM_UUID%23`

Thus, this exploration shed light on a potential vulnerability in Uber's system, where any user’s access token could be obtained by simply modifying the *VICTIM_UUID* in the request.

---

## Closing Thoughts

In the ever-evolving world of cybersecurity, it's essential to remain vigilant and prepared. This exploration into Uber's microservice API architecture underscores the need for thorough vulnerability assessments and strategic cybersecurity solutions.

---

## Need an objective assessment of your system?
[Contact us](https://www.novasecurity.co.nz/contact/) for a tailored penetration testing engagement.