### Kambaz Node Server

## Overview
Kambaz Node Server is a RESTful backend API for the Kambaz LMS (Canvas clone).
It provides authentication, course management, assignments, and enrollment services, and is designed to work with a separate React frontend (e.g., deployed on Netlify).

## Tech stack
- Express 4 (ES modules: "type": "module")
- express-session — cookie-based login (currentUser in session)
- cors — cross-origin requests from the frontend (with credentials)
- dotenv — env vars (CLIENT_ORIGIN, SESSION_SECRET, etc.)
- uuid — new ids for some entities

## How to run
npm start → run node index.js
Listens on process.env.PORT or 4000

## System Design
- Data model (in memory)
  Centralized Database object: users, courses, enrollments, modules, assignments.
  DAO(Data Access Object) layer:
  - Handle CRUD operations
  - Abstracts direct data manipulation
  
- Authentication & Roles
  - Sign-in / sign-up set req.session.currentUser.
  - Responses can include permissions (what each role may change).
  - Role-based access control
      - ADMIN: full system access
      - FACULTY: manage courses, modules, users (writes).
      - TA: manage assignments only (writes).
      - STUDENT: read-focused; limited write access.
 
- Main API surface
  - Users: POST sign-in, sign-up, profile, GET users profile, PUT users, DELETE users
  - Courses: POST courses, GET by courseId, PUT by courseId, DELETE by courseId
  - Nested: /api/courses/:courseId/modules and .../assignments
  - Enrollments: e.g. POST /api/enrollments (with session)

- Integration with Fronted
    - Frontend (React / Netlify)
        ↓
    - Axios (with credentials)
        ↓
    - Backend (Render / Node)
        ↓
    - Session + Data (in-memory)
 
- Deployment
  - Render: backend hosting 
  - Netlify: frontend hosting
