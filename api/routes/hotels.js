import express from "express";
import { createHotel, deleteHotel, getHotel, hotel, updateHotel } from "../controllers/hotel.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// ENDPOINT'S
router.post("/create",verifyAdmin, createHotel);
router.put("/update/:id",verifyAdmin, updateHotel);
router.delete("/delete",verifyAdmin, deleteHotel);
router.get("/get/:id",verifyUser, getHotel);
router.get("/getall",verifyUser, hotel);


export default router