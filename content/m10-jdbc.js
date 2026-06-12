/* Module 10: JDBC — edit ONLY this file for this module's content.
   Each topic() auto-renders the 11-part template; fill the parts to go deep. */
registerModule({
  id: "jdbc",
  module: "JDBC",
  page: "module-jdbc.html",
  icon: "🛢️",
  tagline: "Talk to relational databases from Java the right way.",
  lessons: [
    topic({ id: "jdbc-architecture", chapter: "10.1", title: "JDBC Architecture", level: "Core" }),
    topic({ id: "connection", chapter: "10.2", title: "Connection", level: "Core" }),
    topic({ id: "statement", chapter: "10.3", title: "Statement", level: "Core" }),
    topic({ id: "preparedstatement", chapter: "10.4", title: "PreparedStatement", level: "Core" }),
    topic({ id: "resultset", chapter: "10.5", title: "ResultSet", level: "Core" }),
    topic({ id: "transactions", chapter: "10.6", title: "Transactions", level: "Core" }),
    topic({ id: "batch-processing", chapter: "10.7", title: "Batch Processing", level: "Core" })
  ]
});
