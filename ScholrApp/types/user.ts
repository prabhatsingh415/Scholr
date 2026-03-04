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
