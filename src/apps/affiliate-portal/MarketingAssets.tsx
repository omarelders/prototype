import React, { useState } from 'react';
import { Copy, CheckCircle2, Download, Palette, Type, Hash } from 'lucide-react';

const BRAND_COLORS = [
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Teal', hex: '#14b8a6' },
  { name: 'Slate Dark', hex: '#1e293b' },
  { name: 'White', hex: '#ffffff' },
];

const HASHTAGS = '#AmalBila #تعليم_اون_لاين #مذاكرة #منصة_تعليمية #ادرس_معنا #مدرس_اون_لاين';

const SLOGANS = [
  { ar: 'تعلّم بلا حدود مع AmalBila', en: 'Learn without limits with AmalBila' },
  { ar: 'المنصة اللي بتفهمك', en: 'The platform that gets you' },
  { ar: 'مستقبلك يبدأ من هنا', en: 'Your future starts here' },
  { ar: 'تعليم احترافي في متناول يدك', en: 'Professional education at your fingertips' },
];

export default function MarketingAssets() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const CopyBtn = ({ text, id, label = 'Copy' }: { text: string; id: string; label?: string }) => (
    <button
      onClick={() => copyText(text, id)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
        copied === id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {copied === id ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied === id ? 'Copied!' : label}
    </button>
  );

  return (
    <div className="space-y-10 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Marketing Assets</h1>
        <p className="text-slate-500 font-semibold text-sm mt-1">Everything you need to promote AmalBila professionally.</p>
      </div>

      {/* Brand Colors */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-4 w-4 text-slate-500" />
          <h2 className="font-black text-slate-800">Brand Colors</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BRAND_COLORS.map((c) => (
            <button
              key={c.hex}
              onClick={() => copyText(c.hex, c.hex)}
              className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div className="h-16 w-full border-b border-slate-100" style={{ backgroundColor: c.hex }} />
              <div className="p-3 text-left">
                <p className="text-xs font-black text-slate-700">{c.name}</p>
                <p className="text-[10px] font-mono text-slate-400 flex items-center justify-between mt-0.5">
                  {c.hex}
                  {copied === c.hex ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100" />}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Hashtags */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Hash className="h-4 w-4 text-slate-500" />
          <h2 className="font-black text-slate-800">Hashtags</h2>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
          <div className="flex flex-wrap gap-2 mb-4">
            {HASHTAGS.split(' ').map((tag) => (
              <span key={tag} className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-bold">
                {tag}
              </span>
            ))}
          </div>
          <CopyBtn text={HASHTAGS} id="hashtags" label="Copy All Hashtags" />
        </div>
      </section>

      {/* Slogans */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Type className="h-4 w-4 text-slate-500" />
          <h2 className="font-black text-slate-800">Slogans & Taglines</h2>
        </div>
        <div className="space-y-3">
          {SLOGANS.map((s, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-black text-slate-800 text-sm">{s.ar}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{s.en}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <CopyBtn text={s.ar} id={`slogan-ar-${i}`} label="AR" />
                <CopyBtn text={s.en} id={`slogan-en-${i}`} label="EN" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Banner Cards — CSS-rendered */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Download className="h-4 w-4 text-slate-500" />
          <h2 className="font-black text-slate-800">Visual Banners</h2>
        </div>
        <p className="text-xs text-slate-400 font-medium mb-4">Screenshot these to use on your WhatsApp status, Stories, or social posts.</p>

        <div className="space-y-4">
          {/* Banner 1 */}
          <div
            className="rounded-2xl overflow-hidden shadow-lg"
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)', minHeight: 160 }}
          >
            <div className="p-8 flex flex-col items-center justify-center text-center">
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">منصة AmalBila</p>
              <h3 className="text-white text-3xl font-black leading-tight">تعلّم بلا حدود</h3>
              <p className="text-white/80 text-sm font-medium mt-2">محتوى + امتحانات + متابعة يومية</p>
              <div className="mt-4 bg-white/20 backdrop-blur px-6 py-2 rounded-full text-white text-xs font-bold">
                amalbila.com
              </div>
            </div>
          </div>

          {/* Banner 2 */}
          <div
            className="rounded-2xl overflow-hidden shadow-lg"
            style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', minHeight: 160 }}
          >
            <div className="p-8 flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1 w-12 bg-emerald-400 rounded" />
                <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">SPECIAL OFFER</span>
                <div className="h-1 w-12 bg-emerald-400 rounded" />
              </div>
              <h3 className="text-white text-2xl font-black leading-tight">سجّل دلوقتي</h3>
              <p className="text-slate-300 text-sm font-medium mt-2">وابدأ رحلتك التعليمية مع أحسن المعلمين</p>
              <div className="mt-4 bg-emerald-500 px-6 py-2 rounded-full text-white text-xs font-black shadow-lg shadow-emerald-900/40">
                ابدأ الآن →
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
