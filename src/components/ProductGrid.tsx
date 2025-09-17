"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Product {
  id: number;
  Panadol: string;
  Product_description: string | null;
  Price: string;
  Image_Upload: { url: string }[];
  amazon_url: string | null;
  category: string | null;
  featured: boolean | null;
  showAll?: boolean | null;
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    const firstImage = product.Image_Upload?.[0];
    const imageUrl = firstImage
      ? `http://localhost:1337${firstImage.url}`
      : "/placeholder-image.jpg";

    addToCart({
      id: product.id, // ✅ keep as number
      name: product.Panadol,
      price: parseFloat(product.Price) || 0, // ✅ safer than parseInt
      image: imageUrl,
      quantity: 1,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => {
        const firstImage = product.Image_Upload?.[0];
        const imageUrl = firstImage
          ? `http://localhost:1337${firstImage.url}`
          : null;

        return (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 group"
          >
            <div className="relative overflow-hidden">
              {imageUrl ? (
                <>
                  {/* Desktop / Next.js Image */}
                  <div className="relative w-full h-64 hidden md:block">
                    <Image
                      src={imageUrl}
                      alt={product.Panadol}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLElement;
                        if (target) target.style.display = "none";
                      }}
                    />
                  </div>

                  {/* Mobile fallback */}
                  <img
                    src={imageUrl}
                    alt={product.Panadol}
                    className="w-full h-64 object-cover md:hidden"
                  />
                </>
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
                {product.Panadol}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.Product_description || "No description available."}
              </p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-green-600">
                  ₦{parseFloat(product.Price)?.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {product.category || "Uncategorized"}
                </span>
              </div>

              <div className="space-y-2">
                {/* Amazon Button */}
                {product.amazon_url && (
                  <a
                    href={product.amazon_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-yellow-400 hover:bg-yellow-500 text-center text-gray-900 font-semibold py-3 rounded-lg transition duration-300 transform hover:scale-105"
                  >
                    Buy on Amazon
                  </a>
                )}

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
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
