import prisma from '@/lib/db';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
      },
    });
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}