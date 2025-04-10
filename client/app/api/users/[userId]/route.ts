import { NextResponse } from "next/server";
import prisma from "@/lib/db";

interface Params {
  params: { userId: string };
}

export async function GET(_: Request, { params }: Params) {
  try {
    const { userId } = params;

    console.log("\n\nUser id:\n\n", userId);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
