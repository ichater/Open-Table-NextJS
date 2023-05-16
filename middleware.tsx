import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

// is automatically picked up by the rest of the app due to the name of the
// function and file being in the root dir

export async function middleware(req: NextRequest, res: NextResponse) {
  console.log("I am the storm");
  const bearerToken = req.headers.get("authorization") as string;

  if (!bearerToken) {
    return new NextResponse(
      JSON.stringify({
        errorMessage: `unauthorized request no bearer token ${bearerToken}`,
      }),
      { status: 401 }
    );
  }

  const token = bearerToken.split(" ")[1];

  if (!token) {
    return new NextResponse(
      JSON.stringify({
        errorMessage: `unauthorized request no token`,
      }),
      { status: 401 }
    );
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    await jose.jwtVerify(token, secret);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        errorMessage: `unauthorized request JWT not verified ${token} is not ${secret}`,
      }),
      { status: 401 }
    );
  }
}

// Like a dependency array, the middleware will only be called when these routes are hit
export const config = {
  matcher: ["/api/auth/me"],
};
