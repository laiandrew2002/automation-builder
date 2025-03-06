import { useQuery } from "@tanstack/react-query";

export const useConnectNotion= (userId: string) => {
  return useQuery({
    queryKey: ['notionConnection', userId],
    queryFn: async () => {
      const res = await fetch('/api/notion', {
        headers: { userId },
      })
      if (!res.ok) throw new Error('Failed to fetch Notion connection')
      return res.json()
    },
    enabled: !!userId, // Only fetch if userId exists
  })
}