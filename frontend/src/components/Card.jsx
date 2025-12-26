export function Card({ children, className = '', onClick }) {
  return (
    <div 
      className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-all ${onClick ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
