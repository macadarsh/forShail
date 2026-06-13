/* Module 11: Dev Environment & Tools — edit ONLY this file for this module's content.
   Authored at ~2x Module 2 depth (Module-3 style), ordered BASIC -> ADVANCED:
     11.1 JDK & CLI -> 11.2 IntelliJ -> 11.3 Maven -> 11.4 Gradle
     -> 11.5 Git & GitHub -> 11.6 JUnit & Mockito -> 11.7 Logging
     -> 11.8 Debugging, Profiling & CI/CD.
   Each topic() renders sections in declared order; see assets/site.js PART_LABELS. */
registerModule({
  id: "tools",
  module: "Dev Environment & Tools",
  page: "module-tools.html",
  icon: "🧰",
  tagline: "JDK, IntelliJ, Maven/Gradle, Git, testing, logging, and CI/CD.",
  lessons: [

    /* ===================== BASIC ===================== */

    /* 11.1 JDK & Command-Line Basics. */
    topic({
      id: "jdk-cli-basics", chapter: "11.1", title: "JDK Setup & Command-Line Basics",
      subtitle: "Installing the JDK and compiling/running Java without an IDE.",
      readTime: "14 min", level: "Foundational", deep: true,
      objectives: [
        "Install a JDK and verify the toolchain (java, javac).",
        "Compile and run Java from the command line, understanding the classpath.",
        "Package code into a runnable JAR.",
        "Use JShell and manage multiple JDK versions."
      ],
      concept: `Before any IDE or build tool, you should understand the **JDK toolchain** — the command-line tools that compile and run Java (Module 1 covered the JVM/JRE/JDK distinction). The essentials:

| Tool | Purpose |
|---|---|
| \`javac\` | compile \`.java\` → \`.class\` bytecode |
| \`java\` | run a class / JAR on the JVM |
| \`jar\` | package \`.class\` files into a \`.jar\` |
| \`jshell\` | interactive REPL (Java 9+) |
| \`javadoc\` | generate API docs from comments |

\`\`\`bash
javac Main.java     # compile -> Main.class
java Main           # run the bytecode
\`\`\`

Knowing this makes IDEs and build tools (Maven/Gradle) demystified — they just orchestrate these underneath.`,
      why: `Understanding the raw toolchain matters because:

- **IDEs and build tools hide it** — but when something breaks (classpath errors, wrong JDK, \`ClassNotFoundException\`), you need to reason at this level.
- **Interviews/CI** sometimes require plain \`javac\`/\`java\` knowledge.
- It clarifies the **classpath**, **packages** (Module 2 §2.17), and how a program is assembled — foundational mental model for everything above it.`,
      installing: `**Installing and verifying a JDK:**

- Get an **LTS** JDK (e.g., 17 or 21) from a distribution (Eclipse Temurin/Adoptium, Oracle, Amazon Corretto).
- Set **\`JAVA_HOME\`** to the JDK install directory and add \`$JAVA_HOME/bin\` to \`PATH\`.

\`\`\`bash
java -version     # runtime version (also confirms install)
javac -version    # compiler — only present with a JDK (not just a JRE)
echo $JAVA_HOME   # should point to the JDK
\`\`\`

If \`javac\` is "command not found" but \`java\` works, you have a runtime but not a full JDK (Module 1 §1.3).`,
      compileRun: `**Compiling and running with packages and classpath:**

\`\`\`bash
# project layout: src/com/shail/App.java  (package com.shail;)
javac -d out src/com/shail/App.java        # -d = output dir; mirrors package -> out/com/shail/App.class
java -cp out com.shail.App                 # run by FULLY-QUALIFIED name (Module 2 §2.17)

# multiple sources / dependencies on the classpath
javac -cp "lib/*" -d out src/com/shail/*.java
java  -cp "out:lib/*" com.shail.App        # ':' separator on Unix, ';' on Windows
\`\`\`

The **classpath** (\`-cp\`) tells the JVM where to find \`.class\` files and JARs (the class loader, Module 1 §1.4). Since Java 11 you can run a single file directly: \`java App.java\` (source-launch mode).`,
      jar: `**Packaging a runnable JAR:**

\`\`\`bash
# create a JAR from compiled classes
jar --create --file app.jar -C out .

# runnable JAR needs a Main-Class manifest entry
jar --create --file app.jar --main-class com.shail.App -C out .
java -jar app.jar                          # runs the manifest's Main-Class
\`\`\`

A **JAR** (Java ARchive) is a ZIP of \`.class\` files + a \`META-INF/MANIFEST.MF\` (which can declare the entry point and classpath). Build tools (§11.3/§11.4) produce JARs (and "fat/uber" JARs bundling dependencies) for you.`,
      jshell: `**JShell — the interactive REPL (Java 9+)** — great for quick experiments without a full program:

\`\`\`
jshell> int x = 21 * 2
x ==> 42
jshell> "hello".toUpperCase()
$2 ==> "HELLO"
jshell> /exit
\`\`\`

Use it to test snippets, explore APIs, and verify behaviour fast. For managing multiple JDKs, tools like **SDKMAN!** (\`sdk install java 21-tem\`, \`sdk use java ...\`) make switching versions easy.`,
      internal: `\`javac\` performs compile-time checks (types, generics erasure — Module 6) and emits portable bytecode; \`java\` launches the JVM, which loads classes via the classpath (Module 1 §1.4). The **manifest** in a JAR (\`Main-Class\`, \`Class-Path\`) drives \`java -jar\`. Modern build tools and the **module system** (\`module-path\`, Module 2 §2.17) add structure on top, but the fundamental compile → package → run pipeline is exactly these tools. Knowing the classpath rules is what lets you debug \`NoClassDefFoundError\` vs \`ClassNotFoundException\` (Module 1 §1.4).`,
      useCases: `- **Quick scripts/experiments** without IDE setup (\`java File.java\`, JShell).
- **Diagnosing classpath/JDK issues** in CI or production.
- **Understanding** what Maven/Gradle (§11.3/§11.4) actually run.
- **Minimal builds** in constrained environments.`,
      code: `\`\`\`bash
# end-to-end without any build tool
mkdir -p src/com/shail out
cat > src/com/shail/App.java <<'EOF'
package com.shail;
public class App {
    public static void main(String[] args) {
        System.out.println("Hello from " + App.class.getName());
    }
}
EOF
javac -d out src/com/shail/App.java        # compile
java -cp out com.shail.App                 # run -> Hello from com.shail.App
jar --create --file app.jar --main-class com.shail.App -C out .
java -jar app.jar                          # run the JAR
\`\`\``,
      mistakes: `- **No JDK (only JRE)** — \`javac\` missing; install a full JDK (Module 1 §1.3).
- **Wrong/unset \`JAVA_HOME\`** or multiple JDKs on \`PATH\` — compiling/running with an unexpected version.
- **Running with the simple name** (\`java App\`) when the class is in a package — use the **fully-qualified** name (Module 2 §2.17).
- **Classpath separator confusion** — \`:\` on Unix/macOS, \`;\` on Windows.
- **Forgetting the manifest \`Main-Class\`** for \`java -jar\`.
- **Mismatched compile/run versions** (\`UnsupportedClassVersionError\`).`,
      bestPractices: `- Use an **LTS JDK** (17/21); manage versions with **SDKMAN!**/\`jenv\`; set \`JAVA_HOME\`.
- Compile with **\`-d\`** to mirror packages; run by **fully-qualified name** or **\`java -jar\`**.
- Understand the **classpath** so you can debug class-loading errors.
- Use **JShell** for quick experiments; **\`javadoc\`** for API docs.
- Let **build tools** (§11.3/§11.4) handle real projects, but keep the CLI fundamentals.`,
      interview: `**Q1. What's the difference between \`javac\` and \`java\`?**
\`javac\` compiles source to bytecode; \`java\` launches the JVM to run a class/JAR.

**Q2. What is the classpath?**
The list of locations (dirs/JARs) where the JVM/compiler looks for \`.class\` files (\`-cp\`); separator is \`:\` (Unix) / \`;\` (Windows).

**Q3. How do you run a class inside a package?**
By its fully-qualified name: \`java -cp out com.shail.App\` (Module 2 §2.17).

**Q4. What makes a JAR runnable?**
A \`Main-Class\` entry in \`META-INF/MANIFEST.MF\`, run via \`java -jar\`.

**Q5. What is JShell?**
An interactive Java REPL (Java 9+) for testing snippets without a full program.

**Q6. JDK vs JRE for compiling?**
You need the JDK (it includes \`javac\`); a JRE can only run, not compile (Module 1 §1.3).`,
      exercises: `1. Compile and run a packaged class with \`javac -d\` and \`java -cp\`.
2. Build a runnable JAR with a \`Main-Class\` and run it with \`java -jar\`.
3. Use JShell to evaluate three expressions.
4. Add a dependency JAR to the classpath and compile against it.`,
      challenges: `Without any IDE/build tool, create a small multi-class, multi-package project, compile it with the right \`-d\`/\`-cp\`, bundle it into a runnable JAR (with a manifest), and run it. Then add a third-party dependency JAR to the classpath and use one of its classes. Document each command and explain what Maven/Gradle (§11.3/§11.4) would automate.`,
      summary: `- The **JDK toolchain** — \`javac\` (compile), \`java\` (run), \`jar\` (package), \`jshell\` (REPL) — underlies all IDEs/build tools.
- Compile with **\`-d\`** (mirrors packages, Module 2 §2.17); run by **fully-qualified name** or **\`java -jar\`**; mind the **classpath** (\`-cp\`, separator \`:\`/\`;\`).
- A **runnable JAR** needs a \`Main-Class\` manifest entry; use an **LTS JDK** and manage versions with SDKMAN!.
- Build tools (**Maven §11.3 / Gradle §11.4**) orchestrate these; knowing the CLI demystifies class-loading errors (Module 1 §1.4).`
    }),

    /* 11.2 IntelliJ IDEA Mastery. */
    topic({
      id: "intellij-idea-mastery", chapter: "11.2", title: "IntelliJ IDEA Mastery",
      subtitle: "Navigating, refactoring, and debugging productively in the IDE.",
      readTime: "14 min", level: "Core", deep: true,
      objectives: [
        "Set up a project and SDK in IntelliJ IDEA.",
        "Use essential navigation, search, and code-generation shortcuts.",
        "Refactor safely with IDE tooling.",
        "Use the debugger, run configurations, and integrated tools."
      ],
      concept: `**IntelliJ IDEA** is the industry-standard Java IDE — an editor with deep language understanding that boosts productivity through **smart navigation, refactoring, code generation, and debugging**. The Community Edition is free and sufficient for core Java; Ultimate adds web/enterprise features.

Beyond editing, the IDE understands your code semantically (types, references, call graphs), enabling features no plain text editor can match: rename-everywhere, find-usages, extract-method, on-the-fly error highlighting, and an integrated debugger.`,
      why: `Most professional Java is written in an IDE because it dramatically reduces friction:

- **Navigation** — jump to any class/method/usage instantly across a large codebase.
- **Refactoring** — restructure code safely (the IDE updates all references).
- **Code generation** — getters/setters, constructors, \`equals\`/\`hashCode\`/\`toString\` (Module 2/3).
- **Debugging** — breakpoints, step-through, variable inspection (vs \`println\` debugging).
- **Integration** — build tools (§11.3/§11.4), Git (§11.5), tests (§11.6), run/debug configs.

Fluency with the IDE is a real interview/on-the-job differentiator.`,
      setup: `**Project setup:**

- **New Project** → choose a build system (**Maven**/**Gradle**, §11.3/§11.4) or plain IDEA project, and a **Project SDK** (the JDK, §11.1).
- IntelliJ auto-imports the build file (\`pom.xml\`/\`build.gradle\`) and resolves dependencies.
- **Project Structure** (Cmd/Ctrl+Alt+Shift+S) configures SDK, modules, and language level.

Set the **language level** to match your target JDK so the IDE enforces the right syntax/features (records, var, text blocks — Module 3 §3.11).`,
      shortcuts: `**Essential shortcuts (macOS / Windows-Linux):** memorise these — they're the productivity core:

| Action | macOS | Win/Linux |
|---|---|---|
| Search everywhere | Shift Shift | Shift Shift |
| Go to class | Cmd O | Ctrl N |
| Go to file | Cmd Shift O | Ctrl Shift N |
| Find usages | Alt F7 | Alt F7 |
| Go to declaration | Cmd B | Ctrl B |
| Rename (refactor) | Shift F6 | Shift F6 |
| Generate code | Cmd N | Alt Insert |
| Reformat code | Cmd Alt L | Ctrl Alt L |
| Quick fix / intentions | Alt Enter | Alt Enter |
| Run / Debug | Ctrl R / Ctrl D | Shift F10 / Shift F9 |

**Alt+Enter** (intentions/quick-fixes) is the single most useful key — it suggests imports, fixes, and refactors in context.`,
      refactoring: `**Safe refactoring** — the IDE updates all references automatically (vs error-prone manual edits):

- **Rename** (Shift+F6) — rename a class/method/variable everywhere.
- **Extract Method / Variable / Constant / Field** — pull code into named units.
- **Inline** — the inverse of extract.
- **Change Signature** — add/remove/reorder parameters and update all callers.
- **Move / Introduce Parameter / Extract Interface** — restructure types (ties to Module 12 design principles).

These are **semantic** operations (not text find-replace), so they respect scope and overloads — making large-scale cleanups safe.`,
      debugging: `**The debugger** beats \`println\` for understanding runtime behaviour:

- **Breakpoints** — line, conditional ("\`i == 100\`"), exception, and method breakpoints.
- **Step** over / into / out; **evaluate expression** at a paused frame.
- **Inspect** variables, the call stack, and watches.
- **Drop frame** to re-run a method; **hot-swap** edited code.

\`\`\`
Set a breakpoint -> Debug (Ctrl D) -> step through -> inspect 'this' and locals
\`\`\`

Combined with the integrated **test runner** (§11.6), **profiler**, **Git** (§11.5), and build-tool panels, the IDE is a full workbench.`,
      internal: `IntelliJ continuously builds a **PSI (Program Structure Interface)** model — an in-memory, type-resolved syntax tree of your whole project — which powers navigation, inspections, and refactorings. **Inspections** flag bugs/smells as you type (nullability, unused code, performance), with **Alt+Enter** quick-fixes. It delegates actual compilation/packaging to the **build tool** (Maven/Gradle) or its own compiler, and integrates **run/debug configurations** that wrap \`java\`/test/JAR invocations (§11.1). Plugins extend it (Lombok, frameworks, linters).`,
      useCases: `- **Daily Java development** — editing, navigating, refactoring large codebases.
- **Debugging** complex runtime issues with breakpoints/inspection.
- **Generating boilerplate** (constructors, \`equals\`/\`hashCode\`, getters).
- **Running tests** (§11.6) and managing builds/VCS from one place.`,
      code: `\`\`\`java
// IntelliJ generates this boilerplate for you (Alt+Insert / Cmd+N):
public class Point {
    private final int x, y;
    public Point(int x, int y) { this.x = x; this.y = y; } // "Constructor"

    @Override public boolean equals(Object o) {            // "equals() and hashCode()"
        if (this == o) return true;
        if (!(o instanceof Point p)) return false;
        return x == p.x && y == p.y;
    }
    @Override public int hashCode() { return java.util.Objects.hash(x, y); }
    @Override public String toString() { return "Point{x=" + x + ", y=" + y + '}'; } // "toString()"
}
// Tip: a Java 'record' (Module 2 §2.1) generates all of the above automatically.
\`\`\``,
      mistakes: `- **Not learning shortcuts** — clicking through menus is far slower; learn Search Everywhere, Alt+Enter, Rename.
- **Manual find-replace for renames** instead of **Refactor → Rename** (misses references, breaks code).
- **\`println\` debugging** instead of the debugger for non-trivial issues.
- **Wrong Project SDK/language level** — features unavailable or wrong syntax flagged (§11.1).
- **Ignoring inspections/warnings** — they catch real bugs and smells (Module 12).
- **Committing IDE files** (\`.idea/\`, \`*.iml\`) — add to \`.gitignore\` (§11.5).`,
      bestPractices: `- Memorise the **core shortcuts** (Search Everywhere, Alt+Enter, Rename, Find Usages, Reformat).
- Use **semantic refactorings** (Rename/Extract/Change Signature), not text edits.
- Debug with **breakpoints** (conditional where useful), not \`println\`.
- Keep the **Project SDK/language level** correct (§11.1); heed **inspections**.
- Integrate **build tool, Git, and tests** in the IDE; \`.gitignore\` IDE files.`,
      interview: `**Q1. Why use an IDE like IntelliJ over a text editor?**
Semantic understanding enables smart navigation, safe refactoring, code generation, on-the-fly error detection, and an integrated debugger/test runner.

**Q2. What does Refactor → Rename do that find-replace doesn't?**
It updates all *references* semantically (respecting scope/overloads), not just matching text.

**Q3. What's the most useful IntelliJ shortcut?**
Alt+Enter (intentions/quick-fixes) — context-aware fixes, imports, and refactors.

**Q4. How do you debug in IntelliJ?**
Set breakpoints (incl. conditional), run in debug mode, step over/into/out, and inspect/evaluate variables.

**Q5. What is the Project SDK / language level?**
The JDK used and the Java version whose syntax/features the IDE enforces.

**Q6. What code can IntelliJ generate?**
Constructors, getters/setters, \`equals\`/\`hashCode\`/\`toString\`, overrides, and more (or use records).`,
      exercises: `1. Create a Maven/Gradle project in IntelliJ and set the Project SDK.
2. Use Generate (Alt+Insert) to add a constructor and \`equals\`/\`hashCode\`/\`toString\`.
3. Set a conditional breakpoint and step through a loop, inspecting variables.
4. Use Refactor → Rename and Extract Method on a sample class.`,
      challenges: `Take a messy class and clean it up using only IDE refactorings: Rename poorly-named identifiers, Extract Method on a long method, Change Signature to add a parameter, and Extract Interface (linking to Module 12 ISP/DIP). Then set a conditional breakpoint to catch a specific iteration and inspect state. Note which steps would be risky/slow without semantic tooling.`,
      summary: `- **IntelliJ IDEA** understands code semantically (the **PSI** model), enabling smart **navigation**, safe **refactoring**, **code generation**, inspections, and **debugging**.
- Learn core shortcuts — **Search Everywhere**, **Alt+Enter**, **Rename**, **Find Usages**, **Reformat**; refactor via **Rename/Extract/Change Signature**, not text edits.
- Use the **debugger** (breakpoints/inspection) over \`println\`; set the correct **Project SDK/language level** (§11.1); heed inspections (Module 12).
- Integrates build tools (**§11.3/§11.4**), Git (**§11.5**), and tests (**§11.6**).`
    }),

    /* ===================== CORE: BUILD TOOLS ===================== */

    /* 11.3 Maven. */
    topic({
      id: "maven", chapter: "11.3", title: "Maven",
      subtitle: "Declarative builds and dependency management with pom.xml.",
      readTime: "16 min", level: "Core", deep: true,
      objectives: [
        "Explain what Maven does and the convention-over-configuration model.",
        "Read and write a pom.xml (coordinates, dependencies, plugins).",
        "Understand the build lifecycle and common goals.",
        "Manage dependencies, scopes, and transitive resolution."
      ],
      concept: `**Maven** is a **build automation and dependency management** tool that builds Java projects declaratively via a **\`pom.xml\`** (Project Object Model). You declare *what* your project is and *what it needs*; Maven figures out *how* to compile, test, package, and resolve dependencies — replacing manual \`javac\`/\`jar\` (§11.1).

\`\`\`xml
<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.shail</groupId>          <!-- organization -->
  <artifactId>shop</artifactId>          <!-- project name -->
  <version>1.0.0</version>               <!-- version -->
  <dependencies>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>5.10.0</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
</project>
\`\`\`

Maven follows **convention over configuration** — standard directory layout and lifecycle so projects are uniform.`,
      why: `Before build tools, managing dependencies (downloading JARs, resolving versions, classpath, §11.1) and build steps by hand was painful and inconsistent. Maven provides:

- **Dependency management** — declare a dependency; Maven downloads it (and its dependencies) from a **repository** (Maven Central).
- **Standard lifecycle** — \`compile\`, \`test\`, \`package\`, \`install\`, \`deploy\` everywhere the same.
- **Convention** — standard layout (\`src/main/java\`, \`src/test/java\`) so any Maven project is familiar.
- **Reproducibility** — the \`pom.xml\` fully describes the build.
- **Ecosystem** — plugins for everything (Spring Boot, shading, code coverage).`,
      coordinatesLayout: `**Coordinates & standard layout:** every artifact is identified by **GAV** — \`groupId:artifactId:version\`. The conventional directory structure:

\`\`\`
project/
 ├─ pom.xml
 ├─ src/main/java/      <- application code
 ├─ src/main/resources/ <- config/resources
 ├─ src/test/java/      <- test code (§11.6)
 └─ target/             <- build output (generated; gitignore it)
\`\`\`

You typically don't configure source paths — Maven assumes these conventions. Dependencies are GAV references resolved from repositories.`,
      lifecycle: `**The build lifecycle** is a fixed sequence of **phases**; running a phase runs all prior ones:

| Phase | Does |
|---|---|
| \`validate\` | check the project is correct |
| \`compile\` | compile \`src/main/java\` |
| \`test\` | run unit tests (§11.6) |
| \`package\` | build the JAR/WAR |
| \`verify\` | run integration checks |
| \`install\` | copy artifact to the **local** repo (~/.m2) |
| \`deploy\` | publish to a **remote** repo |

\`\`\`bash
mvn clean package        # clean, then compile/test/package
mvn test                 # compile + run tests
mvn install -DskipTests  # install to local repo, skip tests
\`\`\`

**Plugins** bind **goals** to phases (e.g., the compiler plugin's \`compile\` goal runs in the \`compile\` phase).`,
      dependencies: `**Dependency management — scopes and transitivity:**

| Scope | Available in | Example |
|---|---|---|
| \`compile\` (default) | all classpaths | core libraries |
| \`provided\` | compile/test, not packaged | servlet API (container provides it) |
| \`runtime\` | runtime/test, not compile | JDBC driver (§10) |
| \`test\` | tests only | JUnit, Mockito (§11.6) |

Maven resolves **transitive** dependencies automatically (your dependency's dependencies). Conflicts are resolved by **nearest-wins**; control versions centrally with **\`<dependencyManagement>\`** / a parent POM / a **BOM**. Inspect the tree with \`mvn dependency:tree\` to debug version clashes.`,
      internal: `Maven downloads artifacts from **Maven Central** (and configured repos) into a **local repository** at \`~/.m2/repository\`, caching them for reuse. The build runs as a sequence of plugin **goals** bound to lifecycle **phases**; the effective configuration merges your POM with a **parent**/super POM (defaults). **Multi-module** projects use a parent POM aggregating sub-modules for consistent versions. The "nearest-wins" transitive resolution and version mediation are common sources of subtle classpath bugs — \`mvn dependency:tree\`/\`dependency:analyze\` diagnose them.`,
      useCases: `- **Standard Java project builds** with managed dependencies.
- **Enterprise/Spring projects** (huge Maven ecosystem).
- **CI pipelines** (\`mvn clean verify\`, §11.8).
- **Multi-module** monorepos with shared versioning.
- **Publishing libraries** to repositories.`,
      code: `\`\`\`xml
<!-- a realistic pom.xml snippet -->
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.shail</groupId>
  <artifactId>shop</artifactId>
  <version>1.0.0</version>
  <properties>
    <maven.compiler.release>17</maven.compiler.release>   <!-- target JDK 17 -->
  </properties>
  <dependencies>
    <dependency>
      <groupId>com.google.guava</groupId>
      <artifactId>guava</artifactId>
      <version>33.0.0-jre</version>            <!-- compile scope -->
    </dependency>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>5.10.0</version>
      <scope>test</scope>                        <!-- tests only -->
    </dependency>
  </dependencies>
</project>
\`\`\`
\`\`\`bash
mvn clean package           # -> target/shop-1.0.0.jar
mvn dependency:tree         # inspect transitive dependencies
\`\`\``,
      mistakes: `- **Hardcoding versions everywhere** instead of \`<properties>\`/\`<dependencyManagement>\`/BOM — version drift.
- **Wrong scope** — e.g., JUnit not \`test\`, or a JDBC driver not \`runtime\`.
- **Ignoring transitive conflicts** — duplicate/incompatible versions; use \`dependency:tree\`.
- **Committing \`target/\`** or \`~/.m2\` artifacts — gitignore generated output.
- **Skipping the lifecycle** mental model — not realising \`package\` also runs \`compile\`+\`test\`.
- **Editing the JAR/classpath by hand** instead of declaring dependencies.`,
      bestPractices: `- Follow the **standard layout** and **convention over configuration**.
- Centralise versions with **\`<properties>\`/\`<dependencyManagement>\`/BOMs**; keep the POM clean.
- Use the **correct scope** (\`test\`/\`provided\`/\`runtime\`).
- Run **\`mvn clean verify\`** in CI; inspect **\`dependency:tree\`** for conflicts.
- **Gitignore** \`target/\`; pin plugin versions for reproducible builds.`,
      interview: `**Q1. What is Maven and what does it do?**
A build + dependency-management tool driven by \`pom.xml\` (convention over configuration) — it compiles, tests, packages, and resolves dependencies.

**Q2. What is GAV?**
groupId:artifactId:version — the coordinates uniquely identifying an artifact.

**Q3. Describe the build lifecycle.**
Ordered phases: validate → compile → test → package → verify → install → deploy; running a phase runs all prior ones.

**Q4. What are dependency scopes?**
compile (default, all), provided (compile/test, not packaged), runtime (not compile), test (tests only).

**Q5. How are transitive dependency conflicts resolved?**
Nearest-wins; manage versions via \`<dependencyManagement>\`/BOM; inspect with \`dependency:tree\`.

**Q6. Where are downloaded dependencies stored?**
The local repository at \`~/.m2/repository\`.`,
      exercises: `1. Write a minimal \`pom.xml\` with a compile dependency and a test-scoped JUnit, then \`mvn package\`.
2. Run \`mvn dependency:tree\` and identify a transitive dependency.
3. Move a hardcoded version into \`<properties>\`.
4. Explain what \`mvn install\` does that \`mvn package\` doesn't.`,
      challenges: `Set up a small Maven project: standard layout, a compile dependency (e.g., Guava), JUnit 5 in test scope (§11.6), JDK 17 release level, and the Maven Shade/Assembly plugin to produce a runnable fat JAR. Run \`mvn clean package\`, execute the JAR, and use \`dependency:tree\` to find and resolve a version conflict by overriding it in \`<dependencyManagement>\`. Then compare the same setup to Gradle (§11.4).`,
      summary: `- **Maven** = declarative build + dependency management via **\`pom.xml\`** with **convention over configuration** (standard layout, **GAV** coordinates).
- The **lifecycle** (validate→compile→test→package→install→deploy) runs phases in order; **plugins/goals** bind to phases.
- Dependencies resolve **transitively** (nearest-wins) from repos into **\`~/.m2\`**; use **scopes** (compile/provided/runtime/test) and centralise versions (BOM/\`dependencyManagement\`).
- Run \`mvn clean verify\` in CI (§11.8); inspect \`dependency:tree\`. Compare with **Gradle (§11.4)**.`
    })/*__MORE__*/
  ]
});
