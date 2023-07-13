import express from 'express'
import { loginStatus, loginUser, logout, refresh, registerUser, searchUser, updateUser } from '../controllers/userController.js'
import { verifyJWT } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route("/").post(registerUser).get(verifyJWT, searchUser)
router.post("/login", loginUser)
router.get("/loggedin", loginStatus)
router.get("/logout", logout)
router.get("/refresh", refresh)
router.patch("/update-user",verifyJWT, updateUser)

export default router