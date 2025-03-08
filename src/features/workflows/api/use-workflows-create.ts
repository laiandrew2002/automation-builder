import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateWorkflow = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ clerkId, name, description }: { clerkId: string; name: string; description: string }) => {
      const res = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerkId, name, description }),
      })
      if (!res.ok) throw new Error('Failed to create workflow')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] }) // Refetch workflows
    },
  })
}