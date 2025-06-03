# Object Detection System

Sistem deteksi objek real-time by Yssufszz hehe pake Google Cloud Vision API pake React di frontend dan Node.js di backend.

## Instalasi dan Setup

### 1. Clone/Download Project
```bash
# Bikin folder project dulu
mkdir object-detection-system
cd object-detection-system
```

### 2. Setup Google Cloud Platform

**a. Enable APIs:**
- Masuk ke [GCP Console](https://console.cloud.google.com)
- Pilih project yang klen bikin
- Enable APIs berikut:
  - Cloud Vision API
  - Firestore API
  - Cloud Storage API (opsional)

**b. Buat Service Account:**
1. Masuk ke Service Accounts di GCP Console
2. Klik "Create Service Account"
3. Kasih nama yang gampang ae, misal: `vision-detection-service`
4. Kasih roles:
   - Cloud Vision API User
   - Cloud Datastore User
   - Storage Admin (kalau mau pakai Cloud Storage)
5. Klik "Create and Continue"
6. Klik "Create Key" pilih JSON
7. Download file JSON nya
8. Rename jadi `serviceAccountKey.json`
9. Simpan di folder `backend/`

**c. Setup Firestore:**
1. Masuk ke Firebase Console
2. Klik "Add project" atau import Google Cloud project yang udah ada
3. Pilih project yang klen bikin/import
4. Enable Firestore Database
5. Pilih mode "Production" atau "Test mode" terserah yang klen bikin
6. Pilih region yang paling deket sama lokasi yang klen bikin

### 3. Instalasi Dependencies

```bash
# Install semua dependencies sekaligus
npm run install-all

# Atau kalau mo atu-atu:
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
GOOGLE_CLOUD_PROJECT_ID=project-id-klen
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey-yang-klen-download-tadi.json
FIRESTORE_COLLECTION=detections
CLOUD_STORAGE_BUCKET=nama-bucket-klen
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
# Pakai gcloud CLI kalo udah install
gcloud storage buckets create gs://nama-bucket-klen --project=project-id-klen --location=asia-southeast2

# Atau bikin manual lewat Console GCP
```

## Cara Jalankan Aplikasi

### Development Mode (Biar Sat-Set)
```bash
# Jalanin frontend sama backend bareng inimah
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
# Build frontend dulu
npm run build

# Terus jalanin backend aja
npm start
```

## Akses Aplikasi

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/vision/health

## API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/` | Info API |
| GET | `/api/vision/health` | Cek status sistem |
| POST | `/api/vision/detect` | Upload dan deteksi objek |
| GET | `/api/vision/detections` | Ambil history deteksi |
| GET | `/api/vision/detections/:id` | Ambil deteksi berdasarkan ID |

## Cara Pake

1. **Buka aplikasi** di http://localhost:3000
2. **Allow camera access** pas browser minta permission
3. **Klik "Mulai Auto Jepret"** untuk mulai deteksi otomatis tiap 5 detik
4. **Atau klik "Foto"** kalau mau capture manual
5. **Liat hasil deteksi** di panel sebelah kanan
6. **Monitor statistik** di dashboard atas

## Troubleshooting

### Error: Camera ga bisa diakses
- Pastiin browser udah kasih permission camera
- Coba refresh halaman
- Pastiin ga ada aplikasi lain yang pakai camera

### Error: Vision API failed
- Cek Vision API udah di-enable belum di GCP
- Pastiin Service Account key valid
- Cek quota API di GCP Console

### Error: Firestore connection failed
- Pastiin Firestore udah di-setup di Firebase Console
- Cek Service Account permission
- Pastiin nama collection bener di .env

### Error: CORS issues
- Pastiin backend jalan di port 5000
- Cek frontend .env REACT_APP_API_URL

## Struktur File Lengkap

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
│   └── serviceAccountKey.json (harus dibuat dlu di gcp brok)
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

## Fitur yang udah ada

- Real-time webcam capture
- Deteksi objek otomatis setiap beberapa detik
- Manual capture
- Simpan hasil ke Firestore (ini masih eror sih hehe)
- Upload gambar ke Cloud Storage (opsional) (ini juga eror)
- Dashboard nya pake statistik 
- History deteksi
- Responsive design yang mobile-friendly (tapi di mobile masih belom oke tampilannya hehe)
- Error handling yang proper

## Kalo mau di kembangin

Bisa lanjut ke:
1. Tambahin authentication biar secure
2. Improve UI/UX design biar makin gg cok gua malas
3. Add real-time notifications
4. Deploy ke production
5. Tambahin fitur Vision API lainnya kayak face detection, text detection, dll

---

**Kalau ada error atau bingung, cek aja log di console browser sama terminal aje ya haha -Yssufsz**