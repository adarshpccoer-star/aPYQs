import { Router } from 'express';
import {
  formSubmit,
  getProfile,
  updateProfile,
} from '../controller/profile.controller.js';

const router = Router();

router.post('/profile', formSubmit);
router.put('/profile', updateProfile);
router.get('/profile', getProfile);

export default router;
