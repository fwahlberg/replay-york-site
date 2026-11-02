import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret)
    return new Response("Publishing is not configured.", { status: 503 });
  if (!request.headers.get("sanity-webhook-signature"))
    return new Response("Signature required.", { status: 401 });
  if (Number(request.headers.get("content-length") || 0) > 16384)
    return new Response("Payload too large.", { status: 413 });
  try {
    const { body, isValidSignature } = await parseBody<{
      _id?: string;
      _type?: string;
    }>(request, secret);
    if (isValidSignature !== true)
      return new Response("Invalid signature.", { status: 401 });
    if (body?._id !== "website" || body?._type !== "website")
      return new Response("Unexpected document.", { status: 400 });
    revalidateTag("replay-website", { expire: 0 });
    revalidatePath("/");
    return NextResponse.json({ revalidated: true });
  } catch {
    return new Response("Invalid publishing request.", { status: 400 });
  }
}
