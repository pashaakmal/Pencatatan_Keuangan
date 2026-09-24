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
        <p className="text-gray-500">Belum ada transaksi. Mulai dengan menambah transaksi baru.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Waktu</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Kategori</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Catatan</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Jenis</th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Jumlah</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900">
                {format(new Date(transaction.date), 'dd MMM yyyy, HH:mm', { locale: idLocale })}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {getCategoryLabel(transaction.category)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {transaction.note || '-'}
              </td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    transaction.type === 'income'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-right font-semibold">
                <span
                  className={
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
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
                    className="text-indigo-600 hover:text-indigo-700 p-1"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(transaction.id)}
                    disabled={isDeleting === transaction.id}
                    className="text-red-600 hover:text-red-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
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
