---
title: "SIR Mobility Metapopulation Models: Designing an Epidemic Model"
date: 2021-01-30T12:00:00+00:00
description: "2021 Science Fair Submission"
author: "Michael Menezes"
tags: ["Code", "Research"]
theme: "light"
featured: true
cover: "../../../assets/images/science_fair_2021.jpg"
---
![SIR model with two communities](/assets/images/science_fair_2021.jpg)

<!-- Descriptive paragraph of project -->
Over the past century, there has been a continual increase in the probability of pandemics as a result of heightened global travel and urbanization. These pandemics have sever repercussions which decrease the labor force, amplify social tensions, and augment partisanship. In order to concentrate mitigation efforts, accurate epidemic forecasts are essential. In particular to this study, metapopulation models are of interest as they incorporate how individuals travel between communities providing a deeper understanding of how epidemics spread. 

In response to the need to create a more accurate model, potential models were rapidly tested in Excel. These models explored manipulated versions of the binomial and geometric models and their application to infectious modeling. In the end, the model that used a fixed period, rather than rates, for when individuals returned home was chosen as the proposed model. The effectiveness of the proposed and established models was calculated via the error of the models with a custom simulator and with COVID-19 data in the USA. The simulator, coded in java, utilized a nondeterministic approach to simulate travel between communities. The COVID-19 data was stratified by state so that the 50 states acted as the 50 communities in the models.

Matched pairs t-tests over the mean squared and mean absolute errors suggested that there was no significant difference between the designed models. Although the proposed did not outperform the established, the converse is also true. These results open another avenue of investigation and provide insight that may help with other mass-action differentials.
<!-- 
# What I did

# What I used

# Challenges -->

# Recognitions

Second place in the senior division at the Science and Engineering Fair of Houston. Advanced to the Texas Science and Engineering Fair.