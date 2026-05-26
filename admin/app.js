// ==========================================
// R-MOD Admin Core Logic (Dasbor Pengurus RT/RW)
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
  },
  appointments: [
    { id: "a-01", nik: "3201010101", namaWarga: "Budi Santoso", target: "Ketua RT", tanggal: "2026-05-28", waktu: "19:30", keperluan: "Tanda Tangan Basah - Minta ttd basah di dokumen waris fisik", status: "Diproses", catatan: "" }
  ],
  emergencyLogs: [
    { id: "e-01", nik: "3201010102", namaWarga: "Siti Aminah", rumah: "No. 08, RT 03/RW 04", tanggal: "2026-05-25", waktu: "08:15:30", jenis: "Medis / Sakit Parah", laporan: "Mengalami sesak nafas parah, butuh ambulans segera.", foto: null, status: "Telah Ditanggapi" }
  ]
};

// --- APP STATE & MEMORY CONTEXT ---
let state = {};
let currentUser = null; // Stores { role: 'admin' }
let currentAdminTab = 'warga';
let kasChartInstance = null;

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
    try {
      const sessionData = JSON.parse(savedSession);
      if (sessionData && sessionData.role === 'admin') {
        currentUser = { role: 'admin' };
        loadDashboard();
      } else {
        localStorage.removeItem('rmod_session');
        showLoginScreen();
      }
    } catch (err) {
      localStorage.removeItem('rmod_session');
      showLoginScreen();
    }
  } else {
    showLoginScreen();
  }
  
  setupLoginHandler();
  setupCitizenHandler();
  setupTemplateHandler();
  setupEmergencyHandler();
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
  document.getElementById('view-admin').style.display = 'none';
  document.getElementById('view-login').style.display = 'flex';
}

function setupLoginHandler() {
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputUser = document.getElementById('login-username').value.trim();
    const inputPass = document.getElementById('login-password').value;
    
    // Admin login verification
    if (inputUser.toLowerCase() === 'admin' && inputPass === 'admin') {
      currentUser = { role: 'admin' };
      localStorage.setItem('rmod_session', JSON.stringify(currentUser));
      showToast("Berhasil Masuk sebagai Pengurus (RT/RW Admin)!", 'success');
      loadDashboard();
    } else {
      showToast("Username atau Password Admin Salah! Gunakan 'admin' untuk login demo.", 'danger');
    }
  });
  
  document.getElementById('logout-btn').addEventListener('click', () => {
    stopSiren();
    currentUser = null;
    localStorage.removeItem('rmod_session');
    showLoginScreen();
    loginForm.reset();
    showToast("Anda telah keluar dari dasbor secara aman.", 'success');
  });
}

function renderHeader() {
  const header = document.getElementById('app-header');
  header.style.display = 'block';
  
  const avatar = document.getElementById('header-avatar');
  const username = document.getElementById('header-username');
  
  if (currentUser && currentUser.role === 'admin') {
    avatar.innerText = 'A';
    avatar.style.backgroundColor = 'var(--danger)';
    username.innerHTML = `Ketua RT/RW <span style="font-size:0.85rem; font-weight:normal; background:var(--danger-light); color:var(--danger); padding:0.15rem 0.5rem; border-radius:10px; margin-left:5px;">Pengurus</span>`;
  }
  lucide.createIcons();
}

function loadDashboard() {
  document.getElementById('view-login').style.display = 'none';
  renderHeader();
  document.getElementById('view-admin').style.display = 'block';
  renderAdminPortal();
}

// --- PORTAL PENGURUS CONTROLLERS ---
function renderAdminPortal() {
  calculateAdminStats();
  renderAdminWargaTable();
  renderAdminLettersQueue();
  renderAdminVerifikasiQueue();
  renderCashLogsList('admin-cash-logs');
  renderAdminAppointmentsTable();
  renderAdminPanicLogsTable();
  checkEmergencyAlertStatus();
  
  // Re-draw ChartJS doughnut visualization
  setTimeout(initChartJS, 100);
  
  lucide.createIcons();
}

function switchAdminTab(tab) {
  currentAdminTab = tab;
  
  const tabs = ['warga', 'surat', 'keuangan', 'template', 'janjian', 'panic'];
  tabs.forEach(t => {
    const btn = document.getElementById(`tab-admin-${t}`);
    const cont = document.getElementById(`admin-tab-${t}-content`);
    
    if (btn) btn.classList.remove('active');
    if (cont) cont.style.display = 'none';
  });
  
  const activeBtn = document.getElementById(`tab-admin-${tab}`);
  const activeCont = document.getElementById(`admin-tab-${tab}-content`);
  
  if (activeBtn) activeBtn.classList.add('active');
  if (activeCont) activeCont.style.display = 'block';
  
  if (tab === 'keuangan') {
    setTimeout(initChartJS, 50);
  }
  
  lucide.createIcons();
}

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
}

function calculateAdminStats() {
  document.getElementById('admin-stat-warga').innerText = state.warga.length;
  
  let totalKas = 0;
  state.kas.forEach(k => {
    totalKas += (k.tipe === 'in' ? k.nominal : -k.nominal);
  });
  document.getElementById('admin-stat-kas').innerText = formatRupiah(totalKas);
  
  const pendingLetters = state.surat.filter(s => s.status === 'Diproses').length;
  document.getElementById('admin-stat-surat').innerText = pendingLetters;
  
  const pendingPayments = state.iuran.filter(i => i.status === 'verifikasi_pending').length;
  document.getElementById('admin-stat-verifikasi').innerText = pendingPayments;
}

function checkEmergencyAlertStatus() {
  const banner = document.getElementById('admin-emergency-banner');
  if (!banner) return;
  
  // Derive active emergencies from emergencyLogs (source of truth)
  // This supports multiple simultaneous panic alerts from different warga
  if (!state.emergencyLogs) state.emergencyLogs = [];
  const activeEmergencies = state.emergencyLogs.filter(l => l.status === "Menunggu Tindakan");
  
  if (activeEmergencies.length > 0) {
    // Build emergency cards for each active emergency
    let emergencyCardsHTML = '';
    activeEmergencies.forEach(em => {
      let photoHTML = '';
      if (em.foto) {
        photoHTML = `
          <div style="margin-top:0.75rem;">
            <strong>📸 Lampiran Foto:</strong><br>
            <img src="${em.foto}" style="max-width:100%; max-height:180px; border-radius:var(--radius-sm); border:2px solid white; margin-top:0.5rem; cursor:zoom-in;" onclick="window.open(this.src, '_blank')">
          </div>`;
      }
      
      emergencyCardsHTML += `
        <div style="background-color: rgba(0,0,0,0.2); padding: 1rem; border-radius: var(--radius-md); font-size: 0.95rem; color: white; border: 1px solid rgba(255,255,255,0.15); margin-top: 0.75rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.35rem;">
            <strong style="font-size:1.05rem;">🚨 ${em.namaWarga} — Rumah: ${em.rumah}</strong>
            <span style="font-size:0.85rem; opacity:0.8;">Pukul ${em.waktu} WIB | ${em.tanggal}</span>
          </div>
          <div><strong>Kategori:</strong> <span style="font-weight:700; color:#fef08a;">${em.jenis || 'Medis / Sakit Parah'}</span></div>
          <div style="margin-top:0.25rem;"><strong>Laporan:</strong> ${em.laporan || 'Membutuhkan bantuan segera!'}</div>
          ${photoHTML}
          <div style="margin-top:0.75rem;">
            <button class="btn btn-primary" onclick="handleSingleEmergency('${em.id}')" style="min-height:36px; padding:0.25rem 0.75rem; font-size:0.85rem; background-color:white; color:var(--danger); border:2px solid white; font-weight:700;">
              <i data-lucide="check-circle-2"></i> Tandai Selesai
            </button>
          </div>
        </div>`;
    });
    
    const titleText = activeEmergencies.length === 1
      ? 'DARURAT: PANGGILAN BANTUAN AKTIF!'
      : `DARURAT: ${activeEmergencies.length} PANGGILAN BANTUAN AKTIF!`;
    
    const descText = activeEmergencies.length === 1
      ? `Warga: ${activeEmergencies[0].namaWarga} | Rumah: ${activeEmergencies[0].rumah} | Pukul: ${activeEmergencies[0].waktu}`
      : `${activeEmergencies.length} warga membutuhkan bantuan mendesak secara bersamaan!`;
    
    banner.innerHTML = `
      <div class="emergency-alert-bar" style="flex-direction: column; align-items: stretch; gap: 1rem; border-radius: var(--radius-lg); background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);">
        <div class="emergency-alert-info">
          <div class="emergency-alert-icon">⚠️</div>
          <div class="emergency-alert-text">
            <h3 style="margin: 0; font-size: 1.3rem; font-weight: 800;">${titleText}</h3>
            <p style="margin: 5px 0 0 0; font-size: 0.95rem; line-height: 1.4; color: #fee2e2;">${descText}</p>
          </div>
        </div>
        
        ${emergencyCardsHTML}
        
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <button class="btn btn-secondary" onclick="stopSiren()" style="flex: 1; min-height: 48px; border: 2px solid white; background-color: transparent; color: white; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            <i data-lucide="volume-x"></i> Senyapkan Sirine
          </button>
          <button class="btn btn-primary" onclick="clearAllEmergencies()" style="flex: 1.5; background-color: white; color: var(--danger); font-weight: 800; min-height: 48px; border: 2px solid white; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            <i data-lucide="check-circle-2"></i> TANGGAPI SEMUA & SELESAI
          </button>
        </div>
      </div>`;
    
    banner.style.display = 'block';
    
    // Play audio siren automatically
    if (!isSirenPlaying) {
      playSiren();
    }
    
    lucide.createIcons();
  } else {
    banner.innerHTML = '';
    banner.style.display = 'none';
    stopSiren();
  }
}

// Handle a single emergency from the banner
function handleSingleEmergency(logId) {
  if (confirm("Apakah situasi darurat ini sudah selesai ditangani dengan aman?")) {
    const log = state.emergencyLogs.find(l => l.id === logId);
    if (log) {
      log.status = "Telah Ditanggapi";
    }
    
    // If no more active emergencies, disable the global flag
    const remaining = state.emergencyLogs.filter(l => l.status === "Menunggu Tindakan");
    if (remaining.length === 0) {
      state.emergency = { active: false };
    }
    
    saveState();
    checkEmergencyAlertStatus();
    renderAdminPanicLogsTable();
    showToast("Situasi darurat berhasil ditangani.", "success");
  }
}

// Clear ALL active emergencies at once
function clearAllEmergencies() {
  if (confirm("Nyatakan SEMUA situasi darurat selesai ditangani dan nonaktifkan alarm?")) {
    state.emergencyLogs.forEach(l => {
      if (l.status === "Menunggu Tindakan") {
        l.status = "Telah Ditanggapi";
      }
    });
    
    state.emergency = { active: false };
    saveState();
    checkEmergencyAlertStatus();
    renderAdminPanicLogsTable();
    showToast("Semua situasi darurat dinyatakan AMAN dan alarm dimatikan.", "success");
  }
}

// Buttons are now dynamically rendered inside the banner, no static event listeners needed
function setupEmergencyHandler() {
  // No-op: emergency buttons are now rendered dynamically in checkEmergencyAlertStatus()
  // and use onclick handlers directly (handleSingleEmergency, clearAllEmergencies, stopSiren)
}

function playSiren() {
  if (isSirenPlaying) return;
  
  const muteBtn = document.getElementById('admin-mute-siren-btn');
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
    sirenGain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    
    sirenOscillator.start();
    
    let high = true;
    sirenInterval = setInterval(() => {
      if (audioCtx && sirenOscillator) {
        sirenOscillator.frequency.linearRampToValueAtTime(high ? 1100 : 500, audioCtx.currentTime + 0.45);
        high = !high;
      }
    }, 500);
    
    sirenTimeout = setTimeout(() => {
      stopSiren();
      showToast("Sirene otomatis senyap (durasi 5s tercapai). Visual bahaya tetap aktif di layar.", 'info');
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
  
  const muteBtn = document.getElementById('admin-mute-siren-btn');
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

// --- CRUD CITIZEN DATABASE ---
function renderAdminWargaTable() {
  const container = document.getElementById('admin-warga-table-body');
  if (!container) return;
  container.innerHTML = '';
  
  state.warga.forEach(w => {
    const myIuran = state.iuran.filter(i => i.nik === w.nik);
    const unpaidCount = myIuran.filter(i => i.status === 'belum_bayar').length;
    let badgeHTML = '';
    
    if (unpaidCount > 0) {
      badgeHTML = `<span style="font-size:0.85rem; padding:0.25rem 0.5rem; background:rgba(220,38,38,0.1); color:var(--danger); font-weight:700; border-radius:6px;">${unpaidCount} Tagihan</span>`;
    } else {
      badgeHTML = `<span style="font-size:0.85rem; padding:0.25rem 0.5rem; background:rgba(5,150,105,0.1); color:var(--success); font-weight:700; border-radius:6px;">Lunas</span>`;
    }
    
    container.innerHTML += `
      <tr class="warga-table-row">
        <td style="font-weight:700;">${w.nama}</td>
        <td style="font-family:monospace; font-weight:600;">${w.nik}</td>
        <td>${w.rumah || '-'}</td>
        <td>${w.hp || '-'}</td>
        <td><span style="font-size:0.85rem; padding:0.25rem 0.5rem; background:var(--primary-light); color:var(--primary); font-weight:700; border-radius:6px;">Warga</span></td>
        <td>${badgeHTML}</td>
        <td>
          <button class="btn btn-secondary" onclick="deleteWarga('${w.nik}')" style="min-height:36px; padding:0.25rem 0.75rem; font-size:0.9rem; color:var(--danger); border-color:rgba(220,38,38,0.2);"><i data-lucide="user-minus"></i> Hapus</button>
        </td>
      </tr>
    `;
  });
  lucide.createIcons();
}

function filterWargaTable() {
  const query = document.getElementById('admin-search-warga').value.toLowerCase().trim();
  const rows = document.querySelectorAll('.warga-table-row');
  
  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    if (text.includes(query)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

function setupCitizenHandler() {
  const form = document.getElementById('admin-add-warga-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('warga-input-nama').value.trim();
      const nik = document.getElementById('warga-input-nik').value.trim();
      const rumah = document.getElementById('warga-input-rumah').value.trim();
      const hp = document.getElementById('warga-input-hp').value.trim();
      const pass = document.getElementById('warga-input-pass').value;
      
      if (state.warga.some(w => w.nik === nik)) {
        showToast("NIK warga ini sudah terdaftar sebelumnya!", 'danger');
        return;
      }
      
      const newWarga = {
        nik: nik,
        nama: name,
        rumah: rumah,
        hp: hp,
        password: pass,
        avatar: name.charAt(0).toUpperCase()
      };
      
      state.warga.push(newWarga);
      
      // Seed default testing bills for this new resident
      state.iuran.push(
        { id: `i-${Date.now()}-1`, nik: nik, bulan: "April 2026", nominal: 50000, status: "belum_bayar", metode: null, tanggal: null, bukti: null },
        { id: `i-${Date.now()}-2`, nik: nik, bulan: "Mei 2026", nominal: 50000, status: "belum_bayar", metode: null, tanggal: null, bukti: null }
      );
      
      saveState();
      form.reset();
      closeModal('modal-add-warga');
      
      renderAdminPortal();
      showToast(`Warga baru ${name} berhasil ditambahkan! Akun login NIK langsung aktif.`, 'success');
    });
  }
  
  // Setup manual cash log logger
  const cashForm = document.getElementById('admin-add-kas-form');
  if (cashForm) {
    cashForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const tipe = document.getElementById('kas-input-tipe').value;
      const desc = document.getElementById('kas-input-deskripsi').value.trim();
      const nom = parseInt(document.getElementById('kas-input-nominal').value);
      
      const newLog = {
        id: `k-${Date.now()}`,
        tipe: tipe,
        deskripsi: desc,
        nominal: nom,
        tanggal: new Date().toISOString().split('T')[0]
      };
      
      state.kas.push(newLog);
      saveState();
      
      cashForm.reset();
      closeModal('modal-add-kas');
      renderAdminPortal();
      showToast("Transaksi keuangan kas lingkungan berhasil dicatatkan!", 'success');
    });
  }
}

function deleteWarga(nik) {
  if (confirm("Apakah Anda yakin ingin menghapus data warga ini secara permanen dari database RT/RW?")) {
    state.warga = state.warga.filter(w => w.nik !== nik);
    // remove outstanding unpaid iurans to avoid leaks
    state.iuran = state.iuran.filter(i => !(i.nik === nik && i.status === 'belum_bayar'));
    
    saveState();
    renderAdminPortal();
    showToast("Warga berhasil dihapus secara permanen.", "warning");
  }
}

// --- LETTER REQUEST MANAGEMENT ---
function renderAdminLettersQueue() {
  const container = document.getElementById('admin-surat-table-body');
  if (!container) return;
  container.innerHTML = '';
  
  const pendings = state.surat.filter(s => s.status === 'Diproses');
  
  if (pendings.length === 0) {
    container.innerHTML = `<tr><td colspan="6" style="text-align:center; font-weight:600; padding:2.5rem; color:var(--text-secondary);">Tidak ada pengajuan surat pengantar yang mengantre. Semua terselesaikan!</td></tr>`;
    return;
  }
  
  pendings.forEach(item => {
    let actionHTML = '';
    
    if (item.jenis === 'Hanya Tanda Tangan' && item.dokumen) {
      actionHTML = `
        <div style="display:flex; flex-direction:column; gap:0.25rem;">
          <button class="btn btn-secondary" onclick="window.open('${item.dokumen}', '_blank')" style="min-height:36px; padding:0.25rem 0.5rem; font-size:0.85rem; margin-bottom:0.25rem;"><i data-lucide="eye"></i> Lihat Berkas</button>
          <div style="display:flex; gap:0.25rem;">
            <button class="btn btn-primary" onclick="approveLetter('${item.id}')" style="min-height:32px; padding:0.25rem 0.5rem; font-size:0.8rem; background-color:var(--success); border-color:var(--success);"><i data-lucide="check"></i> ACC</button>
            <button class="btn btn-primary" onclick="rejectLetter('${item.id}')" style="min-height:32px; padding:0.25rem 0.5rem; font-size:0.8rem; background-color:var(--danger); border-color:var(--danger);"><i data-lucide="x"></i> Tolak</button>
          </div>
        </div>
      `;
    } else {
      actionHTML = `
        <div style="display:flex; gap:0.25rem;">
          <button class="btn btn-primary" onclick="approveLetter('${item.id}')" style="min-height:36px; padding:0.25rem 0.5rem; font-size:0.85rem; background-color:var(--success); border-color:var(--success);"><i data-lucide="check"></i> ACC</button>
          <button class="btn btn-primary" onclick="rejectLetter('${item.id}')" style="min-height:36px; padding:0.25rem 0.5rem; font-size:0.85rem; background-color:var(--danger); border-color:var(--danger);"><i data-lucide="x"></i> Tolak</button>
        </div>
      `;
    }
    
    container.innerHTML += `
      <tr>
        <td style="font-family:monospace;">${item.tanggal}</td>
        <td style="font-weight:700;">${item.namaWarga} <br><span style="font-size:0.85rem; color:var(--text-muted); font-family:monospace; font-weight:normal;">NIK: ${item.nik}</span></td>
        <td style="font-weight:700; color:var(--primary);">${item.jenis}</td>
        <td>${item.keperluan}</td>
        <td><span style="font-size:0.9rem; background:#fff3cd; color:#856404; padding:0.2rem 0.5rem; border-radius:8px; font-weight:600;">Mengantre</span></td>
        <td>${actionHTML}</td>
      </tr>
    `;
  });
  lucide.createIcons();
}

function approveLetter(id) {
  const letter = state.surat.find(s => s.id === id);
  if (letter) {
    const code = Math.floor(100000 + Math.random() * 900000);
    letter.status = 'Disetujui';
    letter.tanggal = new Date().toISOString().split('T')[0];
    letter.catatan = `Surat pengantar digital disetujui. QR Code verifikasi terlampir dengan ID: VERIFY-${code}`;
    
    saveState();
    renderAdminPortal();
    showToast(`Surat pengantar ${letter.namaWarga} berhasil DISETUJUI.`, 'success');
  }
}

function rejectLetter(id) {
  const letter = state.surat.find(s => s.id === id);
  if (letter) {
    const reason = prompt("Masukkan alasan penolakan surat pengantar ini:", "Berkas persyaratan tidak lengkap.");
    if (reason !== null) {
      letter.status = 'Ditolak';
      letter.catatan = reason || 'Ditolak oleh Ketua RT/RW.';
      
      saveState();
      renderAdminPortal();
      showToast(`Surat pengantar ${letter.namaWarga} ditolak.`, 'warning');
    }
  }
}

// --- FINANCIAL RECEIPTS VERIFICATION QUEUE ---
function renderAdminVerifikasiQueue() {
  const container = document.getElementById('admin-verifikasi-table-body');
  if (!container) return;
  container.innerHTML = '';
  
  const pendings = state.iuran.filter(i => i.status === 'verifikasi_pending');
  
  if (pendings.length === 0) {
    container.innerHTML = `<tr><td colspan="6" style="text-align:center; font-weight:600; padding:2.5rem; color:var(--text-secondary);">Tidak ada bukti pembayaran iuran warga yang mengantre verifikasi. Semuanya bersih!</td></tr>`;
    return;
  }
  
  pendings.forEach(item => {
    const citizen = state.warga.find(w => w.nik === item.nik) || { nama: "Warga Tidak Dikenal" };
    
    container.innerHTML += `
      <tr>
        <td style="font-weight:700;">${citizen.nama} <br><span style="font-size:0.85rem; color:var(--text-muted); font-weight:normal; font-family:monospace;">NIK: ${item.nik}</span></td>
        <td style="font-weight:700;">${item.bulan}</td>
        <td style="font-weight:700; color:var(--primary);">${formatRupiah(item.nominal)}</td>
        <td><span style="font-size:0.9rem; background:var(--primary-light); color:var(--primary); padding:0.2rem 0.5rem; border-radius:8px; font-weight:600;">${item.metode}</span></td>
        <td>
          <button class="btn btn-secondary" onclick="openReceiptViewer('${item.id}', '${citizen.nama}')" style="min-height:36px; padding:0.25rem 0.75rem; font-size:0.9rem; border-color:rgba(37,99,235,0.2);"><i data-lucide="image"></i> Lihat Bukti</button>
        </td>
        <td>
          <button class="btn btn-primary" onclick="accPayment('${item.id}', true)" style="min-height:36px; padding:0.25rem 0.75rem; font-size:0.9rem; background-color:var(--success);"><i data-lucide="check-square"></i> ACC</button>
        </td>
      </tr>
    `;
  });
  lucide.createIcons();
}

function openReceiptViewer(billId, citizenName) {
  const bill = state.iuran.find(i => i.id === billId);
  if (bill) {
    document.getElementById('receipt-modal-name').innerText = citizenName;
    document.getElementById('receipt-modal-month').innerText = bill.bulan;
    document.getElementById('receipt-modal-amount').innerText = formatRupiah(bill.nominal);
    
    const img = document.getElementById('receipt-modal-image');
    if (bill.bukti === 'demo') {
      img.src = "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=600";
    } else {
      img.src = bill.bukti;
    }
    
    // Bind approval callback inside receipt viewer
    const accBtn = document.getElementById('receipt-modal-acc-btn');
    accBtn.style.display = 'block';
    accBtn.onclick = function() {
      accPayment(bill.id, false);
    };
    
    openModal('modal-view-receipt');
  }
}

function accPayment(billId, confirmDirect = true) {
  if (confirmDirect && !confirm("Apakah Anda yakin ingin menyetujui (ACC) bukti transfer iuran bulanan warga ini?")) {
    return;
  }
  
  const bill = state.iuran.find(i => i.id === billId);
  if (!bill) return;
  
  const citizen = state.warga.find(w => w.nik === bill.nik) || { nama: "Warga" };
  
  bill.status = 'lunas';
  bill.tanggal = new Date().toISOString().split('T')[0];
  
  // Register income inside general cash registry
  const newCashLog = {
    id: `k-${Date.now()}`,
    tipe: "in",
    deskripsi: `Iuran Bulanan ${bill.bulan} - ${citizen.nama}`,
    nominal: bill.nominal,
    tanggal: new Date().toISOString().split('T')[0]
  };
  state.kas.push(newCashLog);
  saveState();
  
  closeModal('modal-view-receipt');
  renderAdminPortal();
  showToast(`Iuran ${bill.bulan} warga ${citizen.nama} berhasil DI-ACC! Saldo kas ter-kredit.`, 'success');
}

function renderCashLogsList(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  
  const sorted = [...state.kas].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  const slice = sorted.slice(0, 8); // show last 8 in admin
  
  slice.forEach(log => {
    const isIncome = log.tipe === 'in';
    const amountFormatted = (isIncome ? "+" : "-") + formatRupiah(log.nominal);
    const badgeClass = isIncome ? 'income' : 'expense';
    const icon = isIncome ? 'arrow-down-left' : 'arrow-up-right';
    
    container.innerHTML += `
      <div class="cash-log-item">
        <div style="display: flex; gap: 0.75rem; align-items: center;">
          <div class="cash-log-icon ${badgeClass}"><i data-lucide="${icon}"></i></div>
          <div>
            <div class="cash-log-desc">${log.deskripsi}</div>
            <div class="cash-log-meta">${log.tanggal} | Aliran Dana</div>
          </div>
        </div>
        <div class="cash-log-amount ${badgeClass}">${amountFormatted}</div>
      </div>
    `;
  });
  lucide.createIcons();
}

// --- CHARTJS VISUALIZATION CONTROLLER ---
function initChartJS() {
  const ctx = document.getElementById('kasChart');
  if (!ctx) return;
  
  // calculate total in vs out
  let totalIn = 0;
  let totalOut = 0;
  
  state.kas.forEach(k => {
    if (k.tipe === 'in') totalIn += k.nominal;
    else totalOut += k.nominal;
  });
  
  // Destroy previous instance to avoid visual flashing overlay bugs
  if (kasChartInstance) {
    kasChartInstance.destroy();
  }
  
  kasChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Pemasukan (Iuran & Pindahan)', 'Pengeluaran (Operasional RT)'],
      datasets: [{
        data: [totalIn, totalOut],
        backgroundColor: ['#10b981', '#f43f5e'],
        borderWidth: 3,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 13, family: 'Outfit', weight: 'bold' },
            color: '#334155'
          }
        }
      }
    }
  });
}

// --- TEMPLATE EDIT HANDLER ---
function setupTemplateHandler() {
  const form = document.getElementById('admin-template-form');
  if (form) {
    // prefill
    document.getElementById('temp-kop').value = state.template.kop;
    document.getElementById('temp-subkop').value = state.template.subKop;
    document.getElementById('temp-kontak').value = state.template.kontak;
    document.getElementById('temp-penutup').value = state.template.penutup;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      state.template = {
        kop: document.getElementById('temp-kop').value.trim(),
        subKop: document.getElementById('temp-subkop').value.trim(),
        kontak: document.getElementById('temp-kontak').value.trim(),
        penutup: document.getElementById('temp-penutup').value.trim()
      };
      
      saveState();
      showToast("Template Surat Pengantar RT/RW berhasil disimpan!", "success");
    });
  }
}

// --- JANJI TEMU ADMIN CONTROLLER ---
function renderAdminAppointmentsTable() {
  const container = document.getElementById('admin-janjian-table-body');
  if (!container) return;
  container.innerHTML = '';
  
  if (!state.appointments) state.appointments = [];
  
  if (state.appointments.length === 0) {
    container.innerHTML = `<tr><td colspan="6" style="text-align:center; font-weight:600; padding:2.5rem; color:var(--text-secondary);">Tidak ada pengajuan janji temu dari warga.</td></tr>`;
    return;
  }
  
  state.appointments.forEach(item => {
    let statusBadge = '';
    let actionHTML = '';
    
    if (item.status === 'Disetujui') {
      statusBadge = `<span class="badge badge-success"><i data-lucide="check-circle" style="width:14px; height:14px;"></i> Disetujui</span>`;
      actionHTML = `<span style="font-size:0.85rem; color:var(--success); font-weight:600;">Telah Disetujui</span>`;
    } else if (item.status === 'Ditolak') {
      statusBadge = `<span class="badge badge-danger"><i data-lucide="x-circle" style="width:14px; height:14px;"></i> Ditolak</span>`;
      actionHTML = `<span style="font-size:0.85rem; color:var(--danger); font-weight:600;">Ditolak / Dibatalkan</span>`;
    } else {
      statusBadge = `<span class="badge badge-warning"><i data-lucide="clock" style="width:14px; height:14px;"></i> Diproses</span>`;
      actionHTML = `
        <div style="display:flex; gap:0.25rem;">
          <button class="btn btn-primary" onclick="approveAppointment('${item.id}')" style="min-height:36px; padding:0.25rem 0.5rem; font-size:0.85rem; background-color:var(--success); border-color:var(--success);"><i data-lucide="check"></i> ACC</button>
          <button class="btn btn-primary" onclick="rejectAppointment('${item.id}')" style="min-height:36px; padding:0.25rem 0.5rem; font-size:0.85rem; background-color:var(--danger); border-color:var(--danger);"><i data-lucide="x"></i> Tolak</button>
        </div>
      `;
    }
    
    container.innerHTML += `
      <tr>
        <td style="font-weight:700;">${item.namaWarga} <br><span style="font-size:0.85rem; color:var(--text-muted); font-family:monospace; font-weight:normal;">NIK: ${item.nik}</span></td>
        <td style="font-weight:700; color:var(--primary);">${item.target}</td>
        <td>${item.tanggal} <br><span style="font-size:0.85rem; color:var(--text-muted); font-family:monospace;">Pukul ${item.waktu} WIB</span></td>
        <td style="font-weight:600;">${item.keperluan}</td>
        <td>${statusBadge}</td>
        <td>${actionHTML}</td>
      </tr>
    `;
  });
  lucide.createIcons();
}

function approveAppointment(id) {
  const app = state.appointments.find(a => a.id === id);
  if (app) {
    const note = prompt("Tulis catatan persetujuan untuk warga (opsional):", "Silakan datang ke rumah Ketua RT tepat waktu.");
    if (note !== null) {
      app.status = 'Disetujui';
      app.catatan = note || 'Pertemuan disetujui. Silakan menemui pengurus.';
      saveState();
      renderAdminAppointmentsTable();
      showToast("Janji temu warga berhasil disetujui!", "success");
    }
  }
}

function rejectAppointment(id) {
  const app = state.appointments.find(a => a.id === id);
  if (app) {
    const note = prompt("Tulis alasan penolakan/pembatalan janji temu:", "Mohon maaf, Ketua RT sedang berhalangan di jam tersebut.");
    if (note !== null) {
      app.status = 'Ditolak';
      app.catatan = note || 'Pengurus berhalangan di jadwal yang dipilih.';
      saveState();
      renderAdminAppointmentsTable();
      showToast("Janji temu warga berhasil ditolak / ditangguhkan.", "warning");
    }
  }
}

// --- EMERGENCY PANIC LOGS CONTROLLER ---
function renderAdminPanicLogsTable() {
  const container = document.getElementById('admin-panic-logs-table-body');
  if (!container) return;
  container.innerHTML = '';
  
  if (!state.emergencyLogs) state.emergencyLogs = [];
  
  if (state.emergencyLogs.length === 0) {
    container.innerHTML = `<tr><td colspan="6" style="text-align:center; font-weight:600; padding:2.5rem; color:var(--text-secondary);">Belum ada riwayat pemicuan Panic Button.</td></tr>`;
    return;
  }
  
  const sorted = [...state.emergencyLogs].sort((a, b) => new Date(b.tanggal + "T" + b.waktu) - new Date(a.tanggal + "T" + a.waktu));
  
  sorted.forEach(log => {
    let statusBadge = '';
    let actionHTML = '';
    
    if (log.status === "Telah Ditanggapi") {
      statusBadge = `<span class="badge badge-success"><i data-lucide="check-circle" style="width:14px; height:14px;"></i> Aman / Selesai</span>`;
      actionHTML = `<span style="font-size:0.85rem; color:var(--success); font-weight:600;">Sudah Ditangani</span>`;
    } else {
      statusBadge = `<span class="badge badge-danger" style="animation: pulse-danger 1.5s infinite;"><i data-lucide="alert-triangle" style="width:14px; height:14px;"></i> Membutuhkan Tindakan</span>`;
      actionHTML = `<button class="btn btn-primary" onclick="markPanicHandled('${log.id}')" style="min-height:36px; padding:0.25rem 0.5rem; font-size:0.85rem; background-color:var(--success); border-color:var(--success); font-weight:700;"><i data-lucide="check-circle-2"></i> Tandai Selesai</button>`;
    }
    
    let photoHTML = 'Tidak Ada';
    if (log.foto) {
      photoHTML = `<button class="btn btn-secondary" onclick="window.open('${log.foto}', '_blank')" style="min-height:32px; padding:0.15rem 0.5rem; font-size:0.8rem;"><i data-lucide="image"></i> Lihat Foto</button>`;
    }
    
    container.innerHTML += `
      <tr>
        <td>${log.tanggal} <br><span style="font-size:0.85rem; color:var(--text-muted); font-family:monospace;">Pukul ${log.waktu} WIB</span></td>
        <td style="font-weight:700;">${log.namaWarga} <br><span style="font-size:0.85rem; color:var(--text-muted); font-weight:normal;">Rumah: ${log.rumah}</span></td>
        <td style="font-weight:700; color:var(--danger);">${log.jenis || 'Medis / Sakit Parah'}</td>
        <td>${log.laporan || '-'}</td>
        <td>${photoHTML}</td>
        <td>${statusBadge}</td>
      </tr>
    `;
  });
  lucide.createIcons();
}

function markPanicHandled(id) {
  if (confirm("Apakah situasi darurat log ini sudah benar-benar selesai ditangani dengan aman?")) {
    const log = state.emergencyLogs.find(l => l.id === id);
    if (log) {
      log.status = "Telah Ditanggapi";
      
      // If no more active emergencies remain, disable the global flag
      const remaining = state.emergencyLogs.filter(l => l.status === "Menunggu Tindakan");
      if (remaining.length === 0) {
        state.emergency = { active: false };
      }
      
      saveState();
      checkEmergencyAlertStatus();
      renderAdminPanicLogsTable();
      showToast("Situasi darurat berhasil diarsip dengan status Telah Ditanggapi.", "success");
    }
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
      
      if (parsed.emergency) state.emergency = parsed.emergency;
      if (parsed.iuran) state.iuran = parsed.iuran;
      if (parsed.warga) state.warga = parsed.warga;
      if (parsed.surat) state.surat = parsed.surat;
      if (parsed.kas) state.kas = parsed.kas;
      if (parsed.template) state.template = parsed.template;
      if (parsed.appointments) state.appointments = parsed.appointments;
      if (parsed.emergencyLogs) state.emergencyLogs = parsed.emergencyLogs;
      
      const newStateStr = JSON.stringify(state);
      
      if (oldStateStr !== newStateStr && currentUser) {
        calculateAdminStats();
        renderAdminWargaTable();
        renderAdminLettersQueue();
        renderAdminVerifikasiQueue();
        renderCashLogsList('admin-cash-logs');
        renderAdminAppointmentsTable();
        renderAdminPanicLogsTable();
        checkEmergencyAlertStatus();
        setTimeout(initChartJS, 50);
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
        
        if (parsed.emergency) state.emergency = parsed.emergency;
        if (parsed.iuran) state.iuran = parsed.iuran;
        if (parsed.warga) state.warga = parsed.warga;
        if (parsed.surat) state.surat = parsed.surat;
        if (parsed.kas) state.kas = parsed.kas;
        if (parsed.template) state.template = parsed.template;
        if (parsed.appointments) state.appointments = parsed.appointments;
        if (parsed.emergencyLogs) state.emergencyLogs = parsed.emergencyLogs;
        
        if (currentUser) {
          calculateAdminStats();
          renderAdminWargaTable();
          renderAdminLettersQueue();
          renderAdminVerifikasiQueue();
          renderCashLogsList('admin-cash-logs');
          renderAdminAppointmentsTable();
          renderAdminPanicLogsTable();
          checkEmergencyAlertStatus();
          setTimeout(initChartJS, 50);
        }
      } catch (err) {}
    }
  }
});

// --- BOOTSTRAP INIT ON DOM LOAD ---
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
