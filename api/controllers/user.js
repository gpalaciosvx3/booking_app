import dotenv from "dotenv";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import createError from 'http-errors';

// GET ALL USERS
export const users = async (req,res,next) => {
    const users = await User.find();
    try {
        // Responder con el hotel guardado
        res.status(200).json(users);
    } catch (err) {
        // Manejar errores
        next(err);
    }
}

// ACTUALIZAR USUARIOS
export const updateUser = async (req, res, next) => {
    try {
        // Si la solicitud contiene una nueva contraseña, debemos cifrarla
        if (req.body.password) {
            const salt = bcrypt.genSaltSync(10);
            req.body.password = bcrypt.hashSync(req.body.password, salt);
        }

        // Actualizar el usuario en la base de datos
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (err) {
        next(err);
    }
};

// DELETE
export const deleteUser = async (req,res,next) => {
    try {
        await User.findByIdAndDelete(
            req.params.id
        ); 
        // Responder con el User guardado
        res.status(200).json('User has been deleted.');
    } catch (err) {
        // Manejar errores
        next(err);
    }
 }

// GET
export const getUser = async (req,res,next) => {
    const getUser = await User.findById(
        req.params.id
    ); 
    try {
        // Responder con el User guardado
        res.status(200).json(getUser);
    } catch (err) {
        // Manejar errores
        next(err);
    }
 }