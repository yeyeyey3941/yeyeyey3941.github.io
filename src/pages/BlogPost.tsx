import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { siteConfig } from '../config/site'
import { parseFrontMatter, formatDate } from '../utils/posts'
import './BlogPost.css'
import 'highlight.js/styles/github-dark.css'

interface PostData {
  title: string
  date: string
  categories: string
  content: string
}

function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<PostData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPost() {
      if (!slug) {
        setError('포스트 슬러그가 없습니다.')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`${siteConfig.blog.postsPath}/index.json`)
        if (!response.ok) {
          throw new Error('Failed to fetch posts index')
        }
        
        const postFiles: string[] = await response.json()
        
        const postFile = postFiles.find(filename => 
          filename.includes(slug)
        )
        
        if (!postFile) {
          setError('포스트를 찾을 수 없습니다.')
          return
        }
        
        const contentResponse = await fetch(`${siteConfig.blog.postsPath}/${postFile}`)
        if (!contentResponse.ok) {
          throw new Error('Failed to fetch post content')
        }
        
        const content = await contentResponse.text()
        const { metadata, content: body } = parseFrontMatter(content)
        
        setPost({
          title: metadata.title || slug,
          date: metadata.date || '',
          categories: metadata.categories || '',
          content: body
        })
      } catch (err) {
        console.error('Failed to load post:', err)
        setError('포스트를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }
    
    loadPost()
  }, [slug])

  if (loading) {
    return <div className="blog-post"><p>로딩 중...</p></div>
  }

  if (error || !post) {
    return (
      <div className="blog-post">
        <p>{error || '포스트를 찾을 수 없습니다.'}</p>
        <Link to="/scribble">← 목록으로 돌아가기</Link>
      </div>
    )
  }

  return (
    <div className="blog-post">
      <Link to="/scribble" className="back-link">← 목록으로 돌아가기</Link>
      
      <article>
        <header className="post-header">
          <h1>{post.title}</h1>
          <div className="post-meta">
            <span className="post-date">{formatDate(post.date)}</span>
            {post.categories && (
              <span className="post-category">{post.categories}</span>
            )}
          </div>
        </header>
        
        <div className="post-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  )
}

export default BlogPost