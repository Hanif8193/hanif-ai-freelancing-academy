---
id: 1
title: M1 Foundation Specification Creation
stage: constitution
date: 2026-08-17
surface: agent
model: big-pickle
feature: m1-foundation
branch: m1-foundation
user: Hanif
command: /sp.constitution
labels: ["constitution", "specification", "foundation", "m1"]
links:
  spec: specs/m1-foundation/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
 - specs/m1-foundation/spec.md
 - specs/m1-foundation/plan.md
 - specs/m1-foundation/tasks.md
 - specs/m1-foundation/checklist.md
 - specs/m1-foundation/development-plan.md
 - specs/m1-foundation/quickstart.md
 - specs/m1-foundation/summary.md
tests:
 - No tests run (specification phase only)
---

## Prompt

hi

You are the lead product architect and senior software engineer for this project.

PROJECT:
Hanif AI Freelancing Academy

GOAL:
Build an interactive, AI-powered freelancing education platform that teaches users freelancing from beginner to advanced level through an interactive Docusaurus eBook, real-world projects, AI coding agents, Spec-Driven Development, MCP, RAG, and Hanif AI Tutor.

IMPORTANT:
Use Spec-Driven Development. Do NOT start implementing the application yet.

FIRST, inspect the existing project structure, including:

* .specify/
* .opencode/
* opencode.md
* existing configuration files

Do not delete or overwrite existing configuration unless necessary.

Create the project foundation and specification for the first milestone.

M1 — FOUNDATION

1. PROJECT CONSTITUTION

Create/update the appropriate Spec-Kit constitution file.

The constitution should establish these principles:

* Spec-Driven Development is mandatory.
* Requirements must be clear and testable before implementation.
* AI agents must follow project specifications.
* Human approval is required for important business decisions and external actions.
* Security and privacy are first-class requirements.
* Secrets/API keys must never be committed.
* Every major feature must have tests.
* Documentation is part of the product.
* Accessibility and responsive design are required.
* The platform should be modular and extensible.
* AI-generated content must be reviewed for accuracy.
* Technical terminology must remain consistent across English and Urdu.
* The system must support future multilingual expansion.
* The architecture must allow future MCP integrations.
* The architecture must allow future RAG and AI Tutor functionality.
* Monetization must not compromise the educational experience.

2. PRODUCT SPECIFICATION

Create the M1 specification for:

"Hanif AI Freelancing Academy — Foundation"

The specification must define:

A. Product vision

B. Target users:

* Complete beginners
* Freelancers
* Junior developers
* Full-stack developers
* AI developers
* Urdu-speaking learners

C. Core product modules:

1. Interactive Docusaurus eBook
2. Hanif AI Tutor
3. Ask the Book RAG chatbot
4. English ↔ Urdu Translator Agent
5. Real-world freelancing projects
6. Spec-Driven Development learning
7. AI Agent learning
8. MCP learning
9. Freelancing/client acquisition training
10. Templates and resources

D. Initial MVP scope:

For M1, only establish the foundation and specification.

Do NOT implement:

* RAG
* AI Tutor
* Translator Agent
* MCP
* Authentication
* Payments
* Subscription system

Those are future milestones.

E. Initial learning content:

Module 1:
01 — What Is Freelancing?
02 — How Freelancers Make Money
03 — Choosing Your Freelancing Niche
04 — Building Your Developer Profile

Module 2:
05 — What Are AI Coding Agents?
06 — Setting Up VS Code
07 — Git & GitHub
08 — AI-Assisted vs Agentic Development

Module 3:
09 — What Is Spec-Driven Development?
10 — Your First Spec-Kit Project

F. Future architecture requirements:

The architecture should eventually support:

Docusaurus
+
RAG
+
Hanif AI Tutor
+
English/Urdu Translator Agent
+
MCP
+
AI Agents
+
Authentication
+
Payments
+
Learning progress
+
Projects
+
Courses
+
Community

G. Revenue model:

Document the future monetization strategy:

FREE:

* Selected book chapters
* Limited AI Tutor
* Limited RAG questions
* Limited translation

PAID EBOOK:

* Complete book
* Templates
* Resources

PRO:

* Complete book
* Projects
* Source code
* AI Tutor
* RAG
* Translator

ACADEMY:

* AI Tutor
* RAG
* Translator
* MCP labs
* Projects
* Courses
* Community

PREMIUM:

* Mentorship
* Project reviews
* Live workshops

Do NOT implement payments in M1.

3. USER STORIES

Create prioritized user stories for the overall product.

At minimum include:

US1 — Browse the eBook
US2 — Search learning content
US3 — Ask the Book
US4 — Learn with Hanif AI Tutor
US5 — Translate English to Urdu
US6 — Translate Urdu to English
US7 — Learn in Beginner/Developer/Freelancer/Interview/Project modes
US8 — Follow real-world projects
US9 — Learn Spec-Driven Development
US10 — Learn MCP
US11 — Build AI-powered freelancing workflows
US12 — Access paid content
US13 — Track learning progress

For each story, define clear acceptance criteria.

4. NON-FUNCTIONAL REQUIREMENTS

Define requirements for:

* Security
* Performance
* Accessibility
* Responsive UI
* SEO
* Maintainability
* Scalability
* Privacy
* Error handling
* Observability
* Testing
* Documentation

5. MILESTONE ROADMAP

Define the following roadmap:

M1 — Foundation & Specification
M2 — Docusaurus Foundation
M3 — Initial 10 Chapters
M4 — RAG / Ask the Book
M5 — Hanif AI Tutor
M6 — English ↔ Urdu Translator Agent
M7 — MCP Integration
M8 — Authentication & Learning Progress
M9 — Monetization
M10 — Production Deployment
M11 — Advanced Freelancing AI Agents
M12 — Academy Growth & Community

6. ARCHITECTURE DECISION

Do NOT over-engineer M1.

Recommend an architecture that can start simple and evolve.

Clearly separate:

* Documentation/content
* Frontend
* AI services
* RAG
* Translation
* MCP
* Authentication
* Payments

7. OUTPUT

After inspecting the repository:

* Create/update the constitution
* Create the M1 specification
* Create a development plan if appropriate
* Create the task breakdown if appropriate

Do not implement application features yet.

Before making any changes, inspect the existing files and preserve existing project conventions.

At the end, provide:

1. Files created/modified
2. Key architectural decisions
3. M1 acceptance criteria
4. Recommended next milestone
5. Any questions/blockers that require human decision

## Response snapshot

Created comprehensive M1 foundation specification including:

1. **Constitution**: Updated `.specify/memory/constitution.md` with 12 core principles covering SDD, security, testing, accessibility, and future integrations.

2. **Feature Specification**: Created `specs/m1-foundation/spec.md` with:
   - Product vision and target users
   - 13 prioritized user stories with acceptance criteria
   - Functional requirements for M1 scope
   - Non-functional requirements
   - Success criteria
   - Edge cases
   - Revenue model (future)
   - Architecture requirements

3. **Implementation Plan**: Created `specs/m1-foundation/plan.md` with:
   - Technical context and stack
   - Constitution check
   - Project structure
   - 12-milestone roadmap
   - Risk analysis
   - Evaluation criteria

4. **Task Breakdown**: Created `specs/m1-foundation/tasks.md` with:
   - 65 tasks organized by user story
   - 16 phases from setup to polish
   - Parallel execution opportunities
   - MVP-first strategy

5. **Additional Documents**:
   - `checklist.md` - 70-item progress tracker
   - `development-plan.md` - Overall development approach
   - `quickstart.md` - Quick reference guide
   - `summary.md` - Complete summary with decisions

## Outcome

- ✅ Impact: Foundation established for entire platform
- 🧪 Tests: Specification phase only (no tests run)
- 📁 Files: 7 new files created, 1 updated
- 🔁 Next prompts: M2 planning, content authoring, deployment setup
- 🧠 Reflection: Comprehensive foundation established with clear milestones and acceptance criteria

## Evaluation notes (flywall)

- Failure modes observed: None (specification phase)
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin M2 implementation planning