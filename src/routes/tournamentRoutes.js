import express from 'express';
import tournamentController from '../controllers/tournamentController.js';


const router = express.Router();

router.post('/create', tournamentController.createTournament);

router.get('/getTournament/:tournamentId', tournamentController.getTournamentDetails);

export default router;
