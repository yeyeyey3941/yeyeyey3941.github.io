import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import { TrailingSlashRedirect } from './utils/routes'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'

function App() {
  return (
    <TrailingSlashRedirect>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/scribble" element={<Blog />} />
          <Route path="/scribble/:slug" element={<BlogPost />} />
        </Routes>
      </Layout>
    </TrailingSlashRedirect>
  )
}

export default App