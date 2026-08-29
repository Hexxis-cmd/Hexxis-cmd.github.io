const routes = ['home', 'projects', 'about']

function renderRoute() {
  const requested = location.hash.replace(/^#\/?/, '').split('/')[0] || 'home'
  const route = routes.includes(requested) ? requested : 'home'

  document.querySelectorAll('[data-page]').forEach((page) => {
    page.hidden = page.dataset.page !== route
  })

  document.querySelectorAll('nav a').forEach((link) => {
    const target = link.hash.replace(/^#\/?/, '').split('/')[0] || 'home'
    if (target === route) link.setAttribute('aria-current', 'page')
    else link.removeAttribute('aria-current')
  })

  window.scrollTo(0, 0)
}

document.querySelector('[data-year]').textContent = new Date().getFullYear()
window.addEventListener('hashchange', renderRoute)
renderRoute()
