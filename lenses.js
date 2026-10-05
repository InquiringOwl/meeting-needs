/* Kinship: the lens catalogue.
   A lens is a way of looking at your home and life: what to notice, what it costs you,
   and what you can fix yourself. Status: ready | building | next | soon | later.
   Each tier has one colour; every lens in it shares that colour. In a locked tier, only ready lenses are clickable. */
window.MN_TIERS = [
  {
    id: 'signals', num: 1, name: 'Signals', color: '#C2477F',
    blurb: 'Start here. Notice your emotions, pointing to unmet needs, and who lives around you.',
    lenses: [
      {
        id: 'relationships', name: 'Emotions & love', status: 'ready',
        blurb: 'Hear your own needs, meet others’ with kindness, and find strategies that work for everyone.',
        topics: ['Nonviolence', 'Relationships', 'Dialogues'],
        looks: ['Feelings as signals, and the universal needs they point to', 'Requests instead of demands, and dialogue where both sets of needs count', 'Children, neighbors, animals, cooperatives and power shared instead of held over']
      },
      {
        id: 'identification', name: 'Identification', status: 'soon',
        blurb: 'Name the plants and animals around you, and learn the few real local dangers.',
        topics: ['Plants', 'Fungi', 'Animals'],
        looks: ['The features that actually separate species', 'Edible plants and their dangerous twins', 'Tracks, calls and signs of who lives nearby']
      }
    ]
  },
  {
    id: 'roots', num: 2, name: 'Roots', color: '#B85A14',
    blurb: 'Fundamentals supporting all healthy life.', locked: true,
    lenses: [
      {
        id: 'water', name: 'Water', status: 'ready',
        blurb: 'How we use, find, store, clean, test and pay for water, at every scale from a studio to a farm to a sidewalk.',
        topics: ['Uses', 'Sources', 'Storage', 'Purify', 'Testing', 'Costs'],
        looks: ['Which water each job needs, and gray water', 'Taps, refills, rain, wells, springs and wild water', 'Containers that keep water safe', 'Filters and permanent systems, plus crisis methods', 'Knowing it’s safe, at the tap and in a lake', 'What water costs, and the household math']
      },
      {
        id: 'food', name: 'Food', status: 'ready',
        blurb: 'Find, cleanse, rehydrate, cook and store plant foods safely, soften them for sick days, and feed your animals.',
        topics: ['Gather', 'Cleanse', 'Rehydrate', 'Cook', 'Store', 'Gentle', 'Companions'],
        looks: ['Free, shared, bought, grown and foraged food', 'Washing produce, greens, grains and rice well', 'Soaking beans, grains and dried foods, and sprouting', 'Safe heat, little fuel, cooking with kids and a full plate', 'Cold, pantry, leftovers, preserving, and the animals who visit', 'Babies’ first foods, soft textures for sore mouths, and food as medicine', 'What companion animals eat in nature, kibble and raw, and plant-based options']
      },
      {
        id: 'air', name: 'Air', status: 'ready',
        blurb: 'What’s in the air, reading it around fires and storms, and how ventilation, vacuuming and shade clear it.',
        topics: ['What’s in it', 'Ventilation', 'Dust', 'Heat & smoke', 'Sun & temperature'],
        looks: ['Particles, gases, living things, and what disasters add to the air', 'Moving air to cleanse it: windows, fans, filters and damp', 'Vacuuming and damp cleaning, new things, asbestos and lead', 'Cooking, gas, nonstick, smoke and solvents, and companions’ lungs', 'Heat waves, shade, cold, and sun on skin']
      },
      {
        id: 'toxins', name: 'Poisons', status: 'ready',
        blurb: 'See what is in the pan, the can, the couch and the ground, and swap what matters most first, one at a time.',
        topics: ['Exposures', 'Plastics', 'In the home', 'Pesticides', 'Soil', 'Living toxins', 'Neighbors'],
        looks: ['How exposures work, and what a healthy home is made of', 'Plastics, when a tarp is the safer bet, can linings, PFAS and pans', 'Cleaners, fragrance, furniture, dust and washing produce', 'Glyphosate, treated wood, potting mix and drift', 'Lead and legacy metals, tested once in one batch', 'Molds, algal blooms and plants that harm companions', 'Freeways, factories, wells, fire and changing it together']
      }
    ]
  },
  {
    id: 'protect', num: 3, name: 'Protect', color: '#A87700',
    blurb: 'Keep every body and the home safe: shelter, cleaning, care and protection.',
    lenses: [
      {
        id: 'shelter', name: 'Shelter', status: 'next',
        blurb: 'Temporary shelter: tents, tarps, vehicles and quick fixes for staying dry, warm and safe when home isn’t steady.',
        topics: ['Tents & tarps', 'Vehicles', 'Warmth', 'Safe places'],
        looks: ['Pitching a tarp or tent that sheds rain and wind', 'Living in a car, van or RV: sleep, air, heat and parking', 'Staying warm and dry with little: layers, ground insulation and condensation', 'Shelters, safe parking programs and legal places to stay']
      },
      {
        id: 'cleaning', name: 'Cleaning', status: 'ready',
        blurb: 'Water first, then a short ladder of gentle helpers for counters, stains and laundry, safe around kids and animals.',
        topics: ['Water', 'Gentle shelf', 'Surfaces', 'Stains', 'Laundry'],
        looks: ['Why water and a good cloth do most of the work', 'Soap, baking soda, vinegar and peroxide: what each is for, and what never mixes', 'Counters by material, boards, oven, bathroom, floors and ants', 'Which stain is which, and what lifts it', 'Laundry that is gentler on fabric, skin and water']
      },
      {
        id: 'body-care', name: 'Body care', status: 'next',
        blurb: 'Care for every body at home: little and aging ones, disabled and different bodies, and the animals you live with.',
        topics: ['Children', 'Aging', 'Diversity', 'Sun', 'Animal care'],
        looks: ['Sun on skin: shade, clothing and mineral (zinc oxide) sunscreen', 'Skin, teeth and sleep for children and growing bodies', 'Aging bodies, and the care that keeps them comfortable', 'Disabilities and different bodies, plus the animals who share your home', 'Gentle foods for sick days and food as medicine (starts in Food → Gentle)']
      },
      {
        id: 'self-defense', name: 'Self-defense', status: 'next',
        blurb: 'Keep yourself, your people and your home safe: noticing early, calming things with words, and getting away.',
        topics: ['Noticing', 'De-escalation', 'Getting away', 'Home'],
        looks: ['Trusting the early feeling that something is off, and leaving early', 'De-escalation: distance, calm and words before anything else', 'Simple protective moves for breaking free and getting away', 'Home preparation: locks, lights, a safe room, a plan and neighbors who check in (with Emergency prep)']
      }
    ]
  },
  {
    id: 'nurture', num: 4, name: 'Nurture', color: '#3E7B3A',
    blurb: 'Power, salvage, grow, harvest and compost, with good tools and an eye on the weather.',
    lenses: [
      {
        id: 'energy', name: 'Energy & light', status: 'soon',
        blurb: 'Heat, light, cook and stay warm with less: fireplaces, gas, lighting, insulation and more.',
        topics: ['Fireplaces', 'Cooking', 'Gas', 'Light', 'Insulation'],
        looks: ['Fireplaces and wood stoves that burn clean and safe', 'Gas appliances, leaks and carbon monoxide', 'Daylight, bulbs and staying lit through an outage', 'Insulation and draught-proofing that cut the bill']
      },
      {
        id: 'salvaging', name: 'Salvaging', status: 'soon',
        blurb: 'Rescue unwanted things: curb finds, free groups, reuse centers and scrap, plus cleaning and storing what you save.',
        topics: ['Finding', 'Asking', 'Checking', 'Saving'],
        looks: ['Where unwanted things gather: curbs, free groups, reuse centers and move-out days', 'Asking for, sharing and trading what others are letting go', 'Checking finds for bedbugs, mold, lead and recalls before they come home', 'Cleaning, fixing and storing so saved things stay useful (with Repair)']
      },
      {
        id: 'gardening', name: 'Growing', status: 'soon',
        blurb: 'Your teacher and planner: climate zone, soil, a 12-month plan, pruning, and new plants from cuttings.',
        topics: ['Learn', 'Plan', 'Prune', 'Seed saving'],
        looks: ['Your growing zone, frost dates and the light you actually get', 'Soil you can build instead of buy', 'A month-by-month plan for the space you have', 'Pruning that keeps plants young, and free plants from cuttings']
      },
      {
        id: 'harvesting', name: 'Harvesting', status: 'soon',
        blurb: 'Cut, dry and store what plants give, herb by herb from rosemary and lavender, and what’s safe for cats and dogs.',
        topics: ['Cutting', 'Drying', 'Storing', 'Herb by herb', 'Animals'],
        looks: ['When and how much to cut so the plant thrives', 'Sorting a big pile of trimmings, then rinsing and drying it', 'Jars, freezing, and how long dried herbs keep', 'Herb by herb: rosemary for the kitchen, lavender for scent and baking', 'Which plants and oils are safe for cats, dogs, horses and birds (lavender and essential oils are hard on cats)']
      },
      {
        id: 'composting-waste', name: 'Composting & waste', status: 'soon',
        blurb: 'Turn scraps into soil and handle waste safely, with the grid as the usual best bet and septic as an option.',
        topics: ['Scraps', 'Sewage', 'Worms'],
        looks: ['Compost and worm bins that don’t smell', 'How sewage and septic systems work, and why the grid is usually safest', 'Sending less of everything else away']
      },
      {
        id: 'household-tools', name: 'Tools', status: 'soon',
        blurb: 'The toolbox, the cleaning shelf and the medicine cabinet: what tools do, and how to use them safely.',
        topics: ['Tools', 'Chemistry', 'Safety'],
        looks: ['The few tools that handle most jobs', 'Reading a label for what is actually in it', 'Pairs that must never meet, like bleach and ammonia']
      },
      {
        id: 'weather', name: 'Weather', status: 'soon',
        blurb: 'Read the sky: which clouds bring rain, and the seasonal patterns where you live.',
        topics: ['Clouds', 'Wind', 'Seasons'],
        looks: ['Cloud types and which ones turn to rain', 'Wind, pressure and the signs before a storm', 'Your local seasons, frost and rainfall patterns']
      }
    ]
  },
  {
    id: 'resilience', num: 5, name: 'Resilience', color: '#2F6E9E',
    blurb: 'Withstand hard times: emergencies, injuries, plant medicine and basic repairs.',
    lenses: [
      {
        id: 'emergency-prep', name: 'Emergency prep', status: 'building',
        blurb: 'Natural disasters, personal safety and securing your home: plan ahead so you can stay calm when it counts.',
        topics: ['What to prep for', 'Disasters', 'Self-defense', 'Home security'],
        looks: ['What to prep for: wildfire, earthquakes, heat, floods, outages and animals', 'Go-bags, water and supplies for earthquakes, fires and floods', 'Personal safety, building on the Self-defense lens', 'Simple ways to secure doors, windows and your home']
      },
      {
        id: 'first-aid', name: 'First aid', status: 'later',
        blurb: 'Cuts, burns, sprains, choking and bites: what to do in the first minutes.',
        topics: ['Wounds', 'Burns', 'Sprains', 'Emergencies'],
        looks: ['Stopping bleeding and cleaning a wound', 'Burns, breaks and sprains: what helps and what makes it worse', 'When to call emergency services, and what to do until they arrive', 'Fluids and gentle food after vomiting, diarrhea or heat (from Food → Gentle)']
      },
      {
        id: 'herbalism', name: 'Herbalism', status: 'later',
        blurb: 'Plant medicines: teas, oils, salves and tinctures, with dose, evidence and interactions beside each.',
        topics: ['Preparations', 'Dosing', 'Evidence'],
        looks: ['Which plant medicines have evidence behind them, and how much', 'Teas, infused oils, salves and tinctures made at home', 'Doses, medicines that don’t mix, kids, pregnancy and animals, and when to see a clinician']
      },
      {
        id: 'repair', name: 'Basic repairs', status: 'later',
        blurb: 'Diagnose, open up and mend what usually gets thrown out.',
        topics: ['Tools', 'Electronics', 'Mending'],
        looks: ['Finding the actual fault before buying anything', 'Opening things that were built to stay shut', 'Fixes that keep things out of the landfill']
      }
    ]
  },
  {
    id: 'craft', num: 6, name: 'Craft', color: '#7A4FB0',
    blurb: 'Hands-on skills to make, mend and build.',
    lenses: [
      {
        id: 'sewing', name: 'Sewing', status: 'later',
        blurb: 'Patch, hem, alter and make clothes and soft things, by hand or machine.',
        topics: ['Mending', 'Patterns', 'Machines'],
        looks: ['Patches, darns and seams that last', 'Reading and adjusting a pattern', 'Hand stitching and getting along with a machine']
      },
      {
        id: 'bikes', name: 'Bikes', status: 'later',
        blurb: 'True a wheel, tune gears, fix a flat on the road.',
        topics: ['Wheels', 'Gears', 'Flats'],
        looks: ['The few tools that fix most problems', 'Gears and brakes you can adjust yourself', 'Getting home after a flat']
      },
      {
        id: 'carpentry', name: 'Carpentry', status: 'later',
        blurb: 'Read the grain, cut true angles, join without nails.',
        topics: ['Grain', 'Cuts', 'Joinery'],
        looks: ['How wood moves with the seasons', 'Measuring and cutting square', 'Joints that hold without hardware']
      },
      {
        id: 'home-building', name: 'Home-building', status: 'later',
        blurb: 'Timber and metal frames, plus cob, adobe and lime.',
        topics: ['Framing', 'Cob', 'Lime'],
        looks: ['How a frame carries its load', 'Earth and lime walls that breathe', 'Materials that are kinder to build with and live in']
      },
      {
        id: 'interior-design', name: 'Interior design', status: 'later',
        blurb: 'Sunlight, layout, and permanent stations built around your natural habits.',
        topics: ['Sunlight', 'Layout', 'Stations'],
        looks: ['Following the sun through your rooms', 'Layouts that make daily paths easy', 'Stations that sit where your habits already happen']
      },
      {
        id: 'digital', name: 'Digital world', status: 'later',
        blurb: 'Libraries, open tools and connection on one side; surveillance and attention-for-profit on the other.',
        topics: ['Needs it meets', 'Libraries', 'Surveillance', 'Open tools'],
        looks: ['Which needs a screen is meeting right now (learning, connection, help) and which it’s pulling from (rest, presence, play)', 'Public libraries: free internet, devices, classes and quiet, and the librarians who protect your privacy', 'Surveillance: what apps, ad trackers, data brokers and cameras collect, and the free settings that cut most of it', 'Open-source tools, repair and keeping old devices going, so digital life serves people instead of profit']
      },
      {
        id: 'governance', name: 'Governance', status: 'building',
        blurb: 'What legally stops people from meeting basic needs, and how to advocate, in the systems we have and beyond them.',
        topics: ['Decision-makers', 'Criminalization', 'Stairs for change'],
        looks: ['Who controls California’s water, and how they’re chosen', 'Where the water goes', 'Criminalization and incarceration: when meeting a need becomes a crime', 'Stairs for change: art, talk, public comment, representatives, organizing, voting, peaceful protest, and paths outside law']
      },
      {
        id: 'death-seasons', name: 'Death & cycles', status: 'later',
        blurb: 'Seasons, death feeding new life, and the peaceful consensus that keeps ecosystems in balance.',
        topics: ['Cycles', 'Renewal', 'Consensus'],
        looks: ['Seasons and the cycles of growth, decay and return', 'How death and decomposition feed new life', 'Consensus and peaceful self-governance in nature']
      }
    ]
  }
];
/* Every lens takes its tier's colour. */
window.MN_TIERS.forEach(function (t) { t.lenses.forEach(function (l) { l.color = t.color; }); });
