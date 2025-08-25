import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';

const SideBar = () => {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({});

  const menuItems = [
    { name: "Bảng điều khiển", path: "/seller", icon: <BarChartOutlinedIcon sx={{ fontSize: 28 }} /> },
    { name: "Người dùng", path: "/seller/users", icon: <PersonOutlineOutlinedIcon sx={{ fontSize: 28 }} /> },
    { name: "Đơn hàng", path: "/seller/orders", icon: <ShoppingCartOutlinedIcon sx={{ fontSize: 28 }} /> },
    {
      name: "Sản phẩm",
      icon: <Inventory2OutlinedIcon sx={{ fontSize: 28 }} />,
      children: [
        { name: "Danh sách sản phẩm", path: "/seller/products" },
        { name: "Thêm sản phẩm", path: "/seller/add-product" },
        // { name: "Danh sách thuộc tính", path: "/seller/attributes" },
        { name: "Thêm thuộc tính", path: "/seller/add-attribute" },
      ],
    },
    {
      name: "Danh mục",
      icon: <CategoryOutlinedIcon sx={{ fontSize: 28 }} />,
      children: [
        { name: "Danh sách danh mục", path: "/seller/categories" },
        { name: "Thêm danh mục", path: "/seller/add-category" },
      ],
    },
    {
      name: "Thương hiệu",
      icon: <LocalOfferOutlinedIcon sx={{ fontSize: 28 }} />,
      children: [
        { name: "Danh sách thương hiệu", path: "/seller/brands" },
        { name: "Thêm thương hiệu", path: "/seller/add-brand" },
      ],
    },
    { 
      name: "Mã giảm giá", 
      icon: <ConfirmationNumberOutlinedIcon sx={{ fontSize: 28 }} />, 
      children: [
        { name: "Danh sách mã giảm giá", path: "/seller/coupons" },
        { name: "Thêm mã giảm giá", path: "/seller/add-coupon" },
      ]
    },
    { name: "Bài viết", path: "/seller/blogs", icon: <ArticleOutlinedIcon sx={{ fontSize: 28 }} /> },
    { name: "Đánh giá", path: "/seller/reviews", icon: <RateReviewOutlinedIcon sx={{ fontSize: 28 }} /> },
    { name: "Bình luận", path: "/seller/comments", icon: <CommentOutlinedIcon sx={{ fontSize: 28 }} /> },
  ];

  const toggleMenu = (menuName) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const renderMenuItem = (item) => {
    const isActive = pathname === item.path;
    const hasChildren = item.children && item.children.length > 0;

    const menuContent = (
      <div
        className={`flex items-center py-3 px-4 gap-3 cursor-pointer ${
          isActive
            ? "border-r-4 md:border-r-[6px] bg-orange-600/10 border-orange-500/90"
            : "hover:bg-gray-100/90 border-white"
        }`}
        onClick={() => hasChildren && toggleMenu(item.name)}
      >
        {/* Render icon component trực tiếp */}
        <span className="w-7 h-7 flex items-center justify-center">
          {item.icon}
        </span>
        <p className="md:block hidden">{item.name}</p>
        {hasChildren && (
          <span
            className={`md:block hidden ml-auto transform transition-transform ${
              openMenus[item.name] ? "rotate-180" : ""
            }`}
          >
            <KeyboardArrowDownOutlinedIcon sx={{ fontSize: 20 }} />
          </span>
        )}
      </div>
    );

    return (
      <div key={item.name}>
        {hasChildren ? (
          menuContent
        ) : (
          <Link href={item.path}>{menuContent}</Link>
        )}

        {hasChildren && openMenus[item.name] && (
          <div className="ml-2 md:ml-4">
            {item.children.map((child) => (
              <Link href={child.path} key={child.name} passHref>
                <div
                  className={`flex items-center py-2 px-4 gap-3 ${
                    pathname === child.path
                      ? "text-orange-500"
                      : "hover:text-orange-500"
                  }`}
                >
                  <AddCircleOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                  <p className="md:block hidden">{child.name}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="sticky top-0 left-0 overflow-y-auto md:w-64 w-16 border-r h-screen text-base border-gray-300 py-2 flex flex-col">
      {menuItems.map(renderMenuItem)}
    </div>
  );
};

export default SideBar;
