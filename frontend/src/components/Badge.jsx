export function Badge({ status, priority, children, className = '' }) {
  if (status) {
    const statusStyles = {
      submitted: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 dark:border dark:border-slate-700',
      acknowledged: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 dark:border dark:border-blue-500/30 dark:shadow-sm dark:shadow-blue-500/20',
      'in-progress': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 dark:border dark:border-orange-500/30 dark:shadow-sm dark:shadow-orange-500/20',
      resolved: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 dark:border dark:border-green-500/30 dark:shadow-sm dark:shadow-green-500/20'
    };
    
    const statusLabels = {
      submitted: 'Submitted',
      acknowledged: 'Acknowledged',
      'in-progress': 'In Progress',
      resolved: 'Resolved'
    };
    
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-md ${statusStyles[status]} ${className}`}
      >
        {statusLabels[status]}
      </span>
    );
  }
  
  if (priority) {
    const priorityStyles = {
      low: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 dark:border dark:border-green-500/30 dark:shadow-sm dark:shadow-green-500/20',
      medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 dark:border dark:border-yellow-500/30 dark:shadow-sm dark:shadow-yellow-500/20',
      high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 dark:border dark:border-red-500/30 dark:shadow-sm dark:shadow-red-500/20'
    };
    
    const priorityLabels = {
      low: 'Low Priority',
      medium: 'Medium Priority',
      high: 'High Priority'
    };
    
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-md ${priorityStyles[priority]} ${className}`}
      >
        {priorityLabels[priority]}
      </span>
    );
  }
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 dark:border dark:border-slate-700 ${className}`}
    >
      {children}
    </span>
  );
}
