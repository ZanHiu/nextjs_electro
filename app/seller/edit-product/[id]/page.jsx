"use client";
import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import Loading from "@/components/common/Loading";
import Footer from "@/components/seller/Footer";

const EditProduct = () => {
  const { id } = useParams();
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
  
  // Kho thuộc tính có sẵn từ API
  const [availableAttributesFromAPI, setAvailableAttributesFromAPI] = useState([]);
  
  // Kho màu sắc/hình ảnh (ProductImage)
  const [availableColors, setAvailableColors] = useState([]);
  
  // Tạo variants (ProductVariant)
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    if (brands.length > 0 && !brand) setBrand(brands[0]._id);
    if (categories.length > 0 && !category) setCategory(categories[0]._id);
  }, [brands, categories, brand, category]);

  // Load danh sách thuộc tính từ API
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/attributes/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (data.success) {
          setAvailableAttributesFromAPI(data.allAttributes);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách thuộc tính:', error);
      }
    };

    fetchAttributes();
  }, [getToken]);

  // Load dữ liệu sản phẩm từ backend
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
        if (data.success) {
          const product = data.product;
          const variants = data.variants || [];
          
          // Thông tin cơ bản
          setName(product.name || '');
          setDescription(product.description || '');
          setBrand(product.brand?._id || product.brand || '');
          setCategory(product.category?._id || product.category || '');
          setViews(product.views?.toString() || '0');

          // Thuộc tính chung từ commonAttributes
          if (product.commonAttributes) {
            const commonAttrs = Object.entries(product.commonAttributes).map(([name, value]) => ({
              name,
              value
            }));
            setCommonAttributes(commonAttrs);
          }

          // Xử lý variants và tạo kho màu sắc
          if (variants.length > 0) {
            const colorMap = new Map();
            
            // Thu thập màu sắc và hình ảnh từ variants
            variants.forEach(variant => {
              if (variant.colorName) {
                if (!colorMap.has(variant.colorName)) {
                  colorMap.set(variant.colorName, {
                    name: variant.colorName,
                    images: variant.images || []
                  });
                }
              }
            });

            // Tạo kho màu sắc
            const colors = Array.from(colorMap.values());
            setAvailableColors(colors);

            // Tạo variants với selectedAttributeIds được populate đúng
            const processedVariants = variants.map(variant => {
              const colorName = variant.colorName || '';
              const colorIndex = colors.findIndex(color => color.name === colorName);
              
              // Đảm bảo selectedAttributeIds là mảng các string ID
              let selectedAttributeIds = [];
              if (variant.attributeIds && Array.isArray(variant.attributeIds)) {
                selectedAttributeIds = variant.attributeIds.map(attr => {
                  // Nếu attr là object (đã populate), lấy _id
                  // Nếu attr là string (chưa populate), giữ nguyên
                  return typeof attr === 'object' && attr._id ? attr._id : attr;
                });
              }

              return {
                selectedColorIndex: Math.max(0, colorIndex),
                selectedAttributeIds, // Đảm bảo là mảng các ID string
                price: variant.price?.toString() || '',
                offerPrice: variant.offerPrice?.toString() || ''
              };
            });
            setVariants(processedVariants);
          }
        }
      } catch (error) {
        toast.error('Lỗi khi tải dữ liệu sản phẩm: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

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
        selectedColorIndex: 0,
        selectedAttributeIds: [], // Thay đổi từ selectedAttributes thành selectedAttributeIds
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

  const handleVariantAttributeToggle = (variantIdx, attributeId) => {
    const updated = [...variants];
    const selectedIds = updated[variantIdx].selectedAttributeIds || [];
    
    // Đảm bảo so sánh đúng kiểu dữ liệu (string)
    const attributeIdStr = attributeId.toString();
    
    if (selectedIds.includes(attributeIdStr)) {
      updated[variantIdx].selectedAttributeIds = selectedIds.filter(id => id !== attributeIdStr);
    } else {
      updated[variantIdx].selectedAttributeIds = [...selectedIds, attributeIdStr];
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

    // Chuẩn bị dữ liệu theo format EAV mới
    const productData = {
      commonAttributes: commonAttributes.filter(attr => attr.name && attr.value),
      colors: availableColors.filter(color => color.name),
      variants: variants.map(variant => ({
        colorIndex: variant.selectedColorIndex,
        selectedAttributeIds: variant.selectedAttributeIds || [], // Sử dụng selectedAttributeIds
        price: variant.price,
        offerPrice: variant.offerPrice
      }))
    };
    
    formData.append('productData', JSON.stringify(productData));

    // Upload ảnh cho từng màu (chỉ upload file mới)
    availableColors.forEach((color, colorIdx) => {
      if (color.images && color.images.length > 0) {
        color.images.forEach((file, imgIdx) => {
          if (file && typeof file !== 'string') { // Chỉ upload file mới, không upload URL cũ
            formData.append(`colorImages_${colorIdx}_${imgIdx}`, file);
          }
        });
      }
    });

    try {
      const token = await getToken();
      const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/edit/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật sản phẩm: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Nhóm thuộc tính theo tên
  const groupedAttributes = availableAttributesFromAPI.reduce((groups, attr) => {
    if (!groups[attr.name]) {
      groups[attr.name] = [];
    }
    groups[attr.name].push(attr);
    return groups;
  }, {});

  return (
    <div className="flex-1 h-screen flex flex-col overflow-scroll justify-between text-sm">
      {loading ? <Loading /> : (
        <form onSubmit={handleSubmit} className="w-full md:p-10 p-4 space-y-6 max-w-4xl">
          <h1 className="text-2xl font-semibold mb-6">Chỉnh sửa sản phẩm</h1>
          
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

          {/* BƯỚC 1: Kho màu sắc */}
          <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium text-green-800">BƯỚC 1: Cập nhật kho màu sắc <span className="text-red-500">*</span></h2>
                <p className="text-sm text-green-600">Chỉnh sửa các màu sắc có thể có và ảnh tương ứng</p>
              </div>
              <button 
                type="button" 
                onClick={handleAddColor} 
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                + Thêm màu sắc
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
                                src={typeof color.images[imgIdx] === 'string' ? color.images[imgIdx] : URL.createObjectURL(color.images[imgIdx])}
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
                                <p className="text-xs text-gray-500">Ảnh {imgIdx + 1}</p>
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

          {/* BƯỚC 2: Tạo variants */}
          <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium text-orange-800">BƯỚC 2: Cập nhật biến thể sản phẩm <span className="text-red-500">*</span></h2>
                <p className="text-sm text-orange-600">Tạo các biến thể bằng cách kết hợp màu sắc và thuộc tính</p>
              </div>
              <button 
                type="button" 
                onClick={handleAddVariant} 
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                disabled={availableColors.length === 0}
              >
                + Thêm biến thể
              </button>
            </div>
            
            <div className="space-y-4">
              {variants.map((variant, variantIdx) => (
                <div key={variantIdx} className="p-4 bg-white rounded border">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Biến thể #{variantIdx + 1}</h3>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(variantIdx)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Màu sắc</label>
                      <select 
                        value={variant.selectedColorIndex} 
                        onChange={e => handleVariantChange(variantIdx, 'selectedColorIndex', parseInt(e.target.value))} 
                        className="w-full outline-none py-2 px-3 rounded border border-gray-300"
                      >
                        {availableColors.map((color, colorIdx) => (
                          <option key={colorIdx} value={colorIdx}>{color.name || `Màu ${colorIdx + 1}`}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Chọn thuộc tính từ kho có sẵn */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Chọn thuộc tính</label>
                    {Object.keys(groupedAttributes).length === 0 ? (
                      <div className="text-center py-4 bg-gray-50 rounded border">
                        <p className="text-gray-500">Chưa có thuộc tính nào trong kho.</p>
                        <p className="text-sm text-blue-600">Hãy thêm thuộc tính trong trang "Quản lý thuộc tính"</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {Object.entries(groupedAttributes).map(([attributeName, attributes]) => (
                          <div key={attributeName} className="border rounded p-3">
                            <h4 className="font-medium mb-2">{attributeName}</h4>
                            <div className="flex flex-wrap gap-2">
                              {attributes.map((attr) => {
                                // Đảm bảo so sánh đúng kiểu dữ liệu
                                const isChecked = variant.selectedAttributeIds && 
                                  variant.selectedAttributeIds.includes(attr._id.toString());
                                
                                return (
                                  <label key={attr._id} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => handleVariantAttributeToggle(variantIdx, attr._id.toString())}
                                      className="rounded"
                                    />
                                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">{attr.value}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Giá gốc</label>
                      <input 
                        type="number" 
                        value={variant.price} 
                        onChange={e => handleVariantChange(variantIdx, 'price', e.target.value)} 
                        className="w-full outline-none py-2 px-3 rounded border border-gray-300" 
                        placeholder="VD: 1000000" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Giá khuyến mãi</label>
                      <input 
                        type="number" 
                        value={variant.offerPrice} 
                        onChange={e => handleVariantChange(variantIdx, 'offerPrice', e.target.value)} 
                        className="w-full outline-none py-2 px-3 rounded border border-gray-300" 
                        placeholder="VD: 900000" 
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {variants.length === 0 && (
                <p className="text-orange-600 text-center py-4">
                  {availableColors.length === 0 
                    ? "Cần thêm màu sắc trước khi tạo biến thể." 
                    : "Chưa có biến thể nào. Nhấn \"Thêm biến thể\" để bắt đầu."
                  }
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật sản phẩm'}
            </button>
          </div>
        </form>
      )}
      <Footer />
    </div>
  );
};

export default EditProduct;