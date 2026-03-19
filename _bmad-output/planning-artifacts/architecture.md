---
stepsCompleted: [step-01-init, step-02-context, step-03-starter, step-04-decisions, step-05-patterns, step-06-structure, step-07-validation, step-08-complete]
inputDocuments:
  - 'prd.md'
  - 'ux-design-specification.md'
  - 'product-brief-ponnyxinchao-2026-03-05.md'
workflowType: 'architecture'
project_name: 'ponnyxinchao'
user_name: 'Ponny yêu'
date: '2026-03-05'
---

# Architecture Decision Document — Ponnyxinchao!

_Tài liệu kiến trúc kỹ thuật cho app đồng hành thai kỳ._

---

## 1. System Overview

### 1.1 Architecture Style

**Monolithic Backend + Cross-platform Mobile App**

Lý do chọn monolithic (không microservices):
- Team nhỏ / solo developer — monolith đơn giản hơn nhiều
- MVP không cần scale phức tạp
- Dễ deploy, debug, maintain
- Có thể tách service sau khi scale lên

### 1.2 High-Level Architecture

```
┌─────────────────────────────────────────────┐
│              Mobile App (Flutter)            │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ UI Layer│ │State Mgmt│ │ Local Storage│  │
│  │(Widgets)│ │ (Riverpod)│ │  (Hive/SQL) │  │
│  └────┬────┘ └────┬─────┘ └──────┬───────┘  │
│       └───────────┼──────────────┘           │
│              API Client                      │
└──────────────┬───────────────────────────────┘
               │ HTTPS (REST API)
┌──────────────▼───────────────────────────────┐
│           Backend (Node.js + Express)        │
│  ┌───────┐ ┌──────────┐ ┌────────────────┐  │
│  │  API  │ │ Business │ │  Auth (JWT +   │  │
│  │Routes │ │  Logic   │ │  Firebase Auth)│  │
│  └───┬───┘ └────┬─────┘ └────────────────┘  │
│      └──────────┼────────────────────────────┘
│            Data Layer                        │
│  ┌────────────┐ ┌──────────┐ ┌───────────┐  │
│  │ PostgreSQL │ │  Redis   │ │    S3     │  │
│  │  (Supabase)│ │ (Cache)  │ │  (Images) │  │
│  └────────────┘ └──────────┘ └───────────┘  │
└──────────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────┐
│           External Services                  │
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐  │
│  │ Firebase │ │  OpenAI  │ │ Push Notif  │  │
│  │  (Auth)  │ │(Chatbot) │ │  (FCM/APNs) │  │
│  └──────────┘ └──────────┘ └─────────────┘  │
└──────────────────────────────────────────────┘
```

---

## 2. Technology Decisions

### 2.1 Mobile App

| Quyết định | Lựa chọn | Lý do |
|-----------|---------|-------|
| **Framework** | Flutter (Dart) | Cross-platform iOS+Android, 1 codebase, UI đẹp, performance tốt |
| **State Management** | Riverpod | Type-safe, testable, phổ biến |
| **Local Database** | Hive + SQLite | Hive cho settings/cache, SQLite cho data có cấu trúc |
| **HTTP Client** | Dio | Interceptors, retry, logging |
| **Charts** | fl_chart | Flexible, đẹp, cho growth charts |
| **Push Notifications** | Firebase Cloud Messaging | Free, reliable, cross-platform |
| **Image Storage** | cached_network_image | Cache ảnh siêu âm/bụng bầu |

### 2.2 Backend

| Quyết định | Lựa chọn | Lý do |
|-----------|---------|-------|
| **Runtime** | Node.js 20+ | JavaScript/TypeScript ecosystem, async I/O tốt |
| **Framework** | Express.js + TypeScript | Lightweight, flexible, huge community |
| **Database** | PostgreSQL (via Supabase) | Relational, JSON support, Supabase cho hosting + auth + storage |
| **ORM** | Prisma | Type-safe, auto migrations, great DX |
| **Cache** | Redis (Upstash) | Session, rate limiting, quick lookups |
| **File Storage** | Supabase Storage (S3-compatible) | Ảnh siêu âm, ảnh bụng bầu |
| **Auth** | Supabase Auth + JWT | Email, phone, Google, Apple sign-in built-in |

### 2.3 AI & Chatbot (Phase 2)

| Quyết định | Lựa chọn | Lý do |
|-----------|---------|-------|
| **LLM Provider** | OpenAI GPT-4 (hoặc tương đương) | Hiểu tiếng Việt, context window lớn |
| **RAG** | Supabase pgvector | Vector search cho knowledge base |
| **Guardrails** | Custom prompt engineering | Giới hạn scope y tế, disclaimer |

### 2.4 Infrastructure & DevOps

| Quyết định | Lựa chọn | Lý do |
|-----------|---------|-------|
| **Backend Hosting** | Railway / Render | Simple deploy, auto-scaling, free tier cho MVP |
| **Database Hosting** | Supabase (managed PostgreSQL) | Free tier generous, không cần quản lý DB |
| **CI/CD** | GitHub Actions | Free cho public repos, tích hợp tốt |
| **App Distribution** | Apple TestFlight + Google Play Console | Standard distribution channels |
| **Monitoring** | Sentry (error tracking) | Free tier, Flutter + Node.js SDK |

---

## 3. Data Architecture

### 3.1 Core Data Models

```
User
├── id (UUID)
├── email / phone
├── name
├── date_of_birth
├── height_cm
├── pre_pregnancy_weight_kg
├── color_theme: 'pink' | 'blue'
├── created_at
└── updated_at

Pregnancy
├── id (UUID)
├── user_id → User
├── last_menstrual_period (date)
├── estimated_due_date (date)
├── pregnancy_number (int)
├── is_active (boolean)
├── created_at
└── updated_at

Ultrasound (Kết quả siêu âm)
├── id (UUID)
├── pregnancy_id → Pregnancy
├── gestational_week (int)
├── gestational_day (int)
├── bpd_mm (float, nullable)    -- Đường kính lưỡng đỉnh
├── crl_mm (float, nullable)    -- Chiều dài đầu mông
├── fl_mm (float, nullable)     -- Chiều dài xương đùi
├── ac_mm (float, nullable)     -- Chu vi bụng
├── efw_g (float, nullable)     -- Cân nặng ước lượng
├── hc_mm (float, nullable)     -- Chu vi đầu
├── ultrasound_image_url (text, nullable)
├── notes (text, nullable)
├── exam_date (date)
└── created_at

Medication (Thuốc)
├── id (UUID)
├── pregnancy_id → Pregnancy
├── name (text)
├── dosage (text)
├── frequency (text)           -- 'daily', 'twice_daily', etc.
├── reminder_times (jsonb)     -- ["09:00", "21:00"]
├── is_active (boolean)
└── created_at

MedicationLog (Lịch sử uống thuốc)
├── id (UUID)
├── medication_id → Medication
├── scheduled_time (timestamp)
├── taken_at (timestamp, nullable)
├── status: 'taken' | 'skipped' | 'pending'
└── created_at

Appointment (Lịch tái khám)
├── id (UUID)
├── pregnancy_id → Pregnancy
├── appointment_date (date)
├── appointment_type (text)    -- 'regular', 'ultrasound', 'blood_test'
├── clinic_name (text, nullable)
├── notes (text, nullable)
├── reminder_days_before (int[])  -- [1, 3]
├── status: 'upcoming' | 'completed' | 'cancelled'
└── created_at

KickCount (Đếm cử động)
├── id (UUID)
├── pregnancy_id → Pregnancy
├── session_start (timestamp)
├── session_end (timestamp, nullable)
├── kick_times (jsonb)         -- ["14:30:05", "14:30:12", ...]
├── total_kicks (int)
└── created_at

JournalEntry (Nhật ký)
├── id (UUID)
├── pregnancy_id → Pregnancy
├── gestational_week (int)
├── entry_type: 'bump_photo' | 'ultrasound' | 'note'
├── image_url (text, nullable)
├── caption (text, nullable)
├── entry_date (date)
└── created_at

Article (Bài viết kiến thức)
├── id (UUID)
├── title (text)
├── content (text)
├── category (text)           -- 'nutrition', 'health', 'preparation', etc.
├── gestational_week_from (int)
├── gestational_week_to (int)
├── is_published (boolean)
├── read_time_minutes (int)
└── created_at

UserArticleInteraction
├── user_id → User
├── article_id → Article
├── is_bookmarked (boolean)
├── read_at (timestamp, nullable)
└── created_at
```

### 3.2 Reference Data (Static/Seed)

```
FetalGrowthStandard (Bảng chuẩn thai nhi)
├── gestational_week (int)
├── measurement_type: 'bpd' | 'crl' | 'fl' | 'ac' | 'efw' | 'hc'
├── percentile_3 (float)
├── percentile_10 (float)
├── percentile_50 (float)
├── percentile_90 (float)
├── percentile_97 (float)
├── source: 'hadlock' | 'intergrowth21'
└── unit: 'mm' | 'g'

FetalSizeComparison (So sánh kích thước)
├── gestational_week (int)
├── comparison_item (text)      -- "trái bắp 🌽"
├── weight_description (text)   -- "khoảng 600g"
├── length_description (text)   -- "khoảng 30cm"
└── image_url (text)

WeeklyDevelopment (Phát triển theo tuần)
├── gestational_week (int)
├── baby_development (text)     -- Mô tả bé phát triển gì
├── mom_changes (text)          -- Thay đổi ở mẹ
├── tips (text)                 -- Lời khuyên
└── created_at

RecommendedAppointments (Mốc khám gợi ý)
├── gestational_week (int)
├── appointment_type (text)
├── description (text)
├── tests_included (text[])
└── source (text)               -- "Bộ Y tế VN"
```

---

## 4. API Architecture

### 4.1 API Design

- **Style:** RESTful JSON API
- **Versioning:** URL-based (`/api/v1/...`)
- **Auth:** Bearer token (JWT) in Authorization header
- **Response format:** `{ "data": {...}, "meta": {...}, "error": null }`

### 4.2 Key API Endpoints

```
Auth
  POST   /api/v1/auth/register
  POST   /api/v1/auth/login
  POST   /api/v1/auth/refresh-token
  POST   /api/v1/auth/forgot-password

User
  GET    /api/v1/user/profile
  PUT    /api/v1/user/profile
  PUT    /api/v1/user/theme          -- { "theme": "pink" | "blue" }

Pregnancy
  POST   /api/v1/pregnancy
  GET    /api/v1/pregnancy/current
  PUT    /api/v1/pregnancy/:id
  GET    /api/v1/pregnancy/:id/summary   -- Dashboard data

Fetal Development
  GET    /api/v1/development/week/:week  -- Weekly info + size comparison
  GET    /api/v1/development/standards   -- Growth reference data

Ultrasound
  POST   /api/v1/ultrasound
  GET    /api/v1/ultrasound
  GET    /api/v1/ultrasound/:id/analysis -- Percentile analysis

Medication
  POST   /api/v1/medications
  GET    /api/v1/medications
  PUT    /api/v1/medications/:id
  DELETE /api/v1/medications/:id
  POST   /api/v1/medications/:id/log    -- Mark taken/skipped
  GET    /api/v1/medications/analysis    -- Đủ thuốc chưa?

Appointments
  POST   /api/v1/appointments
  GET    /api/v1/appointments
  PUT    /api/v1/appointments/:id
  GET    /api/v1/appointments/recommended  -- Mốc khám gợi ý

Kick Counter
  POST   /api/v1/kicks/session           -- Start session
  PUT    /api/v1/kicks/session/:id        -- Add kick / end session
  GET    /api/v1/kicks/history

Journal
  POST   /api/v1/journal
  GET    /api/v1/journal
  DELETE /api/v1/journal/:id
  POST   /api/v1/journal/upload-image

Knowledge
  GET    /api/v1/articles                -- Filter by week, category
  GET    /api/v1/articles/:id
  POST   /api/v1/articles/:id/bookmark
  GET    /api/v1/articles/daily-tip      -- Tip hôm nay
```

---

## 5. Security Architecture

### 5.1 Authentication

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│  Client  │────▶│ Supabase Auth│────▶│   JWT Token  │
│  (App)   │     │(Email/Phone/ │     │ (access +    │
│          │◀────│ Google/Apple)│◀────│  refresh)    │
└──────────┘     └──────────────┘     └──────────────┘
```

- Access token: 15 phút expiry
- Refresh token: 7 ngày expiry
- Biometric lock: Optional (Face ID / Fingerprint)

### 5.2 Data Protection

| Layer | Biện pháp |
|-------|---------|
| **In Transit** | TLS 1.3 bắt buộc |
| **At Rest** | AES-256 (Supabase mặc định) |
| **App Local** | Encrypted SharedPreferences (Android) / Keychain (iOS) |
| **Images** | Signed URLs, private buckets |
| **PII** | GDPR-compatible, data export/delete API |

### 5.3 API Security

- Rate limiting: 100 req/min per user
- Input validation: Joi/Zod schema
- SQL injection: Prisma ORM (parameterized queries)
- CORS: Chỉ cho phép mobile app origins

---

## 6. Notification Architecture

### 6.1 Push Notification Flow

```
Scheduler (Backend cron)
  │
  ├── Check medication reminders → Send push via FCM
  ├── Check appointment reminders → Send push via FCM
  ├── Daily tip (8h sáng) → Send push via FCM
  └── Weekly milestone → Send push via FCM
```

### 6.2 Local Notifications

- Kick counter timer alerts
- Medication reminders (backup nếu offline)
- Sử dụng `flutter_local_notifications`

---

## 7. Offline Strategy

### 7.1 Offline-First Approach

| Tính năng | Offline Support | Sync Strategy |
|----------|----------------|---------------|
| Countdown/Dashboard | ✅ Full offline | Tính toán local |
| Weekly development | ✅ Cached | Prefetch 3 tuần |
| Kick counter | ✅ Full offline | Sync khi online |
| Medication log | ✅ Full offline | Sync khi online |
| Knowledge articles | ✅ Cached | Prefetch current week |
| Ultrasound input | ⚠️ Queue offline | Sync khi online |
| Journal photos | ⚠️ Queue offline | Upload khi online |
| AI Chatbot | ❌ Online only | — |

### 7.2 Sync Mechanism

- Background sync khi có internet
- Conflict resolution: Last-write-wins (client timestamp)
- Queue offline actions in local SQLite

---

## 8. Folder Structure

### 8.1 Flutter App

```
lib/
├── main.dart
├── app/
│   ├── app.dart
│   ├── routes.dart
│   └── theme/
│       ├── pink_theme.dart
│       ├── blue_theme.dart
│       └── theme_provider.dart
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── tracking/
│   │   ├── fetal_development/
│   │   ├── medication/
│   │   ├── appointments/
│   │   └── kick_counter/
│   ├── knowledge/
│   ├── journal/
│   └── profile/
├── shared/
│   ├── models/
│   ├── services/
│   ├── widgets/
│   └── utils/
└── data/
    ├── repositories/
    ├── datasources/
    └── dto/
```

### 8.2 Backend (Node.js)

```
src/
├── index.ts
├── config/
├── middleware/
│   ├── auth.ts
│   ├── validation.ts
│   └── rate-limiter.ts
├── routes/
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   ├── pregnancy.routes.ts
│   ├── ultrasound.routes.ts
│   ├── medication.routes.ts
│   ├── appointment.routes.ts
│   ├── kick.routes.ts
│   ├── journal.routes.ts
│   └── article.routes.ts
├── services/
├── models/
├── utils/
└── prisma/
    └── schema.prisma
```

---

## 9. Deployment Strategy

### 9.1 Environments

| Environment | Mục đích | Database |
|------------|---------|---------|
| **Development** | Local dev | Supabase local (Docker) |
| **Staging** | Testing | Supabase staging project |
| **Production** | Live users | Supabase production project |

### 9.2 CI/CD Pipeline

```
Push to main → GitHub Actions
  ├── Run tests (Jest)
  ├── Lint check (ESLint)
  ├── Build backend → Deploy to Railway
  ├── Build Flutter iOS → TestFlight
  └── Build Flutter Android → Play Console (Internal)
```

---

## 10. Cost Estimation

### 10.1 Khi làm thử / Dev / Test = 💰 $0

> ✅ **Tất cả đều MIỄN PHÍ** khi dev + test trên máy mình. Không cần trả đồng nào!

| Service | Free tier |
|---------|----------|
| Flutter SDK | Miễn phí mãi mãi |
| Supabase | 500MB database + 1GB storage |
| Railway/Render | $5 free credit/tháng |
| Firebase (push notification) | 10K messages/ngày |
| Sentry (error tracking) | 5K events/tháng |
| Android emulator / iOS simulator | Miễn phí |

### 10.2 Khi lên Production (tùy chọn, sau này)

| Service | Cost/tháng | Khi nào cần |
|---------|-----------|------------|
| Apple Developer | ~$8/tháng | Chỉ khi lên App Store |
| Google Play | $25 (1 lần) | Chỉ khi lên Play Store |
| Supabase Pro | $25/tháng | Khi >500MB data |
| Railway | $5-20/tháng | Khi vượt free tier |

---

*Architecture Decision Document hoàn thành ngày 2026-03-05*
*Tạo bởi: Ponny yêu × BMAD Architecture Workflow*
