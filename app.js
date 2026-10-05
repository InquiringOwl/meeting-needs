/* Kinship: home, lens pages and profile. Plain JS, no build step.
   Routes (hash): '' home · 'plans' · 'favorites' · 'profile' · 'lens-<id>[/<sub>]'. A lens with a course registers
   window.MN_LENS_VIEWS[id](sub, lens) → { html, title } (see rel.js).
   The profile is saved only in this browser (localStorage). */
(function () {
  'use strict';

  var TIERS = window.MN_TIERS || [];
  var LENS = {};
  TIERS.forEach(function (t) { t.lenses.forEach(function (l) { l.tier = t; LENS[l.id] = l; }); });
  var COUNT = Object.keys(LENS).length;

  var STATUS = { ready: 'Ready', building: 'In progress', next: 'Next', soon: 'Soon', later: 'Later' };
  var STATUS_NOTE = {
    ready: '',
    building: 'This lens is being written now.',
    next: 'This lens comes after the Roots lenses.',
    soon: 'This lens is coming soon, after the Next ones.',
    later: 'This lens is planned for a later tier.'
  };

  var KEY = 'meeting-needs.profile.v1';
  var OPT = {
    /* Place questions ask what the place is and how long/how much you can shape it, not who owns it. */
    home: ['Apartment or room', 'House', 'Vehicle or boat', 'Shelter or no fixed place', 'Other'],
    stay: ['No fixed place right now', 'Under a year', 'A few years', 'Long-term, putting down roots', 'Not sure'],
    shape: ['Nothing: it all has to be portable', 'Small, removable things', 'Bigger changes, with an owner who’s on board', 'It’s ours to shape'],
    /* Water: where it comes from now, and how much each source carries you. 'notap' is a plain fact, not a crisis flag. */
    sources: [
      { id: 'notap', label: 'No safe tap water at home', hint: 'none, or not safe to drink', single: true },
      { id: 'tap', label: 'Safe tap water at home' },
      { id: 'refill', label: 'Public refill points' },
      { id: 'bottled', label: 'Bottled or delivered water' },
      { id: 'well', label: 'Private well' },
      { id: 'spring', label: 'Spring' },
      { id: 'rain', label: 'Rain catchment' },
      { id: 'wild', label: 'Creeks, rivers or lakes' }
    ],
    levels: ['Sometimes', 'Often', 'Main source'],
    filters: ['Pitcher filter', 'Faucet filter', 'Countertop reverse osmosis (like AquaTru)', 'Under-sink filter', 'Under-sink reverse osmosis', 'Whole-house filter', 'Gravity filter', 'Squeeze or backpacking filter', 'UV purifier', 'Water softener', 'None yet'],
    pipes: ['Before 1986 (older pipes)', '1986 or later', 'Not sure'],
    rain: ['Rarely (desert or long droughts)', 'Mostly one season (like most of California)', 'Through much of the year'],
    /* Food: how you can cook and keep food cold right now. */
    kitchen: ['A full kitchen', 'A hot plate, rice cooker or microwave', 'A shared kitchen', 'No way to cook right now'],
    cold: ['Fridge and freezer', 'A small or shared fridge', 'A cooler, or no fridge'],
    /* Air: what cooks the food, and where the kitchen air goes (Air course). */
    stove: ['Gas', 'Electric (coil or smooth top)', 'Induction', 'Hot plate or countertop only', 'No stove'],
    hood: ['Vents outside', 'Recirculates (no duct)', 'No hood or fan', 'Not sure'],
    /* Surroundings: what the building and the neighborhood bring (Poisons course). */
    built: ['Before 1978', '1978 or later', 'Not sure'],
    near: ['A freeway or busy road', 'Factory, refinery or oil and gas wells', 'Farm fields', 'An airport', 'None of these'],
    /* Cleaning: what the counters are made of (stone changes the vinegar advice) and where the wash gets done (Cleaning course). */
    counter: ['Laminate or plastic', 'Sealed granite or quartz', 'Marble, limestone or travertine', 'Wood or butcher block', 'Tile and grout', 'Stainless steel', 'Concrete', 'Not sure'],
    laundry: ['Machine at home', 'Shared machines in the building', 'Laundromat', 'By hand', 'A mix of these'],
    space: ['Windowsill', 'Balcony', 'Shared yard', 'Private yard', 'Community plot', 'Acreage or farmland', 'None yet'],
    consider: ['Asthma', 'Allergies', 'Pregnancy', 'Babies or toddlers', 'Chronic illness', 'Limited mobility'],
    hours: ['Under 1', '1 to 3', '3 to 6', 'More than 6'],
    budget: ['Free fixes only', 'Tight', 'Some room'],
    priorities: [
      { id: 'water', label: 'Not sure my water is safe', lens: 'water' },
      { id: 'pans', label: 'Nonstick pans and plastic', lens: 'toxins' },
      { id: 'stains', label: 'Clothes ruined by stains', lens: 'cleaning' },
      { id: 'grow', label: 'Want to grow food', lens: 'gardening' },
      { id: 'damp', label: 'Stuffy, damp rooms', lens: 'air' },
      { id: 'tension', label: 'Tension at home', lens: 'relationships' },
      { id: 'products', label: 'Too many products under the sink', lens: 'household-tools' },
      { id: 'broken', label: 'Things break and get tossed', lens: 'repair' }
    ]
  };
  var CONSIDER_LENS = {
    'Asthma': ['air', 'toxins'], 'Allergies': ['air', 'cleaning'], 'Pregnancy': ['toxins', 'water'],
    'Babies or toddlers': ['toxins', 'water'], 'Chronic illness': ['toxins', 'food'], 'Limited mobility': ['relationships']
  };
  var MAX_PRIORITIES = 3;

  /* Favorites: starred sub-units, stored as 'lensId:index' in this browser. */
  var FAV_KEY = 'meeting-needs.favorites.v1';
  var favs = (function () {
    try { var a = JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); if (Array.isArray(a)) return a.map(String); } catch (e) {}
    return [];
  })();
  function isFav(k) { return favs.indexOf(k) !== -1; }
  function toggleFav(k) {
    var i = favs.indexOf(k);
    if (i === -1) favs.push(k); else favs.splice(i, 1);
    try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch (e) { toast('Couldn’t save: this browser is blocking site storage'); }
    return i === -1;
  }
  var STAR = '<svg width="20" height="20" viewBox="0 0 24 24" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/></svg>';
  function starBtn(k, label) {
    var on = isFav(k);
    return '<button type="button" class="star" data-fav="' + esc(k) + '" aria-pressed="' + on + '" aria-label="Star: ' + esc(label) + '">' + STAR + '</button>';
  }

  function blank() {
    return { address: '', zone: '', home: '', stay: '', shape: '', space: [], sources: {}, filters: [], pipes: '', rain: '', kitchen: '', cold: '', stove: '', hood: '', built: '', near: [], counter: '', laundry: '', adults: '', kids: '', pets: '', consider: [], hours: '', budget: '', priorities: [] };
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) return normalize(JSON.parse(raw));
    } catch (e) { /* storage blocked or bad data */ }
    return blank();
  }
  function normalize(obj) {
    var p = blank();
    if (!obj || typeof obj !== 'object') return p;
    Object.keys(p).forEach(function (k) {
      if (Array.isArray(p[k])) p[k] = Array.isArray(obj[k]) ? obj[k].map(String) : [];
      else if (k === 'sources') {
        var src = obj.sources && typeof obj.sources === 'object' ? obj.sources : {};
        OPT.sources.forEach(function (o) { if (src[o.id]) p.sources[o.id] = String(src[o.id]); });
      }
      else if (obj[k] != null) p[k] = String(obj[k]);
    });
    /* Older profiles stored tenure in 'home'; keep the kind of place, drop the tenure. */
    var OLD_HOME = { 'Renting an apartment': 'Apartment or room', 'Renting a house': 'House', 'Own a house': 'House', 'Shared or co-op housing': 'Apartment or room' };
    if (OLD_HOME[p.home]) p.home = OLD_HOME[p.home];
    /* 'Land or farm' was a kind of place; land is now outdoor space, so the house and the land are separate answers. */
    if (p.home === 'Land or farm') { p.home = 'House'; if (p.space.indexOf('Acreage or farmland') === -1) p.space.push('Acreage or farmland'); }
    /* The old single 'water' answer becomes a main source. */
    var OLD_WATER = { 'City tap': 'tap', 'Private well': 'well', 'Spring': 'spring', 'Rain catchment': 'rain', 'Hauled or delivered': 'bottled', 'Public refill points': 'refill' };
    if (obj.water && OLD_WATER[obj.water] && !Object.keys(p.sources).length) p.sources[OLD_WATER[obj.water]] = 'Main source';
    return p;
  }
  var profile = load();
  var saveTimer = null;
  function save(quiet) {
    try {
      localStorage.setItem(KEY, JSON.stringify(profile));
      if (!quiet) toast('Saved on this device');
    } catch (e) {
      toast('Couldn’t save: this browser is blocking site storage');
    }
  }
  function saveSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(function () { save(); }, 500); }
  function isEmpty(p) {
    return !p.home && !p.stay && !p.shape && !p.rain && !p.pipes && !p.kitchen && !p.cold && !p.stove && !p.hood && !p.built && !p.near.length && !p.counter && !p.laundry && !Object.keys(p.sources).length && !p.filters.length && !p.zone && !p.address && !p.adults && !p.kids && !p.pets && !p.hours && !p.budget &&
      !p.space.length && !p.consider.length && !p.priorities.length;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function plural(n, word) { n = Number(n); return n + ' ' + word + (n === 1 ? '' : 's'); }

  function suggestions(p) {
    var ids = [];
    p.priorities.forEach(function (pid) {
      var o = OPT.priorities.filter(function (x) { return x.id === pid; })[0];
      if (o) ids.push(o.lens);
    });
    p.consider.forEach(function (c) { (CONSIDER_LENS[c] || []).forEach(function (id) { ids.push(id); }); });
    var seen = {};
    return ids.filter(function (id) { if (seen[id] || !LENS[id]) return false; seen[id] = 1; return true; })
      .slice(0, 3).map(function (id) { return LENS[id]; });
  }
  function household(p) {
    var parts = [];
    if (p.adults !== '' && Number(p.adults) > 0) parts.push(plural(p.adults, 'adult'));
    if (p.kids !== '' && Number(p.kids) > 0) parts.push(Number(p.kids) === 1 ? '1 kid' : p.kids + ' kids');
    if (p.pets) parts.push(p.pets);
    return parts.join(' · ');
  }

  /* ---------- views ---------- */
  /* Logo: a cut-paper chain of hearts, folded at the joins. Love as a practice, made by hand and linked. */
  var LOGO = (function () {
    var H = 'M12 21.2C7.4 18 3.3 14.6 2.4 10.9 1.6 7.5 3.8 4.6 6.9 4.6c2.1 0 3.6 1.2 5.1 3.1 1.5-1.9 3-3.1 5.1-3.1 3.1 0 5.3 2.9 4.5 6.3C20.7 14.6 16.6 18 12 21.2z';
    var hearts = ['rotate(-5 12 13)', 'translate(17 0.6)', 'translate(34 0) rotate(5 12 13)'].map(function (t) { return '<path d="' + H + '" transform="' + t + '"/>'; }).join('');
    return '<svg class="logo" width="62" height="25" viewBox="0 0 60 24" aria-hidden="true"><g transform="translate(0 -1.4)">' +
      '<g fill="#C2477F" stroke="#C2477F" stroke-width="3.2" stroke-linejoin="round">' + hearts + '</g>' +
      '<g fill="#FCEFF4" stroke="none">' + hearts + '</g>' +
      '<g fill="none" stroke="#C2477F" stroke-width="1" stroke-dasharray="1.4 1.6" stroke-linecap="round" opacity=".7"><path d="M20.6 7.6v6.2"/><path d="M37.6 7.8v6.2"/></g>' +
      '</g></svg>';
  })();

  function header(active) {
    function link(href, label, key) {
      return '<a href="' + href + '"' + (active === key ? ' aria-current="page"' : '') + '>' + label + '</a>';
    }
    return '<header class="top glass">' +
      '<div class="top-left"><a class="brand" href="#">' + LOGO + '<b>Kinship</b></a>' +
      '<nav class="nav" aria-label="About">' + link('#about', 'About', 'about') + '</nav></div>' +
      '<nav class="nav" aria-label="Main">' +
      eduMenu(active === 'home') +
      plansMenu(active === 'plans') +
      link('#favorites', 'Favorites', 'favorites') +
      link('#profile', 'Profile', 'profile') +
      '</nav></header>';
  }
  /* Education dropdown: hover (or keyboard focus) shows the tiers; hovering a tier opens its lenses to the left.
     Only ready lenses link; the rest are shown faded with their status. */
  function eduMenu(current) {
    var tiers = TIERS.map(function (t) {
      var items = t.lenses.map(function (l) {
        if (l.status === 'ready') return '<a class="nav-item" href="#lens-' + l.id + '">' + esc(l.name) + '</a>';
        if (LAZY[l.id]) return '<a class="nav-item" href="#lens-' + l.id + '">' + esc(l.name) + '<small>' + (STATUS[l.status] || '') + '</small></a>';
        return '<span class="nav-item is-off" aria-disabled="true">' + esc(l.name) + '<small>' + (STATUS[l.status] || '') + '</small></span>';
      }).join('');
      return '<div class="nav-tier" style="--tc:' + t.color + '" tabindex="0">' +
        '<span class="nav-tier-pill">' + t.num + '</span><span class="nav-tier-name">' + esc(t.name) + '</span>' +
        '<div class="nav-sub"><div class="nav-sub-in">' +
        '<span class="nav-sub-head">Tier ' + t.num + ' · ' + esc(t.name) + '</span>' + items + '</div></div></div>';
    }).join('');
    return '<div class="navdrop">' +
      '<a href="#"' + (current ? ' aria-current="page"' : '') + ' aria-haspopup="true">Education</a>' +
      '<div class="nav-menu"><div class="nav-menu-in">' + tiers + '</div></div></div>';
  }
  /* Plans dropdown: the same on every page. */
  var PLANS = [
    { id: 'education', name: 'Education plan', blurb: 'Your next most useful lessons' },
    { id: 'budget', name: 'Improvements & budget', blurb: 'What meeting needs costs, now and after upgrades' },
    { id: 'garden', name: 'Garden planner', blurb: '12 months, seed by seed' }
  ];
  function plansMenu(current) {
    return '<div class="navdrop">' +
      '<a href="#plans"' + (current ? ' aria-current="page"' : '') + ' aria-haspopup="true">Plans</a>' +
      '<div class="nav-menu"><div class="nav-menu-in plans-in">' +
      PLANS.map(function (pl) { return '<a class="nav-item plan-item" href="#plans/' + pl.id + '"><b>' + esc(pl.name) + '</b><small>' + esc(pl.blurb) + '</small></a>'; }).join('') +
      '</div></div></div>';
  }
  /* Creator opinions: pink (tier 1 and logo color), set apart so the rest of the site reads as relatively objective. */
  function opinion(html, title) {
    return '<aside class="opinion"><span class="opinion-head"><span class="opinion-dot" aria-hidden="true"></span>' + (title ? esc(title) : 'Creator’s consideration') + '</span>' + html + '</aside>';
  }
  function footer() {
    return '<footer class="foot"><span>Kinship · free and open source</span><span class="eyebrow">Grow · Fix · Share</span></footer>';
  }

  function setupCard() {
    if (isEmpty(profile)) {
      return '<aside class="setup" aria-label="Personalize">' +
        '<div class="setup-head"><h3>Personalize</h3><span class="eyebrow">Your profile</span></div>' +
        '<p>To personalize, share context about your life circumstances and goals.</p>' +
        '<div><a class="btn personal" href="#profile">Share your context</a></div>' +
        '<span class="hint">Saved only on this device.</span>' +
        '</aside>';
    }
    var headline = [profile.home, profile.space.join(' + ')].filter(Boolean).join(' · ') || 'Your home';
    var chips = [];
    if (profile.zone) chips.push('Zone ' + profile.zone);
    var hh = household(profile); if (hh) chips.push(hh);
    profile.consider.forEach(function (c) { chips.push(c); });
    if (profile.budget) chips.push(profile.budget);
    var sug = suggestions(profile);
    var sugHtml = sug.length
      ? '<p>Start with ' + sug.map(function (l) { return '<a href="#lens-' + l.id + '"><strong>' + esc(l.name) + '</strong></a>'; }).join(sug.length === 2 ? ' then ' : ', ') + '.</p>'
      : '<p>Pick what’s bugging you most in your profile and we’ll suggest where to start.</p>';
    return '<aside class="setup" aria-label="Personalize">' +
      '<div class="setup-head"><h3>' + esc(headline) + '</h3><a class="btn personal sm" href="#profile">Edit</a></div>' +
      (chips.length ? '<div class="chips">' + chips.map(function (c) { return '<span class="chip">' + esc(c) + '</span>'; }).join('') + '</div>' : '') +
      sugHtml + '</aside>';
  }

  function lensCard(l) {
    var solid = l.tier.num === 1 || l.status === 'ready';
    var linked = !l.tier.locked || l.status === 'ready';
    var cls = 'lens is-' + l.status + (solid ? ' is-solid' : '');
    /* Tier 1 and 2 cards skip the top row when ready: the solid card already says so, and the row only took space. */
    var top = l.tier.num <= 2 && l.status === 'ready' ? '' : (STATUS[l.status] ? '<span class="badge ' + l.status + '">' + STATUS[l.status] + '</span>' : '');
    var tag = linked ? 'a' : 'div';
    if (!linked) cls += ' is-static';
    return '<' + tag + ' class="' + cls + '"' + (linked ? ' href="#lens-' + l.id + '"' : '') + ' style="--lc:' + l.color + '">' +
      '<div class="lens-head"><h3>' + esc(l.name) + '</h3>' + top + '</div>' +
      '<p>' + esc(l.blurb) + '</p>' +
      '<div class="topics">' + l.topics.map(esc).join(' · ') + '</div>' +
      '</' + tag + '>';
  }

  function viewAbout() {
    return header('about') +
      '<section class="hero"><div class="hero-copy">' +
      '<span class="eyebrow">About</span>' +
      '<h1 tabindex="-1">Hi, I’m Ashley.</h1>' +
      '<p>Based in San Francisco. Kinship is simply made from love: free and open source, so we can all learn what we need to live.</p>' +
      '<p>It’s a modern tribute to the Diggers and the organized hippies: the San Francisco Diggers served free food in the Panhandle and ran free stores in the 1960s, named for the English Diggers who farmed common land in 1649. Alicia Bay Laurel opened <i>Living on the Earth</i> (1970) by dedicating it to people who’d rather chop wood than sit at a desk to pay the power company.</p>' +
      '<p>My reasons go deeper than free. The system isn’t working for so many people, and we’ve lost touch with what actually meets our needs, putting too much trust in broken systems.</p>' +
      '<p>Kinship won’t solve these problems alone. It’s the clearest way I could package self-empowering information, for you to take and apply in your own life.</p>' +
      '<p>Most of Kinship aims to be plain, checkable information you can weigh for yourself. My own considerations show up in pink, one sentence each:</p>' +
      opinion('<p>One why, for you to weigh.</p>') +
      '<p>The first is at the end of <a href="#lens-water/uses">Water: Uses</a>.</p>' +
      '</div></section>' + footer();
  }

  /* On phones each tier's cards scroll sideways one at a time (style.css); these dots show where you are. */
  function tierDots(n) {
    var d = '';
    for (var i = 0; i < n; i++) d += '<i' + (i === 0 ? ' class="on"' : '') + '></i>';
    return '<div class="tier-dots" aria-hidden="true">' + d + '</div>';
  }

  function viewHome() {
    var tiers = TIERS.map(function (t) {
      return '<section class="tier glass" data-tier="' + t.num + '" style="--tc:' + t.color + '" aria-labelledby="tier-' + t.id + '">' +
        '<div class="tier-head"><div class="tier-title">' +
        '<span class="tier-pill">Tier ' + t.num + '</span>' +
        '<h2 id="tier-' + t.id + '">' + esc(t.name) + '</h2>' +
        '<p>' + esc(t.blurb) + '</p></div>' +
        '</div>' +
        /* Tier 1: the first lens, then Personalize, then the rest. */
        '<div class="grid">' + (t.num === 1 ? lensCard(t.lenses[0]) + setupCard() + t.lenses.slice(1).map(lensCard).join('') : t.lenses.map(lensCard).join('')) + '</div>' +
        tierDots(t.lenses.length + (t.num === 1 ? 1 : 0)) +
        '</section>';
    }).join('');
    return header('home') +
      '<section class="hero">' +
      '<div class="hero-copy">' +
      '<span class="eyebrow">Free &amp; open source · ' + COUNT + ' lenses</span>' +
      '<h1 tabindex="-1">End systemic profit&#8209;extraction cycles.</h1>' +
      '<p>Learn how to meet universal needs. Empower yourself to fix problems. Create peace.</p>' +
      '</div></section>' +
      tiers + footer();
  }

  function viewLens(l) {
    var sibs = l.tier.lenses.filter(function (x) { return x.id !== l.id; }).map(function (x) {
      return '<a class="sib" href="#lens-' + x.id + '" style="--lc:' + x.color + '"><span class="dot" aria-hidden="true"></span>' + esc(x.name) + '</a>';
    }).join('');
    var planner = l.id === 'gardening'
      ? '<div class="note">The garden planner will live in this lens: your zone and light from your profile, then a 12-month plan for your space.</div>'
      : '';
    return header('home') +
      '<div><a class="back" href="#">← Education</a></div>' +
      '<div class="lens-page" style="--lc:' + l.color + '">' +
      '<article class="lens-main glass">' +
      '<div class="lens-top"><span class="eyebrow">Tier ' + l.tier.num + ' · ' + esc(l.tier.name) + '</span>' +
      (STATUS[l.status] ? '<span class="badge ' + l.status + '">' + STATUS[l.status] + '</span>' : '') + '</div>' +
      '<h1 tabindex="-1">' + esc(l.name) + '</h1>' +
      '<p class="lede">' + esc(l.blurb) + '</p>' +
      '<h2>What this lens looks for</h2>' +
      '<p class="hint">Star a sub-unit to keep it in Favorites.</p>' +
      '<ul class="looks">' + l.looks.map(function (s, i) { return '<li><span>' + esc(s) + '</span>' + starBtn(l.id + ':' + i, s) + '</li>'; }).join('') + '</ul>' +
      planner +
      (STATUS_NOTE[l.status] ? '<div class="note">' + STATUS_NOTE[l.status] + '</div>' : '') +
      '</article>' +
      '<aside class="side glass" aria-label="Other lenses in ' + esc(l.tier.name) + '">' +
      '<span class="eyebrow">More in ' + esc(l.tier.name) + '</span>' + sibs +
      '</aside></div>' + footer();
  }

  function viewPlans() {
    var sug = suggestions(profile);
    var start = sug.length
      ? '<p>Based on your profile, start with ' + sug.map(function (l) { return '<a href="#lens-' + l.id + '"><strong>' + esc(l.name) + '</strong></a>'; }).join(', ') + '.</p>'
      : '<p>Share a little about your life in your profile and a starting plan will appear here.</p><div><a class="btn personal" href="#profile">Share your context</a></div>';
    return header('plans') +
      '<section class="intro"><span class="eyebrow">Plans</span>' +
      '<h1 tabindex="-1">Plans for your actual life.</h1>' +
      '<p>Step-by-step plans built from your profile. More arrive as each lens is finished.</p></section>' +
      '<div class="plan-grid">' +
      '<article class="plan glass" id="plan-education"><span class="eyebrow">Education plan</span><h2>Where to begin</h2>' + start + '</article>' +
      '<article class="plan glass" id="plan-budget" style="--lc:#2C64A0"><div class="lens-top"><span class="eyebrow">Improvements &amp; budget</span><span class="badge building">In progress</span></div>' +
      '<h2>What meeting needs costs</h2><p>Add up what it takes to meet your minimum needs, one-time and ongoing, and compare the ongoing cost before and after an improvement, like a filter instead of bottled water. It’s expensive being poor; this makes the math visible so savings can add up.</p>' +
      '<p><a href="#lens-water/costs"><strong>Start with the water math →</strong></a></p></article>' +
      '<a class="plan glass" id="plan-garden" href="#lens-gardening" style="--lc:#3E7B3A"><div class="lens-top"><span class="eyebrow">Garden planner</span><span class="badge building">In progress</span></div>' +
      '<h2>12 months, seed by seed</h2><p>Your zone and light from your profile, then a month-by-month plan for the space you have.</p></a>' +
      '</div>' + footer();
  }

  function viewFavorites() {
    var groups = {};
    favs.forEach(function (k) {
      var parts = k.split(':'), l = LENS[parts[0]], i = Number(parts[1]);
      if (!l || !l.looks[i]) return;
      (groups[l.id] = groups[l.id] || []).push(i);
    });
    var ids = Object.keys(groups);
    var body = ids.length ? ids.map(function (id) {
      var l = LENS[id];
      return '<section class="fav-group glass" style="--lc:' + l.color + '">' +
        '<a class="fav-lens" href="#lens-' + l.id + '"><span class="dot" aria-hidden="true"></span>' + esc(l.name) + '</a>' +
        '<ul class="looks">' + groups[id].map(function (i) { return '<li><span>' + esc(l.looks[i]) + '</span>' + starBtn(id + ':' + i, l.looks[i]) + '</li>'; }).join('') + '</ul>' +
        '</section>';
    }).join('') : '<div class="note">Nothing starred yet. Open any lens and tap the star beside a sub-unit to keep it here.</div>';
    return header('favorites') +
      '<section class="intro"><span class="eyebrow">Favorites</span>' +
      '<h1 tabindex="-1">Your starred sub-units.</h1>' +
      '<p>Everything you’ve starred across all education, saved in this browser.</p></section>' +
      '<div class="favs">' + body + '</div>' + footer();
  }

  function selectField(id, label, list, value) {
    return '<div class="field"><label for="f-' + id + '">' + label + '</label>' +
      '<select id="f-' + id + '" data-field="' + id + '"><option value="">Choose…</option>' +
      list.map(function (o) { return '<option' + (o === value ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') +
      '</select></div>';
  }
  function textField(id, label, value, opts) {
    opts = opts || {};
    return '<div class="field"><label for="f-' + id + '">' + label + (opts.hint ? ' <span class="hint">' + opts.hint + '</span>' : '') + '</label>' +
      '<input id="f-' + id + '" data-field="' + id + '" type="' + (opts.type || 'text') + '"' +
      (opts.type === 'number' ? ' min="0" max="20" inputmode="numeric"' : '') +
      (opts.placeholder ? ' placeholder="' + esc(opts.placeholder) + '"' : '') +
      ' value="' + esc(value) + '" autocomplete="off"></div>';
  }
  function pickField(id, label, list, hint) {
    var labelId = 'l-' + id;
    return '<div class="field"><span class="label" id="' + labelId + '">' + label + (hint ? ' <span class="hint">' + hint + '</span>' : '') + '</span>' +
      '<div class="pick" role="group" aria-labelledby="' + labelId + '">' +
      list.map(function (o) {
        var val = typeof o === 'string' ? o : o.id;
        var text = typeof o === 'string' ? o : o.label;
        var on = profile[id].indexOf(val) !== -1;
        return '<button type="button" data-pick="' + id + '" data-val="' + esc(val) + '" aria-pressed="' + on + '">' + esc(text) + '</button>';
      }).join('') + '</div></div>';
  }

  function srcRow(o) {
    var cur = profile.sources[o.id] || '';
    var btns = o.single ? [['Yes', 'That’s me']] : OPT.levels.map(function (l) { return [l, l]; });
    return '<div class="src"><span class="src-name">' + esc(o.label) + (o.hint ? '<small>' + esc(o.hint) + '</small>' : '') + '</span>' +
      '<span class="seg">' + btns.map(function (b) {
        return '<button type="button" data-src="' + o.id + '" data-lvl="' + esc(b[0]) + '" aria-pressed="' + (cur === b[0]) + '">' + esc(b[1]) + '</button>';
      }).join('') + '</span></div>';
  }
  function stepDone(step) {
    var p = profile;
    if (step === 'place') return !!(p.home || p.stay || p.shape || p.zone || p.address || p.space.length);
    if (step === 'water') return !!(Object.keys(p.sources).length || p.filters.length || p.pipes || p.rain);
    if (step === 'food') return !!(p.kitchen || p.cold || p.stove || p.hood);
    if (step === 'toxins') return !!(p.built || p.near.length);
    if (step === 'cleaning') return !!(p.counter || p.laundry);
    if (step === 'household') return !!(p.adults || p.kids || p.pets || p.consider.length);
    if (step === 'resources') return !!(p.hours || p.budget);
    if (step === 'priorities') return p.priorities.length > 0;
    return false;
  }
  function stepsNav() {
    var steps = [['place', 'Place'], ['water', 'Water'], ['food', 'Food'], ['toxins', 'Surroundings'], ['cleaning', 'Cleaning'], ['household', 'Household'], ['resources', 'Time & money'], ['priorities', 'Priorities']];
    return '<nav class="steps glass" aria-label="Profile sections">' + steps.map(function (s, i) {
      return '<button type="button" data-jump="' + s[0] + '" class="' + (stepDone(s[0]) ? 'done' : '') + '"><span class="n" aria-hidden="true">' + (i + 1) + '</span>' + esc(s[1]) + '</button>';
    }).join('') + '</nav>';
  }

  function viewProfile() {
    var p = profile;
    return header('profile') +
      '<section class="intro"><span class="eyebrow">Profile · your life context</span>' +
      '<h1 tabindex="-1">Set up around your actual life.</h1>' +
      '<p>Where you live, who lives with you and what you can spend shape every lens: which filter, which swap comes first, what to plant. Everything here stays in this browser.</p></section>' +
      '<div class="profile">' + stepsNav() +
      '<form class="form" id="profile-form" novalidate>' +

      '<fieldset id="s-place" class="glass"><legend>Place</legend>' +
      '<div class="row">' +
      textField('address', 'Town or postcode', p.address, { hint: '(optional)', placeholder: 'Later lenses use it for rainfall and your water report' }) +
      textField('zone', 'Growing zone', p.zone, { placeholder: 'e.g. 9b' }) +
      '</div>' +
      '<p class="hint">Don’t know your zone? US: <a href="https://planthardiness.ars.usda.gov/" target="_blank" rel="noopener">USDA hardiness map</a>. Elsewhere, search your country’s plant hardiness map.</p>' +
      '<div class="row">' + selectField('home', 'Kind of place', OPT.home, p.home) + selectField('stay', 'How long do you expect to stay?', OPT.stay, p.stay) + '</div>' +
      '<div class="row">' + selectField('shape', 'How much can you change the place?', OPT.shape, p.shape) + '</div>' +
      '<p class="hint">How long you’ll stay and how much you can change (a friend who owns the place counts) decide what’s worth building: a pitcher filter or a cistern.</p>' +
      pickField('space', 'Outdoor or growing space', OPT.space, '(pick any)') +
      '</fieldset>' +

      '<fieldset id="s-water" class="glass"><legend>Water</legend>' +
      '<div class="field"><span class="label" id="l-sources">Where your water comes from now <span class="hint">(tap how much each one carries you)</span></span>' +
      '<div class="srcs" role="group" aria-labelledby="l-sources">' + OPT.sources.map(srcRow).join('') + '</div></div>' +
      pickField('filters', 'Water filters you already have', OPT.filters, '(pick any)') +
      '<div class="row">' + selectField('pipes', 'When were your building’s pipes put in?', OPT.pipes, p.pipes) + selectField('rain', 'How often does rain or snow fall?', OPT.rain, p.rain) + '</div>' +
      '<p class="hint">These change rarely. When something does (say, you now have a safe tap), update it here and the Water course follows.</p>' +
      '</fieldset>' +

      '<fieldset id="s-food" class="glass"><legend>Food</legend>' +
      '<div class="row">' + selectField('kitchen', 'How can you cook right now?', OPT.kitchen, p.kitchen) + selectField('cold', 'How do you keep food cold?', OPT.cold, p.cold) + '</div>' +
      '<div class="row">' + selectField('stove', 'What do you cook on?', OPT.stove, p.stove) + selectField('hood', 'Kitchen fan', OPT.hood, p.hood) + '</div>' +
      '<p class="hint">The Food course opens the parts that fit: one-pot cooking, cold soaking, a small fridge or none. The Air course reads the stove and fan: gas flames and getting kitchen air out.</p>' +
      '</fieldset>' +

      '<fieldset id="s-toxins" class="glass"><legend>Surroundings</legend>' +
      '<div class="row">' + selectField('built', 'When was the building built?', OPT.built, p.built) + '</div>' +
      pickField('near', 'Close by, within about half a mile', OPT.near, '(pick any)') +
      '<p class="hint">Lead paint was banned for homes in 1978. With what’s nearby, the Poisons course opens the parts that fit: soil testing, filters, spray alerts.</p>' +
      '</fieldset>' +

      '<fieldset id="s-cleaning" class="glass"><legend>Cleaning</legend>' +
      '<div class="row">' + selectField('counter', 'Your kitchen counters', OPT.counter, p.counter) + selectField('laundry', 'Where you do laundry', OPT.laundry, p.laundry) + '</div>' +
      '<p class="hint">The Cleaning course reads both: marble, limestone and concrete skip vinegar, and shared machines or washing by hand open their own tips.</p>' +
      '</fieldset>' +

      '<fieldset id="s-household" class="glass"><legend>Household</legend>' +
      '<div class="row">' +
      textField('adults', 'Adults', p.adults, { type: 'number' }) +
      textField('kids', 'Kids', p.kids, { type: 'number' }) +
      textField('pets', 'Pets', p.pets, { placeholder: 'e.g. 1 cat' }) +
      '</div>' +
      pickField('consider', 'Anything to plan around?', OPT.consider, '(optional)') +
      '</fieldset>' +

      '<fieldset id="s-resources" class="glass"><legend>Time &amp; money</legend>' +
      '<div class="row">' + selectField('hours', 'Hours a week', OPT.hours, p.hours) + selectField('budget', 'Budget for swaps', OPT.budget, p.budget) + '</div>' +
      '</fieldset>' +

      '<fieldset id="s-priorities" class="glass"><legend>What bugs you most right now?</legend>' +
      pickField('priorities', 'Pick up to three', OPT.priorities, '<span id="pri-count">(' + p.priorities.length + ' of ' + MAX_PRIORITIES + ')</span>') +
      '</fieldset>' +

      '<div class="actions">' +
      '<div class="group"><button type="button" class="btn quiet" data-action="ask-clear">Clear profile</button></div>' +
      '<div class="group"><a class="btn" href="#">Done</a></div>' +
      '</div>' +
      '<div class="confirm" id="confirm-clear" hidden><span>Clear everything in your profile on this device?</span>' +
      '<button type="button" class="btn" data-action="clear">Clear it</button>' +
      '<button type="button" class="btn ghost" data-action="keep">Keep it</button></div>' +

      '<details class="backup glass"><summary>Back up or move to another device</summary><div class="inner">' +
      '<p class="hint">Your profile lives only in this browser. Copy the backup text and paste it into Kinship on another device or browser to restore it.</p>' +
      '<div class="group" style="display:flex;flex-wrap:wrap;gap:10px"><button type="button" class="btn ghost" data-action="copy">Copy backup</button>' +
      '<button type="button" class="btn ghost" data-action="restore">Restore from pasted text</button></div>' +
      '<label class="label" for="backup-text" style="font-size:14px;font-weight:600">Backup text</label>' +
      '<textarea id="backup-text" spellcheck="false" placeholder="Paste a backup here, or press Copy backup to fill it"></textarea>' +
      '</div></details>' +

      '</form></div>' + footer();
  }

  /* Shared pieces for lens modules (e.g. rel.js registers window.MN_LENS_VIEWS.relationships). */
  window.MN = { header: header, footer: footer, esc: esc, toast: function (m) { toast(m); }, lenses: LENS,
    profile: function () { return profile; }, options: OPT, opinion: opinion };

  /* ---------- render + routing ---------- */
  var app = document.getElementById('app');
  var sky = '<div class="sky" aria-hidden="true"><span class="a"></span><span class="b"></span><span class="c"></span><span class="d"></span></div>';

  /* Course files load only when someone opens that lens, so the home page stays light. */
  var LAZY = { relationships: { css: 'rel.css', js: ['rel-data.js', 'rel.js'] }, water: { css: 'water.css', js: ['water.js'] }, food: { css: 'food.css', js: ['food.js'] }, toxins: { css: 'tox.css', js: ['tox.js'] }, air: { css: 'air.css', js: ['air.js'] }, cleaning: { css: 'clean.css', js: ['clean.js'] }, 'emergency-prep': { css: 'em.css', js: ['em.js'] }, governance: { css: 'gov.css', js: ['gov.js'] } };
  var lazyState = {};
  function needsLazy(r) {
    var lid = r.indexOf('lens-') === 0 ? r.slice(5).split(/[\/?]/)[0] : '';
    var m = LAZY[lid];
    if (!m || lazyState[lid] === 'done' || lazyState[lid] === 'failed') return false;
    if (lazyState[lid] !== 'loading') {
      lazyState[lid] = 'loading';
      var files = m.js.slice();
      var next = function () {
        if (!files.length) { lazyState[lid] = 'done'; route(); return; }
        var sc = document.createElement('script'); sc.src = files.shift();
        sc.onload = next;
        sc.onerror = function () { lazyState[lid] = 'failed'; route(); };
        document.body.appendChild(sc);
      };
      var link = document.createElement('link'); link.rel = 'stylesheet'; link.href = m.css;
      link.onload = next; link.onerror = next;
      document.head.appendChild(link);
    }
    return true;
  }

  var menuPicked = false;
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.nav-menu a')) menuPicked = true; }, true);

  function route() {
    var r = (location.hash || '').replace(/^#/, '');
    if (needsLazy(r)) return;
    var html, title = 'Kinship';
    var sec = '';
    if (r === 'profile' || r.indexOf('profile/') === 0) { html = viewProfile(); title = 'Profile · Kinship'; sec = 's-' + r.slice(8); }
    else if (r === 'about') { html = viewAbout(); title = 'About · Kinship'; }
    else if (r === 'plans' || r.indexOf('plans/') === 0) { html = viewPlans(); title = 'Plans · Kinship'; sec = 'plan-' + r.slice(6); }
    else if (r === 'favorites') { html = viewFavorites(); title = 'Favorites · Kinship'; }
    else if (r.indexOf('lens-') === 0 && LENS[r.slice(5).split(/[\/?]/)[0]]) {
      var lid = r.slice(5).split(/[\/?]/)[0], l = LENS[lid], custom = (window.MN_LENS_VIEWS || {})[lid];
      if (custom) { var v = custom(r.slice(5 + lid.length).replace(/^\//, ''), l); html = v.html; title = v.title; }
      else { html = viewLens(l); title = l.name + ' · Kinship'; }
    }
    else html = viewHome();
    app.innerHTML = sky + '<div class="wrap">' + html + '</div>';
    if (menuPicked) {
      menuPicked = false;
      app.querySelectorAll('.navdrop').forEach(function (dd) {
        dd.classList.add('is-closed'); dd.addEventListener('mouseleave', function () { dd.classList.remove('is-closed'); }, { once: true });
      });
    }
    document.title = title;
    window.scrollTo(0, 0);
    if (r) { var h = app.querySelector('h1'); if (h) h.focus({ preventScroll: true }); }
    var target = sec && document.getElementById(sec);
    if (target) target.scrollIntoView({ block: 'start' });
  }
  window.addEventListener('hashchange', route);

  /* Keep the tier dots in step with the sideways scroll (scroll doesn't bubble, so listen in capture). */
  var dotFrame = 0;
  app.addEventListener('scroll', function (e) {
    var g = e.target;
    if (!g.classList || !g.classList.contains('grid') || !g.closest('.tier')) return;
    cancelAnimationFrame(dotFrame);
    dotFrame = requestAnimationFrame(function () {
      var first = g.firstElementChild, dots = g.parentNode.querySelectorAll('.tier-dots i');
      if (!first || !dots.length) return;
      var step = first.getBoundingClientRect().width + (parseFloat(getComputedStyle(g).columnGap) || 0);
      var atEnd = g.scrollLeft + g.clientWidth >= g.scrollWidth - 2;
      var idx = atEnd ? dots.length - 1 : Math.round(g.scrollLeft / step);
      dots.forEach(function (d, i) { d.classList.toggle('on', i === idx); });
    });
  }, true);

  var toastEl = document.createElement('div');
  toastEl.className = 'toast'; toastEl.hidden = true; toastEl.setAttribute('role', 'status');
  document.body.appendChild(toastEl);
  var toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.hidden = true; }, 1800);
  }

  function refreshSteps() {
    var nav = app.querySelector('.steps');
    if (nav) nav.outerHTML = stepsNav();
  }

  app.addEventListener('input', function (e) {
    var f = e.target.getAttribute && e.target.getAttribute('data-field');
    if (!f) return;
    profile[f] = e.target.value;
    refreshSteps();
    saveSoon();
  });
  app.addEventListener('change', function (e) {
    var f = e.target.getAttribute && e.target.getAttribute('data-field');
    if (!f || e.target.tagName !== 'SELECT') return;
    profile[f] = e.target.value; refreshSteps(); save();
  });
  app.addEventListener('submit', function (e) { e.preventDefault(); });

  app.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;

    var fav = b.getAttribute('data-fav');
    if (fav) {
      var on = toggleFav(fav);
      b.setAttribute('aria-pressed', String(on));
      toast(on ? 'Added to Favorites' : 'Removed from Favorites');
      return;
    }

    var srcId = b.getAttribute('data-src');
    if (srcId) {
      var lvl = b.getAttribute('data-lvl');
      if (profile.sources[srcId] === lvl) delete profile.sources[srcId];
      else {
        profile.sources[srcId] = lvl;
        if (srcId === 'notap') delete profile.sources.tap;
        if (srcId === 'tap') delete profile.sources.notap;
      }
      app.querySelectorAll('[data-src]').forEach(function (x) { x.setAttribute('aria-pressed', String(profile.sources[x.getAttribute('data-src')] === x.getAttribute('data-lvl'))); });
      refreshSteps(); save();
      return;
    }

    var pick = b.getAttribute('data-pick');
    if (pick) {
      var val = b.getAttribute('data-val');
      var list = profile[pick];
      var NONE = { filters: 'None yet', near: 'None of these' }[pick];
      if (NONE && list.indexOf(val) === -1) {
        /* 'None yet' and owning a filter (or 'None of these' and a neighbor) can't both be true. */
        var clear = val === NONE ? list.slice() : list.filter(function (x) { return x === NONE; });
        clear.forEach(function (x) {
          list.splice(list.indexOf(x), 1);
          app.querySelectorAll('[data-pick="' + pick + '"]').forEach(function (ob) { if (ob.getAttribute('data-val') === x) ob.setAttribute('aria-pressed', 'false'); });
        });
      }
      var i = list.indexOf(val);
      if (i !== -1) list.splice(i, 1);
      else {
        if (pick === 'priorities' && list.length >= MAX_PRIORITIES) { toast('Pick up to three. Unselect one first.'); return; }
        list.push(val);
      }
      b.setAttribute('aria-pressed', String(i === -1));
      if (pick === 'priorities') { var c = document.getElementById('pri-count'); if (c) c.textContent = '(' + list.length + ' of ' + MAX_PRIORITIES + ')'; }
      refreshSteps(); save();
      return;
    }

    var jump = b.getAttribute('data-jump');
    if (jump) {
      var sec = document.getElementById('s-' + jump);
      if (sec) { sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); var first = sec.querySelector('input,select,button'); if (first) first.focus({ preventScroll: true }); }
      return;
    }

    var action = b.getAttribute('data-action');
    var box = document.getElementById('confirm-clear');
    var ta = document.getElementById('backup-text');
    if (action === 'ask-clear' && box) { box.hidden = false; }
    else if (action === 'keep' && box) { box.hidden = true; }
    else if (action === 'clear') { profile = blank(); save(true); toast('Profile cleared'); route(); }
    else if (action === 'copy' && ta) {
      ta.value = JSON.stringify({ app: 'meeting-needs', v: 1, profile: profile });
      var done = function () { toast('Backup copied'); };
      var fallback = function () { ta.focus(); ta.select(); toast('Backup is selected. Copy it with your keyboard.'); };
      try { navigator.clipboard.writeText(ta.value).then(done, fallback); } catch (err) { fallback(); }
    }
    else if (action === 'restore' && ta) {
      try {
        var data = JSON.parse(ta.value);
        var p = data && data.profile ? data.profile : data;
        if (!p || typeof p !== 'object') throw new Error('empty');
        profile = normalize(p); save(true); route(); toast('Profile restored');
      } catch (err) {
        toast('That text isn’t a Kinship backup. Copy it again and paste the whole thing.');
      }
    }
  });

  route();
})();
