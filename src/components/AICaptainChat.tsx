import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShoppingBag,
  Fish,
  Compass
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { DataService } from '@/lib/dataService';
import type { Product } from '@/lib/types';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  recommendedProducts?: Product[];
  timestamp: string;
}

export default function AICaptainChat() {
  const { lang, dir } = useLanguage();
  const { addToCart } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialWelcomeMessage: Message = {
    id: 'msg-welcome',
    sender: 'ai',
    text:
      lang === 'ar'
        ? 'يا هلا بيك يا كابتن! ⚓ أنا المساعد الذكي لموقع صيد برو. اسألني عن أي نوع سمك، كيفية اختيار السنارة أو البكرة المناسبة، مواسم الصيد في البحر الأحمر والمتوسط، وسأرشح لك أفضل عتاد فوراً!'
        : 'Welcome aboard, Captain! ⚓ I am SeaPro AI Fishing Assistant. Ask me anything about tackle setups, lure choices, target species, or fishing seasons!',
    timestamp: 'الآن',
  };

  const [messages, setMessages] = useState<Message[]>([initialWelcomeMessage]);

  useEffect(() => {
    DataService.getProducts().then(setAllProducts);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    { label_ar: '🎣 أفضل طقم كاستينج للمبتدئين', query: 'أفضل طقم كاستينج للمبتدئين' },
    { label_ar: '🐟 طعوم صيد الهامور والناجل', query: 'أفضل طعوم لصيد الهامور والناجل' },
    { label_ar: '🌊 ماكينات السحب الثقيل المقاومة للأملاح', query: 'ماكينات صيد ثقيلة مقاومة للملوحة' },
    { label_ar: '🧵 ما هو أفضل خيط حرير (Braid)؟', query: 'أفضل خيوط حرير بريد 8X' },
  ];

  const generateAIResponse = (userQuery: string): { reply: string; matched: Product[] } => {
    const q = userQuery.toLowerCase();
    let reply = '';
    let matched: Product[] = [];

    if (q.includes('كاستينج') || q.includes('casting') || q.includes('سنارة') || q.includes('قصبة') || q.includes('مبتدئ')) {
      reply =
        lang === 'ar'
          ? 'لصيد الكاستينج والشاطئ، ننصح بقصبات الكربون خفيفة الوزن ذات الرمي الطويل (2.7 إلى 3.05 متر) مع ماكينة مقاس 4000-6000 وخيط حرير 8X ناعم ليمنحك أقصى مدى رمي واختراق للرياح.'
          : 'For shore casting, high-modulus 2.7m-3.05m rods with 4000-6000 series reels and 8X PE line provide supreme casting distance.';
      matched = allProducts.filter((p) => p.category_slug === 'rods' || p.brand === 'Shimano').slice(0, 2);
    } else if (q.includes('هامور') || q.includes('ناجل') || q.includes('طعم') || q.includes('جيج') || q.includes('lure') || q.includes('jig')) {
      reply =
        lang === 'ar'
          ? 'لصيد أسماك القاع المفترسة مثل الهامور والناجل، أفضل خيار هو الجيجات المضيئة (Glow Jigs) بوزن 80-150 جرام مع هوكات مزدوجة قوية BKK، أو طعوم الغطس العميق (X-Rap).'
          : 'For Grouper and Coral Trout, Glow Slow Jigs (80-150g) with heavy twin assist hooks or deep diving plugs are unmatched.';
      matched = allProducts.filter((p) => p.category_slug === 'lures').slice(0, 2);
    } else if (q.includes('ماكينة') || q.includes('بكرة') || q.includes('reel') || q.includes('ملوحة') || q.includes('سحب')) {
      reply =
        lang === 'ar'
          ? 'البكرات البحرية تتطلب نظام إحكام ضد الملوحة (Magsealed أو IPX6) ودراج كربوني لا يقل عن 15 كجم للتحكم في الأسماك العنيدة.'
          : 'Offshore saltwater reels need IPX6 or Magsealed protection with high-drag carbon washers (15kg+).';
      matched = allProducts.filter((p) => p.category_slug === 'reels').slice(0, 2);
    } else if (q.includes('خيط') || q.includes('حرير') || q.includes('line') || q.includes('braid')) {
      reply =
        lang === 'ar'
          ? 'خيوط الحرير اليابانية 8X المضفورة تعطي أعلى قوة شد مع أقل سُمك ممكن، ونوصي بربط ليدر فلوروكربون خفي في المقدمة لمنع احتكاك الصخور.'
          : 'Japanese 8X braided PE lines offer zero stretch and superior knot strength. Always pair with fluorocarbon leaders.';
      matched = allProducts.filter((p) => p.category_slug === 'lines').slice(0, 2);
    } else {
      reply =
        lang === 'ar'
          ? 'سؤال ممتاز يا كابتن! في صيد برو نوفر أحدث المعدات البحرية المعتمدة لجميع أنواع الصيد (كاستينج، جيجينج، ترولينج، غوص). إليك تشكيلة مختارة تناسب تساؤلك:'
          : 'Great question, Captain! We have curated tournament-ready tackle perfectly suited for your fishing adventures:';
      matched = allProducts.slice(0, 2);
    }

    return { reply, matched };
  };

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const { reply, matched } = generateAIResponse(textToSend);
      const aiMsg: Message = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'ai',
        text: reply,
        recommendedProducts: matched,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className={`fixed bottom-5 ${dir === 'rtl' ? 'left-5' : 'right-5'} z-40`}>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 bg-gradient-to-r from-ocean-700 via-ocean-600 to-sky-500 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl hover:shadow-ocean-500/50 hover:scale-105 transition-all duration-300 border-2 border-white/20"
          >
            <div className="relative">
              <Compass className="w-6 h-6 animate-spin-slow text-amber-300" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-ping" />
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-xs font-black flex items-center gap-1">
                <span>{lang === 'ar' ? 'كابتن صيد برو' : 'Captain AI'}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <div className="text-[10px] text-ocean-100 font-semibold">
                {lang === 'ar' ? 'مساعدك الذكي المباشر' : 'Ask Anything'}
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Chat Window Dialog */}
      {isOpen && (
        <div
          className={`fixed bottom-5 ${
            dir === 'rtl' ? 'left-4 sm:left-6' : 'right-4 sm:right-6'
          } z-50 w-[92vw] sm:w-[420px] max-h-[640px] h-[82vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-slide-up`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-ocean-950 via-ocean-900 to-slate-950 p-4 text-white flex items-center justify-between border-b border-ocean-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-ocean-500 to-sky-400 flex items-center justify-center text-white border border-white/20 shadow-md">
                <Compass className="w-6 h-6 animate-spin-slow text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-white">
                  <span>{lang === 'ar' ? 'كابتن صيد برو (AI Advisor)' : 'SeaPro Captain AI'}</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h3>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{lang === 'ar' ? 'متصل وجاهز للإجابة فوراً' : 'Online & Ready'}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-ocean-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`space-y-2 max-w-[85%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-ocean-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className={`text-[9px] block mt-1 ${msg.sender === 'user' ? 'text-ocean-200 text-left' : 'text-slate-400 text-right'}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Recommended Products Attachment Cards */}
                  {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                    <div className="space-y-2 pt-1 w-full">
                      <div className="text-[10px] font-bold text-ocean-700 flex items-center gap-1">
                        <Fish className="w-3 h-3" />
                        <span>{lang === 'ar' ? 'العدة المرشحة لك:' : 'Recommended Tackle:'}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {msg.recommendedProducts.map((prod) => (
                          <div
                            key={prod.id}
                            className="bg-white p-2.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-2.5 shadow-sm hover:border-ocean-300 transition-colors"
                          >
                            <img
                              src={prod.images[0]}
                              alt={prod.title_ar}
                              className="w-11 h-11 rounded-xl object-cover border border-slate-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/product/${prod.id}`}
                                onClick={() => setIsOpen(false)}
                                className="font-bold text-[11px] text-slate-900 hover:text-ocean-600 line-clamp-1 block"
                              >
                                {lang === 'ar' ? prod.title_ar : prod.title_en}
                              </Link>
                              <div className="text-ocean-700 font-extrabold text-[11px]">
                                {prod.price.toLocaleString()} EGP
                              </div>
                            </div>
                            <button
                              onClick={() => addToCart(prod, 1)}
                              className="p-2 rounded-xl bg-ocean-50 text-ocean-700 hover:bg-ocean-600 hover:text-white transition-colors"
                              title="أضف للسلة"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-xs text-slate-400">
                <div className="w-7 h-7 rounded-xl bg-ocean-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-200 flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-ocean-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-ocean-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-ocean-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(qp.query)}
                className="whitespace-nowrap px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-ocean-50 hover:text-ocean-700 text-slate-600 text-[10px] font-semibold transition-colors shrink-0"
              >
                {qp.label_ar}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={lang === 'ar' ? 'اسأل الكابتن عن أي عدة أو سمكة...' : 'Ask the Captain...'}
              className="flex-1 input-field py-2.5 px-3.5 text-xs bg-slate-50 border-slate-200 rounded-2xl outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="btn-primary p-2.5 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed bg-ocean-600 hover:bg-ocean-700"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
