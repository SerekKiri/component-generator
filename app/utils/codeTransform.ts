import { transform } from "@babel/standalone"

export const transformCode = (code: string | undefined): string | null => {
  if (!code) return null

  try {
    const transformed = transform(code, { presets: ["react"] }).code
    return transformed
  } catch (err) {
    return `Error: ${err}`
  }
}
