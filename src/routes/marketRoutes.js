import express from 'express';
import MarketController from '../controllers/marketController.js';


const router = express.Router();

router.post('/bid', MarketController.bidPlayer);

router.post('/releaseplayer', MarketController.releasePlayer)

export default router;
