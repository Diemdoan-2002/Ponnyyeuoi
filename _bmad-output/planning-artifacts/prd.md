---
stepsCompleted: [step-01-init, step-02-discovery, step-03-success, step-04-journeys, step-05-domain, step-06-innovation, step-07-project-type, step-08-scoping, step-09-functional, step-10-nonfunctional, step-11-polish, step-12-complete]
inputDocuments:
  - 'product-brief-ponnyxinchao-2026-03-05.md'
  - 'research/market-app-thai-ky-research-2026-03-05.md'
workflowType: 'prd'
projectType: 'mobile-app'
---

# Product Requirements Document — Ponnyxinchao!

**Author:** Ponny yêu
**Date:** 2026-03-05
**Version:** 1.0
**Status:** Draft

---

## 1. Executive Summary

### 1.1 Product Overview

**Ponnyxinchao!** là ứng dụng di động đồng hành thai kỳ toàn diện dành cho phụ nữ mang thai tại Việt Nam. App cung cấp tracking thai kỳ chính xác đến từng ngày, bảng chỉ số thai nhi chuẩn y khoa, quản lý thuốc & tái khám, theo dõi dinh dưỡng, và AI chatbot cá nhân hóa — tất cả bằng 100% tiếng Việt.

### 1.2 Problem Statement

Bà bầu Việt Nam thiếu một app thai kỳ **đủ sâu, đủ thú vị, và đủ cá nhân hóa**:

- App quốc tế (Pregnancy+, BabyCenter) không có tiếng Việt, không hiểu hệ thống y tế VN
- App nội địa (Babiuni, Momby) có tiếng Việt nhưng dữ liệu thiếu, tính năng chưa sâu
- App đa năng (Elfie) chỉ có mang bầu ở mức cơ bản, kiến thức quá ít
- Hầu hết app trả phí nhưng nguồn dữ liệu không phong phú, nhanh chán

### 1.3 Vision Statement

> Trở thành app đồng hành thai kỳ **được yêu thích nhất** bởi bà bầu Việt Nam — nơi mẹ bầu muốn mở mỗi ngày vì luôn có điều mới mẻ, hữu ích, và thú vị để khám phá.

### 1.4 Key Differentiators

1. **Tracking sâu**: Chính xác đến ngày, bảng chỉ số thai nhi đầy đủ (CRL, AC, FL, BPD, EFW...)
2. **AI cá nhân hóa**: Chatbot hiểu dữ liệu riêng của từng mẹ bầu
3. **Quản lý y tế toàn diện**: Nhắc thuốc + nhắc tái khám + phân tích kết quả + đường huyết
4. **Dinh dưỡng thông minh**: Tính calo, phân tích dưỡng chất, đánh giá đủ/thiếu
5. **Kho nội dung sống**: Thai giáo hàng ngày, kiến thức theo giai đoạn, không bao giờ hết

---

## 2. Target Users

### 2.1 Primary User: Mẹ bầu Việt Nam

**Persona: "Ponny"** — Mẹ bầu hiện đại, 25-35 tuổi, thành thị

- Sử dụng smartphone hàng ngày, quen với app
- Đã thử nhiều app thai kỳ nhưng không hài lòng
- Muốn biết chính xác bao nhiêu tuần/ngày, chỉ số chi tiết
- Hay quên uống thuốc, không nhớ lịch khám
- Muốn app THÚ VỊ, "muốn tìm hiểu mãi"

**Persona: "Hương"** — Mẹ bầu ngoại thành, 22-30 tuổi

- Mang bầu lần đầu, xa bệnh viện
- Cần nội dung dễ hiểu, nhắc nhở tự động
- Ít kinh nghiệm, cần hướng dẫn từng bước

### 2.2 Secondary User: Bố

**Persona: "Tùng"** — Ông bố muốn đồng hành

- Muốn theo dõi thai kỳ của vợ
- Cần kiến thức chăm mẹ bầu & trẻ sơ sinh
- Dùng qua account liên kết với mẹ

---

## 3. Success Criteria

### 3.1 User Success

| Chỉ số | Target | Mốc |
|--------|--------|-----|
| DAU/WAU | >60% | 3 tháng |
| Session Duration | >5 phút | 3 tháng |
| Feature Adoption | ≥3 features/user | 3 tháng |
| Medication Reminder Usage | >80% bật | 1 tháng |
| Kick Counter Usage | >50% | 3 tháng |

### 3.2 Business Success

| Chỉ số | Target | Mốc |
|--------|--------|-----|
| Total Users | 1,000 | 3 tháng |
| Total Users | 50,000 | 12 tháng |
| Premium Conversion | 5-10% | 6 tháng |
| App Store Rating | ≥4.5 | 6 tháng |
| NPS | >50 | 6 tháng |

### 3.3 Retention KPIs

- D1 Retention: >70%
- D7 Retention: >50%
- D30 Retention: >30%
- Monthly Churn: <10%

---

## 4. User Journeys

### 4.1 Journey: Onboarding

```
Tải app → Đăng ký → Nhập ngày kinh cuối hoặc ngày dự sinh
→ App tính tuần thai chính xác → Hiển thị dashboard thai kỳ
→ Gợi ý bật nhắc nhở thuốc → Setup xong
```

**Aha moment:** Lần đầu thấy "Bạn đang mang thai tuần 24, ngày 3 — Bé to bằng một trái bắp 🌽 và nặng khoảng 600g"

### 4.2 Journey: Daily Usage

```
Mở app → Xem countdown + phát triển thai hôm nay
→ Đọc tip/kiến thức mới → Ghi nhận bữa ăn (nếu muốn)
→ App nhắc uống thuốc sắt 9h tối → Xác nhận đã uống
→ Nghe nhạc thai giáo trước ngủ → Đóng app
```

### 4.3 Journey: Khám thai

```
App nhắc "2 ngày nữa đến mốc khám tuần 28"
→ Đi khám → Quay về, nhập kết quả siêu âm (BPD, FL, AC, EFW)
→ App so sánh với bảng chuẩn → Hiển thị percentile
→ "Bé nhà mình ở percentile 55, phát triển tốt!" 🎉
→ Lưu ảnh siêu âm vào nhật ký
```

### 4.4 Journey: Khi lo lắng

```
Mẹ bầu cảm thấy đau bụng → Mở AI chatbot
→ Hỏi "Tôi bị đau bụng dưới tuần 32, có sao không?"
→ Chatbot trả lời dựa trên dữ liệu cá nhân + kiến thức y khoa
→ Gợi ý khi nào cần gọi bác sĩ vs khi nào bình thường
→ Mẹ bầu bớt lo lắng
```

---

## 5. Domain Requirements

### 5.1 Y tế & Sức khỏe

- Tất cả nội dung y tế phải dựa trên nguồn uy tín (WHO, Bộ Y tế VN, BV Phụ sản)
- App KHÔNG thay thế bác sĩ — phải có disclaimer rõ ràng
- Bảng chỉ số thai nhi theo chuẩn quốc tế (Hadlock, Intergrowth-21st)
- AI chatbot phải có giới hạn rõ ràng: không chẩn đoán, chỉ tư vấn thông tin

### 5.2 Quy định & Tuân thủ

- Tuân thủ Luật An ninh mạng Việt Nam 2018 về bảo vệ dữ liệu cá nhân
- Tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân
- Dữ liệu sức khỏe là dữ liệu nhạy cảm — cần consent rõ ràng
- Nếu có AI: minh bạch về nguồn thông tin, không tạo thông tin sai

### 5.3 Văn hóa & Ngôn ngữ

- 100% tiếng Việt, tone thân thiện, dễ hiểu
- Phù hợp văn hóa Việt (thai giáo, kiêng cữ, thực phẩm VN)
- Hỗ trợ hệ thống y tế VN (BHXH, mốc khám theo Bộ Y tế)

---

## 6. Phân pha Feature (Scoping)

### Phase 1 — MVP

> **Mục tiêu:** App tracking thai kỳ cơ bản + nhắc nhở thuốc/khám + kiến thức

| ID | Feature | Mô tả ngắn |
|----|---------|------------|
| F1 | Đếm ngược thai kỳ | Tuần + ngày chính xác |
| F2 | Phát triển thai nhi | Hình ảnh + so sánh kích thước + mô tả theo tuần |
| F3 | Bảng chỉ số chuẩn | CRL, AC, FL, BPD, EFW + biểu đồ percentile |
| F4 | Nhắc thuốc | Nhắc nhở + phân tích đủ thuốc cho giai đoạn |
| F5 | Nhắc tái khám | Lịch khám theo mốc + nhắc nhở |
| F6 | Kho kiến thức | Bài viết theo giai đoạn thai kỳ |
| F7 | Nhật ký bụng bầu | Chụp ảnh bụng + ảnh siêu âm |
| F8 | Đếm cử động thai | Kick counter + lịch sử |

### Phase 2

| ID | Feature | Mô tả ngắn |
|----|---------|------------|
| F9 | AI Chatbot | Hỏi đáp cá nhân hóa dựa trên dữ liệu mẹ |
| F10 | Dinh dưỡng | Tính calo, phân tích dưỡng chất |
| F11 | Vận động | Gợi ý bài tập, theo dõi hoạt động |
| F12 | Phân tích tái khám | Nhập kết quả → phân tích + lời khuyên |

### Phase 3

| ID | Feature | Mô tả ngắn |
|----|---------|------------|
| F13 | Thai giáo | Nhạc + hoạt động thai giáo hàng ngày |
| F14 | Đường huyết | Theo dõi cho mẹ tiểu đường thai kỳ |
| F15 | Bản cho bố | Account liên kết + kiến thức chăm mẹ bầu & trẻ |
| F16 | Cộng đồng | Forum mẹ bầu |
| F17 | Tư vấn bác sĩ | Kết nối bác sĩ online |

### Out of Scope

- ❌ eCommerce / bán sản phẩm
- ❌ Đặt lịch khám trực tiếp
- ❌ Chẩn đoán y tế
- ❌ Theo dõi trẻ sau sinh (sẽ là phase rất xa hoặc app riêng)

---

## 7. Functional Requirements

### 7.1 Quản lý tài khoản (Account Management)

- **FR1:** Người dùng có thể đăng ký tài khoản mới bằng email hoặc số điện thoại
- **FR2:** Người dùng có thể đăng nhập bằng email/SĐT + mật khẩu hoặc OTP
- **FR3:** Người dùng có thể đăng nhập bằng tài khoản Google hoặc Apple
- **FR4:** Người dùng có thể cập nhật thông tin hồ sơ cá nhân (tên, tuổi, chiều cao, cân nặng trước khi mang thai)
- **FR5:** Người dùng có thể đặt lại mật khẩu qua email hoặc SĐT

### 7.2 Thiết lập Thai kỳ (Pregnancy Setup)

- **FR6:** Người dùng có thể nhập ngày kinh cuối (LMP) HOẶC ngày dự sinh (EDD) để tính tuổi thai
- **FR7:** Hệ thống tự động tính tuần thai và ngày dự sinh dựa trên dữ liệu đầu vào
- **FR8:** Người dùng có thể điều chỉnh ngày dự sinh nếu bác sĩ thay đổi
- **FR9:** Hệ thống hiển thị đếm ngược thai kỳ chính xác đến từng ngày (VD: "Tuần 24, Ngày 3")
- **FR10:** Ngay khi mở app lần đầu, người dùng chọn Color Theme: Pink Mode 🩷 hoặc Blue Mode 💙 theo sở thích cá nhân
- **FR11:** Người dùng có thể đổi Color Theme bất cứ lúc nào trong Cài đặt

### 7.3 Theo dõi phát triển thai nhi (Fetal Development Tracking)

- **FR12:** Hệ thống hiển thị thông tin phát triển thai nhi theo từng tuần
- **FR11:** Hệ thống hiển thị so sánh kích thước thai nhi với vật thể quen thuộc (trái cây, động vật)
- **FR12:** Hệ thống cung cấp bảng chỉ số chuẩn thai nhi (CRL, BPD, AC, FL, EFW) theo tuần thai
- **FR13:** Người dùng có thể nhập chỉ số từ kết quả siêu âm
- **FR14:** Hệ thống so sánh chỉ số siêu âm với bảng chuẩn và hiển thị percentile
- **FR15:** Hệ thống hiển thị biểu đồ tăng trưởng qua các lần siêu âm

### 7.4 Quản lý thuốc (Medication Management)

- **FR16:** Người dùng có thể thêm thuốc/vitamin cần uống với liều lượng và thời gian
- **FR17:** Hệ thống gửi nhắc nhở uống thuốc theo lịch đã đặt
- **FR18:** Người dùng có thể đánh dấu đã uống/chưa uống thuốc
- **FR19:** Hệ thống phân tích danh sách thuốc hiện tại và đánh giá đã đủ cho giai đoạn thai chưa (sắt, acid folic, canxi, DHA...)
- **FR20:** Hệ thống hiển thị lịch sử uống thuốc theo ngày/tuần

### 7.5 Quản lý tái khám (Appointment Management)

- **FR21:** Hệ thống gợi ý lịch khám theo mốc chuẩn Bộ Y tế VN
- **FR22:** Người dùng có thể thêm/sửa/xóa lịch hẹn khám
- **FR23:** Hệ thống gửi nhắc nhở trước ngày khám (1 ngày, 3 ngày)
- **FR24:** Người dùng có thể nhập kết quả tái khám (chỉ số siêu âm, xét nghiệm)
- **FR25:** Hệ thống lưu trữ lịch sử tái khám

### 7.6 Đếm cử động thai (Kick Counter)

- **FR26:** Người dùng có thể bắt đầu phiên đếm cử động thai
- **FR27:** Người dùng có thể ghi nhận từng cử động bằng nút bấm
- **FR28:** Hệ thống hiển thị thời gian và số lần cử động trong phiên
- **FR29:** Hệ thống lưu lịch sử đếm cử động theo ngày

### 7.7 Nhật ký & Hình ảnh (Journal & Photos)

- **FR30:** Người dùng có thể chụp/tải ảnh bụng bầu theo tuần
- **FR31:** Người dùng có thể lưu ảnh siêu âm
- **FR32:** Hệ thống sắp xếp ảnh theo timeline tuần thai
- **FR33:** Người dùng có thể viết ghi chú kèm ảnh

### 7.8 Kho kiến thức (Knowledge Base)

- **FR34:** Hệ thống hiển thị bài viết kiến thức phù hợp với giai đoạn thai hiện tại
- **FR35:** Người dùng có thể duyệt kiến thức theo danh mục (dinh dưỡng, sức khỏe, chuẩn bị sinh...)
- **FR36:** Người dùng có thể đánh dấu bài viết yêu thích
- **FR37:** Hệ thống cung cấp nội dung mới hàng ngày phù hợp với tuần thai

### 7.9 AI Chatbot (Phase 2)

- **FR38:** Người dùng có thể đặt câu hỏi bằng tiếng Việt qua chat
- **FR39:** Hệ thống trả lời dựa trên dữ liệu cá nhân của người dùng (tuần thai, chỉ số, thuốc)
- **FR40:** Hệ thống hiển thị disclaimer: không thay thế bác sĩ
- **FR41:** Chatbot có thể gợi ý bài viết liên quan từ kho kiến thức

### 7.10 Dinh dưỡng & Vận động (Phase 2)

- **FR42:** Người dùng có thể ghi nhận bữa ăn hàng ngày
- **FR43:** Hệ thống tính calo và phân tích dưỡng chất (protein, sắt, canxi, DHA, acid folic...)
- **FR44:** Hệ thống đánh giá lượng dưỡng chất đã đủ cho giai đoạn thai chưa
- **FR45:** Hệ thống gợi ý bài tập phù hợp cho giai đoạn thai

### 7.11 Thai giáo (Phase 3)

- **FR46:** Hệ thống cung cấp nhạc thai giáo theo giai đoạn
- **FR47:** Hệ thống gợi ý hoạt động thai giáo hàng ngày

### 7.12 Đường huyết (Phase 3)

- **FR48:** Người dùng có thể nhập chỉ số đường huyết
- **FR49:** Hệ thống theo dõi và hiển thị biểu đồ đường huyết theo thời gian
- **FR50:** Hệ thống cảnh báo khi chỉ số vượt ngưỡng an toàn

### 7.13 Bản cho Bố (Phase 3)

- **FR51:** Bố có thể tạo tài khoản liên kết với mẹ bầu
- **FR52:** Bố có thể xem thông tin thai kỳ của mẹ (countdown, phát triển thai)
- **FR53:** Hệ thống cung cấp nội dung riêng cho bố (chăm mẹ bầu, chuẩn bị đón con)

---

## 8. Non-Functional Requirements

### 8.1 Performance

- **NFR1:** App load lần đầu < 3 giây trên 4G
- **NFR2:** Chuyển màn hình < 500ms
- **NFR3:** Push notification gửi đúng giờ (±1 phút)
- **NFR4:** Kick counter ghi nhận tap < 100ms

### 8.2 Security

- **NFR5:** Dữ liệu sức khỏe được mã hóa at rest và in transit (AES-256/TLS 1.3)
- **NFR6:** Xác thực 2 lớp cho tài khoản có dữ liệu nhạy cảm
- **NFR7:** Tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân
- **NFR8:** Session timeout sau 30 phút không hoạt động
- **NFR9:** Dữ liệu cá nhân có thể export hoặc xóa theo yêu cầu người dùng

### 8.3 Scalability

- **NFR10:** Hỗ trợ 1,000 concurrent users ở MVP
- **NFR11:** Scale đến 100,000 users mà không cần thay đổi kiến trúc lớn
- **NFR12:** Database sẵn sàng cho 1 triệu bản ghi y tế

### 8.4 Reliability

- **NFR13:** Uptime ≥99.5% (cho phép ~44 phút downtime/tuần)
- **NFR14:** Notification delivery rate ≥98%
- **NFR15:** Dữ liệu người dùng backup hàng ngày, retention 90 ngày

### 8.5 Usability

- **NFR16:** Onboarding hoàn thành trong < 2 phút
- **NFR17:** Hỗ trợ cả iOS (14+) và Android (8+)
- **NFR18:** Hỗ trợ Color Theme: Pink Mode (🩷) và Blue Mode (💙), chọn theo sở thích cá nhân ngay từ onboarding
- **NFR19:** Font size tối thiểu 14sp cho nội dung y tế (dễ đọc)

### 8.6 Localization

- **NFR20:** 100% giao diện và nội dung bằng tiếng Việt
- **NFR21:** Hỗ trợ calendar âm lịch (cho thai giáo phase 3)
- **NFR22:** Đơn vị đo: kg, cm, mmol/L (chuẩn VN)

---

## 9. Assumptions & Constraints

### Assumptions

- Người dùng có smartphone (iOS/Android) và internet
- Nội dung y tế được review bởi chuyên gia trước khi xuất bản
- Bảng chỉ số thai nhi dựa trên chuẩn quốc tế (Hadlock/Intergrowth-21st)

### Constraints

- MVP không bao gồm AI chatbot (cần Phase 2)
- App không thay thế bác sĩ — luôn có disclaimer
- Budget, timeline, và team size chưa xác định (sẽ clarify ở Architecture)

### Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Nội dung y tế sai | 🔴 Cao | Review bởi bác sĩ sản khoa trước khi publish |
| Dữ liệu bị lộ | 🔴 Cao | Mã hóa end-to-end, audit security |
| AI chatbot đưa lời khuyên sai | 🟡 Trung bình | Giới hạn scope AI, disclaimer rõ ràng |
| User acquisition chậm | 🟡 Trung bình | Marketing qua cộng đồng mẹ bầu, KOLs |

---

*PRD hoàn thành ngày 2026-03-05*
*Tạo bởi: Ponny yêu × BMAD PRD Workflow*
*Input: Product Brief + Market Research*
