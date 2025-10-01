// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
// import Link from 'next/link';

// type Slide = {
//   src?: string;                // absolute or public path
//   alt?: string;
//   title?: string;
//   description?: string;
//   price?: number | string;
//   ctaHref?: string;
//   ctaText?: string;
// };

// interface SimpleCarouselProps {
//   slides?: Slide[];
//   intervalMs?: number;
//   heightClass?: string;
//   fit?: 'cover'| 'contain';
// }

// /** Local defaults (make sure these files exist under /public) */
// export const dummySlides: Slide[] = [
//   { src: '/p1.jpg', alt: 'Pharmaceuticals 1', title: 'Premium Medications', description: 'Trusted pharmaceutical solutions for better health and wellness.', price: 21, ctaHref: '/products', ctaText: 'Shop Now' },
//   { src: '/p2.jpg', alt: 'Pharmaceuticals 2', title: 'Vitamin Supplements', description: 'Boost your immunity with our high-quality vitamin supplements.', price: 20, ctaHref: '/products', ctaText: 'Shop Now' },
//   { src: '/p3.jpg', alt: 'Pharmaceuticals 3', title: 'Prescription Medicines', description: 'FDA-approved prescription medications for various health conditions.', price: 119, ctaHref: '/products', ctaText: 'Shop Now' },
//   { src: '/p4.jpg', alt: 'Pharmaceuticals 4', title: 'Pain Relief Tablets', description: 'Fast-acting pain relief for headaches, muscle pain, and inflammation.', price: 109, ctaHref: '/products', ctaText: 'Shop Now' },
// ];

// const STRAPI = (process.env.NEXT_PUBLIC_STRAPI_URL ?? '').replace(/\/$/, '');

// /** turn /uploads/... → http://localhost:1337/uploads/..., keep http(s), allow /public paths */
// function resolveSrc(src?: string): string {
//   if (!src) return '/p1.jpg';
//   if (src.startsWith('http')) return src;
//   if (src.startsWith('/uploads/')) return `${STRAPI}${src}`;
//   return src.startsWith('/') ? src : `/${src}`;
// }

// export default function SimpleCarousel({ slides = dummySlides, intervalMs = 5000, heightClass = 'h-[380px] md:h-[460px] lg:h-[520px]',
//   fit = 'cover',}: SimpleCarouselProps) {
//   const normalized = useMemo(
//     () => slides.map(s => ({ ...s, src: resolveSrc(s.src) })),
//     [slides]
//   );

//   const [current, setCurrent] = useState(0);
//   const count = normalized.length;

//   useEffect(() => {
//     if (count <= 1) return;
//     const t = setInterval(() => setCurrent(i => (i + 1) % count), intervalMs);
//     return () => clearInterval(t);
//   }, [count, intervalMs]);

//   const next = () => setCurrent(i => (i + 1) % count);
//   const prev = () => setCurrent(i => (i - 1 + count) % count);

//   return (
//     <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
//       {normalized.map((slide, i) => (
//         <div
//           key={i}
//           className={`absolute inset-0 transition-opacity duration-500 ${i === current ? 'opacity-100' : 'opacity-0'}`}
//         >
//           <div className="relative w-full h-full">
//             {/* background image */}
//             <img
//               src={slide.src}
//               alt={slide.alt ?? 'slide'}
//               className="absolute inset-0 w-full h-full object-cover"
//             />

//             {/* overlay */}
//             <div className="absolute inset-0 bg-black/45" />

//             {/* content */}
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="text-center text-white max-w-2xl px-4">
//                 {slide.title && <h2 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h2>}
//                 {slide.description && <p className="text-xl md:text-2xl mb-6 opacity-90">{slide.description}</p>}
//                 {slide.price !== undefined && (
//                   <p className="text-3xl md:text-4xl font-bold text-yellow-300 mb-6">
//                     {typeof slide.price === 'number' ? `₦${slide.price.toLocaleString()}` : slide.price}
//                   </p>
//                 )}
//                 <Link href={slide.ctaHref ?? '/products'} className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
//                   <ShoppingBag className="w-5 h-5 mr-2" />
//                   {slide.ctaText ?? 'Shop Now'}
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}

//       {/* controls */}
//       {count > 1 && (
//         <>
//           <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 transition">
//             <ArrowLeft className="w-6 h-6" />
//           </button>
//           <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 transition">
//             <ArrowRight className="w-6 h-6" />
//           </button>
//           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
//             {normalized.map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setCurrent(i)}
//                 className={`w-3 h-3 rounded-full ${i === current ? 'bg-white' : 'bg-white/50'}`}
//                 aria-label={`Go to slide ${i + 1}`}
//               />
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Slide {
  src: string;       // absolute or public path
  alt: string;
  title: string;
  description: string;
  price: number;
}

interface SimpleCarouselProps {
  slides: Slide[];                 // <-- require slides (no dummy fallback here)
  heightClass?: string;            // e.g. "h-[360px] md:h-[440px] lg:h-[500px]"
  fit?: 'cover' | 'contain';       // how the image fills the box
}

export default function SimpleCarousel({
  slides,
  heightClass = 'h-[420px] md:h-[500px] lg:h-[560px]',
  fit = 'contain',                 // contain prevents cropping/stretching
}: SimpleCarouselProps) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((p) => (p === slides.length - 1 ? 0 : p + 1));
  const prev = () => setCurrent((p) => (p === 0 ? slides.length - 1 : p - 1));

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (!slides?.length) return null;

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden`}>
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={s.src}
              alt={s.alt}
              fill
              sizes="100vw"
              className={fit === 'contain' ? 'object-contain' : 'object-cover'}
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-2xl px-4">
                <h2 className="text-4xl md:text-6xl font-bold mb-4">{s.title}</h2>
                <p className="text-xl md:text-2xl mb-6 opacity-90">{s.description}</p>
                <p className="text-3xl md:text-4xl font-bold text-yellow-300 mb-6">
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
