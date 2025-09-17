
// src/app/about/page.tsx
'use client';

import { Users, Shield, Award, Truck, Heart, Target } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'All our products are sourced from certified manufacturers and undergo rigorous quality checks.'
    },
    {
      icon: Heart,
      title: 'Customer Care',
      description: 'Your health is our priority. We provide personalized support and medical guidance.'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Same-day delivery available in major cities. Your medications when you need them.'
    },
    {
      icon: Award,
      title: 'Expert Team',
      description: 'Our team includes licensed pharmacists and healthcare professionals.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '500+', label: 'Products Available' },
    { number: '24/7', label: 'Customer Support' },
    { number: '50+', label: 'Cities Served' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation categories={[]} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About PharmaStore</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Your trusted partner in healthcare, delivering quality medications and wellness products 
            right to your doorstep.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2020, PharmaStore emerged from a simple vision: to make healthcare 
                accessible and convenient for everyone. What started as a small local pharmacy 
                has grown into a trusted online healthcare destination serving thousands of 
                customers across Nigeria.
              </p>
              <p className="text-gray-600 mb-4">
                Our journey began when our founder, a licensed pharmacist, noticed the challenges 
                people faced in accessing quality medications. Long queues, limited stock, and 
                geographical barriers inspired us to create a solution that brings the pharmacy 
                to your fingertips.
              </p>
              <p className="text-gray-600">
                Today, we're proud to be a team of healthcare professionals, technologists, and 
                customer service experts dedicated to revolutionizing how Nigerians access 
                healthcare products.
              </p>
            </div>
            <div className="bg-blue-100 rounded-2xl p-8 h-80 flex items-center justify-center">
              <Users className="w-32 h-32 text-blue-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center">
              <Target className="w-16 h-16 text-blue-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To provide convenient access to quality healthcare products and services, 
                ensuring every Nigerian can maintain their well-being with confidence and ease.
              </p>
            </div>
            <div className="text-center">
              <Award className="w-16 h-16 text-purple-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To become Nigeria's most trusted healthcare partner, setting the standard 
                for excellence in pharmaceutical e-commerce and customer care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do, from product selection to customer service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Here's what sets PharmaStore apart from other healthcare providers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">100% Authentic</h3>
              <p className="text-gray-600">
                All products are sourced directly from licensed manufacturers and distributors.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Discreet</h3>
              <p className="text-gray-600">
                Professional delivery with discreet packaging to maintain your privacy.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Expert Support</h3>
              <p className="text-gray-600">
                Consult with our licensed pharmacists for personalized recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Better Healthcare?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust PharmaStore for their healthcare needs.
          </p>
          <div className="space-x-4">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Shop Now
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-800 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}