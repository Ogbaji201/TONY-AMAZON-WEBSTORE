// import Navigation from '@/components/Navigation';
// import ProductGrid from '@/components/ProductGrid';
// import Link from 'next/link';

// // Fetch products for a specific category
// async function getProductsByCategory(category: string) {
//   try {
//     const res = await fetch(
//       `http://localhost:1337/api/products?filters[category][$eq]=${encodeURIComponent(category)}&populate=*`, 
//       { cache: "no-store" }
//     );

//     if (!res.ok) throw new Error("Failed to fetch products");
//     const data = await res.json();

//     // Flatten Strapi response
//     return data.data.map((item: any) => ({
//       id: item.id,
//       ...item.attributes,
//     }));
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return [];
//   }
// }

// // Fetch all categories
// async function getCategories() {
//   try {
//     const res = await fetch(
//       "http://localhost:1337/api/products?populate=*", 
//       { cache: "no-store" }
//     );

//     if (!res.ok) throw new Error("Failed to fetch products");
//     const data = await res.json();
//     const products = data.data;

//     // Extract unique categories
//     const categories = Array.from(
//       new Set(products.map((p: any) => p.attributes?.category).filter(Boolean))
//     ) as string[];

//     return categories;
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     return [];
//   }
// }

// export default async function CategoryPage({ 
//   params 
// }: { 
//   params: { category: string } 
// }) {
//   const category = decodeURIComponent(params.category);
//   const products = await getProductsByCategory(category);
//   const categories = await getCategories();

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
//           <span className="text-gray-800 capitalize">{category}</span>
//         </nav>

//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-800 mb-4">
//             {category} Products ({products.length})
//           </h1>
//         </div>

//         {products.length === 0 ? (
//           <div className="text-center py-12">
//             <h2 className="text-xl font-semibold text-gray-700">No products found</h2>
//             <p className="text-gray-500 mt-2">We couldn't find any products in this category.</p>
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

// src/app/category/[slug]/page.tsx

// src/app/category/[slug]/page.tsx
import Navigation from '@/components/Navigation';
import ProductGrid from '@/components/ProductGrid';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// ✅ Fetch products by category (category is plain text in Strapi)
async function getProductsByCategory(slug: string) {
  try {
    // Convert slug (health-booster) → "Health Booster"
    const categoryName = slug.replace(/-/g, " ");

    const res = await fetch(
      `http://localhost:1337/api/products?filters[category][$eq]=${encodeURIComponent(categoryName)}&populate=*`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();

    return data.data.map((item: any) => ({
      id: item.id,
      ...item.attributes,
    }));
  } catch (error) {
    console.error("Error fetching category products:", error);
    return [];
  }
}

// ✅ Fetch all categories dynamically from products
async function getCategories() {
  try {
    const res = await fetch(
      "http://localhost:1337/api/products?populate=*",
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();

    const categories = Array.from(
      new Set(data.data.map((p: any) => p.attributes?.category).filter(Boolean))
    ) as string[];

    // Return both original name + slugified version
    return categories.map((name) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// ✅ Category Page
export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);

  const [products, categories] = await Promise.all([
    getProductsByCategory(slug),
    getCategories(),
  ]);

  if (products.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation menu with dynamic categories */}
      <Navigation categories={categories.map((c) => c.name)} />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-blue-600">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 capitalize">{slug.replace(/-/g, " ")}</span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {slug.replace(/-/g, " ")} Products ({products.length})
          </h1>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700">No products found</h2>
            <p className="text-gray-500 mt-2">
              We couldn’t find any products in the <strong>{slug.replace(/-/g, " ")}</strong> category.
            </p>
            <Link
              href="/products"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}
