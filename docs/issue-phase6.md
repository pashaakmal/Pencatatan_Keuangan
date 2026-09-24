# Phase 6 - Data Visualization Development
**Status:** Planning (not yet started)  
**Previous Phase:** Phase 5 - Dashboard & Custom Features (completed)  
**Next Phase:** Phase 7 - Final Polish

## Context
Sudah ada:
- Phase 1-2: Project setup & database schema
- Phase 3: Authentication (register, login, logout, protected routes)
- Phase 4: Transaction CRUD operations (create, read, update, delete)
- Phase 5: Dashboard summary cards, filtering, custom categories, and timestamps

Sekarang perlu membangun visualisasi data menggunakan Recharts sesuai PRD section 506-516.

## Requirements (from PRD)

### Tasks (Phase 6 tasks)
1. **Membuat Pie/Donut Chart** pengeluaran berdasarkan kategori (Expenses by Category).
2. **Membuat Line Chart** tren pemasukan dan pengeluaran dari waktu ke waktu (Monthly Trend).
3. **Menghubungkan grafik** dengan data real dari Supabase (filtered by current user).
4. **Menangani kondisi ketika belum ada data** (Empty state untuk grafik).

### Acceptance Criteria
- Grafik menampilkan data aktual dari database.
- Grafik berubah secara dinamis ketika transaksi ditambah, diubah, atau dihapus.
- Tidak terjadi error atau crash ketika database kosong (belum ada transaksi).

## UI Components & Recharts Integration

### 1. Expense by Category (Pie / Donut Chart)
- **Library:** Recharts (`PieChart`, `Pie`, `Cell`, `Tooltip`, `Legend`, `ResponsiveContainer`)
- **Data aggregation:** Group expenses by category for the current month.
- **Colors:** Distinct colors for standard categories (Makanan, Transportasi, Hiburan, Tagihan, Lainnya / Custom).
- **Empty State:** "Belum ada data pengeluaran bulan ini."

### 2. Monthly Trend (Line Chart)
- **Library:** Recharts (`LineChart`, `Line`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `Legend`, `ResponsiveContainer`)
- **Data aggregation:** Group income and expense totals by month (e.g., last 6 months).
- **Lines:** 
  - Pemasukan (Green)
  - Pengeluaran (Red)
- **Empty State:** "Belum ada data tren keuangan."

## Technical Implementation Plan

### 1. Data Processing Utility (`utils/chartHelpers.ts` or similar)
- Functions to aggregate transactions into category totals for Pie Chart.
- Functions to aggregate transactions by month for Line Chart.

### 2. Component Structure
```
src/components/dashboard/
├── charts/
│   ├── ExpensePieChart.tsx
│   └── MonthlyTrendChart.tsx
```

### 3. Integration into Dashboard (`src/app/dashboard/page.tsx`)
- Place charts below Summary Cards and above/beside Transaction List.
- Make charts responsive using `ResponsiveContainer`.

## Testing Criteria
- Tambah pengeluaran baru, Pie Chart langsung update proporsinya.
- Tambah pemasukan/pengeluaran bulan lalu, Line Chart menampilkan titik data bulan tersebut.
- Hapus semua data, grafik menampilkan pesan empty state dengan rapi tanpa error.

---
*Issue ini untuk planning. Eksekusi baru dimulai setelah konfirmasi.*
