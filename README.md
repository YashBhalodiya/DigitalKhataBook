# KhataBook – Digital Credit Management System

A cross-platform mobile application built using **React Native (Expo)** that helps small shop owners manage customer credit (khata) records digitally.  
The app allows tracking of credit transactions, payments, and outstanding balances for both shop owners and customers.

---

## Features

### Shop Owner
- **Dashboard**
  - View total outstanding credit amount
  - View total number of customers
- **Customer Management**
  - Add new customers
  - View and manage customer profiles
- **Credit Entry**
  - Record credit and payment transactions
  - Automatically update outstanding balances
- **Profile Management**
  - View and manage shop owner profile details

---

### Customer
- **Dashboard**
  - View total outstanding balance
- **Transaction History**
  - View complete credit and payment history

---

## Tech Stack

- **Framework:** React Native (Expo)
- **Navigation:** Expo Router (v6)
- **Backend:** Firebase (v12.7.0)
  - Firebase Authentication
  - Firestore Cloud Database
- **State Management:** React Context API

---

## Authentication & Data Management

- Role-based authentication for shop owners and customers
- Secure user login using Firebase Authentication
- Real-time data storage and retrieval using Firestore
- Customer-wise transaction storage and balance calculation

---
