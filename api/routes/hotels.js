import express from "express";
import { createHotel, deleteHotel, getHotel, hotel, updateHotel } from "../controllers/hotel.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// ENDPOINT'S
/* create Hotel */
router.post("/create",verifyAdmin, createHotel);

/* update Hotel */
router.put("/update/:id",verifyAdmin, updateHotel);

/* delete Hotel */
router.delete("/delete/:id",verifyAdmin, deleteHotel);

/* get Hotel */
router.get("/get/:id",verifyUser, getHotel);
router.get("/getall",verifyUser, hotel);


export default router