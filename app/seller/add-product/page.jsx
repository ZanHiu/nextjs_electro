"use client";
import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/common/Loading";
import Footer from "@/components/seller/Footer";

const AddProduct = () => {
  const { getToken, brands, categories } = useAppContext();

  // Thông tin cơ bản sản phẩm
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [views, setViews] = useState('');
  const [loading, setLoading] = useState(false);

  // Thuộc tính chung của sản phẩm (lưu vào Product.commonAttributes)
  const [commonAttributes, setCommonAttributes] = useState([]);
  
  // BƯỚC 1: Kho thuộc tính (ProductAttribute)
  const [availableAttributes, setAvailableAttributes] = useState([]);
  
  // BƯỚC 2: Kho màu sắc/hình ảnh (ProductImage)
  const [availableColors, setAvailableColors] = useState([]);
  
  // BƯỚC 3: Tạo variants (ProductVariant)
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    if (brands.length > 0) setBrand(brands[0]._id);
    if (categories.length > 0) setCategory(categories[0]._id);
  }, [brands, categories]);

  // Handlers cho thuộc tính chung
  const handleAddCommonAttribute = () => {
    setCommonAttributes([...commonAttributes, { name: '', value: '' }]);
  };

  const handleRemoveCommonAttribute = (index) => {
    setCommonAttributes(commonAttributes.filter((_, i) => i !== index));
  };

  const handleCommonAttributeChange = (index, field, value) => {
    const updated = [...commonAttributes];
    updated[index][field] = value;
    setCommonAttributes(updated);
  };

  // ===== QUẢN LÝ KHO THUỘC TÍNH =====
  const handleAddAttribute = () => {
    setAvailableAttributes([
      ...availableAttributes,
      { name: '', value: '' }
    ]);
  };

  const handleRemoveAttribute = (idx) => {
    setAvailableAttributes(availableAttributes.filter((_, i) => i !== idx));
  };

  const handleAttributeChange = (idx, field, value) => {
    const updated = [...availableAttributes];
    updated[idx][field] = value;
    setAvailableAttributes(updated);
  };

  // ===== QUẢN LÝ KHO MÀU SẮC =====
  const handleAddColor = () => {
    setAvailableColors([
      ...availableColors,
      { name: '', images: [] }
    ]);
  };

  const handleRemoveColor = (idx) => {
    setAvailableColors(availableColors.filter((_, i) => i !== idx));
  };

  const handleColorChange = (idx, field, value) => {
    const updated = [...availableColors];
    updated[idx][field] = value;
    setAvailableColors(updated);
  };

  const handleColorImageChange = (colorIdx, imgIdx, file) => {
    const updated = [...availableColors];
    const images = updated[colorIdx].images ? [...updated[colorIdx].images] : [];
    images[imgIdx] = file;
    updated[colorIdx].images = images;
    setAvailableColors(updated);
  };

  // ===== QUẢN LÝ VARIANTS =====
  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        selectedAttributes: [], // Array of attribute indices
        price: '',
        offerPrice: ''
      }
    ]);
  };

  const handleRemoveVariant = (idx) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const handleVariantChange = (idx, field, value) => {
    const updated = [...variants];
    updated[idx][field] = value;
    setVariants(updated);
  };

  const handleVariantAttributeToggle = (variantIdx, attrIdx) => {
    const updated = [...variants];
    const selectedAttrs = updated[variantIdx].selectedAttributes || [];
    
    if (selectedAttrs.includes(attrIdx)) {
      updated[variantIdx].selectedAttributes = selectedAttrs.filter(i => i !== attrIdx);
    } else {
      updated[variantIdx].selectedAttributes = [...selectedAttrs, attrIdx];
    }
    setVariants(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (availableColors.length === 0) {
      toast.error('Cần thêm ít nhất 1 màu sắc!');
      return;
    }
    
    if (variants.length === 0) {
      toast.error('Cần thêm ít nhất 1 biến thể!');
      return;
    }
    
    // Kiểm tra mỗi màu có ảnh
    for (let i = 0; i < availableColors.length; i++) {
      if (!availableColors[i].images || availableColors[i].images.length === 0 || !availableColors[i].images[0]) {
        toast.error(`Màu "${availableColors[i].name || `#${i + 1}`}" chưa có ảnh!`);
        return;
      }
      if (!availableColors[i].name.trim()) {
        toast.error(`Màu thứ ${i + 1} chưa có tên!`);
        return;
      }
    }
    
    // Kiểm tra mỗi variant
    for (let i = 0; i < variants.length; i++) {
      if (!variants[i].price) {
        toast.error(`Biến thể thứ ${i + 1} chưa có giá!`);
        return;
      }
    }
    
    setLoading(true);

    const formData = new FormData();

    // Thông tin cơ bản
    formData.append("name", name);
    formData.append("description", description);
    formData.append("brand", brand);
    formData.append("category", category);
    formData.append("views", views);

    // Chuẩn bị dữ liệu theo format EAV
    const productData = {
      commonAttributes: commonAttributes.filter(attr => attr.name && attr.value), // Thuộc tính chung
      attributes: availableAttributes.filter(attr => attr.name && attr.value), // Thuộc tính riêng
      colors: availableColors.filter(color => color.name),
      variants: variants.map(variant => ({
        attributeIndices: variant.selectedAttributes || [],
        price: variant.price,
        offerPrice: variant.offerPrice
      }))
    };
    
    formData.append('productData', JSON.stringify(productData));

    // Upload ảnh cho từng màu
    availableColors.forEach((color, colorIdx) => {
      if (color.images && color.images.length > 0) {
        color.images.forEach((file, imgIdx) => {
          if (file) {
            formData.append(`colorImages_${colorIdx}_${imgIdx}`, file);
          }
        });
      }
    });

    try {
      const token = await getToken();
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      
      if (data.success) {
        toast.success(data.message);
        // Reset form
        setName('');
        setDescription('');
        setBrand(brands[0]?._id || '');
        setCategory(categories[0]?._id || '');
        setViews('');
        setCommonAttributes([]);
        setAvailableAttributes([]);
        setAvailableColors([]);
        setVariants([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 h-screen flex flex-col overflow-scroll justify-between text-sm">
      {loading ? <Loading /> : (
        <form onSubmit={handleSubmit} className="w-full md:p-10 p-4 space-y-6 max-w-4xl">
          <h1 className="text-2xl font-semibold mb-6">Thêm sản phẩm (EAV Model)</h1>
          
          {/* Thông tin cơ bản */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-lg font-medium mb-4">Thông tin cơ bản</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-base font-medium" htmlFor="product-name">
                  Tên sản phẩm
                </label>
                <input
                  id="product-name"
                  type="text"
                  placeholder="Nhập tên sản phẩm"
                  className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 mt-1"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-base font-medium" htmlFor="product-description">
                  Mô tả sản phẩm
                </label>
                <textarea
                  id="product-description"
                  rows={4}
                  className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none mt-1"
                  placeholder="Nhập mô tả sản phẩm"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  required
                ></textarea>
              </div>

              <div>
                <label className="text-base font-medium" htmlFor="brand">
                  Thương hiệu
                </label>
                <select
                  id="brand"
                  className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 mt-1"
                  onChange={(e) => setBrand(e.target.value)}
                  value={brand}
                  required
                >
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-base font-medium" htmlFor="category">
                  Danh mục
                </label>
                <select
                  id="category"
                  className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 mt-1"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                  required
                >
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-base font-medium" htmlFor="views">
                  Lượt xem
                </label>
                <input
                  id="views"
                  type="number"
                  placeholder="0"
                  className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 mt-1"
                  onChange={(e) => setViews(e.target.value)}
                  value={views}
                  required
                />
              </div>
            </div>
          </div>

          {/* Thuộc tính chung của sản phẩm */}
          <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium text-purple-800">Thuộc tính chung sản phẩm</h2>
                <p className="text-sm text-purple-600">Các thuộc tính áp dụng cho toàn bộ sản phẩm (VD: Thương hiệu, Xuất xứ, Bảo hành...)</p>
              </div>
              <button 
                type="button" 
                onClick={handleAddCommonAttribute} 
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              >
                + Thêm thuộc tính chung
              </button>
            </div>
            
            <div className="space-y-3">
              {commonAttributes.map((attr, idx) => (
                <div key={idx} className="flex gap-3 items-center p-3 bg-white rounded border">
                  <input
                    type="text"
                    placeholder="Tên thuộc tính (VD: Xuất xứ)"
                    value={attr.name}
                    onChange={(e) => handleCommonAttributeChange(idx, 'name', e.target.value)}
                    className="flex-1 outline-none py-2 px-3 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    placeholder="Giá trị (VD: Việt Nam)"
                    value={attr.value}
                    onChange={(e) => handleCommonAttributeChange(idx, 'value', e.target.value)}
                    className="flex-1 outline-none py-2 px-3 rounded border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCommonAttribute(idx)}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              ))}
              
              {commonAttributes.length === 0 && (
                <p className="text-purple-600 text-center py-4">Chưa có thuộc tính chung nào. Nhấn "Thêm thuộc tính chung" để bắt đầu.</p>
              )}
            </div>
          </div>

          {/* BƯỚC 1: Kho thuộc tính */}
          <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium text-blue-800">BƯỚC 1: Tạo kho thuộc tính</h2>
                <p className="text-sm text-blue-600">Thêm tất cả các thuộc tính có thể có (VD: RAM 8GB, RAM 16GB, Storage 256GB, Storage 512GB...)</p>
              </div>
              <button 
                type="button" 
                onClick={handleAddAttribute} 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                + Thêm thuộc tính
              </button>
            </div>
            
            <div className="space-y-3">
              {availableAttributes.map((attr, idx) => (
                <div key={idx} className="flex gap-3 items-center p-3 bg-white rounded border">
                  <input
                    type="text"
                    placeholder="Tên thuộc tính (VD: RAM)"
                    value={attr.name}
                    onChange={(e) => handleAttributeChange(idx, 'name', e.target.value)}
                    className="flex-1 outline-none py-2 px-3 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    placeholder="Giá trị (VD: 8GB)"
                    value={attr.value}
                    onChange={(e) => handleAttributeChange(idx, 'value', e.target.value)}
                    className="flex-1 outline-none py-2 px-3 rounded border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAttribute(idx)}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              ))}
              
              {availableAttributes.length === 0 && (
                <p className="text-blue-600 text-center py-4">Chưa có thuộc tính nào. Nhấn "Thêm thuộc tính" để bắt đầu.</p>
              )}
            </div>
          </div>

          {/* BƯỚC 2: Kho màu sắc */}
          <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium text-green-800">BƯỚC 2: Tạo kho màu sắc <span className="text-red-500">*</span></h2>
                <p className="text-sm text-green-600">Thêm tất cả các màu sắc có thể có và ảnh tương ứng</p>
              </div>
              <button 
                type="button" 
                onClick={handleAddColor} 
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                + Thêm màu
              </button>
            </div>
            
            {availableColors.length === 0 && (
              <div className="text-center py-8 bg-white rounded border-2 border-dashed border-green-300">
                <p className="text-green-600 mb-2">Chưa có màu nào</p>
                <p className="text-red-500 text-sm">Cần ít nhất 1 màu cho sản phẩm</p>
              </div>
            )}
            
            <div className="space-y-4">
              {availableColors.map((color, idx) => (
                <div key={idx} className="bg-white p-4 rounded border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Màu #{idx + 1}</h3>
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(idx)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      Xóa màu
                    </button>
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Tên màu *</label>
                    <input 
                      type="text" 
                      value={color.name} 
                      onChange={e => handleColorChange(idx, 'name', e.target.value)} 
                      className="w-full outline-none py-2 px-3 rounded border border-gray-300" 
                      placeholder="VD: Đen, Trắng, Xanh dương..." 
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Ảnh màu * (tối đa 4 ảnh)</label>
                    <div className="grid grid-cols-4 gap-3">
                      {[...Array(4)].map((_, imgIdx) => (
                        <label key={imgIdx} htmlFor={`color-image-${idx}-${imgIdx}`} className="block">
                          <input 
                            type="file" 
                            id={`color-image-${idx}-${imgIdx}`} 
                            hidden 
                            onChange={e => handleColorImageChange(idx, imgIdx, e.target.files[0])} 
                            accept="image/*"
                          />
                          <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-400 transition-colors">
                            {color.images && color.images[imgIdx] ? (
                              <Image
                                src={URL.createObjectURL(color.images[imgIdx])}
                                alt=""
                                width={100}
                                height={100}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <div className="text-center">
                                <Image
                                  src={assets.upload_area}
                                  alt=""
                                  width={40}
                                  height={40}
                                  className="mx-auto mb-1 opacity-50"
                                />
                                <p className="text-xs text-gray-500">Thêm ảnh</p>
                              </div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BƯỚC 3: Tạo variants */}
          <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium text-orange-800">BƯỚC 3: Tạo biến thể sản phẩm <span className="text-red-500">*</span></h2>
                <p className="text-sm text-orange-600">Chọn tổ hợp thuộc tính + giá để tạo các biến thể. Hệ thống sẽ tự động tạo variants cho tất cả màu sắc.</p>
              </div>
              <button 
                type="button" 
                onClick={handleAddVariant} 
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                disabled={availableAttributes.length === 0}
              >
                + Thêm biến thể
              </button>
            </div>
            
            {variants.length === 0 && (
              <div className="text-center py-8 bg-white rounded border-2 border-dashed border-orange-300">
                <p className="text-orange-600 mb-2">Chưa có biến thể nào</p>
                <p className="text-red-500 text-sm">Cần ít nhất 1 biến thể cho sản phẩm</p>
                {availableAttributes.length === 0 && (
                  <p className="text-gray-500 text-sm mt-1">Hãy thêm thuộc tính trước khi tạo biến thể</p>
                )}
              </div>
            )}
            
            <div className="space-y-4">
              {variants.map((variant, idx) => (
                <div key={idx} className="bg-white p-4 rounded border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Biến thể #{idx + 1}</h3>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      Xóa biến thể
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Loại bỏ phần chọn màu */}
                    
                    {/* Giá */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Giá *</label>
                      <input 
                        type="number" 
                        placeholder="0" 
                        value={variant.price} 
                        onChange={e => handleVariantChange(idx, 'price', e.target.value)} 
                        className="w-full outline-none py-2 px-3 rounded border border-gray-300" 
                        required
                      />
                    </div>
                    
                    {/* Giá khuyến mãi */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Giá khuyến mãi</label>
                      <input 
                        type="number" 
                        placeholder="0" 
                        value={variant.offerPrice} 
                        onChange={e => handleVariantChange(idx, 'offerPrice', e.target.value)} 
                        className="w-full outline-none py-2 px-3 rounded border border-gray-300" 
                      />
                    </div>
                  </div>
                  
                  {/* Chọn thuộc tính */}
                  {availableAttributes.length > 0 && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">Chọn thuộc tính cho biến thể này</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {availableAttributes.map((attr, attrIdx) => (
                          <label key={attrIdx} className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={(variant.selectedAttributes || []).includes(attrIdx)}
                              onChange={() => handleVariantAttributeToggle(idx, attrIdx)}
                              className="rounded"
                            />
                            <span className="text-sm">
                              {attr.name}: {attr.value}
                            </span>
                          </label>
                        ))}
                      </div>
                      
                      {(!variant.selectedAttributes || variant.selectedAttributes.length === 0) && (
                        <p className="text-gray-500 text-sm mt-2">Chưa chọn thuộc tính nào</p>
                      )}
                    </div>
                  )}
                  
                  {/* Preview biến thể */}
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <h4 className="text-sm font-medium mb-2">Preview biến thể:</h4>
                    <div className="text-sm text-gray-600">
                      <p><strong>Tạo cho tất cả màu:</strong> {availableColors.map(c => c.name).join(', ') || 'Chưa có màu'}</p>
                      <p><strong>Giá:</strong> {variant.price ? `${parseInt(variant.price).toLocaleString()}đ` : 'Chưa nhập'}</p>
                      {variant.offerPrice && (
                        <p><strong>Giá KM:</strong> {parseInt(variant.offerPrice).toLocaleString()}đ</p>
                      )}
                      <p><strong>Thuộc tính:</strong> {
                        (variant.selectedAttributes || []).length > 0 
                          ? (variant.selectedAttributes || []).map(attrIdx => 
                              `${availableAttributes[attrIdx]?.name}: ${availableAttributes[attrIdx]?.value}`
                            ).join(', ')
                          : 'Không có'
                      }</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Đang thêm...' : 'Thêm sản phẩm'}
            </button>
          </div>
        </form>
      )}
      <Footer />
    </div>
  );
};

export default AddProduct;