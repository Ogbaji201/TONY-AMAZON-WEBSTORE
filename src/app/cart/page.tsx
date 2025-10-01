
// src/app/cart/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, X, ShoppingCart } from 'lucide-react';

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getCartTotal,
  } = useCart();

  const subtotal = getCartTotal();
  const shipping = cartItems.length > 0 ? 1500 : 0; // mirror your checkout calc
  const tax = 0;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <Link
            href="/products"
            className="text-blue-600 hover:text-blue-700"
          >
            Continue shopping →
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Your cart is empty.</p>
            <Link
              href="/products"
              className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow divide-y">
              {cartItems.map((item) => (
                <div key={item.id} className="p-4 flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    {item.image ? (
                      // using img instead of <Image> to avoid domain config needs
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src="/favicon.ico"
                        alt=""
                        width={40}
                        height={40}
                        className="opacity-40"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-gray-500">₦{item.price.toLocaleString()}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 rounded hover:bg-gray-100"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      className="p-2 rounded hover:bg-gray-100"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    className="p-2 rounded hover:bg-gray-100 text-red-500"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl shadow p-6 h-max">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₦{shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₦{tax.toLocaleString()}</span>
                </div>
                <div className="border-t my-3" />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/products"
                className="mt-3 block text-center text-blue-600 hover:text-blue-700"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
