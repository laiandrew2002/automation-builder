import { useQuery } from "@tanstack/react-query"

export const useNotionDatabase = (databaseId: string, accessToken: string) => {
  return useQuery({
    queryKey: ['notionDatabase', databaseId],
    queryFn: async () => {
      const res = await fetch(`/api/notion/database?databaseId=${databaseId}&accessToken=${accessToken}`)
      if (!res.ok) throw new Error('Failed to fetch Notion database')
      return res.json()
    },
    enabled: !!databaseId && !!accessToken, // Only fetch if both exist
  })
}