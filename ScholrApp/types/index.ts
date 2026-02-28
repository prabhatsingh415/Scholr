export enum Role {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  ADMIN = "ADMIN",
}

export interface UserDetails {
  collegeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo?: string;
  profilePicURL?: string;
  deptId?: string;
  role: Role;
  isVerified?: boolean;
  // Student Specific
  rollNo?: string;
  courseName?: string;
  batchId?: string;
  cgpa?: number;
  activeBacklogs?: number;
  // Teacher Specific
  isHod?: boolean;
  isClassTeacher?: boolean;
}

export interface AuthDetails {
  access_token: string;
  refresh_token: string;
}

export interface AuthCredentials {
  collegeId: string;
  password: string;
}

export interface AuthVerfication {
  collegeId: string;
  otp: string;
}
