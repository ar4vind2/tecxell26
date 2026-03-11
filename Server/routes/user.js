import express from 'express';
import { registration, getRegistration, getEFootballCount, getMiniMilitiaCount, getPublicEventsStatus } from '../control/user.js';

const userRouter = express.Router();

userRouter.post('/registration', registration);
userRouter.get('/registration/:id', getRegistration);
userRouter.get('/eFootballCount', getEFootballCount);
userRouter.get('/miniMilitiaCount', getMiniMilitiaCount);
userRouter.get('/publicEventsStatus', getPublicEventsStatus);

export default userRouter;