
import { Task } from "@prisma/client";
import redisClient from "../../config/redis";

export class TaskCache {
  async getTasks(userId: string): Promise<Task[] | null> {
    const data = await redisClient.get(`tasks:${userId}`);
    return data ? JSON.parse(data) : null;
  }

 async setTasks(userId: string, tasks: Task[]) {
    await redisClient.set(`tasks:${userId}`, JSON.stringify(tasks), "EX", 60);
  }

 async invalidate(userId: string) {
    await redisClient.del(`tasks:${userId}`);
  }
}
