import { Router } from 'express';

export const articleRouter = Router();

interface Article {
    id: string;
    title: string;
    content: string;
    summary: string;
    category: string;
    weekFrom: number;
    weekTo: number;
    readTimeMinutes: number;
    isPublished: boolean;
}

// Sample articles
const articles: Article[] = [
    {
        id: '1',
        title: '10 thực phẩm giàu sắt cho mẹ bầu',
        content: 'Sắt là khoáng chất quan trọng nhất trong thai kỳ. Mẹ bầu cần 27mg sắt mỗi ngày...',
        summary: 'Bổ sung sắt đúng cách giúp ngăn thiếu máu thai kỳ.',
        category: 'Dinh dưỡng',
        weekFrom: 1,
        weekTo: 40,
        readTimeMinutes: 5,
        isPublished: true,
    },
    {
        id: '2',
        title: 'Giải mã chỉ số siêu âm thai nhi',
        content: 'Khi đi siêu âm, bác sĩ sẽ đo nhiều chỉ số: BPD (đường kính lưỡng đỉnh), FL (chiều dài xương đùi)...',
        summary: 'Hiểu các chỉ số BPD, FL, AC, EFW trên phiếu siêu âm.',
        category: 'Sức khỏe',
        weekFrom: 12,
        weekTo: 40,
        readTimeMinutes: 7,
        isPublished: true,
    },
    {
        id: '3',
        title: 'Ốm nghén: Nguyên nhân và cách giảm',
        content: 'Ốm nghén ảnh hưởng khoảng 80% mẹ bầu, thường bắt đầu từ tuần 6 và giảm dần sau tuần 12-14...',
        summary: '8 cách giảm ốm nghén an toàn không cần thuốc.',
        category: 'Sức khỏe',
        weekFrom: 4,
        weekTo: 16,
        readTimeMinutes: 4,
        isPublished: true,
    },
    {
        id: '4',
        title: 'Thai giáo bằng âm nhạc: Bắt đầu từ khi nào?',
        content: 'Từ tuần 18, bé đã có thể nghe được âm thanh. Thai giáo bằng âm nhạc giúp phát triển não bộ...',
        summary: 'Hướng dẫn thai giáo âm nhạc từ tuần 18.',
        category: 'Thai giáo',
        weekFrom: 18,
        weekTo: 40,
        readTimeMinutes: 6,
        isPublished: true,
    },
    {
        id: '5',
        title: 'Chuẩn bị giỏ đồ đi sinh',
        content: 'Từ tuần 34, mẹ nên chuẩn bị sẵn giỏ đồ đi sinh. Checklist: giấy tờ, đồ cho mẹ, đồ cho bé...',
        summary: 'Checklist đầy đủ đồ đi sinh cho mẹ và bé.',
        category: 'Chuẩn bị sinh',
        weekFrom: 32,
        weekTo: 40,
        readTimeMinutes: 5,
        isPublished: true,
    },
    {
        id: '6',
        title: '5 bài tập yoga an toàn cho bà bầu',
        content: 'Yoga bầu giúp giảm đau lưng, cải thiện giấc ngủ, và chuẩn bị cho quá trình sinh...',
        summary: 'Các tư thế yoga an toàn giúp mẹ bầu khỏe mạnh.',
        category: 'Sức khỏe',
        weekFrom: 14,
        weekTo: 36,
        readTimeMinutes: 5,
        isPublished: true,
    },
    {
        id: '7',
        title: 'Xét nghiệm đường huyết thai kỳ: Cần biết',
        content: 'Tiểu đường thai kỳ ảnh hưởng 5-10% phụ nữ mang thai. Xét nghiệm GCT thường làm ở tuần 24-28...',
        summary: 'Tìm hiểu về xét nghiệm đường huyết và tiểu đường thai kỳ.',
        category: 'Sức khỏe',
        weekFrom: 22,
        weekTo: 30,
        readTimeMinutes: 6,
        isPublished: true,
    },
    {
        id: '8',
        title: 'Dấu hiệu chuyển dạ: Khi nào cần đến bệnh viện?',
        content: 'Quy tắc 5-1-1: Cơn co mỗi 5 phút, kéo dài 1 phút, liên tục trong 1 giờ = cần đến bệnh viện...',
        summary: 'Nhận biết dấu hiệu chuyển dạ thật vs giả.',
        category: 'Chuẩn bị sinh',
        weekFrom: 36,
        weekTo: 40,
        readTimeMinutes: 7,
        isPublished: true,
    },
];

let bookmarks: Set<string> = new Set();

/**
 * GET /api/v1/articles — Lấy bài viết (filter theo tuần, category)
 */
articleRouter.get('/', (req, res) => {
    const week = parseInt(req.query.week as string) || 0;
    const category = req.query.category as string;

    let filtered = articles.filter((a) => a.isPublished);

    if (week > 0) {
        filtered = filtered.filter((a) => week >= a.weekFrom && week <= a.weekTo);
    }

    if (category) {
        filtered = filtered.filter((a) => a.category === category);
    }

    res.json({
        data: filtered.map((a) => ({
            ...a,
            isBookmarked: bookmarks.has(a.id),
        })),
        total: filtered.length,
        categories: [...new Set(articles.map((a) => a.category))],
    });
});

/**
 * GET /api/v1/articles/daily-tip — Tip hôm nay
 */
articleRouter.get('/daily-tip', (req, res) => {
    const week = parseInt(req.query.week as string) || 24;
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);

    const relevant = articles.filter((a) => week >= a.weekFrom && week <= a.weekTo && a.isPublished);
    const tip = relevant[dayOfYear % relevant.length] || articles[0];

    res.json({
        data: {
            id: tip.id,
            title: tip.title,
            summary: tip.summary,
            category: tip.category,
            readTimeMinutes: tip.readTimeMinutes,
        },
        message: `📚 Tip hôm nay cho tuần ${week}`,
    });
});

/**
 * GET /api/v1/articles/:id
 */
articleRouter.get('/:id', (req, res) => {
    const article = articles.find((a) => a.id === req.params.id);
    if (!article) return res.status(404).json({ error: 'Không tìm thấy bài viết' });

    res.json({
        data: { ...article, isBookmarked: bookmarks.has(article.id) },
    });
});

/**
 * POST /api/v1/articles/:id/bookmark — Toggle bookmark
 */
articleRouter.post('/:id/bookmark', (req, res) => {
    const { id } = req.params;
    if (bookmarks.has(id)) {
        bookmarks.delete(id);
        res.json({ bookmarked: false, message: 'Đã bỏ lưu bài viết' });
    } else {
        bookmarks.add(id);
        res.json({ bookmarked: true, message: '📌 Đã lưu bài viết!' });
    }
});
