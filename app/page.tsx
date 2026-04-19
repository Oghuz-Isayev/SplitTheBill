import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-transparent">
      <div className="max-w-[340px] w-full bg-immersive-panel rounded-[48px] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.8),0_0_20px_var(--color-immersive-accent-glow)] border-[12px] border-[#1a1a1a] text-center relative overflow-hidden">
        <div className="w-16 h-16 bg-immersive-glass rounded-2xl mx-auto mb-6 flex items-center justify-center border border-immersive-glass-border">
          <svg className="w-8 h-8 text-immersive-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          QR Scan Simulator
        </h1>
        <p className="text-immersive-text-dim text-[13px] mb-8 leading-relaxed">
          In a real environment, the user scans a hard-plastic QR code on their table, pointing to a parameterized URL.
        </p>
        
        <Link 
          href="/pay?restaurant_id=8472&table_id=12"
          className="block w-full bg-white text-black py-4 rounded-xl font-bold transition-transform active:scale-[0.98] hover:bg-gray-200"
        >
          Simulate Scan
        </Link>
      </div>
    </main>
  );
}
