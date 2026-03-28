import * as dao from "./dao.js";
import Database from "../Database/index.js";
import * as modulesDao from "../Modules/dao.js";
import * as assignmentsDao from "../Assignments/dao.js";
import { requireFacultyOrAdmin, requireAssignmentStaff } from "../auth.js";

export default function CourseRoutes(app) {
    app.post("/api/courses", requireFacultyOrAdmin, (req, res) => {
        const course = {...req.body, _id: new Date().getTime().toString()};
        Database.courses.push(course);
        res.send(course);
    });

    app.get("/api/courses", (req,res) => {
        const courses = dao.findAllCourses();
        //const courses = Database.courses;
        res.send(courses);
    });

    app.get("/api/courses/:courseId", (req, res) => {
        const { courseId } = req.params;
        const course = dao.findCourseById(courseId);
        if (!course) {
            res.status(404).json({ message: "Course not found" });
            return;
        }
        res.json(course);
    });

    app.delete("/api/courses/:courseId", requireFacultyOrAdmin, (req,res)=>{
        const {courseId} = req.params;
        const status = dao.deleteCourse(courseId);
        res.send(status); // deletion successfulr, respond with status 204
    });

    //put route that parses the id of the course as a path parameter and updates uses the DAO func
    //to update the corresponding course with the updates in HTTP request body
    app.put("/api/courses/:courseId", requireFacultyOrAdmin, (req,res) => {
        const{courseId} = req.params;
        const courseUpdates = req.body;
        const updated = dao.updateCourse(courseId, courseUpdates);
        if (!updated) {
            res.status(404).json({ message: "Course not found" });
            return;
        }
        res.json(updated);
    });


    app.post("/api/courses/:courseId/modules", requireFacultyOrAdmin, (req,res)=>{
        const {courseId} = req.params;
        const module = {
            ...req.body,
            course: courseId,
        };
        const newModule = modulesDao.createModule(module);
        res.send(newModule);
    });
    
    app.get("/api/courses/:courseId/modules", (req,res)=>{
        const {courseId} = req.params;
        const modules = modulesDao.findModulesForCourse(courseId);
        res.json(modules);
    });

    app.post("/api/courses/:courseId/assignments", requireAssignmentStaff, (req,res)=>{
        const {courseId} = req.params;
        const assignment = {
            ...req.body,
            course: courseId,
        };
        const newAssignment = assignmentsDao.createAssignment(assignment);
        res.send(newAssignment);
    });

    app.get("/api/courses/:courseId/assignments", (req,res)=>{
        const {courseId} = req.params;
        const assignments = assignmentsDao.findAssignmentsForCourse(courseId);
        res.json(assignments);
    });
}