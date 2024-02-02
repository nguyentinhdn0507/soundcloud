import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const secret = req.nextUrl.searchParams.get("secret");
  const tag = req.nextUrl.searchParams.get("tag");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { message: "Invalid Secret" },
      {
        status: 401,
      }
    );
  }
  if (!tag) {
    return NextResponse.json(
      { message: "Miss Tag Param" },
      {
        status: 400,
      }
    );
  }
  revalidateTag(tag);
  return NextResponse.json({ revalidated: true, now: Date.now() });
};
