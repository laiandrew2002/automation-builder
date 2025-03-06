import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUserUploadProfileImage = (userClerkId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (image: string) => {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "clerk-id": userClerkId || "",
        },
        body: JSON.stringify({ action: "uploadProfileImage", image }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload profile image");
      }
      return response.json();
    },
    onSuccess: () => {
      // toast.success("Transaction created");
      queryClient.invalidateQueries({ queryKey: ["user", { userClerkId }] });
    },
    onError: () => {
      console.error("Error updating database:");
      // toast.error("Failed to create transaction");
    },
  });

  return mutation;
};