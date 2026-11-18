/* Ohio State ACCTMIS 2300 (Introduction to Managerial Accounting): original study material built from the public course description and standard managerial accounting topics. */
window.CS_MARKETS = {}; window.CS_SHIFTS = []; window.CS_EVENTS = []; window.CS_DRILLS = []; window.CS_FRQ_GRAPHS = {};
window.CS_UNITS = [
 {id:1, name:"Cost Concepts and Classification", short:"Cost concepts", ap:"", clep:"", wAP:14, wCLEP:0, lab:null,
  summary:"Managerial accounting gives managers information for planning, control and decisions. Costs are classified as product or period costs, and as direct materials, direct labor or manufacturing overhead. Cost behavior describes how costs change with activity.",
  points:["Product costs (direct materials, direct labor, manufacturing overhead) are inventoried; period costs (selling and administrative) are expensed when incurred.","Prime cost = direct materials + direct labor. Conversion cost = direct labor + manufacturing overhead.","Cost of goods manufactured = direct materials used + direct labor + overhead + beginning WIP − ending WIP.","COGS = Beginning finished goods + COGM − Ending finished goods.","Variable costs change in total with activity, but are constant per unit. Fixed costs are constant in total, but fall per unit as volume rises."],
  formulas:["Prime cost = DM + DL","Conversion cost = DL + OH","COGS = Beginning FG + COGM − Ending FG"],
  traps:["Fixed cost per unit changes with volume, even though total fixed cost does not.","Selling and administrative costs are period costs, not product costs."]},
 {id:2, name:"Job-Order Costing and Overhead", short:"Job-order costing", ap:"", clep:"", wAP:14, wCLEP:0, lab:null,
  summary:"Job-order costing tracks the cost of each batch or job. Overhead is applied to jobs with a predetermined rate. At period end, overapplied or underapplied overhead is closed to cost of goods sold.",
  points:["Predetermined overhead rate = estimated overhead ÷ estimated activity base (such as direct labor hours).","Applied overhead = predetermined rate × actual activity for the job.","Job cost = direct materials + direct labor + applied overhead.","Overapplied overhead = applied > actual. Underapplied = applied < actual. Both are usually closed to COGS.","Costs flow from Raw Materials and Wages into Work in Process, then Finished Goods, then COGS."],
  formulas:["Predetermined rate = Estimated OH ÷ Estimated base","Applied OH = Rate × Actual base","Price = Cost × (1 + Markup)"],
  traps:["The rate is set before the period begins, from estimates.","Overapplied overhead reduces COGS when closed."]},
 {id:3, name:"Cost-Volume-Profit Analysis", short:"CVP", ap:"", clep:"", wAP:16, wCLEP:0, lab:null,
  summary:"CVP analysis shows how profit changes with price, cost and volume. The contribution margin (price minus variable cost) covers fixed costs and then becomes profit. Break-even is where profit is zero.",
  points:["Contribution margin per unit = Price − Variable cost per unit. CM ratio = CM ÷ Price.","Break-even units = Fixed costs ÷ CM per unit. Break-even sales = Fixed costs ÷ CM ratio.","Target profit units = (Fixed costs + Target profit) ÷ CM per unit.","Margin of safety = Actual sales − Break-even sales.","Degree of operating leverage = Contribution margin ÷ Net operating income."],
  formulas:["BE units = FC ÷ CM per unit","BE sales = FC ÷ CM ratio","DOL = CM ÷ NOI"],
  traps:["Break-even uses contribution margin, not gross profit.","Raising fixed costs raises break-even; raising price lowers it."]},
 {id:4, name:"Budgeting", short:"Budgeting", ap:"", clep:"", wAP:14, wCLEP:0, lab:null,
  summary:"A budget is a plan expressed in numbers. The master budget starts with sales and flows into production, purchases, labor, overhead and cash. A flexible budget adjusts for the actual level of activity.",
  points:["The sales budget drives the master budget. Required production = Sales + Desired ending inventory − Beginning inventory.","Direct materials purchases = Production needs + Desired ending materials − Beginning materials.","A cash budget shows receipts, disbursements and financing needs.","A static budget is fixed at one activity level. A flexible budget changes with the actual level.","Participative budgeting involves the managers who will be held to the budget."],
  formulas:["Production = Sales + End FG − Begin FG","Purchases = Needs + End RM − Begin RM"],
  traps:["Compare actual results with a flexible budget, not a static one, when activity differs.","Cash receipts differ from sales because of credit terms."]},
 {id:5, name:"Standard Costs and Variances", short:"Variances", ap:"", clep:"", wAP:14, wCLEP:0, lab:null,
  summary:"Standard costs are what a unit should cost. Variances compare actual and standard costs. Price variances come from paying a different price and quantity variances from using a different quantity.",
  points:["Materials price variance = (Actual price − Standard price) × Actual quantity.","Materials quantity variance = (Actual quantity − Standard quantity allowed) × Standard price.","Labor rate variance = (Actual rate − Standard rate) × Actual hours. Efficiency variance = (Actual hours − Standard hours) × Standard rate.","Unfavorable variances mean actual cost exceeds standard; favorable means it is lower.","Management by exception focuses attention on large variances."],
  formulas:["Price var = (AP − SP) × AQ","Quantity var = (AQ − SQ) × SP"],
  traps:["A favorable price variance can lead to an unfavorable quantity variance.","The price variance uses actual quantity; the quantity variance uses standard price."]},
 {id:6, name:"Relevant Costs and Decision Making", short:"Decisions", ap:"", clep:"", wAP:14, wCLEP:0, lab:null,
  summary:"Relevant costs and revenues differ between alternatives and will occur in the future. Sunk costs and unavoidable allocated costs are irrelevant. Typical decisions include special orders, make or buy, dropping a segment and constrained resources.",
  points:["A cost is relevant if it is future and differs between alternatives.","Sunk costs are irrelevant. Opportunity costs are relevant.","Special order: accept if the price exceeds the incremental cost (with idle capacity).","Make or buy: compare the avoidable cost of making with the price to buy.","With a constrained resource, rank products by contribution margin per unit of the constraint."],
  formulas:["Profit change = Incremental revenue − Incremental cost","CM per constraint unit = CM ÷ constraint use"],
  traps:["Allocated fixed costs that continue anyway are not relevant.","Contribution margin per unit is not enough when a resource is limited."]},
 {id:7, name:"Capital Budgeting and Performance Evaluation", short:"Capital budgeting", ap:"", clep:"", wAP:14, wCLEP:0, lab:null,
  summary:"Capital budgeting evaluates long-term investments with payback, net present value and rate of return. Performance measures such as ROI and residual income evaluate divisions.",
  points:["Payback period = Initial investment ÷ Annual cash inflow.","NPV = Present value of inflows − Initial investment. Accept if NPV is positive.","ROI = Operating income ÷ Average operating assets = Margin × Turnover.","Residual income = Operating income − (Minimum required return × Average assets).","The balanced scorecard uses financial, customer, internal process and learning and growth perspectives."],
  formulas:["Payback = Investment ÷ Annual inflow","ROI = Margin × Turnover","RI = Income − Required return × Assets"],
  traps:["Payback ignores cash flows after the payback period and the time value of money.","A division can have a good ROI and still reject a project that is above the company's required return."]}
];
window.CS_TF = [
 [1,"Selling and administrative costs are product costs.",false,"They are period costs."],
 [1,"Total variable cost stays constant as volume rises.",false,"Total variable cost rises; per-unit variable cost is constant."],
 [1,"Fixed cost per unit falls as volume rises.",true,"The same total is spread over more units."],
 [1,"Prime cost equals direct materials plus direct labor.",true,"That is the definition."],
 [2,"The predetermined overhead rate is based on estimates.",true,"It is set before the period."],
 [2,"Overapplied overhead means applied overhead is less than actual.",false,"That is underapplied."],
 [2,"Job cost includes direct materials, direct labor and applied overhead.",true,"These are the three elements."],
 [2,"Completed jobs move from Finished Goods to Work in Process.",false,"They move from WIP to Finished Goods."],
 [3,"Break-even occurs when contribution margin equals fixed costs.",true,"Profit is then zero."],
 [3,"Raising selling price raises the break-even point.",false,"It lowers it."],
 [3,"Margin of safety is actual sales minus break-even sales.",true,"It shows the cushion."],
 [3,"The contribution margin ratio is price divided by variable cost.",false,"It is CM divided by price."],
 [4,"The sales budget is the starting point of the master budget.",true,"Other budgets depend on it."],
 [4,"A static budget changes with the actual activity level.",false,"A flexible budget does."],
 [4,"Cash receipts always equal sales in the month.",false,"Credit sales are collected later."],
 [5,"A favorable variance means actual cost is below standard.",true,"Costs were lower than expected."],
 [5,"The materials quantity variance uses the actual price.",false,"It uses the standard price."],
 [5,"A price variance can be favorable while a quantity variance is unfavorable.",true,"Cheaper material may cause waste."],
 [6,"Sunk costs are relevant to a decision.",false,"They cannot be changed."],
 [6,"Unavoidable allocated fixed cost is irrelevant to dropping a product.",true,"It continues either way."],
 [6,"With a constrained resource, rank products by CM per unit of the constraint.",true,"It maximizes total contribution."],
 [7,"Payback considers the time value of money.",false,"It ignores it."],
 [7,"A project with a positive NPV should be accepted.",true,"It earns more than the required return."],
 [7,"Residual income equals income minus a required return on assets.",true,"This is the definition."]
];
window.CS_CHAINS = [
 ["Flow of costs in a manufacturer",2,["Buy raw materials","Issue materials and labor to Work in Process","Apply overhead to jobs","Transfer completed jobs to Finished Goods","Record COGS when goods are sold"]],
 ["Building a master budget",4,["Prepare the sales budget","Prepare the production budget","Prepare materials, labor and overhead budgets","Prepare the cash budget","Prepare the budgeted financial statements"]],
 ["Analyzing a variance",5,["Compare actual cost with standard cost","Split the variance into price and quantity","Mark it favorable or unfavorable","Investigate the large ones","Take corrective action"]],
 ["Making a special order decision",6,["Identify the incremental revenue","Identify the incremental costs","Check for idle capacity","Compare the two","Accept if the net result is positive"]]
];
window.CS_CRAM = (()=>{ const t=["Read the guide, then a 10-question unit quiz","Terms and flashcards from memory, then the unit checkpoint"], out=[];
  for(let u=1;u<=7;u++){ out.push({u:"w"+u,t:t[0]}); out.push({u:"w"+u,t:t[1]}); if(u===3||u===5) out.push({u:"mix",t:"Mini practice exam (15 questions), then review every miss"}); }
  while(out.length<28) out.push({u:"mix",t:"Mixed practice and weak-spot drill"});
  out.push({u:"mix",t:"Full practice exam under a timer"}); out.push({u:"mix",t:"Review every miss and rest"}); return out.slice(0,30); })();
window.CS_RESOURCES = [
 {name:"Ohio State Fisher: Business core requirements", by:"Reference", url:"https://fisher.osu.edu/undergraduate/academics/degree-requirements", note:"Where ACCTMIS 2300 fits in the Fisher core."},
 {name:"OpenStax: Principles of Accounting, Volume 2", by:"Reference", url:"https://openstax.org/details/books/principles-managerial-accounting", note:"A free, open textbook on managerial accounting."}
];
