import mongoose, { Schema, Mongoose } from "mongoose"
import { create_hybread_custom_project } from "../../../admin_side/task_controllers"
interface hybread_proj_input_structure {
    // fileNo: string,
    // date: string,
    // channelName: string,
    // projectOption: string,
    // title: string,
    // tump: string,
    projectTilte: string,
    departments: [],
    createdAt?: Date,
    tasks?: project_task_structure[],
    // customTeam: {
    //     name: string,
    //     members: []
    // },
}
interface hybread_proj_department_structure {
    departmentId: string,
    departmentName: string,
    headId: string,
    headName: string,
    // employee: [],
    dept_status: string,
    pending_reason: string
}

interface project_task_structure {
    date: string,
    contentType: string,
    content: string,
    createdAt: Date,
    departments: {
        departmentId: string,
        departmentName: string,
        status: string,
        remark: string
    }[]
}

// interface hybread_customTeam {
//     name: string,
//     members: [{
//         empId: string
//         name: string,
//         department: string,
//     }]
// }
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
    },
    // dept_status: {
    //     type: String,
    //     default: "pending",
    //     required: false,
    // },
    // pending_reason: {
    //     type: String,
    //     required: false
    // }


    // employee: {
    //     employeeId: {
    //         type: String,
    //         required: false
    //     },
    //     name: {
    //         type: String,
    //         required: false
    //     },
    //     tasks: [
    //         {
    //             title: {
    //                 type: String,
    //                 required: false,
    //             },
    //             hours: {
    //                 type: String,
    //                 required: false,
    //             },
    //             date: {
    //                 type: String,
    //                 required: false,
    //             },
    //             H_task_id: {
    //                 type: String,
    //                 require: false
    //             },
    //             task_status: {
    //                 type: String,
    //                 default: "pending",
    //                 required: false
    //             }
    //         }
    //     ]
    // }

});
// const customTeamMembers = new Schema<hybread_customTeam>({
//     name: {
//         type: String,
//         required: true
//     },
//     members: [{
//         empId: {
//             type: String,
//             required: true
//         },
//         name: {
//             type: String,
//             required: true
//         },
//         department: {
//             type: String,
//             required: true
//         }
//     }]
// })
const hybread_project_schema = new Schema<hybread_proj_input_structure>({
    // fileNo: {
    //     type: String,
    //     required: true
    // },
    // date: {
    //     type: String,
    //     required: true
    // },
    // channelName: {
    //     type: String,
    //     required: true
    // },
    // projectOption: {
    //     type: String,
    //     required: true
    // },
    // title: {
    //     type: String,
    //     required: true
    // },
    // tump: {
    //     type: String,
    //     required: true
    // },
    projectTilte: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    departments: [departmentordered],
    tasks: [{
        date: { type: String, required: false },
        contentType: { type: String, required: false },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        departments: [{
            departmentId: { type: String, required: true },
            departmentName: { type: String, required: true },
            status: { type: String, default: "pending" },
            remark: { type: String, default: "" }
        }]
    }]
    // customTeam: customTeamMembers
});
const hybread_project_models = mongoose.model("hybread_projects", hybread_project_schema);
export default hybread_project_models;