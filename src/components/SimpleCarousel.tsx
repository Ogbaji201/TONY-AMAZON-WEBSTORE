
'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export interface Slide {
  src: string; // absolute or public path
  alt: string;
  title: string;
  description: string;
  price: number;
}

interface SimpleCarouselProps {
  slides: Slide[];
  heightClass?: string;
  fit?: 'cover' | 'contain';
  dim?: boolean; // when true, show a dark overlay
}

export default function SimpleCarousel({
  slides,
  heightClass = 'h-[420px] md:h-[500px] lg:h-[560px]',
  fit = 'cover',       // cover helps avoid black bars
  dim = false,
}: SimpleCarouselProps) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((p) => (p === slides.length - 1 ? 0 : p + 1));
  const prev = () => setCurrent((p) => (p === 0 ? slides.length - 1 : p - 1));

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  // ✅ If slides array is empty, show a simple placeholder hero instead of returning null
  if (!slides || slides.length === 0) {
    return (
      <div className={`relative w-full ${heightClass} bg-gradient-to-br from-blue-700 to-indigo-700 flex items-center justify-center`}>
        <div className="text-center text-white px-4">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Welcome to CherryBliss</h2>
          <p className="text-lg md:text-2xl opacity-90 mb-6">
            Premium products for your health and wellness
          </p>
          <Link href="/products" className="inline-flex items-center justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Shop Now
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden`}>
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-500 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="relative w-full h-full">
            <Image
              src={s.src}
              alt={s.alt}
              fill
              sizes="100vw"
              className={fit === 'contain' ? 'object-contain bg-black' : 'object-cover'}
              priority={i === 0}
            />
            {dim && <div className="absolute inset-0 bg-black/40" />}

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-2xl px-4">
                <h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow">{s.title}</h2>
                <p className="text-xl md:text-2xl mb-6 opacity-90 drop-shadow">{s.description}</p>
                <p className="text-3xl md:text-4xl font-bold text-yellow-300 mb-6 drop-shadow">
                  ₦{Number(s.price).toLocaleString()}
                </p>
                <Link href="/products" className="inline-flex items-center justify-center">
                  <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Shop Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 transition"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 transition"
      >
        <ArrowRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full ${i === current ? 'bg-white' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}
