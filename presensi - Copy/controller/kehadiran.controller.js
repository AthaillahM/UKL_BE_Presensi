const attendanceModel = require('../models/index').kehadiran; // Import model attendance
const { Op } = require('sequelize'); // Import Sequelize operators
const moment = require('moment'); // Untuk memformat tanggal

// **Menambahkan Data Presensi Baru**
exports.addAttendance = async (req, res) => {
    try {
        const { iduser, date, time, status } = req.body;

        // Data baru untuk ditambahkan
        const newAttendance = {
            iduser,
            date,
            time,
            status
        };

        // Simpan data ke database
        const result = await attendanceModel.create(newAttendance);

        // Format respons
        const attendanceData = {
            attendance_id: result.id,
            iduser: result.iduser,
            date: moment(result.date).format('YYYY-MM-DD'),
            time: result.time,
            status: result.status
        };

        return res.json({
            status: 'success',
            message: 'Presensi berhasil dicatat',
            data: attendanceData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error recording attendance: ${error.message}`
        });
    }
};

// **Mengambil Riwayat Presensi Berdasarkan ID Pengguna**
exports.getAttendanceById = async (req, res) => {
    try {
        const { iduser } = req.params; // Ambil parameter iduser dari URL

        // Query presensi berdasarkan iduser
        const attendanceData = await attendanceModel.findAll({
            where: { iduser }
        });

        // Jika data tidak ditemukan
        if (attendanceData.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No attendance records found for User ID ${iduser}`
            });
        }

        // Format data untuk respons
        const formattedData = attendanceData.map(item => ({
            attendance_id: item.id,
            iduser: iduser,
            date: moment(item.date).format('YYYY-MM-DD'),
            time: item.time,
            status: item.status
        }));

        return res.json({
            status: 'success',
            data: formattedData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error retrieving attendance: ${error.message}`
        });
    }
};

exports.getAttendanceSummaryById = async (req, res) => {
    try {
        const { iduser } = req.params; // Ambil parameter iduser dari URL
        const { month } = req.query; // Ambil parameter month dari query string

        // Validasi input bulan
        if (!moment(month, 'MM-YYYY', true).isValid()) {
            return res.status(400).json({
                success: false,
                message: 'Format bulan tidak valid. Gunakan MM-YYYY.'
            });
        }

        // Parse bulan dan tahun
        const startOfMonth = moment(month, 'MM-YYYY').startOf('month').toDate();
        const endOfMonth = moment(month, 'MM-YYYY').endOf('month').toDate();

        // Query presensi berdasarkan iduser dan bulan
        const attendanceData = await attendanceModel.findAll({
            where: {
                iduser: iduser,
                date: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        });

        // Jika data tidak ditemukan
        if (attendanceData.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No attendance records found for User ID ${iduser} in the month ${month}`
            });
        }

        // Rekapitulasi kehadiran
        const summary = attendanceData.reduce((acc, item) => {
            if (!acc[item.status]) {
                acc[item.status] = 0;
            }
            acc[item.status]++;
            return acc;
        }, {});

        // Format data untuk respons
        const attendanceSummary = {
            hadir: summary.hadir || 0,
            izin: summary.izin || 0,
            sakit: summary.sakit || 0,
            alpa: summary.alpa || 0
        };

        return res.json({
            status: 'success',
            data: {
                user_id: parseInt(iduser),
                month: month,
                attendance_summary: attendanceSummary
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error retrieving attendance summary: ${error.message}`
        });
    }
};