"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowRoles = void 0;
const allowRoles = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        res.status(403).json({
            message: "Access denied",
        });
        return;
    }
    next();
};
exports.allowRoles = allowRoles;
