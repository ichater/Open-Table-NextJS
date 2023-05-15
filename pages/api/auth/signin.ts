import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import { prisma } from "../../../server/db/client";
import bcrypt from "bcrypt";
import * as jose from "jose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const errors: string[] = [];
    const { email, passWord } = req.body;

    const validationSchema = [
      {
        valid: validator.isEmail(email),
        errorMessage: "Email is invalid",
      },
      {
        valid: validator.isLength(passWord, { min: 1 }),
        errorMessage: "Password is invalid",
      },
    ];
    validationSchema.forEach((check) => {
      if (!check.valid) {
        errors.push(check.errorMessage);
      }
    });

    if (errors.length) {
      return res.status(400).json({ errorMessage: errors.join(" ") });
    }

    const userWithEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!userWithEmail) {
      return res
        .status(401)
        .json({ errorMessage: "Email or password is invalid" });
    }

    const isMatch: boolean = await bcrypt.compare(
      passWord,
      userWithEmail.password
    );

    if (!isMatch) {
      return res
        .status(401)
        .json({ errorMessage: "Email or password is invalid" });
    }

    // algorithm for the protected header
    const alg = "HS256";

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    // create web token through jose

    const token = await new jose.SignJWT({ email: userWithEmail.email })
      .setProtectedHeader({ alg })
      .setExpirationTime("24h")
      .sign(secret);

    res.status(200).json({
      token,
    });
  }

  return res.status(404).json("unknown endpoint");
}
