# CukupinAja

> **Atur uang saku, tanpa panik di tanggal muda.**

CukupinAja adalah website pengelola uang saku sederhana yang dibuat untuk membantu pelajar — terutama siswa SMK — agar uang sakunya cukup sampai akhir bulan. Lewat satu halaman, pengguna bisa belajar pentingnya mencatat pengeluaran, mencatat pemasukan dan pengeluaran harian, serta menetapkan batas anggaran per kategori.

Website ini **tidak membutuhkan akun, server, atau koneksi database**. Semua data disimpan langsung di browser pengguna, sehingga ringan, cepat, dan mudah dipakai.

---

## Daftar Isi

- [Kegunaan Web](#kegunaan-web)
- [Fitur Utama](#fitur-utama)
- [Cara Menjalankan](#cara-menjalankan)
- [Cara Menggunakan](#cara-menggunakan)
- [Penyimpanan Data](#penyimpanan-data)
- [Struktur Proyek](#struktur-proyek)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Tampilan Responsif dan Aksesibilitas](#tampilan-responsif-dan-aksesibilitas)
- [Batasan dan Catatan](#batasan-dan-catatan)
- [Pengembang](#pengembang)

---

## Kegunaan Web

Banyak pelajar menerima uang saku sekaligus di awal bulan, lalu kehabisan uang sebelum akhir bulan karena pengeluaran tidak tercatat. CukupinAja hadir untuk membantu menjawab masalah tersebut dengan cara yang sederhana:

1. **Meningkatkan kesadaran finansial** — memberikan data bahwa mencatat pengeluaran dapat menghemat 15%–30% uang saku.
2. **Mencatat arus uang** — setiap pemasukan dan pengeluaran bisa disimpan beserta tanggal, kategori, dan catatan.
3. **Mengatur batas belanja** — pengguna menentukan anggaran bulanan per kategori (misalnya Makanan, Transportasi, Kuota) dan melihat progres pemakaiannya.
4. **Mengambil keputusan lebih cepat** — saldo dan sisa dana aman ditampilkan langsung sehingga pengguna tahu kapan harus berhenti berbelanja.

Cocok digunakan oleh pelajar, mahasiswa, atau siapa pun yang ingin mulai mengelola uang saku harian secara disiplin.

---

## Fitur Utama

### 1. Halaman Utama (Home)
- Menampilkan pesan utama tentang pentingnya mengatur uang saku.
- Animasi ilustrasi pria panik melihat ponsel (berbasis scroll di desktop, gambar statis di mobile).
- Pita berjalan (marquee) bertuliskan **"KAMI TAU SOLUSINYA"**.
- Foto profil pengembang dan nama pembuat web.

### 2. Edukasi
- Kutipan studi tentang manfaat mencatat pengeluaran.
- Angka **15%–30%** yang muncul dengan animasi penghitung saat section terlihat.
- Band statis **"Start here"** sebagai penanda dimulainya bagian pencatatan.

### 3. Transaksi
- Kartu ringkasan: **Total Pemasukan**, **Total Pengeluaran**, dan **Saldo Saat Ini**.
- Form **Catat Transaksi Baru**:
  - Tanggal (otomatis terisi tanggal hari ini)
  - Jenis (Pemasukan / Pengeluaran)
  - Nominal
  - Kategori (dengan saran otomatis dari kategori anggaran yang sudah dibuat)
  - Catatan/deskripsi
- Riwayat transaksi dalam tabel, lengkap dengan tombol hapus.
- **Filter riwayat**: pencarian kategori/deskripsi, filter jenis, dan filter tanggal.
- Pesan validasi dan notifikasi berhasil/gagal saat menyimpan.

### 4. Anggaran
- Kartu ringkasan: **Total Anggaran Disiapkan** dan **Sisa Dana Aman**.
- Form **Tetapkan Batas Anggaran** per kategori (batas maksimal pengeluaran bulanan).
- Daftar progres anggaran per kategori:
  - Bar progres pemakaian anggaran.
  - Status **Aman**, **Hampir Penuh** (≥ 75%), atau **Melebihi Batas!**
- Perhitungan pemakaian anggaran otomatis mengikuti transaksi pengeluaran pada bulan berjalan.
- Kategori yang sama tidak akan dibuat dua kali — batasnya otomatis diperbarui.
- Tombol hapus untuk setiap anggaran.

### 5. Navigasi dan Footer
- Navbar tetap di atas dengan penanda aktif yang mengikuti posisi scroll (Home, Edukasi, Transaksi, Anggaran).
- Menu hamburger di tampilan mobile.
- Footer berisi nama pembuat, foto profil, nama sekolah, dan tautan navigasi.

---

## Cara Menjalankan

### Cara 1 — Langsung dibuka (paling mudah)

1. Buka folder `CukupinAja`.
2. Klik dua kali file `index.html`, atau klik kanan lalu pilih **Open with → browser** (Chrome, Edge, Firefox, dll).

### Cara 2 — Menggunakan server lokal (disarankan)

Menjalankan lewat server lokal membuat penyimpanan data dan pemuatan aset lebih stabil.

```bash
cd C:\Coding\CukupinAja
python -m http.server 8000
```

Lalu buka `http://localhost:8000` di browser.

Alternatif lain:

- Ekstensi **Live Server** di Visual Studio Code.
- Konfigurasi **Launch Chrome against localhost** pada `.vscode/launch.json` (port `8080`).

> **Catatan:** Website dapat berjalan tanpa internet. Koneksi internet hanya dibutuhkan untuk memuat font Google Fonts (Inter dan Instrument Serif); jika offline, browser akan memakai font cadangan.

---

## Cara Menggunakan

### Langkah 1 — Baca bagian Edukasi
Pahami dulu alasan pentingnya mencatat pengeluaran. Setelah itu gulir ke band **"Start here"**.

### Langkah 2 — Catat pemasukan
1. Buka section **Transaksi**.
2. Isi tanggal, pilih jenis **Pemasukan**, masukkan nominal (misalnya uang saku bulanan), lalu isi kategori (misalnya `Uang Saku`).
3. Klik **Simpan Transaksi**. Saldo akan otomatis bertambah.

### Langkah 3 — Catat pengeluaran harian
Ulangi langkah di atas dengan jenis **Pengeluaran**, lalu isi kategori yang sesuai (misalnya `Makanan`, `Transportasi`, `Kuota`).

> **Tips:** Gunakan nama kategori yang konsisten agar pemakaian anggaran dapat dihitung dengan tepat. Form transaksi sudah menyarankan kategori dari daftar anggaran yang kamu buat.

### Langkah 4 — Buat anggaran bulanan
1. Buka section **Anggaran**.
2. Isi nama kategori (harus sama dengan kategori transaksi, misalnya `Makanan`).
3. Isi batas maksimal pengeluaran bulanan, lalu klik **Buat Anggaran**.
4. Pantau bar progres dan statusnya. Jika sudah **Melebihi Batas!**, sebaiknya tunda pengeluaran pada kategori tersebut.

### Langkah 5 — Cari dan kelola riwayat
- Gunakan kolom pencarian untuk mencari kategori atau catatan.
- Gunakan filter jenis dan tanggal untuk melihat transaksi tertentu.
- Klik tombol **✕** untuk menghapus transaksi atau anggaran.

---

## Penyimpanan Data

Semua data disimpan di **localStorage** browser:

| Kunci Penyimpanan | Isi |
| --- | --- |
| `cukupin_transaksi` | Daftar transaksi (tanggal, jenis, nominal, kategori, catatan) |
| `cukupin_anggaran` | Daftar anggaran (kategori dan batas bulanan) |

Artinya:

- Data **hanya tersimpan di browser dan perangkat yang digunakan**. Tidak ada sinkronisasi antarperangkat.
- Data tetap ada setelah halaman ditutup atau di-refresh.
- Menghapus data situs/browser (clear browsing data) akan menghapus seluruh catatan.
- Data tidak dikirim ke mana pun dan tidak dapat dilihat oleh orang lain.

---

## Struktur Proyek

```text
CukupinAja/
├── index.html              # Struktur halaman utama (Home, Edukasi, Transaksi, Anggaran, Footer)
├── README.md               # Dokumentasi proyek ini
├── css/
│   └── style.css           # Seluruh tampilan, animasi, dan desain responsif
├── js/
│   ├── main.js             # Animasi hero, marquee, counter edukasi, menu mobile, canvas
│   ├── transaksi.js        # Logika transaksi, anggaran, filter, dan penyimpanan localStorage
│   └── anime.umd.min.js    # Library Anime.js v4.5.0 (dimuat secara lokal)
├── assets/
│   ├── logo.png            # Logo CukupinAja
│   ├── man.png             # Ilustrasi pria panik
│   ├── notif.png           # Gambar notifikasi
│   ├── grid.jpg            # Latar belakang grid
│   ├── cat1.jpg            # Foto profil Syamsudin
│   └── cat2.jpg            # Foto profil Afifuddin
├── Assets-jpg/
│   └── ezgif-frame-001.jpg ... ezgif-frame-072.jpg   # 72 frame animasi scroll
└── .vscode/
    └── launch.json         # Konfigurasi debug di Visual Studio Code
```

---

## Teknologi yang Digunakan

- **HTML5** — struktur halaman semantik dengan `header`, `main`, `section`, `footer`.
- **CSS3** — layout grid/flexbox, custom properties, animasi, dan media query responsif.
- **JavaScript (vanilla)** — seluruh logika transaksi dan anggaran tanpa framework.
- **Anime.js v4.5.0** — animasi teks, counter angka, dan transisi (dimuat lokal dari `js/`).
- **Google Fonts** — Inter dan Instrument Serif.
- **localStorage** — penyimpanan data di sisi browser.

Tidak ada backend, database, framework CSS, maupun proses build. Cukup buka filenya dan website langsung berjalan.

---

## Tampilan Responsif dan Aksesibilitas

- **Breakpoint 800px**: menu berubah menjadi hamburger, hero memakai gambar statis, kartu ringkasan menumpuk vertikal, tabel dapat digeser horizontal, dan footer menjadi satu kolom.
- **Gambar latar grid** memakai `background-size: cover` sehingga rasionya selalu terjaga dan tidak gepeng di layar portrait.
- **Aksesibilitas**: label pada form filter, `aria-label` pada tombol hapus dan tombol menu, `aria-expanded` pada hamburger, struktur landmark (`main`, `nav`), serta kontras warna yang sudah disesuaikan.
- Audit Lighthouse: **Accessibility 100**, **Best Practices 100**, **SEO 100**.

---

## Batasan dan Catatan

- Website ini adalah **alat bantu belajar mengelola uang**, bukan aplikasi keuangan resmi atau pemberi saran investasi.
- Pemakaian anggaran dihitung dari transaksi **pengeluaran pada bulan berjalan** yang kategorinya sama dengan nama anggaran (tidak membedakan huruf besar/kecil).
- Anggaran tidak otomatis berpindah antar bulan; batas yang dibuat berlaku sebagai batas bulanan dan pemakaiannya dihitung ulang setiap bulan.
- Belum tersedia fitur ekspor/impor data, cadangan otomatis, atau akun pengguna.
- Data dapat hilang jika browser dibersihkan, mode penyamaran ditutup, atau penyimpanan situs dihapus.

---

## Pengembang

Dibuat oleh:

- **Syamsudin**
- **Afifuddin**

**SMK Telekomunikasi Darul Ulum**

---

Terima kasih sudah menggunakan CukupinAja. Semoga uang sakumu selalu cukup sampai akhir bulan! 🐱
