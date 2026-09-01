import { Router } from 'express';
import { GET, POST, PUT } from '../controller/question.controller.js';
const router = Router();

router.post('/', POST);
router.get('/', GET);
router.put('/', PUT);

export default router;
