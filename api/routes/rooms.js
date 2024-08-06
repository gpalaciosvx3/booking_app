import express from "express";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";
import { createRoom, deleteAllRooms, deleteRoom, getRoom, insertFakeRooms, room, updateRoom } from "../controllers/room.js";

const router = express.Router();

// ENDPOINT'S

/* create Rooms */
router.post("/create/:hotelid",verifyAdmin, createRoom);
router.post("/fakerooms/:num",verifyAdmin, insertFakeRooms);
router.post("/fakerooms",verifyAdmin, insertFakeRooms);

/* udpdate Rooms*/
router.put("/update/:id",verifyAdmin, updateRoom);

/* get Rooms */
router.get("/get/:id",verifyUser, getRoom);
router.get("/get",verifyUser, room);

/* delete Rooms*/
router.delete("/delete/:id",verifyAdmin, deleteRoom);
router.delete("/deleteall",verifyAdmin, deleteAllRooms);

export default router