
import React, { useState } from 'react';
import { DAFTAR_ID, LOGO_URL } from '../constants';

interface LoginProps {
  onLogin: (id: string, skipCamera: boolean) => Promise<void>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent, skipCamera = false) => {
    e.preventDefault();
    const finalId = id.trim().toUpperCase();
    if (!finalId) return;

    if (!DAFTAR_ID.includes(finalId)) {
      setError("ID Peserta Tidak Terdaftar.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onLogin(finalId, skipCamera);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const handleCameraRetry = () => {
    setError('');
    // Attempting again with default behavior
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md border border-slate-100 animate-in zoom-in duration-300">
        <div className="text-center mb-10">
          <img src={LOGO_URL} className="w-24 h-24 mx-auto mb-6 object-contain drop-shadow-xl" alt="SMP PGRI 7" />
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase leading-tight">TRYOUT SIGRIS 2026</h1>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2">SMP PGRI 7 DENPASAR</p>
        </div>
        
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-center">MASUKKAN ID PESERTA</label>
            <input 
              type="text" 
              value={id} 
              onChange={(e) => setId(e.target.value)}
              placeholder="CONTOH: 9A-01"
              className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 text-center font-black text-3xl uppercase outline-none transition-all shadow-inner text-slate-800"
              disabled={loading}
              autoFocus
            />
          </div>

          {error && (
            <div className="text-red-600 text-xs font-bold text-center p-4 bg-red-50 rounded-xl border border-red-100 flex flex-col items-center gap-3 animate-shake">
              <span>{error}</span>
              {error.includes("Kamera") && (
                <button 
                  type="button" 
                  onClick={() => handleSubmit({ preventDefault: () => {} } as any, true)} 
                  className="bg-red-600 text-white px-8 py-3 rounded-xl hover:bg-red-700 transition-all text-[10px] font-black tracking-widest uppercase shadow-lg active:scale-95"
                >
                  SAYA MENGERTI, TETAP LANJUT
                </button>
              )}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || !id.trim()} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-95 transition-all text-lg uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : 'MASUK KE UJIAN'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-[9px] text-slate-300 font-bold uppercase tracking-widest">Sistem Pengawas Berbasis AI Aktif</p>
      </div>
    </div>
  );
};

export default Login;
