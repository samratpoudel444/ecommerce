// controllers/userController.js
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const validator = require("email-validator");
const jwt = require("jsonwebtoken");
const connection = require("../database/conn");
const dotenv = require("dotenv");
const otpGenerator = require("otp-generator");
const nodemailer = require('nodemailer');
let otpStorage = {};
let email= {}

dotenv.config();

async function signUpUsers(req, resp, next) {
  const { First_Name, Last_Name, email, password, cpassword } = req.body;
  const id = uuidv4();

  const passwordSchema = z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[\W_]/);

  const requestBodySchema = z.object({
    pass: passwordSchema,
  });

  const db = await connection();

  if (!First_Name || !Last_Name || !email || !password || !cpassword) {
    return resp.status(400).json({ error: "Please enter all required fields" });
  }

  if (password !== cpassword) {
    return resp.status(400).json({ error: "Password and Confirm Password do not match" });
  }

  const validateEmail = validator.validate(email);
  if (!validateEmail) {
    return resp.status(400).json({ error: "Please enter a valid email" });
  }

  const [data] = await db.query("SELECT email FROM users WHERE email = ?", [email]);
  if (data.length > 0) {
    return resp.status(409).json({ error: "Email already exists" });
  }

  const result = requestBodySchema.safeParse({ pass: password });
  if (!result.success) {
    return resp.status(400).json({ error: "Password should contain at least one uppercase, one lowercase, one symbol, and one number" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [field, rows] = await db.query(
      "INSERT INTO users (id, First_Name, Last_Name, email, password, role) VALUES (?,?,?,?,?,?)",
      [id, First_Name, Last_Name, email, hashedPassword, "Admin"]
    );

    // Return a JSON response instead of redirecting
    return resp.status(200).json({ message: "Registration successful!" });
  } catch (error) {
    console.error('Error occurred while inserting the user:', error);
    return resp.status(500).json({ error: error.message });
  }
}
async function signInUsers(req, resp, next) {
  const { email, password } = req.body;
  const db = await connection();

  try {
    // Fetch the user from the database
    const [data] = await db.query(
      "SELECT password FROM users WHERE email = ?",
      [email]
    );
    if (data.length === 0) {
      return resp
        .status(400)
        .json({ error: "The provided email is not registered." });
    }

    // Compare provided password with the stored hash
    const match = await bcrypt.compare(password, data[0].password);
    if (!match) {
      return resp
        .status(400)
        .json({ error: "The provided password is incorrect." });
    }

    // Generate JWT token
    const jwtData = {
      username: email,
      time: new Date(),
    };

    const token = jwt.sign(jwtData, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    // Check user role (Admin or not)
    const [isadmin] = await db.query('SELECT role FROM users WHERE email = ?', [email]);
    if (isadmin.length > 0 && isadmin[0].role === 'Admin') {
      // Send token and flag to frontend, let frontend handle redirection
      return resp.status(200).json({ message: "Login successful", token, isAdmin: true });
    }

    // Send token with response for non-admin users
    return resp.status(200).json({ message: "Login successful", token, isAdmin: false });
  } catch (error) {
    console.error(error);
    return resp
      .status(500)
      .json({ error: "Server error occurred during login." });
  }
}





async function OTP(req, resp, next) {
  try {
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const { email } = req.body;

    const db = await connection();
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) {
      return resp.status(404).json({ message: "Invalid user email" });
    }

    // Store OTP in memory for the user
    otpStorage[email] = otp;

    // Nodemailer transporter setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.GMAIL_APP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'OTP for Verification',
      text: `Your OTP code is ${otp}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error('Error sending email:', error);
        return resp.status(500).json({ message: 'Failed to send OTP. Please try again.' });
      } else {
        console.log('Email sent:', info.response);
        return resp.status(200).json({ message: 'OTP sent successfully.' });
      }
    });
  } catch (error) {
    console.error('Error in OTP function:', error);
    resp.status(500).json({ message: 'Internal server error.' });
  }
}

// Verify OTP function
async function verifyOTP(req, resp) {
  try {
    const { email, otp } = req.body;

    // Check if OTP matches the stored OTP
    if (otpStorage[email] === otp) {
      delete otpStorage[email]; // Remove OTP after successful verification
      return resp.status(200).json({ message: 'OTP verified successfully.' });
    } else {
      return resp.status(400).json({ message: 'Invalid OTP or expired OTP.' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    resp.status(500).json({ message: 'Internal server error.' });
  }
}


async function resetPassword(req, resp) {
  try {
    const { email, password } = req.body;

    // Ensure email and password are provided
    if (!email || !password) {
      return resp.status(400).json({ message: 'Email and password are required.' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password in the database
    const db = await connection();
    const [result] = await db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

    if (result.affectedRows === 0) {
      return resp.status(404).json({ message: 'Email not found.' });
    }

    return resp.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    resp.status(500).json({ message: 'Internal server error.' });
  }
}






module.exports = { signUpUsers, signInUsers, OTP,  verifyOTP, resetPassword };
