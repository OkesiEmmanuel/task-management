
import { Task } from "@prisma/client";
import { TaskRepository } from "../repositories";
import { TaskCache } from "../infrastructure/redis";
import { emitToUser } from "../infrastructure/websocket/socket.emitter";

export class TaskService {
  constructor(
    private readonly taskRepo: TaskRepository,
    private readonly redisCache: TaskCache,
  ) {}

  async createTask(data: Partial<Task>): Promise<Task> {
    if(!data) throw new Error("Invalid data"); 

    const newTask = await this.taskRepo.create(data);

    if(!newTask) throw new Error("Error creating task");
    await this.redisCache.setTasks(newTask.userId, [newTask]);

     // Emit the event to the user
     emitToUser(newTask.userId, "taskCreated", newTask);
     
    return newTask;
  }

  async getAllTasks(userId: string): Promise<Task[]> {
    if(!userId) throw new Error("Invalid userId");
    //check redis if data is already there
    let allTasks = await this.redisCache.getTasks(userId);
    if(allTasks) return allTasks;
    //if not found in cache, get from db
    allTasks = await this.taskRepo.findAll(userId);
    return allTasks;
  }

  async getTaskById(id: string): Promise<Task | null> {
    if(!id) throw new Error("Invalid id");
   
    const task = await this.taskRepo.findById(id);

    return task;
  }

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    if(!id || !data) throw new Error("Invalid data");
    //update data and cache to redis
    const updatedTask = await this.taskRepo.update(id, data);
    // cache upadated task
    await this.redisCache.setTasks(updatedTask.userId, [updatedTask]);

    // Emit the event to the user
    emitToUser(updatedTask.userId, "taskUpdated", updatedTask);
    
    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    if(!id) throw new Error("Invalid id");
  
    const foundTask = await this.taskRepo.findById(id);
    if(!foundTask) throw new Error("Task not found");

    const deleted = await this.taskRepo.delete(foundTask.id);
    // invalidate cache
    await this.redisCache.invalidate(foundTask.id);

    // Emit the event to the user
    emitToUser(foundTask.userId, "taskDeleted", foundTask);
  
    return deleted;
  }
}
