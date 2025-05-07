
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const Authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    (req as any).user = { id: payload.id }; 
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};
