const express = require('express');
const app = express();
app.use(express.json());

const attendanceController = require('../controller/kehadiran.controller.js'); // Import kehadiran.controller.js
const { authorize } = require('../controller/auth.contoller.js'); // Pastikan authorize di-import dengan benar

// **Routes untuk kehadiran**
app.post('/', [authorize], attendanceController.addAttendance); // Menambahkan data presensi baru
app.get('/history/:iduser', [authorize], attendanceController.getAttendanceById); // Mengambil data presensi berdasarkan ID
app.get('/summary/:iduser', attendanceController.getAttendanceSummaryById);

module.exports = app;

