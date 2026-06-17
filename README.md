# ManageRestaurantOrder

## Project Description

ManageRestaurantOrder is a fullstack web application designed to manage orders in a fast food restaurant environment.

The project consists of a Vue.js frontend and a Node.js REST API backend connected to a MySQL database. It provides an intuitive interface for restaurant staff while maintaining a robust backend architecture for order processing, business logic, and data persistence.

The objective is to deliver a clean, maintainable, and scalable solution suitable for real-world food service management scenarios.

## Architecture

The project follows a layered architecture to ensure maintainability and separation of concerns.

### Backend Principles

* Functional programming approach
* Strict separation of concerns
* No SQL queries outside repositories
* No business logic inside controllers
* Centralized error handling
* RESTful API design

### Frontend Principles

* Component-based architecture
* Reusable UI components
* Clear separation between views, services, and state management
* Responsive and mobile-friendly design

## Tech Stack

### Frontend

* Vue.js
* Tailwind CSS
* Vite

### Backend

* Node.js
* Express.js
* MySQL
* mysql2
* Nodemon
* OpenAPI / Swagger

## Requirements

### General

* Node.js (v18+ recommended)
* npm
* MySQL Server

### Recommended Versions

```bash
node -v
npm -v
```

Minimum: Node.js 18+

Recommended: Node.js 22.x LTS

### Database

* MySQL 8+ recommended
* A database matching the configuration in `.env`
* Required tables created before starting the application

## Project Structure

```text
ManageRestaurantOrder/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   ├── package.json
│   └── ...
│
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd ManageRestaurantOrder
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

```bash
cd ../backend
npm install
```

## Environment Variables

Create a `.env` file inside the backend directory using the provided `.env.example`.

```

Do not commit `.env` files to version control.

## Running the Application

The frontend and backend must be started separately.

### Start the Frontend

```bash
cd frontend
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

### Start the Backend

```bash
cd backend
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

## Available Scripts

### Frontend

#### Development Server

```bash
npm run dev
```

### Backend

#### Development Server

```bash
npm run dev
```

#### Production Server

```bash
npm start
```

## API Documentation

If Swagger is enabled, the API documentation is available at:

```text
http://localhost:3000/api-docs
```

## Database

The project uses MySQL as the relational database management system.

Before starting the backend, ensure that:

* MySQL is installed and running
* The database exists
* Database credentials match the `.env` configuration
* Required tables have been created

## Development Guidelines

### Backend

* Follow RESTful naming conventions
* Use prepared statements for all SQL queries
* Keep business logic inside services
* Keep database access inside repositories
* Centralize error handling

### Frontend

* Create reusable Vue components
* Keep API calls inside dedicated services
* Maintain a clear folder structure
* Follow responsive design principles

### General

* Follow Conventional Commits
* Do not commit `.env` files
* Write clean and maintainable code
* Respect project architecture boundaries

## License

This project is intended for educational and academic purposes.
