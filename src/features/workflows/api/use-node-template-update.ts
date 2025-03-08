import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUpdateNodeTemplate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      content,
      type,
      workflowId,
      channels,
      accessToken,
      notionDbId,
    }: {
      content: string
      type: string
      workflowId: string
      channels?: { value: string }[]
      accessToken?: string
      notionDbId?: string
    }) => {
      const res = await fetch('/api/workflows/node-template', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, type, workflowId, channels, accessToken, notionDbId }),
      })
      if (!res.ok) throw new Error('Failed to update node template')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] })
    },
  })
}