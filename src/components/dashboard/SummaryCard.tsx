interface SummaryCardProps {
  title: string;
  amount: number;
  count?: number;
  trend?: number;
  type: "received" | "made";
  icon?: React.ReactNode;
}

export function SummaryCard({ title, amount = 0, count = 0, trend, type, icon }: SummaryCardProps) {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className={`text-2xl font-semibold mt-1 ${type === "received" ? "text-green-600" : "text-red-600"}`}>
            {formattedAmount}
          </p>
        </div>
        {icon && (
          <div className={`p-3 rounded-full ${type === "received" ? "bg-green-100" : "bg-red-100"}`}>
            {icon}
          </div>
        )}
      </div>
      
      <div className="mt-2 flex items-baseline">
        {trend && (
          <span className={`ml-2 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>

      <div className="mt-1">
        <span className="text-gray-600 text-sm">
          {count || 0} {(count || 0) === 1 ? 'transaction' : 'transactions'}
        </span>
      </div>

      <div className={`mt-4 h-1 rounded-full ${type === 'received' ? 'bg-green-100' : 'bg-red-100'}`}>
        <div
          className={`h-1 rounded-full ${type === 'received' ? 'bg-green-500' : 'bg-red-500'}`}
          style={{ width: `${Math.min(((count || 0) / 100) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
} 