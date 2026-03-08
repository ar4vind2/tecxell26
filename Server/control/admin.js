import Admin from "../model/admin.js";
import Event from "../model/events.js";
import Registration from "../model/registration.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const adminLogin = async (req, res) => {
    try {
        const { password } = req.body;
        console.log(password);
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
        
        res.json({msg:"Login successful", 
          token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getRegistrations = async (req, res) => {
    try {
        console.log("inside getRegistraion");
        
        const adminId=req.user.id;
        
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
        console.log(query);
        
        console.log("before fetching");

        const registrations = await Registration.find(query).sort({ createdAt: -1 });

        console.log("after fetching");
        console.log(registrations);
        

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
            { new: true }
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

        // Current domain logic (hardcoding local dev for now, but dynamic would be better)
        const frontendUrl = process.env.FRONTEND_URL; // Change to production URL later
        const ticketUrl = `${frontendUrl}/ticket/${updatedRegistration._id}`;

        const userMessage = `Dear ${updatedRegistration.playerName},\n\nWe are thrilled to let you know that your payment has been verified!\n\nYour Ticket is Confirmed for ${updatedRegistration.eventName}.\n\nAccess and download your digital Retro-Pass from the link below:\n${ticketUrl}\n\nWe can't wait to see you there,\nTeam TecXell 2026`;

        const userMailOptions = {
            from: process.env.EMAIL_USER_1,
            to: updatedRegistration.email,
            subject: `Your Ticket is Confirmed for ${updatedRegistration.eventName} - See You There!`,
            text: userMessage
        };

        await transporter.sendMail(userMailOptions);

        res.status(200).json({ msg: 'Payment verified and ticket emailed successfully.', registration: updatedRegistration });

    } catch (error) {
        console.error('Verify Payment error:', error);
        res.status(500).json({ error: 'Server error during payment verification' });
    }
};

export const getEventsStatus = async (req, res) => {
    try {
        const events = await Event.find({});
        res.status(200).json({ events });
    } catch (error) {
        console.error('Error fetching events status:', error);
        res.status(500).json({ error: 'Server error while fetching events status' });
    }
};