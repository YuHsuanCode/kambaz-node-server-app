import * as enrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app) {
    const enrollUserInCourse = async (req, res) => {
        const { userId, courseId } = req.body;
        const enrollment = await enrollmentsDao.enrollUserInCourse(userId, courseId);
        res.json(enrollment);
    };
    app.post("/api/enrollments", enrollUserInCourse);
}
