// src/app/products/page.tsx
import { ShoppingBag } from 'lucide-react';
import Navigation from '@/components/Navigation';
import ProductGrid from '@/components/ProductGrid';

async function getProducts() {
  try {
    const res = await fetch("http://localhost:1337/api/products?populate=*", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();
  const categories = Array.from(
    new Set(
      products.map((p: any) => p.attributes?.category?.name || p.attributes?.category)
        .filter(Boolean)
    )
  ) as string[];


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

        <ProductGrid products={products} />
      </div>
    </div>
  );
}

// ✅ Fetch all products with category filter
async function getProductsByCategory(category: string) {
  try {
    const res = await fetch(
      `http://localhost:1337/api/products?filters[category][name][$eq]=${category}&populate=*`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to fetch products by category");
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

// ✅ Fetch all categories for navigation
async function getCategories() {
  try {
    const res = await fetch(
      "http://localhost:1337/api/products?populate=category",
      { cache: "no-store" }
    );  
    if (!res.ok) throw new Error("Failed to fetch categories");
    const data = await res.json();
    const categories = Array.from(
      new Set(
        data.data.map((p: any) =>
          p.attributes?.category?.name || p.attributes?.category
        ).filter(Boolean)
      )
    ) as string[];
    return categories;
  }
  catch (error) {
    console.error("Error fetching categories:", error);
    return [];

  }
} 
