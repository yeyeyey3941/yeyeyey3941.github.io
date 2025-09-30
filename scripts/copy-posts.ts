import { copyFileSync, mkdirSync, readdirSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SCRIBBLE_POSTS_DIR = join(__dirname, '../../scribble/_posts')
const PUBLIC_POSTS_DIR = join(__dirname, '../public/posts')

try {
  // public/posts 디렉토리 생성
  if (!existsSync(PUBLIC_POSTS_DIR)) {
    mkdirSync(PUBLIC_POSTS_DIR, { recursive: true })
  }

  // scribble/_posts의 모든 마크다운 파일 가져오기
  const postFiles = readdirSync(SCRIBBLE_POSTS_DIR).filter(
    (file): file is string => file.endsWith('.md') || file.endsWith('.markdown')
  )

  console.log(`📝 Found ${postFiles.length} posts in scribble/_posts`)

  // 각 파일을 public/posts로 복사
  postFiles.forEach(file => {
    const sourcePath = join(SCRIBBLE_POSTS_DIR, file)
    const destPath = join(PUBLIC_POSTS_DIR, file)
    copyFileSync(sourcePath, destPath)
    console.log(`   ✓ Copied: ${file}`)
  })

  // index.json 파일 생성 (포스트 목록)
  const indexPath = join(PUBLIC_POSTS_DIR, 'index.json')
  writeFileSync(indexPath, JSON.stringify(postFiles, null, 2))
  console.log(`   ✓ Created: index.json`)

  console.log(`\n✅ Successfully copied ${postFiles.length} posts!`)
} catch (error) {
  console.error('❌ Error copying posts:', error)
  process.exit(1)
}