-- FinWish v3.1 — Wishlist image storage
-- Jalankan SEKALI di Supabase SQL Editor.
-- Bucket dibuat public agar URL gambar wishlist bisa ditampilkan di aplikasi.

insert into storage.buckets (id, name, public)
values ('wishlist-images', 'wishlist-images', true)
on conflict (id) do update set public = true;

drop policy if exists "FinWish wishlist images read" on storage.objects;
create policy "FinWish wishlist images read"
on storage.objects for select
to public
using (bucket_id = 'wishlist-images');

drop policy if exists "FinWish wishlist images upload" on storage.objects;
create policy "FinWish wishlist images upload"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'wishlist-images'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "FinWish wishlist images update" on storage.objects;
create policy "FinWish wishlist images update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'wishlist-images'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
)
with check (
  bucket_id = 'wishlist-images'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "FinWish wishlist images delete" on storage.objects;
create policy "FinWish wishlist images delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'wishlist-images'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
