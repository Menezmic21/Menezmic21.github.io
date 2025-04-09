---
title: "Texas Torque: Armageddon"
date: 2022-05-01T12:00:00+00:00
description: "FRC robot for the 2018 game Power Up"
author: "Texas Torque, Michael Menezes"
tags: ["Robotics", "Code", "Machine Learning"]
theme: "light"
featured: true
cover: "/robotics_armageddon.jpg"
---
![Armageddon](/robotics_armageddon.jpg)

Link to [BLUE ALLIANCE](https://www.thebluealliance.com/team/1477/2018).

<!-- Descriptive paragraph of project -->
{{< paige/youtube "HZbdwYiCY74" >}}

# What I did

After years of disuse and being scrapped for parts, the team decided to restore the robot. I updated the code of the robot. This involved configuring the Xbox controllers to run motors/actuate pneumatics; tuning Proportional-Integral-Derivative (PID) control loops; and adding cameras to implement computer vision. In addition, despite the drive train on Armageddon being an H-drive, I was able to simulate a swerve drive using an Inertial Measurement Unit. 

{{< paige/image width="60vmin" src="/operator_controller.png" >}}
{{< paige/image width="60vmin" src="/driver_controller.png" >}}

# What I used

The robot's control systems were programmed using WPILib in Java. The computer vision implemented a You-Only-Look-Once (YOLO) model with OpenCV in Python.

# Challenges

With a renovation project, the main challenge is getting parts for the fixes and figuring out what the original designer's intent was. By studying their design and making inferences, we were able to piece together what we envisioned for the renovated robot.

# Robot teaser

{{< paige/youtube "H94zhIZv0hg" >}}