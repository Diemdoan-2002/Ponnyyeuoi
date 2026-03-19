---
stepsCompleted: [step-01-validate, step-02-analyze, step-03-epics, step-04-stories, step-05-complete]
inputDocuments:
  - 'prd.md'
  - 'architecture.md'
  - 'ux-design-specification.md'
date: '2026-03-05'
author: 'Ponny yêu'
---

# Epics & Stories — Ponnyxinchao! (MVP)

> Chỉ bao gồm **Phase 1 (MVP)** — 8 features cốt lõi.

---

## Epic 1: 🔐 Đăng ký & Đăng nhập

**Mục tiêu:** Người dùng có thể tạo tài khoản, đăng nhập, và chọn Color Theme.

### Story 1.1: Đăng ký tài khoản
**Là** mẹ bầu mới, **tôi muốn** đăng ký tài khoản, **để** bắt đầu sử dụng app.

**Acceptance Criteria:**
- [ ] Đăng ký bằng email + mật khẩu
- [ ] Đăng ký bằng SĐT + OTP
- [ ] Đăng ký bằng Google
- [ ] Đăng ký bằng Apple
- [ ] Validation: email hợp lệ, mật khẩu ≥8 ký tự
- [ ] Hiển thị lỗi rõ ràng khi email/SĐT đã tồn tại

**Tech notes:** Supabase Auth, Flutter `supabase_flutter` package

---

### Story 1.2: Đăng nhập
**Là** người dùng đã có tài khoản, **tôi muốn** đăng nhập, **để** xem dữ liệu thai kỳ của mình.

**Acceptance Criteria:**
- [ ] Đăng nhập bằng email/SĐT + mật khẩu
- [ ] Đăng nhập bằng Google/Apple
- [ ] "Quên mật khẩu" gửi link reset qua email
- [ ] JWT token lưu secure storage
- [ ] Auto-login nếu token còn valid

---

### Story 1.3: Chọn Color Theme (Onboarding)
**Là** người dùng mới, **tôi muốn** chọn Pink Mode 🩷 hoặc Blue Mode 💙 ngay khi mở app, **để** app trông theo phong cách mình thích.

**Acceptance Criteria:**
- [ ] Màn hình chọn theme hiển thị ngay sau Splash
- [ ] Preview 2 options: Pink Mode và Blue Mode
- [ ] Chọn 1 tap → áp dụng ngay
- [ ] Lưu preference vào user profile
- [ ] Có thể đổi trong Settings sau

**Tech notes:** ThemeProvider (Riverpod), `pink_theme.dart` / `blue_theme.dart`

---

### Story 1.4: Onboarding — Nhập thông tin thai kỳ
**Là** mẹ bầu mới, **tôi muốn** nhập ngày dự sinh, **để** app tính được tuần thai chính xác.

**Acceptance Criteria:**
- [ ] Chọn 1 trong 2: nhập ngày kinh cuối (LMP) hoặc ngày dự sinh (EDD)
- [ ] Date picker friendly (không cần gõ)
- [ ] App tự động tính tuần thai + ngày dự sinh
- [ ] Nhập tên, tuổi, lần mang thai thứ mấy
- [ ] Gợi ý bật notification
- [ ] Tạo Pregnancy record trên backend

---

## Epic 2: 🏠 Dashboard (Trang chủ)

**Mục tiêu:** Mẹ bầu mở app thấy ngay thông tin quan trọng nhất.

### Story 2.1: Pregnancy Countdown Card
**Là** mẹ bầu, **tôi muốn** thấy ngay tuần thai và ngày, **để** biết chính xác mình đang ở giai đoạn nào.

**Acceptance Criteria:**
- [ ] Hiển thị "Tuần X, Ngày Y" chính xác
- [ ] Hình minh họa kích thước bé (VD: "To bằng trái bắp 🌽")
- [ ] "Còn N ngày nữa sẽ gặp con!"
- [ ] Auto-update mỗi ngày
- [ ] Tap → mở chi tiết phát triển thai nhi tuần này
- [ ] Gradient background theo Color Theme

---

### Story 2.2: Daily Tip Card
**Là** mẹ bầu, **tôi muốn** đọc tip hữu ích mỗi ngày, **để** luôn có điều mới mẻ.

**Acceptance Criteria:**
- [ ] Hiển thị 1 tip phù hợp với tuần thai hiện tại
- [ ] Tip thay đổi mỗi ngày
- [ ] Tap "Đọc thêm" → mở bài viết đầy đủ
- [ ] Icon + tiêu đề + 2-3 dòng tóm tắt

---

### Story 2.3: Quick Actions
**Là** mẹ bầu, **tôi muốn** truy cập nhanh các tính năng hay dùng, **để** thao tác nhanh.

**Acceptance Criteria:**
- [ ] Hiển thị 4 quick action buttons: Đếm cử động, Thuốc, Tái khám, Nhật ký
- [ ] Mỗi button → navigate đến tính năng tương ứng
- [ ] Badge đỏ nếu có nhắc nhở chưa xử lý

---

## Epic 3: 📊 Theo dõi phát triển thai nhi

**Mục tiêu:** Mẹ bầu xem bé phát triển ra sao và so sánh với chuẩn y khoa.

### Story 3.1: Thông tin phát triển thai nhi theo tuần
**Là** mẹ bầu, **tôi muốn** xem bé đang phát triển gì tuần này, **để** hiểu con mình hơn.

**Acceptance Criteria:**
- [ ] Hiển thị mô tả phát triển cho tuần hiện tại
- [ ] Hình minh họa so sánh kích thước (trái cây/vật)
- [ ] Thông tin: cân nặng ước lượng, chiều dài
- [ ] "Thay đổi ở mẹ" section
- [ ] Có thể xem tuần trước/tuần sau bằng swipe

**Tech notes:** Seed data `WeeklyDevelopment` + `FetalSizeComparison`, cache local

---

### Story 3.2: Bảng chỉ số chuẩn thai nhi
**Là** mẹ bầu, **tôi muốn** xem bảng chỉ số chuẩn, **để** biết con mình đang ở mức nào.

**Acceptance Criteria:**
- [ ] Hiển thị bảng: BPD, CRL, FL, AC, EFW, HC theo tuần
- [ ] Có thể chọn chỉ số để xem biểu đồ percentile
- [ ] Vùng bình thường (10th-90th) được highlight
- [ ] Source: Hadlock / Intergrowth-21st

---

### Story 3.3: Nhập kết quả siêu âm
**Là** mẹ bầu vừa khám, **tôi muốn** nhập chỉ số siêu âm, **để** so sánh với chuẩn.

**Acceptance Criteria:**
- [ ] Form nhập: BPD, CRL, FL, AC, EFW (tất cả optional)
- [ ] Chọn ngày khám, tuần thai tự động tính
- [ ] Sau khi nhập → hiển thị percentile cho mỗi chỉ số
- [ ] Message: "Bé nhà mình ở percentile X, phát triển [tốt/cần theo dõi]!"
- [ ] Lưu vào lịch sử
- [ ] Upload ảnh siêu âm (optional)

---

### Story 3.4: Biểu đồ tăng trưởng
**Là** mẹ bầu, **tôi muốn** xem biểu đồ tăng trưởng qua các lần siêu âm, **để** theo dõi xu hướng.

**Acceptance Criteria:**
- [ ] Line chart: vùng reference (10th-50th-90th) + data points của user
- [ ] Toggle giữa các chỉ số (BPD/FL/AC/EFW)
- [ ] Tap data point → tooltip hiển thị ngày khám + giá trị
- [ ] Cần ≥2 lần nhập để hiện biểu đồ

**Tech notes:** `fl_chart` package

---

## Epic 4: 💊 Quản lý thuốc

**Mục tiêu:** Mẹ bầu không bao giờ quên uống thuốc.

### Story 4.1: Thêm thuốc
**Là** mẹ bầu, **tôi muốn** thêm thuốc cần uống, **để** app nhắc tôi.

**Acceptance Criteria:**
- [ ] Form: tên thuốc, liều lượng, số lần/ngày, giờ uống
- [ ] Gợi ý thuốc phổ biến: Sắt, Acid Folic, Canxi, DHA, Vitamin tổng hợp
- [ ] Chọn nhiều giờ uống (VD: 8h sáng + 8h tối)
- [ ] Lưu vào danh sách thuốc đang dùng

---

### Story 4.2: Nhắc nhở uống thuốc
**Là** mẹ bầu, **tôi muốn** nhận nhắc nhở uống thuốc, **để** không quên.

**Acceptance Criteria:**
- [ ] Push notification đúng giờ đã đặt (±1 phút)
- [ ] Notification content: "Đến giờ uống [Tên thuốc]! 💊"
- [ ] Từ notification → mở app → màn hình xác nhận
- [ ] Button "✅ Đã uống" / "⏰ Nhắc lại 30 phút"
- [ ] Local notification backup khi offline

**Tech notes:** FCM + `flutter_local_notifications`

---

### Story 4.3: Lịch sử uống thuốc
**Là** mẹ bầu, **tôi muốn** xem lịch sử uống thuốc, **để** biết mình có uống đều không.

**Acceptance Criteria:**
- [ ] Calendar view hiển thị ngày đã uống/chưa uống
- [ ] Tỷ lệ tuân thủ tuần/tháng (VD: "Tuần này: 6/7 ngày ✅")
- [ ] Danh sách theo ngày: thuốc nào đã uống, thuốc nào bỏ lỡ

---

### Story 4.4: Phân tích thuốc theo giai đoạn
**Là** mẹ bầu, **tôi muốn** biết thuốc hiện tại đã đủ cho giai đoạn thai chưa, **để** yên tâm.

**Acceptance Criteria:**
- [ ] So sánh danh sách thuốc hiện tại với khuyến nghị theo tuần thai
- [ ] Hiển thị: ✅ Đã có / ⚠️ Thiếu / ℹ️ Khuyến nghị thêm
- [ ] VD: "Tuần 24: Nên bổ sung Canxi. Bạn chưa có trong danh sách."
- [ ] Disclaimer: "Đây chỉ là gợi ý, hãy tham khảo ý kiến bác sĩ"

---

## Epic 5: 🏥 Quản lý tái khám

**Mục tiêu:** Mẹ bầu không bỏ lỡ mốc khám quan trọng.

### Story 5.1: Lịch khám gợi ý
**Là** mẹ bầu, **tôi muốn** biết mốc khám quan trọng, **để** đặt lịch kịp thời.

**Acceptance Criteria:**
- [ ] Hiển thị danh sách mốc khám theo chuẩn Bộ Y tế VN
- [ ] Mỗi mốc: tuần thai, loại khám, xét nghiệm cần làm
- [ ] Highlight mốc sắp tới gần nhất
- [ ] Mẹ bầu có thể "Đặt lịch" từ mốc gợi ý

---

### Story 5.2: Thêm/sửa lịch hẹn khám
**Là** mẹ bầu, **tôi muốn** đặt lịch khám, **để** app nhắc tôi.

**Acceptance Criteria:**
- [ ] Form: ngày khám, loại khám, tên bệnh viện/phòng khám (optional), ghi chú
- [ ] Chọn nhắc trước: 1 ngày, 3 ngày, hoặc cả 2
- [ ] Sửa/xóa lịch đã tạo

---

### Story 5.3: Nhắc nhở tái khám
**Là** mẹ bầu, **tôi muốn** nhận nhắc trước ngày khám, **để** không quên.

**Acceptance Criteria:**
- [ ] Push notification trước 3 ngày + 1 ngày
- [ ] Content: "Còn X ngày nữa đến mốc khám tuần Y!"
- [ ] Hiển thị trong Dashboard nếu có lịch khám sắp tới (≤7 ngày)

---

## Epic 6: 👶 Đếm cử động thai

**Mục tiêu:** Mẹ bầu theo dõi cử động thai dễ dàng.

### Story 6.1: Phiên đếm cử động
**Là** mẹ bầu, **tôi muốn** đếm bé đạp, **để** biết bé khỏe mạnh.

**Acceptance Criteria:**
- [ ] Nút bấm lớn (≥80px), ở giữa màn hình
- [ ] Mỗi tap = +1 kick, có haptic feedback
- [ ] Hiển thị: số lần + thời gian đã đếm
- [ ] Ripple animation khi bấm
- [ ] Button "Dừng" → kết thúc phiên
- [ ] Hoạt động offline

---

### Story 6.2: Lịch sử đếm cử động
**Là** mẹ bầu, **tôi muốn** xem lại lịch sử đếm, **để** theo dõi xu hướng.

**Acceptance Criteria:**
- [ ] Danh sách phiên đếm theo ngày
- [ ] Mỗi phiên: số kicks, thời lượng, thời gian bắt đầu
- [ ] Biểu đồ đơn giản: kicks/ngày trong 7 ngày qua

---

## Epic 7: 📸 Nhật ký bụng bầu

**Mục tiêu:** Lưu giữ kỷ niệm thai kỳ.

### Story 7.1: Chụp/upload ảnh
**Là** mẹ bầu, **tôi muốn** chụp ảnh bụng bầu mỗi tuần, **để** lưu giữ kỷ niệm.

**Acceptance Criteria:**
- [ ] Chụp ảnh từ camera hoặc chọn từ gallery
- [ ] Thêm caption (optional)
- [ ] Tự động gắn tuần thai hiện tại
- [ ] Chọn loại: ảnh bụng bầu hoặc ảnh siêu âm
- [ ] Upload ảnh lên Supabase Storage

---

### Story 7.2: Timeline nhật ký
**Là** mẹ bầu, **tôi muốn** xem timeline ảnh theo tuần, **để** thấy hành trình bụng bầu.

**Acceptance Criteria:**
- [ ] Grid/timeline view sắp xếp theo tuần thai
- [ ] Tap ảnh → xem full screen + zoom
- [ ] Hiển thị caption + tuần thai
- [ ] Xóa ảnh (confirm dialog)

---

## Epic 8: 📚 Kho kiến thức

**Mục tiêu:** Mẹ bầu luôn có nội dung mới để đọc.

### Story 8.1: Bài viết theo tuần thai
**Là** mẹ bầu, **tôi muốn** đọc kiến thức phù hợp tuần thai, **để** biết cần làm gì.

**Acceptance Criteria:**
- [ ] Trang chính hiển thị bài viết recommend cho tuần hiện tại
- [ ] Mỗi bài: thumbnail, tiêu đề, thời gian đọc, category
- [ ] Tap → mở bài viết đầy đủ
- [ ] Prefetch nội dung tuần hiện tại để đọc offline

---

### Story 8.2: Duyệt theo danh mục
**Là** mẹ bầu, **tôi muốn** duyệt kiến thức theo chủ đề, **để** tìm thông tin cần thiết.

**Acceptance Criteria:**
- [ ] Categories: Dinh dưỡng, Sức khỏe, Chuẩn bị sinh, Tâm lý, Thai giáo
- [ ] Filter theo category
- [ ] Search bài viết (tìm kiếm tiêu đề)

---

### Story 8.3: Bookmark bài viết yêu thích
**Là** mẹ bầu, **tôi muốn** lưu bài viết hay, **để** đọc lại sau.

**Acceptance Criteria:**
- [ ] Icon bookmark trên mỗi bài
- [ ] Toggle bookmark 1 tap
- [ ] Tab "Đã lưu" để xem tất cả bookmarks
- [ ] Sync across devices

---

## Epic 0: 🛠️ Foundation (Technical setup)

> Epic này **làm đầu tiên**, trước tất cả epic trên.

### Story 0.1: Setup Flutter project
- [ ] Init Flutter project
- [ ] Setup folder structure theo architecture
- [ ] Config Pink Theme + Blue Theme
- [ ] Setup Riverpod
- [ ] Setup Dio HTTP client
- [ ] Setup bottom navigation (5 tabs)

### Story 0.2: Setup Backend
- [ ] Init Node.js + TypeScript + Express
- [ ] Setup Prisma + Supabase PostgreSQL
- [ ] Setup Supabase Auth
- [ ] Setup Supabase Storage
- [ ] Create database schema (all models)
- [ ] Seed reference data (FetalGrowthStandard, WeeklyDevelopment, FetalSizeComparison, RecommendedAppointments)

### Story 0.3: Setup CI/CD
- [ ] GitHub repository
- [ ] GitHub Actions: lint + test
- [ ] README với setup instructions

---

## 📋 Sprint Roadmap (MVP)

| Sprint | Epics | Mục tiêu |
|--------|-------|---------|
| **Sprint 0** (1 tuần) | Epic 0 | Foundation: setup project, DB, auth |
| **Sprint 1** (2 tuần) | Epic 1 + Epic 2 | Đăng ký, đăng nhập, dashboard |
| **Sprint 2** (2 tuần) | Epic 3 | Theo dõi thai nhi + bảng chỉ số |
| **Sprint 3** (2 tuần) | Epic 4 + Epic 5 | Thuốc + Tái khám |
| **Sprint 4** (2 tuần) | Epic 6 + Epic 7 | Kick counter + Nhật ký |
| **Sprint 5** (1 tuần) | Epic 8 | Kho kiến thức |
| **Sprint 6** (1 tuần) | Testing & Polish | Bug fix, UI polish, UAT |

> **Tổng MVP:** ~11 tuần (~3 tháng)

---

*Epics & Stories hoàn thành ngày 2026-03-05*
*Tạo bởi: Ponny yêu × BMAD Epics Workflow*
