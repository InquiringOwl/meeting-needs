/* Food lens: course content, profile tailoring and tools. Registers window.MN_LENS_VIEWS.food.
   Routes: #lens-food (overview) · #lens-food/<unit>[/<sub>]. Units are dark greens, darkest (1) to lightest (7).
   Tailoring: answers from the Profile (Place, Food, Household) become tags; accordions tagged data-for open with a "For you" badge.
   The "Power's out" switch is per visit and not saved. Every section stays available to everyone.
   Every recipe here is plant-based (FOUNDATION.md section 4). Unit 7 describes what other species eat in nature, plainly, and offers complete plant-based foods as one option. Laws mentioned are California's; the practices are general. */
(function () {
  var BASE = '#lens-food';
  function mn() { return window.MN; }
  function esc(s) { return mn().esc(s); }
  function prof() { return (mn().profile && mn().profile()) || {}; }

  /* ---------- profile → tags ---------- */
  function tags() {
    var p = prof(), t = {}, space = p.space || [];
    if (p.home === 'Shelter or no fixed place' || p.stay === 'No fixed place right now') t.nohome = 1;
    var rooted = p.stay === 'A few years' || p.stay === 'Long-term, putting down roots';
    var canShape = p.shape === 'Bigger changes, with an owner who’s on board' || p.shape === 'It’s ours to shape';
    if (rooted && canShape) t.invest = 1;
    else if (p.shape || p.stay === 'Under a year' || p.home === 'Vehicle or boat' || p.home === 'Apartment or room') t.portable = 1;
    if (space.indexOf('Acreage or farmland') !== -1) { t.land = 1; t.outdoor = 1; }
    if (p.home === 'House' || space.some(function (s) { return /Balcony|yard|plot/i.test(s); })) t.outdoor = 1;
    if (p.kitchen === 'A hot plate, rice cooker or microwave') t.smallkit = 1;
    if (p.kitchen === 'A shared kitchen') t.shared = 1;
    if (p.kitchen === 'No way to cook right now') t.nocook = 1;
    if (p.cold === 'A small or shared fridge') t.smallcold = 1;
    if (p.cold === 'A cooler, or no fridge') t.nocold = 1;
    var pets = String(p.pets || '');
    if (/cat|kitten/i.test(pets)) t.cat = 1;
    if (/dog|pupp/i.test(pets)) t.dog = 1;
    if (/rabbit|bunn|guinea|rat|mouse|mice|hamster|bird|parrot|tortoise|turtle|fish/i.test(pets)) t.small = 1;
    if (Number(p.kids) > 0 || (p.consider || []).some(function (c) { return /Pregnancy|Babies/.test(c); })) t.kids = 1;
    return t;
  }
  var T = {};

  /* ---------- small builders ---------- */
  function acc(forTags, who, title, body) {
    var hit = forTags.split(' ').some(function (k) { return T[k]; });
    return '<details class="fo-acc' + (hit ? ' match' : '') + '" data-for="' + forTags + '"' + (hit ? ' open' : '') + '>' +
      '<summary><span class="fo-who">' + who + '</span><span class="fo-acc-t">' + title + '</span><span class="fo-foryou">For you</span></summary>' +
      '<div class="fo-in">' + body + '</div></details>';
  }
  function accs() { return '<div class="fo-accs">' + Array.prototype.join.call(arguments, '') + '</div>'; }
  function box(kind, html) { return '<p class="fo-box fo-' + kind + '">' + html + '</p>'; }
  function old(h) { return box('old', h); }
  function ca(h) { return box('ca', h); }
  function home(h) { return box('home', h); }
  function tryit(h) { return box('do', h); }
  function care(h) { return box('care', h); }
  function together(h) { return box('together', h); }
  function kind(h) { return '<p class="fo-kind">' + h + '</p>'; }
  function links(h) { return '<p class="fo-links">' + h + '</p>'; }
  function note(title, html) { return '<div class="fo-note"><b>' + title + '</b>' + html + '</div>'; }
  function ul(items) { return '<ul>' + items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>'; }
  function ol(items) { return '<ol>' + items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ol>'; }
  function a(path, text) { return '<a href="' + BASE + '/' + path + '">' + text + '</a>'; }
  function table(head, rows) {
    return '<div class="fo-tbl"><table><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { var m = /^\[(y|p|n)\](.*)$/.exec(c); return m ? '<td class="' + m[1] + '">' + m[2] + '</td>' : '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody></table></div>';
  }
  function rungs(list) { return '<div class="fo-ladder">' + list.map(function (r, i) { return '<div class="fo-rung fo-r' + (i + 1) + '"><small>' + r[0] + '</small><b>' + r[1] + '</b><p>' + r[2] + '</p></div>'; }).join('') + '</div>'; }
  function opts(map) { return Object.keys(map).map(function (k) { return '<option value="' + k + '">' + map[k][0] + '</option>'; }).join(''); }

  /* ---------- course content ---------- */
  function units() {
    return [
      { id: 'gather', num: 1, word: 'Gather', sub: 'Where food comes from',
        lede: 'Food reaches us from shops, gardens, neighbors, food banks and the wild. Knowing all the ways in means more than one strategy for the same need, so a hard week has options.',
        subs: [
          { id: 'sources', short: 'Sources', title: 'Know your food sources', html: function () { return table(['Source', 'Good for', 'Costs'], [
              ['Shops and markets', 'Everything, any day', '[p]Money'],
              ['Co-ops and buying clubs', 'Bulk beans, grains, oil, spices', '[p]Money, less of it'],
              ['Food banks and pantries', 'Staples, produce, canned food', '[y]Free'],
              ['Shared meals and community fridges', 'A meal today, company', '[y]Free'],
              ['Gardens', 'Greens, herbs, fruit, squash, beans', '[p]Time, water, seeds'],
              ['Gleaning and foraging', 'Fruit, greens, nuts in season', '[y]Time and knowledge']]) +
            old('Most households once had several food sources at once: a garden, a market, neighbors to trade with, a wild patch to forage. Leaning on one store is quite new.') +
            tryit('List every place food came from this month. Circle one you’d like to add.'); } },
          { id: 'free', short: 'Free food', title: 'Free and shared food', html: function () { return '<p>Free food is a strategy like any other, and using it frees money for other needs. Food banks often have more than they can give out, especially fresh produce.</p>' +
            ul(['Calling or texting <b>211</b> finds local food banks, pantries and free meals.', 'Community fridges (“free fridges”): take what you need, leave what you can.', 'Food Not Bombs groups share free vegetarian or vegan meals in many cities.']) +
            ca('CalFresh (California’s name for SNAP) puts money for food on a card; many farmers’ markets match it through <b>Market Match</b>. All public school students can get free breakfast and lunch under the state’s universal school meals program.') +
            accs(
              acc('nohome', 'No fixed home', 'Food without a kitchen', kind('Without a home, food takes far more time and planning, because most food systems assume a kitchen and a fridge of your own. That’s a gap in how things are built, not a personal failing.') +
                ul(['Shelters, day centers and churches often serve hot meals; 211 has the times.', 'Ask pantries for “no-cook” or “ready-to-eat” bags: many keep them.', 'Food that keeps without cold: nut butter, crackers, bread, whole fruit, canned beans with pull-tab lids, oats for cold soaking (' + a('cook/little', '4.2') + ').'])),
              acc('kids', 'With kids', 'Food for children', ul(['WIC helps pregnant people, babies and children under 5 with food and nutrition support.', 'Many districts run free summer meals for anyone under 18; 211 finds sites.']))) +
            links('<a href="#lens-relationships">Relationships</a> (asking for help) · <a href="#lens-relationships/coops">Cooperatives</a>'); } },
          { id: 'spend', short: 'Spend less', title: 'Stretching what you spend', html: function () { return ul([
              '<b>Dried beans</b> usually cost half or less per serving than canned, and keep for years (' + a('rehydrate', 'Unit 3') + ').',
              '<b>Buy the staples in bulk</b> with friends or a co-op: a 25-lb sack of rice or beans split three ways.',
              '<b>Cook once, eat three times:</b> a big pot of beans becomes soup, tacos and a spread.',
              'Frozen vegetables and fruit are picked ripe, cost less than fresh out of season, and don’t go to waste.']) +
            home('A shared list with two neighbors: who’s buying the oats sack this month, who has the jars.'); } },
          { id: 'grow', short: 'Grow &amp; forage', title: 'Growing and foraging', html: function () { return '<p>Even a windowsill grows herbs and sprouts. More space adds greens, beans, squash and fruit trees. Gleaning, picking what farms and backyard trees leave behind, puts fruit that would rot to use.</p>' +
            care('Only eat a wild plant you can name with certainty, from a clean place (away from roads and sprayed edges). Wild mushrooms need an expert, every time.') +
            ca('Picking plants in state parks is generally not allowed; rules differ on other land. Ask before picking from a tree on someone else’s property; fallen-fruit maps show public trees.') +
            accs(
              acc('portable', 'Portable', 'A windowsill harvest', '<p>Sprouts in a jar (' + a('rehydrate/sprouting', '3.5') + '), herbs in pots, scallions regrowing in a glass of water. Everything moves with you.</p>'),
              acc('outdoor invest', 'Yard', 'Beds and fruit trees', '<p>Greens and beans in spring and fall, squash and tomatoes in summer. Fruit trees are a long gift: plant where you’ll stay.</p>' + links('Gardening · <a href="#lens-water/uses/gray">Water</a> (gray water to trees)')),
              acc('land', 'Land', 'Staple crops', '<p>Dry beans, winter squash, potatoes and grains store for months without power, so a land garden can carry the pantry, not just the salad.</p>')); } },
          { id: 'pass', short: 'Pass it on', title: 'Passing it on', html: function () { return '<p>Too many lemons, half a pot of soup, a sack that’s too big: extra food meets someone else’s need. Neighbors, Buy Nothing groups, community fridges and food banks all take it.</p>' +
            ca('Since 2022, many grocery stores, distributors and large kitchens must donate edible food they’d otherwise throw away to food recovery groups (SB 1383). Federal and state law protect people who donate food in good faith.') +
            together('A fruit-picking afternoon with the kids next door, then a box on the curb with a “free” sign.'); } }
        ] },

      { id: 'cleanse', num: 2, word: 'Cleanse', sub: 'Washing food well',
        lede: 'Clean running water and a bit of rubbing do most of the work. No soap, no bleach, no special sprays.',
        subs: [
          { id: 'why', short: 'Why', title: 'Why we wash', html: function () { return '<p>Washing lifts off soil, germs from the field and many hands, and some of the residue from sprays. It matters most for food eaten raw, and for anything you cut, since a knife carries what’s on the skin into the flesh.</p>' +
            ul(['Wash just before eating or cooking, not before storing: damp produce spoils faster.', 'Wash even if you’ll peel it (melons, oranges, avocados).', 'Bags labelled “pre-washed” or “triple-washed” are ready as they are; rewashing adds more chances for germs from the sink.']) +
            links('<a href="#lens-water/uses/grades">Water 1.2</a> (drinking-grade water for food eaten raw)'); } },
          { id: 'produce', short: 'Produce', title: 'Fruits and vegetables', html: function () { return ul([
              '<b>Firm produce</b> (potatoes, carrots, apples, melons): rinse under running water and scrub with a clean brush.',
              '<b>Soft fruit</b> (berries, tomatoes, peaches): a gentle rinse in a colander, then let them dry.',
              '<b>Mushrooms:</b> a quick rinse or a damp cloth, right before cooking.',
              'Dry with a clean towel: rubbing removes a little more.']) +
            tryit('For less surface residue on apples and other firm fruit: soak 12–15 minutes in 1 tsp baking soda per 2 cups of water, then rinse. A 2017 study found this beat plain water and bleach washes.') +
            old('Many cooks soak produce in vinegar water. It’s pleasant and harmless, though studies find it adds little over plain water.'); } },
          { id: 'greens', short: 'Greens', title: 'Leafy greens and herbs', html: function () { return '<p>Grit hides between leaves. Separate them, drop them into a big bowl of cold water, swish, wait a minute, then <b>lift</b> the greens out so the grit stays at the bottom. Repeat until the bowl is clean.</p>' +
            ul(['Toss the outer leaves of heads of lettuce and cabbage.', 'Spin or roll in a towel: dry greens last longer and hold dressing.']) +
            home('The swishing water is clean enough for houseplants (<a href="#lens-water/uses/grades">Water 1.2</a>, grade 2).') +
            together('Swishing and spinning is perfect work for small hands.'); } },
          { id: 'grains', short: 'Grains &amp; beans', title: 'Grains, beans and rice', html: function () { return ul([
              '<b>Dried beans and lentils:</b> spread on a tray and pick out small stones and shrivelled beans, then rinse.',
              '<b>Quinoa:</b> rinse well in a fine sieve. Its coating (saponins) tastes soapy and bitter.',
              '<b>Rice:</b> rinse until the water runs mostly clear for fluffier rice.']) +
            note('Rice and arsenic', '<p>Rice soaks up more arsenic from soil and water than most grains, brown rice more than white. Cooking it like pasta, in plenty of water (6–10 parts water to 1 rice) and draining, removes about 40–60%. A 2020 University of Sheffield method removed about half from brown rice and nearly three-quarters from white: boil 5 minutes in fresh water, drain, then add fresh water and finish cooking with the lid on.</p>' +
              '<p>Variety helps too: oats, millet, quinoa, barley and buckwheat for some of rice’s meals, especially for babies and toddlers.</p>'); } },
          { id: 'tools', short: 'Hands &amp; tools', title: 'Hands, boards and sponges', html: function () { return ul([
              'Wash hands with soap for about 20 seconds before cooking and after handling soil or raw sprouts.',
              'Hot soapy water for boards and knives. Deep grooves in a board hold germs: sand wood, retire scarred plastic.',
              'Sponges grow germs fast. Let them dry between uses and replace often; cloths that go in the laundry stay cleaner.']) +
            links('Cleaning (surfaces) · Poisons (plastic boards and heat)') +
            accs(acc('nohome nocook', 'No sink', 'Washing food with little water', ul(['Choose food you peel: bananas, oranges, avocados, carrots you can scrape.', 'A bottle of drinking water poured over produce in a bowl does the job.', 'Hand sanitizer is a backup for hands, not a wash for food.']))); } }
        ] },

      { id: 'rehydrate', num: 3, word: 'Rehydrate', sub: 'Waking up dried food',
        lede: 'Dried food is food with the water taken out, so it keeps. Putting the water back, slowly and cleanly, turns a jar of hard beans into dinner.',
        subs: [
          { id: 'dried', short: 'Why dried', title: 'Why dried food', html: function () { return '<p>Germs and molds need water to grow (what molds make, and which moldy food to let go, lives in <a href="#lens-toxins/living/food">Poisons: Mold on food</a>). Take it out and food keeps for months or years with no fridge, weighs a fraction as much, and costs less. Beans, lentils, grains, dried fruit, mushrooms and seaweed are the backbone of a pantry that doesn’t need power.</p>' +
            old('Sun-dried fruit, beans hung in their pods, strings of chilies and mushrooms on thread: drying is one of the oldest ways people have carried food through winter and across distance.'); } },
          { id: 'beans', short: 'Beans', title: 'Soaking beans', html: function () { return ul([
              '<b>Overnight soak:</b> cover sorted, rinsed beans with about three times their volume of water for 8–12 hours. In a hot kitchen, soak in the fridge.',
              '<b>Quick soak:</b> bring to a boil, boil 2–3 minutes, cover and rest 1 hour.',
              'Pour off the soaking water and cook in fresh water. Soaking cuts cooking time and, for many people, gas.',
              '<b>No soak needed:</b> lentils, split peas and mung beans cook in under an hour.',
              'A spoon of salt per quart of soaking water gives softer skins. Very old beans may never fully soften; a pinch of baking soda helps.']) +
            care('Red kidney beans (and, less so, other beans) carry a natural toxin that a hard boil destroys. Soak, drain, then <b>boil hard for at least 10 minutes</b> before simmering or putting them in a slow cooker. Warm-but-not-boiling beans can be worse than raw, so never start kidney beans in a slow cooker from dry.'); } },
          { id: 'grains', short: 'Grains &amp; nuts', title: 'Grains, nuts and seeds', html: function () { return ul([
              '<b>Oats:</b> rolled oats soaked overnight in water or plant milk are ready to eat with no cooking. Steel-cut oats soaked overnight cook in about 10 minutes.',
              '<b>Brown rice and whole grains:</b> a few hours’ soak shortens cooking and gives a softer grain. Optional.',
              '<b>Nuts:</b> cashews soaked 2–4 hours blend into a smooth cream for sauces.',
              '<b>Chia and flax:</b> 1 tbsp ground flax or chia in 3 tbsp water, rested 10 minutes, binds like an egg in baking.']) +
            home('Overnight oats in a jar, made with the kids before bed: breakfast is waiting.'); } },
          { id: 'fruit', short: 'Fruit &amp; mushrooms', title: 'Fruit, mushrooms and vegetables', html: function () { return ul([
              '<b>Dried mushrooms:</b> hot water for 20–30 minutes. Strain the soaking liquid through a cloth (grit) and keep it: it’s a rich broth.',
              '<b>Dried fruit:</b> warm water or tea for 10–30 minutes, for baking or softening for little ones.',
              '<b>Seaweed:</b> wakame and kombu swell a lot in 5–10 minutes. Start small.',
              '<b>Dried vegetables and TVP</b> (textured soy protein): equal parts boiling water, 10 minutes.']) +
            tryit('Use soaked food within a few hours, or put it in the fridge. Once wet, it spoils like fresh food.'); } },
          { id: 'sprouting', short: 'Sprouting', title: 'Sprouting', html: function () { return '<p>A jar, a mesh lid and two rinses a day turn lentils, mung beans, chickpeas or alfalfa seeds into crunchy sprouts in 2–5 days. The cheapest fresh greens there are, grown on a counter.</p>' +
            ol(['Soak seeds overnight, drain.', 'Tip the jar upside down at an angle so it drains.', 'Rinse with fresh drinking water morning and evening.', 'Eat when the tails are as long as the seed; fridge after that.']) +
            care('The warm, damp jar that grows sprouts also grows germs. Cooking sprouts makes them safe for young children, pregnant people, older people and anyone with a weaker immune system. Don’t sprout kidney beans to eat raw. Use seeds sold for sprouting.'); } },
          { id: 'tool', tool: true, short: 'Soak &amp; cook', title: 'Soak &amp; cook', html: function () { return '<div class="fo-row">' +
              '<label class="fo-f">Food<select data-fo id="fo-sc-food">' + opts(SC) + '</select></label>' +
              '<label class="fo-f">Dry amount (cups)<input type="number" data-fo id="fo-sc-cups" min="0.25" step="0.25" value="1"></label>' +
              '<label class="fo-f">Cooking with<select data-fo id="fo-sc-way"><option value="pot">A pot on a stove</option><option value="pc">Pressure cooker</option></select></label></div>' +
              '<div class="fo-out" id="fo-sc-out"></div>'; } }
        ] },

      { id: 'cook', num: 4, word: 'Cook', sub: 'Heat, fuel and the plate',
        lede: 'Cooking makes food safer, easier to digest and better to share. It needs less fuel and fewer tools than most kitchens suggest.',
        subs: [
          { id: 'heat', short: 'Safe heat', title: 'Heat makes food safe', html: function () { return '<p>Most germs that make people sick grow fastest between 40°F and 140°F (4–60°C), the <b>danger zone</b>. Food is safest kept cold below it or hot above it, and passing through it quickly.</p>' +
            ul(['Reheat leftovers until steaming all the way through: 165°F (74°C) on a thermometer.', 'Soups and stews: bring back to a rolling boil.', 'Kidney beans: a hard 10-minute boil (' + a('rehydrate/beans', '3.2') + ').']) +
            tryit('Stick a cheap food thermometer into tonight’s reheated leftovers. Is the middle as hot as the edge?'); } },
          { id: 'little', short: 'With little', title: 'Cooking with little', html: function () { return '<p>Fuel, time and money go further with a few tricks.</p>' +
            ul(['<b>Lids on:</b> a covered pot boils faster and simmers on the lowest flame.', '<b>Pressure cookers</b> cook soaked beans in minutes instead of an hour or two.', '<b>Retained heat:</b> bring a pot to a boil, then wrap it in blankets or set it in an insulated box. It keeps cooking for hours with no fuel.']) +
            old('The haybox: a wooden crate packed with hay, used across Europe and Africa to finish porridges, beans and stews while the household went about its day.') +
            accs(
              acc('smallkit', 'One appliance', 'Hot plate, rice cooker or microwave', ul(['A rice cooker steams vegetables in a basket above the rice, and makes oats and lentil stew.', 'A single electric pressure cooker does beans, grains, soups and steaming.', 'Microwave: red lentils in a big bowl with water (they foam), potatoes, frozen vegetables, oats.'])),
              acc('shared', 'Shared kitchen', 'Cooking in a shared kitchen', '<p>Batch-cook in quiet hours, label your shelf, and keep one crate of your own tools. A shared pot of soup is a lovely way to meet housemates.</p>' + links('<a href="#lens-relationships">Relationships</a> (housemates) · Cleaning (shared chores)')),
              acc('nocook nohome', 'No cooking', 'Cold soaking and no-cook meals', ul(['Cold soak in a jar with a tight lid: rolled oats (overnight), couscous (1–2 hours), instant noodles (about an hour), instant mashed potatoes (minutes).', 'Canned beans, chickpeas and lentils are already cooked: rinse and eat.', 'Nut butter, bread, fruit and canned beans meet protein, energy and fiber with no heat.'])),
              acc('land outdoor', 'Outdoors', 'Sun and fire', '<p>A solar oven (a box, a black pot, foil and glass) slow-cooks beans and rice on sunny days. Rocket stoves burn small sticks hot and clean.</p>')) +
            care('Food left wrapped for many hours can cool into the danger zone. If a retained-heat pot has sat more than about 4 hours, bring it back to a boil before eating.'); } },
          { id: 'together', short: 'Together', title: 'Cooking together', html: function () { return '<p>Children belong in the kitchen, at whatever level they can manage. Real tools, real jobs, next to the adults.</p>' +
            rungs([['Toddlers', 'Wash and carry', 'Swishing greens, scrubbing potatoes, tearing lettuce, carrying the bowl to the table.'],
              ['Preschool', 'Pour and mash', 'Measuring beans into a jar, mashing chickpeas, stirring cold batters, sorting stones from lentils.'],
              ['Early school', 'Cut and mix', 'A small sharp knife on soft food with a claw grip, cracking open pods, rinsing quinoa.'],
              ['Older kids', 'Cook a dish', 'The stove with an adult nearby, then a whole meal of their own for everyone.']]) +
            together('Sorting a tray of dried beans for stones is a favorite: it’s a treasure hunt that makes dinner.') +
            links('<a href="#lens-relationships">Relationships</a> (children) · Foundation 2 (togetherness)'); } },
          { id: 'pots', short: 'Pots &amp; stoves', title: 'Pots, pans and stoves', html: function () { return ul([
              '<b>Cast iron, carbon steel, stainless steel and glass</b> last a lifetime and turn up secondhand.',
              '<b>Nonstick coatings:</b> keep the heat low and retire pans once scratched or flaking. See Poisons for what’s in them.',
              '<b>Gas stoves</b> put fumes into the room. Run the hood fan or open a window while cooking.',
              'Hot food goes into glass, steel or ceramic rather than plastic.']) +
            links('Poisons (cookware, plastics) · Air (gas stoves, ventilation)'); } },
          { id: 'plate', short: 'The plate', title: 'A plate that meets needs', html: function () { return '<p>Bodies need energy, protein, fats, fiber, vitamins and minerals. A plant plate meets nearly all of them with variety across the day. Major dietetic associations find well-planned vegan diets healthy at every stage of life, including pregnancy and childhood.</p>' +
            '<div class="fo-plate">' +
            '<div><b>Beans and lentils</b><p>Protein, iron, fiber. Tofu, tempeh and peanuts count too.</p></div>' +
            '<div><b>Whole grains</b><p>Energy and more protein: rice, oats, wheat, millet, corn.</p></div>' +
            '<div><b>Vegetables and fruit</b><p>Vitamins and fiber; vitamin C helps the body take in iron.</p></div>' +
            '<div><b>Nuts and seeds</b><p>Fats; ground flax, chia and walnuts for omega-3.</p></div></div>' +
            note('A few to plan for', ul(['<b>B12:</b> made by bacteria, not plants. A supplement or fortified foods (plant milks, nutritional yeast) are the reliable source. Many older adults need one whatever they eat.', '<b>Calcium:</b> fortified plant milk, calcium-set tofu, kale, bok choy.', '<b>Vitamin D:</b> sun and fortified foods. <b>Iodine:</b> iodized salt, or seaweed in small amounts.']) +
              '<p>A doctor or dietitian can check levels and doses, especially in pregnancy and for young children.</p>') +
            tryit('Look at one day’s plates. Which of the four groups showed up? Which one would be easy to add tomorrow?') + links('Why every plate here is plants: <a href="#lens-relationships/special/captive">Relationships: Captive animals</a>'); } }
        ] },

      { id: 'store', num: 5, word: 'Store', sub: 'Keeping food good',
        lede: 'Every way of keeping food takes away something germs need: warmth, water, air or a friendly pH. Cold, dry, sealed and sour are the four big tools.',
        subs: [
          { id: 'cold', short: 'Cold', title: 'Cold', html: function () { return ul([
              'Fridge at <b>40°F (4°C) or below</b>, freezer at <b>0°F (−18°C)</b>. A $5 thermometer tells you.',
              'Greens in a container lined with a dry towel. Herbs like basil and cilantro in a glass of water, like flowers.',
              'Apples, bananas, avocados and tomatoes give off ethylene, a ripening gas: keep them away from greens and carrots.',
              'Tomatoes, potatoes, onions, garlic, winter squash and bananas keep better out of the fridge.']) +
            accs(
              acc('nocold nohome portable', 'No fridge', 'Living without cold', ul(['Buy fresh food for a day or two at a time; lean on the pantry (' + a('store/pantry', '5.2') + ') for the rest.', 'Whole fruit and hard vegetables keep for days in shade: apples, citrus, carrots, cabbage, potatoes, onions, squash.', 'A clay pot-in-pot cooler (a pot inside a bigger pot, wet sand between) cools by evaporation in dry heat.', 'Cook only what gets eaten in one go.'])),
              acc('smallcold', 'Small fridge', 'Making a small fridge go further', '<p>Save cold space for what needs it: cooked food, cut fruit, tofu, opened plant milk, greens. Everything above that keeps better outside can live on the counter.</p>')); } },
          { id: 'pantry', short: 'Pantry', title: 'The pantry', html: function () { return '<p>Cool, dark, dry and sealed. Glass jars with good lids keep out air, damp and visitors (' + a('store/visitors', '5.5') + ').</p>' +
            ul(['<b>Keep for years:</b> white rice, dried beans, salt, sugar, dried pasta. Old beans are still safe; they just cook slower.', '<b>Keep for months:</b> brown rice, whole-wheat flour, nuts and seeds. Their oils go rancid (a smell like crayons or old paint); the fridge or freezer doubles their life.', '<b>First in, first out:</b> new jars behind old ones, and a date on the lid.']) +
            ca('Since July 2026, “BEST if Used by” means quality and “USE by” means safety on food labels (AB 660). Food past a “best by” date is usually fine: look, smell, taste a little.') +
            tryit('Take everything off one shelf. Eat the oldest thing this week.'); } },
          { id: 'leftovers', short: 'Leftovers', title: 'Leftovers', html: function () { return ul(['Into the fridge within 2 hours of cooking (1 hour on a day over 90°F).', 'Shallow containers cool fast. A big pot of soup can stay warm in the middle for hours: split it up.', 'Most leftovers keep 3–4 days cold, or months frozen. Freeze in single portions with a date.']) +
            care('<b>Cooked rice</b> can carry spores that survive cooking and make a toxin reheating won’t destroy. Cool it within an hour, keep it cold, and eat it within a day (the UK’s NHS advice; US guidance allows 3–4 days). Reheat only once. Your nose can’t tell you about this one.'); } },
          { id: 'longer', short: 'Longer', title: 'Keeping it longer', html: function () { return accs(
              acc('portable invest land', 'Easy', 'Freezing', '<p>Blanch most vegetables 1–3 minutes first so they keep color and taste. Freeze fruit on a tray, then bag it. Bread, cooked beans, grains and soup all freeze well.</p>'),
              acc('portable invest land', 'Easy', 'Fermenting', '<p>Sauerkraut and kimchi: shred vegetables, mix with 2% salt by weight (20 g per kg), pack into a jar and keep them under the brine. Ready in 1–4 weeks at room temperature.</p><p>A flat white film (kahm yeast) can be skimmed. Fuzzy blue, green, black or pink mold means the batch goes to compost.</p>'),
              acc('outdoor land invest', 'Some gear', 'Drying', '<p>Sun, an oven at its lowest setting with the door ajar, or a dehydrator. Fruit is done when leathery with no wet pockets, vegetables when brittle.</p>'),
              acc('invest land', 'Some gear', 'Canning', ul(['<b>High-acid food</b> (most fruit, pickles, tomatoes with added lemon juice) goes in a boiling water bath.', '<b>Low-acid food</b> (beans, most vegetables, soups) needs a pressure canner. A water bath isn’t hot enough to kill botulism spores.', 'Use tested recipes (the National Center for Home Food Preservation or the USDA guide) and adjust for altitude.'])),
              acc('land outdoor', 'Land', 'Root cellars and cool rooms', '<p>Potatoes, carrots, beets, cabbage, apples and winter squash keep for months somewhere cold (32–40°F), dark and damp. A buried bin, a north-side closet or an unheated garage can work.</p>')) +
            care('Bulging, leaking or spurting cans and jars, or an off smell: throw out without tasting, in a sealed bag. Garlic or herbs in oil: keep in the fridge and use within 4 days, or freeze.') +
            old('Every culture has its keeping foods: kimchi, sauerkraut, miso, pickled plums, dried tomatoes, fruit leather. Each one turns a glut into a year of meals.'); } },
          { id: 'visitors', short: 'Visitors', title: 'Animals in the pantry', html: function () { return '<p>Moths in the flour, ants on the counter, a mouse behind the rice: they’re neighbors whose need for food our pantry is meeting by accident. Change what we offer and they move on, no poison needed.</p>' +
            ul(['<b>Pantry moths and weevils:</b> flour and grain in glass or metal jars with good lids, so there’s nothing to move into. Carry anything they’ve already moved into out to the compost or a far corner of the yard, and wipe the shelf.', '<b>Ants:</b> follow the trail to the door, wipe it with soapy water or vinegar (it erases their scent path), and seal the crack.', '<b>Mice:</b> food in jars and tins, crumbs swept, nothing left out overnight. With no food on offer, mice move on; once they have, stuff the gaps around pipes with steel wool so the next ones find nothing to come in for.']) +
            old('Bay leaves in the flour bin are a common old remedy for weevils. Studies are thin, but they smell nice and do no harm.') +
            links('<a href="#lens-relationships/special/captive">Relationships: Captive animals</a> · Cleaning'); } },
          { id: 'keeps', tool: true, short: 'How long it keeps', title: 'How long does it keep?', html: function () { return '<div class="fo-row"><label class="fo-f">Food<select data-fo id="fo-kp-food">' + opts(KP) + '</select></label></div><div class="fo-out" id="fo-kp-out"></div>'; } }
        ] },

      { id: 'gentle', num: 6, word: 'Gentle', sub: 'Soft food for tender bodies',
        lede: 'New eaters, sore mouths, missing teeth, a sick tummy, an old cat with tender gums: some bodies need food that asks less of them, for a while or for good. Most of it is the same food, made softer, wetter and smaller.',
        subs: [
          { id: 'babies', short: 'Babies', title: 'First foods for babies', html: function () { return '<p>Breast milk or infant formula carries a baby through the first year. Solids start around <b>6 months</b>, when a baby sits up with support, holds their head steady, and leans in and opens up for food.</p>' +
            ul(['<b>Iron first.</b> The iron a baby is born with runs low by about 6 months. Mashed lentils and beans, soft tofu and iron-fortified oat or multigrain cereal meet it; a little fruit or vegetable alongside helps the body take it in.',
              '<b>Common allergens early.</b> Offering peanut (smooth peanut butter thinned into a puree, or peanut powder), soy, wheat, sesame and tree-nut butters early and often lowers the chance of an allergy. Babies with severe eczema or a known food allergy see a doctor first.',
              '<b>Drinks:</b> sips of water from an open cup from 6 months. Under 12 months, no plant milk or cow’s milk as a main drink; soy-based infant formula is the plant-based formula. After 1, fortified unsweetened soy milk is the plant milk closest in protein to cow’s milk. Rice milk isn’t for young children (' + a('cleanse/grains', 'arsenic, 2.4') + ').',
              'No added salt or sugar, and no honey before 1 (botulism).']) +
            care('<b>Choking:</b> round, firm and sticky foods are the risk. Quarter grapes and cherry tomatoes lengthwise; no whole nuts, popcorn, hard raw carrot or apple pieces, or spoonfuls of nut butter before age 4. First foods squish between finger and thumb. Always seated upright, with an adult watching. Gagging (noisy, coughing, red face) is a normal part of learning; choking is quiet, and that’s First aid.') +
            note('Plant-based babies', '<p>Well-planned vegan diets fit infancy and childhood. A few to plan with a pediatrician: <b>B12</b> (for a breastfeeding parent and for the baby), <b>vitamin D</b> drops for breastfed babies (400 IU a day), <b>DHA</b> (algae oil), and enough iron, zinc and iodine.</p>') +
            together('A baby at the family table, eating a soft, mashed spoonful of what everyone else is having, learns food as belonging.') +
            '<p class="fo-src"><small>Sources: American Academy of Pediatrics (HealthyChildren.org); NIAID peanut allergy prevention guidelines (2017); Healthy Eating Research, <i>Healthy Beverage Consumption in Early Childhood</i> (2019); Academy of Nutrition and Dietetics position on vegetarian diets (2016).</small></p>'; } },
          { id: 'chewing', short: 'Chewing', title: 'Sore mouths, few teeth and trouble swallowing', html: function () { return '<p>Tooth pain, missing teeth, new dentures, braces, mouth sores, dry mouth from medicines, a healing extraction: when chewing gets hard, people often quietly start eating less. The same foods, made softer, keep meeting the need. Speech and swallowing specialists use a shared ladder of textures (IDDSI):</p>' +
            rungs([['Level 7', 'Easy to chew', 'Normal food that’s soft and tender: ripe fruit, soft bread, well-cooked beans and vegetables.'],
              ['Level 6', 'Soft &amp; bite-sized', 'Pieces about the size of a thumbnail that mash under a fork: tofu, soft pasta, banana.'],
              ['Level 5', 'Minced &amp; moist', 'Small soft bits held in a thick sauce: lentil dal, mashed beans in gravy, soft polenta.'],
              ['Level 4', 'Pureed', 'Smooth, holds its shape on a spoon: hummus, blended soup thickened, smooth porridge, avocado, silken tofu pudding.']]) +
            ul(['<b>Keep protein in.</b> Soft food drifts toward plain starch. Beans, lentils, tofu, soy milk and nut butters at each meal keep muscles and healing going.',
              '<b>Moisture helps:</b> sauces, gravies and broth for dry mouth, and sips between bites.',
              '<b>After a tooth is pulled:</b> cool, soft food the first day, chew on the other side, and no straws for a few days (the suction can pull out the healing clot).',
              '<b>Smoothies</b> with soy milk, oats, banana and a spoon of nut butter are a full meal when chewing isn’t possible.']) +
            tryit('The fork test: press a piece with the back of a fork until your thumbnail turns pale. If it squashes and stays squashed, it’s soft enough for level 6.') +
            care('<b>Trouble swallowing</b> (dysphagia): coughing or clearing the throat during meals, a wet or gurgly voice after drinking, food that sticks, or repeated chest infections. A speech-language pathologist can assess it and say which level fits; thin liquids are often the hardest. Sit fully upright for meals and for about 30 minutes after.') +
            '<p class="fo-src"><small>Source: International Dysphagia Diet Standardisation Initiative (iddsi.org).</small></p>'; } },
          { id: 'medicine', short: 'Food as medicine', title: 'Food as medicine', html: function () { return '<p>Food doesn’t replace care, and it’s part of it. Every culture has gentle foods for sick days: they’re easy on a body putting its energy into healing, and they carry back the water, salt and sugar that fever, vomiting and diarrhea pull out.</p>' +
            ul(['<b>Fluids first.</b> Small sips often (a spoonful every few minutes after vomiting) stay down better than big gulps.',
              '<b>Oral rehydration solution:</b> 1 liter (about 4¼ cups) of clean drinking water, 6 level teaspoons of sugar and ½ level teaspoon of salt, stirred until dissolved (WHO). Pharmacy packets work the same way. Frozen into popsicles, kids often take it more happily.',
              '<b>Babies:</b> keep breastfeeding or giving formula; ask a doctor how much oral rehydration solution to add.',
              '<b>Then gentle food, as soon as it’s wanted:</b> rice, congee, oats, toast, bananas, applesauce, potatoes, soup. The strict old “BRAT” diet (bananas, rice, applesauce, toast) is no longer advised for more than a day or so: a usual diet again soon helps recovery.',
              '<b>Nausea:</b> ginger (fresh slices steeped as tea, or crystallized) has fair evidence for some kinds of nausea, including in pregnancy. Small dry snacks, often.',
              '<b>Sore throat or a cold:</b> warm (not hot) soups and teas, or cool smoothies and fruit popsicles.',
              '<b>Constipation:</b> water, prunes, pears, oats, beans, and moving around.']) +
            old('Jook (rice porridge) across East Asia, khichdi (rice and lentils cooked soft) in South Asia, miso soup in Japan, vegetable broth nearly everywhere: sick-day foods are some of the oldest recipes people share.') +
            note('Every day, too', '<p>Over years, the plate in ' + a('cook/plate', '4.5') + ' is food medicine: diets high in fiber, beans, whole grains, fruit and vegetables are linked with less heart disease, type 2 diabetes and some cancers.</p>') +
            care('Get care right away for signs of dehydration: very little or no pee, no tears, a dry mouth, a sunken soft spot on a baby’s head, unusual sleepiness or confusion. Also for blood in vomit or stool, vomiting that won’t stop, or a fever in a baby under 3 months (100.4°F / 38°C or higher).') +
            links('Body care (in progress) and First aid (in progress) take this further.') +
            '<p class="fo-src"><small>Sources: World Health Organization (oral rehydration); American Academy of Pediatrics; Viljoen et al., <i>Nutrition Journal</i> (2014), ginger for nausea in pregnancy.</small></p>'; } },
          { id: 'animals', short: 'Animals', title: 'Tender times for companion animals', html: function () { return ul([
              '<b>Kittens and puppies</b> nurse for about 4 weeks, then move onto soft wet food mashed with warm water over the next few weeks. An orphaned kitten or puppy needs a milk replacer made for their species, warmth and a vet: cow’s milk upsets their stomachs.',
              '<b>Sore teeth are common.</b> Most cats and dogs have some gum disease by age 3. Dropping food, chewing on one side, drooling, pawing at the mouth and bad breath are signals. Wet food, or kibble soaked in warm water, helps while a vet looks.',
              '<b>Old noses fade.</b> Warming wet food to about body temperature makes it smell stronger, which helps an older cat or dog want to eat.',
              '<b>Sick days:</b> fresh water close by, and the bland food a vet suggests. Small meals often.']) +
            care('Animals get into trouble from not eating faster than people do. A cat who hasn’t eaten for more than a day or two, or a rabbit or guinea pig who stops eating or pooping for more than about 12 hours, needs a vet soon. A male cat straining to pee with little coming out is an emergency.') +
            accs(acc('cat dog small', 'Your companions', 'The animals on your profile', '<p>The next unit (' + a('companions', 'Unit 7') + ') covers what each species eats in nature, and how to meet the same needs at home.</p>')) +
            links(a('companions', 'Unit 7: What animals eat') + ' · <a href="#lens-toxins/exposures/companions">Poisons: what each species can’t process</a>'); } },
          { id: 'tool', tool: true, short: 'Make it gentle', title: 'Make it gentle', html: function () { return '<div class="fo-row"><label class="fo-f">Who’s eating<select data-fo id="fo-gn-who">' + opts(GN) + '</select></label></div><div class="fo-out" id="fo-gn-out"></div>'; } }
        ] },

      { id: 'companions', num: 7, word: 'Companions', sub: 'What animals eat',
        lede: 'Each species grew up eating something different. Knowing what a body evolved on, and which needs that food was meeting, opens more than one way to feed the animals we live with.',
        subs: [
          { id: 'nature', short: 'In nature', title: 'What each animal eats in nature', html: function () { return table(['Animal', 'In nature', 'At home, meeting the same needs'], [
              ['Cats', 'Small prey eaten whole (mice, birds, insects), many small meals a day; their food is about 70% water', 'A complete cat food, wet or with water added; small meals; water away from the food bowl'],
              ['Dogs', 'Descended from wolves, then lived beside people for thousands of years, eating what people left; their genes adapted to digest starch', 'A complete dog food; dogs do well on many diets, plant-based included'],
              ['Rabbits', 'Grasses and leafy plants, grazed all day', 'Unlimited hay (most of the diet), leafy greens, a few pellets; fruit as a rare treat'],
              ['Guinea pigs', 'Grasses; like us, they can’t make their own vitamin C', 'Hay, vitamin C–rich greens and peppers, guinea pig pellets'],
              ['Rats and mice', 'Seeds, grains, fruit and insects', 'A complete block or pellet, plus vegetables'],
              ['Parrots and other birds', 'Fruit, seeds, nuts, flowers and buds, varying hugely by species', 'Pellets plus vegetables; seed-only diets fall short'],
              ['Tortoises', 'Weeds, grasses and flowers', 'Weeds and leafy greens, plus sun or a UVB lamp'],
              ['Fish', 'Plankton, insects, plants or other fish, by species', 'Food made for that species, in small amounts']]) +
            '<p>The pattern: <b>herbivores</b> (rabbits, guinea pigs, tortoises) already eat plants. <b>Omnivores</b> (dogs, rats, many birds) are flexible. <b>Cats</b> are obligate carnivores, which ' + a('companions/cats', '7.2') + ' unpacks.</p>' +
            '<p class="fo-src"><small>Sources: Axelsson et al., <i>Nature</i> (2013), starch digestion in dogs; House Rabbit Society; RSPCA.</small></p>'; } },
          { id: 'cats', short: 'Cats', title: 'Cats: “obligate carnivore”, explained', html: function () { return '<p>“Obligate carnivore” describes <b>nutrients</b>, not ingredients. A cat’s body can’t make certain nutrients from plant sources the way a dog’s or ours can, so in nature those come from eating other animals:</p>' +
            ul(['<b>Taurine</b> for the heart and eyes; without it, cats develop heart disease and blindness.', '<b>Arachidonic acid</b>, a fat.', '<b>Vitamin A</b> ready-made: cats can’t turn the beta-carotene in carrots into it.', '<b>Niacin and vitamin D</b>, and more protein than most animals.']) +
            '<p>Each of these can be made without animals. Synthetic taurine is already added to nearly all cat food, including meat-based food, because cooking destroys much of what’s there.</p>' +
            ul(['<b>Water:</b> cats evolved to drink little and get water from prey. On dry food alone many cats run low, which is linked to urinary and kidney trouble. Wet food, or water stirred in, helps whatever the protein.',
              '<b>Cat grass</b> (oat, wheat or barley sprouts) is a safe nibble many cats love; it isn’t a meal. <b>Catnip</b> is a mint they play with, not a food.']) +
            '<p class="fo-src"><small>Source: National Research Council, <i>Nutrient Requirements of Dogs and Cats</i> (2006).</small></p>'; } },
          { id: 'kibble', short: 'Kibble &amp; raw', title: 'Kibble, canned and raw', html: function () { return ul([
              '<b>Kibble</b> is a dough of grains, legumes and rendered parts of animals (the leftovers of slaughterhouses: organs, bones and trimmings, cooked and dried into “meal”), pushed through an extruder at high heat, then sprayed with fat and vitamins. Cheap, keeps for months, and very dry.',
              '<b>Canned (wet)</b> food has far more water and usually more protein. It costs more and keeps a day or two once opened.',
              '<b>Raw</b> food is closest to prey in texture, and it carries germs: <i>Salmonella</i>, <i>Listeria</i> and, since 2024, H5N1 bird flu, which has killed cats who ate contaminated raw food or raw milk. Several brands, including California ones, were recalled. Germs reach the people handling the bowls too, especially children and older people.',
              '<b>Homemade</b> food easily misses a nutrient. A recipe from a board-certified veterinary nutritionist is the reliable way.']) +
            care('The words to look for on any label: <b>“complete and balanced”</b> for the animal’s life stage, meeting AAFCO (US) or FEDIAF (Europe) nutrient profiles. Without them, a food is a treat or a topper, not a diet.') +
            '<p class="fo-src"><small>Sources: US Food and Drug Administration, H5N1 and pet food updates (2024–2025); AAFCO; FEDIAF.</small></p>'; } },
          { id: 'plants', short: 'Plant-based', title: 'Plant-based food for dogs and cats', html: function () { return '<p>Complete plant-based foods for dogs and cats use the same synthetic nutrients mainstream foods add. In guardian surveys, dogs (2,536 of them) and cats (1,418) fed vegan diets were reported as no less healthy than meat-fed ones, and on some measures healthier. These rely on what guardians report, and long controlled trials are still few, so many vets stay cautious. Dogs are the easier fit; cats take more care.</p>' +
            ul(['<b>Choose a food labeled complete and balanced</b> for that species and life stage. Benevo, Ami and Evolution make plant-based foods for cats and dogs; formulas change, so check the label each time.',
              '<b>Switch slowly</b>, mixing more of the new food in over 1–2 weeks.',
              '<b>Add water or choose wet</b>, especially for cats.',
              '<b>A vet check before and a few months in</b>, then yearly: weight, coat, bloodwork, and for cats a urine test.',
              '<b>Watch their body:</b> energy, coat, weight, stool, appetite and litter box are how they tell you it’s working.']) +
            accs(acc('cat', 'Cats', 'Plant-based food for cats', ul(['Plant foods can make urine less acidic, which raises the chance of crystals (struvite). Many plant-based cat foods add a urine acidifier; a urine test tells you.', 'A male cat straining to pee with little coming out is an emergency, whatever the food.', 'Kittens, pregnant cats and cats with kidney or heart conditions: plan the food with a vet.'])),
              acc('dog', 'Dogs', 'Plant-based food for dogs', ul(['Dogs digest starch and meet their needs on many diets. V-dog and others make complete plant-based dog food.', 'Large-breed puppies need a food made for their growth; check the life stage on the label.']))) +
            tryit('Next vet visit, ask: “What would you look for to know this food is meeting their needs?”') +
            '<p class="fo-src"><small>Sources: Knight et al., <i>PLOS ONE</i> (2022), dogs; Knight et al., <i>PLOS ONE</i> (2023), cats; Dodd et al., <i>PLOS ONE</i> (2021).</small></p>' +
            links('<a href="#lens-relationships/special/captive">Relationships: Captive animals</a> · <a href="#lens-toxins/exposures/companions">Poisons: what each species can’t process</a>') +
            (mn().opinion ? mn().opinion('<p>I stay out of judging predators and prey, so a cat’s health comes first here; I offer plant-based food as one option because the animals who became kibble were someone too, with needs it never met (more in <a href="#lens-relationships/special/captive">Captive animals</a>).</p><p class="opinion-src">In the US, dogs and cats eat about a third as much animal-sourced food energy as all of the country’s people do (Okin, <i>PLOS ONE</i>, 2017).</p>') : ''); } }
        ] }
    ];
  }

  /* ---------- tools ---------- */
  /* Soak & cook: [name, soak, stovetop, pressure cooker, cooked cups per dry cup, take-care note]. Typical ranges. */
  var SC = {
    black: ['Black beans', '8–12 hours, or a quick soak', '60–90 min', '6–8 min, natural release', 2.5],
    chick: ['Chickpeas', '8–12 hours, or a quick soak', '1½–2 hours', '12–15 min, natural release', 2.5],
    kidney: ['Red kidney beans', '8–12 hours, then drain', '60–90 min, after a hard 10-min boil', '8–10 min, natural release', 2.5, 'Boil hard for 10 minutes first. Never from dry in a slow cooker.'],
    pinto: ['Pinto beans', '8–12 hours, or a quick soak', '60–90 min', '6–9 min, natural release', 2.5],
    white: ['White beans (navy, cannellini)', '8–12 hours, or a quick soak', '45–75 min', '6–8 min, natural release', 2.5],
    lentil: ['Brown or green lentils', 'None needed', '20–30 min', '8–10 min', 2.5],
    red: ['Red lentils', 'None needed', '15–20 min, until they melt', 'Stovetop is fast enough (they foam)', 2],
    split: ['Split peas', 'None needed', '30–45 min', '8–10 min', 2],
    brown: ['Brown rice', 'Optional, a few hours', '40–45 min in 2¼ cups water per cup', '20–22 min', 3, 'Or cook like pasta and drain to lower arsenic (2.4).'],
    whiterice: ['White rice', 'None; rinse well', '15–18 min in 1½ cups water per cup', '3–4 min + 10 min natural release', 3, 'Cool leftovers within an hour (5.3).'],
    quinoa: ['Quinoa', 'None; rinse well (2.4)', '15 min in 2 cups water per cup', '1 min + 10 min natural release', 3],
    steel: ['Steel-cut oats', 'Optional overnight; cuts cooking to about 10 min', '20–30 min in 3–4 cups water per cup', '10–12 min', 3.5],
    rolled: ['Rolled oats', 'Overnight in the fridge, no cooking needed', '5 min', 'Stovetop is fast enough', 2]
  };
  /* How long it keeps: [name, fridge, freezer, pantry, note]. Rough guides. */
  var KP = {
    beans: ['Cooked beans or lentils', '3–5 days', 'About 6 months', '—', ''],
    rice: ['Cooked rice', '1 day (NHS) to 3–4 days (USDA)', 'About 1 month', 'Not safe: cool within 1 hour', 'Smell won’t warn you. Reheat once only.'],
    grains: ['Other cooked grains', '3–5 days', '2–3 months', '—', ''],
    soup: ['Soups and stews', '3–4 days', '4–6 months', '—', 'Bring back to a rolling boil.'],
    veg: ['Cooked vegetables', '3–4 days', '2–3 months', '—', ''],
    tofu: ['Tofu, opened', '3–5 days in fresh water, changed daily', '3–5 months (gets chewier, nice in stir-fries)', '—', ''],
    milk: ['Plant milk, opened', '7–10 days (check the carton)', 'Separates; fine for cooking', 'Unopened shelf-stable cartons: months', ''],
    hummus: ['Hummus and dips', '4–7 days', '2–3 months', '—', ''],
    fruit: ['Cut fruit', '3–5 days', '8–12 months', '—', ''],
    greens: ['Leafy greens', '3–7 days, dry, in a lined box', 'Cooked only, for soups', '—', ''],
    oil: ['Garlic or herbs in oil', '4 days', 'Months', 'Never at room temperature', 'Botulism risk: no smell or taste.'],
    brownr: ['Brown rice, dry', 'About 1 year', '1–2 years', 'About 6 months', 'Rancid smells like crayons.'],
    flour: ['Whole-wheat flour', 'Up to 6 months', '6–12 months', '1–3 months', 'Glass or metal jars keep moths out.'],
    nuts: ['Nuts and seeds', 'About 6 months', 'About 1 year', '1–3 months', ''],
    drybean: ['Dried beans', '—', '—', 'Years (best within 1–2)', 'Older beans cook slower, still safe.']
  };
  /* Make it gentle: [who, texture, foods to try, take care]. */
  var GN = {
    b6: ['A baby starting solids (about 6–8 months)', 'Smooth to lumpy mash, or soft strips the length of a finger to hold', 'Mashed lentils or beans, iron-fortified oat cereal, mashed avocado or banana, soft-cooked sweet potato, tofu strips, smooth peanut butter thinned into a puree', 'Breast milk or formula stays the main food. No honey, no added salt, nothing round and firm.'],
    b9: ['A baby 9–12 months', 'Small soft pieces that squish between finger and thumb', 'Pea-sized soft tofu, soft pasta, flattened beans, ripe pear, toast strips with hummus', 'Quarter grapes and cherry tomatoes lengthwise. Seated upright, with an adult watching.'],
    tod: ['A toddler (1–3 years)', 'Most family food, cut small and soft', 'The family meal; fortified unsweetened soy milk as a drink alongside food', 'Before age 4: no whole nuts, popcorn, hard raw carrot or apple chunks, or spoonfuls of nut butter.'],
    sore: ['A sore mouth, braces or after dental work', 'Soft, and cool or lukewarm; not spicy, salty or sour', 'Smoothies, silken tofu, oats, mashed potatoes, blended soups, banana', 'After a tooth is pulled: no straws for a few days, and nothing crunchy or seedy near the spot.'],
    teeth: ['Few or no teeth, or new dentures', 'Soft & bite-sized: pieces that mash under a fork (IDDSI level 6)', 'Lentil dal, soft beans in sauce, tofu, well-cooked vegetables, ripe fruit, polenta', 'Keep protein at every meal, and add sauce or broth for a dry mouth.'],
    swallow: ['Trouble swallowing', 'The level a speech-language pathologist sets (IDDSI)', 'Pureed soups and dals, hummus, smooth porridge, avocado', 'Coughing or a wet voice at meals is a signal to ask for a swallow assessment. Sit fully upright.'],
    tummy: ['An upset stomach, vomiting or diarrhea', 'Sips first, then plain soft food', 'Oral rehydration solution (1 L water, 6 level tsp sugar, ½ level tsp salt), rice, congee, toast, banana, applesauce, potatoes', 'A usual diet again within a day or two. Get care for signs of dehydration (6.3).'],
    cold: ['A cold, fever or sore throat', 'Warm (not hot) and wet, or cool and smooth', 'Soups, miso soup, ginger tea, smoothies, fruit popsicles, oats', 'Plenty to drink. A fever in a baby under 3 months needs a doctor.'],
    pet: ['A cat or dog with sore teeth or a weak appetite', 'Wet food, or their kibble soaked in warm water', 'Their usual complete food, softened and warmed to about body temperature', 'A cat who hasn’t eaten for more than a day or two needs a vet.']
  };
  function $(id) { return document.getElementById(id); }
  function frac(n) { return (Math.round(n * 4) / 4).toString().replace('.25', '¼').replace('.5', '½').replace('.75', '¾').replace(/^0(?=[¼½¾])/, ''); }
  function runTools() {
    if ($('fo-sc-out')) {
      var f = SC[$('fo-sc-food').value], c = Math.max(0.25, parseFloat($('fo-sc-cups').value) || 1), pc = $('fo-sc-way').value === 'pc';
      $('fo-sc-out').innerHTML = '<strong>About ' + frac(c * f[4]) + ' cups cooked</strong>' +
        '<b>Soak:</b> ' + f[1] + '<br><b>Cook:</b> ' + (pc ? f[3] : f[2]) +
        (f[5] ? care(f[5]) : '') +
        '<small>Typical times; older beans and higher altitude take longer. Taste a few: done when creamy all the way through.</small>';
    }
    if ($('fo-gn-out')) {
      var g = GN[$('fo-gn-who').value];
      $('fo-gn-out').innerHTML = '<strong>' + esc(g[1]) + '</strong><b>Try:</b> ' + esc(g[2]) + care(esc(g[3])) +
        '<small>Rough guides. A doctor, dentist, speech-language pathologist or vet knows the body in front of them.</small>';
    }
    if ($('fo-kp-out')) {
      var k = KP[$('fo-kp-food').value];
      $('fo-kp-out').innerHTML = '<div class="fo-keeps"><div><span class="eyebrow">Fridge</span><b>' + k[1] + '</b></div><div><span class="eyebrow">Freezer</span><b>' + k[2] + '</b></div><div><span class="eyebrow">Pantry</span><b>' + k[3] + '</b></div></div>' +
        '<small>' + (k[4] ? k[4] + ' ' : '') + 'Rough guides for a fridge at 40°F / 4°C or colder. For most foods, looks, smell and a small taste tell you the rest.</small>';
    }
  }
  document.addEventListener('input', function (e) { if (e.target.closest && e.target.closest('[data-fo]')) runTools(); });
  document.addEventListener('change', function (e) {
    if (e.target.closest && e.target.closest('[data-fo]')) runTools();
  });

  /* ---------- profile panel: what's on file, and where to change it ---------- */
  function onFile() {
    var p = prof(), rows = [];
    if (p.kitchen) rows.push(['Cooking', p.kitchen]);
    if (p.cold) rows.push(['Keeping food cold', p.cold]);
    var place = [p.home, p.stay, p.shape].filter(Boolean);
    if (place.length) rows.push(['Place', place.join(' · ')]);
    if ((p.space || []).length) rows.push(['Growing space', p.space.join(', ')]);
    return rows;
  }
  function panel() {
    var rows = onFile();
    if (!rows.length) {
      return '<div class="fo-sit"><span class="eyebrow">Tailor this course</span><p>Two questions in your Profile’s Food section (how you cook, how you keep food cold) open the parts that fit your life. Everything here stays open to everyone.</p><a class="btn personal sm" href="#profile/food">Answer in Profile</a></div>';
    }
    return '<div class="fo-sit"><span class="eyebrow">Tailored to your profile</span><p>Sections for you are open and marked <span class="fo-foryou is-on">For you</span>.</p>' +
      '<span class="fo-review"><a href="#profile/food" aria-describedby="fo-onfile">Review your profile’s food subsection</a>' +
      '<span class="fo-pop" id="fo-onfile" role="tooltip"><span class="eyebrow">On file</span>' + rows.map(function (r) { return '<span class="fo-pop-row"><b>' + esc(r[0]) + '</b>' + esc(r[1]) + '</span>'; }).join('') +
      '<span class="fo-pop-foot">Moved, or got a fridge? Update it in your Profile.</span></span></span></div>';
  }

  /* ---------- layout ---------- */
  function sidebar(U, cur) {
    var wide = window.matchMedia && window.matchMedia('(min-width: 900px)').matches;
    return '<nav class="fo-nav" aria-label="Food course"><details class="fo-nav-wrap"' + (wide ? ' open' : '') + '><summary class="fo-nav-head"><span class="eyebrow">Course map</span><b>Food</b></summary>' +
      '<a class="fo-nav-over" href="' + BASE + '"' + (!cur ? ' aria-current="page"' : '') + '>Overview</a><ol class="fo-vt">' +
      U.map(function (u) {
        var on = cur === u.id;
        return '<li class="fo-vt-unit fk' + u.num + (on ? ' cur' : '') + '"><a class="fo-vt-head" href="' + BASE + '/' + u.id + '"' + (on ? ' aria-current="page"' : '') + '><span class="fo-vt-dot">' + u.num + '</span><span><b>' + u.word + '</b><small>' + u.sub + '</small></span></a>' +
          '<ul class="fo-vt-subs">' + u.subs.map(function (s) { return '<li><a' + (s.tool ? ' class="is-tool"' : '') + ' href="' + BASE + '/' + u.id + '/' + s.id + '">' + (s.tool ? 'Tool: ' : '') + s.title + '</a></li>'; }).join('') + '</ul></li>';
      }).join('') + '</ol></details></nav>';
  }
  function layout(U, cur, main) {
    return mn().header('home') + '<div class="fo-layout">' + sidebar(U, cur) + '<main class="fo-main">' + panel() + main + '</main></div>' + mn().footer();
  }
  function viewOverview(U) {
    return '<section class="fo-hero"><span class="fo-lens-pill">Tier 2 · Roots · Course</span><h1 tabindex="-1">Food</h1>' +
      '<p class="fo-lede">Every body needs food, and feeding each other is one of the oldest pleasures there is. Seven short units on finding food, washing it, waking up dried food, cooking it safely, keeping it good, softening it for tender bodies and sick days, and feeding the animals we live with, at every scale: a full kitchen, a hot plate, a cooler, no kitchen at all.</p></section>' +
      '<ol class="fo-ucards">' + U.map(function (u) {
        return '<li><a class="fo-ucard fk' + u.num + '" href="' + BASE + '/' + u.id + '"><i class="fo-band"></i><span class="fo-n">0' + u.num + '</span><b>' + u.word + '</b><span>' + u.sub + '</span><ol>' + u.subs.filter(function (s) { return !s.tool; }).map(function (s) { return '<li>' + s.title + '</li>'; }).join('') + '</ol></a></li>';
      }).join('') + '</ol>' +
      '<aside class="fo-funfact"><span class="eyebrow">Fun fact</span><p>Every recipe in this course comes from plants, the cheapest, longest-keeping and most shareable way to meet the need for food. Beans and rice alone have fed much of the world for thousands of years. More on the <a href="#lens-relationships/special/captive">Captive animals</a> page.</p>' +
      '<p>Safety numbers come from public food-safety and health guidance (USDA, FDA, the UK’s NHS, the National Center for Home Food Preservation, WHO, the American Academy of Pediatrics and IDDSI). Laws mentioned are California’s; food itself is the same everywhere. Thank you to everyone who keeps this knowledge free.</p></aside>';
  }
  function viewUnit(U, u, subId) {
    var i = U.indexOf(u), prev = U[i - 1], next = U[i + 1], n = 0;
    var html = '<article class="fo-unit fk' + u.num + '">' +
      '<header class="fo-unit-hero"><span class="eyebrow">Unit ' + u.num + ' of ' + U.length + '</span><h1 tabindex="-1">' + u.word + '</h1><p class="fo-unit-sub">' + u.sub + '</p><p class="fo-lede">' + u.lede + '</p>' +
      '<ul class="fo-jumps">' + u.subs.map(function (s, j) { return '<li><a href="' + BASE + '/' + u.id + '/' + s.id + '"><span>' + (s.tool ? 'Tool' : u.num + '.' + (j + 1)) + '</span>' + s.short + '</a></li>'; }).join('') + '</ul></header>' +
      u.subs.map(function (s) {
        if (s.tool) return '<section class="fo-tool" id="fo-' + u.id + '-' + s.id + '"><span class="eyebrow">Tool</span><b class="fo-tool-t">' + s.title + '</b>' + s.html() + '</section>';
        n++;
        return '<section class="fo-sub" id="fo-' + u.id + '-' + s.id + '"><div class="fo-sub-top"><span class="fo-sub-n">' + u.num + '.' + n + '</span><h2>' + s.title + '</h2></div>' + s.html() + '</section>';
      }).join('') +
      '</article><nav class="fo-pager" aria-label="Units">' +
      (prev ? '<a href="' + BASE + '/' + prev.id + '"><small>← Previous</small><b>' + prev.num + ' · ' + prev.word + '</b></a>' : '<a href="' + BASE + '"><small>← Back to</small><b>Overview</b></a>') +
      (next ? '<a class="next" href="' + BASE + '/' + next.id + '"><small>Next unit →</small><b>' + next.num + ' · ' + next.word + '</b></a>' : '<a class="next" href="' + BASE + '"><small>Back to →</small><b>Food overview</b></a>') +
      '</nav>';
    setTimeout(function () {
      runTools();
      var el = subId && document.getElementById('fo-' + u.id + '-' + subId);
      if (el) el.scrollIntoView({ block: 'start' });
    }, 0);
    return html;
  }

  window.MN_LENS_VIEWS = window.MN_LENS_VIEWS || {};
  window.MN_LENS_VIEWS.food = function (sub) {
    T = tags();
    var U = units(), seg = (sub || '').split('/'), u = U.filter(function (x) { return x.id === seg[0]; })[0];
    if (u) return { title: u.word + ' · Food · Kinship', html: layout(U, u.id, viewUnit(U, u, seg[1])) };
    return { title: 'Food · Kinship', html: layout(U, null, viewOverview(U)) };
  };
})();
