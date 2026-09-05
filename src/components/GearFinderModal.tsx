import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Compass, Sparkles, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface GearFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GearFinderModal({ isOpen, onClose }: GearFinderModalProps) {
  const { lang, dir } = useLanguage();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [environment, setEnvironment] = useState<'sea' | 'lake' | 'shore'>('sea');
  const [fishingStyle, setFishingStyle] = useState<'casting' | 'jigging' | 'trolling' | 'spearfishing'>('casting');
  const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'pro'>('intermediate');

  if (!isOpen) return null;

  const handleFinish = () => {
    onClose();
    let searchCategory = '';
    if (fishingStyle === 'jigging' || fishingStyle === 'casting') searchCategory = 'rods';
    if (fishingStyle === 'spearfishing') searchCategory = 'spearfishing';
    if (fishingStyle === 'trolling') searchCategory = 'lures';

    navigate(`/shop?category=${searchCategory}&level=${experience}&env=${environment}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-ocean-900 via-ocean-800 to-ocean-950 p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-ocean-500/30 flex items-center justify-center border border-ocean-400/40 text-ocean-300">
                <Compass className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  {lang === 'ar' ? 'المساعد الذكي لاختيار عدة الصيد' : 'Smart Fishing Gear Finder'}
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h3>
                <p className="text-xs text-ocean-200">
                  {lang === 'ar'
                    ? 'أجب عن 3 أسئلة سريعة لنرشح لك أفضل عدة صيد مخصصة لك'
                    : 'Answer 3 quick questions for personalized gear recommendations'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Steps Indicator */}
          <div className="flex gap-2 mt-5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-ocean-400' : 'bg-ocean-900/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-base">
                {lang === 'ar' ? '1. أين تفضل الصيد في الغالب؟' : '1. Where do you usually go fishing?'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'sea' as const,
                    title_ar: 'البحر المفتوح وقوارب',
                    title_en: 'Offshore & Boat',
                    desc_ar: 'أعماق ومفترسات كبيرة',
                    icon: '🚢',
                  },
                  {
                    id: 'shore' as const,
                    title_ar: 'الشواطئ والصخور',
                    title_en: 'Shore & Rocks',
                    desc_ar: 'سيرف كاستينج وشور جيج',
                    icon: '🏖️',
                  },
                  {
                    id: 'lake' as const,
                    title_ar: 'البحيرات والأنهار',
                    title_en: 'Lakes & Fresh Water',
                    desc_ar: 'مياه عذبة وكاستينج خفيف',
                    icon: '🏞️',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setEnvironment(item.id)}
                    className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                      environment === item.id
                        ? 'border-ocean-600 bg-ocean-50/70 shadow-md ring-2 ring-ocean-500/20'
                        : 'border-slate-200 hover:border-ocean-300 bg-white'
                    }`}
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">
                        {lang === 'ar' ? item.title_ar : item.title_en}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{item.desc_ar}</div>
                    </div>
                    {environment === item.id && (
                      <div className="mt-2 text-ocean-600 flex items-center justify-end">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-base">
                {lang === 'ar' ? '2. ما هي تقنية وأسلوب الصيد المفضل لديك؟' : '2. What is your preferred fishing technique?'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'casting' as const,
                    title_ar: 'كاستينج وبوبينج (Casting)',
                    desc_ar: 'رمي الطعوم الصناعية وسحبها لاستهداف المفترسات',
                    icon: '🎣',
                  },
                  {
                    id: 'jigging' as const,
                    title_ar: 'جيجينج وسلو جيج (Jigging)',
                    desc_ar: 'إسقاط الجيجات المعدنية عمودياً لصيد أسماك القاع',
                    icon: '⚓',
                  },
                  {
                    id: 'trolling' as const,
                    title_ar: 'ترولينج وجري بالقارب (Trolling)',
                    desc_ar: 'سحب الطعوم خلف القارب أثناء الحركة للأسماك الكبيرة',
                    icon: '🚤',
                  },
                  {
                    id: 'spearfishing' as const,
                    title_ar: 'غوص وصيد بالرمح (Spearfishing)',
                    desc_ar: 'النزول تحت الماء وصيد الأسماك بالمسدس الحراري والمطاطي',
                    icon: '🤿',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFishingStyle(item.id)}
                    className={`p-4 rounded-2xl border text-right transition-all ${
                      fishingStyle === item.id
                        ? 'border-ocean-600 bg-ocean-50/70 shadow-md ring-2 ring-ocean-500/20'
                        : 'border-slate-200 hover:border-ocean-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-bold text-sm text-slate-900">{item.title_ar}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{item.desc_ar}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-base">
                {lang === 'ar' ? '3. ما هو مستوى خبرتك وميزانيتك؟' : '3. What is your experience & budget level?'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'beginner' as const,
                    title_ar: 'مبتدئ / هاوي',
                    desc_ar: 'أريد عدة عملية وسهلة الاستخدام واقتصادية',
                    icon: '🌱',
                  },
                  {
                    id: 'intermediate' as const,
                    title_ar: 'متوسط الخبرة',
                    desc_ar: 'أبحث عن أداء ممتاز وتوازن بين القوة والسعر',
                    icon: '⚡',
                  },
                  {
                    id: 'pro' as const,
                    title_ar: 'صياد محترف / كابتن',
                    desc_ar: 'أفضل أعلى فئات الماركات العالمية والكربون',
                    icon: '👑',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setExperience(item.id)}
                    className={`p-4 rounded-2xl border text-right transition-all ${
                      experience === item.id
                        ? 'border-ocean-600 bg-ocean-50/70 shadow-md ring-2 ring-ocean-500/20'
                        : 'border-slate-200 hover:border-ocean-300 bg-white'
                    }`}
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="font-bold text-sm text-slate-900">{item.title_ar}</div>
                    <div className="text-xs text-slate-500 mt-1">{item.desc_ar}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((p) => p - 1)}
              className="btn-ghost text-xs font-bold text-slate-600"
            >
              {lang === 'ar' ? 'السابق' : 'Back'}
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep((p) => p + 1)}
              className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2"
            >
              <span>{lang === 'ar' ? 'التالي' : 'Next'}</span>
              {dir === 'rtl' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="btn-primary py-2.5 px-6 text-xs bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{lang === 'ar' ? 'عرض التشكيلة المقترحة لي' : 'View My Recommended Gear'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
