'use client';

import Image from "next/image";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";

type RawProduct = any; // Strapi raw item (v4/v5)

function pick<T>(v: T | undefined | null, f: T): T { return (v ?? f); }

function getAttr(p: RawProduct) {
  // v4: p.attributes, v5: fields at top-level
  return p?.attributes ? p.attributes : p || {};
}

function getImageUrl(p: RawProduct): string | null {
  const a = getAttr(p);
  const img = a.Image_Upload;
  let images: any[] = [];

  if (Array.isArray(img)) images = img;
  else if (img?.data) images = Array.isArray(img.data) ? img.data : [img.data];

  const url =
    images?.[0]?.attributes?.url ??
    images?.[0]?.url ??
    null;

  const base = (process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337").replace(/\/$/, "");
  return url ? (url.startsWith("http") ? url : `${base}${url}`) : null;
}

function getCategoryName(p: RawProduct): string {
  const a = getAttr(p);
  const cat =
    a?.category?.data?.attributes ??
    a?.category?.attributes ??
    a?.category;

  const name = cat?.Name ?? cat?.name ?? cat?.title ?? "Uncategorized";
  return name;
}

function getPriceNumber(p: RawProduct): number {
  const a = getAttr(p);
  const raw = a?.Price;
  if (typeof raw === "number") return raw;
  if (typeof raw === "string") {
    const n = parseFloat(raw.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

export default function ProductGrid({ products }: { products: RawProduct[] }) {
  const { addToCart } = useCart();

  const cartBtnClass =
    "group inline-flex items-center justify-center w-full rounded-xl " +
    "bg-blue-600 text-white py-3 font-semibold shadow-sm " +
    "hover:bg-blue-700 active:scale-[0.99] " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 " +
    "transition";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((p) => {
        const a = getAttr(p);
        const id = pick(p?.id ?? a?.id, Math.random());
        const name = pick(a?.Panadol, "Unnamed product");
        const img = getImageUrl(p);
        const price = getPriceNumber(p);
        const categoryName = getCategoryName(p);
        const featured = !!a?.featured;

        return (
          <div key={id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition group">
            {/* Image */}
            <div className="relative h-64 w-full overflow-hidden">
              {img ? (
                // If you're using next/image with remotePatterns configured:
                <Image
                  src={img}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain group-hover:scale-105 transition"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
              {featured && (
                <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Featured</span>
              )}
              <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow hover:text-red-500 transition">
                <Heart className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-sm text-gray-600 ml-2">(online reviews)</span>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">{name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{a?.Product_description ?? "No description available."}</p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-green-600">₦{price.toLocaleString()}</span>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{categoryName}</span>
              </div>

              <div className="space-y-3">
                {a?.amazon_url && (
                  <a
                    href={a.amazon_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-yellow-400 hover:bg-yellow-500 text-center text-gray-900 font-semibold py-3 rounded-lg transition"
                  >
                    Buy on Amazon
                  </a>
                )}

                {/* Add to cart – uses CartContext */}
                <button
                  onClick={() => addToCart({ id, name, price, image: img })}
                  className={cartBtnClass}
                >
                  <ShoppingCart className="w-4 h-4 mr-2 transition-transform group-hover:-translate-y-0.5" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
