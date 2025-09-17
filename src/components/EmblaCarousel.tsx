'use client';

import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';

interface Slide {
  src: string;
  alt: string;
  title: string;
  description: string;
  price: number;
}

interface EmblaCarouselProps {
  slides: Slide[];
}

export default function EmblaCarousel({ slides }: EmblaCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 5000 })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="embla relative">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container flex">
          {slides.map((slide, index) => (
            <div
              className="embla__slide relative min-w-full"
              key={index}
            >
              <div className="relative h-96 md:h-[500px]">
                <img
                  className="w-full h-full object-cover"
                  src={slide.src}
                  alt={slide.alt}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white max-w-2xl px-4">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                      {slide.title}
                    </h2>
                    <p className="text-lg md:text-xl mb-6 opacity-90 line-clamp-2">
                      {slide.description}
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-yellow-300 mb-6">
                      ${slide.price}
                    </p>
                    <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300 flex items-center mx-auto">
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        className="embla__prev absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition duration-300"
        onClick={scrollPrev}
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <button
        className="embla__next absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition duration-300"
        onClick={scrollNext}
      >
        <ArrowRight className="w-6 h-6" />
      </button>
    </div>
  );
}


// src/components/EmblaCarousel.tsx
