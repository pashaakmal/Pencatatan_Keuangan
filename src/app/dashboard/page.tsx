'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import type { Transaction } from '@/types/database'
import { getTransactions, deleteTransaction } from '@/app/actions/transactions'
import { AddTransactionModal } from '@/components/AddTransactionModal'
import { EditTransactionModal } from '@/components/EditTransactionModal'
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog'
import { TransactionList } from '@/components/TransactionList'
import { Plus } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

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
  }, [router, supabase.auth])

  const loadTransactions = async () => {
    try {
      const data = await getTransactions()
      setTransactions(data)
    } catch (error) {
      console.error('Failed to load transactions:', error)
    }
  }

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

  // Calculate summary
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const monthlyTransactions = transactions.filter(t => {
    const date = new Date(t.date)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  })

  const totalIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpense = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const balance = totalIncome - totalExpense

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

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
          {/* Welcome */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Selamat datang!
            </h2>
            <p className="text-gray-600">
              Anda login sebagai: <span className="font-medium">{user?.email}</span>
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800">Total Pemasukan</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(totalIncome)}</p>
              <p className="text-sm text-green-600 mt-1">Bulan ini</p>
            </div>
            
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-800">Total Pengeluaran</h3>
              <p className="text-3xl font-bold text-red-600 mt-2">{formatCurrency(totalExpense)}</p>
              <p className="text-sm text-red-600 mt-1">Bulan ini</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800">Saldo</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{formatCurrency(balance)}</p>
              <p className="text-sm text-blue-600 mt-1">Bulan ini</p>
            </div>
          </div>

          {/* Transactions Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Daftar Transaksi</h3>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
                >
                  <Plus size={20} />
                  Tambah Transaksi
                </button>
              </div>

              <TransactionList
                transactions={transactions}
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
