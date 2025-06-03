# Object Detection System

Sistem deteksi objek real-time menggunakan Google Cloud Vision API dengan React frontend dan Node.js backend.

## 🚀 Instalasi dan Setup

### 1. Clone/Download Project
```bash
# Buat folder project sesuai struktur yang sudah dijelaskan
mkdir object-detection-system
cd object-detection-system
```

### 2. Setup Google Cloud Platform

**a. Enable APIs:**
- Masuk ke [GCP Console](https://console.cloud.google.com)
- Pilih project `yssfszz`
- Enable APIs berikut:
  - [Cloud Vision API](https://console.cloud.google.com/apis/library/vision.googleapis.com?project=yssfszz)
  - [Firestore API](https://console.cloud.google.com/apis/library/firestore.googleapis.com?project=yssfszz)
  - [Cloud Storage API](https://console.cloud.google.com/apis/library/storage.googleapis.com?project=yssfszz) (opsional)

**b. Buat Service Account:**
1. Masuk ke [Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts?project=yssfszz)
2. Klik "Create Service Account"
3. Nama: `vision-detection-service`
4. Berikan roles:
   - Cloud Vision API User
   - Cloud Datastore User
   - Storage Admin (jika menggunakan Cloud Storage)
5. Klik "Create and Continue"
6. Klik "Create Key" → JSON
7. Download file JSON
8. Rename menjadi `serviceAccountKey.json`
9. Simpan di folder `backend/`

**c. Setup Firestore:**
1. Masuk ke [Firebase Console](https://console.firebase.google.com)
2. Klik "Add project" → "Import Google Cloud project"
3. Pilih project `yssfszz`
4. Enable Firestore Database
5. Pilih mode "Production" atau "Test mode"
6. Pilih region: `asia-southeast2 (Jakarta)`

### 3. Instalasi Dependencies

```bash
# Install dependencies root
npm run install-all

# Atau manual:
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 4. Setup Environment Variables

**Backend (.env):**
```bash
# File: backend/.env
PORT=5000
GOOGLE_CLOUD_PROJECT_ID=yssfszz
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
FIRESTORE_COLLECTION=detections
CLOUD_STORAGE_BUCKET=yssfszz-images
NODE_ENV=development
```

**Frontend (.env):**
```bash
# File: frontend/.env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_CAPTURE_INTERVAL=5000
```

### 5. Buat Cloud Storage Bucket (Opsional)

```bash
# Menggunakan gcloud CLI (jika terinstall)
gcloud storage buckets create gs://yssfszz-images --project=yssfszz --location=asia-southeast2

# Atau buat manual di Console:
# https://console.cloud.google.com/storage/browser?project=yssfszz
```

## 🏃‍♂️ Menjalankan Aplikasi

### Development Mode (Recommended)
```bash
# Jalankan frontend dan backend bersamaan
npm run dev
```

### Manual Mode
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run client
```

### Production Mode
```bash
# Build frontend
npm run build

# Start backend only
npm start
```

## 📱 Akses Aplikasi

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/vision/health

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info |
| GET | `/api/vision/health` | Health check |
| POST | `/api/vision/detect` | Upload dan deteksi objek |
| GET | `/api/vision/detections` | Ambil history deteksi |
| GET | `/api/vision/detections/:id` | Ambil deteksi by ID |

## 🎯 Cara Penggunaan

1. **Buka aplikasi** di http://localhost:3000
2. **Allow camera access** saat diminta browser
3. **Klik "Start Auto Capture"** untuk mulai deteksi otomatis setiap 5 detik
4. **Atau klik "Capture Now"** untuk capture manual
5. **Lihat hasil deteksi** di panel sebelah kanan
6. **Monitor statistics** di dashboard atas

## 🐛 Troubleshooting

### Error: Camera tidak bisa diakses
- Pastikan browser memberikan permission camera
- Coba refresh halaman
- Pastikan tidak ada aplikasi lain yang menggunakan camera

### Error: Vision API failed
- Cek apakah Vision API sudah di-enable di GCP
- Pastikan Service Account key valid
- Cek quota API di GCP Console

### Error: Firestore connection failed
- Pastikan Firestore sudah di-setup di Firebase Console
- Cek Service Account permission
- Pastikan collection name benar di .env

### Error: CORS issues
- Pastikan backend running di port 5000
- Cek frontend .env REACT_APP_API_URL

## 📁 Struktur File Lengkap

```
object-detection-system/
├── backend/
│   ├── src/
│   │   ├── config/firebase.js
│   │   ├── controllers/visionController.js
│   │   ├── middleware/upload.js
│   │   ├── routes/vision.js
│   │   └── app.js
│   ├── uploads/ (auto-generated)
│   ├── package.json
│   ├── .env
│   └── serviceAccountKey.json ⚠️ (harus dibuat)
├── frontend/
│   ├── public/index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Camera.js
│   │   │   ├── DetectionResults.js
│   │   │   └── Dashboard.js
│   │   ├── services/api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── .env
├── package.json
└── README.md
```

## 🎛️ Konfigurasi

### Mengubah Interval Capture
Edit `frontend/.env`:
```bash
REACT_APP_CAPTURE_INTERVAL=3000  # 3 detik
```

### Mengubah Collection Firestore
Edit `backend/.env`:
```bash
FIRESTORE_COLLECTION=my_detections
```

## 📊 Fitur Sistem

- ✅ Real-time webcam capture
- ✅ Otomatis deteksi objek setiap X detik
- ✅ Manual capture
- ✅ Simpan hasil ke Firestore
- ✅ Upload gambar ke Cloud Storage (opsional)
- ✅ Dashboard dengan statistik
- ✅ History deteksi
- ✅ Responsive design
- ✅ Error handling

## 🚀 Next Steps

Setelah sistem berjalan, Anda bisa:
1. Tambah authentication
2. Improve UI/UX design
3. Add real-time notifications
4. Deploy ke production
5. Add more Vision API features (face detection, text detection, dll)

---

**Jika ada error atau pertanyaan, cek log di console browser dan terminal!**