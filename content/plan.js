/* =============================================================
   15-Week Study Plan — window.PLAN_WEEKS
   Each week: { week, title, moduleLabels, topics[], project, iqTopics[] }
   topic: { module, id, title, page }
   project: { id, title, phase } or null
   ============================================================= */

window.PLAN_WEEKS = [
  {
    week: 1,
    title: "Java Foundations — History, JVM & Architecture",
    moduleLabels: ["Module 01 · Java Fundamentals"],
    topics: [
      { module: "java-fundamentals", id: "introduction-to-java",    title: "Intro to Java",        page: "module-java-fundamentals.html" },
      { module: "java-fundamentals", id: "history-of-java",         title: "History of Java",      page: "module-java-fundamentals.html" },
      { module: "java-fundamentals", id: "jvm-jre-jdk",             title: "JVM / JRE / JDK",      page: "module-java-fundamentals.html" },
      { module: "java-fundamentals", id: "java-architecture",       title: "Java Architecture",    page: "module-java-fundamentals.html" },
      { module: "java-fundamentals", id: "java-compilation-process",title: "Compilation Process",  page: "module-java-fundamentals.html" },
      { module: "java-fundamentals", id: "java-syntax",             title: "Java Syntax",          page: "module-java-fundamentals.html" },
      { module: "java-fundamentals", id: "variables",               title: "Variables",            page: "module-java-fundamentals.html" },
      { module: "java-fundamentals", id: "data-types",              title: "Data Types",           page: "module-java-fundamentals.html" },
    ],
    project: null,
    iqTopics: ["JVM vs JRE vs JDK", "Platform independence", "Bytecode & ClassLoader", "Primitive vs Object types"]
  },

  {
    week: 2,
    title: "Java Foundations — Control Flow, Arrays & Methods",
    moduleLabels: ["Module 01 · Java Fundamentals"],
    topics: [
      { module: "java-fundamentals", id: "type-casting",          title: "Type Casting",         page: "module-java-fundamentals.html" },
      { module: "java-fundamentals", id: "operators",             title: "Operators",             page: "module-java-fundamentals.html" },
      { module: "java-fundamentals", id: "user-input",            title: "User Input",            page: "module-java-fundamentals.html" },
      { module: "java-fundamentals", id: "control-statements",    title: "Control Statements",    page: "module-java-fundamentals.html" },
      { module: "java-fundamentals", id: "loops",                 title: "Loops",                 page: "module-java-fundamentals.html" },
      { module: "java-fundamentals", id: "arrays",                title: "Arrays",                page: "module-java-fundamentals.html" },
      { module: "java-fundamentals", id: "methods",               title: "Methods",               page: "module-java-fundamentals.html" },
      { module: "java-fundamentals", id: "command-line-arguments",title: "Command-Line Args",     page: "module-java-fundamentals.html" },
    ],
    project: null,
    iqTopics: ["Widening vs narrowing casting", "Short-circuit operators", "for vs while vs do-while", "Pass by value vs reference"]
  },

  {
    week: 3,
    title: "OOP — Classes, Objects, Inheritance & Polymorphism",
    moduleLabels: ["Module 02 · OOP"],
    topics: [
      { module: "oop", id: "classes-and-objects", title: "Classes & Objects",    page: "module-oop.html" },
      { module: "oop", id: "constructors",         title: "Constructors",         page: "module-oop.html" },
      { module: "oop", id: "this-keyword",         title: "this keyword",         page: "module-oop.html" },
      { module: "oop", id: "static-keyword",       title: "static keyword",       page: "module-oop.html" },
      { module: "oop", id: "encapsulation",        title: "Encapsulation",        page: "module-oop.html" },
      { module: "oop", id: "inheritance",          title: "Inheritance",          page: "module-oop.html" },
      { module: "oop", id: "method-overloading",   title: "Method Overloading",   page: "module-oop.html" },
      { module: "oop", id: "method-overriding",    title: "Method Overriding",    page: "module-oop.html" },
      { module: "oop", id: "polymorphism",         title: "Polymorphism",         page: "module-oop.html" },
    ],
    project: null,
    iqTopics: ["4 pillars of OOP", "Overloading vs overriding", "Constructor chaining", "static vs instance members"]
  },

  {
    week: 4,
    title: "OOP — Abstraction, Interfaces & Relationships",
    moduleLabels: ["Module 02 · OOP"],
    topics: [
      { module: "oop", id: "abstraction",       title: "Abstraction",        page: "module-oop.html" },
      { module: "oop", id: "abstract-classes",  title: "Abstract Classes",   page: "module-oop.html" },
      { module: "oop", id: "interfaces",        title: "Interfaces",         page: "module-oop.html" },
      { module: "oop", id: "association",       title: "Association",        page: "module-oop.html" },
      { module: "oop", id: "aggregation",       title: "Aggregation",        page: "module-oop.html" },
      { module: "oop", id: "composition",       title: "Composition",        page: "module-oop.html" },
      { module: "oop", id: "access-modifiers",  title: "Access Modifiers",   page: "module-oop.html" },
      { module: "oop", id: "packages",          title: "Packages",           page: "module-oop.html" },
    ],
    project: null,
    iqTopics: ["Abstract class vs interface", "Multiple inheritance via interfaces", "IS-A vs HAS-A", "default vs protected access"]
  },

  {
    week: 5,
    title: "Strings & Exception Handling",
    moduleLabels: ["Module 03 · Strings", "Module 04 · Exceptions"],
    topics: [
      { module: "strings",    id: "string",              title: "String class",       page: "module-strings.html" },
      { module: "strings",    id: "stringbuilder",       title: "StringBuilder",       page: "module-strings.html" },
      { module: "strings",    id: "stringbuffer",        title: "StringBuffer",        page: "module-strings.html" },
      { module: "strings",    id: "string-pool",         title: "String Pool",         page: "module-strings.html" },
      { module: "strings",    id: "string-interning",    title: "String Interning",    page: "module-strings.html" },
      { module: "strings",    id: "immutable-objects",   title: "Immutable Objects",   page: "module-strings.html" },
      { module: "exceptions", id: "exception-hierarchy", title: "Exception Hierarchy", page: "module-exceptions.html" },
      { module: "exceptions", id: "checked-exceptions",  title: "Checked Exceptions",  page: "module-exceptions.html" },
      { module: "exceptions", id: "unchecked-exceptions",title: "Unchecked Exceptions",page: "module-exceptions.html" },
    ],
    project: null,
    iqTopics: ["String immutability reasons", "String vs StringBuilder vs StringBuffer", "Checked vs unchecked exceptions", "Exception hierarchy (Throwable)"]
  },

  {
    week: 6,
    title: "Exception Handling Deep-Dive & Collections Intro",
    moduleLabels: ["Module 04 · Exceptions", "Module 05 · Collections"],
    topics: [
      { module: "exceptions",  id: "try-catch",                      title: "try-catch",                   page: "module-exceptions.html" },
      { module: "exceptions",  id: "finally",                        title: "finally block",               page: "module-exceptions.html" },
      { module: "exceptions",  id: "throw",                          title: "throw keyword",               page: "module-exceptions.html" },
      { module: "exceptions",  id: "throws",                         title: "throws keyword",              page: "module-exceptions.html" },
      { module: "exceptions",  id: "custom-exceptions",              title: "Custom Exceptions",           page: "module-exceptions.html" },
      { module: "collections", id: "collection-framework-architecture",title: "Framework Architecture",   page: "module-collections.html" },
      { module: "collections", id: "arraylist",                      title: "ArrayList",                   page: "module-collections.html" },
      { module: "collections", id: "linkedlist",                     title: "LinkedList",                  page: "module-collections.html" },
    ],
    project: { id: "employee-management", title: "Employee Management System", phase: "Starts Week 6" },
    iqTopics: ["try-with-resources", "Multi-catch blocks", "Custom exception best practices", "ArrayList vs LinkedList internals"]
  },

  {
    week: 7,
    title: "Collections — Set, Queue, Map",
    moduleLabels: ["Module 05 · Collections"],
    topics: [
      { module: "collections", id: "vector",           title: "Vector",           page: "module-collections.html" },
      { module: "collections", id: "stack",            title: "Stack",            page: "module-collections.html" },
      { module: "collections", id: "hashset",          title: "HashSet",          page: "module-collections.html" },
      { module: "collections", id: "linkedhashset",    title: "LinkedHashSet",    page: "module-collections.html" },
      { module: "collections", id: "treeset",          title: "TreeSet",          page: "module-collections.html" },
      { module: "collections", id: "priorityqueue",    title: "PriorityQueue",    page: "module-collections.html" },
      { module: "collections", id: "deque",            title: "Deque",            page: "module-collections.html" },
      { module: "collections", id: "hashmap",          title: "HashMap",          page: "module-collections.html" },
      { module: "collections", id: "linkedhashmap",    title: "LinkedHashMap",    page: "module-collections.html" },
      { module: "collections", id: "treemap",          title: "TreeMap",          page: "module-collections.html" },
      { module: "collections", id: "hashtable",        title: "Hashtable",        page: "module-collections.html" },
      { module: "collections", id: "concurrenthashmap",title: "ConcurrentHashMap",page: "module-collections.html" },
    ],
    project: { id: "employee-management", title: "Employee Management System", phase: "Due end of Week 7" },
    iqTopics: ["HashMap internal hashing", "HashSet vs TreeSet vs LinkedHashSet", "Comparable vs Comparator", "HashMap vs ConcurrentHashMap"]
  },

  {
    week: 8,
    title: "Generics & Java 8 — Functional Interfaces",
    moduleLabels: ["Module 06 · Generics", "Module 07 · Java 8"],
    topics: [
      { module: "generics", id: "generic-classes",                title: "Generic Classes",       page: "module-generics.html" },
      { module: "generics", id: "generic-methods",                title: "Generic Methods",       page: "module-generics.html" },
      { module: "generics", id: "wildcards",                      title: "Wildcards",             page: "module-generics.html" },
      { module: "generics", id: "bounded-types",                  title: "Bounded Types",         page: "module-generics.html" },
      { module: "java8",    id: "functional-interfaces-overview",  title: "Functional Interfaces", page: "module-java8.html" },
      { module: "java8",    id: "predicate",                       title: "Predicate",             page: "module-java8.html" },
      { module: "java8",    id: "consumer",                        title: "Consumer",              page: "module-java8.html" },
      { module: "java8",    id: "supplier",                        title: "Supplier",              page: "module-java8.html" },
    ],
    project: { id: "student-grade-tracker", title: "Student Grade Tracker", phase: "Starts Week 8" },
    iqTopics: ["Type erasure in generics", "Wildcard vs bounded type", "Predicate vs Function vs Consumer", "@FunctionalInterface contract"]
  },

  {
    week: 9,
    title: "Java 8 — Lambdas, Streams & Optional",
    moduleLabels: ["Module 07 · Java 8"],
    topics: [
      { module: "java8", id: "function",                      title: "Function",                  page: "module-java8.html" },
      { module: "java8", id: "bifunction",                    title: "BiFunction",                page: "module-java8.html" },
      { module: "java8", id: "unaryoperator",                 title: "UnaryOperator",             page: "module-java8.html" },
      { module: "java8", id: "binaryoperator",                title: "BinaryOperator",            page: "module-java8.html" },
      { module: "java8", id: "lambda-expressions",            title: "Lambda Expressions",        page: "module-java8.html" },
      { module: "java8", id: "method-references",             title: "Method References",         page: "module-java8.html" },
      { module: "java8", id: "streams-api",                   title: "Streams API",               page: "module-java8.html" },
      { module: "java8", id: "stream-operations",             title: "Stream Operations",         page: "module-java8.html" },
      { module: "java8", id: "collectors",                    title: "Collectors",                page: "module-java8.html" },
      { module: "java8", id: "optional",                      title: "Optional",                  page: "module-java8.html" },
      { module: "java8", id: "default-methods",               title: "Default Methods",           page: "module-java8.html" },
      { module: "java8", id: "static-methods-in-interfaces",  title: "Static Interface Methods",  page: "module-java8.html" },
      { module: "java8", id: "date-and-time-api",             title: "Date & Time API",           page: "module-java8.html" },
    ],
    project: { id: "student-grade-tracker", title: "Student Grade Tracker", phase: "Due end of Week 9" },
    iqTopics: ["Lambda syntax & scope", "Stream intermediate vs terminal ops", "Optional anti-patterns", "forEach vs map vs filter"]
  },

  {
    week: 10,
    title: "Concurrency — Threads, Locks & CompletableFuture",
    moduleLabels: ["Module 08 · Concurrency"],
    topics: [
      { module: "concurrency", id: "threads",               title: "Threads",                page: "module-concurrency.html" },
      { module: "concurrency", id: "thread-lifecycle",      title: "Thread Lifecycle",        page: "module-concurrency.html" },
      { module: "concurrency", id: "runnable",              title: "Runnable",                page: "module-concurrency.html" },
      { module: "concurrency", id: "callable",              title: "Callable",                page: "module-concurrency.html" },
      { module: "concurrency", id: "executor-framework",    title: "Executor Framework",      page: "module-concurrency.html" },
      { module: "concurrency", id: "synchronization",       title: "Synchronization",         page: "module-concurrency.html" },
      { module: "concurrency", id: "volatile",              title: "volatile keyword",        page: "module-concurrency.html" },
      { module: "concurrency", id: "atomic-classes",        title: "Atomic Classes",          page: "module-concurrency.html" },
      { module: "concurrency", id: "locks",                 title: "Locks (ReentrantLock)",   page: "module-concurrency.html" },
      { module: "concurrency", id: "concurrent-collections",title: "Concurrent Collections",  page: "module-concurrency.html" },
      { module: "concurrency", id: "completablefuture",     title: "CompletableFuture",       page: "module-concurrency.html" },
    ],
    project: { id: "library-management", title: "Library Management System", phase: "Starts Week 10" },
    iqTopics: ["Thread vs Runnable", "synchronized vs ReentrantLock", "volatile vs atomic", "Deadlock, livelock, starvation", "ExecutorService thread pool types"]
  },

  {
    week: 11,
    title: "I/O Streams, Serialization & JDBC",
    moduleLabels: ["Module 09 · I/O", "Module 10 · JDBC"],
    topics: [
      { module: "io",   id: "file-class",        title: "File class",        page: "module-io.html" },
      { module: "io",   id: "bufferedreader",     title: "BufferedReader",    page: "module-io.html" },
      { module: "io",   id: "bufferedwriter",     title: "BufferedWriter",    page: "module-io.html" },
      { module: "io",   id: "serialization",      title: "Serialization",     page: "module-io.html" },
      { module: "io",   id: "deserialization",    title: "Deserialization",   page: "module-io.html" },
      { module: "io",   id: "nio",                title: "NIO (java.nio)",    page: "module-io.html" },
      { module: "jdbc", id: "jdbc-architecture",  title: "JDBC Architecture", page: "module-jdbc.html" },
      { module: "jdbc", id: "connection",         title: "Connection",        page: "module-jdbc.html" },
      { module: "jdbc", id: "statement",          title: "Statement",         page: "module-jdbc.html" },
      { module: "jdbc", id: "preparedstatement",  title: "PreparedStatement", page: "module-jdbc.html" },
      { module: "jdbc", id: "resultset",          title: "ResultSet",         page: "module-jdbc.html" },
      { module: "jdbc", id: "transactions",       title: "Transactions",      page: "module-jdbc.html" },
      { module: "jdbc", id: "batch-processing",   title: "Batch Processing",  page: "module-jdbc.html" },
    ],
    project: { id: "library-management", title: "Library Management System", phase: "Due end of Week 11" },
    iqTopics: ["Serializable & serialVersionUID", "NIO vs IO", "Statement vs PreparedStatement (SQL injection)", "JDBC transaction isolation levels"]
  },

  {
    week: 12,
    title: "Dev Tools, SOLID Principles & Clean Code",
    moduleLabels: ["Module 11 · Tools", "Module 12 · Design Principles"],
    topics: [
      { module: "tools",              id: "intellij-idea-mastery", title: "IntelliJ IDEA",     page: "module-tools.html" },
      { module: "tools",              id: "maven",                  title: "Maven",              page: "module-tools.html" },
      { module: "tools",              id: "gradle",                 title: "Gradle",             page: "module-tools.html" },
      { module: "tools",              id: "git-and-github",         title: "Git & GitHub",       page: "module-tools.html" },
      { module: "design-principles",  id: "solid-principles",       title: "SOLID Principles",   page: "module-design-principles.html" },
      { module: "design-principles",  id: "dry",                    title: "DRY",                page: "module-design-principles.html" },
      { module: "design-principles",  id: "kiss",                   title: "KISS",               page: "module-design-principles.html" },
      { module: "design-principles",  id: "yagni",                  title: "YAGNI",              page: "module-design-principles.html" },
      { module: "design-principles",  id: "clean-code",             title: "Clean Code",         page: "module-design-principles.html" },
    ],
    project: { id: "banking-application", title: "Banking Application", phase: "Starts Week 12" },
    iqTopics: ["SOLID principles with examples", "Maven vs Gradle", "Git branching strategies", "Code smell examples"]
  },

  {
    week: 13,
    title: "Design Patterns — Creational, Structural & Behavioural",
    moduleLabels: ["Module 13 · Design Patterns"],
    topics: [
      { module: "design-patterns", id: "singleton",  title: "Singleton",  page: "module-design-patterns.html" },
      { module: "design-patterns", id: "factory",    title: "Factory",    page: "module-design-patterns.html" },
      { module: "design-patterns", id: "builder",    title: "Builder",    page: "module-design-patterns.html" },
      { module: "design-patterns", id: "strategy",   title: "Strategy",   page: "module-design-patterns.html" },
      { module: "design-patterns", id: "observer",   title: "Observer",   page: "module-design-patterns.html" },
      { module: "design-patterns", id: "adapter",    title: "Adapter",    page: "module-design-patterns.html" },
      { module: "design-patterns", id: "decorator",  title: "Decorator",  page: "module-design-patterns.html" },
    ],
    project: { id: "banking-application", title: "Banking Application", phase: "Due end of Week 13" },
    iqTopics: ["Singleton thread-safety", "Factory vs Abstract Factory", "Observer vs Event Listener", "Which pattern for open/closed principle?"]
  },

  {
    week: 14,
    title: "DSA — Arrays, Strings, LinkedList & Linear Structures",
    moduleLabels: ["Module 14 · DSA"],
    topics: [
      { module: "dsa", id: "arrays",      title: "Arrays",       page: "module-dsa.html" },
      { module: "dsa", id: "strings",     title: "Strings",      page: "module-dsa.html" },
      { module: "dsa", id: "linked-list", title: "Linked List",  page: "module-dsa.html" },
      { module: "dsa", id: "stack",       title: "Stack",        page: "module-dsa.html" },
      { module: "dsa", id: "queue",       title: "Queue",        page: "module-dsa.html" },
      { module: "dsa", id: "hashing",     title: "Hashing",      page: "module-dsa.html" },
      { module: "dsa", id: "recursion",   title: "Recursion",    page: "module-dsa.html" },
    ],
    project: { id: "capstone-project", title: "Capstone: Full Console App", phase: "Starts Week 14" },
    iqTopics: ["Two-pointer technique", "Reverse a linked list", "Detect cycle in linked list", "Stack using queues & vice versa", "HashMap collision handling"]
  },

  {
    week: 15,
    title: "DSA Sprint, Trees, Graphs & Mock Interviews",
    moduleLabels: ["Module 14 · DSA", "Interview Sprint"],
    topics: [
      { module: "dsa", id: "trees",     title: "Trees",     page: "module-dsa.html" },
      { module: "dsa", id: "bst",       title: "BST",       page: "module-dsa.html" },
      { module: "dsa", id: "heaps",     title: "Heaps",     page: "module-dsa.html" },
      { module: "dsa", id: "graphs",    title: "Graphs",    page: "module-dsa.html" },
      { module: "dsa", id: "sorting",   title: "Sorting",   page: "module-dsa.html" },
      { module: "dsa", id: "searching", title: "Searching", page: "module-dsa.html" },
    ],
    project: { id: "capstone-project", title: "Capstone: Full Console App", phase: "Due end of Week 15" },
    iqTopics: ["BFS vs DFS", "Binary search variants", "Heap sort vs merge sort", "Graph cycle detection", "Full mock interview × 2"]
  }
];
