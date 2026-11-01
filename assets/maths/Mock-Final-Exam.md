# MATH2016 — Mock Final Examination (2026)

**Time:** 1 hour 30 minutes **Marks:** 60

**Instructions.** (1) Write your answers clearly. (2) When referring to a result, follow the numbering given in the appendix (`Appendix-exam.pdf`, Proposition 1 – Theorem 16). (3) You are expected to be familiar with the definitions and hypotheses of the relevant theorems, and to construct clear mathematical arguments. (4) Answers without justification receive no credit; a correct final number with no argument is worth at most half the marks for that step.

*Sit this closed-book, timed, in one pass. Then mark yourself with `Mock-Final-Exam-Memorandum.md`, which allocates marks step by step.*

---

## Question 1 (6 marks)

(a) Let \(I\) be an interval, \(f:I\to\mathbb{R}\) and \(c\in I\). State precisely the definition of *\(f\) is differentiable at \(c\)*, and of \(f'(c)\). **(2)**

(b) Let \(f:[a,b]\to\mathbb{R}\) be a bounded function. State precisely what it means for \(f\) to be **Riemann integrable** on \([a,b]\), using the lower and upper integrals. **(2)**

(c) Fill in the blanks. Let \(f:[a,b]\to\mathbb{R}\) be bounded and let \(P\) be a partition of \([a,b]\).

  (i) If \(\tilde P\) is a refinement of \(P\), then \(L(P,f)\;\_\_\_\;L(\tilde P,f)\) and \(U(\tilde P,f)\;\_\_\_\;U(P,f)\). **(1)**

  (ii) (Proposition 11.) \(f\) is Riemann integrable on \([a,b]\) if and only if for every \(\varepsilon>0\) there exists a partition \(P\) of \([a,b]\) such that ______________________________________. **(1)**

---

## Question 2 (5 marks)

Let \(f:[0,1]\to\mathbb{R}\) be given by \(f(x)=x^{2}\) and let \(P=\left\{0,\tfrac12,\tfrac34,1\right\}\).

(a) For each subinterval determined by \(P\), state \(m_i=\inf f\) and \(M_i=\sup f\), **giving a reason**, and hence compute \(L(P,f)\) and \(U(P,f)\). **(3)**

(b) Let \(\tilde P=P\cup\left\{\tfrac13\right\}\). Without computing any sums, state what Proposition 9 guarantees about \(L(\tilde P,f)\) compared with \(L(P,f)\), and about \(U(\tilde P,f)\) compared with \(U(P,f)\). **(1)**

(c) Explain why the requirement that \(f\) be **bounded** is needed in order that the numbers \(\underline{\int_a^b}f\) and \(\overline{\int_a^b}f\) be well-defined real numbers. **(1)**

---

## Question 3 (6 marks)

State whether each statement is **true or false**. One or two sentences of justification are required: either a short proof, or a specific function that settles the case.

(a) If \(f\) is differentiable at \(c\), then \(f'\) is continuous at \(c\).

(b) If \(f\) is differentiable at \(c\), then \(f\) is continuous at \(c\).

(c) If \(f:[a,b]\to\mathbb{R}\) is Riemann integrable, then \(|f|\) is Riemann integrable on \([a,b]\).

(d) If \(f:[a,b]\to\mathbb{R}\) is Riemann integrable, \(f\ge0\) and \(\int_a^b f=0\), then \(f(x)=0\) for every \(x\in[a,b]\).

(e) If \(f:(a,b)\to\mathbb{R}\) is differentiable and \(f'(x)\neq0\) for every \(x\in(a,b)\), then \(f'\) is either everywhere positive or everywhere negative on \((a,b)\).

(f) If \(f:[a,b]\to\mathbb{R}\) is monotone, then \(f\) is Riemann integrable on \([a,b]\).

---

## Question 4 (8 marks)

(a) Let \(g:(0,\infty)\to\mathbb{R}\), \(g(x)=1/x\). **By means of the definition of the derivative**, prove that \(g\) is differentiable at \(2\) and that \(g'(2)=-\tfrac14\). **(4)**

(b) Let \(f:\mathbb{R}\to\mathbb{R}\) satisfy \(|f(x)|\le x^{2}\) for every \(x\in\mathbb{R}\). Prove, from the definition, that \(f\) is differentiable at \(0\) and that \(f'(0)=0\). **(4)**

---

## Question 5 (9 marks)

(a) State Rolle's Theorem (Theorem 3) with all of its hypotheses. **(2)**

(b) Let \(f:[0,1]\to\mathbb{R}\) be continuous on \([0,1]\), differentiable on \((0,1)\), with \(f(0)=f(1)=0\). Prove that there exists \(c\in(0,1)\) such that
\[
f'(c)=2c\,f(c).
\]
**(4)**

(c) Prove that the equation \(x^{5}+3x-1=0\) has **exactly one** real solution. **(3)**

---

## Question 6 (7 marks)

(a) Let \(f:[1,3]\to\mathbb{R}\) be differentiable with \(f'(1)=2\) and \(f'(3)=7\). State precisely what Darboux's Theorem (Theorem 7) guarantees about the equation \(f'(x)=5\), and state the hypothesis of the theorem that is needed for that guarantee. **(2)**

(b) Let \(f:[0,1]\to\mathbb{R}\) be given by
\[
f(x)=\begin{cases}1,&x=\tfrac12,\\ 0,&x\neq\tfrac12.\end{cases}
\]
Prove, **using Proposition 11**, that \(f\) is Riemann integrable on \([0,1]\). **(4)**

(c) Does Lemma 14 justify the conclusion of part (b)? Answer yes or no and explain in one sentence. **(1)**

---

## Question 7 (10 marks)

(a) State Theorem 15 (the First Fundamental Theorem of Calculus) with all of its hypotheses. **(2)**

(b) Let \(H(x)=\displaystyle\int_{x^{2}}^{x^{3}}\frac{dt}{1+t^{2}}\). Compute \(H'(x)\), justifying each step by naming the result you use. **(3)**

(c) Let \(f:[a,b]\to\mathbb{R}\) be continuous and suppose that
\[
\int_a^x f(t)\,dt=\int_x^b f(t)\,dt\qquad\text{for every }x\in[a,b].
\]
Prove that \(f(x)=0\) for every \(x\in[a,b]\). **(3)**

(d) Let \(f:[0,1]\to\mathbb{R}\) be continuous and define \(F(x)=\displaystyle\int_0^x (x-t)f(t)\,dt\) for \(x\in[0,1]\). Show that \(F\) is differentiable and compute \(F'(x)\); hence show that if \(f\) is differentiable, then \(F''(x)=f(x)\). **(2)**

---

## Question 8 (9 marks)

(a) State the Change of Variables Theorem with all of its hypotheses, and use it to compute \(\displaystyle\int_0^1 x\bigl(1-x^{2}\bigr)^{5}\,dx\). **(3)**

(b) Compute \(\displaystyle\int_0^{\sqrt{\pi/2}} x\cos\bigl(x^{2}\bigr)\,dx\). **(2)**

(c) Compute \(\displaystyle\int_0^1 x\ln(1+x)\,dx\). State and justify the method you use. **(3)**

(d) A student writes: "With the substitution \(s=\ln|x|\), \(\displaystyle\int_{-1}^{1}\frac{\ln|x|}{x}\,dx=\int_{0}^{0}s\,ds=0\)." Explain carefully why this reasoning is invalid. **(1)**

---

**End of paper.**

Marks: 60 in 90 minutes ⇒ roughly 1 minute per mark, with the definitions in Question 1 and the true/false in Question 3 worth banking in the first ten minutes.
