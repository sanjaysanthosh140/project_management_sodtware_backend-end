import mongoose, { Schema } from "mongoose";

interface Itask {
    headId?: string,
    assignedDate?: string,
    deadline: string,
    desc: string,
    priority: string,
    status: string,
    title: string
}

const tasks_schema = new Schema({
    headId: {
        type: String,
        require: false
    },
    assignedDate: {
        type: String,
        require: false
    },
    deadline: {
        type: String,
        require: true
    },
    desc: {
        type: String,
        require: true
    },
    priority: {
        type: String,
        require: true
    },
    status: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    }
})


const tasks_module_it = mongoose.model<Itask>("it_tasks", tasks_schema);

export default tasks_module_it;