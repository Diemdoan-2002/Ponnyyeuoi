/* Cute kawaii SVG icons for Ponnyxinchao! */
const I = ({ d, w = 24, h = 24, fill = 'currentColor', vb = '0 0 24 24', className = '' }) => (
    <svg width={w} height={h} viewBox={vb} fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        {typeof d === 'string' ? <path d={d} fill={fill} /> : d}
    </svg>
)

/* Navigation icons */
export const IconHome = ({ size = 24, color = 'currentColor' }) => (
    <I w={size} h={size} d={<>
        <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 14a2 2 0 100-4 2 2 0 000 4z" fill={color} opacity=".5" />
        <path d="M12 11.5l-.5 1c-.1.2 0 .5.2.6.3.1.5 0 .6-.3l.2-.5-.5-.8z" fill={color} opacity=".3" />
    </>} />
)

export const IconBaby = ({ size = 24, color = 'currentColor' }) => (
    <I w={size} h={size} d={<>
        <circle cx="12" cy="11" r="7" fill="none" stroke={color} strokeWidth="2" />
        <circle cx="10" cy="10" r=".8" fill={color} />
        <circle cx="14" cy="10" r=".8" fill={color} />
        <path d="M10 13c.5.8 1.2 1 2 1s1.5-.2 2-1" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8.5 5.5C9 4 10.5 3 12 3s3 1 3.5 2.5" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8.5" cy="10.5" r="1.2" fill={color} opacity=".15" />
        <circle cx="15.5" cy="10.5" r="1.2" fill={color} opacity=".15" />
    </>} />
)

export const IconCalendar = ({ size = 24, color = 'currentColor' }) => (
    <I w={size} h={size} d={<>
        <rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke={color} strokeWidth="2" />
        <path d="M3 10h18" stroke={color} strokeWidth="2" />
        <path d="M8 3v4M16 3v4" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="15" r="2" fill={color} opacity=".3" />
        <path d="M11 15l1 1 2-2" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </>} />
)

export const IconBook = ({ size = 24, color = 'currentColor' }) => (
    <I w={size} h={size} d={<>
        <path d="M4 4.5C4 3.67 4.67 3 5.5 3H9c1.1 0 2.1.5 3 1.5.9-1 1.9-1.5 3-1.5h3.5c.83 0 1.5.67 1.5 1.5V18c0 .83-.67 1.5-1.5 1.5H15c-1.1 0-2.1.5-3 1.5-.9-1-1.9-1.5-3-1.5H5.5C4.67 19.5 4 18.83 4 18V4.5z" fill="none" stroke={color} strokeWidth="2" />
        <path d="M12 4.5V21" stroke={color} strokeWidth="1.5" />
        <path d="M7 8h3M7 11h3" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity=".5" />
        <circle cx="16" cy="9" r="1" fill={color} opacity=".3" />
    </>} />
)

export const IconPill = ({ size = 24, color = 'currentColor' }) => (
    <I w={size} h={size} d={<>
        <rect x="7" y="2" width="10" height="20" rx="5" fill="none" stroke={color} strokeWidth="2" />
        <path d="M7 12h10" stroke={color} strokeWidth="2" />
        <path d="M7 12h10v5a5 5 0 01-10 0v-5z" fill={color} opacity=".2" />
        <circle cx="12" cy="8" r="1.2" fill={color} opacity=".3" />
    </>} />
)

export const IconKick = ({ size = 24, color = 'currentColor' }) => (
    <I w={size} h={size} d={<>
        <path d="M8 19c0-3 1.5-5 3.5-6.5C13 11.5 14 10 14 7.5a3 3 0 00-6 0" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <circle cx="11" cy="4" r="1.8" fill="none" stroke={color} strokeWidth="1.5" />
        <path d="M16 19c0-3 1-4.5 2.5-5.5" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M6 14l-2 1M7 17l-3 1" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity=".4" />
    </>} />
)

export const IconSettings = ({ size = 24, color = 'currentColor' }) => (
    <I w={size} h={size} d={<>
        <circle cx="12" cy="12" r="3" fill="none" stroke={color} strokeWidth="2" />
        <path d="M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="1" fill={color} opacity=".5" />
    </>} />
)

/* Reminder / Action icons */
export const IconMedicine = ({ size = 20, color = '#FF6B9D' }) => (
    <I w={size} h={size} vb="0 0 20 20" d={<>
        <rect x="5" y="2" width="10" height="16" rx="4" fill={color} opacity=".15" />
        <rect x="5" y="2" width="10" height="16" rx="4" fill="none" stroke={color} strokeWidth="1.5" />
        <path d="M5 10h10" stroke={color} strokeWidth="1.5" />
        <path d="M8.5 6h3M10 4.5v3" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </>} />
)

export const IconStethoscope = ({ size = 20, color = '#A78BFA' }) => (
    <I w={size} h={size} vb="0 0 20 20" d={<>
        <path d="M6 3v5a4 4 0 008 0V3" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="14" cy="13" r="2.5" fill={color} opacity=".15" />
        <circle cx="14" cy="13" r="2.5" fill="none" stroke={color} strokeWidth="1.5" />
        <circle cx="14" cy="13" r=".8" fill={color} />
        <path d="M14 15.5v1.5a2 2 0 01-4 0v-2" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </>} />
)

export const IconBabyFoot = ({ size = 20, color = '#FF6B9D' }) => (
    <I w={size} h={size} vb="0 0 20 20" d={<>
        <ellipse cx="10" cy="12" rx="4" ry="5.5" fill={color} opacity=".15" />
        <ellipse cx="10" cy="12" rx="4" ry="5.5" fill="none" stroke={color} strokeWidth="1.5" />
        <circle cx="7" cy="5.5" r="1.5" fill={color} opacity=".3" stroke={color} strokeWidth="1" />
        <circle cx="9.5" cy="4.5" r="1.3" fill={color} opacity=".3" stroke={color} strokeWidth="1" />
        <circle cx="12" cy="5" r="1.2" fill={color} opacity=".3" stroke={color} strokeWidth="1" />
        <circle cx="14" cy="6.5" r="1" fill={color} opacity=".3" stroke={color} strokeWidth="1" />
    </>} />
)

/* Med-specific icons */
export const IconIron = ({ size = 32 }) => (
    <I w={size} h={size} vb="0 0 32 32" d={<>
        <rect x="8" y="4" width="16" height="24" rx="8" fill="#FFE4E8" />
        <rect x="8" y="4" width="16" height="24" rx="8" fill="none" stroke="#F87171" strokeWidth="1.5" />
        <path d="M8 16h16" stroke="#F87171" strokeWidth="1.5" />
        <rect x="8" y="16" width="16" height="12" rx="0" fill="#F87171" opacity=".2" />
        <circle cx="14" cy="11" r="1" fill="#F87171" />
        <circle cx="18" cy="11" r="1" fill="#F87171" />
        <path d="M14 13c.5.5 1.5.8 2.5.5s1.3-.5 1.5-1" fill="none" stroke="#F87171" strokeWidth="1" strokeLinecap="round" />
    </>} />
)

export const IconCalcium = ({ size = 32 }) => (
    <I w={size} h={size} vb="0 0 32 32" d={<>
        <path d="M10 8l6-4 6 4v8l-6 12-6-12V8z" fill="#EDE9FE" stroke="#A78BFA" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="14" cy="13" r="1" fill="#A78BFA" />
        <circle cx="18" cy="13" r="1" fill="#A78BFA" />
        <path d="M14 15.5c.5.5 1.5.5 2.5.3s1.3-.5 1.5-1" fill="none" stroke="#A78BFA" strokeWidth="1" strokeLinecap="round" />
    </>} />
)

export const IconDHA = ({ size = 32 }) => (
    <I w={size} h={size} vb="0 0 32 32" d={<>
        <ellipse cx="16" cy="16" rx="10" ry="7" fill="#FEF3C7" stroke="#FBBF24" strokeWidth="1.5" />
        <circle cx="13" cy="15" r="1" fill="#F59E0B" />
        <circle cx="19" cy="15" r="1" fill="#F59E0B" />
        <path d="M13 17.5c1 1 3 1.2 4.5.5s1.5-.8 1.8-1.2" fill="none" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" />
        <path d="M26 13c1-2 1.5-4 0-5s-2 1-2 3" fill="none" stroke="#FBBF24" strokeWidth="1.2" strokeLinecap="round" />
    </>} />
)

export const IconFolicAcid = ({ size = 32 }) => (
    <I w={size} h={size} vb="0 0 32 32" d={<>
        <path d="M16 4c-4 2-8 6-8 12s4 12 8 12 8-6 8-12-4-10-8-12z" fill="#D1FAE5" stroke="#34D399" strokeWidth="1.5" />
        <circle cx="14" cy="16" r="1" fill="#059669" />
        <circle cx="18" cy="16" r="1" fill="#059669" />
        <path d="M14 18.5c.8.8 2 1 3 .5s1.5-.5 2-1" fill="none" stroke="#059669" strokeWidth="1" strokeLinecap="round" />
    </>} />
)
