# Cybersecurity Audit Form Backend

This is the backend API for the Cybersecurity Audit Form application built with Node.js, Express, and MySQL.

## Features

- RESTful API for cybersecurity audit form data
- MySQL database for data persistence
- Validation for form inputs
- Error handling and logging

## Prerequisites

- Node.js (>= 14.x)
- MySQL (>= 8.x)

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   cd Backend
   npm install
   ```

3. Run the setup script to create .env file from template:
   ```
   npm run setup
   ```

4. Update the `.env` file with your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=cybersecurity_audit
   DB_PORT=3306
   ```

5. Initialize the database:
   ```
   npm run init-db
   ```

6. Start the development server:
   ```
   npm run dev
   ```

## Troubleshooting MySQL Connection

If you encounter issues connecting to MySQL:

1. Ensure MySQL server is running on your machine
2. Verify the MySQL credentials in your `.env` file
3. Make sure the MySQL port (default: 3306) is correct and not blocked by firewall
4. Try connecting to MySQL using a client tool to verify credentials
5. Check MySQL user privileges - the user must have permission to create databases

## API Endpoints

| Method | Endpoint          | Description                       |
|--------|-------------------|-----------------------------------|
| POST   | /api/audits       | Create a new audit form submission|
| GET    | /api/audits       | Get all audit submissions         |
| GET    | /api/audits/:id   | Get a specific audit submission   |
| PUT    | /api/audits/:id   | Update an audit submission        |
| DELETE | /api/audits/:id   | Delete an audit submission        |

## Folder Structure

```
Backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Express middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── server.js       # Server entry point
├── scripts/            # DB initialization scripts
├── .env                # Environment variables
├── .gitignore          # Git ignore file
└── package.json        # Project dependencies
```

## Frontend Integration

The frontend is expected to run on http://localhost:5173. To integrate with the frontend:

1. Make sure the frontend's API calls point to `http://localhost:5000/api`
2. Update the CORS_ORIGIN in the `.env` file if your frontend runs on a different port 