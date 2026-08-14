# FinWish v2 — Setup

## 1. Buat project Supabase
Buat project baru di Supabase.

## 2. Database
Buka SQL Editor, jalankan seluruh isi `supabase.sql`.

## 3. Ambil API
Di Supabase buka Project Settings → API.
Salin:
- Project URL
- anon/public key

Masukkan ke `index.html`:
`SUPABASE_URL='...'`
`SUPABASE_ANON_KEY='...'`

Jangan memasukkan service_role key ke frontend.

## 4. Email confirmation
Untuk testing, sesuaikan Authentication → Providers → Email sesuai kebutuhanmu.

## 5. Hosting
Upload folder ini ke hosting HTTPS seperti GitHub Pages atau Vercel.
Buka dari HP → pilih Install/Add to Home Screen.

## 6. Offline
Transaksi baru disimpan lokal saat offline. Saat online kembali, versi ini melakukan sinkronisasi data cloud.
Catatan: mekanisme conflict resolution masih sederhana (cloud menjadi sumber data saat sync).

## 7. Uninstall
Setelah data berhasil tersimpan di Supabase, uninstall/reinstall tidak menghapus history cloud.
Login dengan akun yang sama untuk mengambil kembali data.
