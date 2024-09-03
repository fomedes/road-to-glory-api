import express from 'express';
import playerController from '../controllers/playerController.js';
import teamController from '../controllers/teamController.js';

const router = express.Router();

router.post('/create', teamController.createTeam);

router.get('/team/:teamId', teamController.getTeamById);

router.get('/user/:userId', teamController.getTeamByUserId);

router.get('/players/:teamId', playerController.getTeamPlayers);

router.get('/favoritePlayers/:teamId', playerController.getFavoritePlayers);

router.post('/addFavoritePlayer/:teamId/:playerId', playerController.addPlayerToFavorites);

router.post('/removeFavoritePlayer/:teamId/:playerId', playerController.removePlayerFromFavorites);



export default router;
