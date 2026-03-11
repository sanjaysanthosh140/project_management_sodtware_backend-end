import mongoose, { Schema } from "mongoose";

interface DepartmentSchema {
  Dep_id: string;
  title: string;
  color: string;
  description: string;
}

const departmentSchema = new Schema({
  Dep_id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const departmentModel = mongoose.model<DepartmentSchema>(
  "Departments",
  departmentSchema,
);

export default departmentModel;
