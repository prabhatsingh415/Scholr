# 🎓 Scholr — Modern Campus Management System
### Scalable Campus Solutions via Microservices Architecture

---

## 🏗️ System Design Overview
Scholr utilizes a microservices-based approach to decouple core academic logic from notification and background tasks.

<p align="center">
  <img width="1630" height="1011" alt="image" src="https://github.com/user-attachments/assets/bfbcf06b-7f36-4bd3-98b3-99784833e53c" />
</p>

- **Frontend:**
  - **Mobile App:** React Native (Android/iOS)
  - **Web Dashboard:** React JS
  - **State Management:** Zustand (Lightweight & Reactive)
- **Backend Services:** - **Spring Boot (Core):** Handles Authentication, User Profiles, and Academic logic.
  - **Go (Worker):** Dedicated Microservice for high-speed Email sending logic and background tasks.
- **Communication & Storage:**
  - **Database:** MySQL (Relational data & Transactional integrity).
  - **Message Broker:** Handles asynchronous communication between Spring Boot and Go.
  - **Caching:** Redis for session optimization and performance scaling.

---

## 📊 Database Schema (ERD)
The system follows a normalized relational structure in **MySQL** to manage complex student-faculty-course mappings.



---

## 🛠️ Implementation & Technical Stack
- **Auth:** Secure JWT-based authentication handled by the Spring Boot core.
- **Messaging:** Decoupled architecture where Spring Boot triggers events to the Go service via a Message Broker for non-blocking email delivery.
- **Speed:** Redis integration to ensure low-latency data retrieval for frequent profile and dashboard hits.
- **UI Architecture:** Optimized React/Native components with optimistic UI updates.

---

## 👥 Meet The Team
| Name | Role | Core Responsibility |
| :--- | :--- | :--- |
| **Prabhat Singh** | **Lead Developer** | Backend (Java/Go), DB Design & React Native App. |
| **Aditya** | **DevOps & Cloud** | Deployment, Dockerization & CI/CD Pipelines. |
| **Priyansh** | **Web Dev** | Building the Admin & Faculty Web Portal (React JS). |
| **Ravindra** | **UI/UX Designer** | Mobile & Web Interface design and User Journeys. |
| **Arvind** | **Documentation** | Technical Writing, API Specs & Project Reporting. |
| **Yash** | **Python (Future)** | Planned for Data Analytics & AI features (Post-MVP). |

---

## 🚀 Development Roadmap

### 🏁 Phase 1: MVP (Complete)
- [x] JWT Auth & Profile Management (Spring Boot).
- [x] Automated Email Logic (Go Service).
- [x] Core Database Architecture (MySQL).
- [x] Cross-Platform UI (Mobile + Web).

### ⏩ Next Features (The Roadmap)
- **🛡️ Dynamic QR Attendance:** Anti-proxy attendance marking using time-synced dynamic QR codes with geo-fencing to ensure students are physically present in the classroom.
- **💬 Real-time Campus Chat:** Integrated group chat rooms using WebSockets for seamless student-faculty communication.
- **📢 Real-time Notice Board:** Decoupled Notification Service using a Message Broker to broadcast campus-wide alerts with <500ms latency.
---
