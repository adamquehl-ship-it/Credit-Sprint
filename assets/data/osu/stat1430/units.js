/* Ohio State STAT 1430 (Statistics for the Business Sciences): unit layout built from the public course description and module list. All wording is original. */
(function(){
const META = {
 1:{name:"Data, Surveys, Experiments and Summaries", short:"Data & summaries",
  summary:"Statistics starts with how data are collected. Surveys and experiments answer different questions, and bias can ruin either. Once data are in hand, graphs and numerical summaries describe the shape, center and spread, and z-scores compare values across different scales.",
  more:["Random sampling lets you generalize to a population. Random assignment lets you conclude cause and effect.","Choose a summary to fit the shape: mean and standard deviation for symmetric data, median and IQR for skewed data or outliers.","A z-score = (value − mean) ÷ SD tells how many standard deviations a value is from the mean.","Business examples: customer satisfaction surveys, A/B tests, daily sales, delivery times."],
  traps:["A bigger sample does not fix a biased sampling method.","Correlation in an observational study does not show cause."]},
 2:{name:"Probability, Random Variables and Distributions", short:"Probability",
  summary:"Probability measures how likely events are. Two-way tables and conditional probability help evaluate risk and customer behavior. Random variables have an expected value and a standard deviation, and the binomial and normal models cover many business situations.",
  more:["P(A and B) = P(A) × P(B | A). Events are independent when P(B | A) = P(B).","Expected value E(X) = Σ x·P(x). Var(X + Y) = Var(X) + Var(Y) for independent variables.","Binomial: n trials, success probability p. Mean np, SD √(np(1 − p)).","Normal model: standardize with z = (x − μ) ÷ σ and use the 68–95–99.7 rule."],
  traps:["Mutually exclusive events with positive probability are never independent.","P(A | B) is not the same as P(B | A)."]},
 3:{name:"Sampling Distributions and Inference for Proportions", short:"Proportions",
  summary:"A sampling distribution shows how a statistic varies from sample to sample. For a proportion, the standard error and the normal model give a confidence interval and a hypothesis test, which let a business judge claims such as a market share or a defect rate.",
  more:["The standard error of p̂ is √(p(1 − p) ÷ n). Check np ≥ 10 and n(1 − p) ≥ 10.","A confidence interval is p̂ ± z*·SE. A higher confidence level or a smaller n gives a wider interval.","A test statistic z = (p̂ − p₀) ÷ √(p₀(1 − p₀) ÷ n). A small p-value is evidence against the null hypothesis.","Type I error: rejecting a true null. Type II error: failing to reject a false null."],
  traps:["A 95% interval is about the method, not a 95% chance for the fixed parameter.","A large p-value does not prove the null hypothesis."]},
 4:{name:"Inference for Means", short:"Means",
  summary:"For quantitative data, the t distribution handles the extra uncertainty from estimating the standard deviation. One-sample, paired and two-sample procedures cover comparisons such as average order size or the effect of a new training program.",
  more:["One-sample t interval: x̄ ± t*·s ÷ √n with n − 1 degrees of freedom.","Test statistic t = (x̄ − μ₀) ÷ (s ÷ √n).","Paired data (same units measured twice) use differences; independent groups use a two-sample procedure with SE = √(s₁²/n₁ + s₂²/n₂).","Check randomness, independence and no strong skew or outliers for small samples."],
  traps:["Matched pairs are not two independent samples.","Statistical significance is not the same as practical importance."]},
 5:{name:"Association and Simple Linear Regression", short:"Regression",
  summary:"Scatterplots, correlation and the least-squares line describe the relationship between two quantitative variables, such as advertising and sales. Residuals check the fit, r² measures the share of variation explained, and inference on the slope tests whether a real linear relationship exists.",
  more:["The slope b₁ is the predicted change in y per one-unit increase in x. The intercept is the prediction at x = 0, which may not make sense in context.","Residual = observed − predicted. A pattern in the residual plot means a linear model is not appropriate.","r² is the fraction of variation in y explained by the linear relationship with x.","Inference for the slope uses a t statistic with n − 2 degrees of freedom."],
  traps:["Do not extrapolate far beyond the data.","A strong correlation does not prove one variable causes the other."]}
};
window.CS_UNITS = window.CS_UNITS.map(u => { const m = META[u.id]; if (!m) return u;
  return Object.assign({}, u, {name:m.name, short:m.short, summary:m.summary, ap:"", clep:"", points:m.more.concat(u.points), traps:m.traps.concat(u.traps)}); });
})();
