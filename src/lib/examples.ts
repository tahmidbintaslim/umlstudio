// Starter templates shown in the Examples menu.
export const EXAMPLES: { name: string; source: string }[] = [
  {
    name: "Sequence",
    source: `@startuml
skin rose
title User Authentication

actor User
participant "Browser" as Browser #lightblue
participant "Auth Service" as AuthService
database "User Database" as UserDB #orange
participant "Web Application" as Website #lightgreen

User -> Browser : Enter Credentials
Browser -> AuthService : Send Login Request (username/password)
AuthService -> UserDB : Validate User Credentials
UserDB -> AuthService : Return Validation Result
AuthService -[#green]> Browser : Send JWT Token

User -> Browser : Request Protected Resource
Browser -> Website : Request Resource (JWT in Header)
Website -> AuthService : Validate JWT
AuthService -> Website : Return Validation Result
Website -[#green]> Browser : Return Protected Resource
Browser -> User : View Protected Resource
@enduml`,
  },
  {
    name: "Class",
    source: `@startuml
abstract class Shape {
  +area() : double
}
class Circle {
  -radius : double
  +area() : double
}
class Rectangle {
  -w : double
  -h : double
  +area() : double
}
interface Drawable {
  +draw()
}
Shape <|-- Circle
Shape <|-- Rectangle
Drawable <|.. Circle
@enduml`,
  },
  {
    name: "Activity",
    source: `@startuml
start
:Receive order;
if (In stock?) then (yes)
  :Pack items;
  :Ship;
else (no)
  :Notify customer;
endif
stop
@enduml`,
  },
  {
    name: "Use Case",
    source: `@startuml
left to right direction
actor Customer
actor Admin
rectangle Shop {
  Customer -- (Browse products)
  Customer -- (Checkout)
  (Checkout) .> (Pay) : include
  Admin -- (Manage inventory)
}
@enduml`,
  },
  {
    name: "Component",
    source: `@startuml
package "Frontend" {
  [Web App]
}
package "Backend" {
  [API Gateway] --> [Auth]
  [API Gateway] --> [Orders]
}
database Postgres
[Web App] --> [API Gateway] : HTTPS
[Orders] --> Postgres
@enduml`,
  },
  {
    name: "State",
    source: `@startuml
[*] --> Draft
Draft --> Review : submit
Review --> Draft : changes requested
Review --> Published : approve
Published --> [*]
@enduml`,
  },
  {
    name: "ER Diagram",
    source: `@startuml
entity User {
  *id : uuid
  --
  email : text
}
entity Post {
  *id : uuid
  --
  author_id : uuid
  body : text
}
User ||--o{ Post
@enduml`,
  },
  {
    name: "Mind Map",
    source: `@startmindmap
* PlantUML
** Diagrams
*** Sequence
*** Class
*** Activity
** Exports
*** SVG
*** PNG
@endmindmap`,
  },
  {
    name: "Gantt",
    source: `@startgantt
Project starts 2026-01-05
[Design] lasts 5 days
[Build] lasts 10 days
[Build] starts at [Design]'s end
[Launch] happens at [Build]'s end
@endgantt`,
  },
  {
    name: "JSON",
    source: `@startjson
{
  "name": "UML Studio",
  "open_source": true,
  "formats": ["svg", "png", "txt"]
}
@endjson`,
  },
  // ---- Mermaid ----
  {
    name: "Flowchart",
    source: `flowchart LR
  A[User request] --> B{Authenticated?}
  B -- yes --> C[Load dashboard]
  B -- no --> D[Sign-in page]
  D --> B
  C --> E[(Database)]`,
  },
  {
    name: "Sequence (Mermaid)",
    source: `sequenceDiagram
  autonumber
  participant C as Client
  participant A as API
  participant D as DB
  C->>A: POST /orders
  A->>D: insert order
  D-->>A: id
  A-->>C: 201 Created`,
  },
  {
    name: "ER (Mermaid)",
    source: `erDiagram
  USER ||--o{ ORDER : places
  ORDER ||--|{ LINE_ITEM : contains
  PRODUCT ||--o{ LINE_ITEM : "ordered in"
  USER {
    uuid id PK
    string email
  }
  ORDER {
    uuid id PK
    uuid user_id FK
    date created_at
  }`,
  },
  {
    name: "Class (Mermaid)",
    source: `classDiagram
  class Animal {
    +String name
    +speak() void
  }
  class Dog
  class Cat
  Animal <|-- Dog
  Animal <|-- Cat`,
  },
  {
    name: "Git graph",
    source: `gitGraph
  commit
  branch feature
  checkout feature
  commit
  commit
  checkout main
  merge feature
  commit`,
  },
  {
    name: "Timeline",
    source: `timeline
  title Product launch
  Q1 : Research : Prototype
  Q2 : Beta
  Q3 : Public launch`,
  },
];
