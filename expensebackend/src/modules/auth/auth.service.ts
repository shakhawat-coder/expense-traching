import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { sendEmail } from "../../utils/sendEmail";

interface User {
  name: string;
  email: string;
  password: string;
  role?: "USER" | "ADMIN";
}

const signUpUser = async (user: User) => {
  const isExist = await prisma.user.findUnique({
    where: { email: user.email },
  });
  if (isExist) {
    throw new Error("User already created");
  }
  const hashedPassword = await bcrypt.hash(user.password, 10);

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const newUser = await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      password: hashedPassword,
      role: user.role || "USER",
      verificationOtp: otp,
      otpExpiresAt: otpExpiresAt,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  // Send verification email
  try {
    await sendEmail(
      newUser.email,
      "Verify your email - Expense Tracker",
      `<h1>Welcome to Expense Tracker</h1>
       <p>Your verification code is: <strong>${otp}</strong></p>
       <p>This code will expire in 10 minutes.</p>`
    );
  } catch (error: any) {
    console.error("Failed to send verification email:", error);
    throw new Error(`User created but verification email failed to send: ${error.message}`);
  }

  return newUser;
};

const verifyOtp = async (email: string, otp: string) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.emailVerified) {
    return { message: "Email already verified" };
  }

  if (user.verificationOtp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
    throw new Error("OTP expired");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      verificationOtp: null,
      otpExpiresAt: null
    }
  });

  return { message: "Email verified successfully" };
};

const signInUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  if (!user.emailVerified) {
    throw new Error("NOT_VERIFIED");
  }

  const jwtSecret: Secret = process.env.JWT_SECRET || "fallback_secret_key_change_in_production";

  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    jwtSecret,
    { expiresIn: "7d" }
  );

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export const authService = {
  signUpUser,
  signInUser,
  verifyOtp,
};
