// Pregnancy Nutrition Data — Vietnamese context
// Based on MOH/WHO guidelines for pregnant women

export const TRIMESTER_NUTRITION = {
  1: {
    title: 'Tam cá nguyệt 1 (Tuần 1-13)',
    subtitle: 'Giai đoạn hình thành cơ quan',
    calorieExtra: '+0 kcal/ngày',
    keyNutrients: [
      { name: 'Acid Folic', amount: '400-600 mcg/ngày', why: 'Ngăn dị tật ống thần kinh', foods: 'Rau bina, bông cải xanh, cam, đậu lăng' },
      { name: 'Sắt', amount: '30-60 mg/ngày', why: 'Phòng thiếu máu', foods: 'Thịt đỏ, gan, đậu đen, rau muống' },
      { name: 'Vitamin B6', amount: '1.9 mg/ngày', why: 'Giảm ốm nghén', foods: 'Chuối, khoai tây, thịt gà' },
      { name: 'Gừng', amount: 'Vừa phải', why: 'Giảm buồn nôn tự nhiên', foods: 'Trà gừng, kẹo gừng' },
    ],
    mealTips: [
      'Ăn từng bữa nhỏ, 5-6 bữa/ngày để giảm ốm nghén',
      'Uống nước chanh/gừng khi buồn nôn',
      'Tránh thức ăn có mùi mạnh',
      'Ăn bánh cracker trước khi rời giường buổi sáng',
    ],
  },
  2: {
    title: 'Tam cá nguyệt 2 (Tuần 14-27)',
    subtitle: 'Giai đoạn bé phát triển nhanh',
    calorieExtra: '+340 kcal/ngày',
    keyNutrients: [
      { name: 'Canxi', amount: '1000-1200 mg/ngày', why: 'Xương và răng bé', foods: 'Sữa, phô mai, đậu hũ, cá hồi' },
      { name: 'Omega-3 DHA', amount: '200-300 mg/ngày', why: 'Phát triển não bé', foods: 'Cá hồi, cá thu, hạt chia, óc chó' },
      { name: 'Protein', amount: '71g/ngày', why: 'Tăng trưởng mô', foods: 'Thịt nạc, trứng, đậu, sữa chua' },
      { name: 'Vitamin D', amount: '600 IU/ngày', why: 'Hấp thu canxi', foods: 'Trứng, nấm, phơi nắng 15 phút/ngày' },
    ],
    mealTips: [
      'Tăng khẩu phần protein (thêm 25g/ngày)',
      'Uống ít nhất 2 ly sữa/ngày',
      'Ăn cá 2-3 lần/tuần (chọn cá ít thủy ngân)',
      'Bổ sung rau xanh đậm mỗi bữa',
    ],
  },
  3: {
    title: 'Tam cá nguyệt 3 (Tuần 28-40)',
    subtitle: 'Giai đoạn bé tích mỡ, chuẩn bị sinh',
    calorieExtra: '+452 kcal/ngày',
    keyNutrients: [
      { name: 'Sắt', amount: '30-60 mg/ngày', why: 'Chuẩn bị máu cho sinh', foods: 'Thịt bò, rau muống, mè đen' },
      { name: 'Vitamin K', amount: '90 mcg/ngày', why: 'Đông máu cho mẹ và bé', foods: 'Bông cải xanh, cải xoăn, dầu ô liu' },
      { name: 'Chất xơ', amount: '25-30g/ngày', why: 'Chống táo bón', foods: 'Yến mạch, khoai lang, quả bơ, đu đủ' },
      { name: 'Magiê', amount: '350 mg/ngày', why: 'Giảm chuột rút', foods: 'Chuối, hạnh nhân, socola đen, đậu xanh' },
    ],
    mealTips: [
      'Chia nhỏ bữa ăn, tránh ăn quá no (dạ dày bị chèn)',
      'Uống đủ 2.5-3 lít nước/ngày',
      'Ăn thực phẩm giàu chất xơ chống táo bón',
      'Hạn chế muối để giảm phù nề',
    ],
  },
};

export const RECOMMENDED_FOODS = [
  { emoji: '🥚', name: 'Trứng', benefit: 'Protein + Choline cho não bé', trimester: [1, 2, 3] },
  { emoji: '🐟', name: 'Cá hồi', benefit: 'Omega-3 DHA, phát triển hệ thần kinh', trimester: [2, 3] },
  { emoji: '🥛', name: 'Sữa/Sữa chua', benefit: 'Canxi + Protein + Probiotic', trimester: [1, 2, 3] },
  { emoji: '🍠', name: 'Khoai lang', benefit: 'Beta-carotene + Chất xơ', trimester: [1, 2, 3] },
  { emoji: '🥑', name: 'Quả bơ', benefit: 'Chất béo lành + Folate + Kali', trimester: [1, 2, 3] },
  { emoji: '🥬', name: 'Rau bina/Rau muống', benefit: 'Sắt + Folate + Vitamin K', trimester: [1, 2, 3] },
  { emoji: '🫘', name: 'Đậu các loại', benefit: 'Protein thực vật + Sắt + Chất xơ', trimester: [1, 2, 3] },
  { emoji: '🍌', name: 'Chuối', benefit: 'Kali + B6 giảm ốm nghén', trimester: [1, 2] },
  { emoji: '🥩', name: 'Thịt nạc', benefit: 'Sắt heme + Protein chất lượng', trimester: [2, 3] },
  { emoji: '🌰', name: 'Hạt óc chó/hạnh nhân', benefit: 'Omega-3 + Magiê + Vitamin E', trimester: [2, 3] },
  { emoji: '🍊', name: 'Cam/Bưởi', benefit: 'Vitamin C giúp hấp thu sắt', trimester: [1, 2, 3] },
  { emoji: '🥦', name: 'Bông cải xanh', benefit: 'Canxi + Folate + Vitamin C + K', trimester: [1, 2, 3] },
];

export const FOODS_TO_AVOID = [
  { emoji: '🍣', name: 'Sushi/Cá sống', reason: 'Nguy cơ nhiễm khuẩn Listeria' },
  { emoji: '🍺', name: 'Rượu bia', reason: 'Gây dị tật thai nhi (FAS)' },
  { emoji: '☕', name: 'Cà phê > 200mg', reason: 'Caffeine quá mức gây sảy thai' },
  { emoji: '🧀', name: 'Phô mai mềm chưa tiệt trùng', reason: 'Nguy cơ Listeria' },
  { emoji: '🥩', name: 'Thịt tái/sống', reason: 'Nguy cơ Toxoplasma' },
  { emoji: '🐟', name: 'Cá có thủy ngân cao', reason: 'Cá kiếm, cá mập, cá ngừ lớn' },
  { emoji: '🍳', name: 'Trứng sống/lòng đào', reason: 'Nguy cơ Salmonella' },
  { emoji: '🌿', name: 'Rau sống chưa rửa kỹ', reason: 'Nguy cơ ký sinh trùng' },
];

export const DAILY_CHECKLIST = [
  { id: 'water', label: 'Uống đủ 2.5L nước 💧', icon: '💧' },
  { id: 'fruit', label: 'Ăn 2-3 phần trái cây 🍎', icon: '🍎' },
  { id: 'veggie', label: 'Ăn rau xanh mỗi bữa 🥬', icon: '🥬' },
  { id: 'protein', label: 'Đủ protein (thịt/cá/đậu/trứng) 🥩', icon: '🥩' },
  { id: 'dairy', label: 'Uống sữa/ăn sữa chua 🥛', icon: '🥛' },
  { id: 'prenatal', label: 'Uống vitamin tổng hợp bầu 💊', icon: '💊' },
];
