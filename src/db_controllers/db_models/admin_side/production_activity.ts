import mongoose from "mongoose";
import { Schema } from "mongoose";

interface production_activity {
  department: string;
  timestamp: string;
  date: string;
  client: string;
  category: string;
  floorName: string;
  fromTime: string;
  toTime: string;
  timeIn: string;
  timeOut: string;
  advance: string;
  finalAmount: string;
  additionalRequirements: string;
  allocatedBy: string;
  head_id: string;
}

const production_activity_modle = new Schema<production_activity>({
  department: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  client: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  floorName: {
    type: String,
    required: false,
  },
  fromTime: {
    type: String,
    require: true,
  },
  toTime: {
    type: String,
    required: true,
  },
  timeIn: {
    type: String,
    required: false,
  },
  timeOut: {
    type: String,
    required: false,
  },
  advance: {
    type: String,
    required: false,
  },
  finalAmount: {
    type: String,
    required: false,
  },
  additionalRequirements: {
    type: String,
    required: false,
  },
  allocatedBy: {
    type: String,
    required: true,
  },
  head_id: {
    type: String,
    required: false,
  },
});

const production_team_model = mongoose.model<production_activity>(
  "production_activity",
  production_activity_modle,
);

export default production_team_model;
