# Meeting Needs

Lenses for a healthier home. Each lens is a way of looking at your home and life: what is quietly making you sick, what it costs, and what you can fix yourself.

Plain HTML, CSS and JavaScript. No build step, no server, no accounts.

## Files
| File | What |
| --- | --- |
| `index.html` | The page shell |
| `style.css` | Look: colour tokens (light + dark), glass panels, layout |
| `lenses.js` | The lens catalogue (`window.MN_TIERS`): tiers, lenses, status, copy |
| `app.js` | Home, lens pages, profile; hash routes `#`, `#profile`, `#lens-<id>` |

## Run it locally
Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Put it online (free)
- **GitHub Pages**: make a repo, push these files, then Settings → Pages → Deploy from branch → `main` / root.
- **Netlify Drop**: drag this folder onto https://app.netlify.com/drop.

## Profile data
Saved only in the visitor's browser (`localStorage`, key `meeting-needs.profile.v1`). Nothing is sent anywhere. The profile page has Copy backup / Restore for moving between devices.

## Adding or changing a lens
Edit `lenses.js`. Status is one of `demo`, `building`, `next`, `later`.
