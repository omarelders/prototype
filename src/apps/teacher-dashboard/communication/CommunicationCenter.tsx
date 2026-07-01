import React, { useState } from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { Announcement, SupportTicket } from '../../../shared/types';
import { 
  Megaphone, 
  MessageSquare, 
  LifeBuoy, 
  Plus, 
  Paperclip, 
  Send, 
  Inbox, 
  User, 
  X,
  FileCheck2,
  AlertCircle
} from 'lucide-react';

export default function CommunicationCenter() {
  const { 
    currentLanguage, 
    announcements, 
    addAnnouncement, 
    tickets, 
    addTicketMessage, 
    addTicket 
  } = useAppState();

  const [activeTab, setActiveTab] = useState<'announcements' | 'messages' | 'support'>('announcements');

  // Announcements forms
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');

  // Messaging chat state
  const [selectedStudentChat, setSelectedStudentChat] = useState<string | null>('Ahmed Gamal');
  const [typedMessage, setTypedMessage] = useState('');
  const [studentChats, setStudentChats] = useState([
    { studentName: "Ahmed Gamal", lastMessage: "Hello Sir, I solved the physics homework on resistors. Can you review?", time: "11:20 AM", unread: true },
    { studentName: "Mona Aly", lastMessage: "Will the chemistry lecture record be posted tonight?", time: "Yesterday", unread: false }
  ]);
  const [messageLogs, setMessageLogs] = useState<Record<string, { sender: 'teacher' | 'student'; text: string; time: string }[]>>({
    "Ahmed Gamal": [
      { sender: 'student', text: "Hello Sir, I solved the physics homework on resistors. Can you review?", time: "11:20 AM" }
    ],
    "Mona Aly": [
      { sender: 'student', text: "Will the chemistry lecture record be posted tonight?", time: "Yesterday" },
      { sender: 'teacher', text: "Yes Mona, it will be uploaded to Bunny Stream by 8 PM.", time: "Yesterday" }
    ]
  });

  // Support Ticketing state
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>('tk-1');
  const [typedSupport, setTypedSupport] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [tTitle, setTTitle] = useState('');
  const [tCategory, setTCategory] = useState('Billing');

  // Translations
  const dict = {
    en: {
      annTab: "Announcements",
      msgTab: "Direct Messages",
      supportTab: "Support Tickets",
      createAnnBtn: "Post Announcement",
      createTicketBtn: "Create Ticket",
      annContentLabel: "Announcement Content",
      attachments: "Attachments",
      inboxTitle: "Recent Student Chats",
      supportTitle: "System Support Tickets",
      typePlaceholder: "Type your message response...",
      sendBtn: "Send",
      selectChatPrompt: "Select a student chat from the inbox list to reply.",
      selectTicketPrompt: "Select a support ticket to trace communications.",
      ticketDialogHeader: "Support Ticket Dialog",
      statusOpen: "● OPEN",
      annModalTitle: "Post Announcement",
      annTitleLabel: "Announcement Title",
      annTitlePlaceholder: "e.g. 💡 Zoom Live Session this Friday!",
      annContentPlaceholder: "Include link references or study guidelines...",
      annPostBtn: "Post Announcement Now",
      ticketModalTitle: "Open Support Ticket",
      ticketTopicLabel: "Support Issue Topic",
      ticketTopicPlaceholder: "e.g. Student payment activation code delay",
      ticketCategoryLabel: "Issue Category",
      optBilling: "Billing & Vodafone Cash",
      optBunny: "Bunny Stream video CDN",
      optGeneral: "General Platform Inquiries",
      ticketSubmitBtn: "Open Ticket",
      adminDescribePlaceholder: "Describe your issue to admin..."
    },
    ar: {
      annTab: "الإعلانات العامة",
      msgTab: "الرسائل الخاصة للطلاب",
      supportTab: "تذاكر الدعم الفني",
      createAnnBtn: "كتابة إعلان جديد للطلاب",
      createTicketBtn: "فتح تذكرة دعم فني جديدة",
      annContentLabel: "نص الإعلان أو التنبيه",
      attachments: "الملفات المرفقة",
      inboxTitle: "محادثات الطلاب الأخيرة",
      supportTitle: "سجل طلبات الدعم المفتوحة",
      typePlaceholder: "اكتب رسالة الرد هنا...",
      sendBtn: "إرسال الآن",
      selectChatPrompt: "اختر محادثة طالب من القائمة للرد عليه.",
      selectTicketPrompt: "اختر تذكرة دعم فني لمتابعة المراسلات مع الإدارة.",
      ticketDialogHeader: "تفاصيل تذكرة الدعم الفني",
      statusOpen: "● مفتوحة",
      annModalTitle: "نشر إعلان جديد للطلاب",
      annTitleLabel: "عنوان الإعلان الدراسي",
      annTitlePlaceholder: "مثال: 💡 حصة مراجعة مباشرة على زووم هذا الجمعة!",
      annContentPlaceholder: "اكتب هنا تفاصيل الإعلان الدراسي أو روابط الحصص والمذاكرة...",
      annPostBtn: "نشر الإعلان للطلاب الآن",
      ticketModalTitle: "فتح تذكرة دعم فني جديدة",
      ticketTopicLabel: "موضوع تذكرة الدعم",
      ticketTopicPlaceholder: "مثال: تأخر تفعيل اشتراك الطالب بعد الدفع",
      ticketCategoryLabel: "قسم المشكلة والنوع",
      optBilling: "المدفوعات وفودافون كاش",
      optBunny: "استضافة الفيديوهات Bunny Stream",
      optGeneral: "استفسارات المنصة العامة",
      ticketSubmitBtn: "فتح التذكرة الآن",
      adminDescribePlaceholder: "اكتب تفاصيل استفسارك أو مشكلتك هنا للإدارة..."
    }
  };

  const t = dict[currentLanguage];

  // Logic Post Announcement
  const handlePostAnn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    const newAnn: Announcement = {
      id: `an-${Date.now()}`,
      title: annTitle,
      content: annContent,
      date: new Date().toISOString().split('T')[0]
    };

    addAnnouncement(newAnn);
    setShowAnnModal(false);
    setAnnTitle('');
    setAnnContent('');
  };

  // Student chat messaging send
  const handleSendStudentMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage || !selectedStudentChat) return;

    const newMsg = { sender: 'teacher' as const, text: typedMessage, time: 'Just now' };
    const currentLogs = messageLogs[selectedStudentChat] || [];
    
    setMessageLogs({
      ...messageLogs,
      [selectedStudentChat]: [...currentLogs, newMsg]
    });

    // Update last message in chat list
    setStudentChats(studentChats.map(chat => 
      chat.studentName === selectedStudentChat 
        ? { ...chat, lastMessage: typedMessage, time: "Just now", unread: false } 
        : chat
    ));

    setTypedMessage('');
  };

  // Support ticketing message send
  const handleSendSupportMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedSupport || !selectedTicketId) return;

    addTicketMessage(selectedTicketId, {
      sender: 'teacher',
      text: typedSupport,
      time: 'Just now'
    });

    setTypedSupport('');
  };

  // Open support ticket logic
  const handleOpenTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tTitle) return;

    const newT: SupportTicket = {
      id: `tk-${Date.now()}`,
      title: tTitle,
      status: 'open',
      category: tCategory,
      date: new Date().toISOString().split('T')[0],
      messages: [
        { sender: 'teacher', text: `Support Request regarding: ${tCategory} - ${tTitle}`, time: 'Just now' }
      ]
    };

    addTicket(newT);
    setSelectedTicketId(newT.id);
    setShowTicketModal(false);
    setTTitle('');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Switcher header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-4">
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'announcements' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.annTab}
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'messages' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.msgTab}
          </button>
          <button 
            onClick={() => setActiveTab('support')}
            className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'support' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.supportTab}
          </button>
        </div>

        {activeTab === 'announcements' && (
          <button 
            onClick={() => setShowAnnModal(true)}
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-1.5 hover:bg-indigo-700 shadow-md transition-all"
          >
            <Megaphone className="h-4 w-4" />
            <span>{t.createAnnBtn}</span>
          </button>
        )}

        {activeTab === 'support' && (
          <button 
            onClick={() => setShowTicketModal(true)}
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-1.5 hover:bg-indigo-700 shadow-md transition-all"
          >
            <LifeBuoy className="h-4 w-4" />
            <span>{t.createTicketBtn}</span>
          </button>
        )}
      </div>

      {/* 1. Announcements Tab */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          {announcements.map(ann => (
            <div key={ann.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h4 className="font-extrabold text-slate-900 text-base">{ann.title}</h4>
                <span className="text-xs text-slate-400 font-bold font-mono">{ann.date}</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-semibold">{ann.content}</p>
              
              {ann.attachments && ann.attachments.length > 0 && (
                <div className="border-t border-slate-100 pt-4 flex flex-wrap gap-3">
                  {ann.attachments.map((att, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-semibold text-slate-700">
                      <Paperclip className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                      <span>{att.name} ({att.size})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 2. Messages Tab */}
      {activeTab === 'messages' && (
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Inbox list */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
            <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <Inbox className="h-4 w-4 text-indigo-600" />
              <span>{t.inboxTitle}</span>
            </h3>

            <div className="space-y-2 flex-1 overflow-y-auto">
              {studentChats.map(chat => {
                const isSelected = selectedStudentChat === chat.studentName;
                return (
                  <button
                    key={chat.studentName}
                    onClick={() => setSelectedStudentChat(chat.studentName)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      isSelected 
                        ? 'bg-indigo-50/30 border-indigo-500/30 text-indigo-900 ring-2 ring-indigo-500/5' 
                        : 'border-slate-200/80 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <h4 className="font-extrabold text-slate-900 text-xs truncate flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span>{chat.studentName}</span>
                        {chat.unread && (
                          <span className="h-2 w-2 bg-rose-500 rounded-full inline-block" />
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium truncate">{chat.lastMessage}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono font-bold whitespace-nowrap">{chat.time}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chat panel */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between min-h-[450px]">
            {selectedStudentChat ? (
              <div className="flex-1 flex flex-col justify-between">
                {/* Chat header info */}
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 rounded-t-2xl font-bold text-slate-900 text-xs">
                  {selectedStudentChat}
                </div>

                {/* Messages log */}
                <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[300px] text-xs">
                  {messageLogs[selectedStudentChat]?.map((msg, idx) => {
                    const isTeacher = msg.sender === 'teacher';
                    return (
                      <div key={idx} className={`flex ${isTeacher ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3.5 rounded-2xl leading-relaxed space-y-1 ${
                          isTeacher 
                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                            : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/50'
                        }`}>
                          <p className="font-semibold">{msg.text}</p>
                          <span className={`text-[9px] block text-right font-mono ${isTeacher ? 'text-indigo-200' : 'text-slate-400'}`}>
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input responder */}
                <form onSubmit={handleSendStudentMsg} className="border-t border-slate-200 p-4 flex gap-3 bg-slate-50/50 rounded-b-2xl">
                  <input
                    type="text"
                    value={typedMessage}
                    onChange={e => setTypedMessage(e.target.value)}
                    placeholder={t.typePlaceholder}
                    className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl flex items-center justify-center shadow-md transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-slate-400 text-center space-y-2">
                <MessageSquare className="h-8 w-8 text-slate-300" />
                <p className="text-xs font-semibold">{t.selectChatPrompt}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Support Tickets Tab */}
      {activeTab === 'support' && (
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Ticket list */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
            <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <LifeBuoy className="h-4 w-4 text-indigo-600" />
              <span>{t.supportTitle}</span>
            </h3>

            <div className="space-y-2 flex-1 overflow-y-auto">
              {tickets.map(ticket => {
                const isSelected = selectedTicketId === ticket.id;
                return (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      isSelected 
                        ? 'bg-indigo-50/30 border-indigo-500/30 text-indigo-900 ring-2 ring-indigo-500/5' 
                        : 'border-slate-200/80 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <h4 className="font-extrabold text-slate-900 text-xs truncate flex items-center gap-2">
                        <span>{ticket.title}</span>
                        <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[8px] tracking-wider uppercase font-mono font-bold">
                          {ticket.category === 'Billing' ? t.optBilling.split(' ')[0] : ticket.category === 'Bunny Stream' ? t.optBunny.split(' ')[0] : t.optGeneral.split(' ')[0]}
                        </span>
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono font-bold">{ticket.date}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ticket dialog log */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between min-h-[450px]">
            {selectedTicketId ? (
              <div className="flex-1 flex flex-col justify-between">
                {/* Chat header */}
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 rounded-t-2xl font-bold text-slate-900 text-xs flex justify-between">
                  <span>{t.ticketDialogHeader}</span>
                  <span className="text-emerald-600 uppercase font-mono font-bold text-[10px]">{t.statusOpen}</span>
                </div>

                {/* Ticket messages logs */}
                <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[300px] text-xs">
                  {tickets.find(tk => tk.id === selectedTicketId)?.messages.map((msg, idx) => {
                    const isTeacher = msg.sender === 'teacher';
                    return (
                      <div key={idx} className={`flex ${isTeacher ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3.5 rounded-2xl leading-relaxed space-y-1 ${
                          isTeacher 
                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                            : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/50'
                        }`}>
                          <p className="font-semibold">{msg.text}</p>
                          <span className={`text-[9px] block text-right font-mono ${isTeacher ? 'text-indigo-200' : 'text-slate-400'}`}>
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Response textbox */}
                <form onSubmit={handleSendSupportMsg} className="border-t border-slate-200 p-4 flex gap-3 bg-slate-50/50 rounded-b-2xl">
                  <input
                    type="text"
                    value={typedSupport}
                    onChange={e => setTypedSupport(e.target.value)}
                    placeholder={t.adminDescribePlaceholder}
                    className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl flex items-center justify-center shadow-md transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-slate-400 text-center space-y-2">
                <LifeBuoy className="h-8 w-8 text-slate-300" />
                <p className="text-xs font-semibold">{t.selectTicketPrompt}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Post Announcement */}
      {showAnnModal && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handlePostAnn} className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-8 space-y-5 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900">{t.annModalTitle}</h3>
              <button type="button" onClick={() => setShowAnnModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t.annTitleLabel}</label>
              <input
                type="text"
                required
                value={annTitle}
                onChange={e => setAnnTitle(e.target.value)}
                placeholder={t.annTitlePlaceholder}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t.annContentLabel}</label>
              <textarea
                rows={4}
                required
                value={annContent}
                onChange={e => setAnnContent(e.target.value)}
                placeholder={t.annContentPlaceholder}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
            >
              {t.annPostBtn}
            </button>
          </form>
        </div>
      )}

      {/* Modal Support Ticket creation */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleOpenTicket} className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-8 space-y-5 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900">{t.ticketModalTitle}</h3>
              <button type="button" onClick={() => setShowTicketModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t.ticketTopicLabel}</label>
              <input
                type="text"
                required
                value={tTitle}
                onChange={e => setTTitle(e.target.value)}
                placeholder={t.ticketTopicPlaceholder}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t.ticketCategoryLabel}</label>
              <select
                value={tCategory}
                onChange={e => setTCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white font-semibold"
              >
                <option value="Billing">{t.optBilling}</option>
                <option value="Bunny Stream">{t.optBunny}</option>
                <option value="General Support">{t.optGeneral}</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-100"
            >
              {t.ticketSubmitBtn}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
