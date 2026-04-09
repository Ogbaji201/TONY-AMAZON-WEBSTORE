// "use client";

// import { Star, ShoppingCart, Home as HomeIcon, Phone, Mail, Heart } from "lucide-react";
// import Image from "next/image";
// import SimpleCarousel from "@/components/SimpleCarousel";
// import AddToCartButton from "@/components/AddToCartButton";
// import QuickView from "@/components/QuickView";
// import SafeImg from "@/components/SafeImg";

// // ---------- Types -----------------------------------------------------------
// type Category = { name: string; slug: string };

// type NormalizedProduct = {
//   id: number;
//   name: string;
//   description?: string | null;
//   price: number;
//   images: { url: string }[];
//   amazon_url?: string | null;
//   category?: Category | null;
//   featured?: boolean | null;
// };

// type CarouselSlide = {
//   src: string;
//   alt: string;
//   title: string;
//   description: string;
//   price: number;
// };

// const FALLBACK_SLIDES: CarouselSlide[] = [
//   {
//     src: "/Cherrybliss.jpeg",
//     alt: "CherryBliss",
//     title: "Premium Medications",
//     description: "Trusted pharmaceutical solutions for better health and wellness.",
//     price: 119,
//   },
// ];

// function productsToSlides(items: NormalizedProduct[], limit = 5): CarouselSlide[] {
//   const slides: CarouselSlide[] = [];
//   for (const p of items) {
//     const src = p.images?.[0]?.url;
//     if (!src) continue;
//     slides.push({
//       src,
//       alt: p.name,
//       title: p.name,
//       description: (p.description ?? "").toString().slice(0, 120),
//       price: p.price ?? 0,
//     });
//     if (slides.length >= limit) break;
//   }
//   return slides;
// }

// // ---------- Button style ----------------------------------------------------
// const cartBtnClass =
//   "group inline-flex items-center justify-center w-full rounded-xl " +
//   "bg-blue-600 text-white py-3 font-semibold shadow-sm " +
//   "hover:bg-blue-700 active:scale-[0.99] " +
//   "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 " +
//   "transition";

// export default function HomeClient({
//   featuredProducts,
//   products,
//   categories,
// }: {
//   featuredProducts: NormalizedProduct[];
//   products: NormalizedProduct[];
//   categories: Category[];
// }) {
//   const sourceForSlides = featuredProducts.length ? featuredProducts : products;
//   const heroSlides = productsToSlides(sourceForSlides, 5);
//   const slidesToShow = heroSlides.length ? heroSlides : FALLBACK_SLIDES;

//   const renderGrid = (items: NormalizedProduct[]) => (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//       {items.map((product) => {
//         const imageUrl = product.images?.[0]?.url ?? "";
//         const categoryName = product.category?.name ?? "Uncategorized";
//         const priceNum = product.price ?? 0;

//         return (
//           <div
//             key={product.id}
//             className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 group flex flex-col"
//           >
//             {/* image */}
//             <div className="relative overflow-hidden">
//               {imageUrl ? (
//                 <SafeImg
//                   src={imageUrl}
//                   alt={product.name}
//                   className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
//                   loading="lazy"
//                 />
//               ) : (
//                 <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
//                   <span className="text-gray-500">No image</span>
//                 </div>
//               )}

//               {product.featured && (
//                 <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
//                   Featured
//                 </div>
//               )}

//               <div className="absolute top-4 right-4">
//                 <button className="bg-white rounded-full p-2 shadow-md hover:bg-red-500 hover:text-white transition duration-300">
//                   <Heart className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>

//             {/* content */}
//             <div className="p-6 flex flex-col h-full">
//               <div className="flex items-center mb-2">
//                 <div className="flex text-yellow-400">
//                   {[...Array(5)].map((_, i) => (
//                     <Star key={i} className="w-4 h-4 fill-current" />
//                   ))}
//                 </div>
//               </div>

//               <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[56px]">
//                 {product.name}
//               </h3>

//               <div className="text-gray-600 text-sm leading-relaxed mb-3">
//                 <p className="whitespace-pre-line line-clamp-4 min-h-[88px]">
//                   {product.description || "No description available."}
//                 </p>
//                 <QuickView
//                   title={product.name}
//                   text={product.description || ""}
//                   className="mt-1 text-blue-600 hover:underline text-sm"
//                 />
//               </div>

//               <div className="flex items-center justify-between mb-4">
//                 <span className="text-2xl font-bold text-green-600">
//                   ₦{priceNum.toLocaleString()}
//                 </span>
//                 <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                   {categoryName}
//                 </span>
//               </div>

//               <div className="space-y-2 mt-auto">
//                 <a
//                   href={product.amazon_url ?? "#"}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="block w-full bg-yellow-400 hover:bg-yellow-500 text-center text-gray-900 font-semibold py-3 rounded-lg transition duration-300 transform hover:scale-105"
//                 >
//                   Buy on Amazon
//                 </a>

//                 {/* ✅ FIX OPTION 1: self-closing (no children) */}
//                 <AddToCartButton
//                   id={product.id}
//                   name={product.name}
//                   price={priceNum}
//                   image={imageUrl}
//                   className={cartBtnClass}
//                 />
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <section className="relative">
//         <SimpleCarousel
//           slides={slidesToShow}
//           heightClass="h-[320px] sm:h-[380px] md:h-[400px] lg:h-[520px]"
//           fit="cover"
//           dim={true}
//         />
//       </section>

//       <section className="py-16 bg-gray-50">np
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Products</h2>
//             <p className="text-gray-600 max-w-2xl mx-auto">
//               Discover our carefully curated collection of premium products
//             </p>
//           </div>
//           {renderGrid((featuredProducts.length ? featuredProducts : products).slice(0, 8))}
//         </div>
//       </section>

//       {/* Newsletter */}
//       <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
//           <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
//             Subscribe to our newsletter for exclusive deals and new product announcements
//           </p>
//           <div className="max-w-md mx-auto flex">
//             <input
//               type="email"
//               placeholder="Enter your email"
//               className="flex-1 px-4 py-3 rounded-l-lg text-gray-800 focus:outline-none"
//             />
//             <button className="bg-yellow-400 text-gray-900 font-semibold px-6 py-3 rounded-r-lg hover:bg-yellow-500 transition duration-300">
//               Subscribe
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-16">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             <div>
//               <a href="/" className="flex items-center space-x-2 mb-4">
//                 <Image
//                   src="/Cherrybliss.jpeg"
//                   alt="CherryBliss Logo"
//                   width={40}
//                   height={40}
//                   className="rounded-lg object-contain"
//                 />
//                 <span className="text-2xl font-bold">CherryBliss</span>
//               </a>
//               <p className="text-gray-400 mb-4">
//                 Premium pharmaceutical products for your health and wellness
//               </p>
//               <div className="flex space-x-4">
//                 <a href="ojeka Anthony jowo" className="text-gray-400 hover:text-white transition">Facebook</a>
//                 <a href="Ojeka Anthony Onyejowo" className="text-gray-400 hover:text-white transition">Instagram</a>
//                 <a href="@justicemarkTon1" className="text-gray-400 hover:text-white transition">Twitter</a>
//                 <a href="Kingcherrybliss" className="text-gray-400 hover:text-white transition">Tiktok</a>
//               </div>
//             </div>

//             <div>
//               <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
//               <ul className="space-y-2 text-gray-400">
//                 <li><a href="/" className="hover:text-white transition">Home</a></li>
//                 <li><a href="/products" className="hover:text-white transition">Products</a></li>
//                 {/* <li><a href="/categories" className="hover:text-white transition">Categories</a></li> */}
//                 <li><a href="/about" className="hover:text-white transition">About Us</a></li>
//                 <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
//               </ul>
//             </div>

//             <div>
//               <h4 className="font-semibold mb-4 text-lg">Customer Service</h4>
//               <ul className="space-y-2 text-gray-400">
//                 <li><a href="/faq" className="hover:text-white transition">FAQ</a></li>
//                 <li><a href="/shipping" className="hover:text-white transition">Shipping Info</a></li>
//                 <li><a href="/returns" className="hover:text-white transition">Returns</a></li>
//                 <li><a href="/privacy-policy" className="hover:text-white transition">Privacy Policy</a></li>
//                 <li><a href="/terms" className="hover:text-white transition">Terms of Service</a></li>
//               </ul>
//             </div>

//             <div>
//               <h4 className="font-semibold mb-4 text-lg">Contact Info</h4>
//               <div className="space-y-3 text-gray-400">
//                 <div className="flex items-center">
//                   <HomeIcon className="w-5 h-5 mr-3" />
//                   <span>5 Anthony Ololade Street, Lagos, Nigeria</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Phone className="w-5 h-5 mr-3" />
//                   <span>+234 (706) 668-4785</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Mail className="w-5 h-5 mr-3" />
//                   <span>health@cheryblisshealth.com</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
//             <p>&copy; 2026 CheryBliss. All rights reserved. Designed from the ❤️</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

"use client";

import { Star, Home as HomeIcon, Phone, Mail, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SimpleCarousel from "@/components/SimpleCarousel";
import AddToCartButton from "@/components/AddToCartButton";
import QuickView from "@/components/QuickView";
import SafeImg from "@/components/SafeImg";

type Category = { name: string; slug: string };

type NormalizedProduct = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  images: { url: string }[];
  amazon_url?: string | null;
  category?: Category | null;
  featured?: boolean | null;
};

type CarouselSlide = {
  src: string;
  alt: string;
  title: string;
  description: string;
  price: number;
};

const FALLBACK_SLIDES: CarouselSlide[] = [
  {
    src: "/Cherrybliss.jpeg",
    alt: "CherryBliss",
    title: "Premium Health Products",
    description: "Trusted pharmaceutical solutions for better health and wellness.",
    price: 0,
  },
];

function productsToSlides(items: NormalizedProduct[], limit = 5): CarouselSlide[] {
  const slides: CarouselSlide[] = [];
  for (const p of items) {
    const src = p.images?.[0]?.url;
    if (!src) continue;
    slides.push({
      src,
      alt: p.name,
      title: p.name,
      description: (p.description ?? "").toString().slice(0, 120),
      price: p.price ?? 0,
    });
    if (slides.length >= limit) break;
  }
  return slides;
}

const cartBtnClass =
  "group inline-flex items-center justify-center w-full rounded-xl " +
  "bg-blue-600 text-white py-3 font-semibold shadow-sm " +
  "hover:bg-blue-700 active:scale-[0.99] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 " +
  "transition";

export default function HomeClient({
  featuredProducts,
  products,
  categories,
}: {
  featuredProducts: NormalizedProduct[];
  products: NormalizedProduct[];
  categories: Category[];
}) {
  const sourceForSlides = featuredProducts.length ? featuredProducts : products;
  const heroSlides = productsToSlides(sourceForSlides, 5);
  const slidesToShow = heroSlides.length ? heroSlides : FALLBACK_SLIDES;

  const renderGrid = (items: NormalizedProduct[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {items.map((product) => {
        const imageUrl = product.images?.[0]?.url ?? "";
        const categoryName = product.category?.name ?? "Uncategorized";
        const priceNum = product.price ?? 0;

        return (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 group flex flex-col"
            style={{ backgroundColor: "#ffffff" }}
          >
            {/* ✅ Clickable image → product detail page */}
            <Link href={`/products/${product.id}`} className="relative overflow-hidden block">
              {imageUrl ? (
                <SafeImg
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <span style={{ color: "#6b7280" }}>No image</span>
                </div>
              )}
              {product.featured && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Featured
                </div>
              )}
            </Link>

            {/* Wishlist button outside link */}
            <div className="relative -mt-10 mr-4 flex justify-end z-10">
              <button
                className="bg-white rounded-full p-2 shadow-md hover:bg-red-500 hover:text-white transition duration-300"
                aria-label="Add to favourites"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>

            {/* Card content */}
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>

              {/* Product name links to detail page */}
              <Link href={`/products/${product.id}`}>
                <h3
                  className="text-xl font-semibold mb-2 line-clamp-2 min-h-[56px] hover:text-blue-600 transition"
                  style={{ color: "#1f2937" }}
                >
                  {product.name}
                </h3>
              </Link>

              <div className="text-sm leading-relaxed mb-3" style={{ color: "#4b5563" }}>
                <p className="whitespace-pre-line line-clamp-4 min-h-[88px]">
                  {product.description || "No description available."}
                </p>
                <QuickView
                  title={product.name}
                  text={product.description || ""}
                  className="mt-1 text-blue-600 hover:underline text-sm"
                />
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold" style={{ color: "#16a34a" }}>
                  ₦{priceNum.toLocaleString()}
                </span>
                <span
                  className="text-sm px-2 py-1 rounded"
                  style={{ color: "#6b7280", backgroundColor: "#f3f4f6" }}
                >
                  {categoryName}
                </span>
              </div>

              <div className="space-y-2 mt-auto">
                <a
                  href={product.amazon_url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-yellow-400 hover:bg-yellow-500 text-center font-semibold py-3 rounded-lg transition duration-300 transform hover:scale-105"
                  style={{ color: "#111827" }}
                >
                  Buy on Amazon
                </a>

                <AddToCartButton
                  id={product.id}
                  name={product.name}
                  price={priceNum}
                  image={imageUrl}
                  className={cartBtnClass}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    /* ✅ style= forces white background and dark text on ALL devices */
    <div className="min-h-screen" style={{ backgroundColor: "#f9fafb", color: "#171717" }}>

      {/* Hero Slider */}
      <section className="relative">
        <SimpleCarousel
          slides={slidesToShow}
          heightClass="h-[320px] sm:h-[380px] md:h-[440px] lg:h-[520px]"
          fit="cover"
          dim={true}
        />
      </section>

      {/* Featured Products */}
      {/* ✅ Explicit white background + forced dark heading — fixes invisible text on iPhone */}
      <section className="py-16" style={{ backgroundColor: "#f9fafb" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold mb-2"
              style={{ color: "#1f2937" }}   /* ← forced dark — never goes invisible */
            >
              Featured Products
            </h2>
            <p style={{ color: "#4b5563" }} className="max-w-2xl mx-auto">
              Discover our carefully curated collection of premium products
            </p>
          </div>
          {renderGrid((featuredProducts.length ? featuredProducts : products).slice(0, 8))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: "#ffffff" }}>
            Stay Updated
          </h2>
          <p className="mb-8 max-w-2xl mx-auto" style={{ color: "#bfdbfe" }}>
            Subscribe to our newsletter for exclusive deals and new product announcements
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none"
              style={{ color: "#1f2937", backgroundColor: "#ffffff" }}
            />
            <button
              className="font-semibold px-6 py-3 rounded-r-lg transition duration-300"
              style={{ backgroundColor: "#facc15", color: "#111827" }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#111827", color: "#ffffff" }} className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

            <div>
              <a href="/" className="flex items-center space-x-2 mb-4">
                <Image
                  src="/Cherrybliss.jpeg"
                  alt="CherryBliss Logo"
                  width={40}
                  height={40}
                  className="rounded-lg object-contain"
                />
                <span className="text-2xl font-bold" style={{ color: "#ffffff" }}>CherryBliss</span>
              </a>
              <p className="mb-4" style={{ color: "#9ca3af" }}>
                Premium pharmaceutical products for your health and wellness
              </p>
              <div className="flex space-x-4">
                <a href="https://facebook.com/justicemarkTon1" target="_blank" rel="noopener noreferrer" style={{ color: "#9ca3af" }} className="hover:text-white transition">Facebook</a>
                <a href="https://instagram.com/@Kingcherrybliss" target="_blank" rel="noopener noreferrer" style={{ color: "#9ca3af" }} className="hover:text-white transition">Instagram</a>
                <a href="https://twitter.com/justicemarkTon1" target="_blank" rel="noopener noreferrer" style={{ color: "#9ca3af" }} className="hover:text-white transition">Twitter</a>
                <a href="https://tiktok.com/@Kingcherrybliss" target="_blank" rel="noopener noreferrer" style={{ color: "#9ca3af" }} className="hover:text-white transition">TikTok</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg" style={{ color: "#ffffff" }}>Quick Links</h4>
              <ul className="space-y-2">
                {[["Home", "/"], ["Products", "/products"], ["About Us", "/about"], ["Contact", "/contact"]].map(([label, href]) => (
                  <li key={href}>
                    <a href={href} style={{ color: "#9ca3af" }} className="hover:text-white transition">{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg" style={{ color: "#ffffff" }}>Customer Service</h4>
              <ul className="space-y-2">
                {[["FAQ", "/faq"], ["Shipping Info", "/shipping"], ["Returns", "/returns"], ["Privacy Policy", "/privacy-policy"], ["Terms of Service", "/terms"]].map(([label, href]) => (
                  <li key={href}>
                    <a href={href} style={{ color: "#9ca3af" }} className="hover:text-white transition">{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg" style={{ color: "#ffffff" }}>Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <HomeIcon className="w-5 h-5 mr-3 shrink-0" style={{ color: "#9ca3af" }} />
                  <span style={{ color: "#9ca3af" }}>5 Anthony Ololade Street, Lagos, Nigeria</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 shrink-0" style={{ color: "#9ca3af" }} />
                  <span style={{ color: "#9ca3af" }}>+234 (706) 668-4785</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 shrink-0" style={{ color: "#9ca3af" }} />
                  <span style={{ color: "#9ca3af" }}>health@cheryblisshealth.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center" style={{ borderColor: "#1f2937", color: "#6b7280" }}>
            <p>&copy; 2026 CheryBliss. All rights reserved. Designed from the ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
