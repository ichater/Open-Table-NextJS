import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { prisma } from "../../../server/db/client";

// Get information about the user based off their token

export default async function me(req: NextApiRequest, res: NextApiResponse) {
  // Middleware has already verified that the token and the bearer token exist

  const bearerToken = req.headers["authorization"] as string;

  const token = bearerToken.split(" ")[1];

  const payload = jwt.decode(token) as { email: string };

  if (!payload.email) {
    return res
      .status(401)
      .json({ errorMessage: "unauthorized request no token" });
  }

  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  return res.json({ user });
}
