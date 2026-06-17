import mongoose, { Document, Schema } from 'mongoose';
export interface IEmployeeProfile extends Document {
  user: mongoose.Types.ObjectId;
  employeeId: string;
  firstName: string;
  lastName: string;
  department: string;
  designation: string;
  joiningDate: Date;
  contactNumber: string;
  address?: string;
  profilePictureUrl?: string;
}
const employeeProfileSchema = new Schema<IEmployeeProfile>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  joiningDate: {
    type: Date,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  profilePictureUrl: {
    type: String,
  }
}, {
  timestamps: true
});
const EmployeeProfile = mongoose.model<IEmployeeProfile>('EmployeeProfile', employeeProfileSchema);
export default EmployeeProfile;
