import express from 'express';
import newsController from '../controllers/newsController.js';


const router = express.Router();



router.post('/create', newsController.createNews);

router.get('/community/:community_id', newsController.getNewsByCommunityId);



export default router;
