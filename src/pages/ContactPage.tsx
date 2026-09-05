import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/Toast';

export default function ContactPage() {
  const { lang } = useLanguage();
  const { success } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    success(lang === 'ar' ? 'تم إرسال رسالتك بنجاح! سنرد قريباً' : 'Message sent! We\'ll reply soon.');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="space-y-16 pb-16">
      <section className="bg-gradient-to-r from-ocean-950 via-slate-900 to-ocean-900 text-white py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black">
            {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
          </h1>
          <p className="text-sm text-ocean-200 max-w-2xl mx-auto">
            {lang === 'ar'
              ? 'فريقنا جاهز لمساعدتك في اختيار أفضل معدات الصيد والإجابة على أي استفسار'
              : 'Our team is ready to help you pick the best fishing gear and answer any questions'}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-ocean-50 text-ocean-600 flex items-center justify-center mx-auto border border-ocean-100">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900">{lang === 'ar' ? 'الهاتف' : 'Phone'}</h3>
          <p className="text-xs text-slate-500" dir="ltr">+20 100 123 4567</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</h3>
          <p className="text-xs text-slate-500">support@seapro.com</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900">{lang === 'ar' ? 'العنوان' : 'Address'}</h3>
          <p className="text-xs text-slate-500">{lang === 'ar' ? 'الإسكندرية، مصر' : 'Alexandria, Egypt'}</p>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xl font-black text-slate-900">
            {lang === 'ar' ? 'أرسل لنا رسالة' : 'Send us a Message'}
          </h2>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">{lang === 'ar' ? 'الاسم' : 'Name'}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field py-2.5 text-xs w-full rounded-xl"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field py-2.5 text-xs w-full rounded-xl"
              dir="ltr"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">{lang === 'ar' ? 'الرسالة' : 'Message'}</label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input-field py-2.5 text-xs w-full rounded-xl resize-none"
            />
          </div>
          <button type="submit" className="btn-primary py-3 px-6 text-xs font-bold flex items-center gap-2">
            <Send className="w-4 h-4" />
            <span>{lang === 'ar' ? 'إرسال' : 'Send'}</span>
          </button>
        </form>
      </section>
    </div>
  );
}
