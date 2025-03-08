import { useQuery } from "@tanstack/react-query"

export const useGoogleListener = (userClerkId: string) => {
  return useQuery({
    queryKey: ['googleListener', { userClerkId }],
    queryFn: async () => {
      const res = await fetch('/api/workflows/google', {
        headers: {
          "clerk-id": userClerkId,
        },
      })
      if (!res.ok) throw new Error('Failed to fetch Google listener')
      return res.json()
    },
    enabled: !!userClerkId,
  })
}