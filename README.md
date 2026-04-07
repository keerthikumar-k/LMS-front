# Leave Management System

A clean and modern frontend application for managing employee leave requests, built with React, Vite, and Tailwind CSS.

## Features

- **Dashboard**: Overview of leave balances and upcoming leaves
- **Apply for Leave**: Submit new leave requests with date selection and reason
- **Leave History**: View past leave applications and their status
- **Profile Management**: Update personal information and contact details

## Tech Stack

- **React 19**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for clean, responsive design
- **React Router**: Client-side routing for navigation

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   # or
   npx vite
   ```

3. Open [http://localhost:5174](http://localhost:5174) in your browser

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Navigation header
│   ├── Dashboard.jsx       # Main dashboard with leave overview
│   ├── ApplyLeave.jsx      # Leave application form
│   ├── LeaveHistory.jsx    # Leave history and status
│   └── Profile.jsx         # User profile management
├── App.jsx                 # Main app component with routing
├── main.jsx                # App entry point
└── index.css               # Global styles with Tailwind
```

## Design

The application features a clean, professional design with:
- Responsive layout that works on desktop and mobile
- Consistent color scheme using indigo as primary color
- Card-based layouts for better information organization
- Status indicators with color coding (green for approved, yellow for pending, red for rejected)
- Smooth navigation between sections

## Note

This is a frontend-only application with mock data. In a production environment, it would connect to a backend API for data persistence and user authentication.
