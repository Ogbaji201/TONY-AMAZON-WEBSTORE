
import { ShoppingBag } from "lucide-react";
import Navigation from "@/components/Navigation";
import ProductGrid from "@/components/ProductGrid";

const STRAPI = (process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337").replace(/\/$/, "");

function slugify(str = "") {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

// Pull all products (v5-safe)
async function getProducts() {
  try {
    const res = await fetch(`${STRAPI}/api/products?populate=*`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();
    // Return raw Strapi items so <ProductGrid /> keeps working as-is
    return data.data as any[];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Build { name, slug }[] from the products' category field (v4/v5 compatible)
function getUniqueCategoriesFromProducts(products: any[]): { name: string; slug: string }[] {
  const map = new Map<string, { name: string; slug: string }>();

  for (const p of products) {
    // v4: p.attributes.category?.data?.attributes
    // v5: p.category (flattened) or p.category.attributes / p.category.data.attributes
    const cat =
      p?.attributes?.category?.data?.attributes ??
      p?.attributes?.category?.attributes ??
      p?.attributes?.category ??
      p?.category?.data?.attributes ??
      p?.category?.attributes ??
      p?.category;

    if (!cat) continue;

    const name = cat.Name ?? cat.name ?? cat.title ?? "";
    const slug = cat.Slug ?? cat.slug ?? slugify(name);

    if (!slug) continue;
    if (!map.has(slug)) map.set(slug, { name, slug });
  }

  return [...map.values()];
}

export default async function ProductsPage() {
  const products = await getProducts();
  const categories = getUniqueCategoriesFromProducts(products);

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

        {/* Keep using raw Strapi items; ProductGrid will render them */}
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
