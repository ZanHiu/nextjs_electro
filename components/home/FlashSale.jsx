"use client";
import React from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAppContext } from "@/context/AppContext";

const FlashSale = () => {
  const { router } = useAppContext();
  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 23,
    minutes: 59,
    seconds: 34
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const flashSaleItems = [
    {
      id: 1,
      name: "MacBook Air M2",
      discount: "Giảm đến 5.000.000đ",
      image: "/path-to-macbook-image.jpg"
    },
    {
      id: 2,
      name: "Dell XPS 15",
      discount: "Giảm đến 8.000.000đ",
      image: "/path-to-dell-image.jpg"
    },
    {
      id: 3,
      name: "Legion Slim 5",
      discount: "Giảm đến 6.000.000đ",
      image: "/path-to-legion-image.jpg"
    },
    {
      id: 4,
      name: "ROG Zephyrus",
      discount: "Giảm đến 10.000.000đ",
      image: "/path-to-rog-image.jpg"
    }
  ];

  return (
    <div className="mt-12 pb-14">
      <div className="w-full bg-orange-600 text-white rounded-lg p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h2 className="text-2xl font-bold">Flash Sale</h2>
            </div>
            <p className="text-white/90">Giảm giá đến 50% cho tất cả laptop và phụ kiện</p>
          </div>

          {/* Countdown Timer */}
          <div className="flex gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center min-w-[60px]">
              <div className="text-2xl font-bold">{timeLeft.days}</div>
              <div className="text-xs">Ngày</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center min-w-[60px]">
              <div className="text-2xl font-bold">{timeLeft.hours}</div>
              <div className="text-xs">Giờ</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center min-w-[60px]">
              <div className="text-2xl font-bold">{timeLeft.minutes}</div>
              <div className="text-xs">Phút</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center min-w-[60px]">
              <div className="text-2xl font-bold">{timeLeft.seconds}</div>
              <div className="text-xs">Giây</div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-8">
          {flashSaleItems.map((item) => (
            <div
              key={item.id}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 cursor-pointer hover:bg-white/20 transition-all"
              onClick={() => router.push(`/product/${item.id}`)}
            >
              <div className="text-lg font-semibold mb-2">{item.name}</div>
              <div className="text-sm text-white/90 mb-2">{item.discount}</div>
              <div className="text-sm text-white/80">Số lượng có hạn</div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center">
          <button
            onClick={() => router.push('/flash-sale')}
            className="px-8 py-2 border-2 border-white bg-orange-600 text-white rounded-lg hover:bg-white hover:text-orange-600 transition-colors duration-300"
          >
            Xem ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashSale;
