import { Router } from 'express';

export const pregnancyRouter = Router();

/**
 * POST /api/v1/pregnancy/calculate
 * Tính tuần thai từ ngày kinh cuối (LMP) hoặc ngày dự sinh (EDD)
 */
pregnancyRouter.post('/calculate', (req, res) => {
    const { lmp, edd } = req.body;

    if (!lmp && !edd) {
        return res.status(400).json({
            error: 'Vui lòng cung cấp ngày kinh cuối (lmp) hoặc ngày dự sinh (edd)',
        });
    }

    const today = new Date();
    let estimatedDueDate: Date;
    let lastMenstrualPeriod: Date;

    if (lmp) {
        // Tính từ ngày kinh cuối: EDD = LMP + 280 ngày (công thức Naegele)
        lastMenstrualPeriod = new Date(lmp);
        estimatedDueDate = new Date(lastMenstrualPeriod);
        estimatedDueDate.setDate(estimatedDueDate.getDate() + 280);
    } else {
        // Tính ngược từ ngày dự sinh
        estimatedDueDate = new Date(edd!);
        lastMenstrualPeriod = new Date(estimatedDueDate);
        lastMenstrualPeriod.setDate(lastMenstrualPeriod.getDate() - 280);
    }

    // Tính số ngày mang thai
    const diffMs = today.getTime() - lastMenstrualPeriod.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const gestationalWeeks = Math.floor(totalDays / 7);
    const gestationalDays = totalDays % 7;

    // Số ngày còn lại
    const daysRemaining = Math.max(0, Math.floor(
        (estimatedDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    ));

    // Trimester
    let trimester = 1;
    if (gestationalWeeks >= 28) trimester = 3;
    else if (gestationalWeeks >= 14) trimester = 2;

    res.json({
        data: {
            gestationalWeeks,
            gestationalDays,
            totalDays,
            daysRemaining,
            trimester,
            lastMenstrualPeriod: lastMenstrualPeriod.toISOString().split('T')[0],
            estimatedDueDate: estimatedDueDate.toISOString().split('T')[0],
            display: `Tuần ${gestationalWeeks}, Ngày ${gestationalDays}`,
            message: daysRemaining > 0
                ? `Bạn đang mang thai tuần ${gestationalWeeks}, ngày ${gestationalDays}. Còn ${daysRemaining} ngày nữa sẽ gặp bé yêu! 🌸`
                : `Đã đến ngày dự sinh! Chúc mẹ mẹ tròn con vuông! 🎉`,
        },
    });
});
