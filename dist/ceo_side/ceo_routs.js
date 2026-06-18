"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ceo_crud_1 = require("./ceo.crud");
let Router = express_1.default.Router();
Router.get("/employee_included_proj", ceo_crud_1.employee_included_proj);
Router.get("/achive_created_todo_list", ceo_crud_1.achive_created_todo_list);
exports.default = Router;
