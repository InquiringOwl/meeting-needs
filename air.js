/* Air lens: course content, profile tailoring, My list and tools. Registers window.MN_LENS_VIEWS.air.
   Routes: #lens-air (overview) · #lens-air/notice (tool: What do you notice?) · #lens-air/list (My list) · #lens-air/<unit>[/<sub>].
   Units are yellows, darkest (1) to lightest (5): What’s in the air → Ventilation → Dust → Heat & smoke → Sun & temperature.
   Every unit is open to read in order; the tools are shortcuts into it, never a gate in front of it.
   Mold and poisons live in Poisons (Living toxins; Exposures → Companion animals); Air covers how they travel and links there.
   Natural disasters link to Emergency prep (tier 4). Laws mentioned are California’s; the physics is general. */
(function () {
  var BASE = '#lens-air', LKEY = 'meeting-needs.air.v1';
  function mn() { return window.MN; }
  function esc(s) { return mn().esc(s); }
  function prof() { return (mn().profile && mn().profile()) || {}; }
  function $(id) { return document.getElementById(id); }

  /* ---------- profile → tags ---------- */
  function tags() {
    var p = prof(), t = {}, near = p.near || [], pets = p.pets || '';
    if (p.home === 'Vehicle or boat') { t.vehicle = 1; t.portable = 1; }
    if (p.home === 'Shelter or no fixed place' || p.stay === 'No fixed place right now') { t.nohome = 1; t.portable = 1; }
    if (p.shape === 'Nothing: it all has to be portable' || p.shape === 'Small, removable things') { t.portable = 1; t.rent = 1; }
    if (p.shape === 'Bigger changes, with an owner who’s on board') t.rent = 1;
    if (p.shape === 'It’s ours to shape') t.own = 1;
    if (p.built === 'Before 1978' || p.built === 'Not sure') t.old = 1;
    if (Number(p.kids) > 0 || (p.consider || []).some(function (c) { return /Pregnancy|Babies/.test(c); })) t.kids = 1;
    if ((p.consider || []).some(function (c) { return /Asthma|Allergies/.test(c); })) t.asthma = 1;
    if (pets && !/^\s*(0|none|no)\s*$/i.test(pets)) t.animals = 1;
    if (/bird|parrot|parakeet|budgie|cockatiel|canary|finch|dove|chicken|hen/i.test(pets)) t.birds = 1;
    if (/cat|kitten/i.test(pets)) t.cats = 1;
    if (/dog|pupp/i.test(pets)) t.dogs = 1;
    if (near.indexOf('A freeway or busy road') !== -1) t.road = 1;
    if (near.indexOf('Farm fields') !== -1 || (p.space || []).indexOf('Acreage or farmland') !== -1) t.farm = 1;
    if (near.indexOf('Factory, refinery or oil and gas wells') !== -1 || near.indexOf('An airport') !== -1) t.industry = 1;
    if (p.stove === 'Gas') t.gas = 1;
    if (p.hood && p.hood !== 'Vents outside') t.nohood = 1;
    return t;
  }
  var T = {};

  /* ---------- small builders (same shapes as tox.js, ai- prefix) ---------- */
  var CUR = { u: '', s: '' };
  function acc(forTags, who, title, body) {
    var hit = forTags.split(' ').some(function (k) { return T[k]; });
    return '<details class="ai-acc' + (hit ? ' match' : '') + '" data-for="' + forTags + '"' + (hit ? ' open' : '') + '>' +
      '<summary><span class="ai-who">' + who + '</span><span class="ai-acc-t">' + title + '</span><span class="ai-foryou">For you</span></summary>' +
      '<div class="ai-in">' + body + '</div></details>';
  }
  function accs() { return '<div class="ai-accs">' + Array.prototype.join.call(arguments, '') + '</div>'; }
  function box(kind, html) { return '<p class="ai-box ai-' + kind + '">' + html + '</p>'; }
  function ca(h) { return box('ca', h); }
  function home(h) { return box('home', h); }
  function care(h) { return box('danger', h); }
  function together(h) { return box('together', h); }
  function kin(h) { return box('kin', h); }
  function bonus(h) { return box('bonus', h); }
  function links(h) { return '<p class="ai-links">' + h + '</p>'; }
  function src(h) { return '<p class="ai-src">' + h + '</p>'; }
  function legend(h) { return '<p class="ai-legend">' + h + '</p>'; }
  function ul(items) { return '<ul>' + items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>'; }
  function table(head, rows) {
    return '<div class="ai-tbl"><table><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { var m = /^\[(y|p|n)\](.*)$/.exec(c); return m ? '<td class="' + m[1] + '">' + m[2] + '</td>' : '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody></table></div>';
  }
  function does(list) { return '<div class="ai-does">' + list.map(function (d) { return '<div><b>' + d[0] + (d[2] ? ' <i>' + d[2] + '</i>' : '') + '</b><p>' + d[1] + '</p></div>'; }).join('') + '</div>'; }

  var MODE = { now: 'Right now', habit: 'Habit', once: 'Set up once', together: 'Together' };
  var COST = ['Free', '$', '$$'];
  function mode(k, label) { return '<span class="ai-mode ai-m-' + k + '">' + (label || MODE[k]) + '</span>'; }
  /* fix({ modes: [['now'], ['once']], cost: 'Free → $', c: 0, steps: [[label, text]], add: [title | [title, button label]], note }) */
  function fix(o) {
    var modes = o.modes.map(function (m) { return mode(m[0], m[1]); }).join('');
    var data = o.modes.map(function (m) { return m[0] + ':' + (m[1] || MODE[m[0]]); }).join('|');
    var adds = (o.add || []).map(function (a, i) {
      var t = typeof a === 'string' ? a : a[0], label = typeof a === 'string' ? (i ? 'Add this too' : 'Add to my list') : a[1];
      return '<button type="button" class="ai-add" data-ai="add" data-title="' + esc(t) + '" data-label="' + esc(label) + '" data-u="' + CUR.u + '" data-s="' + CUR.s + '" data-c="' + (o.c || 0) + '" data-m="' + esc(data) + '">' + esc(label) + '</button>';
    }).join('');
    return '<div class="ai-fix"><div class="ai-fix-top"><b>How to fix</b>' + modes + '<span class="ai-cost">' + o.cost + '</span></div>' +
      '<ol class="ai-steps">' + o.steps.map(function (s) { return '<li><small>' + s[0] + '</small>' + s[1] + '</li>'; }).join('') + '</ol>' +
      ((adds || o.note) ? '<div class="ai-fix-foot">' + adds + (o.note ? '<span>' + o.note + '</span>' : '') + '</div>' : '') + '</div>';
  }

  /* Cross-references by id, so numbering stays right when sub-units move. */
  var NUM = {};
  function r(u, s, text) { return '<a href="' + BASE + '/' + u + (s ? '/' + s : '') + '">' + (text || NUM[u + '/' + s] || NUM[u] || '') + '</a>'; }
  function to(hash, text) { return '<a href="' + hash + '">' + text + '</a>'; }
  var TOX = {
    mold: to('#lens-toxins/living/mold', 'Poisons: Mold in the house'),
    foodmold: to('#lens-toxins/living/food', 'Poisons: Mold on food'),
    pets: to('#lens-toxins/exposures/companions', 'Poisons: Companion animals'),
    pans: to('#lens-toxins/plastics/pans', 'Poisons: Pots and pans'),
    dust: to('#lens-toxins/home/dust', 'Poisons: Dust and flame retardants'),
    furn: to('#lens-toxins/home/furniture', 'Poisons: Furniture'),
    scent: to('#lens-toxins/home/fragrance', 'Poisons: Fragrance'),
    roads: to('#lens-toxins/neighbors/roads', 'Poisons: Roads, freeways and airports'),
    fire: to('#lens-toxins/neighbors/fire', 'Poisons: After a fire'),
    plants: to('#lens-toxins/living/plants', 'Poisons: Plants and companions')
  };
  function prep(id, text) { return to('#lens-emergency-prep/prepare' + (id ? '/' + id : ''), text || 'Emergency prep'); }
  var BODY = to('#lens-body-care', 'Body care');
  var ANIMALS = to('#lens-relationships/special/captive', 'Relationships: Captive animals');
  var REQ = to('#lens-relationships/request', 'Relationships: Requests');

  /* Titles shared by a fix card and the What do you notice? tool. */
  var F = {
    alerts: 'Save AirNow and sign up for local air and emergency alerts',
    radon: 'One radon test on the lowest lived-in floor',
    mask: 'A few well-fitting N95s for smoke and dust days',
    purge: 'Morning 5–10 minute window purge',
    night: 'Bedroom window or door open a crack at night',
    meter: 'Borrow or share a CO₂ meter (NDIR)',
    fans: 'Tissue test the hood and bathroom fan; clean filters',
    boxfan: 'Build a box-fan filter (MERV 13) for the bedroom',
    damp: 'Humidity meter, lids on, shower fan, furniture off outside walls',
    clean: 'Smoke-day clean room ready (filter + spare)',
    shoes: 'Shoes off at the door + mats in and out',
    vac: 'Weekly dust round: slow HEPA vacuum + damp mop',
    newair: 'Air new furniture out first; secondhand before new',
    test: 'Test for asbestos and lead before any renovation',
    first: 'Air on before heat (hood, fan or window first)',
    back: 'Back burners, hood on high, 15 minutes after',
    co: 'CO alarm near the bedrooms',
    induct: 'Induction hot plate + electric kettle for daily cooking',
    nonstick: 'Nonstick on low–medium only; never preheat empty',
    burn: 'Unplug fresheners; candles & incense with a window open',
    solvent: 'Solvents and sprays: outside or window open, lids on, stored out of the living space',
    pets: 'Companions out of rooms with smoke, sprays or diffusers',
    cool: 'A cool-room plan for heat waves (shade, night flush, cooling center)',
    shade: 'Outside shade on the sunniest windows',
    sun: 'Shade, hats and a mineral (zinc oxide) sunscreen by the door',
    warm: 'Safe warmth: no ovens, grills or generators indoors; CO alarm'
  };

  /* ---------- course content ---------- */
  function units() {
    return [
      /* ===== 1 · What’s in the air ===== */
      { id: 'what', num: 1, word: 'What’s in the air', sub: 'The yuckies, and reading the air around events',
        modes: ['habit', 'once'],
        lede: 'Air carries three kinds of things we didn’t ask for: particles, gases and living things. Most days indoor air is where they gather, and some days a fire, a dust storm or a flood fills the air outside too. This unit names them, then shows how to read the air yourself so the rest of the course has something to act on.',
        mode: 'Knowing the sources is free. A $20 alert sign-up or a shared sensor keeps you ahead of events.',
        subs: [
          { id: 'particles', short: 'Particles', title: 'Particles', html: function () { return '<p>Particles are named by size. <b>PM10</b> (dust, pollen, mold spores) mostly stops in the nose and throat. <b>PM2.5</b>, about a thirtieth the width of a hair, reaches deep into the lungs: smoke, cooking, traffic, fine dust. <b>Ultrafine</b> particles are smaller still, made by flames, hot pans and engines, and some pass into the blood.</p>' +
            does([['Smoke', 'Wildfire, wood, tobacco, incense, candles, burnt food.', 'Unit 4'], ['Cooking', 'Searing, frying, toasting, gas flames. The biggest indoor source in most homes.', 'Unit 4'], ['Dust', 'Settled particles kicked back up by feet, sweeping and dry dusting.', 'Unit 3'], ['Traffic & industry', 'Engines, brakes, tires, smokestacks, drifting in through windows.', 'Unit 2']]) +
            '<p>Fine particles are the air pollutant most clearly linked with heart and lung disease. There’s no level known to be harmless, so less is better, and the good news is that particles are the easiest thing in air to catch: a filter takes them out (' + r('ventilation', 'filters') + ').</p>' +
            fix({ modes: [['habit']], cost: 'Free', steps: [
              ['Free · today', 'Name the two biggest particle sources in your home. For most, it’s cooking and dust.'],
              ['Free', 'Notice when the air looks hazy in a sunbeam: that’s particles you can see. The finest ones you can’t.'],
              ['Free', 'Follow each source to its unit: cooking and smoke in ' + r('smoke') + ', dust in ' + r('dust') + '.']] }) +
            src('WHO, <i>Global Air Quality Guidelines</i> (2021); US EPA, <i>Particulate Matter Basics</i> and the 2024 annual PM2.5 standard.'); } },
          { id: 'gases', short: 'Gases', title: 'Gases', html: function () { return '<p>Gases pass straight through a filter, so the way to lower them is to stop making them or to move them out (' + r('ventilation') + '). A few are worth knowing by name:</p>' +
            table(['Gas', 'Where it comes from', 'What it does', 'More'], [
              ['Carbon dioxide (CO₂)', 'Every breath', 'Mostly a messenger: when it’s high, everything else people release is high too', r('ventilation', 'stale')],
              ['Carbon monoxide (CO)', 'Flames, engines, generators, grills', '[n]Takes the place of oxygen in blood. No smell.', r('smoke', 'gas')],
              ['Nitrogen dioxide (NO₂)', 'Gas stoves, traffic', 'Inflames airways; linked with childhood asthma', r('smoke', 'gas')],
              ['VOCs and formaldehyde', 'New furniture, paint, sprays, solvents, fragrance', 'Irritates eyes and lungs; some cause cancer over time', r('dust', 'new')],
              ['Ozone', 'Hot sunny afternoons outdoors; “ozone generator” air cleaners', 'Irritates lungs; reacts with scents to make formaldehyde', r('sun', 'heat')],
              ['Radon', 'Uranium in rock and soil, seeping up through foundations', '[n]Second leading cause of lung cancer. No smell or color.', 'Below']]) +
            '<p><b>Radon</b> is the slow, steady one: it seeps up from the ground every day you live there. Only a test tells, neighboring houses can differ a lot, and apartments above the second floor are rarely affected. The US action level is 4 picocuries per liter (pCi/L); above that, a sealed-crack and small-fan system under the floor usually brings it down by more than half.</p>' +
            ca('The California Geological Survey maps areas with higher radon potential, including parts of the Sierra foothills and Santa Barbara and Ventura counties. The California Department of Public Health offers low-cost test kits.') +
            fix({ modes: [['once']], cost: '$', c: 1, steps: [
              ['$ · once', 'One short-term radon test (about $15–$30) on the lowest lived-in floor, in fall or winter with windows mostly shut.'],
              ['Free', 'Under 4 pCi/L: done. Seal visible foundation cracks anyway.'],
              ['Ask', 'Over 4: a certified mitigator. With an owner on board, it’s a one-time fix that lasts.']],
              add: [F.radon] }) +
            src('US EPA, <i>A Citizen’s Guide to Radon</i> and <i>Introduction to Indoor Air Quality</i>; WHO, <i>Handbook on Indoor Radon</i> (2009); CDPH Radon Program.'); } },
          { id: 'living', short: 'Living things', title: 'Living things in the air', html: function () { return '<p>Some of what floats is alive, or was: pollen, mold spores, dust mite droppings, skin flakes and dander from companions, and the tiny droplets that carry colds and flu. Most are harmless to most people. For allergies and asthma they’re the main triggers, and for everyone, fresh air and filters cut how much of a cold travels from one person to the next.</p>' +
            does([['Pollen', 'Peaks on warm, dry, windy mornings in spring.', 'Outside in'], ['Mold spores', 'Everywhere outdoors; grow indoors only where it stays wet.', 'Damp'], ['Dust mites', 'Live in bedding and rugs; thrive above about 50% humidity.', 'Damp'], ['Germs', 'Ride on breath. Airflow and filters dilute them.', 'Ventilation']]) +
            '<p>Mold is where air and toxicology meet. Air carries the spores; what molds make, how they affect bodies, and how to clean them up lives in ' + TOX.mold + '. In this course, the fix is the water behind them (' + r('ventilation', 'damp') + ').</p>' +
            fix({ modes: [['habit']], cost: 'Free', steps: [
              ['Free · today', 'Pollen season: close the windows on windy mornings and air out in the evening instead.'],
              ['Free', 'Someone has a cold: a window cracked and a filter running in shared rooms.'],
              ['Free', 'Wash bedding weekly in warm water; let the bed air out uncovered in the morning.']] }) +
            links(TOX.mold + ' · ' + TOX.plants) +
            src('US EPA, <i>Indoor Air Quality: Biological Pollutants</i>; CDC, ventilation in buildings; Asthma and Allergy Foundation of America.'); } },
          { id: 'disasters', short: 'Disasters', title: 'Natural disasters and the air', html: function () { return '<p>Most disasters change the air, sometimes for days or weeks after. Knowing what each one puts into the air tells you what to have ready. The full plans for each live in ' + prep('', 'Emergency prep') + '.</p>' +
            table(['Event', 'What gets into the air', 'What helps'], [
              ['Wildfire', 'Smoke (fine particles, gases) for days, sometimes hundreds of miles away; ash from burned buildings carries metals and asbestos', 'Clean room, filter, N95 outdoors; wet cleanup of ash with gloves'],
              ['Dust storms and dry winds', 'Soil dust; in California’s Central Valley and south, the spores of the fungus behind <b>Valley fever</b>', 'Windows shut on windy days, N95 for digging or dusty work, wet the soil first'],
              ['Earthquake', 'Dust from damaged walls (which can include asbestos and lead); gas leaks', 'Leave if you smell gas; N95 for cleanup; don’t sweep debris dry'],
              ['Flood and atmospheric rivers', 'Mold within 24–48 hours in anything that stays wet; sewage odors', 'Dry or remove wet porous things fast; see ' + TOX.mold],
              ['Power outage', 'Carbon monoxide from generators, grills and camp stoves used inside', '[n]Fuel-burning things stay outdoors, 20+ feet from windows'],
              ['Heat wave', 'Ground-level ozone on hot afternoons; stale air when windows stay shut', r('sun', 'heat', 'Sun &amp; temperature')],
              ['Chemical spill or industrial fire', 'Whatever was burning or spilled', 'Follow shelter-in-place orders: windows shut, fans off, one room']]) +
            care('After a power outage, carbon monoxide from generators and grills used indoors or in garages is one of the most common ways people are hurt. A generator outdoors, far from windows, and a battery CO alarm inside.') +
            '<p><b>Masks for smoke and dust.</b> A well-fitting N95 (or KN95) filters most fine particles. Cloth and surgical masks catch very little smoke. N95s come in small sizes for kids; babies and toddlers can’t wear them safely, so for them the clean room is the protection.</p>' +
            fix({ modes: [['once'], ['together']], cost: 'Free → $', c: 1, steps: [
              ['Free · today', 'Look up which events reach your area (MyHazards.CA.gov). Most places have two or three.'],
              ['$ · once', 'A small box of N95s (about $1 each) and a battery CO alarm, kept with your emergency supplies.'],
              ['Together', 'Know which neighbors have no filter or live alone; plan to share a clean room.']],
              add: [F.mask] }) +
            accs(acc('farm', 'Fields and open land', 'Valley fever and dusty work', '<p>The fungus lives in the top few inches of dry soil in parts of California and the Southwest and becomes airborne when soil is disturbed. Wetting soil before digging, staying upwind and wearing an N95 for dusty work all lower the odds. Dogs get Valley fever too; a lingering cough after digging is worth a vet visit.</p>'),
              acc('animals', 'Companions', 'Animals in smoke and disasters', '<p>Birds, cats with asthma, flat-faced dogs and older animals feel smoke first. They come into the clean room too. Hens, rabbits and other outdoor neighbors need a sheltered, closed space and extra water. The full plan for animals lives in ' + prep('animals', 'Emergency prep: Animals') + '.</p>')) +
            links(prep('', 'Emergency prep') + ' · ' + TOX.fire) +
            src('US EPA, <i>Wildfire Smoke: A Guide for Public Health Officials</i> (2019); CDC, Valley fever (coccidioidomycosis) and carbon monoxide after disasters; Cal OES, MyHazards.'); } },
          { id: 'reading', short: 'Reading the air', title: 'Reading the air around events', html: function () { return '<p>You don’t need to guess. Agencies, neighbors’ sensors and your own senses together give a good read, and it changes hour by hour with wind, sun and the time of day.</p>' +
            table(['Air Quality Index (AQI)', 'Means', 'Indoors'], [
              ['0–50 · Good', '[y]Open up as usual', 'Windows, cross-breeze, a morning purge.'],
              ['51–100 · Moderate', '[y]Fine for most; very sensitive people may notice', 'Open up, but maybe not on the side facing the source.'],
              ['101–150 · Sensitive groups', '[p]Kids, elders, pregnancy, heart and lung conditions, companion animals', 'Windows shut on that side, a filter in the bedroom.'],
              ['151+ · Unhealthy and worse', '[n]Everyone', 'Clean room: windows shut, filter on high, no frying or candles.']]) +
            does([['AirNow &amp; Fire and Smoke Map <i>Official</i>', 'Agency monitors plus corrected low-cost sensors. The best single place to look during fires.'], ['Your air district <i>Local</i>', 'Spare the Air alerts and smoke advisories (Bay Area, South Coast and others).'], ['PurpleAir map <i>Neighbors</i>', 'Thousands of home sensors. Turn on the EPA correction; raw readings run high in smoke.'], ['Your own sensor <i>Indoors</i>', 'A $20–$250 PM2.5 monitor shows whether the clean room is working.'], ['Your senses <i>Always</i>', 'Haze hiding landmarks a few miles away, a smoky smell, itchy eyes or a cough mean the air is already telling you.']]) +
            '<p>Patterns worth knowing: smoke and traffic pollution often settle low in the early morning and lift in the afternoon; ozone peaks on hot afternoons; wind direction decides which window is the clean side.</p>' +
            fix({ modes: [['once'], ['habit']], cost: 'Free', steps: [
              ['Free · today', 'Save AirNow (or the Fire and Smoke Map) on your phone, and sign up for county emergency alerts.'],
              ['Free', 'Before opening up or heading out on an event day, a quick look: AQI and wind.'],
              ['Free → $', 'One indoor sensor, shared between neighbors or borrowed from a library, to check the clean room.']],
              add: [F.alerts] }) +
            src('US EPA, AirNow and Air Quality Index guide; US EPA and USFS, Fire and Smoke Map (low-cost sensor correction, Barkjohn et al. 2021).'); } }
        ] },

      /* ===== 2 · Ventilation ===== */
      { id: 'ventilation', num: 2, word: 'Ventilation', sub: 'Moving air to cleanse it',
        modes: ['now', 'once'],
        lede: 'Indoor air is a bathtub: things pour in (breath, cooking, damp, fumes) and the only drains are fresh air in, stale air out, and a filter in between. Ventilation is a design solution: a home built for air to move meets everyone’s need for clean air without anyone thinking about it. Most homes can get a long way there with windows, fans and a filter.',
        mode: 'Opening up works in minutes. A fan, a filter or a $30 meter keeps working after that.',
        subs: [
          { id: 'design', short: 'Design', title: 'Ventilation is design', html: function () { return '<p>There are only two ways to clean air: <b>dilute</b> it with fresh air, or <b>remove</b> what’s in it at the source. A well-designed home does both on its own:</p>' +
            does([['Openings on two sides', 'Windows and doors placed so air can cross the home.', 'Cross-breeze'], ['High and low', 'Transoms, clerestory windows, vents up high let warm stale air rise out.', 'Stack'], ['Exhaust at the source', 'A hood over the stove and a fan in the bathroom, ducted outside.', 'Remove'], ['Steady fresh air', 'A small, quiet fan bringing fresh air in all day; heat-recovery ventilators keep the warmth.', 'Dilute'], ['Filter in the path', 'A good filter on the furnace or a purifier where people sleep.', 'Clean']]) +
            '<p>Ventilation moves what floats. What has already settled into rugs, carpets and sofas stays put until it’s carried out, and kicking it back into the air with a broom or a weak vacuum undoes the work; ' + r('dust', 'vacuum', 'vacuuming that helps') + ' is the other half.</p>' +
            ca('California’s building energy code (Title 24) requires whole-house mechanical ventilation and kitchen exhaust in new homes. Schools and workplaces have ventilation rules too, which is where shared voices help.') +
            fix({ modes: [['once'], ['together']], cost: 'Free → $$', c: 1, steps: [
              ['Free · today', 'Walk the home: where can air come in, where can it go out, and what blocks the path between?'],
              ['$', 'Fill the gaps you can: a window fan, a bathroom fan that works, a filter in the bedroom.'],
              ['Together', 'Building or remodeling, or a school or workplace that feels stuffy? Ask for exhaust to the outside, fresh air supply and MERV 13 filters.']] }) +
            links(to('#lens-home-building', 'Home-building') + ' · ' + to('#lens-interior-design', 'Interior design') + ' · ' + to('#lens-governance', 'Governance')) +
            src('US EPA, <i>Ventilation and Air Quality in Homes</i>; ASHRAE Standard 62.2; California Energy Commission, Title 24 residential ventilation.'); } },
          { id: 'stale', short: 'Stale air', title: 'Stale air you can measure', html: function () { return '<p>Every breath out adds carbon dioxide (CO₂). Outdoors it sits around 420 parts per million (ppm). In a closed bedroom with two sleepers it can pass 2,000 by morning. CO₂ is the easiest single gauge of airflow: when it’s high, everything else people and the house release is building up too.</p>' +
            does([['Around 400–800 <i>Fresh</i>', 'Close to outdoor air. Plenty is moving through.'], ['800–1,200 <i>Getting stale</i>', 'Fine for a while. A good moment to crack a window.'], ['Over 1,200 <i>Stuffy</i>', 'Often felt as heavy, sleepy or headachy air. Studies link levels like this with slower thinking and lighter sleep.']]) +
            home('The first breath back into a bedroom after a walk is the free meter: if it smells like “people”, the air hasn’t been changing.') +
            fix({ modes: [['now'], ['once']], cost: 'Free → $', c: 1, steps: [
              ['Free · today', 'Sleep with a window open a crack, or the bedroom door open, even an inch.'],
              ['Free', 'Use your nose: step outside for a minute, then walk back in.'],
              ['$ · once', 'A CO₂ meter with an “NDIR” sensor (about $30–$80). Some libraries lend them; one meter can travel room to room or house to house.']],
              add: [F.night, [F.meter, 'Add the meter']] }) +
            src('ASHRAE position document on indoor carbon dioxide (2022); Allen et al., <i>Environmental Health Perspectives</i> 2016; Strøm-Tejsen et al., <i>Indoor Air</i> 2016.'); } },
          { id: 'windows', short: 'Windows', title: 'Windows and cross-breeze', html: function () { return '<p>One open window lets a little air trade places. Two openings on different sides make a path, and air moves through many times faster. Height helps too: warm air rises and leaves through a high opening while cooler air comes in low (the stack effect).</p>' +
            '<svg class="ai-flow" viewBox="0 0 720 220" role="img" aria-label="Cross-breeze: air enters a window on one side, crosses the room, and leaves through a window on the far side, where a fan points outward.">' +
            '<rect x="60" y="30" width="600" height="160" rx="14" fill="#FAF6E2" stroke="#DAC68A" stroke-width="2"/><rect x="52" y="80" width="16" height="60" rx="4" fill="#fff" stroke="#875D00" stroke-width="2"/><rect x="652" y="70" width="16" height="60" rx="4" fill="#fff" stroke="#875D00" stroke-width="2"/>' +
            '<text x="40" y="70" font-family="IBM Plex Mono, monospace" font-size="12" fill="#5C5235">fresh in</text><text x="680" y="62" font-family="IBM Plex Mono, monospace" font-size="12" fill="#5C5235" text-anchor="end">stale out</text>' +
            '<path d="M20 110 C 180 110, 260 150, 360 130 S 560 95, 700 100" fill="none" stroke="#6B4A00" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/><path d="M690 92 L704 100 L690 108" fill="none" stroke="#6B4A00" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<g transform="translate(624 100)"><circle r="18" fill="#fff" stroke="#6B4A00" stroke-width="2"/><path d="M0 -12 Q 8 -6 0 0 Q -8 -6 0 -12 M0 12 Q -8 6 0 0 Q 8 6 0 12 M-12 0 Q -6 -8 0 0 Q -6 8 -12 0 M12 0 Q 6 8 0 0 Q 6 -8 12 0" fill="#E3BC3F"/></g>' +
            '<text x="624" y="150" font-family="IBM Plex Mono, monospace" font-size="12" fill="#5C5235" text-anchor="middle">fan faces out</text><text x="360" y="182" font-family="Instrument Sans, sans-serif" font-size="14" fill="#3E3720" text-anchor="middle">Two openings, opposite sides. The fan pushes stale air out; fresh air follows.</text></svg>' +
            ul(['<b>A 5 to 10 minute wide-open purge</b> swaps most of a room’s air, even in winter; walls and furniture hold their warmth.', '<b>A fan in a window pointing out</b> pulls from the whole room, and fresh air finds its own way in through every other gap.', '<b>Interior doors</b> are part of the path. Open them between the two windows.']) +
            fix({ modes: [['now'], ['habit']], cost: 'Free', steps: [
              ['Free · today', 'Find your best cross-breeze pair: two windows on different sides, with open doors between.'],
              ['Free', 'A morning purge: both wide open for 5–10 minutes while the kettle boils. Kids love being the window crew.'],
              ['Free', 'Any fan you own, set in the far window facing out.']],
              add: [F.purge] }) +
            accs(acc('vehicle', 'Vehicle or boat', 'Small spaces fill up fast', '<p>A van or cabin holds a fraction of a room’s air, so breath and cooking build up in minutes. A roof vent fan pulling out plus one window cracked on the far side is the classic setup. A fuel heater, stove or engine run for warmth in a closed vehicle builds carbon monoxide silently (' + r('smoke', 'gas') + ').</p>'),
              acc('portable', 'Can’t change much', 'Airflow with nothing permanent', '<p>Everything here is portable: windows, doors, a box fan, a filter. A window fan that sits in the frame with no screws comes along to the next place.</p>')) +
            src('US EPA, <i>Guide to Air Cleaners in the Home</i> and ventilation guidance; Building Science Corporation on the stack effect.'); } },
          { id: 'fans', short: 'Exhaust fans', title: 'Fans that pull air out', html: function () { return '<p>A window lets air drift. An exhaust fan grabs it where it’s made: steam in the bathroom, smoke over the stove. The catch is the duct: a fan only removes air if it leads outside.</p>' +
            table(['Fan', 'What it removes', 'Make it count'], [
              ['Range hood, vented outside', '[y]Smoke, grease, combustion gases, steam', 'On before the burner, back burners first, on for 10–15 minutes after.'],
              ['Range hood, recirculating', '[p]Grease on its filter; some odor with a carbon filter', 'Doesn’t remove gases, steam or fine particles. Pair it with a window.'],
              ['Bathroom fan', '[y]Steam, odors', 'During the shower and about 20 minutes after. Hold a tissue to it: if it doesn’t cling, the fan or duct needs cleaning.'],
              ['Ceiling or standing fan', '[n]Nothing; it stirs', 'Comfortable, but it moves air around, not out. Point it at a window to help.']]) +
            legend('Green: removes it · Amber: partly · Red: moves it around.') +
            fix({ modes: [['habit']], cost: 'Free → $', steps: [
              ['Free · today', 'The tissue test on every exhaust fan. Look outside for a flap where it should exit.'],
              ['Free', 'Hood on before the burner; bathroom fan on before the shower.'],
              ['Free → $', 'Soak a greasy hood filter in hot water with baking soda and a drop of dish soap; dust off the bathroom fan grille.']],
              add: [F.fans] }) +
            accs(acc('nohood', 'No vented hood', 'Getting kitchen air out anyway', ul(['A box fan in the nearest window facing out, running while you cook, does much of a hood’s job.', 'Lids on pots cut steam and spatter at the source.', 'A HEPA filter near the kitchen catches fine smoke particles (not gases).'])),
              acc('rent', 'Renting', 'Asking for a working fan', ca('Bathrooms need either a window that opens or a working exhaust fan under California’s housing code. A clear, dated request with a photo works best.') + links(REQ))) +
            src('Lawrence Berkeley National Laboratory, range hood capture efficiency (Delp &amp; Singer 2012); California Health &amp; Safety Code §17920.3.'); } },
          { id: 'filters', short: 'Filters', title: 'Filters that clean moving air', html: function () { return '<p>A filter catches particles (smoke, dust, pollen, spores, the droplets that carry colds) from air pushed through it. It doesn’t remove gases like CO₂, cooking fumes or most smells; that’s what airflow is for. Three labels tell you what you’re getting:</p>' +
            does([['HEPA <i>Purifiers</i>', 'Catches at least 99.97% of particles at the hardest size to catch. Real HEPA, not “HEPA-type”.'], ['MERV 13 <i>Furnace &amp; box fans</i>', 'Catches most fine smoke particles while letting air flow easily.'], ['CADR <i>How much</i>', 'Clean air delivery rate: cubic feet of clean air per minute. Bigger room, bigger number.']]) +
            '<p><b>The box-fan filter.</b> A 20-inch box fan with a MERV 13 filter strapped to it is a well-tested, low-cost purifier. Four filters taped into a cube around the fan (a Corsi–Rosenthal box) clean several times more air, often rivaling purifiers that cost far more. Neighbors build them together and share spare filters.</p>' +
            care('Skip ozone generators, “activated oxygen” and most ionizers: ozone irritates lungs and reacts with scents to make formaldehyde. Houseplants are lovely kin, but a home would need hundreds per room to clean air measurably.') +
            ca('Air cleaners sold in California have to meet CARB’s ozone limit (0.050 ppm), and CARB keeps a list of certified devices.') +
            fix({ modes: [['once'], ['together']], cost: '$', c: 1, steps: [
              ['Free · first', 'Airflow first. A filter is for particles you can’t open a window on: smoke days, a busy road, a cold.'],
              ['$ · once', 'Box fan + MERV 13 filter, or a four-filter cube, sized with the ' + r('ventilation', 'sizer', 'Filter sizer') + '. A newer fan (2012 or later) with a UL or ETL mark.'],
              ['Together', 'Build a batch with neighbors, a school or a library, and keep a few ready for fire season.']],
              add: [F.boxfan] }) +
            src('US EPA, <i>Guide to Air Cleaners in the Home</i> and research on DIY air cleaners; Dal Porto et al., <i>Aerosol and Air Quality Research</i> 2022; Cummings &amp; Waring, <i>Journal of Exposure Science &amp; Environmental Epidemiology</i> 2019; CARB Air Cleaner Regulation.'); } },
          { id: 'damp', short: 'Damp air', title: 'Damp air', html: function () { return '<p>Air always carries water you can’t see. Warm air holds more, cool air less, so when warm damp air meets a cold window or wall, the water lands. Where it lands and stays, mold and dust mites move in. Moving damp air out is part of ventilation’s job.</p>' +
            '<div class="ai-band" role="img" aria-label="Humidity: under 30 percent dry; 30 to 50 sweet spot; 50 to 60 dust mites thrive; over 60 mold and condensation."><div class="dry"><b>Under 30%</b>Dry skin, static, cracking wood</div><div class="ok"><b>30–50%</b>Sweet spot</div><div class="edge"><b>50–60%</b>Dust mites thrive</div><div class="wet"><b>Over 60%</b>Mold, musty smells, condensation</div></div>' +
            table(['Where the water comes from', 'The fix'], [
              ['Showers and baths', 'Fan on, door shut while it runs, a window cracked; a 1-minute squeegee sends the water down the drain instead of into the air.'],
              ['Cooking, especially boiling', 'Lids on; hood or window fan on.'],
              ['Laundry drying indoors', 'Outside when you can; inside, one room with the door shut and the window open.'],
              ['Breathing and sleeping', 'A cracked window at night.'],
              ['Cold spots: windows, outside corners, behind furniture', 'Wipe morning condensation; furniture 2–4 inches off outside walls; closet doors cracked.'],
              ['Leaks, wet ground, crawlspaces', 'Find and stop; gutters and soil sloping away from the walls.']]) +
            '<p><b>Too dry</b> (under 30%, common with winter heat) is gentler to fix: laundry drying on a rack inside, bathwater left to cool in the tub. A humidifier needs cleaning every few days and distilled water, or it spreads mold and fine mineral dust; stop at 50%.</p>' +
            '<p>Where damp has already become mold, everything about it (what it makes, who it affects, how to clean it, and renters’ rights) lives in ' + TOX.mold + '.</p>' +
            fix({ modes: [['habit'], ['once']], cost: 'Free → $', c: 1, steps: [
              ['$ · once', 'A $10 humidity meter (hygrometer). Check it mornings, after showers and after cooking for a week.'],
              ['Free · today', 'Lids on boiling pots and a shower squeegee: two habits kids can own.'],
              ['Free', 'Furniture off outside walls, morning window wipe, then a 5-minute purge to carry the water out.']],
              add: [F.damp] }) +
            accs(acc('vehicle', 'Vehicle or boat', 'Metal walls and morning drips', '<p>Thin walls are always cold, so condensation comes every night. A roof fan on low while sleeping, a cracked window and a towel routine make the most difference; check under the mattress weekly.</p>')) +
            kin('Many houseplants come from humid forests. Grouping them on a tray of pebbles and water raises the air around their leaves without raising the room.') +
            links(TOX.mold + ' · ' + TOX.foodmold) +
            src('US EPA, <i>A Brief Guide to Mold, Moisture and Your Home</i>; Building Science Corporation, moisture sources; US EPA, <i>Use and Care of Home Humidifiers</i>.'); } },
          { id: 'outside', short: 'Closing up', title: 'When outside air is worse', html: function () { return '<p>Most days, outside air is cleaner than inside. Wildfire smoke, a freeway at rush hour and high-pollen days flip that. Then the plan turns around: close up, keep air moving through a filter, and make one room the <b>clean room</b>.</p>' +
            ul(['Choose the room with the fewest windows and doors to the outside, usually a bedroom.', 'Windows and doors shut; a filter running on high; the door to the room closed.', 'No frying, candles, incense or vacuuming without a HEPA filter while it’s smoky.', 'A central system set to recirculate with a MERV 13 filter, if you have one.', 'Check ' + r('what', 'reading', 'the air outside') + ' and open up again once it clears; stale air builds up too.']) +
            kin('Birds, cats with asthma and older dogs feel smoke early; they belong in the clean room. Leave water out for wild visitors, whose need rises on smoky days.') +
            fix({ modes: [['once'], ['together']], cost: 'Free → $', c: 1, steps: [
              ['Free · now', 'Choose the clean room and save AirNow on your phone.'],
              ['$', 'One filter ready for that room, with a spare, before fire season.'],
              ['Together', 'Check on neighbors who live alone or have no filter; lend yours if their room needs it more.']],
              add: [F.clean] }) +
            accs(acc('road', 'Near a freeway', 'The busy-road rhythm', '<p>Traffic pollution is highest within about 500 feet of a freeway and peaks at rush hours. Air out on the side away from the road, midday or late evening, and run a filter in the bedroom overnight.</p>' + links(TOX.roads)),
              acc('farm', 'Near fields', 'Spray days and dust', '<p>Close the windows facing fields on windy days and when spraying is planned (California’s SprayDays notices list upcoming applications).</p>')) +
            src('US EPA, <i>Create a Clean Room to Protect Indoor Air Quality During a Wildfire</i>; CARB, <i>Air Quality and Land Use Handbook</i> (2005); California DPR SprayDays.'); } },
          { id: 'sizer', tool: true, short: 'Filter sizer', title: 'Filter sizer', html: function () { return '<p class="ai-legend">How much filter does this room need?</p>' +
            '<div class="ai-row"><label class="ai-f">Length (ft)<input type="number" id="ai-fs-l" value="12" min="4" max="60"></label><label class="ai-f">Width (ft)<input type="number" id="ai-fs-w" value="11" min="4" max="60"></label><label class="ai-f">Ceiling (ft)<input type="number" id="ai-fs-h" value="8" min="6" max="20"></label>' +
            '<label class="ai-f">For<select id="ai-fs-for"><option value="4">Everyday</option><option value="6">Smoke days or someone sick</option></select></label></div><div class="ai-out" id="ai-fs-out"></div>'; } }
        ] },

      /* ===== 3 · Dust ===== */
      { id: 'dust', num: 3, word: 'Dust', sub: 'What settles, and carrying it out',
        modes: ['habit', 'once'],
        lede: 'Some things reach the air slowly: a couch breathing out, paint wearing off a window frame, fibers from an old ceiling. What they release settles into dust, and indoors, out of sun and rain, dust keeps it for years. Ventilation can’t reach what has settled. Vacuuming and damp cleaning carry it out, and leaving well-sealed old materials alone keeps the rest where it is.',
        mode: 'Shoes off, a good vacuum, a damp cloth. Test before you renovate.',
        subs: [
          { id: 'sponge', short: 'Dust is a sponge', title: 'Dust is a sponge', html: function () { return '<p>House dust is skin, hair, fibers, pollen and soil, and it soaks up chemicals from everything around it: flame retardants from foam, phthalates from vinyl, PFAS from treated fabrics, lead from old paint, pesticides tracked in on shoes. Outdoors, sun and rain break many of these down in days. Indoors they can last for years.</p>' +
            does([['Floors <i>Where it lands</i>', 'Most dust ends up on floors and in rugs, right where crawling babies, toddlers and companion animals spend their time.'], ['Hands <i>How it moves</i>', 'Little ones swallow an estimated few dozen milligrams of dust and soil a day, hand to mouth.'], ['Air <i>When stirred</i>', 'Walking, sweeping and dry dusting toss the finest dust back up for an hour or more.']]) +
            fix({ modes: [['habit']], cost: 'Free', steps: [
              ['Free · today', 'Shoes off at the door and a mat outside and in. It cuts tracked-in lead and pesticides more than any other single step.'],
              ['Free', 'Wash hands before eating, kids especially after floor and yard play.'],
              ['Free', 'A damp cloth instead of a feather duster: it carries dust out rather than lifting it.']],
              add: [F.shoes] }) +
            links(TOX.dust) +
            src('Mitro et al., <i>Environmental Science &amp; Technology</i> 2016; US EPA, <i>Exposure Factors Handbook</i>, ch. 5.'); } },
          { id: 'vacuum', short: 'Vacuuming', title: 'Vacuuming that helps', html: function () { return '<p>Vacuuming is the main way long-lasting things leave a home, especially from rugs, carpets and upholstery, where dust sinks in. The vacuum matters: one without a good filter catches the big bits and blows the finest dust, the part carrying the most chemicals, right back out the exhaust. Sweeping and shaking rugs indoors do the same.</p>' +
            ul(['<b>A HEPA filter and a sealed body.</b> “Sealed system” is the phrase to look for; HEPA means little if air leaks around it. Bagged vacuums keep dust in when emptied.', '<b>Slow passes.</b> Slow strokes, several over the same spot, lift far more from carpet than quick ones.', '<b>Window open, then back.</b> Vacuuming lifts some fine dust for a while. A window open and little ones and companions in another room for half an hour lets it settle or leave.', '<b>Then a damp mop</b> on hard floors. Dry sweeping mostly stirs.', '<b>Rugs:</b> washable cotton ones go in the laundry; others get beaten outside, away from windows.', '<b>Empty it outside</b>, and tap out filters outdoors.']) +
            together('A weekly dust round: one person vacuums, one damp-wipes sills and baseboards, the smallest one wrings out cloths. Music on, ten minutes, done together.') +
            fix({ modes: [['habit'], ['together']], cost: 'Free → $$', c: 1, steps: [
              ['Free · this week', 'Vacuum slowly with a window open, then damp-mop hard floors. Weekly, or twice with crawlers or shedding companions.'],
              ['Free', 'Borrow a HEPA vacuum from a tool library or neighbor before buying one.'],
              ['$$ · once', 'If buying: sealed HEPA, bagged if possible. Secondhand ones with a fresh filter work well.']],
              add: [F.vac] }) +
            accs(acc('kids', 'Little ones', 'Floors for crawlers', '<p>A washable cotton rug or play mat laundered weekly gives a clean zone. Wet-wipe window sills too: in older homes they’re where lead dust collects (' + r('dust', 'disturbed') + ').</p>'),
              acc('animals', 'Companions', 'Fur, dander and noses near the floor', '<p>Dogs and cats breathe at floor level and groom dust off their fur, so the floor is their air. Washable bedding, brushing outside and vacuuming their favorite spots help them and anyone with allergies. Many animals find vacuums scary; another room with a treat while it runs meets their need for safety.</p>')) +
            links(TOX.dust + ' · ' + to('#lens-cleaning', 'Cleaning')) +
            src('Lioy et al., <i>Journal of the Air &amp; Waste Management Association</i> 1999; Knibbs et al., <i>Environmental Science &amp; Technology</i> 2012; US HUD, lead-safe cleaning guidance.'); } },
          { id: 'new', short: 'New things', title: 'New things breathe out', html: function () { return '<p>New furniture, mattresses, flooring, carpet and paint release chemicals (VOCs, and formaldehyde from pressed wood) for weeks to months. The “new smell” is the strongest part; it fades as the material settles, faster when the space is warm and well aired. Things that are already old have mostly finished.</p>' +
            ul(['<b>Secondhand is already aired out.</b> Used furniture and solid-wood pieces did most of their off-gassing years ago.', '<b>Air new things out first</b> in a garage, porch or spare room with the window open, for a week or two if you can.', '<b>Low- or zero-VOC paint</b>, windows open and a fan out while it dries, and a few days before sleeping in the room.']) +
            ca('Composite wood sold in California has had to meet CARB’s formaldehyde limits since 2009 (now national). Upholstered furniture carries a label saying whether it has added flame retardants (SB 1019); “contains NO added flame retardants” is the one to look for.') +
            fix({ modes: [['habit']], cost: 'Free', steps: [
              ['Free · first', 'Secondhand, swap or borrow before buying new.'],
              ['Free', 'A new item? A week or two airing out somewhere other than a bedroom.'],
              ['Free', 'Painting or new floors: windows open and a fan out for several days afterward.']],
              add: [F.newair] }) +
            links(TOX.furn) +
            src('CARB Airborne Toxic Control Measure for Composite Wood Products; US EPA TSCA Title VI; California SB 1019 (2014) and TB 117-2013.'); } },
          { id: 'disturbed', short: 'Asbestos &amp; lead', title: 'Asbestos and lead: only when disturbed', html: function () { return '<p>Two older materials stay harmless while they’re whole and sealed, and only reach the air when they’re damaged, sanded, drilled, scraped or crumbling. That’s the whole key: <b>intact, leave it; disturbed, take care.</b></p>' +
            table(['Material', 'Where it may be', 'How it gets out'], [
              ['Asbestos (homes built before about 1980)', 'Popcorn or textured ceilings, vinyl floor tiles and their glue, pipe and boiler wrap, vermiculite attic insulation, cement siding, old duct tape', 'Fibers break loose when it’s cut, sanded, drilled, scraped or crumbling. Tiny and light, they float for hours and lodge in lungs for life.'],
              ['Lead paint (homes built before 1978)', 'Window frames and sills, doors, stairs, porches, trim', 'Rubbing and chipping turn paint to dust; windows opening and closing grind it fine. Dry sanding or scraping releases a lot at once.']]) +
            care('Suspect crumbling asbestos? Keep people and animals away, don’t sweep or vacuum it (an ordinary vacuum spreads the fibers), mist it lightly with water, cover it, and get it tested.') +
            ca('Asbestos work over 100 square feet has to be done by a contractor registered with Cal/OSHA. Contractors working on pre-1978 paint in homes need EPA lead-safe (RRP) certification.') +
            fix({ modes: [['habit'], ['once']], cost: 'Free → $', c: 1, steps: [
              ['Free · today', 'Leave intact old materials alone: no drilling, sanding or scraping popcorn ceilings, old tiles or old paint.'],
              ['Free · weekly', 'Older home: damp-wipe window sills and troughs, then HEPA vacuum. That’s where lead dust gathers.'],
              ['$ · before any project', 'Test first: an accredited lab tests an asbestos sample for about $25–$60; lead paint kits or an inspection for paint. Test everything you’ll touch, in one batch.']],
              add: [F.test] }) +
            accs(acc('old', 'Older building', 'Living in a home built before 1980', ul(['Most older homes are safe to live in as they are. Peeling paint, damaged ceilings and crumbling pipe wrap are the parts that need attention.', 'Children under 6 and pregnancy: a blood lead test through a clinician is simple and covered by Medi-Cal and most insurance; many California counties offer free lead dust wipe kits.']) + links(TOX.dust)),
              acc('rent', 'Renting', 'When paint is peeling or a ceiling is damaged', ca('Landlords in California can’t create lead hazards, and deteriorating lead paint can be reported to local code enforcement. Landlords of pre-1978 homes provide a lead disclosure at signing; asking to see it is a fair request.') + links(REQ))) +
            src('US EPA and US CPSC, <i>Asbestos in the Home</i>; US EPA Renovation, Repair and Painting Rule; Cal/OSHA asbestos contractor registration; California Health &amp; Safety Code §17920.10.'); } }
        ] },

      /* ===== 4 · Heat & smoke ===== */
      { id: 'smoke', num: 4, word: 'Heat &amp; smoke', sub: 'Fire, fumes and intense irritants',
        modes: ['now', 'habit'],
        lede: 'Heat is the fastest way things get into air. A searing pan, a gas flame, a pan left empty on high, a candle, a cigarette, a solvent warming in the sun: each releases a burst of particles and gases at once, often the most irritating air a home ever has. The burst is strong but brief. With air moving, most of it is gone within the hour, so the fixes here are about the moment.',
        mode: 'Fan on before the heat. Lower heat, lids, back burners, lids on solvents.',
        subs: [
          { id: 'loose', short: 'Heat sets loose', title: 'Heat sets things loose', html: function () { return '<p>Heat does three things to air. It <b>burns</b> (smoke and soot from food, wax, wood, tobacco, gas). It <b>breaks down</b> materials that are stable when cool (an overheated nonstick coating, the first run of a dusty heater). And it <b>speeds up</b> what materials breathe out anyway: a new couch in a hot room, solvents in a sunny garage, a car in the sun.</p>' +
            does([['Burns <i>Particles</i>', 'Searing, frying, candles, incense, wood fires, cigarettes, gas flames.'], ['Breaks down <i>Fumes</i>', 'Nonstick coatings above about 500°F, dust on heater coils, plastic on a hot surface.'], ['Speeds up <i>Evaporation</i>', 'Solvents, paint, new furniture, a hot car interior.']]) +
            '<p>What makes these exposures short-lived is that they stop when the heat stops. Levels peak while cooking or burning, then fall as air carries them out. How fast they fall is up to ventilation: a sealed kitchen can stay smoky for hours, one with a vented hood or a window fan clears in minutes.</p>' +
            fix({ modes: [['habit']], cost: 'Free', steps: [
              ['Free · today', 'Air on before heat: hood, window fan or cross-breeze, then the burner.'],
              ['Free', 'Run a new space heater, or the first heat of the season, with a window open; the burnt-dust smell passes in an hour or so.'],
              ['Free', 'Park in shade and open the car windows for a minute before driving on hot days.']],
              add: [F.first] }) +
            src('US EPA, <i>Introduction to Indoor Air Quality</i>; Parthasarathy et al., <i>Journal of the Air &amp; Waste Management Association</i> 2011.'); } },
          { id: 'cooking', short: 'Cooking smoke', title: 'Cooking smoke', html: function () { return '<p>Cooking is the biggest indoor source of fine particles in most homes, gas or electric. High heat and oil make the most: searing, stir-frying, broiling, toasting. Boiling and steaming make very little; burnt food makes a lot.</p>' +
            table(['Cooking', 'Particles', 'Easy shift'], [
              ['Boiling, steaming, simmering', '[y]Low', 'Lid on for the steam.'],
              ['Baking, roasting', '[p]Medium, more when it drips or burns', 'A tray under drips; the oven light instead of opening the door.'],
              ['Frying, searing, broiling, toasting', '[n]High', 'Medium heat, higher smoke-point oils, the back burner, hood on high.']]) +
            home('Most range hoods catch far more from the back burners than the front. Moving a pan back is free and makes a measurable difference.') +
            together('Kids at the stove are learning to cook. A step stool by the back burner, a lid in their hands and the hood switch as their job makes them part of the clean air.') +
            fix({ modes: [['habit']], cost: 'Free', steps: [
              ['Free · today', 'Back burners first, hood on high or a window fan out.'],
              ['Free', 'Medium heat for oil; if it smokes, pull the pan off and let it cool.'],
              ['Free', 'Leave the fan running 10–15 minutes after the burner’s off.']],
              add: [F.back] }) +
            accs(acc('nohood', 'No vented hood', 'Clearing smoke with a window', '<p>A box fan in the nearest window facing out, plus another window open elsewhere, removes much of what a hood would. For high-heat cooking, an electric pan or camp stove on a porch or balcony keeps the smoke outside entirely.</p>')) +
            links(to('#lens-food/cook', 'Food: Cook')) +
            src('Abdullahi et al., <i>Atmospheric Environment</i> 2013; Lawrence Berkeley National Laboratory, range hood studies (Delp &amp; Singer 2012).'); } },
          { id: 'gas', short: 'Gas flames', title: 'Gas flames', html: function () { return '<p>A gas flame burns methane, and burning makes more than heat: <b>nitrogen dioxide</b> (NO₂), which inflames airways; a little <b>carbon monoxide</b> (CO); and, with leaked unburned gas, small amounts of <b>benzene</b> and formaldehyde. This happens whether or not food is on the burner.</p>' +
            ul(['An estimated 1 in 8 cases of childhood asthma in the US is linked to gas stove use, about the same share as secondhand smoke.', 'In small kitchens without a vented hood, NO₂ from a stove can pass the outdoor health limit within an hour of cooking.', 'Unvented gas wall heaters, ovens left open for warmth and fuel heaters in vans release the same gases straight into the room.']) +
            care('Carbon monoxide has no smell. Headache, dizziness, nausea or sleepiness in more than one person or animal at once means fresh air first: everyone outside, then call 911. A rotten-egg smell is a gas leak: no switches or flames; leave and call from outside.') +
            ca('Homes with a gas appliance, fireplace or attached garage need a carbon monoxide alarm (Carbon Monoxide Poisoning Prevention Act, 2010).') +
            fix({ modes: [['now'], ['once']], cost: 'Free → $', c: 1, steps: [
              ['Free · now', 'Hood or window fan every time a burner is on; the oven and stovetop used for cooking only, not for heat.'],
              ['$ · once', 'A CO alarm near the bedrooms (about $20–$40); test it monthly.'],
              ['$', 'An induction hot plate (about $60–$100) and an electric kettle move most daily cooking off the flame, and come with you when you move.']],
              add: [[F.co, 'Add the alarm'], [F.induct, 'Add the hot plate']] }) +
            accs(acc('gas', 'Gas stove', 'Living well with the stove you have', ul(['Fan on before the burner, back burners first, the smallest burner that does the job.', 'A blue, steady flame burns cleaner than a yellow, flickering one; a yellow flame is worth a call to the gas utility, which often checks for free.', 'Kids, pregnancy, asthma and birds: these are the times an induction plate for daily cooking matters most.'])),
              acc('rent', 'Renting', 'Asking about the stove', '<p>Some California cities and utilities offer induction rebates and loaner programs for renters and owners alike. A request framed around a shared need (cleaner air for a child with asthma, lower bills) often goes well.</p>' + links(REQ))) +
            src('Gruenwald et al., <i>International Journal of Environmental Research and Public Health</i> 2023; Kashtan et al., <i>Environmental Science &amp; Technology</i> 2023; Lebel et al., <i>Environmental Science &amp; Technology</i> 2022; California Health &amp; Safety Code §17926.'); } },
          { id: 'nonstick', short: 'Nonstick', title: 'Overheated nonstick', html: function () { return '<p>Most nonstick coatings are PTFE (often sold as Teflon), a PFAS plastic. At normal cooking heat it stays put. Above about <b>500°F (260°C)</b> it starts to break down, and above about 660°F it releases a mix of fluorinated gases and very fine particles, some of them PFAS themselves. An empty nonstick pan on high can pass 500°F in a few minutes.</p>' +
            does([['People <i>Air</i>', 'Breathing the fumes can cause “polymer fume fever”: chills, aches and fever for a day or two, often mistaken for flu.'], ['Birds <i>Air</i>', 'Birds breathe so efficiently that these fumes can kill a bird within minutes, even from another room.'], ['Short-lived <i>Gone fast</i>', 'The fumes clear with airflow, like any heat burst. The longer-term question is the pan itself: ' + TOX.pans + '.']]) +
            care('A sharp, chemical or “hot plastic” smell from a pan: heat off, pan to a cold burner, windows open, fan out, and birds and people to the freshest room.') +
            fix({ modes: [['habit']], cost: 'Free → $', steps: [
              ['Free · today', 'Nonstick on low to medium only, never preheated empty, always with the fan on.'],
              ['Free', 'Searing, broiling and anything on high go in cast iron or steel.'],
              ['$ · as they wear', 'When a nonstick pan scratches or flakes, let it go for cast iron, carbon steel or stainless (secondhand ones last a lifetime).']],
              add: [F.nonstick] }) +
            accs(acc('birds', 'Birds', 'Keeping your bird safe from kitchen fumes', ul(['The safest home for a bird has no PTFE pans at all; the next safest keeps the bird far from the kitchen, door shut, during cooking.', 'PTFE is also on some space heaters, oven liners, irons and self-cleaning ovens (the cleaning cycle runs very hot). Run those with the bird out of the house or far away and windows open.', 'Fumes from an overheated pan need an avian vet right away; ASPCA Animal Poison Control is 888-426-4435 (a fee may apply).']))) +
            links(TOX.pans + ' · ' + TOX.pets) +
            src('Sajid &amp; Ilyas, <i>Environmental Science and Pollution Research</i> 2017; Ellis et al., <i>Nature</i> 2001; Merck Veterinary Manual (PTFE toxicosis in birds); CDC/NIOSH on polymer fume fever.'); } },
          { id: 'burning', short: 'Burning things', title: 'Candles, incense, wood and tobacco', html: function () { return '<p>Flames and smolder make particles: incense most of all, then cigarettes, wood fires and paraffin candles (the black soot on the jar). Fragrance adds a second layer: many scent chemicals react with ozone in the air to make formaldehyde and new ultrafine particles, so plug-in fresheners and diffusers add to the air even with no flame.</p>' +
            ul(['Incense burned in a closed room can make more fine particles than a busy road.', 'Tobacco and cannabis smoke indoors settle into dust, fabrics and walls (“thirdhand smoke”) and linger for months.', 'Beeswax or soy candles with short-trimmed cotton wicks smoke less than paraffin; a draft makes any candle sooty.', 'Wood stoves and fireplaces leak smoke into the room each time the door opens or the draft reverses.']) +
            fix({ modes: [['habit']], cost: 'Free', steps: [
              ['Free · today', 'Unplug any plug-in fresheners; open a window for smell instead (it removes the cause rather than covering it).'],
              ['Free', 'Candles and incense with a window open, for a shorter time, or outside on a porch.'],
              ['Free', 'Someone smokes or vapes? Outside, away from open windows and doors, meets everyone’s needs, including theirs.']],
              add: [F.burn] }) +
            links(TOX.scent) +
            src('Lee &amp; Wang, <i>Atmospheric Environment</i> 2004; Nazaroff &amp; Weschler, <i>Atmospheric Environment</i> 2004; Matt et al., <i>Environmental Health Perspectives</i> 2011 (thirdhand smoke).'); } },
          { id: 'solvents', short: 'Solvents &amp; sprays', title: 'Solvents and sprays', html: function () { return '<p>Solvents are liquids made to evaporate: acetone in nail polish remover, paint thinner, mineral spirits, glues, spray paint, gasoline, and the propellants in aerosol cans. Evaporating is how they work, so they go straight into the air, faster when warm. Indoors, many irritate eyes, nose and lungs, cause headaches and dizziness, and some (like benzene in gasoline or methylene chloride in old strippers) are far more harmful.</p>' +
            table(['Product', 'What it releases', 'Gentler move'], [
              ['Nail polish and remover', 'Acetone or ethyl acetate, plus other solvents', 'By an open window, lid back on at once, cotton pads into a sealed bag'],
              ['Aerosol sprays (paint, hairspray, cleaners)', 'Propellants and a fine mist meant to float', 'Pump or pour versions; spray outside'],
              ['Paint, thinner, strippers, glue', 'VOCs, sometimes highly toxic solvents', 'Water-based or low-VOC; outside or windows open and fan out'],
              ['Gasoline, mower fuel', 'Benzene and other vapors', 'Stored in a shed or detached space, not an attached garage or the home']]) +
            care('Rags soaked with oil-based stains or linseed oil can heat up and catch fire on their own. Lay them flat outside to dry, or keep them in water in a sealed metal can.') +
            fix({ modes: [['habit']], cost: 'Free', steps: [
              ['Free · today', 'Lids on every solvent the moment you’re done; cans and bottles stored outside the living space.'],
              ['Free', 'Spraying, painting or nails: outside, or a window open and a fan pointing out.'],
              ['Free', 'Companions and little ones in another room until the smell is gone.']],
              add: [F.solvent] }) +
            links(to('#lens-household-tools', 'Household tools (labels and pairs that must never meet)')) +
            src('US EPA, <i>Volatile Organic Compounds’ Impact on Indoor Air Quality</i>; NIOSH Pocket Guide to Chemical Hazards; US CPSC on spontaneous combustion of oily rags.'); } },
          { id: 'companions', short: 'Companions', title: 'Smoke, scent and companions', html: function () { return '<p>The animals we live with breathe the same air with different bodies. Several are far more sensitive to what heat and evaporation put into it.</p>' +
            does([['Cats <i>Lungs &amp; liver</i>', 'Smoke, incense, sprays and scented litter can trigger feline asthma. Cats’ livers process many chemicals slowly, so essential oils from diffusers and fumes they groom off their fur build up; their kidneys are delicate too.'], ['Birds <i>Lungs</i>', 'Air sacs pull in more air per breath than ours. PTFE fumes, smoke, aerosols and scented candles can be fatal in minutes.'], ['Dogs <i>Nose</i>', 'Flat-faced dogs and older dogs struggle with smoke and heat; noses at floor level meet settled dust.'], ['Rabbits &amp; small mammals <i>Airways</i>', 'Sensitive to ammonia from soiled bedding, aromatic cedar and pine shavings, smoke and sprays.'], ['Fish <i>Water</i>', 'Aerosols and smoke land on the water’s surface and dissolve in it.']]) +
            kin('A companion sneezing, wheezing, breathing with an open mouth (a cat or bird), or hiding and lethargic after smoke, a spray or a new scent is telling you about the air. Fresh air first, then a vet if it doesn’t pass.') +
            '<p>Which household substances each species can’t process (lilies and NSAIDs for cats’ kidneys, xylitol and grapes for dogs, metals for birds and more) lives in ' + TOX.pets + '.</p>' +
            fix({ modes: [['habit']], cost: 'Free', steps: [
              ['Free · today', 'No diffusers, incense or plug-ins in rooms companions can’t leave.'],
              ['Free', 'Companions out of the room for smoke, sprays, nails, painting and cleaning; back once it’s aired out.'],
              ['Free', 'Unscented litter and paper or aspen bedding for small animals; bedding changed often.']],
              add: [F.pets] }) +
            links(TOX.pets + ' · ' + ANIMALS) +
            src('ASPCA Animal Poison Control on essential oils and cats; Merck Veterinary Manual (feline asthma; PTFE toxicosis); Court &amp; Greenblatt, <i>Pharmacogenetics</i> 1997 (feline glucuronidation).'); } }
        ] },

      /* ===== 5 · Sun & temperature ===== */
      { id: 'sun', num: 5, word: 'Sun &amp; temperature', sub: 'Heat, shade, cold and skin',
        modes: ['now', 'once'],
        lede: 'Air carries temperature as well as everything else, and the sun sets most of it. Hot air strains hearts and kidneys and raises ozone; cold, damp air invites unsafe heating. Shade is the oldest and freest tool there is. Sun on skin is covered here briefly and in full in Body care.',
        mode: 'Shade and timing are free. Outside shades, a fan and a mineral sunscreen are small, lasting buys.',
        subs: [
          { id: 'heat', short: 'Heat waves', title: 'Hot air and heat waves', html: function () { return '<p>Bodies cool by sweating and moving blood to the skin. In a heat wave, especially when nights stay warm, they can’t keep up. Heat is the deadliest weather event in the US, and most harm happens indoors, in homes that hold heat.</p>' +
            table(['Signs', 'What it may be', 'What to do'], [
              ['Heavy sweating, cramps, weakness, nausea, headache', '[p]Heat exhaustion', 'A cooler place, sips of water, cool cloths, loosen clothes. Getting worse or over an hour: medical help.'],
              ['Hot skin (dry or damp), confusion, fainting, a very high temperature', '[n]Heat stroke: an emergency', 'Call 911. Cool them with water and fanning while you wait.']]) +
            bonus('Crop scientist Sarah Taber (<i>Farm to Taber</i>) calls heat stroke’s first signal <b>“the heat stupids.”</b> As you overheat, your body pulls resources away from your brain, so thinking goes dumb first: confusion, dizziness, clumsiness, poor decisions. If you or someone with you suddenly can’t think straight in the heat, treat that as the warning and get cool now, before other signs show.') +
            ul(['<b>Who feels it first:</b> babies and toddlers, elders, pregnancy, people with heart, lung or kidney conditions or on some medicines, people working outside, people without homes, and animals.', '<b>Fans help up to a point.</b> In the high 90s°F and above, a fan alone blows hot air and can’t prevent heat illness; a cool shower, wet cloths and a cooler place do more.', '<b>Night flush.</b> Close windows and shades by mid-morning; open them wide once it’s cooler outside than in, with a fan in a window pointing out.', '<b>Smoke and heat at once:</b> the clean room with a filter, and a cooling center or library if the room gets too hot.']) +
            ca('Counties open cooling centers during heat waves; 211 and county websites list them. Heat and ozone often arrive together on hot afternoons.') +
            kin('Dogs pant to cool and overheat fast, flat-faced ones most. Pavement in the sun gets hot enough to burn paws: if the back of your hand can’t rest on it for seven seconds, it’s too hot for feet. Never leave anyone in a parked car. Birds, rabbits and hens need shade and cool water; wild visitors appreciate a shallow dish too.') +
            fix({ modes: [['once'], ['together']], cost: 'Free → $', c: 0, steps: [
              ['Free · before summer', 'A cool-room plan: the coolest room, shades closed by day, a night flush, and the nearest cooling center saved.'],
              ['Free', 'Check on elders and neighbors living alone twice a day in a heat wave.'],
              ['Free', 'Freeze water bottles to lay with companions; walk dogs at dawn and dusk.']],
              add: [F.cool] }) +
            links(prep('heat', 'Emergency prep: Extreme heat')) +
            src('CDC, <i>Heat and Health</i> and warning signs of heat illness; National Weather Service heat fatality statistics; American Veterinary Medical Association on heat and pets.'); } },
          { id: 'shade', short: 'Shade', title: 'Shade', html: function () { return '<p>Shade stops heat before it starts. Sunlight through a window turns to heat once it’s inside, which is why shading on the <b>outside</b> of a window (an awning, an exterior shade, a tree, a vine) blocks far more heat than blinds or curtains inside it.</p>' +
            does([['Trees and vines <i>Living shade</i>', 'Deciduous trees on the south and west shade in summer and let winter sun through. They cool by breathing out water too.'], ['Awnings and outside shades <i>Built shade</i>', 'Cloth or slatted shades outside west windows cut afternoon heat dramatically.'], ['Inside blinds <i>Second best</i>', 'Light-colored, closed by mid-morning on sunny sides.'], ['Light roofs and surfaces <i>Reflect</i>', 'Pale roofs and paving stay far cooler than dark ones.']]) +
            together('Neighborhoods with fewer trees run several degrees hotter (urban heat islands), often in lower-income areas. Street tree programs and community plantings shade everyone at once.') +
            kin('Shade is a need for everyone outdoors: a covered corner for hens, shade cloth for seedlings and leafy greens, a shaded water dish for birds and other visitors.') +
            fix({ modes: [['once'], ['together']], cost: 'Free → $', c: 1, steps: [
              ['Free · today', 'Find the windows that get afternoon sun; shades on those closed by late morning.'],
              ['$', 'An outside shade, awning or shade cloth for the sunniest window, or a trellis with a vine.'],
              ['Together', 'Ask your city about street tree programs, or plant with neighbors.']],
              add: [F.shade] }) +
            links(to('#lens-interior-design', 'Interior design (following the sun)') + ' · ' + to('#lens-gardening', 'Gardening')) +
            src('US Department of Energy, <i>Energy Saver: Window Shades and Awnings</i> and landscaping for shade; US EPA, <i>Heat Island Effect</i>.'); } },
          { id: 'skin', short: 'Sun on skin', title: 'Sun on skin', html: function () { return '<p>Ultraviolet (UV) light from the sun travels through air whether it feels hot or not, and it’s strongest from about 10 a.m. to 4 p.m., at altitude, and off water, sand and snow. The UV index in a weather app says how strong: from 3 up, skin needs protecting.</p>' +
            ul(['<b>Shade and timing first</b>, then clothing: a wide-brim hat, sunglasses, long sleeves (tightly woven or UPF-rated).', '<b>Sunscreen for what’s left uncovered.</b> Broad spectrum, SPF 30 or higher, plenty of it, again every two hours and after swimming or sweating.', '<b>Mineral sunscreens</b> use zinc oxide or titanium dioxide. These are the only two active ingredients the FDA has proposed as generally recognized as safe and effective; zinc oxide covers the widest range of UV.', '<b>Lotions over sprays:</b> spray sunscreens put a fine mist into the air you breathe.', '<b>Babies under 6 months:</b> shade and clothing rather than sunscreen.']) +
            kin('Oxybenzone and octinoxate, common chemical filters, harm coral reefs; Hawaii banned them in 2021. Mineral sunscreens are kinder to water kin. For companions: light-nosed cats and thin-coated dogs sunburn, but human zinc oxide sunscreen is harmful if licked, so shade or a pet-specific product is the safer strategy.') +
            fix({ modes: [['habit'], ['once']], cost: 'Free → $', c: 1, steps: [
              ['Free · today', 'Check the UV index with the weather. 3 or more: shade, hat, sleeves.'],
              ['$ · once', 'A mineral (zinc oxide) sunscreen, SPF 30+, kept by the door.'],
              ['Free', 'Outdoor play and work in the early morning and late afternoon on high-UV days.']],
              add: [F.sun] }) +
            links(BODY + ' (skin, sunscreen and growing bodies)') +
            src('US FDA, sunscreen proposed rule (2019) and <i>Sun Protection for Babies</i>; American Academy of Dermatology; Downs et al., <i>Archives of Environmental Contamination and Toxicology</i> 2016; Hawaii Act 104 (2018).'); } },
          { id: 'cold', short: 'Cold air', title: 'Cold air', html: function () { return '<p>Cold air brings its own needs: warmth without fumes, and damp kept in check (cold walls collect condensation; see ' + r('ventilation', 'damp') + '). Cold homes are linked with more heart and lung illness, especially for elders and babies.</p>' +
            ul(['<b>Warm the people, then the room.</b> Layers, wool, hot water bottles, warm drinks, one shared warm room instead of heating every room.', '<b>Space heaters:</b> plugged straight into the wall, three feet from anything that burns, off when you sleep or leave.', '<b>Never for warmth:</b> ovens, stovetops, grills, camp stoves or generators indoors (' + r('smoke', 'gas', 'carbon monoxide') + ').', '<b>Fireplaces and wood stoves:</b> a clean, dry fire, a working flue, and a CO alarm in the house.', '<b>Draughts:</b> rolled towels at doors and heavy curtains at night; a little fresh air still matters, so a short daily purge stays.']) +
            kin('Companions need warm, dry beds off cold floors; hens and rabbits outdoors need draught-free shelter with ventilation up high, since damp air causes them breathing trouble.') +
            fix({ modes: [['habit'], ['once']], cost: 'Free → $', c: 1, steps: [
              ['Free · today', 'One warm room for everyone in a cold snap, with the door shut.'],
              ['$ · once', 'A CO alarm near sleeping areas if anything in the home burns fuel.'],
              ['Free', 'Space heater on a wall outlet, three feet clear, off at night.']],
              add: [F.warm] }) +
            links(to('#lens-energy', 'Energy (heating with less)') + ' · ' + prep('power', 'Emergency prep: Power outages')) +
            src('WHO, <i>Housing and Health Guidelines</i> (2018); US CPSC, space heater safety; CDC, carbon monoxide poisoning prevention.'); } }
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
    document.querySelectorAll('.ai-add[data-title]').forEach(function (b) {
      var on = has(b.getAttribute('data-title'));
      b.classList.toggle('on', on); b.textContent = on ? 'On my list' : b.getAttribute('data-label');
      b.setAttribute('aria-pressed', String(on));
    });
    var c = $('ai-cnt'); if (c) c.textContent = openCount();
    renderList();
  }
  function renderList() {
    var el = $('ai-lst'); if (!el) return;
    $('ai-empty').hidden = list.length > 0;
    el.innerHTML = list.map(function (x, i) {
      var u = UIDX[x.u], n = NUM[x.u + '/' + x.sub];
      return '<li class="ak' + (u ? u.num : 1) + (x.s === 'done' ? ' done' : '') + '"><span class="ai-num">' + (i + 1) + '</span>' +
        '<span class="ai-lt"><b>' + esc(x.title) + '</b><span>' + modeHtml(x.m) + '<span class="ai-cost">' + COST[x.c || 0] + '</span>' +
        (u && n ? '<small><a href="' + BASE + '/' + x.u + '/' + x.sub + '">' + u.word + ' ' + n + '</a></small>' : '') + '</span></span>' +
        '<span class="ai-lctl"><button type="button" class="ai-st" data-ai="st" data-i="' + i + '" data-s="' + x.s + '">' + LABEL[x.s] + '</button>' +
        '<span class="ai-mv"><button type="button" data-ai="up" data-i="' + i + '" aria-label="Move up">▲</button><button type="button" data-ai="down" data-i="' + i + '" aria-label="Move down">▼</button></span></span></li>';
    }).join('');
    var done = list.length - openCount();
    $('ai-bar').style.width = list.length ? (done / list.length * 100) + '%' : '0';
    $('ai-sum').textContent = list.length ? done + ' of ' + list.length + ' done · ' + list.filter(function (x) { return x.s === 'doing'; }).length + ' in progress' : '';
  }
  /* Add a fix by its title: finds the card's button when the unit is rendered, or uses the tool's own details. */
  function addByTitle(title, u, sub, c, m) {
    if (has(title)) return false;
    var b = Array.prototype.filter.call(document.querySelectorAll('.ai-add[data-title]'), function (x) { return x.getAttribute('data-title') === title; })[0];
    if (b) return addItem({ title: title, u: b.getAttribute('data-u'), sub: b.getAttribute('data-s'), c: +b.getAttribute('data-c') || 0, m: b.getAttribute('data-m') });
    return addItem({ title: title, u: u, sub: sub, c: c || 0, m: m || '' });
  }

  /* ---------- Tool: What do you notice? A shortcut into the course, never a gate in front of it. ---------- */
  // [id, what you notice, urgency (2 urgent · 1 take care · 0), fastest fix, why, unit, sub, list title, cost, modes]
  var RN = [
    ['co', 'CO alarm, or headache or dizziness in more than one of us', 2, 'Everyone outside into fresh air, animals too. Then call 911.', 'Carbon monoxide has no smell. Several people or animals unwell at once is the sign.', 'smoke', 'gas', F.co, 1, 'once:Set up once'],
    ['gas', 'Rotten-egg smell', 2, 'Leave now. No switches, flames or phones inside; call the gas utility or 911 from outside.', 'Gas utilities add that smell so leaks get noticed.', 'smoke', 'gas', '', 0, ''],
    ['heatill', 'Someone hot, confused or faint in the heat', 2, 'Call 911, then cool them with water and fanning while you wait.', 'These are signs of heat stroke.', 'sun', 'heat', F.cool, 0, 'once:Set up once'],
    ['pan', 'Sharp chemical or “hot plastic” smell from a pan', 1, 'Heat off, pan to a cold burner, windows open, a fan pointing out. Birds and people to the freshest room.', 'An overheated nonstick coating is breaking down into fluorinated fumes. They clear with airflow.', 'smoke', 'nonstick', F.nonstick, 0, 'habit:Habit'],
    ['crumble', 'Crumbling ceiling texture, pipe wrap or chipped old paint', 1, 'Keep people and animals away. Don’t sweep or vacuum it; mist lightly, cover, and plan a test.', 'Asbestos and lead only reach the air when disturbed. Damp and covered, they stay put.', 'dust', 'disturbed', F.test, 1, 'once:Set up once'],
    ['smoke', 'Smoke or haze outside', 1, 'Close the windows, run a filter in one room, and make that the clean room.', 'When outside air is worse, the plan flips: filter instead of open.', 'ventilation', 'outside', F.clean, 1, 'once:Set up once'],
    ['solvent', 'Paint, nail polish, glue or gasoline smell', 1, 'Lids on, window open, a fan pointing out; companions and kids to another room.', 'Solvents are made to evaporate, and warm rooms speed it up.', 'smoke', 'solvents', F.solvent, 0, 'habit:Habit'],
    ['cook', 'Cooking smoke or a burnt smell', 0, 'Hood on high, or a box fan in a window facing out plus one more window open. Pan to the back burner.', 'Heat bursts are short-lived; airflow clears them in minutes.', 'smoke', 'cooking', F.back, 0, 'habit:Habit'],
    ['stuffy', 'Stuffy, sleepy or heavy air', 0, 'Open two windows on different sides for 5–10 minutes.', 'CO₂ and everything else people release has built up. A purge swaps most of it.', 'ventilation', 'windows', F.purge, 0, 'now:Right now'],
    ['scent', 'Strong scent, candles or incense', 0, 'Snuff or unplug it and crack a window.', 'Flames make particles; fragrance reacts with ozone to make more.', 'smoke', 'burning', F.burn, 0, 'habit:Habit'],
    ['newsmell', 'New furniture, paint or carpet smell', 0, 'Window open and a fan out. Sleep elsewhere for a few nights if it’s a bedroom.', 'New materials breathe out most in their first weeks, and faster when warm.', 'dust', 'new', F.newair, 0, 'habit:Habit'],
    ['musty', 'Musty or earthy smell', 0, 'Follow your nose to the dampest spot, open it up to dry, and find the water.', 'That smell is usually mold growing somewhere damp; Poisons covers mold itself.', 'ventilation', 'damp', F.damp, 1, 'habit:Habit'],
    ['fog', 'Windows fogged or dripping', 0, 'Wipe them, then a 5-minute purge to carry the water out.', 'Damp air is landing on the coldest surface it can reach.', 'ventilation', 'damp', F.damp, 1, 'habit:Habit'],
    ['dusty', 'Dust in the sunbeams, sneezing', 0, 'Damp-wipe surfaces, then a slow vacuum with a window open.', 'Fine dust carries most of the long-lasting chemicals; damp cloths carry it out.', 'dust', 'vacuum', F.vac, 1, 'habit:Habit'],
    ['hot', 'Hot, close rooms', 0, 'Shades closed on the sunny side; open up wide once it’s cooler outside than in.', 'Sun through glass turns to heat inside. Shade and a night flush move it out.', 'sun', 'shade', F.shade, 1, 'once:Set up once'],
    ['petsneeze', 'A companion sneezing, wheezing or breathing with an open mouth', 0, 'Fresh air first: window open, any smoke, spray or scent out. A vet if it doesn’t pass.', 'Cats, birds and small animals react to air before we do.', 'smoke', 'companions', F.pets, 0, 'habit:Habit']
  ];
  var rnOn = {};
  function runNotice() {
    var box = $('ai-rn'); if (!box) return;
    if (!box.innerHTML) box.innerHTML = RN.map(function (x) { return '<button type="button" class="ai-pick" data-ai="rn" data-k="' + x[0] + '" aria-pressed="' + (rnOn[x[0]] ? 'true' : 'false') + '">' + esc(x[1]) + '</button>'; }).join('');
    var picks = RN.filter(function (x) { return rnOn[x[0]]; }).map(function (x) {
      return { x: x, u: x[2] + (x[0] === 'pan' && T.birds ? 1 : 0) + ((x[0] === 'smoke' || x[0] === 'hot') && (T.kids || T.animals || T.asthma) ? 0.5 : 0) };
    }).sort(function (a, b) { return b.u - a.u; });
    var out = $('ai-rn-out');
    if (!picks.length) { out.innerHTML = '<small>Pick anything you notice. Nothing at all? Lovely. A daily 5-minute purge keeps it that way.</small>'; return; }
    out.innerHTML = '<strong>' + (picks[0].u >= 2 ? 'First, fresh air and safety' : 'Fastest fixes, in order') + '</strong>' + picks.map(function (p, i) {
      var x = p.x;
      return '<div class="ai-rn-card' + (p.u >= 2 ? ' urgent' : '') + '"><span class="eyebrow">' + (i + 1) + ' · ' + esc(x[1]) + '</span><b>' + esc(x[3]) + '</b><span>' + esc(x[4]) + (x[0] === 'pan' && T.birds ? ' With birds in the house, this one comes first.' : '') + '</span>' +
        '<span class="ai-row"><a class="btn" href="' + BASE + '/' + x[5] + '/' + x[6] + '">Learn more: ' + NUM[x[5] + '/' + x[6]] + '</a>' +
        (x[7] ? '<button type="button" class="btn" data-ai="rn-add" data-k="' + x[0] + '">' + (has(x[7]) ? 'On my list' : '+ Add the fix') + '</button>' : '') + '</span></div>';
    }).join('');
  }

  /* ---------- Tool: Filter sizer. Room volume × air changes an hour ÷ 60 = CFM of clean air. ---------- */
  function runSizer() {
    var out = $('ai-fs-out'); if (!out) return;
    var L = +$('ai-fs-l').value || 0, W = +$('ai-fs-w').value || 0, H = +$('ai-fs-h').value || 8, ach = +$('ai-fs-for').value;
    var area = L * W, cfm = Math.round(area * H * ach / 60 / 5) * 5;
    if (!area) { out.innerHTML = '<small>Enter the room size.</small>'; return; }
    var fans = Math.max(1, Math.ceil(cfm / 150)), cubes = Math.max(1, Math.ceil(cfm / 500));
    out.innerHTML = '<strong>About ' + cfm + ' CFM of clean air</strong>' +
      '<small>' + area + ' sq ft × ' + H + ' ft ceiling, ' + ach + ' air changes an hour' + (ach > 4 ? ' (smoke days or illness)' : '') + '.</small>' +
      '<ul><li><b>' + fans + ' box fan' + (fans > 1 ? 's' : '') + ' with one MERV 13 filter</b> (roughly 100–200 CFM each) · about $' + fans * 40 + '–$' + fans * 65 + '</li>' +
      '<li><b>or ' + cubes + ' four-filter cube' + (cubes > 1 ? 's' : '') + '</b> (Corsi–Rosenthal; often 400–800 CFM) · about $' + cubes * 70 + '–$' + cubes * 120 + '</li>' +
      '<li><b>or a HEPA purifier</b> with a smoke CADR of ' + cfm + ' or more</li></ul>' +
      '<small>Rough numbers; fans and filters vary. Run it on a speed you can sleep with and close the door to the room. Replace filters when they turn gray (often every 3–6 months, sooner in smoke).</small>' +
      '<div class="ai-row"><button type="button" class="btn" data-ai="fs-add">' + (has(F.boxfan) ? 'On my list' : 'Add a box-fan filter to My list') + '</button></div>';
  }
  function runTools() { runNotice(); runSizer(); syncUi(); }

  /* ---------- events (delegated; views re-render on every route) ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-ai]'); if (!b) return;
    var a = b.getAttribute('data-ai'), i = +b.getAttribute('data-i');
    if (a === 'add') {
      var t = b.getAttribute('data-title');
      if (has(t)) { list = list.filter(function (x) { return x.title !== t; }); mn().toast('Taken off My list'); }
      else { addItem({ title: t, u: b.getAttribute('data-u'), sub: b.getAttribute('data-s'), c: +b.getAttribute('data-c') || 0, m: b.getAttribute('data-m') }); mn().toast('Added to My list · ' + openCount()); }
    } else if (a === 'st') { list[i].s = NEXT[list[i].s]; if (list[i].s === 'done') mn().toast('Done. One more breath of clean air.'); }
    else if (a === 'up' && i > 0) list.splice(i - 1, 0, list.splice(i, 1)[0]);
    else if (a === 'down' && i < list.length - 1) list.splice(i + 1, 0, list.splice(i, 1)[0]);
    else if (a === 'sort') list.sort(function (x, y) { return (x.s === 'done') - (y.s === 'done') || (x.c || 0) - (y.c || 0); });
    else if (a === 'clear') list = list.filter(function (x) { return x.s !== 'done'; });
    else if (a === 'rn') { var k = b.getAttribute('data-k'); rnOn[k] = !rnOn[k]; b.setAttribute('aria-pressed', rnOn[k] ? 'true' : 'false'); runNotice(); return; }
    else if (a === 'rn-add') {
      var x = RN.filter(function (y) { return y[0] === b.getAttribute('data-k'); })[0];
      mn().toast(addByTitle(x[7], x[5], x[6], x[8], x[9]) ? 'Added to My list · ' + openCount() : 'Already on your list');
      saveList(); syncUi(); runNotice(); return;
    } else if (a === 'fs-add') {
      mn().toast(addByTitle(F.boxfan, 'ventilation', 'filters', 1, 'once:Set up once|together:Together') ? 'Added to My list · ' + openCount() : 'Already on your list');
      saveList(); syncUi(); runSizer(); return;
    } else return;
    saveList(); syncUi();
  });
  document.addEventListener('input', function (e) { if (e.target.id && /^ai-fs-/.test(e.target.id)) runSizer(); });
  document.addEventListener('change', function (e) { if (e.target.id && /^ai-fs-/.test(e.target.id)) runSizer(); });

  /* ---------- profile panel ---------- */
  function onFile() {
    var p = prof(), rows = [];
    if (p.stove) rows.push(['Cooks on', p.stove]);
    if (p.hood) rows.push(['Kitchen fan', p.hood]);
    if (p.built) rows.push(['Building built', p.built]);
    if ((p.near || []).length) rows.push(['Close by', p.near.join(', ')]);
    var place = [p.home, p.shape].filter(Boolean);
    if (place.length) rows.push(['Place', place.join(' · ')]);
    var hh = [Number(p.kids) > 0 ? p.kids + ' kid' + (Number(p.kids) > 1 ? 's' : '') : '', p.pets].concat(p.consider || []).filter(Boolean);
    if (hh.length) rows.push(['Household', hh.join(' · ')]);
    return rows;
  }
  function panel() {
    var rows = onFile(), p = prof();
    if (!p.stove && !p.hood && !p.built && !(p.near || []).length) {
      return '<div class="ai-sit"><span class="eyebrow">Tailor this course</span><p>Your stove and kitchen fan (Profile → Food), when the building was built and what’s close by (Profile → Surroundings), plus your place and household, open the parts that fit. Everything here stays open to everyone.</p><a class="btn personal sm" href="#profile/food">Answer in Profile</a></div>';
    }
    return '<div class="ai-sit"><span class="eyebrow">Tailored to your profile</span><p>Sections for you are open and marked <span class="ai-foryou is-on">For you</span>.</p>' +
      '<span class="ai-review"><a href="#profile/food" aria-describedby="ai-onfile">Review what’s on file</a>' +
      '<span class="ai-pop" id="ai-onfile" role="tooltip"><span class="eyebrow">On file</span>' + rows.map(function (r) { return '<span class="ai-pop-row"><b>' + esc(r[0]) + '</b>' + esc(r[1]) + '</span>'; }).join('') +
      '<span class="ai-pop-foot">New stove, moved, or something changed nearby? Update it in your Profile.</span></span></span></div>';
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
    return '<nav class="ai-nav" aria-label="Air course"><details class="ai-nav-wrap"' + (wide ? ' open' : '') + '><summary class="ai-nav-head"><span class="eyebrow">Course map</span><b>Air &amp; temperature</b></summary>' +
      '<a class="ai-nav-over" href="' + BASE + '"' + (!cur ? ' aria-current="page"' : '') + '>Overview</a><ol class="ai-vt">' +
      U.map(function (u) {
        var on = cur === u.id;
        return '<li class="ai-vt-unit ak' + u.num + (on ? ' cur' : '') + '"><a class="ai-vt-head" href="' + BASE + '/' + u.id + '"' + (on ? ' aria-current="page"' : '') + '><span class="ai-vt-dot">' + u.num + '</span><span><b>' + u.word + '</b><small>' + u.sub + '</small></span></a>' +
          '<ul class="ai-vt-subs">' + u.subs.map(function (s) { return '<li><a' + (s.tool ? ' class="is-tool"' : '') + ' href="' + BASE + '/' + u.id + '/' + s.id + '">' + (s.tool ? 'Tool: ' : '') + s.title + '</a></li>'; }).join('') + '</ul></li>';
      }).join('') + '</ol>' +
      '<div class="ai-nav-tools"><span class="eyebrow">Tools</span>' +
      '<a class="ai-nav-over" href="' + BASE + '/notice"' + (cur === 'notice' ? ' aria-current="page"' : '') + '>What do you notice?</a>' +
      '<a class="ai-nav-over" href="' + BASE + '/ventilation/sizer">Filter sizer</a>' +
      '<a class="ai-nav-over" href="' + BASE + '/list"' + (cur === 'list' ? ' aria-current="page"' : '') + '>My list <span class="ai-cnt" id="ai-cnt">' + openCount() + '</span></a></div>' +
      '</details></nav>';
  }
  function layout(U, cur, main) {
    return mn().header('home') + '<div class="ai-layout">' + sidebar(U, cur) + '<main class="ai-main">' + panel() + main + '</main></div>' + mn().footer();
  }
  function viewOverview(U) {
    return '<section class="ai-hero"><span class="ai-lens-pill">Tier 2 · Roots · Course</span><h1 tabindex="-1">Air &amp; temperature</h1>' +
      '<p class="ai-lede">We breathe around 10,000 liters of air a day, most of it indoors. Lungs, a bird’s air sacs, a cat’s nose and a houseplant’s leaves all need the same thing: air that’s moving, not too wet, not too hot, and free of what heat and dust put into it. Five units, read in order or dipped into, each ending in a <b>How to fix</b>, free steps first.</p></section>' +
      '<div class="ai-ways">' +
        '<a class="ai-way ak1" href="' + BASE + '/what"><b>1 · Notice</b><p>What’s in the air at all: particles, gases, living things, and what disasters add. Then how to read it yourself.</p></a>' +
        '<a class="ai-way ak2" href="' + BASE + '/ventilation"><b>2 · Move it</b><p>Ventilation is the design answer: fresh air in, stale and damp air out, a filter between.</p></a>' +
        '<a class="ai-way ak3" href="' + BASE + '/dust"><b>3 · Carry it out</b><p>What settles stays for years. Vacuuming and damp cleaning remove it instead of kicking it back up.</p></a>' +
        '<a class="ai-way ak4" href="' + BASE + '/smoke"><b>4 · Turn down the heat</b><p>Fire, flames, hot pans and solvents make the most intense bursts. Short-lived, and airflow clears them.</p></a>' +
        '<a class="ai-way ak5" href="' + BASE + '/sun"><b>5 · Shade and warmth</b><p>Temperature rides in the air too. Shade, timing and safe warmth meet bodies where they are.</p></a>' +
      '</div>' +
      '<ol class="ai-ucards">' + U.map(function (u) {
        return '<li><a class="ai-ucard ak' + u.num + '" href="' + BASE + '/' + u.id + '"><i class="ai-band-top"></i><span class="ai-n">0' + u.num + '</span><b>' + u.word + '</b><span>' + u.sub + '</span><ol>' + u.subs.filter(function (s) { return !s.tool; }).map(function (s) { return '<li>' + s.title + '</li>'; }).join('') + '</ol>' +
          '<span class="ai-modes">' + u.modes.map(function (m) { return mode(m); }).join('') + '</span></a></li>';
      }).join('') + '</ol>' +
      '<aside class="ai-toolcard"><span class="eyebrow">Tools</span><p>Shortcuts into the course, for when something’s happening right now. Every unit above stays open to read either way.</p>' +
      '<div class="ai-btns"><a class="btn" href="' + BASE + '/notice">What do you notice?</a><a class="btn" href="' + BASE + '/ventilation/sizer">Filter sizer</a><a class="btn" href="' + BASE + '/list">My list</a></div></aside>' +
      '<aside class="ai-funfact"><span class="eyebrow">Fun fact</span><p>A gas burner on high, or a pan of something searing, can push fine particles in a kitchen higher than a smoggy day outside, and an open window plus a fan pointing out can bring them back down in well under an hour. Air answers fast, which makes it one of the most satisfying needs to meet.</p>' +
      '<p>Numbers come from public health research and agencies (EPA, CDC, CARB, Lawrence Berkeley National Laboratory, WHO), cited in each section. Laws mentioned are California’s; the physics is the same everywhere.</p>' + src('Singer et al., <i>Building and Environment</i> 2017; Logue et al., <i>Environmental Health Perspectives</i> 2014.') + '</aside>' +
      (mn().deeper && mn().credits ? mn().deeper('People whose work shaped this course, and where to go for more.', mn().credits('air')) : '');
  }
  function viewNotice() {
    setTimeout(runTools, 0);
    return '<article class="ai-unit ak1"><header class="ai-unit-hero"><span class="eyebrow">Tool</span><h1 tabindex="-1">What do you notice?</h1><p class="ai-unit-sub">The fastest fix, then where to learn more</p>' +
      '<p class="ai-lede">Your nose, eyes, windows and body are good instruments. Pick everything you notice and the fixes come back in order: anything urgent first, then the free ones that work in minutes. Each one links into the course, which stays open to read from the start either way.</p></header>' +
      '<section class="ai-tool"><b class="ai-tool-t">Pick what you notice</b><div class="ai-picks" id="ai-rn"></div><div class="ai-out" id="ai-rn-out"></div></section>' +
      legend('A quick read, not a diagnosis.') + '</article>';
  }
  function viewList() {
    setTimeout(syncUi, 0);
    return '<article class="ai-unit ak2"><header class="ai-unit-hero"><span class="eyebrow">Your list</span><h1 tabindex="-1">My list</h1><p class="ai-unit-sub">One change at a time, in the order you choose</p>' +
      '<p class="ai-lede">Every “How to fix” you add lands here. Move the ones that matter most, or cost least, to the top, and tap the status to move it along. There’s no deadline and no score.</p>' +
      '<div class="ai-progress" aria-hidden="true"><i id="ai-bar"></i></div><p class="ai-legend" id="ai-sum"></p></header>' +
      '<ol class="ai-lst" id="ai-lst"></ol><div class="ai-empty" id="ai-empty">Nothing here yet. Add any “How to fix” as you read, or try <a href="' + BASE + '/notice">What do you notice?</a></div>' +
      '<div class="ai-btns"><button type="button" class="btn" data-ai="sort">Free ones first</button><button type="button" class="btn" data-ai="clear">Clear done</button></div>' +
      legend('Saved only in this browser.') + '</article>';
  }
  function viewUnit(U, u, subId) {
    var i = U.indexOf(u), prev = U[i - 1], next = U[i + 1];
    var html = '<article class="ai-unit ak' + u.num + '">' +
      '<header class="ai-unit-hero"><span class="eyebrow">Unit ' + u.num + ' of ' + U.length + '</span><h1 tabindex="-1">' + u.word + '</h1><p class="ai-unit-sub">' + u.sub + '</p><p class="ai-lede">' + u.lede + '</p>' +
      (u.mode ? '<p class="ai-unit-mode">' + u.modes.map(function (m) { return mode(m); }).join('') + ' ' + u.mode + '</p>' : '') +
      '<ul class="ai-jumps">' + u.subs.map(function (s) { return '<li><a href="' + BASE + '/' + u.id + '/' + s.id + '"><span>' + NUM[u.id + '/' + s.id] + '</span>' + s.short + '</a></li>'; }).join('') + '</ul></header>' +
      u.subs.map(function (s) {
        CUR = { u: u.id, s: s.id };
        if (s.tool) return '<section class="ai-tool" id="ai-' + u.id + '-' + s.id + '"><span class="eyebrow">Tool</span><b class="ai-tool-t">' + s.title + '</b>' + s.html() + '</section>';
        return '<section class="ai-sub" id="ai-' + u.id + '-' + s.id + '"><div class="ai-sub-top"><span class="ai-sub-n">' + NUM[u.id + '/' + s.id] + '</span><h2>' + s.title + '</h2></div>' + s.html() + '</section>';
      }).join('') +
      '</article><nav class="ai-pager" aria-label="Units">' +
      (prev ? '<a href="' + BASE + '/' + prev.id + '"><small>← Previous</small><b>' + prev.num + ' · ' + prev.word + '</b></a>' : '<a href="' + BASE + '"><small>← Back to</small><b>Overview</b></a>') +
      (next ? '<a class="next" href="' + BASE + '/' + next.id + '"><small>Next unit →</small><b>' + next.num + ' · ' + next.word + '</b></a>' : '<a class="next" href="' + BASE + '/list"><small>Your list →</small><b>My list</b></a>') +
      '</nav>';
    setTimeout(function () {
      runTools();
      var el = subId && document.getElementById('ai-' + u.id + '-' + subId);
      if (el) el.scrollIntoView({ block: 'start' });
    }, 0);
    return html;
  }

  window.MN_LENS_VIEWS = window.MN_LENS_VIEWS || {};
  window.MN_LENS_VIEWS.air = function (sub) {
    T = tags();
    var U = units(); index(U);
    var seg = (sub || '').split('/'), u = UIDX[seg[0]];
    if (seg[0] === 'list') return { title: 'My list · Air & temperature · Kinship', html: layout(U, 'list', viewList()) };
    if (seg[0] === 'notice') return { title: 'What do you notice? · Air & temperature · Kinship', html: layout(U, 'notice', viewNotice()) };
    if (u) return { title: u.word.replace('&amp;', '&') + ' · Air & temperature · Kinship', html: layout(U, u.id, viewUnit(U, u, seg[1])) };
    return { title: 'Air & temperature · Kinship', html: layout(U, null, viewOverview(U)) };
  };
})();
