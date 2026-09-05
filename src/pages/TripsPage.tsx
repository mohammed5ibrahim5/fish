import { useState, useEffect } from 'react';
import {
  Compass,
  Clock,
  Users,
  MapPin,
  Star,
  CheckCircle2,
  Calendar,
  Phone,
  ShieldCheck,
  Send,
  X
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/Toast';
import { DataService } from '@/lib/dataService';
import type { BoatTrip } from '@/lib/types';

export default function TripsPage() {
  const { lang } = useLanguage();
  const { success } = useToast();

  const [trips, setTrips] = useState<BoatTrip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<BoatTrip | null>(null);
  const [bookingType, setBookingType] = useState<'individual' | 'private'>('individual');
  const [anglersCount, setAnglersCount] = useState(1);
  const [bookingDate, setBookingDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    DataService.getBoatTrips().then(setTrips);
  }, []);

  const handleOpenBooking = (trip: BoatTrip) => {
    setSelectedTrip(trip);
    setBookingType('individual');
    setAnglersCount(1);
    setBookingDate(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
    setIsBooked(false);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !bookingDate) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    setIsBooked(true);
    success('تم تسجيل حجز رحلتك بنجاح! سيتواصل معك كابتن الرحلة لتأكيد نقطة الانطلاق.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-ocean-950 via-slate-900 to-ocean-900 text-white rounded-3xl p-8 sm:p-12 border border-ocean-800/60 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-ocean-500/20 text-ocean-300 border border-ocean-400/30 px-3.5 py-1 rounded-full text-xs font-bold">
            <Compass className="w-4 h-4 text-ocean-400 animate-spin-slow" />
            <span>{lang === 'ar' ? 'رحلات ولانشات صيد بحرية معتمدة' : 'Official Fishing Boat Charters'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">
            {lang === 'ar' ? 'حجز رحلات الصيد واليخوت البحرية' : 'Book Deep Sea Fishing Charters'}
          </h1>
          <p className="text-xs sm:text-sm text-ocean-200 leading-relaxed">
            {lang === 'ar'
              ? 'انطلق في أعظم مغامرة صيد بحري في البحر الأحمر والمتوسط على قوارب مجهزة بأحدث السونارات وكباتن معتمدين.'
              : 'Join tournament-grade boat trips and charters equipped with cutting-edge fishfinders and veteran skippers.'}
          </p>
        </div>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="bg-white rounded-3xl border border-slate-200/90 hover:border-ocean-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img src={trip.image} alt={trip.title_ar} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 badge bg-slate-950/80 text-white backdrop-blur-md text-xs font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{trip.rating}</span>
                  <span className="text-slate-400 font-normal">({trip.reviews_count})</span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-ocean-600 font-bold mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{trip.location_ar}</span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">{trip.title_ar}</h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{trip.description_ar}</p>

                <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-ocean-600" />
                      المدة:
                    </span>
                    <span className="font-bold text-slate-900">{trip.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Users className="w-3.5 h-3.5 text-ocean-600" />
                      أقصى عدد:
                    </span>
                    <span className="font-bold text-slate-900">{trip.max_anglers} صيادين</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">العدة والطعوم:</span>
                    <span className="text-emerald-600 font-bold">✓ متوفرة وشاملة</span>
                  </div>
                </div>

                {/* Target Fish Tags */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-700">الأسماك المستهدفة بالرحلة:</div>
                  <div className="flex flex-wrap gap-1">
                    {trip.target_species.map((sp, i) => (
                      <span key={i} className="badge bg-slate-100 text-slate-700 text-[10px]">
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Price & Booking Button */}
            <div className="p-6 pt-0 border-t border-slate-100 mt-4">
              <div className="flex items-baseline justify-between mb-4 pt-3">
                <div>
                  <span className="text-xl font-black text-ocean-700">{trip.price_per_person.toLocaleString()} EGP</span>
                  <span className="text-xs text-slate-400 mr-1">/ للفرد</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  أو <b className="text-slate-800">{trip.private_boat_price.toLocaleString()} EGP</b> قارب خاص
                </div>
              </div>

              <button
                onClick={() => handleOpenBooking(trip)}
                className="btn-primary w-full py-3 text-xs font-bold shadow-ocean-600/30"
              >
                حجز موعد الرحلة الآن
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 animate-slide-up text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs text-ocean-600 font-bold block">تأكيد حجز رحلة صيد</span>
                <h3 className="text-base font-black text-slate-900">{selectedTrip.title_ar}</h3>
              </div>
              <button
                onClick={() => setSelectedTrip(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isBooked ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto border-2 border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-slate-900">تم تسجيل طلب الحجز بنجاح!</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                  شكراً لك كابتن {customerName}. سنتصل بك على الهاتف ({customerPhone}) للتأكيد النهائي وتزويدك بموقع اللانش بالضبط.
                </p>
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="btn-primary py-2.5 px-6 text-xs"
                >
                  إغلاق
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
                {/* Trip Type */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBookingType('individual')}
                    className={`p-3 rounded-2xl border text-right transition-all ${
                      bookingType === 'individual'
                        ? 'border-ocean-600 bg-ocean-50 text-ocean-800 font-bold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <div>حجز فردي (تذكرة)</div>
                    <div className="text-xs font-black mt-1 text-ocean-700">
                      {selectedTrip.price_per_person.toLocaleString()} EGP / فرد
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBookingType('private')}
                    className={`p-3 rounded-2xl border text-right transition-all ${
                      bookingType === 'private'
                        ? 'border-ocean-600 bg-ocean-50 text-ocean-800 font-bold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <div>قارب خاص بالكامل (VIP)</div>
                    <div className="text-xs font-black mt-1 text-ocean-700">
                      {selectedTrip.private_boat_price.toLocaleString()} EGP
                    </div>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">اسم العميل / الكابتن *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="الكابتن ..."
                      className="input-field py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">رقم الهاتف / واتساب *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+20 100 000 0000"
                      className="input-field py-2 text-xs"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">تاريخ الرحلة المفضل *</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="input-field py-2 text-xs"
                    />
                  </div>

                  {bookingType === 'individual' && (
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">عدد الصيادين المرافقين</label>
                      <input
                        type="number"
                        min="1"
                        max={selectedTrip.max_anglers}
                        value={anglersCount}
                        onChange={(e) => setAnglersCount(Number(e.target.value))}
                        className="input-field py-2 text-xs"
                      />
                    </div>
                  )}
                </div>

                {/* Total estimation */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-700">المبلغ التقديري للرحلة:</span>
                  <span className="text-lg font-black text-ocean-700">
                    {(bookingType === 'individual'
                      ? selectedTrip.price_per_person * anglersCount
                      : selectedTrip.private_boat_price
                    ).toLocaleString()}{' '}
                    EGP
                  </span>
                </div>

                <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedTrip(null)}
                    className="btn-ghost text-xs py-2 px-4 text-slate-500"
                  >
                    إلغاء
                  </button>
                  <button type="submit" className="btn-primary py-2.5 px-6 text-xs font-bold">
                    تأكيد حجز الرحلة
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
