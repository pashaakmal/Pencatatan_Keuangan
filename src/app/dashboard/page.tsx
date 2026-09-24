'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import type { Transaction } from '@/types/database'
import { getTransactions, deleteTransaction } from '@/app/actions/transactions'
import { AddTransactionModal } from '@/components/AddTransactionModal'
import { EditTransactionModal } from '@/components/EditTransactionModal'
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog'
import { TransactionList } from '@/components/TransactionList'
import { SummarySection } from '@/components/dashboard/SummarySection'
import { ExpensePieChart } from '@/components/dashboard/charts/ExpensePieChart'
import { MonthlyTrendChart } from '@/components/dashboard/charts/MonthlyTrendChart'
import { getExpensesByCategory, getMonthlyTrend } from '@/utils/chartHelpers'
import { Plus, Filter } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Filters
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7) // YYYY-MM
  )
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const router = useRouter()
  const supabase = createClient()

  const loadTransactions = useCallback(async () => {
    try {
      const data = await getTransactions()
      setTransactions(data)
    } catch (error) {
      console.error('Failed to load transactions:', error)
    }
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      await loadTransactions()
      setLoading(false)
    }
    getUser()
  }, [router, supabase.auth, loadTransactions])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const handleAddSuccess = async () => {
    await loadTransactions()
  }

  const handleEditClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setShowEditModal(true)
  }

  const handleEditSuccess = async () => {
    await loadTransactions()
  }

  const handleDeleteClick = (id: string) => {
    const transaction = transactions.find(t => t.id === id)
    if (transaction) {
      setSelectedTransaction(transaction)
      setShowDeleteDialog(true)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedTransaction) return
    setDeletingId(selectedTransaction.id)
    try {
      await deleteTransaction(selectedTransaction.id)
      await loadTransactions()
      setShowDeleteDialog(false)
      setSelectedTransaction(null)
    } finally {
      setDeletingId(null)
    }
  }

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    // Month filter (YYYY-MM)
    if (selectedMonth && !t.date.startsWith(selectedMonth)) {
      return false
    }
    // Type filter
    if (selectedType !== 'all' && t.type !== selectedType) {
      return false
    }
    // Category filter
    if (selectedCategory !== 'all') {
      const matchesCategory = selectedCategory === 'lainnya'
        ? t.category === 'lainnya' || !!t.custom_category
        : t.category === selectedCategory
      if (!matchesCategory) return false
    }
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Memuat...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Pencatat Pengeluaran
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Selamat datang!
              </h2>
              <p className="text-gray-600">
                Anda login sebagai: <span className="font-medium">{user?.email}</span>
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium shadow-sm"
            >
              <Plus size={20} />
              Tambah Transaksi
            </button>
          </div>

          <SummarySection />

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ExpensePieChart 
              data={getExpensesByCategory(transactions)} 
              isLoading={loading} 
            />
            <MonthlyTrendChart 
              data={getMonthlyTrend(transactions)} 
              isLoading={loading} 
            />
          </div>

          {/* Transactions Filter & List Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Daftar Transaksi</h3>
                
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Filter size={16} />
                    <span>Filter:</span>
                  </div>
                  
                  {/* Month Picker */}
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  {/* Type Filter */}
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">Semua Jenis</option>
                    <option value="income">Pemasukan</option>
                    <option value="expense">Pengeluaran</option>
                  </select>

                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="makanan">Makanan</option>
                    <option value="transportasi">Transportasi</option>
                    <option value="hiburan">Hiburan</option>
                    <option value="tagihan">Tagihan</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <TransactionList
                transactions={filteredTransactions}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                isDeleting={deletingId}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />

      <EditTransactionModal
        isOpen={showEditModal}
        transaction={selectedTransaction}
        onClose={() => {
          setShowEditModal(false)
          setSelectedTransaction(null)
        }}
        onSuccess={handleEditSuccess}
      />

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false)
          setSelectedTransaction(null)
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={!!deletingId}
      />
    </div>
  )
}
