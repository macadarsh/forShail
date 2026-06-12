/* Module 8: Multithreading & Concurrency — edit ONLY this file for this module's content.
   Each topic() auto-renders the 11-part template; fill the parts to go deep. */
registerModule({
  id: "concurrency",
  module: "Multithreading & Concurrency",
  page: "module-concurrency.html",
  icon: "🧵",
  tagline: "Threads, executors, synchronization, and concurrent collections.",
  lessons: [
    topic({ id: "threads", chapter: "8.1", title: "Threads", level: "Advanced" }),
    topic({ id: "thread-lifecycle", chapter: "8.2", title: "Thread Lifecycle", level: "Advanced" }),
    topic({ id: "runnable", chapter: "8.3", title: "Runnable", level: "Advanced" }),
    topic({ id: "callable", chapter: "8.4", title: "Callable", level: "Advanced" }),
    topic({ id: "executor-framework", chapter: "8.5", title: "Executor Framework", level: "Advanced" }),
    topic({ id: "synchronization", chapter: "8.6", title: "Synchronization", level: "Advanced" }),
    topic({ id: "volatile", chapter: "8.7", title: "volatile", level: "Advanced" }),
    topic({ id: "atomic-classes", chapter: "8.8", title: "Atomic Classes", level: "Advanced" }),
    topic({ id: "locks", chapter: "8.9", title: "Locks", level: "Advanced" }),
    topic({ id: "concurrent-collections", chapter: "8.10", title: "Concurrent Collections", level: "Advanced" }),
    topic({ id: "completablefuture", chapter: "8.11", title: "CompletableFuture", level: "Advanced" })
  ]
});
