'use client'

import { useEffect, useState } from 'react'
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react'
import { SummaryCard } from './SummaryCard'
import { createClient } from '@/utils/supabase/client'
import { SkeletonCard } from '@/components/Skeleton'

interface SummaryData {
  totalIncome: number
  totalExpense: number
  balance: number
  monthlyIncome: number
  monthlyExpense: number
  monthlyBalance: number
  isLoading: boolean
  error?: string
}

export function SummarySection() {
  const [summary, setSummary] = useState<SummaryData>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    monthlyBalance: 0,
    isLoading: true,
  })

  const supabase = createClient()

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Fetch all transactions with date
        const { data: allTransactions, error: fetchError } = await supabase
          .from('transactions')
          .select('amount, type, date')
          .eq('user_id', user.id)

        if (fetchError) throw fetchError

        // Current month and year
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()

        // Calculate all-time totals
        const totalIncome = allTransactions
          ?.filter(t => t.type === 'income')
          .reduce((sum, t) => sum + Number(t.amount), 0) || 0
        const totalExpense = allTransactions
          ?.filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + Number(t.amount), 0) || 0
        const balance = totalIncome - totalExpense

        // Calculate monthly totals
        const monthlyTransactions = allTransactions?.filter(t => {
          const d = new Date(t.date)
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear
        }) || []

        const monthlyIncome = monthlyTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + Number(t.amount), 0)
        const monthlyExpense = monthlyTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + Number(t.amount), 0)
        const monthlyBalance = monthlyIncome - monthlyExpense

        setSummary({
          totalIncome,
          totalExpense,
          balance,
          monthlyIncome,
          monthlyExpense,
          monthlyBalance,
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
        {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
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
        secondaryAmount={summary.monthlyIncome}
        secondaryLabel="Bulan ini"
      />
      <SummaryCard
        title="Total Pengeluaran"
        amount={summary.totalExpense}
        icon={TrendingDown}
        type="expense"
        secondaryAmount={summary.monthlyExpense}
        secondaryLabel="Bulan ini"
      />
      <SummaryCard
        title="Total Saldo"
        amount={summary.balance}
        icon={Wallet}
        type="balance"
        secondaryAmount={summary.monthlyBalance}
        secondaryLabel="Bulan ini"
      />
    </div>
  )
}
