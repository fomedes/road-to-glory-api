import express from 'express';
import userController from '../controllers/userController.js';


const router = express.Router();

router.post('/register', userController.register);

router.get('/find/:user_id', userController.findUser);

router.get('/all', userController.getAllUsers);

router.patch('/update/:user_id', userController.updateUser);

export default router;
