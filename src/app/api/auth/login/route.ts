import { cookieKey } from "@/app/constants";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectDB } from "../../lib/dbconnection";

export async function POST(req, res) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 }
      );
    }

    let { mobileNumber, password } = await req.json();

    if (!mobileNumber || !password) {
      return NextResponse.json(
        { message: "Missing mobile number, or password" },
        { status: 400 }
      );
    }
    mobileNumber = parseInt(mobileNumber);
    password = password?.toString();

    const db = await connectDB();
    console.log("gfdfghj", mobileNumber, password);
    const user = await db.collection("users").findOne({ mobileNumber });
    console.log("kjhgfghj", user);
    if (!user) {
      return NextResponse.json(
        { message: "Mobile number not exists" },
        { status: 401 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Password incorrect" },
        { status: 401 }
      );
    }

    const token = jwt.sign({ id: user._id }, "secretkey");

    cookies().set(cookieKey, JSON.stringify({ token, mobileNumber }));

    return NextResponse.json(
      {
        token,
        mobileNumber,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
