import React, { useState } from "react";
import Link from "next/link";
import { assets } from "../../assets/assets";
import Image from "next/image";
import { usePathname } from "next/navigation";

const SideBar = () => {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({});

  const menuItems = [
    { name: "Dashboard", path: "/seller", icon: assets.stat_icon },
    { name: "Users", path: "/seller/users", icon: assets.user_icon },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
    { name: "Blogs", path: "/seller/blogs", icon: assets.blog_icon },
    {
      name: "Products",
      icon: assets.product_icon,
      children: [
        { name: "Product List", path: "/seller/products" },
        { name: "Add Product", path: "/seller/add-product" },
      ],
    },
    {
      name: "Categories",
      icon: assets.cate_icon,
      children: [
        { name: "Category List", path: "/seller/categories" },
        { name: "Add Category", path: "/seller/add-category" },
      ],
    },
    {
      name: "Brands",
      icon: assets.tag_icon,
      children: [
        { name: "Brand List", path: "/seller/brands" },
        { name: "Add Brand", path: "/seller/add-brand" },
      ],
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
        <Image
          src={item.icon}
          alt={`${item.name.toLowerCase()}_icon`}
          className="w-7 h-7"
        />
        <p className="md:block hidden">{item.name}</p>
        {hasChildren && (
          <span
            className={`md:block hidden ml-auto transform transition-transform ${
              openMenus[item.name] ? "rotate-180" : ""
            }`}
          >
            <Image
              src={assets.dropdown_arrow}
              alt={`${item.name.toLowerCase()}_icon`}
              className="w-3 h-3"
            />
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
                  <Image
                    src={assets.add_icon}
                    alt={`${child.name.toLowerCase()}_icon`}
                    className="w-2 h-2"
                  />
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
