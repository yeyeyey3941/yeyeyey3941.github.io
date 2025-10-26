// 사이트 설정 타입
export interface SiteConfig {
  title: string
  author: string
  email: string
  github: string
  description: string
  navigation: NavigationItem[]
  blog: BlogConfig
}

export interface NavigationItem {
  name: string
  path: string
}

export interface BlogConfig {
  title: string
  description: string
  postsPath: string
}

// 블로그 포스트 타입
export interface PostMetadata {
  title?: string
  date?: string
  categories?: string
  layout?: string
  [key: string]: string | undefined
}

export interface Post {
  slug: string
  title: string
  date: string
  categories: string
  filename: string
}

export interface ParsedPost {
  metadata: PostMetadata
  content: string
}

// 프로젝트 섹션 타입
export interface ProjectSection {
  title: string
  content: string  // 마크다운 형식
}

// 범용 콘텐츠 타입 (동적 필드 지원)
export interface ContentMetadata {
  id?: number
  title?: string
  description?: string
  github?: string
  tags?: string[]
  status?: string
  order?: number
  
  // 동적 섹션
  sections?: Record<string, ProjectSection>
  
  // 기타 동적 필드
  [key: string]: any
}

export interface ContentItem {
  slug: string
  metadata: ContentMetadata
  content: string
  filename?: string
}
