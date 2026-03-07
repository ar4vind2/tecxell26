import express from 'express';
import { adminLogin, getRegistrations } from '../control/admin.js';
import auth from '../middleware/auth.js';

const admitRouter = express.Router();

admitRouter.post('/adminLogin', adminLogin);

admitRouter.get('/registrationData', auth, getRegistrations);

admitRouter.get('/eventsStatus', (req, res) => {
  res.send('Admin route');
});


export default admitRouter;