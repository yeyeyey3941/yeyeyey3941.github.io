// 프로젝트 타입
export interface Project {
  id: number
  title: string
  description: string
  techStack: string[]
  features: string[]
  github: string
}

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

// 기술 스택 타입
export interface TechStack {
  frontend: string[]
  backend: string[]
  tools: string[]
}

// 예정 프로젝트 타입
export interface UpcomingProject {
  title: string
  description: string
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
