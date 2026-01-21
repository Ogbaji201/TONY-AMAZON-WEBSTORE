
// "use client";

// import { useCart } from '@/context/CartContext';
// import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
// import { useState } from 'react';
// import Link from 'next/link';

// export default function Cart() {
//   const [isOpen, setIsOpen] = useState(false);
//   const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();

//   return (
//     <>
//       {/* Cart Button */}
//       <button
//         onClick={() => setIsOpen(true)}
//         className="p-2 rounded-full hover:bg-gray-100 transition duration-300 relative"
//       >
//         <ShoppingCart className="w-5 h-5" />
//         {getCartCount() > 0 && (
//           <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
//             {getCartCount()}
//           </span>
//         )}
//       </button>

//       {/* Cart Overlay */}
//       {isOpen && (
//         <div className="fixed inset-0 z-50 overflow-hidden">
//           <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          
//           <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
//             <div className="flex flex-col h-full">
//               {/* Header */}
//               <div className="flex items-center justify-between p-4 border-b">
//                 <h2 className="text-lg font-semibold">Shopping Cart ({getCartCount()})</h2>
//                 <button
//                   onClick={() => setIsOpen(false)}
//                   className="p-1 hover:bg-gray-100 rounded"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               {/* Cart Items */}
//               <div className="flex-1 overflow-y-auto p-4">
//                 {cartItems.length === 0 ? (
//                   <div className="text-center text-gray-500 py-8">
//                     <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
//                     <p>Your cart is empty</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {cartItems.map((item) => (
//                       <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
//                         <img
//                           src={item.image || '/placeholder-image.jpg'}
//                           alt={item.name}
//                           className="w-16 h-16 object-cover rounded"
//                         />
//                         <div className="flex-1">
//                           <h3 className="font-medium">{item.name}</h3>
//                           <p className="text-gray-600">₦{item.price.toLocaleString()}</p>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <button
//                             onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                             className="p-1 hover:bg-gray-100 rounded"
//                           >
//                             <Minus className="w-4 h-4" />
//                           </button>
//                           <span className="w-8 text-center">{item.quantity}</span>
//                           <button
//                             onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                             className="p-1 hover:bg-gray-100 rounded"
//                           >
//                             <Plus className="w-4 h-4" />
//                           </button>
//                         </div>
//                         <button
//                           onClick={() => removeFromCart(item.id)}
//                           className="p-1 hover:bg-gray-100 rounded text-red-500"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Footer */}
//               {cartItems.length > 0 && (
//                 <div className="border-t p-4">
//                   <div className="flex justify-between text-lg font-semibold mb-4">
//                     <span>Total:</span>
//                     <span>₦{getCartTotal().toLocaleString()}</span>
//                   </div>
//                   <Link 
//                     href="/checkout" 
//                     className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center block"
//                     onClick={() => setIsOpen(false)}
//                   >
//                     Proceed to Checkout
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

"use client";

import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Cart() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();

  const goCheckout = () => {
    setIsOpen(false);
    router.push("/checkout");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full hover:bg-gray-100 transition duration-300 relative"
        type="button"
      >
        <ShoppingCart className="w-5 h-5" />
        {getCartCount() > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {getCartCount()}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Shopping Cart ({getCartCount()})</h2>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded" type="button">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {cartItems.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                        <img
                          src={item.image || "/placeholder-image.jpg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-gray-600">₦{item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 rounded"
                            type="button"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 rounded"
                            type="button"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 hover:bg-gray-100 rounded text-red-500"
                          type="button"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="border-t p-4">
                  <div className="flex justify-between text-lg font-semibold mb-4">
                    <span>Total:</span>
                    <span>₦{getCartTotal().toLocaleString()}</span>
                  </div>

                  <button
                    type="button"
                    onClick={goCheckout}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center block"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
