import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { ObjectId } from "mongoose";
import { user_project_controller } from "./user_controller";
import departmentProjectsModle from "../db_controllers/db_models/admin_side/department_projects";
import assignedTasksModel from "../db_controllers/db_models/admin_side/assigen-tasks";
import user_subTasks_todo from "../db_controllers/db_models/user_side/user_tasks_todo";
import user_model from "../db_controllers/db_models/user_schema";
import message_model from "../db_controllers/db_models/user_side/socket.io.message_schema";
import { group_model } from "../db_controllers/db_models/user_side/scoket.io.group_schema";
interface IdecodedToken {
  id: ObjectId;
  iat: number;
}
export const emp_included_proj = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const selectedEmployeeId = req.query.empId as string | undefined;
    let targetEmployeeId = selectedEmployeeId;
    if (!targetEmployeeId) {
      let id: any = req.headers.authorization;
      let decodedToken: any = await jwt.verify(id, "secret_key");
      targetEmployeeId = decodedToken.id;
    }
    if (!targetEmployeeId) {
      return res.status(400).json({ message: "employee id is required" });
    }
    let employee_assigned_proj = await user_project_controller(
      departmentProjectsModle,
    );
    let user_assigned_proj =
      await employee_assigned_proj.user_assigned_projects(targetEmployeeId);
    res.status(200).json(user_assigned_proj);
  } catch (error) {
    return next(error);
  }
};

export const emp_proj_tasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let id: any = req.params.projectId;
    const selectedEmployeeId = req.query.empId as string | undefined;
    let targetEmployeeId = selectedEmployeeId;
    if (!targetEmployeeId) {
      let decodedToken: any = req.headers.authorization;
      let encodedToken: any = jwt.verify(decodedToken, "secret_key");
      targetEmployeeId = encodedToken.id;
    }
    if (!targetEmployeeId) {
      return res.status(400).json({ message: "employee id is required" });
    }
    // console.log("proj_id", id, "emp_id", encodedToken.id);
    let assigned_tasks_for_emp =
      await user_project_controller(assignedTasksModel);
    let employe_proj_tasks =
      await assigned_tasks_for_emp.employee_assigned_tasks(targetEmployeeId, id);
    console.log(employe_proj_tasks);
    res.status(200).json(employe_proj_tasks);
  } catch (error) {
    return error;
  }
};

export const add_multiple_todos = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let employeeTodo = req.body;
    let emp_ids: any = req.headers.authorization;
    let emp_id: any = jwt.verify(emp_ids, "secret_key");
    // console.log(employeeTodo);
    let employee_sub_tasks = await user_project_controller(user_subTasks_todo);
    let add_sub_taks = await employee_sub_tasks
      .add_sub_tasks_emp(employeeTodo, emp_id.id)
      .catch((error) => {
        res
          .status(500)
          .json({ message: "internal server error", error: error });
      });
    if (add_sub_taks) res.status(200).json({ message: add_sub_taks });
  } catch (error) {
    return error;
  }
};

export const achive_todo_list = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const selectedEmployeeId = req.query.empId as string | undefined;
    let targetEmployeeId = selectedEmployeeId;
    if (!targetEmployeeId) {
      let id: any = req.headers.authorization;
      let emp_id: any = jwt.verify(id, "secret_key");
      targetEmployeeId = emp_id.id;
    }
    let achive_todo_method = await user_project_controller(user_subTasks_todo);
    let sub_todos = await achive_todo_method.achive_sub_tods(targetEmployeeId);
    res.status(200).send(sub_todos);
  } catch (error) {
    console.log(error);

    res.status(501).send({ message: "internal server error" });
  }
};


export const employee_profile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let id = req.headers.authorization;
  try {
    let employee_profile = await user_project_controller(user_model);
    let employee_data = await employee_profile.achive_user_profile(id);
    console.log(employee_data);
    res.status(200).send(employee_data);
  } catch (error) {
    console.log(error);
  }
};

export const getchatbox = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let dep = req.params.roomType;
  console.log("type", dep);
  let deparment_chats = await message_model
    .find({ department: dep, group: dep })
    .sort({ createdAt: 1 })
    .populate("sender", "name");
  console.log(deparment_chats);
  res.status(200).send(deparment_chats);
};

export const get_employees = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let encodedjwt: any = req.headers.authorization;
  let decodedid: any = jwt.verify(encodedjwt, "secret_key");
  let employeelist = await user_project_controller(user_model);
  let users = await employeelist.employeeList(decodedid.id);
  res.status(200).json(users);
};

export const new_group = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // console.log(req.body);
  let group_data = req.body;
  let new_group_create = await user_project_controller(group_model);
  let grp_created = await new_group_create.create_grp(group_data);
  res.status(200).json(grp_created);
};

export const get_included_grp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(req.headers.authorization, "from included_grp");
  let encodedjwt: any = req.headers.authorization;
  let decodedid: any = jwt.verify(encodedjwt, "secret_key");
  let id = decodedid.id;
  let groups = await user_project_controller(group_model);
  let included_grp = await groups.emp_included(id);
  res.status(200).json(included_grp);
};

export const delete_msg = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let msgId = req.params.msgId;
  console.log(msgId);
  let encodedjwt: any = req.headers.authorization;
  let decodeId: any = jwt.verify(encodedjwt, "secret_key");
  let delete_msg = await user_project_controller(message_model);
  //  let delete_one = await delete_msg.delete_message(msgId, decodeId.id);
  // console.log(delete_one);
  // res.status(200).json({ message: "message deleted" });
};
