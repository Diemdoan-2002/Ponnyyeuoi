---
project: ponnyxinchao
date: '2026-03-09'
current_phase: MVP Web Prototype
status: ~90% Complete
---

# Sprint Planning — Ponnyxinchao!

## Tổng quan

> **Tech Stack thực tế:** React (Vite) + Node.js backend + localStorage
> **Platform:** Web prototype (MVP) — chưa phải Flutter app

---

## ✅ Đã hoàn thành

### 1. Foundation
| Task | Status |
|------|--------|
| Vite + React project setup | ✅ |
| Node.js backend + seed data (40 tuần phát triển, mốc khám BYT, bài viết) | ✅ |
| Theme system Pink/Blue | ✅ |
| Responsive mobile-first layout | ✅ |
| Bottom navigation (7 tabs, vuốt ngang) | ✅ |

### 2. Onboarding
| Task | Status |
|------|--------|
| Nhập tên bé + chọn phương pháp tính thai | ✅ |
| Tính tuần thai + preview dự sinh | ✅ |
| Lưu localStorage | ✅ |

### 3. Trang chủ (Dashboard)
| Task | Status |
|------|--------|
| Hero: tuần thai + ngày + emoji + tiến độ | ✅ |
| Chỉ số tiêu chuẩn (CN/CD) | ✅ |
| Nhắc nhở: uống thuốc / tái khám / đếm cử động | ✅ |
| Bài viết cho tuần thai | ✅ |

### 4. Bé yêu (Phát triển thai nhi)
| Task | Status |
|------|--------|
| Timeline T1-T40 chọn tuần | ✅ |
| Week card: emoji + kích thước + chỉ số tiêu chuẩn (compact) | ✅ |
| Bé phát triển / Thay đổi ở mẹ / Lời khuyên | ✅ |
| Bảng chỉ số chuẩn 40 tuần (CN, CD, BPD, FL, AC, HC) | ✅ |
| Nhật ký bé yêu (cân nặng + ghi chú theo tuần, localStorage) | ✅ |
| FETAL_DATA fallback (không bao giờ trắng) | ✅ |

### 5. Tái khám
| Task | Status |
|------|--------|
| Lịch khám cá nhân (thêm/xóa) | ✅ |
| Gợi ý mốc khám BYT VN (past = xám) | ✅ |
| Ghi kết quả siêu âm (tên đầy đủ + viết tắt) | ✅ |
| Xem kết quả đã ghi | ✅ |

### 6. Thuốc & Vitamin
| Task | Status |
|------|--------|
| Thêm/xóa thuốc | ✅ |
| Hỗ trợ nhiều lần/ngày (1-3 lần, chọn giờ) | ✅ |
| Đánh dấu đã uống | ✅ |
| Progress ring (x/y thuốc hôm nay) | ✅ |
| Gợi ý bổ sung theo TCN (WHO/BYT, chỉ tham khảo) | ✅ |
| "Xem thêm →" → bài viết chi tiết (thực phẩm, thời điểm, lưu ý) | ✅ |

### 7. Đếm cử động thai
| Task | Status |
|------|--------|
| Phiên đếm: bấm em bé, timer chạy | ✅ |
| Progress ring 10 cú đạp / 2 giờ | ✅ |
| Lịch sử đếm hôm nay | ✅ |
| Kết thúc phiên + toast | ✅ |

### 8. Kho kiến thức
| Task | Status |
|------|--------|
| Bài viết theo tuần + tất cả | ✅ |
| Duyệt theo danh mục (Dinh dưỡng, Sức khỏe, Thai giáo...) | ✅ |
| Bookmark ❤️ | ✅ |
| Tìm kiếm | ✅ |
| Fallback articles (offline) | ✅ |

### 9. Cài đặt
| Task | Status |
|------|--------|
| Chuyển theme Pink ↔ Blue | ✅ |
| Xem thông tin thai kỳ | ✅ |
| Xóa dữ liệu (reset) | ✅ |

---

## 🔜 Chưa làm — Phase tiếp theo

### Phase 2: Production-ready

| # | Task | Priority | Ghi chú |
|---|------|----------|---------|
| 1 | **Đăng ký / Đăng nhập** | 🔴 Must | Supabase Auth (email + Google) |
| 2 | **Chuyển từ localStorage → Database** | 🔴 Must | Sync data lên server |
| 3 | **Push notification nhắc nhở** | 🔴 Must | Cần native app hoặc PWA |
| 4 | **Biểu đồ tăng trưởng** | 🟡 Should | So sánh số đo bé vs chuẩn WHO |
| 5 | **Lịch sử uống thuốc theo ngày** | 🟡 Should | Calendar view |
| 6 | **Chụp ảnh SA → OCR + nhận xét** | � Should | AI đọc phiếu siêu âm |
| 7 | **Upload ảnh nhật ký bé yêu** | � Should | Ảnh SA 4D theo tuần |
| 8 | **Milestone đánh dấu** | � Nice | Lần đầu thai máy, biết giới tính... |
| 9 | **Chuyển sang Flutter** | 🟢 Nice | Cho iOS/Android native |
| 10 | **CI/CD + Testing** | 🟢 Nice | GitHub Actions, E2E testing |

---

*Cập nhật: 2026-03-09*
