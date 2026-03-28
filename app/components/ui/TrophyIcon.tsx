type Props = {
  size?: number
  fill?: string
  stroke?: string
}

export default function TrophyIcon({
  size = 28,
  fill = "#f4b400",
  stroke = "black",
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pokal Schale */}
      <path
        d="M16 8h32v8c0 10-8 18-16 18S16 26 16 16V8z"
        fill={fill}
        stroke={stroke}
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Henkel links */}
      <path
        d="M16 10H8v8c0 6 4 10 10 10"
        fill="none"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Henkel rechts */}
      <path
        d="M48 10h8v8c0 6-4 10-10 10"
        fill="none"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Stiel */}
      <rect x="28" y="34" width="8" height="10" fill={stroke} />

      {/* Fuß */}
      <rect x="20" y="44" width="24" height="6" fill={stroke} />
    </svg>
  )
}