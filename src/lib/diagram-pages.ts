// Landing pages per diagram type (SEO): each maps to a built-in template from examples.ts.
export type DiagramPage = {
  slug: string;
  template: string; // EXAMPLES name
  title: string;
  intro: string;
  uses: string[];
};

export const DIAGRAM_PAGES: DiagramPage[] = [
  {
    slug: "sequence-diagram",
    template: "Sequence",
    title: "Sequence Diagram Maker",
    intro: "Show how users, services and databases talk to each other over time. Write a few lines of PlantUML or Mermaid, or describe the flow in plain English and let AI draw it.",
    uses: ["Login and authentication flows", "API request/response chains", "Microservice interactions", "Software engineering coursework"],
  },
  {
    slug: "class-diagram",
    template: "Class",
    title: "UML Class Diagram Maker",
    intro: "Model classes, fields, methods, inheritance and associations. Paste your source code into the AI assistant to generate a class diagram from it.",
    uses: ["Object-oriented design", "Documenting an existing codebase", "OOP assignments and exams", "Design-pattern explanations"],
  },
  {
    slug: "er-diagram",
    template: "ER Diagram",
    title: "ER Diagram Maker",
    intro: "Design database schemas with entities, keys and relationships. Drop in a SQL schema file and AI turns it into an entity-relationship diagram.",
    uses: ["Database design", "Documenting Postgres or MySQL schemas", "Database course projects", "Reviewing data models in PRs"],
  },
  {
    slug: "flowchart",
    template: "Flowchart",
    title: "Flowchart Maker",
    intro: "Map processes, decisions and loops with Mermaid flowcharts, then send them to the whiteboard to rearrange shapes by hand.",
    uses: ["Algorithms and pseudo-code", "Business processes", "Onboarding and support flows", "CI/CD pipelines"],
  },
  {
    slug: "activity-diagram",
    template: "Activity",
    title: "UML Activity Diagram Maker",
    intro: "Describe workflows with start and end points, branches and parallel steps using PlantUML activity syntax.",
    uses: ["Use-case workflows", "Order and checkout processes", "Requirement analysis", "System analysis coursework"],
  },
  {
    slug: "use-case-diagram",
    template: "Use Case",
    title: "Use Case Diagram Maker",
    intro: "Capture actors and what they can do with your system. A staple of requirements documents and software engineering courses.",
    uses: ["Requirements gathering", "SRS documents", "Stakeholder discussions", "University projects"],
  },
  {
    slug: "state-diagram",
    template: "State",
    title: "State Diagram Maker",
    intro: "Model the states an object or system moves through, and the events that trigger each transition.",
    uses: ["Order and payment lifecycles", "UI state machines", "Protocol design", "Embedded systems"],
  },
  {
    slug: "component-diagram",
    template: "Component",
    title: "Component Diagram Maker",
    intro: "Show how the parts of a system fit together: frontends, services, databases and the interfaces between them.",
    uses: ["System design interviews", "Architecture reviews", "Technical documentation", "Onboarding new engineers"],
  },
  {
    slug: "aws-architecture-diagram",
    template: "AWS architecture",
    title: "AWS Architecture Diagram Tool",
    intro: "Draw AWS architectures with the official icons for Lambda, S3, DynamoDB, API Gateway, CloudFront and hundreds more, all as editable code.",
    uses: ["Solution architecture", "AWS certification study", "Cloud cost and design reviews", "Infrastructure documentation"],
  },
  {
    slug: "azure-architecture-diagram",
    template: "Azure architecture",
    title: "Azure Architecture Diagram Tool",
    intro: "Diagram Azure solutions with official icons for App Service, Functions, Cosmos DB, Blob Storage and more.",
    uses: ["Azure solution design", "AZ-305 / AZ-900 study", "Migration planning", "Infrastructure documentation"],
  },
  {
    slug: "gcp-architecture-diagram",
    template: "GCP architecture",
    title: "Google Cloud Architecture Diagram Tool",
    intro: "Lay out Google Cloud systems with official icons for Cloud Run, Cloud SQL, Pub/Sub, Cloud Storage and more.",
    uses: ["GCP solution design", "Cloud certification study", "Data pipelines", "Infrastructure documentation"],
  },
  {
    slug: "c4-diagram",
    template: "C4 container",
    title: "C4 Model Diagram Tool",
    intro: "Describe software architecture at the context, container and component levels with the C4 model, written as code you can version.",
    uses: ["Architecture decision records", "System design documentation", "Team onboarding", "Architecture reviews"],
  },
  {
    slug: "kubernetes-diagram",
    template: "Kubernetes",
    title: "Kubernetes Diagram Tool",
    intro: "Visualise ingresses, services, deployments, pods and volumes with Kubernetes icons.",
    uses: ["Cluster documentation", "Platform engineering", "CKA/CKAD study", "Incident write-ups"],
  },
  {
    slug: "mind-map",
    template: "Mind Map",
    title: "Mind Map Maker",
    intro: "Organise ideas into a tree from plain indented text, ideal for lecture notes, revision and brainstorming.",
    uses: ["Exam revision", "Lecture notes", "Project brainstorming", "Topic outlines"],
  },
  {
    slug: "gantt-chart",
    template: "Gantt",
    title: "Gantt Chart Maker",
    intro: "Plan tasks, durations and dependencies with a text-based Gantt chart that is easy to update.",
    uses: ["Project timelines", "Thesis and capstone planning", "Sprint planning", "Launch schedules"],
  },
  {
    slug: "graphviz-online",
    template: "Dependency graph",
    title: "Graphviz Online Editor",
    intro: "Write Graphviz DOT and see the graph instantly, with no install. Perfect for dependency graphs, call graphs and state machines.",
    uses: ["Dependency graphs", "Compiler and algorithm courses", "Network topologies", "Call graphs"],
  },
  {
    slug: "git-graph",
    template: "Git graph",
    title: "Git Branch Diagram Maker",
    intro: "Explain branching strategies with commits, branches and merges drawn from a few lines of Mermaid.",
    uses: ["Git workflow docs", "Teaching Git", "Release processes", "Code review guidelines"],
  },
];
