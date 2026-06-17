import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
export enum UserRole {
  ADMIN = 'Admin',
  EMPLOYEE = 'Employee',
  MANAGER = 'Manager'
}
export interface IUser extends Document {
  email: string;
  password?: string;
  role: UserRole;
  isFirstLogin: boolean;
  isActive: boolean;
  employeeProfile?: mongoose.Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    select: false,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.EMPLOYEE,
  },
  isFirstLogin: {
    type: Boolean,
    default: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  employeeProfile: {
    type: Schema.Types.ObjectId,
    ref: 'EmployeeProfile'
  }
}, {
  timestamps: true
});
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.model<IUser>('User', userSchema);
export default User;
