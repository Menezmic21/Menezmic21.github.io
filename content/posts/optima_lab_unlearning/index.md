---
title: "OptimaLab: Machine Unlearning"
date: 2024-01-20T12:00:00+00:00
description: "Submission to NeurIPS 2023 Machine Unlearning Challenge co-hosted by Google"
author: "Michael Menezes, Hamza Shili"
tags: ["Code", "Machine Learning", "Research"]
theme: "light"
featured: true
cover: "/machine_unlearning.jpg"
---
![Machine unlearning kaggle competition](/machine_unlearning.jpg)

Link to [KAGGLE](https://www.kaggle.com/menezmic/machine-unlearning-competition-submission).

<!-- Descriptive paragraph of project -->
>Deep learning has recently driven tremendous progress in a wide array of applications, ranging from realistic image generation and impressive retrieval systems to language models that can hold human-like conversations. While this progress is very exciting, the widespread use of deep neural network models requires caution: researchers should seek to develop AI technologies responsibly by understanding and mitigating potential risks, such as the propagation and amplification of unfair biases and protecting user privacy.

>This competition, which is has been selected for the NeurIPS'23 competition track, considers a realistic scenario in which an age predictor has been trained on face images, and, after training, a certain subset of the training images must be forgotten to protect the privacy or rights of the individuals concerned.

# What I did

I competed in the NeurIPS 2023 Machine Unlearning Challenge co-hosted by Google. To build my submission, I surveyed and implemented innovative techniques such as SCRUB (a distillation-based unlearning technique) and metrics like MIA accuracy. I also incorporated noise injection to accelerate fine-tuning and improve generalization.

# What I used

The submission notebook used Pandas, Plotly, and Scipy for data analysis.

# Challenges

The greatest challenge with this challenge was the lack of literature surrounding the topic. This makes sense given Google and NeurIPS cohosted this challenge to find the most effective technique for machine unlearning (techniques for removing a training example's influence from a model without impacting model performance). To counter the lack of literature, I read up on papers from surrounding fields like differential privacy too. This challenge had a focus on rapid prototyping with me throwing tricks at the wall and seeing what stuck. 