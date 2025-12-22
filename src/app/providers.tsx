'use client';

import { CartProvider } from '@/context/CartContext';
import Navigation from '@/components/Navigation';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Navigation />
      {children}
    </CartProvider>
  );
}
