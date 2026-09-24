'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { Transaction } from '@/types/database'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface RecentTransactionsProps {
  limit?: number
  onTransactionClick?: (transaction: Transaction) => void
}

export function RecentTransactions({ limit = 10, onTransactionClick }: RecentTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error: fetchError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(limit)

        if (fetchError) throw fetchError

        setTransactions(data || [])
        setIsLoading(false)
      } catch (err) {
        console.error('Failed to fetch recent transactions:', err)
        setError('Gagal memuat transaksi terbaru')
        setIsLoading(false)
      }
    }

    fetchRecentTransactions()
  }, [limit])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'd MMM yyyy', { locale: id })
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      makanan: 'Makanan',
      transportasi: 'Transportasi',
      hiburan: 'Hiburan',
      tagihan: 'Tagihan',
      lainnya: 'Lainnya',
    }
    return labels[category] || category
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Transaksi Terbaru</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Transaksi Terbaru</h3>
        <div className="text-center py-8 text-red-600">
          {error}
        </div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Transaksi Terbaru</h3>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-2">Belum ada transaksi</p>
          <p className="text-sm text-gray-400">Mulai tambahkan transaksi pertama Anda</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Transaksi Terbaru</h3>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-gray-100"
            onClick={() => onTransactionClick?.(transaction)}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                transaction.type === 'income' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {transaction.type === 'income' 
                  ? <ArrowUpRight className="w-5 h-5" />
                  : <ArrowDownRight className="w-5 h-5" />
                }
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {getCategoryLabel(transaction.category)}
                </p>
                <p className="text-sm text-gray-500">
                  {transaction.note || 'Tidak ada catatan'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Number(transaction.amount))}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(transaction.date)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
