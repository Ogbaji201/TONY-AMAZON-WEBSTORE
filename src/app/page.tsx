import { 
  Star, 
  ShoppingCart, 
  ArrowRight, 
  Shield, 
  Truck, 
  RotateCw, 
  Home as HomeIcon, 
  Phone, 
  Mail, 
  Heart 
} from "lucide-react";
import EmblaCarousel from "@/components/EmblaCarousel";
import Image from "next/image";
import Navigation from '@/components/Navigation';
import ProductGrid from '@/components/ProductGrid';


// Dummy slides for the carousel
const dummySlides = [
  {
    src: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=500",
    alt: "Pharmaceuticals 1",
    title: "Premium Medications",
    description: "Trusted pharmaceutical solutions for better health and wellness.",
    price: 49,
  },
  {
    src: "https://images.unsplash.com/photo-1550572017-edd951b55104?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=500",
    alt: "Pharmaceuticals 2",
    title: "Vitamin Supplements",
    description: "Boost your immunity with our high-quality vitamin supplements.",
    price: 29,
  },
  {
    src: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=500",
    alt: "Pharmaceuticals 3",
    title: "Prescription Medicines",
    description: "FDA-approved prescription medications for various health conditions.",
    price: 89,
  },
  {
    src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=500",
    alt: "Pharmaceuticals 4",
    title: "Pain Relief Tablets",
    description: "Fast-acting pain relief for headaches, muscle pain, and inflammation.",
    price: 19,
  },
  {
    src: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=500",
    alt: "Pharmaceuticals 5",
    title: "Cardiac Medications",
    description: "Specialized heart medications to support cardiovascular health.",
    price: 75,
  }
];

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

// Fetch all products
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

// Fetch featured products
async function getFeaturedProducts() {
  try {
    const res = await fetch(
      "http://localhost:1337/api/products?filters[featured][$eq]=true&populate=*",
      {
        cache: "no-store",
      }
    );
    if (!res.ok) throw new Error("Failed to fetch featured products");
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();
  const featuredProducts = await getFeaturedProducts();

  // Extract unique categories from products
  const categories = Array.from(
    new Set(products.map((product: Product) => product.category).filter(Boolean))
  ) as string[];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation categories={categories} />

      {/* Hero Carousel - Using dummy slides */}
      <section className="relative">
        <EmblaCarousel slides={dummySlides} />
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the best shopping experience with our premium services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast & Free Shipping</h3>
              <p className="text-gray-600">Free shipping on all orders over $50</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure payment processing</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition duration-300">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <RotateCw className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day money-back guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated collection of premium products
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product: Product) => {
              // Check if product has Image_Upload data
              if (!product?.Image_Upload || product.Image_Upload.length === 0) {
                console.warn(`Product ${product.id} has no Image_Upload data`);
                return null; // Skip products without images
              }

              // Get the first image
              const firstImage = product.Image_Upload[0];
              const imageUrl = firstImage ? `http://localhost:1337${firstImage.url}` : null;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 group"
                >
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
                      <span className="text-sm text-gray-600 ml-2">(42 reviews)</span>
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

                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 transform hover:scale-105 flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive deals and new product announcements
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-800 focus:outline-none"
            />
            <button className="bg-yellow-400 text-gray-900 font-semibold px-6 py-3 rounded-r-lg hover:bg-yellow-500 transition duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <a href="/" className="flex items-center space-x-2 mb-4">
                <Image
                  src="/Cherrybliss.jpeg"
                  alt="CherryBliss Logo"
                  width={40}
                  height={40}
                  className="rounded-lg object-contain"
                />
                <span className="text-2xl font-bold">CherryBliss</span>
              </a>
              <p className="text-gray-400 mb-4">Premium pharmaceutical products for your health and wellness</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">Tiktok</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition duration-300">Home</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Products</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Categories</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">About Us</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition duration-300">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Returns</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Contact Info</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center">
                  <HomeIcon className="w-5 h-5 mr-3" />
                  <span>5 Anthony Ololade Street, Lagos, Nigeria</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3" />
                  <span>+234 (706) 668-4785</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3" />
                  <span>info@CherryBliss.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CherryBliss. All rights reserved. Designed from the ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  );
}


