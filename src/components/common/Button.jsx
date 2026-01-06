export default function Button({ 
  children, 
  onClick, 
  variant = 'default',
  className = '',
  disabled = false,
  ...props 
}) {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200';
  
  const variants = {
    default: 'bg-zinc-800 hover:bg-zinc-700 text-gray-200 border border-zinc-700',
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-zinc-700 hover:bg-zinc-600 text-gray-200',
    outline: 'bg-transparent hover:bg-zinc-800 text-gray-300 border border-zinc-700',
  };

  const disabledStyles = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : 'cursor-pointer active:scale-95';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${disabledStyles} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
