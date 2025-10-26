import type { SiteConfig } from '../types'

// 사이트 전역 설정
export const siteConfig: SiteConfig = {
  title: "yeyeyey's Github Blog",
  author: "yeyeyey",
  email: "cjttkfkd3941@gmail.com",
  github: "yeyeyey3941",
  description: "이곳에서 제가 진행한 프로젝트들과 개발 경험, 그리고 기술적 인사이트를 정리합니다.",
  
  // 메뉴
  navigation: [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Blog", path: "/scribble" },
  ],
  
  // 블로그 설정
  blog: {
    title: "끄적끄적 생각정리",
    description: "개인적으로 공부하면서 드는 생각을 찾아보고 정리하는 공간",
    postsPath: "/posts",
  },
}