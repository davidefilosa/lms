import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { prismadb } from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
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

    const unpublishedCourse = await prismadb.course.update({
      where: { id: params.courseId },
      data: { isPublished: false },
    });

    return NextResponse.json(unpublishedCourse);
  } catch (error) {
    console.log(error);
    return new NextResponse("Intenal error", { status: 500 });
  }
}
