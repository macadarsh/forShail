/* Module 2: Object-Oriented Programming — edit ONLY this file for this module's content.
   Authored in ~2x the depth of Module 1: every chapter is deep:true with the full
   learning template plus topic-specific custom sections (rules, comparisons, internals).
   Each topic() auto-renders sections in declared order; see assets/site.js PART_LABELS. */
registerModule({
  id: "oop",
  module: "Object-Oriented Programming",
  page: "module-oop.html",
  icon: "🧩",
  tagline: "Model the world with classes, objects, inheritance, and polymorphism.",
  lessons: [

    /* 2.1 Classes and Objects — the two foundational nouns of OOP.
       Full depth: concept | why | internal (memory model) | useCases | code |
       members anatomy | object lifecycle | mistakes | bestPractices | interview | exercises | challenges | summary */
    topic({
      id: "classes-and-objects", chapter: "2.1", title: "Classes and Objects",
      subtitle: "The blueprint and the building — how Java models real-world entities.",
      readTime: "16 min", level: "Core", deep: true,
      objectives: [
        "Define a **class** as a blueprint and an **object** as a runtime instance of it.",
        "Declare classes with fields and methods, and create objects with \`new\`.",
        "Explain where objects and references live in JVM memory (heap vs stack).",
        "Describe the four pillars of OOP at a high level and how a class enables them."
      ],
      concept: `**Object-Oriented Programming (OOP)** organises a program around **objects** — self-contained units that bundle *data* (state) with the *behaviour* (operations) that acts on that data. Java is fundamentally object-oriented: apart from a handful of primitive types, everything you work with is an object.

A **class** is a **blueprint** or **template**. It defines *what* an entity is: its **fields** (also called instance variables — the state) and its **methods** (the behaviour). A class by itself occupies no application memory for state; it is a design.

An **object** is a concrete **instance** of a class created at runtime with the \`new\` keyword. Each object has its **own copy** of the instance fields and lives on the **heap**. From one class you can create as many objects as you need.

> Analogy: a class is the *architectural drawing* of a house; an object is an *actual house* built from that drawing. One drawing → many houses, each with its own address and its own furniture.

The **four pillars** that the rest of this module unpacks are all enabled by classes and objects: **Encapsulation** (§2.5), **Inheritance** (§2.6), **Polymorphism** (§2.9), and **Abstraction** (§2.10).`,
      why: `Why model software as objects rather than as free-floating functions and data?

- **Maps to the real world.** A \`BankAccount\`, an \`Order\`, a \`Customer\` — domain concepts become first-class types, so code reads like the business problem.
- **Encapsulation of state.** Data and the rules that protect it live together, so invalid states are harder to create (covered fully in §2.5).
- **Reuse.** A well-designed class is reused across the codebase and extended via inheritance (§2.6) or composition (§2.15).
- **Maintainability at scale.** Large enterprise systems (banking, telecom, e-commerce) survive for decades because object boundaries localise change — fix the \`Invoice\` class without touching the \`Shipping\` class.
- **Testability.** Objects with clear responsibilities can be tested in isolation.

This is exactly why TCS, Infosys, Accenture and product companies build their core systems in Java/Spring: the object model scales to thousands of types and many teams.`,
      internal: `Understanding **where things live in memory** is a frequent interview differentiator.

\`\`\`java
Car c1 = new Car();
\`\`\`

This single line involves three distinct things:

1. \`new Car()\` — allocates a fresh \`Car\` **object on the heap** and runs its constructor.
2. \`Car c1\` — declares a **reference variable** \`c1\` on the current thread's **stack**.
3. \`=\` — stores the heap **address** of the new object into \`c1\`.

\`\`\`
   STACK (per thread)            HEAP (shared, GC-managed)
  ┌───────────────┐            ┌──────────────────────┐
  │ c1 ──────────────────────► │ Car object           │
  └───────────────┘            │   model = null       │
                               │   speed = 0          │
                               └──────────────────────┘
\`\`\`

Key consequences:

- The **reference** (\`c1\`) is on the stack; the **object** is on the heap. Assigning \`Car c2 = c1;\` copies the *reference*, not the object — both point to the **same** heap object. (Reference vs value semantics is detailed in §2.3 and Module 3.)
- Each \`new\` produces a **separate** object with its **own** instance fields.
- When no reference points to an object any more, it becomes eligible for **garbage collection** — Java reclaims it automatically (you never \`free\`/\`delete\`).
- Instance fields get **default values** if not explicitly initialised: \`0\` for numeric types, \`false\` for \`boolean\`, \`'\\u0000'\` for \`char\`, and \`null\` for object references. (Local variables get **no** default — see §2.1 mistakes and Module 1.)`,
      anatomy: `A class can declare several kinds of members:

| Member | What it is | Example |
|---|---|---|
| **Instance field** | Per-object state | \`String model;\` |
| **Static field** | Per-class state, shared (§2.4) | \`static int count;\` |
| **Constructor** | Initialises a new object (§2.2) | \`Car() { ... }\` |
| **Instance method** | Behaviour on an object | \`void drive() { ... }\` |
| **Static method** | Behaviour on the class (§2.4) | \`static Car of(...) { }\` |
| **Nested class** | A class declared inside another | \`class Engine { }\` |

\`\`\`java
public class Car {
    // --- instance fields (state) ---
    String model;
    int speed;

    // --- instance method (behaviour) ---
    void accelerate(int delta) {
        speed += delta;
    }

    void describe() {
        System.out.println(model + " is going " + speed + " km/h");
    }
}
\`\`\``,
      useCases: `- **Domain modelling**: \`Employee\`, \`Account\`, \`Product\`, \`Reservation\` — each business noun is a class.
- **DTOs / entities**: classes that carry data between layers or map to database tables (JPA/Hibernate entities).
- **Services**: a \`PaymentService\` object encapsulates a cohesive set of operations.
- **Configuration & value objects**: \`Money\`, \`DateRange\`, \`Coordinates\` — small immutable objects.

Anywhere you'd say "a *thing* that *has* some data and *does* something," that's a class.`,
      code: `\`\`\`java
public class Car {
    String model;          // instance field
    int speed;             // instance field (defaults to 0)

    void accelerate(int delta) {  // instance method
        speed += delta;
    }
}

public class Showroom {
    public static void main(String[] args) {
        // create two independent objects from the same class
        Car a = new Car();
        a.model = "Tesla";
        a.accelerate(60);

        Car b = new Car();
        b.model = "Tata";
        b.accelerate(40);

        System.out.println(a.model + " @ " + a.speed); // Tesla @ 60
        System.out.println(b.model + " @ " + b.speed); // Tata @ 40

        // reference vs object: c points at the SAME object as a
        Car c = a;
        c.accelerate(10);
        System.out.println(a.speed); // 70 — a and c share one object
    }
}
\`\`\`

Proper initialisation through **constructors** (so you never hand-set fields like this) is the subject of §2.2; protecting those fields with \`private\` + getters/setters is §2.5.`,
      objectLifecycle: `An object's life has three phases:

1. **Creation** — \`new\` allocates heap memory, fields get defaults, the constructor runs (§2.2), and a reference is returned.
2. **In use** — the object is reachable through one or more references; methods read/modify its state.
3. **Eligible for GC** — when *no* live reference can reach it, the **Garbage Collector** may reclaim it. You cannot force collection; \`System.gc()\` is only a *hint*. (The deprecated \`finalize()\` is not a reliable cleanup hook — use \`try-with-resources\`, covered in Module 9.)`,
      mistakes: `- **NullPointerException**: declaring a reference but never assigning an object — \`Car c; c.drive();\` (or \`Car c = null;\`) calls a method on \`null\`.
- **Confusing reference copy with object copy**: \`Car b = a;\` does **not** clone; both names refer to one object.
- **Expecting local variables to have defaults**: instance fields default to \`0\`/\`null\`; **local** variables do **not** and must be initialised before use (compile error otherwise).
- **Class name ≠ file name**: a \`public\` class must live in a file of the same name (see Module 1).
- **Treating a class as if it holds data**: only **objects** hold instance state; the class is just the template.`,
      bestPractices: `- Give classes **single, clear responsibilities** (Single Responsibility Principle — Module 12).
- Use **PascalCase** for class names, nouns that name the entity (\`InvoiceItem\`, not \`DoInvoice\`).
- Keep fields **private** and expose behaviour via methods (§2.5) rather than public data.
- Prefer **constructors** (§2.2) over post-construction field assignment so objects are always valid.
- One top-level **public** class per file; keep classes small and cohesive.`,
      interview: `**Q1. Difference between a class and an object?**
A class is a blueprint/template defining state and behaviour; an object is a concrete runtime instance with its own copy of the instance fields, created with \`new\` and stored on the heap.

**Q2. Where are objects and references stored?**
The **object** lives on the **heap**; the **reference variable** lives on the **stack** (for locals) and holds the object's address.

**Q3. What happens, step by step, when \`new Car()\` executes?**
Memory is allocated on the heap, instance fields are set to default values, the constructor runs to initialise them, and the heap address is returned to the reference.

**Q4. Is Java a pure object-oriented language?**
No — it uses **primitive types** (\`int\`, \`char\`, \`boolean\`, …) that are not objects, so it is not 100% OOP.

**Q5. If \`Car b = a;\`, how many objects exist?**
One. Both \`a\` and \`b\` reference the same object; mutating through one is visible through the other.

**Q6. What are the default values of instance fields?**
\`0\` for numeric, \`false\` for boolean, \`'\\u0000'\` for char, \`null\` for references. Local variables have no defaults.`,
      exercises: `1. Create a \`Book\` class with fields \`title\`, \`author\`, \`pages\` and a method \`summary()\` that prints them. Instantiate three different books and print each.
2. Demonstrate reference sharing: create one \`Book\`, assign it to a second variable, change a field via the second variable, and show the change is visible through the first.
3. Print an instance field before assigning it (e.g., a fresh \`Book\`'s \`pages\`) and confirm it is \`0\`; then try the same with a local \`int\` and observe the compiler error.
4. Add a \`copies\` counter you increment in \`summary()\`; explain why each object tracks its own count (contrast with \`static\` in §2.4).`,
      challenges: `Model a tiny library: a \`Book\` class and a \`Library\` class that holds an array of \`Book\` references and exposes \`addBook(Book)\` and \`listBooks()\`. Create five books, add them, and print the catalogue. Then set one \`Book\` reference to \`null\`, attempt to use it, and explain the resulting \`NullPointerException\` in terms of stack references and heap objects.`,
      summary: `- A **class** is a blueprint (fields + methods); an **object** is a runtime instance created with \`new\`.
- Objects live on the **heap**; references live on the **stack** and hold addresses.
- Each \`new\` makes an independent object; assigning a reference copies the *pointer*, not the object.
- Instance fields get **defaults**; locals do not. Unreferenced objects are **garbage collected**.
- Classes enable the four pillars: **Encapsulation (§2.5), Inheritance (§2.6), Polymorphism (§2.9), Abstraction (§2.10)**.`
    }),

    /* 2.2 Constructors — guaranteeing a valid object the moment it is born. */
    topic({
      id: "constructors", chapter: "2.2", title: "Constructors",
      subtitle: "Special methods that initialise an object so it is never half-built.",
      readTime: "16 min", level: "Core", deep: true,
      objectives: [
        "Explain what a constructor is and how it differs from an ordinary method.",
        "Distinguish default, no-arg, and parameterised constructors.",
        "Use constructor **overloading** and constructor **chaining** with \`this(...)\` and \`super(...)\`.",
        "Describe the exact order of initialisation when an object is created."
      ],
      concept: `A **constructor** is a special block of code that runs **automatically when an object is created** with \`new\`. Its job is to put the object into a valid, fully-initialised state before anyone uses it.

A constructor has two rules that make it *not* a normal method:

1. Its **name is exactly the class name**.
2. It has **no return type** — not even \`void\`.

\`\`\`java
public class Account {
    private double balance;

    public Account(double opening) {   // constructor
        balance = opening;             // object is valid before first use
    }
}

Account a = new Account(1000.0);       // constructor runs here
\`\`\`

If you write **no** constructor at all, the compiler inserts a **default constructor** (a public, no-argument one that just calls \`super()\`). The moment you declare **any** constructor, that free default disappears.`,
      why: `Constructors exist to enforce the invariant *"an object is valid from birth."* Without them you would create an empty object and then hope every caller remembers to set each field — a classic source of bugs (the half-initialised object).

- **Guaranteed initialisation** — required fields are set in one place.
- **Enforced invariants** — reject bad input (e.g., negative balance) before the object exists.
- **Immutability** — \`final\` fields can *only* be set in a constructor, enabling safe immutable objects (Module 3, Module 8).
- **Readability** — \`new Money(100, "INR")\` is clearer and safer than four separate setter calls.`,
      types: `| Constructor | Description | Provided by |
|---|---|---|
| **Default** | No-arg, auto-generated when you write none; calls \`super()\` | Compiler |
| **No-arg (explicit)** | You write one with no parameters | You |
| **Parameterised** | Takes arguments to initialise fields | You |
| **Copy (idiom)** | Takes another instance and copies its state | You (Java has no built-in copy ctor) |

\`\`\`java
public class Point {
    int x, y;
    public Point() { this(0, 0); }              // no-arg → delegates
    public Point(int x, int y) {                // parameterised
        this.x = x; this.y = y;
    }
    public Point(Point other) {                 // copy idiom
        this(other.x, other.y);
    }
}
\`\`\``,
      internal: `**Initialisation order** is a favourite tricky interview question. When \`new Sub()\` runs on a subclass, the JVM proceeds top-down through the hierarchy:

1. **Static** fields & static blocks of the class — **once**, when the class is first loaded (not per object).
2. For the new object: the **superclass** constructor runs first (via an implicit or explicit \`super(...)\`).
3. **Instance** field initialisers and **instance initialiser blocks** run, in source order.
4. The **constructor body** runs.

\`\`\`java
class Base {
    Base() { System.out.println("Base ctor"); }
}
class Sub extends Base {
    int x = init();                 // (3) instance initialiser
    Sub() {
        // super();  <-- implicitly inserted as first line
        System.out.println("Sub ctor");   // (4)
    }
    int init() { System.out.println("field init"); return 1; }
}
// new Sub() prints:  Base ctor → field init → Sub ctor
\`\`\`

> Rule: \`this(...)\` or \`super(...)\`, if present, **must be the first statement** in a constructor — you cannot call both, and you cannot call them anywhere else.`,
      chaining: `**Constructor chaining** is calling one constructor from another to avoid duplicated initialisation.

- \`this(...)\` chains to **another constructor in the same class**.
- \`super(...)\` chains to a **superclass constructor** (detailed with inheritance in §2.6).

\`\`\`java
public class User {
    String name;
    String role;

    public User(String name) {
        this(name, "GUEST");        // delegate to the fuller constructor
    }
    public User(String name, String role) {
        this.name = name;
        this.role = role;
    }
}
new User("Shail");                  // role defaults to "GUEST"
\`\`\`

This keeps the *actual* assignment logic in one constructor; the others just supply defaults.`,
      useCases: `- **Dependency injection**: frameworks like Spring prefer **constructor injection** — mandatory collaborators are passed in, making the object impossible to misconfigure.
- **Immutable value objects**: \`new Money(amount, currency)\` with \`final\` fields.
- **Validation gates**: throw \`IllegalArgumentException\` in the constructor so invalid objects never exist.
- **Builder pattern** (Module 13): a private constructor plus a fluent builder for objects with many optional fields.`,
      code: `\`\`\`java
public class Account {
    private final String owner;   // final → must be set in a constructor
    private double balance;

    public Account(String owner) {
        this(owner, 0.0);                       // chaining
    }
    public Account(String owner, double opening) {
        if (owner == null || owner.isBlank())
            throw new IllegalArgumentException("owner required");
        if (opening < 0)
            throw new IllegalArgumentException("opening cannot be negative");
        this.owner = owner;
        this.balance = opening;
    }
    public double getBalance() { return balance; }
}

Account a = new Account("Shail", 5000);
Account b = new Account("Asha");             // balance starts at 0
// new Account("", -1);  -> throws IllegalArgumentException
\`\`\``,
      mistakes: `- **Giving a return type** turns the "constructor" into an ordinary method that is *never* called by \`new\`: \`public void Account() {}\` is a method, not a constructor — a silent, nasty bug.
- **Assuming the default still exists** after adding a parameterised constructor — \`new Account()\` then fails to compile.
- **Putting \`this()\`/\`super()\` anywhere but the first line** — compile error.
- **Calling overridable methods from a constructor** — the subclass override runs before the subclass is initialised, seeing default/null fields.
- **Doing heavy work** (I/O, threads) in a constructor — keep constructors fast and side-effect-light.`,
      bestPractices: `- Validate arguments and **fail fast** with exceptions so no invalid object is created.
- Use **constructor chaining** (\`this(...)\`) to keep one authoritative initialiser.
- Prefer **constructor injection** for required dependencies; reserve setters for truly optional state.
- Make fields \`final\` where possible and initialise them in the constructor (immutability).
- For many optional parameters, use a **Builder** (Module 13) instead of telescoping constructors.`,
      interview: `**Q1. What is a constructor and how is it different from a method?**
A special initialiser that runs on \`new\`; its name equals the class name and it has no return type. A method has a return type and is called explicitly.

**Q2. What is the default constructor?**
A no-arg constructor the compiler adds *only if* you declare none; it calls \`super()\`.

**Q3. Can a constructor be \`private\`?**
Yes — used by singletons, factory methods, and the builder pattern to control instantiation.

**Q4. Can constructors be overloaded? Overridden?**
Overloaded — yes (multiple signatures). Overridden — no; constructors are not inherited.

**Q5. Difference between \`this()\` and \`super()\`?**
\`this()\` calls another constructor in the same class; \`super()\` calls a superclass constructor. Either must be the first statement, and you can't use both in one constructor.

**Q6. What is the order of initialisation in a class hierarchy?**
Static init (once) → super constructor → instance initialisers/fields → this constructor body.

**Q7. Can a constructor throw an exception?**
Yes — it's a common way to reject invalid arguments.`,
      exercises: `1. Write a \`Rectangle\` class with a no-arg constructor (1×1), a \`(side)\` constructor for squares, and a \`(w,h)\` constructor — implement the first two using \`this(...)\` chaining.
2. Add validation that throws \`IllegalArgumentException\` for non-positive dimensions; write code that catches it.
3. Add \`static int instances\` incremented in every constructor and print how many \`Rectangle\` objects you created.
4. Make a field \`final\` and prove it can only be assigned inside a constructor (observe the compile error if assigned elsewhere).`,
      challenges: `Create a hierarchy \`Vehicle\` → \`Car\`, each with parameterised constructors. Add an instance initialiser block and a static block to both, plus print statements in every constructor. Instantiate one \`Car\` and, *before running it*, write down the exact order of the printed lines; then run it and reconcile any differences with the initialisation-order rules above.`,
      summary: `- A constructor initialises a new object; name = class name, **no return type**, runs on \`new\`.
- The compiler supplies a **default** no-arg constructor only when you declare none.
- Use **overloading** + **chaining** (\`this(...)\`, \`super(...)\`) to avoid duplication; the chain call must be first.
- Init order: static (once) → super ctor → instance initialisers → ctor body.
- Validate in constructors to keep objects always valid; \`super(...)\` is explored further in **§2.6**.`
    }),

    /* 2.3 this keyword — the reference to the current object. */
    topic({
      id: "this-keyword", chapter: "2.3", title: "this Keyword",
      subtitle: "An implicit reference to the object whose method is currently running.",
      readTime: "12 min", level: "Core", deep: true,
      objectives: [
        "Explain what \`this\` refers to and where it is available.",
        "Use \`this\` to disambiguate fields from parameters and to chain constructors.",
        "Return \`this\` to build fluent (method-chaining) APIs.",
        "State exactly where \`this\` cannot be used."
      ],
      concept: `\`this\` is an implicit **reference to the current object** — the specific instance on which an instance method or constructor is executing. Every non-static method receives \`this\` invisibly; \`obj.move()\` is really "run \`move\` with \`this = obj\`."

\`\`\`java
class Counter {
    int count;
    void inc() { this.count++; }   // this == the object inc() was called on
}
\`\`\`

You usually omit \`this\` (\`count++\` works), but it becomes essential when a local name **shadows** a field.`,
      why: `\`this\` solves real problems:

- **Name shadowing**: when a parameter has the same name as a field, \`this.field = field;\` says "the *field*, not the parameter."
- **Constructor chaining**: \`this(...)\` reuses another constructor (§2.2).
- **Fluent APIs**: \`return this;\` lets you chain calls — \`builder.a().b().c()\`.
- **Passing the current object**: register \`this\` as a listener/callback, or pass it to a collaborator.`,
      usages: `The five common uses, with examples:

\`\`\`java
class Box {
    int w, h;

    Box(int w, int h) {
        this.w = w;          // 1) disambiguate field vs parameter
        this.h = h;
    }
    Box() { this(1, 1); }    // 2) call another constructor (must be first line)

    Box grow(int by) {
        this.w += by; this.h += by;
        return this;         // 3) return current object for chaining
    }
    void register(Registry r) {
        r.add(this);         // 4) pass current object to a collaborator
    }
    void debug() {
        System.out.println(this); // 5) reference the whole object (calls toString)
    }
}

new Box(2, 3).grow(1).grow(1);   // fluent chaining via returned this
\`\`\``,
      internal: `\`this\` is **not** a field stored in the object; it is a hidden **first parameter** the JVM passes to every instance method. That's why:

- \`this\` exists only in **instance** context. **\`static\` methods have no \`this\`** — there's no current object — so referencing \`this\` (or an instance field without an object) inside a static method is a compile error.
- \`this\` is effectively **final**: you cannot reassign \`this = something\`.
- For an inner (non-static nested) class, \`Outer.this\` names the enclosing instance, distinguishing it from the inner object's own \`this\`.`,
      useCases: `- **Builders & fluent DSLs** (\`StringBuilder.append(..).append(..)\`, query builders) all return \`this\`.
- **Self-registration**: \`eventBus.subscribe(this)\`.
- **Copy/equality helpers**: \`return this == other || ...\` short-circuits in \`equals\` (Module 3).
- **Telescoping constructors** delegating with \`this(...)\`.`,
      code: `\`\`\`java
public class QueryBuilder {
    private final StringBuilder sql = new StringBuilder("SELECT * FROM t");

    public QueryBuilder where(String cond) {
        sql.append(" WHERE ").append(cond);
        return this;                       // enable chaining
    }
    public QueryBuilder orderBy(String col) {
        sql.append(" ORDER BY ").append(col);
        return this;
    }
    public String build() { return sql.toString(); }

    public static void main(String[] args) {
        String q = new QueryBuilder()
                .where("age > 18")
                .orderBy("name")
                .build();
        System.out.println(q);
    }
}
\`\`\``,
      mistakes: `- Using \`this\` in a **static** method or static block — there is no current instance (compile error).
- **Forgetting \`this.\`** when a parameter shadows a field: \`name = name;\` silently assigns the parameter to itself, leaving the field unchanged.
- Placing \`this(...)\` anywhere but the **first** line of a constructor.
- Confusing \`this\` (this object) with \`super\` (the superclass part of this object — §2.6).`,
      bestPractices: `- Use \`this.\` consistently in constructors/setters where parameters mirror field names — it's the clearest convention.
- Return \`this\` to design fluent, readable builder-style APIs.
- Don't sprinkle \`this.\` everywhere when there's no shadowing; it adds noise.
- Never leak \`this\` from a constructor (registering an unfinished object can expose default/null state to other threads — Module 8).`,
      interview: `**Q1. What does \`this\` refer to?**
The current object — the instance on which the executing instance method/constructor was invoked.

**Q2. Why can't you use \`this\` in a static method?**
Static methods belong to the class, not an instance, so there is no current object to reference.

**Q3. Give two distinct uses of \`this\`.**
Disambiguating a field from a same-named parameter (\`this.x = x\`) and constructor chaining (\`this(...)\`).

**Q4. What does returning \`this\` enable?**
Method chaining / fluent APIs (e.g., builders).

**Q5. Difference between \`this\` and \`super\`?**
\`this\` references the current object; \`super\` references the superclass portion (its members/constructor) of the current object.`,
      exercises: `1. Write a \`Person\` class whose constructor parameters are named identically to its fields; use \`this\` to assign them. Remove the \`this.\` and observe that the fields stay at defaults.
2. Build a fluent \`PizzaBuilder\` with \`size()\`, \`addTopping()\`, \`build()\` that each return \`this\` except \`build()\`.
3. Add a static method to \`Person\` and try to reference \`this\` inside it; read the compiler error.`,
      challenges: `Implement an immutable-feeling fluent \`HttpRequest\` builder: methods \`url\`, \`header\`, \`method\` each mutate internal state and \`return this\`, and \`send()\` returns a \`String\` summary. Then explain why a *truly* immutable builder would instead return a **new** object each time rather than \`this\` (ties into immutability in Module 3).`,
      summary: `- \`this\` = reference to the **current object**; passed implicitly to every instance method.
- Uses: disambiguate field/parameter, chain constructors (\`this(...)\`), return for fluent APIs, pass the current object.
- **Unavailable in static context**; effectively final; \`Outer.this\` names an enclosing instance.
- Distinct from \`super\` (the superclass part — **§2.6**).`
    }),

    /* 2.4 static keyword — members that belong to the class, not the instance. */
    topic({
      id: "static-keyword", chapter: "2.4", title: "static Keyword",
      subtitle: "Fields, methods, and blocks that belong to the class itself.",
      readTime: "15 min", level: "Core", deep: true,
      objectives: [
        "Explain what \`static\` means and how class-level members differ from instance members.",
        "Use static fields, static methods, static blocks, and static nested classes correctly.",
        "Describe where static data lives and when it initialises.",
        "Recognise the pitfalls of static (shared mutable state, testability, memory leaks)."
      ],
      concept: `The \`static\` keyword binds a member to the **class itself** rather than to any individual object. There is **exactly one copy** of a static member, shared by every instance and accessible **without** creating an object.

- A **static field** is shared state: all objects see and modify the same variable.
- A **static method** runs without an instance (\`Math.max(...)\`); it has no \`this\`.
- A **static block** runs once, when the class is loaded, to initialise static state.
- A **static nested class** is a class that doesn't need an enclosing instance.

\`\`\`java
class Counter {
    static int total;     // ONE copy for the whole class
    int id;               // one copy per object

    Counter() { id = ++total; }   // assign id, bump shared total
}
new Counter(); new Counter(); new Counter();
System.out.println(Counter.total); // 3  (accessed via the class)
\`\`\``,
      why: `Use \`static\` when something logically belongs to the **type**, not to any one object:

- **Shared constants**: \`public static final double PI = 3.14159;\`
- **Counters / registries**: a value all instances must agree on.
- **Utility methods**: stateless helpers (\`Math\`, \`Collections\`, \`Integer.parseInt\`) that need no object.
- **Factory methods**: \`List.of(...)\`, \`Optional.empty()\` — create objects via the class.
- **The entry point**: \`public static void main\` runs before any object exists.`,
      internal: `**Where and when:**

- Static fields live in the **method area / Metaspace** (class metadata), not on the per-object heap layout.
- They are initialised **once**, when the class is **first loaded** (on first use), in the order static initialisers and static blocks appear.
- Instance members live on the **heap** with each object; static members exist independent of any object.

\`\`\`java
class Config {
    static final Map<String,String> DEFAULTS;
    static {                                   // static block — runs once
        DEFAULTS = new HashMap<>();
        DEFAULTS.put("env", "prod");
    }
}
\`\`\`

**Static method dispatch is *not* polymorphic.** Static methods are bound at compile time by the *reference type* — they are **hidden**, not overridden (contrast with §2.8). Calling a static method through an instance reference is legal but misleading; always call via the class (\`Counter.total\`, \`Math.max\`).`,
      comparison: `| Aspect | Instance member | Static member |
|---|---|---|
| Belongs to | An object | The class |
| Copies | One per object | Exactly one |
| Access | Needs an object | Via class name |
| \`this\` available? | Yes | No |
| Can use instance members directly? | Yes | No (needs an object) |
| Polymorphic? | Methods: yes (override) | No (hidden/early-bound) |
| Memory | Heap (per object) | Metaspace (per class) |`,
      useCases: `- **Utility classes**: \`StringUtils\`, \`Math\` — all static methods, often with a private constructor to prevent instantiation.
- **Constants**: \`static final\` configuration values.
- **Singletons / counters / caches**: a single shared instance or count.
- **Factory methods**: named alternatives to constructors.
- **Logging**: \`private static final Logger log = LoggerFactory.getLogger(X.class);\` — one logger per class.`,
      code: `\`\`\`java
public final class MathUtils {
    public static final double GOLDEN_RATIO = 1.618033988749895;

    private MathUtils() {}                 // prevent instantiation

    public static int clamp(int v, int lo, int hi) {  // stateless utility
        return Math.max(lo, Math.min(v, hi));
    }
}

class IdGenerator {
    private static long seq = 0;           // shared across all callers
    public static synchronized long next() { return ++seq; } // thread-safe (Module 8)
}

// usage — no objects needed
int x = MathUtils.clamp(120, 0, 100);      // 100
long id1 = IdGenerator.next();             // 1
long id2 = IdGenerator.next();             // 2
\`\`\``,
      mistakes: `- **Accessing instance members from a static method** — \`static void f(){ print(name); }\` won't compile; there's no object.
- **Calling static methods through instances** — \`obj.staticMethod()\` compiles but hides the fact it's class-level; use \`Class.method()\`.
- **Shared mutable static state** — a static \`List\`/\`Map\` mutated by many threads causes race conditions (Module 8) and makes tests interfere with each other.
- **Static fields holding large objects** — they live as long as the class is loaded; a static collection that only grows is a classic **memory leak**.
- **Expecting static methods to be overridden** — they are *hidden*, resolved by reference type (§2.8).`,
      bestPractices: `- Make true constants \`public static final\` and name them \`UPPER_SNAKE_CASE\`.
- For utility classes, mark the class \`final\` and give it a \`private\` constructor.
- Keep static methods **stateless** (pure functions of their arguments) — easy to test, thread-safe by default.
- Avoid **mutable** static state; if unavoidable, guard it for concurrency (Module 8) and reset it in tests.
- Prefer dependency injection over static singletons when you need to mock/replace collaborators.`,
      interview: `**Q1. What does \`static\` mean?**
The member belongs to the class, not to instances — there is one shared copy, accessible without an object.

**Q2. Why is \`main\` static?**
So the JVM can call it without first constructing an object of the class.

**Q3. Can a static method access instance variables?**
No — it has no \`this\`/current object. It can access other static members directly.

**Q4. Can you override a static method?**
No. Static methods are *hidden*, not overridden; they're resolved at compile time by the reference type.

**Q5. When does a static block run?**
Once, when the class is first loaded/initialised, before any instance is created.

**Q6. Where do static variables live?**
In the method area / Metaspace, associated with the class, not on the per-object heap.

**Q7. Difference between static and instance variables?**
Static: one per class, shared. Instance: one per object, independent copies.`,
      exercises: `1. Add a \`static int count\` to a \`Widget\` class, increment it in the constructor, create several widgets, and print \`Widget.count\`. Give each widget a unique \`id\` from the same counter.
2. Write a \`TemperatureConverter\` utility class with only static methods (\`cToF\`, \`fToC\`) and a private constructor; call them without instantiation.
3. Try to read an instance field from a static method and read the compiler error; fix it by passing an object as a parameter.
4. Add a static block that initialises a \`static final\` lookup map and print it before creating any instance.`,
      challenges: `Implement a thread-unsafe \`IdGenerator\` with a plain \`static long seq\` and spawn many threads calling \`next()\` (Module 8 preview) to observe duplicate/missing IDs; then fix it with \`AtomicLong\` or \`synchronized\` and explain why shared static mutable state is dangerous. Discuss how a static cache that only ever grows becomes a memory leak.`,
      summary: `- \`static\` = belongs to the **class**: one shared copy, usable without an object, no \`this\`.
- Static fields live in Metaspace and initialise **once** at class load (static blocks run then).
- Static methods are **hidden**, not overridden — early-bound by reference type (§2.8).
- Great for constants, utilities, factories, counters; **risky** as shared mutable state (concurrency + memory leaks).
- Static utility classes: \`final\` + \`private\` constructor.`
    }),

    /* 2.5 Encapsulation — the first pillar of OOP. */
    topic({
      id: "encapsulation", chapter: "2.5", title: "Encapsulation",
      subtitle: "Pillar 1 — hide state behind a controlled interface so objects stay valid.",
      readTime: "16 min", level: "Core", deep: true,
      objectives: [
        "Define encapsulation and distinguish it from abstraction.",
        "Apply data hiding with \`private\` fields and public accessors.",
        "Enforce invariants inside setters and design read-only / immutable classes.",
        "Explain why encapsulation underpins maintainability and the JavaBeans convention."
      ],
      concept: `**Encapsulation** is the first pillar of OOP: **bundling state (fields) and the behaviour that operates on it (methods) into one unit, while hiding the internal representation** behind a controlled public interface. Outside code interacts with an object only through methods you choose to expose, never by touching raw fields.

It rests on **data hiding**: make fields \`private\` and expose carefully designed \`public\` methods (getters/setters or, better, intention-revealing operations).

\`\`\`java
public class BankAccount {
    private double balance;            // hidden state

    public double getBalance() {       // controlled read
        return balance;
    }
    public void deposit(double amt) {  // controlled write with a rule
        if (amt <= 0) throw new IllegalArgumentException("amount must be positive");
        balance += amt;
    }
}
\`\`\`

No one can set \`balance\` to a negative number from outside — the object **enforces its own rules**.`,
      why: `Encapsulation is what makes large systems maintainable:

- **Protects invariants** — validation lives in one place; the object can never enter an invalid state.
- **Freedom to change internals** — swap the field's type or representation without breaking callers, because they only depend on the method contract.
- **Reduced coupling** — callers depend on *what* an object does, not *how* it stores data.
- **Security & integrity** — sensitive data is shielded from arbitrary modification.
- **Easier debugging** — every change to \`balance\` goes through \`deposit\`/\`withdraw\`, so you can log or breakpoint a single choke point.

> Encapsulation vs Abstraction (a classic interview pair): **abstraction** is *design-level* — deciding *what* to expose and hiding complexity (§2.10); **encapsulation** is the *implementation-level mechanism* — using access modifiers to *enforce* that hiding.`,
      internal: `Encapsulation is enforced by the compiler via **access modifiers** (full table in §2.16):

- \`private\` — visible only within the same class. The default choice for fields.
- *(package-private)* — no modifier: visible within the same package.
- \`protected\` — package + subclasses (§2.6).
- \`public\` — visible everywhere.

The mechanism is purely about **compile-time visibility**; there's no runtime cost. Note that encapsulation can still be bypassed via **reflection** (\`setAccessible(true)\`) — a deliberate escape hatch used by frameworks, not normal code.`,
      gettersSetters: `The **JavaBeans** convention standardises accessors so tools/frameworks (Spring, Hibernate, Jackson) can work generically:

| Field | Getter | Setter |
|---|---|---|
| \`String name\` | \`getName()\` | \`setName(String)\` |
| \`boolean active\` | \`isActive()\` | \`setActive(boolean)\` |

\`\`\`java
public class Employee {
    private String name;
    private double salary;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getSalary() { return salary; }
    public void setSalary(double salary) {
        if (salary < 0) throw new IllegalArgumentException("salary < 0");
        this.salary = salary;     // validation enforced on write
    }
}
\`\`\`

**Read-only** fields simply omit the setter (often combined with \`final\`); **write-only** fields omit the getter (rare — e.g., a password you can set but not read back).`,
      useCases: `- **Domain entities** that must obey business rules (an \`Order\` can't have a negative quantity).
- **Immutable value objects** (\`Money\`, \`LocalDate\`) — all-private final fields, no setters; thread-safe by construction (Module 8).
- **Framework integration** — JavaBeans getters/setters power data binding, serialisation, and ORM mapping.
- **API design** — exposing behaviour (\`account.withdraw(x)\`) instead of data lets the implementation evolve.`,
      code: `\`\`\`java
// A fully encapsulated, immutable value object
public final class Temperature {
    private final double celsius;       // private + final

    private Temperature(double c) { this.celsius = c; }

    public static Temperature ofCelsius(double c) {   // factory (§2.4)
        if (c < -273.15) throw new IllegalArgumentException("below absolute zero");
        return new Temperature(c);
    }
    public double celsius()    { return celsius; }
    public double fahrenheit() { return celsius * 9 / 5 + 32; }
    // no setters: state cannot change after construction
}

Temperature t = Temperature.ofCelsius(25);
System.out.println(t.fahrenheit());   // 77.0
\`\`\`

Prefer exposing **operations** over raw setters where business rules apply — \`account.withdraw(amt)\` is safer than \`account.setBalance(...)\`.`,
      mistakes: `- **Public fields** — \`public double balance;\` defeats encapsulation entirely; anyone can corrupt state.
- **"Dumb" getters/setters on everything** — auto-generating a setter for every field (no validation) is barely better than public fields. Add rules or omit the setter.
- **Leaking mutable internals** — \`return this.items;\` hands out the internal \`List\`, letting callers mutate it behind your back. Return a copy or an unmodifiable view (Module 5).
- **Validating in the getter instead of the setter** — guard the *write* path so bad data never gets stored.
- **Confusing encapsulation with abstraction** in interviews (see the distinction above).`,
      bestPractices: `- Make fields \`private\` (or \`private final\`) by default; expose the **minimum** necessary.
- Put **validation in setters/constructors** so invariants always hold.
- Favour **immutability**: final fields, no setters, defensive copies of mutable inputs/outputs.
- Return **defensive copies** or **unmodifiable views** of internal collections.
- Design the API around **behaviour**, not data — expose intent-revealing methods, not bean plumbing, where rules exist.`,
      interview: `**Q1. What is encapsulation?**
Bundling data and methods in one unit and hiding internal state behind a controlled public interface (data hiding via access modifiers).

**Q2. How do you achieve it in Java?**
Make fields \`private\` and provide \`public\` getters/setters (or behaviour methods), enforcing rules in the write path.

**Q3. Encapsulation vs abstraction?**
Abstraction hides *complexity* and decides *what* to expose (design); encapsulation hides *data* and *enforces* it via access modifiers (mechanism).

**Q4. Benefits of encapsulation?**
Invariant protection, loose coupling, freedom to change internals, security, single point of control for debugging.

**Q5. Can encapsulation be broken?**
Yes — via reflection (\`setAccessible(true)\`), used intentionally by frameworks.

**Q6. What is a read-only class?**
One with private final fields and getters but no setters (often fully immutable).`,
      exercises: `1. Refactor a class with public fields \`name\`, \`age\` into an encapsulated version with private fields and validated setters (reject empty name, negative age).
2. Build an immutable \`Money\` class (amount + currency, private final fields, no setters, factory method, \`plus()\` returning a new \`Money\`).
3. Show the "leaky getter" bug: a class with a private \`List\` whose getter returns the list directly; mutate it from outside, then fix it with \`Collections.unmodifiableList\` or a copy.
4. Add logging inside a setter to demonstrate the single-choke-point benefit.`,
      challenges: `Design a \`Thermostat\` class that keeps \`currentTemp\` within \`[minTemp, maxTemp]\` at all times. Expose only \`setTarget(double)\` and \`getTarget()\`; internally clamp and validate so the invariant can never be violated, even across many calls. Then argue why exposing \`setCurrentTemp\`, \`setMin\`, \`setMax\` as free setters would make the invariant impossible to guarantee — connecting encapsulation to the broader Module 12 design principles.`,
      summary: `- **Encapsulation** = bundle state + behaviour and hide internals behind a controlled interface (data hiding).
- Achieved with \`private\` fields + public accessors/operations; enforce rules in the **write** path.
- Benefits: protected invariants, loose coupling, changeable internals, security, single control point.
- Prefer **immutability** and avoid leaking mutable internals; follow JavaBeans naming for framework interop.
- Distinct from **abstraction** (§2.10): mechanism vs design. Visibility rules are detailed in **§2.16**.`
    }),

    /* 2.6 Inheritance — pillar enabling reuse via an "is-a" relationship. */
    topic({
      id: "inheritance", chapter: "2.6", title: "Inheritance",
      subtitle: "Pillar 2 — reuse and extend behaviour through an 'is-a' hierarchy.",
      readTime: "18 min", level: "Core", deep: true,
      objectives: [
        "Define inheritance and the \`extends\` keyword (the 'is-a' relationship).",
        "Use \`super\` for constructors, fields, and methods.",
        "Enumerate the types of inheritance Java supports — and why multiple class inheritance is not.",
        "Understand the role of \`Object\` as the root and when to prefer composition (§2.15)."
      ],
      concept: `**Inheritance** lets a new class (the **subclass / child / derived** class) acquire the fields and methods of an existing class (the **superclass / parent / base** class) using the \`extends\` keyword. It models an **"is-a"** relationship: a \`Car\` **is a** \`Vehicle\`.

\`\`\`java
class Vehicle {
    String brand;
    void start() { System.out.println(brand + " starting"); }
}
class Car extends Vehicle {     // Car is-a Vehicle
    int doors;
    void honk() { System.out.println("Beep"); }
}

Car c = new Car();
c.brand = "Tata";   // inherited field
c.start();          // inherited method
c.honk();           // own method
\`\`\`

The subclass **reuses** the parent's members and **adds** or **specialises** its own. Every class in Java implicitly extends **\`java.lang.Object\`**, the root of the hierarchy (source of \`toString\`, \`equals\`, \`hashCode\` — Module 3).`,
      why: `Inheritance exists to:

- **Reuse** common code in one place (DRY) — shared fields/methods sit in the parent.
- **Model hierarchies** that exist in the domain (\`Employee\` → \`Manager\`, \`Shape\` → \`Circle\`).
- **Enable polymorphism** (§2.9): a \`Vehicle\` reference can hold any subclass and call overridden behaviour.
- **Extend frameworks** — you subclass framework base classes (e.g., \`extends Thread\`, \`extends HttpServlet\`) to plug in your behaviour.

But inheritance is **tight coupling**: the child depends on the parent's internals. The industry guideline "**favour composition over inheritance**" (§2.15, Module 12) warns against deep hierarchies; use inheritance only for genuine *is-a*, not just code sharing.`,
      types: `Java supports these inheritance forms **between classes**:

| Type | Shape | Supported for classes? |
|---|---|---|
| **Single** | B extends A | ✅ |
| **Multilevel** | C extends B extends A | ✅ |
| **Hierarchical** | B and C both extend A | ✅ |
| **Multiple (state)** | D extends B, C | ❌ (not allowed) |
| **Hybrid** | mix involving multiple | ❌ (depends on multiple) |

**Multiple inheritance of classes is disallowed** to avoid the **Diamond Problem**: if \`B\` and \`C\` both override a method from \`A\` and \`D\` extended both, the compiler couldn't decide which to inherit. Java instead allows **multiple inheritance of *type*** via **interfaces** (§2.12) — and since Java 8, default methods reintroduce a controlled diamond that you must resolve explicitly.`,
      superKeyword: `\`super\` references the **parent portion** of the current object. Three uses:

\`\`\`java
class Animal {
    String name;
    Animal(String name) { this.name = name; }
    void speak() { System.out.println(name + " makes a sound"); }
}
class Dog extends Animal {
    Dog(String name) {
        super(name);              // 1) call parent constructor (must be FIRST line)
    }
    @Override void speak() {
        super.speak();            // 2) call the parent's version of an overridden method
        System.out.println(name + " barks");
    }
}
\`\`\`

3) \`super.field\` accesses a parent field hidden by a same-named child field. If you don't write \`super(...)\`, the compiler inserts a call to the parent's **no-arg** constructor — which fails to compile if the parent has none (a very common interview gotcha).`,
      internal: `**Constructor chaining up the hierarchy:** creating a \`Dog\` runs \`Object()\` → \`Animal(...)\` → \`Dog(...)\` (parent first), so the parent part is fully initialised before the child's constructor body runs (ties back to §2.2 init order).

**Memory:** a subclass object is a *single* heap object that contains the parent's fields plus the child's fields together; there aren't two separate objects.

**Method resolution:** instance methods are **virtual** — dispatched at runtime on the actual object type (the basis of overriding, §2.8, and polymorphism, §2.9). Fields and static methods are **not** polymorphic; they bind by the *reference type* at compile time (field "hiding").`,
      useCases: `- **Framework extension points**: \`extends Thread\`, \`extends Exception\` (Module 4), Android \`Activity\`, servlets.
- **Template Method pattern** (Module 13): a base class defines an algorithm skeleton; subclasses fill in steps.
- **Shared base entities**: an abstract \`BaseEntity\` with \`id\`, \`createdAt\` reused by many JPA entities.
- **Specialisation hierarchies**: \`Shape\` → \`Circle\`/\`Rectangle\` where each overrides \`area()\`.`,
      code: `\`\`\`java
class Employee {
    protected String name;
    protected double base;
    Employee(String name, double base) { this.name = name; this.base = base; }
    double salary() { return base; }
    void print() { System.out.println(name + ": " + salary()); }
}

class Manager extends Employee {
    private double bonus;
    Manager(String name, double base, double bonus) {
        super(name, base);            // initialise parent part
        this.bonus = bonus;
    }
    @Override double salary() {        // specialise behaviour
        return super.salary() + bonus; // reuse + extend
    }
}

Employee e = new Manager("Asha", 100000, 25000);
e.print();    // Asha: 125000  (overridden salary() runs — polymorphism, §2.9)
\`\`\``,
      mistakes: `- **No parent no-arg constructor**: if the parent lacks a no-arg constructor and the child doesn't call \`super(args)\` explicitly, it won't compile.
- **Putting \`super(...)\` after other statements** — it must be the first line.
- **Overusing inheritance for code reuse** instead of an *is-a* relationship → fragile base class problem; prefer composition (§2.15).
- **Confusing field hiding with method overriding** — fields are resolved by reference type, methods by object type (§2.8).
- **Extending a class to reuse one method** — leads to leaking unwanted parent API; delegate instead.`,
      bestPractices: `- Use inheritance only for true **is-a**; otherwise compose (§2.15).
- Keep hierarchies **shallow**; deep trees are hard to reason about.
- Mark classes/methods \`final\` when they must not be extended/overridden (also a security and correctness tool).
- Always \`@Override\` (§2.8) so the compiler verifies you actually override.
- Design base classes intentionally for extension (document the contract), or forbid it (\`final\`) — per *Effective Java*'s "design and document for inheritance or else prohibit it."`,
      interview: `**Q1. What is inheritance and which keyword enables it?**
A mechanism where a subclass acquires a superclass's members, modelling an *is-a* relationship, via \`extends\`.

**Q2. Why doesn't Java support multiple inheritance of classes?**
To avoid the diamond/ambiguity problem of inheriting conflicting state/behaviour from two parents. Multiple inheritance of *type* is allowed via interfaces (§2.12).

**Q3. What does \`super\` do?**
References the parent part: call its constructor (\`super(...)\`), invoke its overridden method (\`super.m()\`), or access a hidden field (\`super.f\`).

**Q4. What is the root class of all Java classes?**
\`java.lang.Object\`.

**Q5. Is a constructor inherited?**
No. Constructors are not inherited, though the child must invoke a parent constructor (implicitly or via \`super(...)\`).

**Q6. Inheritance vs composition — when to use which?**
Inheritance for genuine *is-a* and polymorphic substitution; composition (*has-a*) for code reuse and flexibility — generally preferred (§2.15).

**Q7. What's the difference between field hiding and method overriding?**
Fields bind by reference type at compile time (hiding); overridden instance methods bind by object type at runtime (§2.8).`,
      exercises: `1. Create \`Shape\` with \`area()\` returning 0, and subclasses \`Circle\` and \`Rectangle\` that override it. Store them in a \`Shape[]\` and print each area (preview of §2.9).
2. Demonstrate the no-arg-constructor gotcha: give a parent only a parameterised constructor, then write a child without \`super(...)\` and read the compile error; fix it.
3. Use \`super.method()\` so a child's \`toString()\` extends the parent's instead of replacing it.
4. Show field hiding: declare \`int x\` in both parent and child, access via a parent-typed reference, and explain the result.`,
      challenges: `Build a three-level hierarchy \`Account\` → \`SavingsAccount\` → \`PremiumSavingsAccount\`, each overriding \`interestRate()\` and calling \`super.interestRate()\` to layer on extra rate. Add constructors that chain with \`super(...)\` and print the construction order. Then refactor one "reuse-only" relationship into composition and argue which model better fits the domain.`,
      summary: `- **Inheritance** (\`extends\`) gives a subclass the parent's members — an **is-a** relationship; root is \`Object\`.
- Java supports single, multilevel, hierarchical inheritance of classes; **not multiple** (diamond problem) — use interfaces (§2.12) for multiple *type* inheritance.
- \`super\` calls the parent constructor/method/field; \`super(...)\` must be first and a parent constructor always runs first.
- Enables **polymorphism** (§2.9); but **favour composition** (§2.15) over inheritance for mere reuse.`
    }),

    /* 2.7 Method Overloading — compile-time (static) polymorphism. */
    topic({
      id: "method-overloading", chapter: "2.7", title: "Method Overloading",
      subtitle: "Same name, different parameters — compile-time polymorphism.",
      readTime: "14 min", level: "Core", deep: true,
      objectives: [
        "Define overloading and the rules that make two methods overloads.",
        "Explain how the compiler chooses an overload (static binding + widening/boxing/varargs).",
        "Distinguish overloading from overriding (§2.8).",
        "Avoid ambiguity and null-argument pitfalls."
      ],
      concept: `**Method overloading** means defining **multiple methods with the same name in the same class** (or inherited), distinguished by their **parameter list** — a different number, type, or order of parameters. It is a form of **compile-time (static) polymorphism**: the compiler decides which version to call based on the arguments at the call site.

\`\`\`java
class Printer {
    void print(int i)    { System.out.println("int: " + i); }
    void print(double d) { System.out.println("double: " + d); }
    void print(String s) { System.out.println("String: " + s); }
    void print(int a, int b) { System.out.println("two ints"); }
}
\`\`\`

All four are \`print\`, but the compiler picks the right one from the arguments you pass.`,
      why: `Overloading gives one logical operation a single, intuitive name across input types, instead of \`printInt\`, \`printDouble\`, \`printString\`. The JDK uses it everywhere: \`System.out.println(...)\` is overloaded for \`int\`, \`double\`, \`char\`, \`String\`, \`Object\`, etc.; \`Math.max\` and \`StringBuilder.append\` are heavily overloaded. It improves **readability** and **API ergonomics**.`,
      rules: `Two methods are valid overloads if their **parameter lists differ** by:

- **number** of parameters, **types** of parameters, or **order** of types.

What does **NOT** distinguish overloads (causes a compile error if that's the only difference):

- **return type** alone — \`int f()\` and \`double f()\` clash.
- **parameter names** — names are irrelevant to the signature.
- **access modifier** or **exceptions thrown** alone.

\`\`\`java
int  sum(int a, int b)       { return a + b; }
// double sum(int a, int b)  ❌ only return type differs — won't compile
double sum(double a, double b){ return a + b; }   // ✅ different types
int  sum(int a, int b, int c){ return a + b + c; } // ✅ different count
\`\`\``,
      internal: `**How the compiler resolves an overload (most-specific-first), in three phases:**

1. **Phase 1 — exact match / widening primitives**, no boxing, no varargs. (\`int\`→\`long\`→\`float\`→\`double\`.)
2. **Phase 2 — allow autoboxing/unboxing** (\`int\`↔\`Integer\`).
3. **Phase 3 — allow varargs**.

The compiler picks the **most specific** applicable method in the earliest phase. This explains classic puzzles:

\`\`\`java
void f(long x)    { System.out.println("long"); }
void f(Integer x) { System.out.println("Integer"); }
f(5);   // prints "long" — widening (phase 1) beats boxing (phase 2)
\`\`\`

Because it's resolved at **compile time** from the **static (declared) types** of the arguments, overloading is also called **static / early binding** — the opposite of overriding's runtime dispatch (§2.8).`,
      comparison: `| Aspect | Overloading (§2.7) | Overriding (§2.8) |
|---|---|---|
| Definition | Same name, different params | Same signature, subclass redefines |
| Binding | Compile time (static) | Runtime (dynamic) |
| Polymorphism | Compile-time | Runtime |
| Relationship | Same class (or inherited) | Across superclass/subclass |
| Return type | Must differ via params, not alone | Same or covariant |
| Parameters | Must differ | Must be identical |`,
      useCases: `- **Convenience APIs**: \`new Thread(Runnable)\` vs \`new Thread(Runnable, String)\`.
- **Type-flexible operations**: \`println\`, \`format\`, \`valueOf\`, \`Math.abs\`.
- **Optional parameters via overloads**: \`connect(host)\` → \`connect(host, port)\` → \`connect(host, port, timeout)\` (telescoping; a Builder, Module 13, is better past a few).
- **Constructor overloading** (§2.2) is the same idea for constructors.`,
      code: `\`\`\`java
public class Area {
    static double area(double r)            { return Math.PI * r * r; }   // circle
    static double area(double l, double w)  { return l * w; }             // rectangle
    static double area(double a, double b, double c) {                    // triangle (Heron)
        double s = (a + b + c) / 2;
        return Math.sqrt(s*(s-a)*(s-b)*(s-c));
    }
    public static void main(String[] args) {
        System.out.println(area(5));         // circle
        System.out.println(area(4, 6));      // rectangle
        System.out.println(area(3, 4, 5));   // triangle -> 6.0
    }
}
\`\`\``,
      mistakes: `- **Differing only by return type** — not an overload; compile error.
- **Ambiguous null**: \`f(null)\` when both \`f(String)\` and \`f(StringBuilder)\` exist is ambiguous — cast the argument (\`f((String)null)\`).
- **Surprise from widening vs boxing**: \`f(5)\` may not call the \`Integer\` overload you expected (see internal section).
- **Autoboxing + varargs ambiguity** between similar overloads — keep overload sets simple.
- **Confusing overloading with overriding** — different params vs identical signature (§2.8).`,
      bestPractices: `- Keep overloaded versions **behaviourally consistent** — same name should mean the same thing.
- Avoid overloads that differ only by **boxed vs primitive** or that force callers to cast \`null\`.
- Limit the number of parameters; beyond ~3–4 prefer a **Builder** or a parameter object.
- Don't overload methods with the **same arity** and easily-confused types (e.g., \`(int)\` vs \`(Integer)\`).`,
      interview: `**Q1. What is method overloading?**
Multiple methods with the same name but different parameter lists, resolved at compile time (static polymorphism).

**Q2. Can you overload by changing only the return type?**
No — the parameter list must differ; return type alone is insufficient.

**Q3. Is overloading compile-time or runtime?**
Compile-time (static/early binding), based on the declared argument types.

**Q4. Can you overload \`main\`?**
Yes, but the JVM only calls \`public static void main(String[] args)\`; other \`main\` overloads are ordinary methods you must call yourself.

**Q5. How does the compiler resolve overloads?**
Most-specific match: exact/widening first, then autoboxing, then varargs.

**Q6. Can static methods be overloaded?**
Yes — overloading is independent of static vs instance.`,
      exercises: `1. Write overloaded \`max\` methods for \`(int,int)\`, \`(double,double)\`, and \`(int,int,int)\`.
2. Create \`void show(long)\` and \`void show(Integer)\`, call \`show(10)\`, predict and verify which runs, then explain via the phases.
3. Trigger an ambiguous-\`null\` compile error with two reference-type overloads and fix it with a cast.
4. Add a varargs overload \`sum(int... nums)\` alongside \`sum(int,int)\` and observe which is preferred for \`sum(2,3)\`.`,
      challenges: `Recreate a mini \`println\` family: overloads for \`int\`, \`double\`, \`char\`, \`boolean\`, \`Object\`, and \`char[]\`. Then write call sites that force each phase of overload resolution (widening, boxing, varargs) and document, for each call, exactly which overload the compiler binds and why.`,
      summary: `- **Overloading** = same method name, **different parameter lists**, in the same class — **compile-time** polymorphism.
- Return type/parameter names/modifiers alone don't distinguish overloads.
- Resolution: exact/widening → autoboxing → varargs; **most specific** wins (watch null & boxing puzzles).
- Contrast with **overriding** (§2.8): static vs dynamic binding.`
    }),

    /* 2.8 Method Overriding — runtime (dynamic) polymorphism. */
    topic({
      id: "method-overriding", chapter: "2.8", title: "Method Overriding",
      subtitle: "A subclass redefines an inherited method — runtime polymorphism.",
      readTime: "16 min", level: "Core", deep: true,
      objectives: [
        "Define overriding and state the rules a valid override must satisfy.",
        "Explain dynamic method dispatch (virtual methods) and the \`@Override\` annotation.",
        "Apply covariant return types and the access/exception rules.",
        "Know what cannot be overridden (static, final, private) and why."
      ],
      concept: `**Method overriding** is when a **subclass provides its own implementation of an instance method already defined in its superclass**, using the **identical signature** (same name, same parameters). At runtime, the version that executes is chosen by the **actual object's type**, not the reference type — this is **runtime (dynamic) polymorphism**.

\`\`\`java
class Animal { void sound() { System.out.println("Some sound"); } }
class Cat extends Animal {
    @Override void sound() { System.out.println("Meow"); }
}

Animal a = new Cat();   // reference type Animal, object type Cat
a.sound();              // "Meow"  — the OBJECT's method runs
\`\`\`

This is the engine behind polymorphism (§2.9): the same call \`a.sound()\` does different things depending on the real object.`,
      why: `Overriding lets a subclass **specialise or replace** inherited behaviour while keeping a common interface, so callers program to the **superclass/interface type** and the right concrete behaviour runs automatically. It's how frameworks invoke *your* code (\`run()\`, \`toString()\`, \`compareTo()\`, servlet \`doGet()\`), and how the Template Method and Strategy patterns work (Module 13).`,
      rules: `For a method in a subclass to legally **override** (not just coexist):

1. **Same name and same parameter list** (an identical signature). Different parameters ⇒ it's *overloading* (§2.7), not overriding.
2. **Return type** must be the **same** or a **covariant** subtype (e.g., parent returns \`Number\`, child may return \`Integer\`).
3. **Access modifier** can be the same or **more permissive**, never more restrictive (\`protected\` → \`public\` ok; \`public\` → \`protected\` ❌).
4. **Checked exceptions**: the override may throw **fewer or narrower** checked exceptions, never new/broader ones (unchecked exceptions are unrestricted — Module 4).
5. The method must be **inherited and overridable** — \`private\`, \`static\`, and \`final\` methods cannot be overridden (see below).

\`\`\`java
class A { Number make() throws IOException { return 1; } }
class B extends A {
    @Override Integer make() { return 2; }   // covariant return, drops the exception — legal
}
\`\`\``,
      internal: `**Dynamic method dispatch (virtual invocation).** Java instance methods are *virtual by default*. The compiler emits an \`invokevirtual\` (or \`invokeinterface\`) bytecode; at runtime the JVM looks up the method in the object's actual class via its **vtable**, so the most-derived override wins regardless of the reference type.

Contrast with members that are **statically bound** (resolved by reference type at compile time):

- **static methods** → *method hiding*, not overriding (§2.4).
- **fields** → *field hiding*.
- **private** methods → not inherited, so not overridable.

\`\`\`java
class P { static void s(){System.out.println("P.s");} int x=1; }
class C extends P { static void s(){System.out.println("C.s");} int x=2; }
P p = new C();
p.s();              // "P.s"  — static: bound by reference type (hiding)
System.out.println(p.x); // 1 — field: bound by reference type (hiding)
\`\`\`

This static-vs-dynamic distinction is one of the most common interview traps.`,
      annotation: `Always use **\`@Override\`**. It's optional but valuable: the compiler verifies the method *actually* overrides something. If you mistype the name or get a parameter wrong, you'd silently create a *new* method (an accidental overload) — \`@Override\` turns that into a compile error.

\`\`\`java
class Base { boolean equals(Object o, int extra) { return false; } } // typo-prone
class Sub extends Base {
    @Override public boolean equals(Object o) { /*...*/ return true; } // verified correct
}
\`\`\``,
      comparison: `| Cannot be overridden | Reason |
|---|---|
| \`static\` methods | Belong to the class; *hidden*, resolved by reference type (§2.4) |
| \`final\` methods | Explicitly sealed against redefinition |
| \`private\` methods | Not inherited/visible to the subclass |
| Constructors | Not inherited (you chain with \`super\`, §2.2) |

Overriding **across** classes requires inheritance; the parent method must be visible to the child.`,
      useCases: `- **Overriding \`Object\` methods**: \`toString()\`, \`equals()\`, \`hashCode()\` (Module 3) for meaningful output and correct collection behaviour.
- **Template Method / Strategy** patterns (Module 13): subclasses override hook methods.
- **Framework callbacks**: \`Thread.run()\`, \`Comparable.compareTo()\`, \`HttpServlet.doGet()\`.
- **Specialising algorithms**: each \`Shape\` overrides \`area()\`; each payment type overrides \`process()\`.`,
      code: `\`\`\`java
abstract class Payment {                 // (abstract: §2.11)
    abstract void pay(double amt);
    void receipt(double amt) { pay(amt); System.out.println("Receipt for " + amt); }
}
class CardPayment extends Payment {
    @Override void pay(double amt) { System.out.println("Card charged " + amt); }
}
class UpiPayment extends Payment {
    @Override void pay(double amt) { System.out.println("UPI debited " + amt); }
}

Payment p = new UpiPayment();   // choose implementation at runtime
p.receipt(999);                 // UPI debited 999 / Receipt for 999

// reuse-and-extend with super:
class LoggedCard extends CardPayment {
    @Override void pay(double amt) {
        System.out.println("LOG: paying " + amt);
        super.pay(amt);          // call the overridden parent version
    }
}
\`\`\``,
      mistakes: `- **Accidentally overloading** instead of overriding (wrong parameter type) — prevented by \`@Override\`.
- **Reducing visibility** (\`public\` → \`protected\`) — compile error.
- **Throwing broader checked exceptions** than the parent — compile error.
- **Expecting \`static\`/field access to be polymorphic** — they're bound by reference type (hiding).
- **Overriding \`equals\` without \`hashCode\`** — breaks hash-based collections (Module 3).
- **Calling an overridable method from a constructor** — the subclass override runs on a not-yet-initialised object (§2.2).`,
      bestPractices: `- Always annotate overrides with \`@Override\`.
- Keep the **contract** of the parent method (Liskov Substitution Principle, Module 12) — don't surprise callers.
- Use \`super.method()\` to **extend** rather than fully replace, when appropriate.
- Override \`equals\`, \`hashCode\`, and \`toString\` together where identity/printing matters (Module 3).
- Mark methods \`final\` when overriding them would break invariants.`,
      interview: `**Q1. What is method overriding?**
A subclass redefining an inherited instance method with the same signature; the object's type determines which runs at runtime.

**Q2. Overloading vs overriding?**
Overloading = same name, different params, compile-time, one class. Overriding = same signature, runtime dispatch, across super/subclass.

**Q3. What is dynamic method dispatch?**
Runtime selection of the overridden method based on the actual object type (\`invokevirtual\` + vtable lookup).

**Q4. Can you override static/final/private methods?**
No to all: static is hidden (reference-type bound), final is sealed, private isn't inherited.

**Q5. What are covariant return types?**
An override may return a subtype of the parent method's return type.

**Q6. Rules for exceptions and access in overriding?**
Override may throw fewer/narrower checked exceptions and have equal-or-wider access — never broader exceptions or narrower access.

**Q7. Why use \`@Override\`?**
The compiler verifies the method really overrides one, catching signature typos that would otherwise create a silent overload.`,
      exercises: `1. Override \`toString()\` in a \`Point\` class and verify \`System.out.println(point)\` uses it.
2. Create \`Animal\` with \`sound()\`, subclasses \`Dog\`/\`Cat\` overriding it; loop over an \`Animal[]\` and call \`sound()\` to see dynamic dispatch.
3. Demonstrate method hiding: declare \`static\` \`info()\` in parent and child, call via a parent-typed reference holding a child object, and explain the output.
4. Try to override a method while narrowing its access modifier and read the compile error.`,
      challenges: `Implement a \`Comparable\`-based sort: a \`Book\` class overriding \`compareTo\` by title, then by year. Add a subclass \`RareBook\` that overrides \`toString\` via \`super.toString()\`. Finally, write a parent/child pair where the parent constructor calls an overridable method and demonstrate the "override sees uninitialised fields" bug — then explain how to avoid it.`,
      summary: `- **Overriding** = subclass redefines an inherited instance method with the **same signature**; chosen at **runtime** by object type (dynamic dispatch).
- Rules: same/covariant return, equal-or-wider access, equal-or-narrower checked exceptions; can't override static/final/private.
- \`@Override\` makes the compiler verify the override; use \`super.m()\` to extend.
- It's the mechanism behind **polymorphism (§2.9)**; contrast with **overloading (§2.7)**.`
    }),

    /* 2.9 Polymorphism — many forms through one interface. */
    topic({
      id: "polymorphism", chapter: "2.9", title: "Polymorphism",
      subtitle: "Pillar 3 — one interface, many implementations chosen at runtime.",
      readTime: "16 min", level: "Core", deep: true,
      objectives: [
        "Define polymorphism and distinguish compile-time from runtime polymorphism.",
        "Use upcasting, downcasting, \`instanceof\`, and pattern matching safely.",
        "Explain how polymorphism enables loosely-coupled, extensible designs.",
        "Connect polymorphism to interfaces, overriding, and the Open/Closed Principle."
      ],
      concept: `**Polymorphism** ("many forms") is the third pillar of OOP: the ability to treat objects of different classes **through a common type**, where the **actual behaviour is chosen by the real object** at runtime. A single reference type or method call works across many implementations.

Two kinds:

- **Compile-time (static) polymorphism** — **method overloading** (§2.7): the version is chosen by the compiler from argument types.
- **Runtime (dynamic) polymorphism** — **method overriding** (§2.8): the version is chosen by the JVM from the object's type.

\`\`\`java
List<Shape> shapes = List.of(new Circle(2), new Rectangle(3, 4));
for (Shape s : shapes) {
    System.out.println(s.area());   // each call dispatches to the real subclass
}
\`\`\`

The loop knows only \`Shape\`, yet each \`area()\` runs the correct concrete implementation.`,
      why: `Polymorphism is what makes OOP **extensible and loosely coupled**:

- **Program to an abstraction.** Code depends on \`Shape\`/\`PaymentMethod\`/\`Repository\`, not concrete classes — the **Dependency Inversion** and **Open/Closed** principles (Module 12).
- **Add without modifying.** A new \`Triangle\` plugs into the existing loop with zero changes to the caller.
- **Replaceability.** Swap a \`MySQLRepository\` for a \`MongoRepository\` behind the same interface.
- **Testability.** Inject a fake/mock implementation of an interface in tests.

This is the backbone of every framework (Spring beans, JDBC drivers, collections) and of clean architecture.`,
      castingAndInstanceof: `A **superclass/interface reference** can hold a **subclass object** — **upcasting**, always safe and implicit:

\`\`\`java
Shape s = new Circle(2);     // upcast — implicit
\`\`\`

Going the other way (**downcasting**) needs an explicit cast and is checked at runtime; an invalid cast throws \`ClassCastException\`. Guard it with \`instanceof\`:

\`\`\`java
if (s instanceof Circle) {
    Circle c = (Circle) s;        // safe downcast
    System.out.println(c.radius());
}
// Java 16+ pattern matching — test and bind in one step:
if (s instanceof Circle c) {
    System.out.println(c.radius());
}
\`\`\`

Heavy use of \`instanceof\`/downcasting is often a **design smell** — prefer adding a polymorphic method to the type instead of switching on type.`,
      internal: `Runtime polymorphism relies on **dynamic dispatch** (§2.8): the compiler resolves the call against the *reference type's* declared method, but the JVM uses the object's **vtable** to invoke the most-derived override. Consequences:

- Only **overridable instance methods** participate. **Fields** and **static methods** are bound by reference type (hiding), so they are **not** polymorphic.
- You can call only methods **declared on the reference type**; subclass-specific methods require a downcast.
- The chosen method is the object's, but accessible members are limited by the reference type — a frequent interview nuance.`,
      comparison: `| | Compile-time polymorphism | Runtime polymorphism |
|---|---|---|
| Mechanism | Overloading (§2.7) | Overriding (§2.8) |
| Bound at | Compile time (reference/arg types) | Runtime (object type) |
| Also called | Static / early binding | Dynamic / late binding |
| Flexibility | Fixed at compile time | Extensible via new subclasses |`,
      useCases: `- **Collections of a base type**: \`List<Shape>\`, \`List<Employee>\` processed uniformly.
- **Strategy pattern**: a \`SortStrategy\`/\`DiscountPolicy\` interface with interchangeable implementations (Module 13).
- **Dependency injection**: a service depends on a \`Repository\` interface; Spring injects a concrete bean.
- **Plugins/drivers**: JDBC \`Connection\`, logging backends, payment gateways — same interface, many providers.`,
      code: `\`\`\`java
interface Notification { void send(String msg); }            // abstraction (§2.12)

class EmailNotification implements Notification {
    public void send(String m) { System.out.println("Email: " + m); }
}
class SmsNotification implements Notification {
    public void send(String m) { System.out.println("SMS: " + m); }
}

class Alerter {
    private final Notification channel;                       // depends on abstraction
    Alerter(Notification channel) { this.channel = channel; } // injected (polymorphism)
    void alert(String msg) { channel.send(msg); }
}

// same Alerter code works with ANY Notification implementation
new Alerter(new EmailNotification()).alert("Deploy done");
new Alerter(new SmsNotification()).alert("Deploy done");
\`\`\`

Adding a \`PushNotification\` later requires **no change** to \`Alerter\` — Open/Closed in action.`,
      mistakes: `- **Unchecked downcast** → \`ClassCastException\`; always test with \`instanceof\` first.
- **Expecting fields/static methods to be polymorphic** — they're reference-type bound (hiding).
- **Type-switch sprawl** (\`if instanceof A ... else if B ...\`) — replace with a polymorphic method on the type.
- **Calling subclass-only methods through a base reference** without a downcast — compile error.
- **Confusing the two kinds** in interviews — overloading is compile-time, overriding is runtime.`,
      bestPractices: `- **Program to interfaces/abstractions**, not concrete classes.
- Add behaviour as **polymorphic methods** rather than \`instanceof\` chains.
- Keep base-type contracts honest so substitution is safe (**Liskov**, Module 12).
- Use **pattern matching** (\`instanceof Type t\`) when a type check is truly necessary.
- Favour **composition + interfaces** for flexible, testable designs (§2.15).`,
      interview: `**Q1. What is polymorphism?**
The ability to treat different object types through a common type, with behaviour resolved by the actual object — "one interface, many forms."

**Q2. Compile-time vs runtime polymorphism?**
Compile-time = overloading (resolved by the compiler); runtime = overriding (resolved by the JVM via dynamic dispatch).

**Q3. What is upcasting/downcasting?**
Upcasting: assign a subclass object to a superclass reference (implicit, safe). Downcasting: cast back to the subclass (explicit, runtime-checked; guard with \`instanceof\`).

**Q4. Are fields and static methods polymorphic?**
No — they're bound by the reference type at compile time (hiding).

**Q5. How does polymorphism support the Open/Closed Principle?**
New behaviour is added via new subclasses/implementations without modifying existing client code.

**Q6. What does \`instanceof\` do, and what's the Java 16 enhancement?**
Tests an object's type at runtime; pattern matching (\`x instanceof Type t\`) tests and binds a typed variable in one expression.`,
      exercises: `1. Define \`Shape\` with \`area()\`; create \`Circle\`, \`Rectangle\`, \`Triangle\`; put them in a \`List<Shape>\` and print total area via a single loop.
2. Add a \`PaymentMethod\` interface with \`pay()\`; write a \`Checkout\` class that takes any \`PaymentMethod\` and demonstrate three implementations.
3. Show a safe downcast with both classic \`instanceof\` + cast and Java 16 pattern matching.
4. Trigger a \`ClassCastException\` with an invalid downcast, then prevent it with \`instanceof\`.`,
      challenges: `Build a small shape-rendering engine: a \`Shape\` interface (\`area()\`, \`perimeter()\`, \`name()\`) with four implementations, and a \`Report\` class that prints a sorted summary using only the \`Shape\` type. Then add a fifth shape **without modifying** \`Report\`, proving Open/Closed. Finally, replace a hypothetical \`if (s instanceof Circle) ...\` discount routine with a polymorphic \`discount()\` method and explain why that's the better design.`,
      summary: `- **Polymorphism** = one common type, many concrete behaviours chosen at runtime ("many forms").
- **Compile-time** = overloading (§2.7); **runtime** = overriding (§2.8) via dynamic dispatch.
- **Upcasting** is implicit/safe; **downcasting** needs \`instanceof\` (or pattern matching) to avoid \`ClassCastException\`.
- Fields/static methods are **not** polymorphic. Polymorphism powers DI, Strategy, and the **Open/Closed Principle** (Module 12).`
    }),

    /* 2.10 Abstraction — pillar 4: expose what, hide how. */
    topic({
      id: "abstraction", chapter: "2.10", title: "Abstraction",
      subtitle: "Pillar 4 — expose essential behaviour, hide implementation detail.",
      readTime: "14 min", level: "Core", deep: true,
      objectives: [
        "Define abstraction and contrast it precisely with encapsulation.",
        "Identify Java's two abstraction tools — abstract classes (§2.11) and interfaces (§2.12).",
        "Explain abstraction in terms of contracts and dependency inversion.",
        "Recognise everyday abstractions in the JDK."
      ],
      concept: `**Abstraction** is the fourth pillar of OOP: **exposing only the essential features of something while hiding the underlying complexity**. You describe *what* an object does, not *how* it does it.

You use abstraction constantly: \`list.add(x)\` adds an element — you neither know nor care whether it's an \`ArrayList\` resizing an array or a \`LinkedList\` relinking nodes. Driving a car, you use a steering wheel and pedals (the abstraction) without understanding the combustion or electric drivetrain (the implementation).

In Java, abstraction is achieved with:

- **Abstract classes** (§2.11) — partial abstraction; can mix abstract and concrete members.
- **Interfaces** (§2.12) — the strongest contract; pure "what" with no (traditional) "how".`,
      why: `Abstraction is a *design* tool that pays off as systems grow:

- **Manages complexity** — callers reason about a small contract instead of a large implementation.
- **Decouples** — code depends on a stable abstraction, so implementations can change freely (**Dependency Inversion**, Module 12).
- **Enables polymorphism** (§2.9) — many implementations behind one type.
- **Defines team boundaries** — one team codes to an interface while another implements it in parallel.
- **Improves testability** — depend on an interface, substitute a fake in tests.`,
      vsEncapsulation: `The most-asked OOP interview pair. They're complementary, not the same:

| | **Abstraction** | **Encapsulation** |
|---|---|---|
| Question it answers | *What* should be exposed? | *How* is access controlled? |
| Level | Design / conceptual | Implementation / mechanism |
| Hides | Complexity & implementation | Internal data/state |
| Achieved with | Abstract classes, interfaces | Access modifiers (\`private\`, …) + accessors |
| Goal | Simplify the contract | Protect invariants |

> One-liner: **Abstraction is about the design decision of *what to show*; encapsulation is the implementation mechanism that *enforces hiding*.** A class can use both — an interface (abstraction) implemented by a class with private fields (encapsulation).`,
      internal: `Abstraction has **no special runtime machinery** of its own — it's realised through the type system. An \`abstract\` class cannot be instantiated (\`new Shape()\` is a compile error); an interface is a pure type. At runtime you always work with a concrete object behind the abstract reference, and calls dispatch via the usual virtual mechanism (§2.8). So abstraction is enforced at **compile time** by the type system and *delivered* at runtime by polymorphism.`,
      useCases: `- **JDBC** — \`Connection\`, \`Statement\`, \`ResultSet\` are interfaces; each database vendor supplies the implementation (Module 10).
- **Collections** — \`List\`, \`Map\`, \`Set\` interfaces with many implementations (Module 5).
- **Service contracts** — \`PaymentGateway\`, \`UserRepository\` interfaces a business layer depends on.
- **I/O streams** — \`InputStream\`/\`OutputStream\` abstract classes hide file vs network vs memory sources (Module 9).`,
      code: `\`\`\`java
// Abstraction via an interface: the "what" — a contract, no "how"
interface PaymentGateway {
    boolean charge(String account, double amount);
}

// Two hidden implementations — callers never see these details
class StripeGateway implements PaymentGateway {
    public boolean charge(String acc, double amt) { /* HTTP, retries... */ return true; }
}
class RazorpayGateway implements PaymentGateway {
    public boolean charge(String acc, double amt) { /* different API... */ return true; }
}

// Business code depends ONLY on the abstraction
class Checkout {
    private final PaymentGateway gateway;
    Checkout(PaymentGateway gateway) { this.gateway = gateway; }
    void buy(String acc, double amt) {
        if (gateway.charge(acc, amt)) System.out.println("Order placed");
    }
}
\`\`\`

\`Checkout\` is immune to changes inside any gateway and works with future ones.`,
      mistakes: `- **Confusing abstraction with encapsulation** (see the table) — the single most common slip.
- **Leaky abstractions** — a contract that exposes implementation detail (e.g., a method named \`getFromMySQL\`) defeats the purpose.
- **Over-abstracting** — an interface with one implementation and no foreseeable second one adds indirection without benefit (YAGNI).
- **Trying to instantiate an abstract type** — \`new Shape()\`/\`new List()\` won't compile.
- **Putting implementation logic into the abstraction** that ties it to one technology.`,
      bestPractices: `- Abstract at the level of **behaviour/intent** (\`Repository.findById\`), not technology.
- Keep contracts **small and cohesive** (Interface Segregation, Module 12).
- Introduce an abstraction when there's a **real** need for substitution/extension — don't speculate.
- Let high-level modules depend on abstractions, with implementations injected (**Dependency Inversion**, Module 12).
- Choose **interface vs abstract class** deliberately (decision rules in §2.11/§2.12).`,
      interview: `**Q1. What is abstraction?**
Exposing essential behaviour while hiding implementation complexity — describing *what* an object does, not *how*.

**Q2. How is abstraction achieved in Java?**
Through abstract classes (partial) and interfaces (full contract).

**Q3. Abstraction vs encapsulation?**
Abstraction is a design concept (decide what to expose, hide complexity); encapsulation is the mechanism (access modifiers) that hides and protects data. One is "what to show," the other "how to hide."

**Q4. Can you instantiate an abstract class or interface?**
No — only concrete implementations/subclasses (or anonymous classes/lambdas for interfaces).

**Q5. Give a real-world JDK example of abstraction.**
JDBC: you code to \`Connection\`/\`ResultSet\` interfaces while the driver provides hidden implementations.

**Q6. Why does abstraction help testing?**
Depending on an abstraction lets you substitute mocks/fakes for real implementations.`,
      exercises: `1. Define a \`Shape\` abstraction (interface) with \`area()\` and \`name()\`; implement \`Circle\` and \`Square\`; write a printer that depends only on \`Shape\`.
2. Write a \`Logger\` interface (\`log(String)\`) with \`ConsoleLogger\` and \`FileLogger\` implementations; inject one into a \`Service\`.
3. In two sentences each, explain abstraction and encapsulation for the same \`BankAccount\` example, showing how both apply.
4. Identify three abstractions you used today from the JDK and name a hidden implementation detail of each.`,
      challenges: `Design a \`NotificationService\` that depends on a \`MessageChannel\` abstraction and can fan out to email, SMS, and push without knowing their internals. Then deliberately introduce a *leaky* abstraction (a method that exposes an SMTP detail) and refactor it away, explaining how the leak coupled the high-level code to a specific technology.`,
      summary: `- **Abstraction** = expose essential *what*, hide complex *how*; the fourth OOP pillar.
- Achieved via **abstract classes** (§2.11, partial) and **interfaces** (§2.12, full contract).
- **vs Encapsulation:** abstraction is design ("what to show"); encapsulation is mechanism ("how to hide data").
- Enables decoupling, polymorphism (§2.9), parallel work, and testability; avoid leaky/over-abstraction.`
    }),

    /* 2.11 Abstract Classes — partial abstraction with shared state. */
    topic({
      id: "abstract-classes", chapter: "2.11", title: "Abstract Classes",
      subtitle: "Partial abstraction: shared code plus methods subclasses must implement.",
      readTime: "16 min", level: "Core", deep: true,
      objectives: [
        "Declare abstract classes and abstract methods and know their constraints.",
        "Explain when a subclass must implement abstract methods.",
        "Combine concrete state/behaviour with abstract contracts (Template Method).",
        "Decide between an abstract class and an interface (§2.12)."
      ],
      concept: `An **abstract class** is a class declared with the \`abstract\` keyword that **cannot be instantiated** on its own. It is meant to be **extended**. It may contain:

- **abstract methods** — declared without a body (just a signature + \`;\`), which subclasses **must** implement; and
- **concrete members** — normal fields, constructors, and fully-implemented methods that subclasses inherit.

\`\`\`java
abstract class Shape {
    private final String name;            // state — abstract classes can have fields
    protected Shape(String name) { this.name = name; }  // constructor (called via super)

    abstract double area();               // abstract — no body; subclasses must define

    String describe() {                   // concrete — shared implementation
        return name + " with area " + area();
    }
}
// new Shape("x");  ❌ cannot instantiate an abstract class
\`\`\`

It represents an **incomplete is-a base** — "every \`Shape\` *has* a name and *can be* described, but each computes \`area()\` its own way."`,
      why: `Abstract classes shine when subclasses share **state and code** but must each supply some specifics:

- **Code reuse with a mandated contract** — common logic in the base, required hooks left abstract.
- **Template Method pattern** (Module 13) — the base defines an algorithm's skeleton in a \`final\` method and calls abstract steps subclasses fill in.
- **Partial abstraction** — expose a stable API while leaving variable parts open.
- A **common type** for polymorphism (§2.9) that also carries default behaviour.`,
      rules: `Key rules and constraints:

- A class with **at least one abstract method must be declared \`abstract\`**. (An abstract class may also have *zero* abstract methods — still can't be instantiated.)
- Abstract classes **can** have constructors (run via \`super(...)\` from subclasses), instance/static fields, and concrete methods.
- The **first concrete subclass must implement all inherited abstract methods**, or itself be declared \`abstract\`.
- \`abstract\` **cannot combine** with \`final\` (nothing could extend it), with \`private\` (subclasses couldn't see it), or with \`static\` (for methods).
- Abstract classes can implement interfaces and may leave some interface methods abstract for subclasses.`,
      internal: `An abstract class is a normal class in the JVM except the compiler forbids \`new\` on it. Its **constructor still runs** during subclass construction (\`super(...)\`, §2.2/§2.6) to initialise the shared fields — a key difference from interfaces, which (pre-Java 8) had no state or constructors. Abstract method calls dispatch dynamically (§2.8) to the subclass implementation, exactly like overridden methods.`,
      templateMethod: `The canonical use — **Template Method**: fix the algorithm, vary the steps.

\`\`\`java
abstract class DataExporter {
    // the skeleton is fixed and not overridable
    public final void export() {
        var data = fetch();         // step varies
        var formatted = format(data);
        write(formatted);           // step varies
    }
    protected abstract String fetch();
    protected abstract void write(String content);
    protected String format(String raw) { return raw.trim(); } // overridable default
}
class CsvExporter extends DataExporter {
    protected String fetch() { return "a,b,c"; }
    protected void write(String c) { System.out.println("CSV: " + c); }
}
\`\`\`

Subclasses can't change the *order* of steps (it's \`final\`), only the steps themselves.`,
      comparison: `**Abstract class vs Interface** — the decision (full interface detail in §2.12):

| | Abstract class | Interface |
|---|---|---|
| Instantiable | No | No |
| Multiple inheritance | One per subclass | Many per class |
| State (instance fields) | Yes | No (only \`static final\` constants) |
| Constructors | Yes | No |
| Member access | any (\`private\`/\`protected\`/\`public\`) | \`public\` (and \`private\` for helper default methods, Java 9+) |
| Relationship | strong "is-a", shared base | capability/contract "can-do" |

**Rule of thumb:** use an **abstract class** when implementations are closely related and share state/code; use an **interface** when you're defining a capability that unrelated types can adopt, or you need multiple inheritance of type.`,
      useCases: `- **Framework base classes**: \`AbstractList\`, \`AbstractMap\` (Module 5) implement the tedious parts so you override only a couple of methods.
- **Template Method** workflows (export, parse, request-handling pipelines).
- **Shared entity base**: \`abstract class BaseEntity { Long id; Instant createdAt; }\`.
- **HttpServlet** — an abstract base where you override \`doGet\`/\`doPost\`.`,
      code: `\`\`\`java
abstract class Employee {
    protected String name;
    protected Employee(String name) { this.name = name; }

    abstract double monthlyPay();              // each type computes differently
    void payslip() {                           // shared concrete behaviour
        System.out.printf("%s -> %.2f%n", name, monthlyPay());
    }
}
class SalariedEmployee extends Employee {
    private final double annual;
    SalariedEmployee(String n, double annual) { super(n); this.annual = annual; }
    double monthlyPay() { return annual / 12; }
}
class HourlyEmployee extends Employee {
    private final double rate; private final int hours;
    HourlyEmployee(String n, double rate, int hours){ super(n); this.rate=rate; this.hours=hours; }
    double monthlyPay() { return rate * hours; }
}

Employee[] team = { new SalariedEmployee("Asha", 1_200_000), new HourlyEmployee("Ravi", 500, 160) };
for (Employee e : team) e.payslip();   // polymorphic
\`\`\``,
      mistakes: `- **Trying to instantiate** an abstract class (\`new Employee(...)\`).
- **Forgetting to implement** an abstract method in a concrete subclass (must implement or declare the subclass abstract).
- **Marking an abstract method \`private\`/\`static\`/\`final\`** — contradictory and illegal.
- **Choosing an abstract class when you need multiple inheritance** — a class can extend only one; use interfaces (§2.12).
- **Putting too much in the base** — over-stuffed base classes create the *fragile base class* problem.`,
      bestPractices: `- Use abstract classes for **closely related** types that share state and code; otherwise prefer interfaces.
- Make the **algorithm skeleton \`final\`** in Template Method; leave only the variable steps abstract/overridable.
- Give abstract classes \`protected\` constructors (they're only meaningful via subclasses).
- Keep the base **focused**; don't force unrelated subclasses to inherit irrelevant members.
- Document which methods are **hooks** subclasses should override.`,
      interview: `**Q1. What is an abstract class?**
A class that can't be instantiated, may contain abstract (bodiless) and concrete members, and is meant to be subclassed.

**Q2. Can an abstract class have a constructor? Fields? Concrete methods?**
Yes to all — constructors run via \`super\` during subclass construction; it can hold state and shared behaviour.

**Q3. Can an abstract class have zero abstract methods?**
Yes — it still can't be instantiated, sometimes used to prevent direct construction.

**Q4. Abstract class vs interface — when to use which?**
Abstract class for related types sharing state/code (single inheritance); interface for capabilities/contracts and multiple inheritance of type.

**Q5. Can \`abstract\` be combined with \`final\` or \`static\` or \`private\`?**
No — each combination is contradictory/illegal for the abstract member.

**Q6. What must a concrete subclass do?**
Implement every inherited abstract method (or be declared abstract itself).`,
      exercises: `1. Create \`abstract class Account\` with concrete \`deposit\`/\`getBalance\` and abstract \`interestRate()\`; implement \`Savings\` and \`Current\`.
2. Implement a Template Method \`Game\` with \`final play()\` calling abstract \`initialize()\`, \`startPlay()\`, \`endPlay()\`; create two games.
3. Show the compile error from instantiating the abstract class, then fix it by instantiating a subclass.
4. Add a concrete method to the abstract base that uses an abstract method, and observe polymorphic dispatch.`,
      challenges: `Design an \`abstract class ReportGenerator\` using Template Method: a \`final generate()\` that calls \`collect()\`, \`transform()\`, and \`render()\`. Provide \`PdfReport\` and \`HtmlReport\` subclasses. Then re-express the same design with an **interface + composition** and write a short comparison of which is more appropriate and why (links to §2.12 and Module 13).`,
      summary: `- An **abstract class** can't be instantiated; mixes **abstract methods** (subclasses must implement) with **concrete state/behaviour**.
- It can have constructors, fields, and concrete methods — ideal for **related types sharing code** and the **Template Method** pattern.
- A concrete subclass must implement all abstract methods; \`abstract\` can't mix with \`final\`/\`static\`/\`private\`.
- Choose abstract class vs **interface (§2.12)** by *shared state/single-inheritance* vs *capability/multiple-inheritance*.`
    }),

    /* 2.12 Interfaces — pure contracts and multiple inheritance of type. */
    topic({
      id: "interfaces", chapter: "2.12", title: "Interfaces",
      subtitle: "Capability contracts, multiple inheritance of type, and Java 8+ defaults.",
      readTime: "20 min", level: "Core", deep: true,
      objectives: [
        "Declare and implement interfaces and understand their implicit modifiers.",
        "Use interfaces for multiple inheritance of type and the diamond resolution rule.",
        "Apply Java 8+ default, static, and private interface methods, plus constants.",
        "Decide interface vs abstract class, and connect interfaces to functional programming (Module 7)."
      ],
      concept: `An **interface** is a **pure contract**: a named set of method signatures that an implementing class promises to fulfil, using the \`implements\` keyword. Traditionally an interface had **no implementation and no instance state** — only *what*, never *how*. It defines a **capability** ("can-do"), so unrelated classes can share a type.

\`\`\`java
interface Drawable {
    void draw();                 // implicitly public abstract
}
class Circle implements Drawable {
    public void draw() { System.out.println("○"); }
}
class TextBox implements Drawable {           // unrelated to Circle, same capability
    public void draw() { System.out.println("[ ]"); }
}
\`\`\`

A class can \`implements\` **many** interfaces — this is Java's answer to **multiple inheritance** (of *type*), which it forbids for classes (§2.6).`,
      why: `Interfaces are the backbone of flexible Java design:

- **Multiple inheritance of type** without the diamond-state problem.
- **Total decoupling** — clients depend on a contract; implementations are swappable/injectable (polymorphism §2.9, Dependency Inversion in Module 12).
- **Capability mixing** — \`Comparable\`, \`Serializable\`, \`Runnable\`, \`AutoCloseable\` add abilities to any class.
- **Functional programming** — a single-abstract-method interface is a **functional interface** usable as a lambda target (Module 7).
- **Parallel development & testing** — code to the interface; mock it in tests.`,
      members: `What an interface can declare (and the implicit modifiers the compiler adds):

| Member | Implicit modifiers | Since |
|---|---|---|
| Abstract method | \`public abstract\` | 1.0 |
| Constant field | \`public static final\` | 1.0 |
| **default** method | \`public\` (has a body) | Java 8 |
| **static** method | \`public\` (called on the interface) | Java 8 |
| **private** / private static method | helper for defaults | Java 9 |

\`\`\`java
interface Calculator {
    int MAX = 1000;                       // public static final constant
    int apply(int a, int b);              // public abstract

    default int applyTwice(int a) {       // Java 8 default — has a body
        return apply(apply(a, a), a);
    }
    static Calculator adder() {           // Java 8 static factory
        return (a, b) -> a + b;
    }
    private int helper() { return MAX; }  // Java 9 private helper
}
\`\`\``,
      defaultMethods: `**default methods** were added in Java 8 so the JDK could **evolve interfaces without breaking** the millions of existing implementors — e.g., \`Collection.stream()\` and \`List.sort()\` were added as defaults. An implementing class inherits the default but may override it.

This reintroduces a controlled **diamond problem**. If a class inherits **conflicting defaults** from two interfaces, it **must override** the method and can pick a parent's version explicitly:

\`\`\`java
interface A { default String hi() { return "A"; } }
interface B { default String hi() { return "B"; } }
class C implements A, B {
    @Override public String hi() {
        return A.super.hi();      // explicitly choose A's default — disambiguate
    }
}
\`\`\`

Conflict-resolution rules: a **class** implementation always wins over an interface default; a **more specific** sub-interface default wins over a super-interface; otherwise you must override.`,
      internal: `- Interface methods are dispatched with the \`invokeinterface\` bytecode; calls are still polymorphic (§2.9).
- An interface defines a **type** but holds **no instance state** — its only fields are \`public static final\` constants (the "constant interface" anti-pattern; prefer an enum or final class for constants).
- You **cannot instantiate** an interface, but you can create instances via **implementing classes**, **anonymous classes**, or **lambdas/method references** (for functional interfaces, Module 7).
- A **functional interface** has exactly one abstract method; \`@FunctionalInterface\` makes the compiler enforce that (e.g., \`Runnable\`, \`Comparator\`, \`Callable\`).`,
      comparison: `**Interface vs Abstract class** (decision recap from §2.11):

| | Interface | Abstract class |
|---|---|---|
| Inheritance | Multiple (\`implements A, B\`) | Single (\`extends\`) |
| State | No instance fields (constants only) | Instance fields allowed |
| Constructors | No | Yes |
| Method bodies | default/static/private | any |
| Models | a **capability** ("can-do") | a **base type** ("is-a") with shared code |
| Default member access | \`public\` | any |

Choose an **interface** for capabilities adopted by possibly-unrelated types and for multiple inheritance of type; choose an **abstract class** when implementations are related and share **state/constructors/code**.`,
      useCases: `- **Core JDK contracts**: \`Comparable\`, \`Comparator\`, \`Iterable\`, \`Runnable\`, \`Callable\`, \`AutoCloseable\`, \`Serializable\`.
- **Collections** — \`List\`, \`Set\`, \`Map\`, \`Queue\` are interfaces with many implementations (Module 5).
- **Functional interfaces** — \`Function\`, \`Predicate\`, \`Supplier\`, \`Consumer\` power lambdas/streams (Module 7).
- **Dependency boundaries** — \`UserRepository\`, \`PaymentGateway\` injected by Spring; mocked in tests.`,
      code: `\`\`\`java
interface Repository<T> {                       // a contract (generics: Module 6)
    void save(T item);
    java.util.Optional<T> findById(long id);
}

class InMemoryUserRepo implements Repository<String> {
    private final java.util.Map<Long,String> db = new java.util.HashMap<>();
    public void save(String item) { db.put((long) db.size()+1, item); }
    public java.util.Optional<String> findById(long id) {
        return java.util.Optional.ofNullable(db.get(id));
    }
}

// a class implementing multiple interfaces (capability mixing)
class Document implements Comparable<Document>, AutoCloseable {
    private final String title;
    Document(String t){ this.title = t; }
    public int compareTo(Document o){ return title.compareTo(o.title); }
    public void close(){ System.out.println("closed " + title); }
}

// functional interface used as a lambda (Module 7)
Runnable task = () -> System.out.println("running");
task.run();
\`\`\``,
      mistakes: `- **Forgetting \`public\`** on an implemented method — interface methods are \`public\`, and you cannot reduce visibility in the implementation (compile error).
- **The constant-interface anti-pattern** — declaring an interface just to hold constants; use an \`enum\` or a final class instead.
- **Unresolved diamond** — inheriting two conflicting defaults without overriding (compile error); resolve with \`X.super.method()\`.
- **Putting state in an interface** — interfaces can't hold instance fields; only constants.
- **Adding more than one abstract method** to something meant to be a lambda target — breaks the functional-interface requirement.`,
      bestPractices: `- **Program to interfaces**, not implementations (declare variables/params as the interface type).
- Keep interfaces **small and cohesive** (Interface Segregation Principle, Module 12).
- Use \`default\` methods to evolve APIs **sparingly** — they're for backward compatibility, not for stuffing logic into interfaces.
- Annotate single-method interfaces with \`@FunctionalInterface\` when intended for lambdas.
- Prefer **enums/constants classes** over constant interfaces; name interfaces by capability (\`Comparable\`, \`Closeable\`).`,
      interview: `**Q1. What is an interface and how does it differ from a class?**
A contract of method signatures (and constants/defaults) a class promises to fulfil; it can't hold instance state or be instantiated, and a class can implement many.

**Q2. How does Java achieve multiple inheritance?**
Through interfaces — a class can implement multiple interfaces (multiple inheritance of *type*), avoiding the state-diamond problem of classes.

**Q3. What are default methods and why were they added?**
Interface methods with a body (Java 8), added so existing interfaces (e.g., \`Collection\`) could gain new methods like \`stream()\` without breaking implementors.

**Q4. How is the diamond problem resolved for default methods?**
The class must override the conflicting method; it can call a chosen parent via \`InterfaceName.super.method()\`. Class wins over interface; more-specific interface wins over less-specific.

**Q5. Can interfaces have static and private methods?**
Static methods since Java 8; private (and private static) helper methods since Java 9.

**Q6. What is a functional interface?**
An interface with exactly one abstract method, usable as a lambda/method-reference target (e.g., \`Runnable\`, \`Comparator\`); marked with \`@FunctionalInterface\`.

**Q7. Interface vs abstract class — pick one and justify.**
Interface for capabilities/multiple inheritance/no shared state; abstract class for related types sharing state, constructors, and code.

**Q8. Are interface fields variables?**
No — they're implicitly \`public static final\` constants.`,
      exercises: `1. Define \`Playable\` (\`play()\`) and \`Recordable\` (\`record()\`); make a \`MediaPlayer\` implement both and call each capability.
2. Add a \`default\` method \`pause()\` to \`Playable\`; have one implementer use the default and another override it.
3. Create two interfaces with a conflicting \`default greet()\`; implement both in one class and resolve the diamond with \`X.super.greet()\`.
4. Write a \`@FunctionalInterface Transformer<T,R>\` with \`R apply(T t)\` and use it via a lambda (preview of Module 7).`,
      challenges: `Model a plugin system: a \`Plugin\` interface with abstract \`name()\`/\`execute()\`, a \`default\` \`describe()\`, and a \`static\` \`registry()\` factory. Implement three plugins, store them as \`List<Plugin>\`, and run all via the interface type. Then add a second interface \`Configurable\` and make one plugin implement both, demonstrating multiple inheritance of type and capability mixing. Discuss where you'd choose an abstract base class instead.`,
      summary: `- An **interface** is a pure contract (a **capability**); a class \`implements\` many → **multiple inheritance of type**.
- Members: \`public abstract\` methods, \`public static final\` constants, plus Java 8 **default/static** and Java 9 **private** methods.
- Conflicting defaults must be **overridden** (\`X.super.m()\`); class wins over interface, specific over general.
- A single-abstract-method interface is a **functional interface** (lambdas — Module 7).
- Pick interface vs **abstract class (§2.11)** by capability/multiple-inheritance vs shared-state/single-inheritance.`
    }),

    /* 2.13 Association — the general "uses-a" relationship between objects. */
    topic({
      id: "association", chapter: "2.13", title: "Association",
      subtitle: "The general relationship between objects — the parent of aggregation & composition.",
      readTime: "13 min", level: "Core", deep: true,
      objectives: [
        "Define association and its multiplicity (one-to-one, one-to-many, many-to-many).",
        "Distinguish association from inheritance (\"has-a\"/\"uses-a\" vs \"is-a\").",
        "Recognise aggregation (§2.14) and composition (§2.15) as special kinds of association.",
        "Model bidirectional vs unidirectional associations."
      ],
      concept: `**Association** is the most general structural relationship between two **separate** classes whose objects interact — a **"uses-a"** or **"has-a"** relationship (as opposed to inheritance's **"is-a"**, §2.6). A \`Doctor\` is associated with \`Patient\`; a \`Teacher\` with \`Student\`. Neither owns the other's lifecycle; they simply collaborate.

\`\`\`java
class Driver {
    void drive(Car car) {        // Driver uses-a Car (association via a parameter)
        car.start();
    }
}
\`\`\`

Association is the **umbrella term**. Its two stronger, ownership-flavoured forms are **aggregation** (§2.14) and **composition** (§2.15).`,
      why: `Most real systems are built from objects **collaborating**, not inheriting. Association lets you model these collaborations explicitly:

- Reflects real relationships (\`Order\`–\`Customer\`, \`Account\`–\`Transaction\`).
- Supports **composition over inheritance** (§2.15, Module 12) — combine behaviour by wiring objects together.
- Maps directly to **database relationships** and **JPA/Hibernate** mappings (\`@OneToMany\`, \`@ManyToMany\`).`,
      multiplicity: `Associations have **multiplicity** (cardinality):

| Type | Meaning | Example |
|---|---|---|
| **One-to-one** | one A relates to one B | \`Person\` ↔ \`Passport\` |
| **One-to-many** | one A relates to many B | \`Department\` → many \`Employee\` |
| **Many-to-one** | many A relate to one B | many \`Employee\` → \`Department\` |
| **Many-to-many** | many A relate to many B | \`Student\` ↔ \`Course\` |

**Directionality:**

- **Unidirectional** — only one side knows the other (\`Order\` holds \`Customer\`, but \`Customer\` doesn't list orders).
- **Bidirectional** — both sides reference each other (kept in sync carefully to avoid inconsistency).`,
      internal: `Association is implemented simply by **one object holding a reference to another** (as a field, method parameter, return value, or local variable). There's no special keyword. What distinguishes plain association from aggregation/composition is **lifecycle ownership** and **strength**, not syntax:

- **Association** (general): objects are independent; either can exist without the other.
- **Aggregation** (§2.14): a *whole–part* "has-a" where the part can live without the whole (weak ownership).
- **Composition** (§2.15): a *whole–part* where the part **cannot** exist without the whole (strong ownership).

So aggregation and composition are *specialised associations* — a common interview clarification.`,
      useCases: `- **Service collaboration**: \`OrderService\` uses a \`PaymentService\` and an \`InventoryService\`.
- **Domain links**: \`Student\`–\`Course\` (many-to-many), \`Customer\`–\`Order\` (one-to-many).
- **ORM mappings**: associations become foreign keys / join tables (Module 10).
- **Bidirectional graphs**: \`Employee\`–\`Manager\` where each side navigates to the other.`,
      code: `\`\`\`java
// Many-to-many association: Student <-> Course (independent lifecycles)
class Course {
    String title;
    Course(String t) { this.title = t; }
}
class Student {
    String name;
    List<Course> courses = new ArrayList<>();   // association (one student, many courses)
    Student(String n) { this.name = n; }
    void enroll(Course c) { courses.add(c); }
}

Course java = new Course("Java Mastery");
Student s = new Student("Shail");
s.enroll(java);
// Deleting the student does NOT delete the course; they live independently.
\`\`\``,
      mistakes: `- **Modelling a "uses-a" as inheritance** — a \`Car\` should *have* an \`Engine\`, not *extend* it (composition, §2.15).
- **Unsynchronised bidirectional links** — updating one side but not the other leaves an inconsistent object graph.
- **Confusing the three forms** — association is general; aggregation/composition add ownership semantics.
- **Leaking mutable collections** that represent associations (return copies/unmodifiable views — §2.5).`,
      bestPractices: `- Default to **association/composition** for code reuse; reserve inheritance for true *is-a* (§2.6).
- Keep associations **unidirectional** unless you genuinely need to navigate both ways.
- For bidirectional links, centralise the wiring in one helper method to keep both sides consistent.
- Express multiplicity clearly in types (\`List<Order>\` vs a single \`Customer\`).`,
      interview: `**Q1. What is association?**
A general relationship where objects of two independent classes interact ("uses-a"/"has-a"), without one owning the other's lifecycle.

**Q2. Association vs inheritance?**
Association is "has-a"/"uses-a" between separate objects; inheritance is "is-a" between a subclass and superclass.

**Q3. How do aggregation and composition relate to association?**
They are specialised associations that add whole–part ownership: aggregation (weak, independent lifetimes) and composition (strong, dependent lifetimes).

**Q4. What is multiplicity?**
The cardinality of an association: one-to-one, one-to-many, many-to-one, many-to-many.

**Q5. Unidirectional vs bidirectional association?**
Whether one side or both sides hold a reference to the other.`,
      exercises: `1. Model a one-to-many association \`Department\`–\`Employee\` with a \`List<Employee>\` in \`Department\`; add employees and list them.
2. Model many-to-many \`Author\`–\`Book\` where each holds a list of the other; enroll a couple of links.
3. Convert a bad inheritance (\`class Car extends Engine\`) into an association (\`Car\` has an \`Engine\`) and explain why.
4. Implement a helper that keeps a bidirectional \`Order\`–\`Customer\` link consistent on both sides.`,
      challenges: `Design a university model with \`Student\`, \`Course\`, and \`Instructor\`. Implement a many-to-many \`Student\`–\`Course\` association and a one-to-many \`Instructor\`–\`Course\` association, with methods to enroll/withdraw and reassign instructors. Then classify each relationship as plain association, aggregation, or composition, justifying your choice by lifecycle ownership (preview of §2.14–§2.15).`,
      summary: `- **Association** = general relationship between independent objects ("uses-a"/"has-a"), distinct from inheritance ("is-a").
- Has **multiplicity** (1:1, 1:N, N:1, N:M) and **direction** (uni/bidirectional).
- Implemented by one object referencing another; **aggregation (§2.14)** and **composition (§2.15)** are stronger, ownership-bearing kinds.
- Prefer association/composition over inheritance for reuse.`
    }),

    /* 2.14 Aggregation — weak "has-a" whole/part with independent lifetimes. */
    topic({
      id: "aggregation", chapter: "2.14", title: "Aggregation",
      subtitle: "A weak whole–part 'has-a' where parts outlive the whole.",
      readTime: "12 min", level: "Core", deep: true,
      objectives: [
        "Define aggregation as a weak whole–part association.",
        "Contrast it with composition (§2.15) by lifecycle ownership.",
        "Implement aggregation by sharing externally-owned references.",
        "Recognise aggregation in UML and real designs."
      ],
      concept: `**Aggregation** is a **special form of association** (§2.13) representing a **whole–part ("has-a")** relationship where the **part can exist independently of the whole**. It's *weak* ownership: the whole groups parts, but doesn't control their lifecycle.

Classic example: a \`Team\` **has** \`Player\`s, but a \`Player\` exists before joining and survives after the team disbands. The team didn't create the players and destroying the team doesn't destroy them.

\`\`\`java
class Player {
    String name;
    Player(String name) { this.name = name; }
}
class Team {
    private final List<Player> players;            // aggregation
    Team(List<Player> players) {                   // players created OUTSIDE, passed in
        this.players = players;
    }
}
\`\`\`

The tell-tale sign: the part is **passed in** from outside, not created inside the whole.`,
      why: `Aggregation models **shared or independent parts** accurately:

- Parts can be **shared** between multiple wholes (one \`Player\` could belong to multiple \`Team\`s; an \`Address\` shared by people).
- Parts have their **own lifecycle** managed elsewhere.
- It keeps objects **loosely coupled** — the whole references parts without owning them, easing reuse and testing.`,
      comparison: `**Aggregation vs Composition** — the defining interview distinction:

| | **Aggregation** (§2.14) | **Composition** (§2.15) |
|---|---|---|
| Strength | Weak "has-a" | Strong "has-a" |
| Part lifecycle | Independent of the whole | Bound to the whole |
| Who creates the part | Outside; passed in | The whole creates it |
| If the whole is destroyed | Part survives | Part is destroyed |
| Sharing | Part can be shared | Part is exclusive |
| UML symbol | Hollow ◇ diamond | Filled ◆ diamond |
| Example | \`Team\` ◇— \`Player\` | \`House\` ◆— \`Room\` |

Mnemonic: aggregation = **"has-a" (borrowed)**; composition = **"owns-a" (exclusive)**.`,
      internal: `Implementation-wise, aggregation looks like any association — a reference field — but the **lifecycle convention** matters: the referenced object is **created externally** and typically **injected** through the constructor or a setter. Because the same part instance can be handed to several wholes, **mutations are visible to all holders** (shared state) — relevant for concurrency (Module 8) and defensive copying (§2.5).`,
      useCases: `- **Dependency injection** is essentially aggregation: a service is given its collaborators (created/managed by the container), not creating them itself.
- **Shared resources**: a \`ConnectionPool\` shared by many \`Service\` objects; an \`Address\` shared by family members.
- **Groupings**: \`Department\` aggregates \`Employee\`s who exist independently in the company.
- **Library/Catalog**: a \`Playlist\` aggregates \`Song\`s that exist in the wider library.`,
      code: `\`\`\`java
class Engine {                       // exists independently
    void run() { System.out.println("vroom"); }
}
class Car {
    private final Engine engine;     // aggregation: engine supplied from outside
    Car(Engine engine) { this.engine = engine; }
    void start() { engine.run(); }
}

Engine shared = new Engine();        // created externally
Car a = new Car(shared);
Car b = new Car(shared);             // SAME engine shared by two cars (aggregation)
a.start(); b.start();
// 'shared' still exists even if a and b are garbage-collected.
\`\`\`

Contrast: if \`Car\` instead did \`this.engine = new Engine();\` internally and never shared it, that would be **composition** (§2.15).`,
      mistakes: `- **Calling it composition** when the part is shared/injected — the lifecycle test decides (part survives ⇒ aggregation).
- **Accidentally sharing mutable parts** and being surprised when changes ripple across wholes.
- **Letting the whole \`new\` the part** when you intended aggregation — that creates ownership (composition).
- **Returning the internal reference** so callers can swap shared parts unexpectedly (encapsulation, §2.5).`,
      bestPractices: `- **Inject** aggregated parts (constructor/setter) rather than creating them inside — clearer ownership and testability.
- Document/expect that aggregated parts are **shared**; guard for concurrent mutation if needed (Module 8).
- Use aggregation for **reusable, independently-managed** collaborators; use composition for exclusively-owned internals.
- Prefer immutable parts when sharing to avoid surprising side effects.`,
      interview: `**Q1. What is aggregation?**
A weak whole–part "has-a" association where the part can exist independently of the whole and is usually supplied from outside.

**Q2. Aggregation vs composition?**
Aggregation: independent part lifetimes, parts can be shared, created externally (hollow diamond). Composition: part lifetime bound to the whole, exclusive, created internally (filled diamond).

**Q3. Give a real example of aggregation.**
A \`Team\` and its \`Player\`s — players exist before/after the team and may belong to other teams.

**Q4. Is dependency injection aggregation or composition?**
Typically aggregation — collaborators are created/managed externally and injected.

**Q5. How is aggregation represented in UML?**
A hollow (unfilled) diamond on the "whole" side.`,
      exercises: `1. Model \`Library\` aggregating \`Book\`s passed into its constructor; show that books still exist after the library reference is dropped.
2. Share one \`Engine\` object between two \`Car\` objects; mutate the engine through one car and observe the effect via the other.
3. Convert an internally-created part into an injected (aggregated) part and explain how ownership changed.
4. Draw the UML (hollow diamond) for \`Department\`–\`Employee\`.`,
      challenges: `Build a \`MusicPlayer\` that aggregates a shared \`Playlist\` which itself aggregates \`Song\`s from a global library. Show that the same \`Song\` instance can appear in multiple playlists and that deleting a playlist leaves the songs intact. Then identify one place where switching to composition would be wrong and explain why, citing the lifecycle test.`,
      summary: `- **Aggregation** = weak whole–part "has-a"; the **part lives independently** of the whole and is usually **injected** from outside.
- Parts can be **shared** across wholes; destroying the whole leaves parts intact (UML hollow ◇).
- It's a specialised **association (§2.13)**; the lifecycle test separates it from **composition (§2.15)**.
- Dependency injection is essentially aggregation — favour it for reusable collaborators.`
    }),

    /* 2.15 Composition — strong "owns-a" whole/part with bound lifetimes. */
    topic({
      id: "composition", chapter: "2.15", title: "Composition",
      subtitle: "Strong 'owns-a' whole–part — and why to favour it over inheritance.",
      readTime: "16 min", level: "Core", deep: true,
      objectives: [
        "Define composition as strong whole–part ownership with bound lifecycles.",
        "Contrast composition with aggregation (§2.14) and inheritance (§2.6).",
        "Apply the principle \"favour composition over inheritance.\"",
        "Implement delegation to reuse behaviour without inheriting."
      ],
      concept: `**Composition** is the **strongest whole–part ("owns-a") relationship**: the part is **created, owned, and exclusively controlled by the whole**, and **cannot meaningfully exist without it**. When the whole is destroyed, its parts go with it.

\`\`\`java
class Room { Room(String name) { /* ... */ } }
class House {
    private final List<Room> rooms = new ArrayList<>();
    House() {
        rooms.add(new Room("Kitchen"));   // House CREATES and OWNS its Rooms
        rooms.add(new Room("Bedroom"));
    }
    // No way for an outside Room to exist independently of this House.
}
\`\`\`

The tell-tale sign (vs aggregation §2.14): the part is **created inside** the whole and not shared or exposed.`,
      why: `Composition is the workhorse of good OOP design:

- **Accurate modelling** of true ownership (a \`Heart\` belongs to one \`Body\`; an \`Engine\` built into one \`Car\`).
- **Encapsulation** — the part is hidden internal state (§2.5); the whole controls all access.
- **"Favour composition over inheritance"** — combine behaviour by **wiring objects together** instead of building rigid class hierarchies, avoiding the *fragile base class* problem and gaining runtime flexibility.`,
      favourOverInheritance: `One of the most important design lessons (Module 12, *Effective Java* Item 18). Inheritance (§2.6) is **compile-time, tight, and exposes the parent's API**; composition is **runtime, loose, and exposes only what you choose**.

\`\`\`java
// Inheritance (fragile): inherits ALL of HashSet's API and behaviour
class CountingSetBad<E> extends java.util.HashSet<E> { /* must track addAll quirks... */ }

// Composition + delegation (robust): wrap and expose only what you need
class CountingSet<E> {
    private final java.util.Set<E> set = new java.util.HashSet<>();   // owns the part
    private int additions = 0;
    public boolean add(E e) { additions++; return set.add(e); }       // delegate
    public int additions() { return additions; }
}
\`\`\`

**Why composition wins here:** it isn't broken by changes to \`HashSet\`'s internals, it hides the unwanted parts of the parent API, and you can swap the wrapped \`Set\` implementation at runtime.

Use **inheritance only for genuine is-a** with a stable, designed-for-extension base; otherwise **compose and delegate**.`,
      comparison: `Putting all three relationships together:

| | Inheritance (§2.6) | Aggregation (§2.14) | Composition (§2.15) |
|---|---|---|---|
| Relationship | "is-a" | "has-a" (weak) | "owns-a" (strong) |
| Coupling | Tight (compile-time) | Loose | Moderate (encapsulated) |
| Part lifecycle | n/a | Independent | Bound to whole |
| Part created | n/a | Outside, injected | Inside the whole |
| Flexibility | Low (fixed at compile time) | High | High (swap internals) |
| UML | solid triangle ▷ | hollow ◇ diamond | filled ◆ diamond |`,
      internal: `Composition is implemented as a **private reference to an internally-created object**, often \`final\`. Because the whole owns the part exclusively:

- The part is **not shared** and **not exposed** (no leaking getters returning the live object — §2.5).
- When the whole becomes unreachable, the part (referenced only by the whole) also becomes eligible for **garbage collection** — the "destroyed together" semantics.
- **Delegation** (the whole forwarding calls to its parts) is how composed objects reuse behaviour — the basis of patterns like Decorator, Strategy, and Adapter (Module 13).`,
      useCases: `- **Building complex objects from parts**: \`Car\` owns \`Engine\`, \`Transmission\`, \`Wheels\`.
- **Decorator/Strategy/Adapter** patterns (Module 13) — all built on composition + delegation.
- **Encapsulated internals**: a \`HttpClient\` owning its connection pool and serializer.
- **Replacing inheritance**: wrapping a collection to add behaviour (as above) instead of subclassing it.`,
      code: `\`\`\`java
// Strategy via composition: behaviour injected and owned, swappable at runtime
interface Discount { double apply(double price); }
class NoDiscount       implements Discount { public double apply(double p){ return p; } }
class PercentDiscount  implements Discount {
    private final double pct;
    PercentDiscount(double pct){ this.pct = pct; }
    public double apply(double p){ return p * (1 - pct); }
}

class Cart {
    private Discount discount = new NoDiscount();      // composed behaviour
    private final List<Double> items = new ArrayList<>();
    void add(double price){ items.add(price); }
    void setDiscount(Discount d){ this.discount = d; } // swap at runtime
    double total(){
        double sum = items.stream().mapToDouble(Double::doubleValue).sum();
        return discount.apply(sum);                    // delegate
    }
}

Cart cart = new Cart();
cart.add(100); cart.add(50);
cart.setDiscount(new PercentDiscount(0.10));
System.out.println(cart.total());   // 135.0
\`\`\``,
      mistakes: `- **Using inheritance for reuse** when there's no is-a — leads to fragile, over-coupled hierarchies; compose instead.
- **Leaking the owned part** via a getter that returns the live internal object (breaks ownership/encapsulation, §2.5).
- **Calling it composition while sharing the part** — if the part is shared/injected and outlives the whole, it's aggregation (§2.14).
- **Deep delegation boilerplate** — sometimes many forwarding methods are needed (a known cost of composition).`,
      bestPractices: `- **Favour composition over inheritance** for code reuse; reserve inheritance for true is-a with a base designed for extension.
- Keep composed parts \`private final\` and **don't expose** them; offer behaviour, not the part.
- Use **delegation** to forward only the operations you want to expose.
- Combine composition with **interfaces** (§2.12) to swap implementations at runtime (Strategy).
- Apply the **lifecycle test** to decide composition vs aggregation.`,
      interview: `**Q1. What is composition?**
A strong whole–part "owns-a" relationship where the whole creates and exclusively owns the part, and the part cannot exist without the whole.

**Q2. Composition vs aggregation?**
Composition: bound lifetimes, exclusive, part created inside (filled diamond). Aggregation: independent lifetimes, shareable, part injected from outside (hollow diamond).

**Q3. Why favour composition over inheritance?**
It's looser coupling, avoids the fragile base class problem, hides unwanted parent API, and allows swapping behaviour at runtime — inheritance is rigid and compile-time.

**Q4. What is delegation?**
A composed object forwarding method calls to the parts it owns to reuse their behaviour.

**Q5. Give an example where composition replaces inheritance.**
Wrapping a \`Set\` to count additions (delegation) instead of \`extends HashSet\`.

**Q6. How do you decide between the two whole–part forms?**
The lifecycle test: if the part dies with the whole and isn't shared, it's composition; otherwise aggregation.`,
      exercises: `1. Build a \`Computer\` that composes \`CPU\`, \`RAM\`, and \`Storage\` (created internally), exposing only \`boot()\` that delegates to them.
2. Replace a \`class StackBad extends ArrayList\` with a composition-based \`Stack\` that wraps a \`List\` and exposes only \`push\`/\`pop\`/\`peek\`.
3. Implement a Strategy: a \`TextProcessor\` whose formatting behaviour is a composed, swappable interface.
4. Demonstrate the lifecycle: show a composed part becoming unreachable when its whole is dropped, versus an aggregated part surviving.`,
      challenges: `Refactor a small inheritance hierarchy (\`class PremiumAccount extends Account extends BaseEntity\`) into a composition-based design where \`Account\` *owns* a \`InterestPolicy\` and *has* an \`AuditInfo\`. Expose only the needed behaviour via delegation. Write a short paragraph arguing which responsibilities legitimately remain inheritance (is-a) and which became composition (owns-a/has-a), connecting to the SOLID principles in Module 12.`,
      summary: `- **Composition** = strong whole–part "owns-a"; the whole **creates and exclusively owns** the part, which **dies with it** (UML filled ◆).
- vs **Aggregation (§2.14):** bound vs independent lifetimes; created-inside vs injected; exclusive vs shared.
- **Favour composition over inheritance** — looser coupling, no fragile base class, runtime flexibility, hidden internals.
- Built on **delegation**; powers Strategy/Decorator/Adapter (Module 13); decide via the **lifecycle test**.`
    }),

    /* 2.16 Access Modifiers — the visibility rules that enforce encapsulation. */
    topic({
      id: "access-modifiers", chapter: "2.16", title: "Access Modifiers",
      subtitle: "private, default, protected, public — the visibility rules behind encapsulation.",
      readTime: "15 min", level: "Core", deep: true,
      objectives: [
        "Recall the four access levels and their exact scopes.",
        "Apply the correct modifier to fields, methods, constructors, and classes.",
        "Explain how access rules interact with inheritance (§2.6) and overriding (§2.8).",
        "Use modifiers to enforce encapsulation (§2.5) and design clean APIs."
      ],
      concept: `**Access modifiers** are keywords that control the **visibility** (accessibility) of classes and their members. They are the language mechanism that **enforces encapsulation** (§2.5). Java has **four** levels, from most to least restrictive:

| Modifier | Same class | Same package | Subclass (other pkg) | Anywhere |
|---|---|---|---|---|
| \`private\` | ✅ | ❌ | ❌ | ❌ |
| *(default / package-private)* | ✅ | ✅ | ❌ | ❌ |
| \`protected\` | ✅ | ✅ | ✅ | ❌ |
| \`public\` | ✅ | ✅ | ✅ | ✅ |

"Default" means **no modifier written** — visibility is limited to the **same package**.`,
      why: `Choosing the **narrowest** modifier that works is a core design discipline:

- **Enforces encapsulation** — \`private\` state can't be touched or corrupted from outside.
- **Defines your public API surface** — only \`public\` members are commitments to callers; everything else you can change freely.
- **Reduces coupling** — fewer visible members means fewer dependencies to break.
- **Improves security & maintainability** — internal helpers stay internal.

> Guiding rule (*Effective Java*): **minimise accessibility** — make every member as inaccessible as possible.`,
      details: `**Per level, in practice:**

- \`private\` — visible only inside the **same class**. The default choice for **fields** and internal helper methods.
- **default (package-private)** — no keyword; visible across the **same package**. Useful for collaborating classes within a module and for package-scoped test helpers.
- \`protected\` — package **plus** subclasses in **other** packages. Intended for members a subclass needs for extension (§2.6) but that aren't part of the public API. (Note: a subclass in another package can access a \`protected\` member only **through its own type**, not through an arbitrary superclass reference.)
- \`public\` — visible **everywhere** the class is accessible. Reserve for the intentional API.

\`\`\`java
public class Account {
    private double balance;          // hidden state
    double lastTxnId;                // package-private (collaborators in same pkg)
    protected void audit() { }       // for subclasses to extend
    public double getBalance() { return balance; }  // the public contract
}
\`\`\``,
      topLevelTypes: `**Top-level classes/interfaces** may be only **\`public\`** or **package-private** (default) — they **cannot** be \`private\` or \`protected\`.

\`\`\`java
public class Foo { }   // visible everywhere
class Bar { }          // package-private — visible only within its package
// private class Baz {}   ❌ illegal at top level
\`\`\`

A \`.java\` file may hold at most **one \`public\` top-level type**, and its name must match the file. (Nested classes, however, *can* be \`private\`/\`protected\`.)`,
      internal: `Access control is a **compile-time** check (enforced by \`javac\`) plus a verification by the JVM at link time; it is **not** a security sandbox — **reflection** (\`setAccessible(true)\`) can bypass it, which is why frameworks (Spring, Jackson, JUnit) can read private fields. With the **module system** (Java 9+, \`module-info.java\`), a stronger boundary exists: a \`public\` type is only accessible to other modules if its package is \`exports\`-ed — "public" no longer means "universally accessible" across module boundaries.`,
      interactionWithOverriding: `Access rules interact with inheritance/overriding (§2.6, §2.8):

- An override **cannot reduce** visibility — \`protected\` in the parent can become \`public\` in the child, but not the reverse (compile error).
- \`private\` methods are **not inherited**, so they can't be overridden (a same-named child method is a new, independent method).
- \`protected\` is the usual choice for hooks/template steps subclasses must access.`,
      useCases: `- \`private\` fields + \`public\` getters/setters — the encapsulation default (§2.5).
- \`protected\` template-method hooks for subclasses (§2.11, Module 13).
- **package-private** for classes that collaborate within a package but shouldn't be public API.
- \`public\` for the deliberate, documented, stable interface of a library/module.`,
      code: `\`\`\`java
package com.shail.bank;

public class BankAccount {
    private double balance;                 // only this class
    private static final double MIN = 0;    // hidden constant

    public BankAccount(double opening) {    // public API
        if (opening < MIN) throw new IllegalArgumentException();
        this.balance = opening;
    }
    public void deposit(double amt) {       // public API
        validate(amt);
        balance += amt;
    }
    protected void onOverdraft() { }        // extension hook for subclasses
    private void validate(double amt) {     // internal helper
        if (amt <= 0) throw new IllegalArgumentException();
    }
    public double getBalance() { return balance; }
}
\`\`\``,
      mistakes: `- **Public fields** — \`public double balance;\` breaks encapsulation (§2.5); make fields \`private\`.
- **Over-using \`public\`** — enlarges the API you must keep stable forever; default to the narrowest level.
- **Misusing \`protected\`** thinking it means "package + subclass only via any reference" — cross-package subclass access is constrained to the subclass's own type.
- **Expecting access control to be security** — reflection bypasses it.
- **Trying \`private\`/\`protected\` on a top-level class** — illegal.`,
      bestPractices: `- **Minimise accessibility**: start \`private\`, widen only when required.
- Make fields \`private\` (or \`private final\`) and expose behaviour, not data.
- Use \`protected\` *intentionally* for designed extension points; document them.
- Keep the **public API small, stable, and documented**; hide everything else.
- Combine with the module system (\`exports\`) for true cross-module encapsulation in large codebases.`,
      interview: `**Q1. What are the four access modifiers and their scopes?**
\`private\` (class), default/package-private (package), \`protected\` (package + subclasses), \`public\` (everywhere). See the visibility table.

**Q2. What is the default (no-modifier) access?**
Package-private — visible only within the same package.

**Q3. Can a top-level class be \`private\` or \`protected\`?**
No — only \`public\` or package-private. Nested classes can be \`private\`/\`protected\`.

**Q4. Difference between \`protected\` and default?**
Default is package-only; \`protected\` adds access to subclasses in other packages (through the subclass type).

**Q5. Can an overriding method reduce access?**
No — it must keep the same or wider visibility.

**Q6. Can access modifiers be bypassed?**
Yes — via reflection (\`setAccessible(true)\`); access control is a compile-time/visibility rule, not a security guarantee.

**Q7. Which modifier best supports encapsulation for fields?**
\`private\`.`,
      exercises: `1. Build a class with one field per access level and try to read each from (a) the same class, (b) another class in the same package, (c) a subclass in another package, (d) an unrelated class elsewhere; record which compile.
2. Convert all public fields of a given class to \`private\` with validated accessors.
3. Add a \`protected\` hook method and override it in a subclass that widens it to \`public\`; then try narrowing it and read the error.
4. Create a package-private helper class and confirm it's invisible from another package.`,
      challenges: `Take a "naked" data class with all-public fields and refactor it into a properly encapsulated, minimally-accessible API: private state, a focused public surface, package-private collaborators, and a protected extension hook. Then write a short note on how the Java module system would further restrict access across module boundaries (\`exports\`), and why "minimise accessibility" reduces long-term maintenance cost.`,
      summary: `- Four levels: \`private\` (class) ⊂ **default** (package) ⊂ \`protected\` (package + subclasses) ⊂ \`public\` (everywhere).
- They **enforce encapsulation (§2.5)**; top-level types can be only \`public\` or package-private.
- Overrides can't **narrow** access (§2.8); \`private\` isn't inherited.
- **Minimise accessibility**; access control is compile-time, bypassable by reflection, and tightened by the module system.`
    }),

    /* 2.17 Packages — namespaces, organisation, and the module preview. */
    topic({
      id: "packages", chapter: "2.17", title: "Packages",
      subtitle: "Namespaces that organise classes, prevent name clashes, and shape access.",
      readTime: "14 min", level: "Core", deep: true,
      objectives: [
        "Declare and use packages with \`package\` and \`import\`.",
        "Explain how packages map to directories and the fully-qualified name.",
        "Use naming conventions and understand \`import static\` and wildcard imports.",
        "Connect packages to access control (§2.16) and the module system."
      ],
      concept: `A **package** is a **namespace** that groups related classes and interfaces, like folders group files. It is declared as the **first non-comment line** of a source file:

\`\`\`java
package com.shail.bank;       // this class belongs to package com.shail.bank

public class Account { /* ... */ }
\`\`\`

The package name plus the class name forms a class's **fully-qualified name (FQN)** — \`com.shail.bank.Account\` — which is globally unique and how the JVM identifies the type.`,
      why: `Packages solve real problems at scale:

- **Avoid name clashes** — your \`Date\` and \`java.util.Date\` and \`java.sql.Date\` coexist via distinct packages.
- **Organisation** — group code by feature/layer (\`...controller\`, \`...service\`, \`...repository\`).
- **Access control** — package-private (default) visibility (§2.16) lets classes collaborate within a package while staying hidden outside.
- **Reusability & distribution** — packages bundle into JARs for sharing.
- **Maintainability** — clear module boundaries in large codebases (TCS/Infosys-scale projects rely on disciplined package structure).`,
      directoryMapping: `Package names **map directly to directory structure** on disk:

\`\`\`
src/
 └─ com/
     └─ shail/
         └─ bank/
             └─ Account.java     // package com.shail.bank;
\`\`\`

Compiling and running with packages from \`src\`:

\`\`\`bash
javac -d out src/com/shail/bank/Account.java   # -d sets output root
java  -cp out com.shail.bank.Account           # run by fully-qualified name
\`\`\`

The compiler enforces that a file's \`package\` declaration matches its directory path under the source root.`,
      imports: `\`import\` lets you refer to a class by its **simple name** instead of its FQN. It's a **compile-time convenience** — it does *not* bundle or load anything extra at runtime.

\`\`\`java
import java.util.List;             // single-type import (preferred)
import java.util.*;                // wildcard — all PUBLIC types in the package (not subpackages)
import static java.lang.Math.*;    // static import — use PI, sqrt() without "Math."

double r = sqrt(PI);               // thanks to the static import
\`\`\`

Notes:

- \`java.lang\` (\`String\`, \`System\`, \`Math\`, \`Object\`…) is imported **automatically**.
- Wildcards import only the package's own public types, **not** sub-packages.
- For a name in two imported packages, use the **FQN** to disambiguate (e.g., \`java.sql.Date\` vs \`java.util.Date\`).`,
      conventions: `**Naming conventions** (interviewers check these):

- All **lowercase**, dot-separated: \`com.company.project.layer\`.
- Use the **reverse domain name** to guarantee global uniqueness: a company owning \`shail.com\` uses \`com.shail.*\`.
- No hyphens or reserved words; segments are valid identifiers.
- Group by **feature or layer** consistently across the codebase.

\`\`\`
com.shail.banking.account     // domain/feature
com.shail.banking.web         // controllers
com.shail.banking.persistence // repositories
\`\`\``,
      internal: `At runtime the **classpath** (\`-cp\`) tells the class loader (Module 1) where to find packaged \`.class\` files (in directories or JARs); the loader resolves a class by its FQN. Two classes with the **same FQN** loaded by **different class loaders** are considered distinct types — the root cause of some \`ClassCastException\`s in app servers.

Packages are a *namespacing* mechanism, **not** a strong encapsulation boundary on their own — that's why the **Java Platform Module System (JPMS, Java 9+)** was introduced: a \`module-info.java\` declares which packages are \`exports\`-ed and which modules it \`requires\`, giving real cross-module access control (ties to §2.16). Build tools (**Maven/Gradle**, Module 11) and JARs are how packages are organised and shipped in practice.`,
      useCases: `- **Layered architecture**: \`controller\` / \`service\` / \`repository\` / \`model\` packages.
- **Feature modularisation**: \`com.shop.cart\`, \`com.shop.catalog\`, \`com.shop.payment\`.
- **Library APIs**: a public \`api\` package plus an \`internal\` package kept package-private.
- **Avoiding clashes**: using FQNs to mix \`java.util.Date\` and \`java.sql.Date\` in one file.`,
      code: `\`\`\`java
// File: src/com/shail/bank/Account.java
package com.shail.bank;
public class Account {
    private double balance;
    public Account(double b){ this.balance = b; }
    public double getBalance(){ return balance; }
}

// File: src/com/shail/app/Main.java
package com.shail.app;
import com.shail.bank.Account;          // import by simple name
import static java.lang.System.out;     // static import

public class Main {
    public static void main(String[] args){
        Account a = new Account(1000);
        out.println(a.getBalance());     // out instead of System.out
    }
}
\`\`\``,
      mistakes: `- **\`package\` not first** — it must precede everything except comments (and \`module-info\` directives).
- **Directory ≠ package** — the folder path must match the \`package\` declaration or it won't compile/run.
- **Wildcard import expecting sub-packages** — \`import java.util.*\` does not bring in \`java.util.concurrent.*\`.
- **Ambiguous simple names** from two wildcard imports — resolve with the FQN.
- **Running with the simple name** — \`java Account\` fails; use the FQN \`java com.shail.bank.Account\`.`,
      bestPractices: `- Use **reverse-domain**, all-lowercase package names; organise by feature/layer consistently.
- Prefer **single-type imports** over wildcards for readability and to avoid clashes.
- Keep an **internal** package package-private and expose a small **api** package (pairs with §2.16).
- Let **build tools** (Maven/Gradle, Module 11) manage the source tree and the classpath.
- Consider **JPMS modules** for large systems needing enforced boundaries.`,
      interview: `**Q1. What is a package and why use one?**
A namespace grouping related types; it prevents name clashes, organises code, enables package-private access, and supports reuse/distribution.

**Q2. What is a fully-qualified name?**
Package + class name, e.g., \`java.util.ArrayList\` — the globally unique identifier of a type.

**Q3. Does \`import\` affect performance or bundle classes?**
No — it's a compile-time convenience for using simple names; nothing extra is loaded at runtime.

**Q4. Difference between a wildcard import and a static import?**
Wildcard (\`java.util.*\`) brings in a package's public types; static import (\`static Math.*\`) brings in static members so you can use them unqualified.

**Q5. Which package is imported automatically?**
\`java.lang\`.

**Q6. How do packages map to the filesystem?**
Package name = directory path under the source root; the declaration must match the folder structure.

**Q7. How do packages relate to the module system?**
Packages are namespacing only; JPMS modules (\`exports\`/\`requires\`) add enforced access boundaries across modules.`,
      exercises: `1. Create \`com.shail.util.StringUtils\` and use it from \`com.shail.app.Main\` via an import; compile with \`-d\` and run by FQN.
2. Demonstrate a name clash: use both \`java.util.Date\` and \`java.sql.Date\` in one class, resolving with FQNs.
3. Replace \`System.out.println\` and \`Math.sqrt\` calls using \`import static\`.
4. Show that \`import java.util.*\` does not make \`java.util.concurrent.ConcurrentHashMap\` available without its own import.`,
      challenges: `Lay out a small layered application's package structure (\`config\`, \`web\`, \`service\`, \`repository\`, \`model\`, \`internal\`) for a banking app. Put a public API in one package and hidden helpers in an \`internal\` package using package-private access (§2.16). Compile the whole tree with \`javac -d\` and run it by fully-qualified name. Then sketch a \`module-info.java\` that \`exports\` only the api package and explain how that strengthens the boundary beyond plain packages.`,
      summary: `- A **package** is a namespace (mapped to a directory) that groups types; FQN = package + class name.
- Packages prevent **name clashes**, organise code, enable **package-private** access (§2.16), and aid reuse.
- \`import\` is compile-time sugar for simple names; \`java.lang\` is auto-imported; static imports bring in static members.
- Use reverse-domain lowercase names; for enforced boundaries at scale, use the **module system** (\`exports\`/\`requires\`) and build tools (Module 11).`
    })
  ]
});
