import { User } from "@prisma/client";

export default interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: Partial<User>): Promise<User>;
}
