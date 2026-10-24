/* Credit Sprint pets: one egg per day (on your first correct answer), eggs hatch as you answer correctly,
   29 original pets per course (Macro and Micro) across 7 rarities, XP boosts, growth stages and reactions.
   Pets are grouped by subject so new subjects can add their own set to CS.PET_SETS. */
(function(){
"use strict";
const CS = window.CS, $ = CS.$, $$ = CS.$$, esc = CS.esc;
const S = () => CS.S();

/* ---------- rarities ---------- */
CS.RARITY = {
  common:   {n:"Common",    p:49, hatch:10, boost:0.02, col:"#9CA3AF", glow:"#E5E7EB"},
  uncommon: {n:"Uncommon",  p:27.5, hatch:15, boost:0.04, col:"#10B981", glow:"#D1FAE5"},
  rare:     {n:"Rare",      p:14, hatch:25, boost:0.07, col:"#3B82F6", glow:"#DBEAFE"},
  epic:     {n:"Epic",      p:6,  hatch:35, boost:0.10, col:"#A855F7", glow:"#F3E8FF"},
  legendary:{n:"Legendary", p:2,  hatch:50, boost:0.15, col:"#F59E0B", glow:"#FEF3C7"},
  mythical: {n:"Mythical",  p:1.45, hatch:60, boost:0.20, col:"#EC4899", glow:"#FCE7F3"},
  supreme:  {n:"Supreme Mythical", p:0.05, hatch:75, boost:0.30, col:"#7C3AED", glow:"#EDE9FE"}
};
const ORDER = ["common","uncommon","rare","epic","legendary","mythical","supreme"];
/* every egg is a mystery egg: rarity is rolled at hatch with the odds above, so every egg has the same chances */
CS.RARITY.mystery = {n:"Mystery", p:0, hatch:15, boost:0, col:"#6366F1", glow:"#EEF2FF"};
/* secret pets: never in eggs, merges or the market; only given out by special codes */
CS.RARITY.secret = {n:"Secret", p:0, hatch:0, boost:0.40, col:"#E11D48", glow:"#FFE4E6"};
const EGG_NEED = 15;
CS.RARITY_ORDER = ORDER;

/* ---------- Macroeconomics pet set (p = overall % chance) ---------- */
const MACRO = [
 // Unit 1
 {id:"squirrel", n:"Scarcity Squirrel", u:1, r:"common", p:6.5, c1:"#B7794A", c2:"#F2D7B8", ears:"round", extra:["bushytail","acorn"], bio:"Never has enough acorns, so every choice has an opportunity cost."},
 {id:"turtle", n:"Tradeoff Turtle", u:1, r:"common", p:6.5, c1:"#5FA35F", c2:"#CFE8C4", ears:"none", extra:["shell"], bio:"Carries a production possibilities curve on its shell."},
 {id:"crab", n:"Comparative Crab", u:1, r:"uncommon", p:4.5, c1:"#E2574C", c2:"#F8C9C2", ears:"none", extra:["claws","stalkeyes"], bio:"Specializes in one claw and trades for the rest."},
 // Unit 2
 {id:"gopher", n:"GDP Gopher", u:2, r:"common", p:6.5, c1:"#C9A26B", c2:"#F3E3C8", ears:"small", extra:["teeth","chart"], bio:"Counts every final good it digs up. Never double counts."},
 {id:"cat", n:"CPI Cat", u:2, r:"common", p:6, c1:"#8E95A3", c2:"#E6E8EC", ears:"pointy", extra:["pricetag","whiskers"], bio:"Tracks the price of a fixed basket of fish."},
 {id:"puffer", n:"Inflation Pufferfish", u:2, r:"uncommon", p:4, c1:"#F2B53A", c2:"#FCE8B8", ears:"none", extra:["spikes","fins"], bio:"Puffs up when prices rise. Calms down at 2%."},
 {id:"chameleon", n:"Business Cycle Chameleon", u:2, r:"rare", p:3, c1:"#3FB59B", c2:"#BFEDE2", ears:"none", extra:["wave","curltail"], bio:"Changes color with every peak and trough."},
 // Unit 3
 {id:"bunny", n:"Multiplier Bunny", u:3, r:"common", p:6.5, c1:"#F4F1F6", c2:"#FFD6E3", ears:"long", extra:["times"], bio:"One carrot becomes five. MPC of 0.8, of course."},
 {id:"duck", n:"Aggregate Demand Duck", u:3, r:"common", p:6, c1:"#F7CF3D", c2:"#FFF1B8", ears:"none", extra:["beak","downarrow"], bio:"Waddles down and to the right, just like AD."},
 {id:"sloth", n:"Stagflation Sloth", u:3, r:"uncommon", p:4, c1:"#9B8566", c2:"#DCCDB4", ears:"none", extra:["sleepy","mask2"], bio:"Slow growth, rising prices, and in no hurry about either."},
 {id:"fox", n:"Fiscal Fox", u:3, r:"rare", p:3, c1:"#EE7B30", c2:"#FFF1E6", ears:"pointy", extra:["foxtail","coin"], bio:"Spends wisely in recessions and saves in booms."},
 // Unit 4
 {id:"pig", n:"Piggy Bank", u:4, r:"common", p:6, c1:"#F7A8C0", c2:"#FDE1EA", ears:"pointy", extra:["snout","slot"], bio:"A store of value with a coin slot on top."},
 {id:"raccoon", n:"Reserve Raccoon", u:4, r:"uncommon", p:4, c1:"#7C8594", c2:"#D5D9E0", ears:"round", extra:["mask","coin"], bio:"Keeps exactly the required reserves. Lends the rest."},
 {id:"beaver", n:"Bond Beaver", u:4, r:"uncommon", p:4, c1:"#8B5E3C", c2:"#D9B48F", ears:"small", extra:["teeth","scroll"], bio:"Builds dams out of bonds. Price up, yield down."},
 {id:"owl", n:"Fed Owl", u:4, r:"rare", p:2.5, c1:"#6B5BD6", c2:"#DDD8FF", ears:"tufts", extra:["bigeyes","beak","glasses"], bio:"Wise, independent and fond of open market operations."},
 {id:"jelly", n:"Liquidity Jellyfish", u:4, r:"epic", p:2, c1:"#7DD3FC", c2:"#E0F7FF", ears:"none", extra:["tentacles","translucent","biolum"], bio:"The most liquid creature alive. Flows straight into any purchase."},
 // Unit 5
 {id:"penguin", n:"Phillips Penguin", u:5, r:"common", p:5, c1:"#2E3440", c2:"#F5F5F5", ears:"none", extra:["beak","flippers"], bio:"Slides along the short-run curve. Stands tall on the long-run one."},
 {id:"panda", n:"Productivity Panda", u:5, r:"uncommon", p:4, c1:"#F5F5F5", c2:"#FFFFFF", ears:"black", extra:["patches","sprout"], bio:"More output per bamboo stalk every year."},
 {id:"elephant", n:"Crowding-Out Elephant", u:5, r:"rare", p:3, c1:"#9AA5B4", c2:"#D7DEE7", ears:"elephant", extra:["trunk"], bio:"Takes up the whole loanable funds market when it borrows."},
 {id:"llama", n:"Long-Run Llama", u:5, r:"rare", p:2.5, c1:"#E9DCC7", c2:"#FFF8EE", ears:"pointy", extra:["longneck","fluff"], bio:"Patient. Knows output always returns to potential."},
 {id:"bull", n:"Market Bull", u:5, r:"epic", p:2, c1:"#2F6F4F", c2:"#9FD3B5", ears:"small", extra:["horns","nosering","uparrow","goldhorns"], bio:"Charges forward whenever confidence is high."},
 // Unit 6
 {id:"koala", n:"Currency Koala", u:6, r:"uncommon", p:3, c1:"#A7AFBA", c2:"#E7EAEE", ears:"fluffy", extra:["bignose","coins2"], bio:"Holds two currencies at once and trades them all day."},
 {id:"bear", n:"Market Bear", u:6, r:"epic", p:2, c1:"#7A4B2A", c2:"#C8956C", ears:"round", extra:["claws2","downarrow","scar"], bio:"Hibernates in recessions. Swipes down when markets fall."},
 // Legendary
 {id:"hand", n:"The Invisible Hand", u:1, r:"legendary", p:0.8, c1:"#FBBF24", c2:"#FEF3C7", ears:"none", extra:["hand","translucent","sparkle"], bio:"Guides every market to equilibrium. Rarely seen, always felt."},
 {id:"hydra", n:"Hyperinflation Hydra", u:2, r:"mythical", p:0.6, c1:"#B91C1C", c2:"#FCA5A5", custom:"hydra", bio:"Every time prices double, it grows another, bigger head. Only tight money can tame it."},
 {id:"swan", n:"The Black Swan", u:5, r:"mythical", p:0.5, c1:"#1E1B2E", c2:"#4C1D95", custom:"swan", bio:"A shock nobody predicted. Seen once in a generation, explained by everyone afterward."},
 {id:"dragon", n:"Compound Interest Dragon", u:4, r:"mythical", p:0.35, c1:"#047857", c2:"#6EE7B7", custom:"dragon", bio:"Guards a hoard that grows every year. The longer you wait, the bigger it gets."},
 {id:"celestial", n:"Celestial Equilibrium", u:0, r:"supreme", p:0.05, c1:"#FDE68A", c2:"#7C3AED", custom:"celestial", bio:"The keeper of every market in the universe. Where it looks, supply meets demand. Roughly 1 in 2,000 eggs."},
 {id:"phoenix", n:"Equilibrium Phoenix", u:3, r:"legendary", p:1.2, c1:"#F97316", c2:"#FDE68A", ears:"crest", extra:["beak","wings","xcurves","sparkle","flametips"], bio:"Rises from every recession and lands exactly where supply meets demand."}
];

/* ---------- Microeconomics pet set (same odds per rarity as Macro) ---------- */
const MICRO = [
 {id:"otter", n:"Opportunity Otter", u:1, r:"common", p:6.5, c1:"#8B5E3C", c2:"#E8CFB0", ears:"small", extra:["whiskers","shells"], bio:"Can crack one more clam or take a nap. Never both. Every choice has a cost."},
 {id:"hedgehog", n:"Marginal Hedgehog", u:1, r:"common", p:6, c1:"#9C7B5B", c2:"#F1E1CC", ears:"small", extra:["spikes"], bio:"Grows one more spine only if it's worth the marginal cost."},
 {id:"deer", n:"Demand Deer", u:2, r:"common", p:6.5, c1:"#B7834F", c2:"#F3DFC4", ears:"pointy", extra:["antlers","downarrow"], bio:"Wants more acorns when they're cheap. The law of demand, with antlers."},
 {id:"sheep", n:"Supply Sheep", u:2, r:"common", p:6, c1:"#F5F5F4", c2:"#FFFFFF", ears:"small", extra:["fluff","uparrow"], bio:"Grows more wool whenever the price of wool goes up."},
 {id:"seal", n:"Surplus Seal", u:2, r:"common", p:6, c1:"#94A3B8", c2:"#E2E8F0", ears:"none", extra:["flippers","whiskers"], bio:"The price floor is too high, so it always has extra fish lying around."},
 {id:"mole", n:"Marginal Cost Mole", u:3, r:"common", p:6, c1:"#6B5B53", c2:"#D6C7BC", ears:"none", extra:["hardhat","teeth"], bio:"Digs one more tunnel only while price covers the marginal cost."},
 {id:"pigeon", n:"Price-Taker Pigeon", u:3, r:"common", p:6, c1:"#A1A1AA", c2:"#E4E4E7", ears:"none", extra:["beak","pricetag"], bio:"Takes whatever price the market gives it. Never argues."},
 {id:"puppy", n:"Paycheck Puppy", u:5, r:"common", p:6, c1:"#D4A373", c2:"#FAEDCD", ears:"round", extra:["coin","tie"], bio:"Works for treats until its MRP equals the price of a treat."},
 {id:"unicorn", n:"Utility Unicorn", u:1, r:"uncommon", p:4, c1:"#FBCFE8", c2:"#FFFFFF", ears:"pointy", extra:["horn","fluff"], bio:"Each extra rainbow gives a little less joy. Diminishing marginal utility, in sparkly form."},
 {id:"gecko", n:"Elastic Gecko", u:2, r:"uncommon", p:4, c1:"#84CC16", c2:"#ECFCCB", ears:"none", extra:["curltail","bigeyes"], bio:"Stretches way out when prices change. Its elasticity is always greater than 1."},
 {id:"toad", n:"Tax Wedge Toad", u:2, r:"uncommon", p:4, c1:"#65A30D", c2:"#D9F99D", ears:"none", extra:["bigeyes","pricetag"], bio:"Croaks a wedge between what buyers pay and what sellers keep."},
 {id:"dodo", n:"Diminishing Returns Dodo", u:3, r:"uncommon", p:4, c1:"#A8A29E", c2:"#E7E5E4", ears:"none", extra:["beak","sleepy"], bio:"Every extra worker in its nest adds a little less. It's tired of crowding."},
 {id:"crow", n:"Cartel Crow", u:4, r:"uncommon", p:3.5, c1:"#1F2937", c2:"#6B7280", ears:"none", extra:["beak","tie"], bio:"Promises to cut output with the flock. Secretly cheats every time."},
 {id:"meerkat", n:"MRP Meerkat", u:5, r:"uncommon", p:4, c1:"#C8A27A", c2:"#F4E4CF", ears:"small", extra:["longneck","chart"], bio:"Stands tall to check one thing: does the next worker add more than they cost?"},
 {id:"possum", n:"Pollution Possum", u:6, r:"uncommon", p:4, c1:"#9CA3AF", c2:"#F3F4F6", ears:"round", extra:["smoke","bignose"], bio:"Ignores the smog it makes for its neighbors. Needs a Pigouvian tax."},
 {id:"flamingo", n:"Equilibrium Flamingo", u:2, r:"rare", p:3, c1:"#F472B6", c2:"#FCE7F3", ears:"none", extra:["longneck","beak","xcurves"], bio:"Balances perfectly where supply meets demand. On one leg."},
 {id:"lynx", n:"Long-Run Lynx", u:3, r:"rare", p:3, c1:"#C08457", c2:"#F5E6D3", ears:"tufts", extra:["whiskers","glasses"], bio:"Patiently waits for entry and exit to push economic profit to zero."},
 {id:"octopus", n:"Oligopoly Octopus", u:4, r:"rare", p:3, c1:"#A855F7", c2:"#F3E8FF", ears:"none", extra:["tentacles","bigeyes"], bio:"Keeps an eye, and an arm, on every rival's price."},
 {id:"walrus", n:"Union Walrus", u:5, r:"rare", p:2.5, c1:"#A47551", c2:"#E7CBB0", ears:"none", extra:["tusks","whiskers","sign"], bio:"Bargains for higher wages for the whole colony."},
 {id:"lemur", n:"Lorenz Lemur", u:6, r:"rare", p:2.5, c1:"#9CA3AF", c2:"#F9FAFB", ears:"round", extra:["ringtail","bigeyes"], bio:"Its tail curves just like a Lorenz curve. The bigger the bow, the more inequality."},
 {id:"lion", n:"Monopoly Lion", u:4, r:"epic", p:2, c1:"#E0A040", c2:"#FDE8C4", ears:"round", extra:["mane","crown","whiskers"], bio:"King of a market with no rivals. Sets MR = MC, then charges what the jungle will pay."},
 {id:"mammoth", n:"Monopsony Mammoth", u:5, r:"epic", p:2, c1:"#7C5A3C", c2:"#C4A27E", ears:"elephant", extra:["trunk","tusks","fluff"], bio:"The only employer in the valley. Hires fewer workers and pays them less."},
 {id:"pegasus", n:"Public Goods Pegasus", u:6, r:"epic", p:2, c1:"#E0F2FE", c2:"#FFFFFF", ears:"pointy", extra:["wings","fluff","sparkle"], bio:"Lights up the whole sky for everyone. Nobody can be excluded, so nobody wants to pay."},
 {id:"goose", n:"Golden Surplus Goose", u:2, r:"legendary", p:1.1, c1:"#FBBF24", c2:"#FEF3C7", ears:"none", extra:["beak","goldegg","sparkle"], bio:"Lays a golden egg of consumer surplus every time the market clears."},
 {id:"eagle", n:"Efficiency Eagle", u:3, r:"legendary", p:0.9, c1:"#7C4A1E", c2:"#FFFFFF", ears:"none", extra:["beak","wings","crown","sparkle"], bio:"Soars where P = MC = minimum ATC. Allocatively and productively efficient."},
 {id:"griffin", n:"Dominant Strategy Griffin", u:4, r:"mythical", p:0.6, c1:"#D4A017", c2:"#FFFFFF", custom:"griffin", bio:"Half lion, half eagle, all strategy. It always knows its best move, no matter what you do."},
 {id:"leviathan", n:"Deadweight Leviathan", u:2, r:"mythical", p:0.5, c1:"#0E7490", c2:"#67E8F9", custom:"leviathan", bio:"Rises from the triangle of lost surplus whenever a market is pushed away from equilibrium."},
 {id:"kitsune", n:"Commons Kitsune", u:6, r:"mythical", p:0.35, c1:"#FFF7ED", c2:"#F472B6", custom:"kitsune", bio:"Guards the shared forest with nine glowing tails. Overgraze it and the lights go out."},
 {id:"seraph", n:"Pareto Seraph", u:0, r:"supreme", p:0.05, c1:"#FDE68A", c2:"#F0ABFC", custom:"seraph", bio:"Where it flies, no one can be made better off without making someone worse off. Roughly 1 in 2,000 eggs."}
];

/* ---------- Biology pet set (same odds per rarity) ---------- */
const BIO = [
 {id:"b_tardi", body:"tardigrade", n:"Tardi the Water Bear", u:1, r:"common", p:6.5, c1:"#D9A066", c2:"#FDE8CF", custom:"bio", bio:"Survives boiling, freezing and outer space by drying itself into a tun. Nothing rattles it."},
 {id:"b_drop", body:"droplet", n:"Dewdrop", u:1, r:"common", p:6, c1:"#7DD3FC", c2:"#E0F2FE", custom:"bio", bio:"Always holding hands with the droplet next door. Hydrogen bonds make it the stickiest friend you have."},
 {id:"b_mito", body:"mito", n:"Mitzi the Mitochondrion", u:3, r:"common", p:6.5, c1:"#FB923C", c2:"#FFEDD5", custom:"bio", bio:"Folds its inner membrane into cristae so it can pump out more ATP. Yes, it's the powerhouse."},
 {id:"b_amoeba", body:"amoeba", n:"Blobbert the Amoeba", u:2, r:"common", p:6, c1:"#A7F3D0", c2:"#ECFDF5", custom:"bio", bio:"Never the same shape twice. Wraps its pseudopods around lunch and calls it phagocytosis."},
 {id:"b_bacil", body:"bacillus", n:"Rod the Bacillus", u:2, r:"common", p:6, c1:"#C4B5FD", c2:"#F5F3FF", custom:"bio", bio:"No nucleus, no problem. Spins its flagellum like a propeller and splits in two every 20 minutes."},
 {id:"b_chloro", body:"chloro", n:"Chloe the Chloroplast", u:3, r:"common", p:6, c1:"#4ADE80", c2:"#DCFCE7", custom:"bio", bio:"Stacks its thylakoids into neat grana and turns sunlight into sugar all afternoon."},
 {id:"b_shroom", body:"mushroom", n:"Spore Cap", u:8, r:"common", p:6, c1:"#EF4444", c2:"#FEF2F2", custom:"bio", bio:"A decomposer that returns nutrients to the soil. Its real body is a hidden web of hyphae underground."},
 {id:"b_sprout", body:"sprout", n:"Sprig the Seedling", u:4, r:"common", p:6, c1:"#86EFAC", c2:"#F0FDF4", custom:"bio", bio:"Bends toward the window thanks to auxin. Phototropism is its whole personality."},
 {id:"b_para", body:"paramecium", n:"Para the Slipper", u:2, r:"uncommon", p:4, c1:"#93C5FD", c2:"#EFF6FF", custom:"bio", bio:"Rows itself around with thousands of cilia and bails out extra water with a contractile vacuole."},
 {id:"b_chain", body:"chain", n:"Polly Peptide", u:6, r:"uncommon", p:4, c1:"#F472B6", c2:"#FCE7F3", custom:"bio", bio:"A string of amino acids still deciding how to fold. Shape decides function, so it's taking its time."},
 {id:"b_neuron", body:"neuron", n:"Zap the Neuron", u:4, r:"uncommon", p:4, c1:"#FACC15", c2:"#FEF9C3", custom:"bio", bio:"Fires all-or-nothing action potentials down its axon. Talks to friends by tossing neurotransmitters."},
 {id:"b_bee", body:"bee", n:"Buzz the Pollinator", u:8, r:"uncommon", p:4, c1:"#FBBF24", c2:"#1F2937", custom:"bio", bio:"Trades pollination for nectar. A mutualism so good that whole ecosystems depend on it."},
 {id:"b_diatom", body:"diatom", n:"Glassy the Diatom", u:8, r:"uncommon", p:3.5, c1:"#5EEAD4", c2:"#F0FDFA", custom:"bio", bio:"Lives in a glass house of silica and makes a big share of the oxygen you breathe."},
 {id:"b_coral", body:"coral", n:"Reefy the Coral", u:8, r:"uncommon", p:4, c1:"#FB7185", c2:"#FFE4E6", custom:"bio", bio:"Shares its home with algae that feed it sugar. Too much heat and they leave, and the coral bleaches."},
 {id:"b_axo", body:"axolotl", n:"Axel the Axolotl", u:4, r:"uncommon", p:4, c1:"#F9A8D4", c2:"#FDF2F8", custom:"bio", bio:"Regrows lost limbs with stem cells and keeps its frilly gills for life."},
 {id:"b_helix", body:"helix", n:"Twisty the Double Helix", u:6, r:"rare", p:3, c1:"#8B5CF6", c2:"#EDE9FE", custom:"bio", bio:"Two antiparallel strands, held by base pairs. A with T, G with C, never anything else."},
 {id:"b_comb", body:"combjelly", n:"Prism the Comb Jelly", u:7, r:"rare", p:3, c1:"#A5F3FC", c2:"#ECFEFF", custom:"bio", bio:"Beats rows of combs that scatter light into rainbows. One of the oldest animal lineages."},
 {id:"b_star", body:"starfish", n:"Stella the Sea Star", u:7, r:"rare", p:3, c1:"#F97316", c2:"#FFEDD5", custom:"bio", bio:"A keystone predator. Take it off the rocks and the mussels take over the whole shore."},
 {id:"b_fly", body:"butterfly", n:"Morpho the Metamorph", u:4, r:"rare", p:2.5, c1:"#3B82F6", c2:"#DBEAFE", custom:"bio", bio:"Started as a caterpillar and let hormones rebuild its whole body. Its blue comes from structure, not pigment."},
 {id:"b_golgi", body:"golgi", n:"Gogo the Golgi", u:2, r:"rare", p:2.5, c1:"#F59E0B", c2:"#FEF3C7", custom:"bio", bio:"Folds, tags and ships proteins in little vesicles. The post office of the cell."},
 {id:"b_radio", body:"radiolarian", n:"Radia the Radiolarian", u:7, r:"epic", p:2, c1:"#E879F9", c2:"#FAE8FF", custom:"bio", bio:"Builds a lacy glass skeleton with spines in every direction. Its shells pile up into ocean ooze."},
 {id:"b_mitosis", body:"mitosis", n:"Twins in Telophase", u:4, r:"epic", p:2, c1:"#60A5FA", c2:"#DBEAFE", custom:"bio", bio:"Two identical cells halfway through saying goodbye. Same chromosomes, same jokes."},
 {id:"b_trap", body:"flytrap", n:"Snapper the Flytrap", u:8, r:"epic", p:2, c1:"#65A30D", c2:"#FCA5A5", custom:"bio", bio:"Grows in nitrogen-poor bogs, so it catches its nitrogen with snap-shut leaves."},
 {id:"b_tree", body:"tree", n:"Elder Oak of Life", u:7, r:"legendary", p:1.1, c1:"#15803D", c2:"#86EFAC", custom:"bio", bio:"Every branch is a lineage and every fork is a common ancestor. The whole phylogeny in one trunk."},
 {id:"b_angler", body:"angler", n:"Lumen the Anglerfish", u:8, r:"legendary", p:0.9, c1:"#334155", c2:"#67E8F9", custom:"bio", bio:"Lights up the deep sea with glowing symbiotic bacteria. Whoever follows the light becomes dinner."},
 {id:"b_phage", body:"phage", n:"Phage Prime", u:6, r:"mythical", p:0.6, c1:"#94A3B8", c2:"#E2E8F0", custom:"bio", bio:"Lands on a bacterium, injects its DNA and takes over the factory. Not alive, but unstoppable."},
 {id:"b_coel", body:"coelacanth", n:"The Living Fossil", u:7, r:"mythical", p:0.5, c1:"#1E3A8A", c2:"#93C5FD", custom:"bio", bio:"Thought extinct for 66 million years, then caught off South Africa in 1938. Its fleshy fins hint at the first legs."},
 {id:"b_vent", body:"tubeworm", n:"Abyss Tubeworm", u:3, r:"mythical", p:0.35, c1:"#DC2626", c2:"#F8FAFC", custom:"bio", bio:"No mouth and no gut. Bacteria inside it run chemosynthesis on volcanic vent chemicals, with no sunlight at all."},
 {id:"luca", body:"luca", n:"LUCA, the First Ancestor", u:0, r:"supreme", p:0.05, c1:"#FDE68A", c2:"#10B981", custom:"bio", bio:"The last universal common ancestor of every living thing. Roughly 1 in 2,000 eggs."}
];
CS.PET_SETS = {macro:{name:"Macroeconomics", pets:MACRO}, micro:{name:"Microeconomics", pets:MICRO}, bio:{name:"Biology", pets:BIO}};
const SET = CS.PET_SETS[CS.COURSE] ? CS.PET_SETS[CS.COURSE].pets : MACRO;
CS.PETS = SET;
const SECRET = [
 {id:"rahul", n:"Rahul", u:0, r:"secret", p:0, c1:"#B07A45", c2:"#E8C79A", custom:"rahul", bio:"A calm, golden-crowned capybara who somehow always knows the answer. Secret pet. Only friends of Credit Sprint get one."}
];
CS.SECRET_PETS = SECRET;
CS.PET = Object.fromEntries(MACRO.concat(MICRO, BIO, SECRET).map(p=>[p.id,p]));

/* ---------- state ---------- */
function st(){ const s = S(); if (!s.pets) s.pets = {eggs:[], owned:{}, active:null, lastEgg:"", hatched:0};
  const P = s.pets; [P.eggs, P.pending||[]].forEach(list => list.forEach(e => { if (e.r !== "mystery") { e.r = "mystery"; e.need = EGG_NEED; e.prog = Math.min(e.prog, EGG_NEED-1); } }));
  return P; }
let uid = 0;
/* roll with a minimum rarity (season-pass eggs): odds are re-scaled over the allowed rarities */
function rollRarityMin(min){ const i0 = Math.max(0, ORDER.indexOf(min)), ks = ORDER.slice(i0), tot = ks.reduce((a,k)=>a+CS.RARITY[k].p,0); let r = Math.random()*tot; for (const k of ks) { r -= CS.RARITY[k].p; if (r <= 0) return k; } return ks[0]; }
/* add an egg to the nest (season rewards, gem shop) */
CS.giveEgg = (minR) => { const P = st(); const e = {id:"e"+Date.now()+(uid++), r:"mystery", prog:0, need:EGG_NEED, at:CS.today()}; if (minR && minR !== "common") e.minR = minR; P.eggs.push(e); CS.save(); return e; };
/* instant-hatch egg: goes straight to the hatch queue and opens right away (pass lane, chests) */
CS.giveInstantEgg = (minR) => { const P = st(); const e = {id:"e"+Date.now()+(uid++), r:"mystery", prog:EGG_NEED, need:EGG_NEED, at:CS.today(), instant:true}; if (minR && minR !== "common") e.minR = minR; (P.pending = P.pending || []).push(e); CS.save(); setTimeout(() => CS.petFlush(true), 250); return e; };
CS.RARITY_NAME = k => CS.RARITY[k] ? CS.RARITY[k].n : k;
function rollRarity(rnd=Math.random){ let r = rnd()*100; for (const k of ORDER) { r -= CS.RARITY[k].p; if (r <= 0) return k; } return "common"; }
function rollPet(rarity){ const pool = SET.filter(p=>p.r===rarity), tot = pool.reduce((a,p)=>a+p.p,0); let r = Math.random()*tot; for (const p of pool) { r -= p.p; if (r <= 0) return p; } return pool[0]; }
CS.petBoost = () => { const a = st().active; return a ? CS.RARITY[CS.PET[a].r].boost : 0; };
CS.petStage = pid => { const o = st().owned[pid]; const g = o ? o.growth : 0; return g >= 100 ? 3 : g >= 30 ? 2 : 1; };
CS.petLevel = pid => { const o = st().owned[pid]; return o ? Math.min(30, 1 + Math.floor(o.growth/10)) : 0; };
const STAGE = ["","Baby","Teen","Adult"];

/* XP boost from the active pet */
const baseAdd = CS.addXP;
CS.addXP = n => baseAdd(n > 0 ? Math.round(n * (1 + CS.petBoost())) : n);

/* egg + hatch progress on every correct answer */
const baseRecord = CS.record;
/* eggs come fast at first (every 5 questions) and slow down to every 25 as the collection grows */
const eggsSoFar = () => { const P = st(); return (P.hatched || 0) + (P.eggs || []).length + ((P.pending || []).length); };
CS.eggEvery = () => Math.min(25, 5 + 2 * eggsSoFar());
/* first eggs also hatch faster: 5 correct answers, rising to 15 */
CS.eggNeed = () => Math.min(EGG_NEED, 5 + 2 * eggsSoFar());
Object.defineProperty(CS, "EGG_EVERY", {get: () => CS.eggEvery(), configurable: true});
CS.record = (q, ok, xp=true) => {
  baseRecord(q, ok, xp);
  const P = st();
  /* every answered question (right or wrong) counts toward the next egg */
  P.ans = (P.ans||0) + 1;
  P.eggAns = (P.eggAns||0) + 1;
  let newEgg = null;
  const every = CS.eggEvery();
  if (P.eggAns >= every) {
    P.eggAns = 0;
    const need = CS.eggNeed();
    newEgg = {id:"e"+Date.now()+(uid++), r:"mystery", prog:0, need, at:CS.today()};
    P.eggs.push(newEgg);
    CS.toast(`${every} questions answered: you earned a mystery egg! It hatches after ${need} correct answers.`);
  }
  if (!ok) { CS.save(); if (newEgg) CS.petReact("egg", newEgg); else CS.petReact("oops"); return; }
  /* only correct answers grow your pet and hatch eggs */
  if (P.active && P.owned[P.active]) { const o = P.owned[P.active]; const before = CS.petStage(P.active); o.growth += (CS.isPro && CS.isPro()) ? 1.1 : 1; o.growth = Math.round(o.growth*10)/10; const after = CS.petStage(P.active); if (after > before) CS.toast(`${CS.PET[P.active].n} grew into a${after===3?"n adult":" teen"}!`); }
  const egg = P.eggs[0];
  if (egg && egg !== newEgg) { egg.prog++; if (egg.prog >= egg.need) { P.eggs.shift(); (P.pending = P.pending || []).push(egg); CS.save(); setTimeout(CS.petFlush, 600); return; } }
  CS.save(); if (newEgg) CS.petReact("egg", newEgg); else CS.petReact("yay", egg);
};
CS.nextEggIn = () => Math.max(1, CS.eggEvery() - (st().eggAns||0));


/* ---------- SVG designs ---------- */
CS.eggSVG = (r, prog=0, need=1, size=80) => {
  const R = CS.RARITY[r], f = Math.min(1, prog/need);
  if (r === "mystery") { const g = "megg"+(++gid);
    const crackM = (f > 0.5 ? `<path d="M30 52 L38 46 L44 54 L52 45 L58 52" stroke="#3730A3" stroke-width="2" fill="none" opacity=".6"/>` : "") + (f > 0.8 ? `<path d="M34 66 L40 60 L47 67 L54 61" stroke="#3730A3" stroke-width="2" fill="none" opacity=".6"/>` : "");
    return `<svg viewBox="0 0 88 100" width="${size}" height="${size*100/88}" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E0E7FF"/><stop offset=".35" stop-color="#FCE7F3"/><stop offset=".7" stop-color="#D1FAE5"/><stop offset="1" stop-color="#FEF3C7"/></linearGradient></defs>
      <ellipse cx="44" cy="94" rx="24" ry="4" fill="#000" opacity=".08"/>
      <path d="M44 6 C64 6 80 40 80 62 C80 82 64 94 44 94 C24 94 8 82 8 62 C8 40 24 6 44 6Z" fill="url(#${g})" stroke="#6366F1" stroke-width="3"/>
      <circle cx="26" cy="44" r="4" fill="#A78BFA" opacity=".6"/><circle cx="62" cy="34" r="3.5" fill="#F472B6" opacity=".6"/><circle cx="64" cy="72" r="4.5" fill="#34D399" opacity=".55"/><circle cx="24" cy="74" r="3.5" fill="#FBBF24" opacity=".6"/>
      <text x="44" y="70" text-anchor="middle" font-size="34" font-weight="800" fill="#6366F1" opacity=".85" font-family="Manrope, sans-serif">?</text>
      <ellipse cx="32" cy="26" rx="6" ry="10" fill="#fff" opacity=".6" transform="rotate(-20 32 26)"/>${crackM}</svg>`; }
  const crack = f > 0.5 ? `<path d="M30 52 L38 46 L44 54 L52 45 L58 52" stroke="#3a2f2f" stroke-width="2" fill="none" opacity=".55"/>` : "";
  const crack2 = f > 0.8 ? `<path d="M34 66 L40 60 L47 67 L54 61" stroke="#3a2f2f" stroke-width="2" fill="none" opacity=".55"/>` : "";
  return `<svg viewBox="0 0 88 100" width="${size}" height="${size*100/88}" aria-hidden="true">
    <ellipse cx="44" cy="94" rx="24" ry="4" fill="#000" opacity=".08"/>
    <path d="M44 6 C64 6 80 40 80 62 C80 82 64 94 44 94 C24 94 8 82 8 62 C8 40 24 6 44 6Z" fill="${R.glow}" stroke="${R.col}" stroke-width="3"/>
    <circle cx="30" cy="40" r="6" fill="${R.col}" opacity=".55"/><circle cx="56" cy="30" r="4" fill="${R.col}" opacity=".55"/><circle cx="60" cy="64" r="7" fill="${R.col}" opacity=".45"/><circle cx="28" cy="72" r="4" fill="${R.col}" opacity=".5"/>
    ${r==="legendary"?`<path d="M44 18 l3 7 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z" fill="#fff" opacity=".9"/>`:""}
    ${r==="mythical"?`<text x="44" y="60" text-anchor="middle" font-size="18" font-weight="800" fill="#fff" opacity=".9" font-family="Manrope, sans-serif">∑</text><path d="M20 50 C30 44 58 44 68 50" stroke="#A78BFA" stroke-width="3" fill="none"/>`:""}
    ${r==="supreme"?`<defs><linearGradient id="segg${++gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F43F5E"><animate attributeName="stop-color" values="#F43F5E;#F59E0B;#10B981;#3B82F6;#A855F7;#F43F5E" dur="5s" repeatCount="indefinite"/></stop><stop offset="1" stop-color="#3B82F6"><animate attributeName="stop-color" values="#3B82F6;#A855F7;#F43F5E;#F59E0B;#10B981;#3B82F6" dur="5s" repeatCount="indefinite"/></stop></linearGradient></defs><path d="M44 6 C64 6 80 40 80 62 C80 82 64 94 44 94 C24 94 8 82 8 62 C8 40 24 6 44 6Z" fill="url(#segg${gid})" opacity=".85"/><path d="M44 40 l4 9 10 1 -8 6 3 10 -9 -5 -9 5 3 -10 -8 -6 10 -1z" fill="#fff"/>`:""}
    <ellipse cx="32" cy="26" rx="6" ry="10" fill="#fff" opacity=".5" transform="rotate(-20 32 26)"/>${crack}${crack2}</svg>`;
};
let gid = 0;
const FX_RAR = {rare:1, epic:2, legendary:3, mythical:4, supreme:5};
function sparkle(x, y, s, col, dur, delay){ return `<path d="M${x} ${y-s} L${x+s*.3} ${y-s*.3} L${x+s} ${y} L${x+s*.3} ${y+s*.3} L${x} ${y+s} L${x-s*.3} ${y+s*.3} L${x-s} ${y} L${x-s*.3} ${y-s*.3}Z" fill="${col}"><animate attributeName="opacity" values="0;1;0" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/></path>`; }
function fxLayers(r, id, still, p = {}){
  const lv = FX_RAR[r] || 0; if (!lv) return {defs:"", back:"", front:""};
  const A = (x) => still ? "" : x; let defs = "", back = "", front = "";
  if (r === "rare") {
    defs = `<radialGradient id="${id}g"><stop offset="0" stop-color="#93C5FD" stop-opacity=".7"/><stop offset="1" stop-color="#93C5FD" stop-opacity="0"/></radialGradient>`;
    back = `<circle cx="60" cy="68" r="54" fill="url(#${id}g)"/>`;
    front = sparkle(20,30,4,"#60A5FA",2.2,0) + sparkle(100,40,3,"#93C5FD",2.6,.8) + sparkle(96,96,3.5,"#60A5FA",2.4,1.4);
  }
  if (r === "epic") {
    defs = `<radialGradient id="${id}g"><stop offset="0" stop-color="#C084FC" stop-opacity=".75"/><stop offset=".7" stop-color="#A855F7" stop-opacity=".2"/><stop offset="1" stop-color="#A855F7" stop-opacity="0"/></radialGradient>`;
    back = `<circle cx="60" cy="66" r="58" fill="url(#${id}g)"/><g>${A(`<animateTransform attributeName="transform" type="rotate" from="0 60 66" to="360 60 66" dur="14s" repeatCount="indefinite"/>`)}<circle cx="60" cy="66" r="52" fill="none" stroke="#C084FC" stroke-width="1.5" stroke-dasharray="3 7" opacity=".8"/>
      <circle cx="60" cy="14" r="3.5" fill="#E9D5FF"/><circle cx="112" cy="66" r="2.5" fill="#D8B4FE"/><circle cx="60" cy="118" r="3" fill="#E9D5FF"/><circle cx="8" cy="66" r="2.5" fill="#D8B4FE"/></g>`;
    front = sparkle(18,26,5,"#E9D5FF",2,0) + sparkle(102,30,4,"#C084FC",2.4,.6) + sparkle(104,92,4,"#E9D5FF",2.2,1.2) + sparkle(14,90,3,"#C084FC",2.6,1.6);
  }
  if (r === "legendary") {
    defs = `<radialGradient id="${id}g"><stop offset="0" stop-color="#FDE68A" stop-opacity=".95"/><stop offset=".6" stop-color="#FBBF24" stop-opacity=".25"/><stop offset="1" stop-color="#F59E0B" stop-opacity="0"/></radialGradient>`;
    const rays = Array.from({length:12},(_,i)=>`<path d="M60 66 L${(60+70*Math.cos((i*30-4)*Math.PI/180)).toFixed(1)} ${(66+70*Math.sin((i*30-4)*Math.PI/180)).toFixed(1)} L${(60+70*Math.cos((i*30+4)*Math.PI/180)).toFixed(1)} ${(66+70*Math.sin((i*30+4)*Math.PI/180)).toFixed(1)}Z" fill="#FCD34D" opacity=".35"/>`).join("");
    back = `<g>${A(`<animateTransform attributeName="transform" type="rotate" from="0 60 66" to="360 60 66" dur="24s" repeatCount="indefinite"/>`)}${rays}</g><circle cx="60" cy="66" r="56" fill="url(#${id}g)"/>`;
    front = sparkle(16,24,6,"#FBBF24",1.8,0) + sparkle(104,22,5,"#FDE68A",2.2,.5) + sparkle(108,90,5,"#FBBF24",2,1) + sparkle(12,92,4,"#FDE68A",2.4,1.5) + sparkle(60,6,4,"#FFF7D6",2,.9);
  }
  if (r === "mythical") {
    defs = `<radialGradient id="${id}g"><stop offset="0" stop-color="#F9A8D4" stop-opacity=".9"/><stop offset=".45" stop-color="#A78BFA" stop-opacity=".45"/><stop offset=".8" stop-color="#22D3EE" stop-opacity=".15"/><stop offset="1" stop-color="#22D3EE" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F472B6"/><stop offset=".5" stop-color="#A78BFA"/><stop offset="1" stop-color="#22D3EE"/></linearGradient>`;
    const runes = (p.runes||["∑","Δ","π","∞","%","$","Δ","∑"]).map((t,i)=>{ const a = i*45*Math.PI/180; return `<text x="${(60+52*Math.cos(a)).toFixed(1)}" y="${(70+52*Math.sin(a)).toFixed(1)}" text-anchor="middle" font-size="9" font-weight="800" fill="#F5D0FE" font-family="Manrope, sans-serif">${t}</text>`; }).join("");
    back = `<circle cx="60" cy="66" r="60" fill="url(#${id}g)"/><g>${A(`<animateTransform attributeName="transform" type="rotate" from="0 60 66" to="-360 60 66" dur="30s" repeatCount="indefinite"/>`)}<circle cx="60" cy="66" r="52" fill="none" stroke="url(#${id}r)" stroke-width="2" opacity=".85"/><circle cx="60" cy="66" r="45" fill="none" stroke="url(#${id}r)" stroke-width="1" stroke-dasharray="2 4" opacity=".7"/>${runes}</g>`;
    front = sparkle(14,22,6,"#F472B6",1.6,0) + sparkle(106,20,5,"#22D3EE",2,.4) + sparkle(110,96,6,"#A78BFA",1.8,.9) + sparkle(10,96,5,"#F472B6",2.2,1.3) + sparkle(60,4,4,"#FDF4FF",1.7,.6);
  }
  if (r === "supreme") {
    defs = `<radialGradient id="${id}s"><stop offset="0" stop-color="#4C1D95"/><stop offset=".6" stop-color="#1E1B4B"/><stop offset="1" stop-color="#0B1026"/></radialGradient>
      <linearGradient id="${id}r" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F43F5E">${A(`<animate attributeName="stop-color" values="#F43F5E;#F59E0B;#10B981;#3B82F6;#A855F7;#F43F5E" dur="6s" repeatCount="indefinite"/>`)}</stop><stop offset=".5" stop-color="#10B981">${A(`<animate attributeName="stop-color" values="#10B981;#3B82F6;#A855F7;#F43F5E;#F59E0B;#10B981" dur="6s" repeatCount="indefinite"/>`)}</stop><stop offset="1" stop-color="#3B82F6">${A(`<animate attributeName="stop-color" values="#3B82F6;#A855F7;#F43F5E;#F59E0B;#10B981;#3B82F6" dur="6s" repeatCount="indefinite"/>`)}</stop></linearGradient>`;
    const stars = [[14,20],[30,8],[96,12],[110,34],[104,104],[16,104],[8,60],[112,70],[40,114],[84,116],[24,40],[98,60]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${i%3?1:1.6}" fill="#fff"><animate attributeName="opacity" values=".2;1;.2" dur="${1.5+i%4*.5}s" repeatCount="indefinite"/></circle>`).join("");
    back = `<circle cx="60" cy="64" r="58" fill="url(#${id}s)"/>${stars}<g>${A(`<animateTransform attributeName="transform" type="rotate" from="0 60 64" to="360 60 64" dur="10s" repeatCount="indefinite"/>`)}<circle cx="60" cy="64" r="56" fill="none" stroke="url(#${id}r)" stroke-width="4"/><circle cx="60" cy="8" r="5" fill="#FBBF24" stroke="#B45309"/><circle cx="116" cy="64" r="3.5" fill="#22D3EE"/><circle cx="4" cy="64" r="3.5" fill="#F472B6"/></g>`;
    front = sparkle(16,18,7,"#FDE68A",1.5,0) + sparkle(104,16,6,"#A5F3FC",1.9,.4) + sparkle(110,100,7,"#F9A8D4",1.7,.8) + sparkle(10,100,6,"#C4B5FD",2.1,1.2);
  }
  return {defs, back, front};
}
/* every baby sits in the half of the eggshell it hatched from */
const EGGSHELL = `<path d="M28 98 L34 90 L40 98 L46 89 L53 98 L60 89 L67 98 L74 89 L80 98 L86 90 L92 98 C92 110 80 116 60 116 C40 116 28 110 28 98Z" fill="#FFFBEB" stroke="#D6C08A" stroke-width="2" stroke-linejoin="round"/><circle cx="42" cy="106" r="2.4" fill="#E9D8A6"/><circle cx="70" cy="108" r="3" fill="#E9D8A6"/><circle cx="82" cy="102" r="1.8" fill="#E9D8A6"/><path d="M36 102 Q40 112 52 113" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".8"/>`;
function wrapPet(p, size, inner, sc, still, stage){
  if (stage === 1) inner += EGGSHELL;
  const id = "pg" + (++gid), fx = fxLayers(p.r === "secret" ? "supreme" : p.r, id, still, p);
  const shadow = `<ellipse cx="60" cy="112" rx="30" ry="5" fill="#000" opacity=".1"/>`;
  return `<svg viewBox="0 0 120 120" width="${size}" height="${size}" role="img" aria-label="${esc(p.n)}" style="overflow:visible"><defs>${fx.defs}</defs>${fx.back}${shadow}<g transform="translate(60 110) scale(${sc}) translate(-60 -110)">${inner}</g>${fx.front}</svg>`;
}
const mixHex = (a, b, t) => { const h = x => [1,3,5].map(i=>parseInt(x.slice(i,i+2),16)); if (!/^#[0-9a-f]{6}$/i.test(a)) return a; const A = h(a), B = h(b); return "#" + A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,"0")).join(""); };
/* props and grown features a baby doesn't have yet; a teen hasn't earned the adult-only flourishes */
const BABY_DROP = ["acorn","chart","pricetag","coin","coins2","scroll","sign","tie","hardhat","glasses","goldegg","times","downarrow","uparrow","xcurves","shells","smoke","nosering","crown","sparkle","scar","flametips","biolum","horns","antlers","goldhorns","tusks","horn","mane","wings","spikes","teeth"];
const TEEN_DROP = ["crown","goldegg","scar","flametips","sparkle","nosering"];
CS.petSVG = (pid, opt={}) => {
  const p = CS.PET[pid], size = opt.size || 120, stage = opt.stage || CS.petStage(pid), mood = opt.mood || "happy";
  if (opt.locked) return `<svg viewBox="0 0 120 120" width="${size}" height="${size}" aria-hidden="true"><ellipse cx="60" cy="72" rx="34" ry="32" fill="var(--surface-2)"/><text x="60" y="82" text-anchor="middle" font-size="30" font-weight="800" fill="var(--faint)" font-family="Manrope, sans-serif">?</text></svg>`;
  const sc = stage === 1 ? 0.78 : stage === 2 ? 0.9 : 1;
  if (p.custom) return wrapPet(p, size, CUSTOM[p.custom](p, stage, mood), sc, opt.still, stage);
  /* growth stages change the design, not just the size:
     baby = pastel hatchling with big eyes, a hair tuft and a pacifier, no props or horns yet (and sits in its eggshell);
     teen = props appear, horns/wings/manes come in small, plus sneakers and a scarf;
     adult = full-size horns, wings and props, arms and feet, eyebrows, a chest gem, and a cape for epic+ */
  const X = new Set(p.extra||[]), ink = "#1F2430";
  let c1 = p.c1, c2 = p.c2;
  if (stage === 1) { c1 = mixHex(c1, "#FFFFFF", .28); c2 = mixHex(c2, "#FFFFFF", .25); BABY_DROP.forEach(k => X.delete(k)); if (!X.has("stalkeyes") && !X.has("hand")) X.add("bigeyes"); }
  if (stage === 2) TEEN_DROP.forEach(k => X.delete(k));
  const G = (s, cx = 60, cy = 40, k = .6) => stage === 2 ? `<g transform="translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})">${s}</g>` : s;
  const dark = mixHex(c1, ink, .35);
  let back = "", body = "", front = "", ears = "";
  // tails / back items
  if (X.has("bushytail")) back += `<path d="M86 86 C112 80 112 40 92 34 C102 52 92 66 84 72Z" fill="${c1}" stroke="${ink}" stroke-opacity=".15"/>`;
  if (X.has("foxtail")) back += `<path d="M84 88 C110 86 114 56 100 48 C104 66 94 76 82 78Z" fill="${c1}"/><path d="M104 54 C110 60 108 70 100 74 C104 66 104 60 100 50Z" fill="#fff"/>`;
  if (X.has("curltail")) back += `<path d="M86 84 C104 86 106 66 94 66 C86 66 88 76 94 74" stroke="${c1}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  if (X.has("wings")) back += G(`<path d="M30 64 C6 50 4 30 14 24 C18 40 26 48 38 54Z" fill="${c1}"/><path d="M90 64 C114 50 116 30 106 24 C102 40 94 48 82 54Z" fill="${c1}"/><path d="M14 24 L22 40 M106 24 L98 40" stroke="#FDE68A" stroke-width="3"/>`);
  if (X.has("shell")) back += `<ellipse cx="60" cy="70" rx="40" ry="32" fill="#3E7D3E"/><path d="M30 86 C34 64 50 52 76 50" stroke="#CFE8C4" stroke-width="3.5" fill="none"/><path d="M28 90 L28 52 M28 90 L84 90" stroke="#CFE8C4" stroke-width="2.5" opacity=".7"/>`;
  if (X.has("tentacles")) back += [36,48,60,72,84].map((x,i)=>`<path d="M${x} 92 C${x-6} 104 ${x+6} 108 ${x} 118" stroke="${c1}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"/>`).join("");
  if (X.has("longneck")) back += `<rect x="48" y="26" width="24" height="44" rx="12" fill="${c1}"/>`;
  /* micro set: back items */
  if (X.has("mane")) { const mr = stage === 2 ? 30 : 36, cr = stage === 2 ? 9 : 13; back += Array.from({length:stage===2?10:14},(_,i,)=>{ const a = i/(stage===2?10:14)*Math.PI*2, x = 60+Math.cos(a)*mr, y = 58+Math.sin(a)*mr*.94; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${cr}" fill="#B45309"/>`; }).join("") + (stage === 3 ? `<circle cx="60" cy="60" r="38" fill="#C2410C" opacity=".55"/>` : ""); }
  if (X.has("antlers")) back += G(`<path d="M44 40 L36 18 M38 26 L28 22 M36 18 L32 8 M76 40 L84 18 M82 26 L92 22 M84 18 L88 8" stroke="#7C4A1E" stroke-width="4.5" stroke-linecap="round" fill="none"/>`);
  if (X.has("ringtail")) back += `<path d="M86 90 C112 88 116 56 100 46 C92 42 86 50 92 56" stroke="${c1}" stroke-width="9" fill="none" stroke-linecap="round"/>` + [[104,84],[110,68],[106,52],[96,46]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4.6" fill="#1F2937"/>`).join("");
  // ears
  const E = p.ears;
  if (E === "round") ears = `<circle cx="38" cy="38" r="11" fill="${c1}"/><circle cx="82" cy="38" r="11" fill="${c1}"/><circle cx="38" cy="38" r="5" fill="${c2}"/><circle cx="82" cy="38" r="5" fill="${c2}"/>`;
  if (E === "small") ears = `<circle cx="40" cy="42" r="7" fill="${c1}"/><circle cx="80" cy="42" r="7" fill="${c1}"/>`;
  if (E === "black") ears = `<circle cx="38" cy="40" r="10" fill="#222"/><circle cx="82" cy="40" r="10" fill="#222"/>`;
  if (E === "fluffy") ears = `<circle cx="32" cy="44" r="15" fill="${c1}"/><circle cx="88" cy="44" r="15" fill="${c1}"/><circle cx="32" cy="44" r="8" fill="${c2}"/><circle cx="88" cy="44" r="8" fill="${c2}"/>`;
  if (E === "pointy") ears = `<path d="M34 50 L38 22 L54 40Z" fill="${c1}"/><path d="M86 50 L82 22 L66 40Z" fill="${c1}"/><path d="M39 42 L40 30 L48 40Z" fill="${c2}"/><path d="M81 42 L80 30 L72 40Z" fill="${c2}"/>`;
  if (E === "long") ears = `<ellipse cx="46" cy="22" rx="7" ry="20" fill="${c1}" stroke="${ink}" stroke-opacity=".12"/><ellipse cx="74" cy="22" rx="7" ry="20" fill="${c1}" stroke="${ink}" stroke-opacity=".12"/><ellipse cx="46" cy="24" rx="3" ry="13" fill="${c2}"/><ellipse cx="74" cy="24" rx="3" ry="13" fill="${c2}"/>`;
  if (E === "tufts") ears = `<path d="M34 46 L30 24 L50 40Z" fill="${c1}"/><path d="M86 46 L90 24 L70 40Z" fill="${c1}"/>`;
  if (E === "elephant") ears = `<ellipse cx="26" cy="64" rx="18" ry="22" fill="${c1}"/><ellipse cx="94" cy="64" rx="18" ry="22" fill="${c1}"/><ellipse cx="26" cy="64" rx="10" ry="14" fill="#F2C6CF"/><ellipse cx="94" cy="64" rx="10" ry="14" fill="#F2C6CF"/>`;
  if (E === "crest") ears = `<path d="M60 22 C54 10 62 4 66 12 C70 6 78 10 72 22" fill="#EF4444"/>`;
  if (stage === 1 && ears) ears = `<g transform="translate(60 52) scale(.78) translate(-60 -52)">${ears}</g>`;
  // body
  const trans = X.has("translucent") ? ` fill-opacity=".82"` : "";
  if (X.has("hand")) {
    body = `<path d="M34 104 C26 84 28 64 34 56 L34 34 C34 28 42 28 42 34 L42 50 L44 24 C44 18 52 18 52 24 L52 48 L56 20 C56 14 64 14 64 20 L64 48 L68 26 C68 20 76 20 76 26 L76 58 L84 46 C88 40 96 44 92 52 L82 74 C78 88 74 98 70 104Z" fill="${c1}"${trans} stroke="#F59E0B" stroke-width="2"/>`;
  } else {
    const tall = X.has("longneck") ? 0 : 0;
    const bx = (X.has("puffer")?40:34) + (stage===3?2:stage===1?-1:0), by = (X.has("longneck")?28:34) + (stage===3?2:stage===1?-3:1);
    body = `<ellipse cx="60" cy="${(X.has("longneck")?78:72+tall) + (stage===1?3:0)}" rx="${bx}" ry="${by}" fill="${c1}"${trans} stroke="${ink}" stroke-opacity=".12" stroke-width="2"/>
      <ellipse cx="60" cy="${X.has("longneck")?86:82}" rx="22" ry="${X.has("longneck")?18:20}" fill="${c2}"${trans}/>`;
  }
  if (X.has("longneck")) body = `<circle cx="60" cy="30" r="16" fill="${c1}"/>` + body;
  if (stage === 3 && !["hand","claws","flippers","wings","longneck"].some(k=>X.has(k))) body += `<ellipse cx="27" cy="86" rx="6.5" ry="11" fill="${c1}" stroke="${ink}" stroke-opacity=".15" transform="rotate(25 27 86)"/><ellipse cx="93" cy="86" rx="6.5" ry="11" fill="${c1}" stroke="${ink}" stroke-opacity=".15" transform="rotate(-25 93 86)"/>`;
  if (stage === 3 && ["epic","legendary"].includes(p.r) && !X.has("hand")) back = `<path d="M34 62 C18 88 20 108 32 114 L88 114 C100 108 102 88 86 62Z" fill="${CS.RARITY[p.r].col}" opacity=".9"/><path d="M40 66 C30 88 32 104 40 110" stroke="#fff" stroke-width="2" fill="none" opacity=".35"/>` + back;
  if (X.has("patches")) front += `<ellipse cx="47" cy="62" rx="8" ry="10" fill="#222" transform="rotate(-20 47 62)"/><ellipse cx="73" cy="62" rx="8" ry="10" fill="#222" transform="rotate(20 73 62)"/>`;
  if (X.has("mask")) front += `<path d="M34 60 C44 52 76 52 86 60 C80 70 68 66 60 64 C52 66 40 70 34 60Z" fill="#2B2F38"/>`;
  if (X.has("mask2")) front += `<ellipse cx="48" cy="62" rx="9" ry="7" fill="#6B5A44" opacity=".6"/><ellipse cx="72" cy="62" rx="9" ry="7" fill="#6B5A44" opacity=".6"/>`;
  if (X.has("wave")) front += `<path d="M30 74 C38 64 46 84 54 74 C62 64 70 84 78 74 C84 68 88 72 90 74" stroke="#F472B6" stroke-width="4" fill="none"/><path d="M30 84 C38 74 46 94 54 84 C62 74 70 94 78 84" stroke="#FBBF24" stroke-width="3" fill="none" opacity=".8"/>`;
  if (X.has("spikes")) back += (s => s)(Array.from({length:12},(_,i)=>{ const a = i/12*Math.PI*2, x = 60+Math.cos(a)*36, y = 72+Math.sin(a)*36, x2 = 60+Math.cos(a)*(stage===2?42:48), y2 = 72+Math.sin(a)*(stage===2?42:48); return `<path d="M${x.toFixed(1)} ${y.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${c1}" stroke-width="5" stroke-linecap="round"/>`; }).join(""));
  if (X.has("fins")) front += `<path d="M24 74 L12 66 L14 82Z" fill="#F59E0B"/><path d="M96 74 L108 66 L106 82Z" fill="#F59E0B"/>`;
  // face
  const eyeY = X.has("longneck") ? 28 : 60, mx = 60;
  let eyes;
  if (mood === "sleepy" || X.has("sleepy")) eyes = `<path d="M44 ${eyeY} q6 5 12 0 M64 ${eyeY} q6 5 12 0" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  else if (X.has("bigeyes") && X.has("longneck")) eyes = `<circle cx="53" cy="${eyeY}" r="5.5" fill="${ink}"/><circle cx="67" cy="${eyeY}" r="5.5" fill="${ink}"/><circle cx="54.6" cy="${eyeY-2}" r="2" fill="#fff"/><circle cx="68.6" cy="${eyeY-2}" r="2" fill="#fff"/>`;
  else if (X.has("bigeyes")) eyes = `<circle cx="47" cy="${eyeY}" r="11" fill="#fff"/><circle cx="73" cy="${eyeY}" r="11" fill="#fff"/><circle cx="48" cy="${eyeY+1}" r="5.5" fill="${ink}"/><circle cx="74" cy="${eyeY+1}" r="5.5" fill="${ink}"/><circle cx="50" cy="${eyeY-1}" r="2" fill="#fff"/><circle cx="76" cy="${eyeY-1}" r="2" fill="#fff"/>`;
  else if (X.has("stalkeyes")) eyes = `<path d="M48 54 L46 36 M72 54 L74 36" stroke="${c1}" stroke-width="4"/><circle cx="46" cy="34" r="7" fill="#fff"/><circle cx="74" cy="34" r="7" fill="#fff"/><circle cx="46" cy="35" r="3.5" fill="${ink}"/><circle cx="74" cy="35" r="3.5" fill="${ink}"/>`;
  else { const ey = X.has("longneck") ? eyeY : eyeY; eyes = `<circle cx="${X.has("longneck")?53:48}" cy="${ey}" r="${X.has("longneck")?3.5:5}" fill="${ink}"/><circle cx="${X.has("longneck")?67:72}" cy="${ey}" r="${X.has("longneck")?3.5:5}" fill="${ink}"/><circle cx="${X.has("longneck")?54:50}" cy="${ey-2}" r="1.6" fill="#fff"/><circle cx="${X.has("longneck")?68:74}" cy="${ey-2}" r="1.6" fill="#fff"/>`; }
  if (X.has("glasses")) eyes += `<circle cx="47" cy="${eyeY}" r="13" fill="none" stroke="${ink}" stroke-width="2.5"/><circle cx="73" cy="${eyeY}" r="13" fill="none" stroke="${ink}" stroke-width="2.5"/><path d="M60 ${eyeY} h0" stroke="${ink}" stroke-width="3"/>`;
  const my = X.has("longneck") ? 38 : 72;
  let mouth = mood === "sad" ? `<path d="M52 ${my+4} q8 -7 16 0" stroke="${ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
    : mood === "oops" ? `<ellipse cx="60" cy="${my+2}" rx="4" ry="5" fill="${ink}"/>`
    : `<path d="M52 ${my} q8 8 16 0" stroke="${ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  if (X.has("beak")) mouth = `<path d="M52 ${my-4} L68 ${my-4} L60 ${my+6}Z" fill="#F59E0B"/>`;
  if (X.has("snout")) mouth = `<ellipse cx="60" cy="${my}" rx="10" ry="7" fill="#F28AAA"/><circle cx="56" cy="${my}" r="2" fill="${ink}"/><circle cx="64" cy="${my}" r="2" fill="${ink}"/>`;
  if (X.has("bignose")) mouth = `<ellipse cx="60" cy="${my-2}" rx="7" ry="9" fill="#3B3F48"/>` + mouth.replace(`${my}`,`${my+8}`);
  if (X.has("trunk")) mouth = `<path d="M60 64 C60 82 54 92 44 94" stroke="#6E7A8A" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M60 64 C60 82 54 92 44 94" stroke="${c1}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M57 74 h6 M56 81 h6" stroke="#6E7A8A" stroke-width="1.5"/>`;
  if (X.has("teeth")) mouth += `<rect x="55" y="${my+2}" width="10" height="7" rx="1" fill="#fff" stroke="${ink}" stroke-opacity=".3"/>`;
  if (X.has("whiskers")) mouth += `<path d="M38 70 H28 M38 74 L28 77 M82 70 H92 M82 74 L92 77" stroke="${ink}" stroke-opacity=".5" stroke-width="1.5"/>`;
  const blush = `<ellipse cx="40" cy="${eyeY+10}" rx="5" ry="3" fill="#F87171" opacity=".35"/><ellipse cx="80" cy="${eyeY+10}" rx="5" ry="3" fill="#F87171" opacity=".35"/>`;
  // front items
  if (X.has("acorn")) front += `<ellipse cx="88" cy="92" rx="7" ry="8" fill="#9A6A3A"/><path d="M80 87 Q88 80 96 87Z" fill="#6B4423"/>`;
  if (X.has("claws")) front += `<path d="M18 70 C8 60 14 48 24 52 L20 60 L28 58 C30 66 26 72 18 70Z" fill="${c1}"/><path d="M102 70 C112 60 106 48 96 52 L100 60 L92 58 C90 66 94 72 102 70Z" fill="${c1}"/>`;
  if (X.has("claws2")) front += `<path d="M30 96 l-4 6 M36 98 l-2 7 M84 98 l2 7 M90 96 l4 6" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`;
  if (X.has("chart")) front += `<rect x="78" y="78" width="26" height="22" rx="3" fill="#fff" stroke="${ink}" stroke-opacity=".3"/><rect x="82" y="90" width="4" height="7" fill="#3B82F6"/><rect x="88" y="86" width="4" height="11" fill="#3B82F6"/><rect x="94" y="81" width="4" height="16" fill="#10B981"/>`;
  if (X.has("pricetag")) front += `<path d="M52 90 L68 90 L72 96 L68 102 L52 102Z" fill="#FDE68A" stroke="${ink}" stroke-opacity=".3"/><text x="61" y="99.5" text-anchor="middle" font-size="8" font-weight="800" fill="${ink}" font-family="Manrope, sans-serif">$</text>`;
  if (X.has("times")) front += `<path d="M53 76 L67 90 M67 76 L53 90" stroke="#EC4899" stroke-width="4" stroke-linecap="round"/>`;
  if (X.has("downarrow")) front += `<path d="M48 78 L72 96 M72 96 L72 86 M72 96 L62 96" stroke="#3B82F6" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  if (X.has("uparrow")) front += `<path d="M48 96 L72 78 M72 78 L62 78 M72 78 L72 88" stroke="#10B981" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  if (X.has("coin")) front += `<circle cx="90" cy="92" r="9" fill="#FBBF24" stroke="#B45309" stroke-width="2"/><text x="90" y="96" text-anchor="middle" font-size="10" font-weight="800" fill="#B45309" font-family="Manrope, sans-serif">$</text>`;
  if (X.has("coins2")) front += `<circle cx="84" cy="94" r="8" fill="#FBBF24" stroke="#B45309" stroke-width="2"/><circle cx="96" cy="88" r="8" fill="#93C5FD" stroke="#1D4ED8" stroke-width="2"/><text x="96" y="91.5" text-anchor="middle" font-size="9" font-weight="800" fill="#1D4ED8" font-family="Manrope, sans-serif">€</text>`;
  if (X.has("slot")) front += `<rect x="52" y="${X.has("longneck")?14:40}" width="16" height="4" rx="2" fill="#B05578"/>`;
  if (X.has("scroll")) front += `<rect x="78" y="80" width="24" height="18" rx="2" fill="#FFF7E6" stroke="#B45309" stroke-width="1.5"/><path d="M82 86 H98 M82 91 H94" stroke="#B45309" stroke-width="1.5"/>`;
  if (X.has("flippers")) front += `<ellipse cx="28" cy="78" rx="6" ry="14" fill="${c1}" transform="rotate(20 28 78)"/><ellipse cx="92" cy="78" rx="6" ry="14" fill="${c1}" transform="rotate(-20 92 78)"/>`;
  if (X.has("sprout")) front += `<path d="M60 40 C60 32 60 28 60 24" stroke="#16A34A" stroke-width="3"/><ellipse cx="54" cy="26" rx="7" ry="4" fill="#22C55E" transform="rotate(-25 54 26)"/><ellipse cx="66" cy="24" rx="7" ry="4" fill="#22C55E" transform="rotate(25 66 24)"/>`;
  if (X.has("horns")) front += G(`<path d="M38 44 C26 40 22 28 28 22 C30 32 36 36 44 38Z" fill="#E5E7EB"/><path d="M82 44 C94 40 98 28 92 22 C90 32 84 36 76 38Z" fill="#E5E7EB"/>`);
  if (X.has("nosering")) front += `<circle cx="60" cy="80" r="5" fill="none" stroke="#FBBF24" stroke-width="2.5"/>`;
  if (X.has("fluff")) front += `<circle cx="60" cy="16" r="8" fill="${c2}"/><circle cx="52" cy="18" r="6" fill="${c2}"/><circle cx="68" cy="18" r="6" fill="${c2}"/>`;
  if (X.has("xcurves")) front += `<path d="M44 76 L76 96 M44 96 L76 76" stroke="#7C2D12" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="86" r="3.5" fill="#7C2D12"/>`;
  if (X.has("sparkle")) front += `<path d="M18 20 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z M100 14 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5z M104 100 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5z" fill="#FBBF24"/>`;
  /* micro set: front items */
  if (X.has("shells")) front += `<path d="M22 84 Q30 72 38 84Z" fill="#F9A8D4" stroke="#BE185D" stroke-width="1.2"/><path d="M82 84 Q90 72 98 84Z" fill="#FDE68A" stroke="#B45309" stroke-width="1.2"/><path d="M26 84 L30 76 M30 84 L30 74 M34 84 L30 76 M86 84 L90 76 M90 84 L90 74 M94 84 L90 76" stroke="#fff" stroke-width="1" opacity=".8"/>`;
  if (X.has("hardhat")) front += `<path d="M34 46 C34 24 86 24 86 46Z" fill="#FACC15" stroke="#CA8A04" stroke-width="1.5"/><rect x="28" y="43" width="64" height="6" rx="3" fill="#EAB308"/><rect x="56" y="26" width="8" height="18" rx="3" fill="#FDE047"/>`;
  if (X.has("tie")) front += `<path d="M55 86 L65 86 L62 91 L66 106 L60 112 L54 106 L58 91Z" fill="#DC2626" stroke="#7F1D1D" stroke-width="1"/>`;
  if (X.has("horn")) front += G(`<path d="M55 38 L60 6 L65 38Z" fill="#FDE68A" stroke="#F59E0B" stroke-width="1.5"/><path d="M57 30 L63 27 M58 22 L62 20 M59 14 L61 13" stroke="#F59E0B" stroke-width="1.5"/>`);
  if (X.has("smoke")) front += `<circle cx="92" cy="22" r="8" fill="#9CA3AF" opacity=".7"/><circle cx="102" cy="14" r="6" fill="#9CA3AF" opacity=".55"/><circle cx="84" cy="14" r="5" fill="#9CA3AF" opacity=".5"/><circle cx="108" cy="4" r="4" fill="#9CA3AF" opacity=".4"/>`;
  if (X.has("tusks")) front += ((s) => G(s, 60, 76))(`<path d="M50 74 C48 90 54 98 60 100 C56 94 54 86 56 76Z M70 74 C72 90 66 98 60 100 C64 94 66 86 64 76Z" fill="#FFFBEB" stroke="#D6D3D1" stroke-width="1.2"/>`);
  if (X.has("sign")) front += `<path d="M98 112 L98 70" stroke="#92400E" stroke-width="3"/><rect x="82" y="56" width="34" height="18" rx="2" fill="#fff" stroke="#DC2626" stroke-width="2"/><text x="99" y="68" text-anchor="middle" font-size="7.5" font-weight="800" fill="#DC2626" font-family="Manrope, sans-serif">${p.sign||"FAIR PAY"}</text>`;
  if (X.has("crown")) front += CROWN(X.has("mane") ? 28 : 30);
  if (X.has("goldegg")) front += `<ellipse cx="90" cy="96" rx="10" ry="12" fill="#FBBF24" stroke="#B45309" stroke-width="2"/><ellipse cx="86" cy="91" rx="3" ry="5" fill="#FEF3C7" opacity=".8"/><text x="90" y="101" text-anchor="middle" font-size="9" font-weight="800" fill="#92400E" font-family="Manrope, sans-serif">CS</text>`;
  // adult flair
  let flair = "";
  if (stage === 3 && ["rare","epic","legendary"].includes(p.r) && !X.has("hand")) flair = `<path d="M46 ${X.has("longneck")?10:28} L50 ${X.has("longneck")?2:20} L55 ${X.has("longneck")?8:26} L60 ${X.has("longneck")?0:18} L65 ${X.has("longneck")?8:26} L70 ${X.has("longneck")?2:20} L74 ${X.has("longneck")?10:28}Z" fill="#FBBF24" stroke="#B45309" stroke-width="1.5"/>`;
  else if (stage === 3) flair = `<circle cx="96" cy="26" r="3" fill="${CS.RARITY[p.r].col}"/><circle cx="24" cy="30" r="2.5" fill="${CS.RARITY[p.r].col}"/>`;
  /* stage extras */
  const headTop = X.has("longneck") ? 14 : 40;
  if (stage === 1) {
    front += `<path d="M58 ${headTop} C54 ${headTop-10} 62 ${headTop-14} 66 ${headTop-8} C62 ${headTop-10} 60 ${headTop-6} 62 ${headTop-2}" stroke="${dark}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    if (mood === "happy" && !["beak","trunk"].some(k=>X.has(k)) && !X.has("hand")) mouth = `<ellipse cx="60" cy="${my+3}" rx="8" ry="5" fill="#F9A8D4" stroke="#DB2777" stroke-width="1.2"/><circle cx="60" cy="${my+3}" r="2.6" fill="#FDF2F8"/><circle cx="60" cy="${my+10}" r="3.5" fill="none" stroke="#DB2777" stroke-width="1.6"/>` + (X.has("whiskers") ? `<path d="M38 70 H28 M38 74 L28 77 M82 70 H92 M82 74 L92 77" stroke="${ink}" stroke-opacity=".5" stroke-width="1.5"/>` : "");
  }
  if (stage === 2 && !X.has("hand")) {
    front += `<ellipse cx="45" cy="107" rx="10" ry="5" fill="#fff" stroke="${ink}" stroke-opacity=".3" stroke-width="1.2"/><ellipse cx="75" cy="107" rx="10" ry="5" fill="#fff" stroke="${ink}" stroke-opacity=".3" stroke-width="1.2"/><path d="M38 106 h12 M68 106 h12" stroke="${CS.RARITY[p.r].col}" stroke-width="2.2"/>`;
    if (!["tie","sign","longneck","mane","times","xcurves","downarrow","uparrow"].some(k=>X.has(k))) front += `<path d="M33 86 Q60 98 87 86 L87 93 Q60 105 33 93Z" fill="${dark}"/><path d="M33 89.5 Q60 101.5 87 89.5" stroke="#fff" stroke-width="1.4" stroke-dasharray="3 3" fill="none" opacity=".7"/><path d="M76 94 L82 110 L89 107 L83 92Z" fill="${dark}"/>`;
  }
  if (stage === 3 && !X.has("hand")) {
    front = `<ellipse cx="45" cy="107" rx="10" ry="5.5" fill="${dark}"/><ellipse cx="75" cy="107" rx="10" ry="5.5" fill="${dark}"/><path d="M38 109 l2 -3 M43 110 l1 -4 M77 110 l-1 -4 M82 109 l-2 -3" stroke="#fff" stroke-width="1.4" opacity=".7"/>` + front;
    if (!["tie","sign","times","xcurves","downarrow","uparrow","coin","pricetag"].some(k=>X.has(k)) && !X.has("longneck")) front += `<path d="M60 88 L65 94 L60 100 L55 94Z" fill="${CS.RARITY[p.r].col}" stroke="#fff" stroke-width="1.5"/>`;
    if (mood !== "sleepy" && !X.has("glasses") && !X.has("sleepy")) { const L = X.has("longneck"), ey = eyeY - (L ? 8 : 12), w = L ? 5 : 7, xs = L ? [53,67] : [48,72]; eyes += xs.map(x=>`<path d="M${x-w} ${ey+2} Q${x} ${ey-3} ${x+w} ${ey+2}" stroke="${ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`).join(""); }
  }
  const tear = mood === "sad" ? `<path d="M76 ${eyeY+6} q3 6 0 9 q-3 -3 0 -9z" fill="#60A5FA"/>` : "";
  // epic+ upgrades
  if (X.has("goldhorns")) front += G(`<path d="M38 44 C26 40 22 28 28 22 C30 32 36 36 44 38Z" fill="#FBBF24" stroke="#B45309" stroke-width="1.2"/><path d="M82 44 C94 40 98 28 92 22 C90 32 84 36 76 38Z" fill="#FBBF24" stroke="#B45309" stroke-width="1.2"/><circle cx="48" cy="60" r="7" fill="#FDE68A" opacity=".25"/><circle cx="72" cy="60" r="7" fill="#FDE68A" opacity=".25"/>`);
  if (X.has("biolum")) front += [[44,80],[60,88],[76,80],[52,96],[68,96],[60,50]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="2.6" fill="#F0ABFC"><animate attributeName="opacity" values=".3;1;.3" dur="${1.4+i*.3}s" repeatCount="indefinite"/></circle>`).join("");
  if (X.has("scar")) front += `<path d="M74 50 L82 62 M78 48 L86 60" stroke="#3B1F0F" stroke-width="2" stroke-linecap="round" opacity=".7"/><path d="M40 52 L46 50" stroke="#FCD34D" stroke-width="2"/>`;
  if (X.has("flametips")) back += `<path d="M14 24 C6 14 10 4 18 2 C16 10 22 12 20 20Z" fill="#FDE047"/><path d="M106 24 C114 14 110 4 102 2 C104 10 98 12 100 20Z" fill="#FDE047"/><path d="M60 104 C54 116 66 118 60 108" fill="#F97316"/>`;
  const shine = ["epic","legendary"].includes(p.r) && !X.has("hand") ? `<ellipse cx="46" cy="${X.has("longneck")?24:52}" rx="10" ry="6" fill="#fff" opacity=".35" transform="rotate(-25 46 52)"/>` : "";
  const face = X.has("hand") ? `<circle cx="50" cy="70" r="4" fill="${ink}"/><circle cx="66" cy="70" r="4" fill="${ink}"/><path d="M52 80 q6 6 12 0" stroke="${ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/>` : eyes + blush + mouth + tear;
  return wrapPet(p, size, back+ears+body+front+face+flair+shine, sc, opt.still, stage);
};

/* ---------- mythical designs ---------- */
const EYE = (x, y, r=4.5, glow) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${glow||"#1F2430"}"/><circle cx="${x+1.4}" cy="${y-1.4}" r="${r*.35}" fill="#fff"/>`;
const CROWN = (y, col="#FBBF24") => `<path d="M46 ${y} L49 ${y-9} L55 ${y-3} L60 ${y-12} L65 ${y-3} L71 ${y-9} L74 ${y}Z" fill="${col}" stroke="#B45309" stroke-width="1.2"/><circle cx="60" cy="${y-12}" r="2" fill="#F43F5E"/>`;
const SCL = (s, k, cx=60, cy=64) => `<g transform="translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})">${s}</g>`;
const CUSTOM = {
  /* Rahul: an original capybara. Baby sits in its shell; a yuzu appears on its head as a teen; a golden crown and cape as an adult */
  rahul: (p, stage, mood) => { const sleepy = mood === "sleepy", sad = mood === "sad"; return `
    ${stage===3?`<path d="M34 62 C22 80 24 104 34 108 L86 108 C96 104 98 80 86 62Z" fill="#7F1D1D" stroke="#450A0A" stroke-width="1.5" opacity=".95"/>`:""}
    <ellipse cx="60" cy="88" rx="34" ry="22" fill="${p.c1}" stroke="#6B4423" stroke-width="2"/>
    <ellipse cx="60" cy="94" rx="20" ry="12" fill="${p.c2}"/>
    <rect x="36" y="100" width="10" height="9" rx="4" fill="#8A5A30" stroke="#6B4423" stroke-width="1.5"/><rect x="74" y="100" width="10" height="9" rx="4" fill="#8A5A30" stroke="#6B4423" stroke-width="1.5"/>
    <ellipse cx="60" cy="58" rx="27" ry="23" fill="${p.c1}" stroke="#6B4423" stroke-width="2"/>
    <ellipse cx="37" cy="43" rx="5" ry="5.5" fill="${p.c1}" stroke="#6B4423" stroke-width="2"/><ellipse cx="83" cy="43" rx="5" ry="5.5" fill="${p.c1}" stroke="#6B4423" stroke-width="2"/>
    
    <rect x="39" y="58" width="42" height="21" rx="10" fill="${p.c2}"/>
    <ellipse cx="60" cy="62" rx="9" ry="4" fill="#4A2C17"/>
    <path d="M60 67 L60 72 M54 74 Q60 78 66 74" stroke="#4A2C17" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    ${sleepy?`<path d="M42 54 q5 4 10 0 M68 54 q5 4 10 0" stroke="#2B1A0E" stroke-width="2.4" fill="none" stroke-linecap="round"/>`:`${EYE(48,53,4.2)}${EYE(72,53,4.2)}`}
    ${sad?`<path d="M42 46 l10 3 M78 46 l-10 3" stroke="#4A2C17" stroke-width="2" stroke-linecap="round"/>`:""}
    <ellipse cx="40" cy="62" rx="4" ry="2.6" fill="#F4A28C" opacity=".6"/><ellipse cx="80" cy="62" rx="4" ry="2.6" fill="#F4A28C" opacity=".6"/>
    ${stage===2?`<g><ellipse cx="60" cy="31" rx="9" ry="7.5" fill="#FDE047" stroke="#CA8A04" stroke-width="1.5"/><path d="M60 24 q-2 -6 4 -8 q1 5 -4 8z" fill="#4ADE80" stroke="#15803D" stroke-width="1"/><path d="M55 29 q3 -2 5 0" stroke="#FFF7AE" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`:""}
    ${stage===3?CROWN(37):""}`; },
  bio: (p, stage, mood) => window.CS_BIOART[p.body](p, stage, mood),
  hydra: (p, stage, mood) => {
    const head = (x, y, r, i) => `<path d="M${x-r*.6} ${y-r*.8} L${x-r*.9} ${y-r*1.7} L${x-r*.15} ${y-r*.95}Z M${x+r*.6} ${y-r*.8} L${x+r*.9} ${y-r*1.7} L${x+r*.15} ${y-r*.95}Z" fill="#FBBF24"/>
      <ellipse cx="${x}" cy="${y}" rx="${r*1.15}" ry="${r}" fill="${p.c1}" stroke="#7F1D1D" stroke-width="1.5"/>
      <ellipse cx="${x+r*.55}" cy="${y+r*.35}" rx="${r*.55}" ry="${r*.4}" fill="#F87171"/><circle cx="${x+r*.75}" cy="${y+r*.3}" r="${r*.09}" fill="#7F1D1D"/>
      ${EYE(x-r*.2, y-r*.25, r*.28, "#FDE047")}<circle cx="${x-r*.2}" cy="${y-r*.25}" r="${r*.12}" fill="#111"/>
      <text x="${x-r*.25}" y="${y+r*.75}" text-anchor="middle" font-size="${r*.55}" font-weight="800" fill="#FDE68A" font-family="Manrope, sans-serif">${(p.marks||["%","%%","%%%"])[i]}</text>`;
    /* one head as a baby, two as a teen, three as an adult */
    return `${stage>=3?`<path d="M44 92 C30 70 22 60 30 46" stroke="${p.c1}" stroke-width="11" fill="none" stroke-linecap="round"/>`:""}
      <path d="M60 86 C60 66 56 52 60 34" stroke="${p.c1}" stroke-width="13" fill="none" stroke-linecap="round"/>
      ${stage>=2?`<path d="M76 90 C94 74 98 62 92 44" stroke="${p.c1}" stroke-width="15" fill="none" stroke-linecap="round"/>`:""}
      ${[[38,72],[48,64],[70,62],[82,70],[96,76]].map(([x,y])=>`<path d="M${x} ${y} l4 -8 l4 8z" fill="#FBBF24"/>`).join("")}
      <ellipse cx="60" cy="94" rx="34" ry="18" fill="${p.c1}" stroke="#7F1D1D" stroke-width="2"/><ellipse cx="60" cy="98" rx="20" ry="10" fill="${p.c2}"/>
      <path d="M86 98 C104 104 110 92 104 84" stroke="${p.c1}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M104 84 l-6 -2 l4 -5z" fill="#FBBF24"/>
      ${stage>=3?head(30,44,8,0):""}${head(60,30,10,1)}${stage>=2?head(92,40,12.5,2):""}
      ${mood!=="sad"&&stage>=2?`<path d="M106 40 C114 36 118 42 114 46 C118 48 112 54 108 48" fill="#F97316" opacity=".9"/>`:""}
      ${stage===3?CROWN(18):""}`;
  },
  /* baby is a fluffy grey cygnet; the starry wing comes in as a teen; the plume and crown as an adult */
  swan: (p, stage, mood) => { const c1 = stage === 1 ? "#94A3B8" : p.c1; return `
      <path d="M30 78 C34 60 58 56 80 64 C100 70 106 84 98 96 C88 108 46 108 34 98 C28 92 28 84 30 78Z" fill="${c1}" stroke="#4C1D95" stroke-width="2"/>
      ${stage===1?[[50,74],[66,70],[80,78],[44,90],[62,88],[84,92]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="#CBD5E1" opacity=".8"/>`).join(""):""}
      ${stage>=2?SCL(`<path d="M58 70 C70 52 98 54 108 70 C96 66 86 70 80 76 C92 74 100 80 104 88 C90 82 78 84 70 92Z" fill="#2E2650" stroke="#6D28D9" stroke-width="1.5"/>
      ${[[86,66],[96,72],[90,80],[78,74],[100,84]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${i%2?1.2:1.8}" fill="#E9D5FF"><animate attributeName="opacity" values=".3;1;.3" dur="${1.6+i*.4}s" repeatCount="indefinite"/></circle>`).join("")}`, stage===2?.75:1, 84, 76):""}
      <path d="M40 80 C26 66 26 44 40 36 C50 30 56 40 50 48" stroke="${c1}" stroke-width="10" fill="none" stroke-linecap="round"/>
      <ellipse cx="46" cy="34" rx="10" ry="8" fill="${c1}" stroke="#4C1D95" stroke-width="1.5"/>
      <path d="M36 34 L24 38 L36 40Z" fill="#F43F5E"/><path d="M36 34 L30 35" stroke="#111" stroke-width="1"/>
      ${mood==="sleepy"?`<path d="M44 31 q3 3 6 0" stroke="#67E8F9" stroke-width="2" fill="none"/>`:`<circle cx="47" cy="31" r="3" fill="#67E8F9"/><circle cx="47" cy="31" r="5.5" fill="#67E8F9" opacity=".25"/>`}
      ${stage===3?`<path d="M40 22 L44 14 L48 22 M48 22 L52 15 L54 24" stroke="#A78BFA" stroke-width="2" fill="none" stroke-linecap="round"/>`:""}
      <ellipse cx="66" cy="108" rx="34" ry="3" fill="#6D28D9" opacity=".25"/>
      ${stage===3?`<path d="M36 18 L40 8 L46 14 L50 4 L54 14 L60 8 L62 18Z" fill="#C4B5FD" stroke="#6D28D9" stroke-width="1"/>`:""}`; },
  /* hoard and wings grow with the dragon: no wings as a baby, small wings as a teen, full wings and fire as an adult */
  dragon: (p, stage, mood) => `
      ${[[30,106],[46,108],[62,109],[78,108],[94,106],[38,100],[56,102],[74,102],[88,100],[48,95],[66,96],[80,94]].slice(0, stage===1?3:stage===2?7:12).map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="8" ry="3.5" fill="#FBBF24" stroke="#B45309" stroke-width="1"/>`).join("")}
      ${stage>=2?SCL(`<path d="M30 60 C10 40 6 28 14 20 C18 34 26 36 30 32 C28 42 34 48 40 50Z" fill="#7C3AED" stroke="#4C1D95" stroke-width="1.5"/>
      <path d="M90 60 C110 40 114 28 106 20 C102 34 94 36 90 32 C92 42 86 48 80 50Z" fill="#7C3AED" stroke="#4C1D95" stroke-width="1.5"/>`, stage===2?.6:1, 60, 56):""}
      <path d="M86 92 C104 96 112 84 108 70 C106 80 98 84 90 82" fill="${p.c1}"/><path d="M108 70 l-4 -8 l8 2z" fill="#FBBF24"/>
      <ellipse cx="60" cy="74" rx="30" ry="26" fill="${p.c1}" stroke="#064E3B" stroke-width="2"/>
      <ellipse cx="60" cy="82" rx="18" ry="16" fill="${p.c2}"/>
      <path d="M48 90 C54 90 60 86 64 80 C68 74 70 66 72 62" stroke="#047857" stroke-width="2.5" fill="none"/><text x="52" y="78" font-size="7" font-weight="800" fill="#065F46" font-family="Manrope, sans-serif">(1+r)ⁿ</text>
      <path d="M44 48 L38 30 L50 42Z M76 48 L82 30 L70 42Z" fill="#FBBF24" stroke="#B45309" stroke-width="1"/>
      <ellipse cx="60" cy="50" rx="22" ry="18" fill="${p.c1}" stroke="#064E3B" stroke-width="2"/>
      <ellipse cx="60" cy="58" rx="11" ry="7" fill="${p.c2}"/><circle cx="56" cy="57" r="1.5" fill="#064E3B"/><circle cx="64" cy="57" r="1.5" fill="#064E3B"/>
      ${mood==="sleepy"?`<path d="M48 46 q4 4 8 0 M64 46 q4 4 8 0" stroke="#111" stroke-width="2.5" fill="none"/>`:`<ellipse cx="51" cy="46" rx="4" ry="5" fill="#FDE047"/><ellipse cx="51" cy="46" rx="1.5" ry="4" fill="#111"/><ellipse cx="69" cy="46" rx="4" ry="5" fill="#FDE047"/><ellipse cx="69" cy="46" rx="1.5" ry="4" fill="#111"/>`}
      ${stage>=2?`<circle cx="88" cy="84" r="8" fill="#FBBF24" stroke="#B45309" stroke-width="2"/><text x="88" y="87.5" text-anchor="middle" font-size="9" font-weight="800" fill="#B45309" font-family="Manrope, sans-serif">%</text>`:""}
      ${stage===3&&mood!=="sleepy"?`<path d="M74 60 C86 58 96 62 104 56 C100 64 108 66 112 62 C108 72 92 72 76 64Z" fill="#F97316" opacity=".85"/><path d="M76 62 C88 62 96 64 102 60" stroke="#FDE047" stroke-width="2" fill="none"/>`:""}
      ${stage===3?CROWN(34):""}`,
  /* a lone baby sun, then a robed teen, then the full equilibrium with crossing curves */
  celestial: (p, stage, mood) => `
      <defs><radialGradient id="celo"><stop offset="0" stop-color="#FFFBEB"/><stop offset=".6" stop-color="#FDE68A"/><stop offset="1" stop-color="#F59E0B"/></radialGradient>
        <linearGradient id="celr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6D28D9"/><stop offset="1" stop-color="#0EA5E9"/></linearGradient></defs>
      ${stage===3?`<path d="M8 26 C30 40 46 56 60 70 C74 84 90 98 112 108" stroke="#22D3EE" stroke-width="6" fill="none" stroke-linecap="round" opacity=".9"/>
      <path d="M8 108 C30 94 46 82 60 70 C74 56 90 40 112 26" stroke="#F472B6" stroke-width="6" fill="none" stroke-linecap="round" opacity=".9"/>
      <path d="M8 26 C30 40 46 56 60 70 C74 84 90 98 112 108" stroke="#fff" stroke-width="1.5" fill="none" opacity=".8"/>
      <path d="M8 108 C30 94 46 82 60 70 C74 56 90 40 112 26" stroke="#fff" stroke-width="1.5" fill="none" opacity=".8"/>`:""}
      ${stage>=2?`<path d="M40 112 C42 88 50 78 60 76 C70 78 78 88 80 112Z" fill="url(#celr)" stroke="#C4B5FD" stroke-width="1.5"/>
      ${[[50,100],[66,94],[58,106],[72,104],[54,90]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.2" fill="#fff"/>`).join("")}`:""}
      <ellipse cx="60" cy="${stage===1?48:22}" rx="20" ry="5" fill="none" stroke="#FDE68A" stroke-width="3"><animate attributeName="opacity" values=".6;1;.6" dur="2.4s" repeatCount="indefinite"/></ellipse>
      ${stage===1?`<circle cx="60" cy="72" r="16" fill="url(#celo)" stroke="#FBBF24" stroke-width="2"/><path d="M53 71 q3 3 6 0 M61 71 q3 3 6 0" stroke="#7C2D12" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M56 78 q4 3 8 0" stroke="#7C2D12" stroke-width="2" fill="none" stroke-linecap="round"/>${[0,1,2,3,4,5,6,7].map(i=>{const a=i*Math.PI/4;return `<path d="M${(60+20*Math.cos(a)).toFixed(1)} ${(72+20*Math.sin(a)).toFixed(1)} L${(60+26*Math.cos(a)).toFixed(1)} ${(72+26*Math.sin(a)).toFixed(1)}" stroke="#FDE68A" stroke-width="3" stroke-linecap="round"/>`;}).join("")}`:`
      <circle cx="60" cy="52" r="22" fill="url(#celo)" stroke="#FBBF24" stroke-width="2"/>
      <path d="M50 50 q4 4 8 0 M62 50 q4 4 8 0" stroke="#7C2D12" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M54 60 q6 5 12 0" stroke="#7C2D12" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <circle cx="60" cy="40" r="3" fill="#7C3AED"/><circle cx="60" cy="40" r="5.5" fill="#7C3AED" opacity=".3"/>
      ${[0,1,2,3,4].map(i=>{ const a = (-150+i*30)*Math.PI/180, x = 60+32*Math.cos(a), y = 52+32*Math.sin(a); return `<path d="M${x.toFixed(1)} ${(y-5).toFixed(1)} l1.5 3.5 3.5 1.5 -3.5 1.5 -1.5 3.5 -1.5 -3.5 -3.5 -1.5 3.5 -1.5z" fill="#FDE68A"/>`; }).join("")}
      ${stage>=2?`<path d="M50 84 L70 84 M60 80 L60 88 M50 84 L46 92 L54 92Z M70 84 L66 92 L74 92Z" stroke="#FDE68A" stroke-width="1.6" fill="#FDE68A" fill-opacity=".4"/>`:""}`}`
,
  /* a wingless fluffy chick, then small wings, then full wings, compass and crown */
  griffin: (p, stage, mood) => `
      ${stage>=2?SCL(`<path d="M34 62 C8 46 2 22 12 10 C16 26 26 34 36 38 C30 28 30 18 36 12 C38 26 44 34 50 40Z" fill="#92400E" stroke="#451A03" stroke-width="1.2"/>
      <path d="M86 62 C112 46 118 22 108 10 C104 26 94 34 84 38 C90 28 90 18 84 12 C82 26 76 34 70 40Z" fill="#92400E" stroke="#451A03" stroke-width="1.2"/>
      <path d="M14 14 L26 34 M108 14 L94 34 M36 14 L42 34 M84 14 L78 34" stroke="#FCD34D" stroke-width="2" opacity=".8"/>`, stage===2?.62:1, 60, 50):""}
      <path d="M86 96 C104 100 112 86 106 74" stroke="${p.c1}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M106 74 C100 66 112 64 110 72Z" fill="#78350F"/>
      <ellipse cx="60" cy="86" rx="30" ry="20" fill="${p.c1}" stroke="#92400E" stroke-width="2"/>
      <rect x="38" y="98" width="9" height="12" rx="4" fill="${p.c1}"/><rect x="73" y="98" width="9" height="12" rx="4" fill="${p.c1}"/>
      ${stage===1?[[46,84],[60,80],[74,84],[52,94],[68,94]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6" fill="${p.c2}" opacity=".7"/>`).join(""):`<g transform="translate(48 76)"><rect width="24" height="18" rx="2" fill="#fff" stroke="#92400E" stroke-width="1.2"/><path d="M12 0 V18 M0 9 H24" stroke="#92400E" stroke-width="1.2"/><circle cx="6" cy="4.5" r="2.4" fill="#16A34A"/><text x="18" y="15.5" text-anchor="middle" font-size="6" font-weight="800" fill="#92400E" font-family="Manrope, sans-serif">NE</text></g>`}
      <path d="M44 62 C40 42 50 30 60 30 C70 30 80 42 76 62 C70 70 50 70 44 62Z" fill="${p.c2}" stroke="#D6D3D1" stroke-width="1.5"/>
      <path d="M48 36 L44 24 L54 32Z M72 36 L76 24 L66 32Z" fill="#fff" stroke="#D6D3D1"/>
      <path d="M54 52 L66 52 L60 64Z" fill="#F59E0B" stroke="#B45309" stroke-width="1.2"/>
      ${mood==="sleepy"?`<path d="M48 44 q4 3 8 0 M64 44 q4 3 8 0" stroke="#1F2430" stroke-width="2.5" fill="none"/>`:`${EYE(52,44,4.2,"#B45309")}${EYE(68,44,4.2,"#B45309")}<path d="M46 38 L56 41 M74 38 L64 41" stroke="#1F2430" stroke-width="2.2" stroke-linecap="round"/>`}
      ${stage===3?CROWN(26):""}`,
  /* a short baby serpent, a longer teen, and a full spined adult with its prism */
  leviathan: (p, stage, mood) => `
      <defs><linearGradient id="levg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22D3EE"/><stop offset="1" stop-color="#1E3A8A"/></linearGradient></defs>
      <path d="M2 104 C14 96 26 112 38 104 C50 96 62 112 74 104 C86 96 98 112 118 102 L118 120 L2 120Z" fill="#0EA5E9" opacity=".35"/>
      ${stage===1?`<path d="M60 102 C56 92 66 84 74 84 C82 84 80 64 72 42" stroke="url(#levg)" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M60 102 C52 106 48 98 54 94" stroke="url(#levg)" stroke-width="9" fill="none" stroke-linecap="round"/>`:`<path d="M${stage===2?"44 96 C46 104 74 106 78 86":"18 100 C18 76 42 72 46 88 C50 104 74 106 78 86"} C82 66 66 56 72 40" stroke="url(#levg)" stroke-width="15" fill="none" stroke-linecap="round"/>
      <path d="M${stage===2?"44 96 C46 104 74 106 78 86":"18 100 C18 76 42 72 46 88 C50 104 74 106 78 86"} C82 66 66 56 72 40" stroke="#A5F3FC" stroke-width="3" fill="none" stroke-dasharray="2 7" stroke-linecap="round" opacity=".9"/>`}
      ${stage===3?[[32,76],[46,96],[66,100],[80,74]].map(([x,y])=>`<path d="M${x} ${y-8} l5 -9 l4 9z" fill="#F0ABFC"/>`).join(""):""}
      ${stage===3?`<path d="M96 92 L112 66 L120 92Z" fill="#F472B6" opacity=".25" stroke="#F472B6" stroke-width="2"><animate attributeName="opacity" values=".15;.45;.15" dur="2.6s" repeatCount="indefinite"/></path>
      <text x="111" y="88" text-anchor="middle" font-size="7" font-weight="800" fill="#BE185D" font-family="Manrope, sans-serif">${p.mark||"DWL"}</text>`:""}
      <path d="M58 28 C60 14 84 12 90 26 C94 36 86 46 72 46 C62 46 56 38 58 28Z" fill="${p.c1}" stroke="#164E63" stroke-width="2"/>
      ${stage>=2?`<path d="M62 20 L56 8 L68 16Z M80 16 L88 4 L88 20Z" fill="#F0ABFC" stroke="#A21CAF" stroke-width="1"/>`:""}
      <path d="M90 30 C98 30 100 36 94 38" fill="#67E8F9"/>
      <path d="M74 40 C80 42 86 40 90 36" stroke="#164E63" stroke-width="2" fill="none"/>
      ${mood==="sleepy"?`<path d="M70 26 q4 3 8 0" stroke="#082F49" stroke-width="2.5" fill="none"/>`:`<ellipse cx="75" cy="27" rx="5" ry="4.5" fill="#FDE047"/><ellipse cx="75" cy="27" rx="1.6" ry="4" fill="#082F49"/><circle cx="75" cy="27" r="8" fill="#FDE047" opacity=".2"/>`}
      ${stage===3?CROWN(12,"#67E8F9"):""}`,
  kitsune: (p, stage, mood) => {
    /* one tail as a kit, three as a teen, all nine as an adult */
    const nT = stage === 1 ? 1 : stage === 2 ? 3 : 9;
    const tails = Array.from({length:nT},(_,i)=>{ const a = (nT === 1 ? -90 : -160 + i*(140/(nT-1)))*Math.PI/180, x = 60+Math.cos(a)*52, y = 84+Math.sin(a)*52;
      const d = `M60 88 Q${(60+Math.cos(a)*28).toFixed(1)} ${(84+Math.sin(a)*34).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
      return `<path d="${d}" stroke="#F9A8D4" stroke-width="12" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${p.c1}" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6.5" fill="${p.c2}"><animate attributeName="r" values="5.5;7.5;5.5" dur="${1.6+i*.15}s" repeatCount="indefinite"/></circle><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="11" fill="${p.c2}" opacity=".18"/>`; }).join("");
    return `${tails}
      <ellipse cx="60" cy="90" rx="22" ry="20" fill="${p.c1}" stroke="#FBCFE8" stroke-width="2"/>
      <path d="M50 108 L50 96 M70 108 L70 96" stroke="#FBCFE8" stroke-width="7" stroke-linecap="round"/>
      <path d="M40 56 L38 30 L54 46Z M80 56 L82 30 L66 46Z" fill="${p.c1}" stroke="#FBCFE8" stroke-width="1.5"/><path d="M42 50 L41 36 L50 46Z M78 50 L79 36 L70 46Z" fill="#F9A8D4"/>
      <path d="M40 60 C40 44 80 44 80 60 C80 72 70 78 60 78 C50 78 40 72 40 60Z" fill="${p.c1}" stroke="#FBCFE8" stroke-width="2"/>
      <path d="M46 54 L50 50 M74 54 L70 50" stroke="#EC4899" stroke-width="2" stroke-linecap="round"/><path d="M58 44 C60 40 62 40 64 44" stroke="#EC4899" stroke-width="2" fill="none"/>
      ${mood==="sleepy"?`<path d="M47 60 q4 3 8 0 M65 60 q4 3 8 0" stroke="#1F2430" stroke-width="2.4" fill="none"/>`:`<path d="M46 60 Q51 55 56 60 Q51 63 46 60Z M64 60 Q69 55 74 60 Q69 63 64 60Z" fill="#7C3AED"/><circle cx="52" cy="59.5" r="1.2" fill="#fff"/><circle cx="70" cy="59.5" r="1.2" fill="#fff"/>`}
      <ellipse cx="60" cy="68" rx="2.6" ry="2" fill="#1F2430"/><path d="M56 72 q4 3 8 0" stroke="#1F2430" stroke-width="1.8" fill="none"/>
      <circle cx="60" cy="92" r="6" fill="#FDF4FF" stroke="#F472B6" stroke-width="1.5"/><path d="M57 92 L60 88 L63 92 L60 96Z" fill="#F472B6"/>
      ${stage===3?CROWN(40,"#F9A8D4"):""}`; },
  seraph: (p, stage, mood) => `
      <defs><radialGradient id="serc"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#FEF3C7"/><stop offset="1" stop-color="#F59E0B"/></radialGradient>
        <linearGradient id="serw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#F0ABFC"/></linearGradient></defs>
      ${[[-1,0],[1,0]].map(([d])=>`
        ${stage===3?`<path d="M${60+d*12} 48 C${60+d*40} 20 ${60+d*58} 18 ${60+d*58} 8 C${60+d*50} 30 ${60+d*36} 40 ${60+d*14} 54Z" fill="url(#serw)" stroke="#E9D5FF" stroke-width="1.2"/>`:""}
        <path d="M${60+d*12} 58 C${60+d*44} 52 ${60+d*58} 62 ${60+d*60} 70 C${60+d*44} 66 ${60+d*30} 66 ${60+d*12} 64Z" fill="url(#serw)" stroke="#E9D5FF" stroke-width="1.2"/>
        ${stage>=2?`<path d="M${60+d*12} 70 C${60+d*36} 84 ${60+d*44} 100 ${60+d*42} 108 C${60+d*32} 96 ${60+d*24} 86 ${60+d*10} 78Z" fill="url(#serw)" stroke="#E9D5FF" stroke-width="1.2"/>`:""}`).join("")}
      ${stage===3?`<ellipse cx="60" cy="16" rx="18" ry="4.5" fill="none" stroke="#FDE68A" stroke-width="3"><animate attributeName="stroke-opacity" values=".5;1;.5" dur="2.2s" repeatCount="indefinite"/></ellipse>`:""}
      <circle cx="60" cy="48" r="20" fill="url(#serc)" stroke="#FBBF24" stroke-width="2"/>
      ${mood==="sleepy"?`<path d="M50 46 q4 3 8 0 M62 46 q4 3 8 0" stroke="#7C2D12" stroke-width="2.4" fill="none"/>`:`<path d="M50 47 q4 -4 8 0 M62 47 q4 -4 8 0" stroke="#7C2D12" stroke-width="2.4" fill="none" stroke-linecap="round"/>`}
      <path d="M54 56 q6 5 12 0" stroke="#7C2D12" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <circle cx="60" cy="36" r="2.6" fill="#A855F7"/>
      <path d="M48 76 L72 76 L66 104 L54 104Z" fill="#FFFBEB" stroke="#FDE68A" stroke-width="1.5"/>
      <path d="M60 78 V100 M44 84 L76 84" stroke="#B45309" stroke-width="2"/><path d="M44 84 L40 94 L48 94Z M76 84 L72 94 L80 94Z" fill="#FBBF24" stroke="#B45309" stroke-width="1"/>
      <path d="M38 94 Q44 99 50 94 M70 94 Q76 99 82 94" stroke="#B45309" stroke-width="1.5" fill="none"/>
      ${[0,1,2,3,4,5].map(i=>{ const a = (i*60-90)*Math.PI/180; return `<circle cx="${(60+30*Math.cos(a)).toFixed(1)}" cy="${(48+30*Math.sin(a)).toFixed(1)}" r="1.8" fill="#FDE68A"><animate attributeName="opacity" values=".2;1;.2" dur="${1.4+i*.2}s" repeatCount="indefinite"/></circle>`; }).join("")}`
};

/* ---------- reactions ---------- */
let reactT = null;
CS.petReact = (kind, egg) => {
  const P = st(); if (!P.active && !egg) return;
  let el = $("#pet-pop"); if (!el) { el = document.createElement("div"); el.id = "pet-pop"; el.className = "pet-pop"; document.body.appendChild(el); }
  if (kind === "egg") { let el2 = $("#pet-pop"); if (!el2) { el2 = document.createElement("div"); el2.id = "pet-pop"; el2.className = "pet-pop"; document.body.appendChild(el2); }
    el2.innerHTML = `${CS.eggSVG(egg.r,0,1,44)}<span class="stack" style="gap:0"><b class="small">You earned a mystery egg!</b><span class="tiny muted">${egg.need} correct answers to hatch</span></span>`;
    el2.classList.add("on"); clearTimeout(reactT); reactT = setTimeout(()=>el2.classList.remove("on"), 2600); return; }
  const lines = kind === "yay" ? ["Nice one!","You've got this!","Big brain move.","Keep going!","That's the one!"] : ["Shake it off!","Read the explanation, then try again.","Mistakes are how we learn.","We'll get the next one."];
  const msg = lines[Math.floor(Math.random()*lines.length)];
  const eggLine = egg && kind === "yay" ? `<span class="tiny muted">Egg: ${egg.prog}/${egg.need}</span>` : "";
  el.innerHTML = `${P.active ? CS.petSVG(P.active, {size:56, mood:kind==="yay"?"happy":"oops"}) : CS.eggSVG(egg.r, egg.prog, egg.need, 44)}<span class="stack" style="gap:0"><b class="small">${esc(msg)}</b>${eggLine}</span>`;
  el.classList.add("on"); clearTimeout(reactT); reactT = setTimeout(()=>el.classList.remove("on"), 1600);
};

/* ---------- egg found + hatch animations ---------- */
function overlay(html){ const w = document.createElement("div"); w.className = "modal-wrap"; w.innerHTML = `<div class="modal pet-modal" role="dialog" aria-modal="true">${html}</div>`; document.body.appendChild(w); return w; }
function hatch(egg){
  const rar = egg.forceR || (egg.minR ? rollRarityMin(egg.minR) : rollRarity()); const P = st(), pet = rollPet(rar), R = CS.RARITY[rar], dup = !!P.owned[pet.id];
  if (dup) { P.owned[pet.id].growth += 15; P.owned[pet.id].copies = (P.owned[pet.id].copies||1)+1; CS.addXP(50); }
  else P.owned[pet.id] = {growth:0, at:CS.today(), copies:1};
  P.hatched++; if (!P.active) P.active = pet.id; CS.save(); CS.refresh && CS.refresh();
  const big = rar === "mythical" || rar === "supreme";
  const w = overlay(`<span class="eyebrow">${big?"Something incredible is hatching…":"Hatching…"}</span><div class="hatch-stage"><div class="egg-shake">${CS.eggSVG(egg.r, egg.need, egg.need, 120)}</div></div><h2 class="hatch-title" style="opacity:0">&nbsp;</h2><div class="hatch-body"></div>`);
  setTimeout(() => {
    $(".hatch-stage", w).innerHTML = `<div class="pet-reveal ${big?"big "+rar:""}" style="--glow:${R.glow};--col:${R.col}">${CS.petSVG(pet.id, {size:big?180:150, stage:1})}</div>`;
    $(".eyebrow", w).textContent = `${R.n} · ${pet.u?`Unit ${pet.u}`:"Every unit"}`; $(".eyebrow", w).style.color = R.col;
    const t = $(".hatch-title", w); t.textContent = big ? `${R.n.toUpperCase()}! ${pet.n}!` : `${pet.n}!`; t.style.opacity = 1; if (rar === "supreme") t.classList.add("rainbow-text");
    $(".hatch-body", w).innerHTML = `<p class="muted">${esc(pet.bio)}</p>
      <p class="small"><b>${pet.p}%</b> chance to hatch · ${dup?`Duplicate! +15 growth for ${esc(pet.n)} and +50 XP.`:`Gives +${Math.round(R.boost*100)}% XP while active.`}</p>
      <div class="row-wrap" style="justify-content:center">${!dup&&P.active!==pet.id?`<button class="btn" id="h-act">Make active pet</button>`:""}<button class="btn ${!dup&&P.active!==pet.id?"ghost":""}" id="h-ok">${P.pending&&P.pending.length?"Next egg":"Awesome"}</button><button class="btn ghost" id="h-see">Collection</button></div>`;
    const a = $("#h-act", w); if (a) a.onclick = () => { P.active = pet.id; CS.save(); w.remove(); CS.toast(`${pet.n} is now your active pet.`); };
    $("#h-ok", w).onclick = () => { w.remove(); setTimeout(() => CS.petFlush(true), 250); }; $("#h-see", w).onclick = () => { w.remove(); CS.go("pets"); };
  }, big ? 3000 : 1500);
}
CS.hatchNow = hatch; // used by tests/debug
/* hatch reveals wait until the student isn't in a timed exam, game or the diagnostic */
CS.petBusy = () => !!document.querySelector("#ex-timer, #r-time, #t-time, #n-time, #s-bar, .diag-run, .pet-modal");
CS.petFlush = (force) => { const P = st(); if (!P.pending || !P.pending.length) return; if (force ? document.querySelector(".pet-modal") : CS.petBusy()) return; const egg = P.pending.shift(); CS.save(); hatch(egg); };
/* a hatch that was held back (timed game, exam, open dialog) is retried until it can open, so eggs never wait for a tab change */
setInterval(() => { try { const P = st(); if (P && P.pending && P.pending.length) CS.petFlush(); } catch(e) {} }, 1200);

/* ---------- mood ---------- */
CS.petMood = () => { const s = S(), today = s.days[CS.today()]||0, h = new Date().getHours();
  if (CS.streak() > 0 && today === 0 && h >= 17) return "sad"; if (today === 0) return "sleepy"; return "happy"; };

/* ---------- Pets view ---------- */
CS.render = CS.render || {};
let petFilter = "all", petSet = CS.COURSE;
CS.render.pets = () => {
  const P = st(), v = $("#v-pets"), egg = P.eggs[0], A = P.active ? CS.PET[P.active] : null, ownedN = Object.keys(P.owned).filter(k => (CS.PET[k]||{}).r !== "secret").length;
  const mood = CS.petMood(), moodTxt = {happy:"is happy you're studying today.", sleepy:"is sleepy. Answer a question to wake it up.", sad:"is worried about your streak!"}[mood];
  const SETP = CS.PET_SETS[petSet].pets;
  const list = SETP.filter(p => petFilter==="all" || p.r===petFilter).sort((a,b)=>ORDER.indexOf(a.r)-ORDER.indexOf(b.r));
  v.innerHTML = `<div class="page-head"><div class="stack" style="gap:6px"><span class="eyebrow">${esc(CS.C.name)} eggs hatch ${esc(CS.C.name)} pets</span><h1>Pets</h1><p class="muted">Earn a mystery egg for every ${CS.eggEvery()} questions you answer, then hatch it with ${CS.eggNeed()} correct answers. Every egg has the same odds of every pet. ${ownedN}/${MACRO.length} discovered.</p></div></div>
    <div class="pet-top">
      <div class="panel pet-active">
        ${A ? `<span class="eyebrow" style="color:${CS.RARITY[A.r].col}">Active pet · ${CS.RARITY[A.r].n}</span>
          <div class="pet-stage-big ${mood}" style="--glow:${CS.RARITY[A.r].glow}">${CS.petSVG(A.id, {size:170, mood})}</div>
          <h2>${esc(A.n)}</h2><p class="muted small">${esc(A.n)} ${moodTxt}</p>
          <div class="pet-stats"><div><b>Lv ${CS.petLevel(A.id)}</b><span>${STAGE[CS.petStage(A.id)]}</span></div><div><b>+${Math.round(CS.RARITY[A.r].boost*100)}%</b><span>XP boost</span></div><div><b>${Math.floor(P.owned[A.id].growth)}</b><span>growth points</span></div></div>
          ${CS.petStage(A.id)<3?`<div class="stack" style="gap:4px"><span class="tiny muted">Grows into ${CS.petStage(A.id)===1?"a teen at 30":"an adult at 100"} correct answers</span><div class="meter mint"><i style="width:${Math.min(100, P.owned[A.id].growth/(CS.petStage(A.id)===1?30:100)*100)}%"></i></div></div>`:`<span class="tag good" style="align-self:flex-start">Fully grown</span>`}`
        : `<span class="eyebrow">Active pet</span><div class="pet-stage-big">${CS.petSVG("squirrel",{size:170, locked:true})}</div><h2>No pet yet</h2><p class="muted small">Hatch your first egg to get a study buddy that boosts your XP.</p>`}
      </div>
      <div class="panel">
        <span class="eyebrow">Incubator</span>
        ${egg ? `<div class="row-wrap" style="gap:18px;align-items:center"><div class="egg-wobble">${CS.eggSVG(egg.r, egg.prog, egg.need, 96)}</div>
          <div class="stack" style="gap:6px;flex:1;min-width:160px"><h3 style="color:${CS.RARITY[egg.r].col}">${egg.minR?CS.RARITY[egg.minR].n+"+ mystery":"Mystery"} egg</h3><span class="muted small">${egg.need-egg.prog} more correct answer${egg.need-egg.prog===1?"":"s"} to hatch</span>
          <div class="meter" style="height:10px"><i style="width:${egg.prog/egg.need*100}%;background:${CS.RARITY[egg.r].col}"></i></div><span class="tiny faint">${egg.prog}/${egg.need}</span></div></div>
          <div class="row-wrap"><button class="btn" data-go="practice" data-mode="mixed">Answer questions</button><button class="btn ghost" data-go="games" data-game="sprint">Sprint to hatch</button></div>`
        : `<div class="row-wrap" style="gap:18px;align-items:center"><div style="opacity:.4">${CS.eggSVG("mystery",0,1,96)}</div><div class="stack" style="gap:6px;flex:1;min-width:160px"><h3>Next egg in ${CS.nextEggIn()} question${CS.nextEggIn()===1?"":"s"}</h3><span class="muted small">Every ${CS.eggEvery()} questions you answer, right or wrong, earns a mystery egg.</span>
          <div class="meter" style="height:10px"><i style="width:${(CS.eggEvery()-CS.nextEggIn())/CS.eggEvery()*100}%"></i></div></div></div>
          <div><button class="btn" data-go="practice" data-mode="mixed">Answer questions</button></div>`}
        <span class="tiny muted">Next egg: ${CS.eggEvery()-CS.nextEggIn()}/${CS.eggEvery()} questions answered</span>
        ${P.eggs.length>1?`<span class="eyebrow">Waiting in the nest</span><div class="row-wrap">${P.eggs.slice(1).map(e=>`<span title="${CS.RARITY[e.r].n} egg · ${e.need} answers">${CS.eggSVG(e.r,0,1,40)}</span>`).join("")}</div>`:""}
        <div class="stack" style="gap:6px"><span class="eyebrow">What's inside every egg</span><div class="odds">${ORDER.map(k=>`<div><i style="background:${CS.RARITY[k].col}"></i><b>${CS.RARITY[k].n}</b><span>${CS.RARITY[k].p}% · +${Math.round(CS.RARITY[k].boost*100)}% XP</span></div>`).join("")}</div></div>
      </div>
    </div>
    <div class="spread"><div class="row-wrap" style="gap:10px"><h2>Collection</h2><div class="seg" role="group" aria-label="Pet set" style="width:auto;display:inline-flex">${Object.entries(CS.PET_SETS).map(([k,v])=>`<button data-ps="${k}" aria-pressed="${petSet===k}">${esc(v.name.replace("economics",""))} · ${v.pets.filter(p=>P.owned[p.id]).length}/${v.pets.length}</button>`).join("")}</div></div><div class="chips">${["all",...ORDER].map(k=>`<button class="chip" aria-pressed="${petFilter===k}" data-pf="${k}">${k==="all"?"All":CS.RARITY[k].n}</button>`).join("")}</div></div>
    <div class="pet-grid">${list.map(p=>{ const o = P.owned[p.id], R = CS.RARITY[p.r];
      return `<button class="pet-card ${o?"own":""} ${P.active===p.id?"act":""}" data-pid="${p.id}" style="--col:${R.col};--glow:${R.glow}" ${o?"":"aria-disabled=\"true\""}>
        <span class="rar ${p.r==="supreme"?"sup":""}" style="color:${R.col}">${R.n}</span>${CS.petSVG(p.id, {size:92, locked:!o, stage:o?CS.petStage(p.id):1})}
        <b class="small">${o?esc(p.n):"???"}</b><span class="tiny muted">${p.p}% · ${p.u?`Unit ${p.u}`:"Every unit"}${o&&o.copies>1?` · ×${o.copies}`:""}</span>
        ${o?`<span class="tiny">${P.active===p.id?"Active":"Lv "+CS.petLevel(p.id)}</span>`:""}</button>`; }).join("")}</div>
    ${SECRET.some(p=>P.owned[p.id]) ? `<div class="spread"><h2>Secret pets</h2><span class="tiny muted">Not in eggs, merges or the market</span></div>
    <div class="pet-grid">${SECRET.filter(p=>P.owned[p.id]).map(p=>{ const o = P.owned[p.id], R = CS.RARITY.secret;
      return `<button class="pet-card own ${P.active===p.id?"act":""}" data-pid="${p.id}" style="--col:${R.col};--glow:${R.glow}"><span class="rar sup" style="color:${R.col}">${R.n}</span>${CS.petSVG(p.id, {size:92, stage:CS.petStage(p.id)})}<b class="small">${esc(p.n)}</b><span class="tiny muted">+${Math.round(R.boost*100)}% XP${o.copies>1?` · ×${o.copies}`:""}</span><span class="tiny">${P.active===p.id?"Active":"Lv "+CS.petLevel(p.id)}</span></button>`; }).join("")}</div>` : ""}`;
  $$("#v-pets [data-pf]").forEach(b => b.onclick = () => { petFilter = b.dataset.pf; CS.render.pets(); });
  $$("#v-pets [data-ps]").forEach(b => b.onclick = () => { petSet = b.dataset.ps; CS.render.pets({keepScroll:true}); });
  $$("#v-pets [data-pid]").forEach(b => b.onclick = () => { const id = b.dataset.pid; if (!P.owned[id]) return; petDetail(id); });
};
function petDetail(id){
  const P = st(), p = CS.PET[id], R = CS.RARITY[p.r], o = P.owned[id];
  const w = overlay(`<div class="spread"><span class="eyebrow" style="color:${R.col}">${R.n} · ${p.r==="secret"?"Not obtainable from eggs":`${p.u?`Unit ${p.u}`:"Every unit"} · ${p.p}% chance`}</span><button class="btn ghost sm" id="pd-x">Close</button></div>
    <div class="row-wrap" style="justify-content:center;gap:8px">${[1,2,3].map(sg=>`<div class="stack" style="align-items:center;gap:2px;opacity:${CS.petStage(id)>=sg?1:.35}">${CS.petSVG(id,{size:sg===3?120:sg===2?100:84, stage:sg})}<span class="tiny muted">${STAGE[sg]}</span></div>`).join("")}</div>
    <h2>${esc(p.n)}</h2><p class="muted">${esc(p.bio)}</p>
    <p class="small">Level ${CS.petLevel(id)} · ${o.growth} correct answers together · hatched ${esc(o.at)}${o.copies>1?` · ${o.copies} copies`:""} · +${Math.round(R.boost*100)}% XP while active</p>
    <div class="row-wrap">${P.active===id?`<span class="tag good">Active pet</span>`:`<button class="btn" id="pd-act">Make active</button>`}${CS.giftPet&&p.r!=="secret"?`<button class="btn ghost" id="pd-gift">🎁 Gift to a friend</button>`:""}</div>`);
  const gf = $("#pd-gift", w); if (gf) gf.onclick = () => { w.remove(); CS.giftPet(id); };
  $("#pd-x", w).onclick = () => w.remove();
  const a = $("#pd-act", w); if (a) a.onclick = () => { P.active = id; CS.save(); w.remove(); CS.render.pets(); CS.toast(`${p.n} is now your active pet.`); };
}

/* small dashboard card */
CS.petCard = () => {
  const P = st(), egg = P.eggs[0], A = P.active ? CS.PET[P.active] : null, mood = CS.petMood();
  return `<div class="panel flat pet-mini" data-go="pets" role="button" tabindex="0">
    <div class="pet-stage-sm ${mood}">${A ? CS.petSVG(A.id, {size:76, mood}) : CS.eggSVG("mystery", egg?egg.prog:0, egg?egg.need:1, 60)}</div>
    <div class="stack" style="gap:4px;flex:1;min-width:0"><span class="eyebrow">${A?esc(A.n):"Your pet"}</span>
      ${egg ? `<b>${egg.minR?CS.RARITY[egg.minR].n+"+ mystery":"Mystery"} egg: ${egg.need-egg.prog} correct answer${egg.need-egg.prog===1?"":"s"} to hatch</b><div class="meter thin"><i style="width:${egg.prog/egg.need*100}%;background:${CS.RARITY[egg.r].col}"></i></div>`
        : `<b>Next mystery egg in ${CS.nextEggIn()} question${CS.nextEggIn()===1?"":"s"}</b><div class="meter thin"><i style="width:${(CS.eggEvery()-CS.nextEggIn())/CS.eggEvery()*100}%"></i></div>`}
      <span class="muted tiny">${A?`Lv ${CS.petLevel(A.id)} ${STAGE[CS.petStage(A.id)]} · +${Math.round(CS.RARITY[A.r].boost*100)}% XP`:`${SET.filter(p=>P.owned[p.id]).length}/${SET.length} pets discovered`}</span></div></div>`;
};
})();
/* pet badges */
(function(){ const CS = window.CS, S = () => CS.S(); const P = () => S().pets || {owned:{}};
  CS.BADGES.push(
    {k:"hatch1", n:"It's alive!", d:"Hatch your first pet", ic:"paw", t:()=>Object.keys(P().owned).length>=1},
    {k:"pets10", n:"Collector", d:"Discover 10 pets", ic:"paw", t:()=>Object.keys(P().owned).length>=10},
    {k:"petleg", n:"Legend tamer", d:"Hatch a legendary pet", ic:"star", t:()=>Object.keys(P().owned).some(id=>CS.PET[id].r==="legendary")},
    {k:"petmyth", n:"Mythbuster", d:"Hatch a mythical pet", ic:"star", t:()=>Object.keys(P().owned).some(id=>CS.PET[id].r==="mythical")},
    {k:"petsup", n:"Supreme being", d:"Hatch the Supreme Mythical pet", ic:"medal", t:()=>!!(P().owned.celestial||P().owned.seraph)},
    {k:"petall", n:"Gotta study 'em all", d:"Discover every pet", ic:"medal", t:()=>CS.PETS.every(p=>P().owned[p.id])}
  );
})();
