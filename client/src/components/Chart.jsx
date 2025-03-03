import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const OrdersChart = ({ pendingOrdersCount, completedOrdersCount }) => {
  // Corrected data structure: both values in the same object
  const data = [
    { name: "Orders", pending: pendingOrdersCount, completed: completedOrdersCount },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Order Status Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {/* Now each bar has a unique dataKey */}
          <Bar dataKey="pending" fill="#FF5733" name="Pending Orders" /> {/* Red */}
          <Bar dataKey="completed" fill="#4CAF50" name="Completed Orders" /> {/* Green */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersChart;
