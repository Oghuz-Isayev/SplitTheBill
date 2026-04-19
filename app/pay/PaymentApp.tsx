'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ShieldCheck, Hash, Loader2 } from 'lucide-react';

type ItemStatus = 'available' | 'locked' | 'paid';

interface BillItem {
  id: string;
  name: string;
  price: number;
  status: ItemStatus;
  lockedBy: string | null;
}

const INITIAL_BILL: BillItem[] = [
  { id: '1', name: 'Wagyu Burger', price: 24.00, status: 'available', lockedBy: null },
  { id: '2', name: 'Truffle Fries', price: 9.50, status: 'available', lockedBy: null },
  { id: '3', name: 'Diet Coke', price: 4.00, status: 'available', lockedBy: null },
  { id: '4', name: 'Spicy Rigatoni', price: 22.00, status: 'available', lockedBy: null },
  { id: '5', name: 'Sparkling Water', price: 6.00, status: 'available', lockedBy: null },
  { id: '6', name: 'Tiramisu', price: 12.00, status: 'available', lockedBy: null },
];

export default function PaymentApp() {
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get('restaurant_id') || 'Unknown';
  const tableId = searchParams.get('table_id') || 'Unknown';

  const [isLoading, setIsLoading] = useState(true);
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [tipPercentage, setTipPercentage] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBillItems(INITIAL_BILL);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading || paymentSuccess) return;

    const lockTimer = setTimeout(() => {
      setBillItems(prev => prev.map(item => 
        item.id === '6' ? { ...item, status: 'locked', lockedBy: 'Sarah' } : item
      ));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete('6');
        return next;
      });
    }, 4000);

    const payTimer = setTimeout(() => {
      setBillItems(prev => prev.map(item => 
        item.id === '6' ? { ...item, status: 'paid', lockedBy: 'Sarah' } : item
      ));
    }, 8000);

    return () => {
      clearTimeout(lockTimer);
      clearTimeout(payTimer);
    };
  }, [isLoading, paymentSuccess]);

  const handleToggleItem = (id: string, status: ItemStatus) => {
    if (status !== 'available') return;
    
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handlePay = () => {
    if (selectedIds.size === 0) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      setBillItems(prev => prev.map(item => 
        selectedIds.has(item.id) ? { ...item, status: 'paid', lockedBy: 'You' } : item
      ));
      setSelectedIds(new Set());
    }, 2000);
  };

  const selectedItems = billItems.filter(item => selectedIds.has(item.id));
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.18; // 18% AZN Tax
  const tip = subtotal * (tipPercentage / 100);
  const total = subtotal + tax + tip;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-immersive-glass rounded-2xl shadow-[0_0_20px_var(--color-immersive-accent-glow)] border border-immersive-glass-border flex items-center justify-center mb-6">
          <Loader2 className="w-8 h-8 text-immersive-accent animate-spin" />
        </div>
        <h2 className="text-xl font-medium tracking-tight mb-2 text-white">Connecting to POS...</h2>
        <p className="text-immersive-text-dim font-mono text-[13px] max-w-xs">Fetching live bill for Table {tableId}</p>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-[rgba(74,222,128,0.1)] rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(74,222,128,0.2)]"
        >
          <Check className="w-10 h-10 text-immersive-success" />
        </motion.div>
        <h2 className="text-3xl font-semibold tracking-tight mb-2 text-white">Payment Successful</h2>
        <p className="text-immersive-text-dim text-[13px] max-w-sm mb-8">
          The POS has been updated. You&apos;re free to go! Have a great day.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-white text-black px-8 py-3 rounded-2xl font-bold w-full max-w-[280px] active:scale-95 transition-transform"
        >
          Return to Scanner
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-transparent flex justify-center selection:bg-immersive-accent selection:text-white pb-64">
      <div className="w-full max-w-[360px] bg-transparent">
        
        {/* Header */}
        <header className="px-6 py-10 bg-gradient-to-b from-[#111] to-transparent sticky top-0 z-40">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="text-[12px] font-mono text-immersive-accent tracking-widest uppercase">Table {tableId} &bull; Live</div>
              <h1 className="text-[20px] font-bold tracking-tight text-white line-clamp-1">Restaurant #{restaurantId}</h1>
            </div>
          </div>
        </header>

        {/* Bill Items */}
        <div className="px-6 space-y-0">
          <div className="space-y-0">
            <AnimatePresence>
              {billItems.map(item => {
                const isSelected = selectedIds.has(item.id);
                const isAvailable = item.status === 'available';
                const isPaid = item.status === 'paid';
                const isLocked = item.status === 'locked';
                
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={item.id}
                    onClick={() => handleToggleItem(item.id, item.status)}
                    className={`
                      relative py-4 border-b transition-all duration-200 overflow-hidden flex items-center justify-between
                      ${isAvailable ? 'cursor-pointer hover:bg-[rgba(255,255,255,0.02)] border-immersive-glass-border' : ''}
                      ${isSelected ? 'bg-[rgba(59,130,246,0.1)] border-b border-immersive-accent' : ''}
                      ${!isAvailable ? 'border-[rgba(255,255,255,0.02)] opacity-40 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between w-full z-10 relative">
                      <div className="flex items-center gap-4">
                        {/* Checkbox or State Icon */}
                        <div className={`
                          w-5 h-5 rounded flex items-center justify-center border transition-colors
                          ${isSelected ? 'bg-immersive-accent border-immersive-accent' : 'border-immersive-glass-border bg-[#1a1a1a]'}
                          ${!isAvailable ? 'border-immersive-glass-border bg-transparent' : ''}
                        `}>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                        </div>
                        
                        <div>
                          <p className={`text-[14px] font-medium ${!isAvailable ? 'text-immersive-text-dim line-through' : 'text-white'}`}>
                            {item.name}
                          </p>
                          {isAvailable && (
                            <p className="text-[10px] font-medium mt-0.5 text-immersive-success">
                              Available
                            </p>
                          )}
                          {(isLocked || isPaid) && (
                            <p className="text-[10px] font-medium mt-0.5 text-immersive-danger">
                              {isLocked ? `Locked by ${item.lockedBy}` : `Paid by ${item.lockedBy}`}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="font-mono font-semibold tabular-nums text-white">
                        {item.price.toFixed(2)} AZN
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Sticky Footer / Payment Tray */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed bottom-0 inset-x-0 bg-immersive-tray border-t border-immersive-glass-border rounded-t-[32px] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] z-50 p-6 md:max-w-[360px] md:left-1/2 md:-translate-x-1/2 w-full"
            >
              {/* Tip Selection */}
              <div className="mb-5">
                <div className="grid grid-cols-4 gap-2.5">
                  {[0, 10, 15, 20].map(pct => (
                    <button
                      key={pct}
                      onClick={() => setTipPercentage(pct)}
                      className={`
                        py-2.5 text-[12px] rounded-xl border transition-colors text-center
                        ${tipPercentage === pct ? 'bg-[rgba(59,130,246,0.1)] text-white border-immersive-accent' : 'bg-[#1a1a1a] text-white border-immersive-glass-border hover:border-[rgba(255,255,255,0.2)]'}
                      `}
                    >
                      {pct === 0 ? 'No Tip' : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-1.5 mb-5 text-[12px] text-immersive-text-dim">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-mono text-[13px]">{subtotal.toFixed(2)} AZN</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18%)</span>
                  <span className="tabular-nums font-mono text-[13px]">{tax.toFixed(2)} AZN</span>
                </div>
                {tip > 0 && (
                  <div className="flex justify-between">
                    <span>Tip</span>
                    <span className="tabular-nums font-mono text-[13px]">{tip.toFixed(2)} AZN</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 text-white text-[15px] font-bold">
                  <span>Total Amount</span>
                  <span className="tabular-nums font-mono">{total.toFixed(2)} AZN</span>
                </div>
              </div>

              {/* Payment Buttons */}
              <div className="space-y-2.5">
                <button 
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="w-full bg-white text-black rounded-2xl py-4 font-bold text-[15px] hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.05 20.28c-.96.95-2.22 1.5-3.55 1.5-2.76 0-5-2.24-5-5s2.24-5 5-5c1.33 0 2.59.55 3.55 1.5l1.45-1.44C17.2 15.48 15.2 14.5 13 14.5c-3.87 0-7 3.13-7 7s3.13 7 7 7c2.2 0 4.2-.98 5.5-2.52l-1.45-1.7z"/>
                      </svg>
                      Pay with Apple
                    </>
                  )}
                </button>
                <button 
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="w-full bg-[#1a1a1a] text-white border border-immersive-glass-border rounded-2xl py-4 font-bold text-[15px] hover:bg-[#222] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Google Pay
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
