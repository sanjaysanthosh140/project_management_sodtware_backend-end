import mongoose, { Schema, Mongoose } from "mongoose"
import { create_hybread_custom_project } from "../../../admin_side/task_controllers"

interface hybread_proj_input_structure {
    fileNo: string,
    date: string,
    channelName: string,
    projectOption: string,
    title: string,
    tump: string,
    departmentsOrdered: [],
    customTeam: {
        name: string,
        members: []
    },
}
interface hybread_proj_department_structure {
    departmentId: string,
    departmentName: string,
    headId: string,
    headName: string
}

interface hybread_customTeam {
    name: string,
    members: [{
        empId: string
        name: string,
        department: string,
    }]
}
const departmentordered = new Schema<hybread_proj_department_structure>({
    departmentId: {
        type: String,
        required: true
    },
    departmentName: {
        type: String,
        required: true
    },
    headId: {
        type: String,
        required: true
    },
    headName: {
        type: String,
        required: true
    }

})
const customTeamMembers = new Schema<hybread_customTeam>({
    name: {
        type: String,
        required: true
    },
    members: [{
        empId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        department: {
            type: String,
            required: true
        }
    }]
})
const hybread_project_schema = new Schema<hybread_proj_input_structure>({
    fileNo: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    channelName: {
        type: String,
        required: true
    },
    projectOption: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    tump: {
        type: String,
        required: true
    },
    departmentsOrdered: [departmentordered],
    customTeam: customTeamMembers
})

const hybread_project_models = mongoose.model("hybread_projects", hybread_project_schema);
export default hybread_project_models;