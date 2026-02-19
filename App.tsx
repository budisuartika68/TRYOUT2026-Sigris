
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppStatus, Student, ExamStats } from './types';
import { 
  EXAM_DURATION_SECONDS, 
  FORM_URL, 
  BASE_PENALTY_SECONDS, 
  ADDED_PENALTY_PER_VIOLATION 
} from './constants';
import { sendLog } from './services/loggerService';
import { playAlarm } from './utils/audio';

import Login from './components/Login';
import Sidebar from './components/Sidebar';
import ExamTimer from './components/ExamTimer';
import LockScreen from './components/LockScreen';
import FinishScreen from './components/FinishScreen';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.LOGIN);
  const [student, setStudent] = useState<Student | null>(null);
  const [stats, setStats] = useState<ExamStats>({ tabSwitches: 0, resizes: 0, cameraActive: false, gpsActive: false });
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);
  const [lockTimer, setLockTimer] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const initialSize = useRef({ w: window.innerWidth, h: window.innerHeight });

  // Handle Photo Capture for monitoring
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !stats.cameraActive) return null;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.6);
      }
    } catch (e) {
      console.error("Capture failed:", e);
    }
    return null;
  }, [stats.cameraActive]);

  // Violation Handler
  const triggerLock = useCallback((event: 'TAB_SWITCH' | 'RESIZE') => {
    if (status !== AppStatus.EXAM) return;
    
    playAlarm();

    const photoData = capturePhoto();
    const violationCount = stats.tabSwitches + stats.resizes + 1;
    const penalty = BASE_PENALTY_SECONDS + (violationCount * ADDED_PENALTY_PER_VIOLATION);
    
    setLockTimer(penalty);
    setStatus(AppStatus.LOCKED);
    
    if (event === 'TAB_SWITCH') {
      setStats(s => ({ ...s, tabSwitches: s.tabSwitches + 1 }));
    } else if (event === 'RESIZE') {
      setStats(s => ({ ...s, resizes: s.resizes + 1 }));
    }
    
    sendLog({ 
      user: student?.id, 
      event, 
      violationCount, 
      penalty, 
      location: student?.coords,
      image: photoData
    });
  }, [status, student, stats, capturePhoto]);

  // Countdown timer for Exam
  useEffect(() => {
    let timer: number;
    if (status === AppStatus.EXAM || status === AppStatus.LOCKED) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setStatus(AppStatus.FINISHED);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status]);

  // Countdown timer for Lock screen
  useEffect(() => {
    let timer: number;
    if (status === AppStatus.LOCKED) {
      timer = window.setInterval(() => {
        setLockTimer(prev => {
          if (prev <= 1) {
            setStatus(AppStatus.EXAM);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status]);

  // Visibility and Resize Listeners
  useEffect(() => {
    if (status === AppStatus.EXAM) {
      const handleVisibility = () => {
        if (document.visibilityState === 'hidden') {
          triggerLock('TAB_SWITCH');
        }
      };
      
      const handleResize = () => {
        const diffW = Math.abs(window.innerWidth - initialSize.current.w);
        const diffH = Math.abs(window.innerHeight - initialSize.current.h);
        // Small changes might be ignored, but large changes trigger lock
        if (diffW > 80 || diffH > 80) {
          triggerLock('RESIZE');
          initialSize.current = { w: window.innerWidth, h: window.innerHeight };
        }
      };

      document.addEventListener('visibilitychange', handleVisibility);
      window.addEventListener('resize', handleResize);
      
      return () => {
        document.removeEventListener('visibilitychange', handleVisibility);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [status, triggerLock]);

  const handleLogin = async (id: string, skipCamera = false) => {
    let cam = false, gps = false, coords = undefined;
    
    // Attempt camera access
    if (!skipCamera) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        cam = true;
      } catch (e) { 
        console.warn("Cam denied:", e);
        throw new Error("Akses Kamera Wajib Untuk Ujian Ini. Pastikan izin kamera diberikan.");
      }
    }
    
    // Attempt location access
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 });
      });
      coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      gps = true;
    } catch (e) { 
      console.warn("GPS denied or timeout:", e); 
    }

    setStats(s => ({ ...s, cameraActive: cam, gpsActive: gps }));
    setStudent({ id, loginTime: new Date().toLocaleString(), coords });
    setStatus(AppStatus.EXAM);
    
    // Fix: Corrected property name from 'id' to 'user' to match LoggerPayload interface
    sendLog({ user: id, event: 'LOGIN', location: coords, cameraActive: cam });
  };

  return (
    <div className="h-screen w-screen bg-slate-950 flex overflow-hidden relative">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="fixed top-0 left-0 w-1 h-1 opacity-0 pointer-events-none" 
      />
      
      {status === AppStatus.LOGIN && <Login onLogin={handleLogin} />}
      
      {(status === AppStatus.EXAM || status === AppStatus.LOCKED) && (
        <>
          <Sidebar 
            stats={stats} 
            student={student} 
            isOpen={sidebarOpen} 
            onToggle={() => setSidebarOpen(!sidebarOpen)} 
          />
          
          <main className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-50 flex-shrink-0 shadow-md">
              <div className="flex items-center gap-4">
                {!sidebarOpen && (
                  <button 
                    onClick={() => setSidebarOpen(true)} 
                    className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors shadow-sm"
                  >
                    <i className="fa-solid fa-bars"></i>
                  </button>
                )}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5 leading-none">SIGRIS TRYOUT 2026</p>
                  <p className="text-xs font-bold text-slate-800 leading-none">SMP PGRI 7 DENPASAR</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">PESERTA</p>
                  <p className="text-xs font-black text-indigo-600 leading-tight">{student?.id}</p>
                </div>
                <ExamTimer seconds={timeLeft} />
              </div>
            </header>
            
            <div className="flex-1 relative w-full overflow-hidden bg-slate-100">
              <iframe 
                src={FORM_URL} 
                className="w-full h-full border-none bg-white" 
                title="Exam Form" 
                allow="camera; microphone; geolocation" 
              />
              
              {status === AppStatus.LOCKED && (
                <LockScreen 
                  countdown={lockTimer} 
                  violations={stats.tabSwitches + stats.resizes} 
                />
              )}
            </div>
          </main>
        </>
      )}
      
      {status === AppStatus.FINISHED && <FinishScreen />}
    </div>
  );
};

export default App;
