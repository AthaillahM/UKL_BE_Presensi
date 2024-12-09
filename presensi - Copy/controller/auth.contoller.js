const express = require('express');
const hash = require('md5');
const jwt = require('jsonwebtoken');
const userModel = require('../models/index').user;

// Fungsi untuk autentikasi
const autenticate = async (request, response, next) => {
    let dataLogin = {
        username: request.body.username,
        password: hash(request.body.password),
    };

    // Cari user berdasarkan data login
    let datauser = await userModel.findOne({ where: dataLogin });

    if (datauser) {
        let payload = { id: datauser.id, username: datauser.username }; // Buat payload
        let secret = 'Mokleters';
        let token = jwt.sign(payload, secret);

        return response.json({
            status: 'success',
            message: 'Login berhasil',
            token: token,
        });
    } else {
        return response.status(401).json({
            status: 'gagal',
            message: 'Username atau password salah', // Kombinasi error untuk user/pwd tidak valid
        });
    }
};

// Fungsi untuk otorisasi
const authorize = (request, response, next) => {
    let header = request.headers.authorization;
    let tokenKey = header && header.split(' ')[1];

    if (tokenKey == null) {
        return response.status(401).json({
            success: false,
            message: 'Unauthorized User!',
        });
    }

    let secret = 'Mokleters';

    jwt.verify(tokenKey, secret, (error, user) => {
        if (error) {
            return response.status(401).json({
                success: false,
                message: 'Invalid token!',
            });
        }

        // Jika token valid, simpan data user ke request
        request.user = user;
        next();
    });
};

module.exports = { autenticate, authorize };
