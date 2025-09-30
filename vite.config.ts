import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// base: '/' → yeyeyey3941.github.io (루트 도메인일 때)
// base: '/repo/' → yeyeyey3941.github.io/repo (서브경로일 때)
export default defineConfig({
  plugins: [react()],
  base: '/', // GitHub Pages 루트 도메인이므로 '/'가 정답
  build: {
    outDir: 'dist',
  },
})