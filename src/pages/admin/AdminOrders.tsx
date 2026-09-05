import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DataService } from '@/lib/dataService';
import type { Order } from '@/lib/types';

const STATUS_OPTIONS: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const { lang } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DataService.getOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const handleStatusChange = async (id: string, status: Order['status']) => {
    await DataService.updateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const statusLabel = (s: Order['status']) => {
    const map: Record<string, string> = {
      pending: '⏳ ' + (lang === 'ar' ? 'قيد المراجعة' : 'Pending'),
      processing: '📦 ' + (lang === 'ar' ? 'جاري التجهيز' : 'Processing'),
      shipped: '🚚 ' + (lang === 'ar' ? 'تم الشحن' : 'Shipped'),
      delivered: '✅ ' + (lang === 'ar' ? 'تم التوصيل' : 'Delivered'),
      cancelled: '❌ ' + (lang === 'ar' ? 'ملغي' : 'Cancelled'),
    };
    return map[s] || s;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">{lang === 'ar' ? 'إدارة الطلبات' : 'Orders'}</h1>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-xs text-slate-400 text-center">{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
        ) : orders.length === 0 ? (
          <p className="p-6 text-xs text-slate-400 text-center">{lang === 'ar' ? 'لا توجد طلبات' : 'No orders'}</p>
        ) : (
          <div className="space-y-0">
            {orders.map((o) => (
              <div key={o.id} className="p-4 border-b border-slate-100 last:border-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-sm text-slate-900">#{o.order_number}</span>
                    <span className="text-xs text-slate-400 ml-2">{o.customer_name}</span>
                    <span className="text-xs text-slate-400 ml-2">{o.customer_email}</span>
                  </div>
                  <span className="font-bold text-ocean-700">{o.total.toLocaleString()} EGP</span>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value as Order['status'])}
                    className="input-field py-1.5 px-3 text-xs rounded-lg"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{statusLabel(s)}</option>
                    ))}
                  </select>
                  <span className="text-[11px] text-slate-400" dir="ltr">{new Date(o.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
