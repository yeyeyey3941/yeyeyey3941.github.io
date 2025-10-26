import { useEffect, useRef } from 'react'
import './MarkdownRenderer.css'

interface MarkdownRendererProps {
  content: string
  className?: string
  inline?: boolean
}

export function MarkdownRenderer({ content, className = '', inline = false }: MarkdownRendererProps) {
  const ref = useRef<HTMLDivElement | HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return
    
    // 간단한 마크다운 렌더링
    let html = content
    
    // 인라인 모드에서는 헤더와 리스트를 일반 텍스트로
    if (inline) {
      // 강조만 처리
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
      // 줄바꿈을 <br>로
      html = html.replace(/\n/g, '<br>')
    } else {
      // 헤더
      html = html.replace(/^#### (.*)$/gm, '<h4>$1</h4>')
      html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>')
      html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>')
      html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>')
      
      // 강조
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      // 링크: [text](url) or <url>
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // 리스트 항목
      html = html.replace(/^\- (.*)$/gm, '<li>$1</li>')
      html = html.replace(/^\+ (.*)$/gm, '<li>$1</li>')
      
      // 줄바꿈을 <br>로
      html = html.replace(/\n/g, '<br>')
      
      // 리스트 래핑
      html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      html = html.replace(/(<\/ul>)\s*(<ul>)/g, '$1')
    }
    
    ref.current.innerHTML = html
  }, [content, inline])

  if (inline) {
    return (
      <span 
        ref={ref as React.RefObject<HTMLSpanElement>} 
        className={`markdown-content markdown-inline ${className}`}
      />
    )
  }

  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>} 
      className={`markdown-content ${className}`}
    />
  )
}

