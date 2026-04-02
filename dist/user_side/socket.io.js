"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.server = exports.io = void 0;
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_messages_1 = require("../db_controllers/socket.io.chat_controllers/socket.io.messages");
const socket_io_message_schema_1 = __importDefault(require("../db_controllers/db_models/user_side/socket.io.message_schema"));
const user_controller_1 = require("./user_controller");
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "https://alkor-e2e89.web.app",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    },
});
exports.io = io;
io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    let token = socket.handshake.auth.token;
    console.log("message token", token);
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
            (0, socket_io_messages_1.chat_controllers)(socket_io_message_schema_1.default).store_messages(token, data);
        }
        else {
            socket.broadcast.emit("receive_message", data);
        }
    });
    socket.on("delete_message", async (val) => {
        console.log("message", val.roomId, val.messageId, token);
        let deleteone = await (0, user_controller_1.user_project_controller)(socket_io_message_schema_1.default);
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
