export interface ClaudeMessage {
  role: "user" | "assistant"
  content: string
}

export interface ClaudeResponse {
  content: Array<{
    text: string
  }>
}
