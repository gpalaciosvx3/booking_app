import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import swaggerUi from 'swagger-ui-express'; // Importar swagger-ui-express
import swaggerSpec from './utils/swaggerDocs.js'; // Importar la especificación de Swagger
// Routes defination
import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js"
import hotelsRoute from "./routes/hotels.js"
import roomsRoute from "./routes/rooms.js"

const app = express();
const port = process.env.PORT || 8080;
dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
      } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected", ()=> {
    console.log('mongoDB Disconnected.');
});

/* MIDEELWARE */
// Middelware to parse cookie's and json
app.use(cookieParser());
app.use(express.json());

/* SWAGGER - DOCUMENTATION */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// My own routes middelware
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

// Middelware to get Errors.
app.use((err,req,res,next) =>{
    const errorStatus = err.status || 500;
    const errorMessage = err.message || 'Somethin went wrong!';
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});
// end of middelware

app.listen(port, () =>{
    connect();
    console.log(`Connected to backend at port ${port}`);
});