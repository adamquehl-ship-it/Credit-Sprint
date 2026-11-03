/* Credit Sprint AP® English Literature (and CLEP® Analyzing and Interpreting Literature): six units, study notes and diagrams. All content is original.
   The College Board course has nine units that cycle through short fiction, poetry and longer works; here they are grouped by the skills the exam tests.
   Literature has no economics graphs, so CS_MARKETS / CS_SHIFTS / CS_EVENTS are empty. Diagrams live in CS_FIGS (each takes a step to highlight). */
(function(){
const ink = "var(--ink)", acc = "var(--accent)", mut = "var(--muted)", soft = "var(--accent-soft)";
const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.a || "middle"}" font-size="${o.fs || 12}" font-weight="${o.fw || 600}" fill="${o.c || ink}" font-family="Inter,system-ui,sans-serif">${s}</text>`;
const box = (x, y, w, h, on) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${on ? soft : "var(--surface)"}" stroke="${on ? acc : "var(--rule)"}" stroke-width="${on ? 2.4 : 1.4}"/>`;
const arrow = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${mut}" stroke-width="1.8" marker-end="url(#ah)"/>`;
const svg = (body, title, h = 220) => `<svg viewBox="0 0 320 ${h}" role="img" aria-label="${title}" style="width:100%;max-width:420px"><defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="${mut}"/></marker></defs>${body}</svg>`;
/* a vertical flow of labeled boxes; v (1-based) lights one up */
const flow = (title, steps) => v => svg(steps.map((st, i) => { const y = 8 + i * 42; return box(30, y, 260, 32, v === i + 1) + T(160, y + 20, st) + (i < steps.length - 1 ? arrow(160, y + 32, 160, y + 41) : ""); }).join(""), title, 8 + steps.length * 42);

window.CS_FIGS = {
  /* Freytag's pyramid */
  freytag: v => { const pts = [[20,180],[110,150],[160,40],[210,120],[300,180]], lab = ["Exposition","Rising action","Climax","Falling action","Resolution"];
    const lx = [[40,200],[100,120],[160,28],[236,110],[286,200]];
    return svg(`<path d="M${pts.map(p => p.join(" ")).join(" L")}" fill="none" stroke="${acc}" stroke-width="3" stroke-linejoin="round"/>` +
      pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="${v === i + 1 ? 7 : 4.5}" fill="${v === i + 1 ? acc : "var(--surface)"}" stroke="${acc}" stroke-width="2"/>` + T(lx[i][0], lx[i][1], lab[i], {c: v === i + 1 ? acc : ink, fs: 11.5})).join(""), "Freytag's pyramid: the shape of a plot", 214); },
  /* character: what reveals a character */
  character: v => { const items = ["What they say","What they do","What others say","What the narrator tells","Their choices under pressure"];
    return svg(`<circle cx="160" cy="110" r="38" fill="${soft}" stroke="${acc}" stroke-width="2.4"/>` + T(160, 106, "Character") + T(160, 122, "motives · change", {fs: 10, fw: 500, c: mut}) +
      items.map((s, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / items.length, x = 160 + 112 * Math.cos(a), y = 110 + 82 * Math.sin(a);
        return `<path d="M${160 + 40 * Math.cos(a)} ${110 + 40 * Math.sin(a)} L${160 + 78 * Math.cos(a)} ${110 + 60 * Math.sin(a)}" stroke="${mut}" stroke-width="1.6"/>` + box(x - 62, y - 14, 124, 28, v === i + 1) + T(x, y + 4, s, {fs: 10.5}); }).join(""), "How a writer reveals character", 220); },
  /* speaker, audience, occasion, purpose */
  speaker: v => svg([["Poet",160,24],["Speaker",160,78],["Listener / audience",70,150],["Situation",250,150],["Attitude = tone",160,200]].map((b, i) => box(b[1] - 66, b[2] - 16, 132, 30, v === i + 1) + T(b[1], b[2] + 3, b[0], {fs: 11})).join("") +
    arrow(160, 40, 160, 60) + arrow(140, 94, 90, 132) + arrow(180, 94, 230, 132) + arrow(160, 94, 160, 182) + T(160, 52, "creates a voice", {fs: 9.5, fw: 500, c: mut, a: "start"}).replace('x="160"', 'x="166"'), "The speaker is not the poet", 222),
  /* sonnet structures */
  sonnet: v => svg(box(14, 10, 140, 132, v === 1) + T(84, 30, "Petrarchan") + T(84, 58, "Octave (8)", {fw: 500}) + T(84, 76, "problem / question", {fs: 10, fw: 500, c: mut}) + `<path d="M24 92 H144" stroke="${acc}" stroke-width="2" stroke-dasharray="4 4"/>` + T(146, 88, "volta", {fs: 9, c: acc, a: "end"}) + T(84, 112, "Sestet (6)", {fw: 500}) + T(84, 128, "answer / turn", {fs: 10, fw: 500, c: mut}) +
    box(166, 10, 140, 132, v === 2) + T(236, 30, "Shakespearean") + T(236, 54, "Quatrain 1", {fw: 500, fs: 11}) + T(236, 72, "Quatrain 2", {fw: 500, fs: 11}) + T(236, 90, "Quatrain 3", {fw: 500, fs: 11}) + `<path d="M176 100 H296" stroke="${acc}" stroke-width="2" stroke-dasharray="4 4"/>` + T(236, 122, "Couplet: the twist", {fw: 600, fs: 11, c: acc}) +
    T(160, 168, "14 lines · usually iambic pentameter", {fs: 11, fw: 500, c: mut}) + box(40, 180, 240, 30, v === 3) + T(160, 199, "Ask: what changes at the turn?", {fs: 11.5}), "Two sonnet structures and the turn", 216),
  /* tragedy */
  tragedy: flow("The arc of a tragedy", ["Noble hero with a flaw (hamartia)","A choice driven by the flaw","Reversal of fortune (peripeteia)","Recognition (anagnorisis)","Catastrophe and catharsis"]),
  /* literary argument essay */
  litessay: flow("Building a literary argument", ["Thesis: an interpretation, not a summary","Claim: one step in your reasoning","Evidence: a specific detail or quotation","Commentary: how it builds meaning","Connect back to the thesis"])
};

window.CS_UNITS = [
 {id:1, name:"Fiction: Character and Setting", short:"Character & setting", ap:"Short fiction: 42–49% of MC", clep:"Prose: 35–45%", wAP:20, wCLEP:21, lab:null,
  summary:"Unit 1 is about the people in a story and the world around them. AP® questions rarely ask what a character is like in one word; they ask how a detail reveals a value, a conflict or a change. Short fiction is the biggest part of the multiple-choice section, so this unit pays off on every test.",
  points:["Characterization is how a writer builds a character: through what the character says, does and thinks, what others say about them, and what the narrator tells us directly. Direct characterization states a trait; indirect characterization shows it and lets the reader infer.",
   "A character's perspective comes from their background, beliefs and experiences. On the exam, a question about a character's view of something is really asking which detail shows that view.",
   "Dynamic characters change in an important way; static characters do not. A round character is complex and surprising, a flat one has one or two traits. A minor character often exists to reveal something about the main one.",
   "A foil is a character whose contrast with another highlights that other character's qualities. Two siblings, two friends or two rivals are common foils.",
   "Characters act from motives, and the gap between what a character wants and what they get creates conflict: with another person, with society, with nature, or inside themselves.",
   "Setting is time, place and social world. It can mirror a character's state (a storm outside a quarrel), contrast with it (a sunny wedding for a grieving guest), or limit what a character can do (a small town, a strict household).",
   "Details of setting often work as symbols: a locked door, a garden going to seed, a clock. Ask what the detail suggests beyond its literal meaning and whether it changes over the story.",
   "Values and ideas: a story suggests a view about life through its characters' choices and what happens to them. The best answer about a character's significance usually links that character to the work's larger meaning."],
  formulas:["Detail → trait → value: \"The detail ___ shows that the character ___, which suggests the story values ___.\"","Change test: compare the character in the first and last paragraphs. What do they know or feel at the end that they didn't at the start?","Setting test: does the place reflect, contrast with, or restrict the character?"],
  traps:["Choosing an answer that is true of people in general but not supported by this passage. Every right answer can be pointed to in the text.","Confusing what a character believes with what the narrator or author believes.","Picking the most dramatic answer. AP® answers are usually measured: 'reluctant admiration', not 'hatred'.","Ignoring setting. When a question quotes a description of a room or weather, it is almost always about a character's state of mind."],
  graph:"character"},
 {id:2, name:"Fiction: Narrator, Plot and Structure", short:"Narrator & structure", ap:"Short fiction: 42–49% of MC", clep:"Prose: 35–45%", wAP:22, wCLEP:22, lab:null,
  summary:"Unit 2 is about who tells the story and how it is arranged. The narrator or speaker is the most heavily tested skill on the multiple-choice section (21–26%), and plot and structure add another 16–20%. Learn to ask: who is telling this, what do they know, and why is the story told in this order?",
  points:["Point of view: first person (I) tells from inside the story; third person limited follows one character's thoughts; third person omniscient can enter many minds and comment; second person (you) puts the reader in the role. Objective (dramatic) narration reports only what can be seen and heard.",
   "A narrator's reliability matters. An unreliable narrator's judgments can't be fully trusted because of youth, bias, self-interest or limited knowledge. The reader sees more than the narrator does, and that gap creates irony.",
   "Free indirect discourse blends a third-person narrator with a character's own thoughts and words, so the narration takes on the character's voice without quotation marks.",
   "Narrative distance is how close the narration stays to a character's mind. A shift in distance, or from past to present tense, often signals a turning point.",
   "Plot is the arrangement of events. Exposition, rising action, climax, falling action and resolution are the classic shape, but writers rearrange events with flashbacks, flash-forwards, frame stories and beginning in the middle (in medias res).",
   "Pacing is the speed of the telling. A summary covers years in a sentence; a scene slows down to minutes. Writers slow down for what matters most.",
   "Foreshadowing hints at what will happen; suspense keeps the reader waiting. An epiphany is a sudden moment of understanding, often near the end of modern short stories.",
   "Endings matter. A closed ending resolves the conflict; an open or ambiguous ending leaves questions. Ask how the ending changes your reading of the beginning."],
  formulas:["Narrator test: Who? (person) · How much do they know? (limited or omniscient) · Can we trust them? (reliable or not)","Structure test: Why does the story start here and end there? What does the order make the reader feel or notice?","Shift test: find the 'but', 'then' or break in the passage. What changes after it: mood, knowledge, time or speaker?"],
  traps:["Assuming a first-person narrator speaks for the author.","Calling every third-person narrator omniscient. If we only see one mind, it's limited.","Missing irony. If the narrator says one thing and the details show another, the question is probably about that gap.","Reading the climax as the most exciting moment. It is the turning point of the conflict, which can be quiet."],
  graph:"freytag"},
 {id:3, name:"Poetry: Speaker, Word Choice and Imagery", short:"Poetry: language", ap:"Poetry: 36–45% of MC", clep:"Poetry: 35–45%", wAP:19, wCLEP:20, lab:null,
  summary:"Unit 3 teaches you to read a poem's language closely. Who is speaking, to whom, and in what situation? Which words carry the feeling, and what pictures does the poem build? Every poetry question on the exam starts here.",
  points:["The speaker is the voice of the poem, not the poet. Identify the speaker's situation, the listener (if any) and the occasion. A dramatic monologue is one speaker talking to a silent listener and revealing more than they mean to.",
   "Diction is word choice. Look for words with strong connotations (the feelings and associations a word carries beyond its dictionary meaning, its denotation). Formal, plain, archaic or slang diction each create a different voice.",
   "Tone is the speaker's attitude toward the subject or audience: wistful, bitter, reverent, ironic, playful. Mood is the feeling the poem creates in the reader. Tone can shift, and a shift is often the key to the poem.",
   "Imagery is language that appeals to the senses: sight, sound, smell, taste, touch, and the feeling of motion. A pattern of images (all decay, all light) usually points to the poem's meaning.",
   "Symbols are concrete things that stand for something more. A conventional symbol is widely shared (a dove for peace); a contextual symbol is created by the poem itself.",
   "Syntax in poetry: sentence length, word order and punctuation shape meaning. Inverted word order emphasizes a word; a long sentence across many lines can feel breathless; a short sentence lands hard.",
   "Ambiguity is deliberate: a word or line that holds two meanings at once. AP® questions reward answers that keep both meanings rather than picking one.",
   "Paraphrase each sentence (not each line) before you interpret. Many poetry mistakes are simply misreading who did what to whom."],
  formulas:["SOAPS for poems: Speaker · Occasion · Audience · Purpose · Subject","Diction → tone: list three charged words, name their shared feeling, then name the tone.","Image pattern: group the images (light/dark, growth/decay, motion/stillness). What does the pattern suggest?"],
  traps:["Treating the speaker as the poet. Write 'the speaker'.","Reading line by line instead of sentence by sentence; the grammar often runs past the line break.","Choosing a tone word that is too strong or too vague ('happy', 'sad'). AP® tone answers are precise: 'nostalgic', 'resigned', 'sardonic'.","Missing a shift. Words like but, yet, now and still often mark the turn."],
  graph:"speaker"},
 {id:4, name:"Poetry: Form, Sound and Comparison", short:"Poetry: form", ap:"Poetry: 36–45% of MC", clep:"Poetry: 35–45%", wAP:18, wCLEP:19, lab:null,
  summary:"Unit 4 covers how a poem is built and how it compares things. Form, meter, rhyme and line breaks are choices that shape meaning, and comparison (metaphor, simile, personification, conceit) is one of the most tested skills on the exam (10–13%).",
  points:["Lines and stanzas: a couplet has 2 lines, a tercet 3, a quatrain 4. A stanza break is a pause or shift. Enjambment runs a sentence past the end of a line; an end-stopped line finishes with punctuation. A caesura is a pause inside a line.",
   "Meter is the pattern of stressed and unstressed syllables. An iamb is da-DUM; iambic pentameter has five iambs per line. A trochee is DUM-da, an anapest da-da-DUM, a dactyl DUM-da-da, a spondee DUM-DUM. Blank verse is unrhymed iambic pentameter; free verse has no regular meter or rhyme.",
   "Fixed forms: a sonnet has 14 lines (Petrarchan: octave and sestet; Shakespearean: three quatrains and a couplet). A villanelle has 19 lines with two repeating refrains. A ballad tells a story in quatrains. An ode praises its subject; an elegy mourns; a haiku has three short lines.",
   "The volta (turn) is a shift in a poem's argument or feeling, often at line 9 of a Petrarchan sonnet or the final couplet of a Shakespearean one.",
   "Sound devices: alliteration repeats first consonant sounds, assonance repeats vowel sounds, consonance repeats consonant sounds inside words, and onomatopoeia imitates a sound. Sound can speed a line up, slow it down, soften or harden it.",
   "Comparison: a simile compares using like or as; a metaphor says one thing is another; an extended metaphor continues across many lines; a conceit is an elaborate, surprising extended metaphor. Personification gives human qualities to nonhuman things; apostrophe addresses someone absent or something nonhuman.",
   "Other figures: hyperbole exaggerates, understatement (litotes) says less than it means, paradox seems contradictory but holds a truth, oxymoron joins opposites ('sweet sorrow'), metonymy names something by an associated thing ('the crown' for the king), synecdoche uses a part for the whole ('hands' for workers).",
   "Irony: verbal irony says the opposite of what is meant; situational irony is an outcome opposite to what was expected; dramatic irony is when the audience knows more than a character."],
  formulas:["Form → meaning: \"The [form or pattern] mirrors the speaker's ___ because ___.\"","Comparison test: What two things are compared? What qualities carry over? Why this comparison and not another?","Break test: read the line alone, then with the next line. What extra meaning does the line break create?"],
  traps:["Naming a device without saying what it does. Multiple-choice answers about function beat answers that only label.","Calling every comparison a metaphor. Check for like or as (simile) and for address to an absent listener (apostrophe).","Forgetting that regular form can contrast with chaotic content, and that the contrast is the point.","Counting syllables but missing stress. Meter is about stressed beats."],
  graph:"sonnet"},
 {id:5, name:"Longer Fiction and Drama", short:"Novels & drama", ap:"Longer fiction or drama: 15–18% of MC", clep:"Drama: 15–30%", wAP:12, wCLEP:14, lab:null,
  summary:"Unit 5 is about novels and plays, where a passage is one piece of a larger whole. Questions ask how a scene develops a character, sets up a conflict or connects to the work's ideas. Your literary argument essay will almost certainly use a novel or play, so this unit also builds your essay toolkit.",
  points:["A passage from a longer work is a part that reflects the whole. Ask how this scene shows a character's central conflict or the work's main tension.",
   "Drama is built from dialogue and stage directions. A soliloquy is a character speaking alone, revealing thoughts to the audience; an aside is a brief remark to the audience that other characters don't hear; a monologue is a long speech to other characters.",
   "Dramatic irony is especially powerful on stage: the audience knows something a character doesn't, so ordinary lines become painful or funny.",
   "Tragedy follows a person of stature who falls through a flaw or error (hamartia), often pride (hubris), with a reversal (peripeteia), a moment of recognition (anagnorisis) and an emotional release for the audience (catharsis).",
   "Comedy moves from confusion to order, often ending in marriage or reunion. Satire uses humor to criticize; farce uses exaggerated situations; a tragicomedy mixes both modes.",
   "Novels develop through subplots, parallel characters and recurring motifs. A motif is a repeated image, idea or phrase; tracing one is a strong way to build an essay.",
   "Archetypes are patterns found across many works: the journey, the mentor, the fall from innocence, the scapegoat. A bildungsroman follows a young person's growth to maturity.",
   "Context helps but is not the answer. The exam asks you to read the text in front of you, not to recall facts about the author."],
  formulas:["Part-to-whole: \"This scene matters to the work as a whole because it ___ (sets up, complicates, reveals, resolves) ___.\"","Drama check: who is on stage, who knows what, and who is the audience in on?","Motif trail: where does the image first appear, where does it return, and how has its meaning changed?"],
  traps:["Summarizing the plot of the whole work instead of analyzing the passage.","Treating stage directions as decoration; they often carry the key detail.","Assuming every tragic hero is simply bad. The tragedy is that good qualities and a flaw are tangled together.","Mixing up soliloquy (alone, thoughts) with monologue (long speech to others)."],
  graph:"tragedy"},
 {id:6, name:"Literary Argument", short:"Literary argument", ap:"Essays: 55% of score; 10–13% of MC", clep:"Interpretation questions", wAP:9, wCLEP:4, lab:null,
  summary:"Unit 6 is the skill behind all three essays and about a tenth of the multiple choice: building a defensible interpretation and supporting it with the text. Each essay is scored out of 6: a thesis point, up to 4 points for evidence and commentary, and a sophistication point.",
  points:["A thesis is a defensible interpretation that answers the prompt, not a summary or a list of devices. Strong theses name what the work suggests about a big idea and hint at how (the line of reasoning).",
   "Row A (thesis, 1 point) is earned by a clear, defensible claim that answers the prompt in one place, usually the introduction.",
   "Row B (evidence and commentary, up to 4 points) rewards specific evidence and, above all, commentary: explaining how the evidence supports your reasoning. The top scores explain how specific literary choices contribute to meaning, across the whole response.",
   "Row C (sophistication, 1 point) goes to essays that explore complexity: tensions, ambiguity, alternative readings, or how the work connects to a broader context, done consistently rather than in one sentence.",
   "The poetry and prose essays give you the text; read it twice, annotate shifts, and choose two or three choices that build one interpretation. Organize by idea, not by device or line order.",
   "The literary argument essay (Question 3) asks you to pick a work. Prepare three or four books or plays you know well, with characters, conflicts, key scenes and themes ready to adapt to any prompt.",
   "Commentary verbs: suggests, reveals, emphasizes, complicates, undercuts, transforms, mirrors. Avoid 'shows' every time.",
   "Time: about 40 minutes per essay. Spend 8 to 10 minutes reading and planning, and save 3 minutes to check that your thesis still matches what you argued."],
  formulas:["Thesis frame: \"Through [choice] and [choice], [author] portrays [subject] as ___, suggesting that ___.\"","Body paragraph: Claim → Evidence → Commentary (twice) → link to thesis","Complexity moves: 'at first ... yet', 'not only ... but also', 'while ___, ___ ultimately ___'"],
  traps:["A thesis that just lists devices ('uses imagery, diction and tone'). It earns no point.","Summary instead of commentary. If a sentence retells what happens, ask 'so what?'","Choosing a Question 3 work you only half remember. Specific details win.","Trying to earn sophistication with one fancy sentence at the end. It must run through the essay."],
  graph:"litessay"}
];
window.CS_MARKETS = {}; window.CS_SHIFTS = []; window.CS_EVENTS = [];
})();
