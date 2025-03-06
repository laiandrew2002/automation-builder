import { useMutation } from "@tanstack/react-query";

export const usePostSlackMessages = () => {
  return useMutation({
    mutationFn: async (data: { slackAccessToken: string; selectedSlackChannels: { value: string }[]; content: string }) => {
      const res = await fetch('/api/slack/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to post message to Slack')
      return res.json();
    },
  })
}