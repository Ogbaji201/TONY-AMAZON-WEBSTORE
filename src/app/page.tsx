
import HomeClient from "./home/HomeClient";

export const dynamic = "force-dynamic";

// ---------- ENV -------------------------------------------------------------
const STRAPI = (process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1338").replace(
  /\/$/,
  ""
);

// ---------- Helpers ---------------------------------------------------------
function normalizeStrapiUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  return `${STRAPI}${url.startsWith("/") ? url : `/${url}`}`;
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

function external(url?: string | null) {
  if (!url) return null;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
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

// ---------- Types -----------------------------------------------------------
export type Category = { name: string; slug: string };

export type NormalizedProduct = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  images: { url: string }[];
  amazon_url?: string | null;
  category?: Category | null;
  featured?: boolean | null;
};

// ---------- Normalizers -----------------------------------------------------
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
    let category: Category | null = null;

    if (categoryData) {
      const cat = Array.isArray(categoryData) ? categoryData[0] : categoryData;
      const catAttrs = cat?.attributes ? cat.attributes : cat || {};
      const catName = catAttrs.name ?? catAttrs.Name ?? catAttrs.title ?? "";
      category = {
        name: String(catName || ""),
        slug: String(catAttrs.slug ?? catAttrs.Slug ?? slugify(catName)),
      };
    }

    return {
      id: Number(item.id ?? a.id),
      name: String(name),
      description,
      price: Number.isFinite(priceNum) ? priceNum : 0,
      images,
      amazon_url: external(a.amazon_url ?? a.amazonUrl ?? null),
      featured: Boolean(a.featured ?? false),
      category,
    };
  });
}

function normalizeCategories(items: any[]): Category[] {
  return (items || [])
    .map((item: any) => {
      const a = item?.attributes ? item.attributes : item || {};
      const name = a.name ?? a.Name ?? a.title ?? "";
      const slug = a.slug ?? a.Slug ?? slugify(name);
      if (!name || !slug) return null;
      return { name: String(name), slug: String(slug) };
    })
    .filter(Boolean) as Category[];
}

// ---------- Fetchers --------------------------------------------------------
async function getJson(url: string) {
  const res = await fetch(url, { next: { revalidate: 0 } }); // equivalent to no-store
  if (!res.ok) return null;
  return res.json();
}

async function getProducts(): Promise<NormalizedProduct[]> {
  const url = `${STRAPI}/api/products?populate=*&pagination[pageSize]=100`;
  try {
    const json = await getJson(url);
    return normalizeProducts(json?.data ?? []);
  } catch {
    return [];
  }
}

async function getFeaturedProducts(): Promise<NormalizedProduct[]> {
  const url = `${STRAPI}/api/products?filters[featured][$eq]=true&populate=*&pagination[pageSize]=100`;
  try {
    const json = await getJson(url);
    return normalizeProducts(json?.data ?? []);
  } catch {
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  const url = `${STRAPI}/api/categories?populate=*&pagination[pageSize]=100`;
  try {
    const json = await getJson(url);
    return normalizeCategories(json?.data ?? []);
  } catch {
    return [];
  }
}

// ---------- Page ------------------------------------------------------------
export default async function Home() {
  const [featuredProducts, products, categories] = await Promise.all([
    getFeaturedProducts(),
    getProducts(),
    getCategories(),
  ]);

  // ✅ Ensure props are JSON-serializable (no functions, no class instances)
  return (
    <HomeClient
      featuredProducts={featuredProducts}
      products={products}
      categories={categories}
    />
  );
}
