# AgroNext

AgroNext is a livestock health management platform designed to improve the efficiency and effectiveness of livestock care and monitoring. It leverages IoT, machine learning, and data analysis to assist farmers in tracking health metrics, insemination schedules, and daily tasks.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Figma Designs](#figma-designs)
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
- Visual health monitoring charts.

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

![System Architecture](AgroNext.drawio.png)

### Key Components
- **Health Tracking**: Tracks livestock health and provides visual insights.
- **Simulator**: Simulates cycle predictions using historical and real-time data.
- **RabbitMQ**: Manages asynchronous message queues for data communication.
- **Machine Learning Model**: Predicts estrous cycles for accurate insemination scheduling.
- **CowData**: Stores and processes livestock data for health and cycle tracking.

--

## Figma Designs

The user interface and experience for AgroNext are designed using Figma. Here are a few highlights:

- **Login Screen**:
  ![Login Screen](assets/login_screen.png)

- **Dashboard**:
  ![Dashboard](assets/dashboard.png)

For detailed designs, refer to the [Figma Link](#) (insert link here).

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

---


