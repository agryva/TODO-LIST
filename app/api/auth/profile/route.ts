import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const user: any = authenticate(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}
