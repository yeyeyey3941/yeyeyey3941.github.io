import { copyFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ROOT_404 = join(__dirname, '../404.html')
const DIST_404 = join(__dirname, '../dist/404.html')

try {
  if (existsSync(ROOT_404)) {
    copyFileSync(ROOT_404, DIST_404)
    console.log('✅ Copied 404.html to dist')
  } else {
    console.warn('⚠️  404.html not found in root directory')
  }
} catch (error) {
  console.error('❌ Error copying 404.html:', error)
  process.exit(1)
}

