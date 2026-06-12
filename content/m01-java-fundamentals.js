/* Module 1: Java Fundamentals — edit ONLY this file for this module's content.
   Chapters 1.1–1.5 are written in full 11-part depth (deep:true).
   Chapters 1.6–1.16 are scaffolded; fill the parts to take them deep. */
registerModule({
  id: "java-fundamentals",
  module: "Java Fundamentals",
  page: "module-java-fundamentals.html",
  icon: "☕",
  tagline: "Syntax, types, and control flow — the bedrock of every Java program.",
  lessons: [

    /* 1.1 Introduction to Java
       What it is, core promise, and minimum viability to run a program.
       Sections: concept | why | internal | code | common mistakes | interview Q&A
       (Omit: bestPractices at intro level; useCases covered in 'why'; exercises combined with code) */
    topic({
      id: "introduction-to-java", chapter: "1.1", title: "Introduction to Java",
      subtitle: "What Java is, and why 'write once, run anywhere' changed software.",
      readTime: "9 min", level: "Foundational", deep: true,
      objectives: [
        "Explain what Java is and the *write once, run anywhere* promise.",
        "Describe how bytecode and the JVM make Java portable.",
        "Compile and run a minimal Java program."
      ],
      concept: `**Java** is a high-level, class-based, **object-oriented** programming language built to minimise dependencies on any specific machine. You write human-readable \`.java\` source, the compiler turns it into platform-neutral **bytecode** (\`.class\`), and the **Java Virtual Machine (JVM)** executes that bytecode on any device that has a JVM.

That indirection is the whole idea: the same compiled program runs unchanged on Windows, macOS, Linux, or a server in the cloud — the famous **WORA** principle: *write once, run anywhere*.`,
      why: `Java became the default language for large, long-lived systems for concrete reasons:

- **Platform independence** — bytecode runs on any JVM, so teams aren't locked to one OS.
- **Memory safety** — automatic **garbage collection** removes whole classes of memory bugs.
- **Strong static typing** — many errors are caught at compile time, not in production.
- **Massive ecosystem** — mature libraries and frameworks (Spring, Hibernate) and first-class tooling.
- **Backward compatibility** — code written years ago still compiles and runs, which enterprises value.
- **Career demand** — banking, telecom, and product companies run core systems on the JVM.

This combination made Java the backbone of **enterprise backends**, **Android apps**, **big data** (Hadoop, Spark), and **microservices** (Spring Boot).`,
      internal: `The journey from source to execution:

\`\`\`
Main.java  --(javac)-->  Main.class (bytecode)  --(JVM)-->  native machine code
\`\`\`

Inside the JVM, three things matter at startup:

1. **Class Loader** — finds and loads \`.class\` files into memory.
2. **Bytecode Verifier** — checks the bytecode is safe and well-formed before it runs.
3. **Execution engine** — interprets bytecode and, for hot paths, the **JIT (Just-In-Time) compiler** converts it to native code for speed.

So Java is *both* compiled (source → bytecode) **and** interpreted/JIT-compiled (bytecode → native) — a common interview nuance.`,
      code: `\`\`\`java
// File: Main.java  (file name must match the public class name)
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
\`\`\`

Compile and run from a terminal:

\`\`\`
javac Main.java     # produces Main.class (bytecode)
java Main           # JVM runs the bytecode -> Hello, Java!
\`\`\`

**First-time exercises:**
1. Write a program that prints your name and target company on separate lines.
2. Modify it to print the sum of two numbers.
3. Deliberately rename the file so it no longer matches the class — read the compiler error, then fix it.`,
      mistakes: `- Naming the file differently from the \`public\` class — the file **must** be \`Main.java\`.
- Wrong \`main\` signature; the JVM only launches \`public static void main(String[] args)\`.
- Forgetting Java is **case-sensitive** (\`System\` ≠ \`system\`).
- Running \`java Main.java\` vs \`java Main\` confusion (single-file source mode exists since Java 11, but the classic flow compiles first).`,
      interview: `**Q1. What is Java and why is it platform independent?**
A high-level OOP language whose source compiles to bytecode; the JVM (platform-specific) runs that bytecode, so the same \`.class\` runs anywhere a JVM exists.

**Q2. Is Java compiled or interpreted?**
Both. \`javac\` compiles source to bytecode; the JVM interprets bytecode and JIT-compiles hot code to native.

**Q3. What is bytecode?**
An intermediate, platform-neutral instruction set stored in \`.class\` files, executed by the JVM.

**Q4. Is Java 100% object-oriented?**
No — it uses **primitive types** (\`int\`, \`char\`, …) that aren't objects, so it's not purely OOP.`,
      summary: `- Java = high-level, OOP, **WORA** via bytecode + JVM.
- \`javac\` → bytecode (\`.class\`) → JVM (class loader, verifier, JIT) → native.
- Compiled **and** interpreted; **not** purely object-oriented (primitives exist).
- Dominant in enterprise backends, Android, and big data.`
    }),

    /* 1.2 History of Java
       Context, design philosophy, and release milestones — reference knowledge.
       Sections: origin | design goals | milestone releases | interview Q&A
       (Omit: internal/technical deep-dive, code examples, exercises — this is conceptual history) */
    topic({
      id: "history-of-java", chapter: "1.2", title: "History of Java",
      subtitle: "From 'Oak' and set-top boxes to the enterprise standard.",
      readTime: "6 min", level: "Foundational", deep: true,
      objectives: [
        "Trace Java's origin and its core design goals.",
        "Recognise the milestone releases that shaped modern Java."
      ],
      concept: `Java began at **Sun Microsystems** in 1991 as a project led by **James Gosling**, originally named **Oak** (after a tree outside his office), later renamed **Java**. It was publicly released in **1995**. The goal was a language for networked consumer devices that could run on any hardware — which turned out to be perfect for the emerging internet. **Oracle** acquired Sun in 2010 and stewards Java today.`,
      designGoals: `Understanding *why Java looks the way it does* requires knowing its original blueprint. Java was deliberately built to be:

- **Simple** and familiar (C/C++-like syntax, minus manual memory management).
- **Portable & architecture-neutral** (bytecode + JVM).
- **Robust & secure** (no raw pointers, strong typing, the bytecode verifier).
- **Multithreaded** from day one for interactive, networked software.

These foundational goals still guide Java today.`,
      milestones: `Know these releases to answer "since which version?" in interviews and understand real codebases:

| Version | Year | Landmark features |
|---|---|---|
| JDK 1.0 | 1996 | First release |
| J2SE 5.0 | 2004 | Generics, enums, autoboxing, annotations, for-each |
| Java 8 | 2014 | **Lambdas, Streams, Optional, new Date/Time** |
| Java 9 | 2017 | Module system (Project Jigsaw) |
| Java 11 | 2018 | First LTS after 8; \`var\` in lambdas; run \`.java\` directly |
| Java 17 | 2021 | LTS; sealed classes, records, pattern matching maturing |
| Java 21 | 2023 | LTS; virtual threads, pattern matching for switch |`,
      interview: `**Q1. Who created Java and when?**
James Gosling at Sun Microsystems; released in 1995. Originally called Oak.

**Q2. Why was Java created?**
For platform-independent software on networked consumer devices; the WORA model fit the internet era.

**Q3. Which release is considered the biggest leap for modern Java?**
**Java 8** — lambdas, the Streams API, \`Optional\`, and the new Date/Time API.

**Q4. What is an LTS release?**
A **Long-Term Support** version (8, 11, 17, 21) that receives extended updates — what enterprises standardise on.`,
      summary: `- Created by **James Gosling** at **Sun** (1995); originally **Oak**; now stewarded by **Oracle**.
- Design goals: simple, portable, robust, secure, multithreaded.
- Know the milestones, especially **Java 8** (lambdas/streams) and the **LTS** line (8/11/17/21).`
    }),

    /* 1.3 JVM, JRE, JDK
       The three nested layers: practical distinctions and memory model.
       Sections: concept | why | nesting model & memory | check your setup | common confusions | interview Q&A | exercises
       (Omit: bestPractices (can be lighter here); challenges simplified; no code design yet) */
    topic({
      id: "jvm-jre-jdk", chapter: "1.3", title: "JVM, JRE, and JDK",
      subtitle: "The three acronyms every interviewer asks you to untangle.",
      readTime: "8 min", level: "Foundational", deep: true,
      objectives: [
        "Distinguish the JVM, JRE, and JDK and how they nest.",
        "Explain what each one provides and when you need it."
      ],
      concept: `These three are layers that contain one another:

- **JVM (Java Virtual Machine)** — the engine that *runs* bytecode. It's an abstract specification with many implementations (HotSpot, OpenJ9).
- **JRE (Java Runtime Environment)** — the JVM **plus** the standard class libraries needed to *run* Java apps. Run-only, no compiler.
- **JDK (Java Development Kit)** — the JRE **plus** development tools (\`javac\`, \`jar\`, \`javadoc\`, debugger) needed to *build* Java apps.

> Mental model: **JDK ⊇ JRE ⊇ JVM**. To *develop* you need the JDK; to *only run* you need the JRE.`,
      why: `The distinction is practical: a build server or your laptop needs the **JDK** (it compiles code). A machine that only runs a finished app historically needed just the **JRE** (smaller footprint). Interviewers use this question to check you understand the compile-vs-run boundary.`,
      internalModel: `When you run \`java App\`, the **JVM** performs:

1. **Loading** — the class loader reads \`App.class\`.
2. **Linking** — verify (safety check), prepare (allocate memory for statics), resolve references.
3. **Initialization** — run static initialisers.
4. **Execution** — the interpreter runs bytecode; the **JIT** compiles hot methods to native code; the **Garbage Collector** reclaims unused objects.

Key JVM memory areas: **Heap** (objects), **Stack** (per-thread frames/locals), **Method Area / Metaspace** (class metadata), **PC registers**, and **native method stacks**.`,
      checkYourSetup: `Verify what you have installed:

\`\`\`bash
java -version     # runtime (JRE/JVM)
javac -version    # compiler (only present with the JDK)
\`\`\`

If \`javac\` is "command not found" but \`java\` works, you have a runtime but **not** the JDK.`,
      mistakes: `- Thinking the JVM and JRE are the same — the JRE *includes* the JVM **and** libraries.
- Trying to compile on a machine that only has a JRE (no \`javac\`).
- Assuming one JVM — there are multiple implementations of the same spec.`,
      interview: `**Q1. Difference between JDK, JRE, and JVM?**
JVM runs bytecode; JRE = JVM + libraries (run-only); JDK = JRE + dev tools (build + run).

**Q2. Can you run Java with only a JRE?**
Yes — running is fine; you just can't **compile** (no \`javac\`).

**Q3. Is the JVM platform independent?**
No — the JVM itself is platform-**specific**; *bytecode* is platform-independent. That's what makes WORA work.

**Q4. Name the JVM memory areas.**
Heap, stack, method area/metaspace, PC registers, native method stacks.`,
      exercises: `1. Run \`java -version\` and \`javac -version\` and note which tools you have.
2. In one sentence each, explain JVM, JRE, JDK to a non-programmer.
3. Draw the nested diagram **JDK ⊇ JRE ⊇ JVM** and label one thing that lives in each ring but not the inner one.`,
      summary: `- **JVM** runs bytecode; **JRE** = JVM + libraries (run); **JDK** = JRE + tools (build).
- Nesting: **JDK ⊇ JRE ⊇ JVM**.
- Bytecode is portable; the **JVM is platform-specific**.
- Know the JVM memory areas for follow-up questions.`
    }),

    /* 1.4 Java Architecture
       Three-stage model: compile → load → execute. Focus on class loading and runtime memory.
       Sections: concept | why (portability & safety) | class loader subsystem & memory model | practical implications | common confusions | interview Q&A | exercises
       (Omit: code examples (no code to write); bestPractices (premature until later modules); challenges light) */
    topic({
      id: "java-architecture", chapter: "1.4", title: "Java Architecture",
      subtitle: "How the pieces — compiler, class loader, runtime — fit together.",
      readTime: "8 min", level: "Foundational", deep: true,
      objectives: [
        "Describe the end-to-end architecture from source to execution.",
        "Explain the class loader subsystem and the runtime data areas."
      ],
      concept: `Java's architecture has three big stages: **compile time**, **class loading**, and **runtime execution**. Source is compiled once to bytecode; the JVM then loads, verifies, and executes it, managing memory automatically.`,
      whyThisDesign: `This layered model is *why* Java is portable, memory-safe, and reasonably fast:

- **Portability** from platform-neutral bytecode (same \`.class\` on Windows/Linux/macOS).
- **Safety** from bytecode verification + automatic garbage collection.
- **Performance** from JIT compiling hot paths to native code at runtime.`,
      classLoaderAndMemory: `**1. Class Loader Subsystem** loads classes on demand using a delegation hierarchy:

- **Bootstrap** loader → core JDK classes (\`java.lang.*\`).
- **Platform/Extension** loader → platform modules.
- **Application** loader → your classpath classes.

It applies **delegation** (ask the parent first), **visibility**, and **uniqueness** rules so classes aren't loaded twice.

**2. Runtime Data Areas:**

| Area | Shared? | Holds |
|---|---|---|
| Heap | Yes | All objects, arrays (GC works here) |
| Method Area / Metaspace | Yes | Class metadata, static fields |
| Stack | Per-thread | Method frames, local variables |
| PC Register | Per-thread | Address of current instruction |
| Native Method Stack | Per-thread | Native (JNI) call frames |

**3. Execution Engine:** interpreter + **JIT** compiler + **Garbage Collector**.`,
      practicalImplications: `- Diagnosing \`OutOfMemoryError\` means knowing whether it's the **heap** or **metaspace**.
- Understanding stack vs heap explains why local primitives are cheap and objects are GC-managed.
- Class-loading knowledge helps debug \`ClassNotFoundException\` vs \`NoClassDefFoundError\`.`,
      mistakes: `- Confusing **stack** (per-thread, locals) with **heap** (shared, objects).
- Believing the GC runs at a predictable time — it doesn't; you can suggest but not force it.
- Mixing up \`ClassNotFoundException\` (not found at load time) and \`NoClassDefFoundError\` (was present at compile, missing at run).`,
      interview: `**Q1. Walk me through what happens from \`.java\` to execution.**
Compile to bytecode → class loader loads/links/initialises → execution engine interprets + JIT-compiles → GC manages heap.

**Q2. Stack vs heap in Java?**
Stack is per-thread and stores frames/locals (fast, auto-freed); heap is shared and stores objects (GC-managed).

**Q3. What does the bytecode verifier do?**
Checks loaded bytecode for safety/validity before execution to prevent corrupt or malicious code from running.`,
      exercises: `1. List which of these live on the heap vs stack: a local \`int\`, a \`new int[1000]\`, a \`String\` object reference, the object it points to.
2. Explain the class-loader delegation order in your own words.
3. Research and note the difference between \`ClassNotFoundException\` and \`NoClassDefFoundError\` with one cause for each.`,
      summary: `- Stages: **compile → load → execute**.
- Class loaders use **delegation/visibility/uniqueness**.
- Runtime areas: **heap** (shared, GC), **stack** (per-thread), **metaspace**, PC, native stacks.
- Execution engine = interpreter + **JIT** + **GC**.`
    }),

    /* 1.5 Java Compilation Process
       Two-phase execution: compile-time and runtime. Includes hands-on practice.
       Sections: concept | why | two-phase process | code examples | common mistakes | best practices | interview Q&A | exercises | challenges
       (All sections naturally fit this topic — a complete workflow) */
    topic({
      id: "java-compilation-process", chapter: "1.5", title: "Java Compilation Process",
      subtitle: "What javac actually produces, and how the JVM runs it.",
      readTime: "7 min", level: "Foundational", deep: true,
      objectives: [
        "Explain each step from source code to running program.",
        "Describe the role of the JIT compiler at runtime."
      ],
      concept: `Compilation in Java is **two-phase**. First, \`javac\` translates \`.java\` source into **bytecode** (\`.class\`). Second, at runtime the JVM executes that bytecode — interpreting it and using the **JIT** to compile frequently-run ("hot") methods into native machine code.`,
      why: `The split gives Java both **portability** (ship one set of \`.class\` files) and **performance** (JIT optimises for the actual machine at runtime), without recompiling per platform.`,
      twoPhaseProcess: `\`\`\`
   Hello.java
      │  javac  (compile time)
      ▼
   Hello.class  (bytecode)
      │  java   (runtime: JVM)
      ▼
   Class loader → Bytecode verifier → Interpreter/JIT → Native execution
\`\`\`

- \`javac\` checks syntax and types, then emits portable bytecode.
- The JVM **interprets** bytecode initially (fast startup).
- The **JIT** watches for hot methods and compiles them to native code (fast steady-state). This is why a long-running JVM app often speeds up after warm-up.`,
      code: `\`\`\`bash
javac Hello.java        # 1) compile  -> Hello.class
java Hello              # 2) run      -> JVM executes bytecode

javap -c Hello          # peek at the generated bytecode (disassembler)
\`\`\``,
      mistakes: `- Editing \`.class\` files or expecting them to be human-readable — they're bytecode.
- Forgetting to recompile after changing source (running stale \`.class\`).
- Confusing compile-time errors (caught by \`javac\`) with runtime exceptions (thrown by the JVM).`,
      bestPractices: `- Automate compilation with a build tool (Maven/Gradle) rather than manual \`javac\`.
- Treat compiler **warnings** seriously; enable \`-Xlint\`.
- Keep generated artifacts (\`.class\`, \`target/\`) out of version control.`,
      interview: `**Q1. Why is Java called both compiled and interpreted?**
\`javac\` compiles to bytecode (compiled); the JVM interprets/JIT-compiles bytecode at runtime (interpreted + compiled).

**Q2. What is the JIT compiler?**
A runtime component that compiles hot bytecode to native code for speed, after profiling which methods run often.

**Q3. What does \`javap\` do?**
Disassembles \`.class\` files so you can inspect the bytecode.`,
      exercises: `1. Compile a small class and run \`javap -c\` on it; identify the \`main\` method in the output.
2. Change the source, re-run without recompiling, and observe stale behaviour; then recompile.`,
      challenges: `Write two methods that compute the same result, run one in a tight loop millions of times, and informally observe JIT warm-up by timing the first vs later iterations.`,
      summary: `- **Two phases:** \`javac\` (source → bytecode) and JVM (bytecode → native via interpret + **JIT**).
- Bytecode is portable; JIT gives native-level speed after warm-up.
- \`javap\` disassembles bytecode; build tools automate the compile step.`
    }),

    /* ---------------- 1.6 – 1.16 : full depth ---------------- */

    /* 1.7 Variables builds on this; OOP details of classes/objects live in Module 2. */
    topic({
      id: "java-syntax", chapter: "1.6", title: "Java Syntax",
      subtitle: "The grammar rules every Java program must obey.",
      readTime: "9 min", level: "Beginner", deep: true,
      objectives: [
        "Identify the mandatory structural elements of a Java program.",
        "Apply Java's rules for identifiers, keywords, and comments.",
        "Follow the standard naming conventions used in industry."
      ],
      concept: `**Syntax** is the set of grammar rules the compiler enforces. Java is **case-sensitive**, **statically typed**, and organises all code inside **classes**. Every executable program needs a class and the entry-point method \`public static void main(String[] args)\`.

The non-negotiables:

- Code lives inside a **class**; the file name must match the \`public\` class name (see §1.1).
- Statements end with a **semicolon** \`;\`.
- Blocks are grouped with **curly braces** \`{ }\`.
- Whitespace and newlines are free-form — the compiler ignores extra spacing, but humans don't.`,
      why: `A strict, predictable grammar lets the compiler catch mistakes early and lets any Java developer read any other developer's code. Consistent syntax is what makes large teams and decades-old codebases maintainable.`,
      anatomy: `\`\`\`java
package com.shail.demo;        // 1. optional package declaration
import java.util.Scanner;      // 2. optional imports

public class Greeting {        // 3. class declaration (file = Greeting.java)
    public static void main(String[] args) {   // 4. entry point
        String name = "Shail"; // 5. a statement, ends with ;
        System.out.println("Hi, " + name);      // 6. method call
    }                          // closes main
}                              // closes class
\`\`\`

Order matters: \`package\` (if present) is first, then \`import\`s, then type declarations.`,
      rules: `**Identifiers** (names you choose) must:

- start with a letter, \`_\`, or \`$\` — never a digit;
- contain only letters, digits, \`_\`, \`$\`;
- not be a **reserved keyword** (\`class\`, \`int\`, \`if\`, \`return\`, …);
- be case-sensitive (\`total\` ≠ \`Total\`).

**Comments** come in three forms:

\`\`\`java
// single-line
/* multi-line
   comment */
/** Javadoc — documents an API; tools generate HTML from these. */
\`\`\``,
      code: `\`\`\`java
public class SyntaxDemo {
    public static void main(String[] args) {
        int count = 5;             // declaration + initialisation
        double price = 19.99;
        boolean inStock = true;

        // a block creates its own scope
        {
            int temp = count * 2;
            System.out.println(temp);   // 10
        }
        // temp is not visible here — it lived only in the block above

        System.out.println(count + " items, in stock: " + inStock);
    }
}
\`\`\``,
      mistakes: `- Missing the semicolon at the end of a statement.
- File name not matching the \`public\` class name (§1.1).
- Writing \`System.out.println\` as \`system.out.Println\` — Java is case-sensitive.
- Mismatched or missing braces \`{ }\`.
- Starting an identifier with a digit (\`2ndValue\` ❌ → \`value2\` ✅).`,
      bestPractices: `Industry naming conventions (memorise these — interviewers check):

| Element | Convention | Example |
|---|---|---|
| Class / Interface | PascalCase | \`BankAccount\` |
| Method / variable | camelCase | \`getBalance\`, \`userName\` |
| Constant (\`static final\`) | UPPER_SNAKE_CASE | \`MAX_USERS\` |
| Package | all lowercase, dotted | \`com.shail.app\` |

Also: indent consistently (4 spaces), one statement per line, and use Javadoc on public APIs.`,
      interview: `**Q1. What are the mandatory parts of a Java program?**
A class, and to run it, the \`public static void main(String[] args)\` method.

**Q2. Is Java case-sensitive?**
Yes — \`Main\`, \`main\`, and \`MAIN\` are three different identifiers.

**Q3. Rules for a valid identifier?**
Begins with letter/\`_\`/\`$\`, then letters/digits/\`_\`/\`$\`; can't be a keyword.

**Q4. Difference between \`/* */\` and \`/** */\`?**
Both are block comments, but \`/** */\` is **Javadoc** — documentation tools parse it to generate API docs.`,
      exercises: `1. Write a class \`Profile\` that declares your name, age, and target company, then prints them.
2. Introduce three deliberate syntax errors (missing \`;\`, wrong case, unbalanced brace), read each compiler message, then fix them.
3. Rename three identifiers to follow the conventions table above.`,
      challenges: `Given \`int 1x = 5; double Total$ = 9.0; String for = "hi";\`, identify which declarations are illegal and why, then rewrite them legally.`,
      summary: `- Code lives in **classes**; statements end with \`;\`; blocks use \`{ }\`.
- Java is **case-sensitive**; identifiers can't start with a digit or be a keyword.
- Three comment styles; \`/** */\` is **Javadoc**.
- Follow conventions: **PascalCase** types, **camelCase** members, **UPPER_SNAKE** constants.
- OOP structure of classes/objects is covered in **Module 2**.`
    }),
    topic({
      id: "variables", chapter: "1.7", title: "Variables",
      subtitle: "Named, typed containers for the data your program works with.",
      readTime: "10 min", level: "Beginner", deep: true,
      objectives: [
        "Declare and initialise variables with the correct type.",
        "Distinguish local, instance, and static variables and their lifetimes.",
        "Explain default values, scope, and the role of \`final\`."
      ],
      concept: `A **variable** is a named container that holds a value of a declared **type**. Declaring a variable reserves memory and gives it a name; initialising it stores a first value.

\`\`\`java
int age;          // declaration
age = 25;         // initialisation
int score = 90;   // both at once
\`\`\`

Java has **three kinds** of variables based on *where* they're declared:

- **Local** — inside a method/block; created when the block runs, destroyed when it ends.
- **Instance** — a non-\`static\` field of a class; one copy **per object**.
- **Static** (class) — a \`static\` field; **one copy shared** by all objects of the class.`,
      why: `Variables let a program store, label, and reuse data instead of hard-coding values. The local/instance/static distinction controls **lifetime** and **sharing**, which matters for correctness and memory — and is a guaranteed interview question.`,
      internal: `Where a variable lives depends on its kind:

| Kind | Stored in | Lifetime | Default value? |
|---|---|---|---|
| Local | **Stack** (method frame) | While the method runs | **No** — must be set before use |
| Instance | **Heap** (inside the object) | As long as the object lives | **Yes** |
| Static | **Method area / Metaspace** | While the class is loaded | **Yes** |

(Stack vs heap is the memory model from §1.4.) **Default values** for fields: numbers → \`0\`/\`0.0\`, \`boolean\` → \`false\`, \`char\` → \`\\u0000\`, reference → \`null\`. Local variables get **no** default — using one before assignment is a **compile error**.`,
      useCases: `- **Local** — loop counters, temporary results, method parameters.
- **Instance** — an object's state (a \`BankAccount\`'s \`balance\`).
- **Static** — values shared across all instances (a \`MAX_USERS\` limit, a counter of how many objects were created).`,
      code: `\`\`\`java
public class Counter {
    static int created = 0;     // static: shared by all Counter objects
    int id;                     // instance: one per object

    Counter() {
        created++;              // bump the shared count
        id = created;           // this object's own id
    }

    public static void main(String[] args) {
        final double PI = 3.14159;   // final: a constant, can't be reassigned
        var message = "Counters";    // 'var' infers String (Java 10+)

        Counter a = new Counter();
        Counter b = new Counter();
        System.out.println(message + ": " + Counter.created); // 2
        System.out.println(a.id + ", " + b.id);               // 1, 2
    }
}
\`\`\``,
      mistakes: `- Using a **local** variable before assigning it (\`variable might not have been initialized\`).
- Expecting a local variable to default to \`0\` — only fields do.
- **Variable shadowing**: a local variable with the same name as a field hides the field.
- Reassigning a \`final\` variable.
- Confusing \`var\` (compile-time type inference, still strongly typed) with a dynamic type — Java stays statically typed.`,
      bestPractices: `- Declare variables **close to first use**, in the narrowest scope.
- Use \`final\` for values that shouldn't change — it documents intent and prevents bugs.
- Give meaningful names (\`customerCount\`, not \`c\`).
- Prefer the smallest sufficient scope; avoid unnecessary \`static\` mutable state.`,
      interview: `**Q1. Name the three types of variables in Java.**
Local, instance, and static (class) variables.

**Q2. What are their default values?**
Instance/static default (0, false, \`\\u0000\`, null); **local variables have no default**.

**Q3. What does \`final\` do to a variable?**
Makes it a constant — it can be assigned once and never reassigned.

**Q4. Difference between instance and static variables?**
Instance = one copy per object; static = one copy shared by the whole class.

**Q5. Is \`var\` dynamic typing?**
No. \`var\` is **local-variable type inference** (Java 10+); the type is fixed at compile time.`,
      exercises: `1. Declare one local, one instance, and one static variable in a small class and print each.
2. Try printing a local variable before assigning it; read the compiler error, then fix it.
3. Create a class whose static counter tracks how many objects you've created.`,
      challenges: `Write a class where a method's local variable shadows an instance field of the same name. Print both (use \`this.field\` to reach the instance one) and explain the output.`,
      summary: `- A variable = a named, typed container; declare then initialise.
- Three kinds: **local** (stack, no default), **instance** (heap, per object), **static** (shared, one copy).
- Fields get defaults; **locals do not**.
- \`final\` = constant; \`var\` = compile-time type inference, not dynamic typing.
- Object state and the role of fields go deeper in **Module 2 (OOP)**.`
    }),
    topic({
      id: "data-types", chapter: "1.8", title: "Data Types",
      subtitle: "The eight primitives, reference types, and how to pick the right one.",
      readTime: "11 min", level: "Beginner", deep: true,
      objectives: [
        "List the eight primitive types with their sizes and ranges.",
        "Distinguish primitive from reference types and how they're stored.",
        "Choose the correct type for a given value and write valid literals."
      ],
      concept: `Java types split into two families:

- **Primitive types** — the eight built-in value types. They hold the value directly.
- **Reference types** — classes, arrays, interfaces, enums, \`String\`. The variable holds a **reference** (address) to an object on the heap, not the object itself.

The eight primitives:

| Type | Size | Range (approx) | Default | Example literal |
|---|---|---|---|---|
| \`byte\` | 8-bit | −128 … 127 | 0 | \`byte b = 100;\` |
| \`short\` | 16-bit | −32,768 … 32,767 | 0 | \`short s = 5000;\` |
| \`int\` | 32-bit | ±2.1 billion | 0 | \`int i = 42;\` |
| \`long\` | 64-bit | ±9.2 quintillion | 0L | \`long n = 9_000_000_000L;\` |
| \`float\` | 32-bit | ~6–7 decimal digits | 0.0f | \`float f = 3.14f;\` |
| \`double\` | 64-bit | ~15 decimal digits | 0.0d | \`double d = 3.14;\` |
| \`char\` | 16-bit | 0 … 65,535 (Unicode) | \`\\u0000\` | \`char c = 'A';\` |
| \`boolean\` | JVM-dependent | \`true\` / \`false\` | false | \`boolean ok = true;\` |`,
      why: `Choosing the right type controls **memory use**, **value range**, and **precision**. Picking \`int\` over \`long\` saves space; picking \`double\` over \`float\` buys precision; using \`boolean\` instead of \`0/1\` makes intent clear and is type-safe.`,
      internal: `**Primitives are stored by value.** A local primitive lives directly in the stack frame, so copying one copies the value. A **reference** variable holds an address; the object it points to lives on the **heap** (the stack/heap split from §1.4).

\`\`\`
int x = 10;          stack: [ x | 10 ]
String s = "hi";     stack: [ s | →0x7f ]  ──▶ heap: "hi"
\`\`\`

Each primitive has a **wrapper class** (\`int\`→\`Integer\`, \`char\`→\`Character\`, …) so values can be treated as objects when needed (e.g. inside collections). Converting between them is **autoboxing/unboxing**; it's used heavily in **Module 5 (Collections)** and **Module 6 (Generics)**.

\`char\` is **2 bytes** because Java uses **Unicode (UTF-16)**, not ASCII — a common interview "gotcha".`,
      useCases: `- \`int\` — the default for whole numbers (counts, indices).
- \`long\` — timestamps, IDs, values beyond ±2.1 billion.
- \`double\` — scientific/measurement values where small rounding is fine.
- \`boolean\` — flags and conditions.
- \`char\` — single characters; for text, use \`String\` (**Module 3**).
- \`BigDecimal\` (a reference type) — money, where exact decimal precision is required.`,
      code: `\`\`\`java
public class TypesDemo {
    public static void main(String[] args) {
        int decimal = 1_000_000;       // underscores aid readability
        int hex      = 0xFF;           // 255
        int binary   = 0b1010;         // 10
        long big     = 10_000_000_000L; // L suffix required (too big for int)
        float ratio  = 0.5f;           // f suffix required for float
        double pi    = 3.14159;
        char grade   = 'A';            // single quotes; '\\n', '\\u0041' also valid
        boolean pass = true;

        int fromChar = grade;          // char -> int promotion: 65
        System.out.println(big + " " + ratio + " " + fromChar);
    }
}
\`\`\``,
      mistakes: `- **Integer overflow**: \`int\` arithmetic that exceeds the range silently wraps around — use \`long\`.
- Omitting the \`L\`/\`f\` suffix: \`long x = 10000000000;\` won't compile; \`float f = 3.14;\` won't compile (the literal is a \`double\`).
- Using \`float\`/\`double\` for **money** — binary floating point can't represent \`0.1\` exactly; use \`BigDecimal\`.
- Confusing \`char c = 'A'\` (single quotes) with \`String s = "A"\` (double quotes).`,
      bestPractices: `- Default to \`int\` and \`double\`; reach for \`long\`/\`BigDecimal\` only when range/precision demands it.
- Never store currency in \`double\`.
- Use digit separators (\`1_000_000\`) for large literals.
- Prefer primitives over wrapper objects in hot, numeric code (less boxing overhead).`,
      interview: `**Q1. How many primitive types does Java have? Name them.**
Eight: \`byte, short, int, long, float, double, char, boolean\`.

**Q2. Why is \`char\` 2 bytes in Java?**
Java uses Unicode (UTF-16), so a char must represent characters beyond ASCII.

**Q3. Primitive vs reference type?**
A primitive holds the value directly; a reference holds an address to a heap object.

**Q4. What is autoboxing?**
Automatic conversion between a primitive and its wrapper class (e.g. \`int\` ↔ \`Integer\`).

**Q5. Why not use \`double\` for money?**
Binary floating point can't represent many decimals exactly, causing rounding errors — use \`BigDecimal\`.`,
      exercises: `1. Declare all eight primitives with valid literals and print each.
2. Cause an \`int\` overflow (\`Integer.MAX_VALUE + 1\`) and observe the wrap-around; fix it with \`long\`.
3. Write \`255\` as a decimal, hex, and binary literal and confirm they're equal.`,
      challenges: `Compute \`0.1 + 0.2\` with \`double\` and print it. Explain why the result isn't exactly \`0.3\`, then redo it with \`BigDecimal\` to get \`0.3\`.`,
      summary: `- Two families: **primitives** (8 value types) and **reference** types (objects on the heap).
- Know sizes/ranges; \`char\` is **2 bytes** (Unicode); literals need \`L\`/\`f\` suffixes where required.
- Primitives store values; references store addresses; each primitive has a **wrapper**.
- Never use \`double\` for money. \`String\` depth → **Module 3**; autoboxing in use → **Modules 5–6**.`
    }),
    topic({
      id: "type-casting", chapter: "1.9", title: "Type Casting",
      subtitle: "Converting between types — safely widening, carefully narrowing.",
      readTime: "9 min", level: "Beginner", deep: true,
      objectives: [
        "Differentiate widening (implicit) from narrowing (explicit) casts.",
        "Predict data loss and overflow when narrowing.",
        "Tell type casting apart from String parsing."
      ],
      concept: `**Type casting** converts a value from one type to another. For primitives there are two directions:

- **Widening (implicit)** — small type → larger type. Safe, automatic, no cast needed.
  \`byte → short → int → long → float → double\`
- **Narrowing (explicit)** — large type → smaller type. Possible data loss, so **you** must write the cast \`(type)\`.

\`\`\`java
int i = 100;
double d = i;          // widening: int -> double, automatic
double pi = 3.99;
int n = (int) pi;      // narrowing: double -> int, explicit -> 3 (truncates)
\`\`\``,
      why: `Mixed-type arithmetic and APIs constantly require conversions. Widening is automatic because nothing is lost; narrowing requires an explicit cast so the loss is **intentional and visible** in the code, not accidental.`,
      internal: `Narrowing can **lose data** in two ways:

- **Truncation** — \`double → int\` drops the fractional part (\`3.99 → 3\`, it does *not* round).
- **Overflow** — the value doesn't fit, so bits are discarded and the result wraps:

\`\`\`java
int big = 257;
byte b = (byte) big;   // 257 mod 256 -> 1
\`\`\`

In expressions, Java applies **numeric promotion**: operands smaller than \`int\` are promoted to \`int\` first, and the whole expression promotes to the largest type present. So \`byte + byte\` produces an \`int\`.`,
      useCases: `- Fitting a wider computed value into a narrower field (\`long\` → \`int\` after validation).
- Converting \`char\` ↔ \`int\` to do arithmetic on characters (\`'A' + 1\`).
- Forcing floating-point division: \`(double) a / b\` instead of integer division.`,
      code: `\`\`\`java
public class CastDemo {
    public static void main(String[] args) {
        // widening (automatic)
        int count = 10;
        double avg = count;            // 10.0

        // narrowing (explicit, truncates)
        double measured = 9.81;
        int whole = (int) measured;    // 9

        // char <-> int
        char ch = 'A';
        int code = ch;                 // 65
        char next = (char) (code + 1); // 'B'

        // force floating-point division
        int a = 7, b = 2;
        System.out.println(a / b);              // 3  (integer division)
        System.out.println((double) a / b);     // 3.5

        // PARSING is not casting:
        int parsed = Integer.parseInt("123");   // String -> int
        System.out.println(whole + " " + next + " " + parsed);
    }
}
\`\`\``,
      mistakes: `- Expecting \`(int) 3.99\` to round — it **truncates** to 3 (use \`Math.round\` to round).
- Silent **overflow** when narrowing a value that doesn't fit.
- Trying to cast a \`String\` to a number with \`(int)\` — that's a compile error; use \`Integer.parseInt\` / \`Double.parseDouble\`.
- Forgetting that \`int / int\` is integer division **before** any cast on the result: \`(double)(7/2)\` is \`3.0\`, not \`3.5\`.`,
      bestPractices: `- Prefer widening; narrow only when you've confirmed the value fits.
- Use \`Math.round\` when you want rounding, not truncation.
- Cast an **operand** (\`(double) a / b\`), not the already-computed result, to change division behaviour.
- Validate before narrowing user-supplied or computed values.`,
      interview: `**Q1. Widening vs narrowing?**
Widening is small→large (automatic, lossless); narrowing is large→small (explicit cast, possible loss).

**Q2. What does \`(int) 3.99\` give?**
\`3\` — narrowing truncates, it does not round.

**Q3. \`byte b = (byte) 257;\` — result?**
\`1\` — overflow wraps modulo 256.

**Q4. Is \`Integer.parseInt("5")\` casting?**
No — it's **parsing** a String into an int via a method; casting only converts between compatible types.

**Q5. Why does \`5 / 2\` give 2, not 2.5?**
Both operands are \`int\`, so it's integer division; cast one operand to \`double\` for \`2.5\`.`,
      exercises: `1. Widen an \`int\` to \`double\` and narrow a \`double\` to \`int\`; print both and note the truncation.
2. Cast \`130\` to a \`byte\` and explain the result.
3. Convert the string \`"3.5"\` to a \`double\` and add \`1\`.`,
      challenges: `Without running it, predict the output of \`System.out.println((char)('Z' - 'A' + 'a'));\`. Then verify and explain using the char↔int promotion rules.`,
      summary: `- **Widening** = automatic and safe; **narrowing** = explicit \`(type)\`, may truncate or overflow.
- Narrowing \`double→int\` **truncates** (no rounding); out-of-range narrowing **wraps**.
- \`int/int\` is integer division — cast an operand to \`double\` to change it.
- **Parsing** (\`Integer.parseInt\`) ≠ casting. Object/reference casting, \`instanceof\`, and generics casts → **Modules 2 & 6**.`
    }),
    topic({
      id: "operators", chapter: "1.10", title: "Operators",
      subtitle: "Arithmetic, relational, logical, bitwise, and the ternary — with precedence.",
      readTime: "11 min", level: "Beginner", deep: true,
      objectives: [
        "Use each operator category correctly.",
        "Apply precedence, associativity, and short-circuit evaluation.",
        "Avoid the classic \`==\` / integer-division / increment pitfalls."
      ],
      concept: `**Operators** are symbols that perform operations on operands. The main categories:

| Category | Operators |
|---|---|
| Arithmetic | \`+  -  *  /  %\` |
| Relational | \`==  !=  >  <  >=  <=\` |
| Logical | \`&&  \\|\\|  !\` |
| Bitwise | \`&  \\|  ^  ~  <<  >>  >>>\` |
| Assignment | \`=  +=  -=  *=  /=  %=\` … |
| Unary | \`+  -  ++  --  !\` |
| Ternary | \`condition ? a : b\` |
| Type | \`instanceof\` |`,
      why: `Operators are how every computation, comparison, and decision is expressed. Knowing precedence and short-circuit behaviour prevents subtle, hard-to-spot bugs — and these are favourite interview traps.`,
      internal: `**Precedence** decides what binds first; **associativity** breaks ties. Rough high→low order: unary → \`* / %\` → \`+ -\` → relational → \`&&\` → \`\\|\\|\` → assignment.

\`\`\`java
int r = 2 + 3 * 4;     // 14, not 20 — * before +
\`\`\`

**Short-circuit** logical operators stop early:

- \`&&\` — if the left side is \`false\`, the right side is **not evaluated**.
- \`\\|\\|\` — if the left side is \`true\`, the right side is **not evaluated**.

This lets you guard safely: \`if (s != null && s.length() > 0)\`.

**Integer division** discards the remainder (\`7 / 2 == 3\`); \`%\` gives the remainder and **keeps the sign of the dividend** (\`-7 % 3 == -1\`).`,
      useCases: `- \`%\` — even/odd checks, wrapping indices, formatting (\`n % 60\` for seconds).
- \`&&\`/\`\\|\\|\` short-circuit — null-safe guards before a method call.
- Ternary — concise value selection (\`int max = a > b ? a : b;\`).
- Bitwise/shift — flags, masks, fast \`×2\`/\`÷2\` (heavily used in **Module 14 (DSA)**).`,
      code: `\`\`\`java
public class OperatorDemo {
    public static void main(String[] args) {
        int a = 7, b = 2;
        System.out.println(a / b);      // 3  (integer division)
        System.out.println(a % b);      // 1  (remainder)

        // pre vs post increment
        int x = 5;
        System.out.println(x++);        // prints 5, then x becomes 6
        System.out.println(++x);        // x becomes 7, prints 7

        // ternary
        int max = (a > b) ? a : b;      // 7

        // short-circuit guard
        String s = null;
        if (s != null && s.length() > 0) System.out.println("non-empty");
        else System.out.println("null or empty");

        // bitwise
        System.out.println(5 & 3);      // 1
        System.out.println(1 << 4);     // 16  (1 * 2^4)
    }
}
\`\`\``,
      mistakes: `- Using \`==\` to compare **objects** (including \`String\`) — it compares references, not contents. Use \`.equals()\` (deep dive in **Module 3**).
- Confusing \`=\` (assignment) with \`==\` (comparison).
- Forgetting **integer division** truncates: \`1/2\` is \`0\`.
- Misreading \`x++\` (use-then-increment) vs \`++x\` (increment-then-use).
- Assuming precedence instead of using parentheses.`,
      bestPractices: `- Add parentheses to make precedence explicit, even when not strictly needed.
- Put the cheapest / most likely-to-fail condition first in \`&&\`/\`\\|\\|\` chains.
- Use \`.equals()\` for object/content comparison, \`==\` only for primitives and reference identity.
- Avoid clever bitwise tricks in business code unless performance demands it.`,
      interview: `**Q1. \`x++\` vs \`++x\`?**
Post-increment returns the old value then increments; pre-increment increments then returns the new value.

**Q2. What is short-circuit evaluation?**
\`&&\`/\`\\|\\|\` skip evaluating the right operand when the result is already determined by the left.

**Q3. \`==\` vs \`.equals()\`?**
\`==\` compares references (or primitive values); \`.equals()\` compares logical content for objects.

**Q4. What does \`-7 % 3\` return?**
\`-1\` — \`%\` keeps the sign of the dividend.

**Q5. Difference between \`>>\` and \`>>>\`?**
\`>>\` is signed (sign-extends); \`>>>\` is unsigned (fills with zeros).`,
      exercises: `1. Print the results of \`17 / 5\`, \`17 % 5\`, and \`17.0 / 5\` and explain each.
2. Demonstrate \`x++\` vs \`++x\` with print statements.
3. Use a ternary to assign the larger of two numbers.`,
      challenges: `Predict and then verify the output of \`int a = 5; int b = a++ + ++a;\`. Explain the value of \`b\` and the final value of \`a\` step by step.`,
      summary: `- Categories: arithmetic, relational, logical, bitwise, assignment, unary, ternary, \`instanceof\`.
- Respect **precedence/associativity**; use parentheses for clarity.
- \`&&\`/\`\\|\\|\` **short-circuit**; integer division truncates; \`%\` keeps the dividend's sign.
- \`==\` compares references for objects → use \`.equals()\` (**Module 3**); bitwise tricks → **Module 14**.`
    }),
    topic({
      id: "user-input", chapter: "1.11", title: "User Input",
      subtitle: "Reading from the keyboard with Scanner — and the newline trap.",
      readTime: "9 min", level: "Beginner", deep: true,
      objectives: [
        "Read different data types from the console with \`Scanner\`.",
        "Explain and fix the \`nextInt()\` + \`nextLine()\` newline pitfall.",
        "Compare \`Scanner\` with \`BufferedReader\`."
      ],
      concept: `To read keyboard input, wrap the standard input stream \`System.in\` in a **\`Scanner\`** (from \`java.util\`). Scanner has typed read methods that parse tokens for you.

\`\`\`java
import java.util.Scanner;

Scanner sc = new Scanner(System.in);
System.out.print("Name: ");
String name = sc.nextLine();
System.out.print("Age: ");
int age = sc.nextInt();
\`\`\`

Common methods: \`nextLine()\` (whole line), \`next()\` (one token), \`nextInt()\`, \`nextDouble()\`, \`nextBoolean()\`, and \`hasNext...()\` to check before reading.`,
      why: `Interactive programs, console tools, and most beginner/competitive-programming tasks need to read input at runtime. \`Scanner\` is the simplest way; \`BufferedReader\` is the faster option for large input.`,
      internal: `\`Scanner\` splits input into **tokens** using whitespace (spaces, tabs, newlines) as delimiters. The crucial detail: \`nextInt()\`/\`nextDouble()\`/\`next()\` read a token but **leave the trailing newline** in the buffer. A following \`nextLine()\` then reads that leftover empty line instead of waiting for new input — the classic bug.

\`BufferedReader\` (with \`InputStreamReader\`) reads raw lines as Strings and is faster because it buffers and does no per-token parsing; you parse manually with \`Integer.parseInt\`.`,
      useCases: `- Console menus and prompts.
- Reading numbers/lines in coding-practice problems.
- Quick CLI utilities and demos before a real UI exists.`,
      code: `\`\`\`java
import java.util.Scanner;

public class InputDemo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter age: ");
        int age = sc.nextInt();
        sc.nextLine();                 // FIX: consume the leftover newline

        System.out.print("Enter full name: ");
        String name = sc.nextLine();   // now reads the real line

        System.out.println(name + " is " + age);
        sc.close();
    }
}
\`\`\`

Faster alternative for bulk input:

\`\`\`java
BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
int n = Integer.parseInt(br.readLine().trim());
\`\`\``,
      mistakes: `- **The newline trap**: calling \`nextLine()\` right after \`nextInt()\` reads an empty string — add a \`sc.nextLine()\` to consume the newline.
- Entering text when a number is expected throws \`InputMismatchException\` (handling exceptions → **Module 4**).
- Creating multiple \`Scanner(System.in)\` objects — use one.
- Forgetting to \`close()\` the Scanner (resource leak), though closing it also closes \`System.in\`.`,
      bestPractices: `- Use a **single** \`Scanner\` for \`System.in\`.
- After \`nextInt()\`/\`nextDouble()\`, call \`nextLine()\` before reading a line.
- Validate with \`hasNextInt()\` before \`nextInt()\` to avoid crashes.
- Prefer \`BufferedReader\` when reading thousands of lines.`,
      interview: `**Q1. Which class reads console input?**
\`java.util.Scanner\`, wrapping \`System.in\`.

**Q2. Why does \`nextLine()\` after \`nextInt()\` return an empty string?**
\`nextInt()\` leaves the newline in the buffer; \`nextLine()\` consumes that leftover. Fix with an extra \`nextLine()\`.

**Q3. \`Scanner\` vs \`BufferedReader\`?**
\`Scanner\` parses typed tokens and is convenient but slower; \`BufferedReader\` reads raw lines, is faster, but you parse manually and it's not thread-safe-friendly for tokens.

**Q4. What exception does bad numeric input cause?**
\`InputMismatchException\`.`,
      exercises: `1. Read two integers and print their sum, product, and average.
2. Read an \`int\` then a full-line \`String\`; reproduce the newline bug, then fix it.
3. Use \`hasNextInt()\` to keep reading numbers until the user types a non-number.`,
      challenges: `Read a line containing several space-separated integers, then print their sum. (Hint: \`nextInt()\` in a \`while (sc.hasNextInt())\` loop, or split a \`nextLine()\` and parse each token.)`,
      summary: `- Wrap \`System.in\` in a **\`Scanner\`**; use typed \`next...()\` methods.
- The \`nextInt()\` → \`nextLine()\` **newline trap** is the #1 pitfall — consume the newline.
- \`BufferedReader\` is the faster, manual-parsing alternative.
- Handling invalid input with try/catch is covered in **Module 4**; file input in **Module 9**.`
    }),
    topic({
      id: "control-statements", chapter: "1.12", title: "Control Statements",
      subtitle: "Branching with if/else and switch — including modern switch expressions.",
      readTime: "11 min", level: "Beginner", deep: true,
      objectives: [
        "Write \`if\`/\`else-if\`/\`else\` ladders and nested conditionals.",
        "Use both classic \`switch\` and the enhanced \`switch\` (Java 14+).",
        "Explain fall-through and choose the right branching construct."
      ],
      concept: `**Control (decision) statements** choose which code runs based on conditions.

- **\`if\` / \`else if\` / \`else\`** — branch on any \`boolean\` condition.
- **\`switch\`** — branch on the value of a single variable (\`int\`, \`char\`, \`String\`, \`enum\`, …) against constant labels.

\`\`\`java
if (score >= 90)      grade = 'A';
else if (score >= 80) grade = 'B';
else                  grade = 'C';
\`\`\``,
      why: `Every non-trivial program must make decisions. \`if\` is the general tool; \`switch\` is clearer and often faster when comparing one value against many fixed options.`,
      internal: `**Classic \`switch\`** uses \`case\` labels and **falls through** to the next case unless you write \`break\`. That fall-through is intentional but a frequent bug source.

\`\`\`java
switch (day) {
    case 6:
    case 7:  System.out.println("Weekend"); break;  // 6 falls into 7
    default: System.out.println("Weekday");
}
\`\`\`

**Enhanced \`switch\`** (Java 14+) uses \`->\`, has **no fall-through**, and can be an **expression** that yields a value:

\`\`\`java
String type = switch (day) {
    case 6, 7 -> "Weekend";
    default   -> "Weekday";
};
\`\`\`

\`switch\` on \`String\` has been allowed since **Java 7**.`,
      useCases: `- \`if\` — range checks, compound boolean logic, null guards.
- \`switch\` — menu selection, mapping an enum/state to behaviour, classifying a fixed set of values.
- Ternary (\`?:\`) — a one-line value choice (from §1.10).`,
      code: `\`\`\`java
public class ControlDemo {
    public static void main(String[] args) {
        int month = 4;

        // enhanced switch expression (Java 14+)
        int days = switch (month) {
            case 1, 3, 5, 7, 8, 10, 12 -> 31;
            case 4, 6, 9, 11           -> 30;
            case 2                     -> 28;
            default -> throw new IllegalArgumentException("bad month");
        };
        System.out.println("Days: " + days);   // 30

        // classic switch with intentional fall-through
        char grade = 'B';
        switch (grade) {
            case 'A':
            case 'B': System.out.println("Great"); break;
            case 'C': System.out.println("Okay");  break;
            default:  System.out.println("Review");
        }
    }
}
\`\`\``,
      mistakes: `- **Missing \`break\`** in a classic \`switch\`, causing unintended fall-through.
- Using \`=\` instead of \`==\` in an \`if\` (only compiles for \`boolean\`, but a logic bug).
- Comparing \`String\` contents with \`==\` in conditions — use \`.equals()\` (**Module 3**).
- **Dangling else** — an \`else\` binds to the nearest unmatched \`if\`; use braces to be explicit.
- Deeply nested \`if\`s instead of an early-return guard or \`switch\`.`,
      bestPractices: `- Prefer the **enhanced \`switch\`** for many fixed options — no fall-through, can return a value.
- Use **guard clauses** (early \`return\`) to flatten nested conditions.
- Always brace your blocks, even single statements.
- Keep conditions simple and readable; extract complex tests into well-named boolean variables.`,
      interview: `**Q1. What is fall-through in \`switch\`?**
Without \`break\`, execution continues into subsequent cases. Enhanced \`switch\` (\`->\`) removes it.

**Q2. Which types can a \`switch\` use?**
\`byte/short/int/char\`, their wrappers, \`String\` (since Java 7), and \`enum\` (plus enhanced patterns in newer versions).

**Q3. \`if-else\` vs \`switch\` — when to use which?**
\`switch\` for one value against many constants; \`if-else\` for ranges or compound boolean logic.

**Q4. Can \`switch\` return a value?**
Yes — the enhanced \`switch\` **expression** (Java 14+) yields a value via \`->\` or \`yield\`.`,
      exercises: `1. Map a numeric score to a letter grade with an \`if-else\` ladder.
2. Rewrite it as an enhanced \`switch\` expression.
3. Write a classic \`switch\` that deliberately uses fall-through to group weekend days, then convert it to \`->\` form.`,
      challenges: `Build a tiny calculator: read two numbers and an operator char (\`+ - * /\`), then use a \`switch\` expression to compute and print the result, handling divide-by-zero gracefully.`,
      summary: `- \`if/else-if/else\` for general/boolean branching; \`switch\` for one value vs many constants.
- Classic \`switch\` **falls through** without \`break\`; enhanced \`switch\` (Java 14+) doesn't and can return a value.
- \`switch\` on \`String\` since Java 7; compare String content with \`.equals()\` (**Module 3**).
- Pattern matching for \`switch\` (Java 21) is covered with modern features in **Module 7**.`
    }),
    topic({
      id: "loops", chapter: "1.13", title: "Loops",
      subtitle: "Repeating work with for, while, do-while, and for-each.",
      readTime: "11 min", level: "Beginner", deep: true,
      objectives: [
        "Choose the right loop for a given task.",
        "Use \`break\`, \`continue\`, and labeled jumps correctly.",
        "Avoid off-by-one and infinite-loop bugs."
      ],
      concept: `A **loop** repeats a block while a condition holds. Java has four:

- **\`for\`** — known/counted iterations; init, condition, update in one header.
- **\`while\`** — repeat while a condition is true; may run **zero** times.
- **\`do-while\`** — runs the body **at least once**, then checks the condition.
- **Enhanced \`for\` (for-each)** — iterate every element of an array or \`Iterable\` without an index.

\`\`\`java
for (int i = 0; i < 5; i++) System.out.println(i);   // 0..4

int[] nums = {10, 20, 30};
for (int n : nums) System.out.println(n);            // for-each
\`\`\``,
      why: `Loops let a few lines process thousands of items. Picking the right loop makes intent obvious: \`for\` when you know the count, \`while\` when you don't, \`do-while\` when the body must run once, \`for-each\` when you just need each element.`,
      internal: `Mechanically: a \`for\` is a \`while\` with the counter folded into the header. The **enhanced for** compiles down to an index loop for arrays and to an \`Iterator\` for collections — which is why you **can't modify the collection's structure** while for-eaching it (that throws \`ConcurrentModificationException\`, detailed in **Module 5**) and why for-each gives you the element but **not its index**.

**Jump statements:** \`break\` exits the loop; \`continue\` skips to the next iteration; a **label** lets you break/continue an outer loop from inside a nested one:

\`\`\`java
outer:
for (int i = 0; i < 3; i++)
    for (int j = 0; j < 3; j++)
        if (i + j == 3) break outer;   // leaves both loops
\`\`\``,
      useCases: `- \`for\` — counting, index-based array traversal, fixed repetitions.
- \`while\` — read until end-of-input, retry until success, game loops.
- \`do-while\` — input validation menus (\"ask at least once\").
- \`for-each\` — summing/printing every element when the index is irrelevant.`,
      code: `\`\`\`java
public class LoopDemo {
    public static void main(String[] args) {
        // while: unknown count
        int n = 1, sum = 0;
        while (n <= 100) { sum += n; n++; }
        System.out.println(sum);            // 5050

        // do-while: runs at least once
        int x = 10;
        do { System.out.println("once at least: " + x); } while (x < 0);

        // continue + break
        for (int i = 1; i <= 10; i++) {
            if (i % 2 == 0) continue;       // skip evens
            if (i > 7) break;               // stop after 7
            System.out.print(i + " ");      // 1 3 5 7
        }
    }
}
\`\`\``,
      mistakes: `- **Off-by-one** errors (\`<=\` vs \`<\`) over- or under-running the range.
- **Infinite loops** — forgetting to update the loop variable or a condition that never turns false.
- Trying to get an index from a **for-each** (it doesn't expose one — use a classic \`for\`).
- Structurally modifying a collection while for-eaching it → \`ConcurrentModificationException\` (**Module 5**).
- Declaring the loop variable too widely, leaking it beyond the loop.`,
      bestPractices: `- Use **for-each** when you don't need the index — it's clearer and avoids bounds bugs.
- Keep loop bodies small; extract complex work into a method (§1.15).
- Avoid heavy computation in the loop **condition** (e.g. \`list.size()\` is fine, recomputation isn't).
- Prefer \`break\`/guard clauses over deeply nested loop logic.`,
      interview: `**Q1. \`while\` vs \`do-while\`?**
\`while\` checks first (may run zero times); \`do-while\` runs the body once before checking.

**Q2. When can't you use a for-each loop?**
When you need the index, need to modify the structure during iteration, or must iterate in reverse / multiple arrays in lockstep.

**Q3. What does a labeled \`break\` do?**
Exits the loop tagged by the label — useful to break out of **nested** loops at once.

**Q4. \`break\` vs \`continue\`?**
\`break\` ends the loop entirely; \`continue\` skips the rest of the current iteration and continues looping.`,
      exercises: `1. Print the multiplication table of 7 using a \`for\` loop.
2. Sum numbers entered until the user enters 0 (use \`while\`).
3. Print a right-angled triangle of \`*\` of height 5 using nested loops.`,
      challenges: `Print all prime numbers from 2 to 100. Use a nested loop with a labeled \`continue\` (or a boolean flag) to skip a number as soon as a divisor is found.`,
      summary: `- Four loops: **\`for\`** (counted), **\`while\`** (zero-or-more), **\`do-while\`** (at-least-once), **for-each** (each element).
- \`break\`/\`continue\` (+ labels) control flow inside loops.
- Watch for **off-by-one** and **infinite** loops; for-each gives no index.
- Functional iteration (\`stream().forEach\`) → **Module 7**; iterating collections → **Module 5**; complexity analysis → **Module 14**.`
    }),
    topic({
      id: "arrays", chapter: "1.14", title: "Arrays",
      subtitle: "Fixed-size, indexed collections of same-typed values.",
      readTime: "11 min", level: "Beginner", deep: true,
      objectives: [
        "Declare, initialise, and traverse 1-D and 2-D arrays.",
        "Explain that arrays are heap objects with a fixed \`length\`.",
        "Use the \`java.util.Arrays\` helpers and avoid common index bugs."
      ],
      concept: `An **array** is a fixed-size, ordered collection of elements of the **same type**, accessed by a zero-based **index**.

\`\`\`java
int[] nums = new int[5];        // 5 ints, all default to 0
int[] primes = {2, 3, 5, 7};    // declare + initialise
primes[0] = 11;                 // index access
System.out.println(primes.length);  // 4  (a field, not a method)
\`\`\`

Two dimensions (an array of arrays):

\`\`\`java
int[][] grid = {{1, 2, 3}, {4, 5, 6}};
System.out.println(grid[1][2]);     // 6
\`\`\``,
      why: `Arrays give **O(1)** random access by index and store elements compactly in contiguous memory. They're the foundation under most data structures and the natural choice when the number of elements is fixed and known.`,
      internal: `Arrays are **objects**, allocated on the **heap**; the variable holds a reference to them. Key consequences:

- \`length\` is a final field set at creation — **arrays can't grow or shrink**.
- Elements are initialised to **defaults** (\`0\`, \`0.0\`, \`false\`, \`\\u0000\`, \`null\`).
- Because the variable is a reference, assigning one array variable to another makes both point to the **same** array (aliasing); copy with \`Arrays.copyOf\` or \`clone()\` for an independent copy.
- A 2-D array is an array **of references** to row arrays, so rows can have different lengths (**jagged** arrays).`,
      useCases: `- Fixed-size buffers, lookup tables, matrices/grids.
- Returning multiple values of one type from a method.
- Backing storage for higher-level structures (\`ArrayList\` is array-backed — **Module 5**).`,
      code: `\`\`\`java
import java.util.Arrays;

public class ArrayDemo {
    public static void main(String[] args) {
        int[] a = {5, 2, 9, 1};

        // traverse
        for (int i = 0; i < a.length; i++) System.out.print(a[i] + " ");
        System.out.println();
        for (int v : a) System.out.print(v + " ");   // for-each
        System.out.println();

        // java.util.Arrays helpers
        Arrays.sort(a);                       // [1, 2, 5, 9]
        System.out.println(Arrays.toString(a));
        int idx = Arrays.binarySearch(a, 5);  // 2 (array must be sorted)
        int[] copy = Arrays.copyOf(a, 6);     // length 6, padded with 0

        // jagged 2-D array
        int[][] jagged = new int[2][];
        jagged[0] = new int[]{1, 2};
        jagged[1] = new int[]{3, 4, 5};
        System.out.println(idx + " " + Arrays.toString(copy));
    }
}
\`\`\``,
      mistakes: `- **\`ArrayIndexOutOfBoundsException\`** — valid indices are \`0\` to \`length - 1\`.
- Using \`length()\` (that's for \`String\`) instead of the array field \`length\`.
- Expecting an array to resize — it can't; use a \`List\` when the size varies (**Module 5**).
- Assuming assignment copies an array — it copies the **reference** (aliasing); use \`Arrays.copyOf\`/\`clone()\`.
- Calling \`Arrays.binarySearch\` on an **unsorted** array (undefined result).`,
      bestPractices: `- Prefer **for-each** when you don't need the index.
- Use \`java.util.Arrays\` utilities (\`sort\`, \`fill\`, \`equals\`, \`toString\`, \`copyOf\`) instead of hand-rolling.
- When the count changes at runtime, reach for \`ArrayList\` (**Module 5**) rather than reallocating arrays.
- Print arrays with \`Arrays.toString\` / \`Arrays.deepToString\` (plain \`toString()\` shows a hashcode).`,
      interview: `**Q1. Array vs \`ArrayList\`?**
Array is fixed-size, can hold primitives, uses \`[]\`; \`ArrayList\` is resizable, holds objects only, and offers list methods (detail in **Module 5**).

**Q2. Is \`length\` a method or a field?**
A **field** for arrays (\`a.length\`); \`String\` uses the method \`length()\`.

**Q3. Default values in a \`new int[3]\`?**
All \`0\` (numbers \`0\`, boolean \`false\`, references \`null\`).

**Q4. Can a 2-D array have rows of different lengths?**
Yes — Java 2-D arrays are arrays of arrays, so they can be **jagged**.

**Q5. What happens on an out-of-range index?**
A runtime \`ArrayIndexOutOfBoundsException\`.`,
      exercises: `1. Find the maximum and minimum of an \`int[]\` in a single pass.
2. Reverse an array in place without using a second array.
3. Build a 3×3 multiplication grid in a 2-D array and print it row by row.`,
      challenges: `Given an \`int[]\`, return a new array with duplicates removed, preserving first-seen order — using only arrays (no \`Set\`/\`List\`). Discuss why a \`Set\` would be simpler (foreshadowing **Module 5**).`,
      summary: `- Arrays are **fixed-size**, **same-type**, **zero-indexed** heap **objects**; \`length\` is a field.
- Elements get **default values**; assignment aliases the reference (copy with \`Arrays.copyOf\`).
- 2-D arrays are arrays of arrays and may be **jagged**; use \`java.util.Arrays\` helpers.
- Resizable lists → **Module 5**; sorting algorithms & Big-O → **Module 14**.`
    }),
    topic({
      id: "methods", chapter: "1.15", title: "Methods",
      subtitle: "Reusable blocks of logic — parameters, return values, overloading, recursion.",
      readTime: "12 min", level: "Beginner", deep: true,
      objectives: [
        "Define and call methods with parameters and return values.",
        "Explain that Java is strictly pass-by-value.",
        "Use method overloading, varargs, and recursion correctly."
      ],
      concept: `A **method** is a named block of code that performs a task and optionally returns a value. Its **signature** is the name plus parameter list; the return type precedes the name.

\`\`\`java
//        return type        parameters
static int add(int a, int b) {
    return a + b;             // returns an int
}
// call:
int sum = add(3, 4);         // 7
\`\`\`

\`void\` means the method returns nothing. \`static\` methods belong to the class and are called without an object; **instance** methods need an object (full treatment in **Module 2**).`,
      why: `Methods give you **reuse**, **abstraction**, and **testability** — write logic once, call it everywhere, and reason about each piece in isolation (the DRY principle). They're the unit of decomposition in every real codebase.`,
      internal: `**Java is pass-by-value — always.** A method receives a **copy** of each argument:

- For a **primitive**, the value is copied; changing the parameter doesn't affect the caller.
- For an **object**, the **reference** is copied — both copies point to the same object, so you can mutate the object's fields, but reassigning the parameter doesn't change the caller's variable.

\`\`\`java
static void tryReassign(int[] arr) {
    arr[0] = 99;            // visible to caller (same object)
    arr = new int[]{0};    // NOT visible (reassigns the local copy)
}
\`\`\`

**Overloading** = multiple methods with the same name but different parameter lists; the compiler picks one at **compile time** based on argument types. **Recursion** = a method calling itself; each call adds a **stack frame**, so it needs a **base case** or it throws \`StackOverflowError\`.`,
      useCases: `- Encapsulating a calculation (\`calculateTax\`), validation, or formatting.
- Overloading for convenience APIs (\`println(int)\`, \`println(String)\`, …).
- \`varargs\` for variable argument counts (\`String.format\`, \`Math.max\` style helpers).
- Recursion for naturally self-similar problems (factorial, tree traversal — **Module 14**).`,
      code: `\`\`\`java
public class MethodDemo {
    // overloading: same name, different parameters
    static int area(int side)            { return side * side; }
    static int area(int w, int h)        { return w * h; }

    // varargs: zero or more ints
    static int sum(int... nums) {
        int total = 0;
        for (int n : nums) total += n;
        return total;
    }

    // recursion with a base case
    static long factorial(int n) {
        if (n <= 1) return 1;            // base case
        return n * factorial(n - 1);     // recursive step
    }

    public static void main(String[] args) {
        System.out.println(area(5));         // 25
        System.out.println(area(3, 4));      // 12
        System.out.println(sum(1, 2, 3, 4)); // 10
        System.out.println(factorial(5));    // 120
    }
}
\`\`\``,
      mistakes: `- Believing Java is **pass-by-reference** — it's pass-by-value (the reference itself is passed by value).
- Confusing **overloading** (compile-time, different parameters) with **overriding** (runtime, subclass — **Module 2**).
- Recursion with **no base case** → \`StackOverflowError\`.
- Forgetting a \`return\` in a non-\`void\` method, or unreachable code after \`return\`.
- Overloads that differ only by **return type** — illegal; the parameter list must differ.`,
      bestPractices: `- One method, one responsibility; keep methods short and well-named (verbs).
- Limit the parameter count; group related values into an object when it grows.
- Prefer iteration over recursion for very deep problems (avoids stack overflow).
- Put the \`varargs\` parameter **last**, and use it sparingly.`,
      interview: `**Q1. Is Java pass-by-value or pass-by-reference?**
Strictly **pass-by-value** — object references are themselves passed by value, so you can mutate the object but not reassign the caller's variable.

**Q2. Overloading vs overriding?**
Overloading: same name, different parameters, resolved at compile time. Overriding: subclass redefines a superclass method, resolved at runtime (**Module 2**).

**Q3. Can two overloads differ only by return type?**
No — the parameter lists must differ.

**Q4. What causes \`StackOverflowError\`?**
Unbounded recursion (missing/incorrect base case) exhausting the call stack.

**Q5. Can \`main\` be overloaded?**
Yes, but the JVM only launches \`public static void main(String[] args)\`.`,
      exercises: `1. Write overloaded \`max\` methods for two ints and for three ints.
2. Write a \`varargs\` \`average(double...)\` and test it with different counts.
3. Implement \`power(base, exp)\` recursively with a correct base case.`,
      challenges: `Write a recursive method to reverse a \`String\`, then an iterative version. Compare their stack usage and explain which you'd prefer for very long input (tie it to \`StackOverflowError\`).`,
      summary: `- A method = signature + body; \`static\` belongs to the class, instance methods to objects (**Module 2**).
- Java is **pass-by-value**; object references are passed by value (mutate-yes, reassign-no).
- **Overloading** = compile-time, different parameters; **recursion** needs a **base case**.
- Overriding/polymorphism → **Module 2**; lambdas & method references → **Module 7**; recursion in DSA → **Module 14**.`
    }),
    topic({
      id: "command-line-arguments", chapter: "1.16", title: "Command Line Arguments",
      subtitle: "Passing inputs to a program at launch via main's String[] args.",
      readTime: "8 min", level: "Beginner", deep: true,
      objectives: [
        "Read values supplied on the command line through \`args\`.",
        "Convert string arguments into numbers safely.",
        "Distinguish command-line arguments from interactive input."
      ],
      concept: `The \`main\` method's parameter \`String[] args\` holds the **command-line arguments** — values typed after the program name when you launch it. They arrive **as Strings**, in order, space-separated.

\`\`\`bash
java Greet Shail 25
\`\`\`
\`\`\`java
public class Greet {
    public static void main(String[] args) {
        System.out.println(args[0]);   // Shail
        System.out.println(args[1]);   // 25  (a String, not an int)
        System.out.println(args.length); // 2
    }
}
\`\`\``,
      why: `Command-line arguments let users configure a run **without changing code** — file paths, flags, modes, counts. They're how scripts, build tools, and batch jobs feed inputs to a program non-interactively.`,
      internal: `When you run \`java Program a b c\`, the JVM splits the text after the class name on whitespace and passes the tokens to \`main\` as an array. Notes:

- \`args[0]\` is the **first argument**, *not* the program name (unlike C, where \`argv[0]\` is the program). Java's class name is not in \`args\`.
- An empty command line yields a **zero-length** array (not \`null\`), so \`args.length\` is \`0\`.
- Everything is a \`String\`; numbers must be **parsed** (\`Integer.parseInt\`) — there's no automatic typing (parsing vs casting, §1.9).
- Use quotes to pass an argument that contains spaces: \`java Greet "Shail Kumar"\`.`,
      useCases: `- File paths and config for CLI tools (\`java Backup /data /backup\`).
- Flags/modes (\`--verbose\`, \`fast\`).
- Feeding inputs in automated scripts, CI jobs, and cron tasks where no human is present to type.`,
      code: `\`\`\`java
public class Sum {
    public static void main(String[] args) {
        if (args.length < 2) {
            System.out.println("Usage: java Sum <num1> <num2>");
            return;                                   // guard against missing args
        }
        int a = Integer.parseInt(args[0]);            // String -> int
        int b = Integer.parseInt(args[1]);
        System.out.println("Sum = " + (a + b));
    }
}
\`\`\`
\`\`\`bash
java Sum 12 30        ->  Sum = 42
java Sum              ->  Usage: java Sum <num1> <num2>
\`\`\``,
      mistakes: `- Accessing \`args[0]\` when **no** arguments were passed → \`ArrayIndexOutOfBoundsException\`. Check \`args.length\` first.
- Treating a numeric argument as an \`int\` directly — you must \`parseInt\`; bad input throws \`NumberFormatException\` (handling → **Module 4**).
- Forgetting that a multi-word argument needs **quotes**, otherwise it becomes several arguments.
- Assuming \`args[0]\` is the program name (it isn't in Java).`,
      bestPractices: `- **Validate** \`args.length\` and print a clear *usage* message before using arguments.
- Parse defensively and handle \`NumberFormatException\` (**Module 4**).
- For anything beyond a couple of arguments, use a real CLI library (e.g. **picocli**, **Apache Commons CLI**) instead of hand-parsing flags.
- Prefer command-line args for non-interactive runs; use \`Scanner\` (§1.11) when you need to prompt a human.`,
      interview: `**Q1. What is \`String[] args\`?**
The array of command-line arguments passed to \`main\` at launch, in order, as Strings.

**Q2. Is the program name included in \`args\`?**
No — \`args[0]\` is the first user argument; Java does not put the class name in the array.

**Q3. How do you use a numeric command-line argument?**
Parse it: \`int n = Integer.parseInt(args[0]);\`.

**Q4. What if no arguments are passed?**
\`args\` is a non-null array of length 0; indexing it throws \`ArrayIndexOutOfBoundsException\`.

**Q5. Command-line arguments vs \`Scanner\` input?**
Args are supplied once at startup (non-interactive); \`Scanner\` reads interactively while the program runs.`,
      exercises: `1. Print every command-line argument on its own line, numbered.
2. Read two numbers from \`args\` and print their product, with a usage check.
3. Accept a name as one quoted argument and greet that person.`,
      challenges: `Write a program that accepts any number of numeric arguments and prints their sum and average. Guard against zero arguments and non-numeric input (tie the error handling forward to **Module 4**).`,
      summary: `- \`main(String[] args)\` receives **command-line arguments** as Strings, in order.
- \`args[0]\` is the first argument (the class name is **not** included); empty line → length-0 array.
- **Parse** numeric args with \`Integer.parseInt\`; always validate \`args.length\` first.
- Robust error handling → **Module 4**; for complex CLIs use a parsing library.`
    }),
  ]
});
