import { useState } from 'react';
import { Waves, Wind, Moon, Sun, Clock, Compass, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DataService } from '@/lib/dataService';

export default function WeatherWidget() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);
  const weather = DataService.getWeatherAndTides();

  return (
    <div className="bg-gradient-to-br from-ocean-950 via-ocean-900 to-slate-950 text-white rounded-3xl p-6 shadow-xl border border-ocean-800/40 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-ocean-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10 pb-4 border-b border-ocean-800/50">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-ocean-500/20 border border-ocean-400/30 flex items-center justify-center text-ocean-300 shadow-inner">
            <Waves className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="font-bold text-base text-white">
                {lang === 'ar' ? 'نشرة الطقس وحركة المد والجزر للصيد' : 'Live Fishing & Marine Forecast'}
              </h3>
            </div>
            <p className="text-xs text-ocean-300 mt-0.5">{weather.location}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <span>{lang === 'ar' ? 'مؤشر الصيد:' : 'Activity:'}</span>
            <span>{weather.fishing_index}</span>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg text-ocean-400 hover:text-white hover:bg-ocean-800/50 transition-colors"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 relative z-10 animate-fade-in">
          {/* Temperature & Condition */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 flex flex-col justify-between hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between text-ocean-300 mb-2">
              <span className="text-xs font-semibold">{lang === 'ar' ? 'حرارة الجو' : 'Temperature'}</span>
              <Sun className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{weather.temperature}°C</div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                {lang === 'ar' ? `المحسوسة ${weather.feels_like}°C` : `Feels like ${weather.feels_like}°C`}
              </div>
            </div>
          </div>

          {/* Wind Speed & Direction */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 flex flex-col justify-between hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between text-ocean-300 mb-2">
              <span className="text-xs font-semibold">{lang === 'ar' ? 'الرياح والاتجاه' : 'Wind & Dir'}</span>
              <Wind className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">
                {weather.wind_speed_knots} <span className="text-xs font-normal text-ocean-200">عقدة (Knots)</span>
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">{weather.wind_direction}</div>
            </div>
          </div>

          {/* Wave Height & Tide */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 flex flex-col justify-between hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between text-ocean-300 mb-2">
              <span className="text-xs font-semibold">{lang === 'ar' ? 'ارتفاع الموج والمد' : 'Waves & Tide'}</span>
              <Compass className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">
                {weather.wave_height_meters} <span className="text-xs font-normal text-ocean-200">متر</span>
              </div>
              <div className="text-[11px] text-emerald-300 font-semibold mt-0.5">{weather.tide_state}</div>
            </div>
          </div>

          {/* Moon Phase & Best Times */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 flex flex-col justify-between hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between text-ocean-300 mb-2">
              <span className="text-xs font-semibold">{lang === 'ar' ? 'طور القمر والذروة' : 'Moon & Best Times'}</span>
              <Moon className="w-4 h-4 text-purple-300" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {lang === 'ar' ? weather.moon_phase_ar : weather.moon_phase}
              </div>
              <div className="text-[11px] text-amber-300 font-medium flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3" />
                <span>{weather.best_time}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
