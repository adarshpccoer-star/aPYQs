import { Router } from 'express';
import {
  GET,
  GET_STATS,
  POST,
  PUT,
} from '../controller/question.controller.js';
const router = Router();

router.post('/', POST);
router.get('/', GET);
router.put('/', PUT);
router.get('/stats', GET_STATS);
export default router;
