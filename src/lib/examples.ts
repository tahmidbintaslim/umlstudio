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
  // ---- Cloud & architecture (PlantUML stdlib icons) ----
  {
    name: "AWS architecture",
    source: `@startuml
!include <awslib/AWSCommon>
!include <awslib/AWSSimplified>
!include <awslib/General/Users>
!include <awslib/NetworkingContentDelivery/CloudFront>
!include <awslib/ApplicationIntegration/APIGateway>
!include <awslib/Compute/Lambda>
!include <awslib/Database/DynamoDB>
!include <awslib/Storage/SimpleStorageService>
left to right direction

Users(users, "Users", "")
CloudFront(cdn, "CloudFront", "")
SimpleStorageService(web, "Static site (S3)", "")
APIGateway(api, "API Gateway", "")
Lambda(fn, "Lambda", "")
DynamoDB(db, "DynamoDB", "")

users --> cdn
cdn --> web
cdn --> api
api --> fn
fn --> db
@enduml`,
  },
  {
    name: "Azure architecture",
    source: `@startuml
!include <azure/AzureCommon>
!include <azure/AzureSimplified>
!include <azure/Web/AzureWebApp>
!include <azure/Compute/AzureFunction>
!include <azure/Databases/AzureCosmosDb>
!include <azure/Storage/AzureBlobStorage>
left to right direction

actor User
AzureWebApp(web, "Web App", "")
AzureFunction(fn, "Functions", "")
AzureCosmosDb(db, "Cosmos DB", "")
AzureBlobStorage(blob, "Blob Storage", "")

User --> web
web --> fn
fn --> db
fn --> blob
@enduml`,
  },
  {
    name: "GCP architecture",
    source: `@startuml
!include <gcp/GCPCommon>
!include <gcp/Compute/Cloud_Run>
!include <gcp/Databases/Cloud_SQL>
!include <gcp/Storage/Cloud_Storage>
!include <gcp/Data_Analytics/Cloud_PubSub>
left to right direction

actor User
Cloud_Run(run, "Cloud Run", "API")
Cloud_SQL(sql, "Cloud SQL", "Postgres")
Cloud_Storage(gcs, "Cloud Storage", "Uploads")
Cloud_PubSub(ps, "Pub/Sub", "Events")

User --> run
run --> sql
run --> gcs
run --> ps
@enduml`,
  },
  {
    name: "C4 container",
    source: `@startuml
!include <C4/C4_Container>
LAYOUT_LEFT_RIGHT()

Person(student, "Student", "Submits assignments")
System_Boundary(lms, "Learning platform") {
  Container(web, "Web app", "Next.js", "UI for students and teachers")
  Container(api, "API", "Node.js", "Business logic")
  ContainerDb(db, "Database", "Postgres", "Courses, submissions")
}
System_Ext(mail, "Email service", "Sends notifications")

Rel(student, web, "Uses", "HTTPS")
Rel(web, api, "Calls", "JSON/HTTPS")
Rel(api, db, "Reads/writes", "SQL")
Rel(api, mail, "Sends email", "SMTP")
@enduml`,
  },
  {
    name: "Kubernetes",
    source: `@startuml
!include <kubernetes/k8s-sprites-unlabeled-25pct>
left to right direction

actor User
rectangle "Cluster" {
  rectangle "<$ing>\\nIngress" as ing
  rectangle "<$svc>\\nService" as svc
  rectangle "<$deploy>\\nDeployment" as dep
  rectangle "<$pod>\\nPod" as p1
  rectangle "<$pod>\\nPod" as p2
  rectangle "<$pv>\\nVolume" as pv
}
User --> ing
ing --> svc
svc --> dep
dep --> p1
dep --> p2
p1 --> pv
@enduml`,
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
