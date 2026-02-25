import express from "express";
import { Request, Response } from "express";
import { user_auth, user_authorization } from "./user_auth";
import { error } from "node:console";
import passport from "passport";
import "./Oauth2/google_oauth";
import "./Oauth2/github_oauth";
import { add_multiple_todos, emp_included_proj, emp_proj_tasks } from "./user_Proj_controller";
const Router = express.Router();
Router.post("/signup", (req: Request, res: Response) => {
  const { name, email, department, password } = req.body;
  user_auth(name, email, department, password)
    ?.then((data) => {
      if (data) res.json({ status: true });
    })
    .catch((error) => {
      console.log(error);
    });
});

Router.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  user_authorization(email, password)
    .then((data) => {
      if (data) res.json({ status: true, token: data });
    })
    .catch((error) => {
      console.log("error form catch", error);
    });
});

Router.get(
  "/google/auth",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

Router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173/app/gateway",
    failureRedirect: "http://localhost:3000/login",
  }),
);

Router.get(
  "/oauth2/github",
  passport.authenticate("github", {
    scope: ["read:user", "user:email", "repo"],
  }),
);
Router.get(
  "/git_hub/oauth/callback",
  passport.authenticate("github", {
    successRedirect: "http://localhost:5173/app/gateway",
    failureRedirect: "http://localhost:5173/login",
  }),
);

Router.get("/employee_included_proj", emp_included_proj);
Router.get("/emp_proj-tasks/:projectId", emp_proj_tasks);
Router.post("/add_multiple_todos", add_multiple_todos);
export default Router;
