//const express = require('express')
import Hello from "./Hello.js";
import "dotenv/config";
import express from 'express';
import Lab5 from "./Lab5/index.js";

import cors from "cors";
import session from "express-session";
import SessionController from "./Lab5/SessionControllers.js";

import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import EnrollmentsRoutes from "./Kambaz/Enrollments/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";

const app = express();
//cors governs the policies and mechanisms of how various resources can be shared across different domains or origins.
app.use(cors(
    {
        credentials: true,
        //origin: "http://localhost:5173",
        origin: "https://kambaz-react-web-canvas.netlify.app",
        credentials: true,
    })
);

const sessionOptions = {
    secret: "any string",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "none",
      secure: true,
    },
};

if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
        domain: process.env.NODE_SERVER__DOMAIN,
    };
}
app.use(session(sessionOptions)); // creating the new instance object manioulating the incoming request
app.use(express.json());

UserRoutes(app);
CourseRoutes(app);
EnrollmentsRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
//const port = process.env.PORT || 4000;

//custom routes
Hello(app);
Lab5(app);
SessionController(app);

//app.get('/hello', (req, res) => {res.send('Life is good!')})
//app.get('/', (req, res) => {
//    res.send('Welcome to Full Stack Development!')
//})

//app.listen(4000)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
//app.listen(process.env.PORT || 4000)