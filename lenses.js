/* Kinship: the lens catalogue.
   A lens is a way of looking at your home and life: what to notice, what it costs you,
   and what you can fix yourself. Status: ready | building | next | later.
   Each tier has one colour; every lens in it shares that colour. In a locked tier, only ready lenses are clickable. */
window.MN_TIERS = [
  {
    id: 'signals', num: 1, name: 'Signals', color: '#C2477F',
    blurb: 'Start here. Notice your emotions, pointing to unmet needs.',
    status: '',
    lenses: [
      {
        id: 'relationships', name: 'Emotions & love', status: 'ready',
        blurb: 'Hear your own needs, meet others’ with kindness, and find strategies that work for everyone.',
        topics: ['Nonviolence', 'Relationships', 'Dialogues'],
        looks: ['Feelings as signals, and the universal needs they point to', 'Requests instead of demands, and dialogue where both sets of needs count', 'Children, neighbors, animals, cooperatives and power shared instead of held over']
      }
    ]
  },
  {
    id: 'roots', num: 2, name: 'Roots', color: '#B85A14',
    blurb: 'Fundamentals supporting all healthy life.',
    status: 'In progress', locked: true,
    lenses: [
      {
        id: 'water', name: 'Water', status: 'ready',
        blurb: 'How we use, find, store, clean, test and pay for water, at every scale from a studio to a farm to a sidewalk.',
        topics: ['Uses', 'Sources', 'Storage', 'Purify', 'Testing', 'Costs'],
        looks: ['Which water each job needs, and gray water', 'Taps, refills, rain, wells, springs and wild water', 'Containers that keep water safe', 'Filters and permanent systems, plus crisis methods', 'Knowing it’s safe, at the tap and in a lake', 'What water costs, and the household math']
      },
      {
        id: 'food', name: 'Food', status: 'ready',
        blurb: 'Find, cleanse, rehydrate, cook and store plant foods safely, with a full kitchen, a hot plate or no kitchen at all.',
        topics: ['Gather', 'Cleanse', 'Rehydrate', 'Cook', 'Store'],
        looks: ['Free, shared, bought, grown and foraged food', 'Washing produce, greens, grains and rice well', 'Soaking beans, grains and dried foods, and sprouting', 'Safe heat, little fuel, cooking with kids and a full plate', 'Cold, pantry, leftovers, preserving, and the animals who visit']
      },
      {
        id: 'air', name: 'Air', status: 'building',
        blurb: 'Your quickest read on air quality: what’s in the room right now, and the fastest fix.',
        topics: ['Quality', 'Ventilation', 'Filters'],
        looks: ['Cooking smoke, gas stoves and stale air', 'Damp, condensation and where mold starts', 'Fans, open windows and filters that are worth it']
      },
      {
        id: 'cleaning', name: 'Cleaning', status: 'building',
        blurb: 'Stains, laundry, surfaces and mold with a few simple ingredients.',
        topics: ['Stains', 'Laundry', 'Surfaces'],
        looks: ['Which stain is which, and what lifts it', 'Washing that is gentler on fabric and skin', 'Mold: what you can clean and when to call it in']
      },
      {
        id: 'toxins', name: 'Toxins', status: 'ready',
        blurb: 'See what is in the pan, the can, the couch and the ground, and swap what matters most first, one at a time.',
        topics: ['Exposures', 'Plastics', 'In the home', 'Pesticides', 'Soil', 'Living toxins', 'Neighbors'],
        looks: ['How exposures work, and what a healthy home is made of', 'Plastics, can linings, PFAS and pans', 'Cleaners, fragrance, furniture, dust and washing produce', 'Glyphosate, treated wood, potting mix and drift', 'Lead and legacy metals, tested once in one batch', 'Molds, algal blooms and plants that harm companions', 'Freeways, factories, wells, fire and changing it together']
      }
    ]
  },
  {
    id: 'nurture', num: 3, name: 'Nurture', color: '#3E7B3A',
    blurb: 'Maintenance-minded self-care and useful plants.',
    status: 'Next',
    lenses: [
      {
        id: 'body-care', name: 'Body care', status: 'next',
        blurb: 'Care for every body in the home: little ones and aging ones, honoring the diversity of bodies including disabilities, and the animals who live with you.',
        topics: ['Children', 'Aging', 'Diversity', 'Animal care'],
        looks: ['Skin, teeth and sleep for children and growing bodies', 'Aging bodies, and the care that keeps them comfortable', 'Disabilities and different bodies, plus the animals who share your home']
      },
      {
        id: 'gardening', name: 'Gardening', status: 'next',
        blurb: 'Your teacher and planner: how to plant, your climate zone, a 12-month plan, and what to expect.',
        topics: ['Learn', 'Plan', 'Seed saving'],
        looks: ['Your growing zone, frost dates and the light you actually get', 'Soil you can build instead of buy', 'A month-by-month plan for the space you have']
      },
      {
        id: 'identification', name: 'Identification', status: 'next',
        blurb: 'Name the plants and animals around you, and learn the few real local dangers.',
        topics: ['Plants', 'Fungi', 'Animals'],
        looks: ['The features that actually separate species', 'Edible plants and their dangerous twins', 'Tracks, calls and signs of who lives nearby']
      },
      {
        id: 'household-tools', name: 'Household tools', status: 'next',
        blurb: 'The toolbox, the cleaning shelf and the medicine cabinet: what tools do, and how to use them safely.',
        topics: ['Tools', 'Chemistry', 'Safety'],
        looks: ['The few tools that handle most jobs', 'Reading a label for what is actually in it', 'Pairs that must never meet, like bleach and ammonia']
      },
      {
        id: 'composting-waste', name: 'Composting & waste', status: 'next',
        blurb: 'Turn scraps into soil and handle waste safely. For most homes the grid is the best bet, but it’s good to know septic and other alternatives.',
        topics: ['Scraps', 'Sewage', 'Worms'],
        looks: ['Compost and worm bins that don’t smell', 'How sewage and septic systems work, and why the grid is usually safest', 'Sending less of everything else away']
      }
    ]
  },
  {
    id: 'resilience', num: 4, name: 'Resilience', color: '#2F6E9E',
    blurb: 'Withstand harder times: injuries, outages, storms, and breakdowns.',
    status: 'Later',
    lenses: [
      {
        id: 'first-aid', name: 'First aid', status: 'later',
        blurb: 'Cuts, burns, sprains, choking and bites: what to do in the first minutes.',
        topics: ['Wounds', 'Burns', 'Sprains', 'Emergencies'],
        looks: ['Stopping bleeding and cleaning a wound', 'Burns, breaks and sprains: what helps and what makes it worse', 'When to call emergency services, and what to do until they arrive']
      },
      {
        id: 'energy', name: 'Energy', status: 'later',
        blurb: 'Heat, cook and stay warm with less: fireplaces, gas, insulation and more.',
        topics: ['Fireplaces', 'Cooking', 'Gas', 'Insulation'],
        looks: ['Fireplaces and wood stoves that burn clean and safe', 'Gas appliances, leaks and carbon monoxide', 'Insulation and draught-proofing that cut the bill']
      },
      {
        id: 'weather', name: 'Weather', status: 'later',
        blurb: 'Read the sky: which clouds bring rain, and the seasonal patterns where you live.',
        topics: ['Clouds', 'Wind', 'Seasons'],
        looks: ['Cloud types and which ones turn to rain', 'Wind, pressure and the signs before a storm', 'Your local seasons, frost and rainfall patterns']
      },
      {
        id: 'death-seasons', name: 'Death & seasons', status: 'later',
        blurb: 'How nature runs itself: seasons, death feeding new life, and the natural consensus and peaceful self-governance that keep ecosystems in balance.',
        topics: ['Cycles', 'Renewal', 'Consensus'],
        looks: ['Seasons and the cycles of growth, decay and return', 'How death and decomposition feed new life', 'Consensus and peaceful self-governance in nature']
      }
    ]
  },
  {
    id: 'craft', num: 5, name: 'Craft', color: '#7A4FB0',
    blurb: 'Hands-on skills to make, mend and build.',
    status: 'Later',
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
        id: 'herbalism', name: 'Herbalism', status: 'later',
        blurb: 'Grow, dry and prepare herbs, with dose and evidence beside each.',
        topics: ['Growing', 'Drying', 'Dosing'],
        looks: ['Which herbs have evidence behind them, and how much', 'Drying and storing so they keep their strength', 'Doses, interactions and when to see a clinician']
      },
      {
        id: 'interior-design', name: 'Interior design', status: 'later',
        blurb: 'Sunlight, layout, and permanent stations built around your natural habits.',
        topics: ['Sunlight', 'Layout', 'Stations'],
        looks: ['Following the sun through your rooms', 'Layouts that make daily paths easy', 'Stations that sit where your habits already happen']
      },
      {
        id: 'repair', name: 'Repair', status: 'later',
        blurb: 'Diagnose, open up and mend what usually gets thrown out.',
        topics: ['Tools', 'Electronics', 'Mending'],
        looks: ['Finding the actual fault before buying anything', 'Opening things that were built to stay shut', 'Fixes that keep things out of the landfill']
      },
      {
        id: 'emergency-prep', name: 'Emergency preparedness', status: 'later',
        blurb: 'Natural disasters, personal self-defense and securing your home: plan ahead so you can stay calm when it counts.',
        topics: ['Disasters', 'Self-defense', 'Home security'],
        looks: ['Go-bags, water and supplies for earthquakes, fires and floods', 'Personal safety and self-defense basics', 'Simple ways to secure doors, windows and your home']
      },
      {
        id: 'governance', name: 'Governance', status: 'building',
        blurb: 'Who decides where shared water, air and land go, and the stairs from noticing to changing it.',
        topics: ['Decision-makers', 'Transparency', 'Stairs for change'],
        looks: ['Who controls California’s water, and how they’re chosen', 'Where the water goes', 'Stairs for change: art, talk, public comment, representatives, organizing, voting, peaceful protest']
      }
    ]
  }
];
/* Every lens takes its tier's colour. */
window.MN_TIERS.forEach(function (t) { t.lenses.forEach(function (l) { l.color = t.color; }); });
