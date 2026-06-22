export interface Example {
  id: string
  difficulty: 'easy' | 'medium' | 'hard'
  title: string
  description: string
  solution: string
  steps?: string[]
}

export interface ConceptSection {
  id: string
  title: string
  content: string
  formula?: string
  examples?: Example[]
}

export interface Chapter {
  id: string
  number: number
  title: string
  description: string
  sections: ConceptSection[]
}

export const chapters: Chapter[] = [
  {
    id: 'ch1',
    number: 1,
    title: 'Introduction to Formal Languages',
    description:
      'Foundational concepts: alphabets, strings, languages, and set operations',
    sections: [
      {
        id: 'ch1-alphabets',
        title: 'Alphabets, Strings & Languages',
        content: `An **alphabet** (Σ) is a finite, nonempty set of symbols.

A **string** (or word) over Σ is a finite sequence of symbols from Σ. The **empty string** is denoted λ (or ε) and has length 0.

A **language** L over Σ is any subset of Σ* — the set of all strings over Σ.

**Key Notation:**
- |w| = length of string w
- Σ* = set of all strings including λ
- Σ+ = Σ* − {λ} (non-empty strings)
- wⁿ = w concatenated n times
- w^R = reversal of w`,
        formula: 'Σ* = {λ} ∪ Σ ∪ Σ² ∪ Σ³ ∪ …',
        examples: [
          {
            id: 'ex1-1',
            difficulty: 'easy',
            title: 'Identifying an Alphabet',
            description:
              'Let Σ = {0, 1}. List some strings in Σ* of length ≤ 2.',
            solution:
              'Σ* of length ≤ 2: {λ, 0, 1, 00, 01, 10, 11}\nΣ+ of length ≤ 2: {0, 1, 00, 01, 10, 11}',
          },
          {
            id: 'ex1-2',
            difficulty: 'medium',
            title: 'String Operations',
            description:
              'Given w = abba, find |w|, w^R, and w².',
            solution:
              '|w| = 4\nw^R = abba (palindrome!)\nw² = abbaabba',
          },
          {
            id: 'ex1-3',
            difficulty: 'hard',
            title: 'Language Concatenation',
            description:
              'Let L₁ = {a, ab} and L₂ = {b, ba}. Compute L₁L₂ and L₁*.',
            solution:
              'L₁L₂ = {ab, aba, abb, abba}\nL₁* = {λ, a, ab, aa, aab, aba, abab, aaa, …} (all strings formed by zero or more words from L₁)',
          },
        ],
      },
      {
        id: 'ch1-ops',
        title: 'Language Operations',
        content: `Languages support set and string operations:

**Set Operations:**
- Union: L₁ ∪ L₂ = {w | w ∈ L₁ or w ∈ L₂}
- Intersection: L₁ ∩ L₂ = {w | w ∈ L₁ and w ∈ L₂}
- Complement: L̄ = Σ* − L
- Difference: L₁ − L₂

**String/Language Operations:**
- Concatenation: L₁L₂ = {xy | x ∈ L₁, y ∈ L₂}
- Kleene Star: L* = L⁰ ∪ L¹ ∪ L² ∪ …
- Kleene Plus: L+ = L¹ ∪ L² ∪ L³ ∪ …
- Reversal: L^R = {w^R | w ∈ L}`,
        formula: 'L* = ⋃ Lⁿ for n ≥ 0',
      },
      {
        id: 'ch1-grammar-intro',
        title: 'Regular Expressions',
        content: `A **regular expression** over Σ defines a regular language. Every regex r denotes a language L(r).

**Primitive RE's:**
- ∅ → empty set
- λ → {λ}
- a (for a ∈ Σ) → {a}

**Compound RE's (given r, s are RE's):**
- r + s → L(r) ∪ L(s)  (union/alternation)
- rs   → L(r)L(s)      (concatenation)
- r*   → L(r)*         (Kleene star)
- (r)  → L(r)          (grouping)`,
        formula: 'L(r + s) = L(r) ∪ L(s)',
        examples: [
          {
            id: 'ex1-4',
            difficulty: 'easy',
            title: 'Basic Regex',
            description: 'What language does the regex (0+1)* describe?',
            solution:
              '(0+1)* = Σ* = all binary strings including λ\nExamples: λ, 0, 1, 00, 01, 10, 11, 000, ...',
          },
          {
            id: 'ex1-5',
            difficulty: 'medium',
            title: 'Regex for a Pattern',
            description:
              'Write a regex for all binary strings that start with 0 and end with 1.',
            solution:
              'r = 0(0+1)*1\nThis matches: 01, 001, 011, 0001, 0011, 0101, ...',
          },
          {
            id: 'ex1-6',
            difficulty: 'hard',
            title: 'Complex Regex',
            description:
              'Write a regex for binary strings with at least two consecutive 1s.',
            solution:
              'r = (0+1)*11(0+1)*\nThis matches any string with "11" as a substring.',
          },
        ],
      },
    ],
  },
  {
    id: 'ch2',
    number: 2,
    title: 'Finite Automata',
    description: 'DFA, NFA, and their equivalence; state diagrams and transition tables',
    sections: [
      {
        id: 'ch2-dfa',
        title: 'Deterministic Finite Automata (DFA)',
        content: `A **DFA** is a 5-tuple M = (Q, Σ, δ, q₀, F) where:
- **Q** — finite set of states
- **Σ** — input alphabet
- **δ: Q × Σ → Q** — transition function (total, deterministic)
- **q₀ ∈ Q** — start state
- **F ⊆ Q** — set of accepting (final) states

**How it works:** Start in q₀, read input left-to-right, follow δ. Accept if you end in a state in F.

**Extended transition δ̂:** δ̂(q, w) gives the state reached from q after reading string w.
- δ̂(q, λ) = q
- δ̂(q, wa) = δ(δ̂(q, w), a)

**Language accepted:** L(M) = {w ∈ Σ* | δ̂(q₀, w) ∈ F}`,
        formula: 'δ̂(q, wa) = δ(δ̂(q, w), a)',
        examples: [
          {
            id: 'ex2-1',
            difficulty: 'easy',
            title: 'DFA for strings ending in 1',
            description:
              'Build a DFA over {0,1} that accepts all strings ending in 1.',
            solution: `States: Q = {q₀, q₁}
Start: q₀, Accept: F = {q₁}
Transitions:
  δ(q₀, 0) = q₀   (stay in non-accept, saw 0)
  δ(q₀, 1) = q₁   (go to accept, saw 1)
  δ(q₁, 0) = q₀   (leave accept, saw 0)
  δ(q₁, 1) = q₁   (stay in accept, saw 1)

Accepts: 1, 01, 11, 001, 101, ...
Rejects: λ, 0, 10, 100, ...`,
          },
          {
            id: 'ex2-2',
            difficulty: 'medium',
            title: 'DFA for even number of 0s',
            description:
              'Design a DFA over {0,1} that accepts strings with an even number of 0s.',
            solution: `States: Q = {qeven, qodd}
Start: qeven (0 zeros → even), Accept: F = {qeven}
Transitions:
  δ(qeven, 0) = qodd
  δ(qeven, 1) = qeven
  δ(qodd,  0) = qeven
  δ(qodd,  1) = qodd

Accepts: λ, 1, 11, 00, 010, 100, 0011, ...`,
          },
          {
            id: 'ex2-3',
            difficulty: 'hard',
            title: 'DFA for strings where #a mod 3 = 0',
            description:
              'Design a DFA over {a,b} accepting strings where the number of a\'s is divisible by 3.',
            solution: `States: Q = {q₀, q₁, q₂} representing count mod 3
Start: q₀, Accept: F = {q₀}
Transitions:
  δ(q₀, a) = q₁   δ(q₀, b) = q₀
  δ(q₁, a) = q₂   δ(q₁, b) = q₁
  δ(q₂, a) = q₀   δ(q₂, b) = q₂

Accepts: λ, b, bb, aaa, aaab, aabba, ...`,
          },
        ],
      },
      {
        id: 'ch2-nfa',
        title: 'Nondeterministic Finite Automata (NFA)',
        content: `An **NFA** is a 5-tuple M = (Q, Σ, δ, q₀, F) where:
- **δ: Q × (Σ ∪ {λ}) → 2^Q** — transition function returns a *set* of states
- λ-transitions are allowed (move without reading input)

**Key differences from DFA:**
- Multiple transitions on the same symbol are allowed
- λ-transitions (ε-moves) are allowed
- A state may have no transition on some symbol

**Acceptance:** A string w is accepted if *at least one* path through the NFA leads to an accepting state.

**NFA → DFA (Subset Construction):**
Every NFA has an equivalent DFA. The DFA states correspond to subsets of NFA states. If the NFA has n states, the DFA has at most 2ⁿ states.`,
        formula: 'L(NFA) = L(DFA) — NFA and DFA are equivalent in power',
        examples: [
          {
            id: 'ex2-4',
            difficulty: 'easy',
            title: 'NFA with λ-transition',
            description:
              'Describe a simple NFA that uses λ-transitions.',
            solution: `NFA for L = {ab} ∪ {a}:
States: q₀ →(λ)→ q₁ →(a)→ q₂ →(b)→ q₃ [accept]
        q₀ →(a)→ q₄ [accept]

Using λ-transition, q₀ can spontaneously go to q₁ without reading input.`,
          },
          {
            id: 'ex2-5',
            difficulty: 'medium',
            title: 'NFA to DFA Conversion',
            description:
              'Convert the NFA for {strings ending in 01} to a DFA.',
            solution: `NFA states: {q₀, q₁, q₂}, Σ = {0,1}
δ_NFA: q₀→{q₀,q₁} on 0, q₀→{q₀} on 1, q₁→{q₂} on 1

Subset construction DFA states:
{q₀}: on 0→{q₀,q₁}, on 1→{q₀}
{q₀,q₁}: on 0→{q₀,q₁}, on 1→{q₀,q₂}
{q₀,q₂}: on 0→{q₀,q₁}, on 1→{q₀}  [ACCEPT - contains q₂]
{q₀,q₁,q₂}: similarly...`,
          },
          {
            id: 'ex2-6',
            difficulty: 'hard',
            title: 'Minimizing a DFA',
            description:
              'Minimize the DFA for strings over {a,b} not containing "aa" as a substring.',
            solution: `Step 1: Build DFA with states q₀(start), q₁(saw one a), q₂(dead/trap)
Step 2: Partition states: F={q₀,q₁}, non-F={q₂}
Step 3: Refine — q₀ and q₁ are distinguishable (on input "a": q₁→q₂ reject, q₀→q₁ not reject yet)
Step 4: Minimal DFA has 3 states — already minimal!

Transitions:
  δ(q₀, a)=q₁, δ(q₀, b)=q₀
  δ(q₁, a)=q₂, δ(q₁, b)=q₀
  δ(q₂, a)=q₂, δ(q₂, b)=q₂ [trap]`,
          },
        ],
      },
    ],
  },
  {
    id: 'ch3',
    number: 3,
    title: 'Regular Languages & Grammars',
    description: 'Regular grammars, pumping lemma, closure properties',
    sections: [
      {
        id: 'ch3-regular',
        title: 'Regular Grammars',
        content: `A **right-linear grammar** has all productions in the form:
- A → aB (or A → a)
- A → λ

A **left-linear grammar** has productions:
- A → Ba (or A → a)

Both generate exactly the **regular languages** (same class as DFA/NFA/regex).

**Chomsky Hierarchy:**
| Type | Grammar | Automaton |
|------|---------|-----------|
| 3 | Regular | DFA/NFA |
| 2 | Context-Free | PDA |
| 1 | Context-Sensitive | LBA |
| 0 | Unrestricted | TM |`,
        formula: 'Regular ⊂ CFL ⊂ CSL ⊂ Recursively Enumerable',
        examples: [
          {
            id: 'ex3-1',
            difficulty: 'easy',
            title: 'Right-Linear Grammar',
            description:
              'Write a right-linear grammar for L = {aⁿb | n ≥ 1}.',
            solution: `G = ({S, A}, {a, b}, P, S)
Productions:
  S → aA
  A → aA | b

Derivation of "aaab":
S → aA → aaA → aaaA → aaab ✓`,
          },
          {
            id: 'ex3-2',
            difficulty: 'medium',
            title: 'Grammar to DFA',
            description:
              'Convert the right-linear grammar S → aS | bA, A → a to a DFA.',
            solution: `From grammar productions, each non-terminal = DFA state:
States: S (start), A, qf (accept for terminal productions)
  δ(S, a) = S  (from S → aS)
  δ(S, b) = A  (from S → bA)
  δ(A, a) = qf (from A → a)

Accepts: ba, aba, aaba, aaaba, ...`,
          },
          {
            id: 'ex3-3',
            difficulty: 'hard',
            title: 'Pumping Lemma (Non-Regular)',
            description:
              'Prove that L = {aⁿbⁿ | n ≥ 0} is not regular using the Pumping Lemma.',
            solution: `Assume L is regular with pumping length p.
Choose s = aᵖbᵖ ∈ L, |s| = 2p ≥ p ✓

By Pumping Lemma, s = xyz where |xy| ≤ p and |y| ≥ 1.
Since |xy| ≤ p, xy consists only of a's.
So y = aᵏ for some k ≥ 1.

Pump with i=0: xy⁰z = a^(p-k) bᵖ
But p-k ≠ p (since k ≥ 1), so xy⁰z ∉ L.
Contradiction! ∴ L is NOT regular. ■`,
          },
        ],
      },
      {
        id: 'ch3-closure',
        title: 'Closure Properties',
        content: `Regular languages are **closed** under:
- **Union:** L₁ ∪ L₂ (construct DFAs in parallel)
- **Concatenation:** L₁L₂ 
- **Kleene star:** L*
- **Complement:** L̄ (swap accept/reject states in DFA)
- **Intersection:** L₁ ∩ L₂ (product construction)
- **Difference:** L₁ − L₂ = L₁ ∩ L̄₂
- **Reversal:** L^R
- **Homomorphism** and **inverse homomorphism**

These closure properties are useful to prove a language IS regular (by building from known regular languages) or IS NOT regular (via Pumping Lemma).`,
      },
    ],
  },
  {
    id: 'ch4',
    number: 4,
    title: 'Context-Free Languages',
    description: 'CFGs, parse trees, ambiguity, PDAs, and CFL properties',
    sections: [
      {
        id: 'ch4-cfg',
        title: 'Context-Free Grammars (CFGs)',
        content: `A **CFG** is a 4-tuple G = (V, T, P, S) where:
- **V** — finite set of variables (non-terminals)
- **T** — finite set of terminals (T ∩ V = ∅)
- **P** — finite set of productions: A → α (A ∈ V, α ∈ (V ∪ T)*)
- **S ∈ V** — start variable

**Derivation:** S ⟹* w means w is derived from S.

**Language:** L(G) = {w ∈ T* | S ⟹* w}

**Parse Tree:** A rooted, ordered tree where:
- Root is labeled S
- Interior nodes are variables
- Leaves are terminals (or λ)
- For each node A with children X₁X₂…Xₖ: A → X₁X₂…Xₖ ∈ P

**Ambiguity:** G is ambiguous if some w ∈ L(G) has two distinct parse trees.`,
        formula: 'L(G) = {w ∈ T* | S ⟹* w}',
        examples: [
          {
            id: 'ex4-1',
            difficulty: 'easy',
            title: 'Simple CFG',
            description:
              'Write a CFG for L = {aⁿbⁿ | n ≥ 0}.',
            solution: `G = ({S}, {a,b}, {S → aSb | λ}, S)

Derivation of "aabb":
S → aSb → aaSbb → aabb ✓

Parse tree:
     S
   / | \
  a  S  b
   / | \
  a  S  b
     |
     λ`,
          },
          {
            id: 'ex4-2',
            difficulty: 'medium',
            title: 'Arithmetic Expressions CFG',
            description:
              'Write an unambiguous CFG for arithmetic expressions with +, *, and parentheses.',
            solution: `E → E + T | T
T → T * F | F
F → (E) | id | num

This grammar enforces precedence: * binds tighter than +
For "a + b * c":
E → E+T → T+T → F+T → id+T → id+T*F → id+F*F → id+id*id`,
          },
          {
            id: 'ex4-3',
            difficulty: 'hard',
            title: 'Pumping Lemma for CFLs',
            description:
              'Prove that L = {aⁿbⁿcⁿ | n ≥ 0} is not context-free.',
            solution: `Assume L is CFL with pumping length p.
Choose s = aᵖbᵖcᵖ, |s| = 3p ≥ p ✓

By CFL Pumping Lemma, s = uvxyz where:
  |vy| ≥ 1, |vxy| ≤ p

Since |vxy| ≤ p, vxy cannot span all three of a, b, c blocks.
So vxy falls in at most two adjacent blocks (ab or bc).

Case 1: vxy in aᵖbᵖ — pump up (i=2): more a's and/or b's but same c's → not in L
Case 2: vxy in bᵖcᵖ — pump up (i=2): more b's and/or c's but same a's → not in L

In all cases, uv²xy²z ∉ L. Contradiction! ∴ L is not CFL. ■`,
          },
        ],
      },
      {
        id: 'ch4-pda',
        title: 'Pushdown Automata (PDAs)',
        content: `A **PDA** is a 7-tuple M = (Q, Σ, Γ, δ, q₀, z, F) where:
- **Γ** — stack alphabet
- **z ∈ Γ** — initial stack symbol
- **δ: Q × (Σ ∪ {λ}) × Γ → finite subsets of Q × Γ***

**Transition:** (q, a, A) → (p, γ) means:
- In state q, reading a (or λ), with A on top of stack
- Move to state p, replace A with γ (push γ, or pop if γ=λ)

**Acceptance:** By final state OR by empty stack.

**Key theorem:** L is context-free ⟺ L is accepted by some PDA.`,
        formula: 'CFL ↔ PDA',
      },
    ],
  },
  {
    id: 'ch5',
    number: 5,
    title: 'Turing Machines',
    description: 'TM model, halting, configurations, and computability',
    sections: [
      {
        id: 'ch5-tm-def',
        title: 'Turing Machine Definition',
        content: `A **Turing Machine** is a 7-tuple M = (Q, Σ, Γ, δ, q₀, q_accept, q_reject):
- **Q** — finite set of states
- **Σ** — input alphabet (not containing blank ⊔)
- **Γ** — tape alphabet, Σ ⊆ Γ, ⊔ ∈ Γ
- **δ: Q × Γ → Q × Γ × {L, R}** — transition function
- **q₀** — start state
- **q_accept** — accept state
- **q_reject** — reject state (q_accept ≠ q_reject)

**Tape:** Infinite in both directions, initially contains input surrounded by blanks.

**Each step:**
1. Read current symbol
2. Write a new symbol
3. Move head Left or Right`,
        formula: 'δ(q, a) = (p, b, R) means: state q→p, write b, move Right',
        examples: [
          {
            id: 'ex5-1',
            difficulty: 'easy',
            title: 'TM for {a*}',
            description:
              'Design a TM over {a, b} that accepts all strings consisting only of a\'s.',
            solution: `States: Q = {q₀, q_accept, q_reject}
Transitions:
  δ(q₀, a) = (q₀, a, R)    // keep reading a's
  δ(q₀, ⊔) = (q_accept, ⊔, R) // blank → accept (all a's)
  δ(q₀, b) = (q_reject, b, R)  // b found → reject

Accepts: λ, a, aa, aaa, ...
Rejects: b, ab, ba, abb, ...`,
          },
          {
            id: 'ex5-2',
            difficulty: 'medium',
            title: 'TM for {aⁿbⁿ}',
            description:
              'Describe the strategy for a TM accepting {aⁿbⁿ | n ≥ 0}.',
            solution: `Strategy: Match a's with b's one by one.
1. Scan right to find leftmost unmarked a → mark it with X
2. Continue right to find leftmost unmarked b → mark it with Y
3. Return left to start of tape
4. Repeat until no more a's → check no more b's remain
5. Accept if tape has only X's and Y's (no unmarked a's or b's)

States needed: q₀ (scan a), q₁ (find b), q₂ (go left), q₃ (check), q_accept, q_reject
This TM has Θ(n²) time complexity.`,
          },
          {
            id: 'ex5-3',
            difficulty: 'hard',
            title: 'TM Configuration Trace',
            description:
              'Trace the TM for {aⁿbⁿ} on input "ab".',
            solution: `Tape: ...⊔ a b ⊔...
              ↑q₀

Step 1: δ(q₀, a) = (q₁, X, R)
Tape: ...⊔ X b ⊔...    state: q₁
          ↑

Step 2: δ(q₁, b) = (q₂, Y, L)
Tape: ...⊔ X Y ⊔...    state: q₂
            ↑

Step 3: δ(q₂, X) = (q₀, X, R)
Tape: ...⊔ X Y ⊔...    state: q₀
          ↑

Step 4: δ(q₀, Y) = (q₀, Y, R)
Tape: ...⊔ X Y ⊔...    state: q₀
            ↑

Step 5: δ(q₀, ⊔) = (q_accept, ⊔, R)
→ ACCEPT! ✓`,
          },
        ],
      },
      {
        id: 'ch5-halting',
        title: 'Halting & Acceptance',
        content: `**Three outcomes for a TM on input w:**
1. **Accept** — TM enters q_accept
2. **Reject** — TM enters q_reject (or gets stuck with no valid transition in a non-halting TM)
3. **Loop** — TM never halts (infinite computation)

**Turing-Recognizable (Recursively Enumerable):** ∃ TM that accepts exactly L.
(May loop on non-members)

**Turing-Decidable (Recursive):** ∃ TM that always halts and decides L.

**The Halting Problem:** Is it decidable whether a TM M halts on input w?
→ **NO!** The Halting Problem is undecidable (proven by diagonalization).

**Reduction:** If we could decide A_TM, we could decide the Halting Problem, which is impossible.`,
        formula: 'Decidable ⊂ Recognizable ⊂ All Languages',
        examples: [
          {
            id: 'ex5-4',
            difficulty: 'easy',
            title: 'Recognizable vs Decidable',
            description:
              'Give an example of a Turing-recognizable language that is not decidable.',
            solution: `A_TM = {<M, w> | TM M accepts w}

This is Turing-recognizable:
  - Simulate M on w
  - If M accepts w → accept <M, w>
  - If M rejects w → reject <M, w>
  - If M loops → we loop (never reach a halting state)

But A_TM is NOT decidable: no TM can decide in all cases whether M halts and accepts.`,
          },
          {
            id: 'ex5-5',
            difficulty: 'medium',
            title: 'Diagonalization Sketch',
            description:
              'Why is the Halting Problem undecidable?',
            solution: `Assume H is a decider for HALT_TM = {<M,w> | M halts on w}.

Build decider D:
  Input: <M>
  1. Run H on <M, <M>>
  2. If H accepts: LOOP FOREVER
  3. If H rejects: ACCEPT

What happens when D is run on input <D>?
  - If D accepts <D> → H accepted <D,<D>>, meaning D halts on <D>
    But D loops when H accepts → contradiction!
  - If D loops on <D> → H rejected <D,<D>>, meaning D doesn't halt on <D>
    But D is supposed to loop (it does halt... by looping? No, it never halts)

Contradiction in both cases → H cannot exist → HALT is undecidable. ■`,
          },
          {
            id: 'ex5-6',
            difficulty: 'hard',
            title: 'Reduction Proof',
            description:
              'Show that the Empty TM problem E_TM = {<M> | L(M) = ∅} is undecidable.',
            solution: `Reduce A_TM to E_TM: if E_TM were decidable, so would A_TM be.

Given <M, w>, construct TM M':
  M' on input x:
    1. Ignore x
    2. Simulate M on w
    3. If M accepts w, ACCEPT

Observe:
  - If M accepts w: M' accepts every x → L(M') = Σ* ≠ ∅
  - If M rejects/loops on w: M' never accepts → L(M') = ∅

So: M accepts w ⟺ L(M') ≠ ∅ ⟺ <M'> ∉ E_TM

A decider for E_TM would decide A_TM → impossible.
∴ E_TM is undecidable. ■`,
          },
        ],
      },
      {
        id: 'ch5-variants',
        title: 'TM Variants & Church-Turing Thesis',
        content: `**Standard TM** can be extended without gaining more power:
- **Multi-tape TM:** Multiple tapes and heads (but equivalent to standard TM)
- **Nondeterministic TM (NTM):** Multiple choices per transition; accepts if any branch accepts
- **Enumerator:** Prints/enumerates all strings in L

**Equivalences:**
- Every multi-tape TM has an equivalent single-tape TM
- Every NTM has an equivalent deterministic TM
- L is Turing-recognizable ⟺ some enumerator enumerates L

**Church-Turing Thesis:** Any algorithm can be implemented as a Turing machine. 
This is not a theorem but a thesis — widely accepted based on evidence.

**Time Complexity:**
- P: decidable in polynomial time (on a deterministic TM)
- NP: decidable in polynomial time (on a nondeterministic TM)
- The P vs NP question is one of the greatest open problems in CS!`,
        formula: 'P ⊆ NP ⊆ PSPACE ⊆ EXPTIME',
      },
    ],
  },
  {
    id: 'ch6',
    number: 6,
    title: 'Decidability & Complexity',
    description: 'Decidable problems, reductions, Rice\'s theorem, and complexity classes',
    sections: [
      {
        id: 'ch6-decidable',
        title: 'Decidable Problems',
        content: `**Problems about DFAs/NFAs (decidable):**
- A_DFA: Does DFA M accept w? → Simulate, O(|w|) time
- E_DFA: Is L(DFA) = ∅? → BFS/DFS from start state
- EQ_DFA: Do two DFAs accept the same language? → Minimize both, check isomorphism

**Problems about CFGs (decidable):**
- A_CFG: Does CFG G generate w? → CYK algorithm O(|G|·|w|³)
- E_CFG: Is L(CFG) = ∅? → Check if start var generates terminal string
- EVERY_CFG: Is L(CFG) = Σ*? → **UNDECIDABLE**

**Rice's Theorem:** Any non-trivial property of the language of a TM is undecidable.
- "Non-trivial" = some TMs have it, some don't
- This makes most TM language properties undecidable!`,
        formula: "Rice's Theorem: any non-trivial semantic TM property is undecidable",
        examples: [
          {
            id: 'ex6-1',
            difficulty: 'easy',
            title: 'Deciding A_DFA',
            description: 'Explain why A_DFA = {<M, w> | M is a DFA that accepts w} is decidable.',
            solution: `Algorithm:
  Input: <M, w> where M is a DFA and w is a string
  1. Simulate M on w
  2. If M ends in an accept state: ACCEPT
  3. Otherwise: REJECT

Since M is a DFA (deterministic, total), the simulation always terminates after |w| steps.
Time: O(|w| × |Q|)
∴ A_DFA is decidable. ✓`,
          },
          {
            id: 'ex6-2',
            difficulty: 'medium',
            title: 'Applying Rice\'s Theorem',
            description:
              'Is it decidable whether a TM accepts any string of even length?',
            solution: `Property P: L(M) contains at least one string of even length.

Is P trivial? 
  - TM that accepts Σ* has P (contains "aa")
  - TM that accepts nothing ∅ doesn't have P
So P is non-trivial.

P is a semantic property (depends only on L(M), not on M's structure).

By Rice's Theorem: P is undecidable. ✗`,
          },
          {
            id: 'ex6-3',
            difficulty: 'hard',
            title: 'Reduction: HALT to E_TM',
            description:
              'Use a reduction to show E_TM is not Turing-recognizable.',
            solution: `We show that Ā_TM ≤_m E_TM (A_TM complement reduces to E_TM).

Ā_TM is not recognizable (since A_TM is recognizable but not decidable, its complement is not recognizable).

If E_TM were recognizable, then Ā_TM would be recognizable (via the reduction), contradiction.

Reduction function f: <M, w> → <M'>
where M' simulates M on w; if M accepts → accepts everything, else → accepts nothing.

Then: <M, w> ∈ Ā_TM ⟺ M doesn't accept w ⟺ L(M') = ∅ ⟺ <M'> ∈ E_TM

∴ E_TM is not Turing-recognizable. ■`,
          },
        ],
      },
      {
        id: 'ch6-complexity',
        title: 'Complexity Classes',
        content: `**TIME(t(n)):** Class of languages decidable in O(t(n)) time on a single-tape deterministic TM.

**P = ⋃ TIME(nᵏ):** Polynomial-time decidable — considered "efficiently solvable."

**NP:** Nondeterministically polynomial-time. Alternatively: problems whose solutions can be verified in polynomial time.

**NP-Complete:** A problem X is NP-complete if:
1. X ∈ NP
2. Every NP problem reduces to X in polynomial time

**Key NP-Complete Problems:**
- SAT (Boolean Satisfiability) — first NP-complete problem (Cook-Levin theorem)
- 3-SAT, Graph 3-Coloring, Hamiltonian Path, Clique, Vertex Cover, Subset Sum...

**P vs NP:** Is P = NP? This is the **$1 million Millennium Prize Problem**. Most believe P ≠ NP.`,
        formula: 'NP-complete: hardest problems in NP',
      },
    ],
  },
]

export const difficultyColors = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
}
