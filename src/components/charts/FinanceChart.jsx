import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function FinanceChart({ data }) {
  // Mock data if not provided
  const chartData = data || [
    { name: 'Jan', Pemasukan: 4000, Pengeluaran: 2400 },
    { name: 'Feb', Pemasukan: 3000, Pengeluaran: 1398 },
    { name: 'Mar', Pemasukan: 2000, Pengeluaran: 9800 },
    { name: 'Apr', Pemasukan: 2780, Pengeluaran: 3908 },
    { name: 'Mei', Pemasukan: 1890, Pengeluaran: 4800 },
    { name: 'Jun', Pemasukan: 2390, Pengeluaran: 3800 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 shadow-sm border-2 border-gray-100 dark:border-gray-700 w-full h-80">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Statistik Keuangan</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="name" stroke="#8884d8" />
          <YAxis stroke="#8884d8" />
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="Pemasukan" fill="#10B981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Pengeluaran" fill="#EF4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
