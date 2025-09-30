// 'use client';

// import { useCallback } from 'react';
// import useEmblaCarousel from 'embla-carousel-react';
// import Autoplay from 'embla-carousel-autoplay';
// import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';

// interface Slide {
//   src: string;
//   alt: string;
//   title: string;
//   description: string;
//   price: number;
// }

// interface EmblaCarouselProps {
//   slides: Slide[];
// }

// export default function EmblaCarousel({ slides }: EmblaCarouselProps) {
//   const [emblaRef, emblaApi] = useEmblaCarousel(
//     { loop: true },
//     [Autoplay({ delay: 5000 })]
//   );

//   const scrollPrev = useCallback(() => {
//     if (emblaApi) emblaApi.scrollPrev();
//   }, [emblaApi]);

//   const scrollNext = useCallback(() => {
//     if (emblaApi) emblaApi.scrollNext();
//   }, [emblaApi]);

//   return (
//     <div className="embla relative">
//       <div className="embla__viewport" ref={emblaRef}>
//         <div className="embla__container flex">
//           {slides.map((slide, index) => (
//             <div
//               className="embla__slide relative min-w-full"
//               key={index}
//             >
//               <div className="relative h-96 md:h-[500px]">
//                 <img
//                   className="w-full h-full object-cover"
//                   src={slide.src}
//                   alt={slide.alt}
//                 />
//                 <div className="absolute inset-0 bg-black bg-opacity-40"></div>
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="text-center text-white max-w-2xl px-4">
//                     <h2 className="text-3xl md:text-5xl font-bold mb-4">
//                       {slide.title}
//                     </h2>
//                     <p className="text-lg md:text-xl mb-6 opacity-90 line-clamp-2">
//                       {slide.description}
//                     </p>
//                     <p className="text-2xl md:text-3xl font-bold text-yellow-300 mb-6">
//                       ${slide.price}
//                     </p>
//                     <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300 flex items-center mx-auto">
//                       <ShoppingBag className="w-5 h-5 mr-2" />
//                       Shop Now
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Navigation buttons */}
//       <button
//         className="embla__prev absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition duration-300"
//         onClick={scrollPrev}
//       >
//         <ArrowLeft className="w-6 h-6" />
//       </button>
//       <button
//         className="embla__next absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition duration-300"
//         onClick={scrollNext}
//       >
//         <ArrowRight className="w-6 h-6" />
//       </button>
//     </div>
//   );
// }


// // src/components/EmblaCarousel.tsx

'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Slide {
  src: string;
  alt: string;
  title: string;
  description: string;
  price: number;
}

interface SimpleCarouselProps {
  slides?: Slide[];
}

export const dummySlides: Slide[] = [
  {
    src: "/p1.jpg",
    alt: "Pharmaceuticals 1",
    title: "Premium Medications",
    description: "Trusted pharmaceutical solutions for better health and wellness.",
    price: 21,
  },
  {
    src: "/p2.jpg",
    alt: "Pharmaceuticals 2",
    title: "Vitamin Supplements",
    description: "Boost your immunity with our high-quality vitamin supplements.",
    price: 20,
  },
  {
    src: "/p3.jpg",
    alt: "Pharmaceuticals 3",
    title: "Prescription Medicines",
    description: "FDA-approved prescription medications for various health conditions.",
    price: 119,
  },
  {
    src: "/p4.jpg",
    alt: "Pharmaceuticals 4",
    title: "Pain Relief Tablets",
    description: "Fast-acting pain relief for headaches, muscle pain, and inflammation.",
    price: 109,
  },
  {
    src: "/p5.jpg",
    alt: "Pharmaceuticals 5",
    title: "Cardiac Medications",
    description: "Specialized heart medications to support cardiovascular health.",
    price: 75,
  }
];

export default function SimpleCarousel({ slides = dummySlides }: SimpleCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={slide.src || "/placeholder.jpg"}   // ✅ fallback if missing
              alt={slide.alt}
              fill
              sizes="100vw"
              className="object-cover"
              priority={index === 0}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-2xl px-4">
                <h2 className="text-4xl md:text-6xl font-bold mb-4">
                  {slide.title}
                </h2>
                <p className="text-xl md:text-2xl mb-6 opacity-90">
                  {slide.description}
                </p>
                <p className="text-3xl md:text-4xl font-bold text-yellow-300 mb-6">
                  ${slide.price}
                </p>

                <Link href="/products">
                  <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300 flex items-center mx-auto">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Shop Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-3 hover:bg-opacity-100 transition duration-300"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-3 hover:bg-opacity-100 transition duration-300"
      >
        <ArrowRight className="w-6 h-6" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition duration-300 ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
