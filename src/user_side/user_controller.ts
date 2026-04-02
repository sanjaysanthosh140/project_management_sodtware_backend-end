import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { admin_roles_models } from "../db_controllers/db_models/admin_roles_schema";
export const user_project_controller = async (modules: any) => {
  // interface user_todolist {
  //   project_id: string,
  //   task_id: string,
  //   user_subTaks: []
  // }
  interface tosolist {
    todo_id: String;
    title: String;
    status: String;
    createdAt: String;
  }
  type user_tasks_todo_schema = {
    project_id: string;
    task_id: string;
    user_subTaks: [tosolist];
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
      let data = await modules.find({ "teamMembers.userId": id });
      return data;
    },

    employee_assigned_tasks: async (id: string, projectId: string) => {
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
      let data = await modules.find({ _id: ids });
      return data;
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
      let encodedjwt: any = sender
      console.log("this form delete msg function socket.io",id,sender);
      let userId: any = jwt.verify(encodedjwt, "secret_key");
      let msgdelete = await modules.findByIdAndDelete({
        _id: new mongoose.Types.ObjectId(id),
        sender:userId.id ,
      });
      return msgdelete;
    },
  };
};
