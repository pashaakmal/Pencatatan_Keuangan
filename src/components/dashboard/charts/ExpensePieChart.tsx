'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { CategoryExpense } from '@/utils/chartHelpers'

interface ExpensePieChartProps {
  data: CategoryExpense[]
  isLoading?: boolean
}

export function ExpensePieChart({ data, isLoading }: ExpensePieChartProps) {
  if (isLoading) {
    return (
      <div className="w-full h-80 bg-white rounded-lg border shadow-sm p-6 animate-pulse">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-400">Memuat grafik...</div>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 bg-white rounded-lg border shadow-sm p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Belum ada data pengeluaran</p>
          <p className="text-sm text-gray-400">Mulai tambahkan transaksi pengeluaran bulan ini</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-white rounded-lg border shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Pengeluaran per Kategori</h3>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={{ position: 'outside', fill: '#374151', fontSize: 12 }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) =>
              new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(Number(value))
            }
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
