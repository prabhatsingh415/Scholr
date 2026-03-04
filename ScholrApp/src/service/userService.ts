import {
  UpdateNameCredentials,
  UpdatePasswordCredentials,
  UpdateProfilePicCredentials,
} from "@/types/form";
import apiClient from "../api/client";

export const fetchUserProfile = async () => {
  const response = await apiClient.get("/users/me");
  return response.data;
};

export const updateName = async (credentials: UpdateNameCredentials) => {
  const response = await apiClient.patch("/users/update-name", credentials);
  return response.data;
};

export const updateProfilePic = async (
  credentials: UpdateProfilePicCredentials
) => {
  const formData = new FormData();
  formData.append("file", {
    uri: credentials.file.uri,
    name: credentials.file.name,
    type: credentials.file.type,
  } as any);

  const response = await apiClient.put("/users/profile-pic", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updatePassword = async (
  credentials: UpdatePasswordCredentials
) => {
  const response = await apiClient.patch("/users/change-password", credentials);
  return response.data;
};
