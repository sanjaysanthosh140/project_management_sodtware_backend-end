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
  create_hr_head_task,
  createDepartments,
  delete_daily_report,
  delete_groupe,
  delete_project,
  deleteadmins,
  deleteDepartments,
  deleteEmploye,
  edit_daily_report,
  edit_group,
  edit_project,
  Employe_logs,
  Fetch_projects,
  fetchDepartments,
  fetchUsers,
  get_admin_profile,
  get_admins,
  get_hr_head_tasks,
  get_group,
  hr_projects_progress,
  project_overview,
  read_reports,
  read_reports_by_employee,
  read_tasks,
  task_controller,
  update_admin,
  update_assigned_tasks,
  update_hr_head_task,
  update_project,
  updateadminpasswods,
  updateAttendance,
  updateDepartments,
  updateEmplye,
  updateUserpassword,
  work_Reports,
  delete_hr_head_task,
  emplyee_perfomance_data,
  // create_hybread_team,
  // create_hybread_custom_project,
  // get_everything,
  // everything_team_task,
  // update_hybread_project_status,
  create_simple_custom_project,
  get_simple_custom_projects,
  update_simple_project_status,
  add_simple_project_global_task,
  update_simple_project_global_task_status,
  get_simple_custom_project_by_id,
  update_simple_custom_project,
  get_simple_proj_tasks,
  update_simple_proj_task,
  get_desk_short,
  delete_simple_project,
  delete_simple_project_global_task,
  add_to_accounts,
  account_billings,
  edit_accountBilling,
  delete_account_datas,
  production_activities,
  get_production_data,
  delete_production_data,
  edit_production_data,
  get_reports,
  heads_reports,
} from "./task_controllers";
import multer from "multer";
const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads")
  },
  filename: function (req, file, cb) {
    const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniquesuffix + '.jpg')
  }
});

const upload = multer({ storage: Storage });

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
Router.put("/update_admin/:id", update_admin); ////

//departments
Router.post("/addDep", createDepartments);
Router.get("/departments", fetchDepartments);
Router.delete("/deleteDept/:id", deleteDepartments);
Router.put("/Editdepartments/:id", updateDepartments);
Router.get("/hr_projects_progress", hr_projects_progress);
Router.post("/attendance", updateAttendance);
Router.get("/employe_log", Employe_logs);

Router.post("/Daily_reports", work_Reports);
Router.put("/update_report/:editingId", edit_daily_report);
Router.delete("/delete_report/:id", delete_daily_report);
Router.get("/reports", read_reports);
Router.get("/reports/employee/:employeeId", read_reports_by_employee);

Router.post("/create_project", create_pojects);
Router.get("/employes", availableEmployess);
Router.get("/headProj", Fetch_projects);
Router.post("/assigned_tasks", assigned_tasks);
Router.get("/check_assigned_tasks/:id", check_assigned_taks);
Router.put("/assigned_tasks/:id", update_assigned_tasks);

Router.post("/hr_assigned_tasks", create_hr_head_task);
Router.get("/hr_assigned_tasks", get_hr_head_tasks);
Router.put("/hr_assigned_tasks/:id", update_hr_head_task);
Router.delete("/hr_assigned_tasks/:id", delete_hr_head_task);

//  projoverview
Router.get("/project-overview/:project_id", project_overview);
Router.delete("/edit_project/:id", edit_project);
Router.put("/updateProj/:id", update_project);
Router.post("/updatePassword", updateUserpassword);
Router.get("/get_admins", get_admins);
Router.delete("/delete_admin/:id", deleteadmins);
Router.put("/updatePassword_admin", updateadminpasswods);
Router.get("/admin_profile", get_admin_profile);
Router.delete("/delete_proj/:id", delete_project);
// group 
Router.delete("/group_delete/:selectedGroup", delete_groupe);
Router.get("/groups/:selectedGroup", get_group);
Router.put("/update_groups/:selectedGroup", edit_group);

//ceo_controllers
Router.get("/employee_performance", emplyee_perfomance_data);
// hybread options
// Router.get("/hybread", create_hybread_team);
// Router.post("/custom_project", create_hybread_custom_project);
// Router.get("/everything", get_everything);
// Router.post("/everything_team_task", everything_team_task);
// Router.put("/update_hybread_project_status", update_hybread_project_status);

Router.post("/simple_custom_project", create_simple_custom_project);
Router.get("/simple_custom_projects", get_simple_custom_projects);
Router.put("/update_simple_project_status", update_simple_project_status);
Router.post("/simple_custom_project_global_task", add_simple_project_global_task);
Router.put("/simple_custom_project_global_task", update_simple_project_global_task_status);

Router.get("/simple_custom_project/:pro_id", get_simple_custom_project_by_id);
Router.put("/simple_custom_project/:edit_id", update_simple_custom_project);
Router.get("/update_simple_proj_task/:proj_id", get_simple_proj_tasks);
Router.put("/update_project_tasks", update_simple_proj_task);
Router.delete("/simple_custom_project/:pro_id", delete_simple_project);
Router.put("/delete_simple_project_global_task", delete_simple_project_global_task);


// Accounts management feacture 
Router.post("/add_to_accounts",add_to_accounts);
Router.get("/billings",account_billings);
Router.put("/update_account_billings_data/:pro_id",edit_accountBilling);
Router.delete("/remove_account_data/:id",delete_account_datas);
// Router.put("/update_account_billings_data/:pro_id",)
// feature for admin_
Router.post("/production-activities",production_activities);
Router.get("/production_activity",get_production_data);
Router.delete("/production-activities/:id",delete_production_data);
Router.put("/production-activitys-edits/:id",edit_production_data);

Router.get("/get_reports",get_reports);

Router.post("/desktop_shorts", upload.single('short'), get_desk_short);
Router.get("/head_reports",heads_reports);
export default Router;
