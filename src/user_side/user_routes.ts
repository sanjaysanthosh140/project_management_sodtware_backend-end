import express from "express";
import { Request, Response } from "express";
import { user_auth, user_authorization } from "./user_auth";
import { error } from "node:console";
import passport from "passport";
import "./Oauth2/google_oauth";
import "./Oauth2/github_oauth";
import {
  achive_todo_list,
  add_multiple_todos,
  delete_msg,
  emp_included_proj,
  emp_proj_tasks,
  employee_profile,
  get_employees,
  get_included_grp,
  getchatbox,
  new_group,
} from "./user_Proj_controller";
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
      if (data) {
        res.json({ status: true, token: data });
        console.log(data);
      } else {
        res
          .status(401)
          .json({ status: false, message: "invalid email or password" });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({
          status: false,
          message: "server error try again later",
          error: error,
        });
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
Router.get("/achive_created_todo_list", achive_todo_list);
Router.get("/employee_profile", employee_profile);

Router.get("/messages/:roomType", getchatbox);
Router.get("/employeelists", get_employees);
Router.post("/groups/create", new_group);
Router.get("/groups/user", get_included_grp);
// Router.delete("/messages/:msgId",delete_msg)
export default Router;
