/* Section: Hands-on Projects — edit ONLY this file.
   Each project uses the same 6 parts: Requirements, Architecture,
   Folder Structure, Implementation, GitHub Structure, Improvements.
   Project 1 is fully written; Projects 2–5 are scaffolded. */

// helper: 6-part scaffold for a not-yet-written project
function projectScaffold() {
  return ["Requirements","Architecture","Folder Structure","Implementation","GitHub Structure","Improvements"]
    .map(h => ({ id: h.toLowerCase().replace(/[^a-z]+/g,'-'), heading: h,
      body: `<p class="placeholder">📝 <em>${h}</em> — coming soon.</p>` }));
}

registerSection({
  id: "projects",
  module: "Hands-on Projects",
  page: "projects.html",
  icon: "🛠️",
  tagline: "Five real-world applications, built end to end.",
  lessons: [

    lesson({
      id: "employee-management", chapter: "P1", title: "Employee Management System",
      subtitle: "CRUD, layered architecture, and clean OOP — the perfect first project.",
      icon: "👥", tag: "", level: "Project",
      sections: [
        { id: "requirements", heading: "Requirements", md:
`**Goal:** a console (then JDBC-backed) application to manage employees.

**Functional requirements**

- Add, view, update, and delete (CRUD) employees.
- Each employee has: id, name, department, designation, salary, date of joining.
- Search employees by id, name, or department.
- List all employees, and sort by salary or name.
- Generate a simple report: count and average salary per department.

**Non-functional**

- Clean separation of concerns (no business logic in \`main\`).
- Input validation and graceful error handling.
- Easily swappable storage (in-memory now, database later).` },

        { id: "architecture", heading: "Architecture", md:
`A classic **layered architecture** so each layer has one responsibility:

\`\`\`
UI / Console layer      -> reads input, prints output
   │
Service layer           -> business rules (validation, reports)
   │
Repository (DAO) layer  -> data access (in-memory Map, later JDBC)
   │
Model (Employee)        -> plain data object (POJO)
\`\`\`

The service depends on a **repository interface**, not a concrete class — so you can switch from in-memory to JDBC without touching business logic (Dependency Inversion).` },

        { id: "folder-structure", heading: "Folder Structure", md:
`\`\`\`
employee-management/
├── src/
│   └── com/shail/ems/
│       ├── Main.java
│       ├── model/        Employee.java
│       ├── repository/   EmployeeRepository.java        (interface)
│       │                 InMemoryEmployeeRepository.java
│       ├── service/      EmployeeService.java
│       └── ui/           ConsoleApp.java
├── README.md
└── pom.xml               (if using Maven)
\`\`\`` },

        { id: "implementation", heading: "Implementation", md:
`**Model — a plain POJO:**

\`\`\`java
public class Employee {
    private int id;
    private String name;
    private String department;
    private double salary;
    // constructor, getters, setters, toString()
}
\`\`\`

**Repository — interface + in-memory implementation:**

\`\`\`java
public interface EmployeeRepository {
    void save(Employee e);
    Optional<Employee> findById(int id);
    List<Employee> findAll();
    void deleteById(int id);
}

public class InMemoryEmployeeRepository implements EmployeeRepository {
    private final Map<Integer, Employee> store = new HashMap<>();
    public void save(Employee e) { store.put(e.getId(), e); }
    public Optional<Employee> findById(int id) { return Optional.ofNullable(store.get(id)); }
    public List<Employee> findAll() { return new ArrayList<>(store.values()); }
    public void deleteById(int id) { store.remove(id); }
}
\`\`\`

**Service — business logic:**

\`\`\`java
public class EmployeeService {
    private final EmployeeRepository repo;
    public EmployeeService(EmployeeRepository repo) { this.repo = repo; }

    public void addEmployee(Employee e) {
        if (e.getSalary() < 0) throw new IllegalArgumentException("Salary cannot be negative");
        repo.save(e);
    }
    public Map<String, Double> avgSalaryByDept() {
        return repo.findAll().stream()
            .collect(Collectors.groupingBy(Employee::getDepartment,
                     Collectors.averagingDouble(Employee::getSalary)));
    }
}
\`\`\`

> Notice how the report uses the **Streams API** — a natural bridge to Module 7.` },

        { id: "github-structure", heading: "GitHub Structure", md:
`A professional repo interviewers like to see:

\`\`\`
employee-management/
├── README.md          # what it does, how to run, screenshots
├── .gitignore         # ignore /target, *.class, IDE files
├── LICENSE
├── pom.xml
├── src/main/java/...  # source
└── src/test/java/...  # JUnit tests
\`\`\`

**README should include:** problem statement, features, tech stack, how to build/run, and a short architecture diagram. Commit in small, meaningful steps with clear messages.` },

        { id: "improvements", heading: "Improvements", md:
`Level it up as you learn later modules:

- Swap the in-memory repo for a **JDBC** implementation (Module 10).
- Add **JUnit** tests for the service layer.
- Add custom exceptions like \`EmployeeNotFoundException\` (Module 4).
- Introduce a menu-driven UI, then later a REST API with Spring Boot.
- Add pagination and sorting for large datasets.` },
      ]
    }),

    lesson({ id: "banking-app", chapter: "P2", title: "Banking Application",
      subtitle: "Accounts, transactions, and the value of immutability & validation.",
      icon: "🏦", tag: "", level: "Project",
      sections: projectScaffold() }),

    lesson({ id: "library-management", chapter: "P3", title: "Library Management System",
      subtitle: "Books, members, and borrowing rules with clean domain modelling.",
      icon: "📚", tag: "", level: "Project",
      sections: projectScaffold() }),

    lesson({ id: "ecommerce-backend", chapter: "P4", title: "E-Commerce Backend",
      subtitle: "Catalog, cart, and orders — a service-oriented design.",
      icon: "🛒", tag: "", level: "Project",
      sections: projectScaffold() }),

    lesson({ id: "student-management", chapter: "P5", title: "Student Management System",
      subtitle: "Students, courses, and grades with reporting.",
      icon: "🎓", tag: "", level: "Project",
      sections: projectScaffold() }),
  ]
});
