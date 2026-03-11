"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.employee_profile = exports.achive_todo_list = exports.add_multiple_todos = exports.emp_proj_tasks = exports.emp_included_proj = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_controller_1 = require("./user_controller");
const department_projects_1 = __importDefault(require("../db_controllers/db_models/admin_side/department_projects"));
const assigen_tasks_1 = __importDefault(require("../db_controllers/db_models/admin_side/assigen-tasks"));
const user_tasks_todo_1 = __importDefault(require("../db_controllers/db_models/user_side/user_tasks_todo"));
const user_schema_1 = __importDefault(require("../db_controllers/db_models/user_schema"));
const emp_included_proj = async (req, res, next) => {
    try {
        let id = req.headers.authorization;
        let decodedToken = await jsonwebtoken_1.default.verify(id, "secret_key");
        let employee_assigned_proj = await (0, user_controller_1.user_project_controller)(department_projects_1.default);
        let user_assigned_proj = await employee_assigned_proj.user_assigned_projects(decodedToken.id);
        res.status(200).json(user_assigned_proj);
    }
    catch (error) {
        return next(error);
    }
};
exports.emp_included_proj = emp_included_proj;
const emp_proj_tasks = async (req, res, next) => {
    try {
        let id = req.params.projectId;
        let decodedToken = req.headers.authorization;
        let encodedToken = jsonwebtoken_1.default.verify(decodedToken, "secret_key");
        // console.log("proj_id", id, "emp_id", encodedToken.id);
        let assigned_tasks_for_emp = await (0, user_controller_1.user_project_controller)(assigen_tasks_1.default);
        let employe_proj_tasks = await assigned_tasks_for_emp.employee_assigned_tasks(encodedToken.id, id);
        console.log(employe_proj_tasks);
        res.status(200).json(employe_proj_tasks);
    }
    catch (error) {
        return error;
    }
};
exports.emp_proj_tasks = emp_proj_tasks;
const add_multiple_todos = async (req, res, next) => {
    try {
        let employeeTodo = req.body;
        let emp_ids = req.headers.authorization;
        let emp_id = jsonwebtoken_1.default.verify(emp_ids, "secret_key");
        // console.log(employeeTodo);
        let employee_sub_tasks = await (0, user_controller_1.user_project_controller)(user_tasks_todo_1.default);
        let add_sub_taks = await employee_sub_tasks.add_sub_tasks_emp(employeeTodo, emp_id.id);
    }
    catch (error) {
        return error;
    }
};
exports.add_multiple_todos = add_multiple_todos;
const achive_todo_list = async (req, res, next) => {
    try {
        let id = req.headers.authorization;
        let emp_id = jsonwebtoken_1.default.verify(id, "secret_key");
        let achive_todo_method = await (0, user_controller_1.user_project_controller)(user_tasks_todo_1.default);
        let sub_todos = await achive_todo_method.achive_sub_tods(emp_id.id);
        res.status(200).send(sub_todos);
    }
    catch (error) {
        console.log(error);
        res.status(501).send({ message: "internal server error" });
    }
};
exports.achive_todo_list = achive_todo_list;
const employee_profile = async (req, res, next) => {
    let id = req.headers.authorization;
    try {
        let employee_profile = await (0, user_controller_1.user_project_controller)(user_schema_1.default);
        let employee_data = await employee_profile.achive_user_profile(id);
        console.log(employee_data);
        res.status(200).send(employee_data);
    }
    catch (error) {
        console.log(error);
    }
};
exports.employee_profile = employee_profile;
