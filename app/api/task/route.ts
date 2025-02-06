import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../auth/middleware';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const user: any = await authenticate(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const status = url.searchParams.get('status');

    let tasks;
    const whereCondition: any = {
      ...(status ? { status } : {}),
      OR: [
        { user_id: user.id },
        { task_members: { some: { user_id: user.id } } },
      ],
    };

    if (user.role === 'LEAD') {
      tasks = await prisma.task.findMany({
        where: whereCondition,
        include: {
          user: { select: { id: true, name: true, email: true } },
          task_members: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
      });
    } else {
      tasks = await prisma.task.findMany({
        where: {
          ...whereCondition,
          task_members: { some: { user_id: user.id } },
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
          task_members: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
      });
    }

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user: any = await authenticate(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, status, members } = await req.json();

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'NOT_STARTED',
        user_id: user.id,
        task_members: {
          create: Array.isArray(members)
            ? members.map((memberId: string) => ({
                user_id: memberId,
              }))
            : [],
        },
      },
      include: { task_members: true },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal membuat task' }, { status: 500 });
  }
}
