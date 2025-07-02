import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';

const Services = () => {
  const services = [
    { icon: <LocalShippingOutlinedIcon sx={{ fontSize: 40 }} />, title: "Miễn phí vận chuyển", desc: "Cho đơn hàng từ 500K" },
    { icon: <GppGoodOutlinedIcon sx={{ fontSize: 40 }} />, title: "Bảo hành 12 tháng", desc: "Đổi trả dễ dàng" },
    { icon: <HelpOutlineOutlinedIcon sx={{ fontSize: 40 }} />, title: "Hỗ trợ 24/7", desc: "Tư vấn nhiệt tình" },
    { icon: <PaymentsOutlinedIcon sx={{ fontSize: 40 }} />, title: "Thanh toán an toàn", desc: "Nhiều phương thức" },
  ];

  return (
    <div className="mt-12">
      <div className="flex flex-col items-center mb-8">
        <p className="text-3xl font-medium">Dịch vụ của chúng tôi</p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-14">
        {services.map((service) => (
          <div key={service.title} className="text-center p-6 bg-white rounded-lg shadow-md">
            {service.icon}
            <h3 className="font-medium mb-2">{service.title}</h3>
            <p className="text-gray-500 text-sm">{service.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
