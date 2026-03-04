import { updateName } from "@/src/service/userService";
import { useMutation } from "@tanstack/react-query";

export const useUpdateName = () => {
  return useMutation({
    mutationFn: updateName,
  });
};
