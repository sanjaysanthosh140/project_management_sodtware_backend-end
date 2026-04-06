"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./user_side/user_routes"));
const db_connection_1 = __importDefault(require("./db_controllers/db_connection"));
const admin_routes_1 = __importDefault(require("./admin_side/admin-routes"));
const cors_1 = __importDefault(require("cors"));
// import passport from "passport";
// import express_session from "express-session";
// const app = express();
let port = 8080;
const socket_io_1 = require("./user_side/socket.io");
socket_io_1.app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://alkor-9606a.web.app", "https://alkor-9606a.firebaseapp.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    //credentials: true
}));
(0, db_connection_1.default)();
// app.use(
// express_session({
// secret: "keyboard cat",
// resave: false,
// saveUninitialized: true,
// cookie: {
// secure: false,
// httpOnly: true,
// maxAge: 24 * 2 * 60 * 60 * 1000,
// },
// }),
// );
// 
// app.use(passport.initialize());
// app.use(passport.session());
// 
socket_io_1.app.use(express_1.default.json());
socket_io_1.app.use("/", user_routes_1.default);
socket_io_1.app.use("/admin", admin_routes_1.default);
socket_io_1.server.listen(port, '0.0.0.0', () => {
    console.log(`server is running on ${port}`);
});
