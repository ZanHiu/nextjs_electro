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

  // Danh sách tên danh mục đặc biệt (có thể thay bằng id nếu cần)
  const specialCategoryNames = ["Điện thoại", "Máy tính", "Máy tính bảng"];

  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [views, setViews] = useState('');
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [variants, setVariants] = useState([]);
  const [isSpecialCategory, setIsSpecialCategory] = useState(false);
  const [specs, setSpecs] = useState({
    cpu: '',
    vga: '',
    os: '',
    pin: '',
    manhinh: '',
    camera: '',
  });

  useEffect(() => {
    if (brands.length > 0) setBrand(brands[0]._id);
    if (categories.length > 0) setCategory(categories[0]._id);
  }, [brands, categories]);

  useEffect(() => {
    // Kiểm tra nếu category hiện tại là đặc biệt
    const selectedCategory = categories.find((cat) => cat._id === category);
    if (selectedCategory && specialCategoryNames.includes(selectedCategory.name.trim())) {
      setIsSpecialCategory(true);
    } else {
      setIsSpecialCategory(false);
    }
  }, [category, categories]);

  // Thêm màu mới
  const handleAddColor = () => {
    setColors([
      ...colors,
      {
        name: '',
        images: [],
      },
    ]);
  };

  const handleRemoveColor = (idx) => {
    setColors(colors.filter((_, i) => i !== idx));
  };

  const handleColorChange = (idx, value) => {
    const updated = [...colors];
    updated[idx].name = value;
    setColors(updated);
  };

  const handleColorImageChange = (idx, imgIdx, file) => {
    const updated = [...colors];
    const images = updated[idx].images ? [...updated[idx].images] : [];
    images[imgIdx] = file;
    updated[idx].images = images;
    setColors(updated);
  };

  const handleSpecsChange = (field, value) => {
    setSpecs((prev) => ({ ...prev, [field]: value }));
  };

  // Thêm variant mới
  const handleAddVariant = () => {
    setVariants([
      ...variants,
      isSpecialCategory
        ? {
            color: '',
            price: '',
            offerPrice: '',
            ram: '',
            rom: '',
            cpu: '',
            vga: '',
            os: '',
            pin: '',
            manhinh: '',
            camera: '',
          }
        : {
            color: '',
            price: '',
            offerPrice: '',
          },
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (colors.length === 0) {
      toast.error('Cần thêm ít nhất 1 màu cho sản phẩm!');
      return;
    }
    for (let i = 0; i < colors.length; i++) {
      if (!colors[i].images || colors[i].images.length === 0 || !colors[i].images[0]) {
        toast.error(`Màu thứ ${i + 1} chưa có ảnh!`);
        return;
      }
    }
    if (variants.length === 0) {
      toast.error('Cần thêm ít nhất 1 biến thể cho sản phẩm!');
      return;
    }
    setLoading(true);

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("brand", brand);
    formData.append("category", category);
    formData.append("views", views);

    for (let i = 0; i < files.length; i++) {
      formData.append(`images`, files[i]);
    }

    // Chỉ gửi các trường optional nếu có giá trị
    const filteredVariants = variants.map((variant) => {
      let result = {
        color: variant.color,
        price: variant.price,
        offerPrice: variant.offerPrice,
        ram: variant.ram,
        rom: variant.rom,
      };
      // Xóa ram/rom nếu không có
      if (!result.ram) delete result.ram;
      if (!result.rom) delete result.rom;
      return result;
    });
    formData.append('variants', JSON.stringify(filteredVariants));

    // Nếu là danh mục đặc biệt, gửi specs lên backend
    if (isSpecialCategory) {
      formData.append('specs', JSON.stringify(specs));
    }

    colors.forEach((color, cIdx) => {
      if (color.images && color.images.length > 0) {
        color.images.forEach((file, imgIdx) => {
          if (file) {
            formData.append(`colorImages_${cIdx}_${imgIdx}`, file);
          }
        });
      }
    });

    formData.append('colors', JSON.stringify(colors));

    try {
      const token = await getToken();
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      if (data.success) {
        toast.success(data.message);
        setFiles([]);
        setName('');
        setDescription('');
        setBrand(brands[0]?._id || '');
        setCategory(categories[0]?._id || '');
        setViews('');
        setColors([]);
        setVariants([]);
        setSpecs({ cpu: '', vga: '', os: '', pin: '', manhinh: '', camera: '' });
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
        <form onSubmit={handleSubmit} className="w-full md:p-10 p-4 space-y-5 max-w-lg">
          <h1 className="text-2xl font-semibold mb-6">Thêm sản phẩm</h1>
          <div className="flex flex-col gap-1 max-w-md">
            <label className="text-base font-medium" htmlFor="product-name">
              Tên sản phẩm
            </label>
            <input
              id="product-name"
              type="text"
              placeholder="Nhập tên sản phẩm"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>

          <div className="flex flex-col gap-1 max-w-md">
            <label
              className="text-base font-medium"
              htmlFor="product-description"
            >
              Mô tả sản phẩm
            </label>
            <textarea
              id="product-description"
              rows={4}
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
              placeholder="Nhập mô tả sản phẩm"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              required
            ></textarea>
          </div>

          {/* Chọn thương hiệu và danh mục lên đầu */}
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-base font-medium" htmlFor="brand">
                Thương hiệu
              </label>
              <select
                id="brand"
                className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
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
            <div className="flex flex-col gap-1">
              <label className="text-base font-medium" htmlFor="category">
                Danh mục
              </label>
              <select
                id="category"
                className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
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
          </div>

          {/* Thông tin cơ bản (chỉ hiện với danh mục đặc biệt) */}
          {isSpecialCategory && (
            <div className="border rounded p-3 bg-gray-50 mb-6">
              <h2 className="text-base font-semibold mb-2">Thông tin cơ bản</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">CPU</label>
                  <input type="text" value={specs.cpu} onChange={e => handleSpecsChange('cpu', e.target.value)} className="outline-none py-2 px-3 rounded border border-gray-500/40 w-full" placeholder="VD: Intel i5" />
                </div>
                <div>
                  <label className="block text-sm mb-1">VGA</label>
                  <input type="text" value={specs.vga} onChange={e => handleSpecsChange('vga', e.target.value)} className="outline-none py-2 px-3 rounded border border-gray-500/40 w-full" placeholder="VD: RTX 3050" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Hệ điều hành</label>
                  <input type="text" value={specs.os} onChange={e => handleSpecsChange('os', e.target.value)} className="outline-none py-2 px-3 rounded border border-gray-500/40 w-full" placeholder="VD: Android, Windows" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Pin</label>
                  <input type="text" value={specs.pin} onChange={e => handleSpecsChange('pin', e.target.value)} className="outline-none py-2 px-3 rounded border border-gray-500/40 w-full" placeholder="VD: 5000mAh" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Màn hình</label>
                  <input type="text" value={specs.manhinh} onChange={e => handleSpecsChange('manhinh', e.target.value)} className="outline-none py-2 px-3 rounded border border-gray-500/40 w-full" placeholder="VD: 6.5 inch" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Camera</label>
                  <input type="text" value={specs.camera} onChange={e => handleSpecsChange('camera', e.target.value)} className="outline-none py-2 px-3 rounded border border-gray-500/40 w-full" placeholder="VD: 50MP" />
                </div>
              </div>
            </div>
          )}

          <div className="my-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-base font-medium">Màu sắc sản phẩm <span className="text-red-500">*</span></p>
              <button type="button" onClick={handleAddColor} className="px-3 py-1 bg-orange-500 text-white rounded">Thêm màu</button>
            </div>
            {colors.length === 0 && <p className="text-red-500 text-sm mb-2">Cần ít nhất 1 màu cho sản phẩm</p>}
            <div className="flex flex-col gap-4">
              {colors.map((color, idx) => (
                <div key={idx} className="border rounded p-3 bg-gray-50">
                  <div className="flex flex-col gap-4 mb-2">
                    <div className="flex flex-col w-full">
                      <label className="block text-sm mb-1">Tên màu</label>
                      <input type="text" value={color.name} onChange={e => handleColorChange(idx, e.target.value)} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 w-full" placeholder="VD: Đen, Trắng..." />
                    </div>
                    <div className="flex flex-col w-full">
                      <label className="block text-sm mb-1">Ảnh màu (bắt buộc)</label>
                      <div className="flex gap-3 flex-row items-center">
                        {[...Array(4)].map((_, imgIdx) => (
                          <label key={imgIdx} htmlFor={`color-image-${idx}-${imgIdx}`} className="block">
                            <input type="file" id={`color-image-${idx}-${imgIdx}`} hidden onChange={e => handleColorImageChange(idx, imgIdx, e.target.files[0])} />
                            <Image
                              src={color.images && color.images[imgIdx] ? URL.createObjectURL(color.images[imgIdx]) : assets.upload_area}
                              alt=""
                              width={80}
                              height={80}
                              className="rounded cursor-pointer border mx-auto"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col flex-end">
                      <button type="button" onClick={() => handleRemoveColor(idx)} className="h-10 px-4 py-2 bg-red-500 text-white rounded mt-6">Xóa</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Biến thể sản phẩm */}
          <div className="my-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-base font-medium">Biến thể sản phẩm <span className="text-red-500">*</span></p>
              <button type="button" onClick={handleAddVariant} className="px-3 py-1 bg-orange-500 text-white rounded">Thêm biến thể</button>
            </div>
            {variants.length === 0 && <p className="text-red-500 text-sm mb-2">Cần ít nhất 1 biến thể cho sản phẩm</p>}
            <div className="flex flex-col gap-4">
              {variants.map((variant, idx) => (
                <div key={idx} className="border rounded p-3 bg-gray-50">
                  <div className="flex flex-col gap-4 mb-2">
                    <div className="flex flex-col w-full">
                      <label className="block text-sm mb-1">Màu sắc</label>
                      <select value={variant.color} onChange={e => handleVariantChange(idx, 'color', e.target.value)} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 w-full">
                        <option value="">Chọn màu</option>
                        {colors.map((color, cidx) => (
                          <option key={cidx} value={color.name}>{color.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col-2 gap-5">
                      <div>
                        <label className="block text-sm mb-1">Giá</label>
                        <input type="number" placeholder="0" value={variant.price} onChange={e => handleVariantChange(idx, 'price', e.target.value)} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 w-full" />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Giá khuyến mãi</label>
                        <input type="number" placeholder="0" value={variant.offerPrice} onChange={e => handleVariantChange(idx, 'offerPrice', e.target.value)} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 w-full" />
                      </div>
                    </div>
                    {/* Nếu là danh mục đặc biệt thì hiển thị ram/rom */}
                    {isSpecialCategory && (
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <div>
                          <label className="block text-sm mb-1">RAM</label>
                          <input type="text" value={variant.ram || ''} onChange={e => handleVariantChange(idx, 'ram', e.target.value)} className="outline-none py-2 px-3 rounded border border-gray-500/40 w-full" placeholder="VD: 8GB" />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">ROM</label>
                          <input type="text" value={variant.rom || ''} onChange={e => handleVariantChange(idx, 'rom', e.target.value)} className="outline-none py-2 px-3 rounded border border-gray-500/40 w-full" placeholder="VD: 128GB" />
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col flex-end">
                      <button type="button" onClick={() => handleRemoveVariant(idx)} className="h-10 px-4 py-2 bg-red-500 text-white rounded mt-6">Xóa</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-base font-medium" htmlFor="views">
              Lượt xem
            </label>
            <input
              id="views"
              type="number"
              placeholder="0"
              className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setViews(e.target.value)}
              value={views}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded hover:bg-orange-700 disabled:bg-gray-400"
          >
            {loading ? "Đang thêm..." : "Thêm"}
          </button>
        </form>
      )}
      <Footer />
    </div>
  );
};

export default AddProduct;
