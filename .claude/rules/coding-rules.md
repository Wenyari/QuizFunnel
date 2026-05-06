## Code Quality Standards

### OOP Design Principles

When developing components and services, strictly adhere to these 7 OOP principles:

1. **开闭原则 (Open-Closed Principle, OCP)**

   - Classes should be open for extension but closed for modification
   - Use composition and dependency injection for extensibility
   - Prefer abstract interfaces over concrete implementations

2. **里氏替换原则 (Liskov Substitution Principle, LSP)**

   - Subtypes must be substitutable for their base types
   - Derived classes should enhance, not restrict, base class behavior
   - Ensure interface contracts are maintained in implementations

3. **依赖倒置原则 (Dependency Inversion Principle, DIP)**

   - Depend on abstractions, not concretions
   - High-level modules should not depend on low-level modules
   - Use dependency injection for loose coupling

4. **单一职责原则 (Single Responsibility Principle, SRP)**

   - Each class/module should have only one reason to change
   - Separate concerns into focused, cohesive units
   - Avoid god classes and utility dumping grounds

5. **接口隔离原则 (Interface Segregation Principle, ISP)**

   - Clients should not depend on interfaces they don't use
   - Create focused, role-specific interfaces
   - Prefer multiple small interfaces over large monolithic ones

6. **迪米特法则 (Law of Demeter, LoD)**

   - Objects should only communicate with immediate neighbors
   - Minimize knowledge of other classes' internal structures
   - Use facade patterns to reduce coupling

7. **合成复用原则 (Composite Reuse Principle)**
   - Prefer composition over inheritance
   - Build complex behavior through object collaboration
   - Avoid deep inheritance hierarchies

### Maintainability Metrics

Monitor and maintain these 6 key quality indicators:

1. **圈复杂度 (Cyclomatic Complexity, CNN)**

   - Keep functions under complexity level 10
   - Break down complex conditional logic
   - Use early returns and guard clauses

2. **扇入扇出度 (Fan-in/Fan-out Coupling, FFC)**

   - Minimize dependencies between modules
   - High fan-in (reusable) and low fan-out (focused) preferred
   - Track coupling through import/export analysis

3. **模块间耦合度 (Coupling Between Objects, CBO)**

   - Reduce interdependencies between classes
   - Use interfaces and dependency injection
   - Aim for loose coupling, high cohesion

4. **模块的响应 (Response For Class, RFC)**

   - Limit the number of methods that can be invoked
   - Keep public API surface minimal and focused
   - Consider method complexity and call chains

5. **紧内聚度 (Tight Class Cohesion, TCC)**

   - Ensure class methods work together toward common goals
   - High cohesion indicates well-designed classes
   - Methods should share instance variables and collaborate

6. **松内聚度 (Loose Class Cohesion, LCC)**
   - Monitor for classes with unrelated responsibilities
   - Low loose cohesion is preferred
   - Split classes that have multiple unrelated concerns