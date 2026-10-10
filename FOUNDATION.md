# Meeting Needs: Foundation

Read this before building anything in Meeting Needs. Every lens, tool, sentence and button sits on these ideas. When a design choice is unclear, come back here.

## 1. Everything is about meeting needs

All living things have needs: people, children, animals, plants, soil, a house. The name of the app is the whole idea. A lens is a way of noticing which needs are being met, which aren't, and what we can do about it ourselves.

- **Needs are universal.** Every person shares the same needs: food, water, clean air, rest, safety, belonging, freedom, meaning, play. They aren't tied to a person, place, object or time.
- **Strategies are particular.** "I need my partner to do the dishes" or "I need a new job" are strategies: one way of meeting a need. There are always many strategies for one need.
- **Conflict happens between strategies, never between needs.** Two people can always honour each other's needs; they can't always use each other's favourite strategy. So we keep going back to the needs and look for a strategy that meets both.

## 2. Meeting needs is fun

Keeping a home and a body alive isn't a chore split off from life. It *is* life, and it can be the good part.

- Clean dishes, clean air, a tidy shelf, fresh bread and a mended shirt feel good. Not breathing fumes feels good. We frame care work as a pleasure and a game, never as a punishment, a duty or a debt.
- **Togetherness instead of split labour.** We don't picture one adult doing dishes while the children play somewhere else. Children belong right next to the adults: rinsing, carrying, sorting, sweeping and playing with the real tools that keep a house running. Work and play happen in the same place, at the same time.
- Children want to help. Taking that away ("go play, I'll do it") teaches them that their help isn't wanted. Inviting them in, at whatever level they can manage, builds helpfulness that grows on its own.
- Nobody is paid, bribed, scored or shamed into helping. People pitch in because they're part of the household and it feels good to contribute.

Sources: Michaeleen Doucleff, *Hunt, Gather, Parent* (2021), including her TEAM summary (Togetherness, Encouragement, Autonomy, Minimal interference); Barbara Rogoff's research on children learning by observing and pitching in.

## 3. Language: no blame, no shame, no "should"

This app talks the way it teaches people to talk.

- **Observations, not judgements.** Say what happened ("the dishes have been in the sink since Tuesday"), not what it means about someone ("you're lazy").
- **Feelings, not accusations.** Words like *abandoned, ignored, attacked, betrayed, manipulated* hide a "you did this to me". We name the feeling underneath (lonely, scared, hurt) and the need under that.
- **Needs, not diagnoses.** We never call a person, child, animal or plant "bad", "lazy", "difficult" or a "pest". We ask what they need.
- **No good/bad people, no "deserve".** Sorting people into good and bad is how a lot of violence gets permission, and nobody deserves to suffer. We ask what happened, who was hurt, what everyone needs, and what would repair it. Protective force (keeping someone safe) is fine; punishment is not something we promote.
- **Requests, not demands.** The app offers; it never orders. No guilt copy ("you're poisoning your family"), no countdowns, no streak shaming. A "Not now" is always a valid answer.
- Plain words, short sentences, warm tone. Explain any term the first time it appears.

Source: Marshall B. Rosenberg, *Nonviolent Communication: A Language of Life* (PuddleDancer Press). Feelings and needs lists are adapted from the Center for Nonviolent Communication's inventories (cnvc.org). Acknowledge this gratefully in the course's **Go deeper** block at the end (see README), rather than as a headline credit. Meeting Needs' own writing, tools and code are meant to stay free and open for everyone.

## 4. Relationship with everything

The same four steps (notice, feel, find the need, ask) work everywhere, so every lens is a relationships lens underneath.

- **Ourselves:** feelings are signals that point to our own needs.
- **Each other:** partners, children, housemates, neighbours, groups and teams.
- **Animals:** animals are someone, not something. Use **they/them** for an animal whose sex you don't know, and **he** or **she** when you do, just as with people; never "it". Call animals by who they are (a cow, a pig, a chicken, a fish), never by the names of what they become as meat ("beef", "pork", "poultry", "seafood"), not even in numbers, tables or labels ("cows 1,850 gal", not "beef"), and say "farmed animals" rather than "livestock". Kinship is a practice of peace with animals; we show it (plant foods, respectful words, honest numbers) rather than say it, and never preach or shame anyone's choices. Companion animals tell us their needs through their bodies. Wild animals in the house or garden ("pests") are neighbours whose needs (food, water, shelter) our home is accidentally meeting. Change what we offer and they move on.
- **Never suggest hurting anyone, animals or people.** No traps of any kind (snap, glue or live), poisons, baits, larvicides, or anything else that kills, captures or harms. The strategies are prevention and closing the offer: seal, store, dry, close gaps once visitors have moved on. Just leave harm out; don't announce the omission or make a point of it. Not suggesting harm is simply normal.
- **Plants and land:** a yellow leaf or a bare patch of soil is a message about a need: water, light, nutrients, shelter.
- **The house itself:** damp, dust and fumes are signals too. The Cleaning, Airflow, Poisons and Water lenses are about meeting the household's needs.

## 5. Unplug from the profit loop

- Free fixes come first. Show what people can do with what they have before anything that costs money.
- Repair, share and borrow before buying. Tool libraries, bulk orders and neighbours are strategies too.
- Free and open source. No accounts, ads or tracking. Data stays on the person's device.

- **Power with, not power over.** Cooperatives (worker co-ops, housing co-ops, community land trusts) are strategies for meeting needs without extracting profit from the people doing the work or living in the homes.

## 6. How this shows up in the build

- Lenses are courses. A course opens on a **skill tree**: units left to right, nodes connected by prerequisites, planned nodes shown dashed.
- Every node says what it teaches, gives a real example from home life, and ends with something to *do* (a tool, a practice or a question), not a quiz to pass.
- Tools are plug-and-play: start from where the person actually is ("I feel sad", "I need my husband to…", "there are mice in the pantry") and walk them to the need.
- Link lenses wherever one need crosses into another: Relationships → Cleaning (shared chores), Gardening (plants), Food, Poisons.
- Copy follows section 3. If a sentence blames, shames or demands, rewrite it.

## 7. Everyone can use it: disability and phone-only access

Meeting needs includes the need to reach the information. Many of the people Kinship is for use only a phone, often an older one on a limited data plan, a shared device or patchy signal, and many are disabled. Access is built in from the first draft, not added later. The aim is WCAG 2.2 level AA, which is also the usual bar for the ADA. Kinship is made by one person doing her best, so when something falls short, we treat the report as a gift and fix it.

**Phones first, and phones only**
- Design for a 360px-wide screen first, then widen. Nothing may need a mouse, hover, or a big screen: anything shown on hover is also reachable by tap and by keyboard.
- No sideways page scrolling. Text reflows to one column at 320px wide and at 400% zoom.
- Tap targets are at least 44 × 44px, with space between them, reachable one-handed where possible.
- Light pages: no build step, no tracking, plain HTML/CSS/JS, course files load only when opened, images compressed and only when they teach something. Every page should be usable on a slow 3G connection and an older phone.
- Once a page has loaded it keeps working if the signal drops (tools run in the browser, nothing waits on a server). Lists and progress stay on the device.
- Shared devices: nothing personal is stored without saying so, and every saved list can be cleared.

**Seeing**
- Text contrast is at least 4.5:1 (3:1 for large text and for icons, borders and focus rings). Check the quiet styles too: planned, faded and “Soonest” items must stay readable.
- Never use colour alone to carry meaning. Status, “For you”, planned and tier all have a word or shape as well as a colour.
- Text can be enlarged to 200% without breaking; sizes are relative where possible.
- Every image or diagram that teaches has alt text or a text version beside it; decorative ones are hidden from screen readers (`aria-hidden`, empty `alt`).

**Screen readers and keyboards**
- Real HTML first: headings in order (one `h1` per page), lists for lists, `button` for actions, `a` for going somewhere, `label` for every form field. ARIA only when HTML can't say it.
- Everything works with a keyboard alone, in a sensible order, with a clearly visible focus ring. No keyboard traps. Each route moves focus to its `h1`.
- Links make sense out of context (“Open my profile”, not “click here”); links that open a new tab say so.
- Interactive tools (the feelings wheel, sorters, finders) have a plain list or button alternative that does the same job.
- Changes that appear without a page load (a saved toast, a result) are announced with a live region.

**Hearing, moving and thinking**
- Video or audio gets captions or a transcript.
- Respect “reduce motion”: no motion is needed to understand anything, and nothing flashes.
- No time limits, countdowns or streaks (section 3 already rules these out).
- Plain words, short sentences, one idea per paragraph, and terms explained the first time (section 3). Consistent layout and names across courses, so learning one course teaches how to use the next.
- Long pages can be read in pieces: jump links, a course map, and progress saved on the device.

**Checking**
- Before a course ships, try it: on a phone, with keyboard only, with a screen reader (VoiceOver or TalkBack), at 200% zoom, and with reduce motion on. Run an automated checker (such as axe or Lighthouse) as a first pass, not the last word.
- Ask disabled people, phone-only users, and organizations that serve unhoused and disabled communities for feedback, and fold it in.

