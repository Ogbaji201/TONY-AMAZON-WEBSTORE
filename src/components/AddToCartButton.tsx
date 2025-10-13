'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';

type Props = {
  id: number;
  name: string;
  price: number;
  image?: string | null;
  className?: string;
};

export default function AddToCart({ id, name, price, image, className }: Props) {
  const { addToCart } = useCart(); // your CartContext should expose this
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart({ id, name, price, image: image ?? undefined, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <button
      onClick={handleAdd}
      className={
        className ??
        'w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 transform hover:scale-105 flex items-center justify-center'
      }
    >
      {added ? <Check className="w-4 h-4 mr-2" /> : <ShoppingCart className="w-4 h-4 mr-2" />}
      {added ? 'Added' : 'Add to Cart'}
    </button>
  );
}
