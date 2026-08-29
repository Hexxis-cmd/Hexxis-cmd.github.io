# Hexxis Command Center

The project archive and portfolio for [Hexxis-cmd](https://github.com/Hexxis-cmd), built with React and Vite and deployed through GitHub Pages.

## Local development

```bash
pnpm install
pnpm dev
```

Projects are managed in `src/data/projects.json`. Browser-ready single-file apps belong in `public/apps`, with project artwork in `public/thumbnails`.

## Deployment

Every push to `main` builds and deploys the site through `.github/workflows/deploy.yml`.
