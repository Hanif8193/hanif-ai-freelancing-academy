---
sidebar_position: 4
title: "Chapter 04: Git & GitHub for Freelancers"
---

# Chapter 04: Git & GitHub for Freelancers

## Learning Objectives

By the end of this chapter, you will be able to:

1. Explain what version control is and why Git is the industry standard
2. Distinguish between Git (the tool) and GitHub (the platform)
3. Understand repositories, commits, branches, remotes, merges, and pull requests
4. Initialize and configure a Git repository
5. Create meaningful commits with clear messages
6. Create and manage branches for features and fixes
7. Connect local repositories to GitHub and manage remote workflows
8. Collaborate safely with clients using branches and pull requests
9. Resolve basic merge conflicts
10. Protect secrets and sensitive files using `.gitignore`
11. Use Git history to inspect and review changes, especially from AI coding agents
12. Maintain a professional GitHub presence as a freelancer

## Introduction

In the previous chapter, you learned how AI coding agents can inspect repositories, modify code, run commands, and work through development tasks. Chapter 02 taught you that agents can read files, write code, execute tests, and iterate on their work.

But here is the critical question: **what happens when an agent makes a change you did not expect?**

That is where Git becomes essential. Git is the version-control foundation that makes AI-assisted development safe and manageable. It gives you visibility into every change, the ability to roll back mistakes, a record of what was modified and why, and controlled collaboration with clients and team members.

**Important**: AI can generate changes quickly, but Git gives the developer control, history, review capability, and rollback. Without Git, AI-assisted development is risky. With Git, it is professional and safe.

## Core Concepts

### What Is Version Control?

Version control is a system that records changes to files over time so that you can recall specific versions later. It answers three fundamental questions:

1. **What changed?** — See exactly what lines were added, modified, or deleted
2. **When did it change?** — View the complete history of modifications
3. **Who changed it?** — Identify the author of each change

Without version control, developers rely on file copies:

| Approach | What Happens | Problem |
|----------|-------------|---------|
| No version control | `project-v1.js`, `project-v2.js`, `project-final.js`, `project-final-FINAL.js` | Impossible to track what changed or undo specific changes |
| Manual backups | Copying folders before making changes | Easy to lose track, no comparison capability |
| **Git** | Automatic history of every change with full comparison ability | — |

Version control also enables:
- **Rollback**: Undo changes without losing other work
- **Comparison**: See exactly what differs between two versions
- **Collaboration**: Multiple people work on the same project without overwriting each other
- **Branching**: Work on new features without affecting the stable code
- **Accountability**: Know who made every change and why

### What Is Git?

Git is a distributed version-control system created by Linus Torvalds in 2005. It is the most widely used version control system in the world.

| Characteristic | What It Means |
|---------------|--------------|
| **Distributed** | Every developer has a complete copy of the project history |
| **Fast** | Most operations happen locally on your machine |
| **Flexible** | Supports many workflows and branching models |
| **Industry standard** | Used by virtually all professional development teams |
| **Free and open source** | No licensing cost |

### What Is GitHub?

GitHub is a cloud platform that hosts Git repositories and provides collaboration tools. Git is the version-control tool. GitHub is the platform where you share, collaborate, and manage your projects.

| Git | GitHub |
|-----|--------|
| Version-control tool (runs locally) | Cloud platform (runs in browser) |
| Tracks changes in files | Hosts repositories online |
| Works offline | Requires internet |
| Commands in terminal | Web interface + API |
| No collaboration features built-in | Pull requests, issues, actions, discussions |

GitHub adds:
- **Remote repositories**: Store your code online
- **Pull requests**: Review and discuss changes before merging
- **Issues**: Track bugs and feature requests
- **Actions**: Automate builds, tests, and deployments
- **Portfolio**: Showcase your work to potential clients

### Repository

A repository (repo) is a directory that contains your project files and the complete Git history of those files.

| Type | Location | Description |
|------|----------|-------------|
| **Local repository** | Your computer | Full copy of the project and history |
| **Remote repository** | GitHub (or another host) | Online copy for collaboration and backup |

When you clone a repository from GitHub, you create a local copy. When you push, you upload your local changes to the remote. When you pull, you download remote changes to your local copy.

### Commit

A commit is a snapshot of your project at a specific point in time. Each commit records:
- **What changed**: The exact lines added, modified, or deleted
- **When**: A timestamp
- **Who**: The author's name and email
- **Why**: A commit message explaining the purpose

Commits form a chain. Each commit points to the one before it, creating a complete history of your project.

### Branch

A branch is a parallel line of development. The main branch (usually called `main`) holds the stable, working code. Feature branches allow you to work on new features or fixes without affecting the main code.

```text
main:        A --- B --- C --- D --- E
                          \
feature:                    F --- G
```

In this diagram, `F` and `G` are commits on a feature branch that diverges from `main` at commit `C`. When the feature is ready, the branch merges back into `main`.

### Merge

Merging is the process of combining changes from one branch into another. When you merge a feature branch into `main`, the changes from the feature branch become part of the main codebase.

### Remote

A remote is a version of your repository hosted on a server (like GitHub). The default remote is called `origin`. When you push, you upload to the remote. When you pull, you download from the remote.

### Pull Request

A pull request (PR) is a proposal to merge changes from one branch into another. It provides a space for review, discussion, and approval before the changes become part of the main branch. Even freelancers working alone benefit from PRs because they create review points and a clear history of what was approved.

## The Git Working Model

Git has three main areas where your files exist:

```text
Working Directory (your actual files)
        ↓
    git add
        ↓
Staging Area (preview of the next commit)
        ↓
    git commit
        ↓
Local Repository (committed history)
        ↓
    git push
        ↓
Remote Repository (GitHub)
```

### Understanding Each Area

| Area | What It Contains | How to Move Files |
|------|-----------------|------------------|
| **Working Directory** | Your actual project files | Edit files directly |
| **Staging Area** | A preview of what will be in the next commit | `git add <file>` or `git add .` |
| **Local Repository** | Committed snapshots of your project | `git commit -m "message"` |
| **Remote Repository** | GitHub's copy of your repository | `git push` or `git pull` |

### The Basic Workflow

```bash
# 1. Make changes to files in your working directory
# (Edit files in your editor)

# 2. Check what changed
git status

# 3. Stage the changes you want to commit
git add src/components/Header.tsx

# 4. Commit with a meaningful message
git commit -m "Update header layout for mobile responsiveness"

# 5. Push to GitHub
git push origin main
```

Each command moves your changes through the pipeline. `git status` shows you what is in each area. `git add` moves files from the working directory to the staging area. `git commit` moves staged files to the local repository. `git push` uploads to GitHub.

## Essential Git Commands

Here is a comprehensive reference of the commands you will use most frequently:

| Command | Purpose | When to Use | Example |
|---------|---------|------------|---------|
| `git init` | Create a new repository | Starting a new project | `git init` |
| `git clone <url>` | Download an existing repository | Joining an existing project | `git clone https://github.com/user/repo.git` |
| `git status` | Show the state of working directory and staging area | Before every commit | `git status` |
| `git add <file>` | Stage specific files | Preparing changes for commit | `git add src/App.tsx` |
| `git add .` | Stage all changes | When all changes should be committed | `git add .` |
| `git commit -m "msg"` | Save staged changes with a message | After staging changes | `git commit -m "Add login form"` |
| `git log` | Show commit history | Reviewing what happened | `git log --oneline` |
| `git diff` | Show unstaged changes | Reviewing what changed before staging | `git diff` |
| `git diff --staged` | Show staged changes | Reviewing what will be committed | `git diff --staged` |
| `git branch` | List branches | Checking available branches | `git branch` |
| `git branch <name>` | Create a new branch | Starting new feature work | `git branch feature/contact-form` |
| `git switch <name>` | Switch to a branch | Moving between branches | `git switch feature/contact-form` |
| `git switch -c <name>` | Create and switch to a new branch | Starting new work | `git switch -c fix/mobile-nav` |
| `git merge <branch>` | Merge a branch into current branch | Combining completed work | `git merge feature/contact-form` |
| `git push` | Upload local commits to remote | Sharing work on GitHub | `git push origin main` |
| `git pull` | Download and merge remote changes | Getting latest changes | `git pull origin main` |
| `git fetch` | Download remote changes without merging | Checking for updates | `git fetch origin` |
| `git restore <file>` | Discard changes in working directory | Undoing uncommitted changes | `git restore src/App.tsx` |
| `git stash` | Temporarily store uncommitted changes | Switching branches with uncommitted work | `git stash` |
| `git stash pop` | Restore stashed changes | Returning to stashed work | `git stash pop` |

### Commands to Use with Caution

| Command | Risk | When It Might Be Used |
|---------|------|----------------------|
| `git reset --hard` | Discards all uncommitted changes permanently | When you need to completely start over |
| `git push --force` | Overwrites remote history | Only after careful consideration |
| `git rebase` | Rewrites commit history | Advanced workflows — avoid as a beginner |

## Git Setup

### Installing Git

| Operating System | Method |
|-----------------|--------|
| **Windows** | Download from git-scm.com and run the installer |
| **macOS** | Install Xcode Command Line Tools: `xcode-select --install` |
| **Linux** | Use your package manager: `sudo apt install git` (Ubuntu) |

### Verifying Installation

```bash
git --version
# Output: git version 2.x.x
```

### Configuring Git

```bash
# Set your name (appears in commit history)
git config --global user.name "Your Name"

# Set your email (should match your GitHub email)
git config --global user.email "your.email@example.com"

# Verify your configuration
git config --list
```

### SSH vs HTTPS

GitHub supports two ways to authenticate when pushing and pulling:

| Method | How It Works | Pros | Cons |
|--------|-------------|------|------|
| **HTTPS** | Use a personal access token | Simple setup, works everywhere | Token needed for every push |
| **SSH** | Use an SSH key pair | No token needed after setup | Requires key generation |

For beginners, HTTPS with a personal access token is simpler. For long-term use, SSH is more convenient.

## GitHub Setup

### Creating a Repository

| Step | Action |
|------|--------|
| 1 | Click the "+" icon on GitHub |
| 2 | Select "New repository" |
| 3 | Name your repository (use lowercase, hyphens) |
| 4 | Choose public or private |
| 5 | Add a description |
| 6 | Initialize with a README (recommended) |
| 7 | Add a `.gitignore` template |
| 8 | Choose a license if applicable |
| 9 | Click "Create repository" |

### Public vs Private Repositories

| Visibility | Who Can See It | Best For |
|-----------|---------------|----------|
| **Public** | Anyone on the internet | Open-source projects, portfolio pieces |
| **Private** | Only you and invited collaborators | Client work, proprietary code, experiments |

**Freelancer rule**: Use private repositories for client work. Use public repositories for portfolio pieces and open-source contributions.

### Connecting an Existing Local Repository

```bash
# Add GitHub as the remote
git remote add origin https://github.com/username/repo-name.git

# Push and set upstream tracking
git push -u origin main
```

## Professional Git Workflow

Here is the workflow that professional freelancers follow:

```text
Create / Clone Repository
        ↓
Inspect Project
        ↓
Create Branch for Task
        ↓
Make Changes
        ↓
Review Diff (git diff)
        ↓
Run Tests
        ↓
Stage Changes (git add)
        ↓
Commit with Meaningful Message
        ↓
Push Branch to GitHub
        ↓
Create Pull Request (if collaborating)
        ↓
Review and Merge
        ↓
Deploy / Deliver
```

### Why This Workflow Matters

Without this workflow, developers often:
- Make changes directly to the main branch with no review
- Commit everything at once with no clear history
- Lose work because there is no remote backup
- Cannot undo changes because there is no history
- Cannot show clients what changed between deliveries

With this workflow, every change is tracked, reviewed, tested, and recorded.

## Commit Best Practices

### The Anatomy of a Good Commit

A good commit has two parts:
1. **A focused set of changes** — one logical unit of work
2. **A clear message** — explaining what changed and why

### Commit Message Format

Use the imperative mood (as if giving a command):

| Bad | Good | Why |
|-----|------|-----|
| "fixed stuff" | "Fix login validation for empty email field" | Specific and descriptive |
| "update" | "Update header layout for mobile responsiveness" | Explains what changed |
| "changes" | "Add user authentication middleware" | Describes the actual change |
| "WIP" | "Implement contact form with email validation" | Clear even as a checkpoint |
| "final" | "Resolve all merge conflicts and update README" | Explains the resolution |

### Commit Categories

| Category | Prefix | Example |
|----------|--------|---------|
| **Feature** | `Add` | `Add user registration form` |
| **Bug fix** | `Fix` | `Fix broken image link on homepage` |
| **Documentation** | `Update` | `Update README with setup instructions` |
| **Refactoring** | `Refactor` | `Refactor authentication middleware for clarity` |
| **Tests** | `Add` | `Add unit tests for pricing calculator` |
| **Configuration** | `Configure` | `Configure ESLint for TypeScript` |
| **Performance** | `Optimize` | `Optimize database query for product listing` |
| **Security** | `Fix` | `Fix SQL injection vulnerability in search endpoint` |

### Before/After: Commit Messages

| Weak | Strong |
|------|--------|
| `fix` | `Fix contact form submission error caused by missing validation` |
| `update code` | `Refactor user authentication to use session tokens` |
| `new feature` | `Add dark mode toggle to settings page with localStorage persistence` |
| `changes` | `Update API endpoint to return paginated results` |
| `bug` | `Fix mobile navigation menu not closing after link click` |

## Branching Strategies

### Branch Naming Conventions

Use descriptive names that communicate the purpose:

| Branch Type | Naming Pattern | Example |
|------------|---------------|---------|
| **Feature** | `feature/<description>` | `feature/contact-form` |
| **Bug fix** | `fix/<description>` | `fix/mobile-navbar` |
| **Hotfix** | `hotfix/<description>` | `hotfix/security-patch` |
| **Documentation** | `docs/<description>` | `docs/api-documentation` |
| **Experiment** | `experiment/<description>` | `experiment/new-pricing-page` |

### A Simple Branching Workflow for Freelancers

```text
main (stable, deployable)
  |
  +-- feature/contact-form
  |     Work on contact form
  |     Commit, push, review
  |     Merge back to main
  |
  +-- fix/mobile-navbar
  |     Fix the mobile navigation
  |     Commit, push, review
  |     Merge back to main
  |
  +-- feature/client-dashboard
        Build the client dashboard
        Commit, push, review
        Merge back to main
```

Each feature or fix gets its own branch. When the work is complete and tested, it merges back into `main`. This keeps `main` stable and deployable at all times.

## Pull Requests

A pull request (PR) is a proposal to merge changes from one branch into another. It provides a space for review, discussion, and approval.

### Why PRs Matter Even for Solo Freelancers

Even if you are the only person working on a project, PRs provide:
- **A review point**: Forces you to look at all your changes before merging
- **A discussion thread**: Documents why changes were made
- **A merge record**: Creates a clear history of approved changes
- **A CI trigger**: Can automatically run tests before merging

### Creating a Pull Request

| Step | Action |
|------|--------|
| 1 | Push your branch to GitHub |
| 2 | Go to the repository on GitHub |
| 3 | Click "Compare & pull request" |
| 4 | Write a clear title and description |
| 5 | Review the diff yourself |
| 6 | Create the pull request |
| 7 | Review, approve, and merge |

### Writing Good PR Descriptions

| Weak PR Description | Strong PR Description |
|--------------------|-----------------------|
| "Updated stuff" | "Add contact form with email validation. Includes form component, API route, validation logic, and unit tests. Fixes issue #12." |
| "New feature" | "Implement user dashboard with statistics display. Adds three new components, connects to existing API, and includes responsive design for mobile." |
| "Bug fix" | "Fix login error when email contains special characters. Root cause: regex pattern did not escape `+` character. Added proper escaping and test coverage." |

## Git Diff and Code Review

`git diff` is one of the most important commands for professional development, especially when working with AI coding agents.

### Reviewing Changes Before Committing

```bash
# See unstaged changes
git diff

# See staged changes (what will be in the next commit)
git diff --staged

# See changes in a specific file
git diff src/components/Header.tsx

# See changes between two commits
git diff abc123 def456
```

### Why Reviewing Diffs Matters with AI Agents

When an AI coding agent modifies your codebase, it may change more files than expected. Always review the diff before committing:

```bash
# After an AI agent makes changes:
git status          # See which files were modified
git diff            # See exactly what changed in each file
git diff --staged   # Review staged changes before committing
```

**Critical rule**: Never assume an AI agent made only the changes you expected. Review the diff. Check for:
- Unrelated file changes
- Unexpected dependency modifications
- Removed code that should have been kept
- Security-sensitive changes

## AI Coding Agents + Git

This section connects Chapter 02 (AI Coding Agents) with Chapter 04 (Git). Git is the safety net that makes AI-assisted development professional and manageable.

### The Safe AI Agent Workflow with Git

```text
Clean Working Tree
        ↓
Create Checkpoint Commit
        ↓
Create Task Branch
        ↓
Ask Agent to Work
        ↓
Inspect Changes (git status + git diff)
        ↓
Review Every File Changed
        ↓
Run Tests
        ↓
Fix Any Problems
        ↓
Commit Verified Changes
        ↓
Push to GitHub
```

### Step-by-Step: Using Git with an AI Agent

**Step 1: Ensure a clean working tree**
```bash
git status
# Should show "nothing to commit, working tree clean"
```

**Step 2: Create a checkpoint commit (optional but recommended)**
```bash
git add .
git commit -m "Checkpoint: current state before AI agent task"
```

**Step 3: Create a branch for the agent's task**
```bash
git switch -c feature/contact-form
```

**Step 4: Give the agent its task**

Provide the agent with context, goals, constraints, and verification criteria.

**Step 5: Inspect what the agent changed**
```bash
git status          # Which files were modified?
git diff            # What exactly changed?
```

**Step 6: Review every change**
- Read the code for correctness
- Check for security issues
- Verify no unrelated files were changed
- Ensure project conventions are followed

**Step 7: Run tests**
```bash
npm test            # Run the test suite
npm run typecheck   # Run the type checker
```

**Step 8: Fix any problems**

If the agent's changes have issues, fix them or ask the agent to fix them.

**Step 9: Commit the verified changes**
```bash
git add .
git commit -m "Add contact form with validation and API route"
```

**Step 10: Push to GitHub**
```bash
git push origin feature/contact-form
```

### What If the Agent Made Bad Changes?

```bash
# Discard all uncommitted changes and start over
git restore .

# Or switch back to main and delete the branch
git switch main
git branch -D feature/contact-form
```

Git gives you the ability to completely undo the agent's work if needed. This is why Git is essential for AI-assisted development.

## Git and GitHub for Freelancers

### Client Projects

| Practice | Why It Matters |
|----------|---------------|
| **Private repositories** | Client code should not be public |
| **Clear directory structure** | Makes the project easy to navigate |
| **README with setup instructions** | Client can understand and run the project |
| **Meaningful commit history** | Shows professional development process |
| **Branch per feature** | Clean, reviewable development process |

### Client Handoff

When delivering a project to a client, the repository should include:

| Deliverable | What It Contains |
|------------|-----------------|
| **Source code** | All project files, well-organized |
| **README** | Setup instructions, dependencies, environment variables |
| **.gitignore** | Proper exclusions for secrets and build artifacts |
| **Documentation** | API docs, architecture notes, deployment instructions |
| **Environment variable guide** | What variables are needed (not the actual values) |
| **Deployment instructions** | How to deploy or where it is deployed |

**Never include**: API keys, passwords, tokens, or other secrets in the repository.

### GitHub as a Portfolio

Your GitHub profile demonstrates your professional capabilities:

| Signal | What It Communicates |
|--------|---------------------|
| **Clean repositories** | You organize code professionally |
| **Meaningful READMEs** | You communicate technical work clearly |
| **Regular commit history** | You are active and disciplined |
| **Relevant pinned projects** | You focus on your niche |
| **Documentation quality** | You think about maintainability |
| **Test coverage** | You care about quality |

## GitHub Profile for Freelancers

Your GitHub profile is a technical portfolio that potential clients and collaborators will examine.

### Profile Optimization

| Element | Best Practice |
|---------|--------------|
| **Profile photo** | Professional, consistent with other platforms |
| **Bio** | Clear positioning statement (connects to Chapter 05) |
| **Pinned repositories** | 6 projects that demonstrate your niche expertise |
| **Repository descriptions** | Clear, specific descriptions of what each project does |
| **README files** | Every pinned repository should have a README |
| **Screenshots/demos** | Visual proof that your projects work |
| **Technologies** | List the stack used in each project |
| **Commit history** | Regular, meaningful commits (not artificial activity) |

## Security and Secrets

### What Should Never Be in a Repository

| Item | Why It Is Dangerous |
|------|-------------------|
| `.env` files | Contain API keys, database URLs, secrets |
| API keys and tokens | Can be used to access paid services |
| Database passwords | Grant access to sensitive data |
| Private certificates | Compromise security infrastructure |
| Hardcoded credentials | Expose authentication information |

### The `.gitignore` File

A `.gitignore` file tells Git which files to exclude from tracking:

```gitignore
# Dependencies
node_modules/
npm-debug.log

# Build output
dist/
build/
.next/

# Environment variables
.env
.env.local
.env.*.local

# IDE files
.vscode/
.idea/
*.swp

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Testing coverage
coverage/
```

### What to Do If a Secret Is Accidentally Committed

If you accidentally commit a secret, follow these steps immediately:

1. **Revoke or rotate the secret** — Generate a new key or token
2. **Remove the file from the working tree** — Delete or move the secret
3. **Update `.gitignore`** — Add the file to prevent future commits
4. **Commit the removal** — `git commit -m "Remove accidentally committed secret"`
5. **Push the change** — `git push`
6. **Clean repository history if necessary** — Secrets in old commits are still accessible. Use `git filter-branch` or BFG Repo-Cleaner to remove them from history
7. **Verify the replacement** — Ensure the new secret works

**Critical**: Deleting a file from the latest commit does not make the secret safe. The secret still exists in the Git history. Anyone with repository access can find it.

## Merge Conflicts

### Why Conflicts Happen

A merge conflict occurs when two branches have modified the same lines in the same file. Git cannot automatically determine which version is correct.

### What Conflict Markers Look Like

```text
[CONFLICT START - CURRENT VERSION]
export const API_URL = "https://api.production.com";

[CONFLICT SEPARATOR]

export const API_URL = "https://api.staging.com";
[CONFLICT END - INCOMING BRANCH]
```

In a real Git merge conflict, Git uses the markers `<<<<<<<`, `=======`, and `>>>>>>>` to separate the current and incoming versions. The labels above are used instead of literal conflict markers so this educational example does not trigger repository validation tools. The content between the start marker and the separator is your current version. The content between the separator and the end marker is the incoming version from the other branch.

### How to Resolve a Merge Conflict

| Step | Action |
|------|--------|
| 1 | Open the conflicting file in your editor |
| 2 | Find the conflict markers |
| 3 | Decide which version to keep (or combine both) |
| 4 | Remove the conflict markers |
| 5 | Save the file |
| 6 | Test the result |
| 7 | Stage the resolved file: `git add <file>` |
| 8 | Complete the merge: `git commit` |

### What NOT to Do

- Do not blindly choose "ours" or "theirs" without reading both versions
- Do not delete changes without understanding what they do
- Do not commit files that still contain conflict markers
- Do not skip testing after resolving conflicts

## Recovery and Undo

### Undoing Uncommitted Changes

```bash
# Discard changes in working directory (keeps staged changes)
git restore src/file.ts

# Unstage a file (keeps changes in working directory)
git restore --staged src/file.ts
```

### Undoing a Committed Change

```bash
# Create a new commit that reverses a previous commit (safe)
git revert <commit-hash>

# Move HEAD to a previous commit (rewrites history — use with caution)
git reset --soft <commit-hash>    # Keeps changes staged
git reset --mixed <commit-hash>   # Keeps changes in working directory
git reset --hard <commit-hash>    # Discards all changes (dangerous)
```

### Temporarily Storing Work

```bash
# Stash current changes
git stash

# List stashes
git stash list

# Restore the most recent stash
git stash pop

# Apply a specific stash
git stash apply stash@{1}
```

### When to Use Each

| Situation | Command | Safety |
|-----------|---------|--------|
| Undo uncommitted changes | `git restore` | Safe — changes are local |
| Undo last commit but keep changes | `git reset --soft HEAD~1` | Safe — changes preserved |
| Reverse a published commit | `git revert` | Safe — creates undo commit |
| Temporarily shelve work | `git stash` | Safe — stash can be restored |
| Completely discard changes | `git reset --hard` | Dangerous — irreversible |

**Warning**: Never use `git push --force` on branches that others are working on. It overwrites remote history and can destroy other people's work.

## Collaboration with Clients

### Scenario 1: Receiving a Repository from a Client

The client gives you access to their existing GitHub repository.

| Step | Action |
|------|--------|
| 1 | Clone the repository: `git clone <url>` |
| 2 | Read the README and documentation |
| 3 | Inspect the project structure |
| 4 | Check the current branch and recent commits |
| 5 | Create a branch for your work |
| 6 | Ask questions about anything unclear |

### Scenario 2: Working in a Client's Private Repository

| Step | Action |
|------|--------|
| 1 | Ensure you have the correct permissions |
| 2 | Create a branch for each feature or fix |
| 3 | Never commit directly to `main` |
| 4 | Create pull requests for review |
| 5 | Respond to feedback promptly |

### Scenario 3: Client Requests a Feature

| Step | Action |
|------|--------|
| 1 | Understand the requirement (ask clarifying questions) |
| 2 | Create a feature branch |
| 3 | Implement the feature |
| 4 | Test thoroughly |
| 5 | Create a pull request with a clear description |
| 6 | Request the client's review |

### Scenario 4: Urgent Bug Fix

| Step | Action |
|------|--------|
| 1 | Create a `hotfix/` branch from `main` |
| 2 | Fix the bug |
| 3 | Test the fix |
| 4 | Create a pull request |
| 5 | Merge quickly after review |
| 6 | Deploy immediately |

### Scenario 5: Project Handoff

| Step | Action |
|------|--------|
| 1 | Ensure all work is committed and pushed |
| 2 | Update the README with current setup instructions |
| 3 | Document environment variables needed |
| 4 | Remove any personal configurations |
| 5 | Transfer repository ownership if needed |
| 6 | Provide the client with access instructions |

## Practical Case Study

### Client Request

> "Add a contact form to my Next.js website."

### Step-by-Step Workflow

| Step | Action | Command/Tool |
|------|--------|-------------|
| 1 | Clone the repository | `git clone https://github.com/client/website.git` |
| 2 | Inspect the project | Read `package.json`, project structure |
| 3 | Create a feature branch | `git switch -c feature/contact-form` |
| 4 | Inspect existing components | Read `src/components/` |
| 5 | Implement the form | Build the component and API route |
| 6 | Review the diff | `git diff` — check all changes |
| 7 | Run tests | `npm test` |
| 8 | Run type check | `npm run typecheck` |
| 9 | Stage changes | `git add src/components/ContactForm.tsx src/app/api/contact/route.ts` |
| 10 | Commit | `git commit -m "Add contact form with validation and email API route"` |
| 11 | Push | `git push origin feature/contact-form` |
| 12 | Create PR | Write clear description, link to issue |
| 13 | Client reviews | Client checks the preview deployment |
| 14 | Client requests change | "Can you add a phone number field?" |
| 15 | Update branch | Add phone field, commit, push |
| 16 | Client approves | Client approves the PR |
| 17 | Merge | Merge `feature/contact-form` into `main` |
| 18 | Deploy | Vercel auto-deploys from `main` |
| 19 | Report completion | "Contact form is live. Here is what was added..." |

## Practical Exercises

**Exercise 7.1: Initialize a Repository**

Create a new repository from scratch:
1. Create a new directory
2. Initialize Git: `git init`
3. Create a README.md with a project description
4. Create a `.gitignore` file
5. Make your first commit
6. Verify with `git log`

**Exercise 7.2: Create Meaningful Commits**

Practice writing good commit messages:
1. Create a file with some content
2. Stage and commit with a descriptive message
3. Modify the file
4. Stage and commit with a different descriptive message
5. View the history with `git log --oneline`
6. Verify both messages are clear and specific

**Exercise 7.3: Inspect Git History**

Practice reading Git history:
1. Create a repository with at least 5 commits
2. View the full log: `git log`
3. View the compact log: `git log --oneline`
4. View changes in a specific commit: `git show <hash>`
5. View the diff between two commits: `git diff <hash1> <hash2>`

**Exercise 7.4: Create and Merge a Branch**

Practice branching:
1. Create a new branch: `git switch -c feature/test-branch`
2. Make changes on the branch
3. Commit the changes
4. Switch back to main: `git switch main`
5. Merge the branch: `git merge feature/test-branch`
6. Verify the changes are now on main

**Exercise 7.5: Connect to GitHub**

Practice the full GitHub workflow:
1. Create a repository on GitHub
2. Connect your local repository: `git remote add origin <url>`
3. Push to GitHub: `git push -u origin main`
4. Verify the repository appears on GitHub

**Exercise 7.6: Create a Pull Request**

Practice the PR workflow:
1. Create a feature branch
2. Make changes and commit
3. Push the branch to GitHub
4. Create a pull request with a clear description
5. Review the diff yourself
6. Merge the pull request

**Exercise 7.7: Review an AI-Generated Change**

Practice reviewing AI agent output:
1. Use an AI tool to generate code for a small task
2. Run `git status` to see which files were modified
3. Run `git diff` to review every change
4. Identify any issues (security, correctness, unnecessary changes)
5. Write a brief review of the changes

**Exercise 7.8: Resolve a Merge Conflict**

Practice conflict resolution:
1. Create two branches from the same commit
2. Modify the same file differently on each branch
3. Merge one branch into main
4. Merge the second branch — a conflict will occur
5. Resolve the conflict by choosing the correct version
6. Test that the result works

## Mini Tasks / Challenge

### Challenge 1: Professional Git Workflow

Build a professional Git workflow for a fictional client project:

1. Create a repository with a README, `.gitignore`, and initial project structure
2. Create 3 feature branches for different features
3. Make commits on each branch with clear messages
4. Create pull requests for each feature
5. Review your own diffs
6. Merge each pull request
7. Verify the final main branch has a clean, professional history

**Success criteria**: Clean commit history, meaningful messages, no secrets committed, all branches merged.

### Challenge 2: AI Agent Change Review

Take an AI-generated multi-file change and perform a professional review:

1. Use an AI agent to make changes to a small project
2. Run `git status` and `git diff`
3. Review every changed file for:
   - Correctness
   - Security
   - Maintainability
   - Unnecessary changes
   - Convention adherence
4. Write a review report with specific findings
5. Fix any issues you find
6. Commit the corrected changes

**Success criteria**: Complete review report, all issues identified and fixed, clean commit.

## Knowledge Check

1. What is the difference between Git and GitHub?
2. What does `git add .` do, and what area does it move files to?
3. What is the difference between `git pull` and `git fetch`?
4. Why should you create branches for new features instead of working on `main`?
5. What is a pull request, and why is it useful even for solo freelancers?
6. What does `git diff` show you, and why is it important when working with AI agents?
7. What should you do if you accidentally commit a secret?
8. What are conflict markers, and how do you resolve a merge conflict?
9. What is the difference between `git reset --soft`, `git reset --mixed`, and `git reset --hard`?
10. Why is it important to use private repositories for client work?
11. What should a professional client handoff include?
12. How does Git make AI-assisted development safer?

## Before/After Examples

| Weak Practice | Why It Is Weak | Strong Practice | Why It Works Better |
|--------------|---------------|----------------|-------------------|
| `git commit -m "fix"` | No context, no specificity | `git commit -m "Fix login validation for empty email field"` | Clear, specific, traceable |
| Working directly on `main` | No review point, risk to stable code | Create a feature branch, work there, merge after review | Safe, reviewable, professional |
| Accepting AI changes without review | Unknown what changed | Run `git diff`, review every file, then commit | Full visibility and control |
| Committing `.env` file | Exposes secrets | Add `.env` to `.gitignore`, never commit secrets | Security maintained |
| `git push --force` on shared branch | Overwrites others' work | Use `git pull` and resolve conflicts | Preserves everyone's work |
| One giant commit for everything | Impossible to track individual changes | Small, focused commits per feature | Clear history, easy rollback |
| No README in repository | Client cannot understand the project | Comprehensive README with setup instructions | Professional, self-documenting |
| Deleting bad commits from history | Rewrites history, causes confusion | Use `git revert` to create an undo commit | Safe, preserves history |

## Common Beginner Mistakes

### 1. Committing Secrets

**Problem**: API keys, passwords, or tokens end up in the repository.
**Why it happens**: The developer forgets to check `.gitignore` before committing.
**Why it is dangerous**: Secrets are exposed to anyone with repository access.
**Better approach**: Always check `.gitignore` before committing. Use environment variables for secrets.

### 2. Vague Commit Messages

**Problem**: Messages like "fix", "update", or "changes" that provide no context.
**Why it happens**: The developer is in a hurry or does not understand the value of good messages.
**Why it is dangerous**: Impossible to understand the project history or find specific changes.
**Better approach**: Write specific, imperative messages that explain what changed and why.

### 3. Committing Everything Blindly

**Problem**: Running `git add .` and committing without checking what is staged.
**Why it happens**: The developer wants to commit quickly.
**Why it is dangerous**: Unrelated files, temporary files, or secrets may be included.
**Better approach**: Always run `git status` and `git diff --staged` before committing.

### 4. Never Checking `git status`

**Problem**: Making commits without understanding the current state of the repository.
**Why it happens**: The developer assumes everything is fine.
**Why it is dangerous**: May commit the wrong files, miss unstaged changes, or be on the wrong branch.
**Better approach**: Make `git status` a habit before every commit.

### 5. Not Reviewing Diffs

**Problem**: Committing changes without reviewing what actually changed.
**Why it happens**: The developer trusts the AI agent or their own memory.
**Why it is dangerous**: Unintended changes, security issues, or broken code may be committed.
**Better approach**: Always review `git diff` before committing.

### 6. Working Directly on `main`

**Problem**: Making changes directly on the main branch without using feature branches.
**Why it happens**: The developer thinks it is simpler for small changes.
**Why it is dangerous**: No review point, risk to stable code, harder to undo specific changes.
**Better approach**: Create a branch for every feature or fix, no matter how small.

### 7. Force Pushing Unnecessarily

**Problem**: Using `git push --force` to overwrite remote history.
**Why it happens**: The developer wants to "fix" something in the history.
**Why it is dangerous**: Overwrites other people's work, destroys history.
**Better approach**: Use `git revert` to undo changes safely. Only force push on personal branches.

### 8. Ignoring Merge Conflicts

**Problem**: Panicking when merge conflicts occur or choosing versions randomly.
**Why it happens**: The developer does not understand how conflicts work.
**Why it is dangerous**: Wrong version may be chosen, breaking the code.
**Better approach**: Read both versions carefully, understand the intent, choose correctly, and test.

### 9. Forgetting to Pull

**Problem**: Working on a branch without pulling the latest changes from main.
**Why it happens**: The developer forgets that others may have made changes.
**Why it is dangerous**: Creates unnecessary conflicts and may build on outdated code.
**Better approach**: Pull main into your feature branch regularly: `git pull origin main`.

### 10. Not Documenting Repositories

**Problem**: Repositories without README files or setup instructions.
**Why it happens**: The developer thinks the code speaks for itself.
**Why it is dangerous**: Clients and collaborators cannot understand or run the project.
**Better approach**: Every repository should have a README with setup instructions.

### 11. Trusting AI-Generated Changes

**Problem**: Committing AI agent output without reviewing it.
**Why it happens**: The developer assumes the agent made correct changes.
**Why it is dangerous**: The agent may have changed unrelated files, introduced bugs, or exposed secrets.
**Better approach**: Review every file the agent changed. Run tests. Verify before committing.

### 12. Deleting Repository History

**Problem**: Using `git reset --hard` or force pushing to "clean up" history.
**Why it happens**: The developer wants a clean history.
**Why it is dangerous**: Destroys the ability to recover previous states.
**Better approach**: Use `git revert` to undo changes. Keep history intact.

## Freelancer Perspective

Git and GitHub are not just technical tools — they are part of professional project management and client delivery.

### What Works

- Creating a branch for every feature or fix, even small ones
- Writing clear, specific commit messages that explain the "why"
- Reviewing diffs before every commit, especially after AI agent changes
- Using private repositories for client work
- Providing clients with access to see progress
- Including comprehensive READMEs in every repository
- Maintaining a clean, professional GitHub profile

### What Does Not Work

- Committing directly to main without review
- Vague commit messages that provide no context
- Sharing repository access without proper permissions
- Including secrets or sensitive data in repositories
- Ignoring merge conflicts or resolving them incorrectly
- Not documenting the project for the client
- Treating Git as an afterthought instead of a professional practice

### What Beginners Misunderstand

- **Git is not just for teams.** Solo freelancers benefit enormously from version control — rollback, history, review, and backup.
- **Commit messages are not for you.** They are for your future self, your client, and anyone who maintains the project after you.
- **GitHub is a portfolio.** Potential clients look at your repositories. Clean, well-documented projects demonstrate professionalism.
- **AI agents need Git.** Without Git, AI-assisted development has no safety net. With Git, every agent change is reviewable and reversible.

### Professional Client Expectations

Clients expect:
- A clean repository with organized code
- Clear documentation and setup instructions
- A history of professional development practices
- Secure handling of their code and data
- Easy handoff when the project is complete

### The Long Game

The freelancers who maintain professional Git practices build a compounding advantage. Their GitHub profiles demonstrate consistent quality. Their repository histories show disciplined development. Their client handoffs are smooth and professional. This reputation attracts better clients and higher-value projects over time.

## 30-Day Practice Plan

### Week 1: Git Foundations

| Day | Task | Deliverable |
|-----|------|-------------|
| 1 | Install and configure Git | Working Git installation |
| 2 | Create a repository, make 3 commits | Repository with clear history |
| 3 | Practice `git status`, `git diff`, `git log` | Comfortable with status inspection |
| 4 | Create branches and switch between them | Branch management skills |
| 5 | Merge a branch into main | Successful merge |
| 6 | Practice undoing changes with `git restore` | Recovery skills |
| 7 | Review and reflect on Week 1 | Summary of learnings |

### Week 2: GitHub + Collaboration

| Day | Task | Deliverable |
|-----|------|-------------|
| 8 | Create a GitHub account and repository | GitHub setup complete |
| 9 | Connect a local repository to GitHub | Local-to-remote workflow |
| 10 | Push and pull changes | Basic remote workflow |
| 11 | Create a pull request | PR workflow understanding |
| 12 | Review and merge a pull request | Review skills |
| 13 | Practice with a `.gitignore` | Proper file exclusion |
| 14 | Review and reflect on Week 2 | Summary of learnings |

### Week 3: Professional Workflows

| Day | Task | Deliverable |
|-----|------|-------------|
| 15 | Practice the full professional workflow | End-to-end workflow |
| 16 | Write meaningful commit messages for 10 commits | Commit message skills |
| 17 | Create a branch, implement a feature, create PR | Feature branch workflow |
| 18 | Practice resolving a merge conflict | Conflict resolution |
| 19 | Set up a repository with README and documentation | Professional repository |
| 20 | Review Git history of an open-source project | History analysis skills |
| 21 | Review and reflect on Week 3 | Summary of learnings |

### Week 4: AI-Assisted + Freelance Workflow

| Day | Task | Deliverable |
|-----|------|-------------|
| 22 | Use an AI agent with the safe Git workflow | AI + Git workflow |
| 23 | Review an AI-generated diff thoroughly | Diff review skills |
| 24 | Practice the client handoff workflow | Handoff documentation |
| 25 | Create a professional GitHub profile | Optimized profile |
| 26 | Build a complete project with branches and PRs | Professional project |
| 27 | Practice the security checklist for secrets | Security awareness |
| 28 | Review and refine your 30-day practice | Updated checklist |
| 29 | Share your GitHub profile for feedback | External review |
| 30 | Reflect on the full month — plan next steps | Monthly reflection |

**After 30 days**: You should be comfortable with the full Git and GitHub workflow, including branching, pull requests, merge conflicts, and using Git with AI coding agents. Continue practicing on real projects to build professional habits.

## Professional Git Checklist

### Before Starting

- [ ] Verify Git is installed and configured
- [ ] Verify GitHub account is active
- [ ] Ensure you are on the correct branch
- [ ] Check that the working tree is clean

### During Development

- [ ] Create a branch for each feature or fix
- [ ] Make small, focused commits
- [ ] Write meaningful commit messages
- [ ] Check `git status` regularly
- [ ] Review `git diff` before committing

### Before Commit

- [ ] Review all staged changes
- [ ] Verify no secrets or sensitive files are staged
- [ ] Run tests if applicable
- [ ] Ensure commit message is clear and specific
- [ ] Verify you are on the correct branch

### Before Push

- [ ] Pull latest changes from remote
- [ ] Resolve any conflicts
- [ ] Verify the branch name is correct
- [ ] Review the commit history

### Before Delivery

- [ ] All work is committed and pushed
- [ ] README is updated with setup instructions
- [ ] `.gitignore` excludes secrets and build artifacts
- [ ] No sensitive data in the repository
- [ ] Commit history is clean and professional
- [ ] Repository is organized and documented
- [ ] Client has appropriate access

## Summary

- Git is a distributed version-control system that tracks changes to your code over time
- GitHub is a cloud platform that hosts Git repositories and provides collaboration tools
- The Git working model flows: Working Directory → Staging Area → Local Repository → Remote Repository
- Commits are meaningful snapshots with clear messages that explain what changed and why
- Branches allow you to work on features without affecting the stable main code
- Pull requests provide review points and a clear history of approved changes
- `git diff` is essential for reviewing changes, especially after AI coding agent modifications
- Git makes AI-assisted development safe by providing visibility, history, and rollback capability
- Professional freelancers use branches for every feature, write clear commit messages, and review all changes before committing
- Security requires `.gitignore`, environment variables, and never committing secrets
- Merge conflicts are normal and resolvable — read both versions, choose correctly, and test
- Recovery options exist for every situation — `git restore`, `git revert`, `git stash`
- Client collaboration uses private repositories, branches, pull requests, and clear documentation
- GitHub serves as a technical portfolio that demonstrates professional development practices
- Good Git practices compound over time, building professional reputation and client confidence

## What Comes Next

Now that you have a solid foundation in Git and GitHub, the next step is understanding when and how to use different AI development approaches. In **Chapter 05: AI-Assisted vs Agentic Development**, you will learn how to choose between AI-assisted coding (where you write code with AI suggestions) and agentic development (where AI completes tasks with your guidance), and how to combine both approaches effectively in your freelance workflow.
