# Club Art Du Déplacement Parkour Oran — Membership & Registration Platform

A standalone, production-grade web application engineered for **Club Sportif Art Du Déplacement Parkour Oran** (Oran, Algeria).

The platform manages the complete lifecycle of member registrations, minor protection workflows, document authentication, administrative reviews, cash receipts, and multilingual official paperwork generation.

---

## 1. Architecture & Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + TypeScript + React 19
- **Design System**: Athletic Urban Sports Club Design System (Obsidian Charcoal, Energetic Amber/Orange, Tactile Borders, High-Contrast Typography, Fluid Mobile Experience)
- **Database & Data Layer**: SQLite + [Prisma ORM](https://www.prisma.io/) with atomic sequential counters
- **Security & Private Storage**: Authenticated document streaming (`/api/documents/[id]`) with local private storage (`./storage/uploads`) outside public web roots
- **Authentication**: HTTP-only secure cookie session engine with `bcryptjs` password hashing and role boundaries (`PARTICIPANT`, `ADMIN`)
- **i18n & Bidirectionality**: Centralized scalable tri-lingual dictionary engine supporting **Français**, **العربية** (genuine RTL layout flipping), and **English**
- **Paperwork Engine**: Localized high-resolution vector and print engine for Registration Summaries, Parental Authorizations, Charters, Cash Receipts, and Full Dossiers

---

## 2. Core Modules & Workflows

### 2.1 Guided 7-Step Registration Workflow
1. **01 — Compte / Account**: Mandatory phone number, secure password with confirmation, optional email and WhatsApp.
2. **02 — Identité / Identity**: First name, last name, date and place of birth, residential address, blood type selection (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`, `Unknown`).
   - **Automatic Minor Detection**: The system calculates `age < 18` automatically from `dateOfBirth`. No manual selection is required.
3. **03 — Disciplines**: The 3 officially approved disciplines:
   - **Parkour**
   - **Escalade & sports de montagne**
   - **Trail**
4. **04 — Documents**: Photo (with desktop file upload or mobile camera capture), National ID document (CNI / Passport), Medical certificate, and Legal Guardian ID (for minors).
5. **05 — Engagement & Parental Declaration**: Official club charter consent; for minors, parental declaration with dedicated link opening the official authorization text in a new tab.
6. **06 — Vérification & Duplicate Detection**: Summary review with non-blocking duplicate detection warning.
7. **07 — Confirmation & Reference Generation**: Concurrency-safe atomic reference generation conforming to `ADD-2026-000001`.

### 2.2 Participant Space ("Mon Espace")
- Real-time file review status (`SUBMITTED`, `UNDER_REVIEW`, `NEEDS_CORRECTION`, `ACCEPTED`, `PAYMENT_PENDING`, `ACTIVE`, `ARCHIVED`).
- **Correction Workflow**: When flagged with `NEEDS_CORRECTION`, the participant sees specific admin instructions, replaces problematic files directly, and resubmits without creating duplicate registrations.
- Secure private document viewing.
- Downloadable official PDFs and charters.

### 2.3 Administrative Console
- Season-scoped operational metrics.
- Multi-criteria participant search (reference, name, phone, email, date of birth) and filters (discipline, status, duplicate flag).
- Participant inspection modal with document evaluation and status actions (`ACCEPT`, `REJECT`, `REQUEST_CORRECTION`, `MARK_DUPLICATE`, `ARCHIVE`).
- Full audit logging for sensitive actions.

### 2.4 Cash Payment Recording & Immutable Receipts
- Physical cash collection recorded at the club premises.
- Concurrency-safe atomic receipt numbering (`ADD-PAY-2026-000001`).
- Printable payment receipt with manual club cachet / stamp area and treasurer signature line.
- Automatic member status transition to `ACTIVE` upon payment recording.

### 2.5 Privacy & Regulatory Compliance (Algerian Law 18-07)
- Complies with Algerian **Loi n° 18-07 du 10 juin 2018 relative à la protection des personnes physiques dans le traitement des données à caractère personnel**.
- Detailed privacy documentation at `/privacy`.
- Private storage abstraction ensuring sensitive documents are never exposed via static URLs.

---

## 3. Database Schema Overview

```prisma
model User                  // Phone, passwordHash, role (PARTICIPANT, ADMIN)
model Session               // Secure token, userId, expiresAt
model Season                // Code ("2026"), label, isActive
model Participant           // Identity, dateOfBirth, placeOfBirth, bloodType, isMinor
model Discipline            // Slug, nameFr, nameAr, nameEn
model Registration          // Reference (ADD-2026-000001), status, engagement
model RegistrationDiscipline// Join table registration <-> discipline
model Document              // Type, storagePath, originalFilename, mimeType, status
model ParentalAuthorization // Guardian name, digital declaration, timestamp
model Payment               // ReceiptNumber (ADD-PAY-2026-000001), amount, cash method
model AuditLog              // Action, userId, registrationId, details, ipAddress
model SequentialCounter     // Atomic counter keys (REG_2026, PAY_2026)
```

---

## 4. Local Setup & Getting Started

### Prerequisites
- Node.js >= 20.x
- npm >= 10.x

### Installation
```bash
# 1. Clone or navigate to the repository
cd inscription

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env

# 4. Initialize Database & Run Seed
npx prisma db push
npm run db:seed
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Admin Credentials (from seed)
- **Phone**: `0555000000`
- **Password**: `AdminPassword2026!`
- **Access Route**: `/login` -> redirects to `/admin`

---

## 5. Automated Testing & Quality Gates

The project contains a complete unit, integration, and security test suite:

```bash
# Run unit, integration, and security tests (34 tests)
npm test

# Run code linting
npm run lint

# Run production build
npm run build
```

---

## 6. Official Printable Paperwork Routes

- `/paperwork/[registrationId]`: Full dossier, registration summary, club charter, or parental authorization with language selector (`FR`, `AR`, `EN`) and print-optimized vector layout.
- `/receipt/[receiptNumber]`: Official cash payment receipt with sequential receipt ID and manual cachet box.
- `/parental-doc`: Standalone parental authorization document for print and administrative municipal legalization (APC).
- `/regulations`: Official club commitment charter and internal regulations.
- `/privacy`: Data protection notice under Algerian Law 18-07.
