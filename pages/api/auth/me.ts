import { NextApiRequest, NextApiResponse } from "next";
import * as jose from "jose";
import jwt from "jsonwebtoken";
import { prisma } from "../../../server/db/client";

export default async function me(req: NextApiRequest, res: NextApiResponse) {
  const bearerToken = req.headers["authorization"] as string;

  if (!bearerToken) {
    return res.status(401).json({
      errorMessage: `unauthorized request No bearer token ${bearerToken}`,
    });
  }

  const token = bearerToken.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ errorMessage: "unauthorized request no token" });
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    await jose.jwtVerify(token, secret);
  } catch (error) {
    res.status(401).json({
      errorMessage: `unauthorized request JWT not verified ${token} is not ${secret}`,
    });
  }

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

// eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6IkJydW5vZGlhekBib3JrLmNvbS5hdSIsImV4cCI6MTY4NDIxNzA5MH0.cBPd65ldBc-W0h9kbOrA0h7NKhpYi9CL_fpTp98XjU8
