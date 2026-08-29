import { useEffect, useMemo, useRef, useState } from 'react'
import Ghost from './components/Ghost'
import projects from './data/projects.json'
import './App.css'

const categories = ['All', 'Writing', 'Tools', 'Generators', 'Games', 'Art']

function ProjectCard({ project, onLaunch }) {
  return (
    <article className="project-card">
      <div className="project-image-wrap">
        <img src={project.thumbnail} alt={`${project.title} project artwork`} />
        {project.featured && <span className="featured-badge">Featured build</span>}
      </div>
      <div className="project-card-body">
        <div className="project-title-line">
          <span className="category">{project.category}</span>
          <span className="version">v{project.version}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="project-meta" aria-label="Project tags">
          {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className="card-actions">
          {project.launchFile && <button className="primary-button" type="button" onClick={() => onLaunch(project)}>Launch</button>}
          {project.downloads?.windows && <a className="secondary-button" href={project.downloads.windows} target="_blank" rel="noreferrer">Windows <span aria-hidden="true">↗</span></a>}
          {project.downloads?.android && <a className="secondary-button" href={project.downloads.android} target="_blank" rel="noreferrer">Android <span aria-hidden="true">↗</span></a>}
        </div>
      </div>
    </article>
  )
}

function LaunchModal({ project, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const handleKey = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="launch-modal" role="dialog" aria-modal="true" aria-labelledby="launch-title">
        <header className="modal-header">
          <div>
            <span className="modal-live"><i /> Running locally</span>
            <h2 id="launch-title">{project.title}</h2>
          </div>
          <button className="close-button" ref={closeRef} type="button" onClick={onClose} aria-label={`Close ${project.title}`}>×</button>
        </header>
        <iframe
          src={project.launchFile}
          title={`${project.title} application`}
          sandbox="allow-scripts allow-forms allow-modals allow-downloads allow-same-origin"
        />
      </section>
    </div>
  )
}

function App() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [launchedProject, setLaunchedProject] = useState(null)
  const visibleProjects = useMemo(
    () => activeCategory === 'All' ? projects : projects.filter((project) => project.category === activeCategory),
    [activeCategory],
  )

  return (
    <>
      <main>
        <header className="hero-shell">
          <nav className="topbar" aria-label="Primary navigation">
            <a className="wordmark" href="#top" aria-label="Hexxis Command Center home"><span>H</span> Hexxis-cmd</a>
            <div className="nav-links">
              <a href="#projects">Projects</a>
              <a href="#about">About</a>
              <a href="https://github.com/Hexxis-cmd" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
            </div>
          </nav>

          <div className="hero-grid" id="top">
            <div className="hero-copy">
              <p className="kicker"><span /> Software. Hardware. Strange ideas.</p>
              <h1>Hexxis<br />Command<br />Center</h1>
              <p className="hero-intro">A living index of tools, experiments, games, and whatever I build next.</p>
              <div className="hero-actions">
                <a className="primary-button" href="#projects">Browse projects <span aria-hidden="true">↓</span></a>
                <span className="system-status"><i /> Systems operational</span>
              </div>
            </div>
            <Ghost />
          </div>
          <div className="scroll-cue" aria-hidden="true"><span>Scroll to explore</span><i /></div>
        </header>

        <section className="projects-section" id="projects">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 // Project archive</p>
              <h2>Built, shipped,<br />and still evolving.</h2>
            </div>
            <p className="section-note">Filter the archive or launch a browser-ready project without leaving the command center.</p>
          </div>

          <div className="filter-bar" aria-label="Filter projects by category">
            {categories.map((category) => (
              <button
                className={category === activeCategory ? 'is-active' : ''}
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={category === activeCategory}
              >
                {category}
                {category !== 'All' && <sup>{projects.filter((project) => project.category === category).length}</sup>}
              </button>
            ))}
          </div>

          <div className="project-grid" aria-live="polite">
            {visibleProjects.length > 0
              ? visibleProjects.map((project) => <ProjectCard key={project.id} project={project} onLaunch={setLaunchedProject} />)
              : <div className="empty-state"><span>∅</span><h3>No transmissions yet.</h3><p>The {activeCategory.toLowerCase()} channel is ready for a future project.</p></div>}
          </div>
        </section>

        <section className="about-section" id="about">
          <div>
            <p className="eyebrow">02 // About the operator</p>
            <h2>Building across<br />the whole stack.</h2>
          </div>
          <div className="about-copy">
            <p className="about-lead">I'm Daymien Vanhorn, also known as Hexxis-cmd.</p>
            <p>I'm a software developer, hardware engineer, student, freelancer, and entrepreneur with a habit of getting involved in just about anything technical.</p>
            <p>I work across software, hardware, AI, games, scripts, tools, robotics, computers, vehicles, and whatever else I can get my hands on. I'm usually juggling multiple projects at once—from text adventures and horror games to development tools and full-scale courses.</p>
            <p>I'm always learning, building, experimenting, and occasionally making things far more complicated than they needed to be. I'm straightforward, casual, stubborn when I believe in something, and always interested in solving problems or creating something new.</p>
            <div className="discipline-list" aria-label="Areas of work">
              {['Software', 'Hardware', 'AI', 'Games', 'Robotics', 'Tools'].map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-inner">
          <div><strong>Hexxis Command Center</strong><span>Built by Daymien Vanhorn.</span></div>
          <a href="https://github.com/Hexxis-cmd" target="_blank" rel="noreferrer">github.com/Hexxis-cmd <span aria-hidden="true">↗</span></a>
          <span>© {new Date().getFullYear()} Hexxis</span>
        </div>
      </footer>

      {launchedProject && <LaunchModal project={launchedProject} onClose={() => setLaunchedProject(null)} />}
    </>
  )
}

export default App
