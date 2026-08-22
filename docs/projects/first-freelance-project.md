---
sidebar_position: 2
title: "Your First Freelance Project: Building a Client Landing Page"
---

# Your First Freelance Project: Building a Client Landing Page

## Project Overview

This is a hands-on capstone project that applies everything you learned in Modules 1–3. You will work through a realistic simulated freelance project from start to finish: receiving a client brief, analyzing requirements, writing a specification, building a responsive landing page, using Git and GitHub, applying AI coding agents responsibly, testing your work, deploying it, and delivering it professionally.

**What you will build:** A responsive landing page for a small business client.

**Why this matters:** Freelancers are hired to deliver outcomes, not to write code. This project teaches you the full workflow — from understanding what the client needs to delivering a working product.

**What skills it combines:**

| Module | Skills Applied |
|--------|---------------|
| Module 1: Freelancing | Client brief analysis, requirements gathering, professional delivery, portfolio documentation |
| Module 2: AI & Development Tools | HTML, CSS, JavaScript, Git, GitHub, AI coding agents, code review, testing, deployment |
| Module 3: Spec-Driven Development | Specification writing, acceptance criteria, structured implementation |

**Final deliverables:**

- A working responsive landing page (HTML, CSS, JavaScript)
- A Git repository with clear commit history
- A deployed public URL
- A project README
- A portfolio-ready case study

**Time estimate:** 3–6 hours for a beginner. Take your time. Speed comes with practice.

## Learning Objectives

By the end of this project, you will be able to:

1. Extract business goals, user needs, and technical requirements from a client brief
2. Write a lightweight specification before writing any code
3. Plan a project structure and development order
4. Build a responsive landing page using HTML, CSS, and vanilla JavaScript
5. Use semantic HTML and accessible markup
6. Create responsive layouts with Flexbox and media queries
7. Initialize a Git repository and make meaningful commits
8. Push code to GitHub
9. Use AI coding agents with focused, specific prompts
10. Review AI-generated code critically before accepting it
11. Test across devices and browsers
12. Debug common beginner problems
13. Deploy a static site to a public URL
14. Write a professional client delivery message
15. Document the project for your portfolio

## The Simulated Client

You have received the following message from a potential client:

---

> **Subject:** Landing page for my plumbing business
>
> Hi,
>
> My name is Rashid and I run a small plumbing company called **Rashid Plumbing Solutions** in Lahore. We have been in business for 8 years but we have never had a proper website. Right now we rely on word of mouth and a Facebook page.
>
> I need a professional landing page that helps us get more phone calls and quote requests from new customers. Most of our customers find us on their phones, so it needs to work well on mobile.
>
> **What we do:**
> - Emergency plumbing repairs
> - Kitchen and bathroom plumbing installation
> - Water heater installation and repair
> - Pipe maintenance and leak detection
> - Commercial plumbing services
>
> **What I want on the page:**
> - A clear headline that explains what we do
> - Our services listed out
> - Why customers should choose us (we are licensed, insured, available 24/7, and have 8 years of experience)
> - How our process works (call, schedule, we fix it)
> - A few customer reviews (I can provide these later, just use placeholders for now)
> - A big call-to-action to call us or request a quote
> - Our contact info: phone 0300-1234567, email info@rashidplumbing.com, address 123 Main Road, Lahore
>
> I want it to look clean and professional. Blue is our brand color. I need it live within a week.
>
> Can you help?
>
> — Rashid

---

**Important:** This is a simulated client brief for learning purposes. In real freelance work, you would ask clarifying questions before starting. For this project, the brief is intentionally detailed enough to begin working.

## Step 1: Analyze the Client Brief

Before writing any code, analyze what the client actually needs. A common beginner mistake is to start building immediately without understanding the requirements.

### Separate the Brief into Categories

| Category | From the Brief |
|----------|---------------|
| **Business goal** | Get more phone calls and quote requests |
| **Target customers** | Homeowners and businesses in Lahore needing plumbing services |
| **User need** | Find a reliable plumber quickly, understand services, make contact |
| **Functional requirements** | Service listings, testimonials section, contact information, call-to-action buttons |
| **Content requirements** | Headline, services list, "why choose us," process steps, testimonials (placeholders), contact details |
| **Design requirements** | Clean, professional, blue brand color, mobile-first |
| **Technical requirements** | Responsive (mobile-first), works on phones, loads fast |
| **Constraints** | One-week deadline, static landing page (no backend needed) |
| **Assumptions** | Placeholder testimonials are acceptable, no booking system needed, no CMS required |

### Requirements Table

| Requirement | Priority | Notes |
|-------------|----------|-------|
| Responsive design (mobile-first) | Must have | Client specifically mentioned mobile |
| Clear headline and CTA | Must have | Primary goal is phone calls |
| Services section | Must have | Core content |
| "Why choose us" section | Must have | Trust building |
| Process/steps section | Should have | Helps users understand what to expect |
| Testimonials | Should have | Placeholders now, real later |
| Contact information | Must have | Phone, email, address |
| Professional blue design | Should have | Brand consistency |
| Smooth scrolling | Nice to have | Improves UX |
| Working contact form | Out of scope | Client asked for phone/email, not a form |

**Why this step matters:** Requirements analysis prevents scope creep and ensures you build what the client actually needs. In Module 1, Chapter 03, you learned that unclear requirements lead to unpaid extra work and unhappy clients.

## Step 2: Write the Specification

Before coding, write a lightweight specification. This comes from the Spec-Driven Development workflow in Module 3.

### Project Objective

Build a single-page responsive landing page for Rashid Plumbing Solutions that generates phone calls and quote requests from potential customers in Lahore.

### User Stories

| As a... | I want to... | So that... |
|---------|-------------|-----------|
| Potential customer | See what services are offered | I know if they can help me |
| Potential customer | See why this company is trustworthy | I feel confident calling |
| Potential customer | Understand how the process works | I know what to expect |
| Potential customer | Read customer reviews | I see social proof |
| Potential customer | Find the phone number easily | I can call immediately |
| Rashid (business owner) | Have a professional online presence | Customers take us seriously |

### Functional Requirements

| ID | Requirement | Acceptance Criteria |
|----|------------|-------------------|
| FR-01 | Hero section with headline and CTA | Visible above the fold on all devices, phone number clickable on mobile |
| FR-02 | Services section | Lists all 5 services with descriptions |
| FR-03 | "Why choose us" section | Lists 4 trust factors (licensed, insured, 24/7, 8 years) |
| FR-04 | Process section | Shows 3-step process (call, schedule, fix) |
| FR-05 | Testimonials section | 3 placeholder testimonials with names |
| FR-06 | Contact section | Phone, email, address displayed clearly |
| FR-07 | Footer | Business name, copyright, basic links |
| FR-08 | Responsive design | Works on screens from 320px to 1200px+ |
| FR-09 | Navigation | Smooth scroll to sections, mobile hamburger menu |

### Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Page load time | Under 3 seconds on mobile |
| Browser support | Chrome, Firefox, Safari, Samsung Internet |
| Accessibility | Basic: semantic HTML, alt text, heading hierarchy, focus states |
| No dependencies | Vanilla HTML, CSS, JavaScript only |

### Out of Scope

- Contact form (client wants phone/email)
- CMS or admin panel
- Backend/database
- Multi-page site
- Booking system
- Analytics integration
- SEO optimization beyond basics

**Why a specification matters:** Without one, you will build what you think the client wants instead of what they actually need. The specification is your contract with yourself. When the client asks for changes later, you can refer back to what was agreed.

## Step 3: Plan the Project

### Project Structure

```text
rashid-plumbing/
├── index.html          # The landing page
├── css/
│   └── style.css       # All styles
├── js/
│   └── script.js       # Mobile menu and interactions
├── assets/
│   └── (placeholder for images if needed)
└── README.md           # Project documentation
```

### Development Order

| Step | Task | Why This Order |
|------|------|---------------|
| 1 | Create project folder and files | Foundation |
| 2 | Write HTML structure | Content first, style second |
| 3 | Add CSS styling | Make it look professional |
| 4 | Add responsive CSS | Mobile-first is a must |
| 5 | Add JavaScript | Only for mobile menu and interactions |
| 6 | Test across devices | Catch problems early |
| 7 | Review and polish | Professional quality |
| 8 | Git commits | Save your progress |
| 9 | Deploy | Get a public URL |
| 10 | Deliver to client | Professional handoff |

## Step 4: Initialize Git

Open your terminal and run these commands:

```bash
# Create the project folder
mkdir rashid-plumbing
cd rashid-plumbing

# Initialize Git
git init

# Create the folder structure
mkdir css js assets

# Create the files
touch index.html css/style.css js/script.js README.md
```

**What each command does:**

| Command | Purpose |
|---------|---------|
| `mkdir` | Creates a new folder |
| `cd` | Enters the folder |
| `git init` | Initializes a Git repository in this folder |
| `mkdir css js assets` | Creates subfolders for organization |
| `touch` | Creates empty files |

Now create a GitHub repository:

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon → **New repository**
3. Name it `rashid-plumbing`
4. Keep it **public** (this is portfolio work)
5. Do **not** initialize with README (you will push your own)
6. Click **Create repository**
7. Follow the instructions to connect your local repository:

```bash
git remote add origin https://github.com/YOUR-USERNAME/rashid-plumbing.git
```

Replace `YOUR-USERNAME` with your actual GitHub username.

## Step 5: Build the HTML Structure

Create `index.html` with the following content. This is a complete, working HTML file.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rashid Plumbing Solutions | Professional Plumbing Services in Lahore</title>
    <meta name="description" content="Rashid Plumbing Solutions provides professional plumbing services in Lahore. Emergency repairs, installations, and maintenance. Call 0300-1234567.">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <!-- Navigation -->
    <header class="header">
        <nav class="nav">
            <a href="#" class="nav__logo">Rashid Plumbing</a>
            <button class="nav__toggle" aria-label="Toggle navigation" aria-expanded="false">
                <span class="nav__toggle-bar"></span>
                <span class="nav__toggle-bar"></span>
                <span class="nav__toggle-bar"></span>
            </button>
            <ul class="nav__menu">
                <li><a href="#services" class="nav__link">Services</a></li>
                <li><a href="#why-us" class="nav__link">Why Us</a></li>
                <li><a href="#process" class="nav__link">How It Works</a></li>
                <li><a href="#testimonials" class="nav__link">Reviews</a></li>
                <li><a href="#contact" class="nav__link nav__link--cta">Call Now</a></li>
            </ul>
        </nav>
    </header>

    <!-- Hero Section -->
    <section id="hero" class="hero">
        <div class="container">
            <h1 class="hero__title">Professional Plumbing Services in Lahore</h1>
            <p class="hero__subtitle">Licensed, insured, and available 24/7. Fast, reliable plumbing for homes and businesses.</p>
            <div class="hero__actions">
                <a href="tel:+923001234567" class="btn btn--primary btn--large">Call 0300-1234567</a>
                <a href="#contact" class="btn btn--secondary btn--large">Request a Quote</a>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="services">
        <div class="container">
            <h2 class="section-title">Our Services</h2>
            <p class="section-subtitle">Complete plumbing solutions for residential and commercial properties</p>
            <div class="services__grid">
                <div class="service-card">
                    <div class="service-card__icon">&#128295;</div>
                    <h3 class="service-card__title">Emergency Repairs</h3>
                    <p class="service-card__text">Burst pipes, severe leaks, and plumbing emergencies. We respond fast, day or night.</p>
                </div>
                <div class="service-card">
                    <div class="service-card__icon">&#128703;</div>
                    <h3 class="service-card__title">Kitchen &amp; Bathroom Installation</h3>
                    <p class="service-card__text">Complete plumbing setup for new kitchens and bathrooms. Fixtures, pipes, and drainage.</p>
                </div>
                <div class="service-card">
                    <div class="service-card__icon">&#9728;&#65039;</div>
                    <h3 class="service-card__title">Water Heater Services</h3>
                    <p class="service-card__text">Installation, repair, and maintenance of geysers and water heating systems.</p>
                </div>
                <div class="service-card">
                    <div class="service-card__icon">&#128167;</div>
                    <h3 class="service-card__title">Leak Detection &amp; Pipe Maintenance</h3>
                    <p class="service-card__text">Hidden leaks, pipe relining, and preventive maintenance to avoid costly damage.</p>
                </div>
                <div class="service-card">
                    <div class="service-card__icon">&#127970;</div>
                    <h3 class="service-card__title">Commercial Plumbing</h3>
                    <p class="service-card__text">Offices, shops, restaurants, and industrial plumbing. Large-scale projects welcome.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Why Choose Us Section -->
    <section id="why-us" class="why-us">
        <div class="container">
            <h2 class="section-title">Why Choose Rashid Plumbing?</h2>
            <div class="why-us__grid">
                <div class="why-us__item">
                    <span class="why-us__number">8+</span>
                    <span class="why-us__label">Years of Experience</span>
                </div>
                <div class="why-us__item">
                    <span class="why-us__icon">&#9989;</span>
                    <span class="why-us__label">Licensed &amp; Insured</span>
                </div>
                <div class="why-us__item">
                    <span class="why-us__icon">&#9202;</span>
                    <span class="why-us__label">Available 24/7</span>
                </div>
                <div class="why-us__item">
                    <span class="why-us__icon">&#11088;</span>
                    <span class="why-us__label">500+ Satisfied Customers</span>
                </div>
            </div>
        </div>
    </section>

    <!-- Process Section -->
    <section id="process" class="process">
        <div class="container">
            <h2 class="section-title">How It Works</h2>
            <p class="section-subtitle">Three simple steps to solve your plumbing problem</p>
            <div class="process__steps">
                <div class="process__step">
                    <span class="process__step-number">1</span>
                    <h3 class="process__step-title">Call Us</h3>
                    <p class="process__step-text">Describe your plumbing issue. We will give you honest advice and a free estimate over the phone.</p>
                </div>
                <div class="process__step">
                    <span class="process__step-number">2</span>
                    <h3 class="process__step-title">Schedule</h3>
                    <p class="process__step-text">Choose a time that works for you. We offer same-day appointments for emergencies.</p>
                </div>
                <div class="process__step">
                    <span class="process__step-number">3</span>
                    <h3 class="process__step-title">We Fix It</h3>
                    <p class="process__step-text">Our licensed plumber arrives on time, completes the work, and cleans up. You pay only when satisfied.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials" class="testimonials">
        <div class="container">
            <h2 class="section-title">What Our Customers Say</h2>
            <div class="testimonials__grid">
                <div class="testimonial-card">
                    <p class="testimonial-card__text">"Rashid fixed our burst pipe within an hour of calling. Professional, clean work. Highly recommended."</p>
                    <p class="testimonial-card__author">— Ahmed K., DHA Phase 5</p>
                </div>
                <div class="testimonial-card">
                    <p class="testimonial-card__text">"They installed all the plumbing in our new kitchen. Everything works perfectly. Fair pricing too."</p>
                    <p class="testimonial-card__author">— Fatima S., Gulberg</p>
                </div>
                <div class="testimonial-card">
                    <p class="testimonial-card__text">"Called at 2 AM for a water heater emergency. They came immediately. True 24/7 service."</p>
                    <p class="testimonial-card__author">— Muhammad R., Johar Town</p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
        <div class="container">
            <h2 class="cta__title">Need a Plumber? Call Now.</h2>
            <p class="cta__text">Fast, reliable plumbing services. Free estimates. Available 24/7.</p>
            <a href="tel:+923001234567" class="btn btn--primary btn--large">Call 0300-1234567</a>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
        <div class="container">
            <h2 class="section-title">Contact Us</h2>
            <div class="contact__grid">
                <div class="contact__item">
                    <h3 class="contact__item-title">Phone</h3>
                    <a href="tel:+923001234567" class="contact__item-value">0300-1234567</a>
                </div>
                <div class="contact__item">
                    <h3 class="contact__item-title">Email</h3>
                    <a href="mailto:info@rashidplumbing.com" class="contact__item-value">info@rashidplumbing.com</a>
                </div>
                <div class="contact__item">
                    <h3 class="contact__item-title">Address</h3>
                    <p class="contact__item-value">123 Main Road, Lahore, Pakistan</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p class="footer__text">&copy; 2026 Rashid Plumbing Solutions. All rights reserved.</p>
        </div>
    </footer>

    <script src="js/script.js"></script>
</body>
</html>
```

### Key Decisions Explained

| Decision | Why |
|----------|-----|
| Semantic HTML (`<header>`, `<section>`, `<nav>`, `<footer>`) | Accessibility and SEO. Screen readers and search engines understand the page structure. |
| `aria-label` on the toggle button | Screen readers need to know what the button does. |
| `tel:` links on phone numbers | On mobile, tapping the number opens the phone app directly. |
| BEM-style class names (`hero__title`, `service-card__text`) | Keeps CSS organized and avoids naming conflicts. You do not need to memorize BEM — just be consistent. |
| No external dependencies | No frameworks, no CDN links. The page loads fast and has no third-party code to break. |

## Step 6: Style the Page with CSS

Create `css/style.css` with the following content. This provides a clean, professional design with responsive layouts.

```css
/* ===== Reset & Base ===== */
*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
        Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #fff;
}

img {
    max-width: 100%;
    display: block;
}

a {
    color: inherit;
    text-decoration: none;
}

/* ===== Layout ===== */
.container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 20px;
}

/* ===== Typography ===== */
.section-title {
    font-size: 1.8rem;
    text-align: center;
    margin-bottom: 8px;
    color: #1a1a2e;
}

.section-subtitle {
    text-align: center;
    color: #666;
    margin-bottom: 40px;
    font-size: 1rem;
}

/* ===== Buttons ===== */
.btn {
    display: inline-block;
    padding: 12px 28px;
    border-radius: 6px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;
    border: none;
    text-align: center;
}

.btn:hover {
    transform: translateY(-1px);
}

.btn--primary {
    background-color: #1565c0;
    color: #fff;
}

.btn--primary:hover {
    background-color: #0d47a1;
}

.btn--secondary {
    background-color: transparent;
    color: #1565c0;
    border: 2px solid #1565c0;
}

.btn--secondary:hover {
    background-color: #e3f2fd;
}

.btn--large {
    padding: 16px 36px;
    font-size: 1.1rem;
}

/* ===== Header / Navigation ===== */
.header {
    background-color: #fff;
    border-bottom: 1px solid #e0e0e0;
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1100px;
    margin: 0 auto;
    padding: 16px 20px;
}

.nav__logo {
    font-size: 1.2rem;
    font-weight: 700;
    color: #1565c0;
}

.nav__toggle {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
}

.nav__toggle-bar {
    display: block;
    width: 24px;
    height: 2px;
    background-color: #333;
    transition: transform 0.2s;
}

.nav__menu {
    display: flex;
    list-style: none;
    gap: 24px;
    align-items: center;
}

.nav__link {
    font-size: 0.95rem;
    color: #555;
    transition: color 0.2s;
}

.nav__link:hover {
    color: #1565c0;
}

.nav__link--cta {
    background-color: #1565c0;
    color: #fff !important;
    padding: 8px 20px;
    border-radius: 6px;
}

.nav__link--cta:hover {
    background-color: #0d47a1;
}

/* ===== Hero ===== */
.hero {
    background-color: #e3f2fd;
    padding: 80px 20px;
    text-align: center;
}

.hero__title {
    font-size: 2.2rem;
    color: #1a1a2e;
    margin-bottom: 16px;
    line-height: 1.2;
}

.hero__subtitle {
    font-size: 1.15rem;
    color: #555;
    margin-bottom: 32px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.hero__actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
}

/* ===== Services ===== */
.services {
    padding: 60px 20px;
}

.services__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
}

.service-card {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 28px 24px;
    text-align: center;
    border: 1px solid #e8e8e8;
}

.service-card__icon {
    font-size: 2rem;
    margin-bottom: 12px;
}

.service-card__title {
    font-size: 1.1rem;
    margin-bottom: 8px;
    color: #1a1a2e;
}

.service-card__text {
    font-size: 0.95rem;
    color: #666;
}

/* ===== Why Us ===== */
.why-us {
    background-color: #1565c0;
    color: #fff;
    padding: 60px 20px;
}

.why-us .section-title {
    color: #fff;
}

.why-us__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 32px;
    text-align: center;
}

.why-us__number {
    display: block;
    font-size: 2.5rem;
    font-weight: 700;
}

.why-us__icon {
    display: block;
    font-size: 2rem;
}

.why-us__label {
    display: block;
    margin-top: 8px;
    font-size: 1rem;
    opacity: 0.9;
}

/* ===== Process ===== */
.process {
    padding: 60px 20px;
    background-color: #f8f9fa;
}

.process__steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 32px;
    text-align: center;
}

.process__step-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background-color: #1565c0;
    color: #fff;
    border-radius: 50%;
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 16px;
}

.process__step-title {
    font-size: 1.1rem;
    margin-bottom: 8px;
    color: #1a1a2e;
}

.process__step-text {
    font-size: 0.95rem;
    color: #666;
}

/* ===== Testimonials ===== */
.testimonials {
    padding: 60px 20px;
}

.testimonials__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
}

.testimonial-card {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 28px 24px;
    border: 1px solid #e8e8e8;
}

.testimonial-card__text {
    font-style: italic;
    color: #444;
    margin-bottom: 12px;
    line-height: 1.7;
}

.testimonial-card__author {
    font-weight: 600;
    color: #1565c0;
    font-size: 0.9rem;
}

/* ===== CTA ===== */
.cta {
    background-color: #0d47a1;
    color: #fff;
    padding: 60px 20px;
    text-align: center;
}

.cta__title {
    font-size: 1.8rem;
    margin-bottom: 12px;
}

.cta__text {
    margin-bottom: 24px;
    opacity: 0.9;
}

.cta .btn--primary {
    background-color: #fff;
    color: #0d47a1;
}

.cta .btn--primary:hover {
    background-color: #e3f2fd;
}

/* ===== Contact ===== */
.contact {
    padding: 60px 20px;
    background-color: #f8f9fa;
}

.contact__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 32px;
    text-align: center;
}

.contact__item-title {
    font-size: 1rem;
    color: #1565c0;
    margin-bottom: 4px;
}

.contact__item-value {
    font-size: 1.05rem;
    color: #333;
}

a.contact__item-value:hover {
    color: #1565c0;
    text-decoration: underline;
}

/* ===== Footer ===== */
.footer {
    background-color: #1a1a2e;
    color: #aaa;
    padding: 24px 20px;
    text-align: center;
    font-size: 0.9rem;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
    .nav__toggle {
        display: flex;
    }

    .nav__menu {
        display: none;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: #fff;
        border-bottom: 1px solid #e0e0e0;
        padding: 16px 20px;
        gap: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .nav__menu.active {
        display: flex;
    }

    .hero {
        padding: 48px 20px;
    }

    .hero__title {
        font-size: 1.6rem;
    }

    .hero__subtitle {
        font-size: 1rem;
    }

    .section-title {
        font-size: 1.5rem;
    }

    .btn--large {
        padding: 14px 28px;
        font-size: 1rem;
    }
}

@media (max-width: 480px) {
    .hero__actions {
        flex-direction: column;
        align-items: center;
    }

    .btn--large {
        width: 100%;
        max-width: 300px;
    }
}
```

### CSS Concepts Used

| Concept | Where | Why |
|---------|-------|-----|
| CSS Reset | `*` selector with `box-sizing: border-box` | Consistent spacing across browsers |
| Flexbox | Navigation, hero buttons, contact grid | Responsive alignment without floats |
| CSS Grid | Services, process steps, testimonials, contact | Multi-column layouts that adapt to screen size |
| Media queries | `@media (max-width: 768px)` and `480px` | Mobile responsive design |
| Sticky header | `position: sticky` | Navigation stays visible while scrolling |
| BEM naming | `.hero__title`, `.service-card__text` | Organized, predictable class names |
| Smooth scrolling | `scroll-behavior: smooth` | Clicking nav links scrolls smoothly to sections |

## Step 7: Add JavaScript

Create `js/script.js` with the following content. This adds a working mobile navigation menu and smooth scroll support.

```javascript
// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('.nav__menu');

navToggle.addEventListener('click', function () {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
});

// Close mobile menu when a nav link is clicked
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function (event) {
    if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    }
});
```

### Why This JavaScript Is Minimal

This project intentionally uses very little JavaScript. Here is why:

| Reason | Explanation |
|--------|-------------|
| The page is mostly content | A landing page does not need complex interactivity |
| HTML and CSS handle most of the layout | Flexbox and Grid do the heavy lifting |
| `tel:` links handle phone calls | No JavaScript needed for the primary CTA |
| Smooth scrolling is CSS | `scroll-behavior: smooth` in CSS, no JS required |
| Accessibility | Semantic HTML works without JavaScript |

**The only JavaScript is the mobile menu** because that is the one interaction that CSS alone cannot handle well.

## Step 8: Use an AI Coding Agent

During this project, you can use an AI coding agent to help with specific tasks. Here is how to use it effectively.

### Good Prompts

| Task | Good Prompt |
|------|------------|
| Fix a CSS issue | "In my CSS file `style.css`, the hero section buttons are not centered on mobile screens below 480px. The `.hero__actions` container uses flexbox. What CSS change fixes the alignment?" |
| Improve accessibility | "Review this HTML for accessibility issues: [paste HTML]. Focus on heading hierarchy, alt text, aria labels, and form labels. List specific issues and fixes." |
| Debug JavaScript | "My mobile menu toggle button does not close the menu when I click a nav link. Here is my JavaScript: [paste code]. What is wrong?" |
| Review responsive design | "My services grid looks good on desktop but the cards are too narrow on mobile (320px). Here is my CSS grid: [paste CSS]. How should I adjust the grid for small screens?" |
| Explain code | "What does `scroll-behavior: smooth` do in CSS? When would I use it?" |

### Bad Prompts

| Bad Prompt | Why It Fails |
|-----------|-------------|
| "Build a plumbing website" | Too vague. The AI does not know the client, the requirements, or the design. |
| "Make it look professional" | "Professional" is subjective. The AI will guess what you mean. |
| "Do everything" | No scope, no constraints, no acceptance criteria. |
| "Fix my code" | Which code? What is the error? What is the expected behavior? |

### The Rule

**You are the developer. The AI is your assistant.** You decide what to build, how to structure it, and whether the output is correct. The AI generates suggestions. You review, test, and accept or reject them.

**Important:** Never copy AI-generated code into your project without reading and understanding it first. If you cannot explain what the code does, you are not ready to ship it to a client.

## Step 9: Review AI-Generated Code

If you used an AI coding agent during this project, review its output against this checklist before committing:

| Check | Question |
|-------|----------|
| Specification match | Does the code implement what the specification requires? |
| Mobile responsive | Does it work on 320px, 375px, 768px, and 1024px screens? |
| Links correct | Do all `href` values point to the right sections? |
| Semantic HTML | Are headings in order (h1 → h2 → h3)? Are sections using `<section>` not `<div>`? |
| CSS understandable | Can you explain what each CSS rule does? |
| JavaScript necessary | Does the JavaScript solve a real problem, or is it decoration? |
| Console errors | Open the browser console. Are there any red errors? |
| Forms | If there is a form, does it validate input? |
| Accessibility | Do images have alt text? Do buttons have aria-labels? |
| Unnecessary code | Did the AI add dependencies, frameworks, or code you did not ask for? |
| Unexpected changes | Did the AI modify code outside the scope of your prompt? |

**If you cannot answer these questions, do not ship the code.** Go back and understand it first.

## Step 10: Test the Project

Before delivering to the client, test thoroughly. Open `index.html` in a browser and check each item.

### Device Testing

| Device/Size | Width | What to Check |
|-------------|-------|---------------|
| Mobile (small) | 320px | Layout does not overflow, buttons are tappable, text is readable |
| Mobile (standard) | 375px | Navigation hamburger works, sections stack vertically |
| Tablet | 768px | Grid adjusts, navigation may still be hamburger |
| Desktop | 1024px+ | Full layout, all sections visible, navigation is horizontal |

### Feature Testing

| Feature | Expected Behavior | How to Test |
|---------|------------------|-------------|
| Navigation links | Clicking scrolls to the correct section | Click each link |
| Mobile menu toggle | Opens and closes the menu on mobile | Resize to mobile, click the hamburger |
| Phone links (`tel:`) | Opens the phone app on mobile | Tap the phone number on a phone |
| Smooth scrolling | Sections scroll into view smoothly | Click a nav link |
| All sections visible | Every section renders correctly | Scroll through the entire page |
| No horizontal scroll | Page does not scroll left/right on any device | Check on mobile |
| Images/icons | All icons display correctly | Visual inspection |
| Footer | Copyright text visible | Scroll to bottom |

### Browser Console Check

1. Open the page in Chrome
2. Press `F12` to open Developer Tools
3. Click the **Console** tab
4. Look for red error messages
5. **If you see errors, fix them before proceeding**

### Specification Acceptance Check

Go back to Step 2. For each acceptance criterion in the specification, verify it is met:

| Criterion | Met? |
|-----------|------|
| FR-01: Hero with headline and CTA visible above the fold | Check |
| FR-02: Services section lists all 5 services | Check |
| FR-03: "Why choose us" shows 4 trust factors | Check |
| FR-04: Process section shows 3 steps | Check |
| FR-05: Testimonials section with 3 placeholders | Check |
| FR-06: Contact info displayed (phone, email, address) | Check |
| FR-07: Footer with business name and copyright | Check |
| FR-08: Responsive on 320px to 1200px+ | Check |
| FR-09: Navigation smooth scrolls, mobile menu works | Check |

## Step 11: Debug Common Problems

Beginners frequently encounter these issues. Here is how to solve them.

### Problem: CSS Not Loading

| Symptom | The page shows unstyled HTML (plain text, no colors or layout) |
|---------|--------------------------------------------------------------|
| Likely cause | Wrong file path in the `<link>` tag |
| How to check | Right-click the page → "View Page Source" → look at the `<link>` tag |
| Fix | Ensure the path is `css/style.css` (relative to `index.html`). Check that the file is actually in the `css/` folder. |

### Problem: JavaScript Not Running

| Symptom | The mobile menu does not open when you click the hamburger |
|---------|----------------------------------------------------------|
| Likely cause | Wrong file path in the `<script>` tag, or a JavaScript error |
| How to check | Open browser Console (F12) → look for red errors |
| Fix | Ensure the path is `js/script.js`. Check for typos in the JavaScript. |

### Problem: Layout Overflowing on Mobile

| Symptom | The page scrolls left/right on a phone |
|---------|---------------------------------------|
| Likely cause | An element is wider than the viewport |
| How to check | Use Chrome DevTools responsive mode. Find which element overflows. |
| Fix | Add `overflow-x: hidden` to `body`, or find the element with `min-width` or fixed `width` that exceeds the screen. |

### Problem: Mobile Menu Not Closing

| Symptom | The menu opens but does not close when you tap a link |
|---------|-----------------------------------------------------|
| Likely cause | The click handler is not attached to the nav links |
| How to check | Open Console → check for JavaScript errors |
| Fix | Verify the JavaScript selectors match the HTML class names exactly. |

### Problem: Phone Link Not Working on Desktop

| Symptom | Clicking the phone number does nothing on a computer |
|---------|-----------------------------------------------------|
| Expected behavior | `tel:` links only work on devices with phone capability. On desktop, they may do nothing or prompt to use a linked phone. |
| Fix | This is normal. The link works correctly on mobile phones. Do not "fix" it for desktop. |

## Step 12: Final Git Commit

When the project is complete and tested, commit your work:

```bash
# Check what files have changed
git status

# Review the changes
git diff

# Stage all files
git add .

# Commit with a clear message
git commit -m "Complete Rashid Plumbing landing page

- Responsive HTML/CSS/JS landing page
- Mobile navigation with hamburger menu
- Sections: hero, services, why us, process, testimonials, contact
- Tested on mobile and desktop
- No external dependencies"

# Push to GitHub
git push origin main
```

**Why review `git diff` before committing:** It shows you exactly what will be saved. If you accidentally modified a file you should not have, you will catch it here.

## Step 13: Deploy the Project

### Option A: GitHub Pages (Free, Simple)

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, select **Deploy from a branch**
4. Select the `main` branch and `/ (root)` folder
5. Click **Save**
6. Wait 1–2 minutes
7. Your site is live at: `https://YOUR-USERNAME.github.io/rashid-plumbing/`

### Option B: Vercel (Free, Faster)

1. Go to [vercel.com](https://vercel.com) and sign up with your GitHub account
2. Click **Add New** → **Project**
3. Import your `rashid-plumbing` repository
4. Click **Deploy**
5. Your site is live at the URL Vercel provides (e.g., `rashid-plumbing.vercel.app`)

### Verify the Deployed Version

After deployment, open the live URL and test again:

- [ ] All sections render correctly
- [ ] Mobile menu works
- [ ] Phone links work on mobile
- [ ] No console errors
- [ ] Page loads fast

**Important:** Deployment is not automatic proof that everything works. Always test the live URL yourself before telling the client.

## Step 14: Client Delivery

When the project is complete and deployed, send the client a professional delivery message. Here is a template you can adapt:

---

> **Subject:** Rashid Plumbing Landing Page — Complete
>
> Hi Rashid,
>
> The landing page for Rashid Plumbing Solutions is complete and live.
>
> **Live URL:** https://YOUR-USERNAME.github.io/rashid-plumbing/
>
> **What was delivered:**
> - A responsive landing page that works on phones, tablets, and desktops
> - Sections: hero, services, why choose us, how it works, testimonials, contact
> - Click-to-call phone buttons for mobile visitors
> - Professional design in your brand blue color
>
> **What was tested:**
> - Mobile phones (320px and 375px screens)
> - Tablets (768px)
> - Desktop browsers (Chrome, Firefox)
> - All links and navigation
>
> **Notes:**
> - The testimonials section uses placeholder text. Please send me your real customer reviews and I will update them.
> - If you need changes to the content, colors, or layout, let me know and I can adjust.
>
> **Next steps:**
> - Review the page and send any feedback
> - Provide real testimonials when available
> - If you need a domain name (e.g., rashidplumbing.com), I can help set that up
>
> Please let me know if you have any questions.
>
> Best regards,
> [Your Name]

---

**Why this matters:** Professional communication is part of freelancing. Module 1, Chapter 03 taught that clear delivery communication builds trust and leads to repeat work.

## Step 15: Portfolio Case Study

Convert this project into a portfolio entry. Here is a template:

---

### Project: Rashid Plumbing Solutions Landing Page

**Client/Problem:** A local plumbing company with no online presence needed a professional landing page to generate phone calls and quote requests.

**Goal:** Build a responsive, mobile-first landing page that converts visitors into phone calls.

**Solution:** Designed and developed a single-page landing page with clear service descriptions, trust signals, customer testimonials, and prominent call-to-action buttons. Used semantic HTML, responsive CSS, and minimal JavaScript for mobile navigation.

**Technologies:** HTML, CSS, JavaScript, Git, GitHub Pages

**Key Features:**
- Mobile-first responsive design
- Click-to-call phone buttons
- Professional layout with brand-appropriate styling
- Smooth scroll navigation
- Accessible markup

**Challenges:**
- Ensuring the page works well on screens from 320px to 1200px+
- Making phone numbers tappable on mobile while remaining visible on desktop
- Keeping the design clean without using any frameworks

**What I learned:**
- The importance of understanding client requirements before coding
- How to translate a client brief into a specification
- Using AI coding agents for specific tasks while maintaining control
- Testing across multiple devices before delivery

**Live Link:** [YOUR-URL]

**GitHub:** [YOUR-REPO-URL]

---

**Important:** This was a simulated practice project. Be honest about this in your portfolio. Labeling practice projects as real client work damages your credibility if the truth comes out. Real clients care more about your skills and honesty than about whether your first project was paid.

## Final Project Acceptance Checklist

Before considering this project complete, verify every item:

- [ ] Client brief was analyzed and requirements extracted
- [ ] Specification was written before coding began
- [ ] Project structure follows the plan
- [ ] HTML uses semantic elements (`<header>`, `<section>`, `<nav>`, `<footer>`)
- [ ] All 5 services are listed
- [ ] "Why choose us" section has 4 trust factors
- [ ] Process section shows 3 steps
- [ ] Testimonials section exists with placeholder content
- [ ] Contact information is displayed (phone, email, address)
- [ ] Phone links use `tel:` for mobile click-to-call
- [ ] CSS provides professional, clean design
- [ ] Blue brand color is consistent
- [ ] Page is responsive on mobile (320px, 375px)
- [ ] Page is responsive on tablet (768px)
- [ ] Page is responsive on desktop (1024px+)
- [ ] Mobile hamburger menu opens and closes
- [ ] Navigation links scroll to correct sections
- [ ] No horizontal scroll on any device
- [ ] Browser console has no errors
- [ ] Git repository exists with meaningful commits
- [ ] README.md describes the project
- [ ] Code was pushed to GitHub
- [ ] Site is deployed and accessible via public URL
- [ ] Deployed version was tested
- [ ] AI-generated code was reviewed and understood
- [ ] Client delivery message was written
- [ ] Portfolio case study was prepared

## Common Mistakes

### 1. Starting to Code Before Understanding the Brief

Read the client brief three times before writing a single line of code. Extract requirements. Write a specification. Beginners who skip this step build the wrong thing and waste hours.

### 2. Letting AI Make Uncontrolled Decisions

"Build me a website" is not a prompt — it is a wish. AI coding agents produce better results when you give them specific, scoped tasks with clear constraints. You are the architect. The AI is the builder.

### 3. Not Checking Mobile

Most of Rashid's customers will visit on their phones. If the page looks broken on a 375px screen, you have not met the primary requirement. Test mobile first.

### 4. Copying AI Output Without Understanding It

If you paste AI-generated CSS into your project without understanding what each rule does, you cannot debug it when it breaks. Read every line. If you do not understand it, ask the AI to explain it before accepting it.

### 5. Skipping Git Commits

Git is your safety net. Commit early, commit often. If something breaks, you can always go back to the last working version.

### 6. Not Testing the Production Deployment

The page may look perfect locally but break on the deployed URL due to file path issues, case sensitivity, or caching. Always test the live URL before telling the client it is ready.

### 7. Pretending a Simulated Project Was a Real Client Project

Honesty is a professional value. This was a practice project. Label it as such in your portfolio. Real clients respect honesty. They do not respect fabrication.

## Freelancer Perspective

This project teaches you something no theoretical chapter can: **the feeling of delivering a complete project to a simulated client.** Here is what the workflow teaches about real freelance work:

| Lesson | Why It Matters |
|--------|---------------|
| Clients buy outcomes, not code | Rashid does not care about your CSS. He cares about phone calls. |
| Requirements prevent scope creep | Without a specification, the client will keep asking for changes. |
| Communication builds trust | A professional delivery message shows you take the work seriously. |
| Testing protects your reputation | A broken page delivered to a client is worse than a late delivery. |
| Documentation shows professionalism | A README and case study show you are organized and thorough. |
| Honest portfolio work compounds | One honest practice project is worth more than ten fabricated ones. |

## AI/Agent Perspective

Here is where AI coding agents fit into the freelance workflow you just completed:

```text
Client Brief
      ↓
Requirements Analysis (human)
      ↓
Specification (human)
      ↓
Project Plan (human)
      ↓
HTML Structure (AI-assisted)
      ↓
CSS Styling (AI-assisted)
      ↓
JavaScript (AI-assisted)
      ↓
Code Review (human)
      ↓
Testing (human)
      ↓
Bug Fixes (AI-assisted)
      ↓
Deployment (human)
      ↓
Client Delivery (human)
```

AI helped with implementation. You made every important decision. That is the correct balance.

## What You Built

Congratulations. You completed a realistic freelance project from brief to delivery:

| Deliverable | Status |
|-------------|--------|
| Requirements analysis | Done |
| Specification document | Done |
| Responsive landing page | Done |
| HTML structure | Done |
| CSS styling | Done |
| JavaScript (mobile menu) | Done |
| Git repository | Done |
| GitHub push | Done |
| Public deployment | Done |
| Client delivery message | Done |
| Portfolio case study | Done |

You now have a working project you can show to potential clients or employers.

## Next Steps

After completing this project:

1. **Put it in your portfolio** — honestly labeled as a practice project
2. **Build another project** — try a different niche (restaurant, tutor, gym, clinic)
3. **Improve your GitHub** — add a profile README, pin your best repositories
4. **Learn a framework** — when you are ready, explore React, Next.js, or another framework
5. **Start applying** — look for small freelance gigs on platforms appropriate for your skill level
6. **Keep learning** — revisit Modules 1–3 as your experience grows. You will understand the concepts differently with real-world context.

The best way to learn freelancing is to do freelancing. Start small, deliver well, and build from there.
