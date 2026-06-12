/* Module 4: Exception Handling — edit ONLY this file for this module's content.
   Each topic() auto-renders the 11-part template; fill the parts to go deep. */
registerModule({
  id: "exceptions",
  module: "Exception Handling",
  page: "module-exceptions.html",
  icon: "⚠️",
  tagline: "Handle failure cleanly with the exception hierarchy.",
  lessons: [
    topic({ id: "exception-hierarchy", chapter: "4.1", title: "Exception Hierarchy", level: "Core" }),
    topic({ id: "checked-exceptions", chapter: "4.2", title: "Checked Exceptions", level: "Core" }),
    topic({ id: "unchecked-exceptions", chapter: "4.3", title: "Unchecked Exceptions", level: "Core" }),
    topic({ id: "try-catch", chapter: "4.4", title: "try-catch", level: "Core" }),
    topic({ id: "finally", chapter: "4.5", title: "finally", level: "Core" }),
    topic({ id: "throw", chapter: "4.6", title: "throw", level: "Core" }),
    topic({ id: "throws", chapter: "4.7", title: "throws", level: "Core" }),
    topic({ id: "custom-exceptions", chapter: "4.8", title: "Custom Exceptions", level: "Core" }),
    topic({ id: "best-practices", chapter: "4.9", title: "Best Practices", level: "Core" })
  ]
});
