import express from 'express';
import teamController from '../controllers/teamController.js';

const router = express.Router();

router.post('/create', teamController.createTeam);

router.get('/team/:team_id', teamController.getTeamById);

router.get('/user/:user_id', teamController.getTeamByUserId);

export default router;
