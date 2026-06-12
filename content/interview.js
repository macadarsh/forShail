/* Section: Interview Preparation — edit ONLY this file.
   Each chapter is a question bank built with qbank({...}). Categories
   become the section headings (and the right-hand "In this article"
   panel). Questions are numbered continuously within each chapter, and
   every chapter has its own independent set + numbering.

   Per question: { q: "...", a: "..." } — `a` is Markdown (escape every
   backtick as \` inside these JS template strings). Keep answers ~2-4
   lines; longer where the topic needs it.

   This is the DEMO scaffold: 3 categories × 5 questions per chapter.
   Grow each category toward its full target (300 / 100 / 100 / 50 / …). */

registerSection({
  id: "interview",
  module: "Interview Preparation",
  page: "interview-prep.html",
  icon: "🎯",
  tagline: "Question banks and patterns for service and product companies.",
  lessons: [

    /* ===========================================================
       Q1 · 300 Core Java Questions
       Headings mirror the learning module names (per course design).
       =========================================================== */
    qbank({
      id: "core-java", chapter: "Q1", title: "300 Core Java Questions",
      subtitle: "Fundamentals, OOP, memory, and collections — the bread-and-butter of every Java round.",
      icon: "☕", tag: "Demo: 15 of 300", level: "Q-Bank",
      categories: [
        { id: "java-fundamentals", heading: "Java Fundamentals", questions: [
          { q: "Why is Java platform independent?",
            a: "Java source compiles to **bytecode** (\`.class\`), not native machine code. The platform-specific **JVM** then interprets/JIT-compiles that bytecode at runtime, so the same \`.class\` file runs on any OS with a compatible JVM — the \"write once, run anywhere\" promise." },
          { q: "Difference between JDK, JRE, and JVM?",
            a: "The **JVM** executes bytecode and manages memory. The **JRE** = JVM + core libraries, enough to *run* applications. The **JDK** = JRE + development tools (\`javac\`, \`jar\`, debugger), needed to *compile and build*." },
          { q: "Is Java a pure object-oriented language?",
            a: "No. It supports OOP but keeps eight **primitive types** (\`int\`, \`char\`, \`boolean\`, …) that aren't objects, plus static members. A pure OO language treats everything as an object." },
          { q: "What is the difference between \`==\` and \`.equals()\`?",
            a: "\`==\` compares **references** — whether two variables point to the same object. \`.equals()\` compares **logical value** and can be overridden; e.g. \`String.equals()\` compares characters, while \`==\` can be \`false\` for two equal but distinct \`String\` objects." },
          { q: "Explain autoboxing and unboxing.",
            a: "**Autoboxing** auto-converts a primitive to its wrapper (\`int\` → \`Integer\`); **unboxing** reverses it. It lets primitives flow through generics/collections, but unboxing a \`null\` wrapper throws \`NullPointerException\`, and it adds hidden allocation cost in tight loops." },
        ]},
        { id: "oop", heading: "Object-Oriented Programming", questions: [
          { q: "Method overloading vs overriding?",
            a: "**Overloading**: same method name, different parameter lists, resolved at compile time (static binding). **Overriding**: a subclass redefines a superclass method with the same signature, resolved at runtime (dynamic dispatch). Overloading is polymorphism within a class; overriding is across inheritance." },
          { q: "Abstract class vs interface — when do you use each?",
            a: "An **abstract class** can hold state, constructors, and a mix of concrete and abstract methods; a class extends only one. An **interface** is a contract — since Java 8 it allows \`default\`/\`static\` methods and a class can implement many. Use interfaces for *capability*, abstract classes for *shared base behavior*." },
          { q: "What is the \`super\` keyword used for?",
            a: "\`super\` references the immediate parent class: call the parent constructor (\`super(...)\`), invoke an overridden parent method (\`super.method()\`), or access a hidden parent field. \`super(...)\` must be the first statement in a constructor." },
          { q: "Can you override a static method?",
            a: "No — this is **method hiding**, not overriding. Static methods belong to the class, not instances, so the version called depends on the *reference type* at compile time, not the runtime object. There is no dynamic dispatch." },
          { q: "What is the diamond problem and how does Java avoid it?",
            a: "When a class inherits the same member through two paths, ambiguity arises. Java avoids it for classes via **single inheritance**. With interface \`default\` methods it can re-emerge, so the compiler forces you to override and resolve it explicitly with \`Interface.super.method()\`." },
        ]},
        { id: "collections-core", heading: "Collections", questions: [
          { q: "Difference between ArrayList and LinkedList?",
            a: "**ArrayList** is a resizable array: O(1) random access, O(n) middle inserts/removes. **LinkedList** is a doubly-linked list: O(1) add/remove at the ends via an iterator, but O(n) index access. Default to ArrayList; reach for LinkedList only for frequent end-of-deque operations." },
          { q: "How does HashMap work internally?",
            a: "Entries live in an array of **buckets** indexed by \`hash(key)\`. Colliding keys form a linked list that converts to a balanced tree past 8 entries in a bucket (Java 8+). \`get\`/\`put\` are O(1) average; the table resizes and rehashes when the load factor (0.75) is exceeded." },
          { q: "HashMap vs Hashtable?",
            a: "**Hashtable** is legacy and fully synchronized (thread-safe but slower) and forbids \`null\` keys/values. **HashMap** is unsynchronized, faster, and allows one \`null\` key and \`null\` values. For concurrency prefer \`ConcurrentHashMap\` over Hashtable." },
          { q: "Difference between HashSet and TreeSet?",
            a: "**HashSet** is backed by a HashMap: unordered, O(1) operations, allows one \`null\`. **TreeSet** is a red-black tree: sorted (natural or \`Comparator\`), O(log n) operations, no \`null\`. Choose HashSet for speed, TreeSet when you need ordering." },
          { q: "What is the difference between fail-fast and fail-safe iterators?",
            a: "**Fail-fast** iterators (ArrayList, HashMap) throw \`ConcurrentModificationException\` if the collection is structurally modified during iteration, using a \`modCount\` check. **Fail-safe** iterators (CopyOnWriteArrayList, ConcurrentHashMap) iterate over a snapshot/copy and never throw." },
        ]},
      ]
    }),

    /* ===========================================================
       Q2 · 100 Java 8 Questions
       =========================================================== */
    qbank({
      id: "java8", chapter: "Q2", title: "100 Java 8 Questions",
      subtitle: "Lambdas, streams, functional interfaces, and Optional.",
      icon: "⚡", tag: "Demo: 15 of 100", level: "Q-Bank",
      categories: [
        { id: "lambdas", heading: "Lambdas & Functional Interfaces", questions: [
          { q: "What is a lambda expression?",
            a: "A concise way to represent an anonymous function: \`(args) -> body\`. It implements a functional interface's single abstract method, letting you pass **behavior as data**, e.g. \`list.forEach(x -> print(x))\`." },
          { q: "What is a functional interface?",
            a: "An interface with exactly one abstract method (a **SAM**), optionally with \`default\`/\`static\` methods. It's the target type for lambdas and method references. \`@FunctionalInterface\` makes the compiler enforce the single-method rule — e.g. \`Runnable\`, \`Comparator\`, \`Function\`." },
          { q: "Difference between Function, Supplier, Consumer, and Predicate?",
            a: "\`Function<T,R>\` takes T returns R; \`Supplier<T>\` takes nothing returns T; \`Consumer<T>\` takes T returns nothing; \`Predicate<T>\` takes T returns boolean. They're the core \`java.util.function\` building blocks for streams." },
          { q: "What are method references and their types?",
            a: "Shorthand for a lambda that just calls an existing method, written with \`::\`. Four kinds: **static** (\`Integer::parseInt\`), **bound instance** (\`obj::method\`), **unbound instance** (\`String::length\`), and **constructor** (\`ArrayList::new\`)." },
          { q: "Lambda vs anonymous inner class?",
            a: "A lambda has no \`this\` of its own (\`this\` refers to the enclosing instance), generates no separate \`.class\` file, and can only implement a functional interface. An anonymous class creates a new scope/\`this\`, can hold state, and can extend classes or implement multi-method interfaces." },
        ]},
        { id: "streams", heading: "Streams API", questions: [
          { q: "What is the Stream API?",
            a: "A declarative pipeline for processing sequences: a source, lazy **intermediate** operations (\`map\`, \`filter\`), and a **terminal** operation (\`collect\`, \`forEach\`). It enables functional-style and parallel processing without mutating the source." },
          { q: "Intermediate vs terminal operations?",
            a: "**Intermediate** operations (\`filter\`, \`map\`, \`sorted\`) are lazy and return a new stream, building the pipeline. **Terminal** operations (\`collect\`, \`count\`, \`reduce\`) trigger execution and produce a result. Nothing runs until a terminal operation is invoked." },
          { q: "Difference between map() and flatMap()?",
            a: "\`map()\` transforms each element 1-to-1, producing a \`Stream<R>\`. \`flatMap()\` maps each element to a *stream* and flattens the results into one stream — ideal for nested structures like \`List<List<T>>\` → \`Stream<T>\`." },
          { q: "What does Collectors.groupingBy() do?",
            a: "It partitions stream elements into a \`Map\` by a classifier function, like SQL \`GROUP BY\`. A downstream collector lets you count/sum/map per group, e.g. \`groupingBy(Employee::getDept, counting())\`." },
          { q: "Are streams reusable?",
            a: "No. A stream is consumed by its terminal operation; reusing it throws \`IllegalStateException\` (\"stream has already been operated upon or closed\"). Create a fresh stream from the source each time." },
        ]},
        { id: "optional", heading: "Optional & Default Methods", questions: [
          { q: "What problem does Optional solve?",
            a: "It's a container that may or may not hold a value, making **absence explicit** in the API and reducing \`NullPointerException\`s. Use \`map\`/\`filter\`/\`orElse\` to handle presence cleanly instead of null checks." },
          { q: "Difference between orElse() and orElseGet()?",
            a: "\`orElse(value)\` always evaluates its argument, even when the Optional is present. \`orElseGet(supplier)\` invokes the supplier *only* when empty — preferable when the fallback is expensive or has side effects." },
          { q: "Why avoid Optional.get()?",
            a: "\`get()\` throws \`NoSuchElementException\` if empty, reintroducing the null-pointer problem it was meant to remove. Prefer \`orElse\`, \`orElseThrow\`, \`ifPresent\`, or \`map\` so absence is handled safely." },
          { q: "What are default methods and why were they added?",
            a: "Methods with a body inside an interface, marked \`default\`. Added in Java 8 to **evolve interfaces** (e.g. add \`stream()\` to \`Collection\`) without breaking existing implementors." },
          { q: "Difference between findFirst() and findAny()?",
            a: "\`findFirst()\` returns the first element in encounter order. \`findAny()\` may return *any* element and is optimized for parallel streams where order doesn't matter, allowing better performance." },
        ]},
      ]
    }),

    /* ===========================================================
       Q3 · 100 Collections Questions
       =========================================================== */
    qbank({
      id: "collections", chapter: "Q3", title: "100 Collections Questions",
      subtitle: "List, Set, Map internals, ordering, and concurrency trade-offs.",
      icon: "🗃️", tag: "Demo: 15 of 100", level: "Q-Bank",
      categories: [
        { id: "list-set", heading: "List & Set", questions: [
          { q: "When would you choose a Set over a List?",
            a: "Use a **Set** when elements must be unique and position doesn't matter (membership tests, de-duplication). Use a **List** when duplicates are allowed and you need indexed/positional access or insertion order." },
          { q: "How does HashSet guarantee uniqueness?",
            a: "It's backed by a HashMap storing elements as keys. \`add\` uses \`hashCode()\` to find the bucket and \`equals()\` to detect duplicates, so correct \`hashCode\`/\`equals\` are essential — otherwise duplicates slip in." },
          { q: "Difference between ArrayList and Vector?",
            a: "Both are resizable arrays, but **Vector** is synchronized (legacy, thread-safe, slower) and doubles capacity on growth, while **ArrayList** is unsynchronized, faster, and grows by ~50%. Prefer ArrayList, adding synchronization explicitly if needed." },
          { q: "What are the default initial capacity and load factor of a HashMap?",
            a: "Default capacity is **16** buckets and load factor **0.75**. When size exceeds capacity × load factor (12), the table doubles and rehashes. Pre-sizing a known-large map avoids repeated resize cost." },
          { q: "Why must you override hashCode() when you override equals()?",
            a: "The contract requires equal objects to have equal hash codes. Hash-based collections locate objects by \`hashCode\` first; if it's inconsistent with \`equals\`, equal objects land in different buckets and lookups fail." },
        ]},
        { id: "map-internals", heading: "Map Internals", questions: [
          { q: "How does HashMap handle collisions?",
            a: "Keys with the same bucket index are chained in a **linked list**. Since Java 8, a bucket with more than 8 entries (and table ≥ 64) converts to a **red-black tree**, improving worst-case lookup from O(n) to O(log n)." },
          { q: "What changed in HashMap in Java 8?",
            a: "Buckets switch from linked lists to **balanced trees** past a threshold (treeification), and the hash-spread function was simplified. This mitigates collision-heavy degradation to O(n) and certain hash-flooding DoS attacks." },
          { q: "How does ConcurrentHashMap achieve thread safety?",
            a: "Modern versions lock only individual **buckets/nodes** (via CAS and \`synchronized\` on the head node) instead of the whole map, so reads are largely lock-free and writes are segmented — yielding high concurrent throughput." },
          { q: "Difference between TreeMap and HashMap?",
            a: "**HashMap** is unordered with O(1) average operations. **TreeMap** is a red-black tree keeping keys sorted with O(log n) operations plus navigation (\`floorKey\`, \`ceilingKey\`). Use TreeMap when ordering or range queries matter." },
          { q: "What is LinkedHashMap and when is it useful?",
            a: "A HashMap that maintains a doubly-linked list across entries, preserving **insertion order** (or access order). Access-order mode plus \`removeEldestEntry()\` makes it a natural building block for an **LRU cache**." },
        ]},
        { id: "ordering-concurrency", heading: "Ordering & Concurrency", questions: [
          { q: "Difference between Comparable and Comparator?",
            a: "**Comparable** defines a class's natural ordering via \`compareTo()\` (one ordering, inside the class). **Comparator** is an external strategy via \`compare()\`, allowing multiple orderings without modifying the class — ideal for ad-hoc sorting." },
          { q: "How does CopyOnWriteArrayList work?",
            a: "Every mutation copies the underlying array, so iterators read an immutable snapshot and never throw \`ConcurrentModificationException\`. Great for **read-heavy, write-rare** scenarios; expensive when writes are frequent." },
          { q: "Difference between Iterator and ListIterator?",
            a: "**Iterator** traverses forward only with \`hasNext\`/\`next\`/\`remove\`. **ListIterator** (lists only) traverses both directions and can \`add\`/\`set\` elements and report indexes — richer in-place editing." },
          { q: "Why is it unsafe to modify a collection during iteration?",
            a: "Structural modification bumps \`modCount\`, so a fail-fast iterator throws \`ConcurrentModificationException\` to avoid undefined behavior. Use the iterator's own \`remove()\`, \`removeIf()\`, or a concurrent collection instead." },
          { q: "What collection fits a producer-consumer queue?",
            a: "A **BlockingQueue** such as \`ArrayBlockingQueue\` or \`LinkedBlockingQueue\`. Its \`put()\`/\`take()\` block when full/empty, handling coordination and back-pressure without manual \`wait\`/\`notify\`." },
        ]},
      ]
    }),

    /* ===========================================================
       Q4 · 50 Multithreading Questions
       =========================================================== */
    qbank({
      id: "multithreading", chapter: "Q4", title: "50 Multithreading Questions",
      subtitle: "Threads, synchronization, executors, and concurrency utilities.",
      icon: "🧵", tag: "Demo: 15 of 50", level: "Q-Bank",
      categories: [
        { id: "thread-basics", heading: "Thread Basics", questions: [
          { q: "Difference between a process and a thread?",
            a: "A **process** is an independent program with its own memory space; a **thread** is a lightweight unit of execution within a process that shares its heap. Threads are cheaper to create and communicate, but require synchronization on shared data." },
          { q: "Extending Thread vs implementing Runnable?",
            a: "**Runnable** separates the task from the thread, lets your class extend something else, and works with thread pools. **Extending Thread** couples task and thread and consumes the single inheritance slot. Prefer Runnable/Callable." },
          { q: "Difference between start() and run()?",
            a: "\`start()\` creates a new thread and the JVM calls \`run()\` on it. Calling \`run()\` directly just executes it on the *current* thread — no concurrency. Calling \`start()\` twice throws \`IllegalThreadStateException\`." },
          { q: "What are the states in a thread's lifecycle?",
            a: "**NEW**, **RUNNABLE**, **BLOCKED** (waiting for a monitor lock), **WAITING** (indefinite, e.g. \`wait\`/\`join\`), **TIMED_WAITING** (\`sleep\`/timed \`wait\`), and **TERMINATED**. The OS scheduler moves runnable threads on and off the CPU." },
          { q: "Difference between sleep() and wait()?",
            a: "\`sleep()\` is a static \`Thread\` method that pauses the current thread **without releasing locks**. \`wait()\` is an \`Object\` method called inside a \`synchronized\` block that **releases the monitor** and waits for \`notify()\`/\`notifyAll()\`." },
        ]},
        { id: "synchronization", heading: "Synchronization", questions: [
          { q: "What does the synchronized keyword do?",
            a: "It acquires an object's **monitor lock** so only one thread runs the block/method at a time, providing mutual exclusion plus a happens-before visibility guarantee. Instance methods lock \`this\`; static methods lock the \`Class\` object." },
          { q: "What is the volatile keyword?",
            a: "\`volatile\` guarantees **visibility**: writes flush to and reads come from main memory (no stale cached values), and it forbids reordering across the access. It does **not** make compound actions like \`i++\` atomic." },
          { q: "What is a deadlock and how do you prevent it?",
            a: "Deadlock is two+ threads each holding a lock the other needs, waiting forever. Prevent it by acquiring locks in a **consistent global order**, using \`tryLock\` with timeouts, or reducing lock scope so fewer locks are held at once." },
          { q: "Difference between synchronized and ReentrantLock?",
            a: "**ReentrantLock** adds \`tryLock\`, timed/interruptible locking, fairness policies, and multiple \`Condition\`s — but you must \`unlock()\` in a \`finally\`. **synchronized** is simpler and auto-released. Use \`Lock\` when you need the extra control." },
          { q: "Difference between notify() and notifyAll()?",
            a: "\`notify()\` wakes a single arbitrary waiting thread; \`notifyAll()\` wakes all waiters, which then re-contend for the lock. \`notifyAll()\` is safer when multiple conditions share a monitor, at some performance cost." },
        ]},
        { id: "executors", heading: "Executors & Concurrency Utilities", questions: [
          { q: "Why use an ExecutorService instead of creating threads manually?",
            a: "It **pools and reuses** threads, decoupling submission from execution, bounding resource use, and providing lifecycle management, \`Future\`s, and scheduling. Manual thread creation is costly and hard to manage at scale." },
          { q: "Difference between Runnable and Callable?",
            a: "\`Runnable.run()\` returns nothing and can't throw checked exceptions. \`Callable.call()\` returns a value and may throw checked exceptions; submitting it yields a \`Future\` to retrieve the result or exception." },
          { q: "What is a Future, and what does CompletableFuture add?",
            a: "\`Future\` represents a pending result you can \`get()\` (blocking) or cancel. \`CompletableFuture\` adds **non-blocking composition** (\`thenApply\`, \`thenCompose\`), combining, and exception handling for async pipelines." },
          { q: "ConcurrentHashMap vs Collections.synchronizedMap()?",
            a: "\`synchronizedMap\` wraps a map with a **single lock** on every operation. \`ConcurrentHashMap\` locks at **bucket granularity**, allowing concurrent reads/writes and scaling far better under contention." },
          { q: "What are atomic classes like AtomicInteger for?",
            a: "They provide **lock-free**, thread-safe operations on single variables using CAS (compare-and-swap) hardware instructions, e.g. \`incrementAndGet()\`. They beat synchronization for simple counters and flags." },
        ]},
      ]
    }),

    /* ===========================================================
       Q5 · Scenario-Based Questions
       =========================================================== */
    qbank({
      id: "scenario", chapter: "Q5", title: "Scenario-Based Questions",
      subtitle: "\"What would you do if…\" — design decisions, debugging, and performance.",
      icon: "🧩", tag: "Demo: 15 patterns", level: "Q-Bank",
      categories: [
        { id: "design-decisions", heading: "Design Decisions", questions: [
          { q: "You need a cache that evicts least-recently-used entries. How?",
            a: "Use a **LinkedHashMap** in access-order mode and override \`removeEldestEntry()\` to cap size — or, for production, a library like **Caffeine**/Guava with TTL, weighting, and stats. For concurrency, prefer Caffeine over hand-rolled locking." },
          { q: "How would you make a class immutable?",
            a: "Make it \`final\`, all fields \`private final\`, set them only in the constructor, expose no setters, and **defensively copy** mutable inputs/outputs (collections, dates). This guarantees thread safety and safe sharing." },
          { q: "Interface or abstract class for a new design?",
            a: "Choose an **interface** to define a capability that unrelated classes can implement and to allow multiple inheritance of type. Choose an **abstract class** when classes share state or implementation. Often use both: interface for the contract, abstract base for shared code." },
          { q: "How would you design a thread-safe singleton?",
            a: "Use an **enum** singleton (simplest, serialization- and reflection-safe) or the **static holder** idiom (lazy, no locking). If you need controlled lazy init, use double-checked locking with a \`volatile\` instance field." },
          { q: "A method can fail for several reasons the caller must handle differently. How do you model errors?",
            a: "Use distinct **custom exception types** in a hierarchy so callers can catch specifically, carry context in fields, and avoid returning error codes or \`null\`. Reserve unchecked exceptions for programming bugs, checked for recoverable conditions." },
        ]},
        { id: "debugging", heading: "Debugging & Production Issues", questions: [
          { q: "Your app throws OutOfMemoryError. How do you investigate?",
            a: "Capture a heap dump (\`-XX:+HeapDumpOnOutOfMemoryError\`), analyze it in **MAT/VisualVM** for dominator/retained sizes, look for growing collections, unclosed resources, or classloader leaks, and review **GC logs** to distinguish a real leak from an undersized heap." },
          { q: "A REST endpoint intermittently returns stale data under load. What might cause it?",
            a: "Likely a **visibility/race condition** on shared mutable state, a non-thread-safe cache, or missing \`synchronized\`/\`volatile\`. Reproduce under concurrency, make shared state immutable or properly synchronized, and check the caching layer's invalidation." },
          { q: "You see a ConcurrentModificationException. What's happening and how do you fix it?",
            a: "A collection was **structurally modified while iterating** by a fail-fast iterator. Fix it with \`iterator.remove()\`, \`removeIf()\`, iterating over a copy, or switching to a concurrent collection." },
          { q: "How would you diagnose a thread deadlock in production?",
            a: "Take a **thread dump** (\`jstack\` or \`kill -3\`); the JVM reports detected deadlocks and the locks each thread holds/awaits. Inspect the lock-ordering cycle, then refactor to a consistent acquisition order or add timeouts." },
          { q: "CPU is pegged at 100% on one server. How do you find the cause?",
            a: "Identify the hot thread (\`top -H\`, then map its native id to a thread dump), inspect the stack for tight loops or excessive GC, check GC logs, and profile with **async-profiler** to pinpoint the hotspot." },
        ]},
        { id: "performance", heading: "Performance & Memory", questions: [
          { q: "How does garbage collection decide what to collect?",
            a: "Objects **unreachable from GC roots** (stack locals, statics, active threads) are eligible. Generational GC collects the young generation frequently (most objects die young) and the old generation rarely, keeping pauses short." },
          { q: "What's the difference between the stack and the heap?",
            a: "The **stack** holds per-thread method frames and local/primitive variables, freed automatically when methods return. The **heap** holds all objects, shared across threads and reclaimed by the garbage collector." },
          { q: "How would you reduce memory churn in a hot code path?",
            a: "Avoid needless allocation and autoboxing, reuse buffers, prefer primitive arrays over wrapper collections, use \`StringBuilder\` over string concatenation, and stream lazily instead of building large intermediate lists." },
          { q: "When is String concatenation in a loop a problem?",
            a: "Each \`+\` on a \`String\` creates a new immutable object, giving O(n²) work plus garbage. Use \`StringBuilder\` (or \`StringBuffer\` if shared) to accumulate in a single mutable buffer." },
          { q: "What causes a memory leak in a garbage-collected language?",
            a: "Unintended **retained references**: static collections that grow, caches without eviction, unremoved listeners/callbacks, \`ThreadLocal\`s in pooled threads, and unclosed resources. GC can't collect what's still reachable." },
        ]},
      ]
    }),

    /* ===========================================================
       Q6 · Coding Questions
       =========================================================== */
    qbank({
      id: "coding", chapter: "Q6", title: "Coding Questions",
      subtitle: "Hands-on problems frequently asked in written and machine rounds.",
      icon: "💻", tag: "Demo: 15 problems", level: "Q-Bank",
      categories: [
        { id: "strings-arrays", heading: "Strings & Arrays", questions: [
          { q: "How do you reverse a string in Java?",
            a: "Use \`new StringBuilder(s).reverse().toString()\`, or swap characters from both ends toward the middle in a \`char[]\` for an in-place O(n) manual solution. Avoid \`+\` concatenation in a loop." },
          { q: "How do you check if two strings are anagrams?",
            a: "Normalize case, then either **sort** both char arrays and compare (O(n log n)), or **count** character frequencies in an \`int[26]\`/Map and verify they match (O(n)). Frequency counting is preferred." },
          { q: "How do you find the first non-repeating character in a string?",
            a: "Build a frequency map (a \`LinkedHashMap\` preserves order) in one pass, then scan the string again and return the first character with count 1. Two passes, O(n)." },
          { q: "How would you find duplicates in an array?",
            a: "Iterate and add each element to a **HashSet**; if \`add()\` returns \`false\` it's a duplicate — O(n) time, O(n) space. If values are bounded, a boolean/count array avoids the set." },
          { q: "How do you check if a number is a palindrome without converting to a string?",
            a: "Reverse it mathematically: repeatedly take \`n % 10\` and build \`rev = rev*10 + digit\`, then compare \`rev\` with the original. Treat negatives as non-palindromes." },
        ]},
        { id: "maps", heading: "Collections & HashMap", questions: [
          { q: "How would you count word frequencies in a sentence?",
            a: "Split on whitespace, then over a HashMap use \`map.merge(word, 1, Integer::sum)\` (or \`computeIfAbsent\`). With streams: \`Collectors.groupingBy(w -> w, counting())\`." },
          { q: "How do you find the two numbers in an array that sum to a target?",
            a: "Iterate once; for each element check whether \`target - element\` is already in a HashSet/Map. If so, you've found the pair. O(n) time vs O(n²) brute force." },
          { q: "How would you sort a Map by its values?",
            a: "Stream the \`entrySet\`, sort with \`Comparator.comparing(Map.Entry::getValue)\` (reversed for descending), and collect into a \`LinkedHashMap\` to preserve the sorted order." },
          { q: "How do you remove duplicates from a list while preserving order?",
            a: "Collect through a **LinkedHashSet** — \`new ArrayList<>(new LinkedHashSet<>(list))\` — or \`stream().distinct().collect(toList())\`. Both keep first-seen order." },
          { q: "How would you find the most frequent element in an array?",
            a: "Count occurrences in a HashMap, then take the max entry via \`Collections.max(map.entrySet(), comparingByValue())\` or a stream \`max\`. O(n) time." },
        ]},
        { id: "logic-recursion", heading: "Logic & Recursion", questions: [
          { q: "How do you compute the nth Fibonacci number efficiently?",
            a: "Use **iterative** bottom-up with two rolling variables — O(n) time, O(1) space — or memoized recursion. Naive recursion is exponential O(2ⁿ) and should be avoided." },
          { q: "How would you check whether a string has balanced parentheses?",
            a: "Push opening brackets onto a **stack**; on a closing bracket, pop and verify it matches. It's balanced if every closer matched and the stack is empty at the end." },
          { q: "How do you reverse a linked list?",
            a: "Iteratively re-point each node's \`next\` to the previous node while walking with three pointers (\`prev\`, \`curr\`, \`next\`), returning \`prev\` as the new head. O(n) time, O(1) space." },
          { q: "How would you detect a cycle in a linked list?",
            a: "**Floyd's tortoise-and-hare**: advance one pointer by one and another by two; if they ever meet there's a cycle, if the fast pointer hits \`null\` there isn't. O(n) time, O(1) space." },
          { q: "How do you implement binary search?",
            a: "On a **sorted** array, repeatedly compare the middle element to the target, discarding half each step. O(log n). Compute \`mid = lo + (hi - lo) / 2\` to avoid integer overflow." },
        ]},
      ]
    }),

    /* ===========================================================
       Q7 · System Design Basics
       =========================================================== */
    qbank({
      id: "system-design", chapter: "Q7", title: "System Design Basics",
      subtitle: "Foundations for HLD/LLD discussions in product-company rounds.",
      icon: "🏗️", tag: "Demo: 15 foundations", level: "Q-Bank",
      categories: [
        { id: "fundamentals-scaling", heading: "Fundamentals & Scaling", questions: [
          { q: "Difference between vertical and horizontal scaling?",
            a: "**Vertical** scaling adds power (CPU/RAM) to one machine — simple but has a ceiling and a single point of failure. **Horizontal** scaling adds more machines behind a load balancer — near-limitless and fault-tolerant, but needs statelessness and coordination." },
          { q: "What does a load balancer do?",
            a: "It distributes incoming requests across servers using strategies (round-robin, least-connections), runs **health checks** to route around failures, and enables horizontal scaling plus zero-downtime deploys." },
          { q: "What is the CAP theorem?",
            a: "In a distributed system you can guarantee only two of **Consistency, Availability, Partition tolerance**. Since network partitions are unavoidable, real systems trade consistency vs availability (CP vs AP) during a partition." },
          { q: "What is statelessness and why does it matter for scaling?",
            a: "A **stateless** service keeps no client session in memory between requests, so any instance can serve any request — enabling easy horizontal scaling and failover. Session state is pushed to a shared store (DB, Redis) or tokens." },
          { q: "Difference between latency and throughput?",
            a: "**Latency** is the time for a single request to complete; **throughput** is how many requests the system handles per unit time. Optimizing one can hurt the other — e.g. batching raises throughput but adds latency." },
        ]},
        { id: "data-caching", heading: "Databases & Caching", questions: [
          { q: "SQL vs NoSQL — how do you choose?",
            a: "**SQL** offers strong schemas, ACID transactions, and joins — good for relational, consistency-critical data. **NoSQL** (document, key-value, wide-column) offers flexible schemas and horizontal scale for high-volume or rapidly evolving data. Choose by access pattern." },
          { q: "What is database indexing and its trade-off?",
            a: "An index (usually a **B-tree**) lets the DB find rows without a full table scan, speeding reads dramatically. The cost is extra storage and slower writes, since every insert/update must maintain the index." },
          { q: "What is caching, and what is cache invalidation?",
            a: "**Caching** stores hot data in fast storage (in-memory/Redis) to cut latency and DB load. **Invalidation** keeps the cache consistent with the source via TTL expiry, write-through, or explicit eviction — famously one of the hard problems." },
          { q: "What is database sharding?",
            a: "**Sharding** horizontally partitions data across multiple databases by a shard key (e.g. user id), so each holds a subset. It scales writes and storage beyond one machine but complicates joins, transactions, and rebalancing." },
          { q: "Difference between replication and partitioning?",
            a: "**Replication** copies the same data to multiple nodes for availability and read scaling. **Partitioning/sharding** splits *different* data across nodes for write/storage scaling. Large systems often combine both." },
        ]},
        { id: "hld-lld", heading: "HLD & LLD Concepts", questions: [
          { q: "Difference between HLD and LLD?",
            a: "**High-Level Design** defines architecture: services, data stores, APIs, and how components interact. **Low-Level Design** details each component: class diagrams, method signatures, data structures, and algorithms. HLD is the blueprint; LLD is the construction plan." },
          { q: "What are microservices, and a key trade-off?",
            a: "Microservices split an app into small, independently deployable services that own their data, giving autonomy, targeted scaling, and fault isolation. The trade-off is added network latency, distributed-transaction complexity, and operational overhead versus a monolith." },
          { q: "What is an API gateway?",
            a: "A single entry point that routes requests to backend services and centralizes cross-cutting concerns — authentication, rate limiting, TLS, logging, and request aggregation — so individual services stay focused on business logic." },
          { q: "What is a message queue and why use one?",
            a: "A broker (Kafka, RabbitMQ) for **asynchronous** communication: producers publish, consumers process at their own pace. It decouples services, absorbs traffic spikes (back-pressure), and improves resilience." },
          { q: "How would you design a URL shortener at a high level?",
            a: "Generate a short unique key (base62 of an id, or a hash) mapping to the long URL in a key-value store, serve redirects from a read-optimized cache, and scale reads with replication/CDN. Handle collisions and analytics asynchronously." },
        ]},
      ]
    }),
  ]
});
