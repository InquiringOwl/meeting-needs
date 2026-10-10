# Kinship

Free, open education for meeting our needs, in six tiers: Signals, Roots, Protect, Nurture, Resilience and Craft. Tier 1, Signals, starts inside (Emotions) and then connects outward (Relationships). Each lens is a way of looking at your home and life: what is quietly making you sick, what it costs, and what you can fix yourself.

Plain HTML, CSS and JavaScript. No build step, no server, no accounts.

**Read [FOUNDATION.md](FOUNDATION.md) first.** It holds the ideas every lens is built on: needs are universal and strategies are many, meeting needs is fun and done together, no blame/shame/"should" language, the same skills apply to people, animals, plants and the house, and every page works for disabled people and phone-only visitors from the start (section 7).

## Files
| File | What |
| --- | --- |
| `index.html` | The page shell |
| `style.css` | Look: colour tokens (light only), glass panels, layout. On phones (≤720px) each tier's cards scroll sideways one at a time inside the tier panel, with dots below (`tierDots` in `app.js`) |
| `lenses.js` | The lens catalogue (`window.MN_TIERS`): tiers (each with one colour), lenses, status, copy. Tier 1 is Emotions, Relationships, Identification |
| `app.js` | Home, About (linked beside the Kinship logo in the header), lens pages, My tools (in the Plans menu), profile, the `PERSONALIZE` switch and the shared Go deeper block (`MN.deeper`); hash routes `#`, `#about`, `#plans`, `#favorites`, `#tools`, `#profile`, `#lens-<id>[/<sub>]` |
| `FOUNDATION.md` | The principles behind every lens |
| `rel-data.js` | Emotions and Relationships data: units (each with its `course`; `planned` units and sub-units show dashed with a short description), feelings wheel, needs, accusation words, examples, special situations |
| `rel.js` | Both tier 1 Signals courses from one file. **Emotions** (`#lens-emotions[/<unit>[/<sub>]]`): plants, roots and soil, read top to bottom as going deeper: 1 Feel, 2 Identify the need (with the Identify a need tool), 3 Who you are (planned). **Relationships** (`#lens-relationships[/<unit>[/<sub>]]`): 1 Request, 2 Dialogue (with Communicate), 3 Special situations, one page with an accordion each, the three animal groups first (`#lens-relationships/special[/<id>]`). One sidebar shows both courses, inside then outside, the current one open. A unit opened under the other course's address (old links like `#lens-relationships/feel`, or `/special/animals`, now Captive animals) opens in the right place and the address is corrected |
| `rel.css` | Emotions and Relationships styles |
| `water.js` | Water course: six units (Uses, Sources, Storage, Purify, Testing, Costs), one page each, tailored from the profile, with tools (`#lens-water`, `#lens-water/<unit>[/<sub-unit>]`) |
| `water.css` | Water course styles (units in blues, darkest to lightest) |
| `food.js` | Food course: seven units (Gather, Cleanse, Rehydrate, Cook, Store, Gentle, Companions), one page each, tailored from the profile (including `pets`: cat, dog, small animals), with tools: Soak & cook, How long it keeps, Make it gentle (no-fridge living opens from the profile's `cold` answer or a portable-only place) (`#lens-food`, `#lens-food/<unit>[/<sub-unit>]`) |
| `food.css` | Food course styles (units in dark greens, darkest to lightest; `fo-` prefix) |
| `tox.js` | Poisons course: seven units (Exposures, Plastics, In the home, Pesticides, Soil, Living toxins, Neighbors), each sub-unit ending in a “How to fix” card (mode: One by one, Test once, Habit, Together; cost; steps free first) that can be added to **My list**, a reorderable one-by-one tracker (`localStorage` `meeting-needs.tox.v1`). Tools: Where to start, Soil batch planner (`#lens-toxins`, `#lens-toxins/list`, `#lens-toxins/<unit>[/<sub-unit>]`) |
| `tox.css` | Poisons course styles (units in reds, darkest to lightest; `tx-` prefix) |
| `air.js` | Air course: five units (What’s in the air, Ventilation, Dust, Heat & smoke, Sun & temperature), each sub-unit ending in a “How to fix” card (mode: Right now, Habit, Set up once, Together) that can be added to **My list** (`localStorage` `meeting-needs.air.v1`). Tools sit apart from the units as shortcuts, never gates: What do you notice? (`#lens-air/notice`) and Filter sizer. Reads `stove` and `hood` (`#lens-air`, `#lens-air/list`, `#lens-air/<unit>[/<sub-unit>]`) |
| `air.css` | Air course styles (units in yellows, darkest to lightest; `ai-` prefix; generated from `tox.css`) |
| `clean.js` | Cleaning course (tier 3): the gentle ladder (Water → Soap → Baking soda → Vinegar or 3% peroxide → Beyond, which hands off to Poisons) and five units (Water, The gentle shelf, Surfaces, Stains, Laundry). Every “How to fix” card shows its rung and can be added to **My list** (`localStorage` `meeting-needs.clean.v1`). Tools: What needs cleaning? (`#lens-cleaning/now`) and Stain finder (`#lens-cleaning/stains/finder`). Reads `counter`, `laundry`, `pets`, `kids` and `consider` (`#lens-cleaning`, `#lens-cleaning/list`, `#lens-cleaning/beyond`, `#lens-cleaning/<unit>[/<sub-unit>]`) |
| `clean.css` | Cleaning course styles (units in whites, darkest to lightest; `cl-` prefix; generated from `air.css`) |
| `em.js` | Emergency prep course (tier 5, in progress): unit 1 What to prep for (hazard lookup tool, wildfire, earthquakes, heat, floods, outages, animals), each ending in a Before · During · After “Get ready” card and **My prep list** (`meeting-needs.em.v1`); units 2–6 planned (`#lens-emergency-prep`) |
| `em.css` | Emergency prep styles (units in blues; `em-` prefix; generated from `tox.css`) |
| `gov.js` | Governance course (tier 6, in progress): what legally stops people from meeting basic needs and how to advocate in and outside existing systems. Who controls California water, where it goes, criminalization and incarceration, stairs for change, paths outside law; housing (who owns homes, including private equity) is next (`#lens-governance`) |
| `gov.css` | Governance course styles |

## Run it locally
Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Put it online (free)
- **GitHub Pages**: make a repo, push these files, then Settings → Pages → Deploy from branch → `main` / root.
- **Netlify Drop**: drag this folder onto https://app.netlify.com/drop.

## Personalization (hidden for now)
The Profile, the home page's Personalize card and all "For you" tailoring sit behind one switch, `PERSONALIZE` near the top of `app.js`, set to `false` until it's ready. While it's off there's no Profile link, `#profile` opens the home page, courses see an empty profile (so nothing is tailored) and their "Tailor this course" panels are hidden (`.me-off` in `style.css`). To preview it in one browser, open the site with `?personalize=1`; `?personalize=0` hides it again. Set `PERSONALIZE = true` to turn it on for everyone.

**Personal colour.** Anything that is only about the visitor is silver with slate text (`--personal`, `--me-*` in `style.css`): the Personalize card, the Profile button while the profile is empty, every course's "For you" pill and "Tailor this course" panel. Pink stays for the logo, tier 1 and creator's considerations.

**Personalize card.** Wide and short, beside the hero text, so it adds no height on wide screens (on narrower ones it becomes one slim row). The whole card opens the profile, with a ↑ under the Profile button, and it disappears once anything is on file.

## Profile data
Saved only in the visitor's browser (`localStorage`, key `meeting-needs.profile.v1`). Nothing is sent anywhere. The profile page has Copy backup / Restore for moving between devices.

Place questions describe the place and how long and how much you can shape it, never who owns it: `home` (kind of place), `stay` (how long you expect to stay), `shape` (how much you can change it; a friend who owns it counts) and `space` (outdoor or growing space, including acreage). The Water section (`#profile/water`) holds `sources` (each source with how much it carries you: Sometimes, Often, Main source; plus “No safe tap water at home”), `filters` you already own, `pipes` (before or after 1986) and `rain`. The Food section (`#profile/food`) holds `kitchen` (how you can cook right now), `cold` (how you keep food cold), `stove` (gas, electric, induction, hot plate, none) and `hood` (kitchen fan: vents outside, recirculates, none); the Air course reads the last two. The Cleaning section (`#profile/cleaning`) holds `counter` (counter material; marble, limestone and concrete skip vinegar) and `laundry` (machine at home, shared, laundromat, by hand). The Surroundings section (`#profile/toxins`) holds `built` (before or after 1978, for lead paint) and `near` (freeway, industry or wells, farm fields, airport); the Poisons course also reads `kids`, `consider` and `pets` (birds and cats change some advice). Courses read these to open the sections that fit and tag them "For you", and link back to the profile (with a hover summary of what's on file) for the rare times something changes. Every section stays available either way. Older profiles are migrated on load: renting/owning in `home` becomes the kind of place, “Land or farm” becomes a house plus acreage, and the old single `water` answer becomes a main source.

## Adding or changing a lens
Edit `lenses.js`. Status is one of `ready` (shown as **Beta**, filled in the tier colour), `building` (In progress), `soonest` (the next lens to be written; its card is quieter), `next`, `soon`, `later`, `last`, shown top right on every card. Right now tier 2 is all Beta, tier 3 is Soon except Cleaning (Beta), and tier 6 is Last except Governance. The home page counts Beta and upcoming lenses itself. A lens takes its tier's `color`. A tier with `locked: true` shows its cards on the home page without linking them (Roots, for now).

## Creator opinions
Most copy aims to be plain and checkable. The creator's own views are set apart in pink (the tier 1 and logo color) with `MN.opinion(html, title)`, which renders a "Creator's consideration" box (no name on it) (`.opinion` in `style.css`).

- **Only when asked.** Add a Creator’s consideration only when Ashley explicitly asks for one, in her words. Never draft, suggest or add one on her behalf, and never add other notes in her voice without an explicit request.
- **One sentence.** A consideration is a pointer to the creator's perspective, usually a why, not an essay in her voice. Never write paragraphs, backstory or feelings on her behalf; the single sentence is the whole expression.
- **At the bottom.** Considerations sit at the end of a unit or page, after the regular content.
- **Sourced.** Any fact in or behind the sentence gets a short source line. Keep opinions out of the regular copy.
- **Animals link home.** Any consideration or copy touching peace with animals (plant foods, farm water, secondhand animal materials) links to the Captive animals accordion (`#lens-relationships/special/captive`), which lists them under “Across Kinship” and holds the creator’s consideration on commodification.

## Go deeper (credits)
Every course ends with the same **Go deeper** block (“Shoulders we stand on”), built with `MN.deeper(intro, people)` in `app.js`. Each card names a person or organization, who they are, their work, what it shaped in Kinship, and a link when we have a confirmed one. The block says Kinship is its own synthesis, so anything that misses the mark is Kinship’s, not theirs: it recommends where to go for more and credits influence, without presenting anyone’s work as Kinship’s or Kinship’s as theirs. Never guess a link; leave it out until it’s confirmed. Before launch, each person is asked for consent and invited to give feedback or help shape their section; anyone who declines is removed.

So far: Emotions (Marshall B. Rosenberg & CNVC; Howard Schubiner, *Unlearn Your Pain*), Relationships (CNVC; Michaeleen Doucleff; Barbara Rogoff), Poisons (Dr. Yvonne Burkart). It replaces the older “Nonviolence theory origins” fun fact.

## Labels
Section labels are plain: “Fun fact”, never “A grateful fun fact” (gratitude can live in the copy itself).

## Language for animals
Animals are someone, not something: they/them when sex is unknown, he/she when known, never "it". Never call animals by meat names ("beef", "pork", "poultry", "seafood") or "livestock", including in numbers, tables and labels. Don't soften animal agriculture either: name feedlots and slaughterhouses plainly, and say what a count leaves out. See FOUNDATION.md section 4.

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
| Emergency prep | Blues |
| Cleaning | Whites |
| Poisons | Reds |

Laws mentioned in courses are California's; the practices themselves are general.

## Where shared topics live
- **Harsh cleanups live in Poisons.** Cleaning stops at vinegar and 3% peroxide; big mold, sewage, droppings, a stomach bug, ash, lead dust and mercury go to Poisons (or Air for lead and floods) from Cleaning’s “Beyond the ladder”.
- **Mold and poisons live in Poisons** (Living toxins → Mold in the house and Mold on food; Exposures → Companion animals, what each species can’t process). Air, Water and Food mention damp or spoilage where it fits their own job and link there rather than repeating it.
- **Self-defense** (tier 3) holds noticing, de-escalation, getting away and home preparation; Emergency prep → Securing your home and Personal safety link to it rather than repeating it.
- **Natural disasters** are planned in Emergency prep; Air covers what each event puts into the air and how to read it, and links both ways.
- **Sun on skin** lives in Air & temperature (Sun & temperature); Body care links there rather than repeating it.
- **Food as medicine** (gentle foods, oral rehydration, soft textures) starts in Food → Gentle; Body care and First aid will build on it and link back.
- **What companion animals eat** lives in Food → Companions; what their bodies can’t process stays in Poisons → Exposures → Companion animals.
- **People in distress** (unhoused neighbors and people struggling in public) is a special situation in Relationships, beside Neighbors.
- **Animals in Relationships** come in three accordions: Family animals (companions and their emotional needs), Wild animals (wild neighbors, urban wildlife and shared land; pest work continues in Poisons) and Captive animals (animals humans keep for use: respectful language, farmed animals, Across Kinship, and the creator's consideration on commodification). Old `/pets`, `/wild` and `/animals` routes open the matching one.
- **Plastic nuance:** Poisons → Plastics → When plastic is the safer bet holds the calculated-risk view (tarps, tents, water jugs for people living outside or camping).
- **Tools never gate the teaching.** Every unit is open to read in order; tools are shortcuts into it.

## Courses inside a lens
A lens can open a course instead of the plain lens page. Its files load only when someone opens that lens (see `LAZY` in `app.js`), so the home page stays light. The app is light-theme only.

To add a course: register `window.MN_LENS_VIEWS[<lens id>] = function (sub, lens) { return { html, title }; }` in a script loaded before `app.js`. `window.MN` gives you `header`, `footer`, `esc`, `toast`, `opinion`, `deeper`, `profile()` and `personalize`. One file can register several lenses (Emotions and Relationships share `rel.js`; `LAZY` loads it once). See `rel.js`. Course progress is saved in `localStorage` (`meeting-needs.rel.v3`). Build every course to FOUNDATION.md section 7 (accessibility and phones).
