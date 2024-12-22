// controllers/userController.js
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const validator = require("email-validator");
const jwt = require("jsonwebtoken");
const connection = require("../database/conn");
const dotenv = require("dotenv");
const otpGenerator = require("otp-generator");

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
    return resp
      .status(400)
      .json({ error: "Password and Confirm Password do not match" });
  }

  const validateEmail = validator.validate(email);
  if (!validateEmail) {
    return resp.status(400).json({ error: "Please enter a valid email" });
  }

  const [data] = await db.query("SELECT email FROM users WHERE email = ?", [
    email,
  ]);
  if (data.length > 0) {
    return resp.status(409).json({ error: "Email already exists" });
  }

  const result = requestBodySchema.safeParse({ pass: password });
  if (!result.success) {
    return resp.status(400).json({ error: result.error.errors });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [field, rows] = await db.query(
      "INSERT INTO users (id, First_Name, Last_Name, email, password, role) VALUES (?,?,?,?,?,?)",
      [id, First_Name, Last_Name, email, hashedPassword, "Admin"]
    );

    return resp.redirect("/loginpage.html");
  } catch (error) {
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

    // Return the JWT token
    return resp.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    return resp
      .status(500)
      .json({ error: "Server error occurred during login." });
  }
}

async function OTP(req, resp, next) {
  const otp = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  
}
module.exports = { signUpUsers, signInUsers, OTP };
