
import React from 'react';

const FinishScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-6 z-[9999] animate-in fade-in duration-700">
      <div className="bg-slate-900 p-16 rounded-[4rem] text-center border border-slate-800 shadow-2xl max-w-lg w-full animate-in zoom-in slide-in-from-bottom-10 duration-500">
        <div className="relative w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-indigo-400 text-5xl">
          <i className="fa-solid fa-flag-checkered"></i>
          <div className="absolute inset-0 bg-indigo-500/20 blur-3xl animate-pulse"></div>
        </div>
        
        <h2 className="text-4xl font-black text-white italic mb-4 uppercase tracking-tighter">WAKTU SELESAI</h2>
        <p className="text-slate-400 text-sm mb-12 font-medium leading-relaxed">
          Sesi ujian telah berakhir. Jawaban Anda yang tersimpan telah dikirim ke sistem. 
          Terima kasih telah mengikuti Tryout SIGRIS 2026 dengan jujur.
        </p>
        
        <button 
          onClick={() => window.location.reload()} 
          className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-indigo-700 transition-all uppercase tracking-[0.2em] shadow-lg shadow-indigo-900/40 text-lg active:scale-95"
        >
          KEMBALI KE BERANDA
        </button>
      </div>
    </div>
  );
};

export default FinishScreen;
