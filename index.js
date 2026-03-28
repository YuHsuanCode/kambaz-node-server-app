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
// Behind Render/nginx so secure cookies and req.protocol are correct
app.set("trust proxy", 1);

const allowedOrigins = (process.env.CLIENT_ORIGIN ||
    "https://kambaz-react-web-canvas.netlify.app")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

app.use(
    cors({
        origin(origin, callback) {
            if (!origin) {
                callback(null, true);
                return;
            }
            if (allowedOrigins.includes(origin)) {
                callback(null, origin);
                return;
            }
            callback(null, false);
        },
        credentials: true,
    })
);

const sessionOptions = {
    secret: process.env.SESSION_SECRET || "dev-only-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: "none",
        secure: true,
    },
};

// if (process.env.NODE_ENV !== "development") {
//     sessionOptions.proxy = true;
//     sessionOptions.cookie = {
//         sameSite: "none",
//         secure: true,
//         domain: process.env.NODE_SERVER__DOMAIN,
//     };
// }
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