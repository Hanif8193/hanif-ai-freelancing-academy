---
sidebar_position: 2
title: "Chapter 10: Your First Spec-Kit Project"
---

# Chapter 10: Your First Spec-Kit Project

## Learning Objectives

By the end of this chapter, you will be able to:

- Apply the Spec-Kit methodology to a real project
- Create complete specification documents
- Follow the SDD workflow from idea to implementation
- Use AI tools effectively with specifications
- Deliver a professional, specification-driven project

## Prerequisites

- Chapter 09: What Is Spec-Driven Development?
- Basic understanding of web development
- VS Code or similar editor
- Node.js installed (for running examples)

## Environment Requirements

- **Node.js**: Version 18 or higher
- **Code Editor**: VS Code recommended
- **Git**: For version control
- **Terminal**: Command line access
- **AI Tool**: GitHub Copilot, Codeium, or similar (optional but recommended)

## Introduction

This chapter provides hands-on experience applying the Spec-Kit methodology. You will create a complete specification for a simple project and follow the SDD workflow. This is the same process used in professional development.

## Why This Matters

Practical experience with Spec-Kit helps you:

- Understand SDD in practice
- Build professional habits
- Create documentation that works
- Use AI tools effectively
- Deliver consistent results

## Core Concepts

### What Is Spec-Kit?

Spec-Kit is a structured approach to specification-driven development used in this project. It provides:

- **Standardized document structure**: Consistent format for all projects
- **Clear workflow**: Step-by-step process from idea to deployment
- **Constitution-governed**: Core principles that guide all decisions
- **AI-integrated**: Designed to work effectively with AI coding agents

### The Constitution

Every Spec-Kit project begins with a **Constitution** — a set of core principles that govern all development. For this project, the constitution is stored at `.specify/memory/constitution.md` and includes principles like:

- Spec-Driven Development is mandatory
- Requirements must be clear and testable
- Human approval is required for important decisions
- Security and privacy are first-class requirements
- Test-first approach
- Documentation is part of the product

The constitution supersedes all other practices and ensures consistency across the project.

### Spec-Kit Document Structure

Every Spec-Kit project includes:

```
specs/
├── [feature-name]/
│   ├── spec.md          # Feature specification (what to build and why)
│   ├── plan.md          # Implementation plan (how to build it)
│   ├── tasks.md         # Task breakdown (specific work items)
│   ├── checklist.md     # Progress tracking (verification items)
│   └── summary.md       # Project summary (lessons learned)
```

Each document serves a specific purpose:
- **spec.md**: Defines the feature, scope, target users, and acceptance criteria
- **plan.md**: Outlines the implementation approach, phases, and dependencies
- **tasks.md**: Lists specific, actionable work items with checkboxes
- **checklist.md**: Tracks verification and quality assurance items
- **summary.md**: Documents what was learned and recommendations for future work

### Spec-Kit Workflow

The actual workflow used in this project follows these phases:

#### Phase 1: Constitution Review
1. Review the project constitution (`.specify/memory/constitution.md`)
2. Ensure alignment with core principles
3. Identify any principle conflicts

#### Phase 2: Specification
1. Capture the idea
2. Write requirements (functional, non-functional, constraints, assumptions)
3. Create user stories with acceptance scenarios
4. Define technical design
5. Specify scope and out-of-scope items

#### Phase 3: Planning
1. Create implementation plan with phases
2. Break down into tasks with checkboxes
3. Estimate effort for each task
4. Identify dependencies
5. Assess risks

#### Phase 4: Implementation
1. Follow the plan phase by phase
2. Use AI tools effectively with specifications as context
3. Test as you build
4. Document progress in checklist.md
5. Review regularly

#### Phase 5: Verification
1. Run build commands (`npm run build`)
2. Verify no broken links
3. Check all acceptance criteria
4. Ensure no out-of-scope features were implemented
5. Update checklist.md with verification results

#### Phase 6: Review & Summary
1. Create summary.md with lessons learned
2. Document what worked and what didn't
3. Provide recommendations for future work
4. Archive the specification

### Writing Effective Specifications

#### Requirements Format
```markdown
## Requirements

### Functional Requirements
- [Requirement 1]: Clear, testable statement
- [Requirement 2]: Clear, testable statement
- [Requirement 3]: Clear, testable statement

### Non-Functional Requirements
- [Performance]: Response time under X seconds
- [Security]: Authentication required for Y
- [Accessibility]: WCAG 2.1 AA compliance

### Constraints
- [Technology]: Must use specific framework
- [Budget]: Maximum X hours
- [Timeline]: Must complete by Y date

### Assumptions
- [Assumption 1]: What you believe to be true
- [Assumption 2]: What you believe to be true
```

#### User Story Format
```markdown
## User Story

As a [user type], I want to [action] so that [benefit].

### Acceptance Scenarios

1. **Given** [precondition], **When** [action], **Then** [expected result]
2. **Given** [precondition], **When** [action], **Then** [expected result]
3. **Given** [precondition], **When** [action], **Then** [expected result]
```

#### Task Format
```markdown
## Tasks

- [ ] Task 1: [Description]
  - Acceptance criteria: [How to know it's done]
  - Estimated effort: [Time estimate]
  - Dependencies: [What must be done first]

- [ ] Task 2: [Description]
  - Acceptance criteria: [How to know it's done]
  - Estimated effort: [Time estimate]
  - Dependencies: [What must be done first]
```

### Using AI with Spec-Kit

#### AI for Specification
```
You: Help me write a specification for a task management application

AI: I'll help you create a specification. Let me understand your requirements:
1. What features do you need?
2. Who are the users?
3. What technology stack?
4. What are the constraints?

You: [Answer questions]

AI: [Generates specification with user stories, acceptance scenarios, and technical design]
```

#### AI for Planning
```
You: Create an implementation plan for this specification
[paste specification]

AI: [Generates task breakdown, timeline, and risk assessment]
```

#### AI for Implementation
```
You: Implement Task 1 according to this specification
[paste specification and task details]

AI: [Generates code with tests and documentation]
```

### Quality Assurance

#### Specification Quality
- Clear and unambiguous
- Complete and comprehensive
- Testable and measurable
- Realistic and achievable

#### Implementation Quality
- Follows specifications
- Includes tests
- Documents decisions
- Handles edge cases

#### Review Quality
- Code review
- Specification compliance
- Performance testing
- Security testing

## Practical Examples

### Example 1: Task Management App Specification

**Idea**: Build a simple task management application

**Requirements**:
```markdown
## Requirements

### Functional Requirements
- Users can create tasks with title and description
- Users can mark tasks as complete
- Users can delete tasks
- Users can filter tasks by status
- Tasks persist in browser localStorage

### Non-Functional Requirements
- Response time under 100ms
- Mobile-responsive design
- Accessible (WCAG 2.1 AA)
- Works offline

### Constraints
- Single user application
- No backend required
- Must work in modern browsers
- Maximum 1000 tasks

### Assumptions
- Users have modern browsers
- Users understand basic task management
- localStorage is available
```

**User Stories**:
```markdown
## User Story 1: Create Task

As a user, I want to create a new task so that I can track my work.

### Acceptance Scenarios

1. **Given** user is on the main page, **When** they click "Add Task", **Then** they see a form with title and description fields
2. **Given** user fills in task details, **When** they submit the form, **Then** the task appears in the task list
3. **Given** user submits empty title, **When** they click submit, **Then** they see a validation error

## User Story 2: Complete Task

As a user, I want to mark tasks as complete so that I can track my progress.

### Acceptance Scenarios

1. **Given** user has tasks, **When** they click the complete button, **Then** the task is marked as complete
2. **Given** user has completed tasks, **When** they filter by status, **Then** they see only completed tasks
3. **Given** user completes a task, **When** they refresh the page, **Then** the task remains complete
```

**Plan**:
```markdown
## Implementation Plan

### Task Breakdown

1. **Project Setup** (2 hours)
   - Initialize project
   - Set up build tools
   - Configure linting

2. **Task Model** (1 hour)
   - Define task interface
   - Create localStorage service
   - Implement CRUD operations

3. **UI Components** (4 hours)
   - TaskForm component
   - TaskList component
   - TaskItem component
   - FilterComponent

4. **State Management** (2 hours)
   - React state setup
   - Task operations
   - Filter logic

5. **Styling** (2 hours)
   - Responsive design
   - Dark/light mode
   - Accessibility

6. **Testing** (3 hours)
   - Unit tests
   - Integration tests
   - User acceptance testing

7. **Documentation** (1 hour)
   - README
   - User guide
   - Developer guide

### Timeline
- Total: 15 hours
- Days: 3-5 days (part-time)

### Risks
- localStorage limitations
- Browser compatibility
- Accessibility issues
```

### Example 2: Following the Plan

**Task 1: Project Setup**

```bash
# Initialize project
npx create-react-app task-manager --template typescript
cd task-manager

# Install dependencies
npm install uuid @types/uuid

# Set up project structure
mkdir src/components src/services src/types src/hooks
```

**Task 2: Task Model**

```typescript
// src/types/task.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// src/services/storage.ts
import { Task } from '../types/task';

const STORAGE_KEY = 'task-manager-tasks';

export const getTasks = (): Task[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
  const tasks = getTasks();
  const newTask: Task = {
    ...task,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
};
```

### Example 3: AI-Assisted Implementation

**Using AI to generate components**:

```
You: Create a TaskForm component based on this specification:

Requirements:
- Form with title and description fields
- Title is required, max 100 characters
- Description is optional, max 500 characters
- Submit button disabled when title is empty
- Shows validation errors
- Calls onSubmit with task data

AI: [generates complete component with validation, error handling, and tests]
```

**Your review**:
- Verify validation matches specification
- Check accessibility attributes
- Ensure error messages are clear
- Test all acceptance scenarios

### Example 4: Testing Against Specifications

**Test cases from acceptance scenarios**:

```typescript
// src/__tests__/TaskForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from '../components/TaskForm';

describe('TaskForm', () => {
  it('shows form with title and description fields', () => {
    render(<TaskForm onSubmit={jest.fn()} />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('shows validation error for empty title', async () => {
    render(<TaskForm onSubmit={jest.fn()} />);
    fireEvent.click(screen.getByText(/submit/i));
    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
  });

  it('calls onSubmit with task data', () => {
    const onSubmit = jest.fn();
    render(<TaskForm onSubmit={onSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Task' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test description' },
    });
    fireEvent.click(screen.getByText(/submit/i));
    
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Test Task',
      description: 'Test description',
      completed: false,
    });
  });
});
```

## Freelancer Perspective

Spec-Kit improves your freelancing business:

**Project delivery:**
- Clear scope from the start
- Measurable progress
- Professional documentation
- Higher client satisfaction

**Time management:**
- Better estimation
- Reduced rework
- Focused implementation
- Clear priorities

**Client relationships:**
- Transparent progress
- Structured changes
- Professional communication
- Trust building

**Business growth:**
- Repeatable process
- Scalable approach
- Professional reputation
- Higher rates

## AI/Agent Perspective

Spec-Kit makes AI tools more effective:

**Better context:**
- Specifications provide detailed context
- AI generates better code
- Tests are generated from specs
- Documentation is automated

**Workflow integration:**
- Use AI for specification creation
- Use AI for plan generation
- Use AI for implementation
- Use AI for testing

**Quality assurance:**
- AI verifies specification compliance
- AI generates test cases
- AI reviews code quality
- AI identifies gaps

## Step-by-Step Guidance

### Complete Spec-Kit Workflow

**Step 1: Review Constitution**
1. Read the project constitution
2. Understand core principles
3. Ensure your feature aligns with principles

**Step 2: Capture the Idea**
1. Write a clear problem statement
2. Define the target user
3. List expected outcomes
4. Identify constraints

**Step 3: Write Specification (spec.md)**
1. Define scope (in-scope and out-of-scope)
2. Write functional requirements
3. Write non-functional requirements
4. Create user stories with acceptance scenarios
5. Specify technical design
6. List dependencies

**Step 4: Create Plan (plan.md)**
1. Define implementation phases
2. Break down into tasks with checkboxes
3. Estimate effort for each task
4. Identify dependencies between tasks
5. Assess risks

**Step 5: Create Tasks (tasks.md)**
1. List specific, actionable work items
2. Add acceptance criteria for each task
3. Estimate effort
4. Add checkbox for tracking

**Step 6: Implement**
1. Follow the plan phase by phase
2. Use AI tools with specifications as context
3. Test as you go
4. Update checklist.md with progress

**Step 7: Verify**
1. Run build commands
2. Verify no broken links
3. Check all acceptance criteria
4. Ensure no out-of-scope features

**Step 8: Create Summary (summary.md)**
1. Document what was built
2. List files created/modified
3. Document lessons learned
4. Provide recommendations

## Practical Exercise

**Exercise 10.1: Complete Spec-Kit Project**

Apply Spec-Kit to a calculator application:

1. **Capture Idea**: Simple calculator with basic operations
2. **Write Requirements**: What it must do
3. **Create Specification**: User stories and scenarios
4. **Make Plan**: Task breakdown and timeline
5. **Implement**: Build according to plan
6. **Test**: Verify against specifications
7. **Document**: Create summary

**Exercise 10.2: AI-Assisted Specification**

Use AI to help write a specification:

1. Describe your project to AI
2. Ask for user stories
3. Request acceptance scenarios
4. Get technical design suggestions
5. Review and refine

## Common Mistakes

### Mistake 1: Skipping Steps

Don't jump to implementation. Follow each step in order.

### Mistake 2: Vague Specifications

Be specific. "Make it fast" is not a specification. "Response time under 200ms" is.

### Mistake 3: Not Testing Against Specs

Use your specifications as test cases. Verify each acceptance scenario.

### Mistake 4: Ignoring Non-Functional Requirements

Performance, security, and accessibility matter. Include them in your specifications.

### Mistake 5: Not Documenting

Keep your specification documents updated as you build.

## Knowledge Check

1. What are the phases of the Spec-Kit workflow?
2. What is the purpose of a project constitution?
3. What should a specification (spec.md) include?
4. How do you use AI effectively with Spec-Kit?
5. Why is testing against specifications important?
6. What should a project summary (summary.md) include?

## Mini Task or Challenge

**Challenge 10.1: Full Spec-Kit Project**

Complete a full Spec-Kit project:

1. Choose a simple application (e.g., password generator, unit converter, note-taking app)
2. Create complete specification documents
3. Follow the implementation plan
4. Test against specifications
5. Write a project summary

**Challenge 10.2: AI Integration**

Use AI throughout the Spec-Kit workflow:

1. Use AI to generate specification draft
2. Use AI to create implementation plan
3. Use AI to generate code
4. Use AI to write tests
5. Document how AI helped and where you needed to intervene

## Summary

- Spec-Kit provides a structured approach to SDD with constitution-governed principles
- The workflow: Constitution → Specification → Plan → Tasks → Implementation → Verification → Review
- Specifications include: spec.md, plan.md, tasks.md, checklist.md, summary.md
- Use AI tools to enhance each phase, providing specifications as context
- Test against specifications and verify no out-of-scope features
- Document your progress and create summaries for learning
- Practice with real projects to build skills

## What Comes Next

You have completed the initial curriculum of Hanif AI Freelancing Academy. You now understand:

- Freelancing fundamentals (Chapters 01-04)
- AI development tools (Chapters 05-08)
- Spec-Driven Development (Chapters 09-10)

**Next steps in your journey:**
- Apply these skills to real projects
- Build your portfolio
- Start freelancing with confidence
- Continue learning and improving
- Explore advanced topics in future academy modules

Remember: The best way to learn is by doing. Start with small projects, apply what you have learned, and gradually take on larger challenges. Good luck on your freelancing journey!
