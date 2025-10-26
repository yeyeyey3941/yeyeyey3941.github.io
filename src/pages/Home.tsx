import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../config/site'
import { parseContentFrontMatter } from '../utils/content'
import { MarkdownRenderer } from '../components/content/MarkdownRenderer'
import './Home.css'

function Home() {
  const [homeContent, setHomeContent] = useState<string>('')
  const [metadata, setMetadata] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function loadHomeContent() {
      try {
        const response = await fetch('/content/home.md')
        const content = await response.text()
        const { metadata: meta, content: body } = parseContentFrontMatter(content)
        setMetadata(meta as Record<string, string>)
        setHomeContent(body)
      } catch (error) {
        console.error('Failed to load home content:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadHomeContent()
  }, [])

  if (loading) {
    return <div className="home"><p>로딩 중...</p></div>
  }

  return (
    <div className="home">
      <section className="hero">
        <h1>{metadata.hero_title || '안녕하세요!'}</h1>
        <p className="intro">
          <strong>개발자 {siteConfig.author}</strong>{metadata.hero_intro?.replace(/^개발자 yeyeyey/, '')}
        </p>
      </section>

      <section className="section">
        <MarkdownRenderer content={homeContent} />
      </section>

      <section className="section">
        <h2>최근 프로젝트</h2>
        <p>
          제가 진행한 다양한 프로젝트들을 <Link to="/projects">Projects</Link> 페이지에서 확인하실 수 있습니다.
        </p>
      </section>

      <section className="section">
        <h2>블로그</h2>
        <p>개발 과정에서 배운 것들과 인사이트를 정리합니다.</p>
        <p>
          <strong>링크</strong>:{' '}
          <Link to="/scribble">{siteConfig.blog.title}</Link>
        </p>
      </section>

      <section className="section">
        <h2>연락하기</h2>
        <ul>
          <li>
            <strong>GitHub</strong>:{' '}
            <a 
              href={`https://github.com/${siteConfig.github}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              @{siteConfig.github}
            </a>
          </li>
          <li>
            <strong>Email</strong>:{' '}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </li>
        </ul>
        <p>궁금한 것이 있으시거나 협업 제안이 있으시면 언제든 연락해 주세요!</p>
      </section>
    </div>
  )
}

export default Home