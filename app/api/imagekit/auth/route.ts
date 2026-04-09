import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import crypto from "crypto";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
        const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
        const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

        if (!publicKey || !privateKey || !urlEndpoint) {
            return new NextResponse("ImageKit configuration missing", { status: 500 });
        }

        const token = crypto.randomUUID();
        const expire = Math.floor(Date.now() / 1000) + 2400;
        const signature = crypto
            .createHmac("sha1", privateKey)
            .update(token + expire)
            .digest("hex");

        return NextResponse.json({
            token,
            expire,
            signature,
        });
    } catch (error) {
        console.error("[IMAGEKIT_AUTH_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
