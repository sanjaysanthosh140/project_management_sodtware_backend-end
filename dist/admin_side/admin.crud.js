"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCrudFunctions = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importStar(require("mongoose"));
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
        add_new_admins: async (name, email, department, password, role, active) => {
            let salt = bcrypt_1.default.genSaltSync(10);
            let hash = bcrypt_1.default.hashSync(password, salt);
            let model = new modules({
                name: name,
                email: email,
                department: department,
                password: hash,
                role: role,
                active: active,
            });
            let data = await model.save();
            return data.name;
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
        createDepartments: async (Dep_id, title, color, description) => {
            let departmentObj = new modules({
                Dep_id: Dep_id,
                title: title,
                color: color,
                description: description,
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
            //attendance
            let data = await modules
                .aggregate([
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
            ])
                .sort({ "data.date": 1 });
            console.log(data);
            return data;
        },
        DailyReports: async (userID, username, desc, deptId, type, date) => {
            console.log(username);
            let repoObj = new modules({
                userID,
                username,
                date,
                desc,
                deptId,
            });
            let repoData = await repoObj.save();
            console.log(repoData);
            return repoData;
        },
        readReports: async () => {
            let data = await modules.find({}).sort({ date: -1 });
            return data;
        },
        daily_report_edit: async (user_id, id, report) => {
            try {
                console.log(id);
                let data = await modules.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(id), userID: user_id }, { desc: report.desc });
                console.log(data);
                return data;
                // let data = await modules.findById({_id:new mongoose.Types.ObjectId(id),userID:user_id});
                // console.log(data);
            }
            catch (error) {
                console.log(error);
                return error;
            }
        },
        daily_report_delete: async (id, user_id) => {
            try {
                console.log(id, user_id);
                let data = await modules.findByIdAndDelete({
                    _id: new mongoose_1.default.Types.ObjectId(id),
                    userID: user_id,
                });
                console.log(data);
                return data;
            }
            catch (error) {
                console.log(error);
            }
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
            console.log("proj_id", id);
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
                    $unwind: {
                        path: "$emp_datas",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        projectId: 0,
                        headId: 0,
                        // eployeeTasks:1,
                        //  "emp_datas.name":1,
                    },
                },
                {
                    $lookup: {
                        from: "employee_sub_tasks",
                        let: {
                            user_id: "$employeeTasks.employee",
                            taskIds: "$employeeTasks.tasks.task_id ",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$project_id", id] },
                                            {
                                                $map: {
                                                    input: "$$user_id",
                                                    as: "id",
                                                    in: { $eq: ["$user_id", "$$id"] },
                                                },
                                            },
                                            {
                                                $map: {
                                                    input: "$$taskIds",
                                                    as: "tasks_id",
                                                    in: {
                                                        $eq: ["$task_id", "$$tasks_id"],
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "sub_tasks",
                    },
                },
                // {
                // $unwind: "$sub_tasks",
                // },
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
        hr_proj_progress: async () => {
            let data = await modules.find({});
            return data;
        },
        update_credentails: async (data) => {
            console.log(data.email);
            let salt = bcrypt_1.default.genSaltSync(10);
            let password = data.newPassword;
            let hash = bcrypt_1.default.hashSync(password, salt);
            // console.log("pass", hash);
            let updated_credentails = await modules.findOneAndUpdate({ email: data.email }, {
                password: hash,
            }, {
                new: true,
            });
            console.log(updated_credentails);
            return updated_credentails;
        },
        get_admins: async () => {
            let data = await modules.find();
            return data;
        },
        get_admin_profile: async (id) => {
            let profile = await modules.find({ _id: id });
            console.log(profile);
            return profile;
        },
        delete_group: async (id) => {
            let deleted = await modules.findByIdAndDelete({ _id: new mongoose_1.default.Types.ObjectId(id) });
            return deleted;
        },
        get_group: async (id) => {
            let group_data = await modules.find({ _id: new mongoose_1.default.Types.ObjectId(id) });
            return group_data;
        },
        update_groups: async (id, data) => {
            console.log(id, data);
            let update_group = await modules.findByIdAndUpdate({
                _id: new mongoose_1.default.Types.ObjectId(id)
            }, {
                groupName: data.name,
                members: data.members,
            });
            console.log(update_group);
            return update_group;
        }
    };
};
exports.adminCrudFunctions = adminCrudFunctions;
