import { Router } from 'express';
import { weeklyDevelopmentData } from '../data/weekly-development';

export const developmentRouter = Router();

/**
 * GET /api/v1/development/week/:week
 * Lấy thông tin phát triển thai nhi theo tuần
 */
developmentRouter.get('/week/:week', (req, res) => {
    const week = parseInt(req.params.week, 10);

    if (isNaN(week) || week < 4 || week > 40) {
        return res.status(400).json({
            error: 'Tuần thai không hợp lệ. Vui lòng nhập từ 4 đến 40.',
        });
    }

    // Tìm data chính xác hoặc gần nhất
    const exactData = weeklyDevelopmentData.find((d) => d.week === week);

    if (exactData) {
        return res.json({
            data: exactData,
            message: `Tuần ${week}: Bé to bằng ${exactData.babySize} ${exactData.emoji}`,
        });
    }

    // Nếu không có data chính xác, tìm tuần gần nhất
    const closestWeek = weeklyDevelopmentData.reduce((prev, curr) =>
        Math.abs(curr.week - week) < Math.abs(prev.week - week) ? curr : prev
    );

    return res.json({
        data: closestWeek,
        note: `Dữ liệu cho tuần ${closestWeek.week} (gần nhất với tuần ${week})`,
        message: `Tuần ${closestWeek.week}: Bé to bằng ${closestWeek.babySize} ${closestWeek.emoji}`,
    });
});

/**
 * GET /api/v1/development/all
 * Lấy toàn bộ dữ liệu phát triển 40 tuần
 */
developmentRouter.get('/all', (_req, res) => {
    res.json({
        data: weeklyDevelopmentData,
        total: weeklyDevelopmentData.length,
        message: `Tổng cộng ${weeklyDevelopmentData.length} tuần dữ liệu phát triển thai nhi`,
    });
});

/**
 * GET /api/v1/development/summary/:week
 * Tóm tắt ngắn cho dashboard
 */
developmentRouter.get('/summary/:week', (req, res) => {
    const week = parseInt(req.params.week, 10);
    const data = weeklyDevelopmentData.find((d) => d.week === week)
        || weeklyDevelopmentData.reduce((prev, curr) =>
            Math.abs(curr.week - week) < Math.abs(prev.week - week) ? curr : prev
        );

    const daysRemaining = Math.max(0, (40 * 7) - (week * 7));

    res.json({
        data: {
            week: data.week,
            babySize: data.babySize,
            emoji: data.emoji,
            weightGrams: data.weightGrams,
            lengthCm: data.lengthCm,
            daysRemaining,
            greeting: `Bé yêu to bằng ${data.babySize} ${data.emoji} và nặng khoảng ${data.weightGrams}!`,
            countdown: daysRemaining > 0
                ? `Còn ${daysRemaining} ngày nữa sẽ gặp con! 🎉`
                : `Đã đến ngày dự sinh! Sẵn sàng đón bé yêu! 🌸`,
        },
    });
});
