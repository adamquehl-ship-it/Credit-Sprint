/* Ohio State ECON 2001.01 (Principles of Microeconomics): unit layout for Fisher students. All wording is original. */
(function(){
const META = {
 1:{name:"Foundations: Scarcity, Choice and Trade", short:"Foundations",
  summary:"Scarcity forces choices and every choice has an opportunity cost. Rational decisions are made at the margin. Specialization and trade by comparative advantage make both sides better off.",
  more:["Business decisions follow the marginal rule: do one more unit while marginal benefit is at least marginal cost.","Sunk costs are already spent and should not change a forward-looking decision.","Economic profit subtracts implicit costs (such as the owner's best alternative use of time and money) from revenue."],
  traps:["Accounting profit ignores implicit costs, so it is larger than economic profit.","Comparative advantage is about opportunity cost, not about who is faster."]},
 2:{name:"Markets: Supply, Demand and Elasticity", short:"Markets",
  summary:"Demand and supply set prices and quantities. Elasticity measures how strongly buyers and sellers respond to price, income and related prices, and it determines how a tax or a price change splits between consumers and producers.",
  more:["A price ceiling below equilibrium creates a shortage; a price floor above equilibrium creates a surplus.","Price elasticity of demand = %ΔQ ÷ %ΔP. If demand is elastic, raising price lowers total revenue; if inelastic, it raises revenue.","The side of the market that is less elastic bears more of a tax.","Consumer surplus and producer surplus measure the gains from trade; a tax or price control creates deadweight loss."],
  traps:["A change in price moves along the curve; a change in anything else shifts it.","A straight-line demand curve has different elasticities at different points."]},
 3:{name:"Consumers and Firms: Choice, Costs and Competition", short:"Costs & competition",
  summary:"Consumers choose bundles to get the most satisfaction from a budget. Firms face costs that rise with output, and in perfect competition they produce where price equals marginal cost, earning zero economic profit in the long run.",
  more:["Utility is maximized when marginal utility per dollar is equal across goods.","ATC = TC ÷ Q. MC cuts ATC and AVC at their minimum points.","A price-taking firm maximizes profit where P = MR = MC, and shuts down in the short run if P is below AVC.","Entry and exit push perfectly competitive firms to zero economic profit in the long run."],
  traps:["Fixed costs do not change the profit-maximizing quantity.","Zero economic profit still means the owners earn a normal return."]},
 4:{name:"Market Power: Monopoly and Imperfect Competition", short:"Market power",
  summary:"Firms with market power face a downward-sloping demand curve, so marginal revenue is below price. They restrict output and charge more than marginal cost. Strategic behavior in oligopoly can be analyzed with game theory.",
  more:["A monopolist sets MR = MC, then reads the price from the demand curve.","Monopoly output is below the efficient level, creating deadweight loss.","Price discrimination raises profit by charging different prices to buyers with different willingness to pay.","Monopolistic competition has differentiated products and free entry, so zero long-run economic profit. Oligopoly outcomes depend on rivals' moves (Nash equilibrium)."],
  traps:["A monopolist's MR curve lies below demand, not on it.","The monopolist does not charge the highest possible price; it charges the profit-maximizing one."]},
 5:{name:"Labor and Factor Markets", short:"Factor markets",
  summary:"Firms hire workers until the value of what the last worker adds equals the wage. Wages are set by labor demand and supply, and market power on either side changes the outcome.",
  more:["Marginal revenue product of labor = MPL × MR (or MPL × P in a competitive output market). Hire until MRP = wage.","Labor supply reflects the tradeoff between work and leisure.","A monopsony hires fewer workers and pays lower wages than a competitive labor market.","Human capital and compensating differentials explain part of wage gaps."],
  traps:["Labor demand is derived from the demand for the product.","A minimum wage above equilibrium reduces employment in a competitive market, but can raise it under monopsony."]},
 6:{name:"Market Failure and the Role of Government", short:"Market failure",
  summary:"Markets can fail when prices miss part of the costs or benefits. Externalities, public goods and imperfect information justify government action, but government policy has its own costs.",
  more:["A negative externality makes the market quantity too high; a tax equal to the marginal external cost corrects it.","A positive externality makes the market quantity too low; a subsidy can correct it.","Public goods are non-rival and non-excludable, so private markets under-provide them (free-rider problem).","Asymmetric information causes adverse selection and moral hazard, which matter in insurance and lending."],
  traps:["Pollution is not eliminated at the efficient level; marginal abatement cost equals marginal benefit.","Coase: bargaining can solve externalities only when transaction costs are low."]}
};
window.CS_UNITS = window.CS_UNITS.map(u => { const m = META[u.id]; if (!m) return u;
  return Object.assign({}, u, {name:m.name, short:m.short, summary:m.summary, ap:"", clep:"", points:m.more.concat(u.points), traps:m.traps.concat(u.traps)}); });
})();
