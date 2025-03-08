// import { Socket } from "socket.io";
// import jwt from "jsonwebtoken";

// const SECRET_KEY = process.env.SECRET_KEY as string;

// export const authenticateSocket = (socket: Socket, next: (err?: any) => void) => {
//   const token = socket.handshake.auth?.token;
//   if (!token) {
//     return next(new Error("Authentication error: Token missing"));
//   }

//   try {
//     const user = jwt.verify(token, SECRET_KEY);
//     socket.data.user = user; // Attach user data to socket
//     next();
//   } catch (error) {
//     return next(new Error("Authentication error: Invalid token"));
//   }
// };
// import jwt from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// const SECRET_KEY = process.env.SECRET_KEY as string;

// export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ error: "Unauthorized: No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
//     const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

//     if (!user) {
//       return res.status(401).json({ error: "Unauthorized: User not found" });
//     }

//     req.body.user = user; // Attach user to the request
//     next();
//   } catch (error) {
//     return res.status(401).json({ error: "Unauthorized: Invalid token" });
//   }
// };


import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { PrismaClient, User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const prisma = new PrismaClient();

const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  throw new Error("SECRET_KEY environment variable is not set");
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};