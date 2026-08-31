const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const prisma = require("../config/prisma");
const { sendPasswordResetEmail } = require("../services/email.service");

function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password, city, skills } = req.body;

    // Validate name
    if (!name || name.trim().length < 3 || !/^[a-zA-Z\s]+$/.test(name.trim())) {
      return res.status(400).json({ message: "Please enter a valid full name (letters only, min 3 characters)" });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    // Validate phone (Pakistani mobile format)
    const phoneRegex = /^03[0-9]{9}$/;
    if (!phone || !phoneRegex.test(phone.trim())) {
      return res.status(400).json({ message: "Please enter a valid 11-digit phone number starting with 03" });
    }

    // Validate city
    if (!city || city.trim().length < 2) {
      return res.status(400).json({ message: "City is required" });
    }

    // Validate password
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!password || !passwordRegex.test(password)) {
      return res.status(400).json({ message: "Password must be at least 6 characters and include letters and numbers" });
    }

    // check if email already used
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: hashedPassword,
        city: city.trim(),
        skills,
        status: "APPROVED", // Auto-approved; validation above ensures data quality instead of manual review
      },
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "Signup successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, status: user.status },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    // don't reveal whether the email exists, for security
    if (!user) {
      return res.json({ message: "If that email exists, a reset code has been sent" });
    }

    // generate a simple 6-digit code
    const resetCode = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: resetCode, resetTokenExpiry: expiry },
    });

    await sendPasswordResetEmail(user.email, resetCode);

    res.json({ message: "If that email exists, a reset code has been sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (
      !user ||
      user.resetToken !== code ||
      !user.resetTokenExpiry ||
      user.resetTokenExpiry < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: "New password must be at least 6 characters and include letters and numbers",
      });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};