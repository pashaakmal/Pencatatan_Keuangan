# Panduan Menjalankan Skema Database di Supabase

Berikut adalah langkah-langkah mudah untuk membuat tabel `transactions` dan mengaktifkan Row Level Security (RLS) di Supabase:

---

### Langkah 1: Buka Dashboard Supabase
1. Masuk ke dashboard proyek Supabase Anda:
   👉 **[Dashboard Supabase - SQL Editor](https://supabase.com/dashboard/project/cqpzwklxzyxgikpitlsv/sql)**
2. Pastikan Anda berada di proyek yang sesuai (`cqpzwklxzyxgikpitlsv`).

---

### Langkah 2: Buka SQL Editor
1. Di bilah navigasi sebelah kiri, klik menu **SQL Editor** (ikon tanda kurung siku `>_` atau lembaran dokumen SQL).
2. Klik tombol **+ New query** di bagian atas untuk membuat lembar kerja baru.

---

### Langkah 3: Jalankan Skrip SQL
1. Buka file [`supabase/schema.sql`](../supabase/schema.sql) di VS Code.
2. Salin (**Copy**) seluruh isi file tersebut.
3. Tempel (**Paste**) kode tersebut ke dalam lembar kerja query di SQL Editor Supabase.
4. Klik tombol hijau **Run** (atau tekan `Ctrl + Enter`).

---

### Langkah 4: Verifikasi
1. Setelah muncul pesan sukses (*Success. No rows returned*):
2. Buka menu **Table Editor** di bilah navigasi kiri.
3. Anda akan melihat tabel baru bernama **`transactions`**.
4. Klik tabel tersebut, lalu perhatikan ikon **RLS enabled** (gembok hijau) aktif di kanan atas tabel.
5. Selesai! Database siap digunakan untuk tahap Autentikasi dan CRUD Transaksi.
