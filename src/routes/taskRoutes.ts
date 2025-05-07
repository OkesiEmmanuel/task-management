// src/routes/taskRoutes.ts
import { Router } from "express";

import { Authenticate } from "../middlewares";
import { TaskController } from "../controllers.";

const router = Router();
const taskController = new TaskController();

router.use(Authenticate);  // Apply auth to all routes

router.post("/", taskController.create);
router.get("/", taskController.getAll.bind);
router.get("/:id", taskController.getOne.bind);
router.put("/:id", taskController.update.bind);
router.delete("/:id", taskController.delete.bind);

export default router;
