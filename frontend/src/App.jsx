import { useState, useEffect, useRef, useCallback } from 'react'
import { IconHome, IconBaby, IconCalendar, IconBook, IconPill, IconKick, IconSettings, IconMedicine, IconStethoscope, IconBabyFoot, IconIron, IconCalcium, IconDHA, IconFolicAcid } from './CuteIcons'

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

const API = 'http://localhost:3000/api/v1'

function getTimeGreeting() {
    const h = new Date().getHours()
    if (h < 12) return 'Chào buổi sáng 🌅'
    if (h < 14) return 'Chào buổi trưa ☀️'
    if (h < 18) return 'Chào buổi chiều 🌤️'
    return 'Chào buổi tối 🌙'
}

function calcFromLMP(lmpDate) {
    const lmp = new Date(lmpDate)
    const today = new Date()
    const diff = Math.floor((today - lmp) / 86400000)
    const week = Math.floor(diff / 7)
    const day = diff % 7
    const edd = new Date(lmp.getTime() + 280 * 86400000)
    const daysLeft = Math.max(0, Math.floor((edd - today) / 86400000))
    return { week: Math.min(Math.max(week, 1), 40), day, daysLeft, edd }
}

function calcFromEDD(eddDate) {
    const edd = new Date(eddDate)
    const today = new Date()
    const lmp = new Date(edd.getTime() - 280 * 86400000)
    const diff = Math.floor((today - lmp) / 86400000)
    const week = Math.floor(diff / 7)
    const day = diff % 7
    const daysLeft = Math.max(0, Math.floor((edd - today) / 86400000))
    return { week: Math.min(Math.max(week, 1), 40), day, daysLeft, edd }
}

/* ─── FETAL REFERENCE DATA (WHO/INTERGROWTH-21st) ─── */
const FETAL_DATA = {
    4: { emoji: '🫘', sizeComparison: 'hạt mè', weight: '<1g', length: '0.1cm', bpd: '-', fl: '-', ac: '-', hc: '-', babyDevelopment: 'Phôi thai bắt đầu làm tổ trong tử cung. Các tế bào đang phân chia nhanh chóng.', maternalChanges: 'Có thể chưa biết mình mang thai. Mệt mỏi nhẹ.', tips: 'Bắt đầu bổ sung acid folic 400mcg/ngày.' },
    5: { emoji: '🫘', sizeComparison: 'hạt vừng', weight: '<1g', length: '0.2cm', bpd: '-', fl: '-', ac: '-', hc: '-', babyDevelopment: 'Tim bé bắt đầu đập! Ống thần kinh đang hình thành — sẽ trở thành não và tủy sống.', maternalChanges: 'Ốm nghén có thể bắt đầu. Đau ngực nhẹ.', tips: 'Tránh thức ăn sống, rượu bia. Uống acid folic đều đặn.' },
    6: { emoji: '🫛', sizeComparison: 'hạt đậu', weight: '<1g', length: '0.6cm', bpd: '-', fl: '-', ac: '-', hc: '-', babyDevelopment: 'Mắt, mũi, miệng bắt đầu hình thành. Tim đập khoảng 110 lần/phút.', maternalChanges: 'Ốm nghén tăng. Ngửi mùi nhạy hơn.', tips: 'Ăn ít nhưng chia nhiều bữa nhỏ để giảm buồn nôn.' },
    7: { emoji: '🫐', sizeComparison: 'quả việt quất', weight: '<1g', length: '1cm', bpd: '-', fl: '-', ac: '-', hc: '-', babyDevelopment: 'Tay chân bắt đầu xuất hiện dạng chồi. Não phát triển nhanh.', maternalChanges: 'Mệt mỏi, buồn nôn. Đi tiểu thường xuyên hơn.', tips: 'Nghỉ ngơi đủ. Ăn gừng giúp giảm ốm nghén.' },
    8: { emoji: '🫒', sizeComparison: 'quả nho', weight: '1g', length: '1.6cm', bpd: '15mm', fl: '-', ac: '-', hc: '-', babyDevelopment: 'Ngón tay ngón chân có màng bắt đầu tách. Bé cử động nhẹ (mẹ chưa cảm nhận được).', maternalChanges: 'Ốm nghén có thể nặng nhất. Ngực to hơn.', tips: 'Khám lần đầu: siêu âm xác nhận thai, xét nghiệm máu cơ bản.' },
    9: { emoji: '🍇', sizeComparison: 'quả ô liu', weight: '2g', length: '2.3cm', bpd: '18mm', fl: '-', ac: '-', hc: '-', babyDevelopment: 'Đuôi phôi biến mất. Cơ bắp bắt đầu hình thành.', maternalChanges: 'Có thể thèm ăn hoặc ghét một số món.', tips: 'Tránh thuốc không kê đơn. Hỏi bác sĩ trước khi dùng bất kỳ loại thuốc nào.' },
    10: { emoji: '🍓', sizeComparison: 'quả dâu tây', weight: '4g', length: '3.1cm', bpd: '20mm', fl: '5mm', ac: '25mm', hc: '-', babyDevelopment: 'Các cơ quan quan trọng đã hình thành. Bé chính thức chuyển từ phôi sang thai nhi.', maternalChanges: 'Bụng hơi tròn hơn. Mạch máu nổi rõ hơn.', tips: 'Uống nhiều nước. Ăn thực phẩm giàu chất xơ.' },
    11: { emoji: '🍋', sizeComparison: 'quả chanh nhỏ', weight: '7g', length: '4.1cm', bpd: '22mm', fl: '7mm', ac: '30mm', hc: '-', babyDevelopment: 'Bé bắt đầu nuốt nước ối. Móng tay bắt đầu mọc.', maternalChanges: 'Ốm nghén có thể giảm dần.', tips: 'Bổ sung canxi và vitamin D.' },
    12: { emoji: '🍋', sizeComparison: 'quả chanh', weight: '14g', length: '5.4cm', bpd: '24mm', fl: '9mm', ac: '56mm', hc: '70mm', babyDevelopment: 'Bé có phản xạ mút. Cơ quan sinh dục phân biệt được. Sàng lọc da gáy (NT) thực hiện tuần này.', maternalChanges: 'Ốm nghén thường giảm đáng kể.', tips: '🔴 QUAN TRỌNG: Sàng lọc tam cá nguyệt 1 (Double test, đo da gáy).' },
    13: { emoji: '🍑', sizeComparison: 'quả đào', weight: '23g', length: '7.4cm', bpd: '26mm', fl: '11mm', ac: '65mm', hc: '84mm', babyDevelopment: 'Dấu vân tay độc nhất đã hình thành! Bé có thể đặt ngón tay vào miệng.', maternalChanges: 'Năng lượng dần hồi phục. Có thể thấy bụng nhô nhẹ.', tips: 'Chuyển sang tam cá nguyệt 2 — giai đoạn dễ chịu nhất!' },
    14: { emoji: '🍊', sizeComparison: 'quả cam nhỏ', weight: '43g', length: '8.7cm', bpd: '29mm', fl: '14mm', ac: '78mm', hc: '98mm', babyDevelopment: 'Bé tập nhăn mặt! Lông tơ (lanugo) phủ khắp cơ thể.', maternalChanges: 'Cơn ốm nghén gần hết. Có thể thấy đói hơn.', tips: 'Tăng cường thực phẩm giàu protein và sắt.' },
    16: { emoji: '🥑', sizeComparison: 'quả bơ', weight: '100g', length: '11.6cm', bpd: '35mm', fl: '20mm', ac: '100mm', hc: '124mm', babyDevelopment: 'Bé bắt đầu nghe được! Xương cứng dần. Bé có thể nấc cụt.', maternalChanges: 'Có thể cảm nhận cử động thai đầu tiên (con rạ).', tips: 'Khám định kỳ: đo chiều cao tử cung, nghe tim thai.' },
    18: { emoji: '🫑', sizeComparison: 'quả ớt chuông', weight: '190g', length: '14.2cm', bpd: '40mm', fl: '25mm', ac: '124mm', hc: '152mm', babyDevelopment: 'Bé nghe rõ tiếng mẹ! Thính giác phát triển. Bắt đầu thai giáo tốt nhất.', maternalChanges: 'Thai máy rõ hơn. Bụng to nhanh.', tips: 'Bắt đầu thai giáo: nói chuyện, hát, đọc sách cho bé nghe.' },
    20: { emoji: '🍌', sizeComparison: 'quả chuối', weight: '300g', length: '16.4cm', bpd: '47mm', fl: '31mm', ac: '148mm', hc: '175mm', babyDevelopment: 'Bé biết mút ngón tay thuần thục. Siêu âm hình thái (4D) kiểm tra cấu trúc bé.', maternalChanges: 'Bụng rõ rệt. Có thể đau lưng nhẹ.', tips: '🔴 SA hình thái (4D) kiểm tra cấu trúc bé. Đo cổ tử cung.' },
    22: { emoji: '🥥', sizeComparison: 'quả đu đủ nhỏ', weight: '430g', length: '19cm', bpd: '54mm', fl: '37mm', ac: '170mm', hc: '197mm', babyDevelopment: 'Bé nghe rõ tiếng mẹ. Mắt phản ứng với ánh sáng (dù mí mắt còn nhắm).', maternalChanges: 'Vết rạn da có thể xuất hiện. Thai máy mạnh hơn.', tips: 'Dưỡng ẩm da bụng. Ăn thực phẩm giàu omega-3.' },
    24: { emoji: '🌽', sizeComparison: 'trái bắp', weight: '600g', length: '21cm', bpd: '60mm', fl: '43mm', ac: '193mm', hc: '219mm', babyDevelopment: 'Phổi bắt đầu sản xuất surfactant. Bé có chu kỳ ngủ-thức rõ ràng.', maternalChanges: 'Có thể bị chuột rút chân. Ngủ khó hơn.', tips: '🔴 Xét nghiệm đường huyết thai kỳ (GCT). Tổng phân tích nước tiểu.' },
    26: { emoji: '🥦', sizeComparison: 'bông súp lơ', weight: '760g', length: '23cm', bpd: '65mm', fl: '48mm', ac: '215mm', hc: '238mm', babyDevelopment: 'Mắt bé bắt đầu mở! Phổi tiếp tục trưởng thành.', maternalChanges: 'Bụng to hơn nhiều. Có thể khó thở nhẹ.', tips: 'Nằm nghiêng trái khi ngủ giúp tuần hoàn tốt hơn.' },
    28: { emoji: '🥥', sizeComparison: 'quả dừa nhỏ', weight: '1000g', length: '25cm', bpd: '71mm', fl: '53mm', ac: '237mm', hc: '259mm', babyDevelopment: 'Bé đạt mốc 1kg! Giấc ngủ REM bắt đầu — bé có thể mơ. Bắt đầu tam cá nguyệt 3.', maternalChanges: 'Cơn gò Braxton Hicks có thể xuất hiện.', tips: '🔴 Khám tam cá nguyệt 3: SA tăng trưởng, xét nghiệm máu, tiêm Anti-D (nếu Rh-).' },
    30: { emoji: '🥬', sizeComparison: 'quả bắp cải', weight: '1300g', length: '27cm', bpd: '76mm', fl: '57mm', ac: '258mm', hc: '275mm', babyDevelopment: 'Bé tích mỡ dưới da, da bớt nhăn. Não phát triển cực nhanh.', maternalChanges: 'Khó ngủ. Đi tiểu thường xuyên hơn.', tips: 'Tập bài tập Kegel. Chuẩn bị đồ đi sinh.' },
    32: { emoji: '🍈', sizeComparison: 'quả dưa lưới nhỏ', weight: '1700g', length: '29cm', bpd: '80mm', fl: '61mm', ac: '277mm', hc: '291mm', babyDevelopment: 'Bé luyện thở bằng cách hít thở nước ối. Móng tay mọc đến đầu ngón.', maternalChanges: 'Bụng rất to. Khó thở, ợ nóng.', tips: '🔴 Khám + SA tăng trưởng. Non-stress test (NST). Kiểm tra ngôi thai.' },
    34: { emoji: '🍍', sizeComparison: 'quả dứa', weight: '2100g', length: '32cm', bpd: '84mm', fl: '64mm', ac: '295mm', hc: '305mm', babyDevelopment: 'Phổi gần trưởng thành. Bé nặng hơn 2kg! Hệ miễn dịch phát triển.', maternalChanges: 'Cơn gò Braxton Hicks thường xuyên hơn.', tips: '🔴 Khám 2 tuần/lần. Kiểm tra phù, xét nghiệm GBS (tuần 35-37).' },
    36: { emoji: '🍉', sizeComparison: 'quả dưa hấu nhỏ', weight: '2600g', length: '34cm', bpd: '87mm', fl: '67mm', ac: '313mm', hc: '318mm', babyDevelopment: 'Bé xuống khung chậu (engagement). Phổi hoàn toàn trưởng thành.', maternalChanges: 'Bụng tụt xuống. Dễ thở hơn nhưng đi tiểu nhiều hơn.', tips: '🔴 Khám hàng tuần. SA ước lượng cân nặng. Kiểm tra cổ tử cung, NST.' },
    37: { emoji: '🍉', sizeComparison: 'quả dưa lưới', weight: '2900g', length: '36cm', bpd: '89mm', fl: '69mm', ac: '323mm', hc: '325mm', babyDevelopment: 'Bé đủ tháng (full-term)! Tất cả cơ quan sẵn sàng cho cuộc sống bên ngoài.', maternalChanges: 'Cơn gò có thể thường xuyên hơn.', tips: 'Nhận biết dấu hiệu chuyển dạ: gò đều đặn, vỡ ối, ra máu hồng.' },
    38: { emoji: '🍉', sizeComparison: 'quả bí ngô', weight: '3100g', length: '37cm', bpd: '90mm', fl: '70mm', ac: '330mm', hc: '330mm', babyDevelopment: 'Bé tiếp tục tích mỡ. Lông tơ rụng dần. Phân su (meconium) tích tụ trong ruột.', maternalChanges: 'Cổ tử cung có thể bắt đầu mở.', tips: 'Chuẩn bị túi đồ đi sinh. Nghỉ ngơi nhiều.' },
    39: { emoji: '🍉', sizeComparison: 'quả dưa hấu', weight: '3300g', length: '38cm', bpd: '91mm', fl: '71mm', ac: '335mm', hc: '333mm', babyDevelopment: 'Bé tiếp tục phát triển não bộ. Kháng thể từ mẹ sang bé qua nhau thai.', maternalChanges: 'Có thể ra nút nhầy cổ tử cung.', tips: 'Sẵn sàng đi sinh bất cứ lúc nào!' },
    40: { emoji: '🎉', sizeComparison: 'quả dưa hấu lớn', weight: '3400g', length: '39cm', bpd: '92mm', fl: '72mm', ac: '340mm', hc: '335mm', babyDevelopment: 'Ngày dự sinh! Tất cả cơ quan đã hoàn thiện. Bé sẵn sàng chào đời!', maternalChanges: 'Chờ đợi chuyển dạ. Gò tử cung mạnh hơn.', tips: 'Nếu chưa chuyển dạ, bác sĩ sẽ theo dõi sát. Giữ bình tĩnh!' },
}
// Fill missing weeks by interpolation
for (let w = 1; w <= 40; w++) { if (!FETAL_DATA[w]) { const keys = Object.keys(FETAL_DATA).map(Number).sort((a, b) => a - b); const lo = keys.filter(k => k < w).pop() || keys[0]; const hi = keys.find(k => k > w) || keys[keys.length - 1]; FETAL_DATA[w] = { ...FETAL_DATA[lo], week: w } } }

/* ─── SUPPLEMENT RECOMMENDATIONS (WHO/MOH VN) ─── */
const SUPPLEMENT_RECS = {
    trimester1: [
        { name: 'Acid Folic', dose: '400-800mcg/ngày', icon: '/icons/supp-folic.png', reason: 'Ngăn ngừa dị tật ống thần kinh (NTDs)', source: 'WHO (2012), Bộ Y tế VN' },
        { name: 'Sắt', dose: '30-60mg/ngày', icon: '/icons/supp-iron.png', reason: 'Phòng thiếu máu, hỗ trợ tạo hồng cầu', source: 'WHO Daily Iron Supplementation Guideline' },
        { name: 'Vitamin D', dose: '600-1000 IU/ngày', icon: '/icons/supp-vitd.png', reason: 'Hấp thu canxi, phát triển xương thai nhi', source: 'ACOG Committee Opinion No. 495' },
    ],
    trimester2: [
        { name: 'Sắt', dose: '60mg/ngày', icon: '/icons/supp-iron.png', reason: 'Nhu cầu tăng do thể tích máu tăng 50%', source: 'WHO Daily Iron Supplementation Guideline' },
        { name: 'Canxi', dose: '1000mg/ngày (chia 2 lần)', icon: '/icons/supp-calcium.png', reason: 'Thai nhi phát triển xương, phòng tiền sản giật', source: 'WHO Calcium Supplementation Guideline (2018)' },
        { name: 'DHA', dose: '200-300mg/ngày', icon: '/icons/supp-dha.png', reason: 'Phát triển não bộ & thị giác thai nhi', source: 'FAO/WHO Expert Consultation (2010)' },
        { name: 'Acid Folic', dose: '400mcg/ngày', icon: '/icons/supp-folic.png', reason: 'Tiếp tục duy trì suốt thai kỳ', source: 'WHO (2012)' },
    ],
    trimester3: [
        { name: 'Sắt', dose: '60mg/ngày', icon: '/icons/supp-iron.png', reason: 'Dự trữ sắt cho bé, chuẩn bị mất máu khi sinh', source: 'WHO Daily Iron Supplementation Guideline' },
        { name: 'Canxi', dose: '1200mg/ngày', icon: '/icons/supp-calcium.png', reason: 'Bé phát triển xương nhanh, phòng loãng xương mẹ', source: 'WHO Calcium Supplementation (2018)' },
        { name: 'DHA', dose: '300mg/ngày', icon: '/icons/supp-dha.png', reason: 'Giai đoạn não bộ phát triển mạnh nhất', source: 'FAO/WHO Expert Consultation (2010)' },
        { name: 'Vitamin K', dose: 'Theo chỉ định BS', icon: '/icons/supp-vitk.png', reason: 'Phòng xuất huyết chu sinh (nếu chỉ định)', source: 'AAP Policy Statement (2003)' },
    ]
}

/* ─── SUPPLEMENT DETAIL ARTICLES ─── */
const SUPPLEMENT_DETAILS = {
    'Sắt': {
        title: 'Bổ sung Sắt trong thai kỳ', sections: [
            { h: 'Tại sao cần sắt?', t: 'Khi mang thai, lượng máu trong cơ thể mẹ tăng 50%. Sắt giúp tạo hemoglobin vận chuyển oxy cho bé. Thiếu sắt gây thiếu máu, mệt mỏi, tăng nguy cơ sinh non và bé nhẹ cân.' },
            { h: 'Thực phẩm giàu sắt', t: '🥩 Thịt bò, gan gà \u2022 🥦 Rau biển (rong biển), rau cầi bó xôi \u2022 🫘 Đậu lăng, đậu đen \u2022 🪶 Hạt bí, hạt điều' },
            { h: 'Uống lúc nào?', t: 'Tốt nhất uống lúc bụng đói hoặc trước bữa ăn 1 giờ. Uống kèm vitamin C (để tăng hấp thu). Không uống cùng canxi, trà, cà phê (giảm hấp thu).' },
            { h: 'Lưu ý', t: 'Sắt có thể gây táo bón — uống nhiều nước và ăn nhiều chất xơ. Phân có thể đen — đây là bình thường.' }
        ]
    },
    'Canxi': {
        title: 'Bổ sung Canxi trong thai kỳ', sections: [
            { h: 'Tại sao cần canxi?', t: 'Bé cần canxi để phát triển xương và răng. Nếu mẹ không bổ sung đủ, cơ thể sẽ lấy canxi từ xương mẹ, gây loãng xương. Canxi còn giúp phòng tiền sản giật.' },
            { h: 'Thực phẩm giàu canxi', t: '🥛 Sữa, sữa chua, phô mai \u2022 🥦 Rau cải xanh, cải bó xôi \u2022 🐟 Cá mòi, cá hồi \u2022 🥜 Đậu nành, đậu phụ' },
            { h: 'Uống lúc nào?', t: 'Chia 2 lần/ngày (sáng và tối) để hấp thu tốt hơn. Cách sắt ít nhất 2 giờ. Uống sau bữa ăn.' },
            { h: 'Lưu ý', t: 'Quá liều canxi (>2500mg) có thể gây sỏi thận. Luôn uống kèm vitamin D để tăng hấp thu.' }
        ]
    },
    'DHA': {
        title: 'Bổ sung DHA trong thai kỳ', sections: [
            { h: 'Tại sao cần DHA?', t: 'DHA (Omega-3) là thành phần chính của não và võng mạc. Bổ sung DHA giúp bé phát triển trí tuệ và thị giác tốt hơn.' },
            { h: 'Thực phẩm giàu DHA', t: '🐟 Cá hồi, cá thu, cá ngừ \u2022 🥚 Trứng gà (loại giàu omega-3) \u2022 🪶 Hạt chia, hạt lanh, óc chó' },
            { h: 'Uống lúc nào?', t: 'Uống trong hoặc sau bữa ăn có chất béo để hấp thu tốt. Bất kỳ lúc nào trong ngày.' },
            { h: 'Lưu ý', t: 'Chọn DHA từ dầu cá biển sâu (không phải dầu gan cá). Hạn chế cá lớn (cá kiếm, cá ngừ đại dương) do chứa thủy ngân.' }
        ]
    },
    'Acid Folic': {
        title: 'Bổ sung Acid Folic trong thai kỳ', sections: [
            { h: 'Tại sao cần acid folic?', t: 'Acid folic ngăn ngừa dị tật ống thần kinh (nứt đốt sống, não voô). Quan trọng nhất trong 12 tuần đầu nhưng nên duy trì suốt thai kỳ.' },
            { h: 'Thực phẩm giàu folate', t: '🥦 Rau lá xanh đậm (cải bó xôi, cải xoăn) \u2022 🫘 Đậu lăng, đậu xanh \u2022 🍊 Cam, bưởi \u2022 🥚 Trứng' },
            { h: 'Uống lúc nào?', t: 'Bất kỳ lúc nào trong ngày, tốt nhất uống cùng lúc mỗi ngày để tạo thói quen.' },
            { h: 'Lưu ý', t: 'Nếu có tiền sử NTDs, bác sĩ có thể kê liều cao hơn (4mg). Acid folic rất an toàn, thừa sẽ bài tiết qua nước tiểu.' }
        ]
    },
    'Vitamin D': {
        title: 'Bổ sung Vitamin D trong thai kỳ', sections: [
            { h: 'Tại sao cần vitamin D?', t: 'Vitamin D giúp hấp thu canxi, phát triển xương thai nhi, và hỗ trợ hệ miễn dịch.' },
            { h: 'Nguồn tự nhiên', t: '☀️ Tắm nắng 15-20 phút/ngày (trước 10h sáng) \u2022 🐟 Cá hồi, cá thu \u2022 🥚 Trứng \u2022 🍄 Nấm' },
            { h: 'Uống lúc nào?', t: 'Uống cùng bữa ăn có chất béo. Có thể uống cùng canxi.' },
            { h: 'Lưu ý', t: 'Nhiều mẹ bầu Việt Nam thiếu vitamin D do ít tiếp xúc ánh sáng. Hãy kiểm tra nồng độ 25(OH)D nếu có điều kiện.' }
        ]
    },
    'Vitamin K': {
        title: 'Vitamin K trong thai kỳ', sections: [
            { h: 'Tại sao?', t: 'Vitamin K giúp đông máu. Bé sinh ra thường được tiêm vitamin K để phòng xuất huyết.' },
            { h: 'Nguồn thực phẩm', t: '🥦 Rau lá xanh, bông cải xanh \u2022 🪴 Dầu ô liu, dầu đậu nành' },
            { h: 'Lưu ý', t: 'Chỉ bổ sung khi có chỉ định của bác sĩ.' }
        ]
    }
}

/* ─── FALLBACK ARTICLES ─── */
const FALLBACK_ARTICLES = [
    { id: 'fb1', title: '10 thực phẩm giàu sắt cho mẹ bầu', summary: 'Bổ sung sắt đúng cách giúp ngăn thiếu máu thai kỳ.', category: 'Dinh dưỡng', readTimeMinutes: 5 },
    { id: 'fb2', title: 'Giải mã chỉ số siêu âm thai nhi', summary: 'Hiểu các chỉ số BPD, FL, AC, EFW trên phiếu siêu âm.', category: 'Sức khỏe', readTimeMinutes: 7 },
    { id: 'fb3', title: 'Ốm nghén: Nguyên nhân và cách giảm', summary: '8 cách giảm ốm nghén an toàn không cần thuốc.', category: 'Sức khỏe', readTimeMinutes: 4 },
    { id: 'fb4', title: 'Thai giáo bằng âm nhạc: Bắt đầu từ khi nào?', summary: 'Hướng dẫn thai giáo âm nhạc từ tuần 18.', category: 'Thai giáo', readTimeMinutes: 6 },
    { id: 'fb5', title: 'Chuẩn bị giỏ đồ đi sinh', summary: 'Checklist đầy đủ đồ đi sinh cho mẹ và bé.', category: 'Chuẩn bị sinh', readTimeMinutes: 5 },
    { id: 'fb6', title: '5 bài tập yoga an toàn cho bà bầu', summary: 'Các tư thế yoga an toàn giúp mẹ bầu khỏe mạnh.', category: 'Sức khỏe', readTimeMinutes: 5 },
    { id: 'fb7', title: 'Xét nghiệm đường huyết thai kỳ', summary: 'Tìm hiểu về xét nghiệm GCT và tiểu đường thai kỳ.', category: 'Sức khỏe', readTimeMinutes: 6 },
    { id: 'fb8', title: 'Dấu hiệu chuyển dạ: Khi nào cần đến BV?', summary: 'Nhận biết dấu hiệu chuyển dạ thật vs giả.', category: 'Chuẩn bị sinh', readTimeMinutes: 7 },
]

/* ─── FALLBACK APPOINTMENTS (BYT VN) ─── */
const FALLBACK_APPOINTMENTS = [
    { week: 8, type: 'Khám lần đầu', tests: ['Siêu âm xác nhận thai', 'XN máu cơ bản', 'Nhóm máu'] },
    { week: 12, type: 'Sàng lọc TCN 1', tests: ['SA đo độ mờ da gáy', 'Double test'] },
    { week: 16, type: 'Khám định kỳ', tests: ['Đo chiều cao tử cung', 'Nghe tim thai'] },
    { week: 20, type: 'SA hình thái', tests: ['SA 4D kiểm tra cấu trúc', 'Đo cổ tử cung'] },
    { week: 24, type: 'Khám + Đường huyết', tests: ['XN đường huyết thai kỳ (GCT)'] },
    { week: 28, type: 'Khám TCN 3', tests: ['SA tăng trưởng', 'XN máu', 'Tiêm Anti-D (nếu Rh-)'] },
    { week: 32, type: 'Khám + SA', tests: ['SA tăng trưởng', 'NST', 'Kiểm tra ngôi thai'] },
    { week: 34, type: 'Khám 2 tuần/lần', tests: ['Đo tim thai', 'XN GBS (tuần 35-37)'] },
    { week: 36, type: 'Khám hàng tuần', tests: ['SA ước lượng cân nặng', 'NST'] },
    { week: 38, type: 'Khám trước sinh', tests: ['Đánh giá sẵn sàng sinh', 'NST'] },
    { week: 40, type: 'Ngày dự sinh', tests: ['NST', 'SA kiểm tra nước ối'] },
]

/* ─── Toast ─── */
function Toast({ msg, onClear }) {
    useEffect(() => {
        if (!msg) return
        const t = setTimeout(() => onClear?.(), 3000)
        return () => clearTimeout(t)
    }, [msg, onClear])
    if (!msg) return null
    return <div className="toast" key={msg + Date.now()}>{msg}</div>
}

/* ─── Theme Selection ─── */
function ThemeScreen({ onSelect }) {
    return (
        <div className="theme-screen">
            <h1>Ponnyxinchao! 🌸</h1>
            <p className="sub">Bé yêu của bạn thích màu gì? 💕<br />Bạn luôn có thể đổi sau nha!</p>
            <div className="theme-choices">
                <div className="theme-choice pink" onClick={() => onSelect('pink')}>
                    <span className="choice-emoji">❤️</span>Pink Mode
                </div>
                <div className="theme-choice blue" onClick={() => onSelect('blue')}>
                    <span className="choice-emoji">💙</span>Blue Mode
                </div>
            </div>
        </div>
    )
}

/* ─── Onboarding ─── */
function OnboardingScreen({ onComplete }) {
    const [step, setStep] = useState(0)
    const [phone, setPhone] = useState('')
    const [sentOtp, setSentOtp] = useState('')
    const [otpInputs, setOtpInputs] = useState(['','','','','',''])
    const [otpError, setOtpError] = useState('')
    const [otpToast, setOtpToast] = useState('')
    const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()]

    const [method, setMethod] = useState('lmp')
    const [name, setName] = useState('')
    const [dateDay, setDateDay] = useState('')
    const [dateMonth, setDateMonth] = useState('')
    const [dateYear, setDateYear] = useState('')
    const dateVal = dateDay && dateMonth && dateYear ? `${dateYear}-${dateMonth.padStart(2,'0')}-${dateDay.padStart(2,'0')}` : ''
    const preview = dateVal ? (method === 'lmp' ? calcFromLMP(dateVal) : calcFromEDD(dateVal)) : null

    const curYear = new Date().getFullYear()
    const months = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12']

    const isPhoneValid = /^0\d{9}$/.test(phone)

    const handleSendOtp = () => {
        if (!isPhoneValid) return
        const code = String(Math.floor(100000 + Math.random() * 900000))
        setSentOtp(code)
        setOtpInputs(['','','','','',''])
        setOtpError('')
        setOtpToast(`Mã xác nhận: ${code}`)
        setStep(2)
        setTimeout(() => otpRefs[0]?.current?.focus(), 300)
    }

    const handleOtpChange = (idx, val) => {
        if (!/^\d?$/.test(val)) return
        const next = [...otpInputs]
        next[idx] = val
        setOtpInputs(next)
        setOtpError('')
        if (val && idx < 5) otpRefs[idx + 1]?.current?.focus()
    }

    const handleOtpKeyDown = (idx, e) => {
        if (e.key === 'Backspace' && !otpInputs[idx] && idx > 0) {
            otpRefs[idx - 1]?.current?.focus()
        }
    }

    const handleVerifyOtp = () => {
        const entered = otpInputs.join('')
        if (entered === sentOtp) {
            setOtpToast('')
            setStep(3)
        } else {
            setOtpError('Mã OTP không đúng, vui lòng thử lại')
        }
    }

    // Step 0: Welcome Splash
    if (step === 0) return (
        <div className="welcome-splash">
            <div className="welcome-content">
                <div className="welcome-hero-circle">
                    <img src="/illustrations/welcome-hero.png" alt="" className="welcome-hero-img" onError={e => { e.target.style.display='none'; e.target.parentNode.innerHTML='<span style="font-size:72px">🤰</span>' }} />
                </div>

                <h1 className="welcome-title">
                    <span className="welcome-title-ponny">Ponny</span>
                    <span className="welcome-title-xinchao">yeuoi!</span>
                </h1>
                <p className="welcome-tagline">Người bạn đồng hành thai kỳ thông minh 🌸</p>

                <button className="welcome-start-btn" onClick={() => setStep(1)}>
                    <span>Bắt đầu hành trình</span>
                    <span className="btn-arrow">→</span>
                </button>
                <p className="welcome-note">Dữ liệu y tế chuẩn WHO & Bộ Y tế Việt Nam</p>
            </div>
        </div>
    )

    // Step 1: Phone number
    if (step === 1) return (
        <div className="onboarding">
            <div className="ob-hero-circle">
                <img src="/illustrations/welcome-hero.png" alt="" className="ob-hero-img" onError={e => e.target.style.display='none'} />
            </div>
            <h2>Xác thực số điện thoại</h2>
            <p className="sub">Nhập số điện thoại để đăng ký tài khoản</p>

            <div className="onboarding-step">
                <label>Số điện thoại</label>
                <div className="otp-phone-wrap">
                    <span className="otp-phone-prefix">🇻🇳 +84</span>
                    <input
                        className="otp-phone-input"
                        type="tel"
                        placeholder="0912 345 678"
                        maxLength={10}
                        value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                        autoFocus
                    />
                </div>
                {phone && !isPhoneValid && <div className="otp-hint">Số điện thoại phải có 10 chữ số, bắt đầu bằng 0</div>}
            </div>

            <button className="ob-btn" disabled={!isPhoneValid} onClick={handleSendOtp}>
                Gửi mã OTP
            </button>
            <button className="ob-back-btn" onClick={() => setStep(0)}>← Quay lại</button>
        </div>
    )

    // Step 2: OTP verification
    if (step === 2) return (
        <div className="onboarding">
            {otpToast && <div className="otp-toast">🔑 {otpToast}</div>}
            <div className="ob-hero-circle">
                <img src="/illustrations/welcome-hero.png" alt="" className="ob-hero-img" onError={e => e.target.style.display='none'} />
            </div>
            <h2>Nhập mã xác nhận</h2>
            <p className="sub">Mã OTP đã gửi đến <strong>{phone}</strong></p>

            <div className="otp-code-row">
                {otpInputs.map((v, i) => (
                    <input
                        key={i}
                        ref={otpRefs[i]}
                        className={`otp-code-input ${otpError ? 'error' : ''}`}
                        type="tel"
                        maxLength={1}
                        value={v}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                    />
                ))}
            </div>
            {otpError && <div className="otp-error">{otpError}</div>}

            <button className="ob-btn" disabled={otpInputs.some(v => !v)} onClick={handleVerifyOtp}>
                Xác nhận
            </button>
            <button className="otp-resend" onClick={() => {
                const code = String(Math.floor(100000 + Math.random() * 900000))
                setSentOtp(code)
                setOtpInputs(['','','','','',''])
                setOtpError('')
                setOtpToast(`Mã xác nhận: ${code}`)
                otpRefs[0]?.current?.focus()
            }}>Gửi lại mã OTP</button>
            <button className="ob-back-btn" onClick={() => setStep(1)}>← Đổi số điện thoại</button>
        </div>
    )

    // Step 3: Name + Due date (existing registration)
    return (
        <div className="onboarding">
            <div className="ob-hero-circle">
                <img src="/illustrations/welcome-hero.png" alt="" className="ob-hero-img" onError={e => e.target.style.display='none'} />
            </div>
            <h2>Thiết lập thai kỳ</h2>
            <p className="sub">Nhập thông tin để Ponny tính tuần thai chính xác</p>

            <div className="onboarding-step">
                <label>Tên gọi thân mật</label>
                <input placeholder="Ví dụ: Ponny, Mẹ bầu, Mama..." value={name} onChange={e => setName(e.target.value)} autoFocus />
            </div>

            <div className="onboarding-step">
                <label>Chọn cách tính</label>
                <div className="ob-method">
                    <button className={method === 'lmp' ? 'active' : ''} onClick={() => setMethod('lmp')}>Ngày kinh cuối</button>
                    <button className={method === 'edd' ? 'active' : ''} onClick={() => setMethod('edd')}>Ngày dự sinh</button>
                </div>
                <div className="ob-date-row">
                    <div className="ob-date-field">
                        <select value={dateDay} onChange={e => setDateDay(e.target.value)}>
                            <option value="">Ngày</option>
                            {Array.from({length:31},(_,i)=>i+1).map(d => <option key={d} value={String(d)}>{d}</option>)}
                        </select>
                    </div>
                    <div className="ob-date-field ob-date-month">
                        <select value={dateMonth} onChange={e => setDateMonth(e.target.value)}>
                            <option value="">Tháng</option>
                            {months.map((m,i) => <option key={i} value={String(i+1)}>{m}</option>)}
                        </select>
                    </div>
                    <div className="ob-date-field">
                        <select value={dateYear} onChange={e => setDateYear(e.target.value)}>
                            <option value="">Năm</option>
                            {[curYear-1, curYear, curYear+1].map(y => <option key={y} value={String(y)}>{y}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {preview && preview.week >= 1 && preview.week <= 40 && (
                <div className="ob-preview">
                    <span className="emoji">🌸</span>
                    <div className="week">Tuần {preview.week}, Ngày {preview.day}</div>
                    <div className="detail">Còn {preview.daysLeft} ngày nữa sẽ gặp bé!</div>
                </div>
            )}

            <button className="ob-btn" disabled={!dateVal || !name}
                onClick={() => onComplete({ name, method, dateVal, phone })}>
                Bắt đầu hành trình!
            </button>
            <button className="ob-back-btn" onClick={() => setStep(2)}>← Quay lại</button>
        </div>
    )
}

/* ─── MAIN APP ─── */
export default function App() {
    const [theme, setTheme] = useState(() => localStorage.getItem('ponny_theme'))
    const [onboarded, setOnboarded] = useState(() => !!localStorage.getItem('ponny_onboarding'))
    const [userConfig, setUserConfig] = useState(() => {
        const s = localStorage.getItem('ponny_onboarding')
        return s ? JSON.parse(s) : null
    })
    const [tab, setTab] = useState('home')
    const [subPage, setSubPage] = useState(null)
    const [userApts, setUserApts] = useState(() => {
        const s = localStorage.getItem('ponny_user_apts')
        return s ? JSON.parse(s) : []
    })
    const [showAddApt, setShowAddApt] = useState(false)
    const [newApt, setNewApt] = useState({ date: '', type: '', place: '', note: '' })
    const [examResults, setExamResults] = useState(() => {
        const s = localStorage.getItem('ponny_exam_results')
        return s ? JSON.parse(s) : []
    })
    const [showAddResult, setShowAddResult] = useState(null)
    const [newResult, setNewResult] = useState({ weight: '', bp: '', note: '', bpd: '', fl: '', ac: '', efw: '' })
    const [babyDiary, setBabyDiary] = useState(() => {
        const s = localStorage.getItem('ponny_baby_diary')
        return s ? JSON.parse(s) : {}
    })
    const [showDiaryForm, setShowDiaryForm] = useState(false)
    const [diaryInput, setDiaryInput] = useState({ weight: '', note: '' })
    const [milestones, setMilestones] = useState(() => {
        const s = localStorage.getItem('ponny_milestones')
        return s ? JSON.parse(s) : {}
    })
    const [selectedArticle, setSelectedArticle] = useState(null)
    const [medHistory, setMedHistory] = useState(() => {
        const s = localStorage.getItem('ponny_med_history')
        return s ? JSON.parse(s) : {}
    })
    const [toast, setToast] = useState('')
    const [devSummary, setDevSummary] = useState(null)
    const [weekDetail, setWeekDetail] = useState(null)
    const [articles, setArticles] = useState([])
    const [appointments, setAppointments] = useState([])

    // Pregnancy calc
    const pregnancy = userConfig ? (userConfig.method === 'lmp' ? calcFromLMP(userConfig.dateVal) : calcFromEDD(userConfig.dateVal)) : { week: 24, day: 3, daysLeft: 112 }
    const weekNum = pregnancy.week
    const dayNum = pregnancy.day
    const daysLeft = pregnancy.daysLeft
    const userName = userConfig?.name || 'bạn'
    const progress = (weekNum / 40) * 100

    // State
    const [kickCount, setKickCount] = useState(0)
    const [kickTimer, setKickTimer] = useState(0)
    const [kickRunning, setKickRunning] = useState(false)
    const [kickHistory, setKickHistory] = useState(() => {
        const s = localStorage.getItem('ponny_kicks')
        return s ? JSON.parse(s) : []
    })
    const [kickBump, setKickBump] = useState(false)
    const kickRef = useRef(null)

    const [meds, setMeds] = useState(() => {
        const s = localStorage.getItem('ponny_meds')
        if (s) return JSON.parse(s)
        return []
    })
    const [showAddMed, setShowAddMed] = useState(false)
    const [newMed, setNewMed] = useState({ name: '', dose: '', times: ['08:00'] })

    const [selectedWeek, setSelectedWeek] = useState(weekNum)
    const [expandedCard, setExpandedCard] = useState(null)
    const [bookmarks, setBookmarks] = useState({})
    const [searchQ, setSearchQ] = useState('')
    const [activeFilter, setActiveFilter] = useState('week')
    const timelineRef = useRef(null)

    // Chat state
    const [chatMessages, setChatMessages] = useState(() => {
        const s = localStorage.getItem('ponny_chat_history')
        return s ? JSON.parse(s) : []
    })
    const [chatInput, setChatInput] = useState('')
    const [chatLoading, setChatLoading] = useState(false)
    const [chatOpen, setChatOpen] = useState(false)
    const [chatImage, setChatImage] = useState(null)
    const chatEndRef = useRef(null)
    const chatFileRef = useRef(null)
    const chatCameraRef = useRef(null)
    const [chatAttachMenu, setChatAttachMenu] = useState(false)

    // Save meds
    useEffect(() => { localStorage.setItem('ponny_meds', JSON.stringify(meds)) }, [meds])
    useEffect(() => { localStorage.setItem('ponny_kicks', JSON.stringify(kickHistory)) }, [kickHistory])
    useEffect(() => { localStorage.setItem('ponny_user_apts', JSON.stringify(userApts)) }, [userApts])
    useEffect(() => { localStorage.setItem('ponny_exam_results', JSON.stringify(examResults)) }, [examResults])
    useEffect(() => { localStorage.setItem('ponny_baby_diary', JSON.stringify(babyDiary)) }, [babyDiary])
    useEffect(() => { localStorage.setItem('ponny_milestones', JSON.stringify(milestones)) }, [milestones])
    useEffect(() => { localStorage.setItem('ponny_med_history', JSON.stringify(medHistory)) }, [medHistory])
    useEffect(() => { localStorage.setItem('ponny_chat_history', JSON.stringify(chatMessages)) }, [chatMessages])

    // Kick timer
    useEffect(() => {
        if (!kickRunning) return
        const t = setInterval(() => setKickTimer(v => v + 1), 1000)
        return () => clearInterval(t)
    }, [kickRunning])

    // API — safe fetch, always return arrays, use d.data
    useEffect(() => {
        fetch(`${API}/development/summary`).then(r => r.ok ? r.json() : null).then(d => { if (d) setDevSummary(d) }).catch(() => { })
        fetch(`${API}/articles?week=${weekNum}`).then(r => r.ok ? r.json() : null).then(d => {
            if (!d) return
            const arr = Array.isArray(d) ? d : (Array.isArray(d.data) ? d.data : (Array.isArray(d.articles) ? d.articles : []))
            setArticles(arr)
        }).catch(() => { })
        fetch(`${API}/appointments/recommended?week=${weekNum}`).then(r => r.ok ? r.json() : null).then(d => {
            if (!d) return
            const arr = Array.isArray(d) ? d : (Array.isArray(d.data) ? d.data : (Array.isArray(d.appointments) ? d.appointments : []))
            setAppointments(arr)
        }).catch(() => { })
    }, [weekNum])

    useEffect(() => {
        fetch(`${API}/development/week/${selectedWeek}`).then(r => r.ok ? r.json() : null).then(d => { if (d) setWeekDetail(d) }).catch(() => { })
    }, [selectedWeek])

    // Auto-scroll timeline
    useEffect(() => {
        if (timelineRef.current) {
            const el = timelineRef.current.querySelector('.week-pill.active')
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        }
    }, [tab, selectedWeek])

    const showToast = useCallback(msg => { setToast(''); setTimeout(() => setToast(msg), 10) }, [])
    const clearToast = useCallback(() => setToast(''), [])

    // Theme side effect
    useEffect(() => {
        if (theme) document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    const toggleTheme = useCallback(() => {
        const n = theme === 'pink' ? 'blue' : 'pink'
        setTheme(n)
        localStorage.setItem('ponny_theme', n)
        showToast(`Đã chuyển ${n === 'pink' ? 'Pink' : 'Blue'} Mode!`)
    }, [theme, showToast])

    // Build user context for chatbot
    const buildUserContext = useCallback(() => {
        const trimester = weekNum <= 12 ? 1 : weekNum <= 27 ? 2 : 3
        const nextApt = [...userApts].filter(a => new Date(a.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date))[0]
        return {
            userName,
            weekNum,
            dayNum,
            daysLeft,
            edd: pregnancy.edd ? new Date(pregnancy.edd).toLocaleDateString('vi') : '',
            trimester,
            meds: meds.map(m => ({ name: m.name, dose: m.dose, freq: m.freq, taken: m.taken })),
            examResults: examResults.slice(-5).map(e => ({ date: e.date, weight: e.weight, bp: e.bp, note: e.note, bpd: e.bpd, fl: e.fl, ac: e.ac, efw: e.efw })),
            kickHistory: kickHistory.slice(-5).map(k => ({ count: k.count, duration: k.duration, time: k.time })),
            nextAppointment: nextApt ? { date: nextApt.date, type: nextApt.type, place: nextApt.place } : undefined,
            babyDiary,
            milestones
        }
    }, [userName, weekNum, dayNum, daysLeft, pregnancy, meds, examResults, kickHistory, userApts, babyDiary, milestones])

    // Simple markdown renderer for chat responses
    const renderMarkdown = (text) => {
        if (!text) return ''
        return text
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/^### (.+)$/gm, '<strong style="font-size:15px;display:block;margin:8px 0 4px">$1</strong>')
            .replace(/^## (.+)$/gm, '<strong style="font-size:16px;display:block;margin:8px 0 4px">$1</strong>')
            .replace(/^# (.+)$/gm, '<strong style="font-size:17px;display:block;margin:10px 0 4px">$1</strong>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,.06);padding:1px 4px;border-radius:4px;font-size:13px">$1</code>')
            .replace(/^[\-\*] (.+)$/gm, '<div style="padding-left:12px;text-indent:-12px;margin:2px 0">• $1</div>')
            .replace(/^(\d+)\. (.+)$/gm, '<div style="padding-left:16px;text-indent:-16px;margin:2px 0">$1. $2</div>')
            .replace(/\n/g, '<br/>')
    }

    // Send chat message (direct Gemini call)
    const handleChatImage = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (!file.type.startsWith('image/')) { showToast('Chỉ hỗ trợ gửi ảnh'); return }
        if (file.size > 10 * 1024 * 1024) { showToast('Ảnh quá lớn (tối đa 10MB)'); return }
        const reader = new FileReader()
        reader.onload = () => {
            const base64 = reader.result.split(',')[1]
            setChatImage({ base64, mimeType: file.type, preview: reader.result, name: file.name })
        }
        reader.readAsDataURL(file)
        e.target.value = ''
    }

    const sendChat = useCallback(async () => {
        const msg = chatInput.trim()
        const img = chatImage
        if ((!msg && !img) || chatLoading) return
        setChatInput('')
        setChatImage(null)
        const userMsg = { role: 'user', content: msg || '📷 Ảnh đã gửi', image: img?.preview || null }
        setChatMessages(prev => [...prev, userMsg])
        setChatLoading(true)
        try {
            const ctx = buildUserContext()
            const medsStr = ctx.meds.length > 0 ? ctx.meds.map(m => `  • ${m.name} (${m.dose}, ${m.freq}) — ${m.taken ? 'đã uống' : 'chưa uống'}`).join('\n') : '  Chưa thiết lập'
            const systemPrompt = `Bạn là Ponny — trợ lý AI chuyên sức khỏe thai kỳ, có kiến thức sâu rộng theo WHO và Bộ Y tế Việt Nam.\n\nTHÔNG TIN MẸ BẦU:\n- Tên: ${ctx.userName}\n- Tuần thai: Tuần ${ctx.weekNum}, Ngày ${ctx.dayNum}\n- Tam cá nguyệt: ${ctx.trimester}\n- Ngày dự sinh: ${ctx.edd}\n- Còn ${ctx.daysLeft} ngày nữa\n\nTHUỐC ĐANG DÙNG:\n${medsStr}\n\nQUY TẮC:\n1. Trả lời tiếng Việt, thân thiện, dùng emoji\n2. Gọi mẹ bầu bằng tên "${ctx.userName}"\n3. ĐƯỢC PHÉP đưa lời khuyên sức khỏe: dinh dưỡng, vận động, triệu chứng, thuốc bổ, xét nghiệm, dấu hiệu nguy hiểm\n4. Triệu chứng nghiêm trọng (ra máu, đau dữ dội, vỡ ối) thì khuyên cấp cứu NGAY\n5. Trả lời tối đa 300 từ\n6. CHỈ chào ở tin đầu tiên\n7. Phân tích ảnh nếu có`

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`
            const history = chatMessages.map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
            }))
            const userParts = []
            if (msg) userParts.push({ text: msg })
            if (img) userParts.push({ inlineData: { mimeType: img.mimeType, data: img.base64 } })
            if (userParts.length === 0) userParts.push({ text: 'Hãy phân tích ảnh này' })
            history.push({ role: 'user', parts: userParts })
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    contents: history,
                    generationConfig: { maxOutputTokens: 500, temperature: 0.7 }
                })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`)
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Không nhận được phản hồi'
            setChatMessages(prev => [...prev, { role: 'assistant', content: reply }])
        } catch (err) {
            console.error('Gemini error:', err)
            const errMsg = err.message?.includes('429') ? 'API đang quá tải, vui lòng thử lại sau vài giây nhé!' : err.message?.includes('403') ? 'API key không hợp lệ' : 'Có lỗi xảy ra: ' + (err.message || '').slice(0, 100)
            setChatMessages(prev => [...prev, { role: 'assistant', content: errMsg }])
        } finally {
            setChatLoading(false)
        }
    }, [chatInput, chatLoading, chatMessages, buildUserContext])

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chatMessages, chatLoading])

    // Gates
    if (!theme) return <ThemeScreen onSelect={t => { setTheme(t); localStorage.setItem('ponny_theme', t) }} />
    if (!onboarded) return (
        <div data-theme={theme}>
            <OnboardingScreen onComplete={cfg => {
                localStorage.setItem('ponny_onboarding', JSON.stringify(cfg))
                setUserConfig(cfg)
                setOnboarded(true)
                setSelectedWeek(cfg.method === 'lmp' ? calcFromLMP(cfg.dateVal).week : calcFromEDD(cfg.dateVal).week)
            }} />
        </div>
    )

    const medTaken = meds.filter(m => m.taken).length
    const medTotal = meds.length

    // Ring helper
    const ring = (size, stroke, pct, bgClass, fgClass) => {
        const r = (size - stroke) / 2; const c = 2 * Math.PI * r
        return (
            <svg width={size} height={size}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className={bgClass} />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className={fgClass} strokeDasharray={c} strokeDashoffset={c - (c * Math.min(pct, 100) / 100)} />
            </svg>
        )
    }

    // NAVIGATE
    const goTab = t => { setTab(t); setSubPage(null) }

    // Kick
    const doKick = () => {
        if (!kickRunning) setKickRunning(true)
        setKickCount(v => v + 1)
        setKickBump(true)
        setTimeout(() => setKickBump(false), 300)
        // Ripple
        const btn = kickRef.current
        if (btn) {
            const rip = document.createElement('span')
            rip.className = 'ripple'
            const rect = btn.getBoundingClientRect()
            rip.style.left = '50%'
            rip.style.top = '50%'
            btn.appendChild(rip)
            setTimeout(() => rip.remove(), 600)
        }
    }
    const undoKick = () => { if (kickCount > 0) setKickCount(v => v - 1) }
    const endKickSession = () => {
        if (kickCount > 0) {
            const entry = { time: new Date().toLocaleTimeString('vi', { hour: '2-digit', minute: '2-digit' }), count: kickCount, duration: kickTimer }
            setKickHistory(prev => [entry, ...prev.slice(0, 9)])
        }
        setKickRunning(false); setKickTimer(0); setKickCount(0)
        showToast('Đã lưu phiên đếm!')
    }

    // Meds
    const toggleMed = id => {
        setMeds(prev => prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m))
        const today = new Date().toLocaleDateString('vi')
        setMedHistory(prev => {
            const dayLog = prev[today] || {}
            dayLog[id] = !dayLog[id]
            return { ...prev, [today]: dayLog }
        })
    }
    const deleteMed = id => { if (confirm('Xóa thuốc này?')) setMeds(prev => prev.filter(m => m.id !== id)) }
    const addMed = () => {
        if (!newMed.name) return
        const timeStr = newMed.times.filter(t => t).join(' & ') || '08:00'
        const freqStr = newMed.times.length > 1 ? `${newMed.times.length} lần/ngày` : 'Mỗi ngày'
        setMeds(prev => [...prev, { id: Date.now(), name: newMed.name, nameEn: '', dose: newMed.dose, freq: freqStr, time: timeStr, icon: '💊', taken: false }])
        setNewMed({ name: '', dose: '', times: ['08:00'] })
        setShowAddMed(false)
        showToast('Đã thêm thuốc!')
    }

    // Week detail
    const fetalFallback = FETAL_DATA[selectedWeek] || FETAL_DATA[24] || {}
    const wd = weekDetail ? { ...fetalFallback, ...weekDetail } : fetalFallback
    const trimester = selectedWeek <= 13 ? 1 : selectedWeek <= 27 ? 2 : 3

    // Use API articles or fallback
    const safeArticles = (Array.isArray(articles) && articles.length > 0) ? articles : FALLBACK_ARTICLES
    const safeAppointments = (Array.isArray(appointments) && appointments.length > 0) ? appointments : FALLBACK_APPOINTMENTS
    const nextApt = safeAppointments.find(a => a.week >= weekNum)
    const suppRecs = trimester === 1 ? SUPPLEMENT_RECS.trimester1 : trimester === 2 ? SUPPLEMENT_RECS.trimester2 : SUPPLEMENT_RECS.trimester3

    // Filtered articles
    const filteredArticles = safeArticles.filter(a => {
        if (searchQ && !a.title?.toLowerCase().includes(searchQ.toLowerCase())) return false
        if (activeFilter === 'saved' && !bookmarks[a.id]) return false
        return true
    })

    // Timer format
    const fmtTime = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

    /* ─── RENDER ─── */
    return (
        <div className="app" data-theme={theme}>
            {/* ─── HEADER ─── */}
            {(tab === 'home' && !subPage) && (
                <div className="header">
                    <div className="header-row">
                        <div>
                            <div className="header-greeting">{getTimeGreeting()}</div>
                            <div className="header-name">{userName}</div>

                        </div>
                        <button className="theme-btn" onClick={toggleTheme}>
                            {theme === 'pink' ? '❤️' : '💙'} {theme === 'pink' ? 'Pink' : 'Blue'}
                        </button>
                    </div>
                </div>
            )}
            {(tab !== 'home' || subPage) && (
                <div className="header">
                    <div className="header-row">
                        <button className="header-back-btn" onClick={() => { if (subPage) setSubPage(null); else goTab('home') }}>←</button>
                        <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>{
                                tab === 'baby' ? 'Bé yêu' : tab === 'kick' ? 'Đếm cử động' : tab === 'knowledge' ? 'Kiến thức mẹ bầu' : tab === 'meds' ? 'Thuốc & Vitamin' : tab === 'appointments' ? 'Tái khám' : tab === 'settings' ? 'Cài đặt' : ''
                            }</span>
                    </div>
                </div>
            )}

            {/* ─── HOME ─── */}
            {tab === 'home' && !subPage && (
                <div className="page-enter">
                    {/* Hero — Bé yêu tuần này */}
                    <div className="hero-v2" onClick={() => goTab('baby')}>
                        <div className="hero-v2-top">
                            <div>
                                <div className="hero-v2-week">Tuần {weekNum}<span className="hero-v2-day">, Ngày {dayNum}</span></div>
                            </div>
                        </div>
                        <div className="hero-v2-center">
                            <img className="hero-v2-illustration" src="/illustrations/baby-hero.png" alt="Baby" onError={e => { e.target.style.display='none' }} />
                            <div className="hero-v2-ring-wrap">
                                <svg className="hero-v2-ring" viewBox="0 0 80 80">
                                    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,107,157,.15)" strokeWidth="6"/>
                                    <circle cx="40" cy="40" r="34" fill="none" stroke="var(--primary)" strokeWidth="6"
                                        strokeDasharray={2*Math.PI*34} strokeDashoffset={2*Math.PI*34 - (2*Math.PI*34 * progress / 100)}
                                        strokeLinecap="round" transform="rotate(-90 40 40)"/>
                                </svg>
                                <span className="hero-v2-pct">{Math.round(progress)}%</span>
                            </div>
                        </div>
                        <div className="hero-v2-size">{wd.sizeComparison ? `Bé to bằng ${wd.sizeComparison}` : 'Bé to bằng trái bắp'}</div>
                        <div className="hero-v2-stats-inline">
                            <span className="hero-v2-stat-item">🍼 {wd.weight || '~600g'}</span>
                            <span className="hero-v2-stat-sep">|</span>
                            <span className="hero-v2-stat-item">📐 {wd.length || '~21cm'}</span>
                        </div>
                    </div>


                    {/* Nhắc nhở hôm nay */}
                    <div className="section">
                        <div className="section-header"><span className="section-title">Nhắc nhở hôm nay</span></div>

                        {/* Uống thuốc */}
                        <div className="reminder-group-label"><img src="/icons/nav-pill.png" alt="" style={{width:18,height:18,objectFit:'cover',verticalAlign:'middle',marginRight:4,borderRadius:'50%'}} /> Uống thuốc</div>
                        <div className="reminder-list">
                            {meds.length > 0 ? meds.map(m => (
                                <div className={`reminder-row ${m.taken ? 'done' : ''}`} key={m.id}>
                                    <img src="/icons/nav-pill.png" alt="" className="reminder-icon-img" />
                                    <span className="reminder-name">{m.name} {m.dose}</span>
                                    <button className={`reminder-action ${m.taken ? 'checked' : ''}`}
                                        onClick={() => toggleMed(m.id)}>{m.taken ? '✅' : 'Uống'}</button>
                                </div>
                            )) : (
                                <div className="reminder-row" onClick={() => goTab('meds')}>
                                    <img src="/icons/nav-pill.png" alt="" className="reminder-icon-img" />
                                    <span className="reminder-name reminder-muted">Chưa thiết lập thuốc</span>
                                    <span className="reminder-action-text">Thêm →</span>
                                </div>
                            )}
                        </div>

                        {/* 🏥 Lịch tái khám */}
                        <div className="reminder-group-label"><img src="/icons/nav-calendar.png" alt="" style={{width:18,height:18,objectFit:'cover',verticalAlign:'middle',marginRight:4,borderRadius:'50%'}} /> Lịch tái khám</div>
                        <div className="reminder-list">
                            {(() => {
                                const upcoming = userApts.filter(a => new Date(a.date) >= new Date()).sort((a,b) => new Date(a.date) - new Date(b.date))
                                if (upcoming.length > 0) {
                                    const next = upcoming[0]
                                    const d = new Date(next.date)
                                    const diff = Math.ceil((d - new Date()) / 86400000)
                                    return (
                                        <div className="reminder-row" onClick={() => goTab('appointments')}>
                                            <img src="/icons/nav-calendar.png" alt="" className="reminder-icon-img" />
                                            <span className="reminder-name">{next.type}</span>
                                            <span className="reminder-action-text">{diff === 0 ? '🔴 Hôm nay!' : `${diff} ngày nữa`}</span>
                                        </div>
                                    )
                                }
                                return (
                                    <div className="reminder-row" onClick={() => goTab('appointments')}>
                                        <img src="/icons/nav-calendar.png" alt="" className="reminder-icon-img" />
                                        <span className="reminder-name reminder-muted">Chưa có lịch tái khám</span>
                                        <span className="reminder-action-text">Thêm →</span>
                                    </div>
                                )
                            })()}
                        </div>

                        {/* 🦶 Đếm cử động thai */}
                        <div className="reminder-group-label"><img src="/icons/nav-kick.png" alt="" style={{width:18,height:18,objectFit:'cover',verticalAlign:'middle',marginRight:4,borderRadius:'50%'}} /> Đếm cử động thai</div>
                        <div className="reminder-list">
                            <div className="reminder-row" onClick={() => goTab('kick')}>
                                <img src="/icons/nav-baby.png" alt="" className="reminder-icon-img" />
                                <span className="reminder-name">Đếm cử động hôm nay</span>
                                <span className="reminder-action-text">{kickHistory.length > 0 ? `${kickHistory[0].count} lần • ${kickHistory[0].time}` : 'Chưa đếm'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Đọc gì tuần này */}
                    <div className="section">
                        <div className="section-header">
                            <span className="section-title">Đọc gì tuần này</span>
                            <button className="section-more" onClick={() => goTab('knowledge')}>Xem tất cả →</button>
                        </div>
                        {safeArticles.slice(0, 2).map(a => (
                            <div className="article-card" key={a.id}>
                                <div className="article-card-top">
                                    <span className="article-tag">{a.category}</span>
                                    <button className={`bookmark-btn ${bookmarks[a.id] ? 'active' : ''}`} onClick={e => { e.stopPropagation(); setBookmarks(p => ({ ...p, [a.id]: !p[a.id] })) }}>{bookmarks[a.id] ? '❤️' : '🤍'}</button>
                                </div>
                                <div className="article-title">{a.title}</div>
                                <div className="article-desc">{a.summary}</div>
                                <div className="article-meta">📖 {a.readTimeMinutes || a.readTime || 5} phút đọc</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ─── TÁI KHÁM TAB ─── */}
            {tab === 'appointments' && (
                <div className="page-enter">
                    {!subPage && <>
                    {/* User’s own appointments (CRUD) */}
                    <div className="section">
                        <div className="section-header">
                            <span className="section-title"><img src="/icons/nav-calendar.png" alt="" style={{width:20,height:20,objectFit:'cover',borderRadius:'50%',verticalAlign:'middle',marginRight:4}} /> Lịch khám của tôi</span>
                            {userApts.length > 0 && <button className="section-more" onClick={() => setShowAddApt(!showAddApt)}>{showAddApt ? '✕ Hủy' : '+ Thêm'}</button>}
                        </div>

                        {showAddApt && (
                            <div className="add-apt-form">
                                <input type="date" value={newApt.date} onChange={e => setNewApt({ ...newApt, date: e.target.value })} />
                                <input placeholder="Loại khám (VD: SA hình thái, Khám định kỳ...)" value={newApt.type} onChange={e => setNewApt({ ...newApt, type: e.target.value })} />
                                <input placeholder="Nơi khám (VD: BV Phụ sản TW)" value={newApt.place} onChange={e => setNewApt({ ...newApt, place: e.target.value })} />
                                <button className="submit-btn" onClick={() => {
                                    if (!newApt.date || !newApt.type) return
                                    setUserApts(prev => [...prev, { id: Date.now(), ...newApt }].sort((a, b) => new Date(a.date) - new Date(b.date)))
                                    setNewApt({ date: '', type: '', place: '', note: '' })
                                    setShowAddApt(false)
                                    showToast('Thêm lịch khám thành công!')
                                }}>Lưu lịch khám</button>
                            </div>
                        )}

                        {userApts.length === 0 && !showAddApt && (
                            <div className="med-empty-state">
                                <div className="med-empty-icon"><img src="/icons/nav-calendar.png" alt="" style={{width:160,height:160,objectFit:'cover',borderRadius:'50%'}} /></div>
                                <div className="med-empty-title">Chưa có lịch khám</div>
                                <div className="med-empty-desc">Thêm lịch tái khám để được nhắc nhở</div>
                                <button className="submit-btn" onClick={() => setShowAddApt(true)}>+ Thêm lịch khám đầu tiên</button>
                            </div>
                        )}

                        {[...userApts].sort((a, b) => {
                            const now = new Date()
                            const aDate = new Date(a.date)
                            const bDate = new Date(b.date)
                            const aIsPast = aDate < now
                            const bIsPast = bDate < now
                            if (aIsPast !== bIsPast) return aIsPast ? 1 : -1
                            return aDate - bDate
                        }).map(a => {
                            const aptDate = new Date(a.date)
                            const today = new Date()
                            const diffDays = Math.ceil((aptDate - today) / 86400000)
                            const isPast = diffDays < 0
                            const aptResult = examResults.find(r => r.aptId === a.id)
                            const isExpanded = showAddResult === a.id
                            return (
                                <div key={a.id} className={`apt-card-wrap ${isPast ? 'past' : diffDays <= 3 ? 'next' : ''}`}>
                                    <div className="apt-card-main">
                                        <div className="apt-badge"><span className="num">{aptDate.getDate()}</span><span className="unit">Th{aptDate.getMonth() + 1}</span></div>
                                        <div style={{ flex: 1 }}>
                                            <div className="apt-type">{a.type}</div>
                                            {a.place && <div className="apt-tests">📍 {a.place}</div>}
                                            <div className="apt-tests" style={{ color: isPast ? 'var(--text-light)' : diffDays <= 3 ? 'var(--primary)' : 'var(--text-secondary)' }}>
                                                {isPast ? 'Đã qua' : diffDays === 0 ? '🔴 Hôm nay!' : `${diffDays} ngày nữa`}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                                            {!aptResult && <button className="reminder-action" style={{ fontSize: 11, padding: '4px 8px' }} onClick={() => setShowAddResult(isExpanded ? null : a.id)}>Ghi KQ</button>}
                                            {aptResult && <button className="reminder-action" style={{ fontSize: 11, padding: '4px 8px' }} onClick={() => setShowAddResult(isExpanded ? null : a.id)}>{isExpanded ? '▲ Ẩn' : 'Xem KQ'}</button>}
                                            <button className="med-delete" onClick={() => { if (confirm('Xóa lịch khám này?')) { setUserApts(prev => prev.filter(x => x.id !== a.id)); setExamResults(prev => prev.filter(r => r.aptId !== a.id)) } }}>🗑️</button>
                                        </div>
                                    </div>

                                    {/* Inline result display */}
                                    {aptResult && isExpanded && (
                                        <div className="apt-result-inline">
                                            <div className="apt-result-grid">
                                                {aptResult.weight && <div className="apt-result-item"><span className="apt-result-label">Cân nặng</span><span className="apt-result-val">{aptResult.weight}kg</span></div>}
                                                {aptResult.bp && <div className="apt-result-item"><span className="apt-result-label">Huyết áp</span><span className="apt-result-val">{aptResult.bp}</span></div>}
                                                {aptResult.bpd && <div className="apt-result-item"><span className="apt-result-label">BPD</span><span className="apt-result-val">{aptResult.bpd}mm</span></div>}
                                                {aptResult.fl && <div className="apt-result-item"><span className="apt-result-label">FL</span><span className="apt-result-val">{aptResult.fl}mm</span></div>}
                                                {aptResult.ac && <div className="apt-result-item"><span className="apt-result-label">AC</span><span className="apt-result-val">{aptResult.ac}mm</span></div>}
                                                {aptResult.efw && <div className="apt-result-item"><span className="apt-result-label">EFW</span><span className="apt-result-val">{aptResult.efw}g</span></div>}
                                            </div>
                                            {aptResult.note && <div className="apt-result-note">💬 {aptResult.note}</div>}
                                        </div>
                                    )}

                                    {/* Inline result form */}
                                    {!aptResult && isExpanded && (
                                        <div className="apt-result-inline">
                                            <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--primary)', marginBottom: 8 }}>Ghi chép kết quả — {a.type}</div>
                                            <div className="add-med-row">
                                                <input placeholder="Cân nặng mẹ (kg)" value={newResult.weight} onChange={e => setNewResult({ ...newResult, weight: e.target.value })} />
                                                <input placeholder="Huyết áp (VD: 120/80)" value={newResult.bp} onChange={e => setNewResult({ ...newResult, bp: e.target.value })} />
                                            </div>
                                            <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Chỉ số siêu âm (nếu có)</div>
                                            <div className="add-med-row">
                                                <input placeholder="BPD (mm)" value={newResult.bpd} onChange={e => setNewResult({ ...newResult, bpd: e.target.value })} />
                                                <input placeholder="FL (mm)" value={newResult.fl} onChange={e => setNewResult({ ...newResult, fl: e.target.value })} />
                                            </div>
                                            <div className="add-med-row">
                                                <input placeholder="AC (mm)" value={newResult.ac} onChange={e => setNewResult({ ...newResult, ac: e.target.value })} />
                                                <input placeholder="EFW (g)" value={newResult.efw} onChange={e => setNewResult({ ...newResult, efw: e.target.value })} />
                                            </div>
                                            <textarea placeholder="Ghi chú của bác sĩ..." value={newResult.note} onChange={e => setNewResult({ ...newResult, note: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid rgba(0,0,0,.08)', borderRadius: 10, fontFamily: 'Nunito, sans-serif', fontSize: 14, resize: 'vertical', minHeight: 60, boxSizing: 'border-box' }} />
                                            <button className="submit-btn" onClick={() => {
                                                setExamResults(prev => [...prev, { id: Date.now(), aptId: a.id, date: a.date, ...newResult }])
                                                setNewResult({ weight: '', bp: '', note: '', bpd: '', fl: '', ac: '', efw: '' })
                                                setShowAddResult(null)
                                                showToast('Đã lưu kết quả khám!')
                                            }}>Lưu kết quả</button>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* CTA gợi ý mốc khám */}
                    <div className="apt-suggest-cta">
                        <div className="apt-suggest-cta-text">Bạn có muốn biết những mốc khám thai quan trọng?</div>
                        <button className="apt-suggest-cta-btn" onClick={() => setSubPage('milestones')}>Xem ngay →</button>
                    </div>
                    </>}

                    {/* SubPage: Mốc khám quan trọng */}
                    {subPage === 'milestones' && (
                        <div className="section">
                            <div className="apt-tooltip-label">Theo chuẩn Bộ Y tế Việt Nam • Chỉ mang tính tham khảo</div>
                            {safeAppointments.map(a => (
                                <div className={`apt-card apt-tooltip ${a.week < weekNum ? 'past' : a.week === nextApt?.week ? 'next' : ''}`} key={a.week}>
                                    <div className="apt-badge"><span className="num">{a.week}</span><span className="unit">tuần</span></div>
                                    <div>
                                        <div className="apt-type">{a.type}</div>
                                        <div className="apt-tests">{a.tests?.join(', ')}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ─── BABY DEV ─── */}
            {tab === 'baby' && !subPage && (
                <div className="page-enter">
                    {/* Hero — Baby Dev */}
                    <div className="baby-hero-card">
                        <div className="baby-hero-top">
                            <div className="baby-hero-week">Tuần {selectedWeek}</div>
                        </div>
                        <div className="baby-hero-center">
                            <img className="baby-hero-img" src="/illustrations/baby-hero.png" alt="Baby" onError={e => { e.target.style.display='none' }} />
                            <div className="baby-hero-stats">
                                <div className="baby-hero-stat">
                                    <img src="/icons/nav-pill.png" alt="" style={{width:18,height:18,objectFit:'cover',borderRadius:'50%',verticalAlign:'middle'}} />
                                    <span className="baby-hero-val">{wd.weight || '~600g'}</span>
                                </div>
                                <div className="baby-hero-stat">
                                    <img src="/icons/nav-book.png" alt="" style={{width:18,height:18,objectFit:'cover',borderRadius:'50%',verticalAlign:'middle'}} />
                                    <span className="baby-hero-val">{wd.length || '~30cm'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Week Selector — compact */}
                    <div className="week-selector-wrap">
                        <div className="week-selector-label">Tuần</div>
                        <div className="week-selector-row">
                            {Array.from({ length: 9 }, (_, i) => selectedWeek - 4 + i).filter(w => w >= 1 && w <= 40).map(w => (
                                <button key={w} className={`week-sel-pill ${w === selectedWeek ? 'active' : ''} ${w === weekNum ? 'current' : ''}`}
                                    onClick={() => setSelectedWeek(w)}>T{w}</button>
                            ))}
                        </div>
                    </div>

                    {/* Dev Cards — 3 colored cards matching mockup */}
                    <div className="dev-cards-v2">
                        <div className="dev-card-v2 dev-card-pink">
                            <div className="dev-card-v2-icon pink"><img src="/icons/baby-dev.png" alt="" /></div>
                            <div className="dev-card-v2-text">
                                <div className="dev-card-v2-title">Bé đang phát triển</div>
                                <div className="dev-card-v2-full">{wd.babyDevelopment || 'Chưa có thông tin.'}</div>
                            </div>
                        </div>
                        <div className="dev-card-v2 dev-card-purple">
                            <div className="dev-card-v2-icon purple"><img src="/icons/mom-changes.png" alt="" /></div>
                            <div className="dev-card-v2-text">
                                <div className="dev-card-v2-title">Thay đổi ở mẹ</div>
                                <div className="dev-card-v2-full">{wd.maternalChanges || 'Chưa có thông tin.'}</div>
                            </div>
                        </div>
                        <div className="dev-card-v2 dev-card-yellow">
                            <div className="dev-card-v2-icon yellow"><img src="/icons/tips-bulb.png" alt="" /></div>
                            <div className="dev-card-v2-text">
                                <div className="dev-card-v2-title">Lời khuyên</div>
                                <div className="dev-card-v2-full">{wd.tips || 'Chưa có lời khuyên.'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Nhật ký bé yêu */}
                    <div className="section">
                        <div className="section-header">
                            <span className="section-title"><img src="/icons/diary.png" alt="" style={{width:20,height:20,objectFit:'cover',borderRadius:'50%',verticalAlign:'middle',marginRight:4}} /> Nhật ký bé yêu</span>
                            {selectedWeek === weekNum && !babyDiary[selectedWeek] && (
                                <button className="section-more" onClick={() => { setShowDiaryForm(!showDiaryForm); setDiaryInput({ weight: '', note: '' }) }}>{showDiaryForm ? '✕ Hủy' : '+ Ghi chép'}</button>
                            )}
                        </div>

                        {/* Form nhập */}
                        {showDiaryForm && selectedWeek === weekNum && (
                            <div className="add-apt-form">
                                <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--primary)' }}>Ghi chép tuần {selectedWeek}</div>
                                <input placeholder="Cân nặng bé từ siêu âm (g) — VD: 760" value={diaryInput.weight} onChange={e => setDiaryInput({ ...diaryInput, weight: e.target.value })} />
                                <textarea placeholder="Ghi chú của mẹ... VD: Hôm nay bé đạp nhiều lắm 💕" value={diaryInput.note} onChange={e => setDiaryInput({ ...diaryInput, note: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid rgba(0,0,0,.08)', borderRadius: 10, fontFamily: 'Nunito,sans-serif', fontSize: 14, resize: 'vertical', minHeight: 60, boxSizing: 'border-box' }} />
                                <button className="submit-btn" onClick={() => {
                                    if (!diaryInput.weight && !diaryInput.note) return
                                    setBabyDiary(prev => ({ ...prev, [selectedWeek]: { ...diaryInput, date: new Date().toLocaleDateString('vi') } }))
                                    setDiaryInput({ weight: '', note: '' })
                                    setShowDiaryForm(false)
                                    showToast('Đã lưu nhật ký!')
                                }}>Lưu nhật ký</button>
                            </div>
                        )}

                        {/* Hiển nhật ký đã ghi */}
                        {babyDiary[selectedWeek] ? (
                            <div className="diary-entry">
                                <div className="diary-date">{babyDiary[selectedWeek].date}</div>
                                {babyDiary[selectedWeek].weight && (
                                    <div className="diary-weight">
                                        <span>Cân nặng bé: <strong>{babyDiary[selectedWeek].weight}g</strong></span>
                                        <span className="diary-ref">Tiêu chuẩn: {wd.weight}</span>
                                    </div>
                                )}
                                {babyDiary[selectedWeek].note && <div className="diary-note">{babyDiary[selectedWeek].note}</div>}
                                <button className="diary-edit" onClick={() => {
                                    setDiaryInput(babyDiary[selectedWeek])
                                    setBabyDiary(prev => { const n = { ...prev }; delete n[selectedWeek]; return n })
                                    setShowDiaryForm(true)
                                }}>✏️ Sửa</button>
                            </div>
                        ) : !showDiaryForm && (
                            <div className="diary-empty">
                                {selectedWeek === weekNum
                                    ? <>Chưa có ghi chép tuần này. Nhấn <strong>"+ Ghi chép"</strong> để lưu lại nhé!</>
                                    : selectedWeek < weekNum
                                        ? <>Tuần {selectedWeek} không có ghi chép</>
                                        : <>Tuần {selectedWeek} chưa đến</>
                                }
                            </div>
                        )}
                    </div>

                    {/* Cột mốc đáng nhớ */}
                    <div className="section">
                        <div className="section-header">
                            <span className="section-title"><img src="/icons/milestone.png" alt="" style={{width:20,height:20,objectFit:'cover',borderRadius:'50%',verticalAlign:'middle',marginRight:4}} /> Cột mốc đáng nhớ</span>
                        </div>
                        {[
                            { key: 'first_heartbeat', icon: '/icons/heartbeat.png', label: 'Nghe tim thai lần đầu' },
                            { key: 'first_ultrasound', icon: '/icons/nav-calendar.png', label: 'Siêu âm lần đầu' },
                            { key: 'gender_reveal', icon: '/icons/nav-baby.png', label: 'Biết giới tính bé' },
                            { key: 'first_kick', icon: '/icons/nav-kick.png', label: 'Lần đầu cảm nhận thai máy' },
                            { key: 'baby_name', icon: '/icons/milestone.png', label: 'Đặt tên cho bé' },
                            { key: 'nursery_ready', icon: '/icons/nav-home.png', label: 'Chuẩn bị phòng cho bé' },
                            { key: 'hospital_bag', icon: '/icons/action-meds.png', label: 'Chuẩn bị giỏ đồ đi sinh' },
                            { key: 'maternity_photo', icon: '/icons/milestone.png', label: 'Chụp ảnh bầu' },
                        ].map(m => (
                            <div className={`milestone-item ${milestones[m.key] ? 'done' : ''}`} key={m.key}
                                onClick={() => setMilestones(prev => ({ ...prev, [m.key]: !prev[m.key] }))}>
                                <span className="milestone-check">{milestones[m.key] ? '✅' : '⬜'}</span>
                                <img src={m.icon} alt="" style={{width:24,height:24,objectFit:'cover',borderRadius:'50%'}} />
                                <span className="milestone-label">{m.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Nút xem bảng + biểu đồ */}
                    <button className="view-table-btn" style={{ margin: '0 16px 8px', width: 'calc(100% - 32px)' }} onClick={() => setSubPage('fetal-table')}>Xem bảng chỉ số 40 tuần</button>
                    {Object.keys(babyDiary).some(w => babyDiary[w].weight) && (
                        <button className="view-table-btn" style={{ margin: '0 16px 12px', width: 'calc(100% - 32px)' }} onClick={() => setSubPage('growth-chart')}>
                            Xem biểu đồ tăng trưởng của bé
                        </button>
                    )}
                </div>
            )}

            {/* ─── GROWTH CHART SUB-PAGE ─── */}
            {tab === 'baby' && subPage === 'growth-chart' && (() => {
                const loggedWeeks = Object.keys(babyDiary).map(Number).filter(w => babyDiary[w].weight).sort((a, b) => a - b)
                const allWeeks = [...new Set([...loggedWeeks, ...Object.keys(FETAL_DATA).map(Number)])].filter(w => w >= 8 && w <= 40).sort((a, b) => a - b)
                const maxW = Math.max(...allWeeks.map(w => Math.max(parseFloat(babyDiary[w]?.weight) || 0, parseFloat(FETAL_DATA[w]?.weight) || 0)), 1)
                return (
                    <div className="page-enter">
                        <div className="section">
                            <div className="section-header">
                                <span className="section-title">📈 Biểu đồ tăng trưởng</span>
                            </div>
                            <div className="chart-legend">
                                <span className="legend-item"><span className="legend-dot standard"></span> Tiêu chuẩn WHO</span>
                                <span className="legend-item"><span className="legend-dot actual"></span> Bé nhà bạn</span>
                            </div>
                            <div className="growth-chart">
                                {allWeeks.filter(w => FETAL_DATA[w]?.weight && FETAL_DATA[w]?.weight !== '-').map(w => {
                                    const std = parseFloat(FETAL_DATA[w]?.weight) || 0
                                    const actual = parseFloat(babyDiary[w]?.weight) || 0
                                    const stdPct = (std / maxW * 100)
                                    const actPct = actual ? (actual / maxW * 100) : 0
                                    const diff = actual ? Math.abs(actual - std) / std * 100 : 0
                                    const status = !actual ? 'none' : diff <= 15 ? 'good' : 'warn'
                                    return (
                                        <div className={`chart-row ${w === weekNum ? 'current' : ''}`} key={w}>
                                            <div className="chart-week">T{w}</div>
                                            <div className="chart-bars">
                                                <div className="chart-bar standard" style={{ width: `${stdPct}%` }}>
                                                    <span className="chart-val">{FETAL_DATA[w]?.weight}</span>
                                                </div>
                                                {actual > 0 && (
                                                    <div className={`chart-bar actual ${status}`} style={{ width: `${actPct}%` }}>
                                                        <span className="chart-val">{actual}g</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="apt-tooltip-label" style={{ textAlign: 'center', marginTop: 8 }}>Nguồn tiêu chuẩn: WHO / INTERGROWTH-21st</div>
                        </div>
                    </div>
                )
            })()}

            {/* ─── FETAL TABLE SUB-PAGE ─── */}
            {tab === 'baby' && subPage === 'fetal-table' && (
                <div className="page-enter">
                    <div className="section">
                        <div className="section-header">
                            <span className="section-title">📊 Bảng chỉ số thai nhi tiêu chuẩn</span>
                        </div>
                        <div className="apt-tooltip-label">Nguồn: WHO / INTERGROWTH-21st • Chỉ là tham khảo</div>
                        <div className="fetal-table-scroll">
                            <table className="fetal-table">
                                <thead>
                                    <tr><th>Tuần</th><th>CN (g)</th><th>CD (cm)</th><th>BPD</th><th>FL</th><th>AC</th><th>HC</th></tr>
                                </thead>
                                <tbody>
                                    {Object.keys(FETAL_DATA).map(Number).sort((a, b) => a - b).filter(w => FETAL_DATA[w].bpd && FETAL_DATA[w].bpd !== '-').map(w => {
                                        const d = FETAL_DATA[w]
                                        return (
                                            <tr key={w} className={w === weekNum ? 'current-row' : ''} onClick={() => { setSelectedWeek(w); setSubPage(null) }}>
                                                <td className="fw">{w}</td>
                                                <td>{d.weight}</td>
                                                <td>{d.length}</td>
                                                <td>{d.bpd}</td>
                                                <td>{d.fl}</td>
                                                <td>{d.ac}</td>
                                                <td>{d.hc}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}


            {/* ─── KICK COUNTER ─── */}
            {tab === 'kick' && (
                <div className="page-enter kick-page">
                    <div className={`kick-num ${kickBump ? 'bump' : ''}`}>{kickCount}</div>
                    <div className="kick-label">lần bé đạp</div>
                    <div className="kick-timer">{fmtTime(kickTimer)}</div>

                    <div className="kick-btn-wrap">
                        <svg className="kick-progress-ring" width={146} height={146}>
                            <circle cx={73} cy={73} r={67} fill="none" strokeWidth={5} className="bg" />
                            <circle cx={73} cy={73} r={67} fill="none" strokeWidth={5} className="fg"
                                strokeDasharray={2 * Math.PI * 67} strokeDashoffset={2 * Math.PI * 67 - (2 * Math.PI * 67 * Math.min(kickCount, 10) / 10)} />
                        </svg>
                        <button className="kick-big-btn" ref={kickRef} onClick={doKick}>
                            <img src="/illustrations/baby-kick.png" alt="" style={{width:80,height:80,objectFit:'cover',pointerEvents:'none',borderRadius:'50%'}} onError={e => { e.target.style.display='none'; e.target.parentNode.append(document.createTextNode('👶')) }} />
                        </button>
                    </div>

                    <div className="kick-target">{kickCount}/10 cử động (mục tiêu 2 giờ)</div>
                    {kickCount > 0 && <div className="kick-msg">{kickCount >= 10 ? 'Tuyệt vời! Bé rất khỏe mạnh!' : `Thêm ${10 - kickCount} cú đạp nữa!`}</div>}

                    <div className="kick-actions">
                        {kickCount > 0 && <button className="kick-btn-sm kick-btn-undo" onClick={undoKick}>Bỏ lần cuối</button>}
                        {kickRunning && <button className="kick-btn-sm kick-btn-end" onClick={endKickSession}>Kết thúc phiên</button>}
                    </div>

                    <div className="kick-hint">
                        Bấm vào em bé mỗi khi bé đạp.<br />
                        <b>Chuẩn:</b> 10 cử động trong 2 giờ là bình thường.<br />
                        Nếu bé đạp ít hơn bình thường, hãy liên hệ bác sĩ.
                    </div>

                    {kickHistory.length > 0 && (
                        <div className="kick-history">
                            <h4><img src="/icons/nav-kick.png" alt="" style={{width:18,height:18,objectFit:'cover',borderRadius:'50%',verticalAlign:'middle',marginRight:4}} /> Lịch sử đếm hôm nay</h4>
                            {kickHistory.map((h, i) => (
                                <div className="kick-history-item" key={i}>
                                    <span className="kick-h-time">{h.time}</span>
                                    <span className="kick-h-count">{h.count} cử động • {fmtTime(h.duration)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ─── KNOWLEDGE ─── */}
            {tab === 'knowledge' && (
                <div className="page-enter">
                    <div className="search-bar">
                        <span><img src="/icons/nav-book.png" alt="" style={{width:18,height:18,objectFit:'cover',borderRadius:'50%'}} /></span>
                        <input placeholder="Tìm kiếm bài viết..." value={searchQ} onChange={e => setSearchQ(e.target.value)} />
                    </div>
                    <div className="category-chips">
                        {['Tuần này', 'Tất cả', 'Đã lưu', 'Dinh dưỡng', 'Sức khỏe', 'Thai giáo', 'Chuẩn bị sinh'].map(c => {
                            const key = c === 'Tuần này' ? 'week' : c === 'Tất cả' ? 'all' : c === 'Đã lưu' ? 'saved' : c.toLowerCase()
                            return <button key={c} className={`cat-chip ${activeFilter === key ? 'active' : ''}`} onClick={() => setActiveFilter(key)}>{c}</button>
                        })}
                    </div>
                    {filteredArticles.length === 0 && (
                        <div className="empty-state">Không có bài viết phù hợp.</div>
                    )}
                    {filteredArticles.map(a => (
                        <div className="article-card" key={a.id} style={{ margin: '0 16px 8px', cursor: 'pointer' }}
                            onClick={() => setSelectedArticle(a)}>
                            <div className="article-card-top">
                                <span className="article-tag">{a.category}</span>
                                <button className={`bookmark-btn ${bookmarks[a.id] ? 'active' : ''}`} onClick={e => { e.stopPropagation(); setBookmarks(p => ({ ...p, [a.id]: !p[a.id] })) }}>
                                    {bookmarks[a.id] ? '❤️' : '🩶'}
                                </button>
                            </div>
                            <div className="article-title">{a.title}</div>
                            <div className="article-desc">{a.summary}</div>
                            <div className="article-meta">{a.readTimeMinutes || a.readTime || 5} phút đọc</div>
                        </div>
                    ))}
                </div>
            )}

            {/* ─── ARTICLE DETAIL ─── */}
            {selectedArticle && (
                <div className="article-overlay" onClick={() => setSelectedArticle(null)}>
                    <div className="article-detail" onClick={e => e.stopPropagation()}>
                        <button className="article-close" onClick={() => setSelectedArticle(null)}>✕</button>
                        <span className="article-tag" style={{ marginBottom: 8, display: 'inline-block' }}>{selectedArticle.category}</span>
                        <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)', margin: '0 0 8px' }}>{selectedArticle.title}</h2>
                        <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 12 }}>{selectedArticle.readTimeMinutes || 5} phút đọc</div>
                        <div style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)', fontWeight: 600 }}>
                            {selectedArticle.content || selectedArticle.summary}
                            {!selectedArticle.content && (
                                <p style={{ marginTop: 12, fontStyle: 'italic', color: 'var(--text-light)' }}>Nội dung đầy đủ sẽ được cập nhật trong phiên bản tới.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ─── MEDS ─── */}
            {tab === 'meds' && !subPage && (
                <div className="page-enter">
                    {medTotal > 0 && (
                        <div className="med-progress" style={{ '--med-pct': `${(medTaken / medTotal * 100)}%` }}>
                            <div className="med-progress-ring">
                                <div className="med-progress-inner">{medTaken}/{medTotal}</div>
                            </div>
                            <div>
                                <div className="med-progress-title">Hôm nay: {medTaken}/{medTotal} thuốc</div>
                                <div className="med-progress-streak">Uống đều mỗi ngày nhé!</div>
                            </div>
                        </div>
                    )}

                    {meds.map(m => (
                        <div className={`med-card ${m.taken ? 'taken' : ''}`} key={m.id}>
                            <div className="med-icon"><img src="/icons/nav-pill.png" alt="" style={{width:32,height:32,objectFit:'cover',borderRadius:'50%'}} /></div>
                            <div className="med-info">
                                <div className="med-name">{m.name}</div>
                                {m.nameEn && <div className="med-name-en">{m.nameEn}</div>}
                                <div className="med-dose">{m.dose} • {m.freq}</div>
                                <div className="med-time">{m.time}</div>
                            </div>
                            <button className={`med-action ${m.taken ? 'done' : 'pending'}`}
                                onClick={() => toggleMed(m.id)}>
                                {m.taken ? '✅ Xong' : 'Uống'}
                            </button>
                            <button className="med-delete" onClick={() => deleteMed(m.id)} title="Xóa thuốc">🗑️</button>
                        </div>
                    ))}

                    {meds.length === 0 && !showAddMed && (
                        <div className="med-empty-state">
                            <div className="med-empty-icon"><img src="/icons/nav-pill.png" alt="" style={{width:160,height:160,objectFit:'cover',borderRadius:'50%'}} /></div>
                            <div className="med-empty-title">Chưa có thuốc nào</div>
                            <div className="med-empty-desc">Thêm thuốc bạn đang uống để theo dõi mỗi ngày</div>
                            <button className="submit-btn" onClick={() => setShowAddMed(true)}>+ Thêm thuốc đầu tiên</button>
                        </div>
                    )}

                    {showAddMed && (
                        <div className="add-med-form">
                            <input placeholder="Tên thuốc (VD: DHA, Omega-3...)" value={newMed.name} onChange={e => setNewMed({ ...newMed, name: e.target.value })} />
                            <div className="add-med-row">
                                <input placeholder="Liều (VD: 500mg)" value={newMed.dose} onChange={e => setNewMed({ ...newMed, dose: e.target.value })} />
                                <select value={newMed.times.length} onChange={e => {
                                    const count = Number(e.target.value)
                                    const defaults = ['08:00', '14:00', '20:00']
                                    setNewMed({ ...newMed, times: Array.from({ length: count }, (_, i) => newMed.times[i] || defaults[i] || '08:00') })
                                }} style={{ flex: 1, padding: '10px 12px', border: '1.5px solid rgba(0,0,0,.08)', borderRadius: 10, fontFamily: 'Nunito,sans-serif', fontSize: 14, fontWeight: 700 }}>
                                    <option value={1}>1 lần/ngày</option>
                                    <option value={2}>2 lần/ngày</option>
                                    <option value={3}>3 lần/ngày</option>
                                </select>
                            </div>
                            <div className="add-med-row">
                                {newMed.times.map((t, i) => (
                                    <input key={i} type="time" value={t} onChange={e => {
                                        const updated = [...newMed.times]; updated[i] = e.target.value
                                        setNewMed({ ...newMed, times: updated })
                                    }} style={{ flex: 1 }} />
                                ))}
                            </div>
                            <button className="submit-btn" disabled={!newMed.name.trim()} onClick={addMed}>Thêm thuốc</button>
                        </div>
                    )}

                    {/* Supplement Recommendations */}
                    <div className="supp-rec-section">
                        <div className="supp-rec-header">
                            <span className="supp-rec-title"><img src="/icons/tips-bulb.png" alt="" style={{width:20,height:20,objectFit:'cover',borderRadius:'50%',verticalAlign:'middle',marginRight:4}} /> Bạn có thể cần bổ sung — TCN {trimester}</span>
                            <span className="supp-rec-source">Nguồn: WHO / BYT VN • Tham khảo ý kiến bác sĩ</span>
                        </div>
                        {suppRecs.map((s, i) => (
                            <div className="supp-rec-card" key={i}>
                                <div className="supp-rec-icon"><img src={s.icon} alt="" style={{width:32,height:32,objectFit:'cover',borderRadius:'50%'}} /></div>
                                <div className="supp-rec-info">
                                    <div className="supp-rec-name">{s.name} <span className="supp-rec-dose">{s.dose}</span></div>
                                    <div className="supp-rec-reason">{s.reason}</div>
                                    {SUPPLEMENT_DETAILS[s.name] && <span className="supp-detail-link" onClick={() => setSubPage({ type: 'supp-detail', name: s.name })}>Xem thêm →</span>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="med-tips">
                        <div className="tip-title"><img src="/icons/tips-bulb.png" alt="" style={{width:20,height:20,objectFit:'cover',borderRadius:'50%',verticalAlign:'middle',marginRight:4}} /> Mẹo uống thuốc thai kỳ</div>
                        <p>
                            • <b>Sắt:</b> uống lúc bụng đói, tránh uống cùng canxi/sữa<br />
                            • <b>Canxi:</b> chia 2 lần/ngày, không uống cùng sắt<br />
                            • <b>Acid Folic:</b> uống buổi sáng, quan trọng 3 tháng đầu<br />
                            • <b>DHA:</b> uống sau ăn để hấp thu tốt hơn
                        </p>
                    </div>

                    {meds.length > 0 && <button className="fab-btn" onClick={() => setShowAddMed(!showAddMed)}>
                        {showAddMed ? '✕' : '+'}
                    </button>}
                </div>
            )}

            {/* ─── SUPPLEMENT DETAIL ─── */}
            {tab === 'meds' && subPage?.type === 'supp-detail' && SUPPLEMENT_DETAILS[subPage.name] && (
                <div className="page-enter">
                    <div className="section">
                        <div className="section-header">
                            <span className="section-title">{SUPPLEMENT_DETAILS[subPage.name].title}</span>
                        </div>
                        {SUPPLEMENT_DETAILS[subPage.name].sections.map((sec, i) => (
                            <div className="dev-card" key={i} style={{ borderLeft: '3px solid var(--primary)' }}>
                                <div className="dev-card-header">{sec.h}</div>
                                <p>{sec.t}</p>
                            </div>
                        ))}
                        <div className="apt-tooltip-label" style={{ textAlign: 'center', marginTop: 8 }}>Nguồn: WHO / BYT Việt Nam • Tham khảo ý kiến bác sĩ</div>
                    </div>
                </div>
            )}
            {/* ─── SETTINGS ─── */}
            {tab === 'settings' && (
                <div className="page-enter">
                    <div className="section">
                        <div className="section-header"><span className="section-title"><img src="/icons/nav-home.png" alt="" style={{width:20,height:20,objectFit:'cover',borderRadius:'50%',verticalAlign:'middle',marginRight:4}} /> Hồ sơ</span></div>
                        <div className="settings-row">
                            <span>Tên gọi</span>
                            <input
                                className="settings-name-input"
                                value={userName}
                                onChange={e => {
                                    const newName = e.target.value
                                    const updated = { ...userConfig, name: newName }
                                    setUserConfig(updated)
                                    localStorage.setItem('ponny_onboarding', JSON.stringify(updated))
                                }}
                                placeholder="Nhập tên..."
                            />
                        </div>
                    </div>
                    <div className="section">
                        <div className="section-header"><span className="section-title"><img src="/icons/nav-settings.png" alt="" style={{width:20,height:20,objectFit:'cover',borderRadius:'50%',verticalAlign:'middle',marginRight:4}} /> Giao diện</span></div>
                        <div className="settings-row" onClick={toggleTheme}>
                            <span>{theme === 'pink' ? 'Pink Mode' : 'Blue Mode'}</span>
                            <span className="reminder-action-text">Đổi →</span>
                        </div>
                    </div>
                    <div className="section">
                        <div className="section-header"><span className="section-title"><img src="/icons/nav-baby.png" alt="" style={{width:20,height:20,objectFit:'cover',borderRadius:'50%',verticalAlign:'middle',marginRight:4}} /> Thai kỳ</span></div>
                        <div className="settings-row">
                            <span>Tuần thai hiện tại</span>
                            <span style={{ fontWeight: 800 }}>Tuần {weekNum}, Ngày {dayNum}</span>
                        </div>
                        <div className="settings-row">
                            <span>Ngày dự sinh</span>
                            <span style={{ fontWeight: 800 }}>{pregnancy.edd ? new Date(pregnancy.edd).toLocaleDateString('vi') : '—'}</span>
                        </div>
                    </div>
                    <div className="section">
                        <div className="section-header"><span className="section-title"><img src="/icons/tips-bulb.png" alt="" style={{width:20,height:20,objectFit:'cover',borderRadius:'50%',verticalAlign:'middle',marginRight:4}} /> Thông tin</span></div>
                        <div className="settings-row">
                            <span>Phiên bản</span>
                            <span>MVP v2.0</span>
                        </div>
                        <div className="settings-row">
                            <span>Dữ liệu y tế</span>
                            <span style={{ fontSize: 12 }}>WHO, Bộ Y tế VN</span>
                        </div>
                    </div>
                    <div className="section">
                        <button className="logout-btn" onClick={() => {
                            localStorage.clear()
                            setOnboarded(false)
                            setUserConfig(null)
                            setTab('home')
                            setSubPage(null)
                        }}>🚪 Đăng xuất</button>
                    </div>
                </div>
            )}

            {/* ─── CHAT FLOATING WIDGET ─── */}
            {!chatOpen && (
                <button className="chat-fab" onClick={() => { setChatAttachMenu(false); setChatOpen(true) }}>
                    <img src="/icons/nav-chat.png" alt="Chat" className="chat-fab-icon" />
                </button>
            )}
            {chatOpen && (
                <div className="chat-popup">
                    <div className="chat-popup-header">
                        <img src="/icons/nav-chat.png" alt="" style={{width:28,height:28,objectFit:'cover',borderRadius:'50%'}} />
                        <span className="chat-popup-title">Ponny AI</span>
                        <button className="chat-clear-btn" onClick={() => { setChatMessages([]); localStorage.removeItem('ponny_chat_history') }} title="Cuộc trò chuyện mới">🗑️</button>
                        <button className="chat-popup-close" onClick={() => setChatOpen(false)}>&times;</button>
                    </div>
                    <div className="chat-messages">
                        {chatMessages.length === 0 && (
                            <div className="chat-welcome">
                                <img src="/icons/nav-chat.png" alt="" style={{width:64,height:64,objectFit:'cover',borderRadius:'50%',margin:'0 auto 10px',display:'block'}} />
                                <div className="chat-welcome-title">Xin chào {userName}!</div>
                                <div className="chat-welcome-desc">Mình là Ponny — trợ lý AI thai kỳ.  Hỏi mình bất cứ điều gì nhé!</div>
                                <div className="chat-suggestions">
                                    {['Bé tuần này ra sao?', 'Tôi nên ăn gì?', 'Nhắc uống thuốc'].map(s => (
                                        <button key={s} className="chat-suggestion" onClick={() => { setChatInput(s); }}>{s}</button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {chatMessages.map((m, i) => (
                            <div key={i} className={`chat-bubble ${m.role}`}>
                                {m.role === 'assistant' && <img src="/icons/nav-chat.png" alt="" className="chat-avatar" />}
                                <div className="chat-bubble-content">
                                    {m.image && <img src={m.image} alt="" className="chat-bubble-img" />}
                                    {m.role === 'assistant' ? <div dangerouslySetInnerHTML={{__html: renderMarkdown(m.content)}} /> : m.content}
                                </div>
                            </div>
                        ))}
                        {chatLoading && (
                            <div className="chat-bubble assistant">
                                <img src="/icons/nav-chat.png" alt="" className="chat-avatar" />
                                <div className="chat-bubble-content chat-typing">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                    {chatImage && (
                        <div className="chat-image-preview">
                            <img src={chatImage.preview} alt="" />
                            <button className="chat-image-remove" onClick={() => setChatImage(null)}>✕</button>
                        </div>
                    )}
                    <div className="chat-input-bar">
                        <input type="file" accept="image/*" ref={chatFileRef} style={{display:'none'}} onChange={handleChatImage} />
                        <div className="chat-attach-wrap">
                            <button className="chat-attach-btn" onClick={() => setChatAttachMenu(!chatAttachMenu)}>＋</button>
                            {chatAttachMenu && (
                                <div className="chat-attach-menu">
                                    <button onClick={() => { chatFileRef.current?.setAttribute('capture','environment'); chatFileRef.current?.click(); setTimeout(() => chatFileRef.current?.removeAttribute('capture'), 500); setChatAttachMenu(false) }}><img src="/icons/icon-camera.png" alt="" className="chat-menu-icon" /> Chụp ảnh</button>
                                    <button onClick={() => { chatFileRef.current?.removeAttribute('capture'); chatFileRef.current?.click(); setChatAttachMenu(false) }}><img src="/icons/icon-gallery.png" alt="" className="chat-menu-icon" /> Tải ảnh</button>
                                </div>
                            )}
                        </div>
                        <input
                            className="chat-input"
                            placeholder="Hỏi Ponny bất cứ điều gì..."
                            value={chatInput}
                            onChange={e => setChatInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendChat()}
                        />
                        <button className="chat-send-btn" onClick={sendChat} disabled={chatLoading || (!chatInput.trim() && !chatImage)}>Gửi</button>
                    </div>
                    <div className="chat-disclaimer">Câu trả lời của AI chỉ mang tính chất tham khảo, không thay thế bác sĩ</div>
                </div>
            )}

            {/* ─── NAV (Swipeable) ─── */}
            <nav className="nav nav-scroll">
                {[
                    { id: 'home', icon: '/icons/nav-home.png', text: 'Trang chủ' },
                    { id: 'baby', icon: '/icons/nav-baby.png', text: 'Bé yêu' },
                    { id: 'appointments', icon: '/icons/nav-calendar.png', text: 'Tái khám' },
                    { id: 'knowledge', icon: '/icons/nav-book.png', text: 'Kiến thức' },
                    { id: 'meds', icon: '/icons/nav-pill.png', text: 'Thuốc' },
                    { id: 'kick', icon: '/icons/nav-kick.png', text: 'Đếm đạp' },
                    { id: 'settings', icon: '/icons/nav-settings.png', text: 'Cài đặt' },
                ].map(n => (
                    <button key={n.id} className={`nav-btn ${tab === n.id ? 'active' : ''}`} onClick={() => goTab(n.id)}>
                        <img className="nav-icon-img" src={n.icon} alt={n.text} />
                        <span className="nav-text">{n.text}</span>
                    </button>
                ))}
            </nav>

            <Toast msg={toast} onClear={clearToast} />
        </div>
    )
}
