import React from 'react';
import Image from 'next/image';

const PaymentMethod = ({ selectedMethod, onSelectMethod }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div
          className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${
            selectedMethod === 'COD' ? 'border-orange-500' : 'border-gray-200'
          }`}
          onClick={() => onSelectMethod('COD')}
        >
          <input
            type="radio"
            checked={selectedMethod === 'COD'}
            onChange={() => onSelectMethod('COD')}
            className="accent-orange-500"
          />
          <span>Tiền mặt (COD)</span>
        </div>

        <div
          className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${
            selectedMethod === 'VNPAY' ? 'border-orange-500' : 'border-gray-200'
          }`}
          onClick={() => onSelectMethod('VNPAY')}
        >
          <input
            type="radio"
            checked={selectedMethod === 'VNPAY'}
            onChange={() => onSelectMethod('VNPAY')}
            className="accent-orange-500"
          />
          <span>VNPay</span>
          <Image 
            src="/vnpay-logo.png" 
            alt="VNPay" 
            width={60} 
            height={30}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
