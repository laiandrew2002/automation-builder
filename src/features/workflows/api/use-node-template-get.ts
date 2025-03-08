import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateWorkflow = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description: string }) => {
      const res = await fetch('/api/workflows/node-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      })
      if (!res.ok) throw new Error('Failed to create workflow')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] }) // Refetch workflows
    },
  })
}