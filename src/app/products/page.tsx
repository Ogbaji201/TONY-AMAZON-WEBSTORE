// import Navigation from "@/components/Navigation";
// import { ShoppingBag, Star, Heart } from "lucide-react";
// import AddToCartButton from "@/components/AddToCartButton";

// // --- ENV --------------------------------------------------------------------
// const STRAPI = (process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337").replace(/\/$/, "");

// // --- Helpers ----------------------------------------------------------------
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
//   name: string;                  // Panadol in your schema
//   description?: string | null;   // Product_description
//   price: number;                 // Price
//   images: { url: string }[];     // Image_UploadQ
//   category?: { name: string; slug: string } | null;
//   featured?: boolean | null;
// };

// // Normalize Strapi v4/v5 product shapes
// function normalizeProducts(items: any[]): NormalizedProduct[] {
//   return (items || []).map((item: any) => {
//     const a = item?.attributes ? item.attributes : item || {};

//     // Images: array or { data: [] }
//     const imgField = a.Image_Upload;
//     let imagesRaw: any[] = [];
//     if (Array.isArray(imgField)) imagesRaw = imgField;
//     else if (imgField?.data) imagesRaw = Array.isArray(imgField.data) ? imgField.data : [imgField.data];

//     const images = imagesRaw
//       .map((m: any) => m?.attributes?.url ?? m?.url)
//       .filter(Boolean)
//       .map((u: string) => ({ url: u.startsWith("http") ? u : `${STRAPI}${u}` }));

//     // Category: object / {attributes} / {data:{attributes}}
//     let catAttrs: any =
//       a?.category?.data?.attributes ??
//       a?.category?.attributes ??
//       a?.category ??
//       item?.category?.data?.attributes ??
//       item?.category?.attributes ??
//       item?.category;

//     const category = catAttrs
//       ? {
//           name: catAttrs.Name ?? catAttrs.name ?? catAttrs.title ?? "",
//           slug:
//             catAttrs.Slug ??
//             catAttrs.slug ??
//             slugify(catAttrs.Name ?? catAttrs.name ?? catAttrs.title ?? ""),
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
//     } as NormalizedProduct;
//   });
// }

// // Build { name, slug }[] for Navigation
// function buildCategories(products: NormalizedProduct[]) {
//   const map = new Map<string, { name: string; slug: string }>();
//   for (const p of products) {
//     const c = p.category;
//     if (!c?.slug) continue;
//     if (!map.has(c.slug)) map.set(c.slug, c);
//   }
//   return [...map.values()];
// }

// // Nice button style used across pages
// const cartBtnClass =
//   "group inline-flex items-center justify-center w-full rounded-xl " +
//   "bg-blue-600 text-white py-3 font-semibold shadow-sm " +
//   "hover:bg-blue-700 active:scale-[0.99] " +
//   "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 " +
//   "transition";

// // --- Data -------------------------------------------------------------------
// async function fetchProductsRaw() {
//   const res = await fetch(`${STRAPI}/api/products?populate=*`, { cache: "no-store" });
//   if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
//   const json = await res.json();
//   return json.data as any[];
// }

// // --- Page -------------------------------------------------------------------
// export default async function ProductsPage() {
//   let raw: any[] = [];
//   try {
//     raw = await fetchProductsRaw();
//   } catch (e) {
//     console.error(e);
//   }

//   const products = normalizeProducts(raw);
//   const categories = buildCategories(products);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navigation categories={categories} />

//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
//             <ShoppingBag className="w-8 h-8 mr-3" />
//             All Products
//           </h1>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Browse our complete collection of premium pharmaceutical products
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
//                     <span className="text-sm text-gray-600 ml-2">(online reviews)</span>
//                   </div>

//                   <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                     {p.name}
//                   </h3>

//                   <p className="text-gray-600 text-sm mb-4 white-space-pre-line">
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

//                   <AddToCartButton
//                     id={p.id}
//                     name={p.name}
//                     price={p.price}
//                     image={imageUrl}
//                     className={cartBtnClass}
//                   >
//                     {/* icon can be added in the button component or here */}
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

// import Navigation from "@/components/Navigation";
import { ShoppingBag, Star, Heart } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import QuickView from "@/components/QuickView";

// --- ENV --------------------------------------------------------------------
const STRAPI = (process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337").replace(/\/$/, "");

// --- Helpers ----------------------------------------------------------------
function slugify(str = "") {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

type NormalizedProduct = {
  id: number;
  name: string;                  // Panadol in your schema
  description?: string | null;   // Product_description
  price: number;                 // Price
  images: { url: string }[];     // Image_Upload
  category?: { name: string; slug: string } | null;
  featured?: boolean | null;
};

// Normalize Strapi v4/v5 product shapes
function normalizeProducts(items: any[]): NormalizedProduct[] {
  return (items || []).map((item: any) => {
    const a = item?.attributes ? item.attributes : item || {};

    // Images: array or { data: [] }
    const imgField = a.Image_Upload;
    let imagesRaw: any[] = [];
    if (Array.isArray(imgField)) imagesRaw = imgField;
    else if (imgField?.data) imagesRaw = Array.isArray(imgField.data) ? imgField.data : [imgField.data];

    const images = imagesRaw
      .map((m: any) => m?.attributes?.url ?? m?.url)
      .filter(Boolean)
      .map((u: string) => ({ url: u.startsWith("http") ? u : `${STRAPI}${u}` }));

    // Category: object / {attributes} / {data:{attributes}}
    const catAttrs: any =
      a?.category?.data?.attributes ??
      a?.category?.attributes ??
      a?.category ??
      item?.category?.data?.attributes ??
      item?.category?.attributes ??
      item?.category;

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
      name: a.Panadol,
      description: a.Product_description,
      price: priceNum,
      images,
      featured: a.featured,
      category,
    } as NormalizedProduct;
  });
}

// Build { name, slug }[] for Navigation
function buildCategories(products: NormalizedProduct[]) {
  const map = new Map<string, { name: string; slug: string }>();
  for (const p of products) {
    const c = p.category;
    if (!c?.slug) continue;
    if (!map.has(c.slug)) map.set(c.slug, c);
  }
  return [...map.values()];
}

// Nice button style used across pages
const cartBtnClass =
  "group inline-flex items-center justify-center w-full rounded-xl " +
  "bg-blue-600 text-white py-3 font-semibold shadow-sm " +
  "hover:bg-blue-700 active:scale-[0.99] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 " +
  "transition";

// --- Data -------------------------------------------------------------------
async function fetchProductsRaw() {
  const res = await fetch(`${STRAPI}/api/products?populate=*`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  const json = await res.json();
  return json.data as any[];
}

// --- Page -------------------------------------------------------------------
export default async function ProductsPage() {
  let raw: any[] = [];
  try {
    raw = await fetchProductsRaw();
  } catch (e) {
    console.error(e);
  }

  const products = normalizeProducts(raw);
  const categories = buildCategories(products);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation categories={categories} />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 mr-3" />
            All Products
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our complete collection of premium pharmaceutical products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((p) => {
            const imageUrl = p.images?.[0]?.url ?? "";

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 group flex flex-col"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={p.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}

                  {p.featured && (
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

                {/* Content */}
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">(online reviews)</span>
                  </div>

                  {/* Title with consistent height */}
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[56px]">
                    {p.name}
                  </h3>

                  {/* Description clamped + modal Read more */}
                  <div className="text-gray-600 text-sm leading-relaxed mb-3">
                    <p className="whitespace-pre-line line-clamp-4 min-h-[88px]">
                      {p.description || "No description available."}
                    </p>
                    <QuickView
                      title={p.name}
                      text={p.description || ""}
                      className="mt-1 text-blue-600 hover:underline text-sm"
                    />
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-green-600">
                      ₦{Number(p.price).toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {p.category?.name ?? "Uncategorized"}
                    </span>
                  </div>

                  {/* CTA anchored to bottom */}
                  <div className="mt-auto">
                    <AddToCartButton
                      id={p.id}
                      name={p.name}
                      price={p.price}
                      image={imageUrl}
                      className={cartBtnClass}
                    >
                      Add to Cart
                    </AddToCartButton>
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
