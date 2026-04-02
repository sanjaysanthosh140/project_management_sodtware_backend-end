import { error } from "node:console";
import { adminCrudFunctions } from "./admin.crud";
import user_model from "../db_controllers/db_models/user_schema";
import { Request, Response, NextFunction } from "express";
import departmentModel from "../db_controllers/db_models/admin_side/department_schema";

import jwt from "jsonwebtoken";
import AttendanceModel from "../db_controllers/db_models/attendance_schema";
import DailyReportsModel from "../db_controllers/db_models/task_schemas/Daily_reports";
import departmentProjectsModle from "../db_controllers/db_models/admin_side/department_projects";
import { admin_roles_models } from "../db_controllers/db_models/admin_roles_schema";
import assignedTasksModel from "../db_controllers/db_models/admin_side/assigen-tasks";
import { group_model } from "../db_controllers/db_models/user_side/scoket.io.group_schema";
interface IDecodeToken {
  id: string;
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
  next: NextFunction
) => {
  let id = req.params.selectedGroup;
  let delete_group = adminCrudFunctions(group_model);
  let deleted = await delete_group.delete_group(id);
  // console.log("after", deleted);
  res.status(200).json({ message: "group deleted successfully" });
}

export const get_group = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let id = req.params.selectedGroup;
  // console.log(id);
  let get_group = adminCrudFunctions(group_model);
  let group = await get_group.get_group(id);
  // console.log("group", group);
  res.status(200).json(group);
}


export const edit_group = async (req: Request, res: Response, next: NextFunction) => {
  let id = req.params.selectedGroup
  let group_data = req.body;
  let updated_group = adminCrudFunctions(group_model);
  let updates = await updated_group.update_groups(id, group_data);
  if (updates) {
    res.status(200).json({ message: "updated successfully" })
  }

}