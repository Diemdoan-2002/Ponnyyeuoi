import { Router } from 'express';

export const userRouter = Router();

// In-memory user data
interface UserProfile {
    name: string;
    age: number;
    heightCm: number;
    prePregnancyWeightKg: number;
    colorTheme: 'pink' | 'blue';
}

let userProfile: UserProfile = {
    name: 'Ponny yêu',
    age: 28,
    heightCm: 160,
    prePregnancyWeightKg: 52,
    colorTheme: 'pink',
};

/**
 * GET /api/v1/user/profile
 */
userRouter.get('/profile', (_req, res) => {
    res.json({ data: userProfile });
});

/**
 * PUT /api/v1/user/profile
 */
userRouter.put('/profile', (req, res) => {
    Object.assign(userProfile, req.body);
    res.json({
        data: userProfile,
        message: 'Đã cập nhật hồ sơ ✅',
    });
});

/**
 * PUT /api/v1/user/theme — Đổi Color Theme
 */
userRouter.put('/theme', (req, res) => {
    const { theme } = req.body;
    if (theme !== 'pink' && theme !== 'blue') {
        return res.status(400).json({ error: 'Theme phải là "pink" hoặc "blue"' });
    }

    userProfile.colorTheme = theme;

    const message = theme === 'pink'
        ? '🩷 Đã chuyển sang Pink Mode! Hồng ngọt ngào~'
        : '💙 Đã chuyển sang Blue Mode! Xanh dịu mát~';

    res.json({ data: { colorTheme: theme }, message });
});
