/* Governance lens (tier 5, in progress): gathers what other lenses teach about who decides over shared needs,
   and the stairs from noticing to changing it. Starts with California water. Registers window.MN_LENS_VIEWS.governance. */
(function () {
  function mn() { return window.MN; }
  function ul(items) { return '<ul>' + items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>'; }
  function sec(n, title, short, body) {
    return '<section class="gv-sec" id="gv-' + n + '"><div class="gv-sec-head"><span class="gv-n">' + n + '</span><div><h2>' + title + '</h2><p>' + short + '</p></div></div>' + body + '</section>';
  }

  var WHO = [
    ['Water rights and drinking-water rules', 'State Water Resources Control Board', 'Appointed by the Governor, confirmed by the state Senate', 'Public meetings with public comment; written comments on proposals'],
    ['State Water Project: aqueducts from the north to farms and Southern California', 'California Department of Water Resources', 'State agency under the Governor', 'The Governor, your state Assemblymember and Senator'],
    ['Central Valley Project: the federal dams and canals', 'US Bureau of Reclamation', 'Federal agency', 'Your members of Congress'],
    ['California’s share of the Colorado River', 'Negotiated among seven states and the federal government; local districts hold the shares', 'Mixed: federal, state and district boards', 'Members of Congress; district board meetings'],
    ['Your tap', 'Your city utility or water district (in San Francisco, the Public Utilities Commission)', 'An elected board, or a commission appointed by the city', 'Regular public meetings, usually monthly'],
    ['Groundwater', 'Local Groundwater Sustainability Agencies (since the 2014 groundwater law)', 'Boards drawn from local agencies', 'Their public meetings and plans'],
    ['Rates at private water companies', 'California Public Utilities Commission', 'Appointed by the Governor', 'Public participation hearings and comments'],
    ['Laws, budgets and water bonds', 'The Legislature, the Governor and voters', 'Elected', 'Your representatives; ballot measures']
  ];
  var STAIRS = [
    ['Notice and learn', 'Read your water report and the maps. Find the name of your water system, its board, and when it meets.', '#lens-water/testing/report', 'Water reports and maps'],
    ['Talk and make', 'Tell neighbors what you found. Art travels further than charts: a mural, a zine, a song, a photo of the dry well or the canal.', '#lens-relationships/neighbors', 'Neighbors'],
    ['Show up', 'Local boards must post agendas 72 hours before regular meetings (the Brown Act) and take public comment. Two minutes at a microphone is on the record.', '', ''],
    ['Ask in writing', 'Request records under the California Public Records Act: test results, contracts, who voted how. Write to whoever holds the decision (the table above).', '', ''],
    ['Reach representatives', 'State Assemblymember and Senator for water law; county supervisors for wells and land use; your water board; members of Congress for federal projects and the Colorado River.', '', ''],
    ['Organize together', 'Join or start a group. A building, a block or a valley asking together carries more weight than one person, and shares the work.', '#lens-relationships/dialogue', 'Dialogue'],
    ['Vote, run, and protest peacefully', 'Water board seats are elected, often with few votes cast. Ballot measures decide water bonds. Peaceful protest makes a need visible when other doors stay shut.', '#lens-relationships', 'Nonviolence']
  ];

  function view() {
    var html =
      '<section class="gv-hero"><span class="gv-pill">Tier 5 · Craft · In progress</span><h1 tabindex="-1">Governance</h1>' +
      '<p class="gv-lede">Every shared need (water, air, land) is governed by someone, often far from the tap. This lens gathers what we learn along the way: who holds each decision, where the resources go, and the stairs from noticing to changing it. It starts with California water; more will gather here as other lenses open.</p></section>' +

      sec(1, 'Two views, the same needs', 'Strategies differ by place; the needs underneath are shared.',
        '<div class="gv-views">' +
        '<div class="gv-view"><span class="eyebrow">In a big city</span><p>“Honestly, I’m happy to buy my tap water. I’d love a collective way to clean it that’s cheaper in bulk and meets everyone’s needs, and I’d pay not to have to pull it out of the river myself.”</p><small>Needs: ease, health, fairness, trust</small></div>' +
        '<div class="gv-view"><span class="eyebrow">In rural California</span><p>“Wait, why is so much of the water going to animal agriculture while our wells go dry?”</p><small>Needs: fairness, safety, a say, transparency</small></div>' +
        '</div><p>Both are reasonable. Conflicts live between strategies, never between needs, so good governance starts by asking what everyone needs and who is at the table.</p>') +

      sec(2, 'Who controls California’s water', 'Each decision has a holder, a way they’re chosen, and a door to knock on.',
        '<div class="gv-tbl"><table><thead><tr><th>Decision</th><th>Who holds it</th><th>How they’re chosen</th><th>How to reach them</th></tr></thead><tbody>' +
        WHO.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') +
        '</tbody></table></div>' +
        '<p class="gv-note"><b>Worth knowing:</b> some agricultural water districts give votes by land owned rather than one person, one vote, a system the US Supreme Court upheld in 1973. The biggest landowners can hold the most votes.</p>') +

      sec(3, 'Where the water goes', 'In an average year, across the whole state.',
        '<div class="gv-split"><div style="--w:50%"><b>About 50%</b><span>Environment: rivers, wetlands, the Delta</span></div><div style="--w:40%"><b>About 40%</b><span>Farms</span></div><div style="--w:10%"><b>About 10%</b><span>Cities and homes</span></div></div>' +
        '<p>Of farm water, about 27% grows feed for animals: alfalfa, irrigated pasture and silage corn. Wet years and dry years shift these numbers a lot; in droughts, rivers lose the most.</p>' +
        '<p class="gv-src">Source: Public Policy Institute of California. Water per pound of each food is in <a href="#lens-water/sources/take">the end of Water: Sources</a>.</p>') +

      sec(4, 'Stairs for change', 'Start on the first step. Each one makes the next easier.',
        '<ol class="gv-stairs">' + STAIRS.map(function (s, i) {
          return '<li style="--i:' + i + '"><b>' + s[0] + '</b><p>' + s[1] + '</p>' + (s[2] ? '<a href="' + s[2] + '">' + s[3] + ' →</a>' : '') + '</li>';
        }).join('') + '</ol>' +
        '<p class="gv-src">Find your state representatives at findyourrep.legislature.ca.gov.</p>') +

      sec(5, 'A transparency checklist', 'Questions to ask about any decision over a shared need.',
        ul(['Who made this decision, and who could have?', 'Who benefits, and who pays?', 'Who was at the table, and who wasn’t?', 'Where is the data, and can anyone read it?', 'When is the next chance to weigh in?'])) +

      '<aside class="gv-fun"><span class="eyebrow">Fun fact</span><p>California law (2012) recognizes a human right to safe, clean, affordable water. Rights on paper become rights in practice when people keep asking.</p></aside>';
    return { title: 'Governance · Kinship', html: mn().header('home') + '<div><a class="back" href="#">← Education</a></div><main class="gv">' + html + '</main>' + mn().footer() };
  }

  window.MN_LENS_VIEWS = window.MN_LENS_VIEWS || {};
  window.MN_LENS_VIEWS.governance = function () { return view(); };
})();
