/* Module 10: JDBC — edit ONLY this file for this module's content.
   Authored at ~2x Module 2 depth (Module-3 style), ordered BASIC -> ADVANCED:
     10.1 architecture -> 10.2 Connection -> 10.3 Statement -> 10.4 PreparedStatement
     -> 10.5 ResultSet -> 10.6 CallableStatement -> 10.7 transactions -> 10.8 batch
     -> 10.9 connection pooling -> 10.10 best practices.
   Each topic() renders sections in declared order; see assets/site.js PART_LABELS. */
registerModule({
  id: "jdbc",
  module: "JDBC",
  page: "module-jdbc.html",
  icon: "🛢️",
  tagline: "Talk to relational databases from Java — safely and efficiently.",
  lessons: [

    /* ===================== BASIC ===================== */

    /* 10.1 JDBC Architecture. */
    topic({
      id: "jdbc-architecture", chapter: "10.1", title: "JDBC Architecture",
      subtitle: "The API, the driver, and how Java talks to any database.",
      readTime: "15 min", level: "Foundational", deep: true,
      objectives: [
        "Explain what JDBC is and the problem it solves.",
        "Describe the layered architecture: app → JDBC API → DriverManager → driver → DB.",
        "Identify the core interfaces (Connection, Statement, ResultSet).",
        "Outline the standard JDBC workflow."
      ],
      concept: `**JDBC (Java Database Connectivity)** is the standard Java API for interacting with **relational databases** (MySQL, PostgreSQL, Oracle, etc.). It defines a **vendor-neutral set of interfaces** (in \`java.sql\`) so your code talks to any database the same way; each database vendor supplies a **driver** that implements those interfaces.

\`\`\`java
import java.sql.*;

try (Connection conn = DriverManager.getConnection(url, user, pass);
     Statement st = conn.createStatement();
     ResultSet rs = st.executeQuery("SELECT name FROM users")) {
    while (rs.next()) System.out.println(rs.getString("name"));
}
\`\`\`

This is **abstraction** in action (Module 2 §2.10/§2.12): you program to interfaces (\`Connection\`, \`Statement\`, \`ResultSet\`) and the driver provides the hidden implementation.`,
      why: `Without a standard, every database would need different Java code. JDBC solves this:

- **Database independence** — switch MySQL→PostgreSQL by changing the driver/URL, not your code.
- **Standard API** — learn once, use everywhere.
- **Foundation** — ORMs (Hibernate/JPA) and Spring Data are built on top of JDBC.

For backend interviews, JDBC fundamentals — \`PreparedStatement\` (SQL injection §10.4), transactions (§10.7), connection pooling (§10.9) — are frequently tested.`,
      layers: `**The layered architecture:**

\`\`\`
   Your Java code
        │  (uses java.sql interfaces)
   JDBC API  (Connection, Statement, ResultSet, ...)
        │
   DriverManager  (or DataSource)  -> selects a driver
        │
   JDBC Driver  (vendor-specific, e.g., mysql-connector-j)
        │  (DB wire protocol)
   Database
\`\`\`

- **JDBC API** — the interfaces you code against (\`java.sql\`).
- **DriverManager / DataSource** — obtains a \`Connection\` from the right driver.
- **Driver** — the vendor JAR translating JDBC calls into the DB's protocol.

Modern drivers are **Type 4** ("thin") — pure-Java drivers that talk the database's network protocol directly (no native code/bridge).`,
      coreInterfaces: `**The core \`java.sql\` interfaces (the rest of the module details each):**

| Interface | Role | Chapter |
|---|---|---|
| \`DriverManager\` / \`DataSource\` | obtain connections | §10.2 / §10.9 |
| \`Connection\` | a session with the DB | §10.2 |
| \`Statement\` | execute static SQL | §10.3 |
| \`PreparedStatement\` | parameterised SQL (safe) | §10.4 |
| \`CallableStatement\` | call stored procedures | §10.6 |
| \`ResultSet\` | query results (a cursor) | §10.5 |
| \`SQLException\` | DB errors (checked) | throughout |

All of these are **interfaces**; the driver provides concrete classes — you never see them directly.`,
      workflow: `**The standard JDBC workflow:**

1. **(Load driver)** — automatic since JDBC 4.0 (driver JAR on classpath self-registers via the service-provider mechanism; \`Class.forName\` no longer required).
2. **Get a \`Connection\`** — \`DriverManager.getConnection(url, user, pass)\` (or a \`DataSource\`/pool, §10.9).
3. **Create a statement** — \`createStatement\` / \`prepareStatement\` (§10.3/§10.4).
4. **Execute SQL** — \`executeQuery\` (SELECT → \`ResultSet\`) or \`executeUpdate\` (INSERT/UPDATE/DELETE → row count).
5. **Process results** — iterate the \`ResultSet\` (§10.5).
6. **Close resources** — \`ResultSet\`, \`Statement\`, \`Connection\` (use **try-with-resources**, Module 4 §4.10).

\`\`\`java
String url = "jdbc:mysql://localhost:3306/shop";   // jdbc:<vendor>://host:port/db
\`\`\``,
      internal: `Drivers self-register through the **\`ServiceLoader\`** mechanism: a JAR includes \`META-INF/services/java.sql.Driver\`, so just having it on the classpath registers it with \`DriverManager\` — which is why \`Class.forName("com.mysql.cj.jdbc.Driver")\` is **legacy** (pre-JDBC 4.0). The **JDBC URL** (\`jdbc:vendor://host:port/dbname?params\`) tells \`DriverManager\` which driver to use and how to connect. \`SQLException\` (checked, Module 4 §4.3) is thrown for DB errors and carries a vendor error code and SQL state. Real applications use a **\`DataSource\`** backed by a **connection pool** (§10.9) rather than \`DriverManager\` directly.`,
      useCases: `- **Direct DB access** in services/DAOs without an ORM.
- **The layer beneath ORMs** (Hibernate/JPA) and Spring's \`JdbcTemplate\`.
- **Batch/ETL** jobs and data migration scripts.
- **Reporting** and ad-hoc query tools.`,
      code: `\`\`\`java
import java.sql.*;

public class JdbcArchitectureDemo {
    public static void main(String[] args) {
        String url = "jdbc:h2:mem:demo";   // in-memory H2 for illustration
        // JDBC 4.0+: driver auto-registers; no Class.forName needed
        try (Connection conn = DriverManager.getConnection(url, "sa", "")) {
            try (Statement st = conn.createStatement()) {
                st.execute("CREATE TABLE users(id INT PRIMARY KEY, name VARCHAR(50))");
                st.executeUpdate("INSERT INTO users VALUES (1,'Shail'),(2,'Asha')");
            }
            try (Statement st = conn.createStatement();
                 ResultSet rs = st.executeQuery("SELECT id, name FROM users")) {
                while (rs.next())
                    System.out.println(rs.getInt("id") + " -> " + rs.getString("name"));
            }
        } catch (SQLException e) {
            System.out.println("DB error: " + e.getMessage() + " (state=" + e.getSQLState() + ")");
        }
    }
}
\`\`\``,
      mistakes: `- **Calling \`Class.forName\`** in modern code — unnecessary since JDBC 4.0 (auto-registration).
- **Not closing resources** — leaks connections (exhausts the pool); use try-with-resources (Module 4 §4.10).
- **Confusing \`executeQuery\` (SELECT) with \`executeUpdate\` (DML)** — wrong method type.
- **Coding to driver classes** instead of \`java.sql\` interfaces — breaks portability.
- **Ignoring \`SQLException\` details** (error code / SQL state) when diagnosing.
- **Using \`DriverManager\` per request** in production — use a pooled \`DataSource\` (§10.9).`,
      bestPractices: `- **Program to \`java.sql\` interfaces**; keep the driver as a swappable dependency.
- Use **try-with-resources** for \`Connection\`/\`Statement\`/\`ResultSet\` (Module 4 §4.10).
- Use a **\`DataSource\` + connection pool** (§10.9) in real apps, not \`DriverManager\`.
- Prefer **\`PreparedStatement\`** (§10.4) over \`Statement\` for parameters/security.
- Handle **\`SQLException\`** with context (log error code/SQL state); translate at boundaries (Module 4 §4.12).`,
      interview: `**Q1. What is JDBC?**
A standard Java API (\`java.sql\`) of interfaces for accessing relational databases; vendors supply drivers that implement them.

**Q2. Describe the JDBC architecture.**
App → JDBC API (interfaces) → DriverManager/DataSource → vendor driver → database.

**Q3. Do you still need Class.forName to load a driver?**
No — since JDBC 4.0 drivers auto-register via \`ServiceLoader\` when on the classpath.

**Q4. What's a Type 4 driver?**
A pure-Java "thin" driver that talks the DB's network protocol directly (no native code).

**Q5. executeQuery vs executeUpdate?**
\`executeQuery\` runs SELECT and returns a \`ResultSet\`; \`executeUpdate\` runs INSERT/UPDATE/DELETE/DDL and returns an affected-row count.

**Q6. What are the core JDBC interfaces?**
\`Connection\`, \`Statement\`/\`PreparedStatement\`/\`CallableStatement\`, \`ResultSet\`, plus \`DriverManager\`/\`DataSource\`.`,
      exercises: `1. Write the standard workflow against an in-memory DB (H2): connect, create table, insert, query, close.
2. Identify the JDBC URL parts for MySQL and PostgreSQL.
3. Print \`SQLException\`'s message, error code, and SQL state from a deliberate error.
4. Explain why \`Class.forName\` is no longer needed.`,
      challenges: `Set up a tiny DAO over an in-memory H2 database: a \`UserDao\` with \`create\`, \`findById\`, and \`findAll\` using the standard workflow and try-with-resources. Keep all code against \`java.sql\` interfaces so the same DAO would work against MySQL by swapping the URL/driver. Then describe where \`DriverManager\` would be replaced by a pooled \`DataSource\` (§10.9) in production and why.`,
      summary: `- **JDBC** = standard \`java.sql\` **interface** API for relational DBs; vendor **drivers** implement them (abstraction, Module 2 §2.10).
- Layers: **app → JDBC API → DriverManager/DataSource → driver → DB**; modern drivers are **Type 4** and **auto-register** (no \`Class.forName\`).
- Workflow: get **\`Connection\`** → **\`Statement\`/\`PreparedStatement\`** → **\`executeQuery\`/\`executeUpdate\`** → process **\`ResultSet\`** → **close** (try-with-resources).
- Use a pooled **\`DataSource\` (§10.9)** in production; prefer **\`PreparedStatement\` (§10.4)**. Details follow per interface.`
    }),

    /* 10.2 Connection. */
    topic({
      id: "connection", chapter: "10.2", title: "Connection & DriverManager",
      subtitle: "Opening, configuring, and closing a database session.",
      readTime: "13 min", level: "Core", deep: true,
      objectives: [
        "Obtain a Connection via DriverManager and understand the JDBC URL.",
        "Configure auto-commit, isolation, and read-only mode.",
        "Create statements and manage the connection lifecycle.",
        "Understand why connections are expensive (motivating pooling §10.9)."
      ],
      concept: `A **\`Connection\`** represents a **session** with the database — an open, authenticated channel over which you send SQL and receive results. You obtain one from **\`DriverManager\`** (or a \`DataSource\`/pool, §10.9) using a **JDBC URL**, credentials, and optional properties.

\`\`\`java
import java.sql.*;

String url = "jdbc:postgresql://localhost:5432/shop";
try (Connection conn = DriverManager.getConnection(url, "user", "pass")) {
    System.out.println("connected: " + !conn.isClosed());
    // create statements, run SQL, manage transactions...
}   // try-with-resources closes (releases) the connection
\`\`\`

A \`Connection\` is the **factory** for \`Statement\`/\`PreparedStatement\`/\`CallableStatement\` and the unit of **transaction** control (§10.7).`,
      why: `Everything in JDBC flows through a \`Connection\`: you can't run SQL without one, and it's where **transaction boundaries**, **isolation levels**, and **commit/rollback** live (§10.7). Understanding its lifecycle and cost is essential because **opening a connection is expensive** (network handshake, authentication), which is exactly why production uses **connection pools** (§10.9) to reuse them.`,
      url: `**The JDBC URL** identifies the database and driver:

\`\`\`
jdbc:<subprotocol>://<host>:<port>/<database>?<params>
\`\`\`

| Database | Example URL |
|---|---|
| MySQL | \`jdbc:mysql://localhost:3306/shop?useSSL=false\` |
| PostgreSQL | \`jdbc:postgresql://localhost:5432/shop\` |
| Oracle | \`jdbc:oracle:thin:@localhost:1521:XE\` |
| H2 (in-memory) | \`jdbc:h2:mem:test\` |

The \`subprotocol\` (e.g., \`mysql\`) tells \`DriverManager\` which registered driver to use. Credentials can be passed as arguments or via a \`Properties\` object.`,
      configuration: `**Key connection settings:**

| Method | Purpose |
|---|---|
| \`setAutoCommit(false)\` | begin manual transaction control (§10.7) |
| \`commit()\` / \`rollback()\` | end a transaction |
| \`setTransactionIsolation(level)\` | concurrency/consistency level (§10.7) |
| \`setReadOnly(true)\` | hint for read-only optimisation |
| \`createStatement()\` | make a \`Statement\` (§10.3) |
| \`prepareStatement(sql)\` | make a \`PreparedStatement\` (§10.4) |
| \`prepareCall(sql)\` | make a \`CallableStatement\` (§10.6) |
| \`getMetaData()\` | database/driver metadata |
| \`isClosed()\` / \`isValid(timeout)\` | connection health |

By default, **auto-commit is \`true\`** — every statement is its own transaction. Turn it off to group statements atomically (§10.7).`,
      internal: `A \`Connection\` wraps a live network socket to the DB plus server-side session state (transaction, temp tables, locks). \`close()\` releases it — but with a **pool** (§10.9), \`close()\` actually **returns the connection to the pool** for reuse rather than tearing down the socket. Because the handshake/auth is costly (often tens of milliseconds), creating a fresh connection per request doesn't scale — pools keep a set of warm connections. A \`Connection\` is generally **not thread-safe**; don't share one across threads — give each thread its own (the pool handles this).`,
      useCases: `- **Obtaining a session** to run any SQL.
- **Transaction control** — \`setAutoCommit(false)\` + commit/rollback (§10.7).
- **Per-DAO/per-request** connection usage (from a pool, §10.9).
- **Reading DB metadata** for tooling/migrations.`,
      code: `\`\`\`java
import java.sql.*;

public class ConnectionDemo {
    public static void main(String[] args) throws SQLException {
        String url = "jdbc:h2:mem:demo;DB_CLOSE_DELAY=-1";
        try (Connection conn = DriverManager.getConnection(url, "sa", "")) {
            // configure a transaction (details §10.7)
            conn.setAutoCommit(false);
            conn.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);

            try (Statement st = conn.createStatement()) {
                st.execute("CREATE TABLE t(id INT)");
                st.executeUpdate("INSERT INTO t VALUES (1)");
                conn.commit();                      // make it permanent
            } catch (SQLException e) {
                conn.rollback();                    // undo on failure
                throw e;
            }

            DatabaseMetaData meta = conn.getMetaData();
            System.out.println(meta.getDatabaseProductName());   // H2
        }
    }
}
\`\`\``,
      mistakes: `- **Not closing connections** — leaks them; with a pool, the pool is exhausted and the app hangs. Use try-with-resources (Module 4 §4.10).
- **Creating a new connection per query** in production — expensive; use a pool (§10.9).
- **Sharing one \`Connection\` across threads** — it isn't thread-safe.
- **Forgetting auto-commit is on by default** — each statement commits immediately; set \`false\` for multi-statement transactions (§10.7).
- **Hard-coding credentials** in source — use config/secret management.
- **Leaving \`setReadOnly\`/isolation at wrong values** for the workload.`,
      bestPractices: `- Obtain connections from a **\`DataSource\`/pool** (§10.9), not \`DriverManager\`, in real apps.
- **Always close** (return to pool) with try-with-resources.
- Set **\`autoCommit(false)\`** when grouping statements into a transaction; commit/rollback explicitly (§10.7).
- One connection **per thread**; never share.
- Externalise the **URL/credentials**; choose isolation/read-only to fit the workload.`,
      interview: `**Q1. What is a Connection in JDBC?**
A session with the database — the channel for SQL and the unit of transaction control; a factory for statements.

**Q2. What does a JDBC URL contain?**
\`jdbc:<subprotocol>://host:port/db?params\` — the subprotocol selects the driver.

**Q3. What is auto-commit and its default?**
When \`true\` (default), each statement is committed immediately as its own transaction; set \`false\` to control transactions manually (§10.7).

**Q4. Why are connections expensive, and the fix?**
They require a network handshake + authentication; reuse them via a **connection pool** (§10.9).

**Q5. Is a Connection thread-safe?**
No — use one per thread (the pool provides this).

**Q6. How do you close a connection reliably?**
try-with-resources (Module 4 §4.10); with a pool, \`close()\` returns it to the pool.`,
      exercises: `1. Open a connection to H2, print whether it's open and the DB product name.
2. Set \`autoCommit(false)\`, run two inserts, and commit; then a version that rolls back.
3. Read three pieces of \`DatabaseMetaData\`.
4. Explain why per-request \`DriverManager.getConnection\` is a problem at scale.`,
      challenges: `Write a small \`ConnectionFactory\` that returns connections (first via \`DriverManager\`, then refactored to a \`DataSource\`), used by a DAO under try-with-resources. Demonstrate transaction control (\`autoCommit(false)\` + commit/rollback). Then explain, with timing intuition, why opening a connection per request fails to scale and how a pool (§10.9) fixes it.`,
      summary: `- A **\`Connection\`** is a DB **session** (from \`DriverManager\`/\`DataSource\` via a **JDBC URL**) and the unit of **transaction** control; it's a factory for statements.
- **Auto-commit defaults to \`true\`** — set \`false\` for multi-statement transactions (§10.7); configure isolation/read-only as needed.
- Connections are **expensive** and **not thread-safe** — use a **pool (§10.9)**, one per thread, and **always close** (try-with-resources).
- Next: executing SQL with **\`Statement\` (§10.3)** and **\`PreparedStatement\` (§10.4)**.`
    }),

    /* 10.3 Statement. */
    topic({
      id: "statement", chapter: "10.3", title: "Statement",
      subtitle: "Executing static SQL — and why it's risky for dynamic input.",
      readTime: "13 min", level: "Core", deep: true,
      objectives: [
        "Use Statement to execute static SQL (query and update).",
        "Choose between execute, executeQuery, and executeUpdate.",
        "Understand the SQL-injection danger of building SQL with string concatenation.",
        "Know when Statement is acceptable vs when to use PreparedStatement (§10.4)."
      ],
      concept: `A **\`Statement\`** executes **static SQL** against the database. You get one from a \`Connection\` (§10.2) and call one of three execute methods depending on the SQL type.

\`\`\`java
import java.sql.*;

try (Statement st = conn.createStatement()) {
    // query -> ResultSet (§10.5)
    ResultSet rs = st.executeQuery("SELECT * FROM users");
    // DML/DDL -> affected row count
    int rows = st.executeUpdate("UPDATE users SET active = true WHERE id = 1");
}
\`\`\`

\`Statement\` sends the SQL **as text** to the DB each time, where it's parsed, planned, and executed.`,
      why: `\`Statement\` is the simplest way to run SQL and is fine for **fixed, parameter-free** statements (DDL, one-off admin queries). But the moment you incorporate **user input** by concatenating it into the SQL string, \`Statement\` becomes **dangerous** (SQL injection) and **slow** (re-parsing every call) — which is why \`PreparedStatement\` (§10.4) is the default for real queries.`,
      executeMethods: `**The three execute methods:**

| Method | For | Returns |
|---|---|---|
| \`executeQuery(sql)\` | SELECT | a \`ResultSet\` (§10.5) |
| \`executeUpdate(sql)\` | INSERT/UPDATE/DELETE, DDL | int row count (0 for DDL) |
| \`execute(sql)\` | any (when type unknown) | boolean (true if a ResultSet) |

\`\`\`java
boolean hasResult = st.execute(sql);
if (hasResult) { ResultSet rs = st.getResultSet(); }
else           { int count = st.getUpdateCount(); }
\`\`\`

Use the specific method when you know the SQL type; \`execute\` is for generic/unknown SQL.`,
      injection: `**The SQL-injection danger** — the single most important reason to avoid \`Statement\` with input:

\`\`\`java
// ❌ DANGEROUS: user input concatenated into SQL
String name = request.getParameter("name");
ResultSet rs = st.executeQuery("SELECT * FROM users WHERE name = '" + name + "'");

// If name = "' OR '1'='1"  the query becomes:
//   SELECT * FROM users WHERE name = '' OR '1'='1'   -> returns ALL rows!
// Worse: name = "x'; DROP TABLE users; --"  can destroy data.
\`\`\`

Concatenating untrusted input lets attackers **alter the query's meaning**. The fix is **\`PreparedStatement\`** with bound parameters (§10.4), which sends data **separately** from the SQL so it can never be interpreted as code.`,
      internal: `Each \`Statement.execute*\` call ships the full SQL text to the DB, which **parses and builds an execution plan** every time — so repeating a similar query (with different literals) re-parses repeatedly, wasting DB CPU. \`PreparedStatement\` (§10.4) avoids this by precompiling once and reusing the plan. A \`Statement\` is tied to its \`Connection\` and produces \`ResultSet\`s that close when the statement closes. \`execute\` exists for tools that run arbitrary SQL and must discover the result shape via \`getResultSet\`/\`getUpdateCount\`.`,
      useCases: `- **DDL**: \`CREATE\`/\`ALTER\`/\`DROP\` (no parameters).
- **Static admin/maintenance** queries with no external input.
- **One-off scripts** where the SQL is fully controlled by the developer.
- **Generic SQL runners** (\`execute\` + result inspection) — carefully, with trusted input.`,
      code: `\`\`\`java
import java.sql.*;

public class StatementDemo {
    public static void main(String[] args) throws SQLException {
        try (Connection conn = DriverManager.getConnection("jdbc:h2:mem:d;DB_CLOSE_DELAY=-1","sa","");
             Statement st = conn.createStatement()) {
            // DDL (fine with Statement)
            st.execute("CREATE TABLE product(id INT PRIMARY KEY, name VARCHAR(50), price DECIMAL)");

            // static DML
            int inserted = st.executeUpdate(
                "INSERT INTO product VALUES (1,'Pen',1.5),(2,'Notebook',3.0)");
            System.out.println("inserted " + inserted);   // 2

            // query
            try (ResultSet rs = st.executeQuery("SELECT name, price FROM product ORDER BY price")) {
                while (rs.next())
                    System.out.println(rs.getString("name") + " = " + rs.getBigDecimal("price"));
            }
            // ❌ never do: "... WHERE name = '" + userInput + "'"  -> use PreparedStatement (§10.4)
        }
    }
}
\`\`\``,
      mistakes: `- **Concatenating user input into SQL** — SQL injection; the cardinal JDBC sin (use \`PreparedStatement\`, §10.4).
- **Using \`Statement\` for repeated parameterised queries** — re-parses each time and invites injection.
- **Wrong execute method** — \`executeQuery\` for DML or \`executeUpdate\` for SELECT throws/behaves wrong.
- **Not closing \`Statement\`/\`ResultSet\`** — leaks resources (Module 4 §4.10).
- **Assuming \`executeUpdate\` returns rows of data** — it returns a **count**.
- **Building dynamic SQL by hand** for values that should be bound parameters.`,
      bestPractices: `- Use \`Statement\` only for **static, parameter-free, trusted** SQL (mainly DDL/admin).
- For anything with **input or repetition**, use **\`PreparedStatement\`** (§10.4) — safer and faster.
- **Never** concatenate untrusted input into SQL.
- Pick the **specific execute method** for the SQL type; close statements/result sets (try-with-resources).
- Keep SQL readable and reviewed; avoid hand-built dynamic SQL for values.`,
      interview: `**Q1. What is a Statement used for?**
Executing static SQL via \`executeQuery\` (SELECT→ResultSet), \`executeUpdate\` (DML/DDL→count), or \`execute\` (unknown type→boolean).

**Q2. What's the danger of Statement with user input?**
SQL injection — concatenated input can change the query's meaning (e.g., \`' OR '1'='1\`); use \`PreparedStatement\`.

**Q3. executeQuery vs executeUpdate vs execute?**
SELECT→ResultSet; DML/DDL→row count; unknown→boolean (then \`getResultSet\`/\`getUpdateCount\`).

**Q4. Why is Statement slower for repeated queries?**
The DB re-parses and re-plans the SQL text every call; \`PreparedStatement\` precompiles once.

**Q5. When is Statement acceptable?**
For static, developer-controlled SQL with no external input — typically DDL/admin.

**Q6. What does executeUpdate return?**
The number of affected rows (0 for DDL).`,
      exercises: `1. Run DDL + static INSERT + SELECT with a \`Statement\`.
2. Demonstrate (in a sandbox) how concatenating \`' OR '1'='1\` returns all rows; then fix with \`PreparedStatement\` (§10.4).
3. Use \`execute\` and branch on \`getResultSet\`/\`getUpdateCount\`.
4. Show \`executeUpdate\` returning the affected-row count.`,
      challenges: `Build a small "user lookup" using a \`Statement\` with concatenated input, then exploit it with an injection string in a local sandbox to dump all rows. Rewrite it with a \`PreparedStatement\` (§10.4) and verify the same input is now treated as data. Write a short explanation of why parameter binding defeats injection and why \`Statement\` should be reserved for static SQL.`,
      summary: `- A **\`Statement\`** runs **static SQL**: \`executeQuery\` (SELECT→ResultSet), \`executeUpdate\` (DML/DDL→count), \`execute\` (unknown→boolean).
- **Never concatenate untrusted input** into SQL — it causes **SQL injection**; \`Statement\` also **re-parses** repeated SQL (slow).
- Reserve \`Statement\` for **static, trusted** SQL (DDL/admin); use **\`PreparedStatement\` (§10.4)** for parameters/repetition.
- Close statements/result sets (try-with-resources, Module 4 §4.10).`
    }),

    /* 10.4 PreparedStatement. */
    topic({
      id: "preparedstatement", chapter: "10.4", title: "PreparedStatement",
      subtitle: "Parameterised, precompiled SQL — the safe and fast default.",
      readTime: "15 min", level: "Core", deep: true,
      objectives: [
        "Use PreparedStatement with ? placeholders and setXxx binding.",
        "Explain how it prevents SQL injection and improves performance.",
        "Handle parameter types, nulls, and generated keys.",
        "Adopt PreparedStatement as the default over Statement (§10.3)."
      ],
      concept: `A **\`PreparedStatement\`** is a **precompiled, parameterised** SQL statement. You write the SQL with **\`?\` placeholders** and **bind** values with type-specific \`setXxx\` methods. It's the **default** way to run SQL in JDBC — safer and faster than \`Statement\` (§10.3).

\`\`\`java
import java.sql.*;

String sql = "SELECT * FROM users WHERE name = ? AND age > ?";
try (PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setString(1, userName);     // bind parameter 1 (1-based!)
    ps.setInt(2, 18);              // bind parameter 2
    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) { /* ... */ }
    }
}
\`\`\`

Parameters are **1-indexed**. Values are sent to the DB **separately** from the SQL text — so input can never be interpreted as code.`,
      why: `\`PreparedStatement\` is the default for two big reasons:

1. **Security** — it **prevents SQL injection** (§10.3): bound parameters are treated strictly as **data**, never as SQL. This alone makes it mandatory for any query with input.
2. **Performance** — the SQL is **precompiled once** (parsed + planned by the DB), then reused with different parameters, avoiding repeated parsing — a big win in loops/hot paths.

Plus it handles **type conversion** and **escaping** for you (quotes, dates, nulls), so you don't build SQL strings by hand.`,
      binding: `**Binding parameters with \`setXxx\` (1-based index):**

| Method | Type |
|---|---|
| \`setString(i, s)\` | text |
| \`setInt\`/\`setLong\`/\`setDouble\` | numbers |
| \`setBoolean\` | boolean |
| \`setBigDecimal\` | exact decimals (money) |
| \`setDate\`/\`setTimestamp\` | dates/times (java.sql) |
| \`setObject(i, value)\` | generic (handles many types) |
| \`setNull(i, Types.XXX)\` | SQL NULL |

\`\`\`java
ps.setString(1, name);
ps.setBigDecimal(2, price);
if (note == null) ps.setNull(3, Types.VARCHAR); else ps.setString(3, note);
\`\`\`

Bind by **position** (\`?\`) — JDBC core doesn't support named parameters (frameworks like Spring's \`NamedParameterJdbcTemplate\` add them).`,
      injectionPrevention: `**How it stops SQL injection** — compare with §10.3:

\`\`\`java
// ❌ Statement: input becomes part of the SQL text
st.executeQuery("SELECT * FROM users WHERE name = '" + input + "'");
//    input = "' OR '1'='1"  -> returns all rows

// ✅ PreparedStatement: input is bound as DATA
ps = conn.prepareStatement("SELECT * FROM users WHERE name = ?");
ps.setString(1, input);     // even "' OR '1'='1" is treated as a literal name -> no match
\`\`\`

The DB receives the **query structure** (with placeholders) and the **values** separately; the values never change the parsed query. This is the **single most important JDBC security practice**.`,
      generatedKeys: `**Retrieving auto-generated keys** (e.g., an auto-increment id) after an insert:

\`\`\`java
String sql = "INSERT INTO users(name) VALUES (?)";
try (PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
    ps.setString(1, "Shail");
    ps.executeUpdate();
    try (ResultSet keys = ps.getGeneratedKeys()) {
        if (keys.next()) System.out.println("new id = " + keys.getLong(1));
    }
}
\`\`\`

Request \`RETURN_GENERATED_KEYS\` when preparing, then read \`getGeneratedKeys()\` after \`executeUpdate\`.`,
      internal: `When you \`prepareStatement(sql)\`, the driver sends the SQL **with placeholders** to the DB, which **parses and caches an execution plan** keyed by the statement text. Subsequent executions with different bound values **reuse** that plan — saving parse/plan cost (especially valuable with **batching**, §10.8, and connection pools that cache prepared statements). Because parameters are transmitted out-of-band (not spliced into the SQL string), the parser never sees user data as syntax — the structural reason injection is impossible. \`PreparedStatement\` extends \`Statement\`, so it has the same \`executeQuery\`/\`executeUpdate\`/\`execute\` (but called **without** the SQL argument, since the SQL is already bound).`,
      useCases: `- **Any query with parameters** (the default) — lookups, inserts, updates, deletes.
- **Repeated execution** with different values (loops, batch §10.8).
- **Inserts needing generated keys**.
- **Safe handling of user input** everywhere — the universal anti-injection tool.`,
      code: `\`\`\`java
import java.sql.*;
import java.math.BigDecimal;

public class PreparedStatementDemo {
    public static void main(String[] args) throws SQLException {
        try (Connection conn = DriverManager.getConnection("jdbc:h2:mem:d;DB_CLOSE_DELAY=-1","sa","")) {
            try (Statement st = conn.createStatement()) {
                st.execute("CREATE TABLE product(id IDENTITY PRIMARY KEY, name VARCHAR(50), price DECIMAL)");
            }
            // parameterised insert + generated key
            try (PreparedStatement ps = conn.prepareStatement(
                     "INSERT INTO product(name, price) VALUES (?, ?)",
                     Statement.RETURN_GENERATED_KEYS)) {
                ps.setString(1, "Pen");
                ps.setBigDecimal(2, new BigDecimal("1.50"));
                ps.executeUpdate();
                try (ResultSet keys = ps.getGeneratedKeys()) {
                    if (keys.next()) System.out.println("id = " + keys.getLong(1));
                }
            }
            // safe parameterised query (injection-proof)
            try (PreparedStatement ps = conn.prepareStatement("SELECT name FROM product WHERE price < ?")) {
                ps.setBigDecimal(1, new BigDecimal("2.00"));
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) System.out.println(rs.getString("name"));
                }
            }
        }
    }
}
\`\`\``,
      mistakes: `- **Using \`Statement\` + concatenation** instead of \`PreparedStatement\` — SQL injection (§10.3).
- **0-based parameter index** — JDBC parameters are **1-based** (\`setString(1, ...)\`).
- **Calling \`executeQuery(sql)\` with an argument** on a \`PreparedStatement\` — use the **no-arg** execute methods (the SQL is already set).
- **Wrong \`setXxx\` type** or not handling \`null\` (use \`setNull\`).
- **Trying to parameterise table/column names** — only **values** can be bound, not identifiers/SQL keywords.
- **Not closing** the statement/result set (Module 4 §4.10).`,
      bestPractices: `- **Default to \`PreparedStatement\`** for all parameterised/repeated SQL — security + performance.
- Bind with the correct **type-specific \`setXxx\`** (1-based); use \`setNull\`/\`setBigDecimal\` for nulls/money.
- Use **\`RETURN_GENERATED_KEYS\`** for auto-increment ids.
- **Never** build value SQL by concatenation; for dynamic identifiers, whitelist them (can't be bound).
- Reuse a prepared statement for **batches** (§10.8); close with try-with-resources.`,
      interview: `**Q1. PreparedStatement vs Statement?**
\`PreparedStatement\` uses precompiled, parameterised SQL (\`?\` + \`setXxx\`) — it prevents SQL injection and is faster for repeated execution; \`Statement\` runs static SQL and is injection-prone with input.

**Q2. How does it prevent SQL injection?**
Parameters are sent separately as data; the parsed query structure can't be altered by input, so input is never executed as SQL.

**Q3. Are parameters 0- or 1-indexed?**
1-indexed.

**Q4. How do you get an auto-generated key?**
Prepare with \`Statement.RETURN_GENERATED_KEYS\`, then read \`getGeneratedKeys()\` after \`executeUpdate\`.

**Q5. Can you bind table/column names with \`?\`?**
No — only values; identifiers must be whitelisted in code.

**Q6. Why is it faster for repeated queries?**
The DB precompiles/plans the SQL once and reuses the plan across executions.`,
      exercises: `1. Rewrite a concatenated \`Statement\` query as a \`PreparedStatement\` with bound parameters.
2. Insert a row and retrieve its generated key.
3. Bind a null value with \`setNull\` and a money value with \`setBigDecimal\`.
4. Show that an injection string passed as a bound parameter returns no rows (treated as data).`,
      challenges: `Build a parameterised DAO method \`findProducts(String nameLike, BigDecimal maxPrice)\` using a \`PreparedStatement\` with bound \`?\` parameters (use \`LIKE ?\`), returning a list of objects from the \`ResultSet\` (§10.5). Demonstrate it's injection-proof, retrieve generated keys on insert, and explain why you can't bind a dynamic \`ORDER BY\` column with \`?\` (and how to whitelist it instead).`,
      summary: `- **\`PreparedStatement\`** = precompiled, **parameterised** SQL (\`?\` + 1-based **\`setXxx\`**) — the **default** in JDBC.
- It **prevents SQL injection** (values sent as data, not SQL) and is **faster** for repeated execution (cached plan); handles typing/escaping/nulls.
- Use **\`RETURN_GENERATED_KEYS\`** for auto-increment ids; you can bind **values only**, not identifiers (whitelist those).
- Always prefer it over **\`Statement\` (§10.3)** for input/repetition; reuse it for **batches (§10.8)**.`
    }),

    /* 10.5 ResultSet. */
    topic({
      id: "resultset", chapter: "10.5", title: "ResultSet",
      subtitle: "Reading query results row by row.",
      readTime: "13 min", level: "Core", deep: true,
      objectives: [
        "Iterate a ResultSet and read columns by index or name.",
        "Map rows to Java objects (the DAO pattern).",
        "Handle SQL NULLs and data types correctly.",
        "Understand cursor types, scrollability, and fetch size."
      ],
      concept: `A **\`ResultSet\`** represents the **rows returned by a query** (\`executeQuery\`, §10.3/§10.4). It's a **cursor** positioned **before the first row**; you advance it with **\`next()\`** (which returns \`false\` when there are no more rows) and read columns with **\`getXxx\`**.

\`\`\`java
try (ResultSet rs = ps.executeQuery()) {
    while (rs.next()) {                       // advance to next row; false at end
        long id = rs.getLong("id");           // by column name
        String name = rs.getString(2);        // or by 1-based index
        System.out.println(id + ": " + name);
    }
}
\`\`\`

You read each row's columns **while the cursor is on that row**; once you \`next()\` past the end, the loop stops.`,
      why: `Every SELECT produces a \`ResultSet\`, so reading it correctly is fundamental. The common job is **mapping rows to Java objects** — the heart of the **DAO (Data Access Object)** pattern and what ORMs automate. Getting column access, NULL handling, and resource management right is essential for correct, leak-free data access.`,
      reading: `**Reading columns — by index (1-based) or name:**

| Method | Returns |
|---|---|
| \`getString(col)\` | text |
| \`getInt\`/\`getLong\`/\`getDouble\` | numbers |
| \`getBoolean\` | boolean |
| \`getBigDecimal\` | exact decimal (money) |
| \`getDate\`/\`getTimestamp\` | dates/times |
| \`getObject(col)\` / \`getObject(col, Class)\` | generic / typed |
| \`wasNull()\` | did the last column read return SQL NULL? |

\`\`\`java
int qty = rs.getInt("qty");
if (rs.wasNull()) qty = -1;            // distinguish 0 from NULL
\`\`\`

**By name** is more readable/robust to column reordering; **by index** is marginally faster. Use \`getObject(col, LocalDate.class)\` for \`java.time\` types (Module 3/§7.13).`,
      nullHandling: `**Handling SQL NULL** — a common bug: primitive getters return \`0\`/\`false\` for NULL, so you can't tell NULL from a real zero. Use **\`wasNull()\`** immediately after, or read objects:

\`\`\`java
Integer score = rs.getObject("score", Integer.class);   // null if SQL NULL
// or:
int s = rs.getInt("score");
boolean isNull = rs.wasNull();
\`\`\`

Prefer **\`getObject(col, WrapperType.class)\`** when a column is nullable, so NULL maps to \`null\`.`,
      cursorTypes: `**Cursor type, scrollability, and fetch size** (advanced control set when creating the statement):

- **Type**: \`TYPE_FORWARD_ONLY\` (default, can only \`next()\`), \`TYPE_SCROLL_INSENSITIVE\`/\`SENSITIVE\` (can move freely: \`previous\`, \`absolute\`, \`first\`/\`last\`).
- **Concurrency**: \`CONCUR_READ_ONLY\` (default) vs \`CONCUR_UPDATABLE\` (can update rows via the ResultSet).
- **Fetch size**: \`setFetchSize(n)\` hints how many rows to pull per round-trip — important for **large** result sets (avoid loading millions of rows at once).

\`\`\`java
Statement st = conn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
\`\`\`

Default forward-only/read-only is fastest and sufficient for most reads.`,
      internal: `A \`ResultSet\` is backed by a **database cursor**; depending on the driver and fetch size, rows are streamed from the DB in batches rather than all at once. It's **tied to its \`Statement\`** — closing the statement (or connection) closes the result set, and re-executing the statement closes the previous \`ResultSet\`. \`ResultSetMetaData\` (\`rs.getMetaData()\`) exposes column count/names/types for generic processing. For very large queries, set an appropriate **fetch size** (and keep the transaction open while streaming) to avoid memory blowups — otherwise some drivers buffer the entire result.`,
      useCases: `- **Mapping rows to objects/DTOs** (DAO pattern).
- **Aggregating/reporting** over query results.
- **Streaming large result sets** with a tuned fetch size.
- **Generic tools** using \`ResultSetMetaData\` to handle arbitrary queries.`,
      code: `\`\`\`java
import java.sql.*;
import java.util.*;

public class ResultSetDemo {
    record User(long id, String name, Integer age) {}   // age nullable

    static List<User> findAll(Connection conn) throws SQLException {
        List<User> users = new ArrayList<>();
        try (PreparedStatement ps = conn.prepareStatement("SELECT id, name, age FROM users");
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                long id = rs.getLong("id");
                String name = rs.getString("name");
                Integer age = rs.getObject("age", Integer.class);   // null-safe for NULL
                users.add(new User(id, name, age));                 // map row -> object
            }
        }
        return users;
    }
    public static void main(String[] args) throws SQLException {
        try (Connection conn = DriverManager.getConnection("jdbc:h2:mem:d;DB_CLOSE_DELAY=-1","sa","")) {
            try (Statement st = conn.createStatement()) {
                st.execute("CREATE TABLE users(id INT, name VARCHAR(50), age INT)");
                st.executeUpdate("INSERT INTO users VALUES (1,'Shail',30),(2,'Asha',NULL)");
            }
            findAll(conn).forEach(System.out::println);
        }
    }
}
\`\`\``,
      mistakes: `- **Reading columns without calling \`next()\`** — \`SQLException\` (cursor before first row).
- **0-based column index** — columns are **1-based**.
- **Primitive getters on nullable columns** — NULL becomes \`0\`/\`false\`; use \`getObject(..., Wrapper.class)\` or \`wasNull()\`.
- **Using the \`ResultSet\` after its \`Statement\`/\`Connection\` closes** — it's already closed.
- **Loading huge result sets** without a fetch size — memory blowup.
- **Not closing** the \`ResultSet\` (try-with-resources, Module 4 §4.10).`,
      bestPractices: `- Iterate with **\`while (rs.next())\`**; read columns **by name** for readability.
- Map rows to objects in a **DAO** method; use \`getObject(col, Wrapper.class)\` for **nullable** columns.
- Set a sensible **fetch size** for large queries; keep cursors **forward-only/read-only** unless you need more.
- **Close** the \`ResultSet\` (and statement/connection) with try-with-resources.
- Use \`ResultSetMetaData\` for generic/dynamic result handling.`,
      interview: `**Q1. What is a ResultSet?**
A cursor over the rows returned by a query; you advance with \`next()\` and read columns with \`getXxx\` (by index or name).

**Q2. Where does the cursor start?**
Before the first row — you must call \`next()\` before reading.

**Q3. Are columns 0- or 1-indexed?**
1-indexed.

**Q4. How do you handle SQL NULL for numbers?**
Use \`getObject(col, Integer.class)\` (returns null) or check \`wasNull()\` after a primitive getter.

**Q5. What are the ResultSet types?**
\`TYPE_FORWARD_ONLY\` (default) vs scrollable (\`SCROLL_INSENSITIVE/SENSITIVE\`); concurrency \`CONCUR_READ_ONLY\` vs \`CONCUR_UPDATABLE\`.

**Q6. How do you stream a large result set?**
Set an appropriate \`fetchSize\` and process rows incrementally, keeping the cursor/transaction open.`,
      exercises: `1. Query rows and read columns by both index and name.
2. Map result rows to a \`record\`/class in a DAO method.
3. Handle a nullable column with \`getObject\` and with \`wasNull()\`.
4. Use \`ResultSetMetaData\` to print column names and count for an arbitrary query.`,
      challenges: `Implement a generic row-mapper: given a \`ResultSet\`, use \`ResultSetMetaData\` to read every column into a \`Map<String,Object>\` per row, handling NULLs. Then build a typed DAO (\`findById\`, \`findAll\`) mapping rows to a \`record\`. Demonstrate correct NULL handling for a nullable column and set a fetch size for a large query, explaining why forward-only/read-only cursors are the efficient default.`,
      summary: `- A **\`ResultSet\`** is a **cursor** over query rows: start **before the first row**, advance with **\`next()\`** (false at end), read columns with **\`getXxx\`** (1-based index or name).
- **Map rows to objects** in DAO methods; for **nullable** columns use \`getObject(col, Wrapper.class)\` or \`wasNull()\` (primitives turn NULL into 0/false).
- Control **cursor type/concurrency/fetch size** for scrolling/updating/large streams; default forward-only/read-only is fastest.
- It's tied to its **\`Statement\`** — **close** via try-with-resources (Module 4 §4.10).`
    }),

    /* ===================== CORE ===================== */

    /* 10.6 CallableStatement. */
    topic({
      id: "callablestatement", chapter: "10.6", title: "CallableStatement & Stored Procedures",
      subtitle: "Calling stored procedures and functions from Java.",
      readTime: "12 min", level: "Core", deep: true,
      objectives: [
        "Call stored procedures with CallableStatement.",
        "Handle IN, OUT, and INOUT parameters.",
        "Understand the call escape syntax.",
        "Weigh stored procedures vs application-side logic."
      ],
      concept: `A **\`CallableStatement\`** (a subtype of \`PreparedStatement\`, §10.4) **calls stored procedures and functions** in the database. You create it with \`conn.prepareCall(...)\` using the **JDBC call escape syntax** \`{call proc(?, ?)}\`.

\`\`\`java
import java.sql.*;

try (CallableStatement cs = conn.prepareCall("{call get_user_count(?, ?)}")) {
    cs.setString(1, "active");                          // IN parameter
    cs.registerOutParameter(2, Types.INTEGER);          // OUT parameter
    cs.execute();
    int count = cs.getInt(2);                           // read the OUT value
}
\`\`\`

A **stored procedure** is precompiled SQL/logic stored *in the database*, callable by name — useful for encapsulating complex or performance-critical DB operations.`,
      why: `\`CallableStatement\` exists to invoke **database-resident logic**. Teams use stored procedures to:

- **Encapsulate** complex multi-statement operations close to the data (fewer round-trips).
- **Reuse** logic across applications/languages hitting the same DB.
- **Performance** — precompiled in the DB, can reduce network chatter.
- **Security/permissions** — grant execute on a proc without table access.

(There's an ongoing debate — stored-proc logic can be harder to version/test than application code; see below.)`,
      parameterTypes: `**Three parameter directions:**

| Direction | Meaning | Handling |
|---|---|---|
| **IN** | input to the procedure | \`setXxx(i, value)\` |
| **OUT** | output from the procedure | \`registerOutParameter(i, Types.X)\` then \`getXxx(i)\` |
| **INOUT** | both | \`setXxx\` + \`registerOutParameter\` + \`getXxx\` |

\`\`\`java
// {? = call fn(?)}  for a function returning a value
try (CallableStatement cs = conn.prepareCall("{? = call calc_tax(?)}")) {
    cs.registerOutParameter(1, Types.DECIMAL);   // return value
    cs.setBigDecimal(2, amount);                  // IN
    cs.execute();
    BigDecimal tax = cs.getBigDecimal(1);
}
\`\`\``,
      callSyntax: `**Call escape syntax** (portable across vendors; the driver translates to native syntax):

\`\`\`
{call procedure_name(?, ?, ...)}      -- a procedure
{? = call function_name(?, ...)}      -- a function with a return value
\`\`\`

Using the escape syntax (rather than vendor-specific \`EXEC\`/\`CALL\` SQL) keeps the call portable. Procedures may also return one or more **\`ResultSet\`s** (read with \`execute\`/\`getResultSet\` like a statement).`,
      internal: `\`CallableStatement\` extends \`PreparedStatement\`, so it inherits parameter binding (\`setXxx\`, 1-based) and execution methods, adding **\`registerOutParameter\`** and OUT/INOUT getters. The driver maps the escape syntax to the database's native procedure-call protocol. A single call can produce a mix of an update count, OUT parameters, and result sets, which you process in order. Because procedures run inside the DB, they execute within the **transaction** (§10.7) of the calling connection unless they manage their own.`,
      useCases: `- **Calling existing stored procedures** in enterprise databases.
- **Encapsulating complex DB operations** (batch updates, reports) server-side.
- **Functions** returning computed values (tax, pricing) close to the data.
- **Legacy integration** where business logic already lives in the DB.`,
      code: `\`\`\`java
import java.sql.*;
import java.math.BigDecimal;

public class CallableStatementDemo {
    public static void main(String[] args) throws SQLException {
        try (Connection conn = DriverManager.getConnection("jdbc:h2:mem:d;DB_CLOSE_DELAY=-1","sa","")) {
            // define a simple procedure (H2 alias) for illustration
            try (Statement st = conn.createStatement()) {
                st.execute("CREATE ALIAS double_it FOR \\"java.lang.Math.multiplyExact\\"");
            }
            // {? = call fn(?, ?)} : return value + two IN params
            try (CallableStatement cs = conn.prepareCall("{? = call double_it(?, ?)}")) {
                cs.registerOutParameter(1, Types.INTEGER);
                cs.setInt(2, 21);
                cs.setInt(3, 2);
                cs.execute();
                System.out.println("result = " + cs.getInt(1));   // 42
            }
        }
    }
}
\`\`\``,
      mistakes: `- **Forgetting \`registerOutParameter\`** before reading an OUT value — \`SQLException\`.
- **Mismatched SQL type** in \`registerOutParameter\` vs the procedure's actual type.
- **Using vendor-specific call syntax** instead of the portable \`{call ...}\` escape.
- **Wrong parameter index** (1-based) or mixing up IN/OUT positions.
- **Putting too much business logic in stored procedures** — hard to version/test (see best practices).
- **Not closing** the \`CallableStatement\` (try-with-resources, Module 4 §4.10).`,
      bestPractices: `- Use **\`prepareCall\`** with the **escape syntax** \`{call ...}\` / \`{? = call ...}\` for portability.
- **Register OUT/INOUT** parameters with the correct \`Types.*\` before \`execute\`.
- Prefer keeping **business logic in the application** (testable, versioned) unless there's a strong reason (performance, reuse, security) for a procedure.
- Treat procedure calls within your **transaction** (§10.7); close with try-with-resources.
- Document the procedure's contract (params, returns, side-effects).`,
      interview: `**Q1. What is CallableStatement?**
A \`PreparedStatement\` subtype for calling stored procedures/functions via \`prepareCall\` and the \`{call ...}\` escape syntax.

**Q2. What are IN, OUT, INOUT parameters?**
IN = input (\`setXxx\`); OUT = output (\`registerOutParameter\` + \`getXxx\`); INOUT = both.

**Q3. What's the call escape syntax?**
\`{call proc(?, ?)}\` for procedures, \`{? = call fn(?)}\` for functions — portable across vendors.

**Q4. How do you read an OUT parameter?**
Register it with \`registerOutParameter(i, Types.X)\` before execute, then \`getXxx(i)\` after.

**Q5. Stored procedure vs application logic — trade-offs?**
Procedures: fewer round-trips, reuse, DB-side security; but harder to version/test and tie logic to the DB. Often prefer application logic unless those benefits matter.

**Q6. Does CallableStatement support parameter binding like PreparedStatement?**
Yes — it extends it, so \`setXxx\` (1-based) and execution methods apply.`,
      exercises: `1. Call a function returning a value with \`{? = call fn(?)}\` and read the OUT param.
2. Register an OUT parameter and read it after \`execute\`.
3. Show the error from reading an OUT value without \`registerOutParameter\`.
4. List pros/cons of moving a piece of logic into a stored procedure.`,
      challenges: `Define a stored procedure/function in an in-memory DB that computes an order total (IN: order id; OUT: total), call it via \`CallableStatement\` with proper OUT registration, and read the result. Then implement the same logic in Java application code over \`PreparedStatement\`/\`ResultSet\`, and write a short comparison of testability, performance (round-trips), and maintainability to justify when you'd choose each.`,
      summary: `- **\`CallableStatement\`** (extends \`PreparedStatement\`) calls **stored procedures/functions** via \`prepareCall\` and the **escape syntax** \`{call proc(?)}\` / \`{? = call fn(?)}\`.
- Handle **IN** (\`setXxx\`), **OUT** (\`registerOutParameter\` + \`getXxx\`), and **INOUT** parameters (1-based); calls run in the connection's **transaction** (§10.7).
- Procedures encapsulate DB-side logic (fewer round-trips, reuse, security) but are **harder to version/test** — prefer application logic unless those benefits are needed.
- Close via try-with-resources; use portable escape syntax.`
    }),

    /* 10.7 Transactions. */
    topic({
      id: "transactions", chapter: "10.7", title: "Transactions",
      subtitle: "Atomic, consistent, isolated, durable units of work.",
      readTime: "16 min", level: "Advanced", deep: true,
      objectives: [
        "Control transactions with autoCommit, commit, and rollback.",
        "Explain ACID and the four isolation levels.",
        "Use savepoints for partial rollback.",
        "Apply the correct transaction pattern with try/catch/finally."
      ],
      concept: `A **transaction** is a group of SQL operations treated as a **single, all-or-nothing unit of work**: either **all** succeed (\`commit\`) or **none** take effect (\`rollback\`). In JDBC you control transactions on the **\`Connection\`** (§10.2) by turning off **auto-commit**.

\`\`\`java
conn.setAutoCommit(false);            // begin manual transaction
try {
    // ... several statements ...
    conn.commit();                    // make all changes permanent
} catch (SQLException e) {
    conn.rollback();                  // undo ALL changes on any failure
    throw e;
} finally {
    conn.setAutoCommit(true);         // restore default (esp. for pooled connections)
}
\`\`\`

The canonical example: transferring money — debit one account and credit another must **both** happen or **neither**.`,
      why: `Without transactions, a partial failure leaves data **inconsistent** (money debited but not credited). Transactions guarantee **integrity** under failures and concurrency. By default JDBC is in **auto-commit** mode (each statement commits immediately, §10.2), so to make multiple statements atomic you must explicitly manage the transaction. This is core to any system that modifies related data.`,
      acid: `**ACID — the transaction guarantees:**

| Property | Meaning |
|---|---|
| **Atomicity** | all-or-nothing (commit or rollback) |
| **Consistency** | moves the DB from one valid state to another (constraints hold) |
| **Isolation** | concurrent transactions don't corrupt each other |
| **Durability** | once committed, changes survive crashes (persisted) |

JDBC gives you **A** (commit/rollback) and **I** (isolation levels, below); the **DB** enforces **C** (constraints) and **D** (durable storage).`,
      isolation: `**Isolation levels** trade consistency against concurrency by controlling which **read phenomena** are allowed:

| Level | Dirty read | Non-repeatable read | Phantom read |
|---|---|---|---|
| \`READ_UNCOMMITTED\` | ✅ possible | ✅ | ✅ |
| \`READ_COMMITTED\` (common default) | ❌ | ✅ | ✅ |
| \`REPEATABLE_READ\` | ❌ | ❌ | ✅ |
| \`SERIALIZABLE\` | ❌ | ❌ | ❌ |

- **Dirty read**: reading another transaction's uncommitted change.
- **Non-repeatable read**: re-reading a row returns a different value (it was updated/committed).
- **Phantom read**: re-running a range query returns new rows (inserts committed).

Set with \`conn.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED)\`. Higher isolation = more consistency but **less concurrency** (more locking). Pick the lowest level that's correct for your use case.`,
      savepoints: `**Savepoints** allow **partial rollback** within a transaction — undo to a marked point without discarding everything:

\`\`\`java
conn.setAutoCommit(false);
stmt.executeUpdate("INSERT ...");           // step 1
Savepoint sp = conn.setSavepoint("afterStep1");
try {
    stmt.executeUpdate("RISKY UPDATE ...");  // step 2
} catch (SQLException e) {
    conn.rollback(sp);                       // undo only step 2, keep step 1
}
conn.commit();
\`\`\`

Useful for long transactions where some sub-steps are optional/recoverable.`,
      internal: `Turning off auto-commit implicitly **begins** a transaction; the next \`commit\`/\`rollback\` ends it and a new one begins. The DB enforces isolation via **locking** or **MVCC** (multi-version concurrency control). With **connection pools** (§10.9), a connection is reused, so you must **reset \`autoCommit\` (and isolation)** before returning it, or the next borrower inherits your settings — a subtle bug. Frameworks (Spring \`@Transactional\`) automate this begin/commit/rollback/cleanup so you don't hand-write it, but it's the same JDBC mechanism underneath. \`rollback\` is also implicitly triggered if the connection closes without commit.`,
      useCases: `- **Multi-step writes** that must be atomic (transfers, order + line items + inventory).
- **Consistency under concurrency** (isolation levels for read correctness).
- **Long operations** with optional sub-steps (savepoints).
- **Batch loads** that should all-or-nothing commit (§10.8).`,
      code: `\`\`\`java
import java.sql.*;

public class TransactionDemo {
    static void transfer(Connection conn, int from, int to, int amt) throws SQLException {
        conn.setAutoCommit(false);
        try (PreparedStatement debit  = conn.prepareStatement("UPDATE acct SET bal = bal - ? WHERE id = ?");
             PreparedStatement credit = conn.prepareStatement("UPDATE acct SET bal = bal + ? WHERE id = ?")) {
            debit.setInt(1, amt);  debit.setInt(2, from);  debit.executeUpdate();
            credit.setInt(1, amt); credit.setInt(2, to);   credit.executeUpdate();
            conn.commit();                       // both succeed -> permanent
        } catch (SQLException e) {
            conn.rollback();                     // any failure -> undo BOTH
            throw e;
        } finally {
            conn.setAutoCommit(true);            // restore (important for pools)
        }
    }
}
\`\`\``,
      mistakes: `- **Leaving auto-commit on** for multi-statement work — each statement commits separately, so a mid-failure leaves partial data.
- **Forgetting to \`rollback\`** in the catch — partial changes persist.
- **Not resetting \`autoCommit\`/isolation** on pooled connections — leaks settings to the next user (§10.9).
- **Over-using \`SERIALIZABLE\`** — kills concurrency; choose the lowest correct level.
- **Catching the exception but not rethrowing/handling** — silent data issues (Module 4 §4.13).
- **Long transactions** holding locks — increase contention/deadlock risk (Module 8 §8.8).`,
      bestPractices: `- For multi-statement units, **\`setAutoCommit(false)\`** → work → **\`commit\`**, with **\`rollback\` in catch** and **reset auto-commit in finally**.
- Choose the **lowest isolation level** that's correct; understand the read phenomena.
- Keep transactions **short** to reduce lock contention (Module 8 §8.8).
- Use **savepoints** for partial rollback in long transactions.
- In frameworks, prefer declarative transactions (Spring \`@Transactional\`); always **reset** pooled-connection state (§10.9).`,
      interview: `**Q1. What is a transaction and how do you control it in JDBC?**
An all-or-nothing unit of work; set \`autoCommit(false)\`, then \`commit()\` on success or \`rollback()\` on failure.

**Q2. What does ACID stand for?**
Atomicity, Consistency, Isolation, Durability.

**Q3. Name the isolation levels and the phenomena they prevent.**
READ_UNCOMMITTED (allows dirty/non-repeatable/phantom), READ_COMMITTED (no dirty), REPEATABLE_READ (no dirty/non-repeatable), SERIALIZABLE (none).

**Q4. What is the default auto-commit behaviour?**
On — each statement commits immediately; turn it off for transactions.

**Q5. What's a savepoint?**
A marker enabling partial rollback within a transaction (\`rollback(savepoint)\`).

**Q6. Why reset autoCommit on pooled connections?**
Reused connections would otherwise inherit your transaction settings, causing subtle bugs.`,
      exercises: `1. Implement an atomic transfer (debit+credit) with commit/rollback.
2. Show that with auto-commit on, a mid-failure leaves partial data; fix with a transaction.
3. Set different isolation levels and describe which read phenomena each allows.
4. Use a savepoint to roll back only the second of three statements.`,
      challenges: `Build an order-placement transaction: insert an order, insert its line items, and decrement inventory — all atomic. Demonstrate rollback when inventory is insufficient (the order/items must not persist), and add a savepoint so an optional "apply loyalty points" step can fail without aborting the whole order. Then explain isolation-level choice for reading current inventory under concurrency (Module 8) and why resetting auto-commit matters with pooling (§10.9).`,
      summary: `- A **transaction** is an **all-or-nothing** unit: \`setAutoCommit(false)\` → statements → **\`commit\`**, or **\`rollback\`** on failure (reset auto-commit in \`finally\`).
- **ACID** = Atomicity, Consistency, Isolation, Durability; JDBC gives commit/rollback (A) and **isolation levels** (I) controlling dirty/non-repeatable/phantom reads.
- Choose the **lowest correct isolation**, keep transactions **short** (lock contention, Module 8 §8.8), and use **savepoints** for partial rollback.
- With **pools (§10.9)** always **reset** auto-commit/isolation; frameworks (Spring \`@Transactional\`) automate this over the same JDBC mechanism.`
    }),

    /* 10.8 Batch Processing. */
    topic({
      id: "batch-processing", chapter: "10.8", title: "Batch Processing",
      subtitle: "Executing many statements efficiently in one round-trip.",
      readTime: "12 min", level: "Advanced", deep: true,
      objectives: [
        "Use addBatch/executeBatch to group statements.",
        "Combine batching with PreparedStatement and transactions.",
        "Understand the performance gain (fewer round-trips).",
        "Handle batch sizing and partial-failure semantics."
      ],
      concept: `**Batch processing** sends **multiple SQL statements to the database in a single round-trip** instead of one at a time. With a \`PreparedStatement\` (§10.4) you set parameters, call **\`addBatch()\`** to queue each set, then **\`executeBatch()\`** to send them all at once.

\`\`\`java
String sql = "INSERT INTO users(name, age) VALUES (?, ?)";
try (PreparedStatement ps = conn.prepareStatement(sql)) {
    for (User u : users) {
        ps.setString(1, u.name());
        ps.setInt(2, u.age());
        ps.addBatch();                 // queue this row
    }
    int[] counts = ps.executeBatch();  // send ALL at once -> one round-trip
}
\`\`\`

This turns N network round-trips into ~1, which is dramatically faster for bulk inserts/updates.`,
      why: `The dominant cost of many small DB operations is **network latency per round-trip**, not the SQL itself. Inserting 10,000 rows one-by-one means 10,000 round-trips; batching sends them in a few large requests — often **10–100× faster**. Batching is essential for **bulk loads, ETL, and migrations**.`,
      api: `**The batch API:**

| Method | Purpose |
|---|---|
| \`addBatch()\` | queue the current parameter set (\`PreparedStatement\`) |
| \`addBatch(sql)\` | queue a static SQL (\`Statement\`) |
| \`executeBatch()\` | execute all queued; returns \`int[]\` of per-statement counts |
| \`clearBatch()\` | discard the queue |
| \`executeLargeBatch()\` | \`long[]\` counts for very large batches (Java 8) |

\`executeBatch()\` returns an array where each element is the update count for that statement (or \`SUCCESS_NO_INFO\`/\`EXECUTE_FAILED\`).`,
      withTransactions: `**Batch + transaction + chunking** — the production pattern for large loads:

\`\`\`java
conn.setAutoCommit(false);                 // batch within a transaction (§10.7)
int BATCH_SIZE = 1000;
int n = 0;
try (PreparedStatement ps = conn.prepareStatement(sql)) {
    for (Record r : records) {
        bind(ps, r);
        ps.addBatch();
        if (++n % BATCH_SIZE == 0) {
            ps.executeBatch();             // flush every 1000 to bound memory
        }
    }
    ps.executeBatch();                     // remaining
    conn.commit();
} catch (SQLException e) {
    conn.rollback();
    throw e;
}
\`\`\`

**Chunk** the batch (e.g., 500–1000) so you don't buffer millions of rows in memory, and wrap it in a **transaction** so the whole load is atomic (and faster — one commit). Many drivers also need \`rewriteBatchedStatements=true\` (MySQL) to truly batch on the wire.`,
      internal: `Without batching, each \`executeUpdate\` is a separate request/response. Batching accumulates parameter sets client-side and ships them together, so the DB processes them with minimal protocol overhead. Combined with a **transaction**, you also avoid a commit per row (each commit forces a durable write — §10.7's D). On **partial failure**, behaviour is driver-dependent: a \`BatchUpdateException\` is thrown and you can inspect its \`getUpdateCounts()\` to see which succeeded; some drivers stop at the first failure, others continue — so design loads to be **idempotent**/restartable. Batching pairs especially well with \`PreparedStatement\`'s cached plan (§10.4).`,
      useCases: `- **Bulk inserts/updates** (importing CSVs, seeding data).
- **ETL / data migration** jobs moving many rows.
- **Logging/metrics flushing** in batches.
- **Any loop of similar DML** — batch it instead of executing per iteration.`,
      code: `\`\`\`java
import java.sql.*;
import java.util.*;

public class BatchDemo {
    public static void main(String[] args) throws SQLException {
        try (Connection conn = DriverManager.getConnection("jdbc:h2:mem:d;DB_CLOSE_DELAY=-1","sa","")) {
            try (Statement st = conn.createStatement()) {
                st.execute("CREATE TABLE n(v INT)");
            }
            conn.setAutoCommit(false);
            try (PreparedStatement ps = conn.prepareStatement("INSERT INTO n(v) VALUES (?)")) {
                for (int i = 1; i <= 5000; i++) {
                    ps.setInt(1, i);
                    ps.addBatch();
                    if (i % 1000 == 0) ps.executeBatch();   // flush in chunks
                }
                ps.executeBatch();                           // remaining
                conn.commit();
            } catch (SQLException e) { conn.rollback(); throw e; }

            try (Statement st = conn.createStatement();
                 ResultSet rs = st.executeQuery("SELECT COUNT(*) FROM n")) {
                rs.next(); System.out.println("rows = " + rs.getInt(1));   // 5000
            }
        }
    }
}
\`\`\``,
      mistakes: `- **Executing per-row instead of batching** — N round-trips; huge performance loss for bulk work.
- **One giant batch** without chunking — buffers everything in memory (OOM); flush every ~1000.
- **Batching with auto-commit on** — you lose the single-commit speedup and atomicity; use a transaction (§10.7).
- **Ignoring \`BatchUpdateException\`** / partial-failure semantics — handle/inspect \`getUpdateCounts()\`.
- **Forgetting driver flags** (e.g., MySQL \`rewriteBatchedStatements=true\`) — batching may not actually combine on the wire.
- **Not making loads idempotent** — re-running after a partial failure double-inserts.`,
      bestPractices: `- Use **\`PreparedStatement\` + \`addBatch\`/\`executeBatch\`** for bulk DML.
- **Chunk** batches (~500–1000) and wrap in a **transaction** (§10.7) for atomicity + one commit.
- Tune **driver-specific flags** for true wire-level batching.
- Handle **\`BatchUpdateException\`** and design loads to be **idempotent/restartable**.
- Close resources (try-with-resources); reset auto-commit afterward (esp. with pools §10.9).`,
      interview: `**Q1. What is JDBC batch processing?**
Grouping multiple statements with \`addBatch\` and sending them together via \`executeBatch\` — reducing round-trips for bulk DML.

**Q2. Why is it faster?**
It minimises per-statement network round-trips (and, within a transaction, avoids a commit per row).

**Q3. What does executeBatch return?**
An \`int[]\` of per-statement update counts (or \`SUCCESS_NO_INFO\`/\`EXECUTE_FAILED\`).

**Q4. How do you handle very large batches?**
Flush in chunks (e.g., every 1000) to bound memory, within a transaction.

**Q5. How are partial failures handled?**
A \`BatchUpdateException\` is thrown; inspect \`getUpdateCounts()\`; behaviour (stop vs continue) is driver-dependent — design idempotent loads.

**Q6. Should batching use a transaction?**
Yes — for atomicity and to commit once rather than per row.`,
      exercises: `1. Insert 5000 rows one-by-one vs batched; compare timing.
2. Chunk a large batch every 1000 and commit once at the end.
3. Inspect the \`int[]\` returned by \`executeBatch\`.
4. Simulate a partial failure and read \`BatchUpdateException.getUpdateCounts()\`.`,
      challenges: `Build a CSV importer: read a large file with NIO.2 \`Files.lines\` (Module 9 §9.7), parse rows, and bulk-insert with a chunked \`PreparedStatement\` batch inside a transaction, flushing every 1000 and committing once. Add restartability (idempotent upserts) so a partial failure can be re-run safely. Measure the speedup vs per-row inserts and explain the round-trip and commit-cost reductions.`,
      summary: `- **Batch processing** queues statements with **\`addBatch\`** and sends them together via **\`executeBatch\`** — turning N round-trips into ~1 (10–100× faster for bulk DML).
- Combine with **\`PreparedStatement\`** + a **transaction** (§10.7); **chunk** (~1000) to bound memory and commit once.
- Handle **\`BatchUpdateException\`**/partial failures; make loads **idempotent**; set driver batch flags.
- Essential for **bulk loads/ETL/migrations**; close resources and reset auto-commit (pools §10.9).`
    }),

    /* ===================== ADVANCED ===================== */

    /* 10.9 Connection Pooling. */
    topic({
      id: "connection-pooling", chapter: "10.9", title: "Connection Pooling",
      subtitle: "Reusing connections for scalable database access.",
      readTime: "14 min", level: "Advanced", deep: true,
      objectives: [
        "Explain why connection pooling is essential for performance.",
        "Use a DataSource backed by a pool (e.g., HikariCP).",
        "Configure key pool parameters (size, timeouts).",
        "Understand how close() returns connections to the pool."
      ],
      concept: `A **connection pool** maintains a set of **pre-opened, reusable** database connections. Instead of opening a new \`Connection\` per request (expensive, §10.2), your app **borrows** one from the pool and **returns** it when done. Pools are exposed through the **\`javax.sql.DataSource\`** interface — the production-standard way to get connections.

\`\`\`java
import com.zaxxer.hikari.*;
import javax.sql.DataSource;

HikariConfig cfg = new HikariConfig();
cfg.setJdbcUrl("jdbc:postgresql://localhost:5432/shop");
cfg.setUsername("user"); cfg.setPassword("pass");
cfg.setMaximumPoolSize(10);
DataSource ds = new HikariDataSource(cfg);

try (Connection conn = ds.getConnection()) {   // BORROW from pool
    // use it...
}   // close() RETURNS it to the pool (doesn't actually close the socket)
\`\`\`

**HikariCP** is the de-facto modern pool (also used by Spring Boot by default).`,
      why: `Opening a DB connection is **costly** (TCP handshake, authentication, session setup — often tens of ms, §10.2). Under load, opening one per request:

- **Destroys throughput** (latency dominated by connection setup).
- **Overwhelms the DB** (too many concurrent connections).

Pooling solves both: connections are **created once and reused**, and the pool **bounds** the number of concurrent connections to protect the database. **Every real application uses a pool** — \`DriverManager\` per request is for demos only.`,
      howItWorks: `**The borrow/return cycle:**

1. The pool pre-creates a few connections at startup.
2. \`ds.getConnection()\` hands out an **idle** connection (or waits/creates up to the max).
3. Your code uses it within try-with-resources.
4. **\`conn.close()\` returns it to the pool** — it's reset and made available again, **not** physically closed.
5. The pool validates/evicts stale connections and grows/shrinks within configured bounds.

\`\`\`
[app] --getConnection()--> [POOL: idle conns] --> borrowed
[app] --close()---------> returned to pool (reused)
\`\`\`

This is why \`close()\` is still mandatory — without it the connection is never returned and the pool **leaks** until exhausted (then requests block/timeout).`,
      configuration: `**Key pool parameters (HikariCP names):**

| Setting | Purpose |
|---|---|
| \`maximumPoolSize\` | max concurrent connections (the main knob) |
| \`minimumIdle\` | min idle connections kept ready |
| \`connectionTimeout\` | how long \`getConnection\` waits before failing |
| \`idleTimeout\` | when idle connections are retired |
| \`maxLifetime\` | max age of a connection before recycling |
| \`validationTimeout\` / test query | health checks |

**Sizing:** bigger isn't better — too many connections overwhelm the DB. A common guideline is a **modest pool** (e.g., \`cores * 2\` to a few dozen) tuned by load testing; the DB, not the app, is usually the bottleneck.`,
      internal: `A pool wraps each pooled connection in a **proxy/wrapper** whose \`close()\` intercepts the call and **returns the underlying connection** to the pool (resetting state like auto-commit, §10.7) instead of closing the socket. It runs background tasks to **validate**, **evict** idle/old connections, and **enforce limits**. If all connections are borrowed, \`getConnection\` **blocks up to \`connectionTimeout\`** then throws — a sign of a leak (unclosed connections) or undersized pool. Frameworks (Spring Boot) auto-configure a HikariCP \`DataSource\` from properties, and \`@Transactional\` borrows/returns connections around transaction boundaries (§10.7).`,
      useCases: `- **Every production web/service app** accessing a database.
- **High-concurrency** request handling (bounded DB connections).
- **Spring Boot / app servers** — pooled \`DataSource\` is the default.
- **Batch jobs** reusing a few connections for many operations.`,
      code: `\`\`\`java
// Illustrative — requires HikariCP on the classpath
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;
import java.sql.*;

public class PoolDemo {
    static DataSource buildPool() {
        HikariConfig cfg = new HikariConfig();
        cfg.setJdbcUrl("jdbc:h2:mem:d;DB_CLOSE_DELAY=-1");
        cfg.setUsername("sa"); cfg.setPassword("");
        cfg.setMaximumPoolSize(10);
        cfg.setConnectionTimeout(5000);   // ms to wait for a connection
        return new HikariDataSource(cfg);
    }
    public static void main(String[] args) throws SQLException {
        DataSource ds = buildPool();
        // borrow -> use -> return (close)
        try (Connection conn = ds.getConnection();
             Statement st = conn.createStatement()) {
            st.execute("CREATE TABLE t(id INT)");
            st.executeUpdate("INSERT INTO t VALUES (1)");
        }   // connection returned to the pool here, NOT physically closed
        try (Connection conn = ds.getConnection();          // reuses a pooled connection
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery("SELECT COUNT(*) FROM t")) {
            rs.next(); System.out.println("rows = " + rs.getInt(1));
        }
        ((HikariDataSource) ds).close();   // shut the pool down at app exit
    }
}
\`\`\``,
      mistakes: `- **Not closing borrowed connections** — they're never returned; the pool **leaks** and eventually \`getConnection\` times out (the #1 pooling bug). Always try-with-resources.
- **Using \`DriverManager\` per request** in production — no reuse, poor scalability.
- **Oversizing the pool** — too many connections overload the DB; size by load testing.
- **Not resetting connection state** — most pools reset auto-commit, but custom session state can leak between borrowers (§10.7).
- **Ignoring \`connectionTimeout\`/leak detection** — masks leaks instead of surfacing them.
- **Sharing one pooled connection across threads** — still not thread-safe (§10.2).`,
      bestPractices: `- **Always use a pooled \`DataSource\`** (e.g., HikariCP) in production; **never** \`DriverManager\` per request.
- **Always close** borrowed connections (try-with-resources) to return them.
- **Right-size** the pool (modest, load-tested) — the DB is usually the bottleneck.
- Configure **timeouts** and **leak detection**; ensure connection state (auto-commit/isolation) is reset (§10.7).
- Let frameworks (Spring Boot) manage the pool and transactions where possible.`,
      interview: `**Q1. Why is connection pooling needed?**
Opening connections is expensive; pooling reuses pre-opened connections and bounds their number, giving scalable, low-latency DB access.

**Q2. What happens when you call close() on a pooled connection?**
It's returned to the pool (reset and reused), not physically closed.

**Q3. What is a DataSource?**
The standard interface for obtaining connections; production uses a pool-backed \`DataSource\` instead of \`DriverManager\`.

**Q4. Name a popular pool and key settings.**
HikariCP; \`maximumPoolSize\`, \`connectionTimeout\`, \`idleTimeout\`, \`maxLifetime\`.

**Q5. What's the most common pooling bug?**
Not closing borrowed connections → pool leak → \`getConnection\` times out.

**Q6. Should the pool be as large as possible?**
No — too many connections overwhelm the DB; size modestly via load testing.`,
      exercises: `1. Configure a HikariCP \`DataSource\` and borrow/return connections in a loop.
2. Demonstrate (conceptually) that not closing connections exhausts the pool and times out.
3. Compare per-request \`DriverManager\` vs a pool for throughput.
4. List the effect of each key Hikari setting.`,
      challenges: `Wire a small DAO to a HikariCP \`DataSource\`, run many concurrent borrow/use/return cycles (Module 8 executor), and observe behaviour as you vary \`maximumPoolSize\` and deliberately leak a connection (skip close) to trigger a \`connectionTimeout\`. Explain how \`close()\`-returns-to-pool works, why right-sizing matters (DB bottleneck), and how Spring Boot/\`@Transactional\` automate borrow/return around transactions (§10.7).`,
      summary: `- A **connection pool** reuses pre-opened connections via a **\`DataSource\`** — essential because opening connections is **expensive** (§10.2) and unbounded connections overwhelm the DB.
- **\`getConnection()\` borrows; \`close()\` returns** the connection to the pool (not physically closed) — so closing is still mandatory or the pool **leaks**.
- Use **HikariCP** (Spring Boot default); right-size \`maximumPoolSize\` and set timeouts; reset connection state (§10.7).
- **Never** use \`DriverManager\` per request in production; the most common bug is **unclosed connections**.`
    }),

    /* 10.10 JDBC Best Practices (capstone). */
    topic({
      id: "jdbc-best-practices", chapter: "10.10", title: "JDBC Best Practices",
      subtitle: "Capstone — security, resources, transactions, and clean data access.",
      readTime: "15 min", level: "Advanced", deep: true,
      objectives: [
        "Consolidate JDBC security, resource, transaction, and performance practices.",
        "Apply the DAO pattern for clean data access.",
        "Avoid the common JDBC anti-patterns.",
        "Know when to move up to JdbcTemplate/JPA."
      ],
      concept: `This capstone distills Module 10 into **rules and habits** for production-grade data access. Robust JDBC comes down to five concerns: **security** (no injection), **resource safety** (no leaks), **correctness** (transactions), **performance** (pooling, batching, prepared statements), and **structure** (the DAO pattern). Get these right and your data layer is safe, fast, and maintainable.`,
      security: `**Security — never trust input:**

- **Always use \`PreparedStatement\`** (§10.4) with bound \`?\` parameters; **never concatenate** user input into SQL (§10.3) — this prevents **SQL injection**, the most critical DB vulnerability.
- Bind **values only**; **whitelist** dynamic identifiers (table/column/ORDER BY) since they can't be parameterised.
- Apply **least privilege** DB accounts; don't expose raw \`SQLException\` details to end users.

\`\`\`java
// ✅ always
ps = conn.prepareStatement("SELECT * FROM users WHERE id = ?");
ps.setLong(1, id);
\`\`\``,
      resources: `**Resource safety — close everything:**

- Use **try-with-resources** (Module 4 §4.10) for \`Connection\`, \`Statement\`/\`PreparedStatement\`, and \`ResultSet\` — they hold DB/OS resources.
- With a **pool** (§10.9), \`close()\` returns the connection; **not closing leaks the pool**.

\`\`\`java
try (Connection conn = ds.getConnection();
     PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setLong(1, id);
    try (ResultSet rs = ps.executeQuery()) {
        // map rows...
    }
}   // all closed/returned automatically
\`\`\``,
      transactionsPerf: `**Transactions & performance:**

- Group related writes in a **transaction** (\`autoCommit(false)\` → commit/rollback, §10.7); keep transactions **short** (lock contention, Module 8 §8.8); reset auto-commit on pooled connections.
- Use a **connection pool** (§10.9) — never \`DriverManager\` per request.
- Use **batching** (§10.8) for bulk DML; **\`PreparedStatement\`** (§10.4) precompiles and is faster for repeated queries.
- Set a **fetch size** for large \`ResultSet\`s (§10.5); avoid \`SELECT *\` — fetch only needed columns.`,
      daoPattern: `**Structure — the DAO (Data Access Object) pattern:** isolate all JDBC behind an interface so business logic doesn't touch SQL:

\`\`\`java
interface UserDao {
    Optional<User> findById(long id);
    List<User> findAll();
    long insert(User u);
}
class JdbcUserDao implements UserDao {
    private final DataSource ds;          // injected pool (§10.9)
    JdbcUserDao(DataSource ds){ this.ds = ds; }
    public Optional<User> findById(long id) {
        String sql = "SELECT id,name,age FROM users WHERE id = ?";
        try (Connection c = ds.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(map(rs)) : Optional.empty();   // Optional, §7.11
            }
        } catch (SQLException e) {
            throw new DataAccessException("findById failed", e);   // wrap (§4.11/§4.12)
        }
    }
    /* ... map(rs), findAll, insert ... */
}
\`\`\`

DAOs centralise SQL, mapping, and error translation — keeping the rest of the app database-agnostic (abstraction, Module 2 §2.10).`,
      internal: `The recurring theme: JDBC touches an **external, stateful, networked resource**, so the failure modes are **injection** (untrusted SQL), **leaks** (unclosed connections exhausting the pool), **inconsistency** (missing transactions), and **latency** (round-trips). \`PreparedStatement\` + pooling + batching + transactions address each. Wrapping \`SQLException\` (checked) into an unchecked domain exception (\`DataAccessException\`) at the DAO boundary (Module 4 §4.11/§4.12) keeps service code clean — exactly what Spring's \`JdbcTemplate\` and JPA do. Most production code uses those higher-level tools, but they're built on the JDBC fundamentals in this module.`,
      whenToMoveUp: `**When to move beyond raw JDBC:**

| Tool | When |
|---|---|
| **Spring \`JdbcTemplate\`** | remove JDBC boilerplate (resource handling, mapping) while keeping SQL control |
| **JPA / Hibernate** | object-relational mapping, less SQL, entity graphs |
| **Spring Data / jOOQ / MyBatis** | repositories, type-safe SQL, or SQL-mapping frameworks |

Raw JDBC is great for **learning**, **fine control**, and **performance-critical** paths; for most CRUD apps, a higher-level abstraction reduces boilerplate and bugs — but understanding JDBC underneath makes you far more effective with them.`,
      useCases: `- **Production DAOs/repositories** over a pooled \`DataSource\`.
- **Performance-critical queries** where you want full SQL control.
- **Bulk/ETL** with batching and transactions.
- **Foundation** for understanding \`JdbcTemplate\`/JPA behaviour and tuning.`,
      code: `\`\`\`java
import javax.sql.DataSource;
import java.sql.*;
import java.util.*;

public class JdbcBestPracticesDemo {
    // a clean DAO method: pooled connection, PreparedStatement, mapped result, wrapped error
    static List<String> activeUserNames(DataSource ds) {
        String sql = "SELECT name FROM users WHERE active = ? ORDER BY name";
        List<String> names = new ArrayList<>();
        try (Connection c = ds.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setBoolean(1, true);                         // bound param (no injection)
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) names.add(rs.getString("name"));
            }
        } catch (SQLException e) {
            throw new RuntimeException("query failed", e);  // translate at boundary (§4.12)
        }
        return names;
    }
}
\`\`\``,
      mistakes: `- **String-concatenated SQL** (injection) — always use \`PreparedStatement\` (§10.4).
- **Leaking connections/statements/result sets** — exhausts the pool; use try-with-resources.
- **\`DriverManager\` per request** / no pooling (§10.9).
- **Missing transactions** for multi-write ops, or **long** transactions holding locks (§10.7/Module 8 §8.8).
- **Per-row DML in loops** instead of **batching** (§10.8); \`SELECT *\` and no fetch size.
- **Leaking \`SQLException\`** through all layers — wrap into domain exceptions at the DAO (Module 4 §4.11/§4.12).`,
      bestPractices: `**The JDBC checklist:**

- **\`PreparedStatement\` always** for parameters; bind values, whitelist identifiers — **no injection** (§10.4).
- **try-with-resources** for every connection/statement/result set (Module 4 §4.10); **pool** connections (§10.9).
- Use **transactions** for related writes; keep them **short**; reset auto-commit on pooled connections (§10.7).
- **Batch** bulk DML (§10.8); fetch only needed columns; set fetch size for large reads (§10.5).
- Hide JDBC behind **DAOs**; **translate \`SQLException\`** into domain exceptions (Module 4 §4.12).
- Consider **\`JdbcTemplate\`/JPA** to cut boilerplate once you know the fundamentals.`,
      interview: `**Q1. How do you prevent SQL injection?**
Use \`PreparedStatement\` with bound parameters; never concatenate input; whitelist dynamic identifiers.

**Q2. How do you avoid resource leaks?**
try-with-resources for Connection/Statement/ResultSet; with a pool, closing returns the connection.

**Q3. How do you make multiple writes atomic?**
A transaction: \`autoCommit(false)\` → commit on success, rollback on failure (§10.7).

**Q4. How do you speed up bulk inserts?**
Batching (\`addBatch\`/\`executeBatch\`) within a transaction, chunked (§10.8).

**Q5. What is the DAO pattern?**
Encapsulating all data-access (SQL, mapping, error translation) behind an interface so business logic is DB-agnostic.

**Q6. When move from raw JDBC to JdbcTemplate/JPA?**
When you want less boilerplate/ORM features; raw JDBC suits learning, fine control, and hot paths.

**Q7. How should SQLException be handled across layers?**
Wrap it into an (often unchecked) domain exception at the DAO boundary, preserving the cause (Module 4 §4.12).`,
      exercises: `1. Refactor a string-concatenated query into a \`PreparedStatement\` DAO method.
2. Wrap a multi-write operation in a transaction with commit/rollback.
3. Convert a per-row insert loop into a chunked batch.
4. Build a \`UserDao\` interface + JDBC implementation that wraps \`SQLException\` into a domain exception.`,
      challenges: `Capstone: build a small, production-shaped data layer — a pooled \`DataSource\` (HikariCP, §10.9), a \`UserDao\` interface with a JDBC implementation using \`PreparedStatement\` + try-with-resources + \`Optional\` returns (§7.11), transactional multi-write methods (§10.7), a chunked batch importer (§10.8), and \`SQLException\` translated into an unchecked \`DataAccessException\` (Module 4 §4.11/§4.12). Justify each choice against the checklist, then describe what \`JdbcTemplate\`/JPA would automate — tying Module 10 together.`,
      summary: `- **Security**: \`PreparedStatement\` + bound params (no injection, §10.4); whitelist identifiers; least privilege.
- **Resources**: try-with-resources for all JDBC objects (Module 4 §4.10); **pool** connections (§10.9).
- **Correctness/perf**: **transactions** for related writes (short, §10.7), **batching** for bulk (§10.8), fetch only what you need (§10.5).
- **Structure**: hide JDBC behind **DAOs** and **translate \`SQLException\`** into domain exceptions (Module 4 §4.12); graduate to **\`JdbcTemplate\`/JPA** once fundamentals are solid — this capstone ties Module 10 together.`
    })
  ]
});
