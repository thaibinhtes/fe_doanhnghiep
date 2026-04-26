# TailAdmin Vue — Agent Guide

> TailAdmin Vue is a free, open-source admin dashboard template built on **Vue.js 3**, **Tailwind CSS v4**, and **TypeScript**. It uses **Vite** as the build tool and **Vue Router 4** for client-side routing. The project provides pre-built UI components, charts, tables, forms, layouts, and pages for data-driven admin panels.

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Vue 3.5.x (Composition API + Options API mixed) |
| Build Tool | Vite 6.x |
| Language | TypeScript 5.7.x |
| Styling | Tailwind CSS 4.x (PostCSS plugin) |
| Router | Vue Router 4.x |
| Charts | ApexCharts via `vue3-apexcharts` |
| Calendar | FullCalendar 6.x (`@fullcalendar/vue3`) |
| Icons | Custom SVG Vue components (`src/icons/`) + `lucide-vue-next` |
| Date Picker | `flatpickr` via `vue-flatpickr-component` |
| Maps | `jsvectormap` via `vuevectormap` |
| Slider | Swiper 11.x |
| Linting | ESLint 9 + `eslint-plugin-vue` + `@vue/eslint-config-typescript` |
| Formatting | Prettier 3 |

> **Note:** The README mentions Pinia for state management, but the project does **not** currently use Pinia. Shared state (sidebar, theme) is implemented with Vue's `provide`/`inject` pattern inside provider components.

---

## Project Structure

```
├── public/                     # Static assets (images, favicon)
│   └── images/
├── src/
│   ├── assets/
│   │   └── main.css            # Global Tailwind CSS entry + custom utilities + third-party overrides
│   ├── components/
│   │   ├── charts/             # ApexCharts wrappers (BarChart, LineChart)
│   │   ├── common/             # Reusable pieces (PageBreadcrumb, ComponentCard, DropdownMenu, ThemeToggler, etc.)
│   │   ├── ecommerce/          # Dashboard widgets (StatisticsChart, MonthlyTarget, RecentOrders, etc.)
│   │   ├── forms/
│   │   │   └── FormElements/   # Inputs, selects, checkboxes, file uploads, toggles, etc.
│   │   ├── layout/             # App shell (AdminLayout, AppSidebar, AppHeader, ThemeProvider, SidebarProvider, Backdrop)
│   │   ├── profile/            # Profile page cards
│   │   ├── tables/
│   │   │   └── basic-tables/   # Table components
│   │   └── ui/                 # Atomic UI primitives (Alert, Avatar, Badge, Button, Modal, images, videos)
│   ├── composables/
│   │   └── useSidebar.ts       # Sidebar state logic (provide/inject based)
│   ├── icons/                  # Custom SVG icon components
│   │   └── index.ts            # Barrel export for all icons
│   ├── router/
│   │   └── index.ts            # Vue Router routes (all lazy-loaded)
│   ├── views/                  # Page-level route components
│   │   ├── Auth/               # Signin, Signup
│   │   ├── Chart/              # BarChart, LineChart demo pages
│   │   ├── Errors/             # 404 page
│   │   ├── Forms/              # Form elements demo page
│   │   ├── Others/             # Calendar, UserProfile
│   │   ├── Pages/              # BlankPage
│   │   ├── Tables/             # BasicTables demo page
│   │   └── UiElements/         # Alerts, Avatars, Badges, Buttons, Images, Videos
│   ├── App.vue                 # Root app wrapper (ThemeProvider > SidebarProvider > RouterView)
│   ├── main.ts                 # App bootstrap (styles, router, apexcharts)
│   ├── index.d.ts              # Type declaration for `jsvectormap`
│   └── vue.shims.d.ts         # Shim for `*.vue` imports
├── env.d.ts                    # Vite client types reference
├── index.html                  # HTML entry point
├── vite.config.ts              # Vite config (Vue, JSX, devtools, `@` alias)
├── tsconfig.json               # Root TS config (references app + node configs)
├── tsconfig.app.json           # App TS config (extends `@vue/tsconfig/tsconfig.dom.json`)
├── tsconfig.node.json          # Node/build TS config
├── eslint.config.ts            # ESLint flat config (Vue + TS + Prettier skip-formatting)
├── .prettierrc.json            # Prettier config
├── postcss.config.js           # PostCSS config (Tailwind CSS v4 plugin)
└── package.json
```

### Path Alias

- `@/` resolves to `src/`. This is configured in `vite.config.ts`, `tsconfig.json`, and `tsconfig.app.json`.

---

## Build and Development Commands

All commands are run via `npm` (or `yarn`):

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check + production build |
| `npm run build-only` | Production build without type-checking |
| `npm run type-check` | Run `vue-tsc --build` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint with `--fix` |
| `npm run format` | Run Prettier on `src/` |

### Prerequisites

- **Node.js 18.x+** (Node.js 20.x+ recommended)
- Recommended IDE: **VS Code** + Volar (Vue Language Features)

---

## Code Style Guidelines

### Prettier Configuration (`.prettierrc.json`)

```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100
}
```

### ESLint Configuration (`eslint.config.ts`)

- Uses the **flat config** format (ESLint 9)
- Lints `**/*.{ts,mts,tsx,vue}`
- Extends `pluginVue.configs['flat/essential']`
- Extends `@vue/eslint-config-typescript` recommended rules
- **Prettier formatting conflicts are skipped** (`skipFormatting`) — run `npm run format` for formatting
- Ignores `dist/`, `dist-ssr/`, `coverage/`

### Vue Component Conventions

- Components are written as **Single File Components (`.vue`)**.
- The codebase uses a **mix of `<script setup>` (Composition API) and Options API (`<script>`)**.
  - Newer/refactored components tend to use `<script setup>`.
  - Some older page views still use Options API (e.g., `Ecommerce.vue`).
- Prefer `lang="ts"` on `<script setup>` for type safety.
- Component naming: **PascalCase** for files and component names.
- Custom icons are stored as individual `.vue` files in `src/icons/` and barrel-exported from `src/icons/index.ts`.

### Tailwind CSS v4 Conventions

- Tailwind CSS v4 is imported via `@import 'tailwindcss'` inside `src/assets/main.css`.
- Custom theme values (colors, fonts, breakpoints, shadows, text sizes, z-indexes) are defined in `@theme` inside `main.css`.
- Custom utilities are defined with `@utility` (e.g., `menu-item`, `no-scrollbar`, `custom-scrollbar`).
- Dark mode is class-based: `dark` class on `document.documentElement`. Use `dark:` prefixes.
- Explicit border color utilities may be needed because Tailwind v4 defaults to `currentColor`.
- Third-party library styles (ApexCharts, FullCalendar, Swiper, Flatpickr, JSVectorMap) are heavily customized with plain CSS in `main.css`.

---

## State Management Patterns

The project does **not** use Pinia or Vuex. Shared state is managed via **Vue `provide`/`inject`**:

- **Theme** (`src/components/layout/ThemeProvider.vue`): Provides `isDarkMode` and `toggleTheme`. Theme is persisted to `localStorage` under key `theme`.
- **Sidebar** (`src/composables/useSidebar.ts` + `src/components/layout/SidebarProvider.vue`): Provides sidebar expand/collapse state, mobile open state, hover state, active item, and submenu state.

When adding new global state, consider whether `provide`/`inject` is sufficient or if Pinia should be introduced.

---

## Routing

- Located in `src/router/index.ts`.
- Uses `createWebHistory`.
- All routes are **lazy-loaded** with `() => import('../views/...')`.
- Route `meta.title` is used to set `document.title` in a global `beforeEach` guard.
- There is no authentication guard or route middleware currently implemented.

---

## Testing

**There are currently no tests in this project.** The `tsconfig.app.json` explicitly excludes `src/**/__tests__/*`, but no test files exist under `src/`.

If adding tests, consider:
- **Vitest** ( aligns with Vite )
- **Vue Test Utils** for component testing
- **Playwright** or **Cypress** for E2E testing

---

## Key Dependencies and Integrations

### Charts (`vue3-apexcharts`)
- Register globally in `main.ts` via `app.use(VueApexCharts)`.
- Chart options are typically large static objects inside components.
- ApexCharts theming is customized in `main.css` for dark mode.

### Calendar (`@fullcalendar/vue3`)
- Used in `src/views/Others/Calendar.vue`.
- Custom CSS overrides for FullCalendar buttons and events are in `main.css`.

### Date Picker (`vue-flatpickr-component`)
- Used in forms and the statistics chart header.
- Dark mode and range-mode styling is customized in `main.css`.

### Maps (`vuevectormap` / `jsvectormap`)
- Used for vector map widgets.
- CSS overrides for map colors are in `main.css`.

### Swiper
- Used for carousels/sliders.
- Styles imported in `main.ts`: `swiper/css`, `swiper/css/navigation`, `swiper/css/pagination`.
- Custom navigation/pagination styles in `main.css`.

---

## Security Considerations

- **No authentication system** is implemented. The `Signin.vue` and `Signup.vue` pages are purely presentational (visual forms only).
- **No API layer** exists. All data is hard-coded/static.
- **No input sanitization** or XSS protection is applied beyond Vue's built-in template escaping.
- If adding real authentication or API calls, implement proper input validation, CSRF protection, and secure storage of tokens.

---

## Adding New Components or Views

1. **Components**: Add to the appropriate folder under `src/components/`. Follow existing naming conventions (PascalCase). Use `<script setup lang="ts">` for new components.
2. **Icons**: Add new SVG icon components to `src/icons/` and export them in `src/icons/index.ts`.
3. **Views**: Add new page components under `src/views/` (group in subfolders by category). Register the route in `src/router/index.ts` with lazy loading.
4. **Styling**: Use Tailwind utility classes. For reusable style patterns, add `@utility` rules in `src/assets/main.css`.
5. **Global styles**: Override third-party libraries in `main.css` under the relevant section.

---

## Common Gotchas

- `vue-tsc` is used instead of `tsc` because TypeScript cannot natively handle `.vue` file types.
- `npm run build` runs `type-check` and `build-only` in parallel via `npm-run-all2`.
- The project uses **ES Modules** (`"type": "module"` in `package.json`).
- Some `.vue` files are missing `lang="ts"` and use plain JavaScript — prefer adding `lang="ts"` when editing them.
- Tailwind CSS v4 syntax (`@theme`, `@utility`, `@custom-variant`) is used — do not use v3 configuration files (`tailwind.config.js`).
