/**
 * Session + role checks. Roles from seed users: ADMIN, FACULTY, TA, STUDENT.
 */

export function requireSession(req, res, next) {
    if (!req.session?.currentUser) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    next();
}

export function requireRoles(...allowedRoles) {
    return (req, res, next) => {
        const user = req.session?.currentUser;
        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        if (!allowedRoles.includes(user.role)) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        next();
    };
}

/** ADMIN + FACULTY: courses, modules, users, enrollments management, create course */
export const requireFacultyOrAdmin = requireRoles("ADMIN", "FACULTY");

/** ADMIN + FACULTY + TA: assignments (create / update / delete) */
export const requireAssignmentStaff = requireRoles("ADMIN", "FACULTY", "TA");
