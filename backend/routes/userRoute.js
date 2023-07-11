import express from 'express'
import { loginUser, logout, refresh, registerUser, searchUser } from '../controllers/userController.js'
import { verifyJWT } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route("/").post(registerUser).get(verifyJWT, searchUser)
router.post("/login", loginUser)
router.get("/logout", logout)
router.get("/refresh", refresh)

export default router