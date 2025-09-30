
import Navigation from "@/components/Navigation";
import ProductGrid from "@/components/ProductGrid";
import Link from "next/link";
import { notFound } from "next/navigation";

const STRAPI = (process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337").replace(/\/$/, "");

// Fetch products by category Slug (Strapi v5 uses capitalized "Slug")
async function getProductsByCategory(slug: string) {
  const url =
    `${STRAPI}/api/products` +
    `?filters[category][Slug][$eq]=${encodeURIComponent(slug)}` + // ✅ capital S
    `&populate=*`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const body = await res.text().catch(() => "(no body)");
      console.error(
        "CATEGORY PRODUCTS ERROR ->",
        res.status,
        res.statusText,
        "\nURL:", url,
        "\nBODY:", body
      );
      return [];
    }
    const json = await res.json();
    return json.data as any[];
  } catch (err) {
    console.error("Error fetching category products:", err);
    return [];
  }
}

// Fetch categories (for the nav)
function slugify(str = "") {
  return str.toString().toLowerCase().trim()
    .replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");
}

async function getCategories() {
  const url = `${STRAPI}/api/categories?pagination[pageSize]=100`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch categories");
    const json = await res.json();
    return (json.data || []).map((c: any) => {
      const a = c.attributes ? c.attributes : c;
      const name = a.Name ?? a.name ?? a.title ?? "";
      const slug = a.Slug ?? a.slug ?? slugify(name);
      return { name, slug };
    });
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
}

export default async function CategoryPage({
  params,
}: {
  // ✅ Next.js 15: params is async — await it before use
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const [products, categories] = await Promise.all([
    getProductsByCategory(decodedSlug),
    getCategories(),
  ]);

  if (!products || products.length === 0) {
    // You can remove this if you prefer showing an empty state instead
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation categories={categories} />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-blue-600">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 capitalize">
            {decodedSlug.replace(/-/g, " ")}
          </span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {decodedSlug.replace(/-/g, " ")} Products ({products.length})
          </h1>
        </div>

        {/* Pass raw Strapi items (same shape as /products page) */}
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
