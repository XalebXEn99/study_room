# MATH2016 Mock Final — Memorandum with Mark Allocation

Total 60 marks. Marks are awarded for **statements of hypotheses, named results, and justification**, not for the final number. Each part lists what earns the marks, what loses them, and which ladder in `Final-Exam-Worked-Examples.md` to re-drill if you dropped them.

---

## Question 1 (6)

**(a) (2 marks)** Let \(I\) be an interval, \(f:I\to\mathbb{R}\), \(c\in I\). \(f\) is *differentiable at \(c\)* if the limit
\[
\lim_{x\to c}\frac{f(x)-f(c)}{x-c}\quad\bigl(=\lim_{h\to0}\frac{f(c+h)-f(c)}{h}\bigr)
\]
exists **and is finite**; that value is \(f'(c)\).

*1 mark:* the difference quotient and the limit; *1 mark:* "exists and is finite" **and** the domain (\(I\) an interval, \(c\in I\), \(x\in I\)). At an endpoint of a closed interval this means the appropriate one-sided limit — worth adding.
*Loses marks:* writing "\(f'(c)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}\)" (variable slip), or omitting "finite". → drill **A1**.

**(b) (2 marks)** \(f\) is Riemann integrable on \([a,b]\) if \(f\) is **bounded** and
\[
\underline{\int_a^b}f:=\sup_{P}L(P,f)\;=\;\inf_{P}U(P,f)=:\overline{\int_a^b}f ;
\]
the common value is \(\int_a^b f\), and the class of such functions is \(\mathcal{R}[a,b]\).

*1 mark:* the two definitions of lower/upper integral with the sup/inf over **all partitions**; *1 mark:* the equality plus restating boundedness.
*Loses marks:* defining via "there exists a partition with \(U-L<\varepsilon\)" — that is Proposition 11, not the definition (the question asked for the lower/upper integrals). → drill **B1, B2**.

**(c)(i) (1 mark)** \(L(P,f)\le L(\tilde P,f)\) and \(U(\tilde P,f)\le U(P,f)\). *(Proposition 9.)*
*Loses marks:* reversing either arrow. *Partial:* "\(L\) increases" without the inequality.

**(c)(ii) (1 mark)** \(\;U(P,f)-L(P,f)<\varepsilon\). *(Proposition 11, for every \(\varepsilon>0\), there exists a partition \(P\).)*
*Loses marks:* \(\le\varepsilon\) is acceptable; "\(U\) and \(L\) are close" is not.

---

## Question 2 (5)

**(a) (3 marks)** \(f(x)=x^{2}\) is **increasing** on \([0,1]\), so on each subinterval the infimum and supremum are the left- and right-endpoint values (and they are *attained*, since the subintervals are closed):

| subinterval | \(\Delta x_i\) | \(m_i\) | \(M_i\) |
|---|---|---|---|
| \([0,\tfrac12]\) | \(\tfrac12\) | \(0\) | \(\tfrac14\) |
| \([\tfrac12,\tfrac34]\) | \(\tfrac14\) | \(\tfrac14\) | \(\tfrac9{16}\) |
| \([\tfrac34,1]\) | \(\tfrac14\) | \(\tfrac9{16}\) | \(1\) |

\[
L(P,f)=0\cdot\tfrac12+\tfrac14\cdot\tfrac14+\tfrac9{16}\cdot\tfrac14=\tfrac1{16}+\tfrac9{64}=\tfrac{13}{64},
\qquad
U(P,f)=\tfrac14\cdot\tfrac12+\tfrac9{16}\cdot\tfrac14+1\cdot\tfrac14=\tfrac18+\tfrac9{64}+\tfrac14=\tfrac{33}{64}.
\]

*1 mark:* the monotonicity reason for \(m_i,M_i\); *1 mark:* \(L\); *1 mark:* \(U\). Sanity check worth stating: \(\frac{13}{64}\approx0.203\le\int_0^1x^2=\frac13\le\frac{33}{64}\approx0.516\).
*Loses marks:* using \(\inf/\sup\) over open subintervals, or a table with no reason. → drill **B1-L1…L3**.

**(b) (1 mark)** \(\tilde P\) **is a refinement** of \(P\) (it adds one point), so Proposition 9 guarantees \(L(P,f)\le L(\tilde P,f)\) and \(U(\tilde P,f)\le U(P,f)\).
*Loses marks:* computing the new sums (no credit needed, wasted time) or claiming equality.

**(c) (1 mark)** Boundedness makes each \(m_i,M_i\) a finite real and makes \(\{L(P,f):P\}\) bounded above (by \(M(b-a)\), Proposition 8) and \(\{U(P,f)\}\) bounded below; by **completeness of \(\mathbb{R}\)** the \(\sup\) and \(\inf\) then exist as real numbers. Without it the sums can be \(\pm\infty\) and the definition collapses.
*Loses marks:* "otherwise the integral is infinite" (that is a conclusion, not the reason). → drill **B1-L5**.

---

## Question 3 (6) — one mark each; **a verdict with no justification scores 0**

**(a) FALSE.** \(f(x)=x^{2}\sin(1/x)\), \(f(0)=0\), is differentiable everywhere with \(f'(0)=0\), but \(f'(x)=2x\sin(1/x)-\cos(1/x)\) has no limit at \(0\). *(Must name the function.)*

**(b) TRUE.** Proposition 1: differentiability at \(c\) implies continuity at \(c\). *(Cite it.)*

**(c) TRUE.** Theorem 13.

**(d) FALSE.** \(f:[0,1]\to\mathbb{R}\) with \(f(\tfrac12)=1\) and \(f(x)=0\) otherwise is integrable with integral \(0\) and \(f\ge0\), but \(f\) is not identically zero. Continuity is the missing hypothesis.

**(e) TRUE.** Proof by contradiction plus Darboux: if there were \(u,v\) with \(f'(u)>0\) and \(f'(v)<0\) (note: \(\le0\), then upgraded to \(<0\) using \(f'\neq0\)), Darboux on the interval with endpoints \(u,v\) gives \(c\) with \(f'(c)=0\), contradiction.

**(f) TRUE**, but it is **not** in the appendix: prove it — uniform partition \(P_n\), monotonicity gives \(M_i-m_i=f(x_i)-f(x_{i-1})\), so \(U-L=\frac{b-a}{n}\bigl(f(b)-f(a)\bigr)\to0\); Proposition 11 concludes.
*Loses marks:* answering "TRUE, by the theorem that monotone functions are integrable" — no such appendix result exists. → drill **A1-L4, A2-L1, A4-L2, B2-L2, B3-L5**.

---

## Question 4 (8)

**(a) (4 marks)** By definition, with \(g(2)=\tfrac12\):
\[
\frac{g(2+h)-g(2)}{h}=\frac{\frac{1}{2+h}-\frac12}{h}=\frac{2-(2+h)}{2(2+h)\,h}=\frac{-h}{2(2+h)h}=-\frac{1}{2(2+h)}\quad(h\neq0,\ h>-2).
\]
Hence \(\lim_{h\to0}\frac{g(2+h)-g(2)}{h}=-\frac14\), which exists and is finite, so \(g\) is differentiable at \(2\) with \(g'(2)=-\tfrac14\).

*1 mark:* the quotient written **from the definition** (using a rule here scores 0); *1 mark:* the algebra to \(-\frac1{2(2+h)}\); *1 mark:* taking the limit; *1 mark:* the concluding sentence naming existence and finiteness (and \(2\in(0,\infty)\), the domain).
*Loses marks:* "\(h\ne0\)" unstated when cancelling; the wrong sign. → drill **A1-L1, A1-L2**.

**(b) (4 marks)** First \(|f(0)|\le0^{2}=0\), so \(f(0)=0\). For \(h\neq0\),
\[
0\le\left|\frac{f(h)-f(0)}{h}-0\right|=\frac{|f(h)|}{|h|}\le\frac{h^{2}}{|h|}=|h|\longrightarrow0 .
\]
By the Squeeze Theorem the difference quotient tends to \(0\); therefore \(f\) is differentiable at \(0\) with \(f'(0)=0\). (Optionally: by Proposition 1, \(f\) is then continuous at \(0\).)

*1 mark:* extracting \(f(0)=0\) from the hypothesis; *1 mark:* forming the quotient; *1 mark:* the bound \(\le|h|\); *1 mark:* concluding differentiability **at 0** (not elsewhere).
*Loses marks:* assuming \(f\) is continuous or differentiable elsewhere; proving only that the quotient is bounded. → drill **A2-L3, A1-L4**.

---

## Question 5 (9)

**(a) (2 marks)** Let \(f:[a,b]\to\mathbb{R}\) be **continuous on \([a,b]\)**, **differentiable on \((a,b)\)**, with \(f(a)=f(b)\). Then there exists \(c\in(a,b)\) with \(f'(c)=0\).

*1 mark:* both regularity hypotheses with the correct closed/open intervals; *1 mark:* \(f(a)=f(b)\) and the conclusion with \(c\in(a,b)\) **open**.
*Loses marks:* "\(c\in[a,b]\)"; differentiability on \([a,b]\). → drill **A3-L1, A3-L2**.

**(b) (4 marks)** Define \(g(x)=f(x)e^{-x^{2}}\) on \([0,1]\).
* \(g\) is continuous on \([0,1]\) and differentiable on \((0,1)\) (product of such functions: \(f\) by hypothesis, \(x\mapsto e^{-x^{2}}\) is \(C^{\infty}\)) — **1 mark**.
* \(g(0)=f(0)\cdot1=0=g(1)=f(1)e^{-1}\) — **1 mark**.
* Rolle gives \(c\in(0,1)\) with \(g'(c)=0\) — **1 mark**.
* \(g'(x)=e^{-x^{2}}\bigl(f'(x)-2x f(x)\bigr)\); since \(e^{-c^{2}}>0\), \(f'(c)-2cf(c)=0\) — **1 mark**.

*Loses marks:* choosing \(g(x)=f(x)e^{x^{2}}\) (then the target sign is wrong and the conclusion fails — \(f'+2cf=0\)); never verifying \(g(0)=g(1)\); not explaining why the exponential is differentiable. → drill **A3-L6**.

**(c) (3 marks)** Let \(p(x)=x^{5}+3x-1\).
*Existence:* \(p\) is continuous (polynomial), \(p(0)=-1<0\) and \(p(1)=3>0\); by IVT there is \(c\in(0,1)\) with \(p(c)=0\) — **1 mark**.
*Uniqueness:* \(p'(x)=5x^{4}+3\ge3>0\). For \(a<b\), \(p\) is continuous on \([a,b]\) and differentiable on \((a,b)\), so by the MVT \(p(b)-p(a)=p'(\xi)(b-a)>0\): \(p\) is strictly increasing, hence has at most one zero — **1 mark**.
*Conclusion:* exactly one real solution — **1 mark**.

*Loses marks:* "since \(p'>0\) it is increasing" without the MVT (acceptable only if you cite Proposition 5, whose hypothesis requires differentiability on an interval — say so); proving only existence. → drill **A3-L3, C-L3**.

---

## Question 6 (7)

**(a) (2 marks)** Since \(f\) is differentiable on \([1,3]\) and \(f'(1)=2<5<7=f'(3)\), Theorem 7 guarantees there exists \(c\in(1,3)\) with \(f'(c)=5\); i.e. the equation has at least one solution in \((1,3)\).
*1 mark:* the precise conclusion (existence, in the **open** interval, of a solution); *1 mark:* the needed hypothesis — differentiability **on the closed interval \([1,3]\)** (endpoints included, since \(f'(1),f'(3)\) appear); note that no continuity of \(f'\) is required.
*Loses marks:* answering with IVT (there is no hypothesis that \(f'\) is continuous — see Q3(a)); \(c\in[1,3]\). → drill **A4-L1, TT2 Q1**.

**(b) (4 marks)** Given \(\varepsilon>0\), choose \(\eta>0\) with \(\eta<\min\{\tfrac14,\ \varepsilon/4\}\) and set
\[
P=\bigl\{0,\ \tfrac12-\eta,\ \tfrac12,\ \tfrac12+\eta,\ 1\bigr\}.
\]
On \([0,\tfrac12-\eta]\) and \([\tfrac12+\eta,1]\) we have \(f\equiv0\), so \(m_i=M_i=0\). On \([\tfrac12-\eta,\tfrac12]\) and \([\tfrac12,\tfrac12+\eta]\) the function takes the values \(0\) and \(1\), so \(m_i=0\) and \(M_i=1\). Hence
\[
L(P,f)=0,\qquad U(P,f)=1\cdot\eta+1\cdot\eta=2\eta<\tfrac{\varepsilon}{2}<\varepsilon .
\]
By Proposition 11, \(f\in\mathcal{R}[0,1]\). (Moreover \(0=L(P,f)\le\int_0^1 f\le U(P,f)=2\eta\) for every admissible \(\eta\), so \(\int_0^1 f=0\).)

*1 mark:* "let \(\varepsilon>0\)" and the explicit partition built from \(\varepsilon\); *1 mark:* correct \(m_i,M_i\) **on the closed subintervals** (the point \(\tfrac12\) is an endpoint of two of them); *1 mark:* the computation \(U-L=2\eta<\varepsilon\); *1 mark:* naming Proposition 11 as the conclusion.
*Loses marks:* "the function is discontinuous at only one point, hence integrable" (no such appendix result; and it earns none of the \(\varepsilon\)-marks); forgetting that the single point belongs to two subintervals (giving \(U-L=\eta\) instead of \(2\eta\) — harmless if the conclusion is stated). → drill **B2-L1, B2-L4**.

**(c) (1 mark)** **No.** Lemma 14 applies to functions continuous on \([0,1]\), and this \(f\) is not continuous at \(\tfrac12\); integrability here had to be proved from Proposition 11.
*Loses marks:* "yes, because there is only one discontinuity". → drill **B2-L3**.

---

## Question 7 (10)

**(a) (2 marks)** Theorem 15: Let \(F:[a,b]\to\mathbb{R}\) be **continuous on \([a,b]\)** and **differentiable on \((a,b)\)**, let \(f\in\mathcal{R}[a,b]\), and suppose \(F'(x)=f(x)\) for all \(x\in(a,b)\). Then
\[
\int_a^b f(x)\,dx=F(b)-F(a).
\]
*1 mark:* all three hypotheses on \(F\) and \(f\) (including \(f\in\mathcal{R}\) — the one students forget); *1 mark:* the conclusion with the interval.
*Loses marks:* stating only "if \(F'=f\) then \(\int_a^b f=F(b)-F(a)\)". → drill **B4-L1, B4-L2**.

**(b) (3 marks)** Write \(f(t)=\frac1{1+t^{2}}\), which is continuous on \(\mathbb{R}\); hence for any \(u<v\) it is in \(\mathcal{R}[u,v]\) (Lemma 14), and \(G(y):=\int_{0}^{y}f(t)\,dt\) satisfies \(G'(y)=f(y)\) for all \(y\) by Theorem 16. By additivity and the convention \(\int_a^b=-\int_b^a\),
\[
H(x)=G(x^{3})-G(x^{2}).
\]
The chain rule gives \(H'(x)=G'(x^{3})\cdot3x^{2}-G'(x^{2})\cdot2x=\dfrac{3x^{2}}{1+x^{6}}-\dfrac{2x}{1+x^{4}}\).

*1 mark:* citing Theorem 16 for \(G'\) **after** checking \(f\) is continuous; *1 mark:* the decomposition \(H=G\circ(\cdot^{3})-G\circ(\cdot^{2})\); *1 mark:* the chain rule and final expression.
*Loses marks:* "differentiate under the integral sign" hand-waving; forgetting the minus from the lower limit; a bare answer with no theorem named. → drill **B4-L4, B4-L5**.

**(c) (3 marks)** Define \(F(x)=\int_a^x f(t)\,dt\). Since \(f\) is continuous, \(F\) is differentiable on \((a,b)\) with \(F'=f\) (Theorem 16), and \(\int_x^b f=F(b)-F(x)\) (additivity, then the convention). The hypothesis reads
\[
F(x)=F(b)-F(x)\quad(x\in[a,b]).
\]
Differentiating on \((a,b)\): \(F'(x)=-F'(x)\), i.e. \(2f(x)=0\), so \(f(x)=0\) for every \(x\in(a,b)\); continuity of \(f\) then gives \(f(a)=f(b)=0\) as well. *(Equivalently: \(F\) is constant, so \(f\equiv0\).)*

*1 mark:* recognising both sides as integral functions and applying Theorem 16; *1 mark:* the differentiation \(f=-f\); *1 mark:* handling the endpoints via continuity (or stating the conclusion on the open interval only — lose the mark).
*Loses marks:* differentiating \(\int_x^b f\) as \(+f(x)\) (sign error); no use of the continuity hypothesis. → drill **B4-L6**.

**(d) (2 marks)** Rewrite \(F(x)=x\displaystyle\int_0^x f(t)\,dt-\int_0^x t\,f(t)\,dt\). Both integrands (\(f\), and \(t\mapsto tf(t)\)) are continuous, so by Theorem 16 both are differentiable with derivatives \(f(x)\) and \(xf(x)\). By the product rule,
\[
F'(x)=\int_0^x f(t)\,dt+xf(x)-xf(x)=\int_0^x f(t)\,dt .
\]
If \(f\) is differentiable then \(f\) is continuous, so Theorem 16 applied to \(F'(x)=\int_0^xf\) gives \(F''(x)=f(x)\).

*1 mark:* the rewrite that removes \(x\) from the integrand (or Leibniz reasoning with \(\partial_x\bigl[(x-t)f(t)\bigr]=f(t)\) — but the course route is the rewrite) and correct \(F'\); *1 mark:* \(F''=f\) with Theorem 16 named.
*Loses marks:* "differentiate under the integral sign" with no justification; claiming \(F'(x)=(x-x)f(x)=0\). → drill **B4-L5**.

---

## Question 8 (9)

**(a) (3 marks)** Theorem (Change of Variables, as stated in Week 12). Let \(g:[a,b]\to\mathbb{R}\) be **continuously differentiable**, let \(f:[c,d]\to\mathbb{R}\) be **continuous**, and suppose \(g([a,b])\subseteq[c,d]\). Then
\[
\int_a^b f(g(x))\,g'(x)\,dx=\int_{g(a)}^{g(b)}f(s)\,ds .
\]
Apply with \(g(x)=1-x^{2}\) (a polynomial, hence \(C^{1}\) on \([0,1]\)) and \(f(s)=s^{5}\) with \([c,d]=[0,1]\) (continuous, and \(g([0,1])=[0,1]\subseteq[0,1]\)): since \(g'(x)=-2x\),
\[
\int_0^1 x(1-x^{2})^{5}dx=-\tfrac12\int_{1}^{0}s^{5}\,ds=\tfrac12\int_0^1 s^{5}\,ds=\tfrac12\cdot\tfrac16=\tfrac1{12}.
\]
*1 mark:* the theorem **with both hypotheses** (\(g\) continuously differentiable on \([a,b]\); \(f\) continuous on an interval \([c,d]\) with \(g([a,b])\subseteq[c,d]\)); *1 mark:* verifying them for these \(f,g\) (including that \(g([0,1])=[0,1]\)); *1 mark:* transformed limits and the value \(\tfrac1{12}\).
*Loses marks:* keeping \(x\)-limits after substituting; leaving \(\int_1^0\) un-flipped (the value would come out \(-\tfrac1{12}\)). → drill **B5-L1, B5-L2**.

**(b) (2 marks)** With \(s=x^{2}\), \(ds=2x\,dx\), \(x:0\mapsto\sqrt{\pi/2}\) gives \(s:0\mapsto\pi/2\):
\[
\int_0^{\sqrt{\pi/2}}x\cos(x^{2})\,dx=\tfrac12\int_0^{\pi/2}\cos s\,ds=\tfrac12\bigl[\sin s\bigr]_0^{\pi/2}=\tfrac12 .
\]
*1 mark:* correct substitution and new limits; *1 mark:* the value (plus, ideally, one line noting \(g(x)=x^{2}\) is \(C^{1}\) and \(\cos\) is continuous).

**(c) (3 marks)** Use integration by parts — not available in the appendix, so state it: for \(u,v\in C^{1}[0,1]\), \(\int_0^1 u'v=[uv]_0^1-\int_0^1 uv'\), which follows from the product rule and Theorem 15 applied to \(uv\) (this is exactly the derivation set in Exercise 12, Question 5). Take \(v=\ln(1+x)\) (so \(v'=\frac1{1+x}\)) and \(u' = x\), \(u=\frac{x^{2}}2\):
\[
\int_0^1 x\ln(1+x)\,dx=\Bigl[\tfrac{x^{2}}{2}\ln(1+x)\Bigr]_0^1-\tfrac12\int_0^1\frac{x^{2}}{1+x}\,dx=\tfrac{\ln2}{2}-\tfrac12\int_0^1\Bigl(x-1+\tfrac1{1+x}\Bigr)dx
\]
\[
=\tfrac{\ln2}{2}-\tfrac12\Bigl(\tfrac12-1+\ln2\Bigr)=\tfrac{\ln2}{2}-\tfrac{\ln2}{2}+\tfrac14=\boxed{\tfrac14}.
\]
*1 mark:* naming IBP and its justification (product rule + Thm 15), with the functions continuous on \([0,1]\) and differentiable on \((0,1)\); *1 mark:* the correct boundary term \(\frac12\ln2\) **and** the remaining integral; *1 mark:* the algebra \(\frac{x^{2}}{1+x}=x-1+\frac1{1+x}\) and the value \(\frac14\).
*Loses marks:* choosing \(u=\ln(1+x)\) *and* \(v'=x\) then differentiating the wrong one; dropping the boundary term at \(x=0\) (it is \(0\cdot\ln1=0\) — say so); an answer like \(2\ln2-1\) (a sign/algebra slip — the check \(\frac14\approx0.25\) vs. \(\int_0^1x\ln(1+x)\le\int_0^1x\ln2=\frac{\ln2}{2}\approx0.35\) rules it out). → drill **B5-L4, B5-L5**.

**(d) (1 mark)** Any one of: (i) \(x\mapsto\frac{\ln|x|}{x}\) is unbounded near \(0\), so it is not Riemann integrable on \([-1,1]\) — the integral does not exist; (ii) \(g(x)=\ln|x|\) is not defined at \(0\), hence not \(C^{1}[-1,1]\), so the Change of Variables Theorem does not apply; (iii) \(g\) is not continuous on \([-1,1]\) and its range over \([-1,0)\cup(0,1]\) is not an interval.
*Loses marks:* "the substitution is not allowed because \(\ln|0|\) is undefined" *alone* is borderline — name which **hypothesis** of which **theorem** fails. → drill **B5-L3**.

---

## Suggested grading of yourself

| Band | Marks | What it means |
|---|---|---|
| Under 30 | gaps in definitions and hypothesis-checking | redo §0 of the worked-examples file and Questions 1–3 drills only |
| 30–40 | computes but does not argue | every lost mark is a missing hypothesis line; use the E.2 templates |
| 41–50 | solid pass | drill B4 and B5 ladders to remove algebra slips |
| 51+ | exam-ready | keep the appendix-numbering discipline and re-sit in 45 minutes |

**Cross-check list after marking:** Did every \(\varepsilon\)-proof begin with "let \(\varepsilon>0\)"? Did every cited theorem get its hypotheses verified first? Did every function come with its domain? Did every "true/false" get a named theorem or a named function?
