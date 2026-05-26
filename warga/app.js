// ==========================================
// R-MOD Warga Core Logic (Portal Warga Mandiri)
// ==========================================

const DEFAULT_STATE = {
  warga: [
    { nik: "3201010101", nama: "Budi Santoso", rumah: "No. 12B, RT 03/RW 04", hp: "0812-3456-7890", password: "warga", avatar: "B" },
    { nik: "3201010102", nama: "Siti Aminah", rumah: "No. 08, RT 03/RW 04", hp: "0856-1122-3344", password: "warga", avatar: "S" },
    { nik: "3201010105", nama: "Joko Susilo", rumah: "No. 20A, RT 03/RW 04", hp: "0821-9988-7766", password: "warga", avatar: "J" },
    { nik: "3201010106", nama: "Ahmad Hidayat", rumah: "No. 04, RT 03/RW 04", hp: "0813-4455-6677", password: "warga", avatar: "A" },
    { nik: "3201010107", nama: "Ratna Sari", rumah: "No. 17C, RT 03/RW 04", hp: "0878-8877-6655", password: "warga", avatar: "R" }
  ],
  iuran: [
    { id: "i-01", nik: "3201010101", bulan: "Maret 2026", nominal: 50000, status: "lunas", metode: "Tunai", tanggal: "2026-03-05", bukti: null },
    { id: "i-02", nik: "3201010101", bulan: "April 2026", nominal: 50000, status: "lunas", metode: "QRIS", tanggal: "2026-04-06", bukti: "demo" },
    { id: "i-03", nik: "3201010101", bulan: "Mei 2026", nominal: 50000, status: "belum_bayar", metode: null, tanggal: null, bukti: null },
    { id: "i-04", nik: "3201010102", bulan: "Maret 2026", nominal: 50000, status: "lunas", metode: "Tunai", tanggal: "2026-03-05", bukti: null },
    { id: "i-05", nik: "3201010102", bulan: "April 2026", nominal: 50000, status: "lunas", metode: "Tunai", tanggal: "2026-04-02", bukti: null },
    { id: "i-06", nik: "3201010102", bulan: "Mei 2026", nominal: 50000, status: "belum_bayar", metode: null, tanggal: null, bukti: null },
    { id: "i-07", nik: "3201010105", bulan: "Maret 2026", nominal: 50000, status: "lunas", metode: "QRIS", tanggal: "2026-03-08", bukti: "demo" },
    { id: "i-08", nik: "3201010105", bulan: "April 2026", nominal: 50000, status: "belum_bayar", metode: null, tanggal: null, bukti: null },
    { id: "i-09", nik: "3201010106", bulan: "Maret 2026", nominal: 50000, status: "lunas", metode: "Tunai", tanggal: "2026-03-02", bukti: null }
  ],
  surat: [
    { id: "s-01", nik: "3201010101", namaWarga: "Budi Santoso", jenis: "Surat Domisili", keperluan: "Persyaratan pembukaan rekening Bank Mandiri cabang Pajajaran", status: "Disetujui", tanggal: "2026-05-10", catatan: "Surat pengantar disetujui. QR Code verifikasi terlampir." },
    { id: "s-02", nik: "3201010102", namaWarga: "Siti Aminah", jenis: "Surat Keterangan Usaha", keperluan: "Pengajuan Kredit Usaha Rakyat (KUR) untuk warung kelontong", status: "Diproses", tanggal: "2026-05-24", catatan: "" }
  ],
  kas: [
    { id: "k-01", tipe: "in", deskripsi: "Saldo Pindahan Kas Silpa Tahun Lalu", nominal: 11200000, tanggal: "2026-01-01" },
    { id: "k-02", tipe: "in", deskripsi: "Akumulasi Pembayaran Iuran Warga Maret 2026", nominal: 1500000, tanggal: "2026-03-31" },
    { id: "k-03", tipe: "out", deskripsi: "Pembelian Alat Kerja Bakti RT (Sapu Lidi, Ember, Masker)", nominal: 150000, tanggal: "2026-04-10" },
    { id: "k-04", tipe: "out", deskripsi: "Perbaikan Penerangan Lampu LED Jalan Gang Cempaka", nominal: 300000, tanggal: "2026-04-15" },
    { id: "k-05", tipe: "in", deskripsi: "Akumulasi Pembayaran Iuran Warga April 2026", nominal: 1600000, tanggal: "2026-04-30" },
    { id: "k-06", tipe: "out", deskripsi: "Honor Bulanan Petugas Keamanan Sipil (Satpam RT)", nominal: 1400000, tanggal: "2026-05-01" }
  ],
  appointments: [],
  emergencyLogs: [],
  pengumuman: [],
  emergency: {
    active: false,
    nik: null,
    nama: null,
    rumah: null,
    timestamp: null,
    jenis: null,
    laporan: null,
    foto: null
  },
  template: {
    kop: "RUKUN TETANGGA 03 RUKUN WARGA 04",
    subKop: "KELURAHAN BARU, KECAMATAN BOGOR UTARA",
    kontak: "Sekretariat: Jl. Gang Cempaka No. 12B, Bogor. Telp: 081234567890",
    penutup: "Demikian Surat Pengantar ini dibuat dengan sebenar-benarnya untuk dipergunakan sebagai persyaratan pengurusan dokumen yang bersangkutan."
  }
};

// --- APP STATE & MEMORY CONTEXT ---
let state = {};
let currentUser = null; // Stores { role: 'warga', data: {...} }
let selectedBillId = null;
let uploadedReceiptBase64 = null;
let uploadedDocBase64 = null;
let currentWargaTab = 'iuran';

// Audio Panic Siren Context
let audioCtx = null;
let sirenInterval = null;
let sirenOscillator = null;
let sirenGain = null;
let isSirenPlaying = false;
let sirenTimeout = null;

// Initialize state from local storage or load seeds
function initApp() {
  const savedState = localStorage.getItem('rmod_state');
  let needsSave = false;
  if (savedState) {
    try {
      state = JSON.parse(savedState);
    } catch (e) {
      console.error("Error loading state, reset to default", e);
      state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      needsSave = true;
    }
  } else {
    state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    needsSave = true;
  }
  
  // Defensive compatibility checks — only fix missing/corrupt keys,
  // do NOT reset valid empty arrays (empty [] is valid state)
  if (!state.warga || !Array.isArray(state.warga)) {
    state.warga = JSON.parse(JSON.stringify(DEFAULT_STATE.warga));
    needsSave = true;
  }
  if (!state.iuran || !Array.isArray(state.iuran)) {
    state.iuran = JSON.parse(JSON.stringify(DEFAULT_STATE.iuran));
    needsSave = true;
  }
  if (!state.kas || !Array.isArray(state.kas)) {
    state.kas = JSON.parse(JSON.stringify(DEFAULT_STATE.kas));
    needsSave = true;
  }
  if (!state.surat || !Array.isArray(state.surat)) {
    state.surat = JSON.parse(JSON.stringify(DEFAULT_STATE.surat));
    needsSave = true;
  }
  if (!state.appointments || !Array.isArray(state.appointments)) {
    state.appointments = JSON.parse(JSON.stringify(DEFAULT_STATE.appointments));
    needsSave = true;
  }
  if (!state.emergencyLogs || !Array.isArray(state.emergencyLogs)) {
    state.emergencyLogs = JSON.parse(JSON.stringify(DEFAULT_STATE.emergencyLogs));
    needsSave = true;
  }
  if (!state.pengumuman || !Array.isArray(state.pengumuman)) {
    state.pengumuman = JSON.parse(JSON.stringify(DEFAULT_STATE.pengumuman));
    needsSave = true;
  }
  if (!state.emergency) {
    state.emergency = JSON.parse(JSON.stringify(DEFAULT_STATE.emergency));
    needsSave = true;
  }
  if (!state.template) {
    state.template = JSON.parse(JSON.stringify(DEFAULT_STATE.template));
    needsSave = true;
  }
  if (needsSave) saveState();
  
  // Restore session if exists
  const savedSession = localStorage.getItem('rmod_session');
  if (savedSession) {
    let sessionData = null;
    try {
      sessionData = JSON.parse(savedSession);
    } catch (err) {
      localStorage.removeItem('rmod_session');
      showLoginScreen();
      return;
    }
    
    if (sessionData && sessionData.role === 'warga') {
      const checkWarga = state.warga.find(w => w.nik === sessionData.data.nik);
      if (checkWarga) {
        currentUser = { role: 'warga', data: checkWarga };
        localStorage.setItem('rmod_session', JSON.stringify(currentUser));
        loadDashboard();
      } else {
        localStorage.removeItem('rmod_session');
        showLoginScreen();
      }
    } else {
      localStorage.removeItem('rmod_session');
      showLoginScreen();
    }
  } else {
    showLoginScreen();
  }
  
  setupLoginHandler();
  setupLetterHandler();
  setupAppointmentHandler();
  setupPanicButtonHandler();
  lucide.createIcons();
}

function saveState() {
  localStorage.setItem('rmod_state', JSON.stringify(state));
}

// --- MODAL UTILITIES ---
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

// --- TOAST NOTIFICATIONS (Senior Accessible) ---
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'check-circle';
  if (type === 'warning') icon = 'alert-triangle';
  if (type === 'danger') icon = 'shield-alert';
  if (type === 'info') icon = 'info';
  
  toast.innerHTML = `<i data-lucide="${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);
  lucide.createIcons();
  
  setTimeout(() => {
    toast.style.animation = 'slide-in-toast 0.3s reverse forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

// --- SESSION MANAGEMENT ---
function showLoginScreen() {
  document.getElementById('app-header').style.display = 'none';
  document.getElementById('view-warga').style.display = 'none';
  document.getElementById('view-login').style.display = 'flex';
}

function setupLoginHandler() {
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputUser = document.getElementById('login-username').value.trim();
    const inputPass = document.getElementById('login-password').value;
    
    // Citizen login verification
    const foundWarga = state.warga.find(w => w.nik === inputUser && w.password === inputPass);
    if (foundWarga) {
      currentUser = { role: 'warga', data: foundWarga };
      localStorage.setItem('rmod_session', JSON.stringify(currentUser));
      showToast(`Selamat Datang Bapak/Ibu ${foundWarga.nama}!`, 'success');
      loadDashboard();
    } else {
      showToast("NIK atau Kata Sandi Salah! Gunakan akun demo di bawah untuk mencoba.", 'danger');
    }
  });
  
  document.getElementById('logout-btn').addEventListener('click', () => {
    stopSiren();
    currentUser = null;
    localStorage.removeItem('rmod_session');
    showLoginScreen();
    loginForm.reset();
    showToast("Anda telah keluar dari portal warga secara aman.", 'success');
  });
}

function renderHeader() {
  const header = document.getElementById('app-header');
  header.style.display = 'block';
  
  const avatar = document.getElementById('header-avatar');
  const username = document.getElementById('header-username');
  
  if (currentUser && currentUser.role === 'warga') {
    avatar.innerText = currentUser.data.avatar;
    avatar.style.backgroundColor = 'var(--primary)';
    username.innerHTML = `${currentUser.data.nama} <span style="font-size:0.85rem; font-weight:normal; background:var(--primary-light); color:var(--primary); padding:0.15rem 0.5rem; border-radius:10px; margin-left:5px;">Warga</span>`;
  }
  lucide.createIcons();
}

function loadDashboard() {
  document.getElementById('view-login').style.display = 'none';
  renderHeader();
  document.getElementById('view-warga').style.display = 'block';
  renderWargaPortal();
}

// --- PORTAL WARGA CONTROLLERS ---
function renderWargaPortal() {
  if (!currentUser || currentUser.role !== 'warga') return;
  
  const data = currentUser.data;
  
  // Render profile
  document.getElementById('warga-avatar-char').innerText = data.avatar;
  document.getElementById('warga-profile-name').innerText = data.nama;
  document.getElementById('warga-profile-nik').innerText = `NIK: ${data.nik}`;
  document.getElementById('warga-meta-house').innerText = data.rumah || '-';
  document.getElementById('warga-meta-phone').innerText = data.hp || '-';
  
  // Calculate iuran status
  const unpaidCount = state.iuran.filter(i => i.nik === data.nik && i.status === 'belum_bayar').length;
  const statusBadge = document.getElementById('warga-meta-status-badge');
  if (unpaidCount > 0) {
    statusBadge.innerHTML = `<span class="badge badge-danger">${unpaidCount} Tagihan Tertunda</span>`;
  } else {
    statusBadge.innerHTML = `<span class="badge badge-success">Lunas Sempurna</span>`;
  }
  
  calculateWargaCashStats();
  renderWargaIuranTable();
  renderCashLogsList('warga-cash-logs');
  renderWargaLettersTable();
  renderWargaAppointmentsTable();
  renderWargaPengumuman();
  
  resetWargaPanicButtonUI();
  lucide.createIcons();
}

function renderWargaPengumuman() {
  const container = document.getElementById('warga-pengumuman-feed');
  if (!container) return;

  if (!state.pengumuman || state.pengumuman.length === 0) {
    container.innerHTML = `
      <div class="card" style="background-color: var(--primary-light); border-color: rgba(37, 99, 235, 0.2); padding: 1.25rem; display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
        <i data-lucide="megaphone" style="color: var(--primary); width: 32px; height: 32px; flex-shrink: 0;"></i>
        <div>
          <h4 style="color: var(--primary); font-size: 1.1rem; font-weight: 700;">Informasi RT/RW</h4>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">Selamat datang di portal layanan mandiri R-MOD. Belum ada pengumuman terbaru dari pengurus RT/RW.</p>
        </div>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  // Sort newest first
  const sorted = [...state.pengumuman].sort((a, b) => b.id - a.id);

  // Build slide markup
  let slides = '';
  sorted.forEach(p => {
    let imgHtml = '';
    if (p.foto) {
      imgHtml = `<div style="margin-top: 1rem;"><img src="${p.foto}" style="max-width: 100%; max-height: 300px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);"></div>`;
    }
    slides += `
      <div class="carousel-slide" style="flex:0 0 100%; scroll-snap-align:start;">
        <div class="card" style="background-color: #fff; border-left: 4px solid var(--primary); padding: 1.25rem; margin-bottom: 1.5rem; position: relative;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
            <h4 style="color: var(--primary); font-size: 1.15rem; font-weight: 700; margin: 0;"><i data-lucide="bell" style="width:18px; height:18px; vertical-align:-2px; margin-right:4px;"></i> ${p.judul}</h4>
            <span style="font-size: 0.8rem; color: var(--text-muted); background: var(--bg-alt); padding: 0.2rem 0.5rem; border-radius: 10px;">${p.tanggal}</span>
          </div>
          <p style="color: var(--text-primary); font-size: 0.95rem; white-space: pre-wrap; line-height: 1.5; margin: 0;">${p.isi}</p>
          ${imgHtml}
        </div>
      </div>`;
  });

  const carouselHtml = `
    <div class="carousel-wrapper" style="position:relative; overflow:hidden;">
      <button class="carousel-btn" onclick="prevPengumuman()" style="position:absolute; left:0; top:50%; transform:translateY(-50%); background:rgba(255,255,255,0.7); border:none; font-size:2rem; cursor:pointer; z-index:2; padding:0 0.5rem;">&#8249;</button>
      <div id="warga-pengumuman-track" class="carousel-track" style="display:flex; overflow-x:hidden; scroll-snap-type:x mandatory; gap:1rem; scroll-behavior:smooth;">
        ${slides}
      </div>
      <button class="carousel-btn" onclick="nextPengumuman()" style="position:absolute; right:0; top:50%; transform:translateY(-50%); background:rgba(255,255,255,0.7); border:none; font-size:2rem; cursor:pointer; z-index:2; padding:0 0.5rem;">&#8250;</button>
    </div>
  `;

  container.innerHTML = carouselHtml;
  lucide.createIcons();
}

// Carousel navigation helpers for warga pengumuman
function prevPengumuman() {
  const track = document.getElementById('warga-pengumuman-track');
  if (!track) return;
  const width = track.clientWidth;
  track.scrollBy({ left: -width, behavior: 'smooth' });
}
function nextPengumuman() {
  const track = document.getElementById('warga-pengumuman-track');
  if (!track) return;
  const width = track.clientWidth;
  track.scrollBy({ left: width, behavior: 'smooth' });
}

function switchWargaTab(tab) {
  currentWargaTab = tab;
  const iuranBtn = document.getElementById('tab-warga-iuran');
  const suratBtn = document.getElementById('tab-warga-surat');
  const janjianBtn = document.getElementById('tab-warga-janjian');
  
  const iuranCont = document.getElementById('warga-tab-iuran-content');
  const suratCont = document.getElementById('warga-tab-surat-content');
  const janjianCont = document.getElementById('warga-tab-janjian-content');
  
  iuranBtn.classList.remove('active');
  suratBtn.classList.remove('active');
  if (janjianBtn) janjianBtn.classList.remove('active');
  
  iuranCont.style.display = 'none';
  suratCont.style.display = 'none';
  if (janjianCont) janjianCont.style.display = 'none';
  
  if (tab === 'iuran') {
    iuranBtn.classList.add('active');
    iuranCont.style.display = 'block';
  } else if (tab === 'surat') {
    suratBtn.classList.add('active');
    suratCont.style.display = 'block';
  } else if (tab === 'janjian') {
    if (janjianBtn) janjianBtn.classList.add('active');
    if (janjianCont) janjianCont.style.display = 'block';
    renderWargaAppointmentsTable();
  }
  
  resetWargaPanicButtonUI();
  lucide.createIcons();
}

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
}

function calculateWargaCashStats() {
  let totalKas = 0;
  state.kas.forEach(k => {
    totalKas += (k.tipe === 'in' ? k.nominal : -k.nominal);
  });
  document.getElementById('warga-total-kas').innerText = formatRupiah(totalKas);
  
  // Kas masuk dan keluar bulan ini
  let kasMasuk = 0;
  let kasKeluar = 0;
  const currentMonth = new Date().getMonth(); // 0-11
  const currentYear = new Date().getFullYear();
  
  state.kas.forEach(k => {
    if (k.tanggal) {
      // Assuming tanggal format is "YYYY-MM-DD"
      const dateParts = k.tanggal.split('-');
      if (dateParts.length >= 2) {
        if (parseInt(dateParts[0]) === currentYear && parseInt(dateParts[1]) - 1 === currentMonth) {
          if (k.tipe === 'in') {
            kasMasuk += k.nominal;
          } else {
            kasKeluar += k.nominal;
          }
        }
      }
    }
  });
  document.getElementById('warga-kas-masuk').innerText = "+" + formatRupiah(kasMasuk);
  const elKasKeluar = document.getElementById('warga-kas-keluar');
  if (elKasKeluar) {
    elKasKeluar.innerText = "-" + formatRupiah(kasKeluar);
  }
}

function renderWargaIuranTable() {
  const container = document.getElementById('warga-iuran-table-body');
  container.innerHTML = '';
  
  const myIuran = state.iuran.filter(i => i.nik === currentUser.data.nik);
  
  if (myIuran.length === 0) {
    container.innerHTML = `<tr><td colspan="5" style="text-align:center; font-weight:600; padding:2rem;">Tidak ada catatan iuran bulanan untuk Anda.</td></tr>`;
    return;
  }
  
  myIuran.forEach(item => {
    let statusHTML = '';
    let actionHTML = '';
    
    if (item.status === 'lunas') {
      statusHTML = `<span class="badge badge-success"><i data-lucide="check-circle" style="width:14px; height:14px;"></i> Lunas (${item.metode})</span>`;
      actionHTML = `<span style="font-size:0.9rem; color:var(--text-muted); font-weight:600;">Diverifikasi pd ${item.tanggal}</span>`;
    } else if (item.status === 'verifikasi_pending') {
      statusHTML = `<span class="badge badge-warning"><i data-lucide="clock" style="width:14px; height:14px;"></i> Menunggu Verifikasi</span>`;
      actionHTML = `<button class="btn btn-secondary" onclick="showUploadedReceiptDemo('${item.id}')" style="min-height:36px; padding:0.25rem 0.75rem; font-size:0.9rem;"><i data-lucide="eye"></i> Lihat Bukti</button>`;
    } else {
      statusHTML = `<span class="badge badge-danger"><i data-lucide="alert-circle" style="width:14px; height:14px;"></i> Belum Bayar</span>`;
      actionHTML = `<button class="btn btn-primary" onclick="openPaymentModal('${item.id}', '${item.bulan}', ${item.nominal})" style="min-height:36px; padding:0.25rem 0.75rem; font-size:0.9rem; background-color:var(--primary);"><i data-lucide="credit-card"></i> Bayar Sekarang</button>`;
    }
    
    container.innerHTML += `
      <tr>
        <td style="font-weight:700;">${item.bulan}</td>
        <td>Iuran Keamanan, Kebersihan, Kas Sosial</td>
        <td style="font-weight:700;">${formatRupiah(item.nominal)}</td>
        <td>${statusHTML}</td>
        <td>${actionHTML}</td>
      </tr>
    `;
  });
  lucide.createIcons();
}

function renderCashLogsList(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  
  // Sort descending
  const sorted = [...state.kas].sort((a, b) => b.id.localeCompare(a.id));
  
  if (sorted.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:2rem; color:var(--text-secondary);">Belum ada catatan kas RT.</div>`;
    return;
  }
  
  sorted.forEach(log => {
    const isIncome = log.tipe === 'in';
    const amountFormatted = (isIncome ? '+' : '-') + formatRupiah(log.nominal);
    const badgeClass = isIncome ? 'in' : 'out';
    const icon = isIncome ? 'arrow-down-left' : 'arrow-up-right';
    
    container.innerHTML += `
      <div class="cash-log-item">
        <div style="display: flex; gap: 0.75rem; align-items: center;">
          <div class="cash-log-icon ${badgeClass}"><i data-lucide="${icon}"></i></div>
          <div>
            <div class="cash-log-desc">${log.deskripsi}</div>
            <div class="cash-log-meta">${log.tanggal} | Saldo Tercatat</div>
          </div>
        </div>
        <div class="cash-log-amount ${badgeClass}">${amountFormatted}</div>
      </div>
    `;
  });
  lucide.createIcons();
}

function renderWargaLettersTable() {
  const container = document.getElementById('warga-surat-table-body');
  container.innerHTML = '';
  
  const myLetters = state.surat.filter(s => s.nik === currentUser.data.nik);
  if (myLetters.length === 0) {
    container.innerHTML = `<tr><td colspan="5" style="text-align:center; font-weight:600; padding:2rem; color:var(--text-secondary);">Anda belum pernah mengajukan surat pengantar.</td></tr>`;
    return;
  }
  
  myLetters.forEach(letter => {
    let statusBadge = '';
    let fileAction = '';
    
    if (letter.status === 'Disetujui') {
      statusBadge = `<span class="badge badge-success"><i data-lucide="check-circle" style="width:14px; height:14px;"></i> Disetujui</span>`;
      fileAction = `<button class="btn btn-secondary" onclick="simulateDownloadLetter('${letter.id}')" style="min-height:36px; padding:0.25rem 0.5rem; font-size:0.85rem; background-color:var(--success-light); color:var(--success); border-color:rgba(5,150,105,0.2);"><i data-lucide="download"></i> Unduh PDF</button>`;
    } else if (letter.status === 'Ditolak') {
      statusBadge = `<span class="badge badge-danger"><i data-lucide="x-circle" style="width:14px; height:14px;"></i> Ditolak</span>`;
      fileAction = `<span style="font-size:0.85rem; color:var(--danger); font-weight:600;">Alasan: ${letter.catatan || 'Berkas tidak lengkap'}</span>`;
    } else {
      statusBadge = `<span class="badge badge-warning"><i data-lucide="clock" style="width:14px; height:14px;"></i> Diproses</span>`;
      fileAction = `<span style="font-size:0.85rem; color:var(--text-muted);">Menunggu tanda tangan RT</span>`;
    }
    
    container.innerHTML += `
      <tr>
        <td style="font-family:monospace;">${letter.tanggal}</td>
        <td style="font-weight:700;">${letter.jenis}</td>
        <td>${letter.keperluan}</td>
        <td>${statusBadge}</td>
        <td>${fileAction}</td>
      </tr>
    `;
  });
  lucide.createIcons();
}

function showUploadedReceiptDemo(billId) {
  const bill = state.iuran.find(i => i.id === billId);
  if (bill && bill.bukti) {
    document.getElementById('receipt-modal-name').innerText = currentUser.data.nama;
    document.getElementById('receipt-modal-month').innerText = bill.bulan;
    document.getElementById('receipt-modal-amount').innerText = formatRupiah(bill.nominal);
    
    const imgElement = document.getElementById('receipt-modal-image');
    if (bill.bukti === 'demo') {
      imgElement.src = "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=600";
    } else {
      imgElement.src = bill.bukti;
    }
    
    openModal('modal-view-receipt');
  }
}

function simulateDownloadLetter(letterId) {
  const letter = state.surat.find(s => s.id === letterId);
  if (letter) {
    showToast("Mengunduh dokumen surat pengantar resmi...", "success");
    
    // Open standard printable letter preview window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
      <head>
        <title>Surat Pengantar RT/RW - ${letter.namaWarga}</title>
        <style>
          body { font-family: 'Times New Roman', serif; padding: 3rem; line-height: 1.6; color: #000; }
          .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 0.5rem; margin-bottom: 2rem; }
          .kop h2 { margin: 0; font-size: 1.4rem; font-weight: bold; text-transform: uppercase; }
          .kop p { margin: 2px 0; font-size: 0.95rem; }
          .title { text-align: center; font-size: 1.25rem; font-weight: bold; text-decoration: underline; text-transform: uppercase; margin-bottom: 0.15rem; }
          .no-surat { text-align: center; font-size: 1rem; margin-bottom: 2.5rem; }
          .content-block { text-align: justify; margin-bottom: 1.5rem; text-indent: 40px; }
          .data-table { width: 85%; margin: 1rem auto; border-collapse: collapse; }
          .data-table td { padding: 4px 10px; vertical-align: top; }
          .data-table td.label { width: 35%; }
          .data-table td.colon { width: 3%; }
          .footer-section { margin-top: 3.5rem; display: flex; justify-content: space-between; }
          .sign-box { text-align: center; width: 40%; }
          .qr-verification { margin-top: 10px; text-align: center; }
          @media print { body { padding: 1.5rem; } }
        </style>
      </head>
      <body>
        <div class="kop">
          <h2>${state.template.kop}</h2>
          <p>${state.template.subKop}</p>
          <p>${state.template.kontak}</p>
        </div>
        <div class="title">SURAT PENGANTAR KETERANGAN</div>
        <div class="no-surat">Nomor: 470 / s-${letter.id} / RT03 / V / 2026</div>
        
        <p class="content-block">
          Yang bertandatangan di bawah ini Pengurus Rukun Tetangga (RT) 03 Rukun Warga 04 Kelurahan Baru, Kecamatan Bogor Utara, menerangkan bahwa warga di bawah ini:
        </p>
        
        <table class="data-table">
          <tr><td class="label">Nama Lengkap</td><td class="colon">:</td><td style="font-weight: bold;">${letter.namaWarga}</td></tr>
          <tr><td class="label">Nomor NIK</td><td class="colon">:</td><td style="font-family: monospace;">${letter.nik}</td></tr>
          <tr><td class="label">Alamat Rumah</td><td class="colon">:</td><td>${currentUser.data.rumah}</td></tr>
          <tr><td class="label">RT / RW</td><td class="colon">:</td><td>RT 03 / RW 04</td></tr>
        </table>
        
        <p class="content-block">
          Adalah benar warga yang berdomisili di lingkungan kami dan berkelakuan baik. Surat Pengantar ini diberikan secara khusus kepada yang bersangkutan untuk keperluan: <strong style="text-decoration: underline;">${letter.keperluan}</strong>.
        </p>
        
        <p class="content-block">
          ${state.template.penutup}
        </p>
        
        <div class="footer-section">
          <div class="sign-box" style="visibility: hidden;">
            <p>Mengetahui,</p>
            <p style="margin-top: 5rem;"><strong>KETUA RW 04</strong></p>
          </div>
          <div class="sign-box">
            <p>Bogor, ${letter.tanggal}</p>
            <p>Ketua RT 03 RW 04</p>
            <div class="qr-verification">
              <svg width="70" height="70" viewBox="0 0 29 29" style="background:#fff; padding:2px; border:1px solid #ddd;">
                <path d="M0 0h7v7H0zm1 1v5h5V1zm8 8h7v7H9zm1 1v5h5v-5zm-9 9h7v7H0zm1 1v5h5v-5zm18-18h7v7h-7zm1 1v5h5V1zm3 13v3h-3v-3zm-1 4v4h3v-2h-1v-2zm-6-4v2h2v-2zm7 5v2h-1v-2zm-12-3h2v2H8zm3 3h2v2h-2zm3-3h2v2h-2zm-3-4h3v2h-3zm8 0h3v2h-3z" fill="#000"/>
              </svg>
              <div style="font-size:0.65rem; color:#666; margin-top:2px;">Tanda Tangan Digital</div>
            </div>
            <p style="margin-top: 10px;"><strong>BUDI SANTOSO</strong></p>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  }
}

function setupLetterHandler() {
  const form = document.getElementById('warga-surat-form');
  if (form) {
    // letter type selector triggers
    const selectorButtons = document.querySelectorAll('#surat-type-selector .letter-type-btn');
    const docWrapper = document.getElementById('document-to-sign-wrapper');
    const labelField = document.getElementById('surat-keperluan-label');
    const textareaField = document.getElementById('surat-keperluan');
    
    let activeType = 'Surat Domisili';
    
    selectorButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        selectorButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeType = btn.getAttribute('data-type');
        
        if (activeType === 'Hanya Tanda Tangan') {
          docWrapper.style.display = 'block';
          labelField.innerText = 'Deskripsi Dokumen & Instruksi Khusus';
          textareaField.placeholder = 'Tuliskan deskripsi berkas fisik/digital yang Anda unggah untuk ditandatangani Ketua RT (misalnya: Surat Pernyataan Waris Ahli Keluarga)...';
        } else {
          docWrapper.style.display = 'none';
          labelField.innerText = 'Keperluan / Keterangan Tambahan';
          textareaField.placeholder = 'Tuliskan alasan pengajuan surat secara lengkap (misal: Untuk persyaratan melamar pekerjaan atau pindah domisili)...';
        }
      });
    });
    
    // doc upload listener inside surat
    const docInput = document.getElementById('doc-upload-input');
    const docLabel = document.getElementById('doc-upload-label');
    const docPreview = document.getElementById('doc-preview');
    
    if (docInput) {
      docInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(evt) {
            uploadedDocBase64 = evt.target.result;
            if (docPreview) {
              docPreview.src = evt.target.result;
              docPreview.style.display = 'block';
            }
            if (docLabel) docLabel.innerText = `Berkas Terbaca: ${file.name}`;
            showToast("Foto dokumen berhasil dimuat!", 'success');
          };
          reader.readAsDataURL(file);
        }
      });
    }
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const reason = textareaField.value.trim();
      
      if (activeType === 'Hanya Tanda Tangan' && !uploadedDocBase64) {
        showToast("Unggah foto dokumen fisik yang ingin ditandatangani Ketua RT terlebih dahulu!", "warning");
        return;
      }
      
      const newRequest = {
        id: `s-${Date.now()}`,
        nik: currentUser.data.nik,
        namaWarga: currentUser.data.nama,
        jenis: activeType,
        keperluan: reason,
        status: "Diproses",
        tanggal: new Date().toISOString().split('T')[0],
        catatan: "",
        dokumen: activeType === 'Hanya Tanda Tangan' ? uploadedDocBase64 : null
      };
      
      state.surat.push(newRequest);
      saveState();
      
      // Reset
      form.reset();
      uploadedDocBase64 = null;
      if (docPreview) docPreview.style.display = 'none';
      if (docLabel) docLabel.innerText = 'Klik atau Tarik Foto Dokumen di Sini';
      
      renderWargaLettersTable();
      showToast("Pengajuan Surat Pengantar berhasil dikirim ke pengurus!", 'success');
    });
  }
}

// --- QRIS / MANUAL IURAN PAYMENT MODAL ---
function openPaymentModal(billId, month, amount) {
  selectedBillId = billId;
  uploadedReceiptBase64 = null;
  
  document.getElementById('modal-qris-title').innerText = `Bayar Iuran ${month}`;
  document.getElementById('modal-cash-nominal').innerText = formatRupiah(amount);
  document.getElementById('qris-receipt-preview').style.display = 'none';
  document.getElementById('upload-label-text').innerText = 'Klik atau Tarik Gambar Bukti Sini';
  
  togglePayMethod('qris');
  openModal('modal-qris');
}

function togglePayMethod(method) {
  const qrisBtn = document.getElementById('method-qris-btn');
  const cashBtn = document.getElementById('method-cash-btn');
  const qrisArea = document.getElementById('pay-qris-area');
  const cashArea = document.getElementById('pay-cash-area');
  
  if (method === 'qris') {
    qrisBtn.classList.add('active');
    cashBtn.classList.remove('active');
    qrisArea.style.display = 'block';
    cashArea.style.display = 'none';
  } else {
    qrisBtn.classList.remove('active');
    cashBtn.classList.add('active');
    qrisArea.style.display = 'none';
    cashArea.style.display = 'block';
  }
}

function handleReceiptUpload(event) {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      showToast("Ukuran berkas terlalu besar! Maksimal 2MB.", 'danger');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      uploadedReceiptBase64 = e.target.result;
      const preview = document.getElementById('qris-receipt-preview');
      preview.src = e.target.result;
      preview.style.display = 'block';
      document.getElementById('upload-label-text').innerText = `Gambar Siap: ${file.name}`;
      showToast("Gambar bukti transfer berhasil dibaca!", 'success');
    };
    reader.readAsDataURL(file);
  }
}

function submitWargaPayment() {
  const isQris = document.getElementById('method-qris-btn').classList.contains('active');
  const bill = state.iuran.find(i => i.id === selectedBillId);
  
  if (!bill) return;
  
  if (isQris) {
    let receiptToSave = uploadedReceiptBase64;
    
    // Frictionless fallback for testing/demoing: if no image is uploaded, use demo receipt
    if (!receiptToSave) {
      receiptToSave = 'demo';
      showToast("Bukti transfer otomatis di-autofill dengan gambar demo untuk kemudahan pengujian!", 'info');
    }
    
    bill.status = 'verifikasi_pending';
    bill.metode = 'QRIS';
    bill.bukti = receiptToSave;
    bill.tanggal = new Date().toISOString().split('T')[0];
    
    saveState();
    closeModal('modal-qris');
    renderWargaIuranTable();
    showToast("Bukti pembayaran QRIS berhasil dilaporkan. Menunggu ACC Bendahara!", 'success');
  } else {
    // Cash submission
    let sender = document.getElementById('cash-sender-name').value.trim();
    
    // Autofill default sender if left blank for extremely quick testing
    if (!sender) {
      sender = (currentUser && currentUser.data) ? currentUser.data.nama : "Warga RT";
    }
    
    // We will place it as pending but marked as Cash
    bill.status = 'verifikasi_pending';
    bill.metode = `Tunai (Titipan: ${sender})`;
    bill.bukti = 'demo'; // cash does not require upload, represents as cash logo
    bill.tanggal = new Date().toISOString().split('T')[0];
    
    saveState();
    closeModal('modal-qris');
    renderWargaIuranTable();
    document.getElementById('cash-sender-name').value = '';
    showToast("Laporan iuran tunai berhasil diajukan! Silakan serahkan uang ke Bendahara.", 'success');
  }
  
  renderWargaPortal();
}

// --- EMERGENCY PANIC BUTTON ---
function setupPanicButtonHandler() {
  const panicBtn = document.getElementById('panic-button');
  if (panicBtn) {
    let pressTimer = null;
    let count = 3;
    let countdownInterval = null;
    
    function startPress() {
      // Clear any prior active triggers
      clearInterval(countdownInterval);
      clearTimeout(pressTimer);
      
      count = 3;
      document.getElementById('panic-countdown-box').innerText = count;
      document.getElementById('panic-countdown-box').classList.add('visible');
      panicBtn.classList.add('pressing');
      
      countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
          document.getElementById('panic-countdown-box').innerText = count;
        } else {
          clearInterval(countdownInterval);
        }
      }, 1000);
      
      pressTimer = setTimeout(() => {
        // Trigger emergency!
        document.getElementById('panic-countdown-box').classList.remove('visible');
        panicBtn.classList.remove('pressing');
        triggerPanicButton();
      }, 3000);
    }
    
    function cancelPress() {
      clearInterval(countdownInterval);
      clearTimeout(pressTimer);
      document.getElementById('panic-countdown-box').classList.remove('visible');
      panicBtn.classList.remove('pressing');
      document.getElementById('panic-countdown-box').innerText = '3';
    }
    
    // Support mouse hold
    panicBtn.addEventListener('mousedown', startPress);
    panicBtn.addEventListener('mouseup', cancelPress);
    panicBtn.addEventListener('mouseleave', cancelPress);
    
    // Support mobile touch hold
    panicBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startPress();
    });
    panicBtn.addEventListener('touchend', cancelPress);
  }
  
  // Mute siren listeners
  const wargaMuteBtn = document.getElementById('warga-mute-siren-btn');
  if (wargaMuteBtn) {
    wargaMuteBtn.addEventListener('click', stopSiren);
  }
  
  // camera upload inside panic form
  const panicCamInput = document.getElementById('panic-upload-input');
  const panicCamLabel = document.getElementById('panic-upload-label');
  const panicCamPreview = document.getElementById('panic-photo-preview');
  
  if (panicCamInput) {
    panicCamInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          if (panicCamPreview) {
            panicCamPreview.src = evt.target.result;
            panicCamPreview.style.display = 'block';
          }
          if (panicCamLabel) panicCamLabel.innerText = `Foto Siap: ${file.name}`;
          showToast("Foto keadaan darurat berhasil ditambahkan!", 'success');
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

function resetWargaPanicButtonUI() {
  const panicBtn = document.getElementById('panic-button');
  if (panicBtn) {
    panicBtn.classList.remove('pressing');
  }
  const cb = document.getElementById('panic-countdown-box');
  if (cb) {
    cb.classList.remove('visible');
    cb.innerText = '3';
  }
}

function triggerPanicButton() {
  enableAudioContext();
  
  const type = document.getElementById('panic-type').value;
  const desc = document.getElementById('panic-desc').value.trim() || 'Membutuhkan pertolongan segera!';
  const previewImg = document.getElementById('panic-photo-preview');
  const photoBase64 = (previewImg && previewImg.style.display === 'block') ? previewImg.src : null;
  
  const now = new Date();
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toISOString().split('T')[0];
  
  // 1. Update the active emergency flag
  state.emergency = {
    active: true,
    nik: currentUser.data.nik,
    nama: currentUser.data.nama,
    rumah: currentUser.data.rumah,
    timestamp: timeStr,
    jenis: type,
    laporan: desc,
    foto: photoBase64
  };
  
  // 2. Append permanent history log inside state
  const newLog = {
    id: `e-${Date.now()}`,
    nik: currentUser.data.nik,
    namaWarga: currentUser.data.nama,
    rumah: currentUser.data.rumah,
    tanggal: dateStr,
    waktu: timeStr,
    jenis: type,
    laporan: desc,
    foto: photoBase64,
    status: "Menunggu Tindakan"
  };
  
  if (!state.emergencyLogs) state.emergencyLogs = [];
  state.emergencyLogs.push(newLog);
  
  saveState();
  
  // Reset panic forms
  document.getElementById('panic-desc').value = '';
  const camLabel = document.getElementById('panic-upload-label');
  if (camLabel) camLabel.innerHTML = `<i data-lucide="camera" style="width:14px; height:14px; vertical-align:-2px; margin-right:3px;"></i> Unggah Foto Darurat`;
  const camPreview = document.getElementById('panic-photo-preview');
  if (camPreview) {
    camPreview.style.display = 'none';
    camPreview.src = '';
  }
  lucide.createIcons();
  
  showToast("DARURAT: Panggilan bantuan dikirimkan ke Pengurus RT!", 'danger');
  
  // Local audio sound synthesis
  playSiren();
}

function playSiren() {
  if (isSirenPlaying) return;
  
  const muteBtn = document.getElementById('warga-mute-siren-btn');
  if (muteBtn) muteBtn.style.display = 'block';
  
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    isSirenPlaying = true;
    sirenOscillator = audioCtx.createOscillator();
    sirenGain = audioCtx.createGain();
    
    sirenOscillator.connect(sirenGain);
    sirenGain.connect(audioCtx.destination);
    
    sirenOscillator.type = 'sawtooth';
    sirenOscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
    sirenGain.gain.setValueAtTime(0.3, audioCtx.currentTime); // volume
    
    sirenOscillator.start();
    
    let high = true;
    sirenInterval = setInterval(() => {
      if (audioCtx && sirenOscillator) {
        sirenOscillator.frequency.linearRampToValueAtTime(high ? 1100 : 500, audioCtx.currentTime + 0.45);
        high = !high;
      }
    }, 500);
    
    // Automatically stop siren after exactly 5 seconds to prevent noise pollution
    sirenTimeout = setTimeout(() => {
      stopSiren();
      showToast("Sirene otomatis dinonaktifkan (durasi 5s tercapai).", 'info');
    }, 5000);
    
  } catch (e) {
    console.warn("Could not play synthesized siren", e);
  }
}

function stopSiren() {
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
  if (sirenTimeout) {
    clearTimeout(sirenTimeout);
    sirenTimeout = null;
  }
  
  const muteBtn = document.getElementById('warga-mute-siren-btn');
  if (muteBtn) muteBtn.style.display = 'none';
  
  if (isSirenPlaying) {
    isSirenPlaying = false;
    if (sirenOscillator) {
      try {
        sirenOscillator.stop();
        sirenOscillator.disconnect();
      } catch (err) {}
      sirenOscillator = null;
    }
    if (sirenGain) {
      try {
        sirenGain.disconnect();
      } catch (err) {}
      sirenGain = null;
    }
  }
}

function enableAudioContext() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  } catch (err) {}
}

window.addEventListener('click', enableAudioContext);
window.addEventListener('touchstart', enableAudioContext);

// --- JANJI TEMU SERVICES ---
function renderWargaAppointmentsTable() {
  const container = document.getElementById('warga-janjian-table-body');
  if (!container) return;
  container.innerHTML = '';
  
  if (!state.appointments) state.appointments = [];
  
  const myApps = state.appointments.filter(a => a.nik === currentUser.data.nik);
  if (myApps.length === 0) {
    container.innerHTML = `<tr><td colspan="6" style="text-align:center; font-weight:600; padding:2rem; color:var(--text-secondary);">Anda belum memiliki jadwal janji temu dengan pengurus.</td></tr>`;
    return;
  }
  
  myApps.forEach(item => {
    let statusBadge = '';
    if (item.status === 'Disetujui') {
      statusBadge = `<span class="badge badge-success"><i data-lucide="check-circle" style="width:14px; height:14px;"></i> Disetujui</span>`;
    } else if (item.status === 'Ditolak') {
      statusBadge = `<span class="badge badge-danger"><i data-lucide="x-circle" style="width:14px; height:14px;"></i> Ditolak</span>`;
    } else {
      statusBadge = `<span class="badge badge-warning"><i data-lucide="clock" style="width:14px; height:14px;"></i> Diproses</span>`;
    }
    
    container.innerHTML += `
      <tr>
        <td style="font-weight:700; color:var(--primary);">${item.target}</td>
        <td>${item.tanggal} <br><span style="font-size:0.85rem; color:var(--text-muted); font-family:monospace;">Pukul ${item.waktu} WIB</span></td>
        <td style="font-weight:600;">${item.keperluan}</td>
        <td>${item.keperluan.includes(' - ') ? item.keperluan.split(' - ')[1] : item.keperluan}</td>
        <td>${statusBadge}</td>
        <td style="font-style:italic; font-size:0.9rem; color:var(--text-secondary);">${item.catatan || '-'}</td>
      </tr>
    `;
  });
  lucide.createIcons();
}

function setupAppointmentHandler() {
  const form = document.getElementById('warga-janjian-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const target = document.getElementById('janjian-target').value;
      const tanggal = document.getElementById('janjian-tanggal').value;
      const waktu = document.getElementById('janjian-waktu').value;
      const tipe = document.getElementById('janjian-keperluan-tipe').value;
      const detail = document.getElementById('janjian-detail').value.trim();
      
      const newAppointment = {
        id: `a-${Date.now()}`,
        nik: currentUser.data.nik,
        namaWarga: currentUser.data.nama,
        target: target,
        tanggal: tanggal,
        waktu: waktu,
        keperluan: `${tipe} - ${detail}`,
        status: "Diproses",
        catatan: ""
      };
      
      if (!state.appointments) state.appointments = [];
      state.appointments.push(newAppointment);
      saveState();
      
      form.reset();
      renderWargaAppointmentsTable();
      showToast("Janji temu berhasil diajukan! Pengurus akan segera memverifikasi.", "success");
    });
  }
}

// --- RESET DATABASE FOR TESTING EFFICIENCY ---
function resetDemoData() {
  if (confirm("Apakah Anda yakin ingin me-reset seluruh database RT/RW ke kondisi awal bawaan demo? Semua perubahan data pengetesan Anda akan di-wipe/dibersihkan.")) {
    localStorage.removeItem('rmod_state');
    localStorage.removeItem('rmod_session');
    window.location.reload();
  }
}

// --- REAL-TIME INTER-TAB STORAGE EVENT SYNC LOOP ---
setInterval(() => {
  const oldStateStr = JSON.stringify(state);
  const savedState = localStorage.getItem('rmod_state');
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      
      // Update values reactively
      if (parsed.iuran) state.iuran = parsed.iuran;
      if (parsed.warga) state.warga = parsed.warga;
      if (parsed.surat) state.surat = parsed.surat;
      if (parsed.kas) state.kas = parsed.kas;
      if (parsed.template) state.template = parsed.template;
      if (parsed.appointments) state.appointments = parsed.appointments;
      if (parsed.emergencyLogs) state.emergencyLogs = parsed.emergencyLogs;
      if (parsed.emergency) state.emergency = parsed.emergency;
      if (parsed.pengumuman) state.pengumuman = parsed.pengumuman;
      
      const newStateStr = JSON.stringify(state);
      
      if (oldStateStr !== newStateStr && currentUser) {
        renderWargaPortal();
      }
    } catch (e) {
      console.warn("Storage sync check loop failed", e);
    }
  }
}, 2000);

window.addEventListener('storage', (e) => {
  if (e.key === 'rmod_state') {
    const savedState = e.newValue;
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        
        if (parsed.iuran) state.iuran = parsed.iuran;
        if (parsed.warga) state.warga = parsed.warga;
        if (parsed.surat) state.surat = parsed.surat;
        if (parsed.kas) state.kas = parsed.kas;
        if (parsed.template) state.template = parsed.template;
        if (parsed.appointments) state.appointments = parsed.appointments;
        if (parsed.emergencyLogs) state.emergencyLogs = parsed.emergencyLogs;
        if (parsed.emergency) state.emergency = parsed.emergency;
        if (parsed.pengumuman) state.pengumuman = parsed.pengumuman;
        
        if (currentUser) {
          renderWargaPortal();
        }
      } catch (err) {}
    }
  }
});

// --- BOOTSTRAP INIT ON DOM LOAD ---
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
