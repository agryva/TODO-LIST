import { PrismaClient } from '@prisma/client';
import { authenticate } from '../auth/middleware';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const user: any = await authenticate(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const members = await prisma.user.findMany({
      where: {
        role: 'TEAM',
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return new Response(JSON.stringify(members), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch members' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
