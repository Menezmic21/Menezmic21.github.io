---
title: "A Slick Model: Modeling the Dispersion of Oil Slicks in the Ocean"
date: 2019-01-30T12:00:00+00:00
description: "2019 Science Fair Submission"
author: "Michael Menezes"
tags: ["Research"]
theme: "light"
featured: true
cover: "../../../assets/images/science_fair_2019.jpg"
---
![SIR model with two communities](/assets/images/science_fair_2019.jpg)

Link to [PAPER](/assets/text/science_fair_2019_technical_paper.pdf).

<!-- Descriptive paragraph of project -->
Oil spills cause millions of dollars in damages and destroy habitats. These repercussions highlight the need to contain oil spills quickly. Oil dispersion models are a set of procedures that model the dispersion of spills. Though oil dispersion models currently exist, these models require a lot of computational power. This project proposed a simple mathematical model to represent the dispersion of oil slicks.

To reduce computation, two techniques were used: the model tracked only the eight cardinal points, and only one set of ocean currents was applied to those points. The initial shape of the spill was approximated to be a circle of a five meter radius. The set of vectors used for the duration of the spill was then estimated. Once the velocity vectors were calculated, they were applied to the cardinal points on the boundary of the initial five meter circle, which extrapolated the points to new locations based on time. Assuming that the eight points were the outline of the spill, a line was fit through the points using three different methods: a piecewise linear fit, a circle fit, and a piecewise cubic fit. 

This model simulated three different historical spills and the results were compared to information provided by newspaper data. T-tests showed there was no significant difference between the designed models and the benchmark. Increasing the sample size will help to verify integrity.
<!-- 
# What I did

# What I used

# Challenges -->

# Recognitions

First in first-year math division at districts. Best technical paper in first-year division at districts. Second place in the senior division at the Science and Engineering Fair of Houston (SEFH). Special award recipient (Houston Museum of Natural Science internship). Recognized by Repsol. Advanced to the Texas Science and Engineering Fair.