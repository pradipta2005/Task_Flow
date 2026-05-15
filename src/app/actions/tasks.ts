"use server";

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function updateTaskStatus(taskId: string, newStatus: string) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return { error: 'Unauthorized' };

  const user = verifyToken(token);
  if (!user) return { error: 'Unauthorized' };

  const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
  if (!validStatuses.includes(newStatus)) return { error: 'Invalid status' };

  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return { error: 'Task not found' };
    if (user.role !== 'ADMIN' && task.assignedTo !== user.userId) return { error: 'Forbidden' };

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus },
      include: {
        assignee: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      }
    });

    return { success: true, task: updated };
  } catch (error) {
    return { error: 'Failed to update task' };
  }
}
