import type { ContentMetadata } from '../../types'
import { TagList } from './TagList'
import { MarkdownRenderer } from './MarkdownRenderer'
import './ContentCard.css'

interface ContentCardProps {
  metadata: ContentMetadata
  content?: string
  renderFields?: string[]
}

export function ContentCard({ metadata }: ContentCardProps) {
  // 제목 추출
  const title = typeof metadata.title === 'string' ? metadata.title : ''
  const id = typeof metadata.id === 'number' ? metadata.id : null
  
  // 목록 아이템들
  const listItems: JSX.Element[] = []
  
  // 설명
  if (metadata.description) {
    listItems.push(
      <li key="description">
        <strong>설명</strong>: {metadata.description}
      </li>
    )
  }
  
  // 기술 스택
  if (Array.isArray(metadata.tags) && metadata.tags.length > 0) {
    listItems.push(
      <li key="tags">
        <strong>기술 스택</strong>: <TagList tags={metadata.tags} inline />
      </li>
    )
  }
  
  // 동적 섹션 렌더링 (sections 객체)
  if (metadata.sections && typeof metadata.sections === 'object') {
    Object.entries(metadata.sections).forEach(([key, section]) => {
      if (section && typeof section === 'object' && 'title' in section && 'content' in section) {
        listItems.push(
          <li key={key}>
            <strong>{section.title}</strong>:
            <MarkdownRenderer content={section.content} />
          </li>
        )
      }
    })
  }
  
  // GitHub 링크
  if (typeof metadata.github === 'string') {
    listItems.push(
      <li key="github">
        <strong>링크</strong>:{' '}
        <a href={metadata.github} target="_blank" rel="noopener noreferrer">
          GitHub 저장소
        </a>
      </li>
    )
  }
  
  return (
    <article className="project-card">
      <h3>{id !== null ? `${id}. ` : ''}{title}</h3>
      <ul>
        {listItems}
      </ul>
    </article>
  )
}

