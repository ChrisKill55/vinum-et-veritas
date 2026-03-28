export default function ComicInput({
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full border-2 border-black bg-white px-4 py-3 text-base placeholder:text-neutral-500 focus:outline-none"
    />
  );
}