"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

const AllBrands = () => {
  const { brands, router } = useAppContext();

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
        <div className="flex justify-between items-center w-full pt-12">
          <div className="flex flex-col">
            <p className="text-2xl font-medium">All brands</p>
            <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
          </div>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 mt-12 pb-14 w-full">
          {brands.map((brand) => (
            <div
              key={brand._id}
              onClick={() => router.push(`/products/brand/${brand._id}`)}
              className="bg-white rounded border hover:border-orange-600 cursor-pointer transition-all duration-300 p-3 flex items-center justify-center"
            >
              <div className="relative w-full aspect-[3/2]">
                <Image
                  src={brand.image[0]}
                  alt={brand.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllBrands;
