# Aero + Physics Playground (your website)

This is a simple static website that shows your problem screenshots as cards.
Only you can add new screenshots (by editing the repository).

## Run locally
Open `index.html` by double-clicking it, or use a simple local server:
- VS Code: install “Live Server” and click “Go Live”
- Or Python:
  - `python -m http.server 8000`
  - open http://localhost:8000

## Add more problems
1) Put the screenshot into `images/`
2) Add a new object in `problems.json`:
- title
- topic
- difficulty
- time
- goal / explanation / why
- tags

## Publish free with GitHub Pages
1) Create a GitHub repo and upload all files
2) Settings → Pages → Deploy from branch → `main` / root
3) Your site URL will appear there
