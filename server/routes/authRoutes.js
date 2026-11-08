import express from 'express';
import { registerStudent, loginStudent, getStudentProfile } from '../controllers/authController.js';
import { protectStudent } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.get('/me', protectStudent, getStudentProfile);

export default router;
