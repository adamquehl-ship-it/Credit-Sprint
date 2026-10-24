/* Credit Sprint Biology: units, flashcards, FRQs and diagrams. All content is original.
   Biology has no supply-and-demand graphs, so CS_MARKETS / CS_SHIFTS / CS_EVENTS are empty and the graph-only
   practice modes and games are hidden. Diagrams live in CS_FIGS (SVG) and power the guides and explainers. */

window.CS_UNITS = [
 {id:1, name:"Chemistry of Life", short:"Chemistry of life", ap:"8–11%", clep:"8–12%", wAP:9.5, wCLEP:10, lab:null,
  summary:"Life is built from a few elements arranged into four kinds of large molecules. Water's polarity and hydrogen bonding make it the solvent of life, and the structure of carbohydrates, lipids, proteins and nucleic acids explains what each one can do.",
  points:["Water is polar. Hydrogen bonds between water molecules give it cohesion, adhesion, high specific heat and surface tension, and make ice less dense than liquid water.","Carbon forms four covalent bonds, so it can build long chains, rings and branches: the backbone of every macromolecule.","Monomers join by dehydration synthesis (a water molecule is removed) and split by hydrolysis (a water molecule is added).","Carbohydrates (monosaccharides → polysaccharides) store energy (starch, glycogen) and build structure (cellulose, chitin).","Lipids are hydrophobic. Phospholipids have a hydrophilic phosphate head and two hydrophobic tails, so they form bilayers in water.","Proteins are chains of amino acids. Each amino acid has an R group; R-group chemistry (polar, nonpolar, charged) drives folding.","Protein structure: primary (sequence) → secondary (α-helix, β-sheet, H-bonds in the backbone) → tertiary (R-group interactions) → quaternary (more than one chain).","Nucleic acids are chains of nucleotides (sugar, phosphate, nitrogenous base). DNA uses deoxyribose and thymine; RNA uses ribose and uracil.","DNA strands are antiparallel (5′→3′ and 3′→5′); A pairs with T (2 H-bonds) and G pairs with C (3 H-bonds).","Nitrogen is found in proteins and nucleic acids; phosphorus is found in nucleic acids and phospholipids."],
  formulas:["Dehydration synthesis: monomer–OH + H–monomer → monomer–monomer + H₂O","Hydrolysis: polymer + H₂O → smaller pieces","Chargaff's rule: %A = %T and %G = %C in double-stranded DNA"],
  traps:["Hydrogen bonds hold water molecules to each other; covalent bonds hold the atoms within one water molecule.","Denaturing a protein changes its shape (secondary to quaternary), not its primary sequence.","Saturated fats have no C=C double bonds and are solid at room temperature; unsaturated fats have kinks from double bonds."],
  graph:"dehydration"},
 {id:2, name:"Cell Structure and Function", short:"Cells", ap:"10–13%", clep:"10–14%", wAP:11.5, wCLEP:12, lab:null,
  summary:"Cells are the basic unit of life. Organelles divide up the work in eukaryotic cells, the plasma membrane controls what enters and leaves, and surface area-to-volume ratio limits how big a cell can be.",
  points:["Prokaryotes (bacteria, archaea) have no nucleus or membrane-bound organelles; eukaryotes have both. Both have ribosomes, a plasma membrane, cytoplasm and DNA.","Ribosomes make proteins. Rough ER is studded with ribosomes and makes proteins for secretion or membranes; smooth ER makes lipids and detoxifies.","The Golgi complex modifies, sorts and packages proteins into vesicles. Lysosomes digest with hydrolytic enzymes.","Mitochondria (cellular respiration) and chloroplasts (photosynthesis) have double membranes, their own DNA and ribosomes: evidence for endosymbiosis.","As a cell grows, volume increases faster than surface area, so the SA:V ratio falls and exchange becomes less efficient. Folds and flat shapes raise SA:V.","The fluid mosaic model: a phospholipid bilayer with embedded proteins, cholesterol (in animals) and carbohydrate markers.","Small nonpolar molecules (O₂, CO₂) diffuse straight through the bilayer; ions and large polar molecules need transport proteins.","Passive transport (diffusion, facilitated diffusion, osmosis) moves substances down their gradient with no ATP. Active transport moves them against the gradient using ATP.","Water moves toward the more negative water potential (higher solute concentration). In a hypertonic solution a cell loses water; in a hypotonic one it gains water.","Endocytosis and exocytosis move large substances in and out with vesicles."],
  formulas:["Surface area of a cube = 6s²; volume = s³; SA:V = 6/s","Water potential: Ψ = Ψs + Ψp","Solute potential: Ψs = −iCRT (R = 0.0831 L·bar/mol·K, T in kelvin)"],
  traps:["Hypertonic describes the solution with MORE solute. Water moves toward it.","Facilitated diffusion uses a protein but no ATP. Protein ≠ active.","A smaller cell has a LARGER SA:V ratio."],
  graph:"membrane"},
 {id:3, name:"Cellular Energetics", short:"Energetics", ap:"12–16%", clep:"10–14%", wAP:14, wCLEP:12, lab:null,
  summary:"Enzymes speed up reactions by lowering activation energy, and cells capture and release energy through photosynthesis and cellular respiration. Both depend on electron transport chains that pump protons and power ATP synthase.",
  points:["Enzymes are catalysts: they lower activation energy without being used up. The substrate binds the active site, which fits by shape and chemistry.","Temperature and pH change enzyme shape. Too far from the optimum and the enzyme denatures, so the rate drops.","A competitive inhibitor binds the active site (overcome by more substrate); a noncompetitive inhibitor binds elsewhere and changes the enzyme's shape.","Raising substrate concentration speeds the reaction until every active site is busy (saturation).","Photosynthesis: light reactions (thylakoid) split water, release O₂ and make ATP and NADPH; the Calvin cycle (stroma) uses them to fix CO₂ into sugar.","Cellular respiration: glycolysis (cytoplasm) → pyruvate oxidation and the Krebs cycle (mitochondrial matrix) → oxidative phosphorylation (inner membrane).","The electron transport chain pumps H⁺ across a membrane; H⁺ flows back through ATP synthase, making ATP. This is chemiosmosis.","O₂ is the final electron acceptor in aerobic respiration, forming water. Without O₂, fermentation regenerates NAD⁺ so glycolysis can keep going.","Fermentation makes only the 2 ATP from glycolysis, plus lactate (animals) or ethanol and CO₂ (yeast).","Energy flows; matter cycles. Respiration's products (CO₂, H₂O) are photosynthesis's inputs."],
  formulas:["Photosynthesis: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂","Respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP","Rate of reaction = change in amount ÷ change in time"],
  traps:["Enzymes don't change ΔG (whether a reaction releases energy); they only lower activation energy.","The Calvin cycle doesn't need light directly, but it stops in the dark because it runs out of ATP and NADPH.","Most ATP in respiration comes from oxidative phosphorylation, not glycolysis or the Krebs cycle."],
  graph:"enzyme"},
 {id:4, name:"Cell Communication and Cell Cycle", short:"Signaling & cycle", ap:"10–15%", clep:"12–16%", wAP:12.5, wCLEP:14, lab:null,
  summary:"Cells talk to each other with chemical signals that are received, passed along inside the cell and turned into a response. Feedback keeps the body stable, and the cell cycle, guarded by checkpoints, controls when cells divide.",
  points:["Signaling can be direct contact, local (paracrine, synaptic) or long-distance (hormones in the blood).","Signal transduction has three stages: reception (ligand binds a receptor), transduction (a relay, often a phosphorylation cascade or second messengers like cAMP) and response.","Nonpolar signals (steroid hormones) cross the membrane and bind receptors inside the cell; polar signals bind membrane receptors.","A cascade amplifies the signal: one ligand can activate many molecules.","Negative feedback brings a variable back toward a set point (blood glucose, body temperature). Positive feedback pushes a change further (labor contractions, blood clotting).","The cell cycle: G1 (growth), S (DNA replication), G2 (preparation), then M (mitosis) and cytokinesis. Many cells leave the cycle and rest in G0.","Mitosis: prophase, metaphase (chromosomes line up), anaphase (sister chromatids separate), telophase. Result: two genetically identical diploid cells.","Checkpoints (G1, G2, M) check DNA damage and spindle attachment. Cyclins and cyclin-dependent kinases (CDKs) drive the cycle forward.","Cancer comes from mutations that disable checkpoints: oncogenes push division on; damaged tumor-suppressor genes (such as p53) stop braking it.","Apoptosis is programmed cell death, which removes damaged or unneeded cells."],
  formulas:["Mitotic index = cells in mitosis ÷ total cells counted","Chromosome count stays 2n through mitosis; DNA content doubles in S phase"],
  traps:["Sister chromatids separate in anaphase of mitosis; homologous chromosomes separate in anaphase I of meiosis.","A mutation that blocks a receptor stops the response even if plenty of ligand is present.","Positive feedback doesn't mean 'good'. It means the response amplifies the original change."],
  graph:"cellcycle"},
 {id:5, name:"Heredity", short:"Heredity", ap:"8–11%", clep:"10–14%", wAP:9.5, wCLEP:12, lab:null,
  summary:"Meiosis makes genetically different gametes, and Mendel's laws predict how traits pass from parents to offspring. Many traits break the simple rules through linkage, sex linkage, incomplete dominance or the environment.",
  points:["Meiosis makes four haploid gametes from one diploid cell, with two divisions and one round of DNA replication.","Variation comes from crossing over (prophase I), independent assortment of homologous pairs (metaphase I) and random fertilization.","Law of segregation: the two alleles for a gene separate into different gametes. Law of independent assortment: genes on different chromosomes sort independently.","Monohybrid cross Aa × Aa gives 3:1 phenotypes and 1:2:1 genotypes; a dihybrid cross AaBb × AaBb gives 9:3:3:1.","Use the multiplication rule for 'and' (independent events) and the addition rule for 'or' (mutually exclusive outcomes).","Incomplete dominance blends (red × white → pink); codominance shows both (AB blood type).","Sex-linked (X-linked) recessive traits show up more in males, who have only one X.","Genes close together on the same chromosome are linked and are inherited together more often; recombination frequency estimates map distance.","Nondisjunction makes gametes with an extra or missing chromosome (for example, trisomy 21).","The environment can change phenotype (hydrangea flower color with soil pH, Himalayan rabbit fur with temperature)."],
  formulas:["Probability of A and B = P(A) × P(B)","Probability of A or B = P(A) + P(B)","Chi-square: χ² = Σ (observed − expected)² ÷ expected; degrees of freedom = categories − 1","Map distance (map units) = recombination frequency × 100"],
  traps:["If χ² is LESS than the critical value, you fail to reject the null hypothesis: the difference is due to chance.","Mitosis ≠ meiosis. Only meiosis halves the chromosome number and shuffles alleles.","A carrier female (XᴬXᵃ) × normal male gives a 1 in 2 chance that each SON is affected, not 1 in 4 children."],
  graph:"punnett"},
 {id:6, name:"Gene Expression and Regulation", short:"Gene expression", ap:"12–16%", clep:"10–14%", wAP:14, wCLEP:12, lab:null,
  summary:"DNA is copied before division and read to make RNA and proteins. Cells turn genes on and off so different cells do different jobs, mutations change the code, and biotechnology lets scientists read and edit it.",
  points:["DNA replication is semiconservative: each new double helix keeps one old strand. Helicase unwinds, primase adds a primer, DNA polymerase builds 5′→3′, ligase joins Okazaki fragments on the lagging strand.","Transcription (nucleus): RNA polymerase reads the template strand and builds mRNA 5′→3′.","Eukaryotic mRNA is processed: a 5′ cap, a poly-A tail and splicing out of introns. Alternative splicing lets one gene make several proteins.","Translation (ribosome): tRNA anticodons pair with mRNA codons, bringing amino acids. It starts at AUG and stops at a stop codon.","The genetic code is redundant (several codons for most amino acids) and nearly universal, evidence of common ancestry.","Prokaryotes regulate genes with operons. The lac operon is inducible (on when lactose is present); the trp operon is repressible (off when tryptophan is high).","Eukaryotes regulate with transcription factors, enhancers, DNA methylation and histone acetylation. All cells carry the same DNA but express different genes.","Point mutations: silent (same amino acid), missense (different amino acid), nonsense (early stop codon). Frameshifts (insertions or deletions not in threes) change every codon after them.","Biotechnology: gel electrophoresis separates DNA by size (small pieces travel farther), PCR copies DNA, and bacterial transformation inserts genes with plasmids.","Mutations are random; selection acts on the variation they produce."],
  formulas:["mRNA codon is complementary to the DNA template and matches the coding strand (U for T)","Number of possible codons = 4³ = 64"],
  traps:["The tRNA anticodon is complementary to the mRNA codon, so it matches the DNA template strand's sequence (with U for T).","Introns are removed; exons are expressed.","In gel electrophoresis, DNA (negatively charged) moves toward the positive electrode."],
  graph:"dogma"},
 {id:7, name:"Natural Selection", short:"Evolution", ap:"13–20%", clep:"14–18%", wAP:16.5, wCLEP:16, lab:null,
  summary:"Populations evolve when allele frequencies change over generations. Natural selection acts on inherited variation, genetic drift and gene flow change populations too, and evidence from fossils, anatomy and molecules shows that all life shares common ancestors.",
  points:["Natural selection needs variation, inheritance, overproduction and differential survival and reproduction. Individuals don't evolve; populations do.","Fitness means reproductive success, not strength.","Directional selection favors one extreme; stabilizing selection favors the middle; disruptive selection favors both extremes.","Genetic drift is random change in allele frequency, strongest in small populations (bottleneck and founder effects). Gene flow moves alleles between populations.","Hardy–Weinberg equilibrium holds when there's no selection, no mutation, no migration, random mating and a very large population.","Evidence for evolution: fossils, homologous structures, vestigial structures, embryology, DNA and protein comparisons, and biogeography.","Homologous structures share ancestry; analogous structures share function from convergent evolution.","Phylogenetic trees show relationships. Taxa that share a more recent common ancestor are more closely related, and shared derived characters define clades.","Speciation: allopatric (geographic isolation) or sympatric (in the same area, for example by polyploidy). Prezygotic barriers stop fertilization; postzygotic barriers make hybrids weak or sterile.","Extinction opens niches; adaptive radiation follows. Earth's early conditions may have allowed simple organic molecules and RNA to form first."],
  formulas:["Hardy–Weinberg: p + q = 1","p² + 2pq + q² = 1 (homozygous dominant, heterozygous, homozygous recessive)","q² = frequency of the recessive phenotype"],
  traps:["Organisms don't develop traits because they need them. Variation must already exist.","Read a phylogenetic tree by the most recent common ancestor, not by how close two tips sit on the page.","2pq, not p × q, is the heterozygote frequency."],
  graph:"selection"},
 {id:8, name:"Ecology", short:"Ecology", ap:"10–15%", clep:"14–18%", wAP:12.5, wCLEP:12, lab:null,
  summary:"Ecology studies how organisms interact with each other and their environment. Energy flows through food webs and is lost as heat, matter cycles, populations grow until resources limit them, and communities change after disturbances.",
  points:["Organisms respond to the environment through behavior (taxis, kinesis, communication) and physiology. Endotherms use metabolic heat; ectotherms rely on the surroundings.","Only about 10% of energy passes from one trophic level to the next. The rest is lost mostly as heat from respiration.","Gross primary productivity minus respiration = net primary productivity.","Carbon, nitrogen, phosphorus and water cycle through ecosystems. Nitrogen-fixing bacteria turn N₂ into usable ammonia; phosphorus has no atmospheric phase.","Exponential growth (J-curve) happens when resources are unlimited. Logistic growth (S-curve) levels off at carrying capacity, K.","Density-dependent factors (competition, disease, predation) intensify as a population grows; density-independent factors (fire, floods, weather) don't depend on density.","Community interactions: competition (−/−), predation and parasitism (+/−), mutualism (+/+), commensalism (+/0).","Keystone species have outsized effects on community structure; removing one can collapse a food web.","Diversity makes ecosystems more resilient. Invasive species, habitat loss and climate change reduce biodiversity.","Ecological succession: primary (bare rock, starting with pioneer species like lichens) and secondary (soil remains after a disturbance)."],
  formulas:["Energy at the next level ≈ 10% of the level below","Exponential growth: dN/dt = rN","Logistic growth: dN/dt = rN × (K − N)/K","Simpson's diversity index: D = 1 − Σ(n/N)²"],
  traps:["Energy does NOT cycle. Matter cycles; energy flows one way and leaves as heat.","Population growth is fastest at K/2 in logistic growth, not at K.","Removing a predator can lower diversity if its prey then outcompetes other species."],
  graph:"logistic"}
];

/* [unit, term, definition] */
window.CS_CARDS_RAW = [
 [1,"Polarity","Uneven sharing of electrons. In water, oxygen is partly negative and hydrogens are partly positive."],
 [1,"Hydrogen bond","A weak attraction between a partly positive hydrogen and a partly negative atom (O or N) on another molecule."],
 [1,"Cohesion","Water molecules sticking to each other. Gives water surface tension and helps pull water up through xylem."],
 [1,"Adhesion","Water sticking to other surfaces, such as the walls of xylem vessels."],
 [1,"Specific heat","The energy needed to change temperature. Water's is high, so it buffers temperature changes."],
 [1,"Dehydration synthesis","Joining two monomers by removing a water molecule."],
 [1,"Hydrolysis","Breaking a polymer by adding a water molecule."],
 [1,"Monosaccharide","A simple sugar such as glucose. The monomer of carbohydrates."],
 [1,"Phospholipid","A lipid with a hydrophilic head and two hydrophobic tails. Forms cell membranes."],
 [1,"Amino acid","The monomer of proteins: an amino group, a carboxyl group and a variable R group."],
 [1,"Primary structure","The sequence of amino acids in a protein."],
 [1,"Tertiary structure","A protein's 3-D shape from interactions between R groups."],
 [1,"Nucleotide","The monomer of nucleic acids: a five-carbon sugar, a phosphate and a nitrogenous base."],
 [1,"Antiparallel","DNA's two strands run in opposite directions, 5′→3′ and 3′→5′."],
 [2,"Prokaryote","A cell with no nucleus or membrane-bound organelles, such as a bacterium."],
 [2,"Ribosome","Makes proteins by translating mRNA. Found in every cell."],
 [2,"Rough ER","ER with ribosomes. Makes proteins for secretion or for membranes."],
 [2,"Golgi complex","Modifies, sorts and ships proteins in vesicles."],
 [2,"Lysosome","A vesicle of digestive (hydrolytic) enzymes that breaks down molecules and old organelles."],
 [2,"Endosymbiotic theory","Mitochondria and chloroplasts came from bacteria engulfed by an ancestral cell. Evidence: double membranes, own circular DNA and ribosomes."],
 [2,"Surface area-to-volume ratio","Smaller cells have more surface per unit of volume, so they exchange materials more efficiently."],
 [2,"Fluid mosaic model","The membrane is a fluid phospholipid bilayer with proteins embedded like tiles in a mosaic."],
 [2,"Facilitated diffusion","Passive movement down a gradient through a channel or carrier protein. No ATP."],
 [2,"Active transport","Moving a substance against its gradient using energy, such as the sodium-potassium pump."],
 [2,"Osmosis","Diffusion of water across a selectively permeable membrane toward lower water potential."],
 [2,"Hypertonic","A solution with more solute than the cell. The cell loses water."],
 [2,"Water potential (Ψ)","The tendency of water to move. Water flows from high Ψ to low Ψ."],
 [3,"Activation energy","The energy needed to start a reaction. Enzymes lower it."],
 [3,"Active site","The pocket on an enzyme where the substrate binds."],
 [3,"Competitive inhibitor","A molecule that blocks the active site. More substrate can outcompete it."],
 [3,"Noncompetitive inhibitor","Binds an allosteric site and changes the enzyme's shape, lowering activity even with lots of substrate."],
 [3,"Denaturation","Loss of a protein's shape (and function) from heat, pH or salt."],
 [3,"ATP","The cell's energy currency. Releasing its last phosphate releases usable energy."],
 [3,"Light reactions","Thylakoid reactions that split water, release O₂ and make ATP and NADPH."],
 [3,"Calvin cycle","Stroma reactions that use ATP and NADPH to fix CO₂ into sugar (G3P). Rubisco fixes the carbon."],
 [3,"Glycolysis","Splits glucose into two pyruvate in the cytoplasm. Net 2 ATP and 2 NADH. No oxygen needed."],
 [3,"Krebs cycle","Mitochondrial matrix cycle that releases CO₂ and loads NADH and FADH₂ with electrons."],
 [3,"Chemiosmosis","H⁺ flows down its gradient through ATP synthase, powering ATP production."],
 [3,"Fermentation","Regenerates NAD⁺ without oxygen so glycolysis can continue. Makes lactate or ethanol."],
 [4,"Ligand","A signaling molecule that binds a receptor."],
 [4,"Signal transduction","The chain of steps that turns a received signal into a cell response."],
 [4,"Second messenger","A small molecule (such as cAMP or Ca²⁺) that spreads a signal inside the cell."],
 [4,"Phosphorylation cascade","Kinases add phosphates to the next protein in line, amplifying a signal."],
 [4,"Negative feedback","A response that reverses a change, keeping conditions near a set point."],
 [4,"Positive feedback","A response that amplifies a change, such as contractions during childbirth."],
 [4,"Interphase","G1, S and G2: the cell grows and copies its DNA."],
 [4,"Mitosis","Nuclear division that makes two identical nuclei: prophase, metaphase, anaphase, telophase."],
 [4,"Cyclin","A protein whose level rises and falls through the cycle, activating CDKs."],
 [4,"Checkpoint","A control point (G1, G2, M) that stops the cycle if something is wrong."],
 [4,"Apoptosis","Programmed cell death."],
 [4,"Homeostasis","Keeping internal conditions stable."],
 [5,"Allele","A version of a gene."],
 [5,"Homozygous","Two identical alleles for a gene (AA or aa)."],
 [5,"Heterozygous","Two different alleles for a gene (Aa)."],
 [5,"Crossing over","Homologous chromosomes swap segments in prophase I, making new allele combinations."],
 [5,"Independent assortment","Homologous pairs line up randomly in metaphase I, so genes on different chromosomes sort independently."],
 [5,"Incomplete dominance","The heterozygote shows an in-between phenotype."],
 [5,"Codominance","Both alleles are fully expressed, as in AB blood type."],
 [5,"Sex-linked trait","A trait whose gene is on the X (or Y) chromosome."],
 [5,"Linked genes","Genes close together on one chromosome that tend to be inherited together."],
 [5,"Nondisjunction","Chromosomes fail to separate in meiosis, making gametes with too many or too few."],
 [5,"Chi-square test","Compares observed and expected results to judge whether differences are due to chance."],
 [6,"Semiconservative replication","Each new DNA molecule has one old strand and one new strand."],
 [6,"DNA polymerase","Builds new DNA 5′→3′ and proofreads."],
 [6,"Okazaki fragments","Short pieces of the lagging strand, later joined by ligase."],
 [6,"Transcription","Making mRNA from a DNA template. RNA polymerase does the work."],
 [6,"Intron","A non-coding section removed from pre-mRNA."],
 [6,"Codon","Three mRNA bases that code for one amino acid or a stop."],
 [6,"Anticodon","Three tRNA bases that pair with an mRNA codon."],
 [6,"Operon","A cluster of bacterial genes under one promoter and operator."],
 [6,"Transcription factor","A protein that helps turn a gene on (or off) by binding DNA."],
 [6,"Frameshift mutation","An insertion or deletion that shifts the reading frame."],
 [6,"Nonsense mutation","A point mutation that creates an early stop codon."],
 [6,"PCR","Polymerase chain reaction: makes millions of copies of a DNA segment."],
 [6,"Gel electrophoresis","Separates DNA fragments by size. Small fragments move farthest."],
 [7,"Natural selection","Individuals with heritable traits that fit the environment survive and reproduce more."],
 [7,"Fitness","Reproductive success: how many genes an individual passes on."],
 [7,"Genetic drift","Random change in allele frequencies, strongest in small populations."],
 [7,"Bottleneck effect","A disaster shrinks a population, leaving a random, less diverse set of alleles."],
 [7,"Founder effect","A small group starts a new population with different allele frequencies."],
 [7,"Gene flow","Movement of alleles between populations through migration."],
 [7,"Hardy–Weinberg equilibrium","A population whose allele frequencies don't change, because no evolution is happening."],
 [7,"Homologous structures","Similar structures from a common ancestor, possibly with different functions."],
 [7,"Analogous structures","Similar functions from convergent evolution, not shared ancestry."],
 [7,"Clade","A common ancestor and all of its descendants."],
 [7,"Allopatric speciation","New species form after a geographic barrier separates populations."],
 [7,"Prezygotic barrier","Prevents mating or fertilization, such as different mating seasons."],
 [8,"Trophic level","A step in a food chain: producers, primary consumers and so on."],
 [8,"10% rule","About 10% of energy moves up each trophic level."],
 [8,"Net primary productivity","Gross primary productivity minus the energy producers use in respiration."],
 [8,"Nitrogen fixation","Bacteria convert N₂ gas into ammonia that plants can use."],
 [8,"Carrying capacity (K)","The largest population an environment can support long term."],
 [8,"Logistic growth","Growth that slows as the population nears carrying capacity (S-curve)."],
 [8,"Density-dependent factor","A limit whose effect grows with population density, such as disease."],
 [8,"Mutualism","An interaction where both species benefit."],
 [8,"Keystone species","A species with a large effect on its community relative to its numbers."],
 [8,"Primary succession","Community development on bare rock with no soil."],
 [8,"Endotherm","An animal that keeps its body warm with metabolic heat."],
 [8,"Invasive species","A non-native species that spreads and harms its new ecosystem."],
 [4,"Xylem","Plant tissue that carries water and minerals up from the roots."],
 [4,"Phloem","Plant tissue that carries sugars from sources (leaves) to sinks (roots, fruits)."],
 [4,"Stomata","Leaf pores that let in CO₂ and let out water vapor and O₂. Guard cells open and close them."],
 [4,"Neuron","A nerve cell that sends signals with action potentials."],
 [4,"Action potential","A rapid change in membrane voltage that travels down an axon."],
 [4,"Antibody","A protein made by B cells that binds a specific antigen."]
];

window.CS_FRQS = [
 {id:"b1", title:"Enzyme activity and temperature", kind:"Long", minutes:22, units:[3,1],
  prompt:"Students measured the rate of an enzyme-catalyzed reaction at five temperatures. The rate rose from 10°C to 37°C, then fell sharply at 50°C and 60°C.",
  parts:["Describe the role of an enzyme's active site in catalysis.","Identify the independent and dependent variables, and one variable that should be held constant.","Explain why the reaction rate increases from 10°C to 37°C.","Explain why the rate decreases above 37°C, using protein structure.","Predict how adding a competitive inhibitor at 37°C would change the rate, and explain.","Propose how the students could show that the decrease at 60°C is permanent."],
  rubric:["(a) The substrate binds the active site, which fits by shape and chemistry and lowers activation energy.","(b) IV = temperature; DV = reaction rate; held constant: enzyme concentration, substrate concentration or pH.","(c) More kinetic energy means more frequent collisions between enzyme and substrate.","(d) High temperature breaks the bonds holding the tertiary structure, the active site changes shape (denaturation), and the substrate no longer fits.","(e) The rate decreases because the inhibitor competes for the active site, so fewer substrates bind.","(f) Cool the 60°C enzyme back to 37°C and measure the rate; if it stays low, the denaturation is permanent.","Data claim: the optimum is near 37°C, supported by the highest rate there."],
  sample:"The active site binds the substrate and lowers activation energy. Temperature is the independent variable and rate is the dependent variable; enzyme concentration should be held constant. From 10 to 37°C, molecules move faster and collide more often, so the rate rises. Above 37°C the heat breaks hydrogen and ionic bonds that hold the enzyme's tertiary structure, the active site changes shape and fewer substrates bind, so the rate falls. A competitive inhibitor would lower the rate by occupying active sites. To test permanence, cool the 60°C sample to 37°C and remeasure; a rate that stays low shows irreversible denaturation."},
 {id:"b2", title:"Osmosis in potato cores", kind:"Long", minutes:22, units:[2],
  prompt:"Potato cores were soaked in sucrose solutions from 0.0 M to 1.0 M for 24 hours. The percent change in mass was positive at 0.0 and 0.2 M, close to zero at 0.3 M and negative at higher concentrations.",
  parts:["Explain why the cores gained mass in 0.0 M sucrose.","Estimate the molar concentration of solutes inside the potato cells and justify it with the data.","Calculate the solute potential of a 0.3 M sucrose solution at 22°C (i = 1, R = 0.0831 L·bar/mol·K).","Explain why percent change in mass is used instead of final mass.","Predict what would happen to a plant cell placed in 1.0 M sucrose, and describe the effect on the cell."],
  rubric:["(a) Water moved into the cores by osmosis from higher water potential (pure water) to lower water potential (cell cytoplasm).","(b) About 0.3 M, where the mass change is about zero, so the water potential inside equals that outside.","(c) Ψs = −iCRT = −(1)(0.3)(0.0831)(295) ≈ −7.4 bars.","(d) Cores started at different masses, so percent change makes them comparable.","(e) The cell loses water, the membrane pulls away from the wall (plasmolysis) and turgor pressure falls."],
  sample:"Pure water has a higher water potential than potato cytoplasm, so water moved in by osmosis and the cores gained mass. The cores' solute concentration is about 0.3 M, where the line crosses zero change. Ψs = −(1)(0.3)(0.0831)(295) ≈ −7.4 bars. Percent change corrects for different starting masses. In 1.0 M sucrose the cell loses water and becomes plasmolyzed, losing turgor."},
 {id:"b3", title:"Photosynthesis rate and light", kind:"Long", minutes:22, units:[3],
  prompt:"Leaf disks were placed in bicarbonate solution under lamps at different distances. Researchers recorded the time until half the disks floated, a measure of O₂ production.",
  parts:["Explain why the leaf disks float as photosynthesis occurs.","Identify the role of the bicarbonate solution.","Predict how moving the lamp farther away changes the time to float, and justify.","Describe a control the researchers should include.","Explain how the light reactions and the Calvin cycle are linked."],
  rubric:["(a) O₂ produced by the light reactions collects in the leaf's air spaces, making the disk buoyant.","(b) It supplies CO₂ (carbon source) for the Calvin cycle.","(c) Longer time, because less light means fewer excited electrons and slower O₂ production.","(d) Disks in the dark (or without bicarbonate) to show floating depends on photosynthesis.","(e) The light reactions make ATP and NADPH that the Calvin cycle uses to fix CO₂; the Calvin cycle returns ADP and NADP⁺."],
  sample:"Splitting water releases O₂, which fills the leaf's air spaces so disks float. Bicarbonate provides CO₂ for the Calvin cycle. A farther lamp gives less light, so photosynthesis slows and floating takes longer. Disks kept in the dark are the control. The light reactions supply ATP and NADPH to the Calvin cycle, which returns ADP and NADP⁺."},
 {id:"b4", title:"Insulin signaling", kind:"Short", minutes:10, units:[4],
  prompt:"Insulin binds a receptor on muscle cells, which triggers a kinase cascade that moves glucose transporters to the cell surface.",
  parts:["Describe the type of feedback that insulin release is part of.","Explain how a kinase cascade amplifies the signal.","Predict the effect on blood glucose of a mutation that prevents the receptor from changing shape when insulin binds.","Explain why insulin cannot enter the cell to act directly."],
  rubric:["(a) Negative feedback: high blood glucose triggers insulin, which lowers glucose back toward the set point.","(b) Each activated kinase phosphorylates many molecules of the next kinase, multiplying the signal.","(c) Blood glucose stays high, because transduction never starts and transporters don't move to the membrane.","(d) Insulin is a large polar protein that can't cross the hydrophobic membrane, so it binds a surface receptor."],
  sample:"Insulin release is negative feedback: it lowers high blood glucose. Each kinase activates many copies of the next, amplifying the signal. If the receptor can't change shape, no cascade starts, no transporters move and blood glucose stays high. Insulin is large and polar, so it can't cross the membrane."},
 {id:"b5", title:"A dihybrid cross and chi-square", kind:"Long", minutes:22, units:[5],
  prompt:"In pea plants, yellow seeds (Y) are dominant to green (y) and round (R) is dominant to wrinkled (r). Two heterozygous plants (YyRr) are crossed and produce 160 offspring: 98 yellow round, 28 yellow wrinkled, 26 green round and 8 green wrinkled.",
  parts:["State the expected phenotype ratio and the expected number in each class.","Calculate χ².","With 3 degrees of freedom and p = 0.05 (critical value 7.81), state whether you reject the null hypothesis.","Explain what the result says about whether the genes assort independently.","Describe what result you would expect if the genes were tightly linked."],
  rubric:["(a) 9:3:3:1, so expected 90, 30, 30, 10.","(b) χ² = (98−90)²/90 + (28−30)²/30 + (26−30)²/30 + (8−10)²/10 ≈ 0.71 + 0.13 + 0.53 + 0.40 = 1.78.","(c) 1.78 < 7.81, so fail to reject the null hypothesis.","(d) The data fit independent assortment; differences are due to chance.","(e) Mostly parental combinations (yellow round and green wrinkled) and few recombinants, not 9:3:3:1."],
  sample:"Expected 9:3:3:1 gives 90, 30, 30, 10. χ² ≈ 0.71 + 0.13 + 0.53 + 0.40 = 1.78, below 7.81, so we fail to reject the null hypothesis: the genes assort independently. If they were linked, parental phenotypes would dominate and recombinants would be rare."},
 {id:"b6", title:"An X-linked trait", kind:"Short", minutes:10, units:[5],
  prompt:"Red-green color blindness is an X-linked recessive trait. A woman with normal vision whose father was color-blind has children with a man with normal vision.",
  parts:["Give the genotypes of the woman and the man.","Calculate the probability that their son is color-blind.","Calculate the probability that a daughter is color-blind.","Explain why X-linked recessive traits appear more often in males."],
  rubric:["(a) Woman XᴮXᵇ (carrier, from her father); man XᴮY.","(b) 1/2 of sons.","(c) 0: daughters get the father's Xᴮ.","(d) Males have one X, so a single recessive allele is expressed; females need two."],
  sample:"She is XᴮXᵇ and he is XᴮY. Each son has a 1/2 chance of color blindness; daughters receive their father's normal X, so 0. Males have only one X, so one recessive allele shows."},
 {id:"b7", title:"The lac operon", kind:"Short", minutes:10, units:[6],
  prompt:"E. coli grown with glucose and no lactose make almost no β-galactosidase. When lactose is the only sugar, enzyme levels rise quickly.",
  parts:["Describe the role of the repressor when lactose is absent.","Explain how lactose turns the operon on.","Predict enzyme levels in a mutant whose repressor cannot bind the operator, and explain.","Explain why this regulation benefits the cell."],
  rubric:["(a) The repressor binds the operator and blocks RNA polymerase.","(b) Lactose (allolactose) binds the repressor, changing its shape so it releases the operator; transcription proceeds.","(c) High levels all the time (constitutive), because nothing blocks transcription.","(d) The cell saves energy by making the enzymes only when lactose is available."],
  sample:"Without lactose, the repressor sits on the operator and blocks RNA polymerase. Allolactose binds the repressor and changes its shape, freeing the operator. A repressor that can't bind gives constant expression. Making enzymes only when needed saves energy."},
 {id:"b8", title:"A mutation in a coding sequence", kind:"Short", minutes:10, units:[6],
  prompt:"A DNA template strand reads 3′-TAC GGA CTT ATC-5′. A mutation deletes the first G.",
  parts:["Write the mRNA transcribed from the original template.","Identify the type of mutation and predict its effect on the protein.","Explain why a substitution in the third base of a codon often has no effect.","Describe one way scientists could detect this deletion."],
  rubric:["(a) 5′-AUG CCU GAA UAG-3′.","(b) Frameshift: every codon after the deletion changes, likely producing a nonfunctional protein.","(c) The code is redundant; many amino acids have several codons differing in the third base (silent mutation).","(d) Sequence the gene, or use PCR and compare fragment sizes on a gel."],
  sample:"The mRNA is 5′-AUG CCU GAA UAG-3′. Deleting a base is a frameshift that changes every downstream codon and likely ruins the protein. Third-base changes are often silent because the code is redundant. Sequencing or PCR plus a gel can detect it."},
 {id:"b9", title:"Hardy–Weinberg in a beetle population", kind:"Long", minutes:22, units:[7],
  prompt:"In a population of 1,000 beetles, 160 are green (recessive, gg) and 840 are brown. After a new predator arrives that spots green beetles easily, researchers count again five generations later.",
  parts:["Calculate q, p and the expected number of heterozygous beetles.","State two conditions of Hardy–Weinberg equilibrium.","Predict how the predator will change allele frequencies, and identify the type of selection.","Explain why the population, not individual beetles, evolves.","Describe how a small population size could change the results regardless of the predator."],
  rubric:["(a) q² = 0.16, q = 0.4, p = 0.6; 2pq = 0.48, so about 480 heterozygotes.","(b) Any two: no selection, no mutation, no gene flow, random mating, very large population.","(c) q falls and p rises; directional selection against green.","(d) Individuals' alleles don't change; allele frequencies in the population change over generations.","(e) Genetic drift could change frequencies randomly."],
  sample:"q² = 160/1000 = 0.16, so q = 0.4 and p = 0.6; 2pq = 0.48, or 480 heterozygotes. Hardy–Weinberg needs no selection and a large population, among others. The predator removes green beetles, so q falls: directional selection. Populations evolve because allele frequencies change across generations. In a small population, drift could also change frequencies by chance."},
 {id:"b10", title:"Reading a phylogenetic tree", kind:"Short", minutes:10, units:[7],
  prompt:"A cladogram shows lampreys branching first, then sharks, then frogs, with lizards and birds sharing the most recent common ancestor.",
  parts:["Identify which organism is most closely related to birds.","Identify a shared derived character for the clade of sharks, frogs, lizards and birds (not lampreys).","Explain what kind of data could be used to test this tree.","Explain why a frog is not more closely related to a shark than to a bird just because it sits closer on the diagram."],
  rubric:["(a) Lizards.","(b) Jaws.","(c) DNA or protein sequence similarities (or homologous anatomy).","(d) Relatedness comes from the most recent common ancestor; frogs share a more recent ancestor with birds than with sharks."],
  sample:"Lizards are birds' closest relatives here. Jaws are a shared derived trait of that clade. DNA sequence comparisons can test the tree. Relatedness is set by the most recent common ancestor, not by position on the page."},
 {id:"b11", title:"Energy in a food web", kind:"Long", minutes:22, units:[8],
  prompt:"In a lake, phytoplankton capture 20,000 kcal/m²/yr. Zooplankton eat phytoplankton, small fish eat zooplankton and herons eat fish.",
  parts:["Estimate the energy available to the herons.","Explain why energy decreases at each trophic level.","Predict the effect on phytoplankton if a disease kills most small fish.","Explain why removing the herons could reduce diversity in the lake.","Construct a pyramid of energy for this food chain and describe its shape."],
  rubric:["(a) 20,000 → 2,000 → 200 → 20 kcal/m²/yr for herons.","(b) Most energy is lost as heat from cellular respiration (and in waste or uneaten parts).","(c) Zooplankton increase, so phytoplankton decrease.","(d) Fish could increase and overeat, or a competitor could dominate; top predators can act as keystone species.","(e) A pyramid that narrows sharply upward, each level about 10% of the one below."],
  sample:"Using the 10% rule, herons get about 20 kcal/m²/yr. Energy is lost as heat from respiration at each step. Fewer fish means more zooplankton, so phytoplankton decline. Herons may be keystone predators that keep fish in check. The pyramid narrows at each level by about 90%."},
 {id:"b12", title:"Population growth of yeast", kind:"Short", minutes:10, units:[8],
  prompt:"Yeast in a flask of sugar water grow quickly for two days, then level off at about 600 cells per mL.",
  parts:["Identify the carrying capacity.","Calculate the growth rate dN/dt when N = 300 and r = 0.8 per day (logistic model).","Identify a density-dependent factor limiting the yeast.","Predict what happens if fresh sugar water is added."],
  rubric:["(a) K ≈ 600 cells/mL.","(b) dN/dt = 0.8 × 300 × (600 − 300)/600 = 120 cells/mL per day.","(c) Running out of sugar, or waste (ethanol) building up.","(d) Growth resumes and K may rise."],
  sample:"K is about 600 cells/mL. dN/dt = 0.8 × 300 × 0.5 = 120 cells/mL per day. Food running out and ethanol build-up are density-dependent limits. Adding sugar water would let growth resume, raising K."}
];

window.CS_MARKETS = {};
window.CS_SHIFTS = [];
window.CS_EVENTS = [];

/* ---------- diagrams (SVG). Each can take a variant number for the animated explainers. ---------- */
(function(){
const W = (title, body, h = 220) => `<svg viewBox="0 0 320 ${h}" role="img" aria-label="${title}" class="biofig"><title>${title}</title>${body}</svg>`;
const T = (x, y, s, o = "") => `<text x="${x}" y="${y}" font-size="11" fill="var(--ink)" text-anchor="middle" font-weight="700" ${o}>${s}</text>`;
const t = (x, y, s, o = "") => `<text x="${x}" y="${y}" font-size="10" fill="var(--muted)" text-anchor="middle" ${o}>${s}</text>`;
const arrow = (x1, y1, x2, y2, c = "var(--accent)") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="2.4" marker-end="url(#ah)"/>`;
const defs = c => `<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${c||"var(--accent)"}"/></marker></defs>`;
const hl = (on) => on ? `opacity="1"` : `opacity=".35"`;
window.CS_FIGS = {
  dehydration: (v = 0) => W("Dehydration synthesis and hydrolysis", defs() +
    `<g ${hl(v!==2)}><rect x="20" y="40" width="60" height="36" rx="10" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>${T(50,62,"Monomer")}
     <rect x="100" y="40" width="60" height="36" rx="10" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>${T(130,62,"Monomer")}
     ${t(84,36,"–OH  H–")}</g>
     ${arrow(170,58,205,58)}${t(188,48, v===2?"hydrolysis ←":"dehydration →")}
     <g><rect x="212" y="40" width="44" height="36" rx="10" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/><rect x="256" y="40" width="44" height="36" rx="10" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>${T(256,96,"Dimer (covalent bond)")}</g>
     <g ${hl(v!==-1)}><circle cx="190" cy="140" r="16" fill="#BAE6FD" stroke="#0284C7" stroke-width="2"/>${T(190,144,"H₂O")}${t(190,172, v===2?"water ADDED to split":"water RELEASED")}</g>
     ${t(160,205,"Polymers are built by removing water and broken by adding it")}`),
  membrane: (v = 0) => W("Phospholipid bilayer and transport", defs() +
    `${Array.from({length:14},(_,i)=>{const x=18+i*21;return `<circle cx="${x}" cy="70" r="7" fill="#FCA5A5"/><line x1="${x-2}" y1="77" x2="${x-2}" y2="104" stroke="#F59E0B" stroke-width="2"/><line x1="${x+2}" y1="77" x2="${x+2}" y2="104" stroke="#F59E0B" stroke-width="2"/><circle cx="${x}" cy="146" r="7" fill="#FCA5A5"/><line x1="${x-2}" y1="112" x2="${x-2}" y2="139" stroke="#F59E0B" stroke-width="2"/><line x1="${x+2}" y1="112" x2="${x+2}" y2="139" stroke="#F59E0B" stroke-width="2"/>`;}).join("")}
     <rect x="128" y="62" width="34" height="92" rx="12" fill="var(--mint)" opacity=".55"/>${T(145,172,"Channel")}
     <rect x="232" y="62" width="34" height="92" rx="8" fill="var(--accent)" opacity=".45"/>${T(249,172,"Pump (ATP)")}
     <g ${hl(v===0||v===1)}>${arrow(60,30,60,190,"#0284C7")}${t(60,22,"O₂, CO₂: simple diffusion")}</g>
     <g ${hl(v===0||v===2)}>${arrow(145,30,145,200,"var(--mint)")}${t(145,212,"facilitated (high → low)")}</g>
     <g ${hl(v===0||v===3)}>${arrow(249,200,249,30,"var(--accent)")}${t(255,22,"active (low → high)")}</g>
     ${t(300,64,"outside","text-anchor='end'")}${t(300,160,"inside","text-anchor='end'")}`),
  enzyme: (v = 0) => W("Activation energy with and without an enzyme", defs() +
    `<line x1="30" y1="190" x2="300" y2="190" stroke="var(--ink)" stroke-width="2"/><line x1="30" y1="190" x2="30" y2="20" stroke="var(--ink)" stroke-width="2"/>
     ${t(165,208,"Progress of reaction")}${t(16,105,"Energy","transform='rotate(-90 16 105)'")}
     <path d="M40 120 C90 120 110 30 160 30 C210 30 230 160 290 160" fill="none" stroke="var(--muted)" stroke-width="2.6" ${hl(v!==1)}/>
     ${v!==4?`<path d="M40 120 C90 120 120 80 160 80 C200 80 230 160 290 160" fill="none" stroke="var(--accent)" stroke-width="3" ${hl(v!==3)}/>${T(160,74,"with enzyme","fill='var(--accent)'")}`:""}
     ${T(160,24,"without enzyme","fill='var(--muted)'")}
     ${v===0||v===1?`<line x1="160" y1="30" x2="160" y2="80" stroke="var(--accent)" stroke-dasharray="4 3" stroke-width="2"/>${t(196,58,"lower Ea")}`:""}
     ${t(48,138,"reactants")}${t(280,178,"products")}${v===0||v===3?`<line x1="300" y1="120" x2="300" y2="160" stroke="var(--mint)" stroke-width="2" stroke-dasharray="4 3"/>${t(270,128,"ΔG same")}`:""}`),
  cellcycle: (v = 0) => { const seg = (a0, a1, col, lab, on) => { const r = 70, cx = 160, cy = 110, p = a => [cx + r*Math.cos(a), cy + r*Math.sin(a)];
      const [x0,y0] = p(a0), [x1,y1] = p(a1), big = a1 - a0 > Math.PI ? 1 : 0, [lx,ly] = [cx + 96*Math.cos((a0+a1)/2), cy + 96*Math.sin((a0+a1)/2)];
      return `<path d="M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${big} 1 ${x1} ${y1}Z" fill="${col}" ${hl(on)} stroke="var(--surface)" stroke-width="3"/>${T(lx,ly+4,lab)}`; };
    const a = d => (d - 90) * Math.PI / 180;
    return W("The cell cycle", seg(a(0),a(140),"#93C5FD","G1",v===0||v===1) + seg(a(140),a(250),"#86EFAC","S",v===0||v===2) + seg(a(250),a(315),"#FDE68A","G2",v===0||v===2) + seg(a(315),a(360),"#F9A8D4","M",v===0||v===3)
      + `<circle cx="160" cy="110" r="28" fill="var(--surface)"/>${T(160,114,"Interphase","font-size='9'")}${t(160,212,"Checkpoints at G1, G2 and M decide whether the cycle continues")}`); },
  punnett: (v = 0) => { const c = (x,y,s,h) => `<rect x="${x}" y="${y}" width="56" height="44" fill="${h?"var(--accent-soft)":"var(--surface)"}" stroke="var(--ink)" stroke-width="1.6"/>${T(x+28,y+27,s)}`;
    return W("Punnett square Aa × Aa", c(130,52,"AA",v===2)+c(186,52,"Aa",v===3)+c(130,96,"Aa",v===3)+c(186,96,"aa",v===1)
      + T(158,44,"A")+T(214,44,"a")+T(118,79,"A")+T(118,123,"a")+t(172,28,"Parent 2 gametes")+t(70,100,"Parent 1 gametes")
      + t(160,166,"Genotypes 1 AA : 2 Aa : 1 aa")+t(160,184,"Phenotypes 3 dominant : 1 recessive")+t(160,206, v===1?"aa: 1/4 chance":v===3?"Aa: 2/4 = 1/2 chance":"Each box is a 1/4 chance")); },
  dogma: (v = 0) => W("DNA to RNA to protein", defs() +
    `<g ${hl(v<=1)}><rect x="16" y="80" width="80" height="44" rx="10" fill="#DBEAFE" stroke="#2563EB" stroke-width="2"/>${T(56,106,"DNA")}${t(56,140,"nucleus")}</g>
     ${arrow(100,102,130,102)}${t(116,90,"transcription")}
     <g ${hl(v===0||v===2)}><rect x="134" y="80" width="70" height="44" rx="10" fill="#FCE7F3" stroke="#DB2777" stroke-width="2"/>${T(169,106,"mRNA")}${t(169,140,"cap, tail, splicing")}</g>
     ${arrow(208,102,238,102)}${t(224,90,"translation")}
     <g ${hl(v===0||v===3)}><rect x="242" y="80" width="66" height="44" rx="10" fill="#DCFCE7" stroke="#16A34A" stroke-width="2"/>${T(275,106,"Protein")}${t(275,140,"ribosome")}</g>
     <path d="M30 70 C30 40 60 40 60 70" fill="none" stroke="#2563EB" stroke-width="2" marker-end="url(#ah)" ${hl(v===1)}/>${v===1?t(56,32,"replication (S phase)"):""}
     ${t(160,195,"Codon on mRNA ↔ anticodon on tRNA brings each amino acid")}`),
  selection: (v = 0) => { const bell = (mu, sd, col, dash) => { const pts = []; for (let x = 20; x <= 300; x += 4) { const z = (x - mu) / sd; pts.push(`${x},${180 - 140*Math.exp(-z*z/2)}`); } return `<polyline points="${pts.join(" ")}" fill="none" stroke="${col}" stroke-width="2.6" ${dash?`stroke-dasharray="6 4"`:""}/>`; };
    const after = v === 1 ? bell(200, 34, "var(--accent)") : v === 2 ? bell(160, 20, "var(--accent)") : v === 3 ? bell(85, 22, "var(--accent)") + bell(235, 22, "var(--accent)") : "";
    return W("Modes of natural selection", `<line x1="20" y1="180" x2="300" y2="180" stroke="var(--ink)" stroke-width="2"/>${bell(160, 40, "var(--muted)", true)}${after}
      ${t(160,200,"Trait value (e.g., beak depth)")}${T(160,24, v===1?"Directional: one extreme favored":v===2?"Stabilizing: the middle favored":v===3?"Disruptive: both extremes favored":"Original population (dashed)")}`); },
  logistic: (v = 0) => { const exp = [], log = []; for (let x = 0; x <= 260; x += 5) { exp.push(`${30+x},${Math.max(10, 180 - 6*Math.exp(x/62))}`); log.push(`${30+x},${180 - 130/(1+Math.exp(-(x-110)/22))}`); }
    return W("Exponential and logistic growth", `<line x1="30" y1="180" x2="300" y2="180" stroke="var(--ink)" stroke-width="2"/><line x1="30" y1="180" x2="30" y2="10" stroke="var(--ink)" stroke-width="2"/>
      <polyline points="${exp.join(" ")}" fill="none" stroke="var(--muted)" stroke-width="2.6" ${hl(v!==2)}/><polyline points="${log.join(" ")}" fill="none" stroke="var(--accent)" stroke-width="3" ${hl(v!==1)}/>
      <line x1="30" y1="50" x2="300" y2="50" stroke="var(--mint)" stroke-dasharray="6 4" stroke-width="2" ${hl(v!==1)}/>${T(286,44,"K","fill='var(--mint)'")}
      ${t(165,200,"Time")}${t(14,96,"Population (N)","transform='rotate(-90 14 96)'")}${T(110,30,"J-curve (exponential)","fill='var(--muted)'")}
      ${v===3?`<circle cx="140" cy="115" r="5" fill="var(--accent)"/>${t(140,134,"fastest growth at K/2")}`:t(220,110,"S-curve (logistic)")}`); },
  plant: (v = 0) => W("Water and sugar transport in a plant", defs() +
    `<rect x="150" y="40" width="20" height="130" fill="#86EFAC"/><ellipse cx="110" cy="70" rx="40" ry="16" fill="#4ADE80"/><ellipse cx="210" cy="90" rx="40" ry="16" fill="#4ADE80"/>
     <path d="M160 170 L120 205 M160 170 L200 205 M160 170 L160 210" stroke="#A16207" stroke-width="4"/>
     <g ${hl(v!==2)}>${arrow(144,200,144,50,"#0284C7")}${t(96,130,"xylem: water up")}${t(96,143,"(transpiration pull)")}</g>
     <g ${hl(v!==1)}>${arrow(176,60,176,195,"#F59E0B")}${t(236,140,"phloem: sugar")}${t(236,153,"source → sink")}</g>
     ${t(110,46,"stomata release water vapor")}`)
};
})();
