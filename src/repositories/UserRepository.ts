import { PrismaClient, User } from "@prisma/client";
import { IUserRepository } from "../interfaces";

const prisma = new PrismaClient();

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(user: Partial<User>): Promise<User> {
    return prisma.user.create({ data: user as User });
  }
}
