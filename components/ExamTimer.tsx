
import React from 'react';

interface ExamTimerProps {
  seconds: number;
}

const ExamTimer: React.FC<ExamTimerProps> = ({ seconds }) => {
  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sc = s % 60;
    return h > 0 
      ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sc).padStart(2, '0')}`
      : `${String(m).padStart(2, '0')}:${String(sc).padStart(2, '0')}`;
  };

  const isDanger = seconds <= 300;

  return (
    <div className={`flex items-center gap-3 px-5 py-2 rounded-xl border-2 transition-all shadow-lg ${
      isDanger 
        ? 'bg-red-600 border-red-400 animate-pulse text-white' 
        : 'bg-slate-900 border-slate-700 text-white'
    }`}>
      <i className="fa-solid fa-clock"></i>
      <span className="text-xl font-mono font-bold tracking-wider">{formatTime(seconds)}</span>
    </div>
  );
};

export default ExamTimer;
