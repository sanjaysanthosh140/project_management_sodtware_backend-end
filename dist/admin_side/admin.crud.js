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
        update_admins: async (id, name, email, department, role, active) => {
            let updateAdmin = await modules.findByIdAndUpdate(id, {
                name,
                email,
                department,
                role,
                active,
            }, {
                new: true,
                runvalidators: true,
            });
            return updateAdmin;
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
                console.log("new punching called");
                let attendanceObj = await modules.findOne({ userId: id, date: today });
                if (!attendanceObj) {
                    attendanceObj = await new modules({
                        userId: id,
                        date: today,
                        logs: [
                            {
                                firstnoon: {
                                    timeIn: time,
                                },
                                secondnoon: {
                                    timeOut: null,
                                },
                            },
                        ],
                    });
                    attendanceObj.save();
                }
                else {
                    // switch (action) {
                    //   case "LUNCH_START":
                    //     attendanceObj.logs[0].firstnoon.timeOut = time;
                    //     break;
                    //   case "LUNCH_END":
                    //     attendanceObj.logs[0].secondnoon.timeIn = time;
                    //     break;
                    //   case "PUNCH_OUT":
                    //     attendanceObj.logs[0].secondnoon.timeOut = time;
                    //     break;
                    // }
                    attendanceObj.logs[0].secondnoon.timeOut = time;
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
        delete_project: async (id) => {
            let data = await modules.findByIdAndDelete({
                _id: new mongoose_1.default.Types.ObjectId(id),
            });
            return data;
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
            let deleted = await modules.findByIdAndDelete({
                _id: new mongoose_1.default.Types.ObjectId(id),
            });
            return deleted;
        },
        get_group: async (id) => {
            let group_data = await modules.find({
                _id: new mongoose_1.default.Types.ObjectId(id),
            });
            return group_data;
        },
        update_groups: async (id, data) => {
            console.log(id, data);
            let update_group = await modules.findByIdAndUpdate({
                _id: new mongoose_1.default.Types.ObjectId(id),
            }, {
                groupName: data.name,
                members: data.members,
            });
            console.log(update_group);
            return update_group;
        },
        emplyee_performance: async () => {
            try {
                let data = await modules.aggregate([
                    // {
                    // $unwind: "$_id",
                    // },
                    {
                        $lookup: {
                            from: "users",
                            let: { empid: "$employeeTasks.employee" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $in: ["$_id", "$$empid"],
                                        },
                                    },
                                },
                            ],
                            as: "empdata",
                        },
                    },
                    // {
                    // $project: {
                    // _id: 1,
                    // projectId: 1,
                    // headId: 1,
                    // employ: { $arrayElemAt: ["$empdata", 0] },
                    // },
                    // },
                ]);
                console.log(data);
            }
            catch (error) {
                console.log(error);
            }
        },
        custom_team: async (head_id) => {
            try {
                let department_data = await modules.aggregate([
                    {
                        $lookup: {
                            from: "users",
                            let: { dep: "$Dep_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$department", "$$dep"] },
                                    },
                                },
                            ],
                            as: "employee",
                        },
                    },
                    {
                        $unwind: {
                            path: "$employee",
                            // preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            Dep_id: 1,
                            "employee._id": 1,
                            "employee.name": 1,
                            "employee.department": 1,
                        },
                    },
                    {
                        $lookup: {
                            from: "admin_roles",
                            localField: "Dep_id",
                            foreignField: "department",
                            as: "heads",
                        },
                    },
                    {
                        $unwind: {
                            path: "$heads",
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            Dep_id: 1,
                            "employee._id": 1,
                            "employee.name": 1,
                            "employee.department": 1,
                            "heads._id": 1,
                            "heads.name": 1,
                            "heads.role": 1,
                        },
                    },
                ]);
                // console.log(department_data);
                if (department_data != undefined || null) {
                    return department_data;
                }
            }
            catch (error) {
                console.log(error);
            }
        },
        create_custom_project: async (custom_proj_data) => {
            try {
                console.log(custom_proj_data.fileNo, custom_proj_data.date, custom_proj_data.channelName, custom_proj_data.projectOption, custom_proj_data.title, custom_proj_data.tump, custom_proj_data.departmentsOrdered);
                let custom_datas = new modules({
                    fileNo: custom_proj_data.fileNo,
                    date: custom_proj_data.date,
                    channelName: custom_proj_data.channelName,
                    projectOption: custom_proj_data.projectOption,
                    title: custom_proj_data.title,
                    tump: custom_proj_data.tump,
                    departmentsOrdered: custom_proj_data.departmentsOrdered,
                    customTeam: {
                        name: custom_proj_data.customTeam.name,
                        members: custom_proj_data.customTeam.members,
                    },
                });
                let saved_data = await custom_datas.save();
                console.log("saved data ", saved_data);
            }
            catch (error) {
                console.log(error);
            }
        },
        get_everything: async (decoded_token) => {
            try {
                console.log("employee token reached here  ", decoded_token);
                let data = await modules.find({
                    "departmentsOrdered.headId": decoded_token,
                });
                console.log(data);
                return data;
            }
            catch (error) {
                console.log(error);
            }
        },
        everything_team_task: async (everything_team_task) => {
            try {
                console.log("everything_team_task_reached ", everything_team_task);
                let dep_id = everything_team_task.departmentId;
                let proj_id = new mongoose_1.default.Types.ObjectId(everything_team_task.projectId);
                let departmet = await modules.findOneAndUpdate({
                    _id: proj_id,
                    "departmentsOrdered.departmentId": dep_id,
                }, {
                    $set: {
                        "departmentsOrdered.$.employee": everything_team_task.team,
                    },
                });
                console.log(departmet);
            }
            catch (error) {
                console.log(error);
            }
        },
        // AI Added: Updates the status of a specific department within a hybrid project
        update_hybread_project_status: async (projectId, departmentId, status) => {
            try {
                let updated = await modules.findOneAndUpdate({
                    _id: new mongoose_1.default.Types.ObjectId(projectId),
                    "departmentsOrdered.departmentId": departmentId,
                }, {
                    $set: { "departmentsOrdered.$.dept_status": status },
                }, { new: true });
                return updated;
            }
            catch (error) {
                console.log(error);
            }
        },
        create_production_activities: async (headId, production_data) => {
            let department = production_data.department;
            let timestamp = production_data.timestamp;
            let date = production_data.entries[0].date;
            let client = production_data.entries[0].client;
            let category = production_data.entries[0].category;
            let floorName = production_data.entries[0].floorName;
            let fromTime = production_data.entries[0].fromTime;
            let toTime = production_data.entries[0].toTime;
            let timeIn = production_data.entries[0].timeIn;
            let timeOut = production_data.entries[0].timeOut;
            let advance = production_data.entries[0].advance;
            let finalAmount = production_data.entries[0].finalAmount;
            let additionalRequirements = production_data.entries[0].additionalRequirements;
            let allocatedBy = production_data.entries[0].allocatedBy;
            let head_id = headId;
            let data = new modules({
                department,
                timestamp,
                date,
                client,
                category,
                floorName,
                fromTime,
                toTime,
                timeIn,
                timeOut,
                advance,
                finalAmount,
                additionalRequirements,
                allocatedBy,
                head_id,
            });
            let production_stored = await data.save();
            console.log(production_stored);
            return production_data;
        },
        get_production_activity: async () => {
            const data = await modules.find({});
            console.log(data);
            return data;
        },
        delete_production_data: async (id) => {
            console.log("working", id);
            let data = await modules.findOneAndDelete({
                _id: new mongoose_1.Types.ObjectId(id),
            });
            console.log(data);
            if (data)
                return data;
        },
        edit_prodcution_data: async (proj_id, proj_data, head_id) => {
            try {
                console.log(proj_data, proj_id);
                const updated = await modules.findByIdAndUpdate({ _id: new mongoose_1.Types.ObjectId(proj_id) }, {
                    $set: {
                        department: proj_data.department,
                        timestamp: proj_data.timestamp,
                        date: proj_data.date,
                        client: proj_data.client,
                        category: proj_data.category,
                        floorName: proj_data.floorName,
                        fromTime: proj_data.fromTime,
                        toTime: proj_data.toTime,
                        timeIn: proj_data.timeIn,
                        timeOut: proj_data.timeOut,
                        advance: proj_data.advance,
                        finalAmount: proj_data.finalAmount,
                        additionalRequirements: proj_data.additionalRequirements,
                        allocatedBy: proj_data.allocatedBy,
                        head_id: head_id,
                    },
                }, { new: true });
                console.log(updated);
                return updated;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        },
    };
};
exports.adminCrudFunctions = adminCrudFunctions;
