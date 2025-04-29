# Cybersecurity Audit Form Application

A full-stack web application for conducting and managing cybersecurity audits.

## Features

- Multi-step cybersecurity audit form
- Form validation and data persistence
- Audit submissions dashboard
- RESTful API for CRUD operations

## Tech Stack

### Frontend
- React
- React Router
- CSS
- Vite

### Backend
- Node.js
- Express
- MySQL

## Project Structure

```
project/
├── Frontend/          # React frontend
│   ├── public/        # Static assets
│   ├── src/           # Source files
│   │   ├── component/ # React components
│   │   ├── utils/     # Utility functions
│   │   ├── App.jsx    # Main application component
│   │   └── main.jsx   # Application entry point
│   ├── package.json   # Frontend dependencies
│   └── README.md      # Frontend documentation
│
├── Backend/           # Node.js backend
│   ├── src/           # Source files
│   │   ├── config/    # Configuration files
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Express middleware
│   │   ├── models/    # Database models
│   │   ├── routes/    # API routes
│   │   ├── utils/     # Utility functions
│   │   └── server.js  # Server entry point
│   ├── scripts/       # Database scripts
│   ├── package.json   # Backend dependencies
│   └── README.md      # Backend documentation
│
└── README.md          # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- MySQL (>= 8.x)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd cybersecurity-audit-form
   ```

2. Setup Backend:
   ```
   cd Backend
   npm install
   cp env.example .env  # Configure your environment variables
   npm run dev
   ```

3. Initialize the database:
   ```
   node scripts/db_init.js
   ```

4. Setup Frontend:
   ```
   cd ../Frontend
   npm install
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## API Endpoints

| Method | Endpoint           | Description                    |
|--------|-------------------|--------------------------------|
| POST   | /api/audits        | Create a new audit submission  |
| GET    | /api/audits        | Get all audit submissions      |
| GET    | /api/audits/:id    | Get a specific audit submission|
| PUT    | /api/audits/:id    | Update an audit submission     |
| DELETE | /api/audits/:id    | Delete an audit submission     |

## License

This project is licensed under the MIT License - see the LICENSE file for details. 