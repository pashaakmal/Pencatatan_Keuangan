'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { MonthlyData } from '@/utils/chartHelpers'

interface MonthlyTrendChartProps {
  data: MonthlyData[]
  isLoading?: boolean
}

export function MonthlyTrendChart({ data, isLoading }: MonthlyTrendChartProps) {
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
          <p className="text-gray-500 mb-2">Belum ada data tren keuangan</p>
          <p className="text-sm text-gray-400">Tambahkan transaksi untuk melihat tren bulanan</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-white rounded-lg border shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tren Pemasukan & Pengeluaran</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              if (value >= 1000000) {
                return `${(value / 1000000).toFixed(1)}jt`
              }
              if (value >= 1000) {
                return `${(value / 1000).toFixed(0)}rb`
              }
              return value.toString()
            }}
          />
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
          <Line 
            type="monotone" 
            dataKey="income" 
            stroke="#10B981" 
            strokeWidth={2}
            name="Pemasukan"
            dot={{ fill: '#10B981', r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="expense" 
            stroke="#EF4444" 
            strokeWidth={2}
            name="Pengeluaran"
            dot={{ fill: '#EF4444', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
