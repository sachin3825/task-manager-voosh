import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { generateAndSendOtp, login, signup, updateAvatar, getProfile } from '../controller/user.js';
import { otpRequestLimiter } from '../middleware/ratelimter.js';
import { auth } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post('/login', login);
router.post('/send-otp', otpRequestLimiter, generateAndSendOtp);
router.post('/signup', signup);
router.patch('/avatar', upload.single('avatar'), auth, updateAvatar);
router.get('/me', auth, getProfile);

export default router;
