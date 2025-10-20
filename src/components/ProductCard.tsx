'use client';

import { Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from '@/context/CartContext';

interface Product {
  id: number;
  Panadol: string;
  Product_description: string | null; 
  Price: string;
  Image_Upload: any[]; 
  amazon_url: string | null;
  category: string | null;
  featured: boolean | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  // Check if product has Image_Upload data
  if (!product?.Image_Upload || product.Image_Upload.length === 0) {
    console.warn(`Product ${product.id} has no Image_Upload data`);
    return null; // Skip products without images
  }

  // Get the first image
  const firstImage = product.Image_Upload[0];
  const imageUrl = firstImage ? `http://localhost:1337${firstImage.url}` : null;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.Panadol,
      price: parseFloat(product.Price),
      image: imageUrl || '',
      quantity: 1
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 group">
      <div className="relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.Panadol}
            className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          // Fallback placeholder to maintain consistent DOM structure
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image</span>
          </div>
        )}
        {product.featured && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Featured
          </div>
        )}
        <div className="absolute top-4 right-4">
          <button className="bg-white rounded-full p-2 shadow-md hover:bg-red-500 hover:text-white transition duration-300">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">(online reviews)</span>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
          {product.Panadol}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.Product_description || 'No description available.'}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-green-600">
            ₦{parseInt(product.Price)?.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category || 'Uncategorized'}
          </span>
        </div>

        <div className="space-y-2">
          <a
            href={product.amazon_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-yellow-400 hover:bg-yellow-500 text-center text-gray-900 font-semibold py-3 rounded-lg transition duration-300 transform hover:scale-105"
          >
            Buy on Amazon
          </a>

          <button 
            onClick={handleAddToCart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}