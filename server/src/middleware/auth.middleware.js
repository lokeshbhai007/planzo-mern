import { getAuth, clerkClient } from "@clerk/express";
import prisma from "../lib/prisma.js";

const requireAuth = async (req, res, next) => {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Find user in your DB
    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    // First time login — sync Clerk user into your DB
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkId);

      user = await prisma.user.create({
        data: {
          clerkId,
          name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
          email: clerkUser.emailAddresses[0].emailAddress,
          imageUrl: clerkUser.imageUrl || null,
        },
      });
    }

    // Attach your DB user to the request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default requireAuth;