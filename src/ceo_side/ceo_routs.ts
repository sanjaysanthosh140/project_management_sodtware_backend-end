import express from "express";
import { achive_created_todo_list, employee_included_proj } from "./ceo.crud";
let Router = express.Router();
Router.get("/employee_included_proj", employee_included_proj);
Router.get("/achive_created_todo_list",achive_created_todo_list)
export default Router;
