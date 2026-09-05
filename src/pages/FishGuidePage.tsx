import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Fish,
  Search,
  Compass,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Anchor,
  Activity,
  Layers
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DataService } from '@/lib/dataService';
import type { FishSpecies } from '@/lib/types';

export default function FishGuidePage() {
  const { lang, dir } = useLanguage();
  const [species, setSpecies] = useState<FishSpecies[]>([]);
  const [search, setSearch] = useState('');
  const [waterFilter, setWaterFilter] = useState<'all' | 'saltwater' | 'freshwater'>('all');
  const [selectedFish, setSelectedFish] = useState<FishSpecies | null>(null);

  useEffect(() => {
    DataService.getFishSpecies().then(setSpecies);
  }, []);

  const filtered = species.filter((f) => {
    const matchSearch =
      (f.name_ar + ' ' + f.name_en + ' ' + f.scientific_name).toLowerCase().includes(search.toLowerCase());
    const matchWater = waterFilter === 'all' || f.water_type === waterFilter || f.water_type === 'both';
    return matchSearch && matchWater;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-ocean-950 via-slate-900 to-ocean-900 text-white rounded-3xl p-8 sm:p-12 border border-ocean-800/60 shadow-xl relative overflow-hidden text-center sm:text-start">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-ocean-500/20 text-ocean-300 border border-ocean-400/30 px-3.5 py-1 rounded-full text-xs font-bold">
            <Fish className="w-4 h-4 text-ocean-400" />
            <span>{lang === 'ar' ? 'موسوعة ودليل الصياد الميداني الشامل' : 'Red Sea & Med Fish Encyclopedia'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">
            {lang === 'ar' ? 'موسوعة الأسماك وطرق صيدها' : 'Fish Species & Catch Guide'}
          </h1>
          <p className="text-xs sm:text-sm text-ocean-200 leading-relaxed">
            {lang === 'ar'
              ? 'دليلك المتكامل لمعرفة مواسم تواجد الأسماك، الأعماق المفضلة، وأفضل الطعوم والتقنيات المجربة لاصطياد كل سمكة.'
              : 'Complete tactical guide on seasons, depths, best lures, and proven techniques for trophy fish.'}
          </p>
        </div>
      </div>

      {/* Toolbar (Search & Water Type Filter) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <input
            type="text"
            placeholder={lang === 'ar' ? 'ابحث باسم السمكة (تونة، ناجل، هامور، قاروص...)' : 'Search fish species...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field py-2.5 pr-9 pl-3 text-xs rounded-xl"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border text-xs font-bold">
          <button
            onClick={() => setWaterFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              waterFilter === 'all' ? 'bg-white shadow text-ocean-700 font-black' : 'text-slate-600'
            }`}
          >
            {lang === 'ar' ? 'الكل' : 'All'}
          </button>
          <button
            onClick={() => setWaterFilter('saltwater')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              waterFilter === 'saltwater' ? 'bg-white shadow text-ocean-700 font-black' : 'text-slate-600'
            }`}
          >
            {lang === 'ar' ? 'مياه مالحة (بحر)' : 'Saltwater'}
          </button>
          <button
            onClick={() => setWaterFilter('freshwater')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              waterFilter === 'freshwater' ? 'bg-white shadow text-ocean-700 font-black' : 'text-slate-600'
            }`}
          >
            {lang === 'ar' ? 'مياه عذبة (نيل/بحيرات)' : 'Freshwater'}
          </button>
        </div>
      </div>

      {/* Fish Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map((fish) => (
          <div
            key={fish.id}
            className="bg-white rounded-3xl border border-slate-200/90 hover:border-ocean-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Image Banner */}
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                <img
                  src={fish.image}
                  alt={fish.name_ar}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 badge bg-slate-950/80 text-white backdrop-blur-md text-xs font-bold">
                  {fish.water_type === 'saltwater' ? '🌊 مياه مالحة' : '🏞️ مياه عذبة ومالحة'}
                </div>
              </div>

              {/* Fish Data */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">{fish.name_ar}</h3>
                  <div className="text-xs text-ocean-600 font-bold italic">{fish.scientific_name}</div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{fish.description_ar}</p>

                {/* Key Metrics Table */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[11px]">موسم الصيد والذروة:</span>
                    <span className="font-bold text-slate-900">{fish.best_season_ar}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">الوزن المعتاد:</span>
                    <span className="font-bold text-ocean-700">{fish.avg_weight_kg}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">العمق المفضل:</span>
                    <span className="font-bold text-slate-900">{fish.depth_range}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">الموطن والتواجد:</span>
                    <span className="font-semibold text-slate-800 line-clamp-1">{fish.habitat_ar}</span>
                  </div>
                </div>

                {/* Preferred Lures & Techniques */}
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-slate-800">🎯 أفضل الطعوم والتقنيات المجربة:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {fish.preferred_lures_ar.map((lure, i) => (
                      <span key={i} className="badge bg-ocean-50 text-ocean-700 border border-ocean-200">
                        {lure}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA to buy gear */}
            <div className="p-6 pt-0">
              <Link
                to={`/shop?category=${fish.recommended_category}`}
                className="btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-ocean-600/30"
              >
                <span>تسوق عتاد وطعوم صيد {fish.name_ar.split(' ')[0]}</span>
                {dir === 'rtl' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
