export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  ...props 
}) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium';
  
  const variants = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-purple-600 dark:hover:from-cyan-400 dark:hover:to-purple-500 dark:shadow-lg dark:shadow-cyan-500/30 dark:hover:shadow-cyan-500/50 active:scale-95',
    secondary:
      'bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:border dark:border-slate-700 active:scale-95',
    outline:
      'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-cyan-500/50 active:scale-95',
    ghost:
      'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 gap-1.5',
    md: 'px-4 py-2 gap-2',
    lg: 'px-6 py-3 gap-2'
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
