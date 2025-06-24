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

const SideBar = () => {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({});

  const menuItems = [
    { name: "Dashboard", path: "/seller", icon: <BarChartOutlinedIcon sx={{ fontSize: 28 }} /> },
    { name: "Users", path: "/seller/users", icon: <PersonOutlineOutlinedIcon sx={{ fontSize: 28 }} /> },
    { name: "Orders", path: "/seller/orders", icon: <ShoppingCartOutlinedIcon sx={{ fontSize: 28 }} /> },
    { name: "Blogs", path: "/seller/blogs", icon: <ArticleOutlinedIcon sx={{ fontSize: 28 }} /> },
    {
      name: "Products",
      icon: <Inventory2OutlinedIcon sx={{ fontSize: 28 }} />,
      children: [
        { name: "Product List", path: "/seller/products" },
        { name: "Add Product", path: "/seller/add-product" },
      ],
    },
    {
      name: "Categories",
      icon: <CategoryOutlinedIcon sx={{ fontSize: 28 }} />,
      children: [
        { name: "Category List", path: "/seller/categories" },
        { name: "Add Category", path: "/seller/add-category" },
      ],
    },
    {
      name: "Brands",
      icon: <LocalOfferOutlinedIcon sx={{ fontSize: 28 }} />,
      children: [
        { name: "Brand List", path: "/seller/brands" },
        { name: "Add Brand", path: "/seller/add-brand" },
      ],
    },
    { 
      name: "Coupons", 
      icon: <ConfirmationNumberOutlinedIcon sx={{ fontSize: 28 }} />, 
      children: [
        { name: "Coupon List", path: "/seller/coupons" },
        { name: "Add Coupon", path: "/seller/add-coupon" },
      ]
    },
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
          <div className="ml-8 md:ml-12">
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
    <div className="md:w-64 w-16 border-r min-h-screen text-base border-gray-300 py-2 flex flex-col">
      {menuItems.map(renderMenuItem)}
    </div>
  );
};

export default SideBar;
