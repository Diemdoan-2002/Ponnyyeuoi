import { Router } from 'express';

export const medicationRouter = Router();

// In-memory storage (sẽ thay bằng Supabase khi kết nối DB)
interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    reminderTimes: string[];
    isActive: boolean;
    createdAt: string;
}

interface MedicationLog {
    id: string;
    medicationId: string;
    scheduledTime: string;
    takenAt: string | null;
    status: 'taken' | 'skipped' | 'pending';
}

let medications: Medication[] = [
    {
        id: '1',
        name: 'Sắt (Iron)',
        dosage: '60mg',
        frequency: 'daily',
        reminderTimes: ['21:00'],
        isActive: true,
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Acid Folic',
        dosage: '400mcg',
        frequency: 'daily',
        reminderTimes: ['08:00'],
        isActive: true,
        createdAt: new Date().toISOString(),
    },
    {
        id: '3',
        name: 'Canxi (Calcium)',
        dosage: '500mg',
        frequency: 'twice_daily',
        reminderTimes: ['08:00', '20:00'],
        isActive: true,
        createdAt: new Date().toISOString(),
    },
];

let medicationLogs: MedicationLog[] = [];

/**
 * GET /api/v1/medications
 */
medicationRouter.get('/', (_req, res) => {
    res.json({
        data: medications.filter((m) => m.isActive),
        total: medications.filter((m) => m.isActive).length,
    });
});

/**
 * POST /api/v1/medications
 */
medicationRouter.post('/', (req, res) => {
    const { name, dosage, frequency, reminderTimes } = req.body;
    const newMed: Medication = {
        id: String(Date.now()),
        name,
        dosage,
        frequency: frequency || 'daily',
        reminderTimes: reminderTimes || ['08:00'],
        isActive: true,
        createdAt: new Date().toISOString(),
    };
    medications.push(newMed);
    res.status(201).json({ data: newMed, message: `Đã thêm thuốc ${name} 💊` });
});

/**
 * POST /api/v1/medications/:id/log — Đánh dấu đã uống/bỏ qua
 */
medicationRouter.post('/:id/log', (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'taken' | 'skipped'

    const med = medications.find((m) => m.id === id);
    if (!med) {
        return res.status(404).json({ error: 'Không tìm thấy thuốc' });
    }

    const log: MedicationLog = {
        id: String(Date.now()),
        medicationId: id,
        scheduledTime: new Date().toISOString(),
        takenAt: status === 'taken' ? new Date().toISOString() : null,
        status: status || 'taken',
    };
    medicationLogs.push(log);

    const message = status === 'taken'
        ? `✅ Đã uống ${med.name}! Mẹ giỏi lắm!`
        : `⏰ Đã bỏ qua ${med.name}. Nhớ uống bù nhé!`;

    res.json({ data: log, message });
});

/**
 * GET /api/v1/medications/analysis — Phân tích đủ thuốc chưa
 */
medicationRouter.get('/analysis', (req, res) => {
    const week = parseInt(req.query.week as string) || 24;
    const activeMeds = medications.filter((m) => m.isActive).map((m) => m.name.toLowerCase());

    // Khuyến nghị theo giai đoạn thai
    const recommendations = [
        { name: 'Sắt (Iron)', required: week >= 12, reason: 'Cần từ tuần 12 để ngăn thiếu máu' },
        { name: 'Acid Folic', required: true, reason: 'Cần suốt thai kỳ, đặc biệt 3 tháng đầu' },
        { name: 'Canxi (Calcium)', required: week >= 20, reason: 'Cần từ tuần 20 cho xương bé phát triển' },
        { name: 'DHA', required: week >= 16, reason: 'Cần từ tuần 16 cho phát triển não bé' },
        { name: 'Vitamin D', required: week >= 12, reason: 'Hỗ trợ hấp thụ canxi' },
    ];

    const analysis = recommendations
        .filter((r) => r.required)
        .map((r) => {
            const hasIt = activeMeds.some((m) => m.includes(r.name.toLowerCase().split(' ')[0]));
            return {
                name: r.name,
                status: hasIt ? '✅ Đã có' : '⚠️ Thiếu',
                hasIt,
                reason: r.reason,
            };
        });

    const missing = analysis.filter((a) => !a.hasIt);

    res.json({
        data: {
            week,
            analysis,
            summary: missing.length === 0
                ? '🎉 Tuyệt vời! Mẹ đã bổ sung đủ thuốc cho giai đoạn này!'
                : `⚠️ Mẹ đang thiếu ${missing.length} loại: ${missing.map((m) => m.name).join(', ')}`,
        },
        disclaimer: 'Đây chỉ là gợi ý tham khảo. Vui lòng hỏi ý kiến bác sĩ.',
    });
});

/**
 * DELETE /api/v1/medications/:id
 */
medicationRouter.delete('/:id', (req, res) => {
    const { id } = req.params;
    const med = medications.find((m) => m.id === id);
    if (!med) {
        return res.status(404).json({ error: 'Không tìm thấy thuốc' });
    }
    med.isActive = false;
    res.json({ message: `Đã xóa ${med.name} khỏi danh sách` });
});
