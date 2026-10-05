/* Meeting Needs: home, lens pages and profile. Plain JS, no build step.
   Routes (hash): '' home · 'plans' · 'favorites' · 'profile' · 'lens-<id>'.
   The profile is saved only in this browser (localStorage). */
(function () {
  'use strict';

  var TIERS = window.MN_TIERS || [];
  var LENS = {};
  TIERS.forEach(function (t) { t.lenses.forEach(function (l) { l.tier = t; LENS[l.id] = l; }); });
  var COUNT = Object.keys(LENS).length;

  var STATUS = { ready: 'Ready', building: 'In progress', next: 'Next', later: 'Later' };
  var STATUS_NOTE = {
    ready: '',
    building: 'This lens is being written now.',
    next: 'This lens comes after the Roots lenses.',
    later: 'This lens is planned for the Craft tier.'
  };

  var KEY = 'meeting-needs.profile.v1';
  var OPT = {
    home: ['Renting an apartment', 'Renting a house', 'Own a house', 'Shared or co-op housing', 'Other'],
    water: ['City tap', 'Private well', 'Rain catchment', 'Not sure'],
    space: ['Windowsill', 'Balcony', 'Shared yard', 'Private yard', 'Community plot', 'None yet'],
    consider: ['Asthma', 'Allergies', 'Pregnancy', 'Babies or toddlers', 'Chronic illness', 'Limited mobility'],
    hours: ['Under 1', '1 to 3', '3 to 6', 'More than 6'],
    budget: ['Free fixes only', 'Tight', 'Some room'],
    priorities: [
      { id: 'water', label: 'Not sure my water is safe', lens: 'water' },
      { id: 'pans', label: 'Nonstick pans and plastic', lens: 'toxins' },
      { id: 'stains', label: 'Clothes ruined by stains', lens: 'cleaning' },
      { id: 'grow', label: 'Want to grow food', lens: 'gardening' },
      { id: 'damp', label: 'Stuffy, damp rooms', lens: 'airflow' },
      { id: 'tension', label: 'Tension at home', lens: 'relationships' },
      { id: 'products', label: 'Too many products under the sink', lens: 'household-chemistry' },
      { id: 'broken', label: 'Things break and get tossed', lens: 'repair' }
    ]
  };
  var CONSIDER_LENS = {
    'Asthma': ['airflow', 'toxins'], 'Allergies': ['airflow', 'cleaning'], 'Pregnancy': ['toxins', 'water'],
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
    return { address: '', zone: '', home: '', water: '', space: [], adults: '', kids: '', pets: '', consider: [], hours: '', budget: '', priorities: [] };
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
      else if (obj[k] != null) p[k] = String(obj[k]);
    });
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
    return !p.home && !p.zone && !p.water && !p.address && !p.adults && !p.kids && !p.pets && !p.hours && !p.budget &&
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
  var LEAF = '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 25V13"/><path d="M14 15c0-5 3.5-8.5 9-8.5 0 5.5-3.5 9-9 8.5z"/><path d="M14 18c0-4-2.8-6.8-7.5-6.8 0 4.4 2.8 7.2 7.5 6.8z"/><path d="M8 25h12"/></svg>';

  function header(active) {
    function link(href, label, key) {
      return '<a href="' + href + '"' + (active === key ? ' aria-current="page"' : '') + '>' + label + '</a>';
    }
    return '<header class="top glass">' +
      '<a class="brand" href="#">' + LEAF + '<b>Meeting Needs</b></a>' +
      '<nav class="nav" aria-label="Main">' +
      link('#', 'All education', 'home') +
      link('#plans', 'Plans', 'plans') +
      link('#favorites', 'Favorites', 'favorites') +
      link('#profile', 'Profile', 'profile') +
      '</nav></header>';
  }
  function footer() {
    return '<footer class="foot"><span>Meeting Needs · free and open source</span><span class="eyebrow">Grow · Fix · Share</span></footer>';
  }

  function setupCard() {
    if (isEmpty(profile)) {
      return '<aside class="setup" aria-label="Personalize">' +
        '<div class="setup-head"><span class="eyebrow">Your profile</span></div>' +
        '<h3>Personalize</h3>' +
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
      '<div class="setup-head"><span class="eyebrow">Your profile</span><a class="btn personal sm" href="#profile">Edit</a></div>' +
      '<h3>' + esc(headline) + '</h3>' +
      (chips.length ? '<div class="chips">' + chips.map(function (c) { return '<span class="chip">' + esc(c) + '</span>'; }).join('') + '</div>' : '') +
      sugHtml + '</aside>';
  }

  function lensCard(l) {
    var solid = l.tier.num <= 2;
    var cls = 'lens is-' + l.status + (solid ? ' is-solid' : '');
    var top = (solid ? '<span class="dot" aria-hidden="true"></span>' : '') +
      (STATUS[l.status] ? '<span class="badge ' + l.status + '">' + STATUS[l.status] + '</span>' : '');
    return '<a class="' + cls + '" href="#lens-' + l.id + '" style="--lc:' + l.color + '">' +
      (top ? '<div class="lens-top">' + top + '</div>' : '') +
      '<h3>' + esc(l.name) + '</h3>' +
      '<p>' + esc(l.blurb) + '</p>' +
      '<div class="topics">' + l.topics.map(esc).join(' · ') + '</div>' +
      '</a>';
  }

  function viewHome() {
    var tiers = TIERS.map(function (t) {
      return '<section class="tier glass" data-tier="' + t.num + '" aria-labelledby="tier-' + t.id + '">' +
        '<div class="tier-head"><div class="tier-title">' +
        '<span class="eyebrow">Tier ' + t.num + '</span>' +
        '<h2 id="tier-' + t.id + '">' + esc(t.name) + '</h2>' +
        '<p>' + esc(t.blurb) + '</p></div>' +
        (t.status ? '<span class="tier-status">' + esc(t.status) + '</span>' : '') + '</div>' +
        '<div class="grid">' + t.lenses.map(lensCard).join('') + (t.num === 1 ? setupCard() : '') + '</div>' +
        '</section>';
    }).join('');
    return header('home') +
      '<section class="hero">' +
      '<div class="hero-copy">' +
      '<span class="eyebrow">Free &amp; open source · ' + COUNT + ' lenses</span>' +
      '<h1 tabindex="-1">Unplug from profit extraction loops.</h1>' +
      '<p>Learn what we all need to live. Fix problems systemically.</p>' +
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
      '<div><a class="back" href="#">← All education</a></div>' +
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
      '<article class="plan glass"><span class="eyebrow">Your starting plan</span><h2>Where to begin</h2>' + start + '</article>' +
      '<a class="plan glass" href="#lens-gardening" style="--lc:#3E7B3A"><div class="lens-top"><span class="eyebrow">Garden plan</span><span class="badge building">In progress</span></div>' +
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

  function stepDone(step) {
    var p = profile;
    if (step === 'place') return !!(p.home || p.zone || p.water || p.space.length);
    if (step === 'household') return !!(p.adults || p.kids || p.pets || p.consider.length);
    if (step === 'resources') return !!(p.hours || p.budget);
    if (step === 'priorities') return p.priorities.length > 0;
    return false;
  }
  function stepsNav() {
    var steps = [['place', 'Place'], ['household', 'Household'], ['resources', 'Time & money'], ['priorities', 'Priorities']];
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
      '<div class="row">' + selectField('home', 'Home', OPT.home, p.home) + selectField('water', 'Water source', OPT.water, p.water) + '</div>' +
      pickField('space', 'Growing space', OPT.space, '(pick any)') +
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
      '<p class="hint">Your profile lives only in this browser. Copy the backup text and paste it into Meeting Needs on another device or browser to restore it.</p>' +
      '<div class="group" style="display:flex;flex-wrap:wrap;gap:10px"><button type="button" class="btn ghost" data-action="copy">Copy backup</button>' +
      '<button type="button" class="btn ghost" data-action="restore">Restore from pasted text</button></div>' +
      '<label class="label" for="backup-text" style="font-size:14px;font-weight:600">Backup text</label>' +
      '<textarea id="backup-text" spellcheck="false" placeholder="Paste a backup here, or press Copy backup to fill it"></textarea>' +
      '</div></details>' +

      '</form></div>' + footer();
  }

  /* ---------- render + routing ---------- */
  var app = document.getElementById('app');
  var sky = '<div class="sky" aria-hidden="true"><span class="a"></span><span class="b"></span><span class="c"></span><span class="d"></span></div>';

  function route() {
    var r = (location.hash || '').replace(/^#/, '');
    var html, title = 'Meeting Needs';
    if (r === 'profile') { html = viewProfile(); title = 'Profile · Meeting Needs'; }
    else if (r === 'plans') { html = viewPlans(); title = 'Plans · Meeting Needs'; }
    else if (r === 'favorites') { html = viewFavorites(); title = 'Favorites · Meeting Needs'; }
    else if (r.indexOf('lens-') === 0 && LENS[r.slice(5)]) { var l = LENS[r.slice(5)]; html = viewLens(l); title = l.name + ' · Meeting Needs'; }
    else html = viewHome();
    app.innerHTML = sky + '<div class="wrap">' + html + '</div>';
    document.title = title;
    window.scrollTo(0, 0);
    if (r) { var h = app.querySelector('h1'); if (h) h.focus({ preventScroll: true }); }
  }
  window.addEventListener('hashchange', route);

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

    var pick = b.getAttribute('data-pick');
    if (pick) {
      var val = b.getAttribute('data-val');
      var list = profile[pick];
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
        toast('That text isn’t a Meeting Needs backup. Copy it again and paste the whole thing.');
      }
    }
  });

  route();
})();
