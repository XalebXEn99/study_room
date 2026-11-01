# MATH2016 — Mock Final Examination B (2026)

**Time:** 1 hour 30 minutes **Marks:** 60

**Instructions.** (1) Write your answers clearly. (2) When referring to a result, follow the numbering given in the appendix (`Appendix-exam.pdf`, Proposition 1 – Theorem 16). (3) You are expected to be familiar with the definitions and hypotheses of the relevant theorems, and to construct clear mathematical arguments. (4) Results **not** in the appendix (Taylor's Theorem, the second derivative test, the inverse-function derivative formula as a corollary, linearity of the integral, the change-of-variables theorem, integration by parts, the mean value theorem for integrals) must be **stated before use**.

*Paper B targets what `Mock-Final-Exam.md` does not: Taylor and higher derivatives, the inverse function theorem, `ln` defined by an integral, the non-refinement trap, and a hard ε-partition proof. Sit it closed-book, timed, in one pass; mark with `Mock-Final-Exam-B-Memorandum.md`.*

---

## Question 1 (7 marks)

(a) State Taylor's Theorem (the Lagrange form of the remainder) with **all** of its hypotheses, exactly as in the lectures. **(2)**

(b) Take \(f(x)=e^{x}\) on \([0,1]\) and \(x_{0}=0\). Write down \(P^{3}_{0}(x)\) and hence, using Taylor's Theorem, prove
\[
0<e-\tfrac83<\tfrac18 .
\]
**(3)**

(c) Prove that for every \(x\in\mathbb{R}\),
\[
\left|\sin x-\left(x-\frac{x^{3}}{6}\right)\right|\le \frac{|x|^{5}}{120}.
\]
**(2)**

---

## Question 2 (8 marks)

(a) State the Second Derivative Test as proved in the lectures, with all hypotheses, and define *strict relative minimum*. **(3)**

(b) Prove the test, using Taylor's Theorem. **(3)**

(c) Classify the critical points of \(f(x)=x^{4}-x^{2}\) as fully as the test allows, and give **three** functions showing that when \(f''(x_{0})=0\) the test says nothing (one with a minimum, one with a maximum, one with neither). **(2)**

---

## Question 3 (7 marks)

(a) State the Inverse Function Theorem (Theorem 6) with all of its hypotheses, including the formula for \(g'(y)\). **(2)**

(b) Let \(f(x)=x^{3}+x\). Justify that \(f\) is one-to-one and onto \(\mathbb{R}\), and compute \(\left(f^{-1}\right)'(2)\). Name every result you use. **(3)**

(c) For \(n\in\mathbb{N}\), let \(g(y)=y^{1/n}\) on \((0,\infty)\). Deduce from Theorem 6 that \(g\) is differentiable and that \(g'(y)=\frac1n y^{\frac1n-1}\). **(2)**

---

## Question 4 (7 marks)

(a) Let \(f:\mathbb{R}\to\mathbb{R}\) be differentiable with \(f'(x)=f(x)\) for every \(x\) and \(f(0)=1\). Prove that \(f(x)=e^{x}\) for all \(x\). **(3)**

(b) Let \(f,g:[a,b]\to\mathbb{R}\) be differentiable with \(f'(x)=g'(x)\) for all \(x\in(a,b)\) and \(f(a)=g(a)\). Prove \(f\equiv g\) on \([a,b]\). **(2)**

(c) The chain rule requires \(g\) differentiable at \(c\) **and** \(f\) differentiable at \(g(c)\). Give an example in which \(f\circ g\) **is** differentiable at \(c\) even though \(f\) is not differentiable at \(g(c)\). Explain what this says about the converse of the chain rule. **(2)**

---

## Question 5 (8 marks)

(a) Let \(g:[0,1]\to\mathbb{R}\), \(g(x)=x\), and let \(P_{n}=\left\{0,\tfrac1n,\tfrac2n,\dots,1\right\}\) be the uniform partition. State \(m_i\) and \(M_i\) on the \(i\)-th subinterval **with a reason**, compute \(L(P_{n},g)\) and \(U(P_{n},g)\), and prove **without using antiderivatives** that \(g\) is Riemann integrable on \([0,1]\) with \(\int_0^1 g=\tfrac12\). **(3)**

(b) Let \(h=\mathbf{1}_{[1/2,\,3/4]}\) on \([0,1]\), \(P_{4}=\{0,\tfrac14,\tfrac12,\tfrac34,1\}\) and \(P_{5}=\{0,\tfrac15,\tfrac25,\tfrac35,\tfrac45,1\}\). Compute \(L(P_{4},h)\), \(U(P_{4},h)\), \(L(P_{5},h)\), \(U(P_{5},h)\), and explain why the fact that \(L(P_{5},h)<L(P_{4},h)\) does **not** contradict Proposition 9. **(3)**

(c) Let \(\phi=\mathbf{1}_{\mathbb{Q}}\) on \([0,1]\). Prove that \(L(P,\phi)=0\) and \(U(P,\phi)=1\) for **every** partition \(P\), and conclude that \(\phi\notin\mathcal{R}[0,1]\). **(2)**

---

## Question 6 (8 marks)

Let \(f:[0,1]\to\mathbb{R}\) be given by \(f(0)=0\), \(f(1/n)=1/n\) for \(n\in\mathbb{N}\), and \(f(x)=0\) whenever \(x\notin\{0\}\cup\{1/n:n\in\mathbb{N}\}\).

(a) Prove that \(f\) is bounded. **(1)**

(b) Prove, **using Proposition 11**, that \(f\) is Riemann integrable on \([0,1]\). **(4)**

(c) Conclude that \(\displaystyle\int_0^1 f=0\). **(1)**

(d) State and prove the inequality \(\left|\int_a^b f\right|\le\int_a^b|f|\) for \(f\in\mathcal{R}[a,b]\), naming each result used. **(2)**

---

## Question 7 (8 marks)

(a) State Theorem 16 (the Second Form of the Fundamental Theorem of Calculus) exactly, including the conclusion about continuity of \(F\). **(2)**

(b) Following the lectures, the natural logarithm is **defined** by
\[
\ln x:=\int_{1}^{x}\frac{ds}{s}\qquad(x>0).
\]
Prove that \(\ln(xy)=\ln x+\ln y\) for all \(x,y>0\). **(4)**

(c) Compute \(\dfrac{d}{dx}\displaystyle\int_{0}^{x^{2}}e^{-t^{2}}\,dt\), justifying each step. **(2)**

---

## Question 8 (7 marks)

(a) Let \(f:[a,b]\to\mathbb{R}\) be continuous. State the Mean Value Theorem for Integrals and prove it. You may not assume it: the proof is a short chain of appendix results. **(4)**

(b) Let \(f\) be integrable on \([-a,a]\) and suppose \(f\) is **odd**, i.e. \(f(-x)=-f(x)\) for all \(x\). Prove that \(\displaystyle\int_{-a}^{a}f(x)\,dx=0\). **(3)**

---

**End of paper.**

Marks: 60 in 90 minutes. Question 6(a), 7(c), 3(b)'s final computation and 2(c) are quick marks; Question 5(a), 6(b) and 7(b) are the long proofs — budget 10 minutes each and do not let them eat Question 1.
