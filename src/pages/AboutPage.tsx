import { Waves, ShieldCheck, Compass, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutPage() {
  const { lang } = useLanguage();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-ocean-950 via-slate-900 to-ocean-900 text-white py-16 px-4 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-ocean-600/30 border border-ocean-400/40 text-ocean-300 flex items-center justify-center mx-auto shadow-inner">
            <Waves className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black">
            {lang === 'ar' ? 'قصة صيد برو (SeaPro)' : 'The Story of SeaPro'}
          </h1>
          <p className="text-sm sm:text-base text-ocean-200 max-w-2xl mx-auto leading-relaxed">
            {lang === 'ar'
              ? 'بدأنا بشغف حقيقي بالبحر وأعماقه، واليوم نحن المنصة العربية الأولى المتخصصة في تزويد الصيادين بأحدث وأقوى معدات الصيد من كبرى الشركات العالمية.'
              : 'Founded by passionate offshore anglers, SeaPro is the premier destination for world-class fishing tackle in the Middle East.'}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-ocean-50 text-ocean-600 flex items-center justify-center border border-ocean-100">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-900 text-lg">
              {lang === 'ar' ? 'رؤيتنا ورسالتنا' : 'Our Mission'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'ar'
                ? 'تمكين كل صياد هاوٍ أو محترف من خوض تجربة صيد استثنائية من خلال توفير معدات معتمدة تم اختبارها ميدانياً في مياه البحر الأحمر والبحر المتوسط والخليج العربي.'
                : 'To empower every angler with tournament-grade, rigorously tested tackle tailored for Red Sea and Mediterranean waters.'}
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-900 text-lg">
              {lang === 'ar' ? 'الجودة والأصالة المطلقة' : 'Authenticity Guarantee'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'ar'
                ? 'لا نتنازل عن الجودة أبداً. جميع منتجاتنا مستوردة مباشرة من الوكلاء الرسميين لعلامات Shimano و Daiwa و Penn مع ضمان حقيقي وقطع غيار أصلية.'
                : 'We guarantee 100% genuine products directly sourced from global manufacturers with manufacturer warranties and replacement parts.'}
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-900 text-lg">
              {lang === 'ar' ? 'استشارات فنية من كباتن محترفين' : 'Expert Angler Support'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'ar'
                ? 'فريق الدعم الفني لدينا هم صيادون وكباتن بحر ذوو خبرة طويلة، جاهزون دائماً لترشيح العدة الأنسب لرحلتك القادمة ومساعدتك في اختيار الطعوم والخيوط.'
                : 'Our support team consists of seasoned skippers and tournament anglers ready to help you pick the exact tackle setup.'}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-ocean-900 text-white rounded-3xl p-8 sm:p-12 text-center grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-teal-300">+10,000</div>
            <div className="text-xs text-ocean-200 mt-1">{lang === 'ar' ? 'طلب ناجح تم تسليمه' : 'Delivered Orders'}</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-amber-400">+500</div>
            <div className="text-xs text-ocean-200 mt-1">{lang === 'ar' ? 'منتج ومعدة صيد أصلية' : 'Authentic Tackle Products'}</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-sky-300">15+</div>
            <div className="text-xs text-ocean-200 mt-1">{lang === 'ar' ? 'ماركة عالمية معتمدة' : 'Global Brand Partners'}</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400">99.4%</div>
            <div className="text-xs text-ocean-200 mt-1">{lang === 'ar' ? 'نسبة رضا الصيادين' : 'Angler Satisfaction'}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
