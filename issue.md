# Phase 3 - Authentication (Login, Register & Route Protection)

> **Status:** Completed (Branch: `dev/phase-3-authentication`)

## Deskripsi
Mengimplementasikan sistem autentikasi pengguna menggunakan **Supabase Auth** pada aplikasi Next.js App Router. Phase ini mencakup halaman register, halaman login, fungsi logout, dan proteksi rute agar halaman dashboard hanya dapat diakses oleh pengguna yang sudah login.

---

## Tasks

### A. Halaman Register (`/register`)
- [x] Buat halaman `src/app/register/page.tsx` dengan form register.
- [x] Form memiliki field: **Email**, **Password**, **Konfirmasi Password**.
- [x] Validasi sisi klien:
  - Email wajib diisi dan format harus valid.
  - Password wajib diisi.
  - Konfirmasi password harus sama dengan password.
- [x] Panggil `supabase.auth.signUp()` saat form di-submit.
- [x] Tampilkan pesan sukses jika akun berhasil dibuat.
- [x] Tampilkan pesan error yang sesuai jika gagal (contoh: email sudah digunakan).
- [x] Terdapat link navigasi ke halaman Login.

### B. Halaman Login (`/login`)
- [x] Buat halaman `src/app/login/page.tsx` dengan form login.
- [x] Form memiliki field: **Email**, **Password**.
- [x] Panggil `supabase.auth.signInWithPassword()` saat form di-submit.
- [x] Jika berhasil, redirect pengguna ke `/dashboard`.
- [x] Tampilkan pesan error jika email/password salah.
- [x] Terdapat link navigasi ke halaman Register.

### C. Fungsi Logout
- [x] Buat komponen tombol Logout yang dapat dipanggil dari dashboard.
- [x] Panggil `supabase.auth.signOut()` saat tombol ditekan.
- [x] Setelah logout, redirect pengguna ke `/login`.

### D. Proteksi Rute (Route Protection)
- [x] Buat `src/middleware.ts` menggunakan `@supabase/ssr` untuk memeriksa session.
- [x] Rute `/dashboard` dan turunannya hanya dapat diakses oleh pengguna yang sudah login.
- [x] Pengguna yang belum login akan di-redirect ke `/login`.
- [x] Pengguna yang sudah login dan mengakses `/login` atau `/register` akan di-redirect ke `/dashboard`.

### E. Halaman Dashboard (Placeholder)
- [x] Buat placeholder `src/app/dashboard/page.tsx` yang menampilkan:
  - Teks sambutan dengan email pengguna yang sedang login.
  - Tombol Logout.

---

## Referensi PRD
- **Section 5 (Scope MVP):** Register, Login, Logout, Proteksi halaman.
- **Section 7.1 (User Flow Authentication):** Landing → Register/Login → Dashboard.
- **Section 10.1 (Register):** Validasi field email, password, konfirmasi password.
- **Section 10.2 (Login):** Autentikasi via Supabase, redirect ke Dashboard jika berhasil.
- **Section 10.3 (Logout):** Hapus session, redirect ke Login.

---

## Acceptance Criteria
- [x] Pengguna baru dapat mendaftar dengan email dan password.
- [x] Pengguna terdaftar dapat login dan diarahkan ke halaman Dashboard.
- [x] Pengguna dapat logout dan diarahkan kembali ke halaman Login.
- [x] Mengakses `/dashboard` tanpa login otomatis di-redirect ke `/login`.
- [x] Mengakses `/login` dalam kondisi sudah login otomatis di-redirect ke `/dashboard`.
- [x] Tidak ada error TypeScript saat `npm run build`.
