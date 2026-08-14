# Setup Google & Nomor HP

## Google
Supabase Dashboard -> Authentication -> Providers -> Google -> Enable.
Masukkan Client ID/Secret dari Google Cloud.
Tambahkan URL callback Supabase yang ditampilkan di dashboard Google provider.
Untuk Vercel, pastikan Site URL dan Redirect URLs mencakup domain aplikasi.

## Nomor HP
Supabase Dashboard -> Authentication -> Providers -> Phone.
Aktifkan SMS provider yang tersedia dan konfigurasikan kredensialnya.
Setelah itu tombol "Masuk dengan nomor HP" akan mengirim OTP.

Catatan:
UI nomor HP sudah siap, tetapi pengiriman SMS tidak bisa bekerja hanya dari frontend jika Phone Auth/SMS provider belum diaktifkan di Supabase.
