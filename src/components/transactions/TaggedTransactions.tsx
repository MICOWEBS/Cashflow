"use client";

interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: 'payment' | 'sale';
  paymentMode: string;
  remarks: string;
  vendorName: string | null;
  vendorCompany: string | null;
  customerName: string | null;
  customerCompany: string | null;
}

interface TaggedTransactionsProps {
  transactions: Transaction[];
}

export function TaggedTransactions({ transactions }: TaggedTransactionsProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    transaction.type === 'sale' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.type === 'sale' ? 'Sale' : 'Payment'}
                      </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.type === 'sale' 
                    ? transaction.customerName || 'Unknown Customer'
                    : transaction.vendorName || 'Unknown Vendor'
                  }
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                  transaction.type === 'sale' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(transaction.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
    </div>
  );
} 