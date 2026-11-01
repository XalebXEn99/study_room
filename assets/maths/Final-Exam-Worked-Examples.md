# MATH2016 Final — Worked Examples in Difficulty Ladders

Companion to `Final-Exam-Teaching-Notes.md`. The notes file is the *reference* (statements, proof skeletons, appendix map). This file is the *gym*: problems you work, ordered so that **every question uses a technique you used in an earlier question**. Do not read the solutions — cover them, write your own, then mark yourself with the "Markers want" line.

Exam: Tue 03 Nov 2026, 14:00, 1 h 30 min, Old Multipurpose Sports Hall. 16 citable results in `Appendix-exam.pdf`.

**Contents.** §0 phases, technique map, working order, file map · **A** Differentiability: A1 derivative from the definition (6 levels) · A2 Prop 1 (4) · A3 Rolle/MVT/auxiliary functions (6) · A4 Darboux (4) · A5 IFT (4) · A6 Taylor (5) · **B** Integration: B1 Darboux sums (5) · B2 integrability proofs (5) · B3 estimates/mean value/vanishing (5) · B4 FTC1 & FTC2 (6) · B5 substitution & parts (5) · **C** earlier machinery glued on (7) · **D** 17 question types with fixed steps · **E** self-marking, templates, timing.

---

## 0. How to use this file

### 0.1 The five phases (every problem is labelled with its phase)

| Phase | What the problem forces you to do | Signal words in the exam question |
|---|---|---|
| **P1 — Recall & compute** | write a definition/theorem verbatim; do the algebra | "State…", "Define…", "Compute…", "Fill in…" |
| **P2 — Hypothesis audit** | check every assumption before citing; say which one fails | "Can Theorem X be applied?", "Justify", "Why is this invalid?" |
| **P3 — ε-δ / ε-partition proof** | build the δ or the partition yourself | "By means of the definition, prove…", "Show that… for every ε>0" |
| **P4 — Theorem-driven proof** | one named result does the work; the skill is choosing it (and the auxiliary function) | "Use the MVT to prove…", "Prove that there exists…" |
| **P5 — Combination / capstone** | two or more phases chained; a new function built out of old ones | "Let F(x)=∫…", "Prove that f is…", example/counterexample questions |

**Exam time split (90 min):** P1/P2 answers are worth 60–90 seconds each — bank them early. A P3 or P4 proof is 10–15 minutes. If a question is P5 and you are out of time, write the definition, the hypotheses, and the one line you know: partial credit is real; blank pages are not.

### 0.2 Technique dependency map (this is why the order matters)

\[
\text{difference quotient} \to \text{Prop 1} \to \text{Rolle} \to \text{MVT} \to
\begin{cases}
\text{monotone} \Rightarrow \text{injective / bijective} \to \text{IFT}\\
\text{Darboux}\\
\text{Taylor} \to \text{error bounds}
\end{cases}
\]

\[
\text{telescoping sums (A2-L4)} \to \text{monotone is integrable (B2-L2)}
\]

\[
\text{partition/mesh } \Delta x_i \to L(P,f),U(P,f) \to \text{Riemann condition} \to
\begin{cases}
|f| \text{ integrable}\\
\text{continuous integrable}\\
\text{FTC1} \to \text{FTC2} \to \text{change of variables} \to \text{IBP}
\end{cases}
\]

Chain rule (A3/A6) is the *only* bridge into differentiating \(\int_a^{u(x)}f\). Uniform continuity (C4) is the *only* engine inside "continuous \(\Rightarrow\) integrable" (B2-L3).

### 0.3 Working order (Sat 31 → Mon 2)

1. A1 → A2 → A3 (definitions, Prop 1, MVT). 2. B1 → B2 (sums, integrability). 3. A6 → B4 → B5 (Taylor, FTC, substitution/IBP) — these are the "later topics you haven't practised". 4. A4 → A5 → B3 → C (Darboux, IFT, estimates, glue). 5. Sit `Mock-Final-Exam.md` closed-book, 90 minutes, then mark it with its memorandum. 6. Re-drill the ladders its memorandum sends you back to, then sit `Mock-Final-Exam-B.md` on the last free day. 7. Re-do only the problems you could not finish cold. (This same order, laid on the Sat→Tue calendar with a "done means" check for each rung, is in `Study-Plan.md`.)

### 0.4 The files in this set

| File | What it is | Use it when |
|---|---|---|
| `Final-Exam-Teaching-Notes.md` | reference: definitions, all 16 appendix results with proof skeletons, the appendix map | you need a statement or want to check a hypothesis |
| `Final-Exam-Worked-Examples.md` | this file: 62 graded problems in ladders, 17 question types, marking culture | daily practice — cover the solution, write yours, self-mark |
| `Mock-Final-Exam.md` + `-Memorandum.md` | Paper A, 60 marks: definition-by-definition differentiation, Rolle auxiliary function, Darboux, one-bad-point ε-partition, FTC computations, substitution and parts | first full timed run (Saturday or Sunday) |
| `Mock-Final-Exam-B.md` + `-Memorandum.md` | Paper B, 60 marks: Taylor and error bounds, second derivative test, IFT, \(f'\equiv0\Rightarrow\) constant, non-refinement trap, Dirichlet, countably-many-bad-points ε-partition, \(\ln\) built from the integral, MVT for integrals, odd functions | second timed run, after the A6/A5/B4 ladders |
| `Study-Plan.md` | the order above on a calendar, with what "done" means for each rung, the six working rules, and what not to study | you are deciding what to do next |

---

## TOPIC A — DIFFERENTIABILITY

### A1 — The derivative **from the definition**

The whole topic rests on one limit: \(f'(c)=\lim_{x\to c}\dfrac{f(x)-f(c)}{x-c}=\lim_{h\to0}\dfrac{f(c+h)-f(c)}{h}\). If a question says "by the definition", using a differentiation rule is worth **zero**.

#### A1-L1 (P1) — Compute \(f'(2)\) for \(f(x)=x^2+3x\) from the definition.

**Carries forward:** nothing — this is the root skill: form the quotient, cancel \(h\), then take the limit.
**Markers want:** the quotient *written down* before any simplification; an explicit "the limit exists and equals 7"; the value \(f(2)\) computed.
**Solution.**
\[
\frac{f(2+h)-f(2)}{h}=\frac{(4+4h+h^{2}+6+3h)-10}{h}=\frac{7h+h^{2}}{h}=7+h \quad (h\neq0),
\]
so \(f'(2)=\lim_{h\to0}(7+h)=7\).
**Usual deduction:** cancelling \(h\) without stating \(h\neq0\); computing \(f'(x)\) generally when only \(f'(2)\) was asked (lost time, no marks).

#### A1-L2 (P1) — Compute \(f'(3)\) for \(f(x)=1/x\); state the domain of \(f'\).

**Carries forward:** the L1 quotient routine; new: the quotient is itself a fraction, so combine carefully.
**Markers want:** domain of \(f\) and of \(f'\) stated (a function is not defined without its domain — the midterm deducted for exactly this).
**Solution.** For \(h\neq0\) and \(3+h\neq0\),
\[
\frac{\frac{1}{3+h}-\frac13}{h}=\frac{3-(3+h)}{3(3+h)h}=\frac{-1}{3(3+h)}\longrightarrow \frac{-1}{9}.
\]
Same computation at a general \(c\neq0\) gives \(-1/(3\cdot c)= -1/c^{2}\); hence \(f'(x)=-1/x^{2}\) with domain \(\mathbb{R}\setminus\{0\}\).
**Usual deduction:** forgetting that \(f'\)'s domain can be smaller than \(f\)'s.

#### A1-L3 (P1) — Compute \(f'(4)\) for \(f(x)=\sqrt{x}\), and show \(f\) is **not** differentiable at \(0\).

**Carries forward:** L1 quotient; new device: **rationalise the numerator** — the same trick reappears in A5-L4 and in sequence arguments in C1.
**Markers want:** the rationalisation step visible; the \(x=0\) part phrased as "the difference quotient has no finite limit".
**Solution.** At \(c=4\):
\[
\frac{\sqrt{4+h}-2}{h}=\frac{(4+h)-4}{h(\sqrt{4+h}+2)}=\frac{1}{\sqrt{4+h}+2}\to\frac14 .
\]
At \(0\): for \(h>0\), \(\dfrac{\sqrt h-0}{h}=\dfrac1{\sqrt h}\to+\infty\); the limit is not finite, so \(f\) is not differentiable at \(0\) (and no left-hand quotient exists in the domain). Generally \((\sqrt{x})'=\frac{1}{2\sqrt{x}}\) on \((0,\infty)\).

#### A1-L4 (P2/P3) — \(f(x)=x^{2}\sin(1/x)\) for \(x\neq0\), \(f(0)=0\). Prove \(f\) is differentiable at \(0\), find \(f'(x)\) for \(x\neq0\), and show \(f'\) is not continuous at \(0\).

**Carries forward:** L1 quotient at a point; new device: **squeeze the difference quotient** using \(|\sin|\le1\). This single example is the answer to half the true/false questions in the paper.
**Markers want:** at \(0\) the quotient **must** be formed from \(f(0)=0\), not from a rule; the phrase "the limit does not exist because \(\cos(1/x)\) oscillates" needs a sequence to back it up.
**Solution.** At \(0\): \(\left|\frac{f(h)-f(0)}{h}\right|=|h\sin(1/h)|\le|h|\to0\), so \(f'(0)=0\) (Squeeze Theorem). For \(x\neq0\), product/chain rules (which are allowed off \(0\)) give
\[
f'(x)=2x\sin(1/x)-\cos(1/x).
\]
As \(x\to0\), the term \(2x\sin(1/x)\to0\) but \(\cos(1/x)\) has no limit: take \(x_n=1/(2\pi n)\) and \(y_n=1/((2n+1)\pi)\). Both tend to \(0\), while \(f'(x_n)\to-1\) and \(f'(y_n)\to+1\). Hence \(\lim_{x\to0}f'(x)\) does not exist, so \(f'\) is discontinuous at \(0\) even though \(f\) is differentiable everywhere.
**Payoff:** *Proposition 1 has no converse.* Differentiable \(\not\Rightarrow C^{1}\). Every "if \(f\) is differentiable then…" claim must be tested against this function.

#### A1-L5 (P5) — \(h(x)=\bigl(x\sin(1/x)\bigr)^{2}\), \(h(0)=0\). Prove \(h\) is differentiable everywhere, that \(h\) has an absolute minimum at \(0\), and that \(h'\) takes both signs in every neighbourhood of \(0\).

**Carries forward:** L4 wholesale (quotient at 0, squeeze, two sequences); new: the **first derivative test needs sign information on a whole side**, not just a list of critical points.
**Markers want:** the minimum conclusion justified by \(h\ge0=h(0)\) (one line, and it is *not* "by the first derivative test").
**Solution.** At \(0\): \(h(x)/x=x\sin^{2}(1/x)\to0\), so \(h'(0)=0\). For \(x\neq0\):
\[
h'(x)=2x\sin^{2}(1/x)-\sin(2/x).
\]
Minimum: \(h(x)\ge0=h(0)\) for all \(x\). Sign changes: at \(u_n\) with \(2/u_n=\tfrac{\pi}{2}+2\pi n\) we get \(\sin(2/u_n)=1\), so \(h'(u_n)=2u_n\sin^{2}(\cdot)-1<0\) for large \(n\); at \(v_n\) with \(2/v_n=\tfrac{3\pi}{2}+2\pi n\) we get \(\sin(2/v_n)=-1\), so \(h'(v_n)>0\). Both sequences \(\to0\). So no one-sided neighbourhood of \(0\) has \(h'\) of a single sign.

#### A1-L6 (P1) — Piecewise: \(f(x)=x^{3}\) for \(x\ge0\), \(f(x)=-x^{3}\) for \(x<0\) (i.e. \(f=x^{2}|x|\)). Find \(f'(0)\), \(f''(0)\), and decide whether \(f'''(0)\) exists.

**Carries forward:** L1 at each point with the correct branch; new: **a derivative defined at one point must be computed at that point from the definition**, never by differentiating a neighbouring formula. This is the Exercise-6 ladder question, and it is the cheapest full-mark question of its type.
**Solution.** \(f'(0)=\lim \frac{h^{2}|h|}{h}=\lim h|h| =0\). For \(x>0\), \(f'=3x^{2}\); for \(x<0\), \(f'=-3x^{2}\); both equal \(3x|x|\), and \(f'(0)=0=3\cdot0\cdot0\), so \(f'(x)=3x|x|\) everywhere. Then \(f''(0)=\lim\frac{3h|h|-0}{h}=\lim3|h|=0\), while \(f''(x)=6|x|\) for \(x\neq0\). Finally \(\frac{f''(h)-f''(0)}{h}=\frac{6|h|}{h}=\pm6\): the two one-sided limits differ, so \(f'''(0)\) **does not exist**.
**Usual deduction:** writing \(f''(0)=0\) "since \(f'(0)=0\) is constant near 0". Never differentiate a formula at a point outside its region without checking.

---

### A2 — Proposition 1 (differentiable ⇒ continuous) and how to *use* or *refuse* it

#### A2-L1 (P2) — Is \(f(x)=x^{2}\sin(1/x),\,f(0)=0\) continuous at \(0\)? Give the shortest correct proof.

**Carries forward:** A1-L4 established differentiability at \(0\); new: **cite Prop 1 with its hypotheses and its domain** — "differentiable at \(c\in I\) ⇒ continuous at \(c\)".
**Markers want:** the citation by appendix number and the verified hypothesis. Two lines is a full mark here.
**Solution.** By A1-L4, \(f\) is differentiable at \(0\). By Proposition 1 (differentiability at a point implies continuity at that point), \(f\) is continuous at \(0\).

#### A2-L2 (P2) — If \(f\) is differentiable at \(c\), is \(|f|\) differentiable at \(c\)? Answer with proof or counterexample.

**Carries forward:** L1's citation habit; new: **the answer depends on whether \(f(c)=0\)** — this is the "all-or-nothing example question" pattern from the midterm.
**Solution.** Not in general: \(f(x)=x\) is differentiable at \(0\) but \(|f|=|\,\cdot\,|\) is not (one-sided quotients \(\pm1\)). If \(f(c)\neq0\) then \(|f|\) *is* differentiable at \(c\): by continuity (Prop 1) there is a neighbourhood where \(f\) keeps the sign of \(f(c)\), so \(|f|=\pm f\) near \(c\), and linearity of the derivative applies.
**Usual deduction:** asserting "not differentiable" with only the \(f(x)=x\) example and no statement of the case distinction. Also: the midterm's warning — the differentiability of a *newly built* function does not follow from the differentiability of \(f\) by Prop 1, since they are different functions.

#### A2-L3 (P3) — Suppose \(|f(x)|\le x^{2}\) for all \(x\in\mathbb{R}\). Prove \(f\) is differentiable at \(0\) and \(f'(0)=0\).

**Carries forward:** A1-L4's squeeze device, now *yourself* supplying the bound; new: extract \(f(0)=0\) from the hypothesis first.
**Markers want:** the squeeze written with all three terms; nothing assumed about \(f\) elsewhere.
**Solution.** At \(x=0\): \(|f(0)|\le0\) so \(f(0)=0\). For \(h\neq0\), \(0\le\left|\frac{f(h)-f(0)}{h}\right|\le\frac{h^{2}}{|h|}=|h|\to0\). Hence the difference quotient tends to \(0\), i.e. \(f'(0)=0\). Then by Prop 1, \(f\) is continuous at \(0\).

#### A2-L4 (P4/P5) — Suppose \(g:\mathbb{R}\to\mathbb{R}\) satisfies \(|g(x)-g(y)|\le|x-y|^{2}\) for all \(x,y\). Prove \(g\) is constant.

**Carries forward:** A1 quotient at an arbitrary point; A2-L3's squeeze; **new device you will reuse in B2-L2: split an interval into \(n\) equal pieces and add the estimates (telescoping).**
**Markers want:** either route stated cleanly; the quantifier "for all \(x,y\)" used with the *specific* points you chose.
**Solution (route 1 — differentiability + MVT).** Fix \(x\). For \(h\neq0\), \(\left|\frac{g(x+h)-g(x)}{h}\right|\le|h|\to0\), so \(g'(x)=0\). As \(x\) was arbitrary, \(g'\equiv0\); then \(g\) is constant (this is *not* in your appendix, so give the three lines: for \(a<b\), MVT on \([a,b]\) — \(g\) is continuous (Prop 1) and differentiable — gives \(g(b)-g(a)=g'(c)(b-a)=0\).)
**Solution (route 2 — no derivative at all).** For \(x<y\) put \(t_k=x+\frac{k}{n}(y-x)\). Then
\[
|g(y)-g(x)|\le\sum_{k=1}^{n}\bigl|g(t_k)-g(t_{k-1})\bigr|\le n\left(\frac{y-x}{n}\right)^{2}=\frac{(y-x)^{2}}{n}\to0,
\]
so \(g(x)=g(y)\). (If \(x>y\) reverse, or apply to \(|y-x|\).)
**Payoff:** route 2's inequality chain is *literally* the proof that a monotone function is integrable (B2-L2). Learn it once here.

---

### A3 — Rolle, the MVT, and the auxiliary function

Citable: Lemma 2 (Fermat), Thm 3 (Rolle), Thm 4 (MVT), Prop 5. Everything else about monotonicity is an MVT corollary you must reproduce.

#### A3-L1 (P1/P2) — Verify the MVT for \(f(x)=x^{2}\) on \([0,2]\) and find \(c\).

**Carries forward:** nothing new except the **three-part citation format** you must repeat every time: (i) continuous on the closed interval, (ii) differentiable on the open interval, (iii) then the conclusion.
**Markers want:** hypotheses checked *before* the equation; the answer \(c\in(a,b)\), not an endpoint.
**Solution.** \(f\) is continuous on \([0,2]\) (polynomial) and differentiable on \((0,2)\) with \(f'(x)=2x\). MVT: \(f(2)-f(0)=f'(c)(2-0)\), i.e. \(4=4c\), so \(c=1\in(0,2)\).

#### A3-L2 (P2) — \(f(x)=|x|\) on \([-1,1]\) satisfies \(f(-1)=f(1)\) and is continuous, yet no \(c\) has \(f'(c)=0\). Which hypothesis of Rolle's theorem fails? What if the interval were \([1,2]\)?

**Carries forward:** L1's hypothesis list; new: **name the failing hypothesis exactly** — this is the "hypothesis-failure" question type.
**Solution.** Rolle needs differentiability on all of \((-1,1)\); \(f\) is not differentiable at \(0\in(-1,1)\) (one-sided quotients \(\pm1\)). On \([1,2]\) all hypotheses hold, and indeed \(f'\equiv1\neq0\) — but now \(f(1)\neq f(2)\), so Rolle's *conclusion* is not promised: this shows the endpoint-equality hypothesis is also needed.

#### A3-L3 (P4) — Prove \(x^{3}+3x+1=0\) has **exactly one** real root.

**Carries forward:** L1's "check the hypotheses of MVT"; **new: existence uses IVT (continuity on a closed interval + sign change), uniqueness uses MVT/monotonicity.** Every root-counting question is exactly this two-part structure.
**Solution.** *Existence.* Let \(p(x)=x^{3}+3x+1\). \(p\) is continuous, \(p(-2)=-8-6+1=-13<0\) and \(p(0)=1>0\). By IVT there is \(c\in(-2,0)\) with \(p(c)=0\). *Uniqueness.* \(p'(x)=3x^{2}+3\ge3>0\) everywhere. If \(a<b\) then MVT on \([a,b]\) gives \(p(b)-p(a)=p'(c)(b-a)>0\), so \(p\) is strictly increasing; a strictly increasing function has at most one zero.

#### A3-L4 (P4/P5) — Let \(f\) be continuous on \([a,b]\) and differentiable on \((a,b)\) with \(|f'|\le K\). Prove \(|f(x)-f(y)|\le K|x-y|\) for all \(x,y\in[a,b]\), and deduce that \(f\) is uniformly continuous on \([a,b]\).

**Carries forward:** L1 (MVT on the interval *you* choose, \([x,y]\) rather than \([a,b]\)); **new: a bound on \(f'\) becomes a bound on \(f\) — the MVT's signature move. The conclusion is the uniform-continuity definition, so you must hand over a \(\delta\) that does not depend on the point.**
**Markers want:** the case \(x=y\) (or an ordering statement "assume \(x<y\)"), and a \(\delta\) explicitly of the form \(\varepsilon/K\). The midterm's note about "\(M\) cannot depend on \(x\)" applies to \(\delta\) here too.
**Solution.** If \(x=y\) there is nothing to prove. Let \(x<y\): \(f\) is continuous on \([x,y]\) and differentiable on \((x,y)\), so MVT gives \(c\in(x,y)\) with \(f(y)-f(x)=f'(c)(y-x)\), hence \(|f(y)-f(x)|\le K|y-x|\). Given \(\varepsilon>0\), choose \(\delta=\varepsilon/K\) (any \(\delta>0\) if \(K=0\)). Then for all \(x,y\in[a,b]\) with \(|x-y|<\delta\), \(|f(x)-f(y)|\le K|x-y|<\varepsilon\) — and \(\delta\) depends only on \(\varepsilon\), so \(f\) is uniformly continuous.
**Payoff:** this same Lipschitz line reappears in B4-L1 to prove that \(F(x)=\int_a^x f\) is continuous.

#### A3-L5 (P4) — Suppose \(f:\mathbb{R}\to\mathbb{R}\) is differentiable and \(f'(x)\ge a>0\) for all \(x\). Prove \(f\) is bijective.

**Carries forward:** L4's MVT-as-inequality (now with a *lower* bound); new: using MVT twice, once for \(x>0\) and once for \(x<0\), to get unboundedness. Feeds A5-L4 (inverse derivatives).
**Markers want:** injectivity and surjectivity handled separately with their definitions stated; surjectivity needing IVT *after* you have produced the two signs.
**Solution.** *Strictly increasing:* for \(x<y\), MVT gives \(f(y)-f(x)=f'(c)(y-x)\ge a(y-x)>0\). Hence injective. *Limits:* for \(x>0\), \(f(x)-f(0)=f'(c)x\ge ax\to+\infty\); for \(x<0\), \(f(x)-f(0)=f'(c)x\le ax\to-\infty\) (note the inequality flips because \(x<0\) while \(f'(c)\ge a\)). So given \(y\in\mathbb{R}\), pick \(u<0<v\) with \(f(u)<y<f(v)\); \(f\) is continuous (Prop 1) so IVT on \([u,v]\) gives \(c\) with \(f(c)=y\). Hence surjective, therefore bijective, and \(f^{-1}:\mathbb{R}\to\mathbb{R}\) exists.

#### A3-L6 (P5) — \(f\) is continuous on \([0,1]\), differentiable on \((0,1)\), \(f(0)=f(1)=0\). Prove there is \(c\in(0,1)\) with \(f'(c)+2c\,f(c)=0\).

**Carries forward:** L1's role for Rolle; **new: the auxiliary function. If the target is \(f'+p(x)f=0\), set \(g(x)=f(x)e^{P(x)}\) with \(P' = p\)** — here \(P(x)=x^{2}\).
**Markers want:** the definition of \(g\), verification that \(g\) meets Rolle's hypotheses, then the conclusion read off \(g'(c)=0\) and \(e^{c^{2}}\neq0\).
**Solution.** Let \(g(x)=e^{x^{2}}f(x)\). Then \(g\) is continuous on \([0,1]\) (product of continuous functions) and differentiable on \((0,1)\) with \(g'(x)=e^{x^{2}}\bigl(f'(x)+2x f(x)\bigr)\), and \(g(0)=g(1)=0\). Rolle gives \(c\in(0,1)\) with \(g'(c)=0\); since \(e^{c^{2}}>0\), \(f'(c)+2c f(c)=0\).
**Bank of targets:** \(f'+pf=0\Rightarrow fe^{\int p}\); \(f'-pf=0\Rightarrow fe^{-\int p}\); \(f'=\lambda f\Rightarrow e^{-\lambda x}f\); \(f'g=fg'\Rightarrow f/g\) or \(gf'-g'f=0\Rightarrow f/g\); \(xf'(x)+f(x)=0\Rightarrow xf\) (product rule backwards); \(f'(c)=\frac{f(b)-f(a)}{b-a}\) with \(f(a)=f(b)\) — just Rolle on \(f\) itself.

---

### A4 — Darboux's theorem: derivatives have the IVP for free

Citable: Thm 7. Use it whenever the question is about **values of \(f'\)**, not values of \(f\).

#### A4-L1 (P1/P2) — State Darboux's theorem. \(f\) is differentiable on \([0,1]\) with \(f'(0)=1\), \(f'(1)=3\). What can you conclude? What if \(f'(0)=1\), \(f'(1)=3\) but you were only told \(f'\) is *bounded*?

**Carries forward:** A3's habit of quoting a theorem's hypotheses verbatim; new: Darboux needs differentiability **on the closed interval** \([a,b]\) (which includes one-sided endpoint derivatives) — not just on \((a,b)\).
**Markers want:** the statement with \(f'(a)<y<f'(b)\) and \(c\in(a,b)\) **open**; the conclusion "there exists \(c\) with \(f'(c)=2\)" named as Darboux, not IVT (\(f'\) need not be continuous — see A1-L4).
**Solution.** Since \(f\) is differentiable on \([0,1]\) and \(f'(0)=1<2<3=f'(1)\), Darboux gives \(c\in(0,1)\) with \(f'(c)=2\). Boundedness of \(f'\) is irrelevant here and guarantees nothing about intermediate values; the point of Darboux is that no continuity of \(f'\) is needed.

#### A4-L2 (P4) — Let \(f\) be differentiable on \((a,b)\) and suppose \(f'(x)\neq0\) for every \(x\). Prove \(f'\) is either everywhere positive or everywhere negative.

**Carries forward:** L1's Darboux; **new: proof by contradiction with a precisely negated quantifier.** Exercise 8 Q1 asked exactly this, and its rubric asked "is the setup for a proof by contradiction done correctly?"
**Solution.** Suppose not: then there exist \(u,v\in(a,b)\) with \(f'(u)>0\) and \(f'(v)\le0\) (this is the negation of "\(f'\) is everywhere positive"; note \(\le\), not \(<\)). Since \(f'(x)\neq0\) for all \(x\) by hypothesis, in fact \(f'(v)<0\). Assume \(u<v\) (otherwise swap names — say so). \(f\) is differentiable on \([u,v]\subset(a,b)\), so Darboux applies on \([u,v]\) with \(y=0\) between \(f'(u)>0>f'(v)\): there is \(c\in(u,v)\) with \(f'(c)=0\), contradicting \(f'\neq0\). Hence \(f'>0\) everywhere or \(f'<0\) everywhere.
**Usual deduction:** negating "always positive" as "always negative"; forgetting to use \(f'\neq0\) to upgrade \(\le0\) to \(<0\); applying Darboux on \((a,b)\) instead of on \([u,v]\).

#### A4-L3 (P5) — Prove there is **no** function \(F\) with \(F'(x)=\operatorname{sgn}(x)\) for all \(x\in(-1,1)\) (with \(\operatorname{sgn}0=0\) or \(1\)).

**Carries forward:** L2's contrapositive thinking; new: **"not a derivative" is a Darboux-based verdict.** This is the standard way to *refute* an antiderivative claim.
**Solution.** \(\operatorname{sgn}\) takes the value \(-1\) on \((-1,0)\) and \(1\) on \((0,1)\), and never takes the value \(0\) if \(\operatorname{sgn}0\neq0\). Suppose \(F'=\operatorname{sgn}\) everywhere on \((-1,1)\). Then \(F\) is differentiable on the closed interval \([-\tfrac12,\tfrac12]\), with \(F'(-\tfrac12)=-1<0<1=F'(\tfrac12)\). Darboux (Thm 7) gives \(c\in(-\tfrac12,\tfrac12)\) with \(F'(c)=0\), i.e. \(\operatorname{sgn}(c)=0\) — impossible. If instead \(\operatorname{sgn}0=0\): A4-L2 applied on \((0,1)\) gives \(F'>0\) there and on \((-1,0)\) gives \(F'<0\) there, so \(F\) is strictly increasing on \((0,1)\) and strictly decreasing on \((-1,0)\) while \(F'(x)=\pm1\) never vanishes — but Darboux on \([\tfrac1n,1]\) versus \([-1,-\tfrac1n]\) still forces every value between \(-1\) and \(1\) to be taken near 0, contradicting \(\operatorname{sgn}\in\{-1,0,1\}\). Either way no such \(F\) exists.

#### A4-L4 (P5) — Let \(f\) be differentiable on \((a,b)\) with \(f'(x)\neq0\) for all \(x\). Prove \(f\) is injective. Why is "\(f'\) continuous" *not* needed?

**Carries forward:** L2 (constant sign) \(\to\) A3-L3's MVT-for-monotonicity \(\to\) monotone implies injective. Three earlier answers chained into one.
**Solution.** By A4-L2, \(f'>0\) everywhere or \(f'<0\) everywhere; take the first case. For \(x<y\), \(f\) is continuous on \([x,y]\) (Prop 1) and differentiable on \((x,y)\), so MVT gives \(f(y)-f(x)=f'(c)(y-x)>0\). Hence \(x\neq y\Rightarrow f(x)\neq f(y)\): injective. Continuity of \(f'\) is not needed because Darboux supplies the sign conclusion without it.

---

### A5 — Inverse functions and the IFT (Thm 6)

Midterm Q9's lesson, verbatim: *"the hypotheses of the Inverse Function Theorem also had to be checked before applying it"*, and *"merely stating the final derivative was not sufficient for full credit."*

#### A5-L1 (P1/P2) — \(f\) is \(C^{1}\) near \(2\), \(f(2)=5\), \(f'(2)=3\). Find \((f^{-1})'(5)\), listing every hypothesis you used.

**Carries forward:** A3's hypothesis-audit format; new: the IFT checklist — (1) \(f\in C^{1}(a,b)\), (2) \(x_{0}\in(a,b)\) with \(f'(x_{0})\neq0\), (3) \(y_{0}=f(x_{0})\), (4) then a neighbourhood \(J\) of \(y_{0}\) and a \(C^{1}\) inverse \(g:J\to I\) with \(g'(y_{0})=1/f'(x_{0})\).
**Markers want:** the pairing "\(g=f^{-1}\), so \(g(5)=2\)" stated explicitly; the number \(g'(5)=1/f'(f^{-1}(5))=1/f'(2)=1/3\).
**Solution.** \(f\in C^{1}\) near 2 and \(f'(2)=3\neq0\), so Thm 6 applies with \(x_{0}=2\), \(y_{0}=f(2)=5\): there are intervals \(I\ni2\), \(J\ni5\) with \(f:I\to J\) bijective and \(g=f^{-1}:J\to I\) of class \(C^{1}\), and \((f^{-1})'(5)=1/f'(2)=1/3\).

#### A5-L2 (P4) — Using \(\exp\) as the inverse of \(\ln\), prove \((\ln x)'=1/x\) for \(x>0\).

**Carries forward:** L1's checklist; new: **naming which function is the inverse of which** (here \(\exp\circ\ln=\mathrm{id}\) on \((0,\infty)\) and \(\ln\circ\exp=\mathrm{id}\) on \(\mathbb{R}\)), plus the fact \(\exp'=\exp\neq0\).
**Solution.** \(\ln:(0,\infty)\to\mathbb{R}\) is bijective (strictly increasing since \(\ln'=1/x>0\) once proved, or by the Lebl 5.4 construction as an integral) with \(C^{1}\) inverse \(\exp\), and \(\exp'(t)=\exp(t)\neq0\) for all \(t\). Apply Thm 6 to \(f=\exp\) at \(x_{0}=\ln x\): the local \(C^{1}\) inverse is \(\ln\), so \((\ln)'(x)=1/\exp'(\ln x)=1/\exp(\ln x)=1/x\).
**Usual deduction:** using the rule to prove the derivative (circular), or never mentioning \(\exp\neq0\).

#### A5-L3 (P4) — Prove \(g(y)=y^{1/n}\) is differentiable on \((0,\infty)\) with \(g'(y)=\frac1n y^{\frac{1-n}{n}}\).

**Carries forward:** L1/L2 with \(f(x)=x^{n}\); new: checking \(f'(x_{0})\neq0\) means \(x_{0}\neq0\), which is *why the answer excludes 0*.
**Solution.** Let \(f:(0,\infty)\to(0,\infty)\), \(f(x)=x^{n}\). \(f\in C^{\infty}\), \(f'(x)=nx^{n-1}>0\) on \((0,\infty)\), and \(f\) is bijective onto \((0,\infty)\) (existence of the positive \(n\)-th root, plus strict monotonicity \(\Rightarrow\) injectivity). Fix \(y>0\), \(x_{0}=g(y)=y^{1/n}>0\); then \(f'(x_{0})\neq0\), so Thm 6 gives \(g'(y)=1/f'(g(y))=1/(n y^{(n-1)/n})=\frac1n y^{(1-n)/n}\).

#### A5-L4 (P2/P5) — \(f(x)=x^{3}\) is a bijection \(\mathbb{R}\to\mathbb{R}\) with \(f'(0)=0\). Show directly that \(f^{-1}(y)=y^{1/3}\) is **not** differentiable at \(0\). What does this tell you about the IFT's hypotheses? Also: does \(f\) itself have a local extremum at 0?

**Carries forward:** A1-L3's rationalisation-style quotient; new: **hypothesis-sharpness answers** — the exam asks "why is the hypothesis needed?" and the answer is always one specific function.
**Solution.** \(\frac{y^{1/3}-0}{y-0}=y^{-2/3}\to+\infty\) as \(y\to0\), so no finite derivative: the hypothesis \(f'(x_{0})\neq0\) cannot be dropped. Note \(f\) is strictly increasing (MVT: \(f(b)-f(b')=3c^{2}(b-b')\ge0\), and \(>0\) since \(c\neq0\) when \(b\neq b'\\) or just \(b^{3}>b'^{3}\) for \(b>b'\)), so 0 is not an extremum — this is why Fermat's Lemma 2 is *not* violated: it says nothing when there is no extremum, and its converse fails (\(f'(0)=0\) need not give an extremum: \(x^{3}\)).

---

### A6 — Taylor polynomials and Lagrange-remainder estimates (Week 7, **not in the appendix**)

You must state the theorem *with its hypotheses* every time: \(f\) has \(n\) continuous derivatives on \([a,b]\) and \(f^{(n+1)}\) exists on \((a,b)\); then for \(x_{0}\neq x\) there is \(c\) **between** \(x_{0}\) and \(x\) with \(f(x)=P_{x_{0}}^{n}(x)+\frac{f^{(n+1)}(c)}{(n+1)!}(x-x_{0})^{n+1}\).

#### A6-L1 (P1) — Compute \(P_{0}^{3}\) for \(e^{x}\) and \(P_{0}^{4}\) for \(\cos x\). Then write \(P_{0}^{2}\) for \(\ln(1+x)\).

**Carries forward:** nothing new; this is the free-mark computation. Table discipline: list \(f^{(k)}(x_{0})\) in a column before assembling \(\sum_{k=0}^{n}\frac{f^{(k)}(x_{0})}{k!}(x-x_{0})^{k}\).
**Solution.** \(P_{0}^{3}(e^{x})=1+x+\frac{x^{2}}{2}+\frac{x^{3}}{6}\). \(P_{0}^{4}(\cos x)=1-\frac{x^{2}}{2}+\frac{x^{4}}{24}\) (the odd terms vanish: \(-\sin0=0\), \(\sin0=0\)). For \(\ln(1+x)\): \(f(0)=0\), \(f'=\frac1{1+x}\Rightarrow f'(0)=1\), \(f''=-\frac1{(1+x)^{2}}\Rightarrow f''(0)=-1\); \(P_{0}^{2}=x-\frac{x^{2}}{2}\).

#### A6-L2 (P4) — Prove \(0<e-P_{0}^{n}(1)<\dfrac{3}{(n+1)!}\) where \(P_{0}^{n}\) is the Taylor polynomial of \(e^{x}\).

**Carries forward:** L1's polynomial; **new: the remainder *is* the estimate — bound \(|f^{(n+1)}|\) by a single constant \(M\) on the interval containing \(x_{0}\) and \(x\).** Here that interval is \([0,1]\).
**Markers want:** "\(c\in(0,1)\)" stated; the bound \(e^{c}\le e<3\) justified (not "\(e^{c}\le e^{1}\)\,which is what we're estimating" — circularity is the classic deduction here).
**Solution.** \(e^{x}\in C^{\infty}[0,1]\), so Taylor at \(x_{0}=0\), \(x=1\): \(e=P_{0}^{n}(1)+\frac{e^{c}}{(n+1)!}\) for some \(c\in(0,1)\). Since \(e^{c}>0\), \(e-P_{0}^{n}(1)>0\). Since \(c<1\), \(e^{c}<e<3\) (use \(e=\exp(1)\), \(\exp\) strictly increasing because \(\exp'=\exp>0\)), giving \(e-P_{0}^{n}(1)=\frac{e^{c}}{(n+1)!}<\frac{3}{(n+1)!}\).

#### A6-L3 (P4) — Prove \(\bigl|\sin x-\bigl(x-\frac{x^{3}}{6}\bigr)\bigr|\le\dfrac{|x|^{5}}{120}\) for all \(x\in\mathbb{R}\).

**Carries forward:** L2's remainder machinery; new: (i) \(P_{0}^{4}(\sin)=P_{0}^{3}(\sin)\) because the \(x^{4}\) coefficient is \(\sin'\!^{(4)}(0)/4!=0\), so you may use \(n=4\) and its \(5\)th derivative; (ii) take absolute values *after* the remainder; (iii) \(|\cos c|\le1\) globally, so no restriction on \(x\).
**Solution.** Apply Taylor to \(\sin x\) at \(x_{0}=0\) with \(n=4\) on the interval between \(0\) and \(x\): for some \(c\) between \(0\) and \(x\),
\[
\sin x=P_{0}^{4}(x)+\frac{\frac{d^{5}}{dx^{5}}\sin(c)}{5!}x^{5}=\Bigl(x-\frac{x^{3}}{6}\Bigr)-\frac{\cos c}{120}x^{5},
\]
so \(|\sin x-(x-x^{3}/6)|=\frac{|\cos c|}{120}|x|^{5}\le\frac{|x|^{5}}{120}\).

#### A6-L4 (P4/P5) — Prove the second derivative test: if \(f\in C^{2}(a,b)\), \(f'(x_{0})=0\), \(f''(x_{0})>0\), then \(f\) has a strict relative minimum at \(x_{0}\).

**Carries forward:** A1-L4/L5's "sign of \(f'\) on a whole neighbourhood" issue resolved by \(C^{2}\) + Taylor; new: **continuity of \(f''\) is used to propagate a sign from a point to an interval** — the same move as in the IFT proof.
**Solution.** Since \(f''\) is continuous and \(f''(x_{0})>0\), there is \(\delta>0\) with \(f''(t)>0\) for \(|t-x_{0}|<\delta\). For \(x\in(x_{0}-\delta,x_{0}+\delta)\), \(x\neq x_{0}\), Taylor with \(n=1\) gives \(f(x)=f(x_{0})+f'(x_{0})(x-x_{0})+\frac{f''(c)}{2}(x-x_{0})^{2}=f(x_{0})+\frac{f''(c)}{2}(x-x_{0})^{2}\) with \(c\) between \(x_{0}\) and \(x\). Both factors in the last term are positive, so \(f(x)>f(x_{0})\): strict relative minimum.
**Note:** with \(f''\) merely existing (not continuous) the conclusion can fail — \(f(x)=x^{4}\sin(1/x)\)-type examples; that is why the theorem says \(C^{2}\).

#### A6-L5 (P5, stretch) — Prove that \(e\) is irrational.

**Carries forward:** A6-L2's bound \(0<e-P_{0}^{n}(1)<3/(n+1)!\) turned into a *number-theoretic* contradiction. Only worth exam time if your lectures used Taylor this way; the technique (multiply by \(n!\), squeeze between 0 and 1) is the reusable part.
**Solution.** Suppose \(e=p/q\) with \(p,q\in\mathbb{N}\). For \(n\ge q\), \(n!\,e=n!p/q\in\mathbb{Z}\) and \(n!\,P_{0}^{n}(1)=n!\sum_{k=0}^{n}\frac1{k!}\in\mathbb{Z}\). Hence \(N:=n!(e-P_{0}^{n}(1))\in\mathbb{Z}\). But by A6-L2, \(0<N<\frac{3n!}{(n+1)!}=\frac{3}{n+1}\le1\) for \(n\ge2\). Choosing \(n\ge\max\{q,2\}\) gives an integer strictly between 0 and 1 — contradiction.

---

## TOPIC B — INTEGRATION

### B1 — Darboux sums: reading \(m_i,M_i,L(P,f),U(P,f)\) off a function

The definition, cold: \(P=\{x_0<\dots<x_n\}\), \(\Delta x_i=x_i-x_{i-1}\), \(m_i=\inf_{[x_{i-1},x_i]}f\), \(M_i=\sup_{[x_{i-1},x_i]}f\), \(L(P,f)=\sum m_i\Delta x_i\), \(U(P,f)=\sum M_i\Delta x_i\). **The infimum and supremum are taken over the closed subinterval, endpoints included** — that single detail is what makes or breaks every problem in this ladder.

#### B1-L1 (P1) — \(f\equiv C\) on \([a,b]\). Compute \(L(P,f)\) and \(U(P,f)\) for an arbitrary partition, and \(\underline{\int_a^b}f\), \(\overline{\int_a^b}f\), \(\int_a^b f\).

**Carries forward:** the definitions themselves; new: the idea that **the lower/upper integrals are a sup/inf over all partitions**, so once every sum equals \(C(b-a)\) the sup and inf are trivial.
**Markers want:** \(m_i=M_i=C\) stated (not assumed), the sum \(\sum\Delta x_i=b-a\) shown as a telescoping line.
**Solution.** On every subinterval \(m_i=M_i=C\), so \(L(P,f)=U(P,f)=C\sum_{i=1}^{n}\Delta x_i=C(b-a)\). Hence \(\underline{\int}=\overline{\int}=C(b-a)\): \(f\) is Riemann integrable with \(\int_a^b f=C(b-a)\).

#### B1-L2 (P1/P3) — \(f(x)=x\) on \([0,1]\), \(P_n=\{0,\frac1n,\dots,1\}\). Compute \(L(P_n,f)\) and \(U(P_n,f)\), and prove \(f\in\mathcal{R}[0,1]\) with integral \(\frac12\) **without antiderivatives**.

**Carries forward:** L1's \(\sum\Delta x_i=b-a\); new: \(\sum_{k=1}^{n-1}k=\frac{n(n-1)}2\) and then **Squeeze / limit argument**; this is Exercise 9 Q5's model answer and the rubric said *"check whether the value of the integral is obtained from the definition rather than by inspection or by using antiderivatives."*
**Markers want:** \(m_i,M_i\) justified by monotonicity ("\(f\) is increasing, so the inf on \([\frac{i-1}n,\frac in]\) is the left endpoint value") — one word like *increasing* earns the mark; the limit \(n\to\infty\); and the closing sentence naming that \(\underline{\int}=\overline{\int}\).
**Solution.** \(\Delta x_i=1/n\), \(m_i=\frac{i-1}{n}\), \(M_i=\frac in\). Thus
\[
L(P_n,f)=\frac1{n^{2}}\sum_{i=1}^{n}(i-1)=\frac{n(n-1)}{2n^{2}}=\frac{n-1}{2n},\qquad
U(P_n,f)=\frac{n(n+1)}{2n^{2}}=\frac{n+1}{2n}.
\]
For this **fixed** \(n\): \(L(P_n,f)\le\underline{\int}f\le\overline{\int}f\le U(P_n,f)\) — the outer two inequalities are immediate from \(\underline{\int}=\sup_P L(P,f)\) and \(\overline{\int}=\inf_P U(P,f)\), and the middle one is the common-refinement step that proves Prop 10 (see C-L7). Letting \(n\to\infty\), both bounds tend to \(\frac12\), so \(\underline{\int}=\overline{\int}=\frac12\), which is the definition of \(f\in\mathcal R[0,1]\) with integral \(\frac12\). (Separately, \(U-L=1/n<\varepsilon\) for large \(n\) gives integrability directly by Prop 11 — either route is full credit, but the first is what "from the definition" asks for.)

#### B1-L3 (P1/P2) — \(f(x)=0\) for \(x<1\), \(f(x)=1\) for \(x\ge1\), on \([0,2]\), \(P=\{0,1,2\}\). Compute \(L,U\). Then show \(f\in\mathcal{R}[0,2]\) and \(\int_0^2 f=1\).

**Carries forward:** L2's "use monotonicity to read off \(m_i,M_i\)"; new: **the subinterval containing the jump is where \(M_i-m_i\neq0\), and you can shrink it.** This device is the whole of B2-L1 and B2-L4.
**Markers want:** \(m_1=0,M_1=1\) *with a reason* (values on \([0,1]\) include \(f(1)=1\) and \(f(0)=0\)); then a \(P\) built for a given \(\varepsilon\).
**Solution.** On \([0,1]\): \(f\) takes \(0\) and \(1\), so \(m_1=0,M_1=1\). On \([1,2]\): \(f\equiv1\), \(m_2=M_2=1\). \(L(P,f)=0\cdot1+1\cdot1=1\), \(U(P,f)=1+1=2\). For integrability, given \(\varepsilon>0\) take \(Q=\{0,1-\eta,1,2\}\) with \(\eta<\varepsilon\): on \([1-\eta,1]\), \(m=0,M=1\); elsewhere \(m=M\). \(U(Q,f)-L(Q,f)=\eta<\varepsilon\) and Prop 11 gives \(f\in\mathcal R[0,2]\). Finally \(L(Q,f)=1\) and \(U(Q,f)=1+\eta\), so \(1\le\int_0^2 f\le1+\eta\) for every \(\eta\), forcing \(\int_0^2 f=1\).

#### B1-L4 (P2/P5) — \(f=\mathbf{1}_{[1/2,3/4]}\) on \([0,1]\). Show that \(L(P_4,f)>L(P_5,f)\) for two explicit partitions. Why does this **not** contradict Prop 9 (refinements)?

**Carries forward:** L3's endpoint-inclusion care; new: **Prop 9 only compares a partition with its refinement** (\(P\subset\tilde P\)); two unrelated partitions need not compare. This is the Exercise-10 Q2 trap.
**Markers want:** the \(m_i,M_i\) table; the words "\(P_4\) and \(P_5\) are not refinements of one another".
**Solution.** \(P_4=\{0,\tfrac14,\tfrac12,\tfrac34,1\}\), all \(\Delta x_i=\tfrac14\). Intervals: \([0,\tfrac14]\): \(f\equiv0\), \(m=M=0\). \([\tfrac14,\tfrac12]\): \(f=0\) except \(f(\tfrac12)=1\), so \(m=0,M=1\). \([\tfrac12,\tfrac34]\): \(f\equiv1\), \(m=M=1\). \([\tfrac34,1]\): \(f=0\) except \(f(\tfrac34)=1\), \(m=0,M=1\). Hence \(L(P_4,f)=\tfrac14(0+0+1+0)=\tfrac14\), \(U(P_4,f)=\tfrac14(0+1+1+1)=\tfrac34\). \(P_5=\{0,\tfrac15,\tfrac25,\tfrac35,\tfrac45,1\}\), \(\Delta x_i=\tfrac15\): only \([\tfrac25,\tfrac35]\) and \([\tfrac35,\tfrac45]\) meet \([\tfrac12,\tfrac34]\), each with \(m=0,M=1\); the rest have \(m=M=0\). So \(L(P_5,f)=0\), hence \(L(P_5,f)=0<\tfrac14=L(P_4,f)\). No contradiction: \(P_5\not\supset P_4\).

#### B1-L5 (P3/P5) — Dirichlet: \(f=\mathbf{1}_{\mathbb{Q}}\) on \([2,5]\). Compute \(m_i,M_i,L(P,f),U(P,f)\) for an arbitrary \(P\), the lower and upper integrals, and prove \(f\notin\mathcal{R}[2,5]\). Also answer TT2's bonus: *why must \(f\) be bounded in the definition?*

**Carries forward:** L1–L4's reading of \(m_i,M_i\); new: **density of \(\mathbb{Q}\) and of \(\mathbb{R}\setminus\mathbb{Q}\)** supplies the inf/sup, and "not integrable" must be proved by \(\overline{\int}-\underline{\int}>0\) (equivalently an \(\varepsilon_0\) with \(U-L\ge\varepsilon_0\) for every \(P\)) — never by "too pathological".
**Solution.** Every subinterval \([x_{i-1},x_i]\) (with \(x_{i-1}<x_i\)) contains a rational and an irrational, so \(m_i=0\), \(M_i=1\). Hence \(L(P,f)=0\) and \(U(P,f)=\sum\Delta x_i=3\) for **every** partition. Therefore \(\underline{\int}=\sup_P L=0\), \(\overline{\int}=\inf_P U=3\neq0\): not Riemann integrable. Equivalently, with \(\varepsilon_0=1\), \(U(P,f)-L(P,f)=3\ge\varepsilon_0\) for all \(P\), violating Prop 11. Boundedness is needed so that \(m_i,M_i\) are finite reals and \(\{L(P,f)\}\) is bounded above (by \(M(b-a)\)) while \(\{U(P,f)\}\) is bounded below — completeness of \(\mathbb{R}\) then makes \(\sup\) and \(\inf\) exist as real numbers, so the definition of \(\underline{\int},\overline{\int}\) makes sense.
**Same-shape harder example (know the idea):** the Thomae function (\(1/q\) at \(m/q\) reduced, 0 at irrationals) **is** integrable with integral 0: for each \(k\) only finitely many points have value \(\ge1/k\), so cover those \(k\)-many points by intervals of total length \(<\varepsilon\) and use L3's shrinking device.

---

### B2 — Proving integrability with Riemann's condition (Prop 11)

Template for every proof: *given \(\varepsilon>0\), construct a partition \(P\) with \(U(P,f)-L(P,f)<\varepsilon\).* The only freedom is how you choose \(P\).

#### B2-L1 (P3) — \(f\) is bounded on \([a,b]\) and \(f(x)=0\) except at a single point \(c\in(a,b)\). Prove \(f\in\mathcal{R}[a,b]\) and \(\int_a^b f=0\).

**Carries forward:** B1-L3's "shrink the bad subinterval"; new: **splitting \(\varepsilon\) between the bad part and the good part** — \(2M\cdot\eta<\varepsilon/2\) where \(|f|\le M\).
**Markers want:** \(\eta\) chosen explicitly in terms of \(\varepsilon\) and \(M\); the partition written out with the two extra points; a closing line for the integral value.
**Solution.** Let \(|f|\le M\) on \([a,b]\). Given \(\varepsilon>0\), choose \(\eta>0\) with \(4M\eta<\varepsilon\) and \((c-\eta,c+\eta)\subset(a,b)\), and take \(P=\{a,\,c-\eta,\,c+\eta,\,b\}\). On \([a,c-\eta]\) and \([c+\eta,b]\) we have \(f\equiv0\), so \(m_i=M_i=0\). On \([c-\eta,c+\eta]\) the function takes the value \(0\) (at every point except \(c\)) and \(f(c)\), so \(-M\le m_i\le0\le M_i\le M\); therefore \(M_i-m_i\le2M\) and \(|m_i|,|M_i|\le M\). Then
\[
U(P,f)-L(P,f)=\bigl(M_i-m_i\bigr)\cdot2\eta\le4M\eta<\varepsilon,
\]
so Prop 11 gives \(f\in\mathcal R[a,b]\). Moreover \(L(P,f)\ge-2M\eta\) and \(U(P,f)\le2M\eta\), and since \(L(P,f)\le\int_a^b f\le U(P,f)\) for every partition, \(\bigl|\int_a^b f\bigr|\le2M\eta\), which for arbitrarily small \(\eta\) forces \(\int_a^b f=0\).

#### B2-L2 (P3/P4) — Prove: a **monotone** function \(f:[a,b]\to\mathbb{R}\) is Riemann integrable. (Assume increasing.)

**Carries forward:** **A2-L4 route 2's equal-split + telescoping sum, verbatim**; new: for a monotone function the sup and inf on a subinterval are just the **endpoint values**, so \(M_i-m_i=f(x_i)-f(x_{i-1})\) and the sum telescopes.
**Markers want:** the uniform partition stated as \(\Delta x=(b-a)/n\); the telescoping written in full; the final \(n\)-choice.
**Solution.** Increasing \(f\) is bounded by \(f(a),f(b)\). Take \(P_n\) with \(x_i=a+\frac{i(b-a)}n\). On \([x_{i-1},x_i]\), \(m_i=f(x_{i-1})\), \(M_i=f(x_i)\), so
\[
U(P_n,f)-L(P_n,f)=\frac{b-a}{n}\sum_{i=1}^{n}\bigl(f(x_i)-f(x_{i-1})\bigr)=\frac{b-a}{n}\bigl(f(b)-f(a)\bigr)\longrightarrow0.
\]
Given \(\varepsilon>0\) choose \(n>\frac{(b-a)(f(b)-f(a))}{\varepsilon}\); then \(U-L<\varepsilon\) and Prop 11 applies. (If \(f\) is decreasing apply this to \(-f\), whose upper sums satisfy \(U(P,-f)=-L(P,f)\).)

#### B2-L3 (P3/P4) — Prove Lemma 14: \(f\) continuous on \([a,b]\) \(\Rightarrow f\in\mathcal{R}[a,b]\).

**Carries forward:** B2-L2's partition-sum skeleton \(U-L=\sum(M_i-m_i)\Delta x_i\); new: **uniform continuity supplies \(M_i-m_i<\delta\)-control simultaneously on all subintervals**, and EVT says the sup/inf are attained. Chain: A3-L4 \(\Rightarrow\) uniform continuity \(\Rightarrow\) here; C4 also gives it directly.
**Markers want:** the \(\varepsilon/(b-a)\) trick stated as such; the theorem "continuous on a closed bounded interval \(\Rightarrow\) uniformly continuous" cited (Week 4) rather than re-proved; the partition described by its mesh.
**Solution.** Given \(\varepsilon>0\): \(f\) is uniformly continuous on \([a,b]\), so there is \(\delta>0\) with \(|x-y|<\delta\Rightarrow|f(x)-f(y)|<\varepsilon/(b-a)\). Choose a partition with \(\Delta x_i<\delta\) for all \(i\) (e.g. uniform with \(n>(b-a)/\delta\)). By EVT, on each \([x_{i-1},x_i]\) there are \(u_i,v_i\) with \(M_i=f(u_i)\), \(m_i=f(v_i)\); since \(|u_i-v_i|\le\Delta x_i<\delta\), \(M_i-m_i<\varepsilon/(b-a)\). Therefore \(U-L<\frac{\varepsilon}{b-a}\sum\Delta x_i=\varepsilon\), and Prop 11 gives \(f\in\mathcal{R}\).

#### B2-L4 (P3/P5) — Prove: if \(f\in\mathcal{R}[a,b]\) and \(g\) differs from \(f\) at only finitely many points, then \(g\in\mathcal{R}[a,b]\). (Ex 10 Q1 / Prop 5.2.10 — the model \(\varepsilon\)-proof of the course.)

**Carries forward:** B2-L1's \(\varepsilon/2\) split and shrinking intervals; B2-L2/L3's partition bookkeeping; new: **propagating from one point to finitely many by induction** and using refinements to keep \(f\)'s sums under control.
**Markers want:** a partition for \(f\) chosen *first* (from Prop 11 applied to \(f\) with \(\varepsilon/2\)), then points inserted; both \(U(Q,g)\) and \(L(Q,g)\) compared to \(f\)'s; the explicit bound \(d\cdot\eta<\varepsilon/2\).
**Solution (one point \(c\), then iterate).** Given \(\varepsilon>0\), Prop 11 applied to \(f\) gives \(P\) with \(U(P,f)-L(P,f)<\varepsilon/2\). Let \(d=|f(c)-g(c)|\ge0\) and pick \(\eta>0\) with \(4d\eta<\varepsilon/2\) so small that the four points below are distinct and ordered; put \(Q=P\cup\{c-\eta,\,c,\,c+\eta\}\). \(Q\) refines \(P\), so Prop 9 gives \(L(Q,f)\ge L(P,f)\) and \(U(Q,f)\le U(P,f)\). Since \(|f(x)-g(x)|\le d\) everywhere, on each subinterval \([x_{i-1},x_i]\) of \(Q\) we have \(m_i(f)-d\le m_i(g)\) and \(M_i(g)\le M_i(f)+d\); on subintervals whose closure avoids \(c\), \(f\equiv g\) so equality holds. Only the two subintervals \([c-\eta,c]\) and \([c,c+\eta]\) can differ, and each has length \(\eta\). Hence
\[
U(Q,g)\le U(Q,f)+2d\eta,\qquad L(Q,g)\ge L(Q,f)-2d\eta,
\]
so \(U(Q,g)-L(Q,g)\le U(Q,f)-L(Q,f)+4d\eta\le U(P,f)-L(P,f)+4d\eta<\tfrac\varepsilon2+\tfrac\varepsilon2=\varepsilon\), and Prop 11 gives \(g\in\mathcal R\). Finitely many points: repeat, or cover them by intervals of total length \(<\varepsilon/(2D)\) where \(D=\sup|f-g|\).
**Payoff (state it as a corollary):** changing \(f\) at finitely many points leaves \(\int\) unchanged — because \(f-g\) is integrable with integral 0 by B2-L1 iterated, and linearity gives \(\int g=\int f\).

#### B2-L5 (P4/P5) — Prove Thm 13's integrability half: \(f\in\mathcal{R}[a,b]\Rightarrow|f|\in\mathcal{R}[a,b]\).

**Carries forward:** B2-L3's "control \(M_i-m_i\)" idea; new: the **reverse triangle inequality** and the two-step \(\sup\)-then-\(\inf\) argument.
**Markers want:** the quantifier discipline in the \(\sup/\inf\) step (this is exactly the midterm's "\(M\) cannot depend on \(x\)" theme).
**Solution.** Write \(m_i,M_i\) for \(f\) and \(\tilde m_i,\tilde M_i\) for \(|f|\) on \([x_{i-1},x_i]\). For \(x,y\) in that subinterval, \(||f(x)|-|f(y)||\le|f(x)-f(y)|\le M_i-m_i\). Fix \(y\); then for all \(x\), \(|f(x)|\le|f(y)|+(M_i-m_i)\); taking \(\sup_x\): \(\tilde M_i\le|f(y)|+(M_i-m_i)\). Hence \(\tilde M_i-(M_i-m_i)\le|f(y)|\) for every \(y\), so taking \(\inf_y\): \(\tilde M_i-(M_i-m_i)\le\tilde m_i\), i.e. \(\tilde M_i-\tilde m_i\le M_i-m_i\). Multiplying by \(\Delta x_i\) and summing: \(U(P,|f|)-L(P,|f|)\le U(P,f)-L(P,f)<\varepsilon\) for the \(P\) given by Prop 11. So \(|f|\in\mathcal R\). The inequality half is then two lines: \(-|f|\le f\le|f|\) with Prop 12 and linearity gives \(\bigl|\int f\bigr|\le\int|f|\).

---

### B3 — Properties of the integral: estimates, mean value, vanishing

Citable: Prop 8, 10, 12, 13. **Not** citable (state + justify): additivity in the interval, linearity, the mean value theorem for integrals, \(\int_a^a=0\) / \(\int_a^b=-\int_b^a\).

#### B3-L1 (P1) — Without integrating, show \(5\le\int_2^3(x^{2}+1)\,dx\le10\). Then compute the integral and check.

**Carries forward:** B1-L1's \(\int C=C(b-a)\) and Prop 8/10's bounding idea; new: **Prop 12 (monotonicity) is the comparison engine** \(m\le f\le M\Rightarrow m(b-a)\le\int f\le M(b-a)\).
**Markers want:** where the extrema occur ("\(x\mapsto x^{2}+1\) is increasing on \([2,3]\), so min 5, max 10" — monotonicity/EVT, not a glance); the length \(b-a=1\) used explicitly.
**Solution.** For \(x\in[2,3]\), \(5\le x^{2}+1\le10\). The constant functions are integrable (B1-L1) and \(f\) is continuous, hence integrable (Lemma 14). Prop 12 gives \(5(3-2)\le\int_2^3f\le10(3-2)\), i.e. \(5\le\cdot\le10\). Check: \(\int_2^3(x^{2}+1)=[\frac{x^{3}}3+x]_2^3=(9+3)-(\frac83+2)=\frac{22}3\approx7.33\in[5,10]\).

#### B3-L2 (P1) — Given \(\int_0^1 f=3\) and \(\int_1^3 f=-2\), compute \(\int_0^3(2f-1)\), \(\int_3^1 f\), \(\int_2^2 f\).

**Carries forward:** B1-L1 (integral of a constant); new: **the two conventions and additivity, named as such** — linearity needs both functions integrable, which is owed to you here.
**Solution.** Additivity: \(\int_0^3 f=3+(-2)=1\). Linearity: \(\int_0^3(2f-1)=2(1)-1\cdot(3-0)=2-3=-1\). \(\int_3^1 f=-\int_1^3 f=2\). \(\int_2^2 f=0\) (convention).

#### B3-L3 (P2/P4) — Prove \(\bigl|\int_a^b f\bigr|\le\int_a^b|f|\) for \(f\in\mathcal R\), and show the inequality can be strict. Then prove \(\bigl|\int_a^b f\bigr|\le M(b-a)\) when \(|f|\le M\).

**Carries forward:** B2-L5 (\(|f|\) is integrable — needed *before* writing \(\int|f|\)!); B3-L1's comparison engine; new: **the two-sided squeeze \(-|f|\le f\le|f|\)**, and the trap that \(\bigl|\int f\bigr|\le\int|f|\) is *not* the same sentence as Thm 13's integrability claim.
**Solution.** By Thm 13, \(|f|\in\mathcal R\). Since \(-|f|\le f\le|f|\), Prop 12 gives \(\int f\le\int|f|\) and \(-\int f=\int(-f)\le\int|f|\); combining, \(\bigl|\int f\bigr|\le\int|f|\). Strict example: \(f(x)=\sin x\) on \([-1,1]\) is odd, so \(\int_{-1}^1\sin=0\) while \(\int_{-1}^1|\sin x|dx>0\). Finally \(|f|\le M\) gives \(\bigl|\int f\bigr|\le\int|f|\le\int M=M(b-a)\) by Prop 12 and B1-L1.

#### B3-L4 (P4) — Mean value theorem for integrals: if \(f\) is continuous on \([a,b]\) (\(a<b\)), there is \(c\in[a,b]\) with \(\int_a^b f=f(c)(b-a)\). Prove it, then apply it to \(f(x)=\frac1{1+x^{2}}\) on \([0,1]\).

**Carries forward:** EVT + IVT (Topic C) \(+\) B3-L1's bounds \(+\) Lemma 14. New: **this is a "which theorem guarantees what?" question** — the answer is EVT for the extreme values and IVT for hitting the middle value, *not* the MVT for derivatives.
**Markers want:** \(c\in[a,b]\) (endpoints allowed here — unlike Rolle/MVT); the division by \(b-a\) justified by \(a<b\); the integrability of \(f\) mentioned.
**Solution.** \(f\) is integrable (Lemma 14). By EVT there are \(u,v\in[a,b]\) with \(m=f(u)=\min f\), \(M=f(v)=\max f\). Then \(m\le f\le M\) so \(m(b-a)\le\int_a^b f\le M(b-a)\), i.e. \(m\le\frac1{b-a}\int_a^b f\le M\). IVT applied to \(f\) on the interval with endpoints \(u,v\) gives \(c\) between them with \(f(c)=\frac1{b-a}\int_a^b f\). For \(f(x)=\frac1{1+x^{2}}\) (continuous on \([0,1]\)) this yields \(c\in[0,1]\) with \(\int_0^1\frac{dx}{1+x^{2}}=\frac1{1+c^{2}}\); indeed \(\frac\pi4=\frac1{1+c^{2}}\) gives \(c=\sqrt{4/\pi-1}\).

#### B3-L5 (P4/P5) — Let \(f\) be continuous on \([a,b]\) with \(f\ge0\). Prove \(\int_a^b f=0\Rightarrow f\equiv0\). Deduce: \(\int_a^b f=\int_a^b g\) for continuous \(f,g\) \(\Rightarrow f(c)=g(c)\) for some \(c\). Where is each hypothesis used?

**Carries forward:** B3-L1/L3's comparison on a **sub**interval; new: **continuity propagates a point-value to an interval** (the same move as A6-L4 and the IFT proof), then contradiction.
**Solution.** Suppose \(f(x_{0})>0\). If \(x_{0}\in(a,b)\): by continuity there is \(\alpha>0\) with \(f(x)>f(x_{0})/2\) for \(x\in[x_{0}-\alpha,x_{0}+\alpha]\subset(a,b)\). By additivity and Prop 12, \(\int_a^b f\ge\int_{x_0-\alpha}^{x_0+\alpha}f\ge\frac{f(x_{0})}2\cdot2\alpha>0\), contradiction. If \(x_{0}=a\) or \(b\), use one-sided continuity and a half-interval inside \([a,b]\). Hence \(f\equiv0\). *Deduction:* let \(h=f-g\), continuous, \(\int_a^bh=0\). If \(h>0\) everywhere, EVT gives \(\min h=\eta>0\), so \(0=\int h\ge\eta(b-a)>0\), contradiction; likewise \(h<0\) everywhere is impossible. So \(h\) takes a non-positive and a non-negative value, and if it never equals 0 it would be strictly of one sign by IVT — contradiction. Hence \(h(c)=0\). *Hypotheses:* continuity is used twice (sign propagation, EVT); \(f\ge0\) cannot be dropped (\(\sin\) on \([0,2\pi]\)); dropping continuity gives Dirichlet-type counterexamples (B1-L5: \(\mathbf1_{\mathbb Q}\) modified).

---

### B4 — The Fundamental Theorems (Thm 15 and Thm 16)

Say these out loud until automatic. **FTC1:** if \(F\) is continuous on \([a,b]\), differentiable on \((a,b)\), \(f\in\mathcal R[a,b]\) and \(F'=f\) on \((a,b)\), then \(\int_a^b f=F(b)-F(a)\). **FTC2:** if \(f\in\mathcal R[a,b]\) and \(F(x)=\int_a^xf\), then \(F\) is continuous on \([a,b]\); and if moreover \(f\) is continuous at \(c\), then \(F\) is differentiable at \(c\) with \(F'(c)=f(c)\).

#### B4-L1 (P1/P2) — Compute \(\int_0^1 x^{2}\,dx\) using Thm 15, listing all four hypotheses.

**Carries forward:** B1-L2 (you already know the definition-based answer — here you must show the theorem *licenses* the shortcut); new: the FTC1 hypothesis audit.
**Markers want:** "\(f(x)=x^{2}\) is continuous on \([0,1]\), hence \(f\in\mathcal R[0,1]\) by Lemma 14" — that line earns marks on its own; \(F\) named with its domain; \(F'=f\) checked on \((0,1)\).
**Solution.** Let \(F(x)=x^{3}/3\). (i) \(F\) continuous on \([0,1]\) (polynomial). (ii) \(F\) differentiable on \((0,1)\). (iii) \(f(x)=x^{2}\) continuous on \([0,1]\), so \(f\in\mathcal R[0,1]\) by Lemma 14. (iv) \(F'(x)=x^{2}=f(x)\) on \((0,1)\). Thm 15: \(\int_0^1x^{2}dx=F(1)-F(0)=\frac13\), agreeing with B1-L2.

#### B4-L2 (P1/P3) — Compute \(\int_{-1}^{1}\frac{dx}{1+x^{2}}\). Then explain in one sentence why Thm 15 does **not** license \(\int_0^4\frac{dx}{\sqrt x}=4\).

**Carries forward:** L1's audit; new: **recognising when the integrand leaves \(\mathcal R\)** — unbounded on the interval means not Riemann integrable by definition.
**Solution.** \(\frac1{1+x^{2}}\) is continuous on \([-1,1]\), hence integrable; \(F=\arctan\) has \(F'=\frac1{1+x^{2}}\) on \((-1,1)\); Thm 15 gives \(\arctan1-\arctan(-1)=\frac\pi2\). For \(x\mapsto1/\sqrt x\) on \([0,4]\): the function is unbounded near 0, so it is not in \(\mathcal R[0,4]\) (boundedness is part of the definition) and Thm 15's third hypothesis fails, even though \(2\sqrt x\) is an antiderivative on \((0,4)\). The value 4 is what an *improper* integral gives (Lebl 5.5 — out of the stated scope unless lectured).

#### B4-L3 (P4) — Let \(f\in\mathcal R[a,b]\) and \(F(x)=\int_a^xf\). (a) Prove \(F\) is uniformly continuous. (b) Prove: if \(f\) is continuous at \(c\in(a,b)\), then \(F'(c)=f(c)\).

**Carries forward:** **A3-L4's "bound \(\to\) Lipschitz \(\to\) uniform continuity" skeleton, now driven by a bound on \(f\) instead of \(f'\)**; B3-L3's \(\bigl|\int\bigr|\le M\cdot\)length; new: the difference quotient of \(F\) **is an average of \(f\)**, squeezed by Prop 12.
**Markers want:** in (a) the existence of \(M=\sup|f|\) justified by "\(f\in\mathcal R\) means \(f\) bounded"; in (b) the case \(x<c\) addressed (inequalities flip) and the identity \(f(c)=\frac1{x-c}\int_c^xf(c)\,dt\) made explicit.
**Solution (a).** \(|f|\le M\). For \(x,y\in[a,b]\), by additivity and B3-L3, \(|F(x)-F(y)|=\bigl|\int_y^xf\bigr|\le M|x-y|\). Given \(\varepsilon>0\), \(\delta=\varepsilon/(M+1)\) gives \(|x-y|<\delta\Rightarrow|F(x)-F(y)|<\varepsilon\), uniformly in \(x,y\). (b) Take \(x>c\) (for \(x<c\) the same argument runs with the inequalities reversed, since dividing by \(x-c<0\) flips them). Choose \(\delta>0\) with \(|f(t)-f(c)|<\varepsilon\) for \(|t-c|<\delta\). For \(c<x<c+\delta\), \(f(c)-\varepsilon\le f(t)\le f(c)+\varepsilon\) on \([c,x]\), so Prop 12 and B1-L1 give \((f(c)-\varepsilon)(x-c)\le\int_c^xf\le(f(c)+\varepsilon)(x-c)\), hence
\[
f(c)-\varepsilon\le\frac{F(x)-F(c)}{x-c}=\frac1{x-c}\int_c^{x}f(t)\,dt\le f(c)+\varepsilon ,
\]
which is \(\bigl|\frac{F(x)-F(c)}{x-c}-f(c)\bigr|\le\varepsilon\): the limit exists and equals \(f(c)\).
**Two cautionary examples.** (i) \(f=\operatorname{sgn}\) on \([-1,1]\) is integrable (one jump) and \(F(x)=\int_0^xf=|x|\) is continuous but not differentiable at 0 — \(f\) is discontinuous at 0, so (b) promises nothing: "continuous at \(c\)" is not omittable. (ii) \(g(0)=1\), \(g(x)=0\) otherwise: \(g\in\mathcal R\) (B2-L4) and \(G(x)=\int_0^xg\equiv0\) is differentiable at 0 with \(G'(0)=0\ne g(0)\) — the converse of (b) fails.

#### B4-L4 (P1/P4) — Differentiate \(H(x)=\int_0^{x^{2}}\frac{ds}{1+s^{2}}\), justifying each step by name.

**Carries forward:** L3(b) (FTC2 at a continuity point), A1/A3 chain rule, B4-L2's integrand. **This is the most likely "later differentiation \(+\) integration" computation in the paper.**
**Markers want:** the decomposition \(H=A\circ u\) with \(A(y)=\int_0^y\frac{ds}{1+s^2}\) and \(u(x)=x^{2}\) written down; FTC2 quoted for \(A'\); chain rule quoted; final answer \(\frac{2x}{1+x^{4}}\).
**Solution.** \(f(s)=\frac1{1+s^{2}}\) is continuous on \(\mathbb R\), so by FTC2 \(A(y)=\int_0^yf\) is differentiable everywhere with \(A'(y)=f(y)\). \(u(x)=x^{2}\) is differentiable, so the chain rule gives \(H'(x)=A'(u(x))\,u'(x)=\frac{2x}{1+x^{4}}\).

#### B4-L5 (P5) — Let \(f\) be continuous on \([0,1]\) and \(F(x)=\int_0^x(x-t)f(t)\,dt\). Find \(F'\) and \(F''\). Then differentiate \(g(x)=\frac1{2\varepsilon}\int_{x-\varepsilon}^{x+\varepsilon}f(t)\,dt\).

**Carries forward:** L4's chain rule plus additivity/linearity of \(\int\) (which you must **state**, not cite); new: **get the \(x\) out of the integrand first**, \(F(x)=x\int_0^xf(t)dt-\int_0^xtf(t)dt\), then product rule. The sliding-interval version is two FTC2 terms.
**Markers want:** each new integrand checked continuous before FTC2 is used; the product rule named; \(F(0)=0\) noted if an initial value is asked.
**Solution.** With \(A(x)=\int_0^xf(t)dt\) and \(B(x)=\int_0^xtf(t)dt\): \(F=xA-B\). Both integrands are continuous, so \(A'=f\) and \(B'=xf(x)\) by FTC2, giving \(F'=A+xA'-B'=A+xf-xf=A=\int_0^xf\). If \(f\) is differentiable (hence continuous), FTC2 again gives \(F''=f\). For \(g\): write \(g=\frac1{2\varepsilon}(G(x+\varepsilon)-G(x-\varepsilon))\) where \(G'=f\); then \(g'(x)=\frac{f(x+\varepsilon)-f(x-\varepsilon)}{2\varepsilon}\).

#### B4-L6 (P5) — Suppose \(f\) is continuous on \([a,b]\) and \(\int_a^xf=\int_x^bf\) for every \(x\in[a,b]\). Prove \(f\equiv0\). Separately: if \(F'=G'\) on \((a,b)\) with \(F,G\) continuous on \([a,b]\), prove \(F-G\) is constant by two different routes.

**Carries forward:** L3/L4 (differentiate an identity between integral functions); A2-L4 (\(h'\equiv0\Rightarrow h\) constant via MVT); new: using FTC1 as the second route — the appendix-legal one.
**Solution.** Let \(H(x)=\int_a^xf-\int_x^bf\equiv0\). By FTC2 (and additivity/linearity, since \(\int_x^bf=\int_a^bf-\int_a^xf\)), \(H\) is differentiable with \(H'(x)=f(x)+f(x)=2f(x)\). As \(H\equiv0\) on \([a,b]\), \(H'=0\), so \(f(x)=0\) for every \(x\). *Two routes for \(F-G\):* set \(H=F-G\), so \(H'\equiv0\) on \((a,b)\). (1) MVT on \([u,v]\subset[a,b]\): \(H(v)-H(u)=H'(c)(v-u)=0\). (2) FTC1: \(H\) is continuous on \([a,x]\), differentiable on \((a,x)\), \(H'\equiv0\) is continuous hence integrable, so \(H(x)-H(a)=\int_a^xH'=0\) for every \(x\). Route (2) is the one that uses only appendix results.

---

### B5 — Change of variables and integration by parts (**not in the appendix** — state the hypotheses yourself)

#### B5-L1 (P1/P2) — Compute \(\int_0^{\sqrt\pi}x\cos(x^{2})\,dx\), naming and checking the theorem you use.

**Carries forward:** B4-L4's chain-rule-in-reverse instinct; new: the change of variables theorem — \(g\in C^{1}[a,b]\), \(f\) continuous on an interval containing \(g([a,b])\) \(\Rightarrow\int_a^bf(g(x))g'(x)dx=\int_{g(a)}^{g(b)}f(s)ds\).
**Markers want:** \(g\) and \(f\) explicitly named; "\(g(x)=x^{2}\) is \(C^{1}\) on \([0,\sqrt\pi]\)" and "\(\cos\) is continuous" stated; new limits computed (never keep \(x\)-limits after substituting).
**Solution.** Take \(g(x)=x^{2}\), \(f(s)=\cos s\). Then \(f(g(x))g'(x)=2x\cos(x^{2})\), so \(\int_0^{\sqrt\pi}x\cos(x^{2})dx=\frac12\int_0^{\pi}\cos s\,ds=\frac12[\sin s]_0^{\pi}=0\).

#### B5-L2 (P1) — Compute \(\int_0^1x\sqrt{1-x^{2}}\,dx\) and \(\int_0^{\pi/2}\sin x\cos x\,dx\).

**Carries forward:** L1's bookkeeping; new: (i) a substitution that **reverses the limits** (\(u=1-x^{2}\) sends \(0\mapsto1\), \(1\mapsto0\) — resolve with the \(\int_a^b=-\int_b^a\) convention); (ii) choosing among several valid substitutions.
**Solution.** \(u=1-x^{2}\), \(du=-2x\,dx\): \(\int_0^1x\sqrt{1-x^{2}}dx=-\frac12\int_1^0u^{1/2}du=\frac12\int_0^1u^{1/2}du=\frac12\cdot\frac23=\frac13\). Second: \(v=\sin x\), \(dv=\cos x\,dx\), limits \(0\mapsto0\), \(\pi/2\mapsto1\): \(\int_0^1v\,dv=\frac12\).

#### B5-L3 (P2/P5) — Week 12's trap: "\(\int_{-1}^{1}\frac{\ln|x|}{x}dx=0\) by substituting \(s=\ln|x|\)". Explain precisely why this is invalid.

**Carries forward:** B1-L5/B2 (boundedness is part of \(\mathcal R\)); B4-L2's unbounded-integrand observation; L1's hypothesis list. New: **list every way it fails, one sentence each.**
**Solution.** (1) \(x\mapsto\frac{\ln|x|}x\) is unbounded near \(0\), hence not Riemann integrable on \([-1,1]\): the integral does not exist as defined in the course. (2) \(g(x)=\ln|x|\) is not defined at \(0\), so it is not \(C^{1}[{-1},1]\) — the theorem's first hypothesis fails. (3) \(g\) is not continuous at 0 and \(g\bigl([-1,0)\cup(0,1]\bigr)\) is not an interval, so "\(f\) continuous on an interval containing \(g([a,b])\)" cannot even be checked. Any **one** defeats the computation; writing all three is full marks.

#### B5-L4 (P4) — Prove integration by parts for \(F,G\in C^{1}[a,b]\): \(\int_a^bF'G=\bigl[FG\bigr]_a^b-\int_a^bFG'\).

**Carries forward:** A1/A3 product rule, B3-L2's linearity and additivity (stated, not cited), B4-L1's FTC1 audit. New: **the "prove a formula the course never proved" type** — the marks are in naming which appendix result does the final step.
**Markers want:** integrability claims before integrating (products of continuous functions are continuous, hence \(\in\mathcal R\) by Lemma 14); FTC1 quoted with hypotheses; linearity quoted by name.
**Solution.** \((FG)'=F'G+FG'\) by the product rule. \(FG\) is continuous on \([a,b]\) and differentiable on \((a,b)\); \(F'G\) and \(FG'\) are continuous on \([a,b]\), hence integrable (Lemma 14). Thm 15 with \(H=FG\) gives \(\int_a^b(F'G+FG')=F(b)G(b)-F(a)G(a)\). By linearity, \(\int_a^bF'G+\int_a^bFG'=\bigl[FG\bigr]_a^b\); rearrange.

#### B5-L5 (P1/P4) — Compute \(\int_0^1xe^{x}dx\), \(\int_0^{\pi/2}x\sin x\,dx\), \(\int_0^1\ln(1+x)dx\).

**Carries forward:** L4's formula; new: choosing which factor is \(F'\) (take the one you can integrate: \(x\to x^{2}/2\), \(\sin x\to-\cos x\), \(1\to x\)); and \(\frac{x}{1+x}=1-\frac1{1+x}\).
**Solution.** \(\int_0^1xe^{x}=[xe^{x}]_0^1-\int_0^1e^{x}=e-(e-1)=1\). \(\int_0^{\pi/2}x\sin x=[-x\cos x]_0^{\pi/2}+\int_0^{\pi/2}\cos x=0+1=1\). \(\int_0^1\ln(1+x)dx=[x\ln(1+x)]_0^1-\int_0^1\frac{x}{1+x}dx=\ln2-(1-\ln2)=2\ln2-1\).
**Reduction formula (the P5 version):** \(I_n=\int_0^{\pi/2}\sin^{n}x\,dx=\frac{n-1}{n}I_{n-2}\) — split \(\sin^{n}=\sin^{n-1}\!\cdot\sin\), integrate by parts with \(F'=\sin\), then use \(\cos^{2}=1-\sin^{2}\) and solve for \(I_n\). Know the shape; it is a standard 10-mark computation.

---

## TOPIC C — THE EARLIER MACHINERY, GLUED ON

These are the results the differentiation/integration proofs *borrow*. The scope notice says so explicitly: *"results from earlier topics remain relevant."*

#### C-L1 (P3) — \(f\) is bounded on \([0,1]\) and \(h(x)=x(1-x)f(x)\) for \(0<x<1\), \(h(0)=h(1)=0\). Prove \(h\) is continuous on \([0,1]\). (Exercise 5 Q2 — the same estimate is used again in C-L5.)

**Carries forward:** the \(\varepsilon\)-\(\delta\) definition; new: **boundedness × a factor tending to 0 \(\to\) product tending to 0.**
**Markers want:** "let \(B>0\) with \(|f(x)|\le B\) for all \(x\)" first; \(\delta\) depending on \(\varepsilon\) and \(B\) only.
**Solution.** Fix \(\varepsilon>0\). At \(c\in(0,1)\): \(|h(x)-h(c)|\le|x(1-x)-c(1-c)|\,B\), and \(x\mapsto x(1-x)\) is a polynomial hence continuous at \(c\), so there is \(\delta>0\) with \(|x-c|<\delta\Rightarrow|x(1-x)-c(1-c)|<\varepsilon/B\). At \(c=0\): \(|h(x)-h(0)|=|h(x)|\le Bx(1-x)\le Bx<\varepsilon\) whenever \(x<\min\{\varepsilon/B,1\}\) — take \(\delta=\varepsilon/B\); similarly at \(1\). Hence \(h\) is continuous on \([0,1]\). Consequently (Week 4 theorem) \(h\) is **uniformly** continuous on \([0,1]\), and its restriction \(h\big|_{(0,1)}=g\) is uniformly continuous on \((0,1)\) — that is exactly how Exercise 5 Q2 finishes.

#### C-L2 (P3) — Write the negation of "\(f\) is continuous at \(c\)" precisely, then use it to show \(x\mapsto\sin(1/x)\) is not continuous at 0, and use the definition to show \(x\mapsto x\sin(1/x)\) *is*.

**Carries forward:** quantifier negation (\(\forall\leftrightarrow\exists\) flip, \(<\) becomes \(\ge\)); new: **choosing the sequence/point that defeats \(\delta\).**
**Markers want:** the negation as \(\exists\varepsilon>0\ \forall\delta>0\ \exists x\in S\) with \(|x-c|<\delta\) and \(|f(x)-f(c)|\ge\varepsilon\) — the midterm marked these all-or-nothing; a specific \(\varepsilon\) (e.g. \(\varepsilon=1\)) in the proof.
**Solution.** Negation as above. Discontinuity: take \(\varepsilon=1\); for any \(\delta>0\) choose \(n\) with \(x=\frac1{\pi/2+2\pi n}<\delta\); then \(\sin(1/x)=1\), and with \(f(0)\) defined as 0 (or anything), \(|f(x)-f(0)|\ge1=\varepsilon\). Hence not continuous at 0. Equivalently by the sequential criterion (Lebl 3.2.2, "Week 1 Notes page 1"): \(x_n\to0\) but \(f(x_n)\not\to f(0)\). Continuity of \(g(x)=x\sin(1/x)\), \(g(0)=0\): given \(\varepsilon>0\) take \(\delta=\varepsilon\); \(|g(x)-0|\le|x|<\delta=\varepsilon\).

#### C-L3 (P4) — \(f:\mathbb{R}\to\mathbb{R}\) is continuous and \(x\le f(x)\le x+1\) for all \(x\). Prove \(f\) is surjective. (Exercise 4 Q2 — a full course-provided model answer; memorise its three lines.)

**Carries forward:** IVT with an explicitly built interval; new: **to prove surjectivity, fix \(y\) first and hunt for two points straddling it.**
**Markers want:** peer-review rubric, verbatim: "Is the correct inequality set up? (\(f(y-1)\le y\le f(y)\)) Are the conditions for IVT satisfied? Is the conclusion drawn clearly?"
**Solution.** Let \(y\in\mathbb{R}\). The right inequality at \(x=y-1\) gives \(f(y-1)\le (y-1)+1=y\); the left inequality at \(x=y\) gives \(y\le f(y)\). So \(f(y-1)\le y\le f(y)\). \(f\) is continuous on \([y-1,y]\), so IVT yields \(c\in[y-1,y]\subset\mathbb{R}\) with \(f(c)=y\). Since \(y\) was arbitrary, \(f\) is surjective. (If equality holds at an endpoint, \(c\) is that endpoint — IVT is stated with \(\le\), so nothing to check.)

#### C-L4 (P2/P4) — (a) State EVT and IVT with their hypotheses. (b) \(f:\mathbb{R}\to\mathbb{R}\) continuous and periodic with period \(P>0\): prove \(f\) is bounded. (c) Give \(f:\mathbb{R}\to\mathbb{R}\) with \(f\big|_{\mathbb{Z}}\) bounded but \(f\) unbounded.

**Carries forward:** EVT's "closed **and bounded**" hypothesis, tested from inside; new: **reduce a global question to \([0,P]\) using periodicity.**
**Markers want:** the two hypotheses of EVT named as the reason it applies on \([0,P]\); in (c) a function verified to satisfy the requirement (all-or-nothing marking).
**Solution.** (a) EVT: \(f\) continuous on closed bounded \([a,b]\) \(\Rightarrow\) \(f\) attains max and min. IVT: \(f\) continuous on \([a,b]\), \(y\) between \(f(a)\) and \(f(b)\) \(\Rightarrow\exists c\in[a,b]: f(c)=y\). (b) \(f\big|_{[0,P]}\) is continuous on a closed bounded interval, so \(|f|\le M\) there by EVT. For \(x\in\mathbb{R}\) let \(n=\lfloor x/P\rfloor\), so \(0\le x-nP<P\); then \(f(x)=f(x-nP)\) by periodicity and \(x-nP\in[0,P]\), so \(|f(x)|\le M\). (c) \(f(x)=x\sin(2\pi x)\): \(f(k)=0\) for every \(k\in\mathbb{Z}\) (bounded on \(\mathbb{Z}\)) but \(f\) is unbounded on \(\mathbb{R}\) (at \(x=n+\tfrac14\), \(f(x)=x\)). Domain matters: \(\mathbb{Z}\) is not bounded, so EVT does not apply.

#### C-L5 (P3/P4) — Prove: (a) the sum of two uniformly continuous functions on \(S\) is uniformly continuous; (b) so is \(af\); (c) if \(f\) is uniformly continuous on \(S\) and \(A\subset S\), then \(f\big|_A\) is uniformly continuous on \(A\).

**Carries forward:** C-L1's "\(\delta\) may depend on \(\varepsilon\) and on constants like \(B\) or \(a\), never on \(x\)"; new: the \(\varepsilon/2\) device, the \(\varepsilon/(|a|+1)\) device, and \(\delta=\min\{\delta_1,\delta_2\}\).
**Markers want:** the peer-review rubric list, verbatim: assumptions stated with the appropriate \(\varepsilon\); \(\delta=\min\{\delta_1,\delta_2\}\) justified; structure "Let \(\varepsilon>0\) \(\to\) get \(\delta_1,\delta_2\) \(\to\) choose \(\delta\) \(\to\) take \(x,y\in S\) with \(|x-y|<\delta\) \(\to\) conclude"; **the domain restated at every use** (midterm: "the domain had to be stated, since uniform continuity depends on the domain").
**Solution (a).** Let \(\varepsilon>0\). Uniform continuity of \(f\) gives \(\delta_1>0\) with \(|f(x)-f(y)|<\varepsilon/2\) for \(x,y\in S,\ |x-y|<\delta_1\); similarly \(\delta_2\) for \(g\) with \(\varepsilon/2\). Put \(\delta=\min\{\delta_1,\delta_2\}>0\). For \(x,y\in S\) with \(|x-y|<\delta\), \(|(f+g)(x)-(f+g)(y)|\le|f(x)-f(y)|+|g(x)-g(y)|<\varepsilon\). (b) If \(a=0\), \(af\equiv0\) and any \(\delta\) works (say \(\delta=1\)): \(|0-0|=0<\varepsilon\). If \(a\neq0\), take \(\delta\) from uniform continuity of \(f\) with \(\varepsilon/|a|\); then \(|af(x)-af(y)|=|a||f(x)-f(y)|<\varepsilon\). (The cleaner single-case choice: \(\varepsilon/(|a|+1)\), since \(|a|/(|a|+1)<1\).) (c) Given \(\varepsilon\), use the \(\delta\) from \(S\); for \(x,y\in A\subset S\) with \(|x-y|<\delta\) they are also in \(S\), so \(|f(x)-f(y)|<\varepsilon\).

#### C-L6 (P3) — Show \(x\mapsto x^{2}\) is uniformly continuous on \([0,1]\) but not on \(\mathbb{R}\), using only the definitions.

**Carries forward:** C-L5(a)'s "\(\delta\) must be global"; new: **the negation of uniform continuity** — \(\exists\varepsilon_0>0\ \forall\delta>0\ \exists x,y\) with \(|x-y|<\delta\) and \(|f(x)-f(y)|\ge\varepsilon_0\) — and the two-sequences test for it.
**Solution.** On \([0,1]\): \(|x^{2}-y^{2}|=|x+y||x-y|\le2|x-y|\), so \(\delta=\varepsilon/2\) works. On \(\mathbb{R}\): negation — we need \(\varepsilon_0>0\) such that for every \(\delta>0\) there are \(x,y\) with \(|x-y|<\delta\) and \(|x^{2}-y^{2}|\ge\varepsilon_0\). Take \(\varepsilon_0=1\), \(x_n=n\), \(y_n=n+\frac1n\): then \(|x_n-y_n|=\frac1n\to0\) while \(|x_n^{2}-y_n^{2}|=2+\frac1{n^{2}}\ge2>1\). Choosing \(n\) with \(1/n<\delta\) gives the required pair, so \(x^{2}\) is not uniformly continuous on \(\mathbb{R}\). (It *is* continuous there — continuity is pointwise, uniform continuity is global; equivalently, by C-L5(c) a uniformly continuous function on \(\mathbb{R}\) would restrict to one uniformly continuous on \([0,1]\), and the real reason is that the \(\delta\) that works at \(n\) must shrink with \(n\).)

#### C-L7 (P3/P4) — \(f\) is integrable on \([a,b]\) with \(m\le f\le M\). Prove \(m(b-a)\le\underline{\int_a^b}f\le\overline{\int_a^b}f\le M(b-a)\) (Prop 10), and prove \(L(P_1,f)\le U(P_2,f)\) for **any** two partitions.

**Carries forward:** B1's sums; sup/inf discipline; new: **the common refinement \(P_1\cup P_2\)** — the device behind Prop 10, the proof that \(\underline{\int}\le\overline{\int}\), and the \(\Rightarrow\) direction of Riemann's condition.
**Markers want:** "\(\sup\) of a set bounded above by \(K\) is \(\le K\)" and "\(\inf\) of a set bounded below by \(K\) is \(\ge K\)" said out loud; the refinement chain written with the inequalities labelled by Prop 9.
**Solution.** By Prop 8, \(m(b-a)\le L(P,f)\le U(P,f)\le M(b-a)\) for every \(P\). Since \(M(b-a)\) is an upper bound for \(\{L(P,f)\}\), \(\underline{\int}=\sup_PL(P,f)\le M(b-a)\); similarly \(\overline{\int}\ge m(b-a)\). For the middle: given \(P_1,P_2\), \(\tilde P=P_1\cup P_2\) refines both, so Prop 9 gives \(L(P_1,f)\le L(\tilde P,f)\le U(\tilde P,f)\le U(P_2,f)\). Thus every \(L(P_1,f)\) is a lower bound for \(\{U(P_2,f)\}\), so \(L(P_1,f)\le\overline{\int}\) for all \(P_1\), hence \(\underline{\int}\le\overline{\int}\). (Same chain proves Prop 11's \((\Rightarrow)\): choose \(P_1,P_2\) with \(L(P_1,f)>\underline{\int}-\varepsilon/2\) and \(U(P_2,f)<\overline{\int}+\varepsilon/2\) — the definition of sup and inf — then \(U(P_1\cup P_2)-L(P_1\cup P_2)\le U(P_2)-L(P_1)\le(\overline{\int}-\underline{\int})+\varepsilon=\varepsilon\) when integrable.)

---

## D. EVERY QUESTION TYPE, WITH FIXED STEPS

For each type: the phrasing you will see, the steps to write **in this order**, and what the marker is ticking.

**D1. "State the definition of …" / "Define …"**
Steps: (1) name the object's domain (\(f:I\to\mathbb{R}\), \(I\) an interval / \(S\subset\mathbb{R}\)); (2) write the formula or the quantifiers; (3) if one-sided/endpoint cases matter, add them. *Markers want:* the domain, the quantifier order, "exists and is finite" for derivatives. *Never write:* "\(f\) is continuous if the limit equals \(f(c)\)" without saying \(x\to c,\ x\in S\).

**D2. "Fill in the blank / complete the statement"** (TT2 Q3, Q5)
Steps: (1) identify which appendix result is being quoted; (2) reproduce its hypotheses **and** conclusion; (3) check the direction of every inequality (\(\le\) vs \(<\)) and whether \(c\) is in \((a,b)\) or \([a,b]\). *Markers want:* \(L(P,f)\le L(\tilde P,f)\le U(\tilde P,f)\le U(P,f)\) for refinements; \(U(P,f)-L(P,f)<\varepsilon\) in Riemann's condition.

**D3. "Compute \(L(P,f)\) and \(U(P,f)\) for the given \(P\)"** (TT2 Q4, B1 ladder)
Steps: (1) list subintervals and \(\Delta x_i\); (2) for each, give \(m_i,M_i\) **with a reason** (increasing / endpoints attained / density); (3) multiply and sum. *Markers want:* the reason line. *Kills:* inferring \(m_i,M_i\) from a sketch without saying why.

**D4. "Prove \(f\in\mathcal R[a,b]\) (from the definition)"** (B2 ladder)
Steps: (1) "let \(\varepsilon>0\)"; (2) exhibit the partition built from \(\varepsilon\); (3) compute \(U-L\) as a sum over good and bad subintervals; (4) get \(<\varepsilon\); (5) "by Proposition 11, \(f\in\mathcal R[a,b]\)"; (6) if asked, squeeze the integral's value. *Markers want:* the partition depending on \(\varepsilon\); the naming of Prop 11. *Kills:* "\(f\) has only one discontinuity so it is integrable" without the \(\varepsilon\).

**D5. "Show \(f\notin\mathcal R\)"** (B1-L5)
Steps: (1) compute \(m_i,M_i\) for an **arbitrary** partition; (2) get \(\underline{\int}\neq\overline{\int}\) or an \(\varepsilon_0\) with \(U-L\ge\varepsilon_0\) always; (3) conclude by the definition/Prop 11. *Markers want:* the density argument stated.

**D6. "Give an example / counterexample"** (midterm Q3 — all-or-nothing)
Steps: (1) write function **with its domain**; (2) verify each demanded property in a line each; (3) verify the failure with the definition, not by assertion. *Markers want:* every stated condition checked. *Kills:* "\(f(x)=1/x\) on \(\mathbb{R}\)" (not defined at 0), "\(f(x)=x^2\) is not uniformly continuous on \([0,1]\)" (it is).

**D7. "By means of the definition, prove …"** (midterm Q5/Q7, C2, C5)
Steps: (1) restate the definition you are proving into; (2) "let \(\varepsilon>0\)"; (3) announce \(\delta\) (or the sequence) before using it; (4) take arbitrary \(x,y\) with \(|x-y|<\delta\); (5) chain the inequalities; (6) restate the conclusion. For "not continuous": negate first, then produce \(\varepsilon_0\) and the offending \(x\)/sequence. *Markers want:* nothing outside the definition — no limit laws unless justified.

**D8. "Use Theorem X to prove …"** (midterm Q9 IFT, Q10 MVT, Ex 12 Q5)
Steps: (1) name the theorem and list its hypotheses; (2) verify each for **this** function; (3) apply, obtaining the intermediate statement; (4) finish algebraically. *Markers want:* the verification block worth more than the final formula. *Kills:* "by the MVT, \(f'(c)=\dots\)" for an \(f\) whose continuity on the closed interval was never checked.

**D9. "Explain / finish the proof"** (Ex 9 Q4, Ex 10/11 rubrics, Week 11 exercises)
Steps: (1) say what the proof is trying to show, one line; (2) define the auxiliary object (refinement \(\tilde P\), \(g(x)=yx-f(x)\), \(Q(x)\)); (3) the key inequality with its justification; (4) the concluding squeeze. *Markers want:* the justification of each "\(\le\)" as a named result.

**D10. "True / false, or 'what does the theorem guarantee?'"**
Steps: (1) restate the theorem's exact scope; (2) decide: guaranteed / not guaranteed / contradicted; (3) if not guaranteed, name which hypothesis could fail and give the function. *Classic answers:* Darboux guarantees intermediate values of \(f'\) but **not** that \(f'\) is continuous; FTC2 guarantees \(F\) continuous for merely integrable \(f\), and \(F'(c)=f(c)\) only at continuity points of \(f\); Prop 1 gives no converse (A1-L4); \(f'(x_0)=0\) gives no extremum (A5-L4's \(x^3\)).

**D11. "Why is this argument invalid?"** (B5-L3, A2-L2)
Steps: (1) name the rule being attempted; (2) list the hypotheses; (3) identify the failing one(s) with a specific point; (4) say what actually happens to the object (undefined integral, non-\(C^1\) substitution). *Markers want:* the specific failed hypothesis, not "x=0 is a problem".

**D12. "Prove there exists \(c\) with …" (root / derivative-value questions)** (A3-L3, A3-L6, A4-L1)
Steps: (1) existence: sign change + IVT (so prove continuity first); (2) uniqueness: monotonicity via MVT and the sign of \(f'\); (3) derivative-value questions: build \(g\) so that \(g'=\) (target)\(\times\)positive factor, then Rolle/MVT; (4) "\(f'\) hits every intermediate value": Darboux.

**D13. "Estimate an integral / prove an inequality between integrals"** (B3 ladder)
Steps: (1) prove integrability of everything appearing (Lemma 14, Thm 13, B2 results); (2) prove the pointwise inequality; (3) apply Prop 12 with \(b-a\); (4) for absolute values, Thm 13's inequality half.

**D14. "Differentiate an integral-defined function"** (B4-L4/L5/L6)
Steps: (1) identify inner function \(u\) and \(A(y)=\int_a^y f\); (2) state \(f\) continuous \(\Rightarrow A'=f\) (FTC2/Thm 16); (3) chain rule; (4) simplify. Split-\(x\) integrands: expand first, then product rule.

**D15. "Compute an integral" (two flavours)**
 (a) "from the definition": Darboux sums + squeeze (B1-L2) — **no antiderivatives**. (b) "using Thm 15": audit the four hypotheses, then antiderivative (B4-L1). If a substitution is needed, it is a D16 question wearing a computation hat.

**D16. "Evaluate by substitution / parts, justifying the method"** (B5 ladder)
Steps: (1) state the theorem with hypotheses (\(g\in C^1\), \(f\) continuous on an interval containing \(g([a,b])\)); (2) verify them — including that the range is an interval and the integrand is bounded; (3) transform limits; (4) compute; (5) for parts, check both functions are \(C^1\) and integrable products.

**D17. "Prove a property of \(f\) given a functional inequality"** (A2-L4, C-L1, Week 2's \(|f(x)-f(y)|\le g(x-y)\))
Steps: (1) extract point information (\(f(0)=0\), \(f\) bounded); (2) convert to a difference quotient; (3) squeeze; (4) conclude differentiability/continuity, then cite Prop 1 or MVT as needed.

---

## E. SELF-MARKING AND EXAM-DAY

### E.1 Read your own answer and ask, in order

1. Did I state every domain (of \(f\), of \(f'\), of \(F\), of \(g\))?
2. Did I write "let \(\varepsilon>0\)" **before** producing \(\delta\)/\(\eta\)/\(n\)/\(P\)?
3. Does my \(\delta\)/\(M\)/\(\eta\) depend only on \(\varepsilon\) and given constants — never on \(x\)?
4. Before each cited result: did I verify its hypotheses in this problem's terms, and quote its appendix number?
5. After each "\(\le\)" or "\(\to\)": is there a reason (theorem, definition, arithmetic)?
6. If I claimed non-existence/non-integrability: did I prove it quantitatively (\(\overline{\int}\ne\underline{\int}\), or an \(\varepsilon_0\)), not rhetorically?
7. If I gave an example: did I check **every** demanded property, including the domain?
8. If proof by contradiction: did I negate precisely (\(\le\) not \(<\), quantifier order flipped)?
9. Did I finish with the sentence the question asked for ("hence \(f\in\mathcal R[a,b]\)", "so \(f\) is surjective")?
10. Would a marker who only reads my **first and last** three lines of each proof see the structure?

### E.2 Sentence templates (write these literally)

- "\(f\) is continuous on \([a,b]\) and differentiable on \((a,b)\); hence by the MVT (Thm 4) there exists \(c\in(a,b)\) with …"
- "Let \(\varepsilon>0\). Choose \(\delta=\min\{\delta_1,\delta_2\}\), where \(\delta_1,\delta_2\) are given by the uniform continuity of \(f\) and \(g\) with \(\varepsilon/2\). Then for all \(x,y\in S\) with \(|x-y|<\delta\), …"
- "\(f\in\mathcal R[a,b]\) by Proposition 11: the partition \(P\) below satisfies \(U(P,f)-L(P,f)<\varepsilon\)."
- "The hypotheses of Thm 16 are satisfied because \(f\) is continuous at \(c\); therefore \(F'(c)=f(c)\)."
- "This is **not** justified: the substitution map is not \(C^1\) on \([a,b]\) because …, and the integrand is unbounded near …, so it is not in \(\mathcal R[a,b]\)."

### E.3 90-minute allocation (16-mark-equivalent paper, adjust proportionally)

0–5 min: read all questions, mark each P1/P2/P3/P4/P5. 5–20: all P1/P2 (definitions, fills, hypothesis audits) — cheap and stabilising. 20–55: one P4 proof, then one computation ladder (usually B4/B5). 55–80: the remaining proof; if stuck, write definitions + hypotheses + the intended final inequality. 80–90: check the E.1 list, especially "does my \(\delta\) depend on \(x\)?"

### E.4 What is *not* in these ladders (so you can ask me about it)

Week 1 notes are missing from the folder (Exercise 2 refers to "Week 1 Notes, page 1" = Lebl Prop 3.2.2, sequential continuity). Lebl 5.5 (improper integrals), Ch 6 (sequences of functions / uniform convergence) and Ch 7 (metric spaces) appear in none of Weeks 2–12, so they read as out of scope — if either was actually lectured, tell me and I will build the same style of ladder for it.
