type Role = "admin" | "provider"

const allowRoles =
    (...roles: Role[]) =>
        (
            req: any,
            res: any,
            next: any
        ) => {
            if (!req.user || !roles.includes(req.user.role)) {
                return res.status(403).json({
                    message: "Access denied",
                });
            }
            next();
        };

module.exports = { allowRoles };
