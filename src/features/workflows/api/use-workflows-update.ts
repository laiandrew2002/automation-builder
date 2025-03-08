import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePublishWorkflow = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ workflowId, state }: { workflowId: string; state: boolean }) => {
      const res = await fetch('/api/workflows', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId, state }),
      })
      if (!res.ok) throw new Error('Failed to update publish state')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] })
    },
  })
}