# Phase 4 - Transaction Management (CRUD Transaksi)

## Deskripsi
Mengimplementasikan fitur manajemen transaksi meliputi: tambah transaksi baru, tampilkan daftar transaksi, edit transaksi, dan hapus transaksi. Semua operasi terhubung ke database Supabase dengan Row Level Security (RLS) yang sudah dikonfigurasi.

---

## Tasks

### A. Setup Database
- [ ] Pastikan tabel `transactions` sudah dibuat di Supabase (jalankan `supabase/schema.sql` jika belum)
- [ ] Verifikasi RLS policies sudah aktif
- [ ] Buat TypeScript types untuk tabel transactions (update `src/types/database.ts`)

### B. Halaman Tambah Transaksi
- [ ] Buat halaman atau modal form tambah transaksi (`/dashboard/transactions/new` atau modal)
- [ ] Form memiliki field:
  - **Jumlah** (number, wajib, > 0)
  - **Jenis** (select: income/expense, wajib)
  - **Kategori** (select: makanan, transportasi, hiburan, tagihan, lainnya, wajib)
  - **Tanggal** (date picker, wajib, default hari ini)
  - **Catatan** (textarea, opsional)
- [ ] Validasi sisi klien:
  - Jumlah wajib diisi dan harus lebih besar dari 0
  - Jenis wajib dipilih
  - Kategori wajib dipilih
  - Tanggal wajib diisi
- [ ] Panggil Supabase INSERT saat form di-submit
- [ ] Tampilkan pesan sukses/error
- [ ] Redirect atau refresh dashboard setelah berhasil

### C. Daftar Transaksi
- [ ] Tampilkan daftar transaksi di dashboard atau halaman terpisah
- [ ] Ambil data dari Supabase dengan filter `user_id` (otomatis via RLS)
- [ ] Tampilkan informasi:
  - Tanggal
  - Kategori
  - Catatan
  - Jenis transaksi (income/expense)
  - Jumlah (format rupiah)
  - Tombol Edit
  - Tombol Hapus
- [ ] Urutkan berdasarkan tanggal terbaru
- [ ] Implementasikan pagination atau limit (misal 10 transaksi terakhir)

### D. Edit Transaksi
- [ ] Buat halaman atau modal edit transaksi (`/dashboard/transactions/[id]/edit` atau modal)
- [ ] Pre-fill form dengan data transaksi yang ada
- [ ] Validasi sama dengan form tambah
- [ ] Panggil Supabase UPDATE saat form di-submit
- [ ] Tampilkan pesan sukses/error
- [ ] Refresh data setelah berhasil

### E. Hapus Transaksi
- [ ] Tambahkan konfirmasi sebelum hapus (modal/dialog)
- [ ] Pesan konfirmasi: "Hapus transaksi ini? Tindakan ini tidak dapat dibatalkan."
- [ ] Tombol: [Batal] [Hapus]
- [ ] Panggil Supabase DELETE saat dikonfirmasi
- [ ] Refresh daftar transaksi setelah berhasil

### F. UI/UX
- [ ] Responsif untuk desktop dan mobile
- [ ] Format mata uang Rupiah (Rp X.XXX.XXX)
- [ ] Format tanggal (misal: 22 Sep 2026)
- [ ] Warna berbeda untuk income (hijau) dan expense (merah)
- [ ] Tombol "Tambah Transaksi" mudah dijangkau

---

## Referensi PRD
- **Section 5 (Scope MVP):** Transaction Management - CRUD transaksi
- **Section 7.2 (User Flow Transaksi):** Dashboard → Tambah Transaksi → Isi Form → Validasi → Simpan
- **Section 7.3 (User Flow Pengelolaan Transaksi):** Daftar Transaksi → Edit/Hapus
- **Section 11 (Tambah Transaksi):** Form field dan validasi
- **Section 12 (Daftar Transaksi):** Informasi yang ditampilkan
- **Section 13 (Edit Transaksi):** Form edit dan update database
- **Section 14 (Hapus Transaksi):** Konfirmasi dan delete

---

## Database Schema (sudah ada di `supabase/schema.sql`)
```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    category TEXT NOT NULL CHECK (category IN ('makanan', 'transportasi', 'hiburan', 'tagihan', 'lainnya')),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## Acceptance Criteria
- [ ] Pengguna dapat menambah transaksi baru dengan semua field yang diperlukan
- [ ] Validasi mencegah input tidak valid (jumlah ≤ 0, field kosong, dll)
- [ ] Daftar transaksi menampilkan data milik pengguna yang sedang login
- [ ] Pengguna dapat mengedit transaksi yang sudah ada
- [ ] Pengguna dapat menghapus transaksi dengan konfirmasi
- [ ] Format mata uang dan tanggal sesuai standar Indonesia
- [ ] Tidak ada error TypeScript saat `npm run build`
- [ ] Data terisolasi per user (RLS berfungsi)

---

## Notes
- Prioritaskan modal untuk form tambah/edit agar UX lebih seamless
- Pertimbangkan optimistic UI update untuk pengalaman yang lebih cepat
- Gunakan server actions atau API routes untuk operasi database
- Pastikan error handling yang baik di setiap operasi
