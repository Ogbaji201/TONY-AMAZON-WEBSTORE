
// import {
//   Star,
//   ShoppingCart,
//   Home as HomeIcon,
//   Phone,
//   Mail,
//   Heart,
// } from "lucide-react";
// import Image from "next/image";
// import Navigation from "@/components/Navigation";
// import SimpleCarousel from "@/components/SimpleCarousel";
// import AddToCartButton from "@/components/AddToCartButton";
// import QuickView from "@/components/QuickView"; //


// export const dynamic = 'force-dynamic';

// // ---------- ENV / HELPERS ---------------------------------------------------
// const RAW_BASE = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
// const STRAPI = RAW_BASE.replace(/\/$/, "");

// interface NormalizedProduct {
//   id: number;
//   Panadol: string;
//   Product_description?: string | null;
//   Price?: number | string;
//   Image_Upload: { url: string }[];
//   amazon_url?: string | null;
//   category?: { name: string; slug: string } | null;
//   featured?: boolean | null;
// }

// function prefix(url?: string) {
//   if (!url) return "";
//   return url.startsWith("http") ? url : `${STRAPI}${url}`;
// }

// function slugify(str = "") {
//   return str
//     .toString()
//     .toLowerCase()
//     .trim()
//     .replace(/\s+/g, "-")
//     .replace(/[^\w\-]+/g, "")
//     .replace(/\-\-+/g, "-");
// }

// function external(url?: string) {
//   if (!url) return null;
//   return /^https?:\/\//i.test(url) ? url : `https://${url}`;
// }

// // ---------- NORMALIZER (v4 + v5 compatible) ---------------------------------
// function normalize(items: any[]): NormalizedProduct[] {
//   return (items || []).map((item: any) => {
//     const a = item?.attributes ? item.attributes : item || {};

//     // media: array OR { data: [] }
//     const imgField = a.Image_Upload;
//     let imagesRaw: any[] = [];
//     if (Array.isArray(imgField)) imagesRaw = imgField;
//     else if (imgField?.data)
//       imagesRaw = Array.isArray(imgField.data) ? imgField.data : [imgField.data];

//     const images = imagesRaw
//       .map((m: any) => m?.attributes?.url ?? m?.url)
//       .filter(Boolean)
//       .map((u: string) => ({ url: prefix(u) }));

//     // category can come in several shapes
//     let catAttrs: any = null;
//     if (a.category?.data?.attributes) catAttrs = a.category.data.attributes;
//     else if (a.category?.attributes) catAttrs = a.category.attributes;
//     else if (a.category) catAttrs = a.category;

//     const category = catAttrs
//       ? {
//           name: catAttrs.Name ?? catAttrs.name ?? catAttrs.title ?? "",
//           slug:
//             catAttrs.Slug ??
//             catAttrs.slug ??
//             slugify(catAttrs.Name ?? catAttrs.name ?? catAttrs.title ?? ""),
//         }
//       : null;

//     return {
//       id: item.id ?? a.id,
//       Panadol: a.Panadol,
//       Product_description: a.Product_description,
//       Price: a.Price,
//       Image_Upload: images,
//       amazon_url: external(a.amazon_url) ?? null, // ✅ normalize once
//       featured: a.featured,
//       category,
//     } as NormalizedProduct;
//   });
// }

// // ---------- FETCHERS (use populate=*) ---------------------------------------
// async function getProducts(): Promise<NormalizedProduct[]> {
//   const url = `${STRAPI}/api/products?populate=*&pagination[pageSize]=100`;
//   try {
//     // const res = await fetch(url, { cache: "no-store" });
//     const res = await fetch(url, { next: { revalidate: 60} });
//     if (!res.ok) {
//       const body = await res.text().catch(() => "(no body)");
//       console.error(
//         "PRODUCTS ERROR ->",
//         res.status,
//         res.statusText,
//         "\nURL:",
//         url,
//         "\nBODY:",
//         body
//       );
//       return [];
//     }
//     const json = await res.json();
//     return normalize(json.data);
//   } catch (err) {
//     console.error("getProducts() exception:", err);
//     return [];
//   }
// }

// async function getFeaturedProducts(): Promise<NormalizedProduct[]> {
//   const url = `${STRAPI}/api/products?filters[featured][$eq]=true&populate=*&pagination[pageSize]=100`;
//   try {
//     const res = await fetch(url, { cache: "no-store" });
//     if (!res.ok) {
//       const body = await res.text().catch(() => "(no body)");
//       console.error(
//         "FEATURED PRODUCTS ERROR ->",
//         res.status,
//         res.statusText,
//         "\nURL:",
//         url,
//         "\nBODY:",
//         body
//       );
//       return [];
//     }
//     const json = await res.json();
//     return normalize(json.data);
//   } catch (err) {
//     console.error("getFeaturedProducts() exception:", err);
//     return [];
//   }
// }

// async function getCategories(): Promise<{ name: string; slug: string }[]> {
//   const url = `${STRAPI}/api/categories?pagination[pageSize]=100`;
//   try {
//     const res = await fetch(url, { cache: "no-store" });
//     if (!res.ok) {
//       const body = await res.text().catch(() => "(no body)");
//       console.error(
//         "CATEGORIES ERROR ->",
//         res.status,
//         res.statusText,
//         "\nURL:",
//         url,
//         "\nBODY:",
//         body
//       );
//       return [];
//     }
//     const json = await res.json();
//     return (json.data || [])
//       .map((c: any) => {
//         const a = c.attributes ? c.attributes : c;
//         const name = a.Name ?? a.name ?? a.title ?? "";
//         const slug = a.Slug ?? a.slug ?? slugify(name);
//         return { name, slug };
//       })
//       .filter(Boolean);
//   } catch (err) {
//     console.error("getCategories() exception:", err);
//     return [];
//   }
// }

// // ---------- SLIDES (from Strapi) + fallback --------------------------------
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
//     description:
//       "Trusted pharmaceutical solutions for better health and wellness.",
//     price: 119,
//   },
// ];

// function productsToSlides(
//   items: NormalizedProduct[],
//   limit = 5
// ): CarouselSlide[] {
//   const slides: CarouselSlide[] = [];
//   for (const p of items) {
//     const src = p.Image_Upload?.[0]?.url;
//     if (!src) continue;
//     const priceNum = Number(
//       typeof p.Price === "string" ? parseFloat(p.Price) : p.Price || 0
//     );
//     slides.push({
//       src,
//       alt: p.Panadol,
//       title: p.Panadol,
//       description: (p.Product_description ?? "").toString().slice(0, 120),
//       price: priceNum,
//     });
//     if (slides.length >= limit) break;
//   }
//   return slides;
// }

// // ---------- NICE BUTTON STYLE (for Add to Cart) -----------------------------
// const cartBtnClass =
//   "group inline-flex items-center justify-center w-full rounded-xl " +
//   "bg-blue-600 text-white py-3 font-semibold shadow-sm " +
//   "hover:bg-blue-700 active:scale-[0.99] " +
//   "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 " +
//   "transition";

// // ---------- PAGE ------------------------------------------------------------
// export default async function Home() {
//   const [featuredProducts, products, categories] = await Promise.all([
//     getFeaturedProducts(),
//     getProducts(),
//     getCategories(),
//   ]);

//   const sourceForSlides = featuredProducts.length ? featuredProducts : products;
//   const heroSlides = productsToSlides(sourceForSlides, 5);
//   const slidesToShow = heroSlides.length ? heroSlides : FALLBACK_SLIDES;

//   const renderGrid = (items: NormalizedProduct[]) => (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//       {items.map((product) => {
//         const imageUrl = product.Image_Upload?.[0]?.url ?? null;
//         const categoryName = product.category?.name ?? "Uncategorized";
//         const priceNum = Number(
//           typeof product.Price === "string"
//             ? parseFloat(product.Price)
//             : product.Price || 0
//         );

//         return (
//           <div
//             key={product.id}
//             className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 group flex flex-col"
//           >
//             {/* image */}
//             <div className="relative overflow-hidden">
//               {imageUrl ? (
//                 <img
//                   src={imageUrl}
//                   alt={product.Panadol}
//                   className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
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
//                 {/* <span className="text-sm text-gray-600 ml-2">(online reviews)</span> */}
//               </div>

//               {/* Title block with consistent height */}
//               <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[56px]">
//                 {product.Panadol}
//               </h3>

//               {/* Description block (clamped + QuickView modal) */}
//               <div className="text-gray-600 text-sm leading-relaxed mb-3">
//                 <p className="whitespace-pre-line line-clamp-4 min-h-[88px]">
//                   {product.Product_description || "No description available."}
//                 </p>
//                 <QuickView
//                   title={product.Panadol}
//                   text={product.Product_description || ""}
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

//               {/* CTAs anchored to bottom */}
//               <div className="space-y-2 mt-auto">
//                 <a
//                   href={product.amazon_url ?? "#"}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="block w-full bg-yellow-400 hover:bg-yellow-500 text-center text-gray-900 font-semibold py-3 rounded-lg transition duration-300 transform hover:scale-105"
//                 >
//                   Buy on Amazon
//                 </a>

//                 <AddToCartButton
//                   id={product.id}
//                   name={product.Panadol}
//                   price={priceNum}
//                   // image={imageUrl || ""}
//                   image={imageUrl ?? undefined}
//                   className={cartBtnClass}
//                 >
//                   <ShoppingCart className="w-4 h-4 mr-2 transition-transform group-hover:-translate-y-0.5" />
//                   Add to Cart
//                 </AddToCartButton>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* <Navigation categories={categories} /> */}

//       {/* Hero / Carousel from Strapi (with fallback) */}
//       <section className="relative">
//         <SimpleCarousel
//           slides={slidesToShow}
//           heightClass="h-[220px] sm:h-[280px] md:h-[340px] lg:h-[380px]"
//           fit="contain"
//           dim={false}
//         />
//       </section>

//       {/* Featured Section */}
//       <section className="py-16 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-800 mb-2">
//               Featured Products
//             </h2>
//             <p className="text-gray-600 max-w-2xl mx-auto">
//               Discover our carefully curated collection of premium products
//             </p>
//           </div>
//           {renderGrid(
//             (featuredProducts.length ? featuredProducts : products).slice(0, 8)
//           )}
//         </div>
//       </section>

//       {/* Newsletter */}
//       <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
//           <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
//             Subscribe to our newsletter for exclusive deals and new product
//             announcements
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
//                 <a href="#" className="text-gray-400 hover:text-white transition">
//                   Facebook
//                 </a>
//                 <a href="#" className="text-gray-400 hover:text-white transition">
//                   Instagram
//                 </a>
//                 <a href="#" className="text-gray-400 hover:text-white transition">
//                   Twitter
//                 </a>
//                 <a href="#" className="text-gray-400 hover:text-white transition">
//                   Tiktok
//                 </a>
//               </div>
//             </div>

//             <div>
//               <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
//               <ul className="space-y-2 text-gray-400">
//                 <li><a href="/" className="hover:text-white transition">Home</a></li>
//                 <li><a href="/products" className="hover:text-white transition">Products</a></li>
//                 <li><a href="/categories" className="hover:text-white transition">Categories</a></li>
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
//                   <span>info@CherryBliss.com</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
//             <p>&copy; 2025 CherryBliss. All rights reserved. Designed from the ❤️</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

import {
  Star,
  ShoppingCart,
  Home as HomeIcon,
  Phone,
  Mail,
  Heart,
} from "lucide-react";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import SimpleCarousel from "@/components/SimpleCarousel";
import AddToCartButton from "@/components/AddToCartButton";
import QuickView from "@/components/QuickView"; //

// Add this export to make the page dynamic
export const dynamic = 'force-dynamic';

// ---------- ENV / HELPERS ---------------------------------------------------
const RAW_BASE = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const STRAPI = RAW_BASE.replace(/\/$/, "");

interface NormalizedProduct {
  id: number;
  Panadol: string;
  Product_description?: string | null;
  Price?: number | string;
  Image_Upload: { url: string }[];
  amazon_url?: string | null;
  category?: { name: string; slug: string } | null;
  featured?: boolean | null;
}

function prefix(url?: string) {
  if (!url) return "";
  return url.startsWith("http") ? url : `${STRAPI}${url}`;
}

function slugify(str = "") {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function external(url?: string) {
  if (!url) return null;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

// ---------- NORMALIZER (v4 + v5 compatible) ---------------------------------
function normalize(items: any[]): NormalizedProduct[] {
  return (items || []).map((item: any) => {
    const a = item?.attributes ? item.attributes : item || {};

    // media: array OR { data: [] }
    const imgField = a.Image_Upload;
    let imagesRaw: any[] = [];
    if (Array.isArray(imgField)) imagesRaw = imgField;
    else if (imgField?.data)
      imagesRaw = Array.isArray(imgField.data) ? imgField.data : [imgField.data];

    const images = imagesRaw
      .map((m: any) => m?.attributes?.url ?? m?.url)
      .filter(Boolean)
      .map((u: string) => ({ url: prefix(u) }));

    // category can come in several shapes
    let catAttrs: any = null;
    if (a.category?.data?.attributes) catAttrs = a.category.data.attributes;
    else if (a.category?.attributes) catAttrs = a.category.attributes;
    else if (a.category) catAttrs = a.category;

    const category = catAttrs
      ? {
          name: catAttrs.Name ?? catAttrs.name ?? catAttrs.title ?? "",
          slug:
            catAttrs.Slug ??
            catAttrs.slug ??
            slugify(catAttrs.Name ?? catAttrs.name ?? catAttrs.title ?? ""),
        }
      : null;

    return {
      id: item.id ?? a.id,
      Panadol: a.Panadol,
      Product_description: a.Product_description,
      Price: a.Price,
      Image_Upload: images,
      amazon_url: external(a.amazon_url) ?? null, // ✅ normalize once
      featured: a.featured,
      category,
    } as NormalizedProduct;
  });
}

// ---------- FETCHERS (use populate=*) ---------------------------------------
async function getProducts(): Promise<NormalizedProduct[]> {
  const url = `${STRAPI}/api/products?populate=*&pagination[pageSize]=100`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const body = await res.text().catch(() => "(no body)");
      console.error(
        "PRODUCTS ERROR ->",
        res.status,
        res.statusText,
        "\nURL:",
        url,
        "\nBODY:",
        body
      );
      return [];
    }
    const json = await res.json();
    return normalize(json.data);
  } catch (err) {
    console.error("getProducts() exception:", err);
    return [];
  }
}

async function getFeaturedProducts(): Promise<NormalizedProduct[]> {
  const url = `${STRAPI}/api/products?filters[featured][$eq]=true&populate=*&pagination[pageSize]=100`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const body = await res.text().catch(() => "(no body)");
      console.error(
        "FEATURED PRODUCTS ERROR ->",
        res.status,
        res.statusText,
        "\nURL:",
        url,
        "\nBODY:",
        body
      );
      return [];
    }
    const json = await res.json();
    return normalize(json.data);
  } catch (err) {
    console.error("getFeaturedProducts() exception:", err);
    return [];
  }
}

async function getCategories(): Promise<{ name: string; slug: string }[]> {
  const url = `${STRAPI}/api/categories?pagination[pageSize]=100`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const body = await res.text().catch(() => "(no body)");
      console.error(
        "CATEGORIES ERROR ->",
        res.status,
        res.statusText,
        "\nURL:",
        url,
        "\nBODY:",
        body
      );
      return [];
    }
    const json = await res.json();
    return (json.data || [])
      .map((c: any) => {
        const a = c.attributes ? c.attributes : c;
        const name = a.Name ?? a.name ?? a.title ?? "";
        const slug = a.Slug ?? a.slug ?? slugify(name);
        return { name, slug };
      })
      .filter(Boolean);
  } catch (err) {
    console.error("getCategories() exception:", err);
    return [];
  }
}

// ---------- SLIDES (from Strapi) + fallback --------------------------------
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
    title: "Premium Medications",
    description:
      "Trusted pharmaceutical solutions for better health and wellness.",
    price: 119,
  },
];

function productsToSlides(
  items: NormalizedProduct[],
  limit = 5
): CarouselSlide[] {
  const slides: CarouselSlide[] = [];
  for (const p of items) {
    const src = p.Image_Upload?.[0]?.url;
    if (!src) continue;
    const priceNum = Number(
      typeof p.Price === "string" ? parseFloat(p.Price) : p.Price || 0
    );
    slides.push({
      src,
      alt: p.Panadol,
      title: p.Panadol,
      description: (p.Product_description ?? "").toString().slice(0, 120),
      price: priceNum,
    });
    if (slides.length >= limit) break;
  }
  return slides;
}

// ---------- NICE BUTTON STYLE (for Add to Cart) -----------------------------
const cartBtnClass =
  "group inline-flex items-center justify-center w-full rounded-xl " +
  "bg-blue-600 text-white py-3 font-semibold shadow-sm " +
  "hover:bg-blue-700 active:scale-[0.99] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 " +
  "transition";

// ---------- PAGE ------------------------------------------------------------
export default async function Home() {
  const [featuredProducts, products, categories] = await Promise.all([
    getFeaturedProducts(),
    getProducts(),
    getCategories(),
  ]);

  const sourceForSlides = featuredProducts.length ? featuredProducts : products;
  const heroSlides = productsToSlides(sourceForSlides, 5);
  const slidesToShow = heroSlides.length ? heroSlides : FALLBACK_SLIDES;

  const renderGrid = (items: NormalizedProduct[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {items.map((product) => {
        const imageUrl = product.Image_Upload?.[0]?.url ?? null;
        const categoryName = product.category?.name ?? "Uncategorized";
        const priceNum = Number(
          typeof product.Price === "string"
            ? parseFloat(product.Price)
            : product.Price || 0
        );

        return (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 group flex flex-col"
          >
            {/* image */}
            <div className="relative overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.Panadol}
                  className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
              {product.featured && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Featured
                </div>
              )}
              <div className="absolute top-4 right-4">
                <button className="bg-white rounded-full p-2 shadow-md hover:bg-red-500 hover:text-white transition duration-300">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* content */}
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                {/* <span className="text-sm text-gray-600 ml-2">(online reviews)</span> */}
              </div>

              {/* Title block with consistent height */}
              <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[56px]">
                {product.Panadol}
              </h3>

              {/* Description block (clamped + QuickView modal) */}
              <div className="text-gray-600 text-sm leading-relaxed mb-3">
                <p className="whitespace-pre-line line-clamp-4 min-h-[88px]">
                  {product.Product_description || "No description available."}
                </p>
                <QuickView
                  title={product.Panadol}
                  text={product.Product_description || ""}
                  className="mt-1 text-blue-600 hover:underline text-sm"
                />
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-green-600">
                  ₦{priceNum.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {categoryName}
                </span>
              </div>

              {/* CTAs anchored to bottom */}
              <div className="space-y-2 mt-auto">
                <a
                  href={product.amazon_url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-yellow-400 hover:bg-yellow-500 text-center text-gray-900 font-semibold py-3 rounded-lg transition duration-300 transform hover:scale-105"
                >
                  Buy on Amazon
                </a>

                <AddToCartButton
                  id={product.id}
                  name={product.Panadol}
                  price={priceNum}
                  image={imageUrl || ""}
                  className={cartBtnClass}
                >
                  <ShoppingCart className="w-4 h-4 mr-2 transition-transform group-hover:-translate-y-0.5" />
                  Add to Cart
                </AddToCartButton>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navigation categories={categories} /> */}

      {/* Hero / Carousel from Strapi (with fallback) */}
      <section className="relative">
        <SimpleCarousel
          slides={slidesToShow}
          heightClass="h-[220px] sm:h-[280px] md:h-[340px] lg:h-[380px]"
          fit="contain"
          dim={false}
        />
      </section>

      {/* Featured Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated collection of premium products
            </p>
          </div>
          {renderGrid(
            (featuredProducts.length ? featuredProducts : products).slice(0, 8)
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive deals and new product
            announcements
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-800 focus:outline-none"
            />
            <button className="bg-yellow-400 text-gray-900 font-semibold px-6 py-3 rounded-r-lg hover:bg-yellow-500 transition duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
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
                <span className="text-2xl font-bold">CherryBliss</span>
              </a>
              <p className="text-gray-400 mb-4">
                Premium pharmaceutical products for your health and wellness
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Facebook
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Instagram
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Twitter
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Tiktok
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-white transition">Home</a></li>
                <li><a href="/products" className="hover:text-white transition">Products</a></li>
                <li><a href="/categories" className="hover:text-white transition">Categories</a></li>
                <li><a href="/about" className="hover:text-white transition">About Us</a></li>
                <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/faq" className="hover:text-white transition">FAQ</a></li>
                <li><a href="/shipping" className="hover:text-white transition">Shipping Info</a></li>
                <li><a href="/returns" className="hover:text-white transition">Returns</a></li>
                <li><a href="/privacy-policy" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Contact Info</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center">
                  <HomeIcon className="w-5 h-5 mr-3" />
                  <span>5 Anthony Ololade Street, Lagos, Nigeria</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3" />
                  <span>+234 (706) 668-4785</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3" />
                  <span>info@CherryBliss.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CherryBliss. All rights reserved. Designed from the ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

