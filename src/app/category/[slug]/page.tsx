
// import Navigation from "@/components/Navigation";
// import ProductGrid from "@/components/ProductGrid";
// import Link from "next/link";
// import { notFound } from "next/navigation";

// const STRAPI = (process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337").replace(/\/$/, "");

// // Fetch products by category Slug (Strapi v5 uses capitalized "Slug")
// async function getProductsByCategory(slug: string) {
//   const url =
//     `${STRAPI}/api/products` +
//     `?filters[category][Slug][$eq]=${encodeURIComponent(slug)}` + // ✅ capital S
//     `&populate=*`;

//   try {
//     const res = await fetch(url, { cache: "no-store" });
//     if (!res.ok) {
//       const body = await res.text().catch(() => "(no body)");
//       console.error(
//         "CATEGORY PRODUCTS ERROR ->",
//         res.status,
//         res.statusText,
//         "\nURL:", url,
//         "\nBODY:", body
//       );
//       return [];
//     }
//     const json = await res.json();
//     return json.data as any[];
//   } catch (err) {
//     console.error("Error fetching category products:", err);
//     return [];
//   }
// }

// // Fetch categories (for the nav)
// function slugify(str = "") {
//   return str.toString().toLowerCase().trim()
//     .replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");
// }

// async function getCategories() {
//   const url = `${STRAPI}/api/categories?pagination[pageSize]=100`;
//   try {
//     const res = await fetch(url, { cache: "no-store" });
//     if (!res.ok) throw new Error("Failed to fetch categories");
//     const json = await res.json();
//     return (json.data || []).map((c: any) => {
//       const a = c.attributes ? c.attributes : c;
//       const name = a.Name ?? a.name ?? a.title ?? "";
//       const slug = a.Slug ?? a.slug ?? slugify(name);
//       return { name, slug };
//     });
//   } catch (err) {
//     console.error("Error fetching categories:", err);
//     return [];
//   }
// }

// export default async function CategoryPage({
//   params,
// }: {
//   // ✅ Next.js 15: params is async — await it before use
//   params: Promise<{ slug: string }>;
// }) {
//   const { slug } = await params;
//   const decodedSlug = decodeURIComponent(slug);

//   const [products, categories] = await Promise.all([
//     getProductsByCategory(decodedSlug),
//     getCategories(),
//   ]);

//   if (!products || products.length === 0) {
//     // You can remove this if you prefer showing an empty state instead
//     notFound();
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navigation categories={categories} />

//       <div className="container mx-auto px-4 py-8">
//         {/* Breadcrumbs */}
//         <nav className="text-sm text-gray-500 mb-6">
//           <Link href="/" className="hover:text-blue-600">Home</Link>
//           <span className="mx-2">/</span>
//           <Link href="/products" className="hover:text-blue-600">Products</Link>
//           <span className="mx-2">/</span>
//           <span className="text-gray-800 capitalize">
//             {decodedSlug.replace(/-/g, " ")}
//           </span>
//         </nav>

//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-800 mb-4">
//             {decodedSlug.replace(/-/g, " ")} Products ({products.length})
//           </h1>
//         </div>

//         {/* Pass raw Strapi items (same shape as /products page) */}
//         <ProductGrid products={products} />
//       </div>
//     </div>
//   );
// }

import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import { ShoppingBag, Star, Heart } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";

const STRAPI = (process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337").replace(/\/$/, "");

// ---------- helpers ----------
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
  name: string;
  description?: string | null;
  price: number;
  images: { url: string }[];
  category?: { name: string; slug: string } | null;
  featured?: boolean | null;
};

function normalizeProducts(items: any[]): NormalizedProduct[] {
  return (items || []).map((item: any) => {
    const a = item?.attributes ? item.attributes : item || {};

    // images: array or { data: [] }
    const imgField = a.Image_Upload;
    let imagesRaw: any[] = [];
    if (Array.isArray(imgField)) imagesRaw = imgField;
    else if (imgField?.data) imagesRaw = Array.isArray(imgField.data) ? imgField.data : [imgField.data];

    const images = imagesRaw
      .map((m: any) => m?.attributes?.url ?? m?.url)
      .filter(Boolean)
      .map((u: string) => ({ url: u.startsWith("http") ? u : `${STRAPI}${u}` }));

    // category shapes (v4/v5)
    const catA =
      a?.category?.data?.attributes ??
      a?.category?.attributes ??
      a?.category ??
      item?.category?.data?.attributes ??
      item?.category?.attributes ??
      item?.category;

    const category = catA
      ? {
          name: catA.Name ?? catA.name ?? catA.title ?? "",
          slug: catA.Slug ?? catA.slug ?? slugify(catA.Name ?? catA.name ?? catA.title ?? ""),
        }
      : null;

    const priceNum = Number(typeof a.Price === "string" ? parseInt(a.Price, 10) : a.Price || 0);

    return {
      id: item.id ?? a.id,
      name: a.Panadol,
      description: a.Product_description,
      price: priceNum,
      images,
      featured: a.featured,
      category,
    };
  });
}

function buildCategories(products: NormalizedProduct[]) {
  const map = new Map<string, { name: string; slug: string }>();
  for (const p of products) {
    const c = p.category;
    if (!c?.slug) continue;
    if (!map.has(c.slug)) map.set(c.slug, c);
  }
  return [...map.values()];
}

// Shared button class
const cartBtnClass =
  "group inline-flex items-center justify-center w-full rounded-xl " +
  "bg-blue-600 text-white py-3 font-semibold shadow-sm " +
  "hover:bg-blue-700 active:scale-[0.99] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 " +
  "transition";

// ---------- data ----------
async function fetchProductsByCategorySlug(slug: string) {
  const encoded = encodeURIComponent(slug);

  // Try to filter by slug field first (works when Category has slug/Slug)
  const tryUrls = [
    `${STRAPI}/api/products?populate=*&filters[category][slug][$eq]=${encoded}`,
    `${STRAPI}/api/products?populate=*&filters[category][Slug][$eq]=${encoded}`,
    // Fallback: filter by category name derived from slug (best-effort)
    `${STRAPI}/api/products?populate=*`,
  ];

  for (let i = 0; i < tryUrls.length; i++) {
    const res = await fetch(tryUrls[i], { cache: "no-store" });
    if (!res.ok) continue;
    const json = await res.json();
    let data: any[] = json?.data ?? [];

    // If the last fallback returns all products, manually filter to slug
    if (i === tryUrls.length - 1 && Array.isArray(data) && data.length) {
      data = data.filter((item: any) => {
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

    if (Array.isArray(data) && data.length) return data;
  }

  return [];
}

async function fetchAllProductsForNav() {
  try {
    const res = await fetch(`${STRAPI}/api/products?populate=*`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

// ---------- page ----------
export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // products for this category
  const raw = await fetchProductsByCategorySlug(slug);
  const products = normalizeProducts(raw);

  // if nothing matched, 404
  if (!products.length) {
    notFound();
  }

  // build categories for Navigation from all products (so menu still works)
  const rawAll = await fetchAllProductsForNav();
  const categories = buildCategories(normalizeProducts(rawAll));

  // Find a friendly category title from first product
  const title = products[0]?.category?.name ?? slug;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navigation categories={categories} /> */}

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{title}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Shop items in the <span className="font-semibold">{title}</span> category.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((p) => {
            const imageUrl = p.images?.[0]?.url ?? "";
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 group"
              >
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

                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">(59 reviews)</span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">{p.name}</h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {p.description || "No description available."}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-green-600">
                      ₦{Number(p.price).toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {p.category?.name ?? "Uncategorized"}
                    </span>
                  </div>

                  {/* Add to cart – uses your CartContext via AddToCartButton */}
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
