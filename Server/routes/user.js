import express from 'express';
import { adminRegistration, eventRegistration, registration, getRegistration } from '../control/user.js';

const userRouter = express.Router();

userRouter.post('/registration', registration);
userRouter.get('/registration/:id', getRegistration);
// Developers use:
userRouter.post('/adminRegistration', adminRegistration);
userRouter.post('/events', eventRegistration);

export default userRouter;