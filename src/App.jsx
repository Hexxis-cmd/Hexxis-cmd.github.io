import { useEffect, useMemo, useRef, useState } from 'react'
import Ghost from './components/Ghost'
import projects from './data/projects.json'
import { useHolidayTheme } from './hooks/useHolidayTheme'
import { useSoundscape } from './hooks/useSoundscape'
import './App.css'

const categories = ['All', 'Writing', 'Tools', 'Generators', 'Games', 'Art']

const productTemplates = [
  {
    id: 'github-pages-starter',
    title: 'GitHub Pages Starter',
    description: 'A neutral, responsive portfolio starter with setup instructions and automatic GitHub Pages deployment.',
    price: 'Free',
    launchFile: '/templates/github-pages-starter/index.html',
    download: '/downloads/github-pages-starter.zip',
  },
  {
    id: 'business-foundation-template-001',
    title: 'Business Foundation',
    description: 'A self-service WordPress launch kit with starter pages, reusable sections, four visual styles, and practical guides.',
    price: '$80',
    thumbnail: '/thumbnails/business-template-001.png',
    thumbnailAlt: 'Business Foundation website template preview',
    thumbnailPosition: 'left center',
    launchFile: '/templates/business-foundation/index.html',
  },
]

const pricingTiers = [
  {
    id: 'template',
    name: 'Business Foundation Launch Kit',
    price: '$80',
    qualifier: 'one-time',
    art: '/pricing/tarot-template.webp',
    link: 'https://www.patreon.com/Hexxis_CMD/posts/business-website-168038505',
    features: ['Installable WordPress block theme', '5 starter pages + 11 reusable sections', '4 professional style directions', 'Content, image, SEO, launch, and accessibility guides', 'No paid-plugin or page-builder dependency'],
    note: 'A complete self-service foundation for owners comfortable editing and publishing their own WordPress site.',
  },
  {
    id: 'turnkey',
    name: 'Template + Turnkey Setup',
    price: '$580',
    qualifier: 'one-time',
    art: '/pricing/tarot-turnkey.webp',
    link: 'https://www.patreon.com/Hexxis_CMD/posts/business-website-168043113',
    features: ['Everything in Business Foundation Launch Kit', 'Theme installation and launch setup', 'Your supplied logo, colors, copy, and images', 'Up to five standard pages', 'Contact form, mobile QA, and one revision'],
    note: 'Hosting, domain, paid plugins, and copywriting are not included.',
  },
  {
    id: 'custom',
    name: 'Complete Custom Build',
    price: '$1,500+',
    qualifier: 'starting at',
    art: '/pricing/tarot-custom.webp',
    link: 'https://www.patreon.com/Hexxis_CMD/posts/custom-business-168045774',
    features: ['Original design direction', 'Up to five core pages', 'Responsive WordPress build', 'Contact form and basic SEO foundations', 'Deployment and two revision rounds'],
    note: 'Commerce, booking, membership, and other complex integrations are quoted separately.',
  },
]

function useRoute() {
  const readRoute = () => {
    const route = window.location.hash.replace(/^#\/?/, '').split('/')[0]
    return ['projects', 'products', 'about'].includes(route) ? route : 'home'
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
          ? <img src={project.thumbnail} alt={project.thumbnailAlt || `${project.title} project artwork`} style={{ objectPosition: project.thumbnailPosition || 'center', objectFit: project.thumbnailFit || 'cover' }} />
          : <div className="template-preview" aria-hidden="true"><span>&lt;/&gt;</span><strong>YOUR SITE</strong><small>Replace this placeholder</small></div>}
      </div>
      <div className="project-card-body">
        <div className="project-title-line">
          <span className="category">{project.category}</span>
          {project.price && <span className="product-price">{project.price}</span>}
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
          {project.downloads?.portable && <a className="secondary-button" href={project.downloads.portable} target="_blank" rel="noreferrer">Portable ZIP <span aria-hidden="true">↗</span></a>}
          {project.downloads?.linux && <a className="secondary-button" href={project.downloads.linux} target="_blank" rel="noreferrer">Linux AppImage <span aria-hidden="true">↗</span></a>}
          {project.downloads?.web && <a className="secondary-button" href={project.downloads.web} target="_blank" rel="noreferrer">Web HTML <span aria-hidden="true">↗</span></a>}
          {project.downloads?.android && <a className="secondary-button" href={project.downloads.android} target="_blank" rel="noreferrer">Android <span aria-hidden="true">↗</span></a>}
          {project.downloads?.template && <a className="secondary-button" href={project.downloads.template} download>Download template <span aria-hidden="true">↓</span></a>}
          {project.source && <a className="secondary-button" href={project.source} target="_blank" rel="noreferrer">Source <span aria-hidden="true">↗</span></a>}
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
        {link('products', 'Products')}
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

function PricingCard({ tier, onFlip }) {
  const [flipped, setFlipped] = useState(false)

  const toggleCard = () => {
    const next = !flipped
    setFlipped(next)
    onFlip(!next)
  }

  return (
    <article className={`tarot-card${flipped ? ' is-flipped' : ''}`}>
      <button
        className="tarot-card-button"
        type="button"
        onClick={toggleCard}
        aria-pressed={flipped}
        aria-label={flipped ? `Turn ${tier.name} face down` : `Reveal ${tier.name}`}
        data-card-flip
      >
        <span className="tarot-card-inner">
          <span className="tarot-face tarot-back" aria-hidden={flipped}>
            <img src={tier.art} alt="" />
            <span className="tarot-reveal">Tap to reveal</span>
          </span>
          <span className="tarot-face tarot-front" aria-hidden={!flipped}>
            <span className="tarot-front-ornament" aria-hidden="true">✦</span>
            <span className="tarot-tier-name">{tier.name}</span>
            <span className="tarot-price"><small>{tier.qualifier}</small>{tier.price}</span>
            <span className="tarot-divider" aria-hidden="true" />
            <span className="tarot-features">
              {tier.features.map((feature) => <span key={feature}>{feature}</span>)}
            </span>
            <span className="tarot-note">{tier.note}</span>
            <span className="tarot-return">Tap card to turn it back</span>
          </span>
        </span>
      </button>
      <a className="tarot-purchase" href={tier.link} target="_blank" rel="noreferrer" aria-label={`View ${tier.name} on Patreon`} aria-hidden={!flipped} tabIndex={flipped ? 0 : -1}>
        <img src="/branding/patreon-symbol.png" alt="" aria-hidden="true" />
        View on Patreon <span aria-hidden="true">↗</span>
      </a>
    </article>
  )
}

function TemplateProductCard({ product, onPreview }) {
  return (
    <article className="template-product-card">
      <div className="template-product-image">
        {product.thumbnail
          ? <img src={product.thumbnail} alt={product.thumbnailAlt} style={{ objectPosition: product.thumbnailPosition || 'center' }} />
          : <div className="template-preview" aria-hidden="true"><span>&lt;/&gt;</span><strong>YOUR SITE</strong><small>Replace this placeholder</small></div>}
        <span className="template-product-price">{product.price}</span>
      </div>
      <div className="template-product-body">
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <div className="card-actions">
          <button className="primary-button" type="button" onClick={() => onPreview(product)}>Preview</button>
          {product.download && <a className="secondary-button" href={product.download} download>Download template <span aria-hidden="true">↓</span></a>}
        </div>
      </div>
    </article>
  )
}

function ProductsPage({ onCardFlip, onPreview }) {
  return (
    <section className="products-section page-view">
      <div className="products-heading">
        <p className="eyebrow">Website Services</p>
        <h1>Choose your build.</h1>
        <p>Three clear ways to begin. Turn over a card to compare exactly what is included.</p>
      </div>
      <div className="pricing-grid">
        {pricingTiers.map((tier) => <PricingCard key={tier.id} tier={tier} onFlip={onCardFlip} />)}
      </div>
      <p className="pricing-footnote">
        All prices are one-time project prices in USD. Final custom-build scope is confirmed before work begins.<br />
        <a href="mailto:hexxis.cmd@proton.me?subject=Website%20service%20question">Questions before purchasing? Email hexxis.cmd@proton.me</a>
      </p>
      <div className="template-products-heading">
        <p className="eyebrow">Templates</p>
        <h2>Preview the available templates.</h2>
      </div>
      <div className="template-products-grid">
        {productTemplates.map((product) => <TemplateProductCard key={product.id} product={product} onPreview={onPreview} />)}
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
      <a className="skip-link" href="#main-content" onClick={(event) => {
        event.preventDefault()
        document.getElementById('main-content')?.focus()
      }}>Skip to main content</a>
      <main>
        <Navigation route={route} soundEnabled={sound.enabled} onSoundToggle={sound.toggle} />
        <div id="main-content" key={route} tabIndex="-1">
          {route === 'home' && <HomePage />}
          {route === 'projects' && <ProjectsPage activeCategory={activeCategory} setActiveCategory={setActiveCategory} onLaunch={setLaunchedProject} />}
          {route === 'products' && <ProductsPage onCardFlip={sound.flipCard} onPreview={setLaunchedProject} />}
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
