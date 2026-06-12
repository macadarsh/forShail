/* Module: Getting Started
   Edit ONLY this file to change this module's content.
   Section model: { id, heading, level(2|3), body(HTML string) }
   The right-hand TOC + scroll-spy build themselves from `sections`. */
registerModule({
  id: "getting-started",
  module: "Getting Started",
  page: "module-getting-started.html",
  icon: "🚀",
  tagline: "Set up your tools and write your very first Java program.",
  lessons: [
    {
      id: "welcome",
      title: "Welcome & How to Use This Course",
      subtitle: "Your roadmap from fundamentals to interview-ready engineer.",
      readTime: "4 min",
      level: "Foundational",
      objectives: [
        "Placeholder objective — understand how this course is organized.",
        "Placeholder objective — know what you will be able to build by the end."
      ],
      sections: [
        { id: "who-this-is-for", heading: "Who this course is for", level: 2,
          body: `<p class="placeholder">Placeholder: students, career switchers, and working engineers preparing for service &amp; product-company interviews.</p>` },
        { id: "how-its-structured", heading: "How the course is structured", level: 2,
          body: `<p class="placeholder">Placeholder: modules → lessons → exercises → interview questions → projects, and the learning loop.</p>` },
        { id: "what-youll-build", heading: "What you'll build", level: 2,
          body: `<p class="placeholder">Placeholder: capstone projects you complete by the end.</p>` },
      ]
    },
    {
      id: "setup",
      title: "Setting Up Your Java Environment",
      subtitle: "JDK, IDE, and your first compile-and-run loop.",
      readTime: "8 min",
      level: "Foundational",
      objectives: [
        "Placeholder objective — install a JDK and verify it.",
        "Placeholder objective — choose and configure an IDE."
      ],
      sections: [
        { id: "install-jdk", heading: "Installing the JDK", level: 2,
          body: `<p class="placeholder">Placeholder: choosing a JDK distribution and version; install steps per OS.</p>` },
        { id: "choose-ide", heading: "Choosing an IDE", level: 2,
          body: `<p class="placeholder">Placeholder: IntelliJ IDEA vs Eclipse vs VS Code.</p>` },
        { id: "verify-install", heading: "Verifying your installation", level: 3,
          body: `<p class="placeholder">Placeholder: running <code>java -version</code> and <code>javac -version</code>.</p>` },
      ]
    },
  ]
});
