# Referensi Desain UI/UX

## 1. Gaya Visual
- **Palet Warna:** 
  - Primary: Indigo-600 (Actions, buttons)
  - Success: Green-600 (Income)
  - Danger: Red-600 (Expense)
  - Neutral: Gray-50 to Gray-900 (Background, text)
- **Typography:** Sans-serif (Default Next.js Inter/system font)
- **Spacing:** Konsisten (p-4, p-6, gap-4, gap-6)

## 2. Layout Desktop
- **Navbar:** Sticky, logo kiri, menu kanan.
- **Dashboard Grid:** 
  - Top: 3 Summary Cards.
  - Middle: Grid 2 kolom (Pie Chart, Line Chart).
  - Bottom: Transaction List dengan filter (Full-width card).
- **Modals:** Centered, semi-transparent black overlay.

## 3. Komponen
- **Cards:** Rounded-lg, shadow-sm, thin border (gray-200).
- **Buttons:** Shadow-sm, font-medium, hover states.
- **Inputs:** Border gray-300, focus-ring indigo-500.

## 4. Interaksi
- **Loading:** Skeleton screens (pulse animation).
- **Feedback:** Toast notifications setelah CRUD.
- **Confirmation:** Modal untuk delete.
- **Responsive:** Mobile stack vertical, desktop grid.
