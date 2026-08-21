---
sidebar_position: 1
title: "Chapter 09: What Is Spec-Driven Development?"
---

# Chapter 09: What Is Spec-Driven Development?

## Learning Objectives

By the end of this chapter, you will be able to:

1. Define Spec-Driven Development (SDD) and explain its core principles
2. Explain why specifications matter before implementation
3. Distinguish requirements from specifications, plans, and tasks
4. Identify functional and non-functional requirements
5. Write clear user stories and testable acceptance criteria
6. Trace requirements through implementation and testing
7. Use SDD effectively with AI coding agents
8. Identify weak specifications and improve them
9. Apply an SDD workflow to a realistic freelance project
10. Recognize specification drift and prevent it

## Curriculum Connection

In Chapter 06: What Are AI Coding Agents?, you learned how agents inspect repositories, plan changes, execute multi-step tasks, and iterate based on feedback. In Chapter 07: Git & GitHub for Freelancers, you learned how Git provides the version-control safety net for professional development. In Chapter 08: AI-Assisted vs Agentic Development, you learned when to write code yourself with AI help and when to let an agent handle the task.

All three chapters share a common thread: **the quality of what you build depends on how well you define what needs to be built.** An agent that receives a vague instruction produces vague code. A developer who starts coding without clear requirements builds the wrong thing. A Git history of poorly defined changes is noise, not documentation.

Spec-Driven Development (SDD) provides the structured specification layer between a client's idea and the implementation. It teaches you to capture what the client needs, define how it should work, plan how to build it, and verify that the result matches the original intent.

**Important**: SDD is not paperwork for its own sake. It is the practice that makes AI coding agents more reliable, client communication clearer, estimates more accurate, and delivery more professional.

## Introduction

A freelancer receives a client message: "I need a dashboard for my business."

What happens next determines whether the project succeeds or fails.

**Without SDD**: The freelancer starts coding immediately. After two weeks, the client says, "This is not what I wanted." The freelancer restarts. The project is late. The client is unhappy.

**With SDD**: The freelancer asks clarifying questions, writes requirements, creates a specification, gets client approval, plans the implementation, breaks it into tasks, and only then begins coding. The client sees the specification before work begins. When the freelancer delivers, the client confirms it matches the specification.

Spec-Driven Development is the practice of defining what needs to be built and how it should work before writing any code. It is the difference between building the right thing and building the wrong thing faster.

## What Is Spec-Driven Development?

Spec-Driven Development is a methodology where clear, testable specifications drive the entire development process. Instead of writing code first and figuring out requirements later, you define requirements, create a specification, plan the implementation, and only then begin coding.

### The Core Idea

A specification is the source of truth for a project. It answers three fundamental questions:

1. **What** are we building? (Requirements)
2. **How** should it work? (Specification)
3. **How** will we verify it works? (Acceptance Criteria)

Every decision during implementation traces back to the specification. Every test verifies a requirement. Every client conversation references the approved specification.

### Why Coding-First Workflows Create Problems

When you start coding before defining requirements, several problems emerge:

| Problem | What Happens | Cost |
|---------|-------------|------|
| **Ambiguity** | The client means one thing; you build another | Rework, wasted time |
| **Scope creep** | Without boundaries, features expand endlessly | Budget overruns, missed deadlines |
| **Wrong priorities** | You build features the client does not need | Client dissatisfaction |
| **Difficult testing** | You cannot verify success without clear criteria | Quality issues |
| **Poor AI results** | Vague requirements produce vague AI output | Rework, frustration |
| **Weak estimates** | You cannot estimate work you have not defined | Unreliable timelines |
| **No traceability** | You cannot show how code maps to requirements | Accountability gaps |

### How Specifications Reduce Ambiguity

A specification translates a client's fuzzy idea into a concrete, testable document. Instead of "I need a dashboard," a specification says:

```text
The dashboard displays three key metrics (revenue, users, orders)
updated in real time. Users can filter by date range (last 7 days,
30 days, 90 days, custom). The dashboard loads in under 2 seconds.
It is responsive on mobile and desktop.
```

This eliminates ambiguity. The client reviews the specification. You build against the specification. Both parties verify the result against the specification.

## Why SDD Matters for Freelancers

SDD is not just a technical practice. It directly improves your freelancing business.

| Benefit | How SDD Helps |
|---------|--------------|
| **Client communication** | Specifications give you and the client a shared document to discuss |
| **Scope control** | Clear boundaries prevent features from expanding endlessly |
| **Reduced rework** | Building the right thing the first time saves hours |
| **Predictable delivery** | Defined tasks enable realistic timelines |
| **Better estimates** | Known requirements enable accurate time and cost estimates |
| **Easier testing** | Acceptance criteria define exactly what to test |
| **Easier handoff** | Documentation enables smooth project transitions |
| **Professional reputation** | Structured delivery builds client trust |
| **AI effectiveness** | Clear specifications produce better AI-generated code |
| **Repeatable process** | The same workflow applies to every project |

### The Freelancer's Practical Advantage

Consider two freelancers bidding on the same project:

**Freelancer A**: "I can build that for $2,000. Give me a week."

**Freelancer B**: "I will start by writing a specification based on our discussion. Once you approve it, I will provide a detailed plan with tasks and timeline. Here is a sample specification from a similar project."

Freelancer B communicates professionalism, reduces risk, and builds client confidence. SDD is not just about better code. It is about better business.

## SDD vs Code-First Development

| Dimension | SDD | Code-First |
|-----------|-----|-----------|
| **Starting point** | Requirements and specification | Code editor |
| **Requirements clarity** | Defined before implementation | Discovered during implementation |
| **Client communication** | Structured through specification review | Ad-hoc throughout development |
| **Rework** | Minimal (built against specification) | Frequent (built the wrong thing) |
| **Testing** | Against predefined acceptance criteria | Against vague expectations |
| **Scope control** | Formal boundaries in specification | Informal, often uncontrolled |
| **AI usage** | AI receives clear context and constraints | AI receives vague instructions |
| **Maintainability** | Documentation exists for future work | Code without context |
| **Handoff** | Specification serves as living documentation | New developer must reverse-engineer intent |
| **Risk** | Lower (problems caught early) | Higher (problems found late) |

## The SDD Mental Model

SDD follows a clear pipeline from idea to delivery:

```text
Idea
  |
Requirements
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

### Stage 1: Idea

The initial concept or need. This could be:

- A client request ("I need a booking system")
- A problem to solve ("Customers are abandoning checkout")
- A feature to add ("Add payment processing")
- An improvement to make ("The dashboard is too slow")

**Your job**: Capture the idea clearly. Understand who it is for and why it matters.

### Stage 2: Requirements

Clear, specific statements about what the system must do, how it should perform, and what constraints apply.

**Your job**: Ask questions, identify functional and non-functional requirements, define scope and boundaries.

### Stage 3: Specification

Detailed documentation of how requirements will be met, including user stories, acceptance criteria, technical design, and edge cases.

**Your job**: Translate requirements into a specification document that both you and the client understand.

### Stage 4: Plan

The strategy for implementation, including architecture decisions, component breakdown, data model, and testing strategy.

**Your job**: Derive the plan from the specification. Do not invent implementation details independently.

### Stage 5: Tasks

Specific, actionable work items with clear descriptions, acceptance criteria, dependencies, and estimated effort.

**Your job**: Decompose the plan into tasks small enough to complete in one sitting.

### Stage 6: Implementation

Writing the code according to the plan and specification, using AI tools where appropriate.

**Your job**: Follow the specification. Use AI for efficiency. Write tests as you go.

### Stage 7: Verification

Checking that the implementation matches the specification, all tests pass, and the result meets client expectations.

**Your job**: Test against acceptance criteria, review diffs, verify quality attributes.

### Stage 8: Delivery

Deploying the verified result, documenting what was built, and handing off to the client.

**Your job**: Deliver working software that matches the specification. Provide documentation.

## Requirements vs Specification vs Plan vs Tasks

This distinction is critical. Many beginners confuse these artifacts, leading to poor results.

| Artifact | Purpose | Main Question | Typical Contents | Who Uses It | Example |
|----------|---------|--------------|-----------------|-------------|---------|
| **Requirements** | Define what is needed | What must the system do? | Functional requirements, non-functional requirements, constraints, assumptions | Client, freelancer, testers | "The form must validate email addresses" |
| **Specification** | Define how it works | How should the system behave? | User stories, acceptance criteria, technical design, edge cases | Freelancer, AI agent, testers | "Given a valid email, when submitted, then show success" |
| **Plan** | Define how to build it | What is the implementation strategy? | Architecture, components, data model, APIs, testing strategy | Freelancer, AI agent | "Use Next.js API routes with Prisma" |
| **Tasks** | Define specific work items | What exactly needs to be done? | Descriptions, acceptance criteria, dependencies, estimates | Freelancer, AI agent | "Create contact form component with validation" |

### Why the Distinction Matters

**Requirements** are about the client's needs.
**Specification** is about the system's behavior.
**Plan** is about the technical approach.
**Tasks** are about the work breakdown.

Skipping any stage creates problems. Requirements without a specification are too vague to implement. A specification without a plan leaves implementation decisions to chance. A plan without tasks leaves execution unstructured.

## Requirements Engineering Fundamentals

Requirements engineering is the practice of identifying, documenting, and managing what a system must do.

### Functional Requirements

Functional requirements describe what the system does. They define specific behaviors, interactions, and outputs.

| Type | Description | Example |
|------|-------------|---------|
| **Business rules** | Rules the system enforces | "Orders over $50 get free shipping" |
| **Data processing** | How data is transformed | "Convert uploaded CSV to JSON" |
| **User interactions** | What users can do | "Users can search products by category" |
| **System behavior** | How the system responds | "Send email confirmation after purchase" |
| **Integration** | How systems connect | "Sync inventory with Shopify API" |

### Non-Functional Requirements

Non-functional requirements describe how the system performs. They define quality attributes.

| Attribute | Description | Example |
|-----------|-------------|---------|
| **Performance** | Speed and responsiveness | "Dashboard loads in under 2 seconds" |
| **Security** | Protection against threats | "Passwords are hashed with bcrypt" |
| **Accessibility** | Usability for all users | "All forms are keyboard-navigable" |
| **Reliability** | Uptime and fault tolerance | "System uptime is 99.9%" |
| **Scalability** | Ability to handle growth | "Support 10,000 concurrent users" |
| **Usability** | Ease of use | "New users can complete checkout in 3 clicks" |
| **Compatibility** | Works across environments | "Functions on Chrome, Firefox, Safari, and Edge" |

### Constraints

Constraints are limitations or boundaries that affect implementation.

- **Technology constraints**: "Must use the client's existing WordPress installation"
- **Budget constraints**: "Total budget is $3,000"
- **Timeline constraints**: "Must launch before Black Friday"
- **Regulatory constraints**: "Must comply with GDPR"
- **Resource constraints**: "Solo developer, no team"

### Assumptions

Assumptions are things you believe to be true but have not verified. They must be documented and confirmed.

- "The client's hosting supports Node.js 18"
- "The client has a Stripe account ready"
- "The existing database schema supports the required fields"

### Dependencies

Dependencies are things that must exist or happen for your work to proceed.

- "The client must provide brand guidelines before design begins"
- "The API endpoint must be available before integration"
- "The database migration must be approved before implementation"

### Edge Cases

Edge cases are unusual situations the system must handle.

- What happens when a user submits an empty form?
- What happens when the API returns an error?
- What happens when two users edit the same record simultaneously?
- What happens when a file upload exceeds the size limit?

### Out-of-Scope Items

Defining what is NOT in scope is as important as defining what is. Out-of-scope items prevent scope creep.

- "Phase 1 does not include mobile app development"
- "Analytics dashboard is out of scope for this project"
- "Multi-language support is not included"

## Writing Good Requirements

Good requirements are the foundation of effective SDD. Poor requirements lead to poor specifications, which lead to poor implementations.

### Quality Attributes of Good Requirements

| Attribute | What It Means | Why It Matters |
|-----------|--------------|---------------|
| **Clear** | Unambiguous, easy to understand | Everyone interprets it the same way |
| **Specific** | Precise and detailed | No room for guesswork |
| **Testable** | Can be verified objectively | You can confirm it works |
| **Atomic** | Single, focused statement | Easy to track and test |
| **Consistent** | Does not contradict other requirements | No conflicting expectations |
| **Feasible** | Achievable within constraints | Realistic and implementable |
| **Traceable** | Can be linked to implementation | You can show which code fulfills it |

### Weak vs Strong Requirements

| Weak | Strong |
|------|--------|
| "Make it fast" | "The page loads in under 2 seconds on a 3G connection" |
| "It should be secure" | "Passwords are hashed with bcrypt (12 rounds). Sessions expire after 30 minutes of inactivity." |
| "Add a search feature" | "Users can search products by name, category, or price range. Results appear within 500ms." |
| "Make it user-friendly" | "Users can complete checkout in 3 clicks from the product page" |
| "It should work on mobile" | "All pages are responsive and functional on screens from 320px to 2560px wide" |

## User Stories

User stories describe a feature from the user's perspective. They capture who needs the feature, what they need, and why.

### Format

```text
As a [role],
I want [capability],
So that [benefit].
```

### Examples

| Role | Capability | Benefit |
|------|-----------|---------|
| As a **customer**, | I want to **search products by category**, | So that I can **quickly find what I need**. |
| As an **admin**, | I want to **view all orders in a dashboard**, | So that I can **track business performance**. |
| As a **new user**, | I want to **sign up with my Google account**, | So that I can **start using the app without creating a new password**. |
| As a **returning customer**, | I want to **save my shipping address**, | So that I can **check out faster next time**. |
| As a **seller**, | I want to **set different prices for different quantities**, | So that I can **offer bulk discounts**. |

### What Makes a Good User Story

- **Independent**: Can be implemented without depending on other stories
- **Negotiable**: The details can be discussed and refined
- **Valuable**: Delivers clear value to the user
- **Estimable**: The team can estimate the effort required
- **Small**: Can be completed in a single iteration
- **Testable**: Can be verified with acceptance criteria

This is often called the INVEST criteria.

### User Story vs Requirement

| Aspect | User Story | Requirement |
|--------|-----------|------------|
| **Perspective** | User-focused | System-focused |
| **Language** | Natural language, conversational | Formal, precise |
| **Detail** | High-level, negotiable | Detailed, specific |
| **Purpose** | Capture intent and value | Define exact behavior |
| **Example** | "As a user, I want to reset my password" | "The system sends a password reset email within 30 seconds of request" |

User stories and requirements work together. User stories capture the intent. Requirements define the exact behavior.

## Acceptance Criteria and Acceptance Scenarios

Acceptance criteria define how to verify that a requirement or user story is implemented correctly. They are the bridge between requirements and testing.

### What Acceptance Criteria Are

Acceptance criteria are specific, testable conditions that must be true for the feature to be considered complete. They answer: "How do I know this is done?"

### Given/When/Then Format

The Given/When/Then format (also called Gherkin syntax) provides a structured way to write acceptance scenarios:

```text
Given [initial context],
When [action or event],
Then [expected outcome].
```

### Examples

**Contact Form**:

```text
Given the user is on the contact page,
When they fill in name, email, and message and click Submit,
Then they see a "Message sent" confirmation.

Given the user submits an empty form,
When they click Submit,
Then they see validation errors for all required fields.

Given the user submits an invalid email address,
When they click Submit,
Then they see "Please enter a valid email address."
```

**Login**:

```text
Given the user is on the login page,
When they enter a valid email and password and click Login,
Then they are redirected to the dashboard.

Given the user enters an incorrect password,
When they click Login,
Then they see "Invalid email or password."

Given the user is logged in,
When 30 minutes pass without activity,
Then their session expires and they must log in again.
```

### Acceptance Criteria vs Requirements

| Aspect | Requirement | Acceptance Criteria |
|--------|-----------|-------------------|
| **Scope** | What the system must do | How to verify it works |
| **Level** | Feature or capability | Specific test scenarios |
| **Audience** | Client and developer | Developer and tester |
| **Format** | Declarative statement | Testable scenario |

## Functional vs Non-Functional Requirements: Detailed Examples

### Functional Requirements Examples

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Users can create an account with email and password | Must have |
| FR-02 | Users can log in with email and password | Must have |
| FR-03 | Users can reset their password via email link | Must have |
| FR-04 | Users can view their order history | Must have |
| FR-05 | Users can search products by name | Should have |
| FR-06 | Users can filter products by category | Should have |
| FR-07 | Admins can view all orders in a dashboard | Must have |
| FR-08 | Admins can export orders as CSV | Could have |

### Non-Functional Requirements Examples

| ID | Category | Requirement | Target |
|----|----------|-------------|--------|
| NFR-01 | Performance | Page load time | Under 2 seconds |
| NFR-02 | Security | Password hashing | bcrypt, 12 rounds |
| NFR-03 | Accessibility | Keyboard navigation | All interactive elements accessible |
| NFR-04 | Reliability | Uptime | 99.9% |
| NFR-05 | Scalability | Concurrent users | Support 1,000 |
| NFR-06 | Usability | Checkout flow | 3 clicks or fewer |
| NFR-07 | Compatibility | Browser support | Chrome, Firefox, Safari, Edge |

## Scope and Boundaries

Defining scope is one of the most important skills for freelancers. Without clear boundaries, projects expand endlessly.

### In Scope

Clearly state what the project includes:

```text
IN SCOPE:
- User registration and login (email/password)
- Product listing with search and filter
- Shopping cart and checkout
- Payment processing via Stripe
- Order confirmation emails
- Admin dashboard for order management
- Responsive design (mobile and desktop)
```

### Out of Scope

Clearly state what the project does NOT include:

```text
OUT OF SCOPE:
- Mobile app development
- Multi-language support
- Advanced analytics
- Inventory management
- Shipping integration
- Subscription billing
- Social media integration
```

### Assumptions

```text
ASSUMPTIONS:
- Client has an active Stripe account
- Client's hosting supports Node.js 18 and PostgreSQL
- Client will provide product data in CSV format
- Client will review and approve each deliverable
```

### Constraints

```text
CONSTRAINTS:
- Budget: $5,000
- Timeline: 6 weeks
- Technology: Next.js, Prisma, PostgreSQL, Tailwind CSS
- Compliance: GDPR
- Deployment: Vercel
```

### Why Scope Protection Matters

Scope creep is the gradual expansion of project requirements beyond the original agreement. It is the most common cause of freelance project failure.

| Without Scope | With Scope |
|--------------|-----------|
| "Can you also add analytics?" | "Analytics is out of scope. I can provide a quote for that as a separate phase." |
| "Just one more small feature" | "That is a new requirement. Let me update the specification and provide a revised estimate." |
| "The client keeps adding things" | "Changes are managed through the specification. Each change is documented and estimated." |

## The Specification Document

A specification document is the central artifact of SDD. It captures everything needed to implement and verify a feature.

### Professional Specification Structure

```text
# Feature Specification: [Feature Name]

## Problem Statement
What problem does this feature solve and for whom?

## Goals
What are we trying to achieve?

## User Stories
Who needs this feature and why?

## Requirements
What must the system do?

## Acceptance Criteria
How do we verify the feature works?

## Constraints
What limitations apply?

## Assumptions
What do we believe to be true?

## Dependencies
What must exist or happen first?

## Edge Cases
What unusual situations must we handle?

## Out of Scope
What are we explicitly NOT building?

## Success Criteria
How will we measure whether this feature succeeded?
```

### Reusable Template

```text
# Specification: [Feature Name]

## Problem Statement
[Describe the problem this feature solves]

## Goals
- [Goal 1]
- [Goal 2]

## User Stories

### Story 1: [Title]
As a [role],
I want [capability],
So that [benefit].

**Acceptance Criteria:**
- Given [context], When [action], Then [result]
- Given [context], When [action], Then [result]

### Story 2: [Title]
As a [role],
I want [capability],
So that [benefit].

**Acceptance Criteria:**
- Given [context], When [action], Then [result]

## Functional Requirements
- FR-01: [Requirement]
- FR-02: [Requirement]

## Non-Functional Requirements
- NFR-01: [Requirement]
- NFR-02: [Requirement]

## Constraints
- [Constraint 1]
- [Constraint 2]

## Assumptions
- [Assumption 1]

## Dependencies
- [Dependency 1]

## Edge Cases
- [Edge case 1]

## Out of Scope
- [Item 1]

## Success Criteria
- [Metric 1]
- [Metric 2]
```

## From Specification to Plan

The specification tells you what to build. The plan tells you how to build it. The plan should be derived from the specification, not invented independently.

### Specification to Plan Mapping

| Specification Element | Plan Element |
|----------------------|-------------|
| User stories | Component architecture |
| Functional requirements | API design and data model |
| Non-functional requirements | Performance and security strategy |
| Constraints | Technology choices |
| Dependencies | Integration points |
| Edge cases | Error handling strategy |
| Acceptance criteria | Testing strategy |

### Example: Contact Form

**Specification says**: "Users can submit a contact form with name, email, and message. Form validates inputs and sends an email notification."

**Plan says**:

```text
Architecture:
- React component (ContactForm.tsx) with controlled inputs
- Form validation using zod schema
- API route (api/contact/route.ts) for server-side processing
- Email service integration (Resend API)
- Environment variable for API key

Components:
- ContactForm (form component)
- FormField (reusable input component)
- FormValidation (zod schema)

Data Flow:
1. User fills form
2. Client-side validation (zod)
3. POST to /api/contact
4. Server-side validation
5. Spam check (honeypot)
6. Send email via Resend
7. Return success/error response

Testing Strategy:
- Unit tests for validation schema
- Integration tests for API route
- Manual testing of form submission
- Email delivery verification
```

## From Plan to Tasks

Tasks are the smallest units of work. Each task should be completable in one sitting and produce a verifiable result.

### Bad Tasks vs Good Tasks

| Bad Task | Why It Is Bad | Good Task |
|----------|--------------|-----------|
| "Build the dashboard" | Too large, unclear scope | "Create DashboardPage component with stats cards displaying revenue, users, and orders" |
| "Add authentication" | Massive scope | "Create login form component with email and password fields, validation, and submit handler" |
| "Write tests" | No scope or location | "Write unit tests for validateEmail function covering valid email, empty string, and invalid format" |
| "Fix the bug" | Which bug? | "Fix the 500 error in /api/contact caused by missing input validation" |
| "Make it responsive" | Which component? | "Update Header.tsx to collapse navigation into a hamburger menu on screens under 768px" |

### Task Sizing

| Task Size | Duration | Example |
|-----------|----------|---------|
| **Tiny** | 15-30 minutes | "Add a loading spinner to the form submit button" |
| **Small** | 1-2 hours | "Create the ContactForm component with validation" |
| **Medium** | 3-5 hours | "Implement the contact form API route with email integration" |
| **Large** | 1-2 days | "Build the complete user registration flow with email verification" |
| **Too large** | 3+ days | "Build the admin dashboard" (break this down) |

### Task Dependencies

Some tasks depend on others. Identify dependencies before starting work:

```text
Task 1: Create database schema (no dependencies)
Task 2: Create API routes (depends on Task 1)
Task 3: Create form components (no dependencies)
Task 4: Connect form to API (depends on Task 2 and Task 3)
Task 5: Write integration tests (depends on Task 4)
Task 6: Deploy to staging (depends on Task 5)
```

## Traceability

Traceability is the ability to trace from a requirement through specification, tasks, code, and tests. It ensures nothing is missed and everything can be verified.

### The Traceability Chain

```text
Requirement → Specification → Task → Code → Test

FR-01: "Users can register"
  ↓
User Story: "As a new user, I want to create an account so I can access the platform"
  ↓
Acceptance Criteria: "Given valid email and password, when submitted, then account is created and confirmation email is sent"
  ↓
Task: "Create registration form and API route"
  ↓
Code: src/components/RegisterForm.tsx, src/app/api/register/route.ts
  ↓
Test: src/__tests__/register.test.ts
```

### Traceability Matrix Example

| Requirement | User Story | Acceptance Criteria | Task | Code | Test |
|-------------|-----------|--------------------|----|------|----|
| FR-01: User registration | US-01: Create account | AC-01: Valid email creates account | Task-01 | RegisterForm.tsx | register.test.ts |
| FR-02: User login | US-02: Log in | AC-02: Valid credentials redirect to dashboard | Task-02 | LoginForm.tsx | login.test.ts |
| FR-03: Password reset | US-03: Reset password | AC-03: Reset link sent within 30 seconds | Task-03 | ResetForm.tsx | reset.test.ts |

### Why Traceability Matters

- **Nothing falls through the cracks**: Every requirement maps to code and tests
- **Change management**: When a requirement changes, you know exactly what code and tests to update
- **Client confidence**: You can show the client exactly how each requirement was implemented
- **AI verification**: You can verify AI-generated code against the specification

## SDD and AI Coding Agents

This is where SDD becomes especially powerful for modern freelancers. AI coding agents work dramatically better when they receive clear specifications.

### Why AI Agents Benefit from Specifications

| Without Specification | With Specification |
|----------------------|-------------------|
| Agent guesses at requirements | Agent implements exact requirements |
| Agent makes wrong assumptions | Agent follows defined behavior |
| Agent overengineers | Agent builds only what is specified |
| Agent misses edge cases | Agent handles defined edge cases |
| Hard to verify output | Output verified against acceptance criteria |
| Vague prompts, vague results | Detailed context, precise results |

### The SDD + AI Agent Workflow

```text
1. You write the specification (human)
2. You review and approve the specification (human)
3. You give the specification to the AI agent (human → agent)
4. The agent inspects the repository (agent)
5. The agent plans the implementation (agent)
6. You review the agent's plan (human)
7. The agent implements the code (agent)
8. The agent runs tests (agent)
9. You review the git diff (human)
10. You verify against acceptance criteria (human)
11. You commit the changes (human)
12. You deploy (human)
```

### What to Give the Agent

A specification gives the agent everything it needs:

| Specification Element | What the Agent Gets |
|----------------------|-------------------|
| Problem statement | Understanding of the goal |
| User stories | User perspective and motivation |
| Requirements | Exact behaviors to implement |
| Acceptance criteria | Testable conditions to satisfy |
| Constraints | Boundaries and limitations |
| Edge cases | Scenarios to handle |
| Out of scope | What NOT to build |

### What the Agent Cannot Do Without a Specification

- **Understand what the client wants**: The agent does not know your client's business
- **Make priority decisions**: The agent does not know what matters most
- **Define scope boundaries**: The agent does not know where to stop
- **Verify business correctness**: The agent can verify code works, not whether it solves the right problem
- **Communicate with the client**: The agent cannot translate fuzzy ideas into concrete requirements

## Prompting an AI Agent from a Specification

The specification transforms how you interact with AI agents.

### Weak vs Strong Agent Prompts

| Category | Weak Prompt | Strong Prompt |
|----------|------------|---------------|
| **Feature** | "Build a dashboard" | "Implement the admin dashboard per the specification in docs/specs/dashboard.md. The dashboard displays revenue, users, and orders. Use GET /api/stats. Follow the existing page layout in src/app/page.tsx. Include loading and error states." |
| **Bug fix** | "Fix the login" | "The login form in LoginForm.tsx returns a 400 error for emails with plus signs. Inspect the validation logic in src/lib/validate.ts, fix the regex, and run npm test." |
| **Test** | "Write tests" | "Write unit tests for the registration flow per the acceptance criteria in the specification. Cover: valid registration, duplicate email, weak password, and missing required fields. Use Vitest." |
| **Refactor** | "Clean up the code" | "Refactor src/utils/helpers.ts per the specification's technical design section. Extract date functions into src/utils/date.ts. Update all imports. Do not change function signatures." |
| **Integration** | "Connect to Stripe" | "Implement Stripe payment integration per the specification. Create src/lib/stripe.ts following the API client pattern in src/lib/api.ts. Include TypeScript types for all request/response objects." |
| **UI** | "Make it responsive" | "Update the dashboard layout per the specification's responsive design requirements. Use Tailwind breakpoints from tailwind.config.ts. Test at 320px, 768px, and 1280px widths." |

### Why the Strong Version Is Better

- **Context**: The agent knows the specification exists and where to find it
- **Scope**: The agent knows exactly what to build and what not to build
- **Verification**: The agent knows the acceptance criteria to satisfy
- **Constraints**: The agent knows the boundaries and limitations
- **Patterns**: The agent knows the existing code to follow

## Human-in-the-Loop SDD

Specifications do NOT remove human responsibility. They make human oversight more structured and effective.

### Approval Points

| Stage | What You Approve | Why It Matters |
|-------|-----------------|---------------|
| **Requirements** | That the requirements capture the client's needs | Wrong requirements mean building the wrong thing |
| **Specification** | That the specification is complete and correct | The specification is the source of truth |
| **Plan** | That the technical approach is sound | Architecture decisions affect maintainability |
| **Task breakdown** | That tasks are well-defined and properly ordered | Bad tasks lead to wasted effort |
| **Implementation** | That code matches the specification | AI agents can produce plausible but incorrect code |
| **Testing** | That tests verify acceptance criteria | Tests without acceptance criteria test the wrong things |
| **Delivery** | That the result meets client expectations | Client satisfaction is the ultimate measure |

### The Human's Unique Responsibilities

- **Understanding the client**: Only you know what the client really needs
- **Making judgment calls**: Architecture, priority, and tradeoff decisions require human judgment
- **Verifying business correctness**: Code can work correctly but solve the wrong problem
- **Communicating with the client**: Clients need a person, not a tool
- **Taking accountability**: You are responsible for the quality of what you deliver

## SDD + Git

SDD and Git work together to create a professional, traceable development process.

### The Professional Workflow

```text
1. Write specification
2. Commit specification (git add, git commit)
3. Create feature branch (git switch -c)
4. Implement against specification
5. Review git diff against specification
6. Run tests against acceptance criteria
7. Commit implementation (git add, git commit)
8. Push branch (git push)
9. Create pull request referencing specification
10. Review and merge
```

### Commit Messages That Reference Specifications

```bash
git commit -m "Add contact form specification"
git commit -m "Implement contact form per spec: validation, email, spam protection"
git commit -m "Add unit tests for contact form acceptance criteria"
git commit -m "Fix email validation edge case from spec AC-03"
```

### Why Git Is Important for SDD

- **Specification history**: You can see how the specification evolved
- **Implementation traceability**: Commit messages reference the specification
- **Rollback safety**: If implementation diverges from specification, you can revert
- **Branch isolation**: Each feature's specification and implementation live on the same branch

## Handling Specification Changes

Client requirements change. How you handle changes determines whether the project stays on track.

### The Change Request Process

```text
1. Client requests a change
2. You document the change request
3. You analyze the impact (what is affected?)
4. You update the specification
5. You update the plan and tasks
6. You estimate the additional effort
7. You discuss the impact with the client (timeline, cost)
8. You implement the change
9. You retest against the updated specification
10. You document the change
```

### Why Changing Code Without Updating the Specification Creates Drift

| What Happens | Why It Is a Problem |
|-------------|-------------------|
| Code changes but spec does not | The spec no longer reflects reality |
| Spec changes but code does not | The spec promises what code does not deliver |
| Tests do not update | Tests verify old requirements, not new ones |
| Documentation is stale | New developers follow outdated information |

**The rule**: Every code change should be preceded by a specification change. Every specification change should be followed by a code change. Keep them in sync.

## Specification Drift

Specification drift is the gradual divergence between what the specification says and what the code actually does.

### Examples of Specification Drift

| Drift Type | What Happens | Consequence |
|-----------|-------------|-------------|
| **Code ahead of spec** | Developer adds features not in the specification | Undocumented behavior, unclear expectations |
| **Spec ahead of code** | Specification promises features not yet implemented | Spec is unreliable, trust breaks down |
| **Test drift** | Tests pass but do not verify current requirements | False confidence, missed bugs |
| **Documentation drift** | Documentation describes old behavior | New team members confused |

### Prevention

- **Review the specification before starting work**: Make sure you are building what is specified
- **Update the specification when requirements change**: Never change code without updating the spec
- **Run acceptance criteria as tests**: Automated verification catches drift early
- **Regular specification reviews**: Compare spec to implementation periodically

### Recovery

When you discover drift:

1. Document the current state of the code
2. Update the specification to match reality
3. Identify any requirements that were missed
4. Create tasks to address gaps
5. Update tests to match the current specification

## Quality Attributes of a Good Specification

| Attribute | What It Means | How to Check |
|-----------|--------------|-------------|
| **Clear** | Easy to understand, no ambiguity | Can someone else read it and build the same thing? |
| **Complete** | Covers all requirements | Are there any scenarios not addressed? |
| **Consistent** | No contradictions | Do any requirements conflict with each other? |
| **Testable** | Every requirement has acceptance criteria | Can each requirement be verified? |
| **Traceable** | Requirements link to tasks and code | Can you trace from requirement to implementation? |
| **Feasible** | Achievable within constraints | Can it be built with the available resources? |
| **Maintainable** | Easy to update as requirements change | Is the structure clear and organized? |
| **Understandable** | Clear language, no jargon | Can a non-technical person understand the user stories? |
| **Appropriately detailed** | Enough detail to implement, not so much it becomes a burden | Is the level of detail proportional to the project size? |

## Common SDD Failure Modes

Understanding how SDD fails helps you use it more effectively.

### 1. Vague Requirements

**Problem**: Requirements like "make it user-friendly" or "add a search feature."
**Why it happens**: The developer assumes the client and developer share the same mental model.
**Impact**: Ambiguity leads to building the wrong thing.
**Better approach**: Write specific, testable requirements with measurable criteria.

### 2. Over-Specification

**Problem**: Writing a 50-page specification for a simple contact form.
**Why it happens**: The developer tries to anticipate every possible scenario.
**Impact**: Wasted time, delayed projects, specifications that nobody reads.
**Better approach**: Match the level of detail to the project size and risk.

### 3. Under-Specification

**Problem**: A one-paragraph specification for a complex feature.
**Why it happens**: The developer wants to start coding immediately.
**Impact**: Missing requirements, scope creep, rework.
**Better approach**: Ensure the specification covers all user stories, acceptance criteria, and edge cases.

### 4. Missing Acceptance Criteria

**Problem**: Requirements without clear verification criteria.
**Why it happens**: The developer does not think about testing during specification.
**Impact**: Cannot verify the implementation is correct. "Done" is subjective.
**Better approach**: Every requirement must have at least one testable acceptance criterion.

### 5. Ignoring Edge Cases

**Problem**: Only specifying the "happy path" without error scenarios.
**Why it happens**: The developer focuses on the ideal flow.
**Impact**: Error handling is missing, crashes in production.
**Better approach**: For every user story, ask "what could go wrong?"

### 6. No Out-of-Scope Definition

**Problem**: The specification does not say what is NOT being built.
**Why it happens**: The developer assumes everything is implied.
**Impact**: Scope creep, client expects more than is delivered.
**Better approach**: Explicitly list out-of-scope items in the specification.

### 7. Writing Implementation Details Too Early

**Problem**: The specification says "use React with Redux" before requirements are defined.
**Why it happens**: The developer jumps to technical decisions.
**Impact**: Technology choices constrain requirement options.
**Better approach**: Define WHAT before HOW. Technology decisions belong in the plan, not the specification.

### 8. Failing to Update Specifications

**Problem**: Requirements change but the specification is not updated.
**Why it happens**: The developer is in a hurry or forgets.
**Impact**: Specification drift, code and spec diverge.
**Better approach**: Treat the specification as a living document. Every change goes through the specification first.

### 9. AI Generating Code Before Understanding the Spec

**Problem**: Giving an agent a task without providing the specification.
**Why it happens**: The developer trusts the agent to figure it out.
**Impact**: Agent makes wrong assumptions, produces code that does not match requirements.
**Better approach**: Always provide the specification as context before the agent begins.

### 10. Trusting AI Interpretation Without Review

**Problem**: Accepting AI-generated implementation without checking against the specification.
**Why it happens**: The developer assumes the AI understood the specification.
**Impact**: Subtle mismatches between spec and implementation.
**Better approach**: Review every AI change against the specification. Verify acceptance criteria.

### 11. No Traceability

**Problem**: No way to trace from requirement to code to test.
**Why it happens**: The developer does not see the value.
**Impact**: Cannot verify completeness, difficult to manage changes.
**Better approach**: Maintain a traceability matrix linking requirements to implementation.

### 12. No Verification

**Problem**: The specification exists but is never checked during implementation.
**Why it happens**: The developer treats the specification as a document to create, not a tool to use.
**Impact**: Specification becomes decoration, not a working tool.
**Better approach**: Use the specification actively throughout implementation. Verify every deliverable against it.

## Freelance Use Cases

Here is how SDD applies to common freelance scenarios.

| Scenario | Where SDD Helps | Key Specification Elements |
|----------|----------------|--------------------------|
| **Client dashboard** | Defines what metrics to display, how to filter, and performance targets | User stories for each metric view, acceptance criteria for load time |
| **Contact form** | Specifies fields, validation, email integration, and spam protection | User stories for submission flow, acceptance scenarios for each validation rule |
| **Booking system** | Defines availability rules, booking flow, confirmation, and cancellation | User stories for each user role, acceptance criteria for booking states |
| **Property rental platform** | Specifies listing creation, search, filtering, and booking workflow | User stories for renters and landlords, acceptance criteria for search results |
| **E-commerce feature** | Defines product display, cart, checkout, and payment flow | User stories for each step, acceptance criteria for payment success/failure |
| **Authentication** | Specifies login, registration, password reset, and session management | User stories for each auth flow, acceptance criteria for security requirements |
| **Admin panel** | Defines what admins can see and do, permissions and access control | User stories for admin actions, acceptance criteria for each permission level |
| **Payment workflow** | Defines pricing, checkout, refunds, and receipt generation | User stories for payment flows, acceptance criteria for error handling |
| **API integration** | Specifies endpoints, data mapping, error handling, and retry logic | User stories for each integration point, acceptance criteria for error scenarios |
| **WordPress customization** | Specifies theme changes, plugin requirements, and content structure | User stories for each page type, acceptance criteria for responsive behavior |
| **SaaS feature** | Defines user roles, feature access, pricing tiers, and usage limits | User stories for each role, acceptance criteria for access control |
| **AI-powered feature** | Specifies AI behavior, fallbacks, accuracy targets, and user experience | User stories for AI interactions, acceptance criteria for response quality |

## Freelance Case Study

### Client Request

> "Build a property rental admin panel."

### Step-by-Step Workflow

**Step 1: Client Request**

The client needs an admin panel to manage rental properties, bookings, and tenant inquiries.

**Step 2: Discovery**

You ask clarifying questions:
- How many properties do you manage?
- What information do you need to see for each property?
- What booking information is important?
- How do you currently manage tenant inquiries?
- What is your technology stack?
- Do you have hosting set up?

**Step 3: Clarification**

Client responds:
- 15-20 properties
- Need to see property details, availability, pricing, and photos
- Bookings with check-in/check-out dates, tenant info, payment status
- Inquiries come via email; want them in one place
- Using Next.js and PostgreSQL
- Deployed on Vercel

**Step 4: Scope**

```text
IN SCOPE:
- Property listing management (CRUD)
- Booking dashboard with status tracking
- Tenant inquiry management
- Availability calendar view
- Dashboard overview with key metrics

OUT OF SCOPE:
- Payment processing (already handled by Stripe)
- Mobile app
- Tenant-facing portal
- Multi-language support
```

**Step 5: Requirements**

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Admin can view all properties in a list | Must have |
| FR-02 | Admin can add, edit, and delete properties | Must have |
| FR-03 | Admin can view booking details for each property | Must have |
| FR-04 | Admin can update booking status (confirmed, cancelled, completed) | Must have |
| FR-05 | Admin can view tenant inquiries in a unified inbox | Must have |
| FR-06 | Admin can reply to inquiries from the panel | Should have |
| FR-07 | Admin can view availability calendar | Should have |
| FR-08 | Dashboard shows key metrics (occupancy rate, revenue, pending bookings) | Must have |
| NFR-01 | Dashboard loads in under 2 seconds | Must have |
| NFR-02 | Responsive design (mobile and desktop) | Must have |
| NFR-03 | Accessible (keyboard navigation) | Should have |

**Step 6: User Stories**

```text
US-01: As an admin, I want to see all my properties in a list,
       So that I can quickly find and manage any property.

US-02: As an admin, I want to add a new property with details and photos,
       So that I can list new rentals.

US-03: As an admin, I want to see upcoming bookings for each property,
       So that I can plan maintenance and availability.

US-04: As an admin, I want to update booking status,
       So that I can track which bookings are active, completed, or cancelled.

US-05: As an admin, I want to see tenant inquiries in one place,
       So that I don't miss any messages.

US-06: As an admin, I want to see a dashboard with key metrics,
       So that I can understand my business performance at a glance.
```

**Step 7: Acceptance Criteria**

```text
US-01 Acceptance Criteria:
- Given admin is on the properties page,
  When the page loads,
  Then all properties are displayed in a table with name, location, price, and status.

- Given admin clicks a property row,
  When the row is clicked,
  Then the property detail view opens.

- Given admin has 20 properties,
  When the properties page loads,
  Then the list loads in under 2 seconds.

US-02 Acceptance Criteria:
- Given admin clicks "Add Property",
  When the form opens,
  Then fields for name, location, description, price, and photos are displayed.

- Given admin fills in all required fields and clicks Save,
  When the form is submitted,
  Then the property is created and appears in the property list.

- Given admin leaves required fields empty and clicks Save,
  When the form is submitted,
  Then validation errors are shown for all required fields.
```

**Step 8: Constraints**

```text
CONSTRAINTS:
- Technology: Next.js, Prisma, PostgreSQL, Tailwind CSS
- Deployment: Vercel
- Timeline: 3 weeks
- Budget: $3,000
- Must use existing Prisma schema patterns
- Must follow existing project structure
```

**Step 9: Specification**

You compile all the above into a specification document and share it with the client for approval.

**Step 10: Client Approval**

The client reviews the specification. They request two changes:
- Add "last updated" timestamp to property details
- Change booking status options from 3 to 5 (add "pending" and "in progress")

You update the specification. Client approves.

**Step 11: Technical Plan**

```text
Architecture:
- Pages: /admin (dashboard), /admin/properties (list), /admin/properties/[id] (detail),
         /admin/bookings, /admin/inquiries
- Components: PropertyTable, PropertyForm, BookingCard, InquiryList, DashboardStats
- API routes: /api/properties, /api/bookings, /api/inquiries, /api/stats
- Data: Prisma models for Property, Booking, Inquiry

Data Model Additions:
- Property: name, location, description, price, photos, status, updatedAt
- Booking: propertyId, tenantName, checkIn, checkOut, status, createdAt
- Inquiry: propertyId, tenantName, email, message, status, createdAt
```

**Step 12: Task Breakdown**

| Task | Dependencies | Estimate |
|------|-------------|----------|
| Create Prisma migration for new fields | None | 1 hour |
| Create Property model and API routes | Task 1 | 2 hours |
| Create PropertyTable component | Task 2 | 2 hours |
| Create PropertyForm component | Task 2 | 2 hours |
| Create BookingCard component | Task 1 | 1.5 hours |
| Create InquiryList component | Task 1 | 1.5 hours |
| Create DashboardStats component | Task 1 | 2 hours |
| Create property detail page | Task 2 | 1.5 hours |
| Create bookings page | Task 5 | 2 hours |
| Create inquiries page | Task 6 | 1.5 hours |
| Connect components to API routes | Task 3-6 | 2 hours |
| Write unit tests | Task 12 | 3 hours |
| Deploy to staging and test | Task 13 | 2 hours |

**Step 13: AI Agent Instructions**

You give the AI agent a clear task:

```text
Implement the property listing management per the specification
in docs/specs/admin-panel.md.

Create:
1. Prisma migration to add updatedAt to Property model
2. Property CRUD API routes at src/app/api/properties/route.ts
3. PropertyTable component at src/components/admin/PropertyTable.tsx
4. PropertyForm component at src/components/admin/PropertyForm.tsx

Follow the existing patterns in:
- src/app/api/ (API route patterns)
- src/components/ (component patterns)
- src/lib/prisma.ts (database client)

Acceptance criteria from specification US-01 and US-02.
Run npm test and npm run typecheck after changes.
```

**Step 14: Implementation**

The agent implements the specified features, runs tests, and reports results.

**Step 15: Testing**

You verify:
- All acceptance criteria from the specification are met
- Tests pass for the implemented features
- The UI matches the expected behavior
- Performance targets are met

**Step 16: Specification Verification**

You compare the implementation against the specification:

| Requirement | Status |
|-------------|--------|
| FR-01: Property list | Implemented |
| FR-02: CRUD operations | Implemented |
| FR-03: Booking details | Not yet (next sprint) |
| FR-08: Dashboard metrics | Implemented |
| NFR-01: Load under 2 seconds | Verified (1.4s) |
| NFR-02: Responsive | Verified |

**Step 17: Change Request Handling**

The client asks to add a "property photos" upload feature. You:
1. Document the change request
2. Analyze the impact (new API route, new component, storage requirements)
3. Update the specification
4. Provide an estimate ($500, 2 days)
5. Client approves
6. Implement and verify

**Step 18: Final QA**

- All specified features implemented and tested
- All acceptance criteria verified
- Security review complete
- Performance targets met
- Documentation updated

**Step 19: Delivery**

- Deploy to production
- Provide admin panel access to client
- Share specification document as living documentation
- Explain how to use the panel

**Step 20: Handoff**

- README with setup instructions
- Environment variable documentation
- Specification as ongoing reference
- Contact information for future changes

### Summary

| Phase | AI Role | Human Role |
|-------|---------|-----------|
| Discovery | None | Client communication, requirement gathering |
| Specification | AI-assisted (draft generation) | Requirement definition, client approval |
| Planning | AI-assisted (architecture discussion) | Technical decisions, plan approval |
| Task breakdown | AI-assisted (task generation) | Task verification, dependency identification |
| Implementation | Agentic (code generation) | Specification verification, diff review |
| Testing | Agent runs tests | Acceptance criteria verification, manual testing |
| Review | None | Specification compliance, security, quality |
| Delivery | None | Deployment, client handoff |

## Before/After Examples

| Category | Weak Approach | Professional Approach |
|----------|-------------|---------------------|
| **Vague feature** | "Add a search feature" | "Implement product search with text matching, category filter, and price range filter. Results appear within 500ms. Search supports partial matching and is case-insensitive." |
| **Login** | "Make a login page" | "Implement email/password login with form validation, error messages for invalid credentials, session management with 30-minute timeout, and password reset flow." |
| **Dashboard** | "Build a dashboard" | "Create admin dashboard displaying revenue, users, and orders with date range filter (7d, 30d, 90d, custom). Dashboard loads in under 2 seconds. Responsive on mobile." |
| **API** | "Connect to the API" | "Create API client in src/lib/api.ts for GET /api/products. Handle errors with retry logic (3 attempts, exponential backoff). Return typed responses using Product type." |
| **Payment** | "Add payments" | "Integrate Stripe checkout for one-time purchases. Handle success and failure states. Send confirmation email after successful payment. Store order in database." |
| **Search** | "Make search work" | "Implement full-text search across products. Support search by name, description, and category. Highlight matching terms. Show 'no results' state. Log search queries." |
| **Notification** | "Send notifications" | "Send email notification when booking is confirmed. Include booking details, check-in/check-out dates, and property address. Send within 30 seconds of booking." |
| **AI feature** | "Add AI" | "Implement AI-powered property description generator. Given property details, generate a 200-word marketing description. Show loading state during generation. Allow regeneration." |

## Practical Exercises

**Exercise 9.1: Convert Vague to Specific**

Convert this vague client request into clear requirements:

> "I need a website for my bakery."

Write at least 8 specific functional requirements and 3 non-functional requirements.

**Success criteria**: Every requirement is testable, specific, and unambiguous.

**Exercise 9.2: Write Functional Requirements**

For a task management application, write 10 functional requirements covering:
- Task creation, editing, and deletion
- Task assignment and status tracking
- Search and filtering
- Due dates and reminders

**Success criteria**: Each requirement follows the pattern "The system [does something] when [condition]."

**Exercise 9.3: Write Non-Functional Requirements**

For an e-commerce website, write non-functional requirements covering:
- Performance (page load times)
- Security (password handling, data protection)
- Accessibility (keyboard navigation, screen reader support)
- Compatibility (browser support)
- Scalability (concurrent users)

**Success criteria**: Each requirement has a measurable target.

**Exercise 9.4: Write User Stories**

For a booking system, write 6 user stories covering:
- Guest browsing properties
- Guest making a booking
- Host managing listings
- Host viewing bookings
- Admin overseeing the platform
- System handling cancellations

**Success criteria**: Each story follows the "As a [role], I want [capability], so that [benefit]" format.

**Exercise 9.5: Write Acceptance Criteria**

For user story "As a user, I want to reset my password so that I can regain access to my account," write 5 acceptance criteria using Given/When/Then format covering:
- Successful reset request
- Invalid email handling
- Expired reset link
- Weak new password
- Successful password change

**Success criteria**: Each criterion is testable and specific.

**Exercise 9.6: Define Scope**

For a client who asks for "an online store," write:
- In-scope items (at least 8)
- Out-of-scope items (at least 5)
- Assumptions (at least 3)
- Constraints (at least 3)

**Success criteria**: The scope is clear enough that both you and the client agree on what is included.

**Exercise 9.7: Build a Mini Specification**

For a feature of your choice, create a complete specification document including:
- Problem statement
- Goals
- 3 user stories with acceptance criteria
- 5 functional requirements
- 3 non-functional requirements
- Constraints
- Assumptions
- Out of scope items

**Success criteria**: The specification is clear enough for someone else to implement the feature.

**Exercise 9.8: Create a Traceability Matrix**

For your mini specification from Exercise 9.7, create a traceability matrix linking:
- Each requirement to a user story
- Each user story to acceptance criteria
- Each acceptance criterion to a test scenario

**Success criteria**: Every requirement has a clear path from specification to verification.

## Mini Challenges

### Challenge 1: From Vague to Specification

A client sends this message:

> "I need an app that helps me manage my rental properties. I have about 20 properties and need to track bookings, tenants, and maintenance requests. Something simple but professional."

Your challenge:

1. Write 10 clarifying questions you would ask the client
2. Based on reasonable assumptions, write 10 functional requirements
3. Write 3 non-functional requirements
4. Write 4 user stories with acceptance criteria
5. Define scope (in/out)
6. Create a specification document using the template from this chapter

### Challenge 2: Specification Review

An AI agent produces this implementation plan:

> "Plan:
> 1. Install 10 new packages
> 2. Create 15 new files
> 3. Modify 8 existing files
> 4. Update the database schema
> 5. Deploy to production
> 6. Run tests after deployment"

The specification says:

> "Implement a contact form with validation, email notification, and spam protection. Use existing project patterns. Do not modify the database schema. Test before deployment."

Identify at least 5 problems with the agent's plan and explain what should change.

## Knowledge Check

1. What is Spec-Driven Development and why is it called "spec-driven"?
2. What is the difference between a requirement and a specification?
3. What is the difference between a specification and an implementation plan?
4. What are the INVEST criteria for user stories?
5. How does the Given/When/Then format help with acceptance criteria?
6. What is the difference between functional and non-functional requirements?
7. Why is defining out-of-scope items important for freelancers?
8. What is specification drift and how do you prevent it?
9. How does SDD improve the effectiveness of AI coding agents?
10. What is a traceability matrix and why does it matter?
11. What should happen when a client changes requirements mid-project?
12. Why is "the specification exists but nobody checks it" a problem?

## Common Beginner Mistakes

### 1. Coding Before Understanding Requirements

**Problem**: Starting implementation before the requirements are clear.
**Why it happens**: The developer is eager to start building.
**Better approach**: Complete the requirements and specification stages first. Every hour spent on requirements saves multiple hours of rework.

### 2. Writing Vague Specifications

**Problem**: Specifications like "make it user-friendly" or "add a search feature."
**Why it happens**: The developer assumes shared understanding.
**Better approach**: Write specific, testable specifications with measurable acceptance criteria.

### 3. Treating Specs as Paperwork

**Problem**: Creating a specification document and never looking at it again.
**Why it happens**: The developer sees specification as a deliverable, not a tool.
**Better approach**: Use the specification actively throughout implementation. Reference it in every decision.

### 4. Over-Specifying Implementation

**Problem**: The specification dictates exact code structure and variable names.
**Why it happens**: The developer conflates requirements with implementation details.
**Better approach**: Specify WHAT the system should do, not HOW it should be coded. Implementation details belong in the plan.

### 5. Ignoring Edge Cases

**Problem**: Only specifying the happy path.
**Why it happens**: The developer focuses on the ideal flow.
**Better approach**: For every user story, ask "what could go wrong?" and write acceptance criteria for error scenarios.

### 6. Skipping Acceptance Criteria

**Problem**: Requirements without clear verification criteria.
**Why it happens**: The developer does not think about testing during specification.
**Better approach**: Every requirement must have at least one testable acceptance criterion. If you cannot test it, you cannot verify it.

### 7. Allowing Scope Creep

**Problem**: Accepting new features without updating the specification.
**Why it happens**: The developer wants to keep the client happy.
**Better approach**: Every new request goes through the specification process. Document, estimate, and approve before implementing.

### 8. Failing to Update Specs

**Problem**: Requirements change but the specification is not updated.
**Why it happens**: The developer is in a hurry or forgets.
**Better approach**: Treat the specification as a living document. Update it before updating code.

### 9. Letting AI Invent Requirements

**Problem**: Giving an agent a task without providing the specification and letting it decide what to build.
**Why it happens**: The developer trusts the agent to figure it out.
**Better approach**: Always provide the specification as context. The agent implements what is specified, not what it guesses.

### 10. Trusting Generated Plans Blindly

**Problem**: Accepting an AI-generated implementation plan without reviewing it against the specification.
**Why it happens**: The developer assumes the AI understood the specification.
**Better approach**: Review every plan against the specification. Verify that all requirements are covered.

### 11. Skipping Verification

**Problem**: The specification exists but is never checked during implementation.
**Why it happens**: The developer treats specification as a document to create, not a tool to use.
**Better approach**: Use the specification actively. Verify every deliverable against the acceptance criteria.

### 12. Not Connecting Specs to Git

**Problem**: Specifications live outside the project repository.
**Why it happens**: The developer treats specs as separate documentation.
**Better approach**: Commit specifications to the repository. Reference them in commit messages. Keep them alongside the code.

## Freelancer Perspective

### What Works

- Writing a specification before every project, no matter how small
- Getting client approval on the specification before starting implementation
- Using the specification as the source of truth for all decisions
- Providing AI agents with the specification as context
- Updating the specification when requirements change
- Maintaining traceability from requirements to code to tests
- Committing specifications to the project repository
- Using specifications to generate accurate estimates

### What Does Not Work

- Starting to code without clear requirements
- Writing vague specifications that nobody can verify
- Treating the specification as a document to create, not a tool to use
- Allowing scope creep without updating the specification
- Letting AI agents guess at requirements instead of providing specifications
- Trusting AI-generated implementations without checking against the specification
- Keeping specifications outside the project repository
- Ignoring specification drift

### What Beginners Misunderstand

- **SDD is not bureaucracy.** It is the practice that prevents building the wrong thing. The time spent on specifications saves far more time during implementation.
- **Specifications are not just for you.** They are for the client, for AI agents, for future developers, and for your future self. They are a communication tool.
- **The specification is not the code.** A specification describes behavior. The code implements that behavior. They must stay in sync, but they serve different purposes.
- **AI agents need specifications.** An agent without a specification is guessing. An agent with a specification is implementing. The quality of the specification directly determines the quality of the AI output.

### The Long Game

The freelancers who use SDD build a compounding advantage. Their specifications prevent rework. Their estimates are accurate because requirements are defined. Their AI agents produce better code because they receive clear context. Their client relationships are stronger because expectations are managed through specifications.

Over time, SDD becomes a professional differentiator. Clients choose freelancers who deliver reliably. Specifications are how you deliver reliably.

## 30-Day Practice Plan

### Week 1: Requirements Fundamentals

| Day | Task | Practice | Deliverable |
|-----|------|----------|-------------|
| 1 | Learn requirements types | Read about functional and non-functional requirements | Notes on requirements types |
| 2 | Practice writing requirements | Convert 5 vague requests into specific requirements | 5 sets of requirements |
| 3 | Learn user stories | Study the user story format and INVEST criteria | User story examples |
| 4 | Practice user stories | Write 10 user stories for a personal project | 10 user stories |
| 5 | Learn acceptance criteria | Study Given/When/Then format | Acceptance criteria examples |
| 6 | Practice acceptance criteria | Write acceptance criteria for 5 user stories | 15 acceptance criteria |
| 7 | Reflect on Week 1 | Review and refine your requirements work | Summary of learnings |

### Week 2: Specifications and Acceptance Criteria

| Day | Task | Practice | Deliverable |
|-----|------|----------|-------------|
| 8 | Learn specification structure | Study the specification template | Template understanding |
| 9 | Write a mini specification | Create a specification for a small feature | Mini specification document |
| 10 | Learn scope definition | Study in-scope, out-of-scope, assumptions, constraints | Scope examples |
| 11 | Practice scope definition | Define scope for a freelance project scenario | Scope document |
| 12 | Learn traceability | Study requirement-to-test traceability | Traceability examples |
| 13 | Practice traceability | Create a traceability matrix for your mini spec | Traceability matrix |
| 14 | Reflect on Week 2 | Review specification quality and completeness | Specification review |

### Week 3: AI-Assisted SDD Workflows

| Day | Task | Practice | Deliverable |
|-----|------|----------|-------------|
| 15 | Learn SDD + AI workflow | Study the SDD + AI agent workflow | Workflow notes |
| 16 | Practice AI prompting from specs | Write 5 strong prompts based on a specification | 5 AI prompts |
| 17 | Practice AI-assisted specification | Use AI to draft a specification, then review and improve | Improved specification |
| 18 | Practice AI-assisted implementation | Give an AI agent a specification and review the result | Implementation + review |
| 19 | Learn specification drift prevention | Study drift prevention and recovery | Drift prevention notes |
| 20 | Practice quality review | Review a specification against quality attributes | Quality review report |
| 21 | Reflect on Week 3 | Evaluate AI-assisted SDD experiences | Workflow assessment |

### Week 4: Freelance Project Simulation

| Day | Task | Practice | Deliverable |
|-----|------|----------|-------------|
| 22 | Simulate a client request | Create a realistic freelance scenario | Client request document |
| 23 | Discovery and requirements | Write requirements for the scenario | Requirements document |
| 24 | Write specification | Create a complete specification | Specification document |
| 25 | Define scope and plan | Create scope, plan, and task breakdown | Plan and tasks |
| 26 | AI-assisted implementation | Use AI agents to implement against the specification | Implementation |
| 27 | Testing and verification | Verify implementation against acceptance criteria | Verification report |
| 28 | Practice the full workflow | Complete the end-to-end SDD workflow | Full project deliverable |
| 29 | Review the month | Evaluate all learnings and identify areas for improvement | Monthly reflection |
| 30 | Plan next steps | Identify areas for continued practice and improvement | Improvement plan |

## Professional SDD Checklist

### Before Specification

- [ ] Understand the client's business problem
- [ ] Ask clarifying questions
- [ ] Identify all stakeholders
- [ ] Understand the technology stack
- [ ] Review any existing documentation

### Specification

- [ ] Write a clear problem statement
- [ ] Define measurable goals
- [ ] Write user stories for all user roles
- [ ] Write acceptance criteria for every user story
- [ ] List all functional requirements
- [ ] List all non-functional requirements with targets
- [ ] Define constraints (technology, budget, timeline)
- [ ] Document assumptions
- [ ] Identify dependencies
- [ ] List edge cases
- [ ] Define out-of-scope items
- [ ] Write success criteria

### Client Approval

- [ ] Share specification with client
- [ ] Walk through the specification with client
- [ ] Address client questions and concerns
- [ ] Get written approval on the specification
- [ ] Establish change request process

### Planning

- [ ] Derive technical plan from specification
- [ ] Make architecture decisions
- [ ] Define components and data model
- [ ] Plan API endpoints
- [ ] Plan testing strategy
- [ ] Break work into tasks
- [ ] Identify task dependencies
- [ ] Estimate effort for each task

### AI/Agent Execution

- [ ] Provide specification as context to AI agent
- [ ] Include acceptance criteria in agent prompts
- [ ] Specify constraints and boundaries
- [ ] Review agent's plan before implementation
- [ ] Review git diff after implementation

### Testing

- [ ] Run unit tests
- [ ] Run integration tests
- [ ] Verify each acceptance criterion
- [ ] Test edge cases
- [ ] Test error scenarios
- [ ] Test performance targets
- [ ] Test accessibility

### Review

- [ ] Compare implementation to specification
- [ ] Verify no scope creep occurred
- [ ] Check for security issues
- [ ] Verify documentation is updated
- [ ] Confirm all requirements are implemented

### Delivery

- [ ] Deploy to staging and verify
- [ ] Get client approval on staging
- [ ] Deploy to production
- [ ] Provide specification as living documentation
- [ ] Document any deviations from original specification
- [ ] Hand off with setup instructions

## Summary

- **Spec-Driven Development** is the practice of defining what to build through clear, testable specifications before writing any code
- **Specifications are the source of truth** for the entire development process, from implementation to testing to client communication
- **Requirements, specifications, plans, and tasks** are distinct artifacts that serve different purposes and must not be confused
- **Functional requirements** describe what the system does. **Non-functional requirements** describe how it performs.
- **User stories** capture intent from the user's perspective. **Acceptance criteria** define how to verify the feature works.
- **Scope definition** protects freelancers from scope creep by explicitly stating what is and is not included
- **Traceability** links requirements to specifications to tasks to code to tests, ensuring nothing is missed
- **AI coding agents** produce dramatically better results when they receive clear specifications with context, constraints, and acceptance criteria
- **Specification drift** occurs when code and specification diverge. Prevention requires updating the specification whenever requirements change
- **SDD is not bureaucracy** — it is the practice that prevents building the wrong thing and enables reliable, professional delivery
- **Specifications improve estimates, communication, testing, and client relationships** — making freelancers more professional and more profitable
- **The long game**: SDD builds a compounding professional advantage through reliable delivery, accurate estimates, and stronger client trust

## What Comes Next

Now that you understand the fundamentals of Spec-Driven Development, the next step is hands-on practice. In **Chapter 10: Your First Spec-Kit Project**, you will apply SDD to a real project using Spec-Kit conventions, including the constitution, specification documents, and verification workflow. You will experience the complete pipeline from client idea to verified delivery.
