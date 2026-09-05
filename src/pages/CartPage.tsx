import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shippingCost,
    discount,
    total,
    freeShippingThreshold,
    freeShippingProgress,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { lang, dir } = useLanguage();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    const res = applyCoupon(couponCode);
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) setCouponCode('');
  };

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-ocean-50 text-ocean-400 flex items-center justify-center mx-auto mb-6 border border-ocean-100">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          {lang === 'ar' ? 'سلة المشتريات فارغة حالياً' : 'Your Shopping Cart is Empty'}
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
          {lang === 'ar'
            ? 'لم تقم بإضافة أي من قصبات أو بكرات أو طعوم الصيد بعد. تصفح المتجر الآن واستمتع بأقوى العروض!'
            : 'You haven’t added any fishing tackle yet. Explore our shop and discover the best deals!'}
        </p>
        <Link to="/shop" className="btn-primary py-3.5 px-8 text-sm inline-flex items-center gap-2">
          <span>{lang === 'ar' ? 'ابدأ التسوق الآن' : 'Start Shopping Now'}</span>
          {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {lang === 'ar' ? 'سلة المشتريات' : 'Shopping Cart'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'ar' ? `لديك ${items.length} منتجات في السلة` : `You have ${items.length} items in your cart`}
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>{lang === 'ar' ? 'تفريغ السلة بالكامل' : 'Clear All'}</span>
        </button>
      </div>

      {/* Free Shipping Tracker */}
      <div className="bg-ocean-50/80 rounded-2xl p-5 border border-ocean-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold text-ocean-900 mb-2">
          <span className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-ocean-600" />
            {remainingForFreeShipping === 0
              ? lang === 'ar'
                ? '🎉 مبروك! طلبيتك مؤهلة للشحن المجاني بالكامل!'
                : '🎉 Congratulations! You qualify for Free Shipping!'
              : lang === 'ar'
              ? `أضف بقيمة ${remainingForFreeShipping.toLocaleString()} ج.م للحصول على شحن مجاني 🚀`
              : `Add ${remainingForFreeShipping.toLocaleString()} EGP more for Free Shipping 🚀`}
          </span>
          <span className="text-ocean-700">{freeShippingProgress}%</span>
        </div>
        <div className="w-full h-2.5 bg-ocean-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-ocean-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Cart Grid (Items table/cards + Summary sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map(({ product, quantity, selectedOption }) => (
            <div
              key={`${product.id}-${selectedOption || ''}`}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:border-ocean-200 transition-all"
            >
              <img
                src={product.images[0]}
                alt={lang === 'ar' ? product.title_ar : product.title_en}
                className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shrink-0"
              />

              <div className="flex-1 min-w-0 space-y-1">
                <span className="text-[11px] font-extrabold uppercase text-ocean-600 bg-ocean-50 px-2 py-0.5 rounded-md">
                  {product.brand}
                </span>
                <Link
                  to={`/product/${product.id}`}
                  className="block font-bold text-sm text-slate-800 hover:text-ocean-600 transition-colors line-clamp-2"
                >
                  {lang === 'ar' ? product.title_ar : product.title_en}
                </Link>
                {selectedOption && <p className="text-xs text-slate-500">{selectedOption}</p>}
                <div className="text-xs font-semibold text-slate-400">
                  {product.price.toLocaleString()} {lang === 'ar' ? 'ج.م للقطعة' : 'EGP / each'}
                </div>
              </div>

              {/* Quantity Controls & Total */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1, selectedOption)}
                    className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1, selectedOption)}
                    className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-[90px]">
                  <span className="font-black text-slate-900 text-base">
                    {(product.price * quantity).toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 font-normal mr-1">
                    {lang === 'ar' ? 'ج.م' : 'EGP'}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(product.id, selectedOption)}
                  className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 sticky top-24">
          <h3 className="font-extrabold text-slate-900 text-lg pb-3 border-b border-slate-100">
            {lang === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
          </h3>

          {/* Coupon Code Section */}
          <form onSubmit={handleApplyCoupon} className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              {lang === 'ar' ? 'هل لديك كود خصم أو قسيمة؟' : 'Have a Promo Code?'}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  placeholder="SEAPRO10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="input-field py-2 pr-9 text-xs rounded-xl"
                />
              </div>
              <button type="submit" className="btn-secondary py-2 px-4 text-xs font-bold">
                {lang === 'ar' ? 'تطبيق' : 'Apply'}
              </button>
            </div>
            {couponMsg && (
              <p className={`text-xs font-medium ${couponMsg.isError ? 'text-rose-500' : 'text-emerald-600'}`}>
                {couponMsg.text}
              </p>
            )}
            {appliedCoupon && (
              <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 text-xs px-3 py-2 rounded-xl border border-emerald-200">
                <span>
                  {lang === 'ar' ? 'الكوبون المفعل:' : 'Active Code:'} <b>{appliedCoupon.code}</b>
                </span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-rose-500 hover:underline font-bold text-xs"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Remove'}
                </button>
              </div>
            )}
          </form>

          {/* Price Breakdown */}
          <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span>{lang === 'ar' ? 'المجموع الفرعي للمنتجات' : 'Items Subtotal'}</span>
              <span className="font-bold text-slate-900">{subtotal.toLocaleString()} EGP</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>{lang === 'ar' ? 'قيمة الخصم المطبق' : 'Discount Applied'}</span>
                <span>-{discount.toLocaleString()} EGP</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>{lang === 'ar' ? 'تكلفة التوصيل والشحن' : 'Shipping Cost'}</span>
              <span>
                {shippingCost === 0 ? (
                  <span className="text-emerald-600 font-bold">
                    {lang === 'ar' ? 'مجاني 🚀' : 'FREE 🚀'}
                  </span>
                ) : (
                  `${shippingCost} EGP`
                )}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
              <span>{lang === 'ar' ? 'الإجمالي النهائي' : 'Total Amount'}</span>
              <span className="text-ocean-700 text-lg">{total.toLocaleString()} EGP</span>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full py-4 text-sm font-bold shadow-ocean-600/30 flex items-center justify-center gap-2"
            >
              <span>{lang === 'ar' ? 'الانتقال إلى صفحة الدفع' : 'Proceed to Checkout'}</span>
              {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>

            <Link
              to="/shop"
              className="btn-ghost w-full py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-1"
            >
              <span>{lang === 'ar' ? 'مواصلة التسوق' : 'Continue Shopping'}</span>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{lang === 'ar' ? 'معاملة آمنة ومحمية 100%' : '100% Encrypted & Secure Checkout'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
