import { prisma } from "../../lib/prisma";

interface User {
  name: string;
  email: string;
  password: string;
  role?: string;
  incomes?: boolean;
  expenses?: boolean;
}
enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

const createUser = async (user: User) => {
  const isExist = await prisma.user.findUnique({
    where: { email: user.email },
  });
  if (isExist) {
    throw new Error("User already created");
  }
  const newUser = await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      password: user.password,
      ...(user.role && { role: user.role as Role }),
    },
  });
  return newUser;
};
const getAllUsers = async () => {
  return prisma.user.findMany({
    where: {
      role: {
        not: Role.ADMIN,
      },
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
};
const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      incomes: true,
      expenses: true,
    },
  });
};
const updateUser = async (id: string, user: User) => {
  return prisma.user.update({
    where: { id },
    data: {
      name: user.name,
      email: user.email,
      ...(user.role && { role: user.role as Role }),
    },
  });
};
const deleteUser = async (id: string) => {
  return prisma.user.delete({
    where: { id },
  });
};

export const userService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
