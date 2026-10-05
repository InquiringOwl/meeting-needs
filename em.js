/* Emergency prep lens (tier 4, in progress): course content, profile tailoring, My prep list and a hazard tool.
   Registers window.MN_LENS_VIEWS['emergency-prep'].
   Routes: #lens-emergency-prep (overview) · #lens-emergency-prep/list · #lens-emergency-prep/<unit>[/<sub>].
   Unit 1 (What to prep for) is written; later units are planned and shown dashed. Units are blues, darkest (1) to lightest.
   Air, water and food during events link back to their Roots courses rather than repeating them. Laws mentioned are California’s. */
(function () {
  var BASE = '#lens-emergency-prep', LKEY = 'meeting-needs.em.v1';
  function mn() { return window.MN; }
  function esc(s) { return mn().esc(s); }
  function prof() { return (mn().profile && mn().profile()) || {}; }
  function $(id) { return document.getElementById(id); }

  function tags() {
    var p = prof(), t = {}, pets = p.pets || '';
    if (p.shape === 'Nothing: it all has to be portable' || p.shape === 'Small, removable things' || p.shape === 'Bigger changes, with an owner who’s on board') t.rent = 1;
    if (p.home === 'Vehicle or boat' || p.home === 'Shelter or no fixed place' || p.stay === 'No fixed place right now') t.mobile = 1;
    if (Number(p.kids) > 0 || (p.consider || []).some(function (c) { return /Pregnancy|Babies/.test(c); })) t.kids = 1;
    if ((p.consider || []).some(function (c) { return /Limited mobility|Chronic illness|Asthma/.test(c); })) t.access = 1;
    if (pets && !/^\s*(0|none|no)\s*$/i.test(pets)) t.animals = 1;
    if ((p.space || []).indexOf('Acreage or farmland') !== -1) t.land = 1;
    if (p.cold === 'Fridge and freezer' || p.cold === 'A small or shared fridge') t.fridge = 1;
    return t;
  }
  var T = {};

  var CUR = { u: '', s: '' };
  function acc(forTags, who, title, body) {
    var hit = forTags.split(' ').some(function (k) { return T[k]; });
    return '<details class="em-acc' + (hit ? ' match' : '') + '"' + (hit ? ' open' : '') + '><summary><span class="em-who">' + who + '</span><span class="em-acc-t">' + title + '</span><span class="em-foryou">For you</span></summary><div class="em-in">' + body + '</div></details>';
  }
  function accs() { return '<div class="em-accs">' + Array.prototype.join.call(arguments, '') + '</div>'; }
  function box(kind, html) { return '<p class="em-box em-' + kind + '">' + html + '</p>'; }
  function ca(h) { return box('ca', h); }
  function care(h) { return box('danger', h); }
  function together(h) { return box('together', h); }
  function kin(h) { return box('kin', h); }
  function links(h) { return '<p class="em-links">' + h + '</p>'; }
  function src(h) { return '<p class="em-src">' + h + '</p>'; }
  function legend(h) { return '<p class="em-legend">' + h + '</p>'; }
  function ul(items) { return '<ul>' + items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>'; }
  function table(head, rows) {
    return '<div class="em-tbl"><table><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { var m = /^\[(y|p|n)\](.*)$/.exec(c); return m ? '<td class="' + m[1] + '">' + m[2] + '</td>' : '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }
  function does(list) { return '<div class="em-does">' + list.map(function (d) { return '<div><b>' + d[0] + (d[2] ? ' <i>' + d[2] + '</i>' : '') + '</b><p>' + d[1] + '</p></div>'; }).join('') + '</div>'; }
  function to(hash, text) { return '<a href="' + hash + '">' + text + '</a>'; }

  var MODE = { before: 'Before', during: 'During', after: 'After', together: 'Together' };
  var COST = ['Free', '$', '$$'];
  function mode(k, label) { return '<span class="em-mode em-m-' + k + '">' + (label || MODE[k]) + '</span>'; }
  /* ready({ cost, c, steps: [[label, text]], add: [title], note }) — every hazard ends with Before · During · After */
  function ready(o) {
    var data = 'before:Before|during:During|after:After';
    var adds = (o.add || []).map(function (t, i) {
      var label = i ? 'Add this too' : 'Add to my prep list';
      return '<button type="button" class="em-add" data-em="add" data-title="' + esc(t) + '" data-label="' + label + '" data-u="' + CUR.u + '" data-s="' + CUR.s + '" data-c="' + (o.c || 0) + '" data-m="' + data + '">' + label + '</button>';
    }).join('');
    return '<div class="em-fix"><div class="em-fix-top"><b>Get ready</b>' + mode('before') + mode('during') + mode('after') + '<span class="em-cost">' + o.cost + '</span></div>' +
      '<ol class="em-steps">' + o.steps.map(function (s) { return '<li><small>' + s[0] + '</small>' + s[1] + '</li>'; }).join('') + '</ol>' +
      ((adds || o.note) ? '<div class="em-fix-foot">' + adds + (o.note ? '<span>' + o.note + '</span>' : '') + '</div>' : '') + '</div>';
  }
  var NUM = {};
  function r(u, s, text) { return '<a href="' + BASE + '/' + u + (s ? '/' + s : '') + '">' + (text || NUM[u + '/' + s] || NUM[u] || '') + '</a>'; }
  var AIR = {
    disasters: to('#lens-air/what/disasters', 'Air: Natural disasters and the air'),
    reading: to('#lens-air/what/reading', 'Air: Reading the air around events'),
    clean: to('#lens-air/ventilation/outside', 'Air: the clean room'),
    filters: to('#lens-air/ventilation/filters', 'Air: Filters'),
    heat: to('#lens-air/sun/heat', 'Air: Hot air and heat waves'),
    cold: to('#lens-air/sun/cold', 'Air: Cold air'),
    gas: to('#lens-air/smoke/gas', 'Air: carbon monoxide')
  };
  var WATER = to('#lens-water/storage', 'Water: Storage'), FOOD = to('#lens-food/store', 'Food: Store'), MOLD = to('#lens-toxins/living/mold', 'Toxins: Mold in the house'), ASH = to('#lens-toxins/neighbors/fire', 'Toxins: After a fire');
  var ANIMALS = to('#lens-relationships/special/animals', 'Emotions &amp; love: Animals'), NEIGH = to('#lens-relationships/special/neighbors', 'Emotions &amp; love: Neighbors');

  /* ---------- course content ---------- */
  function units() {
    return [
      { id: 'prepare', num: 1, word: 'What to prep for', sub: 'The events your place asks you to plan around',
        lede: 'Preparing is a calm, practical kind of care: deciding ahead of time, while things are easy, so that when something happens there are fewer decisions left. Most places have two or three events worth planning for. This unit helps you find yours, and for each one shows what to do before, during and after.',
        subs: [
          { id: 'hazards', short: 'Your hazards', title: 'Know your hazards', html: function () { return '<p>Start with the place, not the fear. A free lookup of your address shows which events actually reach you, and it’s usually a shorter list than the news suggests.</p>' +
            does([['MyHazards.CA.gov <i>California</i>', 'Earthquake, flood, fire and tsunami risk for an address, with steps for each.'], ['FEMA National Risk Index <i>US</i>', 'Every county’s risk for 18 hazards, side by side.'], ['County alerts <i>Local</i>', 'Most counties send emergency alerts by text; sign up once and it covers every event.'], ['Evacuation zones <i>Local</i>', 'Many California counties use Genasys Protect: find your zone name now, while it’s calm.']]) +
            '<p>Three things carry over to every event: a way to <b>hear</b> about it (alerts), a <b>place</b> to go and a way to get there, and <b>people</b> you’ll check on and who’ll check on you. Later units build these out.</p>' +
            ready({ cost: 'Free', steps: [['Before · today', 'Look up your address on MyHazards and write down your top two or three events.'], ['Before', 'Sign up for county alerts and find your evacuation zone name.'], ['Together', 'Swap numbers with two neighbors and agree to check on each other.']], add: ['Look up our hazards; county alerts; evacuation zone name'] }) +
            src('Cal OES, MyHazards; FEMA, National Risk Index; Ready.gov.'); } },
          { id: 'planner', tool: true, short: 'What to prep for', title: 'What to prep for', html: function () { return '<p class="em-legend">Tick what’s true for your place and household. It ranks the sections below by how much they’re likely to matter for you.</p><div class="em-chks" id="em-hz"></div><div class="em-out" id="em-hz-out"></div>'; } },
          { id: 'fire', short: 'Wildfire', title: 'Wildfire and smoke', html: function () { return '<p>Wildfire has two reaches. The fire itself reaches homes near grass, brush and forest, often pushed by wind faster than people expect. The <b>smoke</b> reaches much farther, sometimes hundreds of miles, for days at a time. Many more people plan for smoke than for flames, and both are worth a plan.</p>' +
            table(['Alert', 'Means', 'Do'], [['Evacuation warning', '[p]Danger is possible soon', 'Pack the car, gather companions, leave early if anyone needs more time.'], ['Evacuation order', '[n]Leave now', 'Go by the route officials name. Don’t wait to see flames.'], ['Shelter in place', '[p]Leaving is more dangerous', 'Stay inside, windows shut, in the most protected room.']]) +
            ca('Homes in fire hazard areas need defensible space: 100 feet of managed vegetation, with the first 5 feet (Zone 0) kept free of anything that burns, since most homes ignite from embers rather than flames (Public Resources Code §4291). CAL FIRE’s <i>Ready, Set, Go!</i> walks through it.') +
            ready({ cost: 'Free → $', c: 1, steps: [['Before', 'A go-bag by the door during fire season, N95s, and a filter ready for a clean room. Clear Zone 0.'], ['During', 'Leave at the warning if you can. In smoke, the clean room and a filter.'], ['After', 'Ash holds metals and asbestos: gloves, N95, and wet cleanup, never a leaf blower or dry sweeping.']], add: ['Fire season: go-bag by the door, N95s, clean-room filter, Zone 0 clear'] }) +
            links(AIR.disasters + ' · ' + AIR.clean + ' · ' + ASH) +
            src('CAL FIRE, <i>Ready, Set, Go!</i> and defensible space; US EPA, <i>Wildfire Smoke Guide</i>; Board of Forestry Zone 0 rulemaking.'); } },
          { id: 'quake', short: 'Earthquakes', title: 'Earthquakes', html: function () { return '<p>Earthquakes come without warning, which makes the “before” the most important part. Most injuries come from things falling and breaking, not from buildings collapsing, so securing what’s heavy and knowing one simple move go a long way.</p>' +
            does([['Drop, Cover, Hold On <i>During</i>', 'Down on hands and knees, under a sturdy table or against an inside wall with your arms over your head and neck, until the shaking stops.'], ['MyShake <i>Seconds of warning</i>', 'California’s free ShakeAlert app can give a few seconds’ notice, enough to drop and cover.'], ['Secure it <i>Before</i>', 'Strap the water heater, anchor tall furniture and shelves, latch cabinets, move heavy things down low.'], ['Shoes by the bed <i>After</i>', 'Broken glass is the most common injury afterward.']]) +
            care('After shaking: smell gas or hear hissing? Leave, and turn the gas off at the meter only if you know how. Near the coast, long or strong shaking means move to high ground right away, before any alert.') +
            ca('Water heaters must be strapped in California (Health &amp; Safety Code §19211). Many cities run free or low-cost retrofit programs for older homes (Earthquake Brace + Bolt).') +
            ready({ cost: 'Free → $', c: 1, steps: [['Before', 'Download MyShake; strap the water heater; anchor the tallest furniture; shoes and a flashlight by each bed.'], ['During', 'Drop, Cover, Hold On. In bed, stay there and cover your head with a pillow.'], ['After', 'Check people, then gas and water; expect aftershocks; N95 for dusty cleanup.']], add: ['MyShake, water heater strap, tall furniture anchored, shoes by the bed'] }) +
            links(AIR.disasters) +
            src('Earthquake Country Alliance; USGS ShakeAlert; Cal OES MyShake; California Earthquake Authority, Brace + Bolt.'); } },
          { id: 'heat', short: 'Extreme heat', title: 'Extreme heat', html: function () { return '<p>Heat waves are the deadliest weather event in the US, and the quietest. They harm most where homes hold heat, nights stay warm, power fails, or someone lives alone. The full guide to cooling bodies and rooms is in ' + AIR.heat + '; here is the plan around it.</p>' +
            ul(['<b>Know the forecast:</b> the National Weather Service issues heat advisories and warnings, often days ahead.', '<b>Know your cool place:</b> the coolest room at home, and the nearest cooling center or library (211 lists them).', '<b>Medicines:</b> some (for blood pressure, mood, allergies) change how the body handles heat; a pharmacist can say which. Insulin and some others need cool storage.', '<b>Check-ins:</b> elders, people living alone and anyone working outside, twice a day.']) +
            ready({ cost: 'Free', steps: [['Before', 'A cool-room plan, shades on sunny windows, and the nearest cooling center saved.'], ['During', 'Cool showers, wet cloths, water often; the hottest hours inside or in shade.'], ['After', 'Bodies stay tired after a heat wave; keep drinking and resting a day or two.']], add: ['Heat plan: cool room, cooling center saved, check-in list'] }) +
            links(AIR.heat + ' · ' + to('#lens-air/sun/shade', 'Air: Shade')) +
            src('National Weather Service, HeatRisk and heat safety; CDC, <i>Heat and Health</i>; Cal OES, extreme heat.'); } },
          { id: 'water', short: 'Floods &amp; storms', title: 'Floods, storms and landslides', html: function () { return '<p>In California, most floods come with atmospheric rivers: long, warm winter storms that drop weeks of rain in days. Hillsides below recent burn scars can send mud and debris flows with little warning, and creeks rise fast.</p>' +
            care('Turn around at flooded roads. Six inches of moving water can knock a person down, and about a foot can carry a car.') +
            ul(['<b>Before:</b> clean gutters and drains, move valuables and chemicals up off the floor, know whether your area floods (standard home and renter insurance doesn’t cover flooding).', '<b>During:</b> leave early if told; move to higher floors, not the attic; stay off flooded roads and away from downed lines.', '<b>After:</b> floodwater carries sewage and chemicals: boots and gloves. Anything porous that stayed wet more than a day or two grows mold; dry it out fast or let it go.']) +
            ready({ cost: 'Free → $', c: 0, steps: [['Before', 'Gutters clear, things up off the floor, a route to higher ground.'], ['During', 'Leave at the warning; never drive through water.'], ['After', 'Dry within 48 hours; mold and cleanup in Toxins.']], add: ['Storm season: gutters clear, valuables up, route to high ground'] }) +
            links(MOLD + ' · ' + to('#lens-water/purify', 'Water: Purify (if the tap is unsafe)')) +
            src('National Weather Service, <i>Turn Around Don’t Drown</i>; USGS, post-fire debris flows; FEMA, National Flood Insurance Program; CDC, flood cleanup.'); } },
          { id: 'power', short: 'Power outages', title: 'Power outages', html: function () { return '<p>Outages come with storms, heat, earthquakes and, in California, planned Public Safety Power Shutoffs (PSPS) on windy fire days. Most last hours; some last days. The plan is about light, cold food, water, medical devices and safe warmth or cooling.</p>' +
            does([['Light', 'Flashlights and headlamps rather than candles, which start home fires.', 'Safe'], ['Food', 'A closed fridge keeps food cold about 4 hours; a full freezer about 48. Keep the doors shut.', 'Cold'], ['Medical devices', 'Utilities run medical baseline programs with early outage notice; a backup battery for oxygen or CPAP.', 'Power'], ['Phones', 'A charged power bank and a car charger; a battery or hand-crank radio.', 'News']]) +
            care('Generators, grills and camp stoves stay outdoors, at least 20 feet from windows and doors. Carbon monoxide from them indoors or in a garage is one of the most common ways people are hurt after disasters.') +
            ready({ cost: '$', c: 1, steps: [['Before', 'Headlamps, a power bank, a battery radio; sign up for utility outage and PSPS alerts.'], ['During', 'Fridge and freezer shut; unplug electronics; check on neighbors with medical needs.'], ['After', 'When in doubt about food, let it go; check the temperature before eating from the fridge.']], add: ['Outage kit: headlamps, power bank, battery radio, PSPS alerts'] }) +
            links(FOOD + ' · ' + WATER + ' · ' + AIR.gas + ' · ' + AIR.cold) +
            src('USDA, food safety during power outages; CPUC and utilities, Public Safety Power Shutoffs and medical baseline; CDC, carbon monoxide after disasters.'); } },
          { id: 'animals', short: 'Animals', title: 'Animals in emergencies', html: function () { return '<p>Animals are family, and including them in the plan is part of everyone’s safety: people delay leaving, or go back, when companions are left behind. Emergency shelters are required to plan for companion animals (the federal PETS Act, 2006), and many counties shelter larger animals too.</p>' +
            does([['Companions', 'A carrier or leash for each, ID tags and microchips with current numbers, two weeks of food, water and medicines, and a photo of you together.'], ['Birds and small animals', 'Small travel cages ready; birds are very sensitive to smoke, so they leave early.'], ['Horses, goats, hens and other farmed animals', 'Trailers and a destination arranged ahead, early evacuation, and names on halters or bands. County animal services and sanctuaries coordinate evacuations.'], ['Wild neighbors', 'Shallow water dishes in smoke and heat; gates left open for animals fleeing fire when it’s safe to do so.']]) +
            kin('Animals hide when frightened. Carriers left out as everyday beds, and a treat routine for getting in, make the hurried moment calmer for everyone.') +
            ready({ cost: 'Free → $', c: 1, steps: [['Before', 'A carrier per animal, ID up to date, two weeks of food and medicine packed, a friend outside the area who can take them.'], ['During', 'Leave early with everyone; animals in carriers before the car is packed.'], ['After', 'Keep companions inside or leashed: smells and landmarks change, and ash and debris hurt paws.']], add: ['Animal go-kit: carriers, ID, two weeks of food and medicine'] }) +
            accs(acc('land', 'Land and farmed animals', 'Moving many animals at once', '<p>Larger evacuations take hours. A written list of who lives there, how many trips it takes, and neighbors with trailers who’ll help, made in calm weather, is the whole difference.</p>')) +
            links(ANIMALS + ' · ' + to('#lens-air/smoke/companions', 'Air: Smoke, scent and companions')) +
            src('Ready.gov, <i>Prepare Your Pets for Disasters</i>; Pets Evacuation and Transportation Standards (PETS) Act, 2006; CAL FIRE, animal evacuation; American Veterinary Medical Association.'); } }
        ] },
      { id: 'supplies', num: 2, word: 'Water, food &amp; supplies', sub: 'Two weeks on hand', planned: ['Water: a gallon per person a day, two weeks if you can', 'Food that keeps without power', 'Medicines, glasses and the things that are hard to replace'] },
      { id: 'gobag', num: 3, word: 'Go-bags &amp; kits', sub: 'Ready by the door', planned: ['One bag per person and per animal', 'Car, work and school kits', 'Documents and photos, kept safe'] },
      { id: 'plans', num: 4, word: 'Plans &amp; people', sub: 'Who, where, how we reach each other', planned: ['A meeting place and an out-of-area contact', 'Neighbors, check-ins and mutual aid', 'Kids, elders and access needs'] },
      { id: 'home', num: 5, word: 'Securing your home', sub: 'Doors, windows, and calm', planned: ['Locks, lights and simple reinforcements', 'Shutting off gas, water and power', 'Renters and shared buildings'] },
      { id: 'safety', num: 6, word: 'Personal safety', sub: 'Staying safe with others', planned: ['Noticing and leaving early', 'De-escalation: words before anything else', 'Self-defense basics for getting away'] }
    ];
  }

  /* ---------- My prep list ---------- */
  var list = (function () { try { var a = JSON.parse(localStorage.getItem(LKEY) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } })();
  function saveList() { try { localStorage.setItem(LKEY, JSON.stringify(list)); } catch (e) { mn().toast('Couldn’t save: this browser is blocking site storage'); } }
  function has(t) { return list.some(function (x) { return x.title === t; }); }
  function addItem(it) { if (has(it.title)) return false; it.s = 'next'; list.push(it); return true; }
  function openCount() { return list.filter(function (x) { return x.s !== 'done'; }).length; }
  var LABEL = { next: 'Next', doing: 'Doing', done: 'Done' }, NEXT = { next: 'doing', doing: 'done', done: 'next' };
  function syncUi() {
    document.querySelectorAll('.em-add[data-title]').forEach(function (b) {
      var on = has(b.getAttribute('data-title'));
      b.classList.toggle('on', on); b.textContent = on ? 'On my prep list' : b.getAttribute('data-label'); b.setAttribute('aria-pressed', String(on));
    });
    var c = $('em-cnt'); if (c) c.textContent = openCount();
    var el = $('em-lst'); if (!el) return;
    $('em-empty').hidden = list.length > 0;
    el.innerHTML = list.map(function (x, i) {
      var n = NUM[x.u + '/' + x.sub];
      return '<li class="ek1' + (x.s === 'done' ? ' done' : '') + '"><span class="em-num">' + (i + 1) + '</span><span class="em-lt"><b>' + esc(x.title) + '</b><span><span class="em-cost">' + COST[x.c || 0] + '</span>' +
        (n ? '<small><a href="' + BASE + '/' + x.u + '/' + x.sub + '">' + n + '</a></small>' : '') + '</span></span>' +
        '<span class="em-lctl"><button type="button" class="em-st" data-em="st" data-i="' + i + '" data-s="' + x.s + '">' + LABEL[x.s] + '</button>' +
        '<span class="em-mv"><button type="button" data-em="up" data-i="' + i + '" aria-label="Move up">▲</button><button type="button" data-em="down" data-i="' + i + '" aria-label="Move down">▼</button></span></span></li>';
    }).join('');
    var done = list.length - openCount();
    $('em-bar').style.width = list.length ? (done / list.length * 100) + '%' : '0';
    $('em-sum').textContent = list.length ? done + ' of ' + list.length + ' ready' : '';
  }

  /* ---------- Tool: What to prep for ---------- */
  // [id, label, sections it raises (sub id: weight)]
  var HZ = [
    ['wild', 'Near grass, brush or forest', { fire: 3 }], ['ca', 'In California (or anywhere near a fault)', { quake: 3, fire: 1, power: 1 }],
    ['low', 'Low-lying, or near a creek, river or coast', { water: 3, quake: 1 }], ['hill', 'On or below a hillside, or below a recent burn scar', { water: 2, fire: 1 }],
    ['hot', 'Summers over 95°F, or no cooling at home', { heat: 3, power: 1 }], ['psps', 'Windy fire days with power shutoffs, or power lines through brush', { power: 3, fire: 1 }],
    ['med', 'Someone relies on power or cold for medicine or devices', { power: 3, heat: 1 }], ['pets', 'Companion or farmed animals', { animals: 3 }],
    ['care', 'Kids, elders or someone who needs more time to leave', { fire: 1, heat: 1, water: 1 }]
  ];
  var hzOn = null;
  function runHz() {
    var box = $('em-hz'); if (!box) return;
    if (!hzOn) { hzOn = {}; if (T.animals || T.land) hzOn.pets = 1; if (T.kids || T.access) hzOn.care = 1; }
    if (!box.innerHTML) box.innerHTML = HZ.map(function (h) { return '<label class="em-chk2"><input type="checkbox" data-hz="' + h[0] + '"' + (hzOn[h[0]] ? ' checked' : '') + '> ' + esc(h[1]) + '</label>'; }).join('');
    var score = {};
    HZ.forEach(function (h) { if (hzOn[h[0]]) Object.keys(h[2]).forEach(function (k) { score[k] = (score[k] || 0) + h[2][k]; }); });
    var ids = Object.keys(score).sort(function (a, b) { return score[b] - score[a]; });
    var out = $('em-hz-out');
    if (!ids.length) { out.innerHTML = '<small>Tick what fits to see where to start.</small>'; return; }
    var U = UIDX.prepare;
    out.innerHTML = '<strong>Start with ' + (ids.length > 2 ? 'these' : 'this') + '</strong><ol>' + ids.slice(0, 3).map(function (k) {
      var s = U.subs.filter(function (x) { return x.id === k; })[0];
      return '<li><a href="' + BASE + '/prepare/' + k + '">' + NUM['prepare/' + k] + ' ' + s.title + '</a></li>';
    }).join('') + '</ol>' + (ids.length > 3 ? '<small>Then: ' + ids.slice(3).map(function (k) { return U.subs.filter(function (x) { return x.id === k; })[0].title; }).join(' · ') + '</small>' : '') +
      '<small>Every section stays open; this only suggests an order.</small>';
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-em]'); if (!b) return;
    var a = b.getAttribute('data-em'), i = +b.getAttribute('data-i');
    if (a === 'add') {
      var t = b.getAttribute('data-title');
      if (has(t)) { list = list.filter(function (x) { return x.title !== t; }); mn().toast('Taken off your prep list'); }
      else { addItem({ title: t, u: b.getAttribute('data-u'), sub: b.getAttribute('data-s'), c: +b.getAttribute('data-c') || 0 }); mn().toast('Added to your prep list · ' + openCount()); }
    } else if (a === 'st') { list[i].s = NEXT[list[i].s]; if (list[i].s === 'done') mn().toast('Ready. One less thing to decide later.'); }
    else if (a === 'up' && i > 0) list.splice(i - 1, 0, list.splice(i, 1)[0]);
    else if (a === 'down' && i < list.length - 1) list.splice(i + 1, 0, list.splice(i, 1)[0]);
    else if (a === 'clear') list = list.filter(function (x) { return x.s !== 'done'; });
    else return;
    saveList(); syncUi();
  });
  document.addEventListener('change', function (e) {
    var t = e.target; if (t.hasAttribute && t.hasAttribute('data-hz')) { hzOn[t.getAttribute('data-hz')] = t.checked ? 1 : 0; runHz(); }
  });

  /* ---------- layout ---------- */
  var UIDX = {};
  function index(U) {
    U.forEach(function (u) {
      UIDX[u.id] = u; NUM[u.id] = String(u.num); var n = 0;
      (u.subs || []).forEach(function (s) { if (!s.tool) { n++; NUM[u.id + '/' + s.id] = u.num + '.' + n; } else NUM[u.id + '/' + s.id] = 'Tool'; });
    });
  }
  function sidebar(U, cur) {
    var wide = window.matchMedia && window.matchMedia('(min-width: 900px)').matches;
    return '<nav class="em-nav" aria-label="Emergency prep course"><details class="em-nav-wrap"' + (wide ? ' open' : '') + '><summary class="em-nav-head"><span class="eyebrow">Course map</span><b>Emergency prep</b></summary>' +
      '<a class="em-nav-over" href="' + BASE + '"' + (!cur ? ' aria-current="page"' : '') + '>Overview</a>' +
      '<a class="em-nav-over" href="' + BASE + '/list"' + (cur === 'list' ? ' aria-current="page"' : '') + '>My prep list <span class="em-cnt" id="em-cnt">' + openCount() + '</span></a><ol class="em-vt">' +
      U.map(function (u) {
        var on = cur === u.id;
        if (u.planned) return '<li class="em-vt-unit ek' + u.num + ' is-planned"><span class="em-vt-head"><span class="em-vt-dot">' + u.num + '</span><span><b>' + u.word + '</b><small>Planned</small></span></span></li>';
        return '<li class="em-vt-unit ek' + u.num + (on ? ' cur' : '') + '"><a class="em-vt-head" href="' + BASE + '/' + u.id + '"' + (on ? ' aria-current="page"' : '') + '><span class="em-vt-dot">' + u.num + '</span><span><b>' + u.word + '</b><small>' + u.sub + '</small></span></a>' +
          '<ul class="em-vt-subs">' + u.subs.map(function (s) { return '<li><a' + (s.tool ? ' class="is-tool"' : '') + ' href="' + BASE + '/' + u.id + '/' + s.id + '">' + (s.tool ? 'Tool: ' : '') + s.title + '</a></li>'; }).join('') + '</ul></li>';
      }).join('') + '</ol></details></nav>';
  }
  function layout(U, cur, main) { return mn().header('home') + '<div class="em-layout">' + sidebar(U, cur) + '<main class="em-main">' + main + '</main></div>' + mn().footer(); }
  function viewOverview(U) {
    return '<section class="em-hero"><span class="em-lens-pill">Tier 4 · Resilience · In progress</span><h1 tabindex="-1">Emergency prep</h1>' +
      '<p class="em-lede">Plan ahead so you can stay calm when it counts. Preparing is care done early: for yourself, the people and animals you live with, and your neighbors. It starts with the events your place actually asks you to plan for, then builds out supplies, go-bags, plans and a safe home.</p></section>' +
      '<ol class="em-ucards">' + U.map(function (u) {
        if (u.planned) return '<li><div class="em-ucard ek' + u.num + ' is-planned"><i class="em-band"></i><span class="em-n">0' + u.num + ' · Planned</span><b>' + u.word + '</b><span>' + u.sub + '</span><ol>' + u.planned.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ol></div></li>';
        return '<li><a class="em-ucard ek' + u.num + '" href="' + BASE + '/' + u.id + '"><i class="em-band"></i><span class="em-n">0' + u.num + '</span><b>' + u.word + '</b><span>' + u.sub + '</span><ol>' + u.subs.filter(function (s) { return !s.tool; }).map(function (s) { return '<li>' + s.title + '</li>'; }).join('') + '</ol></a></li>';
      }).join('') + '</ol>' +
      '<aside class="em-funfact"><span class="eyebrow">Fun fact</span><p>After disasters, most rescues in the first hours are made by neighbors, not professionals. Knowing two people on your street, and what each of you needs, is one of the strongest preparations there is.</p>' +
      '<p>Guidance comes from Cal OES, CAL FIRE, FEMA and Ready.gov, the National Weather Service, USGS and the CDC, cited in each section. Laws mentioned are California’s.</p>' + links(NEIGH) + '</aside>';
  }
  function viewList() {
    setTimeout(syncUi, 0);
    return '<article class="em-unit ek2"><header class="em-unit-hero"><span class="eyebrow">Your list</span><h1 tabindex="-1">My prep list</h1><p class="em-unit-sub">One thing ready at a time</p>' +
      '<p class="em-lede">Every “Get ready” you add lands here. Order them by what your place needs first. A list worked on a little each month is a list that’s ready when it counts.</p>' +
      '<div class="em-progress" aria-hidden="true"><i id="em-bar"></i></div><p class="em-legend" id="em-sum"></p></header>' +
      '<ol class="em-lst" id="em-lst"></ol><div class="em-empty" id="em-empty">Nothing here yet. Start with ' + r('prepare', 'planner', 'What to prep for') + '.</div>' +
      '<div class="em-btns"><button type="button" class="btn" data-em="clear">Clear done</button></div>' + legend('Saved only in this browser.') + '</article>';
  }
  function viewUnit(U, u, subId) {
    var html = '<article class="em-unit ek' + u.num + '"><header class="em-unit-hero"><span class="eyebrow">Unit ' + u.num + ' of ' + U.length + '</span><h1 tabindex="-1">' + u.word + '</h1><p class="em-unit-sub">' + u.sub + '</p><p class="em-lede">' + u.lede + '</p>' +
      '<ul class="em-jumps">' + u.subs.map(function (s) { return '<li><a href="' + BASE + '/' + u.id + '/' + s.id + '"><span>' + NUM[u.id + '/' + s.id] + '</span>' + s.short + '</a></li>'; }).join('') + '</ul></header>' +
      u.subs.map(function (s) {
        CUR = { u: u.id, s: s.id };
        if (s.tool) return '<section class="em-tool" id="em-' + u.id + '-' + s.id + '"><span class="eyebrow">Tool</span><b class="em-tool-t">' + s.title + '</b>' + s.html() + '</section>';
        return '<section class="em-sub" id="em-' + u.id + '-' + s.id + '"><div class="em-sub-top"><span class="em-sub-n">' + NUM[u.id + '/' + s.id] + '</span><h2>' + s.title + '</h2></div>' + s.html() + '</section>';
      }).join('') + '</article><nav class="em-pager" aria-label="Units"><a href="' + BASE + '"><small>← Back to</small><b>Overview</b></a><a class="next" href="' + BASE + '/list"><small>Your list →</small><b>My prep list</b></a></nav>';
    setTimeout(function () { runHz(); syncUi(); var el = subId && document.getElementById('em-' + u.id + '-' + subId); if (el) el.scrollIntoView({ block: 'start' }); }, 0);
    return html;
  }

  window.MN_LENS_VIEWS = window.MN_LENS_VIEWS || {};
  window.MN_LENS_VIEWS['emergency-prep'] = function (sub) {
    T = tags();
    var U = units(); index(U);
    var seg = (sub || '').split('/'), u = UIDX[seg[0]];
    if (seg[0] === 'list') return { title: 'My prep list · Emergency prep · Kinship', html: layout(U, 'list', viewList()) };
    if (u && !u.planned) return { title: u.word.replace('&amp;', '&') + ' · Emergency prep · Kinship', html: layout(U, u.id, viewUnit(U, u, seg[1])) };
    return { title: 'Emergency prep · Kinship', html: layout(U, null, viewOverview(U)) };
  };
})();
