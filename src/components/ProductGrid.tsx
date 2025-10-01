
// 'use client';

// import Link from 'next/link';
// import { Heart, ShoppingCart, Star } from 'lucide-react';

// const RAW_BASE = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';
// const STRAPI = RAW_BASE.replace(/\/$/, '');

// type AnyRec = Record<string, any>;

// function prefix(url?: string | null) {
//   if (!url) return '';
//   return url.startsWith('http') ? url : `${STRAPI}${url}`;
// }

// function slugify(str = '') {
//   return str
//     .toString()
//     .toLowerCase()
//     .trim()
//     .replace(/\s+/g, '-')
//     .replace(/[^\w\-]+/g, '')
//     .replace(/\-\-+/g, '-');
// }

// /** Handle both Strapi v4 and v5 shapes */
// function attrs(item: AnyRec): AnyRec {
//   return item?.attributes ? item.attributes : item ?? {};
// }

// /** Get first image url from Image_Upload (array) OR Image_Upload.data (relation) */
// function firstImageUrl(a: AnyRec): string | null {
//   const field = a.Image_Upload;

//   // v5: array of files
//   if (Array.isArray(field) && field.length > 0) {
//     const u = field[0]?.attributes?.url ?? field[0]?.url;
//     return u ? prefix(u) : null;
//   }

//   // v4: { data: [...] }
//   if (field?.data) {
//     const arr = Array.isArray(field.data) ? field.data : [field.data];
//     const u = arr[0]?.attributes?.url ?? arr[0]?.url;
//     return u ? prefix(u) : null;
//   }

//   return null;
// }

// /** Extract a readable category name, regardless of nesting/casing */
// function categoryName(a: AnyRec): string {
//   const cat =
//     a.category?.data?.attributes ??
//     a.category?.attributes ??
//     a.category ??
//     null;

//   if (!cat) return 'Uncategorized';

//   return (
//     cat.Name ??
//     cat.name ??
//     cat.title ??
//     'Uncategorized'
//   );
// }

// export default function ProductGrid({ products = [] as AnyRec[] }) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//       {products.map((item) => {
//         const a = attrs(item);

//         const id = item.id ?? a.id;
//         const imageUrl = firstImageUrl(a);
//         const catName = categoryName(a);

//         const title: string = a.Panadol ?? a.title ?? 'Untitled';
//         const desc: string =
//           a.Product_description ??
//           a.description ??
//           'No description available.';
//         const featured: boolean = !!a.featured;
//         const priceRaw = a.Price ?? 0;
//         const priceNum =
//           typeof priceRaw === 'string'
//             ? parseInt(priceRaw, 10) || 0
//             : Number(priceRaw) || 0;

//         const amazonUrl: string = a.amazon_url || '#';

//         return (
//           <div
//             key={id}
//             className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 group"
//           >
//             <div className="relative overflow-hidden">
//               {imageUrl ? (
//                 <img
//                   src={imageUrl}
//                   alt={title}
//                   className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
//                 />
//               ) : (
//                 <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
//                   <span className="text-gray-500">No image</span>
//                 </div>
//               )}

//               {featured && (
//                 <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
//                   Featured
//                 </div>
//               )}

//               <div className="absolute top-4 right-4">
//                 <button className="bg-white rounded-full p-2 shadow-md hover:bg-red-500 hover:text-white transition duration-300">
//                   <Heart className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>

//             <div className="p-6">
//               <div className="flex items-center mb-2">
//                 <div className="flex text-yellow-400">
//                   {[...Array(5)].map((_, i) => (
//                     <Star key={i} className="w-4 h-4 fill-current" />
//                   ))}
//                 </div>
//                 <span className="text-sm text-gray-600 ml-2">(59 reviews)</span>
//               </div>

//               <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
//                 {title}
//               </h3>

//               <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                 {desc}
//               </p>

//               <div className="flex items-center justify-between mb-4">
//                 <span className="text-2xl font-bold text-green-600">
//                   ₦{priceNum.toLocaleString()}
//                 </span>
//                 <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                   {catName}
//                 </span>
//               </div>

//               <div className="space-y-2">
//                 <a
//                   href={amazonUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="block w-full bg-yellow-400 hover:bg-yellow-500 text-center text-gray-900 font-semibold py-3 rounded-lg transition duration-300 transform hover:scale-105"
//                 >
//                   Buy on Amazon
//                 </a>

//                 <Link
//                   href="/cart"
//                   className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 transform hover:scale-105 flex items-center justify-center"
//                 >
//                   <ShoppingCart className="w-4 h-4 mr-2" />
//                   Add to Cart
//                 </Link>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

'use client';

import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';  // ⬅️ use cart

const RAW_BASE = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';
const STRAPI = RAW_BASE.replace(/\/$/, '');

type AnyRec = Record<string, any>;

function prefix(url?: string | null) {
  if (!url) return '';
  return url.startsWith('http') ? url : `${STRAPI}${url}`;
}

function slugify(str = '') {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

/** Handle both Strapi v4 and v5 shapes */
function attrs(item: AnyRec): AnyRec {
  return item?.attributes ? item.attributes : item ?? {};
}

/** Get first image url from Image_Upload (array) OR Image_Upload.data (relation) */
function firstImageUrl(a: AnyRec): string | null {
  const field = a.Image_Upload;

  // v5: array of files
  if (Array.isArray(field) && field.length > 0) {
    const u = field[0]?.attributes?.url ?? field[0]?.url;
    return u ? prefix(u) : null;
  }

  // v4: { data: [...] }
  if (field?.data) {
    const arr = Array.isArray(field.data) ? field.data : [field.data];
    const u = arr[0]?.attributes?.url ?? arr[0]?.url;
    return u ? prefix(u) : null;
  }

  return null;
}

/** Extract a readable category name, regardless of nesting/casing */
function categoryName(a: AnyRec): string {
  const cat =
    a.category?.data?.attributes ??
    a.category?.attributes ??
    a.category ??
    null;

  if (!cat) return 'Uncategorized';
  return cat.Name ?? cat.name ?? cat.title ?? 'Uncategorized';
}

export default function ProductGrid({ products = [] as AnyRec[] }) {
  const { addToCart } = useCart(); // ⬅️ grab addToCart

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((item) => {
        const a = attrs(item);

        const id = item.id ?? a.id;
        const imageUrl = firstImageUrl(a);
        const catName = categoryName(a);

        const title: string = a.Panadol ?? a.title ?? 'Untitled';
        const desc: string =
          a.Product_description ??
          a.description ??
          'No description available.';
        const featured: boolean = !!a.featured;
        const priceRaw = a.Price ?? 0;
        const priceNum =
          typeof priceRaw === 'string'
            ? parseInt(priceRaw, 10) || 0
            : Number(priceRaw) || 0;

        const amazonUrl: string = a.amazon_url || '#';

        function handleAddToCart() {
          // Most CartContext implementations expect something like this:
          // { id, name, price, image, quantity }
          addToCart({
            id,
            name: title,
            price: priceNum,
            image: imageUrl || '',
            quantity: 1,
          });
        }

        return (
          <div
            key={id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 group"
          >
            <div className="relative overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}

              {featured && (
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
                <span className="text-sm text-gray-600 ml-2">(59 reviews)</span>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
                {title}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {desc}
              </p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-green-600">
                  ₦{priceNum.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {catName}
                </span>
              </div>

              <div className="space-y-2">
                <a
                  href={amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-yellow-400 hover:bg-yellow-500 text-center text-gray-900 font-semibold py-3 rounded-lg transition duration-300 transform hover:scale-105"
                >
                  Buy on Amazon
                </a>

                {/* ⬇️ call addToCart on click */}
                <button
                  type="button"
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
      })}
    </div>
  );
}
