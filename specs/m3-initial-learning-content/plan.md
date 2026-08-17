# M3 — Initial Learning Content Plan

## Overview
Write and publish 10 chapters across 3 modules, update navigation, and verify build.

## Implementation Order

### Phase 1: Specification
1. Create M3 spec.md
2. Create M3 plan.md
3. Create M3 tasks.md
4. Create M3 checklist.md

### Phase 2: Module 1 — Freelancing Fundamentals
5. Write Chapter 01: What Is Freelancing?
6. Write Chapter 02: How Freelancers Make Money
7. Write Chapter 03: Choosing Your Freelancing Niche
8. Write Chapter 04: Building Your Developer Profile

### Phase 3: Module 2 — AI & Development Tools
9. Write Chapter 05: What Are AI Coding Agents?
10. Write Chapter 06: Setting Up VS Code for AI-Powered Development
11. Write Chapter 07: Git & GitHub for Freelancers
12. Write Chapter 08: AI-Assisted vs Agentic Development

### Phase 4: Module 3 — Spec-Driven Development
13. Write Chapter 09: What Is Spec-Driven Development?
14. Write Chapter 10: Your First Spec-Kit Project

### Phase 5: Navigation & Integration
15. Update sidebars.ts with all 10 chapters
16. Update getting-started/index.md with proper content
17. Update docs/intro.md navigation links

### Phase 6: Verification
18. Run npm run build
19. Verify no broken links
20. Verify all chapters in navigation
21. Verify no M4+ features implemented
22. Create M3 summary.md

## Content Writing Template

Each chapter follows this structure:

```markdown
---
sidebar_position: X
title: Chapter Title
---

# Chapter Title

## Learning Objectives
- Objective 1
- Objective 2

## Introduction
[Context and overview]

## Why This Matters
[Practical relevance]

## Core Concepts
[Main teaching content with subsections]

## Practical Examples
[Real-world scenarios]

## Freelancer Perspective
[How this applies to freelancing]

## AI/Agent Perspective (where relevant)
[How AI tools help]

## Step-by-Step Guidance (where relevant)
[Clear instructions]

## Practical Exercise
[Hands-on activity]

## Common Mistakes
[Pitfalls to avoid]

## Knowledge Check
[Questions to verify understanding]

## Mini Task or Challenge
[Applied practice]

## Summary
[Key takeaways]

## What Comes Next
[Preview of next chapter]
```

## Dependencies
- M1 Foundation (complete)
- M2 Docusaurus Foundation (complete)
- Docusaurus 3.x installed and configured

## Risk Mitigation
- Write content in order to maintain consistency
- Review each chapter for accuracy before proceeding
- Verify build after each module
- Do NOT implement any M4+ features

## Estimated Effort
- Specification: 4 documents
- Module 1: 4 chapters
- Module 2: 4 chapters
- Module 3: 2 chapters
- Navigation: 1 update
- Verification: Build + link check

## Success Criteria
- All 10 chapters published
- All content sections present
- Sidebar shows all chapters in order
- Build succeeds
- No broken links
- No M4+ features implemented
