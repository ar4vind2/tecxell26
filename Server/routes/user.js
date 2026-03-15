import express from 'express';
import { registration, getRegistration, getEFootballCount, getMiniMilitiaCount, getTreasureHuntCount, getPublicEventsStatus, getWinners } from '../control/user.js';

const userRouter = express.Router();

userRouter.post('/registration', registration);
userRouter.get('/registration/:id', getRegistration);
userRouter.get('/eFootballCount', getEFootballCount);
userRouter.get('/miniMilitiaCount', getMiniMilitiaCount);
userRouter.get('/treasureHuntCount', getTreasureHuntCount);
userRouter.get('/publicEventsStatus', getPublicEventsStatus);
userRouter.get('/winners', getWinners);

export default userRouter;