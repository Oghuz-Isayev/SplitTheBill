import { Suspense } from 'react';
import PaymentApp from './PaymentApp';

export default function PayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-immersive-glass-border border-t-immersive-accent rounded-full animate-spin" />
      </div>
    }>
      <PaymentApp />
    </Suspense>
  );
}
