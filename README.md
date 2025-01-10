# AgroNext

AgroNext is a livestock health management platform designed to improve the efficiency and effectiveness of livestock care and monitoring. It leverages IoT, machine learning, and data analysis to assist farmers in tracking health metrics, insemination schedules, and daily tasks.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [App Design](#app-design)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

AgroNext focuses on digitalizing livestock management and addressing key challenges in:
- **Health Monitoring**: Tracks and analyzes livestock health metrics.
- **Insemination Scheduling**: Ensures timely and accurate insemination.
- **Task Automation**: Manages daily livestock-related tasks.

By utilizing modern technologies like IoT sensors, RabbitMQ, and machine learning models, AgroNext enables farmers to make data-driven decisions for enhanced productivity and animal welfare.

---

## Features

### 1. Health Monitoring
- Tracks physical and behavioral health metrics.
- Provides visual health monitoring charts.

### 2. Livestock Management
- Manage animals, groups, and tasks through a streamlined interface.
- Record-keeping for breeding history and health events.

### 3. Insemination Scheduling
- Predicts the optimal time for insemination using machine learning.
- Monitors estrous cycles with real-time updates.

### 4. Task Management
- Add, view, and manage daily tasks and schedules.

---

## System Architecture

The following diagram outlines the system architecture of AgroNext:

![System Architecture](Images/AgroNext.drawio.png)

### Key Components
- **Health Tracking**: Tracks livestock health and provides visual insights.
- **Simulator**: Simulates cycle predictions using historical and real-time data.
- **RabbitMQ**: Manages asynchronous message queues for data communication.
- **Machine Learning Model**: Predicts estrous cycles for accurate insemination scheduling.
- **CowData**: Stores and processes livestock data for health and cycle tracking.

---

## App Design

The user interface and experience for AgroNext are designed using Figma. Below are the key screens:

### Login Flow

#### Splash Screen
![Splash Screen](Images/Spash_screen.png)

#### Language Selection
![Language Selection](Images/Language_Selection.png)

#### Login Screen
![Login Screen](Images/Log_In.png)

#### Register with Email
![Register with Email](Images/Register_With_Email.png)

#### Intro Screen
![Intro Screen](Images/Intro_Screen.png)

### Dashboard

#### Home Screen
![Dashboard](Images/Home_Screen.png)

### Health Monitoring

#### Cow Health Monitoring
![Cow Health Monitoring](Images/Health_Monitor_Cow.png)

#### Bull Health Monitoring
![Bull Health Monitoring](Images/Health_Monitor_Bull.png)

### Task Management

#### Daily Tasks
![Daily Tasks](Images/Daily_Tasks.png)

#### Add Tasks
![Add Tasks](Images/Add_Tasks.png)

#### Schedule Tasks
![Schedule Tasks](Images/Schedule_Tasks.png)

#### Manage Tasks
![Manage Tasks](Images/Manage_Tasks.png)

### Inseminaton Cycle Tracking

#### Update Cycle
![Update Cycle](Images/Update_Cycle.png)

#### History
![History](Images/History.png)

#### Upcoming Cycle Alert
![Upcoming Cycle Alert](Images/Upcoming_Cycle_Alert.png)

### Group Management

#### Add Animal
![Add Animal](Images/Add_Animal.png)

---

## Contributing

We welcome contributions to AgroNext! Here's how you can contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
3. Make your changes and commit:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-branch
   ```
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
