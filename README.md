# 🏏 CricSphere – The Ultimate Cricket Destination

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.6-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active_Development-brightgreen?style=for-the-badge)

**CricSphere** is a modern, full-stack cricket analytics and information platform crafted to deliver a seamless, real-time experience for cricket fans. It offers **live scores**, **series schedules**, **player statistics**, **team details**, powerful **data analytics**, and a custom **Match Impact Score (MIS)** ranking model — all within a sleek, mobile-first, responsive Single Page Application (SPA).

---

## 🚀 Key Features

### 🏏 Live Score Dashboard
- Provides real-time score updates retrieved from external cricket data APIs.  
- Displays match status, team performance, run rates, partnerships, and quick score insights.  
- Auto-refreshing panels ensure a smooth, uninterrupted live viewing experience.

---

### 📅 Complete Cricket Ecosystem
- Upcoming series schedules, tours, and match lists.  
- Team squads with dynamically rendered **country flags**.  
- Individual player pages showing career statistics and performance metrics.  

---

## 🔒 Security Architecture

CricSphere uses a **fully stateless, token-based authentication system** built around JWT.

### Authentication Flow
- Users authenticate through secure credentials.  
- Spring Security validates identity using BCrypt hashing.  
- Upon successful login, users receive a **signed JWT** containing role & user details.  
- The frontend stores the JWT and attaches it to all protected API requests.

### Authorization Model
- Role-Based Access Control (RBAC) implemented across all sensitive endpoints.  
- Token validation ensures only authenticated users can access personalized pages.  
- Built-in protection against CSRF, unauthorized access, and token tampering.

This design ensures a highly secure, scalable, and sessionless architecture ideal for modern SPAs.

---

## 🎨 Modern UI/UX

The frontend is built with a strong focus on **speed**, **responsiveness**, and **visual clarity**.

### Design Highlights
- **Tailwind CSS** provides a flexible utility-first styling system.  
- **Framer Motion** adds smooth transitions, page animations, and UI interactions.  
- Fully responsive layout for mobile, tablet, and desktop viewing.  
- **Dark Mode** with system-level preference detection.  
- Toast-based notifications for seamless user interactions.

---

## ⚙️ Technology Stack

### 🧩 Backend Technologies
- **Java 17**  
- **Spring Boot 3.5.6** (REST APIs, DI, validation)  
- **Spring Security + JWT** (Authentication & Authorization)  
- **MySQL** (Primary relational database)  
- **Spring Data JPA** (ORM & Repository layer)  
- **RestTemplate** (External API communication)

---

### 🧩 Frontend Technologies
- **React.js (Vite)** – Fast SPA architecture  
- **Tailwind CSS** – Scalable UI design  
- **React Router DOM** – Client-side routing  
- **Axios** – REST API communication  
- **Framer Motion** – Elegant animations  
- **React Hot Toast** – Non-intrusive notifications  

---

## 🖼️ Application Screenshots

### Home & Live Score Views
| Homepage | Live Dashboard |
|:---:|:---:|
| ![](https://via.placeholder.com/400x200?text=Homepage+Screenshot) | ![](https://via.placeholder.com/400x200?text=Live+Score+Screenshot) |

### Player Analytics & Authentication
| Player Stats | Login Page |
|:---:|:---:|
| ![](https://via.placeholder.com/400x200?text=Player+Stats+Screenshot) | ![](https://via.placeholder.com/400x200?text=Login+Page+Screenshot) |

> Replace placeholder images with actual project screenshots when available.

---

## 📝 Purpose & Scope

CricSphere is designed as part of a **Java Full Stack Development curriculum**, serving both as a learning platform and as a real-world project implementation of:

- REST API development  
- Authentication systems  
- Analytical scoring algorithms  
- State management  
- Modern SPA development  
- Secure, scalable architecture  

Its goal is to provide an interactive, analytics-driven cricket experience.

---

<p align="center">Made with ❤️ by the CricSphere Team</p>
