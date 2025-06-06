'use client'
import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const AddProduct = () => {
  const { getToken, brands, categories } = useAppContext();

  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [views, setViews] = useState('');

  useEffect(() => {
    if (brands.length > 0) setBrand(brands[0]._id);
    if (categories.length > 0) setCategory(categories[0]._id);
  }, [brands, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("brand", brand);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("offerPrice", offerPrice);
    formData.append("views", views);

    for (let i = 0; i < files.length; i++) {
      formData.append(`images`, files[i]);
    }

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
        setPrice('');
        setOfferPrice('');
        setViews('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <h1 className="text-2xl font-semibold mb-6">Add Product</h1>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>

        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">

            {[...Array(4)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input onChange={(e) => {
                  const updatedFiles = [...files];
                  updatedFiles[index] = e.target.files[0];
                  setFiles(updatedFiles);
                }} type="file" id={`image${index}`} hidden />
                <Image
                  key={index}
                  className="max-w-24 cursor-pointer"
                  src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}

          </div>
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="views">
            Views
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
              Product Price
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
              Offer Price
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
              Brand
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
              Category
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

        <button type="submit" className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded">
          ADD
        </button>
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default AddProduct;
