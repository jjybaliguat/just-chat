import express from 'express'
import { verifyJWT } from '../middleware/authMiddleware.js'
import { accessChat, addGroup, createGroupChat, getAllChats, removeGroup, updateGroup } from '../controllers/chatController.js'

const router = express.Router()

router.route("/").post(verifyJWT, accessChat)
router.route("/").get(verifyJWT, getAllChats)
router.route("/group").post(verifyJWT, createGroupChat)
router.route("/update").put(verifyJWT, updateGroup)
router.route("/remove-group").put(verifyJWT, removeGroup)
router.route("/add-group").put(verifyJWT, addGroup)

export default router