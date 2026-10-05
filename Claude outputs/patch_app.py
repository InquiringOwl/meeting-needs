import sys
p = sys.argv[1] + '/app.js'
s = open(p).read()

def rep(a, b, cnt=1):
    global s
    assert s.count(a) == cnt, (s.count(a), a[:90])
    s = s.replace(a, b)

# --- options
rep("""    home: ['Apartment or room', 'House', 'Land or farm', 'Vehicle or boat', 'Shelter or no fixed place', 'Other'],""",
"""    home: ['Apartment or room', 'House', 'Vehicle or boat', 'Shelter or no fixed place', 'Other'],""")
rep("""    water: ['City tap', 'Private well', 'Spring', 'Rain catchment', 'Hauled or delivered', 'Public refill points', 'Not sure'],
""", """    /* Water: where it comes from now, and how much each source carries you. 'notap' is a plain fact, not a crisis flag. */
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
""")
rep("""    space: ['Windowsill', 'Balcony', 'Shared yard', 'Private yard', 'Community plot', 'None yet'],""",
"""    space: ['Windowsill', 'Balcony', 'Shared yard', 'Private yard', 'Community plot', 'Acreage or farmland', 'None yet'],""")

# --- blank / normalize
rep("""    return { address: '', zone: '', home: '', stay: '', shape: '', water: '', rain: '', space: [], adults: '', kids: '', pets: '', consider: [], hours: '', budget: '', priorities: [] };""",
"""    return { address: '', zone: '', home: '', stay: '', shape: '', space: [], sources: {}, filters: [], pipes: '', rain: '', adults: '', kids: '', pets: '', consider: [], hours: '', budget: '', priorities: [] };""")
rep("""      if (Array.isArray(p[k])) p[k] = Array.isArray(obj[k]) ? obj[k].map(String) : [];
      else if (obj[k] != null) p[k] = String(obj[k]);""",
"""      if (Array.isArray(p[k])) p[k] = Array.isArray(obj[k]) ? obj[k].map(String) : [];
      else if (k === 'sources') {
        var src = obj.sources && typeof obj.sources === 'object' ? obj.sources : {};
        OPT.sources.forEach(function (o) { if (src[o.id]) p.sources[o.id] = String(src[o.id]); });
      }
      else if (obj[k] != null) p[k] = String(obj[k]);""")
rep("""    if (OLD_HOME[p.home]) p.home = OLD_HOME[p.home];""",
"""    if (OLD_HOME[p.home]) p.home = OLD_HOME[p.home];
    /* 'Land or farm' was a kind of place; land is now outdoor space, so the house and the land are separate answers. */
    if (p.home === 'Land or farm') { p.home = 'House'; if (p.space.indexOf('Acreage or farmland') === -1) p.space.push('Acreage or farmland'); }
    /* The old single 'water' answer becomes a main source. */
    var OLD_WATER = { 'City tap': 'tap', 'Private well': 'well', 'Spring': 'spring', 'Rain catchment': 'rain', 'Hauled or delivered': 'bottled', 'Public refill points': 'refill' };
    if (obj.water && OLD_WATER[obj.water] && !Object.keys(p.sources).length) p.sources[OLD_WATER[obj.water]] = 'Main source';""")
rep("""    return !p.home && !p.stay && !p.shape && !p.rain && !p.zone && !p.water && !p.address &&""",
"""    return !p.home && !p.stay && !p.shape && !p.rain && !p.pipes && !Object.keys(p.sources).length && !p.filters.length && !p.zone && !p.address &&""")

# --- logo
rep("""  var HEART = '<svg class="heart" width="22" height="26" viewBox="0 0 24 24" preserveAspectRatio="none" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2.1 0 3.6 1.1 5.4 3.1 1.8-2 3.3-3.1 5.4-3.1 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21z"/></svg>';""",
"""  /* Logo: a cut-paper chain of hearts, folded at the joins. Love as a practice, made by hand and linked. */
  var LOGO = (function () {
    var H = 'M12 21.2C7.4 18 3.3 14.6 2.4 10.9 1.6 7.5 3.8 4.6 6.9 4.6c2.1 0 3.6 1.2 5.1 3.1 1.5-1.9 3-3.1 5.1-3.1 3.1 0 5.3 2.9 4.5 6.3C20.7 14.6 16.6 18 12 21.2z';
    var hearts = ['rotate(-5 12 13)', 'translate(17 0.6)', 'translate(34 0) rotate(5 12 13)'].map(function (t) { return '<path d="' + H + '" transform="' + t + '"/>'; }).join('');
    return '<svg class="logo" width="54" height="22" viewBox="0 0 60 24" aria-hidden="true"><g transform="translate(0 -1.4)">' +
      '<g fill="#C2477F" stroke="#C2477F" stroke-width="3.2" stroke-linejoin="round">' + hearts + '</g>' +
      '<g fill="#FCEFF4" stroke="none">' + hearts + '</g>' +
      '<g fill="none" stroke="#C2477F" stroke-width="1" stroke-dasharray="1.4 1.6" stroke-linecap="round" opacity=".7"><path d="M20.6 7.6v6.2"/><path d="M37.6 7.8v6.2"/></g>' +
      '</g></svg>';
  })();""")
rep("""      '<a class="brand" href="#">' + HEART + '<b>Kinship</b></a>' +""", """      '<a class="brand" href="#">' + LOGO + '<b>Kinship</b></a>' +""")

# --- plans dropdown (same header on every page)
rep("""      link('#plans', 'Plans', 'plans') +""", """      plansMenu(active === 'plans') +""")
rep("""  function footer() {""", """  /* Plans dropdown: the same on every page. */
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
  function footer() {""")

# --- lens cards: ready lenses link even in a locked tier
rep("""    var solid = l.tier.num === 1;""", """    var solid = l.tier.num === 1 || l.status === 'ready';
    var linked = !l.tier.locked || l.status === 'ready';""")
rep("""    var tag = l.tier.locked ? 'div' : 'a';
    if (l.tier.locked) cls += ' is-static';
    return '<' + tag + ' class="' + cls + '"' + (l.tier.locked ? '' : ' href="#lens-' + l.id + '"') + ' style="--lc:' + l.color + '">' +""",
"""    var tag = linked ? 'a' : 'div';
    if (!linked) cls += ' is-static';
    return '<' + tag + ' class="' + cls + '"' + (linked ? ' href="#lens-' + l.id + '"' : '') + ' style="--lc:' + l.color + '">' +""")

# --- plans view
i = s.index("  function viewPlans() {"); j = s.index("  function viewFavorites() {")
s = s[:i] + """  function viewPlans() {
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

""" + s[j:]

# --- profile: steps + water fieldset
rep("""    if (step === 'place') return !!(p.home || p.stay || p.shape || p.rain || p.zone || p.water || p.space.length);""",
"""    if (step === 'place') return !!(p.home || p.stay || p.shape || p.zone || p.address || p.space.length);
    if (step === 'water') return !!(Object.keys(p.sources).length || p.filters.length || p.pipes || p.rain);""")
rep("""    var steps = [['place', 'Place'], ['household', 'Household'],""", """    var steps = [['place', 'Place'], ['water', 'Water'], ['household', 'Household'],""")
rep("""      '<div class="row">' + selectField('shape', 'How much can you change the place?', OPT.shape, p.shape) + selectField('water', 'Water source', OPT.water, p.water) + '</div>' +
      '<div class="row">' + selectField('rain', 'How often does rain or snow fall?', OPT.rain, p.rain) + '</div>' +
      '<p class="hint">How long you’ll stay and how much you can change (a friend who owns the place counts) decide what’s worth building: a pitcher filter or a cistern. Water, Food and Gardening use these.</p>' +
      pickField('space', 'Growing space', OPT.space, '(pick any)') +
      '</fieldset>' +
""", """      '<div class="row">' + selectField('shape', 'How much can you change the place?', OPT.shape, p.shape) + '</div>' +
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
""")
rep("""  function stepDone(step) {""", """  function srcRow(o) {
    var cur = profile.sources[o.id] || '';
    var btns = o.single ? [['Yes', 'That’s me']] : OPT.levels.map(function (l) { return [l, l]; });
    return '<div class="src"><span class="src-name">' + esc(o.label) + (o.hint ? '<small>' + esc(o.hint) + '</small>' : '') + '</span>' +
      '<span class="seg">' + btns.map(function (b) {
        return '<button type="button" data-src="' + o.id + '" data-lvl="' + esc(b[0]) + '" aria-pressed="' + (cur === b[0]) + '">' + esc(b[1]) + '</button>';
      }).join('') + '</span></div>';
  }
  function stepDone(step) {""")

# --- MN export + lazy course files
rep("""  window.MN = { header: header, footer: footer, esc: esc, toast: function (m) { toast(m); }, lenses: LENS };""",
"""  window.MN = { header: header, footer: footer, esc: esc, toast: function (m) { toast(m); }, lenses: LENS,
    profile: function () { return profile; }, options: OPT };""")
rep("""  var LAZY = { relationships: { css: 'rel.css', js: ['rel-data.js', 'rel.js'] } };""",
"""  var LAZY = { relationships: { css: 'rel.css', js: ['rel-data.js', 'rel.js'] }, water: { css: 'water.css', js: ['water.js'] } };""")

# --- routes: #profile/water and #plans/<id> scroll to their section
rep("""    if (r === 'profile') { html = viewProfile(); title = 'Profile · Kinship'; }""",
"""    var sec = '';
    if (r === 'profile' || r.indexOf('profile/') === 0) { html = viewProfile(); title = 'Profile · Kinship'; sec = 's-' + r.slice(8); }""")
rep("""    else if (r === 'plans') { html = viewPlans(); title = 'Plans · Kinship'; }""",
"""    else if (r === 'plans' || r.indexOf('plans/') === 0) { html = viewPlans(); title = 'Plans · Kinship'; sec = 'plan-' + r.slice(6); }""")
rep("""      var dd = app.querySelector('.navdrop');
      if (dd) { dd.classList.add('is-closed'); dd.addEventListener('mouseleave', function () { dd.classList.remove('is-closed'); }, { once: true }); }""",
"""      app.querySelectorAll('.navdrop').forEach(function (dd) {
        dd.classList.add('is-closed'); dd.addEventListener('mouseleave', function () { dd.classList.remove('is-closed'); }, { once: true });
      });""")
rep("""    if (r) { var h = app.querySelector('h1'); if (h) h.focus({ preventScroll: true }); }""",
"""    if (r) { var h = app.querySelector('h1'); if (h) h.focus({ preventScroll: true }); }
    var target = sec && document.getElementById(sec);
    if (target) target.scrollIntoView({ block: 'start' });""")

# --- clicks: water sources, and 'None yet' filters exclusive
rep("""    var pick = b.getAttribute('data-pick');
    if (pick) {
      var val = b.getAttribute('data-val');
      var list = profile[pick];""", """    var srcId = b.getAttribute('data-src');
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
      if (pick === 'filters' && list.indexOf(val) === -1) {
        /* 'None yet' and owning a filter can't both be true. */
        var clear = val === 'None yet' ? list.slice() : list.filter(function (x) { return x === 'None yet'; });
        clear.forEach(function (x) {
          list.splice(list.indexOf(x), 1);
          app.querySelectorAll('[data-pick="filters"]').forEach(function (ob) { if (ob.getAttribute('data-val') === x) ob.setAttribute('aria-pressed', 'false'); });
        });
      }""")

open(p, 'w').write(s)
print('patched')
