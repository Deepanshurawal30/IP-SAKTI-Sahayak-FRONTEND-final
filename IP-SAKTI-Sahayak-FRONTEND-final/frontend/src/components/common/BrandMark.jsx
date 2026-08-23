export default function BrandMark({ size = 32, stroke = '#E3B45E', fill = 'rgba(227,180,94,0.08)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M16 2 C10 6 6 12 6 19 C6 25 10.5 29 16 30 C21.5 29 26 25 26 19 C26 12 22 6 16 2Z"
        stroke={stroke}
        strokeWidth="1.6"
        fill={fill}
      />
      <path d="M16 8 V24 M16 8 C13 11 12 15 12 19 M16 8 C19 11 20 15 20 19" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
