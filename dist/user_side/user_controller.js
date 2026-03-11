"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_project_controller = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_project_controller = async (modules) => {
    return {
        user_assigned_projects: async (id) => {
            let data = await modules.find({ "teamMembers.userId": id });
            return data;
        },
        employee_assigned_tasks: async (id, projectId) => {
            // console.log(id, projectId);
            let data = await modules.aggregate([
                {
                    $unwind: "$employeeTasks",
                },
                {
                    $match: {
                        projectId: projectId,
                        "employeeTasks.employee": id,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        headId: 1,
                        "employeeTasks.tasks": 1,
                        "employeeTasks._id": 1,
                    },
                },
            ]);
            // console.log(data);
            return data;
        },
        add_sub_tasks_emp: async (employee_proj_tasks, emp_id) => {
            // console.log(employee_proj_tasks, emp_id);
            let exist = await modules.findOneAndUpdate({
                task_id: employee_proj_tasks.task_id,
                // user_id: employee_proj_tasks.user_id,
            }, {
                $set: {
                    user_id: emp_id,
                    task_id: employee_proj_tasks.task_id,
                    project_id: employee_proj_tasks.project_id,
                    user_subTaks: employee_proj_tasks.user_subTaks,
                },
            }, {
                upsert: true,
                new: true,
                runValidators: true,
            });
            console.log(exist);
            // if (exist) {
            // console.log(exist);
            // }
            //if (!exist) {
            // let data = new modules({
            //    user_id: emp_id,
            //   task_id: employee_proj_tasks.task_id,
            //  project_id: employee_proj_tasks.project_id,
            //  user_subTaks: employee_proj_tasks.user_subTaks,
            //});
            // await data.save().then((data: any) => {
            //   console.log(data);
            // });
            // console.log("not found",exist);
            //}
            //else{
            // console.log("found",exist);
            // }
        },
        achive_sub_tods: async (id) => {
            let user_todo_data = await modules.find({ user_id: id });
            return user_todo_data;
        },
        achive_user_profile: async (id) => {
            let datas = jsonwebtoken_1.default.verify(id, "secret_key");
            let ids = datas.id;
            let data = await modules.find({ _id: ids });
            return data;
        },
    };
};
exports.user_project_controller = user_project_controller;
