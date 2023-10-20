import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { prismadb } from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await prismadb.chapter.update({
      where: { id: params.chapterId, courseId: params.courseId },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log(error);
    return new NextResponse("Intenal error", { status: 500 });
  }
}
