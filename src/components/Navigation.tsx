// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { Menu, X, ShoppingBag, Heart } from 'lucide-react';
// import Cart from './Cart'; // Add this import

// interface NavigationProps {
//   categories?: string[];
// }

// export default function Navigation({ categories = [] }: NavigationProps) {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <nav className="bg-white shadow-sm">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center py-4">
//           {/* Logo */}
//           <Link href="/" className="flex items-center space-x-2">
//             <img
//               src="/Cherrybliss.jpeg"
//               alt="CherryBliss Logo"
//               width={40}
//               height={40}
//               className="rounded-lg object-contain"
//             />
//             <span className="text-2xl font-bold">CherryBliss</span>
//           </Link>

//           {/* Desktop Navigation - Hidden on mobile, visible on md+ */}
//           <div className="hidden md:flex items-center space-x-8">
//             <Link href="/" className="text-gray-600 hover:text-gray-900 transition duration-300">
//               Home
//             </Link>
            
//             {/* Products Dropdown */}
//             <div className="relative group">
//               <button className="text-gray-600 hover:text-gray-900 transition duration-300 flex items-center">
//                 Products
//                 <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>
              
//               <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
//                 <div className="py-2">
//                   <Link href="/products" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
//                     All Products
//                   </Link>
//                   {categories.map((category) => (
//                     <Link
//                       key={category}
//                       href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
//                       className="block px-4 py-2 text-gray-800 hover:bg-gray-100 capitalize"
//                     >
//                       {category}
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

//           {/* Cart and Wishlist Icons - Always visible */}
//           <div className="flex items-center space-x-4">
//             <button className="p-2 rounded-full hover:bg-gray-100 transition duration-300 relative">
//               <Heart className="w-5 h-5" />
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
//             </button>
            
//             {/* Replace the ShoppingBag button with Cart component */}
//             <Cart />
            
//             {/* Mobile menu button - Visible only on mobile */}
//             <button
//               className="md:hidden p-2 ml-4"
//               onClick={() => setIsOpen(!isOpen)}
//             >
//               {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation - Only visible on mobile when menu is open */}
//         <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} py-4 border-t`}>
//           <Link href="/" className="block py-2 text-gray-600 hover:text-gray-900" onClick={() => setIsOpen(false)}>
//             Home
//           </Link>
//           <Link href="/products" className="block py-2 text-gray-600 hover:text-gray-900" onClick={() => setIsOpen(false)}>
//             All Products
//           </Link>
//           {categories.map((category) => (
//             <Link
//               key={category}
//               href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
//               className="block py-2 pl-4 text-gray-600 hover:text-gray-900 capitalize"
//               onClick={() => setIsOpen(false)}
//             >
//               {category}
//             </Link>
//           ))}
//           <Link href="/about" className="block py-2 text-gray-600 hover:text-gray-900" onClick={() => setIsOpen(false)}>
//             About
//           </Link>
//           <Link href="/contact" className="block py-2 text-gray-600 hover:text-gray-900" onClick={() => setIsOpen(false)}>
//             Contact
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// }

// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { Menu, X, ShoppingBag, Heart } from 'lucide-react';

// interface Category {
//   name: string;
//   slug: string;
// }

// interface NavigationProps {
//   categories?: Category[];
// }

// export default function Navigation({ categories = [] }: NavigationProps) {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <nav className="bg-white shadow-sm">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center py-4">
//           {/* Logo */}
//           <Link href="/" className="flex items-center space-x-2">
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
//               <button className="text-gray-600 hover:text-gray-900 transition duration-300 flex items-center">
//                 Products
//                 <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>

//               <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
//                 <div className="py-2">
//                   {/* All products */}
//                   <Link
//                     href="/products"
//                     className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
//                   >
//                     All Products
//                   </Link>

//                   {/* Dynamic categories */}
//                   {categories.map((category) => (
//                     <Link
//                       key={category.slug}
//                       href={`/category/${category.slug}`}
//                       className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
//                     >
//                       {category.name}
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
//             <button className="p-2 rounded-full hover:bg-gray-100 transition duration-300 relative">
//               <Heart className="w-5 h-5" />
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
//             </button>
//             <button className="p-2 rounded-full hover:bg-gray-100 transition duration-300 relative">
//               <ShoppingBag className="w-5 h-5" />
//               <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">2</span>
//             </button>

//             {/* Mobile menu button */}
//             <button
//               className="md:hidden p-2 ml-4"
//               onClick={() => setIsOpen(!isOpen)}
//             >
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
//           {categories.map((category) => (
//             <Link
//               key={category.slug}
//               href={`/category/${category.slug}`}
//               className="block py-2 pl-4 text-gray-600 hover:text-gray-900"
//               onClick={() => setIsOpen(false)}
//             >
//               {category.name}
//             </Link>
//           ))}
//           <Link href="/about" className="block py-2 text-gray-600 hover:text-gray-900" onClick={() => setIsOpen(false)}>
//             About
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

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Heart } from 'lucide-react';
import Cart from './Cart'; // ✅ uses the live cart count from context

interface NavigationProps {
  categories?: string[];
}

export default function Navigation({ categories = [] }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
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
              <button className="text-gray-600 hover:text-gray-900 transition duration-300 flex items-center">
                Products
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-2">
                  {/* All Products */}
                  <Link
                    href="/products"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    All Products
                  </Link>

                  {/* Dynamic Categories */}
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 capitalize"
                    >
                      {category}
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
            {/* Wishlist icon (static for now) */}
            <button className="p-2 rounded-full hover:bg-gray-100 transition duration-300 relative">
              <Heart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>

            {/* ✅ Replace static ShoppingBag with live Cart */}
            <Cart />

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 ml-4"
              onClick={() => setIsOpen(!isOpen)}
            >
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
          {categories.map((category) => (
            <Link
              key={category}
              href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
              className="block py-2 pl-4 text-gray-600 hover:text-gray-900 capitalize"
              onClick={() => setIsOpen(false)}
            >
              {category}
            </Link>
          ))}
          <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
