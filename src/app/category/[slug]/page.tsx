
// import { notFound } from "next/navigation";
// import Navigation from "@/components/Navigation";
// import { ShoppingBag, Star, Heart } from "lucide-react";
// import AddToCartButton from "@/components/AddToCartButton";

// const STRAPI = (process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337").replace(/\/$/, "");

// // ---------- helpers ----------
// function slugify(str = "") {
//   return str
//     .toString()
//     .toLowerCase()
//     .trim()
//     .replace(/\s+/g, "-")
//     .replace(/[^\w\-]+/g, "")
//     .replace(/\-\-+/g, "-");
// }

// type NormalizedProduct = {
//   id: number;
//   name: string;
//   description?: string | null;
//   price: number;
//   images: { url: string }[];
//   category?: { name: string; slug: string } | null;
//   featured?: boolean | null;
// };

// function normalizeProducts(items: any[]): NormalizedProduct[] {
//   return (items || []).map((item: any) => {
//     const a = item?.attributes ? item.attributes : item || {};

//     // images: array or { data: [] }
//     const imgField = a.Image_Upload;
//     let imagesRaw: any[] = [];
//     if (Array.isArray(imgField)) imagesRaw = imgField;
//     else if (imgField?.data) imagesRaw = Array.isArray(imgField.data) ? imgField.data : [imgField.data];

//     const images = imagesRaw
//       .map((m: any) => m?.attributes?.url ?? m?.url)
//       .filter(Boolean)
//       .map((u: string) => ({ url: u.startsWith("http") ? u : `${STRAPI}${u}` }));

//     // category shapes (v4/v5)
//     const catA =
//       a?.category?.data?.attributes ??
//       a?.category?.attributes ??
//       a?.category ??
//       item?.category?.data?.attributes ??
//       item?.category?.attributes ??
//       item?.category;

//     const category = catA
//       ? {
//           name: catA.Name ?? catA.name ?? catA.title ?? "",
//           slug: catA.Slug ?? catA.slug ?? slugify(catA.Name ?? catA.name ?? catA.title ?? ""),
//         }
//       : null;

//     const priceNum = Number(typeof a.Price === "string" ? parseInt(a.Price, 10) : a.Price || 0);

//     return {
//       id: item.id ?? a.id,
//       name: a.Panadol,
//       description: a.Product_description,
//       price: priceNum,
//       images,
//       featured: a.featured,
//       category,
//     };
//   });
// }

// function buildCategories(products: NormalizedProduct[]) {
//   const map = new Map<string, { name: string; slug: string }>();
//   for (const p of products) {
//     const c = p.category;
//     if (!c?.slug) continue;
//     if (!map.has(c.slug)) map.set(c.slug, c);
//   }
//   return [...map.values()];
// }

// // Shared button class
// const cartBtnClass =
//   "group inline-flex items-center justify-center w-full rounded-xl " +
//   "bg-blue-600 text-white py-3 font-semibold shadow-sm " +
//   "hover:bg-blue-700 active:scale-[0.99] " +
//   "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 " +
//   "transition";

// // ---------- data ----------
// async function fetchProductsByCategorySlug(slug: string) {
//   const encoded = encodeURIComponent(slug);

//   // Try to filter by slug field first (works when Category has slug/Slug)
//   const tryUrls = [
//     `${STRAPI}/api/products?populate=*&filters[category][slug][$eq]=${encoded}`,
//     `${STRAPI}/api/products?populate=*&filters[category][Slug][$eq]=${encoded}`,
//     // Fallback: filter by category name derived from slug (best-effort)
//     `${STRAPI}/api/products?populate=*`,
//   ];

//   for (let i = 0; i < tryUrls.length; i++) {
//     const res = await fetch(tryUrls[i], { cache: "no-store" });
//     if (!res.ok) continue;
//     const json = await res.json();
//     let data: any[] = json?.data ?? [];

//     // If the last fallback returns all products, manually filter to slug
//     if (i === tryUrls.length - 1 && Array.isArray(data) && data.length) {
//       data = data.filter((item: any) => {
//         const a = item?.attributes ? item.attributes : item || {};
//         const catA =
//           a?.category?.data?.attributes ??
//           a?.category?.attributes ??
//           a?.category ??
//           item?.category?.data?.attributes ??
//           item?.category?.attributes ??
//           item?.category;

//         if (!catA) return false;
//         const name = catA.Name ?? catA.name ?? catA.title ?? "";
//         return slugify(name) === slug;
//       });
//     }

//     if (Array.isArray(data) && data.length) return data;
//   }

//   return [];
// }

// async function fetchAllProductsForNav() {
//   try {
//     const res = await fetch(`${STRAPI}/api/products?populate=*`, { cache: "no-store" });
//     if (!res.ok) return [];
//     const json = await res.json();
//     return json.data ?? [];
//   } catch {
//     return [];
//   }
// }

// // ---------- page ----------
// // export default async function CategoryPage({ params }: { params: { slug: string } }) {
// //   const { slug } = params;

// export default async function CategoryPage(
//    { params }: { params: Promise<{ slug: string }> }
//  ) {
//    const { slug } = await params;

//   // products for this category
//   const raw = await fetchProductsByCategorySlug(slug);
//   const products = normalizeProducts(raw);

//   // if nothing matched, 404
//   if (!products.length) {
//     notFound();
//   }

//   // build categories for Navigation from all products (so menu still works)
//   const rawAll = await fetchAllProductsForNav();
//   const categories = buildCategories(normalizeProducts(rawAll));

//   // Find a friendly category title from first product
//   const title = products[0]?.category?.name ?? slug;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navigation categories={categories} />

//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-800 mb-4">{title}</h1>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Shop items in the <span className="font-semibold">{title}</span> category.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//           {products.map((p) => {
//             const imageUrl = p.images?.[0]?.url ?? "";
//             return (
//               <div
//                 key={p.id}
//                 className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 group"
//               >
//                 <div className="relative overflow-hidden">
//                   {imageUrl ? (
//                     <img
//                       src={imageUrl}
//                       alt={p.name}
//                       className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
//                     />
//                   ) : (
//                     <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
//                       <span className="text-gray-500">No image</span>
//                     </div>
//                   )}

//                   {p.featured && (
//                     <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
//                       Featured
//                     </div>
//                   )}

//                   <div className="absolute top-4 right-4">
//                     <button className="bg-white rounded-full p-2 shadow-md hover:bg-red-500 hover:text-white transition duration-300">
//                       <Heart className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="p-6">
//                   <div className="flex items-center mb-2">
//                     <div className="flex text-yellow-400">
//                       {[...Array(5)].map((_, i) => (
//                         <Star key={i} className="w-4 h-4 fill-current" />
//                       ))}
//                     </div>
//                     <span className="text-sm text-gray-600 ml-2">(Online reviews)</span>
//                   </div>

//                   <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">{p.name}</h3>

//                   <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                     {p.description || "No description available."}
//                   </p>

//                   <div className="flex items-center justify-between mb-4">
//                     <span className="text-2xl font-bold text-green-600">
//                       ₦{Number(p.price).toLocaleString()}
//                     </span>
//                     <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                       {p.category?.name ?? "Uncategorized"}
//                     </span>
//                   </div>

//                   {/* Add to cart – uses your CartContext via AddToCartButton */}
//                   <AddToCartButton
//                     id={p.id}
//                     name={p.name}
//                     price={p.price}
//                     image={imageUrl}
//                     className={cartBtnClass}
//                   >
//                     Add to Cart
//                   </AddToCartButton>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

// import { notFound } from "next/navigation";
// import Navigation from "@/components/Navigation";
// import { Star, Heart } from "lucide-react";
// import AddToCartButton from "@/components/AddToCartButton";
// import QuickView from "@/components/QuickView";

// const STRAPI = (process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337").replace(/\/$/, "");

// // ---------- helpers ----------
// function slugify(str = "") {
//   return str
//     .toString()
//     .toLowerCase()
//     .trim()
//     .replace(/\s+/g, "-")
//     .replace(/[^\w\-]+/g, "")
//     .replace(/\-\-+/g, "-");
// }

// type NormalizedProduct = {
//   id: number;
//   name: string;
//   description?: string | null;
//   price: number;
//   images: { url: string }[];
//   category?: { name: string; slug: string } | null;
//   featured?: boolean | null;
// };

// function normalizeProducts(items: any[]): NormalizedProduct[] {
//   return (items || []).map((item: any) => {
//     const a = item?.attributes ? item.attributes : item || {};

//     // images: array or { data: [] }
//     const imgField = a.Image_Upload;
//     let imagesRaw: any[] = [];
//     if (Array.isArray(imgField)) imagesRaw = imgField;
//     else if (imgField?.data) imagesRaw = Array.isArray(imgField.data) ? imgField.data : [imgField.data];

//     const images = imagesRaw
//       .map((m: any) => m?.attributes?.url ?? m?.url)
//       .filter(Boolean)
//       .map((u: string) => ({ url: u.startsWith("http") ? u : `${STRAPI}${u}` }));

//     // category shapes (v4/v5)
//     const catA =
//       a?.category?.data?.attributes ??
//       a?.category?.attributes ??
//       a?.category ??
//       item?.category?.data?.attributes ??
//       item?.category?.attributes ??
//       item?.category;

//     const category = catA
//       ? {
//           name: catA.Name ?? catA.name ?? catA.title ?? "",
//           slug: catA.Slug ?? catA.slug ?? slugify(catA.Name ?? catA.name ?? catA.title ?? ""),
//         }
//       : null;

//     const priceNum = Number(typeof a.Price === "string" ? parseFloat(a.Price) : a.Price || 0);

//     return {
//       id: item.id ?? a.id,
//       name: a.Panadol,
//       description: a.Product_description,
//       price: priceNum,
//       images,
//       featured: a.featured,
//       category,
//     };
//   });
// }

// function buildCategories(products: NormalizedProduct[]) {
//   const map = new Map<string, { name: string; slug: string }>();
//   for (const p of products) {
//     const c = p.category;
//     if (!c?.slug) continue;
//     if (!map.has(c.slug)) map.set(c.slug, c);
//   }
//   return [...map.values()];
// }

// // Shared button class
// const cartBtnClass =
//   "group inline-flex items-center justify-center w-full rounded-xl " +
//   "bg-blue-600 text-white py-3 font-semibold shadow-sm " +
//   "hover:bg-blue-700 active:scale-[0.99] " +
//   "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 " +
//   "transition";

// // ---------- data ----------
// async function fetchProductsByCategorySlug(slug: string) {
//   const encoded = encodeURIComponent(slug);

//   // Try to filter by slug field first (works when Category has slug/Slug)
//   const tryUrls = [
//     `${STRAPI}/api/products?populate=*&filters[category][slug][$eq]=${encoded}`,
//     `${STRAPI}/api/products?populate=*&filters[category][Slug][$eq]=${encoded}`,
//     // Fallback: filter by category name derived from slug (best-effort)
//     `${STRAPI}/api/products?populate=*`,
//   ];

//   for (let i = 0; i < tryUrls.length; i++) {
//     const res = await fetch(tryUrls[i], { cache: "no-store" });
//     if (!res.ok) continue;
//     const json = await res.json();
//     let data: any[] = json?.data ?? [];

//     // If the last fallback returns all products, manually filter to slug
//     if (i === tryUrls.length - 1 && Array.isArray(data) && data.length) {
//       data = data.filter((item: any) => {
//         const a = item?.attributes ? item.attributes : item || {};
//         const catA =
//           a?.category?.data?.attributes ??
//           a?.category?.attributes ??
//           a?.category ??
//           item?.category?.data?.attributes ??
//           item?.category?.attributes ??
//           item?.category;

//         if (!catA) return false;
//         const name = catA.Name ?? catA.name ?? catA.title ?? "";
//         return slugify(name) === slug;
//       });
//     }

//     if (Array.isArray(data) && data.length) return data;
//   }

//   return [];
// }

// async function fetchAllProductsForNav() {
//   try {
//     const res = await fetch(`${STRAPI}/api/products?populate=*`, { cache: "no-store" });
//     if (!res.ok) return [];
//     const json = await res.json();
//     return json.data ?? [];
//   } catch {
//     return [];
//   }
// }

// // ---------- page ----------
// export default async function CategoryPage(
//   { params }: { params: Promise<{ slug: string }> }
// ) {
//   const { slug } = await params;

//   // products for this category
//   const raw = await fetchProductsByCategorySlug(slug);
//   const products = normalizeProducts(raw);

//   // if nothing matched, 404
//   if (!products.length) {
//     notFound();
//   }

//   // build categories for Navigation from all products (so menu still works)
//   const rawAll = await fetchAllProductsForNav();
//   const categories = buildCategories(normalizeProducts(rawAll));

//   // Find a friendly category title from first product
//   const title = products[0]?.category?.name ?? slug;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* <Navigation categories={categories} /> */}

//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-800 mb-4">{title}</h1>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Shop items in the <span className="font-semibold">{title}</span> category.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//           {products.map((p) => {
//             const imageUrl = p.images?.[0]?.url ?? "";
//             return (
//               <div
//                 key={p.id}
//                 className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 group flex flex-col"
//               >
//                 {/* Image */}
//                 <div className="relative overflow-hidden">
//                   {imageUrl ? (
//                     <img
//                       src={imageUrl}
//                       alt={p.name}
//                       className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
//                     />
//                   ) : (
//                     <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
//                       <span className="text-gray-500">No image</span>
//                     </div>
//                   )}

//                   {p.featured && (
//                     <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
//                       Featured
//                     </div>
//                   )}

//                   <div className="absolute top-4 right-4">
//                     <button className="bg-white rounded-full p-2 shadow-md hover:bg-red-500 hover:text-white transition duration-300">
//                       <Heart className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Content */}
//                 <div className="p-6 flex flex-col h-full">
//                   <div className="flex items-center mb-2">
//                     <div className="flex text-yellow-400">
//                       {[...Array(5)].map((_, i) => (
//                         <Star key={i} className="w-4 h-4 fill-current" />
//                       ))}
//                     </div>
//                     <span className="text-sm text-gray-600 ml-2">(online reviews)</span>
//                   </div>

//                   {/* Title with consistent height */}
//                   <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[56px]">
//                     {p.name}
//                   </h3>

//                   {/* Description clamped + modal Read more */}
//                   <div className="text-gray-600 text-sm leading-relaxed mb-3">
//                     <p className="whitespace-pre-line line-clamp-4 min-h-[88px]">
//                       {p.description || "No description available."}
//                     </p>
//                     <QuickView
//                       title={p.name}
//                       text={p.description || ""}
//                       className="mt-1 text-blue-600 hover:underline text-sm"
//                     />
//                   </div>

//                   <div className="flex items-center justify-between mb-4">
//                     <span className="text-2xl font-bold text-green-600">
//                       ₦{Number(p.price).toLocaleString()}
//                     </span>
//                     <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                       {p.category?.name ?? "Uncategorized"}
//                     </span>
//                   </div>

//                   {/* Add to cart – uses your CartContext via AddToCartButton */}
//                   <div className="mt-auto">
//                     <AddToCartButton
//                       id={p.id}
//                       name={p.name}
//                       price={p.price}
//                       image={imageUrl}
//                       className={cartBtnClass}
//                     >
//                       Add to Cart
//                     </AddToCartButton>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

import { notFound } from "next/navigation";
import { Star, Heart, ShoppingCart } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import QuickView from "@/components/QuickView";

// ---------- ENV CONFIG ----------------------------------------------------
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI = STRAPI_URL.replace(/\/$/, "");

console.log("🔧 Category Page - Strapi URL:", STRAPI);

// ---------- TYPES ---------------------------------------------------------
interface NormalizedProduct {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  images: { url: string }[];
  category?: { name: string; slug: string } | null;
  featured?: boolean | null;
}

interface Category {
  name: string;
  slug: string;
}

// ---------- UTILS ---------------------------------------------------------
function slugify(str = ""): string {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function prefix(url?: string): string {
  if (!url) return "";
  return url.startsWith("http") ? url : `${STRAPI}${url}`;
}

// ---------- NORMALIZER ----------------------------------------------------
function normalizeProducts(items: any[]): NormalizedProduct[] {
  return (items || []).map((item: any) => {
    const a = item?.attributes ? item.attributes : item || {};

    // Handle images from Strapi v4/v5
    const imgField = a.Image_Upload;
    let imagesRaw: any[] = [];
    
    if (Array.isArray(imgField)) {
      imagesRaw = imgField;
    } else if (imgField?.data) {
      imagesRaw = Array.isArray(imgField.data) ? imgField.data : [imgField.data];
    }

    const images = imagesRaw
      .map((m: any) => m?.attributes?.url ?? m?.url)
      .filter(Boolean)
      .map((u: string) => ({ url: prefix(u) }));

    // Handle category
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

    const priceNum = Number(typeof a.Price === "string" ? parseFloat(a.Price) : a.Price || 0);

    return {
      id: item.id ?? a.id,
      name: a.Panadol || "Unnamed Product",
      description: a.Product_description,
      price: priceNum,
      images,
      featured: a.featured,
      category,
    };
  });
}

function buildCategories(products: NormalizedProduct[]): Category[] {
  const map = new Map<string, Category>();
  for (const p of products) {
    const c = p.category;
    if (!c?.slug) continue;
    if (!map.has(c.slug)) map.set(c.slug, c);
  }
  return Array.from(map.values());
}

// ---------- BUTTON STYLES -------------------------------------------------
const cartBtnClass =
  "group inline-flex items-center justify-center w-full rounded-xl " +
  "bg-blue-600 text-white py-3 font-semibold shadow-sm " +
  "hover:bg-blue-700 active:scale-[0.99] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 " +
  "transition";

// ---------- DATA FETCHING -------------------------------------------------
async function fetchProductsByCategorySlug(slug: string): Promise<any[]> {
  const encodedSlug = encodeURIComponent(slug);
  
  console.log(`📂 Fetching products for category slug: ${slug}`);
  
  // Strategy 1: Try to filter by category slug directly
  const urlsToTry = [
    `${STRAPI}/api/products?populate=*&filters[category][slug][$eq]=${encodedSlug}&pagination[pageSize]=100`,
    `${STRAPI}/api/products?populate=*&filters[category][Slug][$eq]=${encodedSlug}&pagination[pageSize]=100`,
    // Strategy 2: Try filtering by categories endpoint first, then products
    `${STRAPI}/api/categories?filters[slug][$eq]=${encodedSlug}&populate[products][populate]=*`,
    // Strategy 3: Get all and filter manually
    `${STRAPI}/api/products?populate=*&pagination[pageSize]=200`,
  ];

  for (let i = 0; i < urlsToTry.length; i++) {
    try {
      const url = urlsToTry[i];
      console.log(`   Trying URL ${i + 1}: ${url.split('?')[0]}...`);
      
      const res = await fetch(url, { 
        cache: "no-store",
        next: { tags: [`category-${slug}`] }
      });
      
      if (!res.ok) continue;
      
      const json = await res.json();
      let data: any[] = [];

      // Handle different response structures
      if (i < 2) {
        // Direct product filtering
        data = json.data || [];
      } else if (i === 2) {
        // Categories endpoint with populated products
        const categoryData = json.data?.[0];
        if (categoryData?.attributes?.products?.data) {
          data = categoryData.attributes.products.data;
        }
      } else {
        // All products - filter manually
        data = (json.data || []).filter((item: any) => {
          const a = item?.attributes ? item.attributes : item || {};
          const catA =
            a?.category?.data?.attributes ??
            a?.category?.attributes ??
            a?.category ??
            item?.category?.data?.attributes ??
            item?.category?.attributes ??
            item?.category;

          if (!catA) return false;
          const name = catA.Name ?? catA.name ?? catA.title ?? "";
          return slugify(name) === slug;
        });
      }

      if (Array.isArray(data) && data.length > 0) {
        console.log(`   ✅ Found ${data.length} products`);
        return data;
      }
    } catch (error) {
      console.error(`   ❌ Error fetching from URL ${i + 1}:`, error);
      continue;
    }
  }

  console.log(`   ❌ No products found for category: ${slug}`);
  return [];
}

async function fetchAllProductsForNav(): Promise<any[]> {
  try {
    const res = await fetch(`${STRAPI}/api/products?populate=*&pagination[pageSize]=50`, { 
      cache: "no-store" 
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch (error) {
    console.error("Error fetching products for navigation:", error);
    return [];
  }
}

// ---------- PAGE COMPONENT ------------------------------------------------
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  console.log(`🚀 Category Page: ${slug}`);

  // Fetch products for this category
  const rawProducts = await fetchProductsByCategorySlug(slug);
  const products = normalizeProducts(rawProducts);

  // If no products found, show 404
  if (!products.length) {
    console.log(`❌ 404: No products found for category slug: ${slug}`);
    notFound();
  }

  // Fetch all products for navigation categories
  const rawAllProducts = await fetchAllProductsForNav();
  const allProducts = normalizeProducts(rawAllProducts);
  const categories = buildCategories(allProducts);

  // Get category title from first product
  const categoryTitle = products[0]?.category?.name ?? slug.replace(/-/g, " ");
  const productCount = products.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 capitalize">
            {categoryTitle}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {productCount} {productCount === 1 ? "product" : "products"} found in the{" "}
            <span className="font-semibold">{categoryTitle}</span> category.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => {
            const imageUrl = product.images?.[0]?.url ?? "";
            const categoryName = product.category?.name ?? "Uncategorized";

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 group flex flex-col"
              >
                {/* Product Image */}
                <div className="relative overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}

                  {/* Featured Badge */}
                  {product.featured && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <div className="absolute top-4 right-4">
                    <button
                      className="bg-white rounded-full p-2 shadow-md hover:bg-red-500 hover:text-white transition duration-300"
                      aria-label="Add to wishlist"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Product Content */}
                <div className="p-6 flex flex-col h-full">
                  {/* Rating */}
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      (online reviews)
                    </span>
                  </div>

                  {/* Product Title */}
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[56px]">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <div className="text-gray-600 text-sm leading-relaxed mb-3">
                    <p className="whitespace-pre-line line-clamp-4 min-h-[88px]">
                      {product.description || "No description available."}
                    </p>
                    <QuickView
                      title={product.name}
                      text={product.description || ""}
                      className="mt-1 text-blue-600 hover:underline text-sm"
                    />
                  </div>

                  {/* Price & Category */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-green-600">
                      ₦{product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {categoryName}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="mt-auto">
                    <AddToCartButton
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={imageUrl}
                      className={cartBtnClass}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Heart className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find any products in this category. Please check back later or browse other categories.
            </p>
          </div>
        )}
      </div>

      {/* Back to Home Link */}
      <div className="container mx-auto px-4 py-8 text-center">
        <a
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to all products
        </a>
      </div>
    </div>
  );
}

// ---------- METADATA (Optional) -------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categoryName = slug.replace(/-/g, " ");
  
  return {
    title: `${categoryName} Products | CherryBliss`,
    description: `Browse our premium ${categoryName} products at CherryBliss. High-quality health and wellness products.`,
    openGraph: {
      title: `${categoryName} Products | CherryBliss`,
      description: `Browse our premium ${categoryName} products.`,
      type: "website",
    },
  };
}
