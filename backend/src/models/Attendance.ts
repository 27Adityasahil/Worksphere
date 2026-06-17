import mongoose, { Document, Schema } from 'mongoose';
export interface IAttendance extends Document {
  user: mongoose.Types.ObjectId;
  date: Date;
  clockIn: {
    time: Date;
    location: {
      lat: number;
      lng: number;
    };
  };
  clockOut?: {
    time: Date;
    location: {
      lat: number;
      lng: number;
    };
  };
  status: 'Present' | 'Late' | 'Half-day' | 'Absent';
}
const attendanceSchema = new Schema<IAttendance>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    clockIn: {
      time: { type: Date, required: true },
      location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    clockOut: {
      time: { type: Date },
      location: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    status: {
      type: String,
      enum: ['Present', 'Late', 'Half-day', 'Absent'],
      default: 'Present',
    },
  },
  {
    timestamps: true,
  }
);
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });
export default mongoose.model<IAttendance>('Attendance', attendanceSchema);
