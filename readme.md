🌐 Available languages: [Spanish](README.es.md)

# 🎬 Cinema Reservation System

## Imagen

This is a cinema ticket reservation app that allows users to browse available showtimes, select movies, and choose their desired seats. Afterward, they can proceed with a simulated online payment and receive their tickets, with options for viewing and downloading them.
The project is designed to simulate a real-world cinema booking system, applying modern fullstack development technologies in a complete flow covering frontend, backend, and data persistence

live demo(link)

## ✨ Main Features

- 🎞️ **Movie Catalog**: View currently showing and upcoming movies with details like synopsis, duration, and available showtimes

- 🗓️ **Daily Showtimes**: Browse all available showtimes for a specific date. Select a show and continue to seat reservation

- 🪑 **Interactive Seat Selection**: Choose available seats directly from a visual seat map. Seats are temporarily held and released if the reservation is not completed in time

- ⏱️ **Real-time Seat Selection**: The system updates seat availability live, showing which ones are already reserved and temporarily locking those currently being selected

- ❗ **User Reservation Limits**: Each user can reserve up to 5 seats per session and 10 per show to ensure fair availability

- 💳 **Card Validation and Payment Simulation**: Validates the entered card number to ensure correct formatting before processing. Although it doesn’t connect to a real payment gateway, it simulates a full checkout experience for realism.

  #### ⚠️ Important Notice: Do not enter real credit card information or other sensitive personal data. This app simulates the payment process using fictional card numbers

  | Card Number                | Result                    |
  | -------------------------- | ------------------------- |
  | XXXX-XXXX-XXXX-XXX (0 a 5) | Transaction Successful ✅ |
  | XXXX-XXXX-XXXX-XXX (6 a 9) | Transaction Declined 🚫   |

- 🎟️📩 **Downloadable or Emailed Tickets**: Tickets can be viewed and downloaded as PDF files or sent directly to the desired email address

- 📱 **Responsive Interface**: The app features a responsive design that ensures smooth experiences on both mobile and desktop devices

## 🔑 Key Concepts

#### Backend

- Project split into Frontend and Backend development
- Use of RESTful APIs and third-party APIs, request validation, and custom middlewares
- Modular structure with route, controller, and validator separation
- Use of WebSockets for real-time seat reservation updates
- Relational database modeling, entity relationships, queries, and transactions
- PDF generation and email sending
- Environment variable management via .env files

#### Frontend

- SPA with multiple pages using React Router, route protection, and error boundaries
- Component handling using MUI with conditional styles
- Use of hooks, custom hooks, state management, effects, context, and conditional rendering
- Form validation
- Responsive design with CSS and media query hooks

## 🔧Tech Stack

The main tools used in the project

| Area                | Libraries                                                                                                                                                                                                                                                            |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **🧱 Frontend**     | - Typescript and Vite<br>- React<br> - MUI: Component library<br> - React Router<br> - React Hot Toast: Cool Notifications<br> - Socket.IO client: Real-time seat updates<br>                                                                                        |
| **🏗️ Backend**      | - Typescript<br> - NodeJS and Express<br> - Express Validator: Request validation<br> - JWT y Bcrypt: User authentication<br> - Socket.IO: Real-time seat updates<br> - Multer y Nodemiler: Send emails with attached tickets<br> - node-postgres: DB connection<br> |
| **🗄️Base de Datos** | - PostgreSQL<br>                                                                                                                                                                                                                                                     |

## 🔌 APIs Used

- 💳 **Credit card validation API**: Used to validate credit card numbers and the issuing entity. https://algobook.info/docs/credit-card-api
- 🕵️‍♂️ **Random user generator**: Used to automatically generate fake users. Ideal for testing or demos without needing real personal data like email addresses. https://randomuser.me/

## Database Structure

The database consists of several related tables to manage movie reservations and screening logistics. It is designed to be scalable, allowing the addition of new auditoriums, showtimes, and upcoming releases.

- 🎬 Movies: title, description, duration, status (now showing / upcoming), rating, language, chips (info tags)
- 🪑 Auditoriums: name, total seats, rows, columns
- 🕒 Schedules: movie (fkey), auditorium (fkey), date, time, seat price, seat tax
- 🎟️ Reservations: schedule (fkey), user (fkey), status (pending / confirmed), expiration date, seat info, session
- 🧑‍💼 Users: name, email, encrypted password, role (client / admin)

#### ⚠️ Nota: No se almacena información de tarjetas de credito

## Instalación para uso Local

- dockerfile para frontend y backend
- creacion de base de datos

## 🚀 Future Improvements

These are some features that could be added in the future to enrich the user experience:

- 🧑‍💼 **Panel administrativo**: Interface for adding new movies, schedules, auditoriums, and viewing seat occupancy analytics.
