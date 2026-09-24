'use client'

import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import type { Transaction } from '@/types/database'
import { TRANSACTION_CATEGORIES } from '@/types/database'
import { Trash2, Edit2 } from 'lucide-react'

interface TransactionListProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
  isDeleting?: string | null
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

function getCategoryLabel(category: string): string {
  const found = TRANSACTION_CATEGORIES.find(c => c.value === category)
  return found?.label || category
}

export function TransactionList({ transactions, onEdit, onDelete, isDeleting }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Belum ada transaksi. Mulai dengan menambah transaksi baru.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Waktu</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Kategori</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Catatan</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Jenis</th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Jumlah</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                {format(new Date(transaction.date), 'dd MMM yyyy, HH:mm', { locale: idLocale })}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                {getCategoryLabel(transaction.category)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                {transaction.note || '-'}
              </td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    transaction.type === 'income'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                  }`}
                >
                  {transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-right font-semibold">
                <span
                  className={
                    transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 p-1 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(transaction.id)}
                    disabled={isDeleting === transaction.id}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Hapus"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

