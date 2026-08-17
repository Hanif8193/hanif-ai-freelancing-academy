# M3 — Initial Learning Content Specification

## Overview
Write and publish 10 high-quality learning chapters across 3 modules for Hanif AI Freelancing Academy. Content is structured as a professional, practical, beginner-friendly technical education book.

## Scope
- **In Scope**: 10 chapters, sidebar navigation, content quality, Docusaurus MDX where appropriate
- **Out of Scope**: RAG, AI Tutor, Translator, MCP, Auth, Payments, Subscriptions, Learning Progress, Advanced Agents

## Target Audience
- Complete beginners
- New freelancers
- Junior developers
- Web developers
- AI developers
- Urdu-speaking learners who can read English technical content

## Book Promise
Learn freelancing from fundamentals through AI-powered software development and Spec-Driven Development.

## Module Structure

### Module 1 — Freelancing Fundamentals
| Chapter | Title | Location |
|---------|-------|----------|
| 01 | What Is Freelancing? | `docs/freelancing/what-is-freelancing.md` |
| 02 | How Freelancers Make Money | `docs/freelancing/how-freelancers-make-money.md` |
| 03 | Choosing Your Freelancing Niche | `docs/freelancing/choosing-your-niche.md` |
| 04 | Building Your Developer Profile | `docs/freelancing/building-your-profile.md` |

### Module 2 — AI & Development Tools
| Chapter | Title | Location |
|---------|-------|----------|
| 05 | What Are AI Coding Agents? | `docs/ai-development/what-are-ai-coding-agents.md` |
| 06 | Setting Up VS Code for AI-Powered Development | `docs/ai-development/setting-up-vs-code.md` |
| 07 | Git & GitHub for Freelancers | `docs/ai-development/git-and-github.md` |
| 08 | AI-Assisted vs Agentic Development | `docs/ai-development/ai-assisted-vs-agentic.md` |

### Module 3 — Spec-Driven Development
| Chapter | Title | Location |
|---------|-------|----------|
| 09 | What Is Spec-Driven Development? | `docs/spec-driven-development/what-is-spec-driven-development.md` |
| 10 | Your First Spec-Kit Project | `docs/spec-driven-development/your-first-spec-kit-project.md` |

## Content Requirements

Every chapter MUST contain:

1. **Learning Objectives** — What the reader will learn
2. **Introduction** — Context and overview
3. **Why This Matters** — Practical relevance
4. **Core Concepts** — Main teaching content
5. **Practical Examples** — Real-world scenarios
6. **Freelancer Perspective** — How this applies to freelancing
7. **AI/Agent Perspective** — Where relevant, how AI tools help
8. **Step-by-Step Guidance** — Where relevant, clear instructions
9. **Practical Exercise** — Hands-on activity
10. **Common Mistakes** — Pitfalls to avoid
11. **Knowledge Check** — Questions to verify understanding
12. **Mini Task or Challenge** — Applied practice
13. **Summary** — Key takeaways
14. **What Comes Next** — Preview of next chapter

### Technical Chapters (05-10) Additional Requirements
- Prerequisites
- Environment requirements
- Commands where needed
- Code examples where appropriate
- Expected results
- Troubleshooting
- Verification steps

## Writing Style
- Professional but beginner-friendly
- Clear English
- Short paragraphs
- Explain technical terminology
- Avoid unnecessary jargon
- Use practical examples
- Use realistic freelancing scenarios
- Do NOT make unrealistic income promises
- Do NOT guarantee employment or client acquisition
- Clearly distinguish examples from guarantees

## Freelancing Principles
Teach ethical freelancing. Do NOT encourage:
- Fake portfolios
- Fake experience
- Misrepresentation
- Spam
- Client deception
- Fake reviews
- Copyright infringement
- Credential fraud

Teach:
- Honest positioning
- Real portfolios
- Clear communication
- Requirements gathering
- Scope management
- Professional proposals
- Client trust
- Secure development
- Proper project delivery

## AI Development Principles
Teach that AI is a development assistant/agent, not a replacement for understanding. Explain:
- AI-assisted coding
- Agentic coding
- Human review
- Testing
- Verification
- Security
- Context management
- Prompt/instruction quality

## Spec-Driven Development Content
Chapter 09 must explain the full workflow:
Idea → Requirements → Specification → Plan → Tasks → Implementation → Testing → Review → Deployment

Chapter 10 should provide a practical beginner-friendly Spec-Kit workflow using the actual project conventions.

## Docusaurus Structure
Place chapters logically within existing docs/ structure:
```
docs/
├── getting-started/
├── freelancing/        (Module 1: Chapters 01-04)
├── ai-development/     (Module 2: Chapters 05-08)
├── spec-driven-development/  (Module 3: Chapters 09-10)
├── projects/
├── resources/
└── about/
```

## RAG Preparation
Write content structured for future retrieval:
- Clear headings
- Explicit definitions
- Consistent terminology
- Lists and tables
- Code blocks
- Practical examples
- Explicit summaries

Do NOT add RAG-specific code.

## Urdu Preparation
- Keep technical terminology consistent
- Define important terms clearly
- Avoid ambiguous terminology
- Structure for future English ↔ Urdu translation

## Interactive Elements
Use Docusaurus MDX only where it provides genuine educational value. No unnecessary animations or complexity.

## Accessibility
- Proper heading hierarchy
- Accessible links
- Descriptive link text
- Proper code blocks
- No important information conveyed only through color

## Acceptance Criteria
- [ ] All 10 chapters written and published
- [ ] Each chapter has all 14 required sections
- [ ] Sidebar updated with all chapters in order
- [ ] No broken links
- [ ] Build succeeds
- [ ] No M4+ features implemented
- [ ] Content is honest and ethical
- [ ] Technical commands are accurate

## Version
1.0.0 | Created: 2026-08-17
