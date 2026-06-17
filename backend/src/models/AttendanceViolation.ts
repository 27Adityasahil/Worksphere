import mongoose, { Document, Schema } from 'mongoose';
export interface IAttendanceViolation extends Document {
  user: mongoose.Types.ObjectId;
  date: Date;
  attemptTime: Date;
  location: {
    lat: number;
    lng: number;
  };
  distanceFromCenter: number; 
}
const attendanceViolationSchema = new Schema<IAttendanceViolation>(
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
    attemptTime: {
      type: Date,
      required: true,
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    distanceFromCenter: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model<IAttendanceViolation>('AttendanceViolation', attendanceViolationSchema);
