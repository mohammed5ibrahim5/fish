import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Tag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
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
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) setCouponInput('');
  };

  const handleGoToCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className={`fixed inset-y-0 ${dir === 'rtl' ? 'left-0' : 'right-0'} max-w-full flex pl-0`}>
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full animate-slide-in-right">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-ocean-950 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-ocean-500/20 text-ocean-400 flex items-center justify-center border border-ocean-500/30">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">
                  {lang === 'ar' ? 'سلة المشتريات' : 'Shopping Cart'}
                </h3>
                <p className="text-xs text-ocean-200">
                  {items.length} {lang === 'ar' ? 'منتجات مضافة' : 'items added'}
                </p>
              </div>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-ocean-900/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-ocean-50/80 px-5 py-3 border-b border-ocean-100/60">
            <div className="flex items-center justify-between text-xs font-semibold text-ocean-900 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-ocean-600" />
                {remainingForFreeShipping === 0
                  ? lang === 'ar'
                    ? '🎉 مبروك! حصلت على شحن مجاني بالكامل!'
                    : '🎉 Congrats! You unlocked Free Shipping!'
                  : lang === 'ar'
                  ? `أضف بقيمة ${remainingForFreeShipping} ج.م للحصول على شحن مجاني`
                  : `Add ${remainingForFreeShipping} EGP more for Free Shipping`}
              </span>
              <span>{freeShippingProgress}%</span>
            </div>
            <div className="w-full h-2 bg-ocean-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-ocean-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <div className="w-20 h-20 rounded-full bg-ocean-50 flex items-center justify-center text-ocean-400 mb-4 border border-ocean-100">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h4 className="font-bold text-slate-800 text-lg mb-1">
                  {lang === 'ar' ? 'سلة المشتريات فارغة' : 'Your cart is empty'}
                </h4>
                <p className="text-sm text-slate-500 mb-6 max-w-xs">
                  {lang === 'ar'
                    ? 'استكشف تشكيلتنا الفاخرة من قصبات وبكرات وطعوم الصيد وأضفها لسلتك'
                    : 'Explore our premium fishing gear, rods, and lures to fill your cart'}
                </p>
                <button
                  onClick={() => {
                    closeDrawer();
                    navigate('/shop');
                  }}
                  className="btn-primary py-2.5 text-sm"
                >
                  {lang === 'ar' ? 'تسوق الآن' : 'Start Shopping'}
                </button>
              </div>
            ) : (
              items.map(({ product, quantity, selectedOption }) => (
                <div
                  key={`${product.id}-${selectedOption || ''}`}
                  className="flex gap-3.5 p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-ocean-200 hover:bg-ocean-50/20 transition-all"
                >
                  <img
                    src={product.images[0]}
                    alt={lang === 'ar' ? product.title_ar : product.title_en}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${product.id}`}
                          onClick={closeDrawer}
                          className="font-bold text-sm text-slate-800 hover:text-ocean-600 line-clamp-1 transition-colors"
                        >
                          {lang === 'ar' ? product.title_ar : product.title_en}
                        </Link>
                        <button
                          onClick={() => removeFromCart(product.id, selectedOption)}
                          className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs text-ocean-600 font-semibold">{product.brand}</div>
                      {selectedOption && (
                        <div className="text-xs text-slate-500 mt-0.5">{selectedOption}</div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1, selectedOption)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-800">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1, selectedOption)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {(product.price * quantity).toLocaleString()}{' '}
                          <span className="text-xs font-normal text-slate-500">
                            {lang === 'ar' ? 'ج.م' : 'EGP'}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/80 space-y-4">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                    <input
                      type="text"
                      placeholder={lang === 'ar' ? 'كود الخصم (جرب: SEAPRO10)' : 'Coupon (e.g. SEAPRO10)'}
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="input-field text-xs py-2.5 pr-9 pl-3 rounded-xl"
                    />
                  </div>
                  <button type="submit" className="btn-secondary text-xs py-2 px-4 whitespace-nowrap">
                    {lang === 'ar' ? 'تطبيق' : 'Apply'}
                  </button>
                </div>
                {couponMsg && (
                  <p className={`text-xs font-medium ${couponMsg.isError ? 'text-rose-500' : 'text-emerald-600'}`}>
                    {couponMsg.text}
                  </p>
                )}
                {appliedCoupon && (
                  <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 text-xs px-3 py-1.5 rounded-lg border border-emerald-200">
                    <span>
                      {lang === 'ar' ? 'الكوبون المفعل:' : 'Active Coupon:'} <b>{appliedCoupon.code}</b>
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
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>{lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                  <span className="font-semibold text-slate-900">{subtotal.toLocaleString()} EGP</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>{lang === 'ar' ? 'الخصم' : 'Discount'}</span>
                    <span>-{discount.toLocaleString()} EGP</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{lang === 'ar' ? 'الشحن' : 'Shipping'}</span>
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
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>{lang === 'ar' ? 'الإجمالي النهائي' : 'Total'}</span>
                  <span className="text-ocean-700">{total.toLocaleString()} EGP</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleGoToCheckout}
                  className="btn-primary w-full py-3.5 shadow-ocean-600/30 flex items-center justify-center gap-2"
                >
                  <span>{lang === 'ar' ? 'متابعة الشراء والدفع' : 'Proceed to Checkout'}</span>
                  {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    closeDrawer();
                    navigate('/cart');
                  }}
                  className="btn-ghost w-full py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  {lang === 'ar' ? 'عرض السلة بالكامل' : 'View Full Cart'}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>{lang === 'ar' ? 'دفع آمن 100% وضمان استرجاع أصلي' : '100% Secure Checkout & Original Guarantee'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
