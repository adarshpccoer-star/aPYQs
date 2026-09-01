import { Router } from 'express';

import { github, callback, exchanqe } from '../controller/auth.controller.js';

const router = Router();

router.get('/github', github);
router.get('/callback', callback);
router.post('/exchange', exchanqe);

export default router;
