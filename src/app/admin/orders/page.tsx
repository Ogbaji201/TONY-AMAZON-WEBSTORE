// app/admin/orders/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: number;
  status: string;
  createdAt: string; // your API likely returns ISO string
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/orders', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Failed to fetch orders (${response.status})`);

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setErrorMsg('Failed to load orders. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const response = await fetch('/api/orders/export');
      if (!response.ok) throw new Error(`CSV export failed (${response.status})`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('CSV export failed. Check console for details.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = () => {
    // Browser will download because API route returns Content-Disposition: attachment
    window.location.href = '/api/orders/export-xlsx';
  };

  const handleEmailExport = async () => {
    const toEmail = prompt('Send Excel export to which email?');
    if (!toEmail) return;

    try {
      setIsExporting(true);

      const response = await fetch('/api/orders/email-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toEmail }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error('Email export failed:', result);
        alert(`Email export failed. ${result?.error ?? ''}`.trim());
        return;
      }

      alert('Excel export sent to email ✅');
    } catch (error) {
      console.error('Error emailing Excel export:', error);
      alert('Email export failed. Check console for details.');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading orders...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-gray-600 text-sm">
            Total: {orders.length}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={fetchOrders}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            disabled={isExporting}
          >
            Refresh
          </button>

          <button
            onClick={handleExportCsv}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            disabled={isExporting}
          >
            {isExporting ? 'Working…' : 'Export CSV'}
          </button>

          <button
            onClick={handleExportExcel}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            disabled={isExporting}
          >
            Export Excel
          </button>

          <button
            onClick={handleEmailExport}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            disabled={isExporting}
          >
            Email Excel
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {errorMsg}
        </div>
      )}

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">Order #{order.id.slice(-8)}</h3>
                <p className="text-gray-600">
                  {new Date(order.createdAt).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold">₦{Number(order.totalAmount).toLocaleString()}</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'CONFIRMED'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'SHIPPED'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Customer Information</h4>
                <p><strong>Name:</strong> {order.customerName}</p>
                <p><strong>Email:</strong> {order.customerEmail}</p>
                <p><strong>Phone:</strong> {order.customerPhone}</p>
                <p><strong>Address:</strong> {order.customerAddress}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Order Items</h4>
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between mb-2">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && !errorMsg && (
          <div className="text-center py-8 text-gray-500">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
}
