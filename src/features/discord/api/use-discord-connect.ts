import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useConnectDiscordWebhook = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      channel_id: string
      webhook_id: string
      webhook_name: string
      webhook_url: string
      id: string
      guild_name: string
      guild_id: string
    }) => {
      const res = await fetch('/api/discord', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to connect webhook')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discordWebhook'] }) // Refresh data
    },
  })
}