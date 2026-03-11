import mongoose, { Schema } from "mongoose";

interface UserTaksTodo {
  user_id: string;
  project_id: string;
  task_id: string;
  user_subTaks: [];
}

// interface user_subTasks {
//     status: string;
//     title: string;
//     _id: string;
// }

const user_subTasks_schema = new Schema({
  createdAt: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  todo_id: {
    type: String,
    required: true,
  },
});

const user_tasks_todo_schema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  project_id: {
    type: String,
    required: true,
  },
  task_id: {
    type: String,
    required: true,
  },
  user_subTaks: {
    type: [user_subTasks_schema],
    required: true,
  },
});

const user_subTasks_todo = mongoose.model<UserTaksTodo>(
  "employee_sub_tasks",
  user_tasks_todo_schema,
);
export default user_subTasks_todo;
