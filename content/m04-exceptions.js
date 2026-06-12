/* Module 4: Exception Handling — edit ONLY this file for this module's content.
   Authored at ~2x Module 2 depth, ordered BASIC -> ADVANCED:
     4.1 intro -> 4.2 hierarchy -> 4.3 checked -> 4.4 unchecked -> 4.5 try-catch
     -> 4.6 multi-catch -> 4.7 finally -> 4.8 throw -> 4.9 throws
     -> 4.10 try-with-resources -> 4.11 custom -> 4.12 chained & stack traces
     -> 4.13 best practices.
   Each topic() renders sections in declared order; see assets/site.js PART_LABELS. */
registerModule({
  id: "exceptions",
  module: "Exception Handling",
  page: "module-exceptions.html",
  icon: "⚠️",
  tagline: "From your first try-catch to custom exceptions, resources, and clean error design.",
  lessons: [

    /* ===================== BASIC ===================== */

    /* 4.1 Introduction to Exceptions — what they are and why they matter. */
    topic({
      id: "intro-to-exceptions", chapter: "4.1", title: "Introduction to Exceptions",
      subtitle: "What an exception is, why Java has them, and how they change control flow.",
      readTime: "15 min", level: "Foundational", deep: true,
      objectives: [
        "Define an exception and distinguish errors from exceptions.",
        "Explain why exceptions are better than error codes for handling failure.",
        "Describe how an exception changes the normal flow of execution.",
        "Recognise common exceptions you'll meet immediately."
      ],
      concept: `An **exception** is an **event that disrupts the normal flow** of a program when something goes wrong at runtime — dividing by zero, opening a missing file, indexing past an array's end, or calling a method on \`null\`. Instead of letting the program silently produce garbage or crash unpredictably, Java **throws** an exception: it creates an exception **object** describing the problem and transfers control to code that can **handle** it.

\`\`\`java
int[] a = {1, 2, 3};
System.out.println(a[5]);   // throws ArrayIndexOutOfBoundsException at runtime
\`\`\`

If nothing handles the exception, the program **terminates** and prints a **stack trace** (§4.12). Exception **handling** (§4.5 onward) lets you respond gracefully instead.`,
      why: `Why does Java have a whole mechanism for this instead of returning error codes?

- **Separation of concerns** — normal logic stays clean; error-handling lives in dedicated \`catch\` blocks rather than being tangled into every line.
- **Can't be silently ignored** — a thrown exception propagates until handled; an ignored error *code* (\`-1\`) often slips through unnoticed.
- **Rich error information** — an exception object carries a message, type, cause, and full stack trace (§4.12), far more than an integer code.
- **Propagation** — an exception automatically travels up the call stack to a caller equipped to deal with it, so low-level code needn't know how to recover.
- **Type safety** — different failure kinds are different **types**, so you can handle each specifically.

This is foundational for robust, production-grade software and a guaranteed interview area.`,
      errorsVsExceptions: `A key early distinction (both extend \`Throwable\`, §4.2):

| | **Exception** | **Error** |
|---|---|---|
| Represents | A problem the app can reasonably **handle/recover** from | A serious **JVM/system** failure |
| Examples | \`IOException\`, \`SQLException\`, \`NullPointerException\` | \`OutOfMemoryError\`, \`StackOverflowError\` |
| Should you catch it? | Often yes | Generally **no** — usually unrecoverable |
| Cause | Programmer/environment conditions | Environment/JVM limits |

> Rule: you handle **exceptions**; you usually **don't** try to handle **errors** — there's little a program can sensibly do after the JVM runs out of memory.`,
      internal: `When an exception is thrown, the JVM:

1. **Creates an exception object** (capturing the message and a snapshot of the call stack — the stack trace, §4.12).
2. **Stops normal execution** at the throw point.
3. **Searches the call stack** for a matching handler — the current method, then its caller, then *its* caller, and so on (this is **propagation**, §4.12).
4. If a matching \`catch\` is found, control jumps there; if none exists anywhere, the **default handler** prints the stack trace and **terminates the thread**.

\`\`\`
methodC()  -- throws -->   no handler
   ▲
methodB()                  no handler
   ▲
methodA()                  catch! -> handled here
\`\`\`

So an exception "bubbles up" until someone catches it or the program ends.`,
      commonOnes: `Exceptions you'll hit in your first week (all unchecked — §4.4):

| Exception | Typical cause |
|---|---|
| \`NullPointerException\` | calling a method/field on \`null\` |
| \`ArrayIndexOutOfBoundsException\` | array index < 0 or ≥ length |
| \`StringIndexOutOfBoundsException\` | bad \`charAt\`/\`substring\` index (Module 3) |
| \`ArithmeticException\` | integer division by zero |
| \`NumberFormatException\` | \`Integer.parseInt("abc")\` (Module 3 §3.9) |
| \`ClassCastException\` | invalid downcast (Module 2 §2.9) |

Recognising the **type** instantly tells you what went wrong — that's the power of typed exceptions.`,
      code: `\`\`\`java
public class IntroDemo {
    public static void main(String[] args) {
        System.out.println("start");          // runs

        try {
            int x = 10 / 0;                    // throws ArithmeticException
            System.out.println("never reached");
        } catch (ArithmeticException e) {
            System.out.println("handled: " + e.getMessage()); // "/ by zero"
        }

        System.out.println("program continues"); // execution resumes normally
    }
}
\`\`\`

Without the \`try-catch\`, the division would print a stack trace and end the program. With it, the program recovers and continues.`,
      mistakes: `- **Confusing errors with exceptions** — trying to "handle" \`OutOfMemoryError\` rarely makes sense.
- **Thinking exceptions are for normal control flow** — they're for *exceptional* conditions, not loops/branching.
- **Assuming code after an uncaught throw runs** — it doesn't; control leaves the method immediately.
- **Ignoring the stack trace** — it pinpoints the failure (§4.12); don't discard it.
- **Catching everything and continuing blindly** — swallowing exceptions hides real bugs (§4.13).`,
      bestPractices: `- Use exceptions for **exceptional/error conditions**, not ordinary flow control.
- Handle what you can **recover** from; let truly unrecoverable problems (errors) terminate.
- Preserve and read the **stack trace** to diagnose (§4.12).
- Catch **specific** types, not blanket \`Exception\`/\`Throwable\` (§4.5/§4.13).
- Fail with **clear messages** so the cause is obvious downstream.`,
      interview: `**Q1. What is an exception?**
A runtime event that disrupts normal program flow; Java represents it as a \`Throwable\` object and transfers control to a handler (or terminates).

**Q2. Difference between an Error and an Exception?**
Both extend \`Throwable\`; \`Exception\` is a recoverable application-level problem, \`Error\` is a serious JVM/system failure you generally shouldn't catch.

**Q3. What happens if an exception isn't caught?**
It propagates up the call stack; if unhandled, the default handler prints the stack trace and terminates the thread.

**Q4. Why use exceptions instead of error codes?**
Cleaner separation of logic and error handling, can't be silently ignored, carry rich info (type/message/cause/trace), and propagate automatically.

**Q5. Name three common runtime exceptions.**
\`NullPointerException\`, \`ArrayIndexOutOfBoundsException\`, \`ArithmeticException\`.

**Q6. Is exception handling for normal control flow?**
No — only for exceptional conditions; using it for routine branching is an anti-pattern.`,
      exercises: `1. Trigger and observe (uncaught) a \`NullPointerException\`, \`ArrayIndexOutOfBoundsException\`, and \`ArithmeticException\`; read each stack trace.
2. Wrap one of them in a \`try-catch\` and show the program continues afterwards.
3. Classify a list of failures (out of memory, file not found, divide by zero, stack overflow) as Error vs Exception.
4. Print \`e.getMessage()\` and \`e.getClass().getName()\` for a caught exception.`,
      challenges: `Write a method that reads an \`int\` index from input and returns \`array[index]\`. Without exception handling, show how a bad index crashes the program; then add handling so it returns a sensible default and logs the failure type and message. Finally, explain in two sentences why returning a magic value like \`-1\` would be inferior to throwing/handling a typed exception.`,
      summary: `- An **exception** is a runtime event that disrupts normal flow; Java throws a \`Throwable\` object and transfers control to a handler.
- **Errors** (JVM/system, e.g., \`OutOfMemoryError\`) are generally unrecoverable; **Exceptions** are application problems you handle.
- Uncaught exceptions **propagate** up the stack and, if unhandled, print a **stack trace** (§4.12) and terminate.
- Exceptions beat error codes (separation, rich info, can't be ignored). The hierarchy is **§4.2**; handling starts at **§4.5**.`
    }),

    /* 4.2 Exception Hierarchy — Throwable family tree. */
    topic({
      id: "exception-hierarchy", chapter: "4.2", title: "Exception Hierarchy",
      subtitle: "The Throwable family tree — Error, Exception, and RuntimeException.",
      readTime: "15 min", level: "Core", deep: true,
      objectives: [
        "Draw the Throwable hierarchy and place key classes in it.",
        "Distinguish Error, checked Exception, and unchecked RuntimeException branches.",
        "Explain why the hierarchy determines compile-time vs runtime obligations.",
        "Use the hierarchy to catch at the right level of specificity."
      ],
      concept: `All throwable things in Java descend from one root class: **\`java.lang.Throwable\`**. Only objects that are (subclasses of) \`Throwable\` can be used with \`throw\` and \`catch\`. Below it are two main branches:

\`\`\`
                 Throwable
                /         \\
            Error         Exception
        (unrecoverable)   /        \\
                  RuntimeException   (other checked exceptions)
                  (unchecked)       e.g. IOException, SQLException
\`\`\`

- **\`Error\`** — serious JVM problems (\`OutOfMemoryError\`, \`StackOverflowError\`); don't catch (§4.1).
- **\`Exception\`** — application problems you handle. It splits again:
  - **\`RuntimeException\`** and its subclasses → **unchecked** (§4.4).
  - **Everything else** under \`Exception\` → **checked** (§4.3).

This single tree decides the **rules the compiler enforces**.`,
      why: `The hierarchy isn't trivia — it drives behavior:

- **Compile-time obligation** is determined by *which branch* a class sits in: checked exceptions (under \`Exception\` but not \`RuntimeException\`) **must** be declared or handled (§4.3); unchecked ones (under \`RuntimeException\`) need not be (§4.4).
- **Catching is polymorphic**: a \`catch (Exception e)\` catches *any* subclass, so order and specificity matter (§4.6). Knowing the tree lets you catch at the right level.
- **Designing custom exceptions** (§4.11) means choosing the right parent — extend \`Exception\` (checked) or \`RuntimeException\` (unchecked).`,
      theTree: `**A fuller map of the hierarchy:**

| Level | Class | Branch | Checked? |
|---|---|---|---|
| root | \`Throwable\` | — | — |
| | \`Error\` | Error | no (don't catch) |
| | ↳ \`OutOfMemoryError\`, \`StackOverflowError\` | Error | no |
| | \`Exception\` | Exception | **checked** |
| | ↳ \`IOException\`, \`SQLException\`, \`ClassNotFoundException\` | Exception | **checked** |
| | ↳ \`RuntimeException\` | Runtime | **unchecked** |
| | ↳↳ \`NullPointerException\`, \`ArithmeticException\` | Runtime | unchecked |
| | ↳↳ \`IllegalArgumentException\`, \`IndexOutOfBoundsException\` | Runtime | unchecked |

> Memory aid: **"checked = compiler-checked."** If it's a \`RuntimeException\` (or \`Error\`), the compiler does **not** force you to handle it.`,
      throwableMembers: `Because everything inherits from \`Throwable\`, every exception offers these key methods (used throughout this module):

| Method | Returns |
|---|---|
| \`getMessage()\` | the detail message you passed in |
| \`getCause()\` | the underlying \`Throwable\` that caused this (§4.12) |
| \`printStackTrace()\` | dumps the stack trace to stderr (§4.12) |
| \`getStackTrace()\` | the stack frames as an array |
| \`getSuppressed()\` | exceptions suppressed by try-with-resources (§4.10) |

\`Throwable\` also has two constructor families you'll use in custom exceptions (§4.11): \`(String message)\` and \`(String message, Throwable cause)\`.`,
      internal: `The compiler performs **static analysis** of the hierarchy: for any \`throw\` or called method that can throw a **checked** exception, it verifies the exception is either caught or declared with \`throws\` (§4.3/§4.9) — the **"handle or declare" rule**. \`RuntimeException\` and \`Error\` are exempt from this check, which is the *entire* practical meaning of "unchecked." At runtime, \`catch\` matching is by **\`instanceof\`**: a handler catches the thrown object if its type is the catch type or a subclass — so a broad catch (e.g., \`Exception\`) is a catch-all for its subtree.`,
      useCases: `- **Choosing what to catch**: catch \`IOException\` for I/O, \`SQLException\` for JDBC (Module 10), or a common ancestor when handling is identical.
- **Designing APIs**: decide checked vs unchecked for your own exceptions (§4.11) by picking the parent.
- **Framework boundaries**: many frameworks (e.g., Spring) translate checked exceptions into unchecked ones for cleaner code.
- **Diagnostics**: using \`getCause\`/\`getStackTrace\` to trace failures (§4.12).`,
      code: `\`\`\`java
public class HierarchyDemo {
    public static void main(String[] args) {
        // catching a common ancestor handles many subtypes
        try {
            Object o = "text";
            Integer n = (Integer) o;       // ClassCastException (a RuntimeException)
        } catch (RuntimeException e) {      // catches CCE and any other RuntimeException
            System.out.println(e.getClass().getSimpleName()); // ClassCastException
        }

        // proving the instanceof relationship
        Exception ex = new NullPointerException("npe");
        System.out.println(ex instanceof RuntimeException); // true
        System.out.println(ex instanceof Exception);        // true
        System.out.println(ex instanceof Throwable);        // true
    }
}
\`\`\``,
      mistakes: `- **Catching \`Throwable\`/\`Error\`** — this also traps \`OutOfMemoryError\`/\`StackOverflowError\`, which you can't sensibly handle.
- **Assuming all exceptions are checked** — only the non-\`RuntimeException\` subtree of \`Exception\` is.
- **Catching a superclass before a subclass** — unreachable \`catch\` for the subtype (compile error, §4.6).
- **Extending the wrong parent** for custom exceptions — checked vs unchecked changes caller obligations (§4.11).
- **Forgetting the common \`Throwable\` methods** (\`getCause\`, \`getMessage\`) when diagnosing.`,
      bestPractices: `- Catch the **most specific** type that you can actually handle; use a common ancestor only when handling is identical.
- **Never** catch \`Error\` or bare \`Throwable\` in application code.
- Pick custom-exception parents deliberately: \`RuntimeException\` for programming errors, \`Exception\` for recoverable conditions (§4.11/§4.13).
- Lean on \`getMessage\`/\`getCause\`/\`getStackTrace\` for diagnostics; preserve causes (§4.12).
- Know the tree well enough to predict what a given \`catch\` will and won't trap.`,
      interview: `**Q1. What is the root of the exception hierarchy?**
\`java.lang.Throwable\`; only its subclasses can be thrown/caught.

**Q2. What are the two direct subclasses of Throwable?**
\`Error\` and \`Exception\`.

**Q3. Where do checked vs unchecked exceptions sit?**
Unchecked = \`RuntimeException\` (and \`Error\`) subtree; checked = the rest of the \`Exception\` subtree.

**Q4. Why shouldn't you catch \`Error\`?**
Errors signal serious JVM problems (OOM, stack overflow) that are generally unrecoverable.

**Q5. How does \`catch\` decide a match?**
By \`instanceof\` — a handler matches if the thrown object is the catch type or a subclass.

**Q6. Is \`NullPointerException\` checked or unchecked?**
Unchecked — it extends \`RuntimeException\`.

**Q7. Which Throwable methods help diagnose failures?**
\`getMessage\`, \`getCause\`, \`getStackTrace\`/\`printStackTrace\`, \`getSuppressed\`.`,
      exercises: `1. Draw the hierarchy from \`Throwable\` down to \`NullPointerException\` and \`IOException\`, labeling checked/unchecked.
2. Use \`instanceof\` to verify \`NullPointerException\` is a \`RuntimeException\`, \`Exception\`, and \`Throwable\`.
3. Catch \`RuntimeException\` and show it traps both \`ArithmeticException\` and \`ClassCastException\`.
4. List which of \`IOException\`, \`SQLException\`, \`NumberFormatException\`, \`OutOfMemoryError\` are checked, unchecked, or errors.`,
      challenges: `Write a small classifier method \`String classify(Throwable t)\` that returns \`"ERROR"\`, \`"CHECKED"\`, or \`"UNCHECKED"\` based purely on the hierarchy (using \`instanceof\` against \`Error\` and \`RuntimeException\`). Test it with at least five throwables. Then explain how this same hierarchy reasoning guides the parent you'd pick when designing a custom exception in §4.11.`,
      summary: `- Everything throwable descends from **\`Throwable\`**; its children are **\`Error\`** (don't catch) and **\`Exception\`**.
- Under \`Exception\`: **\`RuntimeException\` = unchecked (§4.4)**; everything else = **checked (§4.3)**.
- The branch decides the compiler's **"handle or declare"** obligation; \`catch\` matches by \`instanceof\`.
- Use \`Throwable\` methods (\`getMessage\`/\`getCause\`/\`getStackTrace\`) to diagnose; choose custom-exception parents by branch (§4.11).`
    }),

    /* 4.3 Checked Exceptions — compile-time enforced. */
    topic({
      id: "checked-exceptions", chapter: "4.3", title: "Checked Exceptions",
      subtitle: "Compiler-enforced exceptions you must handle or declare.",
      readTime: "14 min", level: "Core", deep: true,
      objectives: [
        "Define checked exceptions and the 'handle or declare' rule.",
        "Identify common checked exceptions and when they occur.",
        "Decide between catching and propagating a checked exception.",
        "Weigh the debate around checked exceptions in modern Java."
      ],
      concept: `A **checked exception** is one the **compiler forces you to deal with** at compile time. These are subclasses of \`Exception\` that are **not** subclasses of \`RuntimeException\` (§4.2). If your code calls something that can throw a checked exception, you **must** either:

1. **Handle** it with \`try-catch\` (§4.5), or
2. **Declare** it with \`throws\` (§4.9) so the caller deals with it.

This is the **"handle or declare"** rule. Skip both and the code **won't compile**.

\`\`\`java
import java.io.*;
// won't compile without handling/declaring FileReader's IOException:
BufferedReader r = new BufferedReader(new FileReader("data.txt")); // checked
\`\`\``,
      why: `Checked exceptions exist to make **recoverable, expected failures impossible to forget**. They represent conditions outside the program's control that a well-written caller should anticipate:

- A file might not exist (\`FileNotFoundException\`).
- A network/database call might fail (\`IOException\`, \`SQLException\`).
- A class to load might be missing (\`ClassNotFoundException\`).

By making the compiler enforce handling, Java pushes you to think about failure paths for these *expected* problems — rather than discovering them only in production.`,
      common: `**Common checked exceptions:**

| Exception | Thrown when |
|---|---|
| \`IOException\` | I/O failure (files, streams, network) — Module 9 |
| \`FileNotFoundException\` | a file path can't be opened (subclass of IOException) |
| \`SQLException\` | a database operation fails — Module 10 |
| \`ClassNotFoundException\` | a class can't be located at runtime |
| \`InterruptedException\` | a thread is interrupted while waiting/sleeping — Module 8 |
| \`ParseException\` | text parsing fails (e.g., dates) |

The presence of any of these in a method's \`throws\` clause tells you the caller must handle or propagate.`,
      handleOrDeclare: `**The two ways to satisfy the compiler:**

\`\`\`java
// Option 1: HANDLE it here
void readConfig() {
    try {
        Files.readString(Path.of("config.txt"));  // throws IOException (checked)
    } catch (IOException e) {
        System.out.println("using defaults: " + e.getMessage());
    }
}

// Option 2: DECLARE it and let the caller handle it
void readConfig2() throws IOException {            // propagate up (§4.9)
    Files.readString(Path.of("config.txt"));
}
\`\`\`

Choose **handle** when *this* method can meaningfully recover; choose **declare** when the **caller** is better positioned to decide. Don't catch-and-ignore just to silence the compiler (§4.13).`,
      internal: `Checked-ness is **purely a compile-time contract** — there's no runtime difference between a checked and unchecked exception object; both are ordinary \`Throwable\`s. The compiler tracks, for each method, the set of checked exceptions it can throw (its own \`throw\`s plus those of methods it calls) and verifies every one is caught or declared. This is why **overriding** rules (Module 2 §2.8) say an override can throw **fewer/narrower** checked exceptions but not new/broader ones — it must honor the caller's compile-time expectations.`,
      debate: `**The checked-exceptions debate** (good senior-level talking point): critics argue checked exceptions:

- clutter signatures and force boilerplate (\`throws IOException\` everywhere),
- break **lambda/stream** code (functional interfaces don't declare checked exceptions — Module 7),
- tempt developers to **swallow** them (\`catch (IOException e) {}\`) just to compile.

Many modern frameworks (Spring) and languages (Kotlin, C#) avoid or wrap them. The pragmatic middle ground: use checked exceptions for **genuinely recoverable** conditions a caller should handle; otherwise prefer unchecked (§4.4) and wrap checked ones at boundaries (§4.12). Either way, never swallow them silently.`,
      useCases: `- **File / network I/O** (Module 9): the file may be missing, the socket may drop.
- **Database access** (Module 10): \`SQLException\` on query/connection failure.
- **Concurrency waits** (Module 8): \`InterruptedException\` from \`sleep\`/\`wait\`/\`join\`.
- **Parsing external data**: dates, custom formats that may be malformed.`,
      code: `\`\`\`java
import java.io.*;
import java.nio.file.*;

public class CheckedDemo {
    // declares -> caller must handle/declare
    static String load(String path) throws IOException {
        return Files.readString(Path.of(path));
    }
    public static void main(String[] args) {
        try {
            String text = load("notes.txt");          // must handle IOException
            System.out.println(text.length());
        } catch (FileNotFoundException e) {            // more specific first (§4.6)
            System.out.println("no such file");
        } catch (IOException e) {                       // broader fallback
            System.out.println("I/O error: " + e.getMessage());
        }
    }
}
\`\`\``,
      mistakes: `- **Swallowing to compile** — \`catch (IOException e) {}\` hides failures; at minimum log or rethrow (§4.13).
- **Declaring \`throws Exception\`** everywhere — too broad; it forces callers to handle the most generic type and hides specifics.
- **Catching a checked exception you can't handle** instead of declaring it for a caller who can.
- **Forgetting overriding limits** — an override can't add new checked exceptions (Module 2 §2.8).
- **Using checked exceptions in lambdas/streams** without wrapping — they won't compile (Module 7).`,
      bestPractices: `- Apply **"handle or declare"** intentionally: handle where you can recover, declare where the caller should.
- Catch the **most specific** checked type; order specific-before-general (§4.6).
- **Never swallow** — log with context or wrap-and-rethrow preserving the cause (§4.12).
- Keep \`throws\` clauses **precise** (list real types), not \`throws Exception\`.
- Consider **unchecked wrapping** at architectural boundaries to keep core logic clean (§4.12/§4.13).`,
      interview: `**Q1. What is a checked exception?**
An exception the compiler forces you to handle or declare; it extends \`Exception\` but not \`RuntimeException\`.

**Q2. What is the 'handle or declare' rule?**
For any checked exception a method can throw, you must either catch it or declare it with \`throws\`, or the code won't compile.

**Q3. Give examples of checked exceptions.**
\`IOException\`, \`SQLException\`, \`ClassNotFoundException\`, \`InterruptedException\`, \`ParseException\`.

**Q4. Is there a runtime difference between checked and unchecked?**
No — it's purely a compile-time contract; both are normal \`Throwable\` objects.

**Q5. Why do some consider checked exceptions problematic?**
Boilerplate in signatures, friction with lambdas/streams, and the temptation to swallow them.

**Q6. Can an overriding method throw a new checked exception?**
No — only the same or narrower checked exceptions than the overridden method (Module 2 §2.8).`,
      exercises: `1. Call \`Files.readString\` and satisfy the compiler two ways: once by handling, once by declaring \`throws IOException\`.
2. Write a method that catches \`FileNotFoundException\` specifically and \`IOException\` generally.
3. Show that an empty \`catch\` compiles but hides a failure; replace it with proper logging.
4. List which of \`IOException\`, \`NullPointerException\`, \`SQLException\`, \`ArithmeticException\` are checked.`,
      challenges: `Build a \`ConfigLoader\` that reads a file and parses key/values, declaring \`throws IOException\` for the I/O part but **handling** parse problems locally with sensible defaults. Then write a caller that decides to propagate the \`IOException\` further up. Finally, argue when you'd convert the checked \`IOException\` into an unchecked custom exception at a service boundary (preview of §4.11/§4.12).`,
      summary: `- **Checked exceptions** (\`Exception\` minus \`RuntimeException\`) must be **handled or declared** — compiler-enforced.
- They model **expected, recoverable** failures (I/O, SQL, interrupts, parsing).
- Checked-ness is **compile-time only**; overrides can't broaden checked exceptions (Module 2 §2.8).
- Handle where you can recover, declare otherwise, **never swallow**; consider unchecked wrapping at boundaries (§4.12). Unchecked exceptions: **§4.4**.`
    }),

    /* 4.4 Unchecked Exceptions — runtime, programmer-error family. */
    topic({
      id: "unchecked-exceptions", chapter: "4.4", title: "Unchecked Exceptions",
      subtitle: "RuntimeExceptions — usually programming bugs, not declared or forced.",
      readTime: "14 min", level: "Core", deep: true,
      objectives: [
        "Define unchecked exceptions and how they differ from checked (§4.3).",
        "Recognise the common RuntimeException family and their causes.",
        "Decide when to throw unchecked exceptions (validation, programming errors).",
        "Prefer prevention over catching for unchecked exceptions."
      ],
      concept: `An **unchecked exception** is one the compiler does **not** force you to handle or declare. These are subclasses of **\`RuntimeException\`** (plus \`Error\`, §4.2). You *can* catch them, but you're not *required* to.

\`\`\`java
String s = null;
s.length();        // NullPointerException — unchecked; no try-catch required to compile
\`\`\`

Most unchecked exceptions signal **programming errors** — bugs that should be **fixed in code**, not caught at runtime. The right response is usually to prevent them, not to wrap every line in \`try-catch\`.`,
      why: `Why have a category the compiler ignores? Because forcing \`try-catch\` around *every* possible \`NullPointerException\` or \`ArrayIndexOutOfBoundsException\` would make code unreadable — these can happen almost anywhere. Java's design philosophy:

- **Checked** = *expected, recoverable, external* conditions → compiler-enforced (§4.3).
- **Unchecked** = *programming mistakes or unrecoverable logic errors* → catch optionally, but better to **fix the bug** or **validate inputs**.

This keeps everyday code clean while still letting you catch runtime problems when you genuinely can recover (e.g., validating user input).`,
      common: `**The RuntimeException family you'll meet most:**

| Exception | Cause | Prevent by |
|---|---|---|
| \`NullPointerException\` | using \`null\` reference | null checks / \`Optional\` (Module 7) |
| \`ArrayIndexOutOfBoundsException\` | bad array index | bounds checking |
| \`IndexOutOfBoundsException\` | bad list/string index | size checks |
| \`ArithmeticException\` | integer ÷ 0 | guard the divisor |
| \`NumberFormatException\` | parsing non-numeric text (Module 3) | validate input |
| \`IllegalArgumentException\` | invalid method argument | validate parameters |
| \`IllegalStateException\` | object in wrong state for the call | check state first |
| \`ClassCastException\` | invalid downcast (Module 2 §2.9) | \`instanceof\`/generics |
| \`ConcurrentModificationException\` | modifying a collection while iterating (Module 5) | use iterator/copy |`,
      whenToThrow: `Unchecked exceptions aren't just things that happen *to* you — you **throw them deliberately** to signal misuse of your API:

\`\`\`java
public void setAge(int age) {
    if (age < 0)
        throw new IllegalArgumentException("age must be >= 0, got " + age); // unchecked
    this.age = age;
}

public void withdraw(double amt) {
    if (!open) throw new IllegalStateException("account is closed"); // unchecked
    // ...
}
\`\`\`

\`IllegalArgumentException\` (bad input) and \`IllegalStateException\` (bad timing/state) are the idiomatic unchecked exceptions for **validation** and **contract enforcement** — used constantly in real code (and \`Objects.requireNonNull\` throws \`NullPointerException\` by design).`,
      internal: `As with checked exceptions, "unchecked" is a **compile-time classification only** — at runtime a \`RuntimeException\` behaves identically (it propagates up the stack and prints a trace if unhandled, §4.1). The sole difference is the compiler **skips** the "handle or declare" verification for \`RuntimeException\`/\`Error\`. You **may** still list a \`RuntimeException\` in a \`throws\` clause for documentation, but it changes nothing for callers.`,
      useCases: `- **Argument/precondition validation**: \`IllegalArgumentException\`, \`Objects.requireNonNull\`.
- **State/contract enforcement**: \`IllegalStateException\` (e.g., calling \`next()\` past the end).
- **Wrapping checked exceptions** at boundaries into unchecked custom exceptions to keep core logic clean (§4.11/§4.12).
- **Signaling unrecoverable logic bugs** that should crash loudly during development.`,
      code: `\`\`\`java
import java.util.*;

public class UncheckedDemo {
    static double safeDivide(int a, int b) {
        if (b == 0) throw new ArithmeticException("divisor is zero"); // explicit, clear
        return (double) a / b;
    }
    public static void main(String[] args) {
        // prevention beats catching:
        String s = null;
        if (s != null && s.length() > 0) { /* safe */ }   // guard, no exception

        // validation throws unchecked:
        try {
            Objects.requireNonNull(s, "s must not be null");
        } catch (NullPointerException e) {
            System.out.println(e.getMessage());            // "s must not be null"
        }

        System.out.println(safeDivide(10, 2));             // 5.0
    }
}
\`\`\``,
      mistakes: `- **Wrapping everything in \`try-catch\`** to "handle" NPEs/AIOOBEs instead of fixing the underlying bug.
- **Catching \`RuntimeException\` broadly** and continuing — hides real defects (§4.13).
- **Declaring \`throws RuntimeException\`** expecting the compiler to enforce it — it won't.
- **Using exceptions for validation you could prevent** with a simple check.
- **Confusing \`IllegalArgumentException\` (bad input) with \`IllegalStateException\` (bad state)** — pick the right one for clarity.`,
      bestPractices: `- **Prevent** unchecked exceptions with validation/guards rather than catching after the fact.
- **Throw** \`IllegalArgumentException\`/\`IllegalStateException\` (and \`Objects.requireNonNull\`) to enforce your API contracts — fail fast with clear messages.
- Catch a \`RuntimeException\` only when you can genuinely recover (e.g., parsing user input, retry logic).
- Don't pollute signatures with \`throws RuntimeException\`; document them in Javadoc instead.
- Use \`Optional\` (Module 7) and null-safe patterns to reduce NPEs.`,
      interview: `**Q1. What is an unchecked exception?**
A \`RuntimeException\` (or \`Error\`) subclass the compiler doesn't force you to handle or declare.

**Q2. Checked vs unchecked — the core difference?**
Checked must be handled/declared (compile-time); unchecked need not. Checked = expected/external; unchecked = usually programming bugs.

**Q3. Give common unchecked exceptions.**
\`NullPointerException\`, \`ArrayIndexOutOfBoundsException\`, \`ArithmeticException\`, \`IllegalArgumentException\`, \`IllegalStateException\`, \`ClassCastException\`.

**Q4. When should you throw \`IllegalArgumentException\` vs \`IllegalStateException\`?**
\`IllegalArgumentException\` for invalid arguments; \`IllegalStateException\` when the object's state makes the call invalid.

**Q5. Should you catch unchecked exceptions?**
Generally prevent them; catch only when you can recover (e.g., input validation, retries).

**Q6. Is there a runtime behavioral difference from checked exceptions?**
No — only the compile-time handling requirement differs.`,
      exercises: `1. Trigger and then *prevent* (with guards) a \`NullPointerException\` and an \`ArithmeticException\`.
2. Write \`setPercentage(int)\` that throws \`IllegalArgumentException\` outside 0–100.
3. Use \`Objects.requireNonNull\` to validate a constructor argument and observe the thrown NPE message.
4. Classify \`IllegalStateException\`, \`IOException\`, \`NumberFormatException\`, \`SQLException\` as checked/unchecked.`,
      challenges: `Design a \`Stack<T>\` with \`push\`, \`pop\`, \`peek\` that throws \`IllegalStateException\` (or \`EmptyStackException\`) on underflow and uses \`Objects.requireNonNull\` for pushed elements. Decide deliberately that these are **unchecked** and justify why (programming errors, not recoverable external conditions). Then contrast with a \`FileStack\` that reads from disk and would legitimately surface a **checked** \`IOException\` (links to §4.3/§4.11).`,
      summary: `- **Unchecked exceptions** = \`RuntimeException\` (and \`Error\`) subclasses; the compiler does **not** force handling/declaring.
- They usually mean **programming bugs** — prefer **prevention** (guards, \`Optional\`) over catching.
- **Throw** \`IllegalArgumentException\`/\`IllegalStateException\`/\`requireNonNull\` to enforce API contracts (fail fast).
- Runtime behavior matches checked exceptions; only the compile-time rule differs. Handling mechanics begin in **§4.5**.`
    }),

    /* ===================== CORE ===================== */

    /* 4.5 try-catch — the fundamental handling construct. */
    topic({
      id: "try-catch", chapter: "4.5", title: "try-catch",
      subtitle: "The core construct for catching and handling exceptions.",
      readTime: "15 min", level: "Core", deep: true,
      objectives: [
        "Write \`try-catch\` blocks and explain control flow through them.",
        "Catch specific exception types and access the exception object.",
        "Use nested try blocks and understand scope of variables.",
        "Avoid the classic try-catch anti-patterns."
      ],
      concept: `The **\`try-catch\`** statement is how you handle an exception. You put risky code in a **\`try\`** block; if it throws, control jumps to a matching **\`catch\`** block instead of crashing.

\`\`\`java
try {
    int result = 10 / 0;        // risky — throws ArithmeticException
    System.out.println(result); // skipped when an exception is thrown
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero"); // handler runs
}
// execution continues here either way
\`\`\`

The \`catch\` parameter (\`e\`) is the **exception object** (§4.2) — you can read its message, cause, and stack trace.`,
      why: `\`try-catch\` turns an abrupt termination into a **controlled response**. It lets you:

- **Recover** — provide a default, retry, or fall back.
- **Report** — log a clear message with context.
- **Contain** — stop one failure from taking down the whole program/request.
- **Translate** — wrap a low-level exception into a more meaningful one (§4.12).

Without it, any uncaught exception ends the thread (§4.1). With it, your program decides what "failure" means.`,
      controlFlow: `**Exactly how control flows:**

\`\`\`
try {
   A;          // runs
   B;          // if B throws...
   C;          // ...C is SKIPPED
} catch (SomeType e) {
   H;          // jumps here if a matching exception was thrown
}
D;             // runs afterward (if exception was handled, or none thrown)
\`\`\`

- If **no** exception: the whole \`try\` runs, all \`catch\` blocks are skipped.
- If an exception occurs: the rest of the \`try\` is abandoned, the **first matching** \`catch\` runs, then execution continues after the \`try-catch\`.
- If **no catch matches**: the exception **propagates** to the caller (§4.12), as if there were no \`try\` here.`,
      multipleCatch: `A single \`try\` can have **multiple \`catch\`** blocks for different types. They're tested **top to bottom**, and the **first match wins** — so order **specific → general**:

\`\`\`java
try {
    process(input);
} catch (NumberFormatException e) {   // specific
    System.out.println("not a number");
} catch (IllegalArgumentException e) { // broader (NFE's parent)
    System.out.println("bad argument");
} catch (Exception e) {               // most general — last resort
    System.out.println("unexpected: " + e);
}
\`\`\`

Putting a superclass before its subclass makes the subclass \`catch\` **unreachable** — a **compile error**. (Catching multiple types in one block is **multi-catch**, §4.6.)`,
      internal: `**Variable scope:** a variable declared inside \`try\` is **not visible** in \`catch\` or after the block — declare it before the \`try\` if you need it later.

\`\`\`java
String data;                 // declared outside
try {
    data = read();           // assign inside
} catch (IOException e) {
    data = "default";        // still in scope
}
System.out.println(data);    // usable here
\`\`\`

The \`catch\` parameter is **effectively final** in multi-catch (§4.6). Under the hood, the compiler builds an **exception table** mapping byte-code ranges to handlers; at runtime the JVM consults it to find the handler when an exception is thrown — no per-statement cost when nothing throws (so \`try\` blocks are cheap until an exception actually occurs).`,
      nested: `\`try-catch\` can be **nested**; an inner block can handle some exceptions and let others propagate to an outer block:

\`\`\`java
try {
    try {
        risky();
    } catch (IllegalArgumentException e) {
        System.out.println("handled inner");
    }
    moreRisky();   // its exception is NOT caught by the inner catch
} catch (Exception e) {
    System.out.println("handled outer: " + e);
}
\`\`\`

Keep nesting shallow — deep nesting signals you should extract methods.`,
      useCases: `- **Parsing user input** with a fallback (\`NumberFormatException\`).
- **I/O with recovery** — try a primary source, fall back to a default (Module 9).
- **Per-request isolation** in servers — one request's exception shouldn't crash the server.
- **Retry loops** — catch a transient failure and try again.`,
      code: `\`\`\`java
import java.util.*;

public class TryCatchDemo {
    static int parseOrDefault(String s, int def) {
        try {
            return Integer.parseInt(s);
        } catch (NumberFormatException e) {
            return def;                       // recover with a default
        }
    }
    public static void main(String[] args) {
        System.out.println(parseOrDefault("42", -1)); // 42
        System.out.println(parseOrDefault("oops", -1)); // -1

        int[] a = {1, 2, 3};
        try {
            System.out.println(a[10]);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("bad index: " + e.getMessage());
        }
        System.out.println("done"); // program survives
    }
}
\`\`\``,
      mistakes: `- **Empty catch blocks** — \`catch (Exception e) {}\` silently swallows failures; at minimum log/rethrow (§4.13).
- **Catching \`Exception\`/\`Throwable\` too broadly** — masks bugs and traps things you can't handle.
- **Superclass before subclass** — unreachable \`catch\`, compile error.
- **Using try-catch for control flow** — e.g., catching to break a loop; use normal conditions (§4.1).
- **Declaring needed variables inside \`try\`** — they're out of scope in \`catch\`/after.
- **Catching then rethrowing without the cause** — loses the original stack trace (§4.12).`,
      bestPractices: `- Keep \`try\` blocks **small** — wrap only the risky statement(s), not large swaths of code.
- Catch the **most specific** type you can handle; order specific → general.
- **Never swallow**: log with context, recover, or rethrow (preserving cause, §4.12).
- Don't use exceptions for ordinary control flow.
- For resources (files, connections), prefer **try-with-resources** (§4.10) over manual \`finally\` cleanup.`,
      interview: `**Q1. How does try-catch work?**
Risky code goes in \`try\`; if it throws, control jumps to the first matching \`catch\`, which handles the exception; execution then continues after the block.

**Q2. Can a try have multiple catch blocks? What's the ordering rule?**
Yes — checked top-to-bottom, first match wins; order specific before general or you get an unreachable-catch compile error.

**Q3. What happens if no catch matches?**
The exception propagates to the caller as if the try weren't there (§4.12).

**Q4. Is a variable declared in try visible in catch?**
No — declare it before the try if you need it in catch or afterward.

**Q5. Why are empty catch blocks bad?**
They swallow failures silently, hiding bugs and making diagnosis impossible.

**Q6. Does a try block cost performance when nothing throws?**
Negligible — the JVM uses an exception table; cost is incurred only when an exception is actually thrown.`,
      exercises: `1. Write \`parseOrDefault\` that returns a fallback on \`NumberFormatException\`.
2. Use multiple catch blocks ordered specific→general and trigger each path.
3. Demonstrate the unreachable-catch compile error by putting \`Exception\` before \`ArithmeticException\`, then fix it.
4. Show a variable declared in \`try\` is inaccessible in \`catch\`; fix by hoisting the declaration.`,
      challenges: `Implement a retry helper \`<T> T withRetry(Supplier<T> action, int attempts)\` that calls the action, catches a transient \`RuntimeException\`, and retries up to N times before rethrowing the last failure (preserving its message). Use it to wrap a flaky operation. Then explain why catching broadly here is acceptable (transient retries) but would be wrong as a general pattern (§4.13).`,
      summary: `- **\`try-catch\`** runs risky code and, on a throw, jumps to the **first matching** \`catch\`; execution then continues past the block.
- Use **multiple catches** ordered **specific → general** (superclass-first is a compile error); multi-catch is **§4.6**.
- Variables declared in \`try\` aren't visible in \`catch\`/after; \`try\` is cheap until something throws.
- **Never swallow**; keep \`try\` small; use **try-with-resources (§4.10)** for cleanup; \`finally\` is **§4.7**.`
    }),

    /* 4.6 Multi-catch & catch ordering — Java 7+ concise handling. */
    topic({
      id: "multi-catch", chapter: "4.6", title: "Multi-catch & Catch Ordering",
      subtitle: "Handle several exception types in one block — cleanly and correctly.",
      readTime: "12 min", level: "Core", deep: true,
      objectives: [
        "Use the Java 7 multi-catch syntax (\`catch (A | B e)\`).",
        "Apply the specific-before-general ordering rule and avoid unreachable catches.",
        "Understand the 'effectively final' restriction on the multi-catch variable.",
        "Use rethrow with more precise type analysis (Java 7+)."
      ],
      concept: `**Multi-catch** (Java 7+) lets a **single \`catch\` block handle several unrelated exception types**, separated by the pipe \`\|\`, when the handling logic is the same. It removes duplicated catch blocks.

\`\`\`java
try {
    risky();
} catch (IOException | SQLException e) {   // one block, two types
    log.error("operation failed", e);       // identical handling
}
\`\`\`

Before Java 7 you'd write two near-identical \`catch\` blocks; multi-catch collapses them into one, reducing copy-paste bugs.`,
      why: `Multi-catch exists for **DRY error handling**. When two or more exception types need the **same** response (log, wrap, return a default), repeating the block is noise and a maintenance hazard — fix one copy, forget the other. Multi-catch keeps the handler in **one place**. It also pairs with **precise rethrow** (below) so the compiler can reason about exactly which types can escape.`,
      rules: `**The rules of multi-catch:**

1. **Types must be disjoint** — you can't combine a type with its own subclass (\`catch (IOException | FileNotFoundException e)\` is a **compile error**, because \`FileNotFoundException\` is already covered by \`IOException\`).
2. The catch variable (\`e\`) is **implicitly final** — you cannot reassign it inside the block.
3. Its static type is the **common supertype** of the listed types, so you can only call methods available on that supertype (usually \`Throwable\`'s methods).

\`\`\`java
catch (NumberFormatException | NullPointerException e) {
    // e is effectively final; treat as a common ancestor (RuntimeException/Throwable)
    System.out.println(e.getMessage());
}
\`\`\``,
      ordering: `**Catch ordering** (applies to both single and multi-catch): handlers are evaluated **top to bottom**, first match wins, so **more specific types must come before more general ones**.

\`\`\`java
try {
    parse();
} catch (NumberFormatException e) {     // specific (subclass of IllegalArgumentException)
    ...
} catch (IllegalArgumentException e) {  // more general
    ...
} catch (Exception e) {                 // most general — last
    ...
}
\`\`\`

Placing a superclass **before** its subclass makes the subclass handler **unreachable** — the compiler rejects it:

\`\`\`java
// COMPILE ERROR: ArithmeticException is already caught by Exception above
catch (Exception e) { ... }
catch (ArithmeticException e) { ... }   // unreachable
\`\`\``,
      internal: `Multi-catch compiles to a single handler entry whose catch type is the **least upper bound** of the listed types; the JVM's exception table still matches by \`instanceof\`. The "effectively final" rule lets the compiler avoid ambiguity about the variable's runtime type.

**Precise rethrow (Java 7):** if you catch a broad type but only **certain** specific types can actually be thrown in the \`try\`, the compiler now tracks that, so you can declare the narrower types on the enclosing method even when the catch parameter is broad:

\`\`\`java
void doWork() throws IOException, SQLException {
    try {
        mightThrowIOorSQL();
    } catch (Exception e) {    // broad catch...
        log(e);
        throw e;              // ...but compiler knows e is only IOException or SQLException
    }
}
\`\`\``,
      useCases: `- **Uniform handling** of several failure types: log-and-wrap I/O + DB + parse errors identically.
- **Reflection APIs** that throw a cluster of related checked exceptions (\`ClassNotFoundException | NoSuchMethodException | IllegalAccessException\`).
- **Boundary translation**: catch multiple low-level exceptions and rethrow one domain exception (§4.12).`,
      code: `\`\`\`java
import java.lang.reflect.*;

public class MultiCatchDemo {
    static Object create(String className) {
        try {
            return Class.forName(className).getDeclaredConstructor().newInstance();
        } catch (ClassNotFoundException | NoSuchMethodException
               | InstantiationException | IllegalAccessException
               | InvocationTargetException e) {           // one block, many types
            System.out.println("could not create " + className + ": " + e);
            return null;
        }
    }
    public static void main(String[] args) {
        System.out.println(create("java.util.ArrayList")); // []
        System.out.println(create("no.such.Class"));        // logs + null
    }
}
\`\`\``,
      mistakes: `- **Combining a type with its subclass** in multi-catch — compile error (redundant).
- **Reassigning the multi-catch variable** — it's effectively final.
- **Calling subtype-specific methods** on the multi-catch variable — only the common supertype's API is available.
- **Wrong ordering** — superclass before subclass → unreachable catch.
- **Using multi-catch when handling actually differs** — if responses differ per type, keep separate blocks.`,
      bestPractices: `- Use multi-catch when the **handling is identical**; keep separate blocks when it isn't.
- Always order catches **specific → general**.
- Treat the multi-catch variable as the **common supertype**; don't try to reassign it.
- Combine multi-catch with **wrap-and-rethrow** at boundaries to expose a single domain exception (§4.12).
- Don't over-broaden the catch type just to use one block — catch only what you mean to handle (§4.13).`,
      interview: `**Q1. What is multi-catch and when was it added?**
A single \`catch\` handling multiple types separated by \`\|\`, added in Java 7, used when handling is identical.

**Q2. Can you write \`catch (IOException | FileNotFoundException e)\`?**
No — they're in a subtype relationship; that's a compile error (redundant).

**Q3. Is the multi-catch variable mutable?**
No — it's implicitly/effectively final.

**Q4. What's the ordering rule for catch blocks?**
Specific before general; a superclass before its subclass makes the subclass catch unreachable (compile error).

**Q5. What type is the multi-catch parameter?**
The common supertype of the listed exceptions, so only that supertype's methods are accessible.

**Q6. What is precise rethrow?**
A Java 7 improvement letting the compiler infer the exact exception types that can escape a broad catch, so the method can declare narrower \`throws\`.`,
      exercises: `1. Collapse two identical catch blocks (\`IOException\`, \`SQLException\`) into one multi-catch.
2. Trigger the compile error from combining \`IOException | FileNotFoundException\` and fix it.
3. Write three ordered catches (NumberFormatException → IllegalArgumentException → Exception) and trigger each.
4. Show the unreachable-catch error by reversing two of them, then correct the order.`,
      challenges: `Write a \`safeInvoke\` method that uses reflection to call a method by name and uses **multi-catch** to translate the cluster of reflection exceptions into a single unchecked \`OperationException\` (custom, §4.11) carrying the original as its cause (§4.12). Then add an ordered set of catches in the caller (specific domain exception first, generic last) and explain why ordering and cause-preservation both matter for debugging.`,
      summary: `- **Multi-catch** (\`catch (A | B e)\`, Java 7) handles several types in one block when handling is identical; the variable is **effectively final** and typed as the common supertype.
- You **can't** combine a type with its subclass (redundant → compile error).
- Order catches **specific → general**; superclass-before-subclass is an **unreachable-catch** compile error.
- Pairs well with **wrap-and-rethrow** (§4.12) and **precise rethrow**; \`finally\` is **§4.7**.`
    }),

    /* 4.7 finally — guaranteed cleanup block. */
    topic({
      id: "finally", chapter: "4.7", title: "finally",
      subtitle: "The block that (almost) always runs — for guaranteed cleanup.",
      readTime: "14 min", level: "Core", deep: true,
      objectives: [
        "Explain what \`finally\` guarantees and when it runs.",
        "Use \`finally\` for cleanup and know the rare cases it is skipped.",
        "Understand how \`return\`/\`throw\` in \`try\`/\`catch\`/\`finally\` interact.",
        "Recognise why try-with-resources (§4.10) usually replaces manual finally."
      ],
      concept: `A **\`finally\`** block attached to a \`try\` runs **whether or not** an exception occurred — after the \`try\` (and any matching \`catch\`) completes. Its purpose is **guaranteed cleanup**: closing files, releasing locks, freeing connections — work that must happen on **every** exit path.

\`\`\`java
try {
    risky();
} catch (Exception e) {
    handle(e);
} finally {
    cleanup();   // runs in ALL cases: success, handled exception, or even rethrow
}
\`\`\`

\`finally\` is optional, and you can write \`try-finally\` **without** a \`catch\` (handle nothing, but still clean up).`,
      why: `Before try-with-resources (§4.10), \`finally\` was *the* way to ensure resources were released even when code failed midway:

- A file/stream must be **closed** whether the read succeeded or threw (Module 9).
- A lock must be **released** even if the protected code throws (Module 8).
- A DB connection must be **returned** to the pool regardless of outcome (Module 10).

Leaking these resources causes file-handle exhaustion, deadlocks, and connection-pool starvation — production-grade bugs. \`finally\` guarantees the release happens.`,
      whenItRuns: `**\`finally\` runs after the try/catch on every normal exit path**, including when \`try\` or \`catch\` executes a \`return\`:

\`\`\`java
static int demo() {
    try {
        return 1;          // value computed...
    } finally {
        System.out.println("finally still runs"); // ...but THIS runs before returning
    }
}
\`\`\`

**The rare cases \`finally\` does NOT run:**

- \`System.exit(n)\` is called (the JVM stops immediately).
- The JVM crashes / is killed, or a fatal \`Error\` tears down the thread.
- The thread executing the \`try\` is killed (e.g., daemon thread on JVM shutdown).
- An infinite loop / hang inside \`try\` (it simply never reaches \`finally\`).

In all *ordinary* situations (success, exception, return, break, continue), \`finally\` executes.`,
      returnInteraction: `**The tricky interview part — \`return\`/\`throw\` interactions:**

- A \`return\` in \`try\` computes its value, then \`finally\` runs, then the method returns.
- A \`return\` **in \`finally\` overrides** any return/exception from \`try\`/\`catch\` — and **swallows exceptions**. This is a notorious bug:

\`\`\`java
static int bad() {
    try {
        throw new RuntimeException("boom");
    } finally {
        return 42;     // ❌ swallows the exception entirely; method returns 42
    }
}
\`\`\`

- Similarly, \`finally\` reassigning the returned variable doesn't change an already-computed primitive return value, but **a \`return\`/\`throw\` in \`finally\` replaces** the pending outcome.

> Rule: **never \`return\` or \`throw\` from a \`finally\` block** — it hides errors and confuses control flow.`,
      internal: `The compiler implements \`finally\` by **duplicating** the finally code into each exit path (or via an exception-table handler that runs it then rethrows). That's why it executes on success, on caught exceptions, and even when an exception is *propagating* (the \`finally\` runs, then the exception continues up). When both the \`try\` and the \`finally\` throw, the \`try\`'s exception is **lost** and the \`finally\`'s wins — another reason to keep \`finally\` simple and non-throwing. (try-with-resources fixes this by **suppressing** rather than discarding — §4.10/§4.12.)`,
      useCases: `- **Closing resources** opened in \`try\` (files, sockets, streams) — though prefer try-with-resources (§4.10).
- **Releasing locks**: \`lock.lock(); try { ... } finally { lock.unlock(); }\` (Module 8) — the canonical, still-correct use.
- **Restoring state**: resetting a flag, popping a context, stopping a timer.
- **Always-run logging/metrics** around an operation.`,
      code: `\`\`\`java
import java.util.concurrent.locks.*;

public class FinallyDemo {
    static final ReentrantLock lock = new ReentrantLock();

    static void critical() {
        lock.lock();
        try {
            // protected work that might throw
            doWork();
        } finally {
            lock.unlock();   // ALWAYS released, even on exception — correct use of finally
        }
    }

    static int returnsTen() {
        int x = 5;
        try {
            return x;        // value 5 is captured...
        } finally {
            x = 10;          // ...this does NOT change the returned 5 (no return here)
        }
    }
    static void doWork() {}
    public static void main(String[] args) {
        System.out.println(returnsTen()); // 5
    }
}
\`\`\``,
      mistakes: `- **\`return\`/\`throw\` inside \`finally\`** — silently swallows exceptions and overrides results; never do it.
- **Throwing from \`finally\`** — masks the original exception from \`try\`.
- **Putting business logic in \`finally\`** — it's for cleanup only; logic there runs even on failure.
- **Assuming \`finally\` always runs** — \`System.exit\`/JVM crash skip it.
- **Manual close in \`finally\` without null checks** — \`resource.close()\` can NPE if construction failed; try-with-resources (§4.10) avoids the boilerplate.`,
      bestPractices: `- Use \`finally\` (or better, **try-with-resources**, §4.10) to guarantee resource release.
- Keep \`finally\` **short, cleanup-only, and non-throwing**.
- **Never** \`return\`/\`throw\` from \`finally\`.
- For locks, the \`lock(); try { } finally { unlock(); }\` idiom is the standard (Module 8).
- Prefer **try-with-resources** for anything \`AutoCloseable\` — it's cleaner and suppresses correctly.`,
      interview: `**Q1. When does \`finally\` run?**
After the \`try\`/\`catch\` on every normal exit (success, exception, return, break/continue) — for guaranteed cleanup.

**Q2. When does \`finally\` NOT run?**
On \`System.exit()\`, a JVM crash/kill, the thread dying, or an infinite loop/hang in \`try\`.

**Q3. What happens if you \`return\` in \`finally\`?**
It overrides any return/exception from \`try\`/\`catch\` and swallows exceptions — an anti-pattern; never do it.

**Q4. Can you have try-finally without catch?**
Yes — to guarantee cleanup without handling the exception (which still propagates).

**Q5. If both try and finally throw, which exception wins?**
The \`finally\`'s exception; the original is lost (try-with-resources suppresses instead, §4.10).

**Q6. Does \`finally\` run before or after a \`try\` \`return\` value is returned?**
The return value is computed, \`finally\` runs, then the method actually returns.`,
      exercises: `1. Write a method with \`return\` in \`try\` and a print in \`finally\`; confirm the print happens before returning.
2. Demonstrate the \`return\`-in-\`finally\` bug swallowing an exception, then remove it.
3. Implement the lock/unlock-in-finally idiom and prove unlock runs even when the body throws.
4. Show that \`finally\` is skipped when \`System.exit(0)\` is called in \`try\`.`,
      challenges: `Write two versions of a file-copy routine: one using manual \`try-catch-finally\` with explicit \`close()\` (and correct null-handling and suppressed-exception awareness), and one using **try-with-resources** (§4.10). Compare them and explain three concrete ways the \`finally\` version is more error-prone (lost exceptions, NPE on close, verbosity), motivating why try-with-resources is preferred.`,
      summary: `- **\`finally\`** runs on (almost) every exit path — the place for **guaranteed cleanup** (close, unlock, restore).
- It's **skipped** only by \`System.exit\`, JVM crash/kill, thread death, or an infinite loop.
- **Never \`return\`/\`throw\` from \`finally\`** — it swallows exceptions and overrides results; if both \`try\` and \`finally\` throw, the original is lost.
- For \`AutoCloseable\` resources, prefer **try-with-resources (§4.10)**; the lock/unlock idiom remains the classic \`finally\` use.`
    }),

    /* 4.8 throw — raising an exception explicitly. */
    topic({
      id: "throw", chapter: "4.8", title: "throw",
      subtitle: "Raising an exception deliberately to signal a problem.",
      readTime: "12 min", level: "Core", deep: true,
      objectives: [
        "Use the \`throw\` statement to raise an exception object.",
        "Throw built-in and custom exceptions with clear messages.",
        "Distinguish \`throw\` (statement) from \`throws\` (declaration, §4.9).",
        "Apply throw for validation, fail-fast, and rethrowing."
      ],
      concept: `The **\`throw\`** statement **raises an exception explicitly**. You create (or already hold) a \`Throwable\` object and \`throw\` it; control immediately leaves the current point and the exception begins **propagating** up the call stack (§4.12) until caught.

\`\`\`java
throw new IllegalArgumentException("age must be positive");
\`\`\`

You can only \`throw\` something that **is a \`Throwable\`** (§4.2). The statement ends normal flow at that line — code after a reachable, unconditional \`throw\` is **unreachable** (compile error).`,
      why: `You \`throw\` to **signal that something is wrong** the moment you detect it, rather than returning a misleading value or continuing in a broken state:

- **Validation / fail-fast** — reject bad arguments or state at the boundary (\`IllegalArgumentException\`, §4.4).
- **Enforce contracts** — make misuse of your API loud and immediate.
- **Rethrow / translate** — catch a low-level exception and throw a more meaningful one (§4.12).
- **Custom domain errors** — throw your own exception types (§4.11) that callers can catch specifically.

Failing fast with a clear message is far easier to debug than a \`NullPointerException\` three layers away.`,
      syntax: `**Anatomy and forms:**

\`\`\`java
// 1) throw a new exception
throw new IllegalStateException("connection already closed");

// 2) throw a pre-built exception (e.g., from a field or factory)
RuntimeException ex = new RuntimeException("precomputed");
throw ex;

// 3) rethrow the caught exception (preserves type & stack trace)
try { risky(); }
catch (IOException e) {
    log(e);
    throw e;           // rethrow as-is
}

// 4) wrap and rethrow with a cause (§4.12)
catch (IOException e) {
    throw new DataAccessException("load failed", e);
}
\`\`\`

If you \`throw\` a **checked** exception (§4.3), the method must **declare** it with \`throws\` (§4.9) or catch it locally.`,
      internal: `At \`throw\`, the JVM takes the exception object (whose stack trace was captured when it was **constructed**, not when thrown — §4.12), abandons the current execution, and searches the call stack for a handler (§4.1). Two consequences:

- **Construct the exception near where you throw it**, so the captured trace points at the real problem.
- **Rethrowing the same object** (\`throw e;\`) keeps the original trace; **wrapping** (\`new X(e)\`) adds a new frame but preserves the original via \`getCause\` (§4.12).

\`\`\`java
// throwing null is legal syntactically but throws a NullPointerException instead:
Throwable t = null;
// throw t;   // -> NPE at the throw, not your intended exception
\`\`\``,
      throwVsThrows: `**\`throw\` vs \`throws\`** — a classic confusion (full treatment of \`throws\` in §4.9):

| | \`throw\` | \`throws\` |
|---|---|---|
| What | a **statement** that raises an exception | a **method declaration** clause |
| Where | inside a method body | in the method signature |
| Operand | one exception **object** | one or more exception **types** |
| Count | throws exactly one (at a time) | can list many types |
| Example | \`throw new IOException();\` | \`void m() throws IOException, SQLException\` |

Mnemonic: **\`throw\` throws an object now; \`throws\` warns callers a type might come.**`,
      useCases: `- **Argument validation**: \`if (x < 0) throw new IllegalArgumentException(...)\`.
- **State checks**: \`if (closed) throw new IllegalStateException(...)\`.
- **Not-yet-implemented**: \`throw new UnsupportedOperationException()\`.
- **Boundary translation**: convert checked low-level exceptions into domain exceptions (§4.11/§4.12).`,
      code: `\`\`\`java
import java.util.*;

public class ThrowDemo {
    static int factorial(int n) {
        if (n < 0)
            throw new IllegalArgumentException("n must be >= 0, got " + n); // validate
        int f = 1;
        for (int i = 2; i <= n; i++) f *= i;
        return f;
    }
    static String require(String s) {
        return Objects.requireNonNull(s, "value required");  // throws NPE if null
    }
    public static void main(String[] args) {
        System.out.println(factorial(5));   // 120
        try {
            factorial(-1);
        } catch (IllegalArgumentException e) {
            System.out.println("rejected: " + e.getMessage());
        }
    }
}
\`\`\``,
      mistakes: `- **Confusing \`throw\` with \`throws\`** — one raises, one declares.
- **Throwing a checked exception without declaring it** — won't compile unless caught (§4.3/§4.9).
- **Throwing \`null\`** — produces a \`NullPointerException\` at the throw site, not your intended error.
- **Code after an unconditional \`throw\`** — unreachable, compile error.
- **Throwing overly generic types** (\`throw new Exception(...)\`) — callers can't catch specifically; prefer precise/custom types (§4.11).
- **Losing the cause** when wrapping — pass the original to the new exception (§4.12).`,
      bestPractices: `- **Fail fast**: validate and \`throw\` at the boundary with a **clear, contextual message** (include the offending value).
- Throw the **most specific** appropriate type (\`IllegalArgumentException\`, \`IllegalStateException\`, or a custom one, §4.11).
- When rethrowing, **preserve the cause/stack trace** (rethrow as-is or wrap with the cause, §4.12).
- Don't throw checked exceptions for programming errors — use unchecked (§4.4).
- Construct the exception **where you detect** the problem so the trace is accurate.`,
      interview: `**Q1. What does \`throw\` do?**
Raises a \`Throwable\` explicitly; control leaves immediately and the exception propagates until caught.

**Q2. Difference between \`throw\` and \`throws\`?**
\`throw\` is a statement that raises one exception object; \`throws\` is a method-signature clause declaring types a method may propagate.

**Q3. Can you throw a checked exception?**
Yes, but the method must declare it (\`throws\`) or catch it.

**Q4. What happens if you \`throw null\`?**
A \`NullPointerException\` is thrown at the throw site instead of your intended exception.

**Q5. Can you throw any object?**
Only objects that are (subclasses of) \`Throwable\`.

**Q6. When is the stack trace captured?**
When the exception object is **constructed**, not when it's thrown — so build it near the problem.`,
      exercises: `1. Write \`setSpeed(int)\` that throws \`IllegalArgumentException\` for negative values with a message including the value.
2. Use \`Objects.requireNonNull\` to throw on a null constructor argument.
3. Catch an \`IOException\`, log it, and rethrow it unchanged; then change it to wrap-and-rethrow with a custom type (§4.11/§4.12 preview).
4. Show that statements after an unconditional \`throw\` cause a compile error.`,
      challenges: `Implement a \`BankAccount.withdraw(amount)\` that throws \`IllegalArgumentException\` for non-positive amounts, \`IllegalStateException\` if the account is closed, and a custom \`InsufficientFundsException\` (preview §4.11) when the balance is too low — each with a precise message. Write a caller that distinguishes the three cases. Then explain why throwing distinct types beats returning a boolean or error code.`,
      summary: `- **\`throw\`** raises a \`Throwable\` explicitly; flow leaves immediately and the exception propagates (§4.12).
- Use it for **validation/fail-fast**, contract enforcement, and **rethrow/translate**; throw **specific** types with clear messages.
- **\`throw\` (statement) ≠ \`throws\` (declaration, §4.9)**; throwing a **checked** exception requires declaring or catching it.
- Stack trace is captured at **construction**; preserve the **cause** when wrapping (§4.12); don't throw \`null\`.`
    }),

    /* 4.9 throws — declaring propagated exceptions. */
    topic({
      id: "throws", chapter: "4.9", title: "throws",
      subtitle: "Declaring that a method may propagate exceptions to its caller.",
      readTime: "12 min", level: "Core", deep: true,
      objectives: [
        "Use the \`throws\` clause to declare checked exceptions a method may propagate.",
        "Decide between declaring (throws) and handling (try-catch).",
        "Apply the overriding rules for \`throws\` (Module 2 §2.8).",
        "Understand why declaring unchecked exceptions is optional/documentary."
      ],
      concept: `The **\`throws\`** clause appears in a **method signature** and declares the **checked exceptions** the method may let **propagate** to its caller instead of handling them itself. It's how a method says "I might fail this way — *you* deal with it."

\`\`\`java
import java.io.*;
// this method doesn't catch IOException; it declares it for the caller
static String readFile(String path) throws IOException {
    return new String(Files.readAllBytes(Path.of(path)));
}
\`\`\`

Any caller of \`readFile\` must then **handle or declare** \`IOException\` (§4.3) — the obligation moves up the call chain.`,
      why: `\`throws\` enables the **"declare"** half of "handle or declare" (§4.3). Often the method that *encounters* a failure isn't the right place to *decide* what to do about it — a low-level file reader shouldn't pop up a dialog or pick a default; the **caller** (which has context) should. \`throws\`:

- **Documents** the failure modes in the signature (self-describing API).
- **Delegates** the decision to a caller better positioned to recover.
- **Propagates** cleanly up to a layer that has a sensible handling strategy.`,
      syntax: `**Forms:**

\`\`\`java
void a() throws IOException { ... }                       // one type
void b() throws IOException, SQLException { ... }          // multiple, comma-separated
void c() throws FileNotFoundException { ... }             // a specific subtype

// declaring a supertype covers subtypes:
void d() throws Exception { ... }   // legal but too broad — avoid (§4.13)
\`\`\`

A method can declare a **superclass** to cover several subtypes, but precise types are better documentation. **Unchecked** exceptions may also be listed, but it's **optional and purely documentary** — the compiler doesn't enforce them (§4.4).`,
      handleVsDeclare: `**Choosing handle vs declare** — the decision that shapes clean error design:

| Declare (\`throws\`) when... | Handle (\`try-catch\`) when... |
|---|---|
| the caller can decide better | this method can recover meaningfully |
| this layer lacks context to recover | you can supply a default/retry here |
| you're a low-level/utility method | you're at a boundary (UI, request handler) |
| you want to translate later, higher up | the failure ends here |

A common pattern: **low-level methods declare**, **high-level boundaries handle** (and often log/translate, §4.12).`,
      overriding: `**Overriding rules for \`throws\`** (ties to Module 2 §2.8 — frequently tested):

- An overriding method may declare **the same**, **fewer**, or **narrower** (subclass) checked exceptions.
- It may declare **no** checked exceptions even if the parent does.
- It **cannot** declare **new or broader** checked exceptions than the overridden method.
- **Unchecked** exceptions are unrestricted (can always be added).

\`\`\`java
class Base { void m() throws IOException {} }
class Sub extends Base {
    @Override void m() throws FileNotFoundException {}  // OK: narrower subtype
}
// declaring throws Exception in Sub.m() would be ILLEGAL (broader)
\`\`\`

This preserves the caller's compile-time expectations when calling through a \`Base\` reference (polymorphism, Module 2 §2.9).`,
      internal: `\`throws\` is a **compile-time contract** only — it doesn't change runtime behavior; an undeclared unchecked exception still propagates identically (§4.4). The compiler uses the clause to enforce "handle or declare" transitively up the call chain for **checked** exceptions. \`main\` itself can declare \`throws Exception\`, letting an unhandled checked exception terminate the program with a stack trace — fine for small programs, but real applications handle/translate at boundaries.`,
      useCases: `- **I/O and DB utility methods** (Modules 9/10) that surface \`IOException\`/\`SQLException\` to callers.
- **Library APIs** that document recoverable failures in their signatures.
- **Propagating up** to a single boundary handler (e.g., a web framework's exception resolver).
- **\`main\` throws Exception** in quick programs/tests to avoid boilerplate.`,
      code: `\`\`\`java
import java.io.*;
import java.nio.file.*;

public class ThrowsDemo {
    // low-level: declares, doesn't handle
    static String load(String path) throws IOException {
        return Files.readString(Path.of(path));
    }
    // mid-level: also declares (no context to recover)
    static int countChars(String path) throws IOException {
        return load(path).length();
    }
    // boundary: HANDLES (has context — show a message / use default)
    public static void main(String[] args) {
        try {
            System.out.println(countChars("notes.txt"));
        } catch (IOException e) {
            System.out.println("could not read file: " + e.getMessage());
        }
    }
}
\`\`\``,
      mistakes: `- **Confusing \`throws\` with \`throw\`** (§4.8) — declaration vs statement.
- **Declaring \`throws Exception\`/\`Throwable\`** — too broad; forces callers into generic handling and hides specifics (§4.13).
- **Declaring checked exceptions you never throw** — misleading; keep the clause accurate.
- **Trying to broaden \`throws\` in an override** — compile error (must be same/narrower/fewer).
- **Relying on \`throws RuntimeException\`** for enforcement — it's documentary only.
- **Declaring instead of handling at a boundary** — pushing failures past the only layer that can recover.`,
      bestPractices: `- Declare **specific** checked exceptions; avoid \`throws Exception\`.
- Let **low-level** code declare and **boundaries** handle (and log/translate, §4.12).
- Keep the \`throws\` clause **truthful** — list what the method really propagates.
- Honor **override rules**: same/narrower/fewer checked exceptions only.
- Consider **wrapping checked into unchecked** at architectural seams to stop \`throws\` from leaking through every layer (§4.11/§4.12).`,
      interview: `**Q1. What is the \`throws\` clause?**
A method-signature declaration listing checked exceptions the method may propagate, shifting "handle or declare" to the caller.

**Q2. \`throw\` vs \`throws\`?**
\`throw\` (statement) raises one exception object; \`throws\` (declaration) lists types a method may propagate.

**Q3. Do you have to declare unchecked exceptions?**
No — declaring \`RuntimeException\`s is optional and only documentary.

**Q4. What are the override rules for \`throws\`?**
An override may throw the same, fewer, or narrower checked exceptions — never new or broader ones; unchecked are unrestricted.

**Q5. When declare vs handle?**
Declare when the caller can decide better or this layer lacks context; handle when this method/boundary can recover.

**Q6. Why avoid \`throws Exception\`?**
It's too broad — it hides specific failure types and forces generic handling.`,
      exercises: `1. Write a method that declares \`throws IOException\` and a caller that handles it; then a second caller that re-declares and propagates further.
2. Show the override rule: a parent method \`throws IOException\`, a child narrowing to \`FileNotFoundException\` (legal) and broadening to \`Exception\` (illegal).
3. Demonstrate that declaring \`throws RuntimeException\` changes nothing for callers.
4. Refactor a method that declares \`throws Exception\` into precise checked types.`,
      challenges: `Design a 3-layer pipeline — \`Repository\` (declares \`SQLException\`), \`Service\` (declares it or wraps it), \`Controller\` (the boundary that handles). Implement two variants: (a) \`SQLException\` declared all the way up and handled at the controller; (b) the service **wraps** \`SQLException\` into an unchecked \`DataAccessException\` (§4.11/§4.12) so higher layers don't carry \`throws\`. Compare the two designs and argue which scales better for a large codebase.`,
      summary: `- **\`throws\`** declares the **checked** exceptions a method may propagate — the "declare" half of handle-or-declare (§4.3).
- Use it to **delegate** failure decisions to a better-positioned caller; keep declarations **specific and truthful**.
- Override rule: **same/fewer/narrower** checked exceptions only (Module 2 §2.8); unchecked declarations are documentary (§4.4).
- Prefer low-level **declare** + boundary **handle**; consider **unchecked wrapping** at seams (§4.11/§4.12). \`throw\` (the statement) is **§4.8**.`
    }),

    /* ===================== ADVANCED ===================== */

    /* 4.10 try-with-resources — automatic, safe resource management. */
    topic({
      id: "try-with-resources", chapter: "4.10", title: "try-with-resources",
      subtitle: "Automatic resource closing with AutoCloseable — cleaner than finally.",
      readTime: "15 min", level: "Advanced", deep: true,
      objectives: [
        "Use try-with-resources to auto-close \`AutoCloseable\` resources.",
        "Explain closing order and suppressed exceptions.",
        "Implement \`AutoCloseable\`/\`Closeable\` on your own classes.",
        "Replace error-prone try-finally cleanup with this construct."
      ],
      concept: `**try-with-resources** (Java 7+) is a \`try\` statement that **declares one or more resources** and **automatically closes them** when the block exits — normally or via exception. A *resource* is any object implementing **\`AutoCloseable\`** (which has a single \`close()\` method). It replaces the verbose, bug-prone \`try-finally\` close pattern (§4.7).

\`\`\`java
try (BufferedReader br = new BufferedReader(new FileReader("data.txt"))) {
    return br.readLine();
}   // br.close() is called automatically here — even if readLine() throws
\`\`\`

No \`finally\`, no manual \`close()\`, no null checks — the compiler generates correct cleanup for you.`,
      why: `Manual cleanup is surprisingly hard to get right (§4.7):

- You must remember the \`finally\` block at all.
- \`close()\` itself can throw, and if it does inside \`finally\`, it can **mask** the original exception.
- Multiple resources need nested \`finally\`s and null checks.

try-with-resources solves all of this: guaranteed closing, correct order, and — crucially — it **suppresses** rather than discards the secondary exception, so the original failure isn't lost. This is the **standard idiom** for files, streams, sockets, and JDBC connections (Modules 9/10).`,
      multipleResources: `You can declare **multiple resources**, separated by semicolons; they are **closed in reverse order** of declaration (last opened, first closed) — which respects dependencies:

\`\`\`java
try (Connection conn = dataSource.getConnection();
     PreparedStatement ps = conn.prepareStatement(SQL);
     ResultSet rs = ps.executeQuery()) {
    while (rs.next()) process(rs);
}   // closes rs, then ps, then conn — automatically (Module 10)
\`\`\`

Since Java 9 you can also use an **already-declared effectively-final** resource variable directly:

\`\`\`java
BufferedReader br = new BufferedReader(...);
try (br) { ... }   // Java 9+: no need to re-declare
\`\`\``,
      suppressed: `**Suppressed exceptions — the elegant part.** If the \`try\` body throws **and** \`close()\` also throws, the body's exception is the **primary** one; the \`close()\` exception is **attached** to it as a *suppressed* exception (retrievable via \`Throwable.getSuppressed()\`), not lost:

\`\`\`java
try (MyResource r = new MyResource()) {
    throw new RuntimeException("primary");   // this is what propagates
}   // if close() also throws, that becomes a SUPPRESSED exception on "primary"

// later:
for (Throwable s : caught.getSuppressed()) System.out.println("suppressed: " + s);
\`\`\`

Contrast with plain \`try-finally\` (§4.7), where a \`close()\` exception in \`finally\` **replaces** and hides the original — a real debugging trap that try-with-resources fixes.`,
      autocloseable: `**Make your own resources** by implementing \`AutoCloseable\` (or \`Closeable\`, whose \`close()\` throws \`IOException\` and is idempotent):

\`\`\`java
class Database implements AutoCloseable {
    Database() { System.out.println("open"); }
    void query() { System.out.println("query"); }
    @Override public void close() { System.out.println("close"); } // auto-invoked
}

try (Database db = new Database()) {
    db.query();
}   // prints: open / query / close
\`\`\`

\`AutoCloseable.close()\` may declare \`throws Exception\`; \`Closeable.close()\` narrows it to \`IOException\`. Design \`close()\` to be **idempotent** and not throw if avoidable.`,
      internal: `The compiler **desugars** try-with-resources into a \`try-finally\` that (a) calls \`close()\` in reverse order, (b) wraps each close in logic that, if the body already failed, calls \`Throwable.addSuppressed(...)\` instead of overwriting. So there's no magic at runtime — just compiler-generated, *correct* cleanup that a human routinely gets wrong. Resources must be **effectively final** within the header (you can't reassign them), guaranteeing the same object is closed that was opened.`,
      useCases: `- **File/stream I/O** (Module 9): readers, writers, input/output streams.
- **JDBC** (Module 10): \`Connection\`, \`Statement\`, \`ResultSet\` — the canonical multi-resource case.
- **Network sockets**, channels, and any handle that must be released.
- **Locks/contexts** wrapped as \`AutoCloseable\` for scoped use (an idiom, though locks are also fine via \`finally\`, §4.7).`,
      code: `\`\`\`java
import java.io.*;
import java.util.*;

public class TwrDemo {
    public static void main(String[] args) {
        // multiple resources, auto-closed in reverse order, exceptions handled
        try (var in = new BufferedReader(new FileReader("in.txt"));
             var out = new BufferedWriter(new FileWriter("out.txt"))) {
            String line;
            while ((line = in.readLine()) != null) {
                out.write(line.toUpperCase());
                out.newLine();
            }
        } catch (IOException e) {
            System.out.println("I/O failed: " + e.getMessage());
            for (Throwable s : e.getSuppressed())
                System.out.println("  suppressed: " + s);
        }
    }
}
\`\`\``,
      mistakes: `- **Still using \`finally\` to close** \`AutoCloseable\` resources — verbose and risks masking exceptions; use try-with-resources.
- **Declaring resources that aren't \`AutoCloseable\`** — only \`AutoCloseable\` types work in the header.
- **Reassigning a resource variable** — must be effectively final.
- **Ignoring suppressed exceptions** when diagnosing — check \`getSuppressed()\`.
- **A throwing, non-idempotent \`close()\`** — can complicate cleanup; design \`close()\` to be safe to call once and quiet.
- **Wrong assumptions about close order** — resources close in **reverse** declaration order.`,
      bestPractices: `- **Always** use try-with-resources for \`AutoCloseable\` resources (files, streams, JDBC).
- Declare resources in **dependency order** (dependents last) so reverse-order closing is correct.
- Implement **\`AutoCloseable\`/\`Closeable\`** on your own resource types; make \`close()\` idempotent.
- Inspect **suppressed** exceptions when debugging double-failures.
- Combine with a single boundary \`catch\` for clean, leak-free I/O code (Modules 9/10).`,
      interview: `**Q1. What is try-with-resources and what does it require?**
A try that declares \`AutoCloseable\` resources and auto-closes them on exit (normal or exceptional); resources must implement \`AutoCloseable\`.

**Q2. In what order are multiple resources closed?**
Reverse order of declaration (last opened is closed first).

**Q3. What are suppressed exceptions?**
If the body and \`close()\` both throw, the body's exception propagates and the \`close()\` exception is attached via \`addSuppressed\`/\`getSuppressed\` — not lost.

**Q4. How does this differ from try-finally?**
\`finally\` can let a \`close()\` exception mask the original; try-with-resources suppresses instead, and removes boilerplate/null checks.

**Q5. AutoCloseable vs Closeable?**
\`Closeable\` (older, java.io) \`close()\` throws \`IOException\` and is idempotent; \`AutoCloseable\` (Java 7) \`close()\` may throw \`Exception\` and is more general.

**Q6. Can you use an existing variable as a resource?**
Yes, since Java 9, if it's effectively final: \`try (existingVar) { ... }\`.`,
      exercises: `1. Rewrite a manual \`try-finally\` file read using try-with-resources.
2. Open two resources and add print statements to \`close()\` to observe reverse-order closing.
3. Implement an \`AutoCloseable\` \`Timer\` that prints elapsed time in \`close()\`; use it in a try-with-resources.
4. Force both the body and \`close()\` to throw, catch the result, and print \`getSuppressed()\`.`,
      challenges: `Build a \`Transaction implements AutoCloseable\` that begins on construction and, in \`close()\`, commits if no exception occurred or rolls back otherwise (track a \`committed\` flag set by an explicit \`commit()\`). Use it with try-with-resources so a thrown exception triggers rollback automatically. Then demonstrate suppressed exceptions if \`close()\`/rollback itself fails, and compare the robustness with an equivalent hand-written \`try-finally\` (§4.7).`,
      summary: `- **try-with-resources** auto-closes \`AutoCloseable\` resources on every exit — no \`finally\`, no null checks.
- Multiple resources close in **reverse** declaration order; Java 9 allows effectively-final existing variables.
- It **suppresses** (not discards) a \`close()\` exception when the body already threw — retrieve via \`getSuppressed()\` (fixes a \`finally\` trap, §4.7).
- Implement \`AutoCloseable\`/\`Closeable\` for your own resources; it's the standard for I/O (Module 9) and JDBC (Module 10).`
    }),

    /* 4.11 Custom Exceptions — designing your own exception types. */
    topic({
      id: "custom-exceptions", chapter: "4.11", title: "Custom Exceptions",
      subtitle: "Designing your own meaningful, domain-specific exception types.",
      readTime: "15 min", level: "Advanced", deep: true,
      objectives: [
        "Create custom exceptions by extending Exception or RuntimeException.",
        "Choose checked vs unchecked deliberately for your domain.",
        "Add useful constructors (message, cause) and extra context fields.",
        "Follow naming and design conventions for exception classes."
      ],
      concept: `A **custom exception** is your own class that extends an existing exception type to represent a **domain-specific failure**. Instead of throwing a generic \`Exception\` or \`RuntimeException\`, you throw something meaningful that callers can catch precisely.

\`\`\`java
public class InsufficientFundsException extends RuntimeException {
    public InsufficientFundsException(String message) {
        super(message);
    }
}

// usage
if (amount > balance)
    throw new InsufficientFundsException("balance " + balance + " < " + amount);
\`\`\`

The name itself documents the problem, and callers can write \`catch (InsufficientFundsException e)\` to handle exactly that case.`,
      why: `Why not just reuse built-in exceptions? Custom exceptions give you:

- **Clarity** — \`OrderNotFoundException\` says far more than \`RuntimeException\` or a string message.
- **Precise handling** — callers catch your specific type and respond appropriately, ignoring unrelated failures.
- **Extra context** — you can carry domain data (an order id, an error code, the offending value) as fields.
- **A stable API contract** — your module exposes a known set of failure types.
- **Boundary translation** — wrap low-level exceptions (\`SQLException\`) into a clean domain exception so upper layers don't depend on persistence details (§4.12).`,
      checkedOrUnchecked: `**The key design decision: extend \`Exception\` (checked) or \`RuntimeException\` (unchecked)?** (Ties to §4.2/§4.3/§4.4.)

| Extend \`RuntimeException\` (unchecked) when... | Extend \`Exception\` (checked) when... |
|---|---|
| the error is a **programming bug** or violated precondition | the error is **recoverable** and the caller should handle it |
| you don't want to force \`throws\`/\`try-catch\` everywhere | you want the compiler to **enforce** handling |
| modern style / framework code (Spring favors unchecked) | the caller can realistically react (retry, fallback) |
| e.g., \`InvalidConfigException\`, \`InsufficientFundsException\` | e.g., \`PaymentDeclinedException\` you must handle |

**Modern guidance:** prefer **unchecked** custom exceptions unless the caller can and should recover — this keeps signatures clean and plays well with lambdas/streams (Module 7). When in doubt, unchecked.`,
      constructors: `**Provide the standard constructor set** so your exception behaves like built-ins and preserves causes (§4.12):

\`\`\`java
public class DataAccessException extends RuntimeException {
    private final String entity;                 // extra domain context

    public DataAccessException(String message) { super(message); }
    public DataAccessException(String message, Throwable cause) {
        super(message, cause);                    // preserve the original cause
    }
    public DataAccessException(String message, String entity, Throwable cause) {
        super(message, cause);
        this.entity = entity;
    }
    public String getEntity() { return entity; }
}
\`\`\`

At minimum offer \`(String message)\` and \`(String message, Throwable cause)\` — the cause constructor is essential for **exception chaining** (§4.12).`,
      internal: `A custom exception is an ordinary class; extending \`RuntimeException\`/\`Exception\` makes it throwable and inherits \`getMessage\`/\`getCause\`/\`getStackTrace\` (§4.2). Two finer points:

- **Serialization:** exceptions implement \`Serializable\`; if you add fields, keep them serializable (or \`transient\`) and consider a \`serialVersionUID\` to avoid warnings — relevant if exceptions cross process boundaries (RMI, some frameworks).
- **Performance:** capturing the stack trace at construction is the costly part of an exception. For high-frequency, control-flow-ish signals you can override \`fillInStackTrace()\` to skip it — an advanced optimization, used sparingly.`,
      useCases: `- **Domain errors**: \`OrderNotFoundException\`, \`InsufficientFundsException\`, \`InvalidCouponException\`.
- **Layer boundaries**: \`DataAccessException\` wrapping \`SQLException\`; \`ServiceException\` wrapping lower-level failures (§4.12).
- **Validation aggregates**: a \`ValidationException\` carrying a list of field errors.
- **API/SDK design**: a documented hierarchy of failure types clients can catch.`,
      code: `\`\`\`java
// a small domain exception hierarchy
class BankException extends RuntimeException {           // common base (unchecked)
    BankException(String m) { super(m); }
    BankException(String m, Throwable c) { super(m, c); }
}
class InsufficientFundsException extends BankException {
    private final double shortfall;
    InsufficientFundsException(double shortfall) {
        super("short by " + shortfall);
        this.shortfall = shortfall;
    }
    double shortfall() { return shortfall; }
}

class Account {
    private double balance = 100;
    void withdraw(double amt) {
        if (amt > balance) throw new InsufficientFundsException(amt - balance);
        balance -= amt;
    }
}

public class CustomExDemo {
    public static void main(String[] args) {
        try {
            new Account().withdraw(150);
        } catch (InsufficientFundsException e) {        // catch the SPECIFIC type
            System.out.println(e.getMessage() + " (shortfall=" + e.shortfall() + ")");
        } catch (BankException e) {                      // or the family
            System.out.println("bank error: " + e.getMessage());
        }
    }
}
\`\`\``,
      mistakes: `- **Choosing checked when unchecked fits** (or vice-versa) — forces needless \`throws\` or hides recoverable failures.
- **Omitting the \`(String, Throwable)\` constructor** — you can't chain causes, losing the root trace (§4.12).
- **Bloated hierarchies** — dozens of exception classes nobody catches distinctly; create types callers will actually differentiate.
- **Bad names** — not ending in \`Exception\`, or vague names (\`MyException\`) that don't describe the failure.
- **Putting non-serializable fields** in exceptions that cross process boundaries.
- **Swallowing the original** when wrapping — always pass the cause.`,
      bestPractices: `- **Name** custom exceptions clearly and end with **\`Exception\`** (\`PaymentDeclinedException\`).
- **Default to unchecked** (\`RuntimeException\`) unless the caller should be forced to recover.
- Always provide **\`(message)\`** and **\`(message, cause)\`** constructors; preserve the cause when wrapping (§4.12).
- Add **only the context fields** callers need (ids, codes); expose them via getters.
- Keep the **hierarchy shallow** and meaningful; a common base per module aids broad catches.
- Document each exception in the API (Javadoc) and in \`throws\`/method contracts.`,
      interview: `**Q1. How do you create a custom exception?**
Extend \`Exception\` (checked) or \`RuntimeException\` (unchecked) and provide standard constructors (message, message+cause).

**Q2. Checked vs unchecked for a custom exception — how to decide?**
Unchecked for programming errors / when you don't want to force handling (modern default); checked when the failure is recoverable and the caller must handle it.

**Q3. Why include a \`(String, Throwable)\` constructor?**
To support exception chaining — preserving the original cause and its stack trace (§4.12).

**Q4. What's the naming convention?**
End the class name with \`Exception\` and make it descriptive (\`OrderNotFoundException\`).

**Q5. Can a custom exception carry extra data?**
Yes — add fields (e.g., an error code or id) set via constructor and exposed via getters.

**Q6. Any serialization concern?**
Exceptions are \`Serializable\`; added fields should be serializable (or transient), and a \`serialVersionUID\` avoids warnings if they cross processes.`,
      exercises: `1. Create an unchecked \`OrderNotFoundException(long id)\` that stores and exposes the id.
2. Create a checked \`PaymentDeclinedException\` and show a caller is forced to handle/declare it.
3. Add a \`(message, cause)\` constructor and wrap a caught \`NumberFormatException\` in your custom exception.
4. Build a 2-level hierarchy (\`ServiceException\` → \`ValidationException\`) and catch both specifically and generally.`,
      challenges: `Design a small exception hierarchy for an e-commerce checkout: a base \`CheckoutException\` (unchecked) with subclasses \`OutOfStockException\` (carrying the product id), \`PaymentDeclinedException\` (carrying a decline code), and \`InvalidCouponException\`. Give each proper constructors (including cause) and context fields. Then write a checkout method that throws the right type per failure and a caller that handles each distinctly, and justify your checked/unchecked choice for each (§4.3/§4.4).`,
      summary: `- **Custom exceptions** extend \`Exception\` (checked) or \`RuntimeException\` (unchecked) to model **domain failures** callers can catch precisely.
- **Default to unchecked**; use checked only when the caller can and should recover.
- Provide **\`(message)\`** and **\`(message, cause)\`** constructors (chaining, §4.12) and add only useful **context fields**.
- Name them \`...Exception\`, keep hierarchies shallow, and translate low-level exceptions at **boundaries** (§4.12).`
    }),

    /* 4.12 Chained Exceptions & Stack Traces — causes, wrapping, diagnosis. */
    topic({
      id: "chained-exceptions", chapter: "4.12", title: "Chained Exceptions & Stack Traces",
      subtitle: "Wrapping causes, reading stack traces, and how exceptions propagate.",
      readTime: "16 min", level: "Advanced", deep: true,
      objectives: [
        "Chain exceptions with a cause and read \`getCause()\` chains.",
        "Wrap-and-rethrow to translate exceptions across layers without losing the root.",
        "Read and interpret a stack trace (including 'Caused by').",
        "Understand propagation and exception translation patterns."
      ],
      concept: `**Exception chaining** lets one exception carry another as its **cause**, so when you translate a low-level failure into a higher-level one you don't lose the original. You set the cause via a constructor (\`new X(message, cause)\`) or \`initCause()\`:

\`\`\`java
try {
    jdbc.query();                       // throws SQLException (low-level)
} catch (SQLException e) {
    throw new DataAccessException("load failed", e);  // wrap, preserving the cause
}
\`\`\`

The new \`DataAccessException\` (§4.11) is what callers see, but \`getCause()\` still returns the original \`SQLException\` — and the printed stack trace shows both via a **"Caused by:"** section.`,
      why: `Chaining + translation solve a real architectural problem:

- **Don't leak implementation details** — upper layers shouldn't depend on \`SQLException\`/\`IOException\`; wrap them in domain exceptions (§4.11) so persistence/IO choices stay hidden.
- **Don't lose the root cause** — wrapping *without* the cause throws away the trace that pinpoints the bug. Always pass the cause.
- **Readable diagnostics** — a chained trace tells the full story: "checkout failed → caused by data access error → caused by SQL timeout."

This **exception translation** pattern is everywhere in layered apps and frameworks (Spring's \`DataAccessException\` hierarchy is exactly this).`,
      chaining: `**How to chain:**

\`\`\`java
// 1) constructor with cause (preferred)
throw new ServiceException("checkout failed", sqlEx);

// 2) initCause() when a constructor with cause isn't available
ServiceException ex = new ServiceException("checkout failed");
ex.initCause(sqlEx);
throw ex;

// reading the chain
Throwable cause = ex.getCause();           // the wrapped exception
while (cause != null) {                      // walk to the root
    System.out.println(cause);
    cause = cause.getCause();
}
\`\`\`

This is why custom exceptions **must** provide a \`(String, Throwable)\` constructor (§4.11).`,
      stackTraces: `**Reading a stack trace** — an essential debugging skill:

\`\`\`
Exception in thread "main" com.shop.ServiceException: checkout failed
    at com.shop.CheckoutService.checkout(CheckoutService.java:42)   <- where it was thrown
    at com.shop.Main.main(Main.java:10)                            <- caller chain
Caused by: java.sql.SQLException: connection timeout                <- the ROOT cause
    at com.shop.OrderRepo.save(OrderRepo.java:88)
    ... 2 more
\`\`\`

How to read it:

- The **top line** is the exception type + message.
- Each \`at ...\` line is a **stack frame** (class.method(File:line)), **most recent first** — the **top frame is where it was thrown**.
- **"Caused by:"** shows the chained cause; follow it down to the **root** — usually the real culprit.
- **"... N more"** means the remaining frames match the enclosing trace (collapsed for brevity).

Read top-to-bottom for *what failed and where*, then jump to the **deepest "Caused by"** for *why*.`,
      propagation: `**Propagation** is how an uncaught exception travels up the call stack (§4.1): each method that doesn't catch it is abandoned and the search continues in its caller, accumulating the call chain into the stack trace. The trace is **captured when the exception object is constructed** (§4.8), so it reflects the throw site. Key API:

| Method | Purpose |
|---|---|
| \`getMessage()\` | the detail message |
| \`getCause()\` | the chained cause (or null) |
| \`getStackTrace()\` | frames as a \`StackTraceElement[]\` |
| \`printStackTrace()\` | print type, message, frames, and causes |
| \`addSuppressed()\` / \`getSuppressed()\` | try-with-resources suppressed exceptions (§4.10) |`,
      internal: `When you **rethrow the same object** (\`throw e;\`), the original trace is preserved unchanged. When you **wrap** (\`new X(message, e)\`), the new exception captures a trace at the wrap site **and** links the original via \`getCause()\` — so you see *both* locations. Avoid \`new X(e.getMessage())\` (copying only the message): it **discards the cause and the root trace**, a frequent and painful mistake. Note that re-throwing repeatedly without wrapping won't "reset" the trace — it always points at the original construction site.`,
      useCases: `- **Layer boundaries**: repository wraps \`SQLException\` → \`DataAccessException\`; service wraps that → \`ServiceException\`.
- **Library facades**: present a clean exception type while keeping the underlying cause for diagnostics.
- **Async/concurrent code** (Module 8): causes surface inside \`ExecutionException.getCause()\`.
- **Logging**: log the exception object (not just \`getMessage()\`) so the full chained trace is recorded.`,
      code: `\`\`\`java
class DataAccessException extends RuntimeException {
    DataAccessException(String m, Throwable cause) { super(m, cause); }
}
class ServiceException extends RuntimeException {
    ServiceException(String m, Throwable cause) { super(m, cause); }
}

public class ChainDemo {
    static void repo() { throw new IllegalStateException("connection timeout"); } // root
    static void dao()  {
        try { repo(); }
        catch (RuntimeException e) { throw new DataAccessException("save failed", e); } // wrap
    }
    static void service() {
        try { dao(); }
        catch (RuntimeException e) { throw new ServiceException("checkout failed", e); } // wrap
    }
    public static void main(String[] args) {
        try { service(); }
        catch (ServiceException e) {
            System.out.println(e.getMessage());
            Throwable c = e.getCause();
            while (c != null) { System.out.println("  caused by: " + c.getMessage()); c = c.getCause(); }
            // prints: checkout failed / caused by: save failed / caused by: connection timeout
        }
    }
}
\`\`\``,
      mistakes: `- **Wrapping without the cause** — \`throw new X(e.getMessage())\` discards the root trace; pass \`e\` as the cause.
- **Logging only \`getMessage()\`** — you lose the stack trace and chain; log the exception object.
- **Reading a trace bottom-up for the throw site** — the **top** frame is where it was thrown; the **deepest "Caused by"** is the root reason.
- **Over-wrapping** — re-wrapping at every level adds noise; translate at meaningful **boundaries** only.
- **Swallowing then throwing a new unrelated exception** — breaks the causal chain and hides the bug.
- **Catching and \`printStackTrace()\` then continuing** — not real handling (§4.13).`,
      bestPractices: `- **Always preserve the cause** when translating: \`new DomainException("...", original)\`.
- **Translate at layer boundaries**, not at every method — keep the chain meaningful.
- **Log the exception object** (frameworks print the full chain) rather than just its message.
- Read traces **top for where**, **deepest "Caused by" for why**.
- Use **try-with-resources** (§4.10) so close-time failures become *suppressed*, not lost.
- Don't expose low-level exceptions across module boundaries — wrap them (§4.11).`,
      interview: `**Q1. What is exception chaining?**
Carrying one exception as the *cause* of another (via the cause constructor or \`initCause\`), so translation preserves the original.

**Q2. How do you wrap an exception without losing the original?**
Pass it as the cause: \`throw new MyException("msg", original)\`; retrieve with \`getCause()\`.

**Q3. How do you read a stack trace?**
Top line = type/message; frames are most-recent-first (top = throw site); "Caused by" chains to the root; "... N more" collapses shared frames.

**Q4. What is exception translation and why do it?**
Converting a low-level exception into a higher-level/domain one at a boundary, to hide implementation details while preserving the cause.

**Q5. When is the stack trace captured?**
When the exception object is constructed (not when thrown/rethrown).

**Q6. Difference between a cause and a suppressed exception?**
A *cause* is the underlying exception you wrapped; a *suppressed* exception is a secondary failure (e.g., from \`close()\`) attached during try-with-resources (§4.10).`,
      exercises: `1. Build a 3-layer wrap (repo → dao → service), each adding context, and walk the \`getCause()\` chain to the root.
2. Demonstrate the bug of \`new X(e.getMessage())\` losing the cause vs \`new X(msg, e)\` preserving it.
3. Print a chained \`printStackTrace()\` and identify the throw site and the root "Caused by".
4. Use \`getStackTrace()\` to print just the top frame's class, method, and line.`,
      challenges: `Implement exception translation across a realistic stack: a \`JdbcOrderRepository\` that throws \`SQLException\`, a \`OrderService\` that wraps it into an unchecked \`OrderProcessingException\` (§4.11) with the cause, and a controller that logs the full chain and returns a user-friendly message. Then deliberately introduce the "lost cause" bug and show how the resulting stack trace becomes useless, proving why cause preservation matters.`,
      summary: `- **Chaining** carries a *cause* (\`new X(msg, cause)\` / \`initCause\`) so **translation** across layers keeps the root — never wrap with only \`getMessage()\`.
- **Stack traces**: top = throw site (most-recent-first), **"Caused by"** = chained root, "... N more" = collapsed shared frames.
- The trace is captured at **construction**; **log the exception object**, and translate at **boundaries** (§4.11).
- **Cause** (wrapped) vs **suppressed** (try-with-resources, §4.10) are distinct. Propagation basics: §4.1.`
    }),

    /* 4.13 Best Practices — capstone of robust error handling. */
    topic({
      id: "best-practices", chapter: "4.13", title: "Exception Handling Best Practices",
      subtitle: "Capstone — the rules that separate robust code from fragile code.",
      readTime: "16 min", level: "Advanced", deep: true,
      objectives: [
        "Apply the core do's and don'ts of exception handling.",
        "Avoid anti-patterns: swallowing, over-catching, exceptions for control flow.",
        "Design clean error strategies across application layers.",
        "Consolidate the module into an interview-ready checklist."
      ],
      concept: `This capstone distills the module into **principles for production-grade error handling**. Good exception handling is less about syntax and more about **judgment**: catch what you can handle, fail fast on what you can't, never hide failures, and preserve the information needed to diagnose problems. Everything here builds on §4.1–§4.12.`,
      coreRules: `**The non-negotiable do's and don'ts:**

| Do ✅ | Don't ❌ |
|---|---|
| Catch the **most specific** exception you can handle | Catch \`Exception\`/\`Throwable\` broadly |
| **Fail fast** — validate early, throw clearly (§4.8) | Let bad data flow deep then crash mysteriously |
| **Preserve the cause** when wrapping (§4.12) | \`throw new X(e.getMessage())\` (lost trace) |
| **Log or rethrow** with context | Swallow: \`catch (Exception e) {}\` |
| Use **try-with-resources** (§4.10) | Hand-rolled \`finally\` close that masks errors |
| Use **unchecked** for programming bugs (§4.4) | Force \`throws\` everywhere for unrecoverable errors |
| Throw **meaningful/custom** types (§4.11) | Throw generic \`RuntimeException\`/\`Exception\` |
| Clean up in \`finally\`/resources | \`return\`/\`throw\` inside \`finally\` (§4.7) |`,
      antipatterns: `**The classic anti-patterns to eliminate:**

1. **Swallowing** — \`catch (Exception e) {}\` hides bugs; the system fails silently. *At minimum* log with context.
2. **Catch-log-continue** — catching, calling \`printStackTrace()\`, then proceeding as if nothing happened isn't handling; either recover or rethrow.
3. **Over-catching** — \`catch (Exception e)\` around code that throws three specific types you'd handle differently.
4. **Exceptions as control flow** — using try/catch to break loops or branch (slow + unreadable, §4.1).
5. **Losing the cause** — wrapping without chaining (§4.12).
6. **Leaky abstractions** — letting \`SQLException\`/\`IOException\` bubble through every layer instead of translating at a boundary (§4.11).
7. **Empty/throwing \`finally\`** — masking the real exception (§4.7).

\`\`\`java
// ❌ anti-pattern
try { risky(); } catch (Exception e) { } // silent failure

// ✅ fix: handle, or log-and-rethrow with context
try { risky(); }
catch (IOException e) { throw new ServiceException("import failed for " + file, e); }
\`\`\``,
      layeredStrategy: `**A clean layered error strategy** (how seniors structure it):

- **Low layers (repo/IO)** — declare or throw specific exceptions; don't log-and-swallow.
- **Boundaries (service edges)** — **translate** low-level exceptions into domain exceptions (§4.11/§4.12), preserving the cause.
- **Top boundary (controller / request handler / \`main\`)** — **handle once**: log the full chain (the exception object, §4.12) and produce a user-facing result (error response/message).
- **Cross-cutting** — centralize handling (e.g., a framework's global exception handler) instead of scattering try/catch everywhere.

Rule of thumb: **handle each failure exactly once, at the layer that has the context to act on it.**`,
      performanceNotes: `**Performance & correctness notes:**

- Throwing is relatively cheap, but **constructing** an exception (capturing the stack trace) is the costly part — don't use exceptions for routine flow.
- Don't catch exceptions just to **\`printStackTrace()\`** in production — use a proper logger.
- Keep \`try\` blocks **small** so you know exactly which call failed (§4.5).
- Prefer **prevention** (validation, \`Optional\`, bounds checks) over catching unchecked exceptions (§4.4).
- Use **try-with-resources** to avoid leaks and suppressed-exception bugs (§4.10).`,
      useCases: `- **REST APIs**: a global handler maps exceptions to HTTP status + JSON error bodies.
- **Batch jobs**: catch per-item, log, continue; fail the job only on fatal errors.
- **Libraries/SDKs**: a documented exception hierarchy; never leak internals.
- **Concurrency** (Module 8): handle \`InterruptedException\` correctly (restore the interrupt flag), surface causes from \`ExecutionException\`.`,
      code: `\`\`\`java
// A clean boundary handler that ties the module together
public String handleImport(String path) {
    try (var in = java.nio.file.Files.newBufferedReader(java.nio.file.Path.of(path))) {
        return process(in);                       // small try, specific resources (§4.10)
    } catch (java.io.FileNotFoundException e) {    // specific first (§4.6)
        log.warn("file missing: {}", path, e);
        return "No such file";
    } catch (java.io.IOException e) {              // broader fallback
        log.error("import failed: {}", path, e);  // log the exception OBJECT (§4.12)
        throw new ImportException("import failed for " + path, e); // translate + chain
    }
}
\`\`\``,
      mistakes: `- **Swallowing / catch-log-continue** — the most damaging habit; failures vanish.
- **Broad \`catch (Exception e)\`** when types need different handling.
- **\`e.printStackTrace()\` in production** instead of structured logging.
- **Losing causes** and **leaking low-level exceptions** through layers.
- **Exceptions for control flow** and **giant try blocks** that obscure the failing call.
- **Mishandling \`InterruptedException\`** — swallowing it instead of restoring the interrupt status (Module 8).`,
      bestPractices: `**The interview-ready checklist:**

- Catch **specific**, handle **once**, at the **right layer**; fail fast elsewhere.
- **Never swallow**; log with context **or** rethrow; log the **exception object**, not just its message.
- **Preserve causes** (§4.12); **translate** at boundaries into meaningful/custom types (§4.11).
- Default custom exceptions to **unchecked**; reserve **checked** for recoverable cases (§4.3/§4.4).
- Use **try-with-resources** (§4.10); keep \`finally\` cleanup-only and **never** return/throw from it (§4.7).
- Keep \`try\` blocks **small**; prefer **prevention** over catching; don't use exceptions for flow control.
- Provide **clear, contextual messages** (include offending values/ids).`,
      interview: `**Q1. Why are empty catch blocks dangerous?**
They swallow failures silently, hiding bugs and making diagnosis impossible.

**Q2. Should you catch \`Exception\` broadly?**
Only as a last-resort boundary; otherwise catch specific types you can actually handle differently.

**Q3. Where should exceptions be handled in a layered app?**
Once, at the layer with the context to act — usually translate at service boundaries and handle/log at the top boundary.

**Q4. Checked or unchecked for custom exceptions by default?**
Unchecked, unless the caller can and should recover (then checked).

**Q5. How do you avoid resource leaks?**
Use try-with-resources for \`AutoCloseable\` resources (§4.10) instead of manual \`finally\`.

**Q6. What's wrong with \`printStackTrace()\` in production?**
It bypasses your logging/monitoring; use a structured logger and log the exception object (with its chain).

**Q7. Why not use exceptions for control flow?**
They're expensive to construct, obscure logic, and signal misuse of the mechanism — use normal conditionals.`,
      exercises: `1. Refactor a method full of anti-patterns (empty catch, broad \`catch (Exception)\`, \`printStackTrace\`, lost cause) into clean handling.
2. Design a 3-layer flow that translates exceptions at the service boundary and handles once at the top.
3. Replace a manual \`try-finally\` close with try-with-resources and confirm no leak/masking.
4. Write a guideline doc (10 bullets) summarizing your team's exception policy.`,
      challenges: `Take a small but messy service (mixed checked/unchecked, swallowed exceptions, leaked \`SQLException\`, giant try block, \`printStackTrace\`) and rearchitect it end-to-end: specific catches, try-with-resources, domain exception translation with preserved causes, unchecked custom types, and a single top-level handler that logs the full chain. Write a short before/after analysis mapping each fix to the relevant chapter (§4.3–§4.12) — the capstone of the module.`,
      summary: `- Catch **specific**, handle **once**, at the **right layer**; **fail fast** elsewhere with clear messages.
- **Never swallow**; **preserve causes** and **translate** at boundaries into meaningful/custom (unchecked-by-default) types (§4.11/§4.12).
- Use **try-with-resources** (§4.10); keep \`finally\` cleanup-only (§4.7); keep \`try\` blocks small; **prevent** over catching (§4.4).
- Log the **exception object** (not \`printStackTrace\`), don't use exceptions for control flow — this checklist ties §4.1–§4.12 together.`
    })
  ]
});
