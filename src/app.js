import { ExpressAuth } from '@auth/express';
import Google from '@auth/express/providers/google';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
});

import { corsMiddleware } from './middlewares/cors.js';
import errorHandler from './middlewares/errorHandler.js';

import budgetRouter from './routes/budgetRoutes.js';
import clubRouter from './routes/clubRoutes.js';
import communityRouter from './routes/communityRoutes.js';
import loginRouter from './routes/loginRoutes.js';
import marketRouter from './routes/marketRoutes.js';
import newsRouter from './routes/newsRoutes.js';
import seasonRouter from './routes/seasonRoutes.js';
import teamRouter from './routes/teamRoutes.js';
import tournamentRouter from './routes/tournamentRoutes.js';
import userRouter from './routes/userRoutes.js';

import './config/mongo.js';

const app = express();

app.use("/auth/*", ExpressAuth({ providers: [ Google ] }));
app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware());
app.disable('x-powered-by');

app.use('/api/login', loginRouter);
app.use('/api/clubs', clubRouter);
app.use('/api/communities', communityRouter);
app.use('/api/news', newsRouter);
app.use('/api/seasons', seasonRouter);
app.use('/api/teams', teamRouter);
app.use('/api/tournaments', tournamentRouter);
app.use('/api/users', userRouter);
app.use('/api/market', marketRouter);
app.use('/api/budget', budgetRouter);
// app.use('/api/tournament', tournamentRouter);

app.use(errorHandler);

const IP = process.env.HOST;
const PORT = process.env.PORT || 3000;

app.listen(PORT, IP, () => {
  console.log(`Server is running on http://${IP}:${PORT}`);
});
