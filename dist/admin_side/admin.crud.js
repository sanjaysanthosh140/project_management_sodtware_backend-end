"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCrudFunctions = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const user_schema_1 = __importDefault(require("../db_controllers/db_models/user_schema"));
const adminCrudFunctions = (modules) => {
    return {
        fetchAllUsers: async () => {
            const data = await modules.find();
            return data;
            // function to fetch all users ...
        },
        createUsers: async (name, email, department, password) => {
            let salt = bcrypt_1.default.genSaltSync(10);
            let hash2 = bcrypt_1.default.hashSync(password, salt);
            const employ_Obj = new modules({
                name: name,
                email: email,
                department: department,
                password: hash2,
            });
            let emplyObj = await employ_Obj.save();
            return emplyObj;
            // function to create users ....
        },
        updateEmployess: async (id, name, email, department) => {
            let updateEmploye = await modules.findByIdAndUpdate(id, {
                name,
                email,
                department,
            }, {
                new: true,
                runvalidators: true,
            });
            return updateEmploye;
        },
        deleteEmploye: async (id) => {
            let deletedEmploye = await modules.findByIdAndDelete(new mongoose_1.Types.ObjectId(id));
            return deletedEmploye.name;
        },
        createDepartments: async (id, title, color, description) => {
            let departmentObj = new modules({
                id,
                title,
                color,
                description,
            });
            let newDep = await departmentObj.save();
            return newDep;
        },
        fetchDepartments: async () => {
            const depdata = await modules.find();
            return depdata;
        },
        deleteDepartmetns: async (id) => {
            let deleteDepartment = await modules.findByIdAndDelete(id);
            return deleteDepartment.title;
        },
        updateDepartments: async (id, title, color, description) => {
            let updateDepartment = await modules.findByIdAndUpdate(id, {
                id,
                title,
                color,
                description,
            }, {
                new: true,
                runValidators: true,
            });
            return updateDepartment;
        },
        addAttendance: async (action, id) => {
            if (action && id) {
                const today = new Date().toISOString().split("T")[0];
                const time = new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                });
                let attendanceObj = await modules.findOne({ userId: id, date: today });
                if (!attendanceObj) {
                    attendanceObj = await new modules({
                        userId: id,
                        date: today,
                        logs: [
                            {
                                firstnoon: {
                                    timeIn: time,
                                    timeOut: null,
                                },
                                secondnoon: {
                                    timeIn: null,
                                    timeOut: null,
                                },
                            },
                        ],
                    });
                    attendanceObj.save();
                }
                else {
                    switch (action) {
                        case "LUNCH_START":
                            attendanceObj.logs[0].firstnoon.timeOut = time;
                            break;
                        case "LUNCH_END":
                            attendanceObj.logs[0].secondnoon.timeIn = time;
                            break;
                        case "PUNCH_OUT":
                            attendanceObj.logs[0].secondnoon.timeOut = time;
                            break;
                    }
                    attendanceObj.save();
                }
            }
        },
        retriveLogs: async (id) => {
            let data = await modules.aggregate([
                // { $project: { first: { $arrayElemAt: ["$logs.firstnoon", 0], } , second: { $arrayElemAt: ["$logs.secondnoon", 0], } } }
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "attendance",
                    },
                },
                {
                    $project: {
                        date: 1,
                        first: { $arrayElemAt: ["$logs.firstnoon", 0] },
                        second: { $arrayElemAt: ["$logs.secondnoon", 0] },
                        users: { $arrayElemAt: ["$attendance", 0] },
                    },
                },
            ]);
            console.log(data);
            return data;
        },
        DailyReports: async (title, desc, deptId, type, date) => {
            let repoObj = new modules({
                title,
                desc,
                deptId,
                type,
                date,
            });
            let repoData = await repoObj.save();
            // console.log(repoData);
            return repoData;
        },
        readReports: async () => {
            let data = await modules.find();
            return data;
        },
        departmentProjects: async (head_id, projectData) => {
            let { title, description, deadline, priority, teamMembers, todos } = projectData;
            console.log(title, description, deadline, priority, teamMembers, todos);
            let projectObj = new modules({
                head_id,
                title,
                deadline,
                description,
                priority,
                teamMembers,
                todos,
            });
            const DepartmentProjects = await projectObj.save();
            return DepartmentProjects;
        },
        fetchEmp: async (id) => {
            let admindata = await modules.findOne({ _id: id });
            let department = admindata.department;
            let employes = await user_schema_1.default.find({
                department: department,
            });
            return employes;
        },
        fetchHeadProjects: async (id) => {
            console.log("head id", id);
            let data = await modules.find({ head_id: id });
            console.log("data", data);
            return data;
        },
        assignTasks: async (employeeTaskts) => {
            console.log(employeeTaskts);
            let assigne = new modules(employeeTaskts);
            await assigne.save().then(async (data) => {
                return data;
            });
        },
        fetchTasks: async (id) => {
            let data = await modules.findOne({ projectId: id });
            return data;
        },
        updateassigenTasks: async (id, updatedProjTasks) => {
            await modules
                .findOneAndUpdate({
                projectId: id,
            }, {
                projectId: updatedProjTasks.projectId,
                headid: updatedProjTasks.headId,
                employeeTasks: updatedProjTasks.employeeTasks,
            })
                .then(async (data) => {
                console.log(data);
                return data;
            });
        },
        projectOverview: async (id) => {
            // console.log("proj_id", id);
            let data = await modules.aggregate([
                {
                    $match: { projectId: id },
                },
                {
                    $lookup: {
                        from: "users",
                        let: { empIds: "$employeeTasks.employee" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: [
                                            "$_id",
                                            {
                                                $map: {
                                                    input: "$$empIds",
                                                    as: "id",
                                                    in: { $toObjectId: "$$id" },
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "emp_datas",
                    },
                },
                {
                    $unwind: "$emp_datas",
                },
                {
                    $lookup: {
                        from: "employee_sub_tasks",
                        let: { empid: "$emp_datas._id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $or: [
                                            { $eq: [{ $toObjectId: "$user_id" }, "$$empid"] },
                                            {
                                                $eq: [
                                                    { $toObjectId: "$project_id" },
                                                    { $toObjectId: id },
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "sub_tasks",
                    },
                },
                {
                    $unwind: "$sub_tasks",
                },
                {
                    $project: {
                        _id: 0,
                        "emp_datas.name": 1,
                        "emp_datas._id": 1,
                        employeeTasks: 1,
                        sub_tasks: 1,
                    },
                },
            ]);
            console.log(data);
            return data;
        },
        Edit_project: async (id) => {
            // console.log(id);
            let data = await modules.findOne({ _id: id });
            return data;
        },
        update_Department: async (data, id) => {
            let { title, description, deadline, priority, teamMembers, todos } = data;
            let updated = await modules.findByIdAndUpdate({
                _id: id,
            }, {
                $set: {
                    title,
                    description,
                    deadline,
                    priority,
                    teamMembers,
                    todos,
                },
            });
            console.log(updated);
            return updated;
        },
    };
};
exports.adminCrudFunctions = adminCrudFunctions;
