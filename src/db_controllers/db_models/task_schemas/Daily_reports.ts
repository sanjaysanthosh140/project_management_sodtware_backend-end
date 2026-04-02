import mongoose, { Schema } from "mongoose";

interface IDailyReports {
  userID: string;
  username: string;
  date: string;
  desc: string;
  deptId: string;
}

const daily_reports_schema = new Schema({
  userID: {
    require: true,
    type: String,
  },
  username: {
    require: true,
    type: String,
  },
  date: {
    require: true,
    type: String,
  },
  desc: {
    require: true,
    type: String,
  },
  deptId: {
    require: true,
    type: String,
  },
});

const DailyReportsModel = mongoose.model<IDailyReports>(
  "DailyReports",
  daily_reports_schema,
);

export default DailyReportsModel;
