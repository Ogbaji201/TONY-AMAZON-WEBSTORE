
// 'use client';

// import { useState } from 'react';
// import { CreditCard, Truck, Shield, ArrowLeft, MapPin } from 'lucide-react';
// import { useCart } from '@/context/CartContext';
// // import Navigation from '@/components/Navigation';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';

// export default function CheckoutPage() {
//   const { cartItems, getCartTotal, getCartCount, clearCart } = useCart();
//   const router = useRouter();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [formData, setFormData] = useState({
//     email: '',
//     firstName: '',
//     lastName: '',
//     address: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     phone: '',
//     cardNumber: '',
//     expiryDate: '',
//     cvv: '',
//     cardName: '',
//     saveInfo: false
//   });

//   const total = getCartTotal();
//   const itemCount = getCartCount();
//   const shipping = total > 25000 ? 0 : 1500; // Free shipping over ₦25,000
//   const tax = total * 0.075; // 7.5% tax
//   const finalTotal = total + shipping + tax;

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsProcessing(true);

//     try {
//       // Prepare customer data for the order
//       const customerData = {
//         name: `${formData.firstName} ${formData.lastName}`,
//         email: formData.email,
//         phone: formData.phone,
//         address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`
//       };

//       // Send order to database
//       const response = await fetch('/api/orders', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           customer: customerData,
//           items: cartItems,
//           totalAmount: finalTotal,
//         }),
//       });

//       const result = await response.json();

//       if (result.success) {
//         // Send confirmation email
//         await fetch('/api/send-email', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             customer: customerData,
//             order: { id: result.orderId, totalAmount: finalTotal },
//             items: cartItems,
//           }),
//         });
//         // Clear cart and move to success step
//         clearCart();
//         setCurrentStep(3);
        
//         // Optional: Redirect to success page with order ID
//         // router.push(`/checkout/success?orderId=${result.orderId}`);
//       } else {
//         alert('Failed to place order. Please try again.');
//         console.error('Order error:', result.error);
//       }
//     } catch (error) {
//       console.error('Error placing order:', error);
//       alert('An error occurred while placing your order. Please try again.');
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const steps = [
//     { number: 1, title: 'Shipping' },
//     { number: 2, title: 'Payment' },
//     { number: 3, title: 'Confirmation' }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* <Navigation categories={[]} /> */}
      
//       <div className="container mx-auto px-4 py-8 max-w-6xl">
//         {/* Breadcrumb */}
//         <Link href="/cart" className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back to Cart
//         </Link>

//         {/* Progress Steps */}
//         <div className="mb-12">
//           <div className="flex items-center justify-between mb-4">
//             {steps.map((step, index) => (
//               <div key={step.number} className="flex items-center">
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
//                   currentStep >= step.number
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-300 text-gray-600'
//                 }`}>
//                   {step.number}
//                 </div>
//                 <span className={`ml-2 font-medium ${
//                   currentStep >= step.number ? 'text-blue-600' : 'text-gray-600'
//                 }`}>
//                   {step.title}
//                 </span>
//                 {index < steps.length - 1 && (
//                   <div className={`w-16 h-0.5 mx-4 ${
//                     currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
//                   }`} />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Checkout Form */}
//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             {currentStep === 1 && (
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Information</h2>
//                 <form className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Email Address *
//                     </label>
//                     <input
//                       type="email"
//                       name="email"
//                       required
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="your.email@example.com"
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         First Name *
//                       </label>
//                       <input
//                         type="text"
//                         name="firstName"
//                         required
//                         value={formData.firstName}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Last Name *
//                       </label>
//                       <input
//                         type="text"
//                         name="lastName"
//                         required
//                         value={formData.lastName}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Delivery Address *
//                     </label>
//                     <div className="relative">
//                       <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
//                       <input
//                         type="text"
//                         name="address"
//                         required
//                         value={formData.address}
//                         onChange={handleInputChange}
//                         className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         placeholder="Street address"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         City *
//                       </label>
//                       <input
//                         type="text"
//                         name="city"
//                         required
//                         value={formData.city}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         State *
//                       </label>
//                       <input
//                         type="text"
//                         name="state"
//                         required
//                         value={formData.state}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         ZIP Code *
//                       </label>
//                       <input
//                         type="text"
//                         name="zipCode"
//                         required
//                         value={formData.zipCode}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Phone Number *
//                       </label>
//                       <input
//                         type="tel"
//                         name="phone"
//                         required
//                         value={formData.phone}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         placeholder="+234 800 000 0000"
//                       />
//                     </div>
//                   </div>

//                   <div className="flex space-x-4">
//                     <Link
//                       href="/cart"
//                       className="flex-1 border border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
//                     >
//                       Back to Cart
//                     </Link>
//                     <button
//                       type="button"
//                       onClick={() => setCurrentStep(2)}
//                       disabled={!formData.email || !formData.firstName || !formData.lastName || !formData.address || !formData.phone}
//                       className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
//                     >
//                       Continue to Payment
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             )}

//             {currentStep === 2 && (
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Information</h2>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Card Number *
//                     </label>
//                     <div className="relative">
//                       <CreditCard className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
//                       <input
//                         type="text"
//                         name="cardNumber"
//                         required
//                         value={formData.cardNumber}
//                         onChange={handleInputChange}
//                         className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         placeholder="1234 5678 9012 3456"
//                         maxLength={19}
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Expiry Date *
//                       </label>
//                       <input
//                         type="text"
//                         name="expiryDate"
//                         required
//                         value={formData.expiryDate}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         placeholder="MM/YY"
//                         maxLength={5}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         CVV *
//                       </label>
//                       <input
//                         type="text"
//                         name="cvv"
//                         required
//                         value={formData.cvv}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         placeholder="123"
//                         maxLength={3}
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Name on Card *
//                     </label>
//                     <input
//                       type="text"
//                       name="cardName"
//                       required
//                       value={formData.cardName}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="John Doe"
//                     />
//                   </div>

//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       name="saveInfo"
//                       checked={formData.saveInfo}
//                       onChange={handleInputChange}
//                       className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                     />
//                     <label className="ml-2 text-sm text-gray-600">
//                       Save payment information for next time
//                     </label>
//                   </div>

//                   <div className="flex space-x-4">
//                     <button
//                       type="button"
//                       onClick={() => setCurrentStep(1)}
//                       className="flex-1 border border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
//                     >
//                       Back
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={isProcessing || !formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardName}
//                       className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
//                     >
//                       {isProcessing ? 'Processing...' : `Pay ₦${finalTotal.toLocaleString()}`}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             )}

//             {currentStep === 3 && (
//               <div className="text-center py-12">
//                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <Shield className="w-8 h-8 text-green-600" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Confirmed!</h2>
//                 <p className="text-gray-600 mb-6">
//                   Thank you for your purchase. Your order has been confirmed and is being processed.
//                 </p>
//                 <p className="text-sm text-gray-500 mb-8">
//                   We've sent a confirmation email with your order details.
//                 </p>
//                 <div className="space-x-4">
//                   <Link
//                     href="/products"
//                     className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
//                   >
//                     Continue Shopping
//                   </Link>
//                   <Link
//                     href="/"
//                     className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
//                   >
//                     Return to Home
//                   </Link>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Order Summary */}
//           <div className="lg:sticky lg:top-8 h-fit">
//             <div className="bg-white rounded-2xl shadow-lg p-6">
//               <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
//               {/* Cart Items */}
//               <div className="space-y-4 mb-6">
//                 {cartItems.map((item) => (
//                   <div key={item.id} className="flex items-center space-x-4">
//                     <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden">
//                       {item.image && (
//                         <img
//                           src={item.image}
//                           alt={item.name}
//                           className="w-full h-full object-cover"
//                         />
//                       )}
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
//                       <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
//                     </div>
//                     <div className="text-sm font-semibold text-gray-800">
//                       ₦{(item.price * item.quantity).toLocaleString()}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Order Totals */}
//               <div className="space-y-3 border-t border-gray-200 pt-4">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Subtotal({getCartCount()} items)</span>
//                   <span className="text-gray-800">₦{total.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Shipping</span>
//                   <span className="text-gray-800">
//                     {shipping === 0 ? 'Free' : `₦${shipping.toLocaleString()}`}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Tax (7.5%)</span>
//                   <span className="text-gray-800">₦{tax.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
//                   <span>Total</span>
//                   <span>₦{finalTotal.toLocaleString()}</span>
//                 </div>
//               </div>

//               {/* Security Badge */}
//               <div className="mt-6 p-4 bg-green-50 rounded-lg flex items-center space-x-3">
//                 <Shield className="w-5 h-5 text-green-600" />
//                 <span className="text-sm text-green-700">Secure payment processing</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { Shield, ArrowLeft, MapPin } from 'lucide-react';
import { useCart } from '@/context/CartContext';
// import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { init } from 'next/dist/compiled/webpack/webpack';

export default function CheckoutPage() {
  const { cartItems, getCartTotal, getCartCount, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });

  const total = getCartTotal();
  const itemCount = getCartCount();

  const shipping = total > 25000 ? 0 : 1500; // Free shipping over ₦25,000
  const tax = total * 0; // 7.5% tax
  const finalTotal = total + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isShippingValid =
    !!formData.email &&
    !!formData.firstName &&
    !!formData.lastName &&
    !!formData.address &&
    !!formData.city &&
    !!formData.state &&
    !!formData.phone;

  const buildCustomerData = () => ({
    name: `${formData.firstName} ${formData.lastName}`.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`.trim(),
  });

  const handlePayWithPaystack = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    if (!isShippingValid) {
      alert('Please complete your shipping details first.');
      setCurrentStep(1);
      return;
    }

    setIsProcessing(true);

    try {
      const customerData = buildCustomerData();

      // 1) Create order in DB (PENDING)
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: customerData,
          items: cartItems,
          totalAmount: finalTotal,
        }),
      });

      const orderJson = await orderRes.json();

      if (!orderRes.ok || !orderJson?.success || !orderJson?.orderId) {
        console.error('Order create error:', orderJson);
        alert(orderJson?.error || 'Failed to create order. Please try again.');
        return;
      }

      const orderId = orderJson.orderId as string;

      // 2) Initialize Paystack transaction
      const initRes = await fetch('/api/payments/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customerData.email,
          amountInKobo: Math.round(finalTotal * 100),
          metadata: {
            orderId,
            customer: customerData,
            itemsCount: cartItems.length,
          },
        }),
      });

      //safer parsing(prevents "Unexpected token<" in future)
      const initText = await initRes.text();
      let initJson: any;
      try {
        initJson = JSON.parse(initText);
      } catch {
        console.error('Failed to parse Paystack response:', initText);
        alert('Failed to parse payment response. Please try again.');
        return;
      }

      const authorizationUrl = initJson?.data?.authorization_url ?? initJson?.authorization_url;

      if (!initRes.ok || !authorizationUrl) {
        console.error('Paystack init error:', initJson);
        alert(initJson?.error || 'Failed to start payment. Please try again.');
        return;
      }

      // 3) Clear cart to prevent duplicates when user comes back
      clearCart();

      // 4) Redirect to Paystack hosted payment page
      window.location.href = authorizationUrl as string;
    } catch (error) {
      console.error('Payment error:', error);
      alert('An error occurred while starting payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { number: 1, title: 'Shipping' },
    { number: 2, title: 'Payment' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link href="/cart" className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Link>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step.number ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {step.number}
                </div>
                <span
                  className={`ml-2 font-medium ${
                    currentStep >= step.number ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Information</h2>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Street address"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+234 800 000 0000"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-2">
                    <Link
                      href="/cart"
                      className="flex-1 border border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
                    >
                      Back to Cart
                    </Link>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      disabled={!isShippingValid}
                      className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment</h2>
                <p className="text-gray-600 mb-6">
                  You will be redirected to Paystack to complete your payment securely (Card, Bank Transfer, USSD).
                </p>

                <div className="p-4 bg-green-50 rounded-lg flex items-center space-x-3 mb-6">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700">
                    Secure payment processing — we do not store card details.
                  </span>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 border border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handlePayWithPaystack}
                    disabled={isProcessing || cartItems.length === 0}
                    className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isProcessing ? 'Redirecting...' : `Pay ₦${finalTotal.toLocaleString()} with Paystack`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-semibold text-gray-800">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                  <span className="text-gray-800">₦{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-800">{shipping === 0 ? 'Free' : `₦${shipping.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (7.5%)</span>
                  <span className="text-gray-800">₦{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                  <span>Total</span>
                  <span>₦{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-700">Secure payment processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
