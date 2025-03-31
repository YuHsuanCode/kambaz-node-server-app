import * as dao from "./dao.js";
//let currentUser = null;
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {

    //user
    const createUser = (req, res)=> { 
        const newUser = dao.createUser(req.body);
        res.json(newUser);
    };
    app.post("/api/users", createUser);

    const deleteUser = (req, res)=> { 
        const userId = req.params.userId;
        dao.deleteUser(userId);
        res.sendStatus(200);
    };
    app.delete("/api/users/:userId", deleteUser);

    const findAllUsers = (req, res)=> { 
        const users = dao.findAllUsers();
        res.json(users);
    };
    app.get("/api/users", findAllUsers);

    const findUserById = (req, res)=> { 
        const userId = req.params.userId;
        const user = dao.findUserById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    };
    app.get("/api/users/:userId", findUserById);

    const updateUser = (req, res)=> { 
        const userId = req.params.userId;
        const userUpdates = req.body;
        dao.updateUser(userId, userUpdates);
        const currentUser = dao.findUserById(userId);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };
    app.put("/api/users/:userId", updateUser);

    //sign up
    //create new user and remember as currently logged in user
    const signup = (req, res)=> {
        const user = dao.findUserByUsername(req.body.username);
        if(user){
            res.status(400).json({message: "Username already taken"});
            return;
        }
        //create new use and store it in the session's currentUser property
        const currentUser = dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };
    app.post("/api/users/signup", signup);

    const signin = (req, res)=> { 
        const {username, password} = req.body;
        const currentUser = dao.findUserByCredentials(username, password);
        if(currentUser){
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } else {
            res.status(401).json({message: "Unable to login. Try again later."});
        }
    };
    app.post("/api/users/signin", signin);
    
    const signout = (req, res)=> { 
        req.session.destroy();
        res.sendStatus(200);
    };
    app.post("/api/users/signout", signout);

    const profile = async (req, res)=> { 
        //already signed in, the currentUser can be retrieved from the session by using the profile route
        const currentUser = req.session["currentUser"];
        if(!currentUser){
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    };
    app.post("/api/users/profile", profile);

    //courses
    const findCoursesForEnrolledUser = (req, res) =>{
        let{userId} = req.params;
        if(userId === "current"){
            const currentUser = req.session["currentUser"];
            if(!currentUser){
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        const courses = courseDao.findCoursesForEnrolledUser(userId);
        res.json(courses);
    };
    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);

    const createCourse = (req, res)=> {
        const currentUser = req.session["currentUser"];
        const newCourse = courseDao.createCourse(req.body);
        enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
        res.json(newCourse);
    };
    app.post("/api/users/current/courses", createCourse);
}