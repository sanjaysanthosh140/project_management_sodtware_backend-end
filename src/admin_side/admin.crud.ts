import bcrypt from "bcrypt";
import mongoose, { mongo, Types } from "mongoose";
import user_model from "../db_controllers/db_models/user_schema";
interface IteamMembers {
  userId: string;
  name: string;
  role: string;
}

interface Itodolist {
  _id: string;
  title: string;
  dueDate: string;
  status: "pending" | "inprogress" | "completed";
  priority: "low" | "medium" | "high";
}
interface Iproject {
  // ts type for add department projects from head + assigen team members + add todos
  head_id: String;
  title: String;
  deadline: string;
  description: string;
  priority: "low" | "medium" | "high";
  teamMembers: IteamMembers[];
  todos: Itodolist[];
}

interface Itasks {
  // ts type for drop tasks from head to employee
  employee: string;
  tasks: {
    task_id: string;
    title: string;
    priority: string;
    duedate: string;
    status: string;
  };
}

interface IassignedTasks {
  projectId: string;
  headId: string;
  employeeTasks: Itasks[];
}

export const adminCrudFunctions = (modules: any) => {
  return {
    fetchAllUsers: async () => {
      const data = await modules.find();
      return data;
      // function to fetch all users ...
    },
    createUsers: async (
      name: string,
      email: string,
      department: string,
      password: string,
    ) => {
      let salt = bcrypt.genSaltSync(10);
      let hash2 = bcrypt.hashSync(password, salt);
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

    add_new_admins: async (
      name: string,
      email: string,
      department: string,
      password: string,
      role: string,
      active: string,
    ) => {
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(password, salt);
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

    updateEmployess: async (
      id: string,
      name: string,
      email: string,
      department: string,
    ) => {
      let updateEmploye = await modules.findByIdAndUpdate(
        id,
        {
          name,
          email,
          department,
        },
        {
          new: true,
          runvalidators: true,
        },
      );
      return updateEmploye;
    },

    update_admins: async (
      id: string,
      name: string,
      email: string,
      department: string,
      role: string,
      active: boolean,
    ) => {
      let updateAdmin = await modules.findByIdAndUpdate(
        id,
        {
          name,
          email,
          department,
          role,
          active,
        },
        {
          new: true,
          runvalidators: true,
        },
      );
      return updateAdmin;
    },

    deleteEmploye: async (id: string) => {
      let deletedEmploye = await modules.findByIdAndDelete(
        new Types.ObjectId(id),
      );
      return deletedEmploye.name;
    },
    createDepartments: async (
      Dep_id: string,
      title: string,
      color: string,
      description: string,
    ) => {
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
    deleteDepartmetns: async (id: string) => {
      let deleteDepartment = await modules.findByIdAndDelete(id);
      return deleteDepartment.title;
    },
    updateDepartments: async (
      id: string,
      title: string,
      color: string,
      description: string,
    ) => {
      let updateDepartment = await modules.findByIdAndUpdate(
        id,
        {
          id,
          title,
          color,
          description,
        },
        {
          new: true,
          runValidators: true,
        },
      );
      return updateDepartment;
    },

    addAttendance: async (action: String, id: String) => {
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
        } else {
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

    retriveLogs: async (id: string) => {
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

    DailyReports: async (
      userID: string,
      username: string,
      desc: string,
      deptId: string,
      type: string,
      date: string,
    ) => {
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
    daily_report_edit: async (user_id: string, id: string, report: any) => {
      try {
        console.log(id);
        let data = await modules.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(id), userID: user_id },
          { desc: report.desc },
        );
        console.log(data);
        return data;
        // let data = await modules.findById({_id:new mongoose.Types.ObjectId(id),userID:user_id});
        // console.log(data);
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    daily_report_delete: async (id: string, user_id: string) => {
      try {
        console.log(id, user_id);
        let data = await modules.findByIdAndDelete({
          _id: new mongoose.Types.ObjectId(id),
          userID: user_id,
        });
        console.log(data);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    departmentProjects: async (
      head_id: string | any,
      projectData: Iproject,
    ) => {
      let { title, description, deadline, priority, teamMembers, todos } =
        projectData;
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

    fetchEmp: async (id: string) => {
      let admindata = await modules.findOne({ _id: id });
      let department = admindata.department;
      let employes = await user_model.find({
        department: department,
      });
      return employes;
    },
    fetchHeadProjects: async (id: string) => {
      console.log("head id", id);
      let data = await modules.find({ head_id: id })
      console.log("data", data);
      return data;
    },
    assignTasks: async (employeeTaskts: IassignedTasks) => {
      console.log(employeeTaskts);
      let assigne = new modules(employeeTaskts);
      await assigne.save().then(async (data: IassignedTasks) => {
        return data;
      });
    },
    fetchTasks: async (id: string) => {
      let data = await modules.findOne({ projectId: id });
      return data;
    },
    updateassigenTasks: async (
      id: string,
      updatedProjTasks: IassignedTasks,
    ) => {
      await modules
        .findOneAndUpdate(
          {
            projectId: id,
          },
          {
            projectId: updatedProjTasks.projectId,
            headid: updatedProjTasks.headId,
            employeeTasks: updatedProjTasks.employeeTasks,
          },
        )
        .then(async (data: IassignedTasks) => {
          console.log(data);
          return data;
        });
    },
    projectOverview: async (id: any) => {
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

    Edit_project: async (id: Types.ObjectId) => {
      // console.log(id);
      let data = await modules.findOne({ _id: id });
      return data;
    },

    update_Department: async (data: Iproject, id: any) => {
      let { title, description, deadline, priority, teamMembers, todos } = data;
      let updated = await modules.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            title,
            description,
            deadline,
            priority,
            teamMembers,
            todos,
          },
        },
      );
      console.log(updated);
      return updated;
    },

    delete_project: async (id: string) => {
      let data = await modules.findByIdAndDelete({
        _id: new mongoose.Types.ObjectId(id),
      });
      return data;
    },
    hr_proj_progress: async () => {
      let data = await modules.find({});
      return data;
    },

    update_credentails: async (data: any) => {
      console.log(data.email);
      let salt: any = bcrypt.genSaltSync(10);
      let password = data.newPassword;
      let hash = bcrypt.hashSync(password, salt);
      // console.log("pass", hash);
      let updated_credentails = await modules.findOneAndUpdate(
        { email: data.email },
        {
          password: hash,
        },
        {
          new: true,
        },
      );
      console.log(updated_credentails);
      return updated_credentails;
    },

    get_admins: async () => {
      let data = await modules.find();
      return data;
    },
    get_admin_profile: async (id: any) => {
      let profile = await modules.find({ _id: id });
      console.log(profile);
      return profile;
    },
    delete_group: async (id: string) => {
      let deleted = await modules.findByIdAndDelete({
        _id: new mongoose.Types.ObjectId(id),
      });
      return deleted;
    },
    get_group: async (id: string) => {
      let group_data = await modules.find({
        _id: new mongoose.Types.ObjectId(id),
      });

      return group_data;
    },

    update_groups: async (id: string, data: any) => {
      console.log(id, data);
      let update_group = await modules.findByIdAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(id),
        },
        {
          groupName: data.name,
          members: data.members,
        },
      );
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
      } catch (error) {
        console.log(error);
      }
    },
    custom_team: async (head_id: any) => {
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
      } catch (error) {
        console.log(error);
      }
    },
    create_custom_project: async (custom_proj_data: any) => {
      try {
        console.log(
          custom_proj_data.fileNo,
          custom_proj_data.date,
          custom_proj_data.channelName,
          custom_proj_data.projectOption,
          custom_proj_data.title,
          custom_proj_data.tump,
          custom_proj_data.departmentsOrdered,
          // custom_proj_data.customTeam,
          // custom_proj_data.customTeam.name
        );
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
      } catch (error) {
        console.log(error);
      }
    },
    get_everything: async (decoded_token: any) => {
      try {
        console.log("employee token reached here  ", decoded_token);
        let data = await modules.find({
          "departmentsOrdered.headId": decoded_token,
        });

        console.log(data);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    everything_team_task: async (everything_team_task: any) => {
      try {
        console.log("everything_team_task_reached ", everything_team_task);
        let dep_id = everything_team_task.departmentId;
        let proj_id = new mongoose.Types.ObjectId(
          everything_team_task.projectId,
        );
        let departmet = await modules.findOneAndUpdate(
          {
            _id: proj_id,
            "departmentsOrdered.departmentId": dep_id,
          },
          {
            $set: {
              "departmentsOrdered.$.employee": everything_team_task.team,
            },
          },
        );
        console.log(departmet);
      } catch (error) {
        console.log(error);
      }
    },
    // AI Added: Updates the status of a specific department within a hybrid project
    update_hybread_project_status: async (
      projectId: string,
      departmentId: string,
      status: string,
    ) => {
      try {
        let updated = await modules.findOneAndUpdate(
          {
            _id: new mongoose.Types.ObjectId(projectId),
            "departmentsOrdered.departmentId": departmentId,
          },
          {
            $set: { "departmentsOrdered.$.dept_status": status },
          },
          { new: true },
        );
        return updated;
      } catch (error) {
        console.log(error);
      }
    },
  };
};
