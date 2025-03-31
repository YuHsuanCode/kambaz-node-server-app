import Database from "../Database/index.js";
import {v4 as uuidv4} from "uuid";

//a course is created, implement this func for user to enroll a course
export function enrollUserInCourse(userId, courseId) {
    const { enrollments } = Database;
    enrollments.push({ _id: uuidv4(), user: userId, course: courseId });
}; 

export function findEnrollmentsForUser(userId){
    const {enrollments} = Database;
    return enrollments.filter((enrollment) => enrollment.user === userId);
};

export function deleteEnrollment(enrollmentId){
    const {enrollments} = Database;
    Database.enrollments = enrollments.filter((enrollment) => enrollment._id !== enrollmentId);
};

