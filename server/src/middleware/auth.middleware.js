import { clerkClient, verifyToken } from "@clerk/express"; 
import prisma from "../lib/prisma.js";

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
      clockSkewInMs: 60000, // ✅ allow 60 seconds clock difference
    });

    const clerkId = payload.sub;

    if (!clerkId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Find or create user in DB
    let user = await prisma.user.findUnique({ where: { clerkId } });

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

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export default requireAuth;
