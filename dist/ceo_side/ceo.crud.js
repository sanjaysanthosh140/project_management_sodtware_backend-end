"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.achive_created_todo_list = exports.employee_included_proj = void 0;
const employee_included_proj = async (req, res, Next) => {
    try {
        console.log("function called");
        let id = req.params.id;
        let id2 = req.query.id;
        console.log("id", id, "id2", id2);
        // const get_included_project = user_project_controller(departmentProjectsModle);
        //  const inlcuded_resposne = (await get_included_project).user_assigned_projects(id);
    }
    catch (error) {
        console.log(error);
    }
};
exports.employee_included_proj = employee_included_proj;
const achive_created_todo_list = async (req, res, Next) => {
    try {
        let id = req.params.id;
        let id2 = req.query.id;
        console.log(id, id2);
    }
    catch (error) {
        console.log(error);
    }
};
exports.achive_created_todo_list = achive_created_todo_list;
