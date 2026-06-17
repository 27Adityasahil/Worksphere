import mongoose, { Document, Schema } from 'mongoose';
export interface IPayroll extends Document {
  user: mongoose.Types.ObjectId;
  month: number; 
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'Pending' | 'Paid';
}
const payrollSchema = new Schema<IPayroll>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    basicSalary: {
      type: Number,
      required: true,
    },
    allowances: {
      type: Number,
      default: 0,
    },
    deductions: {
      type: Number,
      default: 0,
    },
    netSalary: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);
payrollSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });
export default mongoose.model<IPayroll>('Payroll', payrollSchema);
