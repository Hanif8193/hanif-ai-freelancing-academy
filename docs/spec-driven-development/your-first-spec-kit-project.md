---
sidebar_position: 2
title: "Chapter 10: Your First Spec-Kit Project"
---

# Chapter 10: Your First Spec-Kit Project

## Learning Objectives

By the end of this chapter, you will be able to:

1. Explain what Spec-Kit is and how it structures the SDD workflow
2. Create a project constitution with guiding principles
3. Set up a repository with the correct Spec-Kit folder structure and Git branch strategy
4. Conduct requirements discovery for a realistic client project
5. Write a complete specification document with user stories, acceptance criteria, and scope boundaries
6. Derive an implementation plan directly from the specification
7. Decompose a plan into well-sized implementation tasks
8. Use AI coding agents effectively with specifications as context
9. Verify that implementation matches the specification
10. Execute a complete Spec-Kit workflow from client idea through delivery

## Curriculum Connection

In Chapter 06: What Are AI Coding Agents?, you learned how agents inspect repositories, plan changes, and iterate based on feedback. In Chapter 07: Git & GitHub for Freelancers, you learned how Git provides version control, review, and rollback. In Chapter 08: AI-Assisted vs Agentic Development, you learned when to write code yourself and when to let an agent handle the task. In Chapter 09: What Is Spec-Driven Development?, you learned the theory and principles of SDD: requirements, specifications, plans, tasks, traceability, and verification.

Chapter 10 is the hands-on transition. You now have the concepts. This chapter shows you how to apply them in a real project using the Spec-Kit workflow. You will build a complete specification, plan, and task list for a realistic client project, then walk through implementation, verification, and delivery.

**Important**: Reading about SDD is not the same as doing SDD. This chapter requires you to write specifications, create plans, and verify results. The exercises at the end are not optional. They are where the learning happens.

## Introduction

Spec-Kit is a structured workflow for specification-driven development. It provides a standardized set of artifacts — constitution, specification, plan, tasks, checklist, and summary — that guide a project from initial idea through verified delivery.

The value of Spec-Kit is not in the documents themselves. It is in the discipline they enforce. A freelancer who follows the Spec-Kit workflow produces better specifications, writes clearer requirements, creates more accurate plans, and delivers results that match what the client expected.

This chapter walks you through a complete Spec-Kit project. You will start with a client idea, create a constitution, write a specification, build a plan, decompose tasks, implement with AI assistance, verify against the specification, and deliver. Every step connects to the concepts from Chapter 09 and the tools from Chapters 06-08.

## What Is Spec-Kit?

Spec-Kit is a structured workflow that standardizes how specification-driven development projects are organized and executed. It provides:

- **Standardized document structure**: Consistent format for specifications, plans, and tasks across all projects
- **Constitution-governed principles**: Core rules that guide every decision in the project
- **Clear phase progression**: Defined stages from discovery through delivery
- **AI-agent integration**: Designed so AI coding agents receive the context they need to produce reliable output
- **Verification built in**: Every artifact includes criteria for confirming the result matches the specification

### What Problem Spec-Kit Solves

Without a structured workflow, freelance projects often follow this pattern:

```text
Client says something vague
  -> Developer starts coding
  -> Client says "that's not what I wanted"
  -> Developer restarts
  -> Project is late
  -> Client is unhappy
```

Spec-Kit replaces this with a structured flow:

```text
Client says something vague
  -> Developer asks clarifying questions
  -> Developer writes requirements
  -> Developer creates specification
  -> Client reviews and approves specification
  -> Developer creates plan and tasks
  -> Developer implements against specification
  -> Developer verifies against acceptance criteria
  -> Client confirms result matches specification
```

### Spec-Kit vs SDD Methodology

Spec-Driven Development (SDD) is the methodology. Spec-Kit is one way to implement that methodology. SDD says "specify before you build." Spec-Kit says "here is the exact set of documents, the exact workflow, and the exact structure to follow."

You can implement SDD without Spec-Kit. But Spec-Kit gives you a repeatable, professional process that works every time.

### What Spec-Kit Is Not

- Spec-Kit is not a software tool you install
- Spec-Kit is not a replacement for engineering judgment
- Spec-Kit is not the only way to do SDD
- Spec-Kit does not eliminate the need for human review and approval
- Spec-Kit does not guarantee project success — it provides the structure that makes success more likely

## Spec-Kit Mental Model

The Spec-Kit workflow follows a clear progression from idea to delivery:

```text
Constitution
  |
Specification
  |
Plan
  |
Tasks
  |
Implementation
  |
Verification
  |
Delivery
```

### How the Artifacts Relate

| Artifact | Purpose | Source | Feeds Into |
|----------|---------|--------|-----------|
| **Constitution** | Project principles and rules | Project setup | All other artifacts |
| **Specification** | What to build and why | Requirements discovery | Plan |
| **Plan** | How to build it | Derived from specification | Tasks |
| **Tasks** | Specific work items | Derived from plan | Implementation |
| **Implementation** | Working code | Tasks + AI assistance | Verification |
| **Verification** | Confirming the result matches the specification | Acceptance criteria from specification | Delivery |
| **Summary** | Lessons learned | Entire project | Future projects |

The constitution governs everything. The specification drives the plan. The plan drives the tasks. The tasks drive the implementation. The verification confirms the implementation matches the specification. The summary captures what was learned.

## Constitution

The constitution is the foundational document of a Spec-Kit project. It establishes the principles, rules, and governance that apply to every decision throughout the project.

### Purpose

The constitution answers: "What rules do we follow no matter what?" It prevents ad-hoc decisions, ensures consistency, and provides a reference point when conflicts or tradeoffs arise.

### Principles

A constitution typically includes principles like:

| Principle | What It Means | Why It Matters |
|-----------|--------------|---------------|
| **Spec-Driven Development is mandatory** | Every feature starts with a specification | Prevents coding-first shortcuts |
| **Requirements must be clear and testable** | No vague requirements allowed | Ensures every requirement can be verified |
| **Human approval is required for important decisions** | Architecture, security, and scope changes need human sign-off | Prevents AI from making autonomous critical decisions |
| **Security and privacy are first-class requirements** | Security is not an afterthought | Ensures security is addressed from the start |
| **Test-first approach** | Tests are written before or alongside implementation | Ensures verification is built in |
| **Documentation is part of the product** | Documentation is not optional | Ensures handoff and maintenance are possible |
| **Small, focused commits** | Each commit represents one logical change | Makes review and rollback manageable |
| **No secrets in code** | All secrets in environment variables | Prevents credential exposure |

### What Belongs in a Constitution

| Belongs | Does Not Belong |
|---------|----------------|
| Core development principles | Implementation details |
| Review and approval rules | Technology choices |
| Security requirements | Specific code patterns |
| Quality standards | Variable names |
| Communication expectations | Framework configuration |
| Scope governance | File paths |

### Human Approval and Project Constraints

The constitution establishes that certain decisions require human approval:

- **Architecture decisions**: The overall structure of the system
- **Security decisions**: Authentication, authorization, data protection
- **Scope changes**: Any addition or removal of features
- **Technology changes**: Switching frameworks or major dependencies
- **Deployment decisions**: When and how to deploy to production

### Freelancer/Client Relevance

The constitution protects both the freelancer and the client:

- **For the freelancer**: It establishes professional standards that prevent cutting corners
- **For the client**: It guarantees a structured, quality-focused process
- **For both**: It creates a shared understanding of how the project will be governed

## Project Setup

Before writing specifications, you need a properly structured project.

### Starting from a Client/Project Idea

Every Spec-Kit project begins with a client idea or problem statement. Before writing any specification, you need to understand:

- What problem does the client need solved?
- Who are the target users?
- What is the rough scope?
- What are the constraints (budget, timeline, technology)?
- What does success look like?

### Repository Preparation

```bash
# Initialize the project
git init
npm init -y

# Create the Spec-Kit structure
mkdir -p specs/task-manager
mkdir -p .specify/memory

# Set up the project
npm install
```

### Folder Structure

```text
project-root/
  .specify/
    memory/
      constitution.md        # Project principles and rules
  specs/
    task-manager/
      spec.md               # Feature specification
      plan.md               # Implementation plan
      tasks.md              # Task breakdown
      checklist.md          # Progress tracking
      summary.md            # Lessons learned
  src/                       # Source code
  tests/                     # Test files
  package.json               # Project dependencies
  README.md                  # Project documentation
  .gitignore                 # Git exclusions
```

### Git Branch Strategy

```text
main (stable, deployable)
  |
  +-- feature/task-manager-spec
  |     Write specification
  |
  +-- feature/task-manager-impl
  |     Implement the feature
  |
  +-- feature/task-manager-tests
        Add comprehensive tests
```

Each phase gets its own branch. The specification is committed before implementation begins. This creates a clear record of what was planned vs what was built.

### Documentation Conventions

- Specifications live in `specs/[feature-name]/`
- Each feature has its own directory
- Documents follow the standard naming: spec.md, plan.md, tasks.md, checklist.md, summary.md
- The constitution lives in `.specify/memory/constitution.md`
- All documents use Markdown

### What to Inspect Before Writing Specifications

Before writing any specification, examine:

| What to Inspect | Why |
|----------------|-----|
| Existing codebase | Understand current patterns and conventions |
| Existing documentation | Learn what has already been decided |
| Technology stack | Know what tools are available |
| Database schema | Understand existing data models |
| API routes | See existing endpoints and patterns |
| Test configuration | Know how tests are run |
| Deployment setup | Understand how the project is deployed |
| .gitignore | Know what is excluded from Git |

## Choosing the Example Project

For this chapter, we will build a **Task Management Application** for a small business client.

### Client Problem

The client runs a small marketing agency with 5 team members. They currently track tasks using spreadsheets and email. Tasks get lost, deadlines are missed, and there is no visibility into who is working on what. They need a simple, web-based task management tool.

### Target Users

- **Team members**: Create, update, and complete tasks
- **Project manager**: Assign tasks, view progress, manage projects
- **Admin**: Manage users and settings

### Scope

```text
IN SCOPE:
- User authentication (email/password)
- Project creation and management
- Task creation, assignment, and tracking
- Task status workflow (todo, in progress, done)
- Dashboard with project overview
- Responsive design (mobile and desktop)
- Basic notifications (in-app)

OUT OF SCOPE:
- Mobile app
- Advanced reporting/analytics
- Time tracking
- File attachments
- Calendar integration
- Third-party integrations (Slack, email)
- Multi-language support
```

### Assumptions

```text
ASSUMPTIONS:
- Client has hosting that supports Node.js 18 and PostgreSQL
- Client will provide user data in CSV format for initial import
- Client will test and approve each deliverable
- Maximum 20 concurrent users
- Modern browser support (Chrome, Firefox, Safari, Edge)
```

### Constraints

```text
CONSTRAINTS:
- Technology: Next.js, Prisma, PostgreSQL, Tailwind CSS
- Budget: $4,000
- Timeline: 4 weeks
- Deployment: Vercel
- Must follow existing project patterns if extending an existing codebase
```

### Success Criteria

```text
SUCCESS CRITERIA:
- Client can create and manage projects
- Team members can update task status
- Project manager can see project progress
- All pages load in under 2 seconds
- Responsive on mobile and desktop
- Client approves the final deliverable
```

## Requirements Discovery

Requirements discovery is the process of identifying what the system must do, how it must perform, and what constraints apply.

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Users can register with email and password | Must have |
| FR-02 | Users can log in and log out | Must have |
| FR-03 | Users can create projects with name and description | Must have |
| FR-04 | Users can edit project details | Must have |
| FR-05 | Users can delete projects | Should have |
| FR-06 | Users can create tasks with title, description, and due date | Must have |
| FR-07 | Users can assign tasks to team members | Must have |
| FR-08 | Users can update task status (todo, in progress, done) | Must have |
| FR-09 | Project manager can view project dashboard with task counts | Must have |
| FR-10 | Users receive in-app notifications for task assignments | Should have |

### Non-Functional Requirements

| ID | Category | Requirement | Target |
|----|----------|-------------|--------|
| NFR-01 | Performance | Page load time | Under 2 seconds |
| NFR-02 | Security | Password hashing | bcrypt, 12 rounds |
| NFR-03 | Accessibility | Keyboard navigation | All interactive elements |
| NFR-04 | Reliability | Uptime | 99.9% |
| NFR-05 | Scalability | Concurrent users | Support 20 |
| NFR-06 | Usability | Task creation | 3 clicks or fewer |
| NFR-07 | Compatibility | Browser support | Chrome, Firefox, Safari, Edge |

### Constraints

- Must use Next.js, Prisma, PostgreSQL, Tailwind CSS
- Must deploy to Vercel
- Must complete within 4 weeks
- Budget of $4,000

### Assumptions

- Client hosting supports Node.js 18 and PostgreSQL
- Client will provide user data for initial import
- Client will review and approve each deliverable
- Maximum 20 concurrent users

### Dependencies

- Client must provide brand guidelines and logo
- Client must provide user data CSV before implementation
- Client must have Stripe account ready (if billing is added later)

### Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Client data format changes | Medium | High | Define CSV format in specification |
| Scope creep | High | High | Strict scope boundaries in specification |
| Technology issues | Low | Medium | Use proven, stable versions |
| Client delays feedback | Medium | Medium | Set review deadlines in contract |

### Questions to Ask the Client

Before writing the specification, ask:

1. How many team members will use the system?
2. What task statuses do you need? (todo, in progress, done, or more?)
3. How do you want to assign tasks? (by project, by person, by priority?)
4. What information do you want on the dashboard?
5. Do you need email notifications in addition to in-app notifications?
6. What happens when a task is overdue?
7. Can users have different roles? (admin, manager, team member)
8. How do you want to handle task priorities?

### Handling Ambiguous Requirements

When a requirement is ambiguous:

| Ambiguity | Clarification | Resolution |
|-----------|--------------|-----------|
| "Make it easy to use" | What specific actions should be easy? | Write measurable usability requirement |
| "Fast performance" | How fast? Under what conditions? | Define specific response time targets |
| "Secure" | What threats? What data? | Define specific security requirements |
| "Mobile-friendly" | Which devices? What breaks on mobile? | Define responsive breakpoints |

## Writing the Specification

The specification (spec.md) is the central artifact. It defines what to build, why, and how it should behave.

### Purpose of spec.md

The specification answers:
- What problem does this feature solve?
- Who is it for?
- What must it do?
- How should it behave in specific scenarios?
- What are the boundaries?
- How do we verify it works?

### User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-01 | As a team member, I want to create tasks so that I can track my work | Must have |
| US-02 | As a team member, I want to update task status so that others can see my progress | Must have |
| US-03 | As a project manager, I want to assign tasks to team members so that work is distributed | Must have |
| US-04 | As a project manager, I want to view a project dashboard so that I can track overall progress | Must have |
| US-05 | As a user, I want to register and log in so that my data is secure | Must have |
| US-06 | As a user, I want to create projects so that tasks are organized | Must have |

### Acceptance Scenarios

```text
US-01 Acceptance Scenarios:

Scenario 1: Create a task successfully
  Given I am logged in and on a project page
  When I click "Add Task" and fill in title and description
  And I click "Save"
  Then the task appears in the task list with status "todo"

Scenario 2: Validation error for empty title
  Given I am on the task creation form
  When I leave the title empty and click "Save"
  Then I see "Title is required"

Scenario 3: Validation error for long title
  Given I am on the task creation form
  When I enter a title longer than 100 characters
  Then I see "Title must be 100 characters or fewer"

US-02 Acceptance Scenarios:

Scenario 1: Update task status
  Given I am on the project page with tasks
  When I click the status dropdown on a task
  And I select "in progress"
  Then the task status updates to "in progress"

Scenario 2: Mark task as done
  Given I am on the project page with tasks
  When I click the status dropdown on a task
  And I select "done"
  Then the task status updates to "done"
  And the task appears with a checkmark

US-04 Acceptance Scenarios:

Scenario 1: View project dashboard
  Given I am logged in as project manager
  When I navigate to a project
  Then I see total tasks, tasks by status, and team member workload

Scenario 2: Dashboard loads quickly
  Given I am on the dashboard
  When the page loads
  Then all data appears within 2 seconds
```

### Edge Cases

| Scenario | Expected Behavior |
|----------|------------------|
| User creates task with only whitespace in title | Show validation error |
| User tries to assign task to non-existent user | Show error, prevent assignment |
| User tries to delete a project with tasks | Show confirmation dialog, warn about data loss |
| Two users edit the same task simultaneously | Last write wins, show notification |
| Task due date is in the past | Show overdue indicator |
| User has no projects yet | Show empty state with "Create your first project" |

### Error Handling

| Error | User Experience |
|-------|----------------|
| Network failure | Show "Connection lost. Changes will be saved when reconnected." |
| Server error | Show "Something went wrong. Please try again." |
| Validation error | Show specific error message next to the field |
| Authentication expired | Redirect to login with "Session expired" message |

### Security and Privacy Requirements

- Passwords hashed with bcrypt (12 rounds)
- Sessions expire after 30 minutes of inactivity
- All API routes require authentication except login and register
- Users can only access their own projects and tasks
- No secrets in source code
- CSRF protection on all forms
- Rate limiting on login endpoint

### Performance Requirements

- Dashboard loads in under 2 seconds
- Task list renders in under 500ms for up to 100 tasks
- Search results appear in under 300ms
- Form submission completes in under 1 second

## Specification Quality

Before finalizing the specification, verify its quality.

| Attribute | Check | How to Verify |
|-----------|-------|--------------|
| **Testable** | Every requirement has acceptance criteria | Can you write a test for each requirement? |
| **Clear** | No ambiguity in language | Can someone else read it and build the same thing? |
| **Complete** | All scenarios covered | Are there any user actions not addressed? |
| **Consistent** | No contradictions | Do any requirements conflict? |
| **Traceable** | Requirements link to tasks | Can you trace from requirement to implementation? |
| **Feasible** | Achievable within constraints | Can it be built with the available resources? |
| **Appropriately detailed** | Enough to implement, not too much | Is the detail proportional to the project size? |

### Avoiding Implementation Details Too Early

| Specification Says | Plan Says |
|-------------------|----------|
| "Users can search tasks by title" | "Use Prisma full-text search with PostgreSQL" |
| "Dashboard loads in under 2 seconds" | "Add database indexes on task.projectId and task.status" |
| "Users receive notifications" | "Use server-sent events with a notification table" |

The specification defines WHAT. The plan defines HOW. Keep them separate.

## Example Complete Specification

```markdown
# Specification: Task Management Application

## Problem Statement
A small marketing agency with 5 team members tracks tasks using
spreadsheets and email. Tasks get lost, deadlines are missed, and
there is no visibility into who is working on what. They need a
simple, web-based task management tool.

## Goals
- Centralize task management for the team
- Provide visibility into project progress
- Reduce missed deadlines
- Enable task assignment and status tracking

## User Stories

### US-01: Create Task
As a team member,
I want to create tasks with title, description, and due date,
So that I can track my work items.

**Acceptance Criteria:**
- Given I am on a project page, When I click "Add Task" and fill
  in valid details, Then the task appears in the task list
- Given I leave the title empty, When I click "Save", Then I see
  "Title is required"
- Given I enter a title over 100 characters, When I click "Save",
  Then I see "Title must be 100 characters or fewer"

### US-02: Update Task Status
As a team member,
I want to update task status (todo, in progress, done),
So that others can see my progress.

**Acceptance Criteria:**
- Given I have tasks, When I select a new status, Then the task
  status updates immediately
- Given I mark a task as done, When I view the task, Then it
  shows a checkmark indicator

### US-03: Assign Tasks
As a project manager,
I want to assign tasks to team members,
So that work is distributed clearly.

**Acceptance Criteria:**
- Given I am creating/editing a task, When I select a team member,
  Then the task is assigned to that person
- Given I assign a task, When the assignee logs in, Then they
  see the assignment notification

### US-04: Project Dashboard
As a project manager,
I want to view a dashboard with project metrics,
So that I can track overall progress.

**Acceptance Criteria:**
- Given I open a project, When the dashboard loads, Then I see
  total tasks, tasks by status, and team member workload
- Given I am on the dashboard, When the page loads, Then all
  data appears within 2 seconds

### US-05: User Authentication
As a user,
I want to register and log in,
So that my data is secure.

**Acceptance Criteria:**
- Given I am on the registration page, When I enter valid email
  and password, Then my account is created
- Given I am on the login page, When I enter valid credentials,
  Then I am redirected to the dashboard
- Given I enter invalid credentials, When I click login, Then I
  see "Invalid email or password"

### US-06: Project Management
As a user,
I want to create and manage projects,
So that tasks are organized by project.

**Acceptance Criteria:**
- Given I am logged in, When I click "New Project" and enter a
  name, Then the project appears in my project list
- Given I have projects, When I click a project, Then I see the
  project's tasks and dashboard

## Functional Requirements
- FR-01: User registration with email/password
- FR-02: User login and logout
- FR-03: Project CRUD (create, read, update, delete)
- FR-04: Task CRUD with title, description, due date
- FR-05: Task assignment to team members
- FR-06: Task status workflow (todo, in progress, done)
- FR-07: Project dashboard with metrics
- FR-08: In-app notifications for assignments

## Non-Functional Requirements
- NFR-01: Page load under 2 seconds
- NFR-02: Password hashing with bcrypt (12 rounds)
- NFR-03: Keyboard navigation on all interactive elements
- NFR-04: 99.9% uptime
- NFR-05: Support 20 concurrent users
- NFR-06: Task creation in 3 clicks or fewer
- NFR-07: Chrome, Firefox, Safari, Edge support

## Constraints
- Technology: Next.js, Prisma, PostgreSQL, Tailwind CSS
- Deployment: Vercel
- Timeline: 4 weeks
- Budget: $4,000

## Assumptions
- Client hosting supports Node.js 18 and PostgreSQL
- Client will provide user data CSV for initial import
- Client will review and approve each deliverable
- Maximum 20 concurrent users

## Edge Cases
- Empty task title: show validation error
- Duplicate project names: allow (projects are user-scoped)
- Past due dates: show overdue indicator
- Concurrent edits: last write wins
- Empty project: show "Create your first task" prompt

## Out of Scope
- Mobile app
- Advanced reporting
- Time tracking
- File attachments
- Calendar integration
- Third-party integrations
- Multi-language support

## Success Criteria
- Client can create and manage projects
- Team members can update task status
- Project manager sees project progress
- All pages load in under 2 seconds
- Responsive on mobile and desktop
- Client approves the final deliverable
```

## From Specification to Plan

The plan is derived from the specification. It defines the technical approach, architecture, and implementation phases.

### Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend framework | Next.js (App Router) | Modern, fast, good Vercel support |
| Database | PostgreSQL with Prisma | Type-safe ORM, migration support |
| Styling | Tailwind CSS | Utility-first, responsive, fast |
| Authentication | next-auth | Industry standard, easy setup |
| Deployment | Vercel | Seamless Next.js deployment |

### Technology Decisions

- **State management**: React useState/useReducer (sufficient for this scope)
- **Form handling**: React Hook Form with zod validation
- **API**: Next.js API routes (no separate backend needed)
- **Testing**: Vitest for unit tests, Playwright for e2e

### Project Phases

| Phase | Description | Duration |
|-------|-------------|----------|
| Phase 1 | Project setup and configuration | 1 day |
| Phase 2 | Authentication system | 2 days |
| Phase 3 | Project management | 2 days |
| Phase 4 | Task management | 3 days |
| Phase 5 | Dashboard | 2 days |
| Phase 6 | Notifications | 1 day |
| Phase 7 | Testing and QA | 2 days |
| Phase 8 | Deployment and delivery | 1 day |

### Dependencies

```text
Phase 1 (setup) -> Phase 2 (auth) -> Phase 3 (projects)
  -> Phase 4 (tasks) -> Phase 5 (dashboard) -> Phase 6 (notifications)
  -> Phase 7 (testing) -> Phase 8 (delivery)
```

### Risks

| Risk | Mitigation |
|------|-----------|
| Client data format changes | Define CSV format early, test import early |
| Scope creep | Reference specification for every request |
| Performance issues | Test with realistic data volumes |

### Verification Strategy

- Unit tests for each component
- Integration tests for API routes
- Manual testing against acceptance scenarios
- Performance testing for dashboard load time
- Security review for authentication and authorization

## Example plan.md

```markdown
# Implementation Plan: Task Management Application

## Architecture

- Frontend: Next.js 14 (App Router)
- Database: PostgreSQL with Prisma ORM
- Styling: Tailwind CSS
- Auth: next-auth with credentials provider
- Forms: React Hook Form + zod
- Testing: Vitest + Playwright

## Data Model

### User
- id: UUID
- name: String
- email: String (unique)
- password: String (hashed)
- createdAt: DateTime

### Project
- id: UUID
- name: String
- description: String?
- ownerId: UUID (FK -> User)
- createdAt: DateTime
- updatedAt: DateTime

### Task
- id: UUID
- title: String
- description: String?
- status: Enum (todo, in_progress, done)
- dueDate: DateTime?
- projectId: UUID (FK -> Project)
- assigneeId: UUID? (FK -> User)
- createdAt: DateTime
- updatedAt: DateTime

### Notification
- id: UUID
- userId: UUID (FK -> User)
- message: String
- read: Boolean
- createdAt: DateTime

## API Routes

| Method | Route | Purpose |
|--------|-------|---------|
| POST | /api/auth/register | User registration |
| POST | /api/auth/login | User login |
| GET | /api/projects | List user projects |
| POST | /api/projects | Create project |
| PUT | /api/projects/[id] | Update project |
| DELETE | /api/projects/[id] | Delete project |
| GET | /api/projects/[id]/tasks | List project tasks |
| POST | /api/projects/[id]/tasks | Create task |
| PUT | /api/tasks/[id] | Update task |
| DELETE | /api/tasks/[id] | Delete task |
| PUT | /api/tasks/[id]/assign | Assign task |
| GET | /api/notifications | List notifications |

## Components

| Component | Location | Purpose |
|-----------|----------|---------|
| LoginForm | src/components/auth/LoginForm.tsx | Login form |
| RegisterForm | src/components/auth/RegisterForm.tsx | Registration form |
| ProjectList | src/components/projects/ProjectList.tsx | Project listing |
| ProjectForm | src/components/projects/ProjectForm.tsx | Create/edit project |
| TaskList | src/components/tasks/TaskList.tsx | Task listing |
| TaskForm | src/components/tasks/TaskForm.tsx | Create/edit task |
| TaskCard | src/components/tasks/TaskCard.tsx | Task display card |
| Dashboard | src/components/dashboard/Dashboard.tsx | Project dashboard |
| NotificationBell | src/components/notifications/NotificationBell.tsx | Notification indicator |

## Phases

### Phase 1: Setup (Day 1)
- Initialize Next.js project
- Configure Prisma and database
- Set up Tailwind CSS
- Configure ESLint and Prettier
- Create folder structure

### Phase 2: Authentication (Days 2-3)
- Set up next-auth
- Create registration API route
- Create login API route
- Create login and register pages
- Add session middleware
- Write unit tests

### Phase 3: Projects (Days 4-5)
- Create Project model and migration
- Create project CRUD API routes
- Create ProjectList component
- Create ProjectForm component
- Create project pages
- Write unit tests

### Phase 4: Tasks (Days 6-8)
- Create Task model and migration
- Create task CRUD API routes
- Create TaskList component
- Create TaskForm component
- Create TaskCard component
- Implement task status workflow
- Implement task assignment
- Write unit tests

### Phase 5: Dashboard (Days 9-10)
- Create dashboard API route
- Create Dashboard component
- Display task counts by status
- Display team member workload
- Optimize for performance

### Phase 6: Notifications (Day 11)
- Create Notification model
- Create notification API routes
- Create NotificationBell component
- Send notification on task assignment
- Mark notifications as read

### Phase 7: Testing and QA (Days 12-13)
- Write integration tests
- Test all acceptance scenarios
- Performance testing
- Security review
- Accessibility testing

### Phase 8: Deployment (Day 14)
- Configure Vercel deployment
- Set up environment variables
- Deploy to staging
- Client review
- Deploy to production

## Verification

After each phase:
- Run unit tests
- Run type checker
- Review git diff
- Verify acceptance criteria for that phase

After all phases:
- Run full test suite
- Test all acceptance scenarios manually
- Verify performance targets
- Security review
- Client approval
```

## From Plan to Tasks

Tasks are the smallest units of work. Each task should be completable in one sitting and produce a verifiable result.

### Good Task Characteristics

| Characteristic | What It Means | Example |
|---------------|--------------|---------|
| **Small** | Completable in 1-3 hours | "Create the Task model and migration" |
| **Specific** | Clear what needs to be done | "Implement task status dropdown in TaskCard" |
| **Testable** | You know when it is done | "All acceptance criteria for US-01 pass" |
| **Independent** | Can be done without waiting on others | "Create the TaskForm component" |
| **Traceable** | Links to a requirement or user story | "US-01: Create task form with validation" |

### Task Dependencies

Some tasks must be completed before others:

```text
Task 1: Project setup (no dependencies)
Task 2: Database schema (depends on Task 1)
Task 3: Auth system (depends on Task 2)
Task 4: Project CRUD (depends on Task 2, Task 3)
Task 5: Task CRUD (depends on Task 2, Task 3, Task 4)
Task 6: Dashboard (depends on Task 5)
Task 7: Notifications (depends on Task 5)
Task 8: Testing (depends on Task 6, Task 7)
```

### Parallel vs Sequential Work

| Work Type | When to Parallelize | Example |
|-----------|-------------------|---------|
| Independent components | After shared dependencies are met | TaskForm and TaskList can be built in parallel |
| Sequential dependencies | When one task depends on another | Auth must be done before project CRUD |
| Testing | After implementation | Tests are written after the feature exists |

### Avoiding Oversized Tasks

| Bad Task | Why It Is Bad | Better Task |
|----------|--------------|------------|
| "Build the entire auth system" | Too large, unclear scope | "Create registration API route with validation" |
| "Implement task management" | Massive scope | "Create TaskForm component with title and description fields" |

### Avoiding Meaningless Micro-Tasks

| Bad Task | Why It Is Bad | Better Task |
|----------|--------------|------------|
| "Create a file" | Too trivial | "Create Task model file with interface definition" |
| "Add a line of code" | Not meaningful | "Add task status enum to the type definitions" |

## Example tasks.md

```markdown
# Tasks: Task Management Application

## Phase 1: Setup

- [ ] T-01: Initialize Next.js project with TypeScript
  - Dependencies: None
  - Estimated: 30 minutes

- [ ] T-02: Configure Prisma with PostgreSQL
  - Dependencies: T-01
  - Estimated: 30 minutes

- [ ] T-03: Set up Tailwind CSS
  - Dependencies: T-01
  - Estimated: 30 minutes

- [ ] T-04: Create folder structure (components, lib, types, tests)
  - Dependencies: T-01
  - Estimated: 15 minutes

## Phase 2: Authentication

- [ ] T-05: Set up next-auth with credentials provider
  - Dependencies: T-02
  - Estimated: 1 hour

- [ ] T-06: Create User model and migration
  - Dependencies: T-02
  - Estimated: 30 minutes

- [ ] T-07: Create registration API route with validation
  - Dependencies: T-06
  - Estimated: 1 hour

- [ ] T-08: Create login API route
  - Dependencies: T-06
  - Estimated: 1 hour

- [ ] T-09: Create login page component
  - Dependencies: T-05, T-08
  - Estimated: 1 hour

- [ ] T-10: Create registration page component
  - Dependencies: T-05, T-07
  - Estimated: 1 hour

- [ ] T-11: Add session middleware for protected routes
  - Dependencies: T-05
  - Estimated: 30 minutes

## Phase 3: Projects

- [ ] T-12: Create Project model and migration
  - Dependencies: T-06
  - Estimated: 30 minutes

- [ ] T-13: Create project CRUD API routes
  - Dependencies: T-12
  - Estimated: 1.5 hours

- [ ] T-14: Create ProjectList component
  - Dependencies: T-13
  - Estimated: 1 hour

- [ ] T-15: Create ProjectForm component
  - Dependencies: T-13
  - Estimated: 1 hour

- [ ] T-16: Create project pages (list, detail)
  - Dependencies: T-14, T-15
  - Estimated: 1 hour

## Phase 4: Tasks

- [ ] T-17: Create Task model and migration
  - Dependencies: T-12
  - Estimated: 30 minutes

- [ ] T-18: Create task CRUD API routes
  - Dependencies: T-17
  - Estimated: 1.5 hours

- [ ] T-19: Create TaskForm component with validation
  - Dependencies: T-18
  - Estimated: 1.5 hours

- [ ] T-20: Create TaskCard component with status display
  - Dependencies: T-18
  - Estimated: 1 hour

- [ ] T-21: Create TaskList component
  - Dependencies: T-20
  - Estimated: 1 hour

- [ ] T-22: Implement task status workflow
  - Dependencies: T-18, T-20
  - Estimated: 1 hour

- [ ] T-23: Implement task assignment
  - Dependencies: T-18, T-20
  - Estimated: 1 hour

## Phase 5: Dashboard

- [ ] T-24: Create dashboard API route with metrics
  - Dependencies: T-17
  - Estimated: 1.5 hours

- [ ] T-25: Create Dashboard component
  - Dependencies: T-24
  - Estimated: 1.5 hours

- [ ] T-26: Optimize dashboard query performance
  - Dependencies: T-25
  - Estimated: 1 hour

## Phase 6: Notifications

- [ ] T-27: Create Notification model
  - Dependencies: T-06
  - Estimated: 30 minutes

- [ ] T-28: Create notification API routes
  - Dependencies: T-27
  - Estimated: 1 hour

- [ ] T-29: Create NotificationBell component
  - Dependencies: T-28
  - Estimated: 1 hour

- [ ] T-30: Send notification on task assignment
  - Dependencies: T-23, T-28
  - Estimated: 30 minutes

## Phase 7: Testing

- [ ] T-31: Write unit tests for auth flows
  - Dependencies: T-09, T-10
  - Estimated: 1 hour

- [ ] T-32: Write unit tests for project CRUD
  - Dependencies: T-16
  - Estimated: 1 hour

- [ ] T-33: Write unit tests for task management
  - Dependencies: T-21, T-22, T-23
  - Estimated: 1.5 hours

- [ ] T-34: Write integration tests for API routes
  - Dependencies: T-13, T-18
  - Estimated: 1.5 hours

- [ ] T-35: Manual testing against all acceptance scenarios
  - Dependencies: T-31, T-32, T-33, T-34
  - Estimated: 1 hour

## Phase 8: Delivery

- [ ] T-36: Configure Vercel deployment
  - Dependencies: T-35
  - Estimated: 30 minutes

- [ ] T-37: Deploy to staging
  - Dependencies: T-36
  - Estimated: 30 minutes

- [ ] T-38: Client review and approval
  - Dependencies: T-37
  - Estimated: 1 day (client time)

- [ ] T-39: Deploy to production
  - Dependencies: T-38
  - Estimated: 30 minutes
```

## Using AI Coding Agents with Spec-Kit

Specifications transform how AI coding agents work. An agent with a specification implements exactly what is needed. An agent without a specification guesses.

### How AI Agents Consume Specifications

| Specification Element | What the Agent Gets |
|----------------------|-------------------|
| Problem statement | Understanding of the goal |
| User stories | User perspective and motivation |
| Requirements | Exact behaviors to implement |
| Acceptance criteria | Testable conditions to satisfy |
| Constraints | Boundaries and limitations |
| Edge cases | Scenarios to handle |
| Out of scope | What NOT to build |

### Strong Agent Prompts

**Weak**: "Create the task management app."

**Strong**:

```text
Implement the task management application per the specification
in specs/task-manager/spec.md.

Phase 2: Authentication

Create:
1. User model in src/lib/prisma/schema.prisma
2. Registration API route at src/app/api/auth/register/route.ts
3. Login API route at src/app/api/auth/login/route.ts
4. Login page at src/app/login/page.tsx
5. Registration page at src/app/register/page.tsx

Follow the existing patterns in:
- src/app/api/ (API route patterns)
- src/components/ (component patterns)

Acceptance criteria from specification US-05:
- Registration with valid email/password creates account
- Login with valid credentials redirects to dashboard
- Invalid credentials show "Invalid email or password"

Constraints:
- Use next-auth with credentials provider
- Hash passwords with bcrypt (12 rounds)
- Do not modify existing database schema

Run npm test and npm run typecheck after changes.
```

### Context Management

The agent needs context beyond the specification:

| Context Type | What to Provide | Why |
|-------------|----------------|-----|
| Specification | The full spec.md | Core requirements |
| Existing code patterns | Point to specific files | Agent follows established conventions |
| Technology versions | package.json contents | Agent uses correct APIs |
| Database schema | Current Prisma schema | Agent understands existing models |
| Git status | Clean working tree | Agent starts from a known state |

### Repository Inspection

Before giving the agent a task, ensure it can inspect:

- The specification document
- Existing component patterns
- Existing API route patterns
- The database schema
- The test configuration
- The package.json

### Constraints

Always specify:

- What files the agent should NOT modify
- What technologies to use
- What patterns to follow
- What verification to run after changes

### Human Approval Points

| Stage | Human Approval Required |
|-------|----------------------|
| Agent plan | Review before implementation |
| Agent implementation | Review git diff |
| Agent tests | Verify test quality |
| Agent refactoring | Ensure behavior preserved |
| Agent deployment | Never deploy without human approval |

### Why Specifications Do Not Eliminate Review

An agent can:
- Implement the wrong interpretation of a requirement
- Miss edge cases that are in the specification
- Introduce security issues not covered by acceptance criteria
- Change files outside the scope of the task
- Overengineer solutions

Human review remains essential at every stage.

## AI-Assisted vs Agentic Spec-Kit Workflow

| Aspect | AI-Assisted | Agentic | Hybrid |
|--------|------------|---------|--------|
| **Specification creation** | You write, AI helps draft | AI drafts, you review | AI drafts, you refine |
| **Plan creation** | You write, AI suggests | AI generates, you review | AI generates, you adjust |
| **Task creation** | You write tasks | AI generates tasks from spec | AI generates, you refine |
| **Implementation** | You code with AI suggestions | Agent implements per spec | Agent implements, you review |
| **Testing** | You write tests with AI help | Agent generates tests | Agent generates, you verify |
| **Verification** | You verify manually | Agent verifies against spec | Agent verifies, you confirm |

### When to Use Each

- **AI-Assisted**: When you need deep understanding of the implementation
- **Agentic**: When the task is well-defined and testable
- **Hybrid**: For most professional projects — the strongest approach

## Git + Spec-Kit

This section connects directly to Chapter 07: Git & GitHub for Freelancers.

### Branch Strategy

```text
main
  |
  +-- spec/task-manager
  |     Specification and plan
  |
  +-- feature/task-manager
  |     Implementation
  |
  +-- test/task-manager
        Tests
```

### Reviewing Spec Changes

```bash
# After writing the specification
git add specs/task-manager/
git commit -m "Add task management specification"

# Review what changed
git diff HEAD~1 -- specs/task-manager/spec.md
```

### Reviewing Agent Changes

```bash
# After agent implements a feature
git status
git diff

# Check which files were modified
git diff --stat

# Review specific changes
git diff src/app/api/tasks/route.ts
```

### Small Commits

Each task should produce a focused commit:

```bash
git add src/lib/prisma/schema.prisma
git commit -m "Add Task model with status enum and project/assignee relations"

git add src/app/api/tasks/
git commit -m "Add task CRUD API routes with validation"

git add src/components/tasks/
git commit -m "Add TaskForm, TaskCard, and TaskList components"
```

### Diff Review

Before committing agent output:

```bash
git diff --staged    # Review what will be committed
git diff --stat      # See which files changed
```

Check for:
- Unexpected file modifications
- Hardcoded secrets
- Missing error handling
- Code that does not match the specification

### Pull Requests

```bash
git push origin feature/task-manager
# Create PR on GitHub
# Reference the specification in the PR description
# Review the diff
# Merge after approval
```

### Safe Rollback

If the agent makes bad changes:

```bash
# Discard uncommitted changes
git restore .

# Discard last commit
git reset --soft HEAD~1

# Start over from main
git switch main
git branch -D feature/task-manager
```

### Keeping Specifications and Implementation Aligned

The specification is the source of truth. When code changes, check if the specification needs updating. When the specification changes, update the code.

## Specification Changes

Client requirements change. How you handle changes determines whether the project stays on track.

### The Change Request Process

| Step | Action | Who |
|------|--------|-----|
| 1 | Client requests a change | Client |
| 2 | You document the change request | Freelancer |
| 3 | You analyze the impact | Freelancer |
| 4 | You update the specification | Freelancer |
| 5 | You update the plan and tasks | Freelancer |
| 6 | You estimate additional effort | Freelancer |
| 7 | You discuss impact with client | Both |
| 8 | Client approves the change | Client |
| 9 | You implement the change | Freelancer |
| 10 | You retest against updated specification | Freelancer |
| 11 | You document the change | Freelancer |

### Impact Analysis

When a change is requested, analyze:

| What to Check | Why |
|--------------|-----|
| Which requirements are affected? | Understanding scope of change |
| Which tasks need to be updated? | Planning the work |
| Which code needs to change? | Estimating effort |
| Are there dependencies? | Identifying cascading effects |
| Does the timeline change? | Managing client expectations |
| Does the budget change? | Managing commercial impact |

## Specification Drift

Specification drift is the gradual divergence between what the specification says and what the code actually does.

### How It Happens

| Drift Type | What Happens |
|-----------|-------------|
| Code ahead of spec | Developer adds features not in specification |
| Spec ahead of code | Specification promises features not yet implemented |
| Test drift | Tests pass but do not verify current requirements |
| Documentation drift | Documentation describes old behavior |

### Warning Signs

- "The code works differently than the specification says"
- "The tests pass but the behavior is wrong"
- "The client expects something different than what was built"
- "The specification says one thing, the implementation does another"

### Prevention

- Update the specification before updating code
- Run acceptance criteria as automated tests
- Review specification vs implementation regularly
- Commit specification changes alongside code changes

### Recovery

1. Document the current state of the code
2. Update the specification to match reality
3. Identify any requirements that were missed
4. Create tasks to address gaps
5. Update tests to match the current specification

### Example

```text
Specification says: "Task status can be todo, in progress, done"
Code implements: "Task status can be todo, in progress, done, blocked"
Test verifies: "blocked" status works

Resolution: Update specification to include "blocked" status,
or remove it from the code if it was not approved.
```

## Verification

Verification confirms that the implementation matches the specification.

### Verification Checklist

| Check | How | Pass Criteria |
|-------|-----|--------------|
| Acceptance scenarios | Run each scenario manually | All scenarios pass |
| Unit tests | npm test | All tests pass |
| Type checking | npm run typecheck | No type errors |
| Linting | npm run lint | No lint errors |
| Build | npm run build | Build succeeds |
| Performance | Load dashboard | Under 2 seconds |
| Security | Review auth code | No vulnerabilities |
| Accessibility | Keyboard test | All elements navigable |
| Responsive | Test at 320px, 768px, 1280px | Layout correct at all sizes |
| Specification compliance | Compare code to spec | All requirements implemented |
| Scope verification | Check out-of-scope items | No out-of-scope features built |

### Traceability Matrix

| Requirement | User Story | Acceptance Criteria | Task | Code | Test |
|-------------|-----------|--------------------|------|------|----|
| FR-01: Registration | US-05 | AC-01, AC-02 | T-07, T-10 | RegisterForm.tsx | register.test.ts |
| FR-06: Task creation | US-01 | AC-01, AC-02, AC-03 | T-19 | TaskForm.tsx | task-form.test.ts |
| FR-08: Task status | US-02 | AC-01, AC-02 | T-22 | TaskCard.tsx | task-status.test.ts |

## Complete End-to-End Case Study

### Client Request

> "We need a task management tool for our 5-person marketing agency."

### Step-by-Step Workflow

**Step 1: Discovery**

You ask the client:
- How many team members?
- What task statuses do you need?
- How do you assign tasks?
- What do you want on the dashboard?
- What is your budget and timeline?

**Step 2: Clarification**

Client responds:
- 5 team members
- Todo, in progress, done
- Project manager assigns tasks
- Dashboard shows task counts and workload
- $4,000, 4 weeks

**Step 3: Constitution**

You create `.specify/memory/constitution.md` with project principles.

**Step 4: Requirements**

You write functional and non-functional requirements based on the discovery.

**Step 5: User Stories**

You write 6 user stories covering all major functionality.

**Step 6: Acceptance Criteria**

You write Given/When/Then scenarios for each user story.

**Step 7: Scope Definition**

You define in-scope, out-of-scope, assumptions, and constraints.

**Step 8: Specification**

You compile everything into `specs/task-manager/spec.md`.

**Step 9: Client Approval**

You share the specification with the client. The client requests one change: add a "blocked" status. You update the specification and get approval.

**Step 10: Technical Plan**

You create `specs/task-manager/plan.md` with architecture, data model, API routes, components, and phases.

**Step 11: Task Breakdown**

You create `specs/task-manager/tasks.md` with 39 tasks organized into 8 phases.

**Step 12: Git Setup**

```bash
git init
git switch -c spec/task-manager
git add specs/ .specify/
git commit -m "Add task management specification, plan, and tasks"
git push -u origin spec/task-manager
```

**Step 13: AI Agent Instructions**

You give the agent Phase 2 tasks with the specification as context:

```text
Implement authentication per the specification in
specs/task-manager/spec.md, Phase 2.

Create:
1. User model in Prisma schema
2. Registration API route with validation
3. Login API route
4. Login and registration pages
5. Session middleware

Acceptance criteria from US-05.
Run npm test and npm run typecheck after changes.
```

**Step 14: Implementation**

The agent implements the authentication system. You review the git diff.

**Step 15: Testing**

You run all tests. Two fail. You ask the agent to fix them. All pass.

**Step 16: Git Review**

```bash
git diff --stat
git diff src/app/api/auth/
git diff src/components/auth/
```

You confirm only expected files changed.

**Step 17: Verification**

You check each acceptance scenario against the implementation:

| Scenario | Status |
|----------|--------|
| Registration creates account | Pass |
| Login redirects to dashboard | Pass |
| Invalid credentials show error | Pass |

**Step 18: Specification Verification**

You compare the implementation to the specification:

| Requirement | Status |
|-------------|--------|
| FR-01: Registration | Implemented |
| FR-02: Login/logout | Implemented |
| NFR-02: Password hashing | Verified (bcrypt, 12 rounds) |

**Step 19: Client Review**

You deploy to staging. The client tests and approves Phase 2.

**Step 20: Delivery**

You continue through all 8 phases, repeating steps 13-19 for each. After Phase 8, you deploy to production, provide documentation, and hand off to the client.

### Summary

| Phase | AI Role | Human Role |
|-------|---------|-----------|
| Discovery | None | Client communication |
| Specification | AI-assisted drafting | Requirement definition, client approval |
| Planning | AI-assisted plan generation | Technical decisions, plan approval |
| Tasks | AI-assisted task generation | Task verification |
| Implementation | Agentic code generation | Specification verification, diff review |
| Testing | Agent runs tests | Acceptance criteria verification |
| Verification | None | Full specification compliance check |
| Delivery | None | Deployment, client handoff |

## Before/After Examples

| Category | Weak Approach | Professional Approach |
|----------|-------------|---------------------|
| **Requirements** | "Make it work well" | "Page loads in under 2 seconds. All forms validate inputs. Error messages are specific and actionable." |
| **User stories** | "User can do stuff" | "As a project manager, I want to assign tasks to team members so that work is distributed clearly." |
| **Acceptance criteria** | "It should work" | "Given I am on the task form, When I leave title empty and click Save, Then I see 'Title is required'." |
| **Prompts** | "Build the app" | "Implement the authentication system per spec US-05. Create registration and login routes. Use next-auth. Run tests." |
| **Tasks** | "Do auth" | "Create registration API route at src/app/api/auth/register/route.ts with email/password validation and bcrypt hashing." |
| **Plans** | "Build everything" | "Phase 2: Authentication (Days 2-3). Create User model, registration and login routes, pages, and middleware." |
| **Scope** | "Build a task app" | "In scope: CRUD, auth, dashboard. Out of scope: mobile app, reporting, time tracking, integrations." |
| **Change requests** | "Sure, add that" | "That is a new requirement. Let me update the specification, estimate the impact, and provide a revised timeline." |

## Common Failure Modes

### 1. Skipping the Constitution

**Problem**: Starting without project principles.
**Why it happens**: The developer sees it as unnecessary overhead.
**Consequence**: Inconsistent decisions, no governance framework.
**Better approach**: Always create a constitution first. It takes 30 minutes and prevents hours of confusion.

### 2. Writing Specifications Without Client Approval

**Problem**: Implementing based on assumptions instead of approved specifications.
**Why it happens**: The developer wants to start quickly.
**Consequence**: Building the wrong thing, rework, client dissatisfaction.
**Better approach**: Always get written client approval before implementing.

### 3. Vague Acceptance Criteria

**Problem**: "The form should work" is not an acceptance criterion.
**Why it happens**: The developer does not think about testing during specification.
**Consequence**: Cannot verify the implementation is correct.
**Better approach**: Every acceptance criterion must be testable with Given/When/Then format.

### 4. Over-Specifying Implementation

**Problem**: The specification dictates exact code structure.
**Why it happens**: The developer conflates requirements with implementation.
**Consequence**: Constrains the plan unnecessarily.
**Better approach**: Specify WHAT, not HOW. Implementation details belong in the plan.

### 5. Ignoring Edge Cases

**Problem**: Only specifying the happy path.
**Why it happens**: The developer focuses on the ideal flow.
**Consequence**: Error handling is missing, crashes in production.
**Better approach**: For every user story, ask "what could go wrong?"

### 6. Giving Agents Unbounded Tasks

**Problem**: "Build the entire application" without phase boundaries.
**Why it happens**: The developer wants to save time.
**Consequence**: Agent overengineers, misses requirements, changes unrelated files.
**Better approach**: Break work into phases. Give the agent one phase at a time.

### 7. Not Reviewing Agent Output

**Problem**: Accepting agent-generated code without checking against the specification.
**Why it happens**: The developer trusts the agent.
**Consequence**: Subtle mismatches between spec and implementation.
**Better approach**: Review every agent change against the specification.

### 8. Failing to Update Specifications

**Problem**: Requirements change but the specification is not updated.
**Why it happens**: The developer is in a hurry.
**Consequence**: Specification drift, code and spec diverge.
**Better approach**: Treat the specification as a living document.

### 9. Letting AI Invent Requirements

**Problem**: Giving an agent a task without the specification and letting it decide what to build.
**Why it happens**: The developer assumes the agent knows the requirements.
**Consequence**: Agent builds something that does not match client needs.
**Better approach**: Always provide the specification as context.

### 10. Trusting Generated Plans Blindly

**Problem**: Accepting an AI-generated plan without checking against the specification.
**Why it happens**: The developer assumes the AI understood the spec.
**Consequence**: Plan misses requirements, tasks are incomplete.
**Better approach**: Review every plan against the specification.

### 11. Skipping Verification

**Problem**: The specification exists but is never checked during implementation.
**Why it happens**: The developer treats specification as a document to create, not a tool to use.
**Consequence**: Specification becomes decoration, not a working tool.
**Better approach**: Use the specification actively. Verify every deliverable against it.

### 12. Not Connecting Specs to Git

**Problem**: Specifications live outside the project repository.
**Why it happens**: The developer treats specs as separate documentation.
**Consequence**: Specifications get lost, no history, no traceability.
**Better approach**: Commit specifications to the repository alongside the code.

## Freelance Use Cases

| Scenario | Where Spec-Kit Helps | Key Artifacts |
|----------|---------------------|--------------|
| **Client dashboard** | Defines metrics, layout, performance targets | spec.md with dashboard user stories, plan.md with component architecture |
| **Contact form** | Specifies fields, validation, email, spam protection | spec.md with acceptance scenarios, tasks.md with implementation tasks |
| **Booking system** | Defines availability, booking flow, cancellation | spec.md with booking user stories, plan.md with data model |
| **E-commerce feature** | Specifies product display, cart, checkout, payment | spec.md with purchase flow, tasks.md with phase breakdown |
| **Authentication system** | Specifies login, registration, password reset | spec.md with auth user stories, plan.md with security requirements |
| **Admin panel** | Defines admin capabilities, permissions, dashboard | spec.md with admin user stories, tasks.md with CRUD tasks |
| **API integration** | Specifies endpoints, data mapping, error handling | spec.md with integration scenarios, plan.md with API client design |
| **WordPress customization** | Specifies theme changes, plugin requirements | spec.md with page requirements, tasks.md with customization tasks |
| **SaaS feature** | Defines user roles, feature access, pricing | spec.md with role-based user stories, plan.md with access control |
| **AI-powered feature** | Specifies AI behavior, fallbacks, accuracy targets | spec.md with AI interaction scenarios, plan.md with model integration |
| **Performance optimization** | Specifies targets, current baseline, optimization strategy | spec.md with performance requirements, plan.md with optimization approach |
| **Migration project** | Specifies source/target, data mapping, rollback plan | spec.md with migration requirements, plan.md with phase strategy |

## Practical Exercises

**Exercise 10.1: Constitution Creation**

Create a constitution for a personal project:

- **Objective**: Establish guiding principles for a project
- **Scenario**: You are building a personal portfolio website
- **Task**: Write a constitution with 6-8 principles covering development approach, quality standards, security, and documentation
- **Expected deliverable**: A constitution.md file
- **Self-check**: Does the constitution address security? Quality? Process? Is it specific enough to guide decisions?

**Exercise 10.2: Requirements Discovery**

Conduct requirements discovery for a note-taking application:

- **Objective**: Identify complete requirements for a feature
- **Scenario**: A client wants a simple note-taking app with folders and search
- **Task**: Write 10 functional requirements, 5 non-functional requirements, 3 assumptions, and 3 constraints
- **Expected deliverable**: A requirements document
- **Self-check**: Are all requirements testable? Are non-functional requirements measurable? Are assumptions documented?

**Exercise 10.3: User Stories and Acceptance Criteria**

Write user stories and acceptance criteria for a weather dashboard:

- **Objective**: Practice writing user stories with Given/When/Then scenarios
- **Scenario**: A weather dashboard that shows current conditions and 5-day forecast
- **Task**: Write 4 user stories with 3 acceptance criteria each
- **Expected deliverable**: User stories with acceptance scenarios
- **Self-check**: Does each story follow the format? Are scenarios testable? Are edge cases covered?

**Exercise 10.4: Scope Definition**

Define scope for a restaurant ordering system:

- **Objective**: Practice defining in-scope, out-of-scope, assumptions, and constraints
- **Scenario**: Online ordering for a local restaurant
- **Task**: Write 8 in-scope items, 5 out-of-scope items, 3 assumptions, and 3 constraints
- **Expected deliverable**: A scope document
- **Self-check**: Are boundaries clear? Would both you and the client agree on what is included?

**Exercise 10.5: Write a Complete Specification**

Write a complete specification for a password generator tool:

- **Objective**: Create a full spec.md
- **Scenario**: A simple web tool that generates random passwords with configurable options
- **Task**: Write problem statement, goals, 3 user stories with acceptance criteria, 5 functional requirements, 3 non-functional requirements, constraints, and out-of-scope items
- **Expected deliverable**: A complete specification document
- **Self-check**: Is the specification clear enough for someone else to implement? Are all requirements testable?

**Exercise 10.6: Specification to Plan**

Derive an implementation plan from your password generator specification:

- **Objective**: Practice deriving plans from specifications
- **Scenario**: The specification from Exercise 10.5
- **Task**: Write architecture decisions, data model, API routes, components, phases, and verification strategy
- **Expected deliverable**: A plan.md document
- **Self-check**: Can you trace every plan element back to a specification requirement?

**Exercise 10.7: Task Decomposition**

Decompose the password generator plan into tasks:

- **Objective**: Practice breaking work into well-sized tasks
- **Scenario**: The plan from Exercise 10.6
- **Task**: Write 15-20 tasks with dependencies, estimates, and acceptance criteria
- **Expected deliverable**: A tasks.md document
- **Self-check**: Is each task completable in 1-3 hours? Are dependencies identified? Are acceptance criteria clear?

**Exercise 10.8: End-to-End Spec-Kit Project**

Complete a full Spec-Kit project for a bookmark manager:

- **Objective**: Execute the entire Spec-Kit workflow
- **Scenario**: A tool to save, categorize, and search web bookmarks
- **Task**: Create constitution, specification, plan, tasks, implement one feature, verify against specification, and write a summary
- **Expected deliverable**: Complete Spec-Kit artifact set for one feature
- **Self-check**: Does the implementation match the specification? Are all acceptance criteria verified?

## Mini Challenges

### Challenge 1: Specification Quality Review

Review this specification and identify at least 5 problems:

```markdown
# Specification: User Dashboard

## Requirements
- Dashboard should be fast
- Show important information
- Make it easy to use
- Should work on mobile

## Acceptance Criteria
- It loads quickly
- Users can see their data
- It looks good
```

Write an improved version of this specification that addresses every problem you identified.

### Challenge 2: Agent Workflow Review

An AI agent receives this task:

```text
"Build the task management app."
```

The agent proposes:

```text
1. Install 15 new packages
2. Create 25 new files
3. Modify 10 existing files
4. Update the database schema
5. Deploy to production
6. Run tests after deployment
```

The specification says:

```text
Phase 2: Authentication only. Use next-auth. Do not modify
existing schema. Test before deployment.
```

Identify at least 5 problems with the agent's plan and explain what should change.

## Knowledge Check

1. What is Spec-Kit and how does it relate to SDD?
2. What is the purpose of a project constitution?
3. What artifacts does a Spec-Kit project include?
4. How do you derive a plan from a specification?
5. What makes a good implementation task?
6. How do AI coding agents benefit from specifications?
7. What is specification drift and how do you prevent it?
8. What should you check before committing agent-generated code?
9. How do you handle a client change request mid-project?
10. What is the traceability matrix and why does it matter?
11. Why is "Build the entire application" a bad task for an AI agent?
12. How does Spec-Kit improve client communication and trust?

## Common Beginner Mistakes

### 1. Coding Before Understanding Requirements

**Problem**: Starting implementation before requirements are clear.
**Why it happens**: The developer is eager to build.
**Better approach**: Complete discovery, requirements, and specification first. Every hour on requirements saves hours of rework.

### 2. Writing Vague Specifications

**Problem**: Specifications like "make it user-friendly."
**Why it happens**: The developer assumes shared understanding.
**Better approach**: Write specific, testable specifications with measurable acceptance criteria.

### 3. Treating Specs as Paperwork

**Problem**: Creating a specification and never looking at it again.
**Why it happens**: The developer sees specification as a deliverable, not a tool.
**Better approach**: Use the specification actively throughout implementation. Reference it in every decision.

### 4. Over-Specifying Implementation

**Problem**: The specification dictates exact code structure.
**Why it happens**: The developer conflates requirements with implementation.
**Better approach**: Specify WHAT, not HOW. Implementation details belong in the plan.

### 5. Ignoring Edge Cases

**Problem**: Only specifying the happy path.
**Why it happens**: The developer focuses on the ideal flow.
**Better approach**: For every user story, ask "what could go wrong?" and write acceptance criteria for error scenarios.

### 6. Skipping Acceptance Criteria

**Problem**: Requirements without clear verification criteria.
**Why it happens**: The developer does not think about testing during specification.
**Better approach**: Every requirement must have testable acceptance criteria.

### 7. Allowing Scope Creep

**Problem**: Accepting new features without updating the specification.
**Why it happens**: The developer wants to keep the client happy.
**Better approach**: Every new request goes through the specification process. Document, estimate, and approve.

### 8. Failing to Update Specs

**Problem**: Requirements change but the specification is not updated.
**Why it happens**: The developer is in a hurry.
**Better approach**: Treat the specification as a living document. Update it before updating code.

### 9. Letting AI Invent Requirements

**Problem**: Giving an agent a task without the specification.
**Why it happens**: The developer trusts the agent to figure it out.
**Better approach**: Always provide the specification as context. The agent implements what is specified.

### 10. Trusting Generated Plans Blindly

**Problem**: Accepting an AI-generated plan without review.
**Why it happens**: The developer assumes the AI understood the specification.
**Better approach**: Review every plan against the specification. Verify all requirements are covered.

### 11. Skipping Verification

**Problem**: The specification exists but is never checked.
**Why it happens**: The developer treats specification as a document to create, not a tool to use.
**Better approach**: Use the specification actively. Verify every deliverable against acceptance criteria.

### 12. Not Connecting Specs to Git

**Problem**: Specifications live outside the project repository.
**Why it happens**: The developer treats specs as separate documentation.
**Better approach**: Commit specifications to the repository. Reference them in commit messages.

## Freelancer Perspective

### What Works

- Creating a constitution before every project
- Getting client approval on specifications before implementation
- Using specifications as the source of truth for all decisions
- Providing AI agents with specifications as context
- Updating specifications when requirements change
- Maintaining traceability from requirements to code to tests
- Committing specifications to the project repository
- Using specifications to generate accurate estimates

### What Does Not Work

- Starting to code without clear requirements
- Writing vague specifications that nobody can verify
- Treating the specification as a document to create, not a tool to use
- Allowing scope creep without updating the specification
- Letting AI agents guess at requirements
- Trusting AI-generated implementations without checking against the specification
- Keeping specifications outside the project repository
- Ignoring specification drift

### Client Communication

Spec-Kit transforms client communication:

| Without Spec-Kit | With Spec-Kit |
|-----------------|--------------|
| "I think I understand what you want" | "Here is the specification. Please review and approve." |
| "It's almost done" | "Phase 2 is complete. Here are the verification results." |
| "Can you add this one thing?" | "That is a new requirement. Let me update the specification and estimate the impact." |
| "It should be ready soon" | "Tasks 1-15 are complete. Tasks 16-20 are in progress. Estimated completion: Friday." |

### Scope Control

Specifications protect you from scope creep:

- Every requirement is documented
- Every change goes through the specification process
- Every change has an estimated impact
- Nothing is added without approval

### Estimation

Specifications enable accurate estimation:

- Requirements are known, not guessed
- Tasks are sized based on similar past work
- Dependencies are identified upfront
- Risks are documented and mitigated

### Professionalism

Spec-Kit demonstrates professionalism:

- You deliver structured, documented work
- You communicate through specifications, not assumptions
- You verify results against agreed criteria
- You maintain professional standards throughout

### Why Spec-Kit Improves Client Trust

Clients trust freelancers who:

- Deliver what was promised (specification is the promise)
- Communicate clearly (specification is the communication tool)
- Manage changes professionally (specification is the change management tool)
- Verify quality (specification is the quality standard)

### Long-Term Benefits

Over time, Spec-Kit builds:

- A library of specifications for similar projects
- Accurate estimation based on historical data
- A reputation for professional, reliable delivery
- Higher client satisfaction and repeat business
- The ability to take on larger, more complex projects

## 30-Day Practice Plan

### Week 1: Foundations

| Day | Task | Practice | Deliverable |
|-----|------|----------|-------------|
| 1 | Learn Spec-Kit workflow | Read this chapter thoroughly | Notes on Spec-Kit phases |
| 2 | Create a constitution | Write a constitution for a personal project | Constitution document |
| 3 | Practice requirements discovery | Write requirements for a note-taking app | Requirements document |
| 4 | Practice user stories | Write 10 user stories for different features | User story collection |
| 5 | Practice acceptance criteria | Write Given/When/Then scenarios for 5 user stories | Acceptance criteria document |
| 6 | Practice scope definition | Define scope for a restaurant ordering system | Scope document |
| 7 | Reflect on Week 1 | Review all work, identify gaps | Summary of learnings |

### Week 2: Specifications

| Day | Task | Practice | Deliverable |
|-----|------|----------|-------------|
| 8 | Write a complete specification | Create spec.md for a bookmark manager | Complete specification |
| 9 | Review specification quality | Check specification against quality attributes | Quality review report |
| 10 | Practice traceability | Create traceability matrix for your specification | Traceability matrix |
| 11 | Write a plan from specification | Derive plan.md from your specification | Implementation plan |
| 12 | Decompose plan into tasks | Create tasks.md with 15-20 tasks | Task breakdown |
| 13 | Review specification vs plan | Verify plan covers all requirements | Gap analysis |
| 14 | Reflect on Week 2 | Review specification quality and completeness | Specification review |

### Week 3: Plans, Tasks, and AI

| Day | Task | Practice | Deliverable |
|-----|------|----------|-------------|
| 15 | Learn AI + Spec-Kit workflow | Study the AI agent integration section | Workflow notes |
| 16 | Practice AI prompting from specs | Write 5 strong prompts based on a specification | 5 AI prompts |
| 17 | Practice AI-assisted implementation | Give an AI agent a specification task and review | Implementation + review |
| 18 | Practice Git + Spec-Kit | Set up branches, commit specs, review diffs | Git workflow |
| 19 | Practice specification changes | Simulate a client change request and handle it | Updated specification |
| 20 | Practice specification drift prevention | Compare spec vs implementation, identify drift | Drift prevention notes |
| 21 | Reflect on Week 3 | Evaluate AI-assisted Spec-Kit experiences | Workflow assessment |

### Week 4: Complete Freelance Project

| Day | Task | Practice | Deliverable |
|-----|------|----------|-------------|
| 22 | Simulate a client request | Create a realistic freelance scenario | Client request document |
| 23 | Discovery and constitution | Conduct discovery, write constitution | Discovery notes + constitution |
| 24 | Write specification | Create complete spec.md | Specification document |
| 25 | Write plan and tasks | Create plan.md and tasks.md | Plan and task breakdown |
| 26 | Get "client approval" | Review specification as if presenting to client | Approval record |
| 27 | Implement one phase | Use AI agents to implement Phase 1 | Working implementation |
| 28 | Verify against specification | Check implementation against acceptance criteria | Verification report |
| 29 | Write summary | Document lessons learned | Summary document |
| 30 | Review the full month | Evaluate all learning, plan next steps | Monthly reflection |

## Professional Spec-Kit Checklist

### Discovery

- [ ] Understand the client's business problem
- [ ] Identify target users
- [ ] Ask clarifying questions
- [ ] Understand technology constraints
- [ ] Review existing codebase (if extending)

### Constitution

- [ ] Create constitution document
- [ ] Define core development principles
- [ ] Establish review and approval rules
- [ ] Define security requirements
- [ ] Get team/stakeholder alignment

### Specification

- [ ] Write problem statement
- [ ] Define measurable goals
- [ ] Write user stories for all roles
- [ ] Write acceptance criteria for every user story
- [ ] List all functional requirements
- [ ] List all non-functional requirements with targets
- [ ] Define constraints
- [ ] Document assumptions
- [ ] Identify dependencies
- [ ] List edge cases
- [ ] Define out-of-scope items
- [ ] Write success criteria

### Client Approval

- [ ] Share specification with client
- [ ] Walk through specification with client
- [ ] Address client questions
- [ ] Get written approval
- [ ] Establish change request process

### Planning

- [ ] Derive plan from specification
- [ ] Make architecture decisions
- [ ] Define data model
- [ ] Plan API routes
- [ ] Plan component structure
- [ ] Define phases
- [ ] Identify task dependencies
- [ ] Assess risks

### Tasks

- [ ] Break plan into well-sized tasks
- [ ] Add dependencies to each task
- [ ] Estimate effort for each task
- [ ] Add acceptance criteria to each task
- [ ] Sequence tasks logically

### Implementation

- [ ] Follow plan phase by phase
- [ ] Provide specification as context to AI agents
- [ ] Review agent output against specification
- [ ] Run tests after each phase
- [ ] Commit after each task

### Verification

- [ ] Run all acceptance scenarios
- [ ] Run full test suite
- [ ] Run type checker
- [ ] Run linter
- [ ] Verify build succeeds
- [ ] Test performance targets
- [ ] Security review
- [ ] Accessibility testing
- [ ] Compare implementation to specification
- [ ] Verify no out-of-scope features

### Git

- [ ] Specification committed to repository
- [ ] Branches created per phase
- [ ] Commit messages reference specification
- [ ] Diffs reviewed before committing
- [ ] Pull requests created for review

### Delivery

- [ ] Deploy to staging
- [ ] Client review and approval
- [ ] Deploy to production
- [ ] Provide specification as living documentation
- [ ] Document any deviations
- [ ] Hand off with setup instructions

## Summary

- **Spec-Kit** is a structured workflow for specification-driven development that standardizes how projects are organized and executed
- **The constitution** establishes principles and governance that apply to every decision in the project
- **The specification** defines what to build, why, and how it should behave — it is the source of truth
- **The plan** is derived from the specification and defines the technical approach and phases
- **Tasks** are well-sized, traceable work items derived from the plan
- **AI coding agents** produce dramatically better results when they receive specifications with context, constraints, and acceptance criteria
- **Specification drift** occurs when code and specification diverge — prevention requires updating the specification whenever requirements change
- **Verification** confirms that the implementation matches the specification through acceptance scenarios, tests, and manual review
- **Git** provides the safety net for Spec-Kit work — commit specifications, branch per phase, review diffs, and keep specifications and implementation aligned
- **Client communication** improves through specifications — every change goes through the specification process, every deliverable is verified against acceptance criteria
- **The Spec-Kit workflow** transforms freelance delivery from ad-hoc guessing to structured, professional, repeatable execution

## What Comes Next

You have completed the core curriculum of Hanif AI Freelancing Academy. You now understand freelancing fundamentals (Chapters 01-04), AI development tools (Chapters 05-08), and Spec-Driven Development with Spec-Kit (Chapters 09-10).

The learning does not stop here. Your next steps:

- **Apply these skills to real projects**: Start with small freelance projects and apply the full Spec-Kit workflow
- **Build your portfolio**: Use Spec-Kit on portfolio projects to demonstrate professional process
- **Refine your specifications**: The more you write, the better they become
- **Master AI integration**: Practice using AI agents with specifications until it becomes natural
- **Seek feedback**: Share your specifications with experienced developers and improve
- **Take on larger projects**: As your Spec-Kit skills improve, you can handle more complex client work
- **Explore advanced topics**: Look into Spec-Kit Plus, advanced specification patterns, and team-based Spec-Kit workflows

Remember: the best way to learn Spec-Kit is by doing it. Start with a small project, follow the workflow from constitution through delivery, and iterate on your process. Every project makes you better.
