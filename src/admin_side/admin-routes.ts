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
  create_pojects,
  createDepartments,
  deleteDepartments,
  deleteEmploye,
  Employe_logs,
  Fetch_projects,
  fetchDepartments,
  fetchUsers,
  project_overview,
  read_reports,
  read_tasks,
  task_controller,
  update_assigned_tasks,
  updateAttendance,
  updateDepartments,
  updateEmplye,
  work_Reports,
} from "./task_controllers";
Router.post("/verify_authorization", (req: Request, res: Response) => {
  const { position, name, department, password } = req.body;
  if (position && name && department && password) {
    const saltrount = 10;
    const salt = bcrypt.genSaltSync(saltrount);
    const hash2 = bcrypt.hashSync(password, salt);

    const admin_obj = new admin_roles_models({
      position: position,
      name: name,
      department: department,
      password: hash2,
    });
    admin_obj
      .save()
      .then((data) => {
        if (data) {
          let id: any = data._id;
          const tokens = jwt.sign({ id }, "secret_key");
          // console.log(tokens);
          res.status(200).json({ position: position, token: tokens });
        }
      })
      .catch((error) => {
        console.log(error);
      });
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

//departments
Router.post("/addDep", createDepartments);
Router.get("/departments", fetchDepartments);
Router.delete("/deleteDept/:id", deleteDepartments);
Router.put("/Editdepartments/:id", updateDepartments);

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

export default Router;
