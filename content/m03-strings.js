/* Module 3: String Handling — edit ONLY this file for this module's content.
   Authored at ~2x Module 2 depth, ordered BASIC -> ADVANCED:
     3.1 String basics -> 3.2 methods -> 3.3 comparison -> 3.4 immutability
     -> 3.5 pool -> 3.6 interning -> 3.7 StringBuilder -> 3.8 StringBuffer
     -> 3.9 formatting/conversion -> 3.10 regex -> 3.11 text blocks/modern API
     -> 3.12 performance & best practices.
   Each topic() renders sections in declared order; see assets/site.js PART_LABELS. */
registerModule({
  id: "strings",
  module: "String Handling",
  page: "module-strings.html",
  icon: "🔤",
  tagline: "From your first literal to regex, the string pool, and performance tuning.",
  lessons: [

    /* ===================== BASIC ===================== */

    /* 3.1 String — what a String is, how it is created, and how text is stored. */
    topic({
      id: "string", chapter: "3.1", title: "String — The Basics",
      subtitle: "What a String really is, the two ways to create one, and how text is stored.",
      readTime: "16 min", level: "Foundational", deep: true,
      objectives: [
        "Define \`String\` as an immutable object (not a primitive) and use string literals.",
        "Distinguish literal creation from \`new String(...)\` and know why it matters.",
        "Explain how Java stores characters (UTF-16, and compact strings since Java 9).",
        "Read and reason about \`char\`, code points, and escape sequences."
      ],
      concept: `A **\`String\`** in Java is an **object** of the class \`java.lang.String\` that represents a **sequence of characters**. Despite feeling like a built-in type, \`String\` is **not a primitive** — it's a reference type with a rich API. Two things make it special: it is **immutable** (its contents never change after creation — §3.4) and it has **language-level support** (you can write a literal in double quotes and use \`+\` to concatenate).

\`\`\`java
String greeting = "Hello";          // a String literal
String name     = "Shail";
String message  = greeting + ", " + name + "!";   // "Hello, Shail!"
\`\`\`

This is the foundation. Everything else in this module — comparison (§3.3), the string pool (§3.5), builders (§3.7) — builds on these two facts: *String is an object*, and *String is immutable*.`,
      why: `Strings are the most-used reference type in Java — every program reads input, builds messages, parses data, and writes output as text. Java's designers gave \`String\` special treatment because:

- **Ubiquity** — text is everywhere, so concise literal syntax (\`"..."\`) and \`+\` concatenation improve readability.
- **Safety & sharing** — immutability lets the JVM safely cache and share string literals (§3.5), which saves memory.
- **Reliability** — an immutable \`String\` is inherently **thread-safe** and a dependable hash-map key (§3.4).

Mastering strings is also non-negotiable for interviews: \`==\` vs \`equals\` (§3.3) and the string pool (§3.5) are among the most-asked Java questions at TCS, Infosys, Accenture, and product companies.`,
      creation: `There are **two** ways to create a string, and the difference is a classic interview point:

\`\`\`java
String a = "Java";              // 1) String literal  -> goes in the String Pool (§3.5)
String b = new String("Java");  // 2) new keyword     -> a NEW object on the heap, every time
\`\`\`

- The **literal** form asks the JVM to reuse a pooled instance if the same text already exists (memory-efficient).
- The **\`new\`** form **always** allocates a brand-new object on the heap, even if an identical string is already pooled — generally **wasteful**, so prefer literals.

This is exactly why \`a == b\` can be \`false\` even when the text is equal — they're different objects. Reference vs content comparison is the subject of §3.3; pooling is §3.5.`,
      internal: `**How characters are stored** (a deeper-than-usual look that impresses interviewers):

- A \`String\` wraps an internal array. **Before Java 9** it was a \`char[]\` where each \`char\` is **16 bits (UTF-16)**.
- **Since Java 9 (JEP 254, "Compact Strings")** the backing field is a \`byte[]\` plus a \`coder\` flag: strings that contain only **Latin-1** characters use **1 byte per char**, halving memory for the common case; strings with non-Latin-1 characters use 2 bytes (UTF-16). This change cut heap usage significantly in real applications without changing the API.
- A Java \`char\` is a single UTF-16 **code unit**. Characters outside the Basic Multilingual Plane (e.g., many emoji) are **two** chars (a *surrogate pair*) — so \`"😀".length()\` is **2**, not 1. Use **code points** (\`codePointAt\`, \`codePointCount\`) for correct counting.

\`\`\`java
String s = "AB";   // internally (Java 9+): byte[] {65, 66}, coder = LATIN1
String e = "😀";   // length() == 2 (surrogate pair); e.codePointCount(0, e.length()) == 1
\`\`\``,
      escapes: `String literals support **escape sequences** for characters you can't type directly:

| Escape | Meaning |
|---|---|
| \`\\n\` | newline |
| \`\\t\` | tab |
| \`\\"\` | double quote |
| \`\\\\\` | backslash |
| \`\\'\` | single quote |
| \`\\uXXXX\` | Unicode code unit (hex) |

\`\`\`java
String path  = "C:\\\\Users\\\\Shail";   // backslashes escaped
String quote = "She said \\"Hi\\"";       // embedded quotes
String tab   = "Name:\\tShail";          // tab between
String heart = "\\u2764";                 // ❤
\`\`\`

For long multi-line text (JSON, SQL, HTML) without escaping every quote, Java 15+ **text blocks** (\`"""..."""\`) are far cleaner — covered in §3.11.`,
      code: `\`\`\`java
public class StringBasics {
    public static void main(String[] args) {
        String s = "Hello, World";

        System.out.println(s.length());        // 12
        System.out.println(s.charAt(0));       // H
        System.out.println(s.toUpperCase());   // HELLO, WORLD  (returns a NEW string)
        System.out.println(s);                 // Hello, World  (original UNCHANGED — immutable)

        // concatenation
        String full = "Java" + " " + "Mastery";
        System.out.println(full);              // Java Mastery

        // a String is an object: it has methods and can be null
        String empty = "";                     // length 0, NOT null
        String missing = null;                 // no object at all
        System.out.println(empty.isEmpty());   // true
        // System.out.println(missing.length()); // NullPointerException
    }
}
\`\`\`

Notice \`toUpperCase()\` returns a **new** string and leaves \`s\` unchanged — the practical face of immutability (§3.4).`,
      mistakes: `- **Thinking \`String\` is a primitive** — it's an object; it can be \`null\` and has methods.
- **Confusing \`""\` (empty string) with \`null\`** — \`""\` is a valid object of length 0; \`null\` is no object (calling a method on it throws \`NullPointerException\`).
- **Using \`new String("...")\`** out of habit — wastes memory; use the literal.
- **Assuming \`length()\` counts visible characters** — it counts UTF-16 code units, so emoji/surrogate pairs count as 2.
- **Forgetting to escape backslashes** in Windows paths or regex strings.`,
      bestPractices: `- Prefer **string literals** over \`new String(...)\`.
- Treat strings as **immutable values**; capture the *returned* string from methods (\`s = s.trim();\`).
- Guard against \`null\` before calling methods, or use \`Objects.requireNonNull\` / \`Optional\`.
- Use **text blocks** (§3.11) for multi-line text instead of \`\\n\`-laden literals.
- For heavy concatenation in loops, use a **\`StringBuilder\`** (§3.7) — explained there.`,
      interview: `**Q1. Is \`String\` a primitive or an object?**
An object (\`java.lang.String\`) — a reference type with special literal/operator support, not a primitive.

**Q2. Difference between \`String s = "a"\` and \`new String("a")\`?**
The literal uses the string pool (reuses a shared instance); \`new\` always creates a separate heap object. Hence \`==\` may differ (§3.3, §3.5).

**Q3. How are strings stored internally?**
As a backing array — \`char[]\` before Java 9, \`byte[]\` + coder flag since Java 9 (Compact Strings), using Latin-1 (1 byte) or UTF-16 (2 bytes) per character.

**Q4. What is \`"😀".length()\` and why?**
2 — it's a surrogate pair of UTF-16 code units; \`length()\` counts code units, not visible characters.

**Q5. Difference between \`null\`, \`""\`, and \`" "\`?**
\`null\` = no object; \`""\` = empty string (length 0); \`" "\` = a string containing one space (length 1).

**Q6. Why is \`String\` immutable? (preview)**
For security, caching/pooling, thread-safety, and reliable hashing — detailed in §3.4.`,
      exercises: `1. Create the same text two ways (literal and \`new String\`), print both, and (after reading §3.3) compare them with \`==\` and \`equals\`.
2. Print \`length()\`, \`charAt(2)\`, \`toUpperCase()\`, and the original string to confirm the original is unchanged.
3. Build a Windows file path string with escaped backslashes and a string containing embedded double quotes.
4. Print \`"hello".length()\` vs \`"😀".length()\` and explain the difference using code units/code points.`,
      challenges: `Write a method \`int realLength(String s)\` that returns the number of *visible* characters (code points), so that \`realLength("😀ab")\` returns 3 while \`"😀ab".length()\` returns 4. Use \`codePointCount\`. Then explain, in two sentences, how Compact Strings (Java 9) would store \`"ab"\` versus \`"😀ab"\` differently (coder flag + byte layout).`,
      summary: `- A **\`String\`** is an immutable **object** (\`java.lang.String\`), not a primitive, with literal (\`"..."\`) and \`+\` support.
- **Literal** creation pools/reuses; **\`new String(...)\`** always makes a new heap object (prefer literals).
- Stored as a backing array — \`byte[]\` + coder since **Java 9 (Compact Strings)**; \`char\` is a UTF-16 code unit (emoji = 2).
- Immutability means methods return **new** strings; \`""\` ≠ \`null\`. Comparison is **§3.3**, pooling is **§3.5**, immutability deep-dive is **§3.4**.`
    }),

    /* 3.2 String Methods & Operations — the working toolkit. */
    topic({
      id: "string-methods", chapter: "3.2", title: "String Methods & Operations",
      subtitle: "The everyday toolkit: searching, slicing, splitting, and transforming text.",
      readTime: "18 min", level: "Beginner", deep: true,
      objectives: [
        "Use the core inspection methods (\`length\`, \`charAt\`, \`indexOf\`, \`contains\`).",
        "Extract and transform text with \`substring\`, \`replace\`, \`split\`, \`trim\`/\`strip\`, case methods.",
        "Understand that every method returns a NEW string (immutability in action).",
        "Avoid the common off-by-one and \`split\` pitfalls."
      ],
      concept: `\`String\` ships with a large, well-designed API. Because strings are **immutable** (§3.4), **none of these methods mutate the string** — each returns a **new** string (or a primitive/boolean). You must capture the result:

\`\`\`java
String s = "  Hello  ";
s.trim();              // result THROWN AWAY — s is still "  Hello  "
s = s.trim();          // correct: s is now "Hello"
\`\`\`

Think of every transforming method as "give me a *new* string based on this one."`,
      categories: `The toolkit, grouped by purpose:

**Inspect / search**

| Method | Returns | Example → result |
|---|---|---|
| \`length()\` | int | \`"abc".length()\` → 3 |
| \`charAt(i)\` | char | \`"abc".charAt(1)\` → 'b' |
| \`indexOf(x)\` | int (or -1) | \`"banana".indexOf("an")\` → 1 |
| \`lastIndexOf(x)\` | int | \`"banana".lastIndexOf("a")\` → 5 |
| \`contains(cs)\` | boolean | \`"hello".contains("ell")\` → true |
| \`startsWith\`/\`endsWith\` | boolean | \`"file.txt".endsWith(".txt")\` → true |
| \`isEmpty()\` / \`isBlank()\` | boolean | \`"  ".isBlank()\` → true (Java 11) |

**Extract / slice**

| Method | Result |
|---|---|
| \`substring(2)\` | from index 2 to end |
| \`substring(1, 4)\` | indices 1..3 (end **exclusive**) |
| \`split(regex)\` | \`String[]\` (regex! see mistakes) |
| \`toCharArray()\` | \`char[]\` |

**Transform (returns new string)**

| Method | Result |
|---|---|
| \`toUpperCase\`/\`toLowerCase\` | case-folded copy |
| \`trim()\` / \`strip()\` | whitespace removed (strip is Unicode-aware, Java 11) |
| \`replace(a, b)\` | all literal occurrences replaced |
| \`replaceAll(regex, b)\` | regex replacement (§3.10) |
| \`concat(s)\` | like \`+\` |
| \`repeat(n)\` | n copies (Java 11) |
| \`join(delim, parts...)\` | static; joins with a delimiter |`,
      internal: `A few mechanics worth knowing:

- **\`substring\`** returns a new \`String\` backed by its **own** char/byte array. (Pre–Java 7u6 it *shared* the parent's array, which could leak memory by keeping a huge string alive — fixed long ago, but a known historical interview trivia.)
- **Indices are 0-based**, and end indices are **exclusive**: \`substring(1, 4)\` yields characters at 1, 2, 3.
- **\`indexOf\`/\`contains\`** do a linear scan — O(n·m) in the worst case (n = text length, m = pattern). For repeated complex matching, compile a regex \`Pattern\` once (§3.10).
- **\`==\` does not compare content** — use \`equals\` (§3.3). Methods like \`indexOf(String)\` compare content correctly.`,
      useCases: `- **Parsing input**: \`split(",")\` a CSV line, \`trim()\` user input, \`toLowerCase()\` for case-insensitive checks.
- **Validation**: \`isBlank()\`, \`startsWith("https://")\`, \`matches(...)\` (regex, §3.10).
- **Formatting/building**: \`join\`, \`repeat\`, \`replace\`.
- **Slicing tokens**: file extensions (\`substring(lastIndexOf('.') )\`), prefixes, fixed-width fields.`,
      code: `\`\`\`java
public class StringMethods {
    public static void main(String[] args) {
        String csv = "  shail,asha,ravi  ";

        // clean then split
        String[] names = csv.strip().split(",");      // ["shail","asha","ravi"]
        System.out.println(names.length);             // 3

        for (String n : names) {
            String pretty = Character.toUpperCase(n.charAt(0)) + n.substring(1);
            System.out.println(pretty);               // Shail / Asha / Ravi
        }

        String file = "report.final.pdf";
        String ext = file.substring(file.lastIndexOf('.') + 1);  // "pdf"
        System.out.println(ext);

        System.out.println(String.join(" | ", names)); // shail | asha | ravi
        System.out.println("=".repeat(10));            // ==========
        System.out.println("Hello".replace('l', 'L')); // HeLLo
    }
}
\`\`\``,
      mistakes: `- **Ignoring the return value** — \`s.toUpperCase();\` does nothing useful; assign it back.
- **\`split\` takes a *regex*, not a literal** — \`"a.b.c".split(".")\` returns an empty array because \`.\` matches any char. Use \`split("\\\\.")\` or \`Pattern.quote(".")\`.
- **\`split\` drops trailing empty strings** by default — \`"a,,".split(",")\` → \`["a"]\`; pass a negative limit (\`split(",", -1)\`) to keep them.
- **\`substring\` bounds** — \`substring(begin, end)\` with \`end > length()\` or \`begin > end\` throws \`StringIndexOutOfBoundsException\`; remember end is exclusive.
- **\`replace\` vs \`replaceAll\`** — \`replace\` is literal; \`replaceAll\` is regex (so special chars matter).
- **Locale surprises** in \`toUpperCase()\` — e.g., Turkish 'i'; pass a \`Locale\` for locale-sensitive text.`,
      bestPractices: `- Always **reassign** the result of transforming methods.
- Prefer **\`strip()\`** over \`trim()\` for Unicode-correct whitespace (Java 11+).
- Use **\`isBlank()\`** to detect whitespace-only input; **\`isEmpty()\`** only checks length 0.
- For \`split\` on a literal char, escape it or use \`Pattern.quote\`; pass \`limit = -1\` when trailing empties matter.
- Chain readably, but for many concatenations in a loop switch to **\`StringBuilder\`** (§3.7).`,
      interview: `**Q1. Do String methods modify the original string?**
No — strings are immutable; methods return new strings (or primitives). You must capture the result.

**Q2. Difference between \`replace\` and \`replaceAll\`?**
\`replace\` replaces literal char/CharSequence occurrences; \`replaceAll\` takes a **regex** pattern.

**Q3. What does \`split\` take as its argument?**
A **regular expression**, not a literal — so \`split(".")\` won't split on a dot literally.

**Q4. \`substring(1, 4)\` returns which characters?**
Indices 1, 2, 3 — the end index is exclusive.

**Q5. \`trim()\` vs \`strip()\`?**
\`trim()\` removes chars ≤ U+0020; \`strip()\` (Java 11) is Unicode-whitespace aware (also \`stripLeading\`/\`stripTrailing\`).

**Q6. \`isEmpty()\` vs \`isBlank()\`?**
\`isEmpty()\` is true only for length 0; \`isBlank()\` (Java 11) is true for empty or whitespace-only strings.

**Q7. Why can repeated \`indexOf\`/regex be slow, and what's the fix?**
They scan linearly / recompile patterns; precompile a \`Pattern\` (§3.10) for reuse.`,
      exercises: `1. Given \`"name=Shail;role=admin;city=Pune"\`, parse it into key/value pairs using \`split(";")\` then \`split("=")\`.
2. Demonstrate the \`split(".")\` trap and fix it with \`split("\\\\.")\`.
3. Write \`capitalize(String)\` that upper-cases the first letter and lower-cases the rest using \`substring\`.
4. Use \`String.join\`, \`repeat\`, and \`strip\` to print a simple formatted banner.
5. Show that \`"a,,".split(",")\` and \`"a,,".split(",", -1)\` differ.`,
      challenges: `Implement a tiny CSV line parser \`Map<String,String> parse(String line)\` for input like \`"k1=v1, k2=v2 , k3=v3"\` that strips whitespace around keys/values and ignores empty segments. Then write a \`String slugify(String)\` that lowercases, strips, and replaces runs of non-alphanumeric characters with a single hyphen (use \`replaceAll\` + regex, previewing §3.10). Discuss the time complexity of your approach.`,
      summary: `- The \`String\` API is rich but **non-mutating** — capture returned values.
- Know inspect (\`indexOf\`, \`contains\`, \`isBlank\`), slice (\`substring\` end-exclusive, \`split\`), and transform (\`replace\`, \`strip\`, \`repeat\`, \`join\`).
- **\`split\`/\`replaceAll\` take regex** (escape literals); \`split\` drops trailing empties unless \`limit < 0\`.
- Prefer \`strip\`/\`isBlank\` (Java 11); switch to **\`StringBuilder\` (§3.7)** for loop concatenation; comparison is **§3.3**.`
    }),

    /* 3.3 String Comparison — == vs equals, compareTo, hashCode. */
    topic({
      id: "string-comparison", chapter: "3.3", title: "String Comparison",
      subtitle: "== vs equals vs compareTo — the most-asked Java interview topic.",
      readTime: "16 min", level: "Core", deep: true,
      objectives: [
        "Explain the difference between \`==\` (reference) and \`equals\` (content).",
        "Use \`equalsIgnoreCase\`, \`compareTo\`, and \`compareToIgnoreCase\` correctly.",
        "Predict \`==\` results for literals vs \`new\` strings using the pool (§3.5).",
        "Write null-safe comparisons and understand \`hashCode\`'s role."
      ],
      concept: `Comparing strings has two distinct meanings, and conflating them is the #1 Java beginner bug:

- **\`==\`** compares **references** — "are these the *same object* in memory?"
- **\`.equals()\`** compares **content** — "do these have the *same characters*?"

\`\`\`java
String a = "Java";
String b = "Java";
String c = new String("Java");

System.out.println(a == b);        // true  — both point to the SAME pooled literal (§3.5)
System.out.println(a == c);        // false — c is a separate heap object
System.out.println(a.equals(c));   // true  — same characters
\`\`\`

**Rule: compare string content with \`equals\`, never \`==\`.** The \`==\` result depends on pooling and is almost never what you want.`,
      why: `Why does \`==\` sometimes return \`true\` for strings? Because of the **string pool** (§3.5): identical **literals** are interned into one shared object, so \`a == b\` is \`true\`. But the moment a string comes from \`new\`, user input, a file, concatenation of variables, or a method, it's typically a **different object** — and \`==\` becomes \`false\` even when the text matches. Relying on \`==\` produces bugs that "work on my machine" with literals and fail with real data.`,
      methods: `The comparison toolkit:

| Method | Compares | Returns | Note |
|---|---|---|---|
| \`==\` | reference identity | boolean | **not** for content |
| \`equals(Object)\` | content (case-sensitive) | boolean | the correct default |
| \`equalsIgnoreCase(String)\` | content, case-insensitive | boolean | |
| \`compareTo(String)\` | lexicographic order | int (<0, 0, >0) | from \`Comparable\` |
| \`compareToIgnoreCase\` | order, case-insensitive | int | |
| \`hashCode()\` | hash of content | int | consistent with \`equals\` |

\`\`\`java
"apple".compareTo("banana"); // negative — "apple" sorts first
"abc".compareTo("abc");      // 0 — equal
"banana".compareTo("apple"); // positive
\`\`\`

\`compareTo\` returns the difference that lets \`Collections.sort\`/\`TreeSet\` order strings; \`equals\`/\`compareTo\` being consistent is what makes strings safe in sorted and hashed collections (Module 5).`,
      internal: `**How \`equals\` works** (and why it's reliable): \`String.equals\` first checks reference identity (a fast path), then verifies both are \`String\`, then compares length, then characters one by one. **How \`hashCode\` works**: \`String\` caches a hashcode computed as \`s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]\`. The cache means repeated hashing (e.g., as a \`HashMap\` key) is cheap, and immutability (§3.4) guarantees the cached value stays valid — a key reason \`String\` is the canonical map key.

\`equals\` and \`hashCode\` obey the contract (Module 2 §2.8, Module 3 §3.4): equal strings always have equal hash codes, so \`HashMap\`/\`HashSet\` lookups by string work correctly.`,
      nullSafety: `**Null-safe comparison** is a best-practice pattern:

\`\`\`java
String input = maybeNull();

// risky: NPE if input is null
// if (input.equals("yes")) ...

// safe: call equals on the known-non-null literal
if ("yes".equals(input)) { /* ... */ }

// or use Objects.equals (handles both null)
if (java.util.Objects.equals(input, "yes")) { /* ... */ }
\`\`\`

Putting the **literal first** (\`"yes".equals(input)\`) is the classic *Yoda condition* that avoids \`NullPointerException\`.`,
      code: `\`\`\`java
import java.util.*;

public class Compare {
    public static void main(String[] args) {
        String a = "Java", b = "Java", c = new String("Java");

        System.out.println(a == b);              // true  (pooled)
        System.out.println(a == c);              // false (different object)
        System.out.println(a == c.intern());     // true  (intern -> pool, §3.6)
        System.out.println(a.equals(c));         // true  (content)
        System.out.println("JAVA".equalsIgnoreCase(a)); // true

        // ordering
        List<String> words = new ArrayList<>(List.of("banana", "apple", "cherry"));
        Collections.sort(words);                 // uses compareTo
        System.out.println(words);               // [apple, banana, cherry]

        // null-safe
        String input = null;
        System.out.println("yes".equals(input)); // false, no NPE
    }
}
\`\`\``,
      mistakes: `- **Using \`==\` to compare content** — the cardinal sin; works by luck with literals, fails with \`new\`/input/concatenation.
- **Calling \`equals\` on a possibly-null reference** — \`input.equals("x")\` throws NPE; use \`"x".equals(input)\` or \`Objects.equals\`.
- **Assuming \`compareTo\` returns -1/0/1** — it returns *any* negative/zero/positive int; test the sign, not the exact value.
- **Case-sensitivity surprises** — \`"A".equals("a")\` is false; use \`equalsIgnoreCase\`.
- **Mixing \`equals\` and \`==\` in collections** — \`HashMap\`/\`HashSet\` rely on \`equals\`+\`hashCode\`, not \`==\`.`,
      bestPractices: `- **Always use \`equals\`** (or \`equalsIgnoreCase\`) for content comparison; reserve \`==\` for the rare "same object" question.
- Use **\`"literal".equals(var)\`** or **\`Objects.equals(a, b)\`** for null safety.
- For ordering/sorting, use \`compareTo\` (or a \`Comparator\`, Module 5/7), testing the **sign**.
- Don't depend on pool behavior for correctness — call \`intern()\` only as a deliberate memory optimization (§3.6).
- Keep \`equals\`/\`hashCode\` consistent in your own classes (Module 2 §2.8).`,
      interview: `**Q1. Difference between \`==\` and \`equals()\` for strings?**
\`==\` compares references (same object); \`equals\` compares character content. Use \`equals\` for content.

**Q2. \`String a = "x"; String b = new String("x");\` — what are \`a == b\` and \`a.equals(b)\`?**
\`a == b\` is false (different objects); \`a.equals(b)\` is true (same content).

**Q3. Why might \`a == b\` be true for two literals?**
Both refer to the same interned object in the string pool (§3.5).

**Q4. How do you compare strings ignoring case?**
\`equalsIgnoreCase\` for equality; \`compareToIgnoreCase\` for ordering.

**Q5. What does \`compareTo\` return?**
A negative, zero, or positive int indicating lexicographic order — test the sign, not a specific value.

**Q6. How do you avoid NPE when comparing?**
Put the literal first (\`"x".equals(var)\`) or use \`Objects.equals(a, b)\`.

**Q7. Why is consistent \`equals\`/\`hashCode\` important for strings?**
So strings behave correctly as \`HashMap\`/\`HashSet\` keys; equal strings must share a hash code.`,
      exercises: `1. Reproduce \`a == b\` true (literals) and \`a == c\` false (\`new\`), then make all comparisons true using \`equals\`.
2. Use \`intern()\` (preview §3.6) to make \`a == c.intern()\` true and explain why.
3. Sort a list of mixed-case words with \`compareTo\` and again with \`compareToIgnoreCase\`; compare results.
4. Write a null-safe equality check three different ways and test each with a null input.`,
      challenges: `Build a case-insensitive, null-safe \`Set<String>\`-like membership check without using a real \`Set\`: write \`boolean containsIgnoreCase(List<String> list, String target)\` that handles \`null\` elements and target gracefully. Then explain why using \`==\` inside it would be a bug, and how \`HashSet<String>\` relies on \`equals\`+\`hashCode\` (not \`==\`) to do the same job in O(1) (links to Module 5).`,
      summary: `- **\`==\` compares references; \`equals\` compares content** — always use \`equals\` for text.
- \`==\` may be true for **pooled literals** (§3.5) but false for \`new\`/input/concatenation — don't rely on it.
- Use \`equalsIgnoreCase\` and \`compareTo\`/\`compareToIgnoreCase\` (sign-based) for case-insensitive and ordering.
- Be **null-safe** (\`"x".equals(v)\`, \`Objects.equals\`); consistent \`equals\`/\`hashCode\` makes strings reliable map keys.
- Pooling/interning details: **§3.5/§3.6**; immutability that guarantees a stable hash: **§3.4**.`
    }),

    /* ===================== CORE ===================== */

    /* 3.4 Immutability — why String can't change, and how to build your own immutable class. */
    topic({
      id: "immutable-objects", chapter: "3.4", title: "String Immutability & Immutable Objects",
      subtitle: "Why String never changes — and how to design your own immutable types.",
      readTime: "18 min", level: "Core", deep: true,
      objectives: [
        "Define immutability and prove that String is immutable.",
        "List the concrete reasons Java made String immutable (security, pool, hashing, threads).",
        "Design your own immutable class with final fields and defensive copies.",
        "Recognise immutability's trade-offs and where StringBuilder (§3.7) fits."
      ],
      concept: `An object is **immutable** when its **state cannot change after construction**. \`String\` is the textbook immutable type: every method that "modifies" a string actually returns a **brand-new** \`String\` and leaves the original untouched.

\`\`\`java
String s = "hello";
s.toUpperCase();          // returns "HELLO" — but we ignored it
System.out.println(s);    // hello  (unchanged!)
s = s.concat(" world");   // s now references a NEW string "hello world"
\`\`\`

The variable \`s\` can be **reassigned** to point at a different string, but the \`"hello"\` object itself never changed. Reassignment ≠ mutation — a crucial distinction.`,
      why: `\`String\` was deliberately made immutable for several concrete reasons (a very common interview question — know all five):

1. **String Pool / caching** (§3.5) — literals can be safely **shared** across the program only if no one can mutate them. Mutation would corrupt every other reference to the same pooled string.
2. **Security** — strings carry sensitive parameters (file paths, URLs, DB connection strings, class names, usernames). If a string were mutable, code could change it *after* a security check (a "time-of-check to time-of-use" attack). Immutability makes such values tamper-proof.
3. **Thread safety** — an immutable object can be shared between threads **without synchronization**; there's no write to race on (Module 8).
4. **Reliable hashing** — \`String\` caches its \`hashCode\` (§3.3). Immutability guarantees the cached hash stays valid, which is why \`String\` is the ideal \`HashMap\` key — if a key's contents (and hash) could change, the map would lose track of it.
5. **Class loading integrity** — class names are passed as strings; immutability prevents them from being altered to load a different class than intended.`,
      proof: `**Proving immutability:** the class is declared \`public final class String\` (can't be subclassed to add mutability), its backing array is \`private final\`, and it's never exposed in a way that allows external modification. No method writes to the backing array in place. The only way to "change" text is to create a new \`String\`.

> Note: the JDK *can* bypass this internally (e.g., via reflection), but at the language/API level \`String\` is effectively unchangeable.`,
      designingImmutable: `**How to design your own immutable class** — a frequent design interview task. The recipe:

1. Declare the class **\`final\`** (so it can't be subclassed to add mutators).
2. Make all fields **\`private final\`**.
3. **No setters** — set everything in the constructor.
4. For **mutable fields** (arrays, collections, \`Date\`), store **defensive copies** in the constructor and return **copies/unmodifiable views** from getters — never leak the internal reference (§2.5).
5. If you must "change" a value, return a **new instance** (like \`String\` does).

\`\`\`java
public final class Money {                  // 1) final
    private final long amountInCents;       // 2) private final
    private final String currency;

    public Money(long cents, String currency) {  // 3) set in constructor
        this.amountInCents = cents;
        this.currency = currency;
    }
    public long cents()      { return amountInCents; }
    public String currency() { return currency; }

    public Money plus(Money other) {        // 5) return a NEW instance
        if (!currency.equals(other.currency))
            throw new IllegalArgumentException("currency mismatch");
        return new Money(this.amountInCents + other.amountInCents, currency);
    }
}
\`\`\`

For mutable members:

\`\`\`java
public final class Team {
    private final List<String> members;
    public Team(List<String> members) {
        this.members = List.copyOf(members);     // 4) defensive copy (unmodifiable)
    }
    public List<String> members() { return members; } // already unmodifiable
}
\`\`\`

(Java 16+ **\`record\`s** give you a concise immutable carrier — but still need defensive copies for mutable components.)`,
      internal: `Because immutable objects never change, the JVM and libraries can optimize aggressively: share instances (the pool), cache derived values (\`hashCode\`), and skip locking. The cost is **allocation churn** — every "edit" makes a new object. For a few operations this is negligible; for **repeated concatenation in a loop** it's quadratic and wasteful, which is exactly why the **mutable** \`StringBuilder\` (§3.7) exists. So Java's design is: \`String\` immutable for safety/sharing by default, \`StringBuilder\` mutable for performance when you're actively building text.`,
      useCases: `- **Value objects**: \`Money\`, \`LocalDate\`/\`LocalDateTime\` (the entire java.time API is immutable), \`UUID\`, \`BigInteger\`/\`BigDecimal\`.
- **Map keys / set elements**: immutability keeps hash codes stable (Module 5).
- **Shared configuration / constants** across threads without locks (Module 8).
- **Defensive API design**: returning immutable views so callers can't corrupt your internal state.`,
      code: `\`\`\`java
public class ImmutabilityDemo {
    public static void main(String[] args) {
        String original = "data";
        String upper = original.toUpperCase();   // new object
        System.out.println(original);            // data   (unchanged)
        System.out.println(upper);               // DATA

        // immutability enables safe sharing
        String shared = "config";
        String alias = shared;                   // both reference the same immutable object
        alias = alias + "-v2";                   // alias now points to a NEW string
        System.out.println(shared);              // config  (unaffected)
        System.out.println(alias);               // config-v2
    }
}
\`\`\``,
      mistakes: `- **Believing a method mutates the string** — \`s.replace(...)\` returns a new string; the original is unchanged.
- **Confusing reassignment with mutation** — \`s = s + "x"\` rebinds \`s\`; it doesn't alter the old object.
- **Leaking mutable internals** in your "immutable" class — returning the live \`List\`/array breaks immutability (defensive-copy it).
- **Forgetting \`final\` on the class** — a subclass could add mutable state and break the guarantee.
- **Heavy loop concatenation** with \`String\` — creates O(n) throwaway objects; use \`StringBuilder\` (§3.7).`,
      bestPractices: `- Prefer **immutability by default** for value types — it eliminates whole classes of bugs (*Effective Java* Item 17).
- Follow the recipe: \`final\` class, \`private final\` fields, no setters, defensive copies, return-new-instance for "changes".
- Use \`List.copyOf\`/\`Map.copyOf\`/\`Collections.unmodifiable*\` to protect collection fields (Module 5).
- Reach for **\`record\`s** (Java 16+) for boilerplate-free immutable carriers.
- Switch to **mutable builders** (\`StringBuilder\`, §3.7) only inside performance-critical building loops.`,
      interview: `**Q1. What does it mean that String is immutable?**
Its character content can't change after creation; "modifying" methods return new String objects, leaving the original intact.

**Q2. Why is String immutable in Java? (name several)**
String pool sharing, security (tamper-proof sensitive values), thread safety, cached/reliable hashing for map keys, and class-loading integrity.

**Q3. If String is immutable, how does \`s = s + "x"\` work?**
A new String is created and \`s\` is reassigned to it; the original object is unchanged (and may be garbage-collected).

**Q4. How do you make a class immutable?**
Final class, private final fields, no setters, set in constructor, defensive copies of mutable fields, return new instances for modifications.

**Q5. Why is immutability good for thread safety?**
Immutable objects have no mutable state to race on, so they can be shared across threads without synchronization.

**Q6. Why is an immutable object a good HashMap key?**
Its hash code never changes, so the map can always locate it; a mutable key whose hash changed would be lost.

**Q7. What's the downside of immutability, and Java's answer for strings?**
Extra object allocation on each change; \`StringBuilder\` (§3.7) provides a mutable alternative for building text efficiently.`,
      exercises: `1. Show that \`toUpperCase\`/\`replace\`/\`concat\` leave the original string unchanged, then capture the results.
2. Implement an immutable \`Point\` (final class, final x/y, no setters, \`withX(int)\` returning a new Point).
3. Break immutability deliberately: an "immutable" class that stores a \`List\` directly and leaks it via a getter; mutate from outside; then fix it with \`List.copyOf\`.
4. Convert your \`Point\` into a Java \`record\` and compare the boilerplate.`,
      challenges: `Design an immutable \`Range\` class (start, end) with operations \`shift(int)\`, \`expand(int)\`, and \`merge(Range)\`, each returning a new \`Range\`, plus correct \`equals\`/\`hashCode\`. Make it safe to use as a \`HashMap\` key and shareable across threads. Then write a short note explaining which of the five "why String is immutable" reasons apply to your \`Range\` and which don't.`,
      summary: `- **Immutable** = state can't change after construction; \`String\` proves it — methods return **new** strings.
- Java made \`String\` immutable for **pooling, security, thread-safety, stable hashing, and class-loading integrity**.
- Build your own: **\`final\` class, \`private final\` fields, no setters, defensive copies, return-new-instance** (or use \`record\`s).
- Trade-off is allocation; the mutable **\`StringBuilder\` (§3.7)** is Java's answer for heavy text building. Pool details: **§3.5**.`
    }),

    /* 3.5 String Pool — the JVM's cache of interned literals. */
    topic({
      id: "string-pool", chapter: "3.5", title: "String Pool",
      subtitle: "The JVM's cache of shared string literals — why == behaves the way it does.",
      readTime: "15 min", level: "Core", deep: true,
      objectives: [
        "Explain what the String Pool (String Constant Pool) is and where it lives.",
        "Trace exactly which strings are pooled vs heap-allocated.",
        "Predict \`==\` results across literals, \`new\`, and concatenation.",
        "Understand the memory/perf benefit and where the pool resides across Java versions."
      ],
      concept: `The **String Pool** (a.k.a. **String Constant Pool** or **intern pool**) is a special area where the JVM stores **one shared copy of each distinct string literal**. When you write a literal, the JVM checks the pool: if an identical string is already there, it **reuses** that object; otherwise it adds a new one. This is **interning**, and it's why identical literals share a reference.

\`\`\`java
String a = "Java";   // pool empty -> create "Java" in pool, a -> it
String b = "Java";   // "Java" already pooled -> b -> SAME object
System.out.println(a == b);   // true  (same pooled instance)
\`\`\`

The whole point: since strings are **immutable** (§3.4), sharing one instance is safe and saves memory.`,
      why: `Why have a pool at all?

- **Memory efficiency** — programs use the same literals (\`"true"\`, \`"GET"\`, \`","\`, field names) thousands of times; pooling stores each once.
- **Speed** — interned strings can be compared by reference for a fast pre-check, and literal loading is cheap.
- **Enabled by immutability** — only safe because no one can mutate a shared string (§3.4); a single mutation would corrupt every reference.

It also explains the #1 interview gotcha (\`==\` vs \`equals\`, §3.3): \`==\` is \`true\` for pooled literals and \`false\` for \`new\`-created strings.`,
      whatGetsPooled: `**The rules of what lands in the pool:**

\`\`\`java
String a = "Java";              // pooled
String b = "Java";              // reuses pooled -> a == b  (true)
String c = new String("Java");  // NEW heap object, NOT pooled -> a == c (false)
String d = "Ja" + "va";         // compile-time constant -> folded to "Java", pooled -> a == d (true)
String p = "Ja";
String e = p + "va";            // runtime concatenation -> NEW heap object -> a == e (false)
final String q = "Ja";
String f = q + "va";            // q is a compile-time constant -> folded -> a == f (true)
\`\`\`

Key principles:

- **Literals** and **compile-time constant expressions** (made only of literals/\`final\` constants) are **folded by the compiler** and pooled.
- **\`new String(...)\`** always creates a distinct heap object.
- **Concatenation involving a variable** is computed at **runtime** → a new, unpooled heap object (unless you call \`intern()\`, §3.6).`,
      internal: `**Where the pool lives** (a version-sensitive interview detail):

- **Java 6 and earlier** — the pool was in **PermGen** (permanent generation), a fixed-size space; interning too many strings could cause \`OutOfMemoryError: PermGen space\`.
- **Java 7** — the pool was **moved to the main heap**, so pooled strings are garbage-collected and can grow with heap size. This made manual \`intern()\` more practical.
- **Java 8+** — PermGen was removed entirely (replaced by **Metaspace** for class metadata), but the **string pool remains on the heap**.

The pool is implemented as a fixed-capacity hashtable internally; its size is tunable via \`-XX:StringTableSize\`. Literal interning happens automatically; runtime strings can be added with \`String.intern()\` (§3.6).`,
      diagram: `\`\`\`
                 HEAP
   ┌───────────────────────────────────────┐
   │  String Pool (interned literals)       │
   │     ┌─────────┐                        │
   │     │ "Java"  │◄── a, b, d  (literals) │
   │     └─────────┘                        │
   │                                        │
   │  Regular heap                          │
   │     ┌─────────┐  ┌─────────┐           │
   │     │ "Java"  │◄ c (new)   │ "Java" │◄ e (runtime +) │
   │     └─────────┘  └─────────┘           │
   └───────────────────────────────────────┘
\`\`\`

\`a == b == d\` (pool); \`c\` and \`e\` are separate heap objects; all are \`.equals\` to each other (§3.3).`,
      useCases: `- **Implicit everywhere** — every literal in your code benefits from pooling automatically.
- **High-duplication data** — parsing a file with many repeated tokens (status codes, enums-as-text) can use \`intern()\` (§3.6) to collapse duplicates and save heap.
- **Understanding bugs** — diagnosing why a \`==\` "works in tests" (literals) but fails in production (input/concatenation).`,
      code: `\`\`\`java
public class PoolDemo {
    public static void main(String[] args) {
        String a = "hello";
        String b = "hello";
        String c = new String("hello");
        String d = "hel" + "lo";          // compile-time constant
        String pre = "hel";
        String e = pre + "lo";            // runtime concatenation

        System.out.println(a == b);       // true  (pool)
        System.out.println(a == c);       // false (new heap object)
        System.out.println(a == d);       // true  (folded constant)
        System.out.println(a == e);       // false (runtime build)
        System.out.println(a == e.intern()); // true (intern returns pooled, §3.6)
        System.out.println(a.equals(c));  // true  (content)
    }
}
\`\`\``,
      mistakes: `- **Relying on \`==\`** for content because literals happen to be pooled — breaks for \`new\`/runtime strings (use \`equals\`, §3.3).
- **Assuming concatenation is pooled** — only **compile-time constants** are; variable concatenation isn't.
- **Over-interning** — calling \`intern()\` on huge numbers of unique strings can bloat the pool and hurt performance (§3.6).
- **Confusing \`new String("x")\` with the literal "x"** — that's two objects (one pooled, one heap).
- **Believing the pool is in PermGen on modern Java** — it moved to the heap in Java 7.`,
      bestPractices: `- Treat the pool as an **automatic memory optimization**, not a correctness tool — never compare content with \`==\`.
- Prefer **literals** so pooling kicks in; avoid needless \`new String(...)\`.
- Use **\`intern()\`** (§3.6) only deliberately, after measuring, for high-duplication workloads.
- Know the **version differences** (PermGen → heap) for interviews and for tuning \`-XX:StringTableSize\` if profiling shows pool contention.`,
      interview: `**Q1. What is the String Pool?**
A heap-resident cache of unique string literals; identical literals share one interned instance, saving memory.

**Q2. Why can the pool exist safely?**
Because strings are immutable (§3.4), so sharing one instance can't cause unexpected mutation.

**Q3. \`"a"+"b"\` vs \`var+"b"\` — which is pooled?**
\`"a"+"b"\` is a compile-time constant (folded, pooled); concatenation with a variable is computed at runtime and not pooled.

**Q4. Where does the pool live across Java versions?**
PermGen (≤ Java 6), moved to the heap (Java 7+); PermGen removed in Java 8 (Metaspace), pool stays on heap.

**Q5. Does \`new String("x")\` use the pool?**
No — it always allocates a new heap object; \`"x"\` itself is pooled, so two objects exist.

**Q6. How can you put a runtime string into the pool?**
Call \`String.intern()\` (§3.6).`,
      exercises: `1. Reproduce the five comparisons from the code example and explain each result.
2. Use a \`final\` variable in a concatenation and show the result becomes pooled (constant folding).
3. Count objects: for \`String s = new String("hi");\`, explain how many String objects exist and where each lives.
4. Read the JVM flag \`-XX:+PrintStringTableStatistics\` output (conceptually) and describe what the pool size means.`,
      challenges: `Write a program that reads a large list of words with many duplicates (simulate with a loop) and stores them in a list two ways — raw and \`intern()\`-ed — then reason about the heap difference. Explain when interning helps (high duplication) and when it hurts (mostly-unique strings bloating the pool), connecting to the PermGen→heap history.`,
      summary: `- The **String Pool** stores one shared copy of each distinct **literal** (interning), enabled by immutability (§3.4).
- **Literals and compile-time constants** are pooled; **\`new String\`** and **runtime concatenation** are not.
- This drives \`==\` behavior — use \`equals\` for content (§3.3).
- Pool location: **PermGen (≤6) → heap (7+)**; size tunable. Manual interning of runtime strings: **§3.6**.`
    }),

    /* 3.6 String Interning — intern() and manual deduplication. */
    topic({
      id: "string-interning", chapter: "3.6", title: "String Interning",
      subtitle: "Manually pooling runtime strings with intern() — benefits and traps.",
      readTime: "13 min", level: "Advanced", deep: true,
      objectives: [
        "Explain what \`String.intern()\` does and when the JVM does it automatically.",
        "Use \`intern()\` to deduplicate high-volume runtime strings.",
        "Weigh the memory savings against pool-pollution and performance costs.",
        "Relate interning to the pool internals (§3.5) and to \`equals\`/\`==\` (§3.3)."
      ],
      concept: `**Interning** is the act of placing a string into the **String Pool** (§3.5) and getting back the **canonical shared instance**. Literals are interned **automatically**; for strings created at runtime (from \`new\`, input, or concatenation), you can intern manually with the \`intern()\` method:

\`\`\`java
String runtime = new String("Java");      // a separate heap object
String pooled  = runtime.intern();        // returns the canonical pooled "Java"

System.out.println(runtime == pooled);    // false (different objects)
System.out.println("Java" == pooled);     // true  (pooled == the literal)
\`\`\`

\`intern()\` returns a reference such that, for any two strings \`a\` and \`b\`, \`a.intern() == b.intern()\` **if and only if** \`a.equals(b)\`.`,
      why: `Why intern manually? The main reason is **memory deduplication** when a program holds **many equal copies** of the same runtime strings:

- Parsing a large file/dataset where the same tokens (country codes, status values, column names) repeat millions of times.
- Loading records where one field has low cardinality (few distinct values, huge volume).

Interning collapses all those duplicates to a single shared instance, cutting heap usage. It can also enable fast \`==\` comparisons among interned strings (used in some high-performance code), though \`equals\` remains the safe default.`,
      howItWorks: `\`intern()\` checks the pool's hashtable for an \`equals\` match:

- **Found** → returns the existing pooled reference (your runtime object becomes garbage).
- **Not found** → adds *this* string to the pool and returns it.

\`\`\`java
String a = "hello";                 // pooled literal
String b = new String("hello");     // heap object
System.out.println(a == b);         // false
System.out.println(a == b.intern());// true — intern() returns the pooled "hello"
\`\`\`

Since Java 7 the pool lives on the **heap** (§3.5), so interned strings are eligible for garbage collection once unreferenced — which made \`intern()\` far safer than in the PermGen era.`,
      internal: `Internally the pool is a fixed-bucket native hashtable (\`StringTable\`). Interning a huge number of **distinct** strings causes:

- **Bucket collisions** → slower \`intern()\` calls (longer chains).
- **Pool growth** consuming heap.

You can tune capacity with \`-XX:StringTableSize=N\` (a prime number) and inspect it with \`-XX:+PrintStringTableStatistics\`. As an alternative to manual interning, the JVM offers automatic **String Deduplication** via the G1 garbage collector (\`-XX:+UseStringDeduplication\`), which merges equal char arrays during GC **without** you calling \`intern()\` — often the better choice for whole-application dedup.`,
      useCases: `- **Low-cardinality, high-volume fields** in parsed data (e.g., 5 distinct statuses across 10M rows).
- **Symbol tables / identifiers** where reference equality speeds up lookups.
- **Legacy memory tuning** before \`-XX:+UseStringDeduplication\` was available.

For most applications, you should **not** intern manually — rely on automatic literal interning and, if needed, GC-based deduplication.`,
      code: `\`\`\`java
import java.util.*;

public class InternDemo {
    public static void main(String[] args) {
        // Simulate many duplicate runtime strings
        List<String> raw = new ArrayList<>();
        for (int i = 0; i < 1_000_000; i++) {
            raw.add(new String("ACTIVE"));    // 1,000,000 distinct objects, same content
        }

        List<String> deduped = new ArrayList<>();
        for (int i = 0; i < 1_000_000; i++) {
            deduped.add("ACTIVE".intern());   // all reference ONE pooled instance
        }

        // 'deduped' holds 1 unique String object; 'raw' holds 1,000,000.
        System.out.println(raw.get(0) == raw.get(1));         // false
        System.out.println(deduped.get(0) == deduped.get(1)); // true
    }
}
\`\`\``,
      mistakes: `- **Interning everything** — interning mostly-unique strings bloats the pool and slows \`intern()\`; it helps only with **high duplication**.
- **Assuming \`intern()\` mutates in place** — it returns a (possibly different) reference; you must use the returned value.
- **Using \`==\` after interning only some strings** — mixing interned and non-interned strings makes \`==\` unreliable; keep using \`equals\` (§3.3).
- **Forgetting GC implications** — pre–Java 7 (PermGen) over-interning caused \`OutOfMemoryError\`.
- **Reinventing dedup** when \`-XX:+UseStringDeduplication\` would do it transparently.`,
      bestPractices: `- **Measure first** — only intern after profiling shows many duplicate strings dominating the heap.
- Prefer the JVM's **automatic string deduplication** (G1: \`-XX:+UseStringDeduplication\`) for app-wide dedup.
- Always use the **returned** reference from \`intern()\`; continue comparing with \`equals\`.
- If you intern heavily, tune \`-XX:StringTableSize\` and monitor with \`PrintStringTableStatistics\`.
- Don't use interning as a correctness mechanism for comparison — it's a memory optimization.`,
      interview: `**Q1. What does \`String.intern()\` do?**
Returns the canonical instance of the string from the pool, adding it if absent — so equal strings can share one object.

**Q2. \`new String("x").intern() == "x"\`?**
True — \`intern()\` returns the pooled \`"x"\` which is the literal's instance.

**Q3. When is interning useful?**
When many runtime strings are duplicates (low cardinality, high volume), to save heap.

**Q4. What are the risks of interning?**
Pool pollution and slower \`intern()\` for unique strings; historically PermGen OOM before Java 7.

**Q5. Is there an automatic alternative to manual interning?**
Yes — G1's \`-XX:+UseStringDeduplication\` merges equal backing arrays during GC.

**Q6. After interning, should you compare with \`==\` or \`equals\`?**
Still \`equals\` for safety; \`==\` only works if *both* operands are guaranteed interned.`,
      exercises: `1. Show \`new String("x") == "x"\` is false but \`new String("x").intern() == "x"\` is true.
2. Build two lists (raw \`new String\` vs \`intern()\`-ed) of a repeated value and reason about object counts.
3. Verify the contract: for \`a.equals(b)\`, confirm \`a.intern() == b.intern()\`.
4. Read about \`-XX:+UseStringDeduplication\` and write two sentences on how it differs from manual \`intern()\`.`,
      challenges: `Profile (conceptually or with a small benchmark) the heap difference between storing 1,000,000 duplicate runtime strings with and without \`intern()\`. Then design a guideline: for a dataset with N rows and K distinct values of a field, when does interning pay off, and when would \`-XX:+UseStringDeduplication\` be preferable? Tie your reasoning to the pool internals from §3.5.`,
      summary: `- **Interning** places a string in the pool and returns the **canonical shared** instance; literals are interned automatically, runtime strings via \`intern()\`.
- Contract: \`a.intern() == b.intern()\` iff \`a.equals(b)\`; use the **returned** reference.
- Great for **high-duplication** runtime strings; harmful when over-used (pool pollution).
- Prefer GC **string deduplication** for app-wide savings; keep comparing with **\`equals\` (§3.3)**. Pool basics: **§3.5**.`
    }),

    /* 3.7 StringBuilder — the mutable, fast text builder. */
    topic({
      id: "stringbuilder", chapter: "3.7", title: "StringBuilder",
      subtitle: "The mutable, high-performance way to build strings.",
      readTime: "16 min", level: "Core", deep: true,
      objectives: [
        "Explain why a mutable builder exists and when to use it over String concatenation.",
        "Use the core API: \`append\`, \`insert\`, \`delete\`, \`reverse\`, \`toString\`.",
        "Describe the internal capacity/resizing model and amortised cost.",
        "Recognise that compilers optimise simple \`+\`, but loops still need a builder."
      ],
      concept: `\`StringBuilder\` is a **mutable** sequence of characters. Unlike \`String\` (§3.4), it can be **changed in place** — appending, inserting, and deleting modify the *same* object instead of creating new ones. You build text efficiently, then call \`toString()\` once to get the final immutable \`String\`.

\`\`\`java
StringBuilder sb = new StringBuilder();
sb.append("Hello");
sb.append(", ").append("World");   // methods return 'this' -> chaining (Module 2 §2.3)
sb.append('!').append(2026);
String result = sb.toString();     // "Hello, World!2026"
\`\`\`

It's the standard tool whenever you assemble a string from many pieces, especially in **loops**.`,
      why: `Why not just use \`+\`? Because \`String\` is immutable, **each \`+\` in a loop creates a new object** and copies all previous characters — turning an n-piece build into **O(n²)** work and n throwaway objects:

\`\`\`java
// BAD: quadratic — a new String allocated every iteration
String s = "";
for (int i = 0; i < n; i++) s += i;     // O(n²)

// GOOD: linear — one growing buffer
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) sb.append(i); // O(n) amortised
String s2 = sb.toString();
\`\`\`

For large \`n\` this is the difference between milliseconds and seconds. This is a favourite interview/performance topic (see §3.12).`,
      api: `The essential API (most methods return \`this\` for chaining):

| Method | Effect |
|---|---|
| \`append(x)\` | add \`x\` (overloaded for all types) to the end |
| \`insert(i, x)\` | insert \`x\` at index \`i\` |
| \`delete(a, b)\` | remove chars in [a, b) |
| \`deleteCharAt(i)\` | remove one char |
| \`replace(a, b, str)\` | replace [a, b) with \`str\` |
| \`reverse()\` | reverse in place |
| \`charAt(i)\` / \`setCharAt(i, c)\` | read / write a char |
| \`length()\` / \`setLength(n)\` | size / truncate-or-extend |
| \`capacity()\` | current buffer size |
| \`toString()\` | produce the final immutable \`String\` |

\`\`\`java
StringBuilder sb = new StringBuilder("Java");
sb.insert(0, ">> ");        // ">> Java"
sb.append(" rocks");        // ">> Java rocks"
sb.reverse();               // "skcor avaJ >>"
sb.setLength(3);            // "skc"  (truncate)
\`\`\``,
      internal: `**Capacity and resizing** — the performance model:

- A \`StringBuilder\` wraps a \`char[]\` buffer with a **capacity** (default 16, or \`initial text length + 16\`).
- \`append\` writes into the buffer; when it's full, the builder **grows** by allocating a new array of roughly **\`oldCapacity * 2 + 2\`** and copying the contents.
- Because each doubling copies the data but happens rarely, total work is **amortised O(n)** — the standard "dynamic array" growth.
- Pre-sizing avoids repeated copies: \`new StringBuilder(expectedSize)\` if you know the rough final length.

\`\`\`java
StringBuilder sb = new StringBuilder(1000); // avoid resizes for ~1000 chars
\`\`\`

\`StringBuilder\` is **not synchronised** (no locking) — that's why it's faster than \`StringBuffer\` (§3.8), and fine for single-threaded/local use.`,
      compilerNote: `An important nuance: the Java compiler already optimises **simple** concatenations. \`"a" + b + "c"\` in a single expression is typically compiled to a \`StringBuilder\` (or, on modern JDKs, an \`invokedynamic\` string-concat recipe) automatically — so you don't need a builder for one-off concatenations. The case the compiler **cannot** fix is concatenation **inside a loop**, where each iteration is a separate statement creating a new string. **Rule:** use \`+\` for readability in simple expressions; use \`StringBuilder\` explicitly in loops and large builds.`,
      useCases: `- **Building output in loops**: CSV rows, generated SQL, JSON/HTML assembly, reports.
- **Algorithmic string manipulation**: reversing, in-place editing, two-pointer problems (DSA, Module 14).
- **Performance-critical concatenation** where profiling shows \`+\` is hot.
- **Parsing/transforming** where you accumulate characters conditionally.`,
      code: `\`\`\`java
public class BuilderDemo {
    static String csv(String[][] rows) {
        StringBuilder sb = new StringBuilder();
        for (String[] row : rows) {
            for (int i = 0; i < row.length; i++) {
                if (i > 0) sb.append(',');
                sb.append(row[i]);
            }
            sb.append('\\n');
        }
        return sb.toString();
    }
    public static void main(String[] args) {
        System.out.print(csv(new String[][]{{"id","name"},{"1","Shail"},{"2","Asha"}}));
        // palindrome check using reverse()
        String w = "level";
        boolean pal = w.contentEquals(new StringBuilder(w).reverse());
        System.out.println(pal);   // true
    }
}
\`\`\``,
      mistakes: `- **Concatenating with \`+\` in a loop** — the classic O(n²) bug; use \`append\`.
- **Comparing builders with \`equals\`** — \`StringBuilder\` does **not** override \`equals\`, so it's reference equality; convert with \`toString()\` or use \`contentEquals\`.
- **Forgetting \`toString()\`** — passing the builder where a \`String\` is expected (it's a \`CharSequence\`, not a \`String\`).
- **Sharing one \`StringBuilder\` across threads** — it's unsynchronised; use \`StringBuffer\` (§3.8) or confine it per thread.
- **Ignoring capacity** for very large builds — pre-size to avoid repeated array copies.`,
      bestPractices: `- Use \`StringBuilder\` for **loops and large/conditional builds**; plain \`+\` is fine for simple one-line concatenation.
- **Pre-size** the builder (\`new StringBuilder(n)\`) when the final length is roughly known.
- **Chain** \`append\` calls for readability (they return \`this\`).
- Call \`toString()\` **once** at the end; don't repeatedly convert mid-build.
- Compare contents via \`toString().equals(...)\` or \`contentEquals\`, never \`==\`/\`equals\` on the builder.`,
      interview: `**Q1. Difference between String and StringBuilder?**
\`String\` is immutable (each change makes a new object); \`StringBuilder\` is mutable (changes in place), making repeated building far more efficient.

**Q2. Why is \`+\` in a loop bad?**
Each iteration creates a new immutable String and copies all prior characters → O(n²) time and many garbage objects.

**Q3. Is StringBuilder thread-safe?**
No — it's unsynchronised (and therefore faster); use \`StringBuffer\` (§3.8) for shared mutable use across threads.

**Q4. How does StringBuilder grow?**
It wraps a char array; when full it allocates ~\`2*capacity+2\` and copies — amortised O(n). Pre-size to avoid resizes.

**Q5. Does the compiler already use StringBuilder for \`a + b\`?**
Yes for simple expressions (StringBuilder/invokedynamic), but not across loop iterations — those need an explicit builder.

**Q6. How do you compare two StringBuilders' contents?**
Convert with \`toString()\` and use \`equals\`, or use \`contentEquals\`; \`StringBuilder\` doesn't override \`equals\`.`,
      exercises: `1. Build a comma-separated string of numbers 1..1000 with \`+\` and with \`StringBuilder\`; time both.
2. Reverse a string using \`StringBuilder.reverse()\` and use it to check for palindromes.
3. Use \`insert\`, \`delete\`, and \`replace\` to transform \`"Hello World"\` into \`"Hi-World"\`.
4. Demonstrate that \`new StringBuilder("a").equals(new StringBuilder("a"))\` is false and fix the comparison.`,
      challenges: `Implement a small templating function \`render(String template, Map<String,String> vars)\` that replaces \`{{key}}\` placeholders using a single \`StringBuilder\` pass (no \`replaceAll\` in a loop). Then benchmark it against a naive repeated-\`String.replace\` version for a template with many variables, and explain the complexity difference, linking to §3.12.`,
      summary: `- \`StringBuilder\` is a **mutable** char sequence — change in place, then \`toString()\` once.
- Use it for **loops/large builds** to avoid \`String\`'s O(n²) concatenation; \`+\` is fine for simple expressions.
- Internals: a resizable \`char[]\` growing ~\`2x+2\`, amortised O(n); **pre-size** when possible.
- **Unsynchronised** (fast) — for thread-safe building use **\`StringBuffer\` (§3.8)**; compare via \`toString\`/\`contentEquals\`.`
    }),

    /* 3.8 StringBuffer — the synchronised builder. */
    topic({
      id: "stringbuffer", chapter: "3.8", title: "StringBuffer",
      subtitle: "The thread-safe (synchronised) sibling of StringBuilder.",
      readTime: "12 min", level: "Core", deep: true,
      objectives: [
        "Explain what StringBuffer is and how it differs from StringBuilder.",
        "Understand the synchronisation cost and when thread safety actually helps.",
        "Choose correctly between String, StringBuilder, and StringBuffer.",
        "Know the historical context (StringBuffer predates StringBuilder)."
      ],
      concept: `\`StringBuffer\` is a **mutable** sequence of characters with the **same API** as \`StringBuilder\` (§3.7) — \`append\`, \`insert\`, \`delete\`, \`reverse\`, \`toString\`, etc. The single difference: **\`StringBuffer\`'s methods are \`synchronized\`**, so it is **thread-safe** — multiple threads can call its methods without corrupting the internal buffer.

\`\`\`java
StringBuffer sb = new StringBuffer();
sb.append("Hello").append(", ").append("World");  // identical API to StringBuilder
String result = sb.toString();
\`\`\`

That synchronisation makes it **slower** in single-threaded code, which is the whole reason \`StringBuilder\` was later introduced.`,
      why: `\`StringBuffer\` came first (Java 1.0). When the JDK team realised most string-building is **single-threaded** and doesn't need locking, they added the **unsynchronised** \`StringBuilder\` (Java 5) as a faster drop-in. So today:

- Use **\`StringBuilder\`** by default (single-threaded — the common case).
- Use **\`StringBuffer\`** only when the *same builder instance* is genuinely shared and mutated by **multiple threads**.

In practice, shared mutable builders are rare (you usually build locally then publish the immutable \`String\`), so \`StringBuffer\` is uncommon in new code — but it's a guaranteed interview comparison.`,
      comparison: `**The three text types — the decision table interviewers love:**

| Feature | \`String\` | \`StringBuilder\` | \`StringBuffer\` |
|---|---|---|---|
| Mutable? | ❌ immutable (§3.4) | ✅ mutable | ✅ mutable |
| Thread-safe? | ✅ (immutable) | ❌ not synchronised | ✅ synchronised |
| Performance | slow for many edits | **fastest** for building | slower (locking) |
| Since | 1.0 | 5.0 | 1.0 |
| Use when | fixed text, keys, sharing | building text (single thread) | building text shared across threads |

**Rule of thumb:** \`String\` for constants/values, \`StringBuilder\` for building, \`StringBuffer\` only for shared multi-threaded building.`,
      internal: `Each public mutating method (\`append\`, \`insert\`, …) is marked \`synchronized\`, acquiring the buffer's intrinsic lock (\`this\` monitor) on every call. This guarantees atomicity of individual operations, but:

- It adds **per-call locking overhead** even with a single thread.
- It does **not** make a *sequence* of operations atomic — if two threads each do \`append\` then read \`length\`, the interleaving still needs higher-level coordination (Module 8). So \`StringBuffer\` protects the internal array, not your compound logic.

Like \`StringBuilder\`, it grows its \`char[]\` by ~\`2*capacity+2\` and is amortised O(n) (§3.7).`,
      useCases: `- **A shared log/accumulator** mutated by several threads without external locking (rare; a concurrent queue or per-thread builders are usually better — Module 8).
- **Legacy code** written before \`StringBuilder\` existed.
- **APIs that historically returned \`StringBuffer\`** (e.g., older \`Matcher.appendReplacement\`, though modern overloads use \`StringBuilder\`).`,
      code: `\`\`\`java
public class BufferDemo {
    public static void main(String[] args) throws InterruptedException {
        StringBuffer shared = new StringBuffer();   // safe to mutate from many threads

        Runnable job = () -> {
            for (int i = 0; i < 1000; i++) shared.append('x');
        };
        Thread t1 = new Thread(job), t2 = new Thread(job);
        t1.start(); t2.start();
        t1.join();  t2.join();

        System.out.println(shared.length());   // 2000 — no lost updates (synchronised)
        // With StringBuilder here, the length could be < 2000 due to data races.
    }
}
\`\`\``,
      mistakes: `- **Defaulting to \`StringBuffer\`** for ordinary single-threaded building — you pay for locking you don't use; prefer \`StringBuilder\`.
- **Assuming \`StringBuffer\` makes compound operations atomic** — only each method is atomic, not sequences of them.
- **Sharing a \`StringBuilder\` across threads** thinking it's safe — it isn't; that's exactly when \`StringBuffer\` (or proper synchronisation) is needed.
- **Comparing buffers with \`equals\`** — like \`StringBuilder\`, no content \`equals\`; convert via \`toString()\`.`,
      bestPractices: `- **Default to \`StringBuilder\`**; reach for \`StringBuffer\` only when one builder is shared across threads.
- For concurrent accumulation, prefer **per-thread builders merged at the end**, or concurrent collections (Module 8), over a single contended \`StringBuffer\`.
- Don't rely on \`StringBuffer\` for **multi-step** atomicity — coordinate at a higher level.
- Use \`String\` for the final, published, immutable value.`,
      interview: `**Q1. Difference between StringBuilder and StringBuffer?**
Same API; \`StringBuffer\` is synchronised (thread-safe, slower), \`StringBuilder\` is unsynchronised (not thread-safe, faster). Prefer \`StringBuilder\` unless sharing across threads.

**Q2. Why was StringBuilder added when StringBuffer existed?**
Most building is single-threaded; \`StringBuilder\` removes locking overhead for that common case (added in Java 5).

**Q3. Which is faster and why?**
\`StringBuilder\` — no synchronisation cost per method call.

**Q4. Does StringBuffer make a whole sequence of operations atomic?**
No — only each individual method; compound logic still needs external coordination.

**Q5. When should you actually use StringBuffer?**
When the same mutable builder instance is concurrently modified by multiple threads.

**Q6. Compare String vs StringBuilder vs StringBuffer in one line.**
String = immutable; StringBuilder = mutable, fast, single-thread; StringBuffer = mutable, synchronised, multi-thread.`,
      exercises: `1. Rewrite a \`StringBuilder\` loop using \`StringBuffer\` and note the identical API.
2. Spawn two threads appending to a shared \`StringBuffer\` and confirm the final length is exact; try the same with \`StringBuilder\` and observe possible lost updates.
3. Benchmark \`StringBuilder\` vs \`StringBuffer\` for a single-threaded 1M-append loop and report the difference.
4. Explain why building locally with \`StringBuilder\` and publishing the resulting \`String\` avoids needing \`StringBuffer\` at all.`,
      challenges: `Demonstrate a data race: have several threads append to a shared \`StringBuilder\` and show the result is sometimes shorter than expected; then fix it three ways — (a) switch to \`StringBuffer\`, (b) synchronise externally, (c) give each thread its own \`StringBuilder\` and concatenate at the end. Compare the performance and clarity of each approach (preview of Module 8).`,
      summary: `- \`StringBuffer\` = \`StringBuilder\` with **\`synchronized\`** methods → **thread-safe but slower**.
- **Default to \`StringBuilder\`**; use \`StringBuffer\` only when one builder is shared across threads.
- Synchronisation protects the **buffer**, not your **compound** operations (Module 8).
- Decision: **String** (immutable) / **StringBuilder** (fast building) / **StringBuffer** (concurrent building). Builder internals: **§3.7**.`
    }),

    /* ===================== ADVANCED ===================== */

    /* 3.9 String Formatting & Conversion — printf-style formatting and type conversions. */
    topic({
      id: "string-formatting", chapter: "3.9", title: "String Formatting & Conversion",
      subtitle: "printf-style formatting, and converting between strings and other types.",
      readTime: "16 min", level: "Core", deep: true,
      objectives: [
        "Format strings with \`String.format\`/\`printf\` and format specifiers.",
        "Convert primitives/objects to strings (\`valueOf\`, \`toString\`, concatenation).",
        "Parse strings to numbers (\`parseInt\`, \`valueOf\`) and handle errors.",
        "Choose the right conversion idiom and avoid locale/parsing pitfalls."
      ],
      concept: `Two everyday tasks dominate this chapter: **formatting** (producing nicely-laid-out text) and **conversion** (turning other types into strings and back).

\`\`\`java
// formatting
String row = String.format("%-10s %5.2f", "Coffee", 3.5);  // "Coffee        3.50"

// conversion: type -> String
String n = String.valueOf(42);     // "42"
String b = Boolean.toString(true); // "true"

// conversion: String -> type
int    i = Integer.parseInt("42"); // 42
double d = Double.parseDouble("3.14");
\`\`\`

Formatting uses **format specifiers**; conversion uses the \`valueOf\`/\`toString\`/\`parseXxx\` family.`,
      formatting: `**\`String.format(fmt, args...)\`** (and \`System.out.printf\`, and \`"...".formatted(args)\` since Java 15) build a string from a template with **format specifiers** \`%[flags][width][.precision]conversion\`:

| Specifier | Meaning | Example → result |
|---|---|---|
| \`%s\` | string | \`format("%s", "hi")\` → \`hi\` |
| \`%d\` | integer | \`format("%d", 42)\` → \`42\` |
| \`%f\` | floating point | \`format("%.2f", 3.14159)\` → \`3.14\` |
| \`%,d\` | grouped integer | \`format("%,d", 1000000)\` → \`1,000,000\` |
| \`%x\` / \`%o\` | hex / octal | \`format("%x", 255)\` → \`ff\` |
| \`%e\` | scientific | \`format("%e", 1234.5)\` → \`1.234500e+03\` |
| \`%b\` | boolean | \`format("%b", null)\` → \`false\` |
| \`%n\` | platform newline | line separator |

Width/flags: \`%-10s\` left-justify in 10 cols; \`%05d\` zero-pad to 5; \`%+d\` force sign.

\`\`\`java
System.out.printf("%-8s|%8.2f%n", "Item", 12.5);   // "Item    |   12.50"
String s = "Total: %,d".formatted(1234567);         // Java 15+: "Total: 1,234,567"
\`\`\``,
      conversion: `**Type → String:**

\`\`\`java
String.valueOf(123);      // "123"  (null-safe: valueOf(null) -> "null")
Integer.toString(123);    // "123"
"" + 123;                 // "123"  (works but less explicit)
someObject.toString();    // depends on overridden toString (Module 2 §2.8)
\`\`\`

**String → primitive/wrapper:**

\`\`\`java
int    i = Integer.parseInt("123");      // primitive int
Integer w = Integer.valueOf("123");      // Integer (may be cached, -128..127)
long   l = Long.parseLong("999999999");
double d = Double.parseDouble("3.14");
boolean b = Boolean.parseBoolean("true");
\`\`\`

\`parseXxx\` returns a **primitive**; \`valueOf\` returns a **wrapper** (and uses the integer cache for small values). Both throw \`NumberFormatException\` on bad input.`,
      internal: `- \`String.format\` is backed by **\`java.util.Formatter\`**, which parses the format string each call — so in tight loops, prefer a precompiled approach or \`StringBuilder\` (§3.7).
- Formatting is **locale-sensitive**: \`%,d\` and \`%f\` use the default \`Locale\` (decimal/grouping separators differ by region). Pass a \`Locale\` explicitly (\`String.format(Locale.US, ...)\`) for stable output (e.g., in file formats/APIs).
- \`String.valueOf(Object)\` is **null-safe** (returns \`"null"\`), whereas \`obj.toString()\` throws \`NullPointerException\` if \`obj\` is null — a subtle but important difference.
- For money, use **\`BigDecimal\`** + formatting, never \`double\` + \`%f\` (floating-point rounding).`,
      useCases: `- **Reports/tables/CLI output** with aligned columns and grouped numbers.
- **Logging** structured messages (\`String.format\`/\`"...".formatted\`).
- **Parsing config/CSV/user input** into numbers and back.
- **Locale-aware display** of currency, dates, and numbers (with explicit \`Locale\`).`,
      code: `\`\`\`java
import java.util.Locale;

public class FormatDemo {
    public static void main(String[] args) {
        // a small aligned table
        String[][] items = {{"Coffee","3.5"},{"Sandwich","6.25"}};
        System.out.printf("%-10s %8s%n", "ITEM", "PRICE");
        double total = 0;
        for (String[] it : items) {
            double price = Double.parseDouble(it[1]);
            total += price;
            System.out.printf(Locale.US, "%-10s %8.2f%n", it[0], price);
        }
        System.out.printf(Locale.US, "%-10s %8.2f%n", "TOTAL", total);

        // safe conversions
        System.out.println(String.valueOf((Object) null)); // "null" (no NPE)
        try {
            Integer.parseInt("12x");
        } catch (NumberFormatException e) {
            System.out.println("bad number: " + e.getMessage());
        }
    }
}
\`\`\``,
      mistakes: `- **Wrong specifier for the type** — \`%d\` with a \`double\` throws \`IllegalFormatConversionException\`; \`%f\` needs a floating type.
- **Locale surprises** — \`%,.2f\` produces \`1.234,56\` in some locales; pass \`Locale.US\` for fixed output.
- **\`parseInt\` on non-numeric/whitespace/null** — throws \`NumberFormatException\`; validate or catch.
- **\`obj.toString()\` on null** — NPE; use \`String.valueOf(obj)\`.
- **Using \`double\`+\`%f\` for currency** — rounding errors; use \`BigDecimal\`.
- **\`String.format\` in hot loops** — re-parses the format each time; build with \`StringBuilder\` if performance matters (§3.12).`,
      bestPractices: `- Use \`String.format\`/\`formatted\`/\`printf\` for **human-readable** output; pass an explicit **\`Locale\`** for machine/file formats.
- Prefer \`String.valueOf(x)\` (null-safe) for type→string; \`Integer.parseInt\`/\`Double.parseDouble\` for string→number with validation.
- Use **\`BigDecimal\`** for money and exact decimals.
- For repeated/large building, format pieces then assemble with **\`StringBuilder\`** (§3.7).
- Wrap parsing in clear error handling (\`NumberFormatException\`) — ties to Module 4.`,
      interview: `**Q1. How do you format a string in Java?**
\`String.format(fmt, args)\`, \`System.out.printf\`, or \`"...".formatted(args)\` (Java 15+), using specifiers like \`%s\`, \`%d\`, \`%.2f\`.

**Q2. \`parseInt\` vs \`valueOf\`?**
\`Integer.parseInt\` returns a primitive \`int\`; \`Integer.valueOf\` returns an \`Integer\` (and caches -128..127).

**Q3. Difference between \`String.valueOf(obj)\` and \`obj.toString()\`?**
\`valueOf\` is null-safe (returns \`"null"\`); \`toString\` on a null reference throws NPE.

**Q4. What exception does bad numeric parsing throw?**
\`NumberFormatException\` (an unchecked \`RuntimeException\`).

**Q5. Why pass a Locale to \`String.format\`?**
Formatting of numbers/grouping/decimals is locale-sensitive; an explicit Locale gives consistent output across environments.

**Q6. Why avoid \`double\` for currency formatting?**
Floating-point can't represent many decimals exactly; use \`BigDecimal\` to avoid rounding errors.`,
      exercises: `1. Print an aligned 3-column table (name, qty, price) using \`printf\` with width/precision specifiers.
2. Convert \`42\`, \`true\`, and a custom object to strings three different ways each.
3. Parse \`"123"\`, \`"3.14"\`, \`"abc"\` and handle the failure for the last gracefully.
4. Show that \`String.format("%,.2f", 1234.5)\` differs across \`Locale.US\` and \`Locale.GERMANY\`.`,
      challenges: `Write a \`formatInvoice(List<Item>)\` that prints a right-aligned price column, grouped thousands, a separator line, and a total — all locale-stable (\`Locale.US\`) and using \`BigDecimal\` for amounts. Then refactor the inner formatting to assemble via \`StringBuilder\` and discuss when the \`Formatter\` overhead would matter (links to §3.12).`,
      summary: `- **Format** with \`String.format\`/\`printf\`/\`formatted\` and specifiers (\`%s\`, \`%d\`, \`%.2f\`, \`%,d\`); pass a **\`Locale\`** for stable output.
- **Convert** type→string with null-safe \`String.valueOf\`; string→number with \`parseXxx\` (primitive) / \`valueOf\` (wrapper), catching \`NumberFormatException\`.
- Use **\`BigDecimal\`** for money; avoid \`String.format\` in hot loops (use \`StringBuilder\`, §3.7/§3.12).
- Parsing errors connect to **Module 4** (exceptions).`
    }),

    /* 3.10 Regular Expressions — pattern matching power tool. */
    topic({
      id: "regular-expressions", chapter: "3.10", title: "Regular Expressions",
      subtitle: "Pattern, Matcher, and the regex syntax for searching and validating text.",
      readTime: "20 min", level: "Advanced", deep: true,
      objectives: [
        "Use \`Pattern\` and \`Matcher\` (and String convenience methods) for matching.",
        "Read core regex syntax: classes, quantifiers, anchors, groups, alternation.",
        "Extract data with capturing groups and replace with backreferences.",
        "Avoid catastrophic backtracking and other regex pitfalls."
      ],
      concept: `A **regular expression (regex)** is a pattern that describes a set of strings. Java's regex lives in \`java.util.regex\`, primarily two classes:

- **\`Pattern\`** — a compiled regex.
- **\`Matcher\`** — applies a compiled pattern to input to find/replace/extract.

Plus convenience methods on \`String\`: \`matches\`, \`split\`, \`replaceAll\`, \`replaceFirst\`.

\`\`\`java
import java.util.regex.*;

Pattern p = Pattern.compile("\\\\d{3}-\\\\d{4}");   // e.g., 123-4567
Matcher m = p.matcher("call 123-4567 now");
if (m.find()) System.out.println(m.group());     // 123-4567
\`\`\`

(Remember: in Java source, each regex backslash is written as \`\\\\\` because the string literal also uses \`\\\` — a constant source of confusion.)`,
      why: `Regex is the power tool for text whenever a fixed method won't do:

- **Validation** — emails, phone numbers, postal codes, passwords.
- **Extraction** — pull dates, IDs, or fields out of free-form text/logs.
- **Search & replace** — complex transformations beyond literal \`replace\`.
- **Tokenisation** — \`split\` on flexible delimiters.

It's concise and expressive, but powerful enough to shoot yourself in the foot (performance, readability) — so use it judiciously.`,
      syntax: `**Core syntax cheat-sheet:**

| Pattern | Matches |
|---|---|
| \`.\` | any character (except newline) |
| \`\\d\` \`\\w\` \`\\s\` | digit, word char, whitespace |
| \`\\D\` \`\\W\` \`\\S\` | negations of the above |
| \`[abc]\` \`[^abc]\` \`[a-z]\` | char class / negated / range |
| \`*\` \`+\` \`?\` | 0+, 1+, 0 or 1 (greedy) |
| \`{n}\` \`{n,}\` \`{n,m}\` | exact / at least / range counts |
| \`^\` \`$\` | start / end of input (or line) |
| \`\\b\` | word boundary |
| \`(...)\` | capturing group |
| \`(?:...)\` | non-capturing group |
| \`(?<name>...)\` | named group |
| \`a\|b\` | alternation (a or b) |
| \`*?\` \`+?\` | lazy (non-greedy) quantifiers |

\`\`\`java
"\\\\d+"          // one or more digits
"[A-Za-z]+"     // one or more letters
"^https?://"    // starts with http:// or https://
"(\\\\w+)@(\\\\w+)" // capture user and domain
\`\`\``,
      matchingMethods: `**Three ways to match, by intent:**

\`\`\`java
// 1) full-string match (anchored implicitly)
"12345".matches("\\\\d+");                 // true (whole string is digits)

// 2) search for occurrences with Matcher
Matcher m = Pattern.compile("\\\\d+").matcher("a12 b345");
while (m.find()) System.out.println(m.group());  // 12, then 345

// 3) replace
"a1b2".replaceAll("\\\\d", "#");           // "a#b#"
\`\`\`

**\`matches\`** must match the **entire** input; **\`find\`** locates substrings. This trips people up: \`"a12".matches("\\\\d+")\` is **false** (the 'a' isn't a digit), but \`find\` would locate \`"12"\`.`,
      groups: `**Capturing groups** extract parts; **backreferences** reuse them:

\`\`\`java
Pattern p = Pattern.compile("(\\\\d{4})-(\\\\d{2})-(\\\\d{2})"); // yyyy-mm-dd
Matcher m = p.matcher("2026-06-12");
if (m.matches()) {
    System.out.println(m.group(1)); // 2026  (year)
    System.out.println(m.group(2)); // 06    (month)
    System.out.println(m.group(3)); // 12    (day)
}

// named groups
Pattern np = Pattern.compile("(?<user>\\\\w+)@(?<host>\\\\w+\\\\.\\\\w+)");
Matcher nm = np.matcher("shail@example.com");
if (nm.matches()) System.out.println(nm.group("user")); // shail

// backreference in replacement: swap "first last" -> "last, first"
"Shail Mishra".replaceAll("(\\\\w+)\\\\s+(\\\\w+)", "$2, $1"); // "Mishra, Shail"
\`\`\``,
      internal: `**Performance matters:**

- \`Pattern.compile\` is **expensive**; \`String.matches\`/\`replaceAll\`/\`split\` recompile the pattern **every call**. For repeated use, **compile once** and reuse the \`Pattern\` (it's thread-safe; \`Matcher\` is not).
- **Catastrophic backtracking**: patterns with nested/overlapping quantifiers like \`(a+)+$\` against a long non-matching input can take **exponential** time (a ReDoS risk). Prefer specific classes, possessive quantifiers (\`a++\`), or atomic groups; avoid ambiguous nesting.
- Use flags via \`Pattern.compile(regex, Pattern.CASE_INSENSITIVE | Pattern.MULTILINE)\` instead of inline hacks.

\`\`\`java
private static final Pattern EMAIL =
    Pattern.compile("^[\\\\w.+-]+@[\\\\w-]+\\\\.[\\\\w.-]+$");  // compiled ONCE, reused
\`\`\``,
      useCases: `- **Input validation** in services/forms (email, phone, PAN/Aadhaar formats).
- **Log parsing / ETL** — extract timestamps, levels, IDs from lines.
- **Search-and-replace** refactors and text cleanup (\`slugify\`, normalising whitespace).
- **Tokenising** with flexible delimiters (\`split("\\\\s*,\\\\s*")\`).`,
      code: `\`\`\`java
import java.util.regex.*;
import java.util.*;

public class RegexDemo {
    private static final Pattern KV = Pattern.compile("(\\\\w+)=([^;]+)");
    public static void main(String[] args) {
        String input = "name=Shail; role=admin; city=Pune";
        Matcher m = KV.matcher(input);
        Map<String,String> map = new LinkedHashMap<>();
        while (m.find()) {
            map.put(m.group(1), m.group(2).trim());
        }
        System.out.println(map);   // {name=Shail, role=admin, city=Pune}

        // validate an email
        boolean ok = "a@b.com".matches("^[\\\\w.+-]+@[\\\\w-]+\\\\.[\\\\w.-]+$");
        System.out.println(ok);    // true
    }
}
\`\`\``,
      mistakes: `- **Forgetting double escaping** — \`\\d\` in regex is \`"\\\\d"\` in a Java string literal.
- **\`matches\` vs \`find\` confusion** — \`matches\` requires the *whole* string to match.
- **Recompiling in loops** — \`String.matches\`/\`replaceAll\` recompile each call; precompile \`Pattern\`.
- **Catastrophic backtracking** — ambiguous nested quantifiers can hang on crafted input (ReDoS).
- **Sharing a \`Matcher\` across threads** — \`Pattern\` is thread-safe, \`Matcher\` is **not**; create a matcher per use.
- **Over-using regex** — for simple literal checks, \`contains\`/\`startsWith\` (§3.2) are clearer and faster.`,
      bestPractices: `- **Compile once**, store the \`Pattern\` in a \`static final\` field, create a fresh \`Matcher\` per call.
- Use **named groups** and **comments/flags** (\`Pattern.COMMENTS\`) for readable complex patterns.
- Prefer **specific** patterns and **possessive/atomic** constructs to avoid backtracking blowups.
- Validate untrusted input length before applying complex regex (ReDoS defense).
- Reach for regex only when literal String methods (§3.2) aren't enough.`,
      interview: `**Q1. Which classes power Java regex?**
\`java.util.regex.Pattern\` (compiled regex) and \`Matcher\` (applies it); plus String's \`matches\`/\`split\`/\`replaceAll\`.

**Q2. Difference between \`matches\` and \`find\`?**
\`matches\` requires the entire input to match the pattern; \`find\` searches for any matching substring.

**Q3. Why precompile a Pattern?**
\`String.matches\`/\`replaceAll\` recompile every call; compiling once and reusing is far faster for repeated matching.

**Q4. Are Pattern and Matcher thread-safe?**
\`Pattern\` is immutable/thread-safe; \`Matcher\` is **not** — use one per thread/operation.

**Q5. What is catastrophic backtracking (ReDoS)?**
Exponential-time matching from ambiguous nested quantifiers on certain inputs; mitigate with specific patterns, possessive quantifiers, or atomic groups.

**Q6. How do you extract parts of a match?**
Capturing groups: \`group(1)\`, \`group(2)\`, or named groups \`group("name")\`; \`$1\`/\`$2\` in replacements.

**Q7. Why is \`"\\d"\` written \`"\\\\d"\` in Java?**
The string literal consumes one backslash, so you double it to pass \`\\d\` to the regex engine.`,
      exercises: `1. Validate a 10-digit phone number and an email with \`matches\`.
2. Extract all numbers from \`"a12 b34 c56"\` using \`Matcher.find\` + \`group\`.
3. Use a backreference replacement to convert \`"2026-06-12"\` to \`"12/06/2026"\`.
4. Show \`"a12".matches("\\\\d+")\` is false while \`find\` locates \`"12"\`, and explain.
5. Precompile a \`Pattern\` into a \`static final\` field and reuse it across many inputs.`,
      challenges: `Build a mini log parser: given lines like \`2026-06-12 10:33:01 [ERROR] db timeout\`, use one compiled \`Pattern\` with named groups (date, time, level, message) to parse into objects, count errors by level, and print a summary. Then craft a deliberately catastrophic pattern (e.g., \`(a+)+$\`) and demonstrate (conceptually) why it's dangerous, plus how to rewrite it safely.`,
      summary: `- Regex = patterns over text via **\`Pattern\`** (compiled) + **\`Matcher\`**, plus String \`matches\`/\`split\`/\`replaceAll\`.
- Know classes/quantifiers/anchors/groups; **\`matches\`** = whole string, **\`find\`** = substring; extract via capturing/named groups, \`$1\` in replacements.
- **Precompile** patterns (static final); \`Pattern\` is thread-safe, \`Matcher\` is not.
- Beware **catastrophic backtracking**; double-escape backslashes; prefer plain String methods (§3.2) when sufficient.`
    }),

    /* 3.11 Text Blocks & Modern String API — Java 11/15+ ergonomics. */
    topic({
      id: "text-blocks", chapter: "3.11", title: "Text Blocks & Modern String API",
      subtitle: "Multi-line text blocks and the newer String methods (Java 11/15+).",
      readTime: "14 min", level: "Advanced", deep: true,
      objectives: [
        "Write multi-line text with text blocks (\`\"\"\"\`) and control indentation.",
        "Use modern String methods: \`strip\`, \`isBlank\`, \`lines\`, \`repeat\`, \`formatted\`, \`chars\`.",
        "Know which Java version introduced each feature.",
        "Apply these to real tasks (JSON/SQL/HTML, streaming lines)."
      ],
      concept: `Modern Java (11 and 15+) added ergonomics that make string code cleaner. The headline feature is the **text block** — a multi-line string literal delimited by triple quotes \`"""\`, introduced as a standard feature in **Java 15**:

\`\`\`java
String json = """
    {
        "name": "Shail",
        "role": "admin"
    }
    """;
\`\`\`

No \`\\n\`, no escaped quotes, no \`+\` concatenation — the text reads exactly as written. Alongside it, several **instance methods** (\`strip\`, \`isBlank\`, \`lines\`, \`repeat\` from Java 11; \`formatted\`, \`stripIndent\`, \`translateEscapes\` from Java 15) round out the API.`,
      why: `Before text blocks, embedding JSON, SQL, HTML, or XML in Java meant unreadable, error-prone literals:

\`\`\`java
// old: hard to read and edit
String sql = "SELECT id, name\\n" +
             "FROM users\\n" +
             "WHERE active = true";
\`\`\`

Text blocks eliminate the noise, reduce bugs (missing \`\\n\`, unbalanced quotes), and keep the embedded language readable. The new methods replace common boilerplate (manual trimming, splitting into lines, repeating).`,
      textBlockRules: `**Text block mechanics worth knowing:**

- Opening \`"""\` must be followed by a **line terminator**; content starts on the next line.
- **Incidental indentation** is stripped: the compiler removes the common leading whitespace determined by the least-indented line (including the closing \`"""\`). The closing delimiter's position controls the left margin.
- A trailing newline is included unless you end the content line with \`\\\` (line continuation) or place \`"""\` on the same line as the last content.
- Use \`\\s\` to preserve a trailing space; quotes inside generally need **no** escaping.

\`\`\`java
String html = """
    <ul>
        <li>One</li>
        <li>Two</li>
    </ul>""";          // closing """ on last line -> no trailing newline
\`\`\``,
      modernMethods: `**Newer instance/stream methods:**

| Method | Since | Purpose |
|---|---|---|
| \`strip()\`, \`stripLeading\`, \`stripTrailing\` | 11 | Unicode-aware trim (§3.2) |
| \`isBlank()\` | 11 | true if empty or only whitespace |
| \`lines()\` | 11 | a \`Stream<String>\` of lines (Module 7) |
| \`repeat(n)\` | 11 | n copies |
| \`formatted(args)\` | 15 | instance form of \`String.format\` |
| \`stripIndent()\` | 15 | apply text-block indentation rules to any string |
| \`chars()\` | 9 | \`IntStream\` of char values |

\`\`\`java
"  hi  ".strip();                 // "hi"
"   ".isBlank();                  // true
"a\\nb\\nc".lines().count();        // 3
"=".repeat(20);                  // a divider line
"Hello %s".formatted("Shail");   // "Hello Shail"
"abc".chars().sum();             // sum of char codes
\`\`\``,
      internal: `Text blocks are **pure compile-time syntax**: the compiler processes indentation/escapes and produces an ordinary \`String\` — at runtime there's **no difference** from a normal string literal, and it's **interned** in the pool (§3.5) just like any literal. \`lines()\` and \`chars()\` return **streams** (lazy; Module 7), so they pair naturally with stream pipelines for line/character processing. \`formatted\` simply calls \`String.format\` under the hood (so the same locale caveats apply, §3.9).`,
      useCases: `- **Embedded languages**: SQL queries, JSON/HTML/XML fixtures, GraphQL, regex docs.
- **Test data** and expected-output strings that stay readable.
- **Line processing**: \`text.lines().filter(...).map(...)\` (Module 7).
- **Pretty output**: \`repeat\` for separators, \`formatted\` for inline templating.`,
      code: `\`\`\`java
public class ModernStrings {
    public static void main(String[] args) {
        String name = "Shail";
        String email = """
            Hi %s,

            Your account is ready.
            Regards,
            Team
            """.formatted(name);
        System.out.print(email);

        String csv = """
            id,name
            1,Shail
            2,Asha""";
        long rows = csv.lines().skip(1).filter(l -> !l.isBlank()).count();
        System.out.println("data rows: " + rows);   // 2

        System.out.println("-".repeat(24));
    }
}
\`\`\``,
      mistakes: `- **Targeting an old JDK** — text blocks need Java 15+ (preview in 13/14); \`strip\`/\`isBlank\`/\`lines\`/\`repeat\` need Java 11+. Check your project's language level.
- **Indentation confusion** — the closing \`"""\` position sets the left margin; misplacing it adds/removes leading spaces.
- **Unexpected trailing newline** — content ends with a newline unless you use \`\\\` continuation or put \`"""\` on the last content line.
- **Assuming a runtime difference** — text blocks are just literals; no performance change.
- **Using \`trim()\` when \`strip()\` is meant** — \`strip\` is Unicode-aware (§3.2).`,
      bestPractices: `- Use **text blocks** for any multi-line embedded text; align the closing \`"""\` to set indentation intentionally.
- Prefer \`strip\`/\`isBlank\` over \`trim\`/length checks; use \`lines()\` with streams for line processing (Module 7).
- Use \`formatted\` for readable inline templating; keep \`Locale\` in mind (§3.9).
- Confirm your **build's Java version** supports the features before using them.
- Combine \`repeat\`/\`join\`/\`formatted\` to replace manual building for simple cases; use \`StringBuilder\` for heavy loops (§3.7/§3.12).`,
      interview: `**Q1. What is a text block and when was it standardised?**
A multi-line string literal delimited by \`"""\`, standard since **Java 15**, that avoids \`\\n\` and quote escaping.

**Q2. How is incidental indentation handled?**
The compiler strips the common leading whitespace; the closing \`"""\` position determines the left margin.

**Q3. Is a text block different from a normal String at runtime?**
No — it compiles to an ordinary, pooled \`String\`; the syntax is compile-time only.

**Q4. Name some Java 11 String methods.**
\`strip\`, \`stripLeading/Trailing\`, \`isBlank\`, \`lines\`, \`repeat\`.

**Q5. \`strip()\` vs \`trim()\`?**
\`strip\` is Unicode-whitespace aware; \`trim\` only removes chars ≤ U+0020.

**Q6. What does \`lines()\` return and why is it useful?**
A \`Stream<String>\` of the lines, enabling functional line processing (Module 7).`,
      exercises: `1. Rewrite a multi-line SQL/JSON string from \`+\`/\`\\n\` form into a text block.
2. Use \`lines()\` to count non-blank lines and to uppercase each line.
3. Demonstrate the trailing-newline rule by printing a text block with and without \`"""\` on the last content line.
4. Replace a manual divider build with \`"-".repeat(n)\` and an inline message with \`formatted\`.`,
      challenges: `Create an HTML email template as a text block with \`%s\` placeholders, fill it with \`formatted\`, then post-process it with \`lines()\` to strip blank lines and indent each line by two spaces — all without manual \`\\n\` handling. Discuss which steps are compile-time (text block) vs runtime (lines/formatted) and how it would degrade gracefully on an older JDK.`,
      summary: `- **Text blocks** (\`"""\`, Java 15) make multi-line text readable; indentation is set by the closing delimiter; they're just pooled literals at runtime.
- Java 11 added \`strip\`/\`isBlank\`/\`lines\`/\`repeat\`; Java 15 added \`formatted\`/\`stripIndent\`.
- \`lines()\`/\`chars()\` return **streams** for functional processing (Module 7).
- Check the **JDK version**; prefer \`strip\`/\`isBlank\`; use \`StringBuilder\` for heavy building (§3.12).`
    }),

    /* 3.12 String Performance & Best Practices — capstone. */
    topic({
      id: "string-performance", chapter: "3.12", title: "String Performance & Best Practices",
      subtitle: "Capstone — choose the right tool and avoid the classic performance traps.",
      readTime: "16 min", level: "Advanced", deep: true,
      objectives: [
        "Quantify the cost of String concatenation and choose String vs StringBuilder vs StringBuffer.",
        "Apply pooling/interning (§3.5/§3.6) and immutability (§3.4) for memory efficiency.",
        "Use efficient comparison, formatting, and regex patterns.",
        "Consolidate a checklist of string best practices for interviews and real code."
      ],
      concept: `This capstone ties the module together into **decisions**. Strings are everywhere, so small choices compound into real performance and memory differences. The three recurring questions:

1. **How am I building text?** (concatenation cost — §3.7)
2. **How am I comparing text?** (\`==\` vs \`equals\` — §3.3)
3. **How much duplicate/temporary text am I creating?** (pooling, interning, immutability — §3.4–§3.6)

Getting these right is exactly what separates a junior from a senior answer in interviews.`,
      concatenationCost: `**The headline performance trap — concatenation in loops:**

\`\`\`java
// O(n²): each += copies the whole accumulated string
String s = "";
for (int i = 0; i < n; i++) s += data[i];

// O(n): one growing buffer
StringBuilder sb = new StringBuilder(n * avgLen);  // pre-sized
for (int i = 0; i < n; i++) sb.append(data[i]);
String s2 = sb.toString();
\`\`\`

For \`n = 100,000\`, the first version can be **seconds**; the second, **milliseconds**. The compiler optimises a *single* \`a + b + c\` expression into a builder, but **not** a loop — that's on you (§3.7).`,
      decisionGuide: `**Which type to use — the senior cheat-sheet:**

| Situation | Use |
|---|---|
| Fixed text, constants, map keys, sharing across threads | \`String\` (immutable, §3.4) |
| Building text in a loop / large or conditional builds (single thread) | \`StringBuilder\` (§3.7) |
| Building text shared & mutated across threads | \`StringBuffer\` (§3.8) |
| One-line concatenation of a few values | plain \`+\` (compiler handles it) |
| Many duplicate runtime strings dominating heap | \`intern()\` / GC dedup (§3.6) |
| Complex search/validate/replace | precompiled regex \`Pattern\` (§3.10) |
| Locale-stable formatted output | \`String.format(Locale, ...)\` (§3.9) |`,
      memoryTips: `**Memory-efficiency tactics:**

- Prefer **literals** so the **pool** (§3.5) shares instances; avoid \`new String(...)\`.
- For **high-duplication** runtime strings, \`intern()\` or enable **G1 string deduplication** (§3.6).
- **Immutability** (§3.4) lets you share strings freely across threads/structures without copying.
- **Don't hold references** to giant strings longer than needed; \`substring\` now copies (no accidental retention), but keeping the big original alive does.
- **Pre-size** \`StringBuilder\` to avoid repeated array doubling (§3.7).`,
      comparisonAndRegexPerf: `**Comparison & matching performance:**

- Compare content with \`equals\` (§3.3); for huge sets, hash-based lookup (\`HashSet<String>\`, Module 5) is O(1) average vs scanning.
- **Precompile** regex \`Pattern\`s and reuse them; never \`String.matches\`/\`replaceAll\` in a hot loop (§3.10).
- For simple checks, \`startsWith\`/\`endsWith\`/\`contains\` (§3.2) beat regex.
- \`String.format\` re-parses its template each call — fine for occasional use, costly in tight loops; build with \`StringBuilder\` there (§3.9).`,
      code: `\`\`\`java
import java.util.regex.*;

public class StringPerf {
    private static final Pattern DIGITS = Pattern.compile("\\\\d+"); // compiled once

    static String buildReport(String[] rows) {
        StringBuilder sb = new StringBuilder(rows.length * 16); // pre-sized
        for (String r : rows) sb.append(r).append('\\n');
        return sb.toString();
    }

    public static void main(String[] args) {
        // comparison: correct + null-safe
        String status = "ACTIVE";
        if ("ACTIVE".equals(status)) System.out.println("ok");

        // reuse compiled pattern
        System.out.println(DIGITS.matcher("abc123").find()); // true
    }
}
\`\`\``,
      mistakes: `- **\`+=\` in loops** — the single most common string performance bug (use \`StringBuilder\`).
- **\`==\` for content** — correctness bug masquerading as working code (use \`equals\`, §3.3).
- **\`new String(...)\`** and needless temporaries — wasted allocations; prefer literals.
- **Recompiling regex** each call (§3.10) and **\`String.format\` in hot loops** (§3.9).
- **Over-interning** unique strings — pool bloat (§3.6).
- **Using \`double\`+\`%f\` for money** — precision bug (§3.9).`,
      bestPractices: `**The string best-practices checklist:**

- Build with **\`StringBuilder\`** in loops; **pre-size** it; \`toString()\` once.
- Compare with **\`equals\`/\`equalsIgnoreCase\`**, null-safe (\`"x".equals(v)\`/\`Objects.equals\`).
- Prefer **literals** (pooling); intern only high-duplication runtime strings deliberately.
- **Precompile** regex into \`static final Pattern\`; use plain methods for simple checks.
- Use **text blocks** (§3.11) for multi-line text; **\`String.format(Locale,…)\`** for stable formatting; **\`BigDecimal\`** for money.
- Favour **immutability** for your own value types (§3.4); don't leak mutable internals.`,
      interview: `**Q1. Why is String concatenation in a loop slow, and the fix?**
Each \`+\` creates a new immutable String and copies all prior chars → O(n²); use \`StringBuilder\` for O(n).

**Q2. When would you use StringBuffer over StringBuilder?**
Only when the same builder is shared and mutated by multiple threads (§3.8).

**Q3. How do you compare strings efficiently and correctly?**
\`equals\` for content (null-safe); for membership, a \`HashSet<String>\` (O(1) avg) beats scanning.

**Q4. How do you speed up repeated regex matching?**
Compile the \`Pattern\` once (static final) and reuse it; avoid \`String.matches\`/\`replaceAll\` in loops.

**Q5. How does the string pool help memory, and how to extend it to runtime strings?**
It shares literal instances; \`intern()\` or G1 string deduplication dedupes runtime strings (§3.5/§3.6).

**Q6. Give three string best practices.**
StringBuilder in loops (pre-sized), \`equals\` not \`==\`, precompiled regex / prefer literals; (also BigDecimal for money, text blocks for multi-line).`,
      exercises: `1. Benchmark \`+=\` vs \`StringBuilder\` for n = 1,000 / 100,000 and record the times.
2. Replace a hot-loop \`String.matches\` with a precompiled \`Pattern\` and measure the improvement.
3. Audit a small class for string anti-patterns (\`==\`, \`new String\`, loop \`+=\`, recompiled regex) and fix each.
4. Show pre-sizing a \`StringBuilder\` reduces internal array resizes for a large build.`,
      challenges: `Take a deliberately slow text-processing method (loop concatenation + \`==\` comparisons + \`String.matches\` inside the loop + \`new String\`) and refactor it into an efficient version (pre-sized \`StringBuilder\`, \`equals\`, a precompiled \`Pattern\`, literals/interning where appropriate). Benchmark before/after, and write a short paragraph mapping each change to the relevant chapter (§3.3–§3.10) — a complete capstone of the module.`,
      summary: `- **Build** with \`StringBuilder\` (pre-sized) in loops — avoid O(n²) \`+=\`; \`StringBuffer\` only for shared threads.
- **Compare** with \`equals\` (null-safe), not \`==\`; use hashing for membership.
- **Save memory** via literals/pooling, deliberate \`intern\`/GC-dedup, and immutability; avoid \`new String\` and temporaries.
- **Match/format** with precompiled \`Pattern\`s and \`Locale\`-stable \`format\`; \`BigDecimal\` for money; text blocks for multi-line. This capstone ties together §3.3–§3.11.`
    })
  ]
});
