"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/common/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { formatDate } from "@/utils/format";
import { Tooltip } from "react-tooltip";

const Users = () => {

  const { getToken, user } = useAppContext();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/seller-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setUsers(data.users);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      const token = await getToken();
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/update-role/${userId}`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchUsers();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleUserBlock = async (userId, isBlocked) => {
    try {
      const token = await getToken();
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/toggle-block/${userId}`,
        { isBlocked },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchUsers();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user, getToken]);

  // Lọc users dựa trên search term và filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "active" && !user.isBlocked) ||
      (statusFilter === "blocked" && user.isBlocked);

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="flex-1 h-screen flex flex-col overflow-scroll justify-between text-sm">
      {loading ? <Loading /> : <div className="w-full md:p-10 p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Quản lý người dùng</h1>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Tất cả vai trò</option>
              <option value="user">Người dùng</option>
              <option value="seller">Người bán</option>
            </select>
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="blocked">Bị khóa</option>
            </select>
          </div>
        </div>

        <div className="w-full rounded-md bg-white shadow-sm">
          <div className="overflow-x-auto w-full">
          <div className="grid grid-cols-12 gap-4 p-4 font-medium text-gray-700 border-b">
            <div className="col-span-3">Thông tin người dùng</div>
            <div className="col-span-3">Thông tin liên hệ</div>
            <div className="col-span-2">Trạng thái tài khoản</div>
            <div className="col-span-2">Vai trò</div>
            <div className="col-span-2">Hành động</div>
          </div>
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 items-center hover:bg-gray-50 transition-colors"
            >
                <div className="col-span-3 flex gap-3 items-center truncate" data-tooltip-id="user-tooltip" data-tooltip-content={user.name}>
                <Image
                  className="w-12 h-12 rounded-full object-cover"
                  src={user.imageUrl}
                  alt={user.name}
                  width={48}
                  height={48}
                />
                <div className="flex flex-col">
                    <span className="font-medium truncate">{user.name}</span>
                  <p className="text-gray-500 text-xs">Thành viên từ: {formatDate(user.createdAt)}</p>
                </div>
              </div>

                <div className="col-span-3 text-sm truncate" data-tooltip-id="user-tooltip" data-tooltip-content={user.email + (user.phone ? ' | ' + user.phone : '')}>
                  <p className="font-medium truncate">{user.email}</p>
                  <p className="text-gray-500 truncate">{user.phone}</p>
              </div>

              <div className="col-span-2 text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                  {user.isBlocked ? 'Bị khóa' : 'Hoạt động'}
                </span>
              </div>

              <div className="col-span-2 text-sm">
                <select
                  className="w-full border p-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={user.role}
                  onChange={(e) => updateUserRole(user._id, e.target.value)}
                >
                  <option value="user">Người dùng</option>
                  <option value="seller">Người bán</option>
                </select>
              </div>

              <div className="col-span-2 text-sm flex gap-2">
                <button
                  onClick={() => toggleUserBlock(user._id, !user.isBlocked)}
                  className={`px-4 py-2 rounded font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${user.isBlocked
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                  disabled={user.role === 'seller'}
                >{user.isBlocked ? 'Mở khóa' : 'Khóa'}</button>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Không tìm thấy người dùng phù hợp
            </div>
          )}
            <Tooltip id="user-tooltip" place="top" effect="solid" multiline={true} />
          </div>
        </div>
      </div>}
      <Footer />
    </div>
  );
};

export default Users;
