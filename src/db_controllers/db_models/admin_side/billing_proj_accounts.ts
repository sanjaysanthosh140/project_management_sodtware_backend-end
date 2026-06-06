import mongoose, { Schema } from "mongoose";

interface add_to_accounts {
  projectId: string;
  projectName: string;
  status: string;
  description: string;
  headId: string;
  department: string;
}

const add_To_accounts = new Schema<add_to_accounts>({
  projectId: {
    type: String,
    require: true,
  },
  projectName: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  headId: {
    type: String,
    require: true,
  },
  department: {
    type: String,
    requie: true,
  },
});

const accounts_schema_model = mongoose.model<add_to_accounts>(
  "add_to_accounts",
  add_To_accounts,
);
export default accounts_schema_model;
