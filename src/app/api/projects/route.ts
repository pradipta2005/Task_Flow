import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const isAdmin = user.role === 'ADMIN';

    if (isAdmin) {
      const projects = await prisma.project.findMany({
        include: {
          owner: { select: { id: true, name: true, email: true } },
          _count: { select: { tasks: true } },
          members: { include: { user: { select: { id: true, name: true, email: true } } } }
        },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json(projects);
    } else {

      const memberships = await prisma.projectMember.findMany({
        where: { userId: user.userId },
        select: { projectId: true },
      });
      const projectIds = memberships.map(m => m.projectId);

      const projects = await prisma.project.findMany({
        where: { id: { in: projectIds } },
        include: {
          owner: { select: { id: true, name: true, email: true } },
          _count: { select: { tasks: true } },
          members: { include: { user: { select: { id: true, name: true, email: true } } } }
        },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json(projects);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { name, description } = await request.json();
    if (!name) return NextResponse.json({ error: 'Project name is required' }, { status: 400 });

    const project = await prisma.project.create({
      data: { name, description, ownerId: user.userId },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
