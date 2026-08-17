# Hanif AI Freelancing Academy Constitution

## Core Principles

### I. Spec-Driven Development is Mandatory
Every feature MUST have a clear, testable specification before implementation begins. No code is written without approved specs. All AI agents MUST follow project specifications.

### II. Requirements Clarity
Requirements must be clear, testable, and unambiguous before implementation. Vague requirements require clarification before proceeding.

### III. Human Approval Required
Human approval is required for:
- Important business decisions
- External actions (payments, emails, integrations)
- Architecture changes
- Spec deviations

### IV. Security & Privacy First
Security and privacy are first-class requirements. Secrets/API keys must NEVER be committed. All data handling must follow privacy best practices.

### V. Test-First Approach
Every major feature MUST have tests. Tests are written before implementation (TDD where applicable). Red-Green-Refactor cycle enforced.

### VI. Documentation as Product
Documentation is part of the product. All features, APIs, and architectural decisions must be documented. Documentation must be maintained alongside code.

### VII. Accessibility & Responsive Design
Accessibility (WCAG 2.1 AA) and responsive design are required for all UI components. No feature ships without mobile support.

### VIII. Modular & Extensible Architecture
The platform must be modular and extensible. Components must be loosely coupled. Future integrations (RAG, MCP, AI Tutor) must be anticipated in architecture.

### IX. AI Content Accuracy
AI-generated content must be reviewed for accuracy. No AI output is published without human verification.

### X. Multilingual Consistency
Technical terminology must remain consistent across English and Urdu. The system must support future multilingual expansion.

### XI. Future Integration Readiness
The architecture must allow future:
- MCP (Model Context Protocol) integrations
- RAG (Retrieval-Augmented Generation) functionality
- AI Tutor functionality
- Authentication & payments

### XII. Monetization Integrity
Monetization must not compromise the educational experience. Free tier must provide genuine value.

## Security Requirements

- All API keys stored in `.env` files (never committed)
- HTTPS enforced for all production endpoints
- Input validation on all user inputs
- Rate limiting on API endpoints
- Content Security Policy headers

## Performance Standards

- Page load time < 3 seconds on 3G
- Lighthouse score > 90 for performance
- First Contentful Paint < 1.5 seconds
- Time to Interactive < 3 seconds

## Development Workflow

1. **Specification Phase**: Create/update spec.md
2. **Planning Phase**: Create/update plan.md
3. **Task Breakdown**: Create/update tasks.md
4. **Implementation**: Follow TDD approach
5. **Review**: Human review before merge
6. **Documentation**: Update docs with changes

## Quality Gates

- All tests pass
- Linting passes
- TypeScript compilation succeeds
- Documentation updated
- Accessibility checks pass
- Performance budgets met

## Governance

This constitution supersedes all other practices. Amendments require:
1. Documented proposal
2. Human approval
3. Migration plan
4. Version bump

**Version**: 1.0.0 | **Ratified**: 2026-08-17 | **Last Amended**: 2026-08-17