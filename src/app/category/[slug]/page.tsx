// // // store-frontend/src/app/category/[slug]/page.tsx
// // // Category Page with dynamic products and categories from Strapi
// import Navigation from '@/components/Navigation';
// import ProductGrid from '@/components/ProductGrid';
// import Link from 'next/link';
// import { notFound } from 'next/navigation';

// // ✅ Fetch products by category (category is plain text in Strapi)
// async function getProductsByCategory(slug: string) {
//   try {
//     // Convert slug (health-booster) → "Health Booster"
//     const categoryName = slug.replace(/-/g, " ");

//     const res = await fetch(
//       `http://localhost:1337/api/products?filters[category][$eq]=${encodeURIComponent(categoryName)}&populate=*`,
//       { cache: "no-store" }
//     );

//     if (!res.ok) throw new Error("Failed to fetch products");
//     const data = await res.json();

//     return data.data.map((item: any) => ({
//       id: item.id,
//       ...item.attributes,
//     }));
//   } catch (error) {
//     console.error("Error fetching category products:", error);
//     return [];
//   }
// }

// // ✅ Fetch all categories dynamically from products
// async function getCategories() {
//   try {
//     const res = await fetch(
//       "http://localhost:1337/api/products?populate=*",
//       { cache: "no-store" }
//     );

//     if (!res.ok) throw new Error("Failed to fetch products");
//     const data = await res.json();

//     const categories = Array.from(
//       new Set(data.data.map((p: any) => p.attributes?.category).filter(Boolean))
//     ) as string[];

//     // Return both original name + slugified version
//     return categories.map((name) => ({
//       name,
//       slug: name.toLowerCase().replace(/\s+/g, "-"),
//     }));
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     return [];
//   }
// }

// // ✅ Category Page
// export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
//   // Await params before using it
//   const { slug } = await params;
//   const decodedSlug = decodeURIComponent(slug);

//   const [products, categories] = await Promise.all([
//     getProductsByCategory(decodedSlug),
//     getCategories(),
//   ]);

//   if (products.length === 0) {
//     notFound();
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navigation menu with dynamic categories */}
//       <Navigation categories={categories.map((c) => c.name)} />

//       <div className="container mx-auto px-4 py-8">
//         {/* Breadcrumbs */}
//         <nav className="text-sm text-gray-500 mb-6">
//           <Link href="/" className="hover:text-blue-600">Home</Link>
//           <span className="mx-2">/</span>
//           <Link href="/products" className="hover:text-blue-600">Products</Link>
//           <span className="mx-2">/</span>
//           <span className="text-gray-800 capitalize">{slug.replace(/-/g, " ")}</span>
//         </nav>

//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-800 mb-4">
//             {slug.replace(/-/g, " ")} Products ({products.length})
//           </h1>
//         </div>

//         {products.length === 0 ? (
//           <div className="text-center py-12">
//             <h2 className="text-xl font-semibold text-gray-700">No products found</h2>
//             <p className="text-gray-500 mt-2">
//               We couldn’t find any products in the <strong>{slug.replace(/-/g, " ")}</strong> category.
//             </p>
//             <Link
//               href="/products"
//               className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               Browse All Products
//             </Link>
//           </div>
//         ) : (
//           <ProductGrid products={products} />
//         )}
//       </div>
//     </div>
//   );
// }

// // store-frontend/src/app/category/[slug]/page.tsx
// // Category Page with dynamic products and categories from Strapi
// // store-frontend/src/app/category/[slug]/page.tsx


// store-frontend/src/app/category/[slug]/page.tsx
// Category Page with dynamic products and categories from Strapi
// src/app/category/[slug]/page.tsx
// src/app/category/[slug]/page.tsx
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
