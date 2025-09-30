import { siteConfig, projects, techStack, upcomingProjects } from '../config/site'
import './Projects.css'

function Projects() {
  return (
    <div className="projects">
      <h1>🚀 My Projects</h1>
      <p className="intro">
        제가 진행한 다양한 프로젝트들을 소개합니다. GitHub에서 더 자세한 내용을 확인하실 수 있습니다.
      </p>

      <hr />

      <section className="section">
        <h2>🌟 주요 프로젝트</h2>

        {projects.map((project) => (
          <article key={project.id} className="project-card">
            <h3>{project.id}. {project.title}</h3>
            <ul>
              <li><strong>설명</strong>: {project.description}</li>
              <li><strong>기술 스택</strong>: {project.techStack.join(', ')}</li>
              <li>
                <strong>특징</strong>:
                {project.features.length === 1 ? (
                  ` ${project.features[0]}`
                ) : (
                  <ol>
                    {project.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ol>
                )}
              </li>
              <li>
                <strong>링크</strong>:{' '}
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  GitHub 저장소
                </a>
              </li>
            </ul>
          </article>
        ))}
      </section>

      <hr />

      <section className="section">
        <h2>🔧 기술 스택</h2>
        
        <div className="tech-stack">
          <div>
            <h3>Frontend</h3>
            <ul>
              {techStack.frontend.map((tech, index) => (
                <li key={index}>{tech}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Backend</h3>
            <ul>
              {techStack.backend.map((tech, index) => (
                <li key={index}>{tech}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Tools & Others</h3>
            <ul>
              {techStack.tools.map((tech, index) => (
                <li key={index}>{tech}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <hr />

      <section className="section">
        <h2>💡 프로젝트 추가 예정</h2>
        <p>현재 진행 중이거나 계획 중인 프로젝트들:</p>
        <ol>
          {upcomingProjects.map((project, index) => (
            <li key={index}>
              <strong>{project.title}</strong>: {project.description}
            </li>
          ))}
        </ol>
      </section>

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