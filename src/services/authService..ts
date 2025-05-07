
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { UserRepository } from "../repositories";

export class AuthService {
  constructor(private userRepo: UserRepository) {}

  async register(email: string, password: string): Promise<User> {
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) throw new Error("Email already in use");

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userRepo.create({ email, password: hashedPassword });
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return { token };
  }
}
