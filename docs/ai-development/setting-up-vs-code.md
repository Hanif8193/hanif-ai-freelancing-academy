---
sidebar_position: 2
title: "Chapter 06: Setting Up VS Code for AI-Powered Development"
---

# Chapter 06: Setting Up VS Code for AI-Powered Development

## Learning Objectives

By the end of this chapter, you will be able to:

- Install and configure Visual Studio Code
- Set up essential extensions for productivity
- Configure AI coding tools in VS Code
- Create an efficient development workspace
- Customize your environment for your workflow

## Prerequisites

- A computer with internet access
- Administrative access to install software
- Basic understanding of code editors

## Environment Requirements

- **Operating System**: Windows, macOS, or Linux
- **RAM**: 8GB minimum (16GB recommended)
- **Storage**: 2GB free space for VS Code and extensions
- **Internet**: Required for downloading extensions and AI tools

## Introduction

Visual Studio Code (VS Code) is the most popular code editor among developers. It is free, extensible, and has excellent support for AI coding tools. This chapter guides you through setting up VS Code for AI-powered development.

## Why This Matters

A well-configured development environment helps you:

- Work more efficiently
- Reduce errors
- Enjoy your coding experience
- Integrate AI tools seamlessly
- Maintain consistency across projects

## Core Concepts

### Why VS Code?

VS Code is ideal for AI-powered development because:

- **Free and open source**: No cost barrier
- **Huge extension ecosystem**: Thousands of extensions available
- **Excellent AI integration**: Most AI tools support VS Code
- **Cross-platform**: Works on Windows, macOS, and Linux
- **Regular updates**: Constantly improving
- **Large community**: Extensive documentation and support

### Installation

#### Windows
1. Visit [code.visualstudio.com](https://code.visualstudio.com)
2. Download the Windows installer
3. Run the installer
4. Follow the installation wizard
5. Launch VS Code

#### macOS
1. Visit [code.visualstudio.com](https://code.visualstudio.com)
2. Download the macOS version
3. Open the downloaded file
4. Drag VS Code to Applications folder
5. Launch VS Code

#### Linux
1. Visit [code.visualstudio.com](https://code.visualstudio.com)
2. Download the appropriate package (.deb, .rpm, or .tar.gz)
3. Install using your package manager
4. Launch VS Code

### Essential Extensions

Install these extensions for productive AI-powered development:

#### Productivity Extensions

1. **ES7+ React/Redux/React-Native snippets**
   - Provides useful code snippets
   - Speeds up React development

2. **Prettier - Code formatter**
   - Automatically formats code
   - Maintains consistent style

3. **ESLint**
   - Identifies code problems
   - Enforces coding standards

4. **GitLens**
   - Enhanced Git capabilities
   - Shows code history and blame

5. **Auto Rename Tag**
   - Renames paired HTML/JSX tags
   - Saves time editing markup

#### AI Extensions

1. **GitHub Copilot**
   - AI-powered code suggestions
   - Free trial available
   - Subscription required for full access

2. **Codeium**
   - Free AI code completion
   - Good alternative to Copilot
   - Supports multiple languages

3. **Continue**
   - Open-source AI coding assistant
   - Supports multiple AI models
   - Customizable workflows

4. **ChatGPT**
   - Access ChatGPT from VS Code
   - Ask questions while coding
   - Get explanations and suggestions

#### Language Support

1. **Python** (if using Python)
   - IntelliSense, linting, debugging
   - Jupyter notebook support

2. **ESLint** (for JavaScript/TypeScript)
   - JavaScript linting
   - Code quality enforcement

3. **Prettier** (for formatting)
   - Code formatting
   - Consistent style

### AI Tool Configuration

#### GitHub Copilot Setup
1. Install the GitHub Copilot extension
2. Sign in with your GitHub account
3. Start a free trial or subscribe
4. Copilot will suggest code as you type

**Usage tips:**
- Press Tab to accept suggestions
- Press Esc to dismiss suggestions
- Use Ctrl+Enter for multiple suggestions
- Write clear comments for better suggestions

#### Codeium Setup
1. Install the Codeium extension
2. Sign up for a free account
3. Enter your API key
4. Codeium will suggest code as you type

**Advantages:**
- Free for individual use
- Supports many languages
- Fast suggestions

#### Continue Setup
1. Install the Continue extension
2. Configure your preferred AI model
3. Set up your workflow
4. Use chat and code editing features

**Features:**
- Chat with AI about your code
- Edit code with AI assistance
- Customizable commands
- Open-source and free

### Workspace Configuration

#### Settings.json
Create a `.vscode/settings.json` file in your project:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.suggestSelection": "first",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000
}
```

#### Keybindings
Customize keyboard shortcuts for efficiency:

- `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS): Command palette
- `Ctrl+P` or `Cmd+P`: Quick file open
- `Ctrl+Shift+F` or `Cmd+Shift+F`: Search across files
- `F12`: Go to definition
- `Shift+F12`: Find references

### Keyboard Shortcuts for AI Tools

#### GitHub Copilot
- `Tab`: Accept suggestion
- `Esc`: Dismiss suggestion
- `Ctrl+Enter`: Show multiple suggestions
- `Ctrl+Shift+Enter`: Open Copilot chat

#### Codeium
- `Tab`: Accept suggestion
- `Esc`: Dismiss suggestion
- `Ctrl+Shift+Space`: Trigger suggestion

### Project Setup

#### Create a Workspace
1. Open VS Code
2. File → Open Folder
3. Select your project folder
4. VS Code creates `.vscode` folder for settings

#### Configure for Your Project
1. Add project-specific settings
2. Install project dependencies
3. Set up linting and formatting
4. Configure debugging

### Extensions for Specific Technologies

#### React Development
1. ES7+ React/Redux/React-Native snippets
2. Prettier
3. ESLint
4. React Snippets
5. Auto Rename Tag

#### Node.js Development
1. Node.js Extension Pack
2. REST Client
3. NPM Intellisense
4. DotENV

#### Python Development
1. Python
2. Pylance
3. Python Indent
4. Jupyter

## Practical Examples

### Example 1: Setting Up a React Project

**Step 1: Create Project**
```bash
npx create-react-app my-project
cd my-project
code .
```

**Step 2: Install Extensions**
- Prettier
- ESLint
- ES7+ React snippets
- GitHub Copilot

**Step 3: Configure Settings**
Add to `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

### Example 2: Using AI with Good Setup

**Scenario**: Building a login form

1. Write a comment describing what you need:
```javascript
// Create a login form component with email and password fields
// Include validation and error handling
```

2. AI suggests complete component

3. Review and modify as needed

4. Use Prettier to format

5. ESLint checks for issues

### Example 3: Workspace Settings for Team Projects

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "files.exclude": {
    "**/.git": true,
    "**/node_modules": true,
    "**/dist": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true
  }
}
```

## Freelancer Perspective

A well-configured environment increases your productivity:

**Benefits:**
- Faster development = more projects
- Better code quality = happier clients
- Consistent workflow = fewer mistakes
- Professional setup = professional results

**Time investment:**
- Initial setup: 2-4 hours
- Learning shortcuts: 1-2 weeks
- Ongoing improvement: Continuous

**ROI:**
- 20-30% productivity increase
- Fewer bugs and issues
- Better code quality
- More enjoyable work

## AI/Agent Perspective

Your VS Code setup affects AI tool performance:

**Good setup helps AI:**
- Better context for suggestions
- Consistent code style
- Clear project structure
- Proper file organization

**Optimize for AI:**
- Use descriptive file names
- Write clear comments
- Maintain consistent structure
- Keep dependencies updated

## Step-by-Step Guidance

### Complete Setup Guide

**Step 1: Install VS Code**
1. Download from official website
2. Install with default settings
3. Launch and sign in (optional)

**Step 2: Install Essential Extensions**
1. Open Extensions view (Ctrl+Shift+X)
2. Search and install:
   - Prettier
   - ESLint
   - GitLens
   - Your preferred AI tool

**Step 3: Configure Settings**
1. Open Settings (Ctrl+,)
2. Enable format on save
3. Set default formatter to Prettier
4. Configure other preferences

**Step 4: Set Up Keybindings**
1. Open Keyboard Shortcuts (Ctrl+K Ctrl+S)
2. Customize shortcuts for your workflow
3. Learn essential shortcuts

**Step 5: Create Workspace**
1. Open your project folder
2. Add project-specific settings
3. Configure for your technology stack

### Verification Steps

After setup, verify everything works:

1. **VS Code launches correctly**
2. **Extensions are installed and active**
3. **AI tool suggests code**
4. **Formatting works on save**
5. **Linting catches errors**
6. **Git integration works**

## Practical Exercise

**Exercise 6.1: Environment Setup**

Complete this setup checklist:

1. Install VS Code
2. Install 5 essential extensions
3. Configure format on save
4. Set up your preferred AI tool
5. Create a test project
6. Verify all tools work

**Exercise 6.2: Keyboard Shortcuts**

Practice these shortcuts until comfortable:

1. Open command palette
2. Search for files
3. Search across files
4. Go to definition
5. Format document
6. Toggle terminal

## Common Mistakes

### Mistake 1: Installing Too Many Extensions

Too many extensions slow down VS Code. Start with essentials and add only what you need.

### Mistake 2: Not Configuring Settings

Default settings may not be optimal. Take time to configure for your workflow.

### Mistake 3: Ignoring Keyboard Shortcuts

Learning shortcuts saves significant time. Invest in learning the most useful ones.

### Mistake 4: Not Using Version Control Integration

VS Code has excellent Git integration. Use it from the start.

### Mistake 5: Skipping AI Tool Setup

AI tools provide significant productivity gains. Set them up properly.

## Knowledge Check

1. What are three essential extensions for AI-powered development?
2. How do you configure format on save in VS Code?
3. What is the benefit of using keyboard shortcuts?
4. How does a good workspace setup help AI tools?
5. What should you include in project-specific settings?

## Mini Task or Challenge

**Challenge 6.1: Complete Environment Setup**

Set up a complete development environment:

1. Install VS Code
2. Install and configure 5+ extensions
3. Set up GitHub Copilot or Codeium
4. Create workspace settings
5. Build a simple project using AI suggestions
6. Document your setup process

## Verification Steps

After completing this chapter, verify:

1. VS Code is installed and running
2. Essential extensions are installed
3. AI tool is configured and working
4. Format on save is enabled
5. You can use basic keyboard shortcuts

## Troubleshooting

### Common Issues and Solutions

**Issue**: AI tool not suggesting code
**Solution**: Check extension is enabled, sign in if required, restart VS Code

**Issue**: Formatting not working
**Solution**: Verify Prettier is installed, check settings.json

**Issue**: ESLint not showing errors
**Solution**: Install ESLint extension, ensure project has .eslintrc

**Issue**: VS Code is slow
**Solution**: Disable unnecessary extensions, increase memory allocation

## Summary

- VS Code is the best editor for AI-powered development
- Install essential extensions for productivity
- Configure settings for your workflow
- Set up AI tools properly
- Learn keyboard shortcuts for efficiency
- Create project-specific settings

## What Comes Next

In the next chapter, we will explore **Git & GitHub for Freelancers**. You will learn version control essentials and how to collaborate effectively with clients and other developers.
