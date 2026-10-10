/* Water lens: course content, profile tailoring and tools. Registers window.MN_LENS_VIEWS.water.
   Routes: #lens-water (overview) · #lens-water/cows (old link, opens the farm water note at the end of Sources) · #lens-water/<unit>[/<sub>]. Units are shades of blue, darkest (1) to lightest (6).
   Tailoring: answers from the Profile (Place + Water) become tags; accordions tagged data-for open with a "For you" badge.
   Every section stays available to everyone. Laws mentioned are California's; the practices are general. */
(function () {
  var BASE = '#lens-water';
  function mn() { return window.MN; }
  function esc(s) { return mn().esc(s); }
  function prof() { return (mn().profile && mn().profile()) || {}; }

  /* ---------- profile → tags ---------- */
  function tags() {
    var p = prof(), t = {}, src = p.sources || {}, space = p.space || [], filters = p.filters || [];
    if (p.home === 'Shelter or no fixed place' || p.stay === 'No fixed place right now') t.nohome = 1;
    var rooted = p.stay === 'A few years' || p.stay === 'Long-term, putting down roots';
    var canShape = p.shape === 'Bigger changes, with an owner who’s on board' || p.shape === 'It’s ours to shape';
    if (rooted && canShape) t.invest = 1;
    else if (p.shape || p.stay === 'Under a year' || p.home === 'Vehicle or boat' || p.home === 'Apartment or room') t.portable = 1;
    if (space.indexOf('Acreage or farmland') !== -1) { t.land = 1; t.outdoor = 1; }
    if (p.home === 'House' || space.some(function (s) { return /Balcony|yard|plot/i.test(s); })) t.outdoor = 1;
    if (src.well || src.spring) t.well = 1;
    if (src.notap) t.notap = 1;
    if (src.rain) t.catch = 1;
    if (p.rain && p.rain.indexOf('Through') !== 0) t.dry = 1;
    if (Number(p.kids) > 0 || (p.consider || []).some(function (c) { return /Pregnancy|Babies/.test(c); })) t.kids = 1;
    if (/^Before/.test(p.pipes || '')) t.oldpipes = 1;
    if (filters.some(function (f) { return /reverse osmosis/i.test(f); })) t.hasRO = 1;
    if (filters.some(function (f) { return /Pitcher|Faucet|Under-sink filter|Gravity|Whole-house/.test(f); })) t.hasCarbon = 1;
    if (filters.indexOf('None yet') !== -1) t.nofilter = 1;
    return t;
  }
  var T = {};

  /* ---------- small builders ---------- */
  function acc(forTags, who, title, body) {
    var hit = forTags.split(' ').some(function (k) { return T[k]; });
    return '<details class="wa-acc' + (hit ? ' match' : '') + '" data-for="' + forTags + '"' + (hit ? ' open' : '') + '>' +
      '<summary><span class="wa-who">' + who + '</span><span class="wa-acc-t">' + title + '</span>' + (hit ? '<span class="wa-foryou">For you</span>' : '') + '</summary>' +
      '<div class="wa-in">' + body + '</div></details>';
  }
  function accs() { return '<div class="wa-accs">' + Array.prototype.join.call(arguments, '') + '</div>'; }
  function box(kind, html) { return '<p class="wa-box wa-' + kind + '">' + html + '</p>'; }
  function old(h) { return box('old', h); }
  function ca(h) { return box('ca', h); }
  function home(h) { return box('home', h); }
  function tryit(h) { return box('do', h); }
  function kind(h) { return '<p class="wa-kind">' + h + '</p>'; }
  function links(h) { return '<p class="wa-links">' + h + '</p>'; }
  function ul(items) { return '<ul>' + items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>'; }
  function a(path, text) { return '<a href="' + BASE + '/' + path + '">' + text + '</a>'; }
  function table(head, rows, cls) {
    return '<div class="wa-tbl"><table><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { var m = /^\[(y|p|n)\](.*)$/.exec(c); return m ? '<td class="' + m[1] + '">' + m[2] + '</td>' : '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody></table></div>' + (cls ? '<p class="wa-legend">' + cls + '</p>' : '');
  }
  function truths(list) { return '<div class="wa-truths">' + list.map(function (t) { return '<div class="wa-truth"><b>' + t[0] + '</b><p>' + t[1] + '</p></div>'; }).join('') + '</div>'; }

  /* ---------- course content ---------- */
  function units() {
    return [
      { id: 'uses', num: 1, word: 'Uses', sub: 'Using water wisely',
        take: function () { return mn().opinion ? mn().opinion('<p>Since children’s bodies are smallest, they dehydrate fastest and are most sensitive to drought and famine.</p><p class="opinion-src">Worldwide, 1 in 5 children don’t have enough water for everyday needs (UNICEF, 2021).</p>') : ''; },
        lede: 'Not every job needs drinking water. Knowing what each use really needs is the base of every system later in this course, and the easiest way to need less.',
        subs: [
          { id: 'needs', short: 'Needs', title: 'What we need it for', html: function () { return '<p>A day of water: drinking, cooking, brushing teeth, washing hands and bodies, dishes, laundry, flushing, cleaning, plants and animals. A body needs about 2–3 liters a day to drink, more in heat (' + a('uses/drink', '1.2') + '). Humanitarian groups plan around 15 liters (about 4 gallons) per person a day for drinking, cooking and basic washing. A typical US home with taps uses many times that.</p>' +
            old('When every drop was carried, every drop had a job: washing water went to the garden, dishwater to the animals’ trough or the fruit trees.') +
            tryit('Keep a one-day water diary: every time water runs, jot what it was for. Circle the jobs that didn’t need drinking-quality water.'); } },
          { id: 'drink', short: 'Drinking', title: 'How much to drink', html: function () { return '<p>Most adults need about <b>2.7 liters (women) to 3.7 liters (men)</b> of water a day in all. About 20% usually comes from food, which leaves roughly <b>9 to 13 cups to drink</b>. Tea, milk and soup count. Thirst and pale-yellow pee are good everyday guides.</p>' +
            accs(
              acc('kids', 'Babies', 'Babies and toddlers', '<p>Under 6 months, breast milk or formula is all the water a baby needs. Extra water can make a young baby seriously ill. From about 6 months, small sips: about 4–8 ounces (½ to 1 cup) a day alongside milk. After a year, water and milk become the main drinks.</p>'),
              acc('elder', 'Older bodies', 'Older adults', '<p>Thirst fades with age, so waiting to feel thirsty can mean waiting too long. Drink on a rhythm instead: with meals, with medicines, with visits. Some medicines, like water pills, change how much a body needs.</p>'),
              acc('athlete outdoor', 'Active bodies', 'Sport, work and heat', '<p>Sweat raises needs fast. Drink before, during and after. For long or very sweaty efforts, add salt or electrolytes: lots of plain water without salt can make someone sick too.</p>'),
              acc('pregnant', 'Pregnancy', 'Pregnancy and breastfeeding', '<p>Needs go up: about 3 liters a day in all while pregnant, and about 3.8 liters while breastfeeding.</p>'),
              acc('health', 'Health needs', 'Illness and fluid limits', '<p>Fever, vomiting and diarrhea pull water out. Sip often, and use an oral rehydration drink for big losses. Some kidney, heart and liver conditions call for drinking <i>less</i>; there, a doctor’s number comes first.</p>')
            ) +
            '<p><b>Water in food:</b> cucumbers, lettuce, melons, citrus and most fresh fruits and vegetables are about 85–96% water. A day full of them, plus soups and stews, means less to drink. A dry, salty day means more.</p>'; } },
          { id: 'grades', short: 'Grades', title: 'Four grades of water', html: function () { return '<p>Match the water to the job, from cleanest to least clean.</p>' +
            '<div class="wa-ladder">' +
            '<div class="wa-rung r1"><small>Grade 1</small><b>Drinking (potable)</b><p>Drinking, cooking, brushing teeth, baby formula, ice, washing produce eaten raw.</p></div>' +
            '<div class="wa-rung r2"><small>Grade 2</small><b>Clean, boil if unsure</b><p>Washing hands and bodies, dishes, laundry. Rain or stored water fits here, boiled if anyone might swallow it.</p></div>' +
            '<div class="wa-rung r3"><small>Grade 3</small><b>Gray water</b><p>Used once: shower, bath, bathroom sink, laundry. Good for flushing and watering non-edible plants.</p></div>' +
            '<div class="wa-rung r4"><small>Grade 4</small><b>Black water</b><p>Toilet waste (and in many places, the kitchen sink). Goes to sewer, septic or a proper compost toilet.</p></div></div>' +
            home('A bowl in the sink while washing veggies catches grade 2 water for the houseplants.'); } },
          { id: 'gray', short: 'Gray water', title: 'Gray water', html: function () { return ul(['Use it within a day. Stored gray water starts to smell and grow germs.', 'Send it into soil or mulch, not onto leaves you eat or root crops.', 'Plant-friendly soaps (low salt, no boron or bleach) keep the soil happy.']) +
            ca('A simple laundry-to-landscape system needs no permit if it follows the state plumbing code’s rules (no storage, no spraying, water stays on your land).') +
            accs(
              acc('portable nohome', 'Portable', 'Gray water without changing any pipes', '<p>A bucket in the shower while it warms up, then into the toilet tank or onto outdoor plants. A basin in the sink for hand-washing water. Nothing to install, nothing to ask permission for.</p>'),
              acc('invest', 'Long-term place', 'Laundry-to-landscape and branched drains', '<p>The washing machine’s drain hose feeds a pipe to mulch basins around trees. A branched drain does the same for showers. A 3-way valve lets you switch back to the sewer in rainy months.</p>' + links('Gardening · Composting &amp; waste')),
              acc('crisis', 'Outage', 'Flushing when the water is off', '<p>Pour a bucket of gray water (about 1–2 gallons) quickly into the bowl to flush. If sewer lines may be broken after an earthquake, don’t flush: use a lined bucket toilet instead.</p>' + links('Composting &amp; waste · Emergency prep'))
            ); } },
          { id: 'less', short: 'Use less', title: 'Small ways to use less', html: function () { return ul(['<b>Toilet leak test:</b> a few drops of food coloring in the tank. Color in the bowl after 10 minutes without flushing means a leak.', 'A faucet dripping once a second adds up to thousands of gallons a year.', 'Wash dishes in a basin, run full laundry loads, catch the cold water while the shower warms.', 'Water gardens early or late, at the roots, with mulch on top.']) +
            tryit('Do the toilet dye test with a child: they’re great at watching for color.'); } },
          { id: 'system', short: 'Your system', title: 'Designing your water system', html: function () { return '<p>Every life has a water loop: <b>source → storage → purify → use → reuse → back to soil</b>. A few truths of design hold everywhere, whatever you can change right now:</p>' +
            truths([['Where water falls is easiest', 'Places with steady rain or snow, springs and rivers need the least infrastructure. Dry places can thrive too, with storage sized for the whole dry season.'], ['Water flows downhill', 'Gravity is free energy. Store high, use low; put the barrel above the garden, not below it.'], ['Closer is easier', 'The shorter the trip from source to use, the less carrying, pumping and leaking.'], ['Slow it, spread it, sink it', 'Rain that soaks into the ground refills wells and springs for everyone downhill.'], ['Time decides the build', 'How long you’ll be somewhere, and whether you can shape it, decides whether a pitcher or a cistern makes sense.']]) +
            accs(
              acc('portable', 'Portable', 'A carry-it-with-you loop', '<p>Tap → filter pitcher or countertop unit → a few stored jugs → shower bucket to toilet → houseplants. Everything moves with you.</p>'),
              acc('invest outdoor', 'Rooted, with outdoor space', 'A house-and-yard loop', '<p>Tap and rain barrels → under-sink filter → stored drums → laundry-to-landscape → fruit trees and mulch. Rain gardens let what’s left soak in.</p>'),
              acc('land', 'Land', 'An off-grid loop', '<p>Well or roof catchment → cistern → sediment, carbon and UV (or slow sand) → house → gray water to orchard → swales that recharge the aquifer.</p>'),
              acc('nohome', 'No fixed home', 'A map-it loop', '<p>Free refill points → two or three clean bottles → a small backup filter → rinse water reused for washing up. Here the system is the map of where water is, and the people who share it.</p>'),
              acc('dry', 'Dry climate', 'Designing for the dry season', '<p>Most of California gets its rain in a few winter months. Count how many dry months you need to bridge, and let the garden plan follow the water: native, dry-adapted plants, deep mulch, and winter rain stored in the soil.</p>' + links('Gardening · Weather'))
            ) + tryit('Draw your loop on paper with arrows. Mark one step you’d like to add.'); } }
        ] },

      { id: 'sources', num: 2, word: 'Sources', sub: 'Where water comes from',
        take: function () { return mn().opinion ? mn().opinion('<details class="opinion-more"><summary>Where California’s farm water goes</summary><div class="opinion-facts">' + ul([
          'Farms use about <b>40%</b> of California’s water.',
          'That grows nearly half of US vegetables and over three-quarters of US fruits and nuts.',
          'Water per pound for the top plant crops: carrots 23 gal · tomatoes 26 · lettuce 28 · strawberries 42 · grapes 73 · pistachios 1,360 · almonds 1,930.',
          'About <b>27%</b> of farm water grows feed for farmed animals: alfalfa, pasture and corn silage, mostly for cows raised for milk and meat. Much of the corn and soy fed to chickens and pigs is grown out of state, so that water never shows up in California’s count.',
          'Of the water behind animal foods, about <b>98%</b> grows their feed. What the animals drink is about 1.1%; hosing down feedlots, barns and the animals themselves about 0.8%. Slaughterhouse water isn’t counted at all, so the real total runs higher.',
          'In all, per pound of animal foods: cow milk 120 gal · eggs 400 · chickens 520 · pigs 720 · cows 1,850.']) +
          '<p class="opinion-src">Sources: Public Policy Institute of California; California Department of Food and Agriculture (top crops by value, 2024); Water Footprint Network and Mekonnen &amp; Hoekstra (2012) (world averages, rain included).</p></div></details><p class="opinion-src">More on peace with animals in <a href="#lens-relationships/special/captive">Captive animals</a>.</p>') : ''; },
        lede: 'Water reaches us from the sky, the ground or a pipe. Each source carries its own likely problems, which tells you what storage, purifying and testing it needs.',
        subs: [
          { id: 'know', short: 'Sources', title: 'Know your sources', html: function () { return '<p>Two truths come before every source:</p>' +
            truths([['Know what’s upstream', 'Water carries everything it has passed: towns, farms, roads, mines, factories, someone’s laundry. Clear and fast doesn’t mean clean.'], ['Unknown until you know', 'Until you know a water’s story or have tested it, treat it as unsafe. Today that’s most water you didn’t trace yourself.']]) +
            '<p>In <i>Traveler’s Joy</i>, herbalist Juliette de Baïracli Levy tells of being sent to a mountain stream as pure, then finding that upstream, sheets from typhus patients were being washed in it. Today the upstream can be a factory: DuPont’s Washington Works plant in West Virginia released PFOA, a “forever chemical,” into the Ohio River and nearby drinking water for decades. The US Geological Survey estimates at least 45% of US tap water carries some PFAS.</p>' +
            table(['Source', 'Usually watch for', 'Ready to drink?'], [
              ['Public tap', 'Lead from old pipes, chlorine taste, sometimes PFAS', '[y]Usually'], ['Rain', 'Roof dirt, bird droppings, roof materials', '[n]Treat first'], ['Well', 'Bacteria, nitrate, arsenic, minerals', '[p]After testing'],
              ['Spring', 'Surface water sneaking in after rain', '[p]After testing'], ['River, lake', 'Germs, farm and road runoff, algae toxins', '[n]Treat first'], ['Dehumidifier / AC', 'Metals and germs from the coils', '[n]Plants only']]) +
            old('Villages grew up beside springs and rivers. People drew drinking water upstream and washed downstream, and that order still matters.') +
            tryit('Find your watershed’s name and trace a raindrop from your roof to your tap, then to the sea.'); } },
          { id: 'taps', short: 'Taps &amp; refills', title: 'Taps and free refills', html: function () { return '<p>Public water is already treated and tested, which makes it the cheapest reliable water there is. Refill maps and apps show fountains and businesses happy to fill a bottle.</p>' +
            ca('State law (2012) recognizes that every person has a right to safe, clean, affordable water for drinking, cooking and washing.') +
            accs(
              acc('notap', 'No safe tap', 'Living without a safe tap', '<p>Many households carry or buy every drinking gallon. The options, roughly cheapest per gallon first: free refill points, refill machines with your own jugs, a gravity or countertop filter (if the tap runs but isn’t safe to drink), then delivered 5-gallon jugs, then cases of small bottles. ' + a('costs/prices', 'Unit 6') + ' does the math for your household.</p>'),
              acc('nohome', 'No fixed home', 'Where water is free', kind('Without a home, water takes far more time, walking and planning, because most systems assume a tap of your own. That’s a gap in how things are built, not a personal failing.') + ul(['Public libraries, parks, community and rec centers, transit stations.', 'Cafés and fast-food counters will often fill a bottle with tap water when asked.', 'Day centers and shelters often have water, showers and laundry.', 'Calling or texting <b>211</b> finds local water, showers and food.'])),
              acc('crisis', 'Outage', 'Water already in your home', ul(['The water heater tank, often 30–80 gallons. Turn off power or gas, let it cool, drain from the bottom valve.', 'The toilet tank (not the bowl), if no cleaning tablets are in it.', 'Ice, and liquid in canned fruit and vegetables.', 'If the supply may be contaminated, close your main valve to keep it out of your pipes.']))
            ); } },
          { id: 'rain', short: 'Rain', title: 'Catching rain', html: function () { return '<p>One inch of rain on 1,000 sq ft of roof is about 620 gallons. A <b>first-flush diverter</b> sends the dirtiest first water away. Rainwater goes to the garden first, and to drinking only with treatment.</p>' +
            ca('Collecting rain from your roof is legal (Rainwater Capture Act, 2012). Many water agencies offer rebates or free barrels.') +
            accs(
              acc('portable hasRO', 'Portable', 'Balcony scale', '<p>A lidded bucket under a balcony drip or a chain from the gutter, for plants and mopping. Check with whoever owns the building before attaching anything. Even in a city you’ll never fully leave the grid in, every gallon caught is a step in the right direction.</p>'),
              acc('outdoor invest catch', 'Yard', 'Barrels on downspouts', '<p>One or two 55-gallon barrels with a diverter kit, a screen and an overflow pointed away from the foundation.</p>'),
              acc('land', 'Land', 'Cistern catchment', '<p>Metal roofs are the best for drinking water. Gutters → first flush → screened cistern (shaded or buried) → the filter train in ' + a('purify/permanent', '4.3') + '.</p>'),
              acc('dry', 'Dry climate', 'Sizing for a dry season', '<p>With winter-only rain, a barrel fills and empties within weeks. Storing water in the soil (mulch, basins, rain gardens) often beats storing it in tanks.</p>')
            ); } },
          { id: 'wells', short: 'Wells &amp; springs', title: 'Wells and springs', html: function () { return '<p>Groundwater is filtered by soil and rock, so it’s often cleaner than surface water, but it can pick up arsenic, nitrate, uranium or bacteria along the way.</p>' +
            accs(
              acc('well land', 'Wells', 'Caring for a well', ul(['Test yearly for coliform bacteria and nitrate, and after floods or repairs (' + a('testing/kits', '5.4') + ').', 'Keep a sealed cap and slope soil away from the wellhead. No chemicals or septic nearby.', 'County environmental health handles well permits and drilling records.'])),
              acc('well land nohome', 'Springs', 'Using a spring', '<p>Find out who owns or cares for it. A “spring box” protects it from runoff. Clear spring water can still carry germs from animals uphill, so treat it unless it’s tested. A spring you visit now and then is a lovely extra source, not one to bet the household on.</p>')
            ); } },
          { id: 'wild', short: 'Wild water', title: 'Rivers, lakes and the wild', html: function () { return ul(['<b>Running over still:</b> moving water is less likely to breed mosquitoes and algae.', '<b>But ask who’s upstream:</b> towns, farms, roads, mines and factories all drain somewhere. Running water carries their runoff too.', 'Skip water with green or blue-green scum, oily sheen, foam or dead fish.', 'Always purify before drinking (' + a('purify', 'Unit 4') + ').']) +
            old('“Running water is clean water” held when nobody upstream was spraying fields. Keep the habit, and add the question.') +
            links(a('testing/signs', '5.2 Reading the signs') + ' · ' + a('testing/outdoors', '5.5 Swimming and bathing outdoors')); } },
          { id: 'place', short: 'Where to live', title: 'Choosing where to live', html: function () { return '<p>If you’re choosing where to live, put clean water near the top of the list. Living near clean water is much easier than making dirty water clean.</p>' +
            ul(['<b>Public water:</b> read the provider’s yearly water quality report before you sign (' + a('testing/report', '5.3') + ').', '<b>A well:</b> ask for recent test results and the well log, and test before you buy (' + a('sources/wells', '2.4') + ').', '<b>Look upstream and uphill:</b> farms, feedlots, mines, factories, landfills, and airports or military bases (firefighting foam is a common PFAS source).', '<b>Look ahead:</b> drought history, falling groundwater, and who else draws on the same water.']); } }
        ] },

      { id: 'storage', num: 3, word: 'Storage', sub: 'Keeping water safe',
        lede: 'Stored water stays good with three things: a clean food-grade container, darkness and coolness. Then a date on the lid, and a reminder to refresh it.',
        subs: [
          { id: 'containers', short: 'Containers', title: 'Containers', html: function () { return ul(['Food-grade only: HDPE plastic (#2), containers sold for water, glass, stainless steel or glazed ceramic.', 'Never one that held chemicals, even rinsed. Milk jugs break down and are hard to clean: plant water only.', 'Secondhand first: food-grade barrels and jugs turn up free from bakeries, juice and soda bottlers, and on Craigslist, Facebook Marketplace and Buy Nothing. Ask what was in them.']) +
            old('Unglazed clay pots keep water cool: a little seeps through the walls and evaporates, carrying heat away.') +
            accs(
              acc('invest land', 'More space', 'Drums, totes and cisterns', '<p>A 55-gallon drum full of water weighs about 460 lb: fill it where it will stay and use a hand pump or siphon. 275-gallon IBC totes work for garden water; for drinking, only food-grade ones, covered from light.</p>'),
              acc('nohome', 'On the move', 'What to carry', '<p>A gallon weighs about 8.3 lb. Two or three sturdy refillable bottles plus a collapsible pouch usually beat one big jug.</p>')
            ); } },
          { id: 'where', short: 'Where', title: 'Where to keep it', html: function () { return '<p>Cool, dark and away from fumes. Gasoline, paint, pesticides and cleaners can pass through plastic into the water. Spread it around, so one damaged spot doesn’t take it all.</p>' +
            accs(acc('portable', 'Small spaces', 'Hiding spots indoors', '<p>Under beds, the back of closets, under the sink (away from cleaners), flat bricks behind the couch.</p>')); } },
          { id: 'algae', short: 'Algae', title: 'Beware green in the sun', html: function () { return '<p>Algae only need light, water and a few nutrients. A clear jug on a sunny porch can turn green in weeks.</p>' +
            ul(['Opaque containers, or cover clear ones and keep them in the dark.', 'Rain barrels: opaque, lidded and screened.', 'Pet bowls and bottles by a window grow the same film in miniature.']) +
            old('Standing water breeds mosquitoes: eggs can become biting adults in about a week. Empty, cover or keep water moving.') +
            tryit('Walk the house and yard with a child and find every place water sits in sunlight or stands still. Cover, empty or move each one.') +
            links('Animal care · ' + a('purify/crisis', '4.4 Sunlight as a tool') + ' (the short-trip exception)'); } },
          { id: 'fresh', short: 'Fresh', title: 'Keeping it fresh', html: function () { return ul(['<b>Before filling:</b> wash with soap, rinse, swish with a little unscented bleach and water (about 1 tsp per quart), then rinse.', '<b>Label:</b> “filled on” date. Refresh tap water you bottled yourself every 6 months; sealed bottled water lasts to its date.', '<b>Pour, don’t dip:</b> a spigot or pouring keeps hands and cups out of the supply.', 'Old stored water makes great plant water.']); } },
          { id: 'amount', short: 'How much', title: 'How much to keep', html: function () { return '<p>A short-term bare minimum is about <b>1 gallon per person per day</b>. For longer stretches, humanitarian groups plan around <b>4 gallons (15 L)</b> to cover cooking and washing. Three days is a start; two weeks gives real ease. There’s no rush: a few jugs a month adds up.</p>' +
            '<div class="wa-tool"><b class="wa-tool-t">Storage planner</b><div class="wa-row">' +
            '<label class="wa-f">People<input type="number" data-wa="store" id="wa-ppl" min="1" value="' + people() + '"></label>' +
            '<label class="wa-f">Days<select data-wa="store" id="wa-days"><option value="3">3 days</option><option value="7">1 week</option><option value="14" selected>2 weeks</option></select></label>' +
            '<label class="wa-f">Level<select data-wa="store" id="wa-lvl"><option value="1">Bare minimum (1 gal)</option><option value="4">Comfortable (4 gal)</option></select></label>' +
            '<label class="wa-chk"><input type="checkbox" data-wa="store" id="wa-hot"> Hot weather, nursing or sick</label></div>' +
            '<div class="wa-out" id="wa-store-out" aria-live="polite"></div></div>' + links('Emergency prep'); } }
        ] },

      { id: 'purify', num: 4, word: 'Purify', sub: 'From a pitcher to an aquifer',
        lede: 'No single method does everything, and the priciest one isn’t automatically right. Start with what’s in your water, then choose the simplest thing that handles it, at whatever scale your life has right now.',
        subs: [
          { id: 'match', short: 'Match', title: 'Match the method to the problem', html: function () { return '<p>A filter’s box can claim anything. An independent certification (in North America, NSF/ANSI: <b>42</b> taste, <b>53</b> health contaminants like lead, <b>58</b> reverse osmosis, <b>401</b> newer chemicals) means someone outside the company tested that claim. NSF’s list is free to search by model number.</p>' +
            table(['Method', 'Germs', 'Lead', 'Nitrate', 'PFAS', 'Taste'], [
              ['Boiling', '[y]Yes', '[n]No', '[n]No (concentrates)', '[n]No', '[n]—'], ['Carbon pitcher / faucet', '[n]No', '[p]If certified 53', '[n]No', '[p]Some models', '[y]Yes'],
              ['Hollow-fiber squeeze', '[p]Bacteria &amp; parasites', '[n]No', '[n]No', '[n]No', '[n]No'], ['Gravity ceramic + carbon', '[p]Bacteria &amp; parasites', '[p]Check cert', '[n]No', '[p]Check cert', '[y]Yes'],
              ['Reverse osmosis', '[p]Most', '[y]Yes', '[y]Yes', '[y]Yes', '[y]Yes'], ['UV light', '[y]Clear water only', '[n]No', '[n]No', '[n]No', '[n]No'], ['Slow sand / biosand', '[p]Most', '[n]No', '[n]No', '[n]No', '[p]Some']],
              'Green = handles it · amber = depends on model or setup · red = doesn’t.') +
            '<div class="wa-tool"><b class="wa-tool-t">Which method?</b><label class="wa-f">I’m worried about<select data-wa="filt" id="wa-worry">' +
            '<option value="taste">Chlorine taste or smell</option><option value="lead">Lead (older pipes)</option><option value="microbes">Germs (wild water, wells, outages)</option>' +
            '<option value="nitrate">Nitrate (farm areas, wells)</option><option value="pfas">PFAS (“forever chemicals”)</option><option value="hard">Hard water, scale</option></select></label>' +
            '<div class="wa-out" id="wa-filt-out" aria-live="polite"></div></div>'; } },
          { id: 'everyday', short: 'Everyday', title: 'Everyday filtering', html: function () { return ul(['<b>Free first:</b> an open pitcher in the fridge overnight lets chlorine leave (not chloramine). Run the cold tap after water sits, cook with cold, clean the aerator.', '<b>Secondhand first:</b> ask Buy Nothing groups and neighbors, then eBay, Craigslist, Facebook Marketplace and OfferUp. Used body, new insides: always fit new cartridges and sanitize the housing. Check that replacement filters are still sold.', '<b>Care:</b> write the install date on every cartridge. An old filter can stop working or grow bacteria.']) +
            accs(
              acc('hasRO', 'You have', 'You already have reverse osmosis: what’s next', '<p>Drinking water at home is covered, and that’s a real foundation. From here the direction is resilience and sharing, not more gear:</p>' + ul([
                '<b>Older pipes?</b> In an older building, countertop RO is a sound choice for your family’s health while you live there: it handles whatever the last stretch of pipe adds, and it moves with you.',
                '<b>Ask for the lasting fix.</b> A friendly request to whoever owns the building for a building-wide lead test, replacing old service lines, or a filter at the main would clean everyone’s water for good. ' + '<a href="#lens-relationships/request">The Request tool</a> helps with the wording.',
                '<b>Share.</b> Ask neighbors whether they know their water’s safe. Offer filtered water, split a lab test, or pass along what you’ve learned. <a href="#lens-relationships/neighbors">Neighbors</a> has ideas for sharing a place well.',
                '<b>Step a little off the grid.</b> Catch rain on a balcony or in a barrel (if allowed) for plants, mopping and flushing; reuse the RO’s reject water the same way.',
                '<b>Put minerals back</b> if the water tastes flat (below), and run the numbers on filters vs bottled in ' + a('costs/onetime', 'Unit 6') + '.'])),
              acc('hasCarbon', 'You have', 'You already have a carbon filter', '<p>Check its certification against your water report: a pitcher certified only for taste (NSF 42) won’t touch lead. Change cartridges on time. If your pipes are old or the report shows lead, PFAS or nitrate, the table above shows what to add.</p>'),
              acc('oldpipes kids', 'Older pipes', 'Pipes put in before 1986', '<p>Lead solder and lead service lines were common before 1986. Run the cold tap until it feels colder after water sits for hours, cook and mix formula with cold water, and do a first-draw lead test (' + a('testing/kits', '5.4') + '). Until you know, a filter certified for lead (NSF 53) or reverse osmosis is the careful choice, especially with children or pregnancy in the house.</p>'),
              acc('portable', 'Can’t change pipes', 'Reverse osmosis as a stop-gap', '<p>When testing shows lead, nitrate or PFAS and the pipes aren’t yours to change, a countertop reverse osmosis unit (no drilling) removes most of them and moves with you. It sends some water down the drain: catch that for mopping or flushing.</p><p>Still worth a friendly request to whoever owns the building or runs the water: fixes upstream help everyone.</p>'),
              acc('hasRO portable invest', 'After RO', 'Putting minerals back', '<p>RO water is very low in calcium and magnesium, so it tastes flat. Most minerals come from food, so this is mostly about taste and a small top-up, and water that tastes good gets drunk.</p>' + ul(['A remineralizing cartridge after the membrane.', 'Trace-mineral drops, per the label.', 'A small pinch of mineral salt per pitcher, to taste.']) + '<p>A cheap TDS meter shows when the membrane is tiring: the number creeps up.</p>'),
              acc('invest', 'Rooted', 'Under-sink and whole-house', '<p>Under-sink carbon or RO at the kitchen tap covers drinking and cooking. Whole-house sediment and carbon help with taste and shower chlorine. If lead is the concern, replacing the service line fixes the source.</p>')
            ); } },
          { id: 'permanent', short: 'Permanent', title: 'Permanent systems', html: function () { return '<p>Safe water at the tap is step one. The longer arc runs toward water that doesn’t hang on one pipe. You don’t need to leave the grid; each step is the right direction:</p>' +
            truths([['1 · Clean at the tap', 'A filter matched to your water.'], ['2 · Water you catch', 'Rain for plants, mopping and flushing.'], ['3 · Water you share', 'Tests, filters and knowledge with neighbors.'], ['4 · Water you store and treat', 'Cisterns, wells and filter trains, where you can shape the place.']]) +
            accs(
              acc('well land', 'Well', 'A well water train', '<p>Well → pressure tank → sediment filter → carbon → UV light where water enters the house. Add a treatment for whatever testing finds (an iron filter, RO at the kitchen sink for nitrate or arsenic).</p>'),
              acc('land catch', 'Rain', 'Rain to drinking water', '<p>First flush → screened, dark cistern → floating intake (draws from just under the surface, above settled sediment) → sediment → carbon → UV. Test before trusting it.</p>'),
              acc('land nohome', 'Low-tech', 'Slow sand and biosand filters', '<p>Water trickles through fine sand; a living layer on top (the “schmutzdecke”) eats germs. Buildable from a barrel, gravel and sand, no power. Removes most germs and cloudiness, not chemicals. Takes a few weeks to mature.</p>' + old('Sand, charcoal, settling and sunlight are some of the oldest water tools people have.')),
              acc('land invest dry', 'Land', 'Feeding the aquifer', '<p>The longest-term system: help rain sink in instead of running off. Swales, rain gardens, mulch and less pavement recharge the groundwater that wells and springs draw from, for everyone downhill too.</p>' + links('Gardening · Weather · Death &amp; seasons'))
            ); } },
          { id: 'crisis', short: 'Crisis', title: 'Crisis: boil, bleach, sun', html: function () { return '<p>These keep people alive for days when the usual systems stop. They aren’t meant to be how we drink every day.</p>' +
            '<ol><li><b>Settle:</b> let cloudy water sit, pour off the clearer top.</li><li><b>Strain:</b> through clean cloth, a coffee filter or paper towel.</li><li><b>Boil:</b> a full rolling boil kills germs. Many people keep it boiling for 1 minute to be sure (3 minutes at high altitude).</li></ol>' +
            '<p>Boiling won’t remove fuel, chemicals, metals or algae toxins. If a source may have those, choose another one.</p>' +
            old('Boiling water into tea, soup and broth made doubtful water safe long before anyone knew about germs.') +
            accs(
              acc('nohome', 'Can’t boil', 'The actual bleach situation',
                '<div class="wa-cols"><div class="wa-note"><b>What it does</b>' + ul(['Kills most bacteria and viruses in clear water.', 'Plain, unscented bleach only (about 6–8%). No scented, splash-less or color-safe.', 'Stir, wait 30 minutes. A slight chlorine smell means it worked. No smell? Repeat, wait 15 more.']) + '</div>' +
                '<div class="wa-note"><b>What it doesn’t</b>' + ul(['Doesn’t reliably kill Cryptosporidium. Boiling does.', 'Doesn’t remove lead, nitrate, fuel or PFAS.', 'With muddy or leafy water it forms by-products. Settle and strain first.', 'Loses strength over months: date the bottle, replace yearly.']) + '</div>' +
                '<div class="wa-note"><b>Why it’s for crises</b><p>Dosing jugs by hand every day is guesswork on strength, timing and by-products. For everyday life, tap or a matched filter is gentler and tastier.</p><p><b>Safety:</b> keep bleach away from ammonia and vinegar. Mixed, they release toxic gas.</p></div></div>' +
                '<div class="wa-tool"><b class="wa-tool-t">Bleach drops</b><div class="wa-row">' +
                '<label class="wa-f">Water<select data-wa="bleach" id="wa-gal"><option value="1">1 gallon</option><option value="2">2 gallons</option><option value="4">4 gallons</option><option value="8">8 gallons</option></select></label>' +
                '<label class="wa-f">Strength<select data-wa="bleach" id="wa-str"><option value="6">6% (most common)</option><option value="8.25">8.25%</option></select></label>' +
                '<label class="wa-chk"><input type="checkbox" data-wa="bleach" id="wa-cloudy"> Cloudy or very cold</label></div>' +
                '<div class="wa-out" id="wa-bleach-out" aria-live="polite"></div></div>'),
              acc('nohome', 'Free', 'Sunlight as a tool (SODIS)', '<p>Clear water in a clear plastic bottle (2 L or smaller), lying in full sun for about 6 hours (2 days if cloudy), is disinfected by UV. The flip side of ' + a('storage/algae', '3.3') + ': a short trip in the sun cleans; a long stay grows algae.</p>'),
              acc('crisis', 'Notices', 'During a boil-water notice', '<p>Use boiled or bottled water for drinking, brushing teeth, ice, baby bottles and washing produce. Showering is fine; keep it out of your mouth. When it lifts, run taps for a few minutes, empty the ice maker and change fridge and pitcher filters.</p>')
            ) + links('Emergency prep · First aid · Cleaning'); } },
          { id: 'nohome', short: 'No fixed home', title: 'With no fixed home', html: function () { return kind('Being unhoused makes all of this much harder: more carrying, more asking, fewer places to wash and store. These are real options, cheapest first.') +
            ul(['<b>Free:</b> refill points (' + a('sources/taps', '2.2') + '), SODIS with clear bottles, rinsing bottles with hot water and soap at a library or day center.', '<b>A few dollars:</b> a small dropper bottle of plain bleach (date it).', '<b>Around $10–40:</b> a squeeze hollow-fiber filter for bacteria and parasites. Buy this one new (a used one can’t be checked for cracks, and boiling or freezing damages it); keep it from freezing.', '<b>Tablets:</b> chlorine dioxide tablets are light and handle Cryptosporidium too, with a longer wait (check the label, up to 4 hours).', '<b>Heat:</b> drink before you’re thirsty; shade and a slow pace stretch water further.']) +
            links('First aid · Body care'); } }
        ] },

      { id: 'testing', num: 5, word: 'Testing', sub: 'Knowing it’s safe',
        lede: 'Your senses and surroundings catch a lot; the serious problems are often invisible. Testing turns worry into a clear picture, and much of it is free.',
        subs: [
          { id: 'safe', short: 'Safe', title: 'What “safe” means', html: function () { return ul(['<b>Germs:</b> bacteria, viruses, parasites. Invisible; mostly from animal or human waste. Act fast (hours to days).', '<b>Chemicals and metals:</b> lead, nitrate, arsenic, pesticides, PFAS. Invisible, often tasteless; they add up over years.', '<b>Nuisances:</b> chlorine taste, cloudiness, scale, smells. Easy to notice, usually harmless.']) +
            home('Sparkling stream water can carry Giardia; cloudy tap water after a repair is often just air bubbles that clear from the bottom up.'); } },
          { id: 'signs', short: 'Signs', title: 'Reading the signs around you', html: function () { return table(['You notice', 'Often means'], [
              ['Rotten-egg smell', 'Hydrogen sulfide, or bacteria in a water heater or well'], ['Orange or red stains', 'Iron'], ['Blue-green stains', 'Copper from corroding pipes'], ['Metallic taste', 'Metals from pipes; worth a lead test'],
              ['Fuel or chemical smell', 'Contamination. Stop drinking it and report it'], ['Mayfly, stonefly or caddisfly larvae under creek stones', 'Clean, well-oxygenated water (they’re sensitive to pollution)'],
              ['Only worms, leeches and slime', 'Polluted or low-oxygen water'], ['Fields, feedlots, mines or factories upstream', 'Possible chemicals no sense can detect: test or choose another source']]) +
            '<p><b>Watch what animals drink.</b> Many animals smell far better than we do, so an animal who sniffs a source and walks away may be telling you something. It’s a clue, not a test: animals will drink polluted water when it’s all they have, so tracks at the edge don’t prove it’s clean.</p>' +
            home('If an animal you live with refuses the tap or a new source but drinks happily from filtered or bottled water, follow their lead. It may only be chlorine, but switch for now and test (' + a('testing/kits', '5.4') + ').') +
            tryit('Turn over a few stones in a creek with a child and count the little creatures clinging to them. That’s a real field test.') + links('Identification · <a href="#lens-relationships/special/captive">Relationships: Captive animals</a> (reading their signals)'); } },
          { id: 'report', short: 'Reports &amp; maps', title: 'Water reports and maps', html: function () { return '<p>Every public water system publishes a yearly report of what it found. Search your water provider’s name + “water quality report.” Each line shows the <b>legal limit</b> and the <b>health goal</b>. Goals are set on health alone and are often stricter (for lead, the goal is zero), so compare to those.</p>' +
            '<p>Maps go further: they show where water is, and what’s been found in it, across a whole region.</p>' +
            '<div class="wa-cols"><div class="wa-note"><b>Where water is</b>' + ul(['Reservoir and snowpack levels (the state’s CDEC data exchange).', 'The US Drought Monitor, updated weekly.', 'Groundwater basins and how stressed they are (the state’s SGMA portal).']) + '</div>' +
            '<div class="wa-note"><b>What’s in it</b>' + ul(['The SAFER drinking water dashboard: which water systems are failing or at risk.', 'Drinking Water Watch: each public system’s test results and violations.', 'GAMA: groundwater test results, including some private wells.', 'CalEnviroScreen: drinking-water contaminant scores by neighborhood.', 'The harmful algal bloom map for lakes and rivers.']) + '</div>' +
            '<div class="wa-note"><b>Who tested it</b>' + ul(['Public water systems, on required schedules, through state-certified labs.', 'Researchers and state programs (GAMA), for groundwater.', 'Counties, for beaches.', 'Well owners themselves, for private wells.', 'Nonprofits like the EWG Tap Water Database compare the same results to stricter health guidelines.']) + '</div></div>' +
            table(['Maps show', 'Maps don’t show'], [
              ['Results from sampling points in a system', 'Your building’s pipes: lead usually comes from the last stretch'],
              ['Contaminants on the testing list', 'Anything not tested for. “No data” isn’t “clean”'],
              ['Averages, often over a year', 'Short spikes between tests'],
              ['Public water systems', 'Most private wells and very small systems (under 15 connections)']]) +
            '<p><b>What to look for:</b> your system’s name, any violations or “at-risk” status, anything near or above a health goal (not just the legal limit), nitrate, arsenic or uranium in groundwater areas, how recent the data is, and what sits upstream or nearby: farms, feedlots, mines, factories.</p>' +
            ca('The State Water Board runs SAFER, Drinking Water Watch and GAMA, and utilities publish lead service line maps; ask your provider about yours.') +
            tryit('Find your water system on Drinking Water Watch and the SAFER map, then compare with your yearly report. Circle anything above its health goal and bring it to ' + a('purify/match', '4.1') + '.') +
            links('<a href="#lens-governance">Governance</a>: who decides, and how to ask'); } },
          { id: 'kits', short: 'Kits &amp; labs', title: 'Kits and labs', html: function () { return ul(['<b>TDS meter</b> (a few dollars): dissolved minerals. Good for checking an RO filter; it can’t see germs, lead or PFAS.', '<b>Test strips:</b> rough reads for hardness, pH, chlorine, nitrate. Good for spotting changes.', '<b>Certified lab:</b> the real answer for bacteria, lead, arsenic, PFAS. Ask your water provider or county first: many offer free or discounted kits.']) +
            ca('Look for labs accredited by the state’s ELAP program.') +
            accs(
              acc('well land', 'Wells', 'A yearly testing rhythm', '<p>Coliform bacteria and nitrate every year; arsenic, uranium and others every few years; again after floods, repairs or a change in taste.</p>'),
              acc('oldpipes portable kids', 'Older buildings', 'A first-draw lead test', '<p>Test water that sat in the pipes overnight. Lead matters most for children and pregnancy. Share results with neighbors in the building: one test can help everyone.</p>')
            ); } },
          { id: 'outdoors', short: 'Outdoors', title: 'Swimming and bathing outdoors', html: function () { return '<p>Rivers, lakes and the sea can be lovely places to wash and swim. A few checks keep it that way.</p>' +
            ul(['Skip it for 2–3 days after heavy rain, when sewage and street runoff wash in.', 'Skip water with scum, foam, oily sheen, dead fish or a chemical smell. When in doubt, stay out, and keep dogs out too.', 'Stay away from pipes, storm drains and industrial, farm or mining runoff.', 'Don’t swallow, cover cuts, rinse off afterwards.']) +
            ca('Heal the Bay’s Beach Report Card grades the coast weekly; the state’s harmful algal bloom map covers lakes and rivers.') +
            accs(
              acc('nohome land', 'Warm water', 'Hot springs and warm lakes', '<p>Warm fresh water can rarely carry an amoeba (Naegleria fowleri) that is dangerous if it goes up the nose. Keep your head above water or use a nose clip. Same reason to use boiled or distilled water, never plain tap, in a neti pot.</p>'),
              acc('land well', 'Clues', 'Reading fish advisories', '<p>A “don’t eat the fish” advisory points to mercury, PCBs or other chemicals in the water. Those mostly matter for eating fish, but they’re a signal to choose another spot for regular bathing and never to drink from it, even filtered.</p>')
            ) + links(a('sources/wild', '2.5 Rivers, lakes and the wild') + ' · Animal care'); } }
        ] },

      { id: 'costs', num: 6, word: 'Costs', sub: 'The household math',
        lede: 'Households already do this math in their heads at the store. Here it is on paper: what water costs in each form, what your household spends, and when an upgrade pays for itself.',
        subs: [
          { id: 'prices', short: 'Prices', title: 'What water costs', html: function () {
            var zip = prof().address;
            return '<p>The same gallon can cost a fraction of a cent or several dollars depending on how it reaches you. Enter prices you actually see' + (zip ? ' around <b>' + esc(zip) + '</b>' : '') + '; the examples are placeholders.</p>' +
            '<div class="wa-tool"><b class="wa-tool-t">Price per gallon</b><div class="wa-prices">' +
            priceRow('tap', 'Tap water', 'per billing unit (748 gal)', 15, 'Find “per unit” or “per CCF” on your bill; add the sewer rate if it’s charged per unit too.') +
            priceRow('case', 'Case of bottles', 'per case of 24 × 16.9 oz', 6) +
            priceRow('jug', 'Gallon jug', 'per gallon jug', 1.75) +
            priceRow('refill', 'Refill machine', 'per gallon, your own jug', 0.5) +
            priceRow('deliv', 'Delivered 5-gallon jug', 'per jug', 10) +
            '</div><div class="wa-out" id="wa-price-out" aria-live="polite"></div>' +
            '<p class="wa-legend">Local price lookups by ZIP code are planned. Until then, these stay as you type them.</p></div>'; } },
          { id: 'math', short: 'Your math', title: 'Your household math', html: function () { return '<p>Drinking and cooking water is the part most households buy or filter. Multiply by the price of each form:</p>' +
            '<div class="wa-tool"><b class="wa-tool-t">Monthly and yearly cost</b><div class="wa-row">' +
            '<label class="wa-f">People<input type="number" data-wa="cost" id="wa-cppl" min="1" value="' + people() + '"></label>' +
            '<label class="wa-f">Gallons each per day<input type="number" data-wa="cost" id="wa-cgal" min="0.25" step="0.25" value="1"></label></div>' +
            '<div class="wa-out" id="wa-math-out" aria-live="polite"></div></div>'; } },
          { id: 'onetime', short: 'One-time vs ongoing', title: 'One-time vs ongoing', html: function () { return '<p>A filter costs money once, then a little every year. Bottles cost money every week, forever. Compare the two:</p>' +
            '<div class="wa-tool"><b class="wa-tool-t">When does it pay for itself?</b><div class="wa-row">' +
            '<label class="wa-f">Instead of<select data-wa="cost" id="wa-from"><option value="case">Cases of bottles</option><option value="jug">Gallon jugs</option><option value="deliv">Delivered jugs</option><option value="refill">Refill machine</option></select></label>' +
            '<label class="wa-f">Filter upfront ($)<input type="number" data-wa="cost" id="wa-up" min="0" value="300"></label>' +
            '<label class="wa-f">Cartridges per year ($)<input type="number" data-wa="cost" id="wa-yr" min="0" value="80"></label></div>' +
            '<div class="wa-out" id="wa-pay-out" aria-live="polite"></div></div>' +
            '<p>Secondhand bodies with new cartridges cut the upfront number a lot (' + a('purify/everyday', '4.2') + '). The <a href="#plans/budget">Improvements &amp; budget plan</a> will add every need together, before and after each improvement.</p>'; } },
          { id: 'poverty', short: 'Expensive being poor', title: 'It’s expensive being poor', html: function () { return '<p>Small sizes cost the most per gallon. A filter costs more today and much less every month after, so without the upfront money, people keep paying the higher price. No storage space means no bulk buying. None of that is a personal failing; it’s how the prices are built.</p>' +
            ul(['Refill machines with your own jugs usually beat bottles by a wide margin.', 'Secondhand filter bodies with new cartridges lower the upfront cost.', 'Many California water utilities offer low-income discounts on water and sewer bills: ask yours.', 'Buying or borrowing together (next) spreads the upfront cost.']); } },
          { id: 'sharing', short: 'Sharing', title: 'Sharing the cost', html: function () { return ul(['<b>Split a lab test</b> with neighbors on the same pipes or well. One result helps the whole building.', '<b>One filter, several households:</b> a countertop unit in a shared kitchen, or filtered water offered next door.', '<b>Buy together:</b> cartridges, barrels and test kits cost less in bulk.', '<b>Ask together:</b> a building-wide request to the owner or utility carries more weight than one.']) +
            links('<a href="#lens-relationships/neighbors">Neighbors</a> · <a href="#plans/budget">Improvements &amp; budget plan</a>'); } }
        ] }
    ];
  }

  function people() {
    var p = prof(), n = (Number(p.adults) || 0) + (Number(p.kids) || 0);
    return n > 0 ? n : 2;
  }
  function priceRow(id, name, unit, val, hint) {
    return '<label class="wa-price"><span><b>' + name + '</b><small>' + unit + (hint ? '. ' + hint : '') + '</small></span>' +
      '<span class="wa-money">$<input type="number" data-wa="cost" id="wa-p-' + id + '" min="0" step="0.01" value="' + val + '"></span></label>';
  }

  /* ---------- tools ---------- */
  var DOSE = { '6': { 1: '8 drops', 2: '16 drops (¼ tsp)', 4: '⅓ tsp', 8: '⅔ tsp' }, '8.25': { 1: '6 drops', 2: '12 drops (⅛ tsp)', 4: '¼ tsp', 8: '½ tsp' } };
  var FILT = {
    taste: ['Open pitcher in the fridge overnight (free, chlorine only)', 'Carbon pitcher or faucet filter, NSF 42', 'Chloramine in your report? Carbon handles it'],
    lead: ['Flush, cook with cold, clean the aerator (free)', 'Carbon filter certified NSF 53 for lead', 'Countertop reverse osmosis, NSF 58'],
    microbes: ['Rolling boil (free)', 'Hollow-fiber or ceramic filter', 'UV for clear well water; bleach in a crisis'],
    nitrate: ['Boiling concentrates nitrate, so skip it', 'Reverse osmosis, NSF 58', 'Wells: test yearly'],
    pfas: ['Check your water report first (free)', 'Carbon certified for PFOA/PFOS (NSF 53 or 401)', 'Reverse osmosis, NSF 58'],
    hard: ['Safe to drink: it’s calcium and magnesium', 'Vinegar soak for kettles and showerheads (free)', 'A softener only if scale is damaging pipes']
  };
  var PRICE_NAMES = { tap: 'Tap water', case: 'Cases of bottles', jug: 'Gallon jugs', refill: 'Refill machine', deliv: 'Delivered jugs' };
  /* Remember typed prices in this browser so the math follows you between pages. */
  var PKEY = 'meeting-needs.water.prices.v1', saved = {};
  try { saved = JSON.parse(localStorage.getItem(PKEY) || '{}') || {}; } catch (e) { saved = {}; }
  function $(id) { return document.getElementById(id); }
  function num(id, d) { var el = $(id); var v = el ? parseFloat(el.value) : NaN; return isNaN(v) ? d : v; }
  function money(v) { return v < 0.1 ? (v * 100).toFixed(v < 0.01 ? 2 : 1) + '¢' : '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function perGallon() {
    function pr(id, d) { return $('wa-p-' + id) ? num('wa-p-' + id, d) : (saved[id] != null ? saved[id] : d); }
    return { tap: pr('tap', 15) / 748, case: pr('case', 6) / (24 * 16.9 / 128), jug: pr('jug', 1.75), refill: pr('refill', 0.5), deliv: pr('deliv', 10) / 5 };
  }
  function runTools() {
    if ($('wa-store-out')) {
      var p = Math.max(1, num('wa-ppl', 2)), d = num('wa-days', 14), l = num('wa-lvl', 1), h = $('wa-hot').checked ? 2 : 1, g = p * d * l * h;
      $('wa-store-out').innerHTML = '<strong>' + g + ' gallons</strong>About ' + Math.ceil(g / 5) + ' five-gallon jugs. A few a month gets you there.<small>' + p + ' people × ' + d + ' days × ' + l + ' gal' + (h > 1 ? ' × 2 for heat or extra needs' : '') + '. Add water for animals.</small>';
    }
    if ($('wa-bleach-out')) {
      var dose = DOSE[$('wa-str').value][$('wa-gal').value], dbl = $('wa-cloudy').checked;
      $('wa-bleach-out').innerHTML = '<strong>' + dose + (dbl ? ', doubled' : '') + '</strong>Stir, wait 30 minutes; a slight chlorine smell means it’s ready.<small>' + (dbl ? 'Settle and strain cloudy water first. ' : '') + 'About 2 drops of 6% bleach per liter, the dose used in household guidance worldwide.</small>';
    }
    if ($('wa-filt-out')) {
      $('wa-filt-out').innerHTML = '<ol>' + FILT[$('wa-worry').value].map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol><small>Secondhand where you can, with new cartridges (4.2).</small>';
    }
    ['tap', 'case', 'jug', 'refill', 'deliv'].forEach(function (k) { if ($('wa-p-' + k)) saved[k] = num('wa-p-' + k, 0); });
    try { localStorage.setItem(PKEY, JSON.stringify(saved)); } catch (e) { /* storage blocked */ }
    var pg = perGallon();
    if ($('wa-price-out')) {
      $('wa-price-out').innerHTML = '<div class="wa-bars">' + Object.keys(PRICE_NAMES).map(function (k) {
        var x = pg[k] / Math.max(pg.case, pg.jug, pg.deliv, pg.refill, pg.tap);
        return '<div class="wa-bar"><span>' + PRICE_NAMES[k] + '</span><i style="width:' + Math.max(1, x * 100).toFixed(1) + '%"></i><b>' + money(pg[k]) + '/gal</b></div>';
      }).join('') + '</div><small>Bottled in cases costs about ' + Math.round(pg.case / pg.tap).toLocaleString() + '× the same gallon from the tap.</small>';
    }
    var gpd = Math.max(1, num('wa-cppl', people())) * Math.max(0, num('wa-cgal', 1)), month = gpd * 30.4;
    if ($('wa-math-out')) {
      $('wa-math-out').innerHTML = '<p class="wa-mathhead"><b>' + Math.round(month) + ' gallons a month</b> for drinking and cooking</p>' + '<div class="wa-tbl"><table><thead><tr><th>Form</th><th>Per month</th><th>Per year</th></tr></thead><tbody>' +
        Object.keys(PRICE_NAMES).map(function (k) { return '<tr><td>' + PRICE_NAMES[k] + '</td><td>' + money(pg[k] * month) + '</td><td>' + money(pg[k] * month * 12) + '</td></tr>'; }).join('') + '</tbody></table></div>';
    }
    if ($('wa-pay-out')) {
      var from = pg[$('wa-from').value] * month, filt = num('wa-yr', 80) / 12 + pg.tap * month, save = from - filt, up = num('wa-up', 300);
      $('wa-pay-out').innerHTML = save > 0
        ? '<strong>Pays for itself in about ' + Math.max(1, Math.ceil(up / save)) + ' months</strong>Then saves about ' + money(save * 12) + ' a year.<small>Now: ' + money(from) + '/month. With the filter: ' + money(filt) + '/month (cartridges plus tap water).</small>'
        : '<strong>Doesn’t pay back on cost alone</strong>Your current option is already about as cheap per month. Health, taste and fewer bottles may still make it worth it.';
    }
  }
  document.addEventListener('input', function (e) { if (e.target.closest && e.target.closest('[data-wa]')) runTools(); });
  document.addEventListener('change', function (e) { if (e.target.closest && e.target.closest('[data-wa]')) runTools(); });

  /* ---------- profile panel: what's on file, and where to change it ---------- */
  function onFile() {
    var p = prof(), O = mn().options || {}, src = p.sources || {}, rows = [];
    var srcs = (O.sources || []).filter(function (o) { return src[o.id]; }).map(function (o) { return o.single ? o.label : o.label + ' (' + src[o.id].toLowerCase() + ')'; });
    if (srcs.length) rows.push(['Water sources', srcs.join(', ')]);
    if ((p.filters || []).length) rows.push(['Filters you have', p.filters.join(', ')]);
    if (p.pipes) rows.push(['Pipes', p.pipes]);
    if (p.rain) rows.push(['Rain or snow', p.rain]);
    var place = [p.home, p.stay, p.shape].filter(Boolean);
    if (place.length) rows.push(['Place', place.join(' · ')]);
    return rows;
  }
  function panel() {
    var rows = onFile();
    if (!rows.length) {
      return '<div class="wa-sit"><span class="eyebrow">Tailor this course</span><p>A few questions in your Profile’s Water section open the parts that fit your life. Everything here stays open to everyone.</p><a class="btn personal sm" href="#profile/water">Answer in Profile</a></div>';
    }
    return '<div class="wa-sit"><span class="eyebrow">Tailored to your profile</span><p>Sections for you are open and marked <span class="wa-foryou">For you</span>.</p>' +
      '<span class="wa-review"><a href="#profile/water" aria-describedby="wa-onfile">Review your profile’s water subsection</a>' +
      '<span class="wa-pop" id="wa-onfile" role="tooltip"><span class="eyebrow">On file</span>' + rows.map(function (r) { return '<span class="wa-pop-row"><b>' + esc(r[0]) + '</b>' + esc(r[1]) + '</span>'; }).join('') +
      '<span class="wa-pop-foot">Changed something, like a new safe tap? Update it in your Profile.</span></span></span></div>';
  }

  /* ---------- layout ---------- */
  function sidebar(U, cur) {
    var wide = window.matchMedia && window.matchMedia('(min-width: 900px)').matches;
    return '<nav class="wa-nav" aria-label="Water course"><details class="wa-nav-wrap"' + (wide ? ' open' : '') + '><summary class="wa-nav-head"><span class="eyebrow">Course map</span><b>Water</b></summary>' +
      '<a class="wa-nav-over" href="' + BASE + '"' + (!cur ? ' aria-current="page"' : '') + '>Overview</a><ol class="wa-vt">' +
      U.map(function (u) {
        var on = cur === u.id;
        return '<li class="wa-vt-unit wk' + u.num + (on ? ' cur' : '') + '"><a class="wa-vt-head" href="' + BASE + '/' + u.id + '"' + (on ? ' aria-current="page"' : '') + '><span class="wa-vt-dot">' + u.num + '</span><span><b>' + u.word + '</b><small>' + u.sub + '</small></span></a>' +
          '<ul class="wa-vt-subs">' + u.subs.map(function (s) { return '<li><a href="' + BASE + '/' + u.id + '/' + s.id + '">' + s.title + '</a></li>'; }).join('') + '</ul></li>';
      }).join('') + '</ol></details></nav>';
  }
  function layout(U, cur, main) {
    return mn().header('home') + '<div class="wa-layout">' + sidebar(U, cur) + '<main class="wa-main">' + panel() + main + '</main></div>' + mn().footer();
  }

  function viewOverview(U) {
    return '<section class="wa-hero"><span class="wa-lens-pill">Tier 2 · Roots · Course</span><h1 tabindex="-1">Water</h1>' +
      '<p class="wa-lede">Every body needs water, and people have met that need for as long as there have been people. Six short units on how we use it, where it comes from, how to keep it, clean it, know it’s safe and pay for it, at every scale: a studio, a farm, a car, a sidewalk.</p></section>' +
      '<ol class="wa-ucards">' + U.map(function (u) {
        return '<li><a class="wa-ucard wk' + u.num + '" href="' + BASE + '/' + u.id + '"><i class="wa-band"></i><span class="wa-n">0' + u.num + '</span><b>' + u.word + '</b><span>' + u.sub + '</span><ol>' + u.subs.map(function (s) { return '<li>' + s.title + '</li>'; }).join('') + '</ol></a></li>';
      }).join('') + '</ol>' +
      '<aside class="wa-funfact"><span class="eyebrow">Fun fact</span><p>This course leans on three kinds of knowing, checked against each other: old practice that kept people alive for thousands of years, international guidance (the World Health Organization’s drinking-water guidelines and the Sphere humanitarian handbook), and what you can see, smell and test yourself. Legal limits come from politics as well as science, and they change, so we use them as one input, not the last word. Laws mentioned are California’s; water itself is the same everywhere. Thank you to everyone who keeps this knowledge free.</p></aside>';
  }
  function viewUnit(U, u, subId) {
    var i = U.indexOf(u), prev = U[i - 1], next = U[i + 1];
    var html = '<article class="wa-unit wk' + u.num + '">' +
      '<header class="wa-unit-hero"><span class="eyebrow">Unit ' + u.num + ' of ' + U.length + '</span><h1 tabindex="-1">' + u.word + '</h1><p class="wa-unit-sub">' + u.sub + '</p><p class="wa-lede">' + u.lede + '</p>' +
      '<ul class="wa-jumps">' + u.subs.map(function (s, j) { return '<li><a href="' + BASE + '/' + u.id + '/' + s.id + '"><span>' + u.num + '.' + (j + 1) + '</span>' + s.short + '</a></li>'; }).join('') + '</ul></header>' +
      u.subs.map(function (s, j) { return '<section class="wa-sub" id="wa-' + u.id + '-' + s.id + '"><div class="wa-sub-top"><span class="wa-sub-n">' + u.num + '.' + (j + 1) + '</span><h2>' + s.title + '</h2></div>' + s.html() + '</section>'; }).join('') +
      (u.take ? '<section class="wa-sub wa-take" id="wa-' + u.id + '-take">' + u.take() + '</section>' : '') +
      '</article><nav class="wa-pager" aria-label="Units">' +
      (prev ? '<a href="' + BASE + '/' + prev.id + '"><small>← Previous</small><b>' + prev.num + ' · ' + prev.word + '</b></a>' : '<a href="' + BASE + '"><small>← Back to</small><b>Overview</b></a>') +
      (next ? '<a class="next" href="' + BASE + '/' + next.id + '"><small>Next unit →</small><b>' + next.num + ' · ' + next.word + '</b></a>' : '<a class="next" href="#plans/budget"><small>Next →</small><b>Improvements &amp; budget plan</b></a>') +
      '</nav>';
    setTimeout(function () {
      runTools();
      var el = subId && document.getElementById('wa-' + u.id + '-' + subId);
      if (el) { if (subId === 'take') el.querySelectorAll('details').forEach(function (d) { d.open = true; }); el.scrollIntoView({ block: 'start' }); }
    }, 0);
    return html;
  }

  window.MN_LENS_VIEWS = window.MN_LENS_VIEWS || {};
  window.MN_LENS_VIEWS.water = function (sub) {
    T = tags();
    var U = units(), seg = (sub || '').split('/');
    if (seg[0] === 'cows') seg = ['sources', 'take']; /* old link: farm water now sits at the end of Sources */
    var u = U.filter(function (x) { return x.id === seg[0]; })[0];
    if (u) return { title: u.word + ' · Water · Kinship', html: layout(U, u.id, viewUnit(U, u, seg[1])) };
    return { title: 'Water · Kinship', html: layout(U, null, viewOverview(U)) };
  };
})();
