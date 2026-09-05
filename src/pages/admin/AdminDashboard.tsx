import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DataService } from '@/lib/dataService';
import type { Order, Product } from '@/lib/types';

export default function AdminDashboard() {
  const { lang } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    DataService.getOrders().then(setOrders);
    DataService.getProducts().then(setProducts);
  }, []);

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  const stats = [
    { icon: ShoppingCart, label: lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders', value: orders.length, color: 'bg-ocean-50 text-ocean-600 border-ocean-100' },
    { icon: TrendingUp, label: lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue', value: `${totalRevenue.toLocaleString()} EGP`, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { icon: Package, label: lang === 'ar' ? 'المنتجات' : 'Products', value: products.length, color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { icon: Users, label: lang === 'ar' ? 'المستخدمين' : 'Users', value: '-', color: 'bg-purple-50 text-purple-600 border-purple-100' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">{lang === 'ar' ? 'لوحة تحكم الإدارة' : 'Admin Dashboard'}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-900 mb-4">{lang === 'ar' ? 'آخر الطلبات' : 'Recent Orders'}</h3>
        {orders.length === 0 ? (
          <p className="text-xs text-slate-400">{lang === 'ar' ? 'لا توجد طلبات بعد' : 'No orders yet'}</p>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs">
                <span className="font-bold text-slate-800">#{o.order_number}</span>
                <span className="text-slate-500">{o.customer_name}</span>
                <span className={`badge text-[10px] ${o.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{o.status}</span>
                <span className="font-bold text-slate-900">{o.total.toLocaleString()} EGP</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
