import { PrismaClient, Task } from "@prisma/client";
import { ITaskRepository } from "../interfaces";

const prisma = new PrismaClient();

export class TaskRepository implements ITaskRepository {
  async create(data: Partial<Task>): Promise<Task> {
    return prisma.task.create({ data: data as Task });
  }

  async findAll(userId: string): Promise<Task[]> {
    return prisma.task.findMany({ where: { userId } });
  }

  async findById(id: string): Promise<Task | null> {
    return prisma.task.findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<Task>): Promise<Task> {
    return prisma.task.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.task.delete({ where: { id } });
  }
}
