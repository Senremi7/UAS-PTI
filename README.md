# Sistem Item dalam Game Simulasi Karakter

Sistem item dalam game simulasi karakter ini memungkinkan pemain untuk memperoleh, mengelola, dan menggunakan berbagai item yang mempengaruhi gameplay.

## Fitur Utama

1. **Perolehan Item**:
   - Dibeli melalui toko dalam game
   - Didapatkan sebagai hasil dari menyelesaikan aktivitas tertentu

2. **Fungsi Item**:
   - Item Consumable: Meningkatkan statistik pemain saat digunakan
   - Item Kunci: Membuka akses ke aktivitas tertentu
   - Item Reward: Didapatkan dari aktivitas dan dapat dijual

3. **Pengelolaan Inventaris**:
   - Melihat daftar item yang dimiliki
   - Menggunakan item langsung dari inventaris
   - Menjual item untuk mendapatkan koin

## Jenis Item

### Item Consumable
- **Vitamin**: Meningkatkan energi (+20)
- **Makanan Siap Saji**: Meningkatkan kenyang (+30)
- **Obat**: Meningkatkan kesehatan (+25)
- **Buku Pengetahuan**: Meningkatkan kecerdasan (+15)

### Item Kunci
- **Kartu Gym**: Membuka akses ke aktivitas Fitness
- **Alat Pancing**: Membuka akses ke aktivitas Memancing

### Item Reward
- **Ikan**: Didapatkan dari aktivitas memancing, dapat dijual
- **Buah**: Didapatkan dari aktivitas berkebun, dapat dijual atau dimakan

## Cara Menggunakan

1. **Toko**:
   - Klik tombol "Toko" untuk membuka panel toko
   - Pilih item yang ingin dibeli
   - Klik tombol "Beli" untuk membeli item (jika memiliki cukup koin)

2. **Inventaris**:
   - Klik tombol "Inventaris" untuk membuka panel inventaris
   - Pilih item yang ingin digunakan atau dijual
   - Klik tombol "Gunakan" untuk menggunakan item consumable
   - Klik tombol "Jual" untuk menjual item dan mendapatkan koin

3. **Aktivitas dengan Persyaratan Item**:
   - Beberapa aktivitas memerlukan item tertentu untuk diakses
   - Pesan persyaratan akan ditampilkan jika mencoba mengakses aktivitas tanpa item yang diperlukan

## Implementasi Teknis

Sistem item terdiri dari beberapa komponen utama:

1. **ItemSystem**: Mengelola inventaris, toko, dan interaksi dengan item
2. **ActivityRequirements**: Memeriksa persyaratan item untuk aktivitas tertentu
3. **RewardSystem**: Menampilkan notifikasi ketika pemain mendapatkan item baru

Item disimpan dalam state `playerInventory` dan dikelola melalui fungsi `updatePlayerInventory`. Uang pemain disimpan dalam state `playerMoney` dan dikelola melalui fungsi `updatePlayerMoney`.