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
        } else {
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
          {
            $project: {
              log: 0
            },
          },
          {
            $sort: {
              date: -1
            }
          }

        ])
      // .sort({ "data.date": 1 });
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
      let data = await modules.find({ head_id: id });
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
  };
};
