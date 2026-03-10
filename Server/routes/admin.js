import express from 'express';
import { adminLogin, adminRegistration, eventRegistration, getEventsStatus, getRegistrations, NotVerifyPayment, verifyPayment, updateEventStatus, updatePrize } from '../control/admin.js';
import auth from '../middleware/auth.js';

const adminRouter = express.Router();

adminRouter.post('/adminLogin', adminLogin);

adminRouter.get('/registrationData', auth, getRegistrations);

adminRouter.put('/registrationVerify/:id', auth, verifyPayment);

adminRouter.delete('/registrationNotVerify/:id', auth, NotVerifyPayment);

adminRouter.get('/eventsStatus', auth, getEventsStatus);

adminRouter.put('/eventsStatus/:id', auth, updateEventStatus);

adminRouter.put('/prize/:id', auth, updatePrize);

// Developers use:
adminRouter.post('/adminRegistration', adminRegistration);
adminRouter.post('/events', eventRegistration);


export default adminRouter;