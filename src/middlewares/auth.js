const authMiddleware = (req, res, next) => {
    const userRole = req.headers["x-user-role"];
    
    if (!userRole) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No role provided in X-User-Role header"
        });
    }

    const validRoles = ["user", "admin"];
    if (!validRoles.includes(userRole)) {
        return res.status(401).json({
            success: false,
            message: `Unauthorized: Invalid role '${userRole}'. Must be one of: ${validRoles.join(", ")}`
        });
    }

    req.user = { role: userRole };
    next();
};

const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not authenticated"
            });
        }

        if (!Array.isArray(allowedRoles)) {
            allowedRoles = [allowedRoles];
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden: Insufficient permissions. Required roles: ${allowedRoles.join(", ")}`
            });
        }

        next();
    };
};

const adminOnly = requireRole("admin");


const userAccess = requireRole(["user", "admin"]);

module.exports = {
    authMiddleware,
    requireRole,
    adminOnly,
    userAccess
};
