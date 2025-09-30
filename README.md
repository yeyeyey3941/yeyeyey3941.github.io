# yeyeyey's Github Blog

React + Vite로 만든 개인 블로그입니다.

## 🚀 특징

- **React + Vite**: 빠른 개발 환경과 빌드
- **마크다운 블로그**: scribble 레포지토리의 포스트를 자동으로 연동
- **GitHub Pages**: 자동 배포
- **반응형 디자인**: 모바일과 데스크톱 모두 지원

## 📁 프로젝트 구조

```
yeyeyey3941.github.io/
├── src/
│   ├── components/      # 레이아웃 컴포넌트
│   ├── pages/          # 페이지 컴포넌트 (Home, Projects, Blog, BlogPost)
│   ├── utils/          # 유틸리티 함수 (마크다운 파싱 등)
│   ├── config/         # 설정 파일 (site.ts - 중앙화된 데이터)
│   ├── App.tsx         # 메인 앱 (라우팅)
│   └── main.tsx        # 엔트리 포인트
├── scripts/
│   ├── copy-posts.ts   # 로컬 개발용 포스트 복사
│   └── copy-posts-ci.ts # CI용 포스트 복사
├── public/
│   └── posts/          # 빌드 시 scribble/_posts에서 복사됨
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions 배포 설정
└── ANSWERS.md          # 질문 답변 정리
```

## 🛠️ 설치 및 실행

### 1. Node.js 설치

Node.js 20 이상이 필요합니다.

```bash
# Ubuntu/WSL
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 로컬에서 개발 서버 실행

```bash
npm run dev
```

개발 서버가 `http://localhost:5173`에서 실행됩니다.

### 4. 빌드

```bash
npm run build:local
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

## 📝 블로그 포스트 작성

블로그 포스트는 `../scribble/_posts/` 폴더에 작성합니다.

### 파일명 형식

```
YYYY-MM-DD-제목.md
```

예: `2025-06-19-study.md`

### 파일 구조

```markdown
---
layout: post
title: "포스트 제목"
date: 2025-06-19 20:00:00 +0900
categories: python
---

# 제목

본문 내용...
```

## 🔄 자동 배포

### GitHub Pages 설정

1. 레포지토리 Settings > Pages
2. Source: "GitHub Actions" 선택
3. 완료!

### 배포 트리거

다음 경우에 자동으로 배포됩니다:

- `main` 브랜치에 push할 때
- scribble 레포지토리가 업데이트될 때 (repository_dispatch 이벤트)
- 수동으로 Actions 탭에서 실행할 때

### scribble 레포지토리에서 자동 배포 트리거 설정

scribble 레포지토리에 다음 워크플로우를 추가하세요:

```yaml
# .github/workflows/trigger-blog-deploy.yml
name: Trigger Blog Deploy

on:
  push:
    branches:
      - main

jobs:
  trigger:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger blog repository dispatch
        uses: peter-evans/repository-dispatch@v2
        with:
          token: ${{ secrets.BLOG_TRIGGER_TOKEN }}
          repository: yeyeyey3941/yeyeyey3941.github.io
          event-type: scribble-updated
```

Personal Access Token (classic) 생성:
1. GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Generate new token
3. `repo` 권한 선택
4. scribble 레포지토리 Settings > Secrets > Actions에 `BLOG_TRIGGER_TOKEN`으로 추가

## 🎨 커스터마이징

### 사이트 정보 수정

`src/config/site.ts`에서 모든 정보를 중앙 관리합니다:

```typescript
export const siteConfig = {
  title: "yeyeyey's Github Blog",
  author: "yeyeyey",
  email: "cjttkfkd3941@gmail.com",
  github: "yeyeyey3941",
  // ... 나머지 설정
}
```

### 프로젝트 추가

`src/config/site.ts`의 `projects` 배열에 추가:

```typescript
export const projects = [
  {
    id: 3,
    title: "새 프로젝트",
    description: "프로젝트 설명",
    techStack: ["React", "Node.js"],
    features: ["특징 1", "특징 2"],
    github: "https://github.com/username/repo",
  },
]
```

### 색상 변경

`src/index.css`의 CSS 변수를 수정:

```css
:root {
  --primary-color: #2563eb;
  --text-color: #1f2937;
  /* ... */
}
```

### 페이지 추가

1. `src/pages/`에 새 컴포넌트 생성
2. `src/App.tsx`에 라우트 추가
3. `src/config/site.ts`의 `navigation`에 메뉴 추가

## 📦 기술 스택

- **React 18**: UI 라이브러리
- **TypeScript**: 타입 안정성
- **Vite**: 빌드 도구
- **React Router**: 라우팅
- **React Markdown**: 마크다운 렌더링
- **GitHub Actions**: CI/CD

## 📄 라이선스

MIT License

## 📧 연락처

- **GitHub**: [@yeyeyey3941](https://github.com/yeyeyey3941)
- **Email**: cjttkfkd3941@gmail.com
