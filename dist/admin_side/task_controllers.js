"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.project_overview = exports.update_assigned_tasks = exports.check_assigned_taks = exports.assigned_tasks = exports.Fetch_projects = exports.availableEmployess = exports.create_pojects = exports.read_reports = exports.work_Reports = exports.Employe_logs = exports.updateAttendance = exports.updateDepartments = exports.deleteDepartments = exports.fetchDepartments = exports.createDepartments = exports.updateEmplye = exports.deleteEmploye = exports.addEmploye = exports.fetchUsers = exports.read_tasks = exports.task_controller = void 0;
const admin_crud_1 = require("./admin.crud");
const user_schema_1 = __importDefault(require("../db_controllers/db_models/user_schema"));
const department_schema_1 = __importDefault(require("../db_controllers/db_models/admin_side/department_schema"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const attendance_schema_1 = __importDefault(require("../db_controllers/db_models/attendance_schema"));
const Daily_reports_1 = __importDefault(require("../db_controllers/db_models/task_schemas/Daily_reports"));
const department_projects_1 = __importDefault(require("../db_controllers/db_models/admin_side/department_projects"));
const admin_roles_schema_1 = require("../db_controllers/db_models/admin_roles_schema");
const assigen_tasks_1 = __importDefault(require("../db_controllers/db_models/admin_side/assigen-tasks"));
const task_controller = (task_data, task_models) => {
    return new Promise((resolve, rejects) => {
        const task_obj = new task_models(task_data);
        console.log(task_data);
        task_obj
            .save()
            .then((data) => {
            console.log(data);
            if (data)
                resolve(true);
        })
            .catch((error) => {
            rejects(error);
        });
    });
};
exports.task_controller = task_controller;
const read_tasks = (task_module) => {
    return new Promise((resolve, reject) => {
        task_module
            .find()
            .then((data) => {
            resolve(data);
        })
            .catch((error) => {
            reject(error);
        });
    });
};
exports.read_tasks = read_tasks;
const fetchUsers = async (req, res, next) => {
    const usersFetch = (0, admin_crud_1.adminCrudFunctions)(user_schema_1.default);
    const data = await usersFetch.fetchAllUsers();
    res.status(200).json(data);
};
exports.fetchUsers = fetchUsers;
const addEmploye = async (req, res, next) => {
    const { name, email, department, password } = req.body;
    const employeCreate = (0, admin_crud_1.adminCrudFunctions)(user_schema_1.default);
    let empObj = await employeCreate.createUsers(name, email, department, password);
    res.status(200).json(empObj.name);
};
exports.addEmploye = addEmploye;
const deleteEmploye = async (req, res, next) => {
    const id = req.params.id;
    const employeDelete = (0, admin_crud_1.adminCrudFunctions)(user_schema_1.default);
    let deletedEmploye = await employeDelete.deleteEmploye(id);
    res.status(200).json(deletedEmploye);
};
exports.deleteEmploye = deleteEmploye;
const updateEmplye = async (req, res, next) => {
    const { name, email, department } = req.body;
    const id = req.params.id;
    const updateEmploye = (0, admin_crud_1.adminCrudFunctions)(user_schema_1.default);
    let updatedData = await updateEmploye.updateEmployess(id, name, email, department);
    res.status(200).json(updateEmploye);
};
exports.updateEmplye = updateEmplye;
const createDepartments = async (req, res, next) => {
    const { id, title, color, description } = req.body;
    const createDepartments = (0, admin_crud_1.adminCrudFunctions)(department_schema_1.default);
    let departmentObj = await createDepartments.createDepartments(id, title, color, description);
    console.log("after successfully added", departmentObj);
    res.status(200).json(departmentObj);
};
exports.createDepartments = createDepartments;
const fetchDepartments = async (req, res, next) => {
    const retriveDepartments = (0, admin_crud_1.adminCrudFunctions)(department_schema_1.default);
    let data = await retriveDepartments.fetchDepartments();
    console.log(data);
    res.status(200).json(data);
};
exports.fetchDepartments = fetchDepartments;
const deleteDepartments = async (req, res, next) => {
    const id = req.params.id;
    const deleteDepartments = (0, admin_crud_1.adminCrudFunctions)(department_schema_1.default);
    let deleteDepartment = await deleteDepartments.deleteDepartmetns(id);
    res.status(200).json(deleteDepartment);
};
exports.deleteDepartments = deleteDepartments;
const updateDepartments = async (req, res, next) => {
    const id = req.params.id;
    const { title, color, description } = req.body;
    const updateDepartments = (0, admin_crud_1.adminCrudFunctions)(department_schema_1.default);
    let updateDep_data = await updateDepartments.updateDepartments(id, title, color, description);
    res.json(200).json(updateDep_data);
};
exports.updateDepartments = updateDepartments;
const updateAttendance = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];
    const decodedToken = jsonwebtoken_1.default.verify(token, "secret_key");
    const id = decodedToken.id;
    const { userId, action } = req.body;
    const addAttendance = (0, admin_crud_1.adminCrudFunctions)(attendance_schema_1.default);
    let addattendance = await addAttendance.addAttendance(action, id);
    res.status(200).json({ message: "Attendance updated successfully" });
};
exports.updateAttendance = updateAttendance;
const Employe_logs = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];
    const decodedToken = jsonwebtoken_1.default.verify(token, "secret_key");
    let id = decodedToken.id;
    let retrivLoegs = (0, admin_crud_1.adminCrudFunctions)(attendance_schema_1.default);
    let logs = await retrivLoegs.retriveLogs(id);
    res.status(200).json(logs);
};
exports.Employe_logs = Employe_logs;
const work_Reports = async (req, res, next) => {
    const { title, desc, deptId, type, date } = req.body;
    // console.log(title, desc, deptId, type, date);
    const workReports = (0, admin_crud_1.adminCrudFunctions)(Daily_reports_1.default);
    let Dailyrepo = await workReports.DailyReports(title, desc, deptId, type, date);
    console.log(Dailyrepo);
    res.status(200).json({ msg: "report added successfully" });
};
exports.work_Reports = work_Reports;
const read_reports = async (req, res, next) => {
    const readReports = (0, admin_crud_1.adminCrudFunctions)(Daily_reports_1.default);
    let data = await readReports.readReports();
    res.status(200).json(data);
};
exports.read_reports = read_reports;
const create_pojects = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    const decodedToken = jsonwebtoken_1.default.verify(token, "secret_key");
    const projectData = req.body;
    // console.log("head", decodedToken.id, projectData);
    const DepProject = (0, admin_crud_1.adminCrudFunctions)(department_projects_1.default);
    let project = await DepProject.departmentProjects(decodedToken.id, projectData);
    res.status(200).json(project);
};
exports.create_pojects = create_pojects;
const availableEmployess = async (req, res, next) => {
    let encodedToken = req.headers.authorization;
    let decodedToken = jsonwebtoken_1.default.verify(encodedToken, "secret_key");
    console.log("working", decodedToken.id);
    let getproj = (0, admin_crud_1.adminCrudFunctions)(admin_roles_schema_1.admin_roles_models);
    let Employes = await getproj.fetchEmp(decodedToken.id);
    console.log(Employes);
    res.status(200).json(Employes);
};
exports.availableEmployess = availableEmployess;
const Fetch_projects = async (req, res, next) => {
    let encodedToken = req.headers.authorization;
    let decodedToken = jsonwebtoken_1.default.verify(encodedToken, "secret_key");
    // console.log("working", decodedToken.id);
    let getheadProj = (0, admin_crud_1.adminCrudFunctions)(department_projects_1.default);
    let data = await getheadProj.fetchHeadProjects(decodedToken.id);
    res.status(200).json(data);
};
exports.Fetch_projects = Fetch_projects;
const assigned_tasks = async (req, res, next) => {
    let employe = req.body;
    // console.log(employe);
    let assigenTask = (0, admin_crud_1.adminCrudFunctions)(assigen_tasks_1.default);
    let assigne = await assigenTask.assignTasks(employe);
    res.status(200).json({ message: "Tasks assigned successfully" });
};
exports.assigned_tasks = assigned_tasks;
const check_assigned_taks = async (req, res, next) => {
    const id = req.params.id;
    const chackTasks = (0, admin_crud_1.adminCrudFunctions)(assigen_tasks_1.default);
    let data = await chackTasks.fetchTasks(id);
    res.status(200).json(data);
    // console.log(id);
};
exports.check_assigned_taks = check_assigned_taks;
const update_assigned_tasks = async (req, res, next) => {
    let id = req.params.id;
    let projTasks = req.body;
    console.log(id, projTasks);
    const updates = (0, admin_crud_1.adminCrudFunctions)(assigen_tasks_1.default);
    let updated = await updates.updateassigenTasks(id, projTasks);
    res.status(200).json({ message: "Tasks updated successfully" });
};
exports.update_assigned_tasks = update_assigned_tasks;
const project_overview = async (req, res, next) => {
    const id = req.params.project_id;
    const projectOverview = (0, admin_crud_1.adminCrudFunctions)(assigen_tasks_1.default);
    let overview = await projectOverview.projectOverview(id);
    res.status(200).json(overview);
};
exports.project_overview = project_overview;
