import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { prismadb } from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

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

    const muxData = await prismadb.muxData.findFirst({
      where: { chapterId: params.chapterId },
    });

    const chapter = await prismadb.chapter.findUnique({
      where: { id: params.chapterId, courseId: params.courseId },
    });

    if (
      !chapter ||
      !muxData ||
      !chapter.title ||
      !chapter.description ||
      !chapter.videoUrl
    ) {
      return new NextResponse("Missing required filed", { status: 400 });
    }

    const publishedChapter = await prismadb.chapter.update({
      where: { id: params.chapterId, courseId: params.courseId },
      data: { isPublished: true },
    });

    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.log(error);
    return new NextResponse("Intenal error", { status: 500 });
  }
}
