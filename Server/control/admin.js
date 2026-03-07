import Admin from "../model/admin.js";
import Event from "../model/events.js";
import Registration from "../model/registration.js";
import jwt from "jsonwebtoken";

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

        res.json({msg:"Login successful", 
          token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};