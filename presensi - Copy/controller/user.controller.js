const allModel = require('../models');
const userModel = allModel.user;
const Op = require('sequelize').Op;
const hash  = require('md5');

exports.getAlluser = async (request, response) => {
    let user = await userModel.findAll();
    return response.json({
        status: "success",
        data: user.map(u => ({
            id: u.id,
            name: u.name,
            username: u.username,
            role: u.role
        }))
    });
    
};

exports.finduser = async (request, response) => {
    let keyword = request.body.keyword;

    let user = await userModel.findAll({
        where: {
            [Op.or]: [
                { name: { [Op.like]: `%${keyword}%` } },
                { role: { [Op.like]: `%${keyword}%` } },
                { username: { [Op.like]: `%${keyword}%` } }
            ]
        }
    });
    return response.json({
        success: true,
        data: user.map(u => ({
            id: u.id,
            name: u.name,
            username: u.username,
            role: u.role
        })),
        message: "user have been loaded"
    });
};

exports.adduser = async (request, response) => {
    let newUser = {
        name: request.body.name,
        username: request.body.username,
        password: hash(request.body.password),
        role: request.body.role,
        createdAt: new Date(),
        updatedAt: new Date()
    }   
    userModel.create(newUser)
        .then(result => {
            return response.json({
                status: "success",
                message: "Pengguna berhasil ditambahkan",
                data: {
                    id: result.id,
                    name: result.name,
                    username: result.username,
                    role: result.role
                }
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                data: error,
                message: "User cannot be added",
                config:error.message
            })
        })
};

exports.updateuser = async (request, response) => {
    let datauser = {
        name: request.body.name,
        username: request.body.username,
        password: hash(request.body.password),
        role: request.body.role,
        updatedAt: new Date()
    }

    let iduser = request.params.id;
    userModel.update(datauser, {
        where: {
            id: iduser
        }
    })
        .then(result => {
            return response.json({
                status: "Success",
                message: "Pengguna berhasil diubah",
                data: datauser
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                data: error,
                message: "User cannot be updated"
            })
        })
}

exports.deleteuser = async (request, response) => {
    let id = request.params.id;
    userModel.destroy({ where: { id: id } })
        .then(result => {
            return response.json({
                status: "success",
                message: "pengguna berhasil dihapus",
                data: result
            });
        })
        .catch(error => {
            return response.json({
                success: false,
                data: error,
                message: "Data cannot be deleted"
            });
        });
};

exports.findByID = async (request, response) => {
    let id = request.params.id;

    let user = await userModel.findAll({
        where: {
            id: id
        }
    });
    return response.json({
        success: true,
        data: user.map(u => ({
            id: u.id,
            name: u.name,
            username: u.username,
            role: u.role
        })),
    });
};