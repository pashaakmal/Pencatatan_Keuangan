// ==========================================================
// Tipe Data TypeScript untuk Supabase Database & Transactions
// ==========================================================

export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'makanan'
  | 'transportasi'
  | 'hiburan'
  | 'tagihan'
  | 'lainnya';

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string; // Format: YYYY-MM-DD
  note: string | null;
  created_at: string; // ISO Timestamp
}

export type TransactionInsert = Omit<Transaction, 'id' | 'user_id' | 'created_at'> & {
  id?: string;
  user_id?: string;
  created_at?: string;
};

export type TransactionUpdate = Partial<TransactionInsert>;

// Konstanta label untuk tampilan form & UI
export const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
  { value: 'expense', label: 'Pengeluaran' },
  { value: 'income', label: 'Pemasukan' },
];

export const TRANSACTION_CATEGORIES: { value: TransactionCategory; label: string }[] = [
  { value: 'makanan', label: 'Makanan' },
  { value: 'transportasi', label: 'Transportasi' },
  { value: 'hiburan', label: 'Hiburan' },
  { value: 'tagihan', label: 'Tagihan' },
  { value: 'lainnya', label: 'Lainnya' },
];
