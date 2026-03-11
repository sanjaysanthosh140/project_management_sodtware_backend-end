import mongoose, { Schema } from "mongoose";
interface Iadmin_roles {
  name: string;
  email: string;
  department: string;
  role: string;
  active: boolean;
}

const admin_roles_schema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  department: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    require: true,
  },
  active: {
    type: Boolean,
    require: true,
  },
});

export const admin_roles_models = mongoose.model<Iadmin_roles>(
  "admin_roles",
  admin_roles_schema,
);
