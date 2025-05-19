"use client";
import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";

const EditCategory = () => {
  const { id } = useParams();
  const { getToken, categories, fetchCategoryData, router } =
    useAppContext();

  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cateId, setCateId] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [views, setViews] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      await fetchCategoryData(); // Refresh categories data
      if (categories.length > 0) {
        const category = categories.find((p) => p._id === id);
        if (category) {
          setName(category.name);
          setDescription(category.description);
          setCateId(category.cateId);
          setExistingImages(category.image);
          setViews(category.views);
        }
      }
    };

    fetchData();
  }, [id, categories.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("cateId", Number(cateId));
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
        `${process.env.NEXT_PUBLIC_API_URL}/categories/edit/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        await fetchCategoryData();
        toast.success(data.message);
        router.push('/seller/categories');
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
        <h1 className="text-2xl font-semibold mb-6">Edit Category</h1>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="category-name">
            Category Name
          </label>
          <input
            id="category-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>

        <div>
          <p className="text-base font-medium">Category Images</p>
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
                    <Image
                      src={assets.delete_icon}
                      alt=""
                      width={10}
                      height={10}
                    />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="category-description"
          >
            Category Description
          </label>
          <textarea
            id="category-description"
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
            <label className="text-base font-medium" htmlFor="category-id">
              Category Id
            </label>
            <input
              id="category-id"
              type="number"
              placeholder="Type here"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCateId(e.target.value)}
              value={cateId}
              required
            />
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

export default EditCategory;
