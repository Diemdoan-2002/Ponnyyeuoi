export const SUPPLEMENT_RECS = {
  trimester1: [
    { name: 'Acid Folic', dose: '400-800mcg/ngày', reason: 'Ngăn ngừa dị tật ống thần kinh (NTDs)', source: 'WHO (2012), Bộ Y tế VN' },
    { name: 'Sắt', dose: '30-60mg/ngày', reason: 'Phòng thiếu máu, hỗ trợ tạo hồng cầu', source: 'WHO Daily Iron Supplementation Guideline' },
    { name: 'Vitamin D', dose: '600-1000 IU/ngày', reason: 'Hấp thu canxi, phát triển xương thai nhi', source: 'ACOG Committee Opinion No. 495' },
  ],
  trimester2: [
    { name: 'Sắt', dose: '60mg/ngày', reason: 'Nhu cầu tăng do thể tích máu tăng 50%', source: 'WHO Daily Iron Supplementation Guideline' },
    { name: 'Canxi', dose: '1000mg/ngày (chia 2 lần)', reason: 'Thai nhi phát triển xương, phòng tiền sản giật', source: 'WHO Calcium Supplementation Guideline (2018)' },
    { name: 'DHA', dose: '200-300mg/ngày', reason: 'Phát triển não bộ & thị giác thai nhi', source: 'FAO/WHO Expert Consultation (2010)' },
    { name: 'Acid Folic', dose: '400mcg/ngày', reason: 'Tiếp tục duy trì suốt thai kỳ', source: 'WHO (2012)' },
  ],
  trimester3: [
    { name: 'Sắt', dose: '60mg/ngày', reason: 'Dự trữ sắt cho bé, chuẩn bị mất máu khi sinh', source: 'WHO Daily Iron Supplementation Guideline' },
    { name: 'Canxi', dose: '1200mg/ngày', reason: 'Bé phát triển xương nhanh, phòng loãng xương mẹ', source: 'WHO Calcium Supplementation (2018)' },
    { name: 'DHA', dose: '300mg/ngày', reason: 'Giai đoạn não bộ phát triển mạnh nhất', source: 'FAO/WHO Expert Consultation (2010)' },
    { name: 'Vitamin K', dose: 'Theo chỉ định BS', reason: 'Phòng xuất huyết chu sinh (nếu chỉ định)', source: 'AAP Policy Statement (2003)' },
  ]
};

export const SUPPLEMENT_DETAILS = {
  'Sắt': {
    title: 'Bổ sung Sắt trong thai kỳ', sections: [
      { h: 'Tại sao cần sắt?', t: 'Khi mang thai, lượng máu trong cơ thể mẹ tăng 50%. Sắt giúp tạo hemoglobin vận chuyển oxy cho bé. Thiếu sắt gây thiếu máu, mệt mỏi, tăng nguy cơ sinh non và bé nhẹ cân.' },
      { h: 'Thực phẩm giàu sắt', t: '🥩 Thịt bò, gan gà • 🥦 Rau biển (rong biển), rau cầi bó xôi • 🫘 Đậu lăng, đậu đen • 🪶 Hạt bí, hạt điều' },
      { h: 'Uống lúc nào?', t: 'Tốt nhất uống lúc bụng đói hoặc trước bữa ăn 1 giờ. Uống kèm vitamin C (để tăng hấp thu). Không uống cùng canxi, trà, cà phê (giảm hấp thu).' },
      { h: 'Lưu ý', t: 'Sắt có thể gây táo bón — uống nhiều nước và ăn nhiều chất xơ. Phân có thể đen — đây là bình thường.' }
    ]
  },
  'Canxi': {
    title: 'Bổ sung Canxi trong thai kỳ', sections: [
      { h: 'Tại sao cần canxi?', t: 'Bé cần canxi để phát triển xương và răng. Nếu mẹ không bổ sung đủ, cơ thể sẽ lấy canxi từ xương mẹ, gây loãng xương. Canxi còn giúp phòng tiền sản giật.' },
      { h: 'Thực phẩm giàu canxi', t: '🥛 Sữa, sữa chua, phô mai • 🥦 Rau cải xanh, cải bó xôi • 🐟 Cá mòi, cá hồi • 🥜 Đậu nành, đậu phụ' },
      { h: 'Uống lúc nào?', t: 'Chia 2 lần/ngày (sáng và tối) để hấp thu tốt hơn. Cách sắt ít nhất 2 giờ. Uống sau bữa ăn.' },
      { h: 'Lưu ý', t: 'Quá liều canxi (>2500mg) có thể gây sỏi thận. Luôn uống kèm vitamin D để tăng hấp thu.' }
    ]
  },
  'DHA': {
    title: 'Bổ sung DHA trong thai kỳ', sections: [
      { h: 'Tại sao cần DHA?', t: 'DHA (Omega-3) là thành phần chính của não và võng mạc. Bổ sung DHA giúp bé phát triển trí tuệ và thị giác tốt hơn.' },
      { h: 'Thực phẩm giàu DHA', t: '🐟 Cá hồi, cá thu, cá ngừ • 🥚 Trứng gà (loại giàu omega-3) • 🪶 Hạt chia, hạt lanh, óc chó' },
      { h: 'Uống lúc nào?', t: 'Uống trong hoặc sau bữa ăn có chất béo để hấp thu tốt. Bất kỳ lúc nào trong ngày.' },
      { h: 'Lưu ý', t: 'Chọn DHA từ dầu cá biển sâu (không phải dầu gan cá). Hạn chế cá lớn (cá kiếm, cá ngừ đại dương) do chứa thủy ngân.' }
    ]
  },
  'Acid Folic': {
    title: 'Bổ sung Acid Folic trong thai kỳ', sections: [
      { h: 'Tại sao cần acid folic?', t: 'Acid folic ngăn ngừa dị tật ống thần kinh (nứt đốt sống, não vô). Quan trọng nhất trong 12 tuần đầu nhưng nên duy trì suốt thai kỳ.' },
      { h: 'Thực phẩm giàu folate', t: '🥦 Rau lá xanh đậm (cải bó xôi, cải xoăn) • 🫘 Đậu lăng, đậu xanh • 🍊 Cam, bưởi • 🥚 Trứng' },
      { h: 'Uống lúc nào?', t: 'Bất kỳ lúc nào trong ngày, tốt nhất uống cùng lúc mỗi ngày để tạo thói quen.' },
      { h: 'Lưu ý', t: 'Nếu có tiền sử NTDs, bác sĩ có thể kê liều cao hơn (4mg). Acid folic rất an toàn, thừa sẽ bài tiết qua nước tiểu.' }
    ]
  },
  'Vitamin D': {
    title: 'Bổ sung Vitamin D trong thai kỳ', sections: [
      { h: 'Tại sao cần vitamin D?', t: 'Vitamin D giúp hấp thu canxi, phát triển xương thai nhi, và hỗ trợ hệ miễn dịch.' },
      { h: 'Nguồn tự nhiên', t: '☀️ Tắm nắng 15-20 phút/ngày (trước 10h sáng) • 🐟 Cá hồi, cá thu • 🥚 Trứng • 🍄 Nấm' },
      { h: 'Uống lúc nào?', t: 'Uống cùng bữa ăn có chất béo. Có thể uống cùng canxi.' },
      { h: 'Lưu ý', t: 'Nhiều mẹ bầu Việt Nam thiếu vitamin D do ít tiếp xúc ánh sáng. Hãy kiểm tra nồng độ 25(OH)D nếu có điều kiện.' }
    ]
  },
  'Vitamin K': {
    title: 'Vitamin K trong thai kỳ', sections: [
      { h: 'Tại sao?', t: 'Vitamin K giúp đông máu. Bé sinh ra thường được tiêm vitamin K để phòng xuất huyết.' },
      { h: 'Nguồn thực phẩm', t: '🥦 Rau lá xanh, bông cải xanh • 🪴 Dầu ô liu, dầu đậu nành' },
      { h: 'Lưu ý', t: 'Chỉ bổ sung khi có chỉ định của bác sĩ.' }
    ]
  }
};

export const FALLBACK_ARTICLES = [
  { id: 'fb1', title: '10 thực phẩm giàu sắt cho mẹ bầu', summary: 'Bổ sung sắt đúng cách giúp ngăn thiếu máu thai kỳ.', category: 'Dinh dưỡng', readTimeMinutes: 5 },
  { id: 'fb2', title: 'Giải mã chỉ số siêu âm thai nhi', summary: 'Hiểu các chỉ số BPD, FL, AC, EFW trên phiếu siêu âm.', category: 'Sức khỏe', readTimeMinutes: 7 },
  { id: 'fb3', title: 'Ốm nghén: Nguyên nhân và cách giảm', summary: '8 cách giảm ốm nghén an toàn không cần thuốc.', category: 'Sức khỏe', readTimeMinutes: 4 },
  { id: 'fb4', title: 'Thai giáo bằng âm nhạc: Bắt đầu từ khi nào?', summary: 'Hướng dẫn thai giáo âm nhạc từ tuần 18.', category: 'Thai giáo', readTimeMinutes: 6 },
  { id: 'fb5', title: 'Chuẩn bị giỏ đồ đi sinh', summary: 'Checklist đầy đủ đồ đi sinh cho mẹ và bé.', category: 'Chuẩn bị sinh', readTimeMinutes: 5 },
  { id: 'fb6', title: '5 bài tập yoga an toàn cho bà bầu', summary: 'Các tư thế yoga an toàn giúp mẹ bầu khỏe mạnh.', category: 'Sức khỏe', readTimeMinutes: 5 },
  { id: 'fb7', title: 'Xét nghiệm đường huyết thai kỳ', summary: 'Tìm hiểu về xét nghiệm GCT và tiểu đường thai kỳ.', category: 'Sức khỏe', readTimeMinutes: 6 },
  { id: 'fb8', title: 'Dấu hiệu chuyển dạ: Khi nào cần đến BV?', summary: 'Nhận biết dấu hiệu chuyển dạ thật vs giả.', category: 'Chuẩn bị sinh', readTimeMinutes: 7 },
];

export const FALLBACK_APPOINTMENTS = [
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
];
