# 🛒 AI-Powered Smart E-Commerce Recommendation System

An end-to-end **AI-powered e-commerce platform** that combines **Machine Learning, FastAPI, MySQL, React, and Flask** to deliver personalized product recommendations, customer segmentation, intelligent analytics, and a complete online shopping experience.

This project is being developed as part of my **Machine Learning journey**, evolving from data analysis and machine learning experiments into a full-stack, production-style intelligent e-commerce platform.

> 🚧 **Project Status:** Under Development
> 🔄 **Current Phase:** Full-Stack Integration & E-Commerce Backend Completed | ML & Admin Analytics Next

---

## 🎯 Project Objectives

* Build a complete e-commerce platform from scratch.
* Integrate Machine Learning into a real-world business application.
* Develop a personalized product recommendation system.
* Implement customer segmentation using Machine Learning.
* Build a secure backend with REST APIs.
* Connect the application with a MySQL database.
* Develop an analytics dashboard for business insights.
* Implement real e-commerce functionality including authentication, cart, checkout, and orders.
* Follow clean and scalable software engineering practices.
* Deploy a complete AI-powered full-stack application.

---

# ✨ Current Features

The project has progressed from a frontend prototype into a functional full-stack e-commerce application.

## 👤 Customer Portal

### 🔐 Authentication

* User Registration
* User Login
* Backend Authentication
* Customer ID Management
* Persistent Login State
* Protected Customer Operations

### 🛍️ Product Experience

* Product Categories
* Product Search
* Product Filtering
* Product Details
* Product Images
* Product Pricing
* Product Ratings
* Product Stock Information
* Product Cards and Product Grid
* Product Recommendations UI

### 🛒 Shopping Cart

* Add Products to Cart
* Remove Products
* Update Product Quantity
* Cart Subtotal Calculation
* Shipping Calculation
* Cart Total Calculation
* Persistent Cart State
* Backend Cart Integration

### 💳 Checkout & Orders

* Checkout Process
* Customer ID Integration
* Payment Method Selection
* Shipping Method Selection
* Order Creation
* Transaction Storage
* Order / Transaction Details
* Checkout Completion
* Cart Clearing After Successful Checkout
* Checkout / Transaction Slip Generation

The checkout flow is connected between the **React frontend, FastAPI backend, and MySQL database**.

---

# 👨‍💼 Planned Admin Portal

The Admin Portal will be developed as a separate **Flask-based analytics dashboard**.

## 📊 Dashboard & Analytics

* Total Customers
* Total Products
* Total Orders
* Total Sales
* Sales Overview
* Top-Selling Products
* Popular Categories
* Customer Insights
* Order Statistics
* Revenue Analytics

## 📦 Product Management

* Add Products
* Update Products
* Delete Products
* Manage Product Prices
* Manage Product Stock
* Product Categories
* Product Import / Data Processing

## 👥 Customer Management

* View Customers
* Customer Activity
* Customer Purchase History
* Customer Segmentation
* Customer Behavior Analysis

## 🛒 Order Management

* View Orders
* Order Details
* Order Status
* Sales Information
* Transaction History

## 🤖 Recommendation Analytics

* Customer Clusters
* Cluster Distribution
* Popular Products by Cluster
* Recommendation Statistics
* ML Model Insights
* Recommendation Result Visualizations

---

# 🤖 Machine Learning Features

Machine Learning is the core intelligent component of this project.

## Phase 1 — Customer Segmentation

### K-Means Clustering

Customer behavior and purchasing patterns will be analyzed to group customers into meaningful segments.

```text
Customer Data
      ↓
Data Preprocessing
      ↓
Feature Engineering
      ↓
K-Means Clustering
      ↓
Customer Segments
      ↓
Personalized Recommendations
```

---

## Phase 2 — Personalized Recommendation System

The recommendation engine will use customer behavior and purchase history to recommend relevant products.

Potential signals include:

* Product Views
* Cart Additions
* Purchases
* Product Categories
* Purchase Frequency
* Customer Segments
* Customer Purchase History

The recommendation results will be displayed through the customer-facing website.

---

## 🔮 Future Machine Learning Enhancements

* Association Rule Mining (Apriori)
* Collaborative Filtering
* Content-Based Recommendation
* Hybrid Recommendation System
* Sales Forecasting
* Customer Purchase Prediction
* Product Popularity Analysis
* Review Sentiment Analysis

---

# 🛠️ Tech Stack

## Frontend

* React.js
* JavaScript
* HTML
* CSS
* Vite
* React Router
* Framer Motion

## Backend

* Python
* FastAPI
* Pydantic
* SQLAlchemy
* PyMySQL
* REST APIs
* Uvicorn

## Admin Dashboard

* Python
* Flask
* HTML
* CSS
* JavaScript
* Chart-based Data Visualization

## Database

* MySQL
* SQL
* Relational Database Design

Current database includes core e-commerce entities such as:

```text
Products
Customers
Cart Items
Transactions / Orders
```

## Machine Learning

* Python
* NumPy
* Pandas
* Scikit-learn
* Matplotlib
* Joblib

## Development Tools

* PyCharm
* VS Code
* Git
* GitHub
* MySQL
* MySQL Workbench

---

# 📂 Project Structure

```text
AI-Powered-E-Commerce-Recommendation-System/

├── frontend/
│   └── arc-store/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── context/
│       │   ├── services/
│       │   ├── data/
│       │   └── utils/
│       ├── public/
│       ├── package.json
│       ├── package-lock.json
│       ├── index.html
│       └── vite.config.js
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── connection.py
│   ├── models/
│   ├── schemas/
│   └── routes/
│
├── ml/
│   ├── data/
│   ├── models/
│   └── recommendation/
│
├── scripts/
│   └── data processing scripts
│
├── database/
│   └── SQL scripts
│
├── docs/
│
├── README.md
├── requirements.txt
├── .gitignore
└── LICENSE
```

> The project structure will continue to evolve as the Machine Learning, recommendation, and analytics components are implemented.

---

# 🔄 System Architecture

```text
                         CUSTOMER
                            │
                            ▼
                   ┌─────────────────┐
                   │ React Frontend  │
                   │   Vite + JS     │
                   └────────┬────────┘
                            │
                            │ REST APIs
                            ▼
                   ┌─────────────────┐
                   │ FastAPI Backend │
                   └────────┬────────┘
                            │
                 ┌──────────┼──────────┐
                 ▼          ▼          ▼
          ┌───────────┐ ┌─────────┐ ┌──────────────┐
          │   MySQL   │ │  Auth   │ │ Cart/Checkout│
          │  Database │ │         │ │   & Orders   │
          └───────────┘ └─────────┘ └──────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │  ML Pipeline    │
                   └────────┬────────┘
                            │
                            ▼
                  Recommendation Engine
                            │
                            ▼
                   Recommended Products
                            │
                            ▼
                    React Frontend


              ┌─────────────────────────┐
              │ Flask Admin Dashboard   │
              ├─────────────────────────┤
              │ Sales Analytics         │
              │ Customer Insights       │
              │ Product Analytics       │
              │ Order Analytics         │
              │ ML Visualizations       │
              └─────────────────────────┘
```

---

# 🔐 Authentication & Security

The platform includes backend-based authentication and is designed to support secure access control.

Implemented / planned security features include:

* Customer Registration
* Customer Login
* Customer ID Assignment
* Backend Authentication
* Password Hashing
* Customer Roles
* Protected Admin Access
* Backend API Validation
* Environment Variables for Sensitive Credentials

Admin access will be restricted to authorized users and will not be available through normal customer registration.

---

# 🛒 Current E-Commerce Flow

The current application follows this basic flow:

```text
User
 ↓
Signup / Login
 ↓
Customer ID
 ↓
Browse Products
 ↓
Add to Cart
 ↓
Manage Cart
 ↓
Proceed to Checkout
 ↓
Select Payment Method
 ↓
Select Shipping Method
 ↓
FastAPI Backend
 ↓
MySQL Database
 ↓
Transaction / Order Created
 ↓
Checkout Slip
 ↓
Cart Cleared
```

This provides the foundation required for collecting real customer transaction data that can later be used by the Machine Learning pipeline.

---

# 🧠 Customer Recommendation Flow

Once the ML layer is implemented, the customer journey will become:

```text
Customer Signup / Login
        ↓
Customer ID Assigned
        ↓
Browse Products
        ↓
Views / Cart / Purchases
        ↓
Customer Behavior Data
        ↓
Data Preprocessing
        ↓
Feature Engineering
        ↓
K-Means Customer Segmentation
        ↓
Recommendation Engine
        ↓
Recommended Products
        ↓
"Recommended For You"
        ↓
In-App Recommendation Notification
```

---

# 📊 Analytics & Visualization

The Admin Dashboard will present meaningful business and Machine Learning insights through:

* Sales Charts
* Customer Statistics
* Product Statistics
* Category Analysis
* Order Analytics
* Revenue Analysis
* Customer Cluster Visualizations
* Recommendation Statistics
* ML Model Results
* Product Performance

The dashboard will provide a visual interface for understanding both **business performance** and **Machine Learning results**.

---

# 📅 Development Roadmap

## Phase 1 — Planning & Data

* [x] Project Planning
* [x] Repository Setup
* [x] Dataset Collection
* [x] Initial Database / SQL Work
* [x] Product Dataset Preparation
* [x] Product Data Import

## Phase 2 — Frontend

* [x] React Frontend Development
* [x] Responsive UI
* [x] Product Pages
* [x] Product Details
* [x] Search & Filtering
* [x] Shopping Cart UI
* [x] Login / Signup UI
* [x] Checkout UI

## Phase 3 — Backend Integration

* [x] FastAPI Backend Setup
* [x] MySQL Database Connection
* [x] SQLAlchemy Integration
* [x] Product APIs
* [x] Customer APIs
* [x] Authentication APIs
* [x] Frontend API Service
* [x] Frontend ↔ Backend Integration
* [x] Customer ID Integration
* [x] Cart Backend Integration
* [x] Checkout Backend Integration
* [x] Transaction / Order Creation
* [x] Payment Method Handling
* [x] Shipping Method Handling
* [x] Checkout Slip Generation

## Phase 4 — Machine Learning

* [ ] Customer Behavior Dataset
* [ ] Transaction Data Preparation
* [ ] Feature Engineering
* [ ] K-Means Customer Segmentation
* [ ] Cluster Analysis
* [ ] Recommendation Engine
* [ ] Personalized Recommendations
* [ ] Recommendation API
* [ ] Frontend Recommendation Integration
* [ ] In-App Recommendation Notifications

## Phase 5 — Admin Analytics

* [ ] Flask Admin Dashboard
* [ ] Sales Analytics
* [ ] Customer Analytics
* [ ] Product Analytics
* [ ] Order Analytics
* [ ] Customer Cluster Visualization
* [ ] Recommendation Analytics
* [ ] ML Model Visualization

## Phase 6 — Finalization

* [ ] Testing
* [ ] Error Handling Improvements
* [ ] Security Improvements
* [ ] Performance Optimization
* [ ] Documentation
* [ ] Deployment

---

# 📚 Learning Goals

This project is designed to strengthen my practical knowledge in:

* Machine Learning
* Recommendation Systems
* Customer Segmentation
* K-Means Clustering
* FastAPI Development
* Flask Development
* REST API Design
* MySQL & Database Design
* SQLAlchemy
* React Development
* Full-Stack Development
* Model Deployment
* Data Analysis
* Data Visualization
* Software Engineering
* Git & GitHub Best Practices

---

# 🚀 Future Vision

The long-term goal is to transform this project into a **production-style AI-powered e-commerce platform** capable of providing intelligent and personalized shopping experiences.

The platform will combine:

```text
E-Commerce
     +
FastAPI
     +
MySQL
     +
React
     +
Machine Learning
     +
Recommendation Systems
     +
Customer Analytics
     +
Business Intelligence
```

to create a data-driven and intelligent shopping platform.

---

# ⭐ Project

This project is part of my **Machine Learning learning journey**, where I am continuously applying ML concepts to real-world software projects and gradually expanding them into complete AI-powered applications.

The project started as a frontend e-commerce concept and is now evolving into a **fully integrated full-stack application**, with Machine Learning and intelligent recommendation features planned as the next major stage.

⭐ If you like this project, consider giving it a star and following my Machine Learning journey as I build this project step by step.
