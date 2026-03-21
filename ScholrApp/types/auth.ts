export interface AuthDetails {
  access_token: string;
  refresh_token: string;
}

export interface AuthCredentials {
  collegeId: string;
  password: string;
  fcmId?: string | null;
  deviceId?: string | null;
}

export interface AuthVerfication {
  collegeId: string;
  otp: string;
  fcmId?: string | null;
  deviceId?: string | null;
}
