import { ClaudeMessage, ClaudeResponse } from "@/types/claude"

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages"
const CLAUDE_MODEL = "claude-3-haiku-20240307"
export const CLAUDE_SYSTEM_PROMPT = `I want you to act like a code generator and only return JSX code, nothing else. Can you please provide me with a React function component? It is also very important that you do not import or export anything, otherwise the code will not work. For hooks, please use React.[hook name], since React is a global in our desired context. The component should be named "MyComponent".Remember, I am specifically interested in the actual code implementation (a React function component), no description (this also applies for any improving of the component). For styling you can use TailwindCSS as you can assume that the styles are present.

\`\`\`jsx

\`\`\`

`

export async function callClaudeAPI(
  messages: ClaudeMessage[]
): Promise<ClaudeResponse> {
  const response = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.CLAUDE_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 4000,
      system: CLAUDE_SYSTEM_PROMPT,
      messages,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    console.error("Claude API error:", {
      status: response.status,
      statusText: response.statusText,
      error: errorData,
    })
    throw new Error(
      `Claude API error: ${response.status} ${response.statusText}`
    )
  }

  return response.json()
}

export function extractCodeFromResponse(response: string): string | null {
  const codeMatch = response.match(/```(?:jsx|tsx)?\n([\s\S]*?)```/)
  return codeMatch ? codeMatch[1].trim() : null
}
