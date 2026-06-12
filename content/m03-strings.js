/* Module 3: String Handling — edit ONLY this file for this module's content.
   Each topic() auto-renders the 11-part template; fill the parts to go deep. */
registerModule({
  id: "strings",
  module: "String Handling",
  page: "module-strings.html",
  icon: "🔤",
  tagline: "Strings, builders, the string pool, and immutability.",
  lessons: [
    topic({ id: "string", chapter: "3.1", title: "String", level: "Core" }),
    topic({ id: "stringbuilder", chapter: "3.2", title: "StringBuilder", level: "Core" }),
    topic({ id: "stringbuffer", chapter: "3.3", title: "StringBuffer", level: "Core" }),
    topic({ id: "string-pool", chapter: "3.4", title: "String Pool", level: "Core" }),
    topic({ id: "string-interning", chapter: "3.5", title: "String Interning", level: "Core" }),
    topic({ id: "immutable-objects", chapter: "3.6", title: "Immutable Objects", level: "Core" })
  ]
});
