import express from 'express';
import playerController from '../controllers/playerController.js';
import teamController from '../controllers/teamController.js';

const router = express.Router();

router.post('/create', teamController.createTeam);

router.get('/team/:teamId', teamController.getTeamById);

router.get('/user/:userId', teamController.getTeamByUserId);

router.get('/players/:teamId', playerController.getTeamPlayers);

router.get('/favouritePlayers/:teamId', playerController.getFavouritePlayers);

router.post('/addFavouritePlayer/:teamId/:playerId', playerController.addPlayerToFavourites);

router.post('/removeFavouritePlayer/:teamId/:playerId', playerController.removePlayerFromFavourites);



export default router;
