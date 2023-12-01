// src/services/socketService.ts
import { Server, Socket } from "socket.io";
import { createServer } from "http";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Update with your client's origin
    methods: ["GET", "POST"],
  },
});

const activeMembers = new Map<string, number>();

io.on("connection", (socket: Socket) => {
  console.log("A user connected");

  // Listen for chat messages
  socket.on("join-room", (data: { courseId: string }) => {
    console.log(data, " data");

    socket.join(data.courseId);

    if (activeMembers.has(data.courseId)) {
      activeMembers.set(data.courseId, activeMembers.get(data.courseId)! + 1);
    } else {
      activeMembers.set(data.courseId, 1);
    }

    io.to(data.courseId).emit("active-members", {
      courseId: data.courseId,
      members: activeMembers.get(data.courseId),
    });
  });

  socket.on("message", (data) => {
    console.log(data, " essage");

    io.to(data.courseId).emit("messageResponse", data);
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log("User disconnected");
    const rooms = Array.from(socket.rooms);
    rooms.forEach((room) => {
      if (room !== socket.id) {
        if (activeMembers.has(room)) {
          activeMembers.set(room, activeMembers.get(room)! - 1);
          io.to(room).emit("active-members", {
            courseId: room,
            count: activeMembers.get(room),
          });
        }
      }
    });
  });
});

httpServer.listen(4000, () => {
  console.log("Socket.IO listening on *:4000");
});

export { io };
