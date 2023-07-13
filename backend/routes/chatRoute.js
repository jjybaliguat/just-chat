import express from 'express'
import { verifyJWT } from '../middleware/authMiddleware.js'
import { accessChat, addGroup, createGroupChat, getAllChats, removeFromGroup, removeGroup, updateGroup } from '../controllers/chatController.js'

const router = express.Router()

router.route("/").post(verifyJWT, accessChat)
router.route("/").get(verifyJWT, getAllChats)
router.route("/group").post(verifyJWT, createGroupChat)
router.route("/update").put(verifyJWT, updateGroup)
router.route("/remove-from-group").put(verifyJWT, removeFromGroup)
router.route("/add-group").put(verifyJWT, addGroup)
router.route("/remove-group").delete(verifyJWT, removeGroup)

export default router