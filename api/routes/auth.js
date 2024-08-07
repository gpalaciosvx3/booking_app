import express from "express";
import { Login, register } from "../controllers/auth.js";
import '../docs/authSwagger.js'; // Importa la documentación de Swagger

const router = express.Router();

// ENDPOINTS
router.post("/register", register);
router.post("/login", Login);

export default router