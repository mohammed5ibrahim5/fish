import { useState, useEffect } from 'react';
import {
  Trophy,
  Heart,
  Plus,
  MapPin,
  Sparkles,
  CheckCircle2,
  X,
  Fish,
  Camera
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/Toast';
import { DataService } from '@/lib/dataService';
import type { CommunityCatch } from '@/lib/types';

export default function CommunityPage() {
  const { lang } = useLanguage();
  const { success } = useToast();

  const [catches, setCatches] = useState<CommunityCatch[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [anglerName, setAnglerName] = useState('');
  const [fishSpecies, setFishSpecies] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [location, setLocation] = useState('');
  const [tackleUsed, setTackleUsed] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    DataService.getCommunityCatches().then(setCatches);
  }, []);

  const handleLike = async (catchId: string) => {
    await DataService.toggleLikeCatch(catchId);
    const updated = await DataService.getCommunityCatches();
    setCatches(updated);
  };

  const handleAddCatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!anglerName || !fishSpecies || !weightKg) {
      alert('يرجى ملء الحقول المطلوبة');
      return;
    }

    await DataService.addCommunityCatch({
      angler_name: anglerName,
      fish_species: fishSpecies,
      weight_kg: Number(weightKg),
      location: location || 'البحر الأحمر',
      tackle_used: tackleUsed || 'عدة صيد شيمانو كاستينج',
      image: imageUrl || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      date: new Date().toISOString().split('T')[0],
    });

    const updated = await DataService.getCommunityCatches();
    setCatches(updated);
    setIsModalOpen(false);
    setAnglerName('');
    setFishSpecies('');
    setWeightKg('');
    setLocation('');
    setTackleUsed('');
    setImageUrl('');
    success('تمت إضافة صيدتك بنجاح إلى معرض مجتمع الصيادين! 🎣');
  };

  const topCatch = catches[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-ocean-950 via-slate-900 to-ocean-900 text-white rounded-3xl p-8 sm:p-12 border border-ocean-800/60 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-bold">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'ar' ? 'معرض صيدات الصيادين ومسابقة الشهر' : 'Catch of the Month Hall of Fame'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">
            {lang === 'ar' ? 'مجتمع صيادي صيد برو' : 'Anglers Community Hub'}
          </h1>
          <p className="text-xs sm:text-sm text-ocean-200 leading-relaxed">
            {lang === 'ar'
              ? 'شاركنا صور صيداتك البحرية، الأوزان القياسية، والعتاد الذي استخدمته وتنافس على جوائز وكوبونات صيدة الشهر!'
              : 'Showcase your trophy catches, record weights, and winning tackle setups to win monthly gear prizes.'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary py-3.5 px-6 text-xs font-bold flex items-center gap-2 bg-gradient-to-r from-ocean-500 to-sky-500 shadow-xl shrink-0"
        >
          <Camera className="w-4 h-4" />
          <span>{lang === 'ar' ? 'شارك صيدتك الآن' : 'Submit Your Catch'}</span>
        </button>
      </div>

      {/* Spotlight: Catch of the Month */}
      {topCatch && (
        <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-ocean-950 rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-amber-400/40 relative shadow-xl">
              <img src={topCatch.image} alt={topCatch.fish_species} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 badge bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg">
                <Trophy className="w-3.5 h-3.5" />
                <span>صيدة الشهر الذهبية 🏆</span>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4 text-white">
              <span className="text-xs text-amber-400 font-extrabold uppercase tracking-wider">
                🌟 الصيدة الأكثر إعجاباً وتفاعلاً
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">{topCatch.fish_species}</h2>

              <div className="grid grid-cols-2 gap-3 text-xs bg-white/5 p-4 rounded-2xl border border-white/10">
                <div>
                  <span className="text-slate-400 block text-[11px]">الكابتن الصياد:</span>
                  <span className="font-bold text-white text-sm">{topCatch.angler_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">الوزن القياسي:</span>
                  <span className="font-black text-amber-400 text-base">{topCatch.weight_kg} كجم</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">الموقع:</span>
                  <span className="font-semibold text-ocean-300">{topCatch.location}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">التاريخ:</span>
                  <span className="font-semibold text-slate-300">{topCatch.date}</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-slate-400 font-semibold block">العدة المستخدمة في الاصطياد:</span>
                <span className="text-white font-bold bg-white/10 px-3 py-1.5 rounded-xl block border border-white/10">
                  🎣 {topCatch.tackle_used}
                </span>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={() => handleLike(topCatch.id)}
                  className="btn-secondary py-2 px-5 text-xs text-white border-white/20 hover:bg-white/10 flex items-center gap-2"
                >
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>{topCatch.likes_count} إعجاب وتصويت</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Community Gallery Grid */}
      <div className="space-y-6">
        <h3 className="text-xl font-extrabold text-slate-900">
          {lang === 'ar' ? 'أحدث صيدات الصيادين المشاركة' : 'Recent Angler Submissions'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {catches.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img src={c.image} alt={c.fish_species} className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 right-3 badge bg-slate-950/80 text-white backdrop-blur-md text-xs font-black">
                    ⚖️ {c.weight_kg} كجم
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-base text-slate-900">{c.fish_species}</h4>
                    <span className="text-[11px] text-slate-400" dir="ltr">{c.date}</span>
                  </div>

                  <div className="text-xs text-ocean-700 font-bold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-ocean-500" />
                    <span>{c.location}</span>
                  </div>

                  <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block mb-0.5">الصياد: <b>{c.angler_name}</b></span>
                    <span className="text-[11px] text-slate-700 block truncate">العدة: {c.tackle_used}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                <button
                  onClick={() => handleLike(c.id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 py-2 transition-colors"
                >
                  <Heart className="w-4 h-4 fill-rose-50 text-rose-500 hover:fill-rose-500" />
                  <span>{c.likes_count} إعجاب</span>
                </button>

                <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  صيدة موثقة
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Submit Catch */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5 animate-slide-up text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900">شارك صيدتك في المعرض 🎣</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCatch} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">اسم الصياد *</label>
                  <input
                    type="text"
                    required
                    value={anglerName}
                    onChange={(e) => setAnglerName(e.target.value)}
                    placeholder="الكابتن ..."
                    className="input-field py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">نوع السمكة *</label>
                  <input
                    type="text"
                    required
                    value={fishSpecies}
                    onChange={(e) => setFishSpecies(e.target.value)}
                    placeholder="تونة / ناجل / هامور / كنعد..."
                    className="input-field py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">الوزن التقريبي (كجم) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="مثال: 12.5"
                    className="input-field py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">مكان الصيد</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="شرم الشيخ، السويس، فرسان..."
                    className="input-field py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">العدة والمعدات المستخدمة</label>
                <input
                  type="text"
                  value={tackleUsed}
                  onChange={(e) => setTackleUsed(e.target.value)}
                  placeholder="سنارة كاستينج + بكرة 6000 + طعم جيج 80g..."
                  className="input-field py-2 text-xs"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">رابط صورة الصيدة (Image URL)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="input-field py-2 text-xs"
                  dir="ltr"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-ghost py-2 px-4 text-slate-500"
                >
                  إلغاء
                </button>
                <button type="submit" className="btn-primary py-2 px-6 font-bold">
                  نشر الصيدة الآن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
