/* Credit Sprint AP Calculus BC: Series Court data, [series, verdict index, why, unit]. Verdicts: 0 converges absolutely, 1 converges conditionally, 2 diverges. All original. */
window.CS_CALC_SERIES = [
 ["Σ 1/n²",0,"p-series with p = 2 > 1.",10],["Σ 1/n",2,"The harmonic series diverges.",10],["Σ (−1)ⁿ/n",1,"Alternating harmonic: converges, but Σ1/n diverges.",10],
 ["Σ (1/2)ⁿ",0,"Geometric with |r| = 1/2 < 1.",10],["Σ 3ⁿ/2ⁿ",2,"Geometric with r = 3/2 > 1.",10],["Σ (−1)ⁿ/√n",1,"Alternating with terms decreasing to 0, but Σ1/√n is a p-series with p = 1/2.",10],
 ["Σ 1/√n",2,"p-series with p = 1/2 ≤ 1.",10],["Σ n/(n + 1)",2,"The terms approach 1, not 0 (nth-term test).",10],["Σ (−1)ⁿ/n³",0,"Σ1/n³ converges, so the series converges absolutely.",10],
 ["Σ 1/n!",0,"Ratio test: 1/(n + 1) → 0.",10],["Σ n!/2ⁿ",2,"Ratio test: (n + 1)/2 → ∞.",10],["Σ (−1)ⁿ·n/(n + 1)",2,"The terms do not approach 0, so the series diverges.",10],
 ["Σ 1/(n² + 1)",0,"Compare with Σ1/n²: smaller positive terms.",10],["Σ 1/(2n + 1)",2,"Limit comparison with Σ1/n gives 1/2.",10],["Σ (−1)ⁿ/(2n + 1)",1,"Alternating test passes; the absolute series behaves like Σ1/n.",10],
 ["Σ n/2ⁿ",0,"Ratio test: (n + 1)/(2n) → 1/2 < 1.",10],["Σ (−2)ⁿ/3ⁿ",0,"Geometric with |r| = 2/3 < 1.",10],["Σ (−1)ⁿ",2,"The terms are ±1 and never approach 0.",10],
 ["Σ 1/n^1.01",0,"p-series with p = 1.01 > 1.",10],["Σ 1/(n ln n), n ≥ 2",2,"Integral test: ∫ 1/(x ln x) dx = ln(ln x) → ∞.",10],["Σ (−1)ⁿ/ln n, n ≥ 2",1,"Alternating with 1/ln n decreasing to 0; but 1/ln n > 1/n, so the absolute series diverges.",10],
 ["Σ sin(n)/n²",0,"|sin n/n²| ≤ 1/n², which converges.",10],["Σ eⁿ/n²",2,"The terms grow without bound.",10],["Σ (−1)ⁿ·(0.9)ⁿ",0,"Geometric with |r| = 0.9.",10],
 ["Σ 5/(n³ + 2)",0,"Compare with 5/n³.",10],["Σ (n² + 1)/(n² + 5)",2,"The terms approach 1.",10],["Σ (−1)ⁿ⁺¹/n^(2/3)",1,"Alternating test passes; p = 2/3 for the absolute series.",10],
 ["Σ 2ⁿ/n!",0,"Ratio test: 2/(n + 1) → 0.",10],["Σ nⁿ/n!",2,"Ratio test: (1 + 1/n)ⁿ → e > 1.",10],["Σ 1/(3ⁿ + n)",0,"Compare with Σ(1/3)ⁿ.",10],
 ["Σ cos(πn)/n",1,"cos(πn) = (−1)ⁿ, so this is the alternating harmonic series.",10],["Σ 1/(n(n + 1))",0,"Telescopes to 1; also compare with 1/n².",10]
];
