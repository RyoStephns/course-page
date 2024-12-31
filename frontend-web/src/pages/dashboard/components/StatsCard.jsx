import React from 'react';

const StatsCard = ({ title, value, icon, bgColor = 'bg-white' }) => {
  return (
    <div className={`${bgColor} p-6 rounded-lg shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm uppercase font-medium">
            {title}
          </p>
          <p className="mt-1 text-3xl font-semibold">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        {icon && (
          <div className="text-gray-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;