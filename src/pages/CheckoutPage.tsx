import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Clock,
  Printer
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { DataService } from '@/lib/dataService';
import type { Order } from '@/lib/types';

export default function CheckoutPage() {
  const { items, subtotal, shippingCost, discount, total, clearCart } = useCart();
  const { lang, dir } = useLanguage();
  const { profile } = useAuth();

  // Form State
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [city, setCity] = useState(profile?.city || 'القاهرة');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'wallet' | 'mada'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (items.length === 0 && !confirmedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          {lang === 'ar' ? 'سلة المشتريات فارغة' : 'No items to checkout'}
        </h2>
        <Link to="/shop" className="btn-primary py-2.5 px-6 text-xs mt-4 inline-block">
          {lang === 'ar' ? 'الذهاب للمتجر' : 'Go to Shop'}
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      alert(lang === 'ar' ? 'يرجى إكمال البيانات الأساسية المطلوبة' : 'Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        title_ar: item.product.title_ar,
        title_en: item.product.title_en,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0],
        selectedOption: item.selectedOption,
      }));

      const newOrder = await DataService.createOrder({
        customer_name: fullName,
        customer_email: email,
        customer_phone: phone,
        shipping_address: address,
        city: city,
        postal_code: postalCode,
        notes: notes,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'cod' ? 'pending' : 'paid',
        status: 'pending',
        items: orderItems,
        subtotal: subtotal,
        shipping_cost: shippingCost,
        discount: discount,
        total: total,
      });

      setConfirmedOrder(newOrder);
      clearCart();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حفظ الطلب، يرجى المحاولة ثانية');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION MODAL / SCREEN
  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6 animate-slide-up text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto border-2 border-emerald-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="badge bg-emerald-50 text-emerald-700 font-bold mb-2">
              {lang === 'ar' ? 'تم استلام طلبك بنجاح!' : 'Order Placed Successfully!'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {lang === 'ar' ? 'شكراً لثقتك في صيد برو!' : 'Thank you for choosing SeaPro!'}
            </h1>
            <p className="text-xs text-slate-500 mt-2">
              {lang === 'ar'
                ? `رقم الطلب الخاص بك هو #${confirmedOrder.order_number}. سنقوم بتجهيز عتاد الصيد الخاص بك وشحنه فوراً.`
                : `Your order reference is #${confirmedOrder.order_number}. We will prepare and dispatch your tackle ASAP.`}
            </p>
          </div>

          {/* Order Details Invoice Card */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-right space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <span className="font-bold text-slate-700">{lang === 'ar' ? 'بيانات الشحن' : 'Shipping Info'}</span>
              <span className="text-slate-500" dir="ltr">{new Date().toLocaleDateString()}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
              <div>
                <span className="text-slate-400 block">{lang === 'ar' ? 'الاسم:' : 'Name:'}</span>
                <span className="font-bold text-slate-900">{confirmedOrder.customer_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">{lang === 'ar' ? 'رقم الهاتف:' : 'Phone:'}</span>
                <span className="font-bold text-slate-900" dir="ltr">{confirmedOrder.customer_phone}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 block">{lang === 'ar' ? 'العنوان:' : 'Address:'}</span>
                <span className="font-bold text-slate-900">{confirmedOrder.shipping_address}, {confirmedOrder.city}</span>
              </div>
            </div>

            {/* Items Summary */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <span className="font-bold text-slate-700 block">{lang === 'ar' ? 'المنتجات المطلوبة:' : 'Ordered Items:'}</span>
              {confirmedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <img src={item.image} alt={item.title_ar} className="w-8 h-8 rounded-lg object-cover border" />
                    <span>{lang === 'ar' ? item.title_ar : item.title_en} × {item.quantity}</span>
                  </div>
                  <span className="font-bold text-slate-900">{(item.price * item.quantity).toLocaleString()} EGP</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
              <span>{lang === 'ar' ? 'الإجمالي المدفوع:' : 'Total Amount:'}</span>
              <span className="text-ocean-700">{confirmedOrder.total.toLocaleString()} EGP</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="btn-secondary text-xs py-2.5 px-5 flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'ar' ? 'طباعة الفاتورة' : 'Print Invoice'}</span>
            </button>
            <Link
              to="/account"
              className="btn-primary text-xs py-2.5 px-6 flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>{lang === 'ar' ? 'متابعة وتتبع الطلب' : 'Track Order'}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          {lang === 'ar' ? 'إتمام الطلب والشحن' : 'Checkout'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {lang === 'ar' ? 'أدخل تفاصيل التوصيل واختر طريقة الدفع المناسبة' : 'Provide shipping address and select payment method'}
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Input Fields */}
        <div className="lg:col-span-8 space-y-6">
          {/* Contact Details Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-ocean-100 text-ocean-700 text-xs flex items-center justify-center font-black">
                1
              </span>
              <span>{lang === 'ar' ? 'بيانات العميل والتواصل' : 'Customer Details'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {lang === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="الكابتن أحمد حسني"
                  className="input-field py-2.5 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {lang === 'ar' ? 'رقم الهاتف / واتساب *' : 'Phone / WhatsApp *'}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+20 100 000 0000"
                  className="input-field py-2.5 text-xs"
                  dir="ltr"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {lang === 'ar' ? 'البريد الإلكتروني (لتلقي تفاصيل الشحنة)' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="angler@example.com"
                  className="input-field py-2.5 text-xs"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-ocean-100 text-ocean-700 text-xs flex items-center justify-center font-black">
                2
              </span>
              <span>{lang === 'ar' ? 'عنوان التوصيل' : 'Shipping Address'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {lang === 'ar' ? 'المحافظة / المدينة *' : 'City / Governorate *'}
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="input-field py-2.5 text-xs font-semibold"
                >
                  <option value="القاهرة">القاهرة</option>
                  <option value="الإسكندرية">الإسكندرية</option>
                  <option value="السويس">السويس</option>
                  <option value="بورسعيد">بورسعيد</option>
                  <option value="البحر الأحمر - الغردقة">البحر الأحمر - الغردقة</option>
                  <option value="جنوب سيناء - شرم الشيخ">جنوب سيناء - شرم الشيخ</option>
                  <option value="مطروح والساحل">مطروح والساحل الشمالي</option>
                  <option value="جدة / الرياض (شحن دولي)">جدة / الرياض (شحن دولي)</option>
                  <option value="محافظات أخرى">محافظات أخرى</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {lang === 'ar' ? 'الرمز البريدي (اختياري)' : 'Postal Code'}
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="11511"
                  className="input-field py-2.5 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {lang === 'ar' ? 'العنوان التفصيلي (الشارع، رقم المبنى، علامة مميزة) *' : 'Street Address *'}
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={lang === 'ar' ? 'شارع الكورنيش، عمارة 12، بجوار الميناء' : 'Building, Street, Landmark'}
                  className="input-field py-2.5 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {lang === 'ar' ? 'ملاحظات لمندوب التوصيل' : 'Delivery Notes'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={lang === 'ar' ? 'يرجى الاتصال قبل الوصول بنصف ساعة...' : 'Call before delivery...'}
                  className="input-field py-2.5 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-ocean-100 text-ocean-700 text-xs flex items-center justify-center font-black">
                3
              </span>
              <span>{lang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'cod' as const,
                  title_ar: 'الدفع نقداً عند الاستلام (COD)',
                  title_en: 'Cash on Delivery (COD)',
                  desc: 'ادفع للمندوب عند استلام ومعاينة عتاد الصيد',
                  icon: <Banknote className="w-5 h-5 text-emerald-600" />,
                },
                {
                  id: 'card' as const,
                  title_ar: 'بطاقة ائتمانية / فيزا / ماستركارد',
                  title_en: 'Credit / Debit Card',
                  desc: 'دفع إلكتروني آمن ومشفر 100%',
                  icon: <CreditCard className="w-5 h-5 text-ocean-600" />,
                },
                {
                  id: 'wallet' as const,
                  title_ar: 'فودافون كاش ومحافظ إلكترونية',
                  title_en: 'Vodafone Cash & Wallets',
                  desc: 'تحويل سريع عبر المحفظة الرقمية',
                  icon: <Smartphone className="w-5 h-5 text-rose-600" />,
                },
                {
                  id: 'mada' as const,
                  title_ar: 'مدى / Apple Pay',
                  title_en: 'Mada / Apple Pay',
                  desc: 'دفع فوري مخصص لدول الخليج',
                  icon: <ShieldCheck className="w-5 h-5 text-teal-600" />,
                },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === m.id
                      ? 'border-ocean-600 bg-ocean-50/70 shadow-sm ring-2 ring-ocean-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id)}
                    className="mt-1 text-ocean-600 focus:ring-ocean-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {m.icon}
                      <span className="font-bold text-xs text-slate-900">
                        {lang === 'ar' ? m.title_ar : m.title_en}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{m.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right / Checkout Summary */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 sticky top-24">
          <h3 className="font-extrabold text-slate-900 text-lg pb-3 border-b border-slate-100">
            {lang === 'ar' ? 'تفاصيل الفاتورة' : 'Invoice Details'}
          </h3>

          {/* Quick Items Preview */}
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {items.map(({ product, quantity, selectedOption }) => (
              <div key={`${product.id}-${selectedOption || ''}`} className="flex gap-3 text-xs">
                <img
                  src={product.images[0]}
                  alt={product.title_ar}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 line-clamp-1">{lang === 'ar' ? product.title_ar : product.title_en}</div>
                  <div className="text-slate-400">{quantity} × {product.price.toLocaleString()} EGP</div>
                </div>
                <span className="font-extrabold text-slate-900">{(product.price * quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Summary Calculation */}
          <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
            <div className="flex justify-between">
              <span>{lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
              <span className="font-bold text-slate-900">{subtotal.toLocaleString()} EGP</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>{lang === 'ar' ? 'الخصم' : 'Discount'}</span>
                <span>-{discount.toLocaleString()} EGP</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>{lang === 'ar' ? 'الشحن والتوصيل' : 'Shipping'}</span>
              <span>
                {shippingCost === 0 ? (
                  <span className="text-emerald-600 font-bold">{lang === 'ar' ? 'مجاني 🚀' : 'FREE'}</span>
                ) : (
                  `${shippingCost} EGP`
                )}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
              <span>{lang === 'ar' ? 'المبلغ المستحق' : 'Total Due'}</span>
              <span className="text-ocean-700 text-xl">{total.toLocaleString()} EGP</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-4 text-sm font-bold shadow-ocean-600/30 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>{lang === 'ar' ? 'جاري تجهيز الطلب...' : 'Processing...'}</span>
            ) : (
              <>
                <span>{lang === 'ar' ? 'تأكيد وإتمام الطلب الآن' : 'Confirm Order Now'}</span>
                {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{lang === 'ar' ? 'ضمان أمان المعاملة وجودة المعدات 100%' : '100% Quality & Security Guaranteed'}</span>
          </div>
        </div>
      </form>
    </div>
  );
}
