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
