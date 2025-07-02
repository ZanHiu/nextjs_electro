import React from 'react';

const Filter = ({
  categories = [],
  brands = [],
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  onReset
}) => {
  const handleReset = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    if (onReset) onReset();
  };

  return (
    <div className="bg-white rounded-lg shadow-md border px-4 py-6 w-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Bộ lọc sản phẩm</h2>
      {/* Danh mục */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">Danh mục</label>
        <select
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          <option value="all">Tất cả danh mục</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </select>
      </div>
      {/* Thương hiệu */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">Thương hiệu</label>
        <select
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={selectedBrand}
          onChange={e => setSelectedBrand(e.target.value)}
        >
          <option value="all">Tất cả thương hiệu</option>
          {brands.map(brand => (
            <option key={brand._id} value={brand._id}>{brand.name}</option>
          ))}
        </select>
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
