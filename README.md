# 💬 Chitti

## 💡 Introduction

**Chitti** is a real-time chat application built with modern web technologies, offering smooth communication through features like live messaging, chat rooms, authentication, and responsive design. Whether you're building for friends or community groups, Chitti delivers speed and simplicity in one place.

---

## 🛠️ Technologies Used

### 🖥️ Client (Next.js App)

- **Next.js** - Frontend framework using App Router
- **TypeScript** - Strongly typed, modern JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **NextAuth.js** - Authentication (Google or credentials)
- **Prisma** - Database ORM (PostgreSQL)
- **Socket.IO Client** - Real-time messaging

### 🖧 Server (Node.js + Socket.IO)

- **Express.js** - Server framework
- **Socket.IO** - WebSockets for real-time communication
- **CORS** - Cross-origin handling
- **Axios** - HTTP client for API calls
- **dotenv** - Secure environment variables

---

## 🚀 Getting Started

<!-- ### 📦 Cloning the Repository

```bash
git clone https://github.com/dhruv7tripathi/chitti.git
cd chitti -->

🧑‍💻 Client Setup

cd client
npm install
🔐 Configuration
Create a .env file in /client/ using the example below:

DATABASE_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000

▶️ Running the Client

npm run dev

🖥️ Server Setup

cd server
npm install
🔐 Configuration
Create a .env file in /server/ using the example below:

env

PORT=5000
CLIENT_URL=http://localhost:3000

▶️ Running the Server
bash

npm run dev

🤝 Contribution Guide
Fork the repo

Create a new branch:
git checkout -b feature-branch-name

Commit your changes:
git commit -m "Add feature description"

Push to the branch:
git push origin feature-branch-name

Create a Pull Request

Your contributions are warmly welcomed! Here's how to get started:
