"use client";
import React, { useState, useEffect } from "react";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import Footer from "@/components/seller/Footer";
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';
import Loading from "@/components/common/Loading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashBoard = () => {
  const { getToken } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalCustomers: 0
    },
    salesData: [],
    orderStatusData: {
      processing: 0,
      delivered: 0,
      cancelled: 0
    },
    categoryStats: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      const [statsRes, salesRes, statusRes, categoryRes, ordersRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/sales-data`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/order-status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/category-stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/recent-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      ]);

      if (statsRes.data.success) {
        setDashboardData({
          stats: statsRes.data.stats,
          salesData: salesRes.data.salesData,
          orderStatusData: statusRes.data.statusData,
          categoryStats: categoryRes.data.categoryStats,
          recentOrders: ordersRes.data.recentOrders
        });
      } else {
        toast.error('Không thể tải dữ liệu dashboard');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Lỗi khi tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  // ... existing code ...
  const stats = [
    { 
      title: "Tổng doanh thu", 
      value: `${dashboardData.stats.totalRevenue.toLocaleString('vi-VN')}₫`, 
      icon: <AttachMoneyOutlinedIcon sx={{ fontSize: 48 }} /> 
    },
    { 
      title: "Tổng đơn hàng", 
      value: dashboardData.stats.totalOrders.toString(), 
      icon: <ShoppingCartOutlinedIcon sx={{ fontSize: 48 }} /> 
    },
    { 
      title: "Tổng sản phẩm", 
      value: dashboardData.stats.totalProducts.toString(), 
      icon: <Inventory2OutlinedIcon sx={{ fontSize: 48 }} /> 
    },
    { 
      title: "Tổng khách hàng", 
      value: dashboardData.stats.totalCustomers.toString(), 
      icon: <PersonOutlineOutlinedIcon sx={{ fontSize: 48 }} /> 
    },
  ];

  // Sales Data
  const salesData = {
    labels: dashboardData.salesData.map(item => item.month),
    datasets: [
      {
        label: 'Doanh thu hàng tháng',
        data: dashboardData.salesData.map(item => item.revenue),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // Product Categories Data
  const productCategoryData = {
    labels: dashboardData.categoryStats.map(item => item._id),
    datasets: [
      {
        data: dashboardData.categoryStats.map(item => item.count),
        backgroundColor: [
          'rgba(255, 182, 193, 0.8)',
          'rgba(135, 206, 235, 0.8)',
          'rgba(255, 218, 185, 0.8)',
          'rgba(176, 224, 230, 0.8)',
          'rgba(221, 160, 221, 0.8)',
          'rgba(255, 228, 181, 0.8)',
        ],
      },
    ],
  };

  // Monthly Orders Data
  const ordersData = {
    labels: dashboardData.salesData.map(item => item.month),
    datasets: [
      {
        label: 'Đơn hàng',
        data: dashboardData.salesData.map(item => item.orderCount),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  // Order Status Data
  const orderStatusData = {
    labels: ['Đang xử lý', 'Đã giao', 'Đã hủy'],
    datasets: [
      {
        data: [
          dashboardData.orderStatusData.processing,
          dashboardData.orderStatusData.delivered,
          dashboardData.orderStatusData.cancelled
        ],
        backgroundColor: [
          'rgba(255, 159, 64, 0.8)',
          'rgba(75, 192, 75, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
      },
    ],
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'DELIVERED': return 'Đã giao';
      case 'PROCESSING': return 'Đang xử lý';
      case 'PENDING': return 'Chờ xử lý';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const handleExportExcel = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/export-excel`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob', // Quan trọng: để nhận file
        }
      );

      // Tạo URL để download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Tên file với ngày hiện tại
      const fileName = `Dashboard_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.setAttribute('download', fileName);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Xuất file Excel thành công!');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast.error('Lỗi khi xuất file Excel');
    }
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <div className="flex-1 h-screen flex flex-col overflow-scroll justify-between text-sm">
      <div className="w-full md:p-10 p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Bảng điều khiển</h1>
          <button
            onClick={handleExportExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FileDownloadOutlinedIcon />
            Xuất Excel
          </button>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-semibold mt-2">{stat.value}</p>
                </div>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Sales Trend */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Doanh thu hàng tháng</h2>
            <Line 
              data={salesData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                }
              }}
            />
          </div>

          {/* Monthly Orders */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Đơn hàng hàng tháng</h2>
            <Bar 
              data={ordersData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                }
              }}
            />
          </div>

          {/* Order Status Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Trạng thái đơn hàng</h2>
            <div className="w-full max-w-[300px] mx-auto">
              <Doughnut 
                data={orderStatusData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { 
                      position: 'top',
                      labels: {
                        padding: 20
                      }
                    },
                  }
                }}
              />
            </div>
          </div>

          {/* Product Categories Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Sản phẩm theo danh mục</h2>
            <div className="w-full max-w-[300px] mx-auto">
              <Doughnut 
                data={productCategoryData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { 
                      position: 'top',
                      labels: {
                        padding: 20
                      }
                    },
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Đơn hàng gần đây</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Mã đơn hàng</th>
                  <th className="text-left py-3 px-4">Khách hàng</th>
                  <th className="text-left py-3 px-4">Ngày</th>
                  <th className="text-left py-3 px-4">Trạng thái</th>
                  <th className="text-left py-3 px-4">Số tiền</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentOrders.map((order, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">#{order._id.slice(-6)}</td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4">{order.date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">{order.amount.toLocaleString('vi-VN')}₫</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashBoard;