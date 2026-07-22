# Flowstate Labs — Landing Page

Static site for Flowstate Labs: calm, considered software that makes everyday life easier.

## Structure

- `index.html` — landing page
- `styles.css` — design system
- `script.js` — theme toggle, particle field, reveals
- `assets/` — logo, favicon, and brand icons
- `privacy-policy/` — general privacy policy for all apps (`/privacy-policy`)
- `terms-of-service/` — terms of service (`/terms-of-service`)

## App-specific privacy

Product-specific policies (when needed) live at `/<app-name>/privacy/index.html`
and supplement the general policy at `/privacy-policy`.

## Running locally

```bash
python3 -m http.server 5173
```

Then visit http://localhost:5173, http://localhost:5173/privacy-policy, and http://localhost:5173/terms-of-service.
