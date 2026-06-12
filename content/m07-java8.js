/* Module 7: Java 8 & Modern Java — edit ONLY this file for this module's content.
   Authored at ~2x Module 2 depth (Module-3 style), ordered BASIC -> ADVANCED:
     7.1 lambdas -> 7.2 functional interfaces -> 7.3 method references
     -> 7.4 Predicate -> 7.5 Function & BiFunction -> 7.6 Consumer & Supplier
     -> 7.7 Unary/BinaryOperator -> 7.8 Streams API -> 7.9 Stream operations
     -> 7.10 Collectors -> 7.11 Optional -> 7.12 default & static interface methods
     -> 7.13 Date/Time API.
   Each topic() renders sections in declared order; see assets/site.js PART_LABELS. */
registerModule({
  id: "java8",
  module: "Java 8 & Modern Java",
  page: "module-java8.html",
  icon: "⚡",
  tagline: "Lambdas, functional interfaces, streams, Optional, and the Date/Time API.",
  lessons: [

    /* ===================== BASIC ===================== */

    /* 7.1 Lambda Expressions — the foundation of functional Java. */
    topic({
      id: "lambda-expressions", chapter: "7.1", title: "Lambda Expressions",
      subtitle: "Anonymous functions — the syntax that made Java functional.",
      readTime: "16 min", level: "Core", deep: true,
      objectives: [
        "Write lambda expressions and understand their syntax forms.",
        "Explain how a lambda relates to a functional interface (§7.2).",
        "Capture variables and respect the effectively-final rule.",
        "Contrast lambdas with anonymous inner classes."
      ],
      concept: `A **lambda expression** is a concise way to represent an **anonymous function** — a block of behaviour you can pass around as data. Introduced in **Java 8**, lambdas are the cornerstone of functional-style Java (streams §7.8, callbacks, event handlers).

\`\`\`java
// anonymous class (pre-Java 8)
Runnable r1 = new Runnable() {
    public void run() { System.out.println("hi"); }
};
// lambda (Java 8)
Runnable r2 = () -> System.out.println("hi");
\`\`\`

A lambda has three parts: **parameters**, the **arrow \`->\`**, and a **body**. It's an implementation of a **functional interface** (§7.2) — an interface with exactly one abstract method.`,
      why: `Lambdas make Java code **shorter, clearer, and more expressive** by treating behaviour as a first-class value:

- **Less boilerplate** — replace bulky anonymous classes with a single line.
- **Behaviour parameterisation** — pass *what to do* to a method (e.g., a \`Comparator\`, a filter).
- **Enable the Streams API** (§7.8) — declarative data processing.
- **Readability** — intent over plumbing.

This shifted Java toward a functional style alongside its OOP roots (Module 2).`,
      syntax: `**Syntax forms (all valid):**

\`\`\`java
() -> System.out.println("no args")            // no parameters
x -> x * x                                      // one param (parens optional)
(int x) -> x * x                                // explicit type (parens required)
(x, y) -> x + y                                 // multiple params
(x, y) -> { int s = x + y; return s; }          // block body needs return + ;
() -> { return 42; }                            // block with return
\`\`\`

Rules:
- **Single expression** bodies return their value implicitly (no \`return\`, no braces).
- **Block bodies** \`{ ... }\` need explicit \`return\` (if non-void) and semicolons.
- **Parameter types** are usually inferred; if you write one type, write all.`,
      capture: `**Variable capture** — lambdas can use variables from the enclosing scope, but with the **effectively final** rule:

\`\`\`java
int factor = 3;                  // effectively final (never reassigned)
Function<Integer,Integer> f = x -> x * factor;   // captures 'factor'
// factor = 4;                   // ❌ would break the lambda — not allowed

List<Integer> out = new ArrayList<>();
nums.forEach(n -> out.add(n));   // can MUTATE captured objects, just not reassign the var
\`\`\`

A lambda may **read** local variables only if they're **final or effectively final** (assigned once). It can freely access instance/static fields and call methods. Unlike anonymous classes, a lambda does **not** create a new scope for \`this\` — \`this\` refers to the **enclosing** instance, not the lambda.`,
      vsAnonymous: `**Lambda vs anonymous inner class** (a classic interview comparison):

| | Lambda | Anonymous class |
|---|---|---|
| Syntax | concise (\`x -> x+1\`) | verbose (\`new I(){...}\`) |
| \`this\` | enclosing instance | the anonymous object itself |
| Target | only a **functional** interface | any interface/abstract class |
| State/fields | none | can have fields |
| Compiled as | \`invokedynamic\` (no extra .class) | a separate \`.class\` file |

Lambdas are not just "syntactic sugar" for anonymous classes — they compile via \`invokedynamic\` to a generated method, avoiding a class per lambda and behaving differently for \`this\`.`,
      internal: `At compile time a lambda is matched to a **functional interface target type** (§7.2) — its parameter/return types must fit that interface's single abstract method. At runtime the JVM uses the **\`invokedynamic\`** bytecode + \`LambdaMetafactory\` to create the implementing instance lazily (often without generating a class per lambda), which is lighter than anonymous classes. Because of this design, a lambda has no \`this\` of its own and no per-instance fields — it's pure behaviour.`,
      useCases: `- **Streams** (§7.8): \`filter\`, \`map\`, \`forEach\` take lambdas.
- **Comparators** (Module 5 §5.4): \`comparing(p -> p.age)\`.
- **Event handlers / callbacks**: \`button.onClick(e -> ...)\`.
- **Runnable/Callable** for threads (Module 8): \`new Thread(() -> work())\`.
- **Functional interface arguments** generally (§7.4–§7.7).`,
      code: `\`\`\`java
import java.util.*;
import java.util.function.*;

public class LambdaDemo {
    public static void main(String[] args) {
        // behaviour as data
        Comparator<String> byLen = (a, b) -> Integer.compare(a.length(), b.length());
        List<String> words = new ArrayList<>(List.of("ccc", "a", "bb"));
        words.sort(byLen);
        System.out.println(words);            // [a, bb, ccc]

        // capturing an effectively-final variable
        int base = 10;
        Function<Integer,Integer> addBase = n -> n + base;
        System.out.println(addBase.apply(5)); // 15

        // running on a thread (Module 8)
        new Thread(() -> System.out.println("worker")).start();

        words.forEach(w -> System.out.println(w.toUpperCase()));
    }
}
\`\`\``,
      mistakes: `- **Reassigning a captured local variable** — must be effectively final (compile error).
- **Misunderstanding \`this\`** — in a lambda \`this\` is the enclosing instance, not the lambda (unlike anonymous classes).
- **Forgetting \`return\`/braces** semantics — single expression vs block body.
- **Mixing inferred and explicit parameter types** — all-or-nothing.
- **Overusing complex multi-line lambdas** — extract to a named method/reference (§7.3) for readability.
- **Trying to target a non-functional interface** — a lambda needs exactly one abstract method (§7.2).`,
      bestPractices: `- Keep lambdas **short** (ideally one expression); extract complex logic to methods and use **method references** (§7.3).
- Rely on **type inference**; only add parameter types when it aids clarity.
- Treat captured variables as immutable (effectively final); don't mutate shared state from lambdas (especially in parallel streams, §7.8).
- Prefer lambdas over anonymous classes for functional interfaces.
- Name your variables/parameters meaningfully so the lambda reads like intent.`,
      interview: `**Q1. What is a lambda expression?**
A concise anonymous function — parameters, \`->\`, body — that implements a functional interface's single abstract method.

**Q2. What is the 'effectively final' rule?**
A lambda can capture a local variable only if it's never reassigned after initialisation (final or effectively final).

**Q3. Lambda vs anonymous inner class?**
Lambdas are concise, target only functional interfaces, have no own \`this\`/fields, and compile via \`invokedynamic\`; anonymous classes are verbose, can target any type, have their own \`this\` and state, and generate a class file.

**Q4. What does \`this\` refer to inside a lambda?**
The enclosing instance (not the lambda object).

**Q5. Can a lambda modify a captured local variable?**
No — it must be effectively final; but it can mutate the *object* a final reference points to.

**Q6. What bytecode supports lambdas?**
\`invokedynamic\` with \`LambdaMetafactory\`.`,
      exercises: `1. Rewrite three anonymous-class instances (Runnable, Comparator, ActionListener-like) as lambdas.
2. Write lambdas in expression and block-body form for the same logic.
3. Demonstrate the effectively-final rule by trying to reassign a captured variable.
4. Show that \`this\` in a lambda refers to the enclosing instance, unlike in an anonymous class.`,
      challenges: `Build a tiny event system: a \`Button\` with \`onClick(Runnable)\` and \`onHover(Consumer<String>)\`. Register behaviour with lambdas that capture enclosing state, then trigger the events. Demonstrate the effectively-final restriction and explain why parallel-stream code (§7.8) must avoid mutating captured state. Compare one handler written as a lambda vs an anonymous class, noting the \`this\` difference.`,
      summary: `- A **lambda** is an anonymous function (\`params -> body\`) implementing a **functional interface's** single abstract method (§7.2).
- Bodies: single-expression (implicit return) or block (\`{ return ...; }\`); types usually inferred.
- Captures **effectively-final** locals; \`this\` = enclosing instance; compiled via **\`invokedynamic\`** (lighter than anonymous classes).
- Foundation for **method references (§7.3)**, the **Streams API (§7.8)**, comparators (Module 5), and threads (Module 8).`
    }),

    /* 7.2 Functional Interfaces (Overview). */
    topic({
      id: "functional-interfaces-overview", chapter: "7.2", title: "Functional Interfaces (Overview)",
      subtitle: "The single-abstract-method contracts that lambdas implement.",
      readTime: "15 min", level: "Core", deep: true,
      objectives: [
        "Define a functional interface and the role of @FunctionalInterface.",
        "Relate functional interfaces to lambdas (§7.1) and method references (§7.3).",
        "Tour the built-in java.util.function families.",
        "Write your own functional interfaces correctly."
      ],
      concept: `A **functional interface** is an interface with **exactly one abstract method** (SAM — Single Abstract Method). That single method is the **target** a lambda (§7.1) or method reference (§7.3) implements. Functional interfaces are what make lambdas type-safe — a lambda *is* an instance of some functional interface.

\`\`\`java
@FunctionalInterface
interface Transformer {
    String apply(String input);    // the one abstract method
}

Transformer upper = s -> s.toUpperCase();   // lambda implements it
System.out.println(upper.apply("hi"));      // HI
\`\`\`

\`default\` and \`static\` methods (§7.12) don't count against the "one abstract method" rule — an interface can have many of those and still be functional.`,
      why: `Functional interfaces are the **bridge between lambdas and the type system**. Java is statically typed, so a lambda must have a target type; that type is always a functional interface. They let APIs accept *behaviour* as a typed parameter:

- \`Comparator<T>\` (compare), \`Runnable\` (run), \`Callable<T>\` (call) — classic SAM types.
- The \`java.util.function\` package provides general-purpose ones (Predicate, Function, …) so you rarely need to invent your own.
- Streams (§7.8) are built entirely on them.`,
      annotation: `**\`@FunctionalInterface\`** is an optional annotation that makes the compiler **enforce** the SAM rule — if you accidentally add a second abstract method, it's a compile error. It also documents intent.

\`\`\`java
@FunctionalInterface
interface Validator<T> {
    boolean validate(T value);          // ok: one abstract method
    // boolean check(T value);          // ❌ would break @FunctionalInterface
    default Validator<T> negate() {     // ok: default methods allowed
        return v -> !validate(v);
    }
}
\`\`\`

Use it on any interface meant for lambdas — it prevents future maintainers from breaking lambda-compatibility.`,
      builtins: `**The \`java.util.function\` toolkit** — learn these so you don't reinvent them (each detailed in §7.4–§7.7):

| Interface | Abstract method | Meaning | Chapter |
|---|---|---|---|
| \`Predicate<T>\` | \`boolean test(T)\` | a condition | §7.4 |
| \`Function<T,R>\` | \`R apply(T)\` | transform T→R | §7.5 |
| \`BiFunction<T,U,R>\` | \`R apply(T,U)\` | two args → R | §7.5 |
| \`Consumer<T>\` | \`void accept(T)\` | side-effect, no return | §7.6 |
| \`Supplier<T>\` | \`T get()\` | produce a value | §7.6 |
| \`UnaryOperator<T>\` | \`T apply(T)\` | T→T | §7.7 |
| \`BinaryOperator<T>\` | \`T apply(T,T)\` | (T,T)→T | §7.7 |

There are also **primitive specializations** (\`IntPredicate\`, \`ToIntFunction\`, \`IntUnaryOperator\`, …) that avoid autoboxing for performance, and **legacy** SAM types (\`Runnable\`, \`Callable\`, \`Comparator\`).`,
      internal: `A functional interface can declare:

- **exactly one abstract method** (the SAM),
- any number of **\`default\`** and **\`static\`** methods (§7.12, Module 2 §2.12),
- and (a subtlety) **abstract methods that override \`Object\` methods** like \`equals\`/\`toString\` **do not count** toward the SAM total — so \`Comparator\` (with \`compare\` plus a redeclared \`equals\`) is still functional.

At compile time the lambda's signature is checked against the SAM; the lambda becomes an instance of that interface via \`invokedynamic\` (§7.1). The interface is the *target type* — the same lambda \`x -> x\` could be a \`UnaryOperator\`, a \`Function\`, or your own type, depending on context.`,
      useCases: `- **Strategy/behaviour parameters**: pass a \`Predicate\`/\`Function\` to a method.
- **Streams** (§7.8) consume these throughout (\`filter(Predicate)\`, \`map(Function)\`).
- **Callbacks & event handlers** via \`Consumer\`/\`Runnable\`.
- **Custom DSLs**: your own \`@FunctionalInterface\` for domain operations.`,
      code: `\`\`\`java
import java.util.*;
import java.util.function.*;

public class FunctionalDemo {
    // a method that accepts BEHAVIOUR via a functional interface
    static <T> List<T> filter(List<T> in, Predicate<T> keep) {
        List<T> out = new ArrayList<>();
        for (T t : in) if (keep.test(t)) out.add(t);
        return out;
    }
    @FunctionalInterface
    interface Greeter { String greet(String name); }

    public static void main(String[] args) {
        var evens = filter(List.of(1,2,3,4,5,6), n -> n % 2 == 0);
        System.out.println(evens);   // [2, 4, 6]

        Greeter g = name -> "Hello, " + name;   // custom functional interface
        System.out.println(g.greet("Shail"));   // Hello, Shail

        // one lambda, different target types:
        Function<Integer,Integer> sq = x -> x * x;
        UnaryOperator<Integer> sq2 = x -> x * x;
        System.out.println(sq.apply(4) + " " + sq2.apply(4)); // 16 16
    }
}
\`\`\``,
      mistakes: `- **Adding a second abstract method** to an interface meant for lambdas — breaks SAM (use \`@FunctionalInterface\` to catch it).
- **Forgetting that \`default\`/\`static\` methods don't break SAM** — they're allowed.
- **Reinventing built-ins** — writing a custom interface when \`Predicate\`/\`Function\` already fits.
- **Ignoring primitive specializations** — \`Function<Integer,Integer>\` boxes; \`IntUnaryOperator\` doesn't.
- **Confusing the interface (type) with the lambda (instance)** in terminology.`,
      bestPractices: `- Prefer the **built-in** \`java.util.function\` interfaces over custom ones.
- Annotate intentional functional interfaces with **\`@FunctionalInterface\`**.
- Use **primitive specializations** (\`IntPredicate\`, \`ToDoubleFunction\`) in hot/numeric code to avoid boxing.
- Keep custom functional interfaces **small and well-named** (one clear operation).
- Combine with **default methods** (§7.12) for composability (e.g., \`Predicate.and\`, §7.4).`,
      interview: `**Q1. What is a functional interface?**
An interface with exactly one abstract method (SAM); it's the target type for lambdas/method references.

**Q2. What does @FunctionalInterface do?**
It makes the compiler enforce the single-abstract-method rule (optional but recommended).

**Q3. Can a functional interface have default/static methods?**
Yes — any number; only abstract methods count toward the SAM rule. \`Object\` method redeclarations also don't count.

**Q4. Name some built-in functional interfaces.**
\`Predicate\`, \`Function\`, \`Consumer\`, \`Supplier\`, \`UnaryOperator\`, \`BinaryOperator\`, plus \`Runnable\`, \`Callable\`, \`Comparator\`.

**Q5. Why do primitive specializations exist?**
To avoid autoboxing overhead (e.g., \`IntPredicate\` vs \`Predicate<Integer>\`).

**Q6. Is \`Comparator\` a functional interface despite declaring equals?**
Yes — \`equals\` is an \`Object\` method redeclaration and doesn't count toward the SAM total.`,
      exercises: `1. Write a \`@FunctionalInterface\` \`Calculator\` with \`int calc(int,int)\` and implement add/multiply via lambdas.
2. Try adding a second abstract method and observe the @FunctionalInterface compile error.
3. Replace a custom \`StringTransformer\` interface with the built-in \`UnaryOperator<String>\`.
4. Use a primitive specialization (\`IntUnaryOperator\`) and explain the boxing it avoids.`,
      challenges: `Design a small validation DSL: a \`@FunctionalInterface Rule<T>\` with \`boolean test(T)\` plus default methods \`and\`, \`or\`, \`negate\` (composability — like \`Predicate\`). Build several rules with lambdas, compose them, and apply to a list. Then refactor it to simply use \`java.util.function.Predicate<T>\` and discuss when a custom functional interface is justified over a built-in.`,
      summary: `- A **functional interface** has exactly **one abstract method** (SAM) — the target a **lambda (§7.1)** / **method reference (§7.3)** implements.
- **\`@FunctionalInterface\`** enforces the SAM rule; \`default\`/\`static\`/\`Object\`-method declarations don't count against it.
- The **\`java.util.function\`** package (Predicate/Function/Consumer/Supplier/Operators — §7.4–§7.7) covers most needs, with **primitive specializations** to avoid boxing.
- Prefer built-ins; annotate custom ones; they power **Streams (§7.8)** and behaviour-parameterised APIs.`
    }),

    /* 7.3 Method References. */
    topic({
      id: "method-references", chapter: "7.3", title: "Method References",
      subtitle: "Shorthand for lambdas that just call an existing method.",
      readTime: "13 min", level: "Core", deep: true,
      objectives: [
        "Use the four kinds of method references.",
        "Convert simple lambdas to method references and back.",
        "Understand when a method reference improves readability.",
        "Relate constructor references to Supplier/Function (§7.4–§7.6)."
      ],
      concept: `A **method reference** (\`::\`) is a compact shorthand for a lambda whose body **just calls an existing method**. When a lambda merely forwards its arguments to a method, a method reference says the same thing more clearly.

\`\`\`java
// lambda
Function<String,Integer> f1 = s -> Integer.parseInt(s);
// method reference — same thing
Function<String,Integer> f2 = Integer::parseInt;

list.forEach(s -> System.out.println(s));   // lambda
list.forEach(System.out::println);          // method reference
\`\`\`

A method reference targets a **functional interface** (§7.2) exactly like a lambda — it's pure sugar that the compiler expands.`,
      why: `Method references improve **readability** when the lambda adds nothing but a call: \`String::toUpperCase\` reads better than \`s -> s.toUpperCase()\`. They emphasise *which method* over *how arguments are wired*, and pair beautifully with streams (§7.8). They're not more powerful than lambdas — just cleaner for the common "call this method" case.`,
      fourKinds: `**The four kinds of method reference:**

| Kind | Syntax | Equivalent lambda |
|---|---|---|
| **Static method** | \`ClassName::staticMethod\` | \`x -> ClassName.staticMethod(x)\` |
| **Instance method of a particular object** | \`obj::instanceMethod\` | \`x -> obj.instanceMethod(x)\` |
| **Instance method of an arbitrary object (of a type)** | \`ClassName::instanceMethod\` | \`(o, x) -> o.instanceMethod(x)\` |
| **Constructor** | \`ClassName::new\` | \`x -> new ClassName(x)\` |

\`\`\`java
Function<String,Integer> a = Integer::parseInt;        // static
Supplier<String> b = list::toString;                   // bound instance (particular obj)
Function<String,Integer> c = String::length;           // unbound instance (arbitrary String)
Supplier<ArrayList<String>> d = ArrayList::new;        // constructor
BiFunction<Integer,Integer,int[]> e = int[]::new;      // array constructor (size -> new int[size])... see note
\`\`\``,
      tricky: `The trickiest kind is the **arbitrary-object instance reference** (\`ClassName::instanceMethod\`): the first lambda parameter becomes the **receiver**.

\`\`\`java
// "for each string, call s.length()" — the String IS the argument that becomes the receiver
List<String> words = List.of("a", "bb", "ccc");
words.stream().map(String::length).forEach(System.out::println); // 1,2,3

// equivalent lambda:
words.stream().map(s -> s.length());
\`\`\`

Compare with the **bound** form, where the receiver is a *specific* object captured now: \`String greeting = "Hi"; Supplier<Integer> len = greeting::length;\`.`,
      internal: `Method references compile to the **same \`invokedynamic\` machinery** as lambdas (§7.1) — the compiler infers the functional-interface target and wires the call. Resolution can be ambiguous when a class has both a static and an instance method matching (\`ClassName::method\`); the compiler chooses based on the target functional interface's signature, and reports an error if truly ambiguous. **Constructor references** (\`Type::new\`) target a \`Supplier\` (no-arg), \`Function\` (one-arg constructor), or \`BiFunction\` (two-arg), etc., based on the target type — making them handy factories (Module 6 worked around \`new T()\` with \`Supplier<T>\`).`,
      useCases: `- **Streams** (§7.8): \`map(String::toUpperCase)\`, \`filter(Objects::nonNull)\`, \`forEach(System.out::println)\`.
- **Collectors/factories**: \`toCollection(ArrayList::new)\`, \`Supplier<List<T>>\` = \`ArrayList::new\`.
- **Comparators** (Module 5 §5.4): \`comparing(Person::getAge)\`.
- **Constructor references** as factories (Module 6 §6.2/§6.6).`,
      code: `\`\`\`java
import java.util.*;
import java.util.function.*;
import java.util.stream.*;

public class MethodRefDemo {
    record Person(String name, int age) {}
    public static void main(String[] args) {
        List<String> names = List.of("shail", "asha", "ravi");

        // static, unbound-instance, and bound references in a pipeline
        names.stream()
             .map(String::toUpperCase)                 // unbound instance
             .sorted(Comparator.naturalOrder())
             .forEach(System.out::println);            // bound instance (System.out)

        // constructor reference as a factory
        Supplier<List<String>> maker = ArrayList::new;
        List<String> fresh = maker.get();

        // comparator via reference
        List<Person> people = new ArrayList<>(List.of(new Person("A",30), new Person("B",25)));
        people.sort(Comparator.comparingInt(Person::age));
        System.out.println(people);

        // static reference
        List<Integer> nums = Stream.of("1","2","3").map(Integer::parseInt).collect(Collectors.toList());
        System.out.println(nums);   // [1, 2, 3]
    }
}
\`\`\``,
      mistakes: `- **Confusing bound vs unbound** instance references — \`obj::m\` captures a specific object; \`Class::m\` uses the first argument as receiver.
- **Forcing a method reference** where a lambda is clearer (e.g., when arguments are reordered or extra logic is needed).
- **Ambiguity** between static and instance methods of the same name — may not compile.
- **Expecting more power than a lambda** — method references only cover the "just call a method" case.
- **Side-effects in streams** via \`forEach(this::mutate)\` on shared state (especially parallel, §7.8).`,
      bestPractices: `- Use a method reference when the lambda **only calls one method** with the same arguments; otherwise keep the lambda.
- Prefer \`Class::method\` for stream mapping (\`String::length\`, \`Person::getName\`) — it reads as intent.
- Use **constructor references** (\`Type::new\`) as clean factories/suppliers.
- Don't sacrifice clarity for brevity — if a reader must pause to decode the reference, a lambda may be better.
- Combine with \`Comparator.comparing\` (Module 5) and stream operations (§7.9) for clean pipelines.`,
      interview: `**Q1. What is a method reference?**
A shorthand (\`::\`) for a lambda that just calls an existing method; it targets a functional interface.

**Q2. What are the four kinds?**
Static (\`Class::staticM\`), bound instance (\`obj::m\`), unbound instance (\`Class::instanceM\`), and constructor (\`Class::new\`).

**Q3. Difference between \`obj::m\` and \`Class::m\`?**
\`obj::m\` calls the method on a specific captured object; \`Class::m\` uses the first lambda argument as the receiver.

**Q4. What does \`ArrayList::new\` target?**
A \`Supplier\` (no-arg) or a \`Function\` (capacity arg), etc., depending on the target type — a constructor reference acting as a factory.

**Q5. Are method references more powerful than lambdas?**
No — they're a readability shorthand for the "call a single method" case.

**Q6. How are they compiled?**
Like lambdas, via \`invokedynamic\`.`,
      exercises: `1. Convert lambdas \`s -> s.toUpperCase()\`, \`s -> Integer.parseInt(s)\`, \`() -> new ArrayList<>()\` to method references.
2. Demonstrate bound vs unbound instance references with the same method.
3. Use \`Comparator.comparing(Person::getName)\` to sort a list.
4. Use a constructor reference as a \`Supplier\` factory.`,
      challenges: `Build a stream pipeline that parses a list of strings to integers (\`Integer::parseInt\`), filters non-null and positive values (\`Objects::nonNull\` + a lambda), maps to squares, collects into a \`TreeSet\` (\`TreeSet::new\` via \`toCollection\`), and prints each (\`System.out::println\`). Then rewrite each method reference as the equivalent lambda and discuss which reads better and why, identifying the kind of each reference.`,
      summary: `- A **method reference** (\`::\`) is shorthand for a lambda that just calls a method; same target (functional interface) and \`invokedynamic\` machinery as lambdas.
- Four kinds: **static** (\`Class::m\`), **bound instance** (\`obj::m\`), **unbound instance** (\`Class::m\` — first arg is receiver), **constructor** (\`Class::new\`).
- Use when it improves **readability** (especially in streams §7.8); keep a lambda when logic is more than a single call.
- Constructor references make clean **factories/suppliers** (Module 6).`
    }),

    /* ===================== CORE: java.util.function ===================== */

    /* 7.4 Predicate. */
    topic({
      id: "predicate", chapter: "7.4", title: "Predicate",
      subtitle: "A boolean-valued function — the building block of filtering.",
      readTime: "13 min", level: "Core", deep: true,
      objectives: [
        "Use Predicate<T> and its test method.",
        "Compose predicates with and, or, negate.",
        "Use static helpers (isEqual, not) and primitive specializations.",
        "Apply predicates in streams (§7.8) and validation."
      ],
      concept: `**\`Predicate<T>\`** is a functional interface (§7.2) representing a **boolean test** on one argument. Its single abstract method is **\`boolean test(T t)\`**. It answers yes/no questions about a value and is the backbone of **filtering**.

\`\`\`java
import java.util.function.Predicate;

Predicate<Integer> isEven = n -> n % 2 == 0;
System.out.println(isEven.test(4));   // true
System.out.println(isEven.test(7));   // false
\`\`\`

You'll see it everywhere: \`stream.filter(predicate)\` (§7.8), \`collection.removeIf(predicate)\` (Module 5 §5.2), validation rules.`,
      why: `A \`Predicate\` turns a **condition into a value** you can pass around, store, and combine. Instead of hard-coding \`if\` logic, you parameterise behaviour: a single \`filter\` method works with any condition. Its **composition** methods let you build complex conditions from simple ones declaratively.`,
      composition: `**Default methods for composition** (functional interfaces can have defaults, §7.2/§7.12):

| Method | Result |
|---|---|
| \`p.and(q)\` | true if **both** p and q (short-circuits) |
| \`p.or(q)\` | true if **either** p or q (short-circuits) |
| \`p.negate()\` | logical NOT of p |
| \`Predicate.isEqual(x)\` (static) | tests \`equals(x)\` |
| \`Predicate.not(p)\` (static, Java 11) | negation as a static helper |

\`\`\`java
Predicate<String> nonEmpty = s -> !s.isEmpty();
Predicate<String> shortStr = s -> s.length() < 5;
Predicate<String> valid = nonEmpty.and(shortStr);   // both conditions
System.out.println(valid.test("hi"));   // true
System.out.println(valid.test(""));     // false
\`\`\``,
      variants: `**Related predicate types:**

| Type | Method | Use |
|---|---|---|
| \`Predicate<T>\` | \`test(T)\` | one argument |
| \`BiPredicate<T,U>\` | \`test(T,U)\` | two arguments |
| \`IntPredicate\` / \`LongPredicate\` / \`DoublePredicate\` | \`test(int)\` etc. | primitive (no boxing) |

\`\`\`java
BiPredicate<String,Integer> longerThan = (s, n) -> s.length() > n;
IntPredicate positive = i -> i > 0;   // avoids boxing Integer
\`\`\``,
      internal: `\`Predicate.test\` is just a method call; \`and\`/\`or\`/\`negate\` are **default methods** that return a *new* predicate wrapping the originals — so composition builds a small tree of lambdas evaluated lazily on \`test\`. \`and\`/\`or\` **short-circuit** (like \`&&\`/\`||\`): \`p.and(q)\` won't evaluate \`q\` if \`p\` is false. Primitive specializations (\`IntPredicate\`) exist to avoid autoboxing in numeric pipelines (§7.2).`,
      useCases: `- **Stream filtering**: \`stream.filter(isActive.and(isAdult))\` (§7.8).
- **Bulk removal**: \`list.removeIf(String::isBlank)\` (Module 5).
- **Validation rules** that compose (\`notNull.and(matchesPattern)\`).
- **Search/match**: \`anyMatch\`/\`allMatch\`/\`noneMatch\` take predicates (§7.9).`,
      code: `\`\`\`java
import java.util.*;
import java.util.function.*;
import java.util.stream.*;

public class PredicateDemo {
    public static void main(String[] args) {
        Predicate<Integer> isEven = n -> n % 2 == 0;
        Predicate<Integer> isPositive = n -> n > 0;

        List<Integer> nums = List.of(-2, -1, 0, 1, 2, 3, 4);
        List<Integer> evenPositives = nums.stream()
            .filter(isEven.and(isPositive))     // composition
            .collect(Collectors.toList());
        System.out.println(evenPositives);      // [2, 4]

        // negate + static not (Java 11)
        System.out.println(nums.stream().filter(Predicate.not(isEven)).collect(Collectors.toList()));

        // BiPredicate
        BiPredicate<String,Integer> longerThan = (s, n) -> s.length() > n;
        System.out.println(longerThan.test("hello", 3));   // true
    }
}
\`\`\``,
      mistakes: `- **Writing verbose \`if\` chains** instead of composing predicates with \`and\`/\`or\`/\`negate\`.
- **Boxing in numeric code** — use \`IntPredicate\` etc. instead of \`Predicate<Integer>\`.
- **Side effects inside \`test\`** — predicates should be pure (no mutation), especially in parallel streams (§7.8).
- **Forgetting short-circuiting** order — put the cheaper/more-selective predicate first in \`and\`.
- **Confusing \`Predicate.not(p)\` (static) with \`p.negate()\`** — both negate; the static form reads better with method references.`,
      bestPractices: `- **Compose** with \`and\`/\`or\`/\`negate\` for readable, reusable conditions.
- Keep predicates **pure** (no side effects).
- Use **primitive specializations** in hot/numeric paths.
- Name predicates meaningfully (\`isActive\`, \`isAdult\`) so composed expressions read like English.
- Order \`and\` operands cheapest-and-most-selective first to benefit from short-circuiting.`,
      interview: `**Q1. What is Predicate and its method?**
A functional interface representing a boolean test: \`boolean test(T t)\`.

**Q2. How do you combine predicates?**
With default methods \`and\`, \`or\`, \`negate\` (and static \`isEqual\`/\`not\`).

**Q3. Do and/or short-circuit?**
Yes — like \`&&\`/\`||\`.

**Q4. Predicate vs BiPredicate?**
\`Predicate<T>\` tests one argument; \`BiPredicate<T,U>\` tests two.

**Q5. Why use IntPredicate over Predicate<Integer>?**
To avoid autoboxing overhead.

**Q6. Where is Predicate commonly used?**
\`stream.filter\`, \`removeIf\`, \`anyMatch/allMatch/noneMatch\`, validation.`,
      exercises: `1. Build \`isEven\`, \`isPositive\`, \`isMultipleOf3\` and compose them with \`and\`/\`or\`/\`negate\`.
2. Use \`removeIf\` with a composed predicate on a list.
3. Write a \`BiPredicate<String,String>\` that checks one string contains another.
4. Replace a multi-condition \`if\` in a filter with a single composed predicate.`,
      challenges: `Create a reusable validation framework using \`Predicate<User>\` rules (non-null name, valid email pattern, age ≥ 18). Compose them into one master predicate with \`and\`, collect failing users from a stream, and report which rule failed (hint: keep named predicates and test individually). Discuss why pure predicates are essential for safe parallel filtering (§7.8).`,
      summary: `- **\`Predicate<T>\`** = boolean test (\`test(T)\`) — the basis of filtering (\`filter\`, \`removeIf\`, \`*Match\`).
- Compose with **\`and\`/\`or\`/\`negate\`** (short-circuiting) and static \`isEqual\`/\`not\`; \`BiPredicate\` for two args.
- Use **primitive specializations** (\`IntPredicate\`) to avoid boxing; keep predicates **pure**.
- A core member of \`java.util.function\` (§7.2), used throughout **Streams (§7.8/§7.9)**.`
    }),

    /* 7.5 Function & BiFunction. */
    topic({
      id: "function", chapter: "7.5", title: "Function & BiFunction",
      subtitle: "Transformations: map an input to an output, and compose them.",
      readTime: "14 min", level: "Core", deep: true,
      objectives: [
        "Use Function<T,R> and its apply method for transformations.",
        "Compose functions with andThen and compose.",
        "Use BiFunction<T,U,R> for two-argument transforms.",
        "Choose primitive specializations to avoid boxing."
      ],
      concept: `**\`Function<T,R>\`** is a functional interface representing a **transformation**: it takes an argument of type \`T\` and returns a result of type \`R\`. Its single abstract method is **\`R apply(T t)\`**. It's the "map this to that" interface.

\`\`\`java
import java.util.function.Function;

Function<String,Integer> length = s -> s.length();
System.out.println(length.apply("hello"));   // 5
\`\`\`

It's the engine behind \`stream.map(...)\` (§7.8) and any value-to-value conversion.`,
      why: `A \`Function\` captures a **conversion** as a reusable value: parse a String to an int, extract a field, map a domain object to a DTO. Like predicates, functions **compose**, so you can build a pipeline of transformations declaratively rather than nesting calls.`,
      composition: `**Composition with \`andThen\` and \`compose\`:**

- \`f.andThen(g)\` → apply **f first**, then \`g\` (\`g(f(x))\`).
- \`f.compose(g)\` → apply **g first**, then \`f\` (\`f(g(x))\`).
- \`Function.identity()\` → returns its input unchanged (useful in collectors, §7.10).

\`\`\`java
Function<Integer,Integer> times2 = x -> x * 2;
Function<Integer,Integer> plus1  = x -> x + 1;

System.out.println(times2.andThen(plus1).apply(3));  // (3*2)+1 = 7
System.out.println(times2.compose(plus1).apply(3));  // (3+1)*2 = 8
\`\`\`

Mnemonic: **andThen = forward order; compose = reverse order.**`,
      biFunction: `**\`BiFunction<T,U,R>\`** takes **two** arguments and returns a result: \`R apply(T t, U u)\`. It also supports \`andThen\` (post-process the result with a \`Function\`).

\`\`\`java
import java.util.function.BiFunction;

BiFunction<Integer,Integer,Integer> add = (a, b) -> a + b;
System.out.println(add.apply(3, 4));            // 7
System.out.println(add.andThen(x -> x * 10).apply(3, 4)); // 70

// used by Map.merge / compute (Module 5 §5.13):
map.merge("k", 1, Integer::sum);                 // Integer::sum is a BiFunction
\`\`\``,
      variants: `**Primitive specializations (avoid boxing):**

| Type | Signature | Purpose |
|---|---|---|
| \`Function<T,R>\` | \`R apply(T)\` | object → object |
| \`IntFunction<R>\` | \`R apply(int)\` | int → object |
| \`ToIntFunction<T>\` | \`int applyAsInt(T)\` | object → int |
| \`IntToDoubleFunction\` | \`double applyAsDouble(int)\` | int → double |
| \`ToIntBiFunction<T,U>\` | \`int applyAsInt(T,U)\` | (T,U) → int |

Use these in numeric pipelines (\`mapToInt(String::length)\`, §7.9) to skip autoboxing.`,
      internal: `\`apply\` is a plain call; \`andThen\`/\`compose\` are **default methods** returning a new \`Function\` that chains the two — so \`f.andThen(g)\` builds a composite evaluated left-to-right at call time. \`Function.identity()\` returns \`t -> t\` (often more readable and sometimes optimisable than writing the lambda). Like all functional interfaces, these are erased at runtime (Module 6) and matched to lambdas via \`invokedynamic\` (§7.1).`,
      useCases: `- **Stream mapping**: \`stream.map(Order::total)\` (§7.8).
- **Conversions**: \`Integer::parseInt\`, \`Object::toString\`, entity↔DTO mappers.
- **Map operations**: \`computeIfAbsent(k, Function)\`, \`merge(k, v, BiFunction)\` (Module 5 §5.13).
- **Pipelines**: compose small transforms into one.`,
      code: `\`\`\`java
import java.util.*;
import java.util.function.*;
import java.util.stream.*;

public class FunctionDemo {
    record Order(String id, double amount) {}
    public static void main(String[] args) {
        // map + compose
        Function<Order,Double> amount = Order::amount;
        Function<Double,Double> withTax = a -> a * 1.18;
        Function<Order,Double> total = amount.andThen(withTax);

        List<Order> orders = List.of(new Order("A",100), new Order("B",200));
        double grand = orders.stream().mapToDouble(total::apply).sum();
        System.out.println(grand);   // 354.0

        // BiFunction in Map.merge
        Map<String,Integer> counts = new HashMap<>();
        for (String w : "a b a c b a".split(" ")) counts.merge(w, 1, Integer::sum);
        System.out.println(counts);  // {a=3, b=2, c=1}

        // identity in a collector (§7.10)
        Map<String,Order> byId = orders.stream()
            .collect(Collectors.toMap(Order::id, Function.identity()));
        System.out.println(byId.keySet());
    }
}
\`\`\``,
      mistakes: `- **Confusing \`andThen\` with \`compose\`** — order is reversed.
- **Boxing in numeric transforms** — use \`ToIntFunction\`/\`mapToInt\` instead of \`Function<T,Integer>\`.
- **Side effects in \`apply\`** — functions should be pure transformations (especially parallel streams §7.8).
- **Overly long composed chains** — split for readability.
- **Forgetting \`Function.identity()\`** — cleaner than \`x -> x\` in collectors.`,
      bestPractices: `- **Compose** small functions with \`andThen\`/\`compose\` for readable pipelines.
- Use **method references** (§7.3) for simple transforms (\`Order::amount\`).
- Use **primitive specializations** in numeric code to avoid boxing.
- Keep functions **pure** (deterministic, no side effects).
- Use \`Function.identity()\` and \`BiFunction\` with map operations (Module 5).`,
      interview: `**Q1. What is Function<T,R>?**
A functional interface for a transformation T→R via \`R apply(T)\`.

**Q2. Difference between andThen and compose?**
\`f.andThen(g)\` runs f then g (g(f(x))); \`f.compose(g)\` runs g then f (f(g(x))).

**Q3. What is BiFunction?**
A function of two arguments: \`R apply(T,U)\` — used by \`Map.merge\`/\`compute\`.

**Q4. Why primitive specializations like ToIntFunction?**
To avoid autoboxing in numeric operations.

**Q5. What does Function.identity() return?**
A function \`t -> t\` returning its input unchanged.

**Q6. Where is Function used in streams?**
In \`map\`/\`flatMap\` and collectors (\`toMap\`, \`groupingBy\` classifier).`,
      exercises: `1. Compose \`times2\` and \`plus1\` with \`andThen\` and \`compose\`; verify both results.
2. Map a list of orders to taxed totals using a composed Function.
3. Use \`BiFunction\` with \`Map.merge\` to build a frequency map.
4. Replace \`x -> x\` with \`Function.identity()\` in a \`toMap\` collector.`,
      challenges: `Build a configurable transformation pipeline: given a \`List<Function<String,String>>\` of text transforms (trim, lowercase, slugify), reduce them into a single \`Function\` with \`andThen\` (or \`Function.identity()\` as the seed) and apply to inputs. Then add a \`BiFunction\` that merges two transformed results. Discuss composition order and why purity matters for reuse.`,
      summary: `- **\`Function<T,R>\`** = transformation \`R apply(T)\`; the engine of \`stream.map\` (§7.8).
- Compose with **\`andThen\`** (forward) and **\`compose\`** (reverse); \`Function.identity()\` returns input.
- **\`BiFunction<T,U,R>\`** handles two args (used by \`Map.merge\`/\`compute\`, Module 5).
- Use **primitive specializations** (\`ToIntFunction\`) to avoid boxing; keep functions **pure**. Consumer/Supplier are **§7.6**.`
    }),

    /* 7.6 Consumer & Supplier. */
    topic({
      id: "consumer-supplier", chapter: "7.6", title: "Consumer & Supplier",
      subtitle: "Side-effects in, values out — the two one-sided functional interfaces.",
      readTime: "12 min", level: "Core", deep: true,
      objectives: [
        "Use Consumer<T> for side-effecting operations.",
        "Use Supplier<T> to produce/lazily-create values.",
        "Chain consumers with andThen; apply supplier laziness.",
        "Know the BiConsumer and primitive variants."
      ],
      concept: `Two functional interfaces sit at opposite ends of the data flow:

- **\`Consumer<T>\`** — **takes a value, returns nothing** (a side-effect): \`void accept(T t)\`.
- **\`Supplier<T>\`** — **takes nothing, returns a value** (a producer): \`T get()\`.

\`\`\`java
import java.util.function.*;

Consumer<String> printer = s -> System.out.println(s);   // consumes, no result
Supplier<Double> random = () -> Math.random();           // supplies, no input

printer.accept("hi");                 // prints hi
double r = random.get();              // produces a value
\`\`\`

\`Consumer\` is "do something with this"; \`Supplier\` is "give me one of these."`,
      why: `These model the **endpoints** of pipelines:

- **\`Consumer\`** — terminal side-effects: \`forEach(System.out::println)\` (§7.9), logging, saving, notifying.
- **\`Supplier\`** — **lazy** value creation: deferred/expensive computation only run when needed (\`Optional.orElseGet\`, \`computeIfAbsent\` factories, \`Logger\` message suppliers, \`Stream.generate\`).

Supplier laziness is a key performance idiom: pass *how to make* a value, not the value itself, so it's created only on demand.`,
      consumerDetail: `**\`Consumer<T>\`** chains with **\`andThen\`** (run several consumers in order on the same input):

\`\`\`java
Consumer<String> log = s -> System.out.println("LOG: " + s);
Consumer<String> save = s -> store.add(s);
Consumer<String> both = log.andThen(save);   // log THEN save
both.accept("event");
\`\`\`

**\`BiConsumer<T,U>\`** takes two arguments (\`void accept(T,U)\`) — used by \`Map.forEach((k,v) -> ...)\` (Module 5). Primitive variants: \`IntConsumer\`, \`LongConsumer\`, \`DoubleConsumer\`.`,
      supplierDetail: `**\`Supplier<T>\`** is about **deferred execution** — the value is computed only when \`get()\` is called:

\`\`\`java
// eager: expensive() runs NOW even if unused
String v1 = optional.orElse(expensive());
// lazy: expensive() runs ONLY if the Optional is empty
String v2 = optional.orElseGet(() -> expensive());

// lazy logging — message built only if debug enabled
logger.debug(() -> "state=" + buildExpensiveDump());
\`\`\`

Primitive variants: \`IntSupplier\`, \`LongSupplier\`, \`DoubleSupplier\`, \`BooleanSupplier\`. \`Supplier\` also powers \`Stream.generate(Supplier)\` for infinite streams (§7.8).`,
      comparison: `**The one-sided interfaces at a glance:**

| Interface | Method | Input | Output | Typical use |
|---|---|---|---|---|
| \`Consumer<T>\` | \`accept(T)\` | T | none | forEach, side-effects |
| \`BiConsumer<T,U>\` | \`accept(T,U)\` | T,U | none | \`Map.forEach\` |
| \`Supplier<T>\` | \`get()\` | none | T | lazy creation, factories |

Contrast with \`Function\` (in→out, §7.5) and \`Predicate\` (in→boolean, §7.4).`,
      internal: `\`Consumer.andThen\` returns a new \`Consumer\` that calls both in sequence on the same argument (the first's side-effects happen before the second's). \`Supplier\` has no composition method — it's a pure source. The power of \`Supplier\` is **laziness**: APIs accept a \`Supplier\` to *defer* work (\`orElseGet\`, \`requireNonNullElseGet\`, \`computeIfAbsent\`), avoiding cost when the value isn't needed. Both are erased like all generics (Module 6) and target lambdas/method references via \`invokedynamic\` (§7.1).`,
      useCases: `- **\`Consumer\`**: \`stream.forEach\`, \`list.forEach\`, event listeners, persistence side-effects.
- **\`Supplier\`**: \`Optional.orElseGet\`, \`Objects.requireNonNullElseGet\`, \`map.computeIfAbsent(k, factory)\` (Module 5), \`Stream.generate\`, lazy/deferred logging, dependency factories (Module 6 §6.2 — workaround for \`new T()\`).
- **\`BiConsumer\`**: iterating maps (\`forEach((k,v) -> ...)\`).`,
      code: `\`\`\`java
import java.util.*;
import java.util.function.*;

public class ConsumerSupplierDemo {
    public static void main(String[] args) {
        // Consumer chaining
        List<String> store = new ArrayList<>();
        Consumer<String> log  = s -> System.out.println("LOG: " + s);
        Consumer<String> save = store::add;
        Consumer<String> pipe = log.andThen(save);
        List.of("a", "b").forEach(pipe);
        System.out.println(store);                 // [a, b]

        // Supplier laziness
        Supplier<String> expensive = () -> { System.out.println("computing..."); return "value"; };
        Optional<String> present = Optional.of("ready");
        System.out.println(present.orElseGet(expensive)); // 'ready' — expensive NOT called

        // BiConsumer over a map
        Map<String,Integer> ages = Map.of("Asha", 30, "Ravi", 25);
        ages.forEach((k, v) -> System.out.println(k + "=" + v));
    }
}
\`\`\``,
      mistakes: `- **Using \`orElse(expensive())\` instead of \`orElseGet(supplier)\`** — \`orElse\` evaluates the argument eagerly, defeating laziness.
- **Side-effects in a \`Supplier\`** that's expected to be pure/lazy — surprising behaviour.
- **Boxing** — use \`IntConsumer\`/\`IntSupplier\` in numeric code.
- **Mutating shared state from a \`Consumer\`** in parallel streams (§7.8) — race conditions.
- **Confusing the four shapes** — Consumer (in,no out), Supplier (no in,out), Function (in,out), Predicate (in,boolean).`,
      bestPractices: `- Use **\`Supplier\` for laziness/deferral** (\`orElseGet\`, \`computeIfAbsent\`, deferred logging).
- Chain side-effects with **\`Consumer.andThen\`** for readable pipelines.
- Prefer **method references** (\`System.out::println\`, \`list::add\`) where they read well (§7.3).
- Use **primitive variants** in numeric/hot code.
- Keep consumers' side-effects **thread-safe** when used in parallel streams.`,
      interview: `**Q1. Consumer vs Supplier?**
\`Consumer<T>\` takes a value and returns nothing (\`accept\`); \`Supplier<T>\` takes nothing and returns a value (\`get\`).

**Q2. Why use \`orElseGet\` over \`orElse\`?**
\`orElseGet(Supplier)\` is lazy — the fallback is computed only when needed; \`orElse(value)\` evaluates eagerly.

**Q3. How do you chain consumers?**
\`c1.andThen(c2)\` runs both on the same input in order.

**Q4. What is BiConsumer used for?**
Two-argument side-effects, e.g., \`Map.forEach((k,v) -> ...)\`.

**Q5. Give a lazy-Supplier use case.**
Deferred logging, \`computeIfAbsent\` factories, \`Stream.generate\`, expensive defaults.

**Q6. Does Supplier have composition methods?**
No — it's a pure source; \`Consumer\` has \`andThen\`.`,
      exercises: `1. Chain two \`Consumer<String>\`s with \`andThen\` and apply via \`forEach\`.
2. Show \`orElse\` vs \`orElseGet\` laziness by printing inside the supplier.
3. Use a \`Supplier<List<String>>\` as a factory in \`computeIfAbsent\`.
4. Iterate a map with \`BiConsumer\` via \`forEach\`.`,
      challenges: `Implement a lazy memoizing cache: \`<T> Supplier<T> memoize(Supplier<T> source)\` that computes the value once on first \`get()\` and returns it thereafter (thread-safety optional — preview Module 8). Then build a logging pipeline of \`Consumer\`s (validate → transform → persist) chained with \`andThen\`. Explain where laziness (Supplier) and side-effects (Consumer) each belong and why \`orElseGet\` matters for performance.`,
      summary: `- **\`Consumer<T>\`** (\`accept\`, in→nothing) = side-effects (\`forEach\`, logging); chain with **\`andThen\`**; \`BiConsumer\` for two args (\`Map.forEach\`).
- **\`Supplier<T>\`** (\`get\`, nothing→out) = **lazy** value production (\`orElseGet\`, \`computeIfAbsent\`, \`Stream.generate\`, factories).
- Prefer **\`orElseGet\` over \`orElse\`** for deferral; use **primitive variants** to avoid boxing; keep consumers thread-safe in parallel streams.
- Together with Predicate (§7.4) and Function (§7.5) they cover the core \`java.util.function\` shapes.`
    }),

    /* 7.7 UnaryOperator & BinaryOperator. */
    topic({
      id: "operators", chapter: "7.7", title: "UnaryOperator & BinaryOperator",
      subtitle: "Functions whose inputs and output share one type.",
      readTime: "11 min", level: "Core", deep: true,
      objectives: [
        "Use UnaryOperator<T> (T→T) and BinaryOperator<T> (T,T→T).",
        "See how they specialise Function and BiFunction (§7.5).",
        "Apply them in replaceAll, reduce, and Map.merge.",
        "Use BinaryOperator.minBy / maxBy."
      ],
      concept: `\`UnaryOperator\` and \`BinaryOperator\` are **special cases** of \`Function\` and \`BiFunction\` (§7.5) where the input and output types are the **same**:

- **\`UnaryOperator<T> extends Function<T,T>\`** — \`T apply(T)\` (one in, same-type out).
- **\`BinaryOperator<T> extends BiFunction<T,T,T>\`** — \`T apply(T,T)\` (two same-type in, same-type out).

\`\`\`java
import java.util.function.*;

UnaryOperator<String> upper = s -> s.toUpperCase();   // String -> String
BinaryOperator<Integer> add = (a, b) -> a + b;        // (Integer,Integer) -> Integer
\`\`\`

They exist mainly for **readability and API fit** — methods like \`List.replaceAll\` and \`Stream.reduce\` are declared in terms of these operators.`,
      why: `When a transformation stays within one type, naming it an *operator* documents that intent and matches the JDK APIs that require it:

- \`List.replaceAll(UnaryOperator<E>)\` — transform each element in place.
- \`Stream.reduce(BinaryOperator<T>)\` — combine elements pairwise (§7.9).
- \`Map.merge\`/\`compute\` accept a \`BiFunction\` (a \`BinaryOperator\` fits when types match).

They're the same behaviour as \`Function\`/\`BiFunction\`, just type-constrained.`,
      usage: `**Where each shines:**

\`\`\`java
import java.util.*;
import java.util.function.*;

// UnaryOperator with List.replaceAll (in-place transform)
List<String> names = new ArrayList<>(List.of("asha", "ravi"));
names.replaceAll(String::toUpperCase);     // UnaryOperator -> [ASHA, RAVI]

// BinaryOperator with reduce (combine)
int sum = List.of(1,2,3,4).stream().reduce(0, Integer::sum);   // Integer::sum is a BinaryOperator
int max = List.of(3,7,2).stream().reduce(Integer::max).orElse(0);

// BinaryOperator.minBy / maxBy with a Comparator (Module 5 §5.4)
BinaryOperator<String> longer = BinaryOperator.maxBy(Comparator.comparingInt(String::length));
System.out.println(longer.apply("a", "bbb"));   // bbb
\`\`\``,
      inheritance: `Because \`UnaryOperator<T>\` **extends** \`Function<T,T>\`, it inherits \`andThen\`/\`compose\` (§7.5) and \`identity()\`. Likewise \`BinaryOperator<T>\` extends \`BiFunction<T,T,T>\` and adds static **\`minBy(Comparator)\`** / **\`maxBy(Comparator)\`** factories. So anywhere a \`Function<T,T>\` is expected you can pass a \`UnaryOperator<T>\`, and vice-versa where the types line up.

Primitive specializations exist too: \`IntUnaryOperator\`, \`LongUnaryOperator\`, \`DoubleUnaryOperator\`, \`IntBinaryOperator\`, etc. — to avoid boxing in numeric reductions.`,
      internal: `These are thin sub-interfaces; the compiler treats a \`UnaryOperator<String>\` as a \`Function<String,String>\` for composition while preferring the operator type where the API asks for it. \`reduce\` uses a \`BinaryOperator\` as the **accumulator** and requires it to be **associative** (and stateless) for correct results — especially in **parallel** streams (§7.8/§7.9), where the order of combination isn't guaranteed. \`minBy\`/\`maxBy\` simply wrap a \`Comparator\` into a \`BinaryOperator\` that returns the smaller/larger argument.`,
      useCases: `- **In-place element transforms**: \`list.replaceAll(UnaryOperator)\`.
- **Reductions/aggregations**: \`stream.reduce(BinaryOperator)\` for sum/max/concat (§7.9).
- **Map merging**: \`map.merge(k, v, BinaryOperator)\` (Module 5 §5.13).
- **Numeric pipelines** with primitive operator specializations.`,
      code: `\`\`\`java
import java.util.*;
import java.util.function.*;
import java.util.stream.*;

public class OperatorDemo {
    public static void main(String[] args) {
        // UnaryOperator: transform in place
        List<Integer> nums = new ArrayList<>(List.of(1,2,3,4));
        nums.replaceAll(n -> n * n);            // UnaryOperator
        System.out.println(nums);               // [1, 4, 9, 16]

        // BinaryOperator: reduce
        int total = nums.stream().reduce(0, Integer::sum);   // BinaryOperator
        System.out.println(total);              // 30

        // maxBy / minBy
        List<String> words = List.of("a", "bbbb", "cc");
        String longest = words.stream()
            .reduce(BinaryOperator.maxBy(Comparator.comparingInt(String::length)))
            .orElse("");
        System.out.println(longest);            // bbbb
    }
}
\`\`\``,
      mistakes: `- **Using \`Function<T,T>\`/\`BiFunction<T,T,T>\` where the API wants an operator** — minor, but the operator type reads better and fits \`replaceAll\`/\`reduce\`.
- **Non-associative reducers in parallel streams** — wrong results (§7.9).
- **Boxing** in numeric reductions — use \`IntBinaryOperator\`/\`mapToInt(...).reduce\`.
- **Stateful operators** (mutating external state) in streams — break parallelism.
- **Forgetting \`minBy\`/\`maxBy\`** and hand-writing comparison logic.`,
      bestPractices: `- Use \`UnaryOperator\`/\`BinaryOperator\` when **input and output share a type** and the API expects them.
- Ensure reduction operators are **associative and stateless** (safe for parallel, §7.8).
- Use **\`BinaryOperator.minBy/maxBy\`** with comparators instead of manual min/max.
- Use **primitive operator specializations** for numeric work.
- They inherit \`Function\`'s composition — reuse \`andThen\`/\`identity\` where helpful.`,
      interview: `**Q1. What is UnaryOperator and how does it relate to Function?**
\`UnaryOperator<T>\` is a \`Function<T,T>\` (input and output same type), \`T apply(T)\`.

**Q2. What is BinaryOperator?**
A \`BiFunction<T,T,T>\` — combines two same-type values into one; used by \`reduce\`/\`merge\`.

**Q3. Where is UnaryOperator used in the JDK?**
\`List.replaceAll(UnaryOperator)\`.

**Q4. What do BinaryOperator.minBy/maxBy do?**
Return a BinaryOperator that picks the smaller/larger of two values per a \`Comparator\`.

**Q5. Why must a reduce operator be associative?**
So parallel combination in any grouping yields the same result (§7.9).

**Q6. Why primitive operator specializations?**
To avoid autoboxing in numeric reductions.`,
      exercises: `1. Use \`replaceAll\` with a \`UnaryOperator\` to uppercase a list of strings.
2. Sum and find the max of a list with \`reduce\` and a \`BinaryOperator\`.
3. Use \`BinaryOperator.maxBy\` with a comparator to find the longest string.
4. Show that \`UnaryOperator<T>\` is accepted where a \`Function<T,T>\` is expected.`,
      challenges: `Implement a generic pipeline runner that applies a \`List<UnaryOperator<T>>\` to a value in sequence (compose them via \`andThen\`/\`identity\`), and a \`reduce\`-based aggregator that takes a \`BinaryOperator<T>\` plus identity. Test with strings (transforms + concatenation) and integers (math). Then run the reduction in parallel and explain why the operator must be associative and stateless (§7.8/§7.9).`,
      summary: `- **\`UnaryOperator<T>\`** (extends \`Function<T,T>\`) = same-type transform; powers \`List.replaceAll\`.
- **\`BinaryOperator<T>\`** (extends \`BiFunction<T,T,T>\`) = combine two same-type values; powers \`reduce\`/\`merge\`, with \`minBy\`/\`maxBy\` factories.
- Reduction operators must be **associative & stateless** (parallel safety, §7.8/§7.9); use **primitive specializations** to avoid boxing.
- They specialise the Function family (§7.5); next: the **Streams API (§7.8)** that ties all these interfaces together.`
    }),

    /* ===================== CORE/ADVANCED: STREAMS ===================== */

    /* 7.8 Streams API. */
    topic({
      id: "streams-api", chapter: "7.8", title: "Streams API",
      subtitle: "Declarative data processing pipelines over collections.",
      readTime: "17 min", level: "Advanced", deep: true,
      objectives: [
        "Explain what a Stream is and how it differs from a Collection.",
        "Create streams and understand the pipeline (source → intermediate → terminal).",
        "Distinguish lazy intermediate ops from eager terminal ops.",
        "Use streams correctly (single-use, no side effects, parallel basics)."
      ],
      concept: `A **\`Stream\`** is a **sequence of elements supporting functional-style, declarative operations** — a pipeline that processes data without you writing loops. Introduced in Java 8, it lets you express *what* you want (filter, map, collect) rather than *how* to iterate.

\`\`\`java
import java.util.*;
import java.util.stream.*;

List<String> names = List.of("Shail", "Asha", "Ravi", "Amit");
List<String> result = names.stream()           // source
    .filter(n -> n.startsWith("A"))            // intermediate
    .map(String::toUpperCase)                  // intermediate
    .sorted()                                  // intermediate
    .collect(Collectors.toList());             // terminal
System.out.println(result);                    // [AMIT, ASHA]
\`\`\`

A stream is **not a data structure** — it doesn't store elements; it carries them from a source through operations to a result.`,
      why: `Streams make data processing **concise, readable, and parallelisable**:

- **Declarative** — express intent, not loop mechanics.
- **Composable** — chain operations into a pipeline.
- **Lazy** — intermediate ops do no work until a terminal op runs, enabling optimisation (fusion, short-circuiting).
- **Parallel-ready** — \`parallelStream()\` can use multiple cores with the same code.

They build directly on lambdas (§7.1) and the functional interfaces (§7.4–§7.7).`,
      streamVsCollection: `**Stream vs Collection — a core interview distinction:**

| | Collection (Module 5) | Stream |
|---|---|---|
| Purpose | **store** elements | **process** elements |
| Storage | holds data in memory | holds no data (a view/pipeline) |
| Iteration | external (you loop) | internal (the stream loops) |
| Reusable | yes | **no** — single-use |
| Lazy? | no | intermediate ops are lazy |
| Mutation | add/remove | produces new results (functional) |

A stream is **consumed once**: after a terminal operation, reusing it throws \`IllegalStateException\`.`,
      creation: `**Ways to create a stream:**

\`\`\`java
list.stream();                         // from a Collection
Arrays.stream(array);                  // from an array
Stream.of("a", "b", "c");              // from values
Stream.iterate(1, n -> n * 2).limit(5);// 1,2,4,8,16 (infinite + limit)
Stream.generate(Math::random).limit(3);// infinite supplier (§7.6)
IntStream.range(0, 5);                 // 0..4 (primitive stream, no boxing)
IntStream.rangeClosed(1, 5);           // 1..5
"a,b,c".chars();  // / Files.lines(path) / Pattern.splitAsStream(...)
\`\`\`

**Primitive streams** (\`IntStream\`, \`LongStream\`, \`DoubleStream\`) avoid boxing and add numeric ops (\`sum\`, \`average\`, \`summaryStatistics\`).`,
      pipeline: `**A stream pipeline has three stages:**

1. **Source** — where elements come from (collection, array, generator).
2. **Intermediate operations** — transform/filter; **lazy** and return a new stream (\`filter\`, \`map\`, \`sorted\`, \`distinct\`, \`limit\`, \`peek\`). You can chain many.
3. **Terminal operation** — triggers execution and produces a result or side-effect; **eager** (\`collect\`, \`forEach\`, \`reduce\`, \`count\`, \`findFirst\`, \`anyMatch\`). Exactly one ends the pipeline.

\`\`\`
source --> [filter] --> [map] --> [sorted] --> collect (terminal)
            \\______ intermediate (lazy) ______/
\`\`\`

Nothing happens until the terminal op runs — that's **laziness** (§7.9 details operations).`,
      internal: `**Laziness & fusion:** intermediate operations don't process elements when called; they record what to do. The terminal op pulls elements through the whole chain **one at a time** (where possible), so \`filter\` + \`map\` are *fused* into a single pass — no intermediate collections. This also enables **short-circuiting**: \`findFirst\`/\`limit\`/\`anyMatch\` stop early.

**Parallel streams:** \`collection.parallelStream()\` or \`stream.parallel()\` splits the source (via a \`Spliterator\`) across the **common ForkJoinPool** (Module 8). Use only when operations are **stateless, associative, non-interfering** and the dataset is large — otherwise overhead and bugs (shared mutable state) outweigh gains. A stream is **single-use**: reusing after a terminal op throws \`IllegalStateException\`.`,
      useCases: `- **Transform/filter/aggregate** collections declaratively.
- **Grouping/partitioning/summarising** with collectors (§7.10).
- **Reading & processing files line-by-line** (\`Files.lines\`, Module 9).
- **Numeric computations** with primitive streams (\`IntStream\`).
- **Data-pipeline style** code replacing nested loops.`,
      code: `\`\`\`java
import java.util.*;
import java.util.stream.*;

public class StreamApiDemo {
    record Person(String name, int age, String city) {}
    public static void main(String[] args) {
        List<Person> people = List.of(
            new Person("Asha",30,"Pune"), new Person("Ravi",25,"Pune"),
            new Person("Amit",35,"Delhi"), new Person("Shail",28,"Delhi"));

        // declarative pipeline
        List<String> adultsInDelhi = people.stream()
            .filter(p -> p.city().equals("Delhi"))
            .filter(p -> p.age() >= 30)
            .map(Person::name)
            .sorted()
            .collect(Collectors.toList());
        System.out.println(adultsInDelhi);   // [Amit]

        // primitive stream — no boxing, numeric ops
        double avgAge = people.stream().mapToInt(Person::age).average().orElse(0);
        System.out.println(avgAge);          // 29.5

        // lazy + short-circuit
        Optional<Person> first = people.stream().filter(p -> p.age() > 26).findFirst();
        System.out.println(first.map(Person::name).orElse("none"));
    }
}
\`\`\``,
      mistakes: `- **Reusing a stream** after a terminal op — throws \`IllegalStateException\` (streams are single-use).
- **Side effects in pipelines** (mutating external state in \`map\`/\`filter\`) — breaks laziness reasoning and parallel safety.
- **Using \`parallelStream\` blindly** — overhead or wrong results for small/stateful/ordered work.
- **Boxing** — use \`IntStream\`/\`mapToInt\` for numbers.
- **Expecting intermediate ops to run on their own** — nothing happens without a terminal op.
- **\`forEach\` to build a list** — use \`collect\` (functional, parallel-safe) instead.`,
      bestPractices: `- Build a clear pipeline: **source → intermediates → one terminal**; prefer \`collect\` over manual accumulation.
- Keep lambdas **pure** (no side effects) and **stateless** for correctness and parallel safety.
- Use **primitive streams** for numeric work; use **method references** (§7.3) for clarity.
- Reach for \`parallelStream\` only for **large**, CPU-bound, stateless pipelines — measure first.
- Remember streams are **single-use**; create a fresh one per terminal operation.`,
      interview: `**Q1. What is a Stream and how does it differ from a Collection?**
A Stream is a pipeline for processing elements (no storage, single-use, lazy, internal iteration); a Collection stores elements (reusable, external iteration).

**Q2. What are the three parts of a stream pipeline?**
Source, intermediate operations (lazy), and a terminal operation (eager).

**Q3. What does 'lazy' mean for streams?**
Intermediate ops do nothing until a terminal op runs; elements flow through in a single fused pass, enabling short-circuiting.

**Q4. Can you reuse a stream?**
No — after a terminal op it's consumed; reuse throws \`IllegalStateException\`.

**Q5. When should you use parallel streams?**
Large, CPU-bound, stateless/associative pipelines; avoid for small data, ordered/stateful logic, or shared mutable state.

**Q6. Why prefer primitive streams?**
They avoid autoboxing and provide numeric ops (sum/average/statistics).`,
      exercises: `1. Build a pipeline: filter, map, sorted, collect to a list.
2. Create streams five different ways (collection, of, iterate, generate, IntStream.range).
3. Show that reusing a stream throws \`IllegalStateException\`.
4. Compute sum/average of ages with a primitive stream and compare to a boxed version.`,
      challenges: `Process a list of transactions (amount, type, timestamp): filter by type, map to amounts, and compute count/sum/average/max in a single \`IntStream.summaryStatistics()\`. Then add a lazy short-circuit query (first transaction over a threshold) and demonstrate that intermediate ops don't execute without a terminal op (use \`peek\` to prove it). Discuss when converting to \`parallelStream\` would help or hurt.`,
      summary: `- A **\`Stream\`** is a single-use, lazy, internally-iterated **processing pipeline** — not storage (contrast with Collections, Module 5).
- Pipeline = **source → lazy intermediates → one eager terminal**; laziness enables fusion and short-circuiting.
- Create via \`stream()\`, \`Stream.of/iterate/generate\`, \`IntStream.range\`; use **primitive streams** to avoid boxing.
- Keep operations **pure/stateless**; \`parallelStream\` only for large CPU-bound work. Operations detailed in **§7.9**, collecting in **§7.10**.`
    }),

    /* 7.9 Stream Operations. */
    topic({
      id: "stream-operations", chapter: "7.9", title: "Stream Operations",
      subtitle: "The intermediate and terminal operations you use every day.",
      readTime: "18 min", level: "Advanced", deep: true,
      objectives: [
        "Use the key intermediate ops: filter, map, flatMap, distinct, sorted, limit, skip, peek.",
        "Use the key terminal ops: forEach, collect, reduce, count, min/max, find/match.",
        "Understand flatMap and reduce deeply.",
        "Know which ops short-circuit and which are stateful."
      ],
      concept: `Building on the pipeline model (§7.8), this chapter catalogues the **operations** themselves. **Intermediate** operations return a new stream (lazy, chainable); **terminal** operations produce a result and trigger execution (eager). Mastering these is the practical heart of the Streams API.

\`\`\`java
List<Integer> result = Stream.of(5, 3, 8, 3, 1)
    .distinct()          // intermediate
    .filter(n -> n > 2)  // intermediate
    .sorted()            // intermediate
    .collect(Collectors.toList());  // terminal
// [3, 5, 8]
\`\`\``,
      intermediate: `**Key intermediate operations:**

| Operation | Effect | Stateful? |
|---|---|---|
| \`filter(Predicate)\` | keep matching elements | no |
| \`map(Function)\` | transform each element | no |
| \`flatMap(Function)\` | flatten nested streams (below) | no |
| \`distinct()\` | remove duplicates (uses \`equals\`, Module 5 §5.3) | **yes** |
| \`sorted()\` / \`sorted(Comparator)\` | order elements (§5.4) | **yes** |
| \`limit(n)\` | first n elements (short-circuits) | yes |
| \`skip(n)\` | drop first n | yes |
| \`peek(Consumer)\` | inspect elements (debugging) | no |
| \`mapToInt/Long/Double\` | to a primitive stream | no |

**Stateful** ops (\`distinct\`, \`sorted\`) may need to see many/all elements (and buffer them), which matters for infinite/parallel streams.`,
      flatMap: `**\`flatMap\` flattens** a stream of collections/streams into a single stream — each element is mapped to a *stream*, and all are concatenated:

\`\`\`java
List<List<Integer>> nested = List.of(List.of(1,2), List.of(3,4), List.of(5));
List<Integer> flat = nested.stream()
    .flatMap(List::stream)          // Stream<List<Integer>> -> Stream<Integer>
    .collect(Collectors.toList());  // [1, 2, 3, 4, 5]

// split sentences into words
List<String> words = Stream.of("hello world", "foo bar")
    .flatMap(line -> Arrays.stream(line.split(" ")))
    .collect(Collectors.toList());  // [hello, world, foo, bar]
\`\`\`

Use \`map\` for one-to-one, **\`flatMap\` for one-to-many** (then flatten).`,
      terminal: `**Key terminal operations:**

| Operation | Result |
|---|---|
| \`forEach(Consumer)\` | side-effect per element (no result) |
| \`collect(Collector)\` | accumulate into a list/set/map/string (§7.10) |
| \`toList()\` (Java 16) | immutable list (shorthand) |
| \`reduce(...)\` | combine into one value (below) |
| \`count()\` | number of elements |
| \`min/max(Comparator)\` | extreme element (\`Optional\`) |
| \`anyMatch/allMatch/noneMatch(Predicate)\` | boolean (short-circuit) |
| \`findFirst()/findAny()\` | an element (\`Optional\`, short-circuit) |

**Short-circuiting** terminals (\`anyMatch\`, \`findFirst\`, with \`limit\`) can stop before consuming the whole source.`,
      reduce: `**\`reduce\` combines** all elements into a single value using an associative operator (a \`BinaryOperator\`, §7.7):

\`\`\`java
// identity + accumulator
int sum = Stream.of(1,2,3,4).reduce(0, Integer::sum);          // 10
// no identity -> Optional
Optional<Integer> max = Stream.of(3,7,2).reduce(Integer::max); // 7
// reduce to a String
String joined = Stream.of("a","b","c").reduce("", (a,b) -> a + b); // "abc"
\`\`\`

For most aggregations, a **\`Collector\`** (§7.10, e.g., \`summingInt\`, \`joining\`) is clearer than a raw \`reduce\`. The reducer must be **associative & stateless** for correct parallel results (§7.8).`,
      internal: `Because the pipeline is **lazy** (§7.8), elements are pulled one at a time through the chain; **short-circuiting** ops (\`limit\`, \`findFirst\`, \`anyMatch\`) stop the upstream as soon as the result is known — which is what makes infinite streams (\`Stream.iterate\`) usable with \`limit\`. **Stateful** ops (\`sorted\`, \`distinct\`) must buffer, so they don't short-circuit and can be costly on large/parallel streams. \`peek\` is for **debugging** only — relying on its side effects is discouraged (some pipelines may skip it when the result doesn't require it).`,
      useCases: `- **Filter+map+collect** transformations (the 80% case).
- **\`flatMap\`** for nested data (lists of lists, splitting lines into words, optional flattening).
- **\`reduce\`/\`count\`/\`min\`/\`max\`** for aggregation.
- **\`anyMatch\`/\`findFirst\`** for existence/lookup with early exit.`,
      code: `\`\`\`java
import java.util.*;
import java.util.stream.*;

public class StreamOpsDemo {
    public static void main(String[] args) {
        List<String> data = List.of("apple", "banana", "avocado", "cherry", "apricot");

        // filter -> map -> sorted -> limit -> collect
        List<String> out = data.stream()
            .filter(s -> s.startsWith("a"))
            .map(String::toUpperCase)
            .sorted()
            .limit(2)
            .collect(Collectors.toList());
        System.out.println(out);   // [APPLE, APRICOT]

        // flatMap: unique letters across all words
        List<Character> letters = data.stream()
            .flatMap(w -> w.chars().mapToObj(c -> (char) c))
            .distinct().sorted()
            .collect(Collectors.toList());
        System.out.println(letters.size());

        // reduce + match
        int totalLen = data.stream().mapToInt(String::length).sum();
        boolean anyLong = data.stream().anyMatch(s -> s.length() > 6);
        System.out.println(totalLen + " " + anyLong);
    }
}
\`\`\``,
      mistakes: `- **Confusing \`map\` and \`flatMap\`** — \`map\` is one-to-one; \`flatMap\` flattens one-to-many.
- **Using \`reduce\` for everything** — prefer collectors (\`summingInt\`, \`joining\`, \`groupingBy\`, §7.10) for clarity.
- **Relying on \`peek\` side effects** — it's for debugging; not guaranteed to run for every element in all pipelines.
- **Stateful/non-associative reducers in parallel** — wrong results (§7.8).
- **\`findFirst\` vs \`findAny\`** confusion — \`findAny\` may return any element (better for parallel) and isn't deterministic.
- **Overusing \`sorted\`/\`distinct\`** on huge streams — they buffer and don't short-circuit.`,
      bestPractices: `- Prefer **\`collect\`** (and collectors §7.10) over manual \`reduce\`/\`forEach\` for building results.
- Use **\`flatMap\`** for nested structures; **\`mapToInt\`** etc. for numeric aggregation.
- Place **\`filter\` before \`map\`** to reduce work; use **short-circuiting** ops (\`limit\`, \`findFirst\`) where possible.
- Keep operations **stateless and pure**; reserve \`peek\` for debugging.
- Choose \`findAny\` for parallel, \`findFirst\` when order matters.`,
      interview: `**Q1. Intermediate vs terminal operations?**
Intermediate ops are lazy and return a stream (filter/map/sorted); terminal ops are eager and produce a result/side-effect (collect/reduce/forEach), triggering execution.

**Q2. Difference between map and flatMap?**
\`map\` transforms each element 1:1; \`flatMap\` maps each element to a stream and flattens them into one stream (1:many).

**Q3. What does reduce do and what must the operator be?**
Combines elements into one value; the operator must be associative (and stateless) for correct parallel results.

**Q4. Which operations short-circuit?**
\`limit\`, \`findFirst\`/\`findAny\`, \`anyMatch\`/\`allMatch\`/\`noneMatch\`.

**Q5. findFirst vs findAny?**
\`findFirst\` returns the first encountered element (order-respecting); \`findAny\` may return any (faster for parallel).

**Q6. Which ops are stateful?**
\`distinct\` and \`sorted\` — they may buffer elements and don't short-circuit.`,
      exercises: `1. Use \`flatMap\` to flatten a \`List<List<Integer>>\` and to split sentences into words.
2. Compute sum, max, and count three ways (reduce, IntStream, collector).
3. Demonstrate short-circuiting with \`Stream.iterate(...).limit(n)\` and \`findFirst\`.
4. Show \`map\` vs \`flatMap\` on a stream of strings → characters.`,
      challenges: `Given a list of orders each with a list of line-items, use \`flatMap\` to stream all line-items, filter by category, and compute total revenue with \`mapToDouble().sum()\` and separately with \`reduce\`. Add an \`anyMatch\` early-exit check for a fraud condition. Explain which operations are stateful/short-circuiting and why your reducer is safe for parallel execution (§7.8).`,
      summary: `- **Intermediate** ops (lazy): \`filter\`, \`map\`, **\`flatMap\`** (one-to-many flatten), \`distinct\`/\`sorted\` (stateful), \`limit\`/\`skip\` (short-circuit), \`peek\` (debug).
- **Terminal** ops (eager): \`collect\` (§7.10), \`reduce\` (associative operator), \`count\`/\`min\`/\`max\`, \`*Match\`/\`find*\` (short-circuit).
- Prefer **collectors over raw reduce**; put \`filter\` before \`map\`; keep ops **pure/stateless** for parallel safety (§7.8).
- Next: **Collectors (§7.10)** for grouping/joining/summarising.`
    }),

    /* 7.10 Collectors. */
    topic({
      id: "collectors", chapter: "7.10", title: "Collectors",
      subtitle: "Accumulating stream results — to lists, maps, groups, and summaries.",
      readTime: "16 min", level: "Advanced", deep: true,
      objectives: [
        "Use Collectors to gather streams into collections, strings, and numbers.",
        "Group and partition data with groupingBy / partitioningBy.",
        "Build maps with toMap and handle key collisions.",
        "Compose downstream collectors for multi-level aggregation."
      ],
      concept: `**\`Collectors\`** is a utility class of ready-made **\`Collector\`** implementations used with the terminal **\`collect(...)\`** operation (§7.9) to **accumulate** stream elements into a result — a \`List\`, \`Set\`, \`Map\`, \`String\`, or a computed summary.

\`\`\`java
import java.util.*;
import java.util.stream.*;

List<String> list = stream.collect(Collectors.toList());
Set<String> set   = stream.collect(Collectors.toSet());
String csv        = stream.collect(Collectors.joining(", "));
\`\`\`

\`collect\` is the most flexible terminal operation — collectors are how you turn a pipeline into structured output.`,
      why: `Most stream pipelines end by **building a result**, and collectors express that declaratively and safely (including in parallel). Beyond simple lists, they shine at **grouping**, **partitioning**, and **summarising** — replacing pages of manual loop-and-map code with one expression. They're composable, so you can build multi-level aggregations (group, then count/sum within each group).`,
      basic: `**Common collectors:**

| Collector | Result |
|---|---|
| \`toList()\` / \`toSet()\` | List / Set |
| \`toCollection(TreeSet::new)\` | a specific collection type |
| \`toUnmodifiableList()\` | immutable list |
| \`joining()\` / \`joining(", ")\` / \`joining(", ","[","]")\` | concatenated String |
| \`counting()\` | element count (Long) |
| \`summingInt\`/\`averagingInt\`/\`summarizingInt\` | numeric aggregates |
| \`mapping(fn, downstream)\` | transform then collect |
| \`reducing(...)\` | general reduction |

\`\`\`java
String names = people.stream().map(Person::name).collect(Collectors.joining(", "));
long count   = people.stream().collect(Collectors.counting());
IntSummaryStatistics stats = people.stream().collect(Collectors.summarizingInt(Person::age));
// stats.getAverage(), getMax(), getMin(), getSum(), getCount()
\`\`\``,
      grouping: `**\`groupingBy\` — the most powerful collector** — partitions elements into a \`Map\` keyed by a classifier function:

\`\`\`java
// Map<City, List<Person>>
Map<String,List<Person>> byCity = people.stream()
    .collect(Collectors.groupingBy(Person::city));

// with a DOWNSTREAM collector: Map<City, Long> (count per city)
Map<String,Long> countByCity = people.stream()
    .collect(Collectors.groupingBy(Person::city, Collectors.counting()));

// multi-level: Map<City, Map<AgeGroup, List<Person>>>
Map<String,Map<Boolean,List<Person>>> nested = people.stream()
    .collect(Collectors.groupingBy(Person::city,
             Collectors.groupingBy(p -> p.age() >= 30)));

// average age per city
Map<String,Double> avgAge = people.stream()
    .collect(Collectors.groupingBy(Person::city, Collectors.averagingInt(Person::age)));
\`\`\`

The second argument (a **downstream collector**) is what makes grouping composable.`,
      partitioning: `**\`partitioningBy\`** is a special grouping by a **predicate** — always producing a \`Map<Boolean, ...>\` with both \`true\` and \`false\` keys present:

\`\`\`java
Map<Boolean,List<Person>> adults = people.stream()
    .collect(Collectors.partitioningBy(p -> p.age() >= 18));
List<Person> minors = adults.get(false);
\`\`\`

Use \`partitioningBy\` for a yes/no split; \`groupingBy\` for arbitrary keys.`,
      toMap: `**\`toMap\`** builds a \`Map\` from key and value functions — but you must handle **duplicate keys** with a merge function, or it throws \`IllegalStateException\`:

\`\`\`java
// key -> value
Map<String,Integer> nameToAge = people.stream()
    .collect(Collectors.toMap(Person::name, Person::age));

// duplicate keys: provide a merge function
Map<String,Integer> merged = items.stream()
    .collect(Collectors.toMap(Item::category, Item::price, Integer::sum));  // sum on collision

// choose the map type
Map<String,Integer> sorted = people.stream()
    .collect(Collectors.toMap(Person::name, Person::age, (a,b)->a, TreeMap::new));
\`\`\``,
      internal: `A \`Collector\` is defined by a **supplier** (create the result container), an **accumulator** (add an element), a **combiner** (merge two partial results for parallel), and an optional **finisher**. The built-in \`Collectors\` factory methods assemble these for you. For **parallel** streams (§7.8) the combiner must merge partial results correctly — which is why collectors are parallel-safe whereas hand-rolled \`forEach\`-into-a-list is not. \`groupingByConcurrent\`/\`toConcurrentMap\` provide concurrent variants for parallel pipelines (Module 8).`,
      useCases: `- **Reports/aggregations**: count/sum/average per group (sales by region, errors by type).
- **Indexing**: \`toMap(id, entity)\` to build lookup maps (Module 5).
- **Joining**: building CSV/strings from elements.
- **Partitioning**: pass/fail, valid/invalid splits.
- **Multi-level summaries**: nested \`groupingBy\` for pivot-table-like results.`,
      code: `\`\`\`java
import java.util.*;
import java.util.stream.*;

public class CollectorsDemo {
    record Person(String name, int age, String city) {}
    public static void main(String[] args) {
        List<Person> people = List.of(
            new Person("Asha",30,"Pune"), new Person("Ravi",25,"Pune"),
            new Person("Amit",35,"Delhi"), new Person("Shail",28,"Delhi"));

        // group + count
        Map<String,Long> countByCity = people.stream()
            .collect(Collectors.groupingBy(Person::city, Collectors.counting()));
        System.out.println(countByCity);          // {Pune=2, Delhi=2}

        // group + average, names joined per city
        Map<String,String> namesByCity = people.stream()
            .collect(Collectors.groupingBy(Person::city,
                     Collectors.mapping(Person::name, Collectors.joining(","))));
        System.out.println(namesByCity);          // {Pune=Asha,Ravi, Delhi=Amit,Shail}

        // partition
        Map<Boolean,List<String>> split = people.stream()
            .collect(Collectors.partitioningBy(p -> p.age() >= 30,
                     Collectors.mapping(Person::name, Collectors.toList())));
        System.out.println(split);                // {false=[Ravi,Shail], true=[Asha,Amit]}

        // toMap with merge
        Map<String,Integer> oldestPerCity = people.stream()
            .collect(Collectors.toMap(Person::city, Person::age, Integer::max));
        System.out.println(oldestPerCity);        // {Pune=30, Delhi=35}
    }
}
\`\`\``,
      mistakes: `- **\`toMap\` with duplicate keys** and no merge function — throws \`IllegalStateException\`.
- **Forgetting the downstream collector** in \`groupingBy\` when you want counts/sums, not lists.
- **Mutable reduction by hand** (\`forEach\` adding to a shared list) — not parallel-safe; use \`collect\`.
- **Confusing \`groupingBy\` (any key) with \`partitioningBy\` (boolean, always two keys).**
- **Boxing** in numeric summaries — prefer \`summarizingInt\`/\`averagingInt\` / primitive streams.
- **Assuming map ordering** — \`toMap\`/\`groupingBy\` default to \`HashMap\` (unordered); specify a map factory for order (Module 5).`,
      bestPractices: `- Use **\`collect\` + collectors** to build results (parallel-safe) instead of manual accumulation.
- Reach for **\`groupingBy\` with downstream collectors** (\`counting\`, \`averagingInt\`, \`mapping\`, \`joining\`) for aggregations.
- Always supply a **merge function** to \`toMap\` when keys may collide; pick the map type if order matters.
- Use **\`partitioningBy\`** for boolean splits; **\`summarizing*\`** for one-pass stats.
- For parallel pipelines, prefer concurrent collectors (\`groupingByConcurrent\`) when appropriate.`,
      interview: `**Q1. What is a Collector and how is it used?**
A recipe (supplier/accumulator/combiner/finisher) for accumulating stream elements, used with the terminal \`collect(...)\`.

**Q2. groupingBy vs partitioningBy?**
\`groupingBy\` keys by any classifier; \`partitioningBy\` splits by a predicate into a \`Map<Boolean,...>\` with both keys always present.

**Q3. What is a downstream collector?**
A second collector applied to each group (e.g., \`groupingBy(city, counting())\`) for multi-level aggregation.

**Q4. What happens if toMap encounters duplicate keys?**
It throws \`IllegalStateException\` unless you provide a merge function.

**Q5. Why are collectors parallel-safe?**
They define a combiner to merge partial results, unlike a manual shared-list \`forEach\`.

**Q6. How do you compute count/sum/average per group?**
\`groupingBy(classifier, counting()/summingInt(...)/averagingInt(...))\`.`,
      exercises: `1. Collect a stream to a list, set, joined string, and count.
2. Group people by city, then by city→count and city→average age.
3. Build a \`toMap\` and handle a duplicate-key collision with a merge function.
4. Partition numbers into even/odd with \`partitioningBy\`.`,
      challenges: `From a list of sales records (region, product, amount), produce: total amount per region (\`groupingBy + summingDouble\`), the top-selling product per region (\`groupingBy + collectingAndThen(maxBy(...))\`), and a region→(product→count) nested map. Then run one of these on a \`parallelStream\` using a concurrent collector and explain why \`collect\` is safe where a manual \`forEach\` accumulation wouldn't be (§7.8).`,
      summary: `- **\`Collectors\`** + the terminal **\`collect\`** accumulate streams into lists/sets/maps/strings/summaries (§7.9).
- **\`groupingBy\`** (any key) with **downstream collectors** (\`counting\`/\`averagingInt\`/\`mapping\`/\`joining\`) enables multi-level aggregation; **\`partitioningBy\`** splits by a predicate.
- **\`toMap\`** needs a **merge function** for duplicate keys; choose the map type for ordering.
- Collectors are **parallel-safe** (combiner); prefer them over manual accumulation. Next: **Optional (§7.11)**.`
    }),

    /* 7.11 Optional. */
    topic({
      id: "optional", chapter: "7.11", title: "Optional",
      subtitle: "A container for maybe-present values — the antidote to NullPointerException.",
      readTime: "15 min", level: "Advanced", deep: true,
      objectives: [
        "Explain what Optional is and the problem it addresses.",
        "Create and consume Optionals (of, ofNullable, empty, isPresent, ifPresent).",
        "Transform safely with map, flatMap, filter; supply defaults with orElse/orElseGet/orElseThrow.",
        "Apply Optional best practices (and anti-patterns)."
      ],
      concept: `**\`Optional<T>\`** is a **container that may or may not hold a non-null value**. It's a deliberate, type-level way to represent "a value might be absent," replacing error-prone \`null\` returns and reducing \`NullPointerException\`s.

\`\`\`java
import java.util.Optional;

Optional<String> found = repository.findName(id);   // might be empty
String name = found.orElse("Unknown");              // safe default
found.ifPresent(n -> System.out.println("Hi " + n));
\`\`\`

\`Optional\` makes "absence" explicit in the **type signature**, so callers must consciously handle the empty case instead of forgetting a null check.`,
      why: `\`null\` is the "billion-dollar mistake": a \`null\` return is invisible in the type system, so callers forget to check and get \`NullPointerException\` at runtime (Module 4 §4.4). \`Optional\`:

- **Documents** that a result may be absent (in the return type).
- **Forces** the caller to deal with emptiness (no silent NPE).
- **Composes** with \`map\`/\`flatMap\`/\`filter\` so you transform values without null checks.

It pairs naturally with streams (\`findFirst\`, \`max\`, \`reduce\` all return \`Optional\`, §7.9).`,
      creation: `**Creating and inspecting Optionals:**

\`\`\`java
Optional<String> a = Optional.of("x");        // value must be non-null (NPE if null)
Optional<String> b = Optional.ofNullable(maybeNull);  // empty if null
Optional<String> c = Optional.empty();        // explicitly empty

a.isPresent();    // true
c.isEmpty();      // true (Java 11)
a.get();          // "x"  — AVOID: throws NoSuchElementException if empty
\`\`\`

Use \`of\` only when you know the value is non-null; \`ofNullable\` when it might be null. **Avoid \`get()\`** without a presence check — it defeats the purpose.`,
      consuming: `**Consuming safely — the right way:**

\`\`\`java
// supply a default
String v1 = opt.orElse("default");              // eager default
String v2 = opt.orElseGet(() -> compute());     // lazy default (§7.6 Supplier)
String v3 = opt.orElseThrow();                  // NoSuchElementException if empty (Java 10)
String v4 = opt.orElseThrow(() -> new IllegalStateException("missing"));

// act if present (/ or else)
opt.ifPresent(v -> System.out.println(v));
opt.ifPresentOrElse(v -> use(v), () -> handleMissing());  // Java 9
\`\`\`

Prefer **\`orElseGet\`** over \`orElse\` when the default is expensive (laziness, §7.6).`,
      transforming: `**Transforming without unwrapping** — \`map\`, \`flatMap\`, \`filter\` chain safely (skip if empty):

\`\`\`java
// map: transform the contained value (if present)
Optional<Integer> len = Optional.of("hello").map(String::length);   // Optional[5]

// flatMap: when the mapper itself returns an Optional (avoid Optional<Optional<T>>)
Optional<String> city = findUser(id)              // Optional<User>
    .flatMap(User::getAddress)                    // Optional<Address>
    .map(Address::getCity);                       // Optional<String>

// filter: keep value only if it matches
Optional<Integer> big = Optional.of(42).filter(n -> n > 10);  // Optional[42]
\`\`\`

This replaces nested null checks (\`if (user != null && user.getAddress() != null ...)\`) with a clean chain.`,
      internal: `\`Optional\` is an **immutable value-based** container (don't rely on its identity/\`==\`, don't synchronize on it). It's designed primarily as a **method return type** to signal optional results — *not* as a field type, method parameter, or for collections. Using it as a field adds overhead and serialization issues (it isn't \`Serializable\`); a collection should just be empty rather than \`Optional<List>\`. There are primitive variants \`OptionalInt\`/\`OptionalLong\`/\`OptionalDouble\` (returned by \`IntStream.max\` etc.) to avoid boxing.`,
      useCases: `- **Return types** for lookups that may find nothing (\`findById\`, \`findFirst\`).
- **Safe navigation** through nested objects (\`flatMap\` chains).
- **Defaulting** missing config/values (\`orElse\`/\`orElseGet\`).
- **Stream terminals**: \`findFirst\`, \`max\`, \`reduce\` return \`Optional\` (§7.9).`,
      code: `\`\`\`java
import java.util.*;

public class OptionalDemo {
    record Address(String city) {}
    record User(String name, Address address) {
        Optional<Address> address() { return Optional.ofNullable(address); }
    }
    static Optional<User> findUser(int id) {
        return id == 1 ? Optional.of(new User("Asha", new Address("Pune"))) : Optional.empty();
    }
    public static void main(String[] args) {
        // safe navigation + default
        String city = findUser(1)
            .flatMap(User::address)
            .map(Address::city)
            .orElse("Unknown");
        System.out.println(city);              // Pune

        // empty case
        System.out.println(findUser(99).map(User::name).orElse("no user"));  // no user

        // ifPresentOrElse
        findUser(1).ifPresentOrElse(
            u -> System.out.println("Found " + u.name()),
            () -> System.out.println("not found"));
    }
}
\`\`\``,
      mistakes: `- **Calling \`get()\` without checking** — throws \`NoSuchElementException\`; defeats the purpose.
- **Using \`isPresent()\` + \`get()\`** instead of \`map\`/\`ifPresent\`/\`orElse\` — verbose and null-check-like.
- **\`Optional\` fields/parameters** — it's meant for return types; adds overhead and isn't \`Serializable\`.
- **\`orElse(expensive())\`** — eager; use \`orElseGet\` for lazy defaults (§7.6).
- **\`Optional.of(null)\`** — throws NPE; use \`ofNullable\`.
- **Wrapping collections in Optional** — return an empty collection instead.`,
      bestPractices: `- Use \`Optional\` as a **return type** to express "maybe absent"; never as a field or parameter.
- Prefer **\`map\`/\`flatMap\`/\`filter\`** and **\`orElse\`/\`orElseGet\`/\`orElseThrow\`/\`ifPresent\`** over \`isPresent()+get()\`.
- Use **\`orElseGet\`** for expensive defaults; **\`orElseThrow\`** to fail explicitly.
- Return **empty collections**, not \`Optional<Collection>\`.
- Use **primitive \`OptionalInt/Long/Double\`** to avoid boxing where applicable.`,
      interview: `**Q1. What problem does Optional solve?**
It makes the possibility of an absent value explicit in the type, reducing \`NullPointerException\`s and forcing callers to handle emptiness.

**Q2. of vs ofNullable vs empty?**
\`of\` requires non-null (NPE otherwise); \`ofNullable\` yields empty for null; \`empty\` is explicitly empty.

**Q3. orElse vs orElseGet vs orElseThrow?**
\`orElse(value)\` returns a default (eager); \`orElseGet(supplier)\` computes it lazily; \`orElseThrow\` throws if empty.

**Q4. map vs flatMap on Optional?**
\`map\` wraps the result in an Optional; \`flatMap\` is used when the mapper already returns an Optional (avoids nesting).

**Q5. Should Optional be used for fields/parameters?**
No — it's designed as a return type; fields/params add overhead and serialization problems.

**Q6. Why avoid \`get()\`?**
It throws if empty; use safe accessors (\`orElse\`, \`ifPresent\`, \`map\`).`,
      exercises: `1. Replace a null-returning lookup with one returning \`Optional\`; consume it with \`orElse\` and \`ifPresent\`.
2. Chain \`flatMap\`/\`map\` to safely read a nested field, defaulting when absent.
3. Show \`orElse\` vs \`orElseGet\` laziness.
4. Convert an \`isPresent()+get()\` block into idiomatic \`map\`/\`orElse\`.`,
      challenges: `Refactor a deeply null-checked method (user → account → address → zipcode) into a clean \`Optional\` \`flatMap\`/\`map\` chain with a sensible default and an \`orElseThrow\` variant. Then integrate it with a stream that uses \`findFirst()\` and combine the two Optionals. Discuss why \`Optional\` belongs in the return type but not as a field, and how it complements (not replaces) good null discipline (Module 4 §4.4).`,
      summary: `- **\`Optional<T>\`** explicitly models a maybe-absent value, reducing NPEs and forcing callers to handle emptiness.
- Create with **\`of\`/\`ofNullable\`/\`empty\`**; consume with **\`map\`/\`flatMap\`/\`filter\`** + **\`orElse\`/\`orElseGet\`/\`orElseThrow\`/\`ifPresent\`** — avoid \`get()\`.
- Use it as a **return type only** (not fields/params/collections); primitive variants avoid boxing.
- Pairs with stream terminals (\`findFirst\`/\`max\`, §7.9); complements null discipline (Module 4 §4.4).`
    }),

    /* ===================== ADVANCED ===================== */

    /* 7.12 Default & Static Methods in Interfaces. */
    topic({
      id: "default-static-methods", chapter: "7.12", title: "Default & Static Methods in Interfaces",
      subtitle: "How Java 8 let interfaces carry implementation — for safe API evolution.",
      readTime: "14 min", level: "Advanced", deep: true,
      objectives: [
        "Write default and static methods in interfaces.",
        "Explain why default methods enabled the Streams API and backward compatibility.",
        "Resolve the multiple-inheritance (diamond) conflict for default methods.",
        "Use private interface methods (Java 9) for shared helper logic."
      ],
      concept: `Before Java 8, interfaces could only declare **abstract** methods. Java 8 added two new member kinds (revisited here in the functional-programming context — first introduced in Module 2 §2.12):

- **\`default\` methods** — interface methods **with a body** that implementing classes inherit (and may override).
- **\`static\` methods** — utility methods called on the interface itself.

\`\`\`java
interface Greeter {
    String name();
    default String greet() { return "Hello, " + name(); }   // default: has a body
    static Greeter of(String n) { return () -> n; }          // static factory
}
\`\`\`

These let interfaces carry behaviour without forcing every implementer to provide it.`,
      why: `The headline reason is **backward-compatible API evolution**. When Java 8 added the Streams API, it needed to add methods like \`stream()\`, \`forEach\`, and \`removeIf\` to the existing **\`Collection\`/\`List\`** interfaces — implemented by countless classes. Adding a new *abstract* method would have **broken** every existing implementation. **Default methods** solved this: the new methods came with a default body, so old code kept compiling while gaining new capabilities.

- **\`Collection.stream()\`**, **\`Iterable.forEach()\`**, **\`List.sort()\`**, **\`Comparator\`'s** \`thenComparing\`/\`reversed\` are all default methods (§7.4, Module 5).
- **\`static\` factory methods** (\`Comparator.comparing\`, \`Stream.of\`) live on interfaces too.`,
      defaultMethods: `**Default methods** provide a fallback implementation:

\`\`\`java
interface Vehicle {
    void start();
    default void honk() { System.out.println("Beep!"); }   // optional to override
}
class Car implements Vehicle {
    public void start() { /*...*/ }
    // inherits honk() for free; may override it
}
\`\`\`

They can be **overridden** by implementing classes. They also enable **mixins** of behaviour (e.g., \`Comparator\` gains \`reversed()\`, \`Predicate\` gains \`and\`/\`or\` — §7.4).`,
      staticMethods: `**Static interface methods** are utilities tied to the interface, called via the interface name (not inherited by implementers):

\`\`\`java
interface StringUtils {
    static boolean isBlank(String s) { return s == null || s.isBlank(); }
}
StringUtils.isBlank("  ");   // called on the interface
\`\`\`

They're commonly used for **factory methods** (\`List.of\`, \`Optional.of\`, \`Comparator.comparing\`) and helpers, keeping related utilities on the interface itself rather than a separate \`XxxUtils\` class.`,
      diamond: `**The diamond problem for default methods** (Module 2 §2.12 — recapped): if a class inherits **conflicting defaults** from two interfaces, it **must override** the method and may pick one explicitly with \`Interface.super.method()\`:

\`\`\`java
interface A { default String hi() { return "A"; } }
interface B { default String hi() { return "B"; } }
class C implements A, B {
    @Override public String hi() {
        return A.super.hi();    // disambiguate explicitly
    }
}
\`\`\`

Resolution rules: a **class** implementation wins over any interface default; a **more specific** sub-interface wins over a super-interface; otherwise you must override.`,
      privateMethods: `**Private interface methods (Java 9)** let default/static methods **share helper logic** without exposing it:

\`\`\`java
interface Logger {
    void log(String msg);
    default void info(String m)  { log(prefix("INFO", m)); }
    default void error(String m) { log(prefix("ERROR", m)); }
    private String prefix(String level, String m) {        // private helper (Java 9)
        return "[" + level + "] " + m;
    }
}
\`\`\`

Private methods can be instance (\`private\`) or \`private static\`; they're invisible to implementers — purely for internal reuse.`,
      internal: `Default methods are real instance methods dispatched virtually (Module 2 §2.8): a class's override always wins. They reintroduce a *controlled* multiple-inheritance of **behaviour** (interfaces still can't hold instance **state**, §7.2/Module 2 §2.12), which is why the diamond rule exists. Static and private interface methods are not inherited and not polymorphic. Crucially, a default method **doesn't count** toward the single-abstract-method rule, so a functional interface (§7.2) can have many defaults and remain usable as a lambda target.`,
      useCases: `- **Evolving published interfaces** without breaking implementers (the JDK's own use).
- **Composable behaviour** on functional interfaces (\`Predicate.and\`, \`Function.andThen\`, \`Comparator.thenComparing\`).
- **Static factory methods** on interfaces (\`List.of\`, \`Comparator.comparing\`).
- **Shared helper logic** via private interface methods.`,
      code: `\`\`\`java
import java.util.*;
import java.util.function.*;

public class DefaultStaticDemo {
    interface Discount {
        double apply(double price);
        default Discount andThen(Discount next) {        // default: composition
            return price -> next.apply(this.apply(price));
        }
        static Discount percent(double pct) {             // static factory
            return price -> price * (1 - pct);
        }
    }
    public static void main(String[] args) {
        Discount tenOff = Discount.percent(0.10);
        Discount fiveOff = Discount.percent(0.05);
        Discount combined = tenOff.andThen(fiveOff);      // uses default method
        System.out.println(combined.apply(100));          // 85.5

        // JDK default methods in action:
        List<Integer> nums = new ArrayList<>(List.of(3,1,2));
        nums.sort(Comparator.<Integer>naturalOrder().reversed()); // default reversed()
        nums.forEach(System.out::println);                         // default forEach
    }
}
\`\`\``,
      mistakes: `- **Putting state in an interface** — default methods add behaviour, not instance fields (interfaces have only constants).
- **Unresolved diamond** — inheriting conflicting defaults without overriding (compile error); resolve with \`X.super.m()\`.
- **Overusing default methods** to dump logic into interfaces — they're for evolution/composition, not as a substitute for classes.
- **Expecting static interface methods to be inherited** — they're called on the interface only.
- **Forgetting defaults don't break functional interfaces** — they don't count toward the SAM (§7.2).`,
      bestPractices: `- Use **default methods** mainly to **evolve APIs** safely and to add **composable** helpers (like the JDK does).
- Keep default methods **small and general**; complex logic belongs in classes.
- Use **static interface methods** for factories/utilities related to the type.
- Use **private interface methods** (Java 9) to share helper code among defaults.
- Resolve diamond conflicts explicitly with **\`Interface.super.method()\`** (Module 2 §2.12).`,
      interview: `**Q1. Why were default methods added in Java 8?**
To evolve existing interfaces (e.g., add \`stream()\`/\`forEach\` to \`Collection\`) without breaking the many classes implementing them.

**Q2. Can a class override a default method?**
Yes — and a class implementation always wins over an interface default.

**Q3. How is the default-method diamond conflict resolved?**
The class must override the method and may select a parent via \`Interface.super.method()\`.

**Q4. What are static interface methods used for?**
Factory/utility methods on the interface (e.g., \`Comparator.comparing\`, \`List.of\`); not inherited.

**Q5. What did Java 9 add to interfaces?**
Private (and private static) methods for sharing helper logic among default methods.

**Q6. Do default methods break functional interfaces?**
No — only abstract methods count toward the single-abstract-method rule (§7.2).`,
      exercises: `1. Add a default method to an interface and override it in one implementer, inherit it in another.
2. Create conflicting default methods in two interfaces and resolve the diamond with \`X.super.m()\`.
3. Add a static factory method to an interface and call it via the interface.
4. Refactor duplicated default-method logic into a private interface method (Java 9).`,
      challenges: `Design a \`Validator<T>\` functional interface with an abstract \`validate\`, default \`and\`/\`or\` combinators (composition), a static \`always()\` factory, and a private helper shared by the defaults. Then create a second interface with a conflicting default and demonstrate explicit diamond resolution. Explain how this exact pattern (defaults + statics) is what made \`Predicate\`/\`Comparator\`/\`Collection\` evolvable in Java 8.`,
      summary: `- Java 8 interfaces gained **\`default\`** (bodied, inheritable, overridable) and **\`static\`** (utility/factory) methods; Java 9 added **private** helpers.
- The driver was **backward-compatible API evolution** (e.g., \`Collection.stream\`, \`List.sort\`, \`Comparator.reversed\`).
- Default methods reintroduce controlled multiple-inheritance of **behaviour** (not state) → **diamond** resolved via \`Interface.super.method()\` (Module 2 §2.12).
- Defaults don't break functional interfaces (§7.2); use them for evolution/composition, not as class replacements.`
    }),

    /* 7.13 Date and Time API. */
    topic({
      id: "date-and-time-api", chapter: "7.13", title: "Date and Time API",
      subtitle: "java.time — the modern, immutable replacement for Date/Calendar.",
      readTime: "16 min", level: "Advanced", deep: true,
      objectives: [
        "Use the core java.time classes: LocalDate, LocalTime, LocalDateTime, Instant.",
        "Handle time zones (ZonedDateTime) and amounts (Duration, Period).",
        "Format and parse with DateTimeFormatter.",
        "Explain why java.time replaced the legacy Date/Calendar."
      ],
      concept: `Java 8 introduced **\`java.time\`** (JSR-310), a modern, **immutable**, and well-designed date/time API that replaces the flawed legacy \`java.util.Date\` and \`Calendar\`. Its core classes are clearly named and **thread-safe**:

\`\`\`java
import java.time.*;

LocalDate today = LocalDate.now();              // 2026-06-12 (date only)
LocalTime now   = LocalTime.now();              // 14:30:15  (time only)
LocalDateTime dt = LocalDateTime.now();         // date + time, no zone
Instant ts      = Instant.now();                // a point on the UTC timeline
\`\`\`

Every \`java.time\` object is **immutable** (Module 3 §3.4): "modifying" methods (\`plusDays\`, \`withYear\`) return a **new** instance.`,
      why: `The legacy API was notoriously bad, and \`java.time\` fixes it:

- **Immutability & thread safety** — old \`Date\`/\`Calendar\` were **mutable** and not thread-safe; \`SimpleDateFormat\` was a classic concurrency bug.
- **Clear, fluent design** — separate types for date, time, datetime, instant, zone, duration.
- **Sane values** — old \`Date\` months were 0-based and years offset from 1900; \`java.time\` uses natural values.
- **Rich operations** — \`plus\`/\`minus\`/\`with\`, comparisons, \`Period\`/\`Duration\`, parsing/formatting.

For interviews and real code: **always use \`java.time\`**, not \`Date\`/\`Calendar\`.`,
      coreClasses: `**The core types and what they model:**

| Class | Represents | Example |
|---|---|---|
| \`LocalDate\` | date (no time/zone) | 2026-06-12 |
| \`LocalTime\` | time (no date/zone) | 14:30 |
| \`LocalDateTime\` | date + time (no zone) | 2026-06-12T14:30 |
| \`ZonedDateTime\` | date + time **with zone** | ...+05:30[Asia/Kolkata] |
| \`Instant\` | a timestamp on the UTC timeline | 2026-06-12T09:00:00Z |
| \`Duration\` | time-based amount (seconds/nanos) | PT2H30M |
| \`Period\` | date-based amount (years/months/days) | P1Y2M10D |
| \`ZoneId\` / \`ZoneOffset\` | a time zone / offset | Asia/Kolkata, +05:30 |

Use \`Local*\` when no zone matters, \`ZonedDateTime\`/\`Instant\` when it does.`,
      operations: `**Manipulating dates/times (immutable — returns new objects):**

\`\`\`java
LocalDate d = LocalDate.of(2026, 6, 12);
LocalDate next = d.plusDays(10).minusMonths(1);   // new object
boolean isBefore = d.isBefore(LocalDate.now());
DayOfWeek dow = d.getDayOfWeek();                 // FRIDAY
LocalDate withYear = d.withYear(2030);            // change one field

// amounts between dates/times
Period age = Period.between(LocalDate.of(1995,1,1), LocalDate.now()); // years/months/days
Duration meeting = Duration.between(LocalTime.of(9,0), LocalTime.of(10,30)); // PT1H30M

// zones
ZonedDateTime kolkata = ZonedDateTime.now(ZoneId.of("Asia/Kolkata"));
ZonedDateTime utc = kolkata.withZoneSameInstant(ZoneOffset.UTC);
\`\`\``,
      formatting: `**Formatting and parsing with \`DateTimeFormatter\`** (immutable and **thread-safe**, unlike \`SimpleDateFormat\`):

\`\`\`java
import java.time.format.DateTimeFormatter;

DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");
String text = LocalDateTime.now().format(fmt);          // "12-06-2026 14:30"
LocalDate parsed = LocalDate.parse("2026-06-12");        // ISO by default
LocalDateTime p2 = LocalDateTime.parse("12-06-2026 14:30", fmt);
\`\`\`

Built-in formatters (\`DateTimeFormatter.ISO_LOCAL_DATE\`) cover standard formats; define patterns for custom ones. A single \`DateTimeFormatter\` can be safely shared across threads.`,
      internal: `\`java.time\` separates **machine time** (\`Instant\` — a count from the epoch, used for timestamps/logging) from **human time** (\`LocalDate\`/\`LocalDateTime\` — calendar fields). \`ZonedDateTime\` combines an instant with a \`ZoneId\` and handles **daylight-saving** transitions. Because all types are **immutable value-based** classes, they're inherently thread-safe and safe to cache/share — eliminating the legacy \`SimpleDateFormat\` race condition. Conversion bridges exist: \`Date.toInstant()\`/\`Date.from(Instant)\` to interoperate with legacy code.`,
      useCases: `- **Timestamps/logging/auditing**: \`Instant.now()\`.
- **Business dates**: due dates, birthdays, schedules with \`LocalDate\`/\`Period\`.
- **Durations/timeouts**: \`Duration\` for elapsed time and config (Module 8).
- **Zoned scheduling** across regions: \`ZonedDateTime\`.
- **Formatting/parsing** user-facing or API date strings.`,
      code: `\`\`\`java
import java.time.*;
import java.time.format.*;
import java.time.temporal.ChronoUnit;

public class DateTimeDemo {
    public static void main(String[] args) {
        LocalDate today = LocalDate.now();
        LocalDate dueDate = today.plusWeeks(2);
        System.out.println("Due: " + dueDate.getDayOfWeek());

        // age in years
        LocalDate birth = LocalDate.of(1995, 3, 15);
        long years = ChronoUnit.YEARS.between(birth, today);
        System.out.println("Age: " + years);

        // duration between two times
        Duration d = Duration.between(LocalTime.of(9,0), LocalTime.of(17,30));
        System.out.println(d.toHours() + "h " + d.toMinutesPart() + "m"); // 8h 30m

        // zones + formatting
        ZonedDateTime meeting = ZonedDateTime.of(today, LocalTime.of(15,0), ZoneId.of("Asia/Kolkata"));
        ZonedDateTime utc = meeting.withZoneSameInstant(ZoneOffset.UTC);
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm z");
        System.out.println(meeting.format(fmt));
        System.out.println(utc.format(fmt));
    }
}
\`\`\``,
      mistakes: `- **Using legacy \`Date\`/\`Calendar\`/\`SimpleDateFormat\`** in new code — mutable, error-prone, not thread-safe.
- **Sharing \`SimpleDateFormat\` across threads** — the classic concurrency bug; \`DateTimeFormatter\` is the safe replacement.
- **Confusing \`Period\` (date-based) with \`Duration\` (time-based).**
- **Ignoring time zones** — using \`LocalDateTime\` where an instant/zone is required.
- **Expecting mutation** — \`plusDays\` returns a new object; you must capture it.
- **Off-by-one month/zero-based** assumptions from the old API (java.time is natural: months 1–12).`,
      bestPractices: `- **Always use \`java.time\`**; avoid \`Date\`/\`Calendar\` except when bridging legacy APIs (\`Date.from(instant)\`).
- Use **\`Instant\`** for timestamps/machine time, **\`LocalDate\`/\`LocalDateTime\`** for human dates, **\`ZonedDateTime\`** when zone matters.
- Reuse a **single thread-safe \`DateTimeFormatter\`** (often a \`static final\`).
- Pick **\`Period\`** for calendar amounts, **\`Duration\`** for time amounts.
- Treat all values as **immutable**; capture the returned objects.`,
      interview: `**Q1. Why was java.time introduced?**
To replace the mutable, thread-unsafe, poorly-designed \`Date\`/\`Calendar\`/\`SimpleDateFormat\` with an immutable, clear, thread-safe API.

**Q2. LocalDate vs LocalDateTime vs ZonedDateTime vs Instant?**
Date only / date+time (no zone) / date+time+zone / a point on the UTC timeline (machine timestamp).

**Q3. Period vs Duration?**
\`Period\` is date-based (years/months/days); \`Duration\` is time-based (hours/minutes/seconds/nanos).

**Q4. Is java.time thread-safe?**
Yes — all types are immutable; \`DateTimeFormatter\` is thread-safe (unlike \`SimpleDateFormat\`).

**Q5. How do you format/parse dates?**
With \`DateTimeFormatter\` (\`format\`/\`parse\`), using ISO defaults or custom patterns.

**Q6. How do you convert between legacy Date and java.time?**
\`date.toInstant()\` and \`Date.from(instant)\`.`,
      exercises: `1. Compute a due date 30 days from today and its day of week.
2. Calculate someone's age in years from their birth date.
3. Find the \`Duration\` between two \`LocalTime\`s and print hours/minutes.
4. Format \`LocalDateTime.now()\` with a custom pattern, then parse it back.`,
      challenges: `Build a meeting scheduler: given a meeting in one time zone, display its local time in three other zones (handle DST correctly with \`ZonedDateTime\`), compute the \`Duration\` until it starts from \`Instant.now()\`, and format everything with a shared \`DateTimeFormatter\`. Then write a short note on why the legacy \`Date\`/\`SimpleDateFormat\` approach was both error-prone and unsafe for this task (immutability + thread safety, Module 3 §3.4 / Module 8).`,
      summary: `- **\`java.time\`** (Java 8) is the modern, **immutable, thread-safe** date/time API replacing \`Date\`/\`Calendar\`/\`SimpleDateFormat\`.
- Core: **\`LocalDate\`/\`LocalTime\`/\`LocalDateTime\`** (no zone), **\`ZonedDateTime\`/\`Instant\`** (zone/UTC), **\`Period\`** (date amount) vs **\`Duration\`** (time amount).
- Format/parse with a reusable **\`DateTimeFormatter\`** (thread-safe); all operations return **new** objects (Module 3 §3.4).
- Always prefer it over legacy types — capping off Module 7's modern-Java toolkit.`
    })
  ]
});
