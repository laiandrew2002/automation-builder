import { useQuery } from "@tanstack/react-query";

export const useGetUser = (userClerkId: string) => {
  const query = useQuery({
    queryKey: ["user", { userClerkId }],
    queryFn: async () => {
      const response = await fetch(`/api/user`, {
        headers: {
          "clerk-id": userClerkId,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch user");
      }
      return response.json();
    },
    enabled: !!userClerkId,
  });

  return query;
};