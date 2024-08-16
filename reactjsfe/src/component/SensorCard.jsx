import React from "react";

const SensorCard = ({ title, value, unit, svgPath }) => {
  return (
    <div className="w-48 p-4 m-2 text-center transition-transform transform bg-white rounded-lg shadow-md hover:scale-105">
      <div className="mb-2">
        <img src={svgPath} alt={`${title} icon`} className="h-10 mx-auto" />
      </div>
      <div className="text-xl font-semibold">
        {value} {unit}
      </div>
      <div className="text-gray-500">{title}</div>
    </div>
  );
};

export default SensorCard;
