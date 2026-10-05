/* Relationships lens: course data (skill tree, feelings, needs, translator, examples).
   Built on Marshall B. Rosenberg's Nonviolent Communication. Feelings and needs lists
   are adapted from the Center for Nonviolent Communication's inventories (cnvc.org).
   Four units (feel, need, request, dialogue), one page each; sub-units are sections on that page. */
window.MN_REL = (function () {

  /* ---------- Needs (universal: no person, place, object or time inside) ---------- */
  var NEEDS = [
    { id: 'body', name: 'Body', blurb: 'What keeps a body alive and well', items: ['food', 'water', 'clean air', 'rest', 'sleep', 'movement', 'shelter', 'warmth', 'touch', 'health'] },
    { id: 'safety', name: 'Safety', blurb: 'Feeling secure enough to relax', items: ['safety', 'security', 'stability', 'predictability', 'protection', 'trust'] },
    { id: 'connection', name: 'Connection', blurb: 'Being with and known by others', items: ['connection', 'belonging', 'closeness', 'companionship', 'to be seen', 'to be heard', 'understanding', 'empathy', 'care', 'respect', 'acceptance', 'appreciation', 'support', 'consideration', 'cooperation', 'mutuality', 'fairness'] },
    { id: 'autonomy', name: 'Freedom', blurb: 'Choosing for yourself', items: ['freedom', 'choice', 'autonomy', 'independence', 'space', 'spontaneity'] },
    { id: 'honesty', name: 'Honesty', blurb: 'Being real with yourself and others', items: ['honesty', 'authenticity', 'integrity', 'presence', 'clarity'] },
    { id: 'peace', name: 'Peace', blurb: 'Ease in the body and the home', items: ['ease', 'order', 'calm', 'beauty', 'harmony', 'equality'] },
    { id: 'play', name: 'Play', blurb: 'Joy for its own sake', items: ['play', 'fun', 'humour', 'adventure', 'stimulation'] },
    { id: 'meaning', name: 'Meaning', blurb: 'A life that matters to you', items: ['purpose', 'contribution', 'competence', 'growth', 'learning', 'creativity', 'hope', 'celebration', 'mourning', 'inspiration'] }
  ];

  /* ---------- Feelings wheel (descriptions of inside, never of what someone did) ---------- */
  var WHEEL = {
    unmet: {
      label: 'When needs aren’t met',
      families: [
        { id: 'sad', name: 'Sad', hue: 222, words: ['sad', 'lonely', 'disappointed', 'discouraged', 'wistful'], needs: ['connection', 'belonging', 'to be seen', 'closeness', 'hope'] },
        { id: 'scared', name: 'Scared', hue: 268, words: ['scared', 'anxious', 'worried', 'nervous', 'wary'], needs: ['safety', 'predictability', 'trust', 'stability', 'support'] },
        { id: 'angry', name: 'Mad', hue: 8, words: ['angry', 'frustrated', 'irritated', 'resentful', 'furious'], needs: ['respect', 'fairness', 'choice', 'consideration', 'to be heard'] },
        { id: 'tense', name: 'Tense', hue: 32, words: ['tense', 'overwhelmed', 'stressed', 'restless', 'cranky'], needs: ['ease', 'order', 'space', 'rest', 'support'] },
        { id: 'tired', name: 'Tired', hue: 200, words: ['tired', 'exhausted', 'depleted', 'weary', 'burnt out'], needs: ['rest', 'sleep', 'food', 'support', 'ease'] },
        { id: 'confused', name: 'Confused', hue: 172, words: ['confused', 'torn', 'puzzled', 'lost', 'hesitant'], needs: ['clarity', 'understanding', 'learning', 'purpose', 'choice'] },
        { id: 'hurt', name: 'Hurt', hue: 330, words: ['hurt', 'grieving', 'heartbroken', 'aching', 'regretful'], needs: ['care', 'mourning', 'to be seen', 'trust', 'empathy'] },
        { id: 'numb', name: 'Disconnected', hue: 240, words: ['numb', 'withdrawn', 'bored', 'distant', 'detached'], needs: ['connection', 'stimulation', 'purpose', 'play', 'presence'] },
        { id: 'embarrassed', name: 'Embarrassed', hue: 350, words: ['embarrassed', 'ashamed', 'self-conscious', 'flustered', 'guilty'], needs: ['acceptance', 'belonging', 'integrity', 'respect', 'growth'] }
      ]
    },
    met: {
      label: 'When needs are met',
      families: [
        { id: 'joyful', name: 'Joyful', hue: 45, words: ['happy', 'delighted', 'glad', 'amused', 'elated'], needs: ['play', 'fun', 'celebration', 'connection'] },
        { id: 'peaceful', name: 'Peaceful', hue: 160, words: ['calm', 'relaxed', 'content', 'centred', 'relieved'], needs: ['ease', 'calm', 'safety', 'rest'] },
        { id: 'grateful', name: 'Grateful', hue: 95, words: ['grateful', 'moved', 'touched', 'appreciative', 'thankful'], needs: ['appreciation', 'care', 'support', 'contribution'] },
        { id: 'engaged', name: 'Engaged', hue: 190, words: ['curious', 'absorbed', 'interested', 'fascinated', 'alert'], needs: ['learning', 'stimulation', 'growth', 'creativity'] },
        { id: 'affectionate', name: 'Affectionate', hue: 335, words: ['warm', 'tender', 'loving', 'friendly', 'open-hearted'], needs: ['closeness', 'touch', 'belonging', 'companionship'] },
        { id: 'hopeful', name: 'Hopeful', hue: 60, words: ['hopeful', 'encouraged', 'optimistic', 'eager', 'expectant'], needs: ['hope', 'purpose', 'growth', 'inspiration'] },
        { id: 'refreshed', name: 'Refreshed', hue: 125, words: ['rested', 'refreshed', 'renewed', 'energised', 'alive'], needs: ['rest', 'sleep', 'movement', 'clean air'] },
        { id: 'confident', name: 'Confident', hue: 210, words: ['confident', 'safe', 'empowered', 'proud', 'secure'], needs: ['competence', 'security', 'autonomy', 'trust'] }
      ]
    }
  };

  /* ---------- Accusation words: a "you did this to me" hiding inside ---------- */
  var FAUX = [
    { word: 'abandoned', hidden: 'You left me.', feelings: ['lonely', 'scared', 'sad'], needs: ['connection', 'belonging', 'support', 'safety'] },
    { word: 'violated', hidden: 'You crossed my line.', feelings: ['scared', 'angry', 'tense'], needs: ['safety', 'respect', 'choice', 'trust'] },
    { word: 'ignored', hidden: 'You didn’t pay attention to me.', feelings: ['lonely', 'hurt', 'frustrated'], needs: ['to be seen', 'to be heard', 'consideration', 'connection'] },
    { word: 'dismissed', hidden: 'You brushed me off.', feelings: ['hurt', 'frustrated', 'discouraged'], needs: ['to be heard', 'respect', 'understanding'] },
    { word: 'attacked', hidden: 'You came at me.', feelings: ['scared', 'angry', 'tense'], needs: ['safety', 'respect', 'calm'] },
    { word: 'humiliated', hidden: 'You shamed me.', feelings: ['embarrassed', 'hurt', 'angry'], needs: ['respect', 'acceptance', 'belonging'] },
    { word: 'betrayed', hidden: 'You broke my trust.', feelings: ['hurt', 'angry', 'heartbroken'], needs: ['trust', 'honesty', 'safety'] },
    { word: 'manipulated', hidden: 'You tricked me into it.', feelings: ['angry', 'wary', 'confused'], needs: ['choice', 'honesty', 'autonomy', 'trust'] },
    { word: 'rejected', hidden: 'You pushed me away.', feelings: ['hurt', 'sad', 'lonely'], needs: ['acceptance', 'belonging', 'closeness'] },
    { word: 'unappreciated', hidden: 'You don’t value what I do.', feelings: ['discouraged', 'tired', 'resentful'], needs: ['appreciation', 'to be seen', 'mutuality'] },
    { word: 'misunderstood', hidden: 'You got me wrong.', feelings: ['frustrated', 'lonely', 'discouraged'], needs: ['understanding', 'to be heard', 'clarity'] },
    { word: 'pressured', hidden: 'You’re pushing me.', feelings: ['tense', 'anxious', 'resentful'], needs: ['choice', 'autonomy', 'ease', 'space'] },
    { word: 'used', hidden: 'You took without giving.', feelings: ['angry', 'resentful', 'hurt'], needs: ['mutuality', 'fairness', 'respect'] },
    { word: 'neglected', hidden: 'You didn’t take care of me.', feelings: ['lonely', 'sad', 'hurt'], needs: ['care', 'support', 'connection'] },
    { word: 'interrupted', hidden: 'You cut me off.', feelings: ['frustrated', 'irritated'], needs: ['to be heard', 'respect', 'consideration'] },
    { word: 'criticised', hidden: 'You judged me.', feelings: ['hurt', 'anxious', 'embarrassed'], needs: ['acceptance', 'respect', 'support'] }
  ];

  /* ---------- Need or strategy? ---------- */
  var SORT = [
    { text: 'I need my husband to do the dishes.', kind: 'strategy', why: 'It names a person and an action. Underneath: support, rest, mutuality.', needs: ['support', 'rest', 'mutuality'] },
    { text: 'I need rest.', kind: 'need', why: 'No person, place, thing or time. Anyone anywhere needs rest.' },
    { text: 'I need to quit my job.', kind: 'strategy', why: 'One action among many. Underneath: maybe meaning, rest, respect, autonomy, and security too.', needs: ['purpose', 'rest', 'respect', 'autonomy', 'security'] },
    { text: 'I need belonging.', kind: 'need', why: 'Universal. There are a hundred ways to meet it.' },
    { text: 'I need you to text me when you’re running late.', kind: 'strategy', why: 'A specific person and action. Underneath: predictability, reassurance, consideration.', needs: ['predictability', 'trust', 'consideration'] },
    { text: 'I need freedom to choose my own tasks.', kind: 'need', why: 'Freedom and choice are needs. “On my own timeline” keeps it open: it doesn’t name who or when.' },
    { text: 'I need the kids to stop yelling.', kind: 'strategy', why: 'Underneath: calm, ease, maybe rest. The kids have needs too (play!), so look for a strategy that meets both.', needs: ['calm', 'ease', 'rest'] },
    { text: 'I need a bigger apartment.', kind: 'strategy', why: 'An object. Underneath: space, order, ease. Some of those can be met where you are.', needs: ['space', 'order', 'ease'] },
    { text: 'I need to be understood.', kind: 'need', why: 'Understanding is universal.' },
    { text: 'I need my sister to understand me.', kind: 'strategy', why: 'Same need, but now it depends on one person. If she can’t right now, the need can still be met elsewhere.', needs: ['understanding'] },
    { text: 'I need safety.', kind: 'need', why: 'The most basic one.' },
    { text: 'I need clean air.', kind: 'need', why: 'A body need. Opening a window, a fan or a filter are the strategies.' }
  ];

  /* ---------- Identify a need: where is the feeling coming from? ---------- */
  var SOURCES = [
    { id: 'body', label: 'My body', hint: 'hungry, thirsty, tired, in pain, too hot or cold, stuck indoors', needs: ['food', 'water', 'rest', 'sleep', 'movement', 'warmth', 'health', 'clean air'],
      note: 'Mad because you’re hungry is a different signal from mad because something was taken. Meet the body need first; the rest often softens.' },
    { id: 'someone', label: 'Something someone did or said', hint: 'a word, a look, a broken plan', needs: ['respect', 'consideration', 'to be heard', 'to be seen', 'trust', 'understanding'] },
    { id: 'mine', label: 'Something I care about was taken, broken or threatened', hint: 'my things, my space, my time, my plans', needs: ['security', 'safety', 'trust', 'respect', 'fairness', 'order', 'choice'],
      note: 'Underneath “that’s mine” is usually security, trust or respect: needs the other person has too.' },
    { id: 'situation', label: 'Too much at once', hint: 'noise, mess, deadlines, no time to myself', needs: ['ease', 'order', 'space', 'calm', 'predictability', 'support'] },
    { id: 'unsure', label: 'Not sure', hint: 'that’s fine; the feeling will point the way', needs: [] }
  ];

  /* ---------- Worked example for Communicate (two people) ---------- */
  var CONFLICT = {
    a: { name: 'Me', obs: 'the dishes are still in the sink at bedtime', feelings: ['tired', 'discouraged'], needs: ['support', 'rest'], request: 'wash them before bed tonight' },
    b: { name: 'Sam', feelings: ['tense', 'resentful'], needs: ['choice', 'autonomy'], context: 'freedom to choose my tasks on my own timeline', request: 'let me do them in the morning' },
    both: [
      'Each of us picks which evening jobs are ours, once a week.',
      'Dishes are done by 10am the next day, by whoever is free.',
      'Wash together after dinner with music on, ten minutes, kids drying.',
      'Soak the pans overnight, so the morning job is small.'
    ],
    thanks: ['relieved', 'grateful']
  };

  /* ---------- The course: four units, one page each; sub-units are sections on that page ---------- */
  var UNITS = [
    { id: 'feel', num: 1, word: 'Feel', sub: 'what’s alive inside', intro: 'Feelings are messages about needs. Learn to read them without blame, and to name them precisely.',
      subs: [
        { id: 'signals', title: 'Feelings are signals', short: 'Every feeling points to a need, met or not.',
          key: ['A feeling is a messenger. Pleasant ones say a need is met; painful ones say a need is crying out.',
            'Someone can *trigger* a feeling, but the *cause* is your own need. That puts the answer back in your hands.',
            'Feelings aren’t good or bad. Each one is information.'],
          ex: [['I feel cranky at 5pm every day.', 'Maybe food, maybe rest. Bodies send feelings too.'], ['I feel delighted watching the kids wash carrots.', 'A need is met: contribution, togetherness, play.']],
          remember: 'The feeling is the signal; the need is the message.' },
        { id: 'accusations', title: 'Feelings vs accusations', short: 'Abandoned, ignored, attacked: a “you” hides inside.',
          key: ['Some words sound like feelings but tell a story about someone else: *abandoned* means “you left me.”',
            'They point the finger outward, so the other person defends instead of listening, and you lose sight of your own need.',
            'The pain is real. Translate it to the feeling and need underneath.'],
          tool: 'translator', remember: 'A hidden “you did it”? Translate to feeling + need.' },
        { id: 'narrow', title: 'Narrowing in', short: 'From the big ones (sad, mad, scared) to the word that fits.',
          key: ['Start with a big family in the middle of the wheel, then narrow outward.',
            '“Mad” might be *frustrated* (needs ease), *resentful* (needs fairness) or *irritated* (needs rest). Each points somewhere different.',
            'Every word here describes your inside, never what someone did.'],
          tool: 'wheel', remember: 'Start big, narrow down.' }
      ] },
    { id: 'need', num: 2, word: 'Need', sub: 'identify the need', intro: 'Underneath every feeling is a universal need. Find it, and you have more than one way to meet it.',
      subs: [
        { id: 'universal', title: 'Universal needs', short: 'Food, safety, rest, freedom, belonging…',
          key: ['Every person shares the same needs: food, water, clean air, rest, safety, belonging, freedom, meaning, play.',
            'A need never names a person, place, object or time. That’s what makes it universal.',
            'Because we share them, we can recognise each other’s needs, even mid-conflict.'],
          tool: 'needs', remember: 'No who, where, what or when inside a need.' },
        { id: 'strategies', title: 'Needs vs strategies', short: '“I need you to…” is a strategy. Find the need under it.',
          key: ['A strategy is one way to meet a need: a specific person, action, thing or time.',
            'One need has many strategies. Conflict happens when we cling to just one.',
            'Ask: *if I got this, what would it give me?* Keep asking until it’s universal.'],
          tool: 'sorter', remember: 'Conflicts live between strategies. Needs never conflict.' },
        { id: 'identify', title: 'Identify a need', short: 'The inner tool: from a big feeling to the need underneath.', isTool: true,
          key: ['Start broad (sad, mad, scared) and narrow to the word that fits.',
            'Ask where it’s coming from: your body, something someone did, something of yours, or too much at once.',
            'Land on the need, and let it matter before you solve anything.'],
          tool: 'finder', remember: 'Feeling → source → need.' }
      ] },
    { id: 'request', num: 3, word: 'Request', sub: 'ask, don’t demand', intro: 'Once you know your need, say it out loud: kindly, clearly, and in a way the other person can say yes or no to.',
      subs: [
        { id: 'observe', title: 'Observe, don’t judge', short: 'Say what a camera would record.',
          key: ['“The dishes have been in the sink since Tuesday” is an observation. “You never help” is a judgement.',
            'Swap *always* and *never* for what actually happened.',
            'An observation is hard to argue with, so the conversation can begin.'],
          ex: [['“You’re always on your phone.”', '→ “You checked your phone three times during dinner.”']],
          remember: 'If a camera couldn’t record it, it’s a judgement.' },
        { id: 'kindness', title: 'Kindness first', short: 'The golden rule: meet them the way you’d want to be met.',
          key: ['Arrive with kindness and curiosity, not a case to argue.',
            'It works because we share needs: what you’d want (to be heard, respected) is what they want too.',
            'Generous isn’t self-erasing. Your needs stay on the table.'],
          remember: 'Same needs, so the same kindness.' },
        { id: 'requests', title: 'Requests, not demands', short: 'Ask for something doable, and be ready to hear “no”.',
          key: ['A demand carries blame or punishment if refused. A request doesn’t.',
            'The test: how will I respond to a “no”?',
            'Make it positive, specific and doable now: “Would you be willing to… tonight?”'],
          ex: [['“Stop leaving your stuff everywhere.”', '→ “When I see bags on the table, I feel tense, because I need order. Would you be willing to clear it before dinner?”']],
          remember: 'Ask for what you want, not what you don’t.' }
      ] },
    { id: 'dialogue', num: 4, word: 'Dialogue', sub: 'meet both needs', intro: 'Listen as well as speak. Keep both sets of needs on the table until you find a strategy that meets them, then say thank you.',
      subs: [
        { id: 'listening', title: 'Listening', short: 'Guess their feeling and need, out loud.',
          key: ['“Are you feeling ___ because you need ___?” A guess, not a diagnosis.',
            'No fixing, advising, comparing or one-upping yet.',
            'A “no” is a yes to another need. Get curious about which.'],
          remember: 'Connection before solutions.' },
        { id: 'generous', title: 'Generous, and still met', short: 'Give from the heart, not from guilt.',
          key: ['Giving feels good when it’s free. Giving from duty, guilt or fear breeds resentment.',
            'Before saying yes, check: is there a yes in me?',
            'Keeping your own needs met is what keeps generosity going.'],
          remember: 'An honest “no” beats a resentful “yes”.' },
        { id: 'gratitude', title: 'Gratitude & repair', short: 'Thank, mend, and reconnect.',
          key: ['Appreciation in three parts: what they did, how you feel, which need it met.',
            'Repair by mourning, not shame: “I regret it, because I value…”',
            'Small thanks smooth out the conflict points that are left.'],
          ex: [['“Thanks for doing the dishes.”', '→ “When I saw the clean sink this morning, I felt relieved. I really needed that ease.”']],
          remember: 'Gratitude connects you to what’s working.' },
        { id: 'communicate', title: 'Communicate', short: 'The interpersonal tool: two people, two sets of needs, one strategy for both.', isTool: true,
          key: ['Each person says what they feel, need and would like. The other says it back.',
            'Put both sets of needs side by side; they never conflict.',
            'Pick a strategy that meets both, try it, and close with thanks.'],
          tool: 'conflict', remember: 'When it’s stuck, go back to the needs.' }
      ] }
  ];

  /* ---------- Special applications (later: a second vertical tree beneath the first) ---------- */
  var APPS = [
    { id: 'children', name: 'Children', short: 'Togetherness instead of split labor; kids pitching in beside you.' },
    { id: 'neighbors', name: 'Neighbors', short: 'The people, plants and animals you share water, air, walls and streets with.', preview: true },
    { id: 'groups', name: 'Gatherings & groups', short: 'Hosting, rounds and agreements, conflict in a circle.' },
    { id: 'projects', name: 'Projects', short: 'A shared goal, roles by willingness, check-ins.' },
    { id: 'coops', name: 'Cooperatives', short: 'Workplaces and homes owned and run together, without extracting profit.', preview: true },
    { id: 'power', name: 'Power & peace', short: 'Nonviolence, abolition, and power with instead of power over.', preview: true },
    { id: 'animals', name: 'Animals', short: 'Someone, not something: companion, farmed and wild animals, and their needs.', preview: true },
    { id: 'plants', name: 'Plants', short: 'A plant’s signals as needs; continues in Gardening.' }
  ];

  return { NEEDS: NEEDS, WHEEL: WHEEL, FAUX: FAUX, SORT: SORT, SOURCES: SOURCES, CONFLICT: CONFLICT, UNITS: UNITS, APPS: APPS };
})();
