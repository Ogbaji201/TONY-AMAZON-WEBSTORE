
// src/components/AddToCartButton.tsx
'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';

type Props = {
  id: number | string;
  name: string;
  price: number;
  image?: string | null;
  className?: string;
  children?: React.ReactNode;
};

export default function AddToCartButton({
  id,
  name,
  price,
  image,
  className = '',
  children,
}: Props) {
  const { addToCart } = useCart();

  function handleClick() {
    addToCart({
      id,
      name,
      price,
      image: image || '',
      quantity: 1,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ||
        'w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 transform hover:scale-105 flex items-center justify-center'
      }
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      {children ?? 'Add to Cart'}
    </button>
  );
}
