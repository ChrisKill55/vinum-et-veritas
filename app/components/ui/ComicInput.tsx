type ComicInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ComicInput({
  type = "text",
  className = "",
  ...props
}: ComicInputProps) {
  return (
    <input
      type={type}
      className={`w-full border-2 border-black bg-white px-4 py-3 text-base placeholder:text-neutral-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500 ${className}`}
      {...props}
    />
  );
}
