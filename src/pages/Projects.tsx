import { useState, useEffect } from 'react'
import { siteConfig } from '../config/site'
import { loadContent } from '../utils/content'
import { ContentCard } from '../components/content/ContentCard'
import type { ContentItem } from '../types'
import './Projects.css'

function Projects() {
  const [projects, setProjects] = useState<ContentItem[]>([])
  const [upcomingProjects, setUpcomingProjects] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function loadProjects() {
      try {
        // 프로젝트 로드
        const projectsData = await loadContent('/projects')
        
        // order 필드가 있으면 정렬
        const sortedProjects = projectsData.sort((a, b) => {
          const orderA = typeof a.metadata.order === 'number' ? a.metadata.order : 999
          const orderB = typeof b.metadata.order === 'number' ? b.metadata.order : 999
          return orderA - orderB
        })
        
        // status 필드로 분류
        const completed = sortedProjects.filter(p => 
          p.metadata.status !== 'upcoming'
        )
        const upcoming = sortedProjects.filter(p => 
          p.metadata.status === 'upcoming'
        )
        
        setProjects(completed)
        setUpcomingProjects(upcoming)
      } catch (error) {
        console.error('Failed to load projects:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadProjects()
  }, [])

  if (loading) {
    return <div className="projects"><p>로딩 중...</p></div>
  }

  return (
    <div className="projects">
      <h1>My Projects</h1>
      <p className="intro">
        제가 진행한 다양한 프로젝트들을 소개합니다. GitHub에서 더 자세한 내용을 확인하실 수 있습니다.
      </p>

      <hr />

      <section className="section">
        <h2>주요 프로젝트</h2>

        {projects.map((project) => (
          <ContentCard 
            key={project.slug}
            metadata={project.metadata}
            content={project.content}
          />
        ))}
      </section>

      {upcomingProjects.length > 0 && (
        <>
          <hr />

          <section className="section">
            <h2>프로젝트 추가 예정</h2>
            <p>현재 진행 중이거나 계획 중인 프로젝트들:</p>
            
            {upcomingProjects.map((project) => (
              <ContentCard 
                key={project.slug}
                metadata={project.metadata}
                content={project.content}
                renderFields={['title']}
              />
            ))}
          </section>
        </>
      )}

      <hr />

      <div className="contact">
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
      </div>
    </div>
  )
}

export default Projects