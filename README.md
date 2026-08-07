# 💰 Expense Tracker API

A secure, scalable, and production-ready REST API for managing personal finances, built with **Node.js**, **Express.js**, **PostgreSQL**, and **Prisma ORM**.

The application enables users to securely manage their income and expenses, organize transactions with categories and wallets, monitor budgets, and gain insights through dashboards and financial reports.

---

# 📌 Table of Contents

- [Project Goals](#project-goals)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Development Roadmap](#development-roadmap)
- [Future Enhancements](#future-enhancements)

---

# 🎯 Project Goals

The primary objective of this project is to build a production-ready backend that demonstrates real-world backend development concepts.

## Technical Goals

- Design a RESTful API
- Build a modular Express application
- Learn relational database design
- Practice Prisma ORM
- Implement JWT authentication
- Secure APIs using middleware
- Handle validation and errors
- Build reusable service architecture
- Write efficient database queries
- Generate analytics and reports
- Document APIs
- Test endpoints
- Deploy a production-ready application

---

# 🛠 Tech Stack

## Backend

- Node.js
- Express.js

## Database

- PostgreSQL
- Prisma ORM

## Authentication

- JWT
- bcrypt

## Validation

- Zod

## File Uploads

- Multer

<!-- ## Security

- Helmet
- CORS
- Express Rate Limit -->

<!-- ## Documentation

- Swagger

## Testing

- Jest
- Supertest -->

---

# ✨ Features

## 🔐 Authentication

- User registration
- User login
- User logout
- Password hashing
- JWT authentication
- Protected routes

---

## 👤 User Management

- View profile
- Update profile
- Change password

---

## 💸 Expense Management

- Create expense
- View expenses
- View expense details
- Update expense
- Delete expense
- Add notes
- Upload receipt (optional)
- Associate category and wallet

---

## 💰 Income Management

- Add income
- View income
- Update income
- Delete income

---

## 🏷 Categories

- Default categories
- Custom categories
- Update categories
- Delete categories

Examples:

- Food
- Bills
- Shopping
- Healthcare
- Entertainment
- Travel
- Education

---

## 👛 Wallets

Support multiple wallets such as:

- Cash
- Bank Account
- Credit Card
- eSewa
- Khalti

---

## 📊 Dashboard

- Current balance
- Total income
- Total expenses
- Monthly income
- Monthly expenses
- Largest expense
- Largest income
- Most used category
- Monthly savings

---

## 📈 Analytics

- Spending by category
- Income by category
- Monthly spending trends
- Average daily expenses
- Average monthly expenses
- Highest spending month

---

## 🎯 Budget Management

- Monthly budgets
- Category budgets
- Budget usage
- Remaining budget
- Budget alerts

---

## 📄 Reports

Generate reports by:

- Month
- Year
- Category
- Wallet

Export reports as:

- CSV
- Excel
- PDF

---

## 🔍 Search & Filtering

Search by:

- Title
- Category
- Notes

Filter by:

- Date range
- Category
- Wallet
- Amount

---

## ↕ Sorting

- Latest
- Oldest
- Highest amount
- Lowest amount

---

## 📚 Pagination

Pagination support for all list endpoints.

---

<!-- ## 🛡 Security

- JWT Authentication
- Password hashing
- Helmet
- CORS
- Rate limiting
- Request validation
- Centralized error handling

--- -->

## 📷 Receipt Upload

- Multer
- Receipt image storage

---

# 🚀 Development Roadmap

The project is divided into incremental phases. Each phase introduces a complete set of features while building toward a production-ready Expense Tracker API.

---

# Phase 1 — Project Foundation

## 🎯 Goal

Set up the project architecture, development environment, and database connection.

## ✅ Checklist

### Project Setup

- [✓] Initialize Node.js project
- [✓] Install Express.js
- [✓] Configure environment variables
- [✓] Install development dependencies
- [✓] Configure npm scripts
- [✓] Create project folder structure

### Database

- [✓] Install PostgreSQL
- [✓] Initialize Prisma
- [✓] Configure Prisma Client
- [✓] Create initial migration
- [✓] Verify database connection

### Server Setup

- [✓] Configure Express server
- [✓] Configure middleware
- [✓] Add centralized error handler
- [✓] Add 404 route handler

## 🎉 Deliverable

- Express server running
- PostgreSQL connected
- Prisma configured
- Project architecture ready for development

---

# Phase 2 — Authentication & User Management

## 🎯 Goal

Implement secure user authentication and profile management.

## ✅ Checklist

### User Model

- [✓] Create User schema
- [✓] Configure Prisma migration
- [✓] Seed sample user (optional)

### Authentication

- [✓] Register user
- [✓] Login user
- [ ] Logout user
- [✓] Hash passwords with bcrypt
- [✓] Generate JWT tokens
- [✓] Protect private routes

### User Profile

- [✓] Get profile
- [✓] Update profile
- [ ] Change password

### Validation

- [✓] Validate registration
- [✓] Validate login
- [✓] Validate profile update

## 🎉 Deliverable

- Secure authentication system
- Protected API routes
- User profile management

---

# Phase 3 — Categories & Wallets

## 🎯 Goal

Implement supporting resources used by financial transactions.

## ✅ Checklist

### Categories

- [✓] Create category
- [✓] Get categories
- [✓] Update category
- [✓] Delete category

### Wallets

- [✓] Create wallet
- [✓] Get wallets
- [✓] Get wallet by ID
- [✓] Update wallet
- [✓] Delete wallet

## 🎉 Deliverable

- Users can organize transactions using categories and wallets.

---

# Phase 4 — Expense Management

## 🎯 Goal

Build the core expense tracking functionality.

## ✅ Checklist

### Expense CRUD

- [✓] Create expense
- [✓] Get all expenses
- [✓] Get expense by ID
- [✓] Update expense
- [✓] Delete expense

### Expense Features

- [✓] Add notes
- [✓] Assign category
- [✓] Assign wallet
- [✓] Record transaction date

### Query Features

- [✓] Pagination
- [✓] Search
- [✓] Filter by category, wallet, date range, and amount
- [✓] Sort by amount, date

## 🎉 Deliverable

- Complete expense management system.

---

# Phase 5 — Income Management

## 🎯 Goal

Allow users to manage income alongside expenses.

## ✅ Checklist

### Income CRUD

- [✓] Create income
- [✓] Get income
- [✓] Get income by ID
- [✓] Update income
- [✓] Delete income

### Query Features

- [✓] Search
- [✓] Pagination
- [✓] Filters
- [✓] Sorting

## 🎉 Deliverable

- Complete transaction management for both income and expenses.

---

# Phase 6 — Dashboard & Analytics

## 🎯 Goal

Provide financial summaries and insights.

## ✅ Checklist

### Dashboard

- [✓] Current balance
- [ ✓] Total income
- [✓] Total expenses
- [✓] This month income
- [✓] This month expense
- [✓] This month savings
- [✓] Largest expense
- [✓] Largest income

### Analytics

- [✓] Spending by category
- [✓] Income by category
- [✓] Monthly expense trends
- [✓] Monthly income trends
- [] Average daily expenses
- [] Average monthly expenses
- [] Highest spending category

## 🎉 Deliverable

- Dashboard with financial analytics.

---

# Phase 7 — Budget Management

## 🎯 Goal

Help users monitor and control their spending.

## ✅ Checklist

### Budgets

- [✓] Create budget
- [✓] Update budget
- [✓] Delete budget
- [✓] Get budgets
- [✓] Get budgets summary

### Budget Tracking

- [✓] Remaining budget
- [✓] Percentage used
- [✓] Budget status (on track, overspent, warning)

## 🎉 Deliverable

- Budget tracking and spending control.

---

# Phase 8 — Reports

## 🎯 Goal

Generate downloadable financial reports.

## ✅ Checklist

### Reports

- [ ] Monthly report
- [ ] Yearly report
- [ ] Category report
- [ ] Wallet report

### Export

- [ ] CSV export
- [ ] Excel export
- [ ] PDF export

## 🎉 Deliverable

- Report generation with export functionality.

---

# Phase 9 — Receipt Uploads

## 🎯 Goal

Allow users to attach receipts to expenses.

## ✅ Checklist

### Uploads

- [ ] Configure Multer
- [ ] Configure Cloudinary
- [ ] Upload receipt
- [ ] Delete receipt

### Database

- [ ] Store receipt URL
- [ ] Link receipt to expense

## 🎉 Deliverable

- Receipt upload support.

---

# Phase 10 — Security & Optimization

## 🎯 Goal

Improve security, validation, and performance.

## ✅ Checklist

### Security

- [ ] Helmet
- [ ] CORS
- [ ] Rate limiting
- [ ] Secure HTTP headers

### Validation

- [ ] Request validation
- [ ] Global validation middleware

### Optimization

- [ ] Optimize Prisma queries
- [ ] Add database indexes
- [ ] Improve pagination performance

## 🎉 Deliverable

- Secure and optimized API.

---

# Phase 11 — Documentation & Testing

## 🎯 Goal

Document the API and ensure reliability through testing.

## ✅ Checklist

### Documentation

- [✓] Swagger/OpenAPI
- [ ] Installation guide
- [ ] Environment setup guide

### Testing

- [ ] Unit tests
- [ ] Integration tests
- [ ] Authentication tests
- [ ] Endpoint tests

## 🎉 Deliverable

- Fully documented and tested application.

---

# Phase 12 — Deployment

## 🎯 Goal

Deploy the application to production.

## ✅ Checklist

### Deployment

- [ ] Configure production environment
- [ ] Deploy PostgreSQL database
- [ ] Deploy backend
- [ ] Run production migrations
- [ ] Verify deployment

### Optional

- [ ] Dockerize application
- [ ] Configure CI/CD pipeline
- [ ] Add monitoring and logging

## 🎉 Deliverable

- Live, production-ready Expense Tracker API.

---

# 🌱 Future Enhancements

These features are planned after the core application is complete.

### Authentication

- Refresh tokens
- Email verification
- Forgot password
- Password reset

### Finance

- Recurring transactions
- Savings goals
- Currency conversion
- Scheduled reminders

### Analytics

- Spending forecasts
- AI-powered financial insights
- Spending anomaly detection

### User Experience

- OCR receipt scanning
- Push notifications
- Mobile application
- Multi-language support

---

# 📄 License

This project is licensed under the **MIT License**.
