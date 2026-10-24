/* Credit Sprint Chemistry: units, flashcards, FRQs and diagrams. All content is original.
   Chemistry has no supply-and-demand graphs, so CS_MARKETS / CS_SHIFTS / CS_EVENTS are empty and the graph-only
   practice modes and games are hidden. Diagrams live in CS_FIGS (SVG) and power the guides and explainers. */

window.CS_UNITS = [
 {id:1, name:"Atomic Structure and Properties", short:"Atomic structure", ap:"7–9%", clep:"8–12%", wAP:8, wCLEP:10, lab:null,
  summary:"Chemistry starts with counting: the mole links masses to numbers of particles. Atoms are built from protons, neutrons and electrons, and the arrangement of electrons, revealed by photoelectron spectra, explains the periodic trends in size, ionization energy and electronegativity.",
  points:["One mole is 6.022 × 10²³ particles. Moles = mass ÷ molar mass, and molar mass links grams to counted particles.","Empirical formulas give the simplest whole-number ratio; divide each element's moles by the smallest, then scale to whole numbers.","Isotopes have the same protons but different neutrons. Average atomic mass is the abundance-weighted mean of isotope masses, read from a mass spectrum.","Electron configurations fill 1s, 2s, 2p, 3s, 3p, 4s, 3d … (Aufbau), with Hund's rule and the Pauli principle. Cr and Cu are exceptions (half- and full-filled d).","Transition metal cations lose 4s electrons before 3d electrons.","A photoelectron spectrum shows one peak per subshell; the peak position is binding energy and the height is the number of electrons.","Coulomb's law: force ∝ q₁q₂/r². Greater nuclear charge or shorter distance means stronger attraction.","Across a period, Zeff rises: radius shrinks, ionization energy and electronegativity increase. Down a group, radius grows and ionization energy falls.","Dips in first ionization energy occur from Be to B (2p above 2s) and N to O (paired electrons repel).","A big jump in successive ionization energies shows the number of valence electrons."],
  formulas:["moles = mass ÷ molar mass","N = moles × 6.022 × 10²³","average atomic mass = Σ(isotope mass × fractional abundance)","mass % = (mass of element in one mole ÷ molar mass) × 100"],
  traps:["Cations are smaller than their atoms; anions are larger.","In an isoelectronic series, more protons means a smaller radius.","Peak height in a PES graph is the number of electrons, not their energy.","Average atomic mass is weighted by abundance, not a simple average."],
  graph:"pes"},
 {id:2, name:"Molecular and Ionic Bonding", short:"Bonding", ap:"7–9%", clep:"8–12%", wAP:8, wCLEP:10, lab:null,
  summary:"Atoms bond to reach lower energy. Ionic bonding is electrostatic attraction in a lattice, covalent bonding shares electron pairs, and metallic bonding shares a sea of electrons. Lewis structures and VSEPR predict shape and polarity, and shape explains properties.",
  points:["Ionic compounds form lattices; lattice energy rises with ion charge and falls with ion size (Coulomb's law). MgO melts far higher than NaCl.","Ionic solids are brittle and conduct only when molten or dissolved. Metals conduct, and are malleable because the electron sea holds shifting layers together.","Alloys: interstitial (small atoms in gaps, like carbon in steel) and substitutional (similar-size atoms swap, like zinc in brass).","Draw Lewis structures: count valence electrons, make bonds, complete octets, use formal charge to choose the best structure. Resonance spreads bonding over several structures.","Exceptions: BF₃ (incomplete octet), PCl₅ and SF₆ (expanded octet), NO (odd electron).","VSEPR: electron domains repel. Two domains: linear 180°. Three: trigonal planar 120°. Four: tetrahedral 109.5° (bent or pyramidal with lone pairs, smaller angles). Five: trigonal bipyramidal. Six: octahedral.","Hybridization follows domains: sp (2), sp² (3), sp³ (4). A double bond is one σ and one π; a triple bond is one σ and two π.","Bond order up means shorter and stronger bonds: C≡C < C=C < C–C in length.","A molecule is polar only if bond dipoles do not cancel. CO₂ and CCl₄ are nonpolar; H₂O and NH₃ are polar.","Network covalent solids (diamond, SiO₂) have very high melting points; graphite conducts along its layers."],
  formulas:["formal charge = valence e⁻ − nonbonding e⁻ − ½(bonding e⁻)","bond order = number of bonds between two atoms"],
  traps:["Polar bonds do not make a polar molecule if the shape is symmetric.","Electron geometry counts lone pairs; molecular geometry names only the atoms.","Ionic compounds don't conduct as solids because ions can't move.","Resonance structures are not flipping back and forth; the real bonding is an average."],
  graph:"vsepr"},
 {id:3, name:"Intermolecular Forces and Properties", short:"Intermolecular forces", ap:"18–22%", clep:"15–20%", wAP:20, wCLEP:19, lab:null,
  summary:"Forces between particles decide whether a substance is a gas, liquid or solid and how it dissolves. This unit also covers the gas laws, kinetic molecular theory, solutions and molarity, and how light is used to measure concentration.",
  points:["Forces from weakest to strongest: London dispersion (all molecules, grows with electron count), dipole-dipole, hydrogen bonding (H on N, O or F), ion-dipole.","Stronger forces mean higher boiling points, lower vapor pressure, higher viscosity and higher surface tension.","Solid types: ionic, metallic, network covalent and molecular. Their properties follow their bonding.","Like dissolves like: polar and ionic solutes dissolve in polar solvents; nonpolar in nonpolar.","Phase diagrams show the triple point and critical point. Water's solid-liquid line leans left because ice is less dense than water.","Ideal gas law PV = nRT; at STP one mole is 22.4 L. Dalton: total pressure is the sum of partial pressures.","Kinetic molecular theory: average kinetic energy depends only on temperature; at the same temperature lighter molecules move faster. Graham's law: rate ∝ 1/√M.","Real gases deviate at high pressure and low temperature.","Molarity M = moles solute ÷ liters solution; dilution M₁V₁ = M₂V₂.","Beer's law A = εbc: absorbance is proportional to concentration. UV-visible light causes electronic transitions, IR causes vibrations, and microwaves cause rotations.","Colligative properties depend on particle count: ΔTf = iKfm and ΔTb = iKbm."],
  formulas:["PV = nRT","P₁V₁/T₁ = P₂V₂/T₂","M₁V₁ = M₂V₂","A = εbc","E = hc/λ","ΔT = iKm"],
  traps:["Temperature must be in kelvin for gas laws.","Hydrogen bonds are intermolecular; they are not bonds inside a molecule.","Boiling doesn't break covalent bonds; it overcomes intermolecular forces.","Molarity uses liters of solution, not liters of solvent."],
  graph:"imf"},
 {id:4, name:"Chemical Reactions", short:"Chemical reactions", ap:"7–9%", clep:"20–25%", wAP:8, wCLEP:22, lab:null,
  summary:"Balanced equations conserve atoms and charge, and stoichiometry turns them into predictions of how much product forms. Net ionic equations show what really reacts, and oxidation numbers track electrons in redox reactions.",
  points:["Balance by atoms and charge. Types: synthesis, decomposition, single and double replacement, combustion, acid-base and redox.","Stoichiometry path: grams → moles → mole ratio → moles → grams. The limiting reactant runs out first and sets the maximum yield.","Percent yield = actual ÷ theoretical × 100.","Solubility: nitrates, group 1 and ammonium salts dissolve; most carbonates, phosphates and hydroxides do not; AgCl, PbI₂ and BaSO₄ precipitate.","Write net ionic equations by splitting strong electrolytes and cancelling spectator ions. Weak acids and bases stay as molecules.","Oxidation is loss of electrons (OIL), reduction is gain (RIG). The oxidizing agent is reduced; the reducing agent is oxidized.","Acid-base titration: moles acid × H⁺ per acid = moles base × OH⁻ per base at the equivalence point.","Heating a hydrate to constant mass finds the water of hydration.","Descriptive chemistry: alkali metals react with water to give H₂ and a hydroxide; halogens displace weaker halogens; flame tests identify cations; carbonates fizz with acid; ammonium releases NH₃ with base."],
  formulas:["percent yield = (actual ÷ theoretical) × 100","M_acid V_acid (n_H⁺) = M_base V_base (n_OH⁻)","sum of oxidation numbers = charge on the species"],
  traps:["Use the limiting reactant, not whichever amount is smaller in grams.","Spectator ions don't appear in the net ionic equation.","A diprotic acid needs two moles of OH⁻ per mole.","Don't split weak electrolytes or insoluble solids into ions."],
  graph:"stoich"},
 {id:5, name:"Kinetics", short:"Kinetics", ap:"7–9%", clep:"3–5%", wAP:8, wCLEP:4, lab:null,
  summary:"Kinetics is about how fast reactions go. Collision theory, activation energy, rate laws and mechanisms explain what controls speed, and the integrated rate laws let you predict concentrations over time.",
  points:["Rate = k[A]ᵐ[B]ⁿ; orders are found from experiments (initial rates), never from the balanced equation.","The rate constant k depends on temperature and catalyst, not concentration.","Units of k: zero order M/s, first order s⁻¹, second order M⁻¹s⁻¹.","Integrated laws: zero [A] = [A]₀ − kt; first ln[A] = ln[A]₀ − kt; second 1/[A] = 1/[A]₀ + kt. The linear plot identifies the order.","First-order half-life t½ = 0.693/k is constant. Zero-order half-life shrinks as [A] falls; second-order half-life grows.","Collision theory: collisions need enough energy (Ea) and the right orientation. Higher temperature, higher concentration and more surface area increase the rate.","A catalyst lowers Ea by offering a new pathway; it does not change ΔH or K.","Mechanisms: the slowest elementary step sets the rate. Intermediates are made and used; catalysts are used and regenerated.","Reaction coordinate diagrams show Ea, ΔH, the transition state and intermediates (valleys between peaks)."],
  formulas:["rate = k[A]ᵐ[B]ⁿ","ln[A] = ln[A]₀ − kt","t½ = 0.693/k (first order)","ln k = −Ea/RT + ln A"],
  traps:["Orders come from data, not coefficients (except for elementary steps).","A catalyst changes speed, not the equilibrium position or ΔH.","Intermediates cancel out of the overall equation; catalysts appear on both sides of steps.","ln[A] vs t is linear only for first-order reactions."],
  graph:"rxn"},
 {id:6, name:"Thermodynamics", short:"Thermodynamics", ap:"7–9%", clep:"4–6%", wAP:8, wCLEP:5, lab:null,
  summary:"Thermodynamics tracks energy changes. Heat is energy moved by a temperature difference, enthalpy is the heat at constant pressure, and Hess's law, formation enthalpies and bond energies let you calculate ΔH without measuring it.",
  points:["Temperature measures average kinetic energy; heat q is energy transferred because of a temperature difference.","q = mcΔT. Heat lost by the hot object equals heat gained by the cold one at equilibrium.","Exothermic: ΔH < 0, heat leaves the system, surroundings warm up. Endothermic: ΔH > 0.","During a phase change temperature is constant; energy changes the potential energy of the particles (q = nΔHfus or nΔHvap).","Hess's law: ΔH is a state function. Reverse an equation and the sign flips; multiply an equation and ΔH multiplies.","ΔH°rxn = ΣΔH°f(products) − ΣΔH°f(reactants). ΔH°f of an element in its standard state is zero.","Bond energies: ΔH ≈ Σ(bonds broken) − Σ(bonds formed). Breaking bonds is endothermic.","Calorimetry measures q for a reaction from the temperature change of a known mass of water.","First law: ΔU = q + w; energy is conserved."],
  formulas:["q = mcΔT","q = nΔH(phase change)","ΔH°rxn = ΣΔH°f(products) − ΣΔH°f(reactants)","ΔH ≈ Σ(bonds broken) − Σ(bonds formed)"],
  traps:["Reversing a reaction changes the sign of ΔH.","The coffee-cup calorimeter measures the surroundings, so q_rxn = −q_solution.","Bond energy calculations are only estimates.","Temperature doesn't change during melting or boiling."],
  graph:"heating"},
 {id:7, name:"Equilibrium", short:"Equilibrium", ap:"7–9%", clep:"6–8%", wAP:8, wCLEP:7, lab:null,
  summary:"At equilibrium the forward and reverse rates are equal and concentrations stop changing. The equilibrium constant K sizes up how far a reaction goes, Q compares the current mixture with K, and Le Chatelier's principle predicts how a stress shifts the system.",
  points:["K = [products]^coefficients ÷ [reactants]^coefficients. Solids and pure liquids are left out.","K > 1 favors products; K < 1 favors reactants. K depends only on temperature.","Compare Q with K: Q < K shifts forward; Q > K shifts reverse; Q = K is equilibrium.","Reverse a reaction: K → 1/K. Multiply coefficients by n: K → Kⁿ. Add reactions: multiply their K values.","Kp = Kc(RT)^Δn, where Δn is the change in moles of gas.","Le Chatelier: adding a reactant or removing a product shifts forward; higher pressure favors the side with fewer gas moles; heating favors the endothermic direction.","A catalyst or inert gas (at constant volume) doesn't shift equilibrium.","ICE tables (Initial, Change, Equilibrium) solve for unknown concentrations.","Ksp for slightly soluble salts: AgCl s², PbI₂ 4s³. A common ion lowers solubility; acid raises the solubility of salts of weak-acid anions."],
  formulas:["K = [C]ᶜ[D]ᵈ ÷ [A]ᵃ[B]ᵇ","Kp = Kc(RT)^Δn","Ksp = [cation]ᵃ[anion]ᵇ"],
  traps:["Changing concentration or pressure changes Q, not K.","Pure solids and liquids don't appear in K.","A large K says nothing about speed.","Temperature is the only thing that changes K."],
  graph:"equil"},
 {id:8, name:"Acids and Bases", short:"Acids and bases", ap:"11–15%", clep:"3–6%", wAP:13, wCLEP:5, lab:null,
  summary:"Acids donate protons and bases accept them. pH, Ka and Kb describe strength, buffers resist pH change, and titration curves show how a solution changes as acid and base are mixed.",
  points:["pH = −log[H⁺]; pOH = −log[OH⁻]; pH + pOH = 14.00 at 25 °C. Each pH unit is a tenfold change in [H⁺].","Strong acids and bases ionize completely: [H⁺] or [OH⁻] equals the concentration (watch the formula, as in Ba(OH)₂).","Weak acids: Ka = [H⁺][A⁻]/[HA]; for a small x, [H⁺] ≈ √(Ka·C).","Conjugate pair: Ka × Kb = Kw = 1.0 × 10⁻¹⁴. The conjugate base of a strong acid is negligibly basic.","Acid strength: HI > HBr > HCl for binary acids (bond strength); more oxygens on the central atom means a stronger oxyacid.","Salt solutions: cation of a weak base is acidic (NH₄⁺), anion of a weak acid is basic (F⁻, CH₃COO⁻); ions of strong acids and bases are neutral.","Buffers (weak acid plus conjugate base): pH = pKa + log([A⁻]/[HA]). Best near pH = pKa, with high concentrations.","Titrations: the equivalence point of a strong-strong titration is pH 7; weak acid with strong base is above 7. At half-equivalence pH = pKa.","Choose an indicator whose color change brackets the equivalence-point pH.","Lewis acids accept electron pairs; Lewis bases donate them."],
  formulas:["pH = −log[H⁺]","Kw = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴","pH = pKa + log([A⁻]/[HA])","Ka × Kb = Kw"],
  traps:["pH of a weak acid isn't −log of its concentration.","Equivalence point and endpoint are not the same thing.","Diluting a weak acid raises its percent ionization even though pH rises.","Neutral pH is 7.00 only at 25 °C."],
  graph:"titr"},
 {id:9, name:"Applications of Thermodynamics", short:"Entropy and electrochemistry", ap:"7–9%", clep:"2–4%", wAP:8, wCLEP:3, lab:null,
  summary:"Entropy and free energy tell you whether a process is spontaneous and how far it goes. Electrochemistry connects free energy to cell potential and lets you predict batteries and electrolysis.",
  points:["Entropy S measures dispersal of matter and energy: gas > liquid > solid, more moles of gas, dissolving and mixing raise it.","Second law: a spontaneous process increases the entropy of the universe.","Gibbs: ΔG = ΔH − TΔS. Spontaneous when ΔG < 0. (−,+) always spontaneous; (+,−) never; (−,−) at low T; (+,+) at high T.","ΔG° = −RT ln K. K > 1 means ΔG° < 0. ΔG = ΔG° + RT ln Q; at equilibrium ΔG = 0.","Thermodynamically favorable doesn't mean fast.","Galvanic cells: oxidation at the anode, reduction at the cathode; electrons flow anode → cathode; the salt bridge balances charge.","E°cell = E°cathode − E°anode. Positive E°cell means spontaneous. ΔG° = −nFE°.","Nernst: E = E° − (0.0592/n) log Q at 25 °C. A cell at equilibrium has E = 0.","Electrolysis forces a nonspontaneous reaction: moles of electrons = I·t ÷ 96,485.","Concentration cells have E° = 0; the dilute half-cell is the anode."],
  formulas:["ΔG = ΔH − TΔS","ΔG° = −RT ln K","ΔG° = −nFE°","E = E° − (0.0592/n) log Q","moles e⁻ = It/F, F = 96,485 C/mol"],
  traps:["Convert ΔS from J/K to kJ/K before using ΔG = ΔH − TΔS.","Don't multiply E° by the coefficients when balancing half-reactions.","In every cell, oxidation is at the anode and reduction is at the cathode.","A dead battery has Q = K and E = 0."],
  graph:"galv"}
];

window.CS_CARDS_RAW = [
 [1,"Mole","6.022 × 10²³ particles. The mass of one mole in grams equals the formula mass in u."],
 [1,"Molar mass","Mass in grams of one mole of a substance (g/mol)."],
 [1,"Empirical formula","The simplest whole-number ratio of atoms in a compound."],
 [1,"Isotopes","Atoms with the same number of protons but different numbers of neutrons."],
 [1,"Average atomic mass","Abundance-weighted mean of isotope masses."],
 [1,"Aufbau principle","Electrons fill the lowest-energy available subshells first."],
 [1,"Hund's rule","Electrons occupy separate orbitals of a subshell with parallel spins before pairing."],
 [1,"Pauli exclusion principle","No two electrons in an atom share all four quantum numbers; an orbital holds at most two electrons with opposite spins."],
 [1,"Valence electrons","Electrons in the outermost energy level; they take part in bonding."],
 [1,"Photoelectron spectrum","A plot of binding energy versus number of electrons; each peak is a subshell."],
 [1,"Coulomb's law","Force between charges is proportional to q₁q₂/r²."],
 [1,"Effective nuclear charge (Zeff)","The net pull on a valence electron: nuclear charge minus shielding by core electrons."],
 [1,"First ionization energy","Energy to remove one electron from a gaseous atom; increases across a period and decreases down a group."],
 [1,"Electronegativity","An atom's tendency to attract bonding electrons; highest for fluorine."],
 [1,"Isoelectronic","Having the same number of electrons."],
 [2,"Ionic bond","Electrostatic attraction between cations and anions in a lattice."],
 [2,"Lattice energy","Energy released when gaseous ions form a solid; larger with higher charges and smaller ions."],
 [2,"Covalent bond","A shared pair of electrons between atoms."],
 [2,"Metallic bond","Attraction between metal cations and a sea of delocalized electrons."],
 [2,"Lewis structure","A diagram of bonds and lone pairs showing valence electrons."],
 [2,"Formal charge","Valence electrons − nonbonding electrons − half the bonding electrons."],
 [2,"Resonance","Two or more valid Lewis structures for one species; the real structure is a hybrid."],
 [2,"VSEPR","Electron domains around a central atom repel and arrange to be as far apart as possible."],
 [2,"Bond angle for tetrahedral electron geometry","109.5°; lone pairs squeeze the bond angles smaller."],
 [2,"Hybridization","Mixing of atomic orbitals: sp (linear), sp² (trigonal planar), sp³ (tetrahedral)."],
 [2,"Sigma and pi bonds","Sigma: head-on overlap, one per bond. Pi: sideways p overlap, found in double and triple bonds."],
 [2,"Polar molecule","A molecule whose bond dipoles do not cancel, giving a net dipole."],
 [2,"Interstitial alloy","Small atoms fill gaps in a metal lattice, as carbon does in steel."],
 [2,"Network covalent solid","Atoms joined in a continuous covalent lattice: very hard and high melting, like diamond."],
 [3,"London dispersion forces","Attractions from temporary dipoles; present in all molecules and stronger with more electrons."],
 [3,"Hydrogen bonding","Strong dipole attraction when H is bonded to N, O or F and is attracted to a lone pair on another molecule."],
 [3,"Ion-dipole force","Attraction between an ion and a polar molecule, as when salt dissolves in water."],
 [3,"Vapor pressure","The pressure of vapor in equilibrium with its liquid; lower when intermolecular forces are stronger."],
 [3,"Triple point","The temperature and pressure at which solid, liquid and gas coexist."],
 [3,"Ideal gas law","PV = nRT."],
 [3,"STP molar volume","22.4 L per mole of an ideal gas at 0 °C and 1 atm."],
 [3,"Dalton's law","Total pressure is the sum of the partial pressures of the gases."],
 [3,"Graham's law","Rates of effusion are inversely proportional to the square root of molar mass."],
 [3,"Kinetic molecular theory","Gas particles move randomly; average kinetic energy is proportional to Kelvin temperature."],
 [3,"Molarity","Moles of solute per liter of solution."],
 [3,"Dilution equation","M₁V₁ = M₂V₂."],
 [3,"Beer's law","Absorbance is proportional to concentration: A = εbc."],
 [3,"Colligative property","A property that depends on the number of dissolved particles, such as freezing point depression."],
 [3,"van't Hoff factor (i)","The number of particles a solute produces per formula unit in solution."],
 [4,"Limiting reactant","The reactant that runs out first and limits the amount of product."],
 [4,"Percent yield","Actual yield ÷ theoretical yield × 100."],
 [4,"Net ionic equation","An equation showing only the species that actually change, with spectator ions removed."],
 [4,"Spectator ion","An ion present in solution but unchanged by the reaction."],
 [4,"Precipitate","An insoluble solid formed when solutions are mixed."],
 [4,"Oxidation","Loss of electrons; oxidation number increases."],
 [4,"Reduction","Gain of electrons; oxidation number decreases."],
 [4,"Oxidizing agent","The species that is reduced and takes electrons from another."],
 [4,"Titration","A technique that finds an unknown concentration by reacting it with a solution of known concentration."],
 [4,"Equivalence point","The point at which moles of acid and base are stoichiometrically equal."],
 [4,"Primary standard","A pure, stable solid of known formula used to prepare a solution of exactly known concentration."],
 [5,"Rate law","An equation relating rate to reactant concentrations: rate = k[A]ᵐ[B]ⁿ."],
 [5,"Reaction order","The exponent of a concentration in the rate law, found from experiments."],
 [5,"First-order half-life","t½ = 0.693/k; constant, independent of concentration."],
 [5,"Activation energy","The minimum energy that colliding particles need to react."],
 [5,"Catalyst","A substance that speeds a reaction by lowering Ea without being consumed."],
 [5,"Intermediate","A species made in one step of a mechanism and used up in a later step."],
 [5,"Rate-determining step","The slowest elementary step; it sets the rate law."],
 [5,"Collision theory","Reactions need collisions with enough energy and the correct orientation."],
 [5,"Arrhenius equation","k = Ae^(−Ea/RT); k increases with temperature."],
 [6,"Enthalpy change (ΔH)","Heat transferred at constant pressure; negative for exothermic reactions."],
 [6,"Specific heat capacity","Heat needed to raise 1 g of a substance by 1 °C; q = mcΔT."],
 [6,"Hess's law","The enthalpy change of a reaction equals the sum of the enthalpy changes of its steps."],
 [6,"Standard enthalpy of formation","Enthalpy change to form 1 mol of a compound from its elements in standard states."],
 [6,"Bond energy","Energy needed to break one mole of a bond; breaking is endothermic."],
 [6,"Calorimetry","Measuring heat transfer from the temperature change of a known mass."],
 [6,"State function","A property that depends only on the current state, like enthalpy or entropy."],
 [6,"First law of thermodynamics","Energy is conserved: ΔU = q + w."],
 [7,"Equilibrium","A state in which forward and reverse rates are equal and concentrations are constant."],
 [7,"Equilibrium constant (K)","Ratio of product to reactant concentrations, each raised to its coefficient."],
 [7,"Reaction quotient (Q)","Same expression as K evaluated at any moment; compare with K to predict direction."],
 [7,"Le Chatelier's principle","A system at equilibrium shifts to counteract an applied stress."],
 [7,"Common ion effect","Adding an ion already in the equilibrium lowers solubility of a salt."],
 [7,"Solubility product (Ksp)","The equilibrium constant for dissolving a slightly soluble salt."],
 [7,"ICE table","Initial, Change, Equilibrium table used to solve equilibrium problems."],
 [7,"What changes K?","Only temperature changes K."],
 [8,"pH","−log[H⁺]; below 7 is acidic at 25 °C."],
 [8,"Brønsted-Lowry acid","A proton donor."],
 [8,"Conjugate acid-base pair","Two species that differ by one proton."],
 [8,"Ka × Kb","Equals Kw = 1.0 × 10⁻¹⁴ for a conjugate pair."],
 [8,"Buffer","A solution of a weak acid and its conjugate base that resists changes in pH."],
 [8,"Henderson-Hasselbalch","pH = pKa + log([A⁻]/[HA])."],
 [8,"Half-equivalence point","Where [HA] = [A⁻], so pH = pKa."],
 [8,"Amphiprotic","Can act as an acid or a base, like HCO₃⁻ or H₂O."],
 [8,"Lewis acid","An electron-pair acceptor."],
 [8,"Percent ionization","[H⁺] at equilibrium ÷ initial acid concentration × 100."],
 [8,"Indicator","A weak acid whose color changes over a pH range near the equivalence point."],
 [9,"Entropy (S)","A measure of the dispersal of matter and energy; gases have the most."],
 [9,"Gibbs free energy","ΔG = ΔH − TΔS; negative means spontaneous."],
 [9,"Spontaneous process","One that occurs without continuous outside input; says nothing about speed."],
 [9,"ΔG° and K","ΔG° = −RT ln K."],
 [9,"Galvanic cell","A cell that uses a spontaneous redox reaction to produce electricity."],
 [9,"Anode","The electrode where oxidation occurs."],
 [9,"Cathode","The electrode where reduction occurs."],
 [9,"Standard cell potential","E°cell = E°cathode − E°anode."],
 [9,"Nernst equation","E = E° − (0.0592/n) log Q at 25 °C."],
 [9,"Faraday constant","96,485 C per mole of electrons."],
 [9,"Electrolysis","Using electrical energy to drive a nonspontaneous redox reaction."],
 [9,"Sacrificial anode","A more active metal that corrodes in place of a protected metal."]
];

window.CS_FRQS = [
 {id:"c1", title:"Percent composition and a hydrate", kind:"Short", minutes:12, units:[1,4],
  prompt:"A student heats 4.20 g of a hydrate of magnesium sulfate, MgSO₄·xH₂O, until the mass is constant at 2.05 g (anhydrous MgSO₄, molar mass 120.4 g/mol). The molar mass of water is 18.02 g/mol.",
  parts:["Calculate the mass of water lost.","Calculate the moles of water lost and the moles of MgSO₄ remaining.","Determine the value of x.","Calculate the mass percent of water in the hydrate.","The student failed to heat to constant mass. Explain how this affects the calculated value of x."],
  rubric:["(a) 4.20 − 2.05 = 2.15 g.","(b) Water: 2.15 ÷ 18.02 = 0.119 mol. MgSO₄: 2.05 ÷ 120.4 = 0.0170 mol.","(c) 0.119 ÷ 0.0170 = 7.0, so x = 7.","(d) 2.15 ÷ 4.20 × 100 = 51.2%.","(e) Water remains, so the mass lost is too small and the calculated x is too low."],
  sample:"(a) The mass of water lost is 2.15 g. (b) 0.119 mol H₂O and 0.0170 mol MgSO₄. (c) The ratio is 7.0, so x = 7. (d) 51.2% water. (e) If the sample is not heated to constant mass, some water is still in the crucible, so the measured mass loss is too small and x comes out too low."},
 {id:"c2", title:"Photoelectron spectrum and periodic trends", kind:"Short", minutes:10, units:[1],
  prompt:"The photoelectron spectrum of element X shows peaks at binding energies of 1040, 87, 6.5 and 3.2 MJ/mol with relative heights 2 : 2 : 6 : 2.",
  parts:["Write the ground-state electron configuration of X and identify the element.","Explain why the peak at 1040 MJ/mol appears at a much higher binding energy than the peak at 3.2 MJ/mol.","Predict whether the atomic radius of X is larger or smaller than that of sodium. Justify your answer.","Predict whether the first ionization energy of X is larger or smaller than that of aluminum, and explain."],
  rubric:["(a) 1s² 2s² 2p⁶ 3s²; magnesium.","(b) 1s electrons are closest to the nucleus and feel the greatest attraction (Coulomb's law), so they are hardest to remove.","(c) Smaller: Mg has one more proton than Na with electrons in the same shell, so Zeff is greater and the electrons are pulled in.","(d) Larger: Mg's 3s electron is removed from a full 3s subshell; Al's 3p electron is higher in energy and slightly shielded by the 3s electrons."],
  sample:"(a) 1s²2s²2p⁶3s², magnesium. (b) The 1s electrons are closest to the nucleus, so Coulomb attraction is greatest and the binding energy is highest. (c) Mg is smaller than Na because it has one more proton while its valence electrons are in the same shell, so Zeff is larger. (d) Mg's first IE is larger than Al's: Al's 3p electron is higher in energy and shielded by the 3s electrons."},
 {id:"c3", title:"Lewis structures and shape", kind:"Short", minutes:10, units:[2],
  prompt:"Consider the molecules SO₂, SF₄ and CCl₄.",
  parts:["Draw the Lewis structure of SF₄ and state the molecular geometry.","State the approximate Cl–C–Cl bond angle in CCl₄ and the hybridization of carbon.","Explain why CCl₄ is nonpolar even though its C–Cl bonds are polar.","SO₂ has a bent shape while CO₂ is linear. Explain the difference."],
  rubric:["(a) Five electron domains on S (four bonds and one lone pair); see-saw geometry.","(b) 109.5°; sp³.","(c) The tetrahedral shape is symmetric, so the four bond dipoles cancel.","(d) S in SO₂ has three domains including a lone pair, giving a bent shape; C in CO₂ has two domains with no lone pairs, giving a linear shape."],
  sample:"(a) Sulfur has 34 valence electrons around the molecule's Lewis structure: four S–F bonds and one lone pair on S, trigonal bipyramidal electron geometry with a see-saw molecular shape. (b) 109.5° and sp³. (c) The bond dipoles are equal and point toward the corners of a tetrahedron, so they cancel. (d) SO₂ has a lone pair on S as the third domain, so the shape is bent; CO₂ has only two domains, so it is linear."},
 {id:"c4", title:"Intermolecular forces and boiling points", kind:"Short", minutes:10, units:[3],
  prompt:"The normal boiling points are: CH₄ −162 °C, C₂H₆ −89 °C, CH₃OH 65 °C and H₂O 100 °C.",
  parts:["Explain why the boiling point of C₂H₆ is higher than that of CH₄.","Identify the strongest intermolecular force in CH₃OH.","Explain why water has a higher boiling point than methanol.","Predict whether CH₃OH or C₂H₆ is more soluble in water, and justify your answer."],
  rubric:["(a) C₂H₆ has more electrons, so its electron cloud is more polarizable and its dispersion forces are stronger.","(b) Hydrogen bonding.","(c) Each water molecule can form up to four hydrogen bonds (two donated, two accepted); methanol has only one O–H, so fewer hydrogen bonds per molecule.","(d) CH₃OH, because it can hydrogen bond with water; C₂H₆ is nonpolar and has only weak interactions with water."],
  sample:"(a) Ethane has more electrons so stronger London dispersion forces. (b) Hydrogen bonding through the O–H group. (c) Water forms more hydrogen bonds per molecule than methanol. (d) Methanol is more soluble because it forms hydrogen bonds with water, while nonpolar ethane does not."},
 {id:"c5", title:"Gas laws and a gas mixture", kind:"Long", minutes:20, units:[3],
  prompt:"A rigid 5.00 L container holds 0.200 mol N₂ and 0.300 mol O₂ at 300. K. (R = 0.08206 L·atm/mol·K.)",
  parts:["Calculate the total pressure in the container.","Calculate the partial pressure of N₂.","The temperature is raised to 450. K. Calculate the new total pressure and explain the change in terms of particle motion.","Which gas has the greater average speed at 300. K? Justify your answer.","A small hole lets gas escape slowly into a vacuum. Calculate the ratio of the effusion rate of N₂ to that of O₂.","Explain why a real gas deviates from ideal behavior at high pressure."],
  rubric:["(a) P = nRT/V = (0.500)(0.08206)(300)/5.00 = 2.46 atm.","(b) 0.200/0.500 × 2.46 = 0.985 atm.","(c) P = 2.46 × 450/300 = 3.69 atm; molecules move faster, so they collide with the walls more often and with more force.","(d) N₂, because at the same temperature the lighter molecules have the higher average speed.","(e) rate N₂ / rate O₂ = √(32.0/28.0) = 1.07.","(f) At high pressure the particles are close together, so their volume and attractive forces are no longer negligible."],
  sample:"(a) 2.46 atm. (b) 0.985 atm. (c) 3.69 atm, because higher temperature means faster molecules and more frequent, harder collisions. (d) N₂ is faster since it has the lower molar mass at the same average kinetic energy. (e) √(32.0/28.0) = 1.07. (f) At high pressure the molecules are close, so their own volume and the attractions between them matter."},
 {id:"c6", title:"Stoichiometry and limiting reactant", kind:"Long", minutes:20, units:[4],
  prompt:"Aluminum reacts with chlorine: 2 Al(s) + 3 Cl₂(g) → 2 AlCl₃(s). A student reacts 5.40 g of Al (26.98 g/mol) with 14.2 g of Cl₂ (70.90 g/mol).",
  parts:["Determine the limiting reactant.","Calculate the theoretical yield of AlCl₃ (133.3 g/mol).","The student obtains 17.8 g of AlCl₃. Calculate the percent yield.","Calculate the mass of the excess reactant that remains.","Write a net ionic equation for what happens when aqueous AlCl₃ is mixed with excess aqueous NaOH, and explain why the solid is insoluble."],
  rubric:["(a) Al: 0.200 mol; Cl₂: 0.200 mol. Al needs 0.300 mol Cl₂, so Cl₂ is limiting.","(b) 0.200 mol Cl₂ × (2/3) = 0.133 mol AlCl₃ = 17.8 g.","(c) 17.8 ÷ 17.8 × 100 = 100% (within rounding).","(d) Al used = 0.133 mol; remaining 0.0667 mol = 1.80 g.","(e) Al³⁺(aq) + 3 OH⁻(aq) → Al(OH)₃(s). Hydroxides of most metal ions are insoluble."],
  sample:"(a) 0.200 mol each, but Al needs 0.300 mol Cl₂ so Cl₂ is limiting. (b) 17.8 g. (c) 100%. (d) 1.80 g of Al remains. (e) Al³⁺ + 3 OH⁻ → Al(OH)₃(s); metal hydroxides are generally insoluble."},
 {id:"c7", title:"Titration of a weak acid", kind:"Long", minutes:22, units:[8,4],
  prompt:"A 25.00 mL sample of 0.100 M acetic acid (Ka = 1.8 × 10⁻⁵) is titrated with 0.100 M NaOH.",
  parts:["Calculate the pH of the acetic acid before any NaOH is added.","Calculate the volume of NaOH needed to reach the equivalence point.","Determine the pH at the half-equivalence point.","Predict whether the pH at the equivalence point is less than, equal to, or greater than 7, and explain.","Name an indicator that would work and justify the choice.","A student adds 5.00 mL of NaOH to a fresh 25.00 mL sample. Explain why this mixture resists pH change when a small amount of acid is added."],
  rubric:["(a) [H⁺] = √(1.8×10⁻⁵ × 0.100) = 1.3×10⁻³ M; pH = 2.87.","(b) 25.00 mL, since the concentrations are equal and the acid is monoprotic.","(c) 12.50 mL of NaOH; pH = pKa = 4.74.","(d) Greater than 7: acetate is a weak base that hydrolyzes to form OH⁻.","(e) Phenolphthalein (color change near pH 8–10), whose range includes the equivalence-point pH.","(f) The mixture contains both acetic acid and acetate; acetate consumes added H⁺."],
  sample:"(a) pH 2.87. (b) 25.00 mL. (c) At half-equivalence [HA] = [A⁻], so pH = pKa = 4.74. (d) Greater than 7 because acetate hydrolyzes: C₂H₃O₂⁻ + H₂O ⇌ HC₂H₃O₂ + OH⁻. (e) Phenolphthalein changes color around pH 8–10, bracketing the equivalence point. (f) The solution is a buffer: acetate reacts with added H⁺, so the pH changes little."},
 {id:"c8", title:"Rate law from initial rates", kind:"Long", minutes:20, units:[5],
  prompt:"The reaction 2 NO(g) + O₂(g) → 2 NO₂(g) was studied. Initial rates: Trial 1, [NO] = 0.020 M, [O₂] = 0.010 M, rate = 7.0 × 10⁻⁵ M/s. Trial 2, [NO] = 0.040 M, [O₂] = 0.010 M, rate = 2.8 × 10⁻⁴ M/s. Trial 3, [NO] = 0.040 M, [O₂] = 0.020 M, rate = 5.6 × 10⁻⁴ M/s.",
  parts:["Determine the order with respect to NO and with respect to O₂.","Write the rate law and state the overall order.","Calculate the value of k, with units.","Predict the rate when [NO] = 0.030 M and [O₂] = 0.015 M.","A proposed mechanism has a fast first step 2 NO ⇌ N₂O₂ and a slow second step N₂O₂ + O₂ → 2 NO₂. Show that this mechanism is consistent with the rate law.","Explain what a catalyst does to the energy diagram of this reaction."],
  rubric:["(a) Doubling [NO] quadruples the rate: second order in NO. Doubling [O₂] doubles the rate: first order in O₂.","(b) rate = k[NO]²[O₂]; third order overall.","(c) k = 7.0×10⁻⁵ ÷ (0.020² × 0.010) = 17.5 M⁻²s⁻¹.","(d) rate = 17.5 × (0.030)² × (0.015) = 2.4 × 10⁻⁴ M/s.","(e) The slow step gives rate = k₂[N₂O₂][O₂]; the fast equilibrium gives [N₂O₂] = K[NO]², so rate = k₂K[NO]²[O₂].","(f) It lowers the activation energy by providing a new pathway; reactants and products are unchanged."],
  sample:"(a) Second order in NO, first order in O₂. (b) rate = k[NO]²[O₂], third order. (c) k = 17.5 M⁻²s⁻¹. (d) 2.4 × 10⁻⁴ M/s. (e) Rate = k₂[N₂O₂][O₂], and the fast equilibrium gives [N₂O₂] = K[NO]², so rate = k₂K[NO]²[O₂], matching the experiment. (f) A catalyst lowers the activation energy without changing the energies of reactants and products."},
 {id:"c9", title:"Calorimetry and Hess's law", kind:"Long", minutes:22, units:[6],
  prompt:"A student mixes 50.0 mL of 1.00 M HCl and 50.0 mL of 1.00 M NaOH, both at 21.0 °C, in a coffee-cup calorimeter. The final temperature is 27.7 °C. Assume the solution has density 1.00 g/mL and c = 4.18 J/g·°C, and that the calorimeter absorbs no heat.",
  parts:["Calculate the heat released by the reaction.","Calculate ΔH in kJ per mole of water formed.","Explain how the result would change if the calorimeter absorbed some heat.","Given C(s) + O₂ → CO₂, ΔH = −393.5 kJ, and 2 CO + O₂ → 2 CO₂, ΔH = −566.0 kJ, calculate ΔH for 2 C(s) + O₂(g) → 2 CO(g).","Use bond energies (C–H 413, O=O 498, C=O 799, O–H 463 kJ/mol) to estimate ΔH for CH₄ + 2 O₂ → CO₂ + 2 H₂O."],
  rubric:["(a) q = (100.0)(4.18)(6.7) = 2.8 × 10³ J.","(b) 0.0500 mol; ΔH = −2.8 kJ/0.0500 = −56 kJ/mol.","(c) Less heat would be measured in the solution, so the calculated |ΔH| would be too small.","(d) 2(−393.5) − (−566.0) = −221.0 kJ.","(e) Bonds broken: 4(413) + 2(498) = 2648. Bonds formed: 2(799) + 4(463) = 3450. ΔH = −802 kJ."],
  sample:"(a) 2.8 kJ released. (b) −56 kJ/mol. (c) Some heat would go into the calorimeter, so the measured temperature rise is smaller and |ΔH| is too small. (d) −221.0 kJ. (e) 2648 − 3450 = −802 kJ."},
 {id:"c10", title:"Equilibrium and Le Chatelier", kind:"Long", minutes:22, units:[7],
  prompt:"At 700 K, H₂(g) + I₂(g) ⇌ 2 HI(g) has Kc = 54. A 1.00 L vessel is filled with 1.00 mol H₂ and 1.00 mol I₂.",
  parts:["Write the equilibrium constant expression.","Calculate the equilibrium concentration of HI.","The reaction is exothermic. Predict the effect of raising the temperature on K and on the amount of HI.","Explain the effect of doubling the volume of the vessel at constant temperature.","A catalyst is added. Describe its effect on K and on the time needed to reach equilibrium.","Calculate Q for a mixture with [H₂] = 0.50 M, [I₂] = 0.50 M, [HI] = 4.0 M and predict the direction of change."],
  rubric:["(a) Kc = [HI]² ÷ ([H₂][I₂]).","(b) (2x)²/(1−x)² = 54 gives 2x/(1−x) = 7.35, x = 0.786 and [HI] = 1.57 M.","(c) K decreases and the amount of HI decreases (equilibrium shifts toward reactants).","(d) Both sides have 2 mol of gas, so there is no shift; all concentrations are halved but the ratio is unchanged.","(e) K is unchanged; equilibrium is reached sooner because both rates increase.","(f) Q = 16 ÷ 0.25 = 64 > 54, so the reaction shifts toward reactants."],
  sample:"(a) Kc = [HI]²/([H₂][I₂]). (b) x = 0.786 so [HI] = 1.57 M. (c) K and the amount of HI decrease. (d) No shift because moles of gas are equal. (e) K is unchanged and equilibrium is reached faster. (f) Q = 64 > K, so the system shifts toward H₂ and I₂."}
];

window.CS_MARKETS = {};
window.CS_SHIFTS = [];
window.CS_EVENTS = [];

/* ---------- figures (SVG; theme colors come from CSS variables) ---------- */
const W = (title, body, h = 220) => `<svg viewBox="0 0 320 ${h}" role="img" aria-label="${title}" class="biofig"><title>${title}</title>${body}</svg>`;
const T = (x, y, s, o = "") => `<text x="${x}" y="${y}" font-size="11" fill="var(--ink)" text-anchor="middle" font-weight="700" ${o}>${s}</text>`;
const t = (x, y, s, o = "") => `<text x="${x}" y="${y}" font-size="10" fill="var(--muted)" text-anchor="middle" ${o}>${s}</text>`;
const arrow = (x1, y1, x2, y2, c = "var(--accent)") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="2.4" marker-end="url(#ah)"/>`;
const defs = c => `<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${c||"var(--accent)"}"/></marker></defs>`;
const hl = (on) => on ? `opacity="1"` : `opacity=".35"`;
const axes = (x, y) => `<line x1="40" y1="180" x2="300" y2="180" stroke="var(--ink)" stroke-width="2"/><line x1="40" y1="180" x2="40" y2="20" stroke="var(--ink)" stroke-width="2"/>${t(170,204,x)}${t(14,100,y,"transform='rotate(-90 14 100)'")}`;
window.CS_FIGS = {
  pes: (v = 0) => W("Photoelectron spectrum of magnesium", defs() + axes("Binding energy (decreasing →)","Relative number of electrons") +
    [[70,"1s",2],[130,"2s",2],[190,"2p",6],[270,"3s",2]].map(([x,l,n],i)=>`<g ${hl(v===0||v===i+1)}><rect x="${x-10}" y="${180-n*20}" width="20" height="${n*20}" fill="var(--accent)" opacity=".75"/>${T(x,196,l)}${t(x,176-n*20,n+" e⁻")}</g>`).join("") +
    t(160,14,"Magnesium: 1s² 2s² 2p⁶ 3s²"), 220),
  vsepr: (v = 0) => W("Electron domain geometries", defs() +
    [[55,"Linear","180°","CO₂"],[135,"Trigonal planar","120°","BF₃"],[215,"Tetrahedral","109.5°","CH₄"],[290,"Bent","104.5°","H₂O"]].map(([x,n,a,e],i)=>
      `<g ${hl(v===0||v===i+1)}><circle cx="${x}" cy="90" r="14" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>${T(x,94,"A")}
      ${i===0?`<circle cx="${x-38}" cy="90" r="8" fill="var(--mint)"/><circle cx="${x+38}" cy="90" r="8" fill="var(--mint)"/>`:""}
      ${i===1?`<circle cx="${x}" cy="48" r="8" fill="var(--mint)"/><circle cx="${x-34}" cy="116" r="8" fill="var(--mint)"/><circle cx="${x+34}" cy="116" r="8" fill="var(--mint)"/>`:""}
      ${i===2?`<circle cx="${x}" cy="48" r="8" fill="var(--mint)"/><circle cx="${x-30}" cy="122" r="8" fill="var(--mint)"/><circle cx="${x+30}" cy="122" r="8" fill="var(--mint)"/><circle cx="${x+4}" cy="110" r="6" fill="var(--mint)" opacity=".7"/>`:""}
      ${i===3?`<circle cx="${x-26}" cy="116" r="8" fill="var(--mint)"/><circle cx="${x+26}" cy="116" r="8" fill="var(--mint)"/><ellipse cx="${x-10}" cy="62" rx="6" ry="9" fill="#FDE68A" stroke="#B45309"/><ellipse cx="${x+10}" cy="62" rx="6" ry="9" fill="#FDE68A" stroke="#B45309"/>`:""}
      ${T(x,160,n,"font-size='9'")}${t(x,174,a)}${t(x,188,e)}</g>`).join(""), 210),
  imf: (v = 0) => W("Intermolecular forces and boiling point", defs() +
    `<g ${hl(v===0||v===1)}><rect x="30" y="${180-30}" width="44" height="30" fill="#93C5FD"/>${T(52,196,"CH₄")}${t(52,170,"dispersion")}${t(52,158,"−162 °C")}</g>
     <g ${hl(v===0||v===2)}><rect x="100" y="${180-70}" width="44" height="70" fill="#86EFAC"/>${T(122,196,"HCl")}${t(122,110,"dipole-dipole")}${t(122,98,"−85 °C")}</g>
     <g ${hl(v===0||v===3)}><rect x="170" y="${180-130}" width="44" height="130" fill="#FDE68A"/>${T(192,196,"H₂O")}${t(192,50,"hydrogen bonding")}${t(192,38,"100 °C")}</g>
     <g ${hl(v===0||v===4)}><rect x="240" y="${180-160}" width="44" height="160" fill="#FCA5A5"/>${T(262,196,"NaCl")}${t(262,20,"ionic: 1465 °C")}</g>
     <line x1="20" y1="180" x2="300" y2="180" stroke="var(--ink)" stroke-width="2"/>${t(160,212,"Stronger forces → higher boiling point")}`, 220),
  stoich: (v = 0) => W("The mole map", defs() +
    `<g ${hl(v!==2)}><rect x="12" y="76" width="72" height="44" rx="10" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>${T(48,102,"Grams A")}</g>
     <g><rect x="122" y="76" width="72" height="44" rx="10" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>${T(158,102,"Moles A")}</g>
     <g ${hl(v!==1)}><rect x="232" y="76" width="76" height="44" rx="10" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>${T(270,102,"Moles B")}</g>
     ${arrow(86,98,118,98)}${t(102,70,"÷ molar mass")}${arrow(196,98,228,98)}${t(212,70,"mole ratio")}
     <g ${hl(v!==2)}><rect x="232" y="150" width="76" height="40" rx="10" fill="var(--mint)" opacity=".5" stroke="var(--mint)" stroke-width="2"/>${T(270,174,"Grams B")}</g>
     ${arrow(270,124,270,148)}${t(310,140,"× molar mass","text-anchor='end'")}
     ${t(160,18,"Always go through moles. The balanced equation gives the ratio.")}`, 210),
  rxn: (v = 0) => W("Reaction energy diagram", defs() + axes("Reaction progress","Energy") +
    `<path d="M50 140 L90 140 C120 140 130 50 160 50 C190 50 200 110 230 110 L290 110" fill="none" stroke="var(--accent)" stroke-width="3"/>
     ${v>=1?`<path d="M90 140 C120 140 130 90 160 90 C190 90 200 110 230 110" fill="none" stroke="var(--mint)" stroke-width="3" stroke-dasharray="5 4"/>${t(160,82,"with catalyst","fill='var(--mint)'")}`:""}
     ${t(70,156,"reactants")}${t(260,126,"products")}${t(160,42,"transition state")}
     <g ${hl(v!==2)}>${arrow(52,138,52,52)}${t(34,96,"Ea","transform='rotate(-90 34 96)'")}</g>
     <g ${hl(v!==1)}>${arrow(280,142,280,112)}${t(300,130,"ΔH")}</g>`, 215),
  heating: (v = 0) => W("Heating curve", defs() + axes("Heat added","Temperature") +
    `<polyline points="50,160 90,130 120,130 170,80 210,80 270,34" fill="none" stroke="var(--accent)" stroke-width="3"/>
     <g ${hl(v===0||v===1)}>${t(105,122,"melting (ΔHfus)")}</g><g ${hl(v===0||v===2)}>${t(190,72,"boiling (ΔHvap)")}</g>
     ${t(70,176,"solid")}${t(145,112,"liquid")}${t(250,52,"gas")}`, 215),
  equil: (v = 0) => W("Approach to equilibrium", defs() + axes("Time","Concentration") +
    `<path d="M45 40 C90 50 130 100 170 112 L295 112" fill="none" stroke="var(--accent)" stroke-width="3"/><path d="M45 170 C90 160 130 130 170 120 L295 120" fill="none" stroke="var(--mint)" stroke-width="3"/>
     <line x1="170" y1="30" x2="170" y2="180" stroke="var(--muted)" stroke-dasharray="4 4"/>${t(170,24,"equilibrium reached")}
     ${t(80,36,"[reactants]","fill='var(--accent)'")}${t(80,166,"[products]","fill='var(--mint)'")}
     ${v>=1?`<path d="M295 112 L295 80" stroke="#F43F5E" stroke-width="2.5" marker-end="url(#ah)"/>${t(280,72,"stress: add reactant")}`:""}`, 215),
  titr: (v = 0) => W("Weak acid titration curve", defs() + axes("Volume of NaOH added","pH") +
    `<path d="M45 150 C70 130 90 118 115 116 C140 114 150 112 160 100 C170 60 175 40 190 36 C230 30 270 28 295 26" fill="none" stroke="var(--accent)" stroke-width="3"/>
     <g ${hl(v===0||v===1)}><circle cx="110" cy="116" r="5" fill="#F59E0B"/>${t(110,134,"half-equivalence: pH = pKa")}</g>
     <g ${hl(v===0||v===2)}><circle cx="168" cy="72" r="5" fill="#F43F5E"/>${t(212,82,"equivalence: pH > 7")}</g>
     <line x1="40" y1="110" x2="300" y2="110" stroke="var(--muted)" stroke-dasharray="3 4"/>${t(290,106,"pH 7")}
     ${v===0||v===3?t(60,158,"buffer region"):""}`, 215),
  galv: (v = 0) => W("Galvanic cell", defs() +
    `<rect x="30" y="100" width="90" height="80" fill="#E0F2FE" stroke="var(--ink)" stroke-width="2"/><rect x="200" y="100" width="90" height="80" fill="#FEF3C7" stroke="var(--ink)" stroke-width="2"/>
     <rect x="62" y="70" width="14" height="90" fill="#94A3B8"/><rect x="232" y="70" width="14" height="90" fill="#B45309"/>
     <path d="M69 70 L69 36 L239 36 L239 70" fill="none" stroke="var(--ink)" stroke-width="2.5"/>${t(154,28,"e⁻ flow →","fill='var(--accent)'")}
     <path d="M100 100 Q155 60 220 100" fill="none" stroke="var(--mint)" stroke-width="5" opacity=".6"/>${t(160,84,"salt bridge")}
     <g ${hl(v===0||v===1)}>${T(75,196,"Anode (Zn)")}${t(75,210,"oxidation")}</g><g ${hl(v===0||v===2)}>${T(245,196,"Cathode (Cu)")}${t(245,210,"reduction")}</g>
     ${t(75,125,"Zn²⁺")}${t(245,125,"Cu²⁺")}`, 220),
  trends: (v = 0) => W("Periodic trends", defs() +
    `<rect x="40" y="40" width="200" height="130" fill="var(--accent-soft)" stroke="var(--ink)" stroke-width="2" rx="8"/>
     ${arrow(60,60,220,60,"var(--mint)")}${t(140,52,"left → right: IE ↑, electronegativity ↑, radius ↓")}
     ${arrow(260,50,260,160,"#F43F5E")}${t(262,176,"top → bottom: radius ↑, IE ↓")}
     ${T(140,112,"Most reactive nonmetal: F (top right)")}${t(140,132,"Most reactive metal: Cs / Fr (bottom left)")}`, 200)
};
