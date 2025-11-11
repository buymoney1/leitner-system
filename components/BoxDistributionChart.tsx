// src/components/BoxDistributionChart.tsx
"use client"; // Recharts یک کتابخانه سمت کلاینت است

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// تعریف نوع داده برای ورودی
interface BoxData {
  boxNumber: number;
  _count: {
    boxNumber: number;
  };
}

interface BoxDistributionChartProps {
  data: BoxData[];
}

export default function BoxDistributionChart({ data }: BoxDistributionChartProps) {
  // تبدیل داده‌ها به فرمت مناسب برای Recharts
  const chartData = data.map(item => ({
    box: `جعبه ${item.boxNumber}`,
    count: item._count.boxNumber,
  }));

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">توزیع کارت‌ها در جعبه‌ها</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="box" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" name="تعداد کارت‌ها" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}