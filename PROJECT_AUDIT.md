*# PROJECT AUDIT — ADD PARKOUR ORAN

**Date**: 2026-09-26  
**Project**: ADD Parkour Oran — Membership & Registration Platform (Standalone Web Application)  
**Location**: `f:\WebProjects\ADDoran\inscription`

---

## 1. Current Repository State
- **Filesystem**: The directory `f:\WebProjects\ADDoran\inscription` is verified completely empty (0 files, 0 directories).
- **Git**: Not initialized.
- **Runtime Environment**: Node.js `v24.15.0`, npm `11.12.1` on Windows.

## 2. Existing Stack
- None. Clean greenfield workspace.

## 3. Existing Dependencies
- None.

## 4. Existing Configuration
- None.

## 5. Existing Database / Infrastructure
- None.

## 6. Existing Routes / Pages
- None.

## 7. Existing Authentication
- None.

## 8. Existing Styling / Design System
- None.

## 9. Existing Tests
- None.

## 10. Risks
- **Privacy & Sensitive Documents**: Handling national IDs, medical certificates, photographs, and minor records requires strict server-side access control; sensitive files must never be placed in `/public` or exposed via unauthenticated endpoints.
- **Concurrency & Number Generation**: Sequential references (`ADD-2026-000001` and `ADD-PAY-2026-000001`) must be generated atomically via database transactions to prevent race conditions.
- **Multilingual & RTL Integrity**: Supporting French, Arabic, and English requires genuine bidirectional typography, dynamic `dir="rtl"` layout flipping, and localized document rendering (including PDF exports).
- **Document Readability vs Size**: Photos and scanned documents must be validated, limited in file size, and securely handled without sacrificing legibility for administrative review.
- **Legal Compliance**: Algerian Law 18-07 on personal data protection requires explicit consent, purpose limitation, secure storage, and clear privacy disclosure for minors and adults.

## 11. Missing Infrastructure
- Full-stack framework with SSR and API routes.
- Relational database schema, ORM, and atomic migration engine.
- Session authentication with secure HTTP-only cookies and bcrypt password hashing.
- Private document storage engine with mime validation and access-controlled streaming.
- Centralized i18n translation system supporting LTR and RTL.
- High-performance sports club design system with athletic aesthetics (charcoal/black, energetic amber/orange, sport typography).
- Multi-step registration state machine and duplicate detection engine.
- Printable & downloadable PDF paperwork generator (Confirmation, Engagement, Parental Authorization, Cash Receipt, Dossier).
- Unit, integration, and security test suite.

## 12. Recommended Architecture
- **Framework**: **Next.js 15 (App Router) + TypeScript**  
  *Rationale*: Unified full-stack architecture with React Server Components, server actions/API routes for secure document streaming, fast client-side step transitions, and production readiness.
- **Styling & Design System**: **Tailwind CSS + Custom CSS Variables Design System**  
  *Tokens*: Deep charcoal (`#0c0d0e`), carbon black (`#141618`), athletic amber/orange (`#ff5722`, `#f59e0b`), tactile borders, athletic typography, smooth micro-interactions, responsive mobile-first layouts, and full RTL utility support.
- **Database & ORM**: **SQLite with Prisma ORM**  
  *Rationale*: Zero-config local reliability, strict foreign keys, atomic transactions for sequential reference/receipt generation, easily switchable to PostgreSQL in cloud deployment via Prisma.
- **Security & Private Storage**:  
  - Uploads stored in dedicated local private storage (`./storage/uploads`), outside the public web root.
  - Streaming endpoint `/api/documents/[id]` enforcing ownership or admin role before dispatching files with strict `Cache-Control: private` and `Content-Disposition`.
  - Session tokens stored in HTTP-only, SameSite cookies with SHA-256 session tracking and bcrypt password hashing.
- **Document / PDF Generation**:  
  - Dynamic vector-accurate printable paperwork engines and PDF generator supporting French, Arabic, and English.
- **i18n Architecture**:  
  - Centralized dictionary registry (`fr`, `ar`, `en`), direction-aware (`ltr`/`rtl`), accessible throughout client and server components.

---

## 13. Implementation Plan

- **Phase 1: Project Setup & Core Configuration**
  - Initialize Next.js 15 + TypeScript + Tailwind CSS project in the workspace.
  - Setup Prisma schema with SQLite, database migrations, and seed scripts.
  - Setup environment variables (`.env.example`, `.env`).

- **Phase 2: Core Domain Model & Security Foundation**
  - Prisma Schema: `User`, `Participant`, `Season`, `Registration`, `RegistrationDiscipline`, `Discipline`, `Document`, `ParentalAuthorization`, `Payment`, `AuditLog`, `SequentialCounter`.
  - Auth system: password hashing (bcryptjs), secure session cookies, role checks (`ADMIN`, `PARTICIPANT`), password reset workflow.
  - Private document storage abstraction with MIME-type inspection and secure authenticated streaming API.

- **Phase 3: Design System & Multilingual Framework**
  - Sports club visual design system: palette (obsidian charcoal, vivid amber/orange, white, muted grays), athletic typography, badge/button/input/dialog components.
  - Centralized i18n translation engine (`fr`, `ar`, `en`) with RTL support for Arabic.

- **Phase 4: Public Experience & Club Presentation**
  - Immersive homepage featuring ADD Parkour Oran philosophy, discipline showcases (Parkour, Escalade & sports de montagne, Trail), club history, and direct registration CTA.

- **Phase 5: Guided 7-Step Registration Workflow**
  1. Account Creation (Phone number mandatory, password, optional email/WhatsApp).
  2. Identity & Dynamic Age Calculation (Automatic adult vs minor detection).
  3. Disciplines Selection (Parkour, Escalade & sports de montagne, Trail).
  4. Document Uploads (Photo with camera capture option, National ID, Medical certificate).
  5. Minor Flow & Engagement (Parental authorization upload & declaration, Club engagement consent).
  6. Review & Duplicate Warning (Intelligent fuzzy check without blocking).
  7. Confirmation & Reference Generation (`ADD-2026-000001`).

- **Phase 6: Participant Space ("Mon Espace")**
  - Status tracking (`SUBMITTED`, `UNDER_REVIEW`, `NEEDS_CORRECTION`, `ACCEPTED`, `PAYMENT_PENDING`, `ACTIVE`).
  - Correction & Re-upload workflow with admin reason display.
  - Document viewing & paperwork downloads.

- **Phase 7: Administration Platform**
  - Season-scoped dashboard with real metrics.
  - Registration filtering, search, and detail inspector.
  - Action workflows: Accept, Reject, Request Correction (with granular field reasons), Mark Duplicate.
  - Audit trail logging.

- **Phase 8: Cash Payments & Printable Receipts**
  - Physical cash payment recording.
  - Immutable sequential receipt generation (`ADD-PAY-2026-000001`).
  - Printable receipt layout with signature and manual club stamp zones.

- **Phase 9: Multilingual PDF / Paperwork Generation**
  - Official paperwork templates: Registration Confirmation, Engagement, Parental Authorization, Cash Receipt, and Full Dossier.
  - Language selection (FR, AR, EN) before printing/downloading.

- **Phase 10: Testing, Security Validation & Quality Gates**
  - Unit tests: age calculation, reference formatting, status transitions, duplicate heuristics.
  - Integration/API tests: registration, auth boundaries, private document protection.
  - Visual QA across mobile, desktop, tablet, and RTL.
