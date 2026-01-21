
// import { notFound } from "next/navigation";
// import { Star, Heart, ShoppingCart } from "lucide-react";
// import AddToCartButton from "@/components/AddToCartButton";
// import QuickView from "@/components/QuickView";

// // ---------- ENV CONFIG ----------------------------------------------------
// const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
// const STRAPI = STRAPI_URL.replace(/\/$/, "");

// console.log("🔧 Category Page - Strapi URL:", STRAPI);

// // ---------- TYPES ---------------------------------------------------------
// interface NormalizedProduct {
//   id: number;
//   name: string;
//   description?: string | null;
//   price: number;
//   images: { url: string }[];
//   category?: { name: string; slug: string } | null;
//   featured?: boolean | null;
// }

// interface Category {
//   name: string;
//   slug: string;
// }

// // ---------- UTILS ---------------------------------------------------------
// function slugify(str = ""): string {
//   return str
//     .toString()
//     .toLowerCase()
//     .trim()
//     .replace(/\s+/g, "-")
//     .replace(/[^\w\-]+/g, "")
//     .replace(/\-\-+/g, "-");
// }

// function prefix(url?: string): string {
//   if (!url) return "";
//   return url.startsWith("http") ? url : `${STRAPI}${url}`;
// }

// // ---------- NORMALIZER ----------------------------------------------------
// function normalizeProducts(items: any[]): NormalizedProduct[] {
//   return (items || []).map((item: any) => {
//     const a = item?.attributes ? item.attributes : item || {};

//     // Handle images from Strapi v4/v5
//     const imgField = a.Image_Upload;
//     let imagesRaw: any[] = [];
    
//     if (Array.isArray(imgField)) {
//       imagesRaw = imgField;
//     } else if (imgField?.data) {
//       imagesRaw = Array.isArray(imgField.data) ? imgField.data : [imgField.data];
//     }

//     const images = imagesRaw
//       .map((m: any) => m?.attributes?.url ?? m?.url)
//       .filter(Boolean)
//       .map((u: string) => ({ url: prefix(u) }));

//     // Handle category
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

//     const priceNum = Number(typeof a.Price === "string" ? parseFloat(a.Price) : a.Price || 0);

//     return {
//       id: item.id ?? a.id,
//       name: a.Panadol || "Unnamed Product",
//       description: a.Product_description,
//       price: priceNum,
//       images,
//       featured: a.featured,
//       category,
//     };
//   });
// }

// function buildCategories(products: NormalizedProduct[]): Category[] {
//   const map = new Map<string, Category>();
//   for (const p of products) {
//     const c = p.category;
//     if (!c?.slug) continue;
//     if (!map.has(c.slug)) map.set(c.slug, c);
//   }
//   return Array.from(map.values());
// }

// // ---------- BUTTON STYLES -------------------------------------------------
// const cartBtnClass =
//   "group inline-flex items-center justify-center w-full rounded-xl " +
//   "bg-blue-600 text-white py-3 font-semibold shadow-sm " +
//   "hover:bg-blue-700 active:scale-[0.99] " +
//   "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 " +
//   "transition";

// // ---------- DATA FETCHING -------------------------------------------------
// async function fetchProductsByCategorySlug(slug: string): Promise<any[]> {
//   const encodedSlug = encodeURIComponent(slug);
  
//   console.log(`📂 Fetching products for category slug: ${slug}`);
  
//   // Strategy 1: Try to filter by category slug directly
//   const urlsToTry = [
//     `${STRAPI}/api/products?populate=*&filters[category][slug][$eq]=${encodedSlug}&pagination[pageSize]=100`,
//     `${STRAPI}/api/products?populate=*&filters[category][Slug][$eq]=${encodedSlug}&pagination[pageSize]=100`,
//     // Strategy 2: Try filtering by categories endpoint first, then products
//     `${STRAPI}/api/categories?filters[slug][$eq]=${encodedSlug}&populate[products][populate]=*`,
//     // Strategy 3: Get all and filter manually
//     `${STRAPI}/api/products?populate=*&pagination[pageSize]=200`,
//   ];

//   for (let i = 0; i < urlsToTry.length; i++) {
//     try {
//       const url = urlsToTry[i];
//       console.log(`   Trying URL ${i + 1}: ${url.split('?')[0]}...`);
      
//       const res = await fetch(url, { 
//         cache: "no-store",
//         next: { tags: [`category-${slug}`] }
//       });
      
//       if (!res.ok) continue;
      
//       const json = await res.json();
//       let data: any[] = [];

//       // Handle different response structures
//       if (i < 2) {
//         // Direct product filtering
//         data = json.data || [];
//       } else if (i === 2) {
//         // Categories endpoint with populated products
//         const categoryData = json.data?.[0];
//         if (categoryData?.attributes?.products?.data) {
//           data = categoryData.attributes.products.data;
//         }
//       } else {
//         // All products - filter manually
//         data = (json.data || []).filter((item: any) => {
//           const a = item?.attributes ? item.attributes : item || {};
//           const catA =
//             a?.category?.data?.attributes ??
//             a?.category?.attributes ??
//             a?.category ??
//             item?.category?.data?.attributes ??
//             item?.category?.attributes ??
//             item?.category;

//           if (!catA) return false;
//           const name = catA.Name ?? catA.name ?? catA.title ?? "";
//           return slugify(name) === slug;
//         });
//       }

//       if (Array.isArray(data) && data.length > 0) {
//         console.log(`   ✅ Found ${data.length} products`);
//         return data;
//       }
//     } catch (error) {
//       console.error(`   ❌ Error fetching from URL ${i + 1}:`, error);
//       continue;
//     }
//   }

//   console.log(`   ❌ No products found for category: ${slug}`);
//   return [];
// }

// async function fetchAllProductsForNav(): Promise<any[]> {
//   try {
//     const res = await fetch(`${STRAPI}/api/products?populate=*&pagination[pageSize]=50`, { 
//       cache: "no-store" 
//     });
//     if (!res.ok) return [];
//     const json = await res.json();
//     return json.data ?? [];
//   } catch (error) {
//     console.error("Error fetching products for navigation:", error);
//     return [];
//   }
// }

// // ---------- PAGE COMPONENT ------------------------------------------------
// export default async function CategoryPage({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   const { slug } = await params;
  
//   console.log(`🚀 Category Page: ${slug}`);

//   // Fetch products for this category
//   const rawProducts = await fetchProductsByCategorySlug(slug);
//   const products = normalizeProducts(rawProducts);

//   // If no products found, show 404
//   if (!products.length) {
//     console.log(`❌ 404: No products found for category slug: ${slug}`);
//     notFound();
//   }

//   // Fetch all products for navigation categories
//   const rawAllProducts = await fetchAllProductsForNav();
//   const allProducts = normalizeProducts(rawAllProducts);
//   const categories = buildCategories(allProducts);

//   // Get category title from first product
//   const categoryTitle = products[0]?.category?.name ?? slug.replace(/-/g, " ");
//   const productCount = products.length;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-4 py-8">
//         {/* Category Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-800 mb-4 capitalize">
//             {categoryTitle}
//           </h1>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             {productCount} {productCount === 1 ? "product" : "products"} found in the{" "}
//             <span className="font-semibold">{categoryTitle}</span> category.
//           </p>
//         </div>

//         {/* Products Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//           {products.map((product) => {
//             const imageUrl = product.images?.[0]?.url ?? "";
//             const categoryName = product.category?.name ?? "Uncategorized";

//             return (
//               <div
//                 key={product.id}
//                 className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 group flex flex-col"
//               >
//                 {/* Product Image */}
//                 <div className="relative overflow-hidden">
//                   {imageUrl ? (
//                     <img
//                       src={imageUrl}
//                       alt={product.name}
//                       className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
//                       loading="lazy"
//                     />
//                   ) : (
//                     <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
//                       <span className="text-gray-500">No image</span>
//                     </div>
//                   )}

//                   {/* Featured Badge */}
//                   {product.featured && (
//                     <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
//                       Featured
//                     </div>
//                   )}

//                   {/* Wishlist Button */}
//                   <div className="absolute top-4 right-4">
//                     <button
//                       className="bg-white rounded-full p-2 shadow-md hover:bg-red-500 hover:text-white transition duration-300"
//                       aria-label="Add to wishlist"
//                     >
//                       <Heart className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Product Content */}
//                 <div className="p-6 flex flex-col h-full">
//                   {/* Rating */}
//                   <div className="flex items-center mb-2">
//                     <div className="flex text-yellow-400">
//                       {[...Array(5)].map((_, i) => (
//                         <Star key={i} className="w-4 h-4 fill-current" />
//                       ))}
//                     </div>
//                     <span className="text-sm text-gray-600 ml-2">
//                       (online reviews)
//                     </span>
//                   </div>

//                   {/* Product Title */}
//                   <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[56px]">
//                     {product.name}
//                   </h3>

//                   {/* Description */}
//                   <div className="text-gray-600 text-sm leading-relaxed mb-3">
//                     <p className="whitespace-pre-line line-clamp-4 min-h-[88px]">
//                       {product.description || "No description available."}
//                     </p>
//                     <QuickView
//                       title={product.name}
//                       text={product.description || ""}
//                       className="mt-1 text-blue-600 hover:underline text-sm"
//                     />
//                   </div>

//                   {/* Price & Category */}
//                   <div className="flex items-center justify-between mb-4">
//                     <span className="text-2xl font-bold text-green-600">
//                       ₦{product.price.toLocaleString()}
//                     </span>
//                     <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                       {categoryName}
//                     </span>
//                   </div>

//                   {/* Add to Cart Button */}
//                   <div className="mt-auto">
//                     <AddToCartButton
//                       id={product.id}
//                       name={product.name}
//                       price={product.price}
//                       image={imageUrl}
//                       className={cartBtnClass}
//                     />
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Empty State */}
//         {products.length === 0 && (
//           <div className="text-center py-16">
//             <div className="text-gray-400 mb-4">
//               <Heart className="w-16 h-16 mx-auto" />
//             </div>
//             <h3 className="text-2xl font-semibold text-gray-700 mb-2">
//               No Products Found
//             </h3>
//             <p className="text-gray-500 max-w-md mx-auto">
//               We couldn't find any products in this category. Please check back later or browse other categories.
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Back to Home Link */}
//       <div className="container mx-auto px-4 py-8 text-center">
//         <a
//           href="/"
//           className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
//         >
//           ← Back to all products
//         </a>
//       </div>
//     </div>
//   );
// }

// // ---------- METADATA (Optional) -------------------------------------------
// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   const { slug } = await params;
//   const categoryName = slug.replace(/-/g, " ");
  
//   return {
//     title: `${categoryName} Products | CherryBliss`,
//     description: `Browse our premium ${categoryName} products at CherryBliss. High-quality health and wellness products.`,
//     openGraph: {
//       title: `${categoryName} Products | CherryBliss`,
//       description: `Browse our premium ${categoryName} products.`,
//       type: "website",
//     },
//   };
// }
import { Star, Heart } from "lucide-react";
import SafeImg from "@/components/SafeImg";
import AddToCartButton from "@/components/AddToCartButton";
import QuickView from "@/components/QuickView";

export const dynamic = "force-dynamic";

const STRAPI = (process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1338").replace(/\/$/, "");

// ---------- helpers ----------
function normalizeStrapiUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  return `${STRAPI}${url.startsWith("/") ? url : `/${url}`}`;
}

function blocksToText(value: any): string {
  if (!value) return "";
  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    return value
      .map((node) => blocksToText(node))
      .filter(Boolean)
      .join("\n")
      .trim();
  }

  if (typeof value === "object") {
    if (Array.isArray(value.children)) return blocksToText(value.children);
    if (typeof value.text === "string") return value.text;
  }

  return "";
}

function pickMediaUrl(media: any): string {
  const formats = media?.formats;
  return (
    formats?.medium?.url ||
    formats?.small?.url ||
    formats?.thumbnail?.url ||
    media?.url ||
    ""
  );
}

function extractImages(field: any): { url: string }[] {
  if (!field) return [];

  if (Array.isArray(field)) {
    return field
      .map((m) => {
        const attrs = m?.attributes ?? m;
        const u = pickMediaUrl(attrs);
        return u ? { url: normalizeStrapiUrl(u) } : null;
      })
      .filter(Boolean) as { url: string }[];
  }

  if (field?.data) {
    const data = Array.isArray(field.data) ? field.data : [field.data];
    return data
      .map((m: any) => {
        const attrs = m?.attributes ?? m;
        const u = pickMediaUrl(attrs);
        return u ? { url: normalizeStrapiUrl(u) } : null;
      })
      .filter(Boolean) as { url: string }[];
  }

  const attrs = field?.attributes ?? field;
  const u = pickMediaUrl(attrs);
  return u ? [{ url: normalizeStrapiUrl(u) }] : [];
}

// ---------- types ----------
type NormalizedProduct = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  images: { url: string }[];
  featured?: boolean | null;
  category?: { name: string; slug: string } | null;
};

function normalizeProducts(items: any[]): NormalizedProduct[] {
  return (items || []).map((item: any) => {
    const a = item?.attributes ? item.attributes : item || {};

    const name = a.name ?? a.title ?? a.Name ?? a.Title ?? "Unnamed Product";

    const descriptionRaw =
      a.description ??
      a.Product_description ??
      a.Description ??
      a.product_description ??
      null;

    const description = blocksToText(descriptionRaw) || null;

    const rawPrice = a.price ?? a.Price ?? 0;
    const priceNum =
      typeof rawPrice === "string" ? parseFloat(rawPrice) : Number(rawPrice || 0);

    const images = extractImages(a.image ?? a.images ?? a.Image_Upload ?? null);

    const categoryData = a.category?.data ?? a.category ?? null;
    let category = null;

    if (categoryData) {
      const cat = Array.isArray(categoryData) ? categoryData[0] : categoryData;
      const catAttrs = cat?.attributes ? cat.attributes : cat || {};
      const catName = catAttrs.name ?? catAttrs.Name ?? catAttrs.title ?? "";
      category = {
        name: catName,
        slug: catAttrs.slug ?? catAttrs.Slug ?? "",
      };
    }

    return {
      id: item.id ?? a.id,
      name,
      description,
      price: Number.isFinite(priceNum) ? priceNum : 0,
      images,
      featured: a.featured ?? false,
      category,
    };
  });
}

async function getProductsByCategorySlug(slug: string): Promise<NormalizedProduct[]> {
  const url =
    `${STRAPI}/api/products?` +
    `filters[category][slug][$eq]=${encodeURIComponent(slug)}` +
    `&populate=*` +
    `&pagination[pageSize]=100`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return normalizeProducts(json.data ?? []);
  } catch {
    return [];
  }
}

async function getCategoryName(slug?: string): Promise<string> {
  if (!slug) return "Category";

  const url =
    `${STRAPI}/api/categories?filters[slug][$eq]=${encodeURIComponent(slug)}` +
    `&populate=*`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return slug.replace(/-/g, " ");
    const json = await res.json();
    const first = json?.data?.[0];
    const a = first?.attributes ? first.attributes : first;
    return (a?.name ?? a?.title ?? slug.replace(/-/g, " ")) as string;
  } catch {
    return slug.replace(/-/g, " ");
  }
}

const cartBtnClass =
  "group inline-flex items-center justify-center w-full rounded-xl " +
  "bg-blue-600 text-white py-3 font-semibold shadow-sm " +
  "hover:bg-blue-700 active:scale-[0.99] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 " +
  "transition";

// ---------- page ----------
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [categoryName, products] = await Promise.all([
    getCategoryName(slug),
    getProductsByCategorySlug(slug),
  ]);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center mb-10">{categoryName}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((p) => {
            const imageUrl = p.images?.[0]?.url ?? "";

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
              >
                <SafeImg
                  src={imageUrl}
                  alt={p.name}
                  className="w-full h-64 object-cover"
                />

                <div className="p-6 flex flex-col h-full">
                  <h3 className="text-xl font-semibold mb-2">{p.name}</h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {p.description || "No description available."}
                  </p>

                  <span className="text-2xl font-bold text-green-600 mb-4">
                    ₦{Number(p.price).toLocaleString()}
                  </span>

                  <div className="mt-auto">
                    <AddToCartButton
                      id={p.id}
                      name={p.name}
                      price={p.price}
                      image={imageUrl}
                      className={cartBtnClass}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
