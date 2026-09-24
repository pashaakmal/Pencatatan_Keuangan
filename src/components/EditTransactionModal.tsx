'use client'

import { useState, useEffect } from 'react'
import { updateTransaction } from '@/app/actions/transactions'
import { TRANSACTION_TYPES, TRANSACTION_CATEGORIES } from '@/types/database'
import type { Transaction, TransactionUpdate } from '@/types/database'
import { format } from 'date-fns'

interface EditTransactionModalProps {
  isOpen: boolean
  transaction: Transaction | null
  onClose: () => void
  onSuccess: () => void
}

export function EditTransactionModal({ isOpen, transaction, onClose, onSuccess }: EditTransactionModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCustomCategory, setShowCustomCategory] = useState(false)

  const [transactionDate, setTransactionDate] = useState('')
  const [transactionTime, setTransactionTime] = useState('')

  const [formData, setFormData] = useState<TransactionUpdate>({
    amount: 0,
    type: 'expense',
    category: 'makanan',
    custom_category: null,
    date: new Date().toISOString(),
    note: null,
  })

  useEffect(() => {
    if (transaction) {
      const d = new Date(transaction.date)
      const dateStr = format(d, 'yyyy-MM-dd')
      const timeStr = format(d, 'HH:mm')
      
      const isKnownCategory = TRANSACTION_CATEGORIES.some(c => c.value === transaction.category)
      const isCustom = !isKnownCategory || !!transaction.custom_category
      
      setTransactionDate(dateStr)
      setTransactionTime(timeStr)
      setShowCustomCategory(isCustom)

      setFormData({
        amount: transaction.amount,
        type: transaction.type,
        category: isCustom ? 'lainnya' : transaction.category,
        custom_category: isCustom ? (transaction.custom_category || transaction.category) : null,
        date: transaction.date,
        note: transaction.note,
      })
    }
  }, [transaction])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === 'amount') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
    } else if (name === 'note') {
      setFormData(prev => ({ ...prev, [name]: value || null }))
    } else if (name === 'category') {
      const isCustom = value === 'lainnya'
      setShowCustomCategory(isCustom)
      setFormData(prev => ({ 
        ...prev, 
        category: value,
        custom_category: isCustom ? prev.custom_category || '' : null
      }))
    } else if (name === 'custom_category') {
      setFormData(prev => ({ ...prev, custom_category: value }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleDateTimeChange = () => {
    const dateTime = new Date(`${transactionDate}T${transactionTime}`)
    setFormData(prev => ({ ...prev, date: dateTime.toISOString() }))
  }

  const validateForm = () => {
    if (!formData.amount || formData.amount <= 0) {
      setError('Jumlah harus lebih besar dari 0')
      return false
    }
    if (!formData.type) {
      setError('Jenis transaksi harus dipilih')
      return false
    }
    if (!formData.category) {
      setError('Kategori harus dipilih')
      return false
    }
    if (formData.category === 'lainnya' && !formData.custom_category?.trim()) {
      setError('Kategori custom harus diisi')
      return false
    }
    if (!transactionDate) {
      setError('Tanggal harus diisi')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    handleDateTimeChange()

    if (!transaction || !validateForm()) return

    setLoading(true)

    try {
      const submitData = {
        ...formData,
        category: formData.category === 'lainnya' && formData.custom_category 
          ? formData.custom_category 
          : formData.category,
        custom_category: formData.category === 'lainnya' ? formData.custom_category : null
      }

      await updateTransaction(transaction.id, submitData)
      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengubah transaksi')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !transaction) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Transaksi</h2>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah *
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              inputMode="decimal"
              step="1"
              min="1"
              required
              value={formData.amount || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Jenis *
            </label>
            <select
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {TRANSACTION_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Kategori *
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {TRANSACTION_CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {showCustomCategory && (
            <div>
              <label htmlFor="custom_category" className="block text-sm font-medium text-gray-700 mb-1">
                Nama Kategori *
              </label>
              <input
                id="custom_category"
                name="custom_category"
                type="text"
                required
                value={formData.custom_category || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Masukkan nama kategori..."
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal *
              </label>
              <input
                id="date"
                name="date"
                type="date"
                required
                value={transactionDate}
                onChange={(e) => {
                  setTransactionDate(e.target.value)
                  setTimeout(handleDateTimeChange, 0)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Waktu *
              </label>
              <input
                id="time"
                name="time"
                type="time"
                required
                value={transactionTime}
                onChange={(e) => {
                  setTransactionTime(e.target.value)
                  setTimeout(handleDateTimeChange, 0)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
              Catatan (Opsional)
            </label>
            <textarea
              id="note"
              name="note"
              value={formData.note || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Catatan tambahan..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
