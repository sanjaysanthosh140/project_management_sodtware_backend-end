"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_auth_1 = require("./user_auth");
const passport_1 = __importDefault(require("passport"));
require("./Oauth2/google_oauth");
require("./Oauth2/github_oauth");
const user_Proj_controller_1 = require("./user_Proj_controller");
const Router = express_1.default.Router();
Router.post("/signup", (req, res) => {
    const { name, email, department, password } = req.body;
    (0, user_auth_1.user_auth)(name, email, department, password)
        ?.then((data) => {
        if (data)
            res.json({ status: true });
    })
        .catch((error) => {
        console.log(error);
    });
});
Router.post("/login", (req, res) => {
    const { email, password } = req.body;
    (0, user_auth_1.user_authorization)(email, password)
        .then((data) => {
        if (data) {
            res.json({ status: true, token: data });
            console.log(data);
        }
        else {
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
Router.get("/google/auth", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
Router.get("/oauth2/redirect/google", passport_1.default.authenticate("google", {
    successRedirect: "http://localhost:5173/app/gateway",
    failureRedirect: "http://localhost:3000/login",
}));
Router.get("/oauth2/github", passport_1.default.authenticate("github", {
    scope: ["read:user", "user:email", "repo"],
}));
Router.get("/git_hub/oauth/callback", passport_1.default.authenticate("github", {
    successRedirect: "http://localhost:5173/app/gateway",
    failureRedirect: "http://localhost:5173/login",
}));
Router.get("/employee_included_proj", user_Proj_controller_1.emp_included_proj);
Router.get("/emp_proj-tasks/:projectId", user_Proj_controller_1.emp_proj_tasks);
Router.post("/add_multiple_todos", user_Proj_controller_1.add_multiple_todos);
Router.get("/achive_created_todo_list", user_Proj_controller_1.achive_todo_list);
Router.get("/employee_profile", user_Proj_controller_1.employee_profile);
Router.get("/messages/:roomType", user_Proj_controller_1.getchatbox);
Router.get("/employeelists", user_Proj_controller_1.get_employees);
Router.post("/groups/create", user_Proj_controller_1.new_group);
Router.get("/groups/user", user_Proj_controller_1.get_included_grp);
// Router.delete("/messages/:msgId",delete_msg)
exports.default = Router;
