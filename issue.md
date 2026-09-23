# Phase 3 - Authentication (Login, Register & Route Protection)

## Deskripsi
Mengimplementasikan sistem autentikasi pengguna menggunakan **Supabase Auth** pada aplikasi Next.js App Router. Phase ini mencakup halaman register, halaman login, fungsi logout, dan proteksi rute agar halaman dashboard hanya dapat diakses oleh pengguna yang sudah login.

---

## Tasks

### A. Halaman Register (`/register`)
- [ ] Buat halaman `src/app/register/page.tsx` dengan form register.
- [ ] Form memiliki field: **Email**, **Password**, **Konfirmasi Password**.
- [ ] Validasi sisi klien:
  - Email wajib diisi dan format harus valid.
  - Password wajib diisi.
  - Konfirmasi password harus sama dengan password.
- [ ] Panggil `supabase.auth.signUp()` saat form di-submit.
- [ ] Tampilkan pesan sukses jika akun berhasil dibuat.
- [ ] Tampilkan pesan error yang sesuai jika gagal (contoh: email sudah digunakan).
- [ ] Terdapat link navigasi ke halaman Login.

### B. Halaman Login (`/login`)
- [ ] Buat halaman `src/app/login/page.tsx` dengan form login.
- [ ] Form memiliki field: **Email**, **Password**.
- [ ] Panggil `supabase.auth.signInWithPassword()` saat form di-submit.
- [ ] Jika berhasil, redirect pengguna ke `/dashboard`.
- [ ] Tampilkan pesan error jika email/password salah.
- [ ] Terdapat link navigasi ke halaman Register.

### C. Fungsi Logout
- [ ] Buat komponen tombol Logout yang dapat dipanggil dari dashboard.
- [ ] Panggil `supabase.auth.signOut()` saat tombol ditekan.
- [ ] Setelah logout, redirect pengguna ke `/login`.

### D. Proteksi Rute (Route Protection)
- [ ] Buat `src/middleware.ts` menggunakan `@supabase/ssr` untuk memeriksa session.
- [ ] Rute `/dashboard` dan turunannya hanya dapat diakses oleh pengguna yang sudah login.
- [ ] Pengguna yang belum login akan di-redirect ke `/login`.
- [ ] Pengguna yang sudah login dan mengakses `/login` atau `/register` akan di-redirect ke `/dashboard`.

### E. Halaman Dashboard (Placeholder)
- [ ] Buat placeholder `src/app/dashboard/page.tsx` yang menampilkan:
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
- [ ] Pengguna baru dapat mendaftar dengan email dan password.
- [ ] Pengguna terdaftar dapat login dan diarahkan ke halaman Dashboard.
- [ ] Pengguna dapat logout dan diarahkan kembali ke halaman Login.
- [ ] Mengakses `/dashboard` tanpa login otomatis di-redirect ke `/login`.
- [ ] Mengakses `/login` dalam kondisi sudah login otomatis di-redirect ke `/dashboard`.
- [ ] Tidak ada error TypeScript saat `npm run build`.
