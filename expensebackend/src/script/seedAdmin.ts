import { prisma } from "../lib/prisma";

async function seedAdmin() {
  try {
    const adminData = {
      name: "Admin",
      email: "shakhawathossen188@gmail.com",
      password: "shamim",
      role: "ADMIN",
      emailVerified: true,
    };

    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });
    if (existingUser) {
      console.log("Admin user already exists, deleting to recreate with correct role...");
      await prisma.user.delete({
        where: { email: adminData.email },
      });
    }

    const sigUpAdmin = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:3000",
      },
      body: JSON.stringify(adminData),
    });

    if (!sigUpAdmin.ok) {
      const errorData = await sigUpAdmin.text();
      console.error(
        `Sign-up failed with status ${sigUpAdmin.status}:`,
        errorData
      );
      throw new Error(`Sign-up failed: ${sigUpAdmin.statusText}`);
    }

    const admin = await sigUpAdmin.json();
    console.log("Admin user created successfully:", admin);
  } catch (error) {
    console.error("seedAdmin error:", error);
    throw error;
  }
}

// Execute the seeding when this script is run
seedAdmin()
  .then(() => console.log("seedAdmin finished"))
  .catch((err) => {
    console.error("seedAdmin failed:", err);
    process.exit(1);
  });
