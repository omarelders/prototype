import React, { useState } from 'react';
import { useAppState } from '../../shared/context/AppState';
import { Copy, CheckCircle2, MessageCircle, Share2, Link as LinkIcon, ExternalLink, QrCode } from 'lucide-react';

export default function ReferralLinks() {
  const { affiliates } = useAppState();
  const currentAffiliate = affiliates[0] || { id: 'a-1', name: 'Kareem Mostafa', referralCode: 'KAREEM26', commissionRate: 20 };

  const referralUrl = `https://amalbila.com/?ref=${currentAffiliate.referralCode}`;
  const [copied, setCopied] = useState<string | null>(null);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const CopyButton = ({ text, id }: { text: string; id: string }) => (
    <button
      onClick={() => copyText(text, id)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
        copied === id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {copied === id ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied === id ? 'Copied!' : 'Copy'}
    </button>
  );

  const shareLinks = [
    {
      name: 'WhatsApp',
      color: 'bg-[#25D366] hover:bg-[#20b557]',
      icon: <MessageCircle className="h-4 w-4" />,
      url: `https://wa.me/?text=${encodeURIComponent(`🎓 سجل الآن في AmalBila وابدأ رحلتك التعليمية!\n\nاستخدم رابطي الخاص:\n${referralUrl}`)}`,
    },
    {
      name: 'Facebook',
      color: 'bg-[#1877F2] hover:bg-[#1565d8]',
      icon: <Share2 className="h-4 w-4" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`,
    },
    {
      name: 'Open Link',
      color: 'bg-slate-700 hover:bg-slate-800',
      icon: <ExternalLink className="h-4 w-4" />,
      url: referralUrl,
    },
  ];

  const captions = [
    {
      id: 'caption-ar',
      label: '🇪🇬 Arabic Caption',
      text: `🎓 هل بتدور على منصة تعليمية احترافية؟\n\nجرب AmalBila — المنصة اللي بتربط الطلاب بأحسن المعلمين.\n\n✅ محتوى تعليمي ممتاز\n✅ امتحانات تفاعلية\n✅ متابعة يومية\n\nسجل دلوقتي من خلال رابطي:\n${referralUrl}`,
    },
    {
      id: 'caption-en',
      label: '🌍 English Caption',
      text: `Looking for a great online learning platform?\n\nCheck out AmalBila — connecting students with top teachers.\n\n✅ Rich lesson content\n✅ Interactive exams\n✅ Daily progress tracking\n\nSign up through my link:\n${referralUrl}`,
    },
  ];

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Your Referral Links</h1>
        <p className="text-slate-500 font-semibold text-sm mt-1">Share your unique link and earn a commission on every signup.</p>
      </div>

      {/* Main Link Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
            <LinkIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-black text-slate-800">Your Referral Link</p>
            <p className="text-xs text-slate-400 font-medium">Code: <span className="font-mono font-bold text-slate-600">{currentAffiliate.referralCode}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
          <code className="flex-1 text-sm font-mono text-slate-700 break-all">{referralUrl}</code>
          <CopyButton text={referralUrl} id="main-url" />
        </div>

        {/* Share Buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          {shareLinks.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-sm ${s.color}`}
            >
              {s.icon}
              Share on {s.name}
            </a>
          ))}
        </div>
      </div>

      {/* Commission Info */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-1">Your Commission Rate</p>
            <p className="text-5xl font-black">{currentAffiliate.commissionRate}%</p>
            <p className="text-emerald-100 text-sm mt-2 font-medium">You earn {currentAffiliate.commissionRate}% of every subscription payment made by your referrals.</p>
          </div>
          <div className="bg-white/20 p-4 rounded-xl">
            <QrCode className="h-8 w-8" />
          </div>
        </div>
        <div className="mt-4 bg-white/10 rounded-xl px-4 py-3">
          <p className="text-xs font-bold text-emerald-100">💡 Tip: Share on WhatsApp groups for the fastest results. School groups & study chats convert best.</p>
        </div>
      </div>

      {/* Ready-to-use Captions */}
      <div>
        <h2 className="font-black text-slate-800 mb-1">Ready-to-Use Captions</h2>
        <p className="text-xs text-slate-400 font-medium mb-4">Copy and paste these into your WhatsApp status or social posts.</p>
        <div className="space-y-4">
          {captions.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                <span className="text-xs font-black text-slate-700">{c.label}</span>
                <CopyButton text={c.text} id={c.id} />
              </div>
              <pre className="text-xs text-slate-600 px-4 py-4 whitespace-pre-wrap font-sans leading-relaxed">{c.text}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
