import express from "express";
const app = express();
const Router = express.Router();
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { admin_roles_models } from "../db_controllers/db_models/admin_roles_schema";
import tasks_module_it from "../db_controllers/db_models/task_schemas/tasks_schema";
import jwt from "jsonwebtoken";
import {
  addEmploye,
  assigned_tasks,
  availableEmployess,
  check_assigned_taks,
  create_admins,
  create_pojects,
  createDepartments,
  deleteDepartments,
  deleteEmploye,
  edit_project,
  Employe_logs,
  Fetch_projects,
  fetchDepartments,
  fetchUsers,
  hr_projects_progress,
  project_overview,
  read_reports,
  read_tasks,
  task_controller,
  update_assigned_tasks,
  update_project,
  updateAttendance,
  updateDepartments,
  updateEmplye,
  work_Reports,
} from "./task_controllers";
Router.post("/verify_authorization", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (email && password) {
    console.log(email, password);
    let admin: any = await admin_roles_models
      .findOne({
        email: email,
      })
      .catch((error) => {
        console.log(error);
      });
    !admin
      ? res.status(404).json({ status: false, message: "email not found" })
      : null;
    let hash = admin.password;
    let id = admin._id;
    let authorized = bcrypt.compareSync(password, hash);
    if (authorized) {
      const token = jwt.sign({ id }, "secret_key");
      !token
        ? null
        : res.json({ status: true, token: token, position: admin.role });
    } else {
      res.status(401).json({ status: false, message: "password incorrect" });
    }
  }
});

Router.post("/add_task", (req: Request, res: Response) => {
  const task_Data = req.body;
  task_controller(task_Data, tasks_module_it)
    .then((data) => {
      if (data) res.json({ message: true });
    })
    .catch((error) => {
      console.log(error);
    });
});

Router.get("/get_kanban_task", (req: Request, res: Response) => {
  read_tasks(tasks_module_it).then((data) => {
    res.json(data);
  });
});

Router.get("/users", fetchUsers);
Router.post("/employes", addEmploye);
Router.delete("/deleteEmp/:id", deleteEmploye);
Router.put("/updateEmploye/:id", updateEmplye);
Router.post("/add_admins", create_admins);

//departments
Router.post("/addDep", createDepartments);
Router.get("/departments", fetchDepartments);
Router.delete("/deleteDept/:id", deleteDepartments);
Router.put("/Editdepartments/:id", updateDepartments);
Router.get("/hr_projects_progress", hr_projects_progress);
Router.post("/attendance", updateAttendance);
Router.get("/employe_log", Employe_logs);

Router.post("/Daily_reports", work_Reports);
Router.get("/reports", read_reports);

Router.post("/create_project", create_pojects);
Router.get("/employes", availableEmployess);
Router.get("/headProj", Fetch_projects);
Router.post("/assigned_tasks", assigned_tasks);
Router.get("/check_assigned_tasks/:id", check_assigned_taks);
Router.put("/assigned_tasks/:id", update_assigned_tasks);


//  projoverview
Router.get("/project-overview/:project_id", project_overview);
Router.delete("/edit_project/:id", edit_project);
Router.put("/updateProj/:id", update_project);

export default Router;
