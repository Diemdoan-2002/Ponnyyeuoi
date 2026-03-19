---
stepsCompleted: [step-01-init, step-02-discovery, step-03-core-experience, step-04-emotional-response, step-05-inspiration, step-06-design-system, step-07-defining-experience, step-08-visual-foundation, step-09-design-directions, step-10-user-journeys, step-11-component-strategy, step-12-ux-patterns, step-13-responsive-accessibility, step-14-complete]
inputDocuments:
  - 'prd.md'
  - 'product-brief-ponnyxinchao-2026-03-05.md'
date: '2026-03-05'
author: 'Ponny yêu'
---

# UX Design Specification — Ponnyxinchao!

**Author:** Ponny yêu
**Date:** 2026-03-05
**Version:** 1.0

---

## 1. Core Experience Direction

### 1.1 Experience Statement

> Ponnyxinchao! phải khiến mẹ bầu cảm thấy **được đồng hành, yên tâm, và háo hức** — như có một người bạn thân am hiểu y khoa bên cạnh mỗi ngày.

### 1.2 Platform

- **Primary:** Mobile App (iOS + Android)
- **Framework:** React Native hoặc Flutter (cross-platform)
- **Orientation:** Portrait only
- **Min support:** iOS 14+, Android 8+

### 1.3 Experience Pillars

| Pillar | Mô tả | Ví dụ |
|--------|-------|-------|
| **🫶 Ấm áp** | Mọi interaction đều dịu dàng, caring | Lời chào buổi sáng, thông điệp khích lệ |
| **🎉 Thú vị** | Luôn có điều mới để khám phá | So sánh kích thước bé, fun facts hàng ngày |
| **📊 Tin cậy** | Dữ liệu chính xác, nguồn uy tín | Bảng chỉ số chuẩn WHO, citation |
| **🎯 Đơn giản** | Dễ dùng, không overwhelm | 1 tap để ghi nhận, flow ngắn gọn |

### 1.4 Emotional Goals

- **Mở app:** Tò mò, hào hứng → "Hôm nay con mình phát triển gì mới?"
- **Đọc thông tin:** Yên tâm, tự tin → "Mình biết phải làm gì"
- **Nhập dữ liệu:** Nhẹ nhàng, nhanh gọn → "Dễ quá, chỉ mất 10 giây"
- **Xem kết quả:** Hạnh phúc, tự hào → "Con mình phát triển tốt quá!"

---

## 2. Design System Foundation

### 2.1 Design System Choice

**Themeable System** — sử dụng component library có sẵn (MUI/Chakra cho web, tương đương NativeBase/Tamagui cho React Native) với customization mạnh.

**Lý do:**
- Cân bằng giữa tốc độ phát triển và visual uniqueness
- Component accessibility built-in
- Dễ customize theo brand Ponnyxinchao!
- Solo developer friendly

### 2.2 Customization Strategy

- Override toàn bộ color tokens theo brand palette
- Custom component cho: Pregnancy Card, Kick Counter, Growth Chart
- Keep standard patterns cho: Navigation, Forms, Lists, Modals

---

## 3. Visual Design Foundation

### 3.1 Color System

#### Brand Colors

| Token | Hex | Mô tả | Dùng cho |
|-------|-----|-------|---------|
| `primary` | `#FF6B9D` | Hồng san hô ấm | Buttons, accents, highlights |
| `primary-light` | `#FFB3CC` | Hồng pastel | Backgrounds, cards |
| `primary-dark` | `#D4507A` | Hồng đậm | Pressed states |
| `secondary` | `#7C6CF0` | Tím lavender | AI chatbot, premium features |
| `accent` | `#FFD93D` | Vàng ấm | Badges, stars, celebrations |

#### Semantic Colors

| Token | Hex | Dùng cho |
|-------|-----|---------|
| `success` | `#4CAF50` | Kết quả tốt, đã đủ dưỡng chất |
| `warning` | `#FF9800` | Cần chú ý, gần đến mốc |
| `error` | `#F44336` | Cảnh báo quan trọng, chỉ số bất thường |
| `info` | `#2196F3` | Thông tin, tips |
| `background` | `#FFF5F8` | Nền chính (hồng rất nhạt) |
| `surface` | `#FFFFFF` | Cards, modals |
| `text-primary` | `#2D2D2D` | Text chính |
| `text-secondary` | `#6B7280` | Text phụ |

#### 🩷 Pink Mode — Default

| Token | Hex | Mô tả |
|-------|-----|-------|
| `background` | `#FFF5F8` | Hồng rất nhạt |
| `surface` | `#FFFFFF` | Trắng |
| `primary` | `#FF6B9D` | Hồng san hô |
| `primary-light` | `#FFB3CC` | Hồng pastel |
| `primary-dark` | `#D4507A` | Hồng đậm |
| `accent` | `#FFD93D` | Vàng ấm |
| `nav-active` | `#FF6B9D` | Hồng san hô |

#### 💙 Blue Mode

| Token | Hex | Mô tả |
|-------|-----|-------|
| `background` | `#F0F7FF` | Xanh rất nhạt |
| `surface` | `#FFFFFF` | Trắng |
| `primary` | `#5B9FE3` | Xanh dương nhẹ |
| `primary-light` | `#A8D4FF` | Xanh pastel |
| `primary-dark` | `#3A7BC8` | Xanh đậm |
| `accent` | `#FFD93D` | Vàng ấm (giữ nguyên) |
| `nav-active` | `#5B9FE3` | Xanh dương nhẹ |

> 💡 **Cách chọn:** Ngay khi mở app lần đầu (onboarding), mẹ bầu chọn Pink Mode hoặc Blue Mode theo sở thích cá nhân. Có thể đổi bất cứ lúc nào trong Settings.

### 3.2 Typography System

#### Font Family

- **Primary:** `'Nunito', sans-serif` — Rounded, friendly, dễ đọc
- **Secondary:** `'Inter', sans-serif` — Clean, professional cho data/numbers

#### Type Scale

| Style | Font | Size | Weight | Line Height | Dùng cho |
|-------|------|------|--------|-------------|---------|
| **H1** | Nunito | 28sp | Bold (700) | 1.3 | Tiêu đề trang |
| **H2** | Nunito | 22sp | SemiBold (600) | 1.3 | Section headers |
| **H3** | Nunito | 18sp | SemiBold (600) | 1.4 | Sub-sections |
| **Body** | Nunito | 16sp | Regular (400) | 1.6 | Nội dung chính |
| **Body Small** | Nunito | 14sp | Regular (400) | 1.5 | Mô tả phụ |
| **Caption** | Inter | 12sp | Medium (500) | 1.4 | Labels, timestamps |
| **Data** | Inter | 20sp | Bold (700) | 1.2 | Số liệu, chỉ số |
| **Button** | Nunito | 16sp | SemiBold (600) | 1.0 | Buttons |

### 3.3 Spacing & Layout

#### Base Unit: 8px

| Token | Value | Dùng cho |
|-------|-------|---------|
| `xs` | 4px | Icon-text gap |
| `sm` | 8px | Padding nhỏ |
| `md` | 16px | Card padding, section gap |
| `lg` | 24px | Section spacing |
| `xl` | 32px | Page margins |
| `2xl` | 48px | Between major sections |

#### Layout Principles

- Screen padding: 16px (md) horizontal
- Card corner radius: 16px
- Card elevation: subtle shadow (0 2px 8px rgba(0,0,0,0.08))
- Bottom navigation height: 56px
- Status bar: respect safe area

### 3.4 Iconography

- **Style:** Rounded/filled, 24px default
- **Library:** Phosphor Icons hoặc Lucide (rounded aesthetic)
- **Custom icons:** Baby development illustrations theo tuần

---

## 4. Screen Map & Navigation

### 4.1 Navigation Structure

```
Bottom Tab Navigation (5 tabs)
├── 🏠 Home (Dashboard)
├── 📊 Tracking (Chỉ số)
├── 📚 Kiến thức
├── 📸 Nhật ký
└── 👤 Tôi (Profile/Settings)
```

### 4.2 Screen Inventory (MVP)

#### Tab 1: Home Dashboard
| Screen | Nội dung chính |
|--------|---------------|
| **Home** | Countdown, baby size comparison, daily tip, quick actions |

#### Tab 2: Tracking
| Screen | Nội dung chính |
|--------|---------------|
| **Tracking Hub** | Danh sách tracking: Chỉ số thai, Thuốc, Tái khám, Kick counter |
| **Chỉ số thai nhi** | Bảng chỉ số chuẩn + nhập kết quả siêu âm |
| **Growth Chart** | Biểu đồ percentile |
| **Nhắc thuốc** | Danh sách thuốc + lịch + trạng thái |
| **Thêm thuốc** | Form thêm thuốc mới |
| **Tái khám** | Lịch khám + lịch sử |
| **Nhập kết quả** | Form nhập kết quả tái khám |
| **Kick Counter** | Phiên đếm + lịch sử |

#### Tab 3: Kiến thức
| Screen | Nội dung chính |
|--------|---------------|
| **Kiến thức Hub** | Bài viết recommend theo tuần + categories |
| **Bài viết** | Chi tiết bài viết |
| **Danh mục** | Filter theo category |

#### Tab 4: Nhật ký
| Screen | Nội dung chính |
|--------|---------------|
| **Timeline** | Ảnh bụng bầu + ảnh siêu âm theo tuần |
| **Thêm ảnh** | Camera/Gallery + ghi chú |
| **Xem ảnh** | Full screen + zoom |

#### Tab 5: Tôi
| Screen | Nội dung chính |
|--------|---------------|
| **Profile** | Thông tin cá nhân, cài đặt, premium |
| **Thai kỳ** | Thông tin thai kỳ, ngày dự sinh |
| **Cài đặt** | Notifications, dark mode, ngôn ngữ |

### 4.3 Onboarding Flow

```
Splash → **Chọn Pink Mode 🩷 hoặc Blue Mode 💙**
→ Welcome (3 slides) → Đăng ký/Đăng nhập
→ Nhập ngày kinh cuối hoặc ngày dự sinh
→ Nhập thông tin cơ bản (tên, tuổi, lần mang thai thứ mấy)
→ Gợi ý bật nhắc nhở
→ 🎉 Dashboard
```

---

## 5. Key Component Specifications

### 5.1 Pregnancy Countdown Card (Hero Component)

**Vị trí:** Đầu trang Home, chiếm ~40% viewport
**Nội dung:**
- Tuần thai + ngày (VD: "Tuần 24, Ngày 3")
- Hình minh họa baby (illustration, không phải 3D)
- "Bé to bằng một trái bắp 🌽"
- "Còn 112 ngày nữa sẽ gặp con!"
- Background gradient (primary-light → white)

**States:**
- Default: Hiển thị thông tin tuần hiện tại
- Tap: Mở chi tiết phát triển thai nhi tuần này

### 5.2 Daily Tip Card

**Vị trí:** Dưới countdown, scrollable
**Nội dung:**
- Icon + tiêu đề tip
- 2-3 dòng tóm tắt
- "Đọc thêm →"

**Style:** Surface color, corner radius 16px, subtle shadow

### 5.3 Medication Reminder Card

**Vị trí:** Home dashboard, compact
**Nội dung:**
- Tên thuốc + liều + thời gian
- Button "✅ Đã uống" / "⏰ Nhắc lại"
- Progress bar (đã uống mấy / tổng)

**States:**
- Pending: Highlight, button bật
- Completed: Checkmark, opacity giảm nhẹ
- Overdue: Warning color border

### 5.4 Growth Chart Component

**Vị trí:** Screen Chỉ số thai nhi
**Nội dung:**
- Line chart với vùng reference (10th-90th percentile)
- Data points là kết quả siêu âm của user
- Toggle giữa BPD/AC/FL/EFW
- Tooltips khi tap vào data point

### 5.5 Kick Counter Component

**Vị trí:** Full screen khi active
**Nội dung:**
- Nút bấm lớn, tròn, ở giữa (≥80px diameter)
- Counter số + timer
- Animation khi bấm (ripple + số nhảy)
- "Dừng" button

**Interaction:** Tap nút lớn = +1 kick, haptic feedback

---

## 6. UX Patterns

### 6.1 Data Entry Pattern

- **Quick entry**: 1 tap cho hành động thường xuyên (uống thuốc, kick)
- **Form entry**: Bottom sheet cho form ngắn (thêm thuốc)
- **Full screen**: Full page cho form phức tạp (nhập kết quả siêu âm)
- **Auto-save**: Tự lưu khi navigate away

### 6.2 Notification Pattern

| Loại | Khi nào | Style |
|------|---------|-------|
| Nhắc thuốc | Đúng giờ đặt | Push + in-app badge |
| Nhắc khám | 3 ngày + 1 ngày trước | Push notification |
| Daily tip | 8h sáng | In-app card |
| Milestone | Khi sang tuần mới | In-app celebration |

### 6.3 Celebration Pattern

Khi đạt milestone (sang tuần mới, uống thuốc đủ 7 ngày, khám đúng lịch):
- Confetti animation nhẹ
- Message khích lệ: "Tuyệt vời! Mẹ và bé đang rất khỏe mạnh! 🎉"
- Duration: 2-3 giây, không blocking

### 6.4 Empty State Pattern

- Hình minh họa cute + text hướng dẫn
- CTA button rõ ràng
- Tone: Vui vẻ, khuyến khích (không giống lỗi)

### 6.5 Loading Pattern

- Skeleton loading cho cards
- Subtle shimmer animation
- Placeholders matching actual content shape

---

## 7. Responsive & Accessibility

### 7.1 Responsive Strategy

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Phone Small | <375px | Single column, reduced padding (12px) |
| Phone | 375-414px | Standard layout (16px padding) |
| Phone Large | 414-428px | Standard layout |
| Tablet | >768px | 2 column for some sections |

### 7.2 Accessibility

- **Contrast:** Minimum 4.5:1 cho text, 3:1 cho graphic elements
- **Touch target:** Minimum 44x44px
- **Font scaling:** Hỗ trợ dynamic type (iOS) / font scale (Android)
- **Screen reader:** Labels cho tất cả interactive elements
- **Haptic:** Feedback cho kick counter, medication confirmation
- **Color blind:** Không dựa hoàn toàn vào màu — dùng icon + text kèm

### 7.3 Color Theme (Pink / Blue Mode)

- Chọn ngay khi mở app lần đầu (onboarding) theo sở thích cá nhân
- Toggle trong Settings > "Giao diện" bất cứ lúc nào
- Tất cả semantic colors (success, warning, error) giữ nguyên giữa 2 modes
- Chỉ thay đổi: primary palette, background, accent highlights
- Illustrations: Tone hồng hoặc xanh tương ứng

---

## 8. UX Writing Guidelines

### 8.1 Tone of Voice

- **Ấm áp & thân thiện:** "Xin chào mẹ bầu! ☀️" thay vì "Welcome user"
- **Khuyến khích:** "Tuyệt vời! Hôm nay mẹ đã uống đủ thuốc rồi!" thay vì "Completed"
- **Đơn giản:** Tránh thuật ngữ y tế phức tạp, giải thích khi cần
- **Gọi bé:** "Bé yêu" hoặc "con yêu" thay vì "thai nhi"

### 8.2 Ví dụ UX Writing

| Ngữ cảnh | Text |
|---------|------|
| Dashboard greeting (sáng) | "Chào buổi sáng, Ponny yêu! 🌸 Hôm nay bé yêu đã được 24 tuần 3 ngày rồi!" |
| Nhắc thuốc | "Đến giờ uống Sắt rồi! 💊 Mẹ khỏe thì bé mới khỏe nha!" |
| Kick counter | "Bé đạp 10 lần trong 15 phút — Bé yêu năng động lắm! 🦶" |
| Milestone | "🎉 Chúc mừng! Tuần 25 rồi — Bé nhà mình nặng khoảng 660g, to bằng một trái bí! 🎃" |
| Empty nhật ký | "Chưa có ảnh nào — Hãy bắt đầu lưu giữ kỷ niệm bụng bầu xinh đẹp! 📸" |

---

*UX Design Specification hoàn thành ngày 2026-03-05*
*Tạo bởi: Ponny yêu × BMAD UX Design Workflow*
