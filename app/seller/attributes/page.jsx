"use client";
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/common/Loading";
import Footer from "@/components/seller/Footer";
import Link from "next/link";

const Attributes = () => {
  const { getToken } = useAppContext();

  const [attributes, setAttributes] = useState([]);
  const [groupedAttributes, setGroupedAttributes] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [editName, setEditName] = useState('');
  const [editValue, setEditValue] = useState('');

  const fetchAttributes = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/attributes/list`);
      if (data.success) {
        setAttributes(data.allAttributes);
        setGroupedAttributes(data.attributes);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách thuộc tính");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa thuộc tính này?")) return;

    try {
      const token = await getToken();
      const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/attributes/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      
      if (data.success) {
        toast.success(data.message);
        fetchAttributes();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa thuộc tính");
    }
  };

  const handleEdit = (attribute) => {
    setEditingAttribute(attribute._id);
    setEditName(attribute.name);
    setEditValue(attribute.value);
  };

  const handleSaveEdit = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/attributes/edit/${editingAttribute}`, {
        name: editName.trim(),
        value: editValue.trim()
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      
      if (data.success) {
        toast.success(data.message);
        setEditingAttribute(null);
        fetchAttributes();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật thuộc tính");
    }
  };

  const handleCancelEdit = () => {
    setEditingAttribute(null);
    setEditName('');
    setEditValue('');
  };

  const filteredAttributes = attributes.filter(attr => 
    attr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attr.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div className="flex-1 h-screen flex flex-col overflow-scroll justify-between text-sm">
      <div className="w-full md:p-10 p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Quản lý thuộc tính</h1>
          <Link 
            href="/seller/add-attribute"
            className="px-4 py-2 bg-orange-600 text-white font-medium rounded hover:bg-orange-700"
          >
            Thêm thuộc tính
          </Link>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm thuộc tính..."
            className="w-full max-w-md outline-none py-2 px-3 rounded border border-gray-500/40"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên thuộc tính
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá trị
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttributes.map((attribute) => (
                  <tr key={attribute._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingAttribute === attribute._id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full outline-none py-1 px-2 border border-gray-300 rounded"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-900">{attribute.name}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingAttribute === attribute._id ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full outline-none py-1 px-2 border border-gray-300 rounded"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{attribute.value}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(attribute.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingAttribute === attribute._id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSaveEdit}
                            className="text-green-600 hover:text-green-900"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(attribute)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(attribute._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Xóa
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredAttributes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? "Không tìm thấy thuộc tính nào" : "Chưa có thuộc tính nào"}
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Thuộc tính theo nhóm</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(groupedAttributes).map(([name, attrs]) => (
              <div key={name} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-medium text-gray-900 mb-2">{name}</h3>
                <div className="flex flex-wrap gap-1">
                  {attrs.map((attr) => (
                    <span
                      key={attr._id}
                      className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                    >
                      {attr.value}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Attributes;