import mongoose, { Document, Schema } from 'mongoose';
export enum LeaveType {
  SICK = 'Sick',
  CASUAL = 'Casual',
  PAID = 'Paid',
  UNPAID = 'Unpaid'
}
export enum LeaveStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}
export interface ILeaveRequest extends Document {
  user: mongoose.Types.ObjectId;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: LeaveStatus;
  adminComment?: string;
}
const leaveRequestSchema = new Schema<ILeaveRequest>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    leaveType: {
      type: String,
      enum: Object.values(LeaveType),
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(LeaveStatus),
      default: LeaveStatus.PENDING,
    },
    adminComment: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model<ILeaveRequest>('LeaveRequest', leaveRequestSchema);
