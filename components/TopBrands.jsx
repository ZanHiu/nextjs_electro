import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

const TopBrands = () => {
  const { topBrands, router } = useAppContext();

  return (
    <div className="mt-12">
      <div className="flex flex-col items-start mb-8">
        <p className="text-3xl font-medium">Top Brands</p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>
      
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 pb-14 w-full">
        {topBrands.map((brand, index) => (
          <div
            key={brand._id || index}
            onClick={() => router.push(`/products/brand/${brand.brandId}`)}
            className="bg-white rounded border hover:border-orange-600 cursor-pointer transition-all duration-300 p-3 flex items-center justify-center"
          >
            <div className="relative w-full aspect-[5/2]">
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
  );
};

export default TopBrands;
