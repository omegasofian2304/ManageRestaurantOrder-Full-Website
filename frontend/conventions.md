# Repository Conventions - RestaurantManageOrder (Frontend Vue.js)

This document defines the technical and organizational conventions of the frontend project to ensure clean, consistent, readable, and maintainable code.

------------------------------------------------------------------------

## 1. Branching Strategy

### Branches

- `main` → stable production branch
- `develop` → integration branch
- `feature/<feature-name>` → new feature
- `fix/<bug-name>` → bug fix
- `refactor/<module-name>` → refactoring

### Examples

- `feature/US-04-authentication`
- `feature/US-06-meals-list`
- `fix/US-08-loading-spinner`
- `refactor/US-12-components`

------------------------------------------------------------------------

## 2. Conventional Commits

This project follows the Conventional Commits specification.

### Format

`<type>(scope): <description>`

### Allowed types

- `feat` → new feature
- `fix` → bug fix
- `refactor` → code refactoring
- `perf` → performance improvement
- `docs` → documentation
- `style` → formatting only (no logic changes)
- `test` → tests
- `chore` → configuration or tooling

### Examples

- `feat(auth): add login form with validation`
- `feat(meals): implement meals list component`
- `fix(router): correct navigation guard logic`
- `refactor(store): simplify auth state management`
- `docs(readme): update installation instructions`

------------------------------------------------------------------------

## 3. Project Structure

The project follows Vue.js best practices with a modular architecture.

### Architecture Overview

```
src/
├── assets/          # Static files (images, global CSS)
├── components/      # Reusable Vue components
│   ├── common/      # Generic components (buttons, loaders, etc.)
│   ├── meals/       # Meal-related components
│   ├── orders/      # Order-related components
│   └── layout/      # Layout components (navbar, footer, etc.)
├── views/           # Page-level components (routes)
├── stores/          # Pinia stores for state management
├── services/        # API services
├── router/          # Vue Router configuration
├── utils/           # Utility functions
├── App.vue          # Root component
└── main.js          # Application entry point
```

### Architecture Rules

- Components must not contain direct API calls (use services).
- Business logic must remain inside Pinia stores.
- API calls must be centralized in services.
- Views must only compose components and manage routing.
- Use API Options (not Composition API) for consistency.

------------------------------------------------------------------------

## 4. Naming Conventions

### Global Rules

- English only
- Explicit and descriptive names
- No unclear abbreviations
- No generic names such as `temp`, `test`, `stuff`

### Files and Folders

- Vue components → `PascalCase.vue`
- JavaScript files → `camelCase.js`
- Folders → `lowercase`
- Views → `<Name>View.vue`
- Store files → `<resource>.js`
- Service files → `<resource>Service.js`

Examples:
- `LoginView.vue`
- `MealCard.vue`
- `mealsService.js`
- `auth.js` (store)

### Variables and Constants

- Variables → `camelCase`
- Constants → `UPPER_SNAKE_CASE`

Example:

```javascript
const API_BASE_URL = 'http://localhost:3000';
let userEmail;
let isLoading = false;
```

### Functions and Methods

- `camelCase()`
- Use verbs for actions

Examples:

```javascript
fetchMeals()
handleLogin()
validateForm()
formatPrice()
```

### Components

- Component names → `PascalCase`
- Multi-word component names required

Examples:
- `MealCard.vue`
- `OrderList.vue`
- `LoadingSpinner.vue`
- `BaseButton.vue`

------------------------------------------------------------------------

## 5. Documentation and Source Usage

### AI Assistance

When AI is used to generate code or text, indicate it in the following format:

```
Source AI: ChatGPT
Prompt: Generate a Vue component for displaying meals
```

### External Sources

When referencing official documentation or external websites:

```
Source: https://vuejs.org/guide/components/props.html
```

Sources must be indicated directly above the code that uses them.

------------------------------------------------------------------------

## Living Document

This document is subject to change.
Any modification must be validated by the team before adoption.
