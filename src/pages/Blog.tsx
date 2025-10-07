import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { siteConfig } from '../config/site'
import { parseFrontMatter, getSlugFromFilename, formatDate } from '../utils/posts'
import type { Post } from '../types'
import './Blog.css'

function Blog() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchParams, setSearchParams] = useSearchParams()

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

  // URL에서 카테고리 필터 가져오기
  const selectedCategory = searchParams.get('category') || ''

  // 모든 카테고리 목록 추출
  const allCategories = Array.from(
    new Set(
      posts.flatMap(post => 
        post.categories ? post.categories.split(',').map(c => c.trim()) : []
      )
    )
  ).sort()

  // 검색 및 카테고리 필터링
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === '' || 
      (post.categories && post.categories.split(',').map(c => c.trim()).includes(selectedCategory))
    
    return matchesSearch && matchesCategory
  })

  const handleCategoryClick = (category: string) => {
    if (category === selectedCategory) {
      setSearchParams({}) // 같은 카테고리 클릭 시 필터 해제
    } else {
      setSearchParams({ category })
    }
  }

  if (loading) {
    return <div className="blog"><p>로딩 중...</p></div>
  }

  return (
    <div className="blog">
      <header className="blog-header">
        <h1>{siteConfig.blog.title}</h1>
        <p>{siteConfig.blog.description}</p>
      </header>

      {/* 검색 및 필터 영역 */}
      <div className="blog-filters">
        <input
          type="text"
          placeholder="🔍 포스트 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <div className="category-filters">
          <button 
            className={`category-filter-btn ${selectedCategory === '' ? 'active' : ''}`}
            onClick={() => setSearchParams({})}
          >
            전체 ({posts.length})
          </button>
          {allCategories.map(category => {
            const count = posts.filter(p => 
              p.categories && p.categories.split(',').map(c => c.trim()).includes(category)
            ).length
            return (
              <button
                key={category}
                className={`category-filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                {category} ({count})
              </button>
            )
          })}
        </div>
      </div>

      <div className="posts-list">
        {filteredPosts.length === 0 ? (
          <p>
            {searchQuery || selectedCategory 
              ? '검색 결과가 없습니다.' 
              : '아직 작성된 포스트가 없습니다.'}
          </p>
        ) : (
          filteredPosts.map((post) => (
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