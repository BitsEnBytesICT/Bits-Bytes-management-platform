# Participant dashboard

## Implementation and repository conventions

The general participant dashboard uses the existing `/` route for participant accounts. Its design reference is the supplied 1440 × 1943 PNG and Figma CSS. The application navigation and the existing mobile notice remain shared with the other pages.

The frontend uses React 19, TypeScript, React Router, Vite and Tailwind 4. Feature pages have their own folder, service and `components` subfolder. Reusable controls and hooks belong in `common`; domain interfaces belong in `types`. This feature follows that organization with `pages/ParticipantDashboard` and `types/participantDashboard`.

Components and interfaces use PascalCase, interfaces use the `I` prefix, functions use camelCase, and services use the `.service.ts` suffix. Frontend formatting follows `.prettierrc`: four spaces, double quotes, semicolons, trailing commas, 120-character lines and no spaces inside import braces. Styling uses Tailwind utilities, existing color variables, Outfit and the existing asset exports. Shared component defaults remain available; optional dashboard styling is scoped to this feature.

The Express backend separates routes, controllers, services and DAOs, with validators and Casbin permissions. Deployed persistence uses MySQL; development uses SQLite and a separate migration directory. The C++/Drogon knowledge-base project is a separate unfinished subsystem. Docker/Kubernetes and GitHub Actions provide deployment and build checks.

## Shortcuts

The initial shortcut list is empty. The plus tile opens the add dialog. Each shortcut has `id`, `label` and `url`; users can open, edit or delete it. The favicon is visible at rest, and the name and editing controls appear on hover or keyboard focus.

The existing local-storage hook saves the ordered list under `participantDashboard.shortcuts.v1`. This is browser-local data, shared by accounts using the same browser profile and origin. It is not participant-specific and does not synchronize between devices. When storage cannot be written, changes remain in memory and the page explains that they cannot be persisted.

Only HTTP and HTTPS URLs without embedded credentials are accepted. Bare domains receive an HTTPS prefix. Stored records are validated again before rendering. External links use `noopener noreferrer`, labels render as text, and favicon requests use only the website origin with no referrer. An unavailable `/favicon.ico` falls back to the existing link icon; sites that advertise their favicon only through page metadata may use this fallback. There is no server-side URL fetcher or third-party favicon service.

Native modal dialogs provide focus containment; the shared dialog hook restores focus on close. Deleting a shortcut returns focus to the plus tile because the original tile no longer exists.

## Deferred integrations

VM summaries and rows are explicitly labeled Figma examples. The sample summary of four online VMs is independent of the sample rows, as in the design. `getDemoSummary` and `getDemoVirtualMachines` are the replacement points for a future API. The VM buttons show an availability message and do not provision or change anything.

The floor-plan panel remains a placeholder. The Server ruimte and Gymzaal buttons only select a room visually; no room or participant data is fetched.

Future account-owned shortcuts should use the existing route/controller/service/DAO structure, a table related to Accounts, and matching MySQL and SQLite migrations. The backend must derive ownership from the authenticated account and enforce it on every read and write. Do not automatically upload browser-local shortcuts without deciding how to assign their ownership.

## Existing security findings from the static review

These are existing issues outside this frontend feature, not new dashboard functionality:

- `accounts.service.ts` decrypts account passwords and its controllers return the resulting account objects, including the password. Account response types should omit credentials, and password storage needs a dedicated hashing migration.
- Several DAOs and `daoBase.ts` bind SQL values but interpolate column names from request-provided filter tuples. TypeScript types do not validate HTTP input; column names need runtime allowlists.
- Token refresh uses `ignoreExpiration: true` without a separate refresh lifetime limit. Login cookies use HttpOnly and SameSite but do not set Secure.
- Development seed accounts, including participants, receive the admin role with wildcard permissions. The account type used for page routing is not an authorization boundary.
- Development startup and existing backend tests reseed the SQLite database. Run backend verification against disposable data.

The review covered repository architecture, shared components, endpoint/data-access patterns, authentication, migrations, the knowledge-base scaffold and delivery configuration. It was not a penetration test or dependency vulnerability audit.

## Verification

`npm run test:dashboard` runs the shortcut URL and stored-data validation tests using Node's built-in test runner (Node 22.18+). Existing build, formatting and lint commands still apply. Browser checks should cover shortcut CRUD and refresh persistence, keyboard navigation and Escape, unavailable favicons/storage, empty and populated layouts, room selection, VM notices, and desktop widths of 800, 1024 and 1440 pixels.

Validated for this implementation: 27 dashboard/storage tests and all 40 existing backend tests pass; frontend and backend builds and the frontend formatting check pass. All changed frontend files pass ESLint. The full-repository lint run still reports pre-existing errors in other components, pages and layout files.

Browser verification covered the empty and populated dashboard, shortcut creation/editing/deletion and refresh persistence, unsafe URL rejection, unavailable favicon fallback, long labels, forward/backward keyboard focus cycling, Escape and focus restoration, VM availability feedback, room selection, and the existing participant-management popup. At 800 and 1024 pixels the settled page has no horizontal overflow; the VM table scrolls within its own container at the smaller width. At 1440 pixels the shortcut, VM and floor-plan sections begin at the reference positions of 400, 803 and 1175 pixels.
