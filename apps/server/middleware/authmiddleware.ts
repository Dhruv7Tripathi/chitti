import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

interface AuthRequest extends Request {
  userId?: string;
}

const SECRET_KEY = process.env.SECRET_KEY as string;

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY environment variable is not set");
}

export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "Authorization header is missing" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Token is missing" });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

