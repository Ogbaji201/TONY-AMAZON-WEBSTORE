import { ShoppingBag, ArrowLeft, Star, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import { notFound } from "next/navigation";

const STRAPI = (process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1338").replace(/\/$/, "");

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
    return value.map((n) => blocksToText(n)).filter(Boolean).join("\n").trim();
  if (typeof value === "object") {
    if (Array.isArray(value.children)) return blocksToText(value.children);
    if (typeof value.text === "string") return value.text;
  }
  return "";
}

function pickMediaUrl(media: any): string {
  const f = media?.formats;
  return f?.large?.url || f?.medium?.url || f?.small?.url || f?.thumbnail?.url || media?.url || "";
}

function extractImages(field: any): string[] {
  if (!field) return [];
  const toUrl = (m: any) => {
    const attrs = m?.attributes ?? m;
    const u = pickMediaUrl(attrs);
    return u ? normalizeStrapiUrl(u) : null;
  };
  if (Array.isArray(field)) return field.map(toUrl).filter(Boolean) as string[];
  if (field?.data) {
    const data = Array.isArray(field.data) ? field.data : [field.data];
    return data.map(toUrl).filter(Boolean) as string[];
  }
  const u = toUrl(field);
  return u ? [u] : [];
}

async function getProduct(id: string) {
  try {
    const res = await fetch(`${STRAPI}/api/products/${id}?populate=*`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    const item = json?.data;
    if (!item) return null;

    const a = item?.attributes ? item.attributes : item;
    const name = a.name ?? a.title ?? a.Name ?? "Unnamed Product";
    const descriptionRaw = a.description ?? a.Product_description ?? a.Description ?? null;
    const description = blocksToText(descriptionRaw) || null;
    const rawPrice = a.price ?? a.Price ?? 0;
    const price = typeof rawPrice === "string" ? parseFloat(rawPrice) : Number(rawPrice || 0);
    const images = extractImages(a.image ?? a.images ?? a.Image_Upload ?? null);

    const categoryData = a.category?.data ?? a.category ?? null;
    let category = null;
    if (categoryData) {
      const cat = Array.isArray(categoryData) ? categoryData[0] : categoryData;
      const ca = cat?.attributes ?? cat ?? {};
      category = { name: ca.name ?? ca.Name ?? "" };
    }

    const amazonUrl = a.amazon_url ?? a.amazonUrl ?? null;

    return {
      id: Number(item.id ?? a.id),
      name: String(name),
      description,
      price: Number.isFinite(price) ? price : 0,
      images,
      category,
      amazon_url:
        amazonUrl && /^https?:\/\//i.test(amazonUrl)
          ? amazonUrl
          : amazonUrl
          ? `https://${amazonUrl}`
          : null,
      featured: Boolean(a.featured ?? false),
    };
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const cartBtnClass =
    "inline-flex items-center justify-center rounded-xl bg-blue-600 text-white px-8 py-4 text-lg font-semibold shadow-sm hover:bg-blue-700 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 transition w-full md:w-auto";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f9fafb" }}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link
          href="/products"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="p-6 flex flex-col gap-4" style={{ backgroundColor: "#f3f4f6" }}>
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-sm">
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-4"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ color: "#9ca3af" }}>
                    No image available
                  </div>
                )}
                {product.featured && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3 flex-wrap">
                  {product.images.slice(1).map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 bg-white shadow-sm" style={{ borderColor: "#e5e7eb" }}>
                      <Image src={url} alt={`${product.name} image ${i + 2}`} fill sizes="80px" className="object-contain p-1" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-8 flex flex-col justify-between bg-white">
              <div>
                {product.category?.name && (
                  <div className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full mb-4" style={{ backgroundColor: "#eff6ff", color: "#1d4ed8" }}>
                    <Tag className="w-3 h-3" />
                    {product.category.name}
                  </div>
                )}
                <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-tight" style={{ color: "#111827" }}>
                  {product.name}
                </h1>
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm" style={{ color: "#6b7280" }}>Customer reviews</span>
                </div>
                <div className="text-4xl font-bold mb-6" style={{ color: "#16a34a" }}>
                  ₦{product.price.toLocaleString()}
                </div>
                {product.description && (
                  <div className="leading-relaxed mb-8 whitespace-pre-line text-sm md:text-base" style={{ color: "#4b5563" }}>
                    {product.description}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3">
                {product.amazon_url && (
                  <a href={product.amazon_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full md:w-auto font-semibold px-8 py-4 rounded-xl text-lg transition duration-300 transform hover:scale-105 shadow-sm"
                    style={{ backgroundColor: "#facc15", color: "#111827" }}>
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Buy on Amazon
                  </a>
                )}
                <AddToCartButton
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.images[0] ?? ""}
                  className={cartBtnClass}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
