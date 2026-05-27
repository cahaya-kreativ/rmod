// ==========================================
// R-MOD Firebase Configuration & Core Sync Helper
// ==========================================
// 
// Cara Penggunaan:
// 1. Buat proyek di https://console.firebase.google.com/
// 2. Buat database Cloud Firestore (pilih "Start in Test Mode" untuk uji coba)
// 3. Daftarkan aplikasi Web, lalu salin konfigurasinya ke dalam variabel `firebaseConfig` di bawah ini.
// 

const firebaseConfig = {
  apiKey: "AIzaSyD-1G7LYXacQkjUT9hZCxsc_-m_JMsWcEI",
  authDomain: "r-mod-d913d.firebaseapp.com",
  projectId: "r-mod-d913d",
  storageBucket: "r-mod-d913d.firebasestorage.app",
  messagingSenderId: "377774148111",
  appId: "1:377774148111:web:7966aa084e13cacc20317a",
  measurementId: "G-FJRQBXTK0X"
};

// Cek apakah konfigurasi sudah diganti dari placeholder default
const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY";
};

let db = null;

// Initialize Firebase jika sudah dikonfigurasi oleh user
if (isFirebaseConfigured()) {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("🔥 Firebase initialized successfully!");
  } catch (error) {
    console.error("❌ Error initializing Firebase:", error);
  }
} else {
  console.log("ℹ️ Firebase belum dikonfigurasi. Menjalankan aplikasi menggunakan LocalStorage offline.");
}

// Helper untuk sinkronisasi state ke Firebase Firestore
async function uploadStateToFirebase(stateObject) {
  if (!isFirebaseConfigured() || !db) return;
  try {
    // Kita simpan seluruh state di document 'rmod/state'
    await db.collection('rmod').doc('state').set({
      ...stateObject,
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log("☁️ State synced to Firebase Cloud successfully.");
  } catch (error) {
    console.error("❌ Error uploading state to Firebase:", error);
  }
}

// Helper untuk mendengarkan perubahan state secara real-time dari Firebase
function listenToFirebaseState(onUpdateCallback) {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    return db.collection('rmod').doc('state').onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();
        console.log("☁️ State received from Firebase Cloud.");
        onUpdateCallback(data);
      } else {
        console.log("ℹ️ Belum ada state di Firebase. Mengunggah state default...");
        onUpdateCallback(null);
      }
    }, (error) => {
      console.error("❌ Error listening to Firebase:", error);
    });
  } catch (error) {
    console.error("❌ Error setting up Firebase listener:", error);
    return null;
  }
}
