'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SPIN_REWARDS } from '@/utils/rankConstants';

// Thêm lại props isOpen và onClose để hoạt động như modal
const CanvasLuckyWheel = ({ isOpen, onClose, onSpin, spinCount }) => {
  const canvasRef = useRef(null);
  const [mustSpin, setMustSpin] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Các tham số cấu hình vòng quay
  const wheelConfig = {
    outerRadius: 145, // Bán kính ngoài
    innerRadius: 30,  // Bán kính trong (cho logo hoặc trung tâm)
    textDistance: 60, // Khoảng cách văn bản từ trung tâm
    spinDuration: 5000, // Thời gian quay (ms)
    spinRevolutions: 10, // Số vòng quay
  };

  // Vẽ vòng quay
  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const segments = SPIN_REWARDS;
    const numSegments = segments.length;
    const segmentAngle = (2 * Math.PI) / numSegments;
    
    // Xóa canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Vẽ từng phân đoạn
    segments.forEach((segment, i) => {
      // Tính toán góc bắt đầu và kết thúc cho phân đoạn
      const startAngle = rotation + i * segmentAngle;
      const endAngle = rotation + (i + 1) * segmentAngle;
      
      // Vẽ phân đoạn
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, wheelConfig.outerRadius, startAngle, endAngle);
      ctx.lineTo(centerX, centerY);
      ctx.closePath();
      
      // Tô màu phân đoạn
      ctx.fillStyle = segment.color;
      ctx.fill();
      
      // Vẽ đường viền
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Vẽ văn bản
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px Arial';
      
      // Cắt văn bản nếu quá dài
      let text = segment.name;
      if (text.length > 15) {
        text = text.substring(0, 12) + '...';
      }
      
      ctx.fillText(text, wheelConfig.textDistance, 5);
      ctx.restore();
    });
    
    // Vẽ vòng tròn trung tâm
    ctx.beginPath();
    ctx.arc(centerX, centerY, wheelConfig.innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Vẽ mũi tên chỉ báo
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - wheelConfig.outerRadius - 10);
    ctx.lineTo(centerX - 15, centerY - wheelConfig.outerRadius + 10);
    ctx.lineTo(centerX + 15, centerY - wheelConfig.outerRadius + 10);
    ctx.closePath();
    ctx.fillStyle = '#FF0000';
    ctx.fill();
  };

  // Xử lý hiệu ứng quay
  const spinWheel = () => {
    if (mustSpin || spinCount <= 0) return;
    
    // Chọn phần thưởng ngẫu nhiên dựa trên xác suất
    const random = Math.random() * 100;
    let cumulativeProbability = 0;
    let selectedIndex = 0;

    for (let i = 0; i < SPIN_REWARDS.length; i++) {
      cumulativeProbability += SPIN_REWARDS[i].probability;
      if (random <= cumulativeProbability) {
        selectedIndex = i;
        break;
      }
    }
    
    setPrizeNumber(selectedIndex);
    setSelectedReward(SPIN_REWARDS[selectedIndex]);
    setMustSpin(true);
    setIsSpinning(true);
    
    // Tính toán góc đích để phần thưởng được chọn dừng ở vị trí mũi tên
    const numSegments = SPIN_REWARDS.length;
    const segmentAngle = (2 * Math.PI) / numSegments;
    
    // Tính góc để phần thưởng được chọn dừng ở vị trí mũi tên (phía trên)
    // Thêm nhiều vòng quay để tạo hiệu ứng
    const targetRotation = -(selectedIndex * segmentAngle);
    const fullRotations = wheelConfig.spinRevolutions * 2 * Math.PI;
    const finalRotation = fullRotations + targetRotation;
    
    // Bắt đầu animation
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / wheelConfig.spinDuration, 1);
      
      // Hàm easing để tạo hiệu ứng chậm dần
      const easeOut = (t) => 1 - Math.pow(1 - t, 3);
      
      // Tính toán góc quay hiện tại
      const currentRotation = easeOut(progress) * finalRotation;
      setRotation(currentRotation);
      
      // Tiếp tục animation nếu chưa hoàn thành
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Kết thúc quay
        handleSpinStop();
      }
    };
    
    requestAnimationFrame(animate);
  };

  const handleSpinStop = async () => {
    try {
      setIsSpinning(false);
      await onSpin();
      setMustSpin(false);
    } catch (error) {
      console.error('Spin error:', error);
      setMustSpin(false);
      setIsSpinning(false);
    }
  };

  // Thêm hàm handleClose để xử lý đóng modal
  const handleClose = () => {
    if (!isSpinning) {
      onClose();
      setSelectedReward(null);
    }
  };

  // Vẽ lại vòng quay khi rotation thay đổi
  useEffect(() => {
    drawWheel();
  }, [rotation]);

  // Khởi tạo canvas khi component mount hoặc isOpen thay đổi
  useEffect(() => {
    if (canvasRef.current && isOpen) {
      // Đặt kích thước canvas
      const canvas = canvasRef.current;
      canvas.width = 300;
      canvas.height = 300;
      
      // Vẽ vòng quay ban đầu
      drawWheel();
    }
  }, [canvasRef, isOpen]);

  // Nếu modal không mở, không hiển thị gì cả
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto shadow-md relative">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Vòng Quay May Mắn
          </h2>
          <p className="text-gray-600">
            Bạn có {spinCount} lượt quay
          </p>
        </div>

        {/* Wheel */}
        <div className="flex justify-center mb-6">
          <canvas 
            ref={canvasRef} 
            width="300" 
            height="300"
            className="max-w-full"
          />
        </div>

        {/* Spin Button */}
        <div className="text-center">
          <button
            onClick={spinWheel}
            disabled={isSpinning || spinCount <= 0}
            className={`px-8 py-3 rounded-full text-white font-bold text-lg transition-all duration-200 ${
              isSpinning || spinCount <= 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105 shadow-lg'
            }`}
          >
            {isSpinning ? 'Đang quay...' : 'Quay ngay!'}
          </button>
        </div>

        {/* Selected Reward Modal */}
        {selectedReward && !isSpinning && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Chúc mừng!
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                Bạn đã nhận được: <span className="font-bold text-green-600">{selectedReward.name}</span>
              </p>
              {selectedReward.type === 'PERCENTAGE' && (
                <p className="text-sm text-gray-500">
                  Giảm {selectedReward.value}% cho đơn hàng tiếp theo
                </p>
              )}
              {selectedReward.type === 'FIXED_AMOUNT' && (
                <p className="text-sm text-gray-500">
                  Giảm {selectedReward.value.toLocaleString()}đ cho đơn hàng tiếp theo
                </p>
              )}
              {selectedReward.type === 'FREE_SHIPPING' && (
                <p className="text-sm text-gray-500">
                  Miễn phí vận chuyển cho đơn hàng tiếp theo
                </p>
              )}
              <button
                onClick={handleClose}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isSpinning}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CanvasLuckyWheel;
