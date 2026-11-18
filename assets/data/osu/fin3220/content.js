/* Ohio State BUSFIN 3220 (Business Finance): original study material built from the public course description and standard corporate finance topics. */
window.CS_MARKETS = {}; window.CS_SHIFTS = []; window.CS_EVENTS = []; window.CS_DRILLS = []; window.CS_FRQ_GRAPHS = {};
window.CS_UNITS = [
 {id:1, name:"Financial Statements and Ratio Analysis", short:"Ratio analysis", ap:"", clep:"", wAP:14, wCLEP:0, lab:null,
  summary:"Ratios turn financial statements into comparable measures of liquidity, efficiency, leverage and profitability. The DuPont identity splits return on equity into margin, turnover and leverage.",
  points:["Current ratio = Current assets ÷ Current liabilities. Quick ratio = (Current assets − Inventory) ÷ Current liabilities.","Asset turnover = Sales ÷ Assets. Inventory turnover = COGS ÷ Inventory. Days sales outstanding = Receivables ÷ (Sales ÷ 365).","Debt ratio = Total liabilities ÷ Total assets. Times interest earned = EBIT ÷ Interest.","ROE = Net income ÷ Equity = Profit margin × Asset turnover × Equity multiplier (DuPont).","P/E = Price ÷ EPS."],
  formulas:["Current ratio = CA ÷ CL","ROE = Margin × Turnover × Equity multiplier","TIE = EBIT ÷ Interest"],
  traps:["Ratios only mean something compared with a benchmark or history.","The quick ratio removes inventory because it is the least liquid current asset."]},
 {id:2, name:"Time Value of Money", short:"Time value", ap:"", clep:"", wAP:18, wCLEP:0, lab:null,
  summary:"A dollar today is worth more than a dollar later because it can earn interest. Compounding moves money forward, discounting moves it back. Annuities and perpetuities are streams of equal payments.",
  points:["FV = PV × (1 + r)ⁿ. PV = FV ÷ (1 + r)ⁿ.","Ordinary annuity PV = PMT × [1 − (1 + r)⁻ⁿ] ÷ r. FV = PMT × [(1 + r)ⁿ − 1] ÷ r.","Perpetuity PV = PMT ÷ r. Growing perpetuity PV = PMT₁ ÷ (r − g).","Effective annual rate EAR = (1 + APR ÷ m)ᵐ − 1. More frequent compounding raises the EAR.","Rule of 72: years to double ≈ 72 ÷ rate (in percent). An annuity due is worth more than an ordinary annuity."],
  formulas:["FV = PV(1 + r)ⁿ","PV = FV ÷ (1 + r)ⁿ","Perpetuity = PMT ÷ r"],
  traps:["Match the rate and the number of periods (months with a monthly rate).","An annuity due pays at the start of each period."]},
 {id:3, name:"Valuing Bonds and Stocks", short:"Bonds & stocks", ap:"", clep:"", wAP:16, wCLEP:0, lab:null,
  summary:"The value of any asset is the present value of its expected cash flows. A bond's price is the present value of its coupons and face value at the yield. A stock's value depends on dividends and their growth.",
  points:["Bond price = PV of coupons + PV of face value, discounted at the yield to maturity.","Price and yield move in opposite directions. A bond sells at a premium when its coupon rate exceeds the yield.","Current yield = Annual coupon ÷ Price.","Constant growth model: P₀ = D₁ ÷ (r − g), where D₁ = D₀ × (1 + g).","Preferred stock is valued as a perpetuity: P = D ÷ r."],
  formulas:["P₀ = D₁ ÷ (r − g)","Preferred = D ÷ r","Current yield = Coupon ÷ Price"],
  traps:["The growth model needs r greater than g.","The next dividend (D₁), not D₀, goes in the numerator."]},
 {id:4, name:"Risk, Return and the CAPM", short:"Risk & return", ap:"", clep:"", wAP:16, wCLEP:0, lab:null,
  summary:"Investors demand higher returns for taking on more risk. Diversification removes company-specific risk, leaving market risk, which beta measures. The CAPM links required return to beta.",
  points:["Expected return = Σ (probability × return). A portfolio's return is the weighted average of its assets' returns.","Diversification eliminates unsystematic (company-specific) risk; systematic (market) risk remains.","Beta measures sensitivity to the market. The market's beta is 1.","CAPM: required return = Risk-free rate + Beta × (Market return − Risk-free rate).","A portfolio's beta is the weighted average of its assets' betas."],
  formulas:["E(R) = Σ p × R","CAPM: r = rf + β(rm − rf)"],
  traps:["Only systematic risk is rewarded in the CAPM.","Portfolio standard deviation is not the weighted average of the individual ones."]},
 {id:5, name:"Capital Budgeting and Cost of Capital", short:"Capital budgeting", ap:"", clep:"", wAP:18, wCLEP:0, lab:null,
  summary:"Firms evaluate long-term projects with NPV, IRR and payback using incremental after-tax cash flows. The weighted average cost of capital (WACC) is the usual discount rate.",
  points:["NPV = PV of cash inflows − initial investment. Accept projects with NPV > 0.","IRR is the discount rate that makes NPV zero. Accept if IRR exceeds the required return.","Profitability index = PV of inflows ÷ Initial investment.","Relevant cash flows are incremental and after tax. Exclude sunk costs and include opportunity costs.","WACC = E% × cost of equity + D% × cost of debt × (1 − tax rate). Depreciation tax shield = Depreciation × tax rate."],
  formulas:["NPV = Σ CF ÷ (1 + r)ᵗ − I₀","WACC = wE·rE + wD·rD(1 − T)"],
  traps:["Sunk costs and financing costs are not part of project cash flows.","Interest is tax deductible, so use the after-tax cost of debt."]},
 {id:6, name:"Capital Structure and Working Capital", short:"Capital structure", ap:"", clep:"", wAP:18, wCLEP:0, lab:null,
  summary:"Capital structure is the mix of debt and equity. Debt brings a tax shield but adds risk of financial distress. Working capital management balances liquidity and profitability.",
  points:["Interest is tax deductible: tax shield = Interest × tax rate.","Leverage raises expected ROE and the risk of the equity. The best mix balances the tax benefit and distress costs.","Cash conversion cycle = Days inventory + Days receivables − Days payables.","Dividend payout ratio = Dividends ÷ Net income. Share repurchases are another way to return cash.","Short-term financing is cheaper but riskier than long-term financing."],
  formulas:["Tax shield = Interest × T","CCC = DIO + DSO − DPO"],
  traps:["A shorter cash conversion cycle ties up less cash.","More debt is not always better: distress costs rise."]}
];
window.CS_TF = [
 [1,"A quick ratio excludes inventory.",true,"Inventory is the least liquid current asset."],
 [1,"A high debt ratio means a company uses little leverage.",false,"It means heavy use of debt."],
 [1,"ROE equals margin times turnover times the equity multiplier.",true,"This is the DuPont identity."],
 [1,"Ratios are meaningful without any comparison.",false,"They need a benchmark."],
 [2,"A dollar today is worth more than a dollar next year.",true,"It can be invested to earn interest."],
 [2,"More frequent compounding lowers the effective annual rate.",false,"It raises it."],
 [2,"An annuity due is worth more than an ordinary annuity.",true,"Each payment comes one period earlier."],
 [2,"A perpetuity's present value is the payment divided by the rate.",true,"This is the formula."],
 [3,"When market yields rise, existing bond prices rise.",false,"They fall."],
 [3,"A bond sells at a premium when its coupon rate exceeds its yield.",true,"It pays more than the market requires."],
 [3,"The constant growth model works when growth exceeds the required return.",false,"It needs r > g."],
 [3,"Preferred stock is valued as a perpetuity.",true,"Its dividend is fixed."],
 [4,"Diversification can eliminate systematic risk.",false,"Only unsystematic risk."],
 [4,"The market portfolio has a beta of 1.",true,"By definition."],
 [4,"CAPM says investors are paid for unsystematic risk.",false,"They are paid for systematic risk."],
 [4,"A portfolio's beta is the weighted average of its assets' betas.",true,"Betas are additive."],
 [5,"A project with a positive NPV should be accepted.",true,"It adds value."],
 [5,"Sunk costs belong in project cash flows.",false,"They are already spent."],
 [5,"The after-tax cost of debt is the pre-tax rate times (1 − tax rate).",true,"Interest is deductible."],
 [5,"A depreciation tax shield equals depreciation times the tax rate.",true,"It reduces taxes."],
 [6,"Interest on debt gives the firm a tax shield.",true,"It is deductible."],
 [6,"A shorter cash conversion cycle ties up more cash.",false,"It ties up less."],
 [6,"The payout ratio is dividends divided by net income.",true,"It shows what share of earnings is paid out."],
 [6,"Adding debt always lowers a firm's total risk.",false,"It raises financial risk."]
];
window.CS_CHAINS = [
 ["Evaluating a project with NPV",5,["Estimate incremental after-tax cash flows","Choose the discount rate (WACC)","Discount each cash flow to today","Subtract the initial investment","Accept if NPV is positive"]],
 ["Pricing a bond",3,["List the coupon payments and face value","Find the yield to maturity","Discount each cash flow","Add the present values","Compare the price with face value"]],
 ["Finding the required return with CAPM",4,["Find the risk-free rate","Estimate the market return","Compute the market risk premium","Multiply by beta","Add the risk-free rate"]],
 ["Computing WACC",5,["Find the cost of equity","Find the after-tax cost of debt","Find the market value weights","Multiply each cost by its weight","Add them"]]
];
window.CS_CRAM = (()=>{ const t=["Read the guide, then a 10-question unit quiz","Formulas and flashcards from memory, then the unit checkpoint"], out=[];
  for(let u=1;u<=6;u++){ out.push({u:"w"+u,t:t[0]}); out.push({u:"w"+u,t:t[1]}); if(u===3||u===5) out.push({u:"mix",t:"Mini practice exam (15 questions), then review every miss"}); }
  while(out.length<28) out.push({u:"mix",t:"Mixed practice and weak-spot drill"});
  out.push({u:"mix",t:"Full practice exam under a timer"}); out.push({u:"mix",t:"Review every miss and rest"}); return out.slice(0,30); })();
window.CS_RESOURCES = [
 {name:"Ohio State Fisher: Business core requirements", by:"Reference", url:"https://fisher.osu.edu/undergraduate/academics/degree-requirements", note:"Where BUSFIN 3220 fits in the Fisher core."},
 {name:"Khan Academy: Finance and capital markets", by:"Reference", url:"https://www.khanacademy.org/economics-finance-domain/core-finance", note:"Free lessons on interest, bonds, stocks and more."}
];
