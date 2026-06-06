import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { admin_roles_models } from "../db_controllers/db_models/admin_roles_schema";
import { Types } from "mongoose";
export const user_project_controller = async (modules: any) => {
  // interface user_todolist {
  //   project_id: string,
  //   task_id: string,
  //   user_subTaks: []
  // }
  interface todolist {
    todo_id: String;
    title: String;
    status: String;
    createdAt: String;
  }
  type user_tasks_todo_schema = {
    project_id: string;
    task_id: string;
    user_subTaks: [todolist];
  };

  type admin_roles = [
    {
      name: string;
      email: string;
      department: string;
      role: string;
      active: boolean;
    },
  ];
  return {
    user_assigned_projects: async (id: string) => {
      let data = await modules.find({ "teamMembers.userId": id }).sort({_id:-1});
      return data;
    },
    employee_assigned_tasks: async (id: string, projectId: string) => {
      // console.log(id, projectId);
      try {
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
            $addFields: {
              headObjectId: {
                $convert: {
                  input: "$headId",
                  to: "objectId",
                  onError: null,
                  onNull: null,
                },
              },
            },
          },
          {
            $lookup: {
              from: "admin_roles",
              localField: "headObjectId",
              foreignField: "_id",
              as: "headData",
            },
          },
          {
            $unwind: {
              path: "$headData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 0,
              headId: 1,
              headName: "$headData.name",
              "employeeTasks.tasks": 1,
              "employeeTasks._id": 1,
            },
          },
        ])
       
        return data
      } catch (error) {
        console.log(error);
        return [];
      }
    },

    add_sub_tasks_emp: async (
      employee_proj_tasks: user_tasks_todo_schema | any,
      emp_id: string,
    ) => {
      // console.log(employee_proj_tasks, emp_id);
      try {
        let exist = await modules.findOneAndUpdate(
          {
            task_id: employee_proj_tasks.task_id,
            // user_id: employee_proj_tasks.user_id,
          },
          {
            $set: {
              user_id: emp_id,
              task_id: employee_proj_tasks.task_id,
              project_id: employee_proj_tasks.project_id,
              user_subTaks: employee_proj_tasks.user_subTaks,
            },
          },
          {
            upsert: true,
            new: true,
            runValidators: true,
          },
        );

        if (exist) return { message: "todo list updated successfully" };
      } catch (error) {
        return error;
      }
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

    achive_sub_tods: async (id: any) => {
      let user_todo_data = await modules.find({ user_id: id });
      return user_todo_data;
    },

    achive_user_profile: async (id: any) => {
      let datas: any = jwt.verify(id, "secret_key");
      let ids = datas.id;
      console.log("id", ids);
      let data = await modules.find({ _id: ids });
      if (data.length === 0 || null || undefined) {
        let data = await admin_roles_models.findById({
          _id: new Types.ObjectId(ids),
        });
        return data;
      } else {
        return data;
      }
    },

    employeeList: async (id: any) => {
      let check_emp = await admin_roles_models.find({
        _id: new mongoose.Types.ObjectId(id),
      });
      let employeeList = await modules.find({});
      console.log("role", check_emp.length);
      if (check_emp.length == 0) {
        // check_emp = await admin_roles_models.find({});
        // let combain_emp = employeeList.concat(check_emp);
        console.log("emp");
        return employeeList;
        // return combain_emp;
      } else if (check_emp.length == 1) {
        console.log("head");
        check_emp = await admin_roles_models.find({});
        let combain_emp = employeeList.concat(check_emp);
        return combain_emp;
        // employeeList = await modules.find({});
        // return employeeList;
      }
    },

    create_grp: async (group_data: any) => {
      let members = group_data.members;
      // console.log(typeof members[0]);
      let data = new modules({
        groupName: group_data.name,
        members,
        groupAdmin: group_data.createdBy,
      });
      let group_ = await data.save();
      return group_;
    },

    emp_included: async (id: any) => {
      // console.log("function called");
      let groups = await modules.find({
        members: new mongoose.Types.ObjectId(id),
      });
      console.log("data", groups);
      return groups;
    },

    delete_message: async (id: string, sender: any) => {
      let encodedjwt: any = sender;
      console.log("this form delete msg function socket.io", id, sender);
      let userId: any = jwt.verify(encodedjwt, "secret_key");
      let msgdelete = await modules.findByIdAndDelete({
        _id: new mongoose.Types.ObjectId(id),
        sender: userId.id,
      });
      return msgdelete;
    },

    included_hybread_project: async (empid: string) => {
      try {
        console.log(empid);
        let inlcuded_proj_ = await modules.find({
          "departmentsOrdered.employee.employeeId": empid,
        });
        console.log(inlcuded_proj_);
        return inlcuded_proj_;
      } catch (error) {
        console.log(error);
      }
    },
    // AI Modified: Updated to use arrayFilters for deep nested task status updates
    //  this code is currenlty not using don't mind it
    update_hybread_tasks: async (
      projectId: string,
      departmentId: string,
      employeeId: string,
      taskId: string,
      status: string,
    ) => {
      try {
        let update_task_status = await modules.findOneAndUpdate(
          {
            _id: new mongoose.Types.ObjectId(projectId),
            "departmentsOrdered.departmentId": departmentId,
            "departmentsOrdered.employee.employeeId": employeeId,
          },

          {
            $set: {
              "departmentsOrdered.$[dept].employee.$[emp].tasks.$[task].task_status":
                status,
            },
          },

          {
            arrayFilters: [
              {
                "dept.departmentId": departmentId,
              },

              {
                "emp.employeeId": employeeId,
              },

              {
                "task.H_task_id": taskId,
              },
            ],

            new: true,
          },
        );

        console.log(update_task_status);
      } catch (error) {
        console.log(error);
      }
    },
    //
  };
};
