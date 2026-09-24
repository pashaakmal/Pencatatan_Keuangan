import { Transaction } from '@/types/database'

export interface CategoryExpense {
  name: string
  value: number
  color?: string
}

export interface MonthlyData {
  month: string
  income: number
  expense: number
}

const CATEGORY_COLORS: Record<string, string> = {
  makanan: '#EF4444',
  transportasi: '#F97316',
  hiburan: '#8B5CF6',
  tagihan: '#3B82F6',
  lainnya: '#6B7280',
}

/**
 * Aggregate expenses by category for current month
 */
export function getExpensesByCategory(transactions: Transaction[]): CategoryExpense[] {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const expenses = transactions.filter(t => {
    const date = new Date(t.date)
    return (
      t.type === 'expense' &&
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    )
  })

  const categoryMap = new Map<string, number>()

  expenses.forEach(expense => {
    const category = expense.category || 'lainnya'
    const current = categoryMap.get(category) || 0
    categoryMap.set(category, current + Number(expense.amount))
  })

  return Array.from(categoryMap.entries())
    .map(([name, value]) => ({
      name: formatCategoryName(name),
      value,
      color: CATEGORY_COLORS[name] || CATEGORY_COLORS.lainnya,
    }))
    .sort((a, b) => b.value - a.value)
}

/**
 * Aggregate income and expense by month (last 6 months)
 */
export function getMonthlyTrend(transactions: Transaction[]): MonthlyData[] {
  const now = new Date()
  const months: Record<string, { income: number; expense: number }> = {}

  // Initialize last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = date.toISOString().slice(0, 7) // YYYY-MM
    months[key] = { income: 0, expense: 0 }
  }

  // Aggregate transactions
  transactions.forEach(t => {
    const key = t.date.slice(0, 7) // YYYY-MM
    if (months[key]) {
      if (t.type === 'income') {
        months[key].income += Number(t.amount)
      } else {
        months[key].expense += Number(t.amount)
      }
    }
  })

  // Convert to array with formatted month labels
  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthStr, data]) => ({
      month: formatMonthLabel(monthStr),
      income: data.income,
      expense: data.expense,
    }))
}

function formatCategoryName(category: string): string {
  const labels: Record<string, string> = {
    makanan: 'Makanan',
    transportasi: 'Transportasi',
    hiburan: 'Hiburan',
    tagihan: 'Tagihan',
    lainnya: 'Lainnya',
  }
  return labels[category] || category
}

function formatMonthLabel(monthStr: string): string {
  const [year, month] = monthStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('id-ID', { year: '2-digit', month: 'short' })
}
