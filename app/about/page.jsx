"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

const About = () => {
  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-semibold mb-4 text-center">Về chúng tôi</h1>

          <div className="mb-12 text-center">
            <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
              Electro là điểm đến hàng đầu cho những người đam mê công nghệ và điện tử. Chúng tôi tự hào cung cấp các sản phẩm chất lượng cao từ các thương hiệu hàng đầu thế giới.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-4">Sứ mệnh của chúng tôi</h2>
              <p className="text-gray-600">
                Cung cấp cho khách hàng những sản phẩm công nghệ tốt nhất với giá cả hợp lý, cùng với dịch vụ chăm sóc khách hàng tuyệt vời và dịch vụ sau bán hàng chu đáo.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-4">Tầm nhìn của chúng tôi</h2>
              <p className="text-gray-600">
                Trở thành nhà bán lẻ đồ điện tử hàng đầu, được khách hàng tin tưởng và lựa chọn khi mua sản phẩm công nghệ.
              </p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6 text-center">Giá trị cốt lõi</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Chất lượng</h3>
                <p className="text-gray-600">Cam kết cung cấp sản phẩm chính hãng, chất lượng cao.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Dịch vụ</h3>
                <p className="text-gray-600">Dịch vụ tận tâm, hỗ trợ khách hàng 24/7.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Danh tiếng</h3>
                <p className="text-gray-600">Xây dựng lòng tin với khách hàng qua từng giao dịch.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Liên hệ với chúng tôi</h2>
            <div className="space-y-3 text-gray-600">
              <p className="flex items-center gap-2">
                <EmailOutlinedIcon sx={{ fontSize: '20px' }} />
                Email: support@electro.com
              </p>
              <p className="flex items-center gap-2">
                <LocalPhoneOutlinedIcon sx={{ fontSize: '20px' }} />
                Số điện thoại: 1900 xxxx
              </p>
              <p className="flex items-center gap-2">
                <LocationOnOutlinedIcon sx={{ fontSize: '20px' }} />
                Địa chỉ: 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
