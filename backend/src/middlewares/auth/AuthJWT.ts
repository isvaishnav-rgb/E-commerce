import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
const User = require("../../models/User.model");

const authJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("userId" in decoded)
    ) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    const user = await User.findById(decoded.userId).select("-password -otp");

    if (!user || !user.isActive || !user.isUserLoggedIn) {
      res.status(401).json({ message: "User not valid" });
      return;
    }

    req.user = user;
    next();
  } 
  catch (err) {
    if (err instanceof Error) {
      res.status(401).json({ message: "Invalid token", error: err.message });
      return;
    }
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authJWT

