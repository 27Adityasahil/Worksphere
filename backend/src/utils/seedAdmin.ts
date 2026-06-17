import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User, { UserRole } from '../models/User';
import EmployeeProfile from '../models/EmployeeProfile';
dotenv.config();
const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to MongoDB...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@worksphere.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword123';
    const adminExists = await User.findOne({ email: adminEmail });
    if (adminExists) {
      console.log('Admin user already exists!');
      process.exit(0);
    }
    const adminUser = await User.create({
      email: adminEmail,
      password: adminPassword,
      role: UserRole.ADMIN,
      isFirstLogin: false, 
      isActive: true,
    });
    const adminProfile = await EmployeeProfile.create({
      user: adminUser._id,
      employeeId: 'ADM-0001',
      firstName: 'System',
      lastName: 'Administrator',
      department: 'Management',
      designation: 'Super Admin',
      joiningDate: new Date(),
      contactNumber: '1234567890',
    });
    adminUser.employeeProfile = adminProfile._id as any;
    await adminUser.save();
    console.log('Admin user successfully seeded!');
    console.log('---------------------------------');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('---------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};
seedAdmin();
