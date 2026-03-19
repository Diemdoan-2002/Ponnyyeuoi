import { Router } from 'express';

export const kickRouter = Router();

interface KickSession {
    id: string;
    sessionStart: string;
    sessionEnd: string | null;
    kickTimes: string[];
    totalKicks: number;
}

let kickSessions: KickSession[] = [];

/**
 * POST /api/v1/kicks/session — Bắt đầu phiên đếm
 */
kickRouter.post('/session', (_req, res) => {
    const session: KickSession = {
        id: String(Date.now()),
        sessionStart: new Date().toISOString(),
        sessionEnd: null,
        kickTimes: [],
        totalKicks: 0,
    };
    kickSessions.push(session);
    res.status(201).json({
        data: session,
        message: '👶 Bắt đầu đếm cử động! Bấm mỗi khi bé đạp nhé!',
    });
});

/**
 * PUT /api/v1/kicks/session/:id — Thêm kick hoặc kết thúc phiên
 */
kickRouter.put('/session/:id', (req, res) => {
    const { id } = req.params;
    const { action } = req.body; // 'kick' | 'end'

    const session = kickSessions.find((s) => s.id === id);
    if (!session) return res.status(404).json({ error: 'Không tìm thấy phiên đếm' });

    if (action === 'kick') {
        session.kickTimes.push(new Date().toISOString());
        session.totalKicks++;

        const messages = [
            'Bé đạp rồi! 🦶',
            'Bé yêu năng động lắm! 💪',
            'Thêm 1 cú đạp! 🎉',
            'Bé chào mẹ kìa! 👋',
            'Bé khỏe mạnh lắm! ❤️',
        ];

        res.json({
            data: { totalKicks: session.totalKicks },
            message: messages[session.totalKicks % messages.length],
        });
    } else if (action === 'end') {
        session.sessionEnd = new Date().toISOString();

        const startTime = new Date(session.sessionStart).getTime();
        const endTime = new Date(session.sessionEnd).getTime();
        const durationMinutes = Math.round((endTime - startTime) / 60000);

        res.json({
            data: {
                totalKicks: session.totalKicks,
                durationMinutes,
                sessionStart: session.sessionStart,
                sessionEnd: session.sessionEnd,
            },
            message: session.totalKicks >= 10
                ? `🎉 Tuyệt vời! Bé đạp ${session.totalKicks} lần trong ${durationMinutes} phút! Bé rất khỏe mạnh!`
                : `👶 Bé đạp ${session.totalKicks} lần trong ${durationMinutes} phút. Nếu thấy ít hơn bình thường, hãy hỏi bác sĩ nhé.`,
        });
    }
});

/**
 * GET /api/v1/kicks/history — Lịch sử đếm
 */
kickRouter.get('/history', (_req, res) => {
    const completed = kickSessions
        .filter((s) => s.sessionEnd !== null)
        .sort((a, b) => new Date(b.sessionStart).getTime() - new Date(a.sessionStart).getTime());

    res.json({
        data: completed,
        total: completed.length,
    });
});
