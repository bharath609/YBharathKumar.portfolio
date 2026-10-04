# Y Bharath Kumar — Portfolio

React + Vite single-page portfolio, deployed to GitHub Pages at **https://bharath609.github.io**

## Edit the content
Everything (projects, internships, skills, certificates, links) lives in the first block of `src/main.jsx`.
Colours are the CSS variables at the top of `src/styles.css` (`--ac` and `--rgb` are the accent).
Your photo is `public/assets/bharath.webp`.

## Run locally
    npm install
    npm run dev        # http://localhost:5173
    npm run build      # production build into dist/

## Publish (one time)
1. On GitHub create a **public** repository named exactly `bharath609.github.io` (no README, no .gitignore).
2. In this folder run:

       git init
       git add .
       git commit -m "Portfolio"
       git branch -M main
       git remote add origin https://github.com/bharath609/bharath609.github.io.git
       git push -u origin main

3. Repository -> Settings -> Pages -> Build and deployment -> Source: **GitHub Actions**.
4. Open the **Actions** tab. When "Deploy portfolio to GitHub Pages" shows a green tick, the site is live.

## Update later
Edit, then `git add . && git commit -m "Update" && git push`. The site redeploys by itself.

## Resume
- The Resume buttons open `public/resume.pdf` (served at `/resume.pdf`).
- To update it: replace `public/resume.pdf`, and replace `src/assets/resume-preview.webp` with a fresh picture of page 1 (the preview card in the Resume section).
- Note: the PDF is public once the site is live, so it shows everything printed on it, including the phone number.
