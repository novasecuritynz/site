---
layout: page
title: "Delving into DeFi: Unveiling the Vulnerabilities of Price Manipulation in Smart Contracts"
date: 2024-06-13 11:21:29
description: At Nova Security, our team continually seeks to explore the depths of cutting-edge technologies. One such area that we have recently begun to explore is smart contracts, and we are eager to share our learnings with our professional community.
thumbnail: "../../assets/images/blogs/blog_image_3.webp"
author: Ron Chan
tags: ["DeFi", "Block Chain","Cybersecurity", "Penetration Testing"]
categories: [Technology, Agency]
bodyClass: blog-single
---


At Nova Security, our team continually seeks to explore the depths of cutting-edge technologies. One such area that we have recently begun to explore is smart contracts, and we are eager to share our learnings with our professional community. In doing so, we hope to increase understanding and foster better security practices. This article series aims to be a digestible yet comprehensive exploration of smart contract vulnerabilities, starting with an issue central to decentralized finance (DeFi) – price manipulation.

The price of an asset is pivotal in the DeFi universe. Consider the lending protocols, for instance, that allow you to deposit collateral, such as USDT or ETH, to facilitate a loan. For instance, you might deposit $100 worth of ETH to Compound, enabling you to borrow roughly $80 worth of USDT from the Compound asset pool. This process involves several steps - the protocol assesses your collateral's worth, determines how much you can borrow, and finally checks if the market value of the borrowed asset does not surpass 80% of the deposited collateral.

The key question, then, is how these protocols determine the market value of both the collateral and borrowed assets. This leads us to the core topic of this blog post. There are primarily three ways to determine this:

- On-chain market price
- M-of-N Reporters (e.g., Chainlink)
- Fixed-price

However, it's important to note that each of these methods has seen at least one security incident in the past, leading to significant losses.

In this post, we turn our attention to the on-chain market price oracle. A popular mechanism for determining on-chain market price is Uniswap, which operates on a fairly simple market mechanism. However, the simplicity of this system can be exploited to manipulate the spot market price of assets, leading to a concept known as spot price oracle manipulation.

Consider an example where a large amount of assets are swapped within the Uniswap pool. This could lead to a dramatic drop in the market price of an asset, which is an inherent risk of using the Uniswap asset ratio as the sole price reference.

Unfortunately, this type of price manipulation has led to several DeFi security incidents. A case in point is Pancake Bunny, where over $40M was stolen in May 2021 due to the protocol's reliance on the UniswapV2 pool assets ratio to price BUNNY. A simplified demonstration of this scenario provides a stark warning against relying on Uniswap's spot price or asset ratios as the only source of asset pricing.

However, the vulnerabilities of DeFi extend beyond this. In future posts, we'll delve deeper into more sophisticated attack vectors. We hope you find this series informative and helpful in navigating the complex landscape of DeFi. As always, we strive to maintain accuracy in our content and welcome any feedback to improve our offerings.

At Nova Security, we strive for the utmost accuracy in our content and always welcome feedback and suggestions for improvement. If you or your organization have any concerns or queries related to DeFi security, please do not hesitate to reach out to us. Our team of experts is ready to assist you in mitigating risks and securing your digital assets. We also provide consultation services tailored to your unique needs, offering comprehensive solutions to navigate the DeFi ecosystem safely.

Contact us today to fortify your defenses against the ever-evolving landscape of digital threats.