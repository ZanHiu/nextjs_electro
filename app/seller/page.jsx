'use client'
import React from "react";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
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
  const stats = [
    { title: "Total Sales", value: "$12,345", icon: <AttachMoneyOutlinedIcon sx={{ fontSize: 48 }} /> },
    { title: "Total Orders", value: "234", icon: <ShoppingCartOutlinedIcon sx={{ fontSize: 48 }} /> },
    { title: "Total Products", value: "89", icon: <Inventory2OutlinedIcon sx={{ fontSize: 48 }} /> },
    { title: "Total Customers", value: "156", icon: <PersonOutlineOutlinedIcon sx={{ fontSize: 48 }} /> },
  ];

  const recentOrders = [
    { id: "#ORD001", customer: "John Doe", date: "2024-04-13", status: "Delivered", amount: "$120" },
    { id: "#ORD002", customer: "Jane Smith", date: "2024-04-12", status: "Processing", amount: "$350" },
    { id: "#ORD003", customer: "Mike Johnson", date: "2024-04-12", status: "Pending", amount: "$89" },
    { id: "#ORD004", customer: "Sarah Williams", date: "2024-04-11", status: "Delivered", amount: "$230" },
  ];

  // Sales Data
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Sales',
        data: [3000, 4500, 3800, 5200, 4800, 6000],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // Product Categories Data
  const productCategoryData = {
    labels: ['Smartphone', 'Laptop', 'Headphone', 'Watch'],
    datasets: [
      {
        data: [35, 40, 15, 10],
        backgroundColor: [
          'rgba(255, 182, 193, 0.8)',  // Pink
          'rgba(135, 206, 235, 0.8)',  // Sky blue
          'rgba(255, 218, 185, 0.8)',  // Peach
          'rgba(176, 224, 230, 0.8)',  // Powder blue
        ],
      },
    ],
  };

  // Monthly Orders Data
  const ordersData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Orders',
        data: [65, 59, 80, 81, 56, 90],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  // Order Status Data
  const orderStatusData = {
    labels: ['Processing', 'Delivered', 'Cancelled'],
    datasets: [
      {
        data: [45, 40, 15],
        backgroundColor: [
          'rgba(255, 159, 64, 0.8)',  // Orange for processing
          'rgba(75, 192, 75, 0.8)',   // Green for delivered
          'rgba(255, 99, 132, 0.8)',  // Red for cancelled
        ],
      },
    ],
  };

  return (
    <div className="w-full md:p-10 p-4 flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      
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
          <h2 className="text-xl font-semibold mb-4">Sales Trend</h2>
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
          <h2 className="text-xl font-semibold mb-4">Monthly Orders</h2>
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
          <h2 className="text-xl font-semibold mb-4">Order Status</h2>
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
          <h2 className="text-xl font-semibold mb-4">Products by Category</h2>
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
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{order.id}</td>
                  <td className="py-3 px-4">{order.customer}</td>
                  <td className="py-3 px-4">{order.date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
