import React, { useState, useRef } from 'react';
import Image from 'next/image';

const Filter = ({
  categories = [],
  brands = [],
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  onReset
}) => {
  const [openCategory, setOpenCategory] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);
  const categoryRef = useRef(null);
  const brandRef = useRef(null);

  // Đóng dropdown khi click ngoài
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setOpenCategory(false);
      }
      if (brandRef.current && !brandRef.current.contains(event.target)) {
        setOpenBrand(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReset = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    if (onReset) onReset();
  };

  return (
    <div className="bg-white rounded-lg shadow-md border px-4 py-6 w-full mt-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Bộ lọc sản phẩm</h2>
      {/* Danh mục */}
      <div className="mb-4 relative" ref={categoryRef}>
        <label className="block text-sm font-medium mb-1 text-gray-700">Danh mục</label>
        <button
          type="button"
          className="w-full border rounded px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white flex items-center justify-between"
          onClick={() => setOpenCategory((v) => !v)}
        >
          <span>
            {selectedCategory === 'all'
              ? 'Tất cả danh mục'
              : categories.find(c => c._id === selectedCategory)?.name || 'Chọn danh mục'}
          </span>
          <svg className={`w-4 h-4 ml-2 transition-transform ${openCategory ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
        {openCategory && (
          <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5 max-h-60 overflow-y-auto">
            <li
              className={`px-4 py-2 hover:bg-gray-500/10 cursor-pointer ${selectedCategory === 'all' ? 'font-semibold text-orange-600' : ''}`}
              onClick={() => { setSelectedCategory('all'); setOpenCategory(false); }}
            >
              Tất cả danh mục
            </li>
            {categories.map((category) => (
              <li
                key={category._id}
                className={`px-4 py-2 hover:bg-gray-500/10 cursor-pointer ${selectedCategory === category._id ? 'font-semibold text-orange-600' : ''}`}
                onClick={() => { setSelectedCategory(category._id); setOpenCategory(false); }}
              >
                <div className="flex items-center gap-2">
                  <Image src={category.image[0]} alt={category.name} width={50} height={50} className="rounded object-cover" />
                  <span>{category.name}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Thương hiệu */}
      <div className="mb-4 relative" ref={brandRef}>
        <label className="block text-sm font-medium mb-1 text-gray-700">Thương hiệu</label>
        <button
          type="button"
          className="w-full border rounded px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white flex items-center justify-between"
          onClick={() => setOpenBrand((v) => !v)}
        >
          <span>
            {selectedBrand === 'all'
              ? 'Tất cả thương hiệu'
              : brands.find(b => b._id === selectedBrand)?.name || 'Chọn thương hiệu'}
          </span>
          <svg className={`w-4 h-4 ml-2 transition-transform ${openBrand ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
        {openBrand && (
          <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5 max-h-60 overflow-y-auto">
            <li
              className={`px-4 py-2 hover:bg-gray-500/10 cursor-pointer ${selectedBrand === 'all' ? 'font-semibold text-orange-600' : ''}`}
              onClick={() => { setSelectedBrand('all'); setOpenBrand(false); }}
            >
              Tất cả thương hiệu
            </li>
            {brands.map((brand) => (
              <li
                key={brand._id}
                className={`px-4 py-2 hover:bg-gray-500/10 cursor-pointer ${selectedBrand === brand._id ? 'font-semibold text-orange-600' : ''}`}
                onClick={() => { setSelectedBrand(brand._id); setOpenBrand(false); }}
              >
                <div className="flex items-center gap-2">
                  <Image src={brand.image[0]} alt={brand.name} width={50} height={50} className="rounded object-cover" />
                  <span>{brand.name}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        className="w-full py-2 rounded bg-orange-600 text-white font-semibold hover:bg-orange-700 transition mb-2"
        onClick={handleReset}
        type="button"
      >
        Đặt lại bộ lọc
      </button>
    </div>
  );
};

export default Filter;
