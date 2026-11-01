# MATH2016 Mock Final B — Memorandum with Mark Allocation

Total 60 marks. Paper B is the *proof* paper: only 14 of its 60 marks are pure calculation. Marks are awarded for hypotheses stated, results named by appendix number, and ε's introduced before they are used.

**Mark map:** Q1 2+3+2 · Q2 3+3+2 · Q3 2+3+2 · Q4 3+2+2 · Q5 3+3+2 · Q6 1+4+1+2 · Q7 2+4+2 · Q8 4+3 = 60.

---

## Question 1 (7) — Taylor's Theorem

**(a) (2 marks)** Taylor's Theorem (Lagrange remainder). Let \(f:[a,b]\to\mathbb{R}\) have **\(n\) continuous derivatives on \([a,b]\)** and suppose \(f^{(n+1)}\) **exists on \((a,b)\)**. Given **distinct** points \(x_{0},x\in[a,b]\), there is a point \(c\) **between \(x_{0}\) and \(x\)** such that
\[
f(x)=P^{n}_{x_{0}}(x)+\frac{f^{(n+1)}(c)}{(n+1)!}(x-x_{0})^{n+1},\qquad
P^{n}_{x_{0}}(x)=\sum_{k=0}^{n}\frac{f^{(k)}(x_{0})}{k!}(x-x_{0})^{k}.
\]

*1 mark:* the two regularity hypotheses (\(C^{n}\) on the **closed** interval, \(f^{(n+1)}\) on the **open** interval); *1 mark:* the conclusion with \(c\) *between* \(x_{0}\) and \(x\) **plus** the definition of \(P^{n}_{x_{0}}\).
*Loses marks:* "if \(f\) is smooth then the Taylor series converges to \(f\)" (that is a different, false, statement — analyticity is not guaranteed; the lectures flag this); writing the remainder as \(o(x^{n})\) when the Lagrange form was asked; forgetting \(x\neq x_{0}\) is harmless but forgetting "between" is not (it is what makes \(c\in(a,b)\) usable for a bound). → drill **A6-L1**.

**(b) (3 marks)** \(f^{(k)}(x)=e^{x}\) for all \(k\), so \(f^{(k)}(0)=1\) and
\[
P^{3}_{0}(x)=1+x+\frac{x^{2}}{2}+\frac{x^{3}}{6},\qquad P^{3}_{0}(1)=1+1+\tfrac12+\tfrac16=\tfrac83 .
\]
Hypotheses: \(e^{x}\) is \(C^{\infty}\) on \([0,1]\), so Taylor applies with \(n=3\), \(x_{0}=0\), \(x=1\): there is \(c\in(0,1)\) with
\[
e=\tfrac83+\frac{e^{c}}{4!}=\tfrac83+\frac{e^{c}}{24}.
\]
*Lower bound:* \(e^{c}>0\) gives \(e>\tfrac83\). *Upper bound:* \(c\in(0,1)\) gives \(e^{c}<e^{1}\), and \(e<3\) (e.g. \(e^{x}\) is increasing, so \(e^{c}\le e<3\); or crudely \(e^{c}\le e\le 3\) since \(P^{1}_{0}(1)=2<e\) and \(e<3\) is standard). Hence
\[
0<e-\tfrac83=\frac{e^{c}}{24}<\frac{3}{24}=\tfrac18 .
\]

*1 mark:* \(P^{3}_{0}\) and the value \(\tfrac83\); *1 mark:* applying Taylor with the hypotheses checked and isolating \(\frac{e^{c}}{24}\) **with \(c\in(0,1)\) stated**; *1 mark:* the bound \(e^{c}<3\) justified (not asserted) and both inequalities concluded.
*Loses marks:* using \(e^{c}\le e\) and then evaluating \(e\) to 3 decimals (circular — you are estimating \(e\)); bounding \(e^{c}\) by \(e^{c}<2\) (false, \(c\) can be near 1). Sanity check: \(e-\tfrac83\approx0.0516<0.125\) ✓. → drill **A6-L2**.

**(c) (2 marks)** Apply Taylor with \(n=4\), \(x_{0}=0\), on the interval with endpoints \(0\) and \(x\). Since \(f=\sin\) has \(f^{(4)}=\sin\), \(f^{(4)}(0)=0\), we get \(P^{4}_{0}(x)=x-\frac{x^{3}}{6}\) (the fourth-order term is zero, so this is the same polynomial as \(P^{3}_{0}\)). The remainder uses \(f^{(5)}=\cos\): for \(c\) between \(0\) and \(x\),
\[
\sin x=x-\frac{x^{3}}{6}+\frac{\cos c}{5!}x^{5}
\quad\Longrightarrow\quad
\left|\sin x-\Bigl(x-\frac{x^{3}}{6}\Bigr)\right|=\frac{|\cos c|}{120}|x|^{5}\le\frac{|x|^{5}}{120},
\]
because \(|\cos c|\le1\) for every \(c\). (For \(x=0\) both sides are \(0\).)

*1 mark:* taking **\(n=4\)** (not \(n=3\)) and saying why the degree-4 term vanishes; *1 mark:* the bound \(|\cos c|\le1\) — the estimate is uniform precisely because the fifth derivative is bounded, and the phrase "for some \(c\) between \(0\) and \(x\)" must appear.
*Loses marks:* \(n=3\): the Lagrange remainder then involves \(f^{(4)}(c)=\sin c\) and a power \(x^{4}\), which does **not** give the required estimate; dropping the absolute value on \(x^{5}\) (the statement is for negative \(x\) too). → drill **A6-L3**.

---

## Question 2 (8) — the second derivative test

**(a) (3 marks)** *Definition.* \(f\) has a **strict relative minimum** at \(x_{0}\) if there is \(\delta>0\) such that \(f(x)>f(x_{0})\) for all \(x\in(x_{0}-\delta,x_{0}+\delta)\) with \(x\neq x_{0}\).

*Proposition (Second derivative test).* Suppose \(f:(a,b)\to\mathbb{R}\) is **twice continuously differentiable**, \(x_{0}\in(a,b)\), \(f'(x_{0})=0\) and \(f''(x_{0})>0\). Then \(f\) has a strict relative minimum at \(x_{0}\).

*1 mark:* the definition with the **strict** inequality and \(x\neq x_{0}\) excluded; *1 mark:* \(C^{2}\) (continuity of \(f''\), not merely existence) and \(x_{0}\) interior; *1 mark:* both conditions \(f'(x_{0})=0\), \(f''(x_{0})>0\) and the conclusion as stated.
*Loses marks:* "if \(f''(x_{0})>0\) then \(x_{0}\) is a minimum" without \(f'(x_{0})=0\); saying "local" where the lecture says "relative" is fine, but "absolute" is wrong. → drill **A6-L4**.

**(b) (3 marks)** As \(f''\) is continuous at \(x_{0}\) and \(f''(x_{0})>0\), there exists \(\delta>0\) such that \(f''(t)>0\) for all \(t\in(x_{0}-\delta,x_{0}+\delta)\) (this is continuity applied to the number \(f''(x_{0})/2>0\)). Take \(x\in(x_{0}-\delta,x_{0}+\delta)\), \(x\neq x_{0}\). Taylor's Theorem with \(n=1\) on the interval with endpoints \(x_{0}\) and \(x\): hypotheses hold because \(f\) is \(C^{1}\) on \([a,b]\)-subintervals and \(f''\) exists inside; there is \(c\) between \(x_{0}\) and \(x\) with
\[
f(x)=f(x_{0})+f'(x_{0})(x-x_{0})+\frac{f''(c)}{2}(x-x_{0})^{2}
=f(x_{0})+\frac{f''(c)}{2}(x-x_{0})^{2}.
\]
Now \(c\in(x_{0}-\delta,x_{0}+\delta)\), so \(f''(c)>0\), and \((x-x_{0})^{2}>0\) since \(x\neq x_{0}\). Hence \(f(x)>f(x_{0})\) for every such \(x\): strict relative minimum.

*1 mark:* the continuity step producing \(\delta\) with \(f''>0\) on the whole neighbourhood (the mark students skip — the proof is exactly this step plus Taylor); *1 mark:* Taylor with \(n=1\) and the middle term killed by \(f'(x_{0})=0\); *1 mark:* the final two sign observations and the conclusion in definition-form.
*Loses marks:* writing \(f''(x_{0})\) in place of \(f''(c)\) in the remainder (that is not what Taylor says); claiming the result "because \(f'\) is increasing" (that needs \(f''>0\) on an interval anyway and is the other proof). → drill **A6-L4**.

**(c) (2 marks)** \(f'(x)=4x^{3}-2x=2x(2x^{2}-1)\), so the critical points are \(x=0\) and \(x=\pm\frac1{\sqrt2}\). \(f''(x)=12x^{2}-2\): \(f''(0)=-2<0\) ⇒ **strict relative maximum** at \(0\) (value \(0\)); \(f''\!\left(\pm\frac1{\sqrt2}\right)=12\cdot\frac12-2=4>0\) ⇒ **strict relative minima** at \(\pm\frac1{\sqrt2}\) (value \(-\frac14\)). Hypotheses are satisfied: \(f\) is a polynomial, hence \(C^{\infty}\).

*Inconclusive cases at \(x_{0}=0\), where \(f'(0)=0\) and \(f''(0)=0\):* \(f(x)=x^{4}\) (strict minimum), \(f(x)=-x^{4}\) (strict maximum), \(f(x)=x^{3}\) (neither — \(f\) takes both signs, indeed \(f'\! =3x^{2}\ge0\) so \(f\) is increasing).

*1 mark:* the classification with \(f''\) **evaluated** and the hypothesis line; *1 mark:* all three counterexample functions correctly labelled.
*Loses marks:* reporting only the \(x\)-values without saying max/min; giving only two of the three examples (the question demands three — the third is the one students omit). → drill **A6-L4, A1-L6**.

---

## Question 3 (7) — Inverse Function Theorem

**(a) (2 marks)** Theorem 6. Let \(f:(a,b)\to\mathbb{R}\) be **continuously differentiable**, \(x_{0}\in(a,b)\) a point where \(f'(x_{0})\neq0\). Then there exists an **open interval** \(I\subset(a,b)\) with \(x_{0}\in I\) such that the restriction \(f|_{I}\) is **injective**, with a **continuously differentiable inverse** \(g:J\to I\) defined on the interval \(J:=f(I)\), and
\[
g'(y)=\frac{1}{f'\bigl(g(y)\bigr)}\quad\text{for all }y\in J .
\]

*1 mark:* \(C^{1}\) on an **open** interval plus \(f'(x_{0})\neq0\); *1 mark:* the local conclusion (there is some \(I\), not "the whole domain"), \(J=f(I)\), and the formula with \(g(y)\) inside \(f'\).
*Loses marks:* globalising (e.g. \(f(x)=x^{2}\), \(f'(1)=2\neq0\), yet no single inverse on all of \(f(\mathbb{R})\)); writing \(g'(y)=1/f'(y)\). → drill **A5-L1**.

**(b) (3 marks)** *Injectivity:* \(f'(x)=3x^{2}+1\ge1>0\) for all \(x\). For \(u<v\), \(f\) is continuous on \([u,v]\) and differentiable on \((u,v)\), so the **Mean Value Theorem (Theorem 4)** gives \(f(v)-f(u)=f'(\xi)(v-u)>0\); hence \(f(u)\neq f(v)\) and \(f\) is strictly increasing, therefore one-to-one. (Equivalently: Proposition 5(ii)-(i) with the interval hypothesis.)
*Onto:* \(f\) is continuous (differentiable), \(f(x)=x^{3}+x\to+\infty\) as \(x\to+\infty\) and \(\to-\infty\) as \(x\to-\infty\); given \(y\in\mathbb{R}\), choose \(u<v\) with \(f(u)<y<f(v)\) and apply **IVT** to get \(x\) with \(f(x)=y\).
*Derivative of the inverse:* \(f(1)=2\) and \(f'(1)=4\neq0\); \(f\) is \(C^{1}\) on \(\mathbb{R}\), so Theorem 6 applies at \(x_{0}=1\) with \(I\) any neighbourhood of \(1\), and \(g=(f^{-1})\) satisfies \(g'(2)=\frac{1}{f'(1)}=\frac14\).

*1 mark:* injectivity via MVT/Prop 5 with the derivative **bounded below by a positive number**; *1 mark:* surjectivity needing continuity **and** the two limits (one side is not enough); *1 mark:* locating the preimage (\(f(1)=2\)) before applying Theorem 6, and the value \(\tfrac14\).
*Loses marks:* "\(f\) is increasing because \(f'>0\)" with no citation or interval argument; computing \(g'(2)=1/f'(2)\) (must evaluate \(f'\) at \(1\), the point of the fibre over \(2\)); asserting bijectivity from \(f'>0\) alone (that gives injectivity only). → drill **A5-L1, A3-L5, A5-L4**.

**(c) (2 marks)** Take \(f:(0,\infty)\to(0,\infty)\), \(f(x)=x^{n}\). Then \(f\) is continuously differentiable with \(f'(x)=nx^{n-1}>0\) on \((0,\infty)\); \(f\) is bijective onto \((0,\infty)\) (existence of \(n\)-th roots for positive numbers, by IVT applied to \(x^{n}-y\) together with injectivity from the MVT as in (b)), and its inverse is \(g(y)=y^{1/n}\). By Theorem 6, \(g\) is differentiable at every \(y>0\) (the hypothesis needed is \(f'(g(y))\neq0\), which holds since \(g(y)>0\)) and
\[
g'(y)=\frac{1}{f'\bigl(g(y)\bigr)}=\frac{1}{n\bigl(y^{1/n}\bigr)^{n-1}}=\frac1n y^{\frac{1-n}{n}}=\frac1n y^{\frac1n-1}.
\]

*1 mark:* verifying **all** of Theorem 6's hypotheses for \(f(x)=x^{n}\) (including \(f'>0\) on the whole domain and that \(g\) *is* the inverse); *1 mark:* the algebra to \(\frac1n y^{\frac1n-1}\).
*Loses marks:* differentiating \(y^{1/n}\) "by the power rule" — the power rule for fractional exponents is *what* you are proving here (circularity); ignoring \(y=0\), where \(g\) is not differentiable (state it: for \(n\ge2\), \(g'(y)\to\infty\) as \(y\to0^{+}\)). → drill **A5-L3**.

---

## Question 4 (7) — derivative-zero arguments and the chain rule's edges

**(a) (3 marks)** Define \(h(x)=f(x)e^{-x}\) on \(\mathbb{R}\). Then \(h\) is differentiable (product of differentiable functions; \(x\mapsto e^{-x}\) is \(C^{\infty}\) with derivative \(-e^{-x}\)) and
\[
h'(x)=f'(x)e^{-x}-f(x)e^{-x}=\bigl(f(x)-f(x)\bigr)e^{-x}=0\quad(x\in\mathbb{R}).
\]
A function with identically zero derivative on an **interval** is constant: for \(u<v\), the MVT (Theorem 4) on \([u,v]\) gives \(h(v)-h(u)=h'(\xi)(v-u)=0\). Hence \(h(x)=h(0)=f(0)e^{0}=1\) for all \(x\), so \(f(x)=e^{x}\).

*1 mark:* the auxiliary function \(h\) (and its differentiability justified); *1 mark:* \(h'\equiv0\) plus the MVT (or Proposition 5) step that turns "\(h'=0\)" into "\(h\) constant" — this is the mark that separates a proof from a calculation; *1 mark:* using \(f(0)=1\) to find the constant and concluding for **all** \(x\in\mathbb{R}\).
*Loses marks:* "so \(f\) is \(e^{x}\)" without the initial condition; integrating both sides ("\(f=e^{x}+C\)") — integration is not licensed before the constant-function argument and reads as circular here. → drill **A3-L6, B4-L6**.

**(b) (2 marks)** Let \(H=f-g\) on \([a,b]\): \(H\) is differentiable on \((a,b)\) with \(H'(x)=f'(x)-g'(x)=0\) there, and \(H\) is continuous on \([a,b]\). For any \(x\in(a,b]\), apply the MVT (Theorem 4) to \(H\) on \([a,x]\): there is \(\xi\in(a,x)\) with \(H(x)-H(a)=H'(\xi)(x-a)=0\), so \(H(x)=H(a)=f(a)-g(a)=0\). Thus \(f(x)=g(x)\) for all \(x\in[a,b]\) (including \(x=a\), which is the given condition).

*1 mark:* forming \(H\) and checking **both** MVT hypotheses on \([a,x]\) (continuity on the closed interval is not automatic from "differentiable on \((a,b)\)" — say it); *1 mark:* the conclusion at every point including \(b\) and \(a\).
*Loses marks:* applying Prop 5 to "\(H'=0\)" on an interval without noting that the interval must contain \((a,b)\) properly; concluding only on \((a,b)\). → drill **B4-L6, A4-L4**.

**(c) (2 marks)** Take \(f(y)=|y|\) (not differentiable at \(0\)) and \(g(x)=x^{2}\) (differentiable everywhere, \(g(0)=0\)). Then \((f\circ g)(x)=|x^{2}|=x^{2}\), which **is** differentiable at \(0\) with derivative \(0\), while \(f'(g(0))=f'(0)\) does not exist.

So the chain rule is a **one-directional sufficient condition**: the failure of its hypotheses does not imply the failure of its conclusion, and one may not "prove" that \(f\circ g\) is non-differentiable merely because \(f\) or \(g\) fails to be differentiable. (Contrast: \(g(x)=|x|\), \(f(y)=y\), where \(f\circ g\) is not differentiable at \(0\) — the hypotheses are sufficient, not necessary.)

*1 mark:* a correct pair \(f,g\) with all three claims verified (where \(f\) fails, where \(g\) is fine, and the composite computed explicitly and simplified); *1 mark:* the logical statement — hypotheses not necessary; "converse of the chain rule fails".
*Loses marks:* \(f=|\cdot|\), \(g(x)=x\): valid as an example but does not show the composite *is* differentiable, so it answers a different question; \(\Rightarrow\) claims about non-differentiability. → drill **A2-L2, A1-L6**.

---

## Question 5 (8) — Darboux sums, refinements, and a function that is not integrable

**(a) (3 marks)** \(g(x)=x\) on \([0,1]\) with \(P_{n}=\{x_0,\dots,x_n\}\), \(x_i=\frac in\), \(\Delta x_i=\frac1n\). Since \(g\) is **increasing**, on the closed subinterval \([x_{i-1},x_i]\) the infimum and supremum are the endpoint values and both are **attained**: \(m_i=\frac{i-1}{n}\), \(M_i=\frac in\).
\[
L(P_n,g)=\sum_{i=1}^{n}\frac{i-1}{n}\cdot\frac1n=\frac{1}{n^{2}}\cdot\frac{n(n-1)}{2}=\frac{n-1}{2n},
\qquad
U(P_n,g)=\frac{1}{n^{2}}\cdot\frac{n(n+1)}{2}=\frac{n+1}{2n}.
\]
*Integrability:* \(U(P_n,g)-L(P_n,g)=\frac1n\). Given \(\varepsilon>0\), choose \(n\in\mathbb N\) with \(\frac1n<\varepsilon\) (Archimedean property); then that uniform partition satisfies Riemann's condition, so by **Proposition 11** \(g\in\mathcal R[0,1]\).
*Value:* for every partition \(P\), \(L(P,g)\le\int_0^1 g\le U(P,g)\) — this is immediate from the **definition** \(\int_0^1g=\sup_P L(P,g)=\inf_P U(P,g)\) (each \(L(P,g)\) is at most the sup, each \(U(P,g)\) is at least the inf; Proposition 10 is the analogous statement for the lower and upper *integrals*). Applying this to \(P_n\) for **every** \(n\):
\[
\frac{n-1}{2n}\le\int_0^{1}g\le\frac{n+1}{2n}\quad\forall n
\quad\Longrightarrow\quad
\left|\int_0^{1}g-\tfrac12\right|\le\frac{1}{2n}\xrightarrow[n\to\infty]{}0,
\]
hence \(\int_0^1 g=\tfrac12\).

*1 mark:* \(m_i,M_i\) **with the monotonicity/attainment reason** and the two sums evaluated to \(\frac{n-1}{2n},\frac{n+1}{2n}\); *1 mark:* the \(\varepsilon\)-first argument with \(U-L=\frac1n<\varepsilon\) and Proposition 11 named; *1 mark:* the squeeze giving the value (never an antiderivative — \(\frac{x^{2}}2\big|_0^1\) earns nothing here, since that is exactly what the question forbids).
*Loses marks:* writing \(\lim_{n\to\infty}L(P_n)=\frac12\) and concluding "so the integral is \(\frac12\)" — the limit of the sums of *one family* of partitions does not compute the integral unless integrability has already been established by Proposition 11 (this is the most common structural gap in this question); using the Fundamental Theorem (Thm 15) to evaluate, which is circular in spirit here: the question asks for the integral from the definition, and Thm 15's own proof is built out of Darboux sums and Riemann's condition.

*Variant worth knowing (jump inside the partition).* For \(f=\mathbf 1_{[1/2,1]}\) on \([0,1]\) and \(P=\{0,\tfrac14,\tfrac12,\tfrac34,1\}\): on \([0,\tfrac14]\) \(f\equiv0\) so \(m=M=0\); on \([\tfrac14,\tfrac12]\) the function is \(0\) except \(f(\tfrac12)=1\), so \(m=0,M=1\) (**the jump point is an endpoint of two subintervals and infects both**); on \([\tfrac12,\tfrac34]\) and \([\tfrac34,1]\), \(f\equiv1\) so \(m=M=1\). Hence \(L(P,f)=\tfrac12\), \(U(P,f)=\tfrac34\), bracketing the true value \(\tfrac12\). The deduction to avoid: \(M=0\) on \([\tfrac14,\tfrac12]\) because "almost every point is \(0\)" — the supremum is not a typical value. → drill **B1-L2, B1-L3**.

**(b) (3 marks)** \(h=\mathbf{1}_{[1/2,3/4]}\).
- \(P_{4}\): on \([0,\tfrac14]\) \(h\equiv0\); on \([\tfrac14,\tfrac12]\) \(h\) is \(0\) except \(h(\tfrac12)=1\): \(m=0,M=1\); on \([\tfrac12,\tfrac34]\) \(h\equiv1\): \(m=M=1\); on \([\tfrac34,1]\) \(h\) is \(0\) except \(h(\tfrac34)=1\): \(m=0,M=1\). Hence
\[
L(P_{4},h)=\tfrac14,\qquad U(P_{4},h)=\tfrac14+\tfrac14+\tfrac14=\tfrac34 .
\]
- \(P_{5}\): \([0,\tfrac15],[\tfrac15,\tfrac25]\): \(h\equiv0\). \([\tfrac25,\tfrac35]\): contains points of \([\tfrac12,\tfrac34]\) (e.g. \(\tfrac12\)) and points outside (e.g. \(\tfrac25\)): \(m=0,M=1\). \([\tfrac35,\tfrac45]\): contains \([\tfrac35,\tfrac34]\subset\) support and \((\tfrac34,\tfrac45]\not\subset\): \(m=0,M=1\). \([\tfrac45,1]\): \(h\equiv0\). Hence
\[
L(P_{5},h)=0,\qquad U(P_{5},h)=\tfrac15+\tfrac15=\tfrac25 .
\]
- No contradiction with Proposition 9: \(P_{9}\) compares \(L\) and \(U\) only when \(\tilde P\) is a **refinement** of \(P\), i.e. \(P\subset\tilde P\). Here \(P_{4}\not\subset P_{5}\) (\(\tfrac14,\tfrac12,\tfrac34\notin P_{5}\)), so the two partitions are simply incomparable. Proposition 9 would apply to \(P_{4}\cup P_{5}\), which refines both.

*1 mark:* \(L(P_{4})=\tfrac14,\;U(P_{4})=\tfrac34\); *1 mark:* \(L(P_{5})=0,\;U(P_{5})=\tfrac25\); *1 mark:* the definition of refinement and the observation \(P_{4}\not\subset P_{5}\) (with the common refinement named).
*Loses marks:* claiming "finer partitions always give better sums" as if it were Proposition 9 — it is true only under refinement (this is exactly the trap the question sets); computing sums by sampling instead of by inf/sup. Note both pairs bracket the true integral \(\tfrac14\): \(0\le\tfrac14\le\tfrac25\) ✓ and \(\tfrac14\le\tfrac14\le\tfrac34\) ✓. → drill **B1-L4**.

**(c) (2 marks)** Let \(P=\{x_{0},\dots,x_{n}\}\) be any partition of \([0,1]\). Every subinterval \([x_{i-1},x_{i}]\) has \(x_{i-1}<x_{i}\), hence contains both a rational and an irrational number (density of \(\mathbb{Q}\) and of \(\mathbb{R}\setminus\mathbb{Q}\)). So on each subinterval \(\phi\) takes the values \(1\) and \(0\), giving \(m_i=0\) and \(M_i=1\). Therefore
\[
L(P,\phi)=\sum_{i}0\cdot\Delta x_i=0,\qquad
U(P,\phi)=\sum_{i}1\cdot\Delta x_i=1 .
\]
Thus \(\underline{\int_0^1}\phi=\sup_P L=0\) and \(\overline{\int_0^1}\phi=\inf_P U=1\): the lower and upper integrals differ, so \(\phi\notin\mathcal{R}[0,1]\). Equivalently, \(U(P,\phi)-L(P,\phi)=1\not<\varepsilon\) for \(\varepsilon<1\), violating Proposition 11.

*1 mark:* the density argument giving \(m_i=0,M_i=1\) **for every** subinterval of **every** partition (this must be stated for all \(P\), not for a cleverly chosen one); *1 mark:* the conclusion via unequal lower/upper integrals or via Proposition 11 with a specific \(\varepsilon\) (e.g. \(\varepsilon=\tfrac12\)).
*Loses marks:* "the function is discontinuous everywhere so it is not integrable" (true, but no appendix result says it; and the marks are for the sums); computing for one partition only (Prop 11 needs the failure for **all** partitions — which is what "for every \(P\)" above delivers). → drill **B1-L5**.

---

## Question 6 (8) — a hard ε-partition proof

**(a) (1 mark)** For every \(x\in[0,1]\): if \(x=1/n\) then \(f(x)=1/n\le1\); otherwise \(f(x)=0\). So \(0\le f(x)\le1\) on \([0,1]\): \(f\) is bounded (and \(m,M\) of Proposition 8 may be taken as \(0,1\)).
*1 mark:* the two-case bound stated for **all** \(x\), noting \(f\ge0\) as well. *Loses marks:* "clearly bounded" with no quantifier.

**(b) (4 marks)** Let \(\varepsilon>0\). Choose \(N\in\mathbb{N}\) with \(\frac1N<\frac{\varepsilon}{2}\) (Archimedean property). On \(\bigl[\frac1N,1\bigr]\) there are only **finitely many** points where \(f\ne0\), namely \(\{1,\frac12,\dots,\frac1N\}\); put \(x_{j}=\frac1j\) for \(j=1,\dots,N\). Around each \(x_{j}\) choose an open interval of length \(\eta_{j}=\frac{\varepsilon}{2N}\); their total length is \(N\cdot\frac{\varepsilon}{2N}=\frac{\varepsilon}{2}\). Let \(P\) be the partition whose points are \(0\), \(\frac1N\), \(1\), together with the endpoints of those small intervals intersected with \([\frac1N,1]\) (trim at \(\frac1N\) and \(1\) if an interval sticks out).

On a subinterval \(I\) of \(P\):
- if \(I\) is one of the small intervals around some \(x_{j}\), then \(0\le f\le1\) on \(I\), so \(M_i-m_i\le1\) and its total contribution to \(U-L\) is at most \(\sum_{j}\eta_{j}=\frac{\varepsilon}{2}\);
- if \(I\subset[\frac1N,1]\) is not one of those intervals and does not contain any \(x_{j}\) in its interior, then \(f\equiv0\) on \(I\), so \(M_i=m_i=0\) and the contribution is \(0\);
- on \([0,\frac1N]\): \(0\le f\le1\) there but the length is \(\frac1N<\frac{\varepsilon}{2}\), so \(M_i-m_i\le1\) contributes at most \(\frac1N<\frac{\varepsilon}{2}\).

Hence
\[
U(P,f)-L(P,f)=\sum_i (M_i-m_i)\Delta x_i\le\frac{\varepsilon}{2}+\frac{\varepsilon}{2}=\varepsilon .
\]
(Choosing \(\frac1N<\frac{\varepsilon}{3}\) and \(\eta_j=\frac{\varepsilon}{3N}\) gives \(<\varepsilon\) strictly, if you prefer.) By **Proposition 11**, \(f\in\mathcal{R}[0,1]\).

*1 mark:* "let \(\varepsilon>0\)" **first**, and the explicit choice of \(N\) with a stated inequality; *1 mark:* the partition built from the finitely many isolated points **plus** the single small interval \([0,\frac1N]\) that swallows the tail (this is the whole idea: finitely many bad points handled individually, the accumulation point handled by length); *1 mark:* the three-case estimate of \(M_i-m_i\) with the sums; *1 mark:* naming Proposition 11 to conclude.
*Loses marks:* "the set of discontinuities has measure zero" (not a course result, earns none of the four marks); a partition that isolates the points but never accounts for \([0,\frac1N]\); fixing \(\varepsilon\) at a particular value; letting \(\eta\) depend on \(j\) without summing it. → drill **B2-L1, B2-L4, B1-L3**.

**(c) (1 mark)** For every partition \(P\) we have \(L(P,f)\le\int_0^1 f\le U(P,f)\) (definition of the integral, or Proposition 8 with \(m=0\)). In the construction above \(f\ge0\) gives \(L(P,f)\ge0\), and \(U(P,f)\le \frac{\varepsilon}{2}+1\cdot\frac1N<\varepsilon\) after tightening the constants. Thus
\[
0\le\int_0^1 f\le U(P,f)<\varepsilon\quad\text{for every }\varepsilon>0,
\]
so \(\int_0^1 f=0\) (a non-negative real number smaller than every positive \(\varepsilon\) is \(0\)).
*1 mark:* the squeeze \(\varepsilon\)-argument with the upper bound on \(U(P,f)\) **explicitly** derived from part (b). *Loses marks:* "the function is nonzero only at countably many points, so the integral is 0" — that is the conclusion, not a proof. → drill **B2-L1, B3-L5**.

**(d) (2 marks)** By Theorem 13, \(|f|\in\mathcal{R}[a,b]\). For all \(x\), \(-|f(x)|\le f(x)\le|f(x)|\). By **Proposition 12** (monotonicity of the integral) applied twice, and linearity (which must be stated: \(\int(-g)=-\int g\), a special case of the scalar-multiple rule),
\[
-\int_a^b|f|=\int_a^b(-|f|)\le\int_a^b f\le\int_a^b|f|,
\]
i.e. \(\left|\int_a^b f\right|\le\int_a^b|f|\).

*1 mark:* citing Theorem 13 for the integrability of \(|f|\) (otherwise \(\int|f|\) is meaningless) and the pointwise inequality; *1 mark:* Prop 12 + the sign/absolute-value conclusion. *Loses marks:* using the inequality for \(|{\cdot}|\) without noting integrability; proving \(|f|\) integrable from scratch (not needed — it is Theorem 13). → drill **B3-L3, B2-L5**.

---

## Question 7 (8) — FTC2 and the logarithm

**(a) (2 marks)** Theorem 16. Let \(f:[a,b]\to\mathbb{R}\) be a **Riemann integrable** function. Define \(F(x):=\int_{a}^{x}f\) for \(x\in[a,b]\). First, \(F\) is **continuous on \([a,b]\)**. Second, if \(f\) is **continuous at \(c\in[a,b]\)**, then \(F\) is **differentiable at \(c\)** and \(F'(c)=f(c)\).

*1 mark:* \(f\in\mathcal{R}[a,b]\) as hypothesis and the definition of \(F\) with its domain; *1 mark:* both conclusions (continuity everywhere from integrability alone; differentiability **at the points of continuity of \(f\)** — not on all of \([a,b]\)).
*Loses marks:* dropping the continuity conclusion (it is a separate sentence of the theorem and it is what Question 6(c)-style arguments use); "if \(f\) is continuous then \(F'=f\)" stated without the integrability hypothesis; confusing this with Theorem 15. → drill **B4-L2, B4-L3**.

**(b) (4 marks)** Fix \(y>0\) and define \(\varphi:(0,\infty)\to\mathbb{R}\) by \(\varphi(x)=\ln(xy)-\ln x\). The map \(s\mapsto\frac1s\) is continuous on \((0,\infty)\), hence integrable on every interval by **Lemma 14**, and by **Theorem 16** \(\ln\) is differentiable at every \(x>0\) with \(\ln'(x)=\frac1x\). So \(\varphi\) is differentiable on \((0,\infty)\) (chain rule on \(x\mapsto xy\), whose derivative is \(y\)):
\[
\varphi'(x)=\frac{y}{xy}-\frac1x=\frac1x-\frac1x=0\quad(x>0).
\]
Since \(\varphi'\equiv0\) on the interval \((0,\infty)\), \(\varphi\) is constant (MVT, Theorem 4: for \(u<v\) in \((0,\infty)\), \(\varphi(v)-\varphi(u)=\varphi'(\xi)(v-u)=0\)). Evaluating at \(x=1\):
\[
\varphi(x)=\varphi(1)=\ln(y)-\ln(1)=\ln y-\int_{1}^{1}\frac{ds}{s}=\ln y-0=\ln y,
\]
so \(\ln(xy)-\ln x=\ln y\), i.e. \(\ln(xy)=\ln x+\ln y\) for all \(x,y>0\).

*1 mark:* establishing that \(\ln\) is differentiable with \(\ln'=\frac1x\) **from Theorem 16 + Lemma 14** (this is the point of the question: the derivative is a theorem here, not a memorised rule); *1 mark:* defining \(\varphi\) with its domain \((0,\infty)\) and computing \(\varphi'\equiv0\); *1 mark:* the MVT (or Proposition 5) step constant-ifying \(\varphi\); *1 mark:* evaluating the constant at \(x=1\) using \(\ln 1=0\) and concluding for **all** \(x,y>0\).
*Loses marks:* "differentiate both sides of \(\ln(xy)=\ln x+\ln y\)" — that assumes what is to be proved; the standard calculus proof via \(\int_1^{xy}=\int_1^{x}+\int_x^{xy}\) and the substitution \(s=xt\) is **also** acceptable (it uses additivity of the integral and the change-of-variables theorem, and then "both sides have the same derivative and agree at \(x=1\)"), but the substitution must be justified: \(g(t)=xt\) is \(C^{1}\) on an interval containing \([1,x]\) and \(1/t\) is continuous on that interval; *dropping domain care*: \(x,y>0\) is needed for \(\frac1s\) to be continuous on the integration interval. → drill **B4-L6, A5-L2, B5-L1**.

**(c) (2 marks)** Let \(E(u)=\int_{0}^{u}e^{-t^{2}}\,dt\). The integrand \(t\mapsto e^{-t^{2}}\) is continuous on \(\mathbb{R}\) (composition of continuous functions), so by Lemma 14 it is integrable on every \([0,u]\), and Theorem 16 gives \(E'(u)=e^{-u^{2}}\) for all \(u\). Then \(\int_{0}^{x^{2}}e^{-t^{2}}dt=E(x^{2})\), and by the **chain rule**
\[
\frac{d}{dx}E(x^{2})=E'(x^{2})\cdot 2x=2x\,e^{-x^{4}} .
\]

*1 mark:* checking the continuity/integrability hypothesis before citing Theorem 16 and stating \(E'\); *1 mark:* the chain rule factor \(2x\) and the correct exponent \(-x^{4}\).
*Loses marks:* \(2xe^{-x^{2}}\) (the integrand must be evaluated at \(u=x^{2}\), so the exponent becomes \(-(x^{2})^{2}\)); "differentiate under the integral sign" as a one-line answer with no named result. ✓ Check: at \(x=0\) the formula gives \(0\), and the composite is even, so its derivative at \(0\) must vanish — consistent. → drill **B4-L4**.

---

## Question 8 (7) — mean value theorem for integrals, and odd functions

**(a) (4 marks)** *Statement.* Let \(f:[a,b]\to\mathbb{R}\) be continuous. Then there exists \(c\in[a,b]\) (in fact \(c\in(a,b)\) unless \(f\) is constant) such that
\[
f(c)=\frac{1}{b-a}\int_a^b f(x)\,dx .
\]
*Proof.* By the **Extreme Value Theorem**, \(f\) attains its minimum and maximum on \([a,b]\): there are \(p,q\in[a,b]\) with \(m:=f(p)=\min_{[a,b]}f\) and \(M:=f(q)=\max_{[a,b]}f\), so \(m\le f(x)\le M\) for all \(x\). **Lemma 14** gives \(f\in\mathcal{R}[a,b]\). **Proposition 10** (with these \(m,M\)) gives
\[
m(b-a)\le\int_a^b f\le M(b-a)\quad\Longrightarrow\quad m\le\frac1{b-a}\int_a^b f\le M .
\]
The number \(A:=\frac1{b-a}\int_a^b f\) therefore lies between \(f(p)\) and \(f(q)\). By the **Intermediate Value Theorem** applied to \(f\) on the closed interval with endpoints \(p\) and \(q\), there is \(c\) between \(p\) and \(q\) with \(f(c)=A\). Since \(c\in[a,b]\), we are done.

*1 mark:* the statement, including \(c\in[a,b]\) and the factor \(\frac1{b-a}\); *1 mark:* EVT giving attained \(m,M\) (attainment, not just bounds — that is what makes \(A\) a value between two **function values**) plus \(f\in\mathcal R\) from Lemma 14; *1 mark:* Proposition 10 divided by \(b-a\) (so \(b>a\) is needed — worth noting, and note Prop 8 is the version for \(L(P,f),U(P,f)\) while Prop 10 is the version for the lower/upper integrals, so the integrable-function conclusion you want is Prop 10's); *1 mark:* IVT on the interval between \(p\) and \(q\) producing \(c\).
*Loses marks:* claiming \(c\in(a,b)\) without qualification (take \(f\equiv\) constant, or a monotone function whose average is attained only at an endpoint — actually for continuous functions the average is attained in \((a,b)\) unless \(f\) is constant, but proving that needs one more argument: it is safer and full-marks to state \(c\in[a,b]\)); citing "the MVT for integrals" as an appendix result — it is **not** in the appendix, which is why the question demands the proof. → drill **B3-L4, C-L4**.

**(b) (3 marks)** By additivity of the integral (Proposition/lecture rule: \(\int_{-a}^{a}f=\int_{-a}^{0}f+\int_{0}^{a}f\), valid since \(f\in\mathcal{R}[-a,a]\) implies its restrictions are integrable), it suffices to show \(\int_{-a}^{0}f=-\int_{0}^{a}f\). In \(\int_{-a}^{0}f(x)\,dx\) substitute \(s=-x\) (change of variables with \(g(x)=-x\), which is \(C^{1}\) on \([-a,0]\) with \(g'(x)=-1\), and \(f\) continuous — or in the present setting, integrable — on the relevant interval):
\[
\int_{-a}^{0}f(x)\,dx=\int_{a}^{0}f(-s)\cdot(-1)\,ds=\int_{a}^{0}\bigl(-f(s)\bigr)(-1)\,ds=\int_{a}^{0}f(s)\,ds=-\int_{0}^{a}f(s)\,ds,
\]
using \(f(-s)=-f(s)\) (oddness) and the convention \(\int_{a}^{0}=-\int_{0}^{a}\). Hence \(\int_{-a}^{a}f=\int_{0}^{a}f-\int_{0}^{a}f=0\).

*1 mark:* splitting at \(0\) with the integrability of the restrictions justified; *1 mark:* the substitution \(s=-x\) done with its derivative factor \((-1)\) **and** the flipped limits (the two minus signs, one from oddness and one from the reversal, must both appear); *1 mark:* the conclusion \(=0\).
*Loses marks:* "the positive and negative halves cancel by symmetry" as a one-line answer (no mark without the substitution); a sign error producing \(2\int_{0}^{a}f\). Sanity check: for \(f(x)=x\) on \([-1,1]\) both routes give \(0\) ✓; the analogue for **even** \(f\) is \(\int_{-a}^{a}f=2\int_{0}^{a}f\) (Exercise 12 Q10(b)) — know both. → drill **B3-L2, B5-L2**.
---

## Suggested grading of yourself

| Band | Marks | Diagnosis | Next action |
|---|---|---|---|
| Under 28 | theorem statements are the bottleneck | Q1(a), Q2(a), Q3(a), Q7(a) are 9 of the marks lost | write all 16 appendix statements from memory, then re-check against `Appendix-exam.pdf`; drill **A5, A6** |
| 28–39 | proofs start but do not close | missing \(\varepsilon\)-ordering, no hypothesis line before a citation | re-do **Q6(b)** and **Q7(b)** twice, cold, timing 12 minutes each; drill **B2, B4** |
| 40–49 | solid pass, slips in estimates/algebra | remainder bounds, sign errors in substitutions | drill **A6-L2, A6-L3, B5** |
| 50+ | exam-ready for the proof-type questions | — | sit `Mock-Final-Exam.md` (the computation-flavoured paper) the same week |

**Two-paper coverage map.** `Mock-Final-Exam.md`: derivative from the definition, Prop 1, Rolle + auxiliary function, MVT root-counting, Darboux, ε-partition integrability (one bad point), Darboux sums on a given partition, FTC1 statement, \(\int_a^x f=\int_x^b f\), CoV, IBP, invalid substitution. This paper: Taylor and error bounds, second derivative test, IFT and inverse derivatives, \(f'\equiv0\Rightarrow\) constant, chain-rule logic, the integral **from the definition** (uniform partitions, no antiderivatives), the non-refinement trap, Dirichlet non-integrability, ε-partition integrability (countably many bad points), \(\bigl|\int f\bigr|\le\int|f|\), \(\ln\) built from the integral, mean value theorem for integrals, odd functions.

Between the two papers, Section D's types **D1–D8 and D10–D17** all appear under exam conditions. The one type not examined is **D9** — a proof is printed and you must finish or repair it — which is drilled at **C-L7** and **B2-L4**, where every \(\le\) must carry the name of the result that justifies it. If your paper contains such a question, treat it as a hypothesis-audit: the missing line is almost always "therefore \(\tilde P=P_1\cup P_2\) refines both" or "by Prop 9".

**Cross-check list after marking.** Did Taylor get \(n=4\) where the fifth derivative bounds the error? Did every inverse-function computation evaluate \(f'\) at the **preimage**? Did the ε-partition proof name the accumulation point's interval separately? Did \(\ln\)'s derivative come from Theorem 16 rather than memory? Did every substitution change the **limits**?
