import React from "react";

const Tabs = ({
  tabs = [],
  activeTab,
  setActiveTab
}) => {
  // Khi đổi tab, chỉ set state, không cập nhật URL
  const handleTabClick = (e, tabKey) => {
    e.preventDefault();
    setActiveTab(tabKey);
  };

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={e => handleTabClick(e, tab.key)}
            className={
              (activeTab === tab.key
                ? 'border-orange-500 text-orange-600 '
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 '
              ) + 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            }
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;
