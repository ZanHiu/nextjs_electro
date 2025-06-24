"use client";
import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

const EditBrand = () => {
  const { id } = useParams();
  const { getToken, brands, fetchBrandData, router } =
    useAppContext();

  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brandId, setBrandId] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [views, setViews] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      await fetchBrandData(); // Refresh brands data
      if (brands.length > 0) {
        const brand = brands.find((p) => p._id === id);
        if (brand) {
          setName(brand.name);
          setDescription(brand.description);
          setBrandId(brand.brandId);
          setExistingImages(brand.image);
          setViews(brand.views);
        }
      }
    };

    fetchData();
  }, [id, brands.length, getToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("brandId", Number(brandId));
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
        `${process.env.NEXT_PUBLIC_API_URL}/brands/edit/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        await fetchBrandData();
        toast.success(data.message);
        router.push('/seller/brands');
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
        <h1 className="text-2xl font-semibold mb-6">Edit Brand</h1>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="brand-name">
            Brand Name
          </label>
          <input
            id="brand-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>

        <div>
          <p className="text-base font-medium">Brand Images</p>
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
            htmlFor="brand-description"
          >
            Brand Description
          </label>
          <textarea
            id="brand-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-5">
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
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium" htmlFor="brand-id">
              Brand Id
            </label>
            <input
              id="brand-id"
              type="number"
              placeholder="Type here"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setBrandId(e.target.value)}
              value={brandId}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded"
        >
          UPDATE
        </button>
      </form>
    </div>
  );
};

export default EditBrand;
