/* Module 6: Generics — edit ONLY this file for this module's content.
   Authored at ~2x Module 2 depth (Module-3 style), ordered BASIC -> ADVANCED:
     6.1 intro -> 6.2 generic classes/interfaces -> 6.3 generic methods
     -> 6.4 bounded types -> 6.5 wildcards & PECS -> 6.6 type erasure
     -> 6.7 restrictions, pitfalls & best practices.
   Each topic() renders sections in declared order; see assets/site.js PART_LABELS. */
registerModule({
  id: "generics",
  module: "Generics",
  page: "module-generics.html",
  icon: "🧬",
  tagline: "Type-safe, reusable code — from your first <T> to wildcards and erasure.",
  lessons: [

    /* ===================== BASIC ===================== */

    /* 6.1 Introduction to Generics — why generics exist. */
    topic({
      id: "intro-to-generics", chapter: "6.1", title: "Introduction to Generics",
      subtitle: "Why generics exist: compile-time type safety and the end of casting.",
      readTime: "15 min", level: "Foundational", deep: true,
      objectives: [
        "Explain what generics are and the problems they solve.",
        "Contrast pre-generics raw collections with parameterised ones.",
        "Read the generics vocabulary: type parameter, type argument, parameterised type.",
        "Understand raw types and why to avoid them."
      ],
      concept: `**Generics** let you write classes, interfaces, and methods that operate on a **type parameter** supplied later — code that is **type-safe** and **reusable** across many types without casting. Introduced in **Java 5**, generics are why \`List<String>\` can hold only \`String\`s, checked by the **compiler**.

\`\`\`java
List<String> names = new ArrayList<>();   // a List parameterised with String
names.add("Shail");
String s = names.get(0);                   // no cast needed — compiler knows it's a String
// names.add(42);                          // compile error — type safety!
\`\`\`

The \`<String>\` part is a **type argument**; \`List<E>\` declares a **type parameter** \`E\`. Generics move whole classes of bugs from **runtime** to **compile time**.`,
      why: `Before generics (Java 1.4 and earlier), collections stored raw **\`Object\`**, which caused two pains:

\`\`\`java
// pre-generics: unsafe and verbose
List list = new ArrayList();
list.add("hello");
list.add(42);                              // oops — no one stopped this
String s = (String) list.get(1);           // ClassCastException at RUNTIME
\`\`\`

- **No type safety** — you could put anything in; mistakes surfaced as runtime \`ClassCastException\`.
- **Manual casting** — every \`get\` needed an explicit, error-prone cast.

Generics fix both: the compiler **enforces** the element type and **inserts casts for you**. The benefits:

- **Compile-time type checking** — errors caught early.
- **No casts** — cleaner, safer code.
- **Reusability** — one generic class works for many types (\`Box<String>\`, \`Box<Integer>\`).
- **Self-documenting APIs** — \`Map<String,Integer>\` states intent.`,
      vocabulary: `**Generics vocabulary (use the right words in interviews):**

| Term | Meaning | Example |
|---|---|---|
| **Type parameter** | placeholder in a declaration | the \`E\` in \`class Box<E>\` |
| **Type argument** | the actual type supplied | \`String\` in \`Box<String>\` |
| **Parameterised type** | a generic type with arguments | \`Box<String>\`, \`List<Integer>\` |
| **Raw type** | a generic used without arguments | \`Box\`, \`List\` (avoid!) |
| **Diamond operator** | infers args on the right side | \`new ArrayList<>()\` |

**Naming convention** for type parameters (single uppercase letters): **\`T\`** (type), **\`E\`** (element), **\`K\`/\`V\`** (key/value), **\`N\`** (number), **\`R\`** (return), **\`S\`,\`U\`** (additional).`,
      rawTypes: `**Raw types** are generic types used **without** a type argument — allowed only for **backward compatibility** with pre-Java-5 code, and best avoided:

\`\`\`java
List raw = new ArrayList();        // raw type — no type safety
raw.add("a"); raw.add(1);          // compiles, but you've lost all checking
List<String> safe = new ArrayList<>();   // ✅ parameterised
\`\`\`

Using a raw type **disables generic type checking** for that variable (the compiler warns "unchecked"). The **diamond operator** \`<>\` (Java 7+) lets the compiler **infer** the type argument on the right-hand side, so you write \`new ArrayList<>()\` instead of \`new ArrayList<String>()\`.`,
      internal: `Generics are primarily a **compile-time** feature. The compiler:

1. **Checks** that you only use the parameterised type with the right types.
2. **Inserts the casts** you'd otherwise write by hand.
3. **Erases** the type information afterward (**type erasure**, §6.6) — at runtime \`List<String>\` and \`List<Integer>\` are both just \`List\`.

So generics give you safety and clarity at compile time with **no runtime overhead** (no new bytecode for each type), at the cost of some runtime limitations covered in §6.6/§6.7.`,
      useCases: `- **Collections** — \`List<T>\`, \`Map<K,V>\`, \`Set<E>\` (Module 5).
- **Reusable containers/wrappers** — \`Optional<T>\`, \`Box<T>\`, \`Pair<A,B>\`.
- **Generic algorithms** — \`Collections.sort\`, \`Comparator<T>\` (§6.3).
- **Functional interfaces** — \`Function<T,R>\`, \`Predicate<T>\`, \`Supplier<T>\` (Module 7).
- **Type-safe APIs/DSLs** and builders.`,
      code: `\`\`\`java
import java.util.*;

public class IntroGenerics {
    public static void main(String[] args) {
        // type-safe, no casts
        Map<String,List<Integer>> scores = new HashMap<>();   // diamond infers args
        scores.computeIfAbsent("math", k -> new ArrayList<>()).add(95);
        int first = scores.get("math").get(0);                // no cast

        // the compiler stops type errors:
        List<String> names = new ArrayList<>();
        names.add("Shail");
        // names.add(42);   // ❌ compile error

        // contrast: raw type loses safety
        List raw = new ArrayList();
        raw.add("ok"); raw.add(123);            // compiles (unchecked warning)
        // String bad = (String) raw.get(1);    // ClassCastException at runtime
        System.out.println(first);
    }
}
\`\`\``,
      mistakes: `- **Using raw types** (\`List list\`) — disables type checking; always parameterise.
- **Ignoring "unchecked" warnings** — they signal lost type safety.
- **Thinking generics exist at runtime** — they're erased (§6.6); you can't do \`new T()\` or \`x instanceof List<String>\`.
- **Over-genericising** simple code — adds complexity without benefit.
- **Confusing type parameter (\`E\`) with type argument (\`String\`)** in terminology.`,
      bestPractices: `- **Always parameterise** generic types; never use raw types in new code.
- Use the **diamond operator** \`<>\` to avoid repeating type arguments.
- Follow the **naming convention** (\`T\`, \`E\`, \`K\`, \`V\`, \`R\`).
- Treat **unchecked warnings** as errors to investigate (suppress only with justification).
- Let generics **document intent** (\`Map<UserId, Order>\` over \`Map\`).`,
      interview: `**Q1. What are generics and why were they introduced?**
A Java 5 feature for parameterising types/methods over a type, giving compile-time type safety and removing casts.

**Q2. What problems do generics solve?**
They prevent runtime \`ClassCastException\` (catching type errors at compile time) and eliminate manual casts when reading from collections.

**Q3. What is a raw type?**
A generic type used without a type argument (\`List\` instead of \`List<String>\`); it disables generic checking and exists only for backward compatibility.

**Q4. What is the diamond operator?**
\`<>\` (Java 7+) lets the compiler infer the type argument on the right-hand side of an assignment.

**Q5. Do generics add runtime overhead?**
No — they're compile-time only and erased at runtime (§6.6).

**Q6. Type parameter vs type argument?**
The parameter is the placeholder in the declaration (\`<E>\`); the argument is the concrete type supplied (\`String\`).`,
      exercises: `1. Rewrite a raw \`List\`/\`Map\` example into parameterised, type-safe versions and remove the casts.
2. Show a compile error when adding the wrong type to a \`List<String>\`.
3. Demonstrate the runtime \`ClassCastException\` you'd get with a raw type, and how generics prevent it.
4. Use nested generics (\`Map<String,List<Integer>>\`) with the diamond operator.`,
      challenges: `Take a small pre-generics utility (a stack or registry built on raw \`Object\`/\`ArrayList\` with casts) and modernise it to be fully generic and type-safe, eliminating every cast and unchecked warning. Document each change and explain how the compiler now prevents the class of bugs that the original could only hit at runtime (preview of building your own generic class in §6.2).`,
      summary: `- **Generics** (Java 5) parameterise types/methods over a type for **compile-time safety** and **no casts**.
- They replaced unsafe **raw \`Object\`** collections; **raw types** disable checking (avoid them); **diamond \`<>\`** infers arguments.
- Vocabulary: **type parameter** (\`<E>\`) vs **type argument** (\`String\`); conventions \`T\`/\`E\`/\`K\`/\`V\`/\`R\`.
- Compile-time only (**erased at runtime**, §6.6); next: writing **generic classes (§6.2)** and **methods (§6.3)**.`
    }),

    /* ===================== CORE ===================== */

    /* 6.2 Generic Classes & Interfaces. */
    topic({
      id: "generic-classes", chapter: "6.2", title: "Generic Classes & Interfaces",
      subtitle: "Writing your own reusable, type-safe classes and interfaces.",
      readTime: "16 min", level: "Core", deep: true,
      objectives: [
        "Declare generic classes and interfaces with one or more type parameters.",
        "Instantiate them and understand the diamond operator's inference.",
        "Implement generic interfaces (fully or partially parameterised).",
        "Know what you cannot do with a type parameter (static, new T)."
      ],
      concept: `A **generic class** declares one or more **type parameters** in angle brackets after its name; those parameters can then be used as field types, method parameters, and return types throughout the class.

\`\`\`java
public class Box<T> {                 // T is a type parameter
    private T value;                  // field of type T
    public void set(T value) { this.value = value; }
    public T get() { return value; } // returns T
}

Box<String> sb = new Box<>();        // T = String
sb.set("hi");
String s = sb.get();                 // no cast
Box<Integer> ib = new Box<>();       // T = Integer — same class, reused
\`\`\`

The same class works for any reference type, with full compile-time checking per instantiation.`,
      why: `Generic classes let you write a data structure or wrapper **once** and reuse it safely for any type — exactly how the Collections Framework (Module 5) is built. Without generics you'd either duplicate the class per type or fall back to unsafe \`Object\` + casts (§6.1). Generic **interfaces** (like \`Comparable<T>\`, \`Iterable<T>\`, \`Comparator<T>\`) define type-safe contracts that many classes implement.`,
      multipleParams: `A class/interface can have **multiple type parameters**:

\`\`\`java
public class Pair<K, V> {            // two parameters
    private final K key;
    private final V value;
    public Pair(K key, V value) { this.key = key; this.value = value; }
    public K getKey()   { return key; }
    public V getValue() { return value; }
}

Pair<String,Integer> p = new Pair<>("age", 30);
\`\`\`

This is exactly how \`Map.Entry<K,V>\` and \`Map<K,V>\` are declared (Module 5). Use meaningful single-letter names (\`K\`,\`V\`,\`T\`,\`E\` — §6.1).`,
      genericInterfaces: `**Generic interfaces** are implemented in two ways:

\`\`\`java
interface Container<T> {
    void add(T item);
    T get(int i);
}

// 1) fix the type argument when implementing
class StringContainer implements Container<String> {
    public void add(String item) { /* ... */ }
    public String get(int i) { return null; }
}

// 2) stay generic — pass the parameter through
class ListContainer<T> implements Container<T> {
    private final List<T> items = new ArrayList<>();
    public void add(T item) { items.add(item); }
    public T get(int i) { return items.get(i); }
}
\`\`\`

The JDK's \`Comparable<T>\` is the canonical example: \`class Money implements Comparable<Money>\` (Module 5 §5.4).`,
      internal: `Within a generic class, the type parameter behaves like a real type for compile-time checking, but **type erasure** (§6.6) imposes runtime limits:

- **No \`new T()\`** — you can't instantiate a type parameter (its runtime type is erased to \`Object\`/its bound). Pass a factory or \`Class<T>\` instead.
- **No \`T[]\` creation** — \`new T[10]\` is illegal; use \`(T[]) new Object[10]\` with care or an \`ArrayList<T>\`.
- **No static use of a class's type parameter** — \`static T field;\` / \`static T method()\` is illegal, because statics are shared across all instantiations (there's no single \`T\`). Static *methods* can declare their **own** type parameters though (§6.3).
- A type parameter **can't be a primitive** — use wrappers (\`Box<Integer>\`, not \`Box<int>\`) (§6.7).

\`\`\`java
class Factory<T> {
    // static T make() { return new T(); } // ❌ both illegal
    T make(java.util.function.Supplier<T> s) { return s.get(); } // ✅ supplier pattern
}
\`\`\``,
      useCases: `- **Custom data structures**: \`Stack<T>\`, \`Tree<T>\`, \`LinkedList<T>\`, ring buffers.
- **Wrappers/holders**: \`Optional<T>\`, \`Result<T>\`, \`Box<T>\`, \`Pair<K,V>\`.
- **Type-safe DTOs and responses**: \`ApiResponse<T>\`, \`Page<T>\`.
- **Generic interfaces/contracts**: \`Repository<T,ID>\`, \`Comparable<T>\`, \`Iterable<T>\`.`,
      code: `\`\`\`java
import java.util.*;
import java.util.function.Supplier;

public class GenericClassDemo {
    // a generic, type-safe stack
    static class Stack<T> {
        private final List<T> data = new ArrayList<>();
        public void push(T x) { data.add(x); }
        public T pop() {
            if (data.isEmpty()) throw new java.util.NoSuchElementException();
            return data.remove(data.size() - 1);
        }
        public boolean isEmpty() { return data.isEmpty(); }
    }

    static class Pair<K,V> {
        final K k; final V v;
        Pair(K k, V v){ this.k = k; this.v = v; }
        public String toString(){ return k + "=" + v; }
    }

    public static void main(String[] args) {
        Stack<String> s = new Stack<>();
        s.push("a"); s.push("b");
        System.out.println(s.pop());        // b

        Pair<String,Integer> p = new Pair<>("age", 30);
        System.out.println(p);              // age=30

        // factory pattern to work around 'no new T()'
        Supplier<List<String>> maker = ArrayList::new;
        List<String> made = maker.get();
        System.out.println(made.isEmpty()); // true
    }
}
\`\`\``,
      mistakes: `- **\`new T()\` or \`new T[]\`** — illegal due to erasure; use a \`Supplier\`/\`Class<T>\` or an \`ArrayList<T>\`.
- **Static fields/methods using the class's \`T\`** — illegal; statics aren't tied to an instantiation.
- **Using primitives as type arguments** — \`Box<int>\` won't compile; use \`Box<Integer>\` (§6.7).
- **Raw use of your generic class** (\`Box b = new Box()\`) — loses safety (§6.1).
- **Confusing implementing \`Container<String>\` (fixed) with \`Container<T>\` (still generic).**`,
      bestPractices: `- Parameterise reusable containers/wrappers; name parameters conventionally (\`T\`/\`E\`/\`K\`/\`V\`).
- Use the **diamond operator** when instantiating.
- Work around "no \`new T()\`" with a **\`Supplier<T>\`** or **\`Class<T>\`** factory.
- Implement JDK generic interfaces (\`Comparable<T>\`, \`Iterable<T>\`) for interop (Module 5).
- Keep generic signatures readable; introduce **bounds** (§6.4) only when you need to call methods on \`T\`.`,
      interview: `**Q1. How do you declare a generic class?**
Put type parameters in angle brackets after the name: \`class Box<T> { T value; }\`; use \`T\` for fields/methods.

**Q2. Can a generic class have multiple type parameters?**
Yes — e.g., \`class Pair<K,V>\`, like \`Map<K,V>\`.

**Q3. Why can't you write \`new T()\` inside a generic class?**
Type erasure removes \`T\` at runtime, so the JVM doesn't know what to instantiate; pass a \`Supplier\`/\`Class<T>\`.

**Q4. Why can't a static field use the class's type parameter?**
Statics are shared across all instantiations, so there's no single \`T\`; static methods may declare their own type parameters (§6.3).

**Q5. Two ways to implement a generic interface?**
Fix the argument (\`implements Container<String>\`) or remain generic (\`class C<T> implements Container<T>\`).

**Q6. Can a type argument be a primitive?**
No — use wrapper types (\`Integer\`, not \`int\`).`,
      exercises: `1. Write a generic \`Box<T>\` with get/set and use it for \`String\` and \`Integer\`.
2. Implement a generic \`Pair<K,V>\` and a \`Triple<A,B,C>\`.
3. Build a generic \`Stack<T>\` backed by an \`ArrayList\`; handle empty-pop with an exception.
4. Show the compile errors for \`new T()\`, \`static T x\`, and \`Box<int>\`, and fix each.`,
      challenges: `Implement a generic \`Result<T>\` type (a success-or-error wrapper) with static factory methods \`ok(T)\` and \`error(String)\`, plus \`map\`/\`getOrElse\`. Note where you need the static methods to declare their own type parameters (§6.3) and how you avoid \`new T()\`. Then make it implement a generic interface \`Mappable<T>\` to practise both fixed and pass-through implementation.`,
      summary: `- A **generic class/interface** declares **type parameters** (\`class Box<T>\`, \`Pair<K,V>\`) usable as field/param/return types — write once, reuse safely.
- Implement generic interfaces by **fixing** the argument or **passing it through**.
- Erasure limits: **no \`new T()\`/\`new T[]\`**, **no static use of the class's \`T\`**, **no primitive arguments** (§6.6/§6.7) — use \`Supplier\`/\`Class<T>\`/wrappers.
- Next: **generic methods (§6.3)** and **bounds (§6.4)**.`
    }),

    /* 6.3 Generic Methods. */
    topic({
      id: "generic-methods", chapter: "6.3", title: "Generic Methods",
      subtitle: "Methods with their own type parameters and type inference.",
      readTime: "14 min", level: "Core", deep: true,
      objectives: [
        "Declare generic methods with their own type parameters.",
        "Rely on type inference and use explicit type witnesses when needed.",
        "Write generic static utility methods (independent of any class's parameters).",
        "Use multiple type parameters and link parameter/return types."
      ],
      concept: `A **generic method** declares its **own type parameter(s)** — placed **before the return type** — independent of whether the enclosing class is generic. This lets a single method work for many types with inference.

\`\`\`java
public static <T> T firstOf(List<T> list) {   // <T> declared before return type T
    return list.isEmpty() ? null : list.get(0);
}

String s = firstOf(List.of("a", "b"));   // T inferred as String
Integer n = firstOf(List.of(1, 2, 3));   // T inferred as Integer
\`\`\`

The \`<T>\` before \`T firstOf(...)\` is what makes it a generic *method* (vs just using a class's type parameter).`,
      why: `Generic methods are perfect for **utility/static** operations that should work across types without tying the whole class to a type parameter:

- **Static helpers** — a class can't use its own type parameter in a static method (§6.2), but a static method can declare its **own**.
- **One-off type relationships** — link the argument type to the return type (\`T in → T out\`) or two arguments.
- **Cleaner than wildcards** when the type must be *named* (e.g., used in multiple positions).

The JDK is full of them: \`Collections.<T>emptyList()\`, \`Arrays.<T>asList(...)\`, \`Optional.<T>of(...)\`.`,
      syntax: `**Anatomy:** type parameters go in \`<...>\` **immediately before the return type**:

\`\`\`java
// one parameter
public <T> void printAll(List<T> items) { items.forEach(System.out::println); }

// multiple parameters, linking input and output types
public <K, V> Map<V, K> invert(Map<K, V> map) {
    Map<V,K> out = new HashMap<>();
    map.forEach((k, v) -> out.put(v, k));
    return out;
}

// static generic method
public static <T> List<T> repeat(T item, int n) {
    List<T> list = new ArrayList<>();
    for (int i = 0; i < n; i++) list.add(item);
    return list;
}
\`\`\``,
      inference: `**Type inference** usually figures out the type arguments from the call, so you rarely write them explicitly. When inference can't (or you want to force a type), supply an explicit **type witness** before the method name:

\`\`\`java
List<String> empty = Collections.emptyList();          // inferred T = String
List<String> e2 = Collections.<String>emptyList();     // explicit type witness
var x = GenericClassDemo.<Integer>repeat(0, 3);        // witness on a static call
\`\`\`

The witness syntax \`obj.<Type>method(...)\` / \`Class.<Type>method(...)\` is uncommon but appears in interviews and when inference is ambiguous.`,
      internal: `A generic method's type parameter is **scoped to that method** only — it shadows nothing and is independent of the class's parameters (a static method can be generic even in a non-generic class). Like all generics it's **erased** at runtime (§6.6): the compiler checks types and inserts casts, then \`<T>\` disappears. Inference uses the **argument types** and the **target type** (the variable/return it's assigned to) to deduce each parameter; ambiguity is what forces a type witness.`,
      useCases: `- **Generic utilities**: \`firstOf\`, \`swap\`, \`max\`, \`invert\`, \`toList\` helpers.
- **Static factory methods**: \`List.of\`, \`Optional.of\`, \`Collections.emptyList\`.
- **Type-preserving transforms**: \`T in → T out\`, \`Map<K,V> → Map<V,K>\`.
- **Bridging APIs** where the relationship between argument/return types must be expressed (often with bounds §6.4 or wildcards §6.5).`,
      code: `\`\`\`java
import java.util.*;

public class GenericMethodDemo {
    // generic static method: works for any type
    static <T> void swap(T[] arr, int i, int j) {
        T tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    // links two parameters and the return
    static <K,V> Map<V,K> invert(Map<K,V> in) {
        Map<V,K> out = new HashMap<>();
        in.forEach((k,v) -> out.put(v,k));
        return out;
    }
    public static void main(String[] args) {
        Integer[] nums = {1, 2, 3};
        swap(nums, 0, 2);
        System.out.println(Arrays.toString(nums));   // [3, 2, 1]

        Map<String,Integer> m = Map.of("a",1,"b",2);
        System.out.println(invert(m));               // {1=a, 2=b}

        // explicit type witness (rarely needed)
        List<String> empty = Collections.<String>emptyList();
        System.out.println(empty);                   // []
    }
}
\`\`\``,
      mistakes: `- **Putting \`<T>\` in the wrong place** — it must come **before the return type**, not after the method name.
- **Confusing a class type parameter with a method type parameter** — a static method needs its **own** \`<T>\` (§6.2).
- **Over-specifying** type witnesses when inference already works.
- **Expecting runtime knowledge of \`T\`** — erased; can't do \`new T()\`/\`T.class\` (§6.6).
- **Using a method type parameter that appears only once** where a **wildcard** would be simpler (§6.5).`,
      bestPractices: `- Use generic methods for **static utilities** and when you must **name** the type (multiple positions / linked types).
- Let **inference** do the work; add a **type witness** only when the compiler can't infer.
- If a type parameter appears **once** and you don't need to name it, prefer a **wildcard** (\`?\`) (§6.5) for a simpler signature.
- Add **bounds** (\`<T extends Comparable<T>>\`) when you must call methods on \`T\` (§6.4).
- Keep signatures readable; complex generic signatures are a smell.`,
      interview: `**Q1. What is a generic method?**
A method that declares its own type parameter(s) before the return type, e.g., \`public <T> T first(List<T> l)\`, usable independently of the class.

**Q2. Where do the type parameters go?**
Immediately before the return type: \`<T> ReturnType name(...)\`.

**Q3. Can a static method be generic in a non-generic class?**
Yes — it declares its own type parameter (a class's type parameter can't be used in statics).

**Q4. What is type inference / a type witness?**
Inference deduces type arguments from the call/target; a type witness (\`Class.<Type>method()\`) supplies them explicitly when inference fails.

**Q5. When prefer a generic method over a wildcard?**
When the type must be named/used in multiple positions or to relate argument and return types; a single-use type is often better as a wildcard (§6.5).

**Q6. Are generic methods erased too?**
Yes — like all generics, their type parameters are removed at runtime (§6.6).`,
      exercises: `1. Write a generic \`<T> T last(List<T> list)\` and use it for different element types.
2. Implement a generic \`swap(T[], i, j)\` and test on a \`String[]\` and \`Integer[]\`.
3. Write \`<K,V> Map<V,K> invert(Map<K,V>)\` and verify it.
4. Force a type witness with \`Collections.<Type>emptyList()\` and explain when it's needed.`,
      challenges: `Build a small generic utility class \`Utils\` with static methods \`firstOrDefault\`, \`map(List<T>, Function<T,R>) -> List<R>\`, and \`max(List<T extends Comparable<T>>)\` (introducing a bound — §6.4). Ensure each uses its own type parameters correctly, relies on inference, and works for several element types. Then identify which methods would read more simply with wildcards (§6.5) and explain the trade-off.`,
      summary: `- A **generic method** declares its **own type parameter(s) before the return type** (\`<T> T first(List<T>)\`), independent of the class.
- Ideal for **static utilities** and **linking** argument/return types; a static method can be generic even in a non-generic class.
- **Inference** usually supplies type arguments; use a **type witness** (\`Class.<T>method()\`) only when needed.
- Prefer a **wildcard (§6.5)** for single-use types; add **bounds (§6.4)** to call methods on \`T\`; erased at runtime (§6.6).`
    }),

    /* 6.4 Bounded Type Parameters. */
    topic({
      id: "bounded-types", chapter: "6.4", title: "Bounded Type Parameters",
      subtitle: "Constraining T with extends so you can actually use it.",
      readTime: "14 min", level: "Core", deep: true,
      objectives: [
        "Use upper bounds (\`<T extends Type>\`) to restrict and empower a type parameter.",
        "Apply multiple bounds (\`<T extends A & B>\`).",
        "Write recursive bounds (\`<T extends Comparable<T>>\`).",
        "Distinguish bounded type parameters from bounded wildcards (§6.5)."
      ],
      concept: `By default a type parameter \`T\` is treated as \`Object\`, so you can only call \`Object\` methods on it. A **bounded type parameter** constrains \`T\` to a supertype using **\`extends\`**, which (a) **restricts** which types are allowed and (b) **lets you call that supertype's methods** on \`T\`.

\`\`\`java
// without a bound, you can't call .doubleValue() on T
public static <T extends Number> double sum(List<T> nums) {
    double total = 0;
    for (T n : nums) total += n.doubleValue();   // OK — T is known to be a Number
    return total;
}

sum(List.of(1, 2, 3));        // T = Integer (a Number)  ✅
sum(List.of(1.5, 2.5));       // T = Double  ✅
// sum(List.of("a", "b"));    // ❌ String is not a Number
\`\`\`

\`extends\` here means "is a subtype of" and works for both classes and interfaces.`,
      why: `Unbounded \`T\` is too weak — it's just \`Object\`. Bounds make a type parameter **useful** while keeping it **safe**:

- **Enable operations** — \`T extends Comparable<T>\` lets you call \`compareTo\`; \`T extends Number\` lets you call \`doubleValue\`.
- **Restrict misuse** — reject types that don't make sense (only \`Number\`s in a numeric utility).
- **Express requirements** — the signature documents what \`T\` must support.

It's the difference between a generic method that can only store/return \`T\` and one that can actually *do something* with \`T\`.`,
      upperBounds: `An **upper bound** uses \`extends\` and may name a class and/or interfaces:

\`\`\`java
<T extends Number>                       // T is Number or a subclass
<T extends Comparable<T>>                // T can compare to itself
<T extends Shape>                        // T is Shape or a subtype
\`\`\`

> Note: in **bounds**, \`extends\` is used even for **interfaces** (there's no \`implements\` in generics). \`<T extends Runnable>\` means "T implements Runnable."`,
      multipleBounds: `A type parameter can have **multiple bounds** with \`&\`. If a **class** is among them, it must come **first**; interfaces follow:

\`\`\`java
<T extends Number & Comparable<T>>           // a comparable number
<T extends Animal & Serializable & Cloneable> // class first, then interfaces

public static <T extends Number & Comparable<T>> T maxOf(List<T> list) {
    T max = list.get(0);
    for (T x : list) if (x.compareTo(max) > 0) max = x;   // uses Comparable
    return max;                                            // and it's a Number too
}
\`\`\`

Now \`T\` is guaranteed to be both a \`Number\` and \`Comparable\`, so you can use methods from both.`,
      recursiveBounds: `**Recursive (self-referential) bounds** — \`<T extends Comparable<T>>\` — are extremely common: they require that \`T\` can be compared **to its own type**, which is exactly what sorting/min/max need:

\`\`\`java
public static <T extends Comparable<T>> T max(List<T> list) {
    T best = list.get(0);
    for (T x : list) if (x.compareTo(best) > 0) best = x;
    return best;
}
max(List.of(3, 1, 2));               // Integer is Comparable<Integer>  -> 3
max(List.of("a", "c", "b"));         // String is Comparable<String>    -> "c"
\`\`\`

This pattern appears throughout the JDK (e.g., \`Collections.max\`, \`Enum<E extends Enum<E>>\`).`,
      internal: `At compile time, a bounded \`T\` is checked against its bound; at runtime (type erasure §6.6) \`T\` is **replaced by its leftmost bound** rather than \`Object\`. So \`<T extends Number>\` erases \`T\` to **\`Number\`**, and the compiler inserts casts accordingly. This is also why bounds *enable* method calls: the erased type really is the bound, so calling \`Number\`/\`Comparable\` methods is valid bytecode. Bounded type parameters differ from **bounded wildcards** (§6.5): a *parameter* names a type you can use throughout a signature; a *wildcard* (\`? extends T\`) is an anonymous, use-site constraint.`,
      useCases: `- **Numeric utilities**: \`<T extends Number>\` for sums/averages.
- **Sorting/min/max**: \`<T extends Comparable<T>>\`.
- **Domain constraints**: \`<T extends Entity>\`, \`<T extends Event & Serializable>\`.
- **Builder/repository generics**: \`<ID extends Serializable>\`, \`<T extends Comparable<? super T>>\` (advanced ordering).`,
      code: `\`\`\`java
import java.util.*;

public class BoundedDemo {
    // upper bound: only Numbers
    static <T extends Number> double average(List<T> nums) {
        double sum = 0;
        for (T n : nums) sum += n.doubleValue();
        return nums.isEmpty() ? 0 : sum / nums.size();
    }
    // recursive bound: any self-comparable type
    static <T extends Comparable<T>> T max(List<T> list) {
        T best = list.get(0);
        for (T x : list) if (x.compareTo(best) > 0) best = x;
        return best;
    }
    // multiple bounds
    static <T extends Number & Comparable<T>> T clampToMax(List<T> list, T cap) {
        T m = max(list);
        return m.compareTo(cap) > 0 ? cap : m;
    }
    public static void main(String[] args) {
        System.out.println(average(List.of(1, 2, 3, 4)));   // 2.5
        System.out.println(max(List.of("a", "c", "b")));    // c
        System.out.println(clampToMax(List.of(3, 9, 5), 7));// 7
    }
}
\`\`\``,
      mistakes: `- **Forgetting a bound** then trying to call type-specific methods on \`T\` — won't compile (T is \`Object\`).
- **Using \`implements\` in a bound** — generics use \`extends\` even for interfaces.
- **Wrong order in multiple bounds** — the class (if any) must come **first**, then interfaces.
- **Confusing \`<T extends Number>\` (bounded parameter) with \`<? extends Number>\` (bounded wildcard, §6.5).**
- **Over-constraining** — adding bounds you don't actually use complicates the API.`,
      bestPractices: `- Add an **upper bound** only when you need to **call methods** on \`T\` or restrict valid types.
- Use \`<T extends Comparable<T>>\` (or \`<T extends Comparable<? super T>>\` for flexibility) for ordering.
- For multiple capabilities, use **\`&\`** with the **class first**.
- Prefer a **named bounded parameter** when the type is used in multiple places; prefer a **wildcard** (§6.5) for single-use, read/write-only positions.
- Keep bounds minimal and meaningful — they're part of your API contract.`,
      interview: `**Q1. What is a bounded type parameter?**
A type parameter constrained with \`extends\` (e.g., \`<T extends Number>\`) that restricts allowed types and lets you call the bound's methods on \`T\`.

**Q2. Why use \`extends\` for interfaces in bounds?**
Generics use \`extends\` uniformly for both classes and interfaces; there's no \`implements\` keyword in bounds.

**Q3. How do multiple bounds work and what's the ordering rule?**
\`<T extends A & B & C>\`; if a class is included it must be listed first, followed by interfaces.

**Q4. What does \`<T extends Comparable<T>>\` mean?**
A recursive bound requiring \`T\` to be comparable to its own type — needed for sorting/min/max.

**Q5. What does a bounded T erase to at runtime?**
Its leftmost bound (e.g., \`Number\`), not \`Object\` (§6.6).

**Q6. Bounded type parameter vs bounded wildcard?**
A parameter names a reusable type with a bound; a wildcard (\`? extends T\`) is an anonymous use-site bound (§6.5).`,
      exercises: `1. Write \`<T extends Number> double sum(List<T>)\` and test with Integers and Doubles.
2. Write \`<T extends Comparable<T>> T min(List<T>)\`.
3. Use a multiple bound \`<T extends Number & Comparable<T>>\` in a method and explain the ordering rule.
4. Show the compile error when calling \`compareTo\` on an unbounded \`T\`, then fix it with a bound.`,
      challenges: `Implement a generic \`Range<T extends Comparable<T>>\` class with \`contains(T)\`, \`clamp(T)\`, and \`overlaps(Range<T>)\`, relying on the recursive bound to compare values. Then write a static \`<T extends Number & Comparable<T>> Stats<T> analyze(List<T>)\` returning min/max/sum. Explain how erasure replaces \`T\` with its leftmost bound and why that's what makes the \`compareTo\`/\`doubleValue\` calls valid.`,
      summary: `- A **bounded type parameter** (\`<T extends Bound>\`) both **restricts** allowed types and **enables** calling the bound's methods on \`T\`.
- Bounds use **\`extends\`** for classes *and* interfaces; **multiple bounds** use \`&\` with the **class first**.
- **Recursive bounds** (\`<T extends Comparable<T>>\`) power sorting/min/max; \`T\` erases to its **leftmost bound** (§6.6).
- Distinct from **bounded wildcards (§6.5)**: named reusable type vs anonymous use-site constraint.`
    }),

    /* ===================== ADVANCED ===================== */

    /* 6.5 Wildcards & PECS. */
    topic({
      id: "wildcards", chapter: "6.5", title: "Wildcards & PECS",
      subtitle: "?, ? extends, ? super — flexible APIs and the Producer-Extends-Consumer-Super rule.",
      readTime: "18 min", level: "Advanced", deep: true,
      objectives: [
        "Explain why generics are invariant and how wildcards add flexibility.",
        "Use unbounded (\`?\`), upper-bounded (\`? extends\`), and lower-bounded (\`? super\`) wildcards.",
        "Apply the PECS rule (Producer Extends, Consumer Super).",
        "Know the read/write restrictions each wildcard imposes."
      ],
      concept: `**Wildcards** (\`?\`) represent an **unknown type** in a parameterised type, making generic APIs flexible. They exist because Java generics are **invariant**: \`List<String>\` is **not** a subtype of \`List<Object>\`, even though \`String\` is a subtype of \`Object\`. Without wildcards, a method taking \`List<Object>\` couldn't accept a \`List<String>\`.

\`\`\`java
// invariance: this does NOT compile
// List<Object> objs = new ArrayList<String>();   // ❌

// wildcard makes a flexible parameter:
static void printAll(List<?> list) {              // accepts List of ANY type
    for (Object o : list) System.out.println(o);
}
printAll(List.of("a","b"));   // ✅
printAll(List.of(1, 2, 3));   // ✅
\`\`\`

There are three flavours: **\`?\`** (unbounded), **\`? extends T\`** (upper-bounded), **\`? super T\`** (lower-bounded).`,
      why: `Invariance is **safe** but **rigid**. If \`List<String>\` *were* a \`List<Object>\`, you could add an \`Integer\` to it through the \`Object\` view and corrupt it. So Java forbids that — and **wildcards** give back flexibility *without* breaking safety, by limiting what you can do:

- \`? extends T\` — "some subtype of T" → safe to **read** (you get a \`T\`), unsafe to write.
- \`? super T\` — "some supertype of T" → safe to **write** a \`T\`, reads come back as \`Object\`.
- \`?\` — "any type" → read as \`Object\`, can't write (except \`null\`).

This is the key to writing methods that work across many parameterisations.`,
      invariance: `**Invariance, covariance, contravariance** (the theory behind wildcards):

| Concept | Meaning | In Java |
|---|---|---|
| **Invariant** | \`List<String>\` ≠ \`List<Object>\` | default for generic types |
| **Covariant** | accept subtypes (read) | \`List<? extends Number>\` |
| **Contravariant** | accept supertypes (write) | \`List<? super Integer>\` |

\`\`\`java
List<? extends Number> nums = new ArrayList<Integer>();  // ✅ covariant (read Numbers)
List<? super Integer> sink  = new ArrayList<Number>();   // ✅ contravariant (write Integers)
\`\`\`

(Arrays, by contrast, are **covariant** — \`Object[] a = new String[1]\` compiles but can throw \`ArrayStoreException\` at runtime, a hole generics deliberately avoid — §6.7.)`,
      pecs: `**PECS — "Producer Extends, Consumer Super"** — the rule for choosing a wildcard (the single most-asked generics interview point):

- If a parameter **produces** values you read out → use **\`? extends T\`**.
- If a parameter **consumes** values you put in → use **\`? super T\`**.
- If it does **both** (or neither matters) → use an exact type or unbounded \`?\`.

\`\`\`java
// copy: src PRODUCES (read), dest CONSUMES (write)
static <T> void copy(List<? extends T> src, List<? super T> dest) {
    for (T item : src) dest.add(item);
}

List<Integer> ints = List.of(1, 2, 3);
List<Number>  nums = new ArrayList<>();
copy(ints, nums);   // read Integers (extends), write into Numbers (super)  ✅
\`\`\`

The JDK's \`Collections.copy\`, \`addAll\`, and \`Comparator\` (\`Comparable<? super T>\`) all follow PECS.`,
      readWriteRules: `**What each wildcard lets you do — the crucial restrictions:**

| Wildcard | Read (get) | Write (add) |
|---|---|---|
| \`List<?>\` | as \`Object\` | only \`null\` |
| \`List<? extends T>\` | as \`T\` ✅ | **nothing** (can't add, even a T) |
| \`List<? super T>\` | as \`Object\` | a \`T\` (or subtype) ✅ |

\`\`\`java
List<? extends Number> producer = List.of(1, 2, 3);
Number n = producer.get(0);     // ✅ read as Number
// producer.add(4);             // ❌ can't add — unknown exact subtype

List<? super Integer> consumer = new ArrayList<Number>();
consumer.add(42);               // ✅ write an Integer
Object o = consumer.get(0);     // reads come back as Object
\`\`\`

Why \`? extends\` can't add: the list might really be \`List<Double>\`, so adding an \`Integer\` would be unsafe — the compiler forbids it.`,
      internal: `Wildcards are a **compile-time** type-system feature (erased at runtime like all generics, §6.6). The compiler uses **capture conversion** to give the unknown type a temporary internal name when reasoning about it, which is why you sometimes see \`capture of ?\` in error messages. Wildcards differ from **type parameters** (§6.3/§6.4): a wildcard is **anonymous and use-site** (great when you don't need to name the type), whereas a type parameter is **named and reusable** across a signature (use it when the same type appears in multiple positions or links input to output).`,
      useCases: `- **Flexible collection parameters**: \`printAll(Collection<?>)\`, \`sum(List<? extends Number>)\`.
- **PECS APIs**: \`copy\`, \`addAll(Collection<? extends E>)\`, \`forEach\`.
- **Comparators**: \`Comparator<? super T>\` so a \`Comparator<Object>\` can sort \`List<String>\` (Module 5 §5.4).
- **Read-only or write-only views** that must accept many parameterisations.`,
      code: `\`\`\`java
import java.util.*;

public class WildcardDemo {
    // producer: read-only, accepts List of Number or any subtype
    static double total(List<? extends Number> nums) {
        double sum = 0;
        for (Number n : nums) sum += n.doubleValue();   // read as Number
        return sum;
    }
    // consumer: write Integers into a List of Integer or any supertype
    static void fill(List<? super Integer> sink, int count) {
        for (int i = 0; i < count; i++) sink.add(i);    // write Integers
    }
    public static void main(String[] args) {
        System.out.println(total(List.of(1, 2, 3)));        // 6.0  (Integers)
        System.out.println(total(List.of(1.5, 2.5)));       // 4.0  (Doubles)

        List<Number> sink = new ArrayList<>();
        fill(sink, 3);                                       // [0, 1, 2]
        System.out.println(sink);
    }
}
\`\`\``,
      mistakes: `- **Trying to add to a \`? extends T\` collection** — illegal (only \`null\`); it's read-only for elements.
- **Expecting typed reads from \`? super T\`** — reads come back as \`Object\`.
- **Assuming covariance of generics** — \`List<String>\` is *not* a \`List<Object>\` (use a wildcard).
- **Getting PECS backwards** — producers use \`extends\`, consumers use \`super\`.
- **Using a wildcard when you must name the type** — if \`T\` appears in multiple positions/return, use a type parameter (§6.3).
- **Over-using bounded wildcards** in return types — generally avoid wildcards in returns (they leak into callers).`,
      bestPractices: `- Apply **PECS**: \`? extends T\` for producers (read), \`? super T\` for consumers (write).
- Use **wildcards for flexibility** in parameters; use **type parameters** when the type is named/linked (§6.3).
- **Don't return** wildcard types from public methods (they force awkward casts on callers).
- Use unbounded \`?\` for "any type, read as Object" parameters (\`printAll(Collection<?>)\`).
- Remember \`Comparator<? super T>\` / \`Comparable<? super T>\` for maximally flexible ordering APIs (Module 5).`,
      interview: `**Q1. Why are Java generics invariant, and how do wildcards help?**
To prevent unsafe writes (e.g., adding an Integer to a List<String> via a List<Object> view); wildcards restore flexibility safely by restricting reads/writes.

**Q2. What is PECS?**
Producer Extends, Consumer Super: use \`? extends T\` for things you read from, \`? super T\` for things you write to.

**Q3. Can you add to a \`List<? extends Number>\`?**
No (except \`null\`) — the exact subtype is unknown, so adding would be unsafe; you can only read (as \`Number\`).

**Q4. What can you do with \`List<? super Integer>\`?**
Add Integers (and subtypes); reads come back as \`Object\`.

**Q5. \`List<?>\` vs \`List<Object>\`?**
\`List<?>\` is "list of some unknown type" (read as Object, can't add); \`List<Object>\` is specifically a list of Objects (can add anything) — and a \`List<String>\` is neither's subtype except via \`?\`.

**Q6. Wildcard vs type parameter — when to use which?**
Wildcard for single-use, anonymous, parameter-position flexibility; type parameter when you must name the type or use it in multiple positions/return.`,
      exercises: `1. Write \`sum(List<? extends Number>)\` and call it with \`List<Integer>\` and \`List<Double>\`.
2. Write \`addNumbers(List<? super Integer>)\` and call it with a \`List<Number>\` and \`List<Object>\`.
3. Show the compile error when adding to a \`? extends\` list, and reading typed values from a \`? super\` list.
4. Implement a PECS \`copy(src, dest)\` and test it.`,
      challenges: `Implement a generic \`merge\` utility: \`<T> void drainInto(List<? extends T> source, Collection<? super T> target)\` plus \`<T extends Comparable<? super T>> T maxOf(Collection<? extends T> c)\`. Explain, for each wildcard, why PECS dictates \`extends\` vs \`super\`, what reads/writes are allowed, and why \`Comparable<? super T>\` is more flexible than \`Comparable<T>\`. Then convert one wildcard signature to a type-parameter version and discuss which reads better.`,
      summary: `- Generics are **invariant**; **wildcards** (\`?\`, \`? extends T\`, \`? super T\`) add safe flexibility.
- **PECS**: **P**roducer **E**xtends (read as T, can't add), **C**onsumer **S**uper (add T, read as Object).
- Use wildcards for **anonymous, single-use** parameter flexibility; **type parameters (§6.3/§6.4)** when the type is named/linked; avoid wildcard return types.
- Wildcards are compile-time only (**erased**, §6.6); \`Comparator/Comparable<? super T>\` are classic PECS in the JDK (Module 5).`
    }),

    /* 6.6 Type Erasure. */
    topic({
      id: "type-erasure", chapter: "6.6", title: "Type Erasure",
      subtitle: "How generics vanish at runtime — and the consequences.",
      readTime: "16 min", level: "Advanced", deep: true,
      objectives: [
        "Explain what type erasure is and why Java uses it.",
        "Describe how the compiler erases type parameters and inserts casts/bridges.",
        "List the runtime restrictions erasure causes.",
        "Reason about what is and isn't known about generics at runtime."
      ],
      concept: `**Type erasure** is the mechanism by which the compiler **removes generic type information after compilation**. Generics exist for the **compiler** (type checking) but are **not present at runtime** — the JVM sees raw types. \`List<String>\`, \`List<Integer>\`, and \`List<?>\` are all just **\`List\`** at runtime.

\`\`\`java
List<String> a = new ArrayList<>();
List<Integer> b = new ArrayList<>();
System.out.println(a.getClass() == b.getClass());  // true — both are ArrayList at runtime
\`\`\`

The type arguments are "erased" to the parameter's **bound** (or \`Object\` if unbounded), and the compiler inserts the casts you'd otherwise write.`,
      why: `Java chose erasure for **backward compatibility** when generics arrived in Java 5: existing pre-generics \`.class\` files and libraries (raw \`List\`, etc.) had to keep working, and generic code had to interoperate with them. Erasure means generic and non-generic code share the **same bytecode/types**, so a \`List<String>\` is binary-compatible with old code expecting a raw \`List\`. The trade-off: generics are a **compile-time fiction** with several **runtime limitations** (below). (Languages like C# reify generics instead, keeping type info at runtime — a common comparison.)`,
      howItWorks: `**What the compiler does during erasure:**

1. **Replaces type parameters** with their **leftmost bound**, or **\`Object\`** if unbounded:
   - \`<T>\` → \`Object\`; \`<T extends Number>\` → \`Number\`.
2. **Inserts casts** wherever you read a generic value, so the code is type-correct.
3. **Generates bridge methods** to preserve polymorphism after erasure (when a subclass overrides a generic method).

\`\`\`java
// you write:
class Box<T> { T val; T get(){ return val; } }
String s = new Box<String>().get();

// after erasure (conceptually):
class Box { Object val; Object get(){ return val; } }
String s = (String) new Box().get();   // compiler-inserted cast
\`\`\``,
      restrictions: `**Runtime restrictions caused by erasure (interview gold):**

| You CANNOT... | Because... |
|---|---|
| \`new T()\` | the runtime type of \`T\` is unknown |
| \`new T[n]\` | can't create arrays of a non-reifiable type |
| \`x instanceof List<String>\` | only the raw \`List\` is known at runtime |
| \`List<String>.class\` | there's one \`List.class\`, not one per parameter |
| have two overloads \`f(List<String>)\` & \`f(List<Integer>)\` | they erase to the same signature \`f(List)\` |
| use a type parameter in a \`static\` field/context | erasure leaves no per-instantiation \`T\` (§6.2) |
| catch a generic exception type | exceptions must be reifiable |

\`\`\`java
// if (list instanceof List<String>) {}   // ❌ compile error
if (list instanceof List<?>) {}            // ✅ unbounded wildcard is allowed
\`\`\``,
      internal: `**Bridge methods** deserve a note: when a class implements a generic interface, erasure can change a method's signature, so the compiler synthesises a **bridge method** to keep overriding working:

\`\`\`java
class MyComparable implements Comparable<MyComparable> {
    public int compareTo(MyComparable o) { return 0; }
}
// erasure also generates: public int compareTo(Object o) { return compareTo((MyComparable)o); }
\`\`\`

This bridge (\`compareTo(Object)\`) lets polymorphic calls through the raw \`Comparable\` interface dispatch to your typed method. You'll occasionally see bridge methods in stack traces or reflection — they're compiler-generated, not yours. **Reflection** can still read *declared* generic types via \`getGenericType()\`/\`getGenericSuperclass()\` (the info is kept in class metadata for declarations), but **instances** carry no type-argument info.`,
      useCases: `- **Understanding compile errors** like "cannot create a generic array" or "instanceof unchecked".
- **Working around erasure**: pass a **\`Class<T>\` token** (\`getInstance(Class<T> type)\`) or a **\`Supplier<T>\`** to do what \`new T()\` can't.
- **Explaining** why you can't overload on \`List<String>\` vs \`List<Integer>\`.
- **Reflection/serialization libraries** that capture generic types via super-type tokens (e.g., \`TypeReference\`).`,
      code: `\`\`\`java
import java.util.*;

public class ErasureDemo {
    // work around 'no new T()' with a Class token
    static <T> T create(Class<T> type) throws Exception {
        return type.getDeclaredConstructor().newInstance();
    }
    public static void main(String[] args) throws Exception {
        // proof of erasure
        List<String> a = new ArrayList<>();
        List<Integer> b = new ArrayList<>();
        System.out.println(a.getClass() == b.getClass());  // true

        // allowed vs not
        System.out.println(a instanceof List);             // true
        System.out.println(a instanceof List<?>);          // true
        // System.out.println(a instanceof List<String>);  // ❌ won't compile

        // Class-token workaround
        StringBuilder sb = create(StringBuilder.class);
        System.out.println(sb.append("works"));            // works
    }
}
\`\`\``,
      mistakes: `- **Expecting \`new T()\`/\`new T[]\` to work** — use \`Class<T>\`/\`Supplier<T>\`/\`Object[]\` casts.
- **\`instanceof\` with a concrete type argument** — only \`instanceof List<?>\` (or raw) is allowed.
- **Overloading on different parameterisations** — they erase to one signature (compile error).
- **Assuming an object knows its type arguments at runtime** — it doesn't; only declarations retain them (reflection).
- **Creating generic arrays** directly — \`new List<String>[10]\` is illegal (heap pollution risk, §6.7).
- **Catching/throwing a parameterised exception type** — not allowed.`,
      bestPractices: `- Internalise that generics are **compile-time only**; design APIs that don't need runtime \`T\`.
- Pass a **\`Class<T>\` token** or **factory/\`Supplier<T>\`** when you need to instantiate or reflect on \`T\`.
- Use **\`List<?>\`** for runtime type checks, never a concrete argument.
- Prefer **collections over generic arrays** to avoid array-creation and heap-pollution issues (§6.7).
- Treat **unchecked warnings** seriously — they flag places where erasure removed safety (§6.7).`,
      interview: `**Q1. What is type erasure?**
The compiler removes generic type information after type-checking, replacing type parameters with their bound (or \`Object\`) and inserting casts; the JVM sees raw types.

**Q2. Why does Java use erasure?**
For backward compatibility with pre-generics (Java 1.4) code and libraries — generic and legacy code share the same bytecode.

**Q3. Name restrictions caused by erasure.**
No \`new T()\`/\`new T[]\`, no \`instanceof\` with a concrete type argument, no overloading on different parameterisations, no static use of a class's \`T\`, no parameterised exception types.

**Q4. \`new ArrayList<String>().getClass() == new ArrayList<Integer>().getClass()\`?**
True — both erase to \`ArrayList\`.

**Q5. What are bridge methods?**
Compiler-generated methods that preserve polymorphism after erasure when overriding generic methods (e.g., a \`compareTo(Object)\` delegating to the typed one).

**Q6. How do you work around 'no new T()'?**
Pass a \`Class<T>\` token (\`type.getDeclaredConstructor().newInstance()\`) or a \`Supplier<T>\`.

**Q7. Is any generic info available at runtime?**
For *declarations* (fields, superclass, method signatures) via reflection — but not for *instances*' type arguments.`,
      exercises: `1. Prove erasure: show two differently-parameterised lists share the same \`getClass()\`.
2. Demonstrate the allowed \`instanceof List<?>\` vs the illegal \`instanceof List<String>\`.
3. Work around \`new T()\` using a \`Class<T>\` token and a \`Supplier<T>\`.
4. Show that you can't overload \`m(List<String>)\` and \`m(List<Integer>)\` and explain why.`,
      challenges: `Implement a generic \`Cache<K,V>\` that, on a miss, must construct a default \`V\` — solve the "no \`new V()\`" problem two ways: a \`Supplier<V>\` factory and a \`Class<V>\` token via reflection. Then write a "super type token" (\`abstract class TypeRef<T> {}\` capturing \`getGenericSuperclass()\`) to recover a generic type at runtime, and explain exactly what erasure does and does not remove (declarations vs instances).`,
      summary: `- **Type erasure** removes generic type info at compile time: parameters → **leftmost bound/\`Object\`**, casts inserted, **bridge methods** added; the JVM sees **raw types**.
- Chosen for **backward compatibility**; generics are a **compile-time** feature with **no runtime overhead**.
- Restrictions: **no \`new T()\`/\`T[]\`**, **no \`instanceof T<...>\`**, **no overload by parameterisation**, **no static \`T\`** (§6.2), no parameterised exceptions.
- Work around with **\`Class<T>\`/\`Supplier<T>\`**; declarations (not instances) keep generic info for reflection. Pitfalls follow in **§6.7**.`
    }),

    /* 6.7 Restrictions, Pitfalls & Best Practices — capstone. */
    topic({
      id: "generics-best-practices", chapter: "6.7", title: "Restrictions, Pitfalls & Best Practices",
      subtitle: "Capstone — the rules, traps, and habits for safe, clean generics.",
      readTime: "16 min", level: "Advanced", deep: true,
      objectives: [
        "Consolidate the runtime restrictions generics impose.",
        "Avoid common pitfalls: raw types, unchecked warnings, generic-array creation, heap pollution.",
        "Apply best practices for safe, readable generic code.",
        "Tie together type safety, erasure (§6.6), bounds (§6.4), and wildcards (§6.5)."
      ],
      concept: `This capstone turns the module into **rules and habits**. Generics give compile-time safety, but **type erasure** (§6.6) imposes real limits, and a few patterns repeatedly trip people up. Mastering generics for interviews and production means knowing the restrictions cold and the idioms that work around them safely.`,
      restrictions: `**The full restriction list (mostly consequences of erasure §6.6):**

| Restriction | Reason | Work-around |
|---|---|---|
| No **primitive** type arguments (\`List<int>\`) | generics work on objects | use wrappers (\`List<Integer>\`) + autoboxing |
| No **\`new T()\`** | runtime type unknown | \`Supplier<T>\` / \`Class<T>\` factory |
| No **\`new T[]\`** / generic array creation | non-reifiable type | \`(T[]) new Object[n]\` (with care) or \`ArrayList<T>\` |
| No **\`instanceof T\`** / \`T<...>\` | erased at runtime | \`instanceof List<?>\` or pass \`Class<T>\` |
| No **static field** of type \`T\` | shared across instantiations | make the method generic instead |
| No **two overloads** differing only by type argument | same erased signature | rename methods |
| No **generic exception** classes / catch | exceptions must be reifiable | use a non-generic exception |
| No **\`T.class\`** | one class per raw type | pass \`Class<T>\` token |`,
      pitfalls: `**Common pitfalls and how to avoid them:**

1. **Raw types** (§6.1) — \`List list = ...\` disables checking. *Always parameterise.*
2. **Unchecked warnings** — the compiler telling you safety was lost; investigate, don't ignore. Suppress with \`@SuppressWarnings("unchecked")\` **only** on the smallest scope, with a comment justifying why it's safe.
3. **Generic array creation / heap pollution** — mixing arrays (covariant, reified) with generics (invariant, erased) is dangerous:

\`\`\`java
// List<String>[] arr = new List<String>[10];   // ❌ generic array creation
List<String>[] arr = (List<String>[]) new List[10];  // compiles with a warning — risky
\`\`\`

   This can cause **heap pollution** (a variable of a parameterised type refers to an object of a different parameterisation), surfacing as a surprise \`ClassCastException\` later. Prefer \`List<List<String>>\` over arrays of generics.
4. **\`@SafeVarargs\`** — generic varargs (\`method(T... args)\`) create a hidden generic array → heap-pollution warning. Annotate with \`@SafeVarargs\` only if the method truly doesn't write to or leak the array.
5. **Getting PECS backwards** (§6.5) — producers \`extends\`, consumers \`super\`.`,
      bestPractices: `**The interview-ready best-practices checklist:**

- **Never use raw types**; always parameterise and use the **diamond \`<>\`** (§6.1).
- **Eliminate unchecked warnings**; if unavoidable, **\`@SuppressWarnings("unchecked")\`** on the narrowest scope with a justifying comment (*Effective Java* Item 27).
- **Prefer \`List<T>\` over \`T[]\`** — lists are typesafe; generic arrays aren't (Item 28).
- **Favour generic types and methods** for reusable, typesafe APIs (Items 29–30).
- **Use bounded wildcards (PECS)** to make APIs flexible (Item 31); **don't return** wildcard types.
- **Use a bound (§6.4)** only when you need to call the bound's methods.
- **Don't mix arrays and generics**; annotate safe generic varargs with **\`@SafeVarargs\`** (Item 32).
- Keep signatures **readable** — deeply nested generics are a design smell.`,
      whyItMatters: `**Why these habits matter:** generics push errors from **runtime to compile time**, but only if you don't undermine them with raw types, ignored warnings, or array/generic mixing. Each pitfall above reintroduces exactly the kind of \`ClassCastException\` generics were designed to prevent (§6.1). Following the checklist keeps that safety intact while keeping APIs flexible (wildcards §6.5) and reusable (generic types/methods §6.2/§6.3).`,
      internal: `Most restrictions trace directly to **erasure** (§6.6): no runtime \`T\` ⇒ no \`new T()\`, \`T[]\`, \`T.class\`, or \`instanceof T<...>\`; one erased signature ⇒ no overload-by-parameterisation; no per-instantiation type ⇒ no static \`T\`. **Reifiable** types (those whose type info is fully available at runtime — primitives, non-generic types, raw types, unbounded wildcards \`List<?>\`, arrays of reifiable types) are exactly the ones allowed in \`instanceof\` and array creation; **non-reifiable** parameterised types are not. This reifiable/non-reifiable split is the conceptual key that ties all the restrictions together.`,
      useCases: `- **Reviewing/auditing** code for raw types, unchecked warnings, and generic-array misuse.
- **Designing library APIs**: generic types/methods + PECS wildcards + minimal bounds.
- **Explaining in interviews** why a given generic operation is illegal and how to work around it.
- **Safe varargs** utilities (\`List.of\`, \`Arrays.asList\` style) with \`@SafeVarargs\`.`,
      code: `\`\`\`java
import java.util.*;

public class GenericsPitfalls {
    // ❌ raw type (don't do this)
    // List bad = new ArrayList();

    // ✅ safe, minimal @SuppressWarnings on the narrowest scope
    @SuppressWarnings("unchecked")
    static <T> T[] toArray(List<T> list, T[] proto) {
        return list.toArray(proto);   // safe: proto carries the runtime type
    }

    // ✅ safe generic varargs
    @SafeVarargs
    static <T> List<T> listOf(T... items) {
        return new ArrayList<>(Arrays.asList(items)); // doesn't store/leak the array
    }

    public static void main(String[] args) {
        List<String> names = listOf("a", "b", "c");
        String[] arr = toArray(names, new String[0]);
        System.out.println(Arrays.toString(arr));     // [a, b, c]
        // prefer List<List<String>> over List<String>[] to avoid heap pollution
        List<List<String>> safe = new ArrayList<>();
        safe.add(names);
        System.out.println(safe);
    }
}
\`\`\``,
      mistakes: `- **Raw types** and **ignored unchecked warnings** — the two most common ways to silently lose type safety.
- **Creating arrays of generics** / careless casts → **heap pollution** and delayed \`ClassCastException\`.
- **Blanket \`@SuppressWarnings("unchecked")\`** on whole methods/classes instead of the narrowest scope.
- **Unannotated generic varargs** (or \`@SafeVarargs\` on a method that *does* leak the array).
- **Trying erasure-forbidden operations** (\`new T()\`, \`instanceof List<String>\`, static \`T\`) instead of the known work-arounds.
- **Over-engineering** with unnecessary type parameters/bounds/wildcards, hurting readability.`,
      interview: `**Q1. Why can't you create a generic array directly?**
Arrays are reified/covariant while generics are erased/invariant; allowing \`new T[]\` would break runtime type safety (heap pollution), so it's forbidden.

**Q2. What is heap pollution?**
When a variable of a parameterised type refers to an object that isn't of that parameterisation — typically via raw types or generic arrays — surfacing later as a \`ClassCastException\`.

**Q3. When is \`@SuppressWarnings("unchecked")\` acceptable?**
On the narrowest possible scope, only when you've verified the operation is truly typesafe, with a justifying comment.

**Q4. What does \`@SafeVarargs\` do?**
Suppresses the heap-pollution warning for generic varargs methods that don't write to or expose the implicitly-created array.

**Q5. Why can't a static field use the class's type parameter?**
Statics are shared across all instantiations; erasure leaves no single \`T\` (§6.2).

**Q6. List vs array for generics — which and why?**
Prefer \`List<T>\` — it's typesafe; generic arrays aren't and invite heap pollution.

**Q7. What makes a type reifiable?**
Its full type info is available at runtime (primitives, non-generic/raw types, \`List<?>\`, arrays of reifiable types) — these are allowed in \`instanceof\`/array creation; parameterised types are non-reifiable.`,
      exercises: `1. Audit a snippet and fix raw types, an ignored unchecked warning, and a generic-array creation.
2. Demonstrate heap pollution via a raw type and show the eventual \`ClassCastException\`.
3. Write a correct \`@SafeVarargs\` generic varargs method and explain why it's safe.
4. List five erasure-driven restrictions and give the work-around for each.`,
      challenges: `Refactor a deliberately unsafe generic utility class (raw types, suppressed warnings everywhere, a \`List<String>[]\` field, an unsafe varargs method) into clean, typesafe code: parameterise everything, replace the generic array with \`List<List<String>>\`, scope \`@SuppressWarnings\` minimally with justifications, and annotate safe varargs. Write a short rationale connecting each fix to type safety (§6.1), erasure (§6.6), bounds (§6.4), and PECS (§6.5) — the capstone synthesis of the module.`,
      summary: `- Generics' runtime limits come from **erasure (§6.6)**: no primitives, \`new T()\`, \`T[]\`, \`instanceof T<...>\`, static \`T\`, overload-by-parameterisation, or generic exceptions — each with a known work-around (\`Class<T>\`/\`Supplier<T>\`/wrappers).
- Avoid **raw types**, **ignored unchecked warnings**, and **generic arrays** (heap pollution); scope \`@SuppressWarnings\` narrowly; use \`@SafeVarargs\` correctly.
- Best practice: parameterise everything, **prefer \`List<T>\` over arrays**, favour generic types/methods, apply **PECS wildcards (§6.5)** and minimal **bounds (§6.4)**, keep signatures readable.
- The **reifiable vs non-reifiable** distinction unifies the restrictions — this capstone ties §6.1–§6.6 together.`
    })
  ]
});
