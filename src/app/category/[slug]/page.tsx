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
