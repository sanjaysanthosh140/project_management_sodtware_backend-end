import express from "express";
import user_side from "./user_side/user_routes";
import connectiion from "./db_controllers/db_connection";
import admin_side from "./admin_side/admin-routes";
import cors from "cors";
// import passport from "passport";
// import express_session from "express-session";
const app = express();
const PORT = 8080;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    //credentials: true
  }),
);

connectiion();
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

app.use(express.json());
app.use("/", user_side);
app.use("/admin", admin_side);

app.listen(PORT, '0.0.0.0' ,() => {
  console.log(`server is running on ${PORT}`);
});
