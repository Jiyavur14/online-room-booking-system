export default function Card({ children, className = '', ...props }) {
  return (
    <div 
      className={`bg-card rounded-xl shadow-sm border border-border p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
