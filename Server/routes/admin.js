import express from 'express';
import { adminLogin } from '../control/admin.js';
import auth from '../middleware/auth.js';

const admitRouter = express.Router();

admitRouter.post('/adminLogin', adminLogin);

admitRouter.get('/registrationData', (req, res) => {
  res.send('Admin route');
});

admitRouter.get('/eventsStatus', (req, res) => {
  res.send('Admin route');
});


export default admitRouter;