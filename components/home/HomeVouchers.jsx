"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import { formatDate, formatPrice } from "@/utils/format";
import toast from "react-hot-toast";
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';

const HomeVouchers = () => {
  const { getToken, currency } = useAppContext();
  const [publicVouchers, setPublicVouchers] = useState([]);
  const [loadingVouchers, setLoadingVouchers] = useState(true);

  const fetchPublicVouchers = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/coupons/public`);
      if (data.success) setPublicVouchers(data.coupons);
    } catch (err) {
      // ignore
    } finally {
      setLoadingVouchers(false);
    }
  };

  const handleClaim = async (couponId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user-coupons/claim`, { couponId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) toast.success(data.message);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => { fetchPublicVouchers(); }, []);

  return (
    <div className="mt-14 pb-14">
      <div className="flex flex-col items-start mb-8 px-2 md:px-0">
        <p className="text-3xl font-medium">Voucher nổi bật</p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>
      {loadingVouchers ? (
        <div className="text-center py-8">Đang tải voucher...</div>
      ) : publicVouchers.length === 0 ? (
        <div className="text-center py-8">Hiện chưa có voucher nào.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-2 md:px-0">
          {publicVouchers.map(v => (
            <div
              key={v._id}
              className="flex bg-white rounded-xl border border-orange-200 shadow-sm hover:shadow-lg transition p-0 overflow-hidden h-full"
            >
              {/* Icon bên trái */}
              <div className="flex items-center justify-center bg-orange-50 px-4 py-6">
                <ConfirmationNumberOutlinedIcon sx={{ fontSize: 40 }} />
              </div>
              {/* Nội dung voucher */}
              <div className="flex flex-col flex-1 justify-between p-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg text-orange-600 tracking-widest">{v.code}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${v.type === 'PERCENTAGE' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {v.type === 'PERCENTAGE' ? 'Phần trăm' : 'Tiền mặt'}
                    </span>
                  </div>
                  <div className="text-gray-900 font-semibold text-base mb-1">
                    {v.type === 'PERCENTAGE' ? `${v.value}%` : `${formatPrice(v.value)}${currency}`} giảm cho đơn từ {formatPrice(v.minOrderAmount)}{currency}
                  </div>
                  <div className="flex flex-wrap gap-x-2 text-xs text-gray-500 mb-1">
                    <span>Hiệu lực: {formatDate(v.startDate)} - {formatDate(v.endDate)}</span>
                    <span>• Số lượt tối đa: {v.maxUses}</span>
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    className="px-5 py-2 bg-orange-600 text-white rounded-lg font-semibold shadow hover:bg-orange-700 transition whitespace-nowrap"
                    onClick={() => handleClaim(v._id)}
                  >
                    Nhận mã
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeVouchers;
