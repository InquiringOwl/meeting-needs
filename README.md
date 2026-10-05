# Kinship

Free, open education for meeting our needs, in five tiers: Signals, Roots, Nurture, Resilience and Craft. Each lens is a way of looking at your home and life: what is quietly making you sick, what it costs, and what you can fix yourself.

Plain HTML, CSS and JavaScript. No build step, no server, no accounts.

**Read [FOUNDATION.md](FOUNDATION.md) first.** It holds the ideas every lens is built on: needs are universal and strategies are many, meeting needs is fun and done together, no blame/shame/"should" language, and the same skills apply to people, animals, plants and the house.

## Files
| File | What |
| --- | --- |
| `index.html` | The page shell |
| `style.css` | Look: colour tokens (light only), glass panels, layout |
| `lenses.js` | The lens catalogue (`window.MN_TIERS`): tiers (each with one colour), lenses, status, copy |
| `app.js` | Home, About, lens pages, profile; hash routes `#`, `#about`, `#plans`, `#favorites`, `#profile`, `#lens-<id>[/<sub>]` |
| `FOUNDATION.md` | The principles behind every lens |
| `rel-data.js` | Relationships course data: skill tree, feelings wheel, needs, accusation words, examples |
| `rel.js` | Relationships course: overview, one page per unit (feel, need, request, dialogue) with the vertical skill-tree sidebar, and tools (`#lens-relationships`, `#lens-relationships/<unit>[/<sub-unit>]`). Special-application previews: Neighbors, Cooperatives, Power & peace, Animals (`#lens-relationships/neighbors|coops|power|animals`) |
| `rel.css` | Relationships course styles |
| `water.js` | Water course: six units (Uses, Sources, Storage, Purify, Testing, Costs), one page each, tailored from the profile, with tools (`#lens-water`, `#lens-water/<unit>[/<sub-unit>]`) |
| `water.css` | Water course styles (units in blues, darkest to lightest) |
| `gov.js` | Governance course (tier 5, in progress): who controls California water, where it goes, stairs for change (`#lens-governance`) |
| `gov.css` | Governance course styles |

## Run it locally
Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Put it online (free)
- **GitHub Pages**: make a repo, push these files, then Settings → Pages → Deploy from branch → `main` / root.
- **Netlify Drop**: drag this folder onto https://app.netlify.com/drop.

## Profile data
Saved only in the visitor's browser (`localStorage`, key `meeting-needs.profile.v1`). Nothing is sent anywhere. The profile page has Copy backup / Restore for moving between devices.

Place questions describe the place and how long and how much you can shape it, never who owns it: `home` (kind of place), `stay` (how long you expect to stay), `shape` (how much you can change it; a friend who owns it counts) and `space` (outdoor or growing space, including acreage). The Water section (`#profile/water`) holds `sources` (each source with how much it carries you: Sometimes, Often, Main source; plus “No safe tap water at home”), `filters` you already own, `pipes` (before or after 1986) and `rain`. Courses read these to open the sections that fit and tag them "For you", and link back to the profile (with a hover summary of what's on file) for the rare times something changes. Every section stays available either way. Older profiles are migrated on load: renting/owning in `home` becomes the kind of place, “Land or farm” becomes a house plus acreage, and the old single `water` answer becomes a main source.

## Adding or changing a lens
Edit `lenses.js`. Status is one of `ready`, `building`, `next`, `later`. A lens takes its tier's `color`. A tier with `locked: true` shows its cards on the home page without linking them (Roots, for now).

## Creator opinions
Most copy aims to be plain and checkable. Ashley's own opinions are set apart in pink (the tier 1 and logo color) with `MN.opinion(html, title)`, which renders an "Ashley's take · creator opinion" box (`.opinion` in `style.css`). Keep facts inside an opinion sourced, and keep opinions out of the regular copy. The first one is on the Water overview (water for animal agriculture; deep link `#lens-water/cows`), which links to the Animals page in Emotions & love.

## Language for animals
Animals are someone, not something: they/them when sex is unknown, he/she when known, never "it". Never call animals by meat names ("beef", "pork", "poultry", "seafood") or "livestock". See FOUNDATION.md section 4.

## Logo
A cut-paper chain of three hearts with dotted folds at the joins (the `LOGO` constant in `app.js`; a single paper heart is the favicon in `index.html`).

## Plans
The Plans menu (same on every page) lists Education plan, Improvements & budget, and Garden planner (`#plans/<id>`).

## Course colour themes
Tiers keep their colour at the top level (home page, lens cards, the tier pill). Inside a course, units take the lens's own theme, stepping from darkest (unit 1) to lightest (last unit):

| Lens | Unit theme |
| --- | --- |
| Water | Blues |
| Food | Dark greens |
| Air | Yellows |
| Cleaning | Whites |
| Toxins | Reds |

Laws mentioned in courses are California's; the practices themselves are general.

## Courses inside a lens
A lens can open a course instead of the plain lens page. Its files load only when someone opens that lens (see `LAZY` in `app.js`), so the home page stays light. The app is light-theme only.

To add a course: register `window.MN_LENS_VIEWS[<lens id>] = function (sub, lens) { return { html, title }; }` in a script loaded before `app.js`. `window.MN` gives you `header`, `footer`, `esc` and `toast`. See `rel.js`. Course progress is saved in `localStorage` (`meeting-needs.rel.v3`).
