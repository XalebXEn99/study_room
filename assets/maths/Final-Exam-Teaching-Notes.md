# MATH2016 Final Examination — Teaching Notes (03 November 2026, 14:00, Old Multipurpose Sports Hall, 1 h 30 min)

Compiled from: `Appendix-exam.pdf`, Weeks 2–12 notes, Exercises 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, TT1, TT2, the 2026 midterm and its partial solution, and J. Lebl, *An Introduction to Real Analysis* (`realanal.pdf`), Chapters 3–5.
Everything below is either quoted from those files or is a proof skeleton taken from them. **Week 1 notes are not in this folder** (Exercise 2 refers to "Week 1 Notes, page 1" = Lebl Prop 3.2.2, the sequential characterisation of continuity) — fetch them separately.

**How to read this document.** Every ⚑ line is a **collapsed footnote** — click it to open an exam warning, a marking note, or something to memorise. Proof skeletons are set off by a bold **Proof.** on its own line.

---

## 0. How the paper is built (evidence from TT1, TT2, the midterm)

Question types that recur, in order of cheapness:

1. **State a definition / fill in a definition** (TT2 Q2: write \(L(P,f)\), \(U(P,f)\), \(\underline{\int}\), \(\overline{\int}\), "Riemann integrable iff …").

2. **Fill in an inequality / complete a statement** (TT2 Q3(b) refinement inequalities, Q5 Riemann's condition).

3. **Compute a concrete Darboux sum or integral from the definition** (TT2 Q4, Ex 9 Q1–Q5).

4. **Give an example / counterexample, no justification required but all-or-nothing marking** (midterm Q3).

5. **"By means of the definition, prove …"** (midterm Q5 continuity at 0; Q7 uniform continuity on \(\mathbb{Z}\)).

6. **"Use theorem X to prove …"** — the theorem is the mandated method (midterm Q9 IFT, Q10 MVT, Ex 12 Q5 integration by parts).

7. **Finish a proof / explain a step** (Ex 9 Q4, Ex 10 rubrics, Week 11 "left as an exercise").

8. **Apply the machinery to a new function** (Ex 8 Q1 Darboux, Ex 10 Q7–Q10 MVT-for-integrals family, Ex 12 FTC family).

Marking discipline (quoted from the midterm "Important note" blocks and exercise rubrics):

- *"The order of quantifiers tells us that \(M\) cannot depend on \(x\)."*

- *"The differentiability of \(F\) does not follow from the differentiability of \(f\) (they are not the same functions) and so Proposition 1 does not apply here."*

- *"In part (c), the domain had to be stated, since uniform continuity depends on the domain."*

- *"This question was marked on an all-or-nothing basis for each part."*

- Midterm Q9: *"the hypotheses of the Inverse Function Theorem also had to be checked before applying it"*; *"merely stating the final derivative … was not sufficient for full credit."*

- Ex 9 Q5 rubric: *"Check whether the value of the integral is obtained from the definition rather than by inspection or by using antiderivatives."*

- Ex 8 Q1 rubric: *"Is the setup for a proof by contradiction done correctly?"* — negate precisely (\(\le\) vs \(<\)).

**Citation rule (from TT instructions):** *"When referring to a result, follow the numbering given in the appendix."* The final appendix has **16** results. Anything else must be stated and justified yourself (see §5 for the list).

<details>
<summary>⚑ Exam note — what "cite by number" does and does not buy you</summary>

The appendix is a licence to say "by Theorem 4" instead of reproving the MVT — nothing more. It does **not** cover the chain rule, the product/quotient rules, linearity or additivity of \(\int\), "\(f'\equiv0\Rightarrow f\) constant", Taylor, the derivative tests, change of variables, monotone \(\Rightarrow\) integrable, or "finitely many discontinuities \(\Rightarrow\) integrable". If one of those is the engine of your argument, write its statement and its proof (or a justification) in your own words. And when you do cite, use the appendix numbering — *not* the Lebl section number or the week number; the rubric sentence above is quoted from the instructions for a reason.

</details>

---

## 1. Appendix map — the only 16 results you may cite by number

Bold text in the middle column is the **hypothesis** part of the statement: those are the words you must reproduce, not just the conclusion.

| Appendix | Statement (hypotheses in **bold**) | Textbook | Lecture |
|---|---|---|---|
| Prop 1 | \(f:I\to\mathbb{R}\) differentiable at \(c\in I\) ⇒ continuous at \(c\) | 4.1.6 | W6 |
| Lemma 2 | \(f:(a,b)\to\mathbb{R}\) differentiable at \(c\), **relative min or max at \(c\)** ⇒ \(f'(c)=0\) | 4.2.2 | W5/6 |
| Thm 3 Rolle | **cont. on \([a,b]\)**, **diff. on \((a,b)\)**, \(f(a)=f(b)\) ⇒ \(\exists c\in(a,b): f'(c)=0\) | 4.2.3 | W6 |
| Thm 4 MVT | **cont. on \([a,b]\)**, **diff. on \((a,b)\)** ⇒ \(\exists c\in(a,b): f(b)-f(a)=f'(c)(b-a)\) | 4.2.4 | W6 |
| Prop 5 | \(f:I\to\mathbb{R}\) differentiable: increasing ⇔ \(f'\ge0\) on \(I\); decreasing ⇔ \(f'\le0\) | 4.2.7 | W6/7 |
| Thm 6 IFT | \(f\in C^1(a,b)\), \(f'(x_0)\ne0\) ⇒ local \(C^1\) inverse \(g\), \(g'(y)=1/f'(g(y))\) | 4.4.2 | W6 |
| Thm 7 Darboux | \(f\) differentiable on \([a,b]\), \(f'(a)<y<f'(b)\) ⇒ \(\exists c\in(a,b): f'(c)=y\) | 4.2.11 | W7 |
| Prop 8 | \(f\) bounded, \(m\le f\le M\) ⇒ \(m(b-a)\le L(P,f)\le U(P,f)\le M(b-a)\) for **every** partition | 5.1.2 | W8 |
| Prop 9 | \(\tilde P\) refinement of \(P\) ⇒ \(L(P,f)\le L(\tilde P,f)\), \(U(\tilde P,f)\le U(P,f)\) | 5.1.7 | W8 |
| Prop 10 | \(m(b-a)\le\underline{\int_a^b}f\le\overline{\int_a^b}f\le M(b-a)\) | 5.1.8 | W8 |
| Prop 11 Riemann condition | \(f\) bounded: integrable ⇔ \(\forall\varepsilon>0\ \exists P: U(P,f)-L(P,f)<\varepsilon\) | 5.1.13 | W9 |
| Prop 12 Monotonicity | \(f,g\) integrable, \(f\le g\) ⇒ \(\int f\le\int g\) | 5.2.6 | W10 |
| Thm 13 | \(f\) integrable ⇒ \(\lvert f\rvert\) integrable and \(\bigl\lvert\int f\bigr\rvert\le\int\lvert f\rvert\) | 5.2 (course addition) | W11 |
| Lemma 14 | \(f\) continuous on \([a,b]\) ⇒ \(f\in\mathcal{R}[a,b]\) | 5.2.7 | W11 |
| Thm 15 FTC1 | \(F\) cont. on \([a,b]\), diff. on \((a,b)\), \(f\in\mathcal{R}[a,b]\), \(F'=f\) on \((a,b)\) ⇒ \(\int_a^b f=F(b)-F(a)\) | 5.3.1 | W11 |
| Thm 16 FTC2 | \(f\in\mathcal{R}[a,b]\), \(F(x)=\int_a^x f\) ⇒ \(F\) continuous; if \(f\) continuous at \(c\) then \(F'(c)=f(c)\) | 5.3.3 | W12 |

<details>
<summary>⚑ To remember — the split is 7 + 9, and they are numbered in order</summary>

Results **1–7 are all differentiability** (Prop 1, Fermat, Rolle, MVT, monotonicity, IFT, Darboux) and results **8–16 are all integration** (Props 8, 9, 10, 11, 12, 13, Lemma 14, FTC1, FTC2). If you can recite those sixteen titles in that order you have the appendix, and the only real risk left is dropping a hypothesis.

</details>

---

## 2. Definitions to write verbatim

**Derivative (Lebl 4.1.1).**

Let \(I\) be an interval, \(f:I\to\mathbb{R}\), \(c\in I\). If the limit

\[
f'(c):=\lim_{x\to c}\frac{f(x)-f(c)}{x-c}
\]

exists and is finite, \(f\) is *differentiable at \(c\)*; equivalently \(\lim_{h\to0}\frac{f(c+h)-f(c)}{h}\) exists.

Existence at an **endpoint** of a closed interval means the appropriate one-sided limit.

<details>
<summary>⚑ Exam note — one-sided limits at endpoints</summary>

If \(c\) sits at an endpoint of \([a,b]\) the difference quotient has only one side, so write \(\lim_{x\to c^+}\) (or \(x\to c^-\)) and say so. Quoting a two-sided limit at \(a\) or \(b\) is a wrong statement, not a minor slip — and it is exactly the hypothesis wording that Rolle, MVT and FTC1 ask you to check.

</details>

**Continuously differentiable.**

\(f\) differentiable on \(I\) and \(f'\) continuous on \(I\); the class is \(C^1(I)\) (Week 6).

**\(n\) times differentiable / \(f^{(n)}\).**

\(f^{(n)}:=(f^{(n-1)})'\); *analytic* = Taylor series at each \(x_0\) converges to \(f\) near \(x_0\) (Week 7).

**Relative (local) minimum (Lebl 4.2.1).**

There exists \(\delta>0\) such that \(f(x)\ge f(c)\) for every \(x\in S\) with \(\lvert x-c\rvert<\delta\).

*Absolute* minimum: the same inequality for **all** \(x\in S\). Maxima are defined by reversing the inequalities.

*Strict relative minimum* (Week 7): \(f(x)>f(c)\) for all \(x\in(c-\delta,c+\delta)\) with \(x\ne c\).

**Injective / surjective / bijective** (Week 6 definition).

Needed to state IFT and inverse-function results: injective = distinct points have distinct values, surjective = onto \(J\), bijective = both.

**Partition (5.1.1).**

\(P=\{x_0,\dots,x_n\}\) with \(a=x_0<x_1<\dots<x_n=b\); \(\Delta x_i:=x_i-x_{i-1}\).

\[
m_i:=\inf\{f(x):x_{i-1}\le x\le x_i\},\qquad M_i:=\sup\{f(x):x_{i-1}\le x\le x_i\},
\]

\[
L(P,f):=\sum_{i=1}^n m_i\Delta x_i,\qquad U(P,f):=\sum_{i=1}^n M_i\Delta x_i ,
\]

\[
\underline{\int_a^b}f:=\sup_P L(P,f),\qquad \overline{\int_a^b}f:=\inf_P U(P,f).
\]

<details>
<summary>⚑ To remember — these six symbols are what TT2 Q2 asked for</summary>

Write them in this order until it is automatic: \(\Delta x_i\), \(m_i\), \(M_i\), \(L(P,f)\), \(U(P,f)\), then the lower and upper integral. Two details that separate full marks from half: \(m_i\) and \(M_i\) are inf/sup over the **closed** subinterval \(x_{i-1}\le x\le x_i\), and the lower integral is a **sup** of lower sums while the upper integral is an **inf** of upper sums — not the other way round.

</details>

**Riemann integrable (5.1.9).**

\(f\) **bounded** on \([a,b]\) and \(\underline{\int_a^b}f=\overline{\int_a^b}f\); the common value is \(\int_a^b f\). The class is \(\mathcal{R}[a,b]\).

<details>
<summary>⚑ Exam note — never drop the word "bounded"</summary>

TT2 Q2 asked for exactly these symbols, and the integrability definition carries **bounded** as part of it. Boundedness is what makes \(\sup_P L(P,f)\) and \(\inf_P U(P,f)\) exist as real numbers (the TT2 bonus two definitions below), so writing only the equality of the two integrals is a substantive error, not shorthand.

</details>

**Refinement (5.1.6).**

\(\tilde P\) refines \(P\) iff \(P\subset\tilde P\) as sets.

**Convention.**

\(\int_a^a f:=0\); for \(b<a\), \(\int_a^b f:=-\int_b^a f\) (Week 9). Also \(\int_a^b f(s)\,ds=\int_a^b f(x)\,dx\) (dummy variable).

**Why boundedness is part of the definition** (TT2 bonus).

Bounded \(f\) ⇒ \(\{L(P,f)\}\) bounded above (by \(M(b-a)\)) and \(\{U(P,f)\}\) bounded below, so completeness of \(\mathbb{R}\) makes the sup and inf exist as real numbers.

---

## 3. Differentiability: statements, proof skeletons, and what to do with them

### 3.1 Prop 1 (differentiable ⇒ continuous)

**Proposition 1 (appendix).** Let \(I\) be an interval, \(f:I\to\mathbb{R}\), \(c\in I\). If \(f\) is differentiable at \(c\), then \(f\) is continuous at \(c\).

**Proof.**

\(f(x)-f(c)=\dfrac{f(x)-f(c)}{x-c}\,(x-c)\to f'(c)\cdot 0=0\), so \(f(x)\to f(c)\) as \(x\to c\).

*Uses:*

1. to prove continuity from a derivative hypothesis;
2. contrapositive — discontinuous ⇒ not differentiable (\(\lvert x\rvert\) at 0).

<details>
<summary>⚑ Marking note — Proposition 1 does not transfer to a new function</summary>

The midterm's "Important note" says it in words: *"The differentiability of \(F\) does not follow from the differentiability of \(f\) (they are not the same functions) and so Proposition 1 does not apply here."* Check differentiability of the function actually in front of you, never of the one it is built from.

</details>

### 3.2 Lemma 2 (Fermat) + Rolle (Thm 3) + MVT (Thm 4)

**Lemma 2 (Fermat, appendix).** Let \(f:(a,b)\to\mathbb{R}\) be differentiable at \(c\in(a,b)\). If \(f\) has a relative minimum or maximum at \(c\), then \(f'(c)=0\).

**Proof.**

Difference quotients are \(\le0\) from one side, \(\ge0\) from the other ⇒ the limit, if it exists, is \(0\).

Hypotheses that must hold: \(c\) **interior**, \(f\) **differentiable at \(c\)**. \(\lvert x\rvert\) at \(0\) shows differentiability is needed; \(x\mapsto x\) on \([0,1]\) shows interiority is needed.

**Rolle (Thm 3, appendix).** Let \(f:[a,b]\to\mathbb{R}\) be continuous on \([a,b]\), differentiable on \((a,b)\), with \(f(a)=f(b)\). Then \(\exists c\in(a,b)\) with \(f'(c)=0\).

**Proof.**

\(f\) continuous on the closed bounded interval ⇒ EVT gives absolute min at \(x\) and max at \(y\). If both are endpoints, \(f\) is constant on \([a,b]\) … argue \(f'\equiv0\) there. Otherwise some extremum is at interior \(c\) ⇒ Lemma 2.

**MVT (Thm 4, appendix).** Let \(f:[a,b]\to\mathbb{R}\) be continuous on \([a,b]\) and differentiable on \((a,b)\). Then \(\exists c\in(a,b)\) with \(f(b)-f(a)=f'(c)(b-a)\).

**Proof.**

Set \(g(x)=f(x)-f(a)-\dfrac{f(b)-f(a)}{b-a}(x-a)\); then \(g\) is cont. on \([a,b]\), diff. on \((a,b)\), \(g(a)=g(b)=0\) ⇒ Rolle at \(c\) ⇒ result.

**Cauchy MVT** (Thm 4.2.5, Week 6, **not in the appendix**): \((f(b)-f(a))\varphi'(c)=f'(c)(\varphi(b)-\varphi(a))\), via \(g(x)=(f(x)-f(b))(\varphi(b)-\varphi(a))-(f(b)-f(a))(\varphi(x)-\varphi(b))\).

<details>
<summary>⚑ To remember — say the hypotheses in the order the appendix writes them</summary>

continuous on the **closed** \([a,b]\), differentiable on the **open** \((a,b)\), and for Rolle also \(f(a)=f(b)\); the conclusion produces \(c\in(a,b)\) — open. An answer that applies Rolle or MVT without checking all three in words loses the method marks even when the arithmetic is right.

</details>

**MVT is the tool whenever the hypothesis is a bound on \(f'\) and the conclusion is a bound on \(f\):**

\[
\lvert f(u)-f(v)\rvert=\lvert f'(c)\rvert\,\lvert u-v\rvert\le K\lvert u-v\rvert .
\]

### 3.3 Monotonicity results (all MVT corollaries)

- **\(f'\equiv0\Rightarrow f\) constant** (Lebl 4.2.6 — *not* in your appendix, so reproduce the three lines).

  **Proof.**

  Take \(x<y\) in the interval \(I\), so \([x,y]\subset I\); MVT gives \(f(y)-f(x)=f'(c)(y-x)=0\).

- **\(f'>0\) on \(I\Rightarrow f\) strictly increasing** (Lebl 4.2.8; \(f'<0\Rightarrow\) strictly decreasing; converse false: \(x^3\) at \(0\)).

- **Prop 5 (iff with \(\ge\))**:

  **Proof.**

  \(\Rightarrow\) direction: difference quotients are \(\ge0\), so their limit is \(\ge0\). \(\Leftarrow\): apply MVT on \([x,y]\) and use \(f'(c)\ge0\).

- **First derivative test (Lebl/Prop 4.2.9, Week 7, not in appendix):** \(f\) continuous on \((a,b)\), differentiable on \((a,c)\) and \((c,b)\), \(f'\le0\) left of \(c\) and \(f'\ge0\) right of \(c\) ⇒ absolute min at \(c\).

  **Proof.**

  Use a sequence \(y_n\uparrow c\) plus continuity: \(f(x)\ge f(y_n)\to f(c)\).

### 3.4 Darboux's theorem (Thm 7)

**Theorem 7 (appendix).** Let \(f\) be differentiable on \([a,b]\) with \(f'(a)<y<f'(b)\). Then \(\exists c\in(a,b)\) with \(f'(c)=y\).

**Proof.**

Set \(g(x):=yx-f(x)\), so \(g\) is continuous on \([a,b]\), differentiable, \(g'(a)=y-f'(a)>0\), \(g'(b)=y-f'(b)<0\). EVT ⇒ max at \(c\in[a,b]\). Because \(g'(a)>0\), **some difference quotient is positive**, so there is \(x>a\) with \(g(x)>g(a)\) ⇒ \(c\ne a\); similarly \(c\ne b\); hence \(c\in(a,b)\) and Lemma 2 gives \(g'(c)=0\), i.e. \(f'(c)=y\). If \(f'(a)>y>f'(b)\) use \(g(x)=f(x)-yx\).

<details>
<summary>⚑ Exam note — the two steps that carry the marks</summary>

(1) excluding the endpoints is the whole difficulty: \(g'(a)>0\) gives \(g(x)>g(a)\) for **some** \(x\) near \(a\), which is what forces \(c\ne a\); (2) if the question instead asks you to prove \(f'\) has constant sign (Ex 8 Q1), the contradiction must be negated precisely — \(\exists d: f'(d)\le0\), and only combined with \(f'\ne0\) does that become \(f'(d)<0\). The Ex 8 rubric asks literally: *"Is the setup for a proof by contradiction done correctly?"*

</details>

Consequences you must be able to state:

- A derivative has the intermediate value property **even when it is not continuous**.

- If \(f\) is differentiable on \((a,b)\) and \(f'(x)\ne0\) for all \(x\), then \(f'\) is either always positive or always negative (Ex 8 Q1 — proof by contradiction + Darboux).

- A function with a jump discontinuity (e.g. \(\operatorname{sgn}\)) is **not** a derivative of any function.

- Contrast (Week 4): \(\sin(1/x)\) with value \(0\) at \(0\) is discontinuous yet has the IVP — IVP does not characterise derivatives.

### 3.5 Chain rule (Lebl 4.1.10, Week 6, not in appendix)

\(I_1,I_2\) intervals, \(g:I_1\to I_2\) differentiable at \(c\), \(f:I_2\to\mathbb{R}\) differentiable at \(g(c)\); then \((f\circ g)'(c)=f'(g(c))g'(c)\).

**Proof.**

Memorise the auxiliary-function trick. With \(d=g(c)\),

\[
u(y):=\begin{cases}\frac{f(y)-f(d)}{y-d},&y\ne d\\ f'(d),&y=d\end{cases}\qquad
v(x):=\begin{cases}\frac{g(x)-g(c)}{x-c},&x\ne c\\ g'(c),&x=c\end{cases}
\]

are continuous at \(d\) and \(c\); and \(\frac{h(x)-h(c)}{x-c}=u(g(x))\,v(x)\to f'(d)g'(c)\).

*Where it is used later:* change of variables (Week 12) and differentiating \(F(x)=\int_a^{u(x)}f\).

Also from Lebl 4.1: **linearity (4.1.7)**, **product rule (4.1.8)**, **quotient rule (4.1.9, needs \(g(c)\ne0\))** — quote by name; you are never asked to reprove them but you must state the needed hypothesis (denominator nonzero).

### 3.6 Endpoint derivatives from limits of \(f'\) (Lebl 4.2.10, optional-material grade but cheap to know)

If \(f\) is continuous on \([a,b)\), differentiable on \((a,b)\) and \(\lim_{x\to a^+}f'(x)=L\), then \(f'(a)=L\) (proved with MVT, not with the definition). Useful to justify "differentiable on all of \([a,b]\)" hypotheses of Rolle/MVT/FTC1.

### 3.7 Inverse Function Theorem (Thm 6) and its lemma

**Lemma (Lebl 4.4.1).** Let \(f:I\to J\) be strictly monotone, onto, differentiable at \(x_0\), with \(f'(x_0)\ne0\). Then \(f^{-1}\) is differentiable at \(y_0=f(x_0)\) with \((f^{-1})'(y_0)=1/f'(x_0)\).

**Proof.**

Define \(Q(x)=\frac{x-x_0}{f(x)-f(x_0)}\) for \(x\ne x_0\) and \(Q(x_0)=1/f'(x_0)\); \(Q\) is continuous at \(x_0\); \(f^{-1}\) is continuous (Week 5: strictly monotone ⇒ inverse continuous); so \(Q\circ f^{-1}(y)=\frac{f^{-1}(y)-f^{-1}(y_0)}{y-y_0}\) is continuous at \(y_0\).

**Theorem 6 (appendix).** Let \(f\in C^1(a,b)\) with \(f'(x_0)\ne0\). Then \(f\) has a local \(C^1\) inverse \(g\) near \(y_0=f(x_0)\), and \(g'(y)=1/f'(g(y))\).

**Proof.**

WLOG \(f'(x_0)>0\); \(C^1\) ⇒ \(f'>0\) on some \((x_0-\delta,x_0+\delta)\) ⇒ \(f\) strictly increasing there (4.2.8) ⇒ bijective onto \(J:=f(I)\); \(J\) is an interval (IVT + continuity); apply the lemma.

*Required checklist in an answer:* (1) identify the two inverse functions and say explicitly that they are inverses; (2) verify \(C^1\) and \(f'\ne0\); (3) apply; (4) simplify. Worked instance: \(\ln\) as inverse of \(\exp\) ⇒ \((\ln x)'=1/x\) (midterm Q9).

<details>
<summary>⚑ Marking note — how IFT questions are scored</summary>

Midterm Q9 recorded that *"the hypotheses of the Inverse Function Theorem also had to be checked before applying it"* and that *"merely stating the final derivative … was not sufficient for full credit."* So the two lines that earn the marks are **\(f\in C^1\)** and **\(f'(x_0)\ne0\)**, written as words about your specific function, before any differentiation.

</details>

### 3.8 Taylor's theorem (Thm 4.3.2, Week 7 — **not in the appendix; the lecture omits the proof**)

Hypotheses: \(f:[a,b]\to\mathbb{R}\) has \(n\) **continuous** derivatives on \([a,b]\) and \(f^{(n+1)}\) exists on \((a,b)\). For distinct \(x_0,x\in[a,b]\) there is \(c\) **between \(x_0\) and \(x\)** with

\[
f(x)=P_{x_0}^n(x)+\frac{f^{(n+1)}(c)}{(n+1)!}(x-x_0)^{n+1},\qquad
P_{x_0}^n(x)=\sum_{k=0}^{n}\frac{f^{(k)}(x_0)}{k!}(x-x_0)^k .
\]

\(R^n_{x_0}(x)=\frac{f^{(n+1)}(c)}{(n+1)!}(x-x_0)^{n+1}\) is the **Lagrange form of the remainder**; \(n=0\) recovers the MVT.

Standard exam use (error bound): if \(\lvert f^{(n+1)}\rvert\le M\) on the interval, then \(\lvert R^n_{x_0}(x)\rvert\le\frac{M}{(n+1)!}\lvert x-x_0\rvert^{n+1}\).

**Second derivative test (Prop 4.3.3, Week 7).** \(f\in C^2(a,b)\), \(f'(x_0)=0\), \(f''(x_0)>0\) ⇒ strict relative min at \(x_0\).

**Proof.**

Continuity of \(f''\) ⇒ \(f''>0\) on \((x_0-\delta,x_0+\delta)\); Taylor at \(n=1\): \(f(x)=f(x_0)+\frac{f''(c)}{2}(x-x_0)^2>f(x_0)\).

<details>
<summary>⚑ Remember — Taylor is yours to state, not the appendix's</summary>

Thm 4.3.2 is **not** one of the 16 appendix results and the lecture skipped its proof, so a question that says "by Taylor's theorem" expects you to write the hypotheses exactly: \(n\) **continuous** derivatives on the closed \([a,b]\), \(f^{(n+1)}\) existing on the open \((a,b)\), and \(c\) lying **between** \(x_0\) and \(x\). \(n=0\) is the MVT, which is why the theorem is really "the MVT, iterated".

</details>

### 3.9 The "differentiable but \(f'\) not continuous" library (Week 6)

- \(f(x)=x^2\sin(1/x),\ f(0)=0\): differentiable everywhere, \(f'(x)=2x\sin(1/x)-\cos(1/x)\) for \(x\ne0\), \(f'(0)=0\); \(f'\) discontinuous at 0. So **Prop 1 has no converse**.

- \(f(x)=(x\sin(1/x))^2,\ f(0)=0\): differentiable everywhere, minimum at 0, but \(f'\) changes sign infinitely often near 0. So **the first derivative test needs sign information on a whole side**, not just at critical points.

- \(f(x)=x^2\lvert x\rvert\) (Ex 6 Q6): \(f'(x)=3x^2\ (x>0),\ 0\ (x=0),\ -3x^2\ (x<0)\); \(f''(x)=6x,\ 0,\ -6x\); \(f'''(0)\) does not exist.

- \(x\mapsto\lvert x\rvert\) at 0: one-sided quotients \(\pm1\) ⇒ not differentiable. \(x\mapsto\sqrt{x}\) at \(0^+\): quotient \(=1/\sqrt{x}\to\infty\) ⇒ not differentiable (Lebl Ex 4.1).

<details>
<summary>⚑ To remember — these four are the whole counterexample bank for Chapter 4</summary>

Every "give an example" question on differentiability in Weeks 2–12, the midterm and TT1/TT2 is answered from this list: \(x^2\sin(1/x)\) for a discontinuous derivative, \((x\sin(1/x))^2\) for a derivative with no sign pattern near a minimum, \(x^2\lvert x\rvert\) for an exact differentiability order, \(\lvert x\rvert\) and \(\sqrt{x}\) for failure at a corner or a vertical tangent. Know each formula cold enough to write it in ten seconds.

</details>

---

## 4. Integration: statements, proof skeletons, and computations

### 4.1 The three elementary inequalities (Props 8, 9, 10)

- **Prop 8.** \(f\) bounded with \(m\le f(x)\le M\) on \([a,b]\) ⇒ \(m(b-a)\le L(P,f)\le U(P,f)\le M(b-a)\) for **every** partition \(P\).

  **Proof.**

  Pointwise \(m\le m_i\le M_i\le M\), and \(\sum_i\Delta x_i=b-a\); multiply by \(\Delta x_i>0\) and sum.

- **Prop 9 (refinement).** \(\tilde P\) refines \(P\) ⇒ \(L(P,f)\le L(\tilde P,f)\) and \(U(\tilde P,f)\le U(P,f)\).

  **Proof.**

  Notation-heavy, and a *known "finish the proof" exercise* (Ex 9 Q4 asks for \(U(\tilde P,f)\le U(P,f)\)). Write \(\tilde P=\{\tilde x_0,\dots,\tilde x_\ell\}\), find \(k_0<\dots<k_n\) with \(x_i=\tilde x_{k_i}\), then \(\Delta x_i=\sum_{q=k_{i-1}+1}^{k_i}\Delta\tilde x_q\) and \(m_i\le\tilde m_q\) on those pieces, hence \(m_i\Delta x_i\le\sum_q\tilde m_q\Delta\tilde x_q\).

- **Prop 10** = Prop 8 + taking sup/inf.

  **Proof.**

  The key middle step \(\underline{\int}\le\overline{\int}\) uses the **common refinement** \(P_1\cup P_2\): \(L(P_1,f)\le L(P_1\cup P_2,f)\le U(P_1\cup P_2,f)\le U(P_2,f)\), so every lower sum is \(\le\) every upper sum; take sup then inf.

### 4.2 Riemann's integrability condition (Prop 11) — the workhorse

**Proposition 11 (appendix).** Let \(f\) be bounded on \([a,b]\). Then \(f\in\mathcal{R}[a,b]\) iff for every \(\varepsilon>0\) there is a partition \(P\) with \(U(P,f)-L(P,f)<\varepsilon\).

**Proof.**

\((\Rightarrow)\) integrable + \(\varepsilon\): pick \(P_1\) with \(L(P_1,f)>\underline{\int}f-\varepsilon/2\) (definition of sup!) and \(P_2\) with \(U(P_2,f)<\overline{\int}f+\varepsilon/2\); put them together.

\((\Leftarrow)\) \(0\le\overline{\int}f-\underline{\int}f\le U(P,f)-L(P,f)<\varepsilon\) for every \(\varepsilon>0\).

Four standard applications — know all four proofs (all are in your files):

1. **Monotone ⇒ integrable** (Lebl 5.2.11, Ex 11 Q4 full solution).

   **Proof.**

   Bounded by \(f(a),f(b)\); uniform partition; \(m_i=f(x_{i-1}),M_i=f(x_i)\); then \(U-L=\frac{b-a}{n}(f(b)-f(a))\to0\) (telescoping). Decreasing via \(-f\); then linear combinations.

2. **Continuous ⇒ integrable** (Lemma 14 = 5.2.7, Week 11).

   **Proof.**

   Uses **uniform continuity** on \([a,b]\) with \(\varepsilon/(b-a)\), plus **EVT** to say \(M_i-m_i=f(x)-f(y)\) for actual points \(x,y\) in the subinterval.

3. **Bounded + finitely many discontinuities ⇒ integrable** (Thm 5.2.9, Week 11).

   **Proof.**

   Cut at the discontinuities; on each piece use Lemma 14 on the interior closed subintervals plus **Lemma 5.2.8** (the "exhaust the endpoints with sequences \(a_n\downarrow a, b_n\uparrow b\)" lemma, whose proof uses **Bolzano–Weierstrass**).

4. **Changing finitely many values** (Prop 5.2.10, Ex 10 Q1 full solution — the model \(\varepsilon\)-proof of the course).

   **Proof.**

   Let \(d=\lvert f(0)-g(0)\rvert\); choose \(\delta<x_1/2\) with \(d\delta<\varepsilon/2\); set \(Q=\{0,\delta,x_1,\dots,x_n\}\); then \(U(Q,g)-L(Q,g)\le U(Q,f)-L(Q,f)+d\delta<\varepsilon\); and \(U(Q,g)\le U(Q,f)+d\delta\), \(L(Q,g)\ge L(Q,f)-d\delta\) squeeze the two integrals within \(\varepsilon\).

**Non-integrable model** (TT2 Q6, Dirichlet): \(1_{\mathbb{Q}}\) on \([2,5]\) has \(m_i=0,M_i=1\) on every subinterval (density of \(\mathbb{Q}\) **and** \(\mathbb{R}\setminus\mathbb{Q}\) is the reason), so \(\underline{\int}=0\), \(\overline{\int}=3\).

**Harder** (know the idea, Lebl Ex 5.2.11): the Thomae/popcorn function on \([0,1]\) **is** integrable with integral \(0\) — for each \(k\) only finitely many points have value \(\ge1/k\).

<details>
<summary>⚑ Exam note — Lemma 5.2.8 is not in your appendix</summary>

Application 3 leans on Lemma 5.2.8, which Week 11 proves but the appendix does not list, so expect to be asked *"explain why the restriction to \([a_i,b_i]\) is integrable"* and to justify it by citing Lemma 14 on the interior closed subintervals. Likewise "not integrable" must be shown numerically — \(\overline{\int}-\underline{\int}>0\), or an \(\varepsilon_0\) with \(U(P,f)-L(P,f)\ge\varepsilon_0\) for **every** \(P\) — never by calling the function pathological.

</details>

### 4.3 Properties of the integral (Week 10)

- **Additivity in the interval** (Lebl 5.2.2): \(f\in\mathcal{R}[a,c]\iff f\in\mathcal{R}[a,b]\) and \(f\in\mathcal{R}[b,c]\); then \(\int_a^c=\int_a^b+\int_b^c\).

  **Proof.**

  \(L(P_1\cup P_2,f)=L(P_1,f)+L(P_2,f)\), and *partitions containing \(b\) suffice* because adding a point only increases lower sums / decreases upper sums (Prop 9). Corollary 5.2.3: restriction to a subinterval is integrable (Ex 11 Q1).

- **Linearity** (5.2.4): \(\int(\alpha f+\beta g)=\alpha\int f+\beta\int g\).

  **Proof.**

  For \(\alpha<0\) use \(\inf(\alpha f)=-\alpha\sup f\) i.e. \(L(P,-f)=-U(P,f)\) (Ex 10 Q4). For the sum (Ex 10 Q5 / Lebl Ex 5.2.2) find **one** partition working for both functions — the common refinement.

- **Only sub/super-additivity for non-integrable functions** (5.2.5): \(\overline{\int}(f+g)\le\overline{\int}f+\overline{\int}g\), \(\underline{\int}(f+g)\ge\underline{\int}f+\underline{\int}g\); equality can fail (Ex 11 Q5(b): \(f=1_{\mathbb{Q}}\), \(g=-f\): both sides collapse to \(0\) while each upper integral is \(1\) and each lower is \(0\)).

- **Monotonicity** (Prop 12) and the estimate \(\bigl\lvert\int f\bigr\rvert\le M(b-a)\) when \(\lvert f\rvert\le M\) (Week 9).

- **Thm 13 (\(|f|\)).** \(f\in\mathcal{R}[a,b]\) ⇒ \(\lvert f\rvert\in\mathcal{R}[a,b]\) and \(\bigl\lvert\int f\bigr\rvert\le\int\lvert f\rvert\).

  **Proof.**

  The inequality is two lines once \(\lvert f\rvert\) is known integrable: \(-\lvert f\rvert\le f\le\lvert f\rvert\) ⇒ \(\int f\le\int\lvert f\rvert\) and \(-\int f=\int(-f)\le\int\lvert f\rvert\).

  For integrability use Riemann's criterion with the **reverse triangle inequality** \(\bigl|\lvert f(u)\rvert-\lvert f(v)\rvert\bigr|\le\lvert f(u)-f(v)\rvert\), giving \(U(P,\lvert f\rvert)-L(P,\lvert f\rvert)\le U(P,f)-L(P,f)\). The \(\max\{f,-f\}=\frac{f+\lvert f\rvert}{2}\) route (the Ex 2 Q8 identity) only works once products of integrable functions are known integrable, so write the Riemann-criterion argument.

- **Riemann sums** (Lebl 5.1.13 / Ex 9 Q7): for any tags \(c_k\in[x_{k-1},x_k]\), \(L(P,f)\le\sum f(c_k)\Delta x_k\le U(P,f)\); if \(f\) is integrable and the mesh \(\max_k\Delta x_k\to0\), those sums converge to \(\int_a^b f\).

- **Mean value theorem for integrals** (Ex 10 Q7, Lebl Ex 5.2.4): \(f\) continuous ⇒ \(\exists c\in[a,b]\) with \(\int_a^b f=f(c)(b-a)\).

  **Proof.**

  EVT gives min/max points; Prop 10-style bounds \(m(b-a)\le\int f\le M(b-a)\); IVT.

- **Vanishing integral ⇒ function zero** (Ex 10 Q8/Q9, Lebl Ex 5.2.5): \(f\) continuous, \(f\ge0\), \(\int_a^b f=0\) ⇒ \(f\equiv0\).

  **Proof.**

  If \(f(c)>0\), continuity ⇒ \(f>f(c)/2>0\) on \((c-\alpha,c+\alpha)\subset(a,b)\) ⇒ \(\int_a^b f\ge\frac{f(c)}{2}\cdot 2\alpha>0\), contradiction; endpoints handled by moving inside, or by the "change values at finitely many points" proposition.

  Family: \(\int f=0\) ⇒ some zero (5.2.6); \(\int f=\int g\) ⇒ \(f(c)=g(c)\) somewhere (5.2.7) — both via \(h=f-g\) and IVT.

- **\(\int_\alpha^\gamma f=\int_\alpha^\beta f+\int_\beta^\gamma f\) for arbitrary order** (Lebl Ex 5.2.8) — follows from the conventions \(\int_a^a=0,\ \int_a^b=-\int_b^a\).

<details>
<summary>⚑ Marking note — linearity and additivity are not appendix results</summary>

Neither is citable by number, so an answer must either name them as lecture results and justify the step, or prove them. The two proofs the markers expected are exactly the ones above: \(L(P,-f)=-U(P,f)\) for a negative scalar, and a **common refinement** to get one partition serving both functions.

</details>

### 4.4 FTC1 (Thm 15)

**Theorem 15 (appendix).** Let \(F\) be continuous on \([a,b]\) and differentiable on \((a,b)\), let \(f\in\mathcal{R}[a,b]\), and suppose \(F'(x)=f(x)\) for \(x\in(a,b)\). Then \(\int_a^b f=F(b)-F(a)\).

**Proof.**

For any partition \(P\), MVT on each \([x_{i-1},x_i]\) gives \(c_i\) with \(F(x_i)-F(x_{i-1})=f(c_i)\Delta x_i\); since \(m_i\le f(c_i)\le M_i\), summing telescopes to \(L(P,f)\le F(b)-F(a)\le U(P,f)\); take sup over \(P\) then inf over \(P\); integrability of \(f\) squeezes equality.

*Generalisation you should know (Ex 12 Q3):* if \(F\) is continuous on \([a,b]\) and \(F'=f\) except at **finitely many** interior points, add those points to the partition and apply FTC1 on each piece — the conclusion still holds.

*Why "\(f\) integrable" cannot be dropped:* there are derivatives that are not Riemann integrable (unbounded derivative, e.g. \(x^2\sin(1/x^2)\) at 0).

Use: \(\int_0^1 x^2\,dx=\frac13\) (Week 11 example) — note the argument is " \(x^2\) is continuous, hence integrable by Lemma 14, and it is \(F'\) for \(F=x^3/3\)".

<details>
<summary>⚑ Marking note — four hypotheses, and they are not the same function</summary>

Write all four before integrating: \(F\) continuous on the **closed** \([a,b]\); \(F\) differentiable on the **open** \((a,b)\); \(f\in\mathcal{R}[a,b]\); \(F'=f\) on \((a,b)\). The classic error the midterm flagged is treating the differentiability of \(f\) as giving the differentiability of \(F\). Also notice that FTC1 needs \(f\) integrable as a **separate** hypothesis — a derivative need not be.

</details>

### 4.5 FTC2 (Thm 16)

**Theorem 16 (appendix).** Let \(f\in\mathcal{R}[a,b]\) and \(F(x):=\int_a^x f\). Then \(F\) is continuous on \([a,b]\); and if \(f\) is continuous at \(c\in[a,b]\), then \(F\) is differentiable at \(c\) with \(F'(c)=f(c)\).

**Proof of (i) — continuity.**

\(\lvert F(x)-F(y)\rvert=\bigl\lvert\int_y^x f\bigr\rvert\le M\lvert x-y\rvert\) — a **Lipschitz** bound, stronger than needed and worth writing.

**Proof of (ii) — differentiability at a point of continuity.**

Choose \(\delta\) with \(\lvert f(x)-f(c)\rvert<\varepsilon\) for \(\lvert x-c\rvert<\delta\); then \(f(c)-\varepsilon\le\frac{1}{x-c}\int_c^x f\le f(c)+\varepsilon\) (monotonicity; reverse inequalities when \(x<c\)), and \(\frac{F(x)-F(c)}{x-c}=\frac{1}{x-c}\int_c^x f\).

Also (Week 12 Remark): any base point \(d\in[a,b]\) works.

Two cautionary examples (Week 12): \(f=-1\ (x<0),\ 1\ (x\ge0)\) ⇒ \(F=\lvert x\rvert\), continuous but not differentiable at 0; converse fails: \(g(0)=1,\ g=0\) elsewhere ⇒ \(G\equiv0\) differentiable at the discontinuity. And \(\ln x=\int_1^x\frac{1}{s}ds\), \(\operatorname{erf}(x)=\frac{2}{\sqrt\pi}\int_0^x e^{-s^2}ds\): functions *defined* by integrals with no closed-form antiderivative.

<details>
<summary>⚑ To remember — FTC2 is one-sided, and both directions get tested</summary>

\(f\) continuous at \(c\) ⇒ \(F'(c)=f(c)\); the converse is false in both directions: \(F\) can be differentiable where \(f\) is discontinuous (the \(g(0)=1\) example), and \(F\) can fail to be differentiable where \(f\) has a jump (\(\lvert x\rvert\)). The integral \(\int_a^x f\) exists for **every** \(x\) as soon as \(f\in\mathcal{R}[a,b]\) — continuity is only needed to differentiate it.

</details>

### 4.6 Change of variables (Lebl 5.3.5, Week 12 — **not in the appendix**)

Hypotheses: \(g:[a,b]\to\mathbb{R}\) **continuously differentiable**; \(f:[c,d]\to\mathbb{R}\) **continuous**; \(g([a,b])\subset[c,d]\). Conclusion: \(\int_a^b f(g(x))g'(x)\,dx=\int_{g(a)}^{g(b)}f(s)\,ds\).

**Proof.**

\(F(y):=\int_{g(a)}^y f(s)ds\) ⇒ \(F'=f\) (FTC2); \((F\circ g)'=f(g)g'\) (chain rule); FTC1 with \(F(g(a))=0\).

Worked: \(\int_0^{\sqrt\pi}x\cos(x^2)\,dx=\frac12\int_0^\pi\cos s\,ds=0\).

<details>
<summary>⚑ Exam note — the Week 12 invalid-substitution trap, word for word</summary>

For \(\int_{-1}^{1}\frac{\ln\lvert x\rvert}{x}\,dx\), substituting \(g=\ln\lvert x\rvert\) "gives" \(\int_0^0 s\,ds=0\), which is meaningless. Name **all three** failures when asked "why is this invalid?": the integrand is unbounded near \(0\), hence not Riemann integrable on \([-1,1]\); \(g\) is not continuous on \([-1,1]\); so \(g\) is certainly not \(C^1\) there, and \(g([a,b])\not\subset[c,d]\) for any interval on which \(\ln\lvert x\rvert\) is defined and continuous.

</details>

### 4.7 Integration by parts and antiderivative uniqueness (Ex 12 Q5, Q6)

\(F,G\in C^1[a,b]\) (or continuous + piecewise differentiable): \(\int_a^b F'G=[FG]_a^b-\int_a^b FG'\).

**Proof.**

Product rule + FTC1 + linearity + additivity of \(\int\).

If \(F'=G'\) on \((a,b)\) and both are continuous on \([a,b]\) then \(F-G\) is constant — proved either by MVT or by FTC1 applied to \(H=F-G\).

### 4.8 Logarithm and exponential (Lebl 5.4)

\(\ln:(0,\infty)\to\mathbb{R}\) is the unique function with \(\ln1=0\), \(\ln'=1/x\) (so strictly increasing, continuous), bijective with \(\lim_{x\to0^+}\ln x=-\infty\), \(\lim_{x\to\infty}\ln x=+\infty\), \(\ln(xy)=\ln x+\ln y\), \(\ln(x^q)=q\ln x\) for \(q\in\mathbb{Q}\) (Prop 5.4.1). \(\exp\) is its inverse: \(E(0)=1\), \(E'=E\), bijective, \(E(x+y)=E(x)E(y)\) (Prop 5.4.2); \(\exp(xy)=\exp(x)^y\) and \(\ln(x^y)=y\ln x\) (Prop 5.4.3).

Typical proof device for the functional equations: fix \(y\), differentiate \(x\mapsto \ln(xy)-\ln x\) and use "derivative zero ⇒ constant" + the value at \(x=1\). Same trick gives \(\ln(x^q)=q\ln x\).

The unboundedness needed for bijectivity is obtained by testing \(\ln\) at dyadic/powers-of-2 points, e.g. \(\ln(2^n)=n\ln2\ge n\cdot\frac12\) and \(\ln(2^{-n})=-n\ln2\).

### 4.9 Out of scope (as far as the files show)

Lebl **5.5 Improper integrals** and Chapter **6 (sequences of functions, uniform convergence, Picard)** and Chapter **7 (metric spaces)** are not in any of the Weeks 2–12 notes provided. Nothing in Weeks 1–12 or Ex 2–12 touches them, so the final's stated scope ("differentiability and integration discussed in lectures and exercises") excludes them. Confirm against the course syllabus before spending time there; if 5.5 *was* lectured, the p-test (\(\int_1^\infty x^{-p}\) converges iff \(p>1\)), comparison test, and the integral test for series are what you would need.

<details>
<summary>⚑ Remember — "\(f'\equiv0\Rightarrow f\) constant" is a statement you must supply</summary>

It is Lebl 4.2.6 and it is **not** in the 16-result appendix, yet it is the missing step in several Rolle/FTC proofs (including the "\(f\) constant on \([a,b]\)" branch of Rolle's proof). Three lines: take \(x<y\) in the interval, apply MVT on \([x,y]\), conclude \(f(y)-f(x)=f'(c)(y-x)=0\). Same for the derivative tests and Taylor — state, then prove.

</details>

---

## 5. Earlier topics the paper will lean on (Weeks 1–5 material)

### 5.1 Supremum / infimum discipline

\(\alpha=\sup S\) means two things, and a proof uses them one at a time:

\[
x\le\alpha\ \text{ for all } x\in S,\qquad\text{and}\qquad \forall\varepsilon>0\ \exists x\in S:\ x>\alpha-\varepsilon .
\]

This "\(\varepsilon\)-element" is what lets the notes pass from \(\sup\) to an inequality (Riemann's condition: pick \(P_1\) with \(L(P_1,f)>\underline{\int}f-\varepsilon/2\)).

Also \(\sup(-S)=-\inf S\) and \(\sup(f+g)\le\sup f+\sup g\) on a common set — the reason Lebl 5.2.5 has only inequalities.

<details>
<summary>⚑ Exam note — the two halves of "sup" are not interchangeable</summary>

Saying "\(\sup S\ge x\) for all \(x\in S\)" is the easy half and earns nothing by itself; the step that gets marked is the \(\varepsilon\) half, because that is how you turn a supremum into an inequality you can *use*. Typical sentence: "by definition of \(\underline{\int}f=\sup_P L(P,f)\), there is a partition \(P_1\) with \(L(P_1,f)>\underline{\int}f-\varepsilon/2\)." Also remember \(\inf(\alpha f)=-\alpha\sup f\) only for \(\alpha<0\) — that sign flip is the whole content of Ex 10 Q4.

</details>

### 5.2 Sequences (used inside proofs, not as standalone theory)

- Squeeze theorem (Ex 9 Q5: \(1-\frac1n\le\int f\le1\) ⇒ \(\int f=1\)).

- Monotone + bounded ⇒ convergent (bisection proof of Bolzano's lemma, Week 3).

- **Bolzano–Weierstrass** — used in the EVT proof (Week 3), the uniform-continuity theorem proof (Week 4), Lemma 5.2.8 (Week 11), and its final "all convergent subsequences tend to the same \(L\), so the whole sequence does" step.

- Sequential criterion for continuity (Lebl Prop 3.2.2(iii) = "Week 1 Notes, page 1"): \(f\) continuous at \(c\) ⇔ for every sequence \(x_n\to c\) in \(S\), \(f(x_n)\to f(c)\). Its contrapositive disproves continuity: \(\sin(1/x)\) with \(x_n\) chosen so \(\sin(1/x_n)=1\) (Ex 2 Q2); Week 2's \(-1/n\) for a step function.

- Density of \(\mathbb{Q}\) and \(\mathbb{R}\setminus\mathbb{Q}\) in every interval — behind Dirichlet Darboux sums, "continuous + rational-valued ⇒ constant" (midterm Q11), and Ex 12 Q9.

<details>
<summary>⚑ To remember — how to pick a sequence that breaks continuity</summary>

To disprove continuity at \(c\) with the sequential criterion, do not search for a "nice" sequence: solve for the value you want. For \(\sin(1/x)\) set \(1/x_n=\frac\pi2+2\pi n\), i.e. \(x_n=\bigl(\frac\pi2+2\pi n\bigr)^{-1}\to0\) with \(f(x_n)=1\not\to0=f(0)\). For a jump between \(L_1\) and \(L_2\), take \(x_n=c+\frac1n\) and \(y_n=c-\frac1n\) and show \(f(x_n)\) and \(f(y_n)\) have different limits. Write the formula for \(x_n\), check \(x_n\in S\) and \(x_n\to c\), then compute \(f(x_n)\).

</details>

### 5.3 Continuity (Weeks 1–2)

At \(c\in S\): \(\forall\varepsilon>0\ \exists\delta>0\) such that \(x\in S,\ \lvert x-c\rvert<\delta\Rightarrow\lvert f(x)-f(c)\rvert<\varepsilon\).

**Negation (provable on request).** \(\exists\varepsilon>0\ \forall\delta>0\ \exists x\in S\) with \(\lvert x-c\rvert<\delta\) and \(\lvert f(x)-f(c)\rvert\ge\varepsilon\) — Week 2 proves it (\(\varepsilon=1,\ x=1-\delta/2\)); Ex 2 Q1(b)(c) asks you to write and prove it.

If \(c\) is **not a cluster point** of \(S\), \(f\) is automatically continuous at \(c\) (the midterm Q1 remark; every \(f:\mathbb{Z}\to\mathbb{R}\)).

**Algebra.** Sums, products, quotients (nonzero denominator), compositions, polynomials.

\[
\max\{f,g\}=\frac{f+g+\lvert f-g\rvert}{2},\qquad \min\{f,g\}=\frac{f+g-\lvert f-g\rvert}{2}\quad\text{(Ex 2 Q8)}
\]

—the same identity is the clean route to \(\lvert f\rvert\) integrability; piecewise formulas need matching pieces **and** the junction value (Ex 2 Q6); \(\lvert f(x)-f(y)\rvert\le g(x-y)\) with \(g\) continuous at \(0,\ g(0)=0\) ⇒ \(f\) continuous (Ex 2 Q7), and the \(g(\lvert x-y\rvert)\) version gives uniform continuity (Ex 5 Q4).

<details>
<summary>⚑ Marking note — quantify the domain, then the "for all" order</summary>

Two sentences the rubrics keep flagging: *"the domain had to be stated"* and *"the order of quantifiers tells us that \(M\) cannot depend on \(x\)."* So open a continuity proof with "Let \(\varepsilon>0\)" and "Take \(c\in S\)" **in that order**, keep \(\delta\) dependent only on \(\varepsilon\) (never on \(x\) or \(c\) unless the statement allows it), and say which set you are working in. \(f(x)=1/x\) is continuous — on \((0,\infty)\); writing the domain is not decoration.

</details>

### 5.4 Extreme and intermediate value theorems (Weeks 3–4)

- Continuous on \([a,b]\) ⇒ bounded, and attains absolute min and max (**EVT**): sequences approaching \(\inf f,\sup f\), Bolzano–Weierstrass, then continuity passes the limit through \(f\).

- **Bolzano's lemma** (\(f(a)<0<f(b)\) ⇒ root in \((a,b)\)) by **bisection**: monotone bounded \(a_n,b_n\) with \(b_n-a_n=2^{1-n}(b-a)\) converge to a common \(c\); \(f(a_n)<0\le f(b_n)\) gives \(f(c)=0\). Numerical version: \(x^3-2x^2+x-1\) on \((1,2)\) (Week 4).

- **IVT**: apply the lemma to \(f-y\) or \(y-f\).

- Corollary: \(f([a,b])\) is a closed bounded interval or a point (midterm Q4: \(\inf f(I)\le k\le\sup f(I)\) is attained).

- Odd-degree polynomials have a real root; \(x^k=y>0\) solvable (check signs of \(x^k-y\) at \(0\), \(1\), or \(y\)).

- Every hypothesis is needed: \(x\) on \(\mathbb{R}\) (unbounded domain), \(1/x\) on \((0,1)\) (not closed), \(1/x\) with \(f(0)=0\) (not continuous).

- Discontinuous functions can still have the IVP: \(\sin(1/x)\) with value \(0\) at \(0\) (Week 4) — the IVP does not characterise continuity, and (Thm 7) it does not characterise derivatives either.

<details>
<summary>⚑ Marking note — Rolle's proof is the EVT proof, reused</summary>

The EVT argument (sequence of points approaching the sup, Bolzano–Weierstrass to get a convergent subsequence, continuity to pass the limit through \(f\)) is exactly the step that makes Rolle work. Write it as three sentences: **EVT** gives an absolute maximum at some \(c\in[a,b]\); if the maximum value equals the minimum value then \(f\) is constant and any interior point works, otherwise \(f(a)=f(b)\) forces the maximum (or the minimum) to be attained at an **interior** point; **Lemma 2** then gives \(f'(c)=0\). Note *where* each hypothesis enters: **closed \([a,b]\) + continuous** buys the extremum, **differentiable on \((a,b)\)** lets you differentiate at it.

</details>

### 5.5 Uniform continuity (Week 4, Ex 4, Ex 5)

**Definition.** \(\forall\varepsilon>0\ \exists\delta>0\) such that **for all** \(x,c\in S\), \(\lvert x-c\rvert<\delta\Rightarrow\lvert f(x)-f(c)\rvert<\varepsilon\).

**Negation.** \(\exists\varepsilon>0\ \forall\delta>0\ \exists x,y\in S\) with \(\lvert x-y\rvert<\delta\) and \(\lvert f(x)-f(y)\rvert\ge\varepsilon\).

- \(x^2\) on \([0,1]\) uniformly continuous (\(\lvert x^2-c^2\rvert\le2\lvert x-c\rvert\), \(\delta=\varepsilon/2\)); \(x^2\) on \(\mathbb{R}\) not (take \(c=x+\delta/2\) ⇒ \(x<\varepsilon/\delta\) for all \(x\)); \(1/x\) on \((0,1)\) not.

- **Theorem:** continuous on \([a,b]\) ⇒ uniformly continuous (contrapositive + Bolzano–Weierstrass; the notes stress *bounded* gives BW and *closed* keeps the limit inside).

- Preserved by restriction (Ex 4 Q6), sums and scalar multiples (Ex 5 Q1 — \(\varepsilon/2\) and \(\varepsilon/(\lvert a\rvert+1)\) devices, plus the \(a=0\) case), and by gluing over overlapping intervals (Ex 5 Q3, with its counterexample when the overlap fails).

- Lipschitz ⇒ uniformly continuous; via MVT: **\(f\) differentiable with bounded \(f'\) ⇒ Lipschitz ⇒ uniformly continuous**.

- \(\mathbb{Z}\): every \(f:\mathbb{Z}\to\mathbb{R}\) is uniformly continuous (\(\delta\le1\) forces \(x=y\)) — midterm Q7.

<details>
<summary>⚑ Exam note — uniform continuity is a property of a function on a set</summary>

Midterm part (c) lost marks because *"the domain had to be stated, since uniform continuity depends on the domain."* Never write "\(x^2\) is uniformly continuous"; write "\(x^2\) is uniformly continuous **on \([0,1]\)**" and, if asked for the proof, keep \(\delta\) a function of \(\varepsilon\) alone. In the negation, both points \(x,y\) may depend on \(\delta\) — that is the whole trick in \(x^2\) on \(\mathbb{R}\) and on \(1/x\) near 0, and it is why the quantifier order \(\exists\varepsilon\,\forall\delta\,\exists x\,\exists y\) must be written exactly.

</details>

### 5.6 Monotone functions and inverses (Week 5)

For monotone \(f\) and interior \(c\), both one-sided limits exist:

\[
\lim_{x\to c^-}f=\sup_{x<c}f,\qquad \lim_{x\to c^+}f=\inf_{x>c}f;
\]

for increasing \(f\), \(\lim_{x\to c^-}f\le f(c)\le\lim_{x\to c^+}f\), and continuity at \(c\) ⇔ the two limits agree.

- Monotone non-constant on an interval: \(f(I)\) is an interval ⇔ \(f\) continuous (⇒ by IVT; ⇐ by contrapositive, the gap \((a,b)\setminus\{f(c)\}\) is missed). Endpoint version = Ex 6 Q4.

- Monotone ⇒ at most countably many discontinuities.

- Strictly monotone ⇒ injective and \(f^{-1}:f(I)\to I\) continuous. Hypothesis is monotonicity, **not** continuity of \(f\): \(f(x)=x\ (x<0),\ x+1\ (x\ge0)\) is discontinuous at 0, \(f(\mathbb{R})=(-\infty,0)\cup[1,\infty)\) is not an interval, yet \(f^{-1}\) is continuous. The "only one one-sided limit exists" case = Ex 6 Q5.

<details>
<summary>⚑ To remember — Week 5 is the hypothesis the IFT proof leans on</summary>

The IFT proof (Thm 6) quietly uses two facts from here: strictly monotone \(\Rightarrow\) injective, and strictly monotone onto an interval \(\Rightarrow\) its inverse is continuous. "Continuous \(f\) has a continuous inverse" is **false** without strict monotonicity (\(f(x)=x^2\) on \([-1,1]\) is not even injective), and "monotone \(f\) has a continuous inverse" needs the range to be an interval. If a question asks why \(g\circ f=\mathrm{id}\) can be differentiated, the missing justification is continuity of \(g\), and that is a Week 5 statement.

</details>

---

## 6. Model solutions (write each out once by hand)

These fifteen are the answers the paper is built from. Read them once, then close the file and reproduce each one on paper; the ones that stall are exactly what needs drilling.

<details>
<summary>⚑ Highest mark density — drill these five first</summary>

**M2, M5, M6** (the three \(\varepsilon\)-partition integrability proofs), **M11** (differentiating an integral-defined function) and **M8** (IVT for existence + Rolle for uniqueness). Together they cover the whole "apply the machinery" family worth roughly 40 marks in the TT/midterm pattern, and each is a proof you must supply yourself — none of them is an appendix result you can cite by number.

</details>

### M1. Darboux sums with a jump inside the interval (TT2 Q4)

\(f(x)=-2\ (x<0),\ f(0)=\tfrac12,\ f(x)=3\ (x>0)\) on \([-2,3]\), \(P=\{-2,0,1,3\}\).

On \([-2,0]\) the **attained** values are \(-2\) and \(\tfrac12\), so \(m_1=-2,\ M_1=\tfrac12\) — **not** 3. On \([0,1]\): \(m_2=\tfrac12,\ M_2=3\). On \([1,3]\): \(m_3=M_3=3\). Therefore

\[
L(P,f)=(-2)(2)+\tfrac12(1)+3(2)=\tfrac52,\qquad U(P,f)=\tfrac12(2)+3(1)+3(2)=10 .
\]

Evaluate \(f\) at subinterval endpoints and interior bad points *before* declaring inf/sup; \(\inf\) and \(\sup\) are taken over the values actually attained on the **closed** subinterval.

### M2. Integrability **and** value from the definition (Ex 9 Q5)

\(f=0\ (x\le0),\ f=1\ (x>0)\) on \([-1,1]\), \(P_n=\{-1,0,\tfrac1n,1\}\).

**Proof.**

On \([-1,0]\): \(m_1=M_1=0\). On \([0,\tfrac1n]\): \(m_2=0,\ M_2=1\). On \([\tfrac1n,1]\): \(m_3=M_3=1\). Hence

\[
L(P_n,f)=1-\tfrac1n,\qquad U(P_n,f)=1,\qquad U(P_n,f)-L(P_n,f)=\tfrac1n .
\]

Given \(\varepsilon>0\), choose \(n>1/\varepsilon\); then \(U-L<\varepsilon\) and Prop 11 gives \(f\in\mathcal{R}[-1,1]\). Moreover \(1-\tfrac1n\le\underline{\int}f\le\overline{\int}f\le1\) for **every** \(n\), so the squeeze theorem gives \(\int_{-1}^1f=1\).

### M3. Step function with an explicit \(\varepsilon\)-partition (Week 9)

\(f=1\ (x<1),\ \tfrac12\ (x=1),\ 0\ (x>1)\) on \([0,2]\).

**Proof.**

Take \(0<\varepsilon<1\) and \(P=\{0,1-\varepsilon,1+\varepsilon,2\}\). On \([0,1-\varepsilon]\): \(m=M=1\). On \([1-\varepsilon,1+\varepsilon]\): \(m=0,\ M=1\) (the value \(\tfrac12\) is neither inf nor sup). On \([1+\varepsilon,2]\): \(m=M=0\). So

\[
L(P,f)=1-\varepsilon,\qquad U(P,f)=1+\varepsilon,\qquad U-L=2\varepsilon ,
\]

and Prop 11 gives integrability; squeezing \(1-\varepsilon\le\underline{\int}f\le\overline{\int}f\le1+\varepsilon\) for every \(\varepsilon\) gives \(\int_0^2f=1\).

**Recipe:** isolate each discontinuity in an interval of length \(\propto\varepsilon/M\), where \(M\) bounds the oscillation.

### M4. Bounded but not integrable (TT2 Q6)

\(1_{\mathbb{Q}}\) on \([2,5]\).

**Proof.**

Every subinterval contains a rational and an irrational (density of \(\mathbb{Q}\) and \(\mathbb{R}\setminus\mathbb{Q}\)), so \(m_i=0,\ M_i=1\) for every \(i\) and **every** partition \(P\). Hence \(L(P,f)=0\) and \(U(P,f)=3\) for all \(P\), so

\[
\underline{\int}f=\sup_P L(P,f)=0\neq3=\inf_P U(P,f)=\overline{\int}f ,
\]

and \(f\notin\mathcal{R}[2,5]\) by definition.

"Not integrable" must be shown by a **numerical gap**, never by calling the function pathological.

### M5. Monotone ⇒ integrable (Lebl 5.2.11, Ex 11 Q4)

**Proof.**

Let \(f\) be increasing on \([a,b]\). Then \(f(a)\le f(x)\le f(b)\), so \(f\) is **bounded** — this is the hypothesis Prop 11 needs, so say it. Take the uniform partition \(\Delta x_i=\frac{b-a}{n}\); monotonicity gives \(m_i=f(x_{i-1})\) and \(M_i=f(x_i)\), hence

\[
U(P,f)-L(P,f)=\frac{b-a}{n}\sum_{i=1}^n\bigl(f(x_i)-f(x_{i-1})\bigr)=\frac{b-a}{n}\bigl(f(b)-f(a)\bigr),
\]

which is \(<\varepsilon\) for large \(n\) by Archimedean-ness. Prop 11 ⇒ \(f\in\mathcal{R}[a,b]\). For decreasing \(f\) apply the increasing case to \(-f\).

### M6. Continuous ⇒ integrable (Lemma 14; Week 11)

**Proof.**

Say which two theorems you are using: continuous on the closed \([a,b]\) ⇒ **bounded** (EVT) and **uniformly continuous** (Week 4). Bound \(\lvert f\rvert\le M\) only serves Prop 11's boundedness hypothesis. Given \(\varepsilon>0\), uniform continuity supplies \(\delta>0\) with

\[
\lvert x-y\rvert<\delta\ (x,y\in[a,b])\ \Longrightarrow\ \lvert f(x)-f(y)\rvert<\frac{\varepsilon}{b-a},
\]

and any partition with \(\Delta x_i<\delta\) for all \(i\) works. **EVT** on each closed \([x_{i-1},x_i]\) gives points \(u,v\) with \(M_i=f(u)\) and \(m_i=f(v)\); since \(\lvert u-v\rvert\le\Delta x_i<\delta\),

\[
U-L=\sum_i(M_i-m_i)\Delta x_i<\frac{\varepsilon}{b-a}\sum_i\Delta x_i=\varepsilon .
\]

Prop 11 ⇒ \(f\in\mathcal{R}[a,b]\).

### M7. MVT ⇒ Bernoulli (midterm Q10)

**Proof.**

Let \(h(t)=(1+t)^\alpha\) with \(\alpha>1\) and \(x>0\); \(h\) is continuous on \([0,x]\) and differentiable on \((0,x)\). Thm 4 gives \(c\in(0,x)\) with

\[
(1+x)^\alpha-1=h(x)-h(0)=h'(c)\,x=\alpha(1+c)^{\alpha-1}x>x ,
\]

because \(\alpha>1\) and \(1+c>1\) make \(\alpha(1+c)^{\alpha-1}>1\). The strictness comes from \(c\) lying in the **open** interval — at \(c=0\) you would only get \(\alpha x\ge x\).

### M8. Exactly one root: IVT for existence, Rolle for uniqueness

**Proof.**

With \(f(x)=x^3+3x+1\): \(f(-1)=-1<0<f(0)=1\) and \(f\) is continuous, so Bolzano's lemma gives a root in \((-1,0)\). For uniqueness, if there were two roots \(r<s\) then \(f(r)=f(s)=0\), and Rolle on \([r,s]\) would give \(c\in(r,s)\) with \(f'(c)=0\) — but \(f'(x)=3x^2+3\ge3\). Hence \(f\) has **exactly one** real root.

Same pattern as Ex 8 Q5 (multiplicity: a double root forces \(f'(r)=0\); factor \(f=(x-r)(x-s)q\) and count).

### M9. Auxiliary function + Bolzano (midterm Q6)

**Claim.** \(f\) continuous on \([0,1]\), \(f(0)=f(1)\) ⇒ \(\exists c\in[0,\tfrac12]\) with \(f(c)=f(c+\tfrac12)\).

**Proof.**

Let \(g(x)=f(x)-f(x+\tfrac12)\) on \([0,\tfrac12]\); \(g\) is continuous, and

\[
g(0)=f(0)-f(\tfrac12),\qquad g(\tfrac12)=f(\tfrac12)-f(1)=f(\tfrac12)-f(0)=-g(0).
\]

If \(g(0)=0\) then \(c=0\) already works; otherwise \(g(0)\) and \(g(\tfrac12)\) have opposite signs, so Bolzano's lemma gives \(c\in(0,\tfrac12)\) with \(g(c)=0\).

**Variant (step \(1/n\)):** with \(g(x)=f(x)-f(x+\tfrac1n)\) the telescoping sum \(\sum_{k=0}^{n-1}g(k/n)=f(0)-f(1)=0\), so either every term is \(0\) or two have opposite signs, and IVT on \(g\) gives a zero between them. Same proof on a general \([a,b]\) with step \((b-a)/2\).

### M10. Darboux read off data (TT2 Q1)

**Proof.**

\(f\) is differentiable on \([0,2]\) and \(f'(0)=-2<1<5=f'(2)\), so Thm 7 with \(y=1\) gives \(c\in(0,2)\) with \(f'(c)=1\).

**Existence only.** Darboux never says \(c\) is unique: \(f(x)=x^3-2x\) has \(f'(x)=3x^2-2\), and \(f'(-1)=f'(1)=1\).

### M11. FTC2 with variable limits (Ex 12 Q1–Q2)

For continuous \(f\), \(F(x)=\int_a^{v(x)}f(s)\,ds\) ⇒ \(F'(x)=f(v(x))\,v'(x)\) — FTC2 together with the chain rule.

Worked: \(F(x)=\int_0^{x^2}\frac{ds}{1+s^2}\) ⇒ \(F'(x)=\frac{1}{1+(x^2)^2}\cdot 2x=\frac{2x}{1+x^4}\).

If \(x\) also appears as a **parameter** inside the integrand you may not differentiate under the integral sign; evaluate the integral first:

\[
F(x)=\int_0^x(2x+t)\,dt=2x^2+\frac{x^2}{2}=\frac{5x^2}{2}\ \Longrightarrow\ F'(x)=5x .
\]

<details>
<summary>⚑ Marking note — name both theorems and check their hypotheses</summary>

The method mark is in the sentence "by Theorem 16 and the chain rule", not in the final derivative. But Theorem 16 needs \(f\in\mathcal{R}\) on the relevant interval and continuity at the point \(v(x)\) — write "\(f\) is continuous on the closed interval, hence integrable by Lemma 14, and \(v\) is differentiable", then differentiate. In the parameter case the expected first sentence is "integrate with respect to \(t\), treating \(x\) as constant".

</details>

### M12. Integral identities force pointwise conclusions (Ex 12 Q8–Q9)

**(a)** \(f\) continuous, \(\int_a^x f=\int_x^b f\) for all \(x\in[a,b]\).

**Proof.**

Let \(H(x)=\int_a^xf-\int_x^bf\). Then \(H\equiv0\) so \(H'(x)=0\), while FTC2 gives \(H'(x)=f(x)-\bigl(-f(x)\bigr)=2f(x)\). Hence \(f(x)=0\) for every \(x\in[a,b]\).

**(b)** \(f\) continuous, \(\int_a^x f=0\) for every \(x\in\mathbb{Q}\cap[a,b]\).

**Proof.**

\(F(x)=\int_a^xf\) is continuous on \([a,b]\) by FTC2(i), and it vanishes on \(\mathbb{Q}\cap[a,b]\), which is dense: given any \(x\), choose rationals \(q_n\to x\), then \(F(x)=\lim F(q_n)=0\). So \(F\equiv0\), hence \(F'\equiv0\), and FTC2(ii) with \(f\) continuous gives \(f=F'=0\).

### M13. Symmetry and value-at-a-point (Ex 12 Q10–Q11)

**Proof.**

Let \(f\) be integrable and odd on \([-a,a]\). Split at \(0\) and substitute \(x=-s\) on \([-a,0]\) (change of variables with \(g(x)=-x\in C^1\), \(g'\equiv-1\)):

\[
\int_{-a}^{0}f(x)\,dx=\int_{a}^{0}f(-s)(-ds)=\int_{0}^{a}f(-s)\,ds=-\int_{0}^{a}f(s)\,ds ,
\]

so \(\int_{-a}^{a}f=\int_{-a}^{0}f+\int_{0}^{a}f=0\).

If \(f\) is odd except that \(f(0)=2026\): \(f\) is bounded with a single discontinuity, hence integrable (Thm 5.2.9), and changing a function at finitely many points leaves the integral unchanged (Prop 5.2.10), so the integral is still \(0\). For **even** \(f\) the same substitution gives \(\int_{-a}^{a}f=2\int_{0}^{a}f\).

### M14. Taylor as a rigorous estimate

With \(f=\sin\) at \(x_0=0\): \(f(0)=0,\ f'(0)=1,\ f''(0)=0,\ f'''(0)=-1,\ f^{(4)}(0)=0\), so

\[
P_0^3(x)=P_0^4(x)=x-\frac{x^3}{6} .
\]

**Proof of the error bound.**

Take \(n=4\). \(\sin\) has four continuous derivatives on \(\mathbb{R}\) and \(f^{(5)}=\cos\) exists, so Taylor applies on the interval with endpoints \(0\) and \(x\), giving \(c\) **between** \(0\) and \(x\) with

\[
\sin x=x-\frac{x^3}{6}+\frac{\cos c}{5!}x^5,\qquad\text{hence}\qquad \biggl\lvert\sin x-\Bigl(x-\frac{x^3}{6}\Bigr)\biggr\rvert\le\frac{\lvert x\rvert^5}{120},
\]

because \(\lvert\cos c\rvert\le1\).

**Copy this procedure for any Taylor question:** derivatives at \(x_0\) → write \(P_{x_0}^n\) → bound \(\lvert f^{(n+1)}\rvert\le M\) between \(x_0\) and \(x\) → \(\lvert R^n_{x_0}(x)\rvert\le\frac{M}{(n+1)!}\lvert x-x_0\rvert^{n+1}\); and state the hypotheses (\(n\) **continuous** derivatives on the closed interval, \(f^{(n+1)}\) on the open one).

### M15. Change of variables, plus the hypothesis check

\(\int_0^1 x\sqrt{1-x^2}\,dx\).

**Proof.**

Take \(g(x)=1-x^2\), which is \(C^1\) on \([0,1]\) with \(g([0,1])=[0,1]\), and \(f(s)=\sqrt s\), continuous on \([0,1]\). Since \(g'(x)=-2x\),

\[
\int_0^1 x\sqrt{1-x^2}\,dx=-\frac12\int_0^1\sqrt{1-x^2}\,(-2x)\,dx=-\frac12\int_{g(0)}^{g(1)}\sqrt s\,ds=-\frac12\int_1^0\sqrt s\,ds=\frac12\cdot\frac23=\frac13 .
\]

**Negative instance (Week 12):** \(\int_{-1}^{1}\frac{\ln\lvert x\rvert}{x}dx\) with \(g=\ln\lvert x\rvert\) is invalid. State all three failures: the integrand is unbounded near \(0\), so it is not Riemann integrable on \([-1,1]\); \(g\) is not continuous on \([-1,1]\); so \(g\) is certainly not \(C^1\) there, and its image is not a single interval on which \(f\) is continuous.

<details>
<summary>⚑ To remember — change of variables is not an appendix result</summary>

Lebl 5.3.5 is **not** among the 16, so "let \(u=g(x)\)" alone is not a justification: write the three hypotheses (\(g\in C^1[a,b]\), \(f\) continuous on an interval containing \(g([a,b])\)) and the two new limits \(g(a),g(b)\). Its proof is three lines you may be asked to supply: \(F(y)=\int_{g(a)}^y f\) ⇒ \(F'=f\) (Thm 16), \((F\circ g)'=f(g)g'\) (chain rule), then Thm 15.

</details>

---

## 7. Example / counterexample table (midterm Q3 is all-or-nothing — memorise the shapes)

<details>
<summary>⚑ Marking note — all-or-nothing means you verify every demanded property</summary>

Midterm Q3 recorded: *"This question was marked on an all-or-nothing basis for each part."* An example earns nothing unless it satisfies **every** clause on its line: the formula, the domain, whether the interval is closed or open, and the value at any special point. So after writing the function, spend two lines ticking the clauses — "bounded: yes, \(0\le f\le1\); not continuous at \(\tfrac12\): take \(\varepsilon=\tfrac12\), then every \(\delta\) admits \(x\ne\tfrac12\) with \(\lvert f(x)-f(\tfrac12)\rvert=1\)." If you cannot verify a clause, you do not yet have an example.

</details>

| Required | Give | Why |
|---|---|---|
| bounded, not continuous on \([0,1]\) | \(f(\tfrac12)=0\), \(f=1\) otherwise | \(\varepsilon=\tfrac12\) defeats every \(\delta\) |
| bounded continuous \(\mathbb{R}\to\mathbb{R}\) with no max and no min | \(\arctan x\) | image is open |
| continuous, not uniformly continuous | \(1/x\) on \((0,\infty)\) — **state the domain** | negation with \(x,\,x+\delta/2\) |
| differentiable, \(f'\) discontinuous | \(x^2\sin(1/x)\), \(f(0)=0\) | \(f'(0)=0\), \(f'\) oscillates |
| differentiable, min at 0, \(f'\) changing sign infinitely often near 0 | \((x\sin(1/x))^2\), \(f(0)=0\) | Week 6 |
| strictly increasing with \(f'(c)=0\) | \(x^3\) at \(0\) | converse of Lebl 4.2.8 fails |
| monotone with a jump | \(-1\ (x<0),\ 1\ (x\ge0)\) | strictly increasing, discontinuous at 0 |
| bounded, not Riemann integrable | \(1_{\mathbb{Q}}\) on \([a,b]\) | \(U-L=b-a\) for every \(P\) |
| integrable with infinitely many discontinuities | Thomae/popcorn on \([0,1]\) (integral \(0\)); \(1_{\{1/n\}}\) on \([0,1]\) | only finitely many values \(\ge1/k\) |
| Rolle fails without differentiability | \(\lvert x\rvert\) on \([-1,1]\) | corner at 0 |
| Rolle fails without continuity on \([a,b]\) | \(f(0)=0,\ f(x)=x\) on \((0,1)\), \(f(1)=0\) | no interior extremum attained properly |
| FTC2's converse fails | \(g(0)=1,\ g=0\) elsewhere ⇒ \(G\equiv0\) | differentiable at a discontinuity |
| continuous \(f\) with \(\int_a^bf=0\) but \(f\not\equiv0\) | \(f(x)=x\) on \([-1,1]\) | the \(f\equiv0\) result needs \(f\ge0\) |
| \(f,g\) nowhere continuous, \(f+g\) continuous | \(1_{\mathbb{Q}}\), \(1_{\mathbb{R}\setminus\mathbb{Q}}\) | sum is \(1\) |
| IVP without continuity | \(\sin(1/x)\), \(0\) at \(0\) | Week 4 |
| \(f\) integrable, \(g\) not, but \(f+g\) … | take \(g=-f+1_{\mathbb{Q}}\) | shows why linearity needs both integrable |

<details>
<summary>⚑ To remember — eight formulas answer almost the whole table</summary>

\(\lvert x\rvert\) (corner, no derivative); \(\sqrt x\) at \(0^+\) (infinite slope); \(x^3\) (\(f'(0)=0\) yet strictly increasing); \(x^2\sin(1/x)\) with value \(0\) at \(0\) (derivative discontinuous); \((x\sin(1/x))^2\) with value \(0\) at \(0\) (minimum, no sign pattern); \(\arctan x\) (bounded, continuous, no max/min); \(1_{\mathbb{Q}}\) and \(1_{\mathbb{R}\setminus\mathbb{Q}}\) (nowhere continuous, bounded, not integrable, sum continuous); \(1/x\) on \((0,1)\) or \((0,\infty)\) (continuous, not uniformly continuous, unbounded). Write each one with its domain and its special-point value until it is automatic.

</details>

---

## 8. Exam-day playbook (90 minutes)

1. **0–5 min** — read the whole paper; label each question *define / compute / prove / example*; note mark allocations.

2. **5–25 min — cheap bank.** Definitions and fill-ins: partition, \(m_i,M_i,L,U\), lower/upper integral, “Riemann integrable”, refinement, Riemann's condition, both FTC statements, IFT, Darboux, Taylor. Put the **hypotheses inside the answer** and write \(c\in(a,b)\) (open) every time.

3. **25–45 min — computations.** Darboux sums for a given partition (M1), integrability + value via a partition family (M2–M3), differentiating integral-defined functions (M11), one change of variables with its checks (M15).

4. **45–75 min — proofs.** Order: verbatim proofs you own (MVT family, FTC1, FTC2, continuous ⇒ integrable), then \(\varepsilon\)-partition proofs (M5, M2, Ex 10 Q1), then applications (M7–M10, M12–M13). Sketch the three-line frame — hypotheses checked, theorem invoked, conclusion — before filling in.

5. **75–85 min — examples** from §7; re-read each demanded property and verify it literally, domain included.

6. **85–90 min — checklist:** quantifier order \(\forall\varepsilon\,\exists\delta\,\forall x\); “\(\varepsilon>0\) was arbitrary, hence …”; every cited theorem has its hypotheses verified in words; no antiderivative used where “from the definition” was asked; \(\int_a^a=0\) and \(\int_a^b=-\int_b^a\) handled correctly; the conclusion sentence matches the question asked.

**Logistics.** Tuesday 03 November, **14:00**, **Old Multipurpose Sports Hall**, duration 1 h 30 min — aim to arrive by 13:30 with your student card and pens. The appendix above is supplied in the paper: cite its numbering, and remember that any result not on that list must be stated and justified by you.

<details>
<summary>⚑ Exam note — "from the definition" is a method instruction, not a hint</summary>

Ex 9 Q5's rubric says to *"check whether the value of the integral is obtained from the definition rather than by inspection or by using antiderivatives."* So when a question says *by means of the definition*:

- for continuity / uniform continuity / differentiability: write the \(\varepsilon\)-\(\delta\) or difference-quotient limit, and never a theorem name;

- for an integral: build partitions, compute \(L(P,f)\) and \(U(P,f)\), invoke Prop 11, then squeeze \(\underline{\int}f\) and \(\overline{\int}f\) — Thm 15 is the wrong tool there;

- for "not differentiable / not continuous": the sequential or one-sided-quotient argument, not a graph.

</details>

<details>
<summary>⚑ To remember — the closing sentence every proof needs</summary>

Three sentences cost nothing and repeatedly decide the mark: **"Since \(\varepsilon>0\) was arbitrary, \(f\) is integrable on \([a,b]\)."** · **"All hypotheses of Theorem 4 have been verified, so there exists \(c\in(a,b)\) with \(f'(c)=0\)."** · **"This contradicts the choice of \(\varepsilon_0\), so the assumption was false."** Also end existence proofs by restating what was asked ("hence \(f\) has exactly one real root"), and never write \(c\in[a,b]\) when the theorem gives \(c\in(a,b)\).

</details>

---

## 9. Self-test (anything shaky goes back to the listed section)

1. State Prop 1, Lemma 2, Thm 3, Thm 4, Prop 5, Thm 6, Thm 7 with all hypotheses; prove Prop 1, Lemma 2, Rolle, MVT. (§3)

2. Differentiate \(x^2\sin(1/x)\) at 0 from the definition; show \(f'\) is discontinuous there. (§3.9)

3. Write the six Darboux definitions from memory. (§2)

4. Prove increasing ⇒ integrable, then decreasing. (M5)

5. Prove continuous ⇒ integrable, naming uniform continuity and EVT. (M6)

6. Prove Riemann's condition in both directions. (§4.2)

7. Prove FTC1 and FTC2; say exactly where each hypothesis is used. (§4.4–4.5)

8. Prove change of variables; then explain why the \(\ln\lvert x\rvert/x\) attempt fails. (§4.6, M15)

9. State Taylor; deduce the second derivative test. (§3.8)

10. Prove: \(f'\neq0\) everywhere on an interval ⇒ \(f'\) has constant sign. (§3.4)

11. Prove: \(f\) continuous, \(f\ge0\), \(\int_a^bf=0\) ⇒ \(f\equiv0\). (§4.3)

12. Prove: \(f\) differentiable on \(\mathbb{R}\) with bounded \(f'\) ⇒ \(f\) uniformly continuous. (§5.5)

13. Produce every §7 row in five minutes. (§7)

14. Compute \(\int_{-1}^1 1_{(0,1]}\) from the definition. (M2)

15. One-line proofs: \(\bigl\lvert\int f\bigr\rvert\le\int\lvert f\rvert\); MVT for integrals; additivity of \(\int\). (§4.3)

<details>
<summary>⚑ To remember — items 1–5 are the highest mark-density in the paper</summary>

If 1–5 are not automatic by Monday evening, drop everything else and drill only those: they are the seven statements you may cite, the four proofs you may be asked to write verbatim, the counterexample that kills the converse of Prop 1, the six definitions worth a guaranteed 10 marks, and the two \(\varepsilon\)-partition proofs that every integrability question reduces to.

</details>
