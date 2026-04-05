"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.edit_group = exports.get_group = exports.delete_groupe = exports.get_admin_profile = exports.updateadminpasswods = exports.deleteadmins = exports.get_admins = exports.updateUserpassword = exports.hr_projects_progress = exports.delete_project = exports.update_project = exports.edit_project = exports.project_overview = exports.update_assigned_tasks = exports.check_assigned_taks = exports.assigned_tasks = exports.Fetch_projects = exports.availableEmployess = exports.create_pojects = exports.read_reports = exports.delete_daily_report = exports.edit_daily_report = exports.work_Reports = exports.Employe_logs = exports.updateAttendance = exports.updateDepartments = exports.deleteDepartments = exports.fetchDepartments = exports.createDepartments = exports.updateEmplye = exports.deleteEmploye = exports.create_admins = exports.addEmploye = exports.fetchUsers = exports.read_tasks = exports.task_controller = void 0;
const admin_crud_1 = require("./admin.crud");
const user_schema_1 = __importDefault(require("../db_controllers/db_models/user_schema"));
const department_schema_1 = __importDefault(require("../db_controllers/db_models/admin_side/department_schema"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const attendance_schema_1 = __importDefault(require("../db_controllers/db_models/attendance_schema"));
const Daily_reports_1 = __importDefault(require("../db_controllers/db_models/task_schemas/Daily_reports"));
const department_projects_1 = __importDefault(require("../db_controllers/db_models/admin_side/department_projects"));
const admin_roles_schema_1 = require("../db_controllers/db_models/admin_roles_schema");
const assigen_tasks_1 = __importDefault(require("../db_controllers/db_models/admin_side/assigen-tasks"));
const scoket_io_group_schema_1 = require("../db_controllers/db_models/user_side/scoket.io.group_schema");
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
const create_admins = (req, res, next) => {
    let { name, email, department, password, role, active } = req.body;
    const create_admins = (0, admin_crud_1.adminCrudFunctions)(admin_roles_schema_1.admin_roles_models);
    const admin_data = create_admins.add_new_admins(name, email, department, password, role, active);
    res.status(200).json(admin_data);
};
exports.create_admins = create_admins;
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
    const { username, desc, deptId, type, date } = await req.body;
    let token = req.headers.authorization;
    let decodedToken = jsonwebtoken_1.default.verify(token, "secret_key");
    //  console.log(name,desc, deptId, type, date,decodedToken);
    //  console.log("repo",username);
    const workReports = (0, admin_crud_1.adminCrudFunctions)(Daily_reports_1.default);
    let Dailyrepo = await workReports.DailyReports(decodedToken.id, username, desc, deptId, type, date);
    console.log(Dailyrepo);
    res.status(200).json({ msg: "report added successfully" });
};
exports.work_Reports = work_Reports;
const edit_daily_report = async (req, res, next) => {
    let id = req.params.editingId;
    let report = req.body;
    let encodedjwt = req.headers.authorization;
    let decoded = jsonwebtoken_1.default.verify(encodedjwt, "secret_key");
    const edit_reports = (0, admin_crud_1.adminCrudFunctions)(Daily_reports_1.default);
    console.log("update", id);
    let updated_datas = await edit_reports
        .daily_report_edit(decoded.id, id, report)
        .catch((error) => {
        res.status(503).json({ message: "server unavailable", error });
    });
    if (updated_datas)
        res.status(200).json({ mesage: "updated success fully" });
};
exports.edit_daily_report = edit_daily_report;
const delete_daily_report = async (req, res, next) => {
    let id = req.params.id;
    let encodedjwt = req.headers.authorization;
    let decoded = jsonwebtoken_1.default.verify(encodedjwt, "secret_key");
    const delete_report = (0, admin_crud_1.adminCrudFunctions)(Daily_reports_1.default);
    const deleted_one = await delete_report
        .daily_report_delete(id, decoded.id)
        .catch((error) => {
        res.status(503).json({ message: "server unavailable", error });
    });
    if (deleted_one)
        res.send(200).json({ message: "subtask deleted successfully" });
};
exports.delete_daily_report = delete_daily_report;
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
const edit_project = async (req, res, next) => {
    try {
        console.log("working");
        const id = req.params.id;
        const edit_project = (0, admin_crud_1.adminCrudFunctions)(department_projects_1.default);
        const edit_proj_data = await edit_project.Edit_project(id);
        console.log(edit_proj_data);
        res.status(200).send(edit_proj_data);
    }
    catch (error) {
        res.status(500).send({ message: "server-error" });
    }
};
exports.edit_project = edit_project;
const update_project = async (req, res, next) => {
    try {
        let proj_id = req.params.id;
        let updated_data = req.body;
        const update_project = (0, admin_crud_1.adminCrudFunctions)(department_projects_1.default);
        const updated_datas = update_project.update_Department(updated_data, proj_id);
        if (updated_datas) {
            res.status(200).send({ message: "successfully updated " });
        }
        console.log(req.body, proj_id);
    }
    catch (error) {
        res.status(501).send({ message: "internal-server-error" });
    }
};
exports.update_project = update_project;
const delete_project = async (req, res, next) => {
    try {
        let id = req.params.id;
        console.log(id);
        const delete_project = (0, admin_crud_1.adminCrudFunctions)(department_projects_1.default);
        const deleted_proj = await delete_project.delete_project(id);
        console.log(deleted_proj);
        res.status(200).json({ message: "deleted successfully" });
    }
    catch (error) {
        console.log(error);
    }
};
exports.delete_project = delete_project;
const hr_projects_progress = async (req, res, next) => {
    try {
        const hrProjectsProgress = (0, admin_crud_1.adminCrudFunctions)(department_projects_1.default);
        const project_data = await hrProjectsProgress.hr_proj_progress();
        console.log(project_data);
        res.status(200).send(project_data);
    }
    catch (error) {
        res.status(500).send({ message: "internal-server-error" });
    }
};
exports.hr_projects_progress = hr_projects_progress;
const updateUserpassword = async (req, res, next) => {
    let user_credentials = req.body;
    const updated_user_pass = (0, admin_crud_1.adminCrudFunctions)(user_schema_1.default);
    const credentials = await updated_user_pass.update_credentails(user_credentials);
    console.log("updated", credentials);
    res
        .status(200)
        .json({ message: `${credentials.name} password successfully` });
};
exports.updateUserpassword = updateUserpassword;
const get_admins = async (req, res, next) => {
    const get_resposnse = (0, admin_crud_1.adminCrudFunctions)(admin_roles_schema_1.admin_roles_models);
    const response = await get_resposnse.get_admins();
    console.log(response);
    res.status(200).json(response);
};
exports.get_admins = get_admins;
const deleteadmins = async (req, res, next) => {
    const id = req.params.id;
    let delete_admins = (0, admin_crud_1.adminCrudFunctions)(admin_roles_schema_1.admin_roles_models);
    let resposne = await delete_admins.deleteEmploye(id);
    console.log(resposne);
    res.status(200).json({ message: `Admin ${resposne} deleted successfully` });
};
exports.deleteadmins = deleteadmins;
const updateadminpasswods = async (req, res, next) => {
    let admin_credentials = req.body;
    const updated_admins_pass = (0, admin_crud_1.adminCrudFunctions)(admin_roles_schema_1.admin_roles_models);
    const credentials = await updated_admins_pass.update_credentails(admin_credentials);
    console.log("updated", credentials);
    res
        .status(200)
        .json({ message: `${credentials.name} password successfully` });
};
exports.updateadminpasswods = updateadminpasswods;
const get_admin_profile = async (req, res, next) => {
    let encodedToken = req.headers.authorization;
    let decodedid = jsonwebtoken_1.default.verify(encodedToken, "secret_key");
    const admin_profile = (0, admin_crud_1.adminCrudFunctions)(admin_roles_schema_1.admin_roles_models);
    const profile = await admin_profile.get_admin_profile(decodedid.id);
    res.status(200).json(profile);
};
exports.get_admin_profile = get_admin_profile;
const delete_groupe = async (req, res, next) => {
    let id = req.params.selectedGroup;
    let delete_group = (0, admin_crud_1.adminCrudFunctions)(scoket_io_group_schema_1.group_model);
    let deleted = await delete_group.delete_group(id);
    // console.log("after", deleted);
    res.status(200).json({ message: "group deleted successfully" });
};
exports.delete_groupe = delete_groupe;
const get_group = async (req, res, next) => {
    let id = req.params.selectedGroup;
    // console.log(id);
    let get_group = (0, admin_crud_1.adminCrudFunctions)(scoket_io_group_schema_1.group_model);
    let group = await get_group.get_group(id);
    // console.log("group", group);
    res.status(200).json(group);
};
exports.get_group = get_group;
const edit_group = async (req, res, next) => {
    let id = req.params.selectedGroup;
    let group_data = req.body;
    let updated_group = (0, admin_crud_1.adminCrudFunctions)(scoket_io_group_schema_1.group_model);
    let updates = await updated_group.update_groups(id, group_data);
    if (updates) {
        res.status(200).json({ message: "updated successfully" });
    }
};
exports.edit_group = edit_group;
