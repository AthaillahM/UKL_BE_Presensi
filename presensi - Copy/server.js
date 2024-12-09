const express = require('express'); // Import express
const app = express(); // Inisialisasi aplikasi express
const cors = require('cors'); // Import CORS middleware

// Port server
const port = process.env.PORT || 8000; // Gunakan environment variable PORT jika tersedia

// Middleware
app.use(cors()); // Mengaktifkan CORS untuk semua permintaan
app.use(express.json()); // Middleware untuk parsing JSON di body request

// Import route
const userRoute = require('./route/user.route.js');
const authRoute = require('./route/auth.route.js');
const kehadiranRoute = require('./route/kehadiran.route.js');

// Gunakan route sesuai endpoint
app.use('/api/user', userRoute); // Route untuk user
app.use('/api/auth/login', authRoute); // Route untuk autentikasi
app.use('/api/kehadiran', kehadiranRoute); // Route untuk kehadiran

// Jalankan server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`); // Log port server aktif
});
