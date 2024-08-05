import dotenv from "dotenv";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createError } from '../utils/error.js';
import jwt from "jsonwebtoken";

// REGISTER USER
export const register = async (req,res,next) => {   
    try {          
        const salt = bcrypt.genSaltSync(10);    
        const hash = bcrypt.hashSync(req.body.password, salt);    
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hash,
        });

        await newUser.save();

        res.status(200).send('User has been created! ');
    } catch (err) {
        // Manejar errores
        next(err);
    }
}

// LOGIN
export const Login = async (req, res, next) => {    
    try {
        const user = await User.findOne({
            username: req.body.username
        });
        
        if (!user) return next(createError(404, 'User not Found!'));

        const isPassCorrect = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!isPassCorrect) return next(createError(404, 'Wrong Pass or Username!'));

        const token = jwt.sign({
            id:user._id,
            isAdmin: user.isAdmin
        },process.env.JWT)

        res
            .cookie("acces_token",token,{
                httpOnly: true
            })
            .status(200)
            .json(user);
    } catch (err) {
        next(err);
    }
};

