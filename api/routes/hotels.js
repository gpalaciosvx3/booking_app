import express from "express";
import { 
    countbycitie, countbytype, createHotel, deleteAllHotels,
    deleteHotel, getHotel, hotel,
    insertFakeHotels, updateHotel } from "../controllers/hotel.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// ENDPOINT'S
/* create Hotel */
router.post("/create",verifyAdmin, createHotel);
router.post("/fakehotels/:num",verifyAdmin, insertFakeHotels);
router.post("/fakehotels",verifyAdmin, insertFakeHotels);

/* update Hotel */
router.put("/update/:id",verifyAdmin, updateHotel);

/* get Hotel */
router.get("/get/:id",verifyUser, getHotel);
router.get("/getall",verifyUser, hotel);

/* delete Hotel */
router.delete("/delete/:id",verifyAdmin, deleteHotel);
router.delete("/deleteall",verifyAdmin, deleteAllHotels );

/* count's Hotel */
router.get("/countbycitie",verifyUser, countbycitie);
router.get("/countbytype",verifyUser, countbytype);

export default router