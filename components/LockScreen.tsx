
import React from 'react';

interface LockScreenProps {
  countdown: number;
  violations: number;
}

const LockScreen: React.FC<LockScreenProps> = ({ countdown, violations }) => (
  <div className="absolute inset-0 bg-red-600/95 backdrop-blur-3xl flex flex-col items-center justify-center text-white z-[100] p-6 text-center animate-in fade-in duration-500">
    <div className="relative mb-8">
      <i className="fa-solid fa-triangle-exclamation text-8xl text-amber-400 animate-bounce"></i>
      <div className="absolute inset-0 bg-amber-400/20 blur-2xl rounded-full"></div>
    </div>
    
    <h2 className="text-5xl font-black mb-4 uppercase italic tracking-tighter drop-shadow-2xl">AKSES TERKUNCI</h2>
    <p className="text-lg opacity-90 mb-10 max-w-md font-bold leading-tight">
      Terdeteksi Pelanggaran: Anda telah berpindah jendela atau merubah ukuran layar ujian.
    </p>
    
    <div className="bg-black/40 p-12 rounded-[3.5rem] border border-white/10 shadow-2xl backdrop-blur-md">
      <div className="text-9xl font-mono font-black text-amber-400 tracking-tighter">{countdown}</div>
      <div className="text-[11px] uppercase tracking-[0.4em] font-black opacity-60 mt-4">Detik Hingga Terbuka</div>
    </div>
    
    <div className="mt-12 px-8 py-3 bg-white/10 rounded-full border border-white/20 text-xs font-black uppercase tracking-widest shadow-xl">
      Pelanggaran Ke-{violations}
    </div>
    
    <div className="mt-8 max-w-sm">
      <p className="text-[10px] opacity-70 italic font-medium leading-relaxed">
        Peringatan audio telah diaktifkan. <br />
        Screenshot dan lokasi Anda telah dikirim ke server pusat pengawas.
      </p>
    </div>
  </div>
);

export default LockScreen;
