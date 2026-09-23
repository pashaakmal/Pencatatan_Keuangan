'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
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
      setLoading(false)
    }
    getUser()
  }, [router, supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
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
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Selamat datang!
              </h2>
              <p className="text-gray-600">
                Anda login sebagai: <span className="font-medium">{user?.email}</span>
              </p>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800">Total Pemasukan</h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">Rp 0</p>
                  <p className="text-sm text-green-600 mt-1">Bulan ini</p>
                </div>
                
                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                  <h3 className="text-lg font-semibold text-red-800">Total Pengeluaran</h3>
                  <p className="text-3xl font-bold text-red-600 mt-2">Rp 0</p>
                  <p className="text-sm text-red-600 mt-1">Bulan ini</p>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800">Saldo</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">Rp 0</p>
                  <p className="text-sm text-blue-600 mt-1">Bulan ini</p>
                </div>
              </div>
              
              <div className="mt-8">
                <p className="text-gray-500 text-center py-8">
                  Fitur transaksi akan segera hadir di phase selanjutnya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
