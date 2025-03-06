import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useConnectSlack = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      app_id: string,
      authed_user_id: string,
      authed_user_token: string,
      slack_access_token: string,
      bot_user_id: string,
      team_id: string,
      team_name: string,
      user_id: string,
    }) => {
      const res = await fetch('/api/slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to connect Slack')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slackConnection'] }) // Refresh data
    },
  })
}