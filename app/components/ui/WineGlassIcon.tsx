type Props = {
  fill?: string;
  stroke?: string;
  size?: number;
  outlineOnly?: boolean;
};

export default function WineGlassIcon({
  fill = "white",
  stroke = "black",
  size = 24,
  outlineOnly = false,
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Glas */}
      <path
        d="M14 6h36l-4 20c-1.5 7-7 12-14 12S19.5 33 18 26L14 6z"
        fill={outlineOnly ? "none" : fill}
        stroke={stroke}
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Stiel */}
      <rect
        x="30"
        y="38"
        width="4"
        height="14"
        fill={stroke}
      />

      {/* Fuß */}
      <rect
        x="20"
        y="52"
        width="24"
        height="4"
        fill={stroke}
      />
    </svg>
  );
}