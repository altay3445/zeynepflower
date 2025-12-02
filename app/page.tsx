"use client";
import { useState } from "react";

// Çiçek verisi için tip tanımı
interface FlowerData {
  id: number;
  x: number; y: number; size: number; delay: number; duration: number; rotation: number;
}

// --- ORTAK DEFINITIONS (Gradyanlar ve Filtreler) ---
const SvgDefs = () => (
  <defs>
    <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" stopColor="#FF69B4" /> 
      <stop offset="100%" stopColor="#800080" /> 
    </radialGradient>
    <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#228B22" />
        <stop offset="100%" stopColor="#32CD32" />
    </linearGradient>
    {/* Parlama efekti */}
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

// --- SADECE ÇİÇEK KAFASI (Merkezdeki Buton İçin) ---
const KasimpatiHeadOnly = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 100" className={`overflow-visible ${className}`} style={style}>
    <SvgDefs />
    <g filter="url(#glow)">
      {[...Array(24)].map((_, i) => (
        <ellipse key={`outer-${i}`} cx="50" cy="50" rx="8" ry="40" transform={`rotate(${i * 15} 50 50)`} fill="url(#grad1)" className="opacity-90" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      ))}
      {[...Array(16)].map((_, i) => (
        <ellipse key={`inner-${i}`} cx="50" cy="50" rx="6" ry="25" transform={`rotate(${i * 22.5 + 7} 50 50)`} fill="#FF1493" />
      ))}
       <circle cx="50" cy="50" r="10" fill="#FFD700" className="animate-pulse" />
    </g>
  </svg>
);

// --- SAPLI VE YAPRAKLI KASIMPATI (Arka Plan İçin) ---
const KasimpatiWithStem = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 250" className={`overflow-visible ${className}`} style={style}>
    <SvgDefs />
    <g id="stem-group">
       {/* Sapın alt kısmını biraz saydamlaştırarak "toprağa giriyor" hissi verelim */}
       <path d="M50 250 Q 55 150 50 60" stroke="url(#stemGrad)" strokeWidth="5" fill="none" strokeLinecap="round" />
       
       <path d="M50 180 Q 20 170 30 200 Q 40 210 50 190" fill="#228B22" />
       <path d="M50 180 Q 35 185 30 200" stroke="#1a6b1a" strokeWidth="1" fill="none"/>
       <path d="M52 120 Q 80 110 75 140 Q 65 150 52 130" fill="#32CD32" />
       <path d="M52 120 Q 67 125 75 140" stroke="#228B22" strokeWidth="1" fill="none"/>
    </g>
    <g transform="translate(0, 10)"> 
      <KasimpatiHeadOnly />
    </g>
  </svg>
);

export default function Home() {
  const [bloomed, setBloomed] = useState(false);
  const [flowers, setFlowers] = useState<FlowerData[]>([]);

  const handleBloom = () => {
    setBloomed(true);
    
    // GÜNCELLEME: Derinlik Algısı (Perspective Logic)
    const newFlowers = Array.from({ length: 100}).map((_, i) => {
      // Y konumu: Ekranın %15'inden (üst kısım) %100'üne kadar dağılsın.
      const yPos = Math.random() * 95 + 5; 
      
      // BOYUT HESABI (Önemli Kısım):
      // Eğer çiçek yukarıdaysa (yPos düşükse), boyutu KÜÇÜK olsun (uzakta gibi).
      // Eğer çiçek aşağıdaysa (yPos yüksekse), boyutu BÜYÜK olsun (yakında gibi).
      // y=0 için boyut 0.3, y=100 için boyut 1.5 olacak şekilde formül:
      const sizeCalc = (yPos / 100) * 1.2 + 0.3;

      return {
        id: i,
        x: Math.random() * 100, 
        y: yPos,
        size: sizeCalc, // Hesaplanan boyut
        delay: Math.random() * 4, 
        duration: 3 + Math.random() * 5, 
        rotation: Math.random() * 60 - 30 
      };
    });
    setFlowers(newFlowers);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative bg-linear-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#0f0c29] overflow-hidden">
      
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      
      {/* --- MERKEZDEKİ BUTON --- */}
      <div 
        className={`z-50 flex flex-col items-center justify-center transition-all duration-700 ease-in-out transform ${bloomed ? 'opacity-0 scale-150 pointer-events-none' : 'opacity-100 scale-100'}`}
        onClick={handleBloom}
      >
        <KasimpatiHeadOnly className="w-56 h-56 animate-pulse-flower" />
        <p className="text-pink-300 mt-6 font-bold tracking-[0.3em] text-sm animate-pulse drop-shadow-lg">
          BANA TIKLA
        </p>
      </div>

      {/* --- ARKA PLAN ÇİÇEK TARLASI --- */}
      {bloomed && (
        <div className="absolute inset-0 pointer-events-none">
          {flowers.map((flower) => (
            <div
              key={flower.id}
              className="absolute animate-bloom-infinite origin-bottom"
              style={{
                left: `${flower.x}%`, 
                top: `${flower.y}%`, 
                width: '70px', 
                height: '180px',
                animationDelay: `${flower.delay}s`, 
                animationDuration: `${flower.duration}s`,
                // Çiçek boyutu ve konumu hesapladığımız 'size' değişkenine bağlı
                transform: `scale(${flower.size}) rotate(${flower.rotation}deg) translate(-50%, -100%)`,
                // Z-index de boyuta bağlı. Büyükler (yakındakiler) önde dursun.
                zIndex: Math.floor(flower.size * 100)
              }}
            >
              <KasimpatiWithStem className="w-full h-full drop-shadow-lg" />
            </div>
          ))}
          
          <div className="absolute inset-0 flex items-center justify-center z-[200] pointer-events-none">
             <h1 className="text-5xl md:text-7xl font-black text-center px-4 
                            text-transparent bg-clip-text bg-linear-to-r from-pink-200 via-white to-indigo-200
                            drop-shadow-[0_5px_5px_rgba(0,0,0,0.9)] 
                            animate-pulse">
               SON BUMBLEPATIMA <br/> İLK KASIMPATILARI
             </h1>
          </div>

          <button 
            onClick={() => { setBloomed(false); setFlowers([]); }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-auto z-[200] px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors text-sm uppercase tracking-[0.3em] backdrop-blur-md font-bold shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          >
            Sıfırla
          </button>
        </div>
      )}
    </main>
  );
}