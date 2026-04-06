import { Server } from "socket.io";
import express, { NextFunction } from "express";
import http from "http";
import { chat_controllers } from "../db_controllers/socket.io.chat_controllers/socket.io.messages";
import message_model from "../db_controllers/db_models/user_side/socket.io.message_schema";
import { user_project_controller } from "./user_controller";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://alkor-9606a.web.app","http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  let token = socket.handshake.auth.token;
  console.log("message token",token);
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  socket.on("leave_room", (room) => {
    socket.leave(room);
    console.log(`User ${socket.id} left room: ${room}`);
  });

  socket.on("typing", (data) => {
    socket.to(data.room).emit("typing", data);
  });

  socket.on("stop_typing", (data) => {
    socket.to(data.room).emit("stop_typing", data);
  });

  socket.on("send_message", (data) => {
    console.log("Message received:", data);

    if (data.room) {
      socket.to(data.room).emit("receive_message", data);
      chat_controllers(message_model).store_messages(token, data);
    } else {
      socket.broadcast.emit("receive_message", data);
    }
  });

  socket.on("delete_message", async (val) => {
    console.log("message", val.roomId, val.messageId, token);
    let deleteone = await user_project_controller(message_model);
    // console.log(val);
    let deleted = await deleteone.delete_message(val.messageId, token);
    // console.log("del", deleted);
    if (deleted) {
      console.log("work");
      // Use io.to(roomId).emit to send to ALL users in the room, including sender
      // Emit with name 'message_deleted' and payload { roomId, messageId } to match frontend expectations
      io.to(val.roomId).emit("message_deleted", {
        roomId: val.roomId,
        messageId: val.messageId,
      });
    }
  });
  socket.on("disconnect", () => {   
    console.log("a user disconnected", socket.id);
  });
});

export { io, server, app };
    