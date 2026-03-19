import { Router } from 'express';

export const appointmentRouter = Router();

interface Appointment {
    id: string;
    appointmentDate: string;
    appointmentType: string;
    clinicName: string;
    notes: string;
    reminderDaysBefore: number[];
    status: 'upcoming' | 'completed' | 'cancelled';
    createdAt: string;
}

// Mốc khám chuẩn theo Bộ Y tế VN
const recommendedAppointments = [
    { week: 8, type: 'Khám lần đầu', tests: ['Siêu âm xác nhận thai', 'Xét nghiệm máu cơ bản', 'Nhóm máu'] },
    { week: 12, type: 'Sàng lọc tam cá nguyệt 1', tests: ['Siêu âm đo độ mờ da gáy', 'Double test', 'Xét nghiệm nước tiểu'] },
    { week: 16, type: 'Khám định kỳ', tests: ['Đo chiều cao tử cung', 'Nghe tim thai', 'Triple test (nếu cần)'] },
    { week: 20, type: 'Siêu âm hình thái', tests: ['Siêu âm 4D kiểm tra cấu trúc bé', 'Đo cổ tử cung'] },
    { week: 24, type: 'Khám + Đường huyết', tests: ['Xét nghiệm đường huyết thai kỳ (GCT)', 'Tổng phân tích nước tiểu'] },
    { week: 28, type: 'Khám tam cá nguyệt 3', tests: ['Siêu âm tăng trưởng', 'Xét nghiệm máu', 'Tiêm Anti-D (nếu Rh-)'] },
    { week: 32, type: 'Khám + Siêu âm', tests: ['Siêu âm tăng trưởng', 'Non-stress test (NST)', 'Kiểm tra ngôi thai'] },
    { week: 34, type: 'Khám 2 tuần/lần', tests: ['Đo tim thai', 'Kiểm tra phù', 'Xét nghiệm GBS (tuần 35-37)'] },
    { week: 36, type: 'Khám hàng tuần', tests: ['Siêu âm ước lượng cân nặng', 'Kiểm tra cổ tử cung', 'NST'] },
    { week: 38, type: 'Khám trước sinh', tests: ['Đánh giá sẵn sàng sinh', 'NST', 'Kiểm tra nước ối'] },
    { week: 40, type: 'Ngày dự sinh', tests: ['NST', 'Siêu âm kiểm tra nước ối', 'Thảo luận kế hoạch sinh'] },
];

let appointments: Appointment[] = [];

/**
 * GET /api/v1/appointments/recommended — Mốc khám gợi ý theo BYT VN
 */
appointmentRouter.get('/recommended', (req, res) => {
    const currentWeek = parseInt(req.query.week as string) || 24;

    const data = recommendedAppointments.map((apt) => ({
        ...apt,
        isPast: apt.week < currentWeek,
        isCurrent: apt.week === currentWeek || (apt.week > currentWeek && apt.week <= currentWeek + 4),
        isUpcoming: apt.week > currentWeek + 4,
    }));

    const nextAppointment = data.find((d) => d.isCurrent || d.isUpcoming);

    res.json({
        data,
        nextAppointment,
        message: nextAppointment
            ? `Mốc khám tiếp theo: Tuần ${nextAppointment.week} — ${nextAppointment.type}`
            : 'Bạn đã hoàn thành tất cả mốc khám! 🎉',
        source: 'Bộ Y tế Việt Nam',
    });
});

/**
 * GET /api/v1/appointments — Danh sách lịch khám của user
 */
appointmentRouter.get('/', (_req, res) => {
    res.json({ data: appointments, total: appointments.length });
});

/**
 * POST /api/v1/appointments — Thêm lịch khám
 */
appointmentRouter.post('/', (req, res) => {
    const { appointmentDate, appointmentType, clinicName, notes, reminderDaysBefore } = req.body;

    const newApt: Appointment = {
        id: String(Date.now()),
        appointmentDate,
        appointmentType: appointmentType || 'regular',
        clinicName: clinicName || '',
        notes: notes || '',
        reminderDaysBefore: reminderDaysBefore || [1, 3],
        status: 'upcoming',
        createdAt: new Date().toISOString(),
    };

    appointments.push(newApt);
    res.status(201).json({
        data: newApt,
        message: `📅 Đã đặt lịch khám ngày ${appointmentDate}. Sẽ nhắc trước ${newApt.reminderDaysBefore.join(' và ')} ngày!`,
    });
});

/**
 * PUT /api/v1/appointments/:id — Cập nhật lịch khám
 */
appointmentRouter.put('/:id', (req, res) => {
    const { id } = req.params;
    const apt = appointments.find((a) => a.id === id);
    if (!apt) return res.status(404).json({ error: 'Không tìm thấy lịch khám' });

    Object.assign(apt, req.body);
    res.json({ data: apt, message: 'Đã cập nhật lịch khám ✅' });
});
