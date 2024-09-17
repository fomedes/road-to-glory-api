import express from 'express';
import matchController from '../controllers/matchController.js';


const router = express.Router();

router.get('/getMatch/:matchId/', matchController.getMatchById);

router.patch('/updateMatch/:matchId/', matchController.updateMatch);

export default router;