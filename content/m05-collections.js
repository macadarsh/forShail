/* Module 5: Collections Framework — edit ONLY this file for this module's content.
   Authored at ~2x Module 2 depth (Module-3 style), ordered BASIC -> ADVANCED:
     5.1 overview -> 5.2 iterator -> 5.3 equals/hashCode -> 5.4 Comparable/Comparator
     -> LIST: 5.5 ArrayList, 5.6 LinkedList, 5.7 Vector & Stack (legacy)
     -> SET: 5.8 HashSet, 5.9 LinkedHashSet, 5.10 TreeSet
     -> QUEUE: 5.11 PriorityQueue, 5.12 Deque & ArrayDeque
     -> MAP: 5.13 HashMap, 5.14 LinkedHashMap, 5.15 TreeMap, 5.16 Hashtable, 5.17 ConcurrentHashMap
     -> 5.18 Collections utility -> 5.19 choosing & performance (capstone).
   Each topic() renders sections in declared order; see assets/site.js PART_LABELS. */
registerModule({
  id: "collections",
  module: "Collections Framework",
  page: "module-collections.html",
  icon: "🗃️",
  tagline: "Lists, sets, queues, and maps — internals, Big-O, and trade-offs.",
  lessons: [

    /* ===================== BASIC / FOUNDATIONS ===================== */

    /* 5.1 Collections Framework Overview — the architecture and interfaces. */
    topic({
      id: "collection-framework-architecture", chapter: "5.1", title: "Collections Framework Overview",
      subtitle: "The architecture: interfaces, implementations, and the big picture.",
      readTime: "16 min", level: "Foundational", deep: true,
      objectives: [
        "Explain what the Collections Framework is and why it exists.",
        "Map the core interfaces: Collection, List, Set, Queue, Deque, and Map.",
        "Distinguish interfaces (contracts) from implementations (classes).",
        "Choose a starting collection type from the requirements."
      ],
      concept: `The **Java Collections Framework (JCF)** is a unified set of **interfaces** and **classes** (in \`java.util\`) for storing and manipulating groups of objects. Instead of every project inventing its own list or map, the JCF gives a consistent, reusable, well-tested architecture.

Two pillars:

- **Interfaces** define *contracts* — \`List\`, \`Set\`, \`Queue\`, \`Map\` — *what* a collection does.
- **Implementations** are concrete classes — \`ArrayList\`, \`HashSet\`, \`HashMap\` — *how* it's done.

\`\`\`java
List<String> names = new ArrayList<>();   // program to the INTERFACE, pick an impl
names.add("Shail");
\`\`\`

You declare the variable as the **interface** and instantiate a concrete **class** — the essence of polymorphism (Module 2 §2.9) applied to data structures.`,
      why: `Before the JCF (pre–Java 2), developers used raw arrays, \`Vector\`, and \`Hashtable\` inconsistently. The framework brought:

- **Consistency** — one common API; learn it once, use it everywhere.
- **Reusability & reliability** — battle-tested data structures instead of hand-rolled ones.
- **Interoperability** — algorithms (\`Collections.sort\`) work across all implementations.
- **Polymorphism** — swap \`ArrayList\` for \`LinkedList\` by changing one line, because both are \`List\`.
- **Performance choices** — pick the structure whose Big-O fits your access pattern (§5.19).

This is *the* most heavily-tested topic in Java interviews — every collection's internals and trade-offs come up.`,
      hierarchy: `**The core type hierarchy** (two separate roots — a key fact):

\`\`\`
        Iterable
           │
       Collection ───────────────┐         Map  (separate root!)
       /    │     \\              │          │
    List   Set   Queue          │       SortedMap
     │      │      │            Deque       │
  ArrayList HashSet PriorityQueue ArrayDeque  TreeMap
  LinkedList TreeSet                          HashMap, LinkedHashMap
\`\`\`

- **\`Collection\`** is the root of \`List\`/\`Set\`/\`Queue\`; it extends **\`Iterable\`** (so all are for-each-able, §5.2).
- **\`Map\` is NOT a \`Collection\`** — it stores key→value pairs, a different abstraction (a frequent gotcha).

| Interface | Allows duplicates? | Ordered? | Key idea |
|---|---|---|---|
| \`List\` | yes | yes (by index) | ordered sequence (§5.5–5.7) |
| \`Set\` | no | depends on impl | unique elements (§5.8–5.10) |
| \`Queue\`/\`Deque\` | yes | yes (FIFO/LIFO) | ends-based access (§5.11–5.12) |
| \`Map\` | keys unique | depends on impl | key→value lookup (§5.13–5.17) |`,
      internal: `The framework also includes **utility classes** and **infrastructure**:

- **\`Collections\`** (utility, §5.18) — \`sort\`, \`reverse\`, \`unmodifiableList\`, \`synchronizedMap\`, \`binarySearch\`.
- **\`Arrays\`** — \`asList\`, \`sort\`, \`stream\` for arrays.
- **\`Iterator\`/\`Iterable\`** (§5.2) — uniform traversal underlying the for-each loop.
- **\`Comparable\`/\`Comparator\`** (§5.4) — ordering used by sorted collections and sort algorithms.

Generics (Module 6) make collections **type-safe**: \`List<String>\` only holds \`String\`s, checked at compile time. Before generics (Java 5), collections held raw \`Object\` and required casts — error-prone.`,
      useCases: `- **\`List\`** — an ordered, index-accessible sequence (a to-do list, search results).
- **\`Set\`** — uniqueness (distinct visitor IDs, tags).
- **\`Queue\`/\`Deque\`** — processing order (task queues, BFS, undo stacks).
- **\`Map\`** — fast key→value lookup (caches, counts, configuration, indexes).

Picking the right *interface* first, then the right *implementation*, is a core design skill (the capstone §5.19 is a decision guide).`,
      code: `\`\`\`java
import java.util.*;

public class Overview {
    public static void main(String[] args) {
        // same code works against the interface, regardless of implementation
        List<String> list = new ArrayList<>(List.of("b", "a", "c"));
        Set<String> set   = new HashSet<>(list);          // dedupes
        Map<String,Integer> counts = new HashMap<>();
        for (String s : list) counts.merge(s, 1, Integer::sum); // tally

        Collections.sort(list);                            // framework algorithm
        System.out.println(list);   // [a, b, c]
        System.out.println(set.size());                    // 3
        System.out.println(counts);                        // {a=1, b=1, c=1}

        // swapping the implementation needs no other code changes:
        List<String> linked = new LinkedList<>(list);
        System.out.println(linked.get(0));                 // a
    }
}
\`\`\``,
      mistakes: `- **Thinking \`Map\` is a \`Collection\`** — it isn't; it's a separate hierarchy of key/value pairs.
- **Programming to the implementation** (\`ArrayList list = ...\`) instead of the interface (\`List list = ...\`) — reduces flexibility.
- **Using raw types** (\`List list\`) instead of generics (\`List<String>\`) — loses type safety (Module 6).
- **Confusing \`Collection\` (interface) with \`Collections\` (utility class)** — different things (§5.18).
- **Picking a structure by habit** rather than by access pattern/Big-O (§5.19).`,
      bestPractices: `- **Program to interfaces**: declare \`List\`/\`Set\`/\`Map\`, instantiate the concrete class.
- Always parameterize with **generics** (\`Map<String,Integer>\`) for compile-time safety (Module 6).
- Choose the implementation from the **operations you need** (random access? ordering? uniqueness? concurrency?) — see §5.19.
- Prefer the **most general** type that meets your needs in method signatures (accept \`Collection\`/\`List\`, not \`ArrayList\`).
- Use factory methods (\`List.of\`, \`Map.of\`) for small immutable collections.`,
      interview: `**Q1. What is the Java Collections Framework?**
A unified architecture of interfaces (\`List\`, \`Set\`, \`Queue\`, \`Map\`) and implementations (\`ArrayList\`, \`HashSet\`, \`HashMap\`) plus algorithms/utilities for storing and manipulating groups of objects.

**Q2. Is \`Map\` part of the \`Collection\` hierarchy?**
No — \`Map\` is a separate root; \`Collection\` (extending \`Iterable\`) is the root of \`List\`/\`Set\`/\`Queue\`.

**Q3. Difference between \`Collection\` and \`Collections\`?**
\`Collection\` is the root interface; \`Collections\` is a utility class of static helper methods (§5.18).

**Q4. Why program to interfaces?**
To swap implementations freely and keep code flexible/testable (polymorphism).

**Q5. List vs Set vs Map in one line each?**
List = ordered, duplicates allowed; Set = unique elements; Map = key→value pairs with unique keys.

**Q6. What does generics add to collections?**
Compile-time type safety, eliminating casts and \`ClassCastException\` from heterogeneous storage (Module 6).`,
      exercises: `1. Declare a \`List\`, \`Set\`, and \`Map\` using interface types; add elements and print sizes.
2. Show that swapping \`new ArrayList<>()\` for \`new LinkedList<>()\` requires no other code change.
3. Build a word-frequency \`Map<String,Integer>\` from a sentence using \`merge\`.
4. Convert a \`List\` with duplicates into a \`Set\` and explain the size difference.`,
      challenges: `Write a method \`<T> void summarize(Collection<T> c)\` that accepts *any* collection and prints its size, whether it allows duplicates (by comparing \`size()\` to a \`HashSet\` copy's size), and its iteration order. Run it with an \`ArrayList\`, \`HashSet\`, \`LinkedHashSet\`, and \`TreeSet\`, and explain the differing outputs — a tour of the hierarchy you'll detail in later chapters.`,
      summary: `- The **Collections Framework** = interfaces (contracts) + implementations (classes) + algorithms/utilities in \`java.util\`.
- Roots: **\`Iterable\` → \`Collection\` → List/Set/Queue**; **\`Map\` is separate** (key→value).
- **Program to interfaces**, use **generics** (Module 6), pick implementations by access pattern/Big-O (§5.19).
- Traversal is **§5.2**, equality is **§5.3**, ordering is **§5.4**; \`Collections\` utility is **§5.18**.`
    }),

    /* 5.2 Iterable & Iterator — traversal, fail-fast vs fail-safe. */
    topic({
      id: "iterator-iterable", chapter: "5.2", title: "Iterable, Iterator & ListIterator",
      subtitle: "How traversal works — the for-each loop, safe removal, and fail-fast behaviour.",
      readTime: "16 min", level: "Beginner", deep: true,
      objectives: [
        "Explain how \`Iterable\` and \`Iterator\` power the for-each loop.",
        "Remove elements safely during iteration with \`Iterator.remove()\`.",
        "Distinguish fail-fast from fail-safe iterators and \`ConcurrentModificationException\`.",
        "Use \`ListIterator\` for bidirectional traversal and modification."
      ],
      concept: `Every collection can be traversed because it implements **\`Iterable<T>\`**, whose single method \`iterator()\` returns an **\`Iterator<T>\`** — a cursor with three operations:

| Method | Purpose |
|---|---|
| \`hasNext()\` | is there another element? |
| \`next()\` | return the next element and advance |
| \`remove()\` | remove the last element returned (optional) |

\`\`\`java
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    String s = it.next();
    System.out.println(s);
}
\`\`\`

The **enhanced for loop** (\`for-each\`) is just syntactic sugar over this:

\`\`\`java
for (String s : list) { ... }   // compiler uses list.iterator() under the hood
\`\`\``,
      why: `\`Iterable\`/\`Iterator\` give a **uniform way to traverse any collection** without exposing its internal structure (an application of the Iterator design pattern, Module 13). Benefits:

- The **same for-each loop** works on \`ArrayList\`, \`HashSet\`, \`TreeMap.keySet()\`, arrays, and your own classes.
- Decouples *traversal* from *storage* — you don't need to know it's an array or linked nodes.
- Enables **safe removal** during iteration (which a plain for-each cannot do).
- Implementing \`Iterable\` on your own class makes it for-each-able.`,
      safeRemoval: `**The single most common iteration bug:** modifying a collection while iterating it with a for-each loop throws **\`ConcurrentModificationException\`**:

\`\`\`java
// ❌ throws ConcurrentModificationException
for (String s : list) {
    if (s.isBlank()) list.remove(s);   // structural modification during for-each
}

// ✅ remove via the iterator itself
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    if (it.next().isBlank()) it.remove();   // safe
}

// ✅ or use removeIf (Java 8)
list.removeIf(String::isBlank);
\`\`\`

Only \`Iterator.remove()\` (or \`removeIf\`/a \`ListIterator\`) may structurally modify the collection mid-traversal.`,
      failFast: `**Fail-fast vs fail-safe iterators** — a key interview distinction:

| | **Fail-fast** | **Fail-safe** |
|---|---|---|
| Behaviour on concurrent modification | throws \`ConcurrentModificationException\` | keeps iterating, no exception |
| Works on | the live collection | a snapshot/copy |
| Examples | \`ArrayList\`, \`HashMap\`, \`HashSet\` (\`java.util\`) | \`CopyOnWriteArrayList\`, \`ConcurrentHashMap\` (\`java.util.concurrent\`) |
| Sees later changes? | n/a (it throws) | usually no (snapshot) |

Fail-fast iterators detect modification via an internal **\`modCount\`** counter: \`iterator()\` records the current \`modCount\`; each \`next()\` checks it still matches the collection's. If another thread (or your code) structurally changed the collection, the counts differ and it throws — a **best-effort** safety net, not a guarantee.`,
      listIterator: `\`List\`s offer a richer **\`ListIterator\`** that traverses **both directions** and can **add/set** during iteration:

\`\`\`java
ListIterator<String> li = list.listIterator();
while (li.hasNext()) {
    String s = li.next();
    if (s.equals("old")) li.set("new");      // replace in place
    if (s.equals("x")) li.add("inserted");   // insert
}
while (li.hasPrevious()) {                     // walk backwards
    System.out.println(li.previous());
}
\`\`\`

\`ListIterator\` adds \`hasPrevious()\`, \`previous()\`, \`set(e)\`, \`add(e)\`, and \`nextIndex()\`/\`previousIndex()\` — only \`List\` provides it.`,
      internal: `Under the hood the compiler turns \`for (T x : c)\` into:

\`\`\`java
for (Iterator<T> it = c.iterator(); it.hasNext(); ) { T x = it.next(); ... }
\`\`\`

Each collection returns its own \`Iterator\` implementation (often an inner class) that knows how to walk its structure (index for \`ArrayList\`, node links for \`LinkedList\`, bucket scan for \`HashMap\`). The \`modCount\` field is incremented on **structural** changes (add/remove that change size), which is how fail-fast detection works. Making your own class \`Iterable\` just requires returning an \`Iterator\`:

\`\`\`java
class Range implements Iterable<Integer> {
    private final int n;
    Range(int n) { this.n = n; }
    public Iterator<Integer> iterator() {
        return new Iterator<>() {
            int i = 0;
            public boolean hasNext() { return i < n; }
            public Integer next() { return i++; }
        };
    }
}
for (int x : new Range(3)) System.out.print(x); // 012
\`\`\``,
      useCases: `- **Safe filtering** of a live collection (\`Iterator.remove\`/\`removeIf\`).
- **Bidirectional editing** of lists (\`ListIterator.set\`/\`add\`).
- **Custom traversable types** (implement \`Iterable\` so callers can for-each them).
- **Concurrent reads** with fail-safe iterators (\`CopyOnWriteArrayList\`, Module 8).`,
      code: `\`\`\`java
import java.util.*;

public class IterationDemo {
    public static void main(String[] args) {
        List<Integer> nums = new ArrayList<>(List.of(1,2,3,4,5,6));

        // safe removal of evens
        Iterator<Integer> it = nums.iterator();
        while (it.hasNext()) if (it.next() % 2 == 0) it.remove();
        System.out.println(nums);   // [1, 3, 5]

        // demonstrate fail-fast
        try {
            for (Integer n : nums) { if (n == 3) nums.add(99); } // modifies during for-each
        } catch (ConcurrentModificationException e) {
            System.out.println("fail-fast triggered");
        }

        // ListIterator: replace in place
        ListIterator<Integer> li = nums.listIterator();
        while (li.hasNext()) li.set(li.next() * 10);
        System.out.println(nums);   // [10, 30, 50] (plus whatever survived)
    }
}
\`\`\``,
      mistakes: `- **Modifying a collection inside a for-each** — throws \`ConcurrentModificationException\`; use \`Iterator.remove\`/\`removeIf\`.
- **Calling \`remove()\` before \`next()\`** or twice — throws \`IllegalStateException\`.
- **Assuming fail-fast is a thread-safety guarantee** — it's best-effort detection, not synchronization.
- **Expecting fail-safe iterators to see concurrent updates** — they iterate a snapshot.
- **Using a plain \`Iterator\` when you need to go backwards or set** — use \`ListIterator\` (lists only).`,
      bestPractices: `- Prefer **for-each** for read-only traversal; use **\`Iterator\`/\`removeIf\`** when removing during iteration.
- Use **\`ListIterator\`** for in-place \`set\`/\`add\` and backward traversal on lists.
- For concurrent traversal, use **\`java.util.concurrent\`** collections (fail-safe) rather than synchronizing manually (Module 8).
- Implement **\`Iterable\`** on custom container types so they integrate with for-each and streams.
- Don't rely on fail-fast for correctness in multithreaded code — design proper synchronization.`,
      interview: `**Q1. How does the for-each loop work?**
The compiler calls \`iterator()\` and loops with \`hasNext()\`/\`next()\`; it only works on \`Iterable\` (and arrays).

**Q2. How do you remove elements while iterating?**
Use \`Iterator.remove()\` (or \`Collection.removeIf\`), never \`collection.remove()\` inside a for-each.

**Q3. What is \`ConcurrentModificationException\` and when is it thrown?**
Thrown by fail-fast iterators when the collection is structurally modified during iteration (detected via \`modCount\`).

**Q4. Fail-fast vs fail-safe?**
Fail-fast (\`ArrayList\`, \`HashMap\`) throws on concurrent modification; fail-safe (\`CopyOnWriteArrayList\`, \`ConcurrentHashMap\`) iterates a snapshot without throwing.

**Q5. Iterator vs ListIterator?**
\`Iterator\` is forward-only with \`remove\`; \`ListIterator\` (lists only) is bidirectional and supports \`set\`/\`add\`.

**Q6. How do you make your own class usable in a for-each loop?**
Implement \`Iterable<T>\` and return an \`Iterator<T>\`.`,
      exercises: `1. Remove all elements matching a condition using \`Iterator.remove\`, then again with \`removeIf\`.
2. Reproduce \`ConcurrentModificationException\` by modifying a list in a for-each, then fix it.
3. Use \`ListIterator\` to reverse-print a list and to replace each element in place.
4. Implement an \`Iterable\` \`Countdown\` class and traverse it with for-each.`,
      challenges: `Implement a generic \`Iterable<T>\` \`RingBuffer<T>\` (fixed capacity, overwrites oldest) whose iterator walks elements oldest-to-newest and supports \`remove()\`. Then demonstrate fail-fast behaviour by adding to it mid-iteration, and compare with wrapping it in a copy-on-write snapshot for safe concurrent reads (preview of Module 8).`,
      summary: `- **\`Iterable.iterator()\`** returns an **\`Iterator\`** (\`hasNext\`/\`next\`/\`remove\`) — the engine behind the **for-each** loop.
- Remove during iteration only via **\`Iterator.remove\`**/\`removeIf\`; a for-each modification throws **\`ConcurrentModificationException\`**.
- **Fail-fast** (\`java.util\`, via \`modCount\`) throws on concurrent modification; **fail-safe** (\`java.util.concurrent\`) iterates a snapshot.
- **\`ListIterator\`** (lists only) is bidirectional with \`set\`/\`add\`; implement \`Iterable\` to make custom types traversable.`
    }),

    /* 5.3 equals() & hashCode() — the contract behind sets and maps. */
    topic({
      id: "equals-hashcode", chapter: "5.3", title: "equals() & hashCode() Contract",
      subtitle: "The contract that makes HashSet and HashMap actually work.",
      readTime: "17 min", level: "Core", deep: true,
      objectives: [
        "State the \`equals\`/\`hashCode\` contract and why both must agree.",
        "Override both correctly and consistently for value objects.",
        "Explain how hash-based collections use them for O(1) lookup.",
        "Avoid the bugs that make objects 'disappear' from sets and maps."
      ],
      concept: `Hash-based collections (\`HashSet\`, \`HashMap\`, \`LinkedHashSet\`/\`Map\`, §5.8/§5.13) decide *where* an element lives and *whether* two elements are "the same" using two \`Object\` methods you must often override together:

- **\`hashCode()\`** returns an \`int\` that buckets the object (locates the right slot fast).
- **\`equals(Object)\`** decides whether two objects are logically equal (confirms a match within a bucket).

\`\`\`java
Set<Point> set = new HashSet<>();
set.add(new Point(1, 2));
set.contains(new Point(1, 2));   // true ONLY if Point overrides equals & hashCode
\`\`\`

Without correct overrides, two "equal" points are treated as different objects and the lookup fails — the classic "my object isn't found in the set" bug.`,
      why: `\`Object\`'s default \`equals\` compares **references** (identity), and default \`hashCode\` is based on the object's identity/address. For **value objects** (a \`Point\`, \`Money\`, \`Employee\` identified by fields), that's wrong: two distinct instances with the same data should be **equal**. To use such objects as **set elements** or **map keys**, you must override both so equality means "same field values," and the hash agrees.`,
      contract: `**The contract (memorise — heavily tested):**

For \`equals\`:

1. **Reflexive**: \`x.equals(x)\` is true.
2. **Symmetric**: \`x.equals(y) == y.equals(x)\`.
3. **Transitive**: if \`x=y\` and \`y=z\` then \`x=z\`.
4. **Consistent**: repeated calls return the same result (no random/mutable-field dependence).
5. **Non-null**: \`x.equals(null)\` is false.

For \`hashCode\` **in relation to \`equals\`** (the crucial link):

- If \`a.equals(b)\` is **true**, then \`a.hashCode() == b.hashCode()\` **must** be true.
- If hash codes differ, the objects **must not** be equal.
- Unequal objects *may* share a hash code (a **collision**) — allowed, just less efficient.

> Golden rule: **override \`equals\` and \`hashCode\` together** — overriding one without the other breaks hash collections.`,
      howToOverride: `**The idiomatic, correct implementation** (Java 7+ helpers):

\`\`\`java
import java.util.Objects;

public final class Point {
    private final int x, y;
    public Point(int x, int y) { this.x = x; this.y = y; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;                 // fast identity check
        if (!(o instanceof Point)) return false;    // type check (handles null)
        Point p = (Point) o;
        return x == p.x && y == p.y;                // compare significant fields
    }
    @Override public int hashCode() {
        return Objects.hash(x, y);                  // consistent with equals
    }
}
\`\`\`

Use the **same fields** in both methods. \`Objects.hash(...)\` and \`Objects.equals(a,b)\` (null-safe) make this concise and correct. (Java 16+ **\`record\`s** generate both automatically from the components — Module 2 §2.1 / Module 3 §3.4.)`,
      internal: `**How a \`HashMap\`/\`HashSet\` uses them** (the O(1) magic — full internals in §5.13):

1. Compute \`key.hashCode()\`, then spread/mix the bits, then map to a **bucket** index (\`hash & (n-1)\`).
2. Go to that bucket. If empty → not present (or insert here).
3. If the bucket has entries, **scan** them calling \`equals\` to find a true match.

So \`hashCode\` gets you to the right **bucket** quickly; \`equals\` confirms the **exact** element. If \`hashCode\` is inconsistent with \`equals\`, step 1 sends you to the wrong bucket and the element is never found — even though an equal one exists. A poor \`hashCode\` (e.g., returning a constant) is *correct* but degrades every bucket to a list, making operations **O(n)**.`,
      useCases: `- **Map keys**: \`Map<Point, String>\`, \`Map<Employee, Salary>\` — keys need both methods.
- **Set membership/dedup**: \`Set<Order>\`, removing duplicates by value.
- **Caching** keyed by composite values.
- **\`distinct()\` in streams** (Module 7) relies on \`equals\`/\`hashCode\`.`,
      code: `\`\`\`java
import java.util.*;

public class EqualsHashDemo {
    record Point(int x, int y) {}   // record auto-generates equals & hashCode

    public static void main(String[] args) {
        Set<Point> set = new HashSet<>();
        set.add(new Point(1, 2));
        System.out.println(set.contains(new Point(1, 2))); // true (record handles it)

        Map<Point,String> map = new HashMap<>();
        map.put(new Point(0,0), "origin");
        System.out.println(map.get(new Point(0,0)));       // origin

        // demonstrate the bug: a class WITHOUT overrides
        class Bad { int v; Bad(int v){this.v=v;} }
        Set<Bad> bad = new HashSet<>();
        bad.add(new Bad(5));
        System.out.println(bad.contains(new Bad(5)));      // false! identity-based
    }
}
\`\`\``,
      mistakes: `- **Overriding only one** of \`equals\`/\`hashCode\` — breaks hash collections (the #1 bug).
- **Using mutable fields in \`hashCode\`** then mutating a key after inserting — the object becomes unfindable (its bucket no longer matches).
- **Wrong \`equals\` signature** — \`public boolean equals(Point p)\` is an *overload*, not an override; use \`equals(Object)\` and \`@Override\` (Module 2 §2.8).
- **Returning a constant \`hashCode\`** — correct but O(n) performance; all entries collide.
- **Inconsistent fields** — using different fields in \`equals\` vs \`hashCode\`.
- **Violating symmetry/transitivity** — common when comparing across subclasses.`,
      bestPractices: `- **Always override both together**, using the **same significant fields**.
- Use **\`Objects.hash(...)\`** and **\`Objects.equals(...)\`**, or prefer a **\`record\`** for value types (auto-generated, correct).
- Make hash-key fields **immutable** (Module 3 §3.4) so the hash never changes after insertion.
- Start \`equals\` with the \`this == o\` fast path and an \`instanceof\` type check.
- Keep \`hashCode\` cheap and well-distributed; let the IDE/record generate it rather than hand-rolling.`,
      interview: `**Q1. What is the equals/hashCode contract?**
Equal objects must have equal hash codes; \`equals\` must be reflexive, symmetric, transitive, consistent, and false for null. Unequal objects may collide.

**Q2. Why override both together?**
Hash collections use \`hashCode\` to find the bucket and \`equals\` to confirm the element; overriding one without the other makes lookups fail.

**Q3. What happens if two equal objects have different hash codes?**
They may land in different buckets, so a \`HashSet\`/\`HashMap\` won't find one given the other — the object effectively 'disappears'.

**Q4. Is it legal for unequal objects to share a hash code?**
Yes — that's a collision; allowed, but too many collisions degrade performance to O(n).

**Q5. What's wrong with mutating a field used in hashCode after putting the key in a map?**
The key's bucket no longer matches its stored location, so it becomes unfindable.

**Q6. How do records help?**
\`record\`s auto-generate correct \`equals\`/\`hashCode\` (and \`toString\`) from their components.`,
      exercises: `1. Write a \`Money(amount, currency)\` class with correct \`equals\`/\`hashCode\`; verify two equal instances are found in a \`HashSet\`.
2. Show the bug: remove the \`hashCode\` override and demonstrate \`contains\` returns false.
3. Demonstrate the mutable-key bug: put a mutable object in a map, mutate a hashed field, then fail to retrieve it.
4. Convert your class to a \`record\` and confirm behaviour is preserved with no boilerplate.`,
      challenges: `Implement \`equals\`/\`hashCode\` for a class with a mix of fields (an \`int\`, a \`String\`, and a nested object), following all five \`equals\` rules and consistency with \`hashCode\`. Write tests proving reflexivity, symmetry, transitivity, and that it works as both a \`HashSet\` element and a \`HashMap\` key. Then deliberately break symmetry across a subclass and explain why \`HashSet\` behaviour becomes unpredictable.`,
      summary: `- Hash collections use **\`hashCode\`** to find the bucket and **\`equals\`** to confirm the element — **override both, with the same fields**.
- Contract: equal ⇒ equal hash codes; \`equals\` is reflexive/symmetric/transitive/consistent/non-null; collisions are allowed.
- Use \`Objects.hash\`/\`Objects.equals\` or a **\`record\`**; keep key fields **immutable** (Module 3 §3.4).
- Getting this wrong makes objects 'vanish' from sets/maps — the foundation for **§5.8 (HashSet)** and **§5.13 (HashMap)**.`
    }),

    /* 5.4 Comparable & Comparator — ordering elements. */
    topic({
      id: "comparable-comparator", chapter: "5.4", title: "Comparable & Comparator",
      subtitle: "Natural ordering vs custom ordering — sorting and sorted collections.",
      readTime: "17 min", level: "Core", deep: true,
      objectives: [
        "Implement \`Comparable\` for a class's natural ordering.",
        "Build \`Comparator\`s for custom and multi-field ordering.",
        "Use the Java 8 comparator combinators (\`comparing\`, \`thenComparing\`, \`reversed\`).",
        "Understand how sorted collections (\`TreeSet\`/\`TreeMap\`) rely on ordering and consistency with equals."
      ],
      concept: `To **sort** objects or store them in **sorted collections** (\`TreeSet\` §5.10, \`TreeMap\` §5.15), Java needs to know how to **order** them. Two interfaces provide this:

- **\`Comparable<T>\`** — the object's **natural ordering**, via \`int compareTo(T other)\`. Implemented *by the class itself* (one ordering).
- **\`Comparator<T>\`** — an **external** ordering, via \`int compare(T a, T b)\`. A *separate object* (many orderings).

\`\`\`java
class Person implements Comparable<Person> {
    String name; int age;
    public int compareTo(Person o) { return Integer.compare(age, o.age); } // natural: by age
}
Comparator<Person> byName = Comparator.comparing(p -> p.name);             // alternate ordering
\`\`\`

Both return a sign-based \`int\`: **negative** (this before other), **zero** (equal order), **positive** (this after other) — like \`String.compareTo\` (Module 3 §3.3).`,
      why: `One built-in ordering is rarely enough:

- A \`Person\` might be ordered by **age** naturally, but you also need **by name**, **by city**, or **age then name**.
- \`Comparable\` answers "what's the *one* default order?" (baked into the class).
- \`Comparator\` answers "give me *any* order I want, without touching the class" — essential for classes you can't modify (e.g., library types) and for multiple orderings.

Together they power \`Collections.sort\`, \`List.sort\`, \`Arrays.sort\`, streams' \`sorted\` (Module 7), and the sorted collections.`,
      comparison: `**\`Comparable\` vs \`Comparator\` — the core comparison (interview staple):**

| | \`Comparable\` | \`Comparator\` |
|---|---|---|
| Package | \`java.lang\` | \`java.util\` |
| Method | \`compareTo(T o)\` | \`compare(T a, T b)\` |
| Defined where | inside the class (self) | separate class/lambda |
| Number of orderings | one (natural) | many |
| Modifies the class? | yes (implement it) | no |
| Used by | \`Collections.sort(list)\`, \`TreeSet\` (default) | \`Collections.sort(list, cmp)\`, \`TreeSet(cmp)\` |

Mnemonic: **Comparable = "I can compare *myself*"; Comparator = "I compare *two others*."**`,
      java8Combinators: `**Java 8 made \`Comparator\`s declarative** — no more hand-written \`compare\` methods for most cases:

\`\`\`java
import java.util.*;
import static java.util.Comparator.*;

List<Person> people = ...;

people.sort(comparing(Person::getName));                       // by name
people.sort(comparing(Person::getAge).reversed());            // by age, descending
people.sort(comparing(Person::getAge)
              .thenComparing(Person::getName));                // age, then name (tie-break)
people.sort(comparingInt(Person::getAge));                    // primitive-specialized (no boxing)
people.sort(comparing(Person::getCity, nullsLast(naturalOrder()))); // null-safe
\`\`\`

Key combinators: \`comparing\`/\`comparingInt\`/\`comparingDouble\`, \`thenComparing\` (tie-breakers), \`reversed\`, \`naturalOrder\`/\`reverseOrder\`, \`nullsFirst\`/\`nullsLast\`. These replace verbose anonymous classes (Module 7 covers the lambda/method-reference syntax).`,
      internal: `**How sorting/sorted collections use ordering:**

- \`Collections.sort\`/\`List.sort\`/\`Arrays.sort\` (objects) use a stable **TimSort** (adaptive merge sort), O(n log n), calling \`compareTo\`/\`compare\` to order.
- \`TreeSet\`/\`TreeMap\` are **red-black trees** that keep elements ordered using the supplied \`Comparator\` (or natural ordering if none) — they call \`compare\` on every insert/lookup (§5.10/§5.15).

**Critical consistency rule:** a sorted collection determines equality by **\`compareTo\`/\`compare\` returning 0**, NOT \`equals\`. If your ordering is **inconsistent with \`equals\`**, a \`TreeSet\` may treat two \`equals\`-distinct objects as duplicates (or vice-versa). Strive to make \`compareTo\` *consistent with equals* (\`x.compareTo(y)==0\` iff \`x.equals(y)\`) — e.g., \`BigDecimal\` famously violates this (\`"1.0"\` vs \`"1.00"\`), causing surprising \`TreeSet\` behaviour.`,
      useCases: `- **Sorting lists/arrays** by one or more fields.
- **Sorted collections**: \`TreeSet\`/\`TreeMap\` with natural or custom order (§5.10/§5.15).
- **Priority ordering**: \`PriorityQueue\` uses a \`Comparator\` (or natural order) for its heap (§5.11).
- **Top-N / ranking**, leaderboard sorting, multi-key report ordering.
- **Streams**: \`.sorted(comparator)\`, \`.max\`/\`.min\` (Module 7).`,
      code: `\`\`\`java
import java.util.*;

public class OrderingDemo {
    record Person(String name, int age, String city) {}

    public static void main(String[] args) {
        List<Person> people = new ArrayList<>(List.of(
            new Person("Asha", 30, "Pune"),
            new Person("Ravi", 25, "Pune"),
            new Person("Shail", 30, "Delhi")
        ));

        // multi-key: by age asc, then name asc
        people.sort(Comparator.comparingInt(Person::age)
                              .thenComparing(Person::name));
        people.forEach(p -> System.out.println(p.name() + " " + p.age()));
        // Ravi 25 / Asha 30 / Shail 30

        // descending by age
        people.sort(Comparator.comparingInt(Person::age).reversed());

        // a TreeSet with a custom Comparator (ordered by name)
        TreeSet<Person> byName = new TreeSet<>(Comparator.comparing(Person::name));
        byName.addAll(people);
        System.out.println(byName.first().name());   // Asha
    }
}
\`\`\``,
      mistakes: `- **Returning \`a - b\` for ints** in \`compareTo\` — risks **integer overflow**; use \`Integer.compare(a, b)\`.
- **Inconsistent with equals** in a \`TreeSet\`/\`TreeMap\` — elements wrongly merged or duplicated (ordering, not \`equals\`, decides uniqueness there).
- **Forgetting tie-breakers** — unstable-looking results when the primary key has ties; add \`thenComparing\`.
- **NullPointerException** when comparing null fields — use \`nullsFirst\`/\`nullsLast\`.
- **Implementing \`Comparable\` with the wrong signature** (\`compareTo(Object)\`) instead of \`compareTo(T)\`.
- **Mutating fields used for ordering** while the object sits in a sorted collection — corrupts the tree.`,
      bestPractices: `- Implement **\`Comparable\`** only for a clear, single **natural order**; use **\`Comparator\`** for everything else and for classes you can't modify.
- Build comparators with **\`comparing\`/\`thenComparing\`/\`reversed\`** rather than hand-written \`compare\`.
- Use **\`Integer.compare\`/\`Double.compare\`** (or \`comparingInt\`) — never subtraction.
- Make natural ordering **consistent with \`equals\`** (especially for \`TreeSet\`/\`TreeMap\`).
- Handle **nulls** explicitly with \`nullsFirst\`/\`nullsLast\`.`,
      interview: `**Q1. Comparable vs Comparator?**
\`Comparable\` (\`compareTo\`, in \`java.lang\`) defines a class's single natural ordering; \`Comparator\` (\`compare\`, in \`java.util\`) is an external object allowing many orderings without changing the class.

**Q2. What does \`compareTo\`/\`compare\` return?**
A sign-based int: negative, zero, or positive — order before, equal, or after.

**Q3. Why not use \`a - b\` in a comparator?**
Integer overflow can flip the sign; use \`Integer.compare(a, b)\`.

**Q4. How do you sort by multiple fields?**
Chain \`Comparator.comparing(...).thenComparing(...)\`.

**Q5. How does \`TreeSet\` decide duplicates?**
By the comparator/compareTo returning 0 — not by \`equals\`; so ordering should be consistent with \`equals\`.

**Q6. How do you reverse or null-handle an ordering?**
\`.reversed()\`, and \`Comparator.nullsFirst/nullsLast(...)\`.

**Q7. Which sort algorithm does \`Collections.sort\` use?**
A stable TimSort (adaptive merge sort), O(n log n).`,
      exercises: `1. Make \`Student(name, gpa)\` \`Comparable\` by gpa; sort a list and print.
2. Sort the same list by name using a \`Comparator\`, then by gpa-desc-then-name.
3. Build a \`TreeSet\` of students ordered by name and show the consistency-with-equals issue if two students share a name.
4. Replace a hand-written \`Comparator\` (anonymous class) with \`Comparator.comparing\`.`,
      challenges: `Implement a leaderboard: sort \`Player(name, score, level)\` by score desc, then level desc, then name asc, with null-safe handling of a possibly-null \`name\`. Build it once with a hand-written \`compare\` and once with combinators, and verify both produce identical output. Then store the players in a \`TreeSet\` using that comparator and explain why the ordering must be consistent with \`equals\` to avoid losing tied players.`,
      summary: `- **\`Comparable\`** (\`compareTo\`, in the class) = one **natural** order; **\`Comparator\`** (\`compare\`, external) = many custom orders.
- Both return a **sign-based int**; use \`Integer.compare\` (never subtraction) and \`thenComparing\` for tie-breakers.
- Java 8 **combinators** (\`comparing\`/\`reversed\`/\`nullsLast\`) make comparators declarative (Module 7).
- Sorted collections (**§5.10 TreeSet, §5.15 TreeMap, §5.11 PriorityQueue**) order by comparison; keep it **consistent with \`equals\`** (§5.3).`
    }),

    /* ===================== CORE: LIST ===================== */

    /* 5.5 ArrayList — resizable array, the default List. */
    topic({
      id: "arraylist", chapter: "5.5", title: "ArrayList",
      subtitle: "The resizable-array List — fast random access, the everyday default.",
      readTime: "16 min", level: "Core", deep: true,
      objectives: [
        "Explain ArrayList's backing array and dynamic resizing.",
        "Know the Big-O of its core operations.",
        "Use capacity, \`ensureCapacity\`, and \`trimToSize\` to tune performance.",
        "Choose ArrayList vs LinkedList (§5.6) correctly."
      ],
      concept: `**\`ArrayList\`** is a **resizable-array** implementation of the \`List\` interface — an ordered sequence with fast index access that grows automatically as you add elements. It's the **default \`List\`** you reach for unless you have a specific reason not to.

\`\`\`java
List<String> list = new ArrayList<>();
list.add("a");          // append
list.add(0, "x");       // insert at index
String s = list.get(1); // O(1) random access
list.set(1, "b");       // replace
list.remove("x");       // remove by value
\`\`\`

Internally it wraps a plain \`Object[]\`; \`get\`/\`set\` by index are array lookups, which is why they're **O(1)**.`,
      why: `\`ArrayList\` is the workhorse list because most code **reads by index and appends** far more than it inserts/removes in the middle:

- **O(1) random access** — \`get(i)\`/\`set(i)\` are direct array indexing.
- **Cache-friendly** — contiguous memory means fast iteration (CPU cache locality), usually beating \`LinkedList\` in practice even for traversal.
- **Amortised O(1) append** — adding at the end is cheap on average.

Its weakness is **inserting/removing in the middle** (O(n) shifting), where other structures may win.`,
      bigO: `**Time complexity — memorise this table (interview essential):**

| Operation | Time | Why |
|---|---|---|
| \`get(i)\` / \`set(i)\` | **O(1)** | direct array index |
| \`add(e)\` (append) | **O(1) amortised** | occasional resize copies |
| \`add(i, e)\` (insert) | **O(n)** | shift elements right |
| \`remove(i)\` / \`remove(obj)\` | **O(n)** | shift elements left (+ search for obj) |
| \`contains\` / \`indexOf\` | **O(n)** | linear scan |
| iteration | **O(n)** | |

"Amortised O(1)" for append: most adds are O(1); only when the array fills does it resize (an O(n) copy), but that cost is spread thinly across many adds.`,
      internal: `**Resizing — the key internal detail:**

- A new \`ArrayList\` starts empty; on first add it allocates a backing array of **default capacity 10**.
- When the array is full, it **grows by ~50%**: \`newCapacity = oldCapacity + (oldCapacity >> 1)\` (i.e., 1.5×), then **copies** all elements to the new array (\`Arrays.copyOf\`) — an O(n) step.
- **Capacity** (array size) ≠ **size** (element count). Spare capacity avoids resizing on every add.

\`\`\`java
List<Integer> list = new ArrayList<>(1000);  // pre-size if you know the count -> no resizes
\`\`\`

- \`ensureCapacity(n)\` pre-grows; \`trimToSize()\` shrinks the array to the current size to reclaim memory.
- \`ArrayList\` is **not synchronized** (not thread-safe) — see \`Vector\`/\`Collections.synchronizedList\`/\`CopyOnWriteArrayList\` (§5.7, §5.18, Module 8).
- Its iterator is **fail-fast** (§5.2).`,
      useCases: `- **Default list** for storing and reading ordered data.
- **Index-heavy access** (random reads, replace by position).
- **Building a list then iterating** (results, rows, items).
- Anywhere you'd use an array but need **dynamic size** and the \`List\` API.`,
      code: `\`\`\`java
import java.util.*;

public class ArrayListDemo {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>(16);   // pre-sized to avoid early resizes
        for (int i = 0; i < 10; i++) list.add(i * i);

        System.out.println(list.get(5));            // 25  (O(1))
        list.add(0, -1);                            // O(n) shift
        list.remove(Integer.valueOf(81));           // remove value (O(n))
        System.out.println(list.contains(16));      // true (O(n))

        // bulk + sort
        list.sort(Comparator.reverseOrder());       // O(n log n) (§5.4)
        System.out.println(list);

        // safe removal during iteration (§5.2)
        list.removeIf(n -> n != null && n < 0);
    }
}
\`\`\``,
      mistakes: `- **Frequent middle insert/remove** in big lists — O(n) each; consider a different structure or batch operations.
- **\`remove(int)\` vs \`remove(Object)\` confusion** — \`list.remove(2)\` removes **index 2**; \`list.remove(Integer.valueOf(2))\` removes the **value** 2 (classic \`Integer\` trap).
- **Not pre-sizing** when the element count is known — causes repeated resize copies.
- **Assuming thread-safety** — \`ArrayList\` isn't synchronized.
- **Modifying during for-each** — \`ConcurrentModificationException\` (§5.2).`,
      bestPractices: `- Use \`ArrayList\` as the **default \`List\`**; declare the variable as \`List\` (program to interface, §5.1).
- **Pre-size** with \`new ArrayList<>(n)\` or \`ensureCapacity\` when the size is known.
- Prefer **\`removeIf\`** / \`Iterator.remove\` for conditional removal (§5.2).
- Be deliberate with **\`remove(int)\` vs \`remove(Object)\`**.
- For concurrency, wrap with \`Collections.synchronizedList\` or use \`CopyOnWriteArrayList\` (§5.18, Module 8).`,
      interview: `**Q1. How does ArrayList grow?**
It wraps an \`Object[]\` (default capacity 10) and, when full, grows ~1.5× and copies elements to a new array (\`Arrays.copyOf\`).

**Q2. Big-O of \`get\`, \`add\` (append), and \`add(index)\`?**
\`get\` O(1); append amortised O(1); insert at index O(n) (shifting).

**Q3. ArrayList vs LinkedList?**
ArrayList: O(1) random access, cache-friendly, O(n) middle insert. LinkedList: O(1) insert/remove at known nodes/ends, but O(n) random access (§5.6).

**Q4. \`remove(2)\` vs \`remove(Integer.valueOf(2))\`?**
The first removes index 2; the second removes the value 2 — an overloading gotcha for \`Integer\` lists.

**Q5. Is ArrayList thread-safe?**
No — use \`Collections.synchronizedList\`, \`CopyOnWriteArrayList\`, or external sync (Module 8).

**Q6. What's the difference between capacity and size?**
Capacity is the backing array length; size is the number of elements stored.`,
      exercises: `1. Create an \`ArrayList\`, append 1000 ints, and demonstrate \`get\` is fast regardless of index.
2. Show the \`remove(int)\` vs \`remove(Object)\` difference on an \`Integer\` list.
3. Pre-size a list and (conceptually) compare resize counts vs an unsized list.
4. Use \`removeIf\` to filter a list in place and confirm no \`ConcurrentModificationException\`.`,
      challenges: `Implement your own \`DynamicArray<T>\` backed by an \`Object[]\` with \`add\`, \`get\`, \`set\`, \`remove(index)\`, and automatic 1.5× growth on overflow. Track and print the number of resize/copy operations while adding N elements with and without pre-sizing, and explain why append is amortised O(1) despite the O(n) copies. Compare its random-access vs middle-insert costs to motivate §5.6.`,
      summary: `- **\`ArrayList\`** = resizable \`Object[]\`; **O(1)** \`get\`/\`set\`, **amortised O(1)** append, **O(n)** middle insert/remove and search.
- Grows ~**1.5×** (copy) from default capacity **10**; **pre-size** to avoid resizes; capacity ≠ size.
- **Not thread-safe**; iterator is **fail-fast**; mind **\`remove(int)\` vs \`remove(Object)\`**.
- The **default \`List\`**; contrast with **\`LinkedList\` (§5.6)** for middle/ends-heavy workloads.`
    }),

    /* 5.6 LinkedList — doubly-linked list, also a Deque. */
    topic({
      id: "linkedlist", chapter: "5.6", title: "LinkedList",
      subtitle: "A doubly-linked list — fast ends, slow random access, also a Deque.",
      readTime: "15 min", level: "Core", deep: true,
      objectives: [
        "Describe LinkedList's doubly-linked node structure.",
        "Compare its Big-O with ArrayList (§5.5) and know when each wins.",
        "Use it as a List, Queue, Deque, or Stack.",
        "Avoid the random-access trap (index-based loops)."
      ],
      concept: `**\`LinkedList\`** implements \`List\` **and** \`Deque\` (§5.12) as a **doubly-linked list**: each element is a **node** holding the value plus references to the **previous** and **next** nodes. There is no backing array and no index math — to reach position *i*, it walks the links.

\`\`\`java
LinkedList<String> dq = new LinkedList<>();
dq.addFirst("a");      // O(1) at the head
dq.addLast("b");       // O(1) at the tail
dq.removeFirst();      // O(1)
String x = dq.get(5);  // O(n) — must traverse from an end
\`\`\`

Because it's also a \`Deque\`, it doubles as a **queue** (FIFO) or **stack** (LIFO).`,
      why: `\`LinkedList\` shines when you frequently **add/remove at the ends** (or at a node you already hold) and rarely need random access:

- **O(1) insert/remove at head/tail** — just relink a couple of pointers, no shifting.
- **O(1) insert/remove at a known node** (via a \`ListIterator\` positioned there).
- Natural fit for **queue/deque/stack** semantics.

Its weakness is **random access** (\`get(i)\` is O(n)) and **memory overhead** (each node stores two extra references), and poor **cache locality** — which is why \`ArrayList\` often wins in practice even for iteration.`,
      bigO: `**ArrayList vs LinkedList — the decisive comparison:**

| Operation | \`ArrayList\` | \`LinkedList\` |
|---|---|---|
| \`get(i)\` / \`set(i)\` | **O(1)** | **O(n)** (traverse) |
| add/remove at **end** | amortised O(1) | **O(1)** |
| add/remove at **front** | O(n) (shift) | **O(1)** |
| add/remove at **middle** | O(n) (shift) | O(n) to *find* + O(1) to relink |
| \`contains\`/search | O(n) | O(n) |
| memory per element | low (array slot) | higher (node + 2 refs) |
| cache locality | excellent | poor |

> Practical truth: \`ArrayList\` is the better default. Choose \`LinkedList\` mainly when you need **\`Deque\`/queue** behaviour or heavy **front/end** mutation — and even then \`ArrayDeque\` (§5.12) is usually faster.`,
      internal: `Each node is roughly \`{ prev, item, next }\`. The list keeps references to the **first** and **last** nodes, so head/tail operations are O(1). \`get(i)\` is optimized slightly: it traverses from whichever **end is closer** to \`i\`, but it's still O(n). Key consequences:

- An **index-based loop** (\`for (i...) list.get(i)\`) is **O(n²)** on a \`LinkedList\` — a notorious performance bug. Use the **iterator/for-each** (O(n)) instead.
- \`LinkedList\` is **not synchronized**; its iterator is **fail-fast** (§5.2).
- As a \`Deque\` it provides \`addFirst/Last\`, \`pollFirst/Last\`, \`peekFirst/Last\`, plus \`Queue\` (\`offer\`/\`poll\`/\`peek\`) and \`Stack\` (\`push\`/\`pop\`) methods (§5.11/§5.12).`,
      useCases: `- **Queue / Deque / Stack** implementations (though \`ArrayDeque\` §5.12 is usually preferred).
- **Frequent head/tail insertion/removal** (e.g., a sliding window, an LRU-ish list).
- **Iterator-based middle edits** where you already hold a \`ListIterator\` position.
- Rarely the right choice purely as an indexed \`List\` — prefer \`ArrayList\` (§5.5).`,
      code: `\`\`\`java
import java.util.*;

public class LinkedListDemo {
    public static void main(String[] args) {
        LinkedList<Integer> dq = new LinkedList<>();

        // as a Deque/queue/stack
        dq.offer(1); dq.offer(2);        // enqueue (tail)
        dq.push(0);                       // stack push (head)
        System.out.println(dq.poll());    // 0  (removes head)
        System.out.println(dq.peekLast()); // 2

        // the random-access trap:
        LinkedList<Integer> big = new LinkedList<>();
        for (int i = 0; i < 100000; i++) big.add(i);
        // ❌ O(n^2): for (int i=0;i<big.size();i++) big.get(i);
        // ✅ O(n):
        long sum = 0;
        for (int v : big) sum += v;       // iterator traversal
        System.out.println(sum);
    }
}
\`\`\``,
      mistakes: `- **Index-based loops** over a \`LinkedList\` — \`get(i)\` in a loop is **O(n²)**; iterate with for-each.
- **Choosing \`LinkedList\` for "fast inserts"** without realizing you first pay O(n) to *find* the middle position.
- **Using it as a general list** expecting array-like access speed.
- **Assuming thread-safety** — it isn't synchronized.
- **Ignoring \`ArrayDeque\`** — it's usually a faster queue/stack than \`LinkedList\` (§5.12).`,
      bestPractices: `- Prefer **\`ArrayList\`** (§5.5) as the default list; pick \`LinkedList\` for genuine **deque/queue** or heavy front/end mutation.
- Even for queue/stack, prefer **\`ArrayDeque\`** (§5.12) unless you need \`List\` indexing too.
- **Never** use \`get(i)\` in a loop on a \`LinkedList\`; use the iterator/for-each.
- Hold a **\`ListIterator\`** to do O(1) inserts/removes at a traversal position.
- For concurrency, use concurrent queues (\`ConcurrentLinkedQueue\`, \`LinkedBlockingQueue\`, Module 8).`,
      interview: `**Q1. How is LinkedList implemented?**
As a doubly-linked list of nodes (each with prev/next references); it implements both \`List\` and \`Deque\`.

**Q2. ArrayList vs LinkedList Big-O?**
ArrayList: O(1) random access, O(n) middle insert. LinkedList: O(1) ends, O(n) random access; both O(n) search.

**Q3. Why is an index loop slow on LinkedList?**
\`get(i)\` traverses from an end (O(n)); doing it for every index makes the loop O(n²).

**Q4. When is LinkedList a good choice?**
Frequent head/tail add/remove or deque/queue usage where random access isn't needed.

**Q5. Is ArrayList or LinkedList usually faster in practice?**
ArrayList — contiguous memory gives better cache locality even for iteration.

**Q6. What interfaces does LinkedList implement?**
\`List\`, \`Deque\` (and thus \`Queue\`); it can act as list, queue, deque, or stack.`,
      exercises: `1. Use \`LinkedList\` as a queue (\`offer\`/\`poll\`) and as a stack (\`push\`/\`pop\`).
2. Demonstrate the O(n²) index-loop vs O(n) for-each on a large \`LinkedList\` (time both).
3. Insert and remove at both ends and confirm O(1) behaviour conceptually.
4. Compare memory intuition: why a \`LinkedList\` of 1M ints uses more memory than an \`ArrayList\`.`,
      challenges: `Implement a simple LRU cache shell using \`LinkedList\` for recency order plus a \`HashMap\` for O(1) lookup (move-to-front on access, evict from the tail). Discuss why \`LinkedList\`'s O(1) end operations help but its O(n) \`remove(object)\` hurts, and how \`LinkedHashMap\` (§5.14) with access-order solves the same problem more elegantly.`,
      summary: `- **\`LinkedList\`** = doubly-linked nodes implementing \`List\` **and** \`Deque\`: **O(1)** ends, **O(n)** random access, higher memory, poor cache locality.
- **Never** use \`get(i)\` loops (O(n²)); iterate with for-each.
- Good for **deque/queue/stack** and front/end-heavy work — but **\`ArrayDeque\` (§5.12)** is usually a faster queue/stack and **\`ArrayList\` (§5.5)** the better default list.
- Not thread-safe; iterator is fail-fast (§5.2).`
    }),

    /* 5.7 Vector & Stack — legacy synchronized classes. */
    topic({
      id: "vector-stack", chapter: "5.7", title: "Vector & Stack (Legacy)",
      subtitle: "The original synchronized list and stack — what they are and what to use instead.",
      readTime: "13 min", level: "Core", deep: true,
      objectives: [
        "Explain Vector and Stack and their synchronized nature.",
        "Compare Vector with ArrayList (§5.5) and its growth policy.",
        "Understand why Stack is discouraged and what replaces it.",
        "Know the modern alternatives (ArrayDeque, CopyOnWriteArrayList, ConcurrentHashMap)."
      ],
      concept: `**\`Vector\`** is a **legacy** resizable-array list (since Java 1.0) — essentially an **\`ArrayList\` whose methods are \`synchronized\`** (thread-safe). **\`Stack\`** extends \`Vector\` to add LIFO operations (\`push\`, \`pop\`, \`peek\`). Both predate the Collections Framework and were **retrofitted** into it.

\`\`\`java
Vector<String> v = new Vector<>();
v.add("a"); v.add("b");
Stack<Integer> st = new Stack<>();
st.push(1); st.push(2);
System.out.println(st.pop());   // 2 (LIFO)
\`\`\`

They still work and appear in old code/interviews, but for new code there are **better choices** (below).`,
      why: `They exist for **historical** reasons: when Java shipped, \`Vector\`/\`Hashtable\` were the only dynamic collections, and they were made thread-safe by default. When the Collections Framework arrived (Java 2), the **unsynchronized** \`ArrayList\`/\`HashMap\` were added because:

- Most code is single-threaded and shouldn't pay for locking on **every** method.
- Per-method synchronization doesn't make **compound** operations atomic anyway (you still need external coordination — Module 8).

So \`Vector\`/\`Stack\` linger mainly as legacy; you should understand them but rarely use them.`,
      vectorVsArrayList: `**\`Vector\` vs \`ArrayList\` — a classic interview comparison:**

| | \`Vector\` | \`ArrayList\` |
|---|---|---|
| Synchronized? | yes (every method) | no |
| Speed (single-thread) | slower (locking) | faster |
| Growth when full | **doubles** (2×) | **1.5×** (§5.5) |
| Since | 1.0 (legacy) | 1.2 |
| Iterator | fail-fast | fail-fast |
| Recommended? | no (legacy) | yes |

Both are resizable arrays with O(1) random access; the differences are **synchronization** and **growth factor** (Vector doubles, ArrayList grows 50%).`,
      stackProblem: `**Why \`Stack\` is discouraged:** it **extends \`Vector\`**, so it inherits the *entire* \`Vector\` API — including methods that violate stack semantics. You can \`get(i)\`, \`add(i, e)\`, or \`insertElementAt\` into the "middle" of a stack, which makes no conceptual sense. This is a textbook case of **inheritance misuse** (Module 2 §2.6 — "is-a" gone wrong; a stack is *not* a vector).

**The modern replacement is \`ArrayDeque\` (§5.12):**

\`\`\`java
Deque<Integer> stack = new ArrayDeque<>();   // preferred over java.util.Stack
stack.push(1); stack.push(2);
System.out.println(stack.pop());   // 2
\`\`\`

\`ArrayDeque\` as a stack is **faster** (no synchronization) and exposes only sensible LIFO operations.`,
      internal: `Each \`Vector\`/\`Stack\` public method acquires the object's intrinsic lock (like \`StringBuffer\`, Module 3 §3.8). That guarantees individual operations are atomic but **not sequences** — \`if (!v.isEmpty()) v.remove(0)\` can still race between the check and the remove (Module 8). The locking also costs performance even with one thread. \`Vector\` doubles its capacity on growth (vs ArrayList's 1.5×), trading more memory for fewer resizes. Both remain **fail-fast** on iteration (§5.2).`,
      modernAlternatives: `**What to use instead (today):**

| Legacy | Modern replacement |
|---|---|
| \`Vector\` (need a list) | \`ArrayList\` (§5.5) |
| \`Vector\` (need thread-safety) | \`Collections.synchronizedList\` (§5.18) or \`CopyOnWriteArrayList\` (Module 8) |
| \`Stack\` | \`ArrayDeque\` as a stack (§5.12) |
| \`Hashtable\` | \`HashMap\` (§5.13) or \`ConcurrentHashMap\` (§5.17) |

Modern concurrent collections (\`java.util.concurrent\`) offer far better scalability than blanket method synchronization (Module 8).`,
      useCases: `- **Maintaining legacy code** that already uses \`Vector\`/\`Stack\`.
- **Quick thread-safe-ish list** in trivial cases (still prefer concurrent collections).
- **Interview discussion** of why these are legacy and what replaced them.
- Realistically: in **new code**, reach for \`ArrayList\`/\`ArrayDeque\`/concurrent collections instead.`,
      code: `\`\`\`java
import java.util.*;

public class LegacyDemo {
    public static void main(String[] args) {
        // legacy Stack (works, but discouraged)
        Stack<Integer> legacy = new Stack<>();
        legacy.push(1); legacy.push(2);
        legacy.add(0, 99);                 // ❌ allowed by Vector — breaks stack semantics!
        System.out.println(legacy);        // [99, 1, 2]

        // modern stack via ArrayDeque (preferred, §5.12)
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(1); stack.push(2);
        System.out.println(stack.pop());   // 2
        // no get(i)/add(i,e) to misuse — only deque/stack ops
    }
}
\`\`\``,
      mistakes: `- **Using \`Vector\`/\`Stack\` in new code** — prefer \`ArrayList\`/\`ArrayDeque\`.
- **Relying on \`Vector\`'s synchronization for compound atomicity** — individual methods are atomic, sequences are not (Module 8).
- **Treating \`Stack\` as a pure stack** — its inherited \`Vector\` methods let you corrupt LIFO order.
- **Assuming \`Vector\` is faster** — its locking makes it slower single-threaded.
- **Forgetting the growth difference** (Vector doubles, ArrayList 1.5×) when asked in interviews.`,
      bestPractices: `- For a list: use **\`ArrayList\`**; for a stack/queue: use **\`ArrayDeque\`** (§5.12).
- For thread-safe collections, use **\`java.util.concurrent\`** (\`ConcurrentHashMap\`, \`CopyOnWriteArrayList\`) or \`Collections.synchronized*\` — not \`Vector\`/\`Hashtable\` (Module 8).
- Treat \`Vector\`/\`Stack\` as **read-only knowledge** for legacy maintenance and interviews.
- If you must keep \`Stack\`, restrict yourself to \`push\`/\`pop\`/\`peek\` and avoid the inherited list methods.`,
      interview: `**Q1. Difference between Vector and ArrayList?**
\`Vector\` is synchronized (thread-safe, slower) and grows 2×; \`ArrayList\` is unsynchronized (faster) and grows 1.5×. Prefer \`ArrayList\`.

**Q2. Why is \`Stack\` discouraged?**
It extends \`Vector\`, inheriting list methods (\`get\`, \`add(index)\`) that break stack semantics; use \`ArrayDeque\` instead.

**Q3. What replaces Vector and Stack today?**
\`ArrayList\` (or concurrent collections) for lists; \`ArrayDeque\` for stacks; \`ConcurrentHashMap\` for \`Hashtable\`.

**Q4. Does Vector's synchronization make compound operations safe?**
No — only individual methods are atomic; check-then-act sequences still need external synchronization.

**Q5. Are Vector/Stack still in the Collections Framework?**
Yes — retrofitted to implement \`List\`, but considered legacy.

**Q6. Growth factor of Vector vs ArrayList?**
Vector doubles (2×); ArrayList grows by ~50% (1.5×).`,
      exercises: `1. Show that a \`Stack\` lets you call \`add(0, x)\`, violating LIFO; then rewrite using \`ArrayDeque\`.
2. Compare \`Vector\` and \`ArrayList\` APIs and note the synchronized methods.
3. Replace a \`Vector\` field with \`Collections.synchronizedList(new ArrayList<>())\` and discuss the difference.
4. State the growth factor of each and why it matters for memory.`,
      challenges: `Take a legacy snippet that uses \`Vector\` and \`Stack\` (with some misuse of inherited methods) and modernize it: \`ArrayList\` for the list, \`ArrayDeque\` for the stack, and a concurrent collection where thread-safety is actually needed. Write a short rationale explaining the inheritance-misuse problem in \`Stack\` (Module 2 §2.6/§2.15: favour composition over inheritance) and why blanket synchronization is inferior to \`java.util.concurrent\` (Module 8).`,
      summary: `- **\`Vector\`** = legacy synchronized \`ArrayList\` (grows 2× vs 1.5×); **\`Stack\`** extends \`Vector\` and adds LIFO ops.
- Both are **legacy**: \`Vector\`'s locking is slow and not compound-atomic; \`Stack\` leaks list methods that break stack semantics (inheritance misuse).
- Use **\`ArrayList\`** for lists, **\`ArrayDeque\` (§5.12)** for stacks/queues, **concurrent collections** for thread-safety (Module 8).
- Know them for legacy code and interviews; avoid in new code.`
    }),

    /* ===================== CORE: SET ===================== */

    /* 5.8 HashSet — unordered unique elements via hashing. */
    topic({
      id: "hashset", chapter: "5.8", title: "HashSet",
      subtitle: "Unique elements with O(1) operations — backed by a HashMap.",
      readTime: "15 min", level: "Core", deep: true,
      objectives: [
        "Explain how HashSet guarantees uniqueness using hashing.",
        "Know its Big-O and that it is unordered.",
        "Connect its correctness to the equals/hashCode contract (§5.3).",
        "Choose HashSet vs LinkedHashSet (§5.9) vs TreeSet (§5.10)."
      ],
      concept: `**\`HashSet\`** is a \`Set\` implementation that stores **unique** elements with **no guaranteed order**, offering **O(1) average** \`add\`, \`remove\`, and \`contains\`. It rejects duplicates automatically.

\`\`\`java
Set<String> set = new HashSet<>();
set.add("a");
set.add("a");          // ignored — already present
set.add("b");
System.out.println(set.size());        // 2
System.out.println(set.contains("a")); // true (O(1) average)
\`\`\`

Order is **unpredictable** and may change as the set grows — never rely on iteration order from a \`HashSet\`.`,
      why: `Use \`HashSet\` whenever you need **fast membership testing** or **deduplication**:

- "Have I seen this before?" in O(1) — visited sets, seen-IDs, caches of keys.
- Removing duplicates from a collection (\`new HashSet<>(list)\`).
- Set algebra: union/intersection/difference via \`addAll\`/\`retainAll\`/\`removeAll\`.

It trades **ordering** for **speed** — if you need order, use \`LinkedHashSet\` (§5.9) or \`TreeSet\` (§5.10).`,
      internal: `**Key internal fact: \`HashSet\` is backed by a \`HashMap\`.** Each element is stored as a **key** in an internal \`HashMap\`, with a shared dummy value (\`PRESENT\`). So \`HashSet\` inherits all of \`HashMap\`'s mechanics (buckets, load factor 0.75, resize, treeification — detailed in §5.13):

\`\`\`java
// conceptually:
private final HashMap<E, Object> map = new HashMap<>();
private static final Object PRESENT = new Object();
public boolean add(E e) { return map.put(e, PRESENT) == null; }
\`\`\`

Therefore:

- \`add\`/\`contains\`/\`remove\` are **O(1) average**, **O(n) worst case** (many hash collisions degrading a bucket — mitigated by treeification in §5.13).
- Correctness **depends entirely on \`equals\`/\`hashCode\`** (§5.3): a class with broken overrides will allow "duplicate" elements or fail \`contains\`.
- It permits **one \`null\`** element. It is **not synchronized**; iterator is **fail-fast** (§5.2).`,
      bigO: `**Set implementations at a glance (preview of §5.9/§5.10):**

| | \`HashSet\` | \`LinkedHashSet\` | \`TreeSet\` |
|---|---|---|---|
| Ordering | none | insertion order | sorted |
| add/remove/contains | **O(1)** avg | O(1) avg | **O(log n)** |
| backed by | \`HashMap\` | \`LinkedHashMap\` | \`TreeMap\` (red-black tree) |
| null allowed | one | one | no (with natural ordering) |
| needs | \`equals\`/\`hashCode\` | \`equals\`/\`hashCode\` | \`Comparable\`/\`Comparator\` |

Pick \`HashSet\` for **pure speed**, \`LinkedHashSet\` to **preserve insertion order**, \`TreeSet\` for **sorted** elements.`,
      useCases: `- **Deduplication**: \`new HashSet<>(listWithDuplicates)\`.
- **Fast membership**: visited/seen sets in algorithms (graph traversal, Module 14).
- **Set operations**: union (\`addAll\`), intersection (\`retainAll\`), difference (\`removeAll\`).
- **Unique keys/tags** where order doesn't matter.`,
      code: `\`\`\`java
import java.util.*;

public class HashSetDemo {
    public static void main(String[] args) {
        List<Integer> nums = List.of(1, 2, 2, 3, 3, 3, 4);
        Set<Integer> unique = new HashSet<>(nums);   // dedupe
        System.out.println(unique.size());            // 4

        // set algebra
        Set<Integer> a = new HashSet<>(Set.of(1,2,3,4));
        Set<Integer> b = new HashSet<>(Set.of(3,4,5,6));
        Set<Integer> inter = new HashSet<>(a); inter.retainAll(b); // {3,4}
        Set<Integer> union = new HashSet<>(a); union.addAll(b);    // {1..6}
        Set<Integer> diff  = new HashSet<>(a); diff.removeAll(b);  // {1,2}
        System.out.println(inter + " " + union + " " + diff);

        // correctness depends on equals/hashCode (§5.3)
        record P(int x,int y){}
        Set<P> pts = new HashSet<>();
        pts.add(new P(1,1)); pts.add(new P(1,1));
        System.out.println(pts.size());               // 1 (record handles equals/hashCode)
    }
}
\`\`\``,
      mistakes: `- **Relying on iteration order** — \`HashSet\` is unordered and order can change on resize.
- **Storing elements with broken \`equals\`/\`hashCode\`** — duplicates sneak in or \`contains\` fails (§5.3).
- **Mutating an element after adding it** in a way that changes its hash — it becomes unfindable.
- **Expecting thread-safety** — it isn't synchronized.
- **Assuming O(1) always** — pathological hashing degrades to O(n) (mitigated by treeification, §5.13).`,
      bestPractices: `- Use \`HashSet\` as the **default \`Set\`** for speed and dedup; declare the variable as \`Set\`.
- Ensure elements have **correct, consistent \`equals\`/\`hashCode\`** (use records/\`Objects.hash\`, §5.3) and are **immutable** for stable hashing.
- Pre-size with \`new HashSet<>(expectedSize)\` for large sets to reduce resizes.
- Use **\`LinkedHashSet\`** (§5.9) when you need predictable iteration order; **\`TreeSet\`** (§5.10) for sorted order.
- For concurrency, use \`ConcurrentHashMap.newKeySet()\` or \`Collections.synchronizedSet\` (§5.18, Module 8).`,
      interview: `**Q1. How does HashSet ensure uniqueness?**
It stores elements as keys in an internal \`HashMap\`; \`add\` calls \`put\`, and a duplicate key (by \`equals\`/\`hashCode\`) is not re-added.

**Q2. What is HashSet backed by?**
A \`HashMap\` (elements are keys, value is a shared dummy \`PRESENT\`).

**Q3. Big-O of HashSet operations?**
O(1) average for add/remove/contains; O(n) worst case under heavy collisions.

**Q4. Does HashSet maintain order?**
No — it's unordered; use \`LinkedHashSet\` (insertion order) or \`TreeSet\` (sorted).

**Q5. What does HashSet require of its elements?**
Correct, consistent \`equals\`/\`hashCode\` (§5.3); otherwise duplicates/lookups misbehave.

**Q6. Can HashSet contain null?**
Yes — a single \`null\` element.`,
      exercises: `1. Deduplicate a list with \`new HashSet<>(list)\` and print the size difference.
2. Implement union/intersection/difference with \`addAll\`/\`retainAll\`/\`removeAll\`.
3. Add custom objects without \`equals\`/\`hashCode\` and show duplicates leak in; fix with a record.
4. Show that \`HashSet\` iteration order is not insertion order, then switch to \`LinkedHashSet\`.`,
      challenges: `Use a \`HashSet\` as a "visited" set to detect a cycle in a linked structure (or duplicate detection in a stream of IDs) in O(n). Then measure how a deliberately bad \`hashCode\` (constant) degrades performance to O(n) per operation, and relate the fix to \`HashMap\` treeification (§5.13) and the \`equals\`/\`hashCode\` contract (§5.3).`,
      summary: `- **\`HashSet\`** = unordered unique elements, **O(1)** avg add/remove/contains, **backed by a \`HashMap\`**.
- Correctness depends on **\`equals\`/\`hashCode\` (§5.3)**; allows one \`null\`; not thread-safe; fail-fast.
- No order guarantee — use **\`LinkedHashSet\` (§5.9)** for insertion order, **\`TreeSet\` (§5.10)** for sorted.
- Great for **dedup**, **membership**, and **set algebra**; internals mirror \`HashMap\` (§5.13).`
    }),

    /* 5.9 LinkedHashSet — insertion-ordered HashSet. */
    topic({
      id: "linkedhashset", chapter: "5.9", title: "LinkedHashSet",
      subtitle: "A HashSet that remembers insertion order.",
      readTime: "11 min", level: "Core", deep: true,
      objectives: [
        "Explain how LinkedHashSet preserves insertion order.",
        "Compare it with HashSet (§5.8) and TreeSet (§5.10).",
        "Understand the small overhead it adds.",
        "Pick it when predictable iteration order matters."
      ],
      concept: `**\`LinkedHashSet\`** is a \`HashSet\` (§5.8) that additionally maintains a **doubly-linked list** through its entries, so iteration follows **insertion order** while keeping near–O(1) performance.

\`\`\`java
Set<String> set = new LinkedHashSet<>();
set.add("banana"); set.add("apple"); set.add("cherry");
System.out.println(set);   // [banana, apple, cherry] — insertion order preserved
\`\`\`

It's the middle ground: the **speed of hashing** plus **predictable ordering**.`,
      why: `Sometimes you need uniqueness *and* a stable, reproducible order:

- **Deterministic output** — printing/serializing a set the same way every run.
- **Ordered dedup** — remove duplicates from a list while keeping the **first-seen order**.
- **Caches/menus** where insertion order is meaningful but you still want O(1) lookups.

\`HashSet\` gives no order; \`TreeSet\` sorts (and is slower); \`LinkedHashSet\` preserves the order you put things in.`,
      internal: `\`LinkedHashSet\` extends \`HashSet\` but is backed by a **\`LinkedHashMap\`** (§5.14) instead of a plain \`HashMap\`. Each entry, besides its bucket links, also has **before/after** pointers forming a linked list in insertion order. Consequences:

- \`add\`/\`remove\`/\`contains\` remain **O(1) average** (hashing), plus a couple of pointer updates.
- Iteration is **O(n)** in **insertion order** (re-inserting an existing element does **not** change its position).
- Slightly **more memory** than \`HashSet\` (two extra references per entry) and marginally slower.
- Allows one \`null\`; not synchronized; fail-fast (§5.2).`,
      comparison: `**The three sets, decided by ordering need:**

| | \`HashSet\` | \`LinkedHashSet\` | \`TreeSet\` |
|---|---|---|---|
| Order | none | **insertion** | sorted |
| add/contains | O(1) | O(1) | O(log n) |
| memory | lowest | medium | medium |
| needs | equals/hashCode | equals/hashCode | Comparable/Comparator |
| use when | speed only | speed + predictable order | sorted order |`,
      useCases: `- **Order-preserving deduplication** of a list (keep first occurrence order).
- **Reproducible iteration** for logging, tests, and serialization.
- **LRU-style structures** (with access-order \`LinkedHashMap\`, §5.14) — the set analog keeps insertion order.
- Any \`Set\` use where consumers expect a stable order.`,
      code: `\`\`\`java
import java.util.*;

public class LinkedHashSetDemo {
    static <T> List<T> dedupKeepOrder(List<T> in) {
        return new ArrayList<>(new LinkedHashSet<>(in)); // unique + first-seen order
    }
    public static void main(String[] args) {
        List<String> in = List.of("b","a","b","c","a","d");
        System.out.println(dedupKeepOrder(in));   // [b, a, c, d]

        Set<Integer> s = new LinkedHashSet<>();
        s.add(3); s.add(1); s.add(2); s.add(1);   // re-add of 1 keeps original position
        System.out.println(s);                    // [3, 1, 2]
    }
}
\`\`\``,
      mistakes: `- **Expecting sorted order** — it preserves *insertion* order, not sorted order (use \`TreeSet\`).
- **Thinking re-adding moves an element** — re-inserting an existing element keeps its original position.
- **Using it when order is irrelevant** — \`HashSet\` is slightly leaner/faster.
- **Assuming thread-safety** — it isn't synchronized.
- **Same \`equals\`/\`hashCode\` pitfalls** as \`HashSet\` (§5.3).`,
      bestPractices: `- Choose \`LinkedHashSet\` when you need **uniqueness + predictable iteration order** at near-\`HashSet\` speed.
- Use it for **order-preserving dedup** (\`new ArrayList<>(new LinkedHashSet<>(list))\`).
- Prefer plain \`HashSet\` if order genuinely doesn't matter (less memory).
- Ensure proper **\`equals\`/\`hashCode\`** on elements (§5.3).
- For sorted iteration, use \`TreeSet\` (§5.10) instead.`,
      interview: `**Q1. How does LinkedHashSet maintain order?**
It's backed by a \`LinkedHashMap\`: a doubly-linked list threads through entries in insertion order.

**Q2. LinkedHashSet vs HashSet?**
Same O(1) operations, but LinkedHashSet preserves insertion order at a small memory/speed cost.

**Q3. LinkedHashSet vs TreeSet?**
LinkedHashSet keeps insertion order in O(1); TreeSet keeps sorted order in O(log n).

**Q4. Does re-adding an existing element change its order?**
No — its original insertion position is retained.

**Q5. When would you use LinkedHashSet?**
For order-preserving deduplication or reproducible iteration with fast lookups.

**Q6. Is it thread-safe?**
No — like the other \`java.util\` sets, it's unsynchronized and fail-fast.`,
      exercises: `1. Deduplicate a list preserving first-seen order using \`LinkedHashSet\`.
2. Compare iteration order of the same elements in \`HashSet\` vs \`LinkedHashSet\`.
3. Show that re-adding an element doesn't move it.
4. Measure (conceptually) the extra memory from the linked structure.`,
      challenges: `Build an "ordered unique event log": accept a stream of event IDs (with duplicates) and produce the distinct IDs in first-seen order, then allow O(1) membership checks for "have we logged this event?". Compare your \`LinkedHashSet\` solution with a \`HashSet\` + separate ordering list, and argue why \`LinkedHashSet\` is cleaner. Note how an access-order \`LinkedHashMap\` (§5.14) would turn this into an LRU cache.`,
      summary: `- **\`LinkedHashSet\`** = \`HashSet\` + a doubly-linked list → **insertion-order** iteration at **O(1)** average operations (backed by \`LinkedHashMap\`).
- Re-adding an element keeps its original position; slightly more memory than \`HashSet\`.
- Use for **order-preserving dedup** and **reproducible** iteration; **\`HashSet\` (§5.8)** if order is irrelevant, **\`TreeSet\` (§5.10)** for sorted.
- Same \`equals\`/\`hashCode\` requirements (§5.3); not thread-safe.`
    }),

    /* 5.10 TreeSet — sorted set via red-black tree. */
    topic({
      id: "treeset", chapter: "5.10", title: "TreeSet",
      subtitle: "A sorted, navigable set backed by a red-black tree.",
      readTime: "15 min", level: "Core", deep: true,
      objectives: [
        "Explain TreeSet's sorted, self-balancing tree structure.",
        "Use natural ordering vs a custom Comparator (§5.4).",
        "Leverage NavigableSet methods (floor, ceiling, headSet, subSet).",
        "Know its O(log n) cost and the consistency-with-equals requirement."
      ],
      concept: `**\`TreeSet\`** is a \`Set\` that keeps its elements **sorted** at all times, implemented as a **self-balancing red-black tree**. Iteration yields elements in **ascending order** (by natural ordering or a supplied \`Comparator\`, §5.4), and operations are **O(log n)**.

\`\`\`java
TreeSet<Integer> set = new TreeSet<>();
set.add(5); set.add(1); set.add(3);
System.out.println(set);          // [1, 3, 5] — always sorted
System.out.println(set.first());  // 1
System.out.println(set.last());   // 5
\`\`\`

Beyond \`Set\`, it implements **\`NavigableSet\`**, adding powerful range/neighbor queries.`,
      why: `Choose \`TreeSet\` when you need **order or range queries**, not just membership:

- **Always-sorted iteration** without re-sorting.
- **Nearest-neighbor** lookups: "largest value ≤ x" (\`floor\`), "smallest ≥ x" (\`ceiling\`).
- **Range views**: all elements in [a, b) (\`subSet\`), below x (\`headSet\`), above x (\`tailSet\`).
- **Min/max** in O(log n) (\`first\`/\`last\`).

The cost is O(log n) operations (vs O(1) for hash sets) and the requirement that elements be **comparable**.`,
      ordering: `\`TreeSet\` orders elements either by their **natural ordering** (\`Comparable\`, §5.4) or by a **\`Comparator\`** passed to the constructor:

\`\`\`java
TreeSet<String> natural = new TreeSet<>();                       // String's natural order
TreeSet<String> byLength = new TreeSet<>(
    Comparator.comparingInt(String::length).thenComparing(s -> s)); // custom

natural.addAll(List.of("banana","apple","cherry"));
System.out.println(natural);   // [apple, banana, cherry]
\`\`\`

**Critical:** \`TreeSet\` decides **uniqueness by the comparison returning 0**, *not* by \`equals\` (§5.4). If your ordering is inconsistent with \`equals\`, elements may be wrongly merged or duplicated — and a \`null\` element throws \`NullPointerException\` under natural ordering.`,
      navigable: `**\`NavigableSet\` methods — a major TreeSet superpower (interview favourite):**

| Method | Returns |
|---|---|
| \`first()\` / \`last()\` | min / max |
| \`floor(x)\` | greatest element ≤ x (or null) |
| \`ceiling(x)\` | smallest element ≥ x (or null) |
| \`lower(x)\` / \`higher(x)\` | strictly < x / strictly > x |
| \`pollFirst()\` / \`pollLast()\` | remove & return min / max |
| \`headSet(x)\` / \`tailSet(x)\` | view < x / ≥ x |
| \`subSet(a, b)\` | view in [a, b) |
| \`descendingSet()\` | reverse-ordered view |

\`\`\`java
TreeSet<Integer> t = new TreeSet<>(List.of(10, 20, 30, 40));
t.floor(25);     // 20
t.ceiling(25);   // 30
t.headSet(30);   // [10, 20]
t.subSet(15, 35);// [20, 30]
\`\`\``,
      internal: `Backed by a **\`TreeMap\`** (§5.15): elements are keys in a red-black tree, a balanced BST guaranteeing **O(log n)** height. Each insert/delete rebalances via rotations/recoloring to keep the tree balanced, so worst-case stays **O(log n)** (unlike a hash set's O(n) worst case). Iteration is an **in-order traversal**, yielding sorted order in O(n). \`TreeSet\` is **not synchronized** (use \`Collections.synchronizedSortedSet\` or \`ConcurrentSkipListSet\` for concurrency, Module 8); iterator is fail-fast (§5.2).`,
      useCases: `- **Maintaining a sorted unique set** (leaderboards, ranked items).
- **Range/neighbor queries**: scheduling (next free slot), nearest price, autocomplete prefixes (with \`subSet\`).
- **Min/max with removal** (\`pollFirst\`/\`pollLast\`) — a sorted alternative to a heap when you also need ordering.
- **Deduplicate + sort** in one step.`,
      code: `\`\`\`java
import java.util.*;

public class TreeSetDemo {
    public static void main(String[] args) {
        NavigableSet<Integer> scores = new TreeSet<>(List.of(40, 10, 30, 20, 50));
        System.out.println(scores);             // [10, 20, 30, 40, 50]
        System.out.println(scores.first());     // 10
        System.out.println(scores.floor(35));   // 30  (greatest <= 35)
        System.out.println(scores.ceiling(35)); // 40  (smallest >= 35)
        System.out.println(scores.subSet(20, 50)); // [20, 30, 40]
        System.out.println(scores.descendingSet()); // [50, 40, 30, 20, 10]

        // custom order
        TreeSet<String> byLen = new TreeSet<>(Comparator.comparingInt(String::length));
        byLen.addAll(List.of("bb","a","ccc","dd"));   // "dd" and "bb" tie on length!
        System.out.println(byLen);   // [a, bb, ccc]  -> "dd" dropped (compare==0 with "bb")
    }
}
\`\`\``,
      mistakes: `- **Ordering inconsistent with \`equals\`** — TreeSet uses comparison for uniqueness, so tied elements are treated as duplicates (see the \`byLen\` example dropping \`"dd"\`).
- **Adding \`null\`** with natural ordering — throws \`NullPointerException\`.
- **Adding non-\`Comparable\` elements** with no \`Comparator\` — throws \`ClassCastException\`.
- **Expecting O(1)** — operations are O(log n).
- **Mutating an element's sort key** after insertion — corrupts ordering.
- **Assuming thread-safety** — it isn't synchronized.`,
      bestPractices: `- Use \`TreeSet\` when you need **sorted order or range/neighbor queries**; otherwise prefer \`HashSet\` (O(1)).
- Provide a **\`Comparator\`** (or implement \`Comparable\`) that is **consistent with \`equals\`** (§5.4/§5.3) to avoid lost elements.
- Use **\`NavigableSet\`** methods (\`floor\`/\`ceiling\`/\`subSet\`) instead of manual scanning.
- Avoid \`null\` elements.
- For concurrent sorted sets, use \`ConcurrentSkipListSet\` (Module 8).`,
      interview: `**Q1. How is TreeSet implemented and ordered?**
As a red-black tree (via \`TreeMap\`); elements are kept sorted by natural ordering or a \`Comparator\`.

**Q2. Big-O of TreeSet operations?**
O(log n) for add/remove/contains; iteration O(n) in sorted order.

**Q3. How does TreeSet decide duplicates?**
By the comparator/\`compareTo\` returning 0 — not by \`equals\`; ordering should be consistent with \`equals\`.

**Q4. Name some NavigableSet methods.**
\`first\`/\`last\`, \`floor\`/\`ceiling\`, \`lower\`/\`higher\`, \`headSet\`/\`tailSet\`/\`subSet\`, \`pollFirst\`/\`pollLast\`, \`descendingSet\`.

**Q5. Can TreeSet store null?**
Not with natural ordering (throws NPE); a custom comparator could theoretically allow it but it's discouraged.

**Q6. HashSet vs TreeSet?**
HashSet: O(1), unordered. TreeSet: O(log n), sorted with navigation. Use TreeSet only when order/range matters.`,
      exercises: `1. Build a \`TreeSet\` of integers and use \`floor\`, \`ceiling\`, \`subSet\`, and \`descendingSet\`.
2. Create a \`TreeSet\` with a custom comparator and demonstrate the consistency-with-equals pitfall (an element dropped due to a tie).
3. Use \`pollFirst\`/\`pollLast\` to drain a set in sorted order.
4. Show the NPE/ClassCastException from adding null / non-Comparable elements.`,
      challenges: `Implement an interval/slot scheduler: store booked start-times in a \`TreeSet\` and, for a requested time, use \`floor\`/\`ceiling\` to find the nearest bookings and detect conflicts in O(log n). Then add a \`Comparator\` that is *inconsistent* with \`equals\` and show how it silently loses valid bookings — reinforcing §5.4/§5.3.`,
      summary: `- **\`TreeSet\`** = sorted, **\`NavigableSet\`** backed by a red-black tree (\`TreeMap\`); **O(log n)** ops, in-order iteration.
- Orders by **natural ordering or a \`Comparator\`** (§5.4); uniqueness is by **comparison==0**, so keep ordering **consistent with \`equals\`**.
- Powerful navigation: \`floor\`/\`ceiling\`/\`subSet\`/\`pollFirst\`; no \`null\` with natural ordering; not thread-safe.
- Use for **sorted/range** needs; **\`HashSet\` (§5.8)** for pure speed, **\`LinkedHashSet\` (§5.9)** for insertion order.`
    }),

    /* ===================== CORE: QUEUE / DEQUE ===================== */

    /* 5.11 PriorityQueue — a binary-heap priority queue. */
    topic({
      id: "priorityqueue", chapter: "5.11", title: "PriorityQueue",
      subtitle: "A heap-based queue that always serves the highest-priority element.",
      readTime: "15 min", level: "Core", deep: true,
      objectives: [
        "Explain the binary-heap structure behind PriorityQueue.",
        "Use natural ordering or a Comparator to define priority (§5.4).",
        "Know its Big-O and that iteration order is NOT sorted.",
        "Apply it to top-K, scheduling, and graph algorithms."
      ],
      concept: `A **\`PriorityQueue\`** is a \`Queue\` where elements are served by **priority** rather than insertion order. \`poll()\`/\`peek()\` always return the **smallest** element (by natural ordering, or a supplied \`Comparator\`, §5.4) — a **min-heap** by default.

\`\`\`java
PriorityQueue<Integer> pq = new PriorityQueue<>();
pq.offer(5); pq.offer(1); pq.offer(3);
System.out.println(pq.poll());   // 1  (smallest first)
System.out.println(pq.poll());   // 3
\`\`\`

For a **max-heap**, supply a reverse comparator: \`new PriorityQueue<>(Comparator.reverseOrder())\`.`,
      why: `Use a \`PriorityQueue\` whenever you repeatedly need the **most/least important** item efficiently:

- **Scheduling** — always process the highest-priority task next.
- **Top-K / streaming** — keep the K largest/smallest of a stream in O(n log k).
- **Graph algorithms** — Dijkstra's shortest path, Prim's MST, A* (Module 14).
- **Merging sorted streams** — pick the next smallest head across many sources.

A heap gives O(log n) insert/extract while always knowing the extreme element in O(1).`,
      bigO: `**Time complexity:**

| Operation | Time |
|---|---|
| \`offer\`/\`add\` (insert) | **O(log n)** |
| \`poll\` (remove head) | **O(log n)** |
| \`peek\` (view head) | **O(1)** |
| \`contains\`/\`remove(obj)\` | **O(n)** (linear scan) |
| building from n elements | **O(n)** (heapify) |

The head (min/max) is always at index 0 (O(1) peek); inserts and removals "sift" up/down the tree in O(log n).`,
      internal: `\`PriorityQueue\` is a **binary min-heap stored in an array** (no tree nodes). For a node at index \`i\`: children are at \`2i+1\` and \`2i+2\`, parent at \`(i-1)/2\`. The heap invariant: **each parent ≤ its children** (min-heap).

- **\`offer\`** appends at the end, then **sifts up** (swap with parent while smaller) — O(log n).
- **\`poll\`** removes index 0, moves the last element to the root, then **sifts down** — O(log n).
- It grows like an \`ArrayList\` (resizes when full).

Two crucial gotchas:

- **Iteration order is NOT sorted** — the array/heap layout is only *partially* ordered; only repeated \`poll()\` yields sorted output. A for-each over a \`PriorityQueue\` gives heap order, which surprises many.
- It permits **no \`null\`**, requires **comparable** elements (or a \`Comparator\`), is **not synchronized** (use \`PriorityBlockingQueue\`, Module 8), and its iterator is fail-fast (§5.2).`,
      useCases: `- **Dijkstra/Prim/A*** and other graph algorithms (Module 14).
- **Top-K elements** of a large/streaming dataset (bounded heap of size K).
- **Event/task schedulers** ordered by time or priority.
- **Median maintenance** (two heaps), **k-way merge** of sorted lists.`,
      code: `\`\`\`java
import java.util.*;

public class PriorityQueueDemo {
    // top-K largest using a size-K MIN-heap
    static List<Integer> topK(int[] nums, int k) {
        PriorityQueue<Integer> heap = new PriorityQueue<>(); // min-heap
        for (int n : nums) {
            heap.offer(n);
            if (heap.size() > k) heap.poll();   // drop smallest -> keeps K largest
        }
        return new ArrayList<>(heap);
    }
    public static void main(String[] args) {
        // max-heap via reverse comparator
        PriorityQueue<Integer> max = new PriorityQueue<>(Comparator.reverseOrder());
        max.addAll(List.of(5, 1, 9, 3));
        System.out.println(max.poll());     // 9 (largest first)

        System.out.println(topK(new int[]{4,1,7,3,8,2,9}, 3)); // 3 largest (heap order)

        // priority by a field
        record Task(String name, int prio) {}
        PriorityQueue<Task> tasks = new PriorityQueue<>(Comparator.comparingInt(Task::prio));
        tasks.add(new Task("low", 5)); tasks.add(new Task("urgent", 1));
        System.out.println(tasks.poll().name()); // urgent
    }
}
\`\`\``,
      mistakes: `- **Assuming iteration is sorted** — only \`poll()\` repeatedly gives sorted order; for-each yields heap order.
- **Adding \`null\` or non-\`Comparable\` elements** without a comparator — throws NPE/ClassCastException.
- **Using \`contains\`/\`remove(obj)\` heavily** — they're O(n), not O(log n).
- **Forgetting it's a min-heap by default** — use \`reverseOrder()\` for a max-heap.
- **Mutating an element's priority field** while it's in the queue — breaks the heap invariant.
- **Expecting thread-safety** — use \`PriorityBlockingQueue\` for concurrency (Module 8).`,
      bestPractices: `- Define priority with a **\`Comparator\`** (§5.4); \`reverseOrder()\` for a max-heap.
- For **top-K**, keep a **bounded heap of size K** (min-heap for K-largest) — O(n log k).
- Don't rely on iteration order; **drain with \`poll()\`** when you need sorted output.
- Avoid frequent \`remove(obj)\`/\`contains\`; if you need them, consider an indexed structure.
- Use **\`PriorityBlockingQueue\`** for producer/consumer priority scheduling (Module 8).`,
      interview: `**Q1. What data structure backs PriorityQueue?**
A binary heap stored in an array (min-heap by default).

**Q2. Big-O of offer/poll/peek?**
offer and poll are O(log n); peek is O(1); contains/remove(obj) are O(n).

**Q3. Is PriorityQueue iteration sorted?**
No — only repeated \`poll()\` yields sorted order; for-each gives heap (partial) order.

**Q4. How do you make a max-heap?**
Pass \`Comparator.reverseOrder()\` (or a custom reverse comparator).

**Q5. Can it contain null?**
No — nulls aren't allowed; elements must be comparable or have a comparator.

**Q6. A classic use case?**
Dijkstra's algorithm, top-K selection, and priority scheduling.`,
      exercises: `1. Build a min-heap and a max-heap of integers and poll all elements to see sorted output.
2. Implement top-K largest using a size-K min-heap.
3. Show that for-each iteration order differs from poll order.
4. Create a \`PriorityQueue\` of tasks ordered by a priority field via a comparator.`,
      challenges: `Implement a streaming median tracker using two \`PriorityQueue\`s (a max-heap for the lower half, a min-heap for the upper half), supporting \`add(x)\` and \`median()\` in O(log n)/O(1). Then sketch how a \`PriorityQueue\` drives Dijkstra's shortest-path (relaxing edges, polling the closest node), connecting to Module 14, and explain why \`remove(obj)\` being O(n) motivates the "lazy deletion" trick in such algorithms.`,
      summary: `- **\`PriorityQueue\`** = array-backed **binary heap**; \`poll\`/\`peek\` serve the **min** (default) — use \`reverseOrder()\` for max.
- **O(log n)** offer/poll, **O(1)** peek, **O(n)** contains/remove; build is O(n).
- **Iteration is not sorted** — only repeated \`poll()\` sorts; no \`null\`; elements must be comparable (§5.4); not thread-safe.
- Powers **top-K, scheduling, Dijkstra/Prim** (Module 14); concurrent variant is \`PriorityBlockingQueue\` (Module 8).`
    }),

    /* 5.12 Deque & ArrayDeque — double-ended queue. */
    topic({
      id: "deque-arraydeque", chapter: "5.12", title: "Deque & ArrayDeque",
      subtitle: "Double-ended queues — the preferred stack and queue implementation.",
      readTime: "15 min", level: "Core", deep: true,
      objectives: [
        "Explain the Deque interface and its FIFO/LIFO operations.",
        "Use ArrayDeque as both a stack and a queue.",
        "Know why ArrayDeque is preferred over Stack (§5.7) and LinkedList (§5.6).",
        "Distinguish the throwing vs returning method families."
      ],
      concept: `A **\`Deque\`** (double-ended queue, pronounced "deck") is a \`Queue\` that supports **insertion and removal at both ends**. **\`ArrayDeque\`** is its fast, resizable-array implementation — the **recommended** choice for both **stack** (LIFO) and **queue** (FIFO) use.

\`\`\`java
Deque<Integer> dq = new ArrayDeque<>();
dq.addFirst(1);   // [1]
dq.addLast(2);    // [1, 2]
dq.pollFirst();   // removes 1 -> [2]
dq.pollLast();    // removes 2 -> []
\`\`\`

One structure gives you a queue, a stack, or a double-ended buffer.`,
      why: `\`ArrayDeque\` is the modern, efficient answer for stack/queue needs:

- **As a stack**, it replaces the legacy \`Stack\` (§5.7) — faster (no synchronization) and without the broken inherited list API.
- **As a queue**, it's usually faster than \`LinkedList\` (§5.6) — contiguous array, great cache locality, no per-node object overhead.
- **O(1)** add/remove/peek at **both ends**.

The official guidance (and *Effective Java*) is: prefer **\`ArrayDeque\`** over both \`Stack\` and \`LinkedList\` for stack/queue usage.`,
      operations: `**Deque has two method families** — one **throws** on failure, one **returns a special value** — for each end:

| | First (head) throws / returns | Last (tail) throws / returns |
|---|---|---|
| Insert | \`addFirst\` / \`offerFirst\` | \`addLast\` / \`offerLast\` |
| Remove | \`removeFirst\` / \`pollFirst\` | \`removeLast\` / \`pollLast\` |
| Examine | \`getFirst\` / \`peekFirst\` | \`getLast\` / \`peekLast\` |

**Queue (FIFO)** aliases: \`offer\`=\`offerLast\`, \`poll\`=\`pollFirst\`, \`peek\`=\`peekFirst\`.
**Stack (LIFO)** aliases: \`push\`=\`addFirst\`, \`pop\`=\`removeFirst\`, \`peek\`=\`peekFirst\`.

> Prefer the **\`offer\`/\`poll\`/\`peek\`** (returning) family in queue code so an empty deque returns \`null\` instead of throwing \`NoSuchElementException\`.`,
      internal: `\`ArrayDeque\` is backed by a **circular (ring) array** with \`head\` and \`tail\` indices that wrap around using modulo arithmetic. Adding/removing at either end just moves an index — **O(1) amortised**; when full, it **doubles** capacity and copies. Because it's an array, there's **no per-element node** (unlike \`LinkedList\`) and excellent cache locality. Constraints:

- **No \`null\` elements** (null is used internally as an "empty slot" sentinel) — a key difference from \`LinkedList\`.
- **Not synchronized** (use \`ConcurrentLinkedDeque\`/\`ArrayBlockingQueue\` for concurrency, Module 8); iterator is fail-fast (§5.2).
- Random access by index is **not** supported (it's not a \`List\`).`,
      comparison: `**Stack/queue choices:**

| Need | Use | Avoid |
|---|---|---|
| Stack (LIFO) | **\`ArrayDeque\`** (\`push\`/\`pop\`) | \`Stack\` (legacy, §5.7) |
| Queue (FIFO) | **\`ArrayDeque\`** (\`offer\`/\`poll\`) | \`LinkedList\` (usually slower) |
| Deque | **\`ArrayDeque\`** | — |
| Thread-safe queue | \`ArrayBlockingQueue\`/\`ConcurrentLinkedQueue\` (Module 8) | \`Vector\`-based |
| Priority order | \`PriorityQueue\` (§5.11) | — |`,
      useCases: `- **Stack**: expression evaluation, backtracking, DFS, undo history (Module 14).
- **Queue**: BFS, task buffers, producer/consumer (use blocking variants for threads).
- **Sliding-window** algorithms (monotonic deque for window max/min).
- **Work-stealing** / double-ended buffers.`,
      code: `\`\`\`java
import java.util.*;

public class ArrayDequeDemo {
    public static void main(String[] args) {
        // as a STACK (LIFO) — preferred over java.util.Stack
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : "({[]})".toCharArray()) {
            if ("([{".indexOf(c) >= 0) stack.push(c);
            else if (!stack.isEmpty()) stack.pop();
        }
        System.out.println(stack.isEmpty() ? "balanced" : "unbalanced");

        // as a QUEUE (FIFO)
        Deque<Integer> queue = new ArrayDeque<>();
        queue.offer(1); queue.offer(2); queue.offer(3);
        System.out.println(queue.poll());  // 1 (FIFO)

        // both ends
        Deque<Integer> dq = new ArrayDeque<>();
        dq.offerFirst(10); dq.offerLast(20);
        System.out.println(dq.peekFirst() + " " + dq.peekLast()); // 10 20
    }
}
\`\`\``,
      mistakes: `- **Adding \`null\`** to an \`ArrayDeque\` — throws \`NullPointerException\` (null is a reserved sentinel).
- **Using legacy \`Stack\`** instead of \`ArrayDeque\` for LIFO (§5.7).
- **Mixing throwing and returning methods** unintentionally — \`removeFirst\` throws on empty, \`pollFirst\` returns null.
- **Expecting index access** — \`ArrayDeque\` is not a \`List\`.
- **Assuming thread-safety** — use concurrent/blocking deques for multithreading (Module 8).
- **Confusing \`push\`/\`pop\` (head) with \`offer\`/\`poll\`**: \`push\` adds to head, \`offer\` adds to tail.`,
      bestPractices: `- Use **\`ArrayDeque\`** as your default **stack** and **queue**; declare the variable as \`Deque\`/\`Queue\`.
- Prefer the **\`offer\`/\`poll\`/\`peek\`** (returning) family for queue code to avoid exceptions on empty.
- Never store \`null\`; use a sentinel object if you must represent absence.
- For concurrency, choose **\`ArrayBlockingQueue\`/\`LinkedBlockingDeque\`/\`ConcurrentLinkedDeque\`** (Module 8).
- Reach for \`PriorityQueue\` (§5.11) when you need priority rather than FIFO/LIFO.`,
      interview: `**Q1. What is a Deque?**
A double-ended queue supporting O(1) insertion/removal at both ends; usable as a FIFO queue or LIFO stack.

**Q2. Why prefer ArrayDeque over Stack and LinkedList?**
It's faster (array-backed, cache-friendly, unsynchronized), and unlike \`Stack\` it doesn't expose list methods that break LIFO semantics.

**Q3. How is ArrayDeque implemented?**
As a resizable circular array with head/tail indices; O(1) amortised operations at both ends.

**Q4. Can ArrayDeque store null?**
No — null is a reserved internal sentinel; adding null throws NPE.

**Q5. Difference between the throwing and returning method families?**
\`add*/remove*/get*\` throw on failure; \`offer*/poll*/peek*\` return special values (false/null).

**Q6. Which methods make ArrayDeque behave like a stack?**
\`push\` (addFirst), \`pop\` (removeFirst), \`peek\` (peekFirst).`,
      exercises: `1. Use \`ArrayDeque\` as a stack to check balanced parentheses.
2. Use \`ArrayDeque\` as a FIFO queue for a simple BFS over a small graph.
3. Demonstrate the throwing vs returning families on an empty deque.
4. Show that adding \`null\` throws NPE, and rewrite using a sentinel.`,
      challenges: `Implement a sliding-window maximum: given an array and window size k, use a **monotonic \`ArrayDeque\`** (storing indices) to compute each window's max in overall O(n). Explain why both ends must be mutated (pop stale indices from the front, smaller values from the back) and why \`ArrayDeque\` beats \`LinkedList\` here. Then contrast using it as a stack vs the legacy \`Stack\` (§5.7).`,
      summary: `- **\`Deque\`** = double-ended queue; **\`ArrayDeque\`** (circular array) is the **preferred stack and queue** — O(1) both ends, cache-friendly.
- Prefer it over legacy **\`Stack\` (§5.7)** and over **\`LinkedList\` (§5.6)** for stack/queue use.
- **No \`null\`** allowed; not thread-safe; two method families (throwing \`add/remove\` vs returning \`offer/poll\`).
- For priority use **\`PriorityQueue\` (§5.11)**; for concurrency use blocking/concurrent deques (Module 8).`
    }),

    /* ===================== CORE/ADVANCED: MAP ===================== */

    /* 5.13 HashMap — the workhorse key/value store (deep internals). */
    topic({
      id: "hashmap", chapter: "5.13", title: "HashMap",
      subtitle: "The key/value workhorse — buckets, load factor, resizing, and treeification.",
      readTime: "20 min", level: "Advanced", deep: true,
      objectives: [
        "Explain HashMap's bucket-array structure and O(1) average operations.",
        "Detail the load factor, threshold, and resizing (rehashing) process.",
        "Describe collision handling and Java 8 treeification (list → red-black tree).",
        "Connect correctness to equals/hashCode (§5.3) and use the modern Map methods."
      ],
      concept: `**\`HashMap\`** stores **key→value** pairs with **O(1) average** \`put\`, \`get\`, and \`remove\`, using **hashing**. Keys are unique (by \`equals\`/\`hashCode\`, §5.3); values can repeat. It's the most-used \`Map\` and one of the most-asked interview topics for its internals.

\`\`\`java
Map<String,Integer> ages = new HashMap<>();
ages.put("Shail", 30);
ages.put("Asha", 28);
ages.get("Shail");         // 30  (O(1) average)
ages.getOrDefault("X", 0); // 0
ages.containsKey("Asha");  // true
\`\`\`

Iteration order is **unspecified** (use \`LinkedHashMap\` §5.14 or \`TreeMap\` §5.15 for order). One \`null\` key and multiple \`null\` values are allowed.`,
      why: `\`HashMap\` is the default for any **fast lookup by key**:

- **Caches / memoization** — key → computed result.
- **Counting / grouping** — word frequencies, tallies (\`merge\`, \`computeIfAbsent\`).
- **Indexes** — id → object lookups.
- **Configuration / lookup tables**.

The O(1) average performance comes from spreading keys across **buckets** so most lookups touch just one slot.`,
      structure: `**Internal structure (Java 8+):** a \`HashMap\` holds an **array of buckets** (\`Node<K,V>[] table\`). Each bucket holds entries whose keys hash to that index. Within a bucket, entries are kept as a **linked list** — or, once a bucket gets large, as a **red-black tree** (treeification, below).

\`\`\`
 index:   0     1        2     3
 table: [ • ]  [ • ]   [null] [ • ]
          │     │              │
        (k,v) (k,v)→(k,v)    (k,v)     <- bucket chains (lists or trees)
\`\`\`

**put(key, value):**
1. Compute \`h = hash(key)\` (mixes \`key.hashCode()\` bits so high bits matter).
2. Index = \`h & (table.length - 1)\` (fast modulo since length is a power of two).
3. If the bucket is empty, place the node. Otherwise, walk the chain comparing with \`equals\`: if the key exists, **replace** the value; else **append** a new node.

**get(key)** repeats steps 1–2, then scans the bucket with \`equals\` to find the value.`,
      loadFactorResize: `**Load factor, threshold, and resizing — the classic deep-dive:**

- **Capacity** = number of buckets (default **16**, always a power of two).
- **Load factor** = fullness ratio that triggers growth (default **0.75**).
- **Threshold** = capacity × load factor (16 × 0.75 = **12**).
- When \`size\` exceeds the threshold, the map **resizes**: capacity **doubles** (16→32→64…) and **all entries are rehashed** into the new, larger table — an **O(n)** operation.

Why 0.75? It balances **space vs collisions**: lower wastes memory, higher causes longer chains. Pre-sizing avoids repeated resizes:

\`\`\`java
Map<String,Integer> m = new HashMap<>(1 << 16);   // pre-size for many entries
\`\`\``,
      collisions: `**Collisions** happen when different keys map to the same bucket. \`HashMap\` handles them by **chaining**:

- **Before Java 8:** buckets were linked lists; a bad \`hashCode\` could degrade a bucket to **O(n)** (and was a DoS risk).
- **Java 8 treeification:** when a single bucket's chain length reaches **8** *and* total capacity is ≥ **64**, that bucket converts from a linked list to a **red-black tree**, making worst-case bucket operations **O(log n)** instead of O(n). It **untreeifies** back to a list if the bucket shrinks below **6** (after removals/resizes).

So Java 8 \`HashMap\` is **O(1) average, O(log n) worst case** per bucket (given decent hashing) — a frequently-tested improvement.`,
      internal: `**Other internals & correctness:**

- The \`hash()\` function does \`h = key.hashCode(); h ^ (h >>> 16)\` to **spread high bits** into the low bits used for indexing — reducing collisions from poor hash codes.
- Correctness depends **entirely on \`equals\`/\`hashCode\`** (§5.3): a key whose hash changes after insertion (mutable key) becomes unfindable.
- **\`null\` key** is stored in bucket 0 (special-cased); multiple **\`null\` values** are fine.
- **Not synchronized**; concurrent modification can corrupt it or cause infinite loops in old JDKs — use \`ConcurrentHashMap\` (§5.17) for threads. Iterator is **fail-fast** (§5.2).`,
      modernMethods: `**Modern Map methods (Java 8) you should use** — they make map code concise and correct:

| Method | Purpose |
|---|---|
| \`getOrDefault(k, def)\` | value or a default |
| \`putIfAbsent(k, v)\` | set only if absent |
| \`computeIfAbsent(k, fn)\` | lazily create/init a value (great for multimaps) |
| \`merge(k, v, fn)\` | combine with existing (counting) |
| \`compute(k, fn)\` / \`computeIfPresent\` | recompute from current |
| \`forEach((k,v) -> ...)\` | iterate entries |

\`\`\`java
Map<String,List<String>> byCity = new HashMap<>();
byCity.computeIfAbsent("Pune", c -> new ArrayList<>()).add("Asha");  // multimap idiom

Map<String,Integer> freq = new HashMap<>();
for (String w : words) freq.merge(w, 1, Integer::sum);              // word count
\`\`\``,
      useCases: `- **Frequency counts / grouping** (\`merge\`, \`computeIfAbsent\`).
- **Caches / memoization** (key → result).
- **Lookup indexes** (id → entity), **two-sum**-style algorithms (Module 14).
- **Config maps**, deduping with auxiliary data.`,
      code: `\`\`\`java
import java.util.*;

public class HashMapDemo {
    public static void main(String[] args) {
        // word frequency
        String text = "to be or not to be";
        Map<String,Integer> freq = new HashMap<>();
        for (String w : text.split(" ")) freq.merge(w, 1, Integer::sum);
        System.out.println(freq);   // {not=1, to=2, be=2, or=1} (order unspecified)

        // grouping into a multimap
        Map<Integer,List<String>> byLen = new HashMap<>();
        for (String w : text.split(" "))
            byLen.computeIfAbsent(w.length(), k -> new ArrayList<>()).add(w);
        System.out.println(byLen);

        // safe access + iteration
        System.out.println(freq.getOrDefault("xyz", 0));  // 0
        freq.forEach((k, v) -> { /* ... */ });
    }
}
\`\`\``,
      mistakes: `- **Mutable keys** — changing a field used in \`hashCode\`/\`equals\` after insertion makes the entry unfindable (§5.3).
- **Broken \`equals\`/\`hashCode\`** on keys — duplicate keys or failed lookups.
- **Relying on iteration order** — \`HashMap\` order is unspecified and changes on resize.
- **Using \`HashMap\` across threads** — data corruption; use \`ConcurrentHashMap\` (§5.17).
- **Not pre-sizing** for large known sizes — repeated O(n) resizes.
- **\`get\` returning null** ambiguously — could be "absent" or "mapped to null"; use \`containsKey\`/\`getOrDefault\`.`,
      bestPractices: `- Use \`HashMap\` as the **default \`Map\`**; declare the variable as \`Map\`.
- Keys should be **immutable** with correct **\`equals\`/\`hashCode\`** (records, \`Objects.hash\`, §5.3).
- **Pre-size** (\`new HashMap<>(expected / 0.75 + 1)\`) for large maps to avoid resizes.
- Prefer **\`getOrDefault\`/\`computeIfAbsent\`/\`merge\`** over manual contains-then-put.
- Use **\`LinkedHashMap\`** (§5.14) for order, **\`TreeMap\`** (§5.15) for sorting, **\`ConcurrentHashMap\`** (§5.17) for threads.`,
      interview: `**Q1. How does HashMap work internally?**
An array of buckets indexed by \`hash(key) & (n-1)\`; entries with the same index are chained (linked list, or red-black tree if large). \`get\`/\`put\` locate the bucket then use \`equals\` to find the key.

**Q2. What are load factor and threshold?**
Load factor (default 0.75) is the fullness ratio; threshold = capacity × load factor (16×0.75=12). Exceeding it doubles capacity and rehashes all entries.

**Q3. What changed in Java 8 HashMap?**
Buckets treeify into red-black trees when a chain reaches 8 (and capacity ≥ 64), improving worst case from O(n) to O(log n).

**Q4. Big-O of HashMap operations?**
O(1) average for get/put/remove; O(log n) worst case per bucket (treeified); resize is O(n).

**Q5. Can HashMap have null keys/values?**
One null key and multiple null values are allowed (unlike \`Hashtable\`/\`ConcurrentHashMap\`).

**Q6. Why must keys be immutable / have proper equals & hashCode?**
So their bucket location is stable and lookups succeed; a changed hash makes a key unfindable.

**Q7. Why is capacity a power of two?**
So \`hash & (n-1)\` computes the bucket index without a modulo, efficiently distributing entries.`,
      exercises: `1. Build a word-frequency map with \`merge\` and a length→words multimap with \`computeIfAbsent\`.
2. Demonstrate the mutable-key bug: use a mutable object as a key, change a hashed field, then fail to \`get\` it.
3. Show \`getOrDefault\` vs \`get\` for an absent key and for a key mapped to null.
4. Explain (with numbers) when a default \`HashMap\` resizes as you add 13 entries.`,
      challenges: `Implement a simplified \`MyHashMap<K,V>\` with a bucket array, \`put\`/\`get\`/\`remove\`, collision chaining, a load factor of 0.75, and resize-and-rehash on threshold. Instrument it to report bucket distribution and resize count. Then feed it keys with a deliberately poor \`hashCode\` and observe chains lengthening — explaining how Java 8 treeification (§) and the \`hash()\` bit-spreading mitigate this, and how \`equals\`/\`hashCode\` (§5.3) underpin correctness.`,
      summary: `- **\`HashMap\`** = bucket array of key→value entries; **O(1) avg** get/put/remove via \`hash(key) & (n-1)\`, \`equals\` within a bucket.
- **Load factor 0.75**, default capacity **16**; exceeding the **threshold** doubles capacity and **rehashes** (O(n)).
- **Java 8 treeification**: chains of ≥8 (capacity ≥64) become red-black trees → **O(log n)** worst case.
- Allows one null key; **not thread-safe** (use **\`ConcurrentHashMap\` §5.17**); correctness needs **\`equals\`/\`hashCode\` (§5.3)**; use \`merge\`/\`computeIfAbsent\`.`
    }),

    /* 5.14 LinkedHashMap — ordered HashMap, LRU-capable. */
    topic({
      id: "linkedhashmap", chapter: "5.14", title: "LinkedHashMap",
      subtitle: "A HashMap that preserves order — and can build an LRU cache.",
      readTime: "14 min", level: "Core", deep: true,
      objectives: [
        "Explain insertion-order vs access-order in LinkedHashMap.",
        "Compare it with HashMap (§5.13) and TreeMap (§5.15).",
        "Build an LRU cache using access-order and removeEldestEntry.",
        "Know its overhead and typical uses."
      ],
      concept: `**\`LinkedHashMap\`** is a \`HashMap\` (§5.13) that also maintains a **doubly-linked list** through all entries, giving **predictable iteration order** while keeping O(1) operations. By default that order is **insertion order**; optionally it can be **access order** (most-recently-used last) — the key to building an LRU cache.

\`\`\`java
Map<String,Integer> m = new LinkedHashMap<>();
m.put("c", 1); m.put("a", 2); m.put("b", 3);
System.out.println(m);   // {c=1, a=2, b=3} — insertion order preserved
\`\`\``,
      why: `\`HashMap\` is fast but unordered; \`TreeMap\` is sorted but O(log n). \`LinkedHashMap\` fills the gap: **HashMap speed + predictable order**:

- **Deterministic iteration** for reproducible output/serialization.
- **Order-preserving** maps (e.g., parsing config keys in file order).
- **LRU caches** via access-order + an eviction hook — its most famous use.`,
      orderModes: `**Two ordering modes**, set via the constructor:

\`\`\`java
// insertion order (default)
new LinkedHashMap<>();

// access order: get/put move the entry to the END (most-recently-used)
new LinkedHashMap<>(16, 0.75f, true);   // accessOrder = true
\`\`\`

In **access-order** mode, every \`get\`/\`put\` of a key moves it to the tail, so the **head is the least-recently-used** entry — exactly what an LRU cache needs.`,
      lru: `**Building an LRU cache** — a classic interview/system-design task — is trivial with \`LinkedHashMap\`: enable access order and override \`removeEldestEntry\` to evict the oldest when over capacity:

\`\`\`java
class LruCache<K,V> extends LinkedHashMap<K,V> {
    private final int capacity;
    LruCache(int capacity) {
        super(16, 0.75f, true);          // access order
        this.capacity = capacity;
    }
    @Override protected boolean removeEldestEntry(Map.Entry<K,V> eldest) {
        return size() > capacity;        // evict LRU when over capacity
    }
}

LruCache<Integer,String> cache = new LruCache<>(2);
cache.put(1,"a"); cache.put(2,"b");
cache.get(1);            // 1 becomes most-recently-used
cache.put(3,"c");        // evicts 2 (least-recently-used)
System.out.println(cache.keySet());  // [1, 3]
\`\`\`

All operations remain **O(1)** — this is the standard, idiomatic LRU in Java.`,
      internal: `Each entry extends \`HashMap.Node\` with extra **before/after** pointers forming the linked list. Insertion appends to the tail; in access-order mode, \`get\`/\`put\` unlink and re-append the entry. \`removeEldestEntry\` is called after every \`put\`; returning \`true\` removes the head (eldest). Overhead vs \`HashMap\`: **two extra references per entry** and slightly slower writes. Allows one null key/multiple null values; **not synchronized**; iterator is fail-fast (§5.2).`,
      comparison: `**The three maps, by ordering need:**

| | \`HashMap\` | \`LinkedHashMap\` | \`TreeMap\` |
|---|---|---|---|
| Order | none | **insertion or access** | **sorted** by key |
| get/put | O(1) | O(1) | O(log n) |
| memory | lowest | medium | medium |
| special power | — | **LRU** (access order) | navigation (§5.15) |
| needs | equals/hashCode | equals/hashCode | Comparable/Comparator |`,
      useCases: `- **LRU / bounded caches** (access order + \`removeEldestEntry\`).
- **Deterministic iteration** for tests, JSON output, config.
- **Order-preserving transformations** (keep key order from a source).
- Anywhere you'd use \`HashMap\` but consumers expect stable order.`,
      code: `\`\`\`java
import java.util.*;

public class LinkedHashMapDemo {
    public static void main(String[] args) {
        // insertion-order map
        Map<String,Integer> ins = new LinkedHashMap<>();
        ins.put("one",1); ins.put("two",2); ins.put("three",3);
        System.out.println(ins.keySet());   // [one, two, three]

        // access-order map (LRU-ish view)
        LinkedHashMap<String,Integer> acc = new LinkedHashMap<>(16, 0.75f, true);
        acc.put("a",1); acc.put("b",2); acc.put("c",3);
        acc.get("a");                        // touch 'a'
        System.out.println(acc.keySet());    // [b, c, a] — 'a' moved to the end
    }
}
\`\`\``,
      mistakes: `- **Expecting sorted order** — it preserves insertion/access order, not key sorting (use \`TreeMap\`).
- **Forgetting \`accessOrder=true\`** when building an LRU — insertion order won't evict correctly.
- **Overriding \`removeEldestEntry\` wrong** — it must return whether to remove, based on \`size()\`.
- **Using it where order is irrelevant** — \`HashMap\` is leaner.
- **Assuming thread-safety** — wrap or use concurrent maps for threads (Module 8).`,
      bestPractices: `- Use \`LinkedHashMap\` for **predictable iteration** at \`HashMap\` speed.
- For **LRU**, use **access-order** + \`removeEldestEntry\` (the idiomatic Java LRU).
- Prefer plain \`HashMap\` when order is irrelevant (less memory).
- Same **\`equals\`/\`hashCode\`** key requirements as \`HashMap\` (§5.3).
- For a thread-safe LRU, synchronize externally or use a dedicated cache library/\`ConcurrentHashMap\` strategy (Module 8).`,
      interview: `**Q1. How does LinkedHashMap maintain order?**
A doubly-linked list threads through entries; default is insertion order, optionally access order.

**Q2. What is access order and why is it useful?**
\`get\`/\`put\` move entries to the tail, so the head is least-recently-used — perfect for LRU caches.

**Q3. How do you build an LRU cache with it?**
Construct with \`accessOrder=true\` and override \`removeEldestEntry\` to return \`size() > capacity\`.

**Q4. LinkedHashMap vs HashMap vs TreeMap?**
LinkedHashMap = O(1) + insertion/access order; HashMap = O(1) unordered; TreeMap = O(log n) sorted.

**Q5. What's the overhead vs HashMap?**
Two extra references per entry and slightly slower writes.

**Q6. Is it thread-safe?**
No — unsynchronized and fail-fast.`,
      exercises: `1. Show insertion-order iteration differs from \`HashMap\`'s unspecified order.
2. Create an access-order \`LinkedHashMap\` and observe entries move on \`get\`.
3. Implement an \`LruCache\` via \`removeEldestEntry\` and test eviction.
4. Explain the memory overhead vs \`HashMap\`.`,
      challenges: `Extend the \`LruCache\` to also expose the current eviction order and a \`hitRate()\` metric (hits vs misses). Demonstrate a realistic access pattern that benefits from LRU, then discuss its limitations (no concurrency, no TTL) and what a production cache (Caffeine/Guava) adds — connecting access-order \`LinkedHashMap\` to real caching design.`,
      summary: `- **\`LinkedHashMap\`** = \`HashMap\` + linked list → **insertion or access order** at **O(1)** (backed by linked \`HashMap\` nodes).
- **Access order + \`removeEldestEntry\`** = the idiomatic **LRU cache**.
- Slightly more memory than \`HashMap\`; same \`equals\`/\`hashCode\` rules (§5.3); not thread-safe.
- Use for **predictable iteration** and **LRU**; **\`HashMap\` (§5.13)** if order is irrelevant, **\`TreeMap\` (§5.15)** for sorting.`
    }),

    /* 5.15 TreeMap — sorted, navigable map. */
    topic({
      id: "treemap", chapter: "5.15", title: "TreeMap",
      subtitle: "A sorted, navigable map backed by a red-black tree.",
      readTime: "14 min", level: "Core", deep: true,
      objectives: [
        "Explain TreeMap's sorted red-black-tree structure.",
        "Order by natural key ordering or a Comparator (§5.4).",
        "Use NavigableMap methods (floorKey, ceilingKey, subMap, firstEntry).",
        "Know its O(log n) cost and consistency-with-equals requirement."
      ],
      concept: `**\`TreeMap\`** is a \`Map\` that keeps its **keys sorted** at all times, implemented as a **red-black tree**. Iteration over keys/entries is in **ascending key order**, and operations are **O(log n)**. It implements **\`NavigableMap\`**, adding range and neighbor queries — the map analog of \`TreeSet\` (§5.10).

\`\`\`java
TreeMap<String,Integer> m = new TreeMap<>();
m.put("banana", 2); m.put("apple", 1); m.put("cherry", 3);
System.out.println(m);              // {apple=1, banana=2, cherry=3} — sorted by key
System.out.println(m.firstKey());  // apple
\`\`\``,
      why: `Use \`TreeMap\` when you need keys in **sorted order** or **range/nearest** queries by key:

- **Sorted iteration** of entries without re-sorting.
- **Range queries**: all entries with keys in [a, b) (\`subMap\`), below/above a key (\`headMap\`/\`tailMap\`).
- **Nearest key**: \`floorKey\` (≤ k), \`ceilingKey\` (≥ k) — e.g., price tiers, time-series lookups, IP-range tables.
- **Ordered min/max** entries in O(log n).`,
      navigable: `**\`NavigableMap\` methods (TreeMap's superpower):**

| Method | Returns |
|---|---|
| \`firstKey()\`/\`lastKey()\`, \`firstEntry()\`/\`lastEntry()\` | min/max |
| \`floorKey(k)\`/\`ceilingKey(k)\` | ≤ k / ≥ k |
| \`lowerKey(k)\`/\`higherKey(k)\` | < k / > k |
| \`headMap(k)\`/\`tailMap(k)\` | view of keys < k / ≥ k |
| \`subMap(a, b)\` | view of keys in [a, b) |
| \`pollFirstEntry()\`/\`pollLastEntry()\` | remove & return min/max |
| \`descendingMap()\` | reverse-ordered view |

\`\`\`java
TreeMap<Integer,String> t = new TreeMap<>(Map.of(10,"a",20,"b",30,"c"));
t.floorKey(25);    // 20
t.ceilingKey(25);  // 30
t.subMap(10, 30);  // {10=a, 20=b}
\`\`\``,
      internal: `Backed by a **red-black tree** keyed by the map's keys; each insert/delete rebalances to keep height O(log n), so \`get\`/\`put\`/\`remove\` are **O(log n)**. Iteration is an **in-order traversal** (sorted) in O(n). Ordering is by the keys' **natural ordering** (\`Comparable\`, §5.4) or a **\`Comparator\`** supplied to the constructor.

**Critical:** like \`TreeSet\`, key uniqueness is decided by **comparison returning 0**, not \`equals\` — keep ordering **consistent with \`equals\`** (§5.4/§5.3). A \`null\` key is **not allowed** with natural ordering (throws NPE); null values are fine. \`TreeMap\` is **not synchronized** (use \`ConcurrentSkipListMap\` for concurrency, Module 8); iterator is fail-fast (§5.2).`,
      comparison: `**HashMap vs LinkedHashMap vs TreeMap:**

| | \`HashMap\` | \`LinkedHashMap\` | \`TreeMap\` |
|---|---|---|---|
| Order | none | insertion/access | **sorted by key** |
| get/put | O(1) | O(1) | **O(log n)** |
| null key | one | one | **none** (natural order) |
| extra power | — | LRU (§5.14) | navigation/range |
| needs | equals/hashCode | equals/hashCode | Comparable/Comparator |`,
      useCases: `- **Sorted reporting** by key (dates, names, ids).
- **Range/nearest lookups**: floor/ceiling for tiered pricing, time-series, autocomplete prefixes (\`subMap\`).
- **Leaderboards / histograms** keyed by score buckets.
- **IP / number range tables** ("which range does x fall into?" via \`floorEntry\`).`,
      code: `\`\`\`java
import java.util.*;

public class TreeMapDemo {
    public static void main(String[] args) {
        NavigableMap<Integer,String> prices = new TreeMap<>();
        prices.put(0, "Free"); prices.put(100, "Basic"); prices.put(500, "Pro");

        // tiered lookup: which tier does an amount fall into?
        System.out.println(prices.floorEntry(250).getValue());  // Basic (100 <= 250 < 500)
        System.out.println(prices.ceilingKey(101));             // 500

        // range view
        System.out.println(prices.headMap(500));                // {0=Free, 100=Basic}
        System.out.println(prices.descendingMap().firstKey());  // 500

        // custom ordering
        TreeMap<String,Integer> byLen = new TreeMap<>(Comparator.comparingInt(String::length));
        byLen.put("bb",1); byLen.put("a",2); byLen.put("cc",3); // "cc" overwrites "bb" (tie!)
        System.out.println(byLen);   // {a=2, cc=3}
    }
}
\`\`\``,
      mistakes: `- **Ordering inconsistent with \`equals\`** — keys that compare equal are merged (see \`"bb"\`/\`"cc"\` overwrite).
- **Null keys with natural ordering** — throws \`NullPointerException\`.
- **Non-\`Comparable\` keys without a \`Comparator\`** — throws \`ClassCastException\`.
- **Expecting O(1)** — operations are O(log n).
- **Mutating a key's sort field** after insertion — corrupts the tree.
- **Assuming thread-safety** — it isn't; use \`ConcurrentSkipListMap\` (Module 8).`,
      bestPractices: `- Use \`TreeMap\` for **sorted keys or range/nearest** queries; otherwise \`HashMap\` (O(1)).
- Provide a **\`Comparator\`** (or \`Comparable\` keys) **consistent with \`equals\`** (§5.4/§5.3).
- Use **\`NavigableMap\`** methods (\`floorEntry\`/\`subMap\`) instead of manual scans.
- Avoid \`null\` keys.
- For concurrent sorted maps, use **\`ConcurrentSkipListMap\`** (Module 8).`,
      interview: `**Q1. How is TreeMap implemented?**
As a red-black (self-balancing BST) tree keyed by keys, kept in sorted order.

**Q2. Big-O of TreeMap operations?**
O(log n) for get/put/remove; O(n) sorted iteration.

**Q3. How does TreeMap order keys?**
By natural ordering (\`Comparable\`) or a supplied \`Comparator\`; uniqueness is by comparison==0.

**Q4. Name some NavigableMap methods.**
\`firstKey\`/\`lastKey\`, \`floorKey\`/\`ceilingKey\`, \`headMap\`/\`tailMap\`/\`subMap\`, \`pollFirstEntry\`, \`descendingMap\`.

**Q5. Can TreeMap have a null key?**
No with natural ordering (NPE); null values are allowed.

**Q6. HashMap vs TreeMap?**
HashMap: O(1), unordered. TreeMap: O(log n), sorted with navigation — use only when order/range matters.`,
      exercises: `1. Build a \`TreeMap\` and use \`floorEntry\`/\`ceilingKey\`/\`subMap\`/\`descendingMap\`.
2. Implement a tiered-pricing lookup using \`floorEntry\`.
3. Show the consistency-with-equals pitfall with a custom comparator merging keys.
4. Trigger NPE/ClassCastException with null/non-Comparable keys.`,
      challenges: `Implement an "IP allowlist range" lookup: store range start → label in a \`TreeMap\` and, given an address (as a comparable key), use \`floorEntry\` to find the containing range in O(log n). Handle edge cases (below the first range, exact boundaries). Then discuss why a \`HashMap\` cannot answer range queries and how a \`Comparator\` inconsistent with \`equals\` would corrupt the table (§5.4).`,
      summary: `- **\`TreeMap\`** = sorted **\`NavigableMap\`** (red-black tree); **O(log n)** ops, in-order (sorted) iteration.
- Orders by **natural key ordering or a \`Comparator\`** (§5.4); uniqueness by **comparison==0** (keep consistent with \`equals\`).
- Rich navigation: \`floorKey\`/\`ceilingKey\`/\`subMap\`/\`pollFirstEntry\`; **no null key**; not thread-safe.
- Use for **sorted/range** needs; **\`HashMap\` (§5.13)** for speed, **\`LinkedHashMap\` (§5.14)** for insertion/access order.`
    }),

    /* 5.16 Hashtable — legacy synchronized map. */
    topic({
      id: "hashtable", chapter: "5.16", title: "Hashtable (Legacy)",
      subtitle: "The original synchronized map — and why ConcurrentHashMap replaced it.",
      readTime: "11 min", level: "Core", deep: true,
      objectives: [
        "Explain Hashtable and its fully-synchronized nature.",
        "Compare it with HashMap (§5.13) on synchronization and nulls.",
        "Understand why it is legacy and what to use instead.",
        "Recognise it in older codebases and interviews."
      ],
      concept: `**\`Hashtable\`** is a **legacy** (Java 1.0) key→value map that is **fully synchronized** — every method holds the table's lock, making it thread-safe but slow. It predates the Collections Framework and was retrofitted to implement \`Map\`. For new code it's superseded by \`HashMap\` (single-thread, §5.13) and \`ConcurrentHashMap\` (concurrent, §5.17).

\`\`\`java
Hashtable<String,Integer> t = new Hashtable<>();
t.put("a", 1);
// t.put(null, 1);   // ❌ NullPointerException — no null keys or values
\`\`\``,
      why: `It exists for the same historical reason as \`Vector\` (§5.7): early Java provided thread-safe collections by default. But blanket method synchronization is a poor concurrency model — it serializes **all** access through one lock, killing scalability, and still doesn't make **compound** operations atomic (Module 8). \`ConcurrentHashMap\` (§5.17) later delivered thread safety with far better concurrency, retiring \`Hashtable\`.`,
      comparison: `**\`Hashtable\` vs \`HashMap\` — a classic interview comparison:**

| | \`Hashtable\` | \`HashMap\` |
|---|---|---|
| Synchronized? | yes (every method) | no |
| Performance | slower (one lock) | faster |
| null key/values | **not allowed** (NPE) | one null key, many null values |
| Since | 1.0 (legacy) | 1.2 |
| Iterator | \`Enumeration\` + fail-fast iterator | fail-fast iterator |
| Replacement | \`ConcurrentHashMap\` (§5.17) | — |

Mnemonic: **\`Hashtable\` = synchronized, no nulls, legacy; \`HashMap\` = unsynchronized, nulls allowed, modern.**`,
      internal: `Internally it's a bucket array with chaining, like an older \`HashMap\`, but **every public method is \`synchronized\`** on the table instance. It uses a default capacity of **11** and load factor **0.75**, growing by \`2*old+1\` on resize (vs HashMap's power-of-two doubling). It also exposes the ancient **\`Enumeration\`** API (\`keys()\`, \`elements()\`) alongside the modern iterator. The single global lock is exactly why \`ConcurrentHashMap\` (with finer-grained locking/CAS) scales far better under contention (§5.17, Module 8).`,
      useCases: `- **Legacy code** maintenance (older enterprise apps, some JDK APIs like \`Properties\` extend \`Hashtable\`).
- **Interview comparisons** (\`Hashtable\` vs \`HashMap\` vs \`ConcurrentHashMap\`).
- Realistically: **avoid in new code** — choose \`HashMap\` or \`ConcurrentHashMap\`.`,
      code: `\`\`\`java
import java.util.*;

public class HashtableDemo {
    public static void main(String[] args) {
        Map<String,Integer> ht = new Hashtable<>();
        ht.put("a", 1); ht.put("b", 2);
        System.out.println(ht.get("a"));   // 1

        try { ht.put(null, 0); }           // not allowed
        catch (NullPointerException e) { System.out.println("no null keys"); }

        // modern equivalents:
        Map<String,Integer> single = new HashMap<>();              // single-threaded
        Map<String,Integer> concurrent = new java.util.concurrent.ConcurrentHashMap<>(); // threads
    }
}
\`\`\``,
      mistakes: `- **Using \`Hashtable\` in new code** — prefer \`HashMap\`/\`ConcurrentHashMap\`.
- **Storing \`null\` keys/values** — throws \`NullPointerException\` (unlike \`HashMap\`).
- **Assuming its synchronization makes compound operations atomic** — it doesn't (check-then-act still races, Module 8).
- **Expecting good concurrent throughput** — one global lock serializes everything.
- **Confusing it with \`HashMap\`** in interviews on the null/sync points.`,
      bestPractices: `- For single-threaded maps, use **\`HashMap\`** (§5.13).
- For concurrent maps, use **\`ConcurrentHashMap\`** (§5.17) — not \`Hashtable\`.
- Treat \`Hashtable\` as **legacy/interview knowledge**.
- If you encounter \`Properties\` (which extends \`Hashtable\`), prefer its string-typed methods and consider modern config approaches.
- Never rely on per-method synchronization for multi-step atomicity (Module 8).`,
      interview: `**Q1. Hashtable vs HashMap?**
\`Hashtable\` is synchronized and disallows null keys/values (legacy); \`HashMap\` is unsynchronized, allows one null key/many null values, and is faster.

**Q2. Why is Hashtable considered legacy?**
Its single-lock synchronization is slow and unscalable; \`ConcurrentHashMap\` provides thread safety with much better concurrency.

**Q3. Can Hashtable store null?**
No — null keys or values throw \`NullPointerException\`.

**Q4. What replaces Hashtable for concurrency?**
\`ConcurrentHashMap\` (§5.17).

**Q5. Does Hashtable's synchronization guarantee compound atomicity?**
No — only individual methods are atomic.

**Q6. What's an example of a class extending Hashtable?**
\`java.util.Properties\`.`,
      exercises: `1. Show that \`Hashtable\` rejects null keys/values while \`HashMap\` accepts them.
2. Replace a \`Hashtable\` with \`ConcurrentHashMap\` and note the API similarity.
3. List the differences (sync, nulls, since, default capacity) between \`Hashtable\` and \`HashMap\`.
4. Demonstrate that a check-then-act on a \`Hashtable\` still has a race (conceptually).`,
      challenges: `Modernize a legacy module that uses \`Hashtable\` for a shared counter accessed by multiple threads: replace it with \`ConcurrentHashMap\` and use \`merge\`/\`compute\` for atomic updates (§5.17). Demonstrate that the original \`Hashtable\` \`if (!contains) put\` pattern was racy despite synchronization, and explain how \`ConcurrentHashMap\`'s atomic methods fix it (Module 8).`,
      summary: `- **\`Hashtable\`** = legacy, **fully synchronized** map; **no null keys/values**; one global lock → slow/unscalable.
- vs **\`HashMap\` (§5.13)**: synchronized vs not, no-nulls vs nulls-allowed, legacy vs modern.
- Per-method sync ≠ compound atomicity (Module 8); replaced by **\`ConcurrentHashMap\` (§5.17)** for concurrency.
- Know it for legacy code and interviews; avoid in new code.`
    }),

    /* ===================== ADVANCED ===================== */

    /* 5.17 ConcurrentHashMap — the scalable thread-safe map. */
    topic({
      id: "concurrenthashmap", chapter: "5.17", title: "ConcurrentHashMap",
      subtitle: "Thread-safe, high-concurrency map — the modern choice for shared maps.",
      readTime: "16 min", level: "Advanced", deep: true,
      objectives: [
        "Explain how ConcurrentHashMap achieves thread safety without a global lock.",
        "Compare it with Hashtable (§5.16) and synchronizedMap.",
        "Use atomic methods (compute, merge, putIfAbsent) correctly.",
        "Understand its weakly-consistent iterator and null restrictions."
      ],
      concept: `**\`ConcurrentHashMap\`** (\`java.util.concurrent\`) is a **thread-safe \`HashMap\`** designed for **high concurrency**: many threads can read and write simultaneously with minimal contention. It's the standard choice for a shared map in multithreaded code, replacing \`Hashtable\` (§5.16) and \`Collections.synchronizedMap\`.

\`\`\`java
ConcurrentMap<String,Integer> map = new ConcurrentHashMap<>();
map.put("a", 1);
map.merge("a", 1, Integer::sum);   // atomic increment -> 2
\`\`\`

It offers \`HashMap\`-like O(1) operations **plus** atomic compound operations, all safe under concurrent access.`,
      why: `Shared mutable maps are everywhere in concurrent apps (caches, counters, registries), and naive options are bad:

- **\`Hashtable\`/\`synchronizedMap\`** lock the *entire* map per operation → threads serialize, killing throughput.
- A plain **\`HashMap\`** under concurrency can corrupt data or (in old JDKs) loop forever.

\`ConcurrentHashMap\` solves this with **fine-grained, lock-light** concurrency so reads are essentially lock-free and writes lock only a small part — scaling to many cores. This is the workhorse concurrent collection (Module 8).`,
      howItWorks: `**How it scales (interview-grade detail):**

- **Java 7:** the map was split into independent **segments** (default 16), each with its own lock — so up to 16 threads could write concurrently ("lock striping").
- **Java 8+:** segments were replaced by **per-bucket (node-level) locking + CAS** (compare-and-swap). Writes \`synchronized\` on just the **first node of the target bucket**; the common case (empty bucket) uses a lock-free **CAS** insert. Reads are **non-blocking** (volatile reads), so \`get\` never locks.
- Like \`HashMap\` (§5.13), buckets **treeify** under heavy collisions for O(log n) worst case.

The result: concurrent reads with no locking, and writes that contend only when touching the **same bucket**.`,
      atomicOps: `**Atomic compound operations** — the right way to update concurrently. Individual methods are atomic, but **check-then-act sequences are not**; use the built-in atomic methods instead:

\`\`\`java
ConcurrentMap<String,Integer> counts = new ConcurrentHashMap<>();

// ❌ racy: two steps, not atomic
// if (!counts.containsKey(k)) counts.put(k, 0);
// counts.put(k, counts.get(k) + 1);

// ✅ atomic
counts.merge(k, 1, Integer::sum);                       // atomic increment
counts.putIfAbsent(k, 0);                               // atomic init
counts.computeIfAbsent(k, x -> new ArrayList<>());      // atomic lazy create
counts.compute(k, (key, v) -> v == null ? 1 : v + 1);   // atomic recompute
\`\`\`

The function you pass should be **short and side-effect-free** (it may run while holding a bucket lock).`,
      internal: `**Important behavioural notes:**

- **No null keys or values** — \`null\` is disallowed (unlike \`HashMap\`) because in a concurrent map \`get\` returning null would be ambiguous between "absent" and "mapped to null".
- **Weakly consistent iterator** — it's **fail-safe** (§5.2): it never throws \`ConcurrentModificationException\`, reflects some state at/after creation, and may or may not see concurrent updates. It does **not** lock the whole map.
- **\`size()\` is an estimate** under concurrency (use \`mappingCount()\` for a long).
- Bulk operations (\`forEach\`, \`search\`, \`reduce\`) support parallelism with a parallelism threshold.`,
      useCases: `- **Concurrent caches / memoization** (\`computeIfAbsent\` for compute-once).
- **Shared counters / tallies** across threads (\`merge\`).
- **Registries / in-memory stores** accessed by many threads (web servers).
- **Producer/consumer metadata** in concurrent pipelines (Module 8).`,
      code: `\`\`\`java
import java.util.concurrent.*;

public class ChmDemo {
    public static void main(String[] args) throws InterruptedException {
        ConcurrentMap<String,Integer> counts = new ConcurrentHashMap<>();
        Runnable job = () -> { for (int i=0;i<10000;i++) counts.merge("hits", 1, Integer::sum); };

        Thread t1 = new Thread(job), t2 = new Thread(job);
        t1.start(); t2.start(); t1.join(); t2.join();

        System.out.println(counts.get("hits"));   // 20000 — no lost updates

        // atomic compute-once cache
        ConcurrentMap<Integer,Integer> cache = new ConcurrentHashMap<>();
        int v = cache.computeIfAbsent(7, k -> k * k);   // computed once even under threads
        System.out.println(v);                          // 49
    }
}
\`\`\``,
      mistakes: `- **Using check-then-act** (\`containsKey\` then \`put\`) — not atomic; use \`merge\`/\`computeIfAbsent\`/\`putIfAbsent\`.
- **Storing \`null\`** keys/values — throws \`NullPointerException\`.
- **Long/blocking work inside \`compute\`/\`merge\` lambdas** — can hold a bucket lock and stall others; keep them short.
- **Assuming \`size()\` is exact** under concurrency — it's an estimate.
- **Expecting the iterator to be a consistent snapshot** — it's weakly consistent, not point-in-time.
- **Using \`Hashtable\`/\`synchronizedMap\`** when \`ConcurrentHashMap\` scales better.`,
      bestPractices: `- Use \`ConcurrentHashMap\` for **shared maps** in multithreaded code (over \`Hashtable\`/\`synchronizedMap\`).
- Perform updates with **atomic methods** (\`merge\`, \`compute\`, \`computeIfAbsent\`, \`putIfAbsent\`); keep their lambdas **short and pure**.
- Remember **no nulls**; use a sentinel or \`Optional\` value type if needed.
- Treat \`size()\` as approximate; prefer atomic counters (\`LongAdder\`) for hot counts (Module 8).
- Don't synchronize the whole map externally — that defeats its design.`,
      interview: `**Q1. How does ConcurrentHashMap achieve thread safety?**
Java 8+: per-bucket synchronization + CAS for writes, lock-free volatile reads — only same-bucket writers contend (Java 7 used segment lock-striping).

**Q2. ConcurrentHashMap vs Hashtable?**
Both thread-safe, but \`Hashtable\` uses one global lock (slow); \`ConcurrentHashMap\` uses fine-grained locking/CAS for high concurrency. Neither allows nulls.

**Q3. Does it allow null keys/values?**
No — to avoid ambiguity between "absent" and "null" under concurrency.

**Q4. Why are check-then-act sequences unsafe even on a concurrent map?**
Individual methods are atomic but a sequence isn't; use \`merge\`/\`computeIfAbsent\` for atomic compound updates.

**Q5. What kind of iterator does it have?**
Weakly consistent / fail-safe — never throws CME, may not reflect concurrent updates, doesn't lock the map.

**Q6. ConcurrentHashMap vs Collections.synchronizedMap?**
\`synchronizedMap\` wraps a map with a single lock; \`ConcurrentHashMap\` scales far better and offers atomic compound methods.`,
      exercises: `1. Increment a shared counter from multiple threads using \`merge\` and confirm no lost updates.
2. Show that a \`containsKey\`+\`put\` sequence can lose updates; fix it with \`computeIfAbsent\`/\`putIfAbsent\`.
3. Demonstrate the no-null restriction throwing NPE.
4. Compare (conceptually) throughput of \`Hashtable\` vs \`ConcurrentHashMap\` under contention.`,
      challenges: `Build a thread-safe in-memory cache with \`ConcurrentHashMap.computeIfAbsent\` that computes each value exactly once even under concurrent first-access (a "compute-once" cache). Then add per-key hit counters via \`merge\`/\`LongAdder\`, and discuss why doing expensive computation inside \`computeIfAbsent\` can be problematic (bucket lock) and how to mitigate it — bridging into Module 8.`,
      summary: `- **\`ConcurrentHashMap\`** = scalable thread-safe map: **per-bucket lock + CAS** writes, **lock-free reads** (Java 7 segment striping → Java 8 node locking).
- **No null** keys/values; **weakly consistent (fail-safe)** iterator; \`size()\` is approximate.
- Use **atomic methods** (\`merge\`/\`compute\`/\`computeIfAbsent\`/\`putIfAbsent\`) — check-then-act isn't atomic; keep lambdas short.
- Replaces **\`Hashtable\` (§5.16)** and \`synchronizedMap\` for concurrency (Module 8).`
    }),

    /* 5.18 Collections utility class — algorithms & wrappers. */
    topic({
      id: "collections-utility", chapter: "5.18", title: "Collections Utility Class",
      subtitle: "The java.util.Collections toolbox — algorithms, wrappers, and views.",
      readTime: "14 min", level: "Advanced", deep: true,
      objectives: [
        "Use Collections algorithms (sort, binarySearch, reverse, shuffle, min/max, frequency).",
        "Create unmodifiable, synchronized, and empty/singleton wrappers.",
        "Distinguish Collections (utility) from Collection (interface) (§5.1).",
        "Apply factory methods and immutable collections correctly."
      ],
      concept: `**\`java.util.Collections\`** is a **utility class** of \`static\` methods that operate on or return collections — sorting, searching, shuffling, reversing, and creating special wrappers (unmodifiable, synchronized, empty). It complements the framework's data structures with **ready-made algorithms** (the Strategy/algorithm side of the JCF).

\`\`\`java
List<Integer> list = new ArrayList<>(List.of(3, 1, 2));
Collections.sort(list);                 // [1, 2, 3]
Collections.reverse(list);              // [3, 2, 1]
int max = Collections.max(list);        // 3
\`\`\`

> Don't confuse **\`Collections\`** (this utility class) with **\`Collection\`** (the root interface, §5.1).`,
      why: `These utilities save you from re-implementing common operations and provide safe wrappers:

- **Algorithms** — sort/search/shuffle/min/max/frequency work across any \`List\`/\`Collection\`.
- **Safety wrappers** — \`unmodifiableList\` (read-only views) and \`synchronizedMap\` (thread-safe wrappers).
- **Convenience** — \`emptyList\`, \`singletonList\`, \`nCopies\` for clean, allocation-light code.

They embody "program against the framework" — reuse battle-tested algorithms instead of hand-rolling.`,
      algorithms: `**Common algorithm methods:**

| Method | Purpose |
|---|---|
| \`sort(list)\` / \`sort(list, cmp)\` | sort (TimSort, O(n log n)) using natural/Comparator (§5.4) |
| \`binarySearch(list, key)\` | O(log n) search on a **sorted** list |
| \`reverse(list)\` | reverse in place |
| \`shuffle(list)\` | random permutation |
| \`min(c)\` / \`max(c)\` | extremes by ordering |
| \`frequency(c, o)\` | count occurrences |
| \`swap(list, i, j)\`, \`rotate\`, \`fill\`, \`copy\` | element manipulation |
| \`disjoint(a, b)\` | true if no common elements |

\`\`\`java
Collections.shuffle(deck);
int idx = Collections.binarySearch(sorted, 42);   // list MUST be sorted first
System.out.println(Collections.frequency(list, 2));
\`\`\``,
      wrappers: `**Wrapper / view factories:**

\`\`\`java
// read-only view (throws on modification)
List<String> ro = Collections.unmodifiableList(list);

// thread-safe wrapper (single lock around a normal collection)
Map<String,Integer> sm = Collections.synchronizedMap(new HashMap<>());

// empty / singleton (immutable, allocation-light)
List<String> none = Collections.emptyList();
Set<String> one  = Collections.singleton("only");
List<String> threeXs = Collections.nCopies(3, "x");   // [x, x, x]
\`\`\`

Notes:
- \`unmodifiable*\` is a **view** — the underlying collection can still change; for a true immutable copy use \`List.copyOf\` / \`List.of\` (below).
- \`synchronized*\` locks the whole collection per call; **manual synchronization is still needed when iterating** it (Module 8). For concurrency, prefer \`java.util.concurrent\` (§5.17).`,
      factories: `**Java 9+ immutable factory methods** (often better than \`Collections\` wrappers for new code):

\`\`\`java
List<Integer> l = List.of(1, 2, 3);          // immutable, no nulls
Set<String>  s = Set.of("a", "b");           // immutable set
Map<String,Integer> m = Map.of("a", 1, "b", 2); // immutable map
List<Integer> copy = List.copyOf(existing);  // immutable snapshot copy
\`\`\`

These return compact, truly **immutable** collections (throw on modification, disallow nulls) — ideal for constants and defensive copies (Module 3 §3.4 immutability).`,
      internal: `\`Collections.sort\` delegates to \`List.sort\` → a stable **TimSort** (O(n log n)). \`binarySearch\` requires the list to be **sorted by the same ordering** or results are undefined. \`unmodifiable*\` returns a wrapper that throws \`UnsupportedOperationException\` on mutators but **reflects changes** to the backing collection (it's a view, not a copy). \`synchronized*\` wraps each method in a \`synchronized\` block on a shared mutex — coarse-grained, and iteration must be externally synchronized. The \`of\`/\`copyOf\` factories produce special compact immutable implementations.`,
      useCases: `- **Sorting/searching** lists with natural or custom ordering (§5.4).
- **Defensive returns**: \`unmodifiableList\`/\`List.copyOf\` to protect internal collections (encapsulation, Module 2 §2.5).
- **Quick thread-safe wrapping** of an existing collection (legacy; prefer concurrent collections).
- **Constants/empties**: \`List.of\`, \`emptyList\`, \`singleton\`.`,
      code: `\`\`\`java
import java.util.*;

public class CollectionsUtilDemo {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>(List.of(5, 3, 8, 1));
        Collections.sort(list);                       // [1, 3, 5, 8]
        System.out.println(Collections.binarySearch(list, 5)); // index 2
        Collections.reverse(list);                    // [8, 5, 3, 1]
        System.out.println(Collections.max(list));    // 8

        // defensive, read-only return
        List<Integer> ro = Collections.unmodifiableList(list);
        try { ro.add(99); } catch (UnsupportedOperationException e) { System.out.println("read-only"); }

        // truly immutable (Java 9+)
        List<String> consts = List.of("A", "B", "C");
        System.out.println(consts);
    }
}
\`\`\``,
      mistakes: `- **Confusing \`Collections\` with \`Collection\`** — utility class vs interface (§5.1).
- **\`binarySearch\` on an unsorted list** — returns garbage; sort with the same ordering first.
- **Thinking \`unmodifiableList\` is immutable** — it's a *view*; the backing list can still change (use \`List.copyOf\`).
- **Modifying a \`List.of\`/\`Set.of\` result** — throws \`UnsupportedOperationException\`; they're immutable.
- **Passing \`null\` to \`of\`/\`copyOf\`** — throws \`NullPointerException\`.
- **Relying on \`synchronizedMap\` alone while iterating** — iteration needs external synchronization (Module 8).`,
      bestPractices: `- Use \`Collections.sort\`/\`binarySearch\`/etc. instead of hand-rolling algorithms; pass a \`Comparator\` (§5.4) when needed.
- Return **\`List.copyOf\`** (true immutable copy) or \`unmodifiableList\` (view) to protect internal state (Module 2 §2.5).
- Prefer **\`List.of\`/\`Set.of\`/\`Map.of\`** for constants/immutables (no nulls).
- For thread safety, prefer **\`java.util.concurrent\`** (§5.17) over \`synchronized*\` wrappers.
- Remember \`binarySearch\` requires a list **sorted by the same comparator**.`,
      interview: `**Q1. Difference between \`Collection\` and \`Collections\`?**
\`Collection\` is the root interface (§5.1); \`Collections\` is a utility class of static algorithm/wrapper methods.

**Q2. How do you make a list read-only?**
\`Collections.unmodifiableList(list)\` (a view) or \`List.copyOf(list)\`/\`List.of(...)\` (immutable copies).

**Q3. unmodifiableList vs List.of — difference?**
\`unmodifiableList\` is a view over a possibly-mutable backing list; \`List.of\` is a standalone immutable collection.

**Q4. What does \`Collections.synchronizedMap\` give you, and its limitation?**
A thread-safe wrapper with one lock; iteration still needs external synchronization, and it scales worse than \`ConcurrentHashMap\` (§5.17).

**Q5. Prerequisite for \`binarySearch\`?**
The list must be sorted by the same ordering used in the search.

**Q6. Which sort algorithm does \`Collections.sort\` use?**
Stable TimSort, O(n log n).`,
      exercises: `1. Sort, reverse, shuffle, and \`binarySearch\` a list; show binarySearch fails if unsorted.
2. Return an \`unmodifiableList\` from a method and demonstrate it throws on modification but reflects backing changes.
3. Replace it with \`List.copyOf\` and show the snapshot is independent.
4. Use \`Collections.frequency\` and \`Collections.max\` with a custom \`Comparator\`.`,
      challenges: `Write a \`Roster\` class that stores members internally in an \`ArrayList\` but exposes them only via a defensive accessor. Implement two variants — one returning \`Collections.unmodifiableList\` (view) and one returning \`List.copyOf\` (snapshot) — and demonstrate the behavioural difference when the internal list changes afterward. Tie this to encapsulation (Module 2 §2.5) and immutability (Module 3 §3.4).`,
      summary: `- **\`Collections\`** (utility) ≠ **\`Collection\`** (interface): static **algorithms** (sort/binarySearch/reverse/shuffle/min/max/frequency) and **wrappers**.
- **\`unmodifiable*\`** = read-only *view*; **\`List.of\`/\`copyOf\`** = true **immutable** collections (no nulls).
- **\`synchronized*\`** wrappers are coarse (iterate under external lock); prefer **\`java.util.concurrent\` (§5.17)**.
- \`binarySearch\` needs a **sorted** list; \`sort\` is stable **TimSort** (§5.4).`
    }),

    /* 5.19 Choosing the Right Collection — capstone. */
    topic({
      id: "choosing-collections", chapter: "5.19", title: "Choosing the Right Collection & Performance",
      subtitle: "Capstone — pick the right structure by requirements and Big-O.",
      readTime: "16 min", level: "Advanced", deep: true,
      objectives: [
        "Select a collection from access pattern, ordering, uniqueness, and concurrency needs.",
        "Recall the Big-O of every major implementation in one place.",
        "Apply a decision framework to real scenarios.",
        "Consolidate the module into interview-ready guidance."
      ],
      concept: `This capstone turns the whole module into **decisions**. Choosing a collection comes down to a few questions:

1. **List, Set, or Map?** (sequence / uniqueness / key→value — §5.1)
2. **Ordering?** none / insertion / sorted / access (LRU)
3. **Access pattern?** random index, ends only, by key, by priority
4. **Duplicates allowed?** (Set vs List)
5. **Thread-safe?** (single-threaded vs concurrent — §5.17)

Answer these and the right implementation usually follows directly.`,
      bigOTable: `**The master Big-O table (memorise for interviews):**

| Collection | get/access | add | remove | contains/search | ordered? |
|---|---|---|---|---|---|
| \`ArrayList\` | **O(1)** index | O(1)* end | O(n) | O(n) | insertion (§5.5) |
| \`LinkedList\` | O(n) index | O(1) ends | O(1) ends | O(n) | insertion (§5.6) |
| \`ArrayDeque\` | — | O(1) ends | O(1) ends | O(n) | insertion (§5.12) |
| \`HashSet\` | — | O(1) | O(1) | **O(1)** | none (§5.8) |
| \`LinkedHashSet\` | — | O(1) | O(1) | O(1) | insertion (§5.9) |
| \`TreeSet\` | — | O(log n) | O(log n) | O(log n) | **sorted** (§5.10) |
| \`PriorityQueue\` | O(1) peek | O(log n) | O(log n) | O(n) | heap (§5.11) |
| \`HashMap\` | **O(1)** | O(1) | O(1) | O(1) | none (§5.13) |
| \`LinkedHashMap\` | O(1) | O(1) | O(1) | O(1) | insertion/access (§5.14) |
| \`TreeMap\` | O(log n) | O(log n) | O(log n) | O(log n) | **sorted** (§5.15) |
| \`ConcurrentHashMap\` | O(1) | O(1) | O(1) | O(1) | none, thread-safe (§5.17) |

\\* amortised; hash structures are average-case O(1), worst O(log n) after treeification (§5.13).`,
      decisionGuide: `**Decision cheat-sheet — "I need…":**

| Requirement | Use |
|---|---|
| Ordered list, fast random access | **\`ArrayList\`** (§5.5) |
| Stack or queue | **\`ArrayDeque\`** (§5.12) |
| Priority order | **\`PriorityQueue\`** (§5.11) |
| Unique elements, fastest | **\`HashSet\`** (§5.8) |
| Unique + insertion order | **\`LinkedHashSet\`** (§5.9) |
| Unique + sorted / range queries | **\`TreeSet\`** (§5.10) |
| Key→value, fastest | **\`HashMap\`** (§5.13) |
| Key→value + insertion/access order / LRU | **\`LinkedHashMap\`** (§5.14) |
| Key→value + sorted / range queries | **\`TreeMap\`** (§5.15) |
| Thread-safe map | **\`ConcurrentHashMap\`** (§5.17) |
| Thread-safe list/queue | \`CopyOnWriteArrayList\` / blocking queues (Module 8) |`,
      performance: `**Performance principles that matter in practice:**

- **\`ArrayList\` usually beats \`LinkedList\`** even for iteration — contiguous memory + cache locality (§5.6).
- **Pre-size** \`ArrayList\`/\`HashMap\` when the count is known to avoid resize/rehash (§5.5/§5.13).
- **Hash O(1) vs Tree O(log n)** — use hash structures unless you need ordering/range queries.
- **\`ArrayDeque\` over \`Stack\`/\`LinkedList\`** for stacks/queues (§5.7/§5.12).
- **Correct \`equals\`/\`hashCode\`** (§5.3) is a *performance* concern too — bad hashing degrades hash maps/sets to O(n).
- For concurrency, prefer **\`java.util.concurrent\`** (fine-grained) over \`synchronized*\` wrappers (§5.17/§5.18).`,
      useCases: `- **Web request handler**: \`ConcurrentHashMap\` cache, \`ArrayList\` results, \`ArrayDeque\` work queue.
- **Graph/BFS-DFS** (Module 14): \`ArrayDeque\` (frontier), \`HashSet\` (visited), \`HashMap\` (adjacency), \`PriorityQueue\` (Dijkstra).
- **Leaderboard**: \`TreeSet\`/\`TreeMap\` for ranked order + range queries.
- **LRU cache**: access-order \`LinkedHashMap\` (§5.14).`,
      code: `\`\`\`java
import java.util.*;

public class ChoosingDemo {
    public static void main(String[] args) {
        // counting (HashMap) + sorted report (TreeMap)
        String text = "the quick brown fox the lazy dog the end";
        Map<String,Integer> freq = new HashMap<>();
        for (String w : text.split(" ")) freq.merge(w, 1, Integer::sum);
        Map<String,Integer> sorted = new TreeMap<>(freq);   // sorted by word
        System.out.println(sorted);

        // dedup preserving order (LinkedHashSet)
        List<String> seenOrder = new ArrayList<>(new LinkedHashSet<>(List.of(text.split(" "))));
        System.out.println(seenOrder);

        // top-2 frequent words (PriorityQueue)
        PriorityQueue<Map.Entry<String,Integer>> pq =
            new PriorityQueue<>(Map.Entry.comparingByValue());
        for (var e : freq.entrySet()) { pq.offer(e); if (pq.size() > 2) pq.poll(); }
        System.out.println(pq);   // the + one other (heap order)
    }
}
\`\`\``,
      mistakes: `- **Defaulting to \`LinkedList\`** for lists — \`ArrayList\` is the better default (§5.6).
- **Using a \`TreeMap\`/\`TreeSet\`** when you don't need ordering — pay O(log n) for nothing.
- **\`HashMap\` across threads** — use \`ConcurrentHashMap\` (§5.17).
- **Ignoring \`equals\`/\`hashCode\`** for set elements / map keys (§5.3).
- **Not pre-sizing** large hash/array structures.
- **\`Vector\`/\`Stack\`/\`Hashtable\`** in new code — legacy (§5.7/§5.16).`,
      bestPractices: `**The interview-ready checklist:**

- Decide **interface first** (List/Set/Map/Queue), then **implementation** by ordering + access + concurrency.
- Default to **\`ArrayList\`, \`HashMap\`, \`HashSet\`, \`ArrayDeque\`**; upgrade to Linked*/Tree*/Concurrent* only when a requirement demands it.
- **Pre-size** and ensure correct **\`equals\`/\`hashCode\`** (§5.3) for hash performance.
- Use **\`Comparator\`** combinators for ordering (§5.4); **\`Collections\`/factory methods** for algorithms/immutables (§5.18).
- For threads, reach for **\`java.util.concurrent\`** (§5.17, Module 8); avoid legacy \`Vector\`/\`Hashtable\`.
- Know the **Big-O table** cold — it answers most "which collection?" questions.`,
      interview: `**Q1. How do you choose a collection?**
By interface (list/set/map/queue), then ordering (none/insertion/sorted/access), access pattern, duplicates, and concurrency needs.

**Q2. ArrayList vs LinkedList default?**
\`ArrayList\` — O(1) random access and better cache locality; \`LinkedList\` only for heavy end operations/deque (and even then \`ArrayDeque\`).

**Q3. When TreeMap/TreeSet over HashMap/HashSet?**
When you need sorted order or range/nearest queries; otherwise hash structures (O(1)) win.

**Q4. Which collection for an LRU cache?**
Access-order \`LinkedHashMap\` with \`removeEldestEntry\` (§5.14).

**Q5. Thread-safe map of choice?**
\`ConcurrentHashMap\` (§5.17), not \`Hashtable\`/\`synchronizedMap\`.

**Q6. Big-O of HashMap get vs TreeMap get?**
O(1) average vs O(log n).

**Q7. Which structures need equals/hashCode vs Comparable/Comparator?**
Hash-based need \`equals\`/\`hashCode\` (§5.3); tree-based/priority need ordering (§5.4).`,
      exercises: `1. For five scenarios (LRU cache, leaderboard, dedup-with-order, task scheduler, shared counter), name the best collection and justify it.
2. Reproduce the master Big-O table from memory, then verify against the chapters.
3. Refactor code that uses \`Vector\`/\`Stack\`/\`Hashtable\` to modern equivalents.
4. Pick collections for a BFS implementation and explain each choice.`,
      challenges: `Design the data structures for a small in-memory analytics service: ingest events (thread-safe), count by category, keep the top-N categories, support sorted range queries by timestamp, and dedup event IDs preserving arrival order. Choose a collection for each requirement, state its Big-O, and justify why alternatives are worse — a full capstone synthesis of §5.1–§5.18.`,
      summary: `- Choose by **interface → ordering → access pattern → duplicates → concurrency**; defaults are **\`ArrayList\`/\`HashMap\`/\`HashSet\`/\`ArrayDeque\`**.
- Upgrade to **Linked*** (order/LRU), **Tree*** (sorted/range), **Concurrent*** (threads) only when required.
- Know the **master Big-O table**, **pre-size**, and ensure **\`equals\`/\`hashCode\`** (§5.3) / **ordering** (§5.4).
- Avoid legacy \`Vector\`/\`Stack\`/\`Hashtable\`; use \`java.util.concurrent\` for threads — this capstone ties §5.1–§5.18 together.`
    })
  ]
});
