export default function ComicInput({
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  autoComplete,
  disabled = false,
  minLength,
}: {
  id?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  disabled?: boolean;
  minLength?: number;
}) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      disabled={disabled}
      minLength={minLength}
      className="w-full border-2 border-black bg-white px-4 py-3 text-base placeholder:text-neutral-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500"
    />
  );
}
