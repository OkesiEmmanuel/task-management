import { Server, Socket } from "socket.io";

export function setupSocketIO(io: Server) {
  io.on("connection", (socket: Socket) => {
    const userId = socket.handshake.query.userId as string;

    if (!userId) {
      socket.disconnect();
      return;
    }

    socket.join(userId); // Join room for real-time updates
    console.log(`User ${userId} connected to WebSocket`);

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected`);
    });
  });
}
