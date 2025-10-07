import { Navigate, useLocation } from 'react-router-dom'

/**
 * 모든 경로에서 trailing slash를 자동으로 제거하는 컴포넌트
 * 루트 경로(/)는 제외
 * github pages의 서버레벨 처리를 컨트롤 하기는 어려워서 
 */
export function TrailingSlashRedirect({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  // trailing slash가 있고, 루트 경로가 아닌 경우 제거
  if (location.pathname !== '/' && location.pathname.endsWith('/')) {
    const pathWithoutSlash = location.pathname.slice(0, -1)
    return <Navigate to={pathWithoutSlash + location.search + location.hash} replace />
  }

  return <>{children}</>
}

