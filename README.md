# Extell Systems Frontend Redesign

Enterprise-grade frontend website redesign built with React + Vite + Tailwind CSS.

## Stack

- React 18
- Vite 5
- Tailwind CSS 3
- Framer Motion
- Lucide React
- JavaScript (no TypeScript)

## Features

- 14 routed corporate pages
- Sticky responsive header with mega menu
- Animated hero sections with gradient + grid effects
- Product catalog UI with filters (UI only)
- Product comparison modal (UI only)
- Product detail spec tabs + accordions
- Download listing UI
- Contact/newsletter/support forms (frontend only)
- Floating CTA and motion-enhanced interactions
- Reusable component architecture with section/page/layout split

## Project Structure

```txt
.
|-- index.html
|-- package.json
|-- postcss.config.js
|-- tailwind.config.js
|-- vite.config.js
|-- src
|   |-- App.jsx
|   |-- main.jsx
|   |-- styles.css
|   |-- assets
|   |   `-- placeholder-tech.svg
|   |-- data
|   |   `-- siteData.js
|   |-- components
|   |   |-- layout
|   |   |   |-- Footer.jsx
|   |   |   |-- FloatingCTA.jsx
|   |   |   |-- Navbar.jsx
|   |   |   `-- SiteLayout.jsx
|   |   |-- sections
|   |   |   |-- CategoryGridSection.jsx
|   |   |   |-- FeaturedProductsSection.jsx
|   |   |   |-- HomeHero.jsx
|   |   |   |-- NewsletterSection.jsx
|   |   |   |-- SolutionsShowcaseSection.jsx
|   |   |   `-- TrustAndTestimonialsSection.jsx
|   |   `-- ui
|   |       |-- Accordion.jsx
|   |       |-- Button.jsx
|   |       |-- CategoryCard.jsx
|   |       |-- ComparisonModal.jsx
|   |       |-- FilterSidebar.jsx
|   |       |-- PageHero.jsx
|   |       |-- ProductCard.jsx
|   |       |-- SearchBar.jsx
|   |       |-- SectionHeader.jsx
|   |       |-- SpecTabs.jsx
|   |       `-- TrustBadges.jsx
|   `-- pages
|       |-- AboutPage.jsx
|       |-- CareersPage.jsx
|       |-- CaseStudiesPage.jsx
|       |-- CategoryPage.jsx
|       |-- CertificationsPage.jsx
|       |-- ContactPage.jsx
|       |-- DownloadsPage.jsx
|       |-- HomePage.jsx
|       |-- IndustrySolutionsPage.jsx
|       |-- PartnerPage.jsx
|       |-- ProductDetailPage.jsx
|       |-- ProductsPage.jsx
|       |-- SolutionsPage.jsx
|       `-- SupportPage.jsx
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build production output:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

## Notes

- This project is frontend-only by design.
- No backend, database, authentication, transactions, APIs, or CMS are included.
- All forms, filters, search, and comparison features are UI-only interactions.