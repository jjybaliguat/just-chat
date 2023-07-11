import express from 'express'
import { composeMessage, getAllMessages } from '../controllers/messageController.js'
import { verifyJWT } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post("/", verifyJWT, composeMessage )
router.get("/:chatId", verifyJWT, getAllMessages)

export default router