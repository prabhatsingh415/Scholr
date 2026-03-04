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
