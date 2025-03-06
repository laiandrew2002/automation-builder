import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useConnectNotion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      access_token: string
      workspace_id: string
      workspace_icon: string
      workspace_name: string
      database_id: string
      id: string
    }) => {
      const res = await fetch('/api/notion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to connect Notion')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notionConnection'] }) // Refresh data
    },
  })
}