# WorkSphere — Enterprise Human Resource Management System

WorkSphere is a full-stack Human Resource Management System designed to simplify and automate modern workforce operations. It provides organizations with a centralized platform to manage employees, attendance, payroll, leaves, documents, and internal HR workflows with secure role-based access.

The platform includes dedicated portals for administrators and employees with automated onboarding, secure authentication, real-time updates, and data-driven analytics.



---
<img width="1521" height="775" alt="image" src="https://github.com/user-attachments/assets/be2a9a70-340a-4568-972a-eb7e0875de1b" />

---
<img width="1521" height="776" alt="image" src="https://github.com/user-attachments/assets/b4198892-9a4a-4266-b1c6-08a7eead26c1" />

---


## Overview

Traditional HR processes involve manual employee tracking, attendance management, salary calculations, leave approvals, and document handling.

WorkSphere solves these challenges by providing a complete digital HR ecosystem where organizations can automate employee lifecycle management, improve operational efficiency, and maintain accurate workforce records.

The system follows a scalable MERN architecture with secure authentication, structured database design, and production-ready workflows.

---

# Features


# Authentication & Authorization

- Secure JWT based authentication
- Role Based Access Control (RBAC)
- Separate Admin and Employee portals
- Protected routes
- Password encryption using hashing
- Automatic session handling
- First login password reset flow


---

# Employee Onboarding System

Admins can:

- Create employee accounts
- Generate unique employee IDs
- Generate temporary passwords
- Send login credentials automatically through email
- Assign departments and roles
- Manage employee status


Employee workflow:

Employee Added  
↓  
Credentials Sent Through Email  
↓  
First Login  
↓  
Mandatory Password Reset  
↓  
Dashboard Access


---

# Admin Dashboard

Admin gets a complete overview of:

- Total employees
- Active employees
- Attendance statistics
- Leave requests
- Payroll information
- Department analytics
- Recent activities


---

# Employee Management

Admin can:

- Add new employees
- Update employee information
- Manage departments
- Manage designations
- Activate/Deactivate employees
- Reset employee passwords
- View employee records


Employee profile contains:

- Personal details
- Contact information
- Job information
- Department
- Salary details
- Joining date
- Documents


---

# GPS Based Attendance Management

Employees can:

- Check in
- Check out
- Track daily attendance
- View attendance history


System automatically manages:

- Employee location verification
- Working hour calculation
- Late arrival detection
- Attendance status
- Monthly attendance reports


Admin can:

- Monitor attendance
- Filter employee records
- Analyze attendance trends


---

# Leave Management System

Employee features:

- Apply for leave
- Select leave category
- Add reason
- Track application status
- View leave history


Admin features:

- View leave requests
- Approve or reject applications
- Add review comments
- Track leave records


Leave Status:

Pending  
Approved  
Rejected


---

# Payroll Management

Payroll module handles:

- Employee salary structure
- Monthly salary generation
- Attendance based calculation
- Allowances
- Deductions
- Tax calculations
- Salary history


Features:

- Generate payslips
- Download PDF salary slips
- Maintain payroll records


---

# Notice Management

Admin can:

- Create announcements
- Publish company notices
- Set priority levels
- Send updates to employees


Employees can:

- View notices
- Receive updates


---

# Document Management

Employees can upload:

- Resume
- ID documents
- Certificates
- Company documents


Admin can:

- View documents
- Verify submissions
- Manage employee records


---

# Performance Management

Managers/Admin can:

- Review employees
- Add ratings
- Track performance history
- Maintain feedback records


Employees can:

- View reviews
- Track progress


---

# HR Helpdesk

Employees can:

- Create support tickets
- Raise HR issues
- Track ticket status


Admin can:

- Reply to tickets
- Update status
- Resolve issues


---

# Notifications System

Supports notifications for:

- New announcements
- Leave updates
- Payroll generation
- Account updates
- HR responses


---

# Security Features

- Password hashing
- JWT token authentication
- Protected API endpoints
- Role based permissions
- Secure environment variables
- Request validation


---

# Tech Stack


## Frontend

- React.js
- TypeScript
- Tailwind CSS
- Material UI
- Redux Toolkit
- React Router


---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose


---

## Additional Tools

- Nodemailer
- Cloudinary
- JWT
- bcrypt
- Multer
- Recharts


---

# Project Architecture


Frontend (React)

        ↓

REST API

        ↓

Express Server

        ↓

MongoDB Database


---

# Database Collections

- Users
- Employees
- Attendance
- Leaves
- Payroll
- Notices
- Documents
- Tickets
- Departments
- Audit Logs


---

# Installation


Clone the repository
