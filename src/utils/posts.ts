import type { PostMetadata, ParsedPost } from '../types'

export function parseFrontMatter(content: string): ParsedPost {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    return { metadata: {}, content }
  }
  
  const [, frontmatter, body] = match
  const metadata: PostMetadata = {}
  
  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) return
    
    const key = line.substring(0, colonIndex).trim()
    const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '')
    
    if (key) {
      metadata[key] = value
    }
  })
  
  return { metadata, content: body.trim() }
}

export function getSlugFromFilename(filename: string): string {
  // 2025-06-19-study.markdown -> study
  const match = filename.match(/\d{4}-\d{2}-\d{2}-(.+)\.(md|markdown)/)
  return match ? match[1] : filename
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}