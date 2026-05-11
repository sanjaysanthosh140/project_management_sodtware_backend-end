import mongoose, { mongo, Mongoose, Schema } from "mongoose";

interface IAttendance {
  userId: mongoose.Types.ObjectId;
  date: Date;
  logs: [{
    firstnoon: {
      timeIn: string | null;
    },
    secondnoon: {
      timeOut: string | null;

    },
  }]
}
const attendanceSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  logs: [
    {
      firstnoon: {
        timeIn: String
      },
      secondnoon: {
        timeOut: String
      },
    }],

});
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });
const AttendanceModel = mongoose.model<IAttendance>(
  "Attendance",
  attendanceSchema,
);
export default AttendanceModel;
