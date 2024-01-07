import { NextResponse } from "next/server";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import { secretKey } from "../../lib/keys";
import { v4 as uuidv4 } from "uuid";

export async function GET(req, res) {
  if (req.method === "GET") {
    // const token = jwt.sign(
    //   {
    //     action: "login",
    //   },
    //   secretKey
    // );
    const token = uuidv4();
    const generatedUrl = await QRCode.toDataURL(uuidv4());

    return NextResponse.json(
      {
        message: "QR generated successfully",
        data: generatedUrl,
        temp: token,
      },
      { status: 201 }
    );
  } else {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }
}
