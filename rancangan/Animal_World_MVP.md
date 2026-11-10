# Animal World --- MVP Product & Development Specification

**Versi:** 0.1\
**Status:** Draft MVP\
**Platform target:** Android\
**Target pengguna:** Anak usia 3--5 tahun\
**Pengguna pendamping:** Orang tua / wali

------------------------------------------------------------------------

## 1. Ringkasan Produk

Animal World adalah aplikasi edukasi anak usia dini yang menggabungkan
pengenalan hewan dengan aktivitas bermain sederhana. Anak dapat melihat
gambar hewan, mendengar nama dan suara hewan, lalu memainkan mini-game
untuk memperkuat pengenalan tersebut.

MVP difokuskan pada pengalaman inti yang sederhana dan dapat diuji.
Fitur tambahan seperti puzzle, mewarnai, koleksi kompleks, badge, cerita
interaktif, dan konten bilingual ditunda sampai pengalaman utama
tervalidasi.

### Tujuan MVP

Menguji apakah anak usia 3--5 tahun dapat: 1. Mengenali beberapa hewan
melalui gambar. 2. Menghubungkan gambar dengan nama atau suara hewan. 3.
Menyelesaikan permainan mencocokkan gambar dengan bantuan minimal. 4.
Menikmati pengalaman belajar tanpa navigasi yang membingungkan.

### Prinsip produk

-   Mudah digunakan oleh anak yang belum lancar membaca.
-   Instruksi singkat, lebih banyak dibantu audio dan visual.
-   Tombol besar dan mudah disentuh.
-   Tidak menghukum anak ketika salah menjawab.
-   Tidak membutuhkan akun untuk mencoba MVP.
-   Tidak menampilkan iklan atau tautan eksternal yang dapat diakses
    anak.

------------------------------------------------------------------------

## 2. Ruang Lingkup MVP

### Fitur yang masuk MVP

  -----------------------------------------------------------------------
  Fitur                   Deskripsi               Prioritas
  ----------------------- ----------------------- -----------------------
  Beranda                 Akses ke pengenalan     Wajib
                          hewan dan permainan     

  Pengenalan hewan        Menampilkan gambar,     Wajib
                          nama, dan suara hewan   

  Data 5 hewan            Singa, gajah, harimau,  Wajib
                          jerapah, dan monyet     

  Mini-game matching      Anak mencocokkan gambar Wajib
                          hewan dengan            
                          bayangannya             

  Audio                   Narasi nama hewan,      Wajib
                          suara hewan, dan        
                          instruksi singkat       

  Reward sederhana        Bintang setelah         Wajib
                          permainan selesai       

  Progress lokal          Menyimpan total bintang Wajib
                          dan aktivitas sederhana 

  Pengaturan orang tua    Kontrol volume dan      Wajib
                          akses pengaturan        
                          melalui parental gate   

  Bahasa                  Bahasa Indonesia        Wajib
  -----------------------------------------------------------------------

### Fitur yang ditunda

  -----------------------------------------------------------------------
  Fitur                   Tahap                   Alasan penundaan
  ----------------------- ----------------------- -----------------------
  Puzzle                  Tahap 2                 Bukan bagian dari
                                                  pengalaman inti pertama

  Coloring / mewarnai     Tahap 2                 Membutuhkan interaksi
                                                  dan implementasi canvas
                                                  tambahan

  Koleksi hewan kompleks  Tahap 2                 Belum diperlukan untuk
                                                  menguji konsep utama

  Badge dan trofi         Tahap 2                 Reward awal cukup
                                                  menggunakan bintang

  Bahasa Inggris          Tahap 2                 Validasi pengalaman
                                                  utama dalam satu bahasa
                                                  terlebih dahulu

  Story interaktif        Tahap 3                 Memperluas jenis konten

  Lagu dan musik          Tahap 3                 Bukan kebutuhan inti
                                                  MVP

  20--50+ hewan           Tahap 3                 Mulai dengan 5 hewan
                                                  untuk menguji konten
                                                  dan alur
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 3. Target Pengguna dan Kebutuhan

### Pengguna utama

Anak usia 3--5 tahun yang sedang belajar mengenali nama, bentuk, dan
suara hewan.

### Pengguna pendamping

Orang tua atau wali yang membantu anak memulai aplikasi, mengatur
volume, dan mengamati proses bermain.

### Kebutuhan pengguna

**Anak:** - Bisa langsung memahami apa yang harus disentuh. - Bisa
mendengar nama dan suara hewan. - Bisa mencoba lagi ketika salah. -
Mendapat respons visual dan audio yang menyenangkan.

**Orang tua:** - Bisa mengatur volume. - Bisa memastikan anak tidak
diarahkan ke tautan atau konten luar. - Bisa melihat bahwa aplikasi
memiliki tujuan belajar yang jelas.

------------------------------------------------------------------------

## 4. Learning Outcomes

Setelah menggunakan MVP, anak diharapkan mulai mampu:

1.  Mengenali gambar lima hewan yang tersedia.
2.  Menghubungkan nama dengan gambar hewan.
3.  Mengenali atau membedakan suara beberapa hewan.
4.  Mencocokkan gambar hewan dengan siluet yang sesuai.

Learning outcomes ini merupakan sasaran desain yang perlu diuji, bukan
klaim bahwa semua anak pasti menguasainya setelah menggunakan aplikasi.

------------------------------------------------------------------------

## 5. Alur Pengguna

``` text
Buka aplikasi
    |
    v
Beranda
    |
    +------------------------+
    |                        |
    v                        v
Kenal Hewan               Main Matching
    |                        |
    v                        v
Pilih hewan              Dengarkan instruksi
    |                        |
    v                        v
Lihat gambar             Pilih / seret hewan
    |                        |
    v                        v
Dengar nama & suara      Feedback benar / coba lagi
    |                        |
    v                        v
Kembali ke beranda       Selesaikan permainan
                             |
                             v
                       Terima bintang
                             |
                             v
                       Progress tersimpan
```

------------------------------------------------------------------------

## 6. Spesifikasi Layar

### 6.1 Beranda

**Elemen:** - Nama atau logo Animal World. - Ilustrasi maskot sederhana
(opsional untuk MVP). - Tombol besar "Kenal Hewan". - Tombol besar "Main
Matching". - Ringkasan total bintang. - Ikon pengaturan yang dilindungi
parental gate.

**Perilaku:** - Anak dapat memahami dua aktivitas utama tanpa membaca
instruksi panjang. - Setiap tombol memiliki ikon dan label audio jika
diperlukan. - Navigasi kembali selalu jelas.

### 6.2 Kenal Hewan

**Konten awal:** - Singa. - Gajah. - Harimau. - Jerapah. - Monyet.

**Elemen kartu hewan:** - Ilustrasi hewan. - Nama dalam Bahasa
Indonesia. - Tombol atau interaksi untuk memutar suara hewan. - Audio
pelafalan nama hewan.

**Perilaku:** - Saat kartu dipilih, aplikasi menampilkan detail hewan. -
Anak dapat mendengar nama dan suara hewan. - Audio baru menghentikan
audio narasi sebelumnya agar tidak bertumpuk. - Anak dapat kembali ke
daftar hewan dengan satu tindakan.

### 6.3 Mini-game Matching

**Tujuan:** mencocokkan gambar hewan dengan siluet yang sesuai.

**Elemen:** - Instruksi singkat: "Cocokkan hewannya!" - Tiga pilihan
gambar hewan per ronde. - Tiga siluet sebagai target. - Feedback visual
dan audio. - Tombol petunjuk sederhana (opsional; dapat dihilangkan pada
build pertama).

**Aturan permainan:** - Gunakan 3 pasangan pada satu ronde. - Urutan
pilihan diacak. - Jawaban benar menampilkan animasi atau feedback
positif. - Jawaban salah tidak mengurangi bintang dan tidak memberi
penalti. - Anak boleh mencoba lagi. - Ronde selesai ketika semua
pasangan benar.

**Catatan interaksi:** Jika drag-and-drop belum stabil pada perangkat
target, gunakan pola tap gambar lalu tap siluet. Pilih satu pola
interaksi yang paling mudah dipahami anak setelah uji coba awal.

### 6.4 Hasil Permainan

**Elemen:** - Animasi perayaan singkat. - Pesan positif, misalnya
"Hebat! Kamu berhasil!" - Bintang yang diperoleh. - Tombol "Main
Lagi". - Tombol "Beranda".

Reward MVP sebaiknya sederhana dan konsisten. Hindari membuat anak
merasa gagal karena kecepatan atau jumlah kesalahan.

### 6.5 Pengaturan Orang Tua

**Akses:** ikon pengaturan di beranda harus melewati parental gate.

**Kontrol minimum:** - Volume narasi dan efek suara. - Musik latar jika
musik digunakan. - Informasi singkat tentang aplikasi.

Parental gate sederhana dapat menggunakan pertanyaan untuk orang dewasa,
tetapi jangan menganggap satu soal matematika sebagai verifikasi
keamanan yang kuat. Uji apakah anak target dapat melewatinya dengan
mudah.

------------------------------------------------------------------------

## 7. Sistem Reward dan Progress

### Reward

-   Anak memperoleh bintang ketika menyelesaikan satu ronde.
-   Untuk MVP, gunakan aturan yang mudah dipahami dan tidak terlalu
    kompetitif.
-   Tidak perlu badge, trofi, atau sistem unlock yang kompleks.

### Progress lokal

Data minimum yang disimpan: - Total bintang. - Jumlah ronde yang
selesai. - Waktu aktivitas terakhir (opsional).

Simpan secara lokal di perangkat menggunakan AsyncStorage. MVP tidak
memerlukan akun atau backend untuk progress dasar.

### Contoh struktur data

``` typescript
interface ProgressState {
  totalStars: number;
  completedMatchingRounds: number;
  lastActivityAt?: number;
}
```

------------------------------------------------------------------------

## 8. Data Konten Hewan

Contoh model data:

``` typescript
interface Animal {
  id: string;
  nameId: string;
  imageAsset: number;
  soundAsset: number;
  narrationAsset: number;
}
```

Data awal berisi lima hewan. Pastikan seluruh gambar, suara, dan narasi
memiliki hak penggunaan yang sesuai serta kualitas yang cukup jelas
untuk anak.

### Checklist aset

-   [ ] Ilustrasi singa.
-   [ ] Ilustrasi gajah.
-   [ ] Ilustrasi harimau.
-   [ ] Ilustrasi jerapah.
-   [ ] Ilustrasi monyet.
-   [ ] Lima file suara hewan.
-   [ ] Lima file audio pelafalan nama hewan.
-   [ ] Siluet untuk permainan matching.
-   [ ] Efek suara feedback benar.
-   [ ] Efek suara perayaan singkat.

------------------------------------------------------------------------

## 9. UX, Aksesibilitas, dan Keamanan Anak

### UX anak

-   Gunakan tombol besar dan jarak yang cukup antartombol.
-   Hindari teks panjang dan instruksi yang hanya mengandalkan kemampuan
    membaca.
-   Gunakan ikon yang konsisten.
-   Berikan feedback yang cepat dan lembut.
-   Hindari batas waktu pada permainan MVP.
-   Pastikan area sentuh nyaman pada berbagai ukuran layar.

### Keamanan dan privasi

-   Jangan meminta nama lengkap, alamat, nomor telepon, atau data
    pribadi anak.
-   Jangan menambahkan iklan pada MVP.
-   Jangan menyediakan tautan eksternal yang dapat dibuka anak.
-   Lindungi pengaturan orang tua dengan parental gate.
-   Minimalkan izin perangkat; jangan meminta izin yang tidak
    diperlukan.
-   Jika nantinya mengumpulkan data atau menerbitkan aplikasi untuk
    anak, tinjau kebijakan Google Play Families dan ketentuan privasi
    yang berlaku sebelum rilis.

------------------------------------------------------------------------

## 10. Rekomendasi Teknologi

Blueprint awal mengusulkan React Native dan Expo. Stack final harus
diverifikasi terhadap versi Expo SDK yang benar-benar dipakai sebelum
instalasi dan build.

  Area            Pilihan awal
  --------------- ------------------------------------------------------
  Framework       React Native + Expo
  Navigation      Expo Router
  State           Zustand atau state lokal sederhana
  Penyimpanan     AsyncStorage
  Gambar          expo-image
  Audio           Pilih pustaka audio yang kompatibel dengan SDK aktif
  Animasi         Reanimated / Lottie bila diperlukan
  Build Android   EAS Build

**Catatan teknis:** Jangan mengunci versi dependency hanya berdasarkan
blueprint. Cocokkan versi paket dengan dokumentasi Expo SDK aktif dan
jalankan pemeriksaan kompatibilitas sebelum implementasi.

Untuk MVP, hindari backend, login, sinkronisasi cloud, dan sistem
analitik kompleks kecuali ada kebutuhan validasi yang jelas.

------------------------------------------------------------------------

## 11. Acceptance Criteria

MVP dianggap siap untuk uji coba terbatas jika seluruh kriteria wajib
berikut terpenuhi.

### Aplikasi dan navigasi

-   [ ] Aplikasi dapat dibuka tanpa crash pada perangkat uji.
-   [ ] Beranda menampilkan dua aktivitas utama.
-   [ ] Pengguna dapat berpindah layar dan kembali ke beranda dengan
    benar.

### Pengenalan hewan

-   [ ] Lima hewan tampil dengan gambar yang benar.
-   [ ] Nama hewan ditampilkan dalam Bahasa Indonesia.
-   [ ] Audio nama hewan dapat diputar.
-   [ ] Suara hewan dapat diputar.
-   [ ] Audio tidak bertumpuk secara tidak sengaja.

### Matching

-   [ ] Satu ronde menampilkan tiga pasangan.
-   [ ] Pilihan dapat dicocokkan dengan target.
-   [ ] Jawaban benar mendapatkan feedback positif.
-   [ ] Jawaban salah memungkinkan anak mencoba lagi.
-   [ ] Ronde selesai setelah seluruh pasangan benar.

### Reward dan penyimpanan

-   [ ] Bintang diberikan setelah ronde selesai.
-   [ ] Total bintang diperbarui.
-   [ ] Progress tetap tersedia setelah aplikasi ditutup dan dibuka
    kembali.

### Pengaturan dan keamanan

-   [ ] Pengaturan tidak dapat dibuka langsung dari area bermain tanpa
    melewati parental gate.
-   [ ] Volume dapat diatur.
-   [ ] Tidak ada iklan atau tautan eksternal pada area anak.
-   [ ] Aplikasi tidak meminta data pribadi anak yang tidak diperlukan.

### Perangkat

-   [ ] Tampilan diuji pada setidaknya satu perangkat Android dengan
    spesifikasi rendah atau menengah.
-   [ ] Interaksi sentuh tidak terpotong pada ukuran layar yang berbeda.
-   [ ] Aplikasi dapat digunakan tanpa koneksi internet setelah aset
    inti tersedia secara lokal.

------------------------------------------------------------------------

## 12. Skenario Pengujian Pengguna

Lakukan uji coba teramati bersama orang tua/wali dan anak dalam rentang
target. Minta persetujuan orang tua sebelum pengujian dan jangan merekam
atau mengumpulkan data pribadi anak yang tidak diperlukan.

  -----------------------------------------------------------------------
  Skenario                            Yang diamati
  ----------------------------------- -----------------------------------
  Anak membuka aplikasi               Apakah anak memahami pilihan di
                                      beranda?

  Anak memilih Kenal Hewan            Apakah anak dapat membuka kartu
                                      hewan?

  Anak mendengarkan audio             Apakah suara terdengar jelas dan
                                      mudah dipahami?

  Anak memainkan matching             Apakah instruksi dan cara bermain
                                      dipahami?

  Anak menjawab salah                 Apakah anak memahami bahwa ia boleh
                                      mencoba lagi?

  Anak menyelesaikan ronde            Apakah reward dipahami dan terasa
                                      menyenangkan?

  Aplikasi dibuka kembali             Apakah progress tersimpan?
  -----------------------------------------------------------------------

### Indikator validasi awal

Catat secara sederhana: - Berapa anak yang dapat memulai aktivitas tanpa
bantuan. - Berapa anak yang dapat menyelesaikan satu ronde. - Di bagian
mana anak paling sering kebingungan. - Apakah anak ingin mencoba ronde
lagi. - Masukan orang tua tentang manfaat dan kenyamanan aplikasi.

Jangan menetapkan klaim keberhasilan hanya dari jumlah unduhan. Amati
apakah pengalaman inti benar-benar dapat digunakan dan dipahami oleh
target pengguna.

------------------------------------------------------------------------

## 13. Prioritas Pengembangan

### Sprint 1 --- Fondasi

-   [ ] Inisialisasi proyek.
-   [ ] Setup navigasi.
-   [ ] Setup design tokens dan komponen tombol.
-   [ ] Implementasi beranda.
-   [ ] Implementasi penyimpanan progress lokal.

### Sprint 2 --- Pengenalan Hewan

-   [ ] Siapkan lima ilustrasi.
-   [ ] Siapkan audio nama dan suara hewan.
-   [ ] Implementasi daftar hewan.
-   [ ] Implementasi detail hewan.
-   [ ] Uji pengelolaan audio.

### Sprint 3 --- Matching

-   [ ] Implementasi tampilan permainan.
-   [ ] Implementasi logika pencocokan.
-   [ ] Implementasi pengacakan.
-   [ ] Implementasi feedback benar dan salah.
-   [ ] Implementasi penyelesaian ronde.

### Sprint 4 --- Reward dan Pengujian

-   [ ] Implementasi bintang.
-   [ ] Simpan progress.
-   [ ] Implementasi parental gate dan pengaturan.
-   [ ] Uji pada perangkat Android.
-   [ ] Uji coba teramati dengan anak dan orang tua.
-   [ ] Perbaiki masalah berdasarkan hasil pengujian.

Sprint di atas adalah pembagian kerja awal, bukan estimasi durasi yang
sudah terukur.

------------------------------------------------------------------------

## 14. Di Luar Cakupan MVP

Agar ruang lingkup tetap terkendali, hal berikut tidak dikerjakan pada
versi pertama:

-   Puzzle.
-   Coloring.
-   Koleksi stiker dan hewan yang dapat di-unlock.
-   Badge dan trofi.
-   Story interaktif.
-   Lagu dan musik anak.
-   Bahasa Inggris.
-   Login dan akun anak.
-   Backend dan sinkronisasi cloud.
-   Iklan.
-   Subscription atau pembayaran dalam aplikasi.

------------------------------------------------------------------------

## 15. Definisi MVP Selesai

Animal World MVP dinyatakan siap untuk uji coba terbatas ketika:

1.  Anak dapat mengenali lima hewan melalui gambar dan audio.
2.  Anak dapat memainkan satu mini-game matching sampai selesai.
3.  Aplikasi memberikan feedback dan reward sederhana.
4.  Progress tersimpan secara lokal.
5.  Pengalaman inti berjalan stabil pada perangkat Android uji.
6.  Uji coba awal menunjukkan bagian yang dipahami dan bagian yang masih
    membingungkan.

**Keputusan produk:** jangan menambahkan fitur baru sebelum alur Kenal
Hewan → Matching → Reward berjalan baik dan mendapat respons positif
dari pengujian pengguna.


# UI/UX DESIGN IMPROVEMENT — ANIMAL WORLD

Saya ingin melakukan redesign UI/UX aplikasi Animal World.

Saat ini fitur utama aplikasi sudah berjalan, tetapi secara visual desain masih terlalu basic, terlihat seperti prototype atau aplikasi hasil implementasi standar, belum terasa seperti produk edukasi anak yang profesional dan siap dipasarkan.

## 1. Tujuan Redesign

Tingkatkan kualitas visual aplikasi agar:
- Terlihat seperti aplikasi edukasi anak komersial.
- Memiliki identitas visual yang kuat dan konsisten.
- Menarik bagi anak usia 3–5 tahun.
- Memberikan pengalaman bermain yang menyenangkan.
- Memiliki tampilan modern, polished, playful, dan premium.

## 2. Arahan Visual

Gunakan pendekatan desain:
- Playful 3D / soft cartoon illustration.
- Colorful tetapi tidak berlebihan.
- Rounded UI dengan komposisi visual yang menarik.
- Soft shadows dan depth.
- Ilustrasi karakter hewan yang ekspresif.
- Micro-interactions dan animasi transisi yang halus.
- Tipografi ramah anak dengan hierarki visual yang jelas.

Jangan menghasilkan desain yang terlihat seperti template CRUD, dashboard admin, atau sekadar kumpulan card dengan warna berbeda.

## 3. Area yang Harus Ditingkatkan

Evaluasi dan redesign seluruh layar:
1. Home Screen — harus menjadi halaman yang menarik secara visual dan memiliki focal point yang kuat.
2. Animal Discovery — kartu hewan harus lebih ekspresif dan interaktif.
3. Matching Game — pengalaman bermain harus terasa seperti mini-game sungguhan, bukan sekadar form mencocokkan objek.
4. Puzzle Game — interaksi dan visual puzzle harus terasa hidup.
5. Coloring — tampilkan pengalaman mewarnai yang intuitif.
6. Collection — buat koleksi hewan terasa seperti reward yang menarik untuk dikumpulkan.
7. Reward — animasi keberhasilan, bintang, dan feedback harus terasa memuaskan.

## 4. Pertahankan Implementasi yang Sudah Ada

PENTING:
- Jangan menghapus fitur yang sudah berjalan.
- Jangan merusak business logic.
- Jangan mengubah data hewan yang sudah tersedia.
- Pertahankan sistem progress, reward, dan penyimpanan.
- Pertahankan dukungan Bahasa Indonesia dan Inggris.
- Jangan melakukan rewrite aplikasi dari awal hanya untuk memperbaiki tampilan.

Fokus utama adalah meningkatkan kualitas UI/UX di atas arsitektur dan fitur yang sudah tersedia.

## 5. Standar Kualitas

Saya tidak menginginkan sekadar perubahan warna, border radius, atau shadow.

Saya ingin redesign yang menyentuh:
- Layout dan komposisi.
- Visual hierarchy.
- Ilustrasi dan aset visual.
- Konsistensi design system.
- Navigasi dan interaksi.
- Animasi dan feedback.
- Empty states dan loading states.
- Responsivitas berbagai ukuran layar.

## 6. Cara Pengerjaan

Sebelum melakukan perubahan:
1. Audit seluruh halaman dan komponen yang sudah ada.
2. Identifikasi bagian yang terlihat basic atau belum konsisten.
3. Tentukan arah visual dan design system baru.
4. Implementasikan redesign secara bertahap.
5. Pastikan semua fitur lama tetap berfungsi.
6. Jalankan testing setelah perubahan.

**Expected Result:**

Animal World harus terlihat seperti produk aplikasi edukasi anak yang benar-benar dirancang oleh tim product designer profesional, bukan sekadar aplikasi prototype yang sudah memiliki fungsi.

Prioritaskan kualitas visual, pengalaman anak, dan konsistensi desain tanpa mengorbankan stabilitas fitur yang sudah dibangun.