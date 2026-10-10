/* Poisons lens: course content, profile tailoring, My list and tools. Registers window.MN_LENS_VIEWS.toxins.
   Routes: #lens-toxins (overview) · #lens-toxins/list (My list) · #lens-toxins/<unit>[/<sub>]. Units are reds, darkest (1) to lightest (7).
   Order runs from the body outward: Exposures → Plastics → In the home → Pesticides → Soil → Living toxins → Neighbors.
   Every sub-unit ends in a "How to fix" card: a mode (One by one, Test once, Habit, Together), a cost, and steps from free to bigger.
   "Add to my list" saves the fix to My list (localStorage meeting-needs.tox.v1), a reorderable one-by-one tracker.
   Soil is the one place designed as a single batch, with its own planner. Laws mentioned are California's; the chemistry is general. */
(function () {
  var BASE = '#lens-toxins', LKEY = 'meeting-needs.tox.v1';
  function mn() { return window.MN; }
  function esc(s) { return mn().esc(s); }
  function prof() { return (mn().profile && mn().profile()) || {}; }
  function $(id) { return document.getElementById(id); }

  /* ---------- profile → tags ---------- */
  function tags() {
    var p = prof(), t = {}, space = p.space || [], near = p.near || [];
    if (p.home === 'Shelter or no fixed place' || p.stay === 'No fixed place right now') t.nohome = 1;
    if (p.shape === 'Nothing: it all has to be portable' || p.shape === 'Small, removable things') { t.portable = 1; t.rent = 1; }
    if (p.shape === 'Bigger changes, with an owner who’s on board') t.rent = 1;
    if (space.some(function (s) { return /Windowsill|Balcony/.test(s); }) && !space.some(function (s) { return /yard|plot|Acreage/i.test(s); })) t.portable = 1;
    if (p.built === 'Before 1978') t.old = 1;
    if (Number(p.kids) > 0 || (p.consider || []).some(function (c) { return /Pregnancy|Babies/.test(c); })) t.kids = 1;
    if (p.pets && !/^\s*(0|none|no)\s*$/i.test(p.pets)) t.animals = 1;
    if (/bird|parrot|parakeet|budgie|cockatiel|canary|finch|dove|chicken|hen/i.test(p.pets || '')) t.birds = 1;
    if (near.indexOf('A freeway or busy road') !== -1) t.road = 1;
    if (near.indexOf('Farm fields') !== -1 || space.indexOf('Acreage or farmland') !== -1) t.farm = 1;
    if (near.indexOf('Factory, refinery or oil and gas wells') !== -1 || near.indexOf('An airport') !== -1) t.industry = 1;
    if (p.sources && p.sources.well) t.well = 1;
    return t;
  }
  var T = {};

  /* ---------- small builders ---------- */
  var CUR = { u: '', s: '' };
  function acc(forTags, who, title, body) {
    var hit = forTags.split(' ').some(function (k) { return T[k]; });
    return '<details class="tx-acc' + (hit ? ' match' : '') + '" data-for="' + forTags + '"' + (hit ? ' open' : '') + '>' +
      '<summary><span class="tx-who">' + who + '</span><span class="tx-acc-t">' + title + '</span><span class="tx-foryou">For you</span></summary>' +
      '<div class="tx-in">' + body + '</div></details>';
  }
  function accs() { return '<div class="tx-accs">' + Array.prototype.join.call(arguments, '') + '</div>'; }
  function box(kind, html) { return '<p class="tx-box tx-' + kind + '">' + html + '</p>'; }
  function ca(h) { return box('ca', h); }
  function home(h) { return box('home', h); }
  function care(h) { return box('danger', h); }
  function together(h) { return box('together', h); }
  function kin(h) { return box('kin', h); }
  function kind(h) { return '<p class="tx-kind">' + h + '</p>'; }
  function links(h) { return '<p class="tx-links">' + h + '</p>'; }
  function src(h) { return '<p class="tx-src">' + h + '</p>'; }
  function legend(h) { return '<p class="tx-legend">' + h + '</p>'; }
  function ul(items) { return '<ul>' + items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>'; }
  function ol(items) { return '<ol>' + items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ol>'; }
  function table(head, rows) {
    return '<div class="tx-tbl"><table><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { var m = /^\[(y|p|n)\](.*)$/.exec(c); return m ? '<td class="' + m[1] + '">' + m[2] + '</td>' : '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody></table></div>';
  }
  function does(list) { return '<div class="tx-does">' + list.map(function (d) { return '<div><b>' + d[0] + (d[2] ? ' <i>' + d[2] + '</i>' : '') + '</b><p>' + d[1] + '</p></div>'; }).join('') + '</div>'; }
  function good(list) { return '<div class="tx-good">' + list.map(function (d) { return '<div><b>' + d[0] + '</b><p>' + d[1] + '</p></div>'; }).join('') + '</div>'; }

  var MODE = { swap: 'One by one', batch: 'Test once', habit: 'Habit', together: 'Together' };
  var COST = ['Free', '$', '$$'];
  function mode(k, label) { return '<span class="tx-mode tx-m-' + k + '">' + (label || MODE[k]) + '</span>'; }
  /* fix({ modes: [['swap'], ['batch', 'Test once, in one batch']], cost: 'Free → $', c: 0, steps: [[label, text]], add: [title, (button label)], note }) */
  function fix(o) {
    var modes = o.modes.map(function (m) { return mode(m[0], m[1]); }).join('');
    var data = o.modes.map(function (m) { return m[0] + ':' + (m[1] || MODE[m[0]]); }).join('|');
    var adds = (o.add || []).map(function (a, i) {
      var t = typeof a === 'string' ? a : a[0], label = typeof a === 'string' ? (i ? 'Add this too' : 'Add to my list') : a[1];
      return '<button type="button" class="tx-add" data-tx="add" data-title="' + esc(t) + '" data-label="' + esc(label) + '" data-u="' + CUR.u + '" data-s="' + CUR.s + '" data-c="' + (o.c || 0) + '" data-m="' + esc(data) + '">' + esc(label) + '</button>';
    }).join('');
    return '<div class="tx-fix"><div class="tx-fix-top"><b>How to fix</b>' + modes + '<span class="tx-cost">' + o.cost + '</span></div>' +
      '<ol class="tx-steps">' + o.steps.map(function (s) { return '<li><small>' + s[0] + '</small>' + s[1] + '</li>'; }).join('') + '</ol>' +
      ((adds || o.note) ? '<div class="tx-fix-foot">' + adds + (o.note ? '<span>' + o.note + '</span>' : '') + '</div>' : '') + '</div>';
  }

  /* Cross-references by id, so numbering stays right when sub-units move. */
  var NUM = {};
  function r(u, s, text) { return '<a href="' + BASE + '/' + u + (s ? '/' + s : '') + '">' + (text || NUM[u + '/' + s] || NUM[u] || '') + '</a>'; }
  function animals(text) { return '<a href="#lens-relationships/special/captive">' + (text || 'Captive animals') + '</a>'; }

  /* Titles shared by a fix card and the Where to start tool. */
  var F = {
    heat: 'Stop heating food in plastic (plate, pot, glass)',
    cans: 'Swap canned tomatoes & coconut milk to glass or carton',
    pans: 'Replace scratched nonstick with cast iron or steel',
    clean: 'Swap cleaners to simple basics as each runs out',
    scent: 'Unplug air fresheners; go fragrance-free as things run out',
    shoes: 'Shoes off at the door + weekly wet dusting',
    oats: 'Organic oats, flour, chickpeas & lentils (bulk)',
    poison: 'Replace one poison with a needs-based fix (seal, store, dry)',
    soil: 'Soil: one-batch test of all yard zones',
    mold: 'Find & stop the water behind any mold; humidity meter',
    water: 'Check tap or well water for PFAS',
    air: 'Bedroom air filter (DIY box fan or HEPA)',
    wash: 'Rinse-and-rub + baking soda soak for produce',
    furn: 'Air out new furniture; cotton or linen covers on synthetics'
  };

  /* ---------- course content ---------- */
  function units() {
    return [
      /* ===== 1 · Exposures ===== */
      { id: 'exposures', num: 1, word: 'Exposures', sub: 'How exposures work, and what healthy looks like',
        modes: ['habit'],
        lede: 'A few ideas make every later unit easier: how much, by which door, at what age, and for how long it stays. With these, a scary headline turns into a question you can answer: does this reach me, and what’s the easiest link to break? The unit ends with the good news: what a calm, healthy home is made of.',
        take: function () { return mn().opinion ? mn().opinion('<p>Wool, leather, down and silk can be healthier for people than synthetics, so I’d keep the ones already made in use secondhand rather than buy new, which asks more animals to suffer in ways that don’t meet their needs (more in ' + animals() + ').</p><p class="opinion-src">Wool resists flame without added chemicals, which is why wool batting can meet the US mattress flammability rule (16 CFR 1633) without flame retardants.</p>') : ''; },
        subs: [
          { id: 'dose', short: 'Dose &amp; route', title: 'Dose, route and timing', html: function () { return '<p>Three questions sit under every exposure. <b>How much</b> (the dose) and <b>how often</b>. <b>Which door</b> it uses: breathing it, eating or drinking it, or through skin. And <b>when in life</b>: pregnancy, babies and young children take in more per pound of body, put hands and toys in their mouths, and are still building organs, so the same dose lands harder.</p>' +
            table(['Door', 'Common examples', 'Easiest link to break'], [
              ['Breathing', 'Cooking smoke, gas stove fumes, sprays, dust, wildfire smoke, freeway air', 'Ventilation, filters, fewer sprays'],
              ['Eating &amp; drinking', 'Plastic touching hot or fatty food, can linings, residues, tap water, house dust on hands', 'Swap the container, wash produce, filter water, wash hands'],
              ['Skin', 'Lotions, fragrance, cleaners, treated fabrics, soil', 'Gloves, simpler products, rinse off']]) +
            '<p>One wrinkle: some chemicals that mimic hormones (<b>endocrine disruptors</b>) don’t follow “a little is always fine.” Small amounts at sensitive times can matter, which is part of why this course leans on reducing many small exposures rather than chasing one big one.</p>' +
            fix({ modes: [['habit']], cost: 'Free', steps: [
              ['Free · today', 'Pick one room and name the doors: what’s breathed, eaten and touched there.'],
              ['Free', 'If someone is pregnant or there’s a baby or toddler, start with what they touch and mouth: floors, dust, cups, bottles.'],
              ['Free', 'Wash hands before eating, kids especially after floor and yard play. It cuts dust-borne lead, flame retardants and pesticides at once.']],
              add: ['Handwashing before meals (dust, lead, residues)'] }) +
            src('US EPA, <i>Child-Specific Exposure Factors Handbook</i>; Endocrine Society scientific statement on endocrine-disrupting chemicals (EDC-2, 2015).'); } },
          { id: 'chain', short: 'Source, path, body', title: 'Source, path, body', html: function () { return '<p>Every exposure is a chain: a <b>source</b> (a pan, a can, a factory), a <b>path</b> (heat, dust, air, water, hands) and a <b>body</b> it reaches. Breaking any one link works. Safety engineers rank the ways to break it, and the order is useful at home too:</p>' +
            does([['1 · Remove it', 'Don’t bring it in, or let it go. Most powerful, often free.'], ['2 · Swap it', 'Glass for plastic, cast iron for a scratched nonstick pan.'], ['3 · Block the path', 'A range hood, a filter, a doormat, a raised bed with clean soil.'], ['4 · Change the habit', 'Shoes off, food cooled before it goes in plastic.'], ['5 · Protect the body', 'Gloves, a mask. Useful, but the last line, not the first.']]) +
            home('Microwaving leftovers in a plastic tub: the source is the tub, the path is heat, the body is whoever eats. Moving the food to a plate before heating removes the path for free.') +
            fix({ modes: [['habit']], cost: 'Free', steps: [
              ['Free · today', 'For one worry, write the chain: source → path → body.'],
              ['Free', 'Circle the link that’s cheapest to break. Often it’s the path (heat, dust, air), not the thing itself.'],
              ['Free', 'Only buy something when removing, moving or changing a habit won’t do it.']],
              note: 'The same idea as the Water course’s source-to-tap chain.' }) +
            src('NIOSH, <i>Hierarchy of Controls</i>.'); } },
          { id: 'stays', short: 'Days or years', title: 'Gone in days, here for years', html: function () { return '<p>Some chemicals pass through the body in hours or days. Others stay for years. That changes what a fix can do, and how soon.</p>' +
            table(['Chemical', 'Roughly how long half of it stays', 'What that means'], [
              ['BPA, many phthalates', '[y]Hours to a day', 'Swaps show up in the body within days.'],
              ['Glyphosate', '[y]Hours to days', 'Diet changes show up within a week.'],
              ['Lead', '[p]About a month in blood; decades in bone', 'Stopping new exposure matters most, early.'],
              ['PFOA, PFOS (PFAS)', '[n]About 2 to 5 years', 'Fixes are slow to show; preventing new exposure, especially in water, is the lever.']]) +
            legend('Green: leaves quickly · Amber: mixed · Red: stays for years.') +
            fix({ modes: [['habit']], cost: 'Free', steps: [
              ['Free', 'For quick-leaving chemicals, small daily swaps pay off fast. Start there for momentum.'],
              ['Free', 'For long-staying ones (PFAS, lead), look for the biggest single source, usually water or soil, and deal with it once.'],
              ['Ask', 'With likely high PFAS exposure, a clinician can order a PFAS blood test (US National Academies guidance, 2022).']],
              note: 'Water → <a href="#lens-water/testing">Testing</a>' }) +
            src('ATSDR toxicological profiles (lead, PFAS); Li et al., <i>Occupational and Environmental Medicine</i> 2018 (PFAS half-lives); National Academies, <i>Guidance on PFAS Exposure, Testing, and Clinical Follow-Up</i> (2022).'); } },
          { id: 'bodies', short: 'Every body', title: 'Every body, not just ours', html: function () { return '<p>The house holds more than people. Some kin are far more sensitive than we are, and their reactions can be early signals for everyone.</p>' +
            does([['Birds', 'Overheated nonstick pans give off fumes that can kill a bird in minutes. Birds breathe so efficiently that fumes reach them first.', 'Air'],
              ['Cats', 'Permethrin, common in dog flea treatments, can poison a cat, sometimes fatally. Cats also can’t break down many essential oils well.', 'Skin'],
              ['Dogs', 'Toxic algae in still water can kill a dog within hours of a swim or a drink.', 'Water'],
              ['Plants', 'Microplastics and PFAS reach roots and, for some crops, leaves and fruit. Herbicide drift scorches plants it was never aimed at.', 'Roots'],
              ['Soil life', 'Worms, fungi and microbes take the brunt of what lands on the ground, and they’re the ones who rebuild it.', 'Ground']]) +
            kin('When someone small is sneezing, itching, listless or drooping, it’s a message about a need. Ask what changed in the air, water, food or soil before anything else.') +
            fix({ modes: [['habit']], cost: 'Free', steps: [
              ['Free · today', 'Save the ASPCA Animal Poison Control number (888-426-4435; a fee may apply) in your phone.'],
              ['Free', 'Keep birds out of the kitchen while cooking, and check any flea treatment is labeled for that species.'],
              ['Free', 'Read later units with the most sensitive one in the house in mind; ' + r('exposures', 'companions', 'the next section') + ' covers what each species can’t process.']],
              add: ['Save Animal Poison Control number; check flea products by species'] }) +
            links(animals('Relationships: Captive animals')) +
            src('ASPCA Animal Poison Control; Merck Veterinary Manual (PTFE toxicosis in birds; permethrin toxicosis in cats); CDC, harmful algal blooms and animals.'); } },
          { id: 'companions', short: 'Companion animals', title: 'Companion animals: what their bodies can’t process', html: function () { return '<p>Companion animals share our homes, air, floors and food scraps, but their bodies process chemicals differently. Something harmless or even healthy for us can be dangerous for them, and because they’re smaller, close to the floor and groom with their tongues, they meet more of it.</p>' +
            table(['Who', 'How their body differs', 'Common household dangers', 'What helps'], [
              ['Cats', 'The liver lacks much of a key enzyme for clearing many chemicals (glucuronidation), so they build up. Kidneys are delicate.', '<b>Lilies</b> (true lilies and daylilies: even pollen or vase water can cause kidney failure), acetaminophen and ibuprofen, permethrin dog flea products, essential oils (diffused, on skin or groomed off fur), antifreeze, smoke, incense and sprays (asthma)', 'No lilies in homes with cats; medicines put away; species-labeled flea care; diffusers and incense out of their rooms'],
              ['Dogs', 'Eat first and ask later; noses at floor level.', 'Xylitol (in sugar-free gum, some peanut butters: crashes blood sugar, harms the liver), grapes and raisins (kidneys), chocolate and caffeine, onions and garlic (red blood cells, for cats too), human medicines, slug bait and rodent poison neighbors use, blue-green algae', 'Bags and counters up high; sealed trash; water from home on walks; a word with neighbors about baits'],
              ['Birds', 'Air sacs pull in far more air per breath; tiny bodies.', 'PTFE fumes from overheated nonstick, smoke, aerosols and scented candles, zinc and lead in old cages, paint and toys, avocado', 'No PTFE pans, or birds far from the kitchen; stainless cages and toys; fresh air'],
              ['Rabbits, guinea pigs and other small mammals', 'Sensitive airways and guts.', 'Ammonia from soiled bedding, aromatic cedar and pine shavings, many garden and houseplants', 'Paper or aspen bedding changed often; plants checked before sharing'],
              ['Fish and reptiles', 'Breathe or absorb through water and skin.', 'Chlorine and chloramine in tap water, soap or lotion on hands, aerosols settling on the water', 'Dechlorinated water; rinsed hands; sprays far from tanks']]) +
            care('Vomiting, drooling, wobbling, tremors, breathing trouble, not eating, or a cat near lilies: call a vet or ASPCA Animal Poison Control (888-426-4435) or Pet Poison Helpline (855-764-7661) right away; fees may apply. With lilies and antifreeze, treatment in the first hours makes the difference.') +
            kin('Most of these come into homes as ordinary things: a bouquet, a pill bottle, gum in a bag. Meeting companions’ needs is mostly about where things are kept.') +
            fix({ modes: [['habit']], cost: 'Free', steps: [
              ['Free · today', 'Medicines, gum and grapes up high or in cupboards; trash sealed.'],
              ['Free', 'Homes with cats: no lilies, and no diffusers or essential oils in rooms they can’t leave.'],
              ['Free', 'Every flea, tick or cleaning product checked for the species it’s labeled for.']],
              add: ['Companion safety: meds up high, no lilies with cats, species-checked products'] }) +
            links(animals('Relationships: Captive animals') + ' · <a href="#lens-air/smoke/companions">Air: Smoke, scent and companions</a> · ' + r('living', 'plants', 'Plants and companions')) +
            src('ASPCA Animal Poison Control Center; Pet Poison Helpline; Merck Veterinary Manual; US FDA, <i>Lovely Lilies and Curious Cats</i>; Court &amp; Greenblatt, <i>Pharmacogenetics</i> 1997 (feline glucuronidation).'); } },
          { id: 'start', tool: true, short: 'Where to start', title: 'Where to start', html: function () { return '<p class="tx-legend">Tick what’s true now. No judgement in any box: it just finds the swaps with the biggest return for the least effort.</p><div class="tx-chks" id="tx-ws"></div><div class="tx-out" id="tx-ws-out"></div>'; } },
          { id: 'healthy', short: 'Healthy', title: 'What healthy looks like', html: function () { return '<p>Not everything is poison. People lived for thousands of years among wood, stone, clay, plant fibers and natural rubber, and many of those materials are still the calmest things to have around: they don’t off-gas, don’t shed plastic, and can be repaired, refinished and composted. The aim of this lens is a home made mostly of things you can name.</p>' +
            good([
              ['Cushions, pillows, mattresses', '<b>Natural latex</b> (from rubber-tree sap), cotton or kapok batting, buckwheat hulls. Look for “100% natural latex”: “latex” alone can be synthetic. Skip latex if anyone has a latex allergy.'],
              ['Fabric', 'Cotton, linen, hemp, ramie. Plain or simply dyed, without “stain-resistant,” “wrinkle-free” or “water-repellent” finishes, which are usually PFAS or formaldehyde resins.'],
              ['Frames and furniture', 'Solid wood held with joinery, dowels or screws more than glue. Finished with linseed or tung oil, a water-based low-VOC finish, or left raw.'],
              ['Kitchen', 'Glass, stainless steel, cast iron, carbon steel, wood, stone and lead-free ceramic (' + r('plastics', 'pans') + ').'],
              ['Floors', 'Solid wood, tile, stone, cork, and true linoleum (linseed oil and wood flour, unlike vinyl).'],
              ['Cleaning', 'Soap, baking soda, vinegar and washing soda (' + r('home', 'cleaners') + ').']]) +
            '<p><b>Designing for it, in theory:</b></p>' +
            ul(['<b>Fewer materials,</b> each one you can name.',
              '<b>Mechanical over chemical:</b> joinery, screws, buttons and ties hold things together without glues and coatings.',
              '<b>Removable, washable covers:</b> a cushion you can unzip and wash keeps dust and spills out of the filling.',
              '<b>Repairable and refinishable:</b> sand a scratch, re-oil a tabletop, restuff a pillow. A wood-frame couch with a latex or cotton cushion can last generations.',
              '<b>Breathable:</b> natural fibers and solid wood buffer humidity, which helps keep mold away (' + r('living', 'mold') + ').',
              '<b>Secondhand first:</b> older solid-wood furniture has long finished off-gassing. Check old paint for lead and old foam for flame retardants (' + r('home', 'dust') + ').']) +
            fix({ modes: [['swap']], cost: 'Free → $', c: 0, steps: [
              ['Free · next time', 'When something wears out, write down what it’s made of, and what a version in materials you can name would be.'],
              ['Free → $', 'Look secondhand first: solid wood, cotton, linen and wool turn up at thrift stores and Buy Nothing groups.'],
              ['Make it', 'Sew a cotton or linen cover for an old cushion, or build a simple wood-frame bench. Both are coming in Sewing and Carpentry.']],
              add: ['Next replacement: a version made of materials I can name'] }) +
            links('<a href="#lens-sewing">Sewing</a> · <a href="#lens-carpentry">Carpentry</a> · <a href="#lens-interior-design">Interior design</a>'); } }
        ] },

      /* ===== 2 · Plastics ===== */
      { id: 'plastics', num: 2, word: 'Plastics', sub: 'Including PFAS',
        modes: ['swap'],
        lede: 'Plastic is useful and everywhere, and it isn’t one thing: it’s a polymer plus additives that soften it, harden it, color it or make it slick. Some of those additives move into food and dust, and the plastic itself sheds tiny pieces. Food contact is the main door, and it’s one we control a lot of.',
        mode: 'Swap one food-contact item at a time, starting with whatever meets heat.',
        subs: [
          { id: 'what', short: 'What’s in it', title: 'What’s in plastic', html: function () { return ul([
              '<b>Bisphenols</b> (BPA, and replacements BPS and BPF) harden polycarbonate and epoxy can linings, and coat many paper receipts. They act like estrogen in the body.',
              '<b>Phthalates</b> soften vinyl (PVC) and carry fragrance. Linked to changes in male reproductive development and to asthma.',
              '<b>Micro- and nanoplastics</b>: pieces from shedding and wear. Found in human blood, placentas and brain tissue; in one 2024 study, people with plastic in their artery plaque had higher rates of heart attack, stroke and death. Cause and effect is still being studied.']) +
            does([['People', 'Hormone signaling, reproduction, metabolism. Plastics research moves fast and is mostly associations so far.'], ['Animals', 'Wild animals eat plastic outright; companion animals share our dust and bowls.'], ['Plants &amp; soil', 'Plastic changes how soil holds water and air, and tiny pieces enter some roots (' + r('plastics', 'soil') + ').']]) +
            legend('Recycling codes, roughly: <b>3</b> (PVC), <b>6</b> (polystyrene) and <b>7</b> (“other,” often polycarbonate) are the first to retire from food use. <b>2, 4, 5</b> carry fewer known additives, but still shed particles with heat and wear.') +
            fix({ modes: [['swap']], cost: 'Free → $', steps: [
              ['Free · today', 'Say no thanks to paper receipts, or hold them briefly and wash hands after.'],
              ['Free', 'Move scratched, cloudy or #3/#6/#7 food containers to garage storage (screws, crayons).'],
              ['Free → $', 'Collect glass jars from food you already buy; they replace most tubs at no cost.']],
              add: ['Move #3/#6/#7 and scratched plastics out of food use'] }) +
            src('Endocrine Society EDC-2 (2015); Leslie et al., <i>Environment International</i> 2022 (blood); Marfella et al., <i>NEJM</i> 2024 (carotid plaque); Nihart et al., <i>Nature Medicine</i> 2025 (brain tissue).'); } },
          { id: 'lifesaver', short: 'When it saves you', title: 'When plastic is the safer bet', html: function () { return '<p>Plastic does things almost nothing else does at its weight and price: it’s waterproof, light, cheap, and it doesn’t rot. For someone living outside, in a vehicle or camping, a tarp, a tent fly or a water jug can be the difference between a dry night and soaked bedding, lost papers and hypothermia. Everyone deserves to know plastic carries the chemicals this unit describes, and everyone deserves to stay dry. Both are true.</p>' +
            ul(['<b>A calculated risk:</b> chemicals move out of plastic mostly with heat, fat, acid, wear and time (' + r('plastics', 'heat') + '). A tarp overhead in the rain is a small, slow exposure; wet clothes and a wet sleeping bag in the cold can become life-threatening within hours.',
              '<b>Lower the dose where it’s easy:</b> keep food and water in plastic out of hot sun, put a cotton or wool layer between you and a vinyl pad, and let a new tarp or tent air out outside for a day or two (the “new” smell is off-gassing).',
              '<b>Gentler plastics when there’s a choice:</b> the common blue, green or brown polyethylene tarps (#2, #4) carry fewer additives than vinyl (PVC, #3), which is softened with phthalates. Water jugs of #2 plastic, kept in shade.',
              '<b>Keep it in use:</b> repair tape and grommet kits make a tarp last, which means less new plastic made.',
              'Waterproof rain gear and tents often carry PFAS repellents (' + r('plastics', 'pfas') + '); PFAS-free gear exists and is getting easier to find.']) +
            fix({ modes: [['habit']], cost: 'Free', steps: [
              ['Free · today', 'Keep the tarp up. Move food and water stored in plastic into shade.'],
              ['Free', 'Air new tarps, tents and pads outside before sleeping under or on them; wash hands after handling old, cracked ones.'],
              ['Free → $', 'When one wears out, choose polyethylene over vinyl, and PFAS-free rain gear if it’s within reach.']],
              add: ['Air out new tarps and tents; keep plastic food and water out of the sun'] }) +
            accs(acc('nohome portable', 'Living outside or on the move', 'Staying dry comes first', '<p>Shelter, dry clothes, warmth and drinking water come before anything else on this page. Outreach teams and 211 often hand out tarps, tents and blankets. More in <a href="#lens-relationships/special/distress">People in distress</a>.</p>')) +
            src('ATSDR, phthalates; California AB 1817 (2022), PFAS in textiles; National Weather Service, hypothermia safety.'); } },
          { id: 'heat', short: 'Heat, fat, acid', title: 'Heat, fat and acid', html: function () { return '<p>Plastic gives up more into food when it’s <b>hot</b>, when the food is <b>fatty</b> (oil, nut butters, coconut milk) or <b>acidic</b> (tomato, citrus, vinegar), when it’s <b>old and scratched</b>, and the longer they touch. In one lab study, microwaving plastic containers released millions of microplastic and billions of nanoplastic pieces per square centimeter in three minutes.</p>' +
            ul(['Hot drinks through plastic lids or plastic tea bags.', 'Hot food poured into plastic tubs, or warmed in them.', 'Dishwashers: heat plus detergent wears plastic fast.', 'Plastic cutting boards shed into food as they’re scored.']) +
            fix({ modes: [['swap']], cost: 'Free first', steps: [
              ['Free · today', 'Reheat on a plate or in a pot, never in plastic. Cool food before it goes into any plastic.'],
              ['Free', 'Hand-wash any plastic you keep; skip the dishwasher for it.'],
              ['Low cost', 'Loose-leaf tea with a metal strainer, a wooden cutting board, glass or steel for leftovers.']],
              add: [F.heat] }) +
            accs(
              acc('kids', 'Babies', 'Bottles, formula and teethers', ul(['BPA has been out of US baby bottles since 2012, but plastic bottles still shed microplastics, more with hot water. Make formula in a glass or steel container and pour it in once it’s cooled to drinking warmth.', 'Glass bottles with silicone sleeves don’t shed plastic and survive a lot.', 'Soft vinyl toys and teethers were where phthalates were restricted first (US, 2008); older hand-me-downs may predate that.'])),
              acc('nohome', 'Little control', 'When the food comes in plastic anyway', '<p>Shelter meals, pantry boxes and takeout often come in plastic, and that’s fine to accept. What still helps: let hot food cool a little before eating from the container, and move it to a mug or bowl when one is around.</p>')) +
            src('Hussain et al., <i>Environmental Science &amp; Technology</i> 2023; Hernandez et al., <i>ES&amp;T</i> 2019 (plastic tea bags); Li et al., <i>Nature Food</i> 2020 (infant bottles); FDA, BPA in baby bottles (2012); CPSIA (2008).'); } },
          { id: 'cans', short: 'Cans &amp; lids', title: 'Cans and jar lids', html: function () { return '<p>Metal cans are lined with a thin plastic coat so food doesn’t touch metal. For decades that lining was BPA-based epoxy. In one study, eating a serving of canned soup a day for five days raised people’s urine BPA more than ten-fold compared to fresh soup. Most US cans now use “BPA-NI” (non-intent) linings: acrylic, polyester, or sometimes vinyl or BPS-based coatings, which aren’t always better studied. Jar lids carry a plastic seal too.</p>' +
            table(['Canned food', 'Picks up more?', 'Swap'], [
              ['Tomatoes, tomato paste', '[n]Yes: acidic, often filled hot', 'Jarred or boxed (carton) tomatoes, or fresh in season'],
              ['Coconut milk', '[n]Yes: fatty', 'Carton, or a block of creamed coconut'],
              ['Soups', '[p]Often', 'Homemade from dried beans and grains (<a href="#lens-food/rehydrate">Food → Rehydrate</a>)'],
              ['Beans, chickpeas', '[p]Some', 'Dried beans, which cost less too. Or jarred.'],
              ['Fruit in syrup', '[p]Some', 'Frozen fruit, jars']]) +
            ca('BPA is on California’s Proposition 65 list for reproductive harm (since 2015), so some cans carry a warning. The EU banned BPA in food-contact materials in late 2024, phasing in through 2026.') +
            fix({ modes: [['swap']], cost: 'Saves money', steps: [
              ['Free · this week', 'Swap canned beans for a weekly pot of dried beans. It costs less, too.'],
              ['Same cost', 'Switch canned tomatoes and coconut milk to glass or carton next time they run out.'],
              ['Free', 'When you do use cans, move leftovers out of the can the same day.']],
              add: [F.cans, ['Cook dried beans instead of canned', 'Add beans too']] }) +
            links('<a href="#lens-food/rehydrate/beans">Food → Soaking beans</a> · <a href="#lens-food/store/pantry">Food → The pantry</a>') +
            src('Carwile et al., <i>JAMA</i> 2011; OEHHA, Prop 65 listing of BPA (2015); Commission Regulation (EU) 2024/3190; Breast Cancer Prevention Partners, <i>Kicking the Can?</i> (can lining survey).'); } },
          { id: 'pfas', short: 'PFAS', title: 'PFAS, the forever chemicals', html: function () { return '<p>PFAS are thousands of related chemicals that make things slick, stain-proof and water-proof. Their carbon–fluorine bond is one of the strongest in chemistry, so they barely break down: in water, soil, or bodies. Almost everyone in the US has some in their blood.</p>' +
            ul(['<b>Where they show up:</b> drinking water near airports, military bases and factories; nonstick coatings; grease-proof food wrappers and bowls; stain- and water-resistant carpet, couches and rain gear; some dental floss and cosmetics; firefighting foam.',
              '<b>What they’re linked to:</b> higher cholesterol, weaker vaccine response in children, lower birth weight, thyroid disease, and kidney and testicular cancer. The WHO’s cancer agency classed PFOA as carcinogenic to humans in 2023.']) +
            ca('Plant-fiber food packaging (molded bowls, wrappers) can’t have added PFAS since 2023 (AB 1200), cookware has to disclose PFAS, and new textiles have been PFAS-restricted since 2025 (AB 1817). A wider cookware ban (SB 682) was vetoed in 2025. Federally, EPA set 4-part-per-trillion limits for PFOA and PFOS in tap water in 2024; in 2026 it proposed dropping the other PFAS limits and pushing compliance to 2031.') +
            fix({ modes: [['batch'], ['swap', 'then one by one']], cost: 'Free → $$', c: 1, steps: [
              ['Free · first', 'Water first: it’s usually the largest source. Look up your water system’s PFAS results, or test a well once (<a href="#lens-water/testing">Water → Testing</a>).'],
              ['$ → $$', 'If PFAS are present: a reverse osmosis or certified activated-carbon filter (NSF/ANSI 53 or 58 for PFOA/PFOS).'],
              ['One by one', 'Then nonstick pans (' + r('plastics', 'pans') + '), grease-proof takeout, stain-guard sprays and “water-resistant” anything, as each wears out.']],
              add: [F.water], note: 'The Water course holds the filter details.' }) +
            accs(acc('well', 'Well water', 'Testing a private well for PFAS', '<p>PFAS tests cost more than a basic panel (often a few hundred dollars), so bundle one with the rest of your well test in a single sample run. The State Water Board maps known PFAS sites; nearby airports, bases and landfills raise the odds.</p>' + links('<a href="#lens-water/testing">Water → Testing</a>'))) +
            src('ATSDR, PFAS health effects; IARC Monographs vol. 135 (2023); US EPA PFAS drinking water regulation (2024) and 2026 proposed revisions; California AB 1200 (2021), AB 1817 (2022).'); } },
          { id: 'pans', short: 'Pots &amp; pans', title: 'Pots and pans', html: function () { return '<p>Nonstick (PTFE, often sold as Teflon) is a PFAS. It’s stable at normal heat, but starts breaking down around 500°F (260°C), which an empty pan on high heat can reach in a few minutes. The fumes can cause flu-like “polymer fume fever” in people and can kill birds. Scratched coatings flake into food.</p>' +
            table(['Material', 'Notes', 'Cost'], [
              ['Cast iron', 'Lasts generations; slick once seasoned. Long-simmered tomato adds a little iron.', '[y]Often free or cheap used'],
              ['Carbon steel', 'A lighter cast iron; great for tofu scrambles, stir-fries and crepes.', '[p]$'],
              ['Stainless steel', 'Inert and dishwasher-safe. Food sticks less once the pan is preheated.', '[p]$ used, $$ new'],
              ['Glass, enameled iron', 'Inert. Check old enamel and imported ceramics for lead glaze.', '[p]$–$$'],
              ['“Ceramic” nonstick', 'A PFAS-free coating; the nonstick wears off in a year or two.', '[p]$']]) +
            fix({ modes: [['swap']], cost: 'Free → $', c: 1, steps: [
              ['Free · today', 'Until it’s replaced: never preheat nonstick empty, keep it on medium, run the hood, and keep birds out of the kitchen.'],
              ['Free → $', 'Retire scratched nonstick first. Thrift stores and Buy Nothing groups are full of cast iron.'],
              ['Free', 'Wooden or steel utensils, which keep any pan’s surface longer.']],
              add: [F.pans] }) +
            accs(acc('birds', 'Birds at home', 'Birds and the kitchen', '<p>Bird lungs are so efficient that PTFE fumes can kill a bird before people notice a smell. Keep birds well away from the kitchen, and watch for nonstick in less obvious places: space heaters, irons, air fryers, oven liners and waffle makers.</p>')) +
            links('<a href="#lens-food/cook/pots">Food → Pots, pans and stoves</a> · Air (gas stoves)') +
            src('ATSDR, PFAS; Merck Veterinary Manual (PTFE toxicosis); FDA, lead in imported ceramicware.'); } },
          { id: 'soil', short: 'Soil &amp; plants', title: 'Plastic in soil and plants', html: function () { return '<p>Soil is now one of the largest reservoirs of microplastic, by some estimates more than the oceans. It arrives on plastic mulch, synthetic fibers in compost and sewage sludge (biosolids), tire dust from roads, and old weed fabric breaking down.</p>' +
            does([['Soil', 'Changes how soil holds water and air; can slow worms and shift microbe communities.'], ['Plants', 'In lab studies, crops like lettuce and wheat took nanoplastic in through roots and moved some to leaves. PFAS travel the same road, short-chain ones most into leaves and fruit.'], ['People', 'What the plant takes up, we eat. Rinsing and peeling don’t remove what’s inside.']]) +
            kin('Worms and soil fungi are the ones rebuilding soil. Keeping plastic out of the beds is a gift to them first.') +
            fix({ modes: [['swap']], cost: 'Free → $', steps: [
              ['Free', 'Pull old landscape fabric and plastic mulch as you go; use straw, leaves or cardboard (tape off) instead.'],
              ['Free', 'Peel fruit stickers before composting; keep “compostable” plastics out unless you know your pile gets hot.'],
              ['Free → $', 'Skip compost or fertilizer made from biosolids (“sewage sludge”) for food beds (' + r('pesticides', 'potting') + ').']],
              add: ['Replace plastic mulch/weed fabric with leaves, straw, cardboard'] }) +
            links('Gardening · ' + r('pesticides', 'potting', 'Potting mix and compost')) +
            src('Li et al., <i>Nature Sustainability</i> 2020 (crop uptake); de Souza Machado et al., <i>Global Change Biology</i> 2018; Lesmeister et al., <i>Science of the Total Environment</i> 2021 (PFAS in plants).'); } }
        ] },

      /* ===== 3 · In the home ===== */
      { id: 'home', num: 3, word: 'In the home', sub: 'Cleaners, furniture, dust and the plate',
        modes: ['swap', 'habit'],
        lede: 'Indoor air is often more polluted than the air outside, mostly from what we bring in and use. This is the unit built for knocking things out one at a time: each bottle, cushion or shelf gets swapped when it runs out or wears out, so it costs little and nothing goes to waste. It ends at the plate, washing off what the next unit is about.',
        mode: 'Replace each thing when it runs out. Dust and air habits are free from day one.',
        subs: [
          { id: 'cleaners', short: 'Cleaners', title: 'Cleaning products', html: function () { return '<p>Most cleaning can be done with water, soap, baking soda, vinegar and a scrub brush. Stronger products earn their place for specific jobs (illness, mold), not for everyday wiping. Sprays put more into the air we breathe than pour-and-wipe.</p>' +
            ul(['<b>Quats</b> (“benzalkonium chloride,” many disinfecting wipes) are linked to asthma in cleaning workers.', '<b>Bleach</b> works well, but never with ammonia (toxic chloramine gas) or acids like vinegar (chlorine gas).', '<b>Oven and drain cleaners</b> are the most caustic in most homes.']) +
            care('Never mix cleaners. Bleach plus ammonia, or bleach plus vinegar or acid toilet cleaners, makes gases that injure lungs.') +
            fix({ modes: [['swap']], cost: 'Saves money', steps: [
              ['Free · today', 'Gather every cleaner in one place. Note which jobs each is for; take duplicates to household hazardous waste.'],
              ['As each runs out', 'Replace it with a basic: castile or dish soap, baking soda, vinegar, washing soda. Pour onto a cloth instead of spraying.'],
              ['Keep one', 'One real disinfectant for when it’s needed, used with a window open.']],
              add: [F.clean] }) +
            links('Cleaning (recipes for each job) · Air (ventilation)') +
            src('US EPA, indoor air and household products; Dumas et al., <i>JAMA Network Open</i> 2019 (disinfectants and COPD in nurses); Washington State Department of Health, chemical mixing hazards.'); } },
          { id: 'fragrance', short: 'Fragrance', title: 'Fragrance', html: function () { return '<p>“Fragrance” on a label can mean dozens of undisclosed ingredients, sometimes including phthalates that make a scent last. Air fresheners, plug-ins, scented candles, dryer sheets and laundry “boosters” are among the biggest indoor sources of volatile chemicals, and some react with ozone to make formaldehyde.</p>' +
            kin('Cats lack some of the liver enzymes needed to clear many essential oils, so diffusers can make cats and birds sick. Unscented is kindest for everyone with a nose.') +
            ca('Since 2021–2022, California requires cleaning products and cosmetics to list fragrance allergens on the label.') +
            fix({ modes: [['swap']], cost: 'Free', steps: [
              ['Free · today', 'Unplug plug-in fresheners. Open a window or run a fan for 10 minutes instead.'],
              ['Free', 'Find the smell’s source (trash, damp, drain) and meet that need; a smell is a signal.'],
              ['As it runs out', 'Laundry soap: fragrance-free. Dryer sheets: wool dryer balls secondhand, or nothing.']],
              add: [F.scent] }) +
            src('Steinemann, <i>Air Quality, Atmosphere &amp; Health</i> 2018; California Cleaning Product Right to Know Act (SB 258, 2017); Cosmetic Fragrance and Flavor Ingredient Right to Know Act (SB 312, 2020).'); } },
          { id: 'body', short: 'Body care', title: 'Body care', html: function () { return '<p>Lotions, shampoos and makeup stay on skin for hours. The ingredients most often flagged: fragrance, some preservatives like formaldehyde releasers, PFAS in some long-wear makeup and floss, and phthalates. Fewer products, with shorter ingredient lists, is the simplest path.</p>' +
            ca('The Toxic-Free Cosmetics Act bans 24 ingredients (including formaldehyde, mercury and certain phthalates) from cosmetics sold in the state since 2025, and AB 2771 bars added PFAS from cosmetics the same year.') +
            fix({ modes: [['swap']], cost: 'Saves money', steps: [
              ['Free', 'Notice which products you’d really miss. Let the rest run out and not return.'],
              ['As each runs out', 'Choose fragrance-free and short ingredient lists; plain plant oils (olive, coconut, jojoba) for skin.'],
              ['Free', 'Kids need very little: water, a gentle soap, sunscreen.']],
              add: ['Pare down body care; fragrance-free as each runs out'] }) +
            links('Body care') +
            src('California Toxic-Free Cosmetics Act (AB 2762, 2020) and AB 2771 (2022); Whitehead et al., <i>ES&amp;T Letters</i> 2021 (PFAS in cosmetics).'); } },
          { id: 'furniture', short: 'Furniture', title: 'Furniture, cushions and wood', html: function () { return '<p>Furniture is the biggest stuff in a home, and it breathes into the room for years: foam and fabric shed into dust, glues in pressed wood release formaldehyde, finishes give off solvents while they cure.</p>' +
            table(['Part', 'Usually made of', 'What it can give off', 'Calmer option'], [
              ['Cushion foam', 'Polyurethane foam (from petroleum)', 'Volatile chemicals when new; flame retardants in older foam', 'Natural latex, cotton, kapok; wool secondhand'],
              ['Upholstery', 'Polyester, nylon, acrylic', 'Microplastic fibers into dust and air; PFAS if stain-guarded', 'Cotton, linen or hemp covers'],
              ['Frames, shelves, cabinets', 'Particleboard, MDF, plywood', 'Formaldehyde from the glue, most in the first months and more in heat and humidity', 'Solid wood; panels labeled “no added formaldehyde”'],
              ['Finishes', 'Solvent varnish, lacquer', 'Solvents while curing', 'Linseed or tung oil, water-based low-VOC finish'],
              ['Pressure-treated lumber', 'Copper (older: arsenic) preservatives', '[n]Made for outdoors and ground contact', 'Never indoors, for cutting boards, or burned (' + r('pesticides', 'wood') + ')']]) +
            '<p><b>Breathing plastic:</b> indoor air carries more microplastic fibers than outdoor air, much of it from synthetic textiles: couches, carpets, curtains and clothes. Polyester cushions and fleece throws shed most as they rub and wear.</p>' +
            '<p><b>Formaldehyde</b> is a known human carcinogen and irritates eyes and lungs. Flat-pack furniture and new cabinets give off the most when they’re new.</p>' +
            ca('California capped formaldehyde from composite wood in 2009 (the CARB rule), and the federal TSCA Title VI rule followed from 2018. Look for “CARB Phase 2” or “TSCA Title VI compliant,” or better, “NAF” (no added formaldehyde) or “ULEF.” Furniture labels also say whether flame retardants were added.') +
            fix({ modes: [['swap'], ['habit']], cost: 'Free → $$', c: 0, steps: [
              ['Free · when it arrives', 'Unwrap new furniture outside or in a room with windows open, and keep that room aired for the first few weeks.'],
              ['Free', 'Keep rooms moderately cool and dry; heat and humidity speed formaldehyde release. Seal raw particleboard edges with a water-based sealer.'],
              ['$', 'Slipcover synthetic upholstery in washable cotton or linen; wash covers often.'],
              ['When it wears out', 'Replace foam with natural latex, cotton or kapok, and particleboard with solid wood, secondhand first.']],
              add: [F.furn] }) +
            links(r('exposures', 'healthy', 'Exposures → What healthy looks like') + ' · <a href="#lens-sewing">Sewing</a> · <a href="#lens-carpentry">Carpentry</a>') +
            src('Dris et al., <i>Environmental Pollution</i> 2017 (indoor microplastic fibers); IARC (formaldehyde, Group 1); CARB Airborne Toxic Control Measure for composite wood (2009); US EPA, TSCA Title VI formaldehyde standards.'); } },
          { id: 'dust', short: 'Dust', title: 'Dust and flame retardants', html: function () { return '<p>House dust is where many indoor chemicals end up: flame retardants and fibers from couches and electronics (' + r('home', 'furniture') + '), PFAS from carpet treatments, phthalates, lead tracked in from soil, and pesticide residues. Toddlers swallow the most, from crawling and hands-in-mouth.</p>' +
            ca('California’s old furniture rule (TB 117) pushed flame retardants into US couches for decades. Since 2014 the rule can be met without them, and labels say whether any were added. Look for “contains NO added flame retardant chemicals.”') +
            fix({ modes: [['habit']], cost: 'Free → $$', steps: [
              ['Free · today', 'Shoes off at the door, and a doormat outside. A large share of house dust comes in on shoes.'],
              ['Free', 'Wet-dust and damp-mop weekly instead of dry sweeping, which lifts dust back into the air.'],
              ['$$ · later', 'A HEPA vacuum; and when an old foam couch tears, replace or recover it.']],
              add: [F.shoes] }) +
            accs(acc('old', 'Built before 1978', 'Lead paint in dust', '<p>Lead paint was banned for homes in 1978. When older paint chips or rubs (window sills and other friction spots most), it becomes dust. Some county health departments offer free lead dust wipe kits; a home lead inspection is the bigger step. Sanding or scraping old paint needs lead-safe methods.</p>' + ca('Renters: landlords can’t create lead hazards, and you can report deteriorating paint to local code enforcement.'))) +
            src('Mitro et al., <i>Environmental Science &amp; Technology</i> 2016 (dust meta-analysis); California TB 117-2013 and SB 1019 (labels); US EPA, lead in homes.'); } },
          { id: 'wash', short: 'Washing produce', title: 'Washing pesticides off food', html: function () { return '<p>The last stop in the home is the plate. Most pesticide residue sits on the surface of fruit and vegetables, and good washing lifts a lot of it, along with soil and germs. Some pesticides are systemic, inside the plant, and no wash removes them; that’s where choosing comes in (' + r('pesticides', 'food') + ').</p>' +
            ul(['<b>Rinse and rub under running water</b>, which removes more than soaking in still water. Scrub firm produce with a brush.',
              '<b>A baking-soda soak</b> (about 1 teaspoon per 2 cups of water, 12–15 minutes, then rinse) removed more surface residue from apples than water alone in one study.',
              '<b>Skip soap, bleach and produce washes:</b> they don’t beat water, and soap residue isn’t meant to be eaten.',
              '<b>Peel and trim</b> where it makes sense: outer cabbage and lettuce leaves, the skin of conventional apples and cucumbers if you like.',
              '<b>Wash even what you’ll peel</b> (melons, citrus, avocados): the knife carries what’s on the skin into the flesh.']) +
            fix({ modes: [['habit']], cost: 'Free', steps: [
              ['Free · today', 'Rinse and rub everything under running water, even “pre-washed” bags and things you’ll peel.'],
              ['Free', 'Baking-soda soak for apples, grapes and berries.'],
              ['Next', 'For produce that holds residue inside, see what to buy organic (' + r('pesticides', 'food') + ').']],
              add: [F.wash] }) +
            links('<a href="#lens-food/cleanse/produce">Food → Cleanse</a> goes further: fruit and vegetables, greens and herbs, grains and beans (more coming)') +
            src('Yang et al., <i>Journal of Agricultural and Food Chemistry</i> 2017; Krol et al., <i>J. Agric. Food Chem.</i> 2000 (rinsing); FDA, washing fruits and vegetables.'); } }
        ] },

      /* ===== 4 · Pesticides ===== */
      { id: 'pesticides', num: 4, word: 'Pesticides', sub: 'Glyphosate, treated wood and potting mix',
        modes: ['swap', 'together'],
        lede: '“Pesticide” covers herbicides (for plants), insecticides (insects), fungicides (fungi), rodenticides (rodents) and wood preservatives, which kill the fungi and insects that rot wood. Each is designed to harm a living thing, and few stop exactly at the one intended. The “pest” is usually a neighbor whose needs our home or garden is meeting by accident; change what’s offered and most move on.',
        mode: 'Food, yard, wood and bags one at a time. Drift from fields and parks moves together.',
        subs: [
          { id: 'work', short: 'How they work', title: 'How pesticides work', html: function () { return table(['Family', 'Examples', 'Who else it reaches'], [
              ['Organophosphates', 'Chlorpyrifos, malathion', 'Nerve signaling in people and animals; linked to lower IQ after prenatal exposure'],
              ['Neonicotinoids', 'Imidacloprid (also in some flea drops)', 'Bees and other pollinators, water insects; moves through the whole plant into pollen'],
              ['Pyrethroids', 'Permethrin, bifenthrin', 'Cats, fish, water insects'],
              ['Herbicides', 'Glyphosate, 2,4-D, paraquat', 'Plants it wasn’t aimed at, soil life; paraquat is linked to Parkinson’s'],
              ['Wood preservatives', 'Copper compounds, borates, creosote', 'Soil and water near treated wood (' + r('pesticides', 'wood') + ')'],
              ['Rodenticides', 'Anticoagulant baits', 'Owls, hawks, foxes, cats and dogs who eat poisoned mice']]) +
            ca('California banned chlorpyrifos in 2020 and tightly restricts second-generation rodenticides (AB 1788, 2020; AB 1322, 2023) because of harm to mountain lions, bobcats and raptors.') +
            fix({ modes: [['swap']], cost: 'Free', steps: [
              ['Free · today', 'Gather any pesticides in the house, garage and shed. Read each active ingredient.'],
              ['Free', 'Take the ones you don’t use to household hazardous waste. Never pour them down a drain.'],
              ['Free', 'For each one, write the need it meets and a strategy without poison (' + r('pesticides', 'yard') + '), then let the poison go.']],
              add: ['Inventory pesticides; drop off unused ones'] }) +
            src('Rauh et al., <i>Environmental Health Perspectives</i> 2011 (chlorpyrifos); Tanner et al., <i>EHP</i> 2011 (paraquat); California Department of Pesticide Regulation; US EPA pesticide registration.'); } },
          { id: 'glyphosate', short: 'Glyphosate', title: 'Glyphosate', html: function () { return '<p>Glyphosate (Roundup and many store brands) is the most-used herbicide in the world. It blocks an enzyme plants, fungi and many bacteria need to build certain amino acids (the shikimate pathway). Animals don’t have that pathway, which is why it was long called safe for us, but many of our gut bacteria do.</p>' +
            does([['People', 'The WHO’s cancer agency classed it “probably carcinogenic” (2015), mainly over non-Hodgkin lymphoma; US EPA says it isn’t likely carcinogenic at expected exposures. The disagreement is real and ongoing.'],
              ['Bees', 'Lab studies found it disrupts honey bees’ gut bacteria, leaving bees more vulnerable to infection.'],
              ['Plants', 'Kills almost any green plant it touches, including milkweed, monarch butterflies’ only host. Drift damages gardens nearby.'],
              ['Soil', 'Binds to soil and can shift microbe communities; how long it lasts varies widely with soil and climate.']]) +
            '<p><b>On food:</b> besides weed-killing, glyphosate is sprayed on some crops right before harvest to dry them evenly, which leaves higher residues on oats, wheat, chickpeas, lentils and other dry beans. Certified organic rules don’t allow it.</p>' +
            fix({ modes: [['swap']], cost: '$ for a few staples', c: 1, steps: [
              ['Highest return', 'If you buy organic for only a few things, make them oats, wheat flour, chickpeas and lentils: daily staples with the most pre-harvest spray.'],
              ['Free', 'No glyphosate in your own yard: pull, mulch, smother with cardboard, or pour boiling water on cracks in paving.'],
              ['Bulk', 'Organic staples in bulk with neighbors (<a href="#lens-food/gather/spend">Food → Stretching what you spend</a>) cost far less than small packages.']],
              add: [F.oats, ['Glyphosate-free yard: mulch, pull, smother', 'Add yard too']] }) +
            home('In one study, families who switched to an all-organic diet saw the glyphosate in their urine drop about 70% in under a week.') +
            src('IARC Monographs vol. 112 (2015); US EPA glyphosate interim decision; Motta et al., <i>PNAS</i> 2018 (bee microbiota); Fagan et al., <i>Environmental Research</i> 2020; USDA National Organic Program.'); } },
          { id: 'food', short: 'On food', title: 'On our food', html: function () { return '<p>Eating more fruit and vegetables is good for nearly everyone, residues and all. The aim isn’t eating fewer plants: it’s washing well (' + r('home', 'wash') + ') and choosing organic where it matters most, since some residues sit inside the plant.</p>' +
            ul(['<b>EWG’s yearly “Dirty Dozen” and “Clean Fifteen”</b> rank produce by residue: a handy shortcut for which to buy organic.', '<b>Daily staples count most:</b> what you eat every day (oats, a favorite fruit) matters more than an occasional treat.', '<b>Ask growers:</b> at farmers’ markets, many small farms don’t spray even when they aren’t certified organic.', '<b>Grow a little:</b> greens and herbs are the easiest unsprayed food there is.']) +
            fix({ modes: [['swap']], cost: '$', c: 1, steps: [
              ['Free', 'List the five fruits and vegetables your household eats most.'],
              ['$', 'Buy organic for those that show up on the Dirty Dozen; conventional is fine for the Clean Fifteen.'],
              ['Free', 'Ask one market grower how they handle pests.']],
              add: ['Organic for our most-eaten Dirty Dozen produce'] }) +
            src('EWG, Shopper’s Guide to Pesticides in Produce.'); } },
          { id: 'yard', short: 'Yard &amp; home', title: 'Yard, home and companions', html: function () { return '<p>Most home pesticide use meets a need the house is accidentally meeting for someone else: crumbs for ants, damp for roaches, a gap for mice, still water for mosquitoes. Meet that need differently and the visitors move on.</p>' +
            table(['Visitor', 'What they need here', 'Strategy without poison'], [
              ['Ants', 'Food, water', 'Wipe the trail with soapy water, seal food in jars, caulk the entry crack'],
              ['Mice and rats', 'Shelter, food, warmth', 'Food in jars, crumbs swept; once they’ve moved on, steel wool and hardware cloth in the gaps'],
              ['Aphids', 'Soft new growth', 'Hose them off; invite ladybugs and lacewings with flowers'],
              ['Mosquitoes', 'Still water', 'Tip out saucers weekly; fine screen over rain barrels'],
              ['Fleas', 'A warm host', 'Combing, washing bedding, vacuuming; ask a vet what’s safe for that species']]) +
            care('Dog flea products with permethrin can poison cats who share a home with that dog. Use only products labeled for each animal, and keep cats away until it dries.') +
            fix({ modes: [['swap']], cost: 'Free → $', steps: [
              ['Free', 'Pick the one visitor you’re using poison for most. Find what they’re getting from the house.'],
              ['Free → $', 'Close that offer: seal, store, dry, tip out. Then retire the poison.'],
              ['Free', 'Leave a messy corner of the yard: leaves and stems shelter the insects who keep others in balance.']],
              add: [F.poison] }) +
            links(animals('Relationships: Captive animals') + ' · <a href="#lens-food/store/visitors">Food → Animals in the pantry</a> · Gardening') +
            src('UC Statewide IPM Program (ipm.ucanr.edu) pest notes; ASPCA, permethrin and cats.'); } },
          { id: 'wood', short: 'Treated wood', title: 'Treated wood, decks and beds', html: function () { return '<p>Wood preservatives are pesticides: US EPA registers them because they kill the fungi and insects that rot wood. Which one depends on when and what the wood was made for.</p>' +
            table(['Treatment', 'Where and when', 'Contains', 'Notes'], [
              ['CCA (chromated copper arsenate)', 'Most green-tinted decks, play sets, fences and beds before 2004', '[n]Arsenic, chromium, copper', 'Arsenic leaches into soil and rubs onto hands; still used for some farm and marine wood'],
              ['ACQ, copper azole, micronized copper', 'Most pressure-treated lumber since 2004', '[p]Copper plus a quat or azole fungicide', 'Far less toxic to people; copper is hard on fish and water life'],
              ['Borates', 'Indoor framing, against termites', '[y]Boron', 'Low toxicity to people; washes out in rain, so indoors only'],
              ['Creosote', 'Railroad ties, old pilings', '[n]Coal-tar compounds (PAHs)', 'Skip for gardens and play areas'],
              ['Pentachlorophenol', 'Utility poles', '[n]Penta, often with dioxins', 'EPA is phasing it out by 2027']]) +
            '<p>Indoor furniture usually isn’t pesticide-treated; its concerns are glues and finishes (' + r('home', 'furniture') + ').</p>' +
            fix({ modes: [['swap'], ['batch', 'Test soil once']], cost: 'Free → $$', c: 1, steps: [
              ['Free · always', 'Never burn treated wood or compost its sawdust; wear a mask and gloves to cut it, and wash hands after.'],
              ['Free', 'Grow food a foot in from old CCA bed walls; add the soil under old decks and play sets to your soil batch (' + r('soil', 'batch') + ').'],
              ['$', 'Coat an old CCA deck or play set yearly with a penetrating oil sealer, which cuts the arsenic that rubs off.'],
              ['$$ · later', 'Rebuild food beds in untreated cedar, redwood offcuts, stone, brick or galvanized steel.']],
              add: ['Treated wood: no burning, seal old CCA, rebuild food beds'] }) +
            links('<a href="#lens-carpentry">Carpentry</a> · Gardening') +
            src('US EPA, chromated arsenicals (CCA) and the 2003 residential phase-out; US EPA, pentachlorophenol final decision (2022); Consumer Product Safety Commission, CCA play structures and sealants.'); } },
          { id: 'potting', short: 'Potting mix', title: 'Potting mix and compost', html: function () { return '<p>A bag of potting mix feels clean, but it can carry pesticides and a few other things worth knowing.</p>' +
            ul(['<b>Herbicide carryover:</b> some weed killers used on hay and pasture (aminopyralid, clopyralid, picloram) pass through farmed animals’ guts and survive composting. Manure, hay, straw and grass-clipping compost from treated fields can carry them, and tomatoes, beans, peppers and potatoes curl and twist at parts per billion.',
              '<b>“With insect control”</b> mixes and some fertilizers contain systemic insecticides such as imidacloprid, which moves into pollen. Read the label.',
              '<b>Living germs:</b> <i>Legionella longbeachae</i>, which can cause Legionnaires’ disease, lives in some potting mixes and composts. Bags in Australia and New Zealand carry warnings; cases occur in the US too. Dust from a dry bag is how it’s breathed in.',
              '<b>Biosolids:</b> some bagged composts and fertilizers are made from treated sewage sludge, which can carry PFAS and microplastics, and it isn’t always clear on the label.',
              '<b>Dust:</b> perlite and vermiculite dust irritate lungs. Modern horticultural vermiculite is low risk for asbestos but still dusty.',
              '<b>Peat</b> comes from bogs that store huge amounts of carbon and take centuries to regrow.']) +
            fix({ modes: [['batch', 'Test each new batch'], ['habit']], cost: 'Free → $', c: 0, steps: [
              ['Free · each new batch', 'Pea test: plant three peas or beans in the new mix, compost or manure, and three in a mix you trust. If the new ones curl or cup after two or three weeks, keep it out of food beds.'],
              ['Free · every time', 'Open bags outside, pointed away from your face. Wet the mix before handling; wash hands after.'],
              ['$', 'For food pots, choose mixes that are certified organic or OMRI-listed: organic rules don’t allow sewage sludge.'],
              ['Free · over time', 'Make your own from home compost, leaf mold or coir, and a little sand.']],
              add: ['Potting mix: pea test new batches; open outside & wet it'] }) +
            accs(acc('portable', 'Pots only', 'Container gardens', '<p>Bagged soil is the whole garden here, which makes it the only soil test you need: what’s in the bag. An N95 mask for potting-up days is a kind gift to your lungs, especially for anyone with asthma or a weaker immune system.</p>')) +
            links('Composting &amp; waste · ' + r('plastics', 'soil', 'Plastic in soil and plants')) +
            src('Washington State University Extension and US EPA, persistent herbicides in compost and manure; CDC, Legionella and potting soil; Whiley &amp; Bentham, <i>Emerging Infectious Diseases</i> 2011; USDA National Organic Program (sewage sludge prohibited); US EPA, vermiculite.'); } },
          { id: 'drift', short: 'Drift', title: 'Drift from next door', html: function () { return '<p>Spray doesn’t stay where it lands. Fine droplets and vapors drift with wind and heat, sometimes for miles, into gardens, schools and homes. People living near farm fields have measurably more pesticide in house dust.</p>' +
            ca('The statewide <b>SprayDays</b> system (from 2025) posts notices of restricted farm pesticide applications ahead of time. County agricultural commissioners take drift complaints, and many applications near schools are restricted during school hours.') +
            fix({ modes: [['together'], ['habit']], cost: 'Free', steps: [
              ['Free · now', 'Sign up for SprayDays alerts for your address. Close windows and bring in laundry and companion animals on spray days.'],
              ['Free', 'A hedgerow of native shrubs on the field side catches some drift and feeds pollinators.'],
              ['Together', 'Report drift to the county ag commissioner (photo, time, wind). Neighbors reporting together get buffers changed.']],
              add: ['Sign up for SprayDays alerts'] }) +
            accs(acc('farm', 'Near fields', 'Living beside farm fields', ul(['Shoes off and wet dusting (' + r('home', 'dust') + ') matter even more here: dust is where drift settles.', 'Grow food on the far side of the house from the fields, with a hedge between.', 'Farmworker families carry the highest exposure; groups like Californians for Pesticide Reform work alongside them.']))) +
            links(r('neighbors', 'together', 'Neighbors → Changing it together') + ' · <a href="#lens-governance">Governance</a>') +
            src('California Department of Pesticide Regulation, SprayDays and drift; Ward et al., <i>EHP</i> 2006 (house dust near fields).'); } }
        ] },

      /* ===== 5 · Soil ===== */
      { id: 'soil', num: 5, word: 'Soil', sub: 'What the ground remembers',
        modes: ['batch'],
        lede: 'Soil keeps a record: old paint, leaded gasoline, orchard sprays, burned buildings. Unlike most of this course, yard soil isn’t a one-by-one job. It’s cheapest and clearest to <b>test once, all zones in one batch</b>, then decide each bed and play area from the results.',
        mode: 'Map the zones, sample them all the same day, send one lab order.',
        subs: [
          { id: 'remembers', short: 'What soil remembers', title: 'What soil remembers', html: function () { return table(['History', 'What it can leave', 'Where to look'], [
              ['House built before 1978', 'Lead from exterior paint', 'The drip line, 0–3 ft from walls'],
              ['Near a busy road (older traffic)', 'Lead from leaded gasoline', 'Edges near the street'],
              ['Old orchard land (common in California)', 'Lead and arsenic from lead arsenate sprays', 'The whole lot'],
              ['Near industry, smelters, rail yards', 'Lead, arsenic, cadmium and others', 'The whole lot'],
              ['Old treated-wood decks, beds, play sets', 'Arsenic, chromium, copper (' + r('pesticides', 'wood') + ')', 'Underneath and beside them'],
              ['Tire planters, rubber mulch', 'Zinc and other tire compounds', 'In and around them'],
              ['After a wildfire or house fire', 'Metals and combustion compounds in ash', 'Burned areas, downwind (' + r('neighbors', 'fire') + ')'],
              ['Biosolids or unknown fill', 'PFAS, metals', 'Where it was spread']]) +
            does([['People', 'Lead has no known safe level, and harms children’s developing brains most. Kids take it in from hands, toys and dust.'], ['Plants', 'Most crops take little lead into fruit; leafy greens and root vegetables take up more, and soil stuck to them carries the most.'], ['Animals', 'Dogs who dig and chickens who forage take in soil directly; so do wild birds feeding on the ground.']]) +
            src('US EPA, lead in soil; CDC, no safe blood lead level in children; ATSDR lead and arsenic profiles; UC Agriculture and Natural Resources, lead arsenate in former orchards.'); } },
          { id: 'batch', short: 'One batch', title: 'Test once, in one batch', html: function () { return '<p>One lab order covering every zone, sampled the same day, gives you a map you can garden by for years.</p>' +
            ol(['<b>Sketch the yard</b> and draw zones by use and history: each food bed, the play area, the drip line, the street edge, where dogs or chickens dig.',
              '<b>For each zone, take a composite sample:</b> 5 to 10 small scoops from across the zone, 0–6 inches deep (0–2 inches for play areas), mixed in a clean bucket. About a cup goes in a labeled bag.',
              '<b>Order one panel for all of them:</b> total lead at minimum; add arsenic for old orchard land or treated wood; a full metals panel near industry or after fire. Ask for pH and organic matter in the same run: both change how much lead plants take up.',
              '<b>Send them together.</b> Keep the map with the results.']) +
            '<div class="tx-zones"><div class="tx-zone on"><b>A · Veggie bed</b>0–6 in · 8 scoops</div><div class="tx-zone on"><b>B · Drip line</b>0–3 ft from the house</div><div class="tx-zone on"><b>C · Play area</b>0–2 in · top layer</div><div class="tx-zone"><b>D · Street edge</b>if a busy road</div><div class="tx-zone"><b>E · Dig spot</b>if dogs or chickens</div></div>' +
            table(['Lead result', 'Meaning (California)', 'Next step'], [
              ['Under 80 ppm', '[y]Below California’s screening level', 'Garden as usual; wash produce and hands'],
              ['80–200 ppm', '[p]Above California’s level, under EPA’s 200 ppm', 'Raised beds or fruiting crops; cover bare soil; extra care with kids'],
              ['200–1,200 ppm', '[n]Above EPA’s residential screening level', 'Grow food only in raised beds with new soil; mulch or plant over everything else'],
              ['Over 1,200 ppm', '[n]High', 'Ask the county health department; keep kids and animals off bare soil']]) +
            fix({ modes: [['batch', 'Test once, in one batch']], cost: '$ per zone', c: 1, steps: [
              ['Free · first', 'Draw the zone map with the planner below, and list what you know about the land’s past.'],
              ['$ · one day', 'Sample all zones that day and send one order. University and commercial labs often run a basic lead screen for roughly $15–$50 a sample.'],
              ['Free · after', 'Decide each zone from the table above, then add only the follow-up fixes that zone needs (' + r('soil', 'living') + ').']],
              add: [F.soil], note: 'One item on My list, not five: the zones ride together.' }) +
            ca('After some disasters (LA County after the 2025 Eaton fire, for one) the county has offered free soil screening. Your county health department may also know a lab or lend a lead meter.') +
            src('OEHHA, California Human Health Screening Level for lead (80 mg/kg); US EPA residential soil lead guidance (2024); UMass Soil and Plant Nutrient Testing Lab sampling guide; Cornell Waste Management Institute, <i>Healthy Soils, Healthy Communities</i>.'); } },
          { id: 'living', short: 'Living with it', title: 'Living with what you find', html: function () { return '<p>Most results fall in a range where gardening stays a joy with a few changes. Soil heals slowly, and the main move is covering it so it doesn’t become dust.</p>' +
            ul(['<b>Cover bare soil</b> with mulch, groundcover or grass: bare soil becomes house dust.', '<b>Keep pH near neutral</b> (6.5–7) and organic matter high: compost binds lead and makes it less available to plants.', '<b>Fruiting crops</b> (tomatoes, squash, beans) take up the least; leafy greens and roots the most.', '<b>Raised beds</b> with a barrier (cardboard or landscape cloth) and new soil, for higher results.', '<b>Retire tire planters and rubber mulch</b> from food areas.']) +
            legend('About sunflowers: they’re lovely, but they pull up very little lead. Plants that clean lead from soil within a garden’s lifetime haven’t panned out.') +
            fix({ modes: [['habit']], cost: 'Free → $$', steps: [
              ['Free', 'Mulch every bare patch, most of all where kids play and dogs dig.'],
              ['Free', 'Add compost every season; wash and peel root crops; rinse greens well.'],
              ['$$', 'For high zones, a raised bed with new soil. Many cities give away compost.']],
              add: ['Mulch all bare soil; compost every season'] }) +
            src('US EPA, <i>Reusing Potentially Contaminated Landscapes: Growing Gardens in Urban Soils</i>; McBride et al., <i>Soil Science</i> 2014 (lead uptake by vegetables).'); } },
          { id: 'planner', tool: true, short: 'Batch planner', title: 'Batch planner', html: function () { return '<p class="tx-legend">Build one lab order for the whole yard.</p><div class="tx-chks" id="tx-bp-hist"></div><div class="tx-chks" id="tx-bp-zones"></div><div class="tx-out" id="tx-bp-out"></div>'; } }
        ] },

      /* ===== 6 · Living toxins ===== */
      { id: 'living', num: 6, word: 'Living toxins', sub: 'Molds, blooms and plants',
        modes: ['habit'],
        lede: 'Some toxins are made by living things: molds on damp walls or old nuts, bacteria blooming in warm still water, plants protecting themselves from being eaten. They’re signals more than enemies. Each one is answering a need (water, warmth, food), and changing that is usually the fix.',
        mode: 'Moisture and storage habits do most of the work. Testing for mold is rarely needed: if you see or smell it, fix it.',
        subs: [
          { id: 'mold', short: 'House mold', title: 'Mold in the house', html: function () { return '<p>Mold needs water. Damp homes are linked with more coughing, wheezing and asthma, in children most. Spores are everywhere outdoors; indoors, the only question is whether something’s wet enough for them to grow.</p>' +
            ul(['Common spots: bathroom ceilings, window sills with condensation, behind furniture on outside walls, under sinks, closets, carpets that got wet.', 'A musty smell is mold you can’t see yet.', 'Indoor humidity between 30 and 50% keeps most mold from growing; how to keep air there is in <a href="#lens-air/ventilation/damp">Air: Damp air</a>.']) +
            does([['Allergens', 'Spores and fragments that set off sneezing, itchy eyes and asthma in sensitive people.', 'Most common'], ['Irritants', 'Musty-smelling gases (MVOCs) that irritate eyes, nose and throat.', 'Smell'], ['Mycotoxins', 'Some molds, including the “black mold” Stachybotrys, make toxins. Any mold growing indoors is worth removing, so there’s no need to test which kind it is.', 'Toxins'], ['Infections', 'Rarely, Aspergillus and others infect people with weakened immune systems.', 'Rare']]) +
            care('After a flood or leak, anything porous that stays wet more than 24–48 hours (drywall, carpet, mattresses, ceiling tiles) usually grows mold. Dry fast with fans and open windows, or let it go. For bigger cleanups: an N95, gloves and goggles, and kids, pregnant people, anyone with asthma and companion animals out of the space.') +
            kin('Birds are prone to aspergillosis from moldy seed, bedding or damp cages. Dogs who eat moldy food, compost or nuts can get tremors from mold toxins within hours (a vet right away). Stored seed, kibble and hay kept dry and sealed meets their needs.') +
            fix({ modes: [['habit']], cost: 'Free → $', steps: [
              ['Free · first', 'Find the water: a leak, condensation, a shower without a fan. Mold comes back until the water stops.'],
              ['Free', 'Small areas (under about 10 sq ft): scrub with soap and water and dry fully. Porous things that stayed wet (ceiling tiles, carpet) usually need to go.'],
              ['$', 'A $10 humidity meter; the bathroom fan for 20 minutes after showers; furniture a few inches off outside walls.']],
              add: [F.mold] }) +
            accs(acc('rent', 'Renting', 'When the leak isn’t yours to fix', ca('Since 2016, visible mold that affects health counts as a substandard-housing condition (SB 655). Write to the landlord with photos and dates, and keep a copy; local code enforcement can inspect if it isn’t fixed.') + links('<a href="#lens-relationships/request">Relationships → Requests</a>'))) +
            links('<a href="#lens-air/ventilation/damp">Air: Damp air</a> · <a href="#lens-air/what/disasters">Air: Floods and the air</a> · <a href="#lens-cleaning">Cleaning</a>') +
            src('WHO, <i>Guidelines for Indoor Air Quality: Dampness and Mould</i> (2009); US EPA, <i>A Brief Guide to Mold, Moisture and Your Home</i>; CDC, mold basics.'); } },
          { id: 'food', short: 'Food mold', title: 'Mold on food', html: function () { return '<p>Some molds make mycotoxins that heat doesn’t destroy. <b>Aflatoxin</b> (on peanuts, corn and tree nuts) harms the liver and is a known human carcinogen; <b>ochratoxin</b> grows on grains, coffee and dried fruit; <b>patulin</b> comes from rotten apples in juice.</p>' +
            table(['Moldy food', 'Keep or compost?'], [
              ['Firm fruit and vegetables (carrots, cabbage, peppers)', '[p]Cut 1 inch around the spot; keep the rest'],
              ['Soft fruit, bread, cooked grains and beans, nut butters, jam', '[n]Compost the whole thing: roots spread unseen'],
              ['Nuts, seeds or dried corn that look shriveled, discolored or taste bitter', '[n]Discard'],
              ['Tempeh’s white mycelium; a light bloom on miso', '[y]Expected: that’s the food. Black, pink or fuzzy colored mold is not.']]) +
            fix({ modes: [['habit']], cost: 'Free', steps: [
              ['Free', 'Store nuts, grains and flours cool and dry in sealed jars; nuts and whole-grain flour in the fridge or freezer.'],
              ['Free', 'Buy nuts and nut butters in amounts you’ll finish in a couple of months.'],
              ['Free', 'When sorting beans and grains, pull out discolored or shriveled ones.']],
              add: ['Nuts & grains: sealed jars, cool or frozen, small batches'] }) +
            links('<a href="#lens-food/store/pantry">Food → The pantry</a> · <a href="#lens-food/cleanse/grains">Food → Grains, beans and rice</a>') +
            src('USDA FSIS, molds on food; IARC (aflatoxins, Group 1); FDA, patulin in apple juice.'); } },
          { id: 'blooms', short: 'Blooms', title: 'Water that blooms', html: function () { return '<p>Cyanobacteria (blue-green algae) bloom in warm, still, nutrient-rich water: ponds, lakes, slow rivers, even birdbaths and water troughs. Some make toxins that harm the liver and nerves. Dogs are most at risk: they swim, drink and lick their fur, and can die within hours.</p>' +
            ul(['Look for pea-soup green, blue-green “paint,” scum, mats, or a foul smell.', 'Lawn and farm fertilizer runoff feeds blooms.']) +
            fix({ modes: [['habit'], ['together']], cost: 'Free', steps: [
              ['Free', '“When in doubt, stay out”: keep everyone, dogs first, out of scummy water; rinse a dog right away if they go in.'],
              ['Free', 'Change birdbaths and outdoor water bowls every few days.'],
              ['Together', 'Report blooms (with a photo) so others are warned; use less fertilizer near water.']],
              add: ['Dogs out of scummy water; fresh outdoor bowls & birdbaths'] }) +
            ca('The State Water Board’s Harmful Algal Bloom portal (mywaterquality.ca.gov) maps reported blooms and takes reports.') +
            src('CDC, harmful algal bloom-associated illness; California Water Boards, HAB portal.'); } },
          { id: 'plants', short: 'Plants', title: 'Plants and companions', html: function () { return '<p>Many plants make toxins so they aren’t eaten. Most people never nibble a houseplant; toddlers and companion animals might.</p>' +
            table(['Plant', 'Who it harms', 'Notes'], [
              ['True lilies, daylilies', '[n]Cats', 'Even pollen or vase water can cause kidney failure'],
              ['Sago palm', '[n]Dogs, cats, people', 'Seeds are most toxic; often fatal to dogs'],
              ['Oleander', '[n]Everyone, horses too', 'A common California hedge; a heart toxin'],
              ['Foxglove, lily of the valley', '[n]Everyone', 'Heart toxins'],
              ['Pothos, philodendron, dieffenbachia', '[p]Kids, cats, dogs', 'Mouth irritation; rarely serious'],
              ['Spider plant, Boston fern, calathea', '[y]Generally safe', 'Good picks for homes with cats']]) +
            fix({ modes: [['swap']], cost: 'Free', steps: [
              ['Free', 'Walk the house and yard and check each plant against the ASPCA toxic and non-toxic plant list.'],
              ['Free', 'Rehome toxic ones to a friend without cats or small kids, or move them out of reach.'],
              ['Free', 'No lilies in bouquets for homes with cats.']],
              add: ['Check houseplants & yard against the ASPCA plant list'] }) +
            src('ASPCA, toxic and non-toxic plants; California Poison Control System.'); } },
          { id: 'kin', short: 'Kin microbes', title: 'Most microbes are kin', html: function () { return '<p>The vast majority of molds, yeasts and bacteria are helpers: they make soil, compost, sourdough, miso and tempeh, and they train our immune systems. Children who grow up around soil, plants and animals tend to have fewer allergies. The aim of this unit is to dry out the few that harm, not to sterilize the house.</p>' +
            fix({ modes: [['habit']], cost: 'Free', steps: [
              ['Free', 'Skip antibacterial soaps and sprays for everyday use; plain soap works and spares the rest.'],
              ['Free', 'Garden, compost and ferment together. Hands in soil (washed after) are part of the fun.']],
              add: ['Plain soap over antibacterial for everyday'] }) +
            src('FDA, 2016 rule removing triclosan and 18 other ingredients from antibacterial hand soaps; von Hertzen &amp; Haahtela on the biodiversity hypothesis.'); } }
        ] },

      /* ===== 7 · Neighbors ===== */
      { id: 'neighbors', num: 7, word: 'Neighbors', sub: 'Living near polluters',
        modes: ['habit', 'together'],
        lede: 'Some exposures start beyond the property line: a freeway, a refinery, an airport, a field, a fire. Where pollution lands follows old decisions about who lived where, and the same neighborhoods carry most of it. A household can protect itself a lot; the source moves when neighbors move it together.',
        mode: 'Filter and time your air at home; move the source together.',
        subs: [
          { id: 'map', short: 'Your map', title: 'Reading your map', html: function () { return table(['Map', 'What it shows'], [
              ['CalEnviroScreen (OEHHA)', 'Pollution burden and population sensitivity for every census tract in California, ranked'],
              ['EPA Toxics Release Inventory', 'What nearby facilities report releasing to air, water and land each year'],
              ['EnviroStor (DTSC) and GeoTracker (Water Boards)', 'Cleanup sites, leaking fuel tanks, contaminated groundwater'],
              ['AirNow and PurpleAir', 'Live air quality from official monitors and community sensors'],
              ['CalGEM well finder', 'Oil and gas wells, active and idle']]) +
            fix({ modes: [['habit']], cost: 'Free', steps: [
              ['Free · 20 minutes', 'Look up your address on CalEnviroScreen and the TRI. Note anything within half a mile.'],
              ['Free', 'Use what you find to choose which fixes matter for you, and what to add to your soil batch (' + r('soil', 'batch') + ').'],
              ['Free', 'Bookmark AirNow or a nearby PurpleAir sensor for daily checks.']],
              add: ['Look up my address on CalEnviroScreen + TRI'] }) +
            src('OEHHA, CalEnviroScreen 4.0; US EPA TRI; DTSC EnviroStor; State Water Board GeoTracker; CalGEM.'); } },
          { id: 'roads', short: 'Roads &amp; airports', title: 'Roads, freeways and airports', html: function () { return '<p>Traffic pollution (fine and ultrafine particles, nitrogen dioxide, tire and brake dust) is highest within about 500 feet of a freeway and falls off with distance. It’s linked to asthma, slower lung growth in children, and heart disease. Small airports add lead: piston-engine planes still burn leaded fuel.</p>' +
            ca('The state air board has long advised against placing homes, schools and daycares within 500 feet of freeways. After a study found higher blood lead in children near Reid-Hillview airport, Santa Clara County stopped selling leaded aviation fuel at its airports in 2022. EPA found leaded avgas endangers health in 2023.') +
            fix({ modes: [['habit'], ['swap', 'One purchase']], cost: 'Free → $$', c: 2, steps: [
              ['Free', 'Open windows on the side away from the road, and outside rush hour; walk and play on side streets.'],
              ['$', 'A box fan with a MERV 13 filter taped on (a “Corsi-Rosenthal box”) cleans a room for around $60.'],
              ['$$', 'A HEPA purifier for the bedroom, sized so its CADR is at least ⅔ of the room’s square feet; MERV 13 in central air if you have it.']],
              add: [F.air] }) +
            accs(acc('road', 'Near a freeway', 'Gardens by the road', ul(['Grow food on the far side of the house, with a dense hedge between (it catches some particles).', 'Add the street edge to your soil batch (' + r('soil', 'batch') + ').', 'Rinse leafy greens well: road dust settles on leaves.']))) +
            links('Air (filters and ventilation)') +
            src('CARB, <i>Air Quality and Land Use Handbook</i> (2005); HEI Special Report 23 (2022); Zahran et al., <i>PNAS Nexus</i> 2022 (Reid-Hillview); US EPA endangerment finding on leaded avgas (2023); US EPA guide to air cleaners.'); } },
          { id: 'industry', short: 'Industry &amp; wells', title: 'Factories, refineries and wells', html: function () { return '<p>Refineries, chemical plants, metal shops, chrome platers, oil and gas wells, and warehouses with heavy truck traffic release particles, benzene, metals and other compounds. Flaring and leaks spike exposure for hours; routine releases add up over years.</p>' +
            ca('New oil and gas wells are barred within 3,200 feet of homes, schools and hospitals, with leak monitoring required for existing ones nearby (SB 1137, in effect since 2024). Refineries must run fenceline monitors with public data (AB 1647).') +
            fix({ modes: [['habit'], ['together']], cost: 'Free → $$', c: 1, steps: [
              ['Free', 'Sign up for the facility’s flaring alerts and your air district’s notices; close up and run filters during events.'],
              ['Free', 'Shoes off and wet dusting (' + r('home', 'dust') + '): industrial metals settle as dust.'],
              ['Together', 'Report odors and smoke to your local air district; repeated reports are what trigger inspections.']],
              add: ['Sign up for flaring / air district alerts'] }) +
            accs(acc('industry', 'Close by', 'Living near a plant, wells or an airport', '<p>A bedroom filter (' + r('neighbors', 'roads') + ') and a soil batch with a full metals panel (' + r('soil', 'batch') + ') are the two biggest household moves. Everything else in this unit is about the source.</p>')) +
            src('California SB 1137 (2022); AB 1647 (2017, refinery fenceline monitoring); CARB.'); } },
          { id: 'fire', short: 'After a fire', title: 'After a fire', html: function () { return '<p>When homes, cars and buildings burn, the ash holds metals (lead, arsenic) and the breakdown products of plastics, unlike ash from a campfire. Smoke from a distant wildfire is mostly fine particles; ash at home is a soil and dust problem too. After some fires, melted plastic pipes have released benzene into water systems.</p>' +
            fix({ modes: [['habit'], ['batch', 'Test once']], cost: 'Free → $', c: 1, steps: [
              ['Free', 'Don’t dry-sweep or leaf-blow ash: mist it, then scoop or HEPA-vacuum. Wear an N95 and gloves while cleaning.'],
              ['Free', 'Follow your water system’s notices; flush or don’t drink until it’s cleared.'],
              ['$ · once', 'Add fire-affected areas to your soil batch with a full metals panel (' + r('soil', 'batch') + '). Ask the county about free screening.']],
              add: ['Fire ash: wet clean + metals in soil batch'] }) +
            src('CDC and California Department of Public Health, ash cleanup guidance; Proctor et al., <i>AWWA Water Science</i> 2020 (benzene after wildfires); LA County Public Health, Eaton fire soil testing (2025).'); } },
          { id: 'together', short: 'Together', title: 'Changing it together', html: function () { return '<p>Pollution sources are permitted, which means there are hearings, comment periods and boards. Communities have closed plants, won buffers and got monitors installed by showing up with data and stories.</p>' +
            ul(['<b>AB 617</b> (2017) funds community air monitoring and emission-reduction plans in the most burdened neighborhoods, chosen with residents.', 'Community sensors (PurpleAir; some libraries lend them) build a shared record.', 'Environmental justice groups already working nearby are often the fastest way in.']) +
            kind('Living near pollution is rarely a free choice: housing, history and money set where most of us live. Protecting your household and pushing on the source together are both care.') +
            fix({ modes: [['together']], cost: 'Free', steps: [
              ['Free', 'Find out who permits the nearest source (air district, county, state) and sign up for its notices.'],
              ['Free', 'Talk with two neighbors about what they notice. Shared observations are the start of a case.'],
              ['Free', 'Comment at one hearing, even in writing: needs, observations, a clear request.']],
              add: ['Find who permits the nearest polluter; sign up for notices'] }) +
            links('<a href="#lens-governance">Governance</a> · <a href="#lens-relationships/special/neighbors">Relationships: Neighbors</a> · <a href="#lens-relationships/special/power">Power &amp; peace</a>') +
            src('CARB, Community Air Protection Program (AB 617).'); } }
        ] }
    ];
  }

  /* ---------- My list: every "How to fix" can be added; one by one, reorderable ---------- */
  var list = (function () { try { var a = JSON.parse(localStorage.getItem(LKEY) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } })();
  function saveList() { try { localStorage.setItem(LKEY, JSON.stringify(list)); } catch (e) { mn().toast('Couldn’t save: this browser is blocking site storage'); } }
  function has(t) { return list.some(function (x) { return x.title === t; }); }
  function addItem(it) { if (has(it.title)) return false; it.s = 'next'; list.push(it); return true; }
  function openCount() { return list.filter(function (x) { return x.s !== 'done'; }).length; }
  function modeHtml(m) { return (m || '').split('|').filter(Boolean).map(function (x) { var p = x.split(':'); return mode(p[0], p.slice(1).join(':')); }).join(''); }
  var LABEL = { next: 'Next', doing: 'Doing', done: 'Done' }, NEXT = { next: 'doing', doing: 'done', done: 'next' };
  function syncUi() {
    document.querySelectorAll('.tx-add[data-title]').forEach(function (b) {
      var on = has(b.getAttribute('data-title'));
      b.classList.toggle('on', on); b.textContent = on ? 'On my list' : b.getAttribute('data-label');
      b.setAttribute('aria-pressed', String(on));
    });
    var c = $('tx-cnt'); if (c) c.textContent = openCount();
    renderList();
  }
  function renderList() {
    var el = $('tx-lst'); if (!el) return;
    $('tx-empty').hidden = list.length > 0;
    el.innerHTML = list.map(function (x, i) {
      var u = UIDX[x.u], n = NUM[x.u + '/' + x.sub];
      return '<li class="tk' + (u ? u.num : 1) + (x.s === 'done' ? ' done' : '') + '"><span class="tx-num">' + (i + 1) + '</span>' +
        '<span class="tx-lt"><b>' + esc(x.title) + '</b><span>' + modeHtml(x.m) + '<span class="tx-cost">' + COST[x.c || 0] + '</span>' +
        (u && n ? '<small><a href="' + BASE + '/' + x.u + '/' + x.sub + '">' + esc(u.word) + ' ' + n + '</a></small>' : '') + (x.note ? '<small>' + esc(x.note) + '</small>' : '') + '</span></span>' +
        '<span class="tx-lctl"><button type="button" class="tx-st" data-tx="st" data-i="' + i + '" data-s="' + x.s + '">' + LABEL[x.s] + '</button>' +
        '<span class="tx-mv"><button type="button" data-tx="up" data-i="' + i + '" aria-label="Move up">▲</button><button type="button" data-tx="down" data-i="' + i + '" aria-label="Move down">▼</button></span></span></li>';
    }).join('');
    var done = list.length - openCount();
    $('tx-bar').style.width = list.length ? (done / list.length * 100) + '%' : '0';
    $('tx-sum').textContent = list.length ? done + ' of ' + list.length + ' done · ' + list.filter(function (x) { return x.s === 'doing'; }).length + ' in progress' : '';
  }

  /* ---------- Tool: Where to start. Each box maps to one fix, ranked by return for effort. ---------- */
  var WS = [
    ['heat', 'We reheat or store hot food in plastic', 'plastics', 'heat', F.heat, 0, 3, 'swap'],
    ['cans', 'We eat canned tomatoes, coconut milk or soup most weeks', 'plastics', 'cans', F.cans, 0, 2, 'swap'],
    ['pans', 'We cook with nonstick pans, some scratched', 'plastics', 'pans', F.pans, 1, 2, 'swap'],
    ['clean', 'We use spray cleaners or disinfecting wipes most days', 'home', 'cleaners', F.clean, 0, 2, 'swap'],
    ['scent', 'Plug-in fresheners, scented candles or dryer sheets', 'home', 'fragrance', F.scent, 0, 2, 'swap'],
    ['furn', 'New flat-pack furniture or polyester-foam cushions', 'home', 'furniture', F.furn, 0, 2, 'swap'],
    ['shoes', 'Shoes are worn indoors', 'home', 'dust', F.shoes, 0, 3, 'habit'],
    ['oats', 'Oats, wheat, chickpeas or lentils are daily staples', 'pesticides', 'glyphosate', F.oats, 1, 2, 'swap'],
    ['poison', 'There are ant baits, rodent poison or weed killer around', 'pesticides', 'yard', F.poison, 0, 2, 'swap'],
    ['garden', 'We grow food in the ground (or want to)', 'soil', 'batch', F.soil, 1, 3, 'batch:Test once, in one batch'],
    ['damp', 'There’s a musty smell or visible mold', 'living', 'mold', F.mold, 0, 3, 'habit'],
    ['water', 'We don’t know what’s in our tap or well water', 'plastics', 'pfas', F.water, 1, 3, 'batch'],
    ['near', 'We live near a freeway, factory, field or airport', 'neighbors', 'roads', F.air, 2, 2, 'habit']
  ];
  var wsOn = null;
  function wsInit() {
    if (wsOn) return; wsOn = {};
    if (T.kids) wsOn.shoes = 1;
    if (T.road || T.industry || T.farm) wsOn.near = 1;
    if (T.well) wsOn.water = 1;
  }
  function wsPicks() {
    return WS.filter(function (w) { return wsOn[w[0]]; }).map(function (w) {
      var score = w[6] * 2 - w[5] + (T.kids && /shoes|heat|garden/.test(w[0]) ? 2 : 0) + (T.birds && w[0] === 'pans' ? 3 : 0);
      return { w: w, score: score };
    }).sort(function (a, b) { return b.score - a.score; }).map(function (p) { return p.w; });
  }
  function wsMode(w) { var p = w[7].split(':'); return p[0] + ':' + (p[1] || MODE[p[0]]); }
  function runWs() {
    var box = $('tx-ws'); if (!box) return;
    wsInit();
    if (!box.innerHTML) box.innerHTML = WS.map(function (w) { return '<label class="tx-chk2"><input type="checkbox" data-ws="' + w[0] + '"' + (wsOn[w[0]] ? ' checked' : '') + '> ' + esc(w[1]) + '</label>'; }).join('');
    var picks = wsPicks(), out = $('tx-ws-out');
    if (!picks.length) { out.innerHTML = '<small>Tick a few boxes to see a suggested order.</small>'; return; }
    var top = picks.slice(0, 3);
    out.innerHTML = '<strong>Start with ' + (top.length === 1 ? 'this' : 'these ' + top.length) + '</strong>' +
      '<ol>' + top.map(function (w) { return '<li><a href="' + BASE + '/' + w[2] + '/' + w[3] + '">' + esc(w[4]) + '</a> <span class="tx-cost">' + COST[w[5]] + '</span></li>'; }).join('') + '</ol>' +
      (picks.length > 3 ? '<small>Then: ' + picks.slice(3).map(function (w) { return esc(w[4]); }).join(' · ') + '</small>' : '') +
      '<small>Ranked by how much each reduces for how little it costs, and who’s in the house.</small>' +
      '<div class="tx-row"><button type="button" class="btn" data-tx="ws-add">Add ' + (picks.length === 1 ? 'it' : 'these ' + picks.length) + ' to My list</button></div>';
  }

  /* ---------- Tool: Soil batch planner. One lab order for the whole yard. ---------- */
  var HIST = [
    ['h78', 'House built before 1978', ['Lead']], ['road', 'Busy road or freeway nearby', ['Lead']], ['orch', 'Was once orchard or farmland', ['Arsenic']],
    ['ind', 'Near industry, a smelter or rail yard', ['FULL']], ['fire', 'Fire-affected (ash on the property)', ['FULL']],
    ['sludge', 'Biosolids, sewage sludge or unknown fill used', ['PFAS (a separate, costlier test)']], ['tw', 'Old treated-wood beds, decks or play sets (before 2004)', ['Arsenic', 'Chromium', 'Copper']]
  ];
  var ZONES = [['bed', 'Each food bed', '0–6 in'], ['drip', 'Drip line by the house', '0–3 ft from walls, 0–2 in'], ['play', 'Play area', '0–2 in'], ['street', 'Street edge', '0–2 in'], ['dig', 'Where animals dig or forage', '0–2 in'], ['next', 'Where you’d like to plant next', '0–6 in']];
  var bp = null, beds = 1;
  function bpInit() {
    if (bp) return; bp = { bed: 1, drip: 1 };
    if (T.old) bp.h78 = 1; if (T.road) { bp.road = 1; bp.street = 1; } if (T.industry) bp.ind = 1; if (T.kids) bp.play = 1; if (T.animals) bp.dig = 1;
  }
  function runBp() {
    var h = $('tx-bp-hist'); if (!h) return;
    bpInit();
    if (!h.innerHTML) {
      h.innerHTML = '<span class="eyebrow">The land’s past</span>' + HIST.map(function (x) { return '<label class="tx-chk2"><input type="checkbox" data-bp="' + x[0] + '"' + (bp[x[0]] ? ' checked' : '') + '> ' + esc(x[1]) + '</label>'; }).join('');
      $('tx-bp-zones').innerHTML = '<span class="eyebrow">Zones to sample</span>' + ZONES.map(function (z) {
        return '<label class="tx-chk2"><input type="checkbox" data-bp="' + z[0] + '"' + (bp[z[0]] ? ' checked' : '') + '> ' + esc(z[1]) +
          (z[0] === 'bed' ? ' <select data-bp-beds aria-label="How many food beds">' + [1, 2, 3, 4, 5, 6].map(function (n) { return '<option' + (n === beds ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select>' : '') + '</label>';
      }).join('');
    }
    var zones = ZONES.filter(function (z) { return bp[z[0]]; });
    var n = zones.reduce(function (s, z) { return s + (z[0] === 'bed' ? beds : 1); }, 0);
    var tests = ['Lead'], full = false, pfas = false;
    HIST.forEach(function (x) { if (!bp[x[0]]) return; x[2].forEach(function (t) { if (t === 'FULL') full = true; else if (/PFAS/.test(t)) pfas = true; else if (tests.indexOf(t) === -1) tests.push(t); }); });
    if (full) tests = ['A full metals panel (lead, arsenic, cadmium, chromium and others)'];
    if (pfas) tests.push('PFAS (a separate, costlier test)');
    tests.push('pH and organic matter (same sample)');
    var out = $('tx-bp-out');
    if (!n) { out.innerHTML = '<small>Choose at least one zone.</small>'; return; }
    out.innerHTML = '<strong>' + n + ' sample' + (n > 1 ? 's' : '') + ', one lab order</strong>' +
      '<ul>' + zones.map(function (z) { return '<li><b>' + esc(z[1]) + (z[0] === 'bed' && beds > 1 ? ' × ' + beds : '') + '</b>: 5–10 scoops, ' + z[2] + ', mixed; one labeled bag' + (z[0] === 'bed' && beds > 1 ? ' each' : '') + '</li>'; }).join('') + '</ul>' +
      '<div><span class="eyebrow">Ask the lab for</span><ul>' + tests.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>' +
      '<small>Rough cost for a basic screen: $' + (n * 15) + '–$' + (n * 50) + (pfas ? ', plus a few hundred dollars per PFAS sample' : '') + '. Prices vary by lab; university extension labs are often lowest. Sample everything the same day and send it together.</small>' +
      '<div class="tx-row"><button type="button" class="btn" data-tx="bp-add" data-n="' + n + '">Add this batch to My list</button></div>';
  }
  function runTools() { runWs(); runBp(); syncUi(); }

  /* ---------- events (delegated; views re-render on every route) ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-tx]'); if (!b) return;
    var a = b.getAttribute('data-tx'), i = +b.getAttribute('data-i');
    if (a === 'add') {
      var t = b.getAttribute('data-title');
      if (has(t)) { list = list.filter(function (x) { return x.title !== t; }); mn().toast('Taken off My list'); }
      else { addItem({ title: t, u: b.getAttribute('data-u'), sub: b.getAttribute('data-s'), c: +b.getAttribute('data-c') || 0, m: b.getAttribute('data-m') }); mn().toast('Added to My list · ' + openCount()); }
    } else if (a === 'st') { list[i].s = NEXT[list[i].s]; if (list[i].s === 'done') mn().toast('Done. One less thing in the house.'); }
    else if (a === 'up' && i > 0) list.splice(i - 1, 0, list.splice(i, 1)[0]);
    else if (a === 'down' && i < list.length - 1) list.splice(i + 1, 0, list.splice(i, 1)[0]);
    else if (a === 'sort') list.sort(function (x, y) { return (x.s === 'done') - (y.s === 'done') || (x.c || 0) - (y.c || 0); });
    else if (a === 'clear') list = list.filter(function (x) { return x.s !== 'done'; });
    else if (a === 'ws-add') {
      var k = 0; wsPicks().forEach(function (w) { if (addItem({ title: w[4], u: w[2], sub: w[3], c: w[5], m: wsMode(w) })) k++; });
      mn().toast(k ? 'Added ' + k + ' to My list' : 'Already on your list');
    } else if (a === 'bp-add') {
      var nn = b.getAttribute('data-n') + ' samples', ex = list.filter(function (x) { return x.title === F.soil; })[0];
      if (ex) ex.note = nn; else addItem({ title: F.soil, u: 'soil', sub: 'batch', c: 1, m: 'batch:Test once, in one batch', note: nn });
      mn().toast('Batch on My list · ' + nn);
    } else return;
    saveList(); syncUi();
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.hasAttribute && t.hasAttribute('data-ws')) { wsOn[t.getAttribute('data-ws')] = t.checked ? 1 : 0; runWs(); }
    else if (t.hasAttribute && t.hasAttribute('data-bp')) { bp[t.getAttribute('data-bp')] = t.checked ? 1 : 0; runBp(); }
    else if (t.hasAttribute && t.hasAttribute('data-bp-beds')) { beds = +t.value; runBp(); }
  });

  /* ---------- profile panel ---------- */
  function onFile() {
    var p = prof(), rows = [];
    if (p.built) rows.push(['Building built', p.built]);
    if ((p.near || []).length) rows.push(['Close by', p.near.join(', ')]);
    var place = [p.home, p.shape].filter(Boolean);
    if (place.length) rows.push(['Place', place.join(' · ')]);
    if ((p.space || []).length) rows.push(['Growing space', p.space.join(', ')]);
    var hh = [Number(p.kids) > 0 ? p.kids + ' kid' + (Number(p.kids) > 1 ? 's' : '') : '', p.pets].filter(Boolean);
    if (hh.length) rows.push(['Household', hh.join(' · ')]);
    return rows;
  }
  function panel() {
    var rows = onFile(), p = prof();
    if (!p.built && !(p.near || []).length) {
      return '<div class="tx-sit"><span class="eyebrow">Tailor this course</span><p>Two questions in your Profile’s Surroundings section (when the building was built, and what’s close by) open the parts that fit, along with your place and household. Everything here stays open to everyone.</p><a class="btn personal sm" href="#profile/toxins">Answer in Profile</a></div>';
    }
    return '<div class="tx-sit"><span class="eyebrow">Tailored to your profile</span><p>Sections for you are open and marked <span class="tx-foryou is-on">For you</span>.</p>' +
      '<span class="tx-review"><a href="#profile/toxins" aria-describedby="tx-onfile">Review your profile’s surroundings</a>' +
      '<span class="tx-pop" id="tx-onfile" role="tooltip"><span class="eyebrow">On file</span>' + rows.map(function (r) { return '<span class="tx-pop-row"><b>' + esc(r[0]) + '</b>' + esc(r[1]) + '</span>'; }).join('') +
      '<span class="tx-pop-foot">Moved, or something changed nearby? Update it in your Profile.</span></span></span></div>';
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
    return '<nav class="tx-nav" aria-label="Poisons course"><details class="tx-nav-wrap"' + (wide ? ' open' : '') + '><summary class="tx-nav-head"><span class="eyebrow">Course map</span><b>Poisons</b></summary>' +
      '<a class="tx-nav-over" href="' + BASE + '"' + (!cur ? ' aria-current="page"' : '') + '>Overview</a>' +
      '<a class="tx-nav-over" href="' + BASE + '/list"' + (cur === 'list' ? ' aria-current="page"' : '') + '>My list <span class="tx-cnt" id="tx-cnt">' + openCount() + '</span></a><ol class="tx-vt">' +
      U.map(function (u) {
        var on = cur === u.id;
        return '<li class="tx-vt-unit tk' + u.num + (on ? ' cur' : '') + '"><a class="tx-vt-head" href="' + BASE + '/' + u.id + '"' + (on ? ' aria-current="page"' : '') + '><span class="tx-vt-dot">' + u.num + '</span><span><b>' + u.word + '</b><small>' + u.sub + '</small></span></a>' +
          '<ul class="tx-vt-subs">' + u.subs.map(function (s) { return '<li><a' + (s.tool ? ' class="is-tool"' : '') + ' href="' + BASE + '/' + u.id + '/' + s.id + '">' + (s.tool ? 'Tool: ' : '') + s.title + '</a></li>'; }).join('') + '</ul></li>';
      }).join('') + '</ol></details></nav>';
  }
  function layout(U, cur, main) {
    return mn().header('home') + '<div class="tx-layout">' + sidebar(U, cur) + '<main class="tx-main">' + panel() + main + '</main></div>' + mn().footer();
  }
  function way(k, title, text) { return '<div class="tx-way">' + mode(k) + '<b>' + title + '</b><p>' + text + '</p></div>'; }
  function viewOverview(U) {
    return '<section class="tx-hero"><span class="tx-lens-pill">Tier 2 · Roots · Course</span><h1 tabindex="-1">Poisons</h1>' +
      '<p class="tx-lede">Bodies (ours, our companions’, our plants’ and the soil’s) need to not be quietly worn down by what’s in the pan, the can, the couch, the ground and the air next door. Seven units that start with how exposure works and what healthy looks like, then move outward from the kitchen to the neighborhood. Every section ends with a <b>How to fix</b>, free steps first.</p></section>' +
      '<div class="tx-ways">' +
        way('swap', 'Most fixes are swaps', 'Plastics, cleaners, pans, cushions, fragrance: knock them out one at a time, at your pace and budget. Each one you add goes on <a href="' + BASE + '/list">My list</a>, in the order you choose.') +
        way('batch', 'Some things are a single batch', 'Yard soil and well water are cheapest and clearest tested once, all at the same time, with a plan. The Soil unit has a planner that builds one lab order.') +
        way('habit', 'Some are small daily moves', 'Shoes off, wet dusting, a fan when cooking, rinse-and-rub. Free, and they stack.') +
        way('together', 'Some are bigger than a household', 'A freeway, a refinery, a spray field. These move with neighbors, maps and a voice in the room.') +
      '</div>' +
      '<ol class="tx-ucards">' + U.map(function (u) {
        return '<li><a class="tx-ucard tk' + u.num + '" href="' + BASE + '/' + u.id + '"><i class="tx-band"></i><span class="tx-n">0' + u.num + '</span><b>' + u.word + '</b><span>' + u.sub + '</span><ol>' + u.subs.filter(function (s) { return !s.tool; }).map(function (s) { return '<li>' + s.title + '</li>'; }).join('') + '</ol>' +
          '<span class="tx-modes">' + u.modes.map(function (m) { return mode(m); }).join('') + '</span></a></li>';
      }).join('') + '</ol>' +
      '<aside class="tx-funfact"><span class="eyebrow">Fun fact</span><p>When families in one study swapped to fresh food with no cans or plastic packaging for just three days, the BPA in their urine dropped by about two-thirds. Some exposures leave the body that fast, which is part of why one-by-one swaps feel good: the body answers quickly.</p>' +
      '<p>Numbers come from public health research and agencies (EPA, CDC, ATSDR, FDA, California’s OEHHA and DPR), cited in each section. Laws mentioned are California’s; the chemistry is the same everywhere. Thank you to everyone who keeps this knowledge free.</p>' + src('Rudel et al., <i>Environmental Health Perspectives</i> 2011.') + '</aside>' +
      (mn().deeper ? mn().deeper('People whose work shaped this course, and where to go for more.', [
        { name: 'Dr. Yvonne Burkart', who: 'Toxicologist', work: 'Free education on everyday toxic exposures and gentler swaps.', shaped: 'This course’s view of everyday exposures' }
      ]) : '');
  }
  function viewList() {
    return '<article class="tx-unit tk3"><header class="tx-unit-hero"><span class="eyebrow">Your one-by-one list</span><h1 tabindex="-1">My list</h1><p class="tx-unit-sub">One swap at a time, in the order you choose</p>' +
      '<p class="tx-lede">Every “How to fix” you add lands here. Move the ones that matter most, or cost least, to the top, and tap the status to move it along. There’s no deadline and no score; a list that sits for a month is still a list.</p>' +
      '<div class="tx-progress" aria-hidden="true"><i id="tx-bar"></i></div><p class="tx-legend" id="tx-sum"></p></header>' +
      '<ol class="tx-lst" id="tx-lst"></ol><div class="tx-empty" id="tx-empty">Nothing here yet. Try ' + r('exposures', 'start', 'Where to start') + ' for a first few, or add any “How to fix” as you read.</div>' +
      '<div class="tx-btns"><button type="button" class="btn" data-tx="sort">Free ones first</button><button type="button" class="btn" data-tx="clear">Clear done</button>' + '<a class="btn" href="' + BASE + '/exposures/start">Where to start</a></div>' +
      legend('Saved only in this browser.') + '</article>';
  }
  function viewUnit(U, u, subId) {
    var i = U.indexOf(u), prev = U[i - 1], next = U[i + 1];
    var html = '<article class="tx-unit tk' + u.num + '">' +
      '<header class="tx-unit-hero"><span class="eyebrow">Unit ' + u.num + ' of ' + U.length + '</span><h1 tabindex="-1">' + u.word + '</h1><p class="tx-unit-sub">' + u.sub + '</p><p class="tx-lede">' + u.lede + '</p>' +
      (u.mode ? '<p class="tx-unit-mode">' + u.modes.map(function (m) { return mode(m); }).join('') + ' ' + u.mode + '</p>' : '') +
      '<ul class="tx-jumps">' + u.subs.map(function (s) { return '<li><a href="' + BASE + '/' + u.id + '/' + s.id + '"><span>' + NUM[u.id + '/' + s.id] + '</span>' + s.short + '</a></li>'; }).join('') + '</ul></header>' +
      u.subs.map(function (s) {
        CUR = { u: u.id, s: s.id };
        if (s.tool) return '<section class="tx-tool" id="tx-' + u.id + '-' + s.id + '"><span class="eyebrow">Tool</span><b class="tx-tool-t">' + s.title + '</b>' + s.html() + '</section>';
        return '<section class="tx-sub" id="tx-' + u.id + '-' + s.id + '"><div class="tx-sub-top"><span class="tx-sub-n">' + NUM[u.id + '/' + s.id] + '</span><h2>' + s.title + '</h2></div>' + s.html() + '</section>';
      }).join('') + (u.take ? u.take() : '') +
      '</article><nav class="tx-pager" aria-label="Units">' +
      (prev ? '<a href="' + BASE + '/' + prev.id + '"><small>← Previous</small><b>' + prev.num + ' · ' + prev.word + '</b></a>' : '<a href="' + BASE + '"><small>← Back to</small><b>Overview</b></a>') +
      (next ? '<a class="next" href="' + BASE + '/' + next.id + '"><small>Next unit →</small><b>' + next.num + ' · ' + next.word + '</b></a>' : '<a class="next" href="' + BASE + '/list"><small>Your list →</small><b>My list</b></a>') +
      '</nav>';
    setTimeout(function () {
      runTools();
      var el = subId && document.getElementById('tx-' + u.id + '-' + subId);
      if (el) el.scrollIntoView({ block: 'start' });
    }, 0);
    return html;
  }

  window.MN_LENS_VIEWS = window.MN_LENS_VIEWS || {};
  window.MN_LENS_VIEWS.toxins = function (sub) {
    T = tags();
    var U = units(); index(U);
    var seg = (sub || '').split('/'), u = UIDX[seg[0]];
    if (seg[0] === 'list') { setTimeout(syncUi, 0); return { title: 'My list · Poisons · Kinship', html: layout(U, 'list', viewList()) }; }
    if (u) return { title: u.word + ' · Poisons · Kinship', html: layout(U, u.id, viewUnit(U, u, seg[1])) };
    return { title: 'Poisons · Kinship', html: layout(U, null, viewOverview(U)) };
  };
})();
