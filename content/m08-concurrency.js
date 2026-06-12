/* Module 8: Multithreading & Concurrency — edit ONLY this file for this module's content.
   Authored at ~2x Module 2 depth (Module-3 style), ordered BASIC -> ADVANCED:
     8.1 intro -> 8.2 creating threads -> 8.3 lifecycle -> 8.4 Callable/Future
     -> 8.5 synchronization -> 8.6 wait/notify -> 8.7 volatile & JMM -> 8.8 deadlock
     -> 8.9 locks -> 8.10 atomics -> 8.11 executors -> 8.12 concurrent collections
     -> 8.13 CompletableFuture -> 8.14 ThreadLocal & best practices.
   Each topic() renders sections in declared order; see assets/site.js PART_LABELS. */
registerModule({
  id: "concurrency",
  module: "Multithreading & Concurrency",
  page: "module-concurrency.html",
  icon: "🧵",
  tagline: "Threads, executors, synchronization, the memory model, and concurrent collections.",
  lessons: [

    /* ===================== BASIC ===================== */

    /* 8.1 Introduction to Concurrency. */
    topic({
      id: "intro-to-concurrency", chapter: "8.1", title: "Introduction to Concurrency",
      subtitle: "Processes vs threads, concurrency vs parallelism — and why it's hard.",
      readTime: "15 min", level: "Foundational", deep: true,
      objectives: [
        "Distinguish process vs thread and concurrency vs parallelism.",
        "Explain why multithreading is used and what makes it hard.",
        "Identify the core hazards: race conditions, visibility, and atomicity.",
        "Frame the rest of the module (synchronization, locks, executors)."
      ],
      concept: `**Concurrency** is the ability of a program to make progress on **multiple tasks** during overlapping time periods. In Java this is done with **threads** — independent paths of execution within a single program that share the same memory.

- A **process** is a running program with its **own** memory space.
- A **thread** is a lightweight unit of execution **inside** a process; threads of the same process **share** the heap (objects) but each has its **own stack** (local variables, call frames).

\`\`\`java
// the main thread runs main(); we can start more threads:
new Thread(() -> System.out.println("running on " + Thread.currentThread().getName())).start();
System.out.println("main thread: " + Thread.currentThread().getName());
\`\`\`

Because threads share memory, they can cooperate efficiently — but that sharing is exactly what makes concurrency **hard**.`,
      why: `Multithreading exists to improve **responsiveness** and **throughput**:

- **Responsiveness** — keep a UI/server responsive while work happens in the background.
- **Throughput / parallelism** — use multiple CPU cores to do more work per second.
- **Resource utilisation** — overlap I/O waits (network, disk) with computation.

Modern hardware has many cores, so concurrency is essential for performance. It's also a **major interview topic** for backend roles — race conditions, the memory model, and thread pools come up constantly.`,
      concurrencyVsParallelism: `**Concurrency vs Parallelism** (a classic interview distinction):

| | Concurrency | Parallelism |
|---|---|---|
| Definition | dealing with many tasks at once (structure) | doing many tasks at once (execution) |
| Hardware | possible on **one** core (time-slicing) | requires **multiple** cores |
| Analogy | one cook switching between dishes | many cooks, one each |

Concurrency is about **structure** (composing independently-executing tasks); parallelism is about **simultaneous execution**. A concurrent program *may* run in parallel if cores are available.`,
      hazards: `**Why concurrency is hard — the three core hazards** (the rest of the module addresses these):

1. **Race condition** — two threads access shared mutable state and the result depends on timing. \`count++\` is not atomic (read-modify-write), so concurrent increments **lose updates** (§8.5/§8.8/§8.10).
2. **Visibility** — a change made by one thread may not be **visible** to another due to CPU caches/compiler reordering, unless coordinated (\`volatile\`/synchronization — §8.7).
3. **Atomicity** — compound actions (check-then-act, read-modify-write) can interleave and corrupt state.

\`\`\`java
// classic race: two threads each increment 'count' 10,000 times -> final value < 20,000
class Counter { int count; void inc() { count++; } } // NOT thread-safe
\`\`\`

These are *non-deterministic* — they may "work" in testing and fail in production, which is what makes concurrency bugs notorious.`,
      internal: `The JVM maps Java threads to **OS threads** (a 1:1 model on standard JVMs). The OS **scheduler** decides which thread runs on which core and when, **preempting** threads — so you cannot assume any execution order without explicit coordination. Each thread has its own **stack** and **program counter**; all threads **share the heap** (Module 1). This shared-heap model is why visibility and atomicity matter — and why Java provides synchronization, \`volatile\`, atomics, locks, and high-level executors to make sharing safe. (Java 21 also adds lightweight **virtual threads** for massive I/O concurrency, but the fundamentals here apply to platform threads.)`,
      useCases: `- **Servers** handling many requests concurrently (thread-per-request or pools, §8.11).
- **Background work**: file processing, downloads, scheduled jobs.
- **Parallel computation**: splitting CPU-bound work across cores (parallel streams §7.8, fork/join).
- **Producer/consumer** pipelines (queues, §8.12).
- **Async I/O**: overlapping network/disk waits with computation (\`CompletableFuture\`, §8.13).`,
      code: `\`\`\`java
public class IntroConcurrency {
    static int count = 0;                 // shared mutable state

    public static void main(String[] args) throws InterruptedException {
        Runnable task = () -> { for (int i = 0; i < 100_000; i++) count++; }; // race!
        Thread t1 = new Thread(task), t2 = new Thread(task);
        t1.start(); t2.start();
        t1.join(); t2.join();             // wait for both to finish

        // Expected 200,000 — but often LESS due to the race condition
        System.out.println("count = " + count);
        System.out.println("cores = " + Runtime.getRuntime().availableProcessors());
    }
}
\`\`\``,
      mistakes: `- **Assuming an execution order** between threads — the scheduler is non-deterministic.
- **Sharing mutable state without coordination** — leads to race conditions and lost updates.
- **Confusing concurrency with parallelism** — structure vs simultaneous execution.
- **Believing tests prove thread-safety** — concurrency bugs are timing-dependent and intermittent.
- **Ignoring visibility** — a written value may not be seen by another thread without \`volatile\`/sync (§8.7).`,
      bestPractices: `- **Minimise shared mutable state** — prefer immutability (Module 3 §3.4) and confinement (each thread its own data, §8.14 ThreadLocal).
- Use **high-level abstractions** (executors §8.11, concurrent collections §8.12, \`CompletableFuture\` §8.13) over raw threads/locks.
- When you must share, **coordinate** with synchronization (§8.5), \`volatile\` (§8.7), atomics (§8.10), or locks (§8.9).
- Design for **non-determinism**: never rely on timing or thread order.
- Keep critical sections **small**; document thread-safety expectations.`,
      interview: `**Q1. Process vs thread?**
A process has its own memory; a thread runs inside a process and shares the heap with sibling threads but has its own stack.

**Q2. Concurrency vs parallelism?**
Concurrency is managing multiple tasks (possible on one core via time-slicing); parallelism is executing them simultaneously (needs multiple cores).

**Q3. Why is multithreading used?**
For responsiveness, throughput via multiple cores, and overlapping I/O with computation.

**Q4. What is a race condition?**
When the outcome depends on the timing/interleaving of threads accessing shared mutable state (e.g., \`count++\`).

**Q5. What is the visibility problem?**
A change by one thread may not be visible to another due to caching/reordering unless coordinated (\`volatile\`/sync).

**Q6. Why are concurrency bugs hard to find?**
They're non-deterministic and timing-dependent — they may pass tests and fail in production.`,
      exercises: `1. Run the lost-update demo (two threads incrementing a shared int) and observe a result below the expected total.
2. Print the current thread name from \`main\` and from a spawned thread.
3. Report \`availableProcessors()\` and explain how it relates to parallelism.
4. List which of: web server, image filter, file download — benefit from concurrency vs parallelism.`,
      challenges: `Reproduce a race condition reliably (two threads incrementing a shared counter many times) and measure how far off the result is across several runs to show non-determinism. Then predict (without coding yet) which tools later in this module would fix it — \`synchronized\` (§8.5), \`AtomicInteger\` (§8.10), or a lock (§8.9) — and why each works. This frames the whole module.`,
      summary: `- **Concurrency** = making progress on multiple tasks via **threads** (share the heap, own stacks); **parallelism** = simultaneous execution on multiple cores.
- Used for **responsiveness, throughput, I/O overlap**; hard because of **race conditions, visibility, and atomicity** on shared mutable state.
- The scheduler is **non-deterministic** — never assume order; bugs are intermittent.
- Fixes come next: **synchronization (§8.5), volatile/JMM (§8.7), atomics (§8.10), locks (§8.9)**, and high-level **executors (§8.11)**; minimise shared state.`
    }),

    /* 8.2 Creating Threads: Thread & Runnable. */
    topic({
      id: "creating-threads", chapter: "8.2", title: "Creating Threads: Thread & Runnable",
      subtitle: "The two ways to define a task — and why Runnable wins.",
      readTime: "14 min", level: "Core", deep: true,
      objectives: [
        "Create threads by extending Thread and by implementing Runnable.",
        "Explain why implementing Runnable is preferred.",
        "Distinguish start() from run() and understand thread naming/daemon flags.",
        "Use lambdas to define thread tasks concisely."
      ],
      concept: `A **\`Thread\`** runs a **task** — a block of code defined via the **\`Runnable\`** interface (\`void run()\`). There are two classic ways to give a thread its task:

\`\`\`java
// 1) Implement Runnable (preferred) — separates the TASK from the THREAD
Runnable task = () -> System.out.println("hello from " + Thread.currentThread().getName());
Thread t1 = new Thread(task);
t1.start();

// 2) Extend Thread (couples task to thread)
class MyThread extends Thread {
    public void run() { System.out.println("running"); }
}
new MyThread().start();
\`\`\`

\`Runnable\` is a **functional interface** (§7.2), so a task is usually just a lambda.`,
      why: `Concurrency starts with **defining a task and running it on a thread**. The two approaches differ in design quality:

- **Implementing \`Runnable\`** separates *what to do* (the task) from *how it runs* (the thread). The task can be reused, submitted to a thread **pool** (§8.11), and your class is free to extend something else.
- **Extending \`Thread\`** couples the task to a thread, uses up your single inheritance (Module 2 §2.6), and can't be reused by an executor.

**Prefer \`Runnable\`** (or \`Callable\`, §8.4) — and in real code, prefer submitting tasks to an **executor** (§8.11) over creating raw threads.`,
      startVsRun: `**\`start()\` vs \`run()\` — a top interview gotcha:**

\`\`\`java
Thread t = new Thread(() -> System.out.println(Thread.currentThread().getName()));
t.start();   // ✅ creates a NEW thread, then calls run() on it -> prints "Thread-0"
t.run();     // ❌ just a normal method call on the CURRENT thread -> prints "main"
\`\`\`

- **\`start()\`** registers a new thread with the scheduler and invokes \`run()\` **on that new thread**.
- **\`run()\`** is an ordinary method — calling it directly runs the code on the **current** thread, with **no concurrency**.

Also, calling \`start()\` **twice** on the same \`Thread\` throws \`IllegalThreadStateException\`.`,
      threadProperties: `**Useful thread properties/methods:**

| Member | Purpose |
|---|---|
| \`setName\`/\`getName\` | identify threads (debugging/logs) |
| \`setDaemon(true)\` | daemon thread — JVM exits without waiting for it |
| \`setPriority(1..10)\` | a hint to the scheduler (not guaranteed) |
| \`Thread.currentThread()\` | the running thread |
| \`Thread.sleep(ms)\` | pause the current thread (§8.3) |
| \`isAlive()\` | whether it has started and not finished |

\`\`\`java
Thread worker = new Thread(task, "worker-1");
worker.setDaemon(true);     // background; won't keep the JVM alive
worker.start();
\`\`\`

**Daemon vs user threads:** the JVM keeps running until all **user** (non-daemon) threads finish; daemon threads (e.g., GC, background pollers) are abandoned on exit.`,
      internal: `\`new Thread(...)\` creates the object but does **not** start execution; \`start()\` asks the OS to create a native thread and schedule \`run()\` on it (1:1 thread model, §8.1). The new thread gets its **own stack**; it shares the heap with others. After \`run()\` returns, the thread is **terminated** and cannot be restarted (§8.3). Because thread creation is **expensive** (native resources, stack memory ~512KB–1MB), production code reuses threads via **pools/executors** (§8.11) rather than \`new Thread\` per task.`,
      useCases: `- **One-off background work** (rare in production — prefer executors).
- **Learning/illustrating** concurrency primitives.
- **Custom thread setup** (naming, daemon flag) when you control lifecycle.
- The \`Runnable\` task itself is what you submit to **executors** (§8.11) and use for \`Thread\`-based APIs.`,
      code: `\`\`\`java
public class CreatingThreads {
    public static void main(String[] args) throws InterruptedException {
        // Runnable + lambda (preferred)
        Runnable job = () -> {
            for (int i = 0; i < 3; i++)
                System.out.println(Thread.currentThread().getName() + ": " + i);
        };
        Thread a = new Thread(job, "A");
        Thread b = new Thread(job, "B");
        a.start(); b.start();          // run concurrently (interleaved output)
        a.join(); b.join();            // main waits for both (§8.3)

        // start() vs run()
        Thread c = new Thread(() -> System.out.println("on " + Thread.currentThread().getName()));
        c.run();                       // prints "on main" — NO new thread
        c.start();                     // prints "on Thread-2" — new thread
        System.out.println("done");
    }
}
\`\`\``,
      mistakes: `- **Calling \`run()\` instead of \`start()\`** — runs on the current thread with no concurrency.
- **Calling \`start()\` twice** — \`IllegalThreadStateException\`.
- **Extending \`Thread\`** when you only need a task — prefer \`Runnable\` (frees inheritance, enables pooling).
- **Creating a thread per task** in production — expensive; use an executor (§8.11).
- **Forgetting daemon semantics** — a non-daemon thread keeps the JVM alive; a daemon may be killed mid-work on exit.
- **Relying on priorities** — they're only hints and platform-dependent.`,
      bestPractices: `- Define tasks as **\`Runnable\`** (lambdas) and prefer submitting them to an **executor** (§8.11) over raw threads.
- Use **\`start()\`**, never \`run()\`, to get concurrency.
- **Name** your threads for easier debugging.
- Use **daemon** threads only for background work that's safe to abandon.
- Don't rely on **priorities** for correctness.`,
      interview: `**Q1. Two ways to create a thread?**
Implement \`Runnable\` and pass it to a \`Thread\`, or extend \`Thread\` and override \`run()\`. Prefer \`Runnable\`.

**Q2. Why prefer Runnable over extending Thread?**
It separates task from thread, leaves your single inheritance free, and lets you submit the task to thread pools/executors.

**Q3. Difference between start() and run()?**
\`start()\` launches a new thread that executes \`run()\`; calling \`run()\` directly executes on the current thread with no concurrency.

**Q4. What happens if you call start() twice?**
\`IllegalThreadStateException\`.

**Q5. What is a daemon thread?**
A background thread the JVM doesn't wait for on exit; set via \`setDaemon(true)\` before \`start()\`.

**Q6. Why use thread pools instead of new threads?**
Thread creation is expensive; pools reuse threads and bound resource usage (§8.11).`,
      exercises: `1. Create the same task via \`Runnable\` and via extending \`Thread\`; run both.
2. Demonstrate \`start()\` vs \`run()\` output (different thread names).
3. Trigger \`IllegalThreadStateException\` by calling \`start()\` twice.
4. Create a daemon thread and show the JVM exits without waiting for it.`,
      challenges: `Spawn N worker threads (Runnable lambdas) that each print their name and a counter, name them meaningfully, and have \`main\` \`join\` them all. Then refactor to submit the same \`Runnable\` to a fixed thread pool (preview §8.11) and discuss the resource and design advantages (reuse, no per-task thread creation, bounded concurrency).`,
      summary: `- A thread runs a **\`Runnable\`** task; create via implementing \`Runnable\` (preferred) or extending \`Thread\`.
- **\`start()\`** launches a new thread and calls \`run()\` on it; calling **\`run()\`** directly = no concurrency; \`start()\` twice throws.
- Prefer \`Runnable\` (decoupled, poolable, frees inheritance); use names, daemon flags appropriately; priorities are hints.
- Thread creation is **expensive** — in real code submit tasks to **executors (§8.11)**. Lifecycle details: **§8.3**.`
    }),

    /* 8.3 Thread Lifecycle & Control. */
    topic({
      id: "thread-lifecycle", chapter: "8.3", title: "Thread Lifecycle & Control",
      subtitle: "Thread states and the methods that move between them.",
      readTime: "14 min", level: "Core", deep: true,
      objectives: [
        "Enumerate the six thread states and the transitions between them.",
        "Use sleep, join, yield, and interrupt correctly.",
        "Handle InterruptedException properly (restore the interrupt flag).",
        "Avoid deprecated/dangerous methods (stop, suspend, resume)."
      ],
      concept: `A Java thread moves through a well-defined set of **states** during its life, defined by the **\`Thread.State\`** enum:

| State | Meaning |
|---|---|
| **NEW** | created but \`start()\` not yet called |
| **RUNNABLE** | running or ready to run (waiting for CPU) |
| **BLOCKED** | waiting to acquire a monitor lock (§8.5) |
| **WAITING** | waiting indefinitely (\`wait()\`, \`join()\`, \`park()\`) |
| **TIMED_WAITING** | waiting with a timeout (\`sleep(ms)\`, \`wait(ms)\`, \`join(ms)\`) |
| **TERMINATED** | \`run()\` has completed (cannot restart) |

\`\`\`
NEW --start()--> RUNNABLE <--> (BLOCKED / WAITING / TIMED_WAITING) --> TERMINATED
\`\`\``,
      why: `Understanding the lifecycle lets you **reason about and control** threads: why a thread is stuck (BLOCKED on a lock vs WAITING on a condition), how to make threads cooperate (\`join\`), pause (\`sleep\`), and stop gracefully (\`interrupt\`). It's a frequent interview diagram and the basis for diagnosing hangs and deadlocks (§8.8).`,
      controlMethods: `**The control methods and their effects:**

| Method | Effect | State |
|---|---|---|
| \`start()\` | begin execution | NEW → RUNNABLE |
| \`Thread.sleep(ms)\` | pause current thread, **keeps locks** | → TIMED_WAITING |
| \`join()\` / \`join(ms)\` | wait for another thread to finish | → WAITING/TIMED_WAITING |
| \`Thread.yield()\` | hint to give up the CPU (rarely needed) | stays RUNNABLE |
| \`interrupt()\` | request the thread to stop/wake | sets interrupt flag |
| \`wait()\`/\`notify()\` | inter-thread communication (§8.6) | → WAITING |

\`\`\`java
Thread worker = new Thread(task);
worker.start();
worker.join();        // main BLOCKS until worker finishes
Thread.sleep(1000);   // pause current thread 1s (does NOT release locks!)
\`\`\`

> Key: **\`sleep\` does not release locks** (unlike \`wait()\`, §8.6) — a common gotcha.`,
      interruption: `**Interruption is Java's cooperative cancellation mechanism** — there's no safe way to forcibly kill a thread. \`interrupt()\` sets a flag; the thread must **check and respond**:

\`\`\`java
Thread worker = new Thread(() -> {
    while (!Thread.currentThread().isInterrupted()) {   // check the flag
        // do work...
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();         // RESTORE the flag, then exit
            break;
        }
    }
});
worker.start();
worker.interrupt();   // politely ask it to stop
\`\`\`

**Handling \`InterruptedException\` correctly is a top interview point:** blocking methods (\`sleep\`/\`wait\`/\`join\`) throw it and **clear** the interrupt flag, so you should either **restore it** (\`Thread.currentThread().interrupt()\`) or propagate the exception — never swallow it silently.`,
      internal: `\`RUNNABLE\` in Java covers both "actually running" and "ready but waiting for a CPU/OS resource" (Java doesn't separate them). \`BLOCKED\` specifically means waiting to enter a \`synchronized\` block (§8.5); \`WAITING\`/\`TIMED_WAITING\` mean the thread voluntarily paused (\`wait\`/\`join\`/\`sleep\`/\`park\`). The **interrupt flag** is a boolean on the thread; \`isInterrupted()\` reads it, the static \`Thread.interrupted()\` reads **and clears** it. The deprecated \`stop()\`/\`suspend()\`/\`resume()\` are dangerous (they can leave objects in inconsistent states / cause deadlock) and must not be used — cooperative interruption is the correct approach.`,
      useCases: `- **\`join\`** — wait for worker results before proceeding (or use \`Future\`, §8.4).
- **\`sleep\`** — polling intervals, retries/backoff, simple delays.
- **\`interrupt\`** — graceful shutdown/cancellation of long-running tasks.
- **State inspection** — diagnosing hangs (a thread stuck BLOCKED hints at lock contention/deadlock, §8.8).`,
      code: `\`\`\`java
public class LifecycleDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread t = new Thread(() -> {
            try {
                for (int i = 0; i < 5; i++) {
                    System.out.println("working " + i);
                    Thread.sleep(200);                 // TIMED_WAITING
                }
            } catch (InterruptedException e) {
                System.out.println("interrupted — stopping");
                Thread.currentThread().interrupt();    // restore flag
            }
        }, "worker");

        System.out.println(t.getState());              // NEW
        t.start();
        Thread.sleep(450);
        System.out.println(t.getState());              // TIMED_WAITING (probably)
        t.interrupt();                                  // request stop
        t.join();                                       // wait for it
        System.out.println(t.getState());              // TERMINATED
    }
}
\`\`\``,
      mistakes: `- **Swallowing \`InterruptedException\`** (empty catch) — loses the cancellation signal; restore the flag or propagate.
- **Thinking \`sleep\` releases locks** — it doesn't (only \`wait\` does, §8.6).
- **Using deprecated \`stop()\`/\`suspend()\`/\`resume()\`** — unsafe; use cooperative interruption.
- **Busy-waiting** with \`yield\`/tight loops — wastes CPU; use \`wait\`/\`join\`/blocking queues instead.
- **Restarting a TERMINATED thread** — impossible; create a new one.
- **Relying on exact state timing** — states are observed snapshots, not guarantees.`,
      bestPractices: `- Handle **\`InterruptedException\`** by restoring the flag (\`Thread.currentThread().interrupt()\`) or rethrowing — never swallow.
- Use **\`join\`** (or \`Future.get\`, §8.4) to wait for results rather than \`sleep\` polling.
- Implement **cooperative cancellation** with the interrupt flag; check it in loops.
- Avoid deprecated control methods; avoid busy-waiting.
- Prefer **executors/futures** (§8.11) over manual lifecycle management in real code.`,
      interview: `**Q1. What are the thread states?**
NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED (\`Thread.State\`).

**Q2. Difference between sleep() and wait()?**
\`sleep\` (Thread, timed) pauses but **keeps** held locks; \`wait\` (Object, §8.6) releases the lock and waits for \`notify\`. \`sleep\` doesn't need a lock; \`wait\` must be in a synchronized block.

**Q3. What does join() do?**
Makes the current thread wait until the target thread terminates.

**Q4. How do you stop a thread safely?**
Cooperative interruption (\`interrupt()\` + checking \`isInterrupted()\`/handling \`InterruptedException\`); never \`stop()\`.

**Q5. How should you handle InterruptedException?**
Restore the interrupt flag (\`Thread.currentThread().interrupt()\`) or propagate it — don't swallow it.

**Q6. Difference between BLOCKED and WAITING?**
BLOCKED = waiting to acquire a monitor lock; WAITING = voluntarily paused via \`wait\`/\`join\`/\`park\`.`,
      exercises: `1. Print a thread's state at NEW, during \`sleep\`, and after termination.
2. Use \`join\` so \`main\` waits for two workers before printing a result.
3. Implement a worker that stops cleanly on \`interrupt()\`, restoring the flag.
4. Show that \`sleep\` inside a \`synchronized\` block keeps the lock (another thread stays BLOCKED).`,
      challenges: `Build a cancellable long-running task: a worker that processes items in a loop, checks \`isInterrupted()\`, handles \`InterruptedException\` from a blocking \`sleep\` by restoring the flag and exiting cleanly, and reports how many items it finished. From \`main\`, let it run briefly, then \`interrupt()\` and \`join()\`. Explain why this cooperative model is safer than \`Thread.stop()\` (inconsistent state) and how it maps to the lifecycle states.`,
      summary: `- Threads move through **NEW → RUNNABLE → (BLOCKED/WAITING/TIMED_WAITING) → TERMINATED** (\`Thread.State\`).
- Control with **\`sleep\`** (pauses, keeps locks), **\`join\`** (wait for completion), **\`yield\`** (hint), **\`interrupt\`** (cooperative cancel).
- Handle **\`InterruptedException\`** by restoring the flag or propagating — never swallow; avoid deprecated \`stop\`/\`suspend\`/\`resume\`.
- \`sleep\` ≠ \`wait\` (\`wait\` releases the lock, §8.6); a terminated thread can't restart; prefer executors/futures (§8.4/§8.11).`
    }),

    /* 8.4 Callable & Future. */
    topic({
      id: "callable-future", chapter: "8.4", title: "Callable & Future",
      subtitle: "Tasks that return results (and throw) — and how to retrieve them.",
      readTime: "14 min", level: "Core", deep: true,
      objectives: [
        "Use Callable<V> for tasks that return a value or throw a checked exception.",
        "Submit tasks to an executor and retrieve results with Future.",
        "Handle blocking get(), timeouts, cancellation, and exceptions.",
        "Contrast Runnable vs Callable."
      ],
      concept: `**\`Runnable\`** (§8.2) can't **return a result** or throw a **checked exception**. **\`Callable<V>\`** fixes both: its single method **\`V call() throws Exception\`** returns a value and may throw.

\`\`\`java
import java.util.concurrent.*;

Callable<Integer> task = () -> {
    Thread.sleep(100);
    return 6 * 7;          // returns a result (Runnable can't)
};
ExecutorService pool = Executors.newSingleThreadExecutor();
Future<Integer> future = pool.submit(task);   // submit -> get a Future handle
Integer result = future.get();                // blocks until the result is ready -> 42
pool.shutdown();
\`\`\`

You submit a \`Callable\` to an executor (§8.11) and receive a **\`Future\`** — a handle to the *eventual* result.`,
      why: `Most real concurrent work needs a **result back**: compute something on another thread and collect the answer. \`Callable\` + \`Future\` provide that **asynchronous result** model:

- **Return values** from background tasks.
- **Propagate exceptions** from the task to the caller (wrapped in \`ExecutionException\`).
- **Cancel** tasks, check completion, and wait with **timeouts**.

It's the foundation that \`CompletableFuture\` (§8.13) builds on for richer async composition.`,
      runnableVsCallable: `**Runnable vs Callable:**

| | \`Runnable\` | \`Callable<V>\` |
|---|---|---|
| Method | \`void run()\` | \`V call() throws Exception\` |
| Returns | nothing | a value of type V |
| Checked exceptions | cannot throw | can throw |
| Submit via | \`execute\`/\`submit\` | \`submit\` (returns \`Future<V>\`) |
| Since | 1.0 | 5.0 |

Use \`Runnable\` for fire-and-forget side-effects; \`Callable\` when you need a **result** or to throw checked exceptions.`,
      future: `**\`Future<V>\`** represents a pending result with these operations:

| Method | Purpose |
|---|---|
| \`get()\` | **block** until done, return the result |
| \`get(timeout, unit)\` | block up to a timeout (\`TimeoutException\`) |
| \`isDone()\` | has it completed? (non-blocking) |
| \`cancel(mayInterrupt)\` | attempt cancellation |
| \`isCancelled()\` | was it cancelled? |

\`\`\`java
Future<Integer> f = pool.submit(() -> compute());
if (!f.isDone()) doOtherWork();          // overlap work
try {
    Integer r = f.get(2, TimeUnit.SECONDS);   // wait up to 2s
} catch (TimeoutException e) {
    f.cancel(true);                       // give up and interrupt
} catch (ExecutionException e) {
    Throwable cause = e.getCause();       // the task's exception (Module 4 §4.12)
}
\`\`\`

**\`get()\` blocks** — that's \`Future\`'s main limitation, addressed by the non-blocking \`CompletableFuture\` (§8.13).`,
      internal: `When you \`submit\` a \`Callable\`/\`Runnable\`, the executor wraps it in a \`FutureTask\` (which is both a \`Runnable\` and a \`Future\`), runs it on a pool thread, and stores the result/exception. \`get()\` blocks the **calling** thread until the task completes, then returns the value — or throws **\`ExecutionException\`** wrapping whatever the task threw (use \`getCause()\` to unwrap, Module 4 §4.12). A \`Runnable\` submitted via \`submit\` yields a \`Future<?>\` whose \`get()\` returns \`null\` on completion (useful just to wait/await exceptions). Cancellation is cooperative — \`cancel(true)\` interrupts the running thread (§8.3).`,
      useCases: `- **Parallel computation** that returns results (sum chunks, fetch multiple resources).
- **Async I/O**: submit a fetch, do other work, then \`get()\` the response.
- **Timeouts**: \`get(timeout)\` to bound how long you wait.
- **invokeAll/invokeAny**: run many \`Callable\`s and gather all/first results (§8.11).`,
      code: `\`\`\`java
import java.util.*;
import java.util.concurrent.*;

public class CallableFutureDemo {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(3);

        // submit several Callables, collect Futures
        List<Callable<Integer>> tasks = List.of(
            () -> { Thread.sleep(100); return 10; },
            () -> { Thread.sleep(50);  return 20; },
            () -> 30);

        List<Future<Integer>> futures = pool.invokeAll(tasks);  // runs all
        int sum = 0;
        for (Future<Integer> f : futures) sum += f.get();        // gather results
        System.out.println("sum = " + sum);                      // 60

        // exception propagation
        Future<Integer> bad = pool.submit(() -> { throw new IllegalStateException("boom"); });
        try { bad.get(); }
        catch (ExecutionException e) { System.out.println("cause: " + e.getCause().getMessage()); }

        pool.shutdown();
    }
}
\`\`\``,
      mistakes: `- **Calling \`get()\` immediately** after submit — blocks right away, defeating concurrency; submit all tasks first, then gather.
- **Ignoring \`ExecutionException\`** / not unwrapping \`getCause()\` to find the real failure (Module 4 §4.12).
- **No timeout on \`get()\`** — risks hanging forever; use \`get(timeout, unit)\`.
- **Forgetting to \`shutdown()\` the executor** — non-daemon pool threads keep the JVM alive (§8.11).
- **Using \`Runnable\` when you need a result** — use \`Callable\`.
- **Assuming \`cancel\` always stops the task** — it's cooperative (interruption, §8.3).`,
      bestPractices: `- Use **\`Callable\`** when you need a return value or checked-exception propagation; **\`Runnable\`** for fire-and-forget.
- **Submit first, gather later** (or use \`invokeAll\`) to maximise overlap.
- Always handle **\`ExecutionException\`** (unwrap \`getCause()\`) and prefer **\`get(timeout)\`**.
- **Shut down** the executor (§8.11) in a \`finally\`/lifecycle hook.
- For composition/non-blocking pipelines, prefer **\`CompletableFuture\`** (§8.13).`,
      interview: `**Q1. Runnable vs Callable?**
\`Runnable.run()\` returns nothing and can't throw checked exceptions; \`Callable.call()\` returns a value and may throw checked exceptions.

**Q2. What is a Future?**
A handle to a task's eventual result — \`get()\` (blocking), \`isDone()\`, \`cancel()\`, with timeout support.

**Q3. What does Future.get() do?**
Blocks until the task completes and returns the result, or throws \`ExecutionException\` wrapping the task's exception.

**Q4. How do you bound the wait?**
\`get(timeout, unit)\` — throws \`TimeoutException\` if not done in time.

**Q5. How are task exceptions surfaced?**
Wrapped in \`ExecutionException\`; unwrap with \`getCause()\`.

**Q6. Future's main limitation?**
\`get()\` blocks and Futures don't compose; \`CompletableFuture\` (§8.13) adds non-blocking chaining.`,
      exercises: `1. Submit a \`Callable\` returning a value and retrieve it via \`Future.get()\`.
2. Use \`invokeAll\` to run several Callables and sum their results.
3. Demonstrate \`ExecutionException\` and unwrap the cause from a throwing task.
4. Use \`get(timeout)\` and cancel a task that exceeds the timeout.`,
      challenges: `Compute a large sum in parallel: split a big array into chunks, submit one \`Callable<Long>\` per chunk to a fixed pool, collect the \`Future\`s, and combine results — comparing the time against a single-threaded sum. Add a timeout and graceful cancellation, and handle a deliberately failing chunk via \`ExecutionException\`. Discuss why \`Future.get()\` blocking motivates \`CompletableFuture\` (§8.13) for pipelines.`,
      summary: `- **\`Callable<V>\`** (\`V call() throws Exception\`) returns a result and may throw — unlike **\`Runnable\`** (\`void run()\`).
- Submit to an executor → get a **\`Future<V>\`**: **\`get()\`** (blocking, with timeout), \`isDone\`, \`cancel\`; task exceptions arrive as **\`ExecutionException\`** (unwrap \`getCause()\`).
- Submit-then-gather to overlap work; always **shut down** the executor (§8.11).
- \`Future.get()\` blocks and doesn't compose → **\`CompletableFuture\` (§8.13)** for non-blocking pipelines.`
    }),

    /* ===================== CORE: COORDINATION ===================== */

    /* 8.5 Synchronization. */
    topic({
      id: "synchronization", chapter: "8.5", title: "Synchronization",
      subtitle: "The synchronized keyword — mutual exclusion via monitor locks.",
      readTime: "16 min", level: "Core", deep: true,
      objectives: [
        "Explain race conditions and how synchronization prevents them.",
        "Use synchronized methods and blocks; understand the monitor lock.",
        "Distinguish instance locks from class (static) locks.",
        "Know the cost of synchronization and how to keep critical sections small."
      ],
      concept: `**Synchronization** ensures that only **one thread at a time** executes a **critical section** — code that accesses shared mutable state — preventing **race conditions** (§8.1). Java's built-in mechanism is the **\`synchronized\`** keyword, which acquires an object's **monitor lock** (a.k.a. intrinsic lock).

\`\`\`java
class Counter {
    private int count;
    public synchronized void increment() {   // only one thread at a time
        count++;                              // now atomic w.r.t. other synchronized calls
    }
    public synchronized int get() { return count; }
}
\`\`\`

While a thread holds the lock, other threads calling \`synchronized\` methods/blocks on the **same object** are **BLOCKED** (§8.3) until it's released.`,
      why: `\`count++\` is a **read-modify-write** that isn't atomic, so concurrent calls **lose updates** (§8.1). Synchronization provides two guarantees:

1. **Mutual exclusion (atomicity)** — only one thread in the critical section at a time, so compound operations complete without interference.
2. **Visibility (happens-before)** — changes made by one thread inside a synchronized block are **visible** to the next thread that acquires the same lock (ties to the memory model, §8.7).

Together these make shared state safe to read and modify across threads.`,
      formsOfSync: `**Synchronized methods vs blocks:**

\`\`\`java
// 1) synchronized instance method -> locks 'this'
public synchronized void m() { ... }

// equivalent block:
public void m() { synchronized (this) { ... } }

// 2) synchronized block on a specific lock object (finer-grained)
private final Object lock = new Object();
public void m() { synchronized (lock) { ... } }

// 3) synchronized STATIC method -> locks the Class object (ClassName.class)
public static synchronized void s() { ... }
\`\`\`

**Blocks** are preferred when only part of a method is critical (smaller critical section) or when you want a **private lock object** (so external code can't acquire your lock).`,
      instanceVsClassLock: `**Instance lock vs class lock — a key distinction:**

- A \`synchronized\` **instance** method locks **\`this\`** — different *objects* have different locks, so two threads can run it on two **different instances** simultaneously.
- A \`synchronized\` **static** method locks the **\`Class\`** object — shared across *all* instances, so it serialises across the whole class.

\`\`\`java
synchronized (this) {}            // per-instance
synchronized (MyClass.class) {}   // per-class (all instances)
\`\`\`

Mixing them: an instance lock and a class lock are **different** monitors, so they don't exclude each other — a subtle source of bugs.`,
      internal: `Every Java object has an associated **monitor**. \`synchronized\` compiles to \`monitorenter\`/\`monitorexit\` bytecode (or method flags). The monitor is **reentrant** — a thread that already holds the lock can re-acquire it (e.g., one synchronized method calling another on the same object) without deadlocking itself. The lock is **automatically released** when the block/method exits, **even on exception** (like a built-in \`finally\`). For visibility, releasing a monitor **flushes** writes and acquiring it **reads** the latest values — establishing **happens-before** (§8.7). Synchronization has a cost (lock contention, blocked threads), so keep critical sections **small** and consider lock-free atomics (§8.10) for simple counters.`,
      useCases: `- **Protecting shared mutable state**: counters, caches, accumulators.
- **Compound invariants**: check-then-act, read-modify-write that must be atomic.
- **Guarding non-thread-safe objects** (e.g., a shared \`SimpleDateFormat\`, \`ArrayList\`).
- **Simple coordination** where a high-level concurrent collection (§8.12) or atomic (§8.10) doesn't fit.`,
      code: `\`\`\`java
public class SyncDemo {
    static class SafeCounter {
        private int count;
        public synchronized void inc() { count++; }      // mutual exclusion + visibility
        public synchronized int get() { return count; }
    }
    public static void main(String[] args) throws InterruptedException {
        SafeCounter c = new SafeCounter();
        Runnable job = () -> { for (int i = 0; i < 100_000; i++) c.inc(); };
        Thread t1 = new Thread(job), t2 = new Thread(job);
        t1.start(); t2.start(); t1.join(); t2.join();
        System.out.println(c.get());   // 200000 — correct (no lost updates)

        // block form with a private lock
        Object lock = new Object();
        synchronized (lock) { /* critical section */ }
    }
}
\`\`\``,
      mistakes: `- **Forgetting to synchronize all access** — if any reader/writer skips the lock, the protection fails (and visibility breaks).
- **Synchronizing on different locks** for the same state (e.g., instance vs class lock) — no mutual exclusion.
- **Synchronizing on a mutable/\`String\`-pooled/boxed object** — \`synchronized("x")\` or \`synchronized(Integer)\` can accidentally share a lock; use a \`private final Object\`.
- **Over-synchronizing** — large critical sections kill concurrency; keep them small.
- **Holding a lock during slow I/O/sleep** — \`sleep\` keeps the lock (§8.3), blocking everyone.
- **Assuming \`synchronized\` makes a whole sequence of separate calls atomic** — only each block is atomic.`,
      bestPractices: `- Synchronize **all** access (reads and writes) to the shared state on the **same** lock.
- Use **private final lock objects** and **blocks** to keep critical sections small and locks encapsulated.
- Prefer **immutability** (Module 3 §3.4) and **lock-free atomics** (§8.10) where they suffice.
- Never hold a lock during I/O, sleeps, or callbacks.
- Document the locking policy ("guarded by \`lock\`"); be consistent about instance vs class locks.`,
      interview: `**Q1. What does synchronized do?**
It enforces mutual exclusion via an object's monitor lock (one thread at a time in the critical section) and provides visibility (happens-before) for shared state.

**Q2. Synchronized method vs block?**
A synchronized method locks \`this\` (or the Class for static); a block locks a specified object, allowing smaller critical sections and private locks.

**Q3. Instance lock vs class lock?**
Instance methods lock \`this\` (per object); static methods lock the \`Class\` object (per class) — they're different monitors.

**Q4. Is the intrinsic lock reentrant?**
Yes — a thread holding the lock can re-acquire it.

**Q5. Does synchronized guarantee visibility?**
Yes — releasing a monitor flushes writes; acquiring it sees them (happens-before, §8.7).

**Q6. Why avoid synchronizing on String literals or boxed values?**
They may be shared (string pool, Integer cache), so unrelated code could share your lock; use a dedicated \`private final Object\`.`,
      exercises: `1. Show the lost-update race, then fix it with a synchronized method; confirm the correct total.
2. Convert a synchronized method into a synchronized block with a private lock.
3. Demonstrate that two threads can run an instance-synchronized method on two different objects concurrently.
4. Show that \`sleep\` inside a synchronized block keeps another thread BLOCKED.`,
      challenges: `Build a thread-safe bounded bank account with \`deposit\`/\`withdraw\` where \`withdraw\` must atomically check balance then debit (a check-then-act). Use \`synchronized\` to make it correct under concurrent access, prove correctness with many threads, and then measure contention. Discuss when you'd instead use an \`AtomicLong\` (§8.10) or a \`Lock\` with \`tryLock\` (§8.9), and why holding the lock during a slow operation would be a bug.`,
      summary: `- **\`synchronized\`** acquires an object's **monitor lock** to enforce **mutual exclusion** (atomicity) and **visibility** (happens-before, §8.7) over shared state.
- Forms: synchronized **method** (locks \`this\`/\`Class\`) vs **block** (locks a chosen object) — prefer small blocks with **private final** locks.
- The lock is **reentrant** and auto-released (even on exception); instance vs **static** locks are different monitors.
- Keep critical sections small; never hold locks during I/O/sleep; consider **atomics (§8.10)**/immutability. Inter-thread signalling: **§8.6**.`
    }),

    /* 8.6 Inter-thread Communication: wait/notify. */
    topic({
      id: "wait-notify", chapter: "8.6", title: "Inter-thread Communication (wait/notify)",
      subtitle: "How threads signal each other — the wait/notify protocol.",
      readTime: "15 min", level: "Core", deep: true,
      objectives: [
        "Use wait(), notify(), and notifyAll() for thread coordination.",
        "Explain why wait must be in a synchronized block and called in a loop.",
        "Implement a producer-consumer with wait/notify.",
        "Know the higher-level alternatives (BlockingQueue, Condition)."
      ],
      concept: `Sometimes a thread must **wait for a condition** that another thread will make true (e.g., a consumer waits until a producer adds an item). The low-level mechanism is the **\`wait\`/\`notify\`** protocol on an object's monitor (the same monitor used by \`synchronized\`, §8.5):

- **\`wait()\`** — releases the lock and **suspends** the thread until notified.
- **\`notify()\`** — wakes **one** waiting thread on that monitor.
- **\`notifyAll()\`** — wakes **all** waiting threads on that monitor.

\`\`\`java
synchronized (lock) {
    while (!conditionMet) {     // ALWAYS loop, never if
        lock.wait();            // releases lock, waits, re-acquires on wake
    }
    // proceed — condition is now true
}
\`\`\`

These methods are on **\`Object\`** (every object can be a monitor) and must be called while **holding that object's lock**.`,
      why: `Without signalling, a waiting thread would have to **busy-wait** (spin in a loop checking a flag), wasting CPU. \`wait\`/\`notify\` let a thread **sleep efficiently** until another thread signals that state changed — the basis of producer/consumer, bounded buffers, and hand-off coordination. (In practice you'd use higher-level tools like \`BlockingQueue\` (§8.12) — but understanding \`wait\`/\`notify\` is essential for interviews and for grasping how those tools work.)`,
      rules: `**The critical rules (interview gold):**

1. **Must hold the monitor** — \`wait\`/\`notify\` must be called inside a \`synchronized\` block on the **same** object, or you get \`IllegalMonitorStateException\`.
2. **\`wait\` releases the lock** (unlike \`sleep\`, §8.3) so others can proceed and eventually \`notify\`.
3. **Always wait in a \`while\` loop**, never an \`if\` — to guard against **spurious wakeups** and to **re-check** the condition after waking (another thread may have changed it).
4. **On wake, \`wait\` re-acquires the lock** before returning.

\`\`\`java
// ❌ wrong: if + no lock
if (!ready) lock.wait();          // IllegalMonitorStateException / missed wakeup risk
// ✅ right:
synchronized (lock) { while (!ready) lock.wait(); }
\`\`\``,
      notifyVsNotifyAll: `**\`notify()\` vs \`notifyAll()\`:**

- **\`notify()\`** wakes **one** arbitrary waiter — efficient, but risky if waiters are waiting on **different** conditions (you might wake the "wrong" one, causing a missed signal/deadlock).
- **\`notifyAll()\`** wakes **all** waiters; each re-checks its condition in the loop and the ones whose condition isn't met go back to waiting. Safer by default.

> Rule of thumb: **prefer \`notifyAll()\`** unless you're certain all waiters wait on the same condition and only one can proceed.`,
      producerConsumer: `**Classic producer-consumer with wait/notify:**

\`\`\`java
class Buffer {
    private final Queue<Integer> q = new LinkedList<>();
    private final int capacity = 5;

    public synchronized void produce(int x) throws InterruptedException {
        while (q.size() == capacity) wait();   // wait if full
        q.add(x);
        notifyAll();                            // signal consumers
    }
    public synchronized int consume() throws InterruptedException {
        while (q.isEmpty()) wait();             // wait if empty
        int x = q.poll();
        notifyAll();                            // signal producers
        return x;
    }
}
\`\`\`

Note: both methods are \`synchronized\` on the buffer, loop on the condition, and \`notifyAll\` after changing state.`,
      internal: `\`wait()\` atomically **releases the monitor and parks** the thread in the monitor's **wait set**; \`notify\`/\`notifyAll\` move waiters from the wait set back to the **entry set**, where they compete to re-acquire the lock (so a notified thread doesn't run until it re-acquires the monitor). **Spurious wakeups** (a thread waking without a notify) are permitted by the JVM/OS, which is exactly why the condition must be re-checked in a \`while\` loop. \`wait(timeout)\` adds a maximum wait. These are the primitives behind higher-level constructs; \`Condition\` (with explicit \`Lock\`s, §8.9) and \`BlockingQueue\` (§8.12) are the modern, less error-prone alternatives.`,
      useCases: `- **Producer-consumer / bounded buffers** (though \`BlockingQueue\` §8.12 is preferred).
- **Hand-off coordination** between threads (one waits for another's result/signal).
- **Implementing custom synchronizers** (rare — usually use \`java.util.concurrent\`).
- **Understanding** how \`BlockingQueue\`, \`CountDownLatch\`, etc. work under the hood.`,
      code: `\`\`\`java
import java.util.*;

public class WaitNotifyDemo {
    static final Object lock = new Object();
    static boolean ready = false;

    public static void main(String[] args) throws InterruptedException {
        Thread consumer = new Thread(() -> {
            synchronized (lock) {
                while (!ready) {                     // loop, not if
                    try { lock.wait(); } catch (InterruptedException e) { return; }
                }
                System.out.println("consumed signal");
            }
        });
        Thread producer = new Thread(() -> {
            synchronized (lock) {
                ready = true;
                lock.notifyAll();                    // wake waiters
                System.out.println("produced signal");
            }
        });
        consumer.start();
        Thread.sleep(100);                            // let consumer wait first
        producer.start();
        consumer.join(); producer.join();
    }
}
\`\`\``,
      mistakes: `- **Calling \`wait\`/\`notify\` outside a synchronized block** — \`IllegalMonitorStateException\`.
- **Using \`if\` instead of \`while\`** — fails on spurious wakeups and stale conditions (the #1 wait/notify bug).
- **\`notify()\` with mixed conditions** — may wake the wrong thread → missed signal/deadlock; use \`notifyAll()\`.
- **Lost wakeup** — calling \`notify\` before the other thread \`wait\`s (no waiter to wake); guard with a condition flag re-checked in the loop.
- **Confusing \`wait\` (releases lock) with \`sleep\` (keeps lock)** (§8.3).
- **Hand-rolling wait/notify** when \`BlockingQueue\` (§8.12) would be simpler and safer.`,
      bestPractices: `- Always **\`wait\` in a \`while\` loop** that re-checks the condition; always inside \`synchronized\`.
- Prefer **\`notifyAll()\`** unless a single condition makes \`notify()\` provably safe.
- Keep a **state flag/condition** so signals aren't lost (re-checked under the lock).
- Prefer **higher-level tools** — \`BlockingQueue\` (§8.12), \`Condition\`/\`Lock\` (§8.9), \`CountDownLatch\`, \`Semaphore\` — over raw \`wait\`/\`notify\`.
- Handle \`InterruptedException\` properly (§8.3) inside the wait loop.`,
      interview: `**Q1. What do wait(), notify(), notifyAll() do?**
\`wait\` releases the monitor and suspends the thread; \`notify\` wakes one waiter; \`notifyAll\` wakes all — all on the same object's monitor.

**Q2. Why must wait be called in a synchronized block?**
It operates on the object's monitor, which the thread must hold — otherwise \`IllegalMonitorStateException\`.

**Q3. Why wait in a while loop, not an if?**
To handle spurious wakeups and re-check the condition (which may have changed by the time the thread reacquires the lock).

**Q4. notify vs notifyAll?**
\`notify\` wakes one arbitrary waiter (risky with multiple conditions); \`notifyAll\` wakes all (safer; each re-checks).

**Q5. Difference between wait and sleep?**
\`wait\` releases the lock and needs a monitor + \`notify\`; \`sleep\` keeps locks and just pauses for a duration (§8.3).

**Q6. What's a modern alternative?**
\`BlockingQueue\` (§8.12) or \`Lock\`+\`Condition\` (§8.9).`,
      exercises: `1. Implement a one-shot signal between two threads using \`wait\`/\`notify\` with a boolean flag and a while loop.
2. Build a bounded buffer producer-consumer with \`wait\`/\`notifyAll\`.
3. Show the \`IllegalMonitorStateException\` from calling \`wait\` without holding the lock.
4. Demonstrate why \`if\` instead of \`while\` is unsafe (simulate a spurious/late wakeup).`,
      challenges: `Implement a bounded blocking buffer (\`put\`/\`take\`) using only \`synchronized\` + \`wait\`/\`notifyAll\`, supporting multiple producers and consumers without lost signals or deadlock. Stress-test it with several producer/consumer threads and verify no items are lost or duplicated. Then replace your implementation with a \`java.util.concurrent.ArrayBlockingQueue\` (§8.12) and discuss how much complexity (and bug surface) it removes.`,
      summary: `- **\`wait\`/\`notify\`/\`notifyAll\`** (on \`Object\`'s monitor) coordinate threads: \`wait\` **releases the lock** and suspends; \`notify\`(All) wakes waiter(s).
- Must run **inside \`synchronized\`** on the same object; **always \`wait\` in a \`while\` loop** (spurious wakeups); prefer **\`notifyAll()\`**.
- Classic use: **producer-consumer / bounded buffers**; \`wait\` ≠ \`sleep\` (§8.3).
- Prefer modern tools — **\`BlockingQueue\` (§8.12)**, **\`Lock\`+\`Condition\` (§8.9)** — in real code.`
    }),

    /* 8.7 volatile & the Java Memory Model. */
    topic({
      id: "volatile", chapter: "8.7", title: "volatile & the Java Memory Model",
      subtitle: "Visibility, reordering, and the happens-before relationship.",
      readTime: "16 min", level: "Advanced", deep: true,
      objectives: [
        "Explain the visibility problem and what volatile guarantees.",
        "Distinguish visibility (volatile) from atomicity (synchronized/atomics).",
        "Understand the Java Memory Model and happens-before.",
        "Use volatile correctly (flags) and know its limits."
      ],
      concept: `**\`volatile\`** is a field modifier that guarantees **visibility** and ordering for that variable across threads: a write by one thread is **immediately visible** to reads by other threads, and the compiler/CPU won't reorder accesses around it in problematic ways.

\`\`\`java
class Worker {
    private volatile boolean running = true;   // visible across threads
    public void stop() { running = false; }    // write seen promptly by run()
    public void run() {
        while (running) { /* work */ }          // reads the latest 'running'
    }
}
\`\`\`

Without \`volatile\`, the \`run()\` loop might **never see** \`running = false\` (it could read a cached value forever) — the classic **visibility** bug.`,
      why: `On modern hardware, each CPU core has **caches**, and the compiler/JIT may **reorder** instructions for speed. So a write by thread A may sit in A's cache, invisible to thread B; or operations may appear out of order. **\`volatile\`** addresses *visibility* and *ordering* (but **not** atomicity) cheaply — ideal for **status flags** and **safe publication** of a reference. It's the lightest synchronization tool when you only need "see the latest value."`,
      whatItGuarantees: `**What \`volatile\` guarantees — and what it does NOT:**

| Guarantees ✅ | Does NOT guarantee ❌ |
|---|---|
| **Visibility** — reads always see the latest write | **Atomicity** of compound ops (e.g., \`count++\`) |
| **Ordering** — no reordering across the volatile access | **Mutual exclusion** (no locking) |
| safe publication of the field's value | safe multi-step invariants |

\`\`\`java
volatile int count;
count++;     // ❌ STILL a race: read-modify-write is not atomic even when volatile
\`\`\`

For atomic increments use \`AtomicInteger\` (§8.10) or \`synchronized\` (§8.5); \`volatile\` alone only fixes visibility, not the lost-update race.`,
      jmm: `**The Java Memory Model (JMM)** defines *when* one thread's writes are visible to another, via the **happens-before** relationship. If action A *happens-before* B, then A's effects are visible to B. Key happens-before rules:

- **Program order** — within a single thread, earlier statements happen-before later ones.
- **Monitor lock** — unlocking a monitor happens-before a subsequent lock of the **same** monitor (§8.5).
- **Volatile** — a write to a volatile field happens-before every subsequent read of it.
- **Thread start/join** — \`start()\` happens-before the thread's actions; a thread's actions happen-before another's return from \`join()\`.

So \`synchronized\`, \`volatile\`, \`Thread.start/join\`, and the \`java.util.concurrent\` utilities all establish happens-before edges that make shared data visible — that's the formal basis of "thread-safe."`,
      internal: `A volatile read/write inserts **memory barriers (fences)**: a volatile **write** flushes pending writes to main memory and prevents earlier operations from being reordered after it; a volatile **read** invalidates cached values and prevents later operations from being reordered before it. This is cheaper than a lock (no blocking/contention) but provides **no mutual exclusion**. A famous correct use is the **double-checked locking** singleton, where the instance field **must be \`volatile\`** to prevent a partially-constructed object from being published. Note \`long\`/\`double\` writes are not guaranteed atomic without \`volatile\` on 32-bit JVMs — \`volatile\` also makes those reads/writes atomic.`,
      useCases: `- **Status/stop flags** read by many threads (\`volatile boolean running\`).
- **Safe publication** of an immutable object reference set once.
- **Double-checked locking** singletons (\`volatile\` instance field).
- **\`long\`/\`double\` atomic visibility** where needed.
- Anywhere you need *visibility* but **not** atomic compound updates (use atomics §8.10 / locks §8.5 for those).`,
      code: `\`\`\`java
public class VolatileDemo {
    static volatile boolean running = true;   // visibility across threads

    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
            long n = 0;
            while (running) n++;               // sees 'running' updates promptly
            System.out.println("stopped after " + n + " iterations");
        });
        worker.start();
        Thread.sleep(50);
        running = false;                       // visible to worker -> loop ends
        worker.join();

        // WHY volatile isn't enough for counting:
        // volatile int c; c++ is read-modify-write -> still racy. Use AtomicInteger (§8.10).
    }
}
\`\`\``,
      mistakes: `- **Using \`volatile\` for counters/compound updates** — \`count++\` is still racy; use atomics (§8.10) or locks.
- **Expecting mutual exclusion** from \`volatile\` — it provides none.
- **Omitting \`volatile\` on a stop flag** — the loop may never see the change (cached read), causing an infinite loop.
- **Forgetting \`volatile\` in double-checked locking** — risks publishing a partially-constructed object.
- **Over-relying on visibility** while ignoring atomicity invariants.`,
      bestPractices: `- Use \`volatile\` for **simple flags** and **single-writer/safe-publication** scenarios, not for compound updates.
- For atomic read-modify-write, use **\`Atomic*\`** (§8.10) or **\`synchronized\`** (§8.5).
- Prefer **immutability** (Module 3 §3.4) and \`final\` fields for safe sharing where possible.
- Lean on \`java.util.concurrent\` utilities, which establish happens-before for you.
- Understand the **happens-before** rule you're relying on — visibility isn't automatic.`,
      interview: `**Q1. What does volatile guarantee?**
Visibility (reads see the latest write) and ordering (no problematic reordering) for that field — but **not** atomicity or mutual exclusion.

**Q2. Why isn't \`volatile count++\` thread-safe?**
\`count++\` is read-modify-write (three steps); two threads can interleave and lose updates. Use \`AtomicInteger\`/\`synchronized\`.

**Q3. What is the visibility problem?**
A write by one thread may not be seen by another due to CPU caches/compiler reordering, unless coordinated.

**Q4. What is happens-before?**
A JMM relation: if A happens-before B, A's effects are visible to B. Established by program order, monitor lock/unlock, volatile read/write, thread start/join.

**Q5. volatile vs synchronized?**
\`volatile\` = visibility/ordering, no locking, no atomicity for compound ops; \`synchronized\` = mutual exclusion + visibility, but blocks threads.

**Q6. Where is volatile essential?**
Stop flags, safe publication, and the double-checked-locking singleton's instance field.`,
      exercises: `1. Demonstrate the stop-flag bug without \`volatile\` (loop never ends), then fix it with \`volatile\`.
2. Show that \`volatile int c; c++\` still loses updates under two threads.
3. Write a correct double-checked-locking singleton with a \`volatile\` instance field.
4. List which happens-before rule makes a \`synchronized\` write visible to the next reader.`,
      challenges: `Implement and test a graceful-shutdown flag for a worker pool using \`volatile boolean\`, proving the worker sees the change promptly. Then attempt to use \`volatile\` for a shared counter and show it produces wrong totals, fixing it with \`AtomicInteger\` (§8.10). Finally, write a short explanation of the happens-before edges your correct solution relies on (volatile write→read, start/join), tying it to the JMM.`,
      summary: `- **\`volatile\`** guarantees **visibility** and **ordering** for a field (reads see the latest write) — but **not atomicity or mutual exclusion**.
- \`count++\` stays racy even when volatile; use **atomics (§8.10)** / **synchronized (§8.5)** for compound updates.
- The **JMM** defines visibility via **happens-before** (program order, monitor lock, volatile, start/join); volatile inserts memory fences.
- Best for **flags, safe publication, double-checked locking**; for invariants prefer immutability/locks/concurrent utilities.`
    }),

    /* 8.8 Deadlock, Livelock & Starvation. */
    topic({
      id: "deadlock", chapter: "8.8", title: "Deadlock, Livelock & Starvation",
      subtitle: "The liveness hazards of locking — and how to avoid them.",
      readTime: "16 min", level: "Advanced", deep: true,
      objectives: [
        "Define deadlock and its four necessary (Coffman) conditions.",
        "Reproduce a deadlock and fix it with lock ordering.",
        "Distinguish deadlock from livelock and starvation.",
        "Apply prevention strategies (ordering, tryLock, timeouts)."
      ],
      concept: `Locking solves race conditions (§8.5) but introduces **liveness hazards** — situations where threads stop making progress:

- **Deadlock** — two or more threads each hold a lock the other needs, so all wait **forever**.
- **Livelock** — threads keep responding to each other and changing state but make **no progress** (busy but stuck).
- **Starvation** — a thread is perpetually **denied** a resource (CPU/lock) it needs because others monopolise it.

\`\`\`java
// classic deadlock: T1 locks A then B; T2 locks B then A
synchronized (A) { synchronized (B) { ... } }   // thread 1
synchronized (B) { synchronized (A) { ... } }   // thread 2  -> deadlock!
\`\`\`

These are among the hardest concurrency bugs — non-deterministic and hard to reproduce.`,
      why: `Understanding liveness hazards is essential because **adding locks to fix races can create deadlocks**. Interviews frequently ask you to identify a deadlock, state the conditions that cause it, and explain prevention. In production, a deadlock silently hangs threads (and often the whole service), so recognising and designing against it is a core backend skill.`,
      coffman: `**Deadlock requires ALL four Coffman conditions** simultaneously — break any one to prevent it:

1. **Mutual exclusion** — a resource is held exclusively (a lock).
2. **Hold and wait** — a thread holds one lock while waiting for another.
3. **No preemption** — locks can't be forcibly taken away.
4. **Circular wait** — a cycle of threads each waiting on the next's lock.

The most practical one to break is **circular wait** — impose a **global lock ordering** (below).`,
      lockOrdering: `**Prevention #1 — consistent lock ordering** (break circular wait): always acquire multiple locks in the **same global order** in every thread:

\`\`\`java
// FIX: both threads acquire in the same order (A then B)
void transfer(Account from, Account to, int amt) {
    Account first  = from.id < to.id ? from : to;   // order by a stable key
    Account second = from.id < to.id ? to : from;
    synchronized (first) {
        synchronized (second) {
            from.debit(amt); to.credit(amt);
        }
    }
}
\`\`\`

If every thread locks accounts in id order, no cycle can form → no deadlock.`,
      otherPrevention: `**Other prevention/recovery strategies:**

- **\`tryLock\` with timeout** (explicit \`Lock\`, §8.9) — break **hold-and-wait**: if you can't get the second lock in time, release the first and retry/back off.
- **Lock-free designs** — atomics (§8.10) or immutability (Module 3 §3.4) avoid locks entirely.
- **Single lock** — coarse-grained locking avoids multiple-lock cycles (at a concurrency cost).
- **Open calls** — don't call alien/overridable methods while holding a lock (they may grab other locks).

\`\`\`java
if (lockA.tryLock(1, SECONDS)) {
    try {
        if (lockB.tryLock(1, SECONDS)) { try { /* work */ } finally { lockB.unlock(); } }
        else { /* back off, retry */ }
    } finally { lockA.unlock(); }
}
\`\`\``,
      threeCompared: `**Deadlock vs Livelock vs Starvation:**

| | Deadlock | Livelock | Starvation |
|---|---|---|---|
| Threads blocked? | yes (waiting forever) | no — actively running | no — runnable but denied |
| Progress? | none | none (busy spinning) | none for the victim |
| Cause | circular lock wait | over-reactive retry/yield | unfair scheduling/lock |
| Fix | lock ordering, tryLock | randomised backoff | fairness, priorities |

**Livelock** example: two threads each politely back off and retry in lockstep, forever. **Starvation** example: low-priority threads never get the CPU, or a thread never wins a contended unfair lock.`,
      internal: `Deadlock is a **state**, not an exception — the JVM won't throw; threads just sit in **BLOCKED** (or WAITING) state (§8.3) indefinitely. You detect it with thread dumps (\`jstack\`, \`jcmd\`, VisualVM), which explicitly report "Found one Java-level deadlock" with the cycle. Synchronized monitors give **no timeout** — that's why explicit \`Lock\`s with \`tryLock\` (§8.9) are valuable for deadlock-avoidance. Fairness settings (e.g., \`new ReentrantLock(true)\`, §8.9) reduce starvation by granting locks roughly in arrival order, at some throughput cost.`,
      useCases: `- **Banking transfers** between two accounts (the canonical deadlock; fix with id ordering).
- **Resource graphs** acquiring multiple locks (files, connections).
- **Diagnosing production hangs** via thread dumps.
- **Designing lock-acquisition policies** in any multi-lock subsystem.`,
      code: `\`\`\`java
public class DeadlockDemo {
    static final Object A = new Object(), B = new Object();
    public static void main(String[] args) {
        // DEADLOCK-PRONE (different orders):
        Thread t1 = new Thread(() -> { synchronized (A) { sleep(50); synchronized (B) {} } });
        Thread t2 = new Thread(() -> { synchronized (B) { sleep(50); synchronized (A) {} } });
        t1.start(); t2.start();
        // FIX: make both lock A before B (same order) -> no circular wait
    }
    static void sleep(long ms){ try { Thread.sleep(ms); } catch (InterruptedException e){ Thread.currentThread().interrupt(); } }
}
\`\`\``,
      mistakes: `- **Acquiring multiple locks in inconsistent order** — the classic cause of deadlock (circular wait).
- **Holding a lock while calling alien/overridable methods** — they may acquire other locks unexpectedly.
- **Using \`synchronized\` (no timeout) where deadlock is possible** — prefer \`tryLock\` (§8.9).
- **"Fixing" with \`yield\`/retry loops** that create **livelock** instead.
- **Ignoring fairness** — leads to starvation under heavy contention.
- **Assuming the JVM will detect/recover** — it won't; threads just hang.`,
      bestPractices: `- Impose a **global lock ordering** for all multi-lock acquisitions (break circular wait).
- Prefer **\`tryLock\` with timeout + backoff** (§8.9) to avoid hold-and-wait.
- **Minimise locking**: fewer/smaller locks, lock-free atomics (§8.10), immutability (Module 3 §3.4).
- **Never** hold a lock across I/O, sleeps, or alien calls.
- Use **fair locks** where starvation is a risk; monitor with **thread dumps** in production.`,
      interview: `**Q1. What is a deadlock?**
A state where two+ threads each hold a lock the other needs and wait forever; the JVM doesn't recover.

**Q2. What are the four Coffman conditions?**
Mutual exclusion, hold-and-wait, no preemption, circular wait — all must hold; break any one to prevent deadlock.

**Q3. How do you prevent deadlock?**
Most practically, impose a consistent global lock-acquisition order; also use \`tryLock\` with timeouts, fewer locks, and lock-free designs.

**Q4. Deadlock vs livelock vs starvation?**
Deadlock: blocked forever. Livelock: active but no progress (over-reactive retries). Starvation: a thread is perpetually denied a resource.

**Q5. How do you detect a deadlock?**
Thread dumps (\`jstack\`/\`jcmd\`/VisualVM) report the deadlock cycle.

**Q6. Why prefer Lock.tryLock over synchronized here?**
\`tryLock\` supports timeouts, so a thread can give up and release held locks instead of waiting forever.`,
      exercises: `1. Write a two-lock deadlock (different acquisition orders) and confirm the hang, then fix it with consistent ordering.
2. Fix the same scenario using \`tryLock\` with a timeout and backoff (§8.9).
3. Construct a simple livelock (two threads endlessly yielding to each other) and describe the difference from deadlock.
4. Take a thread dump of a deadlocked program and identify the cycle.`,
      challenges: `Implement a money-transfer system between accounts that is provably deadlock-free under concurrent transfers in both directions. Provide two correct solutions — (a) global lock ordering by account id, and (b) \`tryLock\` with timeout + retry — and stress-test both with many threads transferring back and forth. Compare their throughput and fairness, and explain which Coffman condition each approach breaks.`,
      summary: `- **Deadlock**: threads wait forever on each other's locks; needs all four **Coffman conditions** (mutual exclusion, hold-and-wait, no preemption, **circular wait**).
- Prevent by **consistent global lock ordering** (break circular wait) and **\`tryLock\` + timeout** (break hold-and-wait); minimise/avoid locks.
- **Livelock** (busy but no progress) and **starvation** (perpetually denied) are related liveness failures — fix with backoff and **fairness**.
- The JVM won't recover; **detect via thread dumps**. Explicit \`Lock\`s (§8.9) enable timeouts/fairness.`
    }),

    /* ===================== ADVANCED ===================== */

    /* 8.9 Locks. */
    topic({
      id: "locks", chapter: "8.9", title: "Locks (ReentrantLock & ReadWriteLock)",
      subtitle: "Explicit locks with timeouts, fairness, and conditions.",
      readTime: "15 min", level: "Advanced", deep: true,
      objectives: [
        "Use ReentrantLock with the lock/try-finally/unlock idiom.",
        "Leverage tryLock, fairness, and interruptible locking.",
        "Use ReadWriteLock for read-heavy workloads.",
        "Compare explicit Locks with synchronized (§8.5)."
      ],
      concept: `The **\`java.util.concurrent.locks\`** package provides **explicit \`Lock\`** objects — a more flexible alternative to the built-in \`synchronized\` monitor (§8.5). The main implementation is **\`ReentrantLock\`**.

\`\`\`java
import java.util.concurrent.locks.*;

private final Lock lock = new ReentrantLock();
public void critical() {
    lock.lock();                 // acquire
    try {
        // critical section
    } finally {
        lock.unlock();           // ALWAYS release in finally
    }
}
\`\`\`

Unlike \`synchronized\` (which auto-releases), an explicit \`Lock\` must be **manually released** — always in a \`finally\` block (§8.7/Module 4 §4.7), or you risk a permanently-held lock.`,
      why: `\`synchronized\` is simple but **inflexible**: you can't time out, can't interrupt a waiting thread, can't try-without-blocking, and can't choose fairness. \`ReentrantLock\` adds all of these — crucial for **deadlock avoidance** (\`tryLock\` with timeout, §8.8), responsiveness (interruptible acquisition), and fairness (reducing starvation). \`ReadWriteLock\` further boosts throughput for **read-heavy** data by allowing concurrent readers.`,
      reentrantFeatures: `**\`ReentrantLock\` capabilities beyond \`synchronized\`:**

| Feature | Method | Benefit |
|---|---|---|
| Non-blocking attempt | \`tryLock()\` | acquire only if free (no waiting) |
| Timed attempt | \`tryLock(t, unit)\` | give up after a timeout (deadlock avoidance) |
| Interruptible | \`lockInterruptibly()\` | abort a waiting acquire on interrupt |
| Fairness | \`new ReentrantLock(true)\` | grant lock in arrival order (reduce starvation) |
| Conditions | \`newCondition()\` | multiple wait-sets (vs one per monitor, §8.6) |

It's **reentrant** (like the intrinsic lock, §8.5) — the holding thread can re-acquire it; you must \`unlock()\` the same number of times.`,
      readWriteLock: `**\`ReadWriteLock\`** (impl: \`ReentrantReadWriteLock\`) separates a **read lock** from a **write lock**:

- **Read lock** — held by **many** readers simultaneously (shared) as long as no writer holds it.
- **Write lock** — **exclusive** (one writer, no readers).

\`\`\`java
private final ReadWriteLock rw = new ReentrantReadWriteLock();
public V get(K k) {
    rw.readLock().lock();
    try { return map.get(k); } finally { rw.readLock().unlock(); }
}
public void put(K k, V v) {
    rw.writeLock().lock();
    try { map.put(k, v); } finally { rw.writeLock().unlock(); }
}
\`\`\`

Great for **read-mostly** caches — readers don't block each other, only writers serialise. (\`StampedLock\` adds optimistic reads for even more throughput.)`,
      conditions: `**\`Condition\`** is the explicit-lock equivalent of \`wait\`/\`notify\` (§8.6), but you can have **multiple conditions per lock** (e.g., "not full" and "not empty" for a bounded buffer):

\`\`\`java
private final Lock lock = new ReentrantLock();
private final Condition notFull  = lock.newCondition();
private final Condition notEmpty = lock.newCondition();

public void put(T x) throws InterruptedException {
    lock.lock();
    try {
        while (full()) notFull.await();   // like wait(), but on a specific condition
        enqueue(x);
        notEmpty.signal();                // like notify(), targeted
    } finally { lock.unlock(); }
}
\`\`\`

\`await\`/\`signal\`/\`signalAll\` mirror \`wait\`/\`notify\`/\`notifyAll\` but allow **separate wait queues**, avoiding the "wake the wrong waiter" problem (§8.6).`,
      internal: `\`ReentrantLock\` is built on the **AbstractQueuedSynchronizer (AQS)** — a FIFO queue of waiting threads plus an atomic state (CAS-based, §8.10). A non-fair lock (default) allows **barging** (a new thread may grab a just-freed lock ahead of queued waiters) for higher throughput; a **fair** lock honours arrival order at a performance cost. Because the lock isn't tied to the syntactic block (unlike \`synchronized\`), forgetting \`unlock()\` leaks the lock forever — hence the mandatory \`try/finally\`. \`synchronized\` is often **just as fast** for uncontended cases (the JIT optimises it), so use explicit locks for their **features**, not blindly for speed.`,
      useCases: `- **Deadlock-avoidance** with \`tryLock(timeout)\` (§8.8).
- **Read-heavy caches/registries** with \`ReadWriteLock\`.
- **Bounded buffers / multi-condition** coordination via \`Condition\` (cleaner than \`wait\`/\`notify\`).
- **Interruptible/cancellable** lock acquisition in responsive systems.`,
      code: `\`\`\`java
import java.util.concurrent.locks.*;
import java.util.concurrent.TimeUnit;

public class LockDemo {
    private final ReentrantLock lock = new ReentrantLock();
    private int balance = 100;

    public boolean withdraw(int amt) throws InterruptedException {
        if (lock.tryLock(1, TimeUnit.SECONDS)) {      // timed attempt
            try {
                if (balance >= amt) { balance -= amt; return true; }
                return false;
            } finally { lock.unlock(); }              // always release
        }
        return false;                                  // couldn't acquire -> give up
    }
    public static void main(String[] args) throws InterruptedException {
        LockDemo d = new LockDemo();
        System.out.println(d.withdraw(40));   // true
        System.out.println(d.withdraw(80));   // false
    }
}
\`\`\``,
      mistakes: `- **Forgetting \`unlock()\` in \`finally\`** — a thrown exception leaves the lock held forever (Module 4 §4.7).
- **\`unlock()\`-ing a lock you don't hold** — \`IllegalMonitorStateException\`.
- **Using a plain \`Lock\` where \`synchronized\` suffices** — adds boilerplate without benefit.
- **Mismatched lock/unlock counts** on a reentrant lock — leaves it partially held.
- **Choosing \`fair\` locks by default** — they're slower; use only when starvation is a real problem.
- **\`tryLock()\` without checking the return value** — proceeding as if you hold the lock when you don't.`,
      bestPractices: `- Always \`lock()\` then **\`try { ... } finally { unlock(); }\`**.
- Use explicit \`Lock\`s for their **features** (\`tryLock\`, timeout, interruptible, fairness, conditions); otherwise prefer \`synchronized\` (§8.5).
- Use **\`ReadWriteLock\`** for read-mostly shared data; **\`Condition\`** for multi-state coordination.
- Use **\`tryLock(timeout)\`** to avoid deadlock (§8.8); check its boolean result.
- Keep critical sections small; release before slow operations.`,
      interview: `**Q1. ReentrantLock vs synchronized?**
\`ReentrantLock\` adds tryLock (timed/non-blocking), interruptible acquisition, fairness, and multiple conditions, but requires manual \`unlock()\` in \`finally\`. \`synchronized\` auto-releases and is simpler.

**Q2. Why must unlock be in a finally block?**
Explicit locks aren't auto-released; an exception would otherwise leave the lock held forever.

**Q3. What does ReadWriteLock provide?**
Concurrent reads (shared read lock) with exclusive writes — boosting throughput for read-heavy data.

**Q4. What is a fair lock?**
One that grants the lock in arrival order, reducing starvation at the cost of throughput.

**Q5. How is Condition related to wait/notify?**
\`await\`/\`signal\`/\`signalAll\` are the explicit-lock equivalents, but a lock can have multiple Conditions (separate wait queues).

**Q6. What underlies ReentrantLock?**
The AbstractQueuedSynchronizer (AQS) — a CAS-based FIFO wait queue.`,
      exercises: `1. Convert a \`synchronized\` counter to use \`ReentrantLock\` with the try/finally idiom.
2. Use \`tryLock(timeout)\` to avoid blocking and handle the "couldn't acquire" case.
3. Implement a read-mostly cache with \`ReadWriteLock\` and show concurrent reads.
4. Build a bounded buffer with two \`Condition\`s (notFull/notEmpty).`,
      challenges: `Reimplement the bounded blocking buffer from §8.6 using \`ReentrantLock\` + two \`Condition\`s (\`notFull\`, \`notEmpty\`), then add a \`ReadWriteLock\`-based concurrent cache and benchmark read throughput vs a fully \`synchronized\` version under many readers. Discuss when fairness matters and how \`tryLock\` with timeout would let the buffer's operations bound their wait (deadlock/liveness, §8.8).`,
      summary: `- **\`ReentrantLock\`** is an explicit, reentrant lock (use \`lock()\` + **\`try/finally\` \`unlock()\`**) adding **\`tryLock\`/timeout/interruptible/fairness/\`Condition\`** over \`synchronized\`.
- **\`ReadWriteLock\`** allows many concurrent **readers**, exclusive **writers** — ideal for read-heavy data.
- **\`Condition\`** = multi-queue \`wait\`/\`notify\` (\`await\`/\`signal\`), avoiding "wrong waiter" issues (§8.6).
- Built on **AQS/CAS**; use explicit locks for their **features**, otherwise \`synchronized\`; \`tryLock(timeout)\` aids deadlock avoidance (§8.8).`
    }),

    /* 8.10 Atomic Classes. */
    topic({
      id: "atomic-classes", chapter: "8.10", title: "Atomic Classes & CAS",
      subtitle: "Lock-free thread safety with compare-and-swap.",
      readTime: "14 min", level: "Advanced", deep: true,
      objectives: [
        "Use AtomicInteger/Long/Reference for lock-free atomic updates.",
        "Explain compare-and-swap (CAS) and how it avoids locks.",
        "Use updateAndGet/accumulateAndGet and LongAdder for hot counters.",
        "Know the ABA problem and AtomicStampedReference."
      ],
      concept: `The **\`java.util.concurrent.atomic\`** package provides classes like **\`AtomicInteger\`**, **\`AtomicLong\`**, and **\`AtomicReference\`** that perform **atomic** read-modify-write operations **without locks** — solving the \`count++\` race (§8.1/§8.5) cheaply.

\`\`\`java
import java.util.concurrent.atomic.*;

AtomicInteger counter = new AtomicInteger(0);
counter.incrementAndGet();    // atomic ++ ; returns new value
counter.addAndGet(5);         // atomic += 5
int v = counter.get();        // current value
\`\`\`

\`incrementAndGet()\` is a single atomic operation, so concurrent increments **never lose updates** — unlike \`volatile int\` (§8.7) which only fixes visibility, not atomicity.`,
      why: `Locks (§8.5/§8.9) are correct but involve **blocking** and context switches. For simple shared values (counters, accumulators, flags, single-reference swaps), **atomics are faster and lock-free**: threads never block — they retry a tiny CAS loop. This gives high throughput under contention for fine-grained updates and is the foundation of \`ConcurrentHashMap\` and the locks themselves (AQS, §8.9).`,
      cas: `**Compare-And-Swap (CAS) — the core mechanism:** a single atomic CPU instruction that updates a value **only if** it still equals an expected value:

\`\`\`
CAS(memory, expected, newValue):
   if memory == expected: memory = newValue; return true
   else: return false   // someone else changed it -> retry
\`\`\`

Atomic operations are implemented as a **CAS retry loop**:

\`\`\`java
// incrementAndGet() conceptually:
int current, next;
do {
    current = get();
    next = current + 1;
} while (!compareAndSet(current, next));   // retry if another thread changed it
return next;
\`\`\`

No lock is acquired — threads spin briefly instead of blocking. This is **optimistic** concurrency (assume no conflict, retry if there was one).`,
      operations: `**Key atomic types and methods:**

| Type | Use |
|---|---|
| \`AtomicInteger\` / \`AtomicLong\` | atomic counters/accumulators |
| \`AtomicBoolean\` | atomic flags |
| \`AtomicReference<T>\` | atomic object-reference swaps |
| \`LongAdder\` / \`DoubleAdder\` | **high-contention** counters (faster than AtomicLong) |

Common methods: \`get\`/\`set\`, \`incrementAndGet\`/\`getAndIncrement\`, \`addAndGet\`, \`compareAndSet(expect, update)\`, and functional updates \`updateAndGet(fn)\` / \`accumulateAndGet(x, fn)\`:

\`\`\`java
AtomicReference<List<String>> ref = new AtomicReference<>(List.of());
ref.updateAndGet(list -> { var n = new ArrayList<>(list); n.add("x"); return List.copyOf(n); });
\`\`\``,
      longAdder: `**\`LongAdder\` for hot counters:** under **heavy contention**, a single \`AtomicLong\` becomes a bottleneck (all threads CAS the same cell, retrying constantly). **\`LongAdder\`** spreads updates across **multiple internal cells** and sums them on \`sum()\`/\`longValue()\`, drastically reducing contention:

\`\`\`java
LongAdder hits = new LongAdder();
hits.increment();         // very fast under contention
long total = hits.sum();  // combine cells (read)
\`\`\`

Use \`LongAdder\` when many threads update a counter frequently and you read it rarely (metrics); use \`AtomicLong\` when you need exact value at every step or low contention.`,
      internal: `Atomics rely on hardware CAS (via \`Unsafe\`/\`VarHandle\`) and store the value in a **\`volatile\`** field (so reads see the latest, §8.7). They are **lock-free** but not wait-free — under extreme contention the retry loop can spin. The **ABA problem**: a value changes A→B→A; a CAS expecting A succeeds even though it changed in between. If that matters (e.g., lock-free stacks), use **\`AtomicStampedReference\`** (value + version stamp) or \`AtomicMarkableReference\`. Atomics provide atomicity + visibility for **single** variables only — for multi-variable invariants you still need locks (§8.9) or a single \`AtomicReference\` to an immutable snapshot.`,
      useCases: `- **Counters/metrics**: request counts, IDs (\`AtomicLong\` / \`LongAdder\`).
- **Flags**: \`AtomicBoolean\` for one-shot initialisation / shutdown.
- **Lock-free data structures**: \`AtomicReference\` + CAS (stacks, queues).
- **Sequence/ID generation** across threads.
- Underpinning \`ConcurrentHashMap\` (§8.12) and \`ReentrantLock\` (§8.9).`,
      code: `\`\`\`java
import java.util.concurrent.atomic.*;

public class AtomicDemo {
    public static void main(String[] args) throws InterruptedException {
        AtomicInteger counter = new AtomicInteger();
        Runnable job = () -> { for (int i = 0; i < 100_000; i++) counter.incrementAndGet(); };
        Thread t1 = new Thread(job), t2 = new Thread(job);
        t1.start(); t2.start(); t1.join(); t2.join();
        System.out.println(counter.get());   // 200000 — correct, lock-free

        // functional update + CAS
        AtomicInteger max = new AtomicInteger(0);
        int candidate = 42;
        max.updateAndGet(cur -> Math.max(cur, candidate));   // atomic "max"
        System.out.println(max.get());                       // 42

        // high-contention counter
        LongAdder adder = new LongAdder();
        adder.add(10); adder.increment();
        System.out.println(adder.sum());                     // 11
    }
}
\`\`\``,
      mistakes: `- **Using \`volatile\` for \`count++\`** — still racy (§8.7); use an atomic.
- **Combining two atomics expecting joint atomicity** — each is atomic alone, not together; for multi-variable invariants use a lock or a single \`AtomicReference\` snapshot.
- **\`AtomicLong\` under heavy contention** — prefer \`LongAdder\` for hot counters.
- **Ignoring the ABA problem** in CAS-based structures — use \`AtomicStampedReference\`.
- **Side-effecting lambdas in \`updateAndGet\`/\`accumulateAndGet\`** — they may run **multiple times** (retry loop), so keep them pure.`,
      bestPractices: `- Use **atomics** for single-variable counters/flags/references instead of locks.
- Use **\`LongAdder\`/\`DoubleAdder\`** for high-contention counters read infrequently.
- Keep **\`updateAndGet\`/\`accumulateAndGet\`** functions **pure and idempotent** (they can retry).
- For multi-field atomic state, hold the fields in an **immutable object** referenced by one \`AtomicReference\` and CAS the whole snapshot.
- Reserve locks (§8.9) for genuinely compound critical sections.`,
      interview: `**Q1. What problem do atomic classes solve?**
Lock-free atomic read-modify-write on a single variable (e.g., \`incrementAndGet\`), fixing the \`count++\` race without blocking.

**Q2. What is CAS?**
Compare-And-Swap: atomically set a new value only if the current value equals an expected one; atomics retry in a loop until it succeeds.

**Q3. AtomicInteger vs volatile int?**
\`volatile\` gives visibility only; \`AtomicInteger\` gives atomic compound updates (visibility + atomicity).

**Q4. When use LongAdder over AtomicLong?**
Under high write contention with infrequent reads — \`LongAdder\` spreads updates across cells to reduce contention.

**Q5. What is the ABA problem?**
A value goes A→B→A; a CAS expecting A wrongly succeeds. Fix with \`AtomicStampedReference\` (versioned).

**Q6. Are atomics blocking?**
No — they're lock-free (CAS retry loop); threads spin rather than block.`,
      exercises: `1. Fix the lost-update race with \`AtomicInteger.incrementAndGet\` and confirm the exact total.
2. Implement an atomic "max" with \`updateAndGet\`.
3. Compare \`AtomicLong\` vs \`LongAdder\` under many threads (conceptually or by timing).
4. Demonstrate \`compareAndSet\` returning false when another thread changed the value.`,
      challenges: `Build a lock-free counter and a lock-free \`AtomicReference\`-based immutable-snapshot "settings" holder (CAS the whole immutable object on update). Stress-test under many threads and verify correctness. Then switch the counter to \`LongAdder\` and measure the throughput improvement under contention, explaining the CAS retry loop and why \`updateAndGet\` lambdas must be pure (they can re-run).`,
      summary: `- **Atomic classes** (\`AtomicInteger/Long/Boolean/Reference\`) give **lock-free** atomic updates via **CAS** (compare-and-swap retry loops) — fixing \`count++\` without blocking.
- They provide atomicity **and** visibility for a **single** variable; multi-variable invariants still need locks (§8.9) or a CAS'd immutable snapshot.
- **\`LongAdder\`** beats \`AtomicLong\` for high-contention counters; watch the **ABA problem** (\`AtomicStampedReference\`).
- Keep \`updateAndGet\`/\`accumulateAndGet\` lambdas **pure** (they may retry); atomics underpin \`ConcurrentHashMap\` (§8.12) and locks (§8.9).`
    }),

    /* 8.11 Executor Framework. */
    topic({
      id: "executor-framework", chapter: "8.11", title: "Executor Framework & Thread Pools",
      subtitle: "Reusable thread pools — the right way to run concurrent tasks.",
      readTime: "17 min", level: "Advanced", deep: true,
      objectives: [
        "Explain why thread pools beat creating raw threads.",
        "Create executors with the Executors factory and ThreadPoolExecutor.",
        "Submit tasks (execute/submit/invokeAll) and shut down cleanly.",
        "Choose pool types and understand the core tuning parameters."
      ],
      concept: `The **Executor Framework** (\`java.util.concurrent\`) decouples **task submission** from **thread management**. Instead of \`new Thread()\` per task (§8.2), you submit tasks to an **\`ExecutorService\`** backed by a **thread pool** that **reuses** a bounded set of threads.

\`\`\`java
import java.util.concurrent.*;

ExecutorService pool = Executors.newFixedThreadPool(4);
pool.execute(() -> doWork());                 // Runnable, fire-and-forget
Future<Integer> f = pool.submit(() -> 42);    // Callable, returns a Future (§8.4)
pool.shutdown();                              // stop accepting; finish queued tasks
\`\`\`

This is **the standard way** to run concurrent work in real applications.`,
      why: `Creating a thread per task is **expensive** (native resources, ~1MB stack) and **unbounded** (a spike can exhaust memory/OS threads). Thread pools fix this:

- **Reuse** threads across many tasks (no per-task creation cost).
- **Bound** concurrency (limit threads → protect the system from overload).
- **Queue** excess work instead of failing.
- **Separation of concerns** — you write tasks; the executor handles scheduling, lifecycle, and reuse.

It also integrates with \`Callable\`/\`Future\` (§8.4) and \`CompletableFuture\` (§8.13).`,
      poolTypes: `**\`Executors\` factory methods (convenient, but know their trade-offs):**

| Factory | Pool | Use |
|---|---|---|
| \`newFixedThreadPool(n)\` | fixed n threads, unbounded queue | steady CPU-bound load |
| \`newCachedThreadPool()\` | grows/shrinks, reuses idle | many short async tasks (can over-create!) |
| \`newSingleThreadExecutor()\` | one thread, sequential | ordered task execution |
| \`newScheduledThreadPool(n)\` | delayed/periodic tasks | scheduling (\`schedule\`, \`scheduleAtFixedRate\`) |
| \`newVirtualThreadPerTaskExecutor()\` (Java 21) | a virtual thread per task | massive I/O concurrency |

> Caution: \`newFixedThreadPool\` uses an **unbounded queue** (memory risk under overload), and \`newCachedThreadPool\` can create **unbounded threads**. Production systems often configure a **\`ThreadPoolExecutor\`** directly (below).`,
      threadPoolExecutor: `**\`ThreadPoolExecutor\` — full control** over the pool's behaviour:

\`\`\`java
ThreadPoolExecutor pool = new ThreadPoolExecutor(
    4,                      // corePoolSize  — kept alive
    8,                      // maximumPoolSize — max threads
    60, TimeUnit.SECONDS,   // keepAlive for idle extra threads
    new ArrayBlockingQueue<>(100),          // BOUNDED work queue
    new ThreadPoolExecutor.CallerRunsPolicy()); // rejection policy when full
\`\`\`

How it scales: tasks fill **core threads**, then the **queue**, then up to **max threads**; if the queue and max are full, the **rejection policy** kicks in (\`AbortPolicy\` (default, throws), \`CallerRunsPolicy\`, \`DiscardPolicy\`, \`DiscardOldestPolicy\`). Using a **bounded queue + sensible rejection policy** prevents resource exhaustion — the key production tuning.`,
      submission: `**Submitting and collecting work:**

\`\`\`java
pool.execute(runnable);                    // fire-and-forget (no result)
Future<T> f = pool.submit(callable);       // returns a Future (§8.4)
List<Future<T>> all = pool.invokeAll(tasks); // run all, return when all done
T first = pool.invokeAny(tasks);           // return the first successful result
\`\`\`

**Shutting down (mandatory):**

\`\`\`java
pool.shutdown();                           // no new tasks; finish existing
if (!pool.awaitTermination(30, TimeUnit.SECONDS))
    pool.shutdownNow();                    // interrupt running, drop queued
\`\`\`

A non-daemon pool keeps the JVM alive, so always shut it down (often in a \`finally\`/lifecycle hook).`,
      internal: `Tuning the pool size matters: for **CPU-bound** work, \`~\` number of cores (\`Runtime.getRuntime().availableProcessors()\`); for **I/O-bound** work, more threads (they spend time blocked) — roughly \`cores * (1 + wait/compute)\`. \`ScheduledThreadPoolExecutor\` adds delayed/periodic scheduling. The framework also includes the **fork/join** pool (\`ForkJoinPool.commonPool()\`), which uses **work-stealing** and backs parallel streams (§7.8). Java 21 **virtual threads** make "thread-per-task" cheap again for blocking I/O, but pooling platform threads remains the model for CPU-bound work.`,
      useCases: `- **Servers**: a bounded pool per endpoint/stage handling requests.
- **Parallel batch processing**: split work into tasks, \`invokeAll\`, combine.
- **Scheduled jobs**: periodic cleanup/polling via \`ScheduledExecutorService\`.
- **Async pipelines** feeding \`CompletableFuture\` (§8.13).`,
      code: `\`\`\`java
import java.util.*;
import java.util.concurrent.*;

public class ExecutorDemo {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(
            Runtime.getRuntime().availableProcessors());
        try {
            List<Callable<Integer>> tasks = new ArrayList<>();
            for (int i = 1; i <= 8; i++) { int n = i; tasks.add(() -> n * n); }

            int sum = 0;
            for (Future<Integer> f : pool.invokeAll(tasks)) sum += f.get();
            System.out.println("sum of squares = " + sum);   // 204

            // scheduled task
            ScheduledExecutorService sched = Executors.newScheduledThreadPool(1);
            sched.schedule(() -> System.out.println("ran later"), 100, TimeUnit.MILLISECONDS);
            sched.shutdown();
        } finally {
            pool.shutdown();
            pool.awaitTermination(10, TimeUnit.SECONDS);
        }
    }
}
\`\`\``,
      mistakes: `- **Not shutting down the executor** — non-daemon threads keep the JVM running.
- **\`newFixedThreadPool\`/\`newCachedThreadPool\` in production** without realising the **unbounded queue / unbounded threads** risk — configure \`ThreadPoolExecutor\` with a bounded queue + rejection policy.
- **Sizing pools wrong** — too few starves throughput; too many causes context-switch thrash.
- **Blocking inside pool threads** on each other → **pool deadlock** (all threads waiting on tasks that can't be scheduled).
- **Swallowing task exceptions** — with \`execute\` they may vanish; use \`submit\` + \`Future.get\` (§8.4) or an \`UncaughtExceptionHandler\`.
- **Sharing one pool for unrelated workloads** — isolate pools to avoid one stalling another.`,
      bestPractices: `- **Always use a pool** (executor) over raw threads; **always \`shutdown()\`** (in \`finally\`/lifecycle).
- Prefer an explicitly-configured **\`ThreadPoolExecutor\`** with a **bounded queue** and a **rejection policy** in production.
- Size pools by workload: **~cores** for CPU-bound, more for I/O-bound.
- Use **\`submit\` + \`Future\`** (§8.4) to surface task exceptions; isolate pools per workload.
- Use \`ScheduledExecutorService\` for periodic work; consider **virtual threads** (Java 21) for high-concurrency blocking I/O.`,
      interview: `**Q1. Why use a thread pool instead of new threads?**
Thread creation is expensive and unbounded; pools reuse threads, bound concurrency, and queue work — improving performance and stability.

**Q2. What does Executors.newFixedThreadPool do, and its risk?**
Creates n reusable threads with an **unbounded** task queue — which can exhaust memory under overload; prefer a bounded \`ThreadPoolExecutor\`.

**Q3. execute vs submit?**
\`execute\` runs a \`Runnable\` (no result, exceptions can be lost); \`submit\` returns a \`Future\` (result + exception via \`get\`, §8.4).

**Q4. How do you shut down an executor?**
\`shutdown()\` (graceful) then \`awaitTermination\`; \`shutdownNow()\` to interrupt running tasks.

**Q5. How do you size a thread pool?**
~number of cores for CPU-bound work; more for I/O-bound (threads block); measure.

**Q6. What are ThreadPoolExecutor's key parameters?**
core/max pool size, keep-alive, the work queue, the thread factory, and the rejection policy.`,
      exercises: `1. Replace per-task \`new Thread\` with a fixed pool; submit Callables and sum results via \`invokeAll\`.
2. Configure a \`ThreadPoolExecutor\` with a bounded queue and \`CallerRunsPolicy\`; flood it and observe behaviour.
3. Schedule a repeating task with \`scheduleAtFixedRate\` and stop it.
4. Show that forgetting \`shutdown()\` keeps the JVM alive; then fix it.`,
      challenges: `Build a small "web server" simulation: a bounded \`ThreadPoolExecutor\` (core 4, max 8, queue 50, \`CallerRunsPolicy\`) processing simulated requests. Demonstrate graceful shutdown (\`shutdown\` + \`awaitTermination\` + \`shutdownNow\` fallback), surface a failing task's exception via \`Future.get\`, and explain how queue+max+rejection-policy protect the service under overload. Discuss CPU-bound vs I/O-bound sizing and where virtual threads (Java 21) change the calculus.`,
      summary: `- The **Executor Framework** separates task submission from thread management; submit tasks to a **reusable, bounded thread pool** (\`ExecutorService\`) instead of \`new Thread\` per task.
- Use \`Executors\` factories for convenience, but prefer an explicit **\`ThreadPoolExecutor\`** with a **bounded queue + rejection policy** in production; size by CPU- vs I/O-bound.
- Submit with **\`execute\`/\`submit\`/\`invokeAll\`** (use \`submit\`+\`Future\` to catch exceptions, §8.4); **always \`shutdown()\`**.
- Backs parallel streams (fork/join, §7.8) and \`CompletableFuture\` (§8.13); virtual threads (Java 21) for high-concurrency I/O.`
    }),

    /* 8.12 Concurrent Collections. */
    topic({
      id: "concurrent-collections", chapter: "8.12", title: "Concurrent Collections",
      subtitle: "Thread-safe, scalable collections from java.util.concurrent.",
      readTime: "15 min", level: "Advanced", deep: true,
      objectives: [
        "Use ConcurrentHashMap, CopyOnWriteArrayList, and BlockingQueue.",
        "Explain why they beat synchronized wrappers and legacy classes.",
        "Apply BlockingQueue to producer-consumer.",
        "Use synchronizers: CountDownLatch, Semaphore, CyclicBarrier."
      ],
      concept: `The **\`java.util.concurrent\`** package provides **thread-safe collections** designed for high concurrency — far better than wrapping plain collections with \`Collections.synchronizedXxx\` (one global lock) or using legacy \`Vector\`/\`Hashtable\` (Module 5 §5.7/§5.16).

\`\`\`java
import java.util.concurrent.*;

ConcurrentMap<String,Integer> map = new ConcurrentHashMap<>();
map.merge("hits", 1, Integer::sum);                  // atomic, scalable (Module 5 §5.17)

BlockingQueue<Task> queue = new LinkedBlockingQueue<>();
queue.put(task);                                     // blocks if full
Task t = queue.take();                               // blocks if empty
\`\`\`

These collections use **fine-grained locking, CAS, or copy-on-write** so many threads can operate with minimal contention.`,
      why: `Synchronized wrappers serialise **all** access through one lock (and need external locking during iteration). Concurrent collections instead:

- **Scale** — readers rarely block; writers contend only locally.
- **Are fail-safe** — their iterators don't throw \`ConcurrentModificationException\` (Module 5 §5.2).
- **Offer atomic compound operations** (\`merge\`, \`computeIfAbsent\`) and **blocking** operations (queues) that hand-rolled \`wait\`/\`notify\` (§8.6) would require.

They're the building blocks of real concurrent systems (caches, task pipelines).`,
      keyCollections: `**The essential concurrent collections:**

| Collection | Use | Mechanism |
|---|---|---|
| \`ConcurrentHashMap\` | concurrent map (Module 5 §5.17) | bucket-level locks + CAS |
| \`CopyOnWriteArrayList\` | read-mostly list | copies array on write |
| \`CopyOnWriteArraySet\` | read-mostly set | backed by COW list |
| \`ConcurrentLinkedQueue\` | non-blocking FIFO queue | lock-free (CAS) |
| \`BlockingQueue\` (impls below) | producer-consumer | blocks on full/empty |
| \`ConcurrentSkipListMap/Set\` | sorted concurrent map/set | lock-free skip list |

\`CopyOnWriteArrayList\` is ideal when reads vastly outnumber writes (e.g., listener lists): reads are lock-free; each write copies the whole array (expensive for frequent writes).`,
      blockingQueue: `**\`BlockingQueue\` — the producer-consumer workhorse** (replaces manual \`wait\`/\`notify\`, §8.6):

| Method | On full (put) / empty (take) |
|---|---|
| \`put\` / \`take\` | **block** until space/element available |
| \`offer\` / \`poll\` | return false/null (or with timeout) |
| \`add\` / \`remove\` | throw if full/empty |

Implementations: \`ArrayBlockingQueue\` (bounded, array), \`LinkedBlockingQueue\` (optionally bounded), \`PriorityBlockingQueue\` (priority, §5.11), \`SynchronousQueue\` (hand-off, zero capacity).

\`\`\`java
BlockingQueue<Integer> q = new ArrayBlockingQueue<>(10);
// producer:  q.put(item);    // waits if full
// consumer:  Integer x = q.take();   // waits if empty
\`\`\`

This makes the classic producer-consumer trivial and safe — no locks or condition variables to manage.`,
      synchronizers: `**Synchronizers — coordinate threads without sharing data:**

| Class | Purpose |
|---|---|
| \`CountDownLatch\` | wait until N events complete (one-shot) |
| \`CyclicBarrier\` | N threads wait for each other, then proceed (reusable) |
| \`Semaphore\` | limit concurrent access to N permits |
| \`Phaser\` | flexible multi-phase barrier |

\`\`\`java
CountDownLatch latch = new CountDownLatch(3);
// workers: latch.countDown();   // signal done
latch.await();                   // main waits until count reaches 0

Semaphore permits = new Semaphore(2);   // at most 2 at a time
permits.acquire(); try { useResource(); } finally { permits.release(); }
\`\`\``,
      internal: `\`ConcurrentHashMap\` (Module 5 §5.17) uses per-bucket synchronization + CAS with lock-free reads. \`CopyOnWriteArrayList\` gives every mutation a **fresh copy** of the backing array (volatile reference swap), so readers see a stable snapshot with **no locking** — perfect for rarely-written, often-read data. \`BlockingQueue\`s internally use \`ReentrantLock\` + \`Condition\` (§8.9) or CAS to block/wake producers and consumers correctly. Synchronizers like \`CountDownLatch\`/\`Semaphore\` are built on **AQS** (§8.9). All of these are **fail-safe** (Module 5 §5.2) and designed for concurrent use without external synchronization.`,
      useCases: `- **Shared caches/registries**: \`ConcurrentHashMap\`.
- **Listener/observer lists**: \`CopyOnWriteArrayList\` (read-mostly).
- **Task pipelines / thread pools' queues**: \`BlockingQueue\` (producer-consumer).
- **Coordinating startup/completion**: \`CountDownLatch\` (await all workers), \`CyclicBarrier\` (phased computation), \`Semaphore\` (rate/connection limiting).`,
      code: `\`\`\`java
import java.util.concurrent.*;

public class ConcurrentCollectionsDemo {
    public static void main(String[] args) throws InterruptedException {
        BlockingQueue<Integer> queue = new ArrayBlockingQueue<>(5);
        CountDownLatch done = new CountDownLatch(1);

        // producer
        new Thread(() -> {
            try { for (int i = 1; i <= 5; i++) queue.put(i); queue.put(-1); }   // -1 = poison pill
            catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        }).start();

        // consumer
        new Thread(() -> {
            try {
                int x;
                while ((x = queue.take()) != -1) System.out.println("consumed " + x);
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            finally { done.countDown(); }
        }).start();

        done.await();                          // wait for consumer to finish
        System.out.println("pipeline complete");
    }
}
\`\`\``,
      mistakes: `- **Using \`Collections.synchronizedMap\`/\`Vector\`/\`Hashtable\`** for high concurrency — they don't scale (Module 5 §5.7/§5.16).
- **\`CopyOnWriteArrayList\` for write-heavy data** — every write copies the array (O(n)); only for read-mostly.
- **Manual \`wait\`/\`notify\` producer-consumer** when a \`BlockingQueue\` would be simpler/safer (§8.6).
- **Check-then-act on \`ConcurrentHashMap\`** — use atomic \`merge\`/\`computeIfAbsent\` (Module 5 §5.17).
- **Reusing a \`CountDownLatch\`** — it's one-shot; use \`CyclicBarrier\` for repeated coordination.
- **Forgetting \`Semaphore.release()\` in \`finally\`** — leaks permits.`,
      bestPractices: `- Prefer **\`java.util.concurrent\`** collections over synchronized wrappers/legacy classes for concurrency.
- Use **\`BlockingQueue\`** for producer-consumer (often a poison pill or \`poll(timeout)\` to stop).
- Use **\`CopyOnWriteArrayList\`** only for read-mostly data; **\`ConcurrentHashMap\`** with atomic ops for maps.
- Pick the right **synchronizer**: latch (one-shot await), barrier (reusable phases), semaphore (limit concurrency).
- Always release permits/locks in \`finally\`; handle \`InterruptedException\` (§8.3).`,
      interview: `**Q1. Why use concurrent collections over synchronized wrappers?**
They scale via fine-grained locking/CAS/copy-on-write, are fail-safe (no CME), and offer atomic/blocking operations — synchronized wrappers serialise everything through one lock.

**Q2. When use CopyOnWriteArrayList?**
Read-mostly scenarios (e.g., listener lists); writes copy the whole array, so it's poor for frequent writes.

**Q3. What is a BlockingQueue and a key use?**
A thread-safe queue whose \`put\`/\`take\` block on full/empty — the backbone of producer-consumer and thread pools.

**Q4. CountDownLatch vs CyclicBarrier?**
Latch is one-shot (wait for N events, can't reset); barrier is reusable (N threads wait for each other each cycle).

**Q5. What does a Semaphore do?**
Limits concurrent access to N permits (acquire/release) — e.g., bounding connections.

**Q6. Are concurrent-collection iterators fail-fast?**
No — they're weakly consistent / fail-safe (Module 5 §5.2).`,
      exercises: `1. Build a producer-consumer with \`ArrayBlockingQueue\` using a poison pill to stop the consumer.
2. Use \`ConcurrentHashMap.merge\` to count events from multiple threads (no lost updates).
3. Coordinate three workers with a \`CountDownLatch\` so \`main\` proceeds only after all finish.
4. Limit concurrent access with a \`Semaphore(2)\` and show only two threads enter at once.`,
      challenges: `Build a bounded work-pipeline: producers \`put\` jobs into a \`BlockingQueue\`, a fixed pool of consumers \`take\` and process them, a \`Semaphore\` limits concurrent external calls, and a \`CountDownLatch\` lets \`main\` await completion. Use \`ConcurrentHashMap\` + \`merge\` for per-type counters. Compare this to a hand-rolled \`wait\`/\`notify\` (§8.6) + \`synchronized\` version and explain why the concurrent utilities are safer and more scalable.`,
      summary: `- **\`java.util.concurrent\`** collections (\`ConcurrentHashMap\`, \`CopyOnWriteArrayList\`, \`BlockingQueue\`, \`ConcurrentLinkedQueue\`) scale far better than synchronized wrappers/legacy classes and are **fail-safe** (Module 5 §5.2).
- **\`BlockingQueue\`** (\`put\`/\`take\`) is the clean producer-consumer tool (replaces \`wait\`/\`notify\`, §8.6); **\`CopyOnWriteArrayList\`** suits read-mostly data.
- **Synchronizers**: \`CountDownLatch\` (one-shot await), \`CyclicBarrier\` (reusable phases), \`Semaphore\` (limit concurrency) — built on AQS (§8.9).
- Use atomic map ops (\`merge\`/\`computeIfAbsent\`); release permits in \`finally\`. \`ConcurrentHashMap\` internals: Module 5 §5.17.`
    }),

    /* 8.13 CompletableFuture. */
    topic({
      id: "completablefuture", chapter: "8.13", title: "CompletableFuture",
      subtitle: "Composable, non-blocking asynchronous programming.",
      readTime: "16 min", level: "Advanced", deep: true,
      objectives: [
        "Explain how CompletableFuture improves on Future (§8.4).",
        "Chain async stages with thenApply/thenCompose/thenCombine.",
        "Run tasks with supplyAsync/runAsync and custom executors.",
        "Handle exceptions and combine multiple futures."
      ],
      concept: `**\`CompletableFuture<T>\`** (Java 8) is a \`Future\` (§8.4) you can **compose** and **react to** without blocking. Instead of calling \`get()\` and waiting, you attach **callbacks** that run when the result is ready, building **asynchronous pipelines**.

\`\`\`java
import java.util.concurrent.*;

CompletableFuture
    .supplyAsync(() -> fetchUser(id))        // run async, returns a value
    .thenApply(User::getName)                // transform the result (when ready)
    .thenAccept(name -> System.out.println("Hi " + name))  // consume it
    .exceptionally(ex -> { log(ex); return null; });        // handle failure
\`\`\`

It addresses \`Future\`'s two big limits: **blocking \`get()\`** and **no composition**.`,
      why: `Plain \`Future.get()\` **blocks** and Futures can't be chained, so combining async operations meant ugly nested code. \`CompletableFuture\`:

- **Non-blocking** — register continuations that fire on completion.
- **Composable** — chain transformations, combine multiple async results, handle errors in the pipeline.
- **Async by default** — runs on the common ForkJoinPool or a custom executor (§8.11).

It's the Java equivalent of promises/async-await and the basis of reactive-style code.`,
      creating: `**Starting an async computation:**

\`\`\`java
// run a task that RETURNS a value
CompletableFuture<Integer> f1 = CompletableFuture.supplyAsync(() -> compute());
// run a task with NO result (Runnable)
CompletableFuture<Void> f2 = CompletableFuture.runAsync(() -> doWork());
// an already-completed future
CompletableFuture<String> f3 = CompletableFuture.completedFuture("done");

// supply a custom executor (recommended over the common pool for blocking work)
ExecutorService pool = Executors.newFixedThreadPool(4);
CompletableFuture.supplyAsync(() -> fetch(), pool);
\`\`\`

By default \`*Async\` methods use the **common ForkJoinPool**; pass your own executor (§8.11) for blocking I/O so you don't starve the shared pool.`,
      chaining: `**Composition methods — the heart of CompletableFuture:**

| Method | Purpose |
|---|---|
| \`thenApply(fn)\` | transform the result (sync continuation) → new value |
| \`thenAccept(consumer)\` | consume the result (no return) |
| \`thenRun(runnable)\` | run after completion (ignores result) |
| \`thenCompose(fn)\` | **flatMap** — chain a dependent CompletableFuture |
| \`thenCombine(other, bi)\` | combine **two independent** futures' results |
| \`allOf(...)\` / \`anyOf(...)\` | wait for all / any of several futures |
| \`...Async\` variants | run the continuation on a pool thread |

\`\`\`java
// thenCompose: dependent async calls (avoids CompletableFuture<CompletableFuture<T>>)
cf.thenCompose(user -> fetchOrdersAsync(user.id()));

// thenCombine: two independent calls merged
priceFuture.thenCombine(taxFuture, (price, tax) -> price + tax);

// allOf: fan-out then join
CompletableFuture.allOf(f1, f2, f3).thenRun(() -> System.out.println("all done"));
\`\`\`

**\`thenApply\` vs \`thenCompose\`** mirrors \`map\` vs \`flatMap\` (§7.9): use \`thenCompose\` when the function itself returns a \`CompletableFuture\`.`,
      exceptions: `**Async exception handling** — failures propagate down the chain:

\`\`\`java
cf.thenApply(this::risky)
  .exceptionally(ex -> fallbackValue)              // recover: provide a default
  .handle((result, ex) -> ex != null ? "error" : result)  // handle both outcomes
  .whenComplete((result, ex) -> log(result, ex));  // side-effect, doesn't alter result
\`\`\`

- \`exceptionally(fn)\` — recover from an exception with a fallback value.
- \`handle(bifn)\` — process **both** success and failure into a new value.
- \`whenComplete(bifn)\` — observe the outcome without changing it.

An exception in any stage skips the normal stages until a handler; the exception is wrapped in \`CompletionException\` (unwrap with \`getCause\`, Module 4 §4.12).`,
      internal: `A \`CompletableFuture\` holds a result-or-exception and a set of **dependent stages**; completing it triggers those stages. Non-\`Async\` continuations may run on the thread that completed the future (or the calling thread); \`*Async\` continuations run on the **common ForkJoinPool** or your supplied executor — important because **blocking** work on the common pool can starve parallel streams (§7.8) and other tasks. You can complete it manually (\`complete(value)\`/\`completeExceptionally(ex)\`), making it a flexible **promise**. It implements \`Future\`, so \`get()\`/\`join()\` still block when you truly need the value (\`join()\` throws unchecked).`,
      useCases: `- **Async I/O orchestration**: call several services in parallel, combine results.
- **Pipelines**: fetch → transform → enrich → store, all non-blocking.
- **Timeouts/fallbacks** (\`orTimeout\`, \`completeOnTimeout\` in Java 9+) and retries.
- **Fan-out/fan-in**: \`allOf\` to await many calls, then aggregate.`,
      code: `\`\`\`java
import java.util.concurrent.*;

public class CompletableFutureDemo {
    static int fetchPrice() { sleep(100); return 100; }
    static int fetchTax()   { sleep(80);  return 18; }

    public static void main(String[] args) throws Exception {
        // two independent async calls, combined — total time ~max(100,80), not sum
        CompletableFuture<Integer> price = CompletableFuture.supplyAsync(CompletableFutureDemo::fetchPrice);
        CompletableFuture<Integer> tax   = CompletableFuture.supplyAsync(CompletableFutureDemo::fetchTax);

        CompletableFuture<Integer> total = price.thenCombine(tax, Integer::sum)
            .thenApply(t -> t + 5)                      // shipping
            .exceptionally(ex -> -1);                   // fallback

        System.out.println("total = " + total.get());  // 123

        // dependent chain with thenCompose
        CompletableFuture.supplyAsync(() -> 7)
            .thenCompose(n -> CompletableFuture.supplyAsync(() -> n * n))
            .thenAccept(sq -> System.out.println("square = " + sq));   // 49
        Thread.sleep(300);
    }
    static void sleep(long ms){ try { Thread.sleep(ms); } catch (InterruptedException e){ Thread.currentThread().interrupt(); } }
}
\`\`\``,
      mistakes: `- **Calling \`get()\`/\`join()\` immediately** — reintroduces blocking; chain continuations instead.
- **Confusing \`thenApply\` with \`thenCompose\`** — use \`thenCompose\` when the mapper returns a \`CompletableFuture\` (else you get nested futures).
- **Running blocking I/O on the common ForkJoinPool** — starves it; pass a dedicated executor.
- **Ignoring exceptions** — without \`exceptionally\`/\`handle\`, failures are silent until \`get()\` throws.
- **Assuming continuation thread** — non-\`Async\` stages may run on unexpected threads; use \`*Async\` for control.
- **Not unwrapping \`CompletionException\`** — the real cause is in \`getCause()\`.`,
      bestPractices: `- **Compose** with \`thenApply\`/\`thenCompose\`/\`thenCombine\`/\`allOf\` instead of blocking on \`get()\`.
- Provide a **dedicated executor** for blocking tasks; reserve the common pool for CPU-bound work.
- Always add **error handling** (\`exceptionally\`/\`handle\`) to async chains.
- Use **\`thenCompose\`** for dependent calls, **\`thenCombine\`/\`allOf\`** for independent ones run in parallel.
- Add **timeouts** (\`orTimeout\`, Java 9+) to avoid hanging pipelines.`,
      interview: `**Q1. How does CompletableFuture improve on Future?**
It's non-blocking (callbacks instead of \`get()\`) and composable (chain/combine stages, handle errors in the pipeline).

**Q2. supplyAsync vs runAsync?**
\`supplyAsync\` runs a \`Supplier\` and yields a result; \`runAsync\` runs a \`Runnable\` with no result (\`CompletableFuture<Void>\`).

**Q3. thenApply vs thenCompose?**
\`thenApply\` maps the result to a value; \`thenCompose\` flatMaps when the function returns another \`CompletableFuture\` (dependent async call).

**Q4. How do you combine two independent futures?**
\`thenCombine(other, (a,b) -> ...)\`; for many, \`allOf(...)\` then read each.

**Q5. How do you handle exceptions?**
\`exceptionally\` (fallback), \`handle\` (both outcomes), \`whenComplete\` (observe); the cause is wrapped in \`CompletionException\`.

**Q6. Which pool runs the async tasks?**
The common ForkJoinPool by default, or a supplied executor — use a custom one for blocking work.`,
      exercises: `1. Run two independent \`supplyAsync\` calls and combine them with \`thenCombine\`; show total time ≈ the slower one.
2. Chain dependent calls with \`thenCompose\` (avoid nested futures).
3. Add \`exceptionally\` to recover from a failing stage.
4. Use \`allOf\` to await several futures, then aggregate their results.`,
      challenges: `Build an async order-summary service: in parallel, fetch user, pricing, and inventory (each \`supplyAsync\` on a custom executor); combine them (\`thenCombine\`/\`allOf\`), then \`thenCompose\` a dependent "apply discount" async call, with \`exceptionally\` fallbacks and an \`orTimeout\`. Measure that parallel fan-out beats sequential calls, and explain why blocking I/O needs a dedicated executor rather than the common ForkJoinPool.`,
      summary: `- **\`CompletableFuture\`** is a **non-blocking, composable \`Future\`** — attach continuations instead of calling \`get()\` (fixes \`Future\`'s limits, §8.4).
- Start with **\`supplyAsync\`/\`runAsync\`** (custom executor for blocking work); chain with **\`thenApply\`/\`thenCompose\`/\`thenCombine\`/\`allOf\`** (map vs flatMap = \`thenApply\` vs \`thenCompose\`).
- Handle errors with **\`exceptionally\`/\`handle\`/\`whenComplete\`** (cause wrapped in \`CompletionException\`).
- Use a **dedicated pool** for blocking I/O (don't starve the common ForkJoinPool); add **timeouts**.`
    }),

    /* 8.14 ThreadLocal & Concurrency Best Practices (capstone). */
    topic({
      id: "threadlocal-best-practices", chapter: "8.14", title: "ThreadLocal & Concurrency Best Practices",
      subtitle: "Capstone — thread confinement and the rules for safe concurrent code.",
      readTime: "16 min", level: "Advanced", deep: true,
      objectives: [
        "Use ThreadLocal for per-thread state (thread confinement).",
        "Avoid ThreadLocal memory leaks in thread pools.",
        "Consolidate the module's safety strategies into a checklist.",
        "Choose the right tool for each concurrency problem."
      ],
      concept: `**\`ThreadLocal<T>\`** gives **each thread its own independent copy** of a variable — a form of **thread confinement** that sidesteps sharing (and thus races) entirely. No two threads see each other's value.

\`\`\`java
private static final ThreadLocal<SimpleDateFormat> FORMAT =
    ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));

String today = FORMAT.get().format(new Date());   // each thread has its OWN formatter
\`\`\`

This is the classic fix for **non-thread-safe-but-expensive** objects (\`SimpleDateFormat\`, parsers, buffers): instead of sharing one (needs locking) or creating one per call (wasteful), give each thread its own reusable copy. (Note: with \`java.time\`, \`DateTimeFormatter\` is already thread-safe — §7.13.)`,
      why: `The safest concurrent code **avoids shared mutable state** (§8.1). Two ways to do that are **immutability** (Module 3 §3.4) and **confinement** — keeping data within a single thread. \`ThreadLocal\` provides confinement for cases where you need mutable, per-thread context:

- **Per-thread non-thread-safe tools** (formatters, \`Random\`, buffers).
- **Implicit context** carried through a call chain (user/transaction/trace IDs, security principal) without passing it as a parameter everywhere — used heavily by frameworks (Spring's transaction/security context, MDC logging).`,
      api: `**\`ThreadLocal\` API:**

| Method | Purpose |
|---|---|
| \`ThreadLocal.withInitial(supplier)\` | create with a per-thread initial value |
| \`get()\` | this thread's value (initialises if absent) |
| \`set(value)\` | set this thread's value |
| \`remove()\` | **clear** this thread's value (critical in pools — below) |

\`InheritableThreadLocal\` additionally passes the value from a parent thread to child threads it creates.`,
      leak: `**The ThreadLocal + thread pool leak (a must-know):** thread pools (§8.11) **reuse** threads. If you \`set\` a \`ThreadLocal\` on a pooled thread and never \`remove\` it, the value **persists** into the next task that runs on that thread — causing **stale data** leaking between requests *and* a **memory leak** (the value is never garbage-collected because the thread lives on).

\`\`\`java
try {
    CONTEXT.set(requestContext);
    handle();
} finally {
    CONTEXT.remove();        // ALWAYS clean up in pooled threads
}
\`\`\`

> Rule: in any pooled/reused thread, **always \`remove()\` in a \`finally\`** when done.`,
      bestPracticesChecklist: `**Concurrency best-practices checklist (the module capstone):**

- **Prefer immutability** (Module 3 §3.4) and **confinement** (ThreadLocal/local variables) — no sharing, no races.
- **Minimise and encapsulate shared mutable state**; document the locking policy ("guarded by X").
- Use **high-level utilities** over raw threads/locks: executors (§8.11), concurrent collections (§8.12), \`CompletableFuture\` (§8.13), atomics (§8.10).
- For shared state: \`volatile\` for **visibility** of flags (§8.7); **atomics** for single-variable updates (§8.10); **locks/synchronized** for compound invariants (§8.5/§8.9).
- **Acquire locks in a consistent order**; use \`tryLock\`+timeout to avoid **deadlock** (§8.8); keep critical sections small; never block while holding a lock.
- Handle **\`InterruptedException\`** correctly (§8.3); **shut down executors**; **\`remove()\`** ThreadLocals in pools.
- Don't assume execution order or that tests prove thread-safety (§8.1).`,
      toolSelection: `**Which tool for which problem:**

| Problem | Tool |
|---|---|
| Per-thread mutable context | \`ThreadLocal\` (remove in pools) |
| Visibility of a flag | \`volatile\` (§8.7) |
| Atomic counter/reference | \`Atomic*\` / \`LongAdder\` (§8.10) |
| Compound invariant | \`synchronized\` / \`Lock\` (§8.5/§8.9) |
| Many readers, few writers | \`ReadWriteLock\` / \`CopyOnWriteArrayList\` (§8.9/§8.12) |
| Shared map | \`ConcurrentHashMap\` (§8.12) |
| Producer-consumer | \`BlockingQueue\` (§8.12) |
| Run many tasks | \`ExecutorService\` (§8.11) |
| Async pipeline | \`CompletableFuture\` (§8.13) |
| Coordinate phases/limits | latch / barrier / semaphore (§8.12) |`,
      internal: `\`ThreadLocal\` values are stored in a \`ThreadLocalMap\` **inside each \`Thread\`** object, keyed by the \`ThreadLocal\` instance via a **weak reference**. The *key* is weak (so an unused \`ThreadLocal\` can be GC'd), but the **value is strongly referenced** by the long-lived thread — which is exactly why **not calling \`remove()\` leaks** the value in pools. Confinement works because each thread reads its own map; there's no cross-thread access, hence no synchronization needed and no race. This is "thread-safety by not sharing" — often the simplest and fastest approach.`,
      useCases: `- **Per-thread tools**: \`SimpleDateFormat\`, \`Random\` (\`ThreadLocalRandom\` is the built-in version), reusable buffers.
- **Request/transaction context**: user id, locale, trace id (frameworks, MDC logging).
- **Avoiding parameter threading**: implicit context through deep call chains.
- **Capstone**: choosing among all the module's tools for a real system.`,
      code: `\`\`\`java
public class ThreadLocalDemo {
    // per-thread counter — no sharing, no synchronization needed
    private static final ThreadLocal<Integer> COUNTER = ThreadLocal.withInitial(() -> 0);

    static void increment() { COUNTER.set(COUNTER.get() + 1); }

    public static void main(String[] args) throws InterruptedException {
        Runnable job = () -> {
            for (int i = 0; i < 3; i++) increment();
            System.out.println(Thread.currentThread().getName() + " sees " + COUNTER.get());
            COUNTER.remove();                 // clean up (important in pools)
        };
        Thread a = new Thread(job, "A"), b = new Thread(job, "B");
        a.start(); b.start(); a.join(); b.join();
        // Each thread independently reaches 3 — no interference, no locks.

        // built-in per-thread RNG:
        int r = java.util.concurrent.ThreadLocalRandom.current().nextInt(100);
        System.out.println("random = " + r);
    }
}
\`\`\``,
      mistakes: `- **Not calling \`remove()\` in pooled threads** — stale data leaks across tasks + memory leak (the #1 ThreadLocal bug).
- **Using \`ThreadLocal\` as a substitute for passing parameters** everywhere — hidden coupling; use sparingly.
- **Sharing a \`ThreadLocal\`'s contained object** between threads — defeats confinement.
- **Assuming \`InheritableThreadLocal\` works with pools** — pool threads aren't freshly created per task, so inheritance is unreliable.
- **Reaching for locks first** when immutability/confinement/atomics would be simpler and faster.
- **Premature parallelism** — concurrency adds complexity; only add it where it pays off.`,
      bestPractices: `- Prefer **immutability and confinement** (\`ThreadLocal\`, locals) to sharing; share only when necessary.
- In **pooled threads**, always **\`remove()\`** ThreadLocals in a \`finally\`.
- Pick the **lightest correct tool** (volatile < atomics < locks) for the job; use high-level utilities.
- Follow the **best-practices checklist** above; document locking and thread-safety guarantees.
- Use **\`ThreadLocalRandom\`** instead of a shared \`Random\`; measure before parallelising.`,
      interview: `**Q1. What is ThreadLocal and when is it used?**
A per-thread variable (thread confinement) — each thread has its own value; used for non-thread-safe-but-reusable objects (e.g., \`SimpleDateFormat\`) and implicit per-request context.

**Q2. What's the ThreadLocal memory-leak risk?**
In thread pools, a value set but not \`remove()\`d persists on the reused thread — leaking memory and stale data across tasks; always \`remove()\` in \`finally\`.

**Q3. How does ThreadLocal avoid races?**
By not sharing — each thread accesses its own copy, so no synchronization is needed.

**Q4. volatile vs atomic vs synchronized — when each?**
\`volatile\` for visibility of a flag; atomics for single-variable atomic updates; synchronized/locks for compound invariants.

**Q5. How do you prevent deadlock? (recap)**
Consistent lock ordering and \`tryLock\` with timeouts; minimise locking (§8.8).

**Q6. What is ThreadLocalRandom?**
A per-thread \`Random\` that avoids contention on a shared \`Random\` instance.`,
      exercises: `1. Use a \`ThreadLocal\` counter and show two threads don't interfere (no locks).
2. Demonstrate the pool leak: set a ThreadLocal in a pooled task without \`remove()\`, then observe stale data in a later task on the same thread; fix with \`remove()\`.
3. Replace a shared \`SimpleDateFormat\` (racy) with a \`ThreadLocal<SimpleDateFormat>\` (or \`DateTimeFormatter\`, §7.13).
4. Map five concurrency problems to the right tool from the selection table.`,
      challenges: `Capstone: design the concurrency for a request-processing service. Use an \`ExecutorService\` (§8.11) with a bounded queue, a \`ThreadLocal\` request-context cleaned in \`finally\`, a \`ConcurrentHashMap\` + \`LongAdder\` for metrics (§8.10/§8.12), \`CompletableFuture\` for async downstream calls (§8.13), and a \`Semaphore\` to bound external connections. Justify each choice against the best-practices checklist, and identify where immutability/confinement let you avoid locking entirely.`,
      summary: `- **\`ThreadLocal\`** gives each thread its own value (**confinement**) — race-free without locking; ideal for per-thread tools and implicit context. **Always \`remove()\` in pooled threads** (leak risk).
- Safest concurrency = **avoid shared mutable state** via **immutability** (Module 3 §3.4) and **confinement**; share only when necessary.
- Pick the **lightest correct tool**: \`volatile\` (visibility) → atomics (§8.10) → locks (§8.5/§8.9); use high-level **executors/concurrent collections/CompletableFuture** (§8.11–§8.13).
- Order locks consistently, avoid deadlock (§8.8), handle interruption (§8.3), shut down pools — this checklist ties Module 8 together.`
    })
  ]
});
