"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// interface hybread_customTeam {
//     name: string,
//     members: [{
//         empId: string
//         name: string,
//         department: string,
//     }]
// }
const departmentordered = new mongoose_1.Schema({
    departmentId: {
        type: String,
        required: true,
    },
    departmentName: {
        type: String,
        required: true,
    },
    headId: {
        type: String,
        required: true,
    },
    headName: {
        type: String,
        required: true,
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
const hybread_project_schema = new mongoose_1.Schema({
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
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    departments: [departmentordered],
    tasks: [
        {
            date: { type: String, required: false },
            contentType: { type: String, required: false },
            content: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
            departments: [
                {
                    departmentId: { type: String, required: true },
                    departmentName: { type: String, required: true },
                    status: { type: String, default: "pending" },
                    date: { type: String, require: false },
                    remark: { type: String, default: "" },
                },
            ],
        },
    ],
    // customTeam: customTeamMembers
});
const hybread_project_models = mongoose_1.default.model("hybread_projects", hybread_project_schema);
exports.default = hybread_project_models;
