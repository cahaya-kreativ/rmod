// ========================================================
// R-MOD Developer Note: Arsitektur Terpisah
// ========================================================
// 
// Mulai Mei 2026, arsitektur R-MOD telah sepenuhnya dimodernisasi
// dan dipisahkan menjadi dua folder modular:
// 
// 1. /warga/ - Portal Layanan Mandiri khusus Warga (index.html & app.js)
//    - URL Akses: http://localhost:8080/warga/
// 
// 2. /admin/ - Dasbor Administrasi khusus Pengurus/Admin (index.html & app.js)
//    - URL Akses: http://localhost:8080/admin/
// 
// File style.css global dan folder assets/ tetap berada di direktori root
// untuk digunakan bersama secara efisien oleh kedua portal di atas.
// 
// ========================================================
