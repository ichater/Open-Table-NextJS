import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import { prisma } from "../../../server/db/client";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { firstName, lastName, email, phone, city, passWord } = req.body;
    const errors: string[] = [];

    const validationSchema = [
      {
        valid: validator.isLength(firstName, { min: 1, max: 20 }),
        errorMessage: "First Name is invalid",
      },
      {
        valid: validator.isLength(lastName, { min: 1, max: 20 }),
        errorMessage: "Last Name is invalid",
      },
      {
        valid: validator.isEmail(email),
        errorMessage: "Email is invalid",
      },
      {
        valid: validator.isMobilePhone(phone),
        errorMessage: "phone number is invalid",
      },
      {
        valid: validator.isLength(city, { min: 1 }),
        errorMessage: "city is invalid",
      },
      {
        valid: validator.isStrongPassword(passWord),
        errorMessage: "Password is not strong enough",
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
      where: { email },
    });

    if (userWithEmail) {
      return res
        .status(400)
        .json({ errorMessage: "Email is associated with another account" });
    }

    const hashedPassword = await bcrypt.hash(passWord, 10);

    const user = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        password: hashedPassword,
        city,
        phone,
        email,
      },
    });

    res.status(200).json({
      hello: user,
    });
  }
}
