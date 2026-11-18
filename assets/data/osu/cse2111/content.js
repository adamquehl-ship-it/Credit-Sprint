/* Ohio State CSE 2111 (Modeling and Problem Solving with Spreadsheets and Databases), built from the public course description:
   spreadsheet modeling, financial and date functions, formula auditing, relational databases with MS Access, and web and networking basics.
   All wording is original. */
window.CS_MARKETS = {}; window.CS_SHIFTS = []; window.CS_EVENTS = []; window.CS_DRILLS = []; window.CS_FRQ_GRAPHS = {};
window.CS_UNITS = [
 {id:1, name:"Spreadsheet Basics and Cell References", short:"Spreadsheet basics", ap:"", clep:"", wAP:14, wCLEP:0, lab:null,
  summary:"A spreadsheet is a grid of cells that hold values and formulas. Formulas begin with an equals sign, follow the order of operations and refer to other cells. Relative, absolute and mixed references decide how a formula changes when it is copied.",
  points:["A formula starts with =. Excel calculates in the order parentheses, exponents, multiplication and division (left to right), then addition and subtraction.","A relative reference (A1) changes when copied. An absolute reference ($A$1) never changes. A mixed reference ($A1 or A$1) locks only the column or the row. F4 cycles through the types.","A range such as A1:A10 names a block of cells. SUM, AVERAGE, MIN, MAX and COUNT work on ranges.","The & operator joins text. ##### means the column is too narrow for the value.","Format numbers (currency, percent, date) for readability without changing the underlying value."],
  formulas:["=A1+B1*C1  (multiplication first)","=A2*$B$1  (B1 stays fixed when copied)","=SUM(A1:A10)","=A1&\" \"&B1  (join text)"],
  traps:["Copying a formula with a missing $ is the most common modeling mistake.","Formatting a cell as a percent does not change its stored value; typing 5 in a percent cell means 5%."]},
 {id:2, name:"Functions and Logic", short:"Functions & logic", ap:"", clep:"", wAP:16, wCLEP:0, lab:null,
  summary:"Functions are built-in formulas. Logical functions such as IF, AND, OR and NOT make a spreadsheet decide. COUNTIF and SUMIF summarize only the cells that meet a condition, and text functions clean and combine labels.",
  points:["IF(test, value_if_true, value_if_false). Nest IFs to test several conditions, working from the highest threshold down.","AND returns TRUE only if every test is true. OR returns TRUE if any test is true. NOT reverses TRUE and FALSE.","COUNTIF(range, criteria) counts matching cells; SUMIF(range, criteria, sum_range) adds the matching values.","Text functions: LEFT, RIGHT, MID, LEN, UPPER, LOWER, TRIM and CONCAT. ROUND(number, digits) controls decimals.","COUNT counts numbers; COUNTA counts non-empty cells."],
  formulas:["=IF(A1>=70,\"Pass\",\"Fail\")","=COUNTIF(A1:A10,\">10\")","=SUMIF(A1:A10,\"East\",B1:B10)","=ROUND(3.14159,2)"],
  traps:["Text criteria need quotation marks, including comparison operators such as \">10\".","In a nested IF, the order of tests matters."]},
 {id:3, name:"Lookup, Date and Financial Functions", short:"Lookup & finance", ap:"", clep:"", wAP:16, wCLEP:0, lab:null,
  summary:"Lookup functions find a value in a table. Date functions do arithmetic on calendar dates. Financial functions such as PMT, FV, PV and NPV model loans, savings and investments, as long as the rate and the number of periods match.",
  points:["VLOOKUP(value, table, column, FALSE) finds an exact match in the first column and returns a value from another column. XLOOKUP and INDEX/MATCH can look in any direction.","Dates are stored as numbers, so subtracting two dates gives the days between them. TODAY() returns the current date; EDATE adds months.","PMT(rate, nper, pv) gives the payment. Use the rate per period: an annual rate ÷ 12 for monthly payments, and the number of months for nper.","FV(rate, nper, pmt) is a future value; PV is a present value; NPV discounts a series of cash flows; IRR is the rate at which NPV equals zero.","Cash you pay out is entered as a negative number, so the result's sign follows the cash-flow convention."],
  formulas:["=VLOOKUP(102,A2:C5,3,FALSE)","=PMT(0.06/12,60,-20000)","=FV(0.05,10,-100)","=B1-A1  (days between dates)"],
  traps:["Leaving out FALSE in VLOOKUP gives an approximate match and can return the wrong row.","Using an annual rate with a monthly number of periods is a common error in PMT."]},
 {id:4, name:"Charts, Tables and PivotTables", short:"Charts & PivotTables", ap:"", clep:"", wAP:14, wCLEP:0, lab:null,
  summary:"Charts and summaries communicate results. Choose the chart type to fit the question: lines for trends, columns for comparisons, pies for a few parts of a whole and scatter plots for relationships. Sorting, filtering, tables and PivotTables turn raw data into answers.",
  points:["Use a line chart for change over time, a column or bar chart to compare categories, a pie chart for a few parts of a whole and a scatter plot for two numeric variables.","Every chart needs a title, labeled axes and a legend when there are several series.","Sort by one or several levels. A filter hides rows without deleting them.","A PivotTable summarizes a large data set: drag fields to Rows, Columns and Values, and choose Sum, Count or Average. Refresh it after the data change.","Conditional formatting highlights cells that meet a rule. An Excel Table expands automatically when rows are added."],
  formulas:["PivotTable: Rows = Region, Values = Sum of Sales","Conditional format: Highlight cells > 1000"],
  traps:["A pie chart with many slices is hard to read.","A PivotTable does not update itself when the source data change; refresh it."]},
 {id:5, name:"Modeling, What-If Analysis and Formula Auditing", short:"Modeling & auditing", ap:"", clep:"", wAP:16, wCLEP:0, lab:null,
  summary:"A good model separates its assumptions from its calculations so that inputs can change and results update. What-if tools such as Goal Seek, Scenario Manager, data tables and Solver explore decisions. Formula auditing finds and fixes errors.",
  points:["Put inputs in labeled assumption cells and refer to them in formulas rather than typing numbers into formulas.","Goal Seek changes one input to make a formula reach a target. Scenario Manager stores sets of inputs. A data table shows results for a range of inputs. Solver optimizes with constraints.","Error values: #DIV/0! (division by zero), #REF! (a deleted reference), #NAME? (an unrecognized name), #N/A (value not found), #VALUE! (wrong type of argument).","Trace Precedents shows the cells a formula uses, Trace Dependents shows the cells that use a cell, and Evaluate Formula steps through a calculation.","A circular reference occurs when a formula refers to its own cell."],
  formulas:["Goal Seek: Set cell = target by changing input cell","=IFERROR(A1/B1,0)"],
  traps:["Hard-coding a number in a formula hides an assumption.","IFERROR can hide a real problem; use it deliberately."]},
 {id:6, name:"Relational Databases with Access", short:"Access databases", ap:"", clep:"", wAP:14, wCLEP:0, lab:null,
  summary:"A relational database stores data in related tables to avoid repeating information. Tables are linked with primary and foreign keys. Queries retrieve and combine the data, and forms and reports enter and present it.",
  points:["A table has fields (columns) and records (rows). A primary key uniquely identifies each record. A foreign key in another table links back to it.","Relationships: one-to-many is the most common (one customer, many orders). A many-to-many relationship needs a junction table.","Normalization splits data into tables so that each fact is stored once, reducing repetition and errors. Referential integrity prevents orphan records.","A query asks a question of the data. SQL uses SELECT fields FROM table WHERE condition ORDER BY field.","Use the right data type: Short Text, Number, Currency, Date/Time, Yes/No. Forms enter data; reports present it."],
  formulas:["SELECT Name FROM Customers WHERE City = \"Columbus\"","SELECT COUNT(*) FROM Orders"],
  traps:["Putting everything in one big table causes repeated data and update errors.","A primary key value must be unique and never empty."]},
 {id:7, name:"The Web and Networking Basics", short:"Web & networking", ap:"", clep:"", wAP:10, wCLEP:0, lab:null,
  summary:"The World Wide Web runs on the Internet. A browser (client) asks a web server for a page using HTTP, the domain name is translated to an IP address by DNS, and the page is described in HTML. Understanding these pieces helps you build a simple webpage.",
  points:["A URL has a protocol, a domain name and a path: https://www.example.com/page.html. HTTPS encrypts the connection.","DNS translates domain names to IP addresses. Routers move packets between networks. A LAN covers a small area; a WAN spans a large one.","HTML describes the structure of a page with tags such as <h1> (heading), <p> (paragraph), <a href> (link) and <img> (image).","The Internet is the global network; the web is one service that runs on it, alongside email and file transfer.","Cloud computing means using servers and software over the Internet rather than on your own computer."],
  formulas:["<a href=\"https://osu.edu\">Ohio State</a>","<h1>Title</h1>"],
  traps:["The Internet and the web are not the same thing.","An IP address identifies a device; a domain name is a human-friendly label for it."]}
];
window.CS_TF = [
 [1,"A formula in Excel must begin with an equals sign.",true,"Without =, Excel treats the entry as text."],
 [1,"=A1*$B$1 copied down one row becomes =A2*$B$2.",false,"The absolute reference stays $B$1; only A1 becomes A2."],
 [1,"Formatting a cell as a percent changes the stored value.",false,"Formatting changes only how the value is displayed."],
 [1,"In =2+3*4 the result is 14.",true,"Multiplication comes before addition."],
 [2,"IF(A1>5,\"High\",\"Low\") returns \"Low\" when A1 is exactly 5.",true,"5 is not greater than 5, so the false branch runs."],
 [2,"AND returns TRUE if at least one condition is true.",false,"That is OR. AND needs every condition to be true."],
 [2,"COUNTIF can count cells that meet a condition.",true,"For example =COUNTIF(A1:A9,\">10\")."],
 [2,"COUNTA counts only the cells that contain numbers.",false,"COUNTA counts all non-empty cells; COUNT counts numbers."],
 [3,"VLOOKUP with the last argument TRUE finds an exact match.",false,"FALSE gives an exact match; TRUE is an approximate match."],
 [3,"Subtracting two dates in Excel returns the number of days between them.",true,"Dates are stored as serial numbers."],
 [3,"For a monthly loan payment with an annual rate, PMT should use the annual rate directly.",false,"Divide the annual rate by 12 and use the number of months."],
 [3,"IRR is the discount rate at which NPV equals zero.",true,"It is the project's internal rate of return."],
 [4,"A line chart is a good choice to show a trend over time.",true,"The line connects values across ordered periods."],
 [4,"A PivotTable updates automatically as soon as the source data change.",false,"It must be refreshed."],
 [4,"Filtering a list deletes the rows that do not match.",false,"The rows are only hidden."],
 [5,"Goal Seek changes one input to make a formula reach a target value.",true,"It solves backward for a single input."],
 [5,"#REF! usually means a lookup value was not found.",false,"That is #N/A. #REF! means a reference is no longer valid."],
 [5,"Hard-coding numbers inside formulas is good modeling practice.",false,"Inputs should be in labeled cells so they can be changed."],
 [6,"A primary key must be unique for every record.",true,"It identifies each record."],
 [6,"A many-to-many relationship is created in Access with a junction table.",true,"The junction table holds the foreign keys of both tables."],
 [6,"Normalization increases data repetition.",false,"It reduces repetition by storing each fact once."],
 [7,"DNS translates domain names into IP addresses.",true,"It lets people use names instead of numbers."],
 [7,"The Internet and the World Wide Web are the same thing.",false,"The web is a service that runs on the Internet."],
 [7,"HTTPS encrypts the connection between a browser and a web server.",true,"The S stands for secure."]
];
window.CS_CHAINS = [
 ["Building a loan payment model",3,["Place the loan amount, annual rate and years in labeled input cells","Convert the annual rate to a monthly rate","Convert the years to a number of months","Enter PMT with the monthly rate, months and loan amount","Format the result as currency and check it with Goal Seek"]],
 ["Making a PivotTable",4,["Check that the data have headers and no blank rows","Insert a PivotTable from the data range","Drag a field to Rows","Drag a numeric field to Values and choose Sum","Refresh the PivotTable when the data change"]],
 ["Finding a formula error",5,["See the error value in the cell","Select the cell and use Trace Precedents","Use Evaluate Formula to step through","Fix the bad reference or argument","Recheck the results and add an IFERROR only if needed"]],
 ["Designing a small database",6,["List the things you track (customers, orders, products)","Create a table for each with a primary key","Add foreign keys to link the tables","Set relationships and enforce referential integrity","Build a query, form and report"]],
 ["Loading a web page",7,["The browser reads the URL","DNS finds the server's IP address","The browser sends an HTTP request","The web server sends back the HTML","The browser displays the page"]]
];
window.CS_CRAM = (()=>{ const t=["Read the guide, then a 10-question unit quiz","Formulas and flashcards from memory, then the unit checkpoint"], out=[];
  for(let u=1;u<=7;u++){ out.push({u:"w"+u,t:t[0]}); out.push({u:"w"+u,t:t[1]}); if(u===3||u===5) out.push({u:"mix",t:"Mini practice exam (15 questions), then review every miss"}); }
  while(out.length<28) out.push({u:"mix",t:"Mixed practice and weak-spot drill"});
  out.push({u:"mix",t:"Full practice exam under a timer"}); out.push({u:"mix",t:"Review every miss and rest"}); return out.slice(0,30); })();
window.CS_RESOURCES = [
 {name:"Ohio State Engineering: CSE 2111 course overview", by:"Reference", url:"https://syllabi.engineering.osu.edu/sites/default/files/pdfs/basic_course_overview/CSE_2111_basic.pdf", note:"The official description and prerequisites."},
 {name:"Microsoft Support: Excel functions by category", by:"Reference", url:"https://support.microsoft.com/excel", note:"Reference for every Excel function."},
 {name:"Ohio State free Microsoft 365 for students", by:"Reference", url:"https://it.osu.edu/", note:"Check Ohio State IT for how to get Office."}
];
