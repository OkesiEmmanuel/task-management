import { Task } from "@prisma/client";

export default interface ITaskRepository {
  create(data: Partial<Task>): Promise<Task>;
  findAll(userId: string): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  update(id: string, data: Partial<Task>): Promise<Task>;
  delete(id: string): Promise<void>;
}
