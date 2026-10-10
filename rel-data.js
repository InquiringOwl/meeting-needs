/* Relationships lens: course data (skill tree, feelings, needs, translator, examples).
   Built on Marshall B. Rosenberg's Nonviolent Communication. Feelings and needs lists
   are adapted from the Center for Nonviolent Communication's inventories (cnvc.org).
   Emotions: feel, need, soil (planned). Relationships: request, dialogue, then special situations. */
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

  /* ---------- Shades within a family: what sets each word apart, and the needs it most often points to ---------- */
  var NUANCE = {
    'sad': { d: 'Heavy and low: something you care about is missing.', needs: ['care', 'mourning', 'connection'] },
    'lonely': { d: 'Wanting company or closeness that isn’t there.', needs: ['companionship', 'closeness', 'belonging'] },
    'disappointed': { d: 'Something you hoped for didn’t happen.', needs: ['mourning', 'hope', 'trust'] },
    'discouraged': { d: 'Losing heart after effort; is it worth trying again?', needs: ['hope', 'support', 'competence'] },
    'wistful': { d: 'A soft ache for what was, or what might have been.', needs: ['mourning', 'connection', 'beauty'] },
    'scared': { d: 'Danger feels close, right now.', needs: ['safety', 'protection', 'support'] },
    'anxious': { d: 'Unease without a clear target; the body on alert.', needs: ['calm', 'predictability', 'safety'] },
    'worried': { d: 'Thoughts circling one specific what-if.', needs: ['predictability', 'clarity', 'security'] },
    'nervous': { d: 'Jittery before something that matters to you.', needs: ['competence', 'support', 'acceptance'] },
    'wary': { d: 'Holding back until you know it’s safe.', needs: ['trust', 'safety', 'honesty'] },
    'angry': { d: 'Hot energy saying a line was crossed.', needs: ['respect', 'fairness', 'to be heard'] },
    'frustrated': { d: 'Blocked: you keep trying and it isn’t working.', needs: ['ease', 'competence', 'cooperation'] },
    'irritated': { d: 'Small things grating, often when tired or overloaded.', needs: ['rest', 'space', 'ease'] },
    'resentful': { d: 'An old unfairness that hasn’t been made right.', needs: ['fairness', 'appreciation', 'mutuality'] },
    'furious': { d: 'Anger at full volume: something big is at stake.', needs: ['respect', 'safety', 'to be heard'] },
    'tense': { d: 'Braced and tight, waiting for the next thing.', needs: ['ease', 'calm', 'safety'] },
    'overwhelmed': { d: 'More coming in than you can hold.', needs: ['support', 'space', 'order'] },
    'stressed': { d: 'Pressure to deliver, with too little time or help.', needs: ['support', 'ease', 'rest'] },
    'restless': { d: 'Can’t settle; energy with nowhere to go.', needs: ['movement', 'stimulation', 'purpose'] },
    'cranky': { d: 'Short-fused, often from a body need.', needs: ['food', 'rest', 'sleep'] },
    'tired': { d: 'Low on energy, ready to stop.', needs: ['rest', 'sleep', 'ease'] },
    'exhausted': { d: 'Nothing left; the body insists on rest.', needs: ['sleep', 'rest', 'health'] },
    'depleted': { d: 'You’ve given more than you’ve taken in.', needs: ['care', 'rest', 'mutuality'] },
    'weary': { d: 'Worn down by the same thing for a long time.', needs: ['hope', 'ease', 'support'] },
    'burnt out': { d: 'Running on empty so long the meaning drained out.', needs: ['rest', 'purpose', 'support'] },
    'confused': { d: 'The pieces don’t fit together yet.', needs: ['clarity', 'understanding', 'learning'] },
    'torn': { d: 'Two things you value pull in different directions.', needs: ['clarity', 'integrity', 'choice'] },
    'puzzled': { d: 'Curious about something that doesn’t add up.', needs: ['understanding', 'learning', 'clarity'] },
    'lost': { d: 'Unsure where you are or where to go next.', needs: ['purpose', 'support', 'clarity'] },
    'hesitant': { d: 'Not ready to commit; something needs checking first.', needs: ['clarity', 'trust', 'safety'] },
    'hurt': { d: 'Pain from something that happened between you and someone.', needs: ['care', 'empathy', 'respect'] },
    'grieving': { d: 'Mourning a loss: a person, a place, a hope.', needs: ['mourning', 'support', 'presence'] },
    'heartbroken': { d: 'A loss of love or closeness that cuts deep.', needs: ['mourning', 'closeness', 'care'] },
    'aching': { d: 'A lingering, tender pain, often a longing.', needs: ['care', 'touch', 'connection'] },
    'regretful': { d: 'Wishing you’d chosen differently.', needs: ['integrity', 'growth', 'mourning'] },
    'numb': { d: 'Little feeling at all, often protection after too much.', needs: ['safety', 'rest', 'presence'] },
    'withdrawn': { d: 'Pulling inward, away from others.', needs: ['space', 'safety', 'acceptance'] },
    'bored': { d: 'Under-stimulated: nothing is engaging you.', needs: ['stimulation', 'play', 'purpose'] },
    'distant': { d: 'Near people, but not feeling close.', needs: ['connection', 'closeness', 'to be seen'] },
    'detached': { d: 'Watching from outside, not quite in your own life.', needs: ['presence', 'purpose', 'connection'] },
    'embarrassed': { d: 'Exposed for a moment, wishing no one saw.', needs: ['acceptance', 'respect', 'ease'] },
    'ashamed': { d: 'Feeling something is wrong with you, not only with what you did.', needs: ['acceptance', 'belonging', 'empathy'] },
    'self-conscious': { d: 'Watching yourself through other people’s eyes.', needs: ['acceptance', 'ease', 'belonging'] },
    'flustered': { d: 'Caught off guard and scrambling.', needs: ['calm', 'predictability', 'space'] },
    'guilty': { d: 'Something you did doesn’t match your values.', needs: ['integrity', 'care', 'growth'] },
    'happy': { d: 'A general sense that things are well.', needs: ['ease', 'connection', 'play'] },
    'delighted': { d: 'A bright burst of pleasure at something specific.', needs: ['play', 'beauty', 'celebration'] },
    'glad': { d: 'Quiet satisfaction that something turned out well.', needs: ['ease', 'hope', 'trust'] },
    'amused': { d: 'Something struck you as funny.', needs: ['humour', 'play', 'fun'] },
    'elated': { d: 'Joy so big it lifts you off the ground.', needs: ['celebration', 'hope', 'adventure'] },
    'calm': { d: 'Still and steady inside.', needs: ['calm', 'safety', 'ease'] },
    'relaxed': { d: 'Your body has stopped bracing.', needs: ['rest', 'ease', 'safety'] },
    'content': { d: 'Enough, just as it is.', needs: ['ease', 'acceptance', 'security'] },
    'centred': { d: 'Grounded in yourself, clear about what matters.', needs: ['presence', 'integrity', 'clarity'] },
    'relieved': { d: 'A worry or weight just lifted.', needs: ['safety', 'ease', 'trust'] },
    'grateful': { d: 'Aware of a gift, and of the giver.', needs: ['appreciation', 'support', 'connection'] },
    'moved': { d: 'Stirred deeply by something meaningful.', needs: ['beauty', 'connection', 'inspiration'] },
    'touched': { d: 'Warmed by someone’s care for you.', needs: ['care', 'to be seen', 'closeness'] },
    'appreciative': { d: 'Noticing and valuing what someone did.', needs: ['appreciation', 'contribution', 'mutuality'] },
    'thankful': { d: 'Glad for what you have, big or small.', needs: ['security', 'appreciation', 'ease'] },
    'curious': { d: 'Wanting to know more; leaning in.', needs: ['learning', 'stimulation', 'adventure'] },
    'absorbed': { d: 'So into it that time disappears.', needs: ['creativity', 'presence', 'competence'] },
    'interested': { d: 'Your attention caught; worth a closer look.', needs: ['learning', 'stimulation', 'growth'] },
    'fascinated': { d: 'Captivated, almost spellbound.', needs: ['inspiration', 'beauty', 'learning'] },
    'alert': { d: 'Awake and ready to respond.', needs: ['presence', 'competence', 'stimulation'] },
    'warm': { d: 'A glow of goodwill toward someone.', needs: ['connection', 'care', 'belonging'] },
    'tender': { d: 'Gentle and soft, wanting to protect.', needs: ['care', 'closeness', 'touch'] },
    'loving': { d: 'Deep care for someone’s whole being.', needs: ['closeness', 'care', 'mutuality'] },
    'friendly': { d: 'Easy openness, even with new people.', needs: ['companionship', 'connection', 'play'] },
    'open-hearted': { d: 'Unguarded, letting others in.', needs: ['trust', 'authenticity', 'acceptance'] },
    'hopeful': { d: 'Believing something good is possible, though not certain.', needs: ['hope', 'trust', 'purpose'] },
    'encouraged': { d: 'Heartened by a sign of progress or someone’s support.', needs: ['support', 'hope', 'competence'] },
    'optimistic': { d: 'Expecting things to turn out well, in general.', needs: ['hope', 'trust', 'security'] },
    'eager': { d: 'Ready to start: energy pulling you toward something soon.', needs: ['purpose', 'stimulation', 'growth'] },
    'expectant': { d: 'Waiting for something you believe is coming.', needs: ['predictability', 'hope', 'celebration'] },
    'rested': { d: 'Your body got the sleep or pause it needed.', needs: ['rest', 'sleep', 'ease'] },
    'refreshed': { d: 'Cleared and lighter, like after fresh air or water.', needs: ['clean air', 'water', 'movement'] },
    'renewed': { d: 'A fresh start after a hard stretch.', needs: ['hope', 'growth', 'rest'] },
    'energised': { d: 'Fuel in the tank, ready to move.', needs: ['movement', 'food', 'stimulation'] },
    'alive': { d: 'Fully here and awake to the world.', needs: ['presence', 'adventure', 'beauty'] },
    'confident': { d: 'Trusting you can handle what’s coming.', needs: ['competence', 'trust', 'growth'] },
    'safe': { d: 'No threat: you can let your guard down.', needs: ['safety', 'protection', 'trust'] },
    'empowered': { d: 'You have the choice and the means to act.', needs: ['autonomy', 'choice', 'competence'] },
    'proud': { d: 'Pleased by what you did or who you are.', needs: ['competence', 'contribution', 'to be seen'] },
    'secure': { d: 'Steady footing that will hold over time.', needs: ['security', 'stability', 'predictability'] }
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

  /* ---------- Two courses (Emotions, then Relationships), one page per unit; sub-units are sections on that page.
     course: which lens the unit lives in. planned: shown dashed, with a short description, until it's written. ---------- */
  var UNITS = [
    { id: 'feel', course: 'emotions', num: 1, word: 'Feel', sub: 'what’s alive inside of you', intro: 'Feelings are messages about needs. Learn to listen to them precisely and without blame (because accusations obscure our solution options).\nIf you’re like most people, your physical needs probably aren’t all met, and without hope of resolution, I fully empathize that facing existing pains may just feel painful. However, facing your problems is the first step to meeting your needs.',
      subs: [
        { id: 'signals', title: 'Emotions are messengers', short: 'Every feeling points to a need, met or not.',
          key: ['Feelings aren’t good or bad. Each one is information.',
            'Pleasant-feeling emotions say a need is met (“thank you”); painful ones say a need is unmet (“please meet a need”).',
            'Needs come and go. You’ll be hungry again tomorrow. Fix problems at sources, but don’t assume it’s fixed forever. Nothing lasts forever (us included), so we’ll tend to each need as it comes.',
            'Someone or something can *trigger* a feeling, but the emotion reflects your need. This keeps the power in our hands to self-regulate.'],
          ex: [['I feel cranky and frustrated at 5pm most weekdays.', 'Maybe unmet needs for food, rest, or autonomy to spend time meaningfully.'], ['I feel joyful and relieved when my child tells me why they’re angry.', 'Maybe a need is met for connection, hope, or understanding.']],
          remember: 'The feeling is the messenger; the need is the message.' },
        { id: 'accusations', title: 'Accusatory feelings', short: 'Focus on yourself in a vacuum, rather than implying another’s actions.',
          key: ['Some words sound like feelings but tell a story about someone else: *abandoned* means “you left me.”',
            'They point the finger outward, so the other person defends instead of listening, and you lose sight of your own need.',
            'The pain is real. Translate it to the feeling and need underneath.'],
          tool: 'translator', remember: 'A hidden “you did it”? Translate to feeling + need.' },
        { id: 'pain', title: 'Physical pain can signal emotions',
          short: 'Is it tissue damage, or a neuroplastic condition? Either way, it’s real pain, but not all bodily pains (especially chronic issues) indicate structural damage. Your brain may be trying to protect you, using the body’s pain language. (Read Dr. Howard Schubiner’s “Unlearn Your Pain” for more while I build out this unit.)',
          key: ['**Start with body needs.** Angry because you’re hungry? Snappy because you’re tired, cold or hurting? That irritability is valid: it’s pointing at food, rest, warmth or care, and meeting that need first often softens the rest.',
            '**The brain decides when to send pain.** Pain is the brain’s danger signal. Usually it protects injured tissue, but the brain can learn to keep sending pain after tissue heals, especially through stress, fear or hard emotions. That’s neuroplastic pain: just as real, and it can be unlearned.',
            '**Clues it may be neuroplastic:** it began in a stressful time or without a clear injury; it moves around or shows up in several places; it flares with stress, certain people or places, and fades when you’re absorbed in something; scans and tests don’t explain it. If possible, ask a doctor to rule out structural causes.',
            '**Fear turns the volume up.** Bracing against pain tells the brain there’s danger, which makes more pain. Safety, curiosity and kindness toward your body turn it down, and so can writing out what you feel (anger, grief, fear).',
            '**It’s all part of the puzzle.** Body needs, emotions and learned pain are all information about what’s going on inside of us, and how to make the world hurt less.'],
          remember: 'Real pain, many sources: bodily damage, emotions, and frequently-firing neural paths (neuroplastic “learned” pain).',
          src: 'Adapted from Howard Schubiner with Michael Betzold, <em>Unlearn Your Pain</em> (Mind Body Publishing). This is Kinship’s own short summary; if possible, ask a doctor to rule out structural causes.',
          opinion: 'Following the moon’s phases alongside your own cycle, especially for women, can be a gentle way to notice patterns in your energy, moods and body’s needs.',
          opinionSrc: 'Source: Helfrich-Förster et al., “Women temporarily synchronize their menstrual cycles with the luminance and gravimetric cycles of the Moon,” <em>Science Advances</em> 7 (2021). The evidence is still mixed, so treat it as something to notice, not a rule.' },
        { id: 'wheel', title: 'Feelings wheel', short: 'Spin to the feeling that fits, and see the universal needs it may be pointing to.', isTool: true,
          tool: 'wheel', remember: 'Name the feeling, then follow it to the need.',
          next: ['need', 'universal', 'Next unit · 2.1', 'Universal needs', 'The roots beneath every feeling: needs every person shares.'] }
      ] },
    { id: 'need', course: 'emotions', num: 2, word: 'Identify the need', sub: 'the roots beneath', intro: 'Underneath every feeling is a universal need. Find it, and you have more than one way to meet it.',
      subs: [
        { id: 'universal', title: 'Universal needs', short: 'Food, safety, rest, freedom, belonging…',
          key: ['Every person shares the same needs: food, water, clean air, rest, safety, belonging, freedom, meaning, play.',
            'A need never names a person, place, object or time. That’s what makes it universal.',
            'Because we share them, we can recognise each other’s needs, even mid-conflict.'],
          tool: 'needs', remember: 'No who, where, what or when inside a need.' },
        { id: 'strategies', title: 'Needs vs. strategies', short: '“I need you to…” is a strategy. Find the need under it.',
          key: ['A strategy is one way to meet a need: a specific person, action, thing or time.',
            'One need has many strategies. Conflict happens when we cling to just one.',
            'Ask: *if I got this, what would it give me?* Keep asking until it’s universal.',
            'Seeing the need under your strategy brings a responsibility to choose differently to meet those needs.',
            'You may believe you have no choice (e.g. to pay rent, or be unhoused, or something else — and I hear you, let’s face our crummy options through upcoming units!). You may not like your choices, but it’s vital to remember your responsibility for your choices.'],
          tool: 'sorter', remember: 'Conflicts live between strategies. Needs never conflict.' },
        { id: 'identify', title: 'Identify a need', short: 'The inner tool: from a big feeling to the need underneath.', isTool: true,
          key: ['Start broad (sad, mad, scared) and narrow to the word that fits. “Mad” might be *frustrated* (needs ease), *resentful* (needs fairness) or *irritated* (needs rest).',
            'Ask where it’s coming from: your body, something someone did, something of yours, or too much at once.',
            'Land on the need, and let it matter before you solve anything.'],
          tool: 'finder', remember: 'Feeling → source → need.' },
        { id: 'beneath', title: 'Yes, and: beneath the noun', short: 'A job or money is a strategy. Yes, it matters, and beneath it sit needs like safety, choice and care for the people you love.', planned: true }
      ] },
    { id: 'soil', course: 'emotions', num: 3, word: 'Who you are', sub: 'what’s going on down there', planned: true,
      intro: 'The soil beneath the roots: the you who chooses, the body that remembers, and the tools your mind brings.',
      subs: [
        { id: 'chooser', title: 'The one who chooses', short: 'Present awareness makes choices, never as blame: “I have to go to work” becomes “I choose to, because I want a home and food.”', planned: true },
        { id: 'remembers', title: 'The body that remembers', short: 'The feeling body carries memories and beliefs, and tries to protect you from pain it has known.', planned: true },
        { id: 'mindbody', title: 'Mind & body', short: 'How mind and body talk: memories, protection, and signals the brain learns to send.', planned: true },
        { id: 'tools', title: 'Your mind’s tools', short: 'Imagination, memory, planning and mental math.', planned: true }
      ] },
    { id: 'request', course: 'relationships', num: 1, word: 'Request', sub: 'ask, don’t demand', intro: 'Once you know your need, say it out loud: kindly, clearly, and in a way the other person can say yes or no to.',
      subs: [
        { id: 'sharing', title: 'Sharing feelings and needs', short: 'What happened, how you feel, and what you need.',
          key: ['Start with what a camera would record: “The dishes have been in the sink since Tuesday,” not “you never help.” Swap *always* and *never* for what actually happened.',
            'Then your feeling and the need under it: “I feel tense, because I need order.”',
            'Own it: someone can trigger a feeling, but it comes from your need. That keeps the other person listening instead of defending.'],
          ex: [['“You’re always on your phone.”', '→ “You checked your phone three times during dinner. I felt lonely, because I need connection.”']],
          remember: 'Observation, feeling, need. Then ask.' },
        { id: 'requests', title: 'Not demands', short: 'Ask for something doable, and be ready to hear “no”.',
          key: ['A demand carries blame or punishment if refused. A request doesn’t.',
            'The test: how will I respond to a “no”? A “no” is a yes to another need. Get curious about which.',
            'Make it positive, specific and doable now: “Would you be willing to… tonight?”'],
          ex: [['“Stop leaving your stuff everywhere.”', '→ “When I see bags on the table, I feel tense, because I need order. Would you be willing to clear it before dinner?”']],
          remember: 'Ask for what you want, not what you don’t.' },
        { id: 'anticipating', title: 'Anticipating needs', short: 'Meet them the way you’d want to be met.',
          key: ['We share the same needs, so you can often guess theirs before they say a word: rest after a long shift, quiet before a big day, a snack before a hard talk.',
            'Look for strategies that meet everyone’s needs from the start, so nobody has to give anything up.',
            'Arrive with kindness and curiosity, not a case to argue. Your needs stay on the table too.'],
          remember: 'Same needs, so the same kindness.' }
      ] },
    { id: 'dialogue', course: 'relationships', num: 2, word: 'Dialogue', sub: 'meet both needs', intro: 'Listen as well as speak. Keep both sets of needs on the table until you find a strategy that meets them, then say thank you.',
      subs: [
        { id: 'ask', title: 'Ask if your strategy meets their needs', short: 'Check for a real yes, not a resentful one.',
          key: ['After you suggest a strategy, ask: “Would that work for you too?” Then listen for the need behind the answer.',
            'Guess their feeling and need out loud: “Are you feeling ___ because you need ___?” A guess, not a diagnosis. No fixing or advising yet.',
            'A yes given from guilt, duty or fear turns into resentment. Before saying yes yourself, check: is there a yes in me?'],
          remember: 'An honest “no” beats a resentful “yes”.' },
        { id: 'narrowing', title: 'Narrowing problem-solving', short: 'From many ideas to the one that meets every need.',
          key: ['Put both sets of needs side by side. Brainstorm lots of strategies, then narrow to the ones that meet every need on the table.',
            'Stuck? Go back to the needs, not to who’s right.',
            'Try it for a set time, check in, and close with thanks: what they did, how you feel, which need it met.'],
          ex: [['“Thanks for doing the dishes.”', '→ “When I saw the clean sink this morning, I felt relieved. I really needed that ease.”']],
          remember: 'Wide first, then narrow, then thanks.' },
        { id: 'communicate', title: 'Communicate', short: 'The interpersonal tool: two people, two sets of needs, one strategy for both.', isTool: true,
          key: ['Each person says what they feel, need and would like. The other says it back.',
            'Put both sets of needs side by side; they never conflict.',
            'Pick a strategy that meets both, try it, and close with thanks.'],
          tool: 'conflict', remember: 'When it’s stuck, go back to the needs.' }
      ] }
  ];

  /* ---------- Special applications (later: a second vertical tree beneath the first) ---------- */
  /* Special situations, in page order (the three animal groups first). Each opens as an accordion on #lens-relationships/special. */
  var APPS = [
    { id: 'family', name: 'Family animals', short: 'Companions who share our homes, routines and moods, and their emotional needs.', status: 'Soon', preview: true },
    { id: 'wild', name: 'Wild animals', short: 'Neighbors who live by their own rules: room, closed offers, urban wildlife and land left livable.', status: 'Soon', preview: true },
    { id: 'captive', name: 'Captive animals', short: 'Animals humans keep for use: farms, labs, shows. Respectful words, honest numbers, and peace with animals across Kinship.', status: 'Soon', preview: true },
    { id: 'children', name: 'Children', short: 'Togetherness instead of split labor; kids pitching in beside you.', status: 'Soon' },
    { id: 'neighbors', name: 'Neighbors', short: 'The people, plants and animals you share water, air, walls and streets with.', status: 'Soon', preview: true },
    { id: 'distress', name: 'People in distress', short: 'Meeting someone unhoused or struggling: respect, capacity, boundaries and who can help.', status: 'Soon', preview: true },
    { id: 'coops', name: 'Cooperatives', short: 'Workplaces and homes owned and run together, without extracting profit.', status: 'Soon', preview: true },
    { id: 'plants', name: 'Plants', short: 'A plant’s signals as needs; continues in Gardening.', status: 'Soon' },
    { id: 'groups', name: 'Gatherings & events', short: 'Hosting, rounds and agreements, conflict in a circle.', status: 'Soon' },
    { id: 'projects', name: 'Projects', short: 'A shared goal, roles by willingness, check-ins.', status: 'Later' },
    { id: 'power', name: 'Power & peace', short: 'Nonviolence, abolition, and power with instead of power over.', status: 'Later', preview: true }
  ];

  return { NEEDS: NEEDS, WHEEL: WHEEL, NUANCE: NUANCE, FAUX: FAUX, SORT: SORT, SOURCES: SOURCES, CONFLICT: CONFLICT, UNITS: UNITS, APPS: APPS };
})();
