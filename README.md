# College Connect

A usable React frontend prototype for campus project collaboration.

## Run

```sh
npm install
npm run dev -- --port 5173
```

`npm run build` produces a static deployment bundle. Configure your host to rewrite frontend routes to `index.html`.

## Main routes

- `/`: student overview (default entry)
- `/projects`, `/projects/:id`: search, filters, details, applications
- `/teammates`, `/people/:id`: complementary collaborator discovery
- `/profile`: editable academic profile, no resume required
- `/student-posts`: searchable campus post feed; new posts appear here immediately
- `/posts`: personal work and activity CRUD
- `/recruitment`: student-owned recruitment requirements and sent invitations
- `/teams`: current teams and separate completed participation records
- `/applications`: application status and received invitations
- `/portfolio`, `/skills`, `/workshops`
- `/welcome`: public landing page
- `/faculty`, `/faculty/applicants`: project requirements and applicant review
- `/admin`, `/admin/projects`, `/admin/reports`: user roles, records, reports

Use **Preview as** in the sidebar for role-specific navigation. This is a presentation switch, not authentication or authorization.

## Architecture

- `src/data/mock.js`: initial entities and realistic fixtures
- `src/data/community.js`: peer activity and explicit project recommendation fixtures
- `src/services/recommendations.js`: curated recommendation fixture boundary (no AI or scoring)
- `src/services/store.js`: browser persistence boundary; replace with API access for FastAPI integration
- `src/components`: shared presentation primitives and focused form workflows
- `src/pages`: routed domain screens
- `src/App.jsx`: shared navigation, app state, routes and feedback
- `src/styles.css`: centralized design tokens, component styles and responsive rules

Recruitment requirements, personal showcase posts, and completed team participation use separate entities and destinations. Skills mentioned in posts never update profile expertise automatically.

## Prototype boundaries

Data stays in local storage. No backend, authentication, AI model, real invitations, notifications, messages, or registrations are implemented. Recommendations and review applicants are curated mock fixtures, not model output. Media selection stores filenames only; it does not upload or retain file contents. Links in sample content are illustrative.

Browser-native form validation, focus-trapped dialogs, Escape dismissal, keyboard focus styling, responsive navigation, status messages, search empty states and missing-route states are included. Data is synchronous; no artificial API/loading simulation is used. Storage failures produce an error notification.

## Checks

`npm run build` validates production bundling. Browser smoke checks in `checks/smoke.mjs` cover route rendering, search, post persistence, applications, profile editing, and mobile navigation. To run them separately, install Playwright as a development tool and its Chromium dependencies; the application itself does not depend on it.

## Posts and evolving profiles

`ActivityProfile` derives post-topic tags and a source-linked activity timeline from published posts. Editing and deleting a post updates these views automatically; self-declared profile skills remain independent. Peer profiles use the same component with curated community post fixtures. No skill mention is treated as verified expertise.

`RecommendedMembers` shows proposed contributions, explicit rationale, links to source work, self-reported availability, and known fit limitations. Existing sample projects have project-specific curated suggestions. New requirements use clearly labelled category-based example shortlists, not live personalized results. Owners can invite directly to the selected requirement; other students can select one of their own projects. Sent invitations persist separately from received invitations and can be withdrawn.

`checks/posts-recruitment.mjs` additionally tests community search, publishing to feed/profile, non-inference of expertise, requirement creation, invitation project context, sent-invitation persistence and withdrawal, and layout overflow at 390px, 768px and 1440px.

## Faculty skill-gap planning

Use **Preview as → Faculty → Skill Gaps**, or visit `/faculty/skill-gaps`.

- Demand: distinct currently recruiting, non-full projects requesting a skill.
- Supply: distinct mock student profiles plus the locally edited student profile listing that skill.
- Skill names are trimmed and compared case-insensitively; synonyms are not inferred.
- A positive difference flags demand pressure, not an exact number of unfilled positions.
- Post-topic mentions, certifications and workshop attendance are not counted as proficiency.
- Source drilldowns link to requesting projects and self-declared student profiles.
- Workshop planning prefills title and skill; related workshops appear in the drilldown. Publishing a workshop does not erase a skill gap.
- CSV export includes the current full report.

This is descriptive reporting over mock/local data, not a backend analytics service or AI algorithm. `checks/skill-gaps.mjs` covers counts, drilldowns, workshop planning, profile changes, filters and responsive layouts.

React 19: Component-based UI library powering the views and state.
Vite 6: Fast modern frontend build tool and development server.
React Router 7: Handles client-side navigation between pages (Dashboard, Projects, Chat, Profile, etc.).
Lucide React: Clean, modern SVG icon set used across all components.
Vanilla CSS3: Custom responsive styling with CSS variables, Flexbox/Grid layouts, and glassmorphism (no heavy UI frameworks).
HTML5 & Modern JavaScript (ES6+ / JSX): Standard semantic structure and component logic.