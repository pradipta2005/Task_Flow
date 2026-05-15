import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { isBefore, startOfDay } from 'date-fns';

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const today = startOfDay(new Date());
    const isAdmin = user.role === 'ADMIN';

    if (isAdmin) {

      const tasks = await prisma.task.findMany({
        include: {
          project: { select: { name: true } },
          assignee: { select: { id: true, name: true } },
        },
      });

      const totalProjects = await prisma.project.count();
      const totalMembers = await prisma.user.count();
      const doneTasks = tasks.filter(t => t.status === 'DONE').length;

      const overdueTasks = tasks.filter(
        t => t.status !== 'DONE' && t.dueDate && isBefore(new Date(t.dueDate), today)
      );

      return NextResponse.json({
        role: 'ADMIN',
        summary: {
          totalTasks: tasks.length,
          completedTasks: doneTasks,
          inProgressTasks: tasks.filter(t => t.status === 'IN_PROGRESS').length,
          todoTasks: tasks.filter(t => t.status === 'TODO').length,
          overdueCount: overdueTasks.length,
          totalProjects,
        },
        teamStats: {
          totalMembers,
          teamCompletionRate: tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0,
        },
        overdueTasks: overdueTasks.slice(0, 5),
        recentTasks: tasks
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 8),
      });
    } else {

      const myTasks = await prisma.task.findMany({
        where: { assignedTo: user.userId },
        include: {
          project: { select: { name: true } },
          assignee: { select: { id: true, name: true } },
        },
      });

      const myProjectIds = await prisma.projectMember.findMany({
        where: { userId: user.userId },
        select: { projectId: true },
      });

      const overdueTasks = myTasks.filter(
        t => t.status !== 'DONE' && t.dueDate && isBefore(new Date(t.dueDate), today)
      );

      return NextResponse.json({
        role: 'MEMBER',
        summary: {
          totalTasks: myTasks.length,
          completedTasks: myTasks.filter(t => t.status === 'DONE').length,
          inProgressTasks: myTasks.filter(t => t.status === 'IN_PROGRESS').length,
          todoTasks: myTasks.filter(t => t.status === 'TODO').length,
          overdueCount: overdueTasks.length,
          totalProjects: myProjectIds.length,
        },
        teamStats: null,
        overdueTasks: overdueTasks.slice(0, 5),
        recentTasks: myTasks
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 8),
      });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
