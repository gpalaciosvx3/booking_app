import express from "express";
import { users, updateUser, getUser, deleteUser } from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

/* ROUTES MIDDELWARE */
// Check Auth
/* router.get("/checkauth", verifyToken, async (req,res,next) => {
    res.send('Hello, you are logged in!')
});

router.get("/checkauth/:id", verifyUser,async (req,res,next) => {
    res.send(`Hello you are logged and have the admin permission.`)
})
 */

// ENDPOINTS
router.get("/user/:id", verifyUser,getUser);
router.get("/getallusers",verifyUser, users);
router.put("/update/:id",verifyAdmin, updateUser);
router.delete("/delete",verifyAdmin, deleteUser);

export default router