import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { prismadb } from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const { url } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await prismadb.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attachment = await prismadb.attachment.create({
      data: { url, courseId: params.courseId, name: url.split("/").pop() },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log(error);
    return new NextResponse("internal error", { status: 500 });
  }
}
