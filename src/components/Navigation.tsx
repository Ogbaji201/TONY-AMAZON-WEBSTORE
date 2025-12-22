
// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { Menu, X, Heart } from 'lucide-react';
// import Cart from './Cart';

// export interface Category {
//   id?: number | string;
//   name: string;
//   slug: string; // must be non-empty
// }

// interface NavigationProps {
//   categories?: Category[];
// }

// export default function Navigation({ categories = [] }: NavigationProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const safeCategories = (categories || []).filter(c => c && c.slug);

//   return (
//     <nav className="bg-white shadow-sm">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center py-4">
//           {/* Logo */}
//           <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
//             <img
//               src="/Cherrybliss.jpeg"
//               alt="CherryBliss Logo"
//               width={40}
//               height={40}
//               className="rounded-lg object-contain"
//             />
//             <span className="text-2xl font-bold">CherryBliss</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             <Link href="/" className="text-gray-600 hover:text-gray-900 transition duration-300">
//               Home
//             </Link>

//             {/* Products Dropdown */}
//             <div className="relative group">
//               <button
//                 className="text-gray-600 hover:text-gray-900 transition duration-300 flex items-center"
//                 aria-haspopup="true"
//                 aria-expanded="false"
//               >
//                 Products
//                 <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>

//               <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
//                 <div className="py-2">
//                   <Link href="/products" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
//                     All Products
//                   </Link>

//                   {safeCategories.map((c) => (
//                     <Link
//                       key={c.slug}
//                       href={`/category/${c.slug}`}
//                       className="block px-4 py-2 text-gray-800 hover:bg-gray-100 capitalize"
//                     >
//                       {c.name || c.slug.replace(/-/g, ' ')}
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <Link href="/about" className="text-gray-600 hover:text-gray-900 transition duration-300">
//               About
//             </Link>
//             <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition duration-300">
//               Contact
//             </Link>
//           </div>

//           {/* Cart + Wishlist */}
//           <div className="flex items-center space-x-4">
//             <button className="p-2 rounded-full hover:bg-gray-100 transition duration-300 relative" aria-label="Wishlist">
//               <Heart className="w-5 h-5" />
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
//                 3
//               </span>
//             </button>

//             <Cart />

//             <button className="md:hidden p-2 ml-4" onClick={() => setIsOpen(v => !v)} aria-label="Toggle menu">
//               {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} py-4 border-t`}>
//           <Link href="/" className="block py-2 text-gray-600 hover:text-gray-900" onClick={() => setIsOpen(false)}>
//             Home
//           </Link>
//           <Link href="/products" className="block py-2 text-gray-600 hover:text-gray-900" onClick={() => setIsOpen(false)}>
//             All Products
//           </Link>
//           {safeCategories.map((c) => (
//             <Link
//               key={c.slug}
//               href={`/category/${c.slug}`}
//               className="block py-2 pl-4 text-gray-600 hover:text-gray-900 capitalize"
//               onClick={() => setIsOpen(false)}
//             >
//               {c.name || c.slug.replace(/-/g, ' ')}
//             </Link>
//           ))}
//           <Link href="/about" className="block py-2 text-gray-600 hover:text-gray-900" onClick={() => setIsOpen(false)}>
//             About Us
//           </Link>
//           <Link href="/contact" className="block py-2 text-gray-600 hover:text-gray-900" onClick={() => setIsOpen(false)}>
//             Contact
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// }


'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Menu, X, Heart } from 'lucide-react';
import Cart from './Cart';

export interface Category {
  id?: number | string;
  name: string;
  slug: string;
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const RAW_BASE = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';
  const STRAPI = RAW_BASE.replace(/\/$/, '');

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const res = await fetch(`${STRAPI}/api/categories?pagination[pageSize]=100`, {
          cache: 'no-store',
        });

        if (!res.ok) return;
        const json = await res.json();

        const cats: Category[] = (json?.data ?? [])
          .map((c: any) => {
            const a = c?.attributes ?? c ?? {};
            const name = a?.Name ?? a?.name ?? a?.title ?? '';
            const slug = a?.Slug ?? a?.slug ?? '';
            return { id: c?.id ?? a?.id, name, slug };
          })
          .filter((c: Category) => c && c.slug);

        if (!cancelled) setCategories(cats);
      } catch {
        // ignore quietly
      }
    }

    loadCategories();
    return () => {
      cancelled = true;
    };
  }, [STRAPI]);

  const safeCategories = useMemo(
    () => (categories || []).filter(c => c && c.slug),
    [categories]
  );

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
            <img
              src="/Cherrybliss.jpeg"
              alt="CherryBliss Logo"
              width={40}
              height={40}
              className="rounded-lg object-contain"
            />
            <span className="text-2xl font-bold">CherryBliss</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition duration-300">
              Home
            </Link>

            {/* Products Dropdown */}
            <div className="relative group">
              <button
                className="text-gray-600 hover:text-gray-900 transition duration-300 flex items-center"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Products
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-2">
                  <Link href="/products" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    All Products
                  </Link>

                  {safeCategories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/category/${c.slug}`}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 capitalize"
                    >
                      {c.name || c.slug.replace(/-/g, ' ')}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition duration-300">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition duration-300">
              Contact
            </Link>
          </div>

          {/* Cart + Wishlist */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100 transition duration-300 relative" aria-label="Wishlist">
              <Heart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>

            <Cart />

            <button className="md:hidden p-2 ml-4" onClick={() => setIsOpen(v => !v)} aria-label="Toggle menu">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} py-4 border-t`}>
          <Link href="/" className="block py-2 text-gray-600 hover:text-gray-900" onClick={() => setIsOpen(false)}>
            Home
          </Link>

          <Link href="/products" className="block py-2 text-gray-600 hover:text-gray-900" onClick={() => setIsOpen(false)}>
            All Products
          </Link>

          {safeCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="block py-2 pl-4 text-gray-600 hover:text-gray-900 capitalize"
              onClick={() => setIsOpen(false)}
            >
              {c.name || c.slug.replace(/-/g, ' ')}
            </Link>
          ))}

          <Link href="/about" className="block py-2 text-gray-600 hover:text-gray-900" onClick={() => setIsOpen(false)}>
            About Us
          </Link>
          <Link href="/contact" className="block py-2 text-gray-600 hover:text-gray-900" onClick={() => setIsOpen(false)}>
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
