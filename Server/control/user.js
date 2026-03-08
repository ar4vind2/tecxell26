import Registration from '../model/registration.js';
import nodemailer from 'nodemailer';
import Admin from '../model/admin.js';
import Event from '../model/events.js';

export const registration = async (req, res) => {
    try {
        const { eventName, playerName, teamName, phone, email, college, branch, transactionId, squadSize } = req.body;

        if (!eventName || !playerName || !phone || !email || !college || !branch || !transactionId || !squadSize) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (college.toLowerCase().includes('mits') || college.toLowerCase().includes('muthoot')) {
            return res.status(400).json({ error: 'Registration not allowed for this college' });
        }

        if (eventName === 'E-football') {
            const eFootballCount = await Registration.countDocuments({ eventName: 'E-football' });
            if (eFootballCount >= 32) {
                return res.status(400).json({ error: 'E-football registrations are full (limit: 32)' });
            }
        }

        const newRegistration = new Registration({
            eventName,
            playerName,
            teamName,
            phone,
            email,
            college,
            branch,
            transactionId,
            squadSize
        });

        await newRegistration.save();

        // Fetch admin for this event
        const admin = await Admin.findOne({
            eventName: eventName,
            $or: [
                { type: 'Student Admin' },
                { name: 'Favadh' },
                { name: 'Vijeesh V' }
            ]
        });

        // Setup nodemailer transporter
        const transporter1 = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER_1,
                pass: process.env.EMAIL_PASS_1
            }
        });

        const transporter2 = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER_2,
                pass: process.env.EMAIL_PASS_2
            }
        });

        // Send email to user
        const userMessage = `Dear ${playerName[0]},\n\nThank you for registering for ${eventName} at TecXell. Your payment is currently being verified and will be processed within 24 hours.\n\nWe will notify you once verification is complete. Thank you for your patience.\n\nBest regards,\nTecXell Team`;

        // Send email to admin
        const adminMessage = `Dear ${admin?.name || 'Coordinator'},\n\nA new registration has been submitted for ${eventName}.\nPlease verify the payment and approve immediately - do not delay this verification.\n\n[Admin Dashboard: https://tecxell-admin.com/dashboard]\n\nBest regards,\nTecXell System`;

        const userMailOptions = {
            from: process.env.EMAIL_USER_1,
            to: email,
            subject: 'Payment Verification Pending - TecXell Registration',
            text: userMessage
        };


        const adminMailOptions = {
            from: process.env.EMAIL_USER_2,
            to: admin?.email,
            subject: 'New Registration - Verify Payment Now',
            text: adminMessage
        };

        // Send both emails
        await Promise.all([
            transporter1.sendMail(userMailOptions),
            transporter2.sendMail(adminMailOptions)
        ]);

        res.status(201).json({ msg: 'Registration successful. Verification emails sent.' });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

export const adminRegistration = async (req, res) => {
    try {
        const { name, password, email, eventName, type } = req.body;

        const newAdmin = new Admin({ name, password, email, eventName, type });
        await newAdmin.save();

        res.status(201).json({ msg: 'Admin Registration successful' });
    } catch (error) {
        console.error('Admin Registration error:', error);
        res.status(500).json({ error: 'Server error during admin registration' });
    }
};

export const eventRegistration = async (req, res) => {
    try {
        const { name, loc, currentSts, schedule } = req.body;

        const newEvent = new Event({ name, loc, currentSts, schedule });
        await newEvent.save();

        res.status(201).json({ msg: 'Event Registration successful' });
    } catch (error) {
        console.error('Event Registration error:', error);
        res.status(500).json({ error: 'Server error during event registration' });
    }
};

// details of a single registration for the ticket page, also includes event details for the frontend to display on the ticket page
export const getRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const registrationInfo = await Registration.findById(id);

        if (!registrationInfo) {
            return res.status(404).json({ error: 'Registration not found' });
        }

        const eventInfo = await Event.findOne({ name: registrationInfo.eventName });

        res.status(200).json({
            registration: registrationInfo,
            event: eventInfo // Pass the event document down to the frontend
        });
    } catch (error) {
        console.error('Get Registration error:', error);
        res.status(500).json({ error: 'Server error fetching registration' });
    }
};

