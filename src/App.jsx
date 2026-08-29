import { useEffect, useMemo, useRef, useState } from 'react'
import Ghost from './components/Ghost'
import projects from './data/projects.json'
import { useHolidayTheme } from './hooks/useHolidayTheme'
import { useSoundscape } from './hooks/useSoundscape'
import './App.css'

const categories = ['All', 'Writing', 'Tools', 'Generators', 'Games', 'Art', 'Website Templates', 'GitHub Page Templates']

function useRoute() {
  const readRoute = () => {
    const route = window.location.hash.replace(/^#\/?/, '').split('/')[0]
    return ['projects', 'about'].includes(route) ? route : 'home'
  }
  const [route, setRoute] = useState(readRoute)

  useEffect(() => {
    const update = () => {
      setRoute(readRoute())
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])

  return route
}

function ProjectCard({ project, onLaunch }) {
  return (
    <article className="project-card">
      <div className="project-image-wrap">
        {project.thumbnail
          ? <img src={project.thumbnail} alt={`${project.title} project artwork`} style={{ objectPosition: project.thumbnailPosition || 'center' }} />
          : <div className="template-preview" aria-hidden="true"><span>&lt;/&gt;</span><strong>YOUR SITE</strong><small>Replace this placeholder</small></div>}
        {project.featured && <span className="featured-badge">Featured</span>}
      </div>
      <div className="project-card-body">
        <div className="project-title-line">
          <span className="category">{project.category}</span>
          <span className={project.price ? 'product-price' : 'version'}>{project.price || `v${project.version}`}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="project-meta" aria-label="Project tags">
          {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className="card-actions">
          {project.launchFile && <button className={project.purchaseLink ? 'secondary-button' : 'primary-button'} type="button" onClick={() => onLaunch(project)}>{project.purchaseLink ? 'Preview' : 'Launch'}</button>}
          {project.purchaseLink && <a className="primary-button product-link" href={project.purchaseLink} target="_blank" rel="noreferrer" aria-label={`Buy ${project.title} for ${project.price} on Patreon`}><img className="patreon-mark" src="/branding/patreon-symbol.png" alt="" aria-hidden="true" /><span>{project.price}</span><span aria-hidden="true">·</span>{project.productCode} <span aria-hidden="true">↗</span></a>}
          {project.downloads?.windows && <a className="secondary-button" href={project.downloads.windows} target="_blank" rel="noreferrer">Windows <span aria-hidden="true">↗</span></a>}
          {project.downloads?.android && <a className="secondary-button" href={project.downloads.android} target="_blank" rel="noreferrer">Android <span aria-hidden="true">↗</span></a>}
          {project.downloads?.template && <a className="secondary-button" href={project.downloads.template} download>Download template <span aria-hidden="true">↓</span></a>}
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
            <span className="modal-label">Browser preview</span>
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

function Navigation({ route, soundEnabled, onSoundToggle }) {
  const link = (target, label) => (
    <a href={target === 'home' ? '#/' : `#/${target}`} aria-current={route === target ? 'page' : undefined}>
      <span className="sr-only">{label}</span>
      <img className="nav-art" src={`/branding/labels/${target}.png`} alt="" aria-hidden="true" />
    </a>
  )

  return (
    <nav className="topbar" aria-label="Primary navigation">
      <a className="wordmark" href="#/" aria-label="Hexxis Command Center home">
        <span className="github-mark" aria-hidden="true">
          <img src="/branding/github-demonic-rpg.png" alt="" />
        </span>
        <span className="sr-only">Hexxis-cmd</span>
        <img className="wordmark-art" src="/branding/labels/hexxis-cmd.png" alt="" aria-hidden="true" />
      </a>
      <div className="nav-links">
        {link('home', 'Home')}
        {link('projects', 'Projects')}
        {link('about', 'About')}
        <button
          className={`sound-toggle${soundEnabled ? ' is-enabled' : ''}`}
          type="button"
          onClick={onSoundToggle}
          aria-pressed={soundEnabled}
          aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
          title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
        >
          <span className="speaker-pixel" aria-hidden="true"><i /><b /></span>
        </button>
      </div>
    </nav>
  )
}

function HomePage() {
  return (
    <header className="hero-shell page-view">
      <div className="archive-scene is-settled" aria-hidden="true">
        <img className="archive-video" src="/video/archive-idle-v3.png" alt="" />
        <div className="archive-ambience"><i /><i /><i /><i /><i /></div>
      </div>
      <div className="hero-grid">
        <div className="hero-copy">
          <h1 className="brand-title">
            <img src="/branding/hexxis-command-center-rpg.png" alt="Hexxis Command Center" />
          </h1>
          <div className="hero-actions">
            <a className="primary-button" href="#/projects">
              <span className="sr-only">Browse projects</span>
              <img className="button-art" src="/branding/labels/browse-projects.png" alt="" aria-hidden="true" />
              <img className="keyhole-art" src="/branding/keyhole-rpg.png" alt="" aria-hidden="true" />
            </a>
          </div>
        </div>
        <Ghost />
      </div>
    </header>
  )
}

function ProjectsPage({ activeCategory, setActiveCategory, onLaunch }) {
  const visibleProjects = useMemo(
    () => activeCategory === 'All' ? projects : projects.filter((project) => project.category === activeCategory),
    [activeCategory],
  )

  return (
    <section className="projects-section page-view">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Projects</p>
        </div>
        <p>Filter the collection or launch a browser-ready project without leaving the site.</p>
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
          ? visibleProjects.map((project) => <ProjectCard key={project.id} project={project} onLaunch={onLaunch} />)
          : <div className="empty-state"><span>∅</span><h3>Nothing here yet.</h3><p>Future {activeCategory.toLowerCase()} projects will appear here.</p></div>}
      </div>
    </section>
  )
}

function AboutPage() {
  return (
    <section className="about-section page-view">
      <div>
        <p className="eyebrow">About me</p>
        <figure className="about-portrait">
          <img src="/about/daymien-vanhorn.png" alt="Daymien Vanhorn in a black suit" />
        </figure>
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
  )
}

function App() {
  const route = useRoute()
  const theme = useHolidayTheme()
  const sound = useSoundscape(theme.id)
  const [activeCategory, setActiveCategory] = useState('All')
  const [launchedProject, setLaunchedProject] = useState(null)

  return (
    <>
      <main>
        <Navigation route={route} soundEnabled={sound.enabled} onSoundToggle={sound.toggle} />
        <div key={route}>
          {route === 'home' && <HomePage />}
          {route === 'projects' && <ProjectsPage activeCategory={activeCategory} setActiveCategory={setActiveCategory} onLaunch={setLaunchedProject} />}
          {route === 'about' && <AboutPage />}
        </div>
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
