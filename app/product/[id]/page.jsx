"use client";
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/product/ProductCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReviewSection from "@/components/social/ReviewSection";
import CommentSection from "@/components/social/CommentSection";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/common/Loading";
import { useAppContext } from "@/context/AppContext";
import { formatPrice } from "@/utils/format";
import { VariantLabels } from "@/utils/constants";
import axios from "axios";
import toast from "react-hot-toast";
import Tabs from "@/components/common/Tabs";

const Product = () => {
  const { id } = useParams();
  const { currency, router, products, addToCart, reviews, fetchReviews, getReviewAmount, getReviewCount } = useAppContext();
  const [mainImage, setMainImage] = useState(null);
  const [productData, setProductData] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [activeVariant, setActiveVariant] = useState(null);
  const [activeTab, setActiveTab] = useState('reviews');

  // Lấy dữ liệu sản phẩm và variants
  const fetchProductData = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
      );
      if (data.success) {
        setProductData(data.product);
        setVariants(data.variants || []);
        // Nếu có variants, chọn mặc định variant đầu tiên
        if (data.variants && data.variants.length > 0) {
          setActiveVariant(data.variants[0]);
          setSelectedAttributes(data.variants[0].attributes);
          setMainImage(data.variants[0].images[0]);
        } else {
          setMainImage(data.product.image[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Khi chọn thuộc tính (color, storage, ...)
  const handleSelectAttribute = (attrName, value) => {
    const newAttrs = { ...selectedAttributes, [attrName]: value };
    setSelectedAttributes(newAttrs);
    // Tìm variant phù hợp
    const found = variants.find(v => {
      return Object.entries(newAttrs).every(([k, v2]) => v.attributes[k] === v2);
    });
    if (found) {
      setActiveVariant(found);
      setMainImage(found.images[0]);
    }
  };

  // Lấy variant đầu tiên nếu có
  const firstVariant = variants && variants.length > 0 ? variants[0] : null;
  // Nếu chưa chọn thuộc tính, mặc định chọn variant đầu tiên
  useEffect(() => {
    if (firstVariant && !activeVariant) {
      setActiveVariant(firstVariant);
      setSelectedAttributes(firstVariant.attributes);
      setMainImage(firstVariant.images[0]);
    }
  }, [variants]);

  useEffect(() => {
    fetchProductData();
    fetchReviews(id, "product");
  }, [id]);

  // Lấy danh sách thuộc tính có trong variants
  const attributeOptions = {};
  variants.forEach(variant => {
    Object.entries(variant.attributes).forEach(([key, value]) => {
      if (!attributeOptions[key]) attributeOptions[key] = new Set();
      attributeOptions[key].add(value);
    });
  });

  return productData ? (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="px-5 lg:px-16 xl:px-20">
            <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
              <Image
                src={mainImage || (firstVariant && firstVariant.images[0]) || (productData.image && productData.image[0])}
                alt="alt"
                className="w-full h-auto object-cover mix-blend-multiply"
                width={1280}
                height={720}
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {(activeVariant ? activeVariant.images : (firstVariant && firstVariant.images) || productData.image).map((image, index) => (
                <div
                  key={index}
                  onClick={() => setMainImage(image)}
                  className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
                >
                  <Image
                    src={image}
                    alt="alt"
                    className="w-full h-auto object-cover mix-blend-multiply"
                    width={1280}
                    height={720}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-medium text-gray-800/90 mb-2">
              {productData.name}
            </h1>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((star) => (
                  <Image
                    key={star}
                    src={star <= Math.round(getReviewAmount(reviews)) ? assets.star_icon : assets.star_dull_icon}
                    alt="star"
                    className="h-4 w-4"
                    width={16}
                    height={16}
                  />
                ))}
              </div>
              <span className="text-gray-600 text-sm">{(getReviewAmount(reviews)).toFixed(1)} / 5 ({getReviewCount(reviews)} lượt đánh giá)</span>
            </div>
            <p className="text-gray-600 mt-3">{productData.description}</p>
            <div className="flex flex-col gap-4 mt-4">
              {/* Hiển thị các lựa chọn thuộc tính */}
              {Object.entries(attributeOptions).map(([attr, values]) => (
                <div key={attr} className="flex flex-col">
                  <span className="text-sm text-gray-600 mb-1">{VariantLabels[attr] || attr}</span>
                  <div className="flex gap-2">
                    {[...values].map(val => (
                      <button
                        key={val}
                        className={`px-3 py-1 rounded border ${selectedAttributes[attr] === val ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-800/80'}`}
                        onClick={() => handleSelectAttribute(attr, val)}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-3xl font-medium mt-6">
              {formatPrice(activeVariant ? activeVariant.offerPrice : (firstVariant ? firstVariant.offerPrice : productData.offerPrice))}{currency}
              <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                {formatPrice(activeVariant ? activeVariant.price : (firstVariant ? firstVariant.price : productData.price))}{currency}
              </span>
            </p>
            <hr className="bg-gray-600 my-6" />
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse w-full max-w-96">
                <tbody>
                  <tr>
                    <td className="text-gray-600 font-medium">{productData.brand?.name ? 'Thương hiệu' : ''}</td>
                    <td className="text-gray-800/50">{productData.brand?.name || ''}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-600 font-medium">{productData.category?.name ? 'Danh mục' : ''}</td>
                    <td className="text-gray-800/50">{productData.category?.name || ''}</td>
                  </tr>
                  {Object.entries(attributeOptions).map(([attr, values]) => (
                    <tr key={attr}>
                      <td className="text-gray-600 font-medium">{VariantLabels[attr] || attr}</td>
                      <td className="text-gray-800/50 ">{selectedAttributes[attr] || '-'}</td>
                  </tr>
                  ))}
                  {productData.specs?.cpu && (
                    <tr>
                      <td className="text-gray-600 font-medium">CPU</td>
                      <td className="text-gray-800/50">{productData.specs.cpu}</td>
                    </tr>
                  )}
                  {productData.specs?.vga && (
                    <tr>
                      <td className="text-gray-600 font-medium">VGA</td>
                      <td className="text-gray-800/50">{productData.specs.vga}</td>
                    </tr>
                  )}
                  {productData.specs?.os && (
                    <tr>
                      <td className="text-gray-600 font-medium">Hệ điều hành</td>
                      <td className="text-gray-800/50">{productData.specs.os}</td>
                    </tr>
                  )}
                  {productData.specs?.pin && (
                    <tr>
                      <td className="text-gray-600 font-medium">Pin</td>
                      <td className="text-gray-800/50">{productData.specs.pin}</td>
                    </tr>
                  )}
                  {productData.specs?.manhinh && (
                    <tr>
                      <td className="text-gray-600 font-medium">Màn hình</td>
                      <td className="text-gray-800/50">{productData.specs.manhinh}</td>
                    </tr>
                  )}
                  {productData.specs?.camera && (
                    <tr>
                      <td className="text-gray-600 font-medium">Camera</td>
                      <td className="text-gray-800/50">{productData.specs.camera}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center mt-10 gap-4">
              <button
                onClick={() => {
                  if (variants.length > 0 && !activeVariant) {
                    toast.error("Vui lòng chọn đầy đủ thuộc tính sản phẩm!");
                    return;
                  }
                  addToCart(productData._id, activeVariant ? activeVariant._id : null);
                }}
                className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
              >
                Thêm vào giỏ hàng
              </button>
              <button
                onClick={() => {
                  if (variants.length > 0 && !activeVariant) {
                    toast.error("Vui lòng chọn đầy đủ thuộc tính sản phẩm!");
                    return;
                  }
                  addToCart(productData._id, activeVariant ? activeVariant._id : null);
                  router.push("/cart");
                }}
                className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <Tabs
            tabs={[
              { key: "reviews", label: "Đánh giá sản phẩm" },
              { key: "comments", label: "Bình luận" }
            ]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <div className="mt-6">
            {activeTab === 'reviews' ? (
              <ReviewSection productId={productData._id} />
            ) : (
              <CommentSection targetId={productData._id} type="product" />
            )}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-4 mt-16">
            <p className="text-3xl font-medium">
              <span className="font-medium text-orange-600">Sản phẩm</span> nổi bật {" "}
            </p>
            <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
            {products.slice(0, 5).map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
          <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
            Xem thêm
          </button>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default Product;
