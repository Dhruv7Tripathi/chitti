import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { text, senderId, sender, roomId } = await request.json();

    const message = await prisma.message.create({
      data: {
        text,
        senderId,
        sender,
        roomId,
      },
    });

    return NextResponse.json(message, { status: 201 });

  }
  catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Error creating message' }, { status: 500 });
  }
}
export async function GET(request: NextRequest){
  try {
    
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Error fetching messages' }, { status: 500 });
    
  }
}

