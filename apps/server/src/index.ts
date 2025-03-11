// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import cors from "cors";
// import { PrismaClient } from "@prisma/client";

// const app = express();
// app.use(cors());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

// const prisma = new PrismaClient();

// io.on("connection", (socket) => {
//   console.log(`✅ A user connected: ${socket.id}`);

//   socket.on("joinRoom", async (room) => {
//     socket.join(room);
//     console.log(`📌 User ${socket.id} joined room: ${room}`);

//     // Fetch previous messages from DB
//     const messages = await prisma.message.findMany({
//       where: { room },
//       orderBy: { createdAt: "asc" },
//     });

//     socket.emit("previousMessages", messages);
//   });

//   socket.on("sendMessage", async ({ room, message, sender }) => {
//     console.log(`📩 Message in Room ${room}: ${message}`);

//     // Save message to database
//     const savedMessage = await prisma.message.create({
//       data: { room, text: message, sender },
//     });

//     // Send message to everyone in the room
//     io.to(room).emit("receiveMessage", savedMessage);
//   });

//   socket.on("disconnect", () => {
//     console.log(`❌ User disconnected: ${socket.id}`);
//   });
// });

// server.listen(4000, () => {
//   console.log("🚀 Server running at http://localhost:4000");
// });

// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import cors from "cors";
// import { PrismaClient } from "@prisma/client";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// import { authenticateUser } from "../middleware/authmiddleware";
// import bcrypt from "bcrypt";

// // Load environment variables
// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "*" },
// });

// // Initialize Prisma client
// const prisma = new PrismaClient();

// const SECRET_KEY = process.env.SECRET_KEY;
// if (!SECRET_KEY) {
//   throw new Error("SECRET_KEY environment variable is not set");
// }

// app.post("/register", async (req: any, res: any) => {
//   const { username, email, password } = req.body;

//   if (!username || !email || !password) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     // Hash password before storing
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await prisma.user.create({
//       data: {
//         username,
//         email,
//         password: hashedPassword
//       },
//     });

//     // Don't send password back in response
//     const { password: _, ...userWithoutPassword } = user;

//     res.status(201).json({
//       message: "User registered successfully",
//       user: userWithoutPassword
//     });
//   } catch (error) {
//     // Handle potential unique constraint violations
//     if ((error as any).code === 'P2002') {
//       return res.status(400).json({
//         error: "Username or email already exists"
//       });
//     }

//     res.status(400).json({
//       error: "Error registering user"
//     });
//   }
// });

// // 🔹 Login User
// app.post("/login", async (req: any, res: any) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: "Email and password are required" });
//   }

//   try {
//     const user = await prisma.user.findUnique({ where: { email } });

//     if (!user) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     // Compare password with hashed password
//     const passwordValid = await bcrypt.compare(password, user.password);
//     if (!passwordValid) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
//     res.json({
//       message: "Login successful",
//       token,
//       userId: user.id,
//       username: user.username
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Error logging in" });
//   }
// });

// // 🔹 Create Room - Uses authenticateUser middleware
// app.post("/rooms", authenticateUser, async (req, res) => {
//   const { name } = req.body;

//   if (!name) {
//     return res.status(400).json({ error: "Room name is required" });
//   }

//   try {
//     const room = await prisma.room.create({
//       data: { name }
//     });

//     res.status(201).json(room);
//   } catch (error) {
//     if ((error as any).code === 'P2002') {
//       return res.status(400).json({
//         error: "A room with this name already exists"
//       });
//     }

//     res.status(400).json({ error: "Error creating room" });
//   }
// });

// // 🔹 Get All Rooms
// app.get("/rooms", async (req, res) => {
//   try {
//     const rooms = await prisma.room.findMany({
//       orderBy: { createdAt: 'desc' }
//     });

//     res.json(rooms);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching rooms" });
//   }
// });

// app.get("/rooms/:roomId", async (req: any, res: any) => {
//   const { roomId } = req.params;

//   try {
//     const room = await prisma.room.findUnique({
//       where: { id: roomId },
//       include: {
//         messages: {
//           include: {
//             sender: {
//               select: {
//                 id: true,
//                 username: true
//               }
//             }
//           },
//           orderBy: { createdAt: 'asc' }
//         }
//       }
//     });

//     if (!room) {
//       return res.status(404).json({ error: "Room not found" });
//     }

//     res.json(room);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching room details" });
//   }
// });


// io.on("connection", (socket) => {
//   console.log(`✅ A user connected: ${socket.id}`);

//   socket.on("joinRoom", async ({ roomId, userId }) => {
//     socket.join(roomId);
//     console.log(`📌 User ${userId} joined room: ${roomId}`);

//     // Fetch previous messages from DB
//     const messages = await prisma.message.findMany({
//       where: { roomId },
//       include: {
//         sender: {
//           select: {
//             id: true,
//             username: true
//           }
//         }
//       },
//       orderBy: { createdAt: 'asc' },
//     });

//     socket.emit("previousMessages", messages);
//   });

//   // 🔹 Send Message
//   socket.on("sendMessage", async ({ roomId, senderId, text }) => {
//     console.log(`📩 Message in Room ${roomId}: ${text}`);

//     try {
//       const savedMessage = await prisma.message.create({
//         data: {
//           roomId,
//           senderId,
//           text
//         },
//         include: {
//           sender: {
//             select: {
//               id: true,
//               username: true
//             }
//           }
//         }
//       });

//       io.to(roomId).emit("receiveMessage", savedMessage);
//     } catch (error) {
//       console.error("Error saving message:", error);
//       socket.emit("messageError", { error: "Failed to save message" });
//     }
//   });


//   socket.on("typing", ({ roomId, username }) => {
//     socket.to(roomId).emit("userTyping", { username });
//   });
//   socket.on("stopTyping", ({ roomId }) => {
//     socket.to(roomId).emit("userStoppedTyping");
//   });
//   socket.on("disconnect", () => {
//     console.log(`❌ User disconnected: ${socket.id}`);
//   });
// });


// const PORT = process.env.PORT || 4000;
// server.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });


import express, { Request, Response, NextFunction } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { PrismaClient, Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { authenticateUser } from "../middleware/authmiddleware";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Initialize Prisma client
const prisma = new PrismaClient();

const SECRET_KEY = process.env.SECRET_KEY as string;

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY environment variable is not set");
}

interface AuthRequest extends Request {
  userId?: string;
}

app.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // Don't send password back in response
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      res.status(400).json({ error: "Username or email already exists" });
      return;
    }
    res.status(500).json({ error: "Error registering user", details: error });
  }
});

// Login User
app.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ message: "Login successful", token, userId: user.id, username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

// Create Room
app.post("/rooms", authenticateUser, async (req: AuthRequest, res: Response): Promise<void> => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: "Room name is required" });
    return;
  }

  try {
    const room = await prisma.room.create({ data: { name } });
    res.status(201).json(room);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      res.status(400).json({ error: "A room with this name already exists" });
      return;
    }
    res.status(500).json({ error: "Error creating room" });
  }
});

// Get All Rooms
app.get("/rooms", async (req: Request, res: Response): Promise<void> => {
  try {
    const rooms = await prisma.room.findMany({ orderBy: { createdAt: "desc" } });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Error fetching rooms" });
  }
});

// Get Room by ID
app.get("/rooms/:roomId", async (req: Request, res: Response): Promise<void> => {
  const { roomId } = req.params;

  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        messages: {
          include: { sender: { select: { id: true, username: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!room) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ error: "Error fetching room details" });
  }
});

// WebSocket Events
io.on("connection", (socket: Socket) => {
  console.log(`✅ A user connected: ${socket.id}`);

  socket.on("joinRoom", async ({ roomId, userId }: { roomId: string; userId: string }) => {
    socket.join(roomId);
    console.log(`📌 User ${userId} joined room: ${roomId}`);

    try {
      const messages = await prisma.message.findMany({
        where: { roomId },
        include: { sender: { select: { id: true, username: true } } },
        orderBy: { createdAt: "asc" },
      });

      socket.emit("previousMessages", messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  });

  socket.on("sendMessage", async ({ roomId, senderId, text }: { roomId: string; senderId: string; text: string }) => {
    console.log(`📩 Message in Room ${roomId}: ${text}`);

    try {
      const savedMessage = await prisma.message.create({
        data: { roomId, senderId, text },
        include: { sender: { select: { id: true, username: true } } },
      });

      io.to(roomId).emit("receiveMessage", savedMessage);
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("messageError", { error: "Failed to save message" });
    }
  });

  socket.on("typing", ({ roomId, username }: { roomId: string; username: string }) => {
    socket.to(roomId).emit("userTyping", { username });
  });

  socket.on("stopTyping", ({ roomId }: { roomId: string }) => {
    socket.to(roomId).emit("userStoppedTyping");
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
