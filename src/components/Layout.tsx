import { Link } from 'react-router-dom'
import { siteConfig } from '../config/site'
import './Layout.css'

interface LayoutProps {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <h1>{siteConfig.title}</h1>
          </Link>
          <nav className="nav">
            {siteConfig.navigation.map((item) => (
              <Link key={item.path} to={item.path}>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      
      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>
      
      <footer className="footer">
        <div className="container">
          <p>© 2025 {siteConfig.author}. All rights reserved.</p>
          <div className="footer-links">
            <a 
              href={`https://github.com/${siteConfig.github}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a href={`mailto:${siteConfig.email}`}>Email</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout