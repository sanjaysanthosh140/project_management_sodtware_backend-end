"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update_simple_project_global_task_status_user = exports.get_simple_custom_projects_user = exports.delete_msg = exports.get_included_grp = exports.new_group = exports.get_employees = exports.getchatbox = exports.employee_profile = exports.achive_todo_list = exports.add_multiple_todos = exports.emp_proj_tasks = exports.emp_included_proj = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_controller_1 = require("./user_controller");
const department_projects_1 = __importDefault(require("../db_controllers/db_models/admin_side/department_projects"));
const assigen_tasks_1 = __importDefault(require("../db_controllers/db_models/admin_side/assigen-tasks"));
const user_tasks_todo_1 = __importDefault(require("../db_controllers/db_models/user_side/user_tasks_todo"));
const user_schema_1 = __importDefault(require("../db_controllers/db_models/user_schema"));
const socket_io_message_schema_1 = __importDefault(require("../db_controllers/db_models/user_side/socket.io.message_schema"));
const scoket_io_group_schema_1 = require("../db_controllers/db_models/user_side/scoket.io.group_schema");
const hybread_project_schema_1 = __importDefault(require("../db_controllers/db_models/hybread_projects/hybread_project_schema"));
const emp_included_proj = async (req, res, next) => {
    try {
        const selectedEmployeeId = req.query.empId;
        let targetEmployeeId = selectedEmployeeId;
        if (!targetEmployeeId) {
            let id = req.headers.authorization;
            let decodedToken = await jsonwebtoken_1.default.verify(id, "secret_key");
            targetEmployeeId = decodedToken.id;
        }
        if (!targetEmployeeId) {
            return res.status(400).json({ message: "employee id is required" });
        }
        let employee_assigned_proj = await (0, user_controller_1.user_project_controller)(department_projects_1.default);
        let user_assigned_proj = await employee_assigned_proj.user_assigned_projects(targetEmployeeId);
        res.status(200).json(user_assigned_proj);
    }
    catch (error) {
        return next(error);
    }
};
exports.emp_included_proj = emp_included_proj;
//   this function use in both emplyee dashboar and ceo dashboar for fetch tasks tha't why targetEmployeeId veriable is user here 
const emp_proj_tasks = async (req, res, next) => {
    try {
        let id = req.params.projectId;
        const selectedEmployeeId = req.query.empId;
        let targetEmployeeId = selectedEmployeeId;
        if (!targetEmployeeId) {
            let decodedToken = req.headers.authorization;
            let encodedToken = jsonwebtoken_1.default.verify(decodedToken, "secret_key");
            targetEmployeeId = encodedToken.id;
        }
        if (!targetEmployeeId) {
            return res.status(400).json({ message: "employee id is required" });
        }
        // console.log("proj_id", id, "emp_id", encodedToken.id);
        let assigned_tasks_for_emp = await (0, user_controller_1.user_project_controller)(assigen_tasks_1.default);
        let employe_proj_tasks = await assigned_tasks_for_emp.employee_assigned_tasks(targetEmployeeId, id);
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
        let add_sub_taks = await employee_sub_tasks
            .add_sub_tasks_emp(employeeTodo, emp_id.id)
            .catch((error) => {
            res
                .status(500)
                .json({ message: "internal server error", error: error });
        });
        if (add_sub_taks)
            res.status(200).json({ message: add_sub_taks });
    }
    catch (error) {
        return error;
    }
};
exports.add_multiple_todos = add_multiple_todos;
// this function use in both emplyee dashboar and ceo dashboar for fetch tasks tha't why targetEmployeeId veriable is user here 
const achive_todo_list = async (req, res, next) => {
    try {
        const selectedEmployeeId = req.query.empId;
        let targetEmployeeId = selectedEmployeeId;
        if (!targetEmployeeId) {
            let id = req.headers.authorization;
            let emp_id = jsonwebtoken_1.default.verify(id, "secret_key");
            targetEmployeeId = emp_id.id;
        }
        let achive_todo_method = await (0, user_controller_1.user_project_controller)(user_tasks_todo_1.default);
        let sub_todos = await achive_todo_method.achive_sub_tods(targetEmployeeId);
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
const getchatbox = async (req, res, next) => {
    let dep = req.params.roomType;
    console.log("type", dep);
    let deparment_chats = await socket_io_message_schema_1.default
        .find({ department: dep, group: dep })
        .sort({ createdAt: 1 })
        .populate("sender", "name");
    console.log(deparment_chats);
    res.status(200).send(deparment_chats);
};
exports.getchatbox = getchatbox;
const get_employees = async (req, res, next) => {
    let encodedjwt = req.headers.authorization;
    let decodedid = jsonwebtoken_1.default.verify(encodedjwt, "secret_key");
    let employeelist = await (0, user_controller_1.user_project_controller)(user_schema_1.default);
    let users = await employeelist.employeeList(decodedid.id);
    res.status(200).json(users);
};
exports.get_employees = get_employees;
const new_group = async (req, res, next) => {
    // console.log(req.body);
    let group_data = req.body;
    let new_group_create = await (0, user_controller_1.user_project_controller)(scoket_io_group_schema_1.group_model);
    let grp_created = await new_group_create.create_grp(group_data);
    res.status(200).json(grp_created);
};
exports.new_group = new_group;
const get_included_grp = async (req, res, next) => {
    console.log(req.headers.authorization, "from included_grp");
    let encodedjwt = req.headers.authorization;
    let decodedid = jsonwebtoken_1.default.verify(encodedjwt, "secret_key");
    let id = decodedid.id;
    let groups = await (0, user_controller_1.user_project_controller)(scoket_io_group_schema_1.group_model);
    let included_grp = await groups.emp_included(id);
    res.status(200).json(included_grp);
};
exports.get_included_grp = get_included_grp;
const delete_msg = async (req, res, next) => {
    let msgId = req.params.msgId;
    console.log(msgId);
    let encodedjwt = req.headers.authorization;
    let decodeId = jsonwebtoken_1.default.verify(encodedjwt, "secret_key");
    let delete_msg = await (0, user_controller_1.user_project_controller)(socket_io_message_schema_1.default);
    //  let delete_one = await delete_msg.delete_message(msgId, decodeId.id);
    // console.log(delete_one);
    // res.status(200).json({ message: "message deleted" });
};
exports.delete_msg = delete_msg;
// export const get_included_hybread_proj = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     let encodedToken: any = req.headers.authorization;
//     console.log("Authorization token", encodedToken);
//     let decodedId: any = jwt.verify(encodedToken, "secret_key");
//     let id = decodedId.id;
//     let user_custom_function = await user_project_controller(hybread_project_models);
//     let included_project = await user_custom_function.included_hybread_project(id);
//     console.log(included_project);
//     res.status(200).json(included_project);
//   } catch (error) {
//     console.log(error);
//   }
// }
// export const update_hybrid_task_status = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     console.log(req.body);
//     let { projectId, departmentId, employeeId, tasks } = req.body;
//     if (!tasks || tasks.length === 0) return res.status(400).json({ message: "Tasks array is required" });
//     const { H_task_id: taskId, task_status } = tasks[0];
//     let user_custom_function = await user_project_controller(hybread_project_models);
//     let updated_taks = await user_custom_function.update_hybread_tasks(projectId, departmentId, employeeId, taskId, task_status);
//     res.status(200).json({ message: "Task status updated successfully" });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// }
const get_simple_custom_projects_user = async (req, res, next) => {
    try {
        const projects = await hybread_project_schema_1.default.find().sort({ _id: -1 });
        res.status(200).json(projects);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to fetch simple custom projects" });
    }
};
exports.get_simple_custom_projects_user = get_simple_custom_projects_user;
const update_simple_project_global_task_status_user = async (req, res, next) => {
    try {
        const { projectId, taskId, departmentId, status, remark } = req.body;
        // Note: We could verify if the user actually belongs to the departmentId here,
        // but for now we follow the existing pattern.
        const result = await hybread_project_schema_1.default.findOneAndUpdate({ _id: projectId }, {
            $set: {
                "tasks.$[task].departments.$[dept].status": status,
                "tasks.$[task].departments.$[dept].remark": remark || ""
            }
        }, {
            arrayFilters: [{ "task._id": taskId }, { "dept.departmentId": departmentId }],
            new: true
        });
        if (result)
            res.status(200).json(result);
        else
            res.status(404).json({ message: "Project or task not found" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update task status" });
    }
};
exports.update_simple_project_global_task_status_user = update_simple_project_global_task_status_user;
