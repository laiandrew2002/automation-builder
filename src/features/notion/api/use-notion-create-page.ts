import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateNotionPage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { databaseId: string; accessToken: string; content: string }) => {
      const res = await fetch('/api/notion/page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create Notion page')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notionDatabase'] }) // Refresh database pages
    },
  })
}