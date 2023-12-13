import { cookieKey } from "@/app/constants";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 }
      );
    }

    cookies().delete(cookieKey);

    return NextResponse.json({ message: "logout successful" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
