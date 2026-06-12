/* Section: Interview Preparation — edit ONLY this file.
   Each bank is a lesson. The Core Java bank has a starter set of
   answered questions; the rest are scaffolded to fill over time. */

function qbankScaffold(label) {
  return [{ id: "questions", heading: label,
    body: `<p class="placeholder">📝 <em>${label}</em> — questions and answers coming soon.</p>` }];
}

registerSection({
  id: "interview",
  module: "Interview Preparation",
  page: "interview-prep.html",
  icon: "🎯",
  tagline: "Question banks and patterns for service and product companies.",
  lessons: [

    lesson({
      id: "core-java", chapter: "Q1", title: "300 Core Java Questions",
      subtitle: "Fundamentals, OOP, memory, and the JVM.",
      icon: "☕", tag: "Starter set below", level: "Q-Bank",
      sections: [
        { id: "basics", heading: "Basics (sample)", md:
`**1. Why is Java platform independent?**
Source compiles to bytecode; the platform-specific JVM runs it, so the same \`.class\` runs anywhere.

**2. Is Java pure object-oriented?**
No — it has primitive types (\`int\`, \`char\`, …) that aren't objects.

**3. Difference between JDK, JRE, and JVM?**
JVM runs bytecode; JRE = JVM + libraries (run-only); JDK = JRE + dev tools (build + run).

**4. \`==\` vs \`.equals()\`?**
\`==\` compares references (identity); \`.equals()\` compares logical value (when overridden, e.g. for \`String\`).

**5. What is autoboxing?**
Automatic conversion between primitives and their wrapper classes (\`int\` ⇄ \`Integer\`).` },

        { id: "oop-memory", heading: "OOP & Memory (sample)", md:
`**6. Method overloading vs overriding?**
Overloading = same name, different parameters, compile-time. Overriding = subclass redefines a superclass method, runtime (dynamic dispatch).

**7. Why is \`String\` immutable?**
Security, thread-safety, hashcode caching, and safe sharing via the string pool.

**8. Stack vs heap?**
Stack = per-thread frames/locals (auto-freed); heap = shared objects (GC-managed).

**9. What is the \`final\` keyword?**
\`final\` variable = constant; \`final\` method = can't be overridden; \`final\` class = can't be extended.

**10. What causes a memory leak in Java despite GC?**
Holding references you no longer need (e.g. static collections, unclosed resources, listeners not removed).` },

        { id: "more", heading: "Coming next", md:
`The full bank of **300** grows here — covering generics, equals/hashCode contracts, immutability, exception design, and JVM internals, grouped basic → advanced.` },
      ]
    }),

    lesson({ id: "java8", chapter: "Q2", title: "100 Java 8 Questions",
      subtitle: "Lambdas, streams, functional interfaces, Optional.",
      icon: "⚡", tag: "100 questions", level: "Q-Bank",
      sections: qbankScaffold("Java 8 Questions") }),

    lesson({ id: "collections", chapter: "Q3", title: "100 Collections Questions",
      subtitle: "List, Set, Map internals and trade-offs.",
      icon: "🗃️", tag: "100 questions", level: "Q-Bank",
      sections: qbankScaffold("Collections Questions") }),

    lesson({ id: "multithreading", chapter: "Q4", title: "50 Multithreading Questions",
      subtitle: "Threads, synchronization, executors, concurrency.",
      icon: "🧵", tag: "50 questions", level: "Q-Bank",
      sections: qbankScaffold("Multithreading Questions") }),

    lesson({ id: "scenario", chapter: "Q5", title: "Scenario-Based Questions",
      subtitle: "\"What would you do if…\" design and debugging scenarios.",
      icon: "🧩", tag: "Patterns", level: "Q-Bank",
      sections: qbankScaffold("Scenario-Based Questions") }),

    lesson({ id: "coding", chapter: "Q6", title: "Coding Questions",
      subtitle: "Hands-on problems frequently asked in rounds.",
      icon: "💻", tag: "Problems", level: "Q-Bank",
      sections: qbankScaffold("Coding Questions") }),

    lesson({ id: "system-design", chapter: "Q7", title: "System Design Basics",
      subtitle: "Foundations for HLD/LLD discussions.",
      icon: "🏗️", tag: "Foundations", level: "Q-Bank",
      sections: qbankScaffold("System Design Basics") }),
  ]
});
