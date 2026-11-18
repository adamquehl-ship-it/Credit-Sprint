/* Ohio State ACCTMIS 2200 (Introduction to Financial Accounting): original study material built from the public course description and standard financial accounting topics. */
window.CS_MARKETS = {}; window.CS_SHIFTS = []; window.CS_EVENTS = []; window.CS_DRILLS = []; window.CS_FRQ_GRAPHS = {};
window.CS_UNITS = [
 {id:1, name:"Accounting Basics and the Accounting Equation", short:"Accounting basics", ap:"", clep:"", wAP:12, wCLEP:0, lab:null,
  summary:"Accounting records and reports the financial activity of a business. Every transaction keeps the accounting equation in balance: assets equal liabilities plus owners' equity. Four financial statements report the results.",
  points:["Assets = Liabilities + Equity. Assets are what the company owns, liabilities are what it owes and equity is the owners' claim.","The income statement reports revenues minus expenses for a period. The balance sheet reports assets, liabilities and equity at a date.","Retained earnings = beginning balance + net income − dividends. The statement of retained earnings (or equity) links the income statement to the balance sheet.","The statement of cash flows reports operating, investing and financing cash flows.","Key assumptions: going concern, the separate entity assumption, the monetary unit and the time period assumption."],
  formulas:["Assets = Liabilities + Equity","Net income = Revenues − Expenses","Ending retained earnings = Beginning + Net income − Dividends"],
  traps:["Revenue is not the same as cash received, and an expense is not the same as cash paid.","The balance sheet is at a point in time; the income statement covers a period."]},
 {id:2, name:"Recording Transactions: Debits and Credits", short:"Debits and credits", ap:"", clep:"", wAP:16, wCLEP:0, lab:null,
  summary:"Double-entry bookkeeping records every transaction with equal debits and credits. Entries are journalized, posted to the ledger and summarized in a trial balance.",
  points:["Debits increase assets, expenses and dividends. Credits increase liabilities, equity and revenues. The opposite entry decreases each account.","Journalize each transaction, post it to the general ledger and prepare a trial balance.","A trial balance proves that total debits equal total credits. It does not prove that every entry was correct.","Normal balances: assets, expenses and dividends are debits; liabilities, equity and revenues are credits.","Revenue on account: debit Accounts Receivable, credit Revenue. Cash paid for an expense: debit the expense, credit Cash."],
  formulas:["Debits = Credits for every entry","Services on account: Dr Accounts Receivable, Cr Service Revenue"],
  traps:["Debit does not mean bad and credit does not mean good; it only means left and right.","A balanced trial balance can still hide a wrong account or an omitted entry."]},
 {id:3, name:"Adjusting Entries and Financial Statements", short:"Adjustments", ap:"", clep:"", wAP:16, wCLEP:0, lab:null,
  summary:"Accrual accounting records revenues when earned and expenses when incurred. At the end of a period, adjusting entries update accounts for deferrals and accruals and for depreciation. Closing entries then reset temporary accounts.",
  points:["Deferrals: prepaid expenses and unearned revenues. Accruals: accrued expenses and accrued revenues.","Prepaid expense adjustment: debit expense, credit the asset for the amount used up.","Unearned revenue adjustment: debit Unearned Revenue, credit Revenue for the amount earned.","Depreciation: debit Depreciation Expense, credit Accumulated Depreciation (a contra asset).","Closing entries close revenues, expenses and dividends to retained earnings. Assets, liabilities and equity are permanent accounts."],
  formulas:["Straight-line depreciation = (Cost − Salvage) ÷ Useful life","Book value = Cost − Accumulated depreciation"],
  traps:["Adjusting entries never involve the cash account.","Temporary accounts are closed; permanent accounts carry their balances forward."]},
 {id:4, name:"Merchandising and Inventory", short:"Inventory", ap:"", clep:"", wAP:14, wCLEP:0, lab:null,
  summary:"Merchandisers buy and resell goods. Cost of goods sold (COGS) is matched against sales to find gross profit. Inventory cost-flow assumptions (FIFO, LIFO, weighted average) change COGS and ending inventory.",
  points:["COGS = Beginning inventory + Purchases − Ending inventory. Gross profit = Net sales − COGS.","FIFO assumes the oldest costs are sold first. In rising prices, FIFO gives lower COGS and higher income than LIFO.","Weighted average cost = total cost of goods available ÷ total units available.","Perpetual systems update inventory with every sale; periodic systems count inventory at the end of the period.","Inventory is reported at the lower of cost and net realizable value. Terms 2/10, n/30 mean a 2% discount if paid within 10 days."],
  formulas:["COGS = BI + Purchases − EI","Gross profit margin = Gross profit ÷ Net sales"],
  traps:["FOB shipping point means the buyer owns the goods in transit.","Sales returns and discounts reduce net sales."]},
 {id:5, name:"Cash, Internal Control and Receivables", short:"Cash & receivables", ap:"", clep:"", wAP:14, wCLEP:0, lab:null,
  summary:"Internal controls protect assets and keep records reliable. A bank reconciliation explains the difference between the bank balance and the book balance. Companies estimate uncollectible accounts with the allowance method.",
  points:["Internal control principles include separation of duties, authorization, documentation and independent verification.","Bank reconciliation: the bank balance adds deposits in transit and subtracts outstanding checks. The book balance adds interest and subtracts fees.","Allowance method: record bad debt expense with an estimate (debit Bad Debt Expense, credit Allowance for Doubtful Accounts).","A write-off debits the Allowance and credits Accounts Receivable, so net realizable value does not change.","Interest = Principal × Rate × Time."],
  formulas:["Net realizable value = Accounts receivable − Allowance","Receivables turnover = Net credit sales ÷ Average receivables"],
  traps:["Writing off a receivable under the allowance method does not reduce net income.","Outstanding checks reduce the bank balance, not the book balance."]},
 {id:6, name:"Long-Term Assets and Liabilities", short:"Long-term items", ap:"", clep:"", wAP:14, wCLEP:0, lab:null,
  summary:"Long-term assets are recorded at cost and depreciated over their useful lives. Long-term liabilities such as notes and bonds payable are reported at their present value. Gains and losses arise when assets are sold.",
  points:["Capitalize all costs needed to get an asset ready for use.","Depreciation methods: straight-line, double-declining balance (rate = 2 ÷ life) and units of activity.","Gain or loss on sale = Proceeds − Book value.","Bonds issue at a discount when the stated rate is below the market rate and at a premium when it is above.","A contingent liability is recorded when a loss is probable and can be reasonably estimated."],
  formulas:["Double-declining rate = 2 ÷ Useful life","Current ratio = Current assets ÷ Current liabilities"],
  traps:["Double-declining ignores salvage value until the last year.","Land is not depreciated."]},
 {id:7, name:"Equity, Cash Flows and Financial Analysis", short:"Equity & analysis", ap:"", clep:"", wAP:14, wCLEP:0, lab:null,
  summary:"Corporations raise money by issuing stock and pay dividends from retained earnings. The statement of cash flows separates operating, investing and financing activities. Ratios help users judge liquidity, solvency and profitability.",
  points:["Issuing stock: debit Cash, credit Common Stock (and Paid-in Capital if above par). Dividends reduce retained earnings when declared.","Treasury stock is the company's own repurchased stock and reduces equity.","Operating (day-to-day), investing (long-term assets) and financing (debt and equity) are the three cash flow sections.","Indirect method: start with net income, add back depreciation and adjust for working capital changes.","Common ratios: current ratio, debt-to-equity, return on equity and earnings per share."],
  formulas:["EPS = (Net income − Preferred dividends) ÷ Weighted shares","ROE = Net income ÷ Average equity","Debt-to-equity = Total liabilities ÷ Total equity"],
  traps:["Depreciation is added back in operating cash flow because it is a non-cash expense.","A stock dividend does not change total equity."]}
];
window.CS_TF = [
 [1,"Assets always equal liabilities plus equity.",true,"This is the accounting equation."],
 [1,"The balance sheet covers a period of time.",false,"It reports a single date."],
 [1,"Net income flows into retained earnings.",true,"It links the income statement to the balance sheet."],
 [1,"Revenue is recorded only when cash is received.",false,"Accrual accounting records it when earned."],
 [2,"A debit always increases an account.",false,"A debit increases assets and expenses but decreases liabilities, equity and revenues."],
 [2,"A trial balance with equal totals proves there are no errors.",false,"Offsetting errors and wrong accounts may remain."],
 [2,"Dividends have a normal debit balance.",true,"They reduce equity."],
 [2,"Revenue on account is recorded as a debit to Accounts Receivable.",true,"The asset increases."],
 [3,"Adjusting entries involve the cash account.",false,"Cash is never adjusted."],
 [3,"Accumulated depreciation is a contra asset.",true,"It reduces the asset's book value."],
 [3,"Revenues are permanent accounts.",false,"They are temporary and closed each year."],
 [3,"Unearned revenue is a liability.",true,"The company owes goods or services."],
 [4,"In rising prices, FIFO gives higher net income than LIFO.",true,"FIFO uses older, lower costs for COGS."],
 [4,"Under FOB shipping point the seller owns goods in transit.",false,"Ownership passes to the buyer at shipment."],
 [4,"Gross profit equals net sales minus cost of goods sold.",true,"It is before operating expenses."],
 [5,"Outstanding checks are added to the bank balance.",false,"They are subtracted."],
 [5,"A write-off under the allowance method reduces net realizable value.",false,"Both receivables and the allowance fall by the same amount."],
 [5,"Separation of duties is an internal control.",true,"It reduces the chance of fraud."],
 [6,"Land is depreciated over its useful life.",false,"Land is not depreciated."],
 [6,"A bond issues at a discount when the stated rate is below the market rate.",true,"Investors pay less than face value."],
 [6,"Gain on sale equals proceeds minus book value.",true,"A positive difference is a gain."],
 [7,"Depreciation is added back to net income in operating cash flow.",true,"It is a non-cash expense."],
 [7,"Treasury stock increases total equity.",false,"It reduces equity."],
 [7,"Buying equipment is an investing activity.",true,"It is a long-term asset purchase."]
];
window.CS_CHAINS = [
 ["The accounting cycle",2,["Analyze and journalize transactions","Post to the general ledger","Prepare an unadjusted trial balance","Record adjusting entries","Prepare financial statements, then close the books"]],
 ["Adjusting a prepaid expense",3,["Cash is paid in advance and recorded as an asset","Time passes and part of it is used up","Debit the expense for the amount used","Credit the prepaid asset","The balance sheet and income statement now match"]],
 ["Reconciling a bank statement",5,["Start with the bank balance","Add deposits in transit","Subtract outstanding checks","Adjust the book balance for fees and interest","Both sides now show the same correct cash"]],
 ["Preparing the cash flow statement (indirect)",7,["Start with net income","Add back depreciation","Adjust for changes in working capital","Add investing and financing flows","Reconcile to the change in cash"]]
];
window.CS_CRAM = (()=>{ const t=["Read the guide, then a 10-question unit quiz","Terms and flashcards from memory, then the unit checkpoint"], out=[];
  for(let u=1;u<=7;u++){ out.push({u:"w"+u,t:t[0]}); out.push({u:"w"+u,t:t[1]}); if(u===3||u===5) out.push({u:"mix",t:"Mini practice exam (15 questions), then review every miss"}); }
  while(out.length<28) out.push({u:"mix",t:"Mixed practice and weak-spot drill"});
  out.push({u:"mix",t:"Full practice exam under a timer"}); out.push({u:"mix",t:"Review every miss and rest"}); return out.slice(0,30); })();
window.CS_RESOURCES = [
 {name:"Ohio State Fisher: Business core requirements", by:"Reference", url:"https://fisher.osu.edu/undergraduate/academics/degree-requirements", note:"Where ACCTMIS 2200 fits in the Fisher core."},
 {name:"OpenStax: Principles of Accounting, Volume 1", by:"Reference", url:"https://openstax.org/details/books/principles-financial-accounting", note:"A free, open textbook on financial accounting."},
 {name:"Ohio State Business Learning Center", by:"Reference", url:"https://fisher.osu.edu/undergraduate/current-students", note:"Check Fisher for tutoring and study resources."}
];
