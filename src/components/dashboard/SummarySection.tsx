'use client'

import { useEffect, useState } from 'react'
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react'
import { SummaryCard } from './SummaryCard'
import { createClient } from '@/utils/supabase/client'

interface SummaryData {
  totalIncome: number
  totalExpense: number
  balance: number
  isLoading: boolean
  error?: string
}

export function SummarySection() {
  const [summary, setSummary] = useState<SummaryData>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    isLoading: true,
  })

  const supabase = createClient()

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Get current month/year
        const now = new Date()
        const currentMonth = now.getMonth() + 1 // JavaScript months are 0-indexed
        const currentYear = now.getFullYear()

        // Build date ranges for current month
        const startDate = new Date(currentYear, currentMonth - 1, 1).toISOString()
        const endDate = new Date(currentYear, currentMonth, 0).toISOString()

        // Fetch income total
        const { data: incomeData, error: incomeError } = await supabase
          .from('transactions')
          .select('amount')
          .eq('user_id', user.id)
          .eq('type', 'income')
          .gte('date', startDate)
          .lte('date', endDate)

        if (incomeError) throw incomeError

        // Fetch expense total
        const { data: expenseData, error: expenseError } = await supabase
          .from('transactions')
          .select('amount')
          .eq('user_id', user.id)
          .eq('type', 'expense')
          .gte('date', startDate)
          .lte('date', endDate)

        if (expenseError) throw expenseError

        // Calculate totals
        const totalIncome = incomeData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0
        const totalExpense = expenseData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0
        const balance = totalIncome - totalExpense

        setSummary({
          totalIncome,
          totalExpense,
          balance,
          isLoading: false,
        })

      } catch (error) {
        console.error('Failed to fetch summary:', error)
        setSummary(prev => ({
          ...prev,
          isLoading: false,
          error: 'Gagal memuat data ringkasan'
        }))
      }
    }

    fetchSummary()
  }, [])

  if (summary.isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-6 rounded-lg border shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-2/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4 mt-2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (summary.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <p className="text-red-800">{summary.error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <SummaryCard
        title="Total Pemasukan"
        amount={summary.totalIncome}
        icon={TrendingUp}
        type="income"
      />
      <SummaryCard
        title="Total Pengeluaran"
        amount={summary.totalExpense}
        icon={TrendingDown}
        type="expense"
      />
      <SummaryCard
        title="Saldo"
        amount={summary.balance}
        icon={Wallet}
        type="balance"
      />
    </div>
  )
}
