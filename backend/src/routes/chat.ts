import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();
const router = Router();

interface UserContext {
    userName: string;
    weekNum: number;
    dayNum: number;
    daysLeft: number;
    edd: string;
    trimester: number;
    meds: Array<{ name: string; dose: string; freq: string; taken: boolean }>;
    examResults: Array<{ date: string; weight?: string; bp?: string; note?: string; bpd?: string; fl?: string; ac?: string; efw?: string }>;
    kickHistory: Array<{ count: number; duration: number; time: string }>;
    nextAppointment?: { date: string; type: string; place: string };
    babyDiary: Record<string, { weight?: string; note?: string; date?: string }>;
    milestones: Record<string, boolean>;
}

function buildSystemPrompt(ctx: UserContext): string {
    const medsStr = ctx.meds.length > 0
        ? ctx.meds.map(m => `  • ${m.name} (${m.dose}, ${m.freq}) — ${m.taken ? 'đã uống hôm nay' : 'chưa uống'}`).join('\n')
        : '  Chưa thiết lập thuốc nào';

    const examStr = ctx.examResults.length > 0
        ? ctx.examResults.slice(-3).map(e => `  • ${e.date}: Cân nặng ${e.weight || '—'}kg, HA ${e.bp || '—'}, BPD ${e.bpd || '—'}, FL ${e.fl || '—'}, AC ${e.ac || '—'}, EFW ${e.efw || '—'}`).join('\n')
        : '  Chưa có kết quả khám';

    const kickStr = ctx.kickHistory.length > 0
        ? ctx.kickHistory.slice(-3).map(k => `  • ${k.time}: ${k.count} cử động trong ${Math.floor(k.duration / 60)} phút`).join('\n')
        : '  Chưa có lịch sử đếm cử động';

    const nextAptStr = ctx.nextAppointment
        ? `  ${ctx.nextAppointment.date} — ${ctx.nextAppointment.type} tại ${ctx.nextAppointment.place}`
        : '  Không có lịch khám sắp tới';

    const diaryEntries = Object.entries(ctx.babyDiary).slice(-3);
    const diaryStr = diaryEntries.length > 0
        ? diaryEntries.map(([w, d]) => `  • Tuần ${w}: ${d.note || 'Không có ghi chú'}`).join('\n')
        : '  Chưa có nhật ký';

    return `Bạn là Ponny — trợ lý AI thai kỳ thông minh, thân thiện, dễ thương 🌸

THÔNG TIN CÁ NHÂN CỦA MẸ BẦU:
- Tên thân mật: ${ctx.userName}
- Tuần thai hiện tại: Tuần ${ctx.weekNum}, Ngày ${ctx.dayNum}
- Tam cá nguyệt: ${ctx.trimester}
- Ngày dự sinh: ${ctx.edd}
- Còn ${ctx.daysLeft} ngày nữa sẽ gặp bé!

THUỐC & VITAMIN ĐANG DÙNG:
${medsStr}

KẾT QUẢ KHÁM GẦN NHẤT:
${examStr}

LỊCH SỬ ĐẾM CỬ ĐỘNG (GẦN NHẤT):
${kickStr}

LỊCH KHÁM SẮP TỚI:
${nextAptStr}

NHẬT KÝ BÉ YÊU:
${diaryStr}

QUY TẮC BẮT BUỘC:
1. Luôn trả lời bằng tiếng Việt, giọng thân thiện, dễ thương, dùng emoji phù hợp
2. Gọi mẹ bầu bằng tên "${ctx.userName}" khi phù hợp
3. Tham khảo DỮ LIỆU CÁ NHÂN ở trên khi trả lời — ví dụ nhắc nhở uống thuốc, bình luận về kết quả khám, nhận xét về cử động thai
4. KHÔNG BAO GIỜ đưa ra chẩn đoán y tế. Nếu mẹ hỏi về triệu chứng bất thường, LUÔN khuyến khích đi khám bác sĩ
5. Trả lời ngắn gọn, rõ ràng (tối đa 200 từ mỗi câu trả lời)
6. Khi mẹ hỏi về sự phát triển của bé, tham khảo tuần thai hiện tại
7. Nguồn tham khảo: WHO, Bộ Y tế Việt Nam, ACOG — ghi rõ khi cần thiết
8. Nếu không chắc chắn, nói rõ và khuyên mẹ hỏi bác sĩ`;
}

// POST /api/v1/chat
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { message, history, userContext } = req.body;

        if (!message) {
            res.status(400).json({ error: 'Cần có tin nhắn' });
            return;
        }

        const apiKey = (process.env.GEMINI_API_KEY || '').trim();
        console.log('[Chat] API Key check:', apiKey ? `Key found (${apiKey.slice(0,10)}...)` : 'NO KEY');
        if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
            res.status(500).json({ error: 'Chưa cấu hình Gemini API key' });
            return;
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // Build conversation history for Gemini
        const systemPrompt = buildSystemPrompt(userContext || {
            userName: 'bạn',
            weekNum: 24,
            dayNum: 3,
            daysLeft: 112,
            edd: '',
            trimester: 2,
            meds: [],
            examResults: [],
            kickHistory: [],
            babyDiary: {},
            milestones: {}
        });

        // Convert chat history to Gemini format
        const chatHistory = (history || []).map((h: { role: string; content: string }) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }],
        }));

        const chat = model.startChat({
            history: chatHistory,
            systemInstruction: systemPrompt,
        });

        const result = await chat.sendMessage(message);
        const response = result.response.text();

        res.json({
            reply: response,
            model: 'gemini-2.0-flash',
        });
    } catch (error: any) {
        console.error('Chat error:', error);
        res.status(500).json({
            error: 'Có lỗi xảy ra khi gọi AI',
            details: error.message,
        });
    }
});

export { router as chatRouter };
