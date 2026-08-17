# Quick Reference: Hanif AI Freelancing Academy

**IMPORTANT**: M1 is specification-only and produces NO implementation code. This quickstart is for reference only. Implementation begins in M2.

## Project Structure

```
hanif-ai-freelancing-academy/
├── .opencode/           # OpenCode configuration
├── .specify/            # SpecKit templates and scripts
├── specs/               # Feature specifications
│   └── m1-foundation/   # M1 specification
├── docs/                # Documentation content
│   └── book/            # eBook content
├── src/                 # Source code
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── styles/          # CSS/styles
│   └── utils/           # Utility functions
├── static/              # Static assets
├── tests/               # Test files
└── package.json         # Dependencies
```

## Key Files

### Specification Files

- `.specify/memory/constitution.md` - Project principles and rules
- `specs/m1-foundation/spec.md` - M1 feature requirements
- `specs/m1-foundation/plan.md` - M1 implementation plan
- `specs/m1-foundation/tasks.md` - M1 task breakdown
- `specs/m1-foundation/checklist.md` - M1 progress tracking

### Configuration Files

- `opencode.md` - OpenCode configuration and rules
- `.specify/templates/` - SpecKit templates

## Development Workflow

### 1. Specification Phase

```bash
# Create/update specification
# File: specs/<feature>/spec.md
```

### 2. Planning Phase

```bash
# Create/update implementation plan
# File: specs/<feature>/plan.md
```

### 3. Task Breakdown

```bash
# Create/update task list
# File: specs/<feature>/tasks.md
```

### 4. Implementation

```bash
# Start development
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### 5. Review

```bash
# Create pull request
# Automated tests must pass
# Human review required
```

## Commands

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run serve        # Serve production build
npm run clear        # Clear Docusaurus cache
```

### Testing

```bash
npm test             # Run all tests
npm run test:unit    # Run unit tests
npm run test:integration  # Run integration tests
npm run test:e2e     # Run E2E tests
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run format       # Run Prettier
npm run typecheck    # Run TypeScript check
```

## Content Creation

### Chapter Structure

```markdown
---
title: Chapter Title
sidebar_position: 1
---

# Chapter Title

Content goes here...

## Section

More content...
```

### MDX Components

```jsx
import CodeExample from '@site/src/components/CodeExample';

<CodeExample code="..." language="javascript" />
```

## Architecture Principles

1. **Spec-Driven Development**: All features have specifications first
2. **Test-First**: Tests written before implementation
3. **Modular Components**: Reusable React components
4. **Content-Code Separation**: Content in docs/, code in src/
5. **Future-Ready**: Architecture supports RAG, AI Tutor, MCP

## Quality Standards

- **Testing**: All features must have tests
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Lighthouse score > 90
- **Responsive**: Mobile-first design
- **Documentation**: All components documented

## Future Integrations

### M4: RAG (Ask the Book)

- Vector database setup
- Content indexing
- Chat interface

### M5: AI Tutor

- AI conversation interface
- Learning mode selection
- Progress tracking

### M6: Translation Agent

- Translation API integration
- Technical terminology glossary
- UI for language switching

### M7: MCP Integration

- MCP server setup
- Tool definitions
- Agent integration

## Support

- **Issues**: Report at project repository
- **Documentation**: See docs/ directory
- **Specifications**: See specs/ directory