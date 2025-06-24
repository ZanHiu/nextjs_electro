"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { formatDate } from "@/utils/format";

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
        toast.success("User role updated successfully");
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
        toast.success(isBlocked ? "User blocked successfully" : "User unblocked successfully");
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
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4 space-y-5">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Users Management</h1>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search users..."
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="seller">Sellers</option>
              </select>
              <select
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>

          <div className="w-full rounded-md bg-white shadow-sm">
            <div className="grid grid-cols-12 gap-4 p-4 font-medium text-gray-700 border-b">
              <div className="col-span-3">User Info</div>
              <div className="col-span-3">Contact Details</div>
              <div className="col-span-2">Account Status</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-2">Actions</div>
            </div>
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 items-center hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-3 flex gap-3 items-center">
                  <Image
                    className="w-12 h-12 rounded-full object-cover"
                    src={user.imageUrl}
                    alt={user.name}
                    width={48}
                    height={48}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    {/* <span className="text-gray-500 text-xs">ID: {user._id.slice(0, 8)}...</span> */}
                    <p className="text-gray-500 text-xs">Member since: {formatDate(user.createdAt)}</p>
                  </div>
                </div>

                <div className="col-span-3 text-sm">
                  <p className="font-medium">{user.email}</p>
                  <p className="text-gray-500">{user.phone}</p>
                </div>

                <div className="col-span-2 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </div>

                <div className="col-span-2 text-sm">
                  <select
                    className="w-full border p-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={user.role}
                    onChange={(e) => updateUserRole(user._id, e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="seller">Seller</option>
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
                  >{user.isBlocked ? 'Unblock' : 'Block'}</button>
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No users found matching your criteria
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Users;
