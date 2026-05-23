export default function Input({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  error,
  required = false,
  className = '',
  ...props 
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          h-11 px-4 rounded-lg border border-border bg-white
          focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
          text-gray-900 placeholder:text-gray-500
          ${error ? 'border-error' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-sm text-error">{error}</span>}
    </div>
  );
}