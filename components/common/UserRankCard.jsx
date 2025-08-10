'use client';

import React from 'react';
import { RANK_NAMES, RANK_COLORS, RANK_ICONS, formatCurrency } from '@/utils/rankConstants';

const UserRankCard = ({ rankData, onSpinClick }) => {
  if (!rankData) return null;

  const { current, currentName, currentColor, next, nextName, nextThreshold, totalSpent, progress, spinCount } = rankData;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
            style={{ backgroundColor: currentColor }}
          >
            {RANK_ICONS[current]}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Hạng {currentName}
            </h3>
            <p className="text-sm text-gray-600">
              Tổng chi tiêu: {formatCurrency(totalSpent)}
            </p>
          </div>
        </div>
        
        {spinCount > 0 && (
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              {spinCount} lượt quay
            </div>
            <button
              onClick={onSpinClick}
              className="mt-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-yellow-500 hover:to-orange-600 transition-all duration-200"
            >
              Quay ngay
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {next && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Tiến độ lên hạng {nextName}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Cần thêm {formatCurrency(nextThreshold - totalSpent)} để lên hạng {nextName}
          </p>
        </div>
      )}

      {/* Rank Benefits */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Quyền lợi hạng {currentName}:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Giảm giá đặc biệt cho hạng {currentName}</li>
          <li>• Ưu tiên hỗ trợ khách hàng</li>
          {current === 'PLATINUM' || current === 'DIAMOND' ? (
            <li>• Quay vòng quay may mắn khi lên hạng</li>
          ) : (
            <li>• Cơ hội quay vòng quay khi lên hạng cao hơn</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserRankCard;
