import type { ContentItem, ContentMetadata } from '../types'

/**
 * YAML frontmatter 파싱
 */
function parseYAMLValue(value: string): any {
  const trimmed = value.trim()
  
  // 배열: ["item1", "item2"] or [item1, item2] or - item1\n  - item2
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const items = trimmed.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''))
    return items
  }
  
  // YAML 리스트 형식: - item1\n  - item2
  if (trimmed.includes('\n  -')) {
    return trimmed.split('\n  -').map(s => s.trim().replace(/^["']|["']$/g, ''))
  }
  
  // 숫자
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    const num = parseFloat(trimmed)
    return isNaN(num) ? trimmed : num
  }
  
  // 불린
  if (trimmed === 'true' || trimmed === 'false') {
    return trimmed === 'true'
  }
  
  // 문자열 (따옴표 제거)
  return trimmed.replace(/^["']|["']$/g, '')
}

/**
 * 중첩 YAML 파싱 (1~2단계 중첩 지원)
 */
function parseSimpleYAML(yaml: string): Record<string, any> {
  const result: Record<string, any> = {}
  const lines = yaml.split('\n')
  let i = 0
  
  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()
    
    // 빈 줄이나 주석은 건너뛰기
    if (!trimmed || trimmed.startsWith('#')) {
      i++
      continue
    }
    
    // 들여쓰기 레벨 계산
    const indent = line.length - line.trimStart().length
    
    // 최상위 키 (들여쓰기 0)
    if (indent === 0 && line.includes(':')) {
      const colonIndex = line.indexOf(':')
      const key = line.substring(0, colonIndex).trim()
      const value = line.substring(colonIndex + 1).trim()
      
      // 값이 있으면 단순 값
      if (value && value !== '|') {
        result[key] = parseYAMLValue(value)
        i++
      }
      // 멀티라인 문자열 (|)
      else if (value === '|') {
        const contentLines: string[] = []
        i++
        
        // 다음 들여쓰기된 줄들 수집
        while (i < lines.length) {
          const nextLine = lines[i]
          const nextIndent = nextLine.length - nextLine.trimStart().length
          
          if (nextIndent > 0 || !nextLine.trim()) {
            contentLines.push(nextLine.substring(2)) // 2칸 들여쓰기 제거
            i++
          } else {
            break
          }
        }
        
        result[key] = contentLines.join('\n').trim()
      }
      // 중첩 객체
      else {
        const nestedObj: Record<string, any> = {}
        i++
        
        // 2단계 들여쓰기 (2칸)
        while (i < lines.length) {
          const nestedLine = lines[i]
          const nestedIndent = nestedLine.length - nestedLine.trimStart().length
          
          // 같은 레벨 또는 상위 레벨이면 종료
          if (nestedIndent === 0 && nestedLine.trim()) {
            break
          }
          
          // 2단계 키
          if (nestedIndent === 2 && nestedLine.includes(':')) {
            const nestedColonIndex = nestedLine.indexOf(':')
            const nestedKey = nestedLine.substring(0, nestedColonIndex).trim()
            const nestedValue = nestedLine.substring(nestedColonIndex + 1).trim()
            
            // 중첩 객체 (sections.features)
            if (!nestedValue) {
              const innerObj: Record<string, any> = {}
              i++
              
              // 3단계 들여쓰기 (4칸)
              while (i < lines.length) {
                const innerLine = lines[i]
                const innerIndent = innerLine.length - innerLine.trimStart().length
                
                if (innerIndent < 4 && innerLine.trim()) {
                  break
                }
                
                if (innerIndent === 4 && innerLine.includes(':')) {
                  const innerColonIndex = innerLine.indexOf(':')
                  const innerKey = innerLine.substring(0, innerColonIndex).trim()
                  const innerValue = innerLine.substring(innerColonIndex + 1).trim()
                  
                  // 멀티라인
                  if (innerValue === '|') {
                    const innerContentLines: string[] = []
                    i++
                    
                    while (i < lines.length) {
                      const contentLine = lines[i]
                      const contentIndent = contentLine.length - contentLine.trimStart().length
                      
                      if (contentIndent > 4 || !contentLine.trim()) {
                        innerContentLines.push(contentLine.substring(6)) // 6칸 들여쓰기 제거
                        i++
                      } else {
                        break
                      }
                    }
                    
                    innerObj[innerKey] = innerContentLines.join('\n').trim()
                  } else {
                    innerObj[innerKey] = parseYAMLValue(innerValue)
                    i++
                  }
                } else {
                  i++
                }
              }
              
              nestedObj[nestedKey] = innerObj
            } else {
              nestedObj[nestedKey] = parseYAMLValue(nestedValue)
              i++
            }
          } else {
            i++
          }
        }
        
        result[key] = nestedObj
      }
    } else {
      i++
    }
  }
  
  return result
}

/**
 * Frontmatter를 파싱하되 ContentMetadata 타입으로 반환
 */
export function parseContentFrontMatter(content: string): { metadata: ContentMetadata; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    return { metadata: {}, content }
  }
  
  const [, frontmatter, body] = match
  const metadata = parseSimpleYAML(frontmatter)
  
  return { metadata, content: body.trim() }
}

/**
 * 디렉토리의 모든 콘텐츠 파일 로드 (.yml, .yaml, .md, .markdown)
 */
export async function loadContent(directory: string): Promise<ContentItem[]> {
  try {
    const indexResponse = await fetch(`${directory}/index.json`)
    if (!indexResponse.ok) {
      throw new Error(`Failed to fetch ${directory}/index.json`)
    }
    
    const files: string[] = await indexResponse.json()
    
    const contentItems = await Promise.all(
      files.map(async (filename): Promise<ContentItem> => {
        const contentResponse = await fetch(`${directory}/${filename}`)
        const content = await contentResponse.text()
        
        // slug 생성: 파일명에서 확장자 제거
        const slug = filename.replace(/\.(yml|yaml|md|markdown)$/, '')
        
        let metadata: ContentMetadata
        let body = ''
        
        // 파일 확장자에 따라 파싱 방식 결정
        if (filename.endsWith('.yml') || filename.endsWith('.yaml')) {
          // 순수 YAML 파일
          metadata = parseSimpleYAML(content)
          // YAML 파일은 모든 콘텐츠가 metadata에 포함됨
          body = ''
        } else {
          // 기존 마크다운 frontmatter 방식
          const parsed = parseContentFrontMatter(content)
          metadata = parsed.metadata
          body = parsed.content
        }
        
        return {
          slug,
          metadata,
          content: body,
          filename
        }
      })
    )
    
    return contentItems
  } catch (error) {
    console.error(`Failed to load content from ${directory}:`, error)
    return []
  }
}

/**
 * ContentItem 배열에서 특정 필드의 모든 값 수집 (예: tags, categories)
 */
export function extractFieldValues(items: ContentItem[], fieldName: string): string[] {
  const values = new Set<string>()
  
  items.forEach(item => {
    const fieldValue = item.metadata[fieldName]
    if (Array.isArray(fieldValue)) {
      fieldValue.forEach(v => values.add(v))
    } else if (typeof fieldValue === 'string') {
      values.add(fieldValue)
    }
  })
  
  return Array.from(values).sort()
}

/**
 * 메타데이터의 특정 필드 값을 가져오는 헬퍼
 */
export function getMetadataValue(metadata: ContentMetadata, key: string): string | undefined {
  const value = metadata[key]
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'number') return value.toString()
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  return undefined
}

/**
 * 메타데이터의 배열 필드 값을 가져오는 헬퍼
 */
export function getMetadataArray(metadata: ContentMetadata, key: string): string[] {
  const value = metadata[key]
  if (Array.isArray(value)) return value as string[]
  if (typeof value === 'string') return [value]
  return []
}

