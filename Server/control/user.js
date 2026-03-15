import Registration from '../model/registration.js';
import nodemailer from 'nodemailer';
import Admin from '../model/admin.js';
import Event from '../model/events.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const registration = async (req, res) => {
    try {
        const { eventName, playerName, teamName, phone, email, college, branch, transactionId, squadSize } = req.body;

        if (!eventName || !playerName || !phone || !email || !college || !branch || !transactionId || !squadSize) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const isMitsOrMuthoot = (college || '').toLowerCase().includes('mits') || (college || '').toLowerCase().includes('muthoot');
        const isMca = (branch || '').toLowerCase().trim() === 'mca' || (branch || '').toLowerCase().includes('mca');
        const isAllowedEvent = eventName === 'E-football' || eventName === 'Mini Miltia' || eventName === 'Mini Militia';
        
        if (isMitsOrMuthoot) {
            if (!isMca || !isAllowedEvent) {
                return res.status(400).json({ error: 'Registration not allowed for this college/event combination' });
            }
        }

        if (eventName === 'E-football') {
            const eFootballCount = await Registration.countDocuments({ eventName: 'E-football' });
            if (eFootballCount >= 32) {
                return res.status(400).json({ error: 'E-football registrations are full (limit: 32)' });
            }
        }

        if (eventName === 'Mini Militia') {
            const miniMilitiaCount = await Registration.countDocuments({ eventName: 'Mini Militia' });
            if (miniMilitiaCount >= 40) {
                return res.status(400).json({ error: 'Mini Militia registrations are full (limit: 40)' });
            }
        }

        if (eventName === 'Treasure Hunt') {
            const treasureHuntCount = await Registration.countDocuments({ eventName: 'Treasure Hunt' });
            if (treasureHuntCount >= 10) {
                return res.status(400).json({ error: 'Treasure Hunt registrations are full (limit: 10)' });
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

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const adminUrl = `${frontendUrl}/admin`;
        const createEmailHTML = (title, name, bodyHtml, buttonHtml = '') => `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 0; }
  .email-container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
  .logo-header { text-align: center; margin-bottom: 30px; display: flex; justify-content: center; align-items: center; gap: 20px; }
  .logo-header img { max-height: 45px; }
  .content { color: #333333; line-height: 1.6; font-size: 16px; }
  h2 { color: #0056b3; font-size: 22px; margin-bottom: 20px; text-align: center; font-weight: 600; }
  .btn { display: inline-block; padding: 12px 28px; background-color: #0056b3; color: white !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 25px; text-align: center; }
  .footer { margin-top: 35px; font-size: 13px; color: #777; text-align: center; border-top: 1px solid #eeeeee; padding-top: 20px; }
</style>
</head>
<body>
  <div class="email-container">
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="cid:mits_logo" alt="MITS" style="max-height: 45px; margin: 0 10px;" />
      <img src="cid:tecxell_logo" alt="TecXell 26" style="max-height: 45px; margin: 0 10px;" />
      <img src="cid:computex_logo" alt="Computex" style="max-height: 45px; margin: 0 10px;" />
    </div>
    <div class="content">
      <h2>${title}</h2>
      <p>Hi <strong>${name}</strong>,</p>
      ${bodyHtml}
      ${buttonHtml}
      <div class="footer">
        <p>If you have any questions or need support, feel free to connect with us.</p>
        <p>See you there,<br><strong>Team TecXell 26</strong></p>
      </div>
    </div>
  </div>
</body>
</html>
`;

        const userHtml = createEmailHTML(
            'Registration Received',
            playerName[0] || 'Participant',
            `<p>Thank you for registering for <strong>${eventName}</strong> at TecXell 26!</p>
             <p>Your payment is currently being verified and will be processed within 24 hours.</p>
             <p>We will notify you once verification is complete and send your digital Retro-Pass. Thank you for your patience.</p>`
        );

        const adminHtml = createEmailHTML(
            'New Registration Alert',
            admin?.name || 'Coordinator',
            `<p>A new registration has been submitted for <strong>${eventName}</strong> by <strong>${Array.isArray(playerName) ? playerName[0] : playerName}</strong>.</p>
             <p><strong>Transaction ID:</strong> ${transactionId}</p>
             <p>Please verify the payment and approve it immediately. Do not delay this verification.</p>`,
            `<div style="text-align: center;"><a href="${adminUrl}" class="btn" style="display: inline-block; padding: 12px 28px; background-color: #0056b3; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 25px;">Go to Admin Dashboard</a></div>`
        );

        const imageAttachments = [
            { filename: 'mits-logo.png', path: path.join(__dirname, '../public/mits-logo.png'), cid: 'mits_logo' },
            { filename: 'tecxell-logo.png', path: path.join(__dirname, '../public/tecxell-logo.png'), cid: 'tecxell_logo' },
            { filename: 'computex-logo.png', path: path.join(__dirname, '../public/computex-logo.png'), cid: 'computex_logo' }
        ];

        const userMailOptions = {
            from: process.env.EMAIL_USER_1,
            to: email,
            subject: 'Payment Verification Pending - TecXell 26 Registration',
            html: userHtml,
            attachments: imageAttachments
        };

        // 1. Start with the specific event coordinator's email
        let adminEmails = [admin?.email];

        // 2. If it is a student-run event (like Mini Militia), add your global emails
        if (admin?.type === 'Student Admin') {
            adminEmails.push('25mca41@mgits.ac.in', '25mca33@mgits.ac.in'); // <-- Put your real emails here!
        }

        // 3. Filter out any empty/null values and join them with a comma
        const validRecipients = adminEmails.filter(Boolean).join(', ');

        const adminMailOptions = {
            from: process.env.EMAIL_USER_2,
            to: validRecipients, // This safely sends to multiple people!
            subject: `New Registration - Verify Payment Now (${eventName})`,
            html: adminHtml,
            attachments: imageAttachments
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

export const getEFootballCount = async (req, res) => {
    try {
        const count = await Registration.countDocuments({ eventName: 'E-football' });
        res.status(200).json({ count });
    } catch (error) {
        console.error('E-Football count error:', error);
        res.status(500).json({ error: 'Server error fetching E-Football count' });
    }
};

export const getMiniMilitiaCount = async (req, res) => {
    try {
        const count = await Registration.countDocuments({ eventName: 'Mini Miltia' });
        res.status(200).json({ count });
    } catch (error) {
        console.error('Mini Militia count error:', error);
        res.status(500).json({ error: 'Server error fetching Mini Militia count' });
    }
};

export const getTreasureHuntCount = async (req, res) => {
    try {
        const count = await Registration.countDocuments({ eventName: 'Treasure Hunt' });
        res.status(200).json({ count });
    } catch (error) {
        console.error('Treasure Hunt count error:', error);
        res.status(500).json({ error: 'Server error fetching Treasure Hunt count' });
    }
};

export const getPublicEventsStatus = async (req, res) => {
    try {
        const events = await Event.find({}, 'name currentSts');
        res.status(200).json({ events });
    } catch (error) {
        console.error('Public events status error:', error);
        res.status(500).json({ error: 'Server error fetching events status' });
    }
};

export const getWinners = async (req, res) => {
    try {
        const winners = await Registration.find(
            { prize: { $in: ['1st Prize', '2nd Prize'] } },
            'eventName playerName teamName college prize'
        );
        res.status(200).json({ winners });
    } catch (error) {
        console.error('Get winners error:', error);
        res.status(500).json({ error: 'Server error fetching winners' });
    }
};
