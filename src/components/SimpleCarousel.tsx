

'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export interface Slide {
  src: string;
  alt: string;
  title: string;
  description: string;
  price: number;
}

interface SimpleCarouselProps {
  slides: Slide[];
  heightClass?: string;
  fit?: 'cover' | 'contain';
  dim?: boolean;
}

export default function SimpleCarousel({
  slides,
  heightClass = 'h-[420px] md:h-[500px] lg:h-[560px]',
  fit = 'cover',
  dim = false,
}: SimpleCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration by only running effects after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const next = () => setCurrent((p) => (p === slides.length - 1 ? 0 : p + 1));
  const prev = () => setCurrent((p) => (p === 0 ? slides.length - 1 : p - 1));

  // Auto-advance slides - only on client side
  useEffect(() => {
    if (!isMounted || slides.length <= 1) return;
    
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [isMounted, slides.length]);

  // Fallback for empty slides
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
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="100vw"
              className={fit === 'contain' ? 'object-contain bg-black' : 'object-cover'}
              priority={index === 0}
            />
            
            {/* Very subtle dim overlay */}
            {dim && <div className="absolute inset-0 bg-black/10" />}

            {/* Text content with minimal background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 mx-4 max-w-2xl border border-white/5 shadow-lg">
                <div className="text-center text-white px-4">
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 drop-shadow-lg">
                    {slide.title}
                  </h2>
                  <p className="text-lg md:text-xl lg:text-2xl mb-4 md:mb-6 drop-shadow-lg leading-relaxed">
                    {slide.description}
                  </p>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-yellow-300 mb-4 md:mb-6 drop-shadow-lg">
                    ₦{Number(slide.price).toLocaleString()}
                  </p>
                  <Link href="/products" className="inline-flex items-center justify-center">
                    <button className="bg-white text-blue-600 px-6 md:px-8 py-2 md:py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg">
                      <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      Shop Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation buttons - only show if there are multiple slides */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 transition shadow-lg z-10"
            aria-label="Previous slide"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 transition shadow-lg z-10"
            aria-label="Next slide"
          >
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </>
      )}

      {/* Slide indicators - only show if there are multiple slides */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                index === current 
                  ? 'bg-white shadow-lg scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}