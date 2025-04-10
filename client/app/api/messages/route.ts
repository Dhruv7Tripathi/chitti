import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, senderId, sender, roomId } = body;

    const message = await prisma.message.create({
      data: {
        text,
        senderId,
        sender,
        roomId,
      },
    });

    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    console.error("Error storing message:", error);
    return NextResponse.json({ message: "Error storing message" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const roomId = req.nextUrl.searchParams.get("roomId");
    console.log("\n\n\n\nFetching messages for roomId:\n\n\n", roomId);
    const messages = await prisma.message.findMany({
      where: { roomId: roomId ?? undefined },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ message: "Error fetching messages" }, { status: 500 });
  }
}

