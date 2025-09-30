import { Link } from 'react-router-dom'
import { siteConfig } from '../config/site'
import './Home.css'

interface Interest {
  title: string
  description: string
}

const interests: Interest[] = [
  { title: "웹 개발", description: "Frontend & Backend 개발" },
  { title: "오픈소스", description: "GitHub를 통한 프로젝트 공유 및 협업" },
  { title: "새로운 기술", description: "최신 기술 트렌드 학습 및 적용" },
]

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>안녕하세요!</h1>
        <p className="intro">
          <strong>개발자 {siteConfig.author}</strong>입니다. 새로운 기술을 배우고 실험하며, 의미있는 프로젝트를 만들어가는 것을 좋아합니다.
        </p>
      </section>

      <section className="section">
        <h2>🚀 주요 관심 분야</h2>
        <ul>
          {interests.map((interest, index) => (
            <li key={index}>
              <strong>{interest.title}</strong>: {interest.description}
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2>💼 최근 프로젝트</h2>
        <p>
          제가 진행한 다양한 프로젝트들을 <Link to="/projects">Projects</Link> 페이지에서 확인하실 수 있습니다.
        </p>
      </section>

      <section className="section">
        <h2>📝 블로그</h2>
        <p>개발 과정에서 배운 것들과 인사이트를 정리합니다.</p>
        <p>
          <strong>링크</strong>: <Link to="/scribble">{siteConfig.blog.title}</Link>
        </p>
      </section>

      <section className="section">
        <h2>🤝 연락하기</h2>
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