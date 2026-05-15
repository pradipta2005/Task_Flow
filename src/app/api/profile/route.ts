import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { isBefore, startOfDay } from 'date-fns';

export async function GET(request: NextRequest) {
  const userPayload = getUserFromRequest(request);
  if (!userPayload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userPayload.userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const today = startOfDay(new Date());
    const isAdmin = user.role === 'ADMIN';

    if (isAdmin) {

      const allTasks = await prisma.task.findMany({
        include: { assignee: { select: { id: true, name: true } } }
      });
      const totalProjects = await prisma.project.count();
      const totalMembers = await prisma.user.count();
      const doneTasks = allTasks.filter(t => t.status === 'DONE').length;
      const overdueTasks = allTasks.filter(
        t => t.status !== 'DONE' && t.dueDate && isBefore(new Date(t.dueDate), today)
      );
      const completionRate = allTasks.length > 0 ? Math.round((doneTasks / allTasks.length) * 100) : 0;

      return NextResponse.json({
        user,
        isAdmin: true,
        stats: {
          total: allTasks.length,
          done: doneTasks,
          inProgress: allTasks.filter(t => t.status === 'IN_PROGRESS').length,
          todo: allTasks.filter(t => t.status === 'TODO').length,
          completionRate,
          totalProjects,
          totalMembers,
          overdueCount: overdueTasks.length,
        },
        overdueTasks: overdueTasks.slice(0, 5),
      });
    } else {

      const tasks = await prisma.task.findMany({
        where: { assignedTo: user.id },
        include: { project: { select: { name: true } } }
      });

      const overdueTasks = tasks.filter(
        t => t.status !== 'DONE' && t.dueDate && isBefore(new Date(t.dueDate), today)
      );

      return NextResponse.json({
        user,
        isAdmin: false,
        stats: {
          total: tasks.length,
          done: tasks.filter(t => t.status === 'DONE').length,
          inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
          todo: tasks.filter(t => t.status === 'TODO').length,
          completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'DONE').length / tasks.length) * 100) : 0,
          overdueCount: overdueTasks.length,
        },
        overdueTasks: overdueTasks.slice(0, 5),
        activeTasks: tasks.filter(t => t.status !== 'DONE').slice(0, 6),
      });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
