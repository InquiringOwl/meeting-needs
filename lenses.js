/* Meeting Needs: the lens catalogue.
   A lens is a way of looking at your home and life: what to notice, what it costs you,
   and what you can fix yourself. Status: ready | building | next | later. */
window.MN_TIERS = [
  {
    id: 'signals', num: 1, name: 'Signals',
    blurb: 'Notice what you actually need, and what is asking to be met. Start here.',
    status: '',
    lenses: [
      {
        id: 'relationships', name: 'Emotions & love', color: '#C2477F', status: 'ready',
        blurb: 'Listening, repair and boundaries at home and next door, plus sharing tools and bulk orders.',
        topics: ['Listening', 'Repair', 'Mutual aid'],
        looks: ['How a disagreement starts and how it gets repaired', 'Boundaries that hold without a fight', 'Neighbours, tool libraries and splitting the bulk order']
      }
    ]
  },
  {
    id: 'roots', num: 2, name: 'Roots',
    blurb: 'The basics of a healthy home.',
    status: 'Being built now',
    lenses: [
      {
        id: 'water', name: 'Water', color: '#2F6E9E', status: 'building',
        blurb: 'Follow it from rain to roof to barrel to tap. Find each contaminant, choose each filter.',
        topics: ['Testing', 'Filters', 'Catchment'],
        looks: ['What your water report says, and what it leaves out', 'Lead, nitrates, PFAS and microbes, and which filter stops which', 'Collecting and storing rainwater safely']
      },
      {
        id: 'gardening', name: 'Gardening', color: '#3E7B3A', status: 'building',
        blurb: 'A teacher and a garden planner: your zone, your light, a 12-month plan, seed by seed.',
        topics: ['Learn', 'Plan', 'Seed saving'],
        looks: ['Your growing zone, frost dates and the light you actually get', 'Soil you can build instead of buy', 'A month-by-month plan for the space you have']
      },
      {
        id: 'toxins', name: 'Toxins', color: '#B4542A', status: 'building',
        blurb: 'See what is in the pan, the bottle and the couch, and swap what matters most first.',
        topics: ['Cookware', 'Plastics', 'Swaps'],
        looks: ['Nonstick coatings (PFAS) and scratched pans', 'Plastics that meet heat, fat or food', 'Fragrance and flame retardants that settle in dust']
      },
      {
        id: 'cleaning', name: 'Cleaning', color: '#23807A', status: 'building',
        blurb: 'Stains, laundry, surfaces and mould with a few simple ingredients. Save the shirt.',
        topics: ['Stains', 'Laundry', 'Surfaces'],
        looks: ['Which stain is which, and what lifts it', 'Washing that is gentler on fabric and skin', 'Mould: what you can clean and when to call it in']
      }
    ]
  },
  {
    id: 'household', num: 3, name: 'Household',
    blurb: 'The systems that keep a home and body running.',
    status: 'Next',
    lenses: [
      {
        id: 'food', name: 'Food', color: '#8E5A0E', status: 'next',
        blurb: 'Store, ferment, can and cook without feeding the wrong microbes.',
        topics: ['Storage', 'Fermenting', 'Canning'],
        looks: ['What spoils, what keeps, and why', 'Fermenting safely with salt and time', 'Canning that seals and stays sealed']
      },
      {
        id: 'airflow', name: 'Airflow', color: '#6A4FC4', status: 'next',
        blurb: 'Float through rooms and pop pollution bubbles with the right tool.',
        topics: ['Ventilation', 'Filters', 'Damp'],
        looks: ['Cooking smoke, gas stoves and stale air', 'Damp, condensation and where mould starts', 'Fans, open windows and filters that are worth it']
      },
      {
        id: 'body-care', name: 'Body care', color: '#B04A6A', status: 'next',
        blurb: 'Skin, teeth and sleep, without the fragrance aisle.',
        topics: ['Skin', 'Teeth', 'Sleep'],
        looks: ['What your skin and teeth need, and what is marketing', 'Sleep you can actually change', 'Simple daily care that replaces a shelf of products']
      },
      {
        id: 'household-chemistry', name: 'Household chemistry', color: '#8A5A3C', status: 'next',
        blurb: 'The medicine cabinet and the cleaning shelf: what to use, what never to mix.',
        topics: ['Labels', 'Storage', 'Never mix'],
        looks: ['Reading a label for what is actually in it', 'Pairs that must never meet, like bleach and ammonia', 'Storing and disposing of what you keep']
      }
    ]
  },
  {
    id: 'craft', num: 4, name: 'Craft',
    blurb: 'Hands-on skills to make, mend and build.',
    status: 'Later',
    lenses: [
      {
        id: 'repair', name: 'Repair', color: '#4F5D6B', status: 'later',
        blurb: 'Diagnose, open up and mend what usually gets thrown out, clothes included.',
        topics: ['Tools', 'Electronics', 'Mending'],
        looks: ['Finding the actual fault before buying anything', 'Opening things that were built to stay shut', 'Patches, darns and seams that last']
      },
      {
        id: 'herbalism', name: 'Herbalism', color: '#5C7A2E', status: 'later',
        blurb: 'Grow, dry and prepare herbs, with dose and evidence beside each.',
        topics: ['Growing', 'Drying', 'Dosing'],
        looks: ['Which herbs have evidence behind them, and how much', 'Drying and storing so they keep their strength', 'Doses, interactions and when to see a clinician']
      },
      {
        id: 'bikes', name: 'Bikes', color: '#2B6C8C', status: 'later',
        blurb: 'True a wheel, tune gears, fix a flat on the road.',
        topics: ['Wheels', 'Gears', 'Flats'],
        looks: ['The few tools that fix most problems', 'Gears and brakes you can adjust yourself', 'Getting home after a flat']
      },
      {
        id: 'carpentry', name: 'Carpentry', color: '#8B5E34', status: 'later',
        blurb: 'Read the grain, cut true angles, join without nails.',
        topics: ['Grain', 'Cuts', 'Joinery'],
        looks: ['How wood moves with the seasons', 'Measuring and cutting square', 'Joints that hold without hardware']
      },
      {
        id: 'identification', name: 'Identification', color: '#3F6E4A', status: 'later',
        blurb: 'Name the plants and animals around you, and tell look-alikes apart.',
        topics: ['Plants', 'Fungi', 'Animals'],
        looks: ['The features that actually separate species', 'Edible plants and their dangerous twins', 'Tracks, calls and signs of who lives nearby']
      },
      {
        id: 'home-building', name: 'Home-building', color: '#7A5C3E', status: 'later',
        blurb: 'Timber and metal frames, plus cob, adobe and lime.',
        topics: ['Framing', 'Cob', 'Lime'],
        looks: ['How a frame carries its load', 'Earth and lime walls that breathe', 'Materials that are kinder to build with and live in']
      },
      {
        id: 'caretaking', name: 'Caretaking', color: '#A0566E', status: 'later',
        blurb: 'Caring for the people and animals who depend on you: elders, disabled loved ones, kids and pets.',
        topics: ['Eldercare', 'Disability care', 'Childcare', 'Animal care'],
        looks: ['Daily routines, medications and appointments without burning out', 'Accessible spaces and asking for the help you are owed', 'Childcare swaps, pet care and sharing the load with neighbours']
      },
      {
        id: 'first-aid', name: 'First aid', color: '#B8433A', status: 'later',
        blurb: 'Cuts, burns, sprains, choking and bites: what to do in the first minutes.',
        topics: ['Wounds', 'Burns', 'Sprains', 'Emergencies'],
        looks: ['Stopping bleeding and cleaning a wound', 'Burns, breaks and sprains: what helps and what makes it worse', 'When to call emergency services, and what to do until they arrive']
      },
      {
        id: 'energy', name: 'Energy', color: '#B5791F', status: 'later',
        blurb: 'Heat, cook and stay warm with less: fireplaces, gas, insulation and more.',
        topics: ['Fireplaces', 'Cooking', 'Gas', 'Insulation'],
        looks: ['Fireplaces and wood stoves that burn clean and safe', 'Gas appliances, leaks and carbon monoxide', 'Insulation and draught-proofing that cut the bill']
      },
      {
        id: 'weather', name: 'Weather', color: '#4A7FA8', status: 'later',
        blurb: 'Read the sky: which clouds bring rain, and the seasonal patterns where you live.',
        topics: ['Clouds', 'Wind', 'Seasons'],
        looks: ['Cloud types and which ones turn to rain', 'Wind, pressure and the signs before a storm', 'Your local seasons, frost and rainfall patterns']
      }
    ]
  }
];
