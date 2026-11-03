/* Credit Sprint AP® English Language (and CLEP® College Composition): six units, study notes and diagrams. All content is original.
   The College Board course has nine units built on four skill areas; here they are grouped into six units, with the exam's revision ("writing") questions in Unit 5.
   No economics graphs here, so CS_MARKETS / CS_SHIFTS / CS_EVENTS are empty. Diagrams live in CS_FIGS (each takes a step to highlight). */
(function(){
const ink = "var(--ink)", acc = "var(--accent)", mut = "var(--muted)", soft = "var(--accent-soft)";
const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.a || "middle"}" font-size="${o.fs || 12}" font-weight="${o.fw || 600}" fill="${o.c || ink}" font-family="Inter,system-ui,sans-serif">${s}</text>`;
const box = (x, y, w, h, on) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${on ? soft : "var(--surface)"}" stroke="${on ? acc : "var(--rule)"}" stroke-width="${on ? 2.4 : 1.4}"/>`;
const arrow = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${mut}" stroke-width="1.8" marker-end="url(#ahl)"/>`;
const svg = (body, title, h = 220) => `<svg viewBox="0 0 320 ${h}" role="img" aria-label="${title}" style="width:100%;max-width:420px"><defs><marker id="ahl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="${mut}"/></marker></defs>${body}</svg>`;
const flow = (title, steps) => v => svg(steps.map((st, i) => { const y = 8 + i * 42; return box(30, y, 260, 32, v === i + 1) + T(160, y + 20, st) + (i < steps.length - 1 ? arrow(160, y + 32, 160, y + 41) : ""); }).join(""), title, 8 + steps.length * 42);

window.CS_FIGS = {
  /* the rhetorical situation as a triangle with context around it */
  rhetsit: v => svg(`<rect x="8" y="8" width="304" height="204" rx="16" fill="none" stroke="${v === 5 ? acc : "var(--rule)"}" stroke-width="${v === 5 ? 2.4 : 1.4}" stroke-dasharray="6 5"/>` + T(160, 28, "Context and exigence (why now?)", {fs: 11, c: v === 5 ? acc : mut}) +
    `<path d="M160 52 L60 176 L260 176 Z" fill="none" stroke="${mut}" stroke-width="1.6"/>` +
    box(100, 40, 120, 30, v === 1) + T(160, 60, "Speaker / writer") + box(14, 166, 108, 30, v === 2) + T(68, 186, "Audience") + box(198, 166, 108, 30, v === 3) + T(252, 186, "Purpose") +
    box(110, 112, 100, 30, v === 4) + T(160, 132, "Message"), "The rhetorical situation", 220),
  /* claim, evidence, commentary */
  cec: flow("How a body paragraph works", ["Claim: an arguable point","Evidence: a fact, example, quotation","Commentary: how it proves the claim","More evidence + commentary","Link back to the thesis"]),
  /* ways to organize */
  structures: v => { const items = [["Chronological","in time order"],["Cause → effect","why it happened"],["Problem → solution","what to do"],["Compare / contrast","how they differ"],["Concession → rebuttal","yes, but..."],["General → specific","big idea, then cases"]];
    return svg(items.map((it, i) => { const x = i % 2 ? 166 : 14, y = 10 + Math.floor(i / 2) * 68; return box(x, y, 140, 56, v === i + 1) + T(x + 70, y + 25, it[0], {fs: 11.5}) + T(x + 70, y + 43, it[1], {fs: 10, fw: 500, c: mut}); }).join(""), "Common ways to organize an argument", 214); },
  /* style choices build tone */
  style: v => svg([["Diction","word choice"],["Syntax","sentence shape"],["Figurative language","comparisons"],["Imagery","sensory detail"]].map((it, i) => { const x = 14 + i * 76; return box(x, 14, 68, 64, v === i + 1) + T(x + 34, 42, it[0].split(" ")[0], {fs: 11}) + (it[0].includes(" ") ? T(x + 34, 56, it[0].split(" ")[1], {fs: 11}) : "") + T(x + 34, 70, it[1], {fs: 8.5, fw: 500, c: mut}) + arrow(x + 34, 80, 160, 118); }).join("") +
    box(70, 122, 180, 34, v === 5) + T(160, 144, "Tone: the writer's attitude") + arrow(160, 158, 160, 176) + box(70, 178, 180, 32, v === 6) + T(160, 199, "Serves the purpose"), "Style choices build tone", 216),
  /* revision checklist */
  revise: flow("How to answer a revision question", ["Read the writer's goal in the question","Find the sentence and its neighbors","Ask: does it fit the purpose here?","Check: relevance, order, transitions","Pick the most precise, concise option"]),
  /* the three essays */
  essays: v => svg([["Synthesis","argue using 3+ sources","40 min"],["Rhetorical analysis","how a writer persuades","40 min"],["Argument","your own position","40 min"]].map((it, i) => { const y = 10 + i * 66; return box(20, y, 280, 56, v === i + 1) + T(36, y + 24, it[0], {a: "start", fs: 13}) + T(36, y + 42, it[1], {a: "start", fs: 10.5, fw: 500, c: mut}) + T(284, y + 33, it[2], {a: "end", fs: 11, c: acc}); }).join(""), "The three AP® Language essays", 212)
};

window.CS_UNITS = [
 {id:1, name:"The Rhetorical Situation", short:"Rhetorical situation", ap:"Reading: 11–14% of MC", clep:"Rhetorical analysis", wAP:14, wCLEP:10, lab:null,
  summary:"Unit 1 is the foundation of the course: every text is written by someone, for someone, for a reason, at a particular moment. Questions on the rhetorical situation make up about a quarter of the multiple choice, and the rhetorical analysis essay is built on it.",
  points:["The rhetorical situation has five parts: the writer (speaker), the audience, the purpose, the message and the context. The exigence is the specific problem or occasion that prompts the writer to speak now.",
   "Audience shapes everything. A writer addressing skeptics concedes more; one addressing supporters rallies them. Ask what the audience already believes, values and fears.",
   "Purpose is what the writer wants the audience to think, feel or do: to persuade, inform, inspire, warn, praise or call to action. A text often has a main purpose and a secondary one.",
   "Writers make choices to appeal to an audience. Ethos builds the writer's credibility, pathos appeals to emotions and values, logos appeals to reason and evidence, and kairos seizes the timely moment.",
   "A writer's background, position and relationship to the audience shape how they establish credibility: a scientist cites data, a veteran shares experience, a mayor invokes shared civic pride.",
   "Shared values are a writer's strongest tool. Appealing to what the audience already cares about (fairness, family, freedom, safety) makes a new idea easier to accept.",
   "Context includes the time, place and events surrounding a text. A speech given the day after a disaster works differently from the same words a year later.",
   "On the exam, a question about why a writer includes a detail is usually a question about audience and purpose: how does this detail serve this audience at this moment?"],
  formulas:["SOAPSTone: Speaker · Occasion · Audience · Purpose · Subject · Tone","Rhetorical choice frame: \"[Writer] [verb] [choice] in order to [purpose] for [audience] because [context].\"","Appeal check: Who is speaking (ethos)? What do they want me to feel (pathos)? What reasons do they give (logos)? Why now (kairos)?"],
  traps:["Labeling an appeal without explaining it. 'This is pathos' earns nothing; why it works on this audience does.","Assuming the audience is 'everyone'. Find the specific audience the text targets.","Confusing purpose with topic. The topic is what a text is about; the purpose is what it is trying to do.","Treating appeals as separate boxes. A single sentence can build ethos and pathos at once."],
  graph:"rhetsit"},
 {id:2, name:"Claims and Evidence", short:"Claims & evidence", ap:"Reading: 13–16% of MC", clep:"Use of sources", wAP:14, wCLEP:15, lab:null,
  summary:"Unit 2 is about the building blocks of argument: the claim a writer makes and the evidence that supports it. You'll learn to tell a defensible claim from a fact, judge whether evidence fits, and explain how evidence proves a point, the skill behind every essay point you'll earn.",
  points:["A claim is an arguable statement that requires support. A thesis is the main claim of a whole text. Facts are not claims; reasonable people can disagree about a claim.",
   "Kinds of evidence: facts and statistics, expert testimony, personal experience, anecdotes, examples, analogies and quotations from texts. Strong arguments choose evidence that fits the audience.",
   "Evidence must be relevant (it supports this claim), sufficient (there is enough of it) and credible (from a trustworthy source). A single dramatic anecdote rarely proves a general claim.",
   "Commentary explains how evidence supports a claim. Without commentary, evidence is just decoration. In essays, commentary is where most points are earned.",
   "A counterargument presents an opposing view. A concession admits that part of the opposing view has merit. A rebuttal answers it. Addressing counterarguments builds ethos and strengthens the claim.",
   "Qualifiers (often, usually, in most cases) make claims more precise and defensible. Absolute words (always, never, everyone) are easy to attack.",
   "Synthesis means combining information from several sources to support your own argument. Sources should serve your claim, not replace it.",
   "Citing sources (Source A, the author's last name, or the title) gives credit and lets readers check evidence. Paraphrase and quotation both require citation."],
  formulas:["Claim test: Could a reasonable person disagree? If not, it's a fact, not a claim.","Paragraph frame: Claim → Evidence → Commentary (how and why) → Link to thesis","Counterargument frame: \"Some argue ___. While it's true that ___, ___ because ___.\""],
  traps:["Choosing evidence that is interesting but doesn't support the claim being made.","Treating a quotation as self-explanatory. Always explain it.","Confusing a counterargument with a concession: a concession admits the other side has a point.","Overgeneralizing from one example."],
  graph:"cec"},
 {id:3, name:"Reasoning and Organization", short:"Reasoning & organization", ap:"Reading: 13–16% of MC", clep:"Revision skills", wAP:12, wCLEP:10, lab:null,
  summary:"Unit 3 is about how arguments hold together: the line of reasoning that connects claims, the order of ideas, and the transitions that show their relationships. It also covers flaws in reasoning, the logical fallacies you'll spot on the exam and avoid in your own writing.",
  points:["A line of reasoning is the logical path from thesis to support: each claim builds on the last. Strong essays make that path visible with topic sentences and transitions.",
   "Common structures: chronological, cause and effect, problem and solution, compare and contrast, concession and rebuttal, and general to specific. Writers choose a structure to fit their purpose and audience.",
   "Transitions show relationships. Addition: furthermore, also. Contrast: however, yet. Cause: therefore, as a result. Example: for instance. Concession: admittedly, granted.",
   "Inductive reasoning moves from specific examples to a general conclusion; deductive reasoning applies a general principle to a specific case. Analogy reasons from a comparison.",
   "Logical fallacies are flaws in reasoning: ad hominem (attacking the person), straw man (misrepresenting the opposing view), false dilemma (only two options), slippery slope (one step leads inevitably to disaster), hasty generalization, post hoc (assuming cause from sequence), appeal to authority outside expertise, bandwagon and circular reasoning.",
   "Introductions orient the reader: they establish context and stakes and present the thesis. Conclusions extend the argument: they explain why it matters, not just repeat it.",
   "Paragraphs need unity (one main idea) and coherence (sentences connect logically). A sentence that wanders off topic weakens both.",
   "The position of an idea matters. Writers often save their strongest point for last, or open with a concession to disarm a skeptical audience."],
  formulas:["Transition check: What is the relationship? Addition, contrast, cause, example, sequence or concession?","Fallacy test: What does the argument skip: the real opponent, a real choice, the steps between cause and effect?","Order check: Why is this paragraph here and not earlier or later?"],
  traps:["Choosing a transition that sounds formal but shows the wrong relationship ('therefore' where 'however' is needed).","Mistaking a strong emotional appeal for a fallacy. Emotion isn't a fallacy unless it replaces reasoning.","Calling every personal criticism ad hominem; it's a fallacy only when it replaces a response to the argument.","Restating the thesis in the conclusion without adding significance."],
  graph:"structures"},
 {id:4, name:"Style", short:"Style", ap:"Reading: 11–14% of MC", clep:"Rhetorical analysis", wAP:14, wCLEP:10, lab:null,
  summary:"Unit 4 covers how a writer's word choice, sentence structure and figurative language create tone and serve a purpose. Style questions ask not what a sentence says but how its form shapes its effect, and they reward precise vocabulary for tone and rhetorical devices.",
  points:["Diction is word choice. Formal or informal, concrete or abstract, technical or plain, connotation-heavy or neutral: each choice signals tone and targets an audience.",
   "Syntax is sentence structure. Short sentences create emphasis and urgency; long periodic sentences build suspense by delaying the main clause; cumulative (loose) sentences add detail after the main clause.",
   "Parallelism repeats grammatical structure for balance and emphasis. Anaphora repeats words at the start of successive clauses. Antithesis sets opposites side by side in parallel form.",
   "Rhetorical questions engage the audience and imply an answer. Asyndeton (omitting conjunctions) speeds a list; polysyndeton (many conjunctions) slows it and adds weight.",
   "Figurative language in nonfiction: metaphors and analogies make abstract ideas concrete; allusions draw on shared texts or history to borrow authority or emotion.",
   "Tone is the writer's attitude toward the subject and audience: urgent, sardonic, earnest, conciliatory, indignant, reverent. Tone can shift, and shifts often mark turns in the argument.",
   "Irony and understatement create critical distance; hyperbole exaggerates for emphasis or humor; satire uses both to criticize.",
   "Every style choice should be connected to purpose: why would this writer, for this audience, write the sentence this way?"],
  formulas:["Style → effect: \"The [short/long/parallel] sentence emphasizes ___, which [purpose] for [audience].\"","Tone ladder: name the tone precisely (not 'negative' but 'indignant'), then find the words that create it.","Device check: name it, quote it, explain what it does here."],
  traps:["Naming devices without connecting them to purpose and audience.","Using vague tone words like 'positive' or 'emotional'.","Assuming formal diction is always better. The right diction fits the audience.","Missing irony. If the words praise but the context criticizes, read for the gap."],
  graph:"style"},
 {id:5, name:"Writing Like a Reviser", short:"Revision & conventions", ap:"Writing questions: about half of the MC", clep:"Revision + conventions: about half", wAP:40, wCLEP:45, lab:null,
  summary:"Unit 5 covers the exam's 20–22 writing questions, which ask you to revise a student's draft: add, cut or move a sentence, choose the best evidence or transition, or improve an introduction or conclusion. CLEP® College Composition also tests conventions of standard written English. This is the biggest single unit on both exams.",
  points:["Read the question's stated goal first. 'The writer wants to emphasize the cost of the program' tells you exactly what the right answer must do.",
   "To decide whether to add or delete a sentence, ask whether it supports the paragraph's main idea and the writer's purpose. A true and interesting sentence can still be off-topic.",
   "The best evidence is relevant, specific and suited to the claim. If the claim is about cost, numbers beat anecdotes; if it's about human impact, a vivid example may be best.",
   "Transitions must match the relationship between sentences. Read the sentences before and after the blank, name the relationship, then choose.",
   "Introductions should establish context and lead to the thesis; conclusions should extend the argument's significance. Hooks that are irrelevant or overblown hurt the draft.",
   "Concision: when two choices say the same thing, the shorter, clearer one usually wins. Cut redundancy ('past history', 'end result').",
   "Conventions (CLEP® and good writing everywhere): subject-verb agreement, pronoun clarity, parallel structure, modifier placement, complete sentences, comma splices, and consistent tense.",
   "Audience awareness in revision: a sentence written for experts may need a definition for general readers, and a casual phrase may weaken a formal proposal."],
  formulas:["Revision checklist: Goal? Relevance? Order? Transition? Concision?","Add/delete test: Would the paragraph lose something it needs if this sentence disappeared?","Evidence test: Does it prove this exact claim for this audience?"],
  traps:["Choosing the answer that adds the most information instead of the one that meets the stated goal.","Keeping a sentence because it's true. Relevance, not truth, decides.","Picking a transition by sound rather than logic.","Ignoring the sentences around the one being revised."],
  graph:"revise"},
 {id:6, name:"The Three Essays", short:"The essays", ap:"Essays: 55% of score", clep:"Two essays (CLEP® College Composition)", wAP:6, wCLEP:10, lab:null,
  summary:"Unit 6 is the free-response section: synthesis, rhetorical analysis and argument, each scored out of 6 points. The skills from Units 1–4 come together here. CLEP® College Composition also has two essays, one of them using sources.",
  points:["Each essay is scored on the same three rows: thesis (1 point), evidence and commentary (up to 4) and sophistication (1).",
   "Synthesis: read six sources, take a position on the question, and support it with at least three sources, citing each one. Your argument drives the essay; the sources serve it.",
   "Rhetorical analysis: explain how a writer's choices help achieve a purpose with an audience. Analyze choices (not just appeals) and always connect them to the rhetorical situation.",
   "Argument: take a position on a debatable issue and support it with your own evidence from history, current events, reading and experience. Specific evidence beats general claims.",
   "The thesis must take a defensible position (synthesis, argument) or explain the writer's choices and purpose (rhetorical analysis). It belongs in one place, usually the introduction.",
   "Commentary is the engine of the score. Each piece of evidence needs explanation of how it supports your line of reasoning.",
   "Sophistication can come from explaining the significance of the argument in a broader context, recognizing tensions and limits, or a consistently vivid, persuasive style.",
   "Pacing: about 40 minutes per essay. The 15-minute reading period is for the synthesis sources; use it to plan which three or four you'll cite."],
  formulas:["Synthesis thesis: \"Although ___, ___ because ___.\" (position + reasons)","Rhetorical analysis thesis: \"[Writer] [verbs] to [purpose], [choice] and [choice] to move [audience] toward ___.\"","Argument paragraph: Claim → specific example → commentary → why it matters"],
  traps:["Summarizing sources instead of using them.","In rhetorical analysis, writing 'the author uses pathos' without explaining how and why.","In argument, using hypothetical or vague examples ('people always say...').","Spending too long on the first essay and rushing the third."],
  graph:"essays"}
];
window.CS_MARKETS = {}; window.CS_SHIFTS = []; window.CS_EVENTS = [];
})();
