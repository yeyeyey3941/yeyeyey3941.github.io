import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../config/site'
import { parseFrontMatter, getSlugFromFilename, formatDate } from '../utils/posts'
import type { Post } from '../types'
import './Blog.css'

function Blog() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch(`${siteConfig.blog.postsPath}/index.json`)
        if (!response.ok) {
          throw new Error('Failed to fetch posts index')
        }
        
        const postFiles: string[] = await response.json()
        
        const postsData = await Promise.all(
          postFiles.map(async (filename): Promise<Post> => {
            const contentResponse = await fetch(`${siteConfig.blog.postsPath}/${filename}`)
            const content = await contentResponse.text()
            const { metadata } = parseFrontMatter(content)
            const slug = getSlugFromFilename(filename)
            
            return {
              slug,
              title: metadata.title || slug,
              date: metadata.date || '',
              categories: metadata.categories || '',
              filename
            }
          })
        )
        
        // 날짜순으로 정렬 (최신순)
        postsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setPosts(postsData)
      } catch (error) {
        console.error('Failed to load posts:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadPosts()
  }, [])

  if (loading) {
    return <div className="blog"><p>로딩 중...</p></div>
  }

  return (
    <div className="blog">
      <header className="blog-header">
        <h1>{siteConfig.blog.title}</h1>
        <p>{siteConfig.blog.description}</p>
      </header>

      <div className="posts-list">
        {posts.length === 0 ? (
          <p>아직 작성된 포스트가 없습니다.</p>
        ) : (
          posts.map((post) => (
            <article key={post.slug} className="post-card">
              <Link to={`/scribble/${post.slug}`}>
                <h2>{post.title}</h2>
                <div className="post-meta">
                  <span className="post-date">{formatDate(post.date)}</span>
                  {post.categories && (
                    <span className="list-categories">{post.categories.split(',').map(category => category.trim()).map(category => <span className="post-category" key={category}>{category}</span>)}</span>
                  )}
                </div>
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  )
}

export default Blog