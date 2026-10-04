# Meeting Needs

Lenses for a healthier home. Each lens is a way of looking at your home and life: what is quietly making you sick, what it costs, and what you can fix yourself.

Plain HTML, CSS and JavaScript. No build step, no server, no accounts.

**Read [FOUNDATION.md](FOUNDATION.md) first.** It holds the ideas every lens is built on: needs are universal and strategies are many, meeting needs is fun and done together, no blame/shame/"should" language, and the same skills apply to people, animals, plants and the house.

## Files
| File | What |
| --- | --- |
| `index.html` | The page shell |
| `style.css` | Look: colour tokens (light + dark), glass panels, layout |
| `lenses.js` | The lens catalogue (`window.MN_TIERS`): tiers, lenses, status, copy |
| `app.js` | Home, lens pages, profile; hash routes `#`, `#profile`, `#lens-<id>[/<sub>]` |
| `FOUNDATION.md` | The principles behind every lens |
| `rel-data.js` | Relationships course data: skill tree, feelings wheel, needs, accusation words, examples |
| `rel.js` | Relationships course: overview, one page per unit (feel, need, request, dialogue) with the vertical skill-tree sidebar, and tools (`#lens-relationships`, `#lens-relationships/<unit>[/<sub-unit>]`) |
| `rel.css` | Relationships course styles |

## Run it locally
Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Put it online (free)
- **GitHub Pages**: make a repo, push these files, then Settings → Pages → Deploy from branch → `main` / root.
- **Netlify Drop**: drag this folder onto https://app.netlify.com/drop.

## Profile data
Saved only in the visitor's browser (`localStorage`, key `meeting-needs.profile.v1`). Nothing is sent anywhere. The profile page has Copy backup / Restore for moving between devices.

## Adding or changing a lens
Edit `lenses.js`. Status is one of `demo`, `building`, `next`, `later`.

## Courses inside a lens
A lens can open a course instead of the plain lens page. Its files load only when someone opens that lens (see `LAZY` in `app.js`), so the home page stays light. The app is light-theme only.

To add a course: register `window.MN_LENS_VIEWS[<lens id>] = function (sub, lens) { return { html, title }; }` in a script loaded before `app.js`. `window.MN` gives you `header`, `footer`, `esc` and `toast`. See `rel.js`. Course progress is saved in `localStorage` (`meeting-needs.rel.v3`).
