/* Cleaning lens: course content, profile tailoring, My list and tools. Registers window.MN_LENS_VIEWS.cleaning.
   Routes: #lens-cleaning (overview) · #lens-cleaning/beyond (overview, at Beyond the ladder) · #lens-cleaning/now (tool: What needs cleaning?)
           #lens-cleaning/list (My list) · #lens-cleaning/<unit>[/<sub>] (the Stain finder is #lens-cleaning/stains/finder).
   The course's main idea is the gentle ladder: Water → Soap → Baking soda → Vinegar or 3% peroxide → Beyond (Poisons).
   Every How to fix card shows the rung it uses. Harsh cases (big mold, sewage, droppings, a stomach bug, ash, lead, mercury) hand off to Poisons.
   Units are whites, darkest (1) to lightest (5): Water → The gentle shelf → Surfaces → Stains → Laundry.
   Mold lives in Poisons (Living toxins → Mold in the house) and is linked, not repeated. Laws mentioned are California’s; the chemistry is general.
   Content was generated from mockups/cleaning-course-mockup.html; edit here from now on. */
(function () {
  var BASE = '#lens-cleaning', LKEY = 'meeting-needs.clean.v1';
  function mn() { return window.MN; }
  function esc(s) { return mn().esc(s); }
  function prof() { return (mn().profile && mn().profile()) || {}; }
  function $(id) { return document.getElementById(id); }

  /* ---------- profile → tags ---------- */
  function tags() {
    var p = prof(), t = {}, pets = p.pets || '';
    if (p.home === 'Vehicle or boat' || p.home === 'Shelter or no fixed place' || p.stay === 'No fixed place right now') t.portable = 1;
    if (p.shape === 'Nothing: it all has to be portable') t.portable = 1;
    if (p.shape && p.shape !== 'It’s ours to shape') t.rent = 1;
    if (Number(p.kids) > 0 || (p.consider || []).some(function (c) { return /Pregnancy|Babies/.test(c); })) t.kids = 1;
    if (pets && !/^\s*(0|none|no)\s*$/i.test(pets)) t.animals = 1;
    if (/bird|parrot|parakeet|budgie|cockatiel|canary|finch|dove|chicken|hen/i.test(pets)) t.birds = 1;
    if (/cat|kitten/i.test(pets)) t.cats = 1;
    if (/Marble|Concrete/.test(p.counter || '')) t.stone = 1;
    if (/Shared|Laundromat|mix/.test(p.laundry || '')) t.laundromat = 1;
    if (/By hand/.test(p.laundry || '')) t.portable = 1;
    return t;
  }
  var T = {};

  /* ---------- small builders (same shapes as air.js, cl- prefix) ---------- */
  var CUR = { u: '', s: '' };
  function acc(forTags, who, title, body) {
    var hit = forTags.split(' ').some(function (k) { return T[k]; });
    return '<details class="cl-acc' + (hit ? ' match' : '') + '" data-for="' + forTags + '"' + (hit ? ' open' : '') + '>' +
      '<summary><span class="cl-who">' + who + '</span><span class="cl-acc-t">' + title + '</span><span class="cl-foryou">For you</span></summary>' +
      '<div class="cl-in">' + body + '</div></details>';
  }
  function accs() { return '<div class="cl-accs">' + Array.prototype.join.call(arguments, '') + '</div>'; }
  function box(kind, html) { return '<p class="cl-box cl-' + kind + '">' + html + '</p>'; }
  function ca(h) { return box('ca', h); }
  function home(h) { return box('home', h); }
  function care(h) { return box('danger', h); }
  function together(h) { return box('together', h); }
  function kin(h) { return box('kin', h); }
  function links(h) { return '<p class="cl-links">' + h + '</p>'; }
  function src(h) { return '<p class="cl-src">' + h + '</p>'; }
  function legend(h) { return '<p class="cl-legend">' + h + '</p>'; }

  var MODE = { now: 'Right now', habit: 'Habit', once: 'Set up once', together: 'Together' };
  var COST = ['Free', '$', '$$'];
  function mode(k, label) { return '<span class="cl-mode cl-m-' + k + '">' + (label || MODE[k]) + '</span>'; }
  function rung(k, label) { return '<span class="cl-rb cl-' + k + '">' + label + '</span>'; }
  /* fix({ rungs: [['r1', 'Water']], modes: [['now'], ['once']], cost: 'Free → $', c: 0, steps: [[label, text]], add: [title | [title, button label]] })
     Rungs: r1 Water · r2 Soap · r3 Baking soda · r4 Vinegar or peroxide · r5 Beyond (Poisons). */
  function fix(o) {
    var rungs = (o.rungs || []).map(function (r) { return rung(r[0], r[1]); }).join('');
    var modes = o.modes.map(function (m) { return mode(m[0], m[1]); }).join('');
    var data = o.modes.map(function (m) { return m[0] + ':' + (m[1] || MODE[m[0]]); }).join('|');
    var rdata = (o.rungs || []).map(function (r) { return r[0] + ':' + r[1]; }).join('|');
    var adds = (o.add || []).map(function (a, i) {
      var t = typeof a === 'string' ? a : a[0], label = typeof a === 'string' ? (i ? 'Add this too' : 'Add to my list') : a[1];
      return '<button type="button" class="cl-add" data-cl="add" data-title="' + esc(t) + '" data-label="' + esc(label) + '" data-u="' + CUR.u + '" data-s="' + CUR.s + '" data-c="' + (o.c || 0) + '" data-m="' + esc(data) + '" data-r="' + esc(rdata) + '">' + esc(label) + '</button>';
    }).join('');
    return '<div class="cl-fix"><div class="cl-fix-top"><b>How to fix</b>' + rungs + modes + '<span class="cl-cost">' + o.cost + '</span></div>' +
      '<ol class="cl-steps">' + o.steps.map(function (s) { return '<li><small>' + s[0] + '</small>' + s[1] + '</li>'; }).join('') + '</ol>' +
      (adds ? '<div class="cl-fix-foot">' + adds + '</div>' : '') + '</div>';
  }

  var NUM = {};
  function finderHtml() {
    return '<div class="cl-row">' +
      '<label class="cl-f">What spilled?<select id="cl-sf-stain"></select></label>' +
      '<label class="cl-f">On what?<select id="cl-sf-on"><option value="wash">Washable cotton or linen</option><option value="synthetic">Synthetic or blend</option><option value="delicate">Wool or silk</option><option value="carpet">Carpet or upholstery</option></select></label>' +
      '<label class="cl-f">Color<select id="cl-sf-color"><option value="light">White or light</option><option value="dark">Colored or dark</option></select></label>' +
      '</div><div class="cl-out" id="cl-sf-out"></div>';
  }
  /* Shown after a unit's last sub-unit (e.g. a Creator’s consideration, only when Ashley asks for one). */
  var AFTER = {};

  /* ---------- course content ---------- */
  function units() {
    return [
      /* ===== 1 · Water ===== */
      { id: "water", num: 1, kind: "Foundation", word: "Water", sub: "Start here. Most days end here.",
        modes: ["habit", "together"],
        lede: "Water is the best solvent on earth and the gentlest. With a cloth that grabs, a little warmth and a minute of waiting, it lifts crumbs, spills, sticky fingerprints and most germs off a counter and carries them away. Nothing stays behind to breathe, lick or touch.",
        mode: "A wipe after cooking and a dry cloth after. The easiest cleaning to hand to small hands.",
        subs: [
          { id: "lifts", short: "Lifts, not kills", title: "Cleaning lifts, it doesn’t kill", html: function () { return "<p>Three words get mixed up on labels. <b>Cleaning</b> removes dirt and germs from a surface. <b>Sanitizing</b> lowers the number of germs left. <b>Disinfecting</b> kills nearly all of a listed set of germs, given enough time wet. Most of a home only ever needs the first one. Germs ride on grease and grime; lift those off and most of the germs leave with them.</p>" +
            "<div class=\"cl-does\">\n<div><b>Clean <i>Every day</i></b><p>Water, a cloth, soap if it’s greasy. Counters, tables, floors, high chairs.</p></div>\n<div><b>Sanitize <i>Sometimes</i></b><p>Hot water or peroxide on cutting boards, the sponge, baby bottles.</p></div>\n<div><b>Disinfect <i>When it counts</i></b><p>Someone is sick, or there’s blood, vomit or a bathroom accident. Clean first, then disinfect.</p></div>\n</div>" +
            home("Disinfecting a dirty counter barely works: grime shields the germs underneath. Wiping with water first is what makes any later rung effective.") +
            fix({ rungs: [["r1", "Water"]], modes: [["habit"]], cost: "Free", c: 0,
              steps: [["Free · today", "For a week, clean counters and tables with only warm water and a cloth. Notice what it doesn’t lift; that tells you where the next rung is needed."], ["Free", "Save disinfecting for sickness, blood, vomit and bathroom accidents."], ["Free", "Always clean before you disinfect."]],
              add: ["One week of water-only counter wiping"] }) +
            src("CDC, <i>Cleaning and Disinfecting Your Home</i> (2024); US EPA, “What’s the difference between products that disinfect, sanitize and clean surfaces?”"); } },
          { id: "cloths", short: "Cloths", title: "Cloths that grab", html: function () { return "<p>The cloth does as much work as whatever is on it. <b>Microfiber</b> is split into fibers far finer than a hair, so it scoops up grease and microbes that a cotton cloth pushes around. In a hospital trial, microfiber mops with plain water removed about 99% of bacteria from floors; conventional cotton mops removed about a third.</p>" +
            "<div class=\"cl-does\">\n<div><b>Microfiber <i>Grabs most</i></b><p>Damp, not wet. Washed warm, no softener (it clogs the fibers). Lasts hundreds of washes.</p></div>\n<div><b>Cotton or linen <i>No plastic</i></b><p>Old towels, T-shirts and flour-sack cloths. Fine for most jobs; rinse and wring more often.</p></div>\n<div><b>Paper towels <i>For the yucky ones</i></b><p>Vomit, droppings, a companion’s accident: catch it, then compost or bin it.</p></div>\n</div>" +
            kin("Microfiber is plastic and sheds tiny fibers in the wash. Fewer, longer-lived cloths and a wash bag (5.5) meet both needs: clean counters and clean rivers.") +
            fix({ rungs: [["r1", "Water"]], modes: [["once"]], cost: "Free → $", c: 1,
              steps: [["Free · today", "Cut old towels or shirts into a stack of cloths. Keep them in a basket where everyone can reach."], ["Free", "Colors by job: one color for the kitchen, one for the bathroom, so they never swap."], ["$ · once", "A few microfiber cloths (about $10 for a pack) for counters, glass and dusting."]],
              add: ["A basket of cloths, one color per room"] }) +
            src("University of Washington, DEOHS, <i>Microfiber Fact Sheet</i>; US EPA Region 9 and UC Davis Medical Center, <i>Using Microfiber Mops in Hospitals</i> (2002)."); } },
          { id: "warm", short: "Warm & waiting", title: "Warm water and waiting", html: function () { return "<p>Four things clean anything: <b>water</b>, <b>warmth</b>, <b>time</b> and <b>a little rubbing</b> (cleaners call it Sinner’s circle). Turn one up and you need less of the others. Waiting is the most underrated: dried oatmeal, jam or a sticky toddler table loosens on its own under a warm wet cloth for five minutes, and then wipes off with no scrubbing at all.</p>" +
            "<ul>\n<li>Warm, not boiling, for counters and floors: hot enough to soften grease, comfortable for hands.</li>\n<li>Lay a hot wet cloth on dried spills and walk away. Come back after the kettle boils.</li>\n<li>A pot with burnt-on food: a few cm of water, a simmer for 10 minutes, then a wooden spatula.</li>\n<li>Steam (from a kettle or a steam mop) loosens grout grime and sanitizes without any product.</li>\n</ul>" +
            care("Keep the kettle and steam mop out of reach of toddlers and away from paws. Steam burns fast; it’s a grown-up tool.") +
            fix({ rungs: [["r1", "Water"]], modes: [["habit"]], cost: "Free", c: 0,
              steps: [["Free · today", "Next stuck-on spill: a warm wet cloth on top for 5 minutes before wiping."], ["Free", "Pots and pans: soak while you eat, so washing up is a rinse."]],
              add: ["Soak first: warm cloth on spills, pans soak while we eat"] }) +
            src("Sinner, H. (1959), the four factors of cleaning (chemistry, temperature, time, mechanical action), as taught in professional cleaning and food-safety training."); } },
          { id: "order", short: "Order", title: "Top to bottom, clean to dirty", html: function () { return "<p>Order saves work. Dust and crumbs fall, so start high and finish with the floor. Move from the cleanest spot to the dirtiest so a cloth never carries the toilet to the sink. And dry jobs (dusting, sweeping) come before wet ones, so dust doesn’t turn to mud.</p>" +
            "<ol>\n<li>Shelves and high surfaces, with a damp cloth.</li>\n<li>Counters and tables.</li>\n<li>Sinks, then the stove.</li>\n<li>Bathroom last: sink and mirror, then tub, then toilet.</li>\n<li>Floors, from the far corner toward the door.</li>\n</ol>" +
            home("Fold a cloth in quarters and you get eight clean faces. Turn to a fresh one each time the face looks used, rather than rinsing in murky water.") +
            fix({ rungs: [["r1", "Water"]], modes: [["habit"]], cost: "Free", c: 0,
              steps: [["Free", "Fold cloths in quarters and turn to a fresh face as you go."], ["Free", "Two buckets for the floor: one to wet the mop, one to wring into."]],
              add: ["Top to bottom, clean to dirty; fold cloths in quarters"] }); } },
          { id: "dry", short: "Dry is clean", title: "Dry is clean", html: function () { return "<p>Bacteria and mold need water. A counter wiped and left wet is a pool for them; a counter wiped and dried is a desert. The same goes for sponges, dish brushes, the sink, the shower and the cutting board. Drying is the free, product-free half of disinfecting.</p>" +
            "<ul>\n<li>After wiping with water, a dry cloth or a minute of air does the rest.</li>\n<li>Stand sponges, brushes and boards upright so air reaches every side.</li>\n<li>A squeegee on the shower walls takes 30 seconds and keeps scale and mildew away.</li>\n<li>Hang wet cloths to dry right away; a balled-up wet cloth smells sour by morning.</li>\n</ul>" +
            fix({ rungs: [["r1", "Water"]], modes: [["habit"], ["once"]], cost: "Free → $", c: 1,
              steps: [["Free · today", "A hook or rail by the sink so cloths hang open to dry."], ["Free", "Dry the sink and counter at the end of the day."], ["$ · once", "A shower squeegee (about $10)."]],
              add: ["Dry the sink and counter at night; cloths hung open", ["Shower squeegee after each shower", "Add the squeegee"]] }) +
            links("<a href=\"#lens-air/ventilation/damp\">Air → Damp air</a> · <a href=\"#lens-toxins/living/mold\">Poisons → Mold in the house</a>"); } },
          { id: "together", short: "Little hands", title: "Little hands, real cloths", html: function () { return "<p>Water is the rung children can use on their own. A small spray bottle of plain water, a cloth of their own and a real job (the low cupboard doors, the table after dinner, the window they can reach) turns cleaning into play that also cleans. There’s nothing in the bottle to worry about, so nobody has to hover.</p>" +
            "<div class=\"cl-does\">\n<div><b>Toddlers <i>1–3</i></b><p>Spray and wipe a low window. Carry the cloth basket. Wipe their own spill.</p></div>\n<div><b>Little kids <i>4–7</i></b><p>Wipe the table, sort cloths by color, squeegee the shower, mop a small floor.</p></div>\n<div><b>Bigger kids <i>8+</i></b><p>Choose the rung themselves, mix a baking soda paste, run a whole room.</p></div>\n</div>" +
            together("Clean side by side at the same time, rather than sending kids off to play while the adults clean. Their wiping won’t be perfect, and the wanting to help is the part worth keeping.") +
            kin("Companion animals join in their own way: a dog who likes to follow the mop, a cat who inspects every cupboard. Water-only cleaning means their curiosity is safe.") +
            fix({ rungs: [["r1", "Water"]], modes: [["together"]], cost: "Free → $", c: 1,
              steps: [["Free · today", "Give a child their own cloth and a spray bottle of plain water, labeled with their name."], ["Free", "One cleaning time a week where everyone cleans together, with music."], ["$", "A child-size broom and dustpan (about $15) that really works."]],
              add: ["A kid’s own water spray bottle and cloth", ["Weekly cleaning time together, with music", "Add cleaning time"]] }) +
            links("<a href=\"#lens-relationships/special/children\">Emotions &amp; love → Children</a>") +
            src("Michaeleen Doucleff, <i>Hunt, Gather, Parent</i> (2021); Rogoff, B., <i>Learning by Observing and Pitching In</i> (Advances in Child Development and Behavior, 2014)."); } }
        ] },

      /* ===== 2 · The gentle shelf ===== */
      { id: "shelf", num: 2, kind: "Foundation", word: "The gentle shelf", sub: "When water needs help",
        modes: ["once", "habit"],
        lede: "Four bottles and a box cover nearly every job water can’t do alone: soap, baking soda, white vinegar and 3% hydrogen peroxide. Each one does one thing well. Knowing which thing is what keeps the shelf short and the house gentle.",
        mode: "Stock the shelf as old products run out. Reach for the lowest rung first.",
        intro: "<div class=\"cl-tbl\"><table>\n<thead><tr><th>Helper</th><th>What it does</th><th>Great for</th><th>Not for</th><th>Cost</th></tr></thead>\n<tbody>\n<tr><td>Soap (castile or plain dish soap)</td><td>Grabs grease and oil so water can rinse them away</td><td>Greasy counters, stovetops, hands, dishes, floors</td><td>Mixing with vinegar (they cancel out)</td><td>A bottle lasts months</td></tr>\n<tr><td>Baking soda</td><td>A soft scrub; mildly alkaline; soaks up smells</td><td>Sinks, tubs, pans, ovens, smelly bins and shoes</td><td>Polished stone or high-gloss finishes (can dull them)</td><td>About $1 a pound</td></tr>\n<tr><td>White vinegar (5%)</td><td>An acid: dissolves mineral scale and soap scum</td><td>Kettles, faucets, shower glass, windows</td><td>Marble, limestone, travertine, grout, cast iron, waxed wood</td><td>About $4 a gallon</td></tr>\n<tr><td>Hydrogen peroxide (3%)</td><td>Breaks down germs; turns into water and oxygen</td><td>Disinfecting after sickness, boards, toilets, light fabric stains</td><td>Dark fabrics (can lighten them); storing in a clear bottle</td><td>About $1 a pint</td></tr>\n</tbody>\n</table></div>",
        subs: [
          { id: "soap", short: "Soap", title: "Soap for grease", html: function () { return "<p>Water and oil don’t mix, so water alone slides over grease. A soap molecule has one end that holds water and one end that holds oil. It wraps tiny bits of grease in little balls (micelles) that water can carry away. That’s all soap does, and it’s exactly what kitchen grease, skin oil and fingerprints need.</p>" +
            "<ul>\n<li>A few drops in a bowl or spray bottle of warm water is plenty. Too much leaves a film that collects dirt.</li>\n<li>Castile soap (made from plant oils) or a plain, fragrance-free dish soap both work.</li>\n<li>Wipe with the soapy cloth, then once with a water-only cloth so no film stays behind.</li>\n</ul>" +
            home("A kitchen spray: 500 ml warm water and 1 teaspoon of dish soap or castile soap. Label it, and make a fresh bottle every couple of weeks.") +
            fix({ rungs: [["r2", "Soap"]], modes: [["once"]], cost: "Free", c: 0,
              steps: [["Free · today", "Make the kitchen spray from the soap you already have."], ["Free", "Soapy wipe, then a water wipe: no film."], ["As it runs out", "Swap scented dish soap for a fragrance-free one."]],
              add: ["Make a labeled soap-and-water kitchen spray"] }) +
            src("American Chemical Society, <i>ChemMatters</i>, how soap works (micelles)."); } },
          { id: "soda", short: "Baking soda", title: "Baking soda to scrub", html: function () { return "<p>Baking soda (sodium bicarbonate) is a fine powder that’s softer than most surfaces, so it scrubs without scratching. It’s mildly alkaline, which helps it cut greasy, acidic grime, and it soaks up sour smells rather than covering them.</p>" +
            "<ul>\n<li><b>Paste:</b> 3 parts baking soda to 1 part water. Spread, wait 15 minutes (or overnight for an oven), then scrub and rinse.</li>\n<li><b>Sprinkle:</b> on a damp sponge for sinks, tubs and stained mugs.</li>\n<li><b>Smells:</b> an open jar in the fridge; a sprinkle in the bin, a shoe or a rug for an hour, then vacuum.</li>\n</ul>" +
            care("Test on a hidden spot first on high-gloss, painted or aluminum surfaces; it can dull a polish. Rinse it off aluminum pans quickly.") +
            fix({ rungs: [["r3", "Baking soda"]], modes: [["once"]], cost: "$", c: 1,
              steps: [["$ · once", "A big bag of baking soda (about $1 a pound) in a jar with a lid and a scoop."], ["Free", "Paste, wait, then scrub. Waiting does most of the work (1.3)."]],
              add: ["A lidded jar of baking soda on the shelf"] }); } },
          { id: "vinegar", short: "Vinegar", title: "Vinegar for scale", html: function () { return "<p>White vinegar is about 5% acetic acid. Acid dissolves the minerals that hard water leaves behind: white crust on faucets, cloudy shower glass, the inside of a kettle, soap scum. It’s a descaler more than a germ fighter. In lab tests, vinegar knocks back some germs but not reliably, so it isn’t the rung for disinfecting.</p>" +
            "<ul>\n<li><b>Spray:</b> half vinegar, half water for glass, mirrors and shower walls.</li>\n<li><b>Soak:</b> a cloth soaked in full-strength vinegar wrapped around a crusty faucet for 30 minutes.</li>\n<li><b>Kettle:</b> half vinegar, half water, boil, sit an hour, rinse twice.</li>\n<li>The smell fades as it dries, usually within an hour. A window open helps.</li>\n</ul>" +
            care("Acid etches natural stone. Keep vinegar (and lemon) off marble, limestone, travertine and unsealed concrete, off grout (it slowly eats it), and away from cast iron and waxed or oiled wood. Some washer and dishwasher makers advise against regular vinegar because it can wear rubber seals.") +
            accs(
              acc("stone", "Your counters", "Marble, limestone or travertine", "<p>Skip rung 4 on these. Water, then a drop of soap, then a little baking soda paste, gently, is the whole ladder for soft stone. A stone-safe, pH-neutral cleaner is the only “extra” it needs. More in 3.1.</p>")) +
            fix({ rungs: [["r4", "Vinegar"]], modes: [["habit"]], cost: "$", c: 1,
              steps: [["$ · once", "A labeled spray bottle: half white vinegar, half water."], ["Free", "Use it for glass and scale; reach for soap for grease."], ["Free", "Check the counter material before it goes near stone."]],
              add: ["Labeled half-vinegar spray for glass and scale"] }) +
            src("Rutala, W. et al., “Antimicrobial activity of home disinfectants and natural products against potential human pathogens,” <i>Infection Control &amp; Hospital Epidemiology</i> 21 (2000); Natural Stone Institute, care and cleaning of natural stone."); } },
          { id: "peroxide", short: "Peroxide", title: "Hydrogen peroxide to disinfect", html: function () { return "<p>The brown bottle of 3% hydrogen peroxide from the pharmacy is the gentlest real disinfectant on the shelf. It breaks germs apart by oxidizing them, then breaks down itself into water and oxygen. It leaves no residue and no smell, and it’s gone by the time a cat walks across the counter.</p>" +
            "<ul>\n<li><b>Clean first</b> with water or soap, then spray peroxide straight from a dark bottle.</li>\n<li><b>Keep it wet.</b> Let it sit 5–10 minutes before wiping; disinfecting happens while it’s wet, not when it touches.</li>\n<li><b>Keep it dark.</b> Light breaks it down. Screw a spray nozzle onto the original brown bottle, or use an opaque one. Old peroxide that no longer fizzes when poured on a sink drain has turned to water.</li>\n<li>It can lighten colored fabric, rugs and hair. Test first on anything dyed.</li>\n</ul>" +
            care("Only the 3% kind. “Food grade” 35% peroxide burns skin and eyes; it isn’t a home cleaner. Even 3% stings eyes, so spray low and away from faces.") +
            fix({ rungs: [["r4", "Peroxide"]], modes: [["once"], ["habit"]], cost: "$", c: 1,
              steps: [["$ · once", "A spray nozzle that fits the brown peroxide bottle (about $2)."], ["Free", "Clean, spray, wait 5–10 minutes, wipe. Only when it counts (1.1)."]],
              add: ["Spray top on the brown peroxide bottle, for when it counts"] }) +
            src("CDC, <i>Guideline for Disinfection and Sterilization in Healthcare Facilities</i> (2008, updated 2019), hydrogen peroxide; US EPA, List N disinfectants (hydrogen peroxide products and contact times)."); } },
          { id: "never", short: "Never meet", title: "Pairs that never meet", html: function () { return "<p>Most of the gentle shelf is safe together on the same counter, one after another, wiped between. A few pairs are better kept apart in a bottle, and two of them can hurt.</p>" +
            "<div class=\"cl-tbl\"><table>\n<thead><tr><th>Pair</th><th>What happens</th><th>Instead</th></tr></thead>\n<tbody>\n<tr><td>Peroxide + vinegar in one bottle</td><td class=\"n\">Makes peracetic acid, which irritates eyes, skin and lungs</td><td>One after the other, wiping between, never stored mixed</td></tr>\n<tr><td>Bleach + vinegar or any acid</td><td class=\"n\">Chlorine gas</td><td>Never together; this is Poisons territory</td></tr>\n<tr><td>Bleach + ammonia (some glass cleaners, urine)</td><td class=\"n\">Chloramine gas</td><td>Never together</td></tr>\n<tr><td>Bleach + peroxide</td><td class=\"n\">A fast, hot reaction that releases oxygen and can splash</td><td>Never together</td></tr>\n<tr><td>Baking soda + vinegar</td><td class=\"p\">They cancel out into salty water and fizz</td><td>Fine for unclogging fun or a science lesson; use each alone for cleaning</td></tr>\n<tr><td>Castile soap + vinegar</td><td class=\"p\">The soap curdles into a greasy film</td><td>Soap first, rinse, then vinegar</td></tr>\n</tbody>\n</table></div>" +
            home("Any bottle you mix gets a label: what’s in it and the date. A mystery bottle is the one most likely to meet the wrong partner.") +
            fix({ modes: [["once"]], cost: "Free", c: 0,
              steps: [["Free · today", "Label every bottle you mix, with the date."], ["Free", "If there’s bleach in the house, store it apart from vinegar and ammonia, on a high shelf."]],
              add: ["Label and date every mixed bottle"] }) +
            links("<a href=\"#lens-toxins/home/cleaners\">Poisons → Cleaning products</a> · Tools (tier 4, coming) → pairs that must never meet") +
            src("Washington State Department of Health, <i>Don’t mix bleach with ammonia or acids</i>; NIOSH, peracetic acid; America’s Poison Centers, cleaning product exposures."); } },
          { id: "mouths", short: "Paws & mouths", title: "Paws, beaks and little mouths", html: function () { return "<p>Children and companion animals meet a home with their mouths, hands and paws, low to the ground. A cat licks whatever she walked through. A toddler licks the window. A bird breathes in fumes faster than anyone in the house. The gentle shelf suits all of them, used this way:</p>" +
            "<ul>\n<li><b>Dry before paws and hands.</b> Wipe peroxide or vinegar off floors and counters, or let them dry fully, before kids or animals come back.</li>\n<li><b>Store high, even the gentle ones.</b> A swallowed mouthful of baking soda or peroxide can make a small body sick.</li>\n<li><b>Pour onto a cloth</b> rather than spraying into the air, around birds most of all.</li>\n</ul>" +
            accs(
              acc("cats", "Cats", "Essential oils, pine and phenols", "<p>Cats’ livers can’t break down many essential oils (tea tree, citrus, pine, eucalyptus, peppermint, wintergreen) or phenols (the “pine” and “disinfectant” smell in some floor cleaners). Many “natural” cleaners are scented with these. Unscented basics are kindest. Quaternary ammonium (“quats”) in disinfecting wipes can burn a cat’s tongue when licked off paws.</p><p class=\"links\"><a href=\"#lens-toxins/exposures/companions\">Poisons → Companion animals</a></p>"),
              acc("birds", "Birds", "Sprays, scent and steam", "<p>Birds’ lungs pull air through air sacs in one direction and take in airborne chemicals fast. Pour-and-wipe instead of spraying, no air fresheners or scented products, and clean in a different room with a window open while the bird is elsewhere. Cage cleaning: hot water and a brush, peroxide only on a cage that’s empty, rinsed and fully dry before he or she goes back.</p><p class=\"links\"><a href=\"#lens-air/smoke/companions\">Air → Companions’ lungs</a></p>"),
              acc("kids", "Kids", "Babies, toddlers and pregnancy", "<p>High chairs, toys and teethers: hot soapy water and a water rinse is all they need most days. Peroxide for toys after a stomach bug, rinsed after. Keep every bottle, gentle or not, in its original or labeled container, out of reach. If anything is swallowed or splashed in an eye, rinse with water and call Poison Control (1-800-222-1222), free and open all day and night.</p>")) +
            fix({ modes: [["once"], ["habit"]], cost: "Free", c: 0,
              steps: [["Free · today", "Move the cleaning shelf up high, and put Poison Control’s number on the inside of the door."], ["Free", "Check any “natural” cleaner for essential oils if a cat lives with you."], ["Free", "Floors dry before paws and crawlers."]],
              add: ["Cleaning shelf up high, Poison Control number on the door"] }) +
            src("ASPCA Animal Poison Control, essential oils and cats; household cleaners and companion animals; Association of Avian Veterinarians, household hazards for birds; America’s Poison Centers."); } }
        ] },

      /* ===== 3 · Surfaces ===== */
      { id: "surfaces", num: 3, kind: "Practice", word: "Surfaces", sub: "The ladder, room by room",
        modes: ["now", "habit"],
        lede: "Every surface has its own needs. Stone wants no acid, wood wants to stay dry, steel wants to be wiped with the grain. The ladder stays the same; only where you stop changes.",
        mode: "Most spills: a warm cloth, then dry. A few small rhythms keep the bigger jobs rare.",
        subs: [
          { id: "counters", short: "Counters", title: "Countertops", html: function () { return "<p>Counters get the most wiping in the house and touch the most food, so they get the gentlest routine: a warm wet cloth after cooking, then dry. Soap when it’s greasy. Peroxide only after something that matters (a sick day, a spill from the bin). Here is where each material stops on the ladder.</p>" +
            "<div class=\"cl-tbl\"><table id=\"cl-counters\">\n<thead><tr><th>Counter</th><th>Every day</th><th>Stuck-on or greasy</th><th>To disinfect</th><th>Keep away</th></tr></thead>\n<tbody>\n<tr data-c=\"Laminate or plastic\"><td>Laminate or plastic</td><td class=\"y\">Water, cloth, dry</td><td>Soap; baking soda paste, gently</td><td class=\"y\">Peroxide, 5–10 min</td><td>Scouring pads; standing water at seams</td></tr>\n<tr data-c=\"Sealed granite or quartz\"><td>Sealed granite or quartz</td><td class=\"y\">Water, microfiber, dry</td><td>A drop of soap</td><td class=\"y\">Peroxide, then a water wipe</td><td>Vinegar and lemon on granite over time (dulls the sealer); abrasives on quartz</td></tr>\n<tr data-c=\"Marble, limestone or travertine\"><td>Marble, limestone or travertine</td><td class=\"y\">Water, soft cloth, dry</td><td>A drop of soap; wipe spills fast</td><td class=\"p\">Peroxide sparingly on light stone, rinsed</td><td class=\"n\">Vinegar, lemon, wine, tomato: any acid etches</td></tr>\n<tr data-c=\"Wood or butcher block\"><td>Wood or butcher block</td><td class=\"y\">Barely damp cloth, dry right away</td><td>Soap; coarse salt and half a lemon scrubbed, then rinsed</td><td class=\"y\">Peroxide, then dry and oil</td><td>Soaking; dishwasher-hot water; leaving wet</td></tr>\n<tr data-c=\"Tile and grout\"><td>Tile and grout</td><td class=\"y\">Water, cloth</td><td>Baking soda paste and a toothbrush on grout</td><td class=\"y\">Peroxide on grout (lightens it too)</td><td>Vinegar on grout</td></tr>\n<tr data-c=\"Stainless steel\"><td>Stainless steel</td><td class=\"y\">Water, microfiber, wipe with the grain</td><td>Soap; baking soda paste for spots</td><td class=\"y\">Peroxide, then a water wipe</td><td>Steel wool; leaving salt or bleach on it</td></tr>\n<tr data-c=\"Concrete\"><td>Concrete</td><td class=\"y\">Water, cloth</td><td>A drop of soap</td><td class=\"p\">Peroxide, then rinse</td><td class=\"n\">Vinegar and acids; concrete is etched by them</td></tr>\n</tbody>\n</table></div>" +
            '<p class="cl-legend cl-counter-note"></p>' +
            home("Not sure what yours are? A drop of water that sits as a bead on stone is a good sign the sealer is working. If it darkens the stone within a few minutes, the stone is thirsty and acid-sensitive; treat it like marble.") +
            accs(
              acc("rent", "Renting", "Counters that aren’t yours", "<p>The gentlest ladder protects the deposit too: water and soap don’t etch, stain or strip a sealer. Photos of the counters on move-in day help everyone remember what was already there.</p>")) +
            fix({ rungs: [["r1", "Water"], ["r2", "Soap"]], modes: [["habit"]], cost: "Free", c: 0,
              steps: [["Free · after cooking", "Warm wet cloth, then a dry one. That’s the whole routine most days."], ["Free", "Greasy? The soap spray (2.1), then a water wipe."], ["Free", "Peroxide only after sickness or a spill from the bin, left wet 5–10 minutes."]],
              add: ["Counters: warm cloth, then dry, after cooking"] }) +
            src("Natural Stone Institute, <i>Care and Cleaning for Natural Stone Surfaces</i>; manufacturers’ care guides for engineered quartz and laminate."); } },
          { id: "boards", short: "Boards & sinks", title: "Boards, sinks and sponges", html: function () { return "<p>The kitchen sponge is often the most microbe-rich object in the house: warm, wet and fed. It doesn’t need to be sterile, just dry between uses and swapped often. Cutting boards and the sink need the same thing: a scrub, a rinse, and air.</p>" +
            "<ul>\n<li><b>Boards:</b> hot soapy water and a brush right after use, then stand upright to dry. Wood and plastic both work; deep knife grooves in plastic are the time to replace it. Now and then, peroxide for 10 minutes.</li>\n<li><b>Sponges:</b> squeeze out and stand upright. Replace every week or two, or switch to a dish brush and cloths that can go through the wash. Microwaving or boiling helps for a while, then the sponge refills.</li>\n<li><b>Sink:</b> baking soda on a damp brush, rinse, dry. A kettle of hot water down the drain weekly keeps grease moving.</li>\n<li><b>Drains:</b> half a cup of baking soda, a cup of hot water, wait, then more hot water. Leave caustic drain cleaners to Poisons’ list of last resorts.</li>\n</ul>" +
            fix({ rungs: [["r1", "Water"], ["r3", "Baking soda"]], modes: [["habit"]], cost: "Free → $", c: 1,
              steps: [["Free · today", "Boards and sponges stand upright to dry."], ["$ · once", "A wooden dish brush with a replaceable head (about $8) instead of sponges."], ["Free · weekly", "Hot kettle down the drain; washable cloths in the laundry."]],
              add: ["Dish brush and washable cloths instead of sponges"] }) +
            src("Cardinale, M. et al., “Microbiome analysis and confocal microscopy of used kitchen sponges,” <i>Scientific Reports</i> 7 (2017); USDA FSIS, cutting board safety."); } },
          { id: "oven", short: "Stove & oven", title: "Stove, oven and fridge", html: function () { return "<p>Oven cleaners are among the harshest products in most homes: lye that burns skin and fumes that sting lungs. Baking soda does the same job overnight, with patience instead of force.</p>" +
            "<ul>\n<li><b>Oven:</b> spread a thick baking soda paste inside (not on the heating elements), close the door, wait overnight. Wipe out with a damp cloth and a spatula; spritz any white residue with the vinegar spray so it foams loose, then wipe with water.</li>\n<li><b>Stovetop:</b> a warm wet cloth on cooked-on spills for 5 minutes, then soap. Glass tops: a razor scraper held flat, and baking soda.</li>\n<li><b>Fridge:</b> warm water with a spoon of baking soda per liter; dry the shelves. An open jar of baking soda for smells, changed every few months.</li>\n<li><b>Range hood filter:</b> soak in very hot water with dish soap and baking soda for 15 minutes, brush, rinse.</li>\n</ul>" +
            care("Self-cleaning oven cycles heat to around 480 °C and release smoke and fumes. If you run one, open windows and keep birds in another room with the door shut, or skip it for the baking soda method.") +
            fix({ rungs: [["r3", "Baking soda"]], modes: [["habit"]], cost: "Free", c: 0,
              steps: [["Free · tonight", "Baking soda paste in the oven before bed; wipe out in the morning."], ["Free", "Hood filter soak once a month."]],
              add: ["Overnight baking soda oven clean, no oven cleaner"] }) +
            links("<a href=\"#lens-air/smoke/cooking\">Air → Cooking smoke</a> · <a href=\"#lens-air/smoke/nonstick\">Air → Nonstick</a>"); } },
          { id: "bathroom", short: "Bathroom", title: "Bathroom", html: function () { return "<p>The bathroom is where the upper rungs earn their place: hard water leaves scale (vinegar), soap leaves scum (vinegar or baking soda), and the toilet is the one spot where disinfecting is often worth it (peroxide). Moisture is the other thing to move out, and a fan or window does most of that.</p>" +
            "<div class=\"cl-does\">\n<div><b>Sink &amp; mirror <i>Rung 1–2</i></b><p>Water and a microfiber cloth. Soap for toothpaste. Half-vinegar spray for a cloudy mirror.</p></div>\n<div><b>Tub &amp; shower <i>Rung 3–4</i></b><p>Baking soda scrub for the tub. Vinegar spray on glass, wait 10 minutes, wipe. Squeegee daily (1.5).</p></div>\n<div><b>Toilet <i>Rung 3–4</i></b><p>Baking soda and a brush in the bowl. Peroxide on the seat and handle when someone’s been sick. Lid down before flushing.</p></div>\n</div>" +
            home("Pink film around drains and the shower is a harmless bacteria (Serratia) that lives on soap and water. Scrub it off with baking soda and dry the spot; it returns where things stay wet.") +
            care("Black spots that spread across a ceiling or wall, or come back right after cleaning, are mold. Small patches: soap, water and drying. Bigger ones belong in <a href=\"#lens-toxins/living/mold\">Poisons → Mold in the house</a>.") +
            fix({ rungs: [["r3", "Baking soda"], ["r4", "Vinegar · peroxide"]], modes: [["habit"]], cost: "Free", c: 0,
              steps: [["Free · daily", "Fan on or window open during and 20 minutes after showers; squeegee."], ["Free · weekly", "Baking soda in the tub and bowl; vinegar on the glass."], ["Free · when sick", "Peroxide on the seat, handle and taps, wet for 10 minutes."]],
              add: ["Bathroom: fan 20 min after showers, weekly baking soda and vinegar"] }) +
            src("Johns Hopkins Medicine, <i>Serratia</i> in the home; Johnson, D. et al., toilet plume aerosols, <i>American Journal of Infection Control</i> (2013)."); } },
          { id: "floors", short: "Floors & glass", title: "Floors and glass", html: function () { return "<p>Floors are where crawling babies, paws and noses spend their days, and where most house dust ends up. Plain water on a damp microfiber mop is the right rung almost every time. Glass is where water leaves streaks, and a splash of vinegar or a squeegee solves it.</p>" +
            "<ul>\n<li><b>Floors:</b> sweep or vacuum first (dry before wet), then a damp mop with warm water. A few drops of soap for sticky kitchens. Wood: barely damp, never wet.</li>\n<li><b>Glass:</b> the half-vinegar spray and a dry microfiber, or a squeegee and plain water with a drop of soap. Clean on a cloudy day: sun dries the spray before you can wipe it, which leaves streaks.</li>\n<li><b>Paws:</b> a damp cloth by the door for a dog’s feet after walks brings less of the street, and of lawn chemicals, inside.</li>\n</ul>" +
            fix({ rungs: [["r1", "Water"]], modes: [["habit"], ["together"]], cost: "Free → $", c: 1,
              steps: [["Free · today", "Shoes off at the door, and a paw cloth beside it."], ["$ · once", "A flat microfiber mop with washable pads (about $25) replaces bottles of floor cleaner."], ["Together", "Window day on a cloudy morning: kids spray, grown-ups squeegee."]],
              add: ["Shoes off and a paw cloth at the door", ["Flat microfiber mop, water only", "Add the mop"]] }) +
            links("<a href=\"#lens-air/dust/vacuum\">Air → Vacuuming</a> · <a href=\"#lens-toxins/home/dust\">Poisons → Dust</a> · <a href=\"#lens-toxins/pesticides/yard\">Poisons → Yard &amp; home</a>"); } },
          { id: "visitors", short: "Visitors", title: "Visitors on the counter", html: function () { return "<p>A line of ants across the counter is a message: the kitchen is offering food and water, and the ants have left a scent trail so their sisters can find it. Cleaning is how we change the offer. Erase the trail and put the food away, and they go back to foraging outdoors.</p>" +
            "<ul>\n<li>Wipe the whole trail, not just the ants you can see, with the soapy spray (2.1). Soap and vinegar both erase the scent the colony follows.</li>\n<li>Crumbs, sticky jars, the pet food bowl, the compost pail: wipe, lid or move them for a few days.</li>\n<li>Follow the line back to where they come in, and once they’ve moved on, seal the gap with caulk or tape.</li>\n<li>Fruit flies come for the ripest fruit and the drain: fruit in the fridge, compost lidded, the drain flushed with hot water.</li>\n</ul>" +
            kin("Ants turn soil and clean up fallen fruit outdoors. They aren’t trying to bother anyone; our kitchen just happened to meet their needs. Change what it offers and everyone gets what they need.") +
            fix({ rungs: [["r2", "Soap"]], modes: [["now"], ["once"]], cost: "Free", c: 0,
              steps: [["Free · now", "Soapy wipe along the whole trail, and lids on anything sweet."], ["Free", "Companion food bowls picked up between meals, or set in a shallow dish of water."], ["Free · once they’ve gone", "Seal the entry gap."]],
              add: ["Ants: wipe the trail, lid the sweet things, seal the gap"] }) +
            links("<a href=\"#lens-relationships/special/animals\">Emotions &amp; love → Animals</a> · <a href=\"#lens-food/store/pantry\">Food → The pantry</a>") +
            src("University of California IPM, <i>Pest Notes: Ants</i> (Pub. 7411) and <i>Fruit Flies</i>."); } }
        ] },

      /* ===== 4 · Stains ===== */
      { id: "stains", num: 4, kind: "Practice", word: "Stains", sub: "Which stain is which, and what lifts it",
        modes: ["now"],
        lede: "A stain is a question about chemistry. Protein wants cold water, tannin wants warm, grease wants soap, dye wants light or peroxide. Name the stain and the right rung lifts it, usually with nothing stronger than the gentle shelf.",
        mode: "The first five minutes matter more than any product.",
        subs: [
          { id: "soon", short: "Soon, blot, cold", title: "Soon, blot, cold", html: function () { return "<p>Three habits rescue most stains before they set.</p>" +
            "<div class=\"cl-does\">\n<div><b>Soon <i>Minutes</i></b><p>A fresh stain is still sitting on the fibers. A dried one has soaked in and bonded.</p></div>\n<div><b>Blot <i>Don’t rub</i></b><p>Press a cloth on top and lift. Rubbing pushes the stain deeper and spreads it wider.</p></div>\n<div><b>Cold first <i>Then warm</i></b><p>Hot water cooks protein stains into the fabric. Start cold; warm only once you know what it is.</p></div>\n</div>" +
            "<ul>\n<li>Work from the outside of the stain inward, so it doesn’t ring.</li>\n<li>Flush from the back of the fabric, so the stain leaves the way it came.</li>\n<li>Check before the dryer. Dryer heat sets whatever is left; air-dry until it’s gone.</li>\n</ul>" +
            fix({ rungs: [["r1", "Water"]], modes: [["now"]], cost: "Free", c: 0,
              steps: [["Free · now", "Blot, then flush with cold water from the back."], ["Free", "Air-dry stained things until the stain is fully gone."]],
              add: ["Stains: blot, cold water from the back, no dryer until gone"] }) +
            src("University of Illinois Extension, <i>Stain Solutions</i>; American Cleaning Institute, stain removal guide."); } },
          { id: "protein", short: "Protein", title: "Protein stains", html: function () { return "<p>Blood, sweat, vomit, spit-up, mucus, urine and grass (partly) are made of protein. Heat makes protein stick, like an egg turning white in a pan. Cold water and patience lift it.</p>" +
            "<ol>\n<li>Rinse under cold running water from the back.</li>\n<li>Soak in cold water with a little soap for 30 minutes to a few hours.</li>\n<li>Still there? On white or light fabric, a few drops of 3% peroxide fizz blood away. Test colors first.</li>\n<li>An enzyme laundry detergent (it digests protein) for anything stubborn, then a normal wash.</li>\n</ol>" +
            home("Your own saliva lifts a small fresh drop of your own blood: its enzymes start digesting it. A good trick for a paper cut on a favorite shirt.") +
            fix({ rungs: [["r1", "Water"], ["r4", "Peroxide"]], modes: [["now"]], cost: "Free", c: 0,
              steps: [["Free · now", "Cold rinse, cold soak with soap."], ["Free", "Peroxide drops on light fabrics, rinsed after."]],
              add: ["Protein stains: cold soak, then peroxide on light fabrics"] }); } },
          { id: "tannins", short: "Tannins & dyes", title: "Tannins and dyes", html: function () { return "<p>Coffee, tea, red wine, juice, berries, tomato sauce, turmeric, beet and grass carry plant pigments and tannins. Unlike protein, these come out better with warm water and a little acid or oxidizer. Sunlight is one of the strongest tools there is for them, and it’s free.</p>" +
            "<ul>\n<li><b>Coffee, tea, juice, wine:</b> blot, flush with cool then warm water, a drop of dish soap rubbed in, rinse. A little vinegar in the rinse helps.</li>\n<li><b>Berries and beet:</b> stretch the fabric over a bowl and pour boiling water through from a height (cotton and linen only). Peroxide on whites.</li>\n<li><b>Turmeric and curry:</b> soap and a rinse, then lay it in direct sun for a few hours, damp. UV fades turmeric remarkably fast.</li>\n<li><b>Grass:</b> rub in dish soap, rinse warm, then a little vinegar or peroxide on light fabric.</li>\n</ul>" +
            together("Turmeric-in-the-sun is a fine thing to try with a child: check the stain every hour and watch it fade.") +
            fix({ rungs: [["r2", "Soap"], ["r4", "Vinegar · peroxide"]], modes: [["now"], ["together"]], cost: "Free", c: 0,
              steps: [["Free · now", "Blot, soap, warm rinse."], ["Free", "Leftover color: damp, in direct sun, a few hours."]],
              add: ["Plant stains: soap, warm rinse, then sun"] }); } },
          { id: "grease", short: "Grease", title: "Grease and oil", html: function () { return "<p>Cooking oil, nut butter, salad dressing, lip balm and avocado leave a darker, see-through patch. Water slides over them, so this is rung 2’s job: soap. A powder first can pull most of the oil out before it spreads.</p>" +
            "<ol>\n<li>Scrape or blot off what you can.</li>\n<li>Sprinkle baking soda or cornstarch on top; wait 15 minutes to soak the oil up; brush off.</li>\n<li>Rub a drop of dish soap in with your fingers; leave it 10 minutes.</li>\n<li>Wash in the warmest water the fabric allows, and air-dry to check.</li>\n</ol>" +
            fix({ rungs: [["r3", "Baking soda"], ["r2", "Soap"]], modes: [["now"]], cost: "Free", c: 0,
              steps: [["Free · now", "Powder to soak up, dish soap rubbed in, warm wash."]],
              add: ["Grease stains: powder, dish soap, warm wash"] }); } },
          { id: "accidents", short: "Accidents", title: "Companion animal accidents", html: function () { return "<p>When a cat, dog or rabbit pees outside the box or yard, the cleanup is half the answer. If any scent is left, their sensitive noses read it as “this is the spot” and come back. The other half is the need behind it: a box that needs cleaning or moving, a door they couldn’t reach, a new stress, or a body that’s unwell.</p>" +
            "<ol>\n<li>Blot up as much as you can with paper towels; stand on them to press it out of carpet.</li>\n<li>Flush with cold water and blot again.</li>\n<li>An enzyme cleaner made for animal accidents breaks down the scent fully. Soak the spot as deep as the urine went and let it dry slowly, covered loosely.</li>\n<li>No enzyme cleaner? Half-vinegar spray, blot, then baking soda sprinkled on top overnight and vacuumed.</li>\n</ol>" +
            care("Skip ammonia-based cleaners for accidents: urine contains ammonia, so they can smell like an invitation. And never bleach over urine; the two make chloramine gas.") +
            kin("A sudden change in where someone pees, straining, or blood in the urine is a reason to see a vet soon, cats especially. A male cat who can’t pee is an emergency.") +
            fix({ rungs: [["r1", "Water"], ["r4", "Vinegar"]], modes: [["now"]], cost: "Free → $", c: 1,
              steps: [["Free · now", "Blot, flush cold, blot again."], ["$", "An unscented enzyme cleaner (about $10–$15) on the shelf."], ["Free", "Ask what changed: the box, the door, the routine, their body."]],
              add: ["Unscented enzyme cleaner for animal accidents"] }) +
            links("<a href=\"#lens-relationships/special/family\">Emotions &amp; love → Family animals</a>") +
            src("ASPCA, <i>Cat House Soiling</i> and <i>Urine Marking in Dogs</i>; Cornell Feline Health Center, house soiling."); } },
          { id: "rust", short: "Rust, ink, wax", title: "Rust, ink and wax", html: function () { return "<div class=\"cl-does\">\n<div><b>Rust <i>Acid</i></b><p>Lemon juice and salt on the spot, an hour in the sun, rinse. Not on silk or wool.</p></div>\n<div><b>Ballpoint ink <i>Alcohol</i></b><p>Dab with rubbing alcohol on a cloth underneath, blotting from the back. Ventilate; keep it away from flames.</p></div>\n<div><b>Candle wax <i>Cold, then warm</i></b><p>Freeze or ice it and pick it off. Then a paper bag over the rest and a warm iron to lift it into the paper.</p></div>\n<div><b>Gum and sticker glue <i>Oil</i></b><p>A little cooking oil loosens it; then dish soap to lift the oil (4.4).</p></div>\n</div>" +
            fix({ rungs: [["r4", "Acid"]], modes: [["now"]], cost: "Free", c: 0,
              steps: [["Free", "Match the stain to its helper above; test on a hidden seam first."]],
              add: ["Rust: lemon, salt and sun"] }); } },
          { id: 'finder', tool: true, short: 'Stain finder', title: 'Stain finder', html: finderHtml }
        ] },

      /* ===== 5 · Laundry ===== */
      { id: "laundry", num: 5, kind: "Practice", word: "Laundry", sub: "Gentler on fabric, skin, water and the bill",
        modes: ["habit", "once"],
        lede: "Most loads need less than the cap says, colder water than the dial suggests, and no scent at all. Clothes last longer, skin calms down, and the water leaving the house carries less. Sun and a line finish the job for free.",
        mode: "Small changes each load. A line, a filter bag, dryer balls.",
        subs: [
          { id: "detergent", short: "Less detergent", title: "Less detergent, no fragrance", html: function () { return "<p>Modern detergents are concentrated, and most people use two or three times what a load needs. The extra doesn’t rinse out: it stays in fabric, stiffens towels, holds smells and rubs against skin all day. Fragrance is the part most likely to irritate skin and lungs, and it’s added on purpose to cling.</p>" +
            "<ul>\n<li>Start at half the cap line. If clothes come out clean, try less next time.</li>\n<li>“Free and clear” or “fragrance-free” detergents skip the scent; “unscented” can still mean a masking fragrance.</li>\n<li>Soft water needs even less. Very hard water: a tablespoon of washing soda helps the detergent work.</li>\n</ul>" +
            ca("California’s Cleaning Product Right to Know Act requires cleaning products, laundry detergents included, to list their ingredients, including fragrance allergens: online since 2020 and on the label since 2021.") +
            fix({ modes: [["habit"]], cost: "Free", c: 0,
              steps: [["Free · next load", "Half the detergent; mark the new line on the cap with a marker."], ["As it runs out", "Swap to a fragrance-free detergent."]],
              add: ["Half the detergent, fragrance-free when it runs out"] }) +
            links("<a href=\"#lens-toxins/home/fragrance\">Poisons → Fragrance</a>") +
            src("California Cleaning Product Right to Know Act of 2017 (SB 258); American Academy of Dermatology, fragrance and contact dermatitis."); } },
          { id: "cold", short: "Cold", title: "Cold most of the time", html: function () { return "<p>About 90% of the energy a washing machine uses goes to heating water. Today’s detergents are made to work in cold, and cold water is gentler on colors, elastic and shrink-prone fabric.</p>" +
            "<div class=\"cl-does\">\n<div><b>Cold <i>Most loads</i></b><p>Everyday clothes, colors, darks, anything with a protein stain.</p></div>\n<div><b>Warm <i>Some</i></b><p>Greasy kitchen towels, very dirty work clothes.</p></div>\n<div><b>Hot <i>When it counts</i></b><p>Sheets and towels after illness, cloth diapers, companion bedding after a sick day.</p></div>\n</div>" +
            fix({ modes: [["habit"]], cost: "Free", c: 0,
              steps: [["Free · next load", "Set the dial to cold and leave it there; switch up only for sickness, diapers and bedding."]],
              add: ["Cold wash by default; hot only when it counts"] }) +
            src("ENERGY STAR, clothes washers (share of energy used to heat water)."); } },
          { id: "sun", short: "Sun & line", title: "Sun and line drying", html: function () { return "<p>A clothes dryer is one of the bigger energy users in a home. A line or rack does the same job for free, and sun does more: its UV light fades stains, brightens whites and helps clear odors and microbes. Clothes last longer too; dryer lint is your clothes, a little at a time.</p>" +
            "<ul>\n<li>Whites and diapers in direct sun; darks inside out or in shade so they don’t fade.</li>\n<li>A shake and a snap before hanging means fewer wrinkles.</li>\n<li>A folding rack indoors works too, and adds welcome moisture to dry winter air.</li>\n</ul>" +
            ca("California’s Civil Code §1940.20 lets renters use a clothesline or drying rack in their private yard or balcony area, with some conditions, and HOAs can’t ban them in a backyard (Civil Code §4750.10).") +
            fix({ modes: [["once"], ["together"]], cost: "$", c: 1,
              steps: [["$ · once", "A folding rack (about $25) or line and pins."], ["Together", "Hanging and pairing socks is a great job for kids: color sorting, counting, pinching pins."]],
              add: ["A drying rack or clothesline"] }) +
            links("<a href=\"#lens-air/ventilation/damp\">Air → Damp air</a> (racks indoors in humid weather: a window open)"); } },
          { id: "swaps", short: "Swaps", title: "Softeners and swaps", html: function () { return "<p>Fabric softeners and dryer sheets coat fibers with a waxy film, usually carrying fragrance. The coating makes towels and microfiber less absorbent, can make some fabrics more flammable, and is the opposite of what a clean load is for.</p>" +
            "<div class=\"cl-does\">\n<div><b>Wool dryer balls <i>Instead of sheets</i></b><p>Soften by tumbling and cut drying time. Last for years.</p></div>\n<div><b>Less detergent <i>Instead of softener</i></b><p>Stiff towels are usually leftover detergent (5.1), not a missing softener.</p></div>\n<div><b>A little vinegar <i>Now and then</i></b><p>A quarter cup in the rinse for towels that smell. Check your washer’s manual: some makers advise against it often, for the seals.</p></div>\n</div>" +
            fix({ modes: [["once"]], cost: "$", c: 1,
              steps: [["Free · today", "Use up or pass on the dryer sheets, and don’t replace them."], ["$ · once", "Three wool dryer balls (about $10)."]],
              add: ["Wool dryer balls instead of softener and sheets"] }) +
            src("US Consumer Product Safety Commission, fabric softener and flammability of fleece; Steinemann, A., fragranced laundry products (2011, <i>Environmental Impact Assessment Review</i>)."); } },
          { id: "microfibers", short: "Microfibers", title: "Microfibers in the wash", html: function () { return "<p>Polyester, fleece, nylon and microfiber cloths shed tiny plastic threads every wash. Water treatment plants catch some; the rest reach rivers and the sea, where fish and seabirds swallow them. A few habits cut what leaves the machine.</p>" +
            "<ul>\n<li>Fuller loads, cold water and shorter, gentler cycles shed less.</li>\n<li>Front-loaders shed noticeably less than top-loaders with an agitator.</li>\n<li>A filter wash bag for fleece and microfiber cloths catches the threads; empty the lint into the trash, not the sink.</li>\n<li>Natural fibers (cotton, linen, wool, hemp) when you’re replacing things anyway.</li>\n</ul>" +
            ca("California’s AB 1628 (2023) requires new washing machines sold in the state to have a microfiber filter starting in 2029.") +
            fix({ modes: [["once"], ["habit"]], cost: "$", c: 1,
              steps: [["Free", "Full, cold, gentle loads."], ["$ · once", "A microfiber filter wash bag (about $30) for synthetics and cleaning cloths."]],
              add: ["Filter wash bag for fleece and microfiber cloths"] }) +
            links("<a href=\"#lens-toxins/plastics/what\">Poisons → Plastics</a>") +
            src("California AB 1628 (McKinnor, 2023); Napper & Thompson, <i>Marine Pollution Bulletin</i> 112 (2016); Hartline et al., <i>Environmental Science &amp; Technology</i> 50 (2016)."); } },
          { id: "byhand", short: "No machine", title: "Without a machine", html: function () { return "<p>Washing by hand is how most people have always done laundry, and it works. Agitation is the machine’s main job, and a bucket, a plunger and a little time replace it.</p>" +
            "<ol>\n<li>A bucket with a lid, a teaspoon of soap, cold water, clothes. Soak 20 minutes.</li>\n<li>Agitate 2–3 minutes with a clean plunger through a hole in the lid, or swish and squeeze by hand.</li>\n<li>Wring, refill with clean water, rinse, wring again. Roll heavy things in a towel and stand on it.</li>\n<li>Hang to dry in sun or air.</li>\n</ol>" +
            accs(
              acc("laundromat", "Laundromat or shared", "Shared machines", "<ul><li>Bring your own fragrance-free detergent; shared machines carry the last person’s scent, and a quick empty rinse cycle clears it.</li><li>Fewer, fuller loads saves quarters. Dry at home on a rack to halve the cost.</li><li>Many laundromats offer free or discounted days for neighbors in need; libraries and mutual aid groups often know which.</li></ul>"),
              acc("portable", "On the move", "Vehicle, boat or no fixed place", "<ul><li>A 5-gallon bucket with a lid does wash and storage; a dry bag with water and soap, rolled and squeezed, works in a small space.</li><li>Quick-dry fabrics and a few clothespins on a line inside a car or under a tarp.</li><li>Wash water with only plain soap can go on dirt away from creeks, at least 200 feet from water.</li></ul><p class=\"links\"><a href=\"#lens-water/uses\">Water → Uses (gray water)</a></p>"),
              acc("kids", "Little ones", "Cloth diapers and baby clothes", "<p>Diapers: a cold rinse, then a hot wash with detergent, then sun. Baby clothes: fragrance-free detergent, the same as everyone else’s. No special baby detergent needed.</p>"),
              acc("animals", "Companions", "Beds, blankets and harnesses", "<p>Shake or vacuum fur off first; it clogs drains and machines. Hot wash for beds after illness, fragrance-free always (noses do the noticing). A wet cloth or rubber glove pulls fur off fabric before a wash.</p>")) +
            fix({ modes: [["once"], ["together"]], cost: "$", c: 1,
              steps: [["$ · once", "A lidded bucket and a new plunger, kept just for laundry (about $20)."], ["Together", "Stomping laundry in a tub, feet clean and pants rolled, is how many kids learn it’s fun."]],
              add: ["Bucket-and-plunger hand wash kit"] }) +
            src("Leave No Trace, dispose of waste properly (wash water 200 feet from water sources)."); } }
        ] }
    ];
  }

  /* ---------- My list: every "How to fix" can be added; one by one, reorderable ---------- */
  var list = (function () { try { var a = JSON.parse(localStorage.getItem(LKEY) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } })();
  function saveList() { try { localStorage.setItem(LKEY, JSON.stringify(list)); } catch (e) { mn().toast('Couldn’t save: this browser is blocking site storage'); } }
  function has(t) { return list.some(function (x) { return x.title === t; }); }
  function addItem(it) { if (has(it.title)) return false; it.s = 'next'; list.push(it); return true; }
  function openCount() { return list.filter(function (x) { return x.s !== 'done'; }).length; }
  function pairs(m, fn) { return (m || '').split('|').filter(Boolean).map(function (x) { var p = x.split(':'); return fn(p[0], p.slice(1).join(':')); }).join(''); }
  var LABEL = { next: 'Next', doing: 'Doing', done: 'Done' }, NEXT = { next: 'doing', doing: 'done', done: 'next' };
  function syncUi() {
    document.querySelectorAll('.cl-add[data-title]').forEach(function (b) {
      var on = has(b.getAttribute('data-title'));
      b.classList.toggle('on', on); b.textContent = on ? 'On my list' : b.getAttribute('data-label');
      b.setAttribute('aria-pressed', String(on));
    });
    var c = $('cl-cnt'); if (c) c.textContent = openCount();
    renderList();
  }
  function renderList() {
    var el = $('cl-lst'); if (!el) return;
    $('cl-empty').hidden = list.length > 0;
    el.innerHTML = list.map(function (x, i) {
      var u = UIDX[x.u], n = NUM[x.u + '/' + x.sub];
      return '<li class="ck' + (u ? u.num : 1) + (x.s === 'done' ? ' done' : '') + '"><span class="cl-num">' + (i + 1) + '</span>' +
        '<span class="cl-lt"><b>' + esc(x.title) + '</b><span>' + pairs(x.r, rung) + pairs(x.m, mode) + '<span class="cl-cost">' + COST[x.c || 0] + '</span>' +
        (u && n ? '<small><a href="' + BASE + '/' + x.u + '/' + x.sub + '">' + u.word + ' ' + n + '</a></small>' : '') + '</span></span>' +
        '<span class="cl-lctl"><button type="button" class="cl-st" data-cl="st" data-i="' + i + '" data-s="' + x.s + '">' + LABEL[x.s] + '</button>' +
        '<span class="cl-mv"><button type="button" data-cl="up" data-i="' + i + '" aria-label="Move up">▲</button><button type="button" data-cl="down" data-i="' + i + '" aria-label="Move down">▼</button></span></span></li>';
    }).join('');
    var done = list.length - openCount();
    $('cl-bar').style.width = list.length ? (done / list.length * 100) + '%' : '0';
    $('cl-sum').textContent = list.length ? done + ' of ' + list.length + ' done · ' + list.filter(function (x) { return x.s === 'doing'; }).length + ' in progress' : '';
  }
  /* Tools add fixes by title. Each title maps to the card it comes from, so My list can link back to it. */
  var FIXES = {};
  function indexFixes(U) {
    U.forEach(function (u) {
      u.subs.forEach(function (s) {
        if (s.tool) return;
        CUR = { u: u.id, s: s.id };
        var h = s.html(), re = /data-title="([^"]*)"[^>]*data-u="([^"]*)" data-s="([^"]*)" data-c="([^"]*)" data-m="([^"]*)" data-r="([^"]*)"/g, m;
        while ((m = re.exec(h))) FIXES[m[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"')] = { u: m[2], sub: m[3], c: +m[4] || 0, m: m[5], r: m[6] };
      });
    });
  }
  function addByTitle(title) {
    if (has(title)) return false;
    var f = FIXES[title] || {};
    return addItem({ title: title, u: f.u || '', sub: f.sub || '', c: f.c || 0, m: f.m || '', r: f.r || '' });
  }

  /* ---------- Tool: What needs cleaning? Surface × mess → the lowest rung that works. A shortcut, never a gate. ---------- */
  var RUNG = { 1: ['r1', 'Water'], 2: ['r2', 'Soap'], 3: ['r3', 'Baking soda'], 4: ['r4', 'Vinegar'], 5: ['r4', 'Peroxide'], 9: ['r5', 'Beyond'] };
  var SURF = [['counter', 'Kitchen counter'], ['table', 'Table or high chair'], ['board', 'Cutting board'], ['stove', 'Stovetop'], ['oven', 'Oven'], ['sink', 'Sink or faucet'], ['shower', 'Tub, shower or glass door'], ['toilet', 'Toilet'], ['floor', 'Floor'], ['glass', 'Window or mirror'], ['carpet', 'Rug, carpet or couch'], ['toys', 'Toys or teethers']];
  var MESS = [['every', 'Crumbs, everyday spills'], ['sticky', 'Dried or stuck-on'], ['grease', 'Greasy'], ['scale', 'White crust or cloudy'], ['smell', 'A smell'], ['sick', 'Someone’s been sick'], ['accident', 'A companion’s accident'], ['mold', 'Black or fuzzy spots'], ['droppings', 'Mouse or rat droppings'], ['spill', 'A chemical spill or broken thermometer']];
  var wn = { s: '', m: '' };
  var TOX_CLEAN = ['#lens-toxins/home/cleaners', 'Poisons: Cleaning products'];
  function plan(s, m) {
    var P = { steps: [], notes: [], link: null, add: '', beyond: false };
    function st(r, txt) { P.steps.push([r, txt]); }
    var acidOK = !(s === 'counter' && T.stone) && s !== 'floor';
    if (m === 'droppings') { P.beyond = true; st(9, 'Don’t sweep or vacuum: that lifts hantavirus into the air. Open windows for 30 minutes, gloves on, then follow the wet-cleaning steps in Poisons.'); P.link = TOX_CLEAN; P.notes.push('Once it’s clean, close the gap they came through, so the mice find their food and shelter outdoors again.'); return P; }
    if (m === 'spill') { P.beyond = true; st(9, 'Everyone out of the room, animals too, and a window open. Don’t vacuum mercury beads or a broken bulb. Call Poison Control at 1-800-222-1222 for what to do next.'); P.link = TOX_CLEAN; return P; }
    if (m === 'mold') {
      st(2, 'A small patch (smaller than about 3 × 3 ft): soap and water, scrub, then dry fully. Find the water that fed it.');
      st(9, 'Bigger than that, coming back, or on something porous that stayed wet: Poisons has the plan.');
      P.link = ['#lens-toxins/living/mold', 'Poisons: Mold in the house']; P.add = 'Bathroom: fan 20 min after showers, weekly baking soda and vinegar'; return P;
    }
    if (m === 'accident') {
      st(1, 'Blot up as much as you can, then flush with cold water and blot again.');
      st(4, 'An enzyme cleaner, or the half-vinegar spray, then baking soda overnight and vacuum.');
      P.notes.push('No ammonia or bleach on urine. And a change in habits is worth a look at the need behind it.');
      P.link = [BASE + '/stains/accidents', NUM['stains/accidents'] + ' Companion animal accidents']; P.add = 'Unscented enzyme cleaner for animal accidents'; return P;
    }
    if (m === 'sick') {
      st(1, 'Gloves on. Paper towels first to lift it all up; bag it.');
      st(2, 'Clean with soap and water: disinfecting a dirty surface barely works.');
      if (s === 'carpet') st(3, 'Baking soda on the damp spot to soak up what’s left and the smell; vacuum when dry.');
      else st(5, '3% peroxide, left wet 5–10 minutes, then a water wipe' + (s === 'toys' ? ' and a rinse before little mouths find them again.' : '.'));
      st(9, 'A stomach bug passing through the house (vomiting or diarrhea in more than one person)? Norovirus outlasts gentle cleaners. Poisons has when bleach earns its place, and how to use it safely.');
      P.link = [BASE + '/water/lifts', NUM['water/lifts'] + ' Cleaning lifts, it doesn’t kill']; P.add = 'Spray top on the brown peroxide bottle, for when it counts'; return P;
    }
    if (m === 'every') { st(1, s === 'toilet' ? 'Baking soda and the brush in the bowl; a water cloth on the seat and handle.' : s === 'carpet' ? 'Vacuum, or blot a spill with a cold damp cloth.' : 'A warm, damp cloth, then dry. That’s it.'); P.add = s === 'floor' ? 'Flat microfiber mop, water only' : 'Counters: warm cloth, then dry, after cooking'; }
    if (m === 'sticky') {
      if (s === 'oven') { st(3, 'Baking soda paste (3 parts soda, 1 water) inside, overnight. Wipe out in the morning; a spritz of vinegar foams off any white film.'); P.add = 'Overnight baking soda oven clean, no oven cleaner'; }
      else { st(1, 'Lay a hot wet cloth on it for 5 minutes. Then wipe; most of it lifts.'); st(3, 'Still there? A little baking soda on the damp cloth, gently.'); P.add = 'Soak first: warm cloth on spills, pans soak while we eat'; }
    }
    if (m === 'grease') { st(1, 'Warm water to soften it.'); st(2, 'A few drops of dish or castile soap on the cloth, then a water wipe so no film stays.'); if (s === 'oven' || s === 'stove') st(3, 'Cooked-on grease: baking soda paste, wait 15 minutes, scrub.'); P.add = 'Make a labeled soap-and-water kitchen spray'; }
    if (m === 'scale') {
      if (acidOK && s !== 'carpet') { st(1, 'Wipe off loose dirt first.'); st(4, s === 'sink' ? 'A cloth soaked in white vinegar wrapped around the faucet for 30 minutes, then wipe and rinse.' : 'Half-vinegar spray, wait 10 minutes, wipe, rinse with water.'); P.add = 'Labeled half-vinegar spray for glass and scale'; }
      else { st(3, 'Acid would etch this surface. A soft baking soda paste, gently, and a water rinse.'); P.notes.push(T.stone && s === 'counter' ? 'Your counters are acid-sensitive stone, so the ladder stops at rung 3 here.' : 'Floors and grout dislike vinegar; this stays gentle.'); }
      P.link = [BASE + '/shelf/vinegar', NUM['shelf/vinegar'] + ' Vinegar for scale'];
    }
    if (m === 'smell') { st(1, 'Find the source and wash it out; a smell is usually something damp.'); st(3, s === 'carpet' ? 'Baking soda sprinkled on, an hour or overnight, then vacuum.' : 'Baking soda paste or an open jar of it nearby.'); P.notes.push('Skip sprays and air fresheners: they cover a smell with another one.'); P.link = [BASE + '/shelf/soda', NUM['shelf/soda'] + ' Baking soda to scrub']; P.add = 'A lidded jar of baking soda on the shelf'; }
    if (s === 'board' && (m === 'every' || m === 'grease' || m === 'sticky')) st(1, 'Stand it upright to dry. Now and then, peroxide for 10 minutes.');
    if (!P.link) {
      var L = { counter: 'surfaces/counters', table: 'water/together', board: 'surfaces/boards', stove: 'surfaces/oven', oven: 'surfaces/oven', sink: 'surfaces/boards', shower: 'surfaces/bathroom', toilet: 'surfaces/bathroom', floor: 'surfaces/floors', glass: 'surfaces/floors', carpet: 'stains/soon', toys: 'shelf/mouths' }[s];
      var sub = UIDX[L.split('/')[0]].subs.filter(function (x) { return x.id === L.split('/')[1]; })[0];
      P.link = [BASE + '/' + L, NUM[L] + ' ' + sub.title];
    }
    return P;
  }
  function picks(id, arr, key) {
    var el = $(id); if (!el || el.innerHTML) return;
    el.innerHTML = arr.map(function (r) { return '<button type="button" class="cl-pick" data-cl="wn" data-key="' + key + '" data-v="' + r[0] + '" aria-pressed="' + (wn[key] === r[0]) + '">' + esc(r[1]) + '</button>'; }).join('');
  }
  function runNeeds() {
    var out = $('cl-wn-out'); if (!out) return;
    picks('cl-wn-s', SURF, 's'); picks('cl-wn-m', MESS, 'm');
    if (!wn.s || !wn.m) { out.innerHTML = '<small>Pick one of each. Most answers stop at water.</small>'; return; }
    var P = plan(wn.s, wn.m);
    var top = P.steps.reduce(function (a, b) { return b[0] === 9 ? a : Math.max(a, b[0]); }, 0);
    var head = P.beyond ? 'This one is beyond the ladder' : top <= 1 ? 'Water does it' : 'Climb to ' + RUNG[top][1].toLowerCase() + ', no further';
    var notes = P.notes.slice();
    if (T.cats && P.steps.some(function (x) { return x[0] >= 4; })) notes.push('With a cat: rinse or dry the spot before paws walk through, and keep any essential-oil cleaners off the shelf.');
    if (T.birds) notes.push('With birds: pour onto a cloth rather than spraying, and clean with a window open while he or she is in another room.');
    if (T.kids && P.steps.some(function (x) { return x[0] >= 3; })) notes.push('With kids: they can do the water steps alongside you. Bottles back up high when you’re done.');
    out.innerHTML = '<strong>' + esc(head) + '</strong>' + P.steps.map(function (x, i) {
      var r = RUNG[x[0]];
      return '<div class="cl-rn-card' + (x[0] === 9 ? ' urgent' : '') + '"><span class="cl-row cl-tight"><span class="eyebrow">Step ' + (i + 1) + '</span>' + rung(r[0], r[1]) + '</span><span>' + esc(x[1]) + '</span></div>';
    }).join('') + (notes.length ? '<ul>' + notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>' : '') +
      '<span class="cl-row">' + (P.link ? '<a class="btn" href="' + P.link[0] + '">Learn more: ' + esc(P.link[1]) + '</a>' : '') + (P.add ? '<button type="button" class="btn" data-cl="wn-add" data-t="' + esc(P.add) + '">' + (has(P.add) ? 'On my list' : '+ Add the fix') + '</button>' : '') + '</span>';
  }

  /* ---------- Tool: Stain finder ---------- */
  // [id, label, kind, sub-unit id]
  var STAINS = [['blood', 'Blood', 'protein', 'protein'], ['sweat', 'Sweat or deodorant marks', 'protein', 'protein'], ['vomit', 'Vomit or spit-up', 'protein', 'protein'], ['urine', 'Urine (anyone’s)', 'urine', 'accidents'], ['mud', 'Mud', 'mud', 'soon'],
    ['coffee', 'Coffee or tea', 'tannin', 'tannins'], ['wine', 'Red wine or juice', 'tannin', 'tannins'], ['berry', 'Berries or beet', 'dye', 'tannins'], ['tomato', 'Tomato sauce', 'dye', 'tannins'], ['turmeric', 'Turmeric or curry', 'turmeric', 'tannins'], ['grass', 'Grass', 'grass', 'tannins'],
    ['oil', 'Cooking oil, nut butter or dressing', 'grease', 'grease'], ['makeup', 'Makeup or lip balm', 'grease', 'grease'], ['rust', 'Rust', 'rust', 'rust'], ['ink', 'Ballpoint ink', 'ink', 'rust'], ['wax', 'Candle wax', 'wax', 'rust'], ['gum', 'Gum or sticker glue', 'gum', 'rust']];
  function runFinder() {
    var out = $('cl-sf-out'); if (!out) return;
    var sel = $('cl-sf-stain');
    if (!sel.options.length) sel.innerHTML = STAINS.map(function (x) { return '<option value="' + x[0] + '">' + esc(x[1]) + '</option>'; }).join('');
    var st = STAINS.filter(function (x) { return x[0] === sel.value; })[0] || STAINS[0], on = $('cl-sf-on').value, light = $('cl-sf-color').value === 'light';
    var del = on === 'delicate', carpet = on === 'carpet', steps = [], tips = [];
    var peroxOK = light && !del;
    steps.push(carpet ? 'Blot with a cold damp cloth, pressing, not rubbing. Work from the outside in.' : 'Blot, then flush with cold water from the back of the fabric.');
    switch (st[2]) {
      case 'protein': steps.push(carpet ? 'Dab with cold water and a drop of soap; blot dry.' : 'Soak in cold water with a little soap, 30 minutes or more.'); steps.push(peroxOK ? 'Still there? A few drops of 3% peroxide, let it fizz, rinse.' : 'Still there? An enzyme detergent rubbed in, then a cold wash.'); tips.push('Cold only until it’s gone. Heat sets protein.'); break;
      case 'urine': steps.push('An enzyme cleaner, soaked as deep as it went, or half-vinegar spray then baking soda overnight.'); tips.push('No ammonia or bleach on urine.'); break;
      case 'mud': steps = ['Let it dry completely, then brush or vacuum off the dry dirt.', 'Rub in a drop of soap and wash cold.']; break;
      case 'tannin': steps.push('A drop of dish soap rubbed in, then a warm rinse' + (del ? ' (lukewarm for wool or silk)' : '') + '.'); steps.push('A splash of vinegar in the rinse helps lift what’s left.'); if (peroxOK) steps.push('Whites: a little peroxide on the last trace.'); break;
      case 'dye': steps.push(!del && !carpet && on === 'wash' ? 'Stretch over a bowl and pour boiling water through from a height.' : 'A drop of dish soap, then lukewarm water, blotting.'); if (peroxOK) steps.push('A little peroxide on whites, rinsed.'); if (light && !carpet) steps.push('Damp, in direct sun, for a few hours.'); break;
      case 'turmeric': steps.push('Dish soap rubbed in, rinse.'); steps.push(carpet ? 'Open the curtains: sunlight on the spot for a few afternoons fades it.' : light ? 'Lay it damp in direct sun for a few hours. UV fades turmeric fast.' : 'A little vinegar in a warm rinse; colors may need a few washes.'); break;
      case 'grass': steps.push('Rub in dish soap, rinse warm.'); steps.push(peroxOK ? 'A dab of peroxide on what’s left, rinsed.' : 'A little vinegar dabbed on, rinsed.'); break;
      case 'grease': steps = ['Scrape or blot what you can; no water yet.', 'Baking soda or cornstarch on top for 15 minutes; brush off.', 'A drop of dish soap rubbed in, 10 minutes, then ' + (carpet ? 'blot with warm water.' : 'the warmest wash the fabric allows.')]; break;
      case 'rust': steps.push(del ? 'Wool and silk dislike acid: take rust on these to a cleaner, or dab very lightly and rinse.' : 'Lemon juice and salt on the spot, an hour in the sun, rinse.'); break;
      case 'ink': steps.push('Rubbing alcohol on a cloth, dabbed from the back with a towel underneath; window open, no flames.'); steps.push('Then soap and a cold wash.'); break;
      case 'wax': steps = ['Ice it until it’s hard; pick off what you can.', 'A paper bag over the rest and a warm iron: the wax melts into the paper.', 'Any oily mark left: dish soap, as with grease.']; break;
      case 'gum': steps = ['Ice it hard and pick it off, or loosen with a little cooking oil.', 'Dish soap to lift the oil, then wash.']; break;
    }
    if (del) tips.push('Wool and silk: lukewarm water, no peroxide, no boiling water, and lay flat to dry.');
    if (!light) tips.push('Colors and darks: skip peroxide and long sun; test anything on a hidden seam.');
    tips.push('Air-dry and check before any dryer.');
    out.innerHTML = '<strong>' + esc(st[1]) + '</strong><ol>' + steps.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol><small>' + tips.map(esc).join(' ') + '</small>' +
      '<span class="cl-row"><a class="btn" href="' + BASE + '/stains/' + st[3] + '">Learn more: ' + NUM['stains/' + st[3]] + '</a></span>';
  }
  /* Your counter's row in 3.1 lights up. */
  function markCounter() {
    var tb = $('cl-counters'); if (!tb) return;
    var c = prof().counter || '';
    tb.querySelectorAll('tr[data-c]').forEach(function (tr) { tr.classList.toggle('mine', tr.getAttribute('data-c') === c); });
    var note = tb.parentNode.parentNode.querySelector('.cl-counter-note');
    if (note) note.innerHTML = c && c !== 'Not sure' ? 'Your counters: <b>' + esc(c) + '</b>. That row is highlighted.' : 'Add your counters in <a href="#profile/cleaning">Profile → Cleaning</a> and that row lights up.';
  }
  function runTools() { runNeeds(); runFinder(); markCounter(); syncUi(); }

  /* ---------- events (delegated; views re-render on every route) ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-cl]'); if (!b) return;
    var a = b.getAttribute('data-cl'), i = +b.getAttribute('data-i');
    if (a === 'add') {
      var t = b.getAttribute('data-title');
      if (has(t)) { list = list.filter(function (x) { return x.title !== t; }); mn().toast('Taken off My list'); }
      else { addItem({ title: t, u: b.getAttribute('data-u'), sub: b.getAttribute('data-s'), c: +b.getAttribute('data-c') || 0, m: b.getAttribute('data-m'), r: b.getAttribute('data-r') }); mn().toast('Added to My list · ' + openCount()); }
    } else if (a === 'st') { list[i].s = NEXT[list[i].s]; if (list[i].s === 'done') mn().toast('Done. One less bottle, one more clean counter.'); }
    else if (a === 'up' && i > 0) list.splice(i - 1, 0, list.splice(i, 1)[0]);
    else if (a === 'down' && i < list.length - 1) list.splice(i + 1, 0, list.splice(i, 1)[0]);
    else if (a === 'sort') list.sort(function (x, y) { return (x.s === 'done') - (y.s === 'done') || (x.c || 0) - (y.c || 0); });
    else if (a === 'clear') list = list.filter(function (x) { return x.s !== 'done'; });
    else if (a === 'wn') {
      var k = b.getAttribute('data-key'), v = b.getAttribute('data-v');
      wn[k] = wn[k] === v ? '' : v;
      b.parentNode.querySelectorAll('.cl-pick').forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-v') === wn[k])); });
      runNeeds(); return;
    } else if (a === 'wn-add') {
      mn().toast(addByTitle(b.getAttribute('data-t')) ? 'Added to My list · ' + openCount() : 'Already on your list');
      saveList(); syncUi(); runNeeds(); return;
    } else return;
    saveList(); syncUi();
  });
  document.addEventListener('change', function (e) { if (e.target.id && /^cl-sf-/.test(e.target.id)) runFinder(); });

  /* ---------- profile panel ---------- */
  function onFile() {
    var p = prof(), rows = [];
    if (p.counter) rows.push(['Counters', p.counter]);
    if (p.laundry) rows.push(['Laundry', p.laundry]);
    var place = [p.home, p.shape].filter(Boolean);
    if (place.length) rows.push(['Place', place.join(' · ')]);
    var hh = [Number(p.kids) > 0 ? p.kids + ' kid' + (Number(p.kids) > 1 ? 's' : '') : '', p.pets].concat(p.consider || []).filter(Boolean);
    if (hh.length) rows.push(['Household', hh.join(' · ')]);
    return rows;
  }
  function panel() {
    var rows = onFile(), p = prof();
    if (!p.counter && !p.laundry && !p.pets && !Number(p.kids)) {
      return '<div class="cl-sit"><span class="eyebrow">Tailor this course</span><p>Your counters and where you do laundry (Profile → Cleaning), plus kids and companion animals (Profile → Household), open the parts that fit. Everything here stays open to everyone.</p><a class="btn personal sm" href="#profile/cleaning">Answer in Profile</a></div>';
    }
    return '<div class="cl-sit"><span class="eyebrow">Tailored to your profile</span><p>Sections for you are open and marked <span class="cl-foryou is-on">For you</span>.</p>' +
      '<span class="cl-review"><a href="#profile/cleaning" aria-describedby="cl-onfile">Review what’s on file</a>' +
      '<span class="cl-pop" id="cl-onfile" role="tooltip"><span class="eyebrow">On file</span>' + rows.map(function (r) { return '<span class="cl-pop-row"><b>' + esc(r[0]) + '</b>' + esc(r[1]) + '</span>'; }).join('') +
      '<span class="cl-pop-foot">New counters, a new laundry setup, or someone new at home? Update it in your Profile.</span></span></span></div>';
  }

  /* ---------- layout ---------- */
  var UIDX = {};
  function index(U) {
    U.forEach(function (u) {
      UIDX[u.id] = u; NUM[u.id] = String(u.num); var n = 0;
      u.subs.forEach(function (s) { if (!s.tool) { n++; NUM[u.id + '/' + s.id] = u.num + '.' + n; } else NUM[u.id + '/' + s.id] = 'Tool'; });
    });
  }
  function sidebar(U, cur) {
    var wide = window.matchMedia && window.matchMedia('(min-width: 900px)').matches;
    return '<nav class="cl-nav" aria-label="Cleaning course"><details class="cl-nav-wrap"' + (wide ? ' open' : '') + '><summary class="cl-nav-head"><span class="eyebrow">Course map</span><b>Cleaning</b></summary>' +
      '<a class="cl-nav-over" href="' + BASE + '"' + (!cur ? ' aria-current="page"' : '') + '>Overview</a><ol class="cl-vt">' +
      U.map(function (u) {
        var on = cur === u.id;
        return '<li class="cl-vt-unit ck' + u.num + (on ? ' cur' : '') + '"><a class="cl-vt-head" href="' + BASE + '/' + u.id + '"' + (on ? ' aria-current="page"' : '') + '><span class="cl-vt-dot">' + u.num + '</span><span><b>' + u.word + '</b><small>' + u.sub + '</small></span></a>' +
          '<ul class="cl-vt-subs">' + u.subs.map(function (s) { return '<li><a' + (s.tool ? ' class="is-tool"' : '') + ' href="' + BASE + '/' + u.id + '/' + s.id + '">' + (s.tool ? 'Tool: ' : '') + s.title + '</a></li>'; }).join('') + '</ul></li>';
      }).join('') + '</ol>' +
      '<div class="cl-nav-tools"><span class="eyebrow">Tools</span>' +
      '<a class="cl-nav-over" href="' + BASE + '/now"' + (cur === 'now' ? ' aria-current="page"' : '') + '>What needs cleaning?</a>' +
      '<a class="cl-nav-over" href="' + BASE + '/stains/finder">Stain finder</a>' +
      '<a class="cl-nav-over" href="' + BASE + '/list"' + (cur === 'list' ? ' aria-current="page"' : '') + '>My list <span class="cl-cnt" id="cl-cnt">' + openCount() + '</span></a></div>' +
      '<p class="cl-nav-pair"><b>The gentle ladder</b>Water first. Climb one rung only when the rung below didn’t do it. Past vinegar and peroxide, Poisons takes over.</p>' +
      '</details></nav>';
  }
  function layout(U, cur, main) {
    return mn().header('home') + '<div class="cl-layout">' + sidebar(U, cur) + '<main class="cl-main">' + panel() + main + '</main></div>' + mn().footer();
  }
  function to(hash, text) { return '<a href="' + hash + '">' + text + '</a>'; }
  function viewOverview(U) {
    var R = [['r1', 'Rung 1', 'Water', 'Warm water, a cloth that grabs, and a little waiting. Lifts most everyday dirt and most germs with it.', 'water'],
      ['r2', 'Rung 2', 'Soap', 'A drop of castile or dish soap when there’s grease or skin oil.', 'shelf/soap'],
      ['r3', 'Rung 3', 'Baking soda', 'A soft scrub for stuck-on food, and a sponge for smells.', 'shelf/soda'],
      ['r4', 'Rung 4', 'Vinegar · peroxide', 'Vinegar for mineral scale and soap scum. 3% hydrogen peroxide when you want to disinfect. Never in one bottle.', 'shelf/vinegar'],
      ['r5', 'Beyond', 'Poisons', 'Big mold, sewage, droppings, ash, lead dust, a stomach bug. Those need a different plan.', 'beyond']];
    return '<section class="cl-hero"><span class="cl-lens-pill">Tier 3 · Protect · Course</span><h1 tabindex="-1">Cleaning</h1>' +
      '<p class="cl-lede">A clean home is one where dirt, grease and crumbs leave, and nothing harsh stays behind on the counter, in the air or on a cat’s paws. Most of that is done with water and a good cloth. The rest of the course is a short ladder of gentle helpers, climbed one rung at a time, and a clear line where Poisons takes over.</p>' +
      '<div class="cl-btns"><a class="btn" href="' + BASE + '/now">What needs cleaning?</a><a class="btn" href="' + BASE + '/stains/finder">Stain finder</a></div></section>' +
      '<section class="cl-ladder-box"><span class="eyebrow">The gentle ladder · start at the bottom</span><ol class="cl-ladder">' +
      R.map(function (r) { return '<li><a class="cl-rung cl-' + r[0] + '" href="' + BASE + '/' + r[4] + '"><span class="cl-rung-n">' + r[1] + '</span><b>' + r[2] + '</b><p>' + r[3] + '</p></a></li>'; }).join('') + '</ol>' +
      '<p class="cl-legend">Every rung is safe around kids and companion animals when it’s used as described and wiped or dried after. Each “How to fix” shows which rung it uses.</p></section>' +
      '<ol class="cl-ucards">' + U.map(function (u) {
        return '<li><a class="cl-ucard ck' + u.num + '" href="' + BASE + '/' + u.id + '"><i class="cl-band-top"></i><span class="cl-n">0' + u.num + ' · ' + u.kind + '</span><b>' + u.word + '</b><span>' + u.sub + '</span><ol>' + u.subs.filter(function (s) { return !s.tool; }).map(function (s) { return '<li>' + s.title + '</li>'; }).join('') + '</ol>' +
          '<span class="cl-modes">' + u.modes.map(function (m) { return mode(m); }).join('') + '</span></a></li>';
      }).join('') + '</ol>' +
      '<section class="cl-beyond" id="cl-beyond"><b class="cl-beyond-t">Beyond the ladder</b>' +
      '<p>Some messes carry something harmful that wiping can spread: spores, viruses, metals or fumes. Gentle cleaning isn’t the right tool for these, and that’s okay. Each one has its own page in Poisons or Air, with a plan that keeps everyone, animals too, out of harm’s way.</p><ul>' +
      '<li><b>Mold larger than about 10 square feet</b> (a 3 × 3 ft patch), mold that keeps coming back, or anything porous that stayed wet for two days → ' + to('#lens-toxins/living/mold', 'Poisons: Mold in the house') + '</li>' +
      '<li><b>Sewage backup or floodwater</b> inside → ' + to('#lens-toxins/living/mold', 'Poisons: Mold in the house') + ' and ' + to('#lens-air/what/disasters', 'Air: Floods and the air') + '</li>' +
      '<li><b>Mouse or rat droppings and nests.</b> Dry sweeping or vacuuming lifts hantavirus into the air → ' + to(TOX_CLEAN[0], TOX_CLEAN[1]) + '</li>' +
      '<li><b>A stomach bug in the house</b> (norovirus outlasts most gentle cleaners) → ' + to(TOX_CLEAN[0], TOX_CLEAN[1]) + '</li>' +
      '<li><b>Ash and soot after a fire</b> → ' + to('#lens-toxins/neighbors/fire', 'Poisons: After a fire') + '</li>' +
      '<li><b>Peeling paint in a home built before 1978</b>, or dust from sanding it → ' + to('#lens-air/dust/disturbed', 'Air: Asbestos and lead') + '</li>' +
      '<li><b>A broken mercury thermometer or CFL bulb</b>, or an unknown chemical spill → ' + to(TOX_CLEAN[0], TOX_CLEAN[1]) + ' · California Poison Control, 1-800-222-1222</li></ul></section>' +
      '<aside class="cl-toolcard"><span class="eyebrow">Tools</span><p>Shortcuts into the course, for when something needs cleaning right now. Every unit above stays open to read either way.</p>' +
      '<div class="cl-btns"><a class="btn" href="' + BASE + '/now">What needs cleaning?</a><a class="btn" href="' + BASE + '/stains/finder">Stain finder</a><a class="btn" href="' + BASE + '/list">My list</a></div></aside>' +
      '<aside class="cl-funfact"><span class="eyebrow">Fun fact</span><p>The baking-soda-and-vinegar volcano is a lovely science lesson and a weak cleaner: the fizz is the two cancelling each other out into carbon dioxide, a little sodium acetate and mostly water. Used one after the other, each does its own job. Knowing what each thing does is what lets so little do so much.</p>' +
      '<p>Laws mentioned are California’s; the chemistry is the same everywhere.</p>' + src('American Chemical Society, reactions of acids and bases (sodium bicarbonate and acetic acid).') + '</aside>';
  }
  function viewNeeds() {
    setTimeout(runTools, 0);
    return '<article class="cl-unit ck1"><header class="cl-unit-hero"><span class="eyebrow">Tool</span><h1 tabindex="-1">What needs cleaning?</h1><p class="cl-unit-sub">The lowest rung that does the job</p>' +
      '<p class="cl-lede">Pick the surface, then the mess. The answer starts at water and only climbs as far as it needs to, with notes for your counters and the people and animals you live with. Each answer links into the course, which stays open to read from the start either way.</p></header>' +
      '<section class="cl-tool"><b class="cl-tool-t">1 · What are you cleaning?</b><div class="cl-picks" id="cl-wn-s"></div>' +
      '<b class="cl-tool-t">2 · What’s on it?</b><div class="cl-picks" id="cl-wn-m"></div><div class="cl-out" id="cl-wn-out"></div></section>' +
      legend('A starting point, not a rule.') + '</article>';
  }
  function viewList() {
    setTimeout(syncUi, 0);
    return '<article class="cl-unit ck2"><header class="cl-unit-hero"><span class="eyebrow">Your list</span><h1 tabindex="-1">My list</h1><p class="cl-unit-sub">One change at a time, in the order you choose</p>' +
      '<p class="cl-lede">Every “How to fix” you add lands here. Move the ones that matter most, or cost least, to the top, and tap the status to move it along. There’s no deadline and no score.</p>' +
      '<div class="cl-progress" aria-hidden="true"><i id="cl-bar"></i></div><p class="cl-legend" id="cl-sum"></p></header>' +
      '<ol class="cl-lst" id="cl-lst"></ol><div class="cl-empty" id="cl-empty">Nothing here yet. Add any “How to fix” as you read, or try <a href="' + BASE + '/now">What needs cleaning?</a></div>' +
      '<div class="cl-btns"><button type="button" class="btn" data-cl="sort">Free ones first</button><button type="button" class="btn" data-cl="clear">Clear done</button></div>' +
      legend('Saved only in this browser.') + '</article>';
  }
  function viewUnit(U, u, subId) {
    var i = U.indexOf(u), prev = U[i - 1], next = U[i + 1];
    var html = '<article class="cl-unit ck' + u.num + '">' +
      '<header class="cl-unit-hero"><span class="eyebrow">Unit ' + u.num + ' of ' + U.length + ' · ' + u.kind + '</span><h1 tabindex="-1">' + u.word + '</h1><p class="cl-unit-sub">' + u.sub + '</p><p class="cl-lede">' + u.lede + '</p>' +
      (u.mode ? '<p class="cl-unit-mode">' + u.modes.map(function (m) { return mode(m); }).join('') + ' ' + u.mode + '</p>' : '') +
      '<ul class="cl-jumps">' + u.subs.map(function (s) { return '<li><a href="' + BASE + '/' + u.id + '/' + s.id + '"><span>' + NUM[u.id + '/' + s.id] + '</span>' + s.short + '</a></li>'; }).join('') + '</ul></header>' +
      (u.intro || '') +
      u.subs.map(function (s) {
        CUR = { u: u.id, s: s.id };
        if (s.tool) return '<section class="cl-tool" id="cl-' + u.id + '-' + s.id + '"><span class="eyebrow">Tool</span><b class="cl-tool-t">' + s.title + '</b>' + s.html() + '</section>';
        return '<section class="cl-sub" id="cl-' + u.id + '-' + s.id + '"><div class="cl-sub-top"><span class="cl-sub-n">' + NUM[u.id + '/' + s.id] + '</span><h2>' + s.title + '</h2></div>' + s.html() + '</section>';
      }).join('') + (AFTER[u.id] ? AFTER[u.id]() : '') +
      '</article><nav class="cl-pager" aria-label="Units">' +
      (prev ? '<a href="' + BASE + '/' + prev.id + '"><small>← Previous</small><b>' + prev.num + ' · ' + prev.word + '</b></a>' : '<a href="' + BASE + '"><small>← Back to</small><b>Overview</b></a>') +
      (next ? '<a class="next" href="' + BASE + '/' + next.id + '"><small>Next unit →</small><b>' + next.num + ' · ' + next.word + '</b></a>' : '<a class="next" href="' + BASE + '/now"><small>Try it →</small><b>What needs cleaning?</b></a>') +
      '</nav>';
    setTimeout(function () {
      runTools();
      var el = subId && document.getElementById('cl-' + u.id + '-' + subId);
      if (el) el.scrollIntoView({ block: 'start' });
    }, 0);
    return html;
  }

  window.MN_LENS_VIEWS = window.MN_LENS_VIEWS || {};
  window.MN_LENS_VIEWS.cleaning = function (sub) {
    T = tags();
    var U = units(); index(U); indexFixes(U);
    var seg = (sub || '').split('/'), u = UIDX[seg[0]];
    if (seg[0] === 'list') return { title: 'My list · Cleaning · Kinship', html: layout(U, 'list', viewList()) };
    if (seg[0] === 'now') return { title: 'What needs cleaning? · Cleaning · Kinship', html: layout(U, 'now', viewNeeds()) };
    if (u) return { title: u.word.replace('&amp;', '&') + ' · Cleaning · Kinship', html: layout(U, u.id, viewUnit(U, u, seg[1])) };
    if (seg[0] === 'beyond') setTimeout(function () { var el = $('cl-beyond'); if (el) el.scrollIntoView({ block: 'start' }); }, 0);
    return { title: 'Cleaning · Kinship', html: layout(U, null, viewOverview(U)) };
  };
})();
