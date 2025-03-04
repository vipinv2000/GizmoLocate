import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const OrdersChart = ({ pendingOrdersCount, completedOrdersCount }) => {
  const data = [
    { name: "Orders", pending: pendingOrdersCount, completed: completedOrdersCount },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Order Status Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} tickFormatter={(tick) => Math.round(tick)} domain={[0, 'dataMax']} />
          <Tooltip />
          <Legend />
          <Bar dataKey="pending" fill="#FF5733" name="Pending Orders" />
          <Bar dataKey="completed" fill="#4CAF50" name="Completed Orders" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersChart;

