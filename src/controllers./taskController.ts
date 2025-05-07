import { Request, Response } from "express";
import { TaskService } from "../services/taskService";
import { TaskRepository } from "../repositories";
import { TaskCache } from "../infrastructure/redis";
import { StatusCodes } from "http-status-codes";

export class TaskController {
  private taskService: TaskService;

  constructor() {
    const taskRepo = new TaskRepository();
    const redisCache = new TaskCache();
    this.taskService = new TaskService(taskRepo, redisCache);
  }

  /**
   * @swagger
   * /api/v1/tasks:
   *   post:
   *     summary: Create a new task
   *     tags:
   *       - Tasks
   *     requestBody:
   *       description: Task details to create a new task
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userId:
   *                 type: string
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *     responses:
   *       201:
   *         description: Task created successfully
   *       400:
   *         description: Invalid input
   *       500:
   *         description: Internal server error
   */
  async create(req: Request, res: Response) {
    try {
      const newTask = await this.taskService.createTask(req.body);
      res.status(StatusCodes.CREATED).json(newTask);
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  /**
   * @swagger
   * /api/v1/tasks/{id}:
   *   get:
   *     summary: Get a task by ID
   *     tags:
   *       - Tasks
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The ID of the task
   *     responses:
   *       200:
   *         description: Task found
   *       404:
   *         description: Task not found
   *       500:
   *         description: Internal server error
   */
  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id; // Access the user ID from req.user
      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "User not authenticated" });
      }

      const task = await this.taskService.getTaskById(id);
      if (!task) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Task not found" });
      }

      res.status(StatusCodes.OK).json(task);
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  /**
   * @swagger
   * /api/v1/tasks:
   *   get:
   *     summary: Get all tasks for a user
   *     tags:
   *       - Tasks
   *     parameters:
   *       - in: query
   *         name: userId
   *         required: true
   *         description: The ID of the user
   *     responses:
   *       200:
   *         description: List of tasks
   *       400:
   *         description: Invalid userId
   *       500:
   *         description: Internal server error
   */
  async getAll(req: Request, res: Response) {
    try {
      const userId = req.user?.id; // Access userId from the req.user object
      if (!userId) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "userId is required" });
      }

      const tasks = await this.taskService.getAllTasks(userId);
      res.status(StatusCodes.OK).json(tasks);
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  /**
   * @swagger
   * /api/v1/tasks/{id}:
   *   put:
   *     summary: Update a task by ID
   *     tags:
   *       - Tasks
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The ID of the task to update
   *     requestBody:
   *       description: Task data to update
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *     responses:
   *       200:
   *         description: Task updated
   *       400:
   *         description: Invalid data
   *       404:
   *         description: Task not found
   *       500:
   *         description: Internal server error
   */
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id; // Access the user ID from req.user
      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "User not authenticated" });
      }
      const updatedTask = await this.taskService.updateTask(id, { ...req.body, userId });
      res.status(StatusCodes.OK).json(updatedTask);
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  /**
   * @swagger
   * /api/v1/tasks/{id}:
   *   delete:
   *     summary: Delete a task by ID
   *     tags:
   *       - Tasks
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The ID of the task to delete
   *     responses:
   *       200:
   *         description: Task deleted
   *       404:
   *         description: Task not found
   *       500:
   *         description: Internal server error
   */
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id; // Access the user ID from req.user
      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "User not authenticated" });
      }

      await this.taskService.deleteTask(id);
      res.status(StatusCodes.OK).json({ message: "Task deleted" });
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }
}
