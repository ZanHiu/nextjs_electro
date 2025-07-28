"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import axios from "axios";
import toast from "react-hot-toast";
import { formatPrice } from "@/utils/format";
import { Tooltip } from "react-tooltip";
import Loading from "@/components/common/Loading";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

const ProductList = () => {

  const { router, getToken, user, currency } = useAppContext()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null);

  const fetchSellerProduct = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/seller-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      if (data.success) {
        setProducts(data.products)
        setLoading(false)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (user) {
      fetchSellerProduct();
    }
  }, [user, getToken]);

  // const handleDelete = async (id) => {
  //   if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
  //     try {
  //       const token = await getToken();
  //       const { data } = await axios.delete(
  //         `${process.env.NEXT_PUBLIC_API_URL}/products/delete/${id}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       if (data.success) {
  //         toast.success(data.message);
  //         // Refresh product list after deletion
  //         fetchSellerProduct();
  //       } else {
  //         toast.error(data.message);
  //       }
  //     } catch (error) {
  //       toast.error(error.message);
  //     }
  //   }
  // };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = await getToken();
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/products/update/${id}`,
        { isActive: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchSellerProduct();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex-1 h-screen flex flex-col overflow-scroll justify-between text-sm">
      {loading ? <Loading /> : <div className="w-full md:p-10 p-4">
        <h1 className="text-2xl font-semibold mb-6">Quản lý sản phẩm</h1>
        <div className="flex flex-col items-center w-full rounded-md bg-white border border-gray-500/20">
          <div className="overflow-x-auto w-full">
            <table className="table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="w-2/5 md:w-1/4 px-4 py-3 font-medium truncate">Sản phẩm</th>
                <th className="w-1/5 md:w-1/6 px-4 py-3 font-medium truncate max-sm:hidden">Thương hiệu</th>
                <th className="w-1/5 md:w-1/6 px-4 py-3 font-medium truncate max-sm:hidden">Danh mục</th>
                <th className="w-1/4 px-4 py-3 font-medium truncate max-sm:hidden">Hoạt động</th>
                <th className="w-1/4 px-4 py-3 font-medium truncate">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {products.map((product) => (
                <React.Fragment key={product._id}>
                  <tr
                    className={`border-t border-gray-500/20 cursor-pointer hover:bg-gray-50 ${expandedId === product._id ? 'bg-gray-100' : ''}`}
                    onClick={() => Array.isArray(product.variants) && product.variants.length > 0 ? setExpandedId(expandedId === product._id ? null : product._id) : null}
                  >
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate" data-tooltip-id="product-tooltip" data-tooltip-content={product.name}>
                      <div className="bg-gray-500/10 rounded p-2">
                        <Image
                          src={Array.isArray(product.variants) && product.variants.length > 0 && product.variants[0].images && product.variants[0].images.length > 0 ? product.variants[0].images[0] : (product.image && product.image[0])}
                          alt="product Image"
                          className="w-16"
                          width={1280}
                          height={720}
                        />
                      </div>
                      <span className="truncate w-full">{product.name}</span>
                      {Array.isArray(product.variants) && product.variants.length > 0 && (
                        <span className={`ml-2 text-xs text-gray-500 ${expandedId === product._id ? "rotate-180" : ""}`}>
                          <KeyboardArrowDownOutlinedIcon sx={{ fontSize: 20 }} />
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 max-sm:hidden truncate" data-tooltip-id="product-tooltip" data-tooltip-content={product.brand.name}>{product.brand.name}</td>
                    <td className="px-4 py-3 max-sm:hidden truncate" data-tooltip-id="product-tooltip" data-tooltip-content={product.category.name}>{product.category.name}</td>
                    <td className="px-4 py-3 max-sm:hidden">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {product.isActive ? "Đang hoạt động" : "Đã khóa"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 flex-nowrap">
                        <button onClick={e => {e.stopPropagation(); router.push(`/product/${product._id}`)}} className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-orange-600 text-white rounded-md">
                          <span className="hidden md:block">Xem</span>
                        </button>
                        <button onClick={e => {e.stopPropagation(); router.push(`/seller/edit-product/${product._id}`)}} className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-green-600 text-white rounded-md">
                          <span className="hidden md:block">Sửa</span>
                        </button>
                        <button
                          onClick={e => {e.stopPropagation(); handleToggleStatus(product._id, product.isActive)}}
                          className={`flex items-center gap-1 px-1.5 md:px-3.5 py-2 ${product.isActive ? "bg-red-600" : "bg-blue-600"} text-white rounded-md hover:bg-opacity-80`}
                        >
                          {product.isActive ? "Khóa" : "Kích hoạt"}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Table Collapsible Row */}
                  {Array.isArray(product.variants) && product.variants.length > 0 && expandedId === product._id && (
                    <tr>
                      <td colSpan={5} className="p-0 bg-transparent">
                        <div className="p-2">
                          {/* Hiển thị specs nếu có */}
                          {product.specs && Object.keys(product.specs).some(key => product.specs[key]) && (
                            <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded">
                              <div className="font-semibold text-gray-700 mb-1">Thông tin cơ bản:</div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-xs text-gray-700">
                                {product.specs.cpu && <div><span className="font-medium">CPU:</span> {product.specs.cpu}</div>}
                                {product.specs.vga && <div><span className="font-medium">VGA:</span> {product.specs.vga}</div>}
                                {product.specs.os && <div><span className="font-medium">Hệ điều hành:</span> {product.specs.os}</div>}
                                {product.specs.pin && <div><span className="font-medium">Pin:</span> {product.specs.pin}</div>}
                                {product.specs.manhinh && <div><span className="font-medium">Màn hình:</span> {product.specs.manhinh}</div>}
                                {product.specs.camera && <div><span className="font-medium">Camera:</span> {product.specs.camera}</div>}
                              </div>
                            </div>
                          )}
                          <table className="w-full border border-orange-200 rounded-lg overflow-hidden">
                            <thead className="text-left">
                              <tr className="bg-orange-50 text-xs font-semibold text-gray-700 border-b border-orange-200">
                                <th className="pl-6 py-2 rounded-l-lg">Ảnh</th>
                                <th className="py-2">Màu</th>
                                <th className="py-2">Ram</th>
                                <th className="py-2">Rom</th>
                                <th className="py-2">Giá gốc</th>
                                <th className="py-2 rounded-r-lg">Giá giảm</th>
                              </tr>
                            </thead>
                            <tbody>
                              {product.variants.map((variant, idx) => (
                                <tr key={variant._id} className="bg-white text-xs border-b border-gray-100 last:border-b-0">
                                  {/* Ảnh */}
                                  <td className="pl-6 py-3 flex items-center gap-2 rounded-l-lg">
                                    {Array.isArray(variant.images) && variant.images.length > 0 ? (
                                      variant.images.map((img, i) => (
                                        <Image key={i} src={img} alt="variant" width={40} height={40} className="rounded border shadow-sm object-cover bg-white" />
                                      ))
                                    ) : null}
                                  </td>
                                  {/* Màu */}
                                  <td className="py-3 align-middle">
                                    {variant.attributes && variant.attributes.color && (
                                      <span className="px-2 py-0.5 bg-orange-100 border border-orange-300 rounded-full text-orange-700 font-semibold text-xs shadow-sm whitespace-nowrap">{variant.attributes.color}</span>
                                    )}
                                  </td>
                                  {/* Ram */}
                                  <td className="py-3 align-middle">
                                    {variant.attributes.ram && <div><span className="font-medium"></span> {variant.attributes.ram}</div>}
                                  </td>
                                  {/* Rom */}
                                  <td className="py-3 align-middle">
                                    {variant.attributes.rom && <div><span className="font-medium"></span> {variant.attributes.rom}</div>}
                                  </td>
                                  {/* Giá gốc */}
                                  <td className="py-3 align-middle">
                                    <span className="text-xs font-semibold text-gray-500 line-through">{formatPrice(variant.price)}{currency}</span>
                                  </td>
                                  {/* Giá giảm */}
                                  <td className="py-3 align-middle rounded-r-lg">
                                    <span className="text-sm font-bold text-orange-600">{formatPrice(variant.offerPrice)}{currency}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <Tooltip id="product-tooltip" place="top" effect="solid" multiline={true} />
          </div>
        </div>
      </div>}
      <Footer />
    </div>
  );
};

export default ProductList;
