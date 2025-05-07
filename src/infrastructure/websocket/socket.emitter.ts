// src/websocket/socketEmitter.ts
import { Server } from "socket.io";

let io: Server;

export function initSocket(ioInstance: Server) {
  io = ioInstance;
}

export function emitToUser(userId: string, event: string, data: any) {
  if (!io) {
    throw new Error("Socket.IO is not initialized");
  }

  io.to(userId).emit(event, data);  // Emit to the specific user room
}

export function emitToAll(event: string, data: any) {
  if (!io) {
    throw new Error("Socket.IO is not initialized");
  }

  io.emit(event, data);  // Emit to all connected users
}
