import mongoose, { model, Schema, Types } from "mongoose";

interface group {
  groupName: string;
  groupAdmin: string;
  members: Types.ObjectId[]|any;
}

const group_schema = new Schema({
  groupName: {
    type: String,
    require: true,
  },
  members: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      index: true,
      require: true,
    },
  ],
  groupAdmin: {
    type: String,
    require: true,
  },
});

export const group_model = mongoose.model<group>("Group", group_schema);
