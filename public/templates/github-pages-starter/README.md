# GitHub Pages Starter

A dependency-free portfolio template for GitHub Pages. It contains no personal information, branding, images, analytics, external fonts, or third-party scripts.

## Replace the placeholders

Open `index.html` and replace every value inside square brackets:

- `[SITE NAME]` — your website or project name.
- `[YOUR MAIN HEADLINE]` — the first message visitors should see.
- `[ONE OR TWO SENTENCES...]` — a short description of your work.
- `[YOUR WORK]` — a heading for your projects.
- `[PROJECT NAME]`, `[PROJECT URL]`, and the project descriptions — repeat or remove project cards as needed.
- `[YOUR NAME OR ORGANIZATION]` — your public name, studio, or organization.
- Biography placeholders — only include information you want published.
- `[YOUR GITHUB OR CONTACT URL]` — a public contact page or profile.
- The description in the `<meta name="description">` tag.

Search the entire folder for `[` to find any placeholder you missed.

## Change the design

Edit `styles.css`. The starter intentionally uses white, gray, and black with no gradients, logos, or image assets. Change the variables and rules only after replacing the content.

## Preview locally

Open `index.html` in a browser. No install or build command is required.

## Publish with GitHub Pages

1. Create a new GitHub repository.
2. Copy the contents of this folder into the repository root.
3. Commit and push to the `main` branch.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, select **GitHub Actions**.
6. The included `.github/workflows/deploy.yml` publishes the site automatically after every push to `main`.

If your default branch has a different name, change `main` in the workflow file.

## Files

- `index.html` — all page content and placeholders.
- `styles.css` — responsive white theme.
- `app.js` — small hash-based page router and current year.
- `.github/workflows/deploy.yml` — automatic GitHub Pages deployment.
- `.nojekyll` — prevents Jekyll processing.
