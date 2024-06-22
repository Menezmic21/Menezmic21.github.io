---
title: "Rice Datathon 2023: Breast Cancer Equity"
date: 2023-01-29T12:00:00+00:00
description: "Award-winning portfolio featuring visualizations of mammography facilities in the US."
author: "Brandon Huang, Michael Menezes, Henry Pu, Albert Zhu"
tags: ["Code", "Datathon", "Data Science", "Award-Winning"]
theme: "light"
featured: true
cover: "../../../assets/images/datathon_2023.jpg"
---
![Rice datathon splash screen](/assets/images/datathon_2023.jpg)

Link to [DEVPOST](https://devpost.com/software/choropleth-maps-of-cancer-density-per-hospital-in-each-state).

## What it does and how we built it

We first cleaned the data given, focusing on the most recent population numbers from 2019, as well as limiting demographics to females, since they are the ones who receive mammograms, and limiting facility locations to the mainland 50 states. We then calculated the expected number of women who could be diagnosed with breast cancer in each state using incidence rates from an external dataset from the National Cancer Institute. Finally, we used various visualizations (scatterplot and choropleth maps) to model and analyze which states were in the most need of mammography facilities.

## Challenges we ran into

The specificity of the prompt compared to the generality of the census data made finding a meaningful interpretation difficult. Furthermore, our preliminary linear regression model had several weaknesses, and we needed to figure out ways to improve on it. Finally, we also had to learn how to integrate several new python libraries together in a short period of time.

## Accomplishments that we're proud of and what we've learned

We're proud of finding ways to successfully parse, visualize, and interpret large data sets. We learned how to use the pandas, folium, and matplotlib libraries which we had little to no experience with before, as well as prompt-relevant information about how some states have more mammography facilities than others despite having smaller at-risk populations.

## What's next

In the future, we could potentially consider more geographically specific population data, e.g. populations in the top ten largest cities of each state, rather than the entire state as a whole. We could also give a more nuanced analysis of mammography accessibility if our data had more parameters like race/ethnicity or income class.