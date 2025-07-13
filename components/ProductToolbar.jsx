import React, { useState, useRef, useEffect } from "react";

const ProductToolbar = ({
  total,
  sortType,
  setSortType,
  sortOptions = []
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLabel = sortOptions.find(opt => opt.value === sortType)?.label || "Sắp xếp";

  return (
    <div className="w-full flex items-center justify-between border-b border-gray-200 py-4">
      <span className="font-semibold text-lg">{total} sản phẩm</span>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          className="border rounded px-4 py-2 bg-white font-medium flex items-center gap-2 hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-[180px] justify-between"
          onClick={() => setOpen(v => !v)}
        >
          <span>{currentLabel}</span>
          <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
        {open && (
          <ul className="absolute right-0 mt-2 w-full bg-white border rounded shadow-md z-20 py-1.5">
            {sortOptions.map(opt => (
              <li
                key={opt.value}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-500/10 transition ${sortType === opt.value ? 'font-semibold text-orange-600' : ''}`}
                onClick={() => { setSortType(opt.value); setOpen(false); }}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductToolbar;
