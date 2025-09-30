
import {
  Star, ShoppingCart, Home as HomeIcon, Phone, Mail, Heart, Truck, Shield, RotateCw,
} from "lucide-react";
import SimpleCarousel, { dummySlides } from "@/components/SimpleCarousel";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Link from "next/link";

// ---------- ENV / HELPERS ---------------------------------------------------
const RAW_BASE = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const STRAPI = RAW_BASE.replace(/\/$/, "");

type Maybe<T> = T | null | undefined;

interface NormalizedProduct {
  id: number;
  Panadol: string;
  Product_description?: string | null;
  Price?: number | string;
  Image_Upload: { url: string }[];
  amazon_url?: string | null;
  category?: { name: string; slug: string } | null;
  featured?: boolean | null;
}

function prefix(url?: string) {
  if (!url) return "";
  return url.startsWith("http") ? url : `${STRAPI}${url}`;
}

function slugify(str = "") {
  return str.toString().toLowerCase().trim()
    .replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");
}

// ---------- NORMALIZER (v4 + v5 compatible) ---------------------------------
function normalize(items: any[]): NormalizedProduct[] {
  return (items || []).map((item: any) => {
    // Strapi v5 often returns fields at the top level; v4 used item.attributes
    const a = item?.attributes ? item.attributes : item || {};

    // ---- media: array or { data: [] }
    const imgField = a.Image_Upload;
    let imagesRaw: any[] = [];
    if (Array.isArray(imgField)) imagesRaw = imgField;
    else if (imgField?.data) imagesRaw = Array.isArray(imgField.data) ? imgField.data : [imgField.data];

    const images = imagesRaw
      .map((m: any) => m?.attributes?.url ?? m?.url)
      .filter(Boolean)
      .map((u: string) => ({ url: prefix(u) }));

    // ---- category: object | { attributes } | { data: { attributes } }
    let catAttrs: any = null;
    if (a.category?.data?.attributes) catAttrs = a.category.data.attributes;
    else if (a.category?.attributes) catAttrs = a.category.attributes;
    else if (a.category) catAttrs = a.category;

    const category = catAttrs
      ? {
          name: catAttrs.Name ?? catAttrs.name ?? catAttrs.title ?? "",
          slug:
            catAttrs.Slug ??
            catAttrs.slug ??
            slugify(catAttrs.Name ?? catAttrs.name ?? catAttrs.title ?? ""),
        }
      : null;

    return {
      id: item.id ?? a.id,
      Panadol: a.Panadol,
      Product_description: a.Product_description,
      Price: a.Price,
      Image_Upload: images,
      amazon_url: a.amazon_url,
      featured: a.featured,
      category,
    } as NormalizedProduct;
  });
}

// ---------- FETCHERS (use populate=*) ---------------------------------------
async function getProducts(): Promise<NormalizedProduct[]> {
  const url = `${STRAPI}/api/products?populate=*&pagination[pageSize]=100`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const body = await res.text().catch(() => "(no body)");
      console.error("PRODUCTS ERROR ->", res.status, res.statusText, "\nURL:", url, "\nBODY:", body);
      return [];
    }
    const json = await res.json();
    return normalize(json.data);
  } catch (err) {
    console.error("getProducts() exception:", err);
    return [];
  }
}

async function getFeaturedProducts(): Promise<NormalizedProduct[]> {
  const url = `${STRAPI}/api/products?filters[featured][$eq]=true&populate=*&pagination[pageSize]=100`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const body = await res.text().catch(() => "(no body)");
      console.error("FEATURED PRODUCTS ERROR ->", res.status, res.statusText, "\nURL:", url, "\nBODY:", body);
      return [];
    }
    const json = await res.json();
    return normalize(json.data);
  } catch (err) {
    console.error("getFeaturedProducts() exception:", err);
    return [];
  }
}

async function getCategories(): Promise<{ name: string; slug: string }[]> {
  const url = `${STRAPI}/api/categories?pagination[pageSize]=100`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const body = await res.text().catch(() => "(no body)");
      console.error("CATEGORIES ERROR ->", res.status, res.statusText, "\nURL:", url, "\nBODY:", body);
      return [];
    }
    const json = await res.json();
    return (json.data || []).map((c: any) => {
      const a = c.attributes ? c.attributes : c;
      const name = a.Name ?? a.name ?? a.title ?? "";
      const slug = a.Slug ?? a.slug ?? slugify(name);
      return { name, slug };
    }).filter(Boolean);
  } catch (err) {
    console.error("getCategories() exception:", err);
    return [];
  }
}

// ---------- PAGE ------------------------------------------------------------
export default async function Home() {
  const [featuredProducts, products, categories] = await Promise.all([
    getFeaturedProducts(),
    getProducts(),
    getCategories(),
  ]);

  const renderGrid = (items: NormalizedProduct[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {items.map((product) => {
        const imageUrl = product.Image_Upload?.[0]?.url ?? null;
        const categoryName = product.category?.name ?? "Uncategorized";

        return (
          <div key={product.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 group">
            <div className="relative overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt={product.Panadol} className="w-full h-64 object-cover group-hover:scale-105 transition duration-300" />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
              {product.featured && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Featured</div>
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
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-sm text-gray-600 ml-2">(59 reviews)</span>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">{product.Panadol}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.Product_description || "No description available."}</p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-green-600">
                  ₦{Number(typeof product.Price === "string" ? parseInt(product.Price, 10) : product.Price || 0).toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{categoryName}</span>
              </div>

              <div className="space-y-2">
                <a href={product.amazon_url || "#"} target="_blank" rel="noopener noreferrer" className="block w-full bg-yellow-400 hover:bg-yellow-500 text-center text-gray-900 font-semibold py-3 rounded-lg transition duration-300 transform hover:scale-105">
                  Buy on Amazon
                </a>
                <Link href="/cart" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 transform hover:scale-105 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation categories={categories} />

      {/* Hero / Carousel */}
      <section className="relative">
        <SimpleCarousel slides={dummySlides} />
      </section>

      {/* Featured Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated collection of premium products
            </p>
          </div>
          {renderGrid((featuredProducts.length ? featuredProducts : products).slice(0, 8))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive deals and new product announcements
          </p>
          <div className="max-w-md mx-auto flex">
            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-l-lg text-gray-800 focus:outline-none" />
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
                <Image src="/Cherrybliss.jpeg" alt="CherryBliss Logo" width={40} height={40} className="rounded-lg object-contain" />
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
                <div className="flex items-center"><HomeIcon className="w-5 h-5 mr-3" /><span>5 Anthony Ololade Street, Lagos, Nigeria</span></div>
                <div className="flex items-center"><Phone className="w-5 h-5 mr-3" /><span>+234 (706) 668-4785</span></div>
                <div className="flex items-center"><Mail className="w-5 h-5 mr-3" /><span>info@CherryBliss.com</span></div>
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
