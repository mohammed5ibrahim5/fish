import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Waves,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Mail,
  Send,
  Phone,
  MapPin,
  Heart
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from './Toast';

export default function Footer() {
  const { lang } = useLanguage();
  const { success } = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      success(
        lang === 'ar'
          ? 'تم اشتراكك بنجاح في نشرة عروض ومواسم الصيد!'
          : 'Subscribed to SeaPro Angler Newsletter!'
      );
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* 1. Value Proposition Guarantees */}
      <div className="border-b border-slate-800/80 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-ocean-500/10 text-ocean-400 flex items-center justify-center shrink-0 border border-ocean-500/20">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  {lang === 'ar' ? 'شحن سريع ومجاني' : 'Fast & Free Delivery'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {lang === 'ar' ? 'مجاني للطلبات فوق 1500 ج.م' : 'On orders over 1500 EGP'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  {lang === 'ar' ? 'ضمان أصلي 100%' : '100% Original Brands'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {lang === 'ar' ? 'وكلاء شيمانو ودايوا وبين' : 'Shimano, Daiwa & Penn'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  {lang === 'ar' ? 'استرجاع واستبدال مرن' : '14-Day Free Returns'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {lang === 'ar' ? 'خلال 14 يوم بكل سهولة' : 'Hassle-free guarantee'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  {lang === 'ar' ? 'استشارات كباتن صيد' : 'Pro Angler Support'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {lang === 'ar' ? 'دعم فني من خبراء الصيد' : 'Direct WhatsApp & Phone'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-ocean-600 flex items-center justify-center text-white">
                <Waves className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">صيد برو | SeaPro</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {lang === 'ar'
                ? 'الوجهة الأولى والموثوقة في مصر والشرق الأوسط لتجهيز محترفي وهواة الصيد بأقوى القصبات، البكرات، والطعوم التخصصية لصيد البحر الأحمر والمتوسط والبحيرات.'
                : 'The premier destination for offshore and inshore anglers in Egypt and the Middle East, supplying high-performance tackle for trophy catches.'}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-ocean-400" />
                <span dir="ltr">+20 100 000 0000</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-ocean-400" />
                <span>الإسكندرية - السويس - جدة</span>
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {lang === 'ar' ? 'المتجر والتصنيفات' : 'Shop Categories'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/shop?category=rods" className="hover:text-ocean-400 transition-colors">
                  {lang === 'ar' ? 'قصبات وصنانير الصيد' : 'Fishing Rods'}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=reels" className="hover:text-ocean-400 transition-colors">
                  {lang === 'ar' ? 'مكينات وبكرات السحب' : 'Fishing Reels'}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=lures" className="hover:text-ocean-400 transition-colors">
                  {lang === 'ar' ? 'الطعوم والجيجات الصناعية' : 'Lures & Jigs'}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=lines" className="hover:text-ocean-400 transition-colors">
                  {lang === 'ar' ? 'خيوط الحرير والليدر' : 'Braided Lines'}
                </Link>
              </li>
              <li>
                <Link to="/combo-builder" className="hover:text-amber-400 text-amber-300 font-bold transition-colors">
                  {lang === 'ar' ? 'مُنشئ تجميعة الصيد (-15%)' : 'Combo Builder (-15%)'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Angler Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {lang === 'ar' ? 'دليل وأدوات الصياد' : 'Angler Resources'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/fish-guide" className="hover:text-ocean-400 transition-colors">
                  {lang === 'ar' ? 'موسوعة الأسماك وطرق صيدها' : 'Fish Species Guide'}
                </Link>
              </li>
              <li>
                <Link to="/trips" className="hover:text-ocean-400 transition-colors">
                  {lang === 'ar' ? 'حجز رحلات ولانشات الصيد' : 'Boat Trips & Charters'}
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-ocean-400 transition-colors">
                  {lang === 'ar' ? 'معرض صيدات المجتمع' : 'Catch of the Month'}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-ocean-400 transition-colors">
                  {lang === 'ar' ? 'دليل مناطق ومواسم الصيد' : 'Fishing Spots Guide'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-ocean-400 transition-colors">
                  {lang === 'ar' ? 'الأسئلة الشائعة والدعم' : 'FAQs & Support'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {lang === 'ar' ? 'نشرة عروض ومواسم الصيد' : 'Angler Newsletter'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'ar'
                ? 'احصل على تنبيهات مواسم هجرة الأسماك وكوبونات الخصم الحصرية أسبوعياً.'
                : 'Get weekly migration forecasts and exclusive promo codes.'}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="angler@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pr-8 pl-3 text-xs text-white placeholder:text-slate-600 focus:border-ocean-500 outline-none"
                  dir="ltr"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute right-2.5 top-3" />
              </div>
              <button
                type="submit"
                className="w-full btn-primary py-2 px-4 text-xs font-bold flex items-center justify-center gap-1.5 bg-ocean-600 hover:bg-ocean-700"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'اشتراك مجاني' : 'Subscribe'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* 3. Bottom Bar & Copyrights */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} صيد برو (SeaPro Tackle Store). {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-2 text-slate-400">
            <span>صُنع بعناية وشغف لعشاق الصيد البحري</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
