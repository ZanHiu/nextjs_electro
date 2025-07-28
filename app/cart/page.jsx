"use client";
import React from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/ecommerce/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import { useAppContext } from "@/context/AppContext";
import { formatPrice } from "@/utils/format";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const Cart = () => {

  const { currency, router, products, cartItems, addToCart, updateCartQuantity, getCartCount } = useAppContext();

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
            <p className="text-2xl md:text-3xl text-gray-500">
              <span className="font-medium text-orange-600">Giỏ hàng</span> của bạn
            </p>
            <p className="text-lg md:text-xl text-gray-500/80">{getCartCount()} mặt hàng</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="text-left">
                <tr>
                  <th className="text-nowrap pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Chi tiết sản phẩm
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Giá
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Số lượng
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Tổng cộng
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(cartItems).map((itemKey) => {
                  // Parse key: "productId|variantId" hoặc "productId|"
                  const [productId, variantId] = itemKey.split('|');
                  const product = products.find(product => product._id === productId);
                  if (!product || cartItems[itemKey] <= 0) return null;
                  // Nếu có variantId, lấy variant tương ứng
                  const variant = variantId ? (product.variants || []).find(v => v._id === variantId) : null;
                  const displayImage = variant && variant.images && variant.images.length > 0 ? variant.images[0] : (product.image && product.image[0]);
                  const displayName = product.name + (variant ? ` (${Object.values(variant.attributes).join(', ')})` : '');
                  const displayPrice = variant ? variant.offerPrice : product.offerPrice;
                  const displayOriginPrice = variant ? variant.price : product.price;
                  return (
                    <tr key={itemKey}>
                      <td className="flex items-center gap-4 py-4 md:px-4 px-1">
                        <div>
                          <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
                            <Image
                              src={displayImage}
                              alt={displayName}
                              className="w-16 h-auto object-cover mix-blend-multiply"
                              width={1280}
                              height={720}
                            />
                          </div>
                          <button
                            className="md:hidden text-xs text-orange-600 mt-1"
                            onClick={() => updateCartQuantity(itemKey, 0)}
                          >
                            Xóa
                          </button>
                        </div>
                        <div className="text-sm hidden md:block">
                          <p className="text-gray-800">{displayName}</p>
                          {variant && (
                            <p className="text-xs text-gray-500/80">{Object.entries(variant.attributes).map(([k,v]) => `${k}: ${v}`).join(', ')}</p>
                          )}
                          <button
                            className="text-xs text-orange-600 mt-1"
                            onClick={() => updateCartQuantity(itemKey, 0)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                      <td className="py-4 md:px-4 px-1 text-gray-600">
                        <span>{formatPrice(displayPrice)}{currency}</span>
                        {displayOriginPrice > displayPrice && (
                          <span className="ml-2 text-xs text-gray-400 line-through">{formatPrice(displayOriginPrice)}{currency}</span>
                        )}
                      </td>
                      <td className="py-4 md:px-4 px-1">
                        <div className="flex items-center md:gap-2 gap-1">
                          <button onClick={() => updateCartQuantity(itemKey, cartItems[itemKey] - 1)}>
                            <ArrowLeftIcon sx={{ fontSize: 20 }} />
                          </button>
                          <input onChange={e => updateCartQuantity(itemKey, Number(e.target.value))} type="number" value={cartItems[itemKey]} className="w-8 border text-center appearance-none"></input>
                          <button onClick={() => updateCartQuantity(itemKey, cartItems[itemKey] + 1)}>
                            <ArrowRightIcon sx={{ fontSize: 20 }} />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 md:px-4 px-1 text-gray-600">{formatPrice(displayPrice * cartItems[itemKey])}{currency}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button onClick={()=> router.push('/all-products')} className="group flex items-center mt-6 gap-2 text-orange-600">
            <Image
              className="group-hover:-translate-x-1 transition"
              src={assets.arrow_right_icon_colored}
              alt="arrow_right_icon_colored"
            />
            Tiếp tục mua sắm
          </button>
        </div>
        <OrderSummary />
      </div>
    </>
  );
};

export default Cart;
