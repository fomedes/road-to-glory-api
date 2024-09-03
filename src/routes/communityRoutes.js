import express from 'express';
import communityController from '../controllers/communityController.js';


const router = express.Router();

router.use(express.json());

router.post('/create', communityController.createCommunity);

router.get('/all', communityController.getAllCommunities)

router.get('/communityInfo/:communityId', communityController.getCommunityInfo);

router.get('/userCommunities/:userId', communityController.getUserCommunities);

router.get('/registeredPlayers/:communityId', communityController.getRegisteredPlayers);

router.get('/marketConfig/:communityId', communityController.getMarketConfig);

router.get('/communityTeams/:communityId', communityController.getCommunityTeams);

router.post('/getAccess/:communityId', communityController.getCommunityAccess);
export default router;
