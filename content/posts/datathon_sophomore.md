---
title: "Rice Datathon 2024: Oil Production Prediction"
date: 2024-01-20T12:00:00+00:00
description: "Award-winning portfolio featuring machine learning models that predict peak oil production alongside data and model visualizations."
author: "Sanya Garg, Surina Kishinchandani, Michael Menezes, Marko Tanevski"
tags: ["Code", "Datathon", "Data Science", "Machine Learning", "Award-Winning"]
theme: "light"
featured: true
cover: "../../../assets/images/datathon_2024.png"
---
![Rice datathon splash screen](/assets/images/datathon_2024.png)

Link to [DEVPOST](https://devpost.com/software/super-models-squared-chevron-track).

## Inspiration
Oil is ubiquitous. From the plastics used in smartphones to the gas that keeps our homes warm, oil drives America moving forward. Living in Houston, a major oil center, we understand the importance of oil in daily life. We took on the Chevron track to investigate how oil well characteristics can help predict peak production enabling oil companies to make informed decisions and run more efficiently. 

## What it does
Given a vector of oil well characteristics, our project explored the use of three types of machine learning models to predict peak oil production. 

## How we built it
**Parameter significance:** Using a correlation matrix, scatterplots, and box charts, we determined relative relevance towards predicting peak production.  

**Feature engineering:** We utilized the meaning of features to create new features like surface-to-bottom-distance, surface-to-bottom-angle, and neighboring-wells. These features ended up being key to improving the performance of our models. In addition to making new features, we also removed redundant features like proppant_to_frac_fluid_ratio which our models could compute on their own if helpful to improving performance. 

**Formatting:** To make the dataset suitable for our models, we converted categorical variables to one-hot encodings and also added a category for variables with missing data.  

**Training:** We wrote code to train our models efficiently by exploiting the GPUs and taking the burden off the CPU.  

**Evaluate:** We split up our dataset into three parts: a training set, a testing set, and a validation set. Using RMSE to evaluate the performance of the models, the Deep Neural Net had a performance of 111.5 on the training set and 106.8 on the test set; the Boosted Trees had 80.7 and 114.0; and Random Forests had 47.4 and 99.2.  

**Validate:** The validation set helped us choose hyperparameters for our models.

## Challenges we ran into
We initially developed three separate models: a random forest, deep neural network, and a gradient boosting regressor. At first, it was unclear which of these three models would minimize our error -- our initial data seemed to experience similar, large rooted MSEs. However, after testing our cleaned and training data extensively each of the three models, we concluded that the random forest model produced the lowest RMSE. 

## Accomplishments that we're proud of
We put a lot of effort into our project and are proud of our work. In particular, our data exploration and feature engineering take center focus. Our work on creating features, like toe angle, which were actually helpful for improving model losses was especially exciting. We were also happy with our visualizations that used a color-blind-friendly color pallet and layout to be easy to interpret. 

## What we learned
Over the course of the competitions, we encountered several challenges and learned a lot. We learned that real-world data can be sparse, and it is often important to understand the meaning of features rather than blindly throwing statistical techniques at the data. While interpolating values, saw the dangers of interpolating spatial data as this can morph the data into representing impossible situations.

## What's next for Super Models Squared
We hope that our work can contribute to making energy more affordable and reliable. In the future, we would like to apply our skills to solving problems and developing models that help pave the way for a more energy-efficient future.