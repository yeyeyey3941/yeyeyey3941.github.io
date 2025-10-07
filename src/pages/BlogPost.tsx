import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import mermaid from 'mermaid'
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

// Mermaid 컴포넌트
function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && chart) {
      // 기존 내용 제거
      ref.current.innerHTML = ''
      
      // Mermaid 초기화 및 렌더링
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'inherit'
      })
      
      mermaid.render(`mermaid-${Date.now()}`, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg
        }
      }).catch((error) => {
        console.error('Mermaid rendering error:', error)
        if (ref.current) {
          ref.current.innerHTML = `<p>다이어그램을 렌더링할 수 없습니다: ${error.message}</p>`
        }
      })
    }
  }, [chart])

  return <div ref={ref} className="mermaid-diagram" />
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
            {/* Categories split by comma with span for each category */}
            {post.categories && (
              <span className="list-categories">{post.categories.split(',').map(category => category.trim()).map(category => <span className="post-category" key={category}>{category}</span>)}</span>
            )}
          </div>
        </header>
        
        <div className="post-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              code({ className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '')
                const language = match ? match[1] : ''
                const inline = props.inline
                
                if (language === 'mermaid' && !inline) {
                  return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />
                }
                
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  )
}

export default BlogPost