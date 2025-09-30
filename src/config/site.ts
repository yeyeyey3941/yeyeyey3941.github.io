import type { SiteConfig, Project, TechStack, UpcomingProject } from '../types'

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

// 프로젝트 데이터
export const projects: Project[] = [
  {
    id: 1,
    title: "Datepeek : 지역기반 데이트 스팟 공유",
    description: "직접 데이트 코스를 만들고 공유하며, 다른 사람들의 추천 코스를 손쉽게 찾아볼 수 있는 플랫폼 개발 프로젝트",
    techStack: ["Node.js", "Express", "MySQL", "React"],
    features: [
      "passport.js 를 통한 인증 시스템 구현 프로젝트",
      "AWS EC2+ALB 를 활용한 배포 경험(현재는 종료)",
    ],
    github: "https://github.com/yeyeyey3941/Q2_Project_Back",
  },
  {
    id: 2,
    title: "Django-tuto : 모놀리틱 아키텍쳐 구현 경험 프로젝트",
    description: "모놀리틱 아키텍쳐 구현 시스템 및 모니터링 시스템 구축 경험을 위한 프로젝트",
    techStack: ["Python", "Django", "React", "Docker-compose", "Nginx", "ELK", "Prometheus", "Grafana"],
    features: [
      "Docker-compose 를 통해 Django 와 React 를 연동하여 모놀리틱 아키텍쳐 구현 경험 프로젝트",
      "Nginx 를 사용한 리버스 프록시 & static 파일 서빙",
      "ELK+filebeat 와 Django Backend 연동을 통한 로깅 시스템 구축",
      "Prometheus+Grafana 와 Django Backend 연동을 통한 메트릭 수집 및 모니터링 시스템 구축",
    ],
    github: "https://github.com/yeyeyey3941/django-tuto",
  },
]

// 기술 스택
export const techStack: TechStack = {
  frontend: ["React"],
  backend: ["Django", "Django-rest-framework", "FastAPI(in progress)"],
  tools: ["Git & GitHub"],
}

// 진행 예정 프로젝트
export const upcomingProjects: UpcomingProject[] = [
  {
    title: "FastAPI 를 활용한 MSA gateway 구현",
    description: "FastAPI를 gateway 로 사용하여 각 서비스들을 연결하는 Microservice 구축 경험 프로젝트",
  },
]