import { Request, Response, NextFunction } from "express";
import { UserRole } from "../../types/User.types";

const allowRoles =
  (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        message: "Access denied",
      });
      return;
    }

    next();
  };

export { allowRoles };
