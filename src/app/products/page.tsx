import { ShoppingBag, Star, Heart } from "lucide-react";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import ReadMore from "@/components/ReadMore";
import SafeImg from "@/components/SafeImg";

const STRAPI = (process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1338").replace(/\/$/, "");

function slugify(str = "") {
  return str.toString().toLowerCase().trim()
    .replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");
}

function normalizeStrapiUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  return `${STRAPI}${url.startsWith("/") ? url : `/${url}`}`;
}

function blocksToText(value: any): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value))
    return value.map((node) => blocksToText(node)).filter(Boolean).join("\n").trim();
  if (typeof value === "object") {
    if (Array.isArray(value.children)) return blocksToText(value.children);
    if (typeof value.text === "string") return value.text;
  }
  return "";
}

function pickMediaUrl(media: any): string {
  const formats = media?.formats;
  return formats?.medium?.url || formats?.small?.url || formats?.thumbnail?.url || media?.url || "";
}

function extractImages(field: any): { url: string }[] {
  if (!field) return [];
  if (Array.isArray(field)) {
    return field.map((m) => {
      const attrs = m?.attributes ?? m;
      const u = pickMediaUrl(attrs);
      return u ? { url: normalizeStrapiUrl(u) } : null;
    }).filter(Boolean) as { url: string }[];
  }
  if (field?.data) {
    const data = Array.isArray(field.data) ? field.data : [field.data];
    return data.map((m: any) => {
      const attrs = m?.attributes ?? m;
      const u = pickMediaUrl(attrs);
      return u ? { url: normalizeStrapiUrl(u) } : null;
    }).filter(Boolean) as { url: string }[];
  }
  const attrs = field?.attributes ?? field;
  const u = pickMediaUrl(attrs);
  return u ? [{ url: normalizeStrapiUrl(u) }] : [];
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
    const name = a.name ?? a.title ?? a.Name ?? a.Title ?? "Unnamed Product";
    const descriptionRaw = a.description ?? a.Product_description ?? a.Description ?? a.product_description ?? null;
    const description = blocksToText(descriptionRaw) || null;
    const rawPrice = a.price ?? a.Price ?? 0;
    const priceNum = typeof rawPrice === "string" ? parseFloat(rawPrice) : Number(rawPrice || 0);
    const images = extractImages(a.image ?? a.images ?? a.Image_Upload ?? null);
    const categoryData = a.category?.data ?? a.category ?? null;
    let category = null;
    if (categoryData) {
      const cat = Array.isArray(categoryData) ? categoryData[0] : categoryData;
      const catAttrs = cat?.attributes ? cat.attributes : cat || {};
      const catName = catAttrs.name ?? catAttrs.Name ?? catAttrs.title ?? "";
      category = { name: catName, slug: catAttrs.slug ?? catAttrs.Slug ?? slugify(catName) };
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

const cartBtnClass =
  "group inline-flex items-center justify-center w-full rounded-xl " +
  "bg-blue-600 text-white py-3 font-semibold shadow-sm " +
  "hover:bg-blue-700 active:scale-[0.99] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 " +
  "transition";

async function fetchProductsRaw() {
  const url = `${STRAPI}/api/products?populate=*&pagination[pageSize]=100`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return (json?.data ?? []) as any[];
  } catch {
    return [];
  }
}

export default async function ProductsPage() {
  const raw = await fetchProductsRaw();
  const products = normalizeProducts(raw);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f9fafb" }}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold mb-4 flex items-center justify-center"
            style={{ color: "#1f2937" }}
          >
            <ShoppingBag className="w-8 h-8 mr-3" />
            All Products
          </h1>
          <p style={{ color: "#4b5563" }} className="max-w-2xl mx-auto">
            Browse our complete collection of premium products
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-lg mb-4" style={{ color: "#6b7280" }}>No products found</div>
            <div className="text-sm" style={{ color: "#9ca3af" }}>Check your Strapi connection and product data</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((p) => {
              const imageUrl = p.images?.[0]?.url ?? "";

              return (
                <div
                  key={p.id}
                  className="rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 group flex flex-col"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  {/* Clickable image → product detail page */}
                  <Link href={`/products/${p.id}`} className="relative overflow-hidden block">
                    {imageUrl ? (
                      <div className="relative w-full h-64">
                        <SafeImg
                          src={imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-full h-64 flex items-center justify-center"
                        style={{ backgroundColor: "#e5e7eb", color: "#6b7280" }}
                      >
                        No image available
                      </div>
                    )}
                    {p.featured && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </div>
                    )}
                  </Link>

                  {/* Wishlist button — outside Link to avoid nesting */}
                  <div className="relative -mt-10 mr-4 flex justify-end z-10">
                    <button
                      className="bg-white rounded-full p-2 shadow-md hover:bg-red-500 hover:text-white transition duration-300"
                      aria-label="Add to favourites"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm ml-2" style={{ color: "#4b5563" }}>(online reviews)</span>
                    </div>

                    {/* Product name → detail page */}
                    <Link href={`/products/${p.id}`}>
                      <h3
                        className="text-xl font-semibold mb-2 line-clamp-2 min-h-[56px] hover:text-blue-600 transition"
                        style={{ color: "#1f2937" }}
                      >
                        {p.name}
                      </h3>
                    </Link>

                    {/* ✅ ReadMore replaces static clipped paragraph */}
                    <div className="mb-3 min-h-[88px]">
                      <ReadMore text={p.description || "No description available."} clamp={4} />
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold" style={{ color: "#16a34a" }}>
                        ₦{Number(p.price).toLocaleString()}
                      </span>
                      <span
                        className="text-sm px-2 py-1 rounded"
                        style={{ color: "#6b7280", backgroundColor: "#f3f4f6" }}
                      >
                        {p.category?.name ?? "Uncategorized"}
                      </span>
                    </div>

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
        )}
      </div>
    </div>
  );
}
