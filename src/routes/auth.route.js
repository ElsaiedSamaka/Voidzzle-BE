// Packages
import express from 'express';

// Controllers
import { authController } from '../controllers/index';

// Utils
import { singleFile } from '../utils/multer';

// Middlewares
import protect from '../middlewares/protect';

const {
  signin,
  signup,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendVerificationEmail,
  changePassword
} = authController;

const router = express.Router();
// /api/auth/login
router.post('/login', signin);
// /api/auth/register
router.post('/register', singleFile('image'), signup);
// /api/auth/logout
router.post('/logout', logout);
// /api/auth/tokens
router.post('/tokens', refreshTokens);
// /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);
// /api/auth/reset-password
router.post('/reset-password', resetPassword);
// /api/auth/verify-email
router.post('/verify-email', verifyEmail);
// endpoints followed by this middleware will be protected
router.use(protect);
// /api/auth/send-verification-email
router.post('/send-verification-email', sendVerificationEmail);
// /api/auth/change-password
router.patch('/change-password', changePassword);

export default router;
