import Admin from "../model/admin.js";
import Event from "../model/events.js";
import Registration from "../model/registration.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const adminLogin = async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }
        const admin = await Admin.findOne({ password });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid Password' });
        }

        const payload = {
            id: admin._id,
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '4h' }
        )
        console.log(token);

        res.json({
            msg: "Login successful",
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getRegistrations = async (req, res) => {
    try {
        const adminId = req.user.id;

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        //if admin.eventName is empty (or null/undefined), the query becomes an empty object {}, which fetches all registration documents. If admin.eventName contains event names, it fetches only the registrations for those specific events. This matches your requirement.
        // so for superior and half superior admins, it will fetch all registrations to get full view, while for faculty and student admins, it will fetch only the registrations for their assigned events for single view.

        let query = {};
        if (admin.name === 'Favadh' || admin.name === 'Vijeesh V') {
            // query remains {} for full registrations
        } else if (
            Array.isArray(admin.eventName) &&
            admin.eventName.length > 0 &&
            admin.eventName.some(e => e && e.trim() !== "")
        ) {
            // Only include non-empty event names
            const filteredEvents = admin.eventName.filter(e => e && e.trim() !== "");
            if (filteredEvents.length > 0) {
                query = { eventName: { $in: filteredEvents } };
            }
        }

        const registrations = await Registration.find(query).sort({ createdAt: -1 });

        // we'll check the adminType in the frontend and grant them the verify functionality(sending mail) accordingly. superior and half superior admins will have the verify functionality for all events, while faculty and student admins will have the verify functionality only for their assigned events. this way we can maintain a single endpoint for fetching registrations, and the frontend can handle the display and functionality based on the admin type.
        res.status(200).json({
            registrations,
            adminType: admin.type,
            msg: 'Registrations fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching registrations:', error);
        res.status(500).json({ error: 'Server error while fetching registrations' });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and update the registration status
        const updatedRegistration = await Registration.findByIdAndUpdate(
            id,
            { verified: "Verified", feeSts: 'Paid' }, // Assuming you track payment status here
            { returnDocument: 'after' }
        );

        if (!updatedRegistration) {
            return res.status(404).json({ error: 'Registration not found' });
        }

        // Setup nodemailer transporter using existing credentials
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER_1,
                pass: process.env.EMAIL_PASS_1
            }
        });

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const ticketUrl = `${frontendUrl}/ticket/${updatedRegistration._id}`;

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
        <p>We can't wait to meet & greet you at the event. Whether you're coming to have fun, connect, or simply vibe with the crowd, you're now officially in.</p>
        <p>If you have any questions or need support, feel free to connect with us.</p>
        <p>See you there,<br><strong>Team TecXell 26</strong></p>
      </div>
    </div>
  </div>
</body>
</html>
`;

        const userHtml = createEmailHTML(
            `Your Ticket is Confirmed for ${updatedRegistration.eventName}`,
            updatedRegistration.playerName,
            `<p>We are thrilled to let you know that your payment has been verified!</p>
             <p>Access and download your digital Retro-Pass from the link below:</p>
             <p><strong>Note: The physical Ticket will only be given if you show this digital ticket, so keep it safe!</strong></p>
             <div style="text-align: center;"><a href="${ticketUrl}" class="btn" style="display: inline-block; padding: 12px 28px; background-color: #0056b3; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 25px;">Download Tickets</a></div>`,
            ``
        );


        const imageAttachments = [
            { filename: 'mits-logo.png', path: path.join(__dirname, '../public/mits-logo.png'), cid: 'mits_logo' },
            { filename: 'tecxell-logo.png', path: path.join(__dirname, '../public/tecxell-logo.png'), cid: 'tecxell_logo' },
            { filename: 'computex-logo.png', path: path.join(__dirname, '../public/computex-logo.png'), cid: 'computex_logo' }
        ];

        const userMailOptions = {
            from: process.env.EMAIL_USER_1,
            to: updatedRegistration.email,
            subject: `Your Ticket is Confirmed for ${updatedRegistration.eventName} - See You There!`,
            html: userHtml,
            attachments: imageAttachments
        };

        await transporter.sendMail(userMailOptions);

        res.status(200).json({ msg: 'Payment verified and ticket emailed successfully.', registration: updatedRegistration });

    } catch (error) {
        console.error('Verify Payment error:', error);
        res.status(500).json({ error: 'Server error during payment verification' });
    }
};

export const NotVerifyPayment = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and update the registration status
        const deletedRegistration = await Registration.findByIdAndDelete(
            id
        );

        if (!deletedRegistration) {
            return res.status(404).json({ error: 'Registration not found' });
        }

        // Setup nodemailer transporter using existing credentials
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER_1,
                pass: process.env.EMAIL_PASS_1
            }
        });

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
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
  h2 { color: #dc3545; font-size: 22px; margin-bottom: 20px; text-align: center; font-weight: 600; }
  .btn { display: inline-block; padding: 12px 28px; background-color: #dc3545; color: white !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 25px; text-align: center; }
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
        <p>Best regards,<br><strong>Team TecXell 26</strong></p>
      </div>
    </div>
  </div>
</body>
</html>
`;

        const userHtml = createEmailHTML(
            `Payment Verification Failed - ${deletedRegistration.eventName}`,
            deletedRegistration.playerName,
            `<p>We regret to inform you that your payment could not be verified due to a transaction ID mismatch with our records.</p>
             <p>As a result, your registration for <strong>${deletedRegistration.eventName}</strong> has been cancelled.</p>
             <p>Please ensure you provide the correct transaction ID when registering again.</p>`
        );

        const imageAttachments = [
            { filename: 'mits-logo.png', path: path.join(__dirname, '../public/mits-logo.png'), cid: 'mits_logo' },
            { filename: 'tecxell-logo.png', path: path.join(__dirname, '../public/tecxell-logo.png'), cid: 'tecxell_logo' },
            { filename: 'computex-logo.png', path: path.join(__dirname, '../public/computex-logo.png'), cid: 'computex_logo' }
        ];

        const userMailOptions = {
            from: process.env.EMAIL_USER_1,
            to: deletedRegistration.email,
            subject: `Payment Verification Failed for ${deletedRegistration.eventName} - Registration Cancelled`,
            html: userHtml,
            attachments: imageAttachments
        };

        await transporter.sendMail(userMailOptions);

        res.status(200).json({ msg: 'Payment verification failed and registration cancelled.' });

    } catch (error) {
        console.error('Not Verifying Payment error:', error);
        res.status(500).json({ error: 'Server error during Not payment verification' });
    }
};

export const getEventsStatus = async (req, res) => {
    try {
        const adminId = req.user.id;
        const admin = await Admin.findById(adminId);

        const events = await Event.find({});
        res.status(200).json({ events, adminType: admin?.type || '', adminEventNames: admin?.eventName || [] });
    } catch (error) {
        console.error('Error fetching events status:', error);
        res.status(500).json({ error: 'Server error while fetching events status' });
    }
};


export const updateEventStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentSts } = req.body;

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { currentSts },
            { new: true } // Returns the updated document
        );

        if (!updatedEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json({ msg: 'Event status updated successfully', event: updatedEvent });
    } catch (error) {
        console.error('Error updating event status:', error);
        res.status(500).json({ error: 'Server error while updating event status' });
    }
};

// Developmers use:
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

export const updatePrize = async (req, res) => {
    try {
        const { id } = req.params;
        const { prize } = req.body;

        const validPrizes = ['1st Prize', '2nd Prize', 'None'];
        if (!validPrizes.includes(prize)) {
            return res.status(400).json({ error: 'Invalid prize value' });
        }

        const registration = await Registration.findByIdAndUpdate(
            id,
            { prize },
            { new: true }
        );

        if (!registration) {
            return res.status(404).json({ error: 'Registration not found' });
        }

        res.status(200).json({ msg: 'Prize updated successfully', registration });
    } catch (error) {
        console.error('Update prize error:', error);
        res.status(500).json({ error: 'Server error updating prize' });
    }
};

