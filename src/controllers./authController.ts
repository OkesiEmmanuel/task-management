import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { AuthService } from "../services";

const authService = new AuthService(new UserRepository());

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

export const AuthController = {
  /**
   * @swagger
   * /api/v1/auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 format: password
   *     responses:
   *       201:
   *         description: User created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 email:
   *                   type: string
   *       400:
   *         description: Bad request
   */
  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await authService.register(email, password);
      res.status(201).json({ id: user.id, email: user.email });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  /**
   * @swagger
   * /api/v1/auth/login:
   *   post:
   *     summary: Log in a user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Authenticated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *       400:
   *         description: Invalid credentials
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { token } = await authService.login(email, password);
      res.json({ token });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
};
