/* Module: Java Fundamentals — edit ONLY this file for this module. */
registerModule({
  id: "java-fundamentals",
  module: "Java Fundamentals",
  page: "module-java-fundamentals.html",
  icon: "☕",
  tagline: "Syntax, types, and control flow — the bedrock of every program.",
  lessons: [
    {
      id: "first-program",
      title: "Your First Java Program",
      subtitle: "Anatomy of a Java class, compilation, and the JVM.",
      readTime: "10 min",
      level: "Beginner",
      objectives: [
        "Placeholder objective — read and explain a minimal Java program.",
        "Placeholder objective — compile and run from the command line."
      ],
      sections: [
        { id: "hello-world", heading: "Hello, World explained", level: 2,
          body: `<p class="placeholder">Placeholder: line-by-line breakdown of a minimal program.</p>
<pre><span class="k">public class</span> <span class="t">Main</span> {
  <span class="k">public static void</span> main(<span class="t">String</span>[] args) {
    <span class="t">System</span>.out.println(<span class="s">"Hello, World"</span>); <span class="c">// your first line</span>
  }
}</pre>` },
        { id: "compile-run", heading: "Compile and run", level: 2,
          body: `<p class="placeholder">Placeholder: <code>javac</code> → bytecode → <code>java</code> on the JVM.</p>` },
        { id: "jvm-jre-jdk", heading: "JVM, JRE, and JDK", level: 3,
          body: `<p class="placeholder">Placeholder: how the three relate; a common interview question.</p>` },
      ]
    },
    {
      id: "variables-types",
      title: "Variables & Data Types",
      subtitle: "Primitives, references, and type conversions.",
      readTime: "12 min",
      level: "Beginner",
      objectives: [
        "Placeholder objective — distinguish primitive and reference types.",
        "Placeholder objective — apply widening and narrowing conversions."
      ],
      sections: [
        { id: "primitives", heading: "The eight primitive types", level: 2,
          body: `<p class="placeholder">Placeholder: byte, short, int, long, float, double, char, boolean with sizes and ranges.</p>` },
        { id: "references", heading: "Reference types", level: 2,
          body: `<p class="placeholder">Placeholder: objects, arrays, and how references differ from primitives.</p>` },
        { id: "casting", heading: "Type casting & conversion", level: 3,
          body: `<p class="placeholder">Placeholder: implicit widening vs explicit narrowing casts.</p>` },
      ]
    },
    {
      id: "operators-control",
      title: "Operators & Control Flow",
      subtitle: "Decisions, loops, and expression evaluation.",
      readTime: "11 min",
      level: "Beginner",
      objectives: [
        "Placeholder objective — use conditionals and loops correctly.",
        "Placeholder objective — reason about operator precedence."
      ],
      sections: [
        { id: "operators", heading: "Operators overview", level: 2,
          body: `<p class="placeholder">Placeholder: arithmetic, relational, logical, bitwise, ternary.</p>` },
        { id: "conditionals", heading: "Conditionals", level: 2,
          body: `<p class="placeholder">Placeholder: if / else if / switch (including switch expressions).</p>` },
        { id: "loops", heading: "Loops", level: 2,
          body: `<p class="placeholder">Placeholder: for, while, do-while, enhanced for.</p>` },
      ]
    },
  ]
});
