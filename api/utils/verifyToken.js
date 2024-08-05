import jwt from "jsonwebtoken";
import { createError } from "./error.js"

export const verifyToken = (req,res,next) => {
    const token = req.cookies.acces_token;
    
    if(!token) return next(createError(401, "You are not authenticated !"));

    jwt.verify(token,process.env.JWT, async (err,user) => {
        if(err) return next(createError(403, "Token is not valid!"));
        req.user = user;
        next(); // Next to the other middelware.
    });
}

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, (err) => {
        if (err) return next(err); 
        
        if (req.user.id !== req.params.id) return next(createError(403, "You are not authorized!")); 
        next();
    });
};

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, (err) => {
        if (err) return next(err); 

        if (!req.user.isAdmin) return next(createError(403, "You are not admin!"));
        next();
    });
};