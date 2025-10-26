import './TagList.css'

interface TagListProps {
  tags: string[]
  className?: string
  inline?: boolean
}

export function TagList({ tags, className = '', inline = false }: TagListProps) {
  if (tags.length === 0) return null
  
  // inline 모드: 쉼표로 구분
  if (inline) {
    return (
      <span className={`tag-list-inline ${className}`}>
        {tags.join(', ')}
      </span>
    )
  }
  
  // 기본 모드: 태그별로 표시
  return (
    <div className={`tag-list ${className}`}>
      {tags.map((tag, index) => (
        <span key={index} className="tag">
          {tag}
        </span>
      ))}
    </div>
  )
}

