
import React, { useState, useEffect, useRef } from 'react';
import { ExamStats, Student, ChatMessage } from '../types';
import { getProctorResponse } from '../services/geminiService';

interface SidebarProps {
  stats: ExamStats;
  student: Student | null;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ stats, student, isOpen, onToggle }) => {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const handleSend = async () => {
    if (!chatInput.trim() || isTyping) return;
    const msg = chatInput.trim();
    setChatHistory(prev => [...prev, { role: 'user', text: msg }]);
    setChatInput('');
    setIsTyping(true);
    
    const res = await getProctorResponse(msg);
    setChatHistory(prev => [...prev, { role: 'bot', text: res }]);
    setIsTyping(false);
  };

  if (!isOpen) return null;

  return (
    <aside className="bg-slate-900 text-white h-screen flex flex-col transition-all duration-300 border-r border-slate-800 w-80 shadow-2xl z-[60]">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
        <div>
          <h2 className="font-black text-indigo-400 uppercase tracking-tighter text-lg">SIGRIS PROCTOR</h2>
          <span className="text-[10px] font-bold text-slate-500 uppercase">ID PESERTA: {student?.id}</span>
        </div>
        <button onClick={onToggle} className="text-slate-500 hover:text-white transition-colors">
          <i className="fa-solid fa-chevron-left"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {/* Real-time Monitoring Section */}
        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Statistik Pelanggaran</p>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex justify-between items-center bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Pindah Tab (Switch)</span>
              <span className={`text-xs font-black ${stats.tabSwitches > 0 ? 'text-amber-500' : 'text-slate-400'}`}>{stats.tabSwitches}x</span>
            </div>
            <div className="flex justify-between items-center bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Ubah Ukuran (Resize)</span>
              <span className={`text-xs font-black ${stats.resizes > 0 ? 'text-amber-500' : 'text-slate-400'}`}>{stats.resizes}x</span>
            </div>
          </div>
        </div>

        {/* Device Status Section */}
        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Status Perangkat</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
              <span className="text-[9px] font-bold text-slate-500 uppercase">Kamera</span>
              <span className={`text-[10px] font-black ${stats.cameraActive ? 'text-green-500' : 'text-red-500'}`}>
                {stats.cameraActive ? 'AKTIF' : 'OFF'}
              </span>
            </div>
            <div className="flex flex-col gap-1 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
              <span className="text-[9px] font-bold text-slate-500 uppercase">Lokasi/GPS</span>
              <span className={`text-[10px] font-black ${stats.gpsActive ? 'text-green-500' : 'text-red-500'}`}>
                {stats.gpsActive ? 'TERPANTAU' : 'OFF'}
              </span>
            </div>
          </div>
        </div>

        {/* AI Proctor Assistant */}
        <div className="bg-slate-800/60 rounded-2xl p-4 flex flex-col h-[400px] border border-slate-700/50">
          <p className="text-[10px] font-black text-indigo-400 uppercase mb-3 flex items-center gap-2">
            <i className="fa-solid fa-robot"></i> Asisten AI Proctor
          </p>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin text-[11px]" ref={scrollRef}>
            {chatHistory.length === 0 && (
              <div className="h-full flex items-center justify-center text-center p-4 text-slate-500">
                <p>Silakan bertanya jika Anda ragu tentang tata tertib ujian.</p>
              </div>
            )}
            {chatHistory.map((c, i) => (
              <div key={i} className={`p-3 rounded-xl max-w-[90%] ${
                c.role === 'user' 
                  ? 'bg-indigo-600/20 ml-auto border border-indigo-500/20 text-indigo-100' 
                  : 'bg-slate-700/40 mr-auto border border-slate-600/40 text-slate-200'
              }`}>
                {c.text}
              </div>
            ))}
            {isTyping && (
              <div className="animate-pulse text-indigo-400 text-[10px] font-bold flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                AI sedang mengetik...
              </div>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <input 
              type="text" 
              value={chatInput} 
              onChange={e => setChatInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleSend()} 
              placeholder="Tanya aturan..." 
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-[11px] outline-none focus:border-indigo-500 transition-all text-white placeholder:text-slate-600" 
            />
            <button 
              onClick={handleSend} 
              className="bg-indigo-600 p-2 px-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/10"
            >
              <i className="fa-solid fa-paper-plane text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-800 text-center text-[9px] font-black uppercase text-slate-600 tracking-[0.2em] bg-slate-950/20">
        SMP PGRI 7 DENPASAR &copy; 2026
      </div>
    </aside>
  );
};

export default Sidebar;
