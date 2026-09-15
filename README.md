# Personal Finance and Expense Analytics System

## 📌 Project Overview

**Personal Finance and Expense Analytics System** is a full-stack web application designed to help users manage their personal finances efficiently.

The system allows users to manage their accounts, record and categorize transactions, create budgets, set savings goals, transfer money between accounts, and analyze their financial activities through an analytics dashboard.

The project follows a modular architecture consisting of:

* **FinTrack Frontend**
* **Flask Backend**
* **Database**
* **Analytics Module**

The application is designed to provide users with a centralized platform for tracking income and expenses and making better financial decisions based on their spending patterns.

---

## 🎯 Objectives

The main objectives of the project are:

* Track personal income and expenses.
* Manage multiple financial accounts.
* Categorize financial transactions.
* Create and monitor budgets.
* Set and track savings goals.
* Record transfers between accounts.
* Provide financial analytics and visualizations.
* Secure user authentication and account management.
* Store financial data in a structured relational database.
* Provide a user-friendly dashboard for financial monitoring.

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │     User / Client   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   FinTrack Frontend │
                    │       React         │
                    └──────────┬──────────┘
                               │
                         REST API / HTTP
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Flask Backend    │
                    │      Python         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Supabase /          │
                    │ PostgreSQL Database  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Analytics Module    │
                    │ Reports & Insights  │
                    └─────────────────────┘
```

---

# 📂 Project Structure

```text
Personal-Finance-and-Expense-Analytics-System/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── requirements.txt
│   └── ...
│
├── database/
│   ├── schema/
│   ├── queries/
│   └── ...
│
├── fintrack/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── analytics/
│   └── ...
│
├── README.md
└── ...
```

> **Note:** Directory names should be adjusted if the final repository contains different names or additional files.

---

# 🧩 Main Modules

## 1. 🔐 Authentication Module

The Authentication module handles user authentication and access control.

### Responsibilities

* User registration.
* User login.
* Authentication.
* User session/token handling.
* Protecting user-specific resources.
* Logout functionality.

Authentication ensures that users can access and manage only their own financial information.

---

# 2. 👤 Account Management

The Account Management module allows users to maintain their financial accounts.

Examples include:

* Bank account
* Savings account
* Cash account
* Other financial accounts

### Main Operations

```text
POST    /api/accounts
GET     /api/accounts
PUT     /api/accounts/<account_id>
DELETE  /api/accounts/<account_id>
```

### Responsibilities

* Create an account.
* View accounts.
* Update account details.
* Delete an account.
* Maintain account balances.

---

# 3. 💸 Transaction Management

The Transaction module is responsible for recording financial transactions.

Transactions can represent:

* Income
* Expenses
* Other financial activities

### Responsibilities

* Add transactions.
* View transactions.
* Update transactions.
* Delete transactions.
* Associate transactions with accounts.
* Associate transactions with categories.
* Track transaction dates and amounts.

Transactions form the primary data source for budgeting and analytics.

---

# 4. 🏷️ Category Management

Categories help organize financial transactions.

Examples:

```text
Food
Travel
Shopping
Bills
Entertainment
Salary
Healthcare
Education
```

Categories allow the system to determine where money is being spent and make the analytics dashboard more meaningful.

---

# 5. 💰 Budget Management

The Budget module allows users to define spending limits.

A user can create a budget for a particular category and time period.

### Example

```text
Category: Food
Monthly Budget: ₹8,000
Amount Spent: ₹6,500
Remaining: ₹1,500
```

### Responsibilities

* Create budgets.
* View budgets.
* Update budgets.
* Delete budgets.
* Compare budgeted amount with actual spending.
* Identify overspending.

---

# 6. 🎯 Savings Goals

The Savings Goals module allows users to define financial goals.

Example:

```text
Goal: New Laptop
Target Amount: ₹80,000
Current Savings: ₹45,000
Remaining: ₹35,000
```

### Responsibilities

* Create savings goals.
* Set target amounts.
* Track current savings.
* Update goal progress.
* Monitor remaining amount.
* Track goal completion.

---

# 7. 🔄 Transfers

The Transfer module handles movement of money between user accounts.

Example:

```text
From Account: Bank Account
To Account: Savings Account
Amount: ₹10,000
```

Transfers help maintain accurate account balances without treating internal account movements as normal income or expenses.

---

# 8. 📊 Analytics

The Analytics module converts stored financial data into meaningful information.

It can be used to analyze:

* Total income.
* Total expenses.
* Spending patterns.
* Category-wise expenses.
* Account balances.
* Budget performance.
* Savings progress.
* Transaction trends.

### Example Analytics

```text
Total Income       → ₹50,000
Total Expenses     → ₹32,000
Savings            → ₹18,000
Highest Category   → Food
Budget Usage       → 64%
```

Analytics helps users understand their financial behavior and make informed decisions.

---

# 🗄️ Database

The project uses a relational database through **Supabase/PostgreSQL**.

The main entities include:

```text
users
   │
   ├── accounts
   │      │
   │      └── transactions
   │
   ├── budgets
   │
   └── savings_goals

categories
   │
   └── transactions

transfers
```

### Main Tables

| Table           | Purpose                                |
| --------------- | -------------------------------------- |
| `users`         | Stores user information                |
| `accounts`      | Stores financial accounts              |
| `categories`    | Stores transaction categories          |
| `transactions`  | Stores income and expense transactions |
| `budgets`       | Stores user budgets                    |
| `savings_goals` | Stores savings targets                 |
| `transfers`     | Stores transfers between accounts      |

The database provides persistent storage for all financial information used by the application.

---

# ⚙️ Backend

The backend is developed using **Python Flask**.

It provides REST APIs that allow the frontend to communicate with the database.

### Backend responsibilities

* Handle HTTP requests.
* Validate input.
* Perform CRUD operations.
* Communicate with the database.
* Apply business logic.
* Return JSON responses.
* Handle errors.
* Provide APIs for frontend modules.

Typical API structure:

```text
/api/auth
/api/accounts
/api/transactions
/api/categories
/api/budgets
/api/goals
/api/transfers
/api/analytics
```

---

# 🖥️ Frontend

The FinTrack frontend provides the user interface for the application.

The frontend is developed using **React**.

### Frontend responsibilities

* Display dashboards.
* Provide forms for financial data.
* Display accounts.
* Display transactions.
* Manage budgets.
* Display savings goals.
* Display analytics.
* Communicate with backend APIs.
* Handle navigation and user interaction.

---

# 🔌 API Communication

The general request flow is:

```text
User
  ↓
React Frontend
  ↓
HTTP Request
  ↓
Flask REST API
  ↓
Business Logic
  ↓
Supabase/PostgreSQL
  ↓
JSON Response
  ↓
React Frontend
  ↓
Updated UI
```

For example, when a user creates an account:

```text
User enters account details
          ↓
React form
          ↓
POST /api/accounts
          ↓
Flask backend
          ↓
Database insert
          ↓
JSON response
          ↓
Account displayed on frontend
```

---

# 🛠️ Technologies Used

## Frontend

* React
* JavaScript
* HTML
* CSS
* REST API integration

## Backend

* Python
* Flask
* REST APIs

## Database

* PostgreSQL
* Supabase

## Development Tools

* Git
* GitHub
* Postman
* VS Code

---

# 🚀 Installation and Setup

## Prerequisites

Make sure the following are installed:

```text
Python
Node.js
npm
Git
```

A Supabase/PostgreSQL database is also required.

---

## 1. Clone the Repository

```bash
git clone https://github.com/mann-kothari/Personal-Finance-and-Expense-Analytics-System.git
```

Move into the project directory:

```bash
cd Personal-Finance-and-Expense-Analytics-System
```

---

# 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate the environment on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure the required environment variables for the database and authentication.

Then start the Flask server using the project's configured entry point.

For example:

```bash
python app.py
```

> Use the actual backend entry file if the repository uses a different Flask startup file.

---

# 3. Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd fintrack
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will then be available at the local development address displayed by Vite/React.

---

# 4. Database Setup

Create/configure the Supabase project and PostgreSQL database.

The required tables include:

```text
users
accounts
categories
transactions
budgets
savings_goals
transfers
```

Configure the backend with the appropriate database connection details using environment variables.

**Do not commit database passwords, API secrets, or private keys to GitHub.**

---

# 🧪 API Testing

The backend APIs can be tested using **Postman**.

A typical testing workflow is:

```text
1. Start Flask backend
        ↓
2. Open Postman
        ↓
3. Select API endpoint
        ↓
4. Select HTTP method
        ↓
5. Add required headers/body
        ↓
6. Send request
        ↓
7. Verify JSON response
```

CRUD APIs should be tested for:

* Successful requests.
* Invalid input.
* Missing records.
* Unauthorized access.
* Update operations.
* Delete operations.
* Database consistency.

---

# 🔀 Git Workflow

The project follows a feature-branch development workflow.

Recommended process:

```bash
git checkout main
git pull origin main
git checkout -b feature/<module-task>
```

After completing the work:

```bash
git add .
git commit -m "Add <module> functionality"
git push -u origin feature/<module-task>
```

The branch can then be used to create a Pull Request for review and merging.

---

# 📈 Project Workflow

The complete application workflow can be summarized as:

```text
User Registration / Login
            ↓
       User Dashboard
            ↓
 ┌──────────┼──────────┐
 ↓          ↓          ↓
Accounts  Transactions Budgets
 ↓          ↓          ↓
Transfers Categories  Goals
 └──────────┼──────────┘
            ↓
        Database
            ↓
        Analytics
            ↓
 Financial Insights & Reports
```

---

# 🔒 Security Considerations

The application should follow basic security practices:

* Passwords should not be stored as plain text.
* Authentication credentials should be protected.
* Database credentials should be stored in environment variables.
* Sensitive `.env` files should not be committed.
* APIs should validate user input.
* Users should only access their own financial records.
* Appropriate HTTP error handling should be implemented.

---

# 🧑‍💻 Development Team

The project is divided into multiple modules so that team members can work independently using feature branches.

Major development areas include:

* Authentication
* Account Management
* Transaction Management
* Budget & Goals
* Database
* Analytics
* FinTrack Frontend
* Backend/API Integration

Each module can be developed, tested, committed, pushed, and merged independently.

---

# 📋 Testing Checklist

Before merging a module, verify:

* [ ] Application starts successfully.
* [ ] Database connection works.
* [ ] APIs return expected responses.
* [ ] CRUD operations work correctly.
* [ ] Invalid inputs are handled.
* [ ] Frontend communicates with backend.
* [ ] Database records are updated correctly.
* [ ] No passwords/secrets are committed.
* [ ] Relevant API tests pass.
* [ ] Frontend builds successfully.

---

# 🌟 Key Features

| Feature            | Description                     |
| ------------------ | ------------------------------- |
| Authentication     | Secure user access              |
| Account Management | Manage financial accounts       |
| Transactions       | Track income and expenses       |
| Categories         | Organize transactions           |
| Budgets            | Set and monitor spending limits |
| Savings Goals      | Track financial targets         |
| Transfers          | Move money between accounts     |
| Analytics          | Understand financial behavior   |
| Dashboard          | Centralized financial overview  |

---

# 🎓 Academic Project

This project demonstrates the development of a complete full-stack financial management application using:

**React + Flask + REST APIs + PostgreSQL/Supabase**

It demonstrates concepts including:

* Full-stack development
* REST API development
* Database design
* CRUD operations
* Authentication
* Frontend-backend integration
* Data analytics
* Git/GitHub collaboration
* Software modularization

---

# 📄 License

This project is developed as an academic/project implementation. The licensing terms can be updated according to the requirements of the development team or institution.

---

## 🔗 Repository

**GitHub Repository:**

https://github.com/mann-kothari/Personal-Finance-and-Expense-Analytics-System
