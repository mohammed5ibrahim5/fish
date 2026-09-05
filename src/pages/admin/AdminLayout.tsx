import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, ShoppingCart, Users, Waves } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const NAV = [
  { to: '/admin', icon: LayoutDashboard, labelAr: 'لوحة التحكم', labelEn: 'Dashboard', end: true },
  { to: '/admin/products', icon: Package, labelAr: 'المنتجات', labelEn: 'Products' },
  { to: '/admin/categories', icon: Tags, labelAr: 'الأقسام', labelEn: 'Categories' },
  { to: '/admin/orders', icon: ShoppingCart, labelAr: 'الطلبات', labelEn: 'Orders' },
  { to: '/admin/users', icon: Users, labelAr: 'المستخدمين', labelEn: 'Users' },
];

export default function AdminLayout() {
  const { lang } = useLanguage();
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-64 bg-white border-r border-slate-200 p-4 space-y-2 hidden lg:block">
        <div className="flex items-center gap-2 px-3 py-2 mb-4">
          <Waves className="w-6 h-6 text-ocean-600" />
          <span className="font-black text-slate-900 text-sm">SeaPro Admin</span>
        </div>
        {NAV.map((item) => {
          const active = item.end ? pathname === item.to : pathname.startsWith(item.to) && pathname !== '/admin';
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                active ? 'bg-ocean-50 text-ocean-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{lang === 'ar' ? item.labelAr : item.labelEn}</span>
            </Link>
          );
        })}
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
