import { error } from "node:console";
import { adminCrudFunctions } from "./admin.crud";
import user_model from "../db_controllers/db_models/user_schema";
import { Request, Response, NextFunction } from "express";
import departmentModel from "../db_controllers/db_models/admin_side/department_schema";
import jwt from "jsonwebtoken";
import AttendanceModel from "../db_controllers/db_models/attendance_schema";
import DailyReportsModel from "../db_controllers/db_models/task_schemas/Daily_reports";
import tasks_module_it from "../db_controllers/db_models/task_schemas/tasks_schema";
import departmentProjectsModle from "../db_controllers/db_models/admin_side/department_projects";
import { admin_roles_models } from "../db_controllers/db_models/admin_roles_schema";
import assignedTasksModel from "../db_controllers/db_models/admin_side/assigen-tasks";
import { group_model } from "../db_controllers/db_models/user_side/scoket.io.group_schema";
import hybread_project_models from "../db_controllers/db_models/hybread_projects/hybread_project_schema";
import mongoose, { Types } from "mongoose";
import { io } from "../user_side/socket.io";
import { Socket } from "socket.io";
import accounts_schema_model from "../db_controllers/db_models/admin_side/billing_proj_accounts";
import production_activity_modle from "../db_controllers/db_models/admin_side/production_activity";

interface IDecodeToken {
  id: any;
  iat: number;
}
export const task_controller = (task_data: any, task_models: any) => {
  return new Promise((resolve, rejects) => {
    const task_obj = new task_models(task_data);
    console.log(task_data);
    task_obj
      .save()
      .then((data: string) => {
        console.log(data);
        if (data) resolve(true);
      })
      .catch((error: Error) => {
        rejects(error);
      });
  });
};

export const read_tasks = (task_module: any) => {
  return new Promise((resolve, reject) => {
    task_module
      .find()
      .then((data: any) => {
        resolve(data);
      })
      .catch((error: Error) => {
        reject(error);
      });
  });
};

export const fetchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const usersFetch = adminCrudFunctions(user_model);
  const data = await usersFetch.fetchAllUsers();
  res.status(200).json(data);
};

export const addEmploye = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, department, password } = req.body;
  const employeCreate = adminCrudFunctions(user_model);
  let empObj = await employeCreate.createUsers(
    name,
    email,
    department,
    password,
  );
  res.status(200).json(empObj.name);
};

export const create_admins = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let { name, email, department, password, role, active } = req.body;
  const create_admins = adminCrudFunctions(admin_roles_models);
  const admin_data = create_admins.add_new_admins(
    name,
    email,
    department,
    password,
    role,
    active,
  );
  res.status(200).json(admin_data);
};

export const update_admin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, department, role, active } = req.body;
  const id = req.params.id;
  const updateAdmin = adminCrudFunctions(admin_roles_models);
  let updatedData = await updateAdmin.update_admins(
    id,
    name,
    email,
    department,
    role,
    active,
  );
  res.status(200).json(updatedData);
};

export const deleteEmploye = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  const employeDelete = adminCrudFunctions(user_model);
  let deletedEmploye = await employeDelete.deleteEmploye(id);
  res.status(200).json(deletedEmploye);
};

export const updateEmplye = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, department } = req.body;
  const id = req.params.id;
  const updateEmploye = adminCrudFunctions(user_model);
  let updatedData = await updateEmploye.updateEmployess(
    id,
    name,
    email,
    department,
  );
  res.status(200).json(updateEmploye);
};

export const createDepartments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id, title, color, description } = req.body;
  console.log(req.body);
  const createDepartments = adminCrudFunctions(departmentModel);
  let departmentObj = await createDepartments.createDepartments(
    id,
    title,
    color,
    description,
  );
  console.log("after successfully added", departmentObj);
  res.status(200).json(departmentObj);
};

export const fetchDepartments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const retriveDepartments = adminCrudFunctions(departmentModel);
  let data = await retriveDepartments.fetchDepartments();
  console.log(data);
  res.status(200).json(data);
};

export const deleteDepartments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  const deleteDepartments = adminCrudFunctions(departmentModel);
  let deleteDepartment = await deleteDepartments.deleteDepartmetns(id);
  res.status(200).json(deleteDepartment);
};

export const updateDepartments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  const { title, color, description } = req.body;
  const updateDepartments = adminCrudFunctions(departmentModel);
  let updateDep_data = await updateDepartments.updateDepartments(
    id,
    title,
    color,
    description,
  );
  res.json(200).json(updateDep_data);
};

export const updateAttendance = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token: any = req.headers.authorization?.split(" ")[1];
  const decodedToken: any = jwt.verify(token, "secret_key");
  const id = decodedToken.id;
  const { userId, action } = req.body;
  const addAttendance = adminCrudFunctions(AttendanceModel);
  let addattendance = await addAttendance.addAttendance(action, id);
  res.status(200).json({ message: "Attendance updated successfully" });
};

export const Employe_logs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token: any = req.headers.authorization?.split(" ")[1];
  const decodedToken: any = jwt.verify(token, "secret_key");
  let id = decodedToken.id;
  let retrivLoegs = adminCrudFunctions(AttendanceModel);
  let logs = await retrivLoegs.retriveLogs(id);
  res.status(200).json(logs);
};

export const work_Reports = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { username, desc, deptId, type, date } = await req.body;
  let token: any = req.headers.authorization;
  let decodedToken: any = jwt.verify(token, "secret_key");

  //  console.log(name,desc, deptId, type, date,decodedToken);
  //  console.log("repo",username);
  const workReports = adminCrudFunctions(DailyReportsModel);
  let Dailyrepo = await workReports.DailyReports(
    decodedToken.id,
    username,
    desc,
    deptId,
    type,
    date,
  );

  console.log(Dailyrepo);
  res.status(200).json({ msg: "report added successfully" });
};

export const edit_daily_report = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let id = req.params.editingId;
  let report = req.body;
  let encodedjwt: any = req.headers.authorization;
  let decoded: any = jwt.verify(encodedjwt, "secret_key");
  const edit_reports = adminCrudFunctions(DailyReportsModel);
  console.log("update", id);
  let updated_datas = await edit_reports
    .daily_report_edit(decoded.id, id, report)
    .catch((error) => {
      res.status(503).json({ message: "server unavailable", error });
    });
  if (updated_datas) res.status(200).json({ mesage: "updated success fully" });
};
export const delete_daily_report = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let id = req.params.id;
  let encodedjwt: any = req.headers.authorization;
  let decoded: any = jwt.verify(encodedjwt, "secret_key");
  const delete_report = adminCrudFunctions(DailyReportsModel);
  const deleted_one = await delete_report
    .daily_report_delete(id, decoded.id)
    .catch((error) => {
      res.status(503).json({ message: "server unavailable", error });
    });
  if (deleted_one)
    res.send(200).json({ message: "subtask deleted successfully" });
};
export const read_reports = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const readReports = adminCrudFunctions(DailyReportsModel);
  let data = await readReports.readReports();
  res.status(200).json(data);
};

export const read_reports_by_employee = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const employeeId = req.params.employeeId;
    if (!employeeId) {
      res.status(400).json({ message: "employeeId is required" });
      return;
    }
    const reports = await DailyReportsModel.find({ userID: employeeId }).sort({
      date: -1,
    });
    res.status(200).json(reports);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed to fetch employee reports" });
  }
};

export const create_pojects = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token: any = req.headers.authorization?.split(" ")[1];
  const decodedToken: any = jwt.verify(token, "secret_key");
  const projectData = req.body;
  // console.log("head", decodedToken.id, projectData);
  const DepProject = adminCrudFunctions(departmentProjectsModle);
  let project = await DepProject.departmentProjects(
    decodedToken.id,
    projectData,
  );
  if (project) {
    try {
      // determine head's department and broadcast to that room
      console.log(project);
      const headProfile = await admin_roles_models
        .findById(decodedToken.id)
        .lean();
      const deptRoom = headProfile?.department || "IT";
      io.to(deptRoom).emit("new_project", project);
    } catch (e) {
      console.error("Failed to emit new_project socket event", e);
    }
  }

  console.log("new project data", project.description, project.title);
  res.status(200).json(project);
};

export const availableEmployess = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let encodedToken: any = req.headers.authorization;
  let decodedToken: any = jwt.verify(encodedToken, "secret_key");
  console.log("working", decodedToken.id);
  let getproj = adminCrudFunctions(admin_roles_models);
  let Employes = await getproj.fetchEmp(decodedToken.id);
  console.log(Employes);
  res.status(200).json(Employes);
};

export const Fetch_projects = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let encodedToken: any = req.headers.authorization;
  let decodedToken: any = jwt.verify(encodedToken, "secret_key");
  // console.log("working", decodedToken.id);
  let getheadProj = adminCrudFunctions(departmentProjectsModle);
  let data = await getheadProj.fetchHeadProjects(decodedToken.id);
  res.status(200).json(data);
};

export const assigned_tasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let employe = req.body;
  // console.log(employe);
  let assigenTask = adminCrudFunctions(assignedTasksModel);
  let assigne = await assigenTask.assignTasks(employe);
  res.status(200).json({ message: "Tasks assigned successfully" });
};

export const check_assigned_taks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  const chackTasks = adminCrudFunctions(assignedTasksModel);
  let data = await chackTasks.fetchTasks(id);
  res.status(200).json(data);
  // console.log(id);
};

export const update_assigned_tasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let id = req.params.id;
  let projTasks = req.body;
  console.log(id, projTasks);
  const updates = adminCrudFunctions(assignedTasksModel);
  let updated = await updates.updateassigenTasks(id, projTasks);
  res.status(200).json({ message: "Tasks updated successfully" });
};

export const create_hr_head_task = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      headId,
      admin,
      title,
      priority,
      deadline,
      assignedDate,
      assignedByRole,
      assignedByName,
    } = req.body;
    const taskObj = new tasks_module_it({
      headId,
      admin,
      title,
      desc: title,
      priority,
      deadline,
      assignedDate,
      status: "pending",
      assignedByRole,
      assignedByName,
    });
    const savedTask = await taskObj.save();
    if (savedTask) {
      io.to(headId).emit("assigned_task", savedTask);
      console.log("task assigned head id ", headId);
    }
    res.status(200).json(savedTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed to create task" });
  }
};

export const get_hr_head_tasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const headId = req.query.headId as string | undefined;
    console.log("call geted ", headId);
    const tasks = (await headId)
      ? await tasks_module_it.find({ headId }).sort({ assignedDate: -1 })
      : await tasks_module_it
          .find({ headId: { $exists: true, $ne: "" } })
          .sort({ assignedDate: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed to fetch tasks" });
  }
};

export const update_hr_head_task = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const taskData = req.body;
    const patch: Record<string, unknown> = {
      headId: taskData.headId,
      title: taskData.title,
      desc: taskData.title || taskData.desc,
      priority: taskData.priority,
      deadline: taskData.deadline,
      assignedDate: taskData.assignedDate,
      status: taskData.status || "pending",
    };
    if (taskData.assignedByRole !== undefined) {
      patch.assignedByRole = taskData.assignedByRole;
    }
    if (taskData.assignedByName !== undefined) {
      patch.assignedByName = taskData.assignedByName;
    }
    const updatedTask = await tasks_module_it.findByIdAndUpdate(id, patch, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(updatedTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed to update task" });
  }
};

export const delete_hr_head_task = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    await tasks_module_it.findByIdAndDelete(id);
    res.status(200).json({ message: "task deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed to delete task" });
  }
};
//  -----
export const project_overview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.project_id;
  const projectOverview = adminCrudFunctions(assignedTasksModel);
  let overview = await projectOverview.projectOverview(id);
  res.status(200).json(overview);
};

export const edit_project = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log("working");
    const id: any = req.params.id;
    const edit_project = adminCrudFunctions(departmentProjectsModle);
    const edit_proj_data = await edit_project.Edit_project(id);
    console.log(edit_proj_data);
    res.status(200).send(edit_proj_data);
  } catch (error) {
    res.status(500).send({ message: "server-error" });
  }
};

export const update_project = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let proj_id = req.params.id;
    let updated_data = req.body;
    const update_project = adminCrudFunctions(departmentProjectsModle);
    const updated_datas: any = update_project.update_Department(
      updated_data,
      proj_id,
    );
    if (updated_datas) {
      res.status(200).send({ message: "successfully updated " });
    }
    console.log(req.body, proj_id);
  } catch (error) {
    res.status(501).send({ message: "internal-server-error" });
  }
};

export const delete_project = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let id = req.params.id;
    console.log(id);
    const delete_project = adminCrudFunctions(departmentProjectsModle);
    const deleted_proj = await delete_project.delete_project(id);
    console.log(deleted_proj);
    if (deleted_proj) {
      try {
        const headId = (deleted_proj as any).head_id;
        const headProfile = await admin_roles_models.findById(headId).lean();
        const deptRoom = headProfile?.department || "IT";
        io.to(deptRoom).emit("delete_project", deleted_proj);
      } catch (e) {
        console.error("Failed to emit delete_project socket event", e);
      }
    }
    res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};
export const hr_projects_progress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const hrProjectsProgress = adminCrudFunctions(departmentProjectsModle);
    const project_data = await hrProjectsProgress.hr_proj_progress();
    console.log(project_data);
    res.status(200).send(project_data);
  } catch (error) {
    res.status(500).send({ message: "internal-server-error" });
  }
};

export const updateUserpassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let user_credentials = req.body;
  const updated_user_pass = adminCrudFunctions(user_model);
  const credentials =
    await updated_user_pass.update_credentails(user_credentials);
  console.log("updated", credentials);
  res
    .status(200)
    .json({ message: `${credentials.name} password successfully` });
};

export const get_admins = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const get_resposnse = adminCrudFunctions(admin_roles_models);
  const response = await get_resposnse.get_admins();
  console.log(response);
  res.status(200).json(response);
};

export const deleteadmins = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  let delete_admins = adminCrudFunctions(admin_roles_models);
  let resposne = await delete_admins.deleteEmploye(id);
  console.log(resposne);
  res.status(200).json({ message: `Admin ${resposne} deleted successfully` });
};

export const updateadminpasswods = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let admin_credentials = req.body;
  const updated_admins_pass = adminCrudFunctions(admin_roles_models);
  const credentials =
    await updated_admins_pass.update_credentails(admin_credentials);
  console.log("updated", credentials);
  res
    .status(200)
    .json({ message: `${credentials.name} password successfully` });
};

export const get_admin_profile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let encodedToken: any = req.headers.authorization;
  let decodedid: any = jwt.verify(encodedToken, "secret_key");
  const admin_profile = adminCrudFunctions(admin_roles_models);
  const profile = await admin_profile.get_admin_profile(decodedid.id);
  res.status(200).json(profile);
};

export const delete_groupe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let id = req.params.selectedGroup;
  let delete_group = adminCrudFunctions(group_model);
  let deleted = await delete_group.delete_group(id);
  // console.log("after", deleted);
  res.status(200).json({ message: "group deleted successfully" });
};

export const get_group = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let id = req.params.selectedGroup;
  // console.log(id);
  let get_group = adminCrudFunctions(group_model);
  let group = await get_group.get_group(id);
  // console.log("group", group);
  res.status(200).json(group);
};

export const edit_group = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let id = req.params.selectedGroup;
  let group_data = req.body;
  let updated_group = adminCrudFunctions(group_model);
  let updates = await updated_group.update_groups(id, group_data);
  if (updates) {
    res.status(200).json({ message: "updated successfully" });
  }
};

export const emplyee_perfomance_data = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let admin_crud_method = adminCrudFunctions(assignedTasksModel);
  let peformance_data = await admin_crud_method.emplyee_performance();
};

export const create_hybread_team = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // console.log(req.headers.authorization);
  let encodedToken: any = req.headers.authorization;
  let decodedToken: any = jwt.verify(encodedToken, "secret_key");
  console.log(decodedToken.id);
  let custom_teams = adminCrudFunctions(departmentModel);
  let custom_data = await custom_teams.custom_team(decodedToken);
  console.log(custom_data);
  res.status(200).json(custom_data);
};

export const create_hybread_custom_project = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let encodedToken: any = req.headers.authorization;
  console.log(encodedToken);
  let decodedToken: any = jwt.verify(encodedToken, "secret_key");
  let custom_proj_data = req.body;
  // console.log(decodedToken.id, custom_proj_data);
  let store_custom_proj_data = adminCrudFunctions(hybread_project_models);
  let stored_data =
    await store_custom_proj_data.create_custom_project(custom_proj_data);
};

export const get_everything = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let encodedToken: any = req.headers.authorization;
    let decodedToken: any = jwt.verify(encodedToken, "secret_key");
    console.log(decodedToken.id);
    const everything_data = adminCrudFunctions(hybread_project_models);
    const data = await everything_data.get_everything(decodedToken.id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "no data found " });
    }
  } catch (error) {
    console.log(error);
  }
};

export const everything_team_task = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const team_task_data = req.body;
  // console.log(team_task_data.team[2].tasks);
  const admin_crud_function = adminCrudFunctions(hybread_project_models);
  const E_team_task =
    await admin_crud_function.everything_team_task(team_task_data);
};

// AI Added: Controller for updating department-level project status
export const update_hybread_project_status = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { projectId, departmentId, status } = req.body;
    const admin_crud_function = adminCrudFunctions(hybread_project_models);
    const updated = await admin_crud_function.update_hybread_project_status(
      projectId,
      departmentId,
      status,
    );
    res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed to update project status" });
  }
};
//   adminCrudFunction using stoped here because implement cursor just automate the crud operation wroting
export const create_simple_custom_project = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let encodedToken: any = req.headers.authorization;
    let decodedToken: any = jwt.verify(encodedToken, "secret_key");
    let projectData = req.body;
    const newProject = new hybread_project_models(projectData);
    const savedProject = await newProject.save();
    if (savedProject) {
      let head_data: any = await admin_roles_models.findOne({
        _id: new Types.ObjectId(decodedToken.id),
      });
      let department = head_data.department;
      io.to(department).emit("custom_project", savedProject);
    }
    res.status(201).json(savedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create simple custom project" });
  }
};

export const get_simple_custom_projects = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const projects = await hybread_project_models.find().sort({ _id: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch simple custom projects" });
  }
};

export const update_simple_project_status = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { projectId, departmentId, status, pending_reason } = req.body;
    const result = await hybread_project_models.findOneAndUpdate(
      { _id: projectId, "departments.departmentId": departmentId },
      {
        $set: {
          "departments.$.dept_status": status,
          "departments.$.pending_reason": pending_reason || "",
        },
      },
      { new: true },
    );
    if (result) res.status(200).json(result);
    else res.status(404).json({ message: "Project or department not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update project status" });
  }
};

export const add_simple_project_global_task = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { projectId, content, date, contentType, departments } = req.body;
    const result = await hybread_project_models.findByIdAndUpdate(
      projectId,
      {
        $push: {
          tasks: { content, date, contentType, departments },
        },
      },
      { new: true },
    );
    if (result) res.status(200).json(result);
    else res.status(404).json({ message: "Project not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add task" });
  }
};

export const update_simple_project_global_task_status = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { projectId, taskId, departmentId, status, date, remark } = req.body;
    let encodedToken: any = req.headers.authorization;
    let decodedToken: any = jwt.verify(encodedToken, "secret_key");
    console.log(date);
    const result = await hybread_project_models.findOneAndUpdate(
      { _id: projectId },
      {
        $set: {
          "tasks.$[task].departments.$[dept].status": status,
          "tasks.$[task].departments.$[dept].remark": remark || "",
          "tasks.$[task].departments.$[dept].date": date,
        },
      },
      {
        arrayFilters: [
          { "task._id": taskId },
          { "dept.departmentId": departmentId },
        ],
        new: true,
      },
    );
    if (result) res.status(200).json(result);
    else res.status(404).json({ message: "Project not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update task status" });
  }
};

export const get_simple_custom_project_by_id = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let project_id = req.params.pro_id;
    console.log(project_id);
    let project = await hybread_project_models.findById({
      _id: new mongoose.Types.ObjectId(project_id),
    });
    console.log(project);
    res.status(200).json({ project });
  } catch (error) {
    console.log(error);
  }
};

export const update_simple_custom_project = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let project_id = req.params.edit_id;
    let prod_data = req.body;
    console.log(project_id, prod_data);
    let data = await hybread_project_models.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(project_id) },
      {
        $set: {
          projectTilte: prod_data.projectTilte,
          departments: prod_data.departments,
        },
      },
    );
    if (data) {
      res.status(200).json({ message: "successfully updated" });
    } else {
      res.status(404).json({ message: "project updating failed" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const get_simple_proj_tasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let proj_id = req.params.proj_id;
    let proj_task_data = await hybread_project_models.findById({
      _id: new mongoose.Types.ObjectId(proj_id),
    });
    console.log(proj_task_data);
    res.status(200).json(proj_task_data);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve project tasks", error });
  }
};

export const update_simple_proj_task = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let task_data = req.body;
    let proj_id = task_data.projectId;
    let task_id = task_data.taskId;
    console.log(task_id);
    let updated = await hybread_project_models.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(proj_id),
        "tasks._id": new mongoose.Types.ObjectId(task_id),
      },
      {
        $set: {
          "tasks.$.date": task_data.date,
          "tasks.$.contentType": task_data.contentType,
          "tasks.$.content": task_data.content,
        },
      },
    );
    if (updated) {
      res.status(200).json({ message: "successfully updated task" });
    } else {
      res.status(404).json({ message: "task updaton faild" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const delete_simple_project = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let encodedToken: any = req.headers.authorization;
    let decodedToken: any = jwt.verify(encodedToken, "secret_key");
    console.log("call reaced");
    let id = req.params.pro_id;
    const resposnse = await hybread_project_models.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (resposnse) {
      let departmen_: any = await admin_roles_models.findOne({
        _id: new Types.ObjectId(decodedToken.id),
      });
      let msg = {
        clientname: resposnse.projectTilte,
        headname: departmen_.name,
        department: departmen_.department,
      };
      let department = departmen_.department;
      io.to(department).emit("remove_custom_client", msg);
      console.log("resposn after delete operaction", resposnse);
    }
    res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const delete_simple_project_global_task = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let { projectId, taskId } = req.body;
    console.log(projectId, taskId);
    let data = await hybread_project_models.findOne({
      _id: new mongoose.Types.ObjectId(projectId),
      "tasks._id": new mongoose.Types.ObjectId(taskId),
    });
    let tasks: any = data?.tasks;
    let index: any = tasks?.findIndex((i: any) => i._id == taskId);
    tasks?.splice(index, 1);
    console.log(tasks);
    let output = await hybread_project_models.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(projectId),
        "tasks._id": new mongoose.Types.ObjectId(taskId),
      },
      {
        $set: { tasks: tasks },
      },
    );
    res.status(200).json({ message: "task removed successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const add_to_accounts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let encodedToken: any = req.headers.authorization;
    let decodedToekn: any = jwt.verify(encodedToken, "secret_key");
    const add_to_acccount = req.body;
    const account_data = new accounts_schema_model(add_to_acccount);
    const account_response = await account_data.save();
    console.log(account_response);
    if (account_response) {
      // console.log(account_response);
      let account_notification: any = await admin_roles_models.findOne({
        department: "Accounts",
      });
      if (account_notification._id && account_notification) {
        io.to(account_notification._id.toString()).emit(
          "new_billing_entry",
          account_response,
        );
      }
    }
    res.status(201).json(account_response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to save billing entry" });
  }
};

export const account_billings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const billing_data = await accounts_schema_model.find({});
    console.log(billing_data);
    res.status(200).json(billing_data);
  } catch (error) {
    console.log(error);
  }
};

export const edit_accountBilling = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let { projectName, description, department } = req.body;
    let id = req.params.pro_id;
    const edited = await accounts_schema_model.findByIdAndUpdate(
      { _id: new Types.ObjectId(id) },
      {
        $set: {
          projectName: projectName,
          description: description,
          department: department,
        },
        new: true,
      },
    );
    console.log(edited);
    if (edited) {
      res.status(200).json({ message: `updated success fully` });
    }
  } catch (error) {
    console.log(error);
  }
};

export const delete_account_datas = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let id = req.params.id;
    await accounts_schema_model
      .findOneAndDelete({
        _id: new Types.ObjectId(id),
      })
      .then((data) => {
        if (data) {
          res.status(200).json({ message: "success fully deletd" });
        }
      });
  } catch (error) {
    console.log(error);
  }
};
export const get_desk_short = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(req.file);
};

export const production_activities = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log(req.body);
    console.log(req.headers.authorization);
    let production_data = req.body;
    let encodedToekn: any = req.headers.authorization;
    let decodeToken: any = jwt.verify(encodedToekn, "secret_key");
    let production = adminCrudFunctions(production_activity_modle);
    let data = await production.create_production_activities(
      decodeToken.id,
      production_data,
    );
    console.log(decodeToken.id);
    if (data) {
      res
        .status(201)
        .json({ message: "Production activity saved successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to save production activity" });
  }
};

export const get_production_data = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data_production = await adminCrudFunctions(production_activity_modle);
    const production = await data_production.get_production_activity();
    console.log(production);
    res.status(200).json(production);
  } catch (error) {
    console.log(error);
  }
};

export const delete_production_data = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log("call reached here");
    let id = req.params.id;
    const delelte_production = await adminCrudFunctions(
      production_activity_modle,
    );
    const deleted_Res = await delelte_production.delete_production_data(id);
    if (deleted_Res !== undefined || null || [])
      res
        .status(200)
        .json(`deleted successfully ${deleted_Res.client} word data`);
  } catch (error) {
    console.log(error);
  }
};

export const edit_production_data = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let proj_id = req.params.id;
    let proj_data = req.body;
    let encoded_token: any = req.headers.authorization;
    let decoded_token: any = jwt.verify(encoded_token, "secret_key");
    console.log(decoded_token);
    let head_id = decoded_token.id;
    let edit_production_data = await adminCrudFunctions(
      production_activity_modle,
    );
    let data = await edit_production_data.edit_prodcution_data(
      proj_id,
      proj_data,
      head_id,
    );
    if (data) {
      res
        .status(200)
        .json({ message: "Production activity updated successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update production activity" });
  }
};
