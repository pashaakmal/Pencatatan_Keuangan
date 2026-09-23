Product Requirements Document (PRD)
1. Informasi Proyek
Item	Detail
Nama proyek	Pencatat Pengeluaran Pribadi
Jenis aplikasi	Web Application
Tujuan	Latihan vibe coding dan pengembangan aplikasi dari database, authentication, CRUD, hingga visualisasi data
Target pengguna	Satu pengguna / personal use
Versi	MVP / Version 1
Platform	Web
Bahasa antarmuka	Bahasa Indonesia
________________________________________
2. Latar Belakang
Aplikasi Pencatat Pengeluaran Pribadi merupakan aplikasi web sederhana yang digunakan untuk mencatat pemasukan dan pengeluaran harian.
Selain sebagai aplikasi pencatatan keuangan pribadi, proyek ini dibuat sebagai latihan membangun aplikasi secara end-to-end, mulai dari perancangan database, authentication, operasi CRUD, proteksi halaman, hingga penyajian data dalam bentuk grafik.
Aplikasi menggunakan sistem login meskipun target pengguna hanya satu orang. Hal tersebut bertujuan untuk mempraktikkan konsep authentication dan pembatasan akses data berdasarkan pengguna.
________________________________________
3. Tujuan Produk
Produk memiliki tujuan utama:
1.	Memungkinkan pengguna mencatat pemasukan dan pengeluaran secara digital.
2.	Memungkinkan pengguna melihat riwayat transaksi.
3.	Memungkinkan pengguna mengubah dan menghapus transaksi.
4.	Menampilkan ringkasan kondisi keuangan pada bulan berjalan.
5.	Menampilkan visualisasi pengeluaran berdasarkan kategori.
6.	Menampilkan tren pemasukan dan pengeluaran dari waktu ke waktu.
7.	Menjadi proyek latihan untuk memahami alur pengembangan aplikasi menggunakan Next.js dan Supabase.
________________________________________
4. Target Pengguna
Pengguna utama
Satu pengguna yang menggunakan aplikasi untuk kebutuhan pencatatan keuangan pribadi.
Karakteristik pengguna:
•	Memiliki akun yang digunakan untuk login.
•	Dapat mencatat pemasukan dan pengeluaran pribadi.
•	Membutuhkan ringkasan kondisi keuangan bulanan.
•	Membutuhkan riwayat transaksi yang mudah dikelola.
•	Tidak membutuhkan fitur multi-user atau kolaborasi pada versi MVP.
________________________________________
5. Scope MVP
Fitur yang wajib tersedia pada versi pertama:
Authentication
•	Register menggunakan email dan password.
•	Login menggunakan email dan password.
•	Logout.
•	Proteksi halaman yang membutuhkan authentication.
Transaction Management
•	Menambahkan transaksi.
•	Menampilkan daftar transaksi.
•	Mengedit transaksi.
•	Menghapus transaksi.
•	Membedakan transaksi pemasukan dan pengeluaran.
Dashboard
•	Total pemasukan bulan berjalan.
•	Total pengeluaran bulan berjalan.
•	Saldo bulan berjalan.
•	Grafik pengeluaran berdasarkan kategori.
•	Grafik tren pemasukan dan pengeluaran.
Category
Kategori tetap yang tersedia:
•	Makanan
•	Transportasi
•	Hiburan
•	Tagihan
•	Lainnya
Pengguna belum dapat membuat kategori sendiri pada versi MVP.
________________________________________
6. Fitur di Luar Scope MVP
Fitur berikut tidak perlu dibuat pada versi pertama:
1.	Budget per kategori.
2.	Peringatan ketika budget terlampaui.
3.	Export transaksi ke CSV.
4.	Kategori kustom.
5.	Mode gelap.
6.	Multi-user management.
7.	Integrasi bank atau e-wallet.
8.	Notifikasi otomatis.
9.	Import data transaksi.
Fitur tersebut dapat dipertimbangkan untuk versi berikutnya.
________________________________________
7. User Flow
7.1 User Flow Authentication
Landing / Login
       │
       ├── Belum memiliki akun
       │        ↓
       │     Register
       │        ↓
       │     Login
       │
       └── Sudah memiliki akun
                ↓
              Login
                ↓
            Dashboard
7.2 User Flow Transaksi
Dashboard
    ↓
Tambah Transaksi
    ↓
Isi Form
    ↓
Validasi
    ↓
Simpan ke Database
    ↓
Kembali / Refresh Dashboard
7.3 User Flow Pengelolaan Transaksi
Daftar Transaksi
      │
      ├── Edit
      │    ↓
      │  Form Edit
      │    ↓
      │  Update Database
      │
      └── Hapus
           ↓
       Konfirmasi
           ↓
       Delete Database
________________________________________
8. Struktur Data
Table: transactions
Field	Type	Required	Description
id	UUID	Ya	ID unik transaksi
user_id	UUID	Ya	ID pengguna dari Supabase Auth
amount	Numeric	Ya	Nominal transaksi
type	Enum/Text	Ya	income atau expense
category	Text	Ya	Kategori transaksi
date	Date	Ya	Tanggal transaksi
note	Text	Tidak	Catatan tambahan
created_at	Timestamp	Ya	Waktu data dibuat
Nilai type
income
expense
Nilai category
makanan
transportasi
hiburan
tagihan
lainnya
________________________________________
9. Database Security
Karena aplikasi menggunakan authentication, setiap transaksi harus dikaitkan dengan user_id.
Pengguna hanya boleh:
•	Melihat transaksi miliknya sendiri.
•	Membuat transaksi dengan user_id miliknya.
•	Mengubah transaksi miliknya sendiri.
•	Menghapus transaksi miliknya sendiri.
Implementasi pembatasan akses menggunakan Row Level Security (RLS) pada Supabase.
Konsep akses:
User A
  ├── Transaction A1
  ├── Transaction A2
  └── Transaction A3

User B
  ├── Transaction B1
  └── Transaction B2
User A tidak boleh membaca atau memodifikasi transaksi milik User B.
________________________________________
10. Detail Fitur
10.1 Register
Tujuan
Membuat akun baru agar pengguna dapat menggunakan aplikasi.
Input
•	Email
•	Password
•	Konfirmasi password
Validasi
•	Email wajib diisi.
•	Format email harus valid.
•	Password wajib diisi.
•	Password harus memenuhi aturan minimum Supabase.
•	Password dan konfirmasi password harus sama.
Output
Jika berhasil:
Akun berhasil dibuat.
Silakan login.
Jika gagal:
Email sudah digunakan.
atau pesan error yang sesuai dari authentication service.
________________________________________
10.2 Login
Input
•	Email
•	Password
Behavior
1.	Pengguna mengisi email dan password.
2.	Sistem melakukan autentikasi melalui Supabase Auth.
3.	Jika berhasil, pengguna diarahkan ke Dashboard.
4.	Jika gagal, tampilkan pesan error.
________________________________________
10.3 Logout
Pengguna dapat melakukan logout melalui tombol logout pada dashboard.
Setelah logout:
Session dihapus
       ↓
Redirect ke Login
________________________________________
11. Tambah Transaksi
Pengguna dapat membuat transaksi baru melalui tombol Tambah Transaksi.
Form
Field	Input
Jumlah	Number
Jenis	Income / Expense
Kategori	Select
Tanggal	Date
Catatan	Textarea, opsional
Contoh
Jumlah
Rp50.000

Jenis
Pengeluaran

Kategori
Makanan

Tanggal
22 September 2026

Catatan
Makan siang
Validasi
•	Jumlah wajib diisi.
•	Jumlah harus lebih besar dari 0.
•	Jenis wajib dipilih.
•	Kategori wajib dipilih.
•	Tanggal wajib diisi.
•	Catatan bersifat opsional.
________________________________________
12. Daftar Transaksi
Dashboard atau halaman transaksi menampilkan daftar transaksi pengguna.
Informasi yang ditampilkan:
•	Tanggal
•	Kategori
•	Catatan
•	Jenis transaksi
•	Jumlah
•	Tombol edit
•	Tombol hapus
Contoh:
Tanggal	Kategori	Catatan	Jenis	Jumlah	Action
22 Sep	Makanan	Makan siang	Pengeluaran	Rp50.000	Edit / Hapus
21 Sep	Transportasi	Bensin	Pengeluaran	Rp100.000	Edit / Hapus
20 Sep	-	Gaji	Pemasukan	Rp5.000.000	Edit / Hapus
Transaksi dapat diurutkan berdasarkan tanggal terbaru.
________________________________________
13. Edit Transaksi
Pengguna dapat memilih tombol Edit pada transaksi.
Form edit menggunakan field yang sama dengan form tambah transaksi.
Setelah pengguna menyimpan perubahan:
Form Edit
    ↓
Validasi
    ↓
Update Database
    ↓
Refresh Data
________________________________________
14. Hapus Transaksi
Pengguna dapat menghapus transaksi melalui tombol Hapus.
Sebelum data dihapus, sistem menampilkan konfirmasi.
Contoh:
Hapus transaksi ini?

Tindakan ini tidak dapat dibatalkan.

[Batal] [Hapus]
Jika dikonfirmasi, transaksi dihapus dari database.
________________________________________
15. Dashboard
Dashboard merupakan halaman utama setelah pengguna berhasil login.
Komponen Dashboard
Summary Cards
Tampilkan:
Total Pemasukan
Rp5.000.000

Total Pengeluaran
Rp1.750.000

Saldo
Rp3.250.000
Periode perhitungan:
Bulan berjalan
Saldo dihitung dari:
Total pemasukan - Total pengeluaran
________________________________________
16. Grafik Pengeluaran Berdasarkan Kategori
Gunakan Recharts untuk menampilkan distribusi pengeluaran berdasarkan kategori.
Contoh data:
Makanan       Rp750.000
Transportasi  Rp400.000
Hiburan       Rp250.000
Tagihan       Rp300.000
Lainnya       Rp50.000
Jenis grafik yang digunakan:
Pie Chart / Donut Chart
Tujuan:
Pengguna dapat melihat kategori mana yang memiliki kontribusi terbesar terhadap pengeluaran bulan berjalan.
Jika belum ada transaksi pengeluaran:
Belum ada data pengeluaran bulan ini.
________________________________________
17. Grafik Tren Bulanan
Gunakan Recharts untuk menampilkan perubahan pemasukan dan pengeluaran.
Jenis grafik:
Line Chart
Contoh:
Bulan       Income       Expense

Mei         5.000.000    1.800.000
Juni        5.000.000    2.100.000
Juli        5.500.000    2.000.000
Agustus     5.000.000    2.300.000
September   5.000.000    1.750.000
Grafik memiliki dua data series:
•	Pemasukan
•	Pengeluaran
Periode dapat menggunakan beberapa bulan terakhir agar tren keuangan dapat terlihat.
________________________________________
18. Struktur Halaman
Struktur halaman yang disarankan:
/
├── login
├── register
└── dashboard
    ├── summary
    ├── charts
    └── transactions
Jika ingin memisahkan halaman transaksi:
/
├── login
├── register
└── dashboard
    ├── page
    └── transactions
        ├── page
        ├── new
        └── [id]
Untuk MVP sederhana, form tambah/edit dapat menggunakan modal sehingga tidak perlu terlalu banyak halaman.
________________________________________
19. UI/UX
Gaya Visual
Aplikasi menggunakan desain yang:
•	Sederhana.
•	Bersih.
•	Responsif.
•	Fokus pada informasi keuangan.
•	Mudah digunakan pada desktop maupun mobile.
Layout Desktop
┌─────────────────────────────────────────────┐
│ Logo             Dashboard       Logout     │
├─────────────────────────────────────────────┤
│                                             │
│  Total Income   Total Expense    Balance    │
│                                             │
├──────────────────────┬──────────────────────┤
│                      │                      │
│ Expense by Category  │ Monthly Trend       │
│                      │                      │
├──────────────────────┴──────────────────────┤
│                                             │
│ Recent Transactions          [+ Add]        │
│                                             │
│ Date | Category | Type | Amount | Actions   │
│                                             │
└─────────────────────────────────────────────┘
Responsive
Pada layar mobile:
•	Summary card dapat ditampilkan secara vertikal.
•	Grafik disusun satu per satu.
•	Tabel transaksi dapat menggunakan card/list.
•	Tombol tambah transaksi mudah dijangkau.
________________________________________
20. Tech Stack
Frontend
•	Next.js
•	React
•	Tailwind CSS
•	Lucide React
Backend / Database
•	Supabase
•	PostgreSQL
•	Supabase Authentication
Data Visualization
•	Recharts
Utility
•	date-fns
Dependencies
{
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "@supabase/supabase-js": "latest",
    "@supabase/ssr": "latest",
    "recharts": "latest",
    "date-fns": "latest",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "tailwindcss": "latest",
    "postcss": "latest",
    "autoprefixer": "latest"
  }
}
________________________________________
21. Arsitektur Sederhana
                    Browser
                       │
                       ▼
              ┌─────────────────┐
              │    Next.js      │
              │    App Router   │
              └────────┬────────┘
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
      Supabase Auth         Supabase Client
             │                   │
             │                   ▼
             │             PostgreSQL
             │                   │
             └──────────┬────────┘
                        │
                        ▼
                   Transactions
________________________________________
22. Environment Variables
Project membutuhkan environment variable:
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
Nilai diperoleh dari project Supabase.
Jangan menyimpan credential sensitif secara langsung di source code.
________________________________________
23. Urutan Development
Development dilakukan secara bertahap agar setiap bagian dapat diuji sebelum melanjutkan ke tahap berikutnya.
Phase 1 - Project Setup
Tasks:
•	Membuat project Next.js.
•	Mengaktifkan Tailwind CSS.
•	Install dependencies.
•	Membuat struktur folder.
•	Membuat koneksi Supabase.
•	Membuat environment variables.
Acceptance criteria:
•	Project dapat dijalankan dengan npm run dev.
•	Tidak terdapat error build.
•	Aplikasi berhasil terhubung dengan Supabase.
________________________________________
Phase 2 - Database
Tasks:
•	Membuat table transactions.
•	Menentukan tipe data.
•	Membuat foreign key user_id.
•	Mengaktifkan RLS.
•	Membuat policy untuk operasi CRUD.
Acceptance criteria:
•	Table berhasil dibuat.
•	Data transaksi memiliki hubungan dengan user.
•	User hanya dapat mengakses transaksi miliknya.
________________________________________
Phase 3 - Authentication
Tasks:
•	Membuat halaman register.
•	Membuat halaman login.
•	Membuat logout.
•	Mengelola session.
•	Membuat proteksi halaman dashboard.
•	Mengarahkan user yang belum login ke /login.
Acceptance criteria:
•	User dapat register.
•	User dapat login.
•	User dapat logout.
•	Dashboard tidak dapat diakses tanpa login.
________________________________________
Phase 4 - Transaction CRUD
Tasks:
•	Membuat form tambah transaksi.
•	Membuat validasi form.
•	Insert data ke Supabase.
•	Menampilkan daftar transaksi.
•	Membuat fitur edit.
•	Membuat fitur delete.
•	Membuat konfirmasi sebelum delete.
Acceptance criteria:
•	User dapat membuat transaksi.
•	Transaksi muncul pada daftar.
•	User dapat mengubah transaksi.
•	User dapat menghapus transaksi.
•	Data tetap tersimpan setelah refresh.
________________________________________
Phase 5 - Dashboard
Tasks:
•	Menghitung total pemasukan.
•	Menghitung total pengeluaran.
•	Menghitung saldo.
•	Membatasi summary berdasarkan bulan berjalan.
•	Menampilkan transaksi terbaru.
Acceptance criteria:
•	Nilai summary sesuai dengan data database.
•	Perhitungan hanya menggunakan data user yang sedang login.
•	Perhitungan bulan berjalan berjalan dengan benar.
________________________________________
Phase 6 - Data Visualization
Tasks:
•	Membuat Pie/Donut Chart pengeluaran berdasarkan kategori.
•	Membuat Line Chart tren pemasukan dan pengeluaran.
•	Menghubungkan grafik dengan data Supabase.
•	Menangani kondisi ketika belum ada data.
Acceptance criteria:
•	Grafik menampilkan data aktual.
•	Grafik berubah ketika transaksi berubah.
•	Tidak terjadi error ketika database kosong.
________________________________________
Phase 7 - Final Polish
Tasks:
•	Responsive design.
•	Loading state.
•	Empty state.
•	Error state.
•	Toast/feedback setelah CRUD.
•	Konfirmasi delete.
•	Validasi input.
•	Perbaikan spacing dan typography.
•	Testing pada desktop dan mobile.
________________________________________
24. Error & Loading State
Aplikasi harus memiliki kondisi untuk:
Loading
Memuat data...
Empty
Belum ada transaksi.
Mulai tambahkan transaksi pertama Anda.
Error
Terjadi kesalahan saat memuat data.
Silakan coba lagi.
Success
Transaksi berhasil ditambahkan.
________________________________________
25. Non-Functional Requirements
Performance
•	Dashboard harus dapat dimuat tanpa proses yang tidak diperlukan.
•	Query database hanya mengambil data yang diperlukan.
•	Grafik tidak melakukan query database secara berulang tanpa alasan.
Security
•	Authentication menggunakan Supabase Auth.
•	RLS wajib diaktifkan.
•	Data transaksi harus terkait dengan user_id.
•	Supabase key tidak ditulis secara hardcode pada source code.
•	Input pengguna harus divalidasi.
Responsiveness
Aplikasi harus dapat digunakan pada:
•	Desktop
•	Tablet
•	Mobile
Maintainability
Kode dibuat dengan komponen yang terpisah berdasarkan tanggung jawab.
Contoh:
components/
├── Navbar
├── SummaryCard
├── TransactionForm
├── TransactionList
├── ExpenseChart
└── MonthlyTrendChart
________________________________________
26. Acceptance Criteria MVP
MVP dianggap selesai apabila seluruh kondisi berikut terpenuhi:
Authentication
•	User dapat melakukan register.
•	User dapat melakukan login.
•	User dapat melakukan logout.
•	Halaman dashboard terlindungi.
•	Session tetap berjalan ketika halaman di-refresh.
Transaction
•	User dapat menambahkan pemasukan.
•	User dapat menambahkan pengeluaran.
•	User dapat memilih kategori.
•	User dapat menentukan tanggal.
•	User dapat menambahkan catatan.
•	User dapat melihat transaksi.
•	User dapat mengedit transaksi.
•	User dapat menghapus transaksi.
Dashboard
•	Total pemasukan bulan berjalan tampil.
•	Total pengeluaran bulan berjalan tampil.
•	Saldo bulan berjalan tampil.
•	Grafik pengeluaran berdasarkan kategori tampil.
•	Grafik tren bulanan tampil.
•	Data dashboard sesuai dengan database.
Security
•	RLS aktif.
•	User hanya dapat mengakses datanya sendiri.
•	User yang belum login tidak dapat mengakses dashboard.
UI
•	Responsive.
•	Loading state tersedia.
•	Empty state tersedia.
•	Error state tersedia.
•	Feedback setelah operasi CRUD tersedia.
________________________________________
27. Future Development
Setelah MVP stabil, fitur dapat dikembangkan dengan urutan:
Version 1.1
•	Budget per kategori.
•	Peringatan ketika pengeluaran mendekati atau melewati budget.
Version 1.2
•	Kategori kustom.
•	Filter transaksi berdasarkan kategori dan jenis.
Version 1.3
•	Export data ke CSV.
•	Filter berdasarkan rentang tanggal.
Version 1.4
•	Dark mode.
•	Peningkatan tampilan dashboard.
________________________________________
28. Prinsip Development
Selama proses vibe coding, pengembangan dilakukan secara bertahap.
Prinsip utama:
1.	Jangan membuat semua fitur sekaligus.
2.	Pastikan database dan authentication bekerja sebelum membuat UI kompleks.
3.	Selesaikan satu fitur sampai dapat diuji sebelum berpindah ke fitur berikutnya.
4.	Gunakan komponen reusable.
5.	Jangan mengorbankan security demi mempercepat development.
6.	Setelah setiap fase selesai, lakukan testing sederhana.
7.	Prioritaskan fungsi MVP sebelum fitur tambahan.
Urutan utama:
Project Setup
      ↓
Database
      ↓
Authentication
      ↓
Transaction CRUD
      ↓
Dashboard
      ↓
Charts
      ↓
Responsive UI
      ↓
Testing
      ↓
MVP Selesai
29. Definition of Done
Proyek dinyatakan selesai apabila pengguna dapat:
Register
   ↓
Login
   ↓
Masuk Dashboard
   ↓
Melihat ringkasan keuangan
   ↓
Menambah transaksi
   ↓
Melihat transaksi
   ↓
Mengedit transaksi
   ↓
Menghapus transaksi
   ↓
Melihat grafik pengeluaran
   ↓
Melihat tren pemasukan & pengeluaran
   ↓
Logout
Seluruh data harus tersimpan di Supabase PostgreSQL dan setiap pengguna hanya dapat mengakses transaksi yang terkait dengan akun mereka.

