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

/** ADMIN + FACULTY: courses, modules, users, and any non-assignment writes */
export const requireFacultyOrAdmin = requireRoles("ADMIN", "FACULTY");

/** ADMIN + FACULTY + TA: assignments only */
export const requireAssignmentStaff = requireRoles("ADMIN", "FACULTY", "TA");

/** For the client: who can edit what (everyone can use GETs to view; only these roles get write buttons) */
export function permissionsForRole(role) {
    const facultyOrAdmin = role === "ADMIN" || role === "FACULTY";
    return {
        canManageCourses: facultyOrAdmin,
        canManageModules: facultyOrAdmin,
        canManageAssignments: facultyOrAdmin || role === "TA",
        canManageUsers: facultyOrAdmin,
        canCreateCourse: facultyOrAdmin,
    };
}
