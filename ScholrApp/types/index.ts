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

export interface AuthFormProps {
  mode: "login" | "signup";
  onSubmitData: (data: any) => void;
}

export interface UpdateNameFormProps {
  firstName: string | undefined;
  lastName: string | undefined;
  onSubmitData: (data: any) => void;
  onCancel: () => void;
}

export interface UpdateNameCredentials {
  firstName: string | undefined;
  lastName: string | undefined;
}

export interface UpdatePasswordCredentials {
  currentPassword: string | undefined;
  newPassword: string | undefined;
  confirmNewPassword: string | undefined;
}

export interface UpdateProfilePicCredentials {
  file: {
    uri: string;
    name: string;
    type: string;
  };
}

export interface SettingCardProps {
  icon: any;
  title: string;
  children: any;
}

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
}
