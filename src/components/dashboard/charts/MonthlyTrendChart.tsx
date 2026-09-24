'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { MonthlyData } from '@/utils/chartHelpers'
import { SkeletonChart } from '@/components/Skeleton'
import { useEffect, useState } from 'react'

interface MonthlyTrendChartProps {
  data: MonthlyData[]
  isLoading?: boolean
}

export function MonthlyTrendChart({ data, isLoading }: MonthlyTrendChartProps) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  if (isLoading) {
    return <SkeletonChart />
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-2">Belum ada data tren keuangan</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Tambahkan transaksi untuk melihat tren bulanan</p>
        </div>
      </div>
    )
  }

  const gridColor = isDark ? '#374151' : '#E5E7EB'
  const textColor = isDark ? '#9CA3AF' : '#6B7280'

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tren Pemasukan & Pengeluaran</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12, fill: textColor }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: textColor }}
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
            contentStyle={{ 
              backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
              borderColor: isDark ? '#374151' : '#E5E7EB',
              color: isDark ? '#F9FAFB' : '#111827'
            }}
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
