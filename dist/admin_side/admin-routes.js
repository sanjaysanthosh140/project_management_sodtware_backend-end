"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const Router = express_1.default.Router();
const bcrypt_1 = __importDefault(require("bcrypt"));
const admin_roles_schema_1 = require("../db_controllers/db_models/admin_roles_schema");
const tasks_schema_1 = __importDefault(require("../db_controllers/db_models/task_schemas/tasks_schema"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const task_controllers_1 = require("./task_controllers");
const multer_1 = __importDefault(require("multer"));
const Storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + "-" + uniquesuffix + '.jpg');
    }
});
const upload = (0, multer_1.default)({ storage: Storage });
Router.post("/verify_authorization", async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        console.log(email, password);
        let admin = await admin_roles_schema_1.admin_roles_models
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
        let authorized = bcrypt_1.default.compareSync(password, hash);
        if (authorized) {
            const token = jsonwebtoken_1.default.sign({ id }, "secret_key");
            !token
                ? null
                : res.json({ status: true, token: token, position: admin.role });
        }
        else {
            res.status(401).json({ status: false, message: "password incorrect" });
        }
    }
});
Router.post("/add_task", (req, res) => {
    const task_Data = req.body;
    (0, task_controllers_1.task_controller)(task_Data, tasks_schema_1.default)
        .then((data) => {
        if (data)
            res.json({ message: true });
    })
        .catch((error) => {
        console.log(error);
    });
});
Router.get("/get_kanban_task", (req, res) => {
    (0, task_controllers_1.read_tasks)(tasks_schema_1.default).then((data) => {
        res.json(data);
    });
});
Router.get("/users", task_controllers_1.fetchUsers);
Router.post("/employes", task_controllers_1.addEmploye);
Router.delete("/deleteEmp/:id", task_controllers_1.deleteEmploye);
Router.put("/updateEmploye/:id", task_controllers_1.updateEmplye);
Router.post("/add_admins", task_controllers_1.create_admins);
Router.put("/update_admin/:id", task_controllers_1.update_admin); ////
//departments
Router.post("/addDep", task_controllers_1.createDepartments);
Router.get("/departments", task_controllers_1.fetchDepartments);
Router.delete("/deleteDept/:id", task_controllers_1.deleteDepartments);
Router.put("/Editdepartments/:id", task_controllers_1.updateDepartments);
Router.get("/hr_projects_progress", task_controllers_1.hr_projects_progress);
Router.post("/attendance", task_controllers_1.updateAttendance);
Router.get("/employe_log", task_controllers_1.Employe_logs);
Router.post("/Daily_reports", task_controllers_1.work_Reports);
Router.put("/update_report/:editingId", task_controllers_1.edit_daily_report);
Router.delete("/delete_report/:id", task_controllers_1.delete_daily_report);
Router.get("/reports", task_controllers_1.read_reports);
Router.get("/reports/employee/:employeeId", task_controllers_1.read_reports_by_employee);
Router.post("/create_project", task_controllers_1.create_pojects);
Router.get("/employes", task_controllers_1.availableEmployess);
Router.get("/headProj", task_controllers_1.Fetch_projects);
Router.post("/assigned_tasks", task_controllers_1.assigned_tasks);
Router.get("/check_assigned_tasks/:id", task_controllers_1.check_assigned_taks);
Router.put("/assigned_tasks/:id", task_controllers_1.update_assigned_tasks);
Router.post("/hr_assigned_tasks", task_controllers_1.create_hr_head_task);
Router.get("/hr_assigned_tasks", task_controllers_1.get_hr_head_tasks);
Router.put("/hr_assigned_tasks/:id", task_controllers_1.update_hr_head_task);
Router.delete("/hr_assigned_tasks/:id", task_controllers_1.delete_hr_head_task);
//  projoverview
Router.get("/project-overview/:project_id", task_controllers_1.project_overview);
Router.delete("/edit_project/:id", task_controllers_1.edit_project);
Router.put("/updateProj/:id", task_controllers_1.update_project);
Router.post("/updatePassword", task_controllers_1.updateUserpassword);
Router.get("/get_admins", task_controllers_1.get_admins);
Router.delete("/delete_admin/:id", task_controllers_1.deleteadmins);
Router.put("/updatePassword_admin", task_controllers_1.updateadminpasswods);
Router.get("/admin_profile", task_controllers_1.get_admin_profile);
Router.delete("/delete_proj/:id", task_controllers_1.delete_project);
// group 
Router.delete("/group_delete/:selectedGroup", task_controllers_1.delete_groupe);
Router.get("/groups/:selectedGroup", task_controllers_1.get_group);
Router.put("/update_groups/:selectedGroup", task_controllers_1.edit_group);
//ceo_controllers
Router.get("/employee_performance", task_controllers_1.emplyee_perfomance_data);
// hybread options
// Router.get("/hybread", create_hybread_team);
// Router.post("/custom_project", create_hybread_custom_project);
// Router.get("/everything", get_everything);
// Router.post("/everything_team_task", everything_team_task);
// Router.put("/update_hybread_project_status", update_hybread_project_status);
Router.post("/simple_custom_project", task_controllers_1.create_simple_custom_project);
Router.get("/simple_custom_projects", task_controllers_1.get_simple_custom_projects);
Router.put("/update_simple_project_status", task_controllers_1.update_simple_project_status);
Router.post("/simple_custom_project_global_task", task_controllers_1.add_simple_project_global_task);
Router.put("/simple_custom_project_global_task", task_controllers_1.update_simple_project_global_task_status);
Router.get("/simple_custom_project/:pro_id", task_controllers_1.get_simple_custom_project_by_id);
Router.put("/simple_custom_project/:edit_id", task_controllers_1.update_simple_custom_project);
Router.get("/update_simple_proj_task/:proj_id", task_controllers_1.get_simple_proj_tasks);
Router.put("/update_project_tasks", task_controllers_1.update_simple_proj_task);
Router.delete("/simple_custom_project/:pro_id", task_controllers_1.delete_simple_project);
Router.put("/delete_simple_project_global_task", task_controllers_1.delete_simple_project_global_task);
// Accounts management feacture 
Router.post("/add_to_accounts", task_controllers_1.add_to_accounts);
Router.get("/billings", task_controllers_1.account_billings);
Router.put("/update_account_billings_data/:pro_id", task_controllers_1.edit_accountBilling);
Router.delete("/remove_account_data/:id", task_controllers_1.delete_account_datas);
// Router.put("/update_account_billings_data/:pro_id",)
// feature for admin_
Router.post("/production-activities", task_controllers_1.production_activities);
Router.get("/production_activity", task_controllers_1.get_production_data);
Router.delete("/production-activities/:id", task_controllers_1.delete_production_data);
Router.put("/production-activitys-edits/:id", task_controllers_1.edit_production_data);
Router.get("/get_reports", task_controllers_1.get_reports);
Router.post("/desktop_shorts", upload.single('short'), task_controllers_1.get_desk_short);
exports.default = Router;
