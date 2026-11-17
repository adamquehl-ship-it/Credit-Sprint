/* Ohio State ECON 2002.01 short problems with rubrics (original). */
window.CS_FRQS = (window.CS_FRQS || []).concat([
 {id:"o1", title:"A rate cut and a business loan", kind:"Short", minutes:15, units:[4,3],
  prompt:"The economy is in a recession with unemployment above the natural rate. The Federal Reserve lowers its target for the federal funds rate. A regional retailer is deciding whether to borrow to open a new distribution center.",
  parts:["Name the open market operation the Fed would use to lower the federal funds rate.","Explain how the rate cut changes the retailer's incentive to borrow for the project.","Show the effect on aggregate demand in an AD–AS graph and state what happens to real GDP and the price level in the short run.","Explain one reason the effect on real GDP could be smaller than expected."],
  rubric:["(a) The Fed buys government bonds, which adds reserves.","(b) Borrowing costs fall, so more projects have a return above the interest cost and the retailer is more willing to borrow.","(c) AD shifts right; real GDP rises and the price level rises (or rises slightly).","(d) Any one: banks hold excess reserves, businesses are pessimistic, policy lags, or the economy is near the zero lower bound."],
  sample:"(a) Buy bonds. (b) Lower borrowing costs raise investment. (c) AD shifts right, so real GDP and prices rise. (d) Firms may not borrow if they expect weak sales."},
 {id:"o2", title:"Reading the numbers: GDP, CPI and unemployment", kind:"Short", minutes:15, units:[2],
  prompt:"A country reports: nominal GDP $5,500B in Year 2 and $5,000B in Year 1; GDP deflator 110 in Year 2 and 100 in Year 1. CPI is 220 in Year 2 and 200 in Year 1. The labor force is 100 million and 6 million are unemployed.",
  parts:["Calculate real GDP in Year 2.","Calculate the growth rate of real GDP between Year 1 and Year 2.","Calculate the inflation rate using the CPI.","Calculate the unemployment rate.","Explain why a discouraged worker does not change the unemployment rate."],
  rubric:["(a) 5,500 ÷ 1.10 = $5,000B.","(b) 0% growth: real GDP is 5,000 in both years.","(c) (220 − 200) ÷ 200 = 10%.","(d) 6 ÷ 100 = 6%.","(e) A discouraged worker has stopped searching, so is out of the labor force and not counted as unemployed."],
  sample:"(a) $5,000B. (b) 0%. (c) 10%. (d) 6%. (e) They are not actively searching, so they leave the labor force."},
 {id:"o3", title:"Stimulus, the multiplier and the debt", kind:"Short", minutes:20, units:[3,5],
  prompt:"The economy has a recessionary gap of $60 billion. The marginal propensity to consume is 0.75. Congress considers a spending increase or a tax cut.",
  parts:["Calculate the spending multiplier.","How large a spending increase would close the gap?","How large a tax cut would close the same gap?","Explain one reason a tax cut may have a smaller effect than the calculation suggests.","Explain how financing the stimulus by borrowing could crowd out private investment."],
  rubric:["(a) 1 ÷ (1 − 0.75) = 4.","(b) 60 ÷ 4 = $15 billion.","(c) Tax multiplier = 0.75 ÷ 0.25 = 3, so 60 ÷ 3 = $20 billion.","(d) Households may save part of the cut or may expect higher taxes later.","(e) Borrowing raises the demand for loanable funds and interest rates, which lowers business investment."],
  sample:"(a) 4. (b) $15B. (c) $20B. (d) People may save it. (e) Higher interest rates discourage investment."},
 {id:"o4", title:"A stronger dollar and a Fisher exporter", kind:"Short", minutes:15, units:[6],
  prompt:"Interest rates rise in the United States while they stay the same abroad. An Ohio manufacturer sells equipment to customers in Europe.",
  parts:["Explain what happens to the demand for U.S. dollars and to the value of the dollar.","Explain the effect on the price the European customers pay for the manufacturer's equipment.","What happens to U.S. net exports?","Explain one way the manufacturer could respond."],
  rubric:["(a) Foreign investors want U.S. assets, so demand for dollars rises and the dollar appreciates.","(b) Customers need more euros per dollar, so the price in euros rises.","(c) Net exports fall.","(d) Any one: cut costs, hedge currency risk, price in euros, or find customers in other regions."],
  sample:"(a) Dollar demand rises and the dollar appreciates. (b) The euro price rises. (c) Net exports fall. (d) Hedge or cut costs."}
]);
window.CS_FRQ_GRAPHS = Object.assign(window.CS_FRQ_GRAPHS || {}, {
  o1:{mk:"adas", task:"Show the effect of the rate cut on the AD–AS graph, part (c).", expect:[["AD",1]], why:"Lower interest rates raise investment and shift AD right."},
  o4:{mk:"fx", task:"Show the effect of higher U.S. interest rates on the market for dollars.", expect:[["D$",1]], why:"Higher U.S. returns raise foreign demand for dollars.", x:"Quantity of dollars", y:"Euros per dollar", labels:{"D$":"D","S$":"S"}}
});
