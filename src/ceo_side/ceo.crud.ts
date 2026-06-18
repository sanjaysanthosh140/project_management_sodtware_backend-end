import { Request, Response, NextFunction } from "express";
import { adminCrudFunctions } from "../admin_side/admin.crud";
import departmentProjectsModle from "../db_controllers/db_models/admin_side/department_projects";
import { user_project_controller } from "../user_side/user_controller";

export const employee_included_proj = async (
  req: Request,
  res: Response,
  Next: NextFunction,
) => {
  try {
    console.log("function called");
    let id = req.params.id;
    let id2 = req.query.id;
    console.log("id", id, "id2", id2);
    // const get_included_project = user_project_controller(departmentProjectsModle);
    //  const inlcuded_resposne = (await get_included_project).user_assigned_projects(id);
  } catch (error) {
    console.log(error);
  }
};

export const achive_created_todo_list = async (
  req: Request,
  res: Response,
  Next: NextFunction,
) => {
  try {
    let id = req.params.id;
    let id2 = req.query.id;
    console.log(id, id2);
  } catch (error) {
    console.log(error);
  }
};
