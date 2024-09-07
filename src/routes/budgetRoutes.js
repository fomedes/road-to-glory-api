import express from 'express';
import budgetController from '../controllers/budgetController.js';


const router = express.Router();

router.post('/teamBudgetAdjustment', budgetController.adjustTeamBudget);


export default router;
