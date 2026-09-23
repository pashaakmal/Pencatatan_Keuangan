-- ==========================================================
-- Skema Database: Pencatat Pengeluaran Pribadi
-- Tabel: transactions
-- Deskripsi: Menyimpan riwayat pemasukan dan pengeluaran user
-- ==========================================================

-- 1. Buat tabel transactions jika belum ada
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    category TEXT NOT NULL CHECK (category IN ('makanan', 'transportasi', 'hiburan', 'tagihan', 'lainnya')),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Buat index untuk mempercepat query berdasarkan user dan tanggal
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions(user_id, date DESC);

-- 3. Aktifkan Row Level Security (RLS)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 4. Kebijakan Keamanan (RLS Policies)

-- A. SELECT: Pengguna hanya dapat membaca transaksi miliknya sendiri
CREATE POLICY "Users can view their own transactions"
    ON public.transactions
    FOR SELECT
    USING (auth.uid() = user_id);

-- B. INSERT: Pengguna hanya dapat menambahkan data dengan user_id miliknya
CREATE POLICY "Users can insert their own transactions"
    ON public.transactions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- C. UPDATE: Pengguna hanya dapat mengedit transaksi miliknya sendiri
CREATE POLICY "Users can update their own transactions"
    ON public.transactions
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- D. DELETE: Pengguna hanya dapat menghapus transaksi miliknya sendiri
CREATE POLICY "Users can delete their own transactions"
    ON public.transactions
    FOR DELETE
    USING (auth.uid() = user_id);
