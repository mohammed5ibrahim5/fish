import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  MapPin,
  Mail,
  Save,
  Package
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/Toast';
import { DataService } from '@/lib/dataService';
import type { Order } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

export default function AccountPage() {
  const { profile, signOut } = useAuth();
  const { wishlist } = useWishlist();
  const { lang } = useLanguage();
  const { success } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'orders';
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Edit Profile form
  const [name, setName] = useState(profile?.full_name || 'الكابتن صياد محترف');
  const [phone, setPhone] = useState(profile?.phone || '+20 100 123 4567');
  const [city, setCity] = useState(profile?.city || 'الإسكندرية');
  const [address, setAddress] = useState(profile?.address || 'شارع الكورنيش، سموحة');

  useEffect(() => {
    DataService.getOrders().then((data) => {
      setOrders(data);
      setLoadingOrders(false);
    });
  }, []);

  const handleTabChange = (tab: string) => {
    searchParams.set('tab', tab);
    setSearchParams(searchParams);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    success(lang === 'ar' ? 'تم حفظ وتحديث بيانات حسابك بنجاح!' : 'Profile updated successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Account Header */}
      <div className="bg-gradient-to-r from-ocean-950 via-slate-900 to-ocean-900 text-white rounded-3xl p-6 sm:p-8 border border-ocean-800/50 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-ocean-500 to-teal-400 text-white font-black text-2xl flex items-center justify-center border-2 border-white/20 shadow-lg">
            {(name || 'ص').charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{name}</h1>
              <span className="badge bg-ocean-500/30 text-ocean-200 border border-ocean-400/40 text-[10px] uppercase font-bold">
                {profile?.role === 'admin' ? 'مدير المتجر (Admin)' : 'صياد معتمد'}
              </span>
            </div>
            <p className="text-xs text-ocean-200 mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-ocean-400" />
                {profile?.email || 'angler@seapro.com'}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                {city}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {profile?.role === 'admin' && (
            <Link to="/admin" className="btn-secondary py-2.5 px-4 text-xs text-white border-white/20 hover:bg-white/10">
              {lang === 'ar' ? 'لوحة تحكم الإدارة' : 'Admin Panel'}
            </Link>
          )}
          <button
            onClick={() => {
              signOut();
              navigate('/login');
            }}
            className="btn-ghost py-2.5 px-4 text-xs text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
          </button>
        </div>
      </div>

      {/* Main Account Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar Tabs */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-1">
          <button
            onClick={() => handleTabChange('orders')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-ocean-50 text-ocean-700 font-black'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-ocean-600" />
              <span>{lang === 'ar' ? 'طلباتي ومشترياتي' : 'My Orders'}</span>
            </div>
            <span className="badge bg-slate-100 text-slate-700">{orders.length}</span>
          </button>

          <button
            onClick={() => handleTabChange('wishlist')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'wishlist'
                ? 'bg-ocean-50 text-ocean-700 font-black'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>{lang === 'ar' ? 'قائمة الرغبات والمفضلة' : 'My Wishlist'}</span>
            </div>
            <span className="badge bg-rose-50 text-rose-600 font-bold">{wishlist.length}</span>
          </button>

          <button
            onClick={() => handleTabChange('settings')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-ocean-50 text-ocean-700 font-black'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-slate-600" />
              <span>{lang === 'ar' ? 'إعدادات الحساب والعناوين' : 'Profile Settings'}</span>
            </div>
          </button>
        </div>

        {/* Content Pane */}
        <div className="lg:col-span-9">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-base font-extrabold text-slate-900 mb-1">
                  {lang === 'ar' ? 'سجل الطلبات وتتبع الشحنات' : 'Order History & Tracking'}
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  {lang === 'ar' ? 'يمكنك تتبع مسار شحنات عتاد الصيد الخاص بك لحظة بلحظة' : 'Track your shipments live'}
                </p>

                {loadingOrders ? (
                  <p className="text-xs text-slate-400 text-center py-8">{lang === 'ar' ? 'جاري التحميل...' : 'Loading orders...'}</p>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-xs">{lang === 'ar' ? 'لا توجد أي طلبات مسجلة بعد' : 'No orders placed yet'}</p>
                    <Link to="/shop" className="btn-primary py-2 px-4 text-xs mt-4 inline-block">
                      {lang === 'ar' ? 'تسوق الآن' : 'Shop Gear'}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                          <div>
                            <span className="font-extrabold text-sm text-slate-900">
                              #{ord.order_number}
                            </span>
                            <span className="text-xs text-slate-400 block" dir="ltr">
                              {new Date(ord.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`badge py-1 px-3 text-xs font-bold ${
                                ord.status === 'delivered'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : ord.status === 'shipped'
                                  ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                  : ord.status === 'processing'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {ord.status === 'delivered'
                                ? 'تم التوصيل بنجاح ✅'
                                : ord.status === 'shipped'
                                ? 'جاري الشحن وفي الطريق 🚚'
                                : ord.status === 'processing'
                                ? 'جاري تجهيز الشحنة 📦'
                                : 'قيد المراجعة ⏳'}
                            </span>
                            <span className="font-extrabold text-sm text-ocean-700">
                              {ord.total.toLocaleString()} EGP
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2">
                          {ord.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.image}
                                  alt={item.title_ar}
                                  className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                                />
                                <div>
                                  <span className="font-bold text-slate-800 line-clamp-1">{lang === 'ar' ? item.title_ar : item.title_en}</span>
                                  <span className="text-slate-400">{item.quantity} × {item.price.toLocaleString()} EGP</span>
                                </div>
                              </div>
                              <span className="font-bold text-slate-900">{(item.price * item.quantity).toLocaleString()} EGP</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-base font-extrabold text-slate-900 mb-1">
                  {lang === 'ar' ? 'قائمة الرغبات والمعدات المفضلة' : 'Saved Wishlist Items'}
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  {lang === 'ar' ? 'المعدات التي قمت بحفظها للرجوع إليها وشرائها لاحقاً' : 'Tackle you bookmarked for later'}
                </p>

                {wishlist.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Heart className="w-12 h-12 mx-auto mb-3 opacity-40 text-rose-400" />
                    <p className="text-xs">{lang === 'ar' ? 'لم تقم بحفظ أي معدات في المفضلة بعد' : 'Wishlist is empty'}</p>
                    <Link to="/shop" className="btn-primary py-2 px-4 text-xs mt-4 inline-block">
                      {lang === 'ar' ? 'استكشف المنتجات' : 'Browse Shop'}
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-base font-extrabold text-slate-900">
                {lang === 'ar' ? 'تعديل البيانات الشخصية وعنوان التوصيل' : 'Personal Info & Delivery Address'}
              </h3>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field py-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-field py-2.5 text-xs"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {lang === 'ar' ? 'المدينة / المحافظة' : 'City'}
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="input-field py-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {lang === 'ar' ? 'العنوان التفصيلي' : 'Detailed Address'}
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="input-field py-2.5 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button type="submit" className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
