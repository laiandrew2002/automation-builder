import { useMutation } from "@tanstack/react-query";

export const usePostToDiscordWebhook = () => {
  return useMutation({
    mutationFn: async ({ content, url }: { content: string; url: string }) => {
      const res = await fetch('/api/discord/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, url }),
      })
      if (!res.ok) throw new Error('Failed to post to webhook')
      return res.json()
    },
  })
}