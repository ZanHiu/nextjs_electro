"use client";
import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

const EditProduct = () => {
  const { id } = useParams();
  const { getToken, brands, categories, products, fetchProductData, router } =
    useAppContext();

  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [views, setViews] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      await fetchProductData(); // Refresh products data
      if (products.length > 0) {
        const product = products.find((p) => p._id === id);
        if (product) {
          setName(product.name);
          setDescription(product.description);
          setBrand(product.brand);
          setCategory(product.category);
          setPrice(product.price);
          setOfferPrice(product.offerPrice);
          setExistingImages(product.image);
          setViews(product.views);
        }
      }
    };

    fetchData();
  }, [id, products.length, getToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("brand", brand);
    formData.append("category", category);
    formData.append("price", Number(price));
    formData.append("offerPrice", Number(offerPrice));
    formData.append("views", Number(views));

    // Append new images if any
    for (let i = 0; i < files.length; i++) {
      if (files[i]) {
        formData.append(`images`, files[i]);
      }
    }

    // Append existing images
    formData.append("existingImages", JSON.stringify(existingImages));

    try {
      const token = await getToken();
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/products/edit/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        await fetchProductData();
        toast.success(data.message);
        router.push('/seller/products');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedExistingImages = [...existingImages];
    updatedExistingImages.splice(index, 1);
    setExistingImages(updatedExistingImages);
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <h1 className="text-2xl font-semibold mb-6">Sửa sản phẩm</h1>
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

        <div>
          <p className="text-base font-medium">Ảnh sản phẩm</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="relative group">
                <label htmlFor={`image${index}`}>
                  <input
                    onChange={(e) => {
                      const updatedFiles = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }}
                    type="file"
                    id={`image${index}`}
                    hidden
                  />
                  <Image
                    className="max-w-24 cursor-pointer"
                    src={
                      files[index]
                        ? URL.createObjectURL(files[index])
                        : existingImages[index] || assets.upload_area
                    }
                    alt=""
                    width={100}
                    height={100}
                  />
                </label>
                {(files[index] || existingImages[index]) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (files[index]) {
                        const updatedFiles = [...files];
                        updatedFiles[index] = null;
                        setFiles(updatedFiles);
                      } else if (existingImages[index]) {
                        handleRemoveImage(index);
                      }
                    }}
                    className="absolute -top-2 -right-2 p-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-gray-500 hover:text-red-500 hover:border-red-500 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-sm"
                  >
                    <ClearOutlinedIcon sx={{ fontSize: 10 }} />
                  </button>
                )}
              </div>
            ))}
          </div>
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

        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium" htmlFor="product-price">
              Giá sản phẩm
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium" htmlFor="offer-price">
              Giá khuyến mãi
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
            />
          </div>
        </div>

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

        <button
          type="submit"
          className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded"
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
