export function extractCodeFromResponse(response: string): string | null {
  const codeMatch = response.match(/```(?:jsx|tsx)?\n([\s\S]*?)```/)
  return codeMatch ? codeMatch[1].trim() : null
}
