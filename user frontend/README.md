# Cybersecurity Audit Form Frontend

This is the frontend for the Cybersecurity Audit Form application, featuring a multi-step form for collecting detailed cybersecurity audit information.

## Features

- Clean, focused form interface without navigation distractions
- Multi-step form with progress indicator
- Form validation for required fields
- Toast notifications for feedback
- API integration with backend

## Setup and Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Structure

- `src/component/` - React components for the form
- `src/utils/` - Utility functions, including API client
- `src/App.jsx` - Main application component
- `src/main.jsx` - Application entry point

## Backend Connection

The frontend is configured to connect to the backend at `http://localhost:5000`. If your backend runs on a different port, update the `API_BASE_URL` in `src/utils/api.js`.
