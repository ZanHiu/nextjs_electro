"use client";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { formatDate, formatPrice } from "@/utils/format";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import { Tooltip } from "react-tooltip";

const CouponList = () => {
  const { getToken, user, router, currency } = useAppContext();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/coupons/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setCoupons(data.coupons);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCoupons();
    }
  }, [user, getToken]);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = await getToken();
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/coupons/update/${id}`,
        {
          isActive: !currentStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchCoupons();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // const handleDelete = async (id) => {
  //   if (!window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) {
  //     return;
  //   }

  //   try {
  //     const token = await getToken();
  //     const { data } = await axios.delete(
  //       `${process.env.NEXT_PUBLIC_API_URL}/coupons/delete/${id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (data.success) {
  //       toast.success(data.message);
  //       fetchCoupons();
  //     }
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? <Loading /> : <div className="w-full md:p-10 p-4">
        <h1 className="text-2xl font-semibold mb-6">Quản lý mã giảm giá</h1>
        <div className="flex flex-col items-center w-full rounded-md bg-white border border-gray-500/20">
          <div className="overflow-x-auto w-full">
            <table className="table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="px-4 py-2 font-medium truncate w-20">Mã</th>
                <th className="px-4 py-2 font-medium truncate w-24">Loại</th>
                <th className="px-4 py-2 font-medium truncate w-24">Giá trị</th>
                <th className="px-4 py-2 font-medium truncate w-28">Ngày tạo</th>
                <th className="px-4 py-2 font-medium truncate w-20">Số lượng</th>
                <th className="px-4 py-2 font-medium truncate w-32">Điều kiện sử dụng</th>
                <th className="px-4 py-2 font-medium truncate w-32">Trạng thái</th>
                <th className="px-4 py-2 font-medium truncate w-40">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="border-t border-gray-500/20">
                  <td className="px-4 py-2 font-medium truncate" data-tooltip-id="coupon-tooltip" data-tooltip-content={coupon.code}>{coupon.code}</td>
                  <td className="px-4 py-2 truncate" data-tooltip-id="coupon-tooltip" data-tooltip-content={coupon.type === "PERCENTAGE" ? "Phần trăm" : "Số tiền cố định"}>{coupon.type === "PERCENTAGE" ? "Phần trăm" : "Số tiền cố định"}</td>
                  <td className="px-4 py-2 truncate" data-tooltip-id="coupon-tooltip" data-tooltip-content={coupon.type === "PERCENTAGE" ? `${coupon.value}%` : `${formatPrice(coupon.value)}${currency}`}>{coupon.type === "PERCENTAGE" ? `${coupon.value}%` : `${formatPrice(coupon.value)}${currency}`}</td>
                  <td className="px-4 py-2 truncate" data-tooltip-id="coupon-tooltip" data-tooltip-content={`Bắt đầu: ${formatDate(coupon.startDate)} - Kết thúc: ${formatDate(coupon.endDate)}`}> <div>{formatDate(coupon.startDate)}</div> <div>{formatDate(coupon.endDate)}</div> </td>
                  <td className="px-4 py-2 truncate" data-tooltip-id="coupon-tooltip" data-tooltip-content={`Đã dùng: ${coupon.usedCount} - Tối đa: ${coupon.maxUses}`}>{coupon.usedCount}/{coupon.maxUses}</td>
                  <td className="px-4 py-2 truncate" data-tooltip-id="coupon-tooltip" data-tooltip-content={`Đơn tối thiểu: ${formatPrice(coupon.minOrderAmount)}${currency}`}>Tối thiểu {formatPrice(coupon.minOrderAmount)}{currency}</td>
                  <td className="px-4 py-2 truncate">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${coupon.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {coupon.isActive ? "Đang hoạt động" : "Đã khóa"}
                    </span>
                  </td>
                  <td className="px-4 py-2 truncate">
                    <div className="flex gap-2 flex-nowrap">
                      <button 
                        onClick={() => router.push(`/seller/edit-coupon/${coupon._id}`)} 
                        className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-green-600 text-white rounded-md"
                      >
                        <span className="hidden md:block">Sửa</span>
                      </button>
                      <button
                        onClick={() => handleToggleStatus(coupon._id, coupon.isActive)}
                        className={`flex items-center gap-1 px-1.5 md:px-3.5 py-2 ${coupon.isActive ? "bg-red-600" : "bg-blue-600"} text-white rounded-md hover:bg-opacity-80`}
                      >
                        <span className="hidden md:block">{coupon.isActive ? "Khóa" : "Kích hoạt"}</span>
                      </button>
                      {/* <button
                        onClick={() => handleDelete(coupon._id)}
                        className="flex items-center gap-1 px-2 py-2 bg-red-500 text-white rounded-md whitespace-nowrap"
                      >
                        Xóa
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Tooltip id="coupon-tooltip" place="top" effect="solid" multiline={true} />
          </div>
        </div>
      </div>}
      <Footer />
    </div>
  );
};

export default CouponList;
