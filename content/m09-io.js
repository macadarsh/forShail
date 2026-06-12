/* Module 9: File Handling & I/O — edit ONLY this file for this module's content.
   Authored at ~2x Module 2 depth (Module-3 style), ordered BASIC -> ADVANCED:
     9.1 overview -> 9.2 File class -> 9.3 byte streams -> 9.4 character streams
     -> 9.5 buffered streams -> 9.6 serialization -> 9.7 NIO.2 -> 9.8 best practices.
   Each topic() renders sections in declared order; see assets/site.js PART_LABELS. */
registerModule({
  id: "io",
  module: "File Handling & I/O",
  page: "module-io.html",
  icon: "📁",
  tagline: "Streams vs readers, files, serialization, and the modern NIO.2 API.",
  lessons: [

    /* ===================== BASIC ===================== */

    /* 9.1 I/O Overview. */
    topic({
      id: "io-overview", chapter: "9.1", title: "I/O Overview: Streams vs Readers/Writers",
      subtitle: "The big picture: byte streams vs character streams, and the class families.",
      readTime: "15 min", level: "Foundational", deep: true,
      objectives: [
        "Explain what I/O is and the stream abstraction.",
        "Distinguish byte streams (InputStream/OutputStream) from character streams (Reader/Writer).",
        "Map the core java.io class hierarchy.",
        "Choose the right family for binary vs text data."
      ],
      concept: `**I/O (Input/Output)** is how a program exchanges data with the outside world — files, network sockets, the console, or memory. Java models this with **streams**: an ordered **sequence of data** flowing from a **source** (input) or to a **destination** (output), processed one piece at a time.

Java's classic \`java.io\` package splits I/O into **two families** based on the data type:

- **Byte streams** — \`InputStream\` / \`OutputStream\` — read/write **raw bytes** (8-bit). For **binary** data: images, audio, PDFs, serialized objects.
- **Character streams** — \`Reader\` / \`Writer\` — read/write **characters** (16-bit, with encoding). For **text** data.

\`\`\`java
// byte stream (binary)
InputStream in = new FileInputStream("image.png");
// character stream (text)
Reader r = new FileReader("notes.txt");
\`\`\``,
      why: `The byte vs character split exists because **text needs character encoding** (UTF-8, etc.) to convert between bytes on disk and \`char\`s in memory (Module 3 §3.1), while binary data must be handled as **raw bytes** untouched. Using the wrong family corrupts data — reading a PNG with a \`Reader\` mangles it; writing text as raw bytes ignores encoding. Knowing which family to pick is the foundation of all file/network work.`,
      hierarchy: `**The \`java.io\` class hierarchy** (abstract base → concrete → decorators):

\`\`\`
BYTE STREAMS                      CHARACTER STREAMS
InputStream (abstract)            Reader (abstract)
 ├─ FileInputStream                ├─ FileReader
 ├─ ByteArrayInputStream           ├─ CharArrayReader / StringReader
 ├─ BufferedInputStream*           ├─ BufferedReader*
 ├─ ObjectInputStream* (§9.6)      └─ InputStreamReader (bridge, below)
 └─ DataInputStream*
OutputStream (abstract)           Writer (abstract)
 ├─ FileOutputStream               ├─ FileWriter
 ├─ BufferedOutputStream*          ├─ BufferedWriter*
 ├─ ObjectOutputStream* (§9.6)     ├─ PrintWriter
 └─ DataOutputStream*              └─ OutputStreamWriter (bridge)
\`\`\`

\`*\` = **decorators** (wrappers) that add behaviour to another stream — the **Decorator pattern** (Module 13). You compose them: \`new BufferedReader(new FileReader(...))\` (§9.5).`,
      bridges: `**Bridges between bytes and characters** — \`InputStreamReader\` / \`OutputStreamWriter\` convert between the two families using a **charset**:

\`\`\`java
// read a UTF-8 text file: bytes -> chars, explicitly specifying the encoding
Reader r = new InputStreamReader(new FileInputStream("data.txt"), StandardCharsets.UTF_8);
\`\`\`

Always specify the **charset** explicitly — relying on the platform default causes "works on my machine" encoding bugs. \`FileReader\`/\`FileWriter\` use the default charset (a common pitfall); prefer the explicit bridge or NIO.2 (§9.7) which take a charset.`,
      internal: `Each stream represents a connection to a resource and holds OS-level handles (file descriptors), so streams **must be closed** to release them (§9.8 / try-with-resources, Module 4 §4.10). Reads/writes are **sequential** by default — you consume the stream once, front to back. Raw streams hit the OS on each call, which is slow per byte/char; **buffered** wrappers (§9.5) batch reads/writes to dramatically improve performance. Beyond classic \`java.io\`, modern Java offers **NIO.2** (\`java.nio.file\`, §9.7) with \`Path\`/\`Files\` helpers and channels/buffers for higher-level and higher-performance I/O.`,
      useCases: `- **Byte streams**: copy/transfer binary files, read images, network sockets, object serialization (§9.6).
- **Character streams**: read/write text files, config, CSV, logs, generated reports.
- **Bridges**: decode a byte source (socket/file) as text with a known charset.
- **Buffered wrappers**: any non-trivial file read/write for performance (§9.5).`,
      code: `\`\`\`java
import java.io.*;
import java.nio.charset.StandardCharsets;

public class IoOverview {
    public static void main(String[] args) throws IOException {
        // text out (character stream)
        try (Writer w = new FileWriter("greeting.txt")) {
            w.write("Hello, I/O\\n");
        }
        // text in (character stream + buffering, §9.5)
        try (BufferedReader r = new BufferedReader(new FileReader("greeting.txt"))) {
            System.out.println(r.readLine());      // Hello, I/O
        }
        // binary copy (byte streams)
        try (InputStream in = new FileInputStream("greeting.txt");
             OutputStream out = new FileOutputStream("copy.txt")) {
            in.transferTo(out);                     // Java 9: copy bytes
        }
        // explicit charset bridge (recommended)
        try (Reader r = new InputStreamReader(new FileInputStream("greeting.txt"), StandardCharsets.UTF_8)) {
            int c = r.read();
        }
    }
}
\`\`\``,
      mistakes: `- **Using byte streams for text** (or vice versa) — corrupts data; pick the right family.
- **Ignoring charset** — \`FileReader\`/\`FileWriter\` use the platform default; always specify UTF-8 explicitly (bridge or NIO.2).
- **Not closing streams** — leaks file descriptors; use try-with-resources (Module 4 §4.10).
- **Reading one byte/char at a time** without buffering — very slow (§9.5).
- **Confusing the abstract base classes with concrete ones** — you instantiate \`FileInputStream\`, not \`InputStream\`.`,
      bestPractices: `- Choose **byte streams for binary**, **character streams for text**.
- Always specify an **explicit charset** (\`StandardCharsets.UTF_8\`) for text.
- Wrap with **buffered** streams (§9.5) for performance.
- Use **try-with-resources** (Module 4 §4.10) to close streams reliably.
- For new code, prefer the higher-level **NIO.2 \`Files\`** helpers (§9.7) where possible.`,
      interview: `**Q1. Difference between byte streams and character streams?**
Byte streams (\`InputStream\`/\`OutputStream\`) handle raw 8-bit bytes (binary); character streams (\`Reader\`/\`Writer\`) handle 16-bit characters with encoding (text).

**Q2. When use which?**
Byte streams for binary data (images, audio, serialized objects); character streams for text.

**Q3. What do InputStreamReader/OutputStreamWriter do?**
Bridge bytes↔characters using a charset.

**Q4. Why specify a charset explicitly?**
\`FileReader\`/\`FileWriter\` use the platform default, causing portability/encoding bugs; explicit UTF-8 is reliable.

**Q5. Why must streams be closed?**
They hold OS resources (file descriptors); not closing leaks them — use try-with-resources.

**Q6. What design pattern do buffered/data streams use?**
Decorator — they wrap and enhance another stream.`,
      exercises: `1. Write text to a file with a \`Writer\` and read it back with a \`BufferedReader\`.
2. Copy a binary file using \`FileInputStream\`/\`FileOutputStream\` (and \`transferTo\`).
3. Read a UTF-8 file via an \`InputStreamReader\` with an explicit charset.
4. Classify: PNG, .txt, serialized object, CSV — byte or character stream?`,
      challenges: `Write a small "file type copier": for a text file, read/write via character streams with explicit UTF-8 (count lines); for a binary file, copy via byte streams (count bytes). Wrap both in try-with-resources and report sizes. Then deliberately read the binary file with a \`Reader\` and show the corruption, explaining why the byte/character distinction and charset matter.`,
      summary: `- **I/O** uses **streams** (sequences of data); \`java.io\` splits into **byte streams** (\`InputStream\`/\`OutputStream\`, binary) and **character streams** (\`Reader\`/\`Writer\`, text).
- **Bridges** (\`InputStreamReader\`/\`OutputStreamWriter\`) convert bytes↔chars via a **charset** — always specify UTF-8 explicitly.
- Stream classes use the **Decorator** pattern (wrap to add buffering/data ops); always **close** them (try-with-resources, Module 4 §4.10).
- Next: the **File class (§9.2)**, **byte (§9.3)** and **character (§9.4)** streams, **buffering (§9.5)**, and modern **NIO.2 (§9.7)**.`
    }),

    /* 9.2 File Class. */
    topic({
      id: "file-class", chapter: "9.2", title: "The File Class",
      subtitle: "Representing and inspecting files and directories (the legacy API).",
      readTime: "13 min", level: "Core", deep: true,
      objectives: [
        "Use java.io.File to represent paths and query metadata.",
        "Create, delete, list, and navigate files/directories.",
        "Understand File's limitations and the NIO.2 Path alternative (§9.7).",
        "Avoid platform-specific path pitfalls."
      ],
      concept: `**\`java.io.File\`** is an **abstract representation of a file or directory path** — it represents the *path*, not the file's contents. You use it to **query metadata** (exists? size? directory?) and perform **filesystem operations** (create, delete, rename, list).

\`\`\`java
import java.io.File;

File f = new File("data/report.txt");   // just a path object — file may not exist yet
System.out.println(f.exists());          // false until created
System.out.println(f.getName());         // report.txt
System.out.println(f.isDirectory());     // false
\`\`\`

Creating a \`File\` object does **not** create a file on disk; it's a handle to a (possibly non-existent) path.`,
      why: `Before reading/writing you often need to **check and manage** the filesystem: does the file exist, is it readable, how big is it, list a directory, create folders. \`File\` provides these operations. (It's the **legacy** API — the modern **NIO.2 \`Path\`/\`Files\`** (§9.7) is preferred for new code, but \`File\` is ubiquitous in existing codebases and interviews.)`,
      operations: `**Common \`File\` operations:**

| Method | Purpose |
|---|---|
| \`exists()\` | does the path exist? |
| \`isFile()\` / \`isDirectory()\` | type check |
| \`getName()\` / \`getPath()\` / \`getAbsolutePath()\` | name / path strings |
| \`getParent()\` / \`getParentFile()\` | parent directory |
| \`length()\` | size in bytes |
| \`canRead()\`/\`canWrite()\`/\`canExecute()\` | permissions |
| \`lastModified()\` | timestamp (epoch millis) |
| \`createNewFile()\` | create empty file (returns boolean) |
| \`mkdir()\` / \`mkdirs()\` | create dir / dirs (incl. parents) |
| \`delete()\` / \`deleteOnExit()\` | remove |
| \`renameTo(File)\` | move/rename |
| \`list()\` / \`listFiles()\` | directory contents |

\`\`\`java
File dir = new File("output");
dir.mkdirs();                            // create output/ (and parents)
File log = new File(dir, "app.log");
log.createNewFile();
for (File child : dir.listFiles()) System.out.println(child.getName());
\`\`\``,
      pathPortability: `**Path portability** — file separators differ across OSes (\`/\` on Unix, \`\\\\\` on Windows). Don't hard-code separators:

\`\`\`java
// ❌ not portable
File bad = new File("data\\\\reports\\\\q1.txt");
// ✅ use File.separator or multi-arg constructor
File ok  = new File("data" + File.separator + "reports", "q1.txt");
\`\`\`

\`File.separator\` is the platform separator; the \`File(parent, child)\` constructor joins correctly. NIO.2's \`Path.of("data", "reports", "q1.txt")\` (§9.7) handles this more cleanly.`,
      internal: `A \`File\` is just a wrapper around a path **string** plus methods that call the OS. Its design has well-known **limitations** (why NIO.2 replaced it):

- Many methods **return \`boolean\`** instead of throwing — so a failed \`delete()\`/\`mkdir()\` is silently \`false\`, with **no reason** given.
- **Limited metadata** (no symbolic links, permissions, owners, file attributes).
- **No good directory-tree walking** or change-watching.
- Poor support for large directories.

NIO.2 \`Files\`/\`Path\` (§9.7) fixes these: methods **throw \`IOException\`** with details, support attributes, links, streams, and tree walking.`,
      useCases: `- **Pre-checks** before I/O: \`exists\`, \`canRead\`, \`length\`.
- **Setup**: create output directories (\`mkdirs\`), temp files (\`File.createTempFile\`).
- **Listing/filtering** directory contents (\`listFiles(FileFilter)\`).
- **Cleanup**: \`delete\`, \`deleteOnExit\` for temp files.
- Interop with APIs that take a \`File\` (many constructors: \`FileInputStream(File)\`).`,
      code: `\`\`\`java
import java.io.*;

public class FileDemo {
    public static void main(String[] args) throws IOException {
        File dir = new File("demo-out");
        if (dir.mkdirs()) System.out.println("created " + dir.getAbsolutePath());

        File file = new File(dir, "notes.txt");
        if (file.createNewFile()) System.out.println("file created");

        System.out.println("exists: " + file.exists());
        System.out.println("size: " + file.length() + " bytes");
        System.out.println("dir? " + file.isDirectory());

        // list with a filter
        File[] txts = dir.listFiles((d, name) -> name.endsWith(".txt"));
        if (txts != null) for (File f : txts) System.out.println(f.getName());

        // cleanup
        file.delete();
        dir.delete();
    }
}
\`\`\``,
      mistakes: `- **Assuming \`new File(...)\` creates a file** — it only represents a path; use \`createNewFile()\`/\`mkdirs()\`.
- **Ignoring \`boolean\` return values** — \`delete()\`/\`mkdir()\` failing silently (no exception); check the result (or use NIO.2 which throws).
- **Hard-coding path separators** — use \`File.separator\` / the \`(parent, child)\` constructor / \`Path\`.
- **\`listFiles()\` returning \`null\`** for non-directories or I/O errors — null-check it.
- **Using \`File\` for new code** when **NIO.2 \`Path\`/\`Files\`** (§9.7) is clearer and safer.`,
      bestPractices: `- For **new code, prefer NIO.2 \`Path\`/\`Files\`** (§9.7); use \`File\` for legacy interop.
- **Check return values** (or switch to NIO.2's exception-throwing methods).
- Build paths portably (\`File.separator\`, \`(parent, child)\`, or \`Path.of\`).
- Use \`File.createTempFile\` + \`deleteOnExit\` for temp files.
- Null-check \`listFiles()\`/\`list()\` results.`,
      interview: `**Q1. What does the File class represent?**
An abstract path to a file or directory — metadata and filesystem operations, not the file contents.

**Q2. Does \`new File("x.txt")\` create a file?**
No — it's just a path handle; use \`createNewFile()\`/\`mkdirs()\` to create on disk.

**Q3. mkdir() vs mkdirs()?**
\`mkdir\` creates a single directory (fails if parents missing); \`mkdirs\` creates the directory and any missing parents.

**Q4. What are File's main limitations?**
Boolean returns (silent failures, no error detail), limited metadata, poor tree-walking — fixed by NIO.2 (§9.7).

**Q5. How do you make paths portable?**
Use \`File.separator\`, the \`(parent, child)\` constructor, or \`Path.of(...)\`.

**Q6. Why prefer NIO.2 over File?**
\`Files\`/\`Path\` throw informative \`IOException\`, support attributes/links/streams, and offer better APIs.`,
      exercises: `1. Create a directory and a file inside it; print name, size, and existence.
2. List a directory filtering by extension with a \`FilenameFilter\`.
3. Show that \`delete()\` returns \`false\` (and gives no reason) when it fails; contrast with NIO.2.
4. Build a path portably using \`File.separator\` and the \`(parent, child)\` constructor.`,
      challenges: `Write a directory-size calculator: recursively walk a folder with \`listFiles()\`, summing file sizes and counting files/subdirectories, handling \`null\` results and unreadable entries. Then rewrite it with NIO.2 \`Files.walk\` (§9.7) and compare clarity and error handling — motivating why NIO.2 replaced \`File\` for tree operations.`,
      summary: `- **\`java.io.File\`** represents a file/directory **path** (not contents) and offers metadata queries + filesystem ops (create/delete/list/rename).
- \`new File\` doesn't touch disk; many methods return **\`boolean\`** (silent failures — check them).
- Build paths **portably**; null-check \`listFiles()\`.
- It's the **legacy** API — prefer **NIO.2 \`Path\`/\`Files\` (§9.7)** for new code (exceptions, attributes, tree walking).`
    }),

    /* 9.3 Byte Streams. */
    topic({
      id: "byte-streams", chapter: "9.3", title: "Byte Streams (InputStream/OutputStream)",
      subtitle: "Reading and writing raw binary data.",
      readTime: "14 min", level: "Core", deep: true,
      objectives: [
        "Use FileInputStream/FileOutputStream to read/write bytes.",
        "Understand read()/write() semantics and the -1 end-of-stream signal.",
        "Copy data efficiently with buffers and transferTo.",
        "Know the byte-stream decorators (Buffered/Data/Object)."
      ],
      concept: `**Byte streams** read and write **raw bytes** (8-bit) — the foundation for all binary I/O. The abstract bases are **\`InputStream\`** (read) and **\`OutputStream\`** (write); the most common concrete classes are **\`FileInputStream\`** and **\`FileOutputStream\`**.

\`\`\`java
import java.io.*;

try (InputStream in = new FileInputStream("photo.jpg");
     OutputStream out = new FileOutputStream("copy.jpg")) {
    int b;
    while ((b = in.read()) != -1) {   // read one byte; -1 = end of stream
        out.write(b);
    }
}
\`\`\`

\`read()\` returns an \`int\` (0–255) or **\`-1\` at end of stream**; \`write(int)\` writes the low 8 bits.`,
      why: `Byte streams handle **any** data exactly as stored — no encoding, no interpretation — which is essential for **binary** content (images, audio, video, PDFs, compressed files, serialized objects §9.6) and for **network** I/O where bytes are the wire format. They're also the substrate beneath character streams (which decode bytes into chars via a charset, §9.1/§9.4).`,
      readWrite: `**Core read/write methods:**

| Method | Effect |
|---|---|
| \`read()\` | one byte as int (0–255), or -1 at EOF |
| \`read(byte[] buf)\` | fill buffer, return count read (or -1) |
| \`read(byte[], off, len)\` | read into part of a buffer |
| \`write(int b)\` | write one byte |
| \`write(byte[] buf)\` | write whole array |
| \`write(byte[], off, len)\` | write part |
| \`flush()\` | force buffered bytes out (§9.5) |
| \`close()\` | release the stream |
| \`transferTo(out)\` (Java 9) | copy everything to another stream |
| \`readAllBytes()\` (Java 9) | read the whole stream into a \`byte[]\` |

**Reading byte-by-byte is slow** (one OS call each); read into a **buffer** (\`byte[]\`) for performance, or wrap in \`BufferedInputStream\` (§9.5).`,
      efficientCopy: `**Efficient copying — buffer-based vs one-byte:**

\`\`\`java
// ❌ slow: one byte per call
int b; while ((b = in.read()) != -1) out.write(b);

// ✅ fast: read chunks into a buffer
byte[] buf = new byte[8192];
int n;
while ((n = in.read(buf)) != -1) out.write(buf, 0, n);   // write exactly n bytes

// ✅ simplest (Java 9+):
in.transferTo(out);
\`\`\`

The buffer approach reduces OS calls ~8000×. Always write exactly \`n\` bytes (the last read may be partial).`,
      decorators: `**Byte-stream decorators** (Decorator pattern, Module 13) add capabilities:

| Decorator | Adds |
|---|---|
| \`BufferedInputStream\`/\`BufferedOutputStream\` | buffering for performance (§9.5) |
| \`DataInputStream\`/\`DataOutputStream\` | read/write primitives (\`readInt\`, \`writeDouble\`) portably |
| \`ObjectInputStream\`/\`ObjectOutputStream\` | object serialization (§9.6) |
| \`GZIPInputStream\`/\`GZIPOutputStream\` | compression |

\`\`\`java
try (DataOutputStream out = new DataOutputStream(
         new BufferedOutputStream(new FileOutputStream("data.bin")))) {
    out.writeInt(42);
    out.writeDouble(3.14);     // platform-independent binary format
}
\`\`\``,
      internal: `\`FileInputStream\`/\`FileOutputStream\` map to OS file descriptors; each unbuffered \`read()\`/\`write()\` is roughly a **system call**, which is why per-byte I/O is slow and buffering (§9.5) matters so much. \`FileOutputStream\` **truncates** the file by default; pass \`new FileOutputStream(path, true)\` to **append**. \`DataOutputStream\` writes primitives in a fixed **big-endian** format so they can be read back identically across platforms with \`DataInputStream\`. All byte streams must be **closed** (try-with-resources, Module 4 §4.10) to flush and release descriptors.`,
      useCases: `- **Copying/transferring binary files** (images, media, archives).
- **Reading/writing binary formats** with \`DataInput/OutputStream\`.
- **Object serialization** (§9.6) via \`Object*Stream\`.
- **Network sockets** (socket input/output streams).
- **Compression/encryption** stream wrappers.`,
      code: `\`\`\`java
import java.io.*;

public class ByteStreamDemo {
    public static void main(String[] args) throws IOException {
        // write some bytes (truncates) then append
        try (OutputStream out = new FileOutputStream("bytes.bin")) {
            out.write(new byte[]{1, 2, 3});
        }
        try (OutputStream out = new FileOutputStream("bytes.bin", true)) { // append
            out.write(new byte[]{4, 5});
        }
        // read all + buffered copy
        try (InputStream in = new BufferedInputStream(new FileInputStream("bytes.bin"));
             OutputStream out = new BufferedOutputStream(new FileOutputStream("bytes-copy.bin"))) {
            byte[] buf = new byte[4096];
            int n;
            while ((n = in.read(buf)) != -1) out.write(buf, 0, n);
        }
        System.out.println("copied " + new File("bytes-copy.bin").length() + " bytes");
    }
}
\`\`\``,
      mistakes: `- **Reading one byte at a time** without buffering — extremely slow; use a \`byte[]\` buffer or \`BufferedInputStream\`.
- **Writing \`buf\` instead of \`buf, 0, n\`** — writes stale bytes from a partially-filled last read.
- **Forgetting EOF is \`-1\`** (not 0) — \`read()\` returns -1 at end.
- **Using byte streams for text** without decoding — pick character streams/charset for text (§9.1).
- **Overwriting when you meant to append** — pass \`true\` to the \`FileOutputStream\` constructor.
- **Not closing** — leaks descriptors and may leave buffered data unflushed.`,
      bestPractices: `- Use byte streams for **binary** data; **buffer** them (§9.5) or read into a \`byte[]\`.
- Always write exactly the **\`n\` bytes** returned by \`read\`.
- Use **\`transferTo\`/\`readAllBytes\`** (Java 9+) for simple copies/reads.
- Use **\`DataOutputStream\`** for portable primitive binary formats.
- **Close** with try-with-resources (Module 4 §4.10); use append mode deliberately.`,
      interview: `**Q1. What do byte streams handle?**
Raw 8-bit bytes — binary data (\`InputStream\`/\`OutputStream\`, e.g., \`FileInputStream\`/\`FileOutputStream\`).

**Q2. What does \`read()\` return at end of stream?**
\`-1\` (it returns 0–255 for a byte otherwise).

**Q3. Why is per-byte reading slow, and the fix?**
Each call is ~a syscall; read into a \`byte[]\` buffer or wrap in \`BufferedInputStream\` (§9.5).

**Q4. How do you append instead of overwrite?**
\`new FileOutputStream(path, true)\`.

**Q5. What does DataOutputStream add?**
Methods to write primitives (\`writeInt\`, \`writeDouble\`) in a portable binary format, read back with \`DataInputStream\`.

**Q6. Byte stream vs character stream for a JPEG?**
Byte stream — it's binary; a character stream would corrupt it.`,
      exercises: `1. Copy a file byte-by-byte, then with an 8KB buffer; compare speed.
2. Use \`transferTo\` to copy and report bytes written.
3. Write and read primitives with \`DataOutputStream\`/\`DataInputStream\`.
4. Demonstrate append mode vs truncate with \`FileOutputStream\`.`,
      challenges: `Build a file-copy utility that buffers with a configurable chunk size, supports an append mode, and reports throughput (bytes/sec). Then add an optional \`GZIPOutputStream\` wrapper to copy-and-compress, and a \`DataOutputStream\` header (magic number + version) at the front. Verify you read back the header and decompress correctly, and explain why writing \`buf,0,n\` (not \`buf\`) is essential.`,
      summary: `- **Byte streams** (\`InputStream\`/\`OutputStream\`, e.g., \`FileInputStream\`/\`FileOutputStream\`) read/write **raw bytes** for binary data; \`read()\` returns **-1** at EOF.
- **Buffer** (read into a \`byte[]\` or use \`BufferedInputStream\`, §9.5) — per-byte I/O is slow; write exactly **\`n\`** bytes; use append mode deliberately.
- **Decorators** add features: Buffered (perf), **Data** (portable primitives), **Object** (serialization §9.6), GZIP (compression).
- Always **close** (Module 4 §4.10). For text, use **character streams (§9.4)**; for new code consider **NIO.2 (§9.7)**.`
    }),

    /* 9.4 Character Streams. */
    topic({
      id: "character-streams", chapter: "9.4", title: "Character Streams (Reader/Writer)",
      subtitle: "Reading and writing text with proper character encoding.",
      readTime: "13 min", level: "Core", deep: true,
      objectives: [
        "Use FileReader/FileWriter and the Reader/Writer hierarchy for text.",
        "Handle character encoding correctly (charset).",
        "Use PrintWriter for formatted text output.",
        "Know why buffering (§9.5) matters for text I/O."
      ],
      concept: `**Character streams** read and write **text** as \`char\`s (16-bit), handling the **encoding** that converts between bytes on disk and characters in memory (Module 3 §3.1). The abstract bases are **\`Reader\`** and **\`Writer\`**; common concrete classes are **\`FileReader\`**/**\`FileWriter\`** and the formatted **\`PrintWriter\`**.

\`\`\`java
import java.io.*;

try (Writer w = new FileWriter("notes.txt")) {
    w.write("Hello, text I/O\\n");
}
try (Reader r = new FileReader("notes.txt")) {
    int c;
    while ((c = r.read()) != -1) System.out.print((char) c);
}
\`\`\`

Like byte streams, \`read()\` returns \`-1\` at end of stream — but it returns a **character**, not a raw byte.`,
      why: `Text isn't just bytes — it must be **decoded/encoded** with a charset (UTF-8, ISO-8859-1, etc.). Character streams do this conversion for you, so you work with \`char\`s/Strings (Module 3) rather than manually decoding bytes. Use them for **all text**: files, config, CSV, logs, generated reports. (For raw binary, use byte streams §9.3.)`,
      classes: `**Key character-stream classes:**

| Class | Purpose |
|---|---|
| \`FileReader\` / \`FileWriter\` | read/write text files (uses default charset!) |
| \`InputStreamReader\` / \`OutputStreamWriter\` | byte↔char bridge with explicit charset (§9.1) |
| \`BufferedReader\` / \`BufferedWriter\` | buffering + \`readLine\`/\`newLine\` (§9.5) |
| \`PrintWriter\` | formatted text (\`print\`, \`println\`, \`printf\`) |
| \`CharArrayReader\` / \`StringReader\` | read from memory |

\`\`\`java
// PrintWriter: convenient formatted text output
try (PrintWriter pw = new PrintWriter(new FileWriter("report.txt"))) {
    pw.println("Title");
    pw.printf("Total: %.2f%n", 1234.5);
}
\`\`\``,
      encoding: `**Charset is critical** — and \`FileReader\`/\`FileWriter\` historically used the **platform default**, a classic portability bug. Specify the charset explicitly:

\`\`\`java
import java.nio.charset.StandardCharsets;

// ✅ explicit charset via the byte↔char bridge
Reader r = new InputStreamReader(new FileInputStream("data.txt"), StandardCharsets.UTF_8);
Writer w = new OutputStreamWriter(new FileOutputStream("out.txt"), StandardCharsets.UTF_8);

// Java 11+: FileReader/FileWriter accept a charset directly
Reader r2 = new FileReader("data.txt", StandardCharsets.UTF_8);
\`\`\`

Always use **UTF-8** unless a format demands otherwise; mismatched encodings produce mojibake (garbled characters).`,
      internal: `A character stream wraps a byte stream plus a **charset decoder/encoder**: a \`Reader\` reads bytes and decodes them into \`char\`s; a \`Writer\` encodes \`char\`s into bytes. Multi-byte characters (UTF-8) and surrogate pairs (Module 3 §3.1) are handled by the charset. \`PrintWriter\` never throws \`IOException\` from its print methods (it sets an internal error flag — check \`checkError()\`), and can **auto-flush** on \`println\` if constructed with \`autoFlush=true\`. As with all streams, character streams hold resources and must be **closed** (which also flushes pending output).`,
      useCases: `- **Reading/writing text files**: config, CSV, logs, source files.
- **Generating reports/output** with \`PrintWriter\` (\`printf\`/\`println\`).
- **Decoding network/byte text** with a known charset via the bridge.
- **Line-oriented processing** with \`BufferedReader.readLine\` (§9.5).`,
      code: `\`\`\`java
import java.io.*;
import java.nio.charset.StandardCharsets;

public class CharStreamDemo {
    public static void main(String[] args) throws IOException {
        // write text with explicit UTF-8 and formatting
        try (PrintWriter pw = new PrintWriter(
                new OutputStreamWriter(new FileOutputStream("people.txt"), StandardCharsets.UTF_8))) {
            pw.println("name,age");
            pw.printf("%s,%d%n", "Shail", 30);
            pw.printf("%s,%d%n", "Asha", 28);
        }
        // read it back with explicit UTF-8
        try (Reader r = new InputStreamReader(new FileInputStream("people.txt"), StandardCharsets.UTF_8)) {
            int c; StringBuilder sb = new StringBuilder();
            while ((c = r.read()) != -1) sb.append((char) c);
            System.out.print(sb);
        }
    }
}
\`\`\``,
      mistakes: `- **Relying on the default charset** (\`new FileReader(path)\`) — non-portable; specify UTF-8.
- **Using character streams for binary** — corrupts data; use byte streams (§9.3).
- **Reading char-by-char** without buffering — slow; wrap in \`BufferedReader\` (§9.5).
- **Expecting \`PrintWriter\` to throw on I/O errors** — it doesn't; check \`checkError()\`.
- **Forgetting to flush/close** — pending characters may not be written (close flushes).
- **Assuming \`read()\` returns a byte** — it returns a decoded \`char\` value.`,
      bestPractices: `- Use character streams for **text**, always with an **explicit charset** (UTF-8).
- Wrap with **\`BufferedReader\`/\`BufferedWriter\`** (§9.5) for performance and \`readLine\`/\`newLine\`.
- Use **\`PrintWriter\`** for formatted output; check \`checkError()\` if reliability matters.
- **Close** with try-with-resources (Module 4 §4.10) to flush and release.
- For new code, consider **\`Files.readString\`/\`writeString\`/\`newBufferedReader\`** (NIO.2, §9.7) which take a charset.`,
      interview: `**Q1. Character streams vs byte streams?**
Character streams (\`Reader\`/\`Writer\`) handle text with encoding (16-bit chars); byte streams handle raw binary (8-bit bytes).

**Q2. What's the problem with FileReader/FileWriter?**
They historically use the platform default charset — non-portable; specify the charset explicitly (Java 11+ overloads, or the byte↔char bridge).

**Q3. What is PrintWriter for?**
Formatted text output (\`print\`/\`println\`/\`printf\`); it doesn't throw on I/O errors (check \`checkError()\`).

**Q4. Why buffer character streams?**
Per-char reads/writes are slow; \`BufferedReader\`/\`BufferedWriter\` batch them and add \`readLine\`/\`newLine\` (§9.5).

**Q5. What does Reader.read() return at EOF?**
\`-1\` (otherwise a character value 0–65535).

**Q6. How do you read a UTF-8 file safely?**
Use \`InputStreamReader(..., StandardCharsets.UTF_8)\` or \`Files.newBufferedReader(path, UTF_8)\`.`,
      exercises: `1. Write and read a UTF-8 text file with explicit charset.
2. Use \`PrintWriter.printf\` to write a formatted CSV.
3. Show garbled output when writing UTF-8 and reading with a different charset.
4. Read a file char-by-char, then with a \`BufferedReader\`; compare.`,
      challenges: `Write a CSV writer/reader pair using \`PrintWriter\` (UTF-8) to output rows and a \`BufferedReader\` to parse them back into objects, handling the header and quoting. Demonstrate an encoding mismatch (write UTF-8, read Latin-1) producing mojibake, then fix it by specifying the charset on both ends — reinforcing why explicit charsets matter (Module 3 §3.1).`,
      summary: `- **Character streams** (\`Reader\`/\`Writer\`, e.g., \`FileReader\`/\`FileWriter\`, \`PrintWriter\`) handle **text** with charset encoding; \`read()\` returns a **char** (or -1 at EOF).
- **Always specify the charset explicitly** (UTF-8) — \`FileReader\`/\`FileWriter\` default to the platform charset (portability bug).
- Wrap with **\`BufferedReader\`/\`BufferedWriter\`** (§9.5) for speed and \`readLine\`/\`newLine\`; \`PrintWriter\` for formatting (check \`checkError()\`).
- Use byte streams (§9.3) for binary; **close** to flush/release; NIO.2 \`Files\` (§9.7) for new code.`
    }),

    /* ===================== CORE ===================== */

    /* 9.5 Buffered Streams. */
    topic({
      id: "buffered-streams", chapter: "9.5", title: "Buffered Streams",
      subtitle: "BufferedReader & BufferedWriter — performance and convenience.",
      readTime: "13 min", level: "Core", deep: true,
      objectives: [
        "Explain how buffering improves I/O performance.",
        "Use BufferedReader.readLine and BufferedWriter.newLine.",
        "Understand flushing and when data actually hits the destination.",
        "Apply buffering to both byte and character streams."
      ],
      concept: `**Buffered streams** wrap another stream and add an **in-memory buffer**, so reads/writes happen in **large chunks** instead of one byte/char at a time — dramatically reducing the number of expensive OS calls. They're **decorators** (Module 13) over a base stream:

\`\`\`java
import java.io.*;

// buffered character reading with readLine()
try (BufferedReader br = new BufferedReader(new FileReader("log.txt"))) {
    String line;
    while ((line = br.readLine()) != null) {   // read a whole LINE at a time
        System.out.println(line);
    }
}
\`\`\`

\`BufferedReader.readLine()\` returns one line (without the line terminator) or **\`null\`** at end of file — far more convenient than reading characters.`,
      why: `Unbuffered I/O issues a **system call per byte/char** (§9.3/§9.4), which is orders of magnitude slower than memory access. Buffering:

- **Batches** operations: read/write \`8192\` bytes/chars at once, then serve from memory.
- **Cuts OS calls** ~1000×, hugely improving throughput.
- **Adds convenience** methods: \`readLine()\` (read), \`newLine()\` (platform-correct line separator on write).

Buffering is essential for any non-trivial file processing — it's the default choice.`,
      classes: `**The four buffered classes — one per family:**

| Class | Wraps | Adds |
|---|---|---|
| \`BufferedReader\` | a \`Reader\` | \`readLine()\`, \`lines()\` (Stream, §7.8) |
| \`BufferedWriter\` | a \`Writer\` | \`newLine()\` |
| \`BufferedInputStream\` | an \`InputStream\` | byte buffering |
| \`BufferedOutputStream\` | an \`OutputStream\` | byte buffering |

\`\`\`java
// write lines efficiently
try (BufferedWriter bw = new BufferedWriter(new FileWriter("out.txt"))) {
    for (String line : lines) { bw.write(line); bw.newLine(); }
}   // close() flushes the buffer to disk

// stream of lines (Java 8+)
try (BufferedReader br = new BufferedReader(new FileReader("big.txt"))) {
    long count = br.lines().filter(l -> !l.isBlank()).count();   // §7.8
}
\`\`\``,
      flushing: `**Flushing — when does data actually get written?** A \`BufferedWriter\`/\`BufferedOutputStream\` holds output in memory until the buffer fills, you call **\`flush()\`**, or you **\`close()\`** it (which flushes first). So:

\`\`\`java
BufferedWriter bw = new BufferedWriter(new FileWriter("out.txt"));
bw.write("data");
// at this point the file may still be EMPTY — data is in the buffer
bw.flush();    // force it to disk now
// or close() (try-with-resources) flushes automatically
\`\`\`

**Forgetting to flush/close loses buffered data** — a classic bug. try-with-resources (Module 4 §4.10) guarantees the flush-on-close.`,
      internal: `A buffered stream maintains a \`byte[]\`/\`char[]\` (default ~8KB). On read, it fills the buffer from the underlying stream once, then serves subsequent reads from memory until empty, then refills. On write, it accumulates into the buffer and writes to the underlying stream when full / on flush / on close. You can size the buffer (\`new BufferedReader(reader, size)\`) for very large I/O. Because the underlying stream is wrapped, **closing the buffered stream closes the underlying one too** — you only close the outermost wrapper. \`BufferedReader.lines()\` returns a lazy \`Stream<String>\` (§7.8) that reads on demand.`,
      useCases: `- **Reading text files line-by-line** (\`readLine\`/\`lines\`) — logs, CSV, config.
- **Writing many small pieces** efficiently (reports, generated files).
- **Any large file copy/processing** — wrap byte streams in buffered ones.
- **Streaming line processing** with \`lines()\` + the Streams API (§7.8/§7.9).`,
      code: `\`\`\`java
import java.io.*;

public class BufferedDemo {
    public static void main(String[] args) throws IOException {
        // write lines (buffered) — flushed on close
        try (BufferedWriter bw = new BufferedWriter(new FileWriter("nums.txt"))) {
            for (int i = 1; i <= 5; i++) { bw.write("line " + i); bw.newLine(); }
        }
        // read lines (buffered)
        try (BufferedReader br = new BufferedReader(new FileReader("nums.txt"))) {
            String line;
            int count = 0;
            while ((line = br.readLine()) != null) count++;
            System.out.println("lines: " + count);     // 5
        }
        // stream of lines + count non-blank (Java 8+)
        try (BufferedReader br = new BufferedReader(new FileReader("nums.txt"))) {
            System.out.println(br.lines().filter(l -> l.contains("3")).count()); // 1
        }
    }
}
\`\`\``,
      mistakes: `- **Forgetting to flush/close a buffered writer** — buffered data is lost (file empty/truncated). Use try-with-resources.
- **Closing the inner stream instead of the buffered wrapper** — close the outermost; it cascades.
- **Not buffering large I/O** — leaving performance ~1000× on the table.
- **Reusing a \`readLine\` result without null-checking** — \`null\` means EOF (not empty string).
- **Calling \`lines()\` and ignoring stream laziness** — the file is read as the stream is consumed; close after.
- **Double-buffering** unnecessarily (e.g., NIO.2 \`Files.newBufferedReader\` is already buffered).`,
      bestPractices: `- **Always buffer** non-trivial file I/O (wrap byte/character streams).
- Use **\`readLine()\`/\`lines()\`** for line-oriented text and **\`newLine()\`** for portable line endings.
- **flush or close** to ensure data is written — prefer **try-with-resources** (Module 4 §4.10).
- Close only the **outermost** (buffered) stream.
- For new code, **\`Files.newBufferedReader/Writer\`** (NIO.2, §9.7) gives buffered, charset-aware streams in one call.`,
      interview: `**Q1. Why use buffered streams?**
They batch I/O in memory, cutting per-byte/char OS calls ~1000× for much better performance, and add convenience methods (\`readLine\`/\`newLine\`).

**Q2. What does BufferedReader.readLine return at EOF?**
\`null\` (otherwise a line without its terminator).

**Q3. When is buffered output actually written?**
When the buffer fills, on \`flush()\`, or on \`close()\` — forgetting to flush/close loses data.

**Q4. If you wrap a FileReader in a BufferedReader, which do you close?**
The \`BufferedReader\` (outermost) — closing it closes the underlying \`FileReader\` too.

**Q5. What does BufferedReader.lines() return?**
A lazy \`Stream<String>\` of lines (Java 8, §7.8).

**Q6. Do you need to buffer Files.newBufferedReader?**
No — it's already buffered.`,
      exercises: `1. Write 1000 lines with and without \`BufferedWriter\`; compare time.
2. Read a file with \`readLine\` in a loop and again with \`lines().count()\`.
3. Demonstrate data loss by not flushing/closing a \`BufferedWriter\`, then fix it.
4. Use \`newLine()\` and explain why it's more portable than \`"\\n"\`.`,
      challenges: `Build a log-processing tool: read a large log file with a \`BufferedReader\`, use \`lines()\` (§7.8) to filter ERROR lines, group counts by hour, and write a summary with a \`BufferedWriter\` (\`newLine\`). Demonstrate that omitting close/flush loses the summary, then fix with try-with-resources. Compare against an unbuffered version's performance and explain the OS-call reduction.`,
      summary: `- **Buffered streams** wrap a base stream with an in-memory buffer, batching I/O to cut OS calls ~1000× — **always buffer** non-trivial file work.
- \`BufferedReader\` adds **\`readLine()\`** (null at EOF) and **\`lines()\`** (Stream, §7.8); \`BufferedWriter\` adds **\`newLine()\`**.
- Buffered **output is held until flush/close** — forgetting to close loses data (use try-with-resources, Module 4 §4.10); close the **outermost** wrapper.
- For new code, **\`Files.newBufferedReader/Writer\`** (NIO.2, §9.7) is buffered + charset-aware in one call.`
    }),

    /* 9.6 Serialization & Deserialization. */
    topic({
      id: "serialization", chapter: "9.6", title: "Serialization & Deserialization",
      subtitle: "Converting objects to bytes and back — with its risks.",
      readTime: "16 min", level: "Core", deep: true,
      objectives: [
        "Serialize/deserialize objects with ObjectOutputStream/ObjectInputStream.",
        "Use Serializable, serialVersionUID, and the transient keyword.",
        "Understand serialization's pitfalls and security risks.",
        "Know modern alternatives (JSON, records, Externalizable)."
      ],
      concept: `**Serialization** converts a Java **object graph into a byte stream** (so it can be saved to disk or sent over a network); **deserialization** reconstructs the object from those bytes. Built-in support comes from the **\`Serializable\`** marker interface plus **\`ObjectOutputStream\`**/**\`ObjectInputStream\`** (byte-stream decorators, §9.3).

\`\`\`java
import java.io.*;

class Point implements Serializable {     // marker interface — no methods
    int x, y;
    Point(int x, int y){ this.x = x; this.y = y; }
}

// serialize
try (var out = new ObjectOutputStream(new FileOutputStream("pt.ser"))) {
    out.writeObject(new Point(3, 4));
}
// deserialize
try (var in = new ObjectInputStream(new FileInputStream("pt.ser"))) {
    Point p = (Point) in.readObject();     // cast required; throws if class missing
}
\`\`\`

A class is serializable only if it (and its serializable fields) implement \`Serializable\`.`,
      why: `Serialization provides a built-in way to **persist** object state and **transmit** objects (RMI, caches, sessions, distributed systems). It captures the whole **object graph** (referenced objects too) automatically. However, Java's native serialization has **significant problems** (security, versioning, performance), so modern systems usually prefer **JSON/protobuf** libraries — but you must understand the built-in mechanism for interviews and legacy code.`,
      mechanics: `**Key elements:**

- **\`Serializable\`** — a marker interface (no methods) flagging "this class may be serialized."
- **\`transient\`** — a field modifier meaning "**do not serialize** this field" (it's restored as the default \`0\`/\`null\`). Use for caches, derived data, or **sensitive** info (passwords).
- **\`serialVersionUID\`** — a \`static final long\` version stamp used to verify the class hasn't changed incompatibly between serialize and deserialize.

\`\`\`java
class User implements Serializable {
    private static final long serialVersionUID = 1L;   // explicit version
    private String name;
    private transient String password;                 // NOT serialized
}
\`\`\``,
      serialVersionUID: `**\`serialVersionUID\` — why it matters:** during deserialization the JVM compares the stored UID with the current class's UID. If they **differ**, it throws \`InvalidClassException\`. If you don't declare one, the compiler **generates** it from the class structure — so **any change** (adding a field/method) changes the UID and **breaks** deserialization of old data.

> Best practice: **always declare \`serialVersionUID\` explicitly** so you control compatibility, and bump it deliberately when you make incompatible changes.`,
      pitfalls: `**Serialization is notoriously problematic — know the risks:**

- **Security** — deserializing untrusted data can execute attacker-controlled code (**gadget chains**); this is a major Java vulnerability class. **Never deserialize untrusted input.**
- **Versioning fragility** — class changes break compatibility (\`InvalidClassException\`) unless carefully managed.
- **Hidden contract** — \`readObject\` bypasses constructors, so invariants/validation in constructors aren't enforced.
- **Performance/size** — the native format is verbose and slow vs JSON/protobuf.
- **Tight coupling** — ties the persisted format to your class's internal structure.

*Effective Java* advises avoiding Java serialization in new systems; if you must, validate aggressively and consider serialization filters (\`ObjectInputFilter\`).`,
      internal: `\`writeObject\` traverses the object graph, writing each reachable serializable object **once** (handling cycles and shared references). A field's class must itself be \`Serializable\` (or \`transient\`), else \`NotSerializableException\`. Static fields aren't serialized (they belong to the class). You can customise with **\`writeObject\`/\`readObject\`** private methods, or implement **\`Externalizable\`** to fully control the format (\`writeExternal\`/\`readExternal\`). \`readObject\` recreates the object **without calling its constructor**, which is why validation must be repeated in a custom \`readObject\` (or use the serialization-proxy pattern). \`readResolve\` lets you preserve singletons.`,
      alternatives: `**Modern alternatives (usually preferred):**

| Approach | Use |
|---|---|
| **JSON** (Jackson/Gson) | human-readable, language-neutral, web APIs |
| **Protocol Buffers / Avro** | compact, fast, schema-evolving binary |
| **\`record\`s** (Module 2) | concise data carriers; serialize via JSON cleanly |
| **\`Externalizable\`** | full control over the native format when needed |

For most new code, serialize to **JSON** with a library rather than using native Java serialization — safer, portable, and easier to evolve.`,
      useCases: `- **Legacy persistence/caching** of object state to disk.
- **RMI** and older distributed Java systems.
- **HTTP session replication** in some app servers.
- Understanding it to **audit/secure** systems that deserialize data (security reviews).`,
      code: `\`\`\`java
import java.io.*;

public class SerializationDemo {
    static class Account implements Serializable {
        private static final long serialVersionUID = 1L;
        String owner;
        double balance;
        transient String pin;            // not serialized
        Account(String o, double b, String pin){ owner=o; balance=b; this.pin=pin; }
    }
    public static void main(String[] args) throws Exception {
        Account a = new Account("Shail", 1000, "1234");
        try (var out = new ObjectOutputStream(new FileOutputStream("acct.ser"))) {
            out.writeObject(a);
        }
        try (var in = new ObjectInputStream(new FileInputStream("acct.ser"))) {
            Account r = (Account) in.readObject();
            System.out.println(r.owner + " " + r.balance + " pin=" + r.pin);
            // Shail 1000.0 pin=null  -> transient field not restored
        }
    }
}
\`\`\``,
      mistakes: `- **Deserializing untrusted data** — a serious security hole (remote code execution); never do it.
- **Omitting \`serialVersionUID\`** — auto-generated UID breaks compatibility on any class change.
- **Forgetting \`transient\`** for sensitive/derived fields — passwords get written; caches become stale.
- **A non-serializable field** without \`transient\` — \`NotSerializableException\` at write time.
- **Relying on constructor validation** — \`readObject\` skips constructors; re-validate in a custom \`readObject\`.
- **Using native serialization for APIs/interop** — prefer JSON/protobuf.`,
      bestPractices: `- **Avoid native Java serialization** in new systems; prefer **JSON/protobuf** libraries.
- If you must use it: **always declare \`serialVersionUID\`**, mark sensitive/derived fields **\`transient\`**, and **never deserialize untrusted input** (use \`ObjectInputFilter\`).
- Re-validate invariants in a custom **\`readObject\`** (or use the serialization-proxy pattern).
- Keep serializable classes' fields stable; document compatibility.
- Consider **\`Externalizable\`** only when you need full format control.`,
      interview: `**Q1. What is serialization?**
Converting an object graph to a byte stream (and back via deserialization), using \`Serializable\` + \`ObjectOutputStream\`/\`ObjectInputStream\`.

**Q2. What is the transient keyword?**
Marks a field to be skipped during serialization (restored as default) — for sensitive/derived/non-serializable data.

**Q3. What is serialVersionUID and why declare it?**
A version stamp checked on deserialization; declaring it explicitly controls compatibility, otherwise an auto-generated UID breaks on any class change.

**Q4. What are serialization's main risks?**
Security (deserializing untrusted data → code execution), versioning fragility, constructor bypass, and verbose/slow format.

**Q5. Is Serializable a normal interface?**
It's a marker interface (no methods) signalling serializability.

**Q6. What are alternatives to native serialization?**
JSON (Jackson/Gson), Protocol Buffers/Avro, or \`Externalizable\` for custom binary.`,
      exercises: `1. Serialize and deserialize an object; verify a \`transient\` field comes back null/0.
2. Add a field to the class without changing \`serialVersionUID\`, deserialize old data, observe \`InvalidClassException\` (or set UID to control it).
3. Trigger \`NotSerializableException\` with a non-serializable field, then fix with \`transient\` or making it serializable.
4. Serialize the same object to JSON (conceptually) and compare readability/size.`,
      challenges: `Serialize a small object graph (an \`Order\` with a list of \`Item\`s) to disk and back, marking a derived total field \`transient\` and recomputing it in a custom \`readObject\`. Then deliberately evolve the class and show how \`serialVersionUID\` governs compatibility. Finally, write a short risk assessment explaining why you'd serialize to JSON instead for a public API, citing the security and versioning pitfalls.`,
      summary: `- **Serialization** turns an object graph into bytes (and back) via **\`Serializable\`** + **\`ObjectOutputStream\`/\`ObjectInputStream\`**; non-serializable fields need **\`transient\`**.
- **Always declare \`serialVersionUID\`** (controls compatibility); \`transient\` for sensitive/derived fields; \`readObject\` **bypasses constructors** (re-validate).
- Native serialization is **risky** — **never deserialize untrusted data** (RCE), it's fragile and verbose; prefer **JSON/protobuf**.
- Built on byte streams (§9.3); for full control use \`Externalizable\`.`
    }),

    /* ===================== ADVANCED ===================== */

    /* 9.7 NIO.2. */
    topic({
      id: "nio", chapter: "9.7", title: "NIO.2 (Path & Files)",
      subtitle: "The modern file API — Path, Files, and efficient I/O.",
      readTime: "16 min", level: "Advanced", deep: true,
      objectives: [
        "Use Path and Files for modern, concise file operations.",
        "Read/write whole files and streams of lines in one call.",
        "Walk directory trees and watch for changes.",
        "Understand NIO buffers/channels at a high level and why NIO.2 beats java.io.File."
      ],
      concept: `**NIO.2** (\`java.nio.file\`, Java 7) is the **modern file API** that replaces \`java.io.File\` (§9.2). Its two pillars are **\`Path\`** (an improved path abstraction) and **\`Files\`** (a utility class of static methods for nearly every file operation).

\`\`\`java
import java.nio.file.*;
import java.nio.charset.StandardCharsets;

Path path = Path.of("data", "report.txt");     // portable path building
Files.writeString(path, "Hello NIO.2");          // write a whole file (Java 11)
String content = Files.readString(path);         // read a whole file (Java 11)
boolean exists = Files.exists(path);
\`\`\`

NIO.2 is **concise, charset-aware, and throws informative \`IOException\`s** — a big upgrade over \`File\`'s boolean-returning methods.`,
      why: `\`java.io\` is verbose and \`File\` is limited (§9.2). NIO.2 fixes this:

- **One-liners** for common tasks (\`readString\`, \`writeString\`, \`readAllLines\`, \`copy\`, \`move\`, \`delete\`).
- **Informative exceptions** (\`NoSuchFileException\`, \`AccessDeniedException\`) instead of silent \`false\`.
- **Charset-aware** text methods.
- **Directory tree walking** (\`Files.walk\`), **streaming** (\`Files.lines\`), and **file watching** (\`WatchService\`).
- **Rich attributes** (permissions, owners, symbolic links, file times).

Plus the lower-level **NIO** (\`Channel\`/\`Buffer\`/\`Selector\`) enables high-performance and non-blocking I/O.`,
      pathAndFiles: `**\`Path\` and \`Files\` essentials:**

\`\`\`java
Path p = Path.of("/var/log/app.log");      // or Paths.get(...)
p.getFileName();  p.getParent();  p.resolve("sub"); p.normalize(); p.toAbsolutePath();

// Files: common operations
Files.exists(p); Files.isDirectory(p); Files.size(p);
Files.createDirectories(Path.of("a/b/c"));  // mkdirs equivalent (throws on error)
Files.copy(src, dst, StandardCopyOption.REPLACE_EXISTING);
Files.move(src, dst);
Files.delete(p);                            // throws if missing
Files.deleteIfExists(p);                    // returns boolean
\`\`\`

\`Path\` is **immutable**; methods like \`resolve\`/\`normalize\` return new paths (Module 3 §3.4).`,
      readingWriting: `**Reading and writing — the convenient methods:**

\`\`\`java
// whole file (small files)
String text = Files.readString(p);                       // Java 11
List<String> lines = Files.readAllLines(p);              // all lines
byte[] bytes = Files.readAllBytes(p);                    // binary
Files.writeString(p, "content");                          // Java 11
Files.write(p, bytes);

// streaming large files (lazy, §7.8) — close the stream!
try (var lines = Files.lines(p, StandardCharsets.UTF_8)) {
    long errors = lines.filter(l -> l.contains("ERROR")).count();
}

// buffered + charset in one call
try (BufferedReader br = Files.newBufferedReader(p, StandardCharsets.UTF_8)) { ... }
\`\`\`

Use **\`readString\`/\`readAllLines\`** for small files; **\`Files.lines\`** (a \`Stream\`, §7.8) for large files to avoid loading everything into memory.`,
      treeWalkingWatching: `**Directory tree walking and watching:**

\`\`\`java
// walk a tree (lazy stream of paths) — try-with-resources to close
try (var paths = Files.walk(Path.of("src"))) {
    paths.filter(Files::isRegularFile)
         .filter(f -> f.toString().endsWith(".java"))
         .forEach(System.out::println);
}

// find with a matcher
try (var found = Files.find(root, 5, (path, attrs) -> attrs.size() > 1_000_000)) { ... }

// watch a directory for changes (WatchService)
WatchService ws = FileSystems.getDefault().newWatchService();
dir.register(ws, StandardWatchEventKinds.ENTRY_CREATE, StandardWatchEventKinds.ENTRY_MODIFY);
\`\`\`

These have **no clean equivalent** in \`java.io.File\` — a key reason to use NIO.2.`,
      internal: `Under NIO.2 sits the lower-level **NIO** model: data moves through **\`Channel\`s** (bidirectional connections to files/sockets) into **\`Buffer\`s** (typed memory blocks like \`ByteBuffer\`), and **\`Selector\`s** enable a single thread to manage many non-blocking channels (the basis of high-throughput servers like Netty). **Memory-mapped files** (\`FileChannel.map\`) map a file region directly into memory for very fast access. \`Files.walk\`/\`Files.lines\` return **lazy streams** (§7.8) backed by open file handles — so they **must be closed** (try-with-resources) to release resources. \`Path\` resolution (\`resolve\`/\`relativize\`/\`normalize\`) handles path arithmetic portably across filesystems.`,
      useCases: `- **All modern file I/O** — reading/writing/copying/moving files concisely.
- **Processing large files** line-by-line with \`Files.lines\` + streams (§7.8).
- **Directory operations**: create trees, walk/search, bulk operations.
- **File watching** for config reloads / hot deployment.
- **High-performance / non-blocking** I/O via channels, buffers, selectors (servers).`,
      code: `\`\`\`java
import java.nio.file.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.*;

public class Nio2Demo {
    public static void main(String[] args) throws Exception {
        Path dir = Files.createDirectories(Path.of("nio-demo"));
        Path file = dir.resolve("data.txt");

        Files.writeString(file, "alpha\\nbeta\\ngamma\\n", StandardCharsets.UTF_8);
        System.out.println("size = " + Files.size(file));

        // stream lines (lazy) — count + uppercase
        try (Stream<String> lines = Files.lines(file)) {
            List<String> upper = lines.map(String::toUpperCase).collect(Collectors.toList());
            System.out.println(upper);
        }
        // walk the directory tree
        try (Stream<Path> paths = Files.walk(dir)) {
            paths.filter(Files::isRegularFile).forEach(p -> System.out.println(p.getFileName()));
        }
        Files.deleteIfExists(file);
        Files.deleteIfExists(dir);
    }
}
\`\`\``,
      mistakes: `- **Not closing \`Files.lines\`/\`Files.walk\` streams** — they hold open file handles; use try-with-resources.
- **\`readAllLines\`/\`readString\` on huge files** — loads everything into memory (OOM); use \`Files.lines\` streaming.
- **Ignoring charset** — pass \`StandardCharsets.UTF_8\` to text methods.
- **Mixing \`File\` and \`Path\` awkwardly** — convert with \`file.toPath()\`/\`path.toFile()\` only at boundaries; prefer \`Path\`.
- **Assuming \`Files.delete\` returns boolean** — it **throws** if missing; use \`deleteIfExists\` for the boolean.
- **Forgetting \`Path\` is immutable** — \`resolve\`/\`normalize\` return new paths.`,
      bestPractices: `- **Prefer NIO.2 (\`Path\`/\`Files\`)** over \`java.io.File\` for new code.
- Use **\`readString\`/\`writeString\`/\`readAllLines\`** for small files; **\`Files.lines\`** (closed via try-with-resources) for large ones.
- Always specify a **charset** for text; handle specific exceptions (\`NoSuchFileException\`).
- Use **\`Files.walk\`/\`find\`** for tree operations and **\`WatchService\`** for change detection.
- Reach for **channels/buffers/memory-mapped files** only when you need high-performance/non-blocking I/O.`,
      interview: `**Q1. What is NIO.2 and why use it over File?**
The modern \`java.nio.file\` API (\`Path\`/\`Files\`, Java 7) — concise one-liners, informative exceptions, charset-aware, tree walking/watching, and richer attributes than \`java.io.File\`.

**Q2. Path vs File?**
\`Path\` is the modern, immutable path abstraction with better operations; \`File\` is legacy. Convert via \`toPath()\`/\`toFile()\`.

**Q3. How do you read a large file efficiently?**
\`Files.lines(path)\` returns a lazy \`Stream<String>\` (close it) — avoids loading the whole file like \`readAllLines\`.

**Q4. How do you walk a directory tree?**
\`Files.walk(path)\` / \`Files.find(...)\` (lazy streams, close them).

**Q5. What are Channel, Buffer, Selector?**
Lower-level NIO: channels are bidirectional data connections, buffers are typed memory blocks, selectors enable one thread to handle many non-blocking channels.

**Q6. Does Files.delete return a boolean?**
No — it throws if the file is missing; \`deleteIfExists\` returns a boolean.`,
      exercises: `1. Write and read a text file with \`Files.writeString\`/\`readString\` (UTF-8).
2. Stream a file's lines with \`Files.lines\` and count matches (close the stream).
3. Walk a directory with \`Files.walk\` and list all \`.java\` files.
4. Compare \`Files.delete\` (throws) vs \`deleteIfExists\` (boolean).`,
      challenges: `Reimplement the directory-size calculator from §9.2 using \`Files.walk\` + \`Files.size\`, handling \`IOException\` per entry, and stream it with the Streams API (§7.8) to sum sizes and count file types. Add a \`WatchService\` that prints a message when a file is added to the directory. Compare the clarity and error reporting against the \`java.io.File\` version, summarising why NIO.2 is the modern default.`,
      summary: `- **NIO.2** (\`java.nio.file\`: **\`Path\`** + **\`Files\`**, Java 7) is the modern file API — concise one-liners, **informative exceptions**, charset-aware, with **tree walking** (\`Files.walk\`/\`find\`) and **watching** (\`WatchService\`).
- Use **\`readString\`/\`writeString\`/\`readAllLines\`** for small files; **\`Files.lines\`** (a closed \`Stream\`, §7.8) for large ones; **\`newBufferedReader/Writer\`** for buffered+charset.
- \`Path\` is **immutable**; \`Files.delete\` **throws** (vs \`deleteIfExists\`); always specify a charset.
- Lower-level **NIO** (channels/buffers/selectors, memory-mapped files) powers high-performance/non-blocking I/O. Prefer NIO.2 over **\`File\` (§9.2)**.`
    }),

    /* 9.8 I/O Best Practices (capstone). */
    topic({
      id: "io-best-practices", chapter: "9.8", title: "I/O Best Practices",
      subtitle: "Capstone — resource safety, performance, encoding, and choosing APIs.",
      readTime: "14 min", level: "Advanced", deep: true,
      objectives: [
        "Always manage I/O resources with try-with-resources.",
        "Apply buffering, charset, and streaming for correctness and performance.",
        "Choose between java.io, NIO.2, and serialization appropriately.",
        "Consolidate the module into an interview-ready checklist."
      ],
      concept: `This capstone distills Module 9 into **decisions and habits**. Robust I/O comes down to four concerns:

1. **Resource safety** — always close streams (no leaks).
2. **Correctness** — right family (byte vs char, §9.1) and **explicit charset** for text.
3. **Performance** — **buffer** and **stream** large data.
4. **API choice** — prefer **NIO.2** (§9.7) for new code; use serialization carefully (§9.6).

Get these right and your file/network code is fast, correct, and leak-free.`,
      resourceSafety: `**Resource safety — try-with-resources is non-negotiable** (Module 4 §4.10):

\`\`\`java
// ✅ auto-closed (even on exception), in reverse order
try (BufferedReader in = Files.newBufferedReader(src, UTF_8);
     BufferedWriter out = Files.newBufferedWriter(dst, UTF_8)) {
    String line;
    while ((line = in.readLine()) != null) { out.write(line); out.newLine(); }
}
\`\`\`

Streams hold OS **file descriptors** — leaking them eventually exhausts the limit and crashes the app. Never rely on manual \`close()\` in \`finally\` when try-with-resources will do it correctly (and suppress close-time exceptions properly, Module 4 §4.10).`,
      performance: `**Performance principles:**

- **Buffer** all non-trivial I/O (§9.5) — cuts OS calls ~1000×.
- **Stream large files** (\`Files.lines\`, §9.7) instead of loading everything (\`readAllLines\`/\`readString\`) → avoids \`OutOfMemoryError\`.
- Use **\`transferTo\`/\`readAllBytes\`** (Java 9+) for simple copies.
- Pick a **sensible buffer size** (8–64KB) for large transfers.
- For very high throughput / non-blocking, use **NIO channels/buffers/memory-mapped files** (§9.7).`,
      correctness: `**Correctness — encoding and family:**

- Use **character streams for text**, **byte streams for binary** (§9.1) — never cross them.
- **Always specify the charset** (\`StandardCharsets.UTF_8\`); never rely on the platform default (\`FileReader\`/\`FileWriter\` pitfall).
- Build paths **portably** (\`Path.of\`, \`File.separator\`).
- Handle **specific exceptions** (\`NoSuchFileException\`, \`AccessDeniedException\`) and check return values where APIs use them (Module 4).
- For serialization, **never deserialize untrusted data**, declare \`serialVersionUID\`, mark sensitive fields \`transient\` (§9.6).`,
      apiChoice: `**Choosing the right API:**

| Need | Use |
|---|---|
| Read/write a small text file | \`Files.readString\`/\`writeString\` (§9.7) |
| Process a large text file | \`Files.lines\` + Streams (§7.8/§9.7) |
| Buffered line I/O | \`Files.newBufferedReader/Writer\` (§9.5/§9.7) |
| Binary file/copy | byte streams + buffer / \`transferTo\` (§9.3) |
| Directory ops / walking / watching | \`Files\`, \`Files.walk\`, \`WatchService\` (§9.7) |
| Path manipulation | \`Path\` (§9.7), not \`File\` |
| Persist/transmit objects | **JSON/protobuf** (prefer) or native serialization with care (§9.6) |
| High-throughput / non-blocking | NIO channels/selectors (§9.7) |`,
      internal: `The recurring theme is that I/O touches **OS resources** and **external encodings**, so the failure modes are leaks (unclosed handles), corruption (wrong charset/family), and OOM (loading huge files). try-with-resources, explicit charsets, buffering, and streaming address each. NIO.2 (§9.7) is the modern default because it bundles correctness (exceptions, charset) and capability (streaming, walking) that \`java.io\` lacks. Serialization (§9.6) is the one area to actively avoid in new designs due to security/versioning — prefer textual/binary schema formats.`,
      useCases: `- **Config/log/report processing** (buffered, streamed, UTF-8).
- **File copy/transfer services** (byte streams + \`transferTo\`).
- **Batch/ETL** over large files (\`Files.lines\` + streams §7.8).
- **Persistence/messaging** (JSON over native serialization).`,
      code: `\`\`\`java
import java.nio.file.*;
import java.nio.charset.StandardCharsets;
import java.util.stream.*;

public class IoBestPractices {
    // correct, performant, leak-free text processing
    static long countErrors(Path log) throws Exception {
        try (Stream<String> lines = Files.lines(log, StandardCharsets.UTF_8)) {  // stream + charset + closed
            return lines.filter(l -> l.contains("ERROR")).count();
        }
    }
    public static void main(String[] args) throws Exception {
        Path p = Path.of("app.log");
        Files.writeString(p, "INFO ok\\nERROR boom\\nERROR again\\n", StandardCharsets.UTF_8);
        System.out.println("errors: " + countErrors(p));   // 2
        Files.deleteIfExists(p);
    }
}
\`\`\``,
      mistakes: `- **Not using try-with-resources** — leaked file descriptors (the most common I/O bug).
- **Unbuffered or fully-loaded large-file reads** — slow or OOM; buffer/stream instead.
- **Default charset reliance** — encoding bugs across environments.
- **Wrong stream family** for the data type (§9.1).
- **Deserializing untrusted data** / no \`serialVersionUID\` (§9.6).
- **Using \`File\`/manual loops** when NIO.2 one-liners are clearer and safer.`,
      bestPractices: `**The I/O checklist:**

- **try-with-resources** for every stream/reader/writer (Module 4 §4.10).
- **Buffer** non-trivial I/O; **stream** large files (\`Files.lines\`).
- **Explicit UTF-8** charset for all text; portable paths (\`Path.of\`).
- Prefer **NIO.2 \`Files\`/\`Path\`** (§9.7) over \`java.io.File\`.
- **Avoid native serialization** in new code; if used, secure it (§9.6).
- Handle **specific \`IOException\` subtypes**; never swallow (Module 4 §4.13).`,
      interview: `**Q1. How do you ensure I/O resources are closed?**
Use try-with-resources (Module 4 §4.10) — it closes in reverse order even on exception and handles suppressed exceptions.

**Q2. How do you process a huge file without OOM?**
Stream it lazily with \`Files.lines\` (§9.7) instead of \`readAllLines\`/\`readString\`.

**Q3. Why specify a charset?**
To avoid platform-default encoding bugs; always use UTF-8 (or the format's required charset).

**Q4. java.io vs NIO.2 — which for new code?**
NIO.2 (\`Path\`/\`Files\`) — concise, exception-rich, charset-aware, with streaming/walking/watching.

**Q5. Should you use Java serialization?**
Avoid it in new systems (security/versioning); prefer JSON/protobuf — if used, secure and version it.

**Q6. What's the single most common I/O bug?**
Leaking unclosed streams (file descriptors) — fixed by try-with-resources.`,
      exercises: `1. Rewrite a manual try/finally I/O block as try-with-resources.
2. Convert a \`readAllLines\` over a large file to a streamed \`Files.lines\` pipeline.
3. Add explicit UTF-8 to a text read/write and demonstrate the fix for an encoding bug.
4. Audit a snippet for the six I/O mistakes and fix each.`,
      challenges: `Capstone: build a robust log-aggregation tool. Walk a directory of \`.log\` files (\`Files.walk\`, §9.7), stream each with \`Files.lines\` (UTF-8, closed), filter and group ERROR lines by hour using the Streams API (§7.8/§7.10), and write a buffered UTF-8 summary — all under try-with-resources, with specific exception handling and no full-file loads. Then explain each design choice against the I/O checklist, and where you'd choose JSON over serialization for persisting the results.`,
      summary: `- Robust I/O = **resource safety** (try-with-resources, Module 4 §4.10), **correctness** (right family + explicit UTF-8 charset, §9.1), **performance** (buffer §9.5, stream large files §9.7), and **API choice**.
- Prefer **NIO.2 \`Files\`/\`Path\` (§9.7)** for new code; **stream** huge files (\`Files.lines\`) to avoid OOM; use **\`transferTo\`/\`readAllBytes\`** for copies.
- **Avoid native serialization** (§9.6) in new systems (security/versioning) — prefer JSON/protobuf.
- The most common bug is **leaked streams** — always close. This checklist ties Module 9 together.`
    })
  ]
});
