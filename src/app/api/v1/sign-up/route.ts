import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

import bcrypt from "bcrypt";

import { sendVerificationEmail } from "@/utils/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            sucess: false,
            message: "User already exist with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        // check this if get error
        const newUser = new UserModel({
          username,
          email,
          password: hashedPassword,
          verifyCode,
          verifyCodeExpiry: expiryDate,
        });
        await newUser.save();
      }

      //sending verification email
      const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
      );

      if (!emailResponse.success) {
        return Response.json(
          {
            success: false,
            message: emailResponse.message,
          },
          { status: 500 }
        );
      }

      return Response.json(
        {
          success: true,
          message: "User registered successsfully. Please Verify your account",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error registering user: ", error);
    return Response.json(
      { success: false, messgae: "Error registering user" },
      { status: 500 }
    );
  }
}
