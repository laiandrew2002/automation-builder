import { useQuery } from "@tanstack/react-query"

export const useWorkflows = (userClerkId: string) => {
  return useQuery({
    queryKey: ['workflows', { userClerkId }],
    queryFn: async () => {
      const res = await fetch('/api/workflows', {
        headers: {
          "clerk-id": userClerkId,
        },
      })
      if (!res.ok) throw new Error('Failed to fetch workflows')
      return res.json()
    },
    enabled: !!userClerkId,
  })
}