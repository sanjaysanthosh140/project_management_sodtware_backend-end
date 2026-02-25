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
Router.post("/verify_authorization", (req, res) => {
    const { position, name, department, password } = req.body;
    if (position && name && department && password) {
        const saltrount = 10;
        const salt = bcrypt_1.default.genSaltSync(saltrount);
        const hash2 = bcrypt_1.default.hashSync(password, salt);
        const admin_obj = new admin_roles_schema_1.admin_roles_models({
            position: position,
            name: name,
            department: department,
            password: hash2,
        });
        admin_obj
            .save()
            .then((data) => {
            if (data) {
                let id = data._id;
                const tokens = jsonwebtoken_1.default.sign({ id }, "secret_key");
                // console.log(tokens);
                res.status(200).json({ position: position, token: tokens });
            }
        })
            .catch((error) => {
            console.log(error);
        });
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
//departments
Router.post("/addDep", task_controllers_1.createDepartments);
Router.get("/departments", task_controllers_1.fetchDepartments);
Router.delete("/deleteDept/:id", task_controllers_1.deleteDepartments);
Router.put("/Editdepartments/:id", task_controllers_1.updateDepartments);
Router.post("/attendance", task_controllers_1.updateAttendance);
Router.get("/employe_log", task_controllers_1.Employe_logs);
Router.post("/Daily_reports", task_controllers_1.work_Reports);
Router.get("/reports", task_controllers_1.read_reports);
Router.post("/create_project", task_controllers_1.create_pojects);
Router.get("/employes", task_controllers_1.availableEmployess);
Router.get("/headProj", task_controllers_1.Fetch_projects);
Router.post("/assigned_tasks", task_controllers_1.assigned_tasks);
Router.get("/check_assigned_tasks/:id", task_controllers_1.check_assigned_taks);
Router.put("/assigned_tasks/:id", task_controllers_1.update_assigned_tasks);
//  projoverview
Router.get("/project-overview/:project_id", task_controllers_1.project_overview);
exports.default = Router;
