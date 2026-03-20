export function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Chào buổi sáng 🌅';
  if (h < 14) return 'Chào buổi trưa ☀️';
  if (h < 18) return 'Chào buổi chiều 🌤️';
  return 'Chào buổi tối 🌙';
}

export function calcFromLMP(lmpDate) {
  const lmp = new Date(lmpDate);
  const today = new Date();
  const diff = Math.floor((today - lmp) / 86400000);
  const week = Math.floor(diff / 7);
  const day = diff % 7;
  const edd = new Date(lmp.getTime() + 280 * 86400000);
  const daysLeft = Math.max(0, Math.floor((edd - today) / 86400000));
  return { week: Math.min(Math.max(week, 1), 40), day, daysLeft, edd };
}

export function calcFromEDD(eddDate) {
  const edd = new Date(eddDate);
  const today = new Date();
  const lmp = new Date(edd.getTime() - 280 * 86400000);
  const diff = Math.floor((today - lmp) / 86400000);
  const week = Math.floor(diff / 7);
  const day = diff % 7;
  const daysLeft = Math.max(0, Math.floor((edd - today) / 86400000));
  return { week: Math.min(Math.max(week, 1), 40), day, daysLeft, edd };
}

export function calcPregnancy(config) {
  if (!config) return { week: 24, day: 3, daysLeft: 112 };
  return config.method === 'lmp' ? calcFromLMP(config.dateVal) : calcFromEDD(config.dateVal);
}

export function fmtTime(s) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}
