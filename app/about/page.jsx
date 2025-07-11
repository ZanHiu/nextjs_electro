"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-semibold mb-4 text-center">About Us</h1>

          <div className="mb-12 text-center">
            <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
              Electro is the premier destination for technology and electronics enthusiasts. We pride ourselves on offering high quality products from the world's leading brands.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-4">Our mission</h2>
              <p className="text-gray-600">
                Provide customers with the best technology products at reasonable prices, along with excellent customer service and thoughtful after-sales service.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-4">Our vision</h2>
              <p className="text-gray-600">
                Become a leading electronics retailer, trusted and chosen by customers in purchasing technology products.
              </p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6 text-center">Core values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Quality</h3>
                <p className="text-gray-600">Committed to providing genuine, high quality products</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Service</h3>
                <p className="text-gray-600">Dedicated service, 24/7 customer support</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Reputation</h3>
                <p className="text-gray-600">Build trust with customers through every transaction</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Contact us</h2>
            <div className="space-y-3 text-gray-600">
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email: support@electro.com
              </p>
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Phone: 1900 xxxx
              </p>
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Address: 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
