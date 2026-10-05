/* Relationships lens: overview, one page per unit (sub-units are sections), and the tools
   (feelings wheel, needs, accusation translator, need-or-strategy, Identify a need, Communicate).
   Routes: #lens-relationships · #lens-relationships/<unit>[/<sub>]   (unit: feel | need | request | dialogue)
   The sidebar is the skill tree, drawn vertically. Registers window.MN_LENS_VIEWS.relationships;
   app.js supplies header/footer/esc/toast via window.MN. */
(function () {
  'use strict';
  var D = window.MN_REL;
  var BASE = '#lens-relationships';
  var KEY = 'meeting-needs.rel.v3';
  var ALIAS = { 'feel/narrow': 'need/identify', 'request/observe': 'request/sharing', 'request/kindness': 'request/anticipating', 'dialogue/listening': 'dialogue/ask', 'dialogue/generous': 'dialogue/ask', 'dialogue/gratitude': 'dialogue/narrowing', finder: 'need/identify', identify: 'need/identify', dialogue: 'dialogue/communicate', conflict: 'dialogue/communicate', communicate: 'dialogue/communicate' };

  var UNIT = {}, FAMILY_OF = {}, FAUX = {}, SOURCE = {};
  D.UNITS.forEach(function (u) { UNIT[u.id] = u; });
  ['unmet', 'met'].forEach(function (m) {
    D.WHEEL[m].families.forEach(function (f) { f.mode = m; f.words.forEach(function (w) { FAMILY_OF[w] = f; }); });
  });
  D.FAUX.forEach(function (x) { FAUX[x.word] = x; });
  D.SOURCES.forEach(function (s) { SOURCE[s.id] = s; });

  var FEEL_PICK = ['tired', 'discouraged', 'frustrated', 'sad', 'lonely', 'anxious', 'overwhelmed', 'tense', 'hurt', 'resentful'];
  var NEED_PICK = ['support', 'rest', 'connection', 'order', 'ease', 'respect', 'fairness', 'mutuality', 'to be heard', 'safety', 'choice', 'autonomy', 'space', 'appreciation', 'play'];
  var THANKS_PICK = ['relieved', 'grateful', 'hopeful', 'calm', 'touched', 'warm'];

  /* ---------- state ---------- */
  var prog = (function () { try { var r = JSON.parse(localStorage.getItem(KEY) || '{}'); return r && typeof r === 'object' ? r : {}; } catch (e) { return {}; } })();
  if (!prog.learned || typeof prog.learned !== 'object') prog.learned = {};
  function saveProgress() { try { localStorage.setItem(KEY, JSON.stringify(prog)); } catch (e) { /* storage blocked */ } }

  var S = {
    wheel: { solo: { mode: 'unmet', fam: null, word: null, rot: 0 }, finder: { mode: 'unmet', fam: null, word: null, rot: 0 } },
    needs: [], sort: {}, faux: 'abandoned',
    finder: blankFinder(),
    cf: cloneConflict()
  };
  function blankFinder() { return { fam: null, faux: null, feelings: [], source: null, needs: [], showAll: false }; }
  function cloneConflict() {
    var c = D.CONFLICT;
    return { a: JSON.parse(JSON.stringify(c.a)), b: JSON.parse(JSON.stringify(c.b)), both: c.both.slice(), pick: 0, add: '', thanks: c.thanks.slice() };
  }

  /* ---------- helpers ---------- */
  function mn() { return window.MN; }
  function esc(s) { return mn().esc(s); }
  function md(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>'); }
  function list(arr) { if (!arr.length) return ''; if (arr.length === 1) return arr[0]; return arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1]; }
  function uniq(arr) { var s = {}; return arr.filter(function (x) { if (s[x]) return false; s[x] = 1; return true; }); }
  function toggle(arr, v) { var i = arr.indexOf(v); if (i === -1) arr.push(v); else arr.splice(i, 1); }
  function attrs(o) { var s = ''; Object.keys(o || {}).forEach(function (k) { s += ' ' + k + '="' + esc(o[k]) + '"'; }); return s; }
  function chip(action, value, label, on, cls, extra) {
    return '<button type="button" class="rel-chip' + (on ? ' on' : '') + (cls ? ' ' + cls : '') + '" data-rel="' + action + '" data-v="' + esc(value) + '"' + attrs(extra) + ' aria-pressed="' + !!on + '">' + esc(label) + '</button>';
  }
  function href(u, sub) { return BASE + '/' + u + (sub ? '/' + sub : ''); }
  function learned(id) { return !!prog.learned[id]; }

  /* ---------- sidebar: the skill tree, vertical ---------- */
  function sidebar(cur) {
    var wide = window.matchMedia && window.matchMedia('(min-width: 900px)').matches;
    var units = D.UNITS.map(function (u) {
      var on = cur === u.id;
      return '<li class="rel-vt-unit k-' + u.id + (on ? ' cur' : '') + (learned(u.id) ? ' done' : '') + '">' +
        '<a class="rel-vt-head" href="' + href(u.id) + '"' + (on ? ' aria-current="page"' : '') + '>' +
        '<span class="rel-vt-dot" aria-hidden="true">' + (learned(u.id) ? '✓' : u.num) + '</span>' +
        '<span><b>' + esc(u.word) + '</b><small>' + esc(u.sub) + '</small></span></a>' +
        '<ol class="rel-vt-subs">' + u.subs.map(function (s) {
          return '<li><a href="' + href(u.id, s.id) + '" data-spy="' + u.id + '-' + s.id + '"' + (s.isTool ? ' class="tool"' : '') + '>' + esc(s.title) + (s.isTool ? ' <span class="rel-tooltag">tool</span>' : '') + '</a></li>';
        }).join('') + '</ol></li>';
    }).join('');
    return '<nav class="rel-nav" aria-label="Emotions &amp; love course">' +
      '<details class="rel-nav-wrap"' + (wide ? ' open' : '') + '><summary class="rel-nav-head"><span class="eyebrow">Course map</span><b>Emotions &amp; love</b></summary>' +
      '<a class="rel-nav-over" href="' + BASE + '"' + (!cur ? ' aria-current="page"' : '') + '>Overview</a>' +
      '<ol class="rel-vt">' + units + '</ol>' +
      '<div class="rel-vt-apps' + (cur === 'special' ? ' cur' : '') + '"><a class="eyebrow" href="' + BASE + '/special">Then, special situations</a><p>' + D.APPS.map(function (a) { return '<a href="' + spHref(a.id) + '">' + esc(a.name) + '</a>'; }).join(' · ') + '</p><span class="rel-later">In progress</span></div>' +
      '</details></nav>';
  }
  function layout(cur, main) {
    return mn().header('home') + '<div class="rel-layout">' + sidebar(cur) + '<main class="rel-main">' +
      '<div class="rel-topbar"><button type="button" class="rel-back" data-rel="back">← Back</button></div>' + main + '</main></div>' + mn().footer();
  }

  /* ---------- overview: plant roots up ----------
     Top to bottom: plant roots (inner life: units 1–2 and the inner tool) → the horizon → the visible plant
     (people and the physical world: units 3–4 and Communicate) → special situations. */
  function viewOverview() {
    function card(u) {
      return '<div class="rel-tu k-' + u.id + (learned(u.id) ? ' done' : '') + '">' +
        '<span class="rel-tu-n" aria-hidden="true">' + (learned(u.id) ? '✓' : u.num) + '</span><div>' +
        '<a class="rel-tu-head" href="' + href(u.id) + '"><b>' + esc(u.word) + '</b><small>' + esc(u.sub) + '</small></a>' +
        '<ol>' + u.subs.filter(function (s) { return !s.isTool; }).map(function (s) { return '<li><a href="' + href(u.id, s.id) + '">' + esc(s.title) + '</a></li>'; }).join('') + '</ol></div></div>';
    }
    function tool(u, sub, eyebrow, name, text) {
      return '<a class="rel-tt k-' + u + '" href="' + href(u, sub) + '"><span class="eyebrow">' + eyebrow + '</span><b>' + name + '</b><span>' + text + '</span><i>Open →</i></a>';
    }
    var apps = D.APPS.map(function (a) {
      return '<li class="is-open"><a href="' + spHref(a.id) + '"><b>' + esc(a.name) + '</b><span>' + esc(a.short) + '</span><small>In progress · open →</small></a></li>';
    }).join('');
    return {
      title: 'Emotions & love · Kinship',
      html: layout(null,
        '<section class="rel-hero"><span class="eyebrow">Tier 1 · Signals · Course</span><h1 tabindex="-1">Emotions &amp; love</h1>' +
        '<p class="lede">Every conflict is two people trying to meet their universal needs through ineffective strategies. Start with the plant roots, what’s alive inside you, then grow up through the horizon to the people, animals and world around you.</p></section>' +
        '<section class="rel-tree" aria-label="Course map: plant roots, horizon and visible plant">' +
          '<div class="rel-side ground"><p class="rel-zone"><b>Plant roots · underground</b><span>Inner life: nobody else has to see it.</span></p>' +
            card(UNIT.feel) + card(UNIT.need) +
            tool('need', 'identify', 'Inner tool', 'Identify a need', 'From a big feeling to the word that fits and the need underneath.') + '</div>' +
          '<div class="rel-horizon"><p><b>The horizon</b><span>↑ Inside: Feelings and needs · ↓ Outside: People and the physical world</span></p></div>' +
          '<div class="rel-side above">' + card(UNIT.request) + card(UNIT.dialogue) +
            tool('dialogue', 'communicate', 'Between people', 'Communicate', 'Hear each other’s needs and find a strategy that meets you both.') +
            '<p class="rel-zone"><b>Visible plant · above ground</b><span>Where your needs meet people, animals and the physical world.</span></p></div>' +
        '</section>' +
        '<section class="rel-apps" aria-labelledby="rel-apps-h"><div class="rel-apps-head"><span class="rel-tu-n">5</span><div><h2 id="rel-apps-h"><a href="' + BASE + '/special">Special situations</a></h2><p>The same plant roots and visible plant, applied to the particular people and places in your life.</p></div></div>' +
        '<ul>' + apps + '</ul></section>' +
        '<aside class="rel-funfact"><span class="eyebrow">Nonviolence theory origins</span><p>The idea that feelings point to universal needs, and that conflicts live between strategies, grows out of Marshall B. Rosenberg’s Nonviolent Communication. The feelings and needs words here are adapted from the Center for Nonviolent Communication’s inventories (<a href="https://www.cnvc.org" target="_blank" rel="noopener">cnvc.org</a>). Thank you!</p></aside>')
    };
  }

  /* ---------- unit page: every sub-unit on one page ---------- */
  function viewUnit(u, subId) {
    var i = D.UNITS.indexOf(u), prev = D.UNITS[i - 1], next = D.UNITS[i + 1];
    var secs = u.subs.map(function (s, j) {
      var h = '<section class="rel-sec' + (s.isTool ? ' is-tool' : '') + '" id="sec-' + u.id + '-' + s.id + '" data-sec="' + u.id + '-' + s.id + '">' +
        '<div class="rel-sec-head"><span class="rel-sec-n">' + u.num + '.' + (j + 1) + '</span><div><h2>' + esc(s.title) + (s.isTool ? ' <span class="rel-tooltag">tool</span>' : '') + '</h2><p>' + esc(s.short) + '</p></div></div>' +
        '<ul class="rel-keys">' + s.key.map(function (k) { return '<li>' + md(k) + '</li>'; }).join('') + '</ul>';
      if (s.ex) h += '<div class="rel-ex">' + s.ex.map(function (e) { return '<div><p class="rel-say">' + md(e[0]) + '</p><p>' + md(e[1]) + '</p></div>'; }).join('') + '</div>';
      if (s.tool) h += '<div class="rel-tool" data-tool="' + s.tool + '">' + TOOLS[s.tool]() + '</div>';
      if (s.remember) h += '<p class="rel-remember"><span class="eyebrow">Remember</span>' + md(s.remember) + '</p>';
      return h + '</section>';
    }).join('');
    var html = '<article class="rel-unitpage k-' + u.id + '">' +
      '<header class="rel-unit-hero"><span class="eyebrow">Unit ' + u.num + ' of 4</span><h1 tabindex="-1">' + esc(u.word) + '</h1><p class="rel-unit-sub">' + esc(u.sub) + '</p><p class="lede">' + esc(u.intro) + '</p>' +
      '<ol class="rel-jumps">' + u.subs.map(function (s, j) { return '<li><a href="' + href(u.id, s.id) + '"><span>' + u.num + '.' + (j + 1) + '</span>' + esc(s.title) + '</a></li>'; }).join('') + '</ol></header>' +
      secs +
      '<div class="rel-done"><button type="button" class="btn' + (learned(u.id) ? ' ghost' : '') + '" data-rel="learn" data-v="' + u.id + '">' + (learned(u.id) ? '✓ Unit learned' : 'Mark this unit as learned') + '</button></div>' +
      '</article>' +
      '<nav class="rel-pager" aria-label="Units">' +
      (prev ? '<a class="rel-pg prev k-' + prev.id + '" href="' + href(prev.id) + '"><small>← Previous</small><b>' + prev.num + ' · ' + esc(prev.word) + '</b></a>' : '<a class="rel-pg prev" href="' + BASE + '"><small>← Back to</small><b>Overview</b></a>') +
      (next ? '<a class="rel-pg next k-' + next.id + '" href="' + href(next.id) + '"><small>Next →</small><b>' + next.num + ' · ' + esc(next.word) + '</b></a>' : '<a class="rel-pg next" href="' + BASE + '/special"><small>Next →</small><b>Special situations</b></a>') +
      '</nav>';
    if (subId) setTimeout(function () { var el = document.getElementById('sec-' + u.id + '-' + subId); if (el) el.scrollIntoView({ block: 'start' }); }, 0);
    setTimeout(spy, 0);
    return { title: u.word + ' · Emotions & love · Kinship', html: layout(u.id, html) };
  }

  /* ---------- special situations: one page, one accordion each (Animals first) ----------
     Routes: #lens-relationships/special[/<id>]. The older preview routes (#…/animals, /neighbors, /power, /coops, /pets, /wild)
     open the same page with that accordion open. Each o = { id, letter, name, sub, lede, intro?, secs: [[title, short, keys, extra]], after?, note, related? } */
  function spHref(id) { return BASE + '/special/' + id; }
  function tryIt(t) { return '<p class="rel-remember"><span class="eyebrow">Try it</span>' + md(t) + '</p>'; }
  function src(t) { return '<p class="rel-q"><small>' + t + '</small></p>'; }
  function animalsAfter() {
    var items = [
      ['Food', 'every recipe in the course comes from plants: the cheapest, longest-keeping and most shareable way to meet the need for food.', '#lens-food', 'Food'],
      ['Food', 'what each companion species eats in nature, kibble and raw food told plainly, and complete plant-based food as one option.', '#lens-food/companions', 'Food → Companions'],
      ['Water', 'where California’s farm water goes, including the feed grown for farmed animals.', '#lens-water/sources/take', 'Water → Sources'],
      ['Toxins', 'wool, leather, down and silk kept in use secondhand, instead of new.', '#lens-toxins/exposures/healthy', 'Toxins → What healthy looks like'],
      ['Toxins', 'poison-free ways to share a home with ants, mice and other wild neighbors.', '#lens-toxins/pesticides/yard', 'Toxins → Yard, home and companions']
    ];
    return '<section class="rel-sec" id="sec-animals-3"><div class="rel-sec-head"><span class="rel-sec-n">A.3</span><div><h2>Across Kinship</h2><p>Where peace with animals shows up in the other lenses.</p></div></div>' +
      '<ul class="rel-keys">' + items.map(function (x) { return '<li><strong>' + x[0] + ':</strong> ' + esc(x[1]) + ' <a href="' + x[2] + '">' + esc(x[3]) + '</a></li>'; }).join('') + '</ul></section>' +
      (mn().opinion ? mn().opinion('<p>Modern commodification of animal bodies as products is something I never trust enough to recommend, especially new.</p>') : '');
  }
  function specials() {
    return {
      animals: {
      id: 'animals', letter: 'A', name: 'Animals', sub: 'Someone, not something',
      lede: 'Animals share our homes, our neighborhoods, our water and our food systems. They have feelings and needs, and they tell us about them with their bodies. The same four steps (notice, feel, find the need, ask) work here, starting with how we talk about them.',
      secs: [
        ['Someone, not something', 'Respect starts in language.', [
          '**Pronouns:** use **they/them** for an animal when you don’t know their sex, and **he** or **she** when you do, the same way you would for a person. “It” turns someone into something.',
          '**Who, not that:** “the cat who lives next door”, “the cow who…”.',
          '**Call animals by who they are:** a cow, a pig, a chicken, a fish. Words like “beef”, “pork”, “poultry” and “seafood” are names for what animals become after they die. Language that hides the animal makes the harm easier to look past.',
          '**Farmed animals,** not “livestock” or “stock”, which count living beings as inventory.'
        ]],
        ['Cows, in their own right', 'More than the water their lives use.', [
          'The Water course counts how much water goes into one cow raised for meat (about 99% of it grows their feed). That matters, and it isn’t the main reason a cow matters. She matters because she’s someone.',
          '**Cows have friends.** Studies find cows are calmer and less stressed when they’re with a preferred companion.',
          '**Mothers and calves bond.** In dairy farming, calves are usually separated from their mothers within hours to a day of birth so the milk can be sold.',
          '**Cows feel and learn.** Young cows have shown excitement when they solve a problem themselves. Cows can live 15–20 years; those raised for meat in US feedlots are usually killed at about 18–22 months.',
          'Scientists agree that mammals and birds have the brain systems for conscious experience, and evidence for fish keeps growing. Pigs, chickens and fish feel fear and pain too.'
        ], '<p class="rel-q">Water lens: <a href="#lens-water/sources/take">how much water goes into animal foods</a></p>' +
          src('Sources: McLennan, <i>Social bonds in dairy cattle</i> (University of Northampton, 2013); Hagen &amp; Broom, “Emotional reactions to learning in cattle,” <i>Applied Animal Behaviour Science</i> (2004); <i>Cambridge Declaration on Consciousness</i> (2012); <i>New York Declaration on Animal Consciousness</i> (2024).')]
      ],
      intro: '<p class="rel-sp-lead">When Kinship says meeting everyone’s needs, everyone includes animals. They’re sentient, they feel, and they share the same universal needs we do: food, water, safety, rest, play, company and choice. So every strategy gets the same question: does it meet the animals’ needs too?</p>',
      after: animalsAfter(),
      note: 'Family animals and Wild animals each have their own section. The full Animals unit (farmed animals and sanctuaries) is in progress.',
      related: ['#lens-water/sources/take', 'Water: farm water']
    },
      family: {
        id: 'family', letter: 'F', name: 'Family animals', sub: 'Companions who share our homes, routines and moods',
        lede: 'Cats, dogs, rabbits, birds and the rest of a household’s animals are family. They share our rooms and routines, they pick up on our moods, and they have emotional lives of their own. The same four steps work with them: notice their signals, wonder what they’re feeling, find the need, and change what you offer.',
        secs: [
          ['Reading their signals', 'Behavior is communication.', [
            'Ears, tail, posture, appetite, hiding, pacing and play are all signals. “Bad dog” becomes “what is he needing?”',
            'Shared needs: food, water, safety, rest, play, company and choice. Each species has its own strategies: cats need high places and hunting games, dogs need to sniff, rabbits need another rabbit.',
            '**Choice and consent:** let animals approach you, and notice when they move away. A “no” from an animal counts too.'
          ]],
          ['Their emotional needs', 'Safety, play, company and a say.', [
            '**Predictability:** regular meals, walks and quiet times help animals feel safe. Moves, new people and loud days ask a lot of them.',
            '**Play** is a need, not a luxury: chasing a toy meets a cat’s need to hunt, sniffing a new street meets a dog’s need to explore.',
            '**Company of their own kind:** rabbits, guinea pigs, rats and many birds are lonely alone. Many cats like company on their own terms.',
            '**Places to retreat:** a box, a high shelf, a crate left open, a room where nobody follows.',
            'Hiding, over-grooming, not eating, or peeing outside the litter box are often stress or pain. A vet first, then a look at what changed at home.'
          ]],
          ['Feelings across species', 'They read us, and we can read them.', [
            'Dogs match human faces with voices by emotion, and cats recognize their own people’s voices. Stress and calm in a home reach the animals in it.',
            'Being with a companion animal can be a real comfort, and they’re not a tool for it: their needs count on the hard days too.',
            '**Grief is real.** Losing an animal family member is a loss like any other. Children need room to grieve them too, with honest, simple words.',
            'People facing eviction or homelessness often keep their animals close at great cost. Pet-friendly shelters and pet food banks keep families together, animals included.'
          ], src('Sources: Albuquerque et al., “Dogs recognize dog and human emotions,” <i>Biology Letters</i> (2016); Saito &amp; Shinozuka, “Vocal recognition of owners by domestic cats,” <i>Animal Cognition</i> (2013).') +
            '<p class="rel-q">Food lens: <a href="#lens-food/companions">what each animal eats</a> · <a href="#lens-food/gentle/animals">tender times</a> · Toxins: <a href="#lens-toxins/exposures/companions">what their bodies can’t process</a></p>' +
            tryIt('Watch one animal at home for five minutes. What need is each thing they do trying to meet?')]
        ],
        note: 'The full Family animals unit (species by species, introductions, and end-of-life care) is in progress.',
        related: [spHref('animals'), 'Animals']
      },
      wild: {
        id: 'wild', letter: 'W', name: 'Wild animals', sub: 'Neighbors who live by their own rules',
        lede: 'Crows, raccoons, coyotes, bees, mice and the birds on the wire live alongside us without being ours. Kinship with wild animals mostly means giving them room, closing the accidental offers our homes make, and leaving the land a little more livable for them.',
        secs: [
          ['Wild neighbors', '“Pests” are neighbors with needs.', [
            'Mice, ants, raccoons and pigeons come because a home is meeting their needs: food, water, warmth, shelter. Change what the home offers and they move on.',
            'Seal food, fix drips and close gaps: when a home stops offering food, water and shelter, its visitors move on.',
            'Poisons travel: rat poison kills owls, hawks, foxes and cats who eat a poisoned animal. California has restricted the strongest rodenticides since 2021 for this reason.'
          ], src('Source: California AB 1788 (2020), restrictions on second-generation anticoagulant rodenticides.')],
          ['Watching, not handling', 'Room is the kindest gift.', [
            'Wild animals do best when they stay wary of people. Feeding raccoons, ducks or coyotes draws them close to roads, dogs and conflict.',
            'Bird feeders and baths are lovely when they’re cleaned often; dirty ones spread disease between birds.',
            '**A baby bird on the ground** is often a fledgling learning to fly, with parents nearby. Watch from a distance before stepping in.',
            '**Hurt or orphaned?** Call a licensed wildlife rehabilitator (California Department of Fish and Wildlife keeps a list) rather than caring for the animal at home.',
            'Cats kept indoors or in a catio stay safer, and so do birds: free-roaming cats kill an estimated 1.3–4 billion birds a year in the US.'
          ], src('Sources: Loss, Will &amp; Marra, <i>Nature Communications</i> (2013); California Department of Fish and Wildlife, wildlife rehabilitation facilities.')],
          ['Sharing the land', 'Leave room in the places we shape.', [
            'Native plants, a wild corner, a log left to rot and a shallow dish of water in a heat wave meet a lot of needs at once.',
            '**Nesting season** (roughly February to August in California): check trees and hedges before trimming. Active nests of most wild birds are protected by federal law.',
            'Dark nights help: shielded, warm-colored outdoor lights confuse fewer birds and insects.',
            'Slow down at dusk and dawn, when deer and many others cross roads.'
          ], tryIt('Next time you see a wild animal near home, ask: what is this place offering them?')]
        ],
        note: 'The full Wild animals unit (urban wildlife by species and coexisting on land) is in progress.',
        related: ['#lens-toxins/pesticides/yard', 'Toxins: yard, home and companions']
      },
      children: {
        id: 'children', letter: 'K', name: 'Children', sub: 'Togetherness instead of split labor, and families staying close',
        lede: 'Children share every universal need adults have, and one they show early and often: to contribute. This unit grows from the ideas the whole of Kinship sits on.',
        secs: [
          ['Togetherness, not split labor', 'Kids belong beside the adults.', [
            'We don’t picture one adult doing dishes while the children play somewhere else. Children belong right next to the adults: rinsing, carrying, sorting, sweeping and playing with the real tools that keep a house running.',
            'Work and play happen in the same place, at the same time. Keeping a home and a body alive isn’t a chore split off from life: it is life, and it can be the good part.',
            '**Children want to help.** Taking that away (“go play, I’ll do it”) teaches them their help isn’t wanted. Inviting them in, at whatever level they can manage, builds helpfulness that grows on its own.'
          ]],
          ['No pay, no score, no shame', 'People pitch in because they belong.', [
            'Nobody is paid, bribed, scored or shamed into helping. Kids pitch in because they’re part of the household and it feels good to contribute.',
            '**TEAM:** Togetherness, Encouragement, Autonomy, Minimal interference.',
            '**Requests, not demands,** with kids too: a “not now” is a real answer, and the search goes back to the needs on both sides.',
            '**Protective force isn’t punishment.** Grabbing a hand before the street keeps a child safe; making a child suffer to “learn a lesson” is something else.'
          ], src('Sources: Michaeleen Doucleff, <i>Hunt, Gather, Parent</i> (2021), including her TEAM summary; Barbara Rogoff’s research on children learning by observing and pitching in; Marshall B. Rosenberg, <i>Nonviolent Communication</i>.')],
          ['Families staying close', 'Closeness is a need, and poverty puts it at risk.', [
            '**Closeness is a need.** For babies and children, a steady bond with their own people is how their bodies learn safety. Long or sudden separations can be traumatic, and the stress can shape health for years.',
            '**Poverty often reads as “neglect” on paper.** In the US, neglect is the most common reason children are taken into foster care, and much of it traces to poverty: no stable housing, no childcare, not enough food. Poor families, and Black and Native families most of all, are separated more often.',
            '**Meeting the family’s needs keeps children home.** Studies find that cash support, housing help and childcare lower neglect reports and foster-care entries.',
            '**When a separation can’t be avoided:** kinship care (with grandparents, aunts, uncles or family friends) keeps a child with people they know. Frequent visits and calls, and keeping siblings together, soften the loss.',
            '**Inside systems:** asking for a family room in a shelter, staying beside a child in the hospital, and family-friendly visiting when a parent is incarcerated all keep families close. More than 5 million US children have had a parent in jail or prison.'
          ], src('Sources: Harvard Center on the Developing Child, toxic stress; American Academy of Pediatrics on family separation (2018); US HHS, AFCARS foster care reports; Chapin Hall, economic and concrete supports and child welfare; Annie E. Casey Foundation, <i>A Shared Sentence</i> (2016).') +
            '<p class="rel-q">Related: <a href="' + spHref('distress') + '">People in distress</a> · <a href="' + spHref('power') + '">Power &amp; peace</a> (abolition)</p>'],
          ['Kids across Kinship', 'Where children already show up.', [
            '**Food:** cooking together, with real tools and real jobs.',
            '**Water:** turning over creek stones to count the little creatures, a real field test.',
            '**Toxins:** small bodies take in more per pound, so dust, hands and bottles come first.'
          ], '<p class="rel-q"><a href="#lens-food/cook/together">Food: cooking together</a> · <a href="#lens-water/testing">Water: testing</a> · <a href="#lens-toxins/exposures/dose">Toxins: dose and timing</a></p>' +
            tryIt('Next chore, invite a child in at whatever level they can manage, and let them do it their way.')]
        ],
        note: 'The full Children unit (ages and stages, chores as play, conflict between siblings, keeping families together) is in progress.'
      },
      neighbors: {
      id: 'neighbors', letter: 'N', name: 'Neighbors', sub: 'The people, plants and animals you share a place with',
      lede: 'Neighbors are the ones we mostly don’t choose and can’t avoid sharing with: the same water main, the same air, the same street trees and raccoons. The same four steps (notice, feel, find the need, ask) work here, and sharing a place well is one of the oldest ways people have met their needs.',
      secs: [
        ['What you share', 'Some needs are met together or not at all.', [
        '**Water.** The same main, pipes and watershed. In some places neighbors literally share water rights: a well, a spring, a creek. What one home pours down a drain or onto a lawn reaches everyone downstream.',
        '**Air.** Wildfire smoke, a grill, a gas leaf blower or a busy road reach every window on the block at once. You experience air quality together.',
        '**Walls, sound, light and shade.** Footsteps, music, a porch light, a tall tree: each meets one household’s needs and touches another’s.',
        '**Urban wildlife.** Raccoons, crows, pigeons, coyotes and bees move between yards. What one home offers (scraps, water, shelter) changes the whole block.'
      ], '<p class="rel-q">Water lens: <a href="#lens-water/purify/everyday">sharing clean water with neighbors</a> · <a href="#lens-water/testing/kits">splitting a water test</a></p>'],
        ['Needs you have in common', 'Conflicts live between strategies, never between needs.', [
        'Every neighbor needs rest, safety, clean water and air, belonging, and choice in their own home.',
        'A leaf blower at 8am is one household’s strategy for order; the person next door needs rest. Both needs are real. The search is for a strategy that meets both: a later hour, a rake, a shared schedule.',
        'Start from what you noticed, not what it means: “I heard the blower at 8 this morning,” not “you’re inconsiderate.”'
      ]],
        ['Living harmoniously', 'Old ideas for sharing a place.', [
        '**Commons.** Shared things (a yard, a laundry room, a creek) stay healthy when the people using them make agreements together.',
        '**Agreements, not rules.** Decided together, revisited when they stop working.',
        '**Mutual aid.** Help flows both ways without a ledger: a lent ladder, a shared filter, a meal when someone’s sick.',
        '**Share what you learn.** A water test, an air-quality alert, where the raccoons are getting in. Information is the easiest thing to share.',
        '**Start small.** A wave, a name, a tool lent. Trust builds the way soil does.'
      ], '<p class="rel-remember"><span class="eyebrow">Try it</span>Ask one neighbor: “Do you know if your water’s safe to drink?” Offer to split a test.</p>']
      ],
      note: 'The full Neighbors unit (housemates, buildings, blocks, land and wildlife) is in progress.',
      related: ['#lens-water', 'Water']
    },
      distress: {
        id: 'distress', letter: 'D', name: 'People in distress', sub: 'Meeting someone unhoused or struggling: respect, capacity, boundaries, who can help',
        lede: 'Sometimes a need shows up right in front of us: someone asking for change outside the store, sleeping in a doorway, living in a car down the street, crying on the bus. It’s delicate, and often we can’t meet the whole need, which can feel unbearable. The same four steps help: notice, feel, find the needs (theirs and ours), and choose what we can actually give.',
        secs: [
          ['Seeing someone', 'Acknowledgment is a gift almost anyone can give.', [
            'Looking away, speeding up, pretending not to hear: feigning total disconnect usually feels stranger, on both sides, than a nod, eye contact and “Hi.”',
            'In one study, people felt more connected after a stranger passed with eye contact than after a stranger looked through them “as though air”.',
            '**You don’t owe anyone a smile, money or time.** Basic respect (seeing the person, a kind “not today”, “sorry, I don’t have anything”) is the standard most of us would want for ourselves, and offering it keeps that standard alive in a shared place.',
            'Speak to the person, not about them. Use their name if they offer it. Ask before giving: “Would you like some water?”'
          ], src('Source: Wesselmann, Cardoso, Slater &amp; Williams, “To be looked at as though air: civil attention matters,” <i>Psychological Science</i> (2012).')],
          ['Guilt and capacity', 'Guilt is a signal, not an order.', [
            'Guilt, discomfort or helplessness in these moments often point to needs of your own: **contribution, care, integrity, a fair world.** There’s no need to push them down, and no need to obey them either.',
            'A lot of people are running on empty: stretched money, time, health or grief. **When you’re suffering too, you can’t give generously from nothing**, and that’s capacity, not coldness.',
            '**Anything is better than nothing.** A nod, a bottle of water, a snack, directions to a free meal: small gifts meet real needs, and none of them has to solve everything.',
            'Self-empathy first: “I’m tired and scared about my own rent, and I care about him.” Both are true at once.'
          ]],
          ['Gifts and boundaries', 'Giving in a way that works for you too.', [
            'Help that could last (a ride, a phone, a place to park, regular meals) can bring a scared “now I’m on the hook” feeling. That fear points to needs for choice and sustainability, and boundaries meet them.',
            '**A boundary is about your own actions,** said plainly up front: “I can bring water on Tuesdays. I can’t give rides.” “I can buy you lunch today; I can’t give cash.”',
            'Decide ahead what you can give, so the moment asks less of you: a few care bags in the car (water, socks, snacks, wipes), or a monthly amount for a mutual-aid fund.',
            '**Help in a concentrated place** if one-on-one feels like too much: soup kitchens, community fridges, shower and laundry days, outreach walks. Groups share the load and come with structure.',
            'Trust your body. Distress isn’t danger, and you can still leave any moment that doesn’t feel safe.'
          ]],
          ['Who can meet these needs', 'Learn the local web of help.', [
            '**211** (call or text) knows local shelters, meals, showers, safe parking and benefits.',
            '**988** (call or text) is the crisis line for anyone in emotional distress, including calling on someone else’s behalf. Many California counties also run mobile crisis teams, which don’t send police to a mental-health crisis. For a medical emergency, 911.',
            'Living in a vehicle is how many people keep a roof as rents outpace wages, and it brings its own needs: a safe place to park overnight (many California cities run **safe parking** programs), water, bathrooms, laundry and showers.',
            '**Showers are a real need.** Gym memberships, beaches, truck stops and mobile shower buses (like LavaMaex, started in San Francisco in 2014) are how many people stay clean, and every added shower meets more needs.',
            'Harm-reduction groups, street medicine teams and outreach workers meet people where they are. Asking them what’s most needed (often socks, water, tents, transit passes) beats guessing.'
          ], '<p class="rel-q">Related: <a href="#lens-food/gather/free">Food: free food, and food without a kitchen</a> · <a href="' + spHref('neighbors') + '">Neighbors</a></p>'],
          ['Advocacy', 'The least powerful are the most governed.', [
            'People with the least power are the most shaped by the rules: where it’s legal to sleep, park, sit or wash. Since **City of Grants Pass v. Johnson** (US Supreme Court, 2024), cities can fine or jail people for sleeping outside even when there’s no shelter bed.',
            'Being unhoused is life-threatening: heat, cold, illness and violence all hit harder without walls, and people without homes die much younger on average.',
            'California has more unhoused people than any other state, and most are unsheltered. A 2023 UCSF statewide study found most became homeless in the county they still live in, after losing housing they could no longer afford.',
            '**Housing First** (a home with no preconditions, then support) keeps most people housed in study after study.',
            'Show up where decisions are made: city council meetings, public comment, budget hearings. Bring the needs, not only the complaints: showers, bathrooms, parking, water, homes.'
          ], src('Sources: <i>City of Grants Pass v. Johnson</i> (US Supreme Court, 2024); HUD, <i>Annual Homeless Assessment Report to Congress</i>; UCSF Benioff Homelessness and Housing Initiative, <i>California Statewide Study of People Experiencing Homelessness</i> (2023).') +
            '<p class="rel-q">Next: <a href="' + spHref('power') + '">Power &amp; peace</a> · <a href="' + spHref('coops') + '">Cooperatives</a> (housing co-ops and land trusts) · <a href="#lens-governance">Governance</a></p>' +
            tryIt('Look up what your city offers for showers and safe parking. Who runs it, and what do they need?')]
        ],
        after: (mn().opinion ? mn().opinion('<p>Renting has stopped meeting the need for shelter for a lot of people, so rather than wait on it I’d meet needs where people actually live now, in cars and vans, with more showers, parking and water, the way good neighbors would.</p><p class="opinion-src">In the UCSF study, the median household income in the six months before losing housing was $960 a month (CASPEH, 2023).</p>') : ''),
        note: 'The full People in distress unit (scripts for hard moments, care bags, and local programs by county) is in progress.',
        related: [spHref('neighbors'), 'Neighbors']
      },
      coops: {
      id: 'coops', letter: 'C', name: 'Cooperatives', sub: 'Workplaces and homes owned and run together',
      lede: 'Most workplaces and most housing are set up so that someone outside the work, or outside the home, owns it and collects the profit. Cooperatives flip that: the people doing the work, or living in the homes, own them together and decide together. It’s one of the oldest ways to share power, and it’s growing.',
      secs: [
        ['Why ownership matters', 'Who owns it decides who it serves.', [
          '**Extracting profit:** in a typical company, value made by workers flows up and out to owners and shareholders. In typical renting, rent flows to a landlord whether or not the home is cared for.',
          '**In a co-op, the people who use it own it.** Members still earn wages or pay housing costs; what’s left over goes back to members or the community instead of outside owners.',
          '**One member, one vote,** not one share, one vote. A dishwasher’s voice counts the same as a founder’s.',
          'The seven cooperative principles: open membership, democratic member control, members share the money, independence, education for members, co-ops helping co-ops, and care for the wider community.'
        ], src('Source: International Cooperative Alliance, <i>Statement on the Cooperative Identity</i> (1995), ica.coop.')],
        ['Worker cooperatives', 'A workplace without a boss above it.', [
          'Workers own the business together, elect or are the board, and decide on pay, hours and direction. Many keep pay ratios small between the highest and lowest paid.',
          'Close to home: the **Arizmendi** bakeries in the Bay Area are worker-owned. **Cooperative Home Care Associates** in the Bronx (since 1985) is one of the largest worker co-ops in the US. **Mondragon** in the Basque Country employs tens of thousands of worker-owners.',
          '**Conversions:** when owners retire, a business can be sold to the people who already run it, keeping jobs local.',
          'California has a **Worker Cooperative Act** (2015) that makes this legal structure easier to set up.'
        ], src('Sources: US Federation of Worker Cooperatives (usworker.coop); Democracy at Work Institute; California AB 816 (2015).')],
        ['Living together: housing and land', 'Homes that can’t be flipped for profit.', [
          '**Housing cooperative:** residents own the building together through a co-op. Each household holds a share and the right to live in their home, and members decide on rules, repairs and costs.',
          '**Limited-equity co-op:** the share price is capped, so the home stays affordable for the next household instead of rising with the market.',
          '**Community land trust (CLT):** a nonprofit holds the land forever, for the community. Households own or rent the home on top under a long lease, and agree to a fair resale price. The first one in the US, New Communities in Georgia (1969), was started by Black farmers in the civil rights movement.',
          '**Cohousing:** private homes clustered around a shared common house, kitchen and garden, with decisions made together. It began in Denmark.',
          '**Student and group houses:** the Berkeley Student Cooperative has housed students together since 1933. Many land co-ops and farm co-ops work the same way: people hold land together instead of one owner holding it over others.'
        ], src('Sources: National Association of Housing Cooperatives; Grounded Solutions Network (groundedsolutions.org) on CLTs; Cohousing Association of the US; Berkeley Student Cooperative.')],
        ['Starting small', 'Practice sharing before owning.', [
          'A buying club, a tool library, a shared garden or a babysitting swap: each is a tiny co-op with agreements and shared decisions.',
          'Tenants who talk to each other can start as a tenant association, and some buildings later buy together.',
          'Deciding together: **consensus** (everyone agrees), **consent** (no one has a strong objection, as in sociocracy), or **majority vote**. Each fits different groups and decisions.',
          'California help: the **Sustainable Economies Law Center** in Oakland offers free legal resources for co-ops and shared housing.'
        ], tryIt('Name one thing you already share with others: a laundry room, a car, a garden. What agreement would make it work better for everyone?')]
      ],
      note: 'The full Cooperatives unit (meetings, money, conversions, and how to start a housing co-op or CLT) is in progress.',
      related: [spHref('power'), 'Power & peace']
    },
      plants: {
        id: 'plants', letter: 'L', name: 'Plants', sub: 'A plant’s signals as needs',
        lede: 'A yellow leaf or a bare patch of soil is a message about a need: water, light, nutrients, shelter. The same four steps work with plants: notice, wonder what they’re feeling, find the need, and change what you offer.',
        secs: [], note: 'The full Plants unit is in progress, and continues in Gardening.', related: ['#lens-gardening', 'Gardening']
      },
      groups: {
        id: 'groups', letter: 'G', name: 'Gatherings & events', sub: 'Hosting, rounds and agreements, conflict in a circle',
        lede: 'Hosting a gathering, a meeting or an event: rounds where everyone speaks, agreements made together, and what to do when conflict shows up in a circle.',
        secs: [], note: 'The full Gatherings & events unit is in progress.'
      },
      projects: {
        id: 'projects', letter: 'J', name: 'Projects', sub: 'A shared goal, roles by willingness, check-ins',
        lede: 'Working toward a shared goal: roles chosen by willingness rather than assigned, regular check-ins, and needs named early, before they turn into resentment.',
        secs: [], note: 'The full Projects unit is in progress.'
      },
      power: {
      id: 'power', letter: 'P', name: 'Power & peace', sub: 'Nonviolence, abolition, and power shared instead of held over',
      lede: 'The same four steps that work between two people work in families, workplaces, towns and whole systems. Underneath every system of punishment is an idea about who is good, who is bad, and who deserves to suffer. Nonviolence asks a different question: what does everyone here need, and how do we meet it together?',
      secs: [
        ['Power over, power with', 'Two ways to get things done together.', [
          '**Power over:** one side decides for the other and backs it up with fear, punishment, shame or reward.',
          '**Power with:** decisions made together, where everyone’s needs count, including the people with the least say right now.',
          'Power over can get compliance fast. It costs trust, and people tend to comply only while someone is watching. Power with is slower to start and lasts longer.',
          '**Protective force isn’t punishment.** Grabbing a child before they run into the street protects a life. Making someone suffer so they “learn their lesson” is punitive. Nonviolence keeps the first and lets go of the second.'
        ], src('Sources: Mary Parker Follett, “power-over” and “power-with” (1920s); Marshall B. Rosenberg, <i>Nonviolent Communication</i>, on protective vs. punitive use of force.')],
        ['Beyond good and bad', 'Moral labels make harm feel fair.', [
          '“Good”, “bad”, “evil”, “criminal” and “deserves” are judgments, not observations. They tell us about the speaker’s values, not about the person.',
          'Once someone is sorted into “bad”, hurting them can start to feel like justice. Ranking people by worth is how a lot of violence gets permission.',
          '**Every action is an attempt to meet a need**, even a harmful one; often a tragic, costly attempt. Seeing the need isn’t excusing the harm. It’s where real repair starts.',
          '**Nobody deserves to suffer.** Instead of “what do they deserve?”, ask: what happened, who was hurt, what do they need, and what would make this less likely to happen again?'
        ], src('Sources: Marshall B. Rosenberg on moralistic judgments and “deserve” thinking; Walter Wink, <i>The Powers That Be</i> (1998), on the “domination system”.')],
        ['Abolition', 'Building a world where cages and punishment aren’t needed.', [
          '**Abolition** (of prisons and policing as we know them) asks: what would make them unnecessary? Most of the answers are needs: housing, health and mental-health care, income, education, belonging, safety.',
          'It’s as much about building as taking apart: community crisis teams, violence interrupters, restorative and transformative justice circles, mutual aid.',
          '**Accountability without punishment:** name the harm, hear the needs on every side, repair what can be repaired, and change the conditions that made the harm likely.',
          'The United States locks up more of its people than almost any other country. Abolitionists point out that this hasn’t made people feel safe, and that harm from punishment falls hardest on people who are already poor, disabled, Black, brown or Indigenous.'
        ], src('Sources: Angela Y. Davis, <i>Are Prisons Obsolete?</i> (2003); Mariame Kaba, <i>We Do This ’Til We Free Us</i> (2021); Ruth Wilson Gilmore, <i>Golden Gulag</i> (2007); World Prison Brief (prisonstudies.org) for incarceration rates.')],
        ['Power at home and all around', 'Hierarchies are everywhere, and each one can soften.', [
          'Adult over child, boss over worker, landlord over tenant, human over animal. Each is a place where power over can become power with.',
          '**At home:** ask instead of order, decide in a circle, turn rules into agreements and revisit them when they stop working.',
          '**At work and where you live:** owning and deciding together is an option. See Cooperatives.',
          '**With animals:** the same respect, all the way down. See Animals.'
        ], '<p class="rel-q">Next: <a href="' + spHref('coops') + '">Cooperatives</a> · <a href="' + spHref('animals') + '">Animals</a> · <a href="#lens-governance">Governance</a></p>' +
          tryIt('Catch one “should” or “deserves” in your own thinking today. Translate it: which need is underneath it?')]
      ],
      note: 'The full Power & peace unit (circles, agreements, restorative practice, and community safety) is in progress.',
      related: ['#lens-governance', 'Governance']
    }
    };
  }
  function spBlock(o, open) {
    var secs = (o.secs || []).map(function (x, j) {
      var n = j + 1;
      return '<section class="rel-sec" id="sec-' + o.id + '-' + n + '"><div class="rel-sec-head"><span class="rel-sec-n">' + o.letter + '.' + n + '</span><div><h2>' + esc(x[0]) + '</h2><p>' + esc(x[1]) + '</p></div></div>' +
        '<ul class="rel-keys">' + x[2].map(function (k) { return '<li>' + md(k) + '</li>'; }).join('') + '</ul>' + (x[3] || '') + '</section>';
    }).join('');
    return '<details class="rel-sp" id="sp-' + o.id + '"' + (open ? ' open' : '') + '><summary><span class="rel-sp-l" aria-hidden="true">' + o.letter + '</span>' +
      '<span class="rel-sp-t"><b>' + esc(o.name) + '</b><small>' + esc(o.sub) + '</small></span><span class="rel-later">In progress</span></summary>' +
      '<div class="rel-sp-in">' + (o.intro || '') + '<p class="lede">' + esc(o.lede) + '</p>' + secs + (o.after || '') +
      '<div class="note">' + esc(o.note) + (o.related ? ' Related: <a href="' + o.related[0] + '">' + esc(o.related[1]) + '</a>.' : '') + '</div></div></details>';
  }
  function viewSpecial(openId) {
    var S = specials(), first = D.APPS[0].id;
    if (!S[openId]) openId = '';
    var html = '<article class="rel-unitpage k-apps">' +
      '<header class="rel-unit-hero"><span class="eyebrow">Special situations · In progress</span><h1 tabindex="-1">Special situations</h1>' +
      '<p class="rel-unit-sub">The same roots and plant, applied to the particular people and beings in your life</p>' +
      '<p class="lede">Each of these is in progress. They all start from the same place: meeting everyone’s needs, and everyone means everyone, animals included. Animals are sentient, they feel, and they share the same universal needs. Open one to see where it’s headed.</p></header>' +
      '<div class="rel-sps">' + D.APPS.map(function (a) { return S[a.id] ? spBlock(S[a.id], openId ? a.id === openId : a.id === first) : ''; }).join('') + '</div>' +
      '</article>' +
      '<nav class="rel-pager" aria-label="Units"><a class="rel-pg prev" href="' + BASE + '"><small>← Back to</small><b>Overview</b></a><a class="rel-pg next" href="' + href('dialogue') + '"><small>Back to →</small><b>4 · Dialogue</b></a></nav>';
    if (openId) setTimeout(function () { var el = document.getElementById('sp-' + openId); if (el) el.scrollIntoView({ block: 'start' }); }, 0);
    var o = openId && S[openId];
    return { title: (o ? o.name + ' · ' : '') + 'Special situations · Emotions & love · Kinship', html: layout('special', html) };
  }

  /* Highlight the sub-unit you're reading in the sidebar. */
  var observer = null;
  function spy() {
    if (observer) observer.disconnect();
    if (!('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.getAttribute('data-sec');
        document.querySelectorAll('[data-spy]').forEach(function (a) { a.classList.toggle('reading', a.getAttribute('data-spy') === id); });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    document.querySelectorAll('[data-sec]').forEach(function (s) { observer.observe(s); });
  }

  /* ---------- tools ---------- */
  function arcPath(cx, cy, r0, r1, a0, a1) {
    function pt(r, a) { var t = (a - 90) * Math.PI / 180; return [cx + r * Math.cos(t), cy + r * Math.sin(t)]; }
    var p0 = pt(r1, a0), p1 = pt(r1, a1), p2 = pt(r0, a1), p3 = pt(r0, a0), big = a1 - a0 > 180 ? 1 : 0;
    function f(p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }
    return 'M' + f(p0) + ' A' + r1 + ' ' + r1 + ' 0 ' + big + ' 1 ' + f(p1) + ' L' + f(p2) + ' A' + r0 + ' ' + r0 + ' 0 ' + big + ' 0 ' + f(p3) + 'Z';
  }
  function radialText(cx, cy, r, a, text, cls) {
    var t = (a - 90) * Math.PI / 180, x = cx + r * Math.cos(t), y = cy + r * Math.sin(t), rot = a <= 180 ? a - 90 : a + 90;
    return '<text class="' + cls + '" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" transform="rotate(' + rot.toFixed(1) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')" text-anchor="middle" dominant-baseline="central">' + esc(text) + '</text>';
  }
  /* Feelings wheel: spin it (drag, arrows or tap a family) and the family at the pointer is the one in focus.
     Geometry is drawn at the current rotation, so labels always read upright; a spin animates the group,
     then the wheel is redrawn at its new rotation. */
  var CX = 250, CY = 250, R0 = 56, R1 = 142, R2 = 248;
  function famList(ctx) { return D.WHEEL[S.wheel[ctx].mode].families; }
  function famIndex(ctx, id) { var fs = famList(ctx); for (var i = 0; i < fs.length; i++) if (fs[i].id === id) return i; return -1; }
  function norm(a) { a = a % 360; return a < 0 ? a + 360 : a; }
  function wheelTool(ctx) {
    var ws = S.wheel[ctx], W = D.WHEEL[ws.mode], fams = W.families, step = 360 / fams.length, rot = ws.rot || 0;
    var picked = ctx === 'finder' ? S.finder.feelings : (ws.word ? [ws.word] : []);
    var svg = '';
    fams.forEach(function (f, i) {
      var a0 = i * step + rot, a1 = a0 + step, on = ws.fam === f.id;
      svg += '<g class="wf' + (on ? ' on' : '') + (ws.fam && !on ? ' dim' : '') + '" style="--h:' + f.hue + '">' +
        '<path class="seg fam" d="' + arcPath(CX, CY, R0, R1 - 2, a0 + 0.6, a1 - 0.6) + '" data-rel="wheel-fam" data-ctx="' + ctx + '" data-v="' + f.id + '"><title>' + esc(f.name) + '</title></path>' +
        radialText(CX, CY, (R0 + R1) / 2, norm((a0 + a1) / 2), f.name, 'fam-t' + (f.name.length > 9 ? ' sm' : ''));
      var w2 = step / f.words.length;
      f.words.forEach(function (w, j) {
        var b0 = a0 + j * w2, b1 = b0 + w2, sel = picked.indexOf(w) !== -1;
        svg += '<path class="seg word' + (sel ? ' sel' : '') + '" d="' + arcPath(CX, CY, R1, R2, b0 + 0.4, b1 - 0.4) + '" data-rel="wheel-word" data-ctx="' + ctx + '" data-v="' + esc(w) + '"><title>' + esc(w) + '</title></path>' +
          radialText(CX, CY, (R1 + R2) / 2 + 4, norm((b0 + b1) / 2), w, 'word-t' + (sel ? ' sel' : ''));
      });
      svg += '</g>';
    });
    var fam = ws.fam ? fams[famIndex(ctx, ws.fam)] : null;
    var hub = '<circle class="hub" cx="' + CX + '" cy="' + CY + '" r="' + (R0 - 4) + '"/>' +
      (fam ? '<text class="hub-t big" x="' + CX + '" y="' + (CY - 4) + '" text-anchor="middle">' + esc(fam.name) + '</text><text class="hub-t" x="' + CX + '" y="' + (CY + 14) + '" text-anchor="middle">spin or tap</text>'
        : '<text class="hub-t big" x="' + CX + '" y="' + (CY - 4) + '" text-anchor="middle">Spin me</text><text class="hub-t" x="' + CX + '" y="' + (CY + 14) + '" text-anchor="middle">or tap a feeling</text>');
    var detail;
    if (fam) {
      detail = '<p class="rel-wheel-fam" style="--h:' + fam.hue + '">' + esc(fam.name) + '</p><p class="rel-q">Which word fits best?' + (ctx === 'finder' ? ' Pick one or two.' : '') + '</p>' +
        '<div class="rel-chips lg">' + fam.words.map(function (w) { return chip('wheel-word', w, w, picked.indexOf(w) !== -1, '', { 'data-ctx': ctx }); }).join('') + '</div>';
      if (ctx === 'solo' && ws.word) {
        detail += '<div class="rel-out"><p><strong>I feel ' + esc(ws.word) + '.</strong> ' + (ws.mode === 'met' ? 'A need is being met. Often: ' : 'What might it be telling you? Often: ') +
          esc(list(fam.needs)) + '.</p><a href="' + href('need', 'identify') + '?w=' + encodeURIComponent(ws.word) + '">Follow it to the need →</a></div>';
      }
    } else detail = '<p class="rel-q">Drag the wheel round, use the arrows, or tap the family closest to how you feel. Then narrow to the word that fits.</p>';
    if (ctx === 'finder' && picked.length) {
      detail += '<div class="rel-picked"><span class="eyebrow">You feel</span><div class="rel-chips sm">' + picked.map(function (w) { return chip('wheel-word', w, w + ' ×', true, '', { 'data-ctx': ctx, 'aria-label': 'Remove ' + w }); }).join('') + '</div></div>';
    }
    return '<div class="rel-wheel' + (ctx === 'finder' ? ' big' : '') + '">' +
      '<div class="rel-wheel-body"><div class="rel-wheel-stage">' +
      '<svg class="rel-wheel-svg" data-ctx="' + ctx + '" viewBox="-12 -30 524 544" role="img" aria-label="Feelings wheel: ' + esc(W.label) + '">' +
      '<g class="rel-spin" data-ctx="' + ctx + '">' + svg + '</g>' + hub +
      '<path class="pointer" d="M236 -26 L264 -26 L250 -4 Z"/></svg>' +
      '<div class="rel-wheel-ctrl"><button type="button" class="rel-arrow" data-rel="wheel-step" data-ctx="' + ctx + '" data-v="-1" aria-label="Spin to the previous feeling">↺</button>' +
      '<div class="rel-chips sm" role="group" aria-label="Which wheel">' +
      chip('wheel-mode', 'unmet', 'Needs not met', ws.mode === 'unmet', '', { 'data-ctx': ctx }) +
      chip('wheel-mode', 'met', 'Needs met', ws.mode === 'met', '', { 'data-ctx': ctx }) + '</div>' +
      '<button type="button" class="rel-arrow" data-rel="wheel-step" data-ctx="' + ctx + '" data-v="1" aria-label="Spin to the next feeling">↻</button></div></div>' +
      '<div class="rel-wheel-side">' + detail + '</div></div></div>';
  }
  var reduced = function () { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; };
  var spinning = false;
  function spinTo(ctx, famId) {
    var ws = S.wheel[ctx], n = famList(ctx).length, step = 360 / n, i = famIndex(ctx, famId);
    if (i < 0) return;
    var target = -(i * step + step / 2), d = norm(target - (ws.rot || 0));
    if (d > 180) d -= 360;
    ws.fam = famId;
    if (ctx === 'finder') S.finder.fam = famId;
    var g = document.querySelector('.rel-spin[data-ctx="' + ctx + '"]');
    if (!g || reduced() || Math.abs(d) < 0.5) { ws.rot = (ws.rot || 0) + d; refreshKeep(); return; }
    spinning = true;
    g.style.transition = 'transform 0.6s cubic-bezier(.22,.8,.24,1)';
    g.style.transform = 'rotate(' + d + 'deg)';
    setTimeout(function () { ws.rot = (ws.rot || 0) + d; spinning = false; refreshKeep(); }, 620);
  }
  function needsTool() {
    return D.NEEDS.map(function (g) {
      return '<div class="rel-ngroup"><h4>' + esc(g.name) + ' <span class="hint">' + esc(g.blurb) + '</span></h4><div class="rel-chips sm">' +
        g.items.map(function (x) { return chip('need', x, x, S.needs.indexOf(x) !== -1); }).join('') + '</div></div>';
    }).join('') + (S.needs.length
      ? '<div class="rel-out"><p><strong>Alive in you right now:</strong> ' + esc(list(S.needs)) + '.</p><p class="hint">None of these name a person, place or time. Everyone you meet has the same list.</p></div>'
      : '<p class="rel-q">Tap any need that feels alive in you right now, met or not.</p>');
  }
  function sorterTool() {
    var right = 0, answered = 0;
    var rows = D.SORT.map(function (s, i) {
      var a = S.sort[i];
      if (a) { answered++; if (a === s.kind) right++; }
      return '<li class="rel-sort-row"><p class="rel-say">“' + esc(s.text.replace(/\.$/, '')) + '”</p><div class="rel-sort-btns">' +
        chip('sort', i + ':need', 'Need', a === 'need', a && s.kind === 'need' ? 'right' : '') +
        chip('sort', i + ':strategy', 'Strategy', a === 'strategy', a && s.kind === 'strategy' ? 'right' : '') + '</div>' +
        (a ? '<p class="rel-verdict"><strong>' + (s.kind === 'need' ? 'A need.' : 'A strategy.') + '</strong> ' + esc(s.why) + '</p>' : '') + '</li>';
    }).join('');
    return '<p class="rel-q">Need or strategy?</p><ol class="rel-sort">' + rows + '</ol>' +
      '<div class="rel-row"><span class="rel-prog">' + answered + ' of ' + D.SORT.length + ' sorted' + (answered ? ' · ' + right + ' matched' : '') + '</span>' +
      (answered ? '<button type="button" class="btn quiet sm" data-rel="sort-reset">Start over</button>' : '') + '</div>';
  }
  function translatorTool() {
    var x = FAUX[S.faux];
    return '<p class="rel-q">Pick a word you’ve said or thought.</p>' +
      '<div class="rel-chips sm">' + D.FAUX.map(function (f) { return chip('faux', f.word, f.word, f.word === S.faux); }).join('') + '</div>' +
      '<div class="rel-translate">' +
      '<div><span class="eyebrow">You might say</span><p class="rel-say">“I feel ' + esc(x.word) + '.”</p></div>' +
      '<div><span class="eyebrow">The story inside</span><p class="rel-say muted">“' + esc(x.hidden) + '”</p></div>' +
      '<div><span class="eyebrow">Feelings underneath</span><p>' + esc(list(x.feelings)) + '</p></div>' +
      '<div><span class="eyebrow">Needs underneath</span><p>' + esc(list(x.needs)) + '</p></div></div>' +
      '<div class="rel-out"><p><strong>Translated:</strong> “I feel ' + esc(list(x.feelings.slice(0, 2))) + ', because I need ' + esc(list(x.needs.slice(0, 2))) + '.”</p></div>';
  }

  /* Identify a need: spin to a feeling → where it's coming from → the need underneath */
  function fNeeds() {
    var f = S.finder, out = [];
    if (f.source && SOURCE[f.source]) out = out.concat(SOURCE[f.source].needs);
    if (f.faux) out = out.concat(FAUX[f.faux].needs);
    f.feelings.forEach(function (w) { var fam = FAMILY_OF[w]; if (fam) out = out.concat(fam.needs); });
    return uniq(out.concat(f.needs)).slice(0, 16);
  }
  function fStatement() {
    var f = S.finder;
    if (!f.needs.length) return '';
    var allMet = f.feelings.length && f.feelings.every(function (w) { return FAMILY_OF[w] && FAMILY_OF[w].mode === 'met'; });
    return 'I feel ' + (f.feelings.length ? list(f.feelings) : '…') + (allMet ? ', because these needs are being met: ' : ', because I need ') + list(f.needs) + '.';
  }
  function finderTool() {
    var f = S.finder;
    var h = '<div class="rel-step k-feel"><span class="rel-n">1</span><div><h3>Spin to the closest feeling</h3>' +
      '<div class="rel-tool inner" data-tool="wheel-finder">' + wheelTool('finder') + '</div>' +
      '<details class="rel-faux-alt"' + (f.faux ? ' open' : '') + '><summary>Or start from a word like abandoned, ignored or attacked</summary>' +
      '<div class="rel-chips sm">' + D.FAUX.map(function (x) { return chip('f-faux', x.word, x.word, f.faux === x.word); }).join('') + '</div>' +
      (f.faux ? '<p class="rel-note">“' + esc(f.faux) + '” has a story inside it: <em>' + esc(FAUX[f.faux].hidden) + '</em> Which feelings underneath are about you?</p>' +
        '<div class="rel-chips">' + FAUX[f.faux].feelings.map(function (w) { return chip('f-feel', w, w, f.feelings.indexOf(w) !== -1); }).join('') + '</div>' : '') +
      '</details></div></div>';
    if (f.feelings.length) {
      var src = f.source ? SOURCE[f.source] : null;
      h += '<div class="rel-step k-need"><span class="rel-n">2</span><div><h3>Where is it coming from?</h3>' +
        '<div class="rel-sources">' + D.SOURCES.map(function (s) {
          return '<button type="button" class="rel-source' + (f.source === s.id ? ' on' : '') + '" data-rel="f-source" data-v="' + s.id + '" aria-pressed="' + (f.source === s.id) + '"><b>' + esc(s.label) + '</b><small>' + esc(s.hint) + '</small></button>';
        }).join('') + '</div>' + (src && src.note ? '<p class="rel-note">' + esc(src.note) + '</p>' : '') + '</div></div>';
    }
    if (f.source) {
      h += '<div class="rel-step k-need"><span class="rel-n">3</span><div><h3>Which need is underneath?</h3>' +
        '<p class="rel-q">Read each slowly. Which one makes something in you say “yes, that”?</p>' +
        '<div class="rel-chips">' + fNeeds().map(function (x) { return chip('f-need', x, x, f.needs.indexOf(x) !== -1); }).join('') + '</div>' +
        '<button type="button" class="btn quiet sm" data-rel="f-all" aria-expanded="' + f.showAll + '">' + (f.showAll ? 'Hide the full list' : 'See every need') + '</button>' +
        (f.showAll ? '<div class="rel-allneeds">' + D.NEEDS.map(function (g) {
          return '<div class="rel-ngroup"><h4>' + esc(g.name) + '</h4><div class="rel-chips sm">' + g.items.map(function (x) { return chip('f-need', x, x, f.needs.indexOf(x) !== -1); }).join('') + '</div></div>';
        }).join('') + '</div>' : '') + '</div></div>';
    }
    var st = fStatement();
    if (st) {
      h += '<div class="rel-result"><span class="eyebrow">Your need, in words</span><p class="rel-statement">' + esc(st) + '</p>' +
        '<p class="rel-q">This need matters, and it makes sense that you feel this way. Take a breath with that before solving anything.</p>' +
        '<div class="rel-row"><button type="button" class="btn ghost sm" data-rel="f-copy">Copy</button>' +
        '<button type="button" class="btn sm" data-rel="f-communicate">Communicate it →</button></div></div>';
    }
    if (f.fam || f.feelings.length || f.faux) h += '<div class="rel-row end"><button type="button" class="btn quiet sm" data-rel="f-reset">Start again</button></div>';
    return h;
  }

  /* Communicate: two people, each with feeling, need, request */
  function cfSide(p) {
    var d = S.cf[p], a = p === 'a';
    return '<div class="rel-side ' + p + '">' +
      '<label class="rel-label" for="cf-' + p + '-name">Name</label><input id="cf-' + p + '-name" type="text" data-rel-input="cf-' + p + '-name" value="' + esc(d.name) + '" autocomplete="off">' +
      (a ? '<label class="rel-label" for="cf-a-obs">When I see…</label><input id="cf-a-obs" type="text" data-rel-input="cf-a-obs" value="' + esc(d.obs) + '" placeholder="what a camera would see" autocomplete="off">' : '') +
      '<span class="rel-label">Feels</span><div class="rel-chips xs">' + uniq(FEEL_PICK.concat(d.feelings)).map(function (w) { return chip('cf-feel', p + ':' + w, w, d.feelings.indexOf(w) !== -1); }).join('') + '</div>' +
      '<span class="rel-label">Needs</span><div class="rel-chips xs">' + uniq(NEED_PICK.concat(d.needs)).map(function (x) { return chip('cf-need', p + ':' + x, x, d.needs.indexOf(x) !== -1); }).join('') + '</div>' +
      (a ? '' : '<label class="rel-label" for="cf-b-ctx">In their words <span class="hint">(optional)</span></label><input id="cf-b-ctx" type="text" data-rel-input="cf-b-ctx" value="' + esc(d.context) + '" autocomplete="off">') +
      '<label class="rel-label" for="cf-' + p + '-req">Would you be willing to…</label><input id="cf-' + p + '-req" type="text" data-rel-input="cf-' + p + '-req" value="' + esc(d.request) + '" autocomplete="off">' +
      '</div>';
  }
  function q(s) { return esc((s || '…').replace(/[?.]$/, '')); }
  function cfScript() {
    var A = S.cf.a, B = S.cf.b, pick = S.cf.both[S.cf.pick] || '';
    var an = esc(A.name || 'Me'), bn = esc(B.name || 'Them');
    function line(k, who, text) { return '<li class="k-' + k + '"><b>' + who + '</b><p>' + text + '</p></li>'; }
    return line('request', an, '“When I see ' + q(A.obs) + ', I feel ' + esc(list(A.feelings) || '…') + ', because I need ' + esc(list(A.needs) || '…') + '. Would you be willing to ' + q(A.request) + '?”') +
      line('dialogue', bn, '“So you’re feeling ' + esc(list(A.feelings) || '…') + ', because you need ' + esc(list(A.needs) || '…') + '?”') +
      line('request', bn, '“Yes, and when I hear that, I feel ' + esc(list(B.feelings) || '…') + ', because I need ' + esc(list(B.needs) || '…') + (B.context ? ' (' + esc(B.context) + ')' : '') + '. Would you be willing to ' + q(B.request) + '?”') +
      line('dialogue', an, '“So you’re feeling ' + esc(list(B.feelings) || '…') + ', because you need ' + esc(list(B.needs) || '…') + '. That matters to me too.”') +
      (pick ? line('dialogue', an, '“Would you be willing to try this for a week: ' + esc(pick.replace(/\.$/, '').replace(/^./, function (c) { return c.toLowerCase(); })) + '?”') : '') +
      line('dialogue', bn, '“Thank you for hearing me. I feel ' + esc(list(S.cf.thanks) || '…') + ', because what I need (' + esc(list(B.needs) || '…') + ') is met, and what you need (' + esc(list(A.needs) || '…') + ') is too.”');
  }
  function conflictTool() {
    var A = S.cf.a, B = S.cf.b;
    return '<p class="rel-q">A worked example is filled in. Change anything; the conversation rewrites itself.</p>' +
      '<div class="rel-sides">' + cfSide('a') + cfSide('b') + '</div>' +
      '<div class="rel-table"><span class="eyebrow">Both sets of needs</span><p>' +
      A.needs.map(function (x) { return '<span class="rel-pill a">' + esc(x) + '</span>'; }).join('') +
      B.needs.map(function (x) { return '<span class="rel-pill b">' + esc(x) + '</span>'; }).join('') +
      '</p><p class="hint">' + (A.needs.length && B.needs.length ? 'None of these conflict. Only the first two requests did.' : 'Fill in both sides to see both sets of needs together.') + '</p></div>' +
      '<div class="rel-both"><span class="eyebrow">Strategies that could meet both</span><ul>' +
      S.cf.both.map(function (x, i) { return '<li><button type="button" class="rel-pick' + (i === S.cf.pick ? ' on' : '') + '" data-rel="cf-pick" data-v="' + i + '" aria-pressed="' + (i === S.cf.pick) + '">' + esc(x) + '</button></li>'; }).join('') +
      '</ul><div class="rel-row"><input type="text" data-rel-input="cf-add" value="' + esc(S.cf.add) + '" placeholder="Add your own idea" aria-label="Add a strategy" autocomplete="off"><button type="button" class="btn ghost sm" data-rel="cf-add">Add</button></div></div>' +
      '<div class="rel-both"><span class="eyebrow">Gratitude: how does it feel now?</span><div class="rel-chips xs">' +
      THANKS_PICK.map(function (w) { return chip('cf-thanks', w, w, S.cf.thanks.indexOf(w) !== -1); }).join('') + '</div></div>' +
      '<div class="rel-script-wrap"><span class="eyebrow">The conversation</span><ol class="rel-script" data-out="conflict">' + cfScript() + '</ol>' +
      '<p class="hint">Request or demand? If a “no” would bring blame, guilt or punishment, it was a demand.</p>' +
      '<div class="rel-row end"><button type="button" class="btn quiet sm" data-rel="cf-reset">Back to the example</button></div></div>';
  }

  var TOOLS = { wheel: function () { return wheelTool('solo'); }, needs: needsTool, sorter: sorterTool, translator: translatorTool, finder: finderTool, conflict: conflictTool, 'wheel-finder': function () { return wheelTool('finder'); } };
  function refreshKeep() { var y = window.scrollY; refresh(); window.scrollTo(0, y); }
  function refresh() {
    document.querySelectorAll('[data-tool]').forEach(function (el) {
      if (el.parentElement && el.parentElement.closest('[data-tool]')) return;
      var fn = TOOLS[el.getAttribute('data-tool')]; if (fn) el.innerHTML = fn();
    });
  }

  /* ---------- router hook ---------- */
  window.MN_LENS_VIEWS = window.MN_LENS_VIEWS || {};
  window.MN_LENS_VIEWS.relationships = function (sub) {
    var parts = (sub || '').split('?'), path = parts[0], qs = {};
    if (ALIAS[path]) path = ALIAS[path];
    (parts[1] || '').split('&').forEach(function (kv) { var p = kv.split('='); if (p[0]) qs[p[0]] = decodeURIComponent(p[1] || ''); });
    var seg = path.split('/');
    if (qs.w && FAMILY_OF[qs.w]) {
      var fam = FAMILY_OF[qs.w], fw = S.wheel.finder;
      S.finder = blankFinder(); S.finder.feelings = [qs.w]; S.finder.fam = fam.id;
      fw.mode = fam.mode; fw.fam = fam.id;
      var fs = D.WHEEL[fam.mode].families, st = 360 / fs.length; fw.rot = -(fs.indexOf(fam) * st + st / 2);
    }
    if (UNIT[seg[0]]) return viewUnit(UNIT[seg[0]], seg[1]);
    if (seg[0] === 'special') return viewSpecial(seg[1]);
    if (seg[0] === 'pets') return viewSpecial('family');
    if (seg[0] === 'wild') return viewSpecial('wild');
    if (D.APPS.some(function (a) { return a.id === seg[0]; })) return viewSpecial(seg[0]);
    return viewOverview();
  };

  /* ---------- events ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-rel]');
    if (!b) return;
    var a = b.getAttribute('data-rel'), v = b.getAttribute('data-v'), ctx = b.getAttribute('data-ctx'), f = S.finder, p;
    switch (a) {
      case 'back':
        if (history.length > 1) history.back(); else location.hash = BASE;
        return;
      case 'wheel-mode':
        if (S.wheel[ctx].mode === v) return;
        S.wheel[ctx] = { mode: v, fam: null, word: null, rot: 0 };
        break;
      case 'wheel-fam': if (!spinning) spinTo(ctx, v); return;
      case 'wheel-step':
        if (spinning) return;
        var fl = famList(ctx), ci = famIndex(ctx, S.wheel[ctx].fam);
        spinTo(ctx, fl[(ci < 0 ? (v > 0 ? 0 : fl.length - 1) : ci + Number(v) + fl.length) % fl.length].id);
        return;
      case 'wheel-word':
        var wf = FAMILY_OF[v];
        if (ctx === 'finder') { toggle(f.feelings, v); f.faux = null; }
        else S.wheel.solo.word = S.wheel.solo.word === v ? null : v;
        if (wf && wf.mode === S.wheel[ctx].mode && S.wheel[ctx].fam !== wf.id && !spinning) { spinTo(ctx, wf.id); return; }
        break;
      case 'need': toggle(S.needs, v); break;
      case 'sort': p = v.split(':'); S.sort[p[0]] = p[1]; break;
      case 'sort-reset': S.sort = {}; break;
      case 'faux': S.faux = v; break;
      case 'f-faux': f.faux = f.faux === v ? null : v; break;
      case 'f-feel': toggle(f.feelings, v); break;
      case 'f-source': f.source = f.source === v ? null : v; break;
      case 'f-need': toggle(f.needs, v); break;
      case 'f-all': f.showAll = !f.showAll; break;
      case 'f-reset': S.finder = blankFinder(); S.wheel.finder = { mode: 'unmet', fam: null, word: null, rot: 0 }; break;
      case 'f-copy': copy(fStatement()); return;
      case 'f-communicate':
        S.cf = cloneConflict();
        S.cf.a.feelings = f.feelings.slice(); S.cf.a.needs = f.needs.slice(); S.cf.a.obs = ''; S.cf.a.request = '';
        S.cf.b = { name: 'Them', feelings: [], needs: [], context: '', request: '' }; S.cf.both = []; S.cf.pick = -1;
        location.hash = href('dialogue', 'communicate').slice(1);
        return;
      case 'cf-feel': p = v.split(':'); toggle(S.cf[p[0]].feelings, p.slice(1).join(':')); break;
      case 'cf-need': p = v.split(':'); toggle(S.cf[p[0]].needs, p.slice(1).join(':')); break;
      case 'cf-thanks': toggle(S.cf.thanks, v); break;
      case 'cf-pick': S.cf.pick = Number(v); break;
      case 'cf-add': if (S.cf.add.trim()) { S.cf.both.push(S.cf.add.trim()); S.cf.pick = S.cf.both.length - 1; S.cf.add = ''; } break;
      case 'cf-reset': S.cf = cloneConflict(); break;
      case 'learn':
        if (prog.learned[v]) delete prog.learned[v]; else prog.learned[v] = Date.now();
        saveProgress();
        b.className = 'btn' + (prog.learned[v] ? ' ghost' : '');
        b.textContent = prog.learned[v] ? '✓ Unit learned' : 'Mark this unit as learned';
        var li = document.querySelector('.rel-vt-unit.k-' + v);
        if (li) { li.classList.toggle('done', !!prog.learned[v]); li.querySelector('.rel-vt-dot').textContent = prog.learned[v] ? '✓' : UNIT[v].num; }
        mn().toast(prog.learned[v] ? 'Marked as learned' : 'Unmarked');
        return;
      default: return;
    }
    var y = window.scrollY;
    refresh();
    window.scrollTo(0, y);
  });

  document.addEventListener('input', function (e) {
    var k = e.target.getAttribute && e.target.getAttribute('data-rel-input');
    if (!k) return;
    var v = e.target.value, m;
    if (k === 'cf-add') { S.cf.add = v; return; }
    if (k === 'cf-b-ctx') S.cf.b.context = v;
    else if ((m = k.match(/^cf-(a|b)-(name|obs|req)$/))) S.cf[m[1]][m[2] === 'req' ? 'request' : m[2]] = v;
    var sc = document.querySelector('[data-out="conflict"]');
    if (sc) sc.innerHTML = cfScript();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.getAttribute && e.target.getAttribute('data-rel-input') === 'cf-add') {
      e.preventDefault();
      var b = document.querySelector('[data-rel="cf-add"]'); if (b) b.click();
    }
  });

  /* Drag the wheel to spin it; on release it settles on the nearest family. */
  var drag = null, eatClick = false;
  function angleAt(svg, e) { var r = svg.getBoundingClientRect(), k = r.width / 524; return Math.atan2(e.clientY - (r.top + (CY + 30) * k), e.clientX - (r.left + (CX + 12) * k)) * 180 / Math.PI; }
  document.addEventListener('pointerdown', function (e) {
    var svg = e.target.closest && e.target.closest('.rel-wheel-svg');
    if (!svg || spinning || (e.pointerType === 'mouse' && e.button !== 0)) return;
    drag = { svg: svg, ctx: svg.getAttribute('data-ctx'), g: svg.querySelector('.rel-spin'), a0: angleAt(svg, e), x: e.clientX, y: e.clientY, d: 0, moved: false, id: e.pointerId };
  });
  document.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.moved && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 6) return;
    if (!drag.moved) { drag.moved = true; try { drag.svg.setPointerCapture(drag.id); } catch (err) { /* ignore */ } drag.g.style.transition = 'none'; }
    var d = angleAt(drag.svg, e) - drag.a0;
    if (d > 180) d -= 360; if (d < -180) d += 360;
    drag.d = d; drag.g.style.transform = 'rotate(' + d + 'deg)';
    e.preventDefault();
  });
  function endDrag() {
    if (!drag) return;
    var dr = drag; drag = null;
    if (!dr.moved) return;
    eatClick = true; setTimeout(function () { eatClick = false; }, 0);
    var ws = S.wheel[dr.ctx], n = famList(dr.ctx).length, step = 360 / n;
    ws.rot = (ws.rot || 0) + dr.d;
    var idx = Math.round(norm(-ws.rot - step / 2) / step) % n;
    refreshKeep();
    spinTo(dr.ctx, famList(dr.ctx)[idx].id);
  }
  document.addEventListener('pointerup', endDrag);
  document.addEventListener('pointercancel', endDrag);
  document.addEventListener('click', function (e) { if (eatClick) { e.stopPropagation(); e.preventDefault(); eatClick = false; } }, true);

  function copy(text) {
    if (!text) return;
    var fail = function () { mn().toast('Couldn’t copy. Select the text instead.'); };
    try { navigator.clipboard.writeText(text).then(function () { mn().toast('Copied'); }, fail); } catch (err) { fail(); }
  }
})();
