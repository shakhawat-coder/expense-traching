import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
interface User {
  name: string;
  email: string;
  password: string;
}

const signUpUser = async (user: User) => {
  const isExist = await prisma.user.findUnique({
    where: { email: user.email },
  });
  if (isExist) {
    throw new Error("User already created");
  }
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser = await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  return newUser;
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
  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    "secret",
    { expiresIn: "7d" },
  );
  return { user, token };
};

export const authService = {
  signUpUser,
  signInUser,
};
