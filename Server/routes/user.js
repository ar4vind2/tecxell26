import express from 'express';
import { registration, getRegistration, getEventCount, getPublicEventsStatus, getWinners } from '../control/user.js';

const userRouter = express.Router();

userRouter.post('/registration', registration);
userRouter.get('/registration/:id', getRegistration);
userRouter.get('/eventCount', getEventCount);
userRouter.get('/publicEventsStatus', getPublicEventsStatus);
userRouter.get('/winners', getWinners);

export default userRouter;