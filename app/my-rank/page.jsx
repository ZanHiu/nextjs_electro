"use client";

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import UserRankCard from '@/components/common/UserRankCard';
// import LuckyDrawWheel from '@/components/common/LuckyDrawWheel';
import CanvasLuckyWheel from '@/components/common/CanvasLuckyWheel';
import { toast } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Loading from '@/components/common/Loading';

const MyRankPage = () => {
  const { user, getToken, router } = useAppContext();
  const [rankData, setRankData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWheel, setShowWheel] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);

  const fetchRankData = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user-rank/my-rank`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.success) {
        setRankData(response.data.rank);
      }
    } catch (error) {
      console.error('Error fetching rank data:', error);
      toast.error('Không thể tải thông tin hạng');
    } finally {
      setLoading(false);
    }
  };

  const handleSpin = async () => {
    if (spinning) return;
    
    setSpinning(true);
    try {
      const token = await getToken();
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user-rank/spin`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.success) {
        // Lưu kết quả quay từ backend
        setSpinResult({
          reward: response.data.reward,
          rewardIndex: response.data.rewardIndex,
          coupon: response.data.coupon
        });
        
        // Cập nhật lại thông tin rank sau khi quay
        await fetchRankData();
        return response.data; // Trả về kết quả cho component wheel
      }
    } catch (error) {
      console.error('Spin error:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi quay');
      throw error;
    } finally {
      setSpinning(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRankData();
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto w-full space-y-8">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Xếp hạng của tôi</h2>
                <p className="text-gray-500 mt-1">Theo dõi tiến độ và quyền lợi của bạn</p>
              </div>
            </div>
          </div>

          {/* Rank Content */}
          {loading ? (
            <Loading />
          ) : !rankData ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-xl font-medium text-gray-800 mb-2">Bạn chưa có hạng nào</h3>
              <p className="text-gray-500 mb-6">Hãy bắt đầu mua sắm để xem hạng của bạn ở đây</p>
              <button
                onClick={() => router.push('/all-products')}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Mua sắm ngay
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Rank Card */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <UserRankCard 
                  rankData={rankData} 
                  onSpinClick={() => setShowWheel(true)}
                />
              </div>

              {/* Rank Information */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Current Rank Details */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Thông tin hạng hiện tại
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hạng:</span>
                        <span className="font-medium">{rankData.currentName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tổng chi tiêu:</span>
                        <span className="font-medium">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(rankData.totalSpent)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lượt quay:</span>
                        <span className="font-medium">{rankData.spinCount}</span>
                      </div>
                      {rankData.lastUpgrade && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lên hạng lần cuối:</span>
                          <span className="font-medium">
                            {new Date(rankData.lastUpgrade).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Next Rank Information */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Hạng tiếp theo
                    </h3>
                    {rankData?.next ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hạng mục tiêu:</span>
                          <span className="font-medium">{rankData.nextName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Yêu cầu chi tiêu:</span>
                          <span className="font-medium">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                            }).format(rankData.nextThreshold)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Còn thiếu:</span>
                          <span className="font-medium text-red-600">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                            }).format(rankData.nextThreshold - rankData.totalSpent)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tiến độ:</span>
                          <span className="font-medium">{Math.round(rankData.progress)}%</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-2">🏆</div>
                        <p className="text-gray-600">Bạn đã đạt hạng cao nhất!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Rank Benefits */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Quyền lợi theo hạng
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { rank: 'IRON', name: 'Sắt', benefits: ['Giảm giá cơ bản', 'Hỗ trợ khách hàng'] },
                      { rank: 'BRONZE', name: 'Đồng', benefits: ['Giảm giá 5%', 'Ưu tiên hỗ trợ', 'Miễn phí vận chuyển đơn hàng >500k'] },
                      { rank: 'SILVER', name: 'Bạc', benefits: ['Giảm giá 10%', 'Hỗ trợ ưu tiên', 'Miễn phí vận chuyển đơn hàng >300k'] },
                      { rank: 'GOLD', name: 'Vàng', benefits: ['Giảm giá 15%', 'Hỗ trợ VIP', 'Miễn phí vận chuyển tất cả đơn hàng'] },
                      { rank: 'PLATINUM', name: 'Bạch Kim', benefits: ['Giảm giá 20%', 'Hỗ trợ VIP', 'Quay vòng quay may mắn', 'Ưu tiên đặt hàng'] },
                      { rank: 'DIAMOND', name: 'Kim Cương', benefits: ['Giảm giá 25%', 'Hỗ trợ VIP 24/7', 'Quay vòng quay may mắn', 'Ưu tiên tối đa'] }
                    ].map((rankInfo) => (
                      <div 
                        key={rankInfo.rank}
                        className={`p-4 rounded-lg border-2 ${
                          rankData?.current === rankInfo.rank 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200'
                        }`}
                      >
                        <h4 className="font-semibold text-gray-800 mb-2">
                          {rankInfo.name}
                          {rankData?.current === rankInfo.rank && (
                            <span className="ml-2 text-blue-600 text-sm">(Hiện tại)</span>
                          )}
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {rankInfo.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center">
                              <span className="text-green-500 mr-2">✓</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lucky Draw Wheel Modal */}
      {/* <LuckyDrawWheel
        isOpen={showWheel}
        onClose={() => setShowWheel(false)}
        onSpin={handleSpin}
        spinCount={rankData?.spinCount || 0}
      />
      <Footer /> */}
      <CanvasLuckyWheel
        isOpen={showWheel}
        onClose={() => {
          setShowWheel(false);
          setSpinResult(null); // Reset kết quả khi đóng
        }}
        onSpin={handleSpin}
        spinCount={rankData?.spinCount || 0}
        spinResult={spinResult} // Truyền kết quả xuống component
      />
      <Footer />
    </>
  );
};

export default MyRankPage;
